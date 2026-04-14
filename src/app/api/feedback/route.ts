import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getFeedbackTranslations } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const data = await getFeedbackTranslations()
    return NextResponse.json({ data })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
