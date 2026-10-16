/** Ling Cao actor-local, full-snapshot receipts; no mutable donor markers. */
import {rule_hero} from './effective-hero.js';
export const LINGCAO_STATE_FIELD='sgs_lingcao_state';
export const lingcao_stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
export const lingcao_pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const lingcao_live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const lingcao_ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
export function lingcao_owned(g,a,skill){
 if(!lingcao_live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
 if(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null)return (a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill);
 return g.has_general_skill?.(a,skill)===true;
}
export const lingcao_binding=(g,a,skill)=>JSON.stringify([g.general_skill_binding_id?.(a,skill)??lingcao_pid(g,a),rule_hero(a)?.id]);
const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
export function lingcao_validate(s){
 if(s?.version!==1||!lingcao_stable(s.owner_id)||!record(s.draws))throw Error('Invalid Ling Cao state');
 for(const [key,r] of Object.entries(s.draws))if(!record(r.request)||r.request.owner_id!==s.owner_id||key!==JSON.stringify(r.request.event_id)||!lingcao_stable(r.request.event_id)||!lingcao_stable(r.request.phase_event_id)||!lingcao_stable(r.request.turn_id)||!['offered','selected','passed','aborted','committed','cancelled','failed'].includes(r.status)||!lingcao_stable(r.binding_id)||typeof r.committed!=='boolean'||!Number.isSafeInteger(r.output_count)||r.output_count<0||!Number.isSafeInteger(r.delta)||r.delta<0)throw Error('Invalid Dujin receipt');
 return s;
}
export function lingcao_read(g,a){const s=a?.[LINGCAO_STATE_FIELD];if(!s)return null;lingcao_validate(s);if(s.owner_id!==lingcao_pid(g,a))throw Error('独进回执不能转移给另一人物');return s;}
export function lingcao_state(g,a){const owner=lingcao_pid(g,a);if(!lingcao_stable(owner))throw Error('独进需要稳定人物ID');return lingcao_read(g,a)??(a[LINGCAO_STATE_FIELD]={version:1,owner_id:owner,draws:{}});}
export const sgs_clone_lingcao_state=a=>a?.[LINGCAO_STATE_FIELD]?JSON.parse(JSON.stringify(lingcao_validate(a[LINGCAO_STATE_FIELD]))):null;
export const lingcao_replay_error=()=>Object.assign(Error('独进事务未完成；请恢复原协程或按原输入日志重放'),{code:'SGS_LINGCAO_REPLAY_REQUIRED'});
export function sgs_lingcao_public_state(a,g=null){const s=a?.[LINGCAO_STATE_FIELD]?lingcao_validate(a[LINGCAO_STATE_FIELD]):null;return {dujin_events:Object.values(s?.draws??{}).map(r=>({event_id:r.request.event_id,phase_event_id:r.request.phase_event_id,turn_id:r.request.turn_id,status:r.status,committed:r.committed,equipment_count:r.committed?r.equipment_count:null,bonus:r.committed?r.delta:0,declined:r.status==='passed'}))};}
