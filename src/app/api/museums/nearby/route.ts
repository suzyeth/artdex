import { NextRequest, NextResponse } from "next/server";
import { getAllMuseums } from "@/lib/db/queries";
import { haversineMeters } from "@/lib/domain/locationGate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lon = Number(req.nextUrl.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }
  const museums = await getAllMuseums();
  let best: (typeof museums)[number] | null = null;
  let bestD = Infinity;
  for (const m of museums) {
    const d = haversineMeters(lat, lon, m.lat, m.lon);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  if (!best) return NextResponse.json({ museum: null });
  return NextResponse.json({
    museum: { id: best.id, name: best.name, city: best.city, lat: best.lat, lon: best.lon, distM: bestD },
  });
}
