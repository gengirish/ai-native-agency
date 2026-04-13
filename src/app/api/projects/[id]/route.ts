import { NextRequest, NextResponse } from "next/server"
import type { ProjectPriority, ProjectStatus } from "@/types"
import { store } from "@/lib/store"

function nowIso(): string {
  return new Date().toISOString()
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const project = store.projects.find((p) => p.id === id)
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ data: project })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const project = store.projects.find((p) => p.id === id)
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = (await request.json()) as {
      status?: ProjectStatus
      priority?: ProjectPriority
      expertId?: string
    }

    if (body.status !== undefined) project.status = body.status
    if (body.priority !== undefined) project.priority = body.priority
    if (body.expertId !== undefined) project.expertId = body.expertId
    project.updatedAt = nowIso()

    return NextResponse.json({ data: project })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
