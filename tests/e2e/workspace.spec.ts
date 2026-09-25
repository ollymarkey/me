import { test, expect, type Page } from '@playwright/test';
import axe from 'axe-core';

declare global {
	interface Window { axe: typeof axe }
}

async function ready(page: Page, hash = '') {
	await page.goto(`/${hash}`);
	await expect(page.locator('.prompt-options button').first()).toBeEnabled();
}

test('streaming, cancellation, retry, channel isolation, and refresh recovery', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await ready(page, '#frontend');
	await page.getByRole('button', { name: 'Building a streaming UI' }).click();
	await expect(page.locator('.response-copy')).toContainText('Selecting');
	await page.getByRole('button', { name: 'Stop', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
	await page.getByRole('button', { name: 'Retry' }).click();
	await expect(page.locator('.response-message')).toHaveAttribute('aria-busy', 'false');
	await expect(page.locator('.response-copy')).toContainText('The conversation follows');
	await expect(page.locator('.visitor-message')).toHaveCount(1);
	await page.locator('.workspace-sidebar').getByRole('link', { name: 'backend', exact: true }).click();
	await expect(page.locator('.visitor-message')).toHaveCount(0);
	await page.getByRole('button', { name: 'Inside the endpoint' }).click();
	await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
	await page.locator('.workspace-sidebar').getByRole('link', { name: /^frontend/ }).click();
	await expect(page.locator('.visitor-message')).toHaveCount(1);
	await expect(page.locator('.response-copy')).toContainText('Selecting a prompt');
	await page.goBack();
	await expect(page.locator('h1')).toHaveText('backend');
	await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('olly-workspace:v1') || '{}').backend?.[0]?.status)).toBe('interrupted');
	await page.reload();
	await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
	await expect(page.locator('.visitor-message')).toHaveCount(1);
	expect(errors).toEqual([]);
});

test('network failures can be retried without duplicated questions', async ({ page }) => {
	await ready(page);
	await page.route('**/api/chat', (route) => route.abort('failed'));
	await page.getByRole('button', { name: 'The quick introduction' }).click();
	await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
	await page.unroute('**/api/chat');
	await page.getByRole('button', { name: 'Retry' }).click();
	await expect(page.locator('.response-message')).toHaveAttribute('aria-busy', 'false');
	await expect(page.locator('.response-copy')).toContainText('Melbourne');
	await expect(page.locator('.visitor-message')).toHaveCount(1);
});

test('light and dark desktop views have no detected accessibility violations', async ({ page }, testInfo) => {
	await ready(page);
	await page.addScriptTag({ content: axe.source });
	for (const theme of ['light', 'dark']) {
		if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark theme' }).click();
		const results = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
		expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
		await page.screenshot({ path: testInfo.outputPath(`desktop-${theme}.png`), fullPage: true });
	}
	await expect(page.locator('body')).not.toContainText('—');
});

test('mobile drawer, keyboard focus, reduced motion, and narrow layouts', async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await ready(page);
	await page.getByRole('button', { name: 'Open channels' }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: 'Open channels' })).toBeFocused();
	await page.getByRole('button', { name: 'Open channels' }).click();
	await page.getByRole('dialog').getByRole('link', { name: 'frontend', exact: true }).click();
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect(page.locator('h1')).toHaveText('frontend');
	await expect(page.getByRole('button', { name: 'Open channels' })).toBeFocused();
	await page.getByRole('button', { name: 'Building a streaming UI' }).click();
	await expect(page.locator('.response-message')).toHaveAttribute('aria-busy', 'false');
	await expect(page.locator('.response-copy')).toContainText('The conversation follows');
	await page.addScriptTag({ content: axe.source });
	const results = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
	expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
	await page.screenshot({ path: testInfo.outputPath('mobile-conversation.png'), fullPage: true });
	for (const width of [320, 390, 768]) {
		await page.setViewportSize({ width, height: 844 });
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	}
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByRole('button', { name: 'Open channels' }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Switch to dark theme' }).click();
	await page.keyboard.press('Escape');
	await page.screenshot({ path: testInfo.outputPath('mobile-dark.png'), fullPage: true });
});

test('blog routes and contact deep links remain available', async ({ page }) => {
	await ready(page, '#contact');
	await expect(page.locator('h1')).toHaveText('contact');
	await page.getByRole('button', { name: 'Get in touch', exact: true }).click();
	await expect(page.locator('.response-links a')).toHaveAttribute('href', 'mailto:oliver.markey@outlook.com');
	await page.goto('/blog');
	await expect(page.getByRole('heading', { name: 'First Post' })).toBeVisible();
	await page.goto('/blog/first-post');
	await expect(page.locator('h1')).toHaveText('First Post');
});

test('channel navigation restores the reader’s scroll position', async ({ page }) => {
	await page.setViewportSize({ width: 1000, height: 700 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await ready(page, '#frontend');
	await page.getByRole('button', { name: 'Building a streaming UI' }).click();
	await expect(page.locator('.response-copy')).toContainText('The conversation follows');
	await expect(page.locator('.response-message')).toHaveAttribute('aria-busy', 'false');
	const pane = page.locator('.conversation-scroll');
	await pane.evaluate((element) => { element.scrollTop = 100; });
	await expect(page.getByRole('button', { name: 'Jump to latest' })).toBeVisible();
	await page.locator('.workspace-sidebar').getByRole('link', { name: 'backend', exact: true }).click();
	await page.locator('.workspace-sidebar').getByRole('link', { name: /^frontend/ }).click();
	await expect.poll(() => pane.evaluate((element) => element.scrollTop)).toBe(100);
	await page.getByRole('button', { name: 'Jump to latest' }).click();
	await expect.poll(() => pane.evaluate((element) => element.scrollHeight - element.scrollTop - element.clientHeight)).toBeLessThan(2);
});
