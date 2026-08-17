"use client";

import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { getArtwork, getMuseum } from "@/lib/data";
import { rarityStyles } from "@/lib/rarity";
import { cn } from "@/lib/utils";
import type { StampStyle } from "@/lib/domain/moments";
import { Sparkles, Lock, MapPin, RotateCcw, AlertTriangle } from "lucide-react";

const HOLD_MS = 1000;

function SealButton({ onSeal }: { onSeal: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | null>(null);

  function start() {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      try {
        navigator.vibrate?.(30);
      } catch {
        // haptics optional
      }
      onSeal();
    }, HOLD_MS);
  }
  function cancel() {
    setHolding(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  // Clear a pending hold if the sheet unmounts mid-press.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      className="relative mt-5 w-full select-none overflow-hidden bg-foreground py-4 text-sm font-semibold uppercase tracking-[0.15em] text-background"
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        Hold to seal <Sparkles className="size-4" />
      </span>
      <span
        className="absolute inset-y-0 left-0 bg-brass ease-linear"
        style={{ width: holding ? "100%" : "0%", transitionProperty: "width", transitionDuration: holding ? `${HOLD_MS}ms` : "150ms" }}
      />
    </button>
  );
}

// 1st, 2nd, 3rd, 4th … for the "your Nth encounter" label.
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

export function MatchSheet({
  artworkId,
  alreadyCollected,
  priorVisits = 0,
  isReproduction,
  photoPreview,
  locationVerified,
  onClose,
  onSeal,
}: {
  artworkId: string | null;
  alreadyCollected: boolean;
  priorVisits?: number;
  isReproduction?: boolean;
  photoPreview?: string;
  locationVerified?: boolean;
  onClose: () => void;
  onSeal: (note: string, stampStyle: StampStyle) => void;
}) {
  const artwork = artworkId ? getArtwork(artworkId) : undefined;
  const museum = artwork ? getMuseum(artwork.museumId) : undefined;
  const [note, setNote] = useState("");
  // Stamp is chosen here, once, and fixed on the moment — not changeable afterward.
  const [stamp, setStamp] = useState<StampStyle>("postmark");

  const isLegendary = artwork?.rarity === "legendary";
  const legendaryBlocked = isLegendary && !locationVerified;
  const s = artwork ? rarityStyles[artwork.rarity] : null;

  function handleSeal() {
    onSeal(note, stamp);
    setNote("");
    setStamp("postmark");
  }

  return (
    <BottomSheet open={Boolean(artwork)} onClose={onClose}>
      {artwork && s && (
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-3 text-center text-primary">Match found</p>

          <div className="flex gap-4 border-b border-border pb-4">
            <div className={cn("size-24 shrink-0 overflow-hidden rounded-sm border", s.border)}>
              <img src={photoPreview || artwork.image || "/placeholder.svg"} alt={artwork.title} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-pretty font-heading text-xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
              <div className="mt-2">
                <RarityBadge rarity={artwork.rarity} size="md" />
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {museum?.name}, {museum?.city}
              </p>
            </div>
          </div>

          {isLegendary && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-primary bg-primary/5 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-primary">
                <span className="font-semibold">Legendary — on-site only.</span>{" "}
                {legendaryBlocked
                  ? `We couldn't confirm you're at ${museum?.name ?? "the museum"}. A legendary can only be sealed within 150 m of it.`
                  : `This work can only be sealed inside ${museum?.name ?? "the museum"}. Your location has been verified.`}
              </p>
            </div>
          )}

          {isReproduction && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-[oklch(0.55_0.145_38)] bg-[oklch(0.55_0.145_38)]/8 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[oklch(0.5_0.145_38)]" />
              <p className="text-xs leading-relaxed text-[oklch(0.45_0.145_38)]">
                <span className="font-semibold">Looks like a reproduction.</span> This reads as a print or screen, not the original artwork.
              </p>
            </div>
          )}

          {alreadyCollected && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-brass">
              <RotateCcw className="size-3.5" /> This will be your {ordinal(priorVisits + 1)} encounter
            </div>
          )}

          {/* Memory note */}
          <div className="mt-5">
            <label htmlFor="memory" className="label-caps mb-2 block text-muted-foreground">
              Add a memory
            </label>
            <textarea
              id="memory"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="What struck you about it?"
              className="w-full resize-none rounded-sm border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>

          {/* Keepsake stamp — picked here, once, then fixed on this moment */}
          <div className="mt-5">
            <span className="label-caps mb-2 block text-muted-foreground">Keepsake stamp</span>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
              {(["postmark", "ticket"] as StampStyle[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStamp(opt)}
                  className={cn(
                    "bg-card py-2.5 text-sm font-medium transition-colors",
                    stamp === opt ? "text-brass" : "text-muted-foreground",
                  )}
                >
                  {opt === "postmark" ? "Postmark" : "Ticket"}
                </button>
              ))}
            </div>
          </div>

          {legendaryBlocked ? (
            <p className="mt-5 w-full select-none border border-border bg-secondary/40 py-4 text-center text-xs text-muted-foreground">
              Seal this legendary once you&apos;re on-site
            </p>
          ) : (
            <SealButton onSeal={handleSeal} />
          )}
        </div>
      )}
    </BottomSheet>
  );
}
