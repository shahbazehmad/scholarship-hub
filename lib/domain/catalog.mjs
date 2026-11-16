export function deadlineState(value, today=new Date().toISOString().slice(0,10)) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return 'unknown';
  const date=new Date(value+'T00:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)return 'unknown';
  return value<today?'past':'listed';
}
