# Scholarship Hub

A statically generated scholarship aggregator built with Next.js (App Router), React, TypeScript and Tailwind CSS. There is no database: all content lives in `data/scholarships.json`.

## Project structure

```
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Home
│   ├── globals.css
│   └── scholarships/
│       ├── page.tsx                  # Listing + search/filters
│       └── [slug]/page.tsx           # Detail page (static)
├── components/                       # Badge, Navbar, Footer, ScholarshipCard, SearchFilterBar, ScholarshipExplorer
├── data/scholarships.json            # Local data source
└── lib/scholarships.ts               # Data helpers + types
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add a scholarship

Append an object to `data/scholarships.json` with a unique `slug`. Set `fundingType` to `Fully Funded` or `Partial`. The listing and detail pages update on the next build.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Keep the defaults (Framework Preset: Next.js) and click **Deploy**.

No environment variables or backend are required. Every push to `main` triggers a new deployment.

> The sample data is illustrative. Verify deadlines and eligibility on each official website.
