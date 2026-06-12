// Seed the ArtDex catalog (artists, museums, artworks, exhibitions) into DynamoDB.
// Run: npx tsx scripts/seedDynamo.ts   (uses local ~/.aws credentials, region us-east-1)
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../src/lib/aws/dynamo";
import { artists, museums, artworks, exhibitions } from "../src/lib/db/seedData";

async function batchWrite(table: string, items: Record<string, unknown>[]) {
  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    await ddb().send(
      new BatchWriteCommand({
        RequestItems: { [table]: chunk.map((Item) => ({ PutRequest: { Item } })) },
      })
    );
  }
  console.log(`  ${table}: wrote ${items.length}`);
}

async function main() {
  await batchWrite(TABLES.artists, artists);
  await batchWrite(TABLES.museums, museums);
  await batchWrite(
    TABLES.artworks,
    artworks.map((a) => ({
      id: a.id,
      artist_id: a.artistId,
      title: a.title,
      year: a.year,
      rarity: a.rarity,
      is_signature: a.isSignature,
      image_url: a.imageUrl,
    }))
  );
  await batchWrite(
    TABLES.exhibitions,
    exhibitions.map((e) => ({
      museum_id: e.museumId,
      artwork_id: e.artworkId,
      id: e.id,
      start_date: e.start,
      end_date: e.end,
    }))
  );
  console.log("seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
