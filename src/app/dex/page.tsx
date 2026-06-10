"use client";

import { useEffect, useState } from "react";
import DexGrid, { type DexEntry } from "@/components/DexGrid";
import { artists, artworks } from "@/lib/db/seedData";
import { artistProgress } from "@/lib/domain/progress";
// MOCK: localStorage-backed collection until /api/collection lands in Phase 7.
import { getCollected, STARTER_COLLECTED } from "@/lib/mock/mockCollection";

export default function DexPage() {
  // render with the starter set first (SSR-safe), then hydrate from localStorage
  const [collected, setCollected] = useState<Set<string>>(new Set(STARTER_COLLECTED));
  useEffect(() => {
    setCollected(getCollected());
  }, []);

  const progress = artistProgress(
    collected,
    artworks.map((w) => ({ id: w.id, artist_id: w.artistId }))
  );

  // artists with collected works first, then by name
  const sorted = [...artists].sort((a, b) => {
    const ca = progress[a.id]?.collected ?? 0;
    const cb = progress[b.id]?.collected ?? 0;
    if (ca !== cb) return cb - ca;
    return a.name.localeCompare(b.name);
  });

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
      </header>

      <div className="space-y-8">
        {sorted.map((artist) => {
          const works = artworks.filter((w) => w.artistId === artist.id);
          const p = progress[artist.id] ?? { collected: 0, total: works.length };
          const entries: DexEntry[] = works.map((w) => ({
            id: w.id,
            title: w.title,
            year: w.year,
            rarity: w.rarity,
            imageUrl: w.imageUrl,
            collected: collected.has(w.id),
          }));
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
              <DexGrid entries={entries} />
            </section>
          );
        })}
      </div>
    </main>
  );
}
