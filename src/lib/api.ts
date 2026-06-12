// Client-side fetch helpers for the ArtDex API routes. These replace the
// former src/lib/mock layer; the UI talks to real DynamoDB/Bedrock through them.
import type { Candidate, NearbyMuseum, CollectionItem } from "@/lib/types";

export async function fetchNearbyMuseum(lat: number, lon: number): Promise<NearbyMuseum | null> {
  const res = await fetch(`/api/museums/nearby?lat=${lat}&lon=${lon}`);
  if (!res.ok) return null;
  const { museum } = await res.json();
  return museum ?? null;
}

export async function fetchCandidates(museumId: string): Promise<Candidate[]> {
  const res = await fetch(`/api/candidates?museumId=${encodeURIComponent(museumId)}`);
  if (!res.ok) return [];
  const { candidates } = await res.json();
  return candidates ?? [];
}

export async function recognize(
  museumId: string,
  imageBase64: string,
  mediaType: string
): Promise<Candidate | null> {
  const res = await fetch("/api/recognize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ museumId, imageBase64, mediaType }),
  });
  if (!res.ok) return null;
  const { artwork } = await res.json();
  return artwork ?? null;
}

export type CollectResult =
  | { ok: true; alreadyHad: boolean }
  | { ok: false; gated: boolean; error: string };

export async function collect(payload: {
  artworkId: string;
  museumId: string;
  lat?: number;
  lon?: number;
  note?: string;
  selfieUrl?: string;
}): Promise<CollectResult> {
  const res = await fetch("/api/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.collected) return { ok: true, alreadyHad: !!data.alreadyHad };
  return { ok: false, gated: res.status === 403, error: data.error ?? "collect failed" };
}

export async function fetchCollection(): Promise<CollectionItem[]> {
  const res = await fetch("/api/collection");
  if (!res.ok) return [];
  const { items } = await res.json();
  return items ?? [];
}

export async function search(q: string): Promise<Candidate[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const { results } = await res.json();
  return results ?? [];
}
