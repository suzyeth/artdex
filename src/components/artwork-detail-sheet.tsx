"use client"

import { BottomSheet } from "@/components/bottom-sheet"
import { RarityBadge } from "@/components/rarity-badge"
import { getArtwork, getMuseum } from "@/lib/data"
import type { CollectedEntry } from "@/lib/collection-store"
import { MapPin, CalendarDays } from "lucide-react"

export function ArtworkDetailSheet({
  entry,
  onClose,
}: {
  entry: CollectedEntry | null
  onClose: () => void
}) {
  const artwork = entry ? getArtwork(entry.artworkId) : undefined
  const museum = artwork ? getMuseum(artwork.museumId) : undefined

  const date = entry
    ? new Date(entry.collectedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <BottomSheet open={Boolean(entry && artwork)} onClose={onClose}>
      {artwork && (
        <div className="px-5 pb-8 pt-3">
          <div className="overflow-hidden rounded-sm border border-border">
            <img
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-pretty font-heading text-2xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
            </div>
            <RarityBadge rarity={artwork.rarity} size="md" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{artwork.blurb}</p>

          {entry?.selfie && (
            <div className="mt-5">
              <p className="label-caps mb-2 text-muted-foreground">Your selfie with it</p>
              <div className="overflow-hidden rounded-sm border border-border">
                <img src={entry.selfie || "/placeholder.svg"} alt="Your selfie with the artwork" className="aspect-video w-full object-cover" />
              </div>
            </div>
          )}

          {entry?.note && (
            <div className="mt-5 border-l-2 border-foreground/30 pl-4">
              <p className="label-caps mb-1 text-muted-foreground">Your memory</p>
              <p className="font-heading text-base italic leading-relaxed text-foreground">{entry.note}</p>
            </div>
          )}

          <div className="mt-6 rule-t flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              {museum?.name}, {museum?.city}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4 text-primary" />
              {date}
            </span>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
