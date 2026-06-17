"use client";

import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { MomentTimeline } from "@/components/moment-timeline";
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
          {/* Compact identity header — the official plate is demoted to a chip so the
              body belongs to the user's own photos. */}
          <div className="flex items-start gap-3 border-b border-border pb-3">
            <div className="h-[68px] w-[54px] flex-none overflow-hidden rounded-sm border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={artwork.image || "/placeholder.svg"} alt={artwork.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-pretty font-heading text-xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
            </div>
            <RarityBadge rarity={artwork.rarity} size="sm" />
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{artwork.blurb}</p>

          <div className="mt-6">
            <p className="label-caps mb-3 text-muted-foreground">Your moments · {moments.length}</p>
            <MomentTimeline artworkId={artwork.id} moments={moments} />
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
