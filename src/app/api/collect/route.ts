import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getArtwork, getMuseum, appendMoment } from "@/lib/db/queries";
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

  // Location gate: legendary works must be collected on-site. Two ways to satisfy it:
  // (1) real GPS coords within range, or (2) an explicit on-site signal from a
  // client whose museum detection already confirmed presence (the v0 capture flow).
  if (isOnSiteRequired(artwork.rarity)) {
    if (!museum) {
      return NextResponse.json({ error: "museum required for legendary" }, { status: 400 });
    }
    if (b.onSite !== true) {
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
  }

  const userId = await getUserId();
  const capturedAt = new Date().toISOString();
  const { isFirst } = await appendMoment(userId, artwork.id, {
    capturedAt,
    museumId: b.museumId || "",
    exhibitionLabel: exhibitionLabel || undefined,
    photo: b.selfieUrl || b.photoUrl || undefined,
    note: b.note || undefined,
    stampStyle: b.stampStyle === "ticket" ? "ticket" : "postmark",
  });

  return NextResponse.json({ collected: true, isFirst, rarity: artwork.rarity });
}
