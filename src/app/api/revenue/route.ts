import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getRevenueMetrics } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getRevenueMetrics()
  return NextResponse.json({ data })
}
