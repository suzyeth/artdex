import { describe, it, expect } from "vitest";
import { artistProgress } from "@/lib/domain/progress";

describe("artistProgress", () => {
  const artworks = [
    { id: "starry-night", artist_id: "vangogh" },
    { id: "sunflowers", artist_id: "vangogh" },
    { id: "irises", artist_id: "vangogh" },
    { id: "mona-lisa", artist_id: "davinci" },
  ];

  it("counts collected vs total per artist", () => {
    const collected = new Set(["starry-night", "sunflowers"]);
    expect(artistProgress(collected, artworks)).toEqual({
      vangogh: { collected: 2, total: 3 },
      davinci: { collected: 0, total: 1 },
    });
  });

  it("handles an empty collection", () => {
    expect(artistProgress(new Set(), artworks)).toEqual({
      vangogh: { collected: 0, total: 3 },
      davinci: { collected: 0, total: 1 },
    });
  });

  it("ignores collected ids not in the artwork list", () => {
    const collected = new Set(["not-a-real-artwork"]);
    expect(artistProgress(collected, artworks).vangogh.collected).toBe(0);
  });
});
