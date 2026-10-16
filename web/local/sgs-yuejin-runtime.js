/** Actor-local, serializable receipts. A donor's opportunity is never copied. */
import {rule_hero} from './effective-hero.js';
export const SGS_YUEJIN_STATE_FIELD='sgs_yuejin_state';
export const yuejin_key=JSON.stringify;
export const yuejin_stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
export const yuejin_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const yuejin_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const yuejin_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function yuejin_owned(g,a,id){
  if(!yuejin_live(a)||a.skills_disabled||a.skill_disabled||a.disabled_skill_ids?.includes(id))return false;
  // Legal-option reads must not allocate a general ledger.
  if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)
    return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id);
  return g.has_general_skill?.(a,id)===true;
}
export const yuejin_binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??yuejin_pid(g,a),rule_hero(a)?.id]);
const statuses=new Set(['offered','selecting','paying','paid','responding','drawing','damaging','done','failed']);
function validate(s){
  if(s?.version!==1||!yuejin_stable(s.owner_id)||!s.xiaoguo||typeof s.xiaoguo!=='object'||Array.isArray(s.xiaoguo))throw Error('Invalid Yue Jin state');
  for(const [id,r] of Object.entries(s.xiaoguo)){
    if(!yuejin_stable(r.event_id)||id!==JSON.stringify(r.event_id)||!r.request||r.request.owner_id!==s.owner_id
      ||!yuejin_stable(r.request.target_id)||!yuejin_stable(r.request.turn_id)||r.request.phase_event_id!==r.event_id
      ||typeof r.committed!=='boolean'||!statuses.has(r.status))throw Error('Invalid Xiaoguo receipt');
    if(r.committed&&(!yuejin_stable(r.cost_card_id)||!yuejin_stable(r.cost_move_id)))throw Error('Invalid Xiaoguo committed cost');
    if(r.equipment_paid===true&&(!r.committed||r.branch!=='equipment'||!yuejin_stable(r.payment_card_id)||!yuejin_stable(r.payment_move_id)))throw Error('Invalid Xiaoguo equipment payment');
    if(r.drawn!==undefined&&(!r.equipment_paid||!Number.isInteger(r.drawn)||r.drawn<0||r.drawn>1))throw Error('Invalid Xiaoguo draw receipt');
    if(r.damage!==undefined&&(!r.committed||r.branch!=='damage'||!Number.isFinite(r.damage)||r.damage<0))throw Error('Invalid Xiaoguo damage receipt');
  }
  return s;
}
export function yuejin_read(g,a){const s=a?.[SGS_YUEJIN_STATE_FIELD];if(!s)return null;validate(s);if(s.owner_id!==yuejin_pid(g,a))throw Error('乐进事务不能继承另一人物');return s;}
export function yuejin_state(g,a){const id=yuejin_pid(g,a);if(!yuejin_stable(id))throw Error('乐进需要稳定人物ID');return yuejin_read(g,a)??(a[SGS_YUEJIN_STATE_FIELD]={version:1,owner_id:id,xiaoguo:{}});}
export const sgs_clone_yuejin_state=a=>a?.[SGS_YUEJIN_STATE_FIELD]?JSON.parse(JSON.stringify(validate(a[SGS_YUEJIN_STATE_FIELD]))):null;
const jobs=new WeakMap(),refs=new WeakMap();
export function yuejin_ticket(g,a,id,request,target){
  if(!yuejin_stable(id))throw Error('骁果需要真实结束阶段事件ID');
  const s=yuejin_state(g,a),key=JSON.stringify(id),old=s.xiaoguo[key];
  let active=jobs.get(a);if(!active)jobs.set(a,active=new Set());
  let known=refs.get(a);if(!known)refs.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(key)&&known.get(key)!==target)throw Error('同一骁果阶段事件不能更换回合、人物或目标');
    if(old.status!=='done'&&!active.has(old))throw Object.assign(Error('骁果事务中断；须恢复原协程或重放原输入日志'),{code:'SGS_YUEJIN_REPLAY_REQUIRED'});
    return null;
  }
  const row=s.xiaoguo[key]={event_id:id,request,status:'offered',committed:false};active.add(row);known.set(key,target);
  return {row,finish(){row.status='done';active.delete(row);},fail(error){row.status='failed';row.error=String(error?.message??error);active.delete(row);}};
}
export function sgs_yuejin_public_state(a){
  const s=a?.[SGS_YUEJIN_STATE_FIELD]?validate(a[SGS_YUEJIN_STATE_FIELD]):null;
  return {xiaoguo_events:Object.values(s?.xiaoguo??{}).map(r=>({event_id:r.event_id,turn_id:r.request.turn_id,target_id:r.request.target_id,status:r.status,
    committed:r.committed,cost_card_id:r.committed?r.cost_card_id:null,branch:r.branch??null,equipment_paid:r.equipment_paid===true,
    payment_card_id:r.equipment_paid?r.payment_card_id:null,drawn:r.drawn??0,damage:r.damage??0,declined:r.declined===true,stopped:r.stopped??null}))};
}
