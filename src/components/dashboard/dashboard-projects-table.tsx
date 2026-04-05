"use client"

import type { Project } from "@/types"
import { cn, formatDate, getPriorityColor, getStatusColor } from "@/lib/utils"
import { formatProjectType, formatStatusLabel } from "./format-project"

export function DashboardProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-semibold text-slate-900">Active projects</h2>
      <p className="mt-1 text-sm text-slate-500">In progress and awaiting delivery</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-3 pr-4 font-medium">Project</th>
              <th className="pb-3 pr-4 font-medium">Client</th>
              <th className="pb-3 pr-4 font-medium">Type</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Priority</th>
              <th className="pb-3 pr-4 font-medium">Due date</th>
              <th className="pb-3 font-medium">Quality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((p) => (
              <tr key={p.id} className="text-slate-800">
                <td className="py-3 pr-4 font-medium text-slate-900">{p.title}</td>
                <td className="py-3 pr-4 text-slate-600">{p.clientName}</td>
                <td className="py-3 pr-4 text-slate-600">{formatProjectType(p.type)}</td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getStatusColor(p.status)
                    )}
                  >
                    {formatStatusLabel(p.status)}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      getPriorityColor(p.priority)
                    )}
                  >
                    {p.priority}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-600">{formatDate(p.dueDate)}</td>
                <td className="py-3">
                  {p.qualityScore > 0 ? (
                    <span className="font-medium tabular-nums text-slate-900">
                      {p.qualityScore.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
