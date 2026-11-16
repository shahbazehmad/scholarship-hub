-- Test branch first. This file does not provision login passwords or enable sources.
BEGIN;
GRANT UPDATE(countries,country_codes,levels,fields,funding_categories,region,city,opportunity_type,funding_details,eligibility,application_details,duplicate_of) ON public.opportunities TO scholarship_admin_app;
GRANT SELECT ON public.source_observations TO scholarship_admin_app;
DROP POLICY IF EXISTS admin_app_observations_read ON public.source_observations;
CREATE POLICY admin_app_observations_read ON public.source_observations FOR SELECT TO scholarship_admin_app USING(EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled));
DO $role$ BEGIN IF EXISTS(SELECT 1 FROM pg_roles WHERE rolname='scholarship_collector') THEN RAISE EXCEPTION 'Collector role exists; inspect grants before applying'; END IF; CREATE ROLE scholarship_collector NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOREPLICATION; END $role$;
GRANT USAGE ON SCHEMA public TO scholarship_collector;
GRANT SELECT ON public.sources,public.source_observations,public.collection_runs TO scholarship_collector;
GRANT SELECT(id,slug,canonical_key,original_source_url,source_id) ON public.opportunities TO scholarship_collector;
GRANT INSERT(slug,title,description,source_id,original_source_name,original_source_url,source_type,canonical_key,review_status,verification_status) ON public.opportunities TO scholarship_collector;
GRANT INSERT(source_id,status) ON public.collection_runs TO scholarship_collector;
GRANT UPDATE(status,finished_at,discovered,added,duplicates,diagnostics,error_summary) ON public.collection_runs TO scholarship_collector;
GRANT INSERT(source_id,opportunity_id,collection_run_id,source_url,content_hash,extracted_record,http_status) ON public.source_observations TO scholarship_collector;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;ALTER TABLE public.collection_runs ENABLE ROW LEVEL SECURITY;ALTER TABLE public.source_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY collector_sources ON public.sources FOR SELECT TO scholarship_collector USING(enabled AND access_reviewed_at IS NOT NULL AND robots_checked_at IS NOT NULL);
CREATE POLICY collector_opportunity_keys ON public.opportunities FOR SELECT TO scholarship_collector USING(true);
CREATE POLICY collector_pending_insert ON public.opportunities FOR INSERT TO scholarship_collector WITH CHECK(review_status='pending' AND verification_status='needs_review' AND duplicate_of IS NULL AND archived_at IS NULL AND application_url IS NULL AND announcement_url IS NULL AND last_verified_at IS NULL AND EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
CREATE POLICY collector_runs_read ON public.collection_runs FOR SELECT TO scholarship_collector USING(EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
CREATE POLICY collector_runs_insert ON public.collection_runs FOR INSERT TO scholarship_collector WITH CHECK(status='running' AND EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
CREATE POLICY collector_runs_update ON public.collection_runs FOR UPDATE TO scholarship_collector USING(EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled)) WITH CHECK(EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
CREATE POLICY collector_observations_read ON public.source_observations FOR SELECT TO scholarship_collector USING(EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
CREATE POLICY collector_observations_insert ON public.source_observations FOR INSERT TO scholarship_collector WITH CHECK(EXISTS(SELECT 1 FROM public.sources WHERE id=source_id AND enabled));
COMMIT;
-- Provision a separate NOINHERIT login with membership only in scholarship_collector,
-- CONNECT to scholarship_hub and a private TLS DATABASE_INGEST_URL. Do not use the owner.
-- Source access/robots review and enablement require an explicit human decision.
