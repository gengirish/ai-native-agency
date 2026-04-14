import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { updatePublishingJob } from "@/lib/dal"
import type { PublishingStatus } from "@/types"

type PatchBody = {
  status?: PublishingStatus
  scheduledAt?: string
}

const ALLOWED: PublishingStatus[] = [
  "draft",
  "scheduled",
  "publishing",
  "live",
  "paused",
  "failed",
]

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    let body: PatchBody
    try {
      body = (await request.json()) as PatchBody
    } catch {
      return NextResponse.json({ error: { message: "Invalid JSON body", code: "BAD_REQUEST" } }, { status: 400 })
    }

    if (body.status !== undefined && !ALLOWED.includes(body.status)) {
      return NextResponse.json({ error: { message: "Invalid status", code: "VALIDATION" } }, { status: 400 })
    }

    if (body.status === "scheduled" && !body.scheduledAt) {
      return NextResponse.json(
        { error: { message: "scheduledAt is required when status is scheduled", code: "VALIDATION" } },
        { status: 400 },
      )
    }

    const patch: Parameters<typeof updatePublishingJob>[1] = {}
    if (body.status === "live") {
      patch.status = "live"
      patch.publishedAt = new Date().toISOString()
    } else if (body.status === "scheduled" && body.scheduledAt) {
      patch.status = "scheduled"
      patch.scheduledAt = body.scheduledAt
    } else if (body.status !== undefined) {
      patch.status = body.status
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: { message: "No valid fields to update", code: "VALIDATION" } }, { status: 400 })
    }

    const updated = await updatePublishingJob(id, patch)
    if (!updated) {
      return NextResponse.json({ error: { message: "Job not found", code: "NOT_FOUND" } }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed"
    if (message.includes("invalid input syntax for type uuid")) {
      return NextResponse.json({ error: { message: "Invalid job id", code: "VALIDATION" } }, { status: 400 })
    }
    return NextResponse.json({ error: { message, code: "INTERNAL" } }, { status: 500 })
  }
}
