import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getDeliverables } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const deliverables = await getDeliverables()
  return NextResponse.json({ data: deliverables })
}
