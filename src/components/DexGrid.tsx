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

function DexCard({ entry, onSelect }: { entry: DexEntry; onSelect?: (id: string) => void }) {
  const clickable = entry.collected && !!onSelect;
  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onSelect!(entry.id) : undefined}
      onKeyDown={clickable ? (e) => e.key === "Enter" && onSelect!(entry.id) : undefined}
      className={`group relative overflow-hidden rounded-xl border bg-zinc-900 transition-transform hover:-translate-y-1 ${
        clickable ? "cursor-pointer" : ""
      } ${
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
              : "brightness-[0.32] grayscale contrast-110 blur-[2px]" // teasing silhouette: shape readable, details hidden
          }`}
        />
      </div>
      {!entry.collected && (
        <div className="absolute right-1.5 top-1.5 text-sm opacity-70">🔒</div>
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

export default function DexGrid({
  entries,
  onSelect,
}: {
  entries: DexEntry[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {entries.map((e) => (
        <DexCard key={e.id} entry={e} onSelect={onSelect} />
      ))}
    </div>
  );
}
