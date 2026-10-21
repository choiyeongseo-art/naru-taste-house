import type { HomeState } from './data';

/** A saved result is the durable completion flag, for both guests and members. */
export function hasCompletedTaste(state:{result?:unknown}|null|undefined):boolean {
  return typeof state?.result==='number' && Number.isInteger(state.result) && state.result>=0 && state.result<=3;
}
export function entryPage(state:{result?:unknown}|null|undefined):'home'|'test' {
  return hasCompletedTaste(state)?'home':'test';
}
/** Bring the just-completed test into an existing account without replacing its room. */
export function mergeCompletedTaste(member:HomeState,guest:HomeState):HomeState {
  if(!hasCompletedTaste(guest))return member;
  const seen=new Set<string>();
  const history=[...guest.history,...member.history].filter(h=>{const key=`${h.date}:${h.type}`;if(seen.has(key))return false;seen.add(key);return true;}).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);
  return {...member,result:guest.result,mood:guest.mood,avatar:guest.avatar,history};
}
