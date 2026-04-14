import { NextRequest, NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  try {
    const data = await getDashboardStats()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
