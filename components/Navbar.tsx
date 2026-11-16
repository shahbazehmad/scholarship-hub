'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import Logo from './Logo';
export default function Navbar(){
  const [open,setOpen]=useState(false),path=usePathname();
  const links=[['Explore','/scholarships'],['Archive','/archive'],['How it works','/#how-it-works']];
  return <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}><nav className="ui-container flex min-h-20 items-center justify-between gap-4" aria-label="Main navigation"><Link href="/" onClick={()=>setOpen(false)} className="flex items-center gap-2" aria-label="Scholarship Hub home"><Logo className="h-9 w-10"/><span className="text-lg font-extrabold tracking-tight text-brand-900 sm:text-xl">Scholarship<span className="text-brand-500">Hub</span></span></Link><div className="hidden items-center gap-2 md:flex">{links.map(([label,href])=><Link key={href} href={href} aria-current={path===href?'page':undefined} className={path===href?'rounded-xl bg-brand-50 px-4 py-2 font-semibold text-brand-800':'rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100'}>{label}</Link>)}</div><Link href="/scholarships" className="ui-button hidden sm:inline-flex">Find opportunities <span aria-hidden>→</span></Link><button type="button" className="rounded-xl border px-3 py-2 md:hidden" aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button></nav>{open&&<div id="mobile-navigation" className="ui-container space-y-2 border-t py-4 md:hidden">{links.map(([label,href])=><Link key={href} className="block rounded-xl px-4 py-3 text-brand-900 hover:bg-brand-50" href={href} onClick={()=>setOpen(false)}>{label}</Link>)}</div>}</header>;
}
