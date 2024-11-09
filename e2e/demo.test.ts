import { expect, test } from '@playwright/test';

test.describe('logged in', () => {
	test('home page has username in heading when logged in', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', {
				name: 'Welcome steven@test.com, to SvelteKit'
			})
		).toBeVisible();
	});
});

test.describe('logged out', () => {
	// Reset storage state for this file to avoid being authenticated
	test.use({ storageState: { cookies: [], origins: [] } });

	test('home page has default heading when not logged in', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', {
				name: 'Welcome guest, to SvelteKit'
			})
		).toBeVisible();
	});
});
