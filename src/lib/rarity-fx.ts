// Rarity expressed through the photograph itself + the moment's pacing, not stickers.
// E = film grade, F = halation, B = reveal glow, G = develop pacing + chime/haptic.
import type { Rarity } from "@/lib/data";

/** E — film-stock grade. Richer/warmer/deeper as rarity climbs; common reads faded. */
export function rarityGradeFilter(rarity: Rarity): string {
  switch (rarity) {
    case "legendary":
      return "saturate(1.3) brightness(1.06) contrast(1.12)";
    case "epic":
      return "saturate(1.12) brightness(1.03) contrast(1.04)";
    case "rare":
      return "saturate(0.95)";
    default:
      return "saturate(0.6) brightness(0.96) contrast(0.92)";
  }
}

/** F — a soft warm halation bleeding from the bright areas. null for common/rare. */
export function rarityHalation(rarity: Rarity): string | null {
  if (rarity === "legendary")
    return "radial-gradient(circle at 46% 36%, oklch(0.92 0.11 88 / 0.5) 0, oklch(0.85 0.1 84 / 0.2) 22%, transparent 52%)";
  if (rarity === "epic")
    return "radial-gradient(circle at 46% 36%, oklch(0.82 0.08 70 / 0.24), transparent 58%)";
  return null;
}

/** B — opacity of the warm reverent glow that breathes around the print on reveal. */
export function rarityRevealGlow(rarity: Rarity): number {
  switch (rarity) {
    case "legendary":
      return 0.85;
    case "epic":
      return 0.5;
    case "rare":
      return 0.3;
    default:
      return 0;
  }
}

/** G — develop lingers for rarer works (more anticipation). Within the 10–18s window. */
export function rarityDevelopMs(rarity: Rarity): number {
  switch (rarity) {
    case "legendary":
      return 17000;
    case "epic":
      return 14000;
    case "rare":
      return 12000;
    default:
      return 10000;
  }
}

/** Intensity tier 1–4 (common→legendary), shared by the chime and haptics. */
function rarityIntensity(rarity: Rarity): number {
  return rarity === "legendary" ? 4 : rarity === "epic" ? 3 : rarity === "rare" ? 2 : 1;
}

/** Fallback: synthesize the bell chime inline if the pre-rendered SFX file can't load. */
function synthChime(intensity: number): void {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const base = 523.25; // C5
    const steps = [0, 4, 7, 12].slice(0, intensity); // arpeggio grows with rarity
    steps.forEach((semi, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = base * 2 ** (semi / 12);
      osc.type = "triangle";
      const t = ctx.currentTime + i * 0.14;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.7);
    });
  } catch {
    // audio is a nice-to-have; never break the flow
  }
}

/**
 * G — a reveal chime + haptic, fuller for higher rarity. Browser-only.
 * Plays the pre-rendered bell SFX (see scripts/genSfx.ts), with the inline synth as a
 * graceful fallback. Fires from the develop flow, which is user-gesture initiated, so
 * autoplay is allowed.
 */
export function playRarityFx(rarity: Rarity): void {
  const intensity = rarityIntensity(rarity);
  try {
    const audio = new Audio(`/sfx/collect-${rarity}.wav`);
    audio.volume = 0.2 + intensity * 0.12;
    audio.play().catch(() => synthChime(intensity));
  } catch {
    synthChime(intensity);
  }
  try {
    navigator.vibrate?.([30, 50, 30, 50, 70, 50, 140].slice(0, intensity * 2 - 1));
  } catch {
    // haptics optional
  }
}
