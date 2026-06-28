"use client";

import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { MomentTimeline } from "@/components/moment-timeline";
import { getArtwork, getMuseum } from "@/lib/data";
import { useCollection } from "@/lib/collection-store";
import { cn } from "@/lib/utils";

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

          {/* Objective travel record from the catalog's exhibition data — distinct from
              the user's personal moments below. Shown only when the work has actually
              hung in more than one place. */}
          {artwork.journey.length > 1 && (() => {
            const today = new Date().toISOString().slice(0, 10);
            const cityCount = new Set(artwork.journey.map((s) => getMuseum(s.museumId)?.city)).size;
            return (
              <div className="mt-5 rounded-md border border-border bg-muted/30 p-3.5">
                <p className="label-caps mb-1 text-muted-foreground">Exhibition history</p>
                <p className="mb-3 text-xs text-muted-foreground">
                  This work has travelled across {cityCount} cities.
                </p>
                <ol className="space-y-2">
                  {artwork.journey.map((stop, i) => {
                    const m = getMuseum(stop.museumId);
                    const current = stop.start <= today && today <= stop.end;
                    return (
                      <li key={`${stop.museumId}-${i}`} className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className={cn("size-1.5 flex-none rounded-full", current ? "bg-brass" : "bg-muted-foreground/40")}
                        />
                        <span className="flex-none font-heading text-sm font-semibold">{m?.city}</span>
                        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{m?.name}</span>
                        <span
                          className={cn(
                            "flex-none font-mono text-xs tabular-nums",
                            current ? "text-brass" : "text-muted-foreground",
                          )}
                        >
                          {current ? `now · since '${stop.start.slice(2, 4)}` : `'${stop.start.slice(2, 4)}`}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })()}

          <div className="mt-6">
            <p className="label-caps mb-3 text-muted-foreground">Your moments · {moments.length}</p>
            <MomentTimeline artworkId={artwork.id} moments={moments} />
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
