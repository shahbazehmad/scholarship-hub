# Neon migration: foundation stage

Production database schema is provisioned in Neon project `bitter-sunset-58107484`, production branch `br-silent-haze-b9ojnob2`, database `scholarship_hub`, PostgreSQL 17, AWS Frankfurt. No password belongs in this repository.

## Current state

The website still uses JSON. This importer does not switch page reads, implement authentication, recover Git history or replace collection. The old nightly updater still deletes expired JSON entries until replaced. Existing Git history is therefore needed for historical recovery.

## Validate locally

Use Node 20 or newer from a repository checkout.

```sh
npm install
npm run test:migration
npm run migration:plan
npm run build
```

The default plan is read-only and requires no database credentials. It validates all records, rejects duplicate slugs and missing traceable URLs, and prints the input SHA-256 and repository commit. Tests cover normalization only, not database authorization or transaction behavior.

## Import after backup and approval

Take a private copy of the JSON and record the plan hash and commit. Freeze collection during snapshot/import so the input cannot change. Set DATABASE_URL privately in the execution environment using the Neon connection string with TLS enabled; never paste it into source files, logs, issue comments or NEXT_PUBLIC variables. Then run:

```sh
npm run migration:apply
```

The importer uses one transaction and an advisory lock. It preserves the entire original record in legacy_record, creates an initial revision for new rows, records migration counts, reconciles every input slug and snapshot, and rolls back on mismatch. Existing slugs are never overwritten. If an already-imported snapshot differs, the whole run aborts for manual review. The importer does not delete rows or change local JSON.

All imports are pending/needs_review. Funding labels, deadlines, levels and institution claims are retained in the original record but deliberately not presented as confirmed fields. Aggregator names are not promoted to employers. Official application URLs and verification timestamps remain empty until confirmed. Date-only source deadlines require a timezone policy before promotion.

## Remaining work

- Recover historical records from Git with provenance and conflict review.
- Configure least-privilege reader/writer roles and test authorization; RLS alone does not constrain owner or bypass-RLS roles.
- Implement server-only queries and authenticated administrator authorization.
- Configure private Vercel and GitHub Actions secrets through their settings or an authorized integration.
- Replace destructive JSON collection with approved-source discovery, evidence, deduplication, archive and collection logs.
- Implement and test public filters, statuses, standardized detail pages, archives and SEO before cutover.

No database import, production build, test execution or website cutover is implied by committing these files.
