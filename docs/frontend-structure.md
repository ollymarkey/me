# Frontend structure

## Page and component tree

`src/pages/index.astro` owns the HTML document, metadata, initial theme selection, font preload, and no-JavaScript fallback. It server-renders and hydrates one React workspace island.

```text
Workspace
  ChannelSidebar              Desktop navigation
  WorkspaceTopbar             Breadcrumb and workspace label
  ChannelHeader               Current topic and pinned note
    MobileChannelDrawer       Radix dialog and mobile open/close state
      ChannelSidebar          Same navigation content in the drawer
  Conversation                Scrolling surface and conversation list
    ChannelIntroduction       Channel title, description, and shortcuts
    IntroductionMessage       Prepared opening message
    MessageExchange           Visitor question and corresponding answer
      ResponseMessage         Streaming, complete, interrupted, and error states
        ResponseLinks         Completed response attachments
  PromptPicker                Curated questions, Stop, and Reset
  ContextPanel                Profile and contact information
```

`Avatar` is shared across profile and message surfaces. Each named component has its own file in `src/components/workspace/`.

`Workspace.tsx` coordinates selected-channel data and UI callbacks. It does not implement fetch/stream parsing, theme persistence, or drawer mechanics.

## Hooks

| Hook | Responsibility |
| --- | --- |
| `useWorkspaceChat` | Reducer state, request lifecycle, Stop/Retry, stale-request protection, status callbacks |
| `useConversationStorage` | Restoring and persisting versioned tab-local history; unavailable-storage fallback |
| `useChannelNavigation` | Selected channel, hash navigation, browser back/forward, channel-change callback |
| `useConversationScroll` | Channel scroll positions, near-bottom tracking, following new text, jumping to an existing question |
| `useTheme` | System/manual preference, document theme, local storage |

Hooks live in `src/hooks/`. The chat hook composes the storage hook. Workspace coordinates navigation with chat cancellation and prompt selection with scrolling.

Framework-independent helpers remain in `src/lib/chat/`: `reducer.ts`, `stream.ts`, and `types.ts`. `answers.server.ts` projects the central content into public channel metadata and a server-only answer lookup. Astro passes the public channels into Workspace; navigation, storage validation, and the sidebar consume that same list.

## Content

- `src/data/site.ts`: shared profile identity, image, role, bio, and current-work details, plus blog configuration.
- `src/data/workspace-content.server.ts`: single editable object containing channel introductions, pinned notes, opening messages, questions, prepared answers, and response links.
- `src/data/channels.ts`: browser-safe channel/prompt types and lookup helper.
- `src/CONSTANTS.ts`: contact and social destinations.
- `src/lib/chat/answers.server.ts`: derives public channel metadata and server-side answer lookup, validating nonempty responses and unique prompt IDs. Full responses never enter hydrated props.

## Styles

`src/styles/workspace.css` imports fonts and the following files in order:

| File in `src/styles/workspace/` | Responsibility |
| --- | --- |
| `tokens.css` | Semantic light/dark colour values, shadows, and overlay colour |
| `base.css` | Resets, shared controls/avatar, accessibility helpers, shared entry keyframes |
| `layout.css` | Overall grid, workspace topbar, conversation column |
| `sidebar.css` | Channel navigation, sidebar profile, mobile drawer |
| `channel.css` | Channel header, pinned note, introductory content, scroll surface |
| `messages.css` | Questions, responses, attachments, and recovery states |
| `prompts.css` | Prompt picker, Stop/Reset, captions, and jump-to-latest control |
| `context-panel.css` | Right-hand profile and contact panel |

Responsive and motion rules stay beside their owning styles. The existing blog continues to use `src/styles/global.css` through `src/layouts/Layout.astro`.

For the next colour refresh, start with `tokens.css`. The component layout and interaction model can remain intact while the palette changes.
