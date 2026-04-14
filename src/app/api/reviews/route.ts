import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getReviews } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const reviews = await getReviews()
  return NextResponse.json({ data: reviews })
}
