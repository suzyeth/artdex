export type Rarity = "common" | "rare" | "epic" | "legendary";

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];

export function fxIntensity(r: Rarity): number {
  return RARITY_ORDER.indexOf(r) + 1;
}

export function isOnSiteRequired(r: Rarity): boolean {
  return r === "legendary";
}
