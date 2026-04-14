import { NextRequest, NextResponse } from "next/server"
import type { ProjectPriority, ProjectType } from "@/types"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { createProject, getProjects } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }
    const projects = await getProjects(user.tenantId)
    return NextResponse.json({ data: projects })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }

    const body = (await request.json()) as {
      title?: string
      type?: ProjectType
      priority?: ProjectPriority
      clientName?: string
      dueDate?: string
      budget?: number
    }

    const tenantId = user.tenantId ?? "t_demo"
    const createdBy = user.id

    const project = await createProject({
      tenantId,
      createdBy,
      title: body.title ?? "",
      type: body.type ?? "logo_design",
      priority: body.priority,
      clientName: body.clientName ?? "",
      dueDate: body.dueDate,
      budget: body.budget,
    })

    return NextResponse.json({ data: project }, { status: 201 })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
