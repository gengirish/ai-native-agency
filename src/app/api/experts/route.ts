import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getExpertAssignments } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getExpertAssignments()
  return NextResponse.json({ data })
}
