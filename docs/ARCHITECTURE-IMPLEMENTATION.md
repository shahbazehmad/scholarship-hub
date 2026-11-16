# Architecture implementation batch

## Included

- Existing JSON routes remain unchanged. New /opportunities and /opportunities/[slug] routes use the existing server-only restricted reader; archive search uses ?archive=1. They are deliberately noindex during Preview and do not fall back to JSON.
- GitHub OAuth login through NextAuth; identity is the immutable provider account ID prefixed github:. GitHub login alone grants no administrative access.
- /admin queue and record inspection; membership checked against admin_memberships on every server operation; reviewer is read-only; editor/admin can mutate. Client-side disabled controls are not the security boundary.
- Edits, approval, rejection, archive, restore and verified evidence actions run in transactions with row locking, optimistic version checks, revisions and audit inserts. Failure rolls back the entire transaction. Normal edits and evidence additions return listings to pending.
- Approval requires a title, description, official announcement and application URLs, explicit human verification and at least one human-verified evidence record. A URL being syntactically valid does NOT establish that it is official: the administrator must check source ownership and quoted claims.
- Restricted group-role SQL is included for separate test-branch application. It does not grant ownership, membership-management, DELETE or unrestricted schema privileges.
- Dependency-free validation tests and a branch CI workflow are included. No database credentials are needed for the build while routes remain dynamic.

## Private configuration (not bundled)

1. Create a GitHub OAuth application with the correct callback URL: https://<preview-host>/api/auth/callback/github. Use a distinct app for production where callback hosts differ.
2. Configure NEXTAUTH_URL, a strong random NEXTAUTH_SECRET, GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET privately. Do not reuse a GitHub personal access token as the OAuth secret.
3. Apply database/admin-foundation.sql to the isolated authorization test branch first. Review all existing policies: PostgreSQL permissive policies combine with OR, so unrelated broad policies must not accidentally grant extra access.
4. Provision a separate non-owner, non-admin login with NOINHERIT, CONNECT on the database and membership only in scholarship_admin_app. Assign its TLS connection string to DATABASE_ADMIN_URL privately. DATABASE_READ_URL remains the separate public-reader login. Never use NEXT_PUBLIC credentials.
5. Bootstrap the intended administrator membership using their independently confirmed numeric GitHub account ID. Do not allow self-registration into admin_memberships. Membership revocation must be tested.
6. Use private Preview configuration only; do not configure production credentials or switch production routes yet.

## Required validation before merge/cutover

Run npm install, npm run test:migration, npm run test:architecture, npm run typecheck and npm run build. Generate and review a package lock before production release. CI installation currently follows the repository's unlocked dependency setup.

On the isolated Neon branch: apply the SQL; seed synthetic approved/pending/rejected/archived/duplicate records plus evidence; verify public visibility; verify denied protected reads and writes; test reviewer/editor/admin/disabled/non-member sessions; test unauthenticated direct server-action requests, rollback on audit failure, stale-version conflicts, and membership revocation. Verify actual OAuth callbacks and secure cookies in Preview. The pure tests do not prove authorization or database transaction behavior.

Validate NextAuth 4.24.15 with the installed Next 15/React 19 versions in CI and Preview. No authentication deployment is claimed by adding the configuration.

## Remaining project work (not represented as finished)

- Replace the destructive nightly JSON collector with an approved-source, non-destructive ingestion pipeline; preserve observations and deduplicate before review.
- Add full financial/evidence public display, structured application/funding editing, institution/taxonomy management and duplicate-resolution UI.
- Add end-to-end/integration automation with isolated fixtures. The included tests cover pure validation only.
- Complete administrator review of imported records; reconcile records collected since the snapshot. Never mass-approve imports just to populate pages.
- Rework homepage/navigation and established scholarship routes for database cutover, retain legacy slug redirects, finalize canonical/indexing/structured-data rules and test accessibility.
- Replace raw JSON detail sections with domain-specific components before general release.
- Configure deployment secrets, test branch cleanup, monitoring/backups and a rollback plan. Do not delete the test branch while Preview points to it.

## Security scope

The admin database credential is trusted server infrastructure. A holder of it can set app.auth_subject, so RLS here is defense-in-depth beneath authenticated server operations, not a way to distribute that credential to clients. Database audit rows are transactionally appended by the application but not cryptographic proof against credential compromise. Add stronger database-enforced mutation functions if operations must be constrained independently of a compromised server.

No production DDL, credential provisioning, membership bootstrap, build, merge or deployment is performed by adding these files.

Membership is checked at the start of each admin operation. Requests already in progress may finish during concurrent membership revocation; disable credentials or stop the service if immediate interruption is required.
