"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import {
  ARTWORKS,
  MUSEUMS,
  RARITY_META,
  getArtwork,
  getMuseum,
  type Rarity,
} from "@/lib/data"
import { useCollection } from "@/lib/collection-store"
import { rarityStyles } from "@/lib/rarity"
import { Landmark, Palette, Globe, BadgeCheck } from "lucide-react"

const RARITY_HIGH_TO_LOW: Rarity[] = ["legendary", "epic", "rare", "common"]

export function ProfileScreen() {
  const { collected, count, loading } = useCollection()
  const total = ARTWORKS.length
  const progress = total ? Math.round((count / total) * 100) : 0

  const stats = useMemo(() => {
    const mine = ARTWORKS.filter((a) => collected[a.id])
    const artists = new Set(mine.map((a) => a.artistId))
    const museums = new Set(mine.map((a) => a.museumId))
    const countries = new Set(
      mine.map((a) => MUSEUMS[a.museumId]?.country).filter(Boolean),
    )
    const byRarity = RARITY_HIGH_TO_LOW.map((rarity) => {
      const works = ARTWORKS.filter((a) => a.rarity === rarity)
      const got = works.filter((w) => collected[w.id]).length
      return { rarity, got, total: works.length }
    })
    const recent = Object.values(collected)
      .slice()
      .sort((a, b) => (a.collectedAt < b.collectedAt ? 1 : -1))
      .slice(0, 5)
      .map((e) => ({ entry: e, artwork: getArtwork(e.artworkId) }))
      .filter((r) => r.artwork)
    return {
      artists: artists.size,
      museums: museums.size,
      countries: countries.size,
      byRarity,
      recent,
    }
  }, [collected])

  // Loading state — quiet skeleton, matches the ledger layout
  if (loading) {
    return (
      <div className="px-5 pb-28 pt-6">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="mt-3 h-10 w-56 rounded bg-muted" />
        <div className="mt-6 rule-t rule-b py-3">
          <div className="h-4 w-full rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pb-28 pt-6">
      {/* Masthead */}
      <header className="mb-6">
        <p className="label-caps text-muted-foreground">The Curator · Est. MMXXVI</p>
        <h1 className="mt-1 font-heading text-[2.5rem] font-bold leading-[0.95] tracking-tight">
          Your Collection
        </h1>

        {/* Acquisition ledger */}
        <div className="mt-6 rule-t rule-b py-3">
          <div className="flex items-baseline justify-between">
            <span className="label-caps text-muted-foreground">Works acquired</span>
            <span className="font-mono text-sm tabular-nums">
              <span className="font-heading text-2xl font-bold text-foreground">{count}</span>
              <span className="text-muted-foreground"> / {total}</span>
            </span>
          </div>
          <div className="mt-2 h-px w-full bg-border">
            <div
              className="h-px bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Empty state — collection not started */}
      {count === 0 ? (
        <div className="rule-b flex flex-col items-center gap-3 py-16 text-center">
          <Palette className="size-7 text-muted-foreground" />
          <p className="font-heading text-xl font-bold">An empty gallery</p>
          <p className="max-w-[15rem] text-sm text-muted-foreground">
            Visit a museum and capture your first masterpiece — it will be catalogued here.
          </p>
        </div>
      ) : (
        <>
          {/* Stat ledger */}
          <section className="mb-9 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border">
            <Stat icon={Palette} label="Works" value={count} />
            <Stat icon={BadgeCheck} label="Artists" value={stats.artists} />
            <Stat icon={Landmark} label="Museums" value={stats.museums} />
            <Stat icon={Globe} label="Countries" value={stats.countries} />
          </section>

          {/* Rarity breakdown */}
          <section className="mb-9">
            <h2 className="label-caps mb-4 text-muted-foreground">By rarity</h2>
            <div className="space-y-3.5">
              {stats.byRarity.map(({ rarity, got, total: t }) => {
                const s = rarityStyles[rarity]
                const pct = t ? Math.round((got / t) * 100) : 0
                return (
                  <div key={rarity}>
                    <div className="mb-1.5 flex items-center gap-2.5">
                      <span className={cn("size-2 rounded-full", s.dot)} />
                      <span className={cn("font-heading text-base font-bold", s.text)}>
                        {RARITY_META[rarity].label}
                      </span>
                      <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
                        {got}/{t}
                      </span>
                    </div>
                    <div className="h-px w-full bg-border">
                      <div
                        className={cn("h-px transition-all", s.dot)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent acquisitions */}
          {stats.recent.length > 0 && (
            <section>
              <h2 className="label-caps mb-4 text-muted-foreground">Recent acquisitions</h2>
              <ul>
                {stats.recent.map(({ entry, artwork }) => {
                  const a = artwork!
                  const s = rarityStyles[a.rarity]
                  const museum = getMuseum(a.museumId)
                  return (
                    <li
                      key={entry.artworkId}
                      className="rule-t flex items-baseline gap-3 py-3"
                    >
                      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", s.dot)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-heading text-base font-bold leading-tight">
                          {a.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {a.artist}
                          {museum ? ` · ${museum.city}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {entry.collectedAt}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Palette
  label: string
  value: number
}) {
  return (
    <div className="flex flex-col gap-1 bg-background p-4">
      <Icon className="size-4 text-muted-foreground" />
      <span className="font-heading text-3xl font-bold leading-none tabular-nums">
        {value}
      </span>
      <span className="label-caps text-muted-foreground">{label}</span>
    </div>
  )
}
