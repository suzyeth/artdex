import { describe, it, expect } from "vitest";
import { haversineMeters, isWithinGate, GATE_RADIUS_M } from "@/lib/domain/locationGate";

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
