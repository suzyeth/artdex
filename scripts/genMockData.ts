// Generate src/lib/data.ts (the v0 frontend catalog shape) from our backend
// seedData so artwork/museum/artist IDs match DynamoDB exactly. Run: npx tsx scripts/genMockData.ts
import { writeFileSync } from "node:fs";
import { artists, museums, artworks, exhibitions } from "../src/lib/db/seedData";

const NATIONALITY: Record<string, string> = {
  vangogh: "Dutch", davinci: "Italian", monet: "French", vermeer: "Dutch",
  rembrandt: "Dutch", hokusai: "Japanese", botticelli: "Italian", degas: "French",
  renoir: "French", cezanne: "French", caravaggio: "Italian", velazquez: "Spanish",
  goya: "Spanish", turner: "British", manet: "French", rousseau: "French",
  delacroix: "French", gericault: "French",
  vaneyck: "Flemish", holbein: "German", constable: "British", millais: "British",
};

const today = "2026-06-13";
const artistName = new Map(artists.map((a) => [a.id, a.name]));

// current museum for each artwork (exhibition window covering today; else any)
const museumOf = new Map<string, string>();
for (const e of exhibitions) {
  if (e.start <= today && today <= e.end && !museumOf.has(e.artworkId)) {
    museumOf.set(e.artworkId, e.museumId);
  }
}
for (const e of exhibitions) if (!museumOf.has(e.artworkId)) museumOf.set(e.artworkId, e.museumId);

const museumsObj = Object.fromEntries(
  museums.map((m) => [
    m.id,
    {
      id: m.id, name: m.name, city: m.city, country: m.country,
      lon: m.lon, lat: m.lat,
      // percentage coords on an equirectangular world map
      x: +(((m.lon + 180) / 360) * 100).toFixed(2),
      y: +(((90 - m.lat) / 180) * 100).toFixed(2),
    },
  ])
);

const artistsArr = artists.map((a) => ({
  id: a.id, name: a.name, nationality: NATIONALITY[a.id] ?? a.movement ?? "",
}));

const artworksArr = artworks.map((w) => ({
  id: w.id, title: w.title, artist: artistName.get(w.artistId) ?? "", artistId: w.artistId,
  year: w.year, rarity: w.rarity, image: w.imageUrl, museumId: museumOf.get(w.id) ?? "",
  medium: "Oil on canvas", blurb: "",
}));

const out = `// AUTO-GENERATED from src/lib/db/seedData.ts by scripts/genMockData.ts — do not edit by hand.
// IDs match the DynamoDB catalog so real collection + recognition line up.
export type Rarity = "common" | "rare" | "epic" | "legendary"

export interface Museum { id: string; name: string; city: string; country: string; lon: number; lat: number; x: number; y: number }
export interface Artwork { id: string; title: string; artist: string; artistId: string; year: string; rarity: Rarity; image: string; museumId: string; medium: string; blurb: string }
export interface Artist { id: string; name: string; nationality: string }

export const MUSEUMS: Record<string, Museum> = ${JSON.stringify(museumsObj, null, 2)}

export const ARTISTS: Artist[] = ${JSON.stringify(artistsArr, null, 2)}

export const ARTWORKS: Artwork[] = ${JSON.stringify(artworksArr, null, 2)}

export const RARITY_META: Record<Rarity, { label: string; order: number }> = {
  common: { label: "Common", order: 0 },
  rare: { label: "Rare", order: 1 },
  epic: { label: "Epic", order: 2 },
  legendary: { label: "Legendary", order: 3 },
}

export function getArtwork(id: string): Artwork | undefined {
  return ARTWORKS.find((a) => a.id === id)
}
export function getMuseum(id: string): Museum | undefined {
  return MUSEUMS[id]
}
export function getArtist(id: string): Artist | undefined {
  return ARTISTS.find((a) => a.id === id)
}
`;

writeFileSync("src/lib/data.ts", out);
console.log(`wrote src/lib/data.ts — ${artworksArr.length} works, ${museums.length} museums, ${artistsArr.length} artists`);
