import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth/jwt"
import { getBilling } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    const { invoices, creditPacks, usage } = await getBilling(user?.tenantId)
    return NextResponse.json({
      invoices,
      creditPacks,
      usage,
    })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
