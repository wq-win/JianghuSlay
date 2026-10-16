/** Serializable, actor-local receipts. Never copy a donor's costs to a new holder. */
import {rule_hero} from './effective-hero.js';

export const MANCHONG_STATE_FIELD='sgs_manchong_state';
export const manchong_key=JSON.stringify;
export const manchong_copy=value=>JSON.parse(JSON.stringify(value));
export const manchong_stable=value=>typeof value==='string'&&value.trim().length>0||Number.isSafeInteger(value)&&value>0;
export const manchong_live=actor=>Boolean(actor&&!actor.dead&&actor.alive!==false&&actor.hp>0);
export const manchong_pid=(game,actor)=>actor?(game.player_id?.(actor)??game.seat_of(actor)):null;
export const manchong_ongoing=game=>!game.winner&&(game.resolution_should_continue?.()??true);
export function manchong_owned(game,actor,skill){
  if(!manchong_live(actor)||actor.skills_disabled||actor.disabled_skill_ids?.includes(skill))return false;
  // Availability/DTO reads must not create a general-skill ledger.
  if(typeof game.initialize_general_skill_ledger==='function'&&game.general_skill_ledger_state==null)
    return (actor.effective_skill_ids??rule_hero(actor)?.skill_ids??[]).includes(skill);
  return game.has_general_skill?.(actor,skill)===true;
}
export const manchong_binding=(game,actor,skill)=>JSON.stringify([game.general_skill_binding_id?.(actor,skill)??manchong_pid(game,actor),rule_hero(actor)?.id]);
const statuses=new Set(['offered','selecting','paying','paid','revealed','flipping','drawing','recovering','done','failed']);
function validate(state){
  if(state?.version!==1||!manchong_stable(state.owner_id)||!Number.isSafeInteger(state.counter)||state.counter<0
    ||!state.junxing||!state.yuce||!state.phases)throw Error('Invalid Man Chong state');
  for(const [space,rows] of [['junxing',state.junxing],['yuce',state.yuce]]){
    if(typeof rows!=='object'||Array.isArray(rows))throw Error('Invalid Man Chong receipt table');
    for(const [id,row] of Object.entries(rows)){
      if(!manchong_stable(row.event_id)||id!==JSON.stringify(row.event_id)||!row.request||row.request.owner_id!==state.owner_id
        ||typeof row.committed!=='boolean'||!statuses.has(row.status))throw Error('Invalid Man Chong receipt');
      if(space==='junxing'&&row.committed&&(!Number.isSafeInteger(row.count)||row.count<1||!Array.isArray(row.categories)
        ||!row.categories.length||row.categories.some(c=>!['basic','trick','equipment'].includes(c))
        ||state.phases[JSON.stringify(row.request.phase_id)]!==row.event_id))throw Error('Invalid Junxing payment');
      if(space==='yuce'&&row.committed&&(!row.reveal||!['basic','trick','equipment'].includes(row.reveal.category)))throw Error('Invalid Yuce reveal');
    }
  }
  for(const [phase,id] of Object.entries(state.phases)){
    const row=state.junxing[JSON.stringify(id)];if(!row?.committed||JSON.stringify(row.request.phase_id)!==phase)throw Error('Invalid Junxing phase ledger');
  }
  return state;
}
export function manchong_read(game,actor){
  const state=actor?.[MANCHONG_STATE_FIELD];if(!state)return null;validate(state);
  if(state.owner_id!==manchong_pid(game,actor))throw Error('满宠事务不能继承另一人物');return state;
}
export function manchong_state(game,actor){
  const id=manchong_pid(game,actor);if(!manchong_stable(id))throw Error('满宠需要稳定人物ID');
  return manchong_read(game,actor)??(actor[MANCHONG_STATE_FIELD]={version:1,owner_id:id,counter:0,junxing:{},yuce:{},phases:{}});
}
export const sgs_clone_manchong_state=actor=>actor?.[MANCHONG_STATE_FIELD]?manchong_copy(validate(actor[MANCHONG_STATE_FIELD])):null;
const active=new WeakMap(),references=new WeakMap();
export function manchong_ticket(game,actor,space,id,request,objects=[]){
  if(!manchong_stable(id))throw Error('满宠需要稳定事件ID');
  const state=manchong_state(game,actor),key=JSON.stringify(id),refkey=`${space}:${key}`,old=state[space][key];
  let jobs=active.get(actor);if(!jobs)active.set(actor,jobs=new Set());
  let refs=references.get(actor);if(!refs)references.set(actor,refs=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||(refs.has(refkey)&&(refs.get(refkey).length!==objects.length||refs.get(refkey).some((v,i)=>v!==objects[i]))))throw Error('同一满宠事件不能更换费用、来源或目标');
    if(old.status!=='done'&&!jobs.has(old))throw Object.assign(Error('满宠事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_MANCHONG_REPLAY_REQUIRED'});
    return null;
  }
  const row=state[space][key]={event_id:id,request,status:'offered',committed:false};jobs.add(row);refs.set(refkey,objects);
  return {row,finish(){row.status='done';jobs.delete(row);},fail(error){row.status='failed';row.error=String(error?.message??error);jobs.delete(row);}};
}
export function manchong_next(game,actor){
  const state=manchong_state(game,actor);let id;
  do{if(state.counter>=Number.MAX_SAFE_INTEGER)throw Error('满宠事件计数耗尽');id=`junxing:${JSON.stringify([state.owner_id,++state.counter])}`;}while(state.junxing[JSON.stringify(id)]);
  return id;
}
export function manchong_methods(game,...names){for(const name of names)if(typeof game[name]!=='function')throw Error(`满宠接入缺少 ${name}`);}
export function manchong_movement(game){
  manchong_methods(game,'public_card_loss','card_history_material_id','card_location_epoch');
  if(game.public_card_loss_supports_on_committed!==true)throw Error('满宠需要原子弃牌回执');
}
export function sgs_manchong_public_state(actor,game=null){
  const state=actor?.[MANCHONG_STATE_FIELD]?validate(actor[MANCHONG_STATE_FIELD]):null;
  return {
    junxing_used:game?Boolean(state?.phases[JSON.stringify(actor.play_phase_id)]):false,
    junxing_events:Object.values(state?.junxing??{}).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,status:r.status,committed:r.committed,
      target_id:r.committed?r.target_id:null,count:r.committed?r.count:0,categories:r.committed?[...r.categories]:[],branch:r.branch??null,
      flipped:r.flipped??false,drawn:r.drawn??0,cancelled:r.cancelled===true,stopped:r.stopped??null})),
    yuce_events:Object.values(state?.yuce??{}).map(r=>({event_id:r.event_id,source_id:r.request.source_id,status:r.status,committed:r.committed,
      reveal:r.committed?manchong_copy(r.reveal):null,paid:r.paid??false,recovered:r.recovered??0,declined:r.declined===true,
      cancelled:r.cancelled===true,stopped:r.stopped??null})),
  };
}
