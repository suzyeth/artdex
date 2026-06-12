"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGeolocation } from "@/lib/useGeolocation";
import { fetchNearbyMuseum, fetchCandidates, recognize, collect, fetchCollection } from "@/lib/api";
import type { Candidate, NearbyMuseum } from "@/lib/types";
import { isOnSiteRequired } from "@/lib/domain/rarity";
import { isWithinGate } from "@/lib/domain/locationGate";
import CollectSheet from "@/components/CollectSheet";
import CaptureCelebration from "@/components/CaptureCelebration";

const MOMA = { lat: 40.7614, lon: -73.9776 }; // demo fallback when geolocation fails
const NEARBY_M = 50_000; // treat museums within 50km as "you're at"

type Step = "camera" | "scanning" | "match" | "no-match" | "celebrating" | "done";

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; // data:image/jpeg;base64,XXXX
      const comma = result.indexOf(",");
      const mediaType = result.slice(5, result.indexOf(";"));
      resolve({ base64: result.slice(comma + 1), mediaType: mediaType || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CapturePage() {
  const geo = useGeolocation();
  const [demoCoords, setDemoCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("camera");
  const [match, setMatch] = useState<Candidate | null>(null);
  const [museum, setMuseum] = useState<NearbyMuseum | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const geoLat = geo.status === "ready" ? geo.lat : null;
  const geoLon = geo.status === "ready" ? geo.lon : null;
  const coords =
    demoCoords ?? (geoLat !== null && geoLon !== null ? { lat: geoLat, lon: geoLon } : null);

  // resolve the nearest museum whenever our coordinates change
  useEffect(() => {
    if (!coords) return;
    let live = true;
    fetchNearbyMuseum(coords.lat, coords.lon).then((m) => live && setMuseum(m));
    return () => {
      live = false;
    };
  }, [coords?.lat, coords?.lon]); // eslint-disable-line react-hooks/exhaustive-deps

  // load that museum's current works + the user's existing collection
  useEffect(() => {
    if (!museum) return;
    let live = true;
    fetchCandidates(museum.id).then((c) => live && setCandidates(c));
    return () => {
      live = false;
    };
  }, [museum?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCollection().then((items) => setCollected(new Set(items.map((i) => i.artworkId))));
  }, []);

  const atMuseum = museum !== null && museum.distM <= NEARBY_M;

  async function onPhotoChosen(file: File) {
    if (!museum) return;
    setPhoto(URL.createObjectURL(file));
    setStep("scanning");
    const { base64, mediaType } = await fileToBase64(file);
    const found = await recognize(museum.id, base64, mediaType);
    setMatch(found);
    setStep(found ? "match" : "no-match");
  }

  async function onCollect(note: string, selfieKey?: string) {
    if (!match || !museum || !coords) return;
    const res = await collect({
      artworkId: match.id,
      museumId: museum.id,
      lat: coords.lat,
      lon: coords.lon,
      note,
      selfieUrl: selfieKey,
    });
    if (res.ok) {
      setCollected((prev) => new Set(prev).add(match.id));
      setStep("celebrating");
    }
    // a gated/failed collect leaves the sheet open; the preemptive gateError below
    // already prevents the Collect button for legendaries you're not on-site for.
  }

  const gateError =
    match && museum && isOnSiteRequired(match.rarity) && !isWithinGate(0, museum.distM)
      ? `This is a Legendary — you must be at ${museum.name} (within 150 m) to collect it.`
      : null;

  // --- locating / error states ---
  if (!coords) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 pb-24 text-center text-zinc-100">
        {geo.status === "loading" ? (
          <>
            <p className="mb-3 animate-pulse text-5xl">📍</p>
            <p className="text-zinc-400">Locating you…</p>
          </>
        ) : (
          <>
            <p className="mb-3 text-5xl">📍</p>
            <p className="text-sm text-zinc-400">
              Couldn&apos;t get your location ({geo.status === "error" ? geo.message : ""}).
            </p>
            <button
              onClick={() => setDemoCoords(MOMA)}
              className="mt-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 font-semibold text-amber-950"
            >
              Demo at MoMA, New York
            </button>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-24 pt-6 text-zinc-100">
      {/* museum banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
        {atMuseum && museum ? (
          <>
            <p className="text-xs uppercase tracking-widest text-emerald-400">You&apos;re at</p>
            <p className="text-lg font-bold">{museum.name}</p>
            <p className="text-sm text-zinc-400">
              {museum.city} · {candidates.length} works on display
              {museum.distM > 1000 && ` · ${(museum.distM / 1000).toFixed(0)}km away`}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">{museum ? "No museum nearby" : "Finding museums…"}</p>
            {museum && (
              <p className="text-sm text-zinc-400">
                Nearest: {museum.name} ({(museum.distM / 1000).toFixed(0)}km away)
              </p>
            )}
            <button
              onClick={() => setDemoCoords(MOMA)}
              className="mt-3 rounded-full border border-amber-400/60 px-4 py-2 text-sm font-semibold text-amber-300"
            >
              Demo at MoMA instead
            </button>
          </>
        )}
      </div>

      {/* viewfinder / photo preview */}
      <div className="relative mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Your photo" className="h-full w-full object-contain" />
        ) : (
          <div className="p-10 text-center text-zinc-600">
            <p className="text-6xl">🖼️</p>
            <p className="mt-3 text-sm">Point your camera at an artwork</p>
          </div>
        )}
        {step === "scanning" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="mt-4 animate-pulse text-sm text-zinc-300">
              Matching against {candidates.length} works on display…
            </p>
          </div>
        )}
      </div>

      {/* shutter */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPhotoChosen(f);
          e.target.value = "";
        }}
      />
      <div className="mt-4 flex justify-center">
        <button
          aria-label="Take photo"
          disabled={!atMuseum || step === "scanning"}
          onClick={() => fileRef.current?.click()}
          className="h-18 w-18 rounded-full border-4 border-zinc-700 bg-zinc-100 p-1 transition active:scale-90 disabled:opacity-30"
        >
          <span className="block h-14 w-14 rounded-full bg-zinc-100 ring-2 ring-zinc-900" />
        </button>
      </div>

      {/* no-match fallback: manual pick */}
      {step === "no-match" && (
        <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm text-zinc-300">
            Couldn&apos;t identify it — pick from the works on display:
          </p>
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setMatch(c);
                  setStep("match");
                }}
                className="block w-full rounded-lg bg-zinc-800 px-3 py-2 text-left text-sm text-zinc-200"
              >
                {c.title} — {c.artistName}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "match" && match && museum && (
        <CollectSheet
          artwork={match}
          museumName={museum.name}
          alreadyCollected={collected.has(match.id)}
          gateError={gateError}
          onCollect={onCollect}
          onDismiss={() => {
            setMatch(null);
            setStep("no-match");
          }}
        />
      )}

      {step === "celebrating" && match && (
        <CaptureCelebration
          title={match.title}
          artistName={match.artistName}
          imageUrl={match.imageUrl}
          rarity={match.rarity}
          onDone={() => setStep("done")}
        />
      )}

      {step === "done" && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center">
          <Link
            href="/dex"
            className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 px-6 py-3 font-semibold text-amber-950 shadow-lg"
          >
            View in my Dex →
          </Link>
        </div>
      )}
    </main>
  );
}
