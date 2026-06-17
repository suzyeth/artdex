import { describe, it, expect } from "vitest";
import { stampDateLong, stampTime, stampYear, museumShort } from "./stamp-format";

describe("stampDateLong", () => {
  it("formats an ISO timestamp as 'D MON YYYY' in UTC", () => {
    expect(stampDateLong("2026-06-15T10:00:00.000Z")).toBe("15 JUN 2026");
  });
  it("returns '' for an invalid date", () => {
    expect(stampDateLong("not-a-date")).toBe("");
  });
});

describe("stampTime", () => {
  it("formats an ISO timestamp as 'HH:MM' in UTC", () => {
    expect(stampTime("2026-06-15T14:32:00.000Z")).toBe("14:32");
  });
  it("zero-pads hours and minutes", () => {
    expect(stampTime("2026-01-02T03:05:00.000Z")).toBe("03:05");
  });
  it("returns '' for an invalid date", () => {
    expect(stampTime("not-a-date")).toBe("");
  });
});

describe("stampYear", () => {
  it("returns a two-digit apostrophe year", () => {
    expect(stampYear("2026-06-15T10:00:00.000Z")).toBe("'26");
  });
});

describe("museumShort", () => {
  it("drops a leading article and uppercases the first significant word", () => {
    expect(museumShort("The Louvre")).toBe("LOUVRE");
    expect(museumShort("National Gallery")).toBe("NATIONAL");
  });
  it("caps length at 10 characters", () => {
    expect(museumShort("Rijksmuseum Amsterdam")).toBe("RIJKSMUSEU");
  });
});
