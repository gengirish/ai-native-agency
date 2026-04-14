import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { SEEDED_GENERATION_CONTENT } from "@/lib/demo-data"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const deliverable = store.deliverables.find((d) => d.projectId === id)
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
}
