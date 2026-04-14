type Role = "system" | "user" | "assistant"

interface Message {
  role: Role
  content: string
}

export interface GenerateOptions {
  messages: Message[]
  model?: string
  maxTokens?: number
  temperature?: number
  provider?: "openrouter" | "groq" | "gemini"
}

export interface GenerateResult {
  content: string
  model: string
  provider: string
  tokensUsed: number
  latencyMs: number
  cost: number
}

const PROVIDER_CONFIG = {
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    keyEnv: "OPENROUTER_API_KEY",
    defaultModel: "anthropic/claude-sonnet-4",
    headers: (key: string) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://agencyos.intelliforge.tech",
      "X-Title": "AgencyOS",
    }),
  },
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyEnv: "GROQ_API_KEY",
    defaultModel: "llama-3.3-70b-versatile",
    headers: (key: string) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
  gemini: {
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyEnv: "GEMINI_API_KEY",
    defaultModel: "gemini-2.0-flash",
    headers: (key: string) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
} as const

type ProviderName = keyof typeof PROVIDER_CONFIG

const FALLBACK_ORDER: ProviderName[] = ["openrouter", "groq", "gemini"]

function getKey(provider: ProviderName): string | null {
  return process.env[PROVIDER_CONFIG[provider].keyEnv] || null
}

export async function generate(opts: GenerateOptions): Promise<GenerateResult> {
  const preferred = opts.provider ? [opts.provider] : FALLBACK_ORDER
  const providers = [
    ...preferred,
    ...FALLBACK_ORDER.filter((p) => !preferred.includes(p)),
  ]

  let lastError: Error | null = null

  for (const providerName of providers) {
    const key = getKey(providerName)
    if (!key) continue

    const cfg = PROVIDER_CONFIG[providerName]
    const model = opts.model ?? cfg.defaultModel
    const start = Date.now()

    try {
      const res = await fetch(cfg.url, {
        method: "POST",
        headers: cfg.headers(key),
        body: JSON.stringify({
          model,
          messages: opts.messages,
          max_tokens: opts.maxTokens ?? 2048,
          temperature: opts.temperature ?? 0.7,
        }),
      })

      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        lastError = new Error(`${providerName} ${res.status}: ${errText.slice(0, 200)}`)
        continue
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
        usage?: { total_tokens?: number }
        model?: string
      }

      const content = json.choices?.[0]?.message?.content ?? ""
      const tokens = json.usage?.total_tokens ?? 0

      return {
        content,
        model: json.model ?? model,
        provider: providerName,
        tokensUsed: tokens,
        latencyMs: Date.now() - start,
        cost: estimateCost(providerName, tokens),
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
    }
  }

  throw lastError ?? new Error("No AI provider configured")
}

function estimateCost(provider: ProviderName, tokens: number): number {
  const rates: Record<ProviderName, number> = {
    openrouter: 0.003,
    groq: 0.0003,
    gemini: 0.0001,
  }
  return (tokens / 1000) * (rates[provider] ?? 0.001)
}
