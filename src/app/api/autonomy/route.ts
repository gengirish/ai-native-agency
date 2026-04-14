import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getAutonomyConfigs } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getAutonomyConfigs()
  return NextResponse.json({ data })
}
