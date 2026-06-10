// MOCK: client-side stand-ins for the Phase 5 API routes, driven by seedData.
// Each function mirrors the contract of a future route so the swap in Phase 5/6
// is mechanical: nearestMuseumLocal -> /api/museums/nearby,
// currentCandidatesLocal -> /api/candidates, mockRecognize -> /api/recognize.
import { museums, artworks, exhibitions, artists } from "@/lib/db/seedData";
import { haversineMeters } from "@/lib/domain/locationGate";
import { filterCurrentExhibits } from "@/lib/domain/candidates";
import type { Rarity } from "@/lib/domain/rarity";

export type NearbyMuseum = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  distM: number;
};

export type Candidate = {
  id: string;
  title: string;
  year: string;
  artistName: string;
  rarity: Rarity;
  imageUrl: string;
};

export function nearestMuseumLocal(lat: number, lon: number): NearbyMuseum {
  const ranked = museums
    .map((m) => ({
      id: m.id,
      name: m.name,
      city: m.city,
      lat: m.lat,
      lon: m.lon,
      distM: haversineMeters(lat, lon, m.lat, m.lon),
    }))
    .sort((a, b) => a.distM - b.distM);
  return ranked[0];
}

export function currentCandidatesLocal(museumId: string, today: string): Candidate[] {
  const rows = exhibitions
    .filter((e) => e.museumId === museumId)
    .map((e) => ({ artworkId: e.artworkId, start: e.start, end: e.end }));
  const ids = new Set(filterCurrentExhibits(rows, today));
  return artworks
    .filter((w) => ids.has(w.id))
    .map((w) => ({
      id: w.id,
      title: w.title,
      year: w.year,
      artistName: artists.find((a) => a.id === w.artistId)?.name ?? "",
      rarity: w.rarity,
      imageUrl: w.imageUrl,
    }));
}

/**
 * MOCK recognizer: pretends the photo matched one of the museum's current
 * works, preferring ones the user hasn't collected yet. Replaced by the
 * Bedrock-backed /api/recognize in Phase 5.
 */
export function mockRecognize(
  candidates: Candidate[],
  alreadyCollected: Set<string>
): Candidate | null {
  if (candidates.length === 0) return null;
  const fresh = candidates.filter((c) => !alreadyCollected.has(c.id));
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}
