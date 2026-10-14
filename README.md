# Scholarship Hub

A statically generated directory of global scholarships, grants and fellowships built with Next.js (App Router), React, TypeScript and Tailwind CSS. There is no database: all content lives in `data/scholarships.json`.

## Features

- Curated opportunities across Europe, North America, Asia, Africa, Oceania, the Middle East, Latin America and global programmes
- Types: Scholarship, Grant and Fellowship; levels: Bachelor, Master, PhD and Postdoc
- Search, filters, sorting, grid/list view and "show more" pagination
- Statically generated detail pages with eligibility, coverage and an official source link
- Nightly automatic updates and removal of expired listings

## Run locally

```bash
npm install
npm run dev
```

## Nightly auto-update

The workflow in `.github/workflows/nightly-update.yml` runs every day at 01:00 UTC (and on demand from the Actions tab). It runs `scripts/update-listings.mjs`, which:

1. Removes listings whose `deadline` is in the past.
2. Removes auto-added listings with no deadline after 45 days.
3. Reads the RSS feeds in `scripts/sources.json`, keeps scholarship, grant and fellowship posts, parses a `Deadline:` date when present, and adds up to 15 new listings marked `autoAdded`.
4. Commits `data/scholarships.json` if it changed. Vercel redeploys on that push.

Add or remove feeds in `scripts/sources.json`. If a feed is unreachable, the script skips it and continues. Run it locally with `npm run update-listings`.

As a safety net, the site also hides expired listings at build time and revalidates its pages every hour.

### Notes

- Auto-added entries contain only a short excerpt and a link back to the original post. Check each source's terms before adding feeds.
- Curated entries with `deadline: null` are never auto-removed. Set an ISO date such as `2027-01-15` to make them expire.

## Add a scholarship manually

Append an object to `data/scholarships.json` with a unique `slug` and the fields `name`, `organization`, `country`, `region`, `type`, `levels`, `fundingType`, `funding`, `deadline`, `deadlineNote`, `eligibility`, `addedAt`, `featured`, `tags`, `description` and `officialUrl`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Keep the defaults (Framework Preset: Next.js) and click **Deploy**.

No environment variables are required. In the repository settings, make sure Actions has read and write permission (Settings, Actions, General, Workflow permissions) so the nightly job can commit.

> Listing details are summarised from public sources and may be out of date. Verify deadlines and eligibility on each official website.
