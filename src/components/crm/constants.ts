import type { LeadStatus } from "@/types"

export const PIPELINE_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "demo_scheduled",
  "proposal_sent",
  "negotiating",
  "won",
  "lost",
]

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  demo_scheduled: "Demo Scheduled",
  proposal_sent: "Proposal Sent",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
}

export const STATUS_TOP_BORDER: Record<LeadStatus, string> = {
  new: "border-t-blue-500",
  contacted: "border-t-indigo-500",
  demo_scheduled: "border-t-purple-500",
  proposal_sent: "border-t-amber-500",
  negotiating: "border-t-orange-500",
  won: "border-t-green-500",
  lost: "border-t-red-500",
}
