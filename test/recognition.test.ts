import { describe, it, expect } from "vitest";
import {
  buildRecognitionPrompt,
  parseRecognition,
  isReproduction,
} from "@/lib/domain/recognition";

describe("buildRecognitionPrompt", () => {
  it("lists every candidate with id, title, and artist", () => {
    const prompt = buildRecognitionPrompt([
      { id: "starry-night", title: "The Starry Night", artist: "Vincent van Gogh" },
      { id: "mona-lisa", title: "Mona Lisa", artist: "Leonardo da Vinci" },
    ]);
    expect(prompt).toContain('starry-night: "The Starry Night" by Vincent van Gogh');
    expect(prompt).toContain('mona-lisa: "Mona Lisa" by Leonardo da Vinci');
    expect(prompt).toMatch(/"none"/);
  });

  it("asks the model to flag reproductions vs live photos", () => {
    const prompt = buildRecognitionPrompt([
      { id: "starry-night", title: "The Starry Night", artist: "Vincent van Gogh" },
    ]);
    expect(prompt).toMatch(/\|live/);
    expect(prompt).toMatch(/\|repro/);
  });
});

describe("isReproduction", () => {
  it("flags repro responses", () => {
    expect(isReproduction("starry-night|repro")).toBe(true);
    expect(isReproduction("The match is: mona-lisa | repro.")).toBe(true);
  });

  it("treats live responses (and anything else) as not reproduction", () => {
    expect(isReproduction("starry-night|live")).toBe(false);
    expect(isReproduction("starry-night")).toBe(false);
    expect(isReproduction("none")).toBe(false);
  });

  it("never confuses the word inside an id with the repro flag", () => {
    expect(isReproduction("repro-portrait|live")).toBe(false);
  });
});

describe("parseRecognition", () => {
  const validIds = ["starry-night", "mona-lisa"];

  it("extracts a valid id from the response", () => {
    expect(parseRecognition("starry-night", validIds)).toBe("starry-night");
  });

  it("tolerates surrounding text and casing", () => {
    expect(parseRecognition("The answer is: Starry-Night.", validIds)).toBe("starry-night");
  });

  it("returns null for 'none'", () => {
    expect(parseRecognition("none", validIds)).toBeNull();
  });

  it("returns null for an id not in the candidate set", () => {
    expect(parseRecognition("water-lilies", validIds)).toBeNull();
  });

  it("never resolves an id that is a substring of the actual answer", () => {
    const ids = ["starry-night", "starry-night-rhone", "medusa", "raft-medusa"];
    expect(parseRecognition("starry-night-rhone", ids)).toBe("starry-night-rhone");
    expect(parseRecognition("The match is raft-medusa.", ids)).toBe("raft-medusa");
    expect(parseRecognition("starry-night", ids)).toBe("starry-night");
  });
});
