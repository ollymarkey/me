import { channelContent } from '../../data/workspace-content.server';
import type { Channel } from '../../data/channels';
import type { Answer } from './types';

// Explicitly project public fields so response content never reaches island props.
const visibleChannels = Object.entries(channelContent).filter(([, channel]) => !channel.hidden);
export const channels: Channel[] = visibleChannels.map(([id, channel]) => ({
	id,
	name: channel.name,
	group: channel.group,
	topic: channel.topic,
	title: channel.title,
	intro: channel.intro,
	pinned: channel.pinned,
	openingMessage: channel.openingMessage,
	mode: channel.mode,
	prompts: channel.prompts.map(({ id, label, question }) => ({ id, label, question })),
}));

export const answers: Record<string, Record<string, Answer>> = Object.fromEntries(
	visibleChannels.map(([id, channel]) => {
		const seen = new Set<string>();
		const entries = channel.prompts.flatMap((prompt) => {
			if (seen.has(prompt.id)) {
				throw new Error(`Duplicate prompt: ${id}/${prompt.id}`);
			}
			seen.add(prompt.id);
			if (channel.mode === 'showcase') {
				if (!prompt.example) throw new Error(`Missing example: ${id}/${prompt.id}`);
				return [];
			}
			if (!prompt.response?.text.trim()) {
				throw new Error(`Missing answer: ${id}/${prompt.id}`);
			}
			return [[prompt.id, prompt.response]];
		});
		return [id, Object.fromEntries(entries)];
	}),
);
