import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Index Page', () => {
  test('Document title includes page name', async ({ page }) => {
    await expect(page).toHaveTitle(/web-boilerplate/);
  });

  test('Link to Next.js is valid', async ({ page }) => {
    const link = page.locator('a', { hasText: 'Next.js!' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://nextjs.org');
  });
});
