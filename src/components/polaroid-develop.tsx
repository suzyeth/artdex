"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MomentKind } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { MomentStamp } from "@/components/moment-stamp";
import { cn } from "@/lib/utils";

const DEVELOP_MS = 13000; // within the 10–20s window from the spec

export function PolaroidDevelop({
  photo,
  museumName,
  city,
  capturedAt,
  kind,
  onContinue,
}: {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  onContinue: () => void;
}) {
  const [style] = useStampStyle();
  const [developed, setDeveloped] = useState(false);
  const first = kind === "first";

  useEffect(() => {
    const t = setTimeout(() => setDeveloped(true), DEVELOP_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/96 px-8 backdrop-blur-md"
    >
        <p className="label-caps mb-4 text-muted-foreground">
          {developed ? (first ? "A first encounter" : "A reunion") : "Developing…"}
        </p>

        <div className={cn("w-[82vw] max-w-sm rounded-sm bg-card p-3 pb-4 shadow-xl", first && "ring-2 ring-brass")}>
          {/* Show the photo at the proportions it was actually shot — no square crop. */}
          <div className="relative w-full overflow-hidden rounded-sm bg-muted">
            <motion.img
              src={photo}
              alt="Your moment"
              initial={{ filter: "blur(16px) brightness(1.6) saturate(0.25)", opacity: 0.2 }}
              animate={{ filter: "blur(0px) brightness(1) saturate(1)", opacity: 1 }}
              transition={{ duration: DEVELOP_MS / 1000, ease: "easeOut" }}
              className="block max-h-[60vh] w-full object-contain"
            />
            {style === "postmark" && developed && (
              <motion.div
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="absolute bottom-2 right-2"
              >
                <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="postmark" />
              </motion.div>
            )}
          </div>

          <p className="px-1 pt-3 text-center font-heading text-sm italic text-muted-foreground">
            {museumName} · {city}
          </p>

          {style === "ticket" && developed && (
            <div className="px-1 pt-1">
              <MomentStamp museumName={museumName} city={city} capturedAt={capturedAt} kind={kind} style="ticket" />
            </div>
          )}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: developed ? 1 : 0.4 }}
          onClick={onContinue}
          disabled={!developed}
          className="mt-8 bg-foreground px-10 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-background disabled:opacity-40"
        >
          Continue
        </motion.button>
    </motion.div>
  );
}
