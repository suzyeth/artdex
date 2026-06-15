"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useCollection } from "@/lib/collection-store"
import { computeAchievements, type Achievement } from "@/lib/achievements"
import { Trophy } from "lucide-react"

// Watches the collection; when collecting a work newly unlocks an achievement,
// pops a gilded celebration (echoes the capture celebration). Sits above the
// nav (z-40) and bottom sheets (z-50) per the overlay ladder in DESIGN.md.
export function AchievementCelebration() {
  const { collected, loading } = useCollection()
  const seen = useRef<Set<string> | null>(null)
  const [queue, setQueue] = useState<Achievement[]>([])

  useEffect(() => {
    if (loading) return // wait for the collection to load before baselining
    const unlocked = computeAchievements(collected).filter((a) => a.unlocked)
    const ids = new Set(unlocked.map((a) => a.id))
    if (seen.current === null) {
      seen.current = ids // baseline after first load — don't celebrate existing
      return
    }
    const fresh = unlocked.filter((a) => !seen.current!.has(a.id))
    seen.current = ids
    if (fresh.length) setQueue((q) => [...q, ...fresh])
  }, [collected, loading])

  const current = queue[0]
  const dismiss = () => setQueue((q) => q.slice(1))

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key="ach-backdrop"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            key={current.id}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.82, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="w-full max-w-[320px] rounded-lg border border-[oklch(0.6_0.094_80)]/40 bg-card p-6 text-center shadow-[0_24px_70px_-24px_oklch(0.6_0.094_80/0.65)]"
          >
            <motion.div
              initial={{ scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 13 }}
              className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[oklch(0.6_0.094_80)]/15 text-[oklch(0.46_0.09_80)]"
            >
              <Trophy className="size-7" />
            </motion.div>
            <p className="label-caps text-[oklch(0.46_0.09_80)]">Achievement Unlocked</p>
            <h2 className="mt-1 font-heading text-2xl font-bold leading-tight">{current.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{current.desc}</p>
            <p className="mt-3 font-mono text-xs tabular-nums text-muted-foreground">
              {current.globalPct.toFixed(1)}% of collectors have this
            </p>
            <button
              onClick={dismiss}
              className="mt-5 w-full rounded-md bg-foreground py-3 text-sm font-semibold uppercase tracking-[0.12em] text-background transition-transform active:scale-[0.98]"
            >
              {queue.length > 1 ? `Next (${queue.length - 1} more)` : "Continue"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
