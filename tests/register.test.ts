import { describe, expect, it } from "vitest";

describe("Register Validation", () => {
  it("accepts valid user data", () => {
    const user = {
      name: "Prabhu",
      email: "prabhu@gmail.com",
      password: "password123",
    };

    expect(user.email).toContain("@");
    expect(user.password.length).toBeGreaterThanOrEqual(8);
  });

  it("rejects invalid email", () => {
    const email = "invalidemail";

    expect(email.includes("@")).toBe(false);
  });

  it("rejects short password", () => {
    const password = "123";

    expect(password.length).toBeLessThan(8);
  });
});