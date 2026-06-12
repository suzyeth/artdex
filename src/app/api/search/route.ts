import { NextRequest, NextResponse } from "next/server";
import { getAllArtworks, getAllArtists } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();
  if (!q) return NextResponse.json({ results: [] });
  const [artworks, artists] = await Promise.all([getAllArtworks(), getAllArtists()]);
  const nameById = new Map(artists.map((a) => [a.id, a.name]));
  const results = artworks
    .filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        (nameById.get(w.artist_id) ?? "").toLowerCase().includes(q)
    )
    .slice(0, 20)
    .map((w) => ({
      id: w.id,
      title: w.title,
      year: w.year,
      artistName: nameById.get(w.artist_id) ?? "",
      rarity: w.rarity,
      imageUrl: w.image_url,
    }));
  return NextResponse.json({ results });
}
