"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export interface CollectedEntry {
  artworkId: string
  note?: string
  selfie?: string
  collectedAt: string // ISO date
}

interface CollectionContextValue {
  collected: Record<string, CollectedEntry>
  isCollected: (id: string) => boolean
  collect: (entry: CollectedEntry) => void
  count: number
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

// Seed a few works so the Dex feels alive on first load.
const SEED: Record<string, CollectedEntry> = {
  "starry-night": {
    artworkId: "starry-night",
    note: "Stood in front of it for twenty minutes. The blues are impossible to photograph.",
    selfie: "/selfies/selfie-1.png",
    collectedAt: "2026-05-18",
  },
  sunflowers: {
    artworkId: "sunflowers",
    note: "Brighter in person than any print I've ever seen.",
    selfie: "/selfies/selfie-2.png",
    collectedAt: "2026-04-02",
  },
  "water-lilies": {
    artworkId: "water-lilies",
    note: "The whole oval room wraps you in the pond. Dizzying.",
    collectedAt: "2026-03-21",
  },
  "great-wave": {
    artworkId: "great-wave",
    selfie: "/selfies/selfie-1.png",
    collectedAt: "2026-02-11",
  },
}

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collected, setCollected] = useState<Record<string, CollectedEntry>>(SEED)

  const collect = useCallback((entry: CollectedEntry) => {
    setCollected((prev) => ({ ...prev, [entry.artworkId]: entry }))
  }, [])

  const isCollected = useCallback((id: string) => Boolean(collected[id]), [collected])

  const value = useMemo<CollectionContextValue>(
    () => ({ collected, isCollected, collect, count: Object.keys(collected).length }),
    [collected, isCollected, collect],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error("useCollection must be used within CollectionProvider")
  return ctx
}
