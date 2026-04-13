import { NextRequest, NextResponse } from "next/server"
import type { LeadStatus } from "@/types"
import { store } from "@/lib/store"

function nowIso(): string {
  return new Date().toISOString()
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const lead = store.leads.find((l) => l.id === id)
    if (!lead) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = (await request.json()) as {
      status?: LeadStatus
      notes?: string
      nextFollowUp?: string
    }

    if (body.status !== undefined) lead.status = body.status
    if (body.notes !== undefined) lead.notes = body.notes
    if (body.nextFollowUp !== undefined) lead.nextFollowUp = body.nextFollowUp
    lead.lastContactAt = nowIso()

    return NextResponse.json({ data: lead })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
