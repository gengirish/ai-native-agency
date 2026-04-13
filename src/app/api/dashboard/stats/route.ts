import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

function countActiveProjects(): number {
  return store.projects.filter(
    (p) => p.status !== "delivered" && p.status !== "draft",
  ).length
}

export async function GET(_request: NextRequest) {
  try {
    const activeProjects = countActiveProjects()
    const totalProjects = store.projects.length
    const data = {
      ...store.dashboardStats,
      activeProjects,
      totalProjects,
    }
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
