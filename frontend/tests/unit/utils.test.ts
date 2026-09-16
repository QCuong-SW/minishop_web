import { describe, expect, test } from "vitest";
import { formatVND, slugify } from "@/lib/utils";

describe("formatVND", () => {
  test.each([
    [1000, "1.000"],
    [1000000, "1.000.000"],
    [123456789, "123.456.789"],
    [0, "0"],
    [-1000, "-1.000"],
  ])("formats %s", (value, expected) => {
    expect(formatVND(value)).toBe(expected);
  });
});

describe("slugify", () => {
  test.each([
    ["Áo thun cotton", "ao-thun-cotton"],
    ["Điện thoại iPhone", "dien-thoai-iphone"],
    ["Laptop Dell XPS 15", "laptop-dell-xps-15"],
    ["Product @#$% Name", "product-name"],
    ["C++ Programming", "c-programming"],
    ["  Product  ", "product"],
  ])("slugifies %s", (value, expected) => {
    expect(slugify(value)).toBe(expected);
  });
  test("handles empty strings and lowercase", () => {
    expect(slugify("")).toBe("");
    expect(slugify("PRODUCT NAME")).toBe("product-name");
  });
});
