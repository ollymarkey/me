export interface ResponseLink {
	label: string;
	href: string;
	detail?: string;
}

export interface Answer {
	text: string;
	links?: ResponseLink[];
}

export type MessageStatus = 'connecting' | 'streaming' | 'complete' | 'interrupted' | 'error';

export interface Exchange {
	id: string;
	promptId: string;
	question: string;
	text: string;
	status: MessageStatus;
	links: ResponseLink[];
	error?: string;
}

export type Histories = Record<string, Exchange[]>;

export type StreamEvent =
	| { type: 'start'; requestId: string }
	| { type: 'delta'; requestId: string; text: string }
	| { type: 'complete'; requestId: string; links: ResponseLink[] }
	| { type: 'error'; requestId: string; message: string };
