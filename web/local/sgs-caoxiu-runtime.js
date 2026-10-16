/** Actor-local exact-once transactions. Pending awaits resume by the host input journal. */
import {rule_hero} from './effective-hero.js';
export const SGS_CAOXIU_STATE_FIELD='sgs_caoxiu_state';
export const caoxiu_stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
export const caoxiu_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const caoxiu_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const caoxiu_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function caoxiu_owned(g,a,id){
  if(!caoxiu_live(a)||a.skills_disabled||a.skill_disabled||a.disabled_skill_ids?.includes(id))return false;
  if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)
    return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id);
  return g.has_general_skill?.(a,id)===true;
}
export const caoxiu_binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??caoxiu_pid(g,a),rule_hero(a)?.id]);
const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
const stages=new Set(['offered','target_choice','paying','paid','weapon_effect','done','failed']);
export function caoxiu_validate(s){
  if(s?.version!==1||!caoxiu_stable(s.owner_id)||!record(s.qingxi))throw Error('Invalid Cao Xiu state');
  for(const [key,r] of Object.entries(s.qingxi)){
    if(!record(r.request)||r.request.owner_id!==s.owner_id||key!==JSON.stringify(r.request.damage_event_id)
      ||!caoxiu_stable(r.request.damage_event_id)||!caoxiu_stable(r.request.target_id)||r.request.target_id===s.owner_id
      ||r.request.source_id!==s.owner_id||r.request.card_user_id!==s.owner_id
      ||r.request.sha_target_id!==r.request.target_id||r.request.direct_target_id!==r.request.target_id||r.request.chain_transfer!==false||r.request.transferred!==false||r.request.kind!=='sha'||r.request.card_use_id!==null&&!caoxiu_stable(r.request.card_use_id)
      ||!['杀','血杀','毒杀','火杀','雷杀','刺杀'].includes(r.request.source_card_type)||!caoxiu_stable(r.binding_id)
      ||!Number.isFinite(r.base_damage)||r.base_damage<=0||!stages.has(r.status)||typeof r.committed!=='boolean')throw Error('Invalid Qingxi receipt');
    if(r.weapon&&(!caoxiu_stable(r.weapon.card_id)||!Number.isSafeInteger(r.weapon.range)||r.weapon.range<=0
      ||!Number.isSafeInteger(r.weapon.epoch)||r.weapon.epoch<0||!['weapon','armor','offensive_horse','defensive_horse'].includes(r.weapon.zone)))throw Error('Invalid Qingxi weapon');
    if(r.committed&&(!r.weapon||!['discard','boost'].includes(r.branch)))throw Error('Invalid Qingxi committed branch');
    if(r.branch==='boost'&&(!r.committed||r.modifier!==1))throw Error('Invalid Qingxi modifier');
    if(r.branch==='discard'&&(!r.committed||r.modifier!==0||!caoxiu_stable(r.payment_move_id)||!Array.isArray(r.payment_card_ids)
      ||r.payment_card_ids.length!==r.weapon.range||new Set(r.payment_card_ids).size!==r.weapon.range||!r.payment_card_ids.every(caoxiu_stable)))throw Error('Invalid Qingxi hand payment');
    if(r.weapon_discarded===true&&(!r.committed||r.branch!=='discard'||!caoxiu_stable(r.weapon_move_id)))throw Error('Invalid Qingxi weapon movement');
  }
  return s;
}
export function caoxiu_read(g,a){const s=a?.[SGS_CAOXIU_STATE_FIELD];if(!s)return null;caoxiu_validate(s);if(s.owner_id!==caoxiu_pid(g,a))throw Error('曹休回执不能转移给另一人物');return s;}
export function caoxiu_state(g,a){const id=caoxiu_pid(g,a);if(!caoxiu_stable(id))throw Error('曹休需要稳定人物ID');return caoxiu_read(g,a)??(a[SGS_CAOXIU_STATE_FIELD]={version:1,owner_id:id,qingxi:{}});}
export const sgs_clone_caoxiu_state=a=>a?.[SGS_CAOXIU_STATE_FIELD]?JSON.parse(JSON.stringify(caoxiu_validate(a[SGS_CAOXIU_STATE_FIELD]))):null;
const active=new WeakMap(),targets=new WeakMap();
export const caoxiu_replay_error=()=>Object.assign(Error('倾袭事务中断；请恢复原协程或按原输入日志重放'),{code:'SGS_CAOXIU_REPLAY_REQUIRED'});
export function caoxiu_ticket(g,a,request,target,base_damage,binding_id){
  const s=caoxiu_state(g,a),key=JSON.stringify(request.damage_event_id);
  let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());
  let refs=targets.get(a);if(!refs)targets.set(a,refs=new Map());
  const old=s.qingxi[key];
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||refs.has(key)&&refs.get(key)!==target)throw Error('同一倾袭事件不能更换来源、用牌或目标');
    if(old.status!=='done'&&!jobs.has(old))throw caoxiu_replay_error();
    return {row:old,existing:true,active:jobs.has(old)};
  }
  const row=s.qingxi[key]={request,base_damage,binding_id,status:'offered',committed:false};
  jobs.add(row);refs.set(key,target);
  return {row,existing:false,finish(){row.status='done';jobs.delete(row);},fail(e){row.status='failed';row.error=String(e?.message??e);jobs.delete(row);}};
}
/** Never include uncommitted hand choices or any private card face. */
export function sgs_caoxiu_public_state(a){
  const s=a?.[SGS_CAOXIU_STATE_FIELD]?caoxiu_validate(a[SGS_CAOXIU_STATE_FIELD]):null;
  return {qingxi_events:Object.values(s?.qingxi??{}).map(r=>({damage_event_id:r.request.damage_event_id,target_id:r.request.target_id,status:r.status,
    committed:r.committed,weapon:r.weapon?{card_id:r.weapon.card_id,zone:r.weapon.zone,range:r.weapon.range,name:r.weapon.name??null}:null,
    branch:r.branch??null,modifier:r.modifier??0,payment_card_ids:r.committed&&r.branch==='discard'?[...r.payment_card_ids]:[],
    weapon_discarded:r.weapon_discarded===true,declined:r.declined===true,stopped:r.stopped??null}))};
}
