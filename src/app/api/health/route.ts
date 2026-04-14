import { NextResponse } from "next/server"
import { getDb, hasDb } from "@/lib/db"

export const runtime = "edge"

export async function GET() {
  const status: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
  }

  if (hasDb()) {
    try {
      const sql = getDb()!
      await sql`SELECT 1`
      status.database = "connected"
    } catch {
      status.database = "error"
      status.status = "degraded"
    }
  } else {
    status.database = "not_configured"
  }

  const httpStatus = status.status === "ok" ? 200 : 503
  return NextResponse.json(status, { status: httpStatus })
}
