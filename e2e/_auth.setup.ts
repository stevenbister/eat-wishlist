import { test as setup } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../playwright/.auth/session.json');

setup('db', async ({ page }) => {
	await page.goto('/api/seed');
});

setup('login', async ({ page }) => {
	await page.goto('/login');

	await page.getByLabel('Email').fill('test@test.com');
	await page.getByLabel('Password').fill('moc5-p@ssWord');
	await page.getByRole('button', { name: 'Login' }).click();

	await page.waitForURL('/');

	await page.context().storageState({ path: authFile });
});
