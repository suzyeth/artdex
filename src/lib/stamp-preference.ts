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
