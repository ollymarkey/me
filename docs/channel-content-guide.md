# Making the channels personal

The initial copy is grounded in the existing site's profile and the workspace implementation. Technical explanations describe this site; they are not claims about past client projects. Review the first-person copy before publishing.

## Editing channel copy

Edit **`src/data/workspace-content.server.ts`**. Its `channelContent` object is the single source for channel descriptions, pinned notes, opening messages, question buttons, and prepared responses. Each channel key contains its prompts, with each response directly beside its question:

```ts
welcome: {
  // Channel name, group, topic, title, intro, pinned, and openingMessage above.
  prompts: [
    {
      id: 'hello',
      label: 'The quick introduction',
      question: 'Give me the quick introduction.',
      response: {
        text: `Your first paragraph.

Your second paragraph.`,
        // Optional: links: [github, linkedin, email, blog],
      },
    },
  ],
},
```

- `label` is the question button; `question` is the visitor message posted after clicking it.
- `response.text` is the streamed reply. Use blank lines between paragraphs; do not indent the text inside multiline strings. Text is rendered safely without raw HTML.
- `openingMessage` is the initial message shown before any question is selected.
- Shared response-link labels and descriptions are at the top of this same file. Contact destinations still come from `src/CONSTANTS.ts`.
- Keep channel keys and prompt IDs stable when changing copy so saved conversations and channel links keep working.
- To add a question, add one prompt object with its response. There is no separate answer map to maintain. Duplicate prompt IDs and empty responses fail validation at build/server startup.
- After editing, rebuild/redeploy the site. Use **Reset** in an already-explored channel to fetch updated answers rather than viewing its saved history.

`src/lib/chat/answers.server.ts` derives the server lookup and a public channel list. Astro passes only that public list to React; prepared answers are excluded from page props and browser JavaScript. Shared profile facts remain in `src/data/site.ts`.

## About me

Questions for Olly:
- How did you get into development?
- What kind of problem makes you lose track of time?
- What would teammates say it is like to work with you?

Idea: add "The short version" and "The slightly longer version" prompts, with a personal detail that would not belong on a conventional CV.

## Frontend

Questions for Olly:
- Which frontend tools do you use most, and which do you actually prefer?
- What is an interaction you are especially proud of building?
- Can you share a specific accessibility or performance problem you solved?

Idea: attach a real screenshot or demo link to an answer explaining a decision, not just a stack list.

## Backend

Questions for Olly:
- Which languages, databases, and hosting platforms have you shipped with?
- What is a difficult data-modeling, reliability, or integration problem you have handled?
- What tradeoff would you make differently now?

Idea: a "Follow a request" prompt that walks through one real system from API to persistence and back.

## AI workflows

Questions for Olly:
- Which AI tools are part of your daily development workflow?
- Where do you let an agent work independently, and where do you review closely?
- Have you built a model-backed product feature? What was the hardest interface problem?

Idea: describe one concrete task from initial brief through implementation and verification, including what needed human correction.

## Projects

Questions for Olly:
- Which two or three projects best represent your work?
- What was your role, what did you ship, and what changed as a result?
- Which screenshots, repository links, or public demos can be shared?

Idea: give each project three prompts: "The problem", "The interesting decision", and "What I learned". Add additional project-specific channels only when there is enough content to justify them.

## Writing

Questions for Olly:
- What is the first topic you want to publish?
- Do you have notes or existing articles to bring over?

Idea: start with a case study of this workspace, covering the reducer, streaming boundary, cancellation, and accessibility decisions. Replace the current placeholder first post when real writing is ready.

## Contact

Questions for Olly:
- Are you seeking employment, freelance projects, collaborations, or simply professional connections?
- Is your current location and Lexin Solutions status still accurate?

Idea: tailor the introduction and contact prompts to the work you want next, and keep one clear email action.

## Hosting

The implementation uses Astro's standalone Node adapter. Which provider and public domain will host the site? Set `SITE_URL` at build time and verify streaming through that provider before launch.
