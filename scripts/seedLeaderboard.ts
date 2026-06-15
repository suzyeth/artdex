// Seed a handful of demo collectors into DynamoDB so the leaderboard is populated
// for the demo. Real rows in artdex_collections. Run: npx tsx scripts/seedLeaderboard.ts
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../src/lib/aws/dynamo";
import { artworks } from "../src/lib/db/seedData";

const allIds = artworks.map((a) => a.id);
const legendaryIds = artworks.filter((a) => a.rarity === "legendary").map((a) => a.id);

// deterministic pseudo-random subset of `n` ids
function pick(pool: string[], n: number, seed: number): string[] {
  const copy = [...pool];
  const out: string[] = [];
  let h = seed >>> 0;
  for (let i = 0; i < n && copy.length; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    out.push(copy.splice(h % copy.length, 1)[0]);
  }
  return out;
}

const FAKES: { uid: string; n: number; legendaries: number }[] = [
  { uid: "demo-ada", n: 23, legendaries: 4 },
  { uid: "demo-bram", n: 18, legendaries: 3 },
  { uid: "demo-cleo", n: 14, legendaries: 2 },
  { uid: "demo-dirk", n: 10, legendaries: 2 },
  { uid: "demo-esme", n: 7, legendaries: 1 },
  { uid: "demo-finn", n: 4, legendaries: 1 },
  { uid: "demo-gigi", n: 2, legendaries: 0 },
];

async function main() {
  for (const f of FAKES) {
    const legs = pick(legendaryIds, f.legendaries, f.uid.length * 7);
    const rest = pick(
      allIds.filter((id) => !legs.includes(id)),
      f.n - legs.length,
      f.uid.charCodeAt(2)
    );
    const ids = [...legs, ...rest];
    for (const aid of ids) {
      await ddb().send(
        new PutCommand({
          TableName: TABLES.collections,
          Item: { user_id: f.uid, artwork_id: aid, collected_at: "2026-06-10T00:00:00Z" },
        })
      );
    }
    console.log(`${f.uid}: ${ids.length} works (${legs.length} legendary)`);
  }
  console.log("leaderboard seeded");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
