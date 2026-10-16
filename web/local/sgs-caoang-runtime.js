/** H1/H3: actor-local receipts survive ordinary full-hidden-state journals.
 * A suspended coroutine is reconstructed by replay, never resumed from raw JSON. */
import {rule_hero} from './effective-hero.js';
export const SGS_CAOANG_STATE_FIELD='sgs_caoang_state';
export const caoang_stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
export const caoang_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const caoang_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const caoang_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function caoang_owned(g,a,id){
 if(!caoang_live(a)||a.skills_disabled||a.skill_disabled||a.disabled_skill_ids?.includes(id))return false;
 if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)
  return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id);
 return g.has_general_skill?.(a,id)===true;
}
export const caoang_binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??caoang_pid(g,a),rule_hero(a)?.id]);
const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
const stages=new Set(['offered','invoked','drawing','drawn','gift_choice','giving','given','revealed','equip_offered','equip_using','equip_used','done','failed']);
const slots=new Set(['hand','weapon','armor','offensive_horse','defensive_horse']);
export function caoang_validate(s){
 if(s?.version!==1||!caoang_stable(s.owner_id)||!record(s.kangkai))throw Error('Invalid Cao Ang state');
 for(const [key,r] of Object.entries(s.kangkai)){
  const q=r.request;
  if(!record(q)||q.owner_id!==s.owner_id||key!==JSON.stringify(q.target_confirmed_id)
   ||!['source_id','card_user_id','target_id','card_use_id','branch_id','target_window_id','target_confirmed_id'].every(k=>caoang_stable(q[k]))
   ||q.source_id!==q.card_user_id||q.kind!=='sha'||!['杀','血杀','毒杀','火杀','雷杀','刺杀'].includes(q.source_card_type)
   ||!caoang_stable(r.binding_id)||!stages.has(r.status)||typeof r.invoked!=='boolean')throw Error('Invalid Kangkai receipt');
  if((r.draw_started||r.draw_finished||r.given||r.revealed||r.equip_used)&&!r.invoked)throw Error('Invalid Kangkai commitment');
  if(r.draw_finished&&(!r.draw_started||!Number.isSafeInteger(r.draw_count)||r.draw_count<0||r.draw_count>1))throw Error('Invalid Kangkai draw');
  if(r.given&&(!r.draw_finished||q.target_id===q.owner_id||!record(r.gift)||!caoang_stable(r.gift.card_id)
   ||!slots.has(r.gift.from_zone)||!Number.isSafeInteger(r.gift.from_epoch)||r.gift.from_epoch<0||!Number.isSafeInteger(r.gift.hand_epoch)||r.gift.hand_epoch<=r.gift.from_epoch
   ||!caoang_stable(r.gift_move_id)))throw Error('Invalid Kangkai gift');
  if(r.revealed&&!r.given||r.equip_used&&(!r.revealed||!r.equip_offered||!caoang_stable(r.equipment_use_id)))throw Error('Invalid Kangkai equipment use');
  if(r.declined&&r.invoked)throw Error('Invalid Kangkai decline');
 }
 return s;
}
export function caoang_read(g,a){const s=a?.[SGS_CAOANG_STATE_FIELD];if(!s)return null;caoang_validate(s);if(s.owner_id!==caoang_pid(g,a))throw Error('曹昂回执不能转移给另一人物');return s;}
export function caoang_state(g,a){const id=caoang_pid(g,a);if(!caoang_stable(id))throw Error('曹昂需要稳定人物ID');return caoang_read(g,a)??(a[SGS_CAOANG_STATE_FIELD]={version:1,owner_id:id,kangkai:{}});}
export const sgs_clone_caoang_state=a=>a?.[SGS_CAOANG_STATE_FIELD]?JSON.parse(JSON.stringify(caoang_validate(a[SGS_CAOANG_STATE_FIELD]))):null;
const active=new WeakMap(),references=new WeakMap();
export const caoang_replay_error=()=>Object.assign(Error('慷忾事务中断；请恢复原协程或按原输入日志重放，不能重复摸牌或赠牌'),{code:'SGS_CAOANG_REPLAY_REQUIRED'});
export function caoang_ticket(g,a,request,refs,binding_id){
 const s=caoang_state(g,a),key=JSON.stringify(request.target_confirmed_id);
 let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());
 let known=references.get(a);if(!known)references.set(a,known=new Map());
 const old=s.kangkai[key];
 if(old){
  if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(key)&&known.get(key).some((x,i)=>x!==refs[i]))throw Error('同一慷忾事件不能更换用牌、来源或目标');
  if(old.status!=='done'&&!jobs.has(old))throw caoang_replay_error();
  return {row:old,existing:true,active:jobs.has(old)};
 }
 const row=s.kangkai[key]={request,binding_id,status:'offered',invoked:false};jobs.add(row);known.set(key,refs);
 return {row,existing:false,finish(){row.status='done';jobs.delete(row);},fail(e){row.status='failed';row.error=String(e?.message??e);jobs.delete(row);}};
}
/** No available-hand list, private choice, drawn face or deck information. */
export function sgs_caoang_public_state(a){
 const s=a?.[SGS_CAOANG_STATE_FIELD]?caoang_validate(a[SGS_CAOANG_STATE_FIELD]):null;
 return {kangkai_events:Object.values(s?.kangkai??{}).map(r=>({target_confirmed_id:r.request.target_confirmed_id,card_use_id:r.request.card_use_id,
  target_id:r.request.target_id,status:r.status,invoked:r.invoked,declined:r.declined===true,draw_finished:r.draw_finished===true,
  draw_count:r.draw_finished?r.draw_count:null,given:r.given===true,revealed:r.revealed===true,
  gift:r.revealed?{...r.gift}:null,equip_offered:r.equip_offered===true,equip_used:r.equip_used===true,equipment_use_id:r.equipment_use_id??null,
  equip_declined:r.equip_declined===true,stopped:r.stopped??null}))};
}
