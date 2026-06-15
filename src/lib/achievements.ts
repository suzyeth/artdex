// Steam-style achievement system. Pure logic: derive unlock state + progress
// from the user's collection. `globalPct` is the share of collectors who have
// unlocked each one ("rarity" of the achievement) — static for now; wire to a
// real /api/achievements/global aggregation later (see GLOBAL_PCT seam below).
import { ARTWORKS, MUSEUMS, type Rarity } from "@/lib/data"
import type { CollectedEntry } from "@/lib/collection-store"

export interface Achievement {
  id: string
  title: string
  desc: string
  icon: string // lucide icon name, mapped in the screen
  globalPct: number // % of collectors who have unlocked this
  unlocked: boolean
  progress: { current: number; target: number }
}

interface Metrics {
  count: number
  byRarity: Record<Rarity, number>
  raritiesCovered: number
  museumsVisited: number
  artistsComplete: number
  ngGot: number
  ngTotal: number
  totalWorks: number
  totalMuseums: number
}

function metricsOf(collected: Record<string, CollectedEntry>): Metrics {
  const mine = ARTWORKS.filter((a) => collected[a.id])
  const byRarity: Record<Rarity, number> = { common: 0, rare: 0, epic: 0, legendary: 0 }
  for (const w of mine) byRarity[w.rarity]++

  const artistTotals = new Map<string, { total: number; got: number }>()
  for (const a of ARTWORKS) {
    const e = artistTotals.get(a.artistId) ?? { total: 0, got: 0 }
    e.total++
    if (collected[a.id]) e.got++
    artistTotals.set(a.artistId, e)
  }
  const artistsComplete = [...artistTotals.values()].filter((e) => e.got === e.total).length

  const ng = ARTWORKS.filter((a) => a.museumId === "nationalgallery")

  return {
    count: mine.length,
    byRarity,
    raritiesCovered: (Object.keys(byRarity) as Rarity[]).filter((r) => byRarity[r] > 0).length,
    museumsVisited: new Set(mine.map((w) => w.museumId)).size,
    artistsComplete,
    ngGot: ng.filter((a) => collected[a.id]).length,
    ngTotal: ng.length,
    totalWorks: ARTWORKS.length,
    totalMuseums: Object.keys(MUSEUMS).length,
  }
}

// (id, title, desc, icon, globalPct, evaluate). Keep ordered hardest-last.
type Def = {
  id: string
  title: string
  desc: string
  icon: string
  globalPct: number
  evaluate: (m: Metrics) => { unlocked: boolean; progress: { current: number; target: number } }
}

const milestone = (n: number) => (m: Metrics) => ({
  unlocked: m.count >= n,
  progress: { current: Math.min(m.count, n), target: n },
})

const DEFS: Def[] = [
  { id: "first", title: "First Acquisition", desc: "Collect your first masterpiece.", icon: "Sparkles", globalPct: 91.4, evaluate: milestone(1) },
  { id: "dozen", title: "A Dozen Masterpieces", desc: "Collect 10 works.", icon: "LayoutGrid", globalPct: 46.2, evaluate: milestone(10) },
  { id: "serious", title: "Serious Collector", desc: "Collect 25 works.", icon: "Trophy", globalPct: 17.8, evaluate: milestone(25) },
  {
    id: "legendary", title: "Legendary Hunter", desc: "Collect a legendary work.", icon: "Star", globalPct: 23.5,
    evaluate: (m) => ({ unlocked: m.byRarity.legendary >= 1, progress: { current: Math.min(m.byRarity.legendary, 1), target: 1 } }),
  },
  {
    id: "gilded3", title: "Gilded Trio", desc: "Collect 3 legendary works.", icon: "Gem", globalPct: 6.1,
    evaluate: (m) => ({ unlocked: m.byRarity.legendary >= 3, progress: { current: Math.min(m.byRarity.legendary, 3), target: 3 } }),
  },
  {
    id: "spectrum", title: "Full Spectrum", desc: "Hold at least one of every rarity.", icon: "Palette", globalPct: 14.7,
    evaluate: (m) => ({ unlocked: m.raritiesCovered >= 4, progress: { current: m.raritiesCovered, target: 4 } }),
  },
  {
    id: "connoisseur", title: "Connoisseur", desc: "Complete every work by one artist.", icon: "BadgeCheck", globalPct: 11.9,
    evaluate: (m) => ({ unlocked: m.artistsComplete >= 1, progress: { current: Math.min(m.artistsComplete, 1), target: 1 } }),
  },
  {
    id: "globetrotter", title: "Globetrotter", desc: "Visit 3 museums.", icon: "MapPin", globalPct: 29.8,
    evaluate: (m) => ({ unlocked: m.museumsVisited >= 3, progress: { current: Math.min(m.museumsVisited, 3), target: 3 } }),
  },
  {
    id: "national-treasure", title: "National Treasure", desc: "Collect every work at the National Gallery.", icon: "Landmark", globalPct: 3.7,
    evaluate: (m) => ({ unlocked: m.ngTotal > 0 && m.ngGot >= m.ngTotal, progress: { current: m.ngGot, target: m.ngTotal } }),
  },
  {
    id: "grand-tour", title: "The Grand Tour", desc: "Visit every museum on the atlas.", icon: "Globe", globalPct: 2.4,
    evaluate: (m) => ({ unlocked: m.museumsVisited >= m.totalMuseums, progress: { current: m.museumsVisited, target: m.totalMuseums } }),
  },
  {
    id: "complete", title: "The Complete Collection", desc: "Collect every work in the Dex.", icon: "Crown", globalPct: 1.3,
    evaluate: (m) => ({ unlocked: m.count >= m.totalWorks, progress: { current: m.count, target: m.totalWorks } }),
  },
]

// Seam for real global data: replace these defaults with values from
// /api/achievements/global (unlockedUsers / totalUsers * 100) when available.
export const GLOBAL_PCT: Record<string, number> = Object.fromEntries(DEFS.map((d) => [d.id, d.globalPct]))

export function computeAchievements(
  collected: Record<string, CollectedEntry>,
  globalPct: Record<string, number> = GLOBAL_PCT,
): Achievement[] {
  const m = metricsOf(collected)
  return DEFS.map((d) => {
    const { unlocked, progress } = d.evaluate(m)
    return { id: d.id, title: d.title, desc: d.desc, icon: d.icon, globalPct: globalPct[d.id] ?? d.globalPct, unlocked, progress }
  })
}
