import { NextRequest, NextResponse } from "next/server"
import { getDeliverables } from "@/lib/dal"
import { SEEDED_GENERATION_CONTENT } from "@/lib/demo-data"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const list = await getDeliverables(id)
    const deliverable = list[0]
    if (!deliverable) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      deliverable,
      generation: {
        content: SEEDED_GENERATION_CONTENT,
        model: deliverable.aiModel,
        provider: "openrouter",
        tokensUsed: 2847,
        latencyMs: deliverable.generationTime,
        cost: deliverable.generationCost,
      },
    })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
