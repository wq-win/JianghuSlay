/** Classic Mobile 潘璋马忠. H1/H3/H6 are host continuation/replay policies. */
import {rule_hero} from './effective-hero.js';
export const SGS_PANZHANGMAZHONG_STATE_FIELD='sgs_panzhangmazhong_state';
export const pm_stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
export const pm_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const pm_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const pm_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function pm_owned(g,a,id){
 if(!pm_live(a)||a.skills_disabled||a.skill_disabled||a.disabled_skill_ids?.includes(id))return false;
 if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)
  return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id);
 return g.has_general_skill?.(a,id)===true;
}
export const pm_binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pm_pid(g,a),rule_hero(a)?.id]);
const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
const stages=new Set(['offered','paying','paid','gaining','done','failed']);
const slots=new Set(['hand','weapon','armor','offensive_horse','defensive_horse']);
const faceValid=c=>record(c)&&pm_stable(c.card_id)&&slots.has(c.zone)&&Number.isSafeInteger(c.epoch)&&c.epoch>=0;
export function pm_validate(s){
 if(s?.version!==1||!pm_stable(s.owner_id)||!record(s.duodao)||!record(s.anjian))throw Error('Invalid Pan Zhang Ma Zhong state');
 for(const name of ['duodao','anjian'])for(const [key,r] of Object.entries(s[name])){
  const q=r.request;
  if(!record(q)||q.owner_id!==s.owner_id||key!==JSON.stringify(q.damage_event_id)||!pm_stable(q.damage_event_id)
   ||!pm_stable(q.target_id)||q.source_id!==null&&!pm_stable(q.source_id)||!Number.isFinite(q.damage)||q.damage<=0
   ||!['杀','血杀','毒杀','火杀','雷杀','刺杀'].includes(q.source_card_type)||!pm_stable(r.binding_id)||!stages.has(r.status))throw Error('Invalid Pan Zhang Ma Zhong receipt');
  if(name==='duodao'){
   if(q.target_id!==s.owner_id||!['sha','chain'].includes(q.kind)||q.kind==='chain'&&!q.chain_transfer||typeof r.paid!=='boolean')throw Error('Invalid Duodao request');
   if(r.paid&&(!faceValid(r.cost)||!pm_stable(r.cost_move_id)))throw Error('Invalid Duodao cost');
   if(r.gained&&(!r.paid||!faceValid(r.weapon)||r.weapon.zone!=='weapon'||!pm_stable(r.weapon_move_id)))throw Error('Invalid Duodao gain');
   if(r.declined&&r.paid)throw Error('Invalid Duodao decline');
  }else{
   if(q.source_id!==s.owner_id||q.card_user_id!==s.owner_id||q.kind!=='sha'||q.chain_transfer||q.transferred
    ||q.sha_target_id!==q.target_id||q.direct_target_id!==q.target_id||![0,1].includes(r.modifier)
    ||!Number.isFinite(r.distance)||r.distance<0||!(r.attack_range_infinite===true?r.attack_range===null:Number.isFinite(r.attack_range)&&r.attack_range>=0)
    ||r.modifier!==(!r.attack_range_infinite&&r.distance>r.attack_range?1:0)||r.status!=='done')throw Error('Invalid Anjian receipt');
  }
 }
 return s;
}
export function pm_read(g,a){const s=a?.[SGS_PANZHANGMAZHONG_STATE_FIELD];if(!s)return null;pm_validate(s);if(s.owner_id!==pm_pid(g,a))throw Error('潘璋马忠回执不能转移给另一人物');return s;}
export function pm_state(g,a){const id=pm_pid(g,a);if(!pm_stable(id))throw Error('潘璋马忠需要稳定人物ID');return pm_read(g,a)??(a[SGS_PANZHANGMAZHONG_STATE_FIELD]={version:1,owner_id:id,duodao:{},anjian:{}});}
export const sgs_clone_panzhangmazhong_state=a=>a?.[SGS_PANZHANGMAZHONG_STATE_FIELD]?JSON.parse(JSON.stringify(pm_validate(a[SGS_PANZHANGMAZHONG_STATE_FIELD]))):null;
const active=new WeakMap(),references=new WeakMap();
export const pm_replay_error=()=>Object.assign(Error('夺刀事务中断；请恢复原协程或按原输入日志重放，不能重复弃牌或获得武器'),{code:'SGS_PANZHANGMAZHONG_REPLAY_REQUIRED'});
export function pm_ticket(g,a,request,refs,binding_id){
 const s=pm_state(g,a),key=JSON.stringify(request.damage_event_id);
 let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());
 let known=references.get(a);if(!known)references.set(a,known=new Map());
 const old=s.duodao[key];
 if(old){
  if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(key)&&known.get(key).some((x,i)=>x!==refs[i]))throw Error('同一夺刀事件不能更换用牌、来源或目标');
  if(old.status!=='done'&&!jobs.has(old))throw pm_replay_error();
  return {row:old,existing:true,active:jobs.has(old)};
 }
 const row=s.duodao[key]={request,binding_id,status:'offered',paid:false};jobs.add(row);known.set(key,refs);
 return {row,existing:false,finish(){row.status='done';jobs.delete(row);},fail(e){row.status='failed';row.error=String(e?.message??e);jobs.delete(row);}};
}
/** Public receipts include only committed physical cards, never unchosen hands. */
export function sgs_panzhangmazhong_public_state(a){
 const s=a?.[SGS_PANZHANGMAZHONG_STATE_FIELD]?pm_validate(a[SGS_PANZHANGMAZHONG_STATE_FIELD]):null;
 return {duodao_events:Object.values(s?.duodao??{}).map(r=>({damage_event_id:r.request.damage_event_id,source_id:r.request.source_id,
  target_id:r.request.target_id,status:r.status,damage:r.request.damage,kind:r.request.kind,chain_transfer:r.request.chain_transfer,transferred:r.request.transferred,
  card_use_id:r.request.card_use_id,branch_id:r.request.branch_id,parent_damage_event_id:r.request.parent_damage_event_id,origin_damage_event_id:r.request.origin_damage_event_id,source_stage_anjian_receipt_id:r.request.source_stage_anjian_receipt_id,
  paid:r.paid,cost:r.paid?{...r.cost}:null,gained:r.gained===true,weapon:r.gained?{...r.weapon}:null,declined:r.declined===true,stopped:r.stopped??null})),
  anjian_events:Object.values(s?.anjian??{}).map(r=>({damage_event_id:r.request.damage_event_id,target_id:r.request.target_id,
   card_use_id:r.request.card_use_id,branch_id:r.request.branch_id,distance:r.distance,attack_range:r.attack_range,attack_range_infinite:r.attack_range_infinite===true,modifier:r.modifier,base_damage:r.request.damage}))};
}
