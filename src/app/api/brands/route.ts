import { NextRequest, NextResponse } from "next/server"
import { getBrandProfiles } from "@/lib/dal"

export async function GET(_request: NextRequest) {
  try {
    const profiles = await getBrandProfiles()
    return NextResponse.json({ data: profiles })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
