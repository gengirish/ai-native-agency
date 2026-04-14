import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getPublishing } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  const { jobs, channels } = await getPublishing()
  return NextResponse.json({
    jobs,
    channels,
  })
}
