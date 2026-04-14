import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getCostBreakdown } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getCostBreakdown()
  return NextResponse.json({ data })
}
