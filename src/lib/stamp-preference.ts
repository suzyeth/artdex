"use client";
import { useEffect, useState } from "react";

export type StampStyle = "postmark" | "ticket";

const KEY = "artdex:stamp-style";
const EVT = "artdex:stamp-style-change";
const DEFAULT: StampStyle = "postmark";

export function normalizeStampStyle(v: string | null | undefined): StampStyle {
  return v === "ticket" ? "ticket" : "postmark";
}

/**
 * Read/write the global keepsake-stamp preference (per-device, localStorage).
 * Every mounted instance stays in sync: `update` broadcasts a window event so a
 * toggle in one view (e.g. relive) updates the stamp everywhere it shows.
 */
export function useStampStyle(): [StampStyle, (s: StampStyle) => void] {
  const [style, setStyle] = useState<StampStyle>(DEFAULT);

  useEffect(() => {
    try {
      setStyle(normalizeStampStyle(localStorage.getItem(KEY)));
    } catch {
      // localStorage unavailable — keep default
    }
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<StampStyle>).detail;
      if (detail === "postmark" || detail === "ticket") {
        setStyle(detail);
      } else {
        try {
          setStyle(normalizeStampStyle(localStorage.getItem(KEY)));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = (s: StampStyle) => {
    setStyle(s);
    try {
      localStorage.setItem(KEY, s);
    } catch {
      // ignore write failures
    }
    try {
      window.dispatchEvent(new CustomEvent<StampStyle>(EVT, { detail: s }));
    } catch {
      // ignore
    }
  };

  return [style, update];
}
