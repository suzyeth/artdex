"use client";

import { useEffect, useState } from "react";
import DexGrid, { type DexEntry } from "@/components/DexGrid";
import { artists, artworks } from "@/lib/db/seedData";
import { artistProgress } from "@/lib/domain/progress";
import { RARITY_ORDER, type Rarity } from "@/lib/domain/rarity";
// MOCK: localStorage-backed collection until /api/collection lands in Phase 7.
import { getCollected, STARTER_COLLECTED } from "@/lib/mock/mockCollection";

const RARITY_LABELS: Record<Rarity, string> = {
  legendary: "Legendary",
  epic: "Epic",
  rare: "Rare",
  common: "Common",
};

type View = "artist" | "rarity";

function toEntry(w: (typeof artworks)[number], collected: Set<string>): DexEntry {
  return {
    id: w.id,
    title: w.title,
    year: w.year,
    rarity: w.rarity,
    imageUrl: w.imageUrl,
    collected: collected.has(w.id),
  };
}

export default function DexPage() {
  // render with the starter set first (SSR-safe), then hydrate from localStorage
  const [collected, setCollected] = useState<Set<string>>(new Set(STARTER_COLLECTED));
  const [view, setView] = useState<View>("artist");
  useEffect(() => {
    setCollected(getCollected());
  }, []);

  const progress = artistProgress(
    collected,
    artworks.map((w) => ({ id: w.id, artist_id: w.artistId }))
  );

  // artists with collected works first, then by name
  const sortedArtists = [...artists].sort((a, b) => {
    const ca = progress[a.id]?.collected ?? 0;
    const cb = progress[b.id]?.collected ?? 0;
    if (ca !== cb) return cb - ca;
    return a.name.localeCompare(b.name);
  });

  const byRarity = [...RARITY_ORDER].reverse(); // legendary first
  const totalCollected = collected.size;

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-6 text-zinc-100">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My ArtDex</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {totalCollected} / {artworks.length} masterpieces collected
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
            style={{ width: `${(totalCollected / artworks.length) * 100}%` }}
          />
        </div>
        <div className="mt-4 flex gap-2">
          {(["artist", "rarity"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                view === v
                  ? "bg-zinc-100 text-zinc-900"
                  : "border border-zinc-700 text-zinc-400"
              }`}
            >
              {v === "artist" ? "By Artist" : "By Rarity"}
            </button>
          ))}
        </div>
      </header>

      {view === "artist" ? (
        <div className="space-y-8">
          {sortedArtists.map((artist) => {
            const works = artworks.filter((w) => w.artistId === artist.id);
            const p = progress[artist.id] ?? { collected: 0, total: works.length };
            return (
              <section key={artist.id}>
                <div className="mb-3 flex items-baseline gap-3">
                  <h2 className="text-lg font-semibold">{artist.name}</h2>
                  <span
                    className={`text-sm font-medium ${
                      p.collected === p.total ? "text-amber-400" : "text-zinc-400"
                    }`}
                  >
                    {p.collected}/{p.total}
                    {p.collected === p.total && " ✦ complete"}
                  </span>
                  <span className="text-xs text-zinc-600">{artist.movement}</span>
                </div>
                <DexGrid entries={works.map((w) => toEntry(w, collected))} />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {byRarity.map((tier) => {
            const works = artworks.filter((w) => w.rarity === tier);
            const got = works.filter((w) => collected.has(w.id)).length;
            return (
              <section key={tier}>
                <div className="mb-3 flex items-baseline gap-3">
                  <h2
                    className={`text-lg font-semibold ${
                      tier === "legendary" ? "text-amber-400" : ""
                    }`}
                  >
                    {RARITY_LABELS[tier]}
                  </h2>
                  <span
                    className={`text-sm font-medium ${
                      got === works.length ? "text-amber-400" : "text-zinc-400"
                    }`}
                  >
                    {got}/{works.length}
                    {got === works.length && " ✦ complete"}
                  </span>
                </div>
                <DexGrid entries={works.map((w) => toEntry(w, collected))} />
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
