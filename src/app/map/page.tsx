"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// MOCK: localStorage-backed collection until /api/collection lands in Phase 7.
import { getRecords, STARTER_RECORDS, type CollectionRecord } from "@/lib/mock/mockCollection";

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
  const [records, setRecords] = useState<CollectionRecord[]>(STARTER_RECORDS);
  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const cities = new Set(records.map((r) => r.museumId)).size;

  return (
    <main className="flex h-screen flex-col text-zinc-100">
      <header className="z-10 border-b border-zinc-800 bg-zinc-950/90 px-4 pb-3 pt-6 backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">My Art World</h1>
        <p className="mt-0.5 text-sm text-zinc-400">
          {records.length} works captured across {cities} museums
        </p>
      </header>
      <div className="min-h-0 flex-1 pb-[52px]">
        <WorldMap records={records} />
      </div>
    </main>
  );
}
