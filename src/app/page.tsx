import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-zinc-100">
      <p className="mb-3 text-5xl">🖼️</p>
      <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">ArtDex</h1>
      <p className="mt-4 max-w-md text-balance text-zinc-400">
        Pokémon GO, but you collect the world&apos;s masterpieces. Visit a
        museum, snap the artwork in front of you, and add it to your Dex.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/dex"
          className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 font-semibold text-amber-950 transition hover:brightness-110"
        >
          Open my Dex
        </Link>
        <Link
          href="/capture"
          className="rounded-full border border-zinc-700 px-6 py-3 font-semibold text-zinc-200 transition hover:border-zinc-500"
        >
          📷 Capture
        </Link>
      </div>
    </main>
  );
}
