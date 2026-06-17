"use client";

import type { MomentKind } from "@/lib/domain/moments";
import type { StampStyle } from "@/lib/stamp-preference";
import { stampDateLong, stampYear, museumShort } from "@/lib/stamp-format";
import { cn } from "@/lib/utils";

export function MomentStamp({
  museumName,
  city,
  capturedAt,
  kind,
  style,
}: {
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  style: StampStyle;
}) {
  const first = kind === "first";

  if (style === "ticket") {
    return (
      <div
        className={cn(
          "border-t border-dashed pt-2 text-center font-mono text-[10px] uppercase tracking-wide leading-relaxed",
          first ? "border-brass text-brass" : "border-border text-muted-foreground",
        )}
      >
        <div>● {museumShort(museumName)} · {city}</div>
        <div>{stampDateLong(capturedAt)} · {first ? "FIRST" : "REUNION"}</div>
      </div>
    );
  }

  // postmark — round rubber-stamp look
  return (
    <div
      className={cn(
        "flex size-14 -rotate-12 flex-col items-center justify-center rounded-full",
        first ? "border-[1.5px] border-brass text-brass" : "border-[1.5px] border-primary/70 text-primary/85",
      )}
    >
      <span className="text-[8px] font-semibold tracking-wide">{museumShort(museumName)}</span>
      <span className="text-[10px] font-bold leading-none">{stampYear(capturedAt)}</span>
      {first && <span className="text-[7px] leading-none">1ST</span>}
    </div>
  );
}
