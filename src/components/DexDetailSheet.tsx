"use client";

import { motion } from "framer-motion";
import RarityBadge from "@/components/RarityBadge";
import type { CollectionItem } from "@/lib/types";

interface DexDetailSheetProps {
  item: CollectionItem;
  onDismiss: () => void;
}

/** The memory view: tap a collected work to relive when/where you caught it —
 *  big art, your selfie with it, your note. */
export default function DexDetailSheet({ item, onDismiss }: DexDetailSheetProps) {
  const date = item.collectedAt.slice(0, 10);
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onDismiss}>
      <motion.div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-zinc-700 bg-zinc-900 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-700" />

        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt={item.title} className="max-h-72 w-full object-cover" />
        </div>

        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">{item.title}</h2>
              <p className="text-sm text-zinc-400">{item.artistName}</p>
            </div>
            <RarityBadge rarity={item.rarity} />
          </div>

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-sm">
            <p className="text-xs uppercase tracking-widest text-emerald-400">Captured</p>
            <p className="mt-1 text-zinc-200">
              📍 {item.museumName ? `${item.museumName}, ${item.city}` : "Unknown location"}
            </p>
            <p className="text-zinc-500">🗓️ {date}</p>
          </div>

          {item.selfieUrl && (
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
                You &amp; the masterpiece
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.selfieUrl}
                alt="Your selfie with the artwork"
                className="max-h-64 w-full rounded-xl object-cover"
              />
            </div>
          )}

          {item.note && (
            <p className="mt-4 rounded-xl bg-zinc-800/80 p-3 text-sm italic text-zinc-300">
              &ldquo;{item.note}&rdquo;
            </p>
          )}

          <button
            onClick={onDismiss}
            className="mt-5 w-full rounded-full border border-zinc-700 py-3 font-semibold text-zinc-300"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
