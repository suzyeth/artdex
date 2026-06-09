export function readEnv<K extends string>(
  source: Record<string, string | undefined>,
  keys: K[]
): Record<K, string> {
  const out = {} as Record<K, string>;
  for (const k of keys) {
    const v = source[k];
    if (!v) throw new Error(`Missing required env var: ${k}`);
    out[k] = v;
  }
  return out;
}
