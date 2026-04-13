import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ user })
}
