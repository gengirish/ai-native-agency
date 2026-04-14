import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request)
  return NextResponse.json({ user: user ?? null })
}
