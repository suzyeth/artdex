"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getArtwork } from "@/lib/data"

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
  loading: boolean
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

// Backed by the real DynamoDB collection (/api/collection + /api/collect),
// keyed per browser by the anon cookie. Same shape the screens already consume.
export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collected, setCollected] = useState<Record<string, CollectedEntry>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/collection")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then(({ items }) => {
        const map: Record<string, CollectedEntry> = {}
        for (const it of items ?? []) {
          map[it.artworkId] = {
            artworkId: it.artworkId,
            note: it.note || undefined,
            selfie: it.selfieUrl || undefined,
            collectedAt: (it.collectedAt || "").slice(0, 10),
          }
        }
        setCollected(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const collect = useCallback((entry: CollectedEntry) => {
    setCollected((prev) => ({ ...prev, [entry.artworkId]: entry })) // optimistic
    const museumId = getArtwork(entry.artworkId)?.museumId
    fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artworkId: entry.artworkId,
        museumId,
        onSite: true, // the capture flow only fires once the user is "at" the museum
        note: entry.note,
        selfieUrl: entry.selfie,
      }),
    }).catch(() => {})
  }, [])

  const isCollected = useCallback((id: string) => Boolean(collected[id]), [collected])

  const value = useMemo<CollectionContextValue>(
    () => ({ collected, isCollected, collect, count: Object.keys(collected).length, loading }),
    [collected, isCollected, collect, loading],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}

export function useCollection() {
  const ctx = useContext(CollectionContext)
  if (!ctx) throw new Error("useCollection must be used within CollectionProvider")
  return ctx
}
