import { describe, it, expect } from "vitest";
import { artists, museums, artworks, exhibitions } from "@/lib/db/seedData";

describe("seed data integrity", () => {
  const artistIds = new Set(artists.map((a) => a.id));
  const museumIds = new Set(museums.map((m) => m.id));
  const artworkIds = new Set(artworks.map((w) => w.id));

  it("has no duplicate ids", () => {
    expect(artistIds.size).toBe(artists.length);
    expect(museumIds.size).toBe(museums.length);
    expect(artworkIds.size).toBe(artworks.length);
    expect(new Set(exhibitions.map((e) => e.id)).size).toBe(exhibitions.length);
  });

  it("every artwork references an existing artist", () => {
    for (const w of artworks) expect(artistIds.has(w.artistId), w.id).toBe(true);
  });

  it("every exhibition references an existing artwork and museum", () => {
    for (const e of exhibitions) {
      expect(artworkIds.has(e.artworkId), e.id).toBe(true);
      expect(museumIds.has(e.museumId), e.id).toBe(true);
    }
  });

  it("every artwork is on display somewhere today (demo invariant)", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const w of artworks) {
      const current = exhibitions.filter(
        (e) => e.artworkId === w.id && e.start <= today && today <= e.end
      );
      expect(current.length, `${w.id} has no current exhibition`).toBe(1);
    }
  });

  it("museum coordinates are valid lat/lon", () => {
    for (const m of museums) {
      expect(Math.abs(m.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(m.lon)).toBeLessThanOrEqual(180);
    }
  });

  it("has all four rarity tiers represented and multiple legendaries", () => {
    const byRarity = new Map<string, number>();
    for (const w of artworks) byRarity.set(w.rarity, (byRarity.get(w.rarity) ?? 0) + 1);
    expect([...byRarity.keys()].sort()).toEqual(["common", "epic", "legendary", "rare"]);
    expect(byRarity.get("legendary")!).toBeGreaterThanOrEqual(5);
  });
});
