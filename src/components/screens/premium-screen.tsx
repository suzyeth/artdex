"use client"

import { ArrowLeft, BarChart3, Ticket, Radar, Zap, Palette, Building2, Check } from "lucide-react"

const PERKS = [
  { icon: Palette, title: "Gilded passport skins", desc: "Premium card frames & animated foil for your Dex." },
  { icon: BarChart3, title: "Collector analytics", desc: "Track rarity ratios, streaks and completion stats." },
  { icon: Ticket, title: "Partner-museum discounts", desc: "Member pricing at 200+ galleries worldwide." },
  { icon: Radar, title: "Exhibition radar", desc: "Alerts when collectible works appear near you." },
  { icon: Zap, title: "Early drops", desc: "First access to limited legendary loan exhibitions." },
]

export function PremiumScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="px-5 pb-28 pt-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-opacity active:opacity-60"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      {/* Hero — editorial masthead */}
      <div className="border-b border-foreground pb-6">
        <p className="label-caps text-[oklch(0.5_0.09_80)]">ArtDex · Premium Membership</p>
        <h1 className="mt-3 text-balance font-heading text-[2.75rem] font-bold leading-[0.95]">
          Collect like a <span className="italic text-[oklch(0.5_0.09_80)]">connoisseur</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Unlock gilded passport skins, deep analytics and exclusive access to the world&apos;s greatest works.
        </p>
        <div className="mt-6 flex items-end gap-1.5">
          <span className="font-heading text-5xl font-bold tracking-tight">$3.99</span>
          <span className="mb-1.5 text-sm text-muted-foreground">/ month</span>
        </div>
      </div>

      {/* Perks — numbered ledger */}
      <ul className="mt-6">
        {PERKS.map((perk, idx) => {
          const Icon = perk.icon
          return (
            <li
              key={perk.title}
              className="flex items-start gap-4 border-b border-border py-4 animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="mt-0.5 text-[oklch(0.5_0.09_80)]">
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <p className="font-heading text-base font-semibold leading-tight">{perk.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{perk.desc}</p>
              </div>
              <Check className="mt-1 size-4 shrink-0 text-[oklch(0.5_0.09_80)]" />
            </li>
          )
        })}
      </ul>

      {/* Museums partner block */}
      <div className="mt-8 border-t border-foreground pt-5">
        <p className="label-caps text-muted-foreground">For Institutions</p>
        <h2 className="mt-2 font-heading text-xl font-bold">Partner with ArtDex</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Turn your collection into a living game. Drive foot traffic, unlock on-site legendaries and reach a new generation
          of visitors.
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 border-b border-foreground pb-0.5 text-sm font-medium transition-opacity active:opacity-60">
          <Building2 className="size-4" /> Get the partner kit
        </button>
      </div>

      {/* Sticky primary CTA — keeps the action in the thumb zone while reading */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-8 border-t border-border bg-background/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
        <button className="w-full bg-foreground py-4 text-sm font-semibold uppercase tracking-[0.15em] text-background transition-all active:scale-[0.99] active:opacity-90">
          Start 7-day free trial
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">Cancel anytime · Then $3.99/mo</p>
      </div>
    </div>
  )
}
