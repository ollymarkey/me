import { isSafeLink } from './reducer';
import type { StreamEvent } from './types';

export function parseFrame(frame: string): StreamEvent | null {
	const data = frame.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trimStart()).join('\n');
	if (!data) return null;
	const event = JSON.parse(data);
	if (!event || typeof event.requestId !== 'string') throw new Error('Invalid response event.');
	if (event.type === 'start') return event;
	if (event.type === 'delta' && typeof event.text === 'string') return event;
	if (event.type === 'complete' && Array.isArray(event.links) && event.links.every(isSafeLink)) return event;
	if (event.type === 'error' && typeof event.message === 'string') return event;
	throw new Error('Invalid response event.');
}

export async function consumeStream(response: Response, requestId: string, onEvent: (event: StreamEvent) => void) {
	if (!response.ok) throw new Error(response.status === 429 ? 'A few too many requests. Please try again shortly.' : 'Couldn’t start the response. Please try again.');
	if (!response.body || !response.headers.get('content-type')?.includes('text/event-stream')) throw new Error('The server did not return a response stream.');
	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';
	let complete = false;
	try {
		while (!complete) {
			const { value, done } = await reader.read();
			buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
			if (buffer.length > 32_000) throw new Error('The response could not be read.');
			let boundary: RegExpExecArray | null;
			while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
				const frame = buffer.slice(0, boundary.index);
				buffer = buffer.slice(boundary.index + boundary[0].length);
				const event = parseFrame(frame);
				if (!event) continue;
				if (event.requestId !== requestId) throw new Error('The response did not match this request.');
				if (event.type === 'error') throw new Error(event.message);
				onEvent(event);
				if (event.type === 'complete') { complete = true; break; }
			}
			if (done) break;
		}
		if (!complete) throw new Error('The connection ended before the response finished. Try again.');
	} finally {
		await reader.cancel().catch(() => {});
		reader.releaseLock();
	}
}
