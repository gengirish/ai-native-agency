"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { Fragment, useMemo, useState } from "react"
import type { Invoice } from "@/types"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { InvoiceStatusBadge } from "@/components/billing/invoice-status-badge"

function isOutstanding(status: Invoice["status"]) {
  return status === "sent" || status === "draft" || status === "overdue"
}

export function InvoicesPanel({ invoices }: { invoices: Invoice[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const outstanding = invoices.filter((i) => isOutstanding(i.status))
    const paid = invoices.filter((i) => i.status === "paid")
    const overdueCount = invoices.filter((i) => i.status === "overdue").length
    return {
      totalOutstanding: outstanding.reduce((s, i) => s + i.amount, 0),
      totalPaid: paid.reduce((s, i) => s + i.amount, 0),
      overdueCount,
    }
  }, [invoices])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total outstanding</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatCurrency(stats.totalOutstanding)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total paid</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            {formatCurrency(stats.totalPaid)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{stats.overdueCount}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                <th className="w-10 px-4 py-3" aria-hidden />
                <th className="px-4 py-3 font-medium text-slate-700">Invoice ID</th>
                <th className="px-4 py-3 font-medium text-slate-700">Client</th>
                <th className="px-4 py-3 font-medium text-slate-700">Amount</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 font-medium text-slate-700">Created</th>
                <th className="px-4 py-3 font-medium text-slate-700">Due date</th>
                <th className="px-4 py-3 font-medium text-slate-700">Paid date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => {
                const open = expandedId === inv.id
                return (
                  <Fragment key={inv.id}>
                    <tr
                      role="button"
                      tabIndex={0}
                      onClick={() => setExpandedId(open ? null : inv.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setExpandedId(open ? null : inv.id)
                        }
                      }}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition hover:bg-slate-50/80",
                        index % 2 === 1 && "bg-slate-50/40",
                        open && "bg-indigo-50/30",
                      )}
                    >
                      <td className="px-4 py-3 text-slate-500">
                        {open ? (
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        ) : (
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-900">{inv.id}</td>
                      <td className="px-4 py-3 text-slate-900">{inv.clientName}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatCurrency(inv.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {inv.paidAt ? formatDate(inv.paidAt) : "—"}
                      </td>
                    </tr>
                    {open && (
                      <tr
                        key={`${inv.id}-detail`}
                        className={cn("border-b border-slate-100 bg-slate-50/80", index % 2 === 1 && "bg-slate-100/60")}
                      >
                        <td colSpan={8} className="px-4 py-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Line items
                          </p>
                          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
                            {inv.items.map((item, j) => (
                              <li
                                key={`${inv.id}-item-${j}`}
                                className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
                              >
                                <span className="text-slate-800">{item.description}</span>
                                <span className="text-slate-500">
                                  {item.quantity} × {formatCurrency(item.unitPrice)} ={" "}
                                  <span className="font-medium text-slate-900">
                                    {formatCurrency(item.total)}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
