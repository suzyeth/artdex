"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ARTISTS, ARTWORKS, RARITY_META, type Rarity } from "@/lib/data"
import { useCollection } from "@/lib/collection-store"
import { DexCard } from "@/components/dex-card"
import { ArtworkDetailSheet } from "@/components/artwork-detail-sheet"
import { rarityStyles } from "@/lib/rarity"
import { Sparkles, Check } from "lucide-react"

type View = "artist" | "rarity"

export function DexScreen({ onPremium }: { onPremium: () => void }) {
  const { collected, count } = useCollection()
  const [view, setView] = useState<View>("artist")
  const [openId, setOpenId] = useState<string | null>(null)

  const total = ARTWORKS.length
  const progress = Math.round((count / total) * 100)

  const byArtist = useMemo(
    () =>
      ARTISTS.map((artist) => {
        const works = ARTWORKS.filter((a) => a.artistId === artist.id)
        const got = works.filter((w) => collected[w.id]).length
        return { artist, works, got }
      }).filter((g) => g.works.length > 0),
    [collected],
  )

  const byRarity = useMemo(() => {
    const rarities: Rarity[] = ["legendary", "epic", "rare", "common"]
    return rarities
      .map((rarity) => ({
        rarity,
        works: ARTWORKS.filter((a) => a.rarity === rarity),
      }))
      .filter((g) => g.works.length > 0)
  }, [])

  const openEntry = openId ? collected[openId] : null

  return (
    <div className="px-5 pb-28 pt-6">
      {/* Masthead */}
      <header className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="label-caps text-muted-foreground">The ArtDex · Est. MMXXVI</p>
            <h1 className="mt-1 font-heading text-[2.5rem] font-bold leading-[0.95] tracking-tight">
              The Collection
            </h1>
          </div>
          <button
            onClick={onPremium}
            className="mt-1 inline-flex items-center gap-1 border-b border-[oklch(0.5_0.09_80)] pb-0.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.46_0.09_80)]"
          >
            <Sparkles className="size-3" />
            Premium
          </button>
        </div>

        {/* Acquisition ledger line */}
        <div className="mt-6 rule-t rule-b py-3">
          <div className="flex items-baseline justify-between">
            <span className="label-caps text-muted-foreground">Works acquired</span>
            <span className="font-mono text-sm">
              <span className="font-heading text-2xl font-bold text-foreground">{count}</span>
              <span className="text-muted-foreground"> / {total}</span>
            </span>
          </div>
          <div className="mt-2 h-px w-full bg-border">
            <div className="h-px bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {/* Tabs — underlined editorial nav, not a pill switch */}
      <div className="mb-7 flex gap-6 border-b border-border">
        {(["artist", "rarity"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors",
              view === v ? "border-foreground text-foreground" : "border-transparent text-muted-foreground",
            )}
          >
            {v === "artist" ? "By Artist" : "By Rarity"}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === "artist" ? (
        <div className="space-y-9">
          {byArtist.map(({ artist, works, got }, idx) => {
            const complete = got === works.length
            return (
              <section key={artist.id}>
                <div className="mb-4 flex items-end justify-between border-b border-border pb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-heading text-xl font-bold leading-tight">{artist.name}</h2>
                      <p className="label-caps mt-0.5 text-muted-foreground">{artist.nationality}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-mono text-xs",
                      complete ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {got}/{works.length}
                    {complete && <Check className="size-3" />}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {works.map((w) => (
                    <DexCard key={w.id} artwork={w} collected={Boolean(collected[w.id])} onClick={() => setOpenId(w.id)} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <div className="space-y-9">
          {byRarity.map(({ rarity, works }) => {
            const got = works.filter((w) => collected[w.id]).length
            const s = rarityStyles[rarity]
            return (
              <section key={rarity}>
                <div className="mb-4 flex items-center gap-2.5 border-b border-border pb-2">
                  <span className={cn("size-2 rounded-full", s.dot)} />
                  <h2 className={cn("font-heading text-xl font-bold", s.text)}>{RARITY_META[rarity].label}</h2>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {got}/{works.length}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {works.map((w) => (
                    <DexCard key={w.id} artwork={w} collected={Boolean(collected[w.id])} onClick={() => setOpenId(w.id)} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}

      <ArtworkDetailSheet entry={openEntry} onClose={() => setOpenId(null)} />
    </div>
  )
}
