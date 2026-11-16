import type {ReactNode} from 'react';
export default function StructuredFacts({value,depth=0}:{value:unknown;depth?:number}):ReactNode{
  if(value===null||value===undefined||value==='')return <span>Not confirmed</span>;
  if(depth>5)return <span>Additional details available from the source.</span>;
  if(Array.isArray(value))return value.length?<ul className="list-disc space-y-2 pl-5">{value.slice(0,100).map((item,i)=><li key={i}><StructuredFacts value={item} depth={depth+1}/></li>)}</ul>:<span>Not confirmed</span>;
  if(typeof value==='object'){const entries=Object.entries(value);return entries.length?<dl className="space-y-3">{entries.slice(0,100).map(([key,item])=><div key={key}><dt className="font-semibold capitalize">{key.replace(/[_-]/g,' ')}</dt><dd><StructuredFacts value={item} depth={depth+1}/></dd></div>)}</dl>:<span>Not confirmed. Consult the official announcement.</span>;}
  return <span className="whitespace-pre-wrap break-words">{typeof value==='boolean'?(value?'Yes':'No'):String(value)}</span>;
}
