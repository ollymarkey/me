# Olly Markey

My personal website and blog, sharing my work, skills, and thinking as an AI-native fullstack developer.

The homepage is a Slack-inspired workspace. Visitors explore channels about my background, skills, projects, and writing, select curated questions, and receive prepared responses streamed from the server. The site also has a Markdown-powered blog.

Built with Astro 5, a React workspace island, TypeScript, native CSS, and Bun. Astro's Node adapter runs the streaming API. Responses are authored content, not live model output or messages sent to me.

## Getting started

Install [Bun](https://bun.sh/) and Node.js 22 or later, then run these commands from the repository root:

```sh
bun install
bun dev
```

The development server runs at `http://localhost:4321` by default.

| Command | Purpose |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Build static pages and the Node server in `dist/` |
| `bun start` | Run the production Node server after building |
| `bun preview` | Preview the production build locally |
| `bun run check` | Check Astro and TypeScript files |
| `bun test` | Run stream, endpoint, and conversation-state tests |
| `bun run test:e2e` | Run browser tests against the production build |
| `bun astro --help` | Show Astro CLI help |

## Project structure

```text
.agents/skills/           Local agent skills
docs/                    Design and implementation plans
public/                  Favicons and other static assets
src/
  components/            Shared blog components and interactive workspace
  content/blog/          Markdown blog posts
  data/site.ts           Profile and blog metadata configuration
  data/channels.ts       Channel introductions and curated prompt definitions
  hooks/                 Chat, navigation, storage, scrolling, and theme behavior
  layouts/Layout.astro   Shared document layout and page metadata
  lib/blog.ts            Blog utilities
  lib/chat/              Prepared answers, streaming parser, state, and types
  pages/
    index.astro          Workspace homepage
    api/chat.ts          On-demand streaming endpoint
    blog/index.astro     Blog listing
    blog/[slug].astro    Individual posts
  styles/workspace.css   Workspace stylesheet entry point
  styles/workspace/      Theme tokens and focused component stylesheets
  styles/global.css      Blog styles
  CONSTANTS.ts           Email and social-link values
  content.config.ts     Blog content schema
astro.config.mjs         Astro configuration
```

## Updating content

- Edit `src/data/channels.ts` for channel introductions, pinned notes, and prompt labels/questions.
- Edit `src/lib/chat/answers.server.ts` for prepared responses and their related links. This module stays on the server; full answers are not included in the client bundle.
- Each prompt ID needs a corresponding answer under its channel ID. Missing answers fail validation during the build/server startup.
- Edit `src/data/site.ts` for shared profile data and blog metadata. The workspace's profile panel lives in `src/components/workspace/ContextPanel.tsx`.
- Edit `src/CONSTANTS.ts` for email, GitHub, and LinkedIn links.
- Add Markdown files to `src/content/blog/` for new posts. The current `first-post.md` is placeholder content.

Example post:

```md
---
title: Building a personal site
description: Notes on the decisions behind this site.
pubDate: 2026-09-25
tags:
  - Development
draft: false
---

Post content goes here.
```

The blog schema also supports optional `updatedDate` and `heroImage` fields. Posts marked `draft: true` are excluded from public listings and generated post pages.

## Production configuration

The streaming endpoint requires a Node-capable host. A static-only deployment will not serve chat responses.

1. Set `SITE_URL` to the public origin (for example, `https://your-domain.example`) in the build environment. Astro uses it for canonical/social URLs and the allowed production hostname.
2. Run `bun install` and `bun run build`.
3. Deploy the build and its runtime dependencies, then run `bun start`.
4. Set `HOST=0.0.0.0` and your platform's `PORT` at runtime as needed. Behind an HTTPS proxy, forward the original host and protocol and disable buffering for `/api/chat`.
5. Verify that responses arrive incrementally through the deployed proxy. Local production tests cannot validate a hosting provider's buffering behavior.

The generated server is `dist/server/entry.mjs`; static assets are in `dist/client/`. The supplied social cover is `public/og-cover.svg`. A raster export is recommended for social platforms that do not support SVG previews.

## Workspace behavior

- Eight channels with three prompts each. Channel URLs use hashes, such as `/#frontend` and `/#contact`.
- One response at a time. Stop or switching channels cancels the active response; Retry replaces the partial answer.
- Independent channel histories saved in versioned `sessionStorage`. They stay in the current browser tab and are not shared with other visitors.
- System-aware light/dark mode with a manual theme control, a mobile channel drawer, keyboard focus support, and reduced-motion behavior.
- Real streamed SSE frames over a POST request. Prepared copy is paced on the server; no AI provider credentials are required.

The [redesign plan](docs/workspace-redesign-plan.md) records the design direction and future model-backed extension. The [content guide](docs/channel-content-guide.md) lists the personal material still needed to make the channels more specific.

## Browser verification

Install Chromium once with `bunx playwright install chromium`. Run `bun run build`, then `bun run test:e2e`. The test runner starts a production server on port 4322 and checks streaming/recovery, channel history, mobile navigation, blog routes, and automated WCAG accessibility rules. Screenshots are saved under the ignored `test-results/` directory.

`bun run check` uses TypeScript 5.9 because this version of Astro's checker needs the TypeScript JavaScript API.

## Agent guidance

Read [AGENTS.md](AGENTS.md) for project context, component boundaries, file-size limits, and verification requirements. The repository also includes the [design-taste-frontend skill](.agents/skills/design-taste-frontend/SKILL.md) for frontend design and redesign work.

See [the frontend structure guide](docs/frontend-structure.md) for the component tree and hook responsibilities. Workspace palette changes belong in `src/styles/workspace/tokens.css`; layout and behavior live separately.
