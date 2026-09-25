import { APP_CONSTANTS } from '../../CONSTANTS';
import { channels } from '../../data/channels';
import type { Answer } from './types';

// Server-only prepared copy. Keep personal claims grounded in src/data/site.ts.
// Add Olly's approved project examples here as they become available.
const github = { label: 'Explore my GitHub', href: APP_CONSTANTS.github.href, detail: 'Repositories and code' };
const email = { label: 'Get in touch', href: APP_CONSTANTS.email.href, detail: APP_CONSTANTS.email.note };
const linkedin = { label: 'Find me on LinkedIn', href: APP_CONSTANTS.linkedin.href, detail: 'Professional profile' };
const blog = { label: 'Read the blog', href: '/blog', detail: 'Notes on building software' };

export const answers: Record<string, Record<string, Answer>> = {
	welcome: {
		hello: { text: 'I’m Olly Markey, an AI-native fullstack developer based in Melbourne, Australia. I’m currently building enterprise SaaS for Lexin Solutions.\n\nMy focus spans frontend, backend, and AI-assisted workflows. The common thread is clarity: readable code, useful interfaces, and systems that make shipping easier.\n\nThis workspace is a different way to get to know me. Choose a topic from the sidebar and follow what interests you.' },
		explore: { text: 'Start with about-me for my background and working principles. The frontend, backend, and ai-workflows channels break down the thinking behind this site and my areas of focus.\n\nProjects starts with the workspace you’re using right now. Writing leads to the blog, and contact has everything you need to start a real conversation.\n\nEach channel has a few questions to choose from. There’s no wrong order.' },
		'this-site': { text: 'This is a personal portfolio arranged like a workspace. Instead of typing into a chatbot, you choose a question and receive a prepared response.\n\nThe answer is streamed from a server, so the interface handles real network chunks, cancellation, and interrupted responses. It isn’t a live AI model or a live conversation with me.\n\nYour conversations stay in this browser tab. Switch channels to explore another topic, or use contact to reach me directly.' },
	},
	'about-me': {
		now: { text: 'I’m based in Melbourne and currently building enterprise SaaS for Lexin Solutions.\n\nMy focus is fullstack product engineering, AI workflows, and content systems. I’m interested in how those pieces fit together: a clear interface, a reliable backend, and a workflow that helps a team ship maintainable software.' },
		principles: { text: 'Three principles run through this site and the way I describe my work:\n\nFast, readable defaults. Start with something understandable and build on it.\n\nInteraction when it adds value. An animation or extra step should help someone understand what’s happening.\n\nSystems that simplify shipping. The architecture should support the work, rather than become the work.' },
		focus: { text: 'My focus sits across product, platform, and interface. Frontend work shapes how a system feels. Backend work makes the behavior dependable. AI-assisted workflows can help connect ideas to implementation.\n\nThis site brings those interests together in a small, tangible example: a browsable portfolio with a stateful interface and a real streaming response path.' },
	},
	frontend: {
		streaming: { text: 'Selecting a prompt adds your question immediately, then opens a POST request to the chat endpoint. The browser reads incoming events and appends text to the matching response.\n\nThe interesting part is the behavior around that stream. Stop cancels it. Retry replaces an interrupted answer. Switching channels keeps histories separate and prevents late chunks from appearing in the wrong place.\n\nThe conversation follows new text only while you’re near the bottom. If you scroll back to read, it waits for you.' },
		accessibility: { text: 'Channel links and prompt buttons use native keyboard behavior, with visible focus indicators. On smaller screens, the channel drawer traps focus while it’s open and returns focus when it closes.\n\nResponse status is announced separately from the streaming text, so a screen reader isn’t interrupted by every chunk. Reduced-motion preferences disable animated movement and smooth scrolling.\n\nThe goal is the same in light and dark mode: readable content, clear controls, and no information available only on hover.' },
		state: { text: 'Each channel has its own list of question-and-answer exchanges. A reducer handles response events, and every stream carries a request ID so outdated events can be ignored.\n\nOnly one response runs at a time. Changing channels cancels the active request and preserves the partial answer as interrupted.\n\nHistories are saved to session storage in this browser tab. On refresh, an unfinished answer becomes interrupted with a Retry action instead of getting stuck in a loading state.' },
	},
	backend: {
		api: { text: 'The browser sends a channel ID, prompt ID, and request ID. The server checks that the selected prompt belongs to that channel, then looks up the prepared answer.\n\nIt returns a stream of start, delta, and complete events. The final event can include relevant links. The client buffers partial event frames, because network chunks don’t always line up with message boundaries.\n\nThe request contains identifiers, not an arbitrary question or a client-supplied answer.' },
		reliability: { text: 'The interface distinguishes connecting, streaming, complete, interrupted, and error states. A connection that ends before its completion event is treated as interrupted.\n\nStop and channel changes abort the request. Partial text remains available, and Retry starts a replacement response without posting your question twice.\n\nA timeout also ends the attempt with a useful retry state. The goal is to make failure understandable, not hide it behind an endless typing indicator.' },
		stack: { text: 'Astro serves the site, with its Node adapter providing the runtime for the streaming endpoint. The blog and homepage can still be generated as static pages; the chat API runs on demand.\n\nAnswers live in a server-side TypeScript content module. There’s no database or account system for this experience, because the content is curated and conversation history belongs to the visitor’s browser tab.\n\nBun handles dependency management and development commands.' },
	},
	'ai-workflows': {
		approach: { text: 'AI-assisted workflows are part of my fullstack focus. The aim is to build useful products without losing maintainability or clear thinking about the system.\n\nThis workspace explores the interface side of that: guiding a question, showing incremental progress, and making interruptions recoverable. Those details matter whether the response comes from an authored source or a model.\n\nMore detailed workflow examples will be added as write-ups.' },
		authored: { text: 'A portfolio should be accurate about the person behind it. Prepared answers make the content predictable and easy to review, while a real streaming endpoint still demonstrates the interaction work.\n\nThat includes loading states, cancellation, incremental rendering, channel history, and error recovery.\n\nIt’s deliberately a guided experience. The questions are curated, the responses are prepared, and nothing implies that I’m personally typing on the other side.' },
		model: { text: 'The UI and transport are separate. A model-backed endpoint could keep the same start, delta, and complete events while changing how answer text is produced.\n\nThe server would resolve the selected prompt, provide approved profile and project material as context, and stream the model’s response. Provider credentials would remain server-side.\n\nThat extension would also need output limits, request limits, and a prepared fallback. The interface would clearly identify generated answers.' },
	},
	projects: {
		walkthrough: { text: 'This project turns a personal site into a guided workspace. Channels organize the content, and selected prompts turn browsing into a short conversation.\n\nAstro handles the pages and blog. A React island owns the interactive workspace. A Node-backed endpoint streams prepared responses, with native CSS providing the shared visual system.\n\nThe most useful details are easy to miss: independent histories, stale-request protection, retry behavior, keyboard navigation, and a scroll position that doesn’t fight the reader.' },
		decisions: { text: 'The site already used Astro, so the implementation builds on that foundation. Static content stays lightweight, and React is introduced where the workspace needs coordinated state.\n\nNative CSS keeps the visual system explicit. A small reducer is enough for conversation state, and session storage handles tab-local persistence.\n\nPrepared responses keep the content grounded. The streaming boundary is separate so the answer source can evolve later without redesigning the interface.' },
		more: { text: 'GitHub is the best place to explore more of my code, and LinkedIn has my professional profile.\n\nDetailed project case studies are still being assembled for this site. For now, this workspace is the featured example. If you’d like to discuss a particular kind of work, send me a note.', links: [github, linkedin] },
	},
	writing: {
		topics: { text: 'The blog is intended for notes on Astro workflows, AI-native tooling, fullstack architecture, and the interface decisions that make software feel finished.\n\nIt’s just getting started. The aim is to explain decisions with enough context to be useful, rather than simply list tools.', links: [blog] },
		blog: { text: 'The blog has its own reading space, separate from this workspace. It’s currently getting started, so the existing first-post entry is a placeholder rather than a finished article.\n\nYou can browse it below, then return to the workspace through the site name.', links: [blog] },
		publishing: { text: 'Posts are Markdown files in the Astro content collection. Frontmatter supplies the title, description, publication date, tags, and optional hero image.\n\nDrafts are excluded from public listings and generated article pages. The blog has individual article URLs, so writing can be shared and read independently of the workspace.', links: [blog] },
	},
	contact: {
		reach: { text: 'Email is the easiest way to start a real conversation. You can reach me at oliver.markey@outlook.com.\n\nIf you already know the shape of a project, include the scope, timeline, and a little about the team. That gives us a useful place to start.\n\nThe prompt messages in this workspace aren’t sent to me, so use the email link below to get in touch.', links: [email] },
		brief: { text: 'A short introduction is enough. Tell me what you’re building, who it’s for, and where you’d like help.\n\nIf you have them, include your timeline, the current scope, and the team context. Product, platform, and AI-enabled work are all useful starting points for a conversation.', links: [email] },
		links: { text: 'You can find my code on GitHub and my professional profile on LinkedIn. For a direct conversation, email is the simplest route.', links: [github, linkedin, email] },
	},
};

// Fail fast during builds/server startup if content and navigation drift apart.
for (const channel of channels) {
	for (const prompt of channel.prompts) {
		if (!answers[channel.id]?.[prompt.id]?.text) throw new Error(`Missing answer: ${channel.id}/${prompt.id}`);
	}
}
