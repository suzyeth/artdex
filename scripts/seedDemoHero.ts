// Seed a polished "hero" demo account (`demo-hero`) for the demo video / local run.
// It clones demo-ada's geographically-spread collection (7 cities → rich world map)
// and gives every work a clean keepsake: a single moment whose photo is that work's
// own public-domain catalog image (served from /public, pass-through — no real faces,
// no screen photos, no licensing risk). Starry Night gets a two-moment timeline (the
// 重逢/reunion story) using two distinct, clean Starry Night images.
// Run: npx tsx -r dotenv/config scripts/seedDemoHero.ts dotenv_config_path=.env.local
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLES } from "../src/lib/aws/dynamo";
import { getCollection } from "../src/lib/db/queries";
import { artworks, museums, exhibitions } from "../src/lib/db/seedData";

const HERO = "demo-hero";
const SOURCE = "demo-ada"; // 23 works across 7 cities → instant multi-pin map
const TODAY = "2026-06-28";

// Three distinct, clean Starry Night images — one per stop on its real exhibition
// journey (London → Paris → New York), so the memory timeline shows the SAME painting
// in three different cities, matching the `exhibitions` travel rows in the database.
const STARRY_LOCAL = "/artworks/van-gogh-starry-night-google-art-project.jpg"; // full painting
const STARRY_S3 = "selfies/demo-hero/starry-night-visit2.jpeg"; // different rendering (S3)
const STARRY_VISIT3 = "/artworks/starry-night-visit3.jpg"; // swirl + moon detail crop

// Resolve each artwork's current museum (exhibition window covering today; else any).
const museumOf = new Map<string, string>();
for (const e of exhibitions) {
  if (e.start <= TODAY && TODAY <= e.end && !museumOf.has(e.artworkId)) museumOf.set(e.artworkId, e.museumId);
}
for (const e of exhibitions) if (!museumOf.has(e.artworkId)) museumOf.set(e.artworkId, e.museumId);

const imageOf = new Map(artworks.map((a) => [a.id, a.imageUrl]));
const museumName = new Map(museums.map((m) => [m.id, m.name]));

function row(artworkId: string, collectedAt: string) {
  const museumId = museumOf.get(artworkId) ?? "";
  const label = museumName.get(museumId) ?? "";
  return {
    user_id: HERO,
    artwork_id: artworkId,
    collected_at: collectedAt,
    museum_id: museumId,
    exhibition_label: label,
    moments: [
      {
        capturedAt: collectedAt,
        museumId,
        exhibitionLabel: label,
        photo: imageOf.get(artworkId) ?? "",
        stampStyle: "postmark",
      },
    ],
  };
}

// Starry Night travels (see the `exhibitions` rows: Tate → Orsay → MoMA). The collector
// follows it city to city — each moment's date falls inside that stop's exhibition window,
// so the keepsake timeline and the database tell the same story: one painting, three cities.
const starryNight = {
  user_id: HERO,
  artwork_id: "starry-night",
  collected_at: "2023-06-15T14:20:00.000Z", // first met it on loan in London
  museum_id: "tate-britain",
  exhibition_label: "Tate Britain, London",
  moments: [
    {
      capturedAt: "2023-06-15T14:20:00.000Z",
      museumId: "tate-britain",
      exhibitionLabel: "Tate Britain, London",
      photo: STARRY_LOCAL,
      stampStyle: "postmark",
      note: "On loan in London — didn't expect to meet it here.",
    },
    {
      capturedAt: "2024-10-08T11:05:00.000Z",
      museumId: "orsay",
      exhibitionLabel: "Musée d'Orsay, Paris",
      photo: STARRY_S3,
      stampStyle: "postmark",
      note: "Followed it across the Channel to Paris.",
    },
    {
      capturedAt: "2026-04-22T16:40:00.000Z",
      museumId: "moma",
      exhibitionLabel: "Museum of Modern Art, New York",
      photo: STARRY_VISIT3,
      stampStyle: "postmark",
      note: "Home in New York at last — right where it lives.",
    },
  ],
};

// Sunflowers: a three-visit timeline at its London home — a piece the collector keeps
// coming back to. Three distinct clean images (full painting + two detail crops).
const SUN_FULL = "/artworks/vincent-willem-van-gogh-127.jpg";
const SUN_2 = "/artworks/sunflowers-visit2.jpg";
const SUN_3 = "/artworks/sunflowers-visit3.jpg";
const sunflowers = {
  user_id: HERO,
  artwork_id: "sunflowers",
  collected_at: "2024-11-03T15:12:00.000Z",
  museum_id: "nationalgallery",
  exhibition_label: "The National Gallery, London",
  moments: [
    {
      capturedAt: "2024-11-03T15:12:00.000Z",
      museumId: "nationalgallery",
      exhibitionLabel: "The National Gallery, London",
      photo: SUN_FULL,
      stampStyle: "postmark",
      note: "Ducked in out of the rain — almost had the room to myself.",
    },
    {
      capturedAt: "2025-07-19T11:40:00.000Z",
      museumId: "nationalgallery",
      exhibitionLabel: "The National Gallery, London",
      photo: SUN_2,
      stampStyle: "postmark",
      note: "Brought a friend this time; we argued about which flower is best.",
    },
    {
      capturedAt: "2026-05-30T16:05:00.000Z",
      museumId: "nationalgallery",
      exhibitionLabel: "The National Gallery, London",
      photo: SUN_3,
      stampStyle: "postmark",
      note: "Third visit — it feels like saying hi to an old friend now.",
    },
  ],
};

// The Bedroom (Van Gogh) travels Courtauld → Van Gogh Museum → MoMA — three encounters,
// dates inside each stop's exhibition window, one clean image (full + two crops) per city.
const BED_FULL = "/artworks/vincent-van-gogh-de-slaapkamer-google-art-project.jpg";
const bedroom = {
  user_id: HERO,
  artwork_id: "bedroom-arles",
  collected_at: "2022-04-10T13:30:00.000Z",
  museum_id: "courtauld",
  exhibition_label: "The Courtauld Gallery, London",
  moments: [
    { capturedAt: "2022-04-10T13:30:00.000Z", museumId: "courtauld", exhibitionLabel: "The Courtauld Gallery, London", photo: BED_FULL, stampStyle: "postmark", note: "Found it tucked in a London side gallery." },
    { capturedAt: "2024-06-22T10:15:00.000Z", museumId: "vangoghmuseum", exhibitionLabel: "Van Gogh Museum, Amsterdam", photo: "/artworks/bedroom-arles-visit2.jpg", stampStyle: "postmark", note: "Met it again at home in Amsterdam." },
    { capturedAt: "2026-05-15T15:50:00.000Z", museumId: "moma", exhibitionLabel: "Museum of Modern Art, New York", photo: "/artworks/bedroom-arles-visit3.jpg", stampStyle: "postmark", note: "Now on tour in New York." },
  ],
};

// The Card Players (Cézanne) travels Tate → Orsay → Met.
const CARDS_FULL = "/artworks/les-joueurs-de-cartes-par-paul-c-zanne.jpg";
const cardPlayers = {
  user_id: HERO,
  artwork_id: "card-players",
  collected_at: "2022-03-18T11:00:00.000Z",
  museum_id: "tate-britain",
  exhibition_label: "Tate Britain, London",
  moments: [
    { capturedAt: "2022-03-18T11:00:00.000Z", museumId: "tate-britain", exhibitionLabel: "Tate Britain, London", photo: CARDS_FULL, stampStyle: "postmark", note: "London — first hand of cards." },
    { capturedAt: "2024-08-09T14:20:00.000Z", museumId: "orsay", exhibitionLabel: "Musée d'Orsay, Paris", photo: "/artworks/card-players-visit2.jpg", stampStyle: "postmark", note: "Paris suited the cardsharps." },
    { capturedAt: "2026-04-30T16:10:00.000Z", museumId: "met", exhibitionLabel: "The Metropolitan Museum of Art, New York", photo: "/artworks/card-players-visit3.jpg", stampStyle: "postmark", note: "Followed them across to New York." },
  ],
};

async function main() {
  const src = await getCollection(SOURCE);
  if (src.length === 0) throw new Error(`source user ${SOURCE} has no collection`);

  // Works with hand-built multi-city timelines (the ones the DB says actually travel).
  const multiMoment = new Set(["starry-night", "sunflowers", "bedroom-arles", "card-players"]);
  const items: Record<string, unknown>[] = [];
  for (const r of src) {
    if (multiMoment.has(r.artwork_id)) continue; // replaced by the moment-rich rows below
    items.push(row(r.artwork_id, r.collected_at));
  }
  items.push(starryNight, sunflowers, bedroom, cardPlayers);

  for (let i = 0; i < items.length; i += 25) {
    const chunk = items.slice(i, i + 25);
    await ddb().send(
      new BatchWriteCommand({
        RequestItems: { [TABLES.collections]: chunk.map((Item) => ({ PutRequest: { Item } })) },
      })
    );
  }
  console.log(`seeded ${items.length} rows for ${HERO}: every work has a clean catalog keepsake; Starry Night = 3-city journey (Tate→Orsay→MoMA), Sunflowers = 3 visits to the National Gallery`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
