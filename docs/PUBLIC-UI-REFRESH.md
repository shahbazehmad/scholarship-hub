# Coordinated public UI refresh

One commit updates the public homepage, responsive navigation/footer, cards, search/filter results, list/grid views, query-preserving filters and pagination, legacy details, preserved archive, loading/error states, focus indicators, skip navigation and reduced-motion styling. Existing scholarship URLs and the JSON dataset are preserved; the database feed is not activated.

All legacy claims are labelled as unverified source information. Future source dates are not presented as confirmed application availability. Funding labels are explicitly attributed to the source. The homepage no longer claims automatic nightly updates or deletion of expired records.

The archive can display only past-deadline records still present in the current JSON. Historical records deleted by the prior updater are not restored by this change. Existing detail slugs remain available for preserved past-deadline entries and those pages are noindex.

Three new date-state tests passed during preparation. Run all tests and the Next.js build after this commit; browser checks at mobile/tablet/desktop widths, keyboard navigation, query/back-button behavior and external links are still required. No screenshot review, accessibility audit or end-to-end result is claimed.

This is a coherent refresh using the existing blue/sky brand, not a claim to reproduce an earlier unavailable visual specification. Database/admin routes remain separate, and OAuth/private setup plus database route cutover remain unfinished release work.
