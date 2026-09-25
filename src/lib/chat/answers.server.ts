import { channelContent } from '../../data/workspace-content.server';
import type { Channel } from '../../data/channels';
import type { Answer } from './types';

// Explicitly project public fields so response content never reaches island props.
export const channels: Channel[] = Object.entries(channelContent).map(([id, channel]) => ({
	id,
	name: channel.name,
	group: channel.group,
	topic: channel.topic,
	title: channel.title,
	intro: channel.intro,
	pinned: channel.pinned,
	openingMessage: channel.openingMessage,
	prompts: channel.prompts.map(({ id, label, question }) => ({ id, label, question })),
}));

export const answers: Record<string, Record<string, Answer>> = Object.fromEntries(
	Object.entries(channelContent).map(([id, channel]) => {
		const seen = new Set<string>();
		const entries = channel.prompts.map((prompt) => {
			if (seen.has(prompt.id) || !prompt.response.text.trim()) {
				throw new Error(`Duplicate prompt or missing answer: ${id}/${prompt.id}`);
			}
			seen.add(prompt.id);
			return [prompt.id, prompt.response];
		});
		return [id, Object.fromEntries(entries)];
	}),
);
