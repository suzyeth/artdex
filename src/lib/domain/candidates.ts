export function filterCurrentExhibits(
  rows: { artworkId: string; start: string; end: string }[],
  today: string
): string[] {
  return rows.filter((r) => r.start <= today && today <= r.end).map((r) => r.artworkId);
}
