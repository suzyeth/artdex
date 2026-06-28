"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useCollection } from "@/lib/collection-store"
import { computeAchievements, type Achievement } from "@/lib/achievements"
import {
  ArrowLeft, Check, Lock, Sparkles, LayoutGrid, Trophy, Star, Gem,
  Palette, BadgeCheck, MapPin, Landmark, Globe, Crown,
} from "lucide-react"

const ICONS: Record<string, typeof Trophy> = {
  Sparkles, LayoutGrid, Trophy, Star, Gem, Palette, BadgeCheck, MapPin, Landmark, Globe, Crown,
}

// Lower global % = rarer achievement → more prestige (color = meaning).
function tone(pct: number) {
  if (pct < 5) return { text: "text-[oklch(0.46_0.09_80)]", bar: "bg-[oklch(0.6_0.094_80)]" } // brass
  if (pct < 15) return { text: "text-primary", bar: "bg-primary" } // cobalt
  return { text: "text-muted-foreground", bar: "bg-muted-foreground/40" }
}

export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  const { collected } = useCollection()
  // Live global unlock rates from the backend; falls back to static defaults.
  const [globalPct, setGlobalPct] = useState<Record<string, number> | undefined>(undefined)
  useEffect(() => {
    let alive = true
    fetch("/api/achievements/global")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d?.pct && Object.keys(d.pct).length) setGlobalPct(d.pct) })
      .catch(() => {})
    return () => { alive = false }
  }, [])
  const achievements = useMemo(() => computeAchievements(collected, globalPct), [collected, globalPct])

  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)
  const pctComplete = Math.round((unlocked.length / achievements.length) * 100)

  // rarest-first among unlocked; closest-to-done first among locked
  const ordered = [
    ...unlocked.slice().sort((a, b) => a.globalPct - b.globalPct),
    ...locked.slice().sort((a, b) => b.progress.current / b.progress.target - a.progress.current / a.progress.target),
  ]

  return (
    <div className="px-5 pb-28 pt-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-opacity active:opacity-60"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      {/* Masthead + completion ledger */}
      <header className="mb-6">
        <p className="label-caps text-muted-foreground">The ArtDex · Honors</p>
        <h1 className="mt-1 font-heading text-[2.5rem] font-bold leading-[0.95] tracking-tight">Achievements</h1>
        <div className="mt-6 rule-t rule-b py-3">
          <div className="flex items-baseline justify-between">
            <span className="label-caps text-muted-foreground">Unlocked</span>
            <span className="font-mono text-sm tabular-nums">
              <span className="font-heading text-2xl font-bold text-foreground">{unlocked.length}</span>
              <span className="text-muted-foreground"> / {achievements.length} · {pctComplete}%</span>
            </span>
          </div>
          <div className="mt-2 h-px w-full bg-border">
            <div className="h-px bg-primary transition-all" style={{ width: `${pctComplete}%` }} />
          </div>
        </div>
      </header>

      <ul>
        {ordered.map((a, i) => (
          <li
            key={a.id}
            className="rule-t py-4 animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <Row a={a} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Row({ a }: { a: Achievement }) {
  const Icon = ICONS[a.icon] ?? Trophy
  const t = tone(a.globalPct)
  const showProgress = !a.unlocked && a.progress.target > 1 && a.progress.current > 0
  const pct = a.progress.target ? Math.round((a.progress.current / a.progress.target) * 100) : 0

  return (
    <div className="flex items-start gap-3.5">
      {/* Icon tile — gilded when unlocked, muted when locked */}
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-md",
          a.unlocked
            ? "bg-[oklch(0.6_0.094_80)]/15 text-[oklch(0.46_0.09_80)]"
            : "bg-muted text-muted-foreground/45",
        )}
      >
        {a.unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className={cn("font-heading text-base font-bold leading-tight", !a.unlocked && "text-muted-foreground")}>
            {a.title}
          </h2>
          {a.unlocked && (
            <span className="inline-flex items-center gap-0.5 text-[oklch(0.46_0.09_80)]">
              <Check className="size-3.5" />
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>

        {/* Locked progress bar */}
        {showProgress && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-muted-foreground/50 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {a.progress.current}/{a.progress.target}
            </span>
          </div>
        )}

        {/* Global unlock rate — Steam-style "X% of collectors have this" */}
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 w-20 overflow-hidden rounded-full bg-border">
            <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${Math.max(3, Math.min(100, a.globalPct))}%` }} />
          </div>
          <span className={cn("font-mono text-[11px] tabular-nums", t.text)}>
            {a.globalPct.toFixed(1)}% of collectors
          </span>
        </div>
      </div>
    </div>
  )
}
