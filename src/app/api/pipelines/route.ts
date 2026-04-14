import { NextRequest, NextResponse } from "next/server"
import { getPipelines } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const data = await getPipelines()
    return NextResponse.json({ data })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
