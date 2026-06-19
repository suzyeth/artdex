"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Moment } from "@/lib/domain/moments";
import { useCollection } from "@/lib/collection-store";
import { PolaroidCard } from "@/components/polaroid-card";
import { getArtwork, getMuseum } from "@/lib/data";
import { stampDateLong, stampTime } from "@/lib/stamp-format";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Full-screen immersive view of one moment, with swipe / arrows to move through the
// set and an editable memory at the bottom. `moments` is oldest-first (index 0 = 初遇).
export function MomentRelive({
  artworkId,
  moments,
  initialIndex,
  onClose,
}: {
  artworkId: string;
  moments: Moment[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const moment = moments[index];
  const style = moment.stampStyle ?? "postmark";
  const museum = getMuseum(moment.museumId);
  const rarity = getArtwork(artworkId)?.rarity ?? "common";
  const first = index === 0;
  const many = moments.length > 1;

  const go = useCallback(
    (dir: number) => setIndex((i) => Math.min(moments.length - 1, Math.max(0, i + dir))),
    [moments.length],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto bg-background/96 px-6 py-12 backdrop-blur-md"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-6" />
      </button>

      {many && (
        <div className="mb-5 flex items-center gap-1.5" aria-hidden>
          {moments.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-4 bg-foreground" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
      )}

      <div className="relative w-full max-w-sm">
        {many && index > 0 && (
          <button
            onClick={() => go(-1)}
            aria-label="Previous moment"
            className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/90 p-1.5 text-foreground shadow-soft transition-colors hover:bg-card"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        <motion.div
          key={index}
          drag={many ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(1);
            else if (info.offset.x > 60) go(-1);
          }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(many && "cursor-grab active:cursor-grabbing")}
        >
          <PolaroidCard
            photo={moment.photo || "/placeholder.svg"}
            museumName={museum?.name ?? ""}
            city={museum?.city ?? ""}
            capturedAt={moment.capturedAt}
            kind={first ? "first" : "reunion"}
            style={style}
            rarity={rarity}
            size="lg"
          />
        </motion.div>

        {many && index < moments.length - 1 && (
          <button
            onClick={() => go(1)}
            aria-label="Next moment"
            className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-card/90 p-1.5 text-foreground shadow-soft transition-colors hover:bg-card"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        <span className={cn(first && "text-brass")}>{first ? "First encounter" : "Reunion"}</span>
        <span>·</span>
        <span>{stampDateLong(moment.capturedAt)}</span>
        {stampTime(moment.capturedAt) && (
          <>
            <span>·</span>
            <span>{stampTime(moment.capturedAt)}</span>
          </>
        )}
      </p>

      <MemoryEditor key={index} artworkId={artworkId} index={index} note={moment.note} />
    </motion.div>
  );
}

// Keyed by `index` in the parent, so switching moments remounts it with fresh note state.
function MemoryEditor({ artworkId, index, note: initialNote }: { artworkId: string; index: number; note?: string }) {
  const { updateMomentNote } = useCollection();
  const [editing, setEditing] = useState(!initialNote);
  const [note, setNote] = useState(initialNote ?? "");

  function save() {
    setEditing(false);
    if (note === (initialNote ?? "")) return; // skip a no-op write
    updateMomentNote(artworkId, index, note);
  }

  return (
    <div className="mt-5 w-full max-w-sm">
      {editing ? (
        <>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add a memory of this moment…"
            className="w-full resize-none rounded-sm border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
          />
          <button
            onClick={save}
            className="mt-2 w-full bg-foreground py-3 text-sm font-semibold uppercase tracking-[0.15em] text-background"
          >
            Save memory
          </button>
        </>
      ) : (
        <button onClick={() => setEditing(true)} className="w-full border-l-2 border-foreground/30 pl-4 text-left">
          <p className="label-caps mb-1 text-muted-foreground">Your memory · tap to edit</p>
          <p className="font-heading text-base italic leading-relaxed text-foreground">{note}</p>
        </button>
      )}
    </div>
  );
}
