import { describe, expect, it } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

describe("Register API Validation", () => {
  it("accepts valid registration", () => {
    const result = registerSchema.safeParse({
      name: "Prabhu",
      email: "prabhu@gmail.com",
      password: "password123"
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Prabhu",
      email: "invalid-email",
      password: "password123"
    });

    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      name: "Prabhu",
      email: "prabhu@gmail.com",
      password: "123"
    });

    expect(result.success).toBe(false);
  });

  it("rejects short name", () => {
    const result = registerSchema.safeParse({
      name: "P",
      email: "prabhu@gmail.com",
      password: "password123"
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty payload", () => {
    const result = registerSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});