import type { PublishingChannel } from "@/types"
import {
  Instagram,
  Linkedin,
  Mail,
  Megaphone,
  Music2,
  Twitter,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export const CHANNEL_LABELS: Record<PublishingChannel, string> = {
  instagram: "Instagram",
  meta_ads: "Meta Ads",
  linkedin: "LinkedIn",
  google_ads: "Google Ads",
  mailchimp: "Mailchimp",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
}

export const CHANNEL_ICONS: Record<PublishingChannel, LucideIcon> = {
  instagram: Instagram,
  meta_ads: Megaphone,
  linkedin: Linkedin,
  google_ads: Megaphone,
  mailchimp: Mail,
  twitter: Twitter,
  tiktok: Music2,
}

export function channelIconWrapClass(channel: PublishingChannel): string {
  const map: Record<PublishingChannel, string> = {
    instagram:
      "bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white shadow-sm",
    meta_ads: "bg-blue-600 text-white shadow-sm",
    linkedin: "bg-blue-700 text-white shadow-sm",
    google_ads:
      "bg-gradient-to-br from-blue-500 via-green-500 via-yellow-400 to-red-500 text-white shadow-sm",
    mailchimp: "bg-yellow-500 text-yellow-950 shadow-sm",
    twitter: "bg-sky-500 text-white shadow-sm",
    tiktok: "bg-slate-900 text-white shadow-sm",
  }
  return map[channel]
}

export function channelBadgeClass(channel: PublishingChannel): string {
  const map: Record<PublishingChannel, string> = {
    instagram:
      "border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 text-purple-800",
    meta_ads: "border border-blue-200 bg-blue-50 text-blue-800",
    linkedin: "border border-blue-300 bg-blue-50 text-blue-900",
    google_ads:
      "border border-slate-200 bg-gradient-to-r from-blue-50 via-green-50 to-amber-50 text-slate-800",
    mailchimp: "border border-yellow-300 bg-yellow-50 text-yellow-900",
    twitter: "border border-sky-200 bg-sky-50 text-sky-800",
    tiktok: "border border-slate-700 bg-slate-900 text-white",
  }
  return map[channel]
}
