import { describe, it, expect } from "vitest";
import { RARITY_ORDER, fxIntensity, isOnSiteRequired } from "@/lib/domain/rarity";

describe("rarity", () => {
  it("orders tiers low→high", () => {
    expect(RARITY_ORDER).toEqual(["common", "rare", "epic", "legendary"]);
  });

  it("scales FX intensity by tier", () => {
    expect(fxIntensity("common")).toBeLessThan(fxIntensity("legendary"));
  });

  it("requires on-site only for legendary", () => {
    expect(isOnSiteRequired("legendary")).toBe(true);
    expect(isOnSiteRequired("epic")).toBe(false);
  });
});
