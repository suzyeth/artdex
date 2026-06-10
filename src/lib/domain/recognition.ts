export function buildRecognitionPrompt(
  c: { id: string; title: string; artist: string }[]
): string {
  const list = c.map((x) => `- ${x.id}: "${x.title}" by ${x.artist}`).join("\n");
  return (
    `You are identifying an artwork from a photo. It is one of these works currently on display:\n${list}\n` +
    `Reply with ONLY the matching id from the list, or "none" if none match.`
  );
}

export function parseRecognition(text: string, validIds: string[]): string | null {
  const t = text.trim().toLowerCase();
  // exact token match first (ids can contain hyphens, so split on anything else)
  const tokens = new Set(t.split(/[^a-z0-9-]+/));
  const exact = validIds.find((id) => tokens.has(id.toLowerCase()));
  if (exact) return exact;
  // substring fallback for free-form responses; longest id wins so
  // "starry-night-rhone" never resolves to "starry-night"
  const matches = validIds.filter((id) => t.includes(id.toLowerCase()));
  return matches.sort((a, b) => b.length - a.length)[0] ?? null;
}
