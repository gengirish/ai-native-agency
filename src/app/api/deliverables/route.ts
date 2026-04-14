import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getDeliverables } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const deliverables = await getDeliverables()
    return NextResponse.json({ data: deliverables })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
