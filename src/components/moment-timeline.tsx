"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Moment } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { PolaroidCard } from "@/components/polaroid-card";
import { MomentRelive } from "@/components/moment-relive";
import { getMuseum } from "@/lib/data";
import { stampDateLong, stampYear } from "@/lib/stamp-format";
import { cn } from "@/lib/utils";

// Deterministic (SSR-safe) per-index scatter — varied tilt so the strip reads like a
// loose pile of physical instant photos, not a uniform list.
const TILT = [-2.4, 2.6, -1.7, 2.1, -2.8, 1.5];
const tiltOf = (i: number) => TILT[i % TILT.length];

// Photo-forward, dated timeline. `moments` arrives oldest-first (index 0 = 初遇, top).
export function MomentTimeline({ artworkId, moments }: { artworkId: string; moments: Moment[] }) {
  const [style] = useStampStyle();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ol>
        {moments.map((m, i) => {
          const museum = getMuseum(m.museumId);
          const first = i === 0;
          const last = i === moments.length - 1;
          const single = moments.length === 1;
          const tilt = tiltOf(i);
          const leanRight = i % 2 === 1;
          const [day, mon] = stampDateLong(m.capturedAt).split(" ");
          const taped = first || i % 2 === 0;

          return (
            <li key={`${m.capturedAt}-${i}`} className="grid grid-cols-[34px_1fr] gap-x-2.5">
              {/* Left rail — slim dated spine keeps the chronology */}
              <div className="relative pt-5 text-right">
                {!single && (
                  <span
                    className={cn(
                      "absolute left-[16px] w-px bg-border",
                      first ? "top-5" : "top-0",
                      last ? "h-5" : "bottom-0",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "absolute left-[11px] top-[22px] rounded-full ring-4 ring-background",
                    first ? "size-2.5 bg-brass" : "size-2 border-[1.5px] border-muted-foreground/50 bg-background",
                  )}
                />
                <div className="pr-0.5 font-mono text-[10px] leading-[1.35] tabular-nums text-muted-foreground">
                  <span className={cn(first && "text-brass")}>{day}</span>
                  <br />
                  {mon}
                  <br />
                  {stampYear(m.capturedAt)}
                </div>
              </div>

              {/* Right — the photo, as a tilted, taped instant-film keepsake */}
              <div className={cn("flex", last ? "pb-3" : "pb-9")}>
                <motion.button
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View your ${first ? "first encounter" : "reunion"}, ${stampDateLong(m.capturedAt)}`}
                  initial={{ opacity: 0, y: 16, rotate: tilt }}
                  animate={{ opacity: 1, y: 0, rotate: tilt }}
                  whileTap={{ scale: 0.98, rotate: tilt }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 170, damping: 16 }}
                  style={{ transformOrigin: "top center" }}
                  className={cn(
                    "relative block",
                    first ? "w-[82%]" : "w-[72%]",
                    leanRight ? "ml-auto mr-1" : "ml-1 mr-auto",
                  )}
                >
                  {taped && (
                    <span
                      aria-hidden
                      className="absolute -top-2 left-1/2 z-10 h-4 w-12 -translate-x-1/2 rotate-2 border border-[oklch(0.62_0.05_80/25%)] bg-[oklch(0.78_0.05_82/35%)]"
                    />
                  )}
                  <PolaroidCard
                    photo={m.photo || "/placeholder.svg"}
                    museumName={museum?.name ?? ""}
                    city={museum?.city ?? ""}
                    capturedAt={m.capturedAt}
                    kind={first ? "first" : "reunion"}
                    style={style}
                    size="sm"
                    square
                    chinNote={m.note}
                  />
                </motion.button>
              </div>
            </li>
          );
        })}
      </ol>

      <AnimatePresence>
        {openIndex !== null && (
          <MomentRelive
            artworkId={artworkId}
            moments={moments}
            initialIndex={openIndex}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
