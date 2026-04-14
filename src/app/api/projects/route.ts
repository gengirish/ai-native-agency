import { NextRequest, NextResponse } from "next/server"
import type { ProjectPriority, ProjectType } from "@/types"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { createProject, getProjects } from "@/lib/dal"
import { hasDb } from "@/lib/db"

export async function GET(_request: NextRequest) {
  try {
    const projects = await getProjects()
    return NextResponse.json({ data: projects })
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
      title?: string
      type?: ProjectType
      priority?: ProjectPriority
      clientName?: string
      dueDate?: string
      budget?: number
    }

    const tenantId = user?.tenantId ?? "t_demo"
    const createdBy = user?.id ?? "u_admin"

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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
