import { test, expect } from '@playwright/test';

test.describe('Index Page', () => {
  // The method returns an element locator that can be used to perform actions on this page / frame. Locator is resolved to the element immediately before performing an action, so a series of actions on the same locator can in fact be performed on different DOM elements. That would happen if the DOM structure between those actions has changed.
  test('Link to Vercel is valid', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('a').first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      'href',
      'https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app',
    );
  });
});
