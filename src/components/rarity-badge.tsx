import { cn } from "@/lib/utils"
import { RARITY_META, type Rarity } from "@/lib/data"
import { rarityStyles } from "@/lib/rarity"
import { Sparkles } from "lucide-react"

export function RarityBadge({
  rarity,
  className,
  showIcon = true,
  size = "sm",
}: {
  rarity: Rarity
  className?: string
  showIcon?: boolean
  size?: "sm" | "md"
}) {
  const s = rarityStyles[rarity]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border font-semibold uppercase",
        size === "sm" ? "px-1.5 py-0.5 text-[10px] tracking-[0.15em]" : "px-2 py-0.5 text-[11px] tracking-[0.18em]",
        s.badgeBg,
        className,
      )}
    >
      {showIcon && rarity === "legendary" && <Sparkles className="size-3" />}
      {RARITY_META[rarity].label}
    </span>
  )
}
