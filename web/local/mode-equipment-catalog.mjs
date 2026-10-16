/** Optional, finite Heroes Kill Zhuque equipment compatibility pack.
 * Historical source rules + the 2026 mobile return announcement, not a claim
 * to reproduce the five-player mode or its complete 158-card source deck.
 * One physical copy per selected mechanism is an explicit Jianghu deck choice.
 */
const freeze = value => { if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); } return value; };
export const ZHUQUE_EQUIPMENT_PACK_ID = 'yxs_zhuque_equipment_compat_1';
const equipmentSource = 'https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3';
const mobileSource = 'https://www.taptap.cn/moment/852313126639502699?group_id=1334';
const basicSource = 'https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1697/m1628/201203/56649.shtml?1';
const signature = (slot,range,effect,overrides = {}) => ({
  slot,attack_range:range,effect,trigger:'continuous',conditions:['explicit_pack_enabled','equipped_effect_active'],activation:'locked',
  cost:{count:0,zones:[],excluded:[],payment:'none'},selection:{chooser:'none',zones:[],minimum:0,maximum:0,visibility:'public'},
  targets:{scope:'self',minimum:0,maximum:0,legal_target_check:'unchanged'},limits:{per_turn:null,per_event:null},
  distance:{modifier:0,direction:'none',minimum:1,check:'normal'},damage:{amount_modifier:0,replaces_all:false,nature:'unchanged',event:'unchanged'},
  armor:{scope:'none',nullifiable:slot==='armor'},virtual_card:{type:null,color_rule:null,suit_rule:null},
  follow_up:{creates_new_attack:false,reuses_damage_context:false,rechecks_dodge:false,uses_play_quota:false},
  compatibility:{finite_optional_deck:true,source_mode_complete:false,source_deck_copies_not_claimed:true,death_leave_no_reward:true},
  ...overrides,
});
const rows = [
  ['yinxue','饮血剑','武器',2,'blood_sword','physical_plain_sha_to_blood_range2',
    '使用实体普通杀时，可将本次杀改为血杀；造成正数实际伤害且伤害后反应结算完，存活则回复等量体力。',
    signature('weapon',2,'blood_sword',{
      trigger:'physical_plain_sha_use_before_card_effect_and_response',activation:'optional',
      conditions:['explicit_pack_enabled','equipped_effect_active','same_physical_ordinary_sha_identity','use_not_response','no_hero_or_other_virtual_conversion'],
      cost:{count:1,zones:['hand_or_authorized_processing'],excluded:['virtual_sha','aojian','wumu','elemental_blood_poison_sha'],payment:'same_physical_sha_no_extra_cost'},
      selection:{chooser:'owner',zones:['current_sha_use'],minimum:0,maximum:1,visibility:'public'},
      targets:{scope:'same_legal_sha_targets',minimum:1,maximum:'normal_or_hero_sha',legal_target_check:'unchanged'},
      limits:{per_turn:null,per_event:1},virtual_card:{type:'blood_sha_use_view',color_rule:'retain_original',suit_rule:'retain_original',rank_rule:'retain_original',physical_original_unchanged:true},
      damage:{amount_modifier:0,replaces_all:false,nature:'normal_non_chain',event:'same_sha_actual_damage_after_all_retaliation_then_heal_living_source'},
      compatibility:{finite_optional_deck:true,source_mode_complete:false,source_deck_copies_not_claimed:true,virtual_sha_exclusion:'explicit_cross_game_compatibility_not_publisher_general_ruling',wine:'existing_jianghu_bonus_same_sha',hezonglianheng:false},
    })],
  ['jinlin','金鳞甲','防具',null,'golden_armor','two_aoe_immunity_and_equipped_leave_heal1',
    '烽火狼烟、万箭齐发对你无效；从装备区离开时，原持有者回复1点体力。',
    signature('armor',null,'golden_armor',{
      trigger:['specified_aoe_card_effect_before_response','after_leaving_equipment_zone'],armor:{scope:'nanman_fenghuo_wanjian_card_effect_and_equipped_leave',nullifiable:true},
      recovery:{amount:1,trigger:'equipment_leave_after_destination_commit',maximum:'max_hp',not_hand_loss:true,not_final_dead:true},
      compatibility:{finite_optional_deck:true,source_mode_complete:false,source_deck_copies_not_claimed:true,aoe_alias:'烽火狼烟_as_南蛮入侵',death_leave_no_reward:true,armor_ignore:'current_event_scope_only'},
    })],
  ['qiankun','乾坤袋','防具',null,'qiankun_bag','armor_handlimit_plus1_and_equipped_leave_draw1',
    '装备时手牌上限+1；从装备区离开时，原持有者摸1张牌。',
    signature('armor',null,'qiankun_bag',{
      trigger:['current_hand_limit_query','after_leaving_equipment_zone'],armor:{scope:'hand_limit_and_equipped_leave',nullifiable:true},
      hand_limit:{bonus:1,stack_with_hero:true,only_current_equipped:true,does_not_start_extra_discard_phase:true},
      draw:{count:1,trigger:'equipment_leave_after_destination_commit',uses_normal_reshuffle:true,not_hand_loss:true,not_final_dead:true},
    })],
  ["kongque","孔雀翎","武器",4,"peacock_plume","peacock_plume_source_rules_with_jianghu_compat_v1","出牌阶段，你可以失去1点体力，濒死救援结算后，本回合你使用的所有杀伤害+1。可重复发动但不叠加；本地兼容规则与酒取较大值。",{"slot":"weapon","attack_range":4,"effect":"peacock_plume","trigger":["own_play_phase_explicit_equipment_action","sha_use_context_snapshot"],"conditions":["explicit_pack_enabled","equipped_effect_active_at_activation","owner_alive","own_play_phase"],"activation":"optional","cost":{"count":1,"resource":"hp","zones":[],"excluded":["damage_event"],"payment":"await_lose_hp_then_rescue_before_continuation"},"selection":{"chooser":"owner","zones":["equipment_action"],"minimum":0,"maximum":1,"visibility":"public"},"targets":{"scope":"other_characters_targeted_by_owners_sha_use","minimum":1,"maximum":"normal_sha_targets","legal_target_check":"normal"},"limits":{"per_turn":null,"per_event":1,"repeat_activation":"legal_cost_again_no_extra_bonus"},"distance":{"modifier":0,"direction":"none","minimum":1,"check":"normal"},"damage":{"amount_modifier":1,"replaces_all":false,"nature":"unchanged","event":"all_qualifying_sha_uses_in_same_turn","stack_group":"jianghu_wine_or_yxs_peacock_max"},"armor":{"scope":"none","nullifiable":false},"virtual_card":{"type":null,"color_rule":null,"suit_rule":null},"follow_up":{"creates_new_attack":false,"reuses_damage_context":false,"rechecks_dodge":false,"uses_play_quota":false},"compatibility":{"sha_family":["杀","血杀","毒杀","火杀","雷杀"],"finite_optional_deck":true,"source_mode_complete":false,"source_deck_copies_not_claimed":true,"equipment_counterspell":false,"wine":"max_with_existing_jianghu_wine_bonus_explicit_local_choice","zhen":"max_one_with_peacock","manwu":"retain_once_snapshotted_source_bonus","elemental":"direct_sha_plus_one_then_normal_chain_propagation","blood_poison":"all_registered_sha_subtypes_qualify","weapon_leave_persistence":"local_duration_interpretation"},"turn_state":{"owner_field":"zhuque_peacock","expiry":"end_of_current_turn_including_aborted_turn","survives_weapon_leave":true,"not_consumed_by_next_sha":true,"transfer_does_not_reapply_source_bonus":true}}],
  ["huxin","护心镜","防具",null,"heart_mirror","heart_mirror_source_rules_with_jianghu_compat_v1","受到杀伤害前，你可以用护心镜累计抵挡至多2点伤害；容量耗尽时，弃置护心镜及你的一张手牌（无手牌则只弃镜）。",{"slot":"armor","attack_range":null,"effect":"heart_mirror","trigger":["final_sha_damage_receiver_before_hp_commit"],"conditions":["explicit_pack_enabled","equipped_effect_active","positive_damage_event","event_kind_sha","remaining_capacity_positive","not_chain_transfer"],"activation":"optional","cost":{"count":"one_hand_card_only_when_capacity_exhausted_and_hand_nonempty","zones":["hand","armor"],"excluded":["other_equipment","judgment"],"payment":"exhaustion_mirror_and_one_hand_card_atomic_discard_before_loss_callbacks"},"selection":{"chooser":"owner","zones":["optional_activation","own_hand_on_exhaustion"],"minimum":0,"maximum":1,"visibility":"activation_public_hand_selection_private","partial_capacity_choice":false},"targets":{"scope":"final_damage_receiver","minimum":1,"maximum":1,"legal_target_check":"same_pending_damage_event"},"limits":{"per_turn":null,"per_event":1,"per_equipped_episode_capacity":2},"distance":{"modifier":0,"direction":"none","minimum":1,"check":"normal"},"damage":{"amount_modifier":"minus_min(positive_final_amount,remaining_capacity)","replaces_all":false,"nature":"unchanged","event":"optional_prevention_of_sha_damage_only"},"armor":{"scope":"direct_or_manwu_transferred_sha_damage","nullifiable":true,"ignore_does_not_consume":true},"virtual_card":{"type":null,"color_rule":null,"suit_rule":null},"follow_up":{"creates_new_attack":false,"reuses_damage_context":false,"rechecks_dodge":false,"uses_play_quota":false},"compatibility":{"sha_family":["杀","血杀","毒杀","火杀","雷杀"],"finite_optional_deck":true,"source_mode_complete":false,"source_deck_copies_not_claimed":true,"equipment_counterspell":false,"manwu":"mandatory_armor_preview_then_transfer_then_optional_mirror_commit","sgs_elemental_chain":"kind_chain_not_sha_no_mirror_prevention","yxs_lianheng":"future_distinct_sha_derived_event_do_not_alias_to_sgs_chain","blood_poison":"all_registered_sha_subtypes_qualify_when_event_kind_sha","all_hp_loss":"no_prevention","an_sha":"not_in_this_engine_source_interaction_not_claimed","ordinary_leave":"no_extra_hand_discard"},"state":{"owner_field":"equipment_state.armor","initial_remaining":2,"minimum":0,"maximum":2,"episode_token":true,"reset_on_actual_enter":true,"clear_on_any_leave_even_disabled_or_dead":true,"not_card_mutation":true,"preview_must_not_mutate":true}}],
];
export const MODE_EQUIPMENT_CATALOG = freeze(rows.map(([key,name,type,range,trait,mechanism_key,description,mechanism_signature]) => ({
  id:`yxs.zhuque.equipment.${key}`,catalog_id:`yxs_zhuque_${name}`,canonical_id:`yxs.zhuque.equipment.${key}`,
  name,ui_name:name,base_name:name,source_original_name:name,type,slot:type==='武器'?'weapon':'armor',range,power:0,trait,description,
  aliases:[],alias_ids:[`yxs_zhuque_${name}`],mechanism_key,mechanism_signature,mechanism_signature_key:JSON.stringify(mechanism_signature),
  source_game:'英雄杀',source_games:['英雄杀'],source_variant:'jianghu-optional:yxs-zhuque:2026-10-15',
  source_version:'腾讯历史朱雀规则 + 英雄杀手游2026-10-16回归公告；江湖兼容实现另列',
  source_urls:[equipmentSource,mobileSource,...(key==='yinxue'?[basicSource]:[])],source_status:'verified-mode-core',implementation_status:'implemented_optional',
  ordinary_deck:false,source_only:false,content_pack:ZHUQUE_EQUIPMENT_PACK_ID,default_enabled:false,compatibility_deck:true,compatibility_deck_copies:1,
  acquisition:'新对局显式启用朱雀装备兼容包，每件1张实体并入江湖兼容牌堆；正常摸牌或合法获得后依法装备。',
  lifecycle:{kind:'finite_mode_deck_card',hero_generated:false,external_reserve_required:false,normal_discard_reshuffle:true,transform_original:false},
  completeness:{source_core_closed:true,live_mobile_all_interactions_verified:false,full_zhuque_mode:false,scheduled_return_started_as_of_2026_10_15:false},
  adaptation_notes:'可选江湖兼容牌包，不是5人身份或158张朱雀原牌库复刻；花色点数沿江湖固定种子配牌。死亡清理不给已阵亡者回复或摸牌。'+(key==='kongque'?' 本地裁定：孔雀翎与酒伤害加成取较大值，换下武器后本回合效果仍持续；可重复发动但不叠加。':key==='huxin'?' 本地裁定：先结算曼舞转移，再由最终承伤者选择抵挡；每次真实重新装备重置2点，读档不重置。':''),
})));
export const MODE_EQUIPMENT_BY_ID = freeze(Object.fromEntries(MODE_EQUIPMENT_CATALOG.flatMap(record => [record.id,...record.alias_ids].map(id=>[id,record]))));
export const MODE_EQUIPMENT_PACKS = freeze([{id:ZHUQUE_EQUIPMENT_PACK_ID,name:'朱雀装备兼容包（5件）',default_enabled:false,equipment_ids:MODE_EQUIPMENT_CATALOG.map(card=>card.id),physical_card_count:5,revision:2}]);
export function mode_equipment_definition(cardOrIdOrName) {
  if (!cardOrIdOrName) return null;
  const card = typeof cardOrIdOrName==='string' ? {id:cardOrIdOrName,name:cardOrIdOrName} : cardOrIdOrName;
  const id = card.equipment_id ?? card.id;
  if (id && MODE_EQUIPMENT_BY_ID[id]) return MODE_EQUIPMENT_BY_ID[id];
  if (id && typeof cardOrIdOrName!=='string') return null;
  return MODE_EQUIPMENT_CATALOG.find(record=>record.name===card.name&&(!card.type||record.type===card.type))??null;
}
export function enabled_mode_equipment(content_packs = []) {
  return MODE_EQUIPMENT_CATALOG.filter(card => Array.isArray(content_packs) && content_packs.includes(card.content_pack));
}
export function mode_equipment_enabled(card, content_packs = []) {
  const definition = mode_equipment_definition(card);
  return !definition || Array.isArray(content_packs) && content_packs.includes(definition.content_pack);
}
