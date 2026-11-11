import { expect, test, type Page } from "@playwright/test";

/** Adds one item on the website and walks the checkout to the test gateway. Returns the order id. */
async function checkoutToGateway(page: Page): Promise<string> {
  await page.goto("/shop/writing");
  await page.getByRole("button", { name: "Add Gel Pens, 6 colours to bag" }).click();
  await expect(page.locator("header [data-bag-target]")).toHaveAttribute("aria-label", "Bag, 1 item");

  await page.goto("/bag");
  await page.getByRole("link", { name: "Checkout" }).click();
  await page.waitForURL("**/checkout");

  // Submitting empty shows the field errors
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.getByText("Please check the highlighted details.")).toBeVisible();

  await page.getByRole("button", { name: "Use demo details" }).click();
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await page.waitForURL(/\/checkout\/pay\/AS-\d{6}$/);
  return page.url().split("/").pop()!;
}

test("web checkout: a declined payment, then an approved one, then tracking", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  const id = await checkoutToGateway(page);
  await expect(page.getByText("TEST MODE")).toBeVisible();

  await page.getByRole("button", { name: "Decline (test a failed payment)" }).click();
  await expect(page.getByText(/test payment was declined/)).toBeVisible();

  await page.getByRole("button", { name: "Approve test payment" }).click();
  await page.waitForURL(new RegExp(`/orders/${id}`));
  await expect(page.getByText("We've got your order")).toBeVisible();

  // The bag is empty once payment is confirmed, and the order is listed
  await expect(page.locator("header [data-bag-target]")).toHaveAttribute("aria-label", "Bag, empty");
  await page.goto("/account/orders");
  await expect(page.getByRole("link", { name: new RegExp(id) })).toBeVisible();

  expect(errors).toEqual([]);
});

test("admin: overview, inventory, and moving an order on updates the customer's tracking", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  const id = await checkoutToGateway(page);
  await page.getByRole("button", { name: "Approve test payment" }).click();
  await page.waitForURL(new RegExp(`/orders/${id}`));

  await page.goto("/admin");
  await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Revenue by day" }).getByRole("button")).toHaveCount(30);
  await page.getByRole("button", { name: "Table" }).click();
  await expect(page.getByRole("table", { name: "Revenue by day" })).toBeVisible();
  await expect(page.getByRole("link", { name: id })).toBeVisible();

  await page.goto("/admin/inventory?filter=low");
  await expect(page.getByText("Sold out").first()).toBeVisible();
  await page.getByRole("link", { name: /Whiteboard Markers, 4-pack/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Whiteboard Markers, 4-pack" })).toBeVisible();
  await expect(page.getByRole("table", { name: /Every stock movement/ })).toBeVisible();

  await page.goto("/admin/orders");
  const row = page.getByRole("row").filter({ hasText: id });
  await row.getByRole("button", { name: "Mark packed" }).click();
  await expect(row.getByText("Packed", { exact: true })).toBeVisible();
  await expect(row.getByRole("button", { name: "Hand to courier" })).toBeVisible();

  await page.goto(`/orders/${id}`);
  await expect(page.getByText("Packed and ready")).toBeVisible();

  expect(errors).toEqual([]);
});
