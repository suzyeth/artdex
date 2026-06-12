"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import RarityBadge from "@/components/RarityBadge";
import type { Candidate } from "@/lib/types";

interface CollectSheetProps {
  artwork: Candidate;
  museumName: string;
  alreadyCollected: boolean;
  gateError: string | null;
  onCollect: (note: string) => void;
  onDismiss: () => void;
}

export default function CollectSheet({
  artwork,
  museumName,
  alreadyCollected,
  gateError,
  onCollect,
  onDismiss,
}: CollectSheetProps) {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onDismiss}>
      <motion.div
        className="w-full rounded-t-3xl border-t border-zinc-700 bg-zinc-900 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-700" />
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="h-28 w-20 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-widest text-emerald-400">Match found</p>
            <h2 className="truncate text-lg font-bold text-zinc-100">{artwork.title}</h2>
            <p className="text-sm text-zinc-400">
              {artwork.artistName} · {artwork.year}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <RarityBadge rarity={artwork.rarity} />
              <span className="text-xs text-zinc-500">at {museumName}</span>
            </div>
          </div>
        </div>

        {gateError ? (
          <p className="mt-4 rounded-lg bg-red-950/60 p-3 text-sm text-red-300">⛔ {gateError}</p>
        ) : alreadyCollected ? (
          <p className="mt-4 rounded-lg bg-zinc-800 p-3 text-sm text-zinc-400">
            Already in your Dex — capture something new!
          </p>
        ) : (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a memory… (optional)"
            rows={2}
            className="mt-4 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 rounded-full border border-zinc-700 py-3 font-semibold text-zinc-300"
          >
            Not this one
          </button>
          {!gateError && !alreadyCollected && (
            <button
              onClick={() => onCollect(note)}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 py-3 font-semibold text-amber-950"
            >
              Collect ✦
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
