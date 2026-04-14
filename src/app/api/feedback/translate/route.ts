import { NextRequest, NextResponse } from "next/server"

import { generate } from "@/lib/ai/gateway"
import type { ActionableItem, FeedbackTranslation } from "@/types"

const DEMO_ACTIONABLE: ActionableItem[] = [
  { action: "increase", parameter: "whitespace", value: "+20–25%", priority: "high" },
  { action: "change", parameter: "heading_font", value: "serif (e.g. Playfair)", priority: "high" },
  { action: "reduce", parameter: "palette", value: "2 primary + neutrals", priority: "medium" },
  { action: "add", parameter: "elevation", value: "subtle card/CTA shadow", priority: "medium" },
  { action: "increase", parameter: "body_size", value: "+1 step scale", priority: "low" },
]

function buildDemoResult(original: string): FeedbackTranslation {
  return {
    id: `live-demo-${Date.now()}`,
    original,
    translated:
      "Increase whitespace and vertical rhythm. Replace geometric sans headings with a refined serif. Limit palette to two primaries plus neutrals. Add subtle elevation (soft shadows) on cards and CTAs. Bump body text size slightly for a more editorial feel.",
    confidence: 0.87,
    category: "aesthetic",
    actionableItems: DEMO_ACTIONABLE,
  }
}

function hasAiKeys(): boolean {
  return Boolean(
    process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY,
  )
}

const CATEGORIES = new Set(["aesthetic", "content", "layout", "color", "typography", "general"])

function normalizeCategory(c: unknown): FeedbackTranslation["category"] {
  if (typeof c === "string" && CATEGORIES.has(c)) return c as FeedbackTranslation["category"]
  return "general"
}

function parseActionableItems(raw: unknown): ActionableItem[] {
  if (!Array.isArray(raw)) return []
  const out: ActionableItem[] = []
  for (const row of raw) {
    if (!row || typeof row !== "object") continue
    const o = row as Record<string, unknown>
    const action = typeof o.action === "string" ? o.action : "update"
    const parameter = typeof o.parameter === "string" ? o.parameter : "unspecified"
    const value = typeof o.value === "string" ? o.value : ""
    const pr = o.priority
    const priority =
      pr === "high" || pr === "medium" || pr === "low" ? pr : "medium"
    out.push({ action, parameter, value, priority })
  }
  return out
}

export async function POST(request: NextRequest) {
  try {
    let body: { text?: string }
    try {
      body = (await request.json()) as { text?: string }
    } catch {
      return NextResponse.json({ error: { message: "Invalid JSON body", code: "BAD_REQUEST" } }, { status: 400 })
    }
    const text = typeof body.text === "string" ? body.text.trim() : ""
    if (!text) {
      return NextResponse.json({ error: { message: "text is required", code: "VALIDATION" } }, { status: 400 })
    }

    if (!hasAiKeys()) {
      return NextResponse.json({ data: buildDemoResult(text) })
    }

    const system = `You translate vague client creative feedback into a structured JSON object for a design/production team.
Respond with ONLY valid JSON (no markdown fences), shape:
{"translated": string (clear internal brief), "confidence": number 0-1, "category": one of aesthetic|content|layout|color|typography|general, "actionableItems": array of {"action": string, "parameter": string, "value": string, "priority": "high"|"medium"|"low"}}`

    const result = await generate({
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Client feedback:\n${text}` },
      ],
      maxTokens: 1500,
      temperature: 0.4,
    })

    let parsed: Record<string, unknown>
    try {
      const cleaned = result.content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim()
      parsed = JSON.parse(cleaned) as Record<string, unknown>
    } catch {
      return NextResponse.json({ data: buildDemoResult(text) })
    }

    const translated = typeof parsed.translated === "string" ? parsed.translated : ""
    const confidence =
      typeof parsed.confidence === "number" && !Number.isNaN(parsed.confidence)
        ? Math.min(1, Math.max(0, parsed.confidence))
        : 0.75

    const data: FeedbackTranslation = {
      id: `ft-${Date.now()}`,
      original: text,
      translated: translated || buildDemoResult(text).translated,
      confidence,
      category: normalizeCategory(parsed.category),
      actionableItems:
        parseActionableItems(parsed.actionableItems).length > 0
          ? parseActionableItems(parsed.actionableItems)
          : buildDemoResult(text).actionableItems,
    }

    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Translation failed"
    return NextResponse.json({ error: { message, code: "INTERNAL" } }, { status: 500 })
  }
}
