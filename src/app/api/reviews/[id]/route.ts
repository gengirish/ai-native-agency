import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { store } from "@/lib/store"
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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const review = store.reviews.find((r) => r.id === id)
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }
  return NextResponse.json(review)
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  const review = store.reviews.find((r) => r.id === id)
  if (!review) {
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
    review.status = body.status
    const deliverable = store.deliverables.find(
      (d) => d.id === review.deliverableId,
    )
    if (deliverable) {
      if (body.status === "approved") {
        deliverable.status = "approved"
      } else if (body.status === "revision_requested") {
        deliverable.status = "revision"
      }
    }
  }

  if (body.rating !== undefined) {
    if (typeof body.rating !== "number" || Number.isNaN(body.rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }
    review.rating = body.rating
  }

  return NextResponse.json(review)
}
