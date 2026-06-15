"use client"

import { cn } from "@/lib/utils"
import type { Artwork } from "@/lib/data"
import { rarityStyles } from "@/lib/rarity"
import { RarityBadge } from "@/components/rarity-badge"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo } from "react"

const RARITY_INTENSITY: Record<Artwork["rarity"], number> = {
  common: 1, rare: 2, epic: 3, legendary: 4,
}

// Synthesized capture chime + haptics — louder/longer arpeggio for higher rarity.
function playCelebration(rarity: Artwork["rarity"]) {
  const intensity = RARITY_INTENSITY[rarity] ?? 1
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const base = 523.25 // C5
    const steps = [0, 4, 7, 12].slice(0, intensity)
    steps.forEach((semi, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = base * 2 ** (semi / 12)
      osc.type = "triangle"
      const t = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.001, t)
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.6)
    })
  } catch {
    // audio is a nice-to-have; never break the flow
  }
  try {
    navigator.vibrate?.([40, 60, 40, 60, 80, 60, 160].slice(0, intensity * 2 - 1))
  } catch {
    // haptics optional
  }
}

function Particles({ rarity }: { rarity: Artwork["rarity"] }) {
  const count = rarity === "legendary" ? 40 : rarity === "epic" ? 26 : 16
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        angle: (i / count) * Math.PI * 2 + Math.random(),
        dist: 120 + Math.random() * 160,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 0.15,
      })),
    [count],
  )

  const colorClass =
    rarity === "legendary"
      ? "bg-[oklch(0.6_0.094_80)]"
      : rarity === "epic"
        ? "bg-[oklch(0.55_0.145_38)]"
        : rarity === "rare"
          ? "bg-[oklch(0.5_0.16_256)]"
          : "bg-[oklch(0.56_0.015_68)]"

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 1.1, delay: 0.25 + p.delay, ease: "easeOut" }}
          className={cn("absolute rounded-full", colorClass)}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  )
}

export function CaptureCelebration({
  artwork,
  onContinue,
}: {
  artwork: Artwork | null
  onContinue: () => void
}) {
  const isLegendary = artwork?.rarity === "legendary"
  const s = artwork ? rarityStyles[artwork.rarity] : null

  useEffect(() => {
    if (artwork) playCelebration(artwork.rarity)
  }, [artwork?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {artwork && s && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-background/96 px-8 backdrop-blur-md"
        >
          {/* Rarity glow wash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLegendary ? [0, 0.7, 0.3] : 0.22 }}
            transition={{ duration: 1, times: isLegendary ? [0, 0.2, 1] : undefined }}
            className={cn(
              "absolute inset-0",
              isLegendary
                ? "bg-[radial-gradient(circle_at_center,oklch(0.6_0.094_80/0.4),transparent_65%)]"
                : artwork.rarity === "epic"
                  ? "bg-[radial-gradient(circle_at_center,oklch(0.55_0.145_38/0.28),transparent_65%)]"
                  : "bg-[radial-gradient(circle_at_center,oklch(0.5_0.16_256/0.24),transparent_65%)]",
            )}
          />

          <p className="label-caps z-10 mb-1 text-muted-foreground">
            New Masterpiece
          </p>

          <div className="relative z-10 my-4 flex items-center justify-center">
            <Particles rarity={artwork.rarity} />
            <motion.div
              initial={{ rotateY: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 14, stiffness: 140, delay: 0.15 }}
              className={cn(
                "relative w-56 overflow-hidden rounded-2xl border-2 bg-card",
                s.border,
                s.glow,
              )}
              style={{ perspective: 1000 }}
            >
              <img
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                className="aspect-[3/4] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.01_68)]/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-balance text-sm font-bold leading-tight text-white">{artwork.title}</p>
                <p className="text-xs text-white/60">
                  {artwork.artist} · {artwork.year}
                </p>
              </div>
              {isLegendary && (
                <motion.div
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                />
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="z-10 flex flex-col items-center"
          >
            <h2 className="font-heading text-4xl font-bold tracking-tight text-primary">Collected</h2>
            <div className="mt-2">
              <RarityBadge rarity={artwork.rarity} size="md" />
            </div>
            <button
              onClick={onContinue}
              className="mt-8 bg-foreground px-10 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-background"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
