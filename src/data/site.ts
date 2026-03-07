export interface LinkItem {
	label: string;
	href: string;
	note: string;
	external?: boolean;
}

export interface Project {
	title: string;
	year: string;
	status: string;
	summary: string;
	outcome: string;
	stack: string[];
	links: LinkItem[];
}

export interface SkillGroup {
	title: string;
	items: string[];
}

export const siteConfig = {
	name: 'Olly Markey',
	defaultTitle: 'Olly Markey | Portfolio and Journal',
	description:
		'A monochrome Astro portfolio built like a notebook: selected work, writing, and a content-first front-end foundation.',
	siteUrl: undefined as string | undefined,
	ogImage: '/og-cover.svg',
	location: 'Sydney, Australia',
	availability: 'Available for focused product and front-end work',
	email: 'hello@ollymarkey.dev',
	hero: {
		eyebrow: 'Portfolio / Volume 01',
		headline: 'Clear interfaces, structured content, and room to experiment.',
		summary:
			'I build front ends that balance editorial polish with practical systems thinking, starting simple in Astro and leaving clean seams for richer interactions later.',
		focus: 'Astro-first portfolio systems, content architecture, and modern front-end craft',
		primaryCta: {
			label: 'View selected work',
			href: '#projects',
		},
		secondaryCta: {
			label: 'Read the blog',
			href: '/blog',
		},
	},
	about: [
		'I care about the parts of front-end work that make a site easier to understand and easier to change: hierarchy, pacing, component boundaries, and the way content moves through the system.',
		'This first version of the portfolio keeps those decisions visible. The structure is deliberately modular so future islands, experiments, and case-study interactions can be added without rebuilding the shell.',
	],
	principles: [
		'Keep the default experience fast and readable.',
		'Choose interaction only when it improves understanding.',
		'Design systems should reduce decision fatigue, not add ceremony.',
		'Content models should be as intentional as the visual layer.',
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

export const featuredProjects: Project[] = [
	{
		title: 'Editorial Commerce Redesign',
		year: '2025',
		status: 'Shipped',
		summary:
			'Reframed a dense storefront into a calmer editorial product page system with clearer hierarchy, reusable blocks, and faster publishing workflows.',
		outcome: 'Reduced page assembly friction and gave marketing a layout system they could use without redesigning each campaign.',
		stack: ['Astro', 'TypeScript', 'Content Modeling', 'Design Systems'],
		links: [],
	},
	{
		title: 'Component Library Reset',
		year: '2024',
		status: 'In Use',
		summary:
			'Aligned design tokens, documentation, and component APIs so teams could ship across multiple properties without local one-off styling.',
		outcome: 'Turned scattered UI patterns into a consistent implementation surface with cleaner handoffs between product, design, and engineering.',
		stack: ['Design Tokens', 'Storybook', 'Accessibility', 'CSS Architecture'],
		links: [],
	},
	{
		title: 'Content Platform Migration',
		year: '2024',
		status: 'Delivered',
		summary:
			'Migrated a content-heavy experience onto a more structured publishing model with clearer metadata, modular page sections, and better editorial resilience.',
		outcome: 'Made content changes safer and faster by defining stronger schemas and reducing layout-specific authoring decisions.',
		stack: ['Schema Design', 'CMS Strategy', 'Astro', 'Front-End Systems'],
		links: [],
	},
];

export const skillGroups: SkillGroup[] = [
	{
		title: 'Front-End Systems',
		items: ['Astro', 'TypeScript', 'HTML Semantics', 'CSS Architecture', 'Responsive Design'],
	},
	{
		title: 'Content And Structure',
		items: ['Content Collections', 'Information Architecture', 'Editorial UX', 'Metadata Strategy'],
	},
	{
		title: 'Product Delivery',
		items: ['Design Systems', 'Component APIs', 'Accessibility Reviews', 'Implementation Planning'],
	},
];
