'use server';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {withAdmin} from '@/lib/server/admin';
import {list,object} from '@/lib/domain/completion.mjs';
import {textField} from '@/lib/domain/review.mjs';
export async function saveStructured(form:FormData) {
  const id=String(form.get('id')), action=String(form.get('action'));
  if(!/^[0-9a-f-]{36}$/i.test(id)||!['structured','duplicate'].includes(action))throw new Error('Invalid request');
  const reason=textField(form.get('reason'),2000,true);
  await withAdmin(true,async(db,admin)=>{
    const current=await db.query('SELECT o.*,updated_at::text AS version FROM public.opportunities o WHERE id=$1 FOR UPDATE',[id]);
    const before=current.rows[0];
    if(!before||before.version!==form.get('version'))throw new Error('Reload this record before saving');
    if(action==='duplicate'){
      const target=String(form.get('duplicate_of')??'').trim()||null;
      if(target){
        if(!/^[0-9a-f-]{36}$/i.test(target)||target===id)throw new Error('Invalid canonical record');
        const canonical=await db.query('SELECT id,duplicate_of FROM public.opportunities WHERE id=$1 FOR SHARE',[target]);
        if(!canonical.rows[0]||canonical.rows[0].duplicate_of)throw new Error('Choose an existing non-duplicate canonical record');
      }
      await db.query("UPDATE public.opportunities SET duplicate_of=$2,review_status='pending',verification_status='needs_review',last_verified_at=NULL,updated_at=clock_timestamp() WHERE id=$1",[id,target]);
    }else{
      const countries=list(form.get('countries')), codes=list(form.get('country_codes'),true);
      if(codes.some((v:string)=>!/^([A-Z]{2})$/.test(v)))throw new Error('Use two-letter country codes');
      const funding=object(form.get('funding_details')),eligibility=object(form.get('eligibility')),application=object(form.get('application_details'));
      await db.query("UPDATE public.opportunities SET countries=$2,country_codes=$3,levels=$4,fields=$5,funding_categories=$6,region=$7,city=$8,opportunity_type=$9,funding_details=$10::jsonb,eligibility=$11::jsonb,application_details=$12::jsonb,review_status='pending',verification_status='needs_review',last_verified_at=NULL,updated_at=clock_timestamp() WHERE id=$1",[id,countries,codes,list(form.get('levels')),list(form.get('fields')),list(form.get('funding_categories')),textField(form.get('region'),150)||null,textField(form.get('city'),200)||null,textField(form.get('opportunity_type'),150)||null,JSON.stringify(funding),JSON.stringify(eligibility),JSON.stringify(application)]);
    }
    const result=await db.query('SELECT to_jsonb(o) AS snapshot FROM public.opportunities o WHERE id=$1',[id]);
    const after=JSON.stringify(result.rows[0].snapshot);
    await db.query('INSERT INTO public.opportunity_revisions(opportunity_id,snapshot,actor,reason) VALUES($1,$2::jsonb,$3,$4)',[id,after,admin.subject,reason]);
    await db.query("INSERT INTO public.admin_audit_log(actor,action,entity_type,entity_id,before_state,after_state) VALUES($1,$2,'opportunity',$3,$4::jsonb,$5::jsonb)",[admin.subject,action,id,JSON.stringify(before),after]);
  });
  revalidatePath('/admin');revalidatePath('/opportunities','layout');
  redirect(`/admin/opportunities/${id}/edit?saved=1`);
}
