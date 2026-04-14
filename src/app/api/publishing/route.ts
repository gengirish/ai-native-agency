import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getPublishing } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const { jobs, channels } = await getPublishing()
    return NextResponse.json({
      jobs,
      channels,
    })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
