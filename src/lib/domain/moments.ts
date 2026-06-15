// Pure helpers for "moments" — a user can capture the same artwork many times.
// The earliest capture of an artwork is the 初遇 (first encounter); later ones are
// 重逢 (reunions). Kind is always DERIVED from capturedAt, never stored as state.

export interface Moment {
  capturedAt: string;        // ISO timestamp, e.g. "2026-06-15T10:30:00.000Z"
  museumId: string;          // museum the capture happened in
  exhibitionLabel?: string;  // snapshot label, e.g. "The Louvre, Paris"
  photo?: string;            // keepsake photo (the with-it / selfie shot)
  note?: string;
}

export type MomentKind = "first" | "reunion";

/** Moments ordered oldest-first (ascending capturedAt). Does not mutate input. */
export function sortMoments(moments: Moment[]): Moment[] {
  return [...moments].sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

/** The earliest moment for an artwork — the 初遇. undefined when there are none. */
export function firstMoment(moments: Moment[]): Moment | undefined {
  return sortMoments(moments)[0];
}

/**
 * "first" only for the single earliest capture; "reunion" for every later one.
 * Precondition: `target` is normally one of `moments`. When `target` is present
 * by identity, only the literal earliest object is the 初遇 — so two captures that
 * share an identical `capturedAt` are correctly split into first + reunion. For a
 * deserialized `target` not present by reference, falls back to a capturedAt match.
 */
export function kindOf(moments: Moment[], target: Moment): MomentKind {
  const sorted = sortMoments(moments);
  if (moments.includes(target)) {
    return sorted[0] === target ? "first" : "reunion";
  }
  return sorted[0]?.capturedAt === target.capturedAt ? "first" : "reunion";
}
