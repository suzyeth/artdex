/**
 * Offline celebration-SFX generator.
 *
 * Synthesizes one short "music-box / glockenspiel" capture chime per rarity tier
 * and writes them to `public/sfx/collect-<rarity>.wav`. Pure Node (no deps): the
 * WAV bytes are written by hand. Re-run after tweaking the synth params:
 *
 *   npx tsx scripts/genSfx.ts
 *
 * Higher tiers get more notes, a brighter sparkle layer, and a longer reverb tail.
 * The runtime component plays these files and falls back to a WebAudio synth if a
 * file can't load, so regenerating is always safe.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const SAMPLE_RATE = 44100

// Bell-ish partials: (frequency ratio, relative amplitude). Slight inharmonicity
// in the upper partials gives the struck-metal shimmer instead of a pure tone.
const PARTIALS: ReadonlyArray<readonly [number, number]> = [
  [1.0, 1.0],
  [2.0, 0.55],
  [3.01, 0.28],
  [4.22, 0.14],
  [5.43, 0.07],
]

const C6 = 1046.5
const semitone = (n: number) => C6 * 2 ** (n / 12)

interface TierSpec {
  notes: number[] // semitone offsets from C6, played as an arpeggio
  noteGap: number // seconds between note onsets
  decay: number // per-note exponential decay time-constant (s)
  sparkle: number // count of high random shimmer grains in the tail
  reverb: boolean // add a short decaying-echo tail for grandeur
  swell: boolean // add a soft sub-octave pad underneath (legendary only)
}

const TIERS: Record<string, TierSpec> = {
  common: { notes: [0], noteGap: 0.0, decay: 0.4, sparkle: 0, reverb: false, swell: false },
  rare: { notes: [0, 4], noteGap: 0.1, decay: 0.5, sparkle: 0, reverb: false, swell: false },
  epic: { notes: [0, 4, 7], noteGap: 0.11, decay: 0.6, sparkle: 6, reverb: true, swell: false },
  legendary: { notes: [0, 4, 7, 12], noteGap: 0.12, decay: 0.75, sparkle: 14, reverb: true, swell: true },
}

// Deterministic PRNG so regenerating gives byte-identical files (mulberry32).
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function bellNote(buf: Float32Array, startSec: number, freq: number, decay: number, amp: number) {
  const start = Math.floor(startSec * SAMPLE_RATE)
  const len = Math.floor(decay * 4 * SAMPLE_RATE)
  const attack = Math.floor(0.003 * SAMPLE_RATE)
  for (let i = 0; i < len && start + i < buf.length; i++) {
    const t = i / SAMPLE_RATE
    const env = (i < attack ? i / attack : 1) * Math.exp(-t / decay)
    let s = 0
    for (const [ratio, pAmp] of PARTIALS) {
      s += pAmp * Math.sin(2 * Math.PI * freq * ratio * t)
    }
    buf[start + i] += (s / 2.04) * env * amp
  }
}

function renderTier(name: string, spec: TierSpec): Float32Array {
  const rand = rng(name.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))
  const tail = spec.reverb ? 1.4 : 0.6
  const durationSec = spec.notes.length * spec.noteGap + spec.decay * 4 + tail
  const buf = new Float32Array(Math.ceil(durationSec * SAMPLE_RATE))

  // Main arpeggio.
  spec.notes.forEach((semi, i) => {
    bellNote(buf, i * spec.noteGap, semitone(semi), spec.decay, 0.9)
  })

  // Soft sub-octave swell under the whole chime (legendary).
  if (spec.swell) {
    const start = 0
    const len = buf.length
    const freq = semitone(-12)
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE
      const env = Math.min(1, t / 0.25) * Math.exp(-t / 1.1) * 0.18
      buf[start + i] += Math.sin(2 * Math.PI * freq * t) * env
    }
  }

  // High shimmer grains scattered through the tail.
  const lastOnset = (spec.notes.length - 1) * spec.noteGap
  for (let g = 0; g < spec.sparkle; g++) {
    const at = lastOnset + 0.05 + rand() * 0.7
    const freq = semitone(19 + Math.floor(rand() * 12)) // two octaves up, in-scale-ish
    bellNote(buf, at, freq, 0.18, 0.1 + rand() * 0.08)
  }

  // Cheap Schroeder-ish reverb: a couple of attenuated, delayed copies.
  if (spec.reverb) {
    const taps: Array<[number, number]> = [
      [0.13, 0.3],
      [0.27, 0.18],
      [0.41, 0.1],
    ]
    const dry = Float32Array.from(buf)
    for (const [delaySec, gain] of taps) {
      const d = Math.floor(delaySec * SAMPLE_RATE)
      for (let i = 0; i + d < buf.length; i++) buf[i + d] += dry[i] * gain
    }
  }

  // Normalize to -1.5 dBFS, then short fade-out to kill the final click.
  let peak = 0
  for (const v of buf) peak = Math.max(peak, Math.abs(v))
  const target = 10 ** (-1.5 / 20)
  const norm = peak > 0 ? target / peak : 1
  const fade = Math.floor(0.02 * SAMPLE_RATE)
  for (let i = 0; i < buf.length; i++) {
    let v = buf[i] * norm
    const fromEnd = buf.length - i
    if (fromEnd < fade) v *= fromEnd / fade
    buf[i] = v
  }
  return buf
}

function toWav(samples: Float32Array): Buffer {
  const bytesPerSample = 2
  const dataSize = samples.length * bytesPerSample
  const buf = Buffer.alloc(44 + dataSize)
  buf.write("RIFF", 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write("WAVE", 8)
  buf.write("fmt ", 12)
  buf.writeUInt32LE(16, 16) // PCM chunk size
  buf.writeUInt16LE(1, 20) // PCM
  buf.writeUInt16LE(1, 22) // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24)
  buf.writeUInt32LE(SAMPLE_RATE * bytesPerSample, 28)
  buf.writeUInt16LE(bytesPerSample, 32)
  buf.writeUInt16LE(16, 34)
  buf.write("data", 36)
  buf.writeUInt32LE(dataSize, 40)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * bytesPerSample)
  }
  return buf
}

const outDir = join(process.cwd(), "public", "sfx")
mkdirSync(outDir, { recursive: true })
for (const [name, spec] of Object.entries(TIERS)) {
  const wav = toWav(renderTier(name, spec))
  const file = join(outDir, `collect-${name}.wav`)
  writeFileSync(file, wav)
  console.log(`wrote ${file} (${(wav.length / 1024).toFixed(1)} KB)`)
}
