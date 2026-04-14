import { NextRequest, NextResponse } from "next/server"
import { getBilling } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  try {
    const { invoices, creditPacks, usage } = await getBilling()
    return NextResponse.json({
      invoices,
      creditPacks,
      usage,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
