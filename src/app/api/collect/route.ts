import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getArtwork, getMuseum, addCollection } from "@/lib/db/queries";
import { isOnSiteRequired } from "@/lib/domain/rarity";
import { haversineMeters, isWithinGate } from "@/lib/domain/locationGate";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const b = await req.json();
  const artwork = await getArtwork(b.artworkId);
  if (!artwork) return NextResponse.json({ error: "unknown artwork" }, { status: 404 });

  let museum = null;
  let exhibitionLabel = "";
  if (b.museumId) {
    museum = await getMuseum(b.museumId);
    if (museum) exhibitionLabel = `${museum.name}, ${museum.city}`;
  }

  // Location gate: legendary works must be collected on-site.
  if (isOnSiteRequired(artwork.rarity)) {
    if (!museum) {
      return NextResponse.json({ error: "museum required for legendary" }, { status: 400 });
    }
    if (typeof b.lat !== "number" || typeof b.lon !== "number") {
      return NextResponse.json({ error: "location required for legendary" }, { status: 400 });
    }
    const dist = haversineMeters(b.lat, b.lon, museum.lat, museum.lon);
    if (!isWithinGate(0, dist)) {
      return NextResponse.json(
        { error: "must be on-site to collect this legendary", distance: Math.round(dist) },
        { status: 403 }
      );
    }
  }

  const userId = await getUserId();
  const inserted = await addCollection({
    user_id: userId,
    artwork_id: artwork.id,
    collected_at: new Date().toISOString(),
    museum_id: b.museumId || undefined,
    exhibition_label: exhibitionLabel || undefined,
    selfie_url: b.selfieUrl || undefined,
    photo_url: b.photoUrl || undefined,
    note: b.note || undefined,
  });

  return NextResponse.json({ collected: true, alreadyHad: !inserted, rarity: artwork.rarity });
}
