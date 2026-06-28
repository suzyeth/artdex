"use client";

// Legendary-only confetti — a brass/gold burst that pops up, flutters, and rains down
// on the develop "landing". Kept on-palette (legendary's meaning-color, never rainbow)
// so it reads as earned prestige, not generic game UI. Mount only when a legendary lands.
//
// Each piece: spread launch origin (not a single point), a gravity-ish arc (slow rise →
// accelerating fall via per-segment easing), a side-to-side flutter, and a paper "flip"
// (scaleY wobble) so flat shapes catch the light like real confetti. A few petal shapes
// mix in among the rectangles and dots for the 撒花 feel. Respects reduced-motion.
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Warm gold / brass / cream — all within the legendary palette.
const TONES = [
  "oklch(0.72 0.1 84)",
  "oklch(0.62 0.092 80)",
  "oklch(0.82 0.09 86)",
  "oklch(0.9 0.06 90)",
  "oklch(0.55 0.13 70)",
];

// Four silhouettes: rectangle, round dot, thin streamer, petal/leaf.
const SHAPES = [
  { w: 7, h: 11, radius: "1px" },
  { w: 8, h: 8, radius: "9999px" },
  { w: 3, h: 16, radius: "2px" },
  { w: 10, h: 10, radius: "100% 0 100% 0" },
];

export function LegendaryConfetti({ count = 38 }: { count?: number }) {
  const reduce = useReducedMotion();

  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const shape = SHAPES[i % SHAPES.length];
        const sway = 18 + Math.random() * 34;
        return {
          id: i,
          startX: (Math.random() - 0.5) * 340, // spread launch origin across the card
          rise: 80 + Math.random() * 150, // pop up before gravity wins
          fall: 360 + Math.random() * 280, // distance it rains down
          sway, // flutter amplitude
          swayDir: i % 2 ? 1 : -1,
          drift: (Math.random() - 0.5) * 70, // net horizontal drift
          rot: (Math.random() - 0.5) * 900,
          flip: 0.35 + Math.random() * 0.6, // scaleY low point of the paper flip
          delay: (i / count) * 0.16 + Math.random() * 0.12, // gentle stagger
          dur: 1.5 + Math.random() * 1.0,
          color: TONES[i % TONES.length],
          ...shape,
          sizeJitter: 0.8 + Math.random() * 0.6,
        };
      }),
    [count],
  );

  // Reduced-motion users still get the brass flash from PolaroidDevelop; skip the rain.
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: p.startX, y: 0, rotate: 0, opacity: 0, scaleY: 1 }}
          animate={{
            // flutter: overshoot one way, then settle the other way + drift
            x: [
              p.startX,
              p.startX + p.swayDir * p.sway,
              p.startX - p.swayDir * p.sway * 0.6 + p.drift,
              p.startX + p.drift,
            ],
            // gravity arc: up quickly, then accelerate down past the card
            y: [0, -p.rise, p.fall * 0.42, p.fall],
            rotate: [0, p.rot * 0.4, p.rot * 0.8, p.rot],
            scaleY: [1, p.flip, 1, p.flip], // paper catching the light
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            times: [0, 0.22, 0.6, 1],
            // per-segment: decelerate into the peak, then accelerate down (gravity feel)
            ease: ["easeOut", "easeIn", "easeIn"],
          }}
          className="absolute"
          style={{
            width: p.w * p.sizeJitter,
            height: p.h * p.sizeJitter,
            background: p.color,
            borderRadius: p.radius,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
