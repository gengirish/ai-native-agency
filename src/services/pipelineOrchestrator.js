const { query, getClient } = require('../../db/connection');
const { NotFoundError, ValidationError } = require('../utils/errors');
const aiGateway = require('./aiGateway');
const taskDecomposer = require('./taskDecomposer');
const modelRouter = require('./modelRouter');
const qaService = require('./qaService');

function fillTemplate(template, placeholders) {
  let out = template;
  for (const [key, val] of Object.entries(placeholders)) {
    const re = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    out = out.replace(re, String(val ?? ''));
  }
  return out;
}

function briefBasePlaceholders(brief) {
  const content = brief.content && typeof brief.content === 'object' ? brief.content : {};
  const summary =
    typeof content.summary === 'string'
      ? content.summary
      : typeof content.description === 'string'
        ? content.description
        : JSON.stringify(content).slice(0, 500);

  return {
    brief_content: JSON.stringify(content),
    brief_summary: summary,
    target_audience: brief.target_audience || 'general',
    tone: brief.tone || 'professional',
    additional_notes: brief.additional_notes || '',
    reference_urls: (brief.reference_urls || []).join(', '),
  };
}

function textFromStoredOutput(stored) {
  if (!stored) return '';
  if (typeof stored.content === 'string') return stored.content;
  if (typeof stored.text === 'string') return stored.text;
  return '';
}

function buildPlaceholders(brief, outputsByTaskType) {
  const base = briefBasePlaceholders(brief);
  const palette = outputsByTaskType.generate_color_palette;
  const logo = outputsByTaskType.generate_logo;
  const social = outputsByTaskType.generate_social_graphics;
  const card = outputsByTaskType.generate_business_card;

  const pj = textFromStoredOutput(palette);
  return {
    ...base,
    color_palette_json: pj || '(pending)',
    color_palette_hint: pj ? pj.slice(0, 400) : 'Use a modern, accessible palette aligned to the brief.',
    logo_url: logo?.imageUrl || '(pending)',
    logo_direction: logo?.imageUrl
      ? 'Logo generated; keep visual system consistent with that mark.'
      : 'Logo direction to be defined from brief.',
    social_url: social?.imageUrl || '(pending)',
    card_url: card?.imageUrl || '(pending)',
    research_json: textFromStoredOutput(outputsByTaskType.research_topic) || '(pending)',
    outline_text: textFromStoredOutput(outputsByTaskType.create_outline) || '(pending)',
    draft_text: textFromStoredOutput(outputsByTaskType.write_draft) || '(pending)',
    body_copy: textFromStoredOutput(outputsByTaskType.write_body_copy) || '(pending)',
    headlines_text: textFromStoredOutput(outputsByTaskType.generate_headlines) || '(pending)',
    audience_json: textFromStoredOutput(outputsByTaskType.audience_analysis) || '(pending)',
  };
}

async function runAiCall(taskType, route, filledPrompt, taskRow) {
  const modality = taskRow.input_data?.config?.modality || 'text';

  if (modality === 'image') {
    const img = await aiGateway.generateImage(route.provider, filledPrompt, {
      model: route.model,
      quality: 'standard',
    });
    return {
      outputPayload: {
        modality: 'image',
        imageUrl: img.imageUrl,
        content: img.imageUrl,
      },
      inputTokens: 0,
      outputTokens: 0,
      costCents: img.costCents,
      latencyMs: img.latencyMs,
      requestType: 'image_generation',
      routeUsed: route,
    };
  }

  const messages = [
    { role: 'system', content: 'You are an expert assistant for a creative agency. Follow instructions precisely.' },
    { role: 'user', content: filledPrompt },
  ];

  let routeUsed = route;
  let result;
  try {
    result = await aiGateway.chat(route.provider, route.model, messages, {
      maxTokens: route.maxTokens,
      temperature: route.temperature,
    });
  } catch {
    const fb = modelRouter.getFallback(route.provider, route.model);
    routeUsed = { ...route, ...fb };
    result = await aiGateway.chat(fb.provider, fb.model, messages, {
      maxTokens: route.maxTokens,
      temperature: route.temperature,
    });
  }

  return {
    outputPayload: {
      modality: 'text',
      content: result.content,
    },
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
    costCents: result.costCents,
    latencyMs: result.latencyMs,
    requestType: 'chat',
    routeUsed,
  };
}

async function loadOutputsByTaskType(pipelineRunId) {
  const tr = await query(
    `SELECT task_type, output_data, status FROM pipeline_tasks WHERE pipeline_run_id = $1`,
    [pipelineRunId]
  );
  const outputsByTaskType = {};
  for (const row of tr.rows) {
    if (row.status === 'completed' && row.output_data && Object.keys(row.output_data).length > 0) {
      outputsByTaskType[row.task_type] = row.output_data;
    }
  }
  return outputsByTaskType;
}

const pipelineOrchestrator = {
  async executeTask(taskRow, pipelineContext) {
    const { brief, projectId, tenantId, tier, outputsByTaskType } = pipelineContext;
    const route = modelRouter.route(taskRow.task_type, { tier });
    const placeholders = buildPlaceholders(brief, outputsByTaskType);
    const template = taskRow.input_data?.config?.promptTemplate || '';
    const filledPrompt = fillTemplate(template, placeholders);

    const started = Date.now();
    const ai = await runAiCall(taskRow.task_type, route, filledPrompt, taskRow);

    await aiGateway.logCost(
      taskRow.id,
      projectId,
      tenantId,
      ai.routeUsed.provider,
      ai.routeUsed.model,
      ai.inputTokens,
      ai.outputTokens,
      ai.costCents,
      ai.latencyMs,
      ai.requestType
    );

    const qa = qaService.validateOutput(taskRow.task_type, ai.outputPayload, brief);
    const output_data = {
      ...ai.outputPayload,
      qa,
    };

    return {
      output: output_data,
      costCents: ai.costCents,
      tokensUsed: ai.inputTokens + ai.outputTokens,
      latencyMs: Date.now() - started,
      filledPrompt,
      route: ai.routeUsed,
    };
  },

  async executePendingWaves(pipelineRunId, brief, projectId, tenantId, tier) {
    let waveCost = 0;

    while (true) {
      const outputsByTaskType = await loadOutputsByTaskType(pipelineRunId);
      const curRes = await query(
        `SELECT * FROM pipeline_tasks WHERE pipeline_run_id = $1 ORDER BY sort_order ASC`,
        [pipelineRunId]
      );
      const curTasks = curRes.rows;

      const completedIds = new Set(curTasks.filter((t) => t.status === 'completed').map((t) => t.id));
      const pending = curTasks.filter((t) => t.status === 'pending');
      if (pending.length === 0) break;

      const runnable = pending.filter((t) => (t.depends_on || []).every((id) => completedIds.has(id)));
      if (runnable.length === 0) {
        throw new Error(
          'Pipeline blocked: pending tasks remain but dependencies are not satisfied (check failed upstream tasks)'
        );
      }

      const pipelineContext = {
        brief,
        projectId,
        tenantId,
        tier,
        outputsByTaskType,
        pipelineRunId,
      };

      for (const t of runnable) {
        const taskRow = { ...t };
        await query(
          `UPDATE pipeline_tasks SET status = 'running', started_at = now(), attempts = attempts + 1 WHERE id = $1`,
          [t.id]
        );

        try {
          const exec = await this.executeTask(taskRow, pipelineContext);
          waveCost += exec.costCents;

          await query(
            `UPDATE pipeline_tasks SET
              status = 'completed',
              completed_at = now(),
              prompt = $2,
              output_data = $3::jsonb,
              cost_cents = cost_cents + $4,
              tokens_used = tokens_used + $5,
              latency_ms = $6,
              model_provider = $7,
              model_name = $8,
              error_message = NULL
            WHERE id = $1`,
            [
              t.id,
              exec.filledPrompt,
              exec.output,
              exec.costCents,
              exec.tokensUsed,
              exec.latencyMs,
              exec.route.provider,
              exec.route.model,
            ]
          );
        } catch (err) {
          const msg = err.message || String(err);
          await query(
            `UPDATE pipeline_tasks SET status = 'failed', completed_at = now(), error_message = $2 WHERE id = $1`,
            [t.id, msg]
          );
          throw err;
        }
      }
    }

    return waveCost;
  },

  async runPipeline(projectId, briefId, tenantId, options = {}) {
    const tier = options.tier;

    const briefRes = await query(
      `SELECT b.* FROM briefs b
       INNER JOIN projects p ON p.id = b.project_id
       WHERE b.id = $1 AND b.project_id = $2 AND p.tenant_id = $3`,
      [briefId, projectId, tenantId]
    );
    if (briefRes.rows.length === 0) {
      throw new NotFoundError('Brief not found for this project and tenant');
    }
    const brief = briefRes.rows[0];

    const definitions = taskDecomposer.decompose(brief);
    if (definitions.length === 0) {
      throw new ValidationError(`No pipeline definition for brief_type: ${brief.brief_type || 'unknown'}`);
    }

    const client = await getClient();
    let pipelineRunId;

    try {
      await client.query('BEGIN');

      const runInsert = await client.query(
        `INSERT INTO pipeline_runs (project_id, brief_id, status, started_at, total_cost_cents, metadata)
         VALUES ($1, $2, 'running', now(), 0, $3::jsonb)
         RETURNING id`,
        [projectId, briefId, { tier: tier || 'standard', brief_type: brief.brief_type }]
      );
      pipelineRunId = runInsert.rows[0].id;

      const idBySortOrder = new Map();
      for (const def of definitions) {
        const r = modelRouter.route(def.taskType, { tier });
        const input_data = {
          config: def.config,
          briefSnapshot: {
            brief_type: brief.brief_type,
            target_audience: brief.target_audience,
            tone: brief.tone,
          },
        };
        const tIns = await client.query(
          `INSERT INTO pipeline_tasks (
            pipeline_run_id, task_type, prompt, input_data, status, sort_order, depends_on,
            model_provider, model_name, max_attempts
          ) VALUES ($1, $2, $3, $4::jsonb, 'pending', $5, '{}', $6, $7, 3)
          RETURNING id`,
          [pipelineRunId, def.taskType, def.config.promptTemplate, input_data, def.sortOrder, r.provider, r.model]
        );
        idBySortOrder.set(def.sortOrder, tIns.rows[0].id);
      }

      for (const def of definitions) {
        const depIds = (def.dependsOn || [])
          .map((ord) => idBySortOrder.get(ord))
          .filter(Boolean);
        await client.query(`UPDATE pipeline_tasks SET depends_on = $1::uuid[] WHERE id = $2`, [
          depIds,
          idBySortOrder.get(def.sortOrder),
        ]);
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    try {
      await this.executePendingWaves(pipelineRunId, brief, projectId, tenantId, tier);

      const sumRes = await query(
        `SELECT COALESCE(SUM(cost_cents), 0) AS s FROM pipeline_tasks WHERE pipeline_run_id = $1`,
        [pipelineRunId]
      );
      const sumCost = Number(sumRes.rows[0].s);

      await query(
        `UPDATE pipeline_runs SET status = 'completed', completed_at = now(), total_cost_cents = $2, error_message = NULL WHERE id = $1`,
        [pipelineRunId, sumCost]
      );
      await query(`UPDATE projects SET ai_cost_cents = ai_cost_cents + $2, updated_at = now() WHERE id = $1`, [
        projectId,
        sumCost,
      ]);

      return await this.getPipelineStatus(pipelineRunId);
    } catch (err) {
      const msg = err.message || String(err);
      const sumRes = await query(
        `SELECT COALESCE(SUM(cost_cents), 0) AS s FROM pipeline_tasks WHERE pipeline_run_id = $1`,
        [pipelineRunId]
      );
      const spent = Number(sumRes.rows[0].s);
      await query(
        `UPDATE pipeline_runs SET status = 'failed', completed_at = now(), error_message = $2, total_cost_cents = $3 WHERE id = $1`,
        [pipelineRunId, msg, spent]
      );
      throw err;
    }
  },

  async getPipelineStatus(pipelineRunId) {
    const runRes = await query(`SELECT * FROM pipeline_runs WHERE id = $1`, [pipelineRunId]);
    if (runRes.rows.length === 0) {
      throw new NotFoundError('Pipeline run not found');
    }
    const tasksRes = await query(
      `SELECT * FROM pipeline_tasks WHERE pipeline_run_id = $1 ORDER BY sort_order ASC`,
      [pipelineRunId]
    );
    return {
      run: runRes.rows[0],
      tasks: tasksRes.rows,
    };
  },

  async retryFailedTasks(pipelineRunId) {
    const status = await this.getPipelineStatus(pipelineRunId);
    const { run, tasks } = status;

    const briefRes = await query(`SELECT * FROM briefs WHERE id = $1`, [run.brief_id]);
    const brief = briefRes.rows[0];
    if (!brief) throw new NotFoundError('Brief not found for pipeline run');

    const retriable = tasks.filter((t) => t.status === 'failed' && t.attempts < t.max_attempts);
    if (retriable.length === 0) {
      return status;
    }

    for (const t of retriable) {
      await query(`UPDATE pipeline_tasks SET status = 'pending', error_message = NULL WHERE id = $1`, [t.id]);
    }

    await query(`UPDATE pipeline_runs SET status = 'running', error_message = NULL, completed_at = NULL WHERE id = $1`, [
      pipelineRunId,
    ]);

    const tier = run.metadata?.tier;

    try {
      const totalCost = await this.executePendingWaves(pipelineRunId, brief, run.project_id, brief.tenant_id, tier);

      const sumRes = await query(
        `SELECT COALESCE(SUM(cost_cents), 0) AS s FROM pipeline_tasks WHERE pipeline_run_id = $1`,
        [pipelineRunId]
      );
      const sumCost = Number(sumRes.rows[0].s);

      const anyFailed = (
        await query(`SELECT 1 FROM pipeline_tasks WHERE pipeline_run_id = $1 AND status = 'failed' LIMIT 1`, [
          pipelineRunId,
        ])
      ).rows.length > 0;

      if (totalCost > 0) {
        await query(`UPDATE projects SET ai_cost_cents = ai_cost_cents + $2, updated_at = now() WHERE id = $1`, [
          run.project_id,
          totalCost,
        ]);
      }

      if (anyFailed) {
        await query(`UPDATE pipeline_runs SET status = 'failed', completed_at = now(), total_cost_cents = $2 WHERE id = $1`, [
          pipelineRunId,
          sumCost,
        ]);
      } else {
        await query(
          `UPDATE pipeline_runs SET status = 'completed', completed_at = now(), total_cost_cents = $2 WHERE id = $1`,
          [pipelineRunId, sumCost]
        );
      }

      return await this.getPipelineStatus(pipelineRunId);
    } catch (err) {
      const msg = err.message || String(err);
      const sumRes = await query(
        `SELECT COALESCE(SUM(cost_cents), 0) AS s FROM pipeline_tasks WHERE pipeline_run_id = $1`,
        [pipelineRunId]
      );
      const spent = Number(sumRes.rows[0].s);
      await query(
        `UPDATE pipeline_runs SET status = 'failed', completed_at = now(), error_message = $2, total_cost_cents = $3 WHERE id = $1`,
        [pipelineRunId, msg, spent]
      );
      throw err;
    }
  },
};

module.exports = pipelineOrchestrator;
