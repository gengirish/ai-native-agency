import type { AIProvider } from "@/types"
import { cn } from "@/lib/utils"

export function providerBadgeClass(provider: AIProvider): string {
  const map: Record<AIProvider, string> = {
    openai: "bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    anthropic: "bg-orange-100 text-orange-800 ring-1 ring-inset ring-orange-200",
    midjourney: "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200",
    flux: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
    runway: "bg-pink-100 text-pink-800 ring-1 ring-inset ring-pink-200",
    elevenlabs: "bg-cyan-100 text-cyan-800 ring-1 ring-inset ring-cyan-200",
    replicate: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  }
  return cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize", map[provider])
}

export function providerLabel(provider: AIProvider): string {
  const labels: Record<AIProvider, string> = {
    openai: "OpenAI",
    anthropic: "Anthropic",
    midjourney: "Midjourney",
    flux: "Flux",
    runway: "Runway",
    elevenlabs: "ElevenLabs",
    replicate: "Replicate",
  }
  return labels[provider]
}
