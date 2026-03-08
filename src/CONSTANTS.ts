const EMAIL = "oliver.markey@outlook.com"
const LINKEDIN = "https://www.linkedin.com/in/oliver-markey-9a462a247/"

export const APP_CONSTANTS = {
	email: {
		label: 'Email',
		href: `mailto:${EMAIL}`,
		note: EMAIL,
	},
	github: {
		label: 'GitHub',
		href: 'https://github.com/ollymarkey',
		note: '@ollymarkey',
		external: true,
	},
	linkedin: {
		label: 'LinkedIn',
		href: LINKEDIN,
		note: 'Professional profile',
		external: true,
	},
} as const;
