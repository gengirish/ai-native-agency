"use client"

import { useState } from "react"
import { mockBrandProfiles } from "@/lib/mock-data"
import { BrandAssetsGrid } from "./brand-assets-grid"
import { BrandProfileCard } from "./brand-profile-card"
import { BrandSelector } from "./brand-selector"
import { ColorPaletteSection } from "./color-palette-section"
import { ToneOfVoiceCard } from "./tone-of-voice-card"
import { TypographySection } from "./typography-section"
import { UrlExtractCard } from "./url-extract-card"

export function BrandDnaHub() {
  const [selectedId, setSelectedId] = useState(mockBrandProfiles[0]?.id ?? "")
  const brand = mockBrandProfiles.find((p) => p.id === selectedId) ?? mockBrandProfiles[0]

  if (!brand) {
    return (
      <div className="p-8">
        <p className="text-slate-600">No brand profiles configured.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Brand DNA</h1>
        <p className="mt-1 text-slate-600">Client brand profiles, assets, and intelligence</p>
      </header>

      <div className="flex flex-col gap-6">
        <BrandSelector
          profiles={mockBrandProfiles}
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
    </div>
  )
}
