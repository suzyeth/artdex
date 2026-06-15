import { describe, it, expect } from "vitest";
import { normalizeStampStyle } from "./stamp-preference";

describe("normalizeStampStyle", () => {
  it("keeps a valid 'ticket' value", () => {
    expect(normalizeStampStyle("ticket")).toBe("ticket");
  });
  it("keeps a valid 'postmark' value", () => {
    expect(normalizeStampStyle("postmark")).toBe("postmark");
  });
  it("defaults to 'postmark' for null/garbage", () => {
    expect(normalizeStampStyle(null)).toBe("postmark");
    expect(normalizeStampStyle("nonsense")).toBe("postmark");
  });
});
