import 'server-only';
import data from '@/data/scholarships.json';
import type {Scholarship} from '@/lib/scholarships';
import {deadlineState} from '@/lib/domain/catalog.mjs';
const records=data as unknown as Scholarship[];
export function legacyCatalog(archive=false){return records.filter(s=>archive?deadlineState(s.deadline)==='past':deadlineState(s.deadline)!=='past');}
export function legacyBySlug(slug:string){return records.find(s=>s.slug===slug);}
export function legacySlugs(){return records.map(s=>({slug:s.slug}));}
