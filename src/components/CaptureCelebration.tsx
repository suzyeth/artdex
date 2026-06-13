"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { fxIntensity, type Rarity } from "@/lib/domain/rarity";
import RarityBadge from "@/components/RarityBadge";

interface CaptureCelebrationProps {
  title: string;
  artistName: string;
  imageUrl: string;
  rarity: Rarity;
  onDone: () => void;
}

/** Synthesized capture chime — louder and longer for higher rarities.
 *  TODO Phase 6.3 polish: replace with curated sfx files in public/sfx/. */
function playChime(intensity: number) {
  try {
    const ctx = new AudioContext();
    const base = 523.25; // C5
    const steps = [0, 4, 7, 12].slice(0, intensity); // arpeggio grows with rarity
    steps.forEach((semitones, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = base * 2 ** (semitones / 12);
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  } catch {
    // audio is a nice-to-have; never break the flow over it
  }
}

export default function CaptureCelebration({
  title,
  artistName,
  imageUrl,
  rarity,
  onDone,
}: CaptureCelebrationProps) {
  const intensity = fxIntensity(rarity); // 1..4
  const particles = intensity * 8;
  const legendary = rarity === "legendary";

  useEffect(() => {
    playChime(intensity);
    // haptics on mobile: short tick for common, building pattern up to legendary
    try {
      navigator.vibrate?.(
        [40, 60, 40, 60, 80, 60, 160].slice(0, intensity * 2 - 1)
      );
    } catch {
      // haptics are a nice-to-have
    }
  }, [intensity]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {legendary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-400/40 via-transparent to-amber-400/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2, repeat: 1 }}
        />
      )}

      {Array.from({ length: particles }).map((_, i) => {
        const angle = (i / particles) * Math.PI * 2;
        const dist = 120 + intensity * 40;
        return (
          <motion.span
            key={i}
            className={`absolute h-2 w-2 rounded-full ${
              legendary ? "bg-amber-300" : "bg-zinc-300"
            }`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.2,
            }}
            transition={{ duration: 0.9 + intensity * 0.15, ease: "easeOut" }}
          />
        );
      })}

      <motion.div
        className={`mx-6 w-full max-w-xs overflow-hidden rounded-2xl border-2 bg-zinc-900 ${
          legendary
            ? "border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.7)]"
            : "border-zinc-700"
        }`}
        initial={{ scale: 0.3, rotateY: 90 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <div className="aspect-[3/4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-1 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Collected!</p>
          <p className="font-display text-lg font-semibold text-zinc-100">{title}</p>
          <p className="text-sm text-zinc-400">{artistName}</p>
          <div className="pt-1">
            <RarityBadge rarity={rarity} />
          </div>
        </div>
      </motion.div>

      <motion.button
        className="absolute bottom-12 rounded-full bg-zinc-100 px-8 py-3 font-semibold text-zinc-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={onDone}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}
