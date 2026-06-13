"use client"

import { cn } from "@/lib/utils"
import { Grid2x2, Camera, Map, User } from "lucide-react"

export type Tab = "dex" | "capture" | "map" | "profile"

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  const items: { id: Tab; label: string; icon: typeof Grid2x2 }[] = [
    { id: "dex", label: "Dex", icon: Grid2x2 },
    { id: "capture", label: "Capture", icon: Camera },
    { id: "map", label: "Map", icon: Map },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around px-2">
        {items.map((item) => {
          const isActive = active === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 border-t-2 py-3 transition-colors",
                isActive ? "border-foreground" : "border-transparent",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.12em] transition-colors",
                  isActive ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
