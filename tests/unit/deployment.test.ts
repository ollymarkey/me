import { expect, test } from 'bun:test';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { NodeApp } from 'astro/app/node';
import type { APIContext } from 'astro';
import config from '../../astro.config.mjs';
import { POST } from '../../src/pages/api/chat';

for (const hostname of ['ollymarkey.com', 'www.ollymarkey.com']) {
	test(`proxied chat requests preserve the public origin for ${hostname}`, async () => {
		const incoming = new IncomingMessage(new Socket());
		incoming.url = '/api/chat';
		incoming.headers = {
			host: 'internal.example',
			'x-forwarded-host': hostname,
			'x-forwarded-proto': 'https',
		};
		const proxied = NodeApp.createRequest(incoming, {
			skipBody: true,
			allowedDomains: config.security?.allowedDomains,
		});
		expect(new URL(proxied.url).origin).toBe(`https://${hostname}`);

		const request = new Request(proxied.url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Origin: `https://${hostname}` },
			body: JSON.stringify({ channelId: 'welcome', promptId: 'hello', requestId: 'proxy-test' }),
		});
		const response = await POST({ request } as APIContext);
		expect(response.status).toBe(200);
		expect(response.headers.get('content-type')).toContain('text/event-stream');
		await response.body?.cancel();
	});
}
