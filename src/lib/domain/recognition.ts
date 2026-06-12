export function buildRecognitionPrompt(
  c: { id: string; title: string; artist: string }[]
): string {
  const list = c.map((x) => `- ${x.id}: "${x.title}" by ${x.artist}`).join("\n");
  return (
    `You are identifying an artwork from a photo. It is one of these works currently on display:\n${list}\n` +
    `Also judge the photo itself: "live" means a photo of the physical artwork in front of the camera ` +
    `(museum wall, frame, glare, perspective); "repro" means the photo shows a reproduction — a screen, ` +
    `postcard, poster, book page, or a flat digital copy.\n` +
    `Reply with ONLY one line: the matching id, a pipe, then live or repro (e.g. "starry-night|live" ` +
    `or "starry-night|repro"), or "none" if no candidate matches.`
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

/** True when the model judged the photo to show a reproduction (screen,
 *  postcard, print) rather than the physical artwork. Token-based so an id
 *  containing the substring "repro" can never trip it. */
export function isReproduction(text: string): boolean {
  const tokens = text.trim().toLowerCase().split(/[^a-z0-9-]+/);
  return tokens.includes("repro");
}
