import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getBenchmarks } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getBenchmarks()
  return NextResponse.json({ data })
}
