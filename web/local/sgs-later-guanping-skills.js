/** 关平: complete Mobile catalog126 / classic revision21335 snapshot, 2026-10-15.
 * P0–P6 are explicit shared-host policies, not present-client certification.
 * The host owns lawful Sha commitment, global dispatch and exact-use quota
 * accounting. This module never edits card-use history or aggregate counters. */
import {CardColor, is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_LATER_GUANPING_RULE_IDS = Object.freeze({guanping:'sgs.adapted.base.hero.guan-ping'});
export const SGS_LATER_GUANPING_SKILL_IDS = Object.freeze({longyin:'sgs.longyin'});
export const SGS_LATER_GUANPING_SOURCE = Object.freeze({
  product:'三国杀移动版', variant:'mobile-base-identity-catalog-2026-10-15', selected_mode:'身份', snapshot_date:'2026-10-15',
  official_page_id:126, bwiki_revision:21335, bwiki_revision_date:'2023-02-01T07:12:19Z',
  current_client_verified:false, current_client_rules_verified:false, current_client_hp_verified:false, initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P2','P3','P4','P5','P6']),
  heroes:Object.freeze([Object.freeze({id:SGS_LATER_GUANPING_RULE_IDS.guanping,name:'关平',max_hp:4,starting_hp:4,
    starting_hp_direct_source_value:null,starting_hp_basis:'P0 host full-max initialization',gender:'male',source_faction:'蜀',
    skill_ids:Object.freeze(['sgs.longyin']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({'sgs.longyin':'当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-126.html','https://wiki.biligame.com/msgs/关平?oldid=21335']),
});
export const SGS_LATER_GUANPING_HOST_CONTRACT = Object.freeze({
  hook:'on_committed_sha_use',
  timing:'Once per skill owner and committed actual Sha, after material-loss callbacks/final face and complete target selection, before any target response.',
  event_fields:Object.freeze(['kind','stage','card_use_id','history_use_id','card_user','turn_id','phase_event_id','phase_owner_id','effective_face','physical_cards','physical_material_ids','counted_in_phase_quota','closed']),
  quota_method:'exempt_sha_use_from_play_quota',
  quota_receipt_fields:Object.freeze(['committed','card_use_id','phase_event_id','was_counted','exempted']),
  continuation:'Committed cost survives skill/form loss or nested death. Exempt original-use quota after loss callbacks; red draw only while the skill owner is living.',
  replay:'Finished owner/use receipts are no-ops. Interrupted receipts require original coroutine continuation or full input-log replay; never repay or redraw.',
});
const SK=SGS_LATER_GUANPING_SKILL_IDS.longyin, FIELD='sgs_later_guanping_state';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const stable=id=>typeof id==='string'&&id.length>0&&id===id.trim()||Number.isSafeInteger(id)&&id>0;
const live=actor=>Boolean(actor&&!actor.dead&&actor.hp>0);
const pid=(g,actor)=>g.player_id(actor), seat=(g,actor)=>g.seat_of(actor);
const owned=(g,actor)=>live(actor)&&!actor.skills_disabled&&!actor.disabled_skill_ids?.includes(SK)&&g.has_general_skill?.(actor,SK)===true;
const binding=(g,actor)=>JSON.stringify([g.general_skill_binding_id?.(actor,SK)??pid(g,actor),rule_hero(actor)?.id]);
const key=id=>JSON.stringify(id);
const copy=value=>JSON.parse(JSON.stringify(value));
const pass=value=>['cancel','pass','0','n','no','decline'].includes(String(value));
const select=(options,value)=>options.find(option=>option.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const active=new WeakMap(), refs=new WeakMap();
const statuses=new Set(['offered','paying','cost_committed','exempted','drawing','draw_done','done','failed']);
const replayError=()=>Object.assign(Error('龙吟事务中断；须恢复原协程或按原输入日志重放，不能重复弃牌或摸牌'),{code:'SGS_LATER_GUANPING_REPLAY_REQUIRED'});
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`龙吟接入缺少 ${name}`);}
function validRequest(request){
  return request&&[request.owner_id,request.card_use_id,request.card_user_id,request.turn_id,request.phase_event_id,request.phase_owner_id].every(stable)
    &&(request.history_use_id===null||stable(request.history_use_id))&&request.card_user_id===request.phase_owner_id
    &&request.effective_face&&is_sha_card(request.effective_face)&&typeof request.effective_face.name==='string'
    &&[CardColor.RED,CardColor.BLACK,null].includes(request.effective_face.color)
    &&[null,'string'].includes(request.effective_face.suit===null?null:typeof request.effective_face.suit)
    &&typeof request.counted_in_phase_quota==='boolean'&&Array.isArray(request.physical_material_ids)
    &&request.physical_material_ids.every(stable)&&new Set(request.physical_material_ids).size===request.physical_material_ids.length;
}
function validateState(state){
  if(!state||state.version!==1||!stable(state.owner_id)||!state.uses||typeof state.uses!=='object'||Array.isArray(state.uses))throw Error('Invalid Guan Ping state');
  for(const [id,receipt] of Object.entries(state.uses)){
    if(!receipt||!validRequest(receipt.request)||receipt.request.owner_id!==state.owner_id||id!==key(receipt.request.card_use_id)
      ||!statuses.has(receipt.status)||typeof receipt.committed!=='boolean'||typeof receipt.exempted!=='boolean'||typeof receipt.draw_done!=='boolean'
      ||!Number.isSafeInteger(receipt.drawn)||receipt.drawn<0||receipt.drawn>1
      ||(!receipt.committed&&(receipt.exempted||receipt.draw_done||receipt.drawn>0))
      ||receipt.drawn>0&&receipt.request.effective_face.color!==CardColor.RED
      ||receipt.draw_done&&!receipt.exempted
      ||['cost_committed','exempted','drawing','draw_done'].includes(receipt.status)&&!receipt.committed
      ||['exempted','drawing','draw_done'].includes(receipt.status)&&!receipt.exempted
      ||receipt.status==='draw_done'&&!receipt.draw_done
      ||receipt.status==='done'&&(receipt.outcome==='resolved'?(!receipt.committed||!receipt.exempted):!['no_material','declined_or_stale','unpaid'].includes(receipt.outcome)||receipt.committed))throw Error('Invalid Guan Ping receipt');
  }
  return state;
}
function state(g,owner){
  const id=pid(g,owner);if(!stable(id))throw Error('龙吟需要稳定人物ID');
  const value=owner[FIELD]??={version:1,owner_id:id,uses:{}};validateState(value);
  if(value.owner_id!==id)throw Error('龙吟回执不能继承另一人物');return value;
}
export const sgs_clone_later_guanping_state=owner=>owner?.[FIELD]?copy(validateState(owner[FIELD])):null;
function eventRequest(g,owner,event){
  return {owner_id:pid(g,owner),card_use_id:event.card_use_id,history_use_id:event.history_use_id??null,card_user_id:pid(g,event.card_user),
    turn_id:event.turn_id,phase_event_id:event.phase_event_id,phase_owner_id:event.phase_owner_id,
    effective_face:{type:event.effective_face?.type,name:event.effective_face?.name,color:event.effective_face?.color,suit:event.effective_face?.suit??null},
    counted_in_phase_quota:event.counted_in_phase_quota,physical_material_ids:[...(event.physical_material_ids??[])]};
}
/** A live real PLAY occurrence, not merely the active player's UI or a response.
 * The host supplies a committed-use window that it closes in finally. */
function eligibleEvent(g,event){
  const user=event?.card_user;
  return event?.kind==='card_use'&&event.stage==='committed'&&event.closed===false&&live(user)
    &&[event.card_use_id,event.turn_id,event.phase_event_id,event.phase_owner_id].every(stable)
    &&(event.history_use_id==null||stable(event.history_use_id))&&event.effective_face&&is_sha_card(event.effective_face)
    &&typeof event.effective_face.name==='string'&&[CardColor.RED,CardColor.BLACK,null].includes(event.effective_face.color)
    &&(event.effective_face.suit==null||typeof event.effective_face.suit==='string')
    &&typeof event.counted_in_phase_quota==='boolean'&&Array.isArray(event.physical_cards)&&new Set(event.physical_cards).size===event.physical_cards.length
    &&event.physical_cards.every(card=>card&&typeof card==='object'&&!card.virtual)
    &&Array.isArray(event.physical_material_ids)&&event.physical_material_ids.length===event.physical_cards.length
    &&event.physical_material_ids.every(stable)&&new Set(event.physical_material_ids).size===event.physical_material_ids.length
    &&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_event_counter===event.turn_id
    &&g.active_play_phase_id===event.phase_event_id&&user.play_phase_id===event.phase_event_id
    &&pid(g,user)===event.phase_owner_id&&g.is_own_play_phase(user)===true&&!g.winner;
}
function sameEvent(g,owner,event,request,references){
  return eligibleEvent(g,event)&&JSON.stringify(eventRequest(g,owner,event))===JSON.stringify(request)
    &&event.card_user===references.user&&event.physical_cards.length===references.cards.length
    &&event.physical_cards.every((card,index)=>card===references.cards[index]);
}
function ticket(g,owner,event,request){
  const saved=state(g,owner),id=key(event.card_use_id),prior=saved.uses[id];
  let running=active.get(owner);if(!running)active.set(owner,running=new Set());
  let known=refs.get(owner);if(!known)refs.set(owner,known=new Map());
  const references={user:event.card_user,cards:[...event.physical_cards]};
  if(prior){
    const original=known.get(id);
    if(JSON.stringify(prior.request)!==JSON.stringify(request)||original&&(original.user!==references.user||original.cards.length!==references.cards.length||original.cards.some((card,index)=>card!==references.cards[index])))throw Error('同一龙吟用牌事件不能更换人物、阶段、牌面或实体');
    if(prior.status!=='done'&&!running.has(prior))throw replayError();
    return null;
  }
  const receipt=saved.uses[id]={request:copy(request),status:'offered',committed:false,exempted:false,draw_done:false,drawn:0};
  running.add(receipt);known.set(id,references);
  return {receipt,references,finish(outcome){receipt.status='done';receipt.outcome=outcome;running.delete(receipt);},
    fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
const discardable=(g,owner,material)=>g.can_discard_material?.(owner,material,{chooser:owner,source_skill:SK})!==false
  &&g.can_discard_card?.(owner,material.card,{zone:material.zone,chooser:owner,source_skill:SK})!==false;
/** Only the holder's real hand/equipment. Processing cards and use materials
 * are excluded even when an inconsistent caller still exposes them in a zone. */
export function sgs_longyin_materials(g,owner,event={}){
  if(!live(owner))return [];methods(g,'skill_material_options');
  const excluded=new Set([...(event.physical_cards??[]),...(g.processing_cards??[])]);
  return g.skill_material_options(owner).filter(material=>material?.card&&!material.card.virtual&&!excluded.has(material.card)
    &&(material.zone==='hand'?Number.isInteger(material.index)&&owner.hand[material.index]===material.card:SLOTS.includes(material.zone)&&owner[material.zone]===material.card)
    &&discardable(g,owner,material));
}
const exact=(options,material)=>options.find(option=>option.zone===material?.zone&&option.index===material.index&&option.card===material.card);
export function sgs_longyin_available(g,owner,event){
  if(!owned(g,owner)||!eligibleEvent(g,event))return false;
  if(owner[FIELD]&&state(g,owner).uses[key(event.card_use_id)])return false;
  return sgs_longyin_materials(g,owner,event).length>0;
}
/** Strategy may decline enemy help; legality never filters actors by team. */
export function sgs_ai_longyin_material(g,owner,event){
  if(owner!==event.card_user&&(typeof g.side_of!=='function'||g.side_of(owner)!==g.side_of(event.card_user)))return null;
  if(!event.counted_in_phase_quota&&event.effective_face.color!==CardColor.RED)return null;
  return sgs_longyin_materials(g,owner,event).sort((left,right)=>(g.material_ai_cost?.(left)??1)-(g.material_ai_cost?.(right)??1))[0]??null;
}
function promptMeta(g,owner,request,stage){
  return {skill:'龙吟',skill_id:SK,source_skill_id:SK,stage,private_to:seat(g,owner),owner_id:request.owner_id,
    card_use_id:request.card_use_id,card_user_id:request.card_user_id,phase_event_id:request.phase_event_id,
    used_card_color:request.effective_face.color,quota_was_counted:request.counted_in_phase_quota,
    material_zones:['hand',...SLOTS],allow_enemy_user:true};
}
async function chooseMaterial(g,owner,event,request,valid){
  const answer=await g.view.ask_line(`龙吟：是否弃置一张牌，令${event.card_user.name}的这张杀不计出牌阶段次数？${request.effective_face.color===CardColor.RED?'此杀为红色，你再摸一张牌。':''}`,{
    kind:'choice',player_id:seat(g,owner),options:[{id:'activate',label:'发动龙吟'},{id:'cancel',label:'不发动'}],meta:promptMeta(g,owner,request,'longyin_offer')});
  if(!valid()||pass(answer)||!['activate','1','y','yes'].includes(String(answer)))return null;
  while(valid()){
    const options=sgs_longyin_materials(g,owner,event);if(!options.length)return null;
    const choice=await g.view.ask_line('龙吟：弃置一张自己的手牌或装备',{
      kind:'select_hand',player_id:seat(g,owner),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌'}],meta:promptMeta(g,owner,request,'longyin_material')});
    if(!valid()||pass(choice))return null;
    const material=select(options,choice);if(exact(sgs_longyin_materials(g,owner,event),material))return material;
  }
  return null;
}
/** Direct material is for a trusted caller/tests. Normal hook chooses for the
 * skill holder, never for the active card user or an arbitrary UI seat. */
export async function sgs_longyin_execute(g,owner,event,{material=null,choose=false}={}){
  methods(g,'player_id','seat_of');
  if(!event?.card_user)return false;
  const prior=owner?.[FIELD]&&state(g,owner).uses[key(event.card_use_id)];
  if(prior){ticket(g,owner,event,eventRequest(g,owner,event));return false;}
  if(!owned(g,owner)||!eligibleEvent(g,event))return false;
  methods(g,'public_card_loss','draw_cards','exempt_sha_use_from_play_quota');
  if(g.public_card_loss_supports_on_committed!==true)throw Error('龙吟需要 validate / on_committed 原子移牌边界');
  const request=eventRequest(g,owner,event),transaction=ticket(g,owner,event,request),receipt=transaction.receipt,bound=binding(g,owner);
  const valid=()=>owned(g,owner)&&binding(g,owner)===bound&&sameEvent(g,owner,event,request,transaction.references);
  try{
    if(!sgs_longyin_materials(g,owner,event).length){transaction.finish('no_material');return false;}
    const chosen=choose?(owner.is_ai?sgs_ai_longyin_material(g,owner,event):await chooseMaterial(g,owner,event,request,valid)):material;
    const legal=()=>valid()&&Boolean(exact(sgs_longyin_materials(g,owner,event),chosen));
    if(!legal()){transaction.finish('declined_or_stale');return false;}
    receipt.status='paying';
    const paid=await g.public_card_loss(owner,[chosen],{payment:true,to:'discard',visibility:'public',reason:'龙吟',action:'discard',source:owner,source_skill:SK,
      move_id:`longyin:${key([request.owner_id,request.card_use_id])}:cost`,validate:legal,
      on_committed:cards=>{
        if(receipt.committed||cards.length!==1||cards[0]!==chosen.card)throw Error('龙吟费用回执不匹配');
        receipt.committed=true;receipt.status='cost_committed';receipt.cost_zone=chosen.zone;
      }});
    if((paid?.committed===true)!==receipt.committed)throw Error('龙吟费用缺少或矛盾的原子提交回执');
    if(!receipt.committed){transaction.finish('unpaid');return false;}
    // The frozen original event identifies the old quota row even if nested
    // callbacks killed either actor, removed the skill or changed the phase.
    const committedEvent={...event,kind:'card_use',stage:'committed',card_user:transaction.references.user,card_use_id:request.card_use_id,history_use_id:request.history_use_id,
      turn_id:request.turn_id,phase_event_id:request.phase_event_id,phase_owner_id:request.phase_owner_id,
      effective_face:{...request.effective_face},physical_cards:[...transaction.references.cards],physical_material_ids:[...request.physical_material_ids],counted_in_phase_quota:request.counted_in_phase_quota};
    const quota=g.exempt_sha_use_from_play_quota(committedEvent,{owner_id:request.owner_id,source_skill:SK});
    if(quota?.then||quota?.committed!==true||quota.card_use_id!==request.card_use_id||quota.phase_event_id!==request.phase_event_id
      ||typeof quota.was_counted!=='boolean'||quota.exempted!==true)throw Error('龙吟需要同一张杀的同步阶段次数豁免回执');
    receipt.exempted=true;receipt.quota_was_counted=quota.was_counted;receipt.status='exempted';
    if(request.effective_face.color===CardColor.RED&&live(owner)){
      receipt.status='drawing';const drawn=await g.draw_cards(owner,1);
      if(!Array.isArray(drawn)||drawn.length>1)throw Error('龙吟摸牌需要真实牌数组回执');
      receipt.drawn=drawn.length;receipt.draw_done=true;receipt.status='draw_done';
    }else receipt.draw_skipped=!live(owner)?'owner_not_living':'not_red';
    g.view.emit(`${owner.name}发动龙吟，令${transaction.references.user.name}的这张杀不计出牌阶段次数${receipt.drawn?'，并摸一张牌':''}。`,{
      event_type:'longyin_resolved',skill_id:SK,source_skill_id:SK,owner_id:request.owner_id,card_user_id:request.card_user_id,
      card_use_id:request.card_use_id,phase_event_id:request.phase_event_id,used_card_color:request.effective_face.color,drawn:receipt.drawn,quota_exempt:true});
    transaction.finish('resolved');return true;
  }catch(error){transaction.fail(error);throw error;}
}
export const sgs_resolve_longyin=sgs_longyin_execute;
export const sgs_longyin_on_committed_sha_use=(g,owner,event)=>sgs_longyin_execute(g,owner,event,{choose:true});
export function sgs_later_guanping_public_state(owner){
  if(!owner?.[FIELD])return {longyin_events:[]};
  return {longyin_events:Object.values(validateState(owner[FIELD]).uses).map(receipt=>({
    card_use_id:receipt.request.card_use_id,card_user_id:receipt.request.card_user_id,phase_event_id:receipt.request.phase_event_id,
    status:receipt.status,committed:receipt.committed,exempted:receipt.exempted,draw_done:receipt.draw_done,drawn:receipt.drawn,
    used_card_color:receipt.request.effective_face.color,quota_was_counted:receipt.quota_was_counted??receipt.request.counted_in_phase_quota,
    outcome:receipt.outcome??null,
  }))};
}
export function sgs_later_guanping_skill_definitions({SkillHooks}){
  return {hooks:{[SGS_LATER_GUANPING_RULE_IDS.guanping]:SkillHooks({on_committed_sha_use:[sgs_longyin_on_committed_sha_use]})},active:{}};
}
