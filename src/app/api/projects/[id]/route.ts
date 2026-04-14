import { NextRequest, NextResponse } from "next/server"
import type { ProjectPriority, ProjectStatus } from "@/types"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { getProjectById, updateProject } from "@/lib/dal"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const project = await getProjectById(id)
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json({ data: project })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
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
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
