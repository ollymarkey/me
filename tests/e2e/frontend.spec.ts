import { test, expect } from '@playwright/test';
import axe from 'axe-core';
import { readFileSync } from 'node:fs';

test('frontend islands are interactive, expose actual source, and make no chat requests', async ({ page }) => {
	const errors: string[] = [];
	const requests: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	page.on('request', (request) => {
		if (request.url().endsWith('/api/chat')) requests.push(request.url());
	});
	await page.goto('/frontend');
	await expect(page.locator('h1')).toHaveText('frontend');
	await expect(page.locator('.example-card:visible')).toHaveCount(0);
	await expect(page.locator('astro-island[component-url*="LoadingExperience"]')).toHaveAttribute('ssr', '');
	await page.getByRole('button', { name: 'AI interfaces React' }).click();
	const react = page.locator('.loading-experience');
	await expect(react).toHaveAttribute('data-ready', 'true');
	await expect(page.locator('astro-island[component-url*="ListPlayground"]')).toHaveAttribute('ssr', '');
	await expect(react.getByRole('status')).toContainText('Reading the brief');
	await expect(react.locator('.demo-spinner')).toBeVisible();
	await react.getByRole('radio', { name: 'Give me the detail' }).check();
	await react.getByRole('button', { name: 'Stop demo' }).click();
	await expect(react.getByRole('status')).toContainText('Demo stopped');
	await expect(react.locator('.demo-spinner')).toHaveCount(0);
	await react.getByRole('button', { name: 'Run again' }).click();
	await expect(react.getByRole('status')).toContainText('Ready when you are', { timeout: 8_000 });
	await expect(react.locator('.demo-output')).toContainText('Here, your choice changes the result');
	await page.getByRole('button', { name: 'View React code' }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toHaveAccessibleName('React source code');
	await expect(page.locator('pre[aria-label="React component source"]')).toHaveText(
		readFileSync('src/components/frontend/LoadingExperience.tsx', 'utf8'),
	);
	await dialog.getByRole('button', { name: 'Styles', exact: true }).click();
	await expect(dialog.locator('pre')).toHaveText(readFileSync('src/styles/workspace/frontend-examples.css', 'utf8'));
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(page.getByRole('button', { name: 'View React code' })).toBeFocused();
	await page.getByRole('button', { name: 'Reactive interfaces Svelte' }).click();
	const svelte = page.locator('.list-playground');
	await expect(svelte).toHaveAttribute('data-ready', 'true');
	const rows = svelte.getByRole('listitem');
	await expect(rows).toHaveCount(4);
	const original = await rows.allTextContents();
	await svelte.getByRole('button', { name: 'Shuffle' }).click();
	await expect.poll(() => rows.allTextContents()).not.toEqual(original);
	await svelte.getByRole('button', { name: 'Sort', exact: true }).click();
	await expect.poll(() => rows.allTextContents()).toEqual(original);
	await svelte.getByRole('button', { name: 'Add', exact: true }).press('Enter');
	await svelte.getByRole('button', { name: 'Add', exact: true }).click();
	await expect(rows).toHaveCount(6);
	await expect(svelte.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
	for (let i = 0; i < 6; i++) await svelte.getByRole('button', { name: 'Remove' }).click();
	await expect(rows).toHaveCount(0);
	await expect(svelte.getByRole('status')).toContainText('List cleared');
	await expect(svelte.getByRole('button', { name: 'Remove' })).toBeDisabled();
	await svelte.getByRole('button', { name: 'Add', exact: true }).click();
	await expect(rows).toContainText(['Item 7']);
	await page.getByRole('button', { name: 'View Svelte code' }).click();
	await expect(page.locator('pre[aria-label="Svelte component source"]')).toHaveText(
		readFileSync('src/components/frontend/ListPlayground.svelte', 'utf8'),
	);
	await dialog.getByRole('button', { name: 'Close code' }).click();
	await expect(page.getByRole('button', { name: 'View Svelte code' })).toBeFocused();
	await page.getByRole('button', { name: 'Let HTML do it HTML' }).click();
	const html = page.locator('.native-disclosure');
	await html.locator('summary').first().focus();
	await page.keyboard.press('Enter');
	await expect(html.locator('details').first()).toHaveAttribute('open', '');
	await expect(html.locator('details').first()).toContainText('Native HTML');
	await html.locator('summary').nth(1).click();
	await expect(html.locator('details').first()).not.toHaveAttribute('open', '');
	await expect(html.locator('details').nth(1)).toHaveAttribute('open', '');
	await html.locator('summary').nth(1).press('Enter');
	await expect(html.locator('details').nth(1)).not.toHaveAttribute('open', '');
	await page.getByRole('button', { name: 'View HTML code' }).click();
	await expect(page.locator('pre[aria-label="HTML component source"]')).toHaveText(
		readFileSync('src/components/frontend/NativeDisclosure.astro', 'utf8'),
	);
	await page.keyboard.press('Escape');
	// Astro hydrates React and Svelte separately; the HTML demo has no island wrapper.
	await expect(page.locator('astro-island[component-export="default"][component-url*="LoadingExperience"]')).not.toHaveAttribute('ssr', '');
	await expect(page.locator('astro-island[component-url*="ListPlayground"]')).not.toHaveAttribute('ssr', '');
	await expect(html.locator('xpath=ancestor::astro-island[1]')).toHaveAttribute('component-url', /FrontendChannel/);
	await page.locator('.workspace-sidebar').getByRole('link', { name: 'welcome', exact: true }).click();
	await page.goBack();
	await expect(page.locator('h1')).toHaveText('frontend');
	await page.getByRole('button', { name: 'Reactive interfaces Svelte' }).click();
	await expect(rows).toHaveCount(1);
	await expect(rows).toContainText(['Item 7']);
	expect(requests).toEqual([]);
	expect(errors).toEqual([]);
});

test('native accordion animates both directions and respects reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/frontend');
	await page.getByRole('button', { name: 'Let HTML do it HTML' }).click();
	const details = page.locator('.native-disclosure details').first();
	for (const open of [true, false]) {
		const motion = await details.evaluate(async (element) => {
			const details = element as HTMLDetailsElement;
			const before = details.getBoundingClientRect().height;
			details.querySelector('summary')!.click();
			const waitFrames = (milliseconds: number) => new Promise<void>((resolve) => {
				const start = performance.now();
				function frame(now: number) {
					if (now - start >= milliseconds) resolve();
					else requestAnimationFrame(frame);
				}
				requestAnimationFrame(frame);
			});
			await waitFrames(80);
			const middle = details.getBoundingClientRect().height;
			await waitFrames(300);
			const after = details.getBoundingClientRect().height;
			return { before, middle, after };
		}, open);
		await expect(details).toHaveAttribute('data-expanded', String(open));
		expect(motion.middle).toBeGreaterThan(Math.min(motion.before, motion.after));
		expect(motion.middle).toBeLessThan(Math.max(motion.before, motion.after));
	}
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await details.locator('summary').click();
	expect(await details.evaluate((element) => getComputedStyle(element.querySelector('.disclosure-content')!).transitionDuration)).toBe('0s');
});

for (const mobile of [false, true]) {
	for (const theme of ['light', 'dark'] as const) {
		test(`${mobile ? 'mobile' : 'desktop'} ${theme} frontend demos are accessible`, async ({ browser }, testInfo) => {
			const page = await browser.newPage({
				viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 960 },
				hasTouch: mobile,
				isMobile: mobile,
				colorScheme: theme,
				reducedMotion: 'reduce',
			});
			try {
				await page.goto('/frontend');
				await expect(page.getByRole('button', { name: 'AI interfaces React' })).toBeEnabled();
				await expect(page.locator('.example-card:visible')).toHaveCount(0);
				await page.screenshot({ path: testInfo.outputPath('before-selection.png'), fullPage: true });
				await page.addScriptTag({ content: axe.source });
				for (const label of ['AI interfaces React', 'Reactive interfaces Svelte', 'Let HTML do it HTML']) {
					const button = page.getByRole('button', { name: label });
					if (mobile) await button.tap(); else await button.click();
					const framework = label.split(' ').at(-1);
					if (framework === 'Svelte') {
						const list = page.locator('.list-playground');
						await expect(list).toHaveAttribute('data-ready', 'true');
						const add = list.getByRole('button', { name: 'Add', exact: true });
						if (mobile) await add.tap(); else await add.click();
						await expect(list.getByRole('listitem')).toHaveCount(5);
					}
					const sourceToggle = page.getByRole('button', { name: `View ${framework} code` });
					if (mobile) await sourceToggle.tap(); else await sourceToggle.click();
					const dialog = page.getByRole('dialog', { name: `${framework} source code` });
					await expect(dialog).toBeVisible();
					await expect(dialog.getByRole('button', { name: 'Close code' })).toBeFocused();
					await page.keyboard.press('Shift+Tab');
					await expect(dialog.locator('pre')).toBeFocused();
					const violations = await page.evaluate(async () => (await window.axe.run(document, {
						runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
					})).violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) })));
					expect(violations).toEqual([]);
					await page.screenshot({ path: testInfo.outputPath(`${framework}-code.png`), fullPage: true });
					await dialog.getByRole('button', { name: 'Close code' }).click();
					await expect(sourceToggle).toBeFocused();
					const cardViolations = await page.evaluate(async () => (await window.axe.run(document, {
						runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
					})).violations.map((violation) => violation.id));
					expect(cardViolations).toEqual([]);
					await page.screenshot({ path: testInfo.outputPath(`${framework}.png`), fullPage: true });
				}
				await page.getByRole('button', { name: 'View HTML code' }).click();
				for (const width of mobile ? [320, 390, 768] : [1440]) {
					await page.setViewportSize({ width, height: 844 });
					await expect(page.getByRole('dialog').getByRole('button', { name: 'Close code' })).toBeInViewport();
					expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
				}
			} finally {
				await page.close();
			}
		});
	}
}
