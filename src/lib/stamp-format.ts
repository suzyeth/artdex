// Pure string helpers for the keepsake stamp. UTC-based so output is deterministic
// regardless of the device timezone (capturedAt is always an ISO UTC timestamp).
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function stampDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function stampYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `'${String(d.getUTCFullYear()).slice(-2)}`;
}

/** A short uppercase tag for a museum name: drop a leading article, take the first
 *  significant word, cap at 10 chars. e.g. "The Louvre" -> "LOUVRE". */
export function museumShort(name: string): string {
  const cleaned = name.replace(/^(the|le|la|el)\s+/i, "");
  const first = cleaned.split(/\s+/).filter(Boolean)[0] ?? name;
  return first.slice(0, 10).toUpperCase();
}
