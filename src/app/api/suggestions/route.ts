import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSuggestions } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getSuggestions()
  return NextResponse.json({ data })
}
