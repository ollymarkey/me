# Personal workspace redesign plan

Status: the authored-response workspace is implemented. This document retains the original design proposal below.

## Implementation status

- Eight channels, three prompts each, independent history, Stop/Retry, refresh recovery, and hash navigation are implemented.
- Astro + React + native CSS, Radix mobile drawer, Phosphor icons, and self-hosted Geist are in place.
- `/api/chat` delivers real streamed prepared responses using Astro's standalone Node adapter.
- Server-only response content lives in `src/lib/chat/answers.server.ts`, rather than a content-collection folder.
- Desktop/mobile light and dark views, reduced motion, and automated accessibility checks are covered in browser tests.
- Personal case studies, specific tool experience, and production deployment details still need Olly's input. See [the content guide](channel-content-guide.md).
- Live model generation remains a future extension. The shipped interface explicitly identifies prepared responses.

## Goal and design read

Turn Olly Markey's personal site into a Slack-inspired workspace. Visitors explore channels about Olly, select questions from a curated prompt list, and receive responses in a streamed conversation. The interface itself should demonstrate thoughtful AI frontend engineering.

Reading this as: a developer portfolio for potential employers and collaborators, with a calm, Slack-inspired product language and a distinctive personal identity.

This is a visual overhaul of the homepage, based on the repository's `design-taste-frontend` skill. Its portfolio, typography, accessibility, and redesign guidance applies; marketing hero and decorative imagery rules do not dictate the chat layout. Chat state and streaming need dedicated application patterns.

- `DESIGN_VARIANCE: 6`: recognizable channel navigation with personal typography and carefully composed messages.
- `MOTION_INTENSITY: 4`: restrained state transitions, message arrival, and streaming feedback.
- `VISUAL_DENSITY: 5`: useful workspace density with comfortable reading space.

## Current-site audit

Based on source inspection, not a rendered browser audit:

| Area | Current state | Proposed treatment |
| --- | --- | --- |
| Stack | Astro 5, TypeScript, native CSS; no UI framework or backend adapter | Keep Astro and add an interactive React island for the workspace |
| Visual identity | Warm paper (`#f7f5ef`), near-black ink, notebook lines, serif headings, rounded panels | Move to neutral workspace surfaces, sans-serif typography, and one restrained accent |
| Existing dials | Approximately variance 5, motion 3, density 3 | Increase interaction and information density to suit channels |
| Content | Introduction, fullstack/AI focus, principles, Melbourne location, current work, contact links | Reuse verified content as channel introductions and answer material |
| Routes | `/`, `/blog`, `/blog/[slug]`; Contact links target `/#contact` | Keep blog URLs and support the existing contact hash |
| Blog | One placeholder post | Keep the publishing system; replace placeholder content before featuring writing |
| Accessibility | Skip link, visible focus states, semantic navigation, reduced-motion support | Carry these through to the workspace and add chat-specific keyboard behavior |
| Metadata | Titles, descriptions, canonical/OG support | Preserve metadata; configure production URL and supply the missing configured OG image |

The repo does not currently contain detailed project case studies, an extensive skills inventory, or authored prompt responses. Those need real source material from Olly. Search rankings and production analytics have not been assessed.

## The interface

### Desktop

A full-height workspace with a roughly 250px sidebar and a flexible conversation pane:

```text
Olly Markey             | # frontend
Personal workspace     | Interfaces, accessibility, and interaction design
                       |-----------------------------------------------
ABOUT                  | Pinned introduction
# welcome              | What I build and how I approach frontend work.
# about-me             |
                       | Olly
SKILLS                 | A short, useful introduction to this channel.
# frontend             |
# backend              | You
# ai-workflows         | How do you handle streaming UI?
                       |
EXPLORE                | Olly / authored response
# projects             | Response arrives progressively here...
# writing              |
# contact              |-----------------------------------------------
                       | Ask about frontend
Theme control          | [Streaming UI] [Accessibility] [State design]
```

The first visit opens `#welcome` with a concise introduction and useful prompts immediately visible. Each channel has a description and a pinned summary, so visitors can learn something without interacting.

Use Slack's channel and message conventions: left-aligned message rows, author labels, compact avatars, and clear channel headers. Keep the interface focused on exploring Olly's work. Use genuine screenshots as project attachments when available, and Olly's existing mark or supplied portrait for identity.

### Visual system

- Self-host Geist Sans and Geist Mono, with system fallbacks and `font-display: swap`. Use mono only for code and compact technical metadata.
- Light mode: off-white conversation surface, slightly darker neutral sidebar, dark readable text. Dark mode: charcoal surfaces with matching hierarchy.
- One muted teal accent for active channels, links, focus indicators, and primary actions. Validate exact token pairs for contrast in both themes.
- CSS custom properties for semantic colors, spacing, and layers. Default to system theme with a manual toggle.
- A consistent radius rule: 6px controls, 10px attachments/dialogs, square message rows. Thin separators organize the interface; shadows are reserved for overlays.
- Native CSS for layout and transitions. Radix primitives for accessible overlay behavior, customized to the same tokens. Phosphor for icons.
- Brief opacity/transform transitions communicate channel changes and message insertion. Reduced-motion mode removes movement and smooth scrolling.

### Mobile

Below 768px, show one conversation pane with a channel button opening a navigation drawer. Restore focus to the trigger when the drawer closes. Keep the channel header and prompt area accessible while the conversation scrolls.

Use dynamic viewport sizing and safe-area padding. Present prompts as stacked, touch-friendly buttons. Test long answers, enlarged text, landscape orientation, and narrow screens without horizontal page overflow.

## Channel and content map

These are proposed topics, not claims about unverified skills or experience.

| Channel | Content | Example selectable prompt |
| --- | --- | --- |
| `#welcome` | Short introduction and how to explore | "Give me the quick introduction" |
| `#about-me` | Background, current focus, working principles | "How do you approach a new project?" |
| `#frontend` | UI architecture, accessibility, interaction design | "How do you build a streaming chat UI?" |
| `#backend` | APIs, data modeling, reliability | "How do you approach API design?" |
| `#ai-workflows` | AI-assisted engineering and AI product interfaces | "Where does AI fit into your workflow?" |
| `#projects` | Selected work, decisions, evidence, outcomes | "Walk me through a project" |
| `#writing` | Published blog entries and article links | "What have you been writing about?" |
| `#contact` | Email, GitHub, LinkedIn, collaboration context | "What's the best way to contact you?" |

Start with three to five prompts per channel and short answers with optional follow-ups. Show capabilities through concrete explanations, code, and project evidence rather than percentage-based skill scores. Publish a topic only when its introduction and answers are ready.

## Prompt-driven conversation

1. Visitor selects a channel. Its introduction, previous messages, and prompts appear.
2. The bottom area says "Ask about frontend", for example. It contains buttons rather than an editable text field.
3. Selecting a prompt immediately posts its full question as a visitor message and creates a response placeholder.
4. The response starts streaming into an Olly message. Useful links and attachments appear with the completed response.
5. On completion, show relevant follow-up prompts. Previously used prompts can be marked "Asked" and jump to the existing answer.

Keep histories and scroll positions independent per channel. Preserve them in memory during navigation and use versioned `sessionStorage` for refresh recovery. Conversations are private to that browser tab, not shared public messages or messages sent to Olly.

For the initial implementation, allow one active response across the workspace. Switching channels cancels the request and preserves its partial answer as interrupted. Returning offers Retry. Stop also cancels the network request; Retry replaces the partial response without duplicating the visitor question. Restored in-progress messages become interrupted rather than remaining stuck in loading.

Auto-scroll only when the visitor is already near the bottom. If they scroll up, expose a "Jump to latest" control. Preserve keyboard focus on the prompt controls and announce response start/completion politely, rather than reading every token through a live region.

Define the complete state cycle: idle, connecting, streaming, complete, interrupted, and error. Timeouts and offline failures get an inline explanation and Retry. Never leave an indefinite typing indicator after failure.

## Response strategy

### Recommended first release: authored responses, real network streaming

Olly writes or approves an answer for each prompt. A server endpoint streams the chosen answer to the client. This provides factual control and a repeatable demonstration of streaming interaction design.

Label the experience naturally: "Explore my work through guided questions and authored responses." This is an AI-style frontend demonstration, not a claim that a model generated the answers or that Olly is currently typing.

Implement actual response streaming rather than downloading a complete answer and revealing it with a client timer. A chunked authored response is still distinct from live model inference; document that distinction in the implementation write-up.

### Later extension: model-generated answers

If live inference becomes part of the goal, keep the same prompts and response transport. Resolve each allowed prompt server-side and generate answers from Olly's approved profile/project material. Keep credentials server-side and add request limits, output limits, and an authored fallback. Identify generated responses in the interface.

A database, vector search, authentication, and realtime multi-user infrastructure are unnecessary for the initial content volume and interaction model.

## Technical architecture

### Client and content

Keep Astro for page generation, metadata, and the existing blog. Add `@astrojs/react`, React, and React DOM for one server-rendered, hydrated workspace island. Keep styling in native CSS to fit the repository. Install required dependencies during implementation after checking their current compatible versions; none are installed by this plan.

Use a local reducer for channel histories and request state. No global state library is required initially. Separate the streaming transport from rendering so authored and model-backed implementations share the same interface.

Proposed files:

```text
src/components/workspace/
  Workspace.tsx
  ChannelSidebar.tsx
  ChannelHeader.tsx
  MessageList.tsx
  PromptPicker.tsx
  ResponseMessage.tsx
src/data/channels.ts
src/content/responses/
src/lib/chat/types.ts
src/lib/chat/reducer.ts
src/lib/chat/stream.ts
src/pages/api/chat.ts
src/styles/workspace.css
```

Define stable channel IDs, prompt IDs, answer IDs, and follow-up IDs. Validate their relationships at build time. Keep full answers on the server; send only channel summaries and prompt labels as initial client data.

Use shareable hash navigation such as `/#frontend`, including `/#contact`, with browser back/forward support. Preserve `/blog` and existing article URLs. Render a meaningful introduction and static navigation before hydration, with a useful fallback when JavaScript is unavailable.

### Streaming endpoint

Proposed request: `POST /api/chat` with `{ channelId, promptId, requestId }`. Accept identifiers only; the server checks that the prompt belongs to the channel and resolves the actual question and answer.

Return a streamed response using an SSE event format consumed through `fetch` and a readable stream. Native `EventSource` is not suitable for this POST request.

- `start`: response ID and authorship mode.
- `delta`: text chunks for the active response.
- `complete`: approved links, attachment references, and follow-up prompt IDs.
- `error`: recoverable failure information.

Buffer incomplete event frames and decode split UTF-8 characters correctly. Key events to the request/response so late chunks cannot update another channel. Treat a disconnected stream without `complete` as interrupted. Use `AbortController`, propagate cancellation server-side, and release readers on cleanup.

Render streaming text safely; progressively format only complete supported blocks or apply Markdown formatting after completion. Disable raw HTML, constrain link protocols, and avoid layout-jumping reparsing on every tiny chunk.

The current static deployment cannot execute this endpoint. Select a streaming-capable host and its Astro adapter before backend implementation, and mark the endpoint for on-demand rendering. Verify streaming through the deployed host/proxy, not only localhost. The deployment provider remains an open choice.

## Delivery milestones

### Content and visual prototype

Finalize channel names, collect real skill/project evidence, and author the first prompt set. Build a representative `#frontend` view in both themes and mobile/desktop sizes to validate typography, density, and prompt affordances.

Done when: the introduction, one conversation, and next actions are clear at a glance; all visible content is grounded in supplied facts.

### Navigable workspace

Build the Astro shell and React island, channel navigation, prompt picker, reducer, per-channel history, theme control, and mobile drawer. Use a clearly identified local mock transport during development.

Done when: every ready channel can be explored with mouse, touch, and keyboard; deep links and browser history work; blog and contact links remain useful.

### Streaming and recovery

Choose the deployment runtime, add the endpoint, and wire request validation, real chunk delivery, Stop, Retry, interruption, and scroll behavior.

Done when: incremental network delivery works in deployment, switching channels cannot mix answers, and failed/cancelled requests leave a recoverable UI.

### Content finish and release verification

Complete all published prompt responses, add genuine project attachments, configure canonical/OG metadata, and document the implementation as a case study demonstrating the frontend decisions.

Verify:

- Reducer transitions, duplicate clicks, channel switching, and stale-chunk isolation.
- Stream parsing across arbitrary chunk boundaries, malformed input, midstream disconnect, and cancellation.
- Browser flows for prompts, Stop/Retry, refresh recovery, deep links, and back/forward navigation.
- Keyboard access, mobile drawer focus, screen-reader announcements, 200% zoom, reduced motion, and contrast in both themes.
- Existing blog routes, production build, and deployed streaming behavior.
- Lighthouse and performance measurements targeting LCP below 2.5s, INP below 200ms, and CLS below 0.1.

Apply the taste skill's relevant pre-flight checks to the finished interface. Browser, accessibility, and performance checks remain pending until implementation exists.

## Inputs needed for implementation

- Olly's approved answers, skills inventory, and two or three real project examples with screenshots/links where available.
- Confirmation of the proposed channel names and the authored-streaming first-release approach.
- Deployment host/runtime for the streaming endpoint.
- A portrait if desired; the existing identity assets can support the prototype.

Recommended starting slice: `#welcome` and `#frontend`, with three prompts each, one complete streaming interaction, and robust channel switching. Once that slice feels excellent, expand the content across the remaining channels.
