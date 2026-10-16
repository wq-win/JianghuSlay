/** Gameplay-equivalence signatures, not name/trait-only deduplication.
 * These describe the implemented source-closed ordinary rules plus explicitly
 * recorded Jianghu compatibility rules. Unknown differences are never merged.
 */
const freeze = value => { if (value && typeof value === 'object') {for (const child of Object.values(value)) freeze(child);Object.freeze(value);}return value;};
const base = (slot, range, effect, overrides = {}) => ({
  slot, attack_range:range, effect,
  trigger:'continuous', conditions:[], activation:'locked',
  cost:{count:0,zones:[],excluded:[],payment:'none'},
  selection:{chooser:'none',zones:[],minimum:0,maximum:0,visibility:'public'},
  targets:{scope:'self',minimum:0,maximum:0,legal_target_check:'unchanged'},
  limits:{per_turn:null,per_event:null},
  distance:{modifier:0,direction:'none',minimum:1,check:'normal'},
  damage:{amount_modifier:0,replaces_all:false,nature:'unchanged',event:'unchanged'},
  armor:{scope:'none',nullifiable:true},
  virtual_card:{type:null,color_rule:null,suit_rule:null},
  follow_up:{creates_new_attack:false,reuses_damage_context:false,rechecks_dodge:false,uses_play_quota:false},
  compatibility:{sha_family:['杀','血杀','毒杀','火杀','雷杀'],blood_poison_nature:'normal-non-chain',equipment_counterspell:false},
  ...overrides,
});
const weapon = (range,effect,overrides={}) => base('weapon',range,effect,{armor:{scope:'none',nullifiable:false},...overrides});
const optional = {activation:'optional'};
const follow = distance => weapon(3,'follow_sha',{
  ...optional,trigger:'after_sufficient_shan_and_immediate_dodge_triggers',
  conditions:['source_and_target_alive','still_equipped','available_legal_sha_materials'],
  cost:{count:'sha_materials',zones:['hand','authorized_conversion_equipment'],excluded:[],payment:'new_card_use'},
  targets:{scope:'same_original_target',minimum:1,maximum:1,legal_target_check:'recheck_prohibitions'},
  limits:{per_turn:null,per_event:1},distance:{modifier:0,direction:'none',minimum:1,check:distance},
  follow_up:{creates_new_attack:true,reuses_damage_context:false,rechecks_dodge:true,uses_play_quota:false},
  damage:{amount_modifier:0,replaces_all:false,nature:'selected_new_sha',event:'new_attack_without_previous_wine'},
});
const spear = color => weapon(3,'two_as_sha',{
  ...optional,trigger:'need_to_use_or_respond_sha',conditions:['two_distinct_hand_cards','legal_response_or_use_window'],
  cost:{count:2,zones:['hand'],excluded:['equipment','judgment'],payment:'simultaneous'},
  selection:{chooser:'owner',zones:['hand'],minimum:2,maximum:2,visibility:'private_to_owner'},
  targets:{scope:'sha_targets',minimum:0,maximum:'normal_sha',legal_target_check:'ordinary_sha_rules'},
  virtual_card:{type:'ordinary_sha',color_rule:color,suit_rule:'same_suit_else_none'},
});
const replace = judgment => weapon(2,judgment?'dragon_blade':'ice_sword',{
  ...optional,trigger:'confirmed_sha_damage_before_hp_application',conditions:['attack_not_prevented','target_has_discardable_cards'],
  selection:{chooser:'attacker',zones:judgment?['hand','equipment','judgment']:['hand','equipment'],minimum:1,maximum:2,visibility:'target_hand_hidden_equipment_and_judgment_public',sequence:'one_at_a_time_await_each_loss_rebuild_second_choice',must_continue_if_second_exists:true},
  targets:{scope:'current_sha_target',minimum:1,maximum:1,legal_target_check:'already_confirmed'},
  limits:{per_turn:null,per_event:1},damage:{amount_modifier:0,replaces_all:true,nature:'cancelled',event:'no_damage_no_loss_hp_or_on_damage_rewards'},
});
export const EQUIPMENT_MECHANISMS = freeze({
  unlimited_sha:weapon(1,'unlimited_sha',{trigger:'own_play_phase_sha_use',conditions:['weapon_remains_equipped'],limits:{per_turn:'unlimited_sha',per_event:null}}),
  ignore_armor:weapon(2,'ignore_armor',{trigger:'sha_target_confirmation_through_direct_target_resolution',conditions:['legal_sha_target'],targets:{scope:'each_direct_sha_target',minimum:1,maximum:'sha_targets',legal_target_check:'ordinary_sha_rules'},armor:{scope:'current_sha_direct_target_only',nullifiable:false,does_not_remove_equipment:true,does_not_apply_to_chain_transfer:true}}),
  double_swords:weapon(2,'double_swords',{...optional,trigger:'sha_target_confirmed_before_dodge',conditions:['both_rule_genders_defined_male_or_female','different_rule_genders'],selection:{chooser:'target',zones:['hand'],minimum:0,maximum:1,visibility:'private_to_target',alternative:'attacker_draws_one',zero_hand:'attacker_draws_one'},targets:{scope:'each_direct_sha_target',minimum:1,maximum:1,legal_target_check:'already_confirmed'},limits:{per_turn:null,per_event:'once_per_target'},damage:{amount_modifier:0,replaces_all:false,nature:'unchanged',event:'effect_remains_even_if_sha_dodged'}}),
  ice_sword:replace(false),dragon_blade:replace(true),
  axe:weapon(3,'axe',{...optional,trigger:'after_sufficient_shan_and_immediate_dodge_triggers',conditions:['source_and_target_alive','two_discardable_cards','weapon_still_equipped'],cost:{count:2,zones:['hand','equipment'],excluded:['this_weapon','judgment'],payment:'simultaneous_before_loss_triggers'},selection:{chooser:'attacker',zones:['own_hand','own_equipment'],minimum:2,maximum:2,visibility:'private_to_owner'},targets:{scope:'same_original_target',minimum:1,maximum:1,legal_target_check:'do_not_recheck_distance_after_cost'},limits:{per_turn:null,per_event:1},follow_up:{creates_new_attack:false,reuses_damage_context:true,rechecks_dodge:false,uses_play_quota:false},damage:{amount_modifier:0,replaces_all:false,nature:'original_sha',event:'original_damage_after_all_cost_loss_triggers'}}),
  follow_sha_unlimited_distance:follow('exempt_for_follow_up'),
  follow_sha_normal_distance:follow('normal_recheck_source_exemption_unverified'),
  spear_mixed_colorless:spear('all_red_red_all_black_black_other_colorless'),
  spear_any_red:spear('any_red_red_all_black_black_other_colorless'),
  last_hand_targets:weapon(4,'last_hand_targets',{...optional,trigger:'sha_target_selection',conditions:['used_sha_exhausts_hand'],selection:{chooser:'attacker',zones:['living_characters'],minimum:1,maximum:3,visibility:'public'},targets:{scope:'up_to_three_different_nonself_legal_sha_targets',minimum:1,maximum:3,legal_target_check:'range_and_prohibitions_for_each'},limits:{per_turn:null,per_event:'one_sha_use'},damage:{amount_modifier:0,replaces_all:false,nature:'original_sha',event:'separate_response_and_damage_for_each_target'}}),
  dismount:weapon(5,'dismount',{...optional,trigger:'sha_hit_causing_damage_before_hp_and_target_damage_reaction',conditions:['target_has_equipped_horse'],selection:{chooser:'attacker',zones:['target_offensive_horse','target_defensive_horse'],minimum:0,maximum:1,visibility:'public'},targets:{scope:'current_sha_target',minimum:1,maximum:1,legal_target_check:'already_confirmed'},limits:{per_turn:null,per_event:1},damage:{amount_modifier:0,replaces_all:false,nature:'unchanged',event:'equipment_loss_resolves_before_original_damage'}}),
  empty_hand_damage:weapon(2,'empty_hand_damage',{trigger:'calculate_direct_sha_damage',conditions:['target_has_zero_hand_cards_at_damage_time'],damage:{amount_modifier:1,replaces_all:false,nature:'unchanged',event:'direct_sha_only_not_chain_duel_or_other_damage'}}),
  fire_fan:weapon(4,'fire_fan',{...optional,trigger:'ordinary_sha_use_before_target_effects',conditions:['used_card_is_ordinary_sha_not_blood_poison_fire_thunder'],virtual_card:{type:'fire_sha',color_rule:'retain_material_color',suit_rule:'retain_material_suit'},damage:{amount_modifier:0,replaces_all:false,nature:'fire',event:'same_sha_use_supports_vine_and_chain'}}),
  bagua:base('armor',null,'bagua',{...optional,trigger:'each_need_to_use_or_respond_shan',conditions:['armor_active','response_not_forbidden'],selection:{chooser:'owner',zones:['judgment_top_deck'],minimum:0,maximum:1,visibility:'public_judgment'},limits:{per_turn:null,per_event:'one_judgment_per_shan_requirement'},virtual_card:{type:'shan_on_red_judgment',color_rule:'not_material_card',suit_rule:'not_material_card'},follow_up:{creates_new_attack:false,reuses_damage_context:false,rechecks_dodge:false,uses_play_quota:false,black_judgment:'may_still_respond_with_hand_shan'},armor:{scope:'each_shan_response',nullifiable:true}}),
  renwang:base('armor',null,'renwang',{trigger:'sha_card_effect_before_dodge',conditions:['armor_active','sha_color_black_including_elemental_sha'],armor:{scope:'direct_sha_card_effect',nullifiable:true},damage:{amount_modifier:0,replaces_all:false,nature:'unchanged',event:'sha_effect_invalid_no_dodge_or_onhit_windows'}}),
  vine:base('armor',null,'vine',{trigger:['card_effect_before_response','receiving_fire_damage'],conditions:['armor_active'],armor:{scope:'ordinary_sha_and_nanman_and_wanjian_card_immunity',nullifiable:true},damage:{amount_modifier:'fire_plus_one',replaces_all:false,nature:'unchanged',event:'each_recipient_independently'},compatibility:{sha_family:['杀','血杀','毒杀','火杀','雷杀'],blood_poison_nature:'normal-non-chain',vine_plain_sha_only:true,aoe_alias:'烽火狼烟_as_南蛮入侵',equipment_counterspell:false}}),
  silver_lion:base('armor',null,'silver_lion',{trigger:['last_damage_modifier','after_leaving_equipment_zone'],conditions:['armor_effect_active','leave_recovery_owner_alive'],damage:{amount_modifier:'positive_damage_capped_at_one',replaces_all:false,nature:'unchanged',event:'each_damage_event_not_loss_hp'},armor:{scope:'damage_cap_and_equipped_card_leave',nullifiable:true},recovery:{amount:1,trigger:'leaves_equipment_slot_for_any_reason_except_death',maximum:'max_hp',not_hand_loss:true}}),
  offensive_horse:base('offensive_horse',null,'distance_minus_one',{distance:{modifier:-1,direction:'owner_to_others',minimum:1,check:'all_distance_queries'},armor:{scope:'none',nullifiable:false}}),
  defensive_horse:base('defensive_horse',null,'distance_plus_one',{distance:{modifier:1,direction:'others_to_owner',minimum:1,check:'all_distance_queries'},armor:{scope:'none',nullifiable:false}}),
});
export const EQUIPMENT_SOURCE_MECHANISMS = freeze({
  'sgs.base.equipment.crossbow':'unlimited_sha','sgs.base.equipment.qinggang':'ignore_armor','sgs.base.equipment.cixiong':'double_swords','sgs.base.equipment.hanbing':'ice_sword','sgs.base.equipment.axe':'axe','sgs.base.equipment.qinglong':'follow_sha_unlimited_distance','sgs.base.equipment.zhangba':'spear_mixed_colorless','sgs.base.equipment.fangtian':'last_hand_targets','sgs.base.equipment.qilin':'dismount','sgs.base.equipment.guding':'empty_hand_damage','sgs.base.equipment.fan':'fire_fan','sgs.base.equipment.bagua':'bagua','sgs.base.equipment.renwang':'renwang','sgs.base.equipment.tengjia':'vine','sgs.base.equipment.lion':'silver_lion',
  'shared.base.equipment.chitu':'offensive_horse','sgs.base.equipment.dayuan':'offensive_horse','sgs.base.equipment.zixing':'offensive_horse','sgs.base.equipment.dilu':'defensive_horse','sgs.base.equipment.jueying':'defensive_horse','sgs.base.equipment.zhuahuang':'defensive_horse','sgs.base.equipment.hualiu':'defensive_horse',
  'yxs.base.equipment.longlin':'dragon_blade','yxs.base.equipment.panlong':'follow_sha_normal_distance','yxs.base.equipment.yuchang':'ignore_armor','yxs.base.equipment.luye':'spear_any_red','yxs.base.equipment.bolang':'axe','yxs.base.equipment.hufu':'unlimited_sha','yxs.base.equipment.bawang':'dismount','yxs.base.equipment.langya':'last_hand_targets','yxs.base.equipment.yuruyi':'bagua','yxs.base.equipment.wuzhui':'offensive_horse','yxs.base.equipment.dilu':'offensive_horse','yxs.base.equipment.nieying':'defensive_horse','yxs.base.equipment.huleibo':'defensive_horse','yxs.base.equipment.zhuifeng':'defensive_horse',
});
export const EQUIPMENT_CANONICAL_BY_MECHANISM = freeze({
  unlimited_sha:'yxs.base.equipment.hufu',ignore_armor:'yxs.base.equipment.yuchang',double_swords:'sgs.base.equipment.cixiong',ice_sword:'sgs.base.equipment.hanbing',axe:'yxs.base.equipment.bolang',follow_sha_unlimited_distance:'sgs.base.equipment.qinglong',spear_mixed_colorless:'sgs.base.equipment.zhangba',last_hand_targets:'yxs.base.equipment.langya',dismount:'yxs.base.equipment.bawang',empty_hand_damage:'sgs.base.equipment.guding',fire_fan:'sgs.base.equipment.fan',bagua:'yxs.base.equipment.yuruyi',renwang:'sgs.base.equipment.renwang',vine:'sgs.base.equipment.tengjia',silver_lion:'sgs.base.equipment.lion',offensive_horse:'yxs.base.equipment.wuzhui',defensive_horse:'yxs.base.equipment.nieying',dragon_blade:'yxs.base.equipment.longlin',follow_sha_normal_distance:'yxs.base.equipment.panlong',spear_any_red:'yxs.base.equipment.luye',
});
export function decorate_equipment_source(record) {
  const mechanism_key=EQUIPMENT_SOURCE_MECHANISMS[record.id],mechanism_signature=EQUIPMENT_MECHANISMS[mechanism_key];
  if(!mechanism_signature)throw Error(`Missing complete equipment mechanism: ${record.id}`);
  return {...record,source_original_name:record.base_name??record.name,mechanism_key,mechanism_signature,mechanism_signature_key:JSON.stringify(mechanism_signature),canonical_id:EQUIPMENT_CANONICAL_BY_MECHANISM[mechanism_key],ordinary_deck:false,source_only:true,follow_sha_no_distance:mechanism_key==='follow_sha_unlimited_distance'};
}
