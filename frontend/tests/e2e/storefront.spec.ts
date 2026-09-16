import { expect, test } from "@playwright/test";

async function loginAsCustomer(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').first().fill("user@minishop.vn");
  await page.locator('input[type="password"]').first().fill("123456");
  await page.getByRole("button", { name: "ĐĂNG NHẬP NGAY", exact: true }).click();
  await expect(page).toHaveURL(/\/$/, { timeout: 10_000 });
}

test("home page exposes primary shopping navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByRole("link", { name: /MiniShop/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /Khám Phá Phong Cách/i })).toBeVisible();
});

test("demo customer can log in", async ({ page }) => {
  await loginAsCustomer(page);
});

test("customer can add a product to cart", async ({ page }) => {
  await loginAsCustomer(page);
  await page.goto("/products");
  await page.getByRole("button", { name: /Thêm .* vào giỏ hàng/i }).first().click();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { level: 1, name: /^Giỏ Hàng \(/i })).toBeVisible();
  await expect(page.locator("main")).toContainText("1 sản phẩm");
});

test("product catalogue loads seeded products", async ({ page }) => {
  await page.goto("/products");
  await expect(page.getByRole("heading", { name: /Tất Cả Sản Phẩm/i })).toBeVisible({ timeout: 10_000 });
  await expect(page.locator("main")).toContainText("10 sản phẩm");
});

test("pages do not overflow horizontally", async ({ page }) => {
  for (const path of ["/", "/products", "/login", "/admin"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} overflowed horizontally`).toBeLessThanOrEqual(1);
  }
});
