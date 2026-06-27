// Deterministic local filename for an artwork image. Shared by the seed catalog
// (which now serves /artworks/<slug>.jpg) and the one-off image downloader, so the
// two always agree. Self-hosting matters because Wikimedia Commons — the original
// image host — is unreachable from mainland China.
export function imageSlug(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}
