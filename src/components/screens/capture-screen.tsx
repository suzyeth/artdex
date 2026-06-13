"use client"

import { useState } from "react"
import { ARTWORKS, getArtwork, type Artwork } from "@/lib/data"
import { useCollection } from "@/lib/collection-store"
import { MatchSheet } from "@/components/match-sheet"
import { CaptureCelebration } from "@/components/capture-celebration"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Scan, ImageIcon, Zap } from "lucide-react"

type Phase = "idle" | "scanning"

export function CaptureScreen() {
  const { collect, isCollected } = useCollection()
  const [phase, setPhase] = useState<Phase>("idle")
  const [matchId, setMatchId] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState<Artwork | null>(null)

  function startScan() {
    if (phase === "scanning") return
    setPhase("scanning")
    // Pick a random not-yet-collected work, else any work.
    const uncollected = ARTWORKS.filter((a) => !isCollected(a.id))
    const pool = uncollected.length > 0 ? uncollected : ARTWORKS
    const pick = pool[Math.floor(Math.random() * pool.length)]
    setTimeout(() => {
      setPhase("idle")
      setMatchId(pick.id)
    }, 2600)
  }

  function handleCollect(note: string, selfie?: string) {
    if (!matchId) return
    collect({
      artworkId: matchId,
      note: note || undefined,
      selfie,
      collectedAt: new Date().toISOString().slice(0, 10),
    })
    const art = getArtwork(matchId)
    setMatchId(null)
    if (art) setTimeout(() => setCelebrate(art), 220)
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-6">
      {/* Editorial header */}
      <div className="mx-auto mb-6 w-full max-w-sm border-b border-border pb-4 text-center">
        <p className="label-caps text-muted-foreground">Field Identification</p>
        <h1 className="mt-1 font-heading text-3xl font-bold leading-none">Capture a Work</h1>
        <p className="mt-2 text-sm text-muted-foreground">Point at any piece on display to identify &amp; collect</p>
      </div>

      {/* Viewfinder */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm border border-foreground/15 bg-secondary">
        {/* faux gallery wall */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.955_0.01_78),oklch(0.9_0.012_78))]" />
        <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-foreground/20 bg-card/70" />

        {/* corner frame guides */}
        {[
          "left-4 top-4 border-l-2 border-t-2 rounded-tl-lg",
          "right-4 top-4 border-r-2 border-t-2 rounded-tr-lg",
          "left-4 bottom-4 border-l-2 border-b-2 rounded-bl-lg",
          "right-4 bottom-4 border-r-2 border-b-2 rounded-br-lg",
        ].map((c) => (
          <span key={c} className={cn("absolute size-10 border-primary/70", c)} />
        ))}

        {/* scanning overlay */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ top: "12%" }}
                animate={{ top: ["12%", "88%", "12%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-6 h-0.5 bg-primary shadow-[0_0_16px_2px_var(--primary)]"
              />
              <Scan className="size-9 animate-pulse text-primary" />
              <p className="text-sm font-medium text-foreground">Matching against works on display…</p>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="size-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "idle" && (
          <div className="absolute inset-x-0 bottom-6 text-center">
            <p className="text-xs text-muted-foreground">Frame the artwork inside the guides</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-7 flex w-full max-w-sm items-center justify-between px-2">
        <button
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground"
          aria-label="Upload from library"
        >
          <ImageIcon className="size-5" />
        </button>

        <button
          onClick={startScan}
          disabled={phase === "scanning"}
          aria-label="Capture artwork"
          className="relative flex size-20 items-center justify-center rounded-full"
        >
          <span className="absolute inset-0 rounded-full border border-foreground/25" />
          <span className="absolute inset-1.5 rounded-full border border-foreground/15" />
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-foreground text-background transition-transform",
              phase === "scanning" ? "scale-90 opacity-70" : "active:scale-95",
            )}
          >
            <Scan className="size-6" />
          </span>
        </button>

        <button
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground"
          aria-label="Toggle flash"
        >
          <Zap className="size-5" />
        </button>
      </div>

      <MatchSheet
        artworkId={matchId}
        alreadyCollected={matchId ? isCollected(matchId) : false}
        onClose={() => setMatchId(null)}
        onCollect={handleCollect}
      />

      <CaptureCelebration artwork={celebrate} onContinue={() => setCelebrate(null)} />
    </div>
  )
}
