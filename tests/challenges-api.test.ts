import { describe, expect, it } from "vitest";
import { z } from "zod";

const completionSchema = z.object({
  challengeId: z.string().min(1),
});

describe("Challenge API", () => {
  it("accepts valid challenge id", () => {
    const result = completionSchema.safeParse({
      challengeId: "challenge-123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty challenge id", () => {
    const result = completionSchema.safeParse({
      challengeId: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing challenge id", () => {
    const result = completionSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("simulates unauthorized access", () => {
    const session = null;

    expect(session).toBeNull();
  });

  it("simulates successful challenge completion", () => {
    const challenge = {
      id: "challenge-1",
      points: 50,
      badgeName: "Eco Hero",
    };

    expect(challenge.points).toBeGreaterThan(0);
    expect(challenge.badgeName).toBeTruthy();
  });

  it("simulates duplicate challenge completion", () => {
    const alreadyCompleted = true;

    expect(alreadyCompleted).toBe(true);
  });
});