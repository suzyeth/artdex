// DynamoDB access layer for ArtDex. Catalog tables are tiny (<= 46 items) so
// full Scans are cheap; user collections are queried by partition key (user_id).
import {
  ScanCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "@/lib/aws/dynamo";
import { filterCurrentExhibits } from "@/lib/domain/candidates";
import type { Rarity } from "@/lib/domain/rarity";
import type { Moment } from "@/lib/domain/moments";

export type ArtistRow = { id: string; name: string; era?: string; movement?: string };
export type MuseumRow = {
  id: string; name: string; city: string; country: string; lon: number; lat: number;
};
export type ArtworkRow = {
  id: string; artist_id: string; title: string; year: string;
  rarity: Rarity; is_signature: boolean; image_url: string;
};
export type CollectionRow = {
  user_id: string; artwork_id: string; collected_at: string;
  museum_id?: string; exhibition_label?: string;
  selfie_url?: string; photo_url?: string; note?: string;
  moments?: Moment[];   // append-only list; earliest = 初遇
};

export type Candidate = {
  id: string; title: string; year: string;
  artistName: string; rarity: Rarity; imageUrl: string;
};

// The catalog (artists/museums/artworks) is small and effectively immutable at
// runtime, so cache Scans in module memory — DynamoDB only serves the user
// write path (collections) per request.
const CATALOG_TTL_MS = 60_000;
const catalogCache = new Map<string, { at: number; rows: unknown[] }>();

async function cachedScan<T>(table: string): Promise<T[]> {
  const hit = catalogCache.get(table);
  if (hit && Date.now() - hit.at < CATALOG_TTL_MS) return hit.rows as T[];
  const r = await ddb().send(new ScanCommand({ TableName: table }));
  const rows = (r.Items ?? []) as T[];
  catalogCache.set(table, { at: Date.now(), rows });
  return rows;
}

export async function getAllArtists(): Promise<ArtistRow[]> {
  return cachedScan<ArtistRow>(TABLES.artists);
}

export async function getAllMuseums(): Promise<MuseumRow[]> {
  return cachedScan<MuseumRow>(TABLES.museums);
}

export async function getAllArtworks(): Promise<ArtworkRow[]> {
  return cachedScan<ArtworkRow>(TABLES.artworks);
}

export async function getArtwork(id: string): Promise<ArtworkRow | null> {
  const r = await ddb().send(new GetCommand({ TableName: TABLES.artworks, Key: { id } }));
  return (r.Item as ArtworkRow) ?? null;
}

export async function getMuseum(id: string): Promise<MuseumRow | null> {
  const r = await ddb().send(new GetCommand({ TableName: TABLES.museums, Key: { id } }));
  return (r.Item as MuseumRow) ?? null;
}

/** Works currently on display at a museum (exhibition window covers `today`). */
export async function currentCandidates(museumId: string, today: string): Promise<Candidate[]> {
  const ex = await ddb().send(
    new QueryCommand({
      TableName: TABLES.exhibitions,
      KeyConditionExpression: "museum_id = :m",
      ExpressionAttributeValues: { ":m": museumId },
    })
  );
  const rows = (ex.Items ?? []).map((e) => ({
    artworkId: e.artwork_id as string,
    start: e.start_date as string,
    end: e.end_date as string,
  }));
  const ids = new Set(filterCurrentExhibits(rows, today));
  if (ids.size === 0) return [];
  const [artworks, artists] = await Promise.all([getAllArtworks(), getAllArtists()]);
  const nameById = new Map(artists.map((a) => [a.id, a.name]));
  return artworks
    .filter((w) => ids.has(w.id))
    .map((w) => ({
      id: w.id,
      title: w.title,
      year: w.year,
      artistName: nameById.get(w.artist_id) ?? "",
      rarity: w.rarity,
      imageUrl: w.image_url,
    }));
}

export async function getCollection(userId: string): Promise<CollectionRow[]> {
  const r = await ddb().send(
    new QueryCommand({
      TableName: TABLES.collections,
      KeyConditionExpression: "user_id = :u",
      ExpressionAttributeValues: { ":u": userId },
    })
  );
  return (r.Items ?? []) as CollectionRow[];
}

/**
 * Append one moment to a (user, artwork) record, creating the item on first capture.
 * Atomic via list_append — concurrent captures both land. Returns { isFirst }:
 * isFirst is true when this capture is the artwork's 初遇 (the list now has one entry).
 */
export async function appendMoment(
  userId: string,
  artworkId: string,
  moment: Moment,
): Promise<{ isFirst: boolean }> {
  const res = await ddb().send(
    new UpdateCommand({
      TableName: TABLES.collections,
      Key: { user_id: userId, artwork_id: artworkId },
      UpdateExpression:
        "SET moments = list_append(if_not_exists(moments, :empty), :one), " +
        "collected_at = if_not_exists(collected_at, :ts), " +
        "museum_id = if_not_exists(museum_id, :mid)",
      ExpressionAttributeValues: {
        ":empty": [] as Moment[],
        ":one": [moment],
        ":ts": moment.capturedAt,
        ":mid": moment.museumId,
      },
      ReturnValues: "ALL_NEW",
    }),
  );
  const moments = (res.Attributes?.moments as Moment[]) ?? [];
  return { isFirst: moments.length <= 1 };
}
