/** Sun Ru pending uses and prevented packets serialize as actor-local plain data. */
import {rule_hero} from './effective-hero.js';
export const SUNRU_STATE_FIELD='sgs_sunru_state';
export const sunru_stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
export const sunru_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const sunru_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const sunru_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function sunru_owned(g,a,skill){
 if(!sunru_live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
 if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill);
 return g.has_general_skill?.(a,skill)===true;
}
export const sunru_binding=(g,a,skill)=>JSON.stringify([g.general_skill_binding_id?.(a,skill)??sunru_pid(g,a),rule_hero(a)?.id]);
const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
export function sunru_validate(s){
 if(s?.version!==1||!sunru_stable(s.owner_id)||!record(s.yingjian)||!record(s.shixin))throw Error('Invalid Sun Ru state');
 for(const [key,r] of Object.entries(s.yingjian))if(!record(r.request)||r.request.owner_id!==s.owner_id||key!==JSON.stringify(r.request.phase_event_id)||!sunru_stable(r.request.phase_event_id)||!sunru_stable(r.request.turn_id)||!['offered','resolving','done','failed'].includes(r.status)||!sunru_stable(r.binding_id)||typeof r.committed!=='boolean'||r.committed&&(!sunru_stable(r.target_id)||!sunru_stable(r.card_use_id)))throw Error('Invalid Yingjian receipt');
 for(const [key,r] of Object.entries(s.shixin))if(!record(r.request)||r.request.target_id!==s.owner_id||key!==JSON.stringify(r.request.damage_event_id)||!sunru_stable(r.request.damage_event_id)||r.request.nature!=='fire'||r.status!=='done'||!sunru_stable(r.binding_id)||!Number.isFinite(r.amount)||r.amount<=0)throw Error('Invalid Shixin receipt');
 return s;
}
export function sunru_read(g,a){const s=a?.[SUNRU_STATE_FIELD];if(!s)return null;sunru_validate(s);if(s.owner_id!==sunru_pid(g,a))throw Error('孙茹回执不能转移给另一人物');return s;}
export function sunru_state(g,a){const owner=sunru_pid(g,a);if(!sunru_stable(owner))throw Error('孙茹需要稳定人物ID');return sunru_read(g,a)??(a[SUNRU_STATE_FIELD]={version:1,owner_id:owner,yingjian:{},shixin:{}});}
export const sgs_clone_sunru_state=a=>a?.[SUNRU_STATE_FIELD]?JSON.parse(JSON.stringify(sunru_validate(a[SUNRU_STATE_FIELD]))):null;
export const sunru_replay_error=()=>Object.assign(Error('影箭用牌事务未完成；请恢复原协程或按原输入日志重放'),{code:'SGS_SUNRU_REPLAY_REQUIRED'});
export function sgs_sunru_public_state(a,g=null){const s=a?.[SUNRU_STATE_FIELD]?sunru_validate(a[SUNRU_STATE_FIELD]):null;return {
 yingjian_events:Object.values(s?.yingjian??{}).map(r=>({phase_event_id:r.request.phase_event_id,turn_id:r.request.turn_id,status:r.status,committed:r.committed,target_id:r.committed?r.target_id:null,card_use_id:r.card_use_id??null,declined:r.declined===true,cancelled:r.cancelled===true})),
 shixin_events:Object.values(s?.shixin??{}).map(r=>({damage_event_id:r.request.damage_event_id,source_id:r.request.source_id,target_id:r.request.target_id,prevented:r.amount,nature:'fire'})),
 };}
