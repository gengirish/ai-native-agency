"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import type { ReviewComment, UserRole } from "@/types"
import { cn, formatRelativeTime, generateId, getStatusColor } from "@/lib/utils"

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function roleLabel(role: UserRole): string {
  if (role === "admin") return "Admin"
  if (role === "expert") return "Expert"
  return "Client"
}

type ReviewCommentsProps = {
  comments: ReviewComment[]
  onAddComment: (content: string) => void
}

export function ReviewComments({ comments, onAddComment }: ReviewCommentsProps) {
  const [draft, setDraft] = useState("")

  const submit = () => {
    const text = draft.trim()
    if (!text) return
    onAddComment(text)
    setDraft("")
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-900">Comments</h3>
      <ul className="space-y-3">
        {comments.map((c) => (
          <li
            key={c.id}
            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
              aria-hidden
            >
              {initials(c.author)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">{c.author}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    getStatusColor(
                      c.authorRole === "admin"
                        ? "expert_review"
                        : c.authorRole === "expert"
                          ? "expert_review"
                          : "client_review",
                    ),
                  )}
                >
                  {roleLabel(c.authorRole)}
                </span>
                <time className="text-xs text-slate-500">{formatRelativeTime(c.createdAt)}</time>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{c.content}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-2">
        <label htmlFor="review-comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="review-comment"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a comment…"
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export function createLocalComment(author: string, authorRole: UserRole, content: string): ReviewComment {
  return {
    id: generateId(),
    author,
    authorRole,
    content,
    createdAt: new Date().toISOString().slice(0, 10),
  }
}
