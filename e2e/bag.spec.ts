import { expect, test } from "@playwright/test";

const headerBag = (page: import("@playwright/test").Page) => page.locator("header [data-bag-target]");

test("add to bag from a product page updates the header and the bag", async ({ page }) => {
  await page.goto("/product/backpack-25l");
  await expect(headerBag(page)).toHaveAttribute("aria-label", "Bag, empty");

  await page.getByRole("button", { name: "Grey" }).click();
  await page.getByRole("button", { name: "One more" }).click();
  await page.getByRole("button", { name: "Add 2 to bag" }).click();
  await expect(page.getByRole("button", { name: "Added to bag" })).toBeVisible();
  await expect(headerBag(page)).toHaveAttribute("aria-label", "Bag, 2 items");

  await page.goto("/bag");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("2 items");
  await expect(page.getByText("Grey")).toBeVisible();
  // R494.99 × 2, priced by the server
  await expect(page.getByText("R989.98").first()).toBeVisible();
});

test("quick add from a product card", async ({ page }) => {
  await page.goto("/shop/writing");
  await page.getByRole("button", { name: "Add Gel Pens, 6 colours to bag" }).click();
  await expect(headerBag(page)).toHaveAttribute("aria-label", "Bag, 1 item");
});

test("bulk pricing kicks in at the bag", async ({ page }) => {
  await page.goto("/product/printing-paper-a4-80");
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "One more" }).click();
  await page.getByRole("button", { name: "Add 5 to bag" }).click();
  await expect(headerBag(page)).toHaveAttribute("aria-label", "Bag, 5 items");
  await page.goto("/bag");
  await expect(page.getByText(/bulk price/)).toBeVisible();
  await expect(page.getByText("R499.95").first()).toBeVisible();
});

test("sold-out products can't be added", async ({ page }) => {
  await page.goto("/product/whiteboard-markers-4");
  await expect(page.getByRole("button", { name: "Sold out" })).toBeDisabled();
});
