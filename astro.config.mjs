// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
const site = process.env.SITE_URL;

export default defineConfig({
	site,
	integrations: [react()],
	adapter: node({ mode: 'standalone' }),
	security: {
		allowedDomains: [
			{ hostname: 'localhost' },
			{ hostname: '127.0.0.1' },
			...(site ? [{ hostname: new URL(site).hostname }] : []),
		],
	},
});
