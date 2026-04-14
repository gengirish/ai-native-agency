import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getPerformanceMetrics } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getPerformanceMetrics()
  return NextResponse.json({ data })
}
