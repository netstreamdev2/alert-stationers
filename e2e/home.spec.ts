import { expect, test, type Page } from "@playwright/test";

/** Collects runtime errors, ignoring 404s from prefetching pages that aren't built yet. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      errors.push(`console: ${message.text()}`);
    }
  });
  return errors;
}

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`home has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
}

test("home renders without runtime or hydration errors", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });
  // Exact words matter: the headline is split into lines, and must still read as a sentence.
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your whole school list. One tap.");
  // Let the live countdown take over from the server-rendered date.
  await expect(page.getByText(/Ends in \d+d/).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test("prices are formatted by the shared formatter", async ({ page }) => {
  await page.goto("/");
  // Grade 4 list total and the planner special, both calculated in @alert/core.
  await expect(page.getByText("R702.81").first()).toBeVisible();
  await expect(page.getByText("R199.99").first()).toBeVisible();
});

test("phones get menu, logo and bag; the menu opens and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Account" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Bag, empty" })).toBeVisible();

  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("pages that aren't built yet show the branded 404", async ({ page }) => {
  const response = await page.goto("/shop/writing");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This aisle is still being stocked." })).toBeVisible();
});
