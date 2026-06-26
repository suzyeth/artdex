export const GATE_RADIUS_M = 150; // must be within 150m of the museum

export function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function isWithinGate(_unused: number, distanceM: number): boolean {
  return distanceM <= GATE_RADIUS_M;
}

/**
 * Nearest museum to a point, by haversine. Generic over any object carrying
 * lat/lon, so it works on both the DynamoDB MuseumRow and the seed shape.
 * Returns the matched museum plus its distance in meters, or null for an empty list.
 */
export function nearestMuseum<M extends { lat: number; lon: number }>(
  lat: number,
  lon: number,
  museums: M[],
): { museum: M; distanceM: number } | null {
  let best: M | null = null;
  let bestD = Infinity;
  for (const m of museums) {
    const d = haversineMeters(lat, lon, m.lat, m.lon);
    if (d < bestD) {
      bestD = d;
      best = m;
    }
  }
  return best ? { museum: best, distanceM: bestD } : null;
}
