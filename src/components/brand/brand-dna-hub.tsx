"use client"

import { useState, useEffect } from "react"
import { getBrandProfiles } from "@/lib/api"
import { RequireRole } from "@/components/auth/require-role"
import { EmptyState } from "@/components/ui/empty-state"
import type { BrandProfile } from "@/types"
import { BrandAssetsGrid } from "./brand-assets-grid"
import { BrandProfileCard } from "./brand-profile-card"
import { BrandSelector } from "./brand-selector"
import { ColorPaletteSection } from "./color-palette-section"
import { ToneOfVoiceCard } from "./tone-of-voice-card"
import { TypographySection } from "./typography-section"
import { UrlExtractCard } from "./url-extract-card"

export function BrandDnaHub() {
  const [profiles, setProfiles] = useState<BrandProfile[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getBrandProfiles()
        if (!cancelled) {
          setProfiles(data)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (profiles.length === 0) {
      setSelectedId("")
      return
    }
    setSelectedId((id) =>
      id && profiles.some((p) => p.id === id) ? id : profiles[0].id,
    )
  }, [profiles])

  const brand = profiles.find((p) => p.id === selectedId) ?? profiles[0]

  return (
    <RequireRole permission="brand:view">
      <div className="mx-auto max-w-6xl p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Brand DNA</h1>
          <p className="mt-1 text-slate-600">Client brand profiles, assets, and intelligence</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : profiles.length === 0 || !brand ? (
          <EmptyState
            title="No brand profiles"
            description="Create your first brand profile to get started."
          />
        ) : (
          <div className="flex flex-col gap-6">
            <BrandSelector
              profiles={profiles}
              selectedId={brand.id}
              onSelect={setSelectedId}
            />
            <BrandProfileCard brand={brand} />
            <ColorPaletteSection colors={brand.colors} />
            <TypographySection fonts={brand.fonts} />
            <div className="grid gap-6 lg:grid-cols-2">
              <ToneOfVoiceCard
                toneOfVoice={brand.toneOfVoice}
                values={brand.values}
                targetAudience={brand.targetAudience}
                competitors={brand.competitors}
              />
              <BrandAssetsGrid assets={brand.assets} />
            </div>
            <UrlExtractCard />
          </div>
        )}
      </div>
    </RequireRole>
  )
}
