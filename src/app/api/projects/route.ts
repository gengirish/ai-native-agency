import { NextRequest, NextResponse } from "next/server"
import type { Project, ProjectPriority, ProjectType } from "@/types"
import { store, uid } from "@/lib/store"

function nowIso(): string {
  return new Date().toISOString()
}

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ data: store.projects })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      title?: string
      type?: ProjectType
      priority?: ProjectPriority
      clientName?: string
      dueDate?: string
      budget?: number
    }

    const ts = nowIso()
    const project: Project = {
      id: uid("proj"),
      title: body.title ?? "",
      type: body.type ?? "logo_design",
      status: "draft",
      priority: body.priority ?? "medium",
      clientId: uid("client"),
      clientName: body.clientName ?? "",
      estimatedCost: typeof body.budget === "number" ? body.budget : 0,
      actualCost: 0,
      aiCost: 0,
      confidenceScore: 0.75,
      autonomyLevel: "human_required",
      qualityScore: 0,
      dueDate: body.dueDate ?? ts,
      createdAt: ts,
      updatedAt: ts,
      deliverableCount: 0,
      revisionCount: 0,
    }

    store.projects.push(project)
    return NextResponse.json({ data: project }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
