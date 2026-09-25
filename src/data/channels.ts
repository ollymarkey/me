// Shared browser-safe types. Edit copy in workspace-content.server.ts.
export interface Prompt {
	id: string;
	label: string;
	question: string;
}

export interface Channel {
	id: string;
	name: string;
	group: 'Start here' | 'What I do' | 'Explore';
	topic: string;
	title: string;
	intro: string;
	pinned: string;
	openingMessage: string;
	prompts: Prompt[];
}

export const getChannel = (channels: Channel[], id: string) => channels.find((channel) => channel.id === id);
