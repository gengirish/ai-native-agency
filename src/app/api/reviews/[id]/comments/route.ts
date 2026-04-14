import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { addReviewComment, getReviewById } from "@/lib/dal"
import type { UserRole } from "@/types"

const roles: UserRole[] = ["admin", "expert", "client"]

function isUserRole(v: unknown): v is UserRole {
  return typeof v === "string" && roles.includes(v as UserRole)
}

type PostBody = {
  author?: string
  authorRole?: unknown
  content?: string
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!(await getReviewById(id))) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 })
  }

  let body: PostBody
  try {
    body = (await request.json()) as PostBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (
    typeof body.author !== "string" ||
    !body.author.trim() ||
    !isUserRole(body.authorRole) ||
    typeof body.content !== "string"
  ) {
    return NextResponse.json(
      { error: "author, authorRole, and content are required" },
      { status: 400 },
    )
  }

  const comment = await addReviewComment(id, {
    author: body.author.trim(),
    authorRole: body.authorRole,
    content: body.content,
  })

  return NextResponse.json(comment, { status: 201 })
}
