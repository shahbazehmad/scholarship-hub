# Scholarship Hub

A statically generated directory of global scholarships, grants and fellowships built with Next.js (App Router), React, TypeScript and Tailwind CSS. There is no database: all content lives in `data/scholarships.json`, and a nightly GitHub Action keeps it fresh.

## Features

- Curated scholarships, grants and fellowships across Europe, North America, Asia, Africa, Oceania, the Middle East, Latin America and global programmes, plus listings added automatically every night
- Types: Scholarship, Grant and Fellowship. Levels: Bachelor, Master, PhD, Postdoc and Other
- Home page with hero search, popular searches, live stats, Closing Soon, Featured, Browse by level/region, Recently Added and How It Works sections
- Listing page with keyword search, filters (type, level, region, country, funding), sorting (newest, deadline soonest, name), grid/list view and "show more" pagination. Filters can be pre-set from the URL, for example `/scholarships?level=PhD&region=Europe&q=engineering`
- Statically generated detail pages with funding, eligibility, deadline notes, related opportunities and an official source button
- Country flags and scholarship logos, with emblem fallbacks
- "Closes in N days" badges for deadlines within 30 days
- Nightly auto-update that adds new listings and removes expired ones
- Site icons: browser favicon, Apple touch icon and web app manifest

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Data | Local JSON file, no database |
| Automation | GitHub Actions (nightly) |
| Hosting | Vercel, zero configuration |

## Project structure

```
.
├── .github/workflows/nightly-update.yml   # Nightly listings job
├── app/
│   ├── layout.tsx                         # Layout, metadata, theme color
│   ├── page.tsx                           # Home
│   ├── not-found.tsx
│   ├── globals.css
│   ├── icon.svg                           # Favicon
│   ├── apple-icon.tsx                     # Apple touch icon (generated PNG)
│   ├── manifest.ts                        # Web app manifest
│   ├── icons/192, icons/512               # Generated manifest icons
│   └── scholarships/
│       ├── page.tsx                       # Listing + search/filters
│       └── [slug]/page.tsx                # Detail page (static)
├── components/
│   ├── Navbar, Footer, Logo, SectionHeading
│   ├── HeroSearch, HeroArt                # Hero search box and SVG illustrations
│   ├── ScholarshipCard, ScholarshipExplorer, SearchFilterBar
│   ├── ScholarshipLogo                    # Logo with emblem fallback
│   └── CountryFlags, Badge, Icons
├── data/scholarships.json                 # Local data source
├── lib/
│   ├── scholarships.ts                    # Types, data helpers, expiry logic
│   ├── countries.ts                       # Country name to flag code mapping
│   └── brand-icon.tsx                     # Artwork for generated PNG icons
└── scripts/
    ├── update-listings.mjs                # Nightly updater (no dependencies)
    └── sources.json                       # RSS feeds to import from
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm run start` and `npm run update-listings` (runs the nightly updater once).

## Data format

Each entry in `data/scholarships.json` has these fields:

| Field | Notes |
| --- | --- |
| `slug` | Unique, used in the URL |
| `name`, `organization`, `country`, `region` | Region examples: Europe, Asia, Global |
| `type` | `Scholarship`, `Grant` or `Fellowship` |
| `levels` | Array such as `["Master", "PhD"]` |
| `fundingType` | `Fully Funded` or `Partial` |
| `funding`, `eligibility`, `description` | Text shown on the detail page |
| `deadline` | ISO date such as `2027-01-15`, or `null` |
| `deadlineNote` | Shown when the date is not fixed |
| `addedAt`, `featured`, `tags`, `officialUrl` | Used for sorting, the Featured section, search and the apply button |
| `logo` (optional) | Image URL or `/logos/name.png` from the `public` folder |
| `countryCodes` (optional) | Overrides flag detection, e.g. `["de", "fr"]` |
| `autoAdded`, `source`, `sourceUrl` | Set by the nightly job |

### Flags and logos

- Flags come from flagcdn.com. They are detected from `country`, or from the name for multi-country listings. EU programmes show the EU flag. Without a match, a globe icon is shown.
- A logo uses the `logo` field first, then the favicon of the official website. Auto-added listings have no automatic icon.
- When there is no logo, or it fails to load, a professional emblem (cap, book, medal, globe, university or lightbulb) is shown. It is chosen from the listing name, so it stays the same.

## Nightly auto-update

`.github/workflows/nightly-update.yml` runs every day at 01:00 UTC and can also be started from the Actions tab. It runs `scripts/update-listings.mjs`, which:

1. Removes listings whose `deadline` is in the past.
2. Removes auto-added listings that have no deadline after 45 days.
3. Reads the RSS feeds in `scripts/sources.json` (currently Opportunity Desk and Scholars4Dev), keeps scholarship, grant and fellowship posts, parses a `Deadline:` date when present, and adds up to 15 new listings marked `autoAdded`.
4. Commits `data/scholarships.json` if it changed. Vercel redeploys on that push.

If a feed is unreachable, the script skips it and carries on. As a safety net, the site also hides expired listings at build time and revalidates its pages every hour.

Notes:

- Auto-added entries hold only a short excerpt and a link to the original post. Region and country default to Global and Multiple. Check each source's terms before adding feeds.
- Curated entries with `deadline: null` are never auto-removed. Set an ISO date to make them expire.

## Add a scholarship manually

Append an object to `data/scholarships.json` using the fields above, commit and push. Vercel rebuilds automatically.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Keep the defaults (Framework Preset: Next.js) and click **Deploy**.

No environment variables are required. In the repository, open Settings, Actions, General, Workflow permissions and choose **Read and write permissions**, so the nightly job can commit.

> Listing details are summarised from public sources and may be out of date. Verify deadlines and eligibility on each official website.
