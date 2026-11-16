# Consolidated feature batch and release gates

## Implemented in this batch
Structured list and JSON-object editing, stale-version checks, audited duplicate assignment/clearing with canonical-target validation, readable public structured sections, source-observation review, non-destructive RSS discovery, source access gates, bounded requests, candidate and observation deduplication, collection outcome logs, dedicated collector grants, manual-only workflow and five new pure validation tests. Edits and duplicate decisions return records to pending/needs_review. No collection process approves records or guesses funding, deadlines, levels or institutions.

The RSS adapter supports only bounded RSS item feeds. It is not a general XML/Atom scraper. Source URLs must match scripts/sources.json and database sources must separately be enabled, access-reviewed and robots-reviewed. Code-roster inclusion is not permission to crawl. Existing opportunities are never overwritten by collection; new source snapshots appear in /admin/observations for human review. URL deduplication is not semantic cross-source deduplication; use the duplicate-review UI.

## Application and SQL order
Apply database/admin-foundation.sql before database/completion-features.sql, on the isolated test branch first. A collector login must be separately provisioned with NOINHERIT and no administrative privileges/ownership. The application admin and public reader keep separate credentials. SQL files in Git do not apply themselves. Never put these credentials in NEXT_PUBLIC values or repository files.

The source-observation page and new editing operations require the supplemental SQL; otherwise the operations fail closed. Source registration/enablement remains a controlled owner operation, not a public or reviewer action. No source is seeded or enabled by this commit.

## Required checks before production
- CI: all pure tests, typecheck and Next.js production build. Five new helper tests passed during preparation; this does not establish the entire new batch builds.
- Test the new column grants, duplicate target locking, stale edits, observation isolation, source restrictions, collector denials, deduplication, failure logs and retry behavior on the isolated branch. Existing public/admin authorization suites passed before these supplemental changes and must be rerun after them.
- Configure OAuth and private Preview credentials; exercise sign-in, reviewer/editor/admin/disabled access, evidence, save, approve, archive, duplicate resolution and public visibility through the actual application. Vercel connector authentication is still a blocker; build success is not runtime verification.
- Generate/review package-lock.json; install from the lock in the final release.
- Complete financial-ledger editing/display and institution/taxonomy management if those are launch requirements; the present editor supports structured funding JSON, not the separate opportunity_financials ledger.
- Add repository-managed database/browser integration automation; the included helper tests are not a replacement.
- Finalize database homepage/navigation, existing scholarship URL compatibility, canonical metadata, sitemap/indexing policy, accessibility and rollback. New /opportunities routes remain noindex until release approval.
- Review imported content using official sources. Do not mass-approve the 198 pending records.

## Production safety
Committing this branch does not merge to main or change production data. The old scheduled updater on main continues until an approved merge or separate explicit disablement. After this replacement workflow is merged it has no automatic schedule, no repository write permission and no JSON writeback. Configure environment protection for ingestion-preview before any apply run. There is no production ingestion workflow in this batch.

Do not mark the project complete based only on this commit. Production SQL, OAuth/bootstrap credentials, browser/integration checks, final route cutover and human content verification remain release gates.
