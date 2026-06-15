"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
  animateStamp = false,
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
  /** Spring the postmark in (the develop climax). Off for static contexts like the strip. */
  animateStamp?: boolean;
  /** Override the photo element (e.g. an animated develop image). Defaults to a static img. */
  photoNode?: ReactNode;
}) {
  const first = kind === "first";
  const lg = size === "lg";
  return (
    <div
      className={cn(
        "rounded-sm bg-card",
        lg ? "w-[82vw] max-w-sm p-3 pb-4 shadow-xl" : "w-40 p-2 pb-3 shadow-md",
        first && "ring-2 ring-brass",
      )}
    >
      <div className="relative w-full overflow-hidden rounded-sm bg-muted">
        {photoNode ?? (
          <img src={photo || "/placeholder.svg"} alt="Your moment" className="block max-h-[60vh] w-full object-contain" />
        )}
        {showStamp && style === "postmark" && (
          <motion.div
            className="absolute bottom-2 right-2"
            initial={animateStamp ? { scale: 1.6, opacity: 0 } : false}
            animate={animateStamp ? { scale: 1, opacity: 1 } : undefined}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
          >
            <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="postmark" />
          </motion.div>
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
