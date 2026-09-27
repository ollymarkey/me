import { test, expect } from '@playwright/test';
import { channels } from '../../src/lib/chat/answers.server';

test('every channel renders the correct heading before JavaScript', async ({ browser }) => {
	const page = await browser.newPage({ javaScriptEnabled: false });
	try {
		for (const channel of channels) {
			const response = await page.goto(`/${channel.id}`);
			expect(response?.status()).toBe(200);
			await expect(page.locator('h1')).toHaveText(channel.name);
			await expect(page.locator('a[href*="/blog"], a[href="/writing"]')).toHaveCount(0);
			await expect(page.locator('body')).not.toContainText(/blog/i);
			await expect(page.locator('.workspace-sidebar a[aria-current="page"]')).toHaveAttribute('href', channel.id === 'welcome' ? '/' : `/${channel.id}`);
		}
	} finally {
		await page.close();
	}
});

test('channel routes support refresh, history, and legacy hashes', async ({ page }) => {
	await page.goto('/#contact');
	await expect(page).toHaveURL(/\/contact$/);
	await page.locator('.workspace-sidebar').getByRole('link', { name: 'frontend', exact: true }).click();
	await expect(page).toHaveURL(/\/frontend$/);
	await page.reload();
	await expect(page.locator('h1')).toHaveText('frontend');
	await page.locator('.workspace-sidebar').getByRole('link', { name: 'backend', exact: true }).click();
	await expect(page).toHaveURL(/\/backend$/);
	await page.goBack();
	await expect(page.locator('h1')).toHaveText('frontend');
	await page.goForward();
	await expect(page.locator('h1')).toHaveText('backend');
});
