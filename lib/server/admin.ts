import 'server-only';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Pool, type PoolClient } from 'pg';
import { authOptions } from './auth';
export type Admin = { subject: string; role: 'reviewer' | 'editor' | 'admin' };
let pool: Pool | undefined;
function getPool() {
  if (pool) return pool;
  const raw = process.env.DATABASE_ADMIN_URL;
  if (!raw) throw new Error('Admin service is not configured');
  const url = new URL(raw);
  if (!['postgres:', 'postgresql:'].includes(url.protocol) || !['require', 'verify-ca', 'verify-full'].includes(url.searchParams.get('sslmode') ?? '')) throw new Error('Invalid admin connection configuration');
  pool = new Pool({ connectionString: raw, max: 3, connectionTimeoutMillis: 15000, idleTimeoutMillis: 10000, statement_timeout: 10000, application_name: 'scholarship-hub-admin' });
  pool.on('error', () => console.error('Admin database pool error'));
  return pool;
}
export async function withAdmin<T>(write: boolean, work: (db: PoolClient, admin: Admin) => Promise<T>): Promise<T> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id?.startsWith('github:')) redirect('/api/auth/signin?callbackUrl=%2Fadmin');
  const subject = session.user.id;
  let db: PoolClient | undefined;
  try {
    db = await getPool().connect();
    await db.query(write ? 'BEGIN' : 'BEGIN READ ONLY');
    const flags = await db.query(`SELECT NOT (r.rolsuper OR r.rolbypassrls OR r.rolcreaterole OR r.rolcreatedb OR r.oid=d.datdba OR EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relowner=r.oid AND n.nspname='public' AND c.relkind IN ('r','p'))) AS allowed FROM pg_roles r CROSS JOIN pg_database d WHERE r.rolname=session_user AND d.datname=current_database()`);
    if (flags.rows[0]?.allowed !== true) throw new Error('Privileged admin connection rejected');
    await db.query('SET LOCAL ROLE scholarship_admin_app');
    await db.query('SET LOCAL row_security = on');
    await db.query("SELECT set_config('app.auth_subject', $1, true)", [subject]);
    const membership = await db.query<{role: Admin['role']}>('SELECT role FROM public.admin_memberships WHERE auth_subject=$1 AND enabled=true', [subject]);
    const role = membership.rows[0]?.role;
    if (!role || !['reviewer','editor','admin'].includes(role) || (write && role === 'reviewer')) throw new Error('Access denied');
    const result = await work(db, { subject, role });
    await db.query('COMMIT');
    return result;
  } catch {
    if (db) await db.query('ROLLBACK').catch(() => {});
    throw new Error('Admin operation unavailable or not authorized');
  } finally { db?.release(); }
}
export async function listReviewQueue(state: string, page: number) {
  const status = ['pending', 'approved', 'rejected'].includes(state) ? state : 'pending';
  const safePage = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1;
  return withAdmin(false, async (db, admin) => {
    const count = await db.query('SELECT count(*)::int AS total FROM public.opportunities WHERE review_status=$1', [status]);
    const rows = await db.query('SELECT id,slug,title,review_status,verification_status,updated_at::text FROM public.opportunities WHERE review_status=$1 ORDER BY updated_at DESC,id LIMIT 25 OFFSET $2', [status, (safePage-1)*25]);
    return { admin, items: rows.rows, total: count.rows[0].total as number, page: safePage, status };
  });
}
export async function inspectOpportunity(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return withAdmin(false, async (db, admin) => {
    const row = await db.query('SELECT o.*,updated_at::text AS version FROM public.opportunities o WHERE id=$1', [id]);
    if (!row.rows[0]) return null;
    const evidence = await db.query('SELECT id,field_path,source_url,quote,verified_at::text FROM public.opportunity_evidence WHERE opportunity_id=$1 ORDER BY extracted_at DESC LIMIT 100', [id]);
    return { admin, record: row.rows[0], evidence: evidence.rows };
  });
}
