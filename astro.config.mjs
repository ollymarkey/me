// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// https://astro.build/config
const site = process.env.SITE_URL;

export default defineConfig({
	site,
	// The floating toolbar overlaps the mobile drawer's theme control.
	devToolbar: { enabled: false },
	integrations: [react(), svelte()],
	// Vercel sets this for deployment builds; local builds retain the Node server.
	adapter: process.env.VERCEL === '1' ? vercel() : node({ mode: 'standalone' }),
	security: {
		allowedDomains: [
			{ hostname: 'localhost' },
			{ hostname: '127.0.0.1' },
			...(site ? [{ hostname: new URL(site).hostname }] : []),
		],
	},
});
