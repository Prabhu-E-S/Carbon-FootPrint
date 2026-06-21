import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";

describe("Password Security", () => {
  it("hashes password successfully", async () => {
    const password = "password123";

    const hash = await bcrypt.hash(password, 12);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it("verifies correct password", async () => {
    const password = "password123";

    const hash = await bcrypt.hash(password, 12);

    const valid = await bcrypt.compare(password, hash);

    expect(valid).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await bcrypt.hash("password123", 12);

    const valid = await bcrypt.compare("wrongpass", hash);

    expect(valid).toBe(false);
  });
});