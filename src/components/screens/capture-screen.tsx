"use client";

import { useEffect, useRef, useState } from "react";
import { getArtwork, getMuseum, MUSEUMS, type Rarity } from "@/lib/data";
import { useCollection } from "@/lib/collection-store";
import { kindOf, type Moment, type MomentKind, type StampStyle } from "@/lib/domain/moments";
import { MatchSheet } from "@/components/match-sheet";
import { PolaroidDevelop } from "@/components/polaroid-develop";
import { BottomSheet } from "@/components/bottom-sheet";
import { RarityBadge } from "@/components/rarity-badge";
import { fetchCandidates, uploadSelfie } from "@/lib/api";
import type { Candidate } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Scan, ImageIcon, MapPin, ChevronDown } from "lucide-react";
import { useGeolocation } from "@/lib/useGeolocation";
import { useCamera } from "@/lib/useCamera";
import { nearestMuseum, haversineMeters, GATE_RADIUS_M } from "@/lib/domain/locationGate";

type Phase = "idle" | "scanning";

type DevelopState = {
  photo: string;
  museumName: string;
  city: string;
  capturedAt: string;
  kind: MomentKind;
  stampStyle: StampStyle;
  rarity: Rarity;
};

// Capture is scoped to one museum's on-display works at a time; Bedrock matches the
// photo against only that museum's current candidates. Any cataloged museum can be
// the target — the list comes straight from the catalog so it stays in sync.
const CAPTURE_MUSEUMS = Object.values(MUSEUMS).sort((a, b) => a.name.localeCompare(b.name));
const MAX_EDGE = 1024;

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      resolve({ base64: dataUrl.slice(dataUrl.indexOf(",") + 1), mediaType: "image/jpeg" });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}

export function CaptureScreen() {
  const { collect, isCollected, momentsByArtwork } = useCollection();
  const [museumId, setMuseumId] = useState<string>("moma");
  const [pickerOpen, setPickerOpen] = useState(false);
  const geo = useGeolocation();
  const [located, setLocated] = useState(false);

  // GPS -> nearest cataloged museum, computed client-side (MUSEUMS is already loaded).
  // Pre-selects the dropdown; the user can still override it. On geo failure we simply
  // leave the dropdown at its default — it doubles as the manual fallback.
  useEffect(() => {
    if (geo.status !== "ready") return;
    const hit = nearestMuseum(geo.lat, geo.lon, Object.values(MUSEUMS));
    if (hit) {
      setMuseumId(hit.museum.id);
      setLocated(true);
    }
  }, [geo]);

  // Distance to the CURRENTLY SELECTED museum (not just the nearest), so a manual
  // override is judged correctly. Legendary seal requires being within the gate of it.
  const coords = geo.status === "ready" ? { lat: geo.lat, lon: geo.lon } : null;
  const selectedMuseum = MUSEUMS[museumId];
  const distToSelected =
    coords && selectedMuseum
      ? haversineMeters(coords.lat, coords.lon, selectedMuseum.lat, selectedMuseum.lon)
      : null;
  const locationVerified = distToSelected !== null && distToSelected <= GATE_RADIUS_M;

  // Museum picker rows: nearest-first when located, else alphabetical.
  const museumChoices = CAPTURE_MUSEUMS.map((m) => ({
    m,
    dist: coords ? haversineMeters(coords.lat, coords.lon, m.lat, m.lon) : null,
  })).sort((a, b) =>
    a.dist != null && b.dist != null ? a.dist - b.dist : a.m.name.localeCompare(b.m.name),
  );

  const [phase, setPhase] = useState<Phase>("idle");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [develop, setDevelop] = useState<DevelopState | null>(null);
  const [miss, setMiss] = useState(false);
  const [isRepro, setIsRepro] = useState(false);
  const [manual, setManual] = useState<Candidate[] | null>(null);
  const [capturePreview, setCapturePreview] = useState<string | undefined>();
  const captureKey = useRef<string | undefined>(undefined);
  const uploadPromise = useRef<Promise<string | undefined> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { videoRef, status: camStatus, capture: captureFrame } = useCamera();

  // Shutter: grab the live frame when the camera is running, else fall back to the
  // gallery picker (camera denied / unavailable / not a secure context).
  async function shoot() {
    if (phase === "scanning") return;
    if (camStatus === "live") {
      const file = await captureFrame();
      if (file) {
        onPhoto(file);
        return;
      }
    }
    fileRef.current?.click();
  }

  async function openManual() {
    const candidates = await fetchCandidates(museumId);
    setManual(candidates);
  }

  async function onPhoto(file: File) {
    setMiss(false);
    setIsRepro(false);
    setPhase("scanning");
    // This photo IS the keepsake: show it locally and upload to S3 in the background.
    setCapturePreview(URL.createObjectURL(file));
    captureKey.current = undefined;
    // Keep the upload promise so a fast seal can wait for the key instead of losing it.
    uploadPromise.current = uploadSelfie(file)
      .then((key) => {
        if (key) captureKey.current = key;
        return key ?? undefined;
      })
      .catch(() => undefined);
    try {
      const { base64, mediaType } = await fileToBase64(file);
      const res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ museumId, imageBase64: base64, mediaType }),
      });
      const { artwork, isReproduction } = await res.json();
      setPhase("idle");
      if (artwork?.id) {
        setIsRepro(Boolean(isReproduction));
        setMatchId(artwork.id);
      } else {
        setMiss(true);
        openManual(); // let the user pick from works on display
      }
    } catch {
      setPhase("idle");
      setMiss(true);
    }
  }

  function pickManual(id: string) {
    setManual(null);
    setIsRepro(false);
    setMatchId(id);
  }

  function handleContinue() {
    if (capturePreview) URL.revokeObjectURL(capturePreview);
    setCapturePreview(undefined);
    setDevelop(null);
  }

  function handleSeal(note: string, stampStyle: StampStyle) {
    const id = matchId;
    if (!id) return;
    const art = getArtwork(id);
    const museum = getMuseum(museumId) ?? (art ? getMuseum(art.museumId) : undefined);
    const capturedAt = new Date().toISOString();

    // Derive 初遇/重逢 from the moments BEFORE this one is appended (kindOf sorts internally).
    const prior = momentsByArtwork[id] ?? [];
    const thisMoment: Moment = { capturedAt, museumId: art?.museumId ?? "" };
    const kind = kindOf([...prior, thisMoment], thisMoment);

    // Persist with the keepsake key. If the S3 upload hasn't finished yet, wait for
    // it so we never silently drop the photo; the develop overlay still shows instantly.
    const commit = (selfie?: string) =>
      collect({
        artworkId: id,
        note: note || undefined,
        selfie,
        collectedAt: capturedAt.slice(0, 10),
        stampStyle,
        museumId,
        lat: coords?.lat,
        lon: coords?.lon,
      });
    if (captureKey.current) commit(captureKey.current);
    else if (uploadPromise.current) uploadPromise.current.then(commit);
    else commit(undefined);
    setMatchId(null);

    if (art && museum) {
      setDevelop({
        photo: capturePreview || art.image || "/placeholder.svg",
        museumName: museum.name,
        city: museum.city,
        capturedAt,
        kind,
        stampStyle,
        rarity: art.rarity,
      });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-28 pt-6">
      {/* Compact header — a quiet catalogue plate; tap to switch museum */}
      <div className="mx-auto mb-5 w-full max-w-sm border-b border-border pb-3.5 text-center">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          disabled={phase === "scanning"}
          aria-label="Choose the museum to identify against"
          className="inline-flex max-w-full items-center gap-1.5 transition-opacity active:opacity-60 disabled:opacity-50"
        >
          <span className="label-caps truncate text-foreground">{selectedMuseum?.name ?? "Choose a museum"}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
        {coords && distToSelected !== null && (
          <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3 text-primary" />
            {located ? "Located · " : ""}
            {distToSelected < 1000
              ? `${Math.round(distToSelected)} m away`
              : `${(distToSelected / 1000).toFixed(1)} km away`}
          </p>
        )}
      </div>

      {/* Viewfinder — the live camera is the hero */}
      <div className="relative mx-auto w-full max-w-sm flex-1 min-h-[52vh] overflow-hidden rounded-lg border border-foreground/12 bg-secondary">
        {/* Live camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity",
            camStatus === "live" && phase === "idle" && !capturePreview ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Frozen frame held while scanning / before sealing */}
        {capturePreview && (
          <img src={capturePreview} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}

        {/* Camera unavailable → guide to the gallery (shutter routes there too) */}
        {camStatus === "unavailable" && phase === "idle" && !capturePreview && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <ImageIcon className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Camera unavailable — pick a photo from your library</p>
          </div>
        )}

        {/* A quiet inset mat — refined framing, no gamey ticks */}
        <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />

        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/40 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ top: "12%" }}
                animate={{ top: ["12%", "88%", "12%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-6 h-0.5 bg-primary shadow-[0_0_16px_2px_var(--primary)]"
              />
              <Scan className="size-9 animate-pulse text-primary" />
              <p className="text-sm font-medium text-foreground">Matching against works on display…</p>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="size-1.5 rounded-full bg-primary"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "idle" && miss && !capturePreview && (
          <div className="absolute inset-x-0 bottom-5 text-center">
            <p className="mx-auto inline-block rounded bg-background/70 px-2 py-1 text-xs text-muted-foreground">
              Couldn&apos;t identify it — try another angle
            </p>
          </div>
        )}
      </div>

      {/* Controls — gallery + shutter (no flash) */}
      <div className="mx-auto mt-6 flex w-full max-w-sm items-center justify-center gap-12">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={phase === "scanning"}
          className="flex size-12 items-center justify-center rounded-full text-muted-foreground transition-transform active:scale-90 disabled:opacity-50"
          aria-label="Choose from library"
        >
          <ImageIcon className="size-6" />
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPhoto(f);
            e.target.value = "";
          }}
        />

        <button
          onClick={shoot}
          disabled={phase === "scanning"}
          aria-label="Capture artwork"
          className="relative flex size-[76px] items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-60"
        >
          <span className="absolute inset-0 rounded-full border border-foreground/30" />
          <span
            className={cn(
              "size-[58px] rounded-full bg-foreground transition-transform",
              phase === "scanning" && "scale-90 opacity-60",
            )}
          />
        </button>

        {/* balances the gallery button so the shutter stays centered */}
        <span className="size-12" aria-hidden />
      </div>

      <MatchSheet
        artworkId={matchId}
        alreadyCollected={matchId ? isCollected(matchId) : false}
        priorVisits={matchId ? (momentsByArtwork[matchId]?.length ?? 0) : 0}
        isReproduction={isRepro}
        photoPreview={capturePreview}
        locationVerified={locationVerified}
        onClose={() => setMatchId(null)}
        onSeal={handleSeal}
      />

      {/* Museum picker — replaces the native select; nearest-first when located */}
      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-3 text-center text-muted-foreground">Choose a museum</p>
          <div className="max-h-[55vh] space-y-0.5 overflow-y-auto">
            {museumChoices.map(({ m, dist }) => (
              <button
                key={m.id}
                onClick={() => {
                  setMuseumId(m.id);
                  setPickerOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left transition-colors active:bg-secondary/60",
                  m.id === museumId && "bg-secondary/50",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-heading text-sm font-semibold">{m.name}</span>
                  <span className="label-caps text-muted-foreground">{m.city}</span>
                </span>
                {dist != null && (
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(1)} km`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Manual fallback — pick from the works currently on display */}
      <BottomSheet open={manual !== null} onClose={() => setManual(null)}>
        <div className="px-5 pb-8 pt-3">
          <p className="label-caps mb-1 text-center text-primary">Couldn&apos;t identify it</p>
          <p className="mb-4 text-center text-sm text-muted-foreground">Choose from the works on display</p>
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {(manual ?? []).map((c) => (
              <button
                key={c.id}
                onClick={() => pickManual(c.id)}
                className="flex w-full items-center gap-3 rounded-sm border border-border p-2 text-left transition-colors active:bg-secondary/50"
              >
                <img src={c.imageUrl || "/placeholder.svg"} alt={c.title} className="size-12 shrink-0 rounded-sm object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-sm font-semibold">{c.title}</span>
                  <span className="label-caps text-muted-foreground">{c.artistName}</span>
                </span>
                <RarityBadge rarity={c.rarity} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <AnimatePresence>
        {develop && <PolaroidDevelop {...develop} onContinue={handleContinue} />}
      </AnimatePresence>
    </div>
  );
}
