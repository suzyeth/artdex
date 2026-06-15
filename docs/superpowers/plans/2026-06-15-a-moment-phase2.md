# A Moment — Phase 2 (Capture Ritual) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Capture flow into a ritual — stand beside the artwork and take one photo, long-press to seal, watch a polaroid fog-develop (10–20s), then a provenance postmark stamps on; the artwork's first encounter (初遇) gets a brass rim, later ones are reunions (重逢).

**Architecture:** The single capture photo becomes the keepsake (it currently exists only for recognition and is discarded). After recognition (or manual pick), a press-and-hold "seal" commits the moment via Phase 1's `appendMoment` (through `collect()`), then a full-screen `PolaroidDevelop` plays the fog-clear develop on the local photo while the S3 upload runs in the background, and a `MomentStamp` (postmark or ticket, per a global preference) reveals on completion. 初遇/重逢 is derived from Phase 1's `momentsByArtwork` — no new persistence.

**Tech Stack:** Next.js 15, React 19, TypeScript, framer-motion (already used), vitest. Builds on Phase 1 (`src/lib/domain/moments.ts`, `momentsByArtwork`, `appendMoment`).

**Spec:** [docs/superpowers/specs/2026-06-15-a-moment-phase2-design.md](../specs/2026-06-15-a-moment-phase2-design.md)

**Branch:** `feat/a-moment-ritual` (already checked out; stacked on `feat/a-moment`).

---

## Design tokens (already in `src/app/globals.css`)
- `--color-brass` (`text-brass` / `border-brass` / `ring-brass`) — 初遇 gold. `--color-brass-bright` for accents.
- `--primary` (`text-primary` / `border-primary`) — cobalt ink for the postmark.
- `font-heading` (Playfair), `label-caps` utility, `rarityStyles` — existing.

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/lib/stamp-preference.ts` | Global stamp-style preference (localStorage) + `useStampStyle()` | Create |
| `src/lib/stamp-format.ts` | Pure stamp string helpers (date, year, museum short label) | Create |
| `src/lib/stamp-format.test.ts`, `src/lib/stamp-preference.test.ts` | Unit tests | Create |
| `src/components/moment-stamp.tsx` | Renders postmark / ticket stamp + 初遇 brass | Create |
| `src/components/polaroid-develop.tsx` | Full-screen fog-develop + stamp reveal | Create |
| `src/components/match-sheet.tsx` | Drop selfie picker; Collect → press-and-hold seal; allow reunions | Modify |
| `src/components/screens/capture-screen.tsx` | Keep capture photo as keepsake; seal → develop; replace celebration | Modify |
| `src/components/screens/profile-screen.tsx` | Add stamp-style toggle | Modify |

---

## Task 1: Stamp format helpers (TDD)

**Files:**
- Create: `src/lib/stamp-format.ts`
- Test: `src/lib/stamp-format.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/lib/stamp-format.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { stampDateLong, stampYear, museumShort } from "./stamp-format";

describe("stampDateLong", () => {
  it("formats an ISO timestamp as 'D MON YYYY' in UTC", () => {
    expect(stampDateLong("2026-06-15T10:00:00.000Z")).toBe("15 JUN 2026");
  });
  it("returns '' for an invalid date", () => {
    expect(stampDateLong("not-a-date")).toBe("");
  });
});

describe("stampYear", () => {
  it("returns a two-digit apostrophe year", () => {
    expect(stampYear("2026-06-15T10:00:00.000Z")).toBe("'26");
  });
});

describe("museumShort", () => {
  it("drops a leading article and uppercases the first significant word", () => {
    expect(museumShort("The Louvre")).toBe("LOUVRE");
    expect(museumShort("National Gallery")).toBe("NATIONAL");
  });
  it("caps length at 10 characters", () => {
    expect(museumShort("Rijksmuseum Amsterdam")).toBe("RIJKSMUSEU");
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — `npx vitest run src/lib/stamp-format.test.ts` → cannot resolve `./stamp-format`.

- [ ] **Step 3: Implement** — create `src/lib/stamp-format.ts`:

```ts
// Pure string helpers for the keepsake stamp. UTC-based so output is deterministic
// regardless of the device timezone (capturedAt is always an ISO UTC timestamp).
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function stampDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function stampYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `'${String(d.getUTCFullYear()).slice(-2)}`;
}

/** A short uppercase tag for a museum name: drop a leading article, take the first
 *  significant word, cap at 10 chars. e.g. "The Louvre" -> "LOUVRE". */
export function museumShort(name: string): string {
  const cleaned = name.replace(/^(the|le|la|el)\s+/i, "");
  const first = cleaned.split(/\s+/).filter(Boolean)[0] ?? name;
  return first.slice(0, 10).toUpperCase();
}
```

- [ ] **Step 4: Run it, expect PASS** — `npx vitest run src/lib/stamp-format.test.ts` (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stamp-format.ts src/lib/stamp-format.test.ts
git commit -m "feat(ritual): pure stamp-format helpers (date, year, museum short)"
```

---

## Task 2: Stamp-style preference (TDD for the pure part)

**Files:**
- Create: `src/lib/stamp-preference.ts`
- Test: `src/lib/stamp-preference.test.ts`

- [ ] **Step 1: Write the failing test** — create `src/lib/stamp-preference.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { normalizeStampStyle } from "./stamp-preference";

describe("normalizeStampStyle", () => {
  it("keeps a valid 'ticket' value", () => {
    expect(normalizeStampStyle("ticket")).toBe("ticket");
  });
  it("keeps a valid 'postmark' value", () => {
    expect(normalizeStampStyle("postmark")).toBe("postmark");
  });
  it("defaults to 'postmark' for null/garbage", () => {
    expect(normalizeStampStyle(null)).toBe("postmark");
    expect(normalizeStampStyle("nonsense")).toBe("postmark");
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — `npx vitest run src/lib/stamp-preference.test.ts`.

- [ ] **Step 3: Implement** — create `src/lib/stamp-preference.ts`:

```ts
"use client";
import { useEffect, useState } from "react";

export type StampStyle = "postmark" | "ticket";

const KEY = "artdex:stamp-style";
const DEFAULT: StampStyle = "postmark";

export function normalizeStampStyle(v: string | null | undefined): StampStyle {
  return v === "ticket" ? "ticket" : "postmark";
}

/** Read/write the global keepsake-stamp preference. Per-device (localStorage). */
export function useStampStyle(): [StampStyle, (s: StampStyle) => void] {
  const [style, setStyle] = useState<StampStyle>(DEFAULT);
  useEffect(() => {
    try {
      setStyle(normalizeStampStyle(localStorage.getItem(KEY)));
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);
  const update = (s: StampStyle) => {
    setStyle(s);
    try {
      localStorage.setItem(KEY, s);
    } catch {
      // ignore write failures
    }
  };
  return [style, update];
}
```

- [ ] **Step 4: Run it, expect PASS** — `npx vitest run src/lib/stamp-preference.test.ts` (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stamp-preference.ts src/lib/stamp-preference.test.ts
git commit -m "feat(ritual): global stamp-style preference (localStorage) + useStampStyle"
```

---

## Task 3: MomentStamp component (preview-verified)

**Files:**
- Create: `src/components/moment-stamp.tsx`

- [ ] **Step 1: Implement** — create `src/components/moment-stamp.tsx`:

```tsx
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
        <div>{stampDateLong(capturedAt)} · {first ? "初遇 · first" : "重逢"}</div>
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
      {first && <span className="text-[7px] leading-none">初遇</span>}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` (clean) and `npx eslint src/components/moment-stamp.tsx` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/moment-stamp.tsx
git commit -m "feat(ritual): MomentStamp — postmark/ticket with 初遇 brass treatment"
```

> Visual verification happens in Task 4 (it's rendered inside the develop overlay).

---

## Task 4: PolaroidDevelop component (preview-verified)

**Files:**
- Create: `src/components/polaroid-develop.tsx`

- [ ] **Step 1: Implement** — create `src/components/polaroid-develop.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/96 px-8 backdrop-blur-md"
      >
        <p className="label-caps mb-4 text-muted-foreground">
          {developed ? (first ? "A first encounter" : "A reunion") : "Developing…"}
        </p>

        <div className={cn("w-64 rounded-sm bg-card p-3 pb-4 shadow-xl", first && "ring-2 ring-brass")}>
          <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-muted">
            <motion.img
              src={photo}
              alt="Your moment"
              initial={{ filter: "blur(16px) brightness(1.6) saturate(0.25)", opacity: 0.2 }}
              animate={{ filter: "blur(0px) brightness(1) saturate(1)", opacity: 1 }}
              transition={{ duration: DEVELOP_MS / 1000, ease: "easeOut" }}
              className="size-full object-cover"
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
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit` (clean), `npx eslint src/components/polaroid-develop.tsx` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/polaroid-develop.tsx
git commit -m "feat(ritual): PolaroidDevelop — fog-clear develop then stamp reveal"
```

> Full visual verification is done in Task 6 once the capture flow drives it. To eyeball it now, the reviewer/controller can temporarily mount it in the preview; not required for this task.

---

## Task 5: Reshape MatchSheet — drop selfie picker, press-and-hold seal, allow reunions

**Files:**
- Modify: `src/components/match-sheet.tsx` (full replacement below)

Rationale: the capture photo is now the keepsake, so the separate selfie picker is gone. The Collect tap becomes a press-and-hold "seal" (`SealButton`). Because Phase 1 allows multiple captures, an already-collected artwork is no longer blocked — it becomes a 重逢, shown as a subtle hint.

- [ ] **Step 1: Replace the file** — overwrite `src/components/match-sheet.tsx` with:

```tsx
"use client";

import { useRef, useState } from "react";
import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { getArtwork, getMuseum } from "@/lib/data";
import { rarityStyles } from "@/lib/rarity";
import { cn } from "@/lib/utils";
import { Sparkles, Lock, MapPin, AlertTriangle, RotateCcw } from "lucide-react";

const HOLD_MS = 1000;

function SealButton({ onSeal }: { onSeal: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | null>(null);

  function start() {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      try {
        navigator.vibrate?.(30);
      } catch {
        // haptics optional
      }
      onSeal();
    }, HOLD_MS);
  }
  function cancel() {
    setHolding(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }

  return (
    <button
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      className="relative mt-5 w-full select-none overflow-hidden bg-foreground py-4 text-sm font-semibold uppercase tracking-[0.15em] text-background"
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        长按封缄 · Hold to seal <Sparkles className="size-4" />
      </span>
      <span
        className="absolute inset-y-0 left-0 bg-brass ease-linear"
        style={{ width: holding ? "100%" : "0%", transitionProperty: "width", transitionDuration: holding ? `${HOLD_MS}ms` : "150ms" }}
      />
    </button>
  );
}

export function MatchSheet({
  artworkId,
  alreadyCollected,
  isReproduction,
  photoPreview,
  onClose,
  onSeal,
}: {
  artworkId: string | null;
  alreadyCollected: boolean;
  isReproduction?: boolean;
  photoPreview?: string;
  onClose: () => void;
  onSeal: (note: string) => void;
}) {
  const artwork = artworkId ? getArtwork(artworkId) : undefined;
  const museum = artwork ? getMuseum(artwork.museumId) : undefined;
  const [note, setNote] = useState("");

  const isLegendary = artwork?.rarity === "legendary";
  const s = artwork ? rarityStyles[artwork.rarity] : null;

  function handleSeal() {
    onSeal(note);
    setNote("");
  }

  return (
    <BottomSheet open={Boolean(artwork)} onClose={onClose}>
      {artwork && s && (
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-3 text-center text-primary">Match found</p>

          <div className="flex gap-4 border-b border-border pb-4">
            <div className={cn("size-24 shrink-0 overflow-hidden rounded-sm border", s.border)}>
              <img src={photoPreview || artwork.image || "/placeholder.svg"} alt={artwork.title} className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-pretty font-heading text-xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
              <div className="mt-2">
                <RarityBadge rarity={artwork.rarity} size="md" />
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {museum?.name}, {museum?.city}
              </p>
            </div>
          </div>

          {isLegendary && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-primary bg-primary/5 p-3">
              <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-primary">
                <span className="font-semibold">Legendary — on-site only.</span> This work can only be sealed inside{" "}
                {museum?.name}. Your location has been verified.
              </p>
            </div>
          )}

          {isReproduction && (
            <div className="mt-4 flex items-start gap-2 border-l-2 border-[oklch(0.55_0.145_38)] bg-[oklch(0.55_0.145_38)]/8 p-3">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[oklch(0.5_0.145_38)]" />
              <p className="text-xs leading-relaxed text-[oklch(0.45_0.145_38)]">
                <span className="font-semibold">Looks like a reproduction.</span> This reads as a screen, postcard, or
                print, not the original. You can still seal it, but go see the real thing.
              </p>
            </div>
          )}

          {alreadyCollected && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-brass">
              <RotateCcw className="size-3.5" /> 你又来看它了 · this will be a reunion (重逢)
            </div>
          )}

          {/* Memory note */}
          <div className="mt-5">
            <label htmlFor="memory" className="label-caps mb-2 block text-muted-foreground">
              Add a memory
            </label>
            <textarea
              id="memory"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="What struck you about it?"
              className="w-full resize-none rounded-sm border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>

          <SealButton onSeal={handleSeal} />
        </div>
      )}
    </BottomSheet>
  );
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit`. Expect ONE error in `capture-screen.tsx` (it still calls the old `onCollect` prop) — that is fixed in Task 6. Confirm the only error is that prop mismatch; `eslint src/components/match-sheet.tsx` clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/match-sheet.tsx
git commit -m "feat(ritual): MatchSheet uses press-and-hold seal; drops selfie picker; allows reunions"
```

---

## Task 6: Reshape capture-screen — keep photo as keepsake, seal → develop

**Files:**
- Modify: `src/components/screens/capture-screen.tsx` (full replacement below)

- [ ] **Step 1: Replace the file** — overwrite `src/components/screens/capture-screen.tsx` with:

```tsx
"use client";

import { useRef, useState } from "react";
import { getArtwork, getMuseum } from "@/lib/data";
import { useCollection } from "@/lib/collection-store";
import { kindOf, type Moment, type MomentKind } from "@/lib/domain/moments";
import { MatchSheet } from "@/components/match-sheet";
import { PolaroidDevelop } from "@/components/polaroid-develop";
import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { fetchCandidates, uploadSelfie } from "@/lib/api";
import type { Candidate } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Scan, ImageIcon, Zap } from "lucide-react";

type Phase = "idle" | "scanning";

type DevelopState = {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
};

// Demo museum: real Bedrock recognition is scoped to this museum's works on display.
const MUSEUM_ID = "moma";
const MAX_EDGE = 1024;

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      resolve({ base64: dataUrl.slice(dataUrl.indexOf(",") + 1), mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}

export function CaptureScreen() {
  const { collect, isCollected, momentsByArtwork } = useCollection();
  const [phase, setPhase] = useState<Phase>("idle");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [develop, setDevelop] = useState<DevelopState | null>(null);
  const [miss, setMiss] = useState(false);
  const [isRepro, setIsRepro] = useState(false);
  const [manual, setManual] = useState<Candidate[] | null>(null);
  const [capturePreview, setCapturePreview] = useState<string | undefined>();
  const captureKey = useRef<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  function startScan() {
    if (phase === "scanning") return;
    fileRef.current?.click();
  }

  async function openManual() {
    const candidates = await fetchCandidates(MUSEUM_ID);
    setManual(candidates);
  }

  async function onPhoto(file: File) {
    setMiss(false);
    setIsRepro(false);
    setPhase("scanning");
    // This photo IS the keepsake: show it locally and upload to S3 in the background.
    setCapturePreview(URL.createObjectURL(file));
    captureKey.current = undefined;
    uploadSelfie(file)
      .then((key) => {
        if (key) captureKey.current = key;
      })
      .catch(() => {});
    try {
      const { base64, mediaType } = await fileToBase64(file);
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ museumId: MUSEUM_ID, imageBase64: base64, mediaType }),
      });
      const { artwork, isReproduction } = await res.json();
      setPhase("idle");
      if (artwork?.id) {
        setIsRepro(Boolean(isReproduction));
        setMatchId(artwork.id);
      } else {
        setMiss(true);
        openManual(); // let the user pick from works on display
      }
    } catch {
      setPhase("idle");
      setMiss(true);
    }
  }

  function pickManual(id: string) {
    setManual(null);
    setIsRepro(false);
    setMatchId(id);
  }

  function handleSeal(note: string) {
    if (!matchId) return;
    const art = getArtwork(matchId);
    const museum = art ? getMuseum(art.museumId) : undefined;
    const capturedAt = new Date().toISOString();

    // Derive 初遇/重逢 from the moments BEFORE this one is appended (kindOf sorts internally).
    const prior = momentsByArtwork[matchId] ?? [];
    const thisMoment: Moment = { capturedAt, museumId: art?.museumId ?? "" };
    const kind = kindOf([...prior, thisMoment], thisMoment);

    collect({
      artworkId: matchId,
      note: note || undefined,
      selfie: captureKey.current,
      collectedAt: capturedAt.slice(0, 10),
    });
    setMatchId(null);

    if (art && museum) {
      setDevelop({
        photo: capturePreview || art.image || "/placeholder.svg",
        museumName: museum.name,
        city: museum.city,
        capturedAt,
        kind,
      });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-6">
      {/* Editorial header */}
      <div className="mx-auto mb-6 w-full max-w-sm border-b border-border pb-4 text-center">
        <p className="label-caps text-muted-foreground">Field Identification</p>
        <h1 className="mt-1 font-heading text-3xl font-bold leading-none">Capture a Moment</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stand beside a work, frame you both, and seal the moment</p>
      </div>

      {/* Viewfinder */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm border border-foreground/15 bg-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,oklch(0.955_0.01_78),oklch(0.9_0.012_78))]" />
        <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-foreground/20 bg-card/70" />

        {[
          "left-4 top-4 border-l-2 border-t-2 rounded-tl-lg",
          "right-4 top-4 border-r-2 border-t-2 rounded-tr-lg",
          "left-4 bottom-4 border-l-2 border-b-2 rounded-bl-lg",
          "right-4 bottom-4 border-r-2 border-b-2 rounded-br-lg",
        ].map((c) => (
          <span key={c} className={cn("absolute size-10 border-primary/70", c)} />
        ))}

        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ top: "12%" }}
                animate={{ top: ["12%", "88%", "12%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-6 h-0.5 bg-primary shadow-[0_0_16px_2px_var(--primary)]"
              />
              <Scan className="size-9 animate-pulse text-primary" />
              <p className="text-sm font-medium text-foreground">Matching against works on display…</p>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="size-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "idle" && (
          <div className="absolute inset-x-0 bottom-6 text-center">
            <p className="text-xs text-muted-foreground">
              {miss ? "Couldn't identify it — try another angle" : "Stand beside the work — keep some of it in frame"}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mx-auto mt-7 flex w-full max-w-sm items-center justify-between px-2">
        <button
          onClick={startScan}
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-transform active:scale-90"
          aria-label="Upload from library"
        >
          <ImageIcon className="size-5" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPhoto(f);
            e.target.value = "";
          }}
        />

        <button
          onClick={startScan}
          disabled={phase === "scanning"}
          aria-label="Capture artwork"
          className="relative flex size-20 items-center justify-center rounded-full"
        >
          <span className="absolute inset-0 rounded-full border border-foreground/25" />
          <span className="absolute inset-1.5 rounded-full border border-foreground/15" />
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-full bg-foreground text-background transition-transform",
              phase === "scanning" ? "scale-90 opacity-70" : "active:scale-95",
            )}
          >
            <Scan className="size-6" />
          </span>
        </button>

        <button
          className="flex size-11 items-center justify-center rounded-sm border border-border text-muted-foreground transition-transform active:scale-90"
          aria-label="Toggle flash"
        >
          <Zap className="size-5" />
        </button>
      </div>

      <MatchSheet
        artworkId={matchId}
        alreadyCollected={matchId ? isCollected(matchId) : false}
        isReproduction={isRepro}
        photoPreview={capturePreview}
        onClose={() => setMatchId(null)}
        onSeal={handleSeal}
      />

      {/* Manual fallback — pick from the works currently on display */}
      <BottomSheet open={manual !== null} onClose={() => setManual(null)}>
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-1 text-center text-primary">Couldn&apos;t identify it</p>
          <p className="mb-4 text-center text-sm text-muted-foreground">Pick the work from what&apos;s on display</p>
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {(manual ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => pickManual(c.id)}
                className="flex w-full items-center gap-3 rounded-sm border border-border p-2 text-left transition-colors active:bg-secondary/50"
              >
                <img src={c.imageUrl || "/placeholder.svg"} alt={c.title} className="size-12 shrink-0 rounded-sm object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-sm font-semibold">{c.title}</span>
                  <span className="label-caps text-muted-foreground">{c.artistName}</span>
                </span>
                <RarityBadge rarity={c.rarity} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <AnimatePresence>
        {develop && <PolaroidDevelop {...develop} onContinue={() => setDevelop(null)} />}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck & lint** — `npx tsc --noEmit` (now clean — Task 5's prop mismatch is resolved) and `npx eslint src/components/screens/capture-screen.tsx` (clean). This file no longer imports `CaptureCelebration`; `src/components/capture-celebration.tsx` becomes unmounted (kept for potential reuse — not removed by this plan, and an unimported file is not a lint error).

- [ ] **Step 3: Verify in preview** (controller/reviewer drives this — see Verification section). Capture a photo → match sheet → hold to seal → polaroid develops → stamp appears.

- [ ] **Step 4: Commit**

```bash
git add src/components/screens/capture-screen.tsx
git commit -m "feat(ritual): capture photo becomes keepsake; seal triggers polaroid develop"
```

---

## Task 7: Profile stamp-style toggle (preview-verified)

**Files:**
- Modify: `src/components/screens/profile-screen.tsx`

- [ ] **Step 1: Add the import** — in `src/components/screens/profile-screen.tsx`, add near the other imports:

```tsx
import { useStampStyle, type StampStyle } from "@/lib/stamp-preference";
```

- [ ] **Step 2: Add a `StampToggle` component** — append this function at the bottom of the file (next to the other module-local components like `Stat`):

```tsx
function StampToggle() {
  const [style, setStyle] = useStampStyle();
  const opts: { value: StampStyle; label: string }[] = [
    { value: "postmark", label: "邮戳 Postmark" },
    { value: "ticket", label: "票根 Ticket" },
  ];
  return (
    <section className="mb-9">
      <h2 className="label-caps mb-3 text-muted-foreground">Keepsake stamp</h2>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-border">
        {opts.map((o) => (
          <button
            key={o.value}
            onClick={() => setStyle(o.value)}
            className={cn(
              "bg-background py-3 text-sm font-medium transition-colors",
              style === o.value ? "text-brass" : "text-muted-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount it** — in the `ProfileScreen` return, immediately AFTER the Achievements `</button>` (the one with `onClick={() => setShowAchievements(true)}`, before the `{count === 0 ? ...}` block), add:

```tsx
      <StampToggle />
```

- [ ] **Step 4: Typecheck & lint** — `npx tsc --noEmit` (clean), `npx eslint src/components/screens/profile-screen.tsx` (clean).

- [ ] **Step 5: Commit**

```bash
git add src/components/screens/profile-screen.tsx
git commit -m "feat(ritual): profile stamp-style toggle (postmark / ticket)"
```

---

## Verification (controller-driven, after Task 7)

The dev server is not assumed running. Start it bound to LAN for phone testing, or use the preview tooling. With `NEXT_PUBLIC_MOCK_COLLECTION=1` the collection screens show seeded data; the capture→develop ritual itself runs regardless.

1. Reload, open the Capture tab. Confirm the header reads "Capture a Moment".
2. Upload/take a photo. Recognition runs; on a miss the manual "pick from display" sheet appears — pick a work.
3. In the match sheet, confirm there is NO separate selfie picker and the button reads "长按封缄 · Hold to seal" with a brass fill that grows over ~1s; releasing early cancels.
4. Hold to seal → the match sheet closes and `PolaroidDevelop` appears: the captured photo fog-develops (~13s) then the postmark stamps on. Continue dismisses it.
5. Capture the SAME work again → the match sheet shows the "重逢" hint; after develop the stamp shows no 初遇 brass (it's a reunion). The first capture of a fresh work shows the brass rim + 初遇.
6. Profile tab → "Keepsake stamp" toggle → switch to Ticket → capture again → the develop shows the ticket-strip stamp instead of the round postmark.
7. `preview_console_logs` (level error) is clean.

---

## Self-Review checklist (run before handoff)

- [ ] `npx vitest run` green (Phase 1 tests + new stamp-format/stamp-preference tests).
- [ ] `npx tsc --noEmit` clean; `npx eslint src/` introduces no new errors.
- [ ] Map / Dex / Achievements still render (they read `collected`, unchanged).
- [ ] First capture of a work = 初遇 brass; subsequent = 重逢 plain (Task 6 derivation).

---

## Notes / carried decisions
- Recognition stays scoped to `MUSEUM_ID = "moma"` (museum detection is out of Phase 2 scope).
- Keepsake photo uploads to S3 in the background; the develop animation plays on the local object URL immediately (no wait).
- 初遇/重逢 derived via Phase 1 `kindOf` — never stored.
- YAGNI: no in-app camera (system camera via `<input capture>`), no per-capture stamp choice, no wax-seal style, no skippable develop.
