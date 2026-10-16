import {sgs_followup_chenqun_public_state} from './sgs-followup-chenqun.js';
import {sgs_followup_zhangni_public_state,sgs_shizhi_use_face,sgs_shizhi_response_materials} from './sgs-followup-zhangni.js';
/** Source-followup host events. Physical moves and atomic costs commit before
 * optional observers; snapshots contain stable IDs rather than live callbacks. */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {sgs_sidi_slash_modifier,sgs_clear_sidi_phase,sgs_followup_caozhen_public_state} from './sgs-followup-caozhen.js';
import {sgs_followup_zhuhuan_public_state} from './sgs-followup-zhuhuan.js';
import {yijiangFollowingRuntimeMethods} from './sgs-yijiang-following-runtime.js';
const copy=x=>JSON.parse(JSON.stringify(x));
export const followupRuntimeMethods={
 contextual_use_face(actor,card,options={}){return sgs_shizhi_use_face(this,actor,card,options)??card;},
 contextual_response_materials(actor,type,ordinary){return sgs_shizhi_response_materials(this,actor,type,ordinary);},
 sha_total_allowance(actor,base){return Math.max(0,yijiangFollowingRuntimeMethods.sha_total_allowance.call(this,actor,base)+sgs_sidi_slash_modifier(this,actor));},
 clear_followup_play_phase(actor,id){sgs_clear_sidi_phase(this,actor,id);},
 note_phase_skip(actor,phase,reason,source_skill=null){actor.phase_skip_origins??={};actor.phase_skip_origins[phase]??=[];if(!actor.phase_skip_origins[phase].some(x=>x.reason===reason&&x.source_skill===source_skill))actor.phase_skip_origins[phase].push({reason,source_skill});},
 record_phase_skip(actor,{phase_event_id,phase,turn_id=this.turn_event_counter,reason='phase_skip',source_skill=null}={}){
  if(!actor||!phase_event_id||!['judgment','draw','play','discard'].includes(phase)||turn_id!==this.turn_event_counter||this.actual_turn_active!==true)throw Error('跳过阶段需要真实当前回合与阶段身份');
  this.phase_skip_ledger??=[];const actor_id=this.player_id(actor);
  let row=this.phase_skip_ledger.find(r=>r.actor_id===actor_id&&r.turn_id===turn_id&&r.phase_event_id===phase_event_id);
  if(row&&row.phase!==phase)throw Error('同一阶段身份不能更换阶段');
  if(!row)this.phase_skip_ledger.push(row={actor_id,turn_id,phase_event_id,phase,status:'skipped',reasons:[]});
  const pending=actor.phase_skip_origins?.[phase]??[];
  if(reason==='phase_skip'&&pending.length){for(const origin of pending)if(!row.reasons.some(r=>r.reason===origin.reason&&r.source_skill===origin.source_skill))row.reasons.push({...origin});delete actor.phase_skip_origins[phase];}
  else if(!(reason==='phase_skip'&&row.reasons.length)&&!row.reasons.some(r=>r.reason===reason&&r.source_skill===source_skill))row.reasons.push({reason,source_skill});return copy(row);
 },
 phase_skip_records(actor,turn_id=this.turn_event_counter){return copy((this.phase_skip_ledger??[]).filter(r=>r.actor_id===this.player_id(actor)&&r.turn_id===turn_id));},
 async dispatch_followup_play_begin(actor,event){
  try{for(const holder of this.action_order().filter(p=>p.alive)){
   if(!actor.alive||!this.match_should_continue())break;
   for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_play_phase_begin??[])await hook(this,holder,actor,event);
  }}finally{event.closed=true;}
 },
 async capture_sidi_qian(actor,options={}){
  if(!options.move_id)throw Error('置钤需要稳定移牌身份');
  const prior=this.card_move_receipts?.[JSON.stringify(options.move_id)];
  if(prior){if(prior.request.to!=='qian'||prior.request.recipient!==this.seat_of(actor))throw Error('置钤回执不能更换人物');if(prior.status!=='done')throw Error('置钤事务未完成，须按日志恢复');return {...prior.result};}
  if(actor.dead||options.validate&&!options.validate())return {committed:false};
  // Ordinary exhaustion shuffle is synchronous; the actual top-card removal
  // is part of the destination-first public transaction, never a hand gain.
  if(!this.deck.draw_pile.length&&this.deck.discard_pile.length){this.deck.draw_pile=this.deck.discard_pile;this.deck.discard_pile=[];this.rng.shuffle(this.deck.draw_pile);this.deck.on_reshuffle?.();}
  const index=this.deck.draw_pile.length-1,card=this.deck.draw_pile[index];if(!card)return {committed:false};
  return this.public_card_loss(null,[{zone:'draw_pile',index,card}],
   {...options,to:'qian',recipient:actor,action:'pile_capture',semantic_action:'pile_capture',poison_exempt:true,reason:'司敌置钤'});
 },
 remove_sidi_qian(actor,card,options={}){
  return this.public_card_loss(actor,[{zone:'qian',index:(actor.sgs_followup_qian_pile??[]).indexOf(card),card}],
   {...options,to:'discard',action:'pile_removal',semantic_action:'pile_removal',poison_exempt:true,reason:'司敌移去钤'});
 },
 async clear_sidi_qian(actor,event_id){
  const cards=[...(actor.sgs_followup_qian_pile??[])];if(!cards.length)return;
  await this.public_card_loss(actor,cards.map((card,index)=>({zone:'qian',index,card})),{to:'discard',move_id:`${event_id}:qian`,action:'death_cleanup',semantic_action:'death_cleanup',poison_exempt:true,reason:'阵亡钤清理'});
 },
 record_committed_discard_categories(actor,materials,{action,semantic_action,to,move_id}={}){
  // Discard means the action, not simply entering discard (uses/recasts/normal
  // judgment/cleared piles do not qualify). Record all actors even before copy.
  if(!actor||to!=='discard'||!['discard','mandatory_discard'].includes(semantic_action??action))return;
  const turn_id=this.turn_event_counter;if(!turn_id||this.actual_turn_active!==true)return;
  this.discard_category_history??=[];
  const actor_id=this.player_id(actor),categories=[...new Set(materials.map(m=>m.action_card_family??this.card_family(m.card)))];
  this.discard_category_history.push({actor_id,turn_id,move_id:move_id??null,categories});
 },
 record_response_use_category(actor,event_id){if(this.actual_turn_active!==true||!this.turn_event_counter)return;this.discard_category_history??=[];this.discard_category_history.push({actor_id:this.player_id(actor),turn_id:this.turn_event_counter,move_id:event_id,categories:['basic'],kind:'response_use'});},
 used_or_discarded_card_categories(actor,{turn_id=this.turn_event_counter}={}){
  const actor_id=this.player_id(actor),categories=[];
  for(const use of this.card_use_history?.uses??[])if(use.actor_id===actor_id&&use.turn_id===`turn:${turn_id}`){const c=use.effective_function.category;categories.push(c==='delayed_trick'?'trick':c);}
  for(const row of this.discard_category_history??[])if(row.actor_id===actor_id&&row.turn_id===turn_id)categories.push(...row.categories);
  return [...new Set(categories)].filter(x=>['basic','trick','equipment'].includes(x));
 },
 enqueue_general_state_changed(actor,{state_event_id,kind,from,to,source_skill=null}){
  this.general_state_events??=[];
  if(this.general_state_events.some(e=>e.state_event_id===state_event_id))return;
  this.general_state_events.push({state_event_id,actor_id:this.player_id(actor),kind,from,to,source_skill,committed:true,status:'pending'});
 },
 async flush_general_state_events(){
  // Nested state changes resolve depth-first. Mark dispatching before awaiting,
  // so recursive flush cannot re-enter the suspended parent event.
  for(const row of this.general_state_events??[]){if(row.status!=='pending')continue;
   row.status='dispatching';const actor=this.all_players().find(p=>this.player_id(p)===row.actor_id);
   const event={...row,actor,closed:false};
   try{for(const holder of this.action_order().filter(p=>p.alive)){
    if(!actor||actor.dead||!this.resolution_should_continue())break;
    for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_general_state_changed??[])await hook(this,holder,event);
   }row.status='done';}catch(error){row.status='failed';throw error;}finally{event.closed=true;}
  }
 },
 async set_chained(actor,to,{event_id=null,source_skill=null}={}){
  if(!actor||actor.dead||Boolean(actor.chained)===Boolean(to))return false;
  const id=event_id??`chain:${this.chain_event_counter=(this.chain_event_counter??0)+1}`,from=Boolean(actor.chained);actor.chained=Boolean(to);
  this.enqueue_general_state_changed(actor,{state_event_id:id,kind:'chain',from,to:Boolean(to),source_skill});
  this.view.emit(`${actor.name}${to?'进入连环':'解除连环'}。`,{event_type:'hero_chain',player_id:this.player_id(actor),chained:Boolean(to),source_skill,event_id:id});
  await this.flush_general_state_events();return true;
 },
 followup_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[],has=(ss,field)=>ss.some(s=>ids.includes(s))||Boolean(actor[field]);
  const cz=has(['sgs.sidi'],'sgs_followup_caozhen_state')||Boolean(actor.sgs_followup_sidi_debits?.length),zh=has(['sgs.fenli','sgs.pingkou'],'sgs_followup_zhuhuan_state');
  const cq=has(['sgs.dingpin','sgs.faen'],'sgs_followup_chenqun_state'),zn=has(['sgs.wurong','sgs.shizhi'],'sgs_followup_zhangni_state');if(!cz&&!zh&&!cq&&!zn)return null;
  return {chenqun:cq?sgs_followup_chenqun_public_state(actor,this):null,zhangni:zn?sgs_followup_zhangni_public_state(actor,this):null,caozhen:cz?sgs_followup_caozhen_public_state(actor,this):null,zhuhuan:zh?sgs_followup_zhuhuan_public_state(actor,this):null};
 },
};
