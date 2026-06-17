import type { StampStyle } from "@/lib/domain/moments";

export type { StampStyle };

/** Coerce an arbitrary value to a valid stamp style, defaulting to "postmark". */
export function normalizeStampStyle(v: string | null | undefined): StampStyle {
  return v === "ticket" ? "ticket" : "postmark";
}
