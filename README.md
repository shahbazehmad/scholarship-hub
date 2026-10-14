# Scholarship Hub

A statically generated directory of global scholarships, grants and fellowships built with Next.js (App Router), React, TypeScript and Tailwind CSS. There is no database: all content lives in `data/scholarships.json`.

## Features

- 33 opportunities across Europe, North America, Asia, Africa, Oceania, the Middle East, Latin America and global programmes
- Types: Scholarship, Grant and Fellowship; levels: Bachelor, Master, PhD and Postdoc
- Search and filters (type, level, region, country, funding), sorting and grid/list view
- Statically generated detail pages with eligibility, coverage and an official source link

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add a scholarship

Append an object to `data/scholarships.json` with a unique `slug` and these fields: `name`, `organization`, `country`, `region`, `type`, `levels`, `fundingType`, `funding`, `deadline` (ISO date or `null`), `deadlineNote`, `eligibility`, `addedAt`, `featured`, `tags`, `description` and `officialUrl`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Keep the defaults (Framework Preset: Next.js) and click **Deploy**.

No environment variables or backend are required.

> Listing details are summarised from public sources and may be out of date. Verify deadlines and eligibility on each official website.
