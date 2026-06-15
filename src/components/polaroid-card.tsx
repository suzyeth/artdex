"use client";

import type { ReactNode } from "react";
import type { MomentKind } from "@/lib/domain/moments";
import type { StampStyle } from "@/lib/stamp-preference";
import { MomentStamp } from "@/components/moment-stamp";
import { cn } from "@/lib/utils";

export function PolaroidCard({
  photo,
  museumName,
  city,
  capturedAt,
  kind,
  style,
  size = "lg",
  showStamp = true,
  photoNode,
}: {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  style: StampStyle;
  size?: "sm" | "lg";
  showStamp?: boolean;
  /** Override the photo element (e.g. an animated develop image). Defaults to a static img. */
  photoNode?: ReactNode;
}) {
  const first = kind === "first";
  const lg = size === "lg";
  return (
    <div
      className={cn(
        "rounded-sm bg-card shadow-md",
        lg ? "w-[82vw] max-w-sm p-3 pb-4 shadow-xl" : "w-40 p-2 pb-3",
        first && "ring-2 ring-brass",
      )}
    >
      <div className="relative w-full overflow-hidden rounded-sm bg-muted">
        {photoNode ?? (
          <img src={photo || "/placeholder.svg"} alt="Your moment" className="block max-h-[60vh] w-full object-contain" />
        )}
        {showStamp && style === "postmark" && (
          <div className="absolute bottom-2 right-2">
            <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="postmark" />
          </div>
        )}
      </div>

      <p
        className={cn(
          "px-1 text-center font-heading italic text-muted-foreground",
          lg ? "pt-3 text-sm" : "pt-2 text-xs",
        )}
      >
        {museumName} · {city}
      </p>

      {showStamp && style === "ticket" && (
        <div className="px-1 pt-1">
          <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="ticket" />
        </div>
      )}
    </div>
  );
}
