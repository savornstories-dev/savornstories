# Phase 1 website revamp

Branch: `revamp/ui-ux-seo-2026`
Base: `claude/astro-rebuild` at `ae611dd12b6324a91746d68d96407edd91c54d2d`.

## Changes

- `src/pages/index.astro`: navy editorial hero using the same two photographs of Antoine, translated headline, earlier genuine testimonials, redesigned destination previews, larger featured cards, and a dark contact panel. All previous homepage photographs, review quotations and attribution remain intact.
- `src/styles/global.css`: ivory, navy, wine and champagne tokens; fluid homepage typography; removal of global body zoom; responsive grids; focus indicators; reduced motion; larger language and FAQ touch targets. Shared styles also apply to existing destination and tour pages.
- `src/components/Header.astro`: preserved wordmark and links; current page indication; language button state; localized navigation labels; menu dismissal with Escape, outside clicks and desktop resizing.
- `src/components/TourCard.astro`: editorial card styling and semantic tour headings. Prices and tour content are still read from the unchanged collection.
- `src/layouts/Layout.astro`: skip link, optional social image metadata, Twitter metadata, language state accessibility, and a language switcher that still works when local storage is unavailable.
- `astro.config.mjs`: exact development preview host allowance for `terminal.local`. Production remains a static build with the canonical domain `savornstories.com`.

## Validation completed

- `npm install` succeeded. No dependency versions were changed; incidental lockfile metadata changes were discarded.
- `npm run build` succeeded: all 22 pages generated.
- `git diff --check` passed.
- Browser checks in Chromium: desktop, tablet and mobile homepage layouts, including 1440, 834, 390 and 320 pixel frame widths. Horizontal content width matched the viewport at each checked size (the frame scrollbar accounts for 15 pixels).
- English, French and Spanish switching confirmed, including the document language and active button state. Language choice persisted on navigation.
- Mobile menu opening, Escape dismissal and focus return checked.
- Bordeaux and Dieppe finder results, keyboard restart and localized WhatsApp destination URLs checked. No WhatsApp messages were sent.
- FAQ widget opened and returned a Spanish language answer.
- Both games loaded in English, switched to French and Spanish, accepted an answer and displayed feedback. These were smoke checks, not exhaustive playthroughs.
- Source and built output checks confirmed unchanged photographs, quotations and attribution; unchanged tour content, games, FAQ source and private page; one homepage H1; valid homepage internal route targets; unchanged canonical domain; correct homepage social image metadata.
- Reduced motion rules were reviewed in source. OS preference emulation and screen reader testing were not performed.

## Preserved boundaries

No image files, pricing, schedules, tour descriptions, private playbook files or deployment settings were changed. No new photographs or logo icons were introduced. No merge or deployment was performed.

## Existing issues outside Phase 1

The FAQ source contains legacy tour names and values, including Bordeaux duration differences from the content collection. These were left unchanged because factual tour content requires approval. Existing English image descriptions and verbatim English guest quotes remain when switching languages. No SEO ranking, performance score, Safari or physical device testing is claimed.

## Development preview

In an existing clone:

```sh
git fetch origin
git switch revamp/ui-ux-seo-2026
npm install
npm run dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`. For a production build preview, run `npm run build` followed by `npm run preview`. Do not run Wrangler for review. The temporary responsive QA page used during validation has been removed and is absent from the build.

## Delivery in this session

GitHub denied branch creation with `403 Resource not accessible by integration`, and the local Git remote has no write credential. The branch and completed commit exist locally. A Git bundle carries the development branch for import into an existing clone that contains the base commit:

```sh
git fetch "<downloaded bundle path>" revamp/ui-ux-seo-2026:revamp/ui-ux-seo-2026
git switch revamp/ui-ux-seo-2026
npm install
npm run dev
```

The private playbook remains unlinked and unchanged. Its existing static hosting and noindex header do not provide login based access control. No claim of enforced privacy is made; adding authentication is outside this phase.
