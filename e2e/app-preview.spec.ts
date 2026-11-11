import { expect, test } from "@playwright/test";

test("the app preview: intro, guest, add, scan a list, checkout, pay, track", async ({ page }) => {
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

  // Checkout in the app: details are prefilled, then the test payment sheet
  await app.getByRole("button", { name: "Checkout", exact: true }).click();
  await app.getByRole("button", { name: /^Pay R/ }).click();
  const sheet = app.getByRole("dialog", { name: "Test payment" });
  await expect(sheet).toBeVisible();
  await sheet.getByRole("button", { name: "Decline (test a failed payment)" }).click();
  await expect(sheet.getByText(/Declined\. Nothing was charged/)).toBeVisible();
  await sheet.getByRole("button", { name: "Approve test payment" }).click();

  // Tracking, then the same order on the website
  await expect(app.getByText("We've got your order")).toBeVisible();
  const heading = await app.getByText(/^Order AS-\d{6}$/).textContent();
  const id = heading!.replace("Order ", "");
  // Back to the tabs: the bag was emptied by the payment
  await app.getByRole("button", { name: "Back" }).click();
  await expect(app.locator("nav[aria-label=App] [data-sim-bag]")).toHaveAttribute("aria-label", "Bag");
  await page.goto("/account/orders");
  await expect(page.getByRole("link", { name: new RegExp(`${id}.*App`) })).toBeVisible();

  expect(errors).toEqual([]);
});
