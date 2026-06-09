import { describe, it, expect } from "vitest";
import { readEnv } from "@/lib/env";

describe("readEnv", () => {
  it("throws a clear error when a required key is missing", () => {
    expect(() => readEnv({}, ["RDS_CLUSTER_ARN"])).toThrow(/RDS_CLUSTER_ARN/);
  });

  it("returns the values when all present", () => {
    expect(readEnv({ A: "x" }, ["A"])).toEqual({ A: "x" });
  });
});
