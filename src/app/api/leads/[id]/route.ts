import { NextRequest, NextResponse } from "next/server"
import type { LeadStatus } from "@/types"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { getLeads, updateLead } from "@/lib/dal"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const tenantLeads = await getLeads(user.tenantId)
    if (!tenantLeads.some((l) => l.id === id)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = (await request.json()) as {
      status?: LeadStatus
      notes?: string
      nextFollowUp?: string
      speculativeWorkUrl?: string
    }

    // updateLead() has no tenantId in its SQL WHERE; tenant is enforced above via getLeads.
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
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
