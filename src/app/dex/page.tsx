import DexGrid, { type DexEntry } from "@/components/DexGrid";
import { artists, artworks } from "@/lib/db/seedData";
import { artistProgress } from "@/lib/domain/progress";
import type { Rarity } from "@/lib/domain/rarity";

// MOCK: pretend the user has collected these. Replaced by /api/collection in Phase 7.
const MOCK_COLLECTED = new Set([
  "starry-night",
  "sunflowers",
  "almond-blossom",
  "mona-lisa",
  "the-magpie",
  "girl-pearl-earring",
  "great-wave",
  "primavera",
]);

export default function DexPage() {
  const progress = artistProgress(
    MOCK_COLLECTED,
    artworks.map((w) => ({ id: w.id, artist_id: w.artistId }))
  );

  // artists with collected works first, then by name
  const sorted = [...artists].sort((a, b) => {
    const ca = progress[a.id]?.collected ?? 0;
    const cb = progress[b.id]?.collected ?? 0;
    if (ca !== cb) return cb - ca;
    return a.name.localeCompare(b.name);
  });

  const totalCollected = MOCK_COLLECTED.size;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-8">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My ArtDex</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {totalCollected} / {artworks.length} masterpieces collected
          </p>
        </div>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-zinc-800 sm:w-64">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300"
            style={{ width: `${(totalCollected / artworks.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="space-y-10">
        {sorted.map((artist) => {
          const works = artworks.filter((w) => w.artistId === artist.id);
          const p = progress[artist.id] ?? { collected: 0, total: works.length };
          const entries: DexEntry[] = works.map((w) => ({
            id: w.id,
            title: w.title,
            year: w.year,
            rarity: w.rarity as Rarity,
            imageUrl: w.imageUrl,
            collected: MOCK_COLLECTED.has(w.id),
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
