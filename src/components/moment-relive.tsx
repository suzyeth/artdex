"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Moment, MomentKind } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { useCollection } from "@/lib/collection-store";
import { PolaroidCard } from "@/components/polaroid-card";
import { getMuseum } from "@/lib/data";
import { stampDateLong } from "@/lib/stamp-format";
import { X } from "lucide-react";

export function MomentRelive({
  artworkId,
  index,
  moment,
  kind,
  onClose,
}: {
  artworkId: string;
  index: number;
  moment: Moment;
  kind: MomentKind;
  onClose: () => void;
}) {
  const [style] = useStampStyle();
  const { updateMomentNote } = useCollection();
  const [editing, setEditing] = useState(!moment.note);
  const [note, setNote] = useState(moment.note ?? "");
  const museum = getMuseum(moment.museumId);

  function save() {
    updateMomentNote(artworkId, index, note);
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto bg-background/96 px-6 py-12 backdrop-blur-md"
    >
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground">
        <X className="size-6" />
      </button>

      <PolaroidCard
        photo={moment.photo || "/placeholder.svg"}
        museumName={museum?.name ?? ""}
        city={museum?.city ?? ""}
        capturedAt={moment.capturedAt}
        kind={kind}
        style={style}
        size="lg"
      />

      <p className="mt-3 text-xs text-muted-foreground">
        {museum?.name}, {museum?.city} · {stampDateLong(moment.capturedAt)}
      </p>

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
    </motion.div>
  );
}
