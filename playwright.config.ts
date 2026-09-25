import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	workers: 2,
	timeout: 30_000,
	use: { baseURL: 'http://127.0.0.1:4322', viewport: { width: 1440, height: 960 }, trace: 'retain-on-failure' },
	webServer: {
		command: 'bun run start',
		url: 'http://127.0.0.1:4322',
		env: { HOST: '127.0.0.1', PORT: '4322' },
		reuseExistingServer: !process.env.CI,
	},
});
