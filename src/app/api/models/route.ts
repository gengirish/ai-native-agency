import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getAIModels } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const data = await getAIModels()
    return NextResponse.json({ data })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
