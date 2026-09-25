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
	prompts: Prompt[];
}

export const channels: Channel[] = [
	{
		id: 'welcome', name: 'welcome', group: 'Start here',
		topic: 'A good place to start',
		title: 'Hey, I’m Olly. Make yourself at home.',
		intro: 'I’m an AI-native fullstack developer building across product, platform, and interface. This is my little corner of the internet, built as a workspace you can explore.',
		pinned: 'Pick a channel. Choose a question. Get to know the person behind the code.',
		prompts: [
			{ id: 'hello', label: 'The quick introduction', question: 'Give me the quick introduction.' },
			{ id: 'explore', label: 'Show me around', question: 'What can I explore here?' },
			{ id: 'this-site', label: 'About this workspace', question: 'How does this workspace work?' },
		],
	},
	{
		id: 'about-me', name: 'about-me', group: 'Start here',
		topic: 'The person behind the work', title: 'A bit about me.',
		intro: 'Based in Melbourne, Australia. Building enterprise SaaS for Lexin Solutions, with a focus on clear interfaces, maintainable systems, and practical AI workflows.',
		pinned: 'Fast, readable defaults. Interaction when it adds value. Systems that simplify shipping.',
		prompts: [
			{ id: 'now', label: 'What I’m working on', question: 'What are you focused on right now?' },
			{ id: 'principles', label: 'My working principles', question: 'What principles guide your work?' },
			{ id: 'focus', label: 'Where my interests overlap', question: 'How do frontend, backend, and AI fit together for you?' },
		],
	},
	{
		id: 'frontend', name: 'frontend', group: 'What I do',
		topic: 'Interfaces that feel considered', title: 'The details are the interface.',
		intro: 'Clear structure, useful interaction, and attention to the states between clicking a button and getting a result. This workspace is a working example.',
		pinned: 'Try a prompt to see streaming, cancellation, and conversation state in action.',
		prompts: [
			{ id: 'streaming', label: 'Building a streaming UI', question: 'How does this streaming interface work?' },
			{ id: 'accessibility', label: 'Making it accessible', question: 'How is accessibility handled in this workspace?' },
			{ id: 'state', label: 'Managing conversation state', question: 'How do you keep channel conversations separate?' },
		],
	},
	{
		id: 'backend', name: 'backend', group: 'What I do',
		topic: 'The systems behind the interface', title: 'A small API. A clear contract.',
		intro: 'Fullstack work connects what a visitor sees with the system delivering it. Here, a small streaming endpoint makes that connection tangible.',
		pinned: 'This site uses an Astro endpoint on Node to stream prepared responses.',
		prompts: [
			{ id: 'api', label: 'Inside the endpoint', question: 'What happens when I select a prompt?' },
			{ id: 'reliability', label: 'Handling interruptions', question: 'What happens if a response is interrupted?' },
			{ id: 'stack', label: 'The backend stack', question: 'What powers the backend of this site?' },
		],
	},
	{
		id: 'ai-workflows', name: 'ai-workflows', group: 'What I do',
		topic: 'Practical AI, thoughtful interfaces', title: 'AI-native. Human-considered.',
		intro: 'My focus includes AI-assisted workflows and the interfaces around them. The goal is to help people move from a question to something useful, without losing clarity or maintainability.',
		pinned: 'These are prepared responses, streamed over the network. No live model is generating them.',
		prompts: [
			{ id: 'approach', label: 'My approach to AI', question: 'Where does AI fit into your work?' },
			{ id: 'authored', label: 'Why prepared responses?', question: 'Why use prepared answers instead of a live model?' },
			{ id: 'model', label: 'Connecting a live model', question: 'How could this interface connect to a live model?' },
		],
	},
	{
		id: 'projects', name: 'projects', group: 'Explore',
		topic: 'Work, decisions, and the code behind them', title: 'You’re already exploring one.',
		intro: 'This personal workspace brings together content, frontend state, and a streaming API. Start with the project in front of you; more case studies will follow.',
		pinned: 'Featured project: this workspace. Built with Astro, React, TypeScript, and native CSS.',
		prompts: [
			{ id: 'walkthrough', label: 'Walk through this project', question: 'Walk me through this personal workspace.' },
			{ id: 'decisions', label: 'The technical decisions', question: 'Why choose this stack for a personal site?' },
			{ id: 'more', label: 'More of my work', question: 'Where can I see more of your work?' },
		],
	},
	{
		id: 'writing', name: 'writing', group: 'Explore',
		topic: 'Notes on building things', title: 'Room for a longer conversation.',
		intro: 'A place for writing about fullstack architecture, AI-native tooling, and the small decisions that make software feel finished. The blog is just getting started.',
		pinned: 'The blog is a separate reading space. You can return here whenever you like.',
		prompts: [
			{ id: 'topics', label: 'What I’ll write about', question: 'What topics will you write about?' },
			{ id: 'blog', label: 'Visit the blog', question: 'Where can I read your writing?' },
			{ id: 'publishing', label: 'How publishing works', question: 'How is the blog built?' },
		],
	},
	{
		id: 'contact', name: 'contact', group: 'Explore',
		topic: 'Take the conversation further', title: 'Have something in mind?',
		intro: 'For product, platform, or AI-enabled build work, email is the easiest way to start a real conversation. Tell me a little about what you’re building.',
		pinned: 'Messages here stay in your browser tab. To reach me directly, use email or LinkedIn.',
		prompts: [
			{ id: 'reach', label: 'Get in touch', question: 'What’s the best way to contact you?' },
			{ id: 'brief', label: 'What to include', question: 'What should I include in a project introduction?' },
			{ id: 'links', label: 'Find me elsewhere', question: 'Where else can I find you?' },
		],
	},
];

export const getChannel = (id: string) => channels.find((channel) => channel.id === id);
