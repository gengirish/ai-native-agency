import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ data: store.brandProfiles })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
