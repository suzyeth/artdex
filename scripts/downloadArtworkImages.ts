// Download every artwork image from Wikimedia Commons into public/artworks/<slug>.jpg
// so the app self-hosts them (Wikimedia is blocked in mainland China). Run ONCE while
// seedData still points at Wikimedia URLs:  npx tsx scripts/downloadArtworkImages.ts
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { artworks } from "../src/lib/db/seedData";
import { imageSlug } from "../src/lib/db/imageSlug";

const OUT = "public/artworks";
const WIDTH = 800;
const UA = "ArtDex-image-fetch/1.0 (hackathon project)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function originalFilename(url: string): string {
  const seg = url.split("/Special:FilePath/")[1] ?? "";
  return decodeURIComponent(seg.split("?")[0]);
}
function srcUrl(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${WIDTH}`;
}

async function fetchBytes(url: string): Promise<Buffer> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": UA } });
    if (res.status === 429) {
      await sleep(3000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("429 after retries");
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const seen = new Map<string, string>();
  let done = 0;
  let failed = 0;
  for (const w of artworks) {
    const filename = originalFilename(w.imageUrl);
    if (!filename) {
      console.log(`SKIP ${w.id}: not a Wikimedia URL (${w.imageUrl})`);
      continue;
    }
    const slug = imageSlug(filename);
    if (seen.has(slug) && seen.get(slug) !== w.id) {
      console.log(`COLLISION ${slug}: ${seen.get(slug)} vs ${w.id}`);
    }
    seen.set(slug, w.id);
    const dest = `${OUT}/${slug}.jpg`;
    if (existsSync(dest)) {
      done++;
      continue;
    }
    try {
      const bytes = await fetchBytes(srcUrl(filename));
      writeFileSync(dest, bytes);
      done++;
      console.log(`ok   ${w.id} -> ${slug}.jpg (${(bytes.length / 1024) | 0} KB)`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${w.id}: ${(e as Error).message}`);
    }
    await sleep(150);
  }
  console.log(`\nDownloaded/present ${done}, failed ${failed}, unique slugs ${seen.size}`);
  if (failed > 0) process.exitCode = 1;
}

main();
