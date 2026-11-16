import {readFile} from 'node:fs/promises';
import {canonicalUrl,fingerprint,parseFeed} from '../lib/domain/completion.mjs';
const args=process.argv.slice(2);
if(args.length>1||args.some(a=>!['--plan','--apply'].includes(a)))throw new Error('Use --plan or --apply');
const roster=JSON.parse(await readFile('scripts/sources.json','utf8'));
const allowed=new Set(roster.map(s=>canonicalUrl(s.feed)));
if(!args.includes('--apply')){console.log(JSON.stringify({mode:'plan',configuredFeeds:allowed.size,networkRequests:0,databaseWrites:0,note:'Apply requires a dedicated login and individually enabled/access-reviewed/robots-reviewed database sources.'}));}else{
  const raw=process.env.DATABASE_INGEST_URL;if(!raw)throw new Error('Private ingestion credential required');
  const url=new URL(raw);if(!['postgres:','postgresql:'].includes(url.protocol)||!['require','verify-ca','verify-full'].includes(url.searchParams.get('sslmode')??''))throw new Error('TLS database URL required');
  const {default:pg}=await import('pg');
  const db=new pg.Client({connectionString:raw,connectionTimeoutMillis:15000,statement_timeout:15000});
  try{
    await db.connect();
    const check=await db.query("SELECT NOT(r.rolsuper OR r.rolbypassrls OR r.rolcreatedb OR r.rolcreaterole OR r.oid=d.datdba OR pg_has_role(session_user,'neon_superuser','MEMBER')) AS allowed FROM pg_roles r CROSS JOIN pg_database d WHERE r.rolname=session_user AND d.datname=current_database()");
    if(check.rows[0]?.allowed!==true)throw new Error('Privileged ingestion credential rejected');
    await db.query('SET ROLE scholarship_collector');
    const sources=await db.query('SELECT id,name,feed_url,source_type,minimum_interval_seconds FROM public.sources WHERE enabled AND access_reviewed_at IS NOT NULL AND robots_checked_at IS NOT NULL ORDER BY id');
    for(const source of sources.rows){
      const key=`scholarship-collector:${source.id}`;
      const lock=await db.query('SELECT pg_try_advisory_lock(hashtext($1)) AS locked',[key]);if(!lock.rows[0].locked)continue;
      let run;
      try{
        const recent=await db.query("SELECT 1 FROM public.collection_runs WHERE source_id=$1 AND started_at>now()-($2*interval '1 second') LIMIT 1",[source.id,source.minimum_interval_seconds]);if(recent.rowCount)continue;
        run=(await db.query("INSERT INTO public.collection_runs(source_id,status) VALUES($1,'running') RETURNING id",[source.id])).rows[0].id;
        const feed=canonicalUrl(source.feed_url);if(!allowed.has(feed))throw new Error('Feed is not in the reviewed code roster');
        const response=await fetch(feed,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'ScholarshipHubDiscovery/2.0'}});if(!response.ok||!response.body)throw new Error('Feed request failed');
        const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>2000000)throw new Error('Feed too large');chunks.push(Buffer.from(chunk));}
        const records=parseFeed(Buffer.concat(chunks).toString('utf8'));let added=0,duplicates=0,observations=0;
        await db.query('BEGIN');
        for(const item of records){
          const canonical=fingerprint(item.url),hash=fingerprint(JSON.stringify(item));
          const known=await db.query('SELECT id FROM public.opportunities WHERE canonical_key=$1 OR original_source_url=$2 ORDER BY id LIMIT 1',[canonical,item.url]);
          let id=known.rows[0]?.id;
          if(id){duplicates++;}else{
            const base=item.title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'opportunity';
            const created=await db.query("INSERT INTO public.opportunities(slug,title,description,source_id,original_source_name,original_source_url,source_type,canonical_key,review_status,verification_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'pending','needs_review') ON CONFLICT(slug) DO NOTHING RETURNING id",[`${base}-${canonical.slice(0,12)}`,item.title,item.description,source.id,source.name,item.url,source.source_type,canonical]);
            if(!created.rows[0])throw new Error('Candidate collision requires manual review');id=created.rows[0].id;added++;
          }
          const stored=await db.query('INSERT INTO public.source_observations(source_id,opportunity_id,collection_run_id,source_url,content_hash,extracted_record,http_status) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7) ON CONFLICT(source_id,source_url,content_hash) DO NOTHING',[source.id,id,run,item.url,hash,JSON.stringify({...item,unverified:true}),response.status]);observations+=stored.rowCount;
        }
        await db.query("UPDATE public.collection_runs SET status='succeeded',finished_at=now(),discovered=$2,added=$3,duplicates=$4,diagnostics=$5::jsonb WHERE id=$1",[run,records.length,added,duplicates,JSON.stringify({newObservations:observations,existingRecordsOverwritten:0})]);
        await db.query('COMMIT');console.log(JSON.stringify({sourceId:source.id,added,duplicates,observations}));
      }catch{
        await db.query('ROLLBACK').catch(()=>{});
        if(run)await db.query("UPDATE public.collection_runs SET status='failed',finished_at=now(),error_summary='Collection failed; inspect source access, parsing and database configuration privately' WHERE id=$1",[run]).catch(()=>{});
        console.error(`Collection failed for source ${source.id}`);process.exitCode=1;
      }finally{await db.query('SELECT pg_advisory_unlock(hashtext($1))',[key]);}
    }
  }catch{console.error('Ingestion unavailable or unauthorized');process.exitCode=1;}finally{await db.end().catch(()=>{});}
}
