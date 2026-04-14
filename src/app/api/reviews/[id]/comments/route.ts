import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getUserFromRequest } from "@/lib/auth/jwt"
import { addReviewComment, getReviewById } from "@/lib/dal"

type PostBody = {
  content?: string
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 },
      )
    }

    const { id } = await context.params
    if (!(await getReviewById(id, user.tenantId))) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    let body: PostBody
    try {
      body = (await request.json()) as PostBody
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (typeof body.content !== "string" || !body.content.trim()) {
      return NextResponse.json({ error: "content is required" }, { status: 400 })
    }

    const comment = await addReviewComment(id, {
      author: user.name,
      authorRole: user.role,
      content: body.content,
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (err) {
    console.error(`[API] ${request.method} ${request.url}:`, err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
