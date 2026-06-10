// MOCK: localStorage-backed collection so the capture -> dex loop works
// before the database exists. Replaced by /api/collect + /api/collection in Phase 5/7.
// Records mirror the `collections` table shape (collected_at, museum_id, note).

export type CollectionRecord = {
  artworkId: string;
  museumId: string;
  note: string;
  collectedAt: string; // ISO date
};

const KEY = "artdex-mock-collection-v2";

// starter set so the dex/map look alive on first open; museums are each work's home
export const STARTER_RECORDS: CollectionRecord[] = [
  { artworkId: "starry-night", museumId: "moma", note: "", collectedAt: "2026-04-12" },
  { artworkId: "sunflowers", museumId: "nationalgallery", note: "", collectedAt: "2026-03-02" },
  { artworkId: "almond-blossom", museumId: "vangoghmuseum", note: "", collectedAt: "2026-02-18" },
  { artworkId: "mona-lisa", museumId: "louvre", note: "", collectedAt: "2026-01-25" },
  { artworkId: "the-magpie", museumId: "orsay", note: "", collectedAt: "2026-01-24" },
  { artworkId: "girl-pearl-earring", museumId: "mauritshuis", note: "", collectedAt: "2026-02-19" },
  { artworkId: "great-wave", museumId: "met", note: "", collectedAt: "2026-05-30" },
  { artworkId: "primavera", museumId: "uffizi", note: "", collectedAt: "2026-05-08" },
];

export const STARTER_COLLECTED = STARTER_RECORDS.map((r) => r.artworkId);

function storedRecords(): CollectionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Starter records plus everything captured on this device. */
export function getRecords(): CollectionRecord[] {
  const stored = storedRecords();
  const storedIds = new Set(stored.map((r) => r.artworkId));
  return [...STARTER_RECORDS.filter((r) => !storedIds.has(r.artworkId)), ...stored];
}

export function getCollected(): Set<string> {
  return new Set(getRecords().map((r) => r.artworkId));
}

export function addCollected(record: Omit<CollectionRecord, "collectedAt">): void {
  if (typeof window === "undefined") return;
  const stored = storedRecords();
  if (stored.some((r) => r.artworkId === record.artworkId)) return;
  const full: CollectionRecord = {
    ...record,
    collectedAt: new Date().toISOString().slice(0, 10),
  };
  window.localStorage.setItem(KEY, JSON.stringify([...stored, full]));
}
