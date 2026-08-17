"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MomentKind, StampStyle } from "@/lib/domain/moments";
import type { Rarity } from "@/lib/data";
import { rarityGradeFilter, rarityDevelopMs, rarityRevealGlow, rarityVictoryFlash, playRarityFx } from "@/lib/rarity-fx";
import { PolaroidCard } from "@/components/polaroid-card";
import { LegendaryConfetti } from "@/components/legendary-confetti";

export function PolaroidDevelop({
  photo,
  museumName,
  city,
  capturedAt,
  kind,
  stampStyle,
  rarity,
  note,
  onContinue,
}: {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  stampStyle: StampStyle;
  rarity: Rarity;
  note?: string;
  onContinue: () => void;
}) {
  const style = stampStyle;
  const [developed, setDeveloped] = useState(false);
  const first = kind === "first";
  const developMs = rarityDevelopMs(rarity); // G — rarer works linger
  const glow = rarityRevealGlow(rarity); // B — warm reverent light
  const flash = rarityVictoryFlash(rarity); // B2 — legendary alone gets a landing victory flash

  useEffect(() => {
    const t = setTimeout(() => {
      setDeveloped(true);
      playRarityFx(rarity); // G — chime + haptic, fuller for higher rarity
    }, developMs);
    return () => clearTimeout(t);
  }, [developMs, rarity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/96 px-8 backdrop-blur-md"
    >
      {/* B — warm reverent glow that blooms and breathes around the print */}
      {glow > 0 && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: developed ? [glow * 0.65, glow, glow * 0.65] : glow * 0.25 }}
          transition={
            developed
              ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: developMs / 1000 }
          }
          className="pointer-events-none absolute left-1/2 top-1/2 h-[64vh] max-h-[460px] w-[64vh] max-w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.1 84 / 0.9), transparent 66%)", filter: "blur(30px)" }}
        />
      )}

      {/* B2 — victory flash: one bright brass bloom the instant the print lands,
          legendary only. Fires once when `developed` flips true. */}
      {flash && developed && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.55 }}
          animate={{ opacity: [0, 1, 0], scale: [0.55, 1.15, 1.35] }}
          transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.25, 1] }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] max-h-[520px] w-[70vh] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: flash, filter: "blur(26px)" }}
        />
      )}

      {/* Legendary-only confetti — brass/gold burst so the win is unmissable. */}
      {flash && developed && <LegendaryConfetti />}

      <p className="label-caps z-10 mb-4 text-muted-foreground">
        {developed ? (first ? "A first encounter" : "A reunion") : "Developing…"}
      </p>

      <motion.div
        className="z-10"
        animate={flash && developed ? { scale: [1, 1.045, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.04 }}
      >
        <PolaroidCard
          photo={photo}
          museumName={museumName}
          city={city}
          capturedAt={capturedAt}
          kind={kind}
          style={style}
          rarity={rarity}
          size="lg"
          showStamp={developed}
          animateStamp
          chinNote={note}
          photoNode={
            <motion.img
              src={photo}
              alt="Your moment"
              initial={{ filter: "blur(16px) brightness(1.6) saturate(0.25)", opacity: 0.2 }}
              animate={{ filter: `blur(0px) ${rarityGradeFilter(rarity)}`, opacity: 1 }}
              transition={{ duration: developMs / 1000, ease: "easeOut" }}
              className="block max-h-[60vh] w-full object-contain"
            />
          }
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: developed ? 1 : 0.4 }}
        onClick={onContinue}
        disabled={!developed}
        className="z-10 mt-8 bg-foreground px-10 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-background disabled:opacity-40"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
