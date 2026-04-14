import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSla } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const { tiers, compliance } = await getSla()
    return NextResponse.json({
      tiers,
      compliance,
    })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
