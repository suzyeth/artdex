import { NextRequest, NextResponse } from "next/server";
import { currentCandidates } from "@/lib/db/queries";
import {
  buildRecognitionPrompt,
  parseRecognition,
  isReproduction,
} from "@/lib/domain/recognition";
import { recognizeArtwork } from "@/lib/aws/bedrock";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { museumId, imageBase64, mediaType } = await req.json();
  if (!museumId || !imageBase64) {
    return NextResponse.json({ error: "museumId and imageBase64 required" }, { status: 400 });
  }
  const today = new Date().toISOString().slice(0, 10);
  const candidates = await currentCandidates(museumId, today);
  if (candidates.length === 0) return NextResponse.json({ artwork: null });

  const prompt = buildRecognitionPrompt(
    candidates.map((c) => ({ id: c.id, title: c.title, artist: c.artistName }))
  );
  // Demo/dev escape hatch: set DISABLE_REPRO_CHECK=1 (e.g. in .env.local) to
  // suppress the "looks like a reproduction" warning when demoing from a print
  // or screen. Off by default, so deployed builds keep the check.
  const reproCheckEnabled = process.env.DISABLE_REPRO_CHECK !== "1";
  try {
    const text = await recognizeArtwork(imageBase64, mediaType ?? "image/jpeg", prompt);
    const id = parseRecognition(text, candidates.map((c) => c.id));
    const artwork = candidates.find((c) => c.id === id) ?? null;
    const repro = artwork ? reproCheckEnabled && isReproduction(text) : false;
    return NextResponse.json({ artwork, isReproduction: repro });
  } catch (err) {
    // Don't crash the capture flow on a Bedrock hiccup — the UI falls back to
    // manual search when recognition is unavailable.
    console.error("recognize failed:", err);
    return NextResponse.json({ artwork: null, error: "recognition_unavailable" });
  }
}
