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

  // S3 keys are presigned; local/remote paths pass through.
  const resolvePhoto = async (u?: string): Promise<string> =>
    !u ? "" : u.startsWith("/") || u.startsWith("http") ? u : await presignedGetUrl(u);

  const items = await Promise.all(
    records.map(async (r) => {
      const w = artworkById.get(r.artwork_id);
      const m = r.museum_id ? museumById.get(r.museum_id) : undefined;

      // Prefer the new moments list; synthesize one from legacy fields for old rows.
      const rawMoments =
        r.moments && r.moments.length > 0
          ? r.moments
          : [{
              capturedAt: r.collected_at,
              museumId: r.museum_id ?? "",
              exhibitionLabel: r.exhibition_label,
              photo: r.selfie_url,
              note: r.note,
            }];

      const moments = await Promise.all(
        rawMoments.map(async (mo) => ({
          capturedAt: mo.capturedAt,
          museumId: mo.museumId ?? "",
          exhibitionLabel: mo.exhibitionLabel ?? "",
          note: mo.note ?? "",
          photo: await resolvePhoto(mo.photo),
        })),
      );

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
        selfieUrl: await resolvePhoto(r.selfie_url),
        moments,
      };
    })
  );

  return NextResponse.json({ items });
}
