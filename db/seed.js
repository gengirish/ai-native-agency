/**
 * Full demo seed aligned with src/lib/demo-data.ts (AgencyOS demo narrative).
 * Uses db/connection.js (pg + dotenv). Run: npm run db:seed
 */
const bcrypt = require('bcryptjs');
const { getClient, disconnect } = require('./connection');

// Deterministic UUIDs (demo tenant + users + entities)
const T = '00000000-0000-0000-0000-000000000001';
const U_PRIYA = '00000000-0000-0000-0000-000000000010';
const U_MAYA = '00000000-0000-0000-0000-000000000011';
const U_JORDAN = '00000000-0000-0000-0000-000000000012';
const U_SARAH = '00000000-0000-0000-0000-000000000013';

const BRAND_LUMEN = '00000000-0000-0000-0000-000000000020';
const BRAND_PULSE = '00000000-0000-0000-0000-000000000021';

const P_LUMEN = '00000000-0000-0000-0000-000000000101';
const P_PULSE = '00000000-0000-0000-0000-000000000102';
const P_NORTH = '00000000-0000-0000-0000-000000000103';
const P_VERTEX = '00000000-0000-0000-0000-000000000104';
const P_APEX = '00000000-0000-0000-0000-000000000105';
const P_KITE = '00000000-0000-0000-0000-000000000106';

const BRIEF_LUMEN = '00000000-0000-0000-0000-000000000201';
const BRIEF_PULSE = '00000000-0000-0000-0000-000000000202';

const PIPE_LUMEN = '00000000-0000-0000-0000-000000000301';
const PIPE_PULSE = '00000000-0000-0000-0000-000000000302';

const D_LUMEN = '00000000-0000-0000-0000-000000000401';
const D_PULSE = '00000000-0000-0000-0000-000000000402';
const D_NORTH = '00000000-0000-0000-0000-000000000403';
const D_VERTEX = '00000000-0000-0000-0000-000000000404';
const D_APEX = '00000000-0000-0000-0000-000000000405';

const REV_LUMEN = '00000000-0000-0000-0000-000000000501';
const REV_PULSE = '00000000-0000-0000-0000-000000000502';
const REV_VERTEX = '00000000-0000-0000-0000-000000000503';

const iso = (d) => new Date(d).toISOString();

function dollarsToCents(n) {
  return Math.round(Number(n) * 100);
}

function projectStatusToDb(status) {
  const map = {
    client_review: 'in_review',
    expert_review: 'in_review',
    qa_check: 'in_review',
    delivered: 'delivered',
    draft: 'draft',
  };
  return map[status] ?? 'in_review';
}

function projectPriorityToDb(p) {
  if (!p) return 'normal';
  if (p === 'medium') return 'normal';
  return p;
}

function deliverableStatusToDb(s) {
  if (s === 'review' || s === 'qa_check') return 'in_review';
  if (s === 'approved') return 'approved';
  if (s === 'draft') return 'draft';
  return 'in_review';
}

function reviewStatusToDb(s) {
  const map = {
    revision_requested: 'needs_revision',
    pending: 'pending',
    approved: 'approved',
  };
  return map[s] ?? 'pending';
}

function pipelineRunStatusToDb(s) {
  const map = { running: 'running', completed: 'completed' };
  return map[s] ?? 'pending';
}

function pipelineTaskStatusToDb(s) {
  const map = { completed: 'completed', running: 'running', queued: 'pending', failed: 'failed' };
  return map[s] ?? 'pending';
}

function taskCostCents(cost) {
  return Math.max(0, Math.round(Number(cost) * 100));
}

function deliverableMetadata(row) {
  return JSON.stringify({
    ai_model: row.aiModel,
    generation_cost: row.generationCost,
    generation_time: row.generationTime,
    quality_score: row.qualityScore,
  });
}

async function seed() {
  const passwordHash = bcrypt.hashSync('demo123', 10);
  const client = await getClient();

  const projects = [
    {
      id: P_LUMEN,
      title: 'Lumen Analytics — full rebrand',
      project_type: 'brand_identity',
      status: 'client_review',
      priority: 'high',
      brand_profile_id: BRAND_LUMEN,
      assigned_expert: U_MAYA,
      estimatedCost: 18500,
      aiCost: 4200,
      qualityScore: 8.7,
      dueDate: iso('2026-04-28'),
      createdAt: iso('2026-03-12'),
      updatedAt: iso('2026-04-10'),
      delivered_at: null,
    },
    {
      id: P_PULSE,
      title: 'Pulse Health — Q2 social motion kit',
      project_type: 'social_media',
      status: 'expert_review',
      priority: 'urgent',
      brand_profile_id: BRAND_PULSE,
      assigned_expert: U_JORDAN,
      estimatedCost: 12400,
      aiCost: 5100,
      qualityScore: 8.2,
      dueDate: iso('2026-04-18'),
      createdAt: iso('2026-03-28'),
      updatedAt: iso('2026-04-11'),
      delivered_at: null,
    },
    {
      id: P_NORTH,
      title: 'Northwind — performance creative A/B',
      project_type: 'ad_creative',
      status: 'qa_check',
      priority: 'high',
      brand_profile_id: null,
      assigned_expert: null,
      estimatedCost: 8900,
      aiCost: 3800,
      qualityScore: 8.4,
      dueDate: iso('2026-04-22'),
      createdAt: iso('2026-04-02'),
      updatedAt: iso('2026-04-09'),
      delivered_at: null,
    },
    {
      id: P_VERTEX,
      title: 'Vertex Labs — investor one-pager + deck',
      project_type: 'marketing_collateral',
      status: 'delivered',
      priority: 'medium',
      brand_profile_id: null,
      assigned_expert: null,
      estimatedCost: 6200,
      aiCost: 2100,
      qualityScore: 9.1,
      dueDate: iso('2026-04-05'),
      createdAt: iso('2026-03-01'),
      updatedAt: iso('2026-04-04'),
      delivered_at: iso('2026-04-04'),
    },
    {
      id: P_APEX,
      title: 'Apex Freight — logo refinement',
      project_type: 'logo_design',
      status: 'qa_check',
      priority: 'medium',
      brand_profile_id: null,
      assigned_expert: null,
      estimatedCost: 4500,
      aiCost: 800,
      qualityScore: 7.8,
      dueDate: iso('2026-04-30'),
      createdAt: iso('2026-04-08'),
      updatedAt: iso('2026-04-12'),
      delivered_at: null,
    },
    {
      id: P_KITE,
      title: 'Kite Bank — lifecycle email series',
      project_type: 'email_campaign',
      status: 'draft',
      priority: 'low',
      brand_profile_id: null,
      assigned_expert: null,
      estimatedCost: 7200,
      aiCost: 0,
      qualityScore: 0,
      dueDate: iso('2026-05-15'),
      createdAt: iso('2026-04-10'),
      updatedAt: iso('2026-04-10'),
      delivered_at: null,
    },
  ];

  const deliverables = [
    {
      id: D_LUMEN,
      project_id: P_LUMEN,
      version: 3,
      title: 'Brand guidelines — digital',
      file_type: 'PDF',
      file_url: 'https://placehold.co/1200x800/4f46e5/ffffff/png?text=Lumen+Guidelines',
      thumbnail_url: 'https://placehold.co/400x300/4f46e5/ffffff/png?text=Guidelines',
      status: 'review',
      aiModel: 'claude-3.5-sonnet',
      generationCost: 42,
      generationTime: 118,
      qualityScore: 8.7,
      createdAt: iso('2026-04-09'),
    },
    {
      id: D_PULSE,
      project_id: P_PULSE,
      version: 2,
      title: 'IG Reels batch — week 1',
      file_type: 'MP4 bundle',
      file_url: 'https://placehold.co/1080x1920/0ea5e9/ffffff/png?text=Reels',
      thumbnail_url: 'https://placehold.co/400x300/0ea5e9/ffffff/png?text=Reels',
      status: 'qa_check',
      aiModel: 'runway-gen3',
      generationCost: 128,
      generationTime: 420,
      qualityScore: 8.2,
      createdAt: iso('2026-04-10'),
    },
    {
      id: D_NORTH,
      project_id: P_NORTH,
      version: 1,
      title: 'Meta carousel — variant B',
      file_type: 'PNG set',
      file_url: 'https://placehold.co/1080x1080/f97316/ffffff/png?text=Carousel+B',
      thumbnail_url: 'https://placehold.co/400x300/f97316/ffffff/png?text=Ads',
      status: 'qa_check',
      aiModel: 'flux-pro',
      generationCost: 18,
      generationTime: 64,
      qualityScore: 8.4,
      createdAt: iso('2026-04-08'),
    },
    {
      id: D_VERTEX,
      project_id: P_VERTEX,
      version: 1,
      title: 'One-pager — Series B',
      file_type: 'PDF',
      file_url: 'https://placehold.co/1200x800/10b981/ffffff/png?text=One-pager',
      thumbnail_url: 'https://placehold.co/400x300/10b981/ffffff/png?text=PDF',
      status: 'approved',
      aiModel: 'claude-3.5-sonnet',
      generationCost: 22,
      generationTime: 95,
      qualityScore: 9.1,
      createdAt: iso('2026-04-03'),
    },
    {
      id: D_APEX,
      project_id: P_APEX,
      version: 1,
      title: 'Apex Freight — logo refinement — AI Draft',
      file_type: 'logo_design',
      file_url: 'https://placehold.co/1x1/e2e8f0/64748b/png?text=Draft',
      thumbnail_url: '',
      status: 'qa_check',
      aiModel: 'anthropic/claude-sonnet-4',
      generationCost: 0.0084,
      generationTime: 6420,
      qualityScore: 0.85,
      createdAt: iso('2026-04-12'),
    },
  ];

  const reviews = [
    {
      id: REV_LUMEN,
      project_id: P_LUMEN,
      deliverable_id: D_LUMEN,
      expert_id: U_SARAH,
      status: 'revision_requested',
      rating: 4,
      timeSpent: 18,
      createdAt: iso('2026-04-10'),
      refinements: [
        {
          id: 'cm1',
          author: 'Sarah Chen',
          authorRole: 'client',
          content: 'Love the palette shift. Can we tighten typography scale on slide 4?',
          createdAt: iso('2026-04-10'),
        },
        {
          id: 'cm2',
          author: 'Maya Okonkwo',
          authorRole: 'expert',
          content: 'Captured — regenerating headings with tighter scale tokens.',
          createdAt: iso('2026-04-10'),
        },
      ],
    },
    {
      id: REV_PULSE,
      project_id: P_PULSE,
      deliverable_id: D_PULSE,
      expert_id: U_JORDAN,
      status: 'pending',
      rating: 0,
      timeSpent: 0,
      createdAt: iso('2026-04-11'),
      refinements: [],
    },
    {
      id: REV_VERTEX,
      project_id: P_VERTEX,
      deliverable_id: D_VERTEX,
      expert_id: U_MAYA,
      status: 'approved',
      rating: 5,
      timeSpent: 24,
      createdAt: iso('2026-04-04'),
      refinements: [
        {
          id: 'cm3',
          author: 'Maya Okonkwo',
          authorRole: 'expert',
          content: 'Clean narrative arc; numbers footnotes verified against data room.',
          createdAt: iso('2026-04-04'),
        },
      ],
    },
  ];

  try {
    await client.query('BEGIN');

    // Remove projects first so expert_reviews (FK to users) is cleared before users are deleted.
    const existingTenant = await client.query(
      `SELECT id FROM tenants WHERE slug = 'demo-agency' LIMIT 1`,
    );
    if (existingTenant.rows.length) {
      const tid = existingTenant.rows[0].id;
      const demoUsers = await client.query(`SELECT id FROM users WHERE tenant_id = $1`, [tid]);
      const userIds = demoUsers.rows.map((r) => r.id);
      if (userIds.length) {
        await client.query(`DELETE FROM expert_reviews WHERE expert_id = ANY($1::uuid[])`, [userIds]);
        await client.query(`DELETE FROM client_feedback WHERE user_id = ANY($1::uuid[])`, [userIds]);
        await client.query(`DELETE FROM expert_assignments WHERE expert_id = ANY($1::uuid[])`, [userIds]);
      }
      await client.query(`DELETE FROM projects WHERE tenant_id = $1`, [tid]);
      await client.query(`DELETE FROM tenants WHERE id = $1`, [tid]);
    }

    const slaTiers = [
      ['starter', 72, 240, 48, 2, 500, 5],
      ['professional', 48, 168, 24, 4, 2000, 10],
      ['enterprise', 24, 120, 12, 8, 10000, 15],
    ];
    for (const row of slaTiers) {
      await client.query(
        `INSERT INTO sla_tiers (tier, first_draft_hours, final_delivery_hours, revision_turnaround_hours, max_revisions, guaranteed_credits, penalty_percent)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (tier) DO UPDATE SET
           first_draft_hours = EXCLUDED.first_draft_hours,
           final_delivery_hours = EXCLUDED.final_delivery_hours,
           revision_turnaround_hours = EXCLUDED.revision_turnaround_hours,
           max_revisions = EXCLUDED.max_revisions,
           guaranteed_credits = EXCLUDED.guaranteed_credits,
           penalty_percent = EXCLUDED.penalty_percent`,
        row,
      );
    }

    const creditPacks = [
      ['00000000-0000-0000-0000-000000000601', 'Starter', 500, 49900, 1.0, false, ['Email support', 'Standard SLA']],
      ['00000000-0000-0000-0000-000000000602', 'Growth', 2000, 159900, 0.8, true, ['Priority routing', 'Pro SLA', 'Expert escalation']],
      ['00000000-0000-0000-0000-000000000603', 'Scale', 10000, 699900, 0.7, false, ['Dedicated CSM', 'Enterprise SLA', 'Custom integrations']],
    ];
    for (const [id, name, credits, priceCents, ppc, popular, features] of creditPacks) {
      await client.query(
        `INSERT INTO credit_packs (id, name, credits, price_cents, price_per_credit, popular, features)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, credits = EXCLUDED.credits, price_cents = EXCLUDED.price_cents,
           price_per_credit = EXCLUDED.price_per_credit, popular = EXCLUDED.popular, features = EXCLUDED.features`,
        [id, name, credits, priceCents, ppc, popular, features],
      );
    }

    await client.query(
      `INSERT INTO tenants (id, name, slug, plan, status)
       VALUES ($1, 'Demo Agency', 'demo-agency', 'professional', 'active')`,
      [T],
    );

    const users = [
      [U_PRIYA, 'admin@agencyos.demo', 'Priya Kapoor', 'admin', []],
      [U_MAYA, 'maya@agencyos.demo', 'Maya Okonkwo', 'expert', ['Brand & Identity Design']],
      [U_JORDAN, 'jordan@agencyos.demo', 'Jordan Lee', 'expert', ['Motion & Social Media']],
      [U_SARAH, 'sarah@agencyos.demo', 'Sarah Chen', 'client', []],
    ];
    for (const [id, email, name, role, specialties] of users) {
      await client.query(
        `INSERT INTO users (id, tenant_id, email, name, role, password_hash, specialties, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')`,
        [id, T, email, name, role, passwordHash, specialties],
      );
    }

    const brandLumenGuidelines = JSON.stringify({
      websiteUrl: 'https://lumenanalytics.example',
      values: ['Trust', 'Velocity', 'Transparency'],
      competitors: ['Mixpanel', 'Amplitude'],
      dnaScore: 0.91,
      projectsCompleted: 6,
      lastUpdated: iso('2026-04-10'),
    });
    const brandPulseGuidelines = JSON.stringify({
      websiteUrl: 'https://pulsehealth.example',
      values: ['Care', 'Evidence', 'Access'],
      competitors: ['Hims', 'Ro'],
      dnaScore: 0.87,
      projectsCompleted: 4,
      lastUpdated: iso('2026-04-08'),
    });

    await client.query(
      `INSERT INTO brand_profiles (id, tenant_id, name, colors, fonts, tone_of_voice, guidelines_text, logo_urls, industry, target_audience, status, created_at, updated_at)
       VALUES ($1, $2, 'Lumen Analytics',
         $3::jsonb, $4::jsonb, $5, $6,
         ARRAY['https://placehold.co/200x80/4f46e5/ffffff/png?text=Lumen']::text[],
         'B2B SaaS', 'Data teams at growth-stage SaaS', 'active', $7, $8)
       ON CONFLICT (tenant_id, name) DO UPDATE SET
         colors = EXCLUDED.colors, fonts = EXCLUDED.fonts, tone_of_voice = EXCLUDED.tone_of_voice,
         guidelines_text = EXCLUDED.guidelines_text, logo_urls = EXCLUDED.logo_urls,
         industry = EXCLUDED.industry, target_audience = EXCLUDED.target_audience, updated_at = EXCLUDED.updated_at`,
      [
        BRAND_LUMEN,
        T,
        JSON.stringify([
          { name: 'Indigo', hex: '#4F46E5', usage: 'primary' },
          { name: 'Slate', hex: '#0F172A', usage: 'neutral' },
          { name: 'Sky', hex: '#38BDF8', usage: 'accent' },
        ]),
        JSON.stringify([
          { name: 'Inter', usage: 'body', weight: '400–700' },
          { name: 'Söhne', usage: 'heading', weight: '600' },
        ]),
        'Precise, optimistic, builder-friendly.',
        brandLumenGuidelines,
        iso('2026-04-10'),
        iso('2026-04-10'),
      ],
    );

    await client.query(
      `INSERT INTO brand_profiles (id, tenant_id, name, colors, fonts, tone_of_voice, guidelines_text, logo_urls, industry, target_audience, status, created_at, updated_at)
       VALUES ($1, $2, 'Pulse Health',
         $3::jsonb, $4::jsonb, $5, $6,
         ARRAY['https://placehold.co/200x80/0ea5e9/ffffff/png?text=Pulse']::text[],
         'Health & wellness', 'Health-conscious millennials', 'active', $7, $8)
       ON CONFLICT (tenant_id, name) DO UPDATE SET
         colors = EXCLUDED.colors, fonts = EXCLUDED.fonts, tone_of_voice = EXCLUDED.tone_of_voice,
         guidelines_text = EXCLUDED.guidelines_text, logo_urls = EXCLUDED.logo_urls,
         industry = EXCLUDED.industry, target_audience = EXCLUDED.target_audience, updated_at = EXCLUDED.updated_at`,
      [
        BRAND_PULSE,
        T,
        JSON.stringify([
          { name: 'Teal', hex: '#0D9488', usage: 'primary' },
          { name: 'Sand', hex: '#F8FAFC', usage: 'neutral' },
        ]),
        JSON.stringify([{ name: 'DM Sans', usage: 'body', weight: '400–600' }]),
        'Warm, clinical clarity without jargon.',
        brandPulseGuidelines,
        iso('2026-04-08'),
        iso('2026-04-08'),
      ],
    );

    for (const p of projects) {
      await client.query(
        `INSERT INTO projects (id, tenant_id, brand_profile_id, created_by, assigned_expert, title, project_type, status, priority, due_date, delivered_at, ai_cost_cents, price_cents, quality_score, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          p.id,
          T,
          p.brand_profile_id,
          U_PRIYA,
          p.assigned_expert,
          p.title,
          p.project_type,
          projectStatusToDb(p.status),
          projectPriorityToDb(p.priority),
          p.dueDate,
          p.delivered_at,
          dollarsToCents(p.aiCost),
          dollarsToCents(p.estimatedCost),
          p.qualityScore,
          p.createdAt,
          p.updatedAt,
        ],
      );
    }

    await client.query(
      `INSERT INTO briefs (id, project_id, tenant_id, brief_type, content, submitted_at, created_at, updated_at)
       VALUES ($1, $2, $3, 'demo_seed', '{}'::jsonb, $4, $4, $4)`,
      [BRIEF_LUMEN, P_LUMEN, T, iso('2026-04-09T08:00:00')],
    );
    await client.query(
      `INSERT INTO briefs (id, project_id, tenant_id, brief_type, content, submitted_at, created_at, updated_at)
       VALUES ($1, $2, $3, 'demo_seed', '{}'::jsonb, $4, $4, $4)`,
      [BRIEF_PULSE, P_PULSE, T, iso('2026-04-11T10:00:00')],
    );

    await client.query(
      `INSERT INTO pipeline_runs (id, project_id, brief_id, status, started_at, completed_at, total_cost_cents, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)`,
      [
        PIPE_PULSE,
        P_PULSE,
        BRIEF_PULSE,
        pipelineRunStatusToDb('running'),
        iso('2026-04-11T10:02:00'),
        null,
        taskCostCents(127.84),
        JSON.stringify({ total_time_minutes: 184, demo_id: 'pipe_pulse_live' }),
        iso('2026-04-11T10:02:00'),
      ],
    );
    await client.query(
      `INSERT INTO pipeline_runs (id, project_id, brief_id, status, started_at, completed_at, total_cost_cents, metadata, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)`,
      [
        PIPE_LUMEN,
        P_LUMEN,
        BRIEF_LUMEN,
        pipelineRunStatusToDb('completed'),
        iso('2026-04-09T08:00:00'),
        iso('2026-04-09T09:36:00'),
        taskCostCents(64.12),
        JSON.stringify({ total_time_minutes: 96, demo_id: 'pipe_lumen_done' }),
        iso('2026-04-09T08:00:00'),
      ],
    );

    const pulseTasks = [
      ['00000000-0000-0000-0000-000000000701', 'brief_analysis', 'anthropic', 'Claude 3.5 Sonnet', 'Brief + brand DNA', 'Structured creative brief', 'completed', 0, taskCostCents(0.42), 4200, 0, iso('2026-04-11T10:03:00'), iso('2026-04-11T10:02:00')],
      ['00000000-0000-0000-0000-000000000702', 'storyboard_image', 'replicate', 'FLUX Pro', 'Key frames x6', 'Storyboard frames', 'completed', 1, taskCostCents(18.2), 28000, 0, iso('2026-04-11T10:08:00'), iso('2026-04-11T10:02:00')],
      ['00000000-0000-0000-0000-000000000703', 'video_generation', 'runway', 'Runway Gen-3', 'Motion from frames', '', 'running', 2, taskCostCents(89.5), 0, 0, null, iso('2026-04-11T10:08:00')],
      ['00000000-0000-0000-0000-000000000704', 'qa_validation', 'anthropic', 'Claude 3.5 Sonnet', 'QC checklist', '', 'pending', 3, 0, 0, 0, null, iso('2026-04-11T10:08:00')],
    ];
    for (const [tid, ttype, prov, mname, inp, outp, st, ord, cost, lat, att, compAt, startAt] of pulseTasks) {
      await client.query(
        `INSERT INTO pipeline_tasks (id, pipeline_run_id, task_type, model_provider, model_name, prompt, input_data, output_data, status, sort_order, cost_cents, latency_ms, attempts, started_at, completed_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          tid,
          PIPE_PULSE,
          ttype,
          prov,
          mname,
          inp,
          JSON.stringify({ text: inp }),
          JSON.stringify({ text: outp }),
          pipelineTaskStatusToDb(st),
          ord,
          cost,
          lat,
          att,
          startAt,
          compAt,
          startAt,
        ],
      );
    }

    const lumenTasks = [
      ['00000000-0000-0000-0000-000000000711', 'strategy', 'anthropic', 'Claude 3.5 Sonnet', 'Positioning workshop notes', 'Strategy output', 'completed', 0, taskCostCents(1.1), 9100, 0, iso('2026-04-09T08:05:00'), iso('2026-04-09T08:00:00')],
      ['00000000-0000-0000-0000-000000000712', 'design_system', 'replicate', 'FLUX Pro', 'Tokens + components', 'Design system', 'completed', 1, taskCostCents(22.4), 45000, 0, iso('2026-04-09T08:25:00'), iso('2026-04-09T08:00:00')],
      ['00000000-0000-0000-0000-000000000713', 'copy_generation', 'anthropic', 'Claude 3.5 Sonnet', 'Voice guidelines', 'Copy deck', 'completed', 2, taskCostCents(0.62), 6800, 0, iso('2026-04-09T08:40:00'), iso('2026-04-09T08:00:00')],
    ];
    for (const [tid, ttype, prov, mname, inp, outp, st, ord, cost, lat, att, compAt, startAt] of lumenTasks) {
      await client.query(
        `INSERT INTO pipeline_tasks (id, pipeline_run_id, task_type, model_provider, model_name, prompt, input_data, output_data, status, sort_order, cost_cents, latency_ms, attempts, started_at, completed_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [
          tid,
          PIPE_LUMEN,
          ttype,
          prov,
          mname,
          inp,
          JSON.stringify({ text: inp }),
          JSON.stringify({ text: outp }),
          pipelineTaskStatusToDb(st),
          ord,
          cost,
          lat,
          att,
          startAt,
          compAt,
          startAt,
        ],
      );
    }

    for (const d of deliverables) {
      await client.query(
        `INSERT INTO deliverables (id, project_id, tenant_id, title, file_type, file_url, thumbnail_url, version, status, metadata, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11)`,
        [
          d.id,
          d.project_id,
          T,
          d.title,
          d.file_type,
          d.file_url,
          d.thumbnail_url || null,
          d.version,
          deliverableStatusToDb(d.status),
          deliverableMetadata(d),
          d.createdAt,
        ],
      );
    }

    for (const r of reviews) {
      await client.query(
        `INSERT INTO expert_reviews (id, project_id, expert_id, status, quality_score, review_notes, refinements, time_spent_mins, created_at, completed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10)`,
        [
          r.id,
          r.project_id,
          r.expert_id,
          reviewStatusToDb(r.status),
          r.rating || null,
          `deliverable_id:${r.deliverable_id}`,
          JSON.stringify(r.refinements),
          r.timeSpent,
          r.createdAt,
          r.status === 'approved' ? r.createdAt : null,
        ],
      );
    }

    const leads = [
      ['00000000-0000-0000-0000-000000000801', 'Harbor Robotics', 'Elena Voss', 'elena@harborrobotics.io', null, 'demo_scheduled', 8400000, 'Outbound — design partner', 'Series A; wants creative ops on retainer.', iso('2026-04-01'), iso('2026-04-09'), iso('2026-04-14')],
      ['00000000-0000-0000-0000-000000000802', 'Cedar Bio', 'Dev Shah', 'dev@cedarbio.com', null, 'proposal_sent', 5200000, 'Referral — Lumen', 'Comparing against traditional agency quote.', iso('2026-03-20'), iso('2026-04-08'), null],
      ['00000000-0000-0000-0000-000000000803', 'SignalForge', 'Priya Nand', 'priya@signalforge.ai', '+1 415 555 0192', 'negotiating', 12000000, 'Conference — SaaStr', 'Enterprise security review in progress.', iso('2026-02-14'), iso('2026-04-10'), null],
      ['00000000-0000-0000-0000-000000000804', 'Bluecart', 'Marcus Hill', 'marcus@bluecart.shop', null, 'new', 2800000, 'Inbound — website', 'Asked about SLA tiers.', iso('2026-04-11'), iso('2026-04-11'), null],
    ];
    for (const [id, company, contact, email, phone, status, valCents, source, notes, created, lastC, nextF] of leads) {
      await client.query(
        `INSERT INTO leads (id, tenant_id, company, contact_name, email, phone, status, value_cents, source, notes, created_at, last_contact_at, next_follow_up, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$11)
         ON CONFLICT (id) DO UPDATE SET
           company = EXCLUDED.company, contact_name = EXCLUDED.contact_name, email = EXCLUDED.email, phone = EXCLUDED.phone,
           status = EXCLUDED.status, value_cents = EXCLUDED.value_cents, source = EXCLUDED.source, notes = EXCLUDED.notes,
           last_contact_at = EXCLUDED.last_contact_at, next_follow_up = EXCLUDED.next_follow_up, updated_at = now()`,
        [id, T, company, contact, email, phone, status, valCents, source, notes, created, lastC, nextF],
      );
    }

    const aiModels = [
      ['00000000-0000-0000-0000-000000000901', 'anthropic', 'Claude 3.5 Sonnet', ['reasoning', 'long_context', 'tool_use'], 0.003, 8200, 9.2, true],
      ['00000000-0000-0000-0000-000000000902', 'openai', 'GPT-4o', ['multimodal', 'fast'], 0.005, 4100, 8.9, true],
      ['00000000-0000-0000-0000-000000000903', 'replicate', 'FLUX Pro', ['image', 'high_res'], 0, 22000, 9.0, true],
      ['00000000-0000-0000-0000-000000000904', 'runway', 'Runway Gen-3', ['video'], 0, 120000, 8.6, true],
    ];
    for (const [id, provider, name, caps, cpt, lat, qual, active] of aiModels) {
      await client.query(
        `INSERT INTO ai_models (id, tenant_id, provider, name, capabilities, cost_per_1k_tokens, avg_latency_ms, quality_score, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           provider = EXCLUDED.provider, name = EXCLUDED.name, capabilities = EXCLUDED.capabilities,
           cost_per_1k_tokens = EXCLUDED.cost_per_1k_tokens, avg_latency_ms = EXCLUDED.avg_latency_ms,
           quality_score = EXCLUDED.quality_score, is_active = EXCLUDED.is_active`,
        [id, T, provider, name, caps, cpt, lat, qual, active],
      );
    }

    const assignments = [
      ['00000000-0000-0000-0000-000000000a01', P_PULSE, U_JORDAN, 'in_review', 'standard', 'urgent', iso('2026-04-11T09:00:00'), null, 42, 7.9, 8.2],
      ['00000000-0000-0000-0000-000000000a02', P_LUMEN, U_MAYA, 'claimed', 'senior', 'high', iso('2026-04-10T14:20:00'), null, 55, 8.4, 8.7],
      ['00000000-0000-0000-0000-000000000a03', P_NORTH, U_JORDAN, 'queued', 'standard', 'high', null, null, 0, 8.0, 8.0],
    ];
    for (const [id, pid, eid, st, esc, pri, claimed, completed, rtm, qb, qa] of assignments) {
      await client.query(
        `INSERT INTO expert_assignments (id, project_id, expert_id, tenant_id, status, escalation_level, priority, claimed_at, completed_at, review_time_minutes, quality_before, quality_after, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now())
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status, escalation_level = EXCLUDED.escalation_level, priority = EXCLUDED.priority,
           claimed_at = EXCLUDED.claimed_at, completed_at = EXCLUDED.completed_at,
           review_time_minutes = EXCLUDED.review_time_minutes, quality_before = EXCLUDED.quality_before, quality_after = EXCLUDED.quality_after`,
        [id, pid, eid, T, st, esc, pri, claimed, completed, rtm, qb, qa],
      );
    }

    const autonomy = [
      ['00000000-0000-0000-0000-000000000b01', 'social_media', 'Social & motion kits', 'autonomous', 0.88, 142, 0.94, 0.08, 8.3, 'improving', iso('2026-06-01')],
      ['00000000-0000-0000-0000-000000000b02', 'brand_identity', 'Brand & guidelines', 'spot_check', 0.81, 58, 0.89, 0.14, 8.6, 'stable', null],
      ['00000000-0000-0000-0000-000000000b03', 'logo_design', 'Logo & marks', 'human_required', 0.68, 31, 0.82, 0.22, 8.1, 'improving', null],
    ];
    for (const [id, tt, tl, lvl, conf, tot, sr, rr, aqs, tr, projDate] of autonomy) {
      await client.query(
        `INSERT INTO autonomy_configs (id, tenant_id, task_type, task_label, current_level, confidence_score, total_completed, success_rate, revision_rate, avg_quality_score, trend, projected_autonomy_date, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now(), now())
         ON CONFLICT (tenant_id, task_type) DO UPDATE SET
           task_label = EXCLUDED.task_label, current_level = EXCLUDED.current_level, confidence_score = EXCLUDED.confidence_score,
           total_completed = EXCLUDED.total_completed, success_rate = EXCLUDED.success_rate, revision_rate = EXCLUDED.revision_rate,
           avg_quality_score = EXCLUDED.avg_quality_score, trend = EXCLUDED.trend, projected_autonomy_date = EXCLUDED.projected_autonomy_date, updated_at = now()`,
        [id, T, tt, tl, lvl, conf, tot, sr, rr, aqs, tr, projDate],
      );
    }

    const perf = [
      ['00000000-0000-0000-0000-000000000c01', D_NORTH, P_NORTH, 'meta_ads', 428000, 12650, 0.0295, 184, 620000, 3.8, iso('2026-04-09')],
      ['00000000-0000-0000-0000-000000000c02', D_PULSE, P_PULSE, 'instagram', 890000, 24100, 0.0271, 402, 410000, 5.1, iso('2026-04-08')],
    ];
    for (const [id, did, pid, ch, imp, clk, ctr, conv, spend, roi, measured] of perf) {
      await client.query(
        `INSERT INTO performance_metrics (id, deliverable_id, project_id, tenant_id, channel, impressions, clicks, ctr, conversions, spend_cents, roi, measured_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, now())
         ON CONFLICT (id) DO UPDATE SET
           impressions = EXCLUDED.impressions, clicks = EXCLUDED.clicks, ctr = EXCLUDED.ctr, conversions = EXCLUDED.conversions,
           spend_cents = EXCLUDED.spend_cents, roi = EXCLUDED.roi, measured_at = EXCLUDED.measured_at`,
        [id, did, pid, T, ch, imp, clk, ctr, conv, spend, roi, measured],
      );
    }

    const suggestions = [
      ['00000000-0000-0000-0000-000000000d01', 'Lumen Analytics', 'social_media', 'Launch thought-leadership clips from Q1 benchmark report', 'Repurpose the data narrative into 5 short clips while search volume on “AI analytics” is up 22%.', 'Trend spike + unused hero asset from last deliverable.', 'Google Trends · category: analytics', 0.91, 1800000, 'pending', iso('2026-04-24'), iso('2026-04-10')],
      ['00000000-0000-0000-0000-000000000d02', 'Northwind Commerce', 'ad_creative', 'Expand winning carousel into YouTube Shorts', 'Top quartile CTR; Shorts CPMs down 11% WoW in their vertical.', 'Performance gap vs. industry benchmark on YT.', 'Internal benchmarks + channel pricing', 0.84, 960000, 'generated', iso('2026-04-21'), iso('2026-04-07')],
    ];
    for (const [id, cname, ptype, title, desc, reason, tsrc, rel, evCents, st, exp, created] of suggestions) {
      await client.query(
        `INSERT INTO suggestions (id, tenant_id, client_name, project_type, title, description, reasoning, trend_source, relevance_score, estimated_value_cents, status, expires_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO UPDATE SET
           client_name = EXCLUDED.client_name, project_type = EXCLUDED.project_type, title = EXCLUDED.title,
           description = EXCLUDED.description, reasoning = EXCLUDED.reasoning, trend_source = EXCLUDED.trend_source,
           relevance_score = EXCLUDED.relevance_score, estimated_value_cents = EXCLUDED.estimated_value_cents,
           status = EXCLUDED.status, expires_at = EXCLUDED.expires_at`,
        [id, T, cname, ptype, title, desc, reason, tsrc, rel, evCents, st, exp, created],
      );
    }

    const feedbackTr = [
      ['00000000-0000-0000-0000-000000000e01', 'It feels a bit too playful for our compliance story — can we dial back the illustration style?', 'Reduce illustration weight; shift visual tone toward enterprise trust signals (reference: pages 2–4 of brand guidelines).', 0.93, 'aesthetic', JSON.stringify([{ action: 'adjust', parameter: 'illustration_density', value: 'low', priority: 'high' }, { action: 'emphasize', parameter: 'trust_markers', value: 'logos + certifications strip', priority: 'medium' }])],
      ['00000000-0000-0000-0000-000000000e02', 'The headline is catchy but I worry it overpromises on ROI.', 'Soften performance claim in H1; align copy to verified metrics in appendix C.', 0.89, 'content', JSON.stringify([{ action: 'replace', parameter: 'hero_headline', value: 'Outcome-led, qualified headline', priority: 'high' }])],
    ];
    for (const [id, orig, trans, conf, cat, items] of feedbackTr) {
      await client.query(
        `INSERT INTO feedback_translations (id, tenant_id, project_id, original, translated, confidence, category, actionable_items, created_at)
         VALUES ($1,$2,null,$3,$4,$5,$6,$7::jsonb, now())
         ON CONFLICT (id) DO UPDATE SET original = EXCLUDED.original, translated = EXCLUDED.translated, confidence = EXCLUDED.confidence, category = EXCLUDED.category, actionable_items = EXCLUDED.actionable_items`,
        [id, T, orig, trans, conf, cat, items],
      );
    }

    const pubJobs = [
      ['00000000-0000-0000-0000-000000000f01', D_NORTH, 'Northwind — carousel B', 'meta_ads', 'live', iso('2026-04-08T08:00:00'), iso('2026-04-08T08:05:00'), JSON.stringify({ impressions: 128000, clicks: 4100, engagement: 0.048 })],
      ['00000000-0000-0000-0000-000000000f02', D_PULSE, 'Pulse — reels batch', 'instagram', 'scheduled', iso('2026-04-12T14:00:00'), null, null],
    ];
    for (const [id, did, ptitle, ch, st, sched, pubAt, metrics] of pubJobs) {
      await client.query(
        `INSERT INTO publishing_jobs (id, deliverable_id, tenant_id, project_title, channel, status, scheduled_at, published_at, metrics, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb, now())
         ON CONFLICT (id) DO UPDATE SET
           project_title = EXCLUDED.project_title, channel = EXCLUDED.channel, status = EXCLUDED.status,
           scheduled_at = EXCLUDED.scheduled_at, published_at = EXCLUDED.published_at, metrics = EXCLUDED.metrics`,
        [id, did, T, ptitle, ch, st, sched, pubAt, metrics],
      );
    }

    const channels = [
      ['00000000-0000-0000-0000-000000001501', 'meta_ads', 'Meta Ads', true, 'AgencyOS — Main', iso('2026-04-11T07:00:00')],
      ['00000000-0000-0000-0000-000000001502', 'google_ads', 'Google Ads', true, 'Search + PMax', iso('2026-04-10T22:00:00')],
      ['00000000-0000-0000-0000-000000001503', 'instagram', 'Instagram', true, '@agencyos.studio', iso('2026-04-11T06:30:00')],
      ['00000000-0000-0000-0000-000000001504', 'linkedin', 'LinkedIn', false, null, null],
      ['00000000-0000-0000-0000-000000001505', 'twitter', 'X / Twitter', true, '@agencyos', iso('2026-04-01')],
      ['00000000-0000-0000-0000-000000001506', 'mailchimp', 'Mailchimp', true, 'Lifecycle', iso('2026-04-09')],
      ['00000000-0000-0000-0000-000000001507', 'tiktok', 'TikTok Ads', false, null, null],
    ];
    for (const [cid, ch, label, conn, acc, sync] of channels) {
      await client.query(
        `INSERT INTO channel_configs (id, tenant_id, channel, label, connected, account_name, last_sync, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7, now())
         ON CONFLICT (tenant_id, channel) DO UPDATE SET
           label = EXCLUDED.label, connected = EXCLUDED.connected, account_name = EXCLUDED.account_name, last_sync = EXCLUDED.last_sync`,
        [cid, T, ch, label, conn, acc, sync],
      );
    }

    const benchmarks = [
      ['00000000-0000-0000-0000-000000001001', 'Creative', 'Avg. turnaround (days)', 4.2, 9.1, 3.1, 88, 'up', 'd'],
      ['00000000-0000-0000-0000-000000001002', 'Quality', 'Client satisfaction', 8.7, 7.9, 9.2, 82, 'stable', '/10'],
      ['00000000-0000-0000-0000-000000001003', 'Economics', 'Gross margin', 0.66, 0.42, 0.71, 91, 'up', '%'],
    ];
    for (const [id, cat, metric, yv, ia, tp, pct, tr, unit] of benchmarks) {
      await client.query(
        `INSERT INTO benchmarks (id, tenant_id, category, metric, your_value, industry_avg, top_performer, percentile, trend, unit, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category, metric = EXCLUDED.metric, your_value = EXCLUDED.your_value,
           industry_avg = EXCLUDED.industry_avg, top_performer = EXCLUDED.top_performer, percentile = EXCLUDED.percentile,
           trend = EXCLUDED.trend, unit = EXCLUDED.unit`,
        [id, T, cat, metric, yv, ia, tp, pct, tr, unit],
      );
    }

    const slaComp = [
      ['00000000-0000-0000-0000-000000001101', P_PULSE, 'Pulse Health', 'enterprise', 'First draft', 24, 19, 'on_track', 0],
      ['00000000-0000-0000-0000-000000001102', P_NORTH, 'Northwind Commerce', 'professional', 'Revision loop', 24, 26, 'at_risk', 0],
    ];
    for (const [id, pid, cname, tier, metric, th, ah, st, credit] of slaComp) {
      await client.query(
        `INSERT INTO sla_compliance (id, project_id, tenant_id, client_name, tier, metric, target_hours, actual_hours, status, credit_issued, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
         ON CONFLICT (id) DO UPDATE SET
           client_name = EXCLUDED.client_name, tier = EXCLUDED.tier, metric = EXCLUDED.metric,
           target_hours = EXCLUDED.target_hours, actual_hours = EXCLUDED.actual_hours, status = EXCLUDED.status, credit_issued = EXCLUDED.credit_issued`,
        [id, pid, T, cname, tier, metric, th, ah, st, credit],
      );
    }

    const inv1Items = [
      { description: 'Retainer — creative ops (Apr)', quantity: 1, unitPrice: 35000, total: 35000 },
      { description: 'Variable — generation overage', quantity: 1, unitPrice: 7000, total: 7000 },
    ];
    const inv2Items = [{ description: 'Collateral — investor one-pager + deck', quantity: 1, unitPrice: 5800, total: 5800 }];
    await client.query(
      `INSERT INTO invoices (id, tenant_id, amount_cents, status, line_items, issued_at, due_date, paid_at, created_at)
       VALUES ('00000000-0000-0000-0000-000000001201', $1, 42000, 'sent', $2::jsonb, $3, $4, null, $3)
       ON CONFLICT (id) DO UPDATE SET amount_cents = EXCLUDED.amount_cents, status = EXCLUDED.status, line_items = EXCLUDED.line_items, issued_at = EXCLUDED.issued_at, due_date = EXCLUDED.due_date, paid_at = EXCLUDED.paid_at`,
      [T, JSON.stringify(inv1Items), iso('2026-04-01'), iso('2026-04-15')],
    );
    await client.query(
      `INSERT INTO invoices (id, tenant_id, amount_cents, status, line_items, issued_at, due_date, paid_at, created_at)
       VALUES ('00000000-0000-0000-0000-000000001202', $1, 5800, 'paid', $2::jsonb, $3, $4, $5, $3)
       ON CONFLICT (id) DO UPDATE SET amount_cents = EXCLUDED.amount_cents, status = EXCLUDED.status, line_items = EXCLUDED.line_items, issued_at = EXCLUDED.issued_at, due_date = EXCLUDED.due_date, paid_at = EXCLUDED.paid_at`,
      [T, JSON.stringify(inv2Items), iso('2026-03-28'), iso('2026-04-10'), iso('2026-04-04')],
    );

    const revenueRows = [
      ['2025-11', 11800000, 4200000, 7600000, 0.644, 14, 9],
      ['2025-12', 13200000, 4600000, 8600000, 0.652, 16, 10],
      ['2026-01', 14100000, 5100000, 9000000, 0.638, 17, 11],
      ['2026-02', 15600000, 5400000, 10200000, 0.654, 19, 12],
      ['2026-03', 16800000, 5800000, 11000000, 0.655, 21, 13],
      ['2026-04', 14200000, 4800000, 9400000, 0.662, 18, 12],
    ];
    let rmIdx = 0;
    for (const [month, rev, cost, profit, margin, proj, clients] of revenueRows) {
      rmIdx += 1;
      const rid = `00000000-0000-4000-8000-${String(10000 + rmIdx).padStart(12, '0')}`;
      await client.query(
        `INSERT INTO revenue_metrics (id, tenant_id, month, revenue_cents, cost_cents, profit_cents, margin, projects, clients, created_at)
         VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, now())
         ON CONFLICT (tenant_id, month) DO UPDATE SET
           revenue_cents = EXCLUDED.revenue_cents, cost_cents = EXCLUDED.cost_cents, profit_cents = EXCLUDED.profit_cents,
           margin = EXCLUDED.margin, projects = EXCLUDED.projects, clients = EXCLUDED.clients`,
        [rid, T, month, rev, cost, profit, margin, proj, clients],
      );
    }

    const costRows = [
      ['00000000-0000-0000-0000-000000001301', 'LLM routing & prompts', 1840000, 38, 'up'],
      ['00000000-0000-0000-0000-000000001302', 'Image & video generation', 1520000, 32, 'stable'],
      ['00000000-0000-0000-0000-000000001303', 'Expert review time', 980000, 20, 'down'],
      ['00000000-0000-0000-0000-000000001304', 'Embeddings & retrieval', 480000, 10, 'stable'],
    ];
    for (const [id, cat, amt, pct, tr] of costRows) {
      await client.query(
        `INSERT INTO cost_breakdown (id, tenant_id, category, amount_cents, percentage, trend, period, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,'2026-04', now())
         ON CONFLICT (id) DO UPDATE SET
           category = EXCLUDED.category, amount_cents = EXCLUDED.amount_cents, percentage = EXCLUDED.percentage, trend = EXCLUDED.trend, period = EXCLUDED.period`,
        [id, T, cat, amt, pct, tr],
      );
    }

    await client.query(
      `INSERT INTO usage_records (id, tenant_id, month, projects_completed, credits_used, credits_remaining, total_spend_cents, ai_cost_cents, margin, created_at)
       VALUES ('00000000-0000-0000-0000-000000001401', $1, '2026-04', 18, 14200, 5800, 14200000, 4800000, 0.662, now())
       ON CONFLICT (tenant_id, month) DO UPDATE SET
         projects_completed = EXCLUDED.projects_completed, credits_used = EXCLUDED.credits_used, credits_remaining = EXCLUDED.credits_remaining,
         total_spend_cents = EXCLUDED.total_spend_cents, ai_cost_cents = EXCLUDED.ai_cost_cents, margin = EXCLUDED.margin`,
      [T],
    );

    await client.query('COMMIT');
    console.log('Demo seed completed (tenant slug: demo-agency).');
    console.log(`Password for admin@agencyos.demo / maya@ / jordan@ / sarah@: demo123`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await disconnect();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
