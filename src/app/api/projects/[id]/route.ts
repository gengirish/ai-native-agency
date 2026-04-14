import { NextRequest, NextResponse } from "next/server"
import type { ProjectPriority, ProjectStatus } from "@/types"
import { getProjectById, updateProject } from "@/lib/dal"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const project = await getProjectById(id)
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
    const existing = await getProjectById(id)
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = (await request.json()) as {
      status?: ProjectStatus
      priority?: ProjectPriority
      expertId?: string
    }

    const project = await updateProject(id, {
      status: body.status,
      priority: body.priority,
      expertId: body.expertId,
    })
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ data: project })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
