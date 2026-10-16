/** Explicit opt-in historical mobile Guozhan compatibility equipment.
 * Not a full Guozhan mode or an ordinary default-deck addition. */
export const SANJIAN_PACK_ID='sgs_guozhan_sanjian_compat_1';
const signature={slot:'weapon',range:3,activation:'optional',trigger:'source_after_positive_direct_sha_damage_after_rescue_before_receiver_hooks',cost:{count:1,zones:['hand'],operation:'discard'},targets:{origin:'actual_surviving_direct_sha_receiver',exclude_origin:true,allow_self:true,allow_ally:true,directed_distance:1},damage:{amount:1,nature:'normal',method:'equipment_skill',new_event:true,sha_materials:false},limit:'once_per_damage_event_not_per_point',excludes:['chain_transfer','damage_transfer','non_sha','dead_origin','zero_damage']};
export const SANJIAN_EQUIPMENT_CATALOG=Object.freeze([Object.freeze({
 id:'sgs.guozhan.equipment.sanjian',canonical_id:'sgs.guozhan.equipment.sanjian',catalog_id:'sgs_sanjian',name:'三尖两刃刀',ui_name:'三尖两刃刀',base_name:'三尖两刃刀',source_original_name:'三尖两刃刀',type:'武器',slot:'weapon',range:3,power:0,trait:'sanjian',fixed_suit:'方块',fixed_rank:12,
 description:'你使用杀对其当前目标造成实际伤害后，若其经濒死结算仍存活，可弃1张手牌，对与该受伤角色距离1的另一名角色造成1点普通伤害。可选择自己或队友，每次伤害事件一次；传导和伤害转移不触发。',
 aliases:[],alias_ids:['sgs_sanjian','sgs.special.equipment.sanjian'],mechanism_key:'source_sha_splash_hand_cost',mechanism_signature:signature,mechanism_signature_key:JSON.stringify(signature),
 source_game:'三国杀',source_games:['三国杀'],source_variant:'mobile-historical-guozhan-core+explicit-jianghu-pack-2026-10-15',source_version:'移动版历史国战收录；官网国战装备规则；精细伤害时序参考历史通用规则',source_urls:['https://www.sanguosha.cn/index.php/pc/guide-info-91.html','https://www.sanguosha.cn/pc/guide-info-111.html','https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/119.html','https://gltjk.com/sanguosha/rules/flow/damage.html'],source_status:'verified-historical-mobile-membership-shared-core',implementation_status:'implemented_optional',ordinary_deck:false,source_only:false,content_pack:SANJIAN_PACK_ID,default_enabled:false,compatibility_deck:true,compatibility_deck_copies:1,
 acquisition:'新对局显式启用三尖装备兼容包，加入1张方块Q；不是由英雄生成，也不宣称完整国战模式。',lifecycle:{kind:'finite_mode_deck_card',hero_generated:false,normal_discard_reshuffle:true},completeness:{source_core_closed:true,current_client_all_interactions_verified:false,full_guozhan_mode:false},
 adaptation_notes:'来源装备在移动历史国战有收录。本作仅提供显式1张兼容牌包，不默认加入普通牌堆；杀包含本作血/毒/火/雷杀。来源后伤害窗口在救援完成后、承伤者受伤技能前；原自定义受伤技能保留伤害后初始HP大于0的资格。与毒、变身和跨作技能的事务边界为本作适配。'
})]);

export function sanjian_equipment_definition(value){const key=typeof value==='string'?value:value?.equipment_id??value?.id??value?.name;return SANJIAN_EQUIPMENT_CATALOG.find(r=>r.id===key||r.name===key||r.alias_ids.includes(key))??null;}
