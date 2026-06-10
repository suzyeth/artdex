import { describe, it, expect } from "vitest";
import { filterCurrentExhibits } from "@/lib/domain/candidates";

describe("filterCurrentExhibits", () => {
  it("keeps only exhibits whose date range covers today", () => {
    const rows = [
      { artworkId: "a", start: "2020-01-01", end: "2030-01-01" },
      { artworkId: "b", start: "2000-01-01", end: "2001-01-01" },
    ];
    expect(filterCurrentExhibits(rows, "2026-06-09")).toEqual(["a"]);
  });

  it("includes boundary dates (first and last day of the exhibition)", () => {
    const rows = [{ artworkId: "a", start: "2026-06-01", end: "2026-06-30" }];
    expect(filterCurrentExhibits(rows, "2026-06-01")).toEqual(["a"]);
    expect(filterCurrentExhibits(rows, "2026-06-30")).toEqual(["a"]);
    expect(filterCurrentExhibits(rows, "2026-07-01")).toEqual([]);
  });

  it("returns empty for no exhibits", () => {
    expect(filterCurrentExhibits([], "2026-06-09")).toEqual([]);
  });
});
