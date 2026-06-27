import { NextRequest, NextResponse } from "next/server";
import { getAllMuseums } from "@/lib/db/queries";
import { nearestMuseum } from "@/lib/domain/locationGate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }
  const hit = nearestMuseum(lat, lon, await getAllMuseums());
  if (!hit) return NextResponse.json({ museum: null });
  const { museum: best, distanceM } = hit;
  return NextResponse.json({
    museum: { id: best.id, name: best.name, city: best.city, lat: best.lat, lon: best.lon, distM: distanceM },
  });
}
