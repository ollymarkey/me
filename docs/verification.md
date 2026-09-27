# Workspace verification

Local verification of the authored-response workspace on 2026-09-25:

- `bun run check`: no errors, warnings, or hints.
- `bun test`: 7 passing tests for response state, stale-request isolation, refresh recovery, UTF-8/event framing, request validation, streaming, and cancellation.
- `bun run build`: production Node server and static pages generated successfully.
- `bun run test:e2e`: 5 passing Chromium tests against the production server, including streaming, interruption, retries, independent histories, refresh, mobile drawer focus, and blog/contact links.
- Automated axe WCAG checks: no detected violations in desktop light/dark and the mobile conversation view.
- Visual review: desktop light/dark and mobile light/dark screenshots. Narrow widths checked at 320px, 390px, and 768px.

## Performance snapshot

Lighthouse mobile simulation against the local production Node server:

| Measure | Result |
| --- | --- |
| Performance | 87 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 3.68s |
| Cumulative Layout Shift | 0.00013 |
| Total Blocking Time | 0ms |

The font stylesheet was reduced from approximately 78 KB to 19 KB using Latin-only font subsets. The regular body font is preloaded.

These are local lab results, not field measurements. LCP is still above the 2.5s target. The standalone Node server used for this run serves assets without transport compression; configure compression for static assets on the production host, preserve unbuffered chat streaming, and measure again there. INP requires interaction/field measurement and is not established by this navigation report.

Lighthouse wrote its complete JSON report successfully, then its Chrome launcher encountered a Windows temporary-directory cleanup permission error. The recorded scores come from that completed report.

Production-domain metadata, hosting/proxy behavior, and real-user performance remain deployment checks. Automated accessibility tests do not replace a full assistive-technology review.
