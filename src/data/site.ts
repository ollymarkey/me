import { APP_CONSTANTS } from '../CONSTANTS';

export interface LinkItem {
	label: string;
	href: string;
	note: string;
	external?: boolean;
}

export const siteConfig = {
	name: 'Olly Markey',
	defaultTitle: 'Olly Markey',
	description:
		'An AI-native fullstack developer portfolio built like a notebook: selected work, writing, and practical systems thinking across product, platform, and interface.',
	siteUrl: undefined as string | undefined,
	ogImage: '/og-cover.svg',
	location: 'Melbourne, Australia',
	availability: 'Building enterprise SaaS for Lexin Solutions',
	email: APP_CONSTANTS.email.note,
	hero: {
		headline: 'AI-native fullstack developer focused on clarity and craft.',
		summary: 'Building products across frontend, backend, and AI-assisted workflows without losing maintainability.',
		focus: 'Fullstack product engineering, AI workflows & content systems',
		primaryCta: {
			label: 'Read the blog',
			href: '/blog',
		},
		secondaryCta: {
			label: 'Get in touch',
			href: '#contact',
		},
	},
	principles: [
		'Fast, readable defaults.',
		'Interaction when it adds value.',
		'Systems that simplify shipping.',
	],
	contactMessage:
		'The easiest way to start a conversation is email. If you already know the shape of the project, include timelines, scope, and the team context.',
} as const;

export const socialLinks: LinkItem[] = [
	{
		...APP_CONSTANTS.email,
	},
	{
		...APP_CONSTANTS.github,
	},
	{
		...APP_CONSTANTS.linkedin,
	},
];
