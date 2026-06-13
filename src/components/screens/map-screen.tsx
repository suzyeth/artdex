"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { ARTWORKS, MUSEUMS, type Rarity } from "@/lib/data"
import { useCollection } from "@/lib/collection-store"
import { rarityStyles } from "@/lib/rarity"
import { RarityBadge } from "@/components/rarity-badge"
import { BottomSheet } from "@/components/bottom-sheet"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const RARITY_RANK: Record<Rarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 }

// Approx lng/lat for each museum for the geographic projection.
const MUSEUM_COORDS: Record<string, [number, number]> = {
  moma: [-73.98, 40.76],
  louvre: [2.34, 48.86],
  rijks: [4.89, 52.36],
  metro: [139.77, 35.72],
  mauritshuis: [4.31, 52.08],
  orangerie: [2.32, 48.86],
}

export function MapScreen() {
  const { collected } = useCollection()
  const [openMuseum, setOpenMuseum] = useState<string | null>(null)

  // Group collected works by museum.
  const pins = useMemo(() => {
    const map = new Map<string, { museumId: string; works: typeof ARTWORKS; topRarity: Rarity }>()
    for (const id of Object.keys(collected)) {
      const art = ARTWORKS.find((a) => a.id === id)
      if (!art) continue
      const existing = map.get(art.museumId)
      if (existing) {
        existing.works.push(art)
        if (RARITY_RANK[art.rarity] > RARITY_RANK[existing.topRarity]) existing.topRarity = art.rarity
      } else {
        map.set(art.museumId, { museumId: art.museumId, works: [art], topRarity: art.rarity })
      }
    }
    return Array.from(map.values())
  }, [collected])

  const openData = openMuseum ? pins.find((p) => p.museumId === openMuseum) : null
  const openMuseumMeta = openMuseum ? MUSEUMS[openMuseum] : null

  return (
    <div className="px-5 pb-28 pt-6">
      <header className="mb-5 border-b border-border pb-4">
        <p className="label-caps text-muted-foreground">The ArtDex · Atlas</p>
        <h1 className="mt-1 font-heading text-[2.5rem] font-bold leading-[0.95] tracking-tight">World Map</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {pins.length} {pins.length === 1 ? "location" : "locations"} visited ·{" "}
          {Object.keys(collected).length} works captured
        </p>
      </header>

      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <ComposableMap
          projectionConfig={{ scale: 145 }}
          width={800}
          height={420}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="oklch(0.91 0.01 78)"
                  stroke="oklch(0.84 0.012 78)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "oklch(0.88 0.014 78)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {pins.map((pin) => {
            const coords = MUSEUM_COORDS[pin.museumId]
            if (!coords) return null
            const isGold = pin.topRarity === "legendary"
            return (
              <Marker key={pin.museumId} coordinates={coords} onClick={() => setOpenMuseum(pin.museumId)}>
                <g style={{ cursor: "pointer" }}>
                  <circle
                    r={11}
                    fill={isGold ? "oklch(0.6 0.094 80 / 0.22)" : "oklch(0.5 0.16 256 / 0.18)"}
                  />
                  <circle
                    r={6}
                    fill={isGold ? "oklch(0.6 0.094 80)" : "oklch(0.5 0.16 256)"}
                    stroke="oklch(0.995 0.004 80)"
                    strokeWidth={1.5}
                  />
                  <text
                    textAnchor="middle"
                    y={-13}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      fill: isGold ? "oklch(0.46 0.09 80)" : "oklch(0.45 0.16 256)",
                    }}
                  >
                    {pin.works.length}
                  </text>
                </g>
              </Marker>
            )
          })}
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 rule-t rule-b py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[oklch(0.6_0.094_80)]" /> Holds a legendary you caught
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[oklch(0.5_0.16_256)]" /> Visited location
        </span>
      </div>

      {/* Location list */}
      <div className="mt-2">
        {pins.map((pin) => {
          const m = MUSEUMS[pin.museumId]
          const isGold = pin.topRarity === "legendary"
          return (
            <button
              key={pin.museumId}
              onClick={() => setOpenMuseum(pin.museumId)}
              className="flex w-full items-center gap-3 border-b border-border py-3 text-left"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-sm",
                  isGold ? "bg-[oklch(0.6_0.094_80)]/15 text-[oklch(0.46_0.09_80)]" : "bg-[oklch(0.5_0.16_256)]/12 text-[oklch(0.45_0.16_256)]",
                )}
              >
                <MapPin className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-base font-semibold">{m.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {m.city}, {m.country}
                </span>
              </span>
              <span className="font-mono text-sm text-muted-foreground">{pin.works.length}</span>
            </button>
          )
        })}
      </div>

      {/* Pin popup */}
      <BottomSheet open={Boolean(openData)} onClose={() => setOpenMuseum(null)}>
        {openData && openMuseumMeta && (
          <div className="px-5 pb-8 pt-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <h2 className="font-heading text-xl font-bold leading-tight">{openMuseumMeta.name}</h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {openMuseumMeta.city}, {openMuseumMeta.country}
            </p>
            <div className="divide-y divide-border">
              {openData.works.map((w) => {
                const entry = collected[w.id]
                const s = rarityStyles[w.rarity]
                return (
                  <div key={w.id} className="flex items-center gap-3 py-2.5">
                    <div className={cn("size-14 shrink-0 overflow-hidden rounded-sm border", s.border)}>
                      <img
                        src={entry?.selfie || w.image || "/placeholder.svg"}
                        alt={entry?.selfie ? `Selfie with ${w.title}` : w.title}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{w.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{w.artist}</p>
                    </div>
                    <RarityBadge rarity={w.rarity} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
