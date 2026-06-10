export function artistProgress(
  collected: Set<string>,
  artworks: { id: string; artist_id: string }[]
): Record<string, { collected: number; total: number }> {
  const out: Record<string, { collected: number; total: number }> = {};
  for (const w of artworks) {
    out[w.artist_id] ??= { collected: 0, total: 0 };
    out[w.artist_id].total++;
    if (collected.has(w.id)) out[w.artist_id].collected++;
  }
  return out;
}
