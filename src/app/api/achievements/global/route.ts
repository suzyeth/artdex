import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "@/lib/aws/dynamo";
import { computeAchievements } from "@/lib/achievements";
import type { CollectedEntry } from "@/lib/collection-store";

export const dynamic = "force-dynamic";

// Global achievement unlock rates: for each achievement, the share of collectors
// who have unlocked it. Scans the collections table, groups rows by user, and
// runs the SAME computeAchievements() the client uses so the two never diverge.
// Returns { totalUsers, pct: { [achievementId]: percent } }. The client falls
// back to static defaults when this is unavailable (no AWS / empty table).
export async function GET() {
  const byUser = new Map<string, Record<string, CollectedEntry>>();

  let ExclusiveStartKey: Record<string, unknown> | undefined = undefined;
  do {
    const r = await ddb().send(
      new ScanCommand({ TableName: TABLES.collections, ExclusiveStartKey }),
    );
    for (const it of r.Items ?? []) {
      const uid = it.user_id as string;
      const artworkId = it.artwork_id as string;
      if (!uid || !artworkId) continue;
      const m = byUser.get(uid) ?? {};
      m[artworkId] = { artworkId, collectedAt: (it.collected_at as string) ?? "" };
      byUser.set(uid, m);
    }
    ExclusiveStartKey = r.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (ExclusiveStartKey);

  const totalUsers = byUser.size;
  const counts: Record<string, number> = {};
  for (const collected of byUser.values()) {
    for (const a of computeAchievements(collected)) {
      if (a.unlocked) counts[a.id] = (counts[a.id] ?? 0) + 1;
    }
  }

  const pct: Record<string, number> = {};
  for (const [id, n] of Object.entries(counts)) {
    pct[id] = totalUsers ? +((n / totalUsers) * 100).toFixed(1) : 0;
  }

  return NextResponse.json({ totalUsers, pct });
}
