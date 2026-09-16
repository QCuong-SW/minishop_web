import { describe, expect, it } from "vitest";
import { calculateDiscountPercent, formatDateOnly, formatNumber, slugify } from "../../src/lib/utils";

describe("frontend utility rules", () => {
  it("normalizes Vietnamese product names into slugs", () => {
    expect(slugify("Áo Thun Đỏ Cao Cấp")).toBe("ao-thun-do-cao-cap");
  });

  it("does not report a discount when original price is lower", () => {
    expect(calculateDiscountPercent(200_000, 150_000)).toBe(0);
  });

  it("calculates rounded discount percent", () => {
    expect(calculateDiscountPercent(75_000, 100_000)).toBe(25);
  });

  it("formats invalid dates without throwing", () => {
    expect(formatDateOnly("not-a-date")).toBe("not-a-date");
  });

  it("formats null numbers as zero", () => {
    expect(formatNumber(null)).toMatch(/0/);
  });
});
