import { APP_CONSTANTS } from '../CONSTANTS';

export interface LinkItem {
	label: string;
	href: string;
	note: string;
	external?: boolean;
}

// Product details verified against https://lexin-ai.com/mili.
const currentWork = {
	product: 'MiLi',
	company: 'Lexin Solutions',
	href: 'https://lexin-ai.com/mili',
	description: 'MiLi is an indirect material supply chain platform focused on the data and business processes behind maintenance, repair, and operations (MRO) supply chains.',
	features: 'Its tools cover material search, creation and extension, bulk data enrichment, and duplicate monitoring. It also supports inventory planning with reorder point and reorder quantity calculators, lead time calculations, and criticality assessments.',
};

export const siteConfig = {
	name: 'Olly Markey',
	avatar: '/apple-touch-icon.png',
	shortRole: 'Fullstack developer',
	role: 'AI-native fullstack developer',
	bio: 'Building across product, platform, and interface. With clarity and craft.',
	currentWork,
	defaultTitle: 'Olly Markey',
	description:
		'An AI-native fullstack developer portfolio: selected work and practical systems thinking across product, platform, and interface.',
	siteUrl: undefined as string | undefined,
	ogImage: '/og-cover.svg',
	location: 'Melbourne, Australia',
	availability: `Building ${currentWork.product} for ${currentWork.company}`,
	email: APP_CONSTANTS.email.note,
	hero: {
		headline: 'AI-native fullstack developer focused on clarity and craft.',
		summary: 'Building products across frontend, backend, and AI-assisted workflows without losing maintainability.',
		focus: 'Fullstack product engineering, AI workflows & content systems',
		primaryCta: {
			label: 'Explore my work',
			href: '/projects',
		},
		secondaryCta: {
			label: 'Get in touch',
			href: '/contact',
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
