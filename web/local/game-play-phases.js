/** Actual play-phase execution, separate from whole-turn history and effects.
 * Shared-host policy N8: normal Slash has a fresh quota in each actual phase;
 * explicit original whole-turn allowances retain their whole-turn scope.
 */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
export const playPhaseMethods={
 sha_quota_used(actor){
  const intrinsic=skill_hooks_for_hero(rule_hero(actor))?.max_sha_per_turn??1;
  if(intrinsic>1)return actor.sha_count_this_turn??0;
  return this.turn_phase==='play'&&this.active_play_phase_id===actor.play_phase_id&&Number.isInteger(actor.sha_count_this_play_phase)
   ?actor.sha_count_this_play_phase:actor.sha_count_this_turn??0;
 },
 can_use_offensive_wine(actor){return !!actor?.alive&&(actor.offensive_wine_uses_this_turn??0)<1;},
 commit_offensive_wine(actor){
  if(!this.can_use_offensive_wine(actor))return false;
  actor.offensive_wine_uses_this_turn=(actor.offensive_wine_uses_this_turn??0)+1;return true;
 },
 async execute_extra_play_phase(actor,target,request={}){
  if(this.actual_turn_active!==true||this.turn_actor!==this.seat_of(actor)||this.turn_phase!=='turn_start'
   ||request.turn_id!==this.turn_event_counter||request.before!=='prepare'||typeof request.event_id!=='string')throw Error('额外出牌阶段必须位于真实回合开始、准备阶段之前');
  return this.execute_play_phase(actor,target,{...request,extra:true});
 },
 async execute_play_phase(actor,target,{event_id=null,extra=false,source_skill=null}={}){
  this.play_phase_receipts??={};
  const key=event_id??`normal-play:${this.turn_event_counter}:${this.player_id(actor)}`;
  const old=this.play_phase_receipts[key];
  if(old){if(old.actor_id!==this.player_id(actor)||old.turn_id!==this.turn_event_counter||old.extra!==extra||old.source_skill!==source_skill)throw Error('出牌阶段回执身份不符');if(!['done','interrupted','skipped'].includes(old.status))throw Error('出牌阶段未完成，请按日志恢复');return {...old};}
  const saved={phase:this.turn_phase,active:this.active_play_phase_id??null,skip:actor.skip_play_stage};
  if(extra)actor.skip_play_stage=false;
  const row=this.play_phase_receipts[key]={request_id:key,phase_event_id:`play-attempt:${key}`,actor_id:this.player_id(actor),turn_id:this.turn_event_counter,extra,source_skill,status:'before_play'};
  try{
   this.turn_phase='before_play';
   if(!actor.skip_play_stage){const window={event_id:`before-play:${++this.phase_window_counter}`,upcoming_phases:['play'],extra,source_skill,phase_event_id:row.phase_event_id,turn_id:row.turn_id,closed:false};for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_play_phase??[])await hook(this,actor,target,window);}
   if(!actor.alive||!this.match_should_continue()){row.status='interrupted';return {...row};}
   this.turn_phase='play';
   if(actor.skip_play_stage){this.view.emit(`${actor.name}跳过${extra?'额外':'本次'}出牌阶段。`);this.record_phase_skip(actor,{phase_event_id:row.phase_event_id,phase:'play',turn_id:row.turn_id});row.status='skipped';row.skipped=true;return {...row};}
   // A skipped or interrupted attempt is not an entered play phase.
   row.phase_event_id=`play:${++this.play_phase_event_counter}`;
   actor.play_phase_id=row.phase_event_id;this.active_play_phase_id=row.phase_event_id;
   actor.sha_count_this_play_phase=0;actor.used_active_skills.delete('反间');
   row.status='playing';this.view.emit(`${actor.name}进入${extra?'当先·额外':'正常'}出牌阶段。`,{event_type:'play_phase_begin',...row});
   const beginEvent={actor,entered:true,closed:false,event_id:row.phase_event_id,phase_event_id:row.phase_event_id,turn_id:row.turn_id,extra,source_skill};
   try{for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_play_phase_begin??[])await hook(this,actor,target,beginEvent);}finally{beginEvent.closed=true;}
   await this.dispatch_followup_play_begin(actor,{actor,event_id:row.phase_event_id,phase_event_id:row.phase_event_id,turn_id:row.turn_id,extra,source_skill,closed:false});
   if(actor.alive&&this.match_should_continue()){if(actor.is_ai)await this.ai_play(actor,target);else await this.player_play(actor,target);}
   if(actor.alive&&this.match_should_continue())for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_play_phase_end??[])await hook(this,actor,target,{event_id:row.phase_event_id,phase_event_id:row.phase_event_id,turn_id:row.turn_id,history_turn_id:this.card_use_history?.current_turn_id,actor,entered:true,extra,source_skill});
   row.status=actor.alive&&this.match_should_continue()?'done':'interrupted';
   return {...row};
  }catch(error){row.status='failed';row.error=String(error?.message??error);throw error;}
  finally{
   this.view.emit(`${actor.name}的${extra?'额外':''}出牌阶段结束。`,{event_type:'play_phase_end',...row});
   this.clear_followup_play_phase(actor,row.phase_event_id);this.active_play_phase_id=saved.active;
   if(extra){actor.skip_play_stage=saved.skip;this.turn_phase=saved.phase;}
  }
 },
};
