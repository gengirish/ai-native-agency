import { NextRequest, NextResponse } from "next/server"
import type { Lead } from "@/types"
import { store, uid } from "@/lib/store"

function nowIso(): string {
  return new Date().toISOString()
}

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ data: store.leads })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      company?: string
      contactName?: string
      email?: string
      value?: number
      source?: string
      notes?: string
    }

    const ts = nowIso()
    const lead: Lead = {
      id: uid("lead"),
      company: body.company ?? "",
      contactName: body.contactName ?? "",
      email: body.email ?? "",
      status: "new",
      value: typeof body.value === "number" ? body.value : 0,
      source: body.source ?? "",
      notes: body.notes ?? "",
      createdAt: ts,
      lastContactAt: ts,
    }

    store.leads.push(lead)
    return NextResponse.json({ data: lead }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
