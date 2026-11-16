'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { withAdmin } from '@/lib/server/admin';
import { assertApprovable, httpUrl, textField, timestamp } from '@/lib/domain/review.mjs';
export async function reviewOpportunity(form: FormData) {
  const id = textField(form.get('id'), 36, true);
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('Invalid record');
  const action = String(form.get('action'));
  if (!['save','approve','reject','archive','restore','evidence'].includes(action)) throw new Error('Invalid action');
  const reason = textField(form.get('reason'), 2000, true);
  await withAdmin(true, async (db, admin) => {
    const locked = await db.query('SELECT o.*,updated_at::text AS version FROM public.opportunities o WHERE id=$1 FOR UPDATE', [id]);
    const before = locked.rows[0];
    if (!before || before.version !== form.get('version')) throw new Error('Record changed. Reload before saving');
    if (action === 'save') {
      const opening = timestamp(form.get('opening_at'));
      const deadline = timestamp(form.get('deadline_at'));
      if (opening && deadline && Date.parse(opening) > Date.parse(deadline)) throw new Error('Opening must precede deadline');
      const verified = form.get('verified') === 'on';
      if (verified) {
        const evidence = await db.query('SELECT count(*)::int AS n FROM public.opportunity_evidence WHERE opportunity_id=$1 AND verified_at IS NOT NULL', [id]);
        if (!evidence.rows[0].n) throw new Error('Add verified evidence before marking the record verified');
      }
      await db.query(`UPDATE public.opportunities SET title=$2,description=$3,institution_name=$4,announcement_url=$5,application_url=$6,opening_at=$7,deadline_at=$8,verification_status=$9,last_verified_at=CASE WHEN $10 THEN now() ELSE NULL END,review_status='pending',updated_at=clock_timestamp() WHERE id=$1`, [id,textField(form.get('title'),500,true),textField(form.get('description'),30000,true),textField(form.get('institution_name'),500)||null,httpUrl(form.get('announcement_url')),httpUrl(form.get('application_url')),opening,deadline,verified?'admin_verified':'needs_review',verified]);
    } else if (action === 'evidence') {
      await db.query(`INSERT INTO public.opportunity_evidence(opportunity_id,field_path,value,source_url,quote,verified_at,verified_by) VALUES($1,$2,$3::jsonb,$4,$5,now(),$6)`, [id,textField(form.get('field_path'),200,true),JSON.stringify(textField(form.get('evidence_value'),10000,true)),httpUrl(form.get('evidence_url'),true),textField(form.get('quote'),10000,true),admin.subject]);
      await db.query("UPDATE public.opportunities SET review_status='pending',verification_status='needs_review',last_verified_at=NULL,updated_at=clock_timestamp() WHERE id=$1", [id]);
    } else if (action === 'approve') {
      const evidence = await db.query('SELECT count(*)::int AS n FROM public.opportunity_evidence WHERE opportunity_id=$1 AND verified_at IS NOT NULL', [id]);
      assertApprovable(before,evidence.rows[0].n);
      await db.query("UPDATE public.opportunities SET review_status='approved',published_at=coalesce(published_at,now()),updated_at=clock_timestamp() WHERE id=$1",[id]);
    } else if (action === 'reject') {
      await db.query("UPDATE public.opportunities SET review_status='rejected',updated_at=clock_timestamp() WHERE id=$1",[id]);
    } else {
      await db.query('UPDATE public.opportunities SET archived_at=CASE WHEN $2 THEN now() ELSE NULL END,archive_reason=CASE WHEN $2 THEN $3 ELSE NULL END,updated_at=clock_timestamp() WHERE id=$1',[id,action==='archive',reason]);
    }
    const changed = await db.query('SELECT to_jsonb(o) AS snapshot FROM public.opportunities o WHERE id=$1',[id]);
    const after = changed.rows[0].snapshot;
    await db.query('INSERT INTO public.opportunity_revisions(opportunity_id,snapshot,actor,reason) VALUES($1,$2::jsonb,$3,$4)',[id,JSON.stringify(after),admin.subject,reason]);
    await db.query("INSERT INTO public.admin_audit_log(actor,action,entity_type,entity_id,before_state,after_state) VALUES($1,$2,'opportunity',$3,$4::jsonb,$5::jsonb)",[admin.subject,action,id,JSON.stringify(before),JSON.stringify(after)]);
  });
  revalidatePath('/admin');
  revalidatePath(`/admin/opportunities/${id}`);
  revalidatePath('/opportunities','layout');
  redirect(`/admin/opportunities/${id}?saved=1`);
}
