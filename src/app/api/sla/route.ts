import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { store } from "@/lib/store"

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    tiers: store.slaTiers,
    compliance: store.slaCompliance,
  })
}
