"use client"

import { useRef, useState } from "react"
import { getArtwork, type Artwork } from "@/lib/data"
import { useCollection } from "@/lib/collection-store"
import { MatchSheet } from "@/components/match-sheet"
import { CaptureCelebration } from "@/components/capture-celebration"
import { BottomSheet } from "@/components/bottom-sheet"
import { RarityBadge } from "@/components/rarity-badge"
import { fetchCandidates } from "@/lib/api"
import type { Candidate } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Scan, ImageIcon, Zap } from "lucide-react"

type Phase = "idle" | "scanning"

// Demo museum: real Bedrock recognition is scoped to this museum's works on display.
const MUSEUM_ID = "moma"
const MAX_EDGE = 1024

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82)
      resolve({ base64: dataUrl.slice(dataUrl.indexOf(",") + 1), mediaType: "image/jpeg" })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("could not read image"))
    }
    img.src = url
  })
}

export function CaptureScreen() {
  const { collect, isCollected } = useCollection()
  const [phase, setPhase] = useState<Phase>("idle")
  const [matchId, setMatchId] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState<Artwork | null>(null)
  const [miss, setMiss] = useState(false)
  const [isRepro, setIsRepro] = useState(false)
  const [manual, setManual] = useState<Candidate[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function startScan() {
    if (phase === "scanning") return
    fileRef.current?.click()
  }

  async function openManual() {
    const candidates = await fetchCandidates(MUSEUM_ID)
    setManual(candidates)
  }

  async function onPhoto(file: File) {
    setMiss(false)
    setIsRepro(false)
    setPhase("scanning")
    try {
      const { base64, mediaType } = await fileToBase64(file)
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ museumId: MUSEUM_ID, imageBase64: base64, mediaType }),
      })
      const { artwork, isReproduction } = await res.json()
      setPhase("idle")
      if (artwork?.id) {
        setIsRepro(Boolean(isReproduction))
        setMatchId(artwork.id)
      } else {
        setMiss(true)
        openManual() // let the user pick from works on display
      }
    } catch {
      setPhase("idle")
      setMiss(true)
    }
  }

  function pickManual(id: string) {
    setManual(null)
    setIsRepro(false)
    setMatchId(id)
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
            <p className="text-xs text-muted-foreground">
              {miss ? "Couldn't identify it — try another angle" : "Frame the artwork inside the guides"}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-7 flex w-full max-w-sm items-center justify-between px-2">
        <button
          onClick={startScan}
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-transform active:scale-90"
          aria-label="Upload from library"
        >
          <ImageIcon className="size-5" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onPhoto(f)
            e.target.value = ""
          }}
        />

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
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-transform active:scale-90"
          aria-label="Toggle flash"
        >
          <Zap className="size-5" />
        </button>
      </div>

      <MatchSheet
        artworkId={matchId}
        alreadyCollected={matchId ? isCollected(matchId) : false}
        isReproduction={isRepro}
        onClose={() => setMatchId(null)}
        onCollect={handleCollect}
      />

      {/* Manual fallback — pick from the works currently on display */}
      <BottomSheet open={manual !== null} onClose={() => setManual(null)}>
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-1 text-center text-primary">Couldn&apos;t identify it</p>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            Pick the work from what&apos;s on display
          </p>
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {(manual ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => pickManual(c.id)}
                className="flex w-full items-center gap-3 rounded-sm border border-border p-2 text-left transition-colors active:bg-secondary/50"
              >
                <img
                  src={c.imageUrl || "/placeholder.svg"}
                  alt={c.title}
                  className="size-12 shrink-0 rounded-sm object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-sm font-semibold">{c.title}</span>
                  <span className="label-caps text-muted-foreground">{c.artistName}</span>
                </span>
                <RarityBadge rarity={c.rarity} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <CaptureCelebration artwork={celebrate} onContinue={() => setCelebrate(null)} />
    </div>
  )
}
