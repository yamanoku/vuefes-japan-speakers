import { expect, test } from "@mizchi/mutator-playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
});

test("検索で発表タイトルを絞り込む", async ({ page }) => {
  await page.goto("/");
  // A year click only succeeds after the island hydrates. Typing before that
  // updates the input without running the search.
  const year2025 = page.getByRole("button", { name: /^2025/ });
  await year2025.click();
  await expect(page.locator("#year-2024")).toHaveCount(0);
  await page.getByRole("button", { name: /^ALL/ }).click();
  await expect(page.locator("#year-2024")).toBeVisible();

  const search = page.getByRole("searchbox", { name: "キーワードで絞り込み" });
  await search.pressSequentially("フレームワークを超えて");
  await expect(page.getByRole("link", { name: /フレームワークを超えて/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^キーノート/ })).toHaveCount(0);
});

test("開催年で一覧を絞り込む", async ({ page }) => {
  await page.goto("/");
  const year = page.getByRole("button", { name: /^2025/ });
  await year.click();
  await expect(year).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("link", { name: /^キーノート/ })).toBeVisible();
  await expect(page.locator("#year-2024")).toHaveCount(0);
});
