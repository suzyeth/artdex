// MOCK: localStorage-backed collection so the capture -> dex loop works
// before the database exists. Replaced by /api/collect + /api/collection in Phase 5/7.
const KEY = "artdex-mock-collection";

// starter set so the dex looks alive on first open
export const STARTER_COLLECTED = [
  "starry-night",
  "sunflowers",
  "almond-blossom",
  "mona-lisa",
  "the-magpie",
  "girl-pearl-earring",
  "great-wave",
  "primavera",
];

export function getCollected(): Set<string> {
  if (typeof window === "undefined") return new Set(STARTER_COLLECTED);
  try {
    const stored: string[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return new Set([...STARTER_COLLECTED, ...stored]);
  } catch {
    return new Set(STARTER_COLLECTED);
  }
}

export function addCollected(artworkId: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored: string[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    if (!stored.includes(artworkId)) {
      window.localStorage.setItem(KEY, JSON.stringify([...stored, artworkId]));
    }
  } catch {
    window.localStorage.setItem(KEY, JSON.stringify([artworkId]));
  }
}
