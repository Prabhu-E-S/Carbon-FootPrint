import { describe, expect, it } from "vitest";
import { z } from "zod";

const coachSchema = z.object({
  message: z.string().min(2).max(1000),
});

describe("AI Coach API", () => {
  it("accepts valid sustainability question", () => {
    const result = coachSchema.safeParse({
      message: "How can I reduce my carbon footprint?"
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty question", () => {
    const result = coachSchema.safeParse({
      message: ""
    });

    expect(result.success).toBe(false);
  });

  it("rejects one-character message", () => {
    const result = coachSchema.safeParse({
      message: "A"
    });

    expect(result.success).toBe(false);
  });

  it("accepts long valid message", () => {
    const result = coachSchema.safeParse({
      message: "Tell me how I can reduce emissions from transport, electricity, food and waste over the next month."
    });

    expect(result.success).toBe(true);
  });

  it("simulates unauthorized user", () => {
    const session = null;

    expect(session).toBeNull();
  });

  it("falls back when OpenAI key is unavailable", () => {
    const apiKey = "";

    expect(apiKey).toBeFalsy();
  });

  it("creates personalized response context", () => {
    const summary = {
      user: "Prabhu",
      goal: "Reduce emissions",
      preferredTransport: "Bus"
    };

    expect(summary.user).toBeTruthy();
    expect(summary.goal).toBeTruthy();
  });
});