import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getCollection, getAllArtworks, getAllArtists, getAllMuseums } from "@/lib/db/queries";
import { presignedGetUrl } from "@/lib/aws/s3";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getUserId();
  const [records, artworks, artists, museums] = await Promise.all([
    getCollection(userId),
    getAllArtworks(),
    getAllArtists(),
    getAllMuseums(),
  ]);
  const artworkById = new Map(artworks.map((a) => [a.id, a]));
  const nameById = new Map(artists.map((a) => [a.id, a.name]));
  const museumById = new Map(museums.map((m) => [m.id, m]));

  const items = await Promise.all(
    records.map(async (r) => {
      const w = artworkById.get(r.artwork_id);
      const m = r.museum_id ? museumById.get(r.museum_id) : undefined;
      return {
        artworkId: r.artwork_id,
        title: w?.title ?? r.artwork_id,
        artistName: w ? nameById.get(w.artist_id) ?? "" : "",
        rarity: w?.rarity ?? "common",
        imageUrl: w?.image_url ?? "",
        collectedAt: r.collected_at,
        museumId: r.museum_id ?? "",
        museumName: m?.name ?? "",
        city: m?.city ?? "",
        lat: m?.lat ?? null,
        lon: m?.lon ?? null,
        note: r.note ?? "",
        // selfie_url is an S3 key (presign it) OR a local/remote path (pass through).
        selfieUrl: !r.selfie_url
          ? ""
          : r.selfie_url.startsWith("/") || r.selfie_url.startsWith("http")
            ? r.selfie_url
            : await presignedGetUrl(r.selfie_url),
      };
    })
  );

  return NextResponse.json({ items });
}
