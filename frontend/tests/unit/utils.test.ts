import { expect, test, describe } from "vitest";
import { formatVND, slugify } from "@/lib/utils";

describe("formatVND", () => {
  test("formats whole numbers correctly", () => {
    expect(formatVND(1000)).toBe("1.000\u00A0₫");
    expect(formatVND(1000000)).toBe("1.000.000\u00A0₫");
    expect(formatVND(123456789)).toBe("123.456.789\u00A0₫");
  });

  test("formats zero correctly", () => {
    expect(formatVND(0)).toBe("0\u00A0₫");
  });

  test("formats negative numbers correctly", () => {
    expect(formatVND(-1000)).toBe("-1.000\u00A0₫");
  });
});

describe("slugify", () => {
  test("converts Vietnamese text to slug", () => {
    expect(slugify("Áo thun cotton")).toBe("ao-thun-cotton");
    expect(slugify("Điện thoại iPhone")).toBe("dien-thoai-iphone");
    expect(slugify("Laptop Dell XPS 15")).toBe("laptop-dell-xps-15");
  });

  test("handles special characters", () => {
    expect(slugify("Product @#$% Name")).toBe("product-name");
    expect(slugify("C++ Programming")).toBe("c-programming");
  });

  test("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  test("converts to lowercase", () => {
    expect(slugify("PRODUCT NAME")).toBe("product-name");
  });

  test("removes leading/trailing hyphens", () => {
    expect(slugify("  Product  ")).toBe("product");
  });
});
