import { expect, test, type Page } from '@playwright/test';

const FIREBASE_HOSTS = ['firestore.googleapis.com', 'firebasestorage.googleapis.com'];

async function columnCount(page: Page): Promise<number> {
  return page.locator('.blog-card').evaluateAll((cards) => {
    const lefts = cards
      .slice(0, 3)
      .map((card) => Math.round(card.getBoundingClientRect().left));
    return new Set(lefts).size;
  });
}

test('TC-130 loads the header and exactly ten cards', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'BlogX' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  await expect(page.locator('.blog-card')).toHaveCount(10);
  await expect(page.locator('.blog-card').first()).toContainText('Why I Still Reach for Plain CSS');
});

test('TC-131 uses one column at 375px with no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('.blog-card')).toHaveCount(10);

  expect(await columnCount(page)).toBe(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    ),
  ).toBe(true);
});

test('TC-132 uses two columns at 768px', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/');
  await expect(page.locator('.blog-card')).toHaveCount(10);

  expect(await columnCount(page)).toBe(2);
});

test('TC-133 uses three columns at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.blog-card')).toHaveCount(10);

  expect(await columnCount(page)).toBe(3);
});

test('TC-134 navigates to the sign-up placeholder', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sign up' }).click();

  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Sign up' })).toBeVisible();
});

test('TC-135 loads without console errors, failed requests, or Firebase traffic', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const firebaseRequests: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(request.url()));
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('request', (request) => {
    if (FIREBASE_HOSTS.some((host) => request.url().includes(host))) {
      firebaseRequests.push(request.url());
    }
  });

  await page.goto('/');
  await expect(page.locator('.blog-card')).toHaveCount(10);

  expect(consoleErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
  expect(firebaseRequests).toEqual([]);
});
