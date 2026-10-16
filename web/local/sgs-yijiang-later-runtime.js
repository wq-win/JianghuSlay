/** V29 shared host windows. Source boundaries are recorded with each packet. */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {sgs_later_caochong_public_state} from './sgs-later-caochong-skills.js';
import {sgs_later_guanping_public_state} from './sgs-later-guanping-skills.js';
import {sgs_later_yufan_public_state} from './sgs-later-yufan-skills.js';
import {sgs_later_guohuai_public_state} from './sgs-later-guohuai-skills.js';
const slotByType={'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
const copy=x=>JSON.parse(JSON.stringify(x));
const quotaFacts=(g,e)=>({card_use_id:e.card_use_id,history_use_id:e.history_use_id??null,actor_id:g.player_id(e.card_user),turn_id:e.turn_id,phase_event_id:e.phase_event_id,phase_owner_id:e.phase_owner_id,effective_face:{...e.effective_face},physical_material_ids:[...e.physical_material_ids],counted_in_phase_quota:e.counted_in_phase_quota});
export const yijiangLaterRuntimeMethods={
 record_card_location(card,to){
  // Movement identity is opaque: private transfers must never inspect a face
  // or even a virtual flag. Zone validators own material eligibility.
  if(!card)return;
  this.card_location_epochs??=[];let row=this.card_location_epochs.find(r=>r.card===card);
  if(!row)this.card_location_epochs.push(row={card,epoch:0});row.epoch++;row.to=to;
 },
 card_location_epoch(card){return this.card_location_epochs?.find(r=>r.card===card)?.epoch??0;},
 validate_discard_origin(materials,{origin_move_id,source,top_order}){
  const origin=this.card_move_receipts?.[JSON.stringify(origin_move_id)];
  if(!origin?.committed||origin.request.to!=='discard'||origin.request.action!=='discard'||origin.request.owner!==this.seat_of(source)||top_order!=='first_selected_is_top')return false;
  return materials.every(m=>m.zone==='discard'&&origin.locations?.some(r=>r.physical_id===this.card_history_material_id(m.card)&&r.epoch===this.card_location_epoch(m.card)));
 },
 async dispatch_committed_sha_use(event){
  const facts=quotaFacts(this,event),row=this.sha_phase_use_receipts[event.card_use_id];
  if(!row||row.actor_id!==facts.actor_id||row.phase_event_id!==facts.phase_event_id)throw Error('杀使用次数缺少对应阶段回执');
  row.facts=copy(facts);
  try{for(const owner of this.action_order()){
   if(!owner.alive)continue;
   for(const hook of skill_hooks_for_hero(rule_hero(owner))?.on_committed_sha_use??[])await hook(this,owner,event);
  }}finally{event.closed=true;row.window_closed=true;}
 },
 exempt_sha_use_from_play_quota(event,{owner_id,source_skill}={}){
  const row=this.sha_phase_use_receipts?.[event.card_use_id],facts=quotaFacts(this,event);
  if(!row?.facts||JSON.stringify(row.facts)!==JSON.stringify(facts)||source_skill!=='sgs.longyin'||!this.all_players().some(p=>this.player_id(p)===owner_id))throw Error('龙吟不能豁免另一次使用或另一个阶段');
  const was_counted=row.counted===true&&!row.exempted;
  if(was_counted&&event.card_user.play_phase_id===row.phase_event_id){
   if(!(event.card_user.sha_count_this_play_phase>0))throw Error('杀阶段次数回执与计数不一致');
   event.card_user.sha_count_this_play_phase--;
  }
  row.exempted=true;row.exempted_by??=[];if(!row.exempted_by.includes(owner_id))row.exempted_by.push(owner_id);
  return {committed:true,card_use_id:event.card_use_id,phase_event_id:row.phase_event_id,was_counted,exempted:true};
 },
 async dispatch_before_any_receiving_damage(event){
  event.damage_window='global_before_damage';
  for(const owner of this.action_order()){
   if(event.prevented||event.cancelled||event.damage<=0||event.target.dead)break;
   if(!owner.alive)continue;
   for(const hook of skill_hooks_for_hero(rule_hero(owner))?.before_any_receiving_damage??[]){
    await hook(this,owner,event);if(event.prevented||event.cancelled||event.damage<=0||event.target.dead)break;
   }
  }
 },
 async sgs_later_commit_renxin_cost(owner,material,{event_id,source_skill,validate,on_flip_committed,on_committed}={}){
  let flipped=false;
  const moved=await this.public_card_loss(owner,[material],{payment:true,to:'discard',action:'discard',reason:'仁心',source_skill,move_id:event_id,validate,
   before_atomic_commit:()=>{
    const from=owner.face_orientation??'face_up';
    flipped=this.flip_general_atomic(owner,{source_skill,event_id:`${event_id}:flip`});
    if(!flipped)throw Error('仁心翻面回执重复或失效');
    on_flip_committed?.({from,to:owner.face_orientation,event_id:`${event_id}:flip`});
   },on_committed});
  return {...moved,flipped};
 },
 async use_skill_equipment_card(recipient,card,{source=null,source_skill=null,event_id,validate,on_committed}={}){
  const slot=slotByType[card?.type];
  const legal=()=>!!slot&&!recipient.dead&&recipient.alive&&recipient.hand.includes(card)&&!card.virtual
   &&(!validate||validate())&&!this.card_use_prohibited?.(recipient,card)
   &&!this.is_equipment_slot_abolished?.(recipient,slot)&&!recipient[`${slot}_abolished`]
   &&![recipient.abolished_slots,recipient.abolished_equipment_slots].some(v=>v instanceof Set?v.has(slot):Array.isArray(v)?v.includes(slot):v?.[slot]===true);
  if(!legal())return {committed:false};
  let scope=null,committed=false;
  try{
   const result=await this.public_card_loss(recipient,[{zone:'hand',index:recipient.hand.indexOf(card),card}],{to:'processing',action:'card_use',reason:'直言使用装备',source,source_skill,move_id:`${event_id}:equipment-use`,validate:legal,
    on_committed:()=>{scope=this.start_card_use(recipient,card,{materials:[card],sourceZones:['hand'],provenance:{kind:'physical',source_skill}});committed=true;on_committed?.(scope);}});
   if(!result.committed)return {committed:false};
   if(recipient.alive&&this.processing_cards.includes(card))await this.equip_card(recipient,slot,card,{source,source_skill,history_use_id:scope.use_id});
   return {committed,use_id:scope.use_id};
  }finally{if(committed)this.finish_processing_card(card);this.end_card_use(scope);}
 },
 yijiang_later_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[];
  const present=(skills,field)=>skills.some(s=>ids.includes(s))||actor[field];
  if(!present(['sgs.chengxiang','sgs.renxin'],'sgs_later_caochong_state')&&!present(['sgs.longyin'],'sgs_later_guanping_state')&&!present(['sgs.zongxuan','sgs.zhiyan'],'sgs_later_yufan_state')&&!present(['sgs.jingce'],'sgs_later_guohuai_state'))return null;
  return {caochong:present(['sgs.chengxiang','sgs.renxin'],'sgs_later_caochong_state')?sgs_later_caochong_public_state(actor):null,
   guanping:present(['sgs.longyin'],'sgs_later_guanping_state')?sgs_later_guanping_public_state(actor):null,
   yufan:present(['sgs.zongxuan','sgs.zhiyan'],'sgs_later_yufan_state')?sgs_later_yufan_public_state(actor):null,
   guohuai:present(['sgs.jingce'],'sgs_later_guohuai_state')?sgs_later_guohuai_public_state(actor):null};
 },
};
