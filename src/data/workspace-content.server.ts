import { APP_CONSTANTS } from '../CONSTANTS';
import { siteConfig } from './site';
import type { Channel, Prompt } from './channels';
import type { Answer } from '../lib/chat/types';

interface ChannelContent extends Omit<Channel, 'id' | 'prompts'> {
	hidden?: boolean;
	prompts: (Prompt & {
		response?: Answer;
		example?: {
			framework: 'React' | 'Svelte' | 'HTML';
			title: string;
			description: string;
		};
	})[];
}

// Edit channel copy here. Keep channel keys and prompt IDs stable for saved histories.
// Response text uses blank lines between paragraphs. Answers stay server-only.
const github = { label: 'Explore my GitHub', href: APP_CONSTANTS.github.href, detail: 'Repositories and code' };
const linkedin = { label: 'Find me on LinkedIn', href: APP_CONSTANTS.linkedin.href, detail: 'Professional profile' };
const email = { label: 'Get in touch', href: APP_CONSTANTS.email.href, detail: APP_CONSTANTS.email.note };
const blog = { label: 'Read the blog', href: '/blog', detail: 'Notes on building software' };
const mili = { label: 'Explore MiLi', href: siteConfig.currentWork.href, detail: 'Lexin’s indirect material supply chain platform' };

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
                    text: `I’m Olly Markey, an AI-native fullstack developer based in Melbourne, Australia. I’m currently building ${siteConfig.currentWork.product} for ${siteConfig.currentWork.company}.

In the AI era, I think agency and initiative matter more than ever in any engineering role. I tend to dive straight into a problem, work out the options, and then go and implement the answer.

I’m a generalist who will give anything a go, and so far there hasn’t been a problem I couldn’t work out. Day to day I’m a fullstack engineer working end to end in TypeScript, from the interface down to Postgres with a Redis caching layer. During my university days, I've worked on projects with C, C++, Java and Kotlin. During my own time I've built Rust apps, React Native, Swift, and Android apps. Cloudflare and AWS are where I’m most at home; Azure and GCP are next on my list.

This workspace is a different way to get to know me. Choose a topic from the sidebar and follow what interests you.`,
                },
            },
            {
                id: 'explore',
                label: 'Show me around',
                question: 'What can I explore here?',
                response: {
                    text: `Start with about-me for my background and working principles. The frontend, backend, and ai-workflows channels break down the thinking behind this site and my areas of focus.

Projects starts with the workspace you’re using right now, and contact has everything you need to start a real conversation.

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
        intro: `Based in Melbourne, Australia. Building ${siteConfig.currentWork.product} for ${siteConfig.currentWork.company}, with a focus on clear interfaces, maintainable systems, and practical AI workflows.`,
        pinned: 'Fast, readable defaults. Interaction when it adds value. Systems that simplify shipping.',
        openingMessage: 'Curious about about me? I’ve put together a few questions below. Pick one to take a closer look.',
        prompts: [
            {
                id: 'now',
                label: 'What I’m working on',
                question: 'What are you focused on right now?',
                response: {
                    text: `I’m based in Melbourne and currently building ${siteConfig.currentWork.product} for ${siteConfig.currentWork.company}.

${siteConfig.currentWork.description}

${siteConfig.currentWork.features}

My focus is full-stack product engineering. I start by understanding the end goal, then work backwards to define the features, tests, and supporting systems needed to get there. I break the work into pieces that can run in parallel and use agents to implement them quickly. Defining what the finished product should do gives me a clear basis for testing it and building the automation that lets agents take on more of the implementation.`,
                    links: [mili],
                },
            },
            {
                id: 'principles',
                label: 'My working principles',
                question: 'What principles guide your work?',
                response: {
                    text: `I believe product-led growth (PLG) matters more than ever in the AI era. When code becomes easier and cheaper to produce, the quality of the product itself becomes even more important.

AI lets us ship more software, faster, but more output doesn’t automatically mean better software. Without care, it can accelerate a decline in quality (enshittification). My view is that AI should raise the standard: with more leverage to build and improve things, there’s less excuse for slow, poorly considered software.

That also changes the tradeoffs around native development. Tools like React Native let teams share application code across platforms to reduce development costs. As AI lowers the cost of implementation, I think we should be more willing to build native experiences where they deliver better performance and a better user experience, rather than treating code reuse as the default priority.

Performance is only part of it. The product also needs to solve problems users actually have. That means understanding what they’re trying to achieve, not just taking feature requests at face value. People can describe a frustration without knowing the best solution. I want to build software around those underlying needs, rather than add features because we think they might be useful.`,
                },
            },
            {
                id: 'focus',
                label: 'My interests outside tech',
                question: 'What are your interests outside tech?',
                response: {
                    text: 'Outside tech, I love the NBA, the AFL, dogs, and coffee. Making coffee is part of my daily routine.',
                },
            },
        ],
    },
    frontend: {
        name: 'frontend',
        group: 'What I do',
        mode: 'showcase',
        topic: 'Small components. Real interactions.',
        title: 'Don’t just read it. Try it.',
        intro: 'Three approaches to a considered interface. React, Svelte, and plain HTML, brought together with Astro islands. Explore each example, then look under the hood.',
        pinned: 'Live components, not streamed replies. Every example includes its actual source code.',
        openingMessage: 'Choose an example below. Interact with the component, then open its code to see how it works.',
        prompts: [
            {
                id: 'streaming',
                label: 'AI interfaces',
                question: 'How can loading states keep people engaged?',
                example: {
                    framework: 'React',
                    title: 'The wait is part of the experience.',
                    description: 'AI introduces a new UI challenge: the answer isn’t always immediate, and attention is scarce. A loading state should explain what’s happening and offer useful interaction, not just a spinning icon. Try shaping the result while this demo works.',
                },
            },
            {
                id: 'accessibility',
                label: 'Reactive interfaces',
                question: 'How can an interface respond instantly as you adjust it?',
                example: {
                    framework: 'Svelte',
                    title: 'A little order. A little chaos.',
                    description: 'Add, remove, or shuffle the list. Svelte keeps each item’s identity and animates it into place, making every change easy to follow.',
                },
            },
            {
                id: 'state',
                label: 'Let HTML do it',
                question: 'When does the browser already have the answer?',
                example: {
                    framework: 'HTML',
                    title: 'The simplest tool that does the job.',
                    description: 'An interactive component doesn’t always need a framework. Native HTML provides the disclosure, CSS animates it, and a small vanilla script coordinates opening and closing.',
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
                    text: `Astro serves the site, with its Node adapter providing the runtime for the streaming endpoint. The workspace routes are generated as static pages; the chat API runs on demand.

Answers live in a server-side TypeScript content module. There’s no database or account system for this experience, because the content is curated and conversation history belongs to the visitor’s browser tab.

Bun handles dependency management and development commands.`,
                },
            },
        ],
    },
    'ai-workflows': {
        name: 'ai-workflows',
        group: 'What I do',
        topic: 'Agent-assisted engineering, considered products',
        title: 'AI-native. Human-considered.',
        intro: 'I start with the outcome, break down the work, and use agents to help implement it. The leverage comes from clear context, testable behaviour, and keeping the product’s quality at the centre.',
        pinned: 'These are prepared responses, streamed over the network. No live model is generating them.',
        openingMessage: 'Explore how I approach AI, organise agent-assisted work, and design the experience around it.',
        prompts: [
            {
                id: 'approach',
                label: 'My approach to AI',
                question: 'Where does AI fit into your work?',
                response: {
                    text: `AI is part of how I build software, not just a feature to add to a product. I start by understanding what someone is trying to achieve, then work backwards to the behaviour, tests, and supporting systems needed to deliver it.

Agents give me more capacity to implement and explore options across the stack. That makes clear direction more important: what problem are we solving, what constraints matter, and how will we know the result works? Producing more code isn’t the same as making progress.

I think product-led growth matters even more as implementation becomes cheaper. The opportunity is to spend more care on the experience: performance, useful interactions, and solving the underlying need rather than accumulating features. AI should help raise that standard.`,
                },
            },
            {
                id: 'authored',
                label: 'Working with agents',
                question: 'How do you organise agent-assisted development?',
                response: {
                    text: `I define what the finished product should do, then break the implementation into focused pieces. Work that is genuinely independent can run in parallel. Shared interfaces and dependencies need to be clear so the pieces can come back together coherently.

Useful context includes the existing architecture, the boundaries of the task, and the behaviour that must keep working. This project makes those expectations explicit: server-only answers stay out of browser props, channel changes cancel active requests, and examples preserve their state when you navigate away.

Verification is part of the implementation. Here, unit tests cover state transitions and the streaming protocol, while browser tests exercise routes, recovery, keyboard and touch interaction, and accessibility. Visual review matters too: a passing test doesn’t tell you whether a loading state is clear or a component feels right on mobile.

That feedback loop is the useful part of agent-assisted work: define the outcome, implement, inspect the result, and refine it. Clear tests and automation give agents a stronger basis for taking on more implementation without making the product harder to maintain.`,
                },
            },
            {
                id: 'model',
                label: 'Designing AI interfaces',
                question: 'What matters when designing an interface around AI?',
                response: {
                    text: `Waiting is part of the interaction, so it needs to be designed. People should be able to tell that something is happening, understand what they can do next, and stop or recover if it isn’t working for them.

The React example in the frontend channel explores that with a short, explicitly labelled simulation. A spinner and staged status make the wait visible, while an output-format choice lets you shape the result before it arrives. The interaction has a purpose beyond filling time.

The workspace itself demonstrates the network side: incremental responses, cancellation, retry without duplicating the question, and protection against late chunks from an old request. Scrolling follows new text only when you’re near the bottom, so receiving a response doesn’t take control away from the reader.

Being clear about the source matters as much as the loading state. These answers are written in advance, not generated by a live model, and clicking a prompt doesn’t send me a message. For a personal introduction, that’s the right tradeoff: accurate content with a real streaming interaction. A live model should earn its place by solving a user need.`,
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
                    text: `I wanted this site to feel like something you can explore, rather than a page of claims about what I can build. It’s arranged as a workspace: choose a channel, pick a question, and follow what interests you. Each channel has its own route, so a shared link or refresh opens the right place immediately.

Most channels stream responses I’ve written through a real Node-backed endpoint. It’s a guided introduction, not a live AI chatbot or a message to me. You can stop a response, retry an interruption, and move between channels without losing your place. Conversations are saved within your browser tab.

The frontend channel makes the work tangible. There’s a React loading demo where you can shape the result while you wait, a Svelte list playground with animated additions and reordering, and a native HTML accordion with animated opening and closing. Each example stays hidden until selected, and its code icon opens the actual source alongside the shared styles.

The supporting details matter too: light and dark themes, a mobile channel drawer, keyboard-accessible dialogs, reduced-motion support, and scrolling that lets you read at your own pace. The aim is to demonstrate the care behind an interface through using it.`,
                },
            },
            {
                id: 'decisions',
                label: 'The technical decisions',
                question: 'Why choose this stack for a personal site?',
                response: {
                    text: `Astro is the foundation. Each channel is prerendered with the correct content, rather than waiting for client-side code to interpret a hash after refresh. Once the workspace is interactive, route changes preserve its state and support browser back and forward navigation.

React coordinates the workspace: channel selection, conversation state, streaming requests, and recovery. A focused reducer and hooks handle those responsibilities without a global state library. Request IDs prevent late chunks from updating the wrong response, channel changes cancel active requests, and session storage preserves tab-local histories.

The frontend examples use Astro islands to give each tool a specific job. React handles the asynchronous loading demo; Svelte demonstrates keyed lists, transitions, and FLIP animation; native HTML supplies the accordion, with CSS motion and a small vanilla script coordinating closing. The interactive examples hydrate when visible, and keeping their slots mounted preserves their state across channel changes. The code viewers import the real source files so the examples and their explanations stay in sync.

Native CSS and shared colour tokens keep the light and dark themes consistent. Radix provides dialog focus management for the mobile drawer, profile, and code viewers. Unit tests cover conversation and streaming logic, while browser tests exercise navigation, touch and keyboard controls, recovery, and accessibility.

I chose prepared responses because this is a personal introduction: the content should be accurate and deliberate. Only public channel metadata goes into the workspace’s React props; answer text stays server-side until requested. The Node endpoint still provides a real streaming interaction, with the transport kept separate from how the answers are authored.`,
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
        hidden: true,
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
        openingMessage: 'Choose Get in touch below to find my GitHub, LinkedIn, and email.',
        prompts: [
            {
                id: 'links',
                label: 'Get in touch',
                question: 'How can I get in touch?',
                response: {
                    text: 'You can find my code on GitHub and my professional profile on LinkedIn. For a direct conversation, email is the simplest route.',
                    links: [github, linkedin, email],
                },
            },
        ],
    },
};
