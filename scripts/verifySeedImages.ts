// Verifies every artwork image URL in seedData resolves (HTTP 200 after redirects).
// Run: npx tsx scripts/verifySeedImages.ts
import { artworks } from "../src/lib/db/seedData";

const UA = "ArtDex-seed-verifier/1.0 (hackathon project)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function head(url: string): Promise<number> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA },
    });
    if (res.status !== 429) return res.status;
    await sleep(3000 * (attempt + 1)); // back off on rate limiting
  }
  return 429;
}

async function main() {
  let failures = 0;
  for (const w of artworks) {
    try {
      const status = await head(w.imageUrl);
      if (status >= 200 && status < 300) {
        console.log(`ok   ${w.id}`);
      } else {
        failures++;
        console.log(`FAIL ${w.id} -> HTTP ${status}`);
      }
    } catch (e) {
      failures++;
      console.log(`FAIL ${w.id} -> ${(e as Error).message}`);
    }
    await sleep(800); // stay under Wikimedia rate limits
  }
  console.log(failures === 0 ? `\nall ${artworks.length} image urls ok` : `\n${failures} failures`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
