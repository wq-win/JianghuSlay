/** Historical 花木兰, with HM1–HM12 explicit Jianghu interpretations.
 * The host owns finalized death archives, complete skill lifecycle and equipment
 * provenance. This module owns awaited skill transactions, never registry setup.
 */
import {CardType} from './models.js';
import {rule_hero} from './effective-hero.js';
import {seat_player_id,stable_actor_id} from './seat-order.js';
export const YXS_EIGHTH_RULE_ID='yxs.adapted.base.hero.hua-mu-lan';
export const YXS_EIGHTH_SKILLS=Object.freeze({mili:'yxs.mili',yizhuang:'yxs.yizhuang'});
export const YXS_EIGHTH_SOURCE=Object.freeze({
  id:YXS_EIGHTH_RULE_ID,display_name:'花木兰',max_hp:3,gender:'female',faction:'臣',
  full_skill_names:Object.freeze(['迷离','易装']),
  source_variant:'historical-mobile-2015+desktop-2012+Jianghu-HM1-HM12',
  historical_full_skill_and_own_faq_verified:true,current_client_rules_verified:false,
  source_only_exact_for_every_edge:false,production_integration_verified:false,
  adaptation_decisions:Object.freeze(Array.from({length:12},(_,i)=>`HM${i+1}`)),
  source_urls:Object.freeze([
    'https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304239.shtml',
    'https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63830.shtml',
  ]),
});
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SLOT_TYPE=Object.freeze({weapon:CardType.WEAPON,armor:CardType.ARMOR,offensive_horse:CardType.OFFENSIVE_HORSE,defensive_horse:CardType.DEFENSIVE_HORSE});
const id=(g,p,d)=>seat_player_id(g,p,d);
const keyOf=value=>JSON.stringify(stable_actor_id(value));
const ongoing=g=>g.match_should_continue?g.match_should_continue():g.turn_phase!=='finished';
const own=(g,p,skill,d)=>{
  if(typeof d.has_skill!=='function')throw Error('Hua module requires effective has_skill(game, actor, skill_id)');
  return Boolean(d.has_skill(g,p,skill));
};
const ownPlay=(g,p)=>Boolean(p&&!p.dead&&!p.skip_play_stage&&g.is_own_play_phase?.(p));
const phase=g=>({turn:g.turn_event_counter??null,phase:g.play_phase_event_counter??null,actor:g.turn_actor??null,stage:g.turn_phase??null});
const samePhase=(g,before)=>JSON.stringify(phase(g))===JSON.stringify(before);
function state(g){
  const s=g.yxs_eighth_state??={version:1,counter:0,yizhuang:{},mili:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||!s.yizhuang||Array.isArray(s.yizhuang)||!s.mili||Array.isArray(s.mili))throw Error('Invalid Hua transaction state');
  return s;
}
const runtimes=new WeakMap();
const runtime=g=>{let r=runtimes.get(g);if(!r)runtimes.set(g,r={pending:new Map(),references:new Map(),actorPending:new Map(),prompts:new Map()});return r;};
function nextId(g,prefix){const s=state(g);if(s.counter===Number.MAX_SAFE_INTEGER)throw Error('Hua event counter exhausted');return `${prefix}:${++s.counter}`;}
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const samePhysical=(a,b)=>a===b||physicalId(a)!==null&&physicalId(a)===physicalId(b);
const cardRecord=c=>({physical_id:physicalId(c),name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const replayError=()=>Object.assign(Error('Hua transaction interrupted; restore its original task or replay the action log. Do not pay or draw again.'),{code:'HUA_PENDING_REPLAY_REQUIRED'});
function prior(g,namespace,event_id,request,refs,{reentrant=false}={}){
  const key=keyOf(event_id),receipt=state(g)[namespace][key],rt=runtime(g),runtimeKey=`${namespace}:${key}`;
  if(!receipt)return null;
  if(JSON.stringify(receipt.request)!==JSON.stringify(request))throw Error('A Hua event ID cannot change its actor, materials, form or equipment loss');
  const original=rt.references.get(runtimeKey);
  if(original&&(refs.length!==original.length||refs.some((v,i)=>v!==original[i])))throw Error('A Hua event ID cannot substitute physical references');
  if(rt.pending.has(runtimeKey)){if(reentrant)throw replayError();return rt.pending.get(runtimeKey);}
  if(receipt.status==='done')return Promise.resolve(receipt.result);
  throw replayError();
}
function run(g,namespace,event_id,request,refs,body){
  const key=keyOf(event_id),runtimeKey=`${namespace}:${key}`,rt=runtime(g);
  const receipt=state(g)[namespace][key]={event_id,request,status:'pending',stage:'validate',committed:false};
  rt.references.set(runtimeKey,refs);
  const task=Promise.resolve().then(()=>body(receipt)).catch(error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>rt.pending.delete(runtimeKey));
  rt.pending.set(runtimeKey,task);return task;
}
const finish=(receipt,result)=>{receipt.status='done';receipt.stage='complete';receipt.result=result;return result;};
export function yxs_yizhuang_materials(game,actor){
  return game.skill_material_options(actor).filter(m=>m.zone==='hand'&&m.card&&!m.card.virtual);
}
/** Host candidates already prove finalized death, current dead status, trusted
 * complete template implementation and this match's physical player identity.
 * Never reconstruct candidates from the selection roster or a display name.
 */
export function yxs_yizhuang_forms(game,actor){
  if(typeof game.yizhuang_candidates!=='function')throw Error('易装 requires the pure yizhuang_candidates host contract');
  const forms=game.yizhuang_candidates(actor);
  if(!Array.isArray(forms))throw Error('yizhuang_candidates must return a trusted candidate array');
  return forms.filter(f=>f&&f.gender==='male'&&Number.isSafeInteger(f.max_hp)&&f.max_hp>0&&f.hero?.id
    &&Array.isArray(f.skill_ids)&&f.skill_ids.length>0&&f.skill_ids.every(s=>typeof s==='string'&&s.length>0)
    &&['string','number'].includes(typeof f.death_id)&&String(f.death_id).length>0
    &&['string','number'].includes(typeof f.player_id)&&String(f.player_id).length>0);
}
export function yxs_yizhuang_available(game,actor,dependencies={}){
  return own(game,actor,YXS_EIGHTH_SKILLS.yizhuang,dependencies)&&ownPlay(game,actor)&&ongoing(game)
    &&yxs_yizhuang_materials(game,actor).length>=2&&yxs_yizhuang_forms(game,actor).length>0;
}
const findForm=(g,a,death_id)=>yxs_yizhuang_forms(g,a).find(f=>f.death_id===death_id)??null;
const formRecord=f=>({death_id:f.death_id,player_id:f.player_id,hero_id:f.hero.id,max_hp:f.max_hp,gender:f.gender,skill_ids:[...f.skill_ids]});
/** Exact two-H payment commits once, under the OLD skill set. All poison,
 * rescue and last-card effects complete before checking and applying the form.
 * No refund is attempted if an already committed cost interrupts the skill.
 */
export function yxs_resolve_yizhuang(game,actor,death_id,materials,{event_id=null,dependencies={},reentrant=false}={}){
  materials=Array.isArray(materials)?materials.map(m=>({...m})):[];
  if(event_id===null)do{event_id=nextId(game,'yizhuang');}while(Object.hasOwn(state(game).yizhuang,keyOf(event_id)));
  const request={actor_id:id(game,actor,dependencies),death_id,materials:materials.map(m=>({zone:m.zone??null,index:m.index??null,card:cardRecord(m.card)}))};
  const refs=[actor,...materials.map(m=>m.card)],rt=runtime(game),actorKey=keyOf(request.actor_id),startPhase=phase(game);
  try{
    stable_actor_id(death_id);
    const old=prior(game,'yizhuang',event_id,request,refs,{reentrant});if(old)return old;
    // Different action IDs cannot interleave two old-skill cost transactions.
    if(rt.actorPending.has(actorKey))return Promise.reject(Object.assign(Error('易装已有待完成事务，不能重复支付成本。'),{code:'HUA_YIZHUANG_BUSY'}));
    if(Object.values(state(game).yizhuang).some(r=>r.request.actor_id===request.actor_id&&r.status!=='done'))throw replayError();
  }catch(error){return Promise.reject(error);}
  const task=run(game,'yizhuang',event_id,request,refs,async receipt=>{
    const noPay=()=>finish(receipt,{event_id,committed:false,transformed:false});
    if(!samePhase(game,startPhase)||!yxs_yizhuang_available(game,actor,dependencies)||materials.length!==2||new Set(materials.map(m=>m.card)).size!==2)return noPay();
    const current=yxs_yizhuang_materials(game,actor),candidate=findForm(game,actor,death_id);
    if(!candidate||materials.some(m=>!current.some(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index)))return noPay();
    if(typeof game.public_card_loss!=='function'||typeof game.apply_yizhuang!=='function')throw Error('易装 requires atomic awaited public_card_loss and apply_yizhuang host contracts');
    receipt.phase=startPhase;receipt.form=formRecord(candidate);receipt.stage='cost';receipt.move_id=`yizhuang-cost:${keyOf(event_id)}`;
    let moved;
    try{moved=await game.public_card_loss(actor,materials,{to:'discard',visibility:'public',reason:'易装',action:'discard',move_id:receipt.move_id});}
    finally{receipt.committed=Boolean(moved?.committed??game.card_move_receipts?.[keyOf(receipt.move_id)]?.committed);}
    if(!receipt.committed)return noPay();
    const interrupted=()=>finish(receipt,{event_id,committed:true,transformed:false,interrupted:true});
    if(actor.dead||!ongoing(game)||!samePhase(game,startPhase)||!ownPlay(game,actor)||!own(game,actor,YXS_EIGHTH_SKILLS.yizhuang,dependencies))return interrupted();
    const fresh=findForm(game,actor,death_id);
    if(!fresh||JSON.stringify(formRecord(fresh))!==JSON.stringify(receipt.form))return interrupted();
    receipt.stage='transform';receipt.transition_id=`yizhuang-form:${keyOf(event_id)}`;
    const applied=await game.apply_yizhuang(actor,death_id,{transition_id:receipt.transition_id});
    // Host adapters return an explicit transition outcome, never infer success
    // from an identity-changing animation or a missing return value.
    const transformed=applied===true||applied?.transformed===true||applied?.applied===true;
    return finish(receipt,{event_id,committed:true,transformed,death_id,transition_id:receipt.transition_id,...(!transformed?{interrupted:true}:{})});
  });
  rt.actorPending.set(actorKey,task);
  task.then(()=>{if(rt.actorPending.get(actorKey)===task)rt.actorPending.delete(actorKey);},()=>{if(rt.actorPending.get(actorKey)===task)rt.actorPending.delete(actorKey);});
  return task;
}
function formOption(f){
  const name=f.hero.display_name??f.hero.name??f.hero.id,skills=f.hero.skill_name??f.skill_ids.join('、');
  return {id:String(f.death_id),label:`${name}；男性；${f.max_hp}血上限；完整技能：${skills||'无'}（失去当前人物技能）`,hero:f.hero,
    snapshot_id:f.death_id,player_id:f.player_id,gender:f.gender,max_hp:f.max_hp,skill_ids:[...f.skill_ids]};
}
async function playerYizhuang(game,actor,args,dependencies){
  if(!yxs_yizhuang_available(game,actor,dependencies))return true;
  const before=phase(game),options=yxs_yizhuang_materials(game,actor);
  const parse=answer=>String(answer).trim().split(/\s+/).map(value=>options.find(o=>o.id===value||String(o.index+1)===value));
  const valid=pair=>pair.length===2&&pair.every(Boolean)&&pair[0].card!==pair[1].card;
  let pair;
  if(args.length){pair=parse(args.join(' '));if(!valid(pair))return false;}
  else while(!pair){
    const answer=String(await game.view.ask_line('易装：选择两张不同的手牌，编号空格分隔；取消不付费。',{
      kind:'select_hand',player_id:id(game,actor,dependencies),min_count:2,max_count:2,
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消'}],
      meta:{skill:'易装',skill_id:YXS_EIGHTH_SKILLS.yizhuang,stage:'yizhuang_material',material_zones:['hand'],private_to:id(game,actor,dependencies)},
    })).trim();
    if(['cancel','0'].includes(answer)||!samePhase(game,before)||!yxs_yizhuang_available(game,actor,dependencies))return true;
    const choice=parse(answer);if(valid(choice))pair=choice;else game.view.emit('必须选择两张不同的本人手牌。');
  }
  if(!samePhase(game,before)||!yxs_yizhuang_available(game,actor,dependencies))return true;
  const forms=yxs_yizhuang_forms(game,actor),choices=forms.map(formOption);let selected=null;
  while(!selected){
    const answer=String(await game.view.ask_line('易装：选择本局仍阵亡的男性形态；会失去当前全部人物技能。',{
      kind:'choice',player_id:id(game,actor,dependencies),options:[...choices,{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill:'易装',skill_id:YXS_EIGHTH_SKILLS.yizhuang,stage:'yizhuang_form'},
    })).trim();
    if(['cancel','0'].includes(answer)||!samePhase(game,before)||!yxs_yizhuang_available(game,actor,dependencies))return true;
    const option=choices.find(o=>o.id===answer)??(/^\d+$/.test(answer)?choices[Number(answer)-1]:null);
    selected=forms.find(f=>f.death_id===option?.snapshot_id)??null;
    if(!selected)game.view.emit('请选择本局已阵亡男性形态，或取消。');
  }
  if(samePhase(game,before))await yxs_resolve_yizhuang(game,actor,selected.death_id,pair,{dependencies});
  return true;
}
export function yxs_player_yizhuang(game,actor,_fallback,args=[],dependencies={}){
  const prompts=runtime(game).prompts;
  if(prompts.has(actor))return prompts.get(actor);
  const task=playerYizhuang(game,actor,args,dependencies).finally(()=>prompts.delete(actor));prompts.set(actor,task);return task;
}
/** Conservative policy, not a legality rule: increase public template max HP,
 * preserve recovery/dodge cards and never pay poison. Only own hand is read.
 */
export async function yxs_ai_yizhuang(game,actor,dependencies={}){
  if(!yxs_yizhuang_available(game,actor,dependencies))return false;
  const current=game.effective_max_hp?.(actor)??rule_hero(actor)?.max_hp??actor.hp;
  const forms=yxs_yizhuang_forms(game,actor).filter(f=>f.max_hp>current).sort((a,b)=>b.max_hp-a.max_hp||b.skill_ids.length-a.skill_ids.length||String(a.death_id).localeCompare(String(b.death_id)));
  if(!forms.length)return false;
  const materials=yxs_yizhuang_materials(game,actor).filter(m=>!['毒',CardType.TAO,CardType.SHAN].includes(m.card.type))
    .sort((a,b)=>(game.material_ai_cost?.(a)??0)-(game.material_ai_cost?.(b)??0)||a.index-b.index).slice(0,2);
  if(materials.length!==2)return false;
  return (await yxs_resolve_yizhuang(game,actor,forms[0].death_id,materials,{dependencies})).committed;
}
/** Called only after the destination and equipment's own leave effect commit.
 * from_zone + committed are host provenance; destination can be any legal zone,
 * including the owner's hand. HP<=0 is intentionally NOT final death (HM12).
 */
export function yxs_mili_equipment_leave(game,actor,card,context={},dependencies={}){
  context={...context};
  const event_id=context.equipment_loss_id;
  let request;
  try{
    stable_actor_id(event_id);
    request={actor_id:id(game,actor,dependencies),card:cardRecord(card),slot:context.slot??null,from_zone:context.from_zone??null,committed:context.committed===true,
      reason:context.reason??null,suppression_reason:context.suppression_reason??null};
    const old=prior(game,'mili',event_id,request,[actor,card],{reentrant:context.reentrant});if(old)return old;
  }catch(error){return Promise.reject(error);}
  return run(game,'mili',event_id,request,[actor,card],async receipt=>{
    const skip=reason=>finish(receipt,{equipment_loss_id:event_id,triggered:false,drawn:0,suppression_reason:reason});
    if(context.committed!==true||!SLOTS.includes(context.slot)||context.from_zone!==context.slot||!card||card.virtual||(context.equipment_face??card).type!==SLOT_TYPE[context.slot]
      ||SLOTS.some(slot=>samePhysical(actor?.[slot],card)))return skip('invalid_equipment_loss');
    receipt.committed=true;
    if(!actor||actor.dead)return skip('final_dead');
    if(!own(game,actor,YXS_EIGHTH_SKILLS.mili,dependencies))return skip('skill_unavailable');
    if([context.reason,context.suppression_reason].includes('lord_kills_loyalist_penalty')){
      game.view?.emit?.(`${actor.name}因主公击杀忠臣处罚失去装备，迷离不触发。`,{event_type:'mili_suppressed',actor_id:request.actor_id,equipment_loss_id:event_id,suppression_reason:'lord_kills_loyalist_penalty'});
      return skip('lord_kills_loyalist_penalty');
    }
    if(typeof game.draw_cards!=='function')throw Error('迷离 requires awaited draw_cards host contract');
    receipt.stage='draw';const cards=await game.draw_cards(actor,2),drawn=Array.isArray(cards)?cards.length:2;
    const result={equipment_loss_id:event_id,triggered:true,drawn};
    finish(receipt,result);
    game.view?.emit?.(`${actor.name}因${card.name??'装备'}离开装备区触发迷离，摸2张牌。`,{event_type:'mili',actor_id:request.actor_id,equipment_loss_id:event_id,slot:context.slot,requested:2,drawn});
    return result;
  });
}
export function yxs_eighth_skill_definitions({SkillHooks,ActiveSkillDef,has_skill,dependencies={}}){
  const deps={...dependencies,has_skill:has_skill??dependencies.has_skill};
  if(typeof deps.has_skill!=='function')throw Error('Hua registration requires effective has_skill');
  const active=new ActiveSkillDef({skill_id:'易装',hotkey:'q',button_label:'易装',
    help_text:'易装：弃两张手牌，获得本局仍阵亡男性英雄的完整人物技能、血量模板及男性性别；失去当前人物技能。上限提高不回血。',
    player:(g,a,t,args=[])=>yxs_player_yizhuang(g,a,t,args,deps),ai:(g,a)=>yxs_ai_yizhuang(g,a,deps),available:(g,a)=>yxs_yizhuang_available(g,a,deps),
    arg_mode:'none',min_cards:2,max_cards:2,card_filter:'any'});
  active.owns_target_selection=true;
  return {hooks:{[YXS_EIGHTH_RULE_ID]:SkillHooks({on_equipment_leave:[(g,a,c,context)=>yxs_mili_equipment_leave(g,a,c,context,deps)]})},active:{[YXS_EIGHTH_RULE_ID]:[active]}};
}
