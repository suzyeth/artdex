# A Moment — Phase 3 (Moment Stack / 邮戳叠) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the artwork detail view into a per-artwork keepsake stack — a horizontal filmstrip of polaroid cards (初遇 leftmost in brass, reunions to the right); tapping one opens a full-screen "relive" view showing that moment's photo + the memory you wrote, which you can add or edit anytime after the fact.

**Architecture:** A shared presentational `PolaroidCard` renders the card chrome (frame, photo at real aspect, `MomentStamp`, caption, 初遇 brass ring) and is reused by the Phase-2 develop overlay, the filmstrip, and the relive view. The detail sheet reads `momentsByArtwork[artworkId]` (Phase 1) and renders a `MomentStrip`. Editing a memory targets a moment by its index in the oldest-first list (stored order == append order == chronological), persisted via a new `PATCH /api/moment` → `updateMomentNote` (`SET moments[i].note`).

**Tech Stack:** Next.js 15, React 19, TypeScript, framer-motion, `@aws-sdk/lib-dynamodb`, vitest. Builds on Phase 1 + 2.

**Spec:** [docs/superpowers/specs/2026-06-15-a-moment-phase3-design.md](../specs/2026-06-15-a-moment-phase3-design.md)

**Branch:** `feat/a-moment-stack` (already checked out, from master).

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/components/polaroid-card.tsx` | Shared static card: frame + photo (real aspect, sm/lg) + `MomentStamp` + caption + 初遇 brass | Create |
| `src/components/polaroid-develop.tsx` | Reuse `PolaroidCard` (fog animation via `photoNode`) | Modify |
| `src/components/moment-relive.tsx` | Full-screen relive: large `PolaroidCard` + museum·date + memory (show/add/edit) | Create |
| `src/components/moment-strip.tsx` | Horizontal filmstrip of `PolaroidCard`s; tap → relive | Create |
| `src/components/artwork-detail-sheet.tsx` | props `artworkId`; read `momentsByArtwork`; render `MomentStrip` | Modify |
| `src/components/screens/dex-screen.tsx` | pass `artworkId={openId}`; drop `openEntry` | Modify |
| `src/lib/db/queries.ts` | `updateMomentNote(userId, artworkId, index, note)` | Modify |
| `src/app/api/moment/route.ts` | `PATCH` a moment's note | Create |
| `src/lib/collection-store.tsx` | `updateMomentNote(artworkId, index, note)` optimistic + PATCH | Modify |

---

## Task 1: Shared PolaroidCard + refactor the develop overlay to use it

**Files:**
- Create: `src/components/polaroid-card.tsx`
- Modify: `src/components/polaroid-develop.tsx` (full replacement)

- [ ] **Step 1: Create `src/components/polaroid-card.tsx`**

```tsx
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
```

- [ ] **Step 2: Replace `src/components/polaroid-develop.tsx`** (reuse `PolaroidCard`, keep the fog img animation via `photoNode`)

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { MomentKind } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { PolaroidCard } from "@/components/polaroid-card";

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

      <PolaroidCard
        photo={photo}
        museumName={museumName}
        city={city}
        capturedAt={capturedAt}
        kind={kind}
        style={style}
        size="lg"
        showStamp={developed}
        photoNode={
          <motion.img
            src={photo}
            alt="Your moment"
            initial={{ filter: "blur(16px) brightness(1.6) saturate(0.25)", opacity: 0.2 }}
            animate={{ filter: "blur(0px) brightness(1) saturate(1)", opacity: 1 }}
            transition={{ duration: DEVELOP_MS / 1000, ease: "easeOut" }}
            className="block max-h-[60vh] w-full object-contain"
          />
        }
      />

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
```

- [ ] **Step 3: Typecheck & lint** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean) and `npx eslint src/components/polaroid-card.tsx src/components/polaroid-develop.tsx` (clean).

- [ ] **Step 4: Commit**

```bash
git add src/components/polaroid-card.tsx src/components/polaroid-develop.tsx
git commit -m "feat(stack): shared PolaroidCard; develop overlay reuses it"
```

> The develop animation is unchanged (still the fog img filter, passed via `photoNode`); only the card chrome is now shared. Full visual re-check happens in Task 7.

---

## Task 2: Backend — updateMomentNote

**Files:**
- Modify: `src/lib/db/queries.ts`

- [ ] **Step 1: Add `updateMomentNote` at the end of `src/lib/db/queries.ts`**

(`UpdateCommand`, `ddb`, `TABLES` are already imported from Phase 1.)

```ts
/**
 * Edit the note on one moment of a (user, artwork) record, targeted by its index in
 * the oldest-first list. Stored order == append order == chronological, so the index
 * the client sees matches the stored index. DynamoDB cannot parameterise a list index,
 * so the validated integer index is inlined into the expression.
 */
export async function updateMomentNote(
  userId: string,
  artworkId: string,
  index: number,
  note: string,
): Promise<void> {
  if (!Number.isInteger(index) || index < 0) throw new Error("invalid moment index");
  await ddb().send(
    new UpdateCommand({
      TableName: TABLES.collections,
      Key: { user_id: userId, artwork_id: artworkId },
      UpdateExpression: `SET moments[${index}].#note = :note`,
      ExpressionAttributeNames: { "#note": "note" },
      ExpressionAttributeValues: { ":note": note },
      ConditionExpression: "attribute_exists(user_id)",
    }),
  );
}
```

- [ ] **Step 2: Typecheck** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/lib/db/queries.ts
git commit -m "feat(stack): updateMomentNote — edit one moment's note by index"
```

---

## Task 3: API — PATCH /api/moment

**Files:**
- Create: `src/app/api/moment/route.ts`

- [ ] **Step 1: Create `src/app/api/moment/route.ts`**

(Pattern follows the existing `src/app/api/collect/route.ts`: `getUserId` from `@/lib/auth`, `force-dynamic`.)

```ts
import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { updateMomentNote } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (typeof b.artworkId !== "string" || !Number.isInteger(b.index) || b.index < 0) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
  const note = typeof b.note === "string" ? b.note : "";
  const userId = await getUserId();
  try {
    await updateMomentNote(userId, b.artworkId, b.index, note);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck & lint** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean) and `npx eslint src/app/api/moment/route.ts` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/moment/route.ts
git commit -m "feat(stack): PATCH /api/moment to edit a moment's note"
```

---

## Task 4: Store — updateMomentNote

**Files:**
- Modify: `src/lib/collection-store.tsx`

- [ ] **Step 1: Extend the context type** — in `src/lib/collection-store.tsx`, add to `CollectionContextValue`:

```ts
  updateMomentNote: (artworkId: string, index: number, note: string) => void
```

(Place it right after the existing `collect: (entry: CollectedEntry) => void` line.)

- [ ] **Step 2: Add the callback** — after the existing `collect` `useCallback` block, add:

```ts
  const updateMomentNote = useCallback((artworkId: string, index: number, note: string) => {
    setMomentsByArtwork((prev) => {
      const list = prev[artworkId]
      if (!list || !list[index]) return prev
      const next = list.map((m, i) => (i === index ? { ...m, note: note || undefined } : m))
      return { ...prev, [artworkId]: next }
    })
    fetch("/api/moment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworkId, index, note }),
    }).catch(() => {})
  }, [])
```

- [ ] **Step 3: Expose it in the memo value** — update the `useMemo` value object and its dependency array to include `updateMomentNote`:

```ts
  const value = useMemo<CollectionContextValue>(
    () => ({ collected, momentsByArtwork, isCollected, collect, updateMomentNote, count: Object.keys(collected).length, loading }),
    [collected, momentsByArtwork, isCollected, collect, updateMomentNote, loading],
  )
```

- [ ] **Step 4: Typecheck** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean).

- [ ] **Step 5: Commit**

```bash
git add src/lib/collection-store.tsx
git commit -m "feat(stack): store updateMomentNote (optimistic + PATCH)"
```

---

## Task 5: MomentRelive — full-screen relive with editable memory

**Files:**
- Create: `src/components/moment-relive.tsx`

- [ ] **Step 1: Create `src/components/moment-relive.tsx`**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Moment, MomentKind } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { useCollection } from "@/lib/collection-store";
import { PolaroidCard } from "@/components/polaroid-card";
import { getMuseum } from "@/lib/data";
import { stampDateLong } from "@/lib/stamp-format";
import { X } from "lucide-react";

export function MomentRelive({
  artworkId,
  index,
  moment,
  kind,
  onClose,
}: {
  artworkId: string;
  index: number;
  moment: Moment;
  kind: MomentKind;
  onClose: () => void;
}) {
  const [style] = useStampStyle();
  const { updateMomentNote } = useCollection();
  const [editing, setEditing] = useState(!moment.note);
  const [note, setNote] = useState(moment.note ?? "");
  const museum = getMuseum(moment.museumId);

  function save() {
    updateMomentNote(artworkId, index, note);
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center overflow-y-auto bg-background/96 px-6 py-12 backdrop-blur-md"
    >
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground">
        <X className="size-6" />
      </button>

      <PolaroidCard
        photo={moment.photo || "/placeholder.svg"}
        museumName={museum?.name ?? ""}
        city={museum?.city ?? ""}
        capturedAt={moment.capturedAt}
        kind={kind}
        style={style}
        size="lg"
      />

      <p className="mt-3 text-xs text-muted-foreground">
        {museum?.name}, {museum?.city} · {stampDateLong(moment.capturedAt)}
      </p>

      <div className="mt-5 w-full max-w-sm">
        {editing ? (
          <>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add a memory of this moment…"
              className="w-full resize-none rounded-sm border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
            <button
              onClick={save}
              className="mt-2 w-full bg-foreground py-3 text-sm font-semibold uppercase tracking-[0.15em] text-background"
            >
              Save memory
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="w-full border-l-2 border-foreground/30 pl-4 text-left">
            <p className="label-caps mb-1 text-muted-foreground">Your memory · tap to edit</p>
            <p className="font-heading text-base italic leading-relaxed text-foreground">{note}</p>
          </button>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Typecheck & lint** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean) and `npx eslint src/components/moment-relive.tsx` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/moment-relive.tsx
git commit -m "feat(stack): MomentRelive — full polaroid + show/add/edit memory"
```

---

## Task 6: MomentStrip — the filmstrip

**Files:**
- Create: `src/components/moment-strip.tsx`

- [ ] **Step 1: Create `src/components/moment-strip.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Moment } from "@/lib/domain/moments";
import { useStampStyle } from "@/lib/stamp-preference";
import { PolaroidCard } from "@/components/polaroid-card";
import { MomentRelive } from "@/components/moment-relive";
import { getMuseum } from "@/lib/data";

export function MomentStrip({ artworkId, moments }: { artworkId: string; moments: Moment[] }) {
  const [style] = useStampStyle();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // `moments` arrives oldest-first from the store, so index 0 is the 初遇.
  return (
    <>
      <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
        {moments.map((m, i) => {
          const museum = getMuseum(m.museumId);
          return (
            <button
              key={`${m.capturedAt}-${i}`}
              onClick={() => setOpenIndex(i)}
              className="shrink-0 snap-start transition-transform active:scale-[0.98]"
            >
              <PolaroidCard
                photo={m.photo || "/placeholder.svg"}
                museumName={museum?.name ?? ""}
                city={museum?.city ?? ""}
                capturedAt={m.capturedAt}
                kind={i === 0 ? "first" : "reunion"}
                style={style}
                size="sm"
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && moments[openIndex] && (
          <MomentRelive
            artworkId={artworkId}
            index={openIndex}
            moment={moments[openIndex]}
            kind={openIndex === 0 ? "first" : "reunion"}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Typecheck & lint** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean) and `npx eslint src/components/moment-strip.tsx` (clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/moment-strip.tsx
git commit -m "feat(stack): MomentStrip — swipeable filmstrip of moments"
```

---

## Task 7: Wire into the artwork detail sheet + dex caller

**Files:**
- Modify: `src/components/artwork-detail-sheet.tsx` (full replacement)
- Modify: `src/components/screens/dex-screen.tsx`

- [ ] **Step 1: Replace `src/components/artwork-detail-sheet.tsx`**

```tsx
"use client";

import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { MomentStrip } from "@/components/moment-strip";
import { getArtwork } from "@/lib/data";
import { useCollection } from "@/lib/collection-store";

export function ArtworkDetailSheet({
  artworkId,
  onClose,
}: {
  artworkId: string | null;
  onClose: () => void;
}) {
  const { momentsByArtwork } = useCollection();
  const artwork = artworkId ? getArtwork(artworkId) : undefined;
  const moments = artworkId ? momentsByArtwork[artworkId] ?? [] : [];

  return (
    <BottomSheet open={Boolean(artwork && moments.length > 0)} onClose={onClose}>
      {artwork && (
        <div className="px-5 pb-8 pt-3">
          <div className="overflow-hidden rounded-sm border border-border">
            <img src={artwork.image || "/placeholder.svg"} alt={artwork.title} className="aspect-[4/5] w-full object-cover" />
          </div>

          <div className="mt-4 flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <h2 className="text-pretty font-heading text-2xl font-bold leading-tight">{artwork.title}</h2>
              <p className="label-caps mt-1 text-muted-foreground">
                {artwork.artist} · {artwork.year}
              </p>
            </div>
            <RarityBadge rarity={artwork.rarity} size="md" />
          </div>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{artwork.blurb}</p>

          {moments.length > 0 && (
            <div className="mt-5">
              <p className="label-caps mb-2 text-muted-foreground">
                Your moments · {moments.length}
              </p>
              <MomentStrip artworkId={artwork.id} moments={moments} />
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
```

- [ ] **Step 2: Update the caller in `src/components/screens/dex-screen.tsx`**

Remove the now-unused `openEntry` derivation (the line `const openEntry = openId ? collected[openId] : null`).

Change the render line from:
```tsx
      <ArtworkDetailSheet entry={openEntry} onClose={() => setOpenId(null)} />
```
to:
```tsx
      <ArtworkDetailSheet artworkId={openId} onClose={() => setOpenId(null)} />
```

- [ ] **Step 3: Typecheck & lint** — `cd "G:/2026claude/artdex/ArtDex" && npx tsc --noEmit` (clean) and `npx eslint src/components/artwork-detail-sheet.tsx src/components/screens/dex-screen.tsx` (clean — pre-existing `@next/next/no-img-element` warnings are acceptable, not errors).

- [ ] **Step 4: Verify in preview** (controller-driven — see Verification). Open a collected work in the Dex → filmstrip of moments → tap a card → relive → add/edit memory.

- [ ] **Step 5: Commit**

```bash
git add src/components/artwork-detail-sheet.tsx src/components/screens/dex-screen.tsx
git commit -m "feat(stack): artwork detail shows the moment filmstrip (keyed by artworkId)"
```

---

## Verification (controller-driven, after Task 7)

1. **Backend round-trip (real DynamoDB):** a throwaway `scripts/_verify_note.ts` (delete after): `appendMoment` a temp moment, `updateMomentNote(user, art, 0, "hello")`, `getCollection` and assert `moments[0].note === "hello"`, then delete the temp item. Confirms the `SET moments[i].note` path works against the live table.
2. **UI (preview / phone):** With `NEXT_PUBLIC_MOCK_COLLECTION=1`, mock entries each have one moment, so the Dex detail shows a single 初遇 card. To exercise multi-moment + edit, set `NEXT_PUBLIC_MOCK_COLLECTION=0`, capture the same work twice, then open it in the Dex:
   - Filmstrip shows two cards; the left one has the brass 初遇 ring.
   - Tap a card → relive overlay with the large polaroid; if no memory, the textarea shows; type and Save → it persists (reopen shows it).
   - Tap a card that has a memory → it displays; "tap to edit" lets you change it.
   - Toggle the Profile stamp style → the strip + relive stamps switch postmark/ticket.
3. `preview_console_logs` (level error) clean.

---

## Self-Review checklist (before handoff)

- [ ] `npx vitest run` green (no new tests this phase; Phase 1/2 stay green).
- [ ] `npx tsc --noEmit` clean; `npx eslint src/` adds no new errors.
- [ ] Develop overlay (Phase 2) still looks/animates the same after the `PolaroidCard` refactor.
- [ ] Map / Achievements / Profile still render (they read `collected`, unchanged).

---

## Notes / carried decisions
- 初遇 = index 0 of the oldest-first list (no `kindOf` call needed in the strip; equivalent and simpler).
- Moment note edit targets a moment by index; relies on the append-order == chronological invariant (documented in `updateMomentNote`).
- No moment deletion, no re-photo, no draft sync (YAGNI per spec §6).
- The detail sheet opens only for works that have ≥1 moment (i.e. collected), preserving current behavior.
