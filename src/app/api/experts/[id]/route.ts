import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getUserFromRequest } from "@/lib/auth/jwt"
import { updateExpertAssignment } from "@/lib/dal"

type PatchBody = {
  status?: string
  claimedAt?: string
  completedAt?: string
  reviewTimeMinutes?: number
  qualityAfter?: number
  escalationLevel?: string
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
    let body: PatchBody
    try {
      body = (await request.json()) as PatchBody
    } catch {
      return NextResponse.json({ error: { message: "Invalid JSON body", code: "BAD_REQUEST" } }, { status: 400 })
    }

    const patch: Parameters<typeof updateExpertAssignment>[1] = {}
    if (body.status !== undefined) patch.status = body.status
    if (body.claimedAt !== undefined) patch.claimedAt = body.claimedAt
    if (body.completedAt !== undefined) patch.completedAt = body.completedAt
    if (body.reviewTimeMinutes !== undefined) patch.reviewTimeMinutes = body.reviewTimeMinutes
    if (body.qualityAfter !== undefined) patch.qualityAfter = body.qualityAfter
    if (body.escalationLevel !== undefined) patch.escalationLevel = body.escalationLevel

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: { message: "No valid fields to update", code: "VALIDATION" } }, { status: 400 })
    }

    const updated = await updateExpertAssignment(id, patch)
    if (!updated) {
      return NextResponse.json({ error: { message: "Assignment not found", code: "NOT_FOUND" } }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
