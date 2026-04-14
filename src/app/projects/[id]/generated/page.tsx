"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Sparkles,
  Zap,
} from "lucide-react"
import type { GenerationResult } from "@/lib/api"

export default function GeneratedPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [result, setResult] = useState<GenerationResult | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("agencyos:gen-result")
      if (raw) {
        const parsed = JSON.parse(raw) as GenerationResult
        if (parsed.deliverable?.projectId === projectId) {
          setResult(parsed)
          return
        }
      }
    } catch { /* noop */ }
    router.replace("/projects")
  }, [projectId, router])

  if (!result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  const { deliverable, generation } = result

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>

        <div className="mb-6 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">
                AI generation complete
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {deliverable.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Cpu className="h-3.5 w-3.5" />
                  {generation.model}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  {generation.provider}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {(generation.latencyMs / 1000).toFixed(1)}s
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {generation.tokensUsed.toLocaleString()} tokens
                </span>
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  ${generation.cost.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Generated deliverable
            </h2>
            <p className="text-xs text-slate-500">
              This is a real AI-generated output, not mock data
            </p>
          </div>
          <div className="px-6 py-5">
            <div className="prose prose-sm prose-slate max-w-none">
              <MarkdownContent content={generation.content} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/projects"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to projects
          </Link>
          <Link
            href="/reviews"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Send to review
          </Link>
        </div>
      </div>
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let listItems: string[] = []

  const flushList = () => {
    if (listItems.length === 0) return
    elements.push(
      <ul key={`list-${elements.length}`} className="my-2 list-disc pl-5 space-y-1">
        {listItems.map((li, i) => (
          <li key={i}>{li}</li>
        ))}
      </ul>,
    )
    listItems = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith("### ")) {
      flushList()
      elements.push(
        <h3 key={i} className="mt-5 mb-2 text-base font-semibold text-slate-900">
          {trimmed.slice(4)}
        </h3>,
      )
    } else if (trimmed.startsWith("## ")) {
      flushList()
      elements.push(
        <h2 key={i} className="mt-6 mb-2 text-lg font-bold text-slate-900">
          {trimmed.slice(3)}
        </h2>,
      )
    } else if (trimmed.startsWith("# ")) {
      flushList()
      elements.push(
        <h1 key={i} className="mt-6 mb-3 text-xl font-bold text-slate-900">
          {trimmed.slice(2)}
        </h1>,
      )
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.slice(2))
    } else if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ""))
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      flushList()
      elements.push(
        <p key={i} className="my-2 font-semibold text-slate-800">
          {trimmed.slice(2, -2)}
        </p>,
      )
    } else if (trimmed === "---") {
      flushList()
      elements.push(<hr key={i} className="my-4 border-slate-200" />)
    } else if (trimmed === "") {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={i} className="my-2 text-slate-700 leading-relaxed">
          {renderInline(trimmed)}
        </p>,
      )
    }
  }
  flushList()

  return <>{elements}</>
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}
