import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getAIModels } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getAIModels()
  return NextResponse.json({ data })
}
