import { getChannel, type Channel } from '../../data/channels';
import type { Exchange, Histories, StreamEvent } from './types';

export type Action =
	| { type: 'restore'; histories: Histories }
	| { type: 'ask'; channelId: string; exchange: Exchange }
	| { type: 'event'; channelId: string; event: StreamEvent }
	| { type: 'interrupt'; channelId: string; requestId: string; error?: string }
	| { type: 'clear'; channelId: string };

export function chatReducer(state: Histories, action: Action): Histories {
	if (action.type === 'restore') return action.histories;
	if (action.type === 'clear') return { ...state, [action.channelId]: [] };
	const history = state[action.channelId] ?? [];
	if (action.type === 'ask') {
		const existing = history.findIndex((item) => item.promptId === action.exchange.promptId);
		return { ...state, [action.channelId]: existing < 0
			? [...history, action.exchange]
			: history.map((item, index) => index === existing ? action.exchange : item) };
	}
	const id = action.type === 'event' ? action.event.requestId : action.requestId;
	return { ...state, [action.channelId]: history.map((item) => {
		if (item.id !== id || !['connecting', 'streaming'].includes(item.status)) return item;
		if (action.type === 'interrupt') return { ...item, status: action.error ? 'error' : 'interrupted', error: action.error };
		const event = action.event;
		switch (event.type) {
			case 'start': return { ...item, status: 'streaming' };
			case 'delta': return { ...item, text: item.text + event.text, status: 'streaming' };
			case 'complete': return { ...item, status: 'complete', links: event.links };
			case 'error': return { ...item, status: 'error', error: event.message };
		}
	}) };
}

export const STORAGE_KEY = 'olly-workspace:v1';

export function restoreHistories(raw: string | null, channels: Channel[]): Histories {
	if (!raw || raw.length > 250_000) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
		const restored: Histories = {};
		for (const [channelId, value] of Object.entries(parsed)) {
			const channel = getChannel(channels, channelId);
			if (!channel || !Array.isArray(value)) continue;
			const seen = new Set<string>();
			restored[channelId] = value.flatMap((item): Exchange[] => {
				if (!item || typeof item !== 'object' || typeof item.id !== 'string' || typeof item.text !== 'string' || item.text.length > 12_000) return [];
				const prompt = channel.prompts.find((prompt) => prompt.id === item.promptId);
				if (!prompt || seen.has(prompt.id)) return [];
				seen.add(prompt.id);
				return [{ id: item.id, promptId: prompt.id, question: prompt.question, text: item.text,
					status: item.status === 'complete' ? 'complete' : 'interrupted',
					links: Array.isArray(item.links) ? item.links.filter(isSafeLink) : [] }];
			});
		}
		return restored;
	} catch { return {}; }
}

export function isSafeLink(value: unknown): value is { label: string; href: string; detail?: string } {
	if (!value || typeof value !== 'object') return false;
	const link = value as Record<string, unknown>;
	return typeof link.label === 'string' && typeof link.href === 'string'
		&& (link.detail === undefined || typeof link.detail === 'string')
		&& /^(https:\/\/|mailto:|\/(?!\/))/.test(link.href)
		&& !/[\\\u0000-\u0020]/.test(link.href);
}
