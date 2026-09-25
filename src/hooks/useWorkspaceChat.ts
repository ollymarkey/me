import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { Channel, Prompt } from '../data/channels';
import { chatReducer } from '../lib/chat/reducer';
import { consumeStream } from '../lib/chat/stream';
import { useConversationStorage } from './useConversationStorage';

interface ActiveRequest {
	controller: AbortController;
	channelId: string;
	requestId: string;
}

function responseError(error: unknown, timedOut: boolean, aborted: boolean) {
	if (timedOut) return 'That took too long. Please try again.';
	if (aborted) return undefined;
	return error instanceof Error ? error.message : 'Couldn’t finish the response. Please try again.';
}

export function useWorkspaceChat(channels: Channel[], announce: (message: string) => void) {
	const [histories, dispatch] = useReducer(chatReducer, {});
	const active = useRef<ActiveRequest | null>(null);
	const { ready, storageNotice } = useConversationStorage(channels, histories, dispatch);

	useEffect(() => () => active.current?.controller.abort(), []);

	const stop = useCallback(() => {
		if (!active.current) return;
		const request = active.current;
		active.current = null;
		request.controller.abort();
		dispatch({ type: 'interrupt', channelId: request.channelId, requestId: request.requestId });
		announce('Response stopped. Retry is available.');
	}, [announce]);

	function clear(channelId: string) {
		dispatch({ type: 'clear', channelId });
		announce('Channel conversation cleared.');
	}

	async function ask(channelId: string, prompt: Prompt, retry = false) {
		if (active.current || !ready) return;
		if (!retry && histories[channelId]?.some((item) => item.promptId === prompt.id)) return;

		// getRandomValues also works on HTTP previews opened from another device.
		const requestId = Array.from(crypto.getRandomValues(new Uint8Array(16)),
			(byte) => byte.toString(16).padStart(2, '0'),
		).join('');
		const controller = new AbortController();
		active.current = { controller, channelId, requestId };
		dispatch({
			type: 'ask',
			channelId,
			exchange: {
				id: requestId,
				promptId: prompt.id,
				question: prompt.question,
				text: '',
				status: 'connecting',
				links: [],
			},
		});
		announce('Getting your response.');

		let timedOut = false;
		const timeout = setTimeout(() => {
			timedOut = true;
			controller.abort();
		}, 20_000);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ channelId, promptId: prompt.id, requestId }),
				signal: controller.signal,
			});
			await consumeStream(response, requestId, (event) => {
				if (active.current?.requestId === requestId) {
					dispatch({ type: 'event', channelId, event });
				}
			});
			if (active.current?.requestId === requestId) {
				announce('Response complete. Choose another question to explore further.');
			}
		} catch (error) {
			if (active.current?.requestId === requestId) {
				const message = responseError(error, timedOut, controller.signal.aborted);
				dispatch({ type: 'interrupt', channelId, requestId, error: message });
				announce(message || 'Response stopped.');
			}
		} finally {
			clearTimeout(timeout);
			if (active.current?.requestId === requestId) active.current = null;
		}
	}

	return { histories, ready, storageNotice, ask, stop, clear };
}
