import type { PublishingChannel } from "@/types"
import { Instagram, Linkedin, Mail, Megaphone, Twitter } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const CHANNEL_BAR_COLORS: Record<PublishingChannel, string> = {
  instagram: "#f43f5e",
  linkedin: "#2563eb",
  meta_ads: "#6366f1",
  google_ads: "#22c55e",
  mailchimp: "#eab308",
  twitter: "#0ea5e9",
  tiktok: "#000000",
}

export const CHANNEL_BG_SOFT: Record<PublishingChannel, string> = {
  instagram: "bg-rose-50 text-rose-700 border-rose-100",
  linkedin: "bg-blue-50 text-blue-700 border-blue-100",
  meta_ads: "bg-indigo-50 text-indigo-700 border-indigo-100",
  google_ads: "bg-green-50 text-green-700 border-green-100",
  mailchimp: "bg-yellow-50 text-yellow-800 border-yellow-100",
  twitter: "bg-sky-50 text-sky-700 border-sky-100",
  tiktok: "bg-slate-900 text-white border-slate-800",
}

export const CHANNEL_LABELS: Record<PublishingChannel, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  meta_ads: "Meta Ads",
  google_ads: "Google Ads",
  mailchimp: "Mailchimp",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
}

export const CHANNEL_ICONS: Record<PublishingChannel, LucideIcon> = {
  instagram: Instagram,
  linkedin: Linkedin,
  meta_ads: Megaphone,
  google_ads: Megaphone,
  mailchimp: Mail,
  twitter: Twitter,
  tiktok: Megaphone,
}

export function roiToneClass(roi: number): string {
  if (roi > 5) return "bg-emerald-700 text-white"
  if (roi >= 3) return "bg-emerald-600 text-white"
  if (roi >= 1) return "bg-emerald-400 text-emerald-950"
  return "bg-emerald-200 text-emerald-900"
}

export function roiTextClass(roi: number): string {
  if (roi > 5) return "text-emerald-800"
  if (roi >= 3) return "text-emerald-700"
  if (roi >= 1) return "text-emerald-600"
  return "text-emerald-500"
}
