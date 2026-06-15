import { describe, it, expect } from "vitest";
import { sortMoments, firstMoment, kindOf, type Moment } from "./moments";

const m = (capturedAt: string): Moment => ({ capturedAt, museumId: "louvre" });

describe("sortMoments", () => {
  it("orders oldest-first", () => {
    const out = sortMoments([m("2024-01-01"), m("2019-01-01"), m("2021-01-01")]);
    expect(out.map((x) => x.capturedAt)).toEqual(["2019-01-01", "2021-01-01", "2024-01-01"]);
  });
  it("does not mutate the input", () => {
    const input = [m("2024-01-01"), m("2019-01-01")];
    sortMoments(input);
    expect(input[0].capturedAt).toBe("2024-01-01");
  });
});

describe("firstMoment", () => {
  it("returns the earliest moment (初遇)", () => {
    expect(firstMoment([m("2024-01-01"), m("2019-01-01")])?.capturedAt).toBe("2019-01-01");
  });
  it("returns undefined when there are none", () => {
    expect(firstMoment([])).toBeUndefined();
  });
});

describe("kindOf", () => {
  it("marks the earliest capture as first (初遇)", () => {
    const ms = [m("2024-01-01"), m("2019-01-01")];
    expect(kindOf(ms, ms[1])).toBe("first");
  });
  it("marks later captures as reunion (重逢)", () => {
    const ms = [m("2024-01-01"), m("2019-01-01")];
    expect(kindOf(ms, ms[0])).toBe("reunion");
  });
});

describe("kindOf with identical timestamps", () => {
  it("marks only the first of two same-timestamp captures as first", () => {
    const a = m("2024-01-01");
    const b = m("2024-01-01");
    const ms = [a, b];
    expect(kindOf(ms, a)).toBe("first");
    expect(kindOf(ms, b)).toBe("reunion");
  });
});
