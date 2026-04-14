import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getUserFromRequest } from "@/lib/auth/jwt"
import { getReviewById, updateDeliverable, updateReview } from "@/lib/dal"
import { hasDb } from "@/lib/db"
import type { ReviewStatus } from "@/types"

type PatchBody = {
  status?: ReviewStatus
  rating?: number
}

const patchStatuses: ReviewStatus[] = [
  "approved",
  "revision_requested",
  "rejected",
]

function isPatchStatus(s: unknown): s is ReviewStatus {
  return typeof s === "string" && patchStatuses.includes(s as ReviewStatus)
}

function mapReviewStatusToDb(status: ReviewStatus): string {
  if (status === "revision_requested") return "needs_revision"
  if (status === "rejected") return "escalated"
  return status
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const review = await getReviewById(id)
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }
    return NextResponse.json(review)
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const reviewBefore = await getReviewById(id)
    if (!reviewBefore) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    let body: PatchBody
    try {
      body = (await request.json()) as PatchBody
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (body.status !== undefined) {
      if (!isPatchStatus(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
    }

    if (body.rating !== undefined) {
      if (typeof body.rating !== "number" || Number.isNaN(body.rating)) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
      }
    }

    const deliverableId = reviewBefore.deliverableId

    const patch: { status?: string; rating?: number } = {}
    if (body.status !== undefined) {
      patch.status = hasDb() ? mapReviewStatusToDb(body.status) : body.status
    }
    if (body.rating !== undefined) patch.rating = body.rating

    const updated = await updateReview(id, patch)
    if (!updated) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (body.status !== undefined && deliverableId) {
      if (body.status === "approved") {
        await updateDeliverable(deliverableId, { status: "approved" })
      } else if (body.status === "revision_requested") {
        await updateDeliverable(deliverableId, { status: "revision" })
      }
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
