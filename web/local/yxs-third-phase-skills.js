import {rule_hero} from './effective-hero.js';
/** Complete historical YXS phase/response packet. All dispatch is stable-ID based.
 * Source boundaries and shared-kernel contracts: docs/yxs-third/phase-rules.md.
 */
import {CardType, is_sha_card} from './models.js';

export const YXS_THIRD_PHASE_RULE_IDS=Object.freeze({
  wu:'yxs.adapted.base.hero.wu-song',
  xiang:'yxs.adapted.base.hero.xiang-yu',
  liu:'yxs.adapted.base.hero.liu-bang',
  gou:'yxs.adapted.base.hero.gou-jian',
});
export const YXS_ZUIJIU_COMPATIBILITY='jianghu.zuijiu.set_base_then_addmods.v1';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(value)?options[Number(value)-1]:null);
const ownTurn=(game,actor)=>Boolean(game.turn_actor)&&game.turn_actor===game.seat_of(actor);
const normalDraw=(game,actor)=>actor.alive&&ownTurn(game,actor)&&game.turn_phase==='draw'
  &&!actor.skip_draw_stage&&!actor.block_turn_draw;
const enemies=(game,actor)=>game.all_players().filter(p=>p!==actor&&p.alive&&game.side_of(p)!==game.side_of(actor));

/** AI reads only its own cards plus public HP, armor, distance and hand counts. */
export function yxs_ai_zuijiu(game,actor){
  if(actor.zuijiu_active||actor.skip_play_stage)return false; // No stacking or wasted skipped-play investment.
  return actor.hand.some(card=>enemies(game,actor).some(target=>{
    if(is_sha_card(card)){
      if(actor.prison_no_sha||!game.can_sha_target(actor,target)||!game.in_attack_range(actor,target))return false;
      const context={kind:'sha',source_card:card,nature:card.type===CardType.FIRE_SHA?'fire':card.type===CardType.THUNDER_SHA?'thunder':'normal'};
      context.armor_ignored=Boolean(game.equipment_ignores_armor?.(actor,context));
      if(game.equipment_sha_immunity?.(actor,target,context))return false;
      // Price the prospective base2, rather than refusing when the present base1
      // is completely absorbed by a public one-point armor.
      const base=2+actor.attack_bonus+(game.equipment_sha_turn_bonus?.(actor)??actor.wine_bonus)
        +(game.sha_damage_bonus?.(actor,target)??0);
      return (game.pending_sha_damage?.(actor,target,base,context)??Math.max(0,base-target.defense_bonus))>0;
    }
    if(card.type!==CardType.SCROLL||card.name!=='决斗'||!game.can_duel_target(actor,target))return false;
    return (game.equipment_modify_damage?.(target,2,{kind:'duel',source_card:card})??Math.max(0,2-target.defense_bonus))>0;
  }));
}

/** Return an ordinary draw BASE, never the final draw count. Independent draw
 * modifiers are added by Game afterward; a zero-effective draw cannot buy it. */
export async function yxs_before_draw_zuijiu(game,actor,_target,context){
  const {ordinary_base=2,modifiers=0,effective_count=ordinary_base+modifiers}=context;
  if(!normalDraw(game,actor)||ordinary_base<2||effective_count<=0)return ordinary_base;
  const accepted=actor.is_ai?yxs_ai_zuijiu(game,actor):await game.view.ask_confirm(
    '醉酒：正常基础摸牌从2改为1；本回合自己使用的杀、决斗基础伤害变为2？',
    {player_id:game.seat_of(actor),meta:{skill:'醉酒',stage:'zuijiu_draw',ordinary_base,modifiers,compatibility:YXS_ZUIJIU_COMPATIBILITY}});
  // A prompt is provisional. A skipped/replaced phase must not leave a free mark.
  if(!accepted||!normalDraw(game,actor))return ordinary_base;
  actor.zuijiu_active=true;
  game.view.emit(`${actor.name}发动醉酒：基础摸牌1张；本回合自己使用的杀、决斗基础伤害为2，其他修正另算。`);
  return 1;
}

/** Called once when source damage is formed. It does not add an arbitrary bonus
 * to the final amount, and a transferred/chained snapshot never calls it again. */
export function yxs_zuijiu_damage_base(game,actor,target,kind,card_user,ordinaryBase){
  return actor?.zuijiu_active&&ownTurn(game,actor)&&target!==actor&&card_user===actor
    &&['sha','duel'].includes(kind)?2:ordinaryBase;
}
export const yxs_bawang_shans_required=()=>2;
export const yxs_bawang_duel_shas_required=()=>2;

export function yxs_yuren_materials(game,actor){
  return game.skill_material_options(actor).filter(m=>m.card&&!m.card.virtual
    &&(m.zone==='hand'||slots.includes(m.zone)));
}
export function yxs_yuren_available(game,actor){
  return game.is_own_play_phase(actor)&&!actor.used_active_skills.has('驭人')
    &&yxs_yuren_materials(game,actor).length>0;
}
export const yxs_yuren_targets=(_game,actor)=>actor.alive?[actor]:[];

/** N and every physical identity are locked before movement. The shared atomic
 * batch detaches ALL materials before the first leave trigger can draw cards. */
export async function yxs_resolve_yuren(game,actor,materials){
  if(!yxs_yuren_available(game,actor)||!Array.isArray(materials)||!materials.length)return false;
  const current=yxs_yuren_materials(game,actor),seen=new Set();
  for(const chosen of materials){
    if(!chosen?.card||seen.has(chosen.card)||!current.some(m=>m.id===chosen.id&&m.zone===chosen.zone&&m.card===chosen.card))return false;
    seen.add(chosen.card);
  }
  const count=materials.length;
  // Reserve before awaited equipment callbacks: a nested call cannot reuse this
  // once-per-turn action. The kernel validates synchronously before its first await.
  actor.used_active_skills.add('驭人');
  const committed=await game.consume_material_batch(actor,materials,{to:'discard',reason:'驭人'});
  if(!committed){actor.used_active_skills.delete('驭人');return false;}
  if(actor.alive)await game.draw_cards(actor,count);
  game.view.emit(`${actor.name}发动驭人，弃置${count}张手牌或装备，${actor.alive?`摸${count}张牌`:'已退场，不再摸牌'}。`);
  return true;
}
function parse_yuren_args(game,options,args){
  if(args.length===1&&['0','cancel'].includes(args[0]))return [];
  const selected=[];
  for(let i=0;i<args.length;i++){
    let id;
    if(/^\d+$/.test(args[i]))id=`hand:${Number(args[i])}`;
    else if(args[i]==='eq'&&args[i+1])id=`eq:${game.normalize_equipment_slot(args[++i])}`;
    else if(/^(hand:\d+|eq:[a-z_]+)$/.test(args[i]))id=args[i];
    else return false;
    const option=options.find(m=>m.id===id);
    if(!option||selected.some(m=>m.card===option.card))return false;
    selected.push(option);
  }
  return selected;
}
export async function yxs_player_yuren(game,actor,_target,args=[]){
  if(!yxs_yuren_available(game,actor))return true;
  const options=yxs_yuren_materials(game,actor);
  if(args.length){
    const selected=parse_yuren_args(game,options,args);
    if(selected===false)return false;
    if(selected.length)await yxs_resolve_yuren(game,actor,selected);
    return true;
  }
  const selected=[];
  while(true){
    const choices=options.map(m=>({id:m.id,label:`${selected.includes(m)?'已选 ✓ · ':''}${m.label}`}));
    if(selected.length)choices.push({id:'done',label:`确认弃置${selected.length}张，随后摸${selected.length}张`});
    choices.push({id:'cancel',label:'取消，不弃牌、不消费次数'});
    const answer=String(await game.view.ask_line('驭人：选择任意手牌或装备（再次点击可取消选中），全部选定后确认',{
      kind:'choice',player_id:game.seat_of(actor),options:choices,
      meta:{skill:'驭人',stage:'yuren_materials',private_to:game.seat_of(actor),material_zones:['hand',...slots],
        selected_ids:selected.map(m=>m.id),selected_count:selected.length,min_cards:1},
    })).trim();
    if(['cancel','0'].includes(answer))return true;
    const chosen=select(choices,answer);
    if(chosen?.id==='done'&&selected.length){await yxs_resolve_yuren(game,actor,selected);return true;}
    if(chosen?.id==='cancel')return true;
    const material=options.find(m=>m.id===chosen?.id);
    if(material){const index=selected.indexOf(material);if(index<0)selected.push(material);else selected.splice(index,1);}
    else game.view.emit('请选择手牌或装备、确认已选牌，或取消驭人。');
  }
}

/** Deliberately conservative exchange policy. It never consults another hand's
 * contents or the draw pile, and every chosen card uses the human batch kernel. */
export function yxs_ai_yuren_materials(game,actor){
  const options=yxs_yuren_materials(game,actor),foes=enemies(game,actor);
  const canAttack=foes.some(t=>!actor.prison_no_sha&&game.can_sha_target(actor,t)&&game.in_attack_range(actor,t));
  let keptSha=0,keptShan=0,keptWine=0;
  const shaBudget=canAttack?Math.max(0,(game.get_max_sha_per_turn?.(actor)??1)-(actor.sha_count_this_turn??0)):0;
  const slotOf={[CardType.WEAPON]:'weapon',[CardType.ARMOR]:'armor',[CardType.OFFENSIVE_HORSE]:'offensive_horse',[CardType.DEFENSIVE_HORSE]:'defensive_horse'};
  return options.filter(m=>{
    const c=m.card;
    if(m.zone!=='hand'){
      if(c.trait==='qiankun_bag')return true;
      if(['silver_lion','golden_armor'].includes(c.trait)&&actor.hp<rule_hero(actor).max_hp)return true;
      if(m.zone==='weapon'&&!actor.hand.some(is_sha_card)&&actor.hand.length===0)return true;
      // Public equipped values versus the AI's own replacement cards only.
      return actor.hand.some(other=>slotOf[other.type]===m.zone&&(m.zone==='weapon'
        ?game.weapon_score(other)>game.weapon_score(c):other.power>c.power));
    }
    if(c.type===CardType.TAO)return false;
    if(c.type===CardType.SHAN)return ++keptShan>2;
    if(is_sha_card(c))return ++keptSha>shaBudget;
    if(c.type===CardType.WINE)return ++keptWine>(canAttack||actor.hp<=1?1:0);
    if(slotOf[c.type]){
      const existing=actor[slotOf[c.type]];
      return Boolean(existing&&(c.type===CardType.WEAPON?game.weapon_score(existing)>=game.weapon_score(c):existing.power>=c.power));
    }
    if(c.type===CardType.SCROLL&&c.name==='决斗')return !foes.some(t=>game.can_duel_target(actor,t));
    if(c.type===CardType.SCROLL&&['顺手牵羊','釜底抽薪','过河拆桥'].includes(c.name))return !foes.some(t=>game.target_has_card(t)
      &&(c.name!=='顺手牵羊'||game.can_use_shunshou(actor,t)));
    return false;
  });
}
export async function yxs_ai_yuren(game,actor){
  if(!yxs_yuren_available(game,actor))return false;
  const selected=yxs_ai_yuren_materials(game,actor);
  return selected.length?yxs_resolve_yuren(game,actor,selected):false;
}

/** A final hand-limit replacement, not a skip-discard boolean. CurrentLimit is
 * ordinary HP + equipment + other modifiers; accepted 隐忍 returns exactly 20. */
export async function yxs_discard_limit_yinren(game,actor,currentLimit){
  if(!actor.alive||!ownTurn(game,actor)||game.turn_phase!=='discard'
    ||actor.sha_activity_in_own_play||actor.hand.length<=currentLimit)return null;
  const accepted=actor.is_ai||await game.view.ask_confirm('隐忍：本回合出牌阶段未使用或打出杀，是否改为最多保留20张手牌？',{
    player_id:game.seat_of(actor),meta:{skill:'隐忍',stage:'yinren_discard',ordinary_limit:currentLimit,override_limit:20},
  });
  if(!accepted||!actor.alive||!ownTurn(game,actor)||game.turn_phase!=='discard'||actor.sha_activity_in_own_play)return null;
  actor.yinren_active=true;
  game.view.emit(`${actor.name}发动隐忍，本次弃牌阶段手牌上限为20；超过20仍须弃牌。`);
  return 20;
}

/** This is EACH successful SHAN response, not the completed-attack on_dodge.
 * The response's effective type matters, not the physical conversion materials. */
export async function yxs_after_response_tuqiang(game,actor,event){
  const responseId=event?.id??event?.response_id;
  if(!actor.alive||!game.turn_actor||ownTurn(game,actor)||event?.success!==true
    ||event.type!==CardType.SHAN||responseId==null)return false;
  actor.tuqiang_response_ids??=[];
  if(actor.tuqiang_response_ids.includes(responseId))return false;
  // Reserve the response before an optional prompt, including a decline.
  actor.tuqiang_response_ids.push(responseId);
  const accepted=actor.is_ai||await game.view.ask_confirm('图强：回合外成功打出1份闪，是否立即摸1张牌？',{
    player_id:game.seat_of(actor),meta:{skill:'图强',stage:'tuqiang_response',response_id:responseId},
  });
  if(!accepted||!actor.alive)return false;
  await game.draw_cards(actor,1);
  game.view.emit(`${actor.name}发动图强，立即摸1张牌，再继续后续响应。`);
  return true;
}

export function yxs_third_phase_skill_definitions({SkillHooks,ActiveSkillDef}){
  const yuren=new ActiveSkillDef({skill_id:'驭人',hotkey:'q',button_label:'驭人',
    help_text:'驭人：每回合一次，选定任意张手牌或装备全部弃置；离装效果结算后摸等量牌（q；q 1 2 eq armor）',
    player:yxs_player_yuren,ai:yxs_ai_yuren,available:yxs_yuren_available});
  yuren.owns_target_selection=true;
  yuren.targets=yxs_yuren_targets;
  return {hooks:{
    [YXS_THIRD_PHASE_RULE_IDS.wu]:SkillHooks({before_draw_base:[yxs_before_draw_zuijiu],card_damage_base:[yxs_zuijiu_damage_base]}),
    [YXS_THIRD_PHASE_RULE_IDS.xiang]:SkillHooks({allow_partial_sha_responses:true,shans_required_to_dodge:[yxs_bawang_shans_required],duel_shas_required:[yxs_bawang_duel_shas_required]}),
    [YXS_THIRD_PHASE_RULE_IDS.liu]:SkillHooks(),
    [YXS_THIRD_PHASE_RULE_IDS.gou]:SkillHooks({discard_limit_override:[yxs_discard_limit_yinren],after_response_card:[yxs_after_response_tuqiang]}),
  },active:{[YXS_THIRD_PHASE_RULE_IDS.liu]:[yuren]}};
}
