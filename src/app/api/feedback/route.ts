import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getFeedbackTranslations } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const data = await getFeedbackTranslations()
  return NextResponse.json({ data })
}
