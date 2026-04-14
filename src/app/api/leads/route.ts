import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { createLead, getLeads } from "@/lib/dal"
import { hasDb } from "@/lib/db"

export async function GET(_request: NextRequest) {
  try {
    const leads = await getLeads()
    return NextResponse.json({ data: leads })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (hasDb() && !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as {
      company?: string
      contactName?: string
      email?: string
      value?: number
      source?: string
      notes?: string
    }

    const lead = await createLead({
      tenantId: user?.tenantId ?? "t_demo",
      company: body.company ?? "",
      contactName: body.contactName ?? "",
      email: body.email ?? "",
      value: body.value,
      source: body.source,
      notes: body.notes,
    })

    return NextResponse.json({ data: lead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
