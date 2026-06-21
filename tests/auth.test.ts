import { describe, expect, it } from "vitest";

describe("Authentication", () => {
  it("valid email contains @", () => {
    expect("user@gmail.com").toContain("@");
  });

  it("invalid email does not contain @", () => {
    expect("invalidemail").not.toContain("@");
  });
});