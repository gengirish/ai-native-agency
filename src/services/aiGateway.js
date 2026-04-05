const { query } = require('../../db/connection');

const PRICE_TABLE = {
  openai: {
    'gpt-4o': { inputPerMillionCents: 250, outputPerMillionCents: 1000 },
    'gpt-4o-mini': { inputPerMillionCents: 15, outputPerMillionCents: 60 },
    'dall-e-3': { perImageStandardCents: 400, perImageHDCents: 800 },
  },
  anthropic: {
    'claude-3-5-sonnet-20241022': { inputPerMillionCents: 300, outputPerMillionCents: 1500 },
    'claude-3-opus-20240229': { inputPerMillionCents: 1500, outputPerMillionCents: 7500 },
    'claude-3-haiku-20240307': { inputPerMillionCents: 25, outputPerMillionCents: 125 },
  },
};

function getTokenPricing(provider, model) {
  const p = provider?.toLowerCase();
  const table = PRICE_TABLE[p];
  if (!table || !table[model]) return { inputPerMillionCents: 0, outputPerMillionCents: 0 };
  return table[model];
}

class AiGateway {
  chat(provider, model, messages, options = {}) {
    const p = String(provider || '').toLowerCase();
    if (p === 'openai') return this._openaiChat(model, messages, options);
    if (p === 'anthropic') return this._anthropicChat(model, messages, options);
    throw new Error(`Unsupported chat provider: ${provider}`);
  }

  async _openaiChat(model, messages, options) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set');

    const body = {
      model,
      messages,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
    };

    const started = Date.now();
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const latencyMs = Date.now() - started;
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.error?.message || res.statusText || 'OpenAI request failed';
      throw new Error(msg);
    }

    const choice = data.choices?.[0];
    const content = choice?.message?.content ?? '';
    const inputTokens = data.usage?.prompt_tokens ?? 0;
    const outputTokens = data.usage?.completion_tokens ?? 0;
    const costCents = this.calculateCost('openai', model, inputTokens, outputTokens);

    return { content, inputTokens, outputTokens, costCents, latencyMs };
  }

  async _anthropicChat(model, messages, options) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY is not set');

    let system;
    const claudeMessages = [];
    for (const m of messages) {
      if (m.role === 'system') {
        system = (system ? `${system}\n` : '') + (typeof m.content === 'string' ? m.content : JSON.stringify(m.content));
      } else {
        claudeMessages.push({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        });
      }
    }

    const body = {
      model,
      max_tokens: options.maxTokens ?? 4096,
      temperature: options.temperature ?? 0.7,
      messages: claudeMessages,
      ...(system ? { system } : {}),
    };

    const started = Date.now();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const latencyMs = Date.now() - started;
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.error?.message || res.statusText || 'Anthropic request failed';
      throw new Error(msg);
    }

    const block = data.content?.find((c) => c.type === 'text');
    const content = block?.text ?? '';
    const inputTokens = data.usage?.input_tokens ?? 0;
    const outputTokens = data.usage?.output_tokens ?? 0;
    const costCents = this.calculateCost('anthropic', model, inputTokens, outputTokens);

    return { content, inputTokens, outputTokens, costCents, latencyMs };
  }

  async generateImage(provider, prompt, options = {}) {
    const p = String(provider || '').toLowerCase();
    if (p !== 'openai') throw new Error(`Image generation not implemented for provider: ${provider}`);

    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set');

    const size = options.size || '1024x1024';
    const quality = options.quality || 'standard';
    const model = options.model || 'dall-e-3';

    const started = Date.now();
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size,
        quality,
        response_format: 'url',
      }),
    });

    const latencyMs = Date.now() - started;
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.error?.message || res.statusText || 'OpenAI image generation failed';
      throw new Error(msg);
    }

    const imageUrl = data.data?.[0]?.url ?? '';
    const pricing = PRICE_TABLE.openai['dall-e-3'];
    const costCents =
      quality === 'hd' ? pricing.perImageHDCents : pricing.perImageStandardCents;

    return { imageUrl, costCents, latencyMs };
  }

  calculateCost(provider, model, inputTokens, outputTokens) {
    const p = String(provider || '').toLowerCase();
    if (p === 'openai' && model === 'dall-e-3') {
      return PRICE_TABLE.openai['dall-e-3'].perImageStandardCents;
    }
    const { inputPerMillionCents, outputPerMillionCents } = getTokenPricing(p, model);
    const inputCents = Math.ceil((inputTokens / 1_000_000) * inputPerMillionCents);
    const outputCents = Math.ceil((outputTokens / 1_000_000) * outputPerMillionCents);
    return inputCents + outputCents;
  }

  async logCost(
    pipelineTaskId,
    projectId,
    tenantId,
    provider,
    model,
    inputTokens,
    outputTokens,
    costCents,
    latencyMs,
    requestType
  ) {
    await query(
      `INSERT INTO ai_cost_log (
        pipeline_task_id, project_id, tenant_id,
        model_provider, model_name,
        input_tokens, output_tokens, cost_cents, latency_ms, request_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        pipelineTaskId,
        projectId,
        tenantId,
        provider,
        model,
        inputTokens,
        outputTokens,
        costCents,
        latencyMs,
        requestType,
      ]
    );
  }
}

module.exports = new AiGateway();
