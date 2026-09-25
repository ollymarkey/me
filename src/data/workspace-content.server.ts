import { APP_CONSTANTS } from '../CONSTANTS';
import type { Channel, Prompt } from './channels';
import type { Answer } from '../lib/chat/types';

interface ChannelContent extends Omit<Channel, 'id' | 'prompts'> {
	prompts: (Prompt & { response: Answer })[];
}

// Edit channel copy here. Keep channel keys and prompt IDs stable for saved histories.
// Response text uses blank lines between paragraphs. Answers stay server-only.
const github = { label: 'Explore my GitHub', href: APP_CONSTANTS.github.href, detail: 'Repositories and code' };
const linkedin = { label: 'Find me on LinkedIn', href: APP_CONSTANTS.linkedin.href, detail: 'Professional profile' };
const email = { label: 'Get in touch', href: APP_CONSTANTS.email.href, detail: APP_CONSTANTS.email.note };
const blog = { label: 'Read the blog', href: '/blog', detail: 'Notes on building software' };

export const channelContent: Record<string, ChannelContent> = {
	welcome: {
		name: 'welcome',
		group: 'Start here',
		topic: 'A good place to start',
		title: 'Hey, I’m Olly. Make yourself at home.',
		intro: 'I’m an AI-native fullstack developer building across product, platform, and interface. This is my little corner of the internet, built as a workspace you can explore.',
		pinned: 'Pick a channel. Choose a question. Get to know the person behind the code.',
		openingMessage: 'Glad you’re here. Think of this as a guided conversation, at your own pace. Pick a question below and let’s start there.',
		prompts: [
			{
				id: 'hello',
				label: 'The quick introduction',
				question: 'Give me the quick introduction.',
				response: {
					text: `I’m Olly Markey, an AI-native fullstack developer based in Melbourne, Australia. I’m currently building enterprise SaaS for Lexin Solutions.

My focus spans frontend, backend, and AI-assisted workflows. The common thread is clarity: readable code, useful interfaces, and systems that make shipping easier.

This workspace is a different way to get to know me. Choose a topic from the sidebar and follow what interests you.`,
				},
			},
			{
				id: 'explore',
				label: 'Show me around',
				question: 'What can I explore here?',
				response: {
					text: `Start with about-me for my background and working principles. The frontend, backend, and ai-workflows channels break down the thinking behind this site and my areas of focus.

Projects starts with the workspace you’re using right now. Writing leads to the blog, and contact has everything you need to start a real conversation.

Each channel has a few questions to choose from. There’s no wrong order.`,
				},
			},
			{
				id: 'this-site',
				label: 'About this workspace',
				question: 'How does this workspace work?',
				response: {
					text: `This is a personal portfolio arranged like a workspace. Instead of typing into a chatbot, you choose a question and receive a prepared response.

The answer is streamed from a server, so the interface handles real network chunks, cancellation, and interrupted responses. It isn’t a live AI model or a live conversation with me.

Your conversations stay in this browser tab. Switch channels to explore another topic, or use contact to reach me directly.`,
				},
			},
		],
	},
	'about-me': {
		name: 'about-me',
		group: 'Start here',
		topic: 'The person behind the work',
		title: 'A bit about me.',
		intro: 'Based in Melbourne, Australia. Building enterprise SaaS for Lexin Solutions, with a focus on clear interfaces, maintainable systems, and practical AI workflows.',
		pinned: 'Fast, readable defaults. Interaction when it adds value. Systems that simplify shipping.',
		openingMessage: 'Curious about about me? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'now',
				label: 'What I’m working on',
				question: 'What are you focused on right now?',
				response: {
					text: `I’m based in Melbourne and currently building enterprise SaaS for Lexin Solutions.

My focus is fullstack product engineering, AI workflows, and content systems. I’m interested in how those pieces fit together: a clear interface, a reliable backend, and a workflow that helps a team ship maintainable software.`,
				},
			},
			{
				id: 'principles',
				label: 'My working principles',
				question: 'What principles guide your work?',
				response: {
					text: `Three principles run through this site and the way I describe my work:

Fast, readable defaults. Start with something understandable and build on it.

Interaction when it adds value. An animation or extra step should help someone understand what’s happening.

Systems that simplify shipping. The architecture should support the work, rather than become the work.`,
				},
			},
			{
				id: 'focus',
				label: 'Where my interests overlap',
				question: 'How do frontend, backend, and AI fit together for you?',
				response: {
					text: `My focus sits across product, platform, and interface. Frontend work shapes how a system feels. Backend work makes the behavior dependable. AI-assisted workflows can help connect ideas to implementation.

This site brings those interests together in a small, tangible example: a browsable portfolio with a stateful interface and a real streaming response path.`,
				},
			},
		],
	},
	frontend: {
		name: 'frontend',
		group: 'What I do',
		topic: 'Interfaces that feel considered',
		title: 'The details are the interface.',
		intro: 'Clear structure, useful interaction, and attention to the states between clicking a button and getting a result. This workspace is a working example.',
		pinned: 'Try a prompt to see streaming, cancellation, and conversation state in action.',
		openingMessage: 'Curious about frontend? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'streaming',
				label: 'Building a streaming UI',
				question: 'How does this streaming interface work?',
				response: {
					text: `Selecting a prompt adds your question immediately, then opens a POST request to the chat endpoint. The browser reads incoming events and appends text to the matching response.

The interesting part is the behavior around that stream. Stop cancels it. Retry replaces an interrupted answer. Switching channels keeps histories separate and prevents late chunks from appearing in the wrong place.

The conversation follows new text only while you’re near the bottom. If you scroll back to read, it waits for you.`,
				},
			},
			{
				id: 'accessibility',
				label: 'Making it accessible',
				question: 'How is accessibility handled in this workspace?',
				response: {
					text: `Channel links and prompt buttons use native keyboard behavior, with visible focus indicators. On smaller screens, the channel drawer traps focus while it’s open and returns focus when it closes.

Response status is announced separately from the streaming text, so a screen reader isn’t interrupted by every chunk. Reduced-motion preferences disable animated movement and smooth scrolling.

The goal is the same in light and dark mode: readable content, clear controls, and no information available only on hover.`,
				},
			},
			{
				id: 'state',
				label: 'Managing conversation state',
				question: 'How do you keep channel conversations separate?',
				response: {
					text: `Each channel has its own list of question-and-answer exchanges. A reducer handles response events, and every stream carries a request ID so outdated events can be ignored.

Only one response runs at a time. Changing channels cancels the active request and preserves the partial answer as interrupted.

Histories are saved to session storage in this browser tab. On refresh, an unfinished answer becomes interrupted with a Retry action instead of getting stuck in a loading state.`,
				},
			},
		],
	},
	backend: {
		name: 'backend',
		group: 'What I do',
		topic: 'The systems behind the interface',
		title: 'A small API. A clear contract.',
		intro: 'Fullstack work connects what a visitor sees with the system delivering it. Here, a small streaming endpoint makes that connection tangible.',
		pinned: 'This site uses an Astro endpoint on Node to stream prepared responses.',
		openingMessage: 'Curious about backend? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'api',
				label: 'Inside the endpoint',
				question: 'What happens when I select a prompt?',
				response: {
					text: `The browser sends a channel ID, prompt ID, and request ID. The server checks that the selected prompt belongs to that channel, then looks up the prepared answer.

It returns a stream of start, delta, and complete events. The final event can include relevant links. The client buffers partial event frames, because network chunks don’t always line up with message boundaries.

The request contains identifiers, not an arbitrary question or a client-supplied answer.`,
				},
			},
			{
				id: 'reliability',
				label: 'Handling interruptions',
				question: 'What happens if a response is interrupted?',
				response: {
					text: `The interface distinguishes connecting, streaming, complete, interrupted, and error states. A connection that ends before its completion event is treated as interrupted.

Stop and channel changes abort the request. Partial text remains available, and Retry starts a replacement response without posting your question twice.

A timeout also ends the attempt with a useful retry state. The goal is to make failure understandable, not hide it behind an endless typing indicator.`,
				},
			},
			{
				id: 'stack',
				label: 'The backend stack',
				question: 'What powers the backend of this site?',
				response: {
					text: `Astro serves the site, with its Node adapter providing the runtime for the streaming endpoint. The blog and homepage can still be generated as static pages; the chat API runs on demand.

Answers live in a server-side TypeScript content module. There’s no database or account system for this experience, because the content is curated and conversation history belongs to the visitor’s browser tab.

Bun handles dependency management and development commands.`,
				},
			},
		],
	},
	'ai-workflows': {
		name: 'ai-workflows',
		group: 'What I do',
		topic: 'Practical AI, thoughtful interfaces',
		title: 'AI-native. Human-considered.',
		intro: 'My focus includes AI-assisted workflows and the interfaces around them. The goal is to help people move from a question to something useful, without losing clarity or maintainability.',
		pinned: 'These are prepared responses, streamed over the network. No live model is generating them.',
		openingMessage: 'Curious about ai workflows? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'approach',
				label: 'My approach to AI',
				question: 'Where does AI fit into your work?',
				response: {
					text: `AI-assisted workflows are part of my fullstack focus. The aim is to build useful products without losing maintainability or clear thinking about the system.

This workspace explores the interface side of that: guiding a question, showing incremental progress, and making interruptions recoverable. Those details matter whether the response comes from an authored source or a model.

More detailed workflow examples will be added as write-ups.`,
				},
			},
			{
				id: 'authored',
				label: 'Why prepared responses?',
				question: 'Why use prepared answers instead of a live model?',
				response: {
					text: `A portfolio should be accurate about the person behind it. Prepared answers make the content predictable and easy to review, while a real streaming endpoint still demonstrates the interaction work.

That includes loading states, cancellation, incremental rendering, channel history, and error recovery.

It’s deliberately a guided experience. The questions are curated, the responses are prepared, and nothing implies that I’m personally typing on the other side.`,
				},
			},
			{
				id: 'model',
				label: 'Connecting a live model',
				question: 'How could this interface connect to a live model?',
				response: {
					text: `The UI and transport are separate. A model-backed endpoint could keep the same start, delta, and complete events while changing how answer text is produced.

The server would resolve the selected prompt, provide approved profile and project material as context, and stream the model’s response. Provider credentials would remain server-side.

That extension would also need output limits, request limits, and a prepared fallback. The interface would clearly identify generated answers.`,
				},
			},
		],
	},
	projects: {
		name: 'projects',
		group: 'Explore',
		topic: 'Work, decisions, and the code behind them',
		title: 'You’re already exploring one.',
		intro: 'This personal workspace brings together content, frontend state, and a streaming API. Start with the project in front of you; more case studies will follow.',
		pinned: 'Featured project: this workspace. Built with Astro, React, TypeScript, and native CSS.',
		openingMessage: 'Curious about projects? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'walkthrough',
				label: 'Walk through this project',
				question: 'Walk me through this personal workspace.',
				response: {
					text: `This project turns a personal site into a guided workspace. Channels organize the content, and selected prompts turn browsing into a short conversation.

Astro handles the pages and blog. A React island owns the interactive workspace. A Node-backed endpoint streams prepared responses, with native CSS providing the shared visual system.

The most useful details are easy to miss: independent histories, stale-request protection, retry behavior, keyboard navigation, and a scroll position that doesn’t fight the reader.`,
				},
			},
			{
				id: 'decisions',
				label: 'The technical decisions',
				question: 'Why choose this stack for a personal site?',
				response: {
					text: `The site already used Astro, so the implementation builds on that foundation. Static content stays lightweight, and React is introduced where the workspace needs coordinated state.

Native CSS keeps the visual system explicit. A small reducer is enough for conversation state, and session storage handles tab-local persistence.

Prepared responses keep the content grounded. The streaming boundary is separate so the answer source can evolve later without redesigning the interface.`,
				},
			},
			{
				id: 'more',
				label: 'More of my work',
				question: 'Where can I see more of your work?',
				response: {
					text: `GitHub is the best place to explore more of my code, and LinkedIn has my professional profile.

Detailed project case studies are still being assembled for this site. For now, this workspace is the featured example. If you’d like to discuss a particular kind of work, send me a note.`,
					links: [github, linkedin],
				},
			},
		],
	},
	writing: {
		name: 'writing',
		group: 'Explore',
		topic: 'Notes on building things',
		title: 'Room for a longer conversation.',
		intro: 'A place for writing about fullstack architecture, AI-native tooling, and the small decisions that make software feel finished. The blog is just getting started.',
		pinned: 'The blog is a separate reading space. You can return here whenever you like.',
		openingMessage: 'Curious about writing? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'topics',
				label: 'What I’ll write about',
				question: 'What topics will you write about?',
				response: {
					text: `The blog is intended for notes on Astro workflows, AI-native tooling, fullstack architecture, and the interface decisions that make software feel finished.

It’s just getting started. The aim is to explain decisions with enough context to be useful, rather than simply list tools.`,
					links: [blog],
				},
			},
			{
				id: 'blog',
				label: 'Visit the blog',
				question: 'Where can I read your writing?',
				response: {
					text: `The blog has its own reading space, separate from this workspace. It’s currently getting started, so the existing first-post entry is a placeholder rather than a finished article.

You can browse it below, then return to the workspace through the site name.`,
					links: [blog],
				},
			},
			{
				id: 'publishing',
				label: 'How publishing works',
				question: 'How is the blog built?',
				response: {
					text: `Posts are Markdown files in the Astro content collection. Frontmatter supplies the title, description, publication date, tags, and optional hero image.

Drafts are excluded from public listings and generated article pages. The blog has individual article URLs, so writing can be shared and read independently of the workspace.`,
					links: [blog],
				},
			},
		],
	},
	contact: {
		name: 'contact',
		group: 'Explore',
		topic: 'Take the conversation further',
		title: 'Have something in mind?',
		intro: 'For product, platform, or AI-enabled build work, email is the easiest way to start a real conversation. Tell me a little about what you’re building.',
		pinned: 'Messages here stay in your browser tab. To reach me directly, use email or LinkedIn.',
		openingMessage: 'Curious about contact? I’ve put together a few questions below. Pick one to take a closer look.',
		prompts: [
			{
				id: 'reach',
				label: 'Get in touch',
				question: 'What’s the best way to contact you?',
				response: {
					text: `Email is the easiest way to start a real conversation. You can reach me at oliver.markey@outlook.com.

If you already know the shape of a project, include the scope, timeline, and a little about the team. That gives us a useful place to start.

The prompt messages in this workspace aren’t sent to me, so use the email link below to get in touch.`,
					links: [email],
				},
			},
			{
				id: 'brief',
				label: 'What to include',
				question: 'What should I include in a project introduction?',
				response: {
					text: `A short introduction is enough. Tell me what you’re building, who it’s for, and where you’d like help.

If you have them, include your timeline, the current scope, and the team context. Product, platform, and AI-enabled work are all useful starting points for a conversation.`,
					links: [email],
				},
			},
			{
				id: 'links',
				label: 'Find me elsewhere',
				question: 'Where else can I find you?',
				response: {
					text: 'You can find my code on GitHub and my professional profile on LinkedIn. For a direct conversation, email is the simplest route.',
					links: [github, linkedin, email],
				},
			},
		],
	},
};
