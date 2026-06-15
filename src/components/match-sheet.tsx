"use client"

import { useRef, useState } from "react"
import { BottomSheet } from "@/components/bottom-sheet"
import { RarityBadge } from "@/components/rarity-badge"
import { getArtwork, getMuseum } from "@/lib/data"
import { rarityStyles } from "@/lib/rarity"
import { uploadSelfie } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Sparkles, Lock, ImagePlus, MapPin, Check, AlertTriangle } from "lucide-react"

export function MatchSheet({
  artworkId,
  alreadyCollected,
  isReproduction,
  onClose,
  onCollect,
}: {
  artworkId: string | null
  alreadyCollected: boolean
  isReproduction?: boolean
  onClose: () => void
  onCollect: (note: string, selfie?: string) => void
}) {
  const artwork = artworkId ? getArtwork(artworkId) : undefined
  const museum = artwork ? getMuseum(artwork.museumId) : undefined
  const [note, setNote] = useState("")
  const [selfieKey, setSelfieKey] = useState<string | undefined>()
  const [selfiePreview, setSelfiePreview] = useState<string | undefined>()
  const [uploading, setUploading] = useState(false)
  const selfieRef = useRef<HTMLInputElement>(null)

  const isLegendary = artwork?.rarity === "legendary"
  const s = artwork ? rarityStyles[artwork.rarity] : null

  async function onSelfie(file: File) {
    setSelfiePreview(URL.createObjectURL(file))
    setUploading(true)
    const key = await uploadSelfie(file)
    setUploading(false)
    if (key) setSelfieKey(key)
  }

  function handleCollect() {
    onCollect(note, selfieKey)
    setNote("")
    setSelfieKey(undefined)
    setSelfiePreview(undefined)
  }

  return (
    <BottomSheet open={Boolean(artwork)} onClose={onClose}>
      {artwork && s && (
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-3 text-center text-primary">Match found</p>

          <div className="flex gap-4 border-b border-border pb-4">
            <div className={cn("size-24 shrink-0 overflow-hidden rounded-sm border", s.border)}>
              <img src={artwork.image || "/placeholder.svg"} alt={artwork.title} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-pretty font-heading text-xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
              <div className="mt-2">
                <RarityBadge rarity={artwork.rarity} size="md" />
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {museum?.name}, {museum?.city}
              </p>
            </div>
          </div>

          {isLegendary && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-primary bg-primary/5 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-primary">
                <span className="font-semibold">Legendary — on-site only.</span> This work can only be claimed inside{" "}
                {museum?.name}. Your location has been verified.
              </p>
            </div>
          )}

          {isReproduction && !alreadyCollected && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-[oklch(0.55_0.145_38)] bg-[oklch(0.55_0.145_38)]/8 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[oklch(0.5_0.145_38)]" />
              <p className="text-xs leading-relaxed text-[oklch(0.45_0.145_38)]">
                <span className="font-semibold">Looks like a reproduction.</span> This reads as a screen, postcard, or
                print, not the original. Collected, but go see the real thing.
              </p>
            </div>
          )}

          {alreadyCollected ? (
            <div className="mt-5 flex items-center justify-center gap-2 border border-border py-4 text-sm text-muted-foreground">
              <Check className="size-4 text-primary" /> Already in your collection
            </div>
          ) : (
            <>
              {/* Memory note */}
              <div className="mt-5">
                <label htmlFor="memory" className="label-caps mb-2 block text-muted-foreground">
                  Add a memory
                </label>
                <textarea
                  id="memory"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="What struck you about it?"
                  className="w-full resize-none rounded-sm border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
                />
              </div>

              {/* Selfie picker — real S3 upload */}
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onSelfie(f)
                  e.target.value = ""
                }}
              />
              <button
                onClick={() => selfieRef.current?.click()}
                className={cn(
                  "mt-3 flex w-full items-center gap-3 rounded-sm border p-3 text-left transition-colors",
                  selfiePreview ? "border-foreground bg-secondary/40" : "border-dashed border-border",
                )}
              >
                {selfiePreview ? (
                  <img src={selfiePreview} alt="Selfie preview" className="size-12 rounded-sm object-cover" />
                ) : (
                  <span className="flex size-12 items-center justify-center rounded-sm bg-secondary text-muted-foreground">
                    <ImagePlus className="size-5" />
                  </span>
                )}
                <span className="text-sm">
                  <span className="block font-medium text-foreground">
                    {uploading ? "Uploading…" : selfiePreview ? "Selfie added" : "Add a selfie with it"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selfiePreview ? "Tap to change" : "Optional"}
                  </span>
                </span>
              </button>

              <button
                onClick={handleCollect}
                disabled={uploading}
                className="mt-5 flex w-full items-center justify-center gap-2 bg-foreground py-4 text-sm font-semibold uppercase tracking-[0.15em] text-background transition-opacity active:opacity-90 disabled:opacity-60"
              >
                Collect <Sparkles className="size-4" />
              </button>
            </>
          )}
        </div>
      )}
    </BottomSheet>
  )
}
