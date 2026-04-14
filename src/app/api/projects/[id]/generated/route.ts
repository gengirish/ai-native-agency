import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { getDeliverables } from "@/lib/dal"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }
    const { id } = await params
    const list = await getDeliverables(id, user.tenantId)
    const deliverable = list[0]
    if (!deliverable) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      deliverable,
      generation: {
        content: deliverable.fileUrl,
        model: deliverable.aiModel,
        provider: "openrouter",
        tokensUsed: 0,
        latencyMs: deliverable.generationTime,
        cost: deliverable.generationCost,
      },
    })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
