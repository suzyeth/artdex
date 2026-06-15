// Shared client/server types for ArtDex. Type-only — safe to import anywhere.
import type { Rarity } from "@/lib/domain/rarity";
import type { Moment } from "@/lib/domain/moments";

export type Candidate = {
  id: string;
  title: string;
  year: string;
  artistName: string;
  rarity: Rarity;
  imageUrl: string;
};

export type NearbyMuseum = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  distM: number;
};

export type CollectionItem = {
  artworkId: string;
  title: string;
  artistName: string;
  rarity: Rarity;
  imageUrl: string;
  collectedAt: string;
  museumId: string;
  museumName: string;
  city: string;
  lat: number | null;
  lon: number | null;
  note: string;
  selfieUrl: string;
  moments: Moment[];
};
