"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchCollection } from "@/lib/api";
import type { CollectionItem } from "@/lib/types";

// Leaflet touches `window` at import time — must skip SSR entirely.
const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-zinc-500">
      <p className="animate-pulse">Loading your world…</p>
    </div>
  ),
});

export default function MapPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  useEffect(() => {
    fetchCollection().then(setItems);
  }, []);

  const cities = new Set(items.map((i) => i.museumId).filter(Boolean)).size;

  return (
    <main className="flex h-screen flex-col text-zinc-100">
      <header className="z-10 border-b border-zinc-800 bg-zinc-950/90 px-4 pb-3 pt-6 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">My Art World</h1>
        <p className="mt-0.5 text-sm text-zinc-400">
          {items.length} works captured across {cities} museums
        </p>
      </header>
      <div className="min-h-0 flex-1 pb-[calc(56px+env(safe-area-inset-bottom))]">
        <WorldMap items={items} />
      </div>
    </main>
  );
}
