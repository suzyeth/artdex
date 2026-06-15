"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Moment } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { PolaroidCard } from "@/components/polaroid-card";
import { MomentRelive } from "@/components/moment-relive";
import { getMuseum } from "@/lib/data";

export function MomentStrip({ artworkId, moments }: { artworkId: string; moments: Moment[] }) {
  const [style] = useStampStyle();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // `moments` arrives oldest-first from the store, so index 0 is the 初遇.
  return (
    <>
      <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
        {moments.map((m, i) => {
          const museum = getMuseum(m.museumId);
          return (
            <button
              key={`${m.capturedAt}-${i}`}
              onClick={() => setOpenIndex(i)}
              className="shrink-0 snap-start transition-transform active:scale-[0.98]"
            >
              <PolaroidCard
                photo={m.photo || "/placeholder.svg"}
                museumName={museum?.name ?? ""}
                city={museum?.city ?? ""}
                capturedAt={m.capturedAt}
                kind={i === 0 ? "first" : "reunion"}
                style={style}
                size="sm"
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && moments[openIndex] && (
          <MomentRelive
            artworkId={artworkId}
            index={openIndex}
            moment={moments[openIndex]}
            kind={openIndex === 0 ? "first" : "reunion"}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
