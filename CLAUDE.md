# Savor & Stories — standing site rules

This branch (`claude/astro-rebuild`) is the real live site: Astro 7 plus Tailwind 4, deployed to Cloudflare. Apply these rules to every change unless the owner overrides them in the moment.

## Copy style
- No hyphens or dashes in body prose. Exceptions: proper nouns (Saint-Émilion, Le Tréport) and verbatim guest quotes, which stay exactly as written.
- Never compare against, condemn, or disparage other tour guides, competitors, or tourists. Write about our own tours only.

## Languages: EN, FR, ES
Every visible string exists in all three languages. There is no route based i18n; all three ship in the HTML and the browser hides two.

- Markup pattern: three sibling spans, `<span data-lang="en">…</span>` plus `fr` and `es` siblings carrying `hidden`.
- The switcher lives in `src/components/Header.astro` as `.lbtn` buttons with `data-set-lang`. The logic is the inline script in `src/layouts/Layout.astro`: it toggles every `[data-lang]` element on the page and stores the choice in `localStorage`.
- Tour content is frontmatter in `src/content/tours/*.md`, validated by `src/content.config.ts`. The localized fields (`title`, `summary`, `duration`, `schedule`, `description`, and the rest) require `en`, `fr` and `es`. A missing language fails the build, so never add one language alone.
- Match the existing register in each language. The French and Spanish are written as native copy, not as translations of the English.

## Bordeaux tour scheduling
The `schedule` field on each tour in `src/content/tours/` has to match reality:

- Wine, Food and History Walk: Monday to Saturday, departures at 11:00 and 17:30. It ends in a restaurant meal, so it skips Sunday.
- Capucins market tour: Tuesday to Sunday. The market itself is closed Mondays.
- Pétanque and apéritif, riverside bike tour, Right Bank street art: every day, Sundays included.
- Sunset Right Bank: daily, with the departure time following the sunset through the year.
- Saint-Émilion day trip: by arrangement.

Rule behind it: any tour that depends on a restaurant is not offered Sunday, because most Bordeaux restaurants close that day. A plain walking tour is fine on a Sunday. The same walk with a meal attached is not.

## Imagery
- Stock or AI generated images need the owner's explicit sign off, once per image. Never add one on your own initiative.
- Everything sits in `public/assets/photos/` with no naming convention separating genuine photos from stock, so check with the owner rather than guessing an image's origin.
- `src/pages/about.astro` carries the caption "Real photos from real tours, not stock images" under the "Real tours, real guests" grid. That claim covers the six photos in that grid specifically. Those six stay genuine. If a stock or AI image is ever placed in that grid, the caption changes in all three languages at the same time.
- Two tour heroes, `bordeaux-saint-emilion-village.jpg` and `bordeaux-sunset-bridge.jpg`, are recropped and lightly colour corrected Pixabay images. They sit outside the About grid, so the caption above does not cover them. Do not describe them anywhere as Antoine's own photos.

## Change control
- Ask the owner before touching pricing, schedules, or adding or removing any image. All three have been settled through explicit back and forth already.
- Do not re-add the header logo icon or the homepage hero logo. Both were removed on instruction. Ask first.
- Do not re-do fact checked tour copy without a reason. The train time to Saint-Émilion, the monolithic church measurements, and the Right Bank site's history as a former military barracks have all been corrected once already.

## Build and deploy
- `npm run build` before committing anything that touches components, pages or tour content. The content schema catches missing translations only at build time.
- Cloudflare deploy command is `npx wrangler deploy`, with config in `wrangler.jsonc`.
- Do not use `wrangler versions upload`.
