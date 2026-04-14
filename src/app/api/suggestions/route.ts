import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSuggestions } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const data = await getSuggestions()
    return NextResponse.json({ data })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
