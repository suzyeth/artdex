"use client";

import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { MomentStrip } from "@/components/moment-strip";
import { getArtwork } from "@/lib/data";
import { useCollection } from "@/lib/collection-store";

export function ArtworkDetailSheet({
  artworkId,
  onClose,
}: {
  artworkId: string | null;
  onClose: () => void;
}) {
  const { momentsByArtwork } = useCollection();
  const artwork = artworkId ? getArtwork(artworkId) : undefined;
  const moments = artworkId ? momentsByArtwork[artworkId] ?? [] : [];

  return (
    <BottomSheet open={Boolean(artwork && moments.length > 0)} onClose={onClose}>
      {artwork && (
        <div className="px-5 pb-8 pt-3">
          <div className="overflow-hidden rounded-sm border border-border">
            <img src={artwork.image || "/placeholder.svg"} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
          </div>

          <div className="mt-4 flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-pretty font-heading text-2xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
            </div>
            <RarityBadge rarity={artwork.rarity} size="md" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{artwork.blurb}</p>

          {moments.length > 0 && (
            <div className="mt-5">
              <p className="label-caps mb-2 text-muted-foreground">
                Your moments · {moments.length}
              </p>
              <MomentStrip artworkId={artwork.id} moments={moments} />
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
