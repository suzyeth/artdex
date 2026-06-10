"use client";

import { useEffect, useState } from "react";

export type GeoState =
  | { status: "loading" }
  | { status: "ready"; lat: number; lon: number; mocked: boolean }
  | { status: "error"; message: string };

/**
 * Returns the user's position. If NEXT_PUBLIC_MOCK_LOCATION is set
 * (e.g. "40.7614,-73.9776") it wins — this is the desk-demo override.
 */
export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({ status: "loading" });

  useEffect(() => {
    const mock = process.env.NEXT_PUBLIC_MOCK_LOCATION;
    if (mock) {
      const [lat, lon] = mock.split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        setState({ status: "ready", lat, lon, mocked: true });
        return;
      }
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "error", message: "Geolocation is not supported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "ready",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          mocked: false,
        }),
      (err) => setState({ status: "error", message: err.message }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return state;
}
