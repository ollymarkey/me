import { expect, test } from 'bun:test';
import { channels, answers } from '../../src/lib/chat/answers.server';

test('public channel props exclude prepared answer text and attachments', () => {
	const serialized = JSON.stringify(channels);
	for (const channel of channels) {
		for (const prompt of channel.prompts) {
			expect(Object.keys(prompt).sort()).toEqual(['id', 'label', 'question']);
			if (channel.mode !== 'showcase') {
				expect(serialized).not.toContain(JSON.stringify(answers[channel.id][prompt.id].text));
			}
		}
	}
	expect(serialized).not.toContain('"response":');
	expect(serialized).not.toContain('"links":');
});

test('hidden writing content is excluded from workspace metadata and answers', () => {
	expect(channels.some((channel) => channel.id === 'writing')).toBe(false);
	expect(answers.writing).toBeUndefined();
	expect(JSON.stringify({ channels, answers })).not.toMatch(/blog|\/writing/i);
});
