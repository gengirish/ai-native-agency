const { query } = require('../../db/connection');
const { ValidationError, NotFoundError } = require('../utils/errors');

const ALLOWED_TEMPLATE_UPDATES = new Set([
  'name',
  'project_type',
  'brief_template',
  'pipeline_config',
  'prompt_templates',
  'is_public',
]);

function mapTemplateUpdates(updates) {
  const keyMap = {
    projectType: 'project_type',
    briefTemplate: 'brief_template',
    pipelineConfig: 'pipeline_config',
    promptTemplates: 'prompt_templates',
    isPublic: 'is_public',
  };
  const out = {};
  for (const [key, value] of Object.entries(updates || {})) {
    const col = keyMap[key] || key;
    if (ALLOWED_TEMPLATE_UPDATES.has(col)) {
      out[col] = value;
    }
  }
  return out;
}

async function createTemplate(payload) {
  const {
    name,
    projectType,
    briefTemplate = {},
    pipelineConfig = {},
    promptTemplates = {},
    createdBy,
  } = payload || {};

  if (!name || !projectType) {
    throw new ValidationError('name and projectType are required');
  }

  const { rows } = await query(
    `
    INSERT INTO templates (
      name, project_type, brief_template, pipeline_config, prompt_templates, created_by
    )
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6)
    RETURNING *
    `,
    [
      name,
      projectType,
      JSON.stringify(briefTemplate),
      JSON.stringify(pipelineConfig),
      JSON.stringify(promptTemplates),
      createdBy ?? null,
    ]
  );
  return rows[0];
}

async function getTemplate(templateId) {
  const { rows } = await query(`SELECT * FROM templates WHERE id = $1`, [templateId]);
  if (!rows[0]) {
    throw new NotFoundError('Template not found');
  }
  return rows[0];
}

async function listTemplates(filters = {}) {
  const projectType = filters.projectType;
  const isPublic = filters.isPublic;
  const page = Math.max(1, parseInt(String(filters.page || 1), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(filters.limit || 20), 10) || 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];
  let i = 1;

  if (projectType != null && projectType !== '') {
    conditions.push(`project_type = $${i++}`);
    params.push(projectType);
  }
  if (isPublic === true || isPublic === false || isPublic === 'true' || isPublic === 'false') {
    conditions.push(`is_public = $${i++}`);
    params.push(isPublic === true || isPublic === 'true');
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*)::int AS total FROM templates ${where}`;
  const { rows: countRows } = await query(countSql, [...params]);

  const listSql = `
    SELECT * FROM templates
    ${where}
    ORDER BY updated_at DESC NULLS LAST, created_at DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;
  params.push(limit, offset);
  const { rows } = await query(listSql, params);

  return {
    data: rows,
    page,
    limit,
    total: countRows[0]?.total ?? 0,
  };
}

async function updateTemplate(templateId, updates) {
  await getTemplate(templateId);
  const cols = mapTemplateUpdates(updates);
  const keys = Object.keys(cols);
  if (keys.length === 0) {
    throw new ValidationError('No valid fields to update');
  }

  const setParts = [];
  const params = [];
  let idx = 1;
  for (const col of keys) {
    const val = cols[col];
    if (['brief_template', 'pipeline_config', 'prompt_templates'].includes(col)) {
      setParts.push(`${col} = $${idx}::jsonb`);
      params.push(JSON.stringify(val));
    } else {
      setParts.push(`${col} = $${idx}`);
      params.push(val);
    }
    idx += 1;
  }
  setParts.push(`updated_at = now()`);
  params.push(templateId);

  const sql = `
    UPDATE templates
    SET ${setParts.join(', ')}
    WHERE id = $${idx}
    RETURNING *
  `;
  const { rows } = await query(sql, params);
  return rows[0];
}

async function incrementUsage(templateId) {
  const { rows } = await query(
    `
    UPDATE templates
    SET usage_count = usage_count + 1, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [templateId]
  );
  if (!rows[0]) {
    throw new NotFoundError('Template not found');
  }
  return rows[0];
}

async function updateQualityScore(templateId, newScore) {
  const num = Number(newScore);
  if (Number.isNaN(num)) {
    throw new ValidationError('newScore must be a number');
  }

  const template = await getTemplate(templateId);
  const n = template.usage_count || 0;
  const prevAvg = template.avg_quality_score != null ? Number(template.avg_quality_score) : null;

  let nextAvg;
  if (n === 0 || prevAvg == null) {
    nextAvg = num;
  } else {
    nextAvg = (prevAvg * n + num) / (n + 1);
  }

  const { rows } = await query(
    `
    UPDATE templates
    SET avg_quality_score = $2, updated_at = now()
    WHERE id = $1
    RETURNING *
    `,
    [templateId, nextAvg]
  );
  return rows[0];
}

async function findBestTemplate(projectType) {
  if (!projectType) {
    throw new ValidationError('projectType is required');
  }
  const { rows } = await query(
    `
    SELECT *
    FROM templates
    WHERE project_type = $1
    ORDER BY avg_quality_score DESC NULLS LAST, usage_count DESC
    LIMIT 1
    `,
    [projectType]
  );
  if (!rows[0]) {
    throw new NotFoundError('No template found for this project type');
  }
  return rows[0];
}

function getDefaultTemplates() {
  return [
    {
      id: null,
      name: 'Design system sprint',
      project_type: 'design',
      brief_template: {
        sections: ['goals', 'brand_constraints', 'deliverables', 'references'],
        defaults: { format: 'Figma + export' },
      },
      pipeline_config: { stages: ['research', 'concepts', 'refine', 'handoff'] },
      prompt_templates: {
        system: 'You are a senior product designer. Respect brand tokens and accessibility.',
      },
      usage_count: 0,
      avg_quality_score: null,
      is_public: true,
      seed: true,
    },
    {
      id: null,
      name: 'Content package',
      project_type: 'content',
      brief_template: {
        sections: ['audience', 'channels', 'voice', 'seo_keywords'],
        defaults: { length: 'medium' },
      },
      pipeline_config: { stages: ['outline', 'draft', 'edit', 'qa'] },
      prompt_templates: {
        system: 'You are an editorial lead. Match tone and reading level to the brief.',
      },
      usage_count: 0,
      avg_quality_score: null,
      is_public: true,
      seed: true,
    },
    {
      id: null,
      name: 'Paid social ad copy',
      project_type: 'ad_copy',
      brief_template: {
        sections: ['product', 'offer', 'platforms', 'compliance'],
        defaults: { variants: 3 },
      },
      pipeline_config: { stages: ['angles', 'copy', 'variants', 'compliance_check'] },
      prompt_templates: {
        system: 'You are a performance marketer. Write concise, compliant ad copy.',
      },
      usage_count: 0,
      avg_quality_score: null,
      is_public: true,
      seed: true,
    },
  ];
}

module.exports = {
  createTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
  incrementUsage,
  updateQualityScore,
  findBestTemplate,
  getDefaultTemplates,
};
