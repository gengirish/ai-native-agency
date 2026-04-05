const TASK_ROUTE_DEFAULT = {
  generate_color_palette: { provider: 'openai', model: 'gpt-4o', maxTokens: 2048, temperature: 0.6 },
  generate_logo: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_social_graphics: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_business_card: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  compile_brand_guide: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.5 },

  research_topic: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 4096, temperature: 0.5 },
  create_outline: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 4096, temperature: 0.6 },
  write_draft: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.7 },
  edit_and_polish: { provider: 'anthropic', model: 'claude-3-opus-20240229', maxTokens: 8192, temperature: 0.4 },

  audience_analysis: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.5 },
  generate_headlines: { provider: 'openai', model: 'gpt-4o', maxTokens: 2048, temperature: 0.8 },
  write_body_copy: { provider: 'openai', model: 'gpt-4o', maxTokens: 2048, temperature: 0.7 },
  create_variants: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.6 },
};

const TASK_ROUTE_STARTER = {
  generate_color_palette: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 2048, temperature: 0.6 },
  generate_logo: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_social_graphics: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_business_card: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  compile_brand_guide: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 4096, temperature: 0.5 },

  research_topic: { provider: 'anthropic', model: 'claude-3-haiku-20240307', maxTokens: 4096, temperature: 0.5 },
  create_outline: { provider: 'anthropic', model: 'claude-3-haiku-20240307', maxTokens: 4096, temperature: 0.6 },
  write_draft: { provider: 'anthropic', model: 'claude-3-haiku-20240307', maxTokens: 8192, temperature: 0.7 },
  edit_and_polish: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.4 },

  audience_analysis: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 4096, temperature: 0.5 },
  generate_headlines: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 2048, temperature: 0.8 },
  write_body_copy: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 2048, temperature: 0.7 },
  create_variants: { provider: 'openai', model: 'gpt-4o-mini', maxTokens: 4096, temperature: 0.6 },
};

const TASK_ROUTE_PREMIUM = {
  generate_color_palette: { provider: 'openai', model: 'gpt-4o', maxTokens: 2048, temperature: 0.5 },
  generate_logo: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_social_graphics: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  generate_business_card: { provider: 'openai', model: 'dall-e-3', maxTokens: 0, temperature: 0 },
  compile_brand_guide: { provider: 'openai', model: 'gpt-4o', maxTokens: 8192, temperature: 0.4 },

  research_topic: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.4 },
  create_outline: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.5 },
  write_draft: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.65 },
  edit_and_polish: { provider: 'anthropic', model: 'claude-3-opus-20240229', maxTokens: 8192, temperature: 0.35 },

  audience_analysis: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.45 },
  generate_headlines: { provider: 'openai', model: 'gpt-4o', maxTokens: 2048, temperature: 0.85 },
  write_body_copy: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.65 },
  create_variants: { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.55 },
};

const FALLBACK_MAP = {
  'openai:gpt-4o': { provider: 'openai', model: 'gpt-4o-mini' },
  'openai:gpt-4o-mini': { provider: 'openai', model: 'gpt-4o-mini' },
  'openai:dall-e-3': { provider: 'openai', model: 'dall-e-3' },
  'anthropic:claude-3-5-sonnet-20241022': { provider: 'anthropic', model: 'claude-3-haiku-20240307' },
  'anthropic:claude-3-opus-20240229': { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' },
  'anthropic:claude-3-haiku-20240307': { provider: 'anthropic', model: 'claude-3-haiku-20240307' },
};

function pickTable(options) {
  const tier = options?.tier;
  if (tier === 'premium') return TASK_ROUTE_PREMIUM;
  if (tier === 'starter') return TASK_ROUTE_STARTER;
  return TASK_ROUTE_DEFAULT;
}

const modelRouter = {
  route(taskType, options = {}) {
    const table = pickTable(options);
    const row = table[taskType] || TASK_ROUTE_DEFAULT[taskType];
    if (!row) {
      return { provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.7 };
    }
    return { ...row };
  },

  getFallback(provider, model) {
    const key = `${String(provider).toLowerCase()}:${model}`;
    return FALLBACK_MAP[key] || { provider: 'openai', model: 'gpt-4o-mini' };
  },
};

module.exports = modelRouter;
