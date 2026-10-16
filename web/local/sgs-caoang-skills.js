/** Classic Mobile 曹昂 / 慷忾. H0–H9 delimit source and mixed-game host policy. */
import {CardType,is_sha_card} from './models.js';
import {SGS_CAOANG_HERO_ID as HERO,SGS_CAOANG_SKILL_IDS as SK} from './sgs-caoang-data.js';
import {caoang_live as live,caoang_pid as pid,caoang_ongoing as ongoing,caoang_owned as owned,caoang_binding as binding,
 caoang_stable as stable,caoang_read as read,caoang_ticket as ticket} from './sgs-caoang-runtime.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const SLOT_BY_TYPE={'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
const key=JSON.stringify,pass=v=>['pass','decline','cancel','0','n','no'].includes(String(v));
const select=(os,v)=>os.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?os[Number(v)-1]:null);
const allied=(g,a,b)=>a===b||typeof g.side_of==='function'&&g.side_of(a)===g.side_of(b);
const face=c=>({name:c.name,type:c.type,suit:c.suit??null,color:c.color??null,rank:c.rank??null});
const need=(g,...ns)=>{for(const n of ns)if(typeof g[n]!=='function')throw Error(`慷忾接入缺少 ${n}`);};
const giftContext=(a,target)=>({to:'hand',recipient:target,visibility:'public',action:'give',semantic_action:'give',payment:false,source:a,source_skill:SK.kangkai,reason:'慷忾赠牌'});
const exact=(os,m)=>m&&os.find(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index&&o.epoch===m.epoch);
const sameRejected=(rejected,m)=>rejected.some(p=>p.card===m.card&&p.zone===m.zone&&p.epoch===m.epoch);
/** Private owner-only query. No judgment or special pile ever enters this list. */
export function sgs_kangkai_materials(g,a,target){
 if(!live(a)||!live(target)||a===target)return [];
 const context=giftContext(a,target),make=(card,zone,index)=>({card,zone,index,epoch:g.card_location_epoch?.(card)??0,
  id:zone==='hand'?`hand:${index+1}`:`eq:${zone}`,label:zone==='hand'?`手牌${index+1}：${card}`:`装备：${card.name}`});
 return [...a.hand.map((c,i)=>make(c,'hand',i)),...SLOTS.flatMap(s=>a[s]?[make(a[s],s,0)]:[])]
  .filter(m=>m.card&&!m.card.virtual&&g.can_give_material?.(a,m,target,context)!==false&&g.can_give_card?.(a,m.card,target,context)!==false
   &&g.can_pay_materials?.(a,[m],context)!==false);
}
const facts=(g,a,target,e)=>({owner_id:pid(g,a),source_id:pid(g,e.source),card_user_id:pid(g,e.card_user),target_id:pid(g,target),
 card_use_id:e.card_use_id,branch_id:e.branch_id,target_window_id:e.target_window_id,target_confirmed_id:e.target_confirmed_id,
 kind:e.kind,source_card_type:(e.source_card??e.damage_card_identity)?.type??null});
function windowValid(g,a,target,e){
 const ps=g.all_players();
 return live(a)&&live(target)&&ps.includes(a)&&ps.includes(target)&&ps.includes(e.source)&&e.card_user===e.source&&e.target===target
  &&e.kind==='sha'&&is_sha_card(e.source_card??e.damage_card_identity)&&!e.closed&&!e.cancelled&&!e.prevented&&ongoing(g)
  &&['card_use_id','branch_id','target_window_id','target_confirmed_id'].every(k=>stable(e[k]));
}
/** Self qualifies at distance zero even though the generic distinct-seat helper floors at one. */
export const sgs_kangkai_distance=(g,a,target)=>a===target?0:g.distance_between(a,target);
export const sgs_kangkai_available=(g,a,target,e={})=>windowValid(g,a,target,e)&&owned(g,a,SK.kangkai)
 &&sgs_kangkai_distance(g,a,target)<=1&&!read(g,a)?.kangkai[key(e.target_confirmed_id)];
/** AI invocation observes only teams and public identity; enemies remain legal to humans. */
export const sgs_ai_kangkai_invoke=(g,a,target)=>allied(g,a,target);
/** Only donor's own options and recipient's publicly visible equipment/HP. */
export function sgs_ai_kangkai_material(g,a,target,options=sgs_kangkai_materials(g,a,target)){
 const utility=m=>{
  const c=m.card,slot=SLOT_BY_TYPE[c.type];
  let help=c.type===CardType.SHAN?9:c.type===CardType.TAO&&target.hp<=2?7:slot&&!target[slot]?8:slot?3:1;
  if(slot==='armor'&&!target.armor)help+=3;
  const cost=(g.material_ai_cost?.(m)??2)+(m.zone==='hand'?0:4)+(c.type===CardType.POISON?30:0);
  return (allied(g,a,target)?help:-help)-cost;
 };
 return [...options].sort((a,b)=>utility(b)-utility(a))[0]??null;
}
function abolished(g,a,slot){return g.is_equipment_slot_abolished?.(a,slot)===true||a[`${slot}_abolished`]===true
 ||[a.abolished_slots,a.abolished_equipment_slots].some(v=>v instanceof Set?v.has(slot):Array.isArray(v)?v.includes(slot):v?.[slot]===true);}
/** No play-phase gate or Slash quota. This is an explicit immediate use window. */
export function sgs_kangkai_can_use_equipment(g,target,card,epoch){
 const slot=SLOT_BY_TYPE[card?.type];
 if(slot&&typeof g.effective_card_definition==='function'){try{g.effective_card_definition(card);}catch{return false;}}
 return Boolean(slot&&live(target)&&ongoing(g)&&!card.virtual&&target.hand.includes(card)&&g.card_location_epoch(card)===epoch
  &&!abolished(g,target,slot)&&!g.card_use_prohibited?.(target,card,{source_skill:SK.kangkai})
  &&g.can_use_equipment_card?.(target,card,{source_skill:SK.kangkai,reason:'慷忾'})!==false
  &&g.can_pay_materials?.(target,[{zone:'hand',index:target.hand.indexOf(card),card,epoch}],{to:'processing',action:'card_use',source_skill:SK.kangkai})!==false);
}
export function sgs_ai_kangkai_equip(g,target,card){
 const slot=SLOT_BY_TYPE[card?.type];if(!slot)return false;
 const old=target[slot];if(!old)return true;
 if(slot==='weapon')return (g.weapon_score?.(card)??card.range??1)>(g.weapon_score?.(old)??old.range??1);
 if(slot==='armor')return card.name!==old.name&&(card.power??0)>=(old.power??0);
 return (card.power??0)>(old.power??0);
}
const meta=(g,actor,r,stage)=>({skill:'慷忾',skill_id:SK.kangkai,source_skill_id:SK.kangkai,stage,private_choice:true,private_to:g.seat_of(actor),
 owner_id:r.request.owner_id,target_id:r.request.target_id,card_use_id:r.request.card_use_id,target_confirmed_id:r.request.target_confirmed_id,host_policy:'H0-H9'});
async function invoke(g,a,target,r,valid){
 if(a.is_ai)return sgs_ai_kangkai_invoke(g,a,target);
 while(valid()){
  const v=await g.view.ask_line(target===a?'慷忾：是否摸一张牌？自己成为目标时只摸牌。':`慷忾：是否摸一张牌，然后必须交给${target.name}一张手牌或装备并展示？`,
   {kind:'choice',player_id:g.seat_of(a),options:[{id:'activate',label:'发动慷忾'},{id:'pass',label:'不发动'}],
    meta:{...meta(g,a,r,'kangkai_invoke'),optional:true,self_target:target===a,distance:sgs_kangkai_distance(g,a,target)}});
  if(!valid()||pass(v))return false;if(['activate','1','y','yes'].includes(String(v)))return true;
 }
 return false;
}
async function chooseGift(g,a,target,r,valid,rejected){
 while(valid()){
  const os=sgs_kangkai_materials(g,a,target).filter(m=>!sameRejected(rejected,m));if(!os.length)return null;
  if(a.is_ai)return sgs_ai_kangkai_material(g,a,target,os);
  const v=await g.view.ask_line(`慷忾已发动：必须交给${target.name}一张手牌或装备并展示`,{kind:'choice',player_id:g.seat_of(a),
   options:os.map(({id,label})=>({id,label})),meta:{...meta(g,a,r,'kangkai_gift'),mandatory:true,optional:false,exact_count:1,material_zones:['hand',...SLOTS]}});
  if(!valid())return null;
  const m=select(os,v);if(m&&exact(sgs_kangkai_materials(g,a,target),m)&&!sameRejected(rejected,m))return m;
  // Cancel, stale index and stale leave/return epoch cannot turn invocation into a free draw.
 }
 return null;
}
async function chooseEquip(g,target,card,r,valid){
 if(target.is_ai)return valid()&&sgs_ai_kangkai_equip(g,target,card);
 while(valid()){
  const v=await g.view.ask_line(`慷忾：是否立即使用刚获得的${card.name}？`,{kind:'choice',player_id:g.seat_of(target),
   options:[{id:'use',label:`立即使用${card.name}`},{id:'keep',label:'保留在手牌'}],
   meta:{...meta(g,target,r,'kangkai_equipment'),optional:true,recipient_chooses:true,gift:{...r.gift}}});
  if(!valid())return false;if(['keep','2'].includes(String(v))||pass(v))return false;if(['use','1','y','yes'].includes(String(v)))return true;
 }
 return false;
}
/** Same host path as ordinary equipment: H→processing, committed use history,
 * equipment-use callback, replacement/loss/entry hooks, cleanup. Never a slot assignment. */
async function useEquipment(g,a,target,card,r,valid){
 need(g,'public_card_loss','start_card_use','end_card_use','equip_card','finish_processing_card');
 const epoch=r.gift.hand_epoch,slot=SLOT_BY_TYPE[card.type],legal=()=>valid()&&sgs_kangkai_can_use_equipment(g,target,card,epoch);
 if(!legal())return false;
 let scope=null,moved=false,processingEpoch=null;
 try{
  const result=await g.public_card_loss(target,[{zone:'hand',index:target.hand.indexOf(card),card,epoch}],{
   to:'processing',visibility:'public',action:'card_use',semantic_action:'card_use',reason:'慷忾使用装备',source:a,source_skill:SK.kangkai,
   move_id:`${r.gift_move_id}:equipment-use`,validate:legal,on_committed:(cards)=>{
    if(cards.length!==1||cards[0]!==card)throw Error('慷忾不能使用替代装备');moved=true;processingEpoch=g.card_location_epoch(card);
    scope=g.start_card_use(target,card,{materials:[card],sourceZones:['hand'],provenance:{kind:'physical',source_skill:SK.kangkai}});
    r.equip_used=true;r.equipment_use_id=scope.use_id;r.status='equip_used';
   }});
  if(Boolean(result?.committed)!==moved)throw Error('慷忾装备使用缺少原子提交回执');
  if(!moved)return false;
  if(live(target)&&ongoing(g)&&g.processing_cards.includes(card)&&g.card_location_epoch(card)===processingEpoch){
   await g.on_equipment_card_use?.(target,card,{reason:'慷忾',source:a,source_skill:SK.kangkai,card_use_id:scope.use_id});
   if(live(target)&&ongoing(g)&&g.processing_cards.includes(card)&&g.card_location_epoch(card)===processingEpoch)
    await g.equip_card(target,slot,card,{reason:'慷忾',source:a,source_skill:SK.kangkai,history_use_id:scope.use_id,card_use_id:scope.use_id});
  }
  r.equipment_installed=target[slot]===card;
  return true;
 }finally{if(moved&&g.card_location_epoch(card)===processingEpoch)g.finish_processing_card(card);g.end_card_use(scope);}
}
/** Global confirmed-target observer. Source/target-only hooks cannot implement this skill. */
export async function sgs_on_any_sha_target_confirmed_kangkai(g,a,target,event={}){
 const request=facts(g,a,target,event),old=read(g,a)?.kangkai[key(event.target_confirmed_id)];
 if(old){const prior=ticket(g,a,request,[event.source,target],old.binding_id);return prior.active?false:old.invoked;}
 if(!sgs_kangkai_available(g,a,target,event))return false;
 need(g,'draw_cards','public_card_loss','card_location_epoch','card_history_material_id');
 if(g.public_card_loss_supports_on_committed!==true)throw Error('慷忾需要原子移牌提交回执');
 const bound=binding(g,a,SK.kangkai),t=ticket(g,a,request,[event.source,target],bound),r=t.row;
 const unchanged=()=>key(facts(g,a,target,event))===key(request)&&event.target===target;
 const valid=()=>windowValid(g,a,target,event)&&unchanged()&&owned(g,a,SK.kangkai)&&binding(g,a,SK.kangkai)===bound&&sgs_kangkai_distance(g,a,target)<=1;
 // H6/H9: committed effects no longer depend on source skill or current distance.
 const continueGift=()=>live(a)&&live(target)&&ongoing(g)&&unchanged()&&!event.closed&&!event.cancelled;
 const stopReason=()=>!ongoing(g)?'match_ended':!live(target)?'target_dead':!live(a)?'owner_dead':'window_invalidated';
 try{
  const accepted=await invoke(g,a,target,r,valid);
  if(!valid()||!accepted){r.declined=valid()&&!accepted;r.stopped=!valid()?'activation_invalidated':null;t.finish();return false;}
  r.invoked=true;r.status='invoked';r.draw_started=true;r.status='drawing';
  const drawn=await g.draw_cards(a,1);r.draw_finished=true;r.draw_count=drawn.length;r.status='drawn';
  if(!continueGift()){r.stopped=stopReason();t.finish();return true;}
  if(a===target){r.self_draw_only=true;t.finish();return true;}
  const rejected=[];let gift=null;
  while(continueGift()&&!r.given){
   r.status='gift_choice';const m=await chooseGift(g,a,target,r,continueGift,rejected);
   if(!continueGift()){r.stopped=stopReason();break;}
   if(!m){r.stopped='no_legal_gift';break;}
   const legal=()=>continueGift()&&Boolean(exact(sgs_kangkai_materials(g,a,target),m));
   if(!legal())continue;
   r.gift_attempts=(r.gift_attempts??0)+1;r.status='giving';
   const move_id=`kangkai:${key([pid(g,a),event.target_confirmed_id])}:gift:${r.gift_attempts}`;
   const result=await g.public_card_loss(a,[m],{...giftContext(a,target),move_id,validate:legal,on_committed:(cards,moved)=>{
    if(cards.length!==1||cards[0]!==m.card||moved.partial)throw Error('慷忾必须交出所选的一张实体牌');
    gift=m.card;r.given=true;r.status='given';r.gift_move_id=moved.move_id;
    const revealedFace=g.effective_card?.(gift,target)??gift;
    r.gift={card_id:g.card_history_material_id(gift),from_zone:m.zone,from_epoch:m.epoch,hand_epoch:g.card_location_epoch(gift),...face(revealedFace)};
    // Commit reveal before any nested loss/death callback can interrupt it.
    r.revealed=true;r.status='revealed';
    g.view.emit(`${a.name}发动慷忾，交给${target.name}并展示${revealedFace}。`,{event_type:'skill_reveal',skill_id:SK.kangkai,
     owner_id:pid(g,a),target_id:pid(g,target),target_confirmed_id:event.target_confirmed_id,move_id:moved.move_id,card:{...r.gift}});
   }});
   if(Boolean(result?.committed)!==(r.given===true))throw Error('慷忾赠牌缺少一致原子回执');
   if(!r.given)rejected.push({...m});
  }
  if(!r.given){r.stopped??=stopReason();t.finish();return true;}
  const equipmentValid=()=>live(target)&&ongoing(g)&&unchanged()&&!event.closed&&!event.cancelled&&sgs_kangkai_can_use_equipment(g,target,gift,r.gift.hand_epoch);
  if(SLOT_BY_TYPE[gift.type]&&equipmentValid()){
   r.equip_offered=true;r.status='equip_offered';const use=await chooseEquip(g,target,gift,r,equipmentValid);
   if(!equipmentValid())r.stopped=!ongoing(g)?'match_ended':!live(target)?'target_dead':'equipment_invalidated';
   else if(!use)r.equip_declined=true;
   else{r.status='equip_using';if(!await useEquipment(g,a,target,gift,r,equipmentValid))r.stopped='equipment_use_prevented';}
  }else if(SLOT_BY_TYPE[gift.type])r.stopped=!ongoing(g)?'match_ended':!live(target)?'target_dead':'equipment_unavailable';
  t.finish();return true;
 }catch(error){t.fail(error);throw error;}
}
sgs_on_any_sha_target_confirmed_kangkai.source_skill_id=SK.kangkai;
export function sgs_caoang_skill_definitions({SkillHooks}){
 return {hooks:{[HERO]:SkillHooks({on_any_sha_target_confirmed:[sgs_on_any_sha_target_confirmed_kangkai]})},active:{[HERO]:[]}};
}
