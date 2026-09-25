import type { APIRoute } from 'astro';
import { answers } from '../../lib/chat/answers.server';
import { getChannel } from '../../data/channels';
import type { StreamEvent } from '../../lib/chat/types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const origin = request.headers.get('origin');
	if (origin && origin !== new URL(request.url).origin) return new Response('Invalid origin', { status: 403 });
	if (!request.headers.get('content-type')?.includes('application/json')) return new Response('Expected JSON', { status: 415 });
	let input: Record<string, unknown>;
	try {
		const reader = request.body?.getReader();
		if (!reader) throw new Error('Missing body');
		let size = 0;
		let text = '';
		const decoder = new TextDecoder();
		try {
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				size += value.byteLength;
				if (size > 1024) { await reader.cancel(); return new Response('Request too large', { status: 413 }); }
				text += decoder.decode(value, { stream: true });
			}
		} finally { reader.releaseLock(); }
		input = JSON.parse(text + decoder.decode());
		if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid body');
	} catch { return new Response('Invalid request', { status: 400 }); }
	const { channelId, promptId, requestId } = input;
	if (typeof channelId !== 'string' || typeof promptId !== 'string' || typeof requestId !== 'string' || !/^[\w-]{1,80}$/.test(requestId)) return new Response('Invalid identifiers', { status: 400 });
	const channel = getChannel(channelId);
	if (!channel?.prompts.some((prompt) => prompt.id === promptId)) return new Response('Unknown prompt', { status: 400 });
	const answer = answers[channelId][promptId];
	const encoder = new TextEncoder();
	let position = 0;
	let stopped = false;
	let cancelled = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let release: (() => void) | undefined;
	const stop = () => { stopped = true; clearTimeout(timer); release?.(); request.signal.removeEventListener('abort', stop); };
	request.signal.addEventListener('abort', stop, { once: true });
	const encode = (event: StreamEvent) => encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
	const body = new ReadableStream<Uint8Array>({
		start(controller) { controller.enqueue(encode({ type: 'start', requestId })); },
		async pull(controller) {
			if (request.signal.aborted || stopped) { stop(); controller.close(); return; }
			if (position >= answer.text.length) {
				controller.enqueue(encode({ type: 'complete', requestId, links: answer.links ?? [] }));
				stop(); controller.close(); return;
			}
			// Deliberate server-side pacing for prepared content, not simulated model inference.
			await new Promise<void>((resolve) => { release = resolve; timer = setTimeout(resolve, 35); });
			if (stopped) { if (!cancelled) controller.close(); return; }
			controller.enqueue(encode({ type: 'delta', requestId, text: answer.text.slice(position, position + 24) }));
			position += 24;
		},
		cancel() { cancelled = true; stop(); },
	});
	return new Response(body, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' } });
};
