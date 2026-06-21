import { describe, expect, it } from "vitest";

describe("Carbon Emissions", () => {
  it("calculates car emissions", () => {
    const distance = 100;
    const emissionFactor = 0.21;

    const emission = distance * emissionFactor;

    expect(emission).toBe(21);
  });

  it("calculates electricity emissions", () => {
    const units = 50;

    const emission = units * 0.4;

    expect(emission).toBe(20);
  });
});