/** Mobile-specific, source-versioned optional equipment. No default-deck registration.
 * Source rule signatures are preserved separately from explicit Jianghu choices.
 * Physical suit/rank/gift marks are dated mobile-Wiki evidence, not primary rules.
 */
const freeze = value => { if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); } return value; };
export const YOUJIAN_EQUIPMENT_PACK_ID = 'sgs_youjian_equipment_compat_1';
const rows = [
  {
    "id": "sgs.youjian.equipment.zheji.20200921",
    "equipment_id": "sgs.youjian.equipment.zheji.20200921",
    "canonical_id": "sgs.youjian.equipment.zheji.20200921",
    "catalog_id": "sgs_zheji",
    "name": "折戟",
    "ui_name": "折戟〔移动·用间〕",
    "base_name": "折戟",
    "source_original_name": "折戟",
    "type": "武器",
    "source_type": "武器",
    "slot": "weapon",
    "range": 0,
    "power": 0,
    "trait": "broken_halberd",
    "gift_mark": true,
    "suit": "梅花",
    "rank": 1,
    "color": "黑",
    "aliases": [
      "折戟"
    ],
    "alias_ids": [
      "sgs_zheji"
    ],
    "mechanism_key": "sgs_mobile_youjian_zheji",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_zheji_card"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/折戟/装备牌"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_zheji_card",
        "title": "三国杀移动版BWIKI：折戟/装备牌",
        "url": "https://wiki.biligame.com/msgs/折戟/装备牌",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "35377",
        "page_modified_at": "2025-12-28T14:46:54Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "6e6afec67555f5facf68ece212e222d4e8b8e15dd3316f814e245b298cb450bd"
      }
    ],
    "physical_reference": {
      "suit": "club",
      "rank": 1,
      "gift_mark": true,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_zheji_card",
      "source_deck_copies": null
    },
    "description": "攻击范围0，无其他装备技能。",
    "source_rules": {
      "activation": "continuous",
      "trigger": "attack_range_query",
      "cost": null,
      "condition": "当前有效武器",
      "effect": "武器攻击范围为0，没有其他装备技能",
      "limits": {
        "per_turn": null,
        "per_event": null
      },
      "steps": [
        "保留数值0，不可用range || 1回退为1。",
        "距离规则最小为1仍成立，因此没有无距离/额外范围技能时无法主动指定任何其他角色出杀。",
        "不限制决斗/南蛮等要求打出杀的响应；回应不按武器距离判定。",
        "明确忽略距离的出杀许可仍可越过正常范围检查。"
      ],
      "leaving": "离装备区后正常计算新武器范围；无武器时基础范围1。"
    },
    "source_mechanism_signature": {
      "slot": "weapon",
      "range": 0,
      "gift_mark": true,
      "timing": "continuous",
      "activation": "none",
      "cost": null,
      "conditions": [
        "equipped_effect_active"
      ],
      "effect": [
        "attack_range_set_0"
      ],
      "targets": "own_attack_range",
      "limit": null,
      "on_leave": null,
      "response_override": null
    },
    "source_mechanism_signature_sha256": "240b160799820e01786b0d713dda960a15b2d7ad7d23b4cf70ad4d8c3333aa1e",
    "mechanism_signature": {
      "slot": "weapon",
      "range": 0,
      "gift_mark": true,
      "timing": "continuous",
      "activation": "none",
      "cost": null,
      "conditions": [
        "equipped_effect_active"
      ],
      "effect": [
        "attack_range_set_0"
      ],
      "targets": "own_attack_range",
      "limit": null,
      "on_leave": null,
      "response_override": null,
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "范围0为真实数值；不影响不检查距离的响应杀。"
      }
    },
    "adaptation_notes": "范围0为真实数值；不影响不检查距离的响应杀。",
    "uncertainty_ids": [],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "仅有赠标的物理牌可从手牌在自己的出牌阶段赠给其他角色，直接入其同类槽并替换旧装备",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "无视防具不使武器/马失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.qixing.20200921",
    "equipment_id": "sgs.youjian.equipment.qixing.20200921",
    "canonical_id": "sgs.youjian.equipment.qixing.20200921",
    "catalog_id": "sgs_qixing",
    "name": "七星宝刀",
    "ui_name": "七星宝刀〔移动·用间〕",
    "base_name": "七星宝刀",
    "source_original_name": "七星宝刀",
    "type": "武器",
    "source_type": "武器",
    "slot": "weapon",
    "range": 2,
    "power": 0,
    "trait": "seven_star_blade",
    "gift_mark": true,
    "suit": "黑桃",
    "rank": 2,
    "color": "黑",
    "aliases": [
      "七星宝刀"
    ],
    "alias_ids": [
      "sgs_qixing"
    ],
    "mechanism_key": "sgs_mobile_youjian_qixing",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_qixing"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/七星宝刀"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_qixing",
        "title": "三国杀移动版BWIKI：七星宝刀",
        "url": "https://wiki.biligame.com/msgs/七星宝刀",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "26092",
        "page_modified_at": "2024-02-15T13:27:52Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "8eb393f9046d054e8931e78eeef20da7f258f872e94420e6fa8c4f7cdec234ac"
      }
    ],
    "physical_reference": {
      "suit": "spade",
      "rank": 2,
      "gift_mark": true,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_qixing",
      "source_deck_copies": null
    },
    "description": "攻击范围2。进入装备区后，弃置你的其他所有装备牌和判定区牌。",
    "source_rules": {
      "activation": "locked",
      "trigger": "after_actual_equipment_zone_entry",
      "cost": null,
      "condition": "该实体实际进入持有者装备区",
      "effect": "持有者弃掉判定区及装备区中除这件七星宝刀以外的所有牌",
      "limits": {
        "per_turn": null,
        "per_entry": 1
      },
      "steps": [
        "先依普通规则替换同槽旧武器，再完成该刀真实进入装备区。",
        "在进入后收集该持有者当前判定区及其他装备，排除进入的这张物理刀。",
        "把这批牌正常弃置，触发每个实际失去装备的离场效果；不只是清空数组。",
        "判定区的延时身份一并清除；手牌完全不在此效果范围内。",
        "成功赠予直接入装备区也触发；只获得到手牌不触发；战象挡住赠予时不进入也不清场。",
        "无其他区域牌也可以正常装备，范围2仍有效。"
      ],
      "leaving": "本刀离场无特殊技能；再次真正进入装备区时可再次触发。"
    },
    "source_mechanism_signature": {
      "slot": "weapon",
      "range": 2,
      "gift_mark": true,
      "timing": "equipment_enter_after",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "actual_enter",
        "equipped_effect_active"
      ],
      "effect": [
        "discard_all_other_own_equipment",
        "discard_all_own_judgment"
      ],
      "targets": "new_owner",
      "limit": "once_per_entry",
      "on_leave": null,
      "response_override": null
    },
    "source_mechanism_signature_sha256": "f79a7016e929948e6a4e913c6486ede0102c7cfa8537a3240c191ff9f2a2e5eb",
    "mechanism_signature": {
      "slot": "weapon",
      "range": 2,
      "gift_mark": true,
      "timing": "equipment_enter_after",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "actual_enter",
        "equipped_effect_active"
      ],
      "effect": [
        "discard_all_other_own_equipment",
        "discard_all_own_judgment"
      ],
      "targets": "new_owner",
      "limit": "once_per_entry",
      "on_leave": null,
      "response_override": null,
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "以入场ID去重；原槽替换先完成，批量弃其他装备/判定牌并等待离场、失牌及救援。"
      }
    },
    "adaptation_notes": "以入场ID去重；原槽替换先完成，批量弃其他装备/判定牌并等待离场、失牌及救援。",
    "uncertainty_ids": [],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "仅有赠标的物理牌可从手牌在自己的出牌阶段赠给其他角色，直接入其同类槽并替换旧装备",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "无视防具不使武器/马失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.yitian.20200921",
    "equipment_id": "sgs.youjian.equipment.yitian.20200921",
    "canonical_id": "sgs.youjian.equipment.yitian.20200921",
    "catalog_id": "sgs_yitian",
    "name": "倚天剑",
    "ui_name": "倚天剑〔移动·用间〕",
    "base_name": "倚天剑",
    "source_original_name": "倚天剑",
    "type": "武器",
    "source_type": "武器",
    "slot": "weapon",
    "range": 2,
    "power": 0,
    "trait": "heaven_sword",
    "gift_mark": false,
    "suit": "梅花",
    "rank": 5,
    "color": "黑",
    "aliases": [
      "倚天剑"
    ],
    "alias_ids": [
      "sgs_yitian"
    ],
    "mechanism_key": "sgs_mobile_youjian_yitian",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_yitian"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/倚天剑"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_yitian",
        "title": "三国杀移动版BWIKI：倚天剑",
        "url": "https://wiki.biligame.com/msgs/倚天剑",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "38751",
        "page_modified_at": "2026-06-06T23:37:02Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "a5030d8274e0a4263e2e4bb753b64e912c00645910c2e02d55b694e5a4ef4453"
      }
    ],
    "physical_reference": {
      "suit": "club",
      "rank": 5,
      "gift_mark": false,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_yitian",
      "source_deck_copies": null
    },
    "description": "攻击范围2。你的杀实际造成伤害后，可弃1张手牌，再回复1点体力。",
    "source_rules": {
      "activation": "optional",
      "trigger": "after_positive_damage_caused_by_owners_sha",
      "cost": {
        "count": 1,
        "zones": [
          "hand"
        ],
        "owner_choice": true,
        "must_be_discardable": true,
        "excludes": [
          "equipped_cards",
          "judgment_cards"
        ]
      },
      "condition": "装备有效；存在一张可弃手牌；实际杀伤害事件",
      "effect": "先支付一张手牌，再回复持有者1点体力",
      "limits": {
        "per_turn": null,
        "per_damage_event": 1,
        "per_damage_point": false,
        "recovery_cap": "max_hp"
      },
      "steps": [
        "杀被闪、无效或全部防止伤害时不发动。",
        "造成2点的一次伤害不改成弃2回2。",
        "允许玩家放弃；确认后让玩家选一张合法手牌，不能系统随便扣牌。",
        "正常提交公开弃牌并结算失牌/毒/救援，再继续回复，不能heal后才付费。",
        "官方没有写已受伤才可发动；满血时弃牌成本不凭空取消，治疗量按上限为0。",
        "不创造新的杀，不再开闪，不扣额外杀额度。"
      ],
      "leaving": "没有离场奖励或销毁；未发动前须核对装备仍有效；已经付款后是否因离场取消须遵照所定事件方案。"
    },
    "source_mechanism_signature": {
      "slot": "weapon",
      "range": 2,
      "gift_mark": false,
      "timing": "sha_actual_damage_after",
      "activation": "optional",
      "cost": {
        "count": 1,
        "zone": "hand",
        "action": "discard"
      },
      "conditions": [
        "positive_actual_sha_damage",
        "equipped_effect_active",
        "discardable_hand_card"
      ],
      "effect": [
        "recover_owner_1_after_cost"
      ],
      "targets": "owner",
      "limit": "once_per_damage_event_no_turn_limit",
      "on_leave": null,
      "response_override": null,
      "unresolved": [
        "chain_damage_eligibility",
        "post_damage_order",
        "poison_cost_continuation"
      ]
    },
    "source_mechanism_signature_sha256": "f7e10b658b40b9fc73b1f4330f59e285dbe26304997b8fcbfa2bea3ada3b0506",
    "mechanism_signature": {
      "slot": "weapon",
      "range": 2,
      "gift_mark": false,
      "timing": "sha_actual_damage_after",
      "activation": "optional",
      "cost": {
        "count": 1,
        "zone": "hand",
        "action": "discard"
      },
      "conditions": [
        "positive_actual_sha_damage",
        "equipped_effect_active",
        "discardable_hand_card"
      ],
      "effect": [
        "recover_owner_1_after_cost"
      ],
      "targets": "owner",
      "limit": "once_per_damage_event_no_turn_limit",
      "on_leave": null,
      "response_override": null,
      "unresolved": [
        "chain_damage_eligibility",
        "post_damage_order",
        "poison_cost_continuation"
      ],
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "江湖兼容：逐实际杀伤害事件（含保留杀来源的属性传导）触发；受伤者反应/救援后再付费；弃毒先结算流失和救援，最终存活才回复。已付款后武器离场不取消回复。"
      }
    },
    "adaptation_notes": "江湖兼容：逐实际杀伤害事件（含保留杀来源的属性传导）触发；受伤者反应/救援后再付费；弃毒先结算流失和救援，最终存活才回复。已付款后武器离场不取消回复。",
    "uncertainty_ids": [
      "U02",
      "U06"
    ],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "本来源物理牌没有赠标，不能自行通过赠予动作送出；授权技能普通交给不受此限",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "无视防具不使武器/马失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.yinfeng.20200921",
    "equipment_id": "sgs.youjian.equipment.yinfeng.20200921",
    "canonical_id": "sgs.youjian.equipment.yinfeng.20200921",
    "catalog_id": "sgs_yinfeng",
    "name": "引蜂衣",
    "ui_name": "引蜂衣〔移动·用间〕",
    "base_name": "引蜂衣",
    "source_original_name": "引蜂衣",
    "type": "防具",
    "source_type": "防具",
    "slot": "armor",
    "range": null,
    "power": 0,
    "trait": "bee_robe",
    "gift_mark": true,
    "suit": "梅花",
    "rank": 3,
    "color": "黑",
    "aliases": [
      "引蜂衣"
    ],
    "alias_ids": [
      "sgs_yinfeng"
    ],
    "mechanism_key": "sgs_mobile_youjian_yinfeng",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_yinfeng"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/引蜂衣"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_yinfeng",
        "title": "三国杀移动版BWIKI：引蜂衣",
        "url": "https://wiki.biligame.com/msgs/引蜂衣",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "26109",
        "page_modified_at": "2024-02-15T14:01:16Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "d22b210306daf4cda625ba09d11d755f36156439a16cfe1b3a0afaf11e887e11"
      }
    ],
    "physical_reference": {
      "suit": "club",
      "rank": 3,
      "gift_mark": true,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_yinfeng",
      "source_deck_copies": null
    },
    "description": "受到锦囊伤害+1；因基本牌毒失去体力时，流失值+1。",
    "source_rules": {
      "activation": "locked",
      "trigger": [
        "before_trick_card_damage_commit",
        "before_poison_basic_hp_loss_commit"
      ],
      "cost": null,
      "condition": "对应事件中防具有效",
      "effect": [
        "锦囊来源的伤害值加1",
        "因基本牌毒而流失体力的值加1"
      ],
      "limits": {
        "per_turn": null,
        "per_event": 1
      },
      "steps": [
        "保留两个独立事件通道：damage与lose_hp。",
        "普通杀/火杀/雷杀/刺杀不是锦囊，不能因此加伤；英雄杀毒杀也不自动视作毒基本牌。",
        "决斗、火攻、南蛮/烽火、万箭和延时锦囊伤害以原牌类型识别；不能只按kind某个字符串列三种。",
        "技能纯伤害不是锦囊伤害；纯体力流失若不因毒也不加。",
        "无懈抵消锦囊使伤害根本未发生时，不凭空制造1伤害。",
        "毒豁免的流失事件应被完全防止，不可把0+1变成仍掉血；离手以背面移动无毒事件。",
        "无视防具/防具失效只在对应作用范围生效；毒不是伤害，白银狮子、护心镜等不能减免它。"
      ],
      "leaving": "无特殊离场触发；离场后后续新事件不增量。"
    },
    "source_mechanism_signature": {
      "slot": "armor",
      "range": null,
      "gift_mark": true,
      "timing": [
        "trick_damage_before_commit",
        "poison_hp_loss_before_commit"
      ],
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_armor_active",
        "relevant_positive_event"
      ],
      "effect": [
        "trick_damage_plus1",
        "poison_hp_loss_plus1"
      ],
      "targets": "wearer_final_receiver",
      "limit": "once_per_event",
      "on_leave": null,
      "response_override": null,
      "unresolved": [
        "multi_poison_batch_size",
        "damage_transfer_source_card_provenance"
      ]
    },
    "source_mechanism_signature_sha256": "f017472c73337388f6e47f411359fd44a97c59e6b16b51e5dcdc586feccea382",
    "mechanism_signature": {
      "slot": "armor",
      "range": null,
      "gift_mark": true,
      "timing": [
        "trick_damage_before_commit",
        "poison_hp_loss_before_commit"
      ],
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_armor_active",
        "relevant_positive_event"
      ],
      "effect": [
        "trick_damage_plus1",
        "poison_hp_loss_plus1"
      ],
      "targets": "wearer_final_receiver",
      "limit": "once_per_event",
      "on_leave": null,
      "response_override": null,
      "unresolved": [
        "multi_poison_batch_size",
        "damage_transfer_source_card_provenance"
      ],
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "江湖兼容：每张实体毒各一个流失事件；同批移动前快照有效引蜂衣，每张均+1，因此两毒共4点。不是已核定移动版微观裁定。"
      }
    },
    "adaptation_notes": "江湖兼容：每张实体毒各一个流失事件；同批移动前快照有效引蜂衣，每张均+1，因此两毒共4点。不是已核定移动版微观裁定。",
    "uncertainty_ids": [
      "U03",
      "U06"
    ],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "仅有赠标的物理牌可从手牌在自己的出牌阶段赠给其他角色，直接入其同类槽并替换旧装备",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "仅防具技能在适用的无视防具窗口失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.nvzhuang.20200921",
    "equipment_id": "sgs.youjian.equipment.nvzhuang.20200921",
    "canonical_id": "sgs.youjian.equipment.nvzhuang.20200921",
    "catalog_id": "sgs_nvzhuang",
    "name": "女装",
    "ui_name": "女装〔移动·用间〕",
    "base_name": "女装",
    "source_original_name": "女装",
    "type": "防具",
    "source_type": "防具",
    "slot": "armor",
    "range": null,
    "power": 0,
    "trait": "mobile_female_dress",
    "gift_mark": true,
    "suit": "红桃",
    "rank": 9,
    "color": "红",
    "aliases": [
      "女装"
    ],
    "alias_ids": [
      "sgs_nvzhuang"
    ],
    "mechanism_key": "sgs_mobile_youjian_nvzhuang",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_nvzhuang"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/女装"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_nvzhuang",
        "title": "三国杀移动版BWIKI：女装",
        "url": "https://wiki.biligame.com/msgs/女装",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "38823",
        "page_modified_at": "2026-06-07T03:24:32Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "e09a265eecd279ffcf684b9ee1b028a21c1535db5a61db10d23cd79b01968c28"
      }
    ],
    "physical_reference": {
      "suit": "heart",
      "rank": 9,
      "gift_mark": true,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_nvzhuang",
      "source_deck_copies": null
    },
    "description": "男性成为杀的目标后判定；最终黑色则该杀对该目标分支伤害+1，仍可闪。",
    "source_rules": {
      "activation": "locked",
      "trigger": "after_becoming_sha_target_before_dodge",
      "cost": null,
      "condition": "游戏规则性别为男且防具有效",
      "effect": "进行一次判定；最终判定为黑色时给本次杀的相关伤害加1",
      "limits": {
        "per_turn": null,
        "per_target_confirmation": 1
      },
      "steps": [
        "在成为杀目标后判定，不是受到伤害后才判。",
        "判定走统一改判/取判定牌流程，取最终有效颜色，不抛独立随机硬币。",
        "红判不加伤；女角色不判；双性/无性依该游戏规则元数据明确定义，不能猜现实性别。",
        "判黑仍可正常出闪；闪成功没有杀伤害。",
        "不增加出杀次数，不改持有者性别，没有出牌阶段损血或离场弃牌效果。",
        "用独立card_use_id和target_id保存一次结算标记，避免下一张杀继承；精确标记作用范围待U01。"
      ],
      "leaving": "移动版来源没有离场弃牌效果；不得拷入其他产品女装的进/离场弃牌版。"
    },
    "source_mechanism_signature": {
      "slot": "armor",
      "range": null,
      "gift_mark": true,
      "timing": "sha_target_confirmed",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_armor_active",
        "rules_gender_male"
      ],
      "effect": [
        "judge_once",
        "black_judgment_sha_damage_plus1"
      ],
      "targets": "wearer_target_with_source_scope_pending",
      "limit": "once_per_target_confirmation",
      "on_leave": null,
      "response_override": "dodge_still_allowed",
      "unresolved": [
        "target_damage_scope",
        "bonus_persistence_on_leave",
        "damage_transfer"
      ]
    },
    "source_mechanism_signature_sha256": "7c0e12671dddeac4dc4c951e10ad766bde622931979bb2c3be5717da37a6ac93",
    "mechanism_signature": {
      "slot": "armor",
      "range": null,
      "gift_mark": true,
      "timing": "sha_target_confirmed",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_armor_active",
        "rules_gender_male"
      ],
      "effect": [
        "judge_once",
        "black_judgment_sha_damage_plus1"
      ],
      "targets": "wearer_target_with_source_scope_pending",
      "limit": "once_per_target_confirmation",
      "on_leave": null,
      "response_override": "dodge_still_allowed",
      "unresolved": [
        "target_damage_scope",
        "bonus_persistence_on_leave",
        "damage_transfer"
      ],
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "江湖兼容：最终黑判加成保存于该杀该目标分支；即使之后女装离场仍生效，转移伤害保留且不重复增加。绝不修改实体牌或全局杀。"
      }
    },
    "adaptation_notes": "江湖兼容：最终黑判加成保存于该杀该目标分支；即使之后女装离场仍生效，转移伤害保留且不重复增加。绝不修改实体牌或全局杀。",
    "uncertainty_ids": [
      "U01",
      "U06"
    ],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "仅有赠标的物理牌可从手牌在自己的出牌阶段赠给其他角色，直接入其同类槽并替换旧装备",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "仅防具技能在适用的无视防具窗口失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.numa.20200921",
    "equipment_id": "sgs.youjian.equipment.numa.20200921",
    "canonical_id": "sgs.youjian.equipment.numa.20200921",
    "catalog_id": "sgs_numa",
    "name": "驽马",
    "ui_name": "驽马〔移动·用间〕",
    "base_name": "驽马",
    "source_original_name": "驽马",
    "type": "-1马",
    "source_type": "进攻马",
    "slot": "offensive_horse",
    "range": null,
    "power": 1,
    "trait": "inferior_horse",
    "gift_mark": true,
    "suit": "梅花",
    "rank": 13,
    "color": "黑",
    "aliases": [
      "驽马"
    ],
    "alias_ids": [
      "sgs_numa"
    ],
    "mechanism_key": "sgs_mobile_youjian_numa",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_numa"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/驽马"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_numa",
        "title": "三国杀移动版BWIKI：驽马",
        "url": "https://wiki.biligame.com/msgs/驽马",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "26110",
        "page_modified_at": "2024-02-15T14:03:13Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "939a64def37bad4279634a5f2d8229ad88f4bcad0f22f5e2717373fcedccc347"
      }
    ],
    "physical_reference": {
      "suit": "club",
      "rank": 13,
      "gift_mark": true,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_numa",
      "source_deck_copies": null
    },
    "description": "你到其他角色距离−1；其他角色到你的距离固定为1。",
    "source_rules": {
      "activation": "locked_continuous",
      "trigger": "distance_query",
      "cost": null,
      "condition": "装备有效",
      "effect": [
        "自己到其他角色按进攻马减1，最低1",
        "其他角色到自己固定为1"
      ],
      "limits": {
        "per_turn": null,
        "per_event": null
      },
      "steps": [
        "保留进攻马槽，不能实现成其他产品占多槽/入场弃所有装备的驽马。",
        "传入目标为持马者时，输出1，不是再叠其防御马/技能加距离。",
        "持马者出牌到别人仍按自己的进攻马修正，反方向不对称。",
        "距离1影响顺手/兵粮/推心置腹等距离许可，不只影响杀。",
        "固定距离1不等于能出杀；攻击者拿折戟范围0依然不能正常杀到它。"
      ],
      "leaving": "离场立即失去减距离与被计算固定1两项。"
    },
    "source_mechanism_signature": {
      "slot": "offensive_horse",
      "range": null,
      "gift_mark": true,
      "timing": "distance_query",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_effect_active"
      ],
      "effect": [
        "outgoing_distance_minus1_floor1",
        "incoming_distance_fixed1"
      ],
      "targets": "directional_character_pair",
      "limit": null,
      "on_leave": null,
      "response_override": null
    },
    "source_mechanism_signature_sha256": "471905a900d16cacb37658076e2ef53e466cd44e3196de0f64f1df95d2689d5b",
    "mechanism_signature": {
      "slot": "offensive_horse",
      "range": null,
      "gift_mark": true,
      "timing": "distance_query",
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_effect_active"
      ],
      "effect": [
        "outgoing_distance_minus1_floor1",
        "incoming_distance_fixed1"
      ],
      "targets": "directional_character_pair",
      "limit": null,
      "on_leave": null,
      "response_override": null,
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "驽马传入固定1优先于普通马及技能距离加减；不清空装备、不占多个槽。"
      }
    },
    "adaptation_notes": "驽马传入固定1优先于普通马及技能距离加减；不清空装备、不占多个槽。",
    "uncertainty_ids": [],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "仅有赠标的物理牌可从手牌在自己的出牌阶段赠给其他角色，直接入其同类槽并替换旧装备",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "无视防具不使武器/马失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  },
  {
    "id": "sgs.youjian.equipment.zhanxiang.20200921",
    "equipment_id": "sgs.youjian.equipment.zhanxiang.20200921",
    "canonical_id": "sgs.youjian.equipment.zhanxiang.20200921",
    "catalog_id": "sgs_zhanxiang",
    "name": "战象",
    "ui_name": "战象〔移动·用间〕",
    "base_name": "战象",
    "source_original_name": "战象",
    "type": "+1马",
    "source_type": "防御马",
    "slot": "defensive_horse",
    "range": null,
    "power": 1,
    "trait": "war_elephant",
    "gift_mark": false,
    "suit": "红桃",
    "rank": 13,
    "color": "红",
    "aliases": [
      "战象"
    ],
    "alias_ids": [
      "sgs_zhanxiang"
    ],
    "mechanism_key": "sgs_mobile_youjian_zhanxiang",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版用间篇2020-09-21官方规则；2024–2026移动专属Wiki元数据交叉",
    "source_variant": "jianghu-optional:sgs-mobile-youjian:20200921:compat1",
    "source_status": "verified-mobile-core-local-boundaries-explicit",
    "source_ids": [
      "sgs_mobile_official_youjian_20200921",
      "mobile_wiki_zhanxiang"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/战象"
    ],
    "source_evidence": [
      {
        "id": "sgs_mobile_official_youjian_20200921",
        "title": "三国杀移动版：用间篇规则说明",
        "url": "https://www.sanguosha.cn/pc/news-detail-882.html",
        "source_tier": "primary_mobile_official",
        "published_at": "2020-09-21T09:52:53+08:00",
        "retrieved_at": "2026-10-15",
        "sha256": "3968b795b4585d5b70a759e0d4b524305bfa637943fd878bf7f25f4a8367ea31"
      },
      {
        "id": "mobile_wiki_zhanxiang",
        "title": "三国杀移动版BWIKI：战象",
        "url": "https://wiki.biligame.com/msgs/战象",
        "source_tier": "secondary_mobile_specific",
        "page_revision": "26091",
        "page_modified_at": "2024-02-15T13:24:15Z",
        "retrieved_at": "2026-10-15",
        "caveat": "社区维护；页头可能仍写2024-02-15，但实际修订时间以页面元数据/页脚为准。不是官方2026目录。",
        "sha256": "a27edde75665d3ce2b4d76d58bfc0072fe8208ca8359d082ff2a8c0a486ddbfb"
      }
    ],
    "physical_reference": {
      "suit": "heart",
      "rank": 13,
      "gift_mark": false,
      "source_tier": "secondary_mobile_specific",
      "source_id": "mobile_wiki_zhanxiang",
      "source_deck_copies": null
    },
    "description": "其他角色到你距离+1；其他角色对你的赠予失败，赠物弃置。",
    "source_rules": {
      "activation": "locked_continuous",
      "trigger": [
        "distance_query",
        "gift_resolution_before_destination_replacement"
      ],
      "cost": null,
      "condition": "装备有效",
      "effect": [
        "其他角色到自己距离加1",
        "他人对自己的赠予失败，赠物转入弃牌堆"
      ],
      "limits": {
        "per_turn": null,
        "per_gift": 1
      },
      "steps": [
        "对装备牌和非装备牌的赠予都生效；目标不能选择接受绕过锁定。",
        "先判失败，再决定是否替换同槽，不能为换掉战象先卸掉它后说赠予成功。",
        "失败牌不是退回发起者，也不进入自己手牌。",
        "普通交给、从牌堆获得时毒的特殊交给、顺手取得都不属于赠予，不被战象拦截。",
        "无懈没有窗口；马不受青釭/鱼肠无视防具影响。",
        "若目标还装备驽马，驽马固定传入距离1覆盖单纯+1距离增量。"
      ],
      "leaving": "离场后新赠予可成功；本身没有离场触发，不被当作一次性消耗防御。"
    },
    "source_mechanism_signature": {
      "slot": "defensive_horse",
      "range": null,
      "gift_mark": false,
      "timing": [
        "distance_query",
        "gift_resolution"
      ],
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_effect_active",
        "gift_recipient_is_owner"
      ],
      "effect": [
        "incoming_distance_plus1",
        "gift_fail_to_discard"
      ],
      "targets": "owner",
      "limit": "every_gift_no_turn_limit",
      "on_leave": null,
      "response_override": "gift_cannot_be_accepted",
      "non_gift_transfer_unchanged": true
    },
    "source_mechanism_signature_sha256": "c17aa537e8f2efa509783e95cd8c07626c5d7f50670fe327c8083865ee72dff6",
    "mechanism_signature": {
      "slot": "defensive_horse",
      "range": null,
      "gift_mark": false,
      "timing": [
        "distance_query",
        "gift_resolution"
      ],
      "activation": "locked",
      "cost": null,
      "conditions": [
        "equipped_effect_active",
        "gift_recipient_is_owner"
      ],
      "effect": [
        "incoming_distance_plus1",
        "gift_fail_to_discard"
      ],
      "targets": "owner",
      "limit": "every_gift_no_turn_limit",
      "on_leave": null,
      "response_override": "gift_cannot_be_accepted",
      "non_gift_transfer_unchanged": true,
      "compatibility": {
        "ruleset": "jianghu-youjian-equipment-v1",
        "optional_pack": true,
        "full_source_mode": false,
        "local_rule": "只阻止赠予，普通交给及牌堆毒拦截照常；成功前先检查战象，不先替换它。"
      }
    },
    "adaptation_notes": "只阻止赠予，普通交给及牌堆毒拦截照常；成功前先检查战象，不先替换它。",
    "uncertainty_ids": [],
    "content_pack": "sgs_youjian_equipment_compat_1",
    "default_enabled": false,
    "ordinary_deck": false,
    "normal_random_deck_eligible": false,
    "compatibility_deck_copies": 1,
    "source_deck_copies": null,
    "acquisition": {
      "kind": "optional_finite_mode_pack",
      "default_deck_eligible": false,
      "hero_required": false,
      "hero_generated": false,
      "external_reserve": false,
      "normal_draw_or_gain": true,
      "normal_use": "手牌中正常使用并装入自己的相应槽",
      "gift": "本来源物理牌没有赠标，不能自行通过赠予动作送出；授权技能普通交给不受此限",
      "compatibility_copy_count": 1,
      "compatibility_copy_count_is_official": false
    },
    "lifecycle": {
      "on_leave_special_effect": null,
      "destroy_on_leave": false,
      "normal_discard_reshuffle": true,
      "hand_to_equipment_consumes_same_physical_card": true,
      "gift_to_equipment_uses_same_physical_card": true,
      "normal_steal_moves_to_hand": true,
      "may_be_used_by_any_legal_holder": true
    },
    "response": {
      "counterspell": false,
      "counterspell_reason": "装备使用、装备技能、赠予都不是锦囊效果；无懈窗口不打开",
      "dodge": "此装备本身不要求闪；相关杀照常开闪窗口",
      "armor_ignored": "无视防具不使武器/马失效",
      "general_equipment_disable": "按当前事件装备有效性；锁定不等于不受装备失效影响"
    },
    "implementation_status": "implemented_optional",
    "completeness": {
      "source_core_closed": true,
      "real_game_integration_verified": true,
      "live_mobile_all_interactions_verified": false,
      "full_youjian_mode": false,
      "entire_two_games_union": false
    }
  }
];
export const YOUJIAN_EQUIPMENT_CATALOG = freeze(rows.map(row => ({...row,adaptation_notes:row.adaptation_notes+' 可选兼容配方每件1张；实体花色点数沿江湖种子配牌，physical_reference仅保存来源卡面证据。',mechanism_signature_key:JSON.stringify(row.mechanism_signature)})));
export const YOUJIAN_EQUIPMENT_BY_ID = freeze(Object.fromEntries(YOUJIAN_EQUIPMENT_CATALOG.flatMap(row => [row.id,...row.alias_ids].map(id => [id,row]))));
export const YOUJIAN_EQUIPMENT_PACK = freeze({id:YOUJIAN_EQUIPMENT_PACK_ID,name:'移动用间装备兼容包（7件）',revision:1,default_enabled:false,equipment_ids:rows.map(row=>row.id),physical_equipment_count:7,required_features:['gift','poison_basic','public_card_loss','async_card_events'],registered_in_default_deck:false,source_mode_complete:false});
export function youjian_equipment_definition(cardOrId) {
  if (!cardOrId) return null;
  if (typeof cardOrId === 'string') return YOUJIAN_EQUIPMENT_BY_ID[cardOrId] ?? YOUJIAN_EQUIPMENT_CATALOG.find(row=>row.name===cardOrId) ?? null;
  // A name/trait alone cannot silently import a different product's same-name card.
  return YOUJIAN_EQUIPMENT_BY_ID[cardOrId.equipment_id ?? cardOrId.id] ?? null;
}
export function enabled_youjian_equipment(content_packs = []) {
  return Array.isArray(content_packs) && content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID) ? YOUJIAN_EQUIPMENT_CATALOG : [];
}
export function youjian_equipment_enabled(card, content_packs = []) {
  return !!youjian_equipment_definition(card) && enabled_youjian_equipment(content_packs).length > 0;
}
export function youjian_equipment_gift_mark(card) {
  return !card?.virtual && youjian_equipment_definition(card)?.gift_mark === true && card.gift_mark === true;
}
