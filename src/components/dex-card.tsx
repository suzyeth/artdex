"use client"

import { cn } from "@/lib/utils"
import type { Artwork } from "@/lib/data"
import { rarityStyles } from "@/lib/rarity"
import { Lock } from "lucide-react"
import { motion } from "framer-motion"

export function DexCard({
  artwork,
  collected,
  onClick,
}: {
  artwork: Artwork
  collected: boolean
  onClick?: () => void
}) {
  const s = rarityStyles[artwork.rarity]

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={!collected}
      className={cn(
        "group relative aspect-[3/4] w-full overflow-hidden rounded-sm border text-left transition-colors",
        collected ? cn(s.border, "bg-card") : "border-border bg-secondary/60",
      )}
      aria-label={collected ? artwork.title : "Undiscovered artwork"}
    >
      {collected ? (
        <>
          <img
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.01_68)]/85 via-[oklch(0.18_0.01_68)]/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-2">
            <span className={cn("mb-1 block h-px w-4", s.dot)} />
            <p className="truncate font-heading text-[12px] font-semibold leading-tight text-white">{artwork.title}</p>
            <p className="truncate font-mono text-[9px] uppercase tracking-wider text-white/70">{artwork.year}</p>
          </div>
        </>
      ) : (
        <>
          {/* Faint silhouette teasing the shape */}
          <img
            src={artwork.image || "/placeholder.svg"}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover opacity-[0.06] grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <Lock className="size-4 text-muted-foreground/50" />
            <span className="font-mono text-sm tracking-widest text-muted-foreground/50">— —</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-2">
            <span className={cn("block h-px w-4 opacity-40", s.dot)} />
          </div>
        </>
      )}
    </motion.button>
  )
}
