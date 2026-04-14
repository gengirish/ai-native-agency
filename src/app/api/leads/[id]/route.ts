import { NextRequest, NextResponse } from "next/server"
import type { LeadStatus } from "@/types"
import { updateLead } from "@/lib/dal"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params

    const body = (await request.json()) as {
      status?: LeadStatus
      notes?: string
      nextFollowUp?: string
      speculativeWorkUrl?: string
    }

    const lead = await updateLead(id, {
      status: body.status,
      notes: body.notes,
      nextFollowUp: body.nextFollowUp,
      speculativeWorkUrl: body.speculativeWorkUrl,
    })
    if (!lead) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ data: lead })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
