// DynamoDB access layer for ArtDex. Catalog tables are tiny (<= 46 items) so
// full Scans are cheap; user collections are queried by partition key (user_id).
import {
  ScanCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "@/lib/aws/dynamo";
import { filterCurrentExhibits } from "@/lib/domain/candidates";
import type { Rarity } from "@/lib/domain/rarity";

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
};

export type Candidate = {
  id: string; title: string; year: string;
  artistName: string; rarity: Rarity; imageUrl: string;
};

export async function getAllArtists(): Promise<ArtistRow[]> {
  const r = await ddb().send(new ScanCommand({ TableName: TABLES.artists }));
  return (r.Items ?? []) as ArtistRow[];
}

export async function getAllMuseums(): Promise<MuseumRow[]> {
  const r = await ddb().send(new ScanCommand({ TableName: TABLES.museums }));
  return (r.Items ?? []) as MuseumRow[];
}

export async function getAllArtworks(): Promise<ArtworkRow[]> {
  const r = await ddb().send(new ScanCommand({ TableName: TABLES.artworks }));
  return (r.Items ?? []) as ArtworkRow[];
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

/** Insert a collection record; returns false if the user already had this artwork. */
export async function addCollection(row: CollectionRow): Promise<boolean> {
  try {
    await ddb().send(
      new PutCommand({
        TableName: TABLES.collections,
        Item: row,
        ConditionExpression: "attribute_not_exists(user_id)",
      })
    );
    return true;
  } catch (err: unknown) {
    if (err && typeof err === "object" && (err as { name?: string }).name === "ConditionalCheckFailedException") {
      return false;
    }
    throw err;
  }
}
