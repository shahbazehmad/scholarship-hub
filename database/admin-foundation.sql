-- Apply on a test branch first, as the migration owner. Never use the owner login for the application.
BEGIN;
DO $role$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='scholarship_admin_app') THEN
    CREATE ROLE scholarship_admin_app NOLOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE NOREPLICATION;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='scholarship_admin_app' AND (rolsuper OR rolbypassrls OR rolcreatedb OR rolcreaterole OR rolcanlogin)) THEN
    RAISE EXCEPTION 'Unsafe existing admin group role';
  END IF;
END $role$;
GRANT USAGE ON SCHEMA public TO scholarship_admin_app;
GRANT SELECT ON public.admin_memberships,public.opportunities,public.opportunity_evidence TO scholarship_admin_app;
GRANT UPDATE(title,description,institution_name,announcement_url,application_url,opening_at,deadline_at,verification_status,last_verified_at,review_status,published_at,updated_at,archived_at,archive_reason) ON public.opportunities TO scholarship_admin_app;
GRANT INSERT(opportunity_id,field_path,value,source_url,quote,verified_at,verified_by) ON public.opportunity_evidence TO scholarship_admin_app;
GRANT INSERT(opportunity_id,snapshot,actor,reason) ON public.opportunity_revisions TO scholarship_admin_app;
GRANT INSERT(actor,action,entity_type,entity_id,before_state,after_state) ON public.admin_audit_log TO scholarship_admin_app;
GRANT USAGE ON SEQUENCE public.opportunity_revisions_id_seq,public.admin_audit_log_id_seq TO scholarship_admin_app;
ALTER TABLE public.admin_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS admin_app_membership ON public.admin_memberships;
CREATE POLICY admin_app_membership ON public.admin_memberships FOR SELECT TO scholarship_admin_app USING(auth_subject=current_setting('app.auth_subject',true) AND enabled);
DROP POLICY IF EXISTS admin_app_read ON public.opportunities;
CREATE POLICY admin_app_read ON public.opportunities FOR SELECT TO scholarship_admin_app USING(EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled));
DROP POLICY IF EXISTS admin_app_update ON public.opportunities;
CREATE POLICY admin_app_update ON public.opportunities FOR UPDATE TO scholarship_admin_app USING(EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled AND role IN ('editor','admin'))) WITH CHECK(EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled AND role IN ('editor','admin')));
DROP POLICY IF EXISTS admin_app_evidence_read ON public.opportunity_evidence;
CREATE POLICY admin_app_evidence_read ON public.opportunity_evidence FOR SELECT TO scholarship_admin_app USING(EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled));
DROP POLICY IF EXISTS admin_app_evidence_insert ON public.opportunity_evidence;
CREATE POLICY admin_app_evidence_insert ON public.opportunity_evidence FOR INSERT TO scholarship_admin_app WITH CHECK(verified_by=current_setting('app.auth_subject',true) AND EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled AND role IN ('editor','admin')));
DROP POLICY IF EXISTS admin_app_revision_insert ON public.opportunity_revisions;
CREATE POLICY admin_app_revision_insert ON public.opportunity_revisions FOR INSERT TO scholarship_admin_app WITH CHECK(actor=current_setting('app.auth_subject',true) AND EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled AND role IN ('editor','admin')));
DROP POLICY IF EXISTS admin_app_audit_insert ON public.admin_audit_log;
CREATE POLICY admin_app_audit_insert ON public.admin_audit_log FOR INSERT TO scholarship_admin_app WITH CHECK(actor=current_setting('app.auth_subject',true) AND EXISTS(SELECT 1 FROM public.admin_memberships WHERE auth_subject=current_setting('app.auth_subject',true) AND enabled AND role IN ('editor','admin')));
COMMIT;
-- Separately provision a NOINHERIT login with no administrative privileges, no ownership,
-- membership only in scholarship_admin_app, CONNECT to scholarship_hub and private credentials.
-- Bootstrap membership through the owner using the confirmed GitHub numeric identity, not username/email:
-- INSERT INTO public.admin_memberships(auth_subject,role) VALUES ('github:<numeric-id>','admin');
-- Never expose DATABASE_ADMIN_URL to a browser. This is a trusted server credential;
-- app.auth_subject is not a replacement for authentication or protection of this credential.
