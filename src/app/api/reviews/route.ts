import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getUserFromRequest } from "@/lib/auth/jwt"
import { createReview, getProjectById, getDeliverables, getReviews } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }
    const reviews = await getReviews(user.tenantId)
    return NextResponse.json({ data: reviews })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }
    const body = (await request.json()) as { projectId?: string; deliverableId?: string }
    const { projectId, deliverableId } = body
    if (!projectId || !deliverableId) {
      return NextResponse.json(
        {
          error: {
            message: "projectId and deliverableId are required",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 },
      )
    }

    const project = await getProjectById(projectId, user.tenantId)
    if (!project) {
      return NextResponse.json(
        { error: { message: "Not found", code: "NOT_FOUND" } },
        { status: 404 },
      )
    }
    const deliverables = await getDeliverables(projectId, user.tenantId)
    if (!deliverables.some((d) => d.id === deliverableId)) {
      return NextResponse.json(
        { error: { message: "Not found", code: "NOT_FOUND" } },
        { status: 404 },
      )
    }

    const review = await createReview({
      projectId,
      deliverableId,
      expertId: user.id,
      tenantId: user.tenantId,
    })
    return NextResponse.json({ data: review }, { status: 201 })
  } catch (err) {
    console.error("POST /api/reviews error:", err)
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 },
    )
  }
}
