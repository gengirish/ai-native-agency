import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSla } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const { tiers, compliance } = await getSla()
  return NextResponse.json({
    tiers,
    compliance,
  })
}
