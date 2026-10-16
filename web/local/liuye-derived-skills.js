import {rule_hero} from './effective-hero.js';
/** Full mobile Liu Ye, 2021-08-03 official adjustment. See the accompanying
 * implementation document for source conflicts and declared mixed-game rules. */
import {Card,CardType,is_sha_type} from './models.js';
import {LIUYE_HERO_ID,is_piliche} from './derived-equipment.mjs';
export const LIUYE_RULE_ID=LIUYE_HERO_ID;
const alive=p=>!!p?.alive&&!p.dead;
const enabled=p=>alive(p)&&rule_hero(p)?.id===LIUYE_RULE_ID&&!p.skills_disabled&&!p.skill_disabled;
const emit=(g,text)=>g.view.emit(text);
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const cancelled=value=>['cancel','pass','refuse','0','n'].includes(String(value));
const receipt=(game,key)=>{game.derived_event_receipts??=Object.create(null);if(game.derived_event_receipts[key])return false;game.derived_event_receipts[key]=true;return true;};
const eventKey=(game,kind,event)=>event?.event_id??event?.id??`${kind}:${kind==='turn'?game.turn_event_counter:game.play_phase_event_counter??game.turn_event_counter}:${game.round_no}:${game.turn_actor}`;
const isOwnPlay=(g,a)=>enabled(a)&&g.turn_actor===g.seat_of(a)&&g.turn_phase==='play'&&!a.skip_play_stage;

/** Only rules with an implemented direct card-damage channel are copyable.
 * This whitelist is a compatibility contract, never a fallback-to-SHA rule. */
export const CHOULUE_CARD_RULES=Object.freeze([
  ['杀','杀','jianghu.shared.basic.sha','single'],
  ['火杀','火杀','sgs.shared.basic.fire-sha','single'],
  ['雷杀','雷杀','sgs.shared.basic.thunder-sha','single'],
  ['血杀','血杀','yxs.zhuque.basic.blood-sha','single'],
  ['毒杀','毒杀','yxs.zhuque.basic.poison-sha','single'],
  ['刺杀','刺杀','sgs.mobile.youjian.cisha.20200921','single'],
  ['趁火打劫','锦囊','sgs.mobile.youjian.chenhuo_dajie.20200921','single'],
  ['美人计','锦囊','sgs.mobile.wangyun.meirenji','single'],
  ['笑里藏刀','锦囊','sgs.mobile.wangyun.xiaolicangdao','single'],
  ['决斗','锦囊','jianghu.shared.trick.duel','single'],
  ['火攻','锦囊','sgs.adapted.trick.fire-attack','single'],
  ['万箭齐发','锦囊','jianghu.shared.trick.archery-attack','all_others'],
  ['烽火狼烟','锦囊','yxs.shared.trick.barbarian-assault','all_others'],
].map(([name,type,id,target_mode])=>Object.freeze({name,type,id,target_mode})));
const byId=Object.freeze(Object.fromEntries(CHOULUE_CARD_RULES.map(rule=>[rule.id,rule])));
const byName=Object.freeze(Object.fromEntries(CHOULUE_CARD_RULES.map(rule=>[rule.name,rule])));

/** Called once for final actual positive damage, before any nested damage in
 * rescue/on-damage callbacks. The latest causal event must win chronologically. */
export function liuye_record_damage(game,target,event){
  if(rule_hero(target)?.id!==LIUYE_RULE_ID||!(event?.damage>0)||!event.source_card
    ||!['sha','duel','scroll','chain'].includes(event.kind))return false;
  const source=event.source_card;
  if(['手捧雷','画地为牢','兵粮寸断'].includes(source.name)||source.rule_type==='延时锦囊')return false;
  let name=source.name;
  if(is_sha_type(source.type)){
    name=source.type;
    if([CardType.SHA,CardType.FIRE_SHA,CardType.THUNDER_SHA].includes(source.type))name=event.nature==='fire'?'火杀':event.nature==='thunder'?'雷杀':source.type;
  }
  const rule=byName[name];if(!rule||rule.type!==source.type&&!(is_sha_type(rule.type)&&is_sha_type(source.type)))return false;
  target.liuye_last_damage_card={card_rule_id:rule.id,card_name:rule.name,card_type:rule.type,
    sha_nature:is_sha_type(rule.type)?(rule.type==='火杀'?'fire':rule.type==='雷杀'?'thunder':'normal'):null,
    source_game_lineage:source.source_game_lineage?{...source.source_game_lineage}:{source_game:source.source_game??(rule.id.startsWith('yxs.')?'英雄杀':rule.id.startsWith('sgs.')?'三国杀':'江湖共享'),
      source_version:source.source_version??source.source_variant??'已实现混合牌规则',source_rule_id:source.source_rule_id??source.id??rule.id,
      source_skill:source.source_skill??null},last_event_id:event.damage_event_id??null};
  return true;
}
export function liuye_choulue_card(record){
  const rule=byId[record?.card_rule_id];if(!rule)return null;
  // An ordinary immutable Card view with explicit null identity fields.
  // It has no physical materials and never enters any physical zone.
  return new Card(rule.name,rule.type,{
    id:rule.id,rule_id:rule.id,virtual:true,materials:Object.freeze([]),suit:null,color:null,rank:null,
    nature:record.sha_nature??'normal',source_skill:'筹略',source_game:record.source_game_lineage?.source_game,
    source_version:record.source_game_lineage?.source_version,source_game_lineage:record.source_game_lineage,
    copied_damage_event_id:record.last_event_id,
  });
}
export function liuye_choulue_targets(game,actor,record=actor.liuye_last_damage_card){
  const card=liuye_choulue_card(record);if(!card||!alive(actor))return [];
  const all=game.all_players().filter(alive);
  if(is_sha_type(card.type))return actor.prison_no_sha?[]:all.filter(p=>game.can_sha_target(actor,p,{allow_allies:true})&&game.in_attack_range(actor,p));
  if(['美人计','笑里藏刀'].includes(card.name))return game.wangyun_card_targets(actor,card);
  if(game.youjian_trick_definition?.(card))return game.youjian_trick_targets(actor,card);
  if(card.name==='决斗')return all.filter(p=>game.can_duel_target(actor,p,{allow_allies:true}));
  if(card.name==='火攻')return all.filter(p=>p.hand.length>0);
  return byId[record.card_rule_id].target_mode==='all_others'?all.filter(p=>p!==actor):[];
}
export function liuye_choulue_available(game,actor){
  return isOwnPlay(game,actor)&&game.all_players().some(p=>alive(p)&&p!==actor)
    &&liuye_choulue_targets(game,actor).length>0;
}
export async function liuye_on_turn_begin(game,actor,_target,event={}){
  if(!enabled(actor)||game.turn_actor!==game.seat_of(actor))return false;
  if(!receipt(game,`polu_turn:${game.seat_of(actor)}:${eventKey(game,'turn',event)}`))return false;
  const found=game.find_piliche();if(!found)return false;
  return game.obtain_and_use_equipment(actor,found.card,{...found,reason:'破橹'});
}
export async function liuye_after_damage_resolved(game,actor,amount,_source,event={}){
  if(!enabled(actor)||!(amount>0)||!event.damage_event_id)return false;
  if(!receipt(game,`polu_damage:${game.seat_of(actor)}:${event.damage_event_id}`))return false;
  let processed=false;
  for(let point=0;point<Math.floor(amount);point++){
    if(!enabled(actor)||is_piliche(actor.weapon))break;
    // One complete damage event already reduced HP and finished global rescue.
    // Draw may reshuffle. Search only the CURRENT draw pile afterwards.
    const before=actor.hand.length;await game.draw_cards(actor,1);processed=true;
    emit(game,`${actor.name}发动破橹（第${point+1}点伤害），摸${actor.hand.length-before}张牌。`);
    if(!enabled(actor))break;
    const weapons=game.deck.draw_pile.filter(c=>c.type===CardType.WEAPON&&!c.virtual);
    if(!weapons.length)continue;
    const chosen=game.rng.choice(weapons);
    await game.obtain_and_use_equipment(actor,chosen,{source_zone:'draw_pile',reason:'破橹'});
  }
  return processed;
}
function gifts(game,donor){return game.skill_material_options(donor).filter(m=>!m.card.virtual&&(m.zone==='hand'||slots.includes(m.zone)));}
function currentGift(game,donor,selected){return gifts(game,donor).find(m=>m.card===selected?.card&&m.zone===selected.zone);}
const aiTargets=(game,actor,targets)=>targets.filter(p=>game.side_of(p)!==game.side_of(actor)).sort((a,b)=>a.hp-b.hp);
function aiWantsUse(game,actor,record){
  const targets=liuye_choulue_targets(game,actor,record),rule=byId[record?.card_rule_id];
  if(!rule||!targets.length)return false;
  if(rule.target_mode==='all_others'){
    // Public HP/equipment only; never inspect enemy hidden hand identities.
    let score=0;for(const p of targets){if(game.equipment_card_immunity?.(actor,p,liuye_choulue_card(record),{kind:'scroll'}))continue;
      score+=(game.side_of(p)===game.side_of(actor)?-1:1)*(p.hp<=1?3:1);}
    return score>0;
  }
  return aiTargets(game,actor,targets).length>0;
}
async function chooseDonor(game,actor){
  const others=game.all_players().filter(p=>alive(p)&&p!==actor);
  if(actor.is_ai)return others.filter(p=>game.side_of(p)===game.side_of(actor)&&p.hand.length+slots.filter(s=>p[s]).length>0)
    .sort((a,b)=>b.hand.length-a.hand.length)[0]??null;
  return game.choose_card_target(actor,others,{card_name:'筹略',stage:'choulue_donor',cancellable:true});
}
async function chooseGift(game,actor,donor){
  const options=gifts(game,donor);if(!options.length)return null;
  if(donor.is_ai){
    if(game.side_of(donor)!==game.side_of(actor))return null;
    return options.sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b))[0];
  }
  while(true){
    const answer=await game.view.ask_line(`筹略：你可交给${actor.name}一张手牌或装备，使其视为使用记录的牌`,{kind:'choice',player_id:game.seat_of(donor),
      options:[...options.map(({id,label})=>({id,label})),{id:'refuse',label:'拒绝交牌'}],
      meta:{skill:'筹略',stage:'choulue_gift',private_to:game.seat_of(donor),recipient_seat:game.seat_of(actor),recorded_card:actor.liuye_last_damage_card?.card_name}});
    if(cancelled(answer))return null;const selected=select(options,answer);if(selected)return selected;
    emit(game,'请选择一张手牌或装备，或拒绝交牌。');
  }
}
/** The gift is chosen by its owner, committed destination-first, then followed
 * by mandatory virtual use. Targets are rebuilt after all loss/gain callbacks. */
export async function liuye_on_play_phase_begin(game,actor,_target,event={}){
  if(!liuye_choulue_available(game,actor))return false;
  if(!receipt(game,`choulue:${game.seat_of(actor)}:${eventKey(game,'play',event)}`))return false;
  const phase_counter=game.play_phase_event_counter,turn_counter=game.turn_event_counter;
  const samePhase=()=>isOwnPlay(game,actor)&&phase_counter===game.play_phase_event_counter&&turn_counter===game.turn_event_counter;
  if(actor.is_ai&&!aiWantsUse(game,actor,actor.liuye_last_damage_card))return false;
  const donor=await chooseDonor(game,actor);if(!donor||!alive(donor)||!samePhase())return false;
  const chosen=await chooseGift(game,actor,donor);if(!chosen||!alive(donor)||!samePhase())return false;
  const material=currentGift(game,donor,chosen);if(!material)return false;
  // A nested trigger while choosing may alter the latest record. Never charge
  // when the CURRENT record has no legal use even before the transfer.
  if(!liuye_choulue_targets(game,actor).length)return false;
  const card=await game.move_card_from_zone(donor,{zone:material.zone,index:material.index??0,card:material.card},{to:'hand',visibility:'private',recipient:actor,reason:'筹略赠牌'});
  if(!card)return false;
  emit(game,`${donor.name}发动筹略赠牌，交给${actor.name}一张${material.zone==='hand'?'手牌':'装备牌'}。`);
  // Optional card transactions already dispatch the complete loss/gain chain.
  if(!game.youjian_events_enabled?.()){
    await game.equipment_after_cards_lost?.(donor,[card],{reason:'筹略赠牌',zones:[material.zone],recipient:actor});
    if(game.on_cards_obtained)await game.on_cards_obtained(actor,[card],{reason:'筹略赠牌',source:donor,source_zone:material.zone,destination:'hand'});
  }
  const record=actor.liuye_last_damage_card,virtual=liuye_choulue_card(record);
  if(!alive(actor)||!virtual){emit(game,'筹略后续使用失败：使用者已阵亡或没有可用的牌记录。');return true;}
  let targets=liuye_choulue_targets(game,actor,record);
  if(!targets.length){emit(game,'筹略后续使用失败：交牌后的合法目标已不存在。');return true;}
  const rule=byId[record.card_rule_id];let target;
  if(rule.target_mode==='all_others')target=targets[0];
  else if(actor.is_ai)target=aiTargets(game,actor,targets)[0]??targets[0];
  else target=await game.choose_card_target(actor,targets,{card_name:`筹略·${virtual.name}`,stage:'choulue_use_target',cancellable:false});
  targets=liuye_choulue_targets(game,actor,record);
  if(!alive(actor)||!targets.includes(target)){emit(game,'筹略后续使用失败：所选目标已失效。');return true;}
  emit(game,`${actor.name}发动筹略，视为使用${virtual.name}。`);
  if(is_sha_type(virtual.type))await game.use_sha(actor,target,`筹略·${virtual.name}`,{source_card:virtual,forced:true,use_provenance:{kind:'virtual',source_skill:'筹略',physical_cards:[]}});
  else await game.resolve_scroll(actor,target,virtual,{allow_allies:true,source_skill:'筹略',...(rule.target_mode==='all_others'?{targets}:{})});
  return true;
}
export function liuye_skill_definitions({SkillHooks}){
  return {hooks:{[LIUYE_RULE_ID]:SkillHooks({on_turn_begin:[liuye_on_turn_begin],on_play_phase_begin:[liuye_on_play_phase_begin],after_damage_resolved:[liuye_after_damage_resolved]})},active:{[LIUYE_RULE_ID]:[]}};
}
