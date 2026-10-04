# Savor & Stories

Private tour guide website for Antoine, running tours in Bordeaux and Dieppe, France.

🌐 **Live site:** https://savorstories.com

## Tech stack

- **[Astro](https://astro.build)** — every page renders to static HTML at build time, so tour content is fully visible to search engines and AI answer engines.
- **[Tailwind CSS v4](https://tailwindcss.com)** — via the official Vite plugin (`@tailwindcss/vite`), styled to match the site's original warm cream, Bordeaux green, teal and wine red palette.
- **[Astro content collections](https://docs.astro.build/en/guides/content-collections/)** — each tour is a markdown file under `src/content/tours/`, so prices and details can be edited without touching page code.
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — sitemap is generated automatically at build time.
- **Cloudflare Workers** (static assets, worker name `tours`) for hosting. Deploy with `npx wrangler deploy`; config in `wrangler.jsonc`.

## Project structure

```
src/
  content/tours/       one markdown file per tour (frontmatter = price, duration, etc.)
  content.config.ts    schema for the tours collection
  components/          Header, Footer, TourCard, BookingWidget
  layouts/Layout.astro shared page shell: meta tags, favicon, JSON-LD
  pages/
    index.astro         home
    bordeaux.astro       Bordeaux tour listing
    dieppe.astro          Dieppe tour listing
    about.astro            about Antoine
    contact.astro           contact / booking help
    tours/[slug].astro       one page per tour, built from the content collection
    bordeaux-game.astro       "Blind Taste, Bordeaux" trivia game
    dieppe-game.astro          "Crack the Raid" trivia game
public/assets/          favicon, apple touch icon, full logo
```

## Adding or editing a tour

Edit or add a markdown file in `src/content/tours/`. The frontmatter fields are:

```yaml
city: bordeaux | dieppe
title: "Tour name"
summary: "One line shown on the listing card"
duration: "3 hours"
price: "90€"          # or null if priced on request
priceLabel: "On request"   # shown instead of price when price is null
schedule: "Tuesday to Saturday, departures at 10:30 and 17:30"
meetingPoint: "..."    # optional — omit if not confirmed yet, the page will say
                        # "Shared with you when you book" instead of guessing
included:
  - "What's included, one bullet per line"
goodToKnow: "Anything guests should know before booking."
icon: "🍷"
order: 1                # controls sort order on the listing page
```

The body of the markdown file is the full tour description, shown on the tour's own page.

## Booking

There is no live booking calendar yet. Every tour page has a WhatsApp button as a temporary stand in — see the comment at the top of `src/components/BookingWidget.astro` for exactly what to replace it with once Antoine's Bokun account and tour listings are set up. Bokun also syncs availability to Viator, GetYourGuide and TripAdvisor from one dashboard.

## Local development

```
npm install
npm run dev       # http://localhost:4321
npm run build      # outputs static site to dist/
npm run preview     # preview the production build locally
```

## Deploying to Cloudflare Workers

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- Deploy command: `npx wrangler deploy` (never `npx wrangler versions upload`, which stages a version that is not live).
- No adapter or Functions setup needed since the whole site is static.
- Handover notes: `docs/HANDOVER.md` and the Systems tab of `docs/playbook/Savor-and-Stories-Treasure-Hunt-Playbook.html`.

## Content still pending

- **About page:** the intro text is filled in, but the expanded biography section is intentionally left blank until Antoine provides real details (years guiding, languages spoken, how he got started).
- **Boat tour:** not built yet. Before adding it, confirm with Antoine where it happens (the Garonne in Bordeaux, or the Dieppe coastline), what it actually involves, duration and price.
- **Real photography:** tour pages currently use an emoji icon rather than a hero photo. Swap in real photos of Antoine's tours once available.
