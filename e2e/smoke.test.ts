import { expect, test } from '@playwright/test';

test.describe('logged in', () => {
	test('page has logout button in the header when logged in', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('button', {
				name: 'Logout'
			})
		).toBeVisible();
	});
});

test.describe('logged out', () => {
	// Reset storage state for this file to avoid being authenticated
	test.use({ storageState: { cookies: [], origins: [] } });

	test('redirects to the login page when not logged in', async ({ page }) => {
		await page.goto('/');

		expect(page.url()).toContain('/login');
		await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
	});
});
