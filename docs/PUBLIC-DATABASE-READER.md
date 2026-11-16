# Public database reader: not yet connected to pages

`lib/server/opportunities.ts` is server-only and uses the Node.js runtime. Import it only from server components, server actions or Node route handlers, never client components or Edge routes. The existing JSON pages are unchanged.

## Required credential

Provision a dedicated login with no superuser, bypass-RLS, create-role or create-database privileges, and no database ownership. Grant it membership only in `scholarship_public_reader`. Do not use scholarship_owner, migration credentials, Neon admin roles, or either GitHub import secret for public application reads. The login and membership have not yet been provisioned.

Set DATABASE_READ_URL as a private server-side Vercel secret with TLS enabled. Do not use a NEXT_PUBLIC prefix. This module deliberately does not fall back to DATABASE_URL or JSON when a configured database read fails. Pool initialization is lazy; the current build needs no database credential while the module remains unused.

Each query executes in a read-only repeatable-read transaction after checking session role attributes and database ownership, then switches to scholarship_public_reader with row security enabled. Search values are bound parameters, selected columns are explicit, sort expressions are allowlisted and page size is capped at 48. Pending records and duplicates are excluded at both query and policy levels. Errors exposed by this module omit connection details.

The API supports public search, level, field, ISO country code, region, institution, funding category, type and status filters, sorting, pagination, archived listing search and lookup by slug. Status dates use database timestamps and a 14-day closing-soon threshold. A future deadline alone does not prove applications are open. These timestamps must only be promoted from confirmed source evidence.

Archived approved records remain accessible for historical detail pages; pending and rejected ones do not. Public detail pages, archive banners, noindex decisions, financial breakdown queries and structured data are still to be implemented.

Unknown imported fields remain empty, not guessed. This layer does not approve records, resolve funding evidence, write opportunities, implement administrator authentication or replace the nightly updater.

Before cutover: configure and test the restricted login, add integration tests with approved/pending/rejected/archived/duplicate fixtures on a test branch, confirm actual RLS isolation and denied writes, validate database-backed pages and SEO in Preview, and reconcile records discovered after the imported snapshot. No production connection tests were performed merely by adding this code.
