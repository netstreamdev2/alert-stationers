import { expect, test } from "@playwright/test";

test("the app preview: intro, guest, add, scan a list, bag, checkout preview", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/app");
  const app = page.locator("[data-sim-phone]");

  // Intro: three slides, then continue as a guest
  await expect(app.getByRole("tab", { name: "Slide 1" })).toHaveAttribute("aria-selected", "true");
  await app.getByRole("button", { name: "Next", exact: true }).click();
  await app.getByRole("button", { name: "Next", exact: true }).click();
  await app.getByRole("button", { name: /Continue as guest/ }).click();
  await expect(app.getByText("Shop by aisle")).toBeVisible();

  // Quick add from a tile
  await app.locator('button[aria-label^="Add "]').first().click();
  await expect(app.locator("nav[aria-label=App] [data-sim-bag]")).toHaveAttribute("aria-label", "Bag, 1 items");

  // Scan a school list and add all of it
  await app.getByRole("button", { name: "Scan a school list" }).last().click();
  await app.getByRole("button", { name: "Scan the list" }).click();
  await app.getByRole("button", { name: /Add all 13 to bag/ }).click({ timeout: 10_000 });
  await expect(app.locator("nav[aria-label=App] [data-sim-bag]")).toHaveAttribute("aria-label", "Bag, 20 items");

  // Checkout stops at the preview sheet
  await app.getByRole("button", { name: "Checkout", exact: true }).click();
  await expect(app.getByRole("dialog", { name: "Preview" })).toBeVisible();
  await app.getByRole("button", { name: "Keep shopping" }).click();
  await expect(app.getByText("Shop by aisle")).toBeVisible();

  expect(errors).toEqual([]);
});
