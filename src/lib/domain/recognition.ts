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
  return validIds.find((id) => t.includes(id.toLowerCase())) ?? null;
}
