import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getAllArtworks } from "@/lib/db/queries";
import { ddb, TABLES } from "@/lib/aws/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const dynamic = "force-dynamic";

// Rarity-weighted score rewards rare finds over raw count.
const WEIGHT: Record<string, number> = { common: 1, rare: 3, epic: 6, legendary: 12 };

const ADJ = ["Quiet", "Keen", "Gilded", "Roaming", "Patient", "Bright", "Velvet", "Amber"];
const NOUN = ["Curator", "Collector", "Patron", "Aesthete", "Pilgrim", "Magpie", "Connoisseur", "Scout"];
function handleFor(uid: string): string {
  let h = 0;
  for (const c of uid) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `${ADJ[h % ADJ.length]} ${NOUN[(h >> 3) % NOUN.length]}`;
}

export async function GET() {
  const me = await getUserId();
  const [artworks, scan] = await Promise.all([
    getAllArtworks(),
    ddb().send(
      new ScanCommand({ TableName: TABLES.collections, ProjectionExpression: "user_id, artwork_id" })
    ),
  ]);
  const rarityById = new Map(artworks.map((a) => [a.id, a.rarity]));

  const agg = new Map<string, { count: number; score: number }>();
  for (const it of scan.Items ?? []) {
    const uid = it.user_id as string;
    const r = (rarityById.get(it.artwork_id as string) as string) ?? "common";
    const cur = agg.get(uid) ?? { count: 0, score: 0 };
    cur.count++;
    cur.score += WEIGHT[r] ?? 1;
    agg.set(uid, cur);
  }

  const ranked = [...agg.entries()]
    .map(([uid, v]) => ({ uid, ...v }))
    .sort((a, b) => b.score - a.score || b.count - a.count);

  const myIdx = ranked.findIndex((r) => r.uid === me);
  const top = ranked.slice(0, 20).map((r, i) => ({
    rank: i + 1,
    handle: r.uid === me ? "You" : handleFor(r.uid),
    count: r.count,
    score: r.score,
    isMe: r.uid === me,
  }));

  return NextResponse.json({
    top,
    me: {
      rank: myIdx >= 0 ? myIdx + 1 : null,
      count: myIdx >= 0 ? ranked[myIdx].count : 0,
      score: myIdx >= 0 ? ranked[myIdx].score : 0,
    },
    totalCollectors: ranked.length,
  });
}
