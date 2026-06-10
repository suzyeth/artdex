import type { Rarity } from "@/lib/domain/rarity";

const STYLES: Record<Rarity, string> = {
  common: "bg-zinc-700 text-zinc-200",
  rare: "bg-sky-800 text-sky-100",
  epic: "bg-purple-800 text-purple-100",
  legendary: "bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
};

const LABELS: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export default function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STYLES[rarity]}`}
    >
      {LABELS[rarity]}
    </span>
  );
}
