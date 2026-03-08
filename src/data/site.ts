export interface LinkItem {
	label: string;
	href: string;
	note: string;
	external?: boolean;
}

export const siteConfig = {
	name: 'Olly Markey',
	defaultTitle: 'Olly Markey | Portfolio and Journal',
	description:
		'An AI-native fullstack developer portfolio built like a notebook: selected work, writing, and practical systems thinking across product, platform, and interface.',
	siteUrl: undefined as string | undefined,
	ogImage: '/og-cover.svg',
	location: 'Melbourne, Australia',
	availability: 'Open to work',
	email: 'hello@ollymarkey.dev',
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
		label: 'Email',
		href: `mailto:${siteConfig.email}`,
		note: siteConfig.email,
	},
	{
		label: 'GitHub',
		href: 'https://github.com/ollymarkey',
		note: '@ollymarkey',
		external: true,
	},
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com',
		note: 'Professional profile',
		external: true,
	},
];
