import { describe, expect, test } from 'bun:test';
import { rejects } from 'node:assert/strict';
import { chatReducer, restoreHistories } from '../../src/lib/chat/reducer';
import { consumeStream } from '../../src/lib/chat/stream';
import type { Exchange, StreamEvent } from '../../src/lib/chat/types';
import { POST } from '../../src/pages/api/chat';
import type { APIContext } from 'astro';
import { channels } from '../../src/lib/chat/answers.server';

const exchange: Exchange = { id: 'old-request', promptId: 'streaming', question: 'How does this streaming interface work?', text: '', status: 'connecting', links: [] };
const initial = { frontend: [exchange] };
const frame = (event: StreamEvent) => `data: ${JSON.stringify(event)}\n\n`;

describe('conversation recovery and isolation', () => {
	test('late chunks cannot update a stopped response or a replacement request', () => {
		const stopped = chatReducer(initial, { type: 'interrupt', channelId: 'frontend', requestId: exchange.id });
		const late = { type: 'event' as const, channelId: 'frontend', event: { type: 'delta' as const, requestId: exchange.id, text: 'late text' } };
		expect(chatReducer(stopped, late).frontend[0].text).toBe('');
		const retried = chatReducer(stopped, { type: 'ask', channelId: 'frontend', exchange: { ...exchange, id: 'new-request' } });
		expect(chatReducer(retried, late).frontend).toHaveLength(1);
		expect(chatReducer(retried, late).frontend[0].text).toBe('');
		expect(chatReducer(retried, { ...late, channelId: 'backend' }).frontend).toEqual(retried.frontend);
	});
	test('restoring turns active requests into retryable interruptions and filters unsafe links', () => {
		const restored = restoreHistories(JSON.stringify({ frontend: [{ ...exchange, text: 'Partial', status: 'streaming', links: [{ label: 'bad', href: 'javascript:alert(1)' }, { label: 'bad', href: '/\\evil.com' }, { label: 'Blog', href: '/blog' }] }], bogus: [exchange] }), channels);
		expect(restored.frontend[0].status).toBe('interrupted');
		expect(restored.frontend[0].links).toEqual([{ label: 'Blog', href: '/blog' }]);
		expect(restored.bogus).toBeUndefined();
		expect(restoreHistories('not json', channels)).toEqual({});
	});
});

describe('stream framing', () => {
	test('decodes arbitrarily split UTF-8 bytes and event boundaries', async () => {
		const text = frame({ type: 'start', requestId: 'a' }) + frame({ type: 'delta', requestId: 'a', text: 'Hello, Olly. Café 👋' }) + frame({ type: 'complete', requestId: 'a', links: [] });
		const bytes = new TextEncoder().encode(text);
		const received: StreamEvent[] = [];
		const stream = new ReadableStream({ start(controller) { for (const byte of bytes) controller.enqueue(new Uint8Array([byte])); controller.close(); } });
		await consumeStream(new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } }), 'a', (event) => received.push(event));
		expect(received[1]).toEqual({ type: 'delta', requestId: 'a', text: 'Hello, Olly. Café 👋' });
		expect(received).toHaveLength(3);
	});
	test('rejects a stream that ends early or belongs to another request', async () => {
		const response = (text: string) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } });
		await rejects(consumeStream(response(frame({ type: 'start', requestId: 'a' })), 'a', () => {}), /before the response finished/);
		await rejects(consumeStream(response(frame({ type: 'start', requestId: 'b' })), 'a', () => {}), /did not match/);
		await rejects(consumeStream(response('data: not-json\n\n'), 'a', () => {}));
	});
});

const request = (body: unknown, headers: Record<string, string> = {}) => new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const handle = async (req: Request) => await POST({ request: req } as APIContext);

describe('chat endpoint contract', () => {
	test('rejects unknown prompt/channel pairs, oversized bodies, and foreign origins', async () => {
		expect((await handle(request({ channelId: 'frontend', promptId: 'hello', requestId: 'a' }))).status).toBe(400);
		expect((await handle(request({ padding: 'a'.repeat(2000) }))).status).toBe(413);
		expect((await handle(request({}, { Origin: 'https://elsewhere.example' }))).status).toBe(403);
		expect((await handle(request(null))).status).toBe(400);
	});
	test('delivers multiple chunks, then approved attachment links', async () => {
		const response = await handle(request({ channelId: 'contact', promptId: 'reach', requestId: 'real-stream' }));
		const received: StreamEvent[] = [];
		await consumeStream(response, 'real-stream', (event) => received.push(event));
		expect(received.filter((event) => event.type === 'delta').length).toBeGreaterThan(2);
		expect(received.at(-1)).toMatchObject({ type: 'complete', links: [{ label: 'Get in touch', href: 'mailto:oliver.markey@outlook.com' }] });
	});
	test('a reader can cancel an active response', async () => {
		const response = await handle(request({ channelId: 'frontend', promptId: 'streaming', requestId: 'cancel' }));
		const reader = response.body!.getReader();
		await reader.read();
		await reader.cancel();
		expect((await reader.read()).done).toBe(true);
	});
});
