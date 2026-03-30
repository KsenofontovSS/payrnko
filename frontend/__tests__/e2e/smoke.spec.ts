import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('homepage returns 200 and has title', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/РНКО|Simple Payment/);
  });

  test('page has main heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
