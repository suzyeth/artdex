"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Moment } from "@/lib/domain/moments";
import { MomentRelive } from "@/components/moment-relive";
import { getMuseum } from "@/lib/data";
import { stampDateLong, stampTime } from "@/lib/stamp-format";
import { cn } from "@/lib/utils";

// Photo-forward, dated vertical timeline of every moment a user captured this artwork in.
// `moments` arrives oldest-first from the store, so index 0 is the 初遇 (first encounter)
// and sits at the top; reunions follow downward in time.
export function MomentTimeline({ artworkId, moments }: { artworkId: string; moments: Moment[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ol>
        {moments.map((m, i) => {
          const museum = getMuseum(m.museumId);
          const first = i === 0;
          const last = i === moments.length - 1;
          const single = moments.length === 1;
          return (
            <li key={`${m.capturedAt}-${i}`} className="grid grid-cols-[16px_1fr] gap-x-4">
              {/* Timeline spine + node */}
              <div className="relative">
                {!single && (
                  <span
                    className={cn(
                      "absolute left-[7px] w-px bg-border",
                      first ? "top-2" : "top-0",
                      last ? "h-2" : "bottom-0",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "absolute left-[2px] top-1.5 size-2.5 rounded-full ring-4 ring-background",
                    first ? "bg-brass" : "border-[1.5px] border-muted-foreground/50 bg-background",
                  )}
                />
              </div>

              {/* Content — the photo is the body */}
              <div className={cn(last ? "pb-1" : "pb-7")}>
                <div className="flex items-baseline gap-2">
                  <span className={cn("label-caps", first ? "text-brass" : "text-muted-foreground")}>
                    {first ? "First encounter" : "Reunion"}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {stampDateLong(m.capturedAt)}
                  </span>
                </div>

                {museum && (
                  <p className="mb-2.5 mt-1 text-[11px] text-muted-foreground">
                    {museum.name}
                    {museum.city ? ` · ${museum.city}` : ""}
                  </p>
                )}

                <button
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View your ${first ? "first encounter" : "reunion"} photo, ${stampDateLong(m.capturedAt)}`}
                  className="relative block w-full overflow-hidden rounded-sm border border-border bg-muted transition-transform active:scale-[0.99]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photo || "/placeholder.svg"}
                    alt="Your captured moment"
                    className="block max-h-[64vh] w-full object-cover"
                  />
                  {stampTime(m.capturedAt) && (
                    <span className="absolute bottom-2 left-2 rounded-[2px] bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
                      {stampTime(m.capturedAt)}
                    </span>
                  )}
                </button>

                {m.note && (
                  <p className="mt-2.5 font-heading text-sm italic leading-relaxed text-muted-foreground">
                    {`“${m.note}”`}
                  </p>
                )}
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
