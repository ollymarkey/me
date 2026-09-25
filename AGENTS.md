# Repository guidance

## Project context

This is Olly Markey's personal website and blog. The homepage is a Slack-inspired workspace: visitors explore channels, select curated prompts, and receive prepared responses through a real streaming endpoint. It is not a live conversation with Olly or a live model-backed chatbot.

- Astro 5 supplies page rendering and the Markdown blog.
- A React island supplies the interactive workspace.
- Astro's standalone Node adapter serves `POST /api/chat`.
- Styling is native CSS. There is no Tailwind or shadcn/ui installation.
- Radix Dialog supplies accessible mobile-drawer behavior. Phosphor supplies icons.
- Geist fonts are self-hosted through Fontsource.
- Bun manages dependencies and scripts. Keep the existing TypeScript 5.9 compatibility pin unless the Astro checker is upgraded and verified.

## Structure and boundaries

- `src/pages/`: thin Astro route entry points and API endpoints.
- `src/components/workspace/`: focused React UI components. `Workspace.tsx` composes components and connects their behavior.
- `src/hooks/`: focused React/browser behavior such as chat requests, navigation, storage, scrolling, and theme preferences.
- `src/lib/chat/`: framework-independent state transitions, stream parsing, and shared types. `answers.server.ts` is server-only content.
- `src/data/`: public profile data, channel definitions, and prompt metadata. Shared profile facts belong in `site.ts`; contact destinations belong in `CONSTANTS.ts`.
- `src/styles/workspace/`: workspace theme tokens and responsibility-based stylesheets. `src/styles/workspace.css` is the import entry point.
- `src/styles/global.css`: existing blog styles.
- `src/content/blog/`: Markdown posts. Preserve existing published URLs.
- `tests/unit/`: Bun tests for meaningful logic and protocol behavior.
- `tests/e2e/`: Playwright tests against the built Node application, including axe checks.
- `docs/`: architecture, plans, content questions, and verification notes.

Keep React/browser dependencies out of framework-independent utilities. Never import server-only response content or secrets into a hydrated component. Use explicit, typed props and direct imports; avoid introducing global state or generic abstraction layers without a concrete need.

## File and function size

- **No authored source file may exceed 1,000 physical lines**, including blank lines and comments. Generated output, dependencies, vendored skills, and lockfiles are exempt.
- Prefer files below roughly 200-300 lines. This is a review signal, not a reason to create arbitrary fragments.
- One primary component per file. Small, tightly coupled private helpers may remain beside it.
- Split components and hooks by responsibility before reaching the hard limit.
- Prefer small, named functions. Extract substantial event handlers and deeply nested conditional logic.
- Format JSX and CSS for readability. Never pack statements, markup, or declarations onto long lines to disguise file size.
- Keep data separate from rendering. Split channel content into focused modules if its growth makes navigation difficult.
- Avoid one-line wrapper components or hooks that add indirection without owning meaningful behavior.

## Changes to appearance

The owner likes the current component layout and interaction patterns. For the upcoming colour refresh, preserve these unless explicitly asked otherwise.

- Edit semantic colour variables in `src/styles/workspace/tokens.css` rather than scattering literal colours across components.
- Keep both light and dark themes coherent. Respect system preference and the existing manual override.
- Keep layout/spacing changes distinct from a palette-only request.
- Maintain readable text, visible focus, accessible controls, and reduced-motion behavior.
- Keep responsive rules with their owning stylesheet. Preserve the desktop sidebar and mobile drawer.
- Use the local `.agents/skills/design-taste-frontend/SKILL.md` for visual design work, applying its guidance contextually to this portfolio/workspace.

## Interaction invariants

- Questions come from the channel's prompt list; there is no free-text composer.
- One response is active across the workspace. Stop and channel changes cancel it.
- Retry replaces the interrupted answer rather than duplicating the visitor question.
- Request IDs prevent late stream events from updating another response.
- Channel histories remain independent and persist in versioned tab-local session storage.
- Restore unfinished responses as interrupted, with a usable Retry action.
- Preserve channel hash links, browser back/forward navigation, and `/#contact`.
- Follow new text only when the reader is near the bottom. Preserve channel scroll positions.
- Preserve drawer focus trapping/restoration and polite status announcements without announcing every text chunk.
- Keep errors and interruptions recoverable. Never leave an indefinite loading state after failure.

## Content and scope

Use verified profile information. Do not invent projects, employers, tools, achievements, or performance claims. Ask Olly for missing personal examples; `docs/channel-content-guide.md` records useful questions. Identify prepared responses honestly. Keep shared profile facts in one place.

Respect user work and task scope. If asked for an explanation only, do not modify files. Do not introduce another UI library or change the design direction as part of a structural refactor. Do not delegate unless the user explicitly requests delegation.

## Verification

For a component/hook restructuring, run:

```sh
bun run check
bun test
bun run build
bun run test:e2e
```

Install the browser once if necessary: `bunx playwright install chromium`. Browser tests start the production server on port 4322. Rebuild before testing changes to application code. Preserve existing test coverage; add focused regression tests when changing behavior or fixing an uncovered bug, not tests that merely mirror component markup.

For visual changes, review desktop/mobile and both themes; check contrast and focus behavior. Do not claim production performance or deployment verification from local tests alone. `SITE_URL` is build-time production configuration; the hosting proxy must preserve streaming.
