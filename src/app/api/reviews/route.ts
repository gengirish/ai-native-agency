import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getUserFromRequest } from "@/lib/auth/jwt"
import { getReviews } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    const reviews = await getReviews(user?.tenantId)
    return NextResponse.json({ data: reviews })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
