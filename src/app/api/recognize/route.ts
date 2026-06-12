import { NextRequest, NextResponse } from "next/server";
import { currentCandidates } from "@/lib/db/queries";
import { buildRecognitionPrompt, parseRecognition } from "@/lib/domain/recognition";
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
  const text = await recognizeArtwork(imageBase64, mediaType ?? "image/jpeg", prompt);
  const id = parseRecognition(text, candidates.map((c) => c.id));
  const artwork = candidates.find((c) => c.id === id) ?? null;
  return NextResponse.json({ artwork });
}
