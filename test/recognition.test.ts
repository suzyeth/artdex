import { describe, it, expect } from "vitest";
import { buildRecognitionPrompt, parseRecognition } from "@/lib/domain/recognition";

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
});
