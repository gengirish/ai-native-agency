import { NextRequest, NextResponse } from "next/server"
import { getPipelines } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  try {
    const data = await getPipelines()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
