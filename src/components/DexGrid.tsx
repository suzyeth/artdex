import RarityBadge from "@/components/RarityBadge";
import type { Rarity } from "@/lib/domain/rarity";

export type DexEntry = {
  id: string;
  title: string;
  year: string;
  rarity: Rarity;
  imageUrl: string;
  collected: boolean;
};

function DexCard({ entry }: { entry: DexEntry }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-zinc-900 transition-transform hover:-translate-y-1 ${
        entry.rarity === "legendary" && entry.collected
          ? "border-amber-400/60"
          : "border-zinc-800"
      }`}
    >
      <div className="aspect-[3/4] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.imageUrl}
          alt={entry.collected ? entry.title : "Locked artwork"}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-300 ${
            entry.collected
              ? "group-hover:scale-105"
              : "brightness-[0.25] grayscale"
          }`}
        />
      </div>
      {!entry.collected && (
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🔒
        </div>
      )}
      <div className="space-y-1 p-2">
        <p className="truncate text-xs font-medium text-zinc-100">
          {entry.collected ? entry.title : "???"}
        </p>
        <div className="flex items-center justify-between">
          <RarityBadge rarity={entry.rarity} />
          <span className="text-[10px] text-zinc-500">{entry.year}</span>
        </div>
      </div>
    </div>
  );
}

export default function DexGrid({ entries }: { entries: DexEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {entries.map((e) => (
        <DexCard key={e.id} entry={e} />
      ))}
    </div>
  );
}
