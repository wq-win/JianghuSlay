import {rule_hero} from './effective-hero.js';
import { CardType } from "./models.js";
import { HERO_SKILL_HOOKS, skill_hooks_for_hero, active_skills_for_hero } from "./skills.js";

export function ai_choose_card(game, actor, target) {
  // 诗仙 changes scrolls/equipment into SHA. Selecting them by their printed
  // effect after the SHA quota is spent never consumes the card, so the old AI
  // could retry the same card forever. Only healing or a legal SHA can progress.
  if (game.has_all_hand_as_sha(actor)) {
    if (actor.hp < rule_hero(actor).max_hp) {
      const tao_index = game.find_card(actor, CardType.TAO);
      if (tao_index !== null) return tao_index;
    }
    return ai_choose_sha_index(game, actor, target);
  }
  if (actor.hp <= Math.max(2, Math.floor(rule_hero(actor).max_hp / 2))) {
    const tao_index = game.find_card(actor, CardType.TAO);
    if (tao_index !== null && actor.hp < rule_hero(actor).max_hp) return tao_index;
    if (game.has_red_hand_as_tao(actor) && actor.hp < rule_hero(actor).max_hp) {
      for (let index = 0; index < actor.hand.length; index += 1) {
        if (game.can_use_red_as_tao(actor, actor.hand[index])) return index;
      }
    }
  }
  const best_equipment = game.find_better_equipment(actor);
  if (best_equipment !== null && !game.has_all_hand_as_sha(actor)) return best_equipment;
  const scroll_index = ai_choose_scroll(game, actor, target);
  if (scroll_index !== null) return scroll_index;
  const hooks = skill_hooks_for_hero(rule_hero(actor));
  if (hooks && hooks.ai_prefer_wine_before_sha && game.find_sha_card(actor) !== null) {
    const wine_index = game.find_card(actor, CardType.WINE);
    if (wine_index !== null && actor.wine_bonus === 0 && game.can_use_offensive_wine(actor)) return wine_index;
  }
  const sha_index = ai_choose_sha_index(game, actor, target);
  if (sha_index !== null) return sha_index;
  // A converted face is not an extra action allowance: exhausted quota,
  // forbidden targets and range still apply before the AI selects it.
  const converted=actor.hand.findIndex(card=>{const face=game.contextual_use_face?.(actor,card);return face&&face!==card&&game.can_play(actor,target,card);});if(converted>=0)return converted;
  if (actor.hp <= 3 && actor.hp < rule_hero(actor).max_hp) {
    const tao_index = game.find_card(actor, CardType.TAO);
    if (tao_index !== null) return tao_index;
    if (game.has_red_hand_as_tao(actor)) {
      for (let index = 0; index < actor.hand.length; index += 1) {
        if (game.can_use_red_as_tao(actor, actor.hand[index])) return index;
      }
    }
  }
  return null;
}

export function ai_choose_sha_index(game, actor, target) {
  if (!game.can_use_sha(actor) || !game.in_attack_range(actor, target)) return null;
  if (!game.can_sha_target(actor, target)) return null;
  const sha_index = game.find_sha_card(actor);
  if (sha_index !== null) return sha_index;
  if (!game.has_all_hand_as_sha(actor)) return null;
  for (let index = 0; index < actor.hand.length; index += 1) {
    if (game.can_use_hand_as_sha(actor, target, actor.hand[index])) return index;
  }
  return null;
}

export function ai_choose_scroll(game, actor, target) {
  const preferred_names = [];
  if(game.alive_allies(actor).some(p=>p.judgment_cards?.length&&game.can_use_shunshou(actor,p)&&!game.is_immune_to_shunshou(p)))preferred_names.push('顺手牵羊');
  if (actor.hp <= 2 || actor.hand.length <= 2) preferred_names.push("无中生有");
  if (game.target_has_card(target)) {
    if (game.can_use_shunshou(actor, target)) preferred_names.push("顺手牵羊");
    preferred_names.push("釜底抽薪");
  }
  if (game.target_has_visible_equipment(target)) preferred_names.unshift("釜底抽薪");
  preferred_names.push("火攻","借刀杀人","兵粮寸断","画地为牢", "手捧雷","铁索连环");
  preferred_names.push("烽火狼烟","万箭齐发");
  preferred_names.push("刮骨疗毒","树上开花","推心置腹","趁火打劫");
  preferred_names.push("笑里藏刀","美人计","桃园结义","五谷丰登","决斗");
  for (const name of preferred_names) {
    const index = game.find_card_by_name(actor, name);
    if(index===null)continue;
    const card=actor.hand[index];
    if(game.youjian_trick_definition?.(card)){
      const legal=game.youjian_trick_targets(actor,card),friend=p=>game.side_of(p)===game.side_of(actor);
      if(!legal.length)continue;
      if(name==='刮骨疗毒'&&!legal.some(friend))continue;
      if(name==='趁火打劫'&&!legal.some(p=>!friend(p)))continue;
      if(name==='推心置腹'&&!legal.some(p=>!friend(p)||game.youjian_trick_effect_helps(actor,p,card)))continue;
      if(name==='树上开花'&&!game.skill_material_options(actor).some(m=>m.card!==card&&m.card.type!==CardType.POISON))continue;
    }
    if(['美人计','笑里藏刀','五谷丰登','桃园结义'].includes(name)){
      const legal=game.wangyun_card_targets?.(actor,card)??[],enemy=p=>game.side_of(p)!==game.side_of(actor);
      if(['美人计','笑里藏刀'].includes(name)&&!legal.some(p=>enemy(p)&&(name!=='笑里藏刀'||p.hp<=1||rule_hero(p).max_hp-p.hp<=1)))continue;
      if(name==='桃园结义'&&legal.reduce((n,p)=>n+(p.hp<rule_hero(p).max_hp?(enemy(p)?-1:1):0),0)<=0)continue;
      if(name==='五谷丰登'&&legal.reduce((n,p)=>n+(enemy(p)?-1:1),0)<=0)continue;
    }
    if(['釜底抽薪','过河拆桥','顺手牵羊'].includes(name)&&!game.all_players().some(p=>p!==actor&&p.alive&&game.target_has_card(p)&&game.can_trick_target(actor,p,card)))continue;
    if(['烽火狼烟','万箭齐发'].includes(name)&&ai_aoe_score(game,actor,card)<=0)continue;
    if(['画地为牢','手捧雷','兵粮寸断'].includes(name)&&!game.alive_enemies(actor).some(p=>game.can_place_delayed(actor,p,card)))continue;
    if(name==='借刀杀人'&&!ai_borrowed_weapon_plan(game,actor))continue;
    if(name==='火攻'&&(!target.hand.length||actor.hand.length<2))continue;
    if(name==='决斗'&&!game.can_duel_target(actor,target))continue;
    return index;
  }
  return null;
}

/** Use public teams, equipment and legal ranges, never an ally's hidden cards.
 * The ordinary two-seat AI declines: making its foe attack itself is harmful.
 * In 1v2 it can give an armed teammate a forced attack against the player. */
export function ai_borrowed_weapon_plan(game, actor) {
  for (const holder of game.alive_allies(actor)) {
    if (!holder.weapon) continue;
    const victim = game.borrowed_victims(holder).find(p => game.side_of(p) !== game.side_of(actor));
    if (victim) return {target:holder,forced_target:victim};
  }
  return null;
}

export function ai_choose_discard(player) {
  const priorities = {
    [CardType.SHAN]: 5, [CardType.TAO]: 4, [CardType.SHA]: 3,
    [CardType.BLOOD_SHA]: 3, [CardType.POISON_SHA]: 3, [CardType.FIRE_SHA]:3,[CardType.THUNDER_SHA]:3,[CardType.STAB_SHA]:3,
    [CardType.WINE]: 2, [CardType.SCROLL]: 2,
    [CardType.POISON]: 8, [CardType.WEAPON]: 1, [CardType.ARMOR]: 1,
    [CardType.OFFENSIVE_HORSE]: 1, [CardType.DEFENSIVE_HORSE]: 1,
  };
  if (!player.hand.length) throw new RangeError("Cannot discard from an empty hand");
  let selected = 0;
  for (let index = 1; index < player.hand.length; index += 1) {
    if (priorities[player.hand[index].type] < priorities[player.hand[selected].type]) selected = index;
  }
  return selected;
}

export function ai_choose_target_option(options, rng) {
  const visible_options = options.filter((option) => option[0] !== "hand");
  if (visible_options.length) return visible_options[0];
  return rng.choice(options);
}

export async function ai_try_zhangba(game, actor, target) {
  if (actor.weapon === null || actor.weapon.trait !== "two_as_sha") return false;
  if (actor.hand.length < 2 || !game.can_use_sha(actor) || !game.in_attack_range(actor, target)||!game.can_sha_target(actor,target)) return false;
  const discarded = actor.hand.slice(-2);
  await game.consume_material_batch(actor,discarded.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})),{to:'processing',reason:'两牌转杀'});
  if(!actor.alive){for(const card of discarded)game.finish_processing_card(card);return true;}
  game.view.emit(`AI 使用${actor.weapon.name}，将两张手牌当杀。`);
  try{await game.use_sha(actor,target,`${actor.weapon?.name??'武器'}转化的杀`,{source_card:game.two_card_sha(actor,discarded),source_last_hand:actor.hand.length===0});}finally{for(const card of discarded)game.finish_processing_card(card);}
  return true;
}

export async function ai_try_shixian_equipment(game, actor, target) {
  if (!game.has_all_hand_as_sha(actor)) return false;
  if (!game.can_use_sha(actor) || !game.in_attack_range(actor, target)) return false;
  for (const slot of ["weapon", "armor", "offensive_horse", "defensive_horse"]) {
    if (game.can_use_equipment_as_sha(actor, target, slot)) {
      const card = game.equipment_slot_card(actor, slot);
      await game.use_equipment_as_sha(actor, target, slot);
      game.view.emit(`AI 将装备 ${card} 当杀使用。`);
      return true;
    }
  }
  return false;
}

export async function ai_try_active_skill(game, actor, target) {
  for (const skill of active_skills_for_hero(rule_hero(actor))) {
    if (await skill.ai(game, actor, target)) return true;
  }
  return false;
}

/** Public information only: compare danger to both sides, never inspect any
 * other seat's actual response cards. This is AI policy, not target legality. */
export function ai_aoe_score(game,actor,card){
  let score=0;
  for(const target of game.all_players()){
    if(!target?.alive||target===actor)continue;
    if(game.equipment_card_immunity?.(actor,target,card,{kind:'scroll',nature:'normal'}))continue;
    const damage=game.equipment_modify_damage?.(target,1,{kind:'scroll',nature:'normal',source:actor,source_card:card})??Math.max(0,1-(target.defense_bonus??0));
    if(damage<=0)continue;
    let pressure=(target.hand.length===0?1:0.65)*(target.hp<=1?3:target.hp<=2?1.5:1);
    // Public bagua and optional anti-group capabilities reduce likely harm.
    if(card.name==='万箭齐发'&&game.equipment_has_bagua?.(target,{kind:'response'}))pressure*=0.5;
    if((skill_hooks_for_hero(rule_hero(target))?.before_trick_target_nullification??[]).length)pressure=0;
    score+=(game.side_of(actor)===game.side_of(target)?-1:1)*pressure;
  }
  return score;
}
