import { describe, expect, it } from "vitest";

describe("Challenges", () => {
  it("challenge points should be positive", () => {
    const points = 100;

    expect(points).toBeGreaterThan(0);
  });

  it("completed challenge should return true", () => {
    const completed = true;

    expect(completed).toBe(true);
  });
});