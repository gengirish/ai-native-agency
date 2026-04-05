"use client"

import { mockProjects } from "@/lib/mock-data"
import {
  cn,
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/lib/utils"
import type { Project, ProjectStatus } from "@/types"
import { formatProjectTypeLabel } from "@/components/brief/project-type-config"
import {
  Calendar,
  ClipboardList,
  FileText,
  Flag,
  Plus,
  Search,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

type StatusTab = "all" | "active" | "completed" | "draft"

const ACTIVE_STATUSES: ProjectStatus[] = [
  "submitted",
  "ai_generating",
  "qa_check",
  "expert_review",
  "client_review",
  "revision",
  "approved",
]

function statusLabel(status: ProjectStatus): string {
  return status.replace(/_/g, " ")
}

function matchesTab(project: Project, tab: StatusTab): boolean {
  if (tab === "all") return true
  if (tab === "draft") return project.status === "draft"
  if (tab === "completed") return project.status === "delivered"
  return ACTIVE_STATUSES.includes(project.status)
}

function ProjectCard({ project }: { project: Project }) {
  const typeBadge = formatProjectTypeLabel(project.type)
  const quality =
    project.qualityScore > 0 ? `${project.qualityScore.toFixed(1)} / 5` : "—"

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900">{project.title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">{project.clientName}</p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
            getPriorityColor(project.priority)
          )}
          title={`Priority: ${project.priority}`}
        >
          <Flag className="mr-1 h-3 w-3" />
          {project.priority}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {typeBadge}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
            getStatusColor(project.status)
          )}
        >
          {statusLabel(project.status)}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium text-slate-500">Due</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(project.dueDate)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Progress</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
            <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
            {project.deliverableCount} deliverables
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Quality</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-medium text-slate-800">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            {quality}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">Revisions</dt>
          <dd className="mt-0.5 font-medium text-slate-800">{project.revisionCount}</dd>
        </div>
      </dl>
    </article>
  )
}

export default function ProjectsPage() {
  const [tab, setTab] = useState<StatusTab>("all")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockProjects.filter((p) => {
      if (!matchesTab(p, tab)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        formatProjectTypeLabel(p.type).toLowerCase().includes(q)
      )
    })
  }, [tab, query])

  const tabs: { id: StatusTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "draft", label: "Draft" },
  ]

  return (
    <div className="p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
            <p className="text-sm text-slate-600">Track briefs, delivery, and quality in one place.</p>
          </div>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          New Brief
        </Link>
      </header>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                tab === t.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, client, or type…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search projects"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="font-medium text-slate-800">No projects match your filters</p>
          <p className="mt-1 text-sm text-slate-600">Try another tab or clear your search.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
