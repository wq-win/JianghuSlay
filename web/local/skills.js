import {is_hero_in_release} from './release-scope.js';
import {SGS_PANZHANGMAZHONG_HEROES} from './models.js';
import {sgs_panzhangmazhong_skill_definitions} from './sgs-panzhangmazhong-skills.js';
import {SGS_CAOANG_HEROES} from './models.js';
import {sgs_caoang_skill_definitions} from './sgs-caoang-skills.js';
import {sgs_caoxiu_skill_definitions} from './sgs-caoxiu-skills.js';
import {SGS_CAOXIU_HEROES} from './models.js';
import {sgs_chenlin_skill_definitions} from './sgs-chenlin-skills.js';
import {SGS_CHENLIN_HEROES} from './models.js';
import {sgs_lingcao_skill_definitions} from './sgs-lingcao-skills.js';
import {sgs_sunru_skill_definitions} from './sgs-sunru-skills.js';
import {sgs_yuejin_skill_definitions} from './sgs-yuejin-skills.js';
import {SGS_LINGCAO_HEROES,SGS_SUNRU_HEROES,SGS_YUEJIN_HEROES} from './models.js';
import {sgs_manchong_skill_definitions} from './sgs-manchong-skills.js';
import {sgs_liru_skill_definitions} from './sgs-liru-skills.js';
import {SGS_MANCHONG_HEROES,SGS_LIRU_HEROES} from './models.js';
import {zhangfen_skill_definitions} from './sgs-zhangfen-skills.js';
import {SGS_ZHANGFEN_HEROES} from './models.js';
import {yxs_modern_zhangqian_skill_definitions} from './yxs-modern-zhangqian.js';
import {yxs_modern_wudaozi_skill_definitions} from './yxs-modern-wudaozi.js';
import {sgs_followup_caozhen_skill_definitions} from './sgs-followup-caozhen.js';
import {sgs_followup_zhuhuan_skill_definitions} from './sgs-followup-zhuhuan.js';
import {sgs_followup_chenqun_skill_definitions} from './sgs-followup-chenqun.js';
import {sgs_followup_zhangni_skill_definitions} from './sgs-followup-zhangni.js';
import {sgs_yijiang_further_xushu_skill_definitions} from './sgs-yijiang-further-xushu.js';
import {sgs_yijiang_further_quancong_skill_definitions} from './sgs-yijiang-further-quancong.js';
import {sgs_yijiang_further_guyong_skill_definitions} from './sgs-yijiang-further-guyong.js';
import {sgs_yijiang_further_xiahoushi_skill_definitions} from './sgs-yijiang-further-xiahoushi.js';
import {sgs_yijiang_more_lidian_skill_definitions} from './sgs-yijiang-more-lidian.js';
import {sgs_yijiang_more_zhuran_skill_definitions} from './sgs-yijiang-more-zhuran.js';
import {sgs_yijiang_more_caozhi_skill_definitions} from './sgs-yijiang-more-caozhi.js';
import {sgs_later_caochong_skill_definitions} from './sgs-later-caochong-skills.js';
import {sgs_later_guanping_skill_definitions} from './sgs-later-guanping-skills.js';
import {sgs_later_yufan_skill_definitions} from './sgs-later-yufan-skills.js';
import {sgs_later_guohuai_skill_definitions} from './sgs-later-guohuai-skills.js';
import {sgs_next_handang_skill_definitions} from './sgs-next-handang-skills.js';
import {sgs_next_liaohua_skill_definitions} from './sgs-next-liaohua-skills.js';
import {sgs_next_bulianshi_skill_definitions} from './sgs-next-bulianshi-skills.js';
import {sgs_following_masu_skill_definitions} from './sgs-following-masu-skills.js';
import {sgs_following_caozhang_skill_definitions} from './sgs-following-caozhang-skills.js';
import {sgs_following_jieyue_skill_definitions} from './sgs-following-jieyue-skills.js';
import {get_general_skill_descriptor} from './general-skill-descriptor.js';
import {sgs_yijiang_equipment_skill_definitions} from './sgs-yijiang-equipment-skills.js';
import {sgs_yijiang_combat_skill_definitions} from './sgs-yijiang-combat-skills.js';
import {sgs_mountain_phase_skill_definitions} from './sgs-mountain-phase-skills.js';
import {sgs_mountain_field_skill_definitions} from './sgs-mountain-field-skills.js';
import {sgs_forest_support_skill_definitions} from './sgs-forest-support-skills.js';
import {sgs_forest_assault_skill_definitions} from './sgs-forest-assault-skills.js';
import {sgs_fire_control_skill_definitions} from './sgs-fire-control-skills.js';
import {sgs_fire_assault_skill_definitions} from './sgs-fire-assault-skills.js';
import {wangyun_skill_definitions} from './wangyun-skills.js';
import {sgs_next_transfer_recovery_skill_definitions} from './sgs-next-transfer-recovery.js';
import {sgs_next_discard_assault_skill_definitions} from './sgs-next-discard-assault.js';
import {sgs_wind_heal_flip_skill_definitions} from './sgs-wind-heal-flip.js';
import {sgs_wind_speed_bow_skill_definitions} from './sgs-wind-speed-bow.js';
import {sgs_following_loss_skill_definitions} from './sgs-following-loss-skills.js';
import {sgs_following_duel_skill_definitions} from './sgs-following-duel-skills.js';
import {sgs_base_next_skill_definitions} from './sgs-base-next-skills.js';
import {sgs_zhenji_skill_definitions} from './sgs-zhenji-skills.js';
import {yxs_ninth_skill_definitions} from './yxs-ninth-skills.js';
import {yxs_eighth_skill_definitions} from './yxs-eighth-skills.js';
import {eighth_has_skill} from './yxs-eighth-runtime.js';
import {rule_hero} from './effective-hero.js';
/** Browser-native port of skills/registry.py, passive.py and active.py. */
import { HEROES, Card, CardType, CardColor, CardSuit, is_sha_card, CLASSIC_HEROES, EXPANSION_HEROES, SECOND_FOUR_HEROES, YXS_FIRST_HEROES, YXS_NEXT_HEROES, YXS_THIRD_HEROES, YXS_FOURTH_HEROES, YXS_FIFTH_HEROES, YXS_SIXTH_HEROES, YXS_SEVENTH_HEROES, YXS_EIGHTH_HEROES, YXS_NINTH_HEROES, SGS_BASE_NEXT_HEROES, SGS_FOLLOWING_HEROES, SGS_WIND_HEROES, SGS_NEXT_IDENTITY_HEROES, WANGYUN_HEROES, SGS_FIRE_HEROES, SGS_FOREST_HEROES, SGS_MOUNTAIN_HEROES, SGS_YIJIANG_HEROES, SGS_YIJIANG_FOLLOWING_HEROES, SGS_YIJIANG_NEXT_HEROES, SGS_YIJIANG_LATER_HEROES, SGS_YIJIANG_MORE_HEROES, SGS_YIJIANG_FURTHER_HEROES, SGS_FOLLOWUP_HEROES, YXS_MODERN_HEROES, DERIVED_HEROES, HERO_SOURCE_MERGES, HERO_ORIGINAL_MERGES } from './models.js';
import {expansion_skill_definitions} from './expansion-skills.js';
import {second_four_skill_definitions} from './second-four-skills.js';
import {yxs_first_skill_definitions} from './yxs-first-skills.js';
import {yxs_next_skill_definitions} from './yxs-next-skills.js';
import {yxs_next_damage_skill_definitions} from './yxs-next-damage-skills.js';
import {yxs_third_phase_skill_definitions} from './yxs-third-phase-skills.js';
import {yxs_third_response_skill_definitions} from './yxs-third-response-skills.js';
import {yxs_fourth_skill_definitions} from './yxs-fourth-skills.js';
import {yxs_fourth_trick_skill_definitions} from './yxs-fourth-trick-skills.js';
import {yxs_fifth_active_skill_definitions} from './yxs-fifth-active-skills.js';
import {yxs_fifth_yuji_skill_definitions} from './yxs-fifth-yuji-skills.js';
import {yxs_sixth_guard_skill_definitions} from './yxs-sixth-guard-skills.js';
import {yxs_guard_has_skill} from './yxs-sixth-guard-runtime.js';
import {yxs_xiadan_skill_definitions} from './yxs-xiadan-skills.js';
import {yxs_queen_skill_definitions} from './yxs-queen-skills.js';
import {seventhDependencies} from './yxs-seventh-runtime.js';
import {liuye_skill_definitions} from './liuye-derived-skills.js';
import {create_hero_rule_registry} from './hero-rule-registry.js';

/** A fresh, plain hook record; accepts both SkillHooks() and new SkillHooks(). */
export function SkillHooks(overrides = {}) {
  return {
    on_committed_sha_use: [],
    before_any_receiving_damage: [],
    on_play_phase_end: [],
    on_equipment_leave: [],
    on_dying_entry: [],
    on_any_dying_entry: [],
    on_discard_phase_end: [],
    before_death_commit: [],
    on_turn_begin: [],
    on_play_phase_begin: [],
    on_end_phase: [],
    on_any_end_phase_start: [],
    on_judgment_effective: [],
    after_cards_lost: [],
    prohibit_card_target: [],
    after_recovery: [],
    before_trick_target_nullification: [],
    on_prepare: [],
    before_judgment_phase: [],
    before_play_phase: [],
    before_draw_phase: [],
    on_draw_phase_start: [],
    capture_before_receiver_hp_loss: [],
    after_any_cards_enter_discard: [],
    before_discard_phase: [],
    outgoing_distance: [],
    after_any_damage_resolved: [],
    on_sha_targets_designated: [],
    on_any_sha_target_confirmed: [],
    on_judgment: [],
    ignore_lord_hp_bonus: false,
    after_any_sha_damage: [],
    on_sha_target: [],
    distance_modifier: 0,
    immune_to_duel_without_hand: false,
    response_material_name: null,
    on_damaged: [],
    before_source_damage_resolution: [],
    before_receiver_damage_transfer: [],
    prevents_damage_preview: [],
    before_damage_transfer: [],
    before_receiving_damage_cost: [],
    before_receiving_damage: [],
    before_damage_hp_loss: [],
    after_source_damage: [],
    after_damage_resolved: [],
    replace_draw_phase: [],
    before_normal_draw: [],
    commit_normal_draw: [],
    after_normal_draw: [],
    supply_shortage_distance_limit: [],
    before_draw: [],
    before_draw_base: [],
    card_damage_base: [],
    duel_shas_required: [],
    discard_limit_override: [],
    after_response_card: [],
    on_any_actual_turn_end: [],on_aggregate_card_targets: [],on_any_response_card: [],on_any_play_phase_begin: [],on_actual_turn_end: [],on_any_general_state_changed: [],
    resolve_response_material: [],
    response_card_conversion: [],
    rescue_material_options: [],
    before_sha_target_response: [],
    before_discard: [],
    on_scroll_used: [],
    card_damage_bonus: [],
    response_sha_material_color: null,
    response_shan_hand_color: null,
    scroll_no_distance_limit: false,
    on_opponent_dying: [],
    on_turn_start: [],
    on_turn_end: [],
    on_dodge: [],
    on_sha_dodged: [],
    sha_damage_bonus: [],
    sha_unavoidable: [],
    shans_required_to_dodge: [],
    allow_partial_sha_responses: false,
    tao_heal_bonus: [],
    hand_limit_bonus: [],
    max_sha_per_turn: 1,
    red_hand_as_tao: false,
    immune_to_sha_without_hand: false,
    shunshou_no_distance_limit: false,
    immune_to_shunshou: false,
    response_sha_shan_swap: false,
    ai_prefer_wine_before_sha: false,
    ...overrides,
  };
}

export class ActiveSkillDef {
  constructor({ skill_id, hotkey, help_text, player, ai, arg_mode = 'none',
    min_cards = 0, max_cards = 0, card_filter = 'any', button_label = '', available = null }) {
    Object.assign(this, { skill_id, hotkey, help_text, player, ai, arg_mode,
      min_cards, max_cards, card_filter, button_label, available });
  }

  to_client_dict() {
    return {
      hotkey: this.hotkey,
      id: this.skill_id,
      help: this.help_text,
      label: this.button_label || this.skill_id,
      arg_mode: this.arg_mode,
      min_cards: this.min_cards,
      max_cards: this.max_cards,
      card_filter: this.card_filter,
    };
  }
}

export const SKILL_HOTKEYS = new Set(['q', 'w', 'e', 'r']);
export const HERO_SKILL_HOOKS = Object.create(null);
export const ACTIVE_SKILLS_BY_HERO = Object.create(null);

const heroRules = create_hero_rule_registry();
const EMPTY_ACTIVE_SKILLS = Object.freeze([]);

/** Register an explicit source packet; metadata alone never grants rules. */
export function register_hero_rules(packet) {
  const registered = heroRules.register(packet);
  // Compatibility views for old callers. Production dispatch never reads these
  // mutable name tables. Rebuild them so ambiguous aliases cannot choose a pack.
  for (const table of [HERO_SKILL_HOOKS, ACTIVE_SKILLS_BY_HERO]) {
    for (const key of Object.keys(table)) delete table[key];
  }
  for (const record of heroRules.entries()) for (const name of record.names) {
    if (heroRules.resolve(name) !== record) continue;
    if (record.hooks) HERO_SKILL_HOOKS[name] = record.hooks;
    if (record.active.length) ACTIVE_SKILLS_BY_HERO[name] = active_skills_for_hero(record.id);
  }
  return registered;
}
const generalHookCache=new WeakMap();
function generalHooks(hero,brand){
 if(generalHookCache.has(hero))return generalHookCache.get(hero);
 const base=brand.legacy_intrinsics_enabled?heroRules.resolve(brand.source_descriptor)?.hooks:null;
 if(brand.legacy_intrinsics_enabled&&!brand.overlay_skill_ids.some(id=>generalGrantedHooks.has(id))){generalHookCache.set(hero,base);return base;}
 const hooks=SkillHooks(base??{});
 for(const skillId of brand.overlay_skill_ids){
  const overlay=generalGrantedHooks.get(skillId);if(!overlay)continue;
  for(const [key,value] of Object.entries(overlay))if(Array.isArray(value)&&value.length)hooks[key]=[...new Set([...(hooks[key]??[]),...value])];
 }
 generalHookCache.set(hero,hooks);return hooks;
}
const generalGrantedHooks=new Map(),generalGrantedActives=new Map();
export function skill_hooks_for_hero(hero) {const brand=get_general_skill_descriptor(hero);return brand?generalHooks(hero,brand):heroRules.resolve(hero)?.hooks ?? null;}
const activeFormCache=new Map();
export function active_skills_for_hero(hero) {
 const brand=get_general_skill_descriptor(hero);
 if(brand){
  const base=brand.legacy_intrinsics_enabled?active_skills_for_hero(brand.source_descriptor):EMPTY_ACTIVE_SKILLS;
  const all=[...base,...brand.overlay_skill_ids.flatMap(id=>generalGrantedActives.get(id)??[])];
  const filtered=all.filter((s,i)=>(!s.source_skill_id&&base.includes(s)||brand.skill_ids.includes(s.source_skill_id??s.skill_id))&&all.findIndex(other=>other.skill_id===s.skill_id)===i);
  return filtered.length===base.length&&filtered.every((s,i)=>s===base[i])?base:Object.freeze(filtered);
 }
 const record=heroRules.resolve(hero);if(!record)return EMPTY_ACTIVE_SKILLS;
 const form=typeof hero==='object'?hero:HEROES.find(h=>h.id===record.id);
 if(Array.isArray(form?.skill_ids)&&record.active.some(s=>s.source_skill_id)){
  const key=record.id+'|'+form.skill_ids.join('|');if(!activeFormCache.has(key))activeFormCache.set(key,Object.freeze(record.active.filter(s=>!s.source_skill_id||form.skill_ids.includes(s.source_skill_id))));return activeFormCache.get(key);
 }return record.active;
}
export function hero_has_capability(hero, capability) {
  const brand=get_general_skill_descriptor(hero);
  return brand?(brand.legacy_intrinsics_enabled&&(heroRules.resolve(brand.source_descriptor)?.capabilities.includes(capability)??false)):(heroRules.resolve(hero)?.capabilities.includes(capability)??false);
}
export function active_skill_by_hotkey(hero, key) {
  return active_skills_for_hero(hero).find(skill => skill.hotkey === key) || null;
}

// Passive skills. Interactive hooks are awaited by the game; pure bonuses stay sync.
function can_sheshen_retaliate(target, source) {
  return source != null && source.alive && source !== target;
}

async function player_sheshen_choice(game, target, source) {
  if (!can_sheshen_retaliate(target, source)) return 'draw';
  while (true) {
    game.view.emit(`\n${target.name}触发舍身，请选择：`);
    game.view.emit('1. 摸2张牌');
    game.view.emit(`2. 令${source.name}失去1点血`);
    const choice = await game.view.ask_line('输入选项：', {
      kind: 'choice', options: ['摸2张牌', `令${source.name}失去1点血`],
      player_id: game.seat_of(target),
    });
    if (choice === '1') return 'draw';
    if (choice === '2') return 'retaliate';
    game.view.emit('请输入 1 或 2。');
  }
}

function ai_sheshen_choice(game, target, source) {
  if (!can_sheshen_retaliate(target, source)) return 'draw';
  if (game.side_of(target) === game.side_of(source)) return 'draw';
  if (source.hp <= 1) return 'retaliate';
  if (target.hp <= 2) return 'draw';
  if (source.hp <= target.hp) return 'retaliate';
  return 'draw';
}

async function on_damaged_sheshen(game, target, amount, source) {
  if (!target.alive) return;
  const choice = target.is_ai
    ? ai_sheshen_choice(game, target, source)
    : await player_sheshen_choice(game, target, source);
  if (choice === 'retaliate') {
    await game.apply_damage(source, 1, {
      source: target,
      message: `{name}受到${target.name}舍身反击，受到 {damage} 点伤害，剩余血量 {hp}。`,
    });
    return;
  }
  await game.draw_cards(target, 2);
  game.view.emit(`${target.name}触发舍身，摸2张牌。`);
}

function can_yuefei_counter(source, target) {
  return source != null && source.alive && source !== target;
}

async function player_yuefei_damaged_choice(game, target, source) {
  while (true) {
    game.view.emit(`\n${target.name}触发武穆，请选择：`);
    game.view.emit(`1. 获得${source.name}1张牌`);
    game.view.emit(`2. 摸1张牌并弃置${source.name}1张牌`);
    const choice = await game.view.ask_line('输入选项：', {
      kind: 'choice', options: [`获得${source.name}1张牌`, `摸1张牌并弃置${source.name}1张牌`],
      player_id: game.seat_of(target),
    });
    if (choice === '1') return 'take';
    if (choice === '2') return 'draw_discard';
    game.view.emit('请输入 1 或 2。');
  }
}

function ai_yuefei_damaged_choice(game, target, source) {
  if (game.target_has_visible_equipment(source) || source.hand.length >= 2) return 'draw_discard';
  if (game.target_has_card(source)) return 'take';
  return 'draw_discard';
}

async function on_damaged_yuefei(game, target, amount, source) {
  if (!target.alive || !can_yuefei_counter(source, target)) return;
  const choice = target.is_ai
    ? ai_yuefei_damaged_choice(game, target, source)
    : await player_yuefei_damaged_choice(game, target, source);
  if (choice === 'take') {
    const stolen = await game.take_target_card(target, source, '获得');
    if (stolen == null) {
      game.view.emit(`${source.name}没有可获得的牌。`);
      return;
    }
    game.view.emit(`${target.name}触发武穆，获得了${source.name}的 ${stolen}。`);
    return;
  }
  await game.draw_cards(target, 1);
  game.view.emit(`${target.name}触发武穆，摸了1张牌。`);
  if (!game.target_has_card(source)) {
    game.view.emit(`${source.name}没有可弃置的牌。`);
    return;
  }
  const removed = await game.remove_target_card(target, source);
  if (removed == null) return;
  game.view.emit(`${target.name}弃置了${source.name}的 ${removed}。`);
}

function on_turn_start_qinshihuang(game, actor, target) { return 2; }

async function on_turn_end_qinshihuang(game, actor, target) {
  if (!actor.hand.length) return;
  await game.discard_from_hand(actor, 1, { reason: '集权' });
}

async function player_lijian_choice(game, actor, target) {
  while (true) {
    game.view.emit(`\n${actor.name}触发离间，${target.name}手牌更多，请选择：`);
    game.view.emit('1. 额外摸1张牌');
    game.view.emit(`2. 弃置${target.name}1张牌`);
    const choice = await game.view.ask_line('输入选项：', {
      kind: 'choice', options: ['额外摸1张牌', `弃置${target.name}1张牌`],
      player_id: game.seat_of(actor),
    });
    if (choice === '1') return 'draw';
    if (choice === '2') return 'discard';
    game.view.emit('请输入 1 或 2。');
  }
}

function ai_lijian_choice(game, actor, target) {
  if (game.target_has_visible_equipment(target)) return 'discard';
  if (actor.hand.length <= 2) return 'draw';
  if (game.target_has_card(target)) return 'discard';
  return 'draw';
}

function on_turn_start_jiangwei(game, actor, target) { return actor.hand.length ? 0 : 2; }

async function on_turn_start_diaochan(game, actor, target) {
  if (target.hand.length <= actor.hand.length) return 0;
  const choice = actor.is_ai
    ? ai_lijian_choice(game, actor, target)
    : await player_lijian_choice(game, actor, target);
  if (choice === 'draw') {
    await game.draw_cards(actor, 1);
    game.view.emit(`${actor.name}发动离间，额外摸了1张牌。`);
    return 0;
  }
  if (!game.target_has_card(target)) {
    await game.draw_cards(actor, 1);
    game.view.emit(`${target.name}没有可弃置的牌，${actor.name}改为额外摸了1张牌。`);
    return 0;
  }
  const removed = await game.remove_target_card(actor, target);
  if (removed == null) return 0;
  game.view.emit(`${actor.name}发动离间，弃置了${target.name}的 ${removed}。`);
  return 0;
}

function on_turn_start_chengyaojin(game, actor, target) {
  return Math.max(0, rule_hero(actor).max_hp - actor.hp);
}

async function on_dodge_huamulan(game, player) {
  await game.draw_cards(player, 1);
  game.view.emit(`${player.name}触发易装，摸1张牌。`);
}

async function on_sha_dodged_huamulan(game, actor, target) {
  const card=await game.reveal_judgment(actor,'易装',{favorable:c=>game.is_red_card(c)});
  if(!card)return;
  try{
    if(!game.is_red_card(card)){game.view.emit('判定为非红色，未获得对手牌。');return;}
    const stolen=await game.take_target_card(actor,target,'获得');
    if(stolen==null){game.view.emit(`${target.name}没有可获得的牌。`);return;}
      game.view.emit(`${actor.name}易装判定成功，获得了${target.name}的 ${stolen}。`);
  }finally{await game.finish_judgment_card(card);}
}

function sha_bonus_xiangyu(game, actor, target) { return actor.bawang_stacks; }
function jingke_sha_unavoidable(game, actor, target) { return target.hp > actor.hand.length; }
function jingke_shans_required(game, actor, target) { return target.hand.length > actor.hp ? 2 : 1; }
function tao_bonus_bianque(game, actor) { return 1; }

async function on_opponent_dying_zhensha(game, bianque, dying) {
  // The hook remains legal for any other dying character. Only the AI policy
  // refuses to spend its heal to execute a teammate before that ally can save.
  if (bianque.is_ai && game.side_of(bianque) === game.side_of(dying)) return false;
  const tao_indexes = bianque.hand.flatMap((card, index) => card.type === CardType.TAO ? [index] : []);
  if (!tao_indexes.length) return false;
  const use_lethal = bianque.is_ai || await game.view.ask_confirm(
    `扁鹊鸩杀：是否对${dying.name}使用一张桃令其直接阵亡？(y/n)：`,
    { player_id: game.seat_of(bianque) },
  );
  if (!use_lethal) return false;
  let tao_index;
  if (bianque.is_ai || tao_indexes.length === 1) {
    tao_index = tao_indexes[0];
  } else {
    game.view.emit(`\n${bianque.name}选择用于鸩杀的桃：`);
    tao_indexes.forEach((index, option_no) => game.view.emit(`${option_no + 1}. ${bianque.hand[index]}`));
    const choice = await game.view.ask_line('输入桃的编号：', {
      kind: 'choice', options: tao_indexes.map(index => String(bianque.hand[index])),
      player_id: game.seat_of(bianque),
    });
    if (!/^\d+$/.test(choice) || !(1 <= Number(choice) && Number(choice) <= tao_indexes.length)) {
      game.view.emit('无效输入，放弃鸩杀。');
      return false;
    }
    tao_index = tao_indexes[Number(choice) - 1];
  }
  const card = await game.consume_material(bianque,hand_materials(bianque,[tao_index])[0],{to:'discard',reason:'鸩杀'});
  if (!card || !bianque.alive || dying.dead) return false;
  game.view.emit(`${bianque.name}发动鸩杀，对${dying.name}使用 ${card}，${dying.name}直接阵亡。`);
  return true;
}

const builtinHooks = {
  'jianghu.classic.hero.qin-shi-huang': SkillHooks({ on_turn_start: [on_turn_start_qinshihuang], on_turn_end: [on_turn_end_qinshihuang] }),
  'jianghu.classic.hero.xiang-yu': SkillHooks({ sha_damage_bonus: [sha_bonus_xiangyu], ai_prefer_wine_before_sha: true }),
  'jianghu.classic.hero.yu-ji': SkillHooks({ on_damaged: [on_damaged_sheshen] }),
  'jianghu.classic.hero.wu-ze-tian': SkillHooks({ red_hand_as_tao: true }),
  'jianghu.classic.hero.yang-yan-zhao': SkillHooks({ max_sha_per_turn: 3 }),
  'jianghu.classic.hero.bian-que': SkillHooks({ tao_heal_bonus: [tao_bonus_bianque], on_opponent_dying: [on_opponent_dying_zhensha] }),
  'jianghu.classic.hero.jing-ke': SkillHooks({ sha_unavoidable: [jingke_sha_unavoidable], shans_required_to_dodge: [jingke_shans_required], ai_prefer_wine_before_sha: true }),
  'jianghu.classic.hero.han-xin': SkillHooks({ immune_to_sha_without_hand: true }),
  'jianghu.classic.hero.cheng-yao-jin': SkillHooks({ on_turn_start: [on_turn_start_chengyaojin] }),
  'jianghu.classic.hero.hua-mu-lan': SkillHooks({ on_dodge: [on_dodge_huamulan], on_sha_dodged: [on_sha_dodged_huamulan] }),
  'jianghu.classic.hero.diao-chan': SkillHooks({ on_turn_start: [on_turn_start_diaochan] }),
  'jianghu.classic.hero.yue-fei': SkillHooks({ on_damaged: [on_damaged_yuefei], response_sha_shan_swap: true }),
  'jianghu.classic.hero.jiang-wei': SkillHooks({ on_turn_start: [on_turn_start_jiangwei] }),
  'jianghu.classic.hero.shi-qian': SkillHooks({ shunshou_no_distance_limit: true, immune_to_shunshou: true }),
};

// Active skills. Their boolean result has the same command-handling meaning as Python.
// Snapshot exact physical identities before committing a public skill cost.
const hand_materials = (actor, indexes) => indexes.map(index => ({zone:'hand',index,card:actor.hand[index]}));
async function player_yuren(game, actor, target, args) {
  if (actor.used_active_skills.has('驭人')) {
    game.view.emit('驭人本回合已使用。');
    return true;
  }
  const indexes = game.parse_hand_indexes(args, actor);
  if (!indexes.length) return false;
  actor.used_active_skills.add('驭人');
  const discarded = await game.consume_material_batch(actor,hand_materials(actor,indexes),{to:'discard',reason:'驭人'});
  if (!discarded) {actor.used_active_skills.delete('驭人'); return false;}
  if (actor.alive) await game.draw_cards(actor, discarded.length);
  game.view.emit(`${actor.name}发动驭人，弃置 ${discarded.length} 张手牌并摸 ${discarded.length} 张牌。`);
  return true;
}

async function ai_yuren(game, actor, target) {
  if (actor.used_active_skills.has('驭人') || actor.hand.length < 4) return false;
  const discard_count = Math.min(2, actor.hand.length);
  const indexes = Array.from({length:discard_count},(_,i)=>actor.hand.length-1-i);
  actor.used_active_skills.add('驭人');
  const discarded = await game.consume_material_batch(actor,hand_materials(actor,indexes),{to:'discard',reason:'驭人'});
  if (!discarded) {actor.used_active_skills.delete('驭人'); return false;}
  if (actor.alive) await game.draw_cards(actor, discard_count);
  game.view.emit(`AI 发动驭人，弃 ${discard_count} 张牌并摸 ${discard_count} 张牌。`);
  return true;
}

async function player_shiquan(game, actor, target, args) {
  if (args.length !== 1) return false;
  const indexes = game.parse_hand_indexes(args, actor);
  if (!indexes.length) return false;
  const card = actor.hand[indexes[0]];
  if(!game.can_trick_target(actor,target,{type:CardType.SCROLL,name:'釜底抽薪'}))return false;
  if (card.color !== CardColor.BLACK) {
    game.view.emit('释权需要选择一张黑色手牌。');
    return true;
  }
  const cost = await game.consume_material(actor,hand_materials(actor,[indexes[0]])[0],{to:'discard',reason:'释权'});
  if (!cost) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit(`${actor.name}发动释权，将 ${cost} 当作釜底抽薪使用。`);
  const fake_card = new Card('釜底抽薪', CardType.SCROLL, 0, '弃置对手1张手牌或装备牌，无距离限制');
  await game.resolve_scroll(actor, target, fake_card,{trick_declaration_validated:true});
  await game.try_shiquan_bonus_draw(actor);
  return true;
}

async function ai_shiquan(game, actor, target) {
  if (!game.target_has_card(target)||!game.can_trick_target(actor,target,{type:CardType.SCROLL,name:'釜底抽薪'})) return false;
  const black_index = actor.hand.findIndex(card => card.color === CardColor.BLACK);
  if (black_index < 0) return false;
  const cost = await game.consume_material(actor,hand_materials(actor,[black_index])[0],{to:'discard',reason:'释权'});
  if (!cost) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit('AI 发动释权，将一张黑色手牌当釜底抽薪使用。');
  await game.resolve_scroll(actor, target, new Card('釜底抽薪', CardType.SCROLL),{trick_declaration_validated:true});
  await game.try_shiquan_bonus_draw(actor);
  return true;
}

async function player_wumu(game, actor, target, args) {
  if (args.length !== 1) return false;
  const indexes = game.parse_hand_indexes(args, actor);
  if (!indexes.length) return false;
  const card = actor.hand[indexes[0]];
  if (card.type !== CardType.SHAN) {
    game.view.emit('冲阵需要选择一张闪当杀使用。');
    return true;
  }
  if (!game.can_use_sha(actor)) {
    game.view.emit('本回合不能再使用杀。');
    return true;
  }
  if (!game.in_attack_range(actor, target)) {
    game.view.emit(`距离不够。当前距离 ${game.distance_between(actor, target)}，武器距离 ${actor.weapon_range}。`);
    return true;
  }
  const used = await game.consume_material(actor,hand_materials(actor,[indexes[0]])[0],{to:'discard',reason:'冲阵'});
  if (!used) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit(`${actor.name}发动冲阵，将闪当杀使用。`);
  await game.use_sha(actor,target,'冲阵转化的杀',{source_card:game.material_sha(actor,used),source_last_hand:actor.hand.length===0});
  return true;
}

async function ai_wumu(game, actor, target) {
  if (!game.can_use_sha(actor) || !game.in_attack_range(actor, target)) return false;
  const shan_index = game.find_card(actor, CardType.SHAN);
  if (shan_index == null) return false;
  const used = await game.consume_material(actor,hand_materials(actor,[shan_index])[0],{to:'discard',reason:'冲阵'});
  if (!used) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit('AI 发动冲阵，将闪当杀使用。');
  await game.use_sha(actor,target,'冲阵转化的杀',{source_card:game.material_sha(actor,used),source_last_hand:actor.hand.length===0});
  return true;
}

async function player_huanpai(game, actor, target, args) {
  if (actor.used_active_skills.has('换牌')) {
    game.view.emit('换牌本回合已使用。');
    return true;
  }
  if (!args.length) return false;
  if (['all', '0'].includes(args[0].toLowerCase())) {
    if (!actor.hand.length && !target.hand.length) {
      game.view.emit('双方都没有手牌，无法交换。');
      return true;
    }
    await game.swap_all_hands(actor, target);
    actor.used_active_skills.add('换牌');
    game.view.emit(`${actor.name}发动换牌，与${target.name}交换了全部手牌。`);
    return true;
  }
  const actor_indexes = game.parse_hand_indexes(args, actor);
  if (!actor_indexes.length) return false;
  const count = actor_indexes.length;
  if (target.hand.length < count) {
    game.view.emit(`${target.name}手牌不足 ${count} 张，无法交换。`);
    return true;
  }
  const target_indexes = await game.player_choose_hand_indexes(target, count);
  if (target_indexes == null) return false;
  await game.swap_hand_cards(actor, target, actor_indexes, target_indexes);
  actor.used_active_skills.add('换牌');
  game.view.emit(`${actor.name}发动换牌，与${target.name}交换了 ${count} 张手牌。`);
  return true;
}

// Blood/poison Sha have the same retention value as ordinary Sha. The Python
// table omitted these new variants and raised KeyError when sorting such hands.
function ai_card_priority(card) {
  if (is_sha_card(card)) return 3;
  return {
    [CardType.SHAN]: 5,
    [CardType.TAO]: 4,
    [CardType.WINE]: 2,
    [CardType.SCROLL]: 2,
    [CardType.WEAPON]: 1,
    [CardType.ARMOR]: 1,
    [CardType.OFFENSIVE_HORSE]: 1,
    [CardType.DEFENSIVE_HORSE]: 1,
  }[card.type] ?? 1;
}

async function ai_huanpai(game, actor, target) {
  if (actor.used_active_skills.has('换牌')) return false;
  if (!actor.hand.length && !target.hand.length) return false;
  if (target.hand.length > actor.hand.length || actor.hand.length >= 3) {
    await game.swap_all_hands(actor, target);
    actor.used_active_skills.add('换牌');
    game.view.emit(`AI 发动换牌，与${target.name}交换了全部手牌。`);
    return true;
  }
  if (!actor.hand.length || !target.hand.length) return false;
  const count = Math.min(actor.hand.length, target.hand.length);
  const actor_indexes = actor.hand.map((_, index) => index)
    .sort((a, b) => ai_card_priority(actor.hand[a]) - ai_card_priority(actor.hand[b]))
    .slice(0, count);
  const target_indexes = Array.from({ length: count }, (_, index) => index);
  await game.swap_hand_cards(actor, target, actor_indexes, target_indexes);
  actor.used_active_skills.add('换牌');
  game.view.emit(`AI 发动换牌，与${target.name}交换了 ${count} 张手牌。`);
  return true;
}

async function player_bawang(game, actor, target, args) {
  if (args.length) return false;
  if (actor.hp <= 0 || !actor.alive) return true;
  // Direct HP loss ignores armor and can be used at 1 HP, then enters dying.
  actor.hp -= 1;
  actor.bawang_stacks += 1;
  await game.draw_cards(actor, 1);
  const sha_damage = actor.alive ? game.preview_sha_damage(actor, target) : 0;
  game.view.emit(
    `${actor.name}发动霸王，失去1点血（剩余 ${Math.max(actor.hp, 0)}），摸了1张牌。`
    + (actor.hp > 0 ? `当前杀伤害 ${sha_damage}。` : ''),
  );
  if (actor.hp <= 0) await game.check_dying(actor, actor);
  return true;
}

async function ai_bawang(game, actor, target) {
  if (actor.hp <= 2) return false;
  actor.hp -= 1;
  actor.bawang_stacks += 1;
  await game.draw_cards(actor, 1);
  const sha_damage = game.preview_sha_damage(actor, target);
  game.view.emit(`AI 发动霸王，失去1点血（剩余 ${actor.hp}），摸了1张牌。当前杀伤害 ${sha_damage}。`);
  if (actor.hp <= 0) await game.check_dying(actor, actor);
  return true;
}

async function player_nudi_mark(game, actor, target, args) {
  if (args.length !== 1) return false;
  const indexes = game.parse_hand_indexes(args, actor);
  if (!indexes.length) return false;
  const card = actor.hand[indexes[0]];
  if (card.color !== CardColor.RED) {
    game.view.emit('女帝需要选择一张红色手牌。');
    return true;
  }
  const used = await game.consume_material(actor,hand_materials(actor,[indexes[0]])[0],{to:'discard',reason:'女帝',action:'discard'});
  if (!used) return false;
  if (!actor.alive || !target?.alive) return true;
  target.judgment_mark_pending = true;
  game.view.emit(`${actor.name}发动女帝，弃置 ${used} 并对${target.name}施加标记（下回合开始前判定，红色则受到1点伤害）。`);
  return true;
}

async function ai_nudi_mark(game, actor, target) {
  if (target.judgment_mark_pending) return false;
  for (let index = 0; index < actor.hand.length; index++) {
    if (actor.hand[index].color === CardColor.RED) {
      const used = await game.consume_material(actor,hand_materials(actor,[index])[0],{to:'discard',reason:'女帝',action:'discard'});
  if (!used) return false;
  if (!actor.alive || !target?.alive) return true;
      target.judgment_mark_pending = true;
      game.view.emit(`AI 发动女帝，对${target.name}施加标记（弃置 ${used}）。`);
      return true;
    }
  }
  return false;
}

async function player_bingxian(game, actor, target, args) {
  if (args.length !== 3) return false;
  const indexes = game.parse_hand_indexes(args, actor);
  if (indexes.length !== 3) return false;
  const discarded = await game.consume_material_batch(actor,hand_materials(actor,indexes),{to:'discard',reason:'兵仙'});
  if (!discarded) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit(`${actor.name}发动兵仙，弃置 ${discarded.length} 张牌。`);
  await game.apply_damage(target, 1, { source: actor, message: '{name}受到 {damage} 点伤害，剩余血量 {hp}。' });
  return true;
}

async function ai_bingxian(game, actor, target) {
  if (actor.hand.length < 3) return false;
  const discard_indexes = actor.hand.map((_, index) => index)
    .sort((a, b) => ai_card_priority(actor.hand[a]) - ai_card_priority(actor.hand[b]))
    .slice(0, 3);
  const discarded = await game.consume_material_batch(actor,hand_materials(actor,discard_indexes),{to:'discard',reason:'兵仙'});
  if (!discarded) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit(`AI 发动兵仙，弃置 ${discarded.length} 张牌。`);
  await game.apply_damage(target, 1, { source: actor, message: '{name}受到 {damage} 点伤害，剩余血量 {hp}。' });
  return true;
}

async function player_shixian(game, actor, target, args) {
  if (args.length) return false;
  if (actor.shixian_active) {
    game.view.emit('诗仙本回合已发动。');
    return true;
  }
  actor.shixian_active = true;
  actor.used_active_skills.add('诗仙');
  game.view.emit(`${actor.name}发动诗仙，本回合手牌与装备均可当杀使用（装备：eq weapon/armor/进攻马/防御马）。`);
  return true;
}

async function ai_shixian(game, actor, target) {
  if (actor.shixian_active) return false;
  if (!game.can_use_sha(actor) || !game.in_attack_range(actor, target)) return false;
  if (!game.has_shixian_playable(actor, target)) return false;
  actor.shixian_active = true;
  actor.used_active_skills.add('诗仙');
  game.view.emit('AI 发动诗仙，本回合手牌与装备均可当杀使用。');
  return true;
}

async function player_feizei_shunshou(game, actor, target, args) {
  if (args.length !== 1) return false;
  const indexes = game.parse_hand_indexes(args, actor);
  if (!indexes.length) return false;
  const card = actor.hand[indexes[0]];
  if (card.suit !== CardSuit.CLUB) {
    game.view.emit('飞贼需要选择一张梅花手牌。');
    return true;
  }
  if (!game.can_use_shunshou(actor, target)) {
    if (game.is_immune_to_shunshou(target)) game.view.emit(`${target.name}免疫顺手牵羊。`);
    else game.view.emit(`距离不够。当前距离 ${game.distance_between(actor, target)}，顺手牵羊距离 1。`);
    return true;
  }
  if (!game.target_has_card(target)) {
    game.view.emit(`${target.name}没有可获得的牌。`);
    return true;
  }
  const cost = await game.consume_material(actor,hand_materials(actor,[indexes[0]])[0],{to:'discard',reason:'飞贼'});
  if (!cost) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit(`${actor.name}发动飞贼，将 ${cost} 当作顺手牵羊使用。`);
  const fake_card = new Card('顺手牵羊', CardType.SCROLL, 0, '距离1，获得对手1张手牌或装备牌');
  await game.resolve_scroll(actor, target, fake_card,{trick_declaration_validated:true});
  return true;
}

async function ai_feizei_shunshou(game, actor, target) {
  if (!game.can_use_shunshou(actor, target) || !game.target_has_card(target)) return false;
  const club_index = actor.hand.findIndex(card => card.suit === CardSuit.CLUB);
  if (club_index < 0) return false;
  const cost = await game.consume_material(actor,hand_materials(actor,[club_index])[0],{to:'discard',reason:'飞贼'});
  if (!cost) return false;
  if (!actor.alive || !target?.alive) return true;
  game.view.emit('AI 发动飞贼，将一张梅花手牌当顺手牵羊使用。');
  await game.resolve_scroll(actor, target, new Card('顺手牵羊', CardType.SCROLL));
  return true;
}

const builtinActive = {
  'jianghu.classic.hero.li-bai': [new ActiveSkillDef({
    skill_id: '诗仙', hotkey: 'q', help_text: '诗仙：发动后本回合手牌与装备均可当杀',
    player: player_shixian, ai: ai_shixian, arg_mode: 'none', button_label: '诗仙',
    available: (game,actor,target) => actor.alive && !actor.shixian_active && game.has_shixian_playable(actor,target) && game.can_sha_target(actor,target),
  })],
  'jianghu.classic.hero.wu-ze-tian': [new ActiveSkillDef({
    skill_id: '女帝', hotkey: 'q', help_text: '女帝：弃一张红色手牌，对对手施加标记',
    player: player_nudi_mark, ai: ai_nudi_mark, arg_mode: 'one_card',
    min_cards: 1, max_cards: 1, card_filter: 'red', button_label: '女帝',
  })],
  'jianghu.classic.hero.xiang-yu': [new ActiveSkillDef({
    skill_id: '霸王', hotkey: 'q', help_text: '霸王：失去1点血并摸1张牌，可叠加；1血也可发动，无桃则阵亡',
    player: player_bawang, ai: ai_bawang, arg_mode: 'none', button_label: '霸王',
    available: (_game,actor) => actor.alive && actor.hp > 0,
  })],
  'jianghu.classic.hero.liu-bang': [new ActiveSkillDef({
    skill_id: '驭人', hotkey: 'q', help_text: '驭人：弃任意张手牌并摸等量牌，每回合一次',
    player: player_yuren, ai: ai_yuren, arg_mode: 'cards',
    min_cards: 1, max_cards: 0, card_filter: 'any', button_label: '驭人',
  })],
  'jianghu.classic.hero.zhao-kuang-yin': [new ActiveSkillDef({
    skill_id: '释权', hotkey: 'q', help_text: '释权：将一张黑色手牌当釜底抽薪',
    player: player_shiquan, ai: ai_shiquan, arg_mode: 'one_card',
    min_cards: 1, max_cards: 1, card_filter: 'black', button_label: '释权',
  })],
  'jianghu.classic.hero.yang-zai-xing': [new ActiveSkillDef({
    skill_id: '冲阵', hotkey: 'q', help_text: '冲阵：将一张闪当杀使用',
    player: player_wumu, ai: ai_wumu, arg_mode: 'one_card',
    min_cards: 1, max_cards: 1, card_filter: 'shan', button_label: '冲阵',
  })],
  'jianghu.classic.hero.bao-si': [new ActiveSkillDef({
    skill_id: '换牌', hotkey: 'q', help_text: '换牌：可一键换全部，或选若干张与对手等量交换',
    player: player_huanpai, ai: ai_huanpai, arg_mode: 'cards_or_all',
    min_cards: 1, max_cards: 0, card_filter: 'any', button_label: '换牌',
  })],
  'jianghu.classic.hero.han-xin': [new ActiveSkillDef({
    skill_id: '兵仙', hotkey: 'q', help_text: '兵仙：弃3张手牌，令对手失去1点血',
    player: player_bingxian, ai: ai_bingxian, arg_mode: 'exactly_n',
    min_cards: 3, max_cards: 3, card_filter: 'any', button_label: '兵仙',
  })],
  'jianghu.classic.hero.shi-qian': [new ActiveSkillDef({
    skill_id: '飞贼', hotkey: 'q', help_text: '飞贼：将一张梅花手牌当顺手牵羊',
    player: player_feizei_shunshou, ai: ai_feizei_shunshou, arg_mode: 'one_card',
    min_cards: 1, max_cards: 1, card_filter: 'club', button_label: '飞贼',
  })],
};

// The older source modules return name-keyed definitions. Bind their known
// entries to fixed IDs once; never derive a rule key from hero.name at runtime.
const expansion = expansion_skill_definitions({SkillHooks,ActiveSkillDef});
const secondFour = second_four_skill_definitions({SkillHooks,ActiveSkillDef});
for (const [definitions, bindings] of [
  [expansion, [
    ['guan-yu', '关羽'], ['zhang-fei', '张飞'], ['gan-ning', '甘宁'], ['huang-gai', '黄盖'],
    ['lv-meng', '吕蒙'], ['xu-chu', '许褚'], ['xia-hou-dun', '夏侯惇'], ['huang-yue-ying', '黄月英'],
  ]],
  [secondFour, [['zhao-yun', '赵云'], ['ma-chao', '马超'], ['zhou-yu', '周瑜'], ['zhu-ge-liang', '诸葛亮']]],
]) for (const [suffix, definitionName] of bindings) {
  const id = `sgs.adapted.base.hero.${suffix}`;
  if (Object.hasOwn(definitions.hooks, definitionName)) builtinHooks[id] = definitions.hooks[definitionName];
  if (Object.hasOwn(definitions.active, definitionName)) builtinActive[id] = definitions.active[definitionName];
}
const mergedSourceIds=new Set([...HERO_SOURCE_MERGES.map(merge=>merge.source_id),...HERO_ORIGINAL_MERGES.map(merge=>merge.original_id)]);
register_hero_rules([...CLASSIC_HEROES.filter(hero=>!mergedSourceIds.has(hero.id)), ...EXPANSION_HEROES.filter(hero=>!mergedSourceIds.has(hero.id)), ...SECOND_FOUR_HEROES.filter(hero=>!mergedSourceIds.has(hero.id))].map(hero => {
  if (!Object.hasOwn(builtinHooks, hero.id) && !Object.hasOwn(builtinActive, hero.id)) {
    throw new Error(`Missing explicit builtin hero rule registration: ${hero.id}`);
  }
  return {hero, hooks: builtinHooks[hero.id] ?? null, active: builtinActive[hero.id] ?? [],
    capabilities: hero.id === 'jianghu.classic.hero.li-bai' ? ['shixian'] : []};
}));

const yxsFirst=yxs_first_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(YXS_FIRST_HEROES.map(hero=>({hero,hooks:yxsFirst.hooks[hero.id]??null,active:yxsFirst.active[hero.id]??[],
  id_aliases:hero.source_id_aliases??[],aliases:hero.aliases??[]})));

// ID-keyed production packets. Merged source IDs have already been excluded
// above; explicit aliases cannot steal independently registered source records.
const yxsNext=yxs_next_skill_definitions({SkillHooks,ActiveSkillDef});
const yxsNextDamage=yxs_next_damage_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(YXS_NEXT_HEROES.map(hero=>{
  const definitions=Object.hasOwn(yxsNext.hooks,hero.id)?yxsNext:yxsNextDamage;
  if(!Object.hasOwn(definitions.hooks,hero.id))throw new Error(`Missing next YXS hero rule registration: ${hero.id}`);
  return {hero,hooks:definitions.hooks[hero.id],active:definitions.active[hero.id]??[],
    id_aliases:hero.source_id_aliases??[],aliases:hero.aliases??[]};
}));

// Third historical packet: canonical and migrated IDs share exactly one handler.
// A legacy research ID is not an additional source-equivalence merge.
const yxsThirdPhase=yxs_third_phase_skill_definitions({SkillHooks,ActiveSkillDef});
const yxsThirdResponse=yxs_third_response_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(YXS_THIRD_HEROES.map(hero=>{
  const definitions=Object.hasOwn(yxsThirdPhase.hooks,hero.id)?yxsThirdPhase:yxsThirdResponse;
  if(!Object.hasOwn(definitions.hooks,hero.id))throw new Error(`Missing third YXS hero rule registration: ${hero.id}`);
  return {hero,hooks:definitions.hooks[hero.id],active:definitions.active[hero.id]??[],
    id_aliases:[...(hero.source_id_aliases??[]),...(hero.legacy_source_ids??[])],aliases:hero.aliases??[]};
}));

const yxsFourth=yxs_fourth_skill_definitions({SkillHooks,ActiveSkillDef});
const yxsFourthTrick=yxs_fourth_trick_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(YXS_FOURTH_HEROES.map(hero=>{
  const definitions=Object.hasOwn(yxsFourth.hooks,hero.id)?yxsFourth:yxsFourthTrick;
  if(!Object.hasOwn(definitions.hooks,hero.id))throw Error(`Missing complete fourth source rules: ${hero.id}`);
  return {hero,hooks:definitions.hooks[hero.id],active:definitions.active[hero.id]??[],id_aliases:[...(hero.source_id_aliases??[]),...(hero.merged_original_ids??[]),...(hero.legacy_source_ids??[])],aliases:hero.aliases??[]};
}));
const liuyeDerived=liuye_skill_definitions({SkillHooks});
register_hero_rules(DERIVED_HEROES.filter(is_hero_in_release).map(hero=>({hero,hooks:liuyeDerived.hooks[hero.id],active:liuyeDerived.active[hero.id]??[],id_aliases:[...(hero.source_id_aliases??[]),...(hero.legacy_source_ids??[])],aliases:hero.aliases??[]})));

const yxsFifthActive=yxs_fifth_active_skill_definitions({SkillHooks,ActiveSkillDef});
const yxsFifthYuji=yxs_fifth_yuji_skill_definitions({SkillHooks});
register_hero_rules(YXS_FIFTH_HEROES.map(hero=>{
  const definitions=Object.hasOwn(yxsFifthActive.hooks,hero.id)?yxsFifthActive:yxsFifthYuji;
  if(!Object.hasOwn(definitions.hooks,hero.id))throw Error(`Missing complete fifth source rules: ${hero.id}`);
  return {hero,hooks:definitions.hooks[hero.id],active:definitions.active[hero.id]??[],id_aliases:[...(hero.source_id_aliases??[]),...(hero.legacy_source_ids??[])],aliases:hero.aliases??[]};
}));

const yxsSixth=yxs_sixth_guard_skill_definitions({SkillHooks,has_skill:yxs_guard_has_skill});
register_hero_rules(YXS_SIXTH_HEROES.map(hero=>({hero,hooks:yxsSixth.hooks[hero.id],active:[],id_aliases:hero.legacy_source_ids??[],aliases:hero.aliases??[]})));

const yxsXiadan=yxs_xiadan_skill_definitions({SkillHooks,ActiveSkillDef,dependencies:seventhDependencies});
const yxsQueen=yxs_queen_skill_definitions({SkillHooks,ActiveSkillDef,dependencies:seventhDependencies});
register_hero_rules(YXS_SEVENTH_HEROES.map(hero=>{
 const definitions=Object.hasOwn(yxsXiadan.hooks,hero.id)?yxsXiadan:yxsQueen;
 if(!Object.hasOwn(definitions.hooks,hero.id))throw Error(`Missing seventh source rules: ${hero.id}`);
 return {hero,hooks:definitions.hooks[hero.id],active:definitions.active[hero.id]??[],id_aliases:hero.legacy_source_ids??[],aliases:hero.aliases??[]};
}));

const yxsEighth=yxs_eighth_skill_definitions({SkillHooks,ActiveSkillDef,has_skill:eighth_has_skill});
register_hero_rules(YXS_EIGHTH_HEROES.map(hero=>({hero,hooks:yxsEighth.hooks[hero.id],active:yxsEighth.active[hero.id]??[],id_aliases:hero.legacy_source_ids??[],aliases:hero.aliases??[]})));

const yxsNinth=yxs_ninth_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(YXS_NINTH_HEROES.map(hero=>({hero,hooks:yxsNinth.hooks[hero.id],active:yxsNinth.active[hero.id]??[],aliases:hero.aliases??[]})));

const sgsBaseNext=sgs_base_next_skill_definitions({SkillHooks,ActiveSkillDef});
const sgsZhenji=sgs_zhenji_skill_definitions({SkillHooks});
register_hero_rules(SGS_BASE_NEXT_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=Object.hasOwn(sgsBaseNext.hooks,hero.id)?sgsBaseNext:sgsZhenji;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete base source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active[hero.id]??[],aliases:hero.aliases??[]};
}));

const followingLoss=sgs_following_loss_skill_definitions({SkillHooks,ActiveSkillDef});
const followingDuel=sgs_following_duel_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_FOLLOWING_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=Object.hasOwn(followingLoss.hooks,hero.id)?followingLoss:followingDuel;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete following source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active[hero.id]??[],aliases:hero.aliases??[]};
}));

const windHealFlip=sgs_wind_heal_flip_skill_definitions({SkillHooks,ActiveSkillDef});
const windSpeedBow=sgs_wind_speed_bow_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_WIND_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=Object.hasOwn(windHealFlip.hooks,hero.id)?windHealFlip:windSpeedBow;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete wind source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active[hero.id]??[],aliases:hero.aliases??[]};
}));

const nextTransfer=sgs_next_transfer_recovery_skill_definitions({SkillHooks,ActiveSkillDef});
const nextAssault=sgs_next_discard_assault_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_NEXT_IDENTITY_HEROES.map(hero=>{
 const bundle=Object.hasOwn(nextTransfer.hooks,hero.id)?nextTransfer:nextAssault;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete next identity rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active[hero.id]??[],aliases:hero.aliases??[]};
}));

const wangyunBundle=wangyun_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(WANGYUN_HEROES.filter(is_hero_in_release).map(hero=>({hero,hooks:wangyunBundle.hooks[hero.id],active:wangyunBundle.active[hero.id],aliases:hero.aliases??[]})));

const fireControl=sgs_fire_control_skill_definitions({SkillHooks,ActiveSkillDef});
const fireAssault=sgs_fire_assault_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_FIRE_HEROES.map(hero=>{
 const bundle=Object.hasOwn(fireControl.hooks,hero.id)?fireControl:fireAssault;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete fire source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active[hero.id]??[],aliases:hero.aliases??[]};
}));

const forestSupport=sgs_forest_support_skill_definitions({SkillHooks,ActiveSkillDef});
const forestAssault=sgs_forest_assault_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_FOREST_HEROES.map(hero=>{
 const bundle=Object.hasOwn(forestSupport.hooks,hero.id)?forestSupport:forestAssault;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete forest source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const mountainPhase=sgs_mountain_phase_skill_definitions({SkillHooks,ActiveSkillDef});
const mountainField=sgs_mountain_field_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_MOUNTAIN_HEROES.map(hero=>{
 const bundle=Object.hasOwn(mountainPhase.hooks,hero.id)?mountainPhase:mountainField;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete mountain source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

for(const [id,hooks] of Object.entries(mountainPhase.granted_hooks??{}))generalGrantedHooks.set(id,hooks);
for(const skills of Object.values(mountainField.active))for(const skill of skills)if(skill.source_skill_id==='sgs.jixi')generalGrantedActives.set('sgs.jixi',[skill]);

const yijiangEquipment=sgs_yijiang_equipment_skill_definitions({SkillHooks,ActiveSkillDef});
const yijiangCombat=sgs_yijiang_combat_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_YIJIANG_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=Object.hasOwn(yijiangEquipment.hooks,hero.id)?yijiangEquipment:yijiangCombat;
 if(!Object.hasOwn(bundle.hooks,hero.id))throw Error(`Missing complete Yijiang source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const followingPackets=[sgs_following_masu_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_following_caozhang_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_following_jieyue_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_YIJIANG_FOLLOWING_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=followingPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete following source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const yijiangNextPackets=[sgs_next_handang_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_next_liaohua_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_next_bulianshi_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_YIJIANG_NEXT_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=yijiangNextPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete next source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const yijiangLaterPackets=[sgs_later_caochong_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_later_guanping_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_later_yufan_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_later_guohuai_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_YIJIANG_LATER_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=yijiangLaterPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete later source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const yijiangMorePackets=[sgs_yijiang_more_lidian_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_yijiang_more_zhuran_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_yijiang_more_caozhi_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_YIJIANG_MORE_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=yijiangMorePackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete more source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const yijiangFurtherPackets=[sgs_yijiang_further_xushu_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_yijiang_further_quancong_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_yijiang_further_guyong_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_yijiang_further_xiahoushi_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_YIJIANG_FURTHER_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=yijiangFurtherPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete further source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const sourceFollowupPackets=[sgs_followup_caozhen_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_followup_zhuhuan_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_followup_chenqun_skill_definitions({SkillHooks,ActiveSkillDef}),sgs_followup_zhangni_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(SGS_FOLLOWUP_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=sourceFollowupPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete source followup rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const modernPackets=[yxs_modern_zhangqian_skill_definitions({SkillHooks,ActiveSkillDef}),yxs_modern_wudaozi_skill_definitions({SkillHooks,ActiveSkillDef})];
register_hero_rules(YXS_MODERN_HEROES.filter(hero=>hero.implementation_status==='tested').map(hero=>{
 const bundle=modernPackets.find(p=>Object.hasOwn(p.hooks,hero.id));
 if(!bundle)throw Error(`Missing complete modern source rules: ${hero.id}`);
 return {hero,hooks:bundle.hooks[hero.id],active:bundle.active?.[hero.id]??[],aliases:hero.aliases??[]};
}));

const zhangfenPacket=zhangfen_skill_definitions({SkillHooks,ActiveSkillDef});
register_hero_rules(SGS_ZHANGFEN_HEROES.filter(is_hero_in_release).map(hero=>({hero,hooks:zhangfenPacket.hooks[hero.id],active:zhangfenPacket.active[hero.id],aliases:hero.aliases??[]})));

for(const [heroes,makePacket] of [[SGS_MANCHONG_HEROES,sgs_manchong_skill_definitions],[SGS_LIRU_HEROES,sgs_liru_skill_definitions]]){
 const packet=makePacket({SkillHooks,ActiveSkillDef});
 register_hero_rules(heroes.map(hero=>({hero,hooks:packet.hooks[hero.id],active:packet.active[hero.id]??[],aliases:hero.aliases??[]})));
}

for(const [heroes,makePacket] of [[SGS_LINGCAO_HEROES,sgs_lingcao_skill_definitions],[SGS_SUNRU_HEROES,sgs_sunru_skill_definitions],[SGS_YUEJIN_HEROES,sgs_yuejin_skill_definitions],[SGS_CHENLIN_HEROES,sgs_chenlin_skill_definitions],[SGS_CAOXIU_HEROES,sgs_caoxiu_skill_definitions],[SGS_CAOANG_HEROES,sgs_caoang_skill_definitions],[SGS_PANZHANGMAZHONG_HEROES,sgs_panzhangmazhong_skill_definitions]]){
 const packet=makePacket({SkillHooks,ActiveSkillDef});
 register_hero_rules(heroes.map(hero=>({hero,hooks:packet.hooks[hero.id],active:packet.active[hero.id]??[],aliases:hero.aliases??[]})));
}
