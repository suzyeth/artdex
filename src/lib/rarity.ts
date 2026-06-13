import type { Rarity } from "@/lib/data"

interface RarityStyle {
  text: string
  border: string
  bg: string
  badgeBg: string
  glow: string
  ring: string
  dot: string
}

// Bright-gallery palette: muted, museum-label refinement instead of neon glow.
export const rarityStyles: Record<Rarity, RarityStyle> = {
  common: {
    text: "text-[oklch(0.5_0.015_68)]",
    border: "border-[oklch(0.5_0.015_68)]/25",
    bg: "bg-[oklch(0.5_0.015_68)]/8",
    badgeBg: "bg-[oklch(0.5_0.015_68)]/10 text-[oklch(0.42_0.015_68)] border-[oklch(0.5_0.015_68)]/20",
    glow: "shadow-soft",
    ring: "ring-[oklch(0.5_0.015_68)]/30",
    dot: "bg-[oklch(0.56_0.015_68)]",
  },
  rare: {
    text: "text-[oklch(0.5_0.16_256)]",
    border: "border-[oklch(0.5_0.16_256)]/35",
    bg: "bg-[oklch(0.5_0.16_256)]/8",
    badgeBg: "bg-[oklch(0.5_0.16_256)]/10 text-[oklch(0.45_0.16_256)] border-[oklch(0.5_0.16_256)]/25",
    glow: "shadow-[0_8px_24px_-12px_oklch(0.5_0.16_256/0.55)]",
    ring: "ring-[oklch(0.5_0.16_256)]/35",
    dot: "bg-[oklch(0.5_0.16_256)]",
  },
  epic: {
    text: "text-[oklch(0.52_0.15_38)]",
    border: "border-[oklch(0.55_0.145_38)]/40",
    bg: "bg-[oklch(0.55_0.145_38)]/8",
    badgeBg: "bg-[oklch(0.55_0.145_38)]/12 text-[oklch(0.48_0.15_38)] border-[oklch(0.55_0.145_38)]/28",
    glow: "shadow-[0_8px_26px_-12px_oklch(0.55_0.145_38/0.6)]",
    ring: "ring-[oklch(0.55_0.145_38)]/40",
    dot: "bg-[oklch(0.55_0.145_38)]",
  },
  legendary: {
    text: "text-[oklch(0.5_0.09_80)]",
    border: "border-[oklch(0.6_0.094_80)]/55",
    bg: "bg-[oklch(0.6_0.094_80)]/10",
    badgeBg: "bg-[oklch(0.6_0.094_80)]/14 text-[oklch(0.46_0.09_80)] border-[oklch(0.6_0.094_80)]/40",
    glow: "shadow-[0_10px_30px_-10px_oklch(0.6_0.094_80/0.7)]",
    ring: "ring-[oklch(0.6_0.094_80)]/55",
    dot: "bg-[oklch(0.6_0.094_80)]",
  },
}
