import { describe, it, expect } from "vitest";
import { haversineMeters, isWithinGate, GATE_RADIUS_M, nearestMuseum } from "@/lib/domain/locationGate";

describe("haversineMeters", () => {
  it("computes ~0 for the same point", () => {
    expect(haversineMeters(40.7614, -73.9776, 40.7614, -73.9776)).toBeLessThan(1);
  });

  it("computes a large distance for far points (MoMA -> Louvre)", () => {
    expect(haversineMeters(40.7614, -73.9776, 48.8606, 2.3364)).toBeGreaterThan(1000);
  });

  it("computes a realistic short distance (~111m per 0.001 deg latitude)", () => {
    const d = haversineMeters(40.7614, -73.9776, 40.7624, -73.9776);
    expect(d).toBeGreaterThan(100);
    expect(d).toBeLessThan(125);
  });
});

describe("isWithinGate", () => {
  it("accepts distances inside the gate radius", () => {
    expect(isWithinGate(0, GATE_RADIUS_M - 1)).toBe(true);
  });

  it("rejects distances outside the gate radius", () => {
    expect(isWithinGate(0, GATE_RADIUS_M + 1)).toBe(false);
  });

  it("accepts exactly at the boundary", () => {
    expect(isWithinGate(0, GATE_RADIUS_M)).toBe(true);
  });
});

describe("nearestMuseum", () => {
  const museums = [
    { id: "moma", lat: 40.7614, lon: -73.9776 },
    { id: "louvre", lat: 48.8606, lon: 2.3364 },
    { id: "va", lat: 51.4966, lon: -0.1719 },
  ];

  it("returns the closest museum to the given point", () => {
    const hit = nearestMuseum(40.7620, -73.9780, museums); // 紧邻 MoMA
    expect(hit?.museum.id).toBe("moma");
  });

  it("reports the distance in meters to the chosen museum", () => {
    const hit = nearestMuseum(40.7614, -73.9776, museums); // 正好在 MoMA
    expect(hit?.distanceM).toBeLessThan(1);
  });

  it("picks Louvre when the point is in Paris", () => {
    const hit = nearestMuseum(48.8600, 2.3370, museums);
    expect(hit?.museum.id).toBe("louvre");
  });

  it("returns null for an empty museum list", () => {
    expect(nearestMuseum(40.7614, -73.9776, [])).toBeNull();
  });
});
