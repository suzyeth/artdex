"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { MomentKind, StampStyle } from "@/lib/domain/moments";
import type { Rarity } from "@/lib/data";
import { rarityGradeFilter, rarityHalation } from "@/lib/rarity-fx";
import { MomentStamp } from "@/components/moment-stamp";
import { cn } from "@/lib/utils";

// An authentic instant-film frame: glossy near-white stock, near-square image, and the
// iconic thick bottom "chin" you write on. Shared by the develop overlay, the relive
// view, and the moment timeline so a captured Polaroid looks the same everywhere.
export function PolaroidCard({
  photo,
  museumName,
  city,
  capturedAt,
  kind,
  style,
  rarity = "common",
  size = "lg",
  showStamp = true,
  animateStamp = false,
  square = false,
  chinNote,
  photoNode,
}: {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  style: StampStyle;
  /** Drives the film grade + halation — rarer works develop richer (E/F). */
  rarity?: Rarity;
  size?: "sm" | "lg";
  showStamp?: boolean;
  /** Spring the postmark in (the develop climax). Off for static contexts. */
  animateStamp?: boolean;
  /** Crop the image to a square (the classic instant-film aperture). Off => full frame. */
  square?: boolean;
  /** Handwritten line inked across the chin. Falls back to the museum caption when absent. */
  chinNote?: string;
  /** Override the photo element (e.g. an animated develop image). Defaults to a static img. */
  photoNode?: ReactNode;
}) {
  const first = kind === "first";
  const lg = size === "lg";
  const halation = rarityHalation(rarity);
  return (
    <div
      className={cn(
        // glossy film stock, sharp corners (instant film isn't rounded)
        "rounded-[2px] bg-[oklch(0.987_0.007_86)]",
        lg ? "w-[82vw] max-w-sm p-3 pb-14 shadow-xl" : "w-full p-2 pb-10 shadow-md",
        first && "ring-1 ring-brass/50",
      )}
    >
      <div className={cn("relative overflow-hidden bg-muted", square && "aspect-square")}>
        {photoNode ?? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo || "/placeholder.svg"}
            alt="Your moment"
            className={cn("block w-full", square ? "h-full object-cover" : "max-h-[60vh] object-contain")}
            style={{ filter: rarityGradeFilter(rarity) }}
          />
        )}
        {/* F — warm halation bleeding from the highlights (epic / legendary only) */}
        {halation && (
          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: halation, mixBlendMode: "screen" }} />
        )}
        {/* developed-film vignette for depth */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 30px rgba(45,32,12,0.22), inset 0 0 8px rgba(45,32,12,0.12)" }}
        />
        {showStamp && style === "postmark" && (
          <motion.div
            className="absolute bottom-2 right-2"
            initial={animateStamp ? { scale: 1.6, opacity: 0 } : false}
            animate={animateStamp ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
          >
            <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="postmark" />
          </motion.div>
        )}
      </div>

      {chinNote ? (
        <p
          className={cn(
            "px-2 text-center font-hand leading-tight text-foreground/85",
            lg ? "pt-4 text-2xl" : "pt-3 text-lg",
          )}
        >
          {chinNote}
        </p>
      ) : (
        <p
          className={cn(
            "px-1 text-center font-heading italic text-muted-foreground",
            lg ? "pt-4 text-sm" : "pt-3 text-xs",
          )}
        >
          {museumName} · {city}
        </p>
      )}

      {showStamp && style === "ticket" && (
        <div className="px-1 pt-1">
          <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="ticket" />
        </div>
      )}
    </div>
  );
}
