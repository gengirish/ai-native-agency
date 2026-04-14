import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { getBrandProfiles } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    const profiles = await getBrandProfiles(user?.tenantId)
    return NextResponse.json({ data: profiles })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
