"use client";

import Link from "next/link";
import { useState } from "react";

// Monetization showcase (hackathon mock — no real billing). Demonstrates the
// B2C revenue model: collector subscription + museum partnerships.
const PERKS = [
  { icon: "🎨", title: "Gilded passport skins", desc: "Exclusive frames & card backs for your Dex" },
  { icon: "📊", title: "Collector analytics", desc: "Rarity stats, streaks, and completion forecasts" },
  { icon: "🎟️", title: "Partner museum perks", desc: "Member discounts at partner museums worldwide" },
  { icon: "🗺️", title: "Exhibition radar", desc: "Get alerted when a missing work tours near you" },
  { icon: "👑", title: "Early drops", desc: "New artist sets a week before everyone else" },
];

export default function PremiumPage() {
  const [clicked, setClicked] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-6 text-zinc-100">
      <Link href="/dex" className="text-sm text-zinc-500">
        ← Back to Dex
      </Link>

      <header className="mt-4 rounded-3xl border border-amber-400/40 bg-gradient-to-b from-amber-500/15 to-transparent p-6 text-center">
        <p className="text-4xl">✦</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">ArtDex Premium</h1>
        <p className="mt-1 text-sm text-zinc-400">For collectors who never stop hunting</p>
        <p className="mt-4 text-3xl font-bold text-amber-300">
          $3.99<span className="text-base font-normal text-zinc-400">/month</span>
        </p>
      </header>

      <ul className="mt-6 space-y-3">
        {PERKS.map((p) => (
          <li
            key={p.title}
            className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <span className="text-2xl">{p.icon}</span>
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-zinc-400">{p.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setClicked(true)}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 py-3.5 font-semibold text-amber-950"
      >
        {clicked ? "Coming soon — thanks for the interest! 💛" : "Start 7-day free trial"}
      </button>
      <p className="mt-2 text-center text-xs text-zinc-600">
        Hackathon demo — billing not wired up (yet).
      </p>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs uppercase tracking-widest text-emerald-400">For museums</p>
        <p className="mt-1 text-sm text-zinc-300">
          Partner with ArtDex: turn visitors into collectors. On-site exclusives drive foot
          traffic; capture analytics show which works pull crowds.
        </p>
        <p className="mt-2 text-sm font-semibold text-zinc-100">partnerships@artdex.app</p>
      </section>
    </main>
  );
}
