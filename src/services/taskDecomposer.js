const BRIEF_TYPE_CONFIG = {
  design: [
    {
      taskType: 'generate_color_palette',
      sortOrder: 0,
      dependsOn: [],
      config: {
        modality: 'text',
        promptTemplate: `You are a brand designer. Based on this brief, propose a cohesive color palette (primary, secondary, accent, neutrals) with hex codes and short rationale.

Brand context:
- Target audience: {{target_audience}}
- Tone: {{tone}}
- Notes: {{additional_notes}}
- Brief details: {{brief_content}}

Respond in JSON: { "palette": [{ "name": "", "hex": "", "role": "" }], "rationale": "" }`,
        expectedOutputFormat: 'json',
      },
    },
    {
      taskType: 'generate_logo',
      sortOrder: 1,
      dependsOn: [0],
      config: {
        modality: 'image',
        promptTemplate: `Professional logo concept for a brand with tone "{{tone}}", audience: {{target_audience}}. Key themes from brief: {{brief_summary}}. Incorporate palette direction: {{color_palette_hint}}.`,
        expectedOutputFormat: 'image_url',
      },
    },
    {
      taskType: 'generate_social_graphics',
      sortOrder: 2,
      dependsOn: [0, 1],
      config: {
        modality: 'image',
        promptTemplate: `Social media graphic template, modern and on-brand. Tone: {{tone}}. Audience: {{target_audience}}. Visual style aligned with logo direction: {{logo_direction}}.`,
        expectedOutputFormat: 'image_url',
      },
    },
    {
      taskType: 'generate_business_card',
      sortOrder: 3,
      dependsOn: [0, 1],
      config: {
        modality: 'image',
        promptTemplate: `Business card front design, minimalist, professional. Brand tone {{tone}}. Color palette hint: {{color_palette_hint}}.`,
        expectedOutputFormat: 'image_url',
      },
    },
    {
      taskType: 'compile_brand_guide',
      sortOrder: 4,
      dependsOn: [0, 1, 2, 3],
      config: {
        modality: 'text',
        promptTemplate: `Compile a concise brand guide (Markdown) using:
- Color palette JSON: {{color_palette_json}}
- Logo image URL (reference only): {{logo_url}}
- Social graphic URL: {{social_url}}
- Business card URL: {{card_url}}

Include: colors, logo usage, social templates, print/business card notes, tone of voice from: {{tone}}.`,
        expectedOutputFormat: 'markdown',
      },
    },
  ],

  content: [
    {
      taskType: 'research_topic',
      sortOrder: 0,
      dependsOn: [],
      config: {
        modality: 'text',
        promptTemplate: `Research summary for content creation. Topic and goals from brief: {{brief_content}}. Audience: {{target_audience}}. Tone: {{tone}}.

Output JSON: { "key_points": [], "sources_angle": "", "risks_or_gaps": [] }`,
        expectedOutputFormat: 'json',
      },
    },
    {
      taskType: 'create_outline',
      sortOrder: 1,
      dependsOn: [0],
      config: {
        modality: 'text',
        promptTemplate: `Create a detailed article outline in Markdown using this research: {{research_json}} and brief: {{brief_content}}. Audience: {{target_audience}}. Tone: {{tone}}.`,
        expectedOutputFormat: 'markdown',
      },
    },
    {
      taskType: 'write_draft',
      sortOrder: 2,
      dependsOn: [1],
      config: {
        modality: 'text',
        promptTemplate: `Write a full draft following this outline:\n{{outline_text}}\n\nBrief: {{brief_content}}\nAudience: {{target_audience}}\nTone: {{tone}}.`,
        expectedOutputFormat: 'markdown',
      },
    },
    {
      taskType: 'edit_and_polish',
      sortOrder: 3,
      dependsOn: [2],
      config: {
        modality: 'text',
        promptTemplate: `Edit and polish the following draft for clarity, flow, and brand tone ({{tone}}). Preserve meaning. Return the improved full text only.\n\n---\n{{draft_text}}\n---`,
        expectedOutputFormat: 'markdown',
      },
    },
  ],

  ad_copy: [
    {
      taskType: 'audience_analysis',
      sortOrder: 0,
      dependsOn: [],
      config: {
        modality: 'text',
        promptTemplate: `Analyze the target audience for ad copy. Brief: {{brief_content}}. Stated audience: {{target_audience}}. Tone: {{tone}}.

Return JSON: { "personas": [], "pain_points": [], "motivations": [], "channels": [] }`,
        expectedOutputFormat: 'json',
      },
    },
    {
      taskType: 'generate_headlines',
      sortOrder: 1,
      dependsOn: [0],
      config: {
        modality: 'text',
        promptTemplate: `Generate 10 punchy ad headlines based on: {{audience_json}} and product/service context: {{brief_content}}. Tone: {{tone}}. One headline per line, numbered.`,
        expectedOutputFormat: 'text',
      },
    },
    {
      taskType: 'write_body_copy',
      sortOrder: 2,
      dependsOn: [1],
      config: {
        modality: 'text',
        promptTemplate: `Write primary body copy (2–3 short paragraphs) for ads, aligned with these headlines:\n{{headlines_text}}\nBrief: {{brief_content}}. Tone: {{tone}}.`,
        expectedOutputFormat: 'text',
      },
    },
    {
      taskType: 'create_variants',
      sortOrder: 3,
      dependsOn: [2],
      config: {
        modality: 'text',
        promptTemplate: `Create 3 A/B test variants (each: headline + body) from:\n{{body_copy}}\nOriginal headlines context:\n{{headlines_text}}\nTone: {{tone}}. Return JSON: { "variants": [{ "label": "", "headline": "", "body": "" }] }`,
        expectedOutputFormat: 'json',
      },
    },
  ],
};

const taskDecomposer = {
  decompose(brief) {
    const type = String(brief.brief_type || '').toLowerCase();
    const defs = BRIEF_TYPE_CONFIG[type];
    if (!defs) {
      return [];
    }
    return defs.map((d) => ({
      taskType: d.taskType,
      sortOrder: d.sortOrder,
      dependsOn: [...d.dependsOn],
      config: { ...d.config },
    }));
  },
};

module.exports = taskDecomposer;
