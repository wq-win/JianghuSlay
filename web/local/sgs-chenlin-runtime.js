/** Independent, serializable obligations survive changes of the source hero.
 * Card entities live only in target.sgs_bifa_pile; this ledger stores stable IDs. */
import {rule_hero} from './effective-hero.js';
export const CHENLIN_STATE_FIELD='sgs_chenlin_state';
export const chenlin_key=JSON.stringify;
export const chenlin_copy=v=>JSON.parse(JSON.stringify(v));
export const chenlin_stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
export const chenlin_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const chenlin_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const chenlin_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export const chenlin_actor=(g,id)=>g.all_players().find(a=>chenlin_pid(g,a)===id)??null;
export function chenlin_owned(g,a,skill){
  if(!chenlin_live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
  if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill);
  return g.has_general_skill?.(a,skill)===true;
}
export const chenlin_binding=(g,a,skill)=>JSON.stringify([g.general_skill_binding_id?.(a,skill)??chenlin_pid(g,a),rule_hero(a)?.id]);
const STATES=new Set(['PENDING','AWAITING_CHOICE','TRADE_COMMITTED','REFUSAL_COMMITTED','SETTLED','CANCELLED']);
export function chenlin_validate(s){
  if(s?.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||!s.obligations||!s.placements||!s.end_phases||!s.songci||!s.songci_targets)throw Error('Invalid Chen Lin state');
  for(const [id,r] of Object.entries(s.obligations)){
    if(id!==JSON.stringify(r.obligation_id)||![r.source_actor_id,r.target_actor_id,r.physical_card_id,r.placement_phase_id,r.placement_receipt_id].every(chenlin_stable)
      ||r.source_actor_id===r.target_actor_id||!Number.isSafeInteger(r.card_epoch)||r.card_epoch<0||!STATES.has(r.state)
      ||!Array.isArray(r.visibility_authorizations)||!r.cleanup_receipts||!r.turn_attempts)throw Error('Invalid Bifa obligation');
    if(['TRADE_COMMITTED','REFUSAL_COMMITTED','SETTLED'].includes(r.state)&&!r.branch_receipt)throw Error('Missing Bifa branch receipt');
    if(r.branch_receipt&&!['trade','refuse'].includes(r.branch_receipt.branch))throw Error('Invalid Bifa branch');
  }
  for(const [id,r] of Object.entries(s.songci))if(id!==JSON.stringify(r.event_id)||!r.request||!chenlin_stable(r.source_actor_id)||typeof r.committed!=='boolean')throw Error('Invalid Songci receipt');
  return s;
}
export function chenlin_read(g){return g?.[CHENLIN_STATE_FIELD]?chenlin_validate(g[CHENLIN_STATE_FIELD]):null;}
export function chenlin_state(g){return chenlin_read(g)??(g[CHENLIN_STATE_FIELD]={version:1,counter:0,obligations:{},placements:{},end_phases:{},songci:{},songci_targets:{}});}
export const sgs_clone_chenlin_state=g=>chenlin_read(g)?chenlin_copy(chenlin_read(g)):null;
export function chenlin_next(g,prefix){const s=chenlin_state(g);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('陈琳事件计数耗尽');return `${prefix}:${++s.counter}`;}
export function chenlin_methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`陈琳接入缺少 ${name}`);}
export function chenlin_movement(g,{transaction=false}={}){chenlin_methods(g,'public_card_loss','card_history_material_id','card_location_epoch');if(g.public_card_loss_supports_on_committed!==true)throw Error('陈琳需要原子移牌回执');if(transaction)chenlin_methods(g,'public_card_transaction');}
export function chenlin_pending(g,target=null){return Object.values(chenlin_read(g)?.obligations??{}).filter(r=>['PENDING','AWAITING_CHOICE'].includes(r.state)&&(!target||r.target_actor_id===chenlin_pid(g,target)));}
export function chenlin_pile_material(g,r){
  const target=chenlin_actor(g,r.target_actor_id),pile=target?.sgs_bifa_pile??[];
  const index=pile.findIndex(c=>g.card_history_materials?.find(x=>x.card===c)?.id===r.physical_card_id&&g.card_location_epoch(c)===r.card_epoch);
  return index<0?null:{zone:'bifa',index,card:pile[index],epoch:r.card_epoch};
}
const active=new WeakMap();
export function chenlin_ticket(g,table,id,request){
  if(!chenlin_stable(id))throw Error('陈琳需要稳定事件ID');const s=chenlin_state(g),k=JSON.stringify(id),old=s[table][k];let jobs=active.get(g);if(!jobs)active.set(g,jobs=new Set());
  if(old){if(JSON.stringify(old.request)!==JSON.stringify(request))throw Error('同一陈琳事件不能替换来源、目标或费用');if(!['done','cancelled'].includes(old.status)&&!jobs.has(old))throw Object.assign(Error('陈琳事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_CHENLIN_REPLAY_REQUIRED'});return null;}
  const row=s[table][k]={event_id:id,request,source_actor_id:request.source_actor_id,status:'selecting',committed:false};jobs.add(row);return {row,finish(){row.status='done';jobs.delete(row);},fail(error){row.status='failed';row.error=String(error?.message??error);jobs.delete(row);}};
}
/** Public projection never reads unentitled card faces or exposes raw requests.
 * Pass an actor (not arbitrary viewer-provided ID) for the private projection. */
export function sgs_chenlin_public_state(g,viewer=null){
  const s=chenlin_read(g),viewerId=g.all_players().includes(viewer)?chenlin_pid(g,viewer):null;
  return {version:1,viewer_actor_id:viewerId,historical_timing:'true_turn_start',native_lifecycle_verified:false,current_client_verified:false,
    bifa:Object.values(s?.obligations??{}).map(r=>{
      const pending=['PENDING','AWAITING_CHOICE'].includes(r.state),permitted=viewerId&&r.visibility_authorizations.includes(viewerId),m=pending&&permitted?chenlin_pile_material(g,r):null;
      return {obligation_id:r.obligation_id,source_actor_id:r.source_actor_id,target_actor_id:r.target_actor_id,count:pending?1:0,state:r.state,viewer_authorized:Boolean(permitted),
        branch:r.branch_receipt?.branch??null,hp_applied:r.branch_receipt?.hp_applied??false,stopped:r.stopped??null,
        ...(m?{card:{name:m.card.name,type:m.card.type,suit:m.card.suit,color:m.card.color,rank:m.card.rank}}:{})};
    }),songci_targets:chenlin_copy(s?.songci_targets??{}),songci:Object.values(s?.songci??{}).filter(r=>r.committed).map(r=>({event_id:r.event_id,source_actor_id:r.source_actor_id,target_actor_id:r.target_actor_id,branch:r.branch,status:r.status,drawn:r.drawn??0,discarded:r.discarded??0}))};
}
/** Restore is validation-only. Unfinished async work must resume from the real
 * LocalMatch input journal; cloning a DTO never replays costs or creates cards. */
export function sgs_validate_chenlin_conservation(g){
  const rows=chenlin_pending(g),targets=new Set();
  for(const r of rows){if(targets.has(r.target_actor_id)||!chenlin_pile_material(g,r))throw Error('笔伐实体位置/epoch与义务不一致');targets.add(r.target_actor_id);}
  for(const a of g.all_players())for(const card of a.sgs_bifa_pile??[]){const id=g.card_history_materials?.find(x=>x.card===card)?.id;if(rows.filter(r=>r.target_actor_id===chenlin_pid(g,a)&&r.physical_card_id===id).length!==1)throw Error('笔伐区含无主实体');}
  return true;
}
