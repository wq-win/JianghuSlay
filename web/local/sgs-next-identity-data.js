/** Complete selected mobile base-identity packets; independently tested integration, current-client parity unverified. */
const definitions = [
  {
    "product": "sanguosha_mobile_cn",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "selected_mode": "身份",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_coverage": true,
    "implemented_by_this_research": false,
    "personal_lord_skills": [],
    "complete_skill_inventory_read": true,
    "source_only_exact_for_every_edge": false,
    "id": "sgs.adapted.base.hero.xiao-qiao",
    "slug": "xiao-qiao",
    "name": "小乔",
    "official_entry_id": 30,
    "max_hp": 3,
    "gender": "female",
    "faction": "吴",
    "hp_evidence": {
      "primary_mainland_explicit": false,
      "mobile_secondary": "bwiki-xiao-qiao",
      "official_other_product": "ol-roster",
      "ol_gid": 30,
      "ol_hp": 3,
      "rejected_initial_hp": 0,
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 30,
        "extend": "风林火山",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "current_mobile_client_verified": false
    },
    "gender_evidence": "bwiki-xiao-qiao",
    "source_ids": [
      "mobile-30",
      "bwiki-xiao-qiao",
      "ol-roster",
      "mobile-311",
      "ol-30",
      "licensed-faq-wu",
      "licensed-faq-shu",
      "rule-wu",
      "yxs-li-shishi"
    ],
    "status": "source_ready_with_tiered_edges_and_disclosed_host_policies",
    "skills": [
      {
        "id": "sgs.tianxiang",
        "name": "天香",
        "optional": true,
        "trigger": "At receiving-damage window before own HP deduction; never HP loss.",
        "cost": {
          "count": 1,
          "zone": "hand",
          "effective_suit": "heart",
          "discard": true,
          "no_equipment_or_judgment_material": true
        },
        "targets": "One other living role, any side/gender/faction/distance, including damage source; never self.",
        "frequency": "No per-turn/per-event cap. Each valid redirect costs a fresh hand card.",
        "effect": "Transfer the entire pending damage instance, retaining original source, nature, damage basis and physical-card provenance. Resolve recipient rescue and source/receiver damage triggers before transfer draw; surviving actual recipient draws its lost HP measured at that late moment. No base draw cap5 or fixed1 damage.",
        "timing_sources": [
          "mobile-30",
          "bwiki-xiao-qiao",
          "licensed-faq-wu",
          "licensed-faq-shu"
        ],
        "source_amount_contract": "One heart hand card redirects even multi-point damage. Transferred damage is not a new Slash target; no fresh Dodge window or target-designation triggers.",
        "excluded": [
          "Jie prevented-damage plus fixed1 damage / HP-loss choice",
          "changing source to XiaoQiao",
          "using equipped red material",
          "turning HP-loss into damage"
        ],
        "open_future_edge": "Future publisher prevention such as 大雾 needs version-specific closure. Current Jianghu integer-armor zero and cross-copy behavior use explicit policy JP2, not an asserted official same-game resolution."
      },
      {
        "id": "sgs.hongyan",
        "name": "红颜",
        "optional": false,
        "trigger": "Suit/color projection in owned hand action contexts and own final judgment.",
        "effect": "A printed spade hand card is treated as heart for use, response, discard and giving; own spade judgment resolves as heart. Red color follows effective heart. Rank and physical ID never change.",
        "scope": {
          "hand_actions": [
            "use",
            "respond",
            "discard",
            "give"
          ],
          "judged_player": "owner including replacement judgment donated by another",
          "equipped_cards": "No blanket equipment projection in this selected current mobile wording. A card of equipment type still in hand does qualify.",
          "other_players": "No persistent global mutation after ownership changes."
        },
        "excluded": [
          "Broad historical OL all-card Hongyan",
          "Jie choose a new suit for any heart judgment",
          "Free heart-card redraw"
        ],
        "sources": [
          "mobile-30",
          "bwiki-xiao-qiao"
        ]
      }
    ],
    "full_intrinsic_skillset_semantics_ready": true,
    "variants": {
      "mobile_jie": 311,
      "current_OL_same_numeric_id": 30,
      "base_hidden_guozhan_skills": [
        "红颜"
      ],
      "warning": "Hidden alternate-mode inventory is catalog evidence only, not proof that the live Guozhan client has only this skill."
    },
    "equivalence_focus": {
      "candidate": "yxs.adapted.base.hero.li-shi-shi",
      "decision": "distinct_complete_packets",
      "equal": [
        "HP3",
        "female",
        "heart-hand full-event redirect",
        "late lost-HP draw",
        "own judgment spade-to-heart"
      ],
      "counterexample": "An owned equipped printed-spade weapon, tested for a color-sensitive equipped-card cost, remains black under selected mobile Hongyan but is red under historical YXS Hongzhuang. Both complete packages are compared, not only Tianxiang/Manwu. Faction is preserved context, not the mechanical disproof.",
      "not_used_as_proof": "Existing host bugs or arbitrary differences in cross-copy policies are not source-intrinsic differences."
    },
    "compare_existing_templates_count": 77,
    "proposed_merge": null,
    "display_name": "小乔",
    "skill_name": "天香 / 红颜",
    "skill_desc": "天香：受伤前可弃1张有效红桃手牌，将整次伤害转给其他角色；救援及伤后技能结束后，实际受伤存活者按缺血摸牌。红颜：黑桃手牌及自己的黑桃判定按红桃处理；装备区不作整体改色。",
    "skill_ids": [
      "sgs.tianxiang",
      "sgs.hongyan"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "小乔",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-30.html",
      "https://wiki.biligame.com/msgs/小乔",
      "https://www.sanguosha.com/hero",
      "https://www.sanguosha.cn/pc/hero-detail-311.html",
      "https://www.sanguosha.com/hero/30",
      "https://g.iqiyi.com/sanguosha/news/321011.html",
      "https://g.iqiyi.com/sanguosha/news/321009.html",
      "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304254.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "source_record_id": "sgs-mobile:hero-detail:30:identity:2026-10-15",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "aliases": [
      "三国杀小乔",
      "小乔·天香·红颜",
      "xiao-qiao"
    ],
    "portrait_path": "./portraits-sgs-next-identity/xiao-qiao.svg",
    "source_skill_rules": [
      {
        "id": "sgs.tianxiang",
        "name": "天香",
        "optional": true,
        "trigger": "At receiving-damage window before own HP deduction; never HP loss.",
        "cost": {
          "count": 1,
          "zone": "hand",
          "effective_suit": "heart",
          "discard": true,
          "no_equipment_or_judgment_material": true
        },
        "targets": "One other living role, any side/gender/faction/distance, including damage source; never self.",
        "frequency": "No per-turn/per-event cap. Each valid redirect costs a fresh hand card.",
        "effect": "Transfer the entire pending damage instance, retaining original source, nature, damage basis and physical-card provenance. Resolve recipient rescue and source/receiver damage triggers before transfer draw; surviving actual recipient draws its lost HP measured at that late moment. No base draw cap5 or fixed1 damage.",
        "timing_sources": [
          "mobile-30",
          "bwiki-xiao-qiao",
          "licensed-faq-wu",
          "licensed-faq-shu"
        ],
        "source_amount_contract": "One heart hand card redirects even multi-point damage. Transferred damage is not a new Slash target; no fresh Dodge window or target-designation triggers.",
        "excluded": [
          "Jie prevented-damage plus fixed1 damage / HP-loss choice",
          "changing source to XiaoQiao",
          "using equipped red material",
          "turning HP-loss into damage"
        ],
        "open_future_edge": "Future publisher prevention such as 大雾 needs version-specific closure. Current Jianghu integer-armor zero and cross-copy behavior use explicit policy JP2, not an asserted official same-game resolution."
      },
      {
        "id": "sgs.hongyan",
        "name": "红颜",
        "optional": false,
        "trigger": "Suit/color projection in owned hand action contexts and own final judgment.",
        "effect": "A printed spade hand card is treated as heart for use, response, discard and giving; own spade judgment resolves as heart. Red color follows effective heart. Rank and physical ID never change.",
        "scope": {
          "hand_actions": [
            "use",
            "respond",
            "discard",
            "give"
          ],
          "judged_player": "owner including replacement judgment donated by another",
          "equipped_cards": "No blanket equipment projection in this selected current mobile wording. A card of equipment type still in hand does qualify.",
          "other_players": "No persistent global mutation after ownership changes."
        },
        "excluded": [
          "Broad historical OL all-card Hongyan",
          "Jie choose a new suit for any heart judgment",
          "Free heart-card redraw"
        ],
        "sources": [
          "mobile-30",
          "bwiki-xiao-qiao"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "female",
      "skills": [
        {
          "id": "sgs.tianxiang",
          "name": "天香",
          "optional": true,
          "trigger": "At receiving-damage window before own HP deduction; never HP loss.",
          "cost": {
            "count": 1,
            "zone": "hand",
            "effective_suit": "heart",
            "discard": true,
            "no_equipment_or_judgment_material": true
          },
          "targets": "One other living role, any side/gender/faction/distance, including damage source; never self.",
          "frequency": "No per-turn/per-event cap. Each valid redirect costs a fresh hand card.",
          "effect": "Transfer the entire pending damage instance, retaining original source, nature, damage basis and physical-card provenance. Resolve recipient rescue and source/receiver damage triggers before transfer draw; surviving actual recipient draws its lost HP measured at that late moment. No base draw cap5 or fixed1 damage.",
          "timing_sources": [
            "mobile-30",
            "bwiki-xiao-qiao",
            "licensed-faq-wu",
            "licensed-faq-shu"
          ],
          "source_amount_contract": "One heart hand card redirects even multi-point damage. Transferred damage is not a new Slash target; no fresh Dodge window or target-designation triggers.",
          "excluded": [
            "Jie prevented-damage plus fixed1 damage / HP-loss choice",
            "changing source to XiaoQiao",
            "using equipped red material",
            "turning HP-loss into damage"
          ],
          "open_future_edge": "Future publisher prevention such as 大雾 needs version-specific closure. Current Jianghu integer-armor zero and cross-copy behavior use explicit policy JP2, not an asserted official same-game resolution."
        },
        {
          "id": "sgs.hongyan",
          "name": "红颜",
          "optional": false,
          "trigger": "Suit/color projection in owned hand action contexts and own final judgment.",
          "effect": "A printed spade hand card is treated as heart for use, response, discard and giving; own spade judgment resolves as heart. Red color follows effective heart. Rank and physical ID never change.",
          "scope": {
            "hand_actions": [
              "use",
              "respond",
              "discard",
              "give"
            ],
            "judged_player": "owner including replacement judgment donated by another",
            "equipped_cards": "No blanket equipment projection in this selected current mobile wording. A card of equipment type still in hand does qualify.",
            "other_players": "No persistent global mutation after ownership changes."
          },
          "excluded": [
            "Broad historical OL all-card Hongyan",
            "Jie choose a new suit for any heart judgment",
            "Free heart-card redraw"
          ],
          "sources": [
            "mobile-30",
            "bwiki-xiao-qiao"
          ]
        }
      ]
    },
    "full_intrinsic_skillset_verified": true,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "source_identity_context": {
      "faction": "吴",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；当前目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页无明确数值体力及性别字段；采用手游BWIKI明确字段及官方OL跨产品hp交叉印证，拒绝initial_hp=0。",
      "历史授权OL运营FAQ、旧规则镜像只佐证匹配边界；跨作品整合按明确江湖兼容约定。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；当前江湖1v1/1v2仍用选定身份包，不替换成官方1v1、界、SP或国战版本。未来模式仍在整体范围。",
    "source_evidence_note": "大陆移动版完整目录确认身份技能与阵营；手游BWIKI确认经典体力/性别，官方OL名册仅跨产品佐证体力。历史授权OL运营FAQ与旧规则镜像分层标明，不声称当前客户端实测。",
    "source_evidence_tiers": [
      {
        "id": "mobile-30",
        "url": "https://www.sanguosha.cn/pc/hero-detail-30.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "9cd5c0e6fef73598d0687410f991f1f6dada63ea043cec70f91f0df66feac268"
      },
      {
        "id": "bwiki-xiao-qiao",
        "url": "https://wiki.biligame.com/msgs/小乔",
        "tier": "secondary_mobile_focused_community",
        "accessed_at": "2026-10-15",
        "sha256": "f68fdfa24fce6662f096781de8ec32c236dde143bec0432fec054473950a6346"
      },
      {
        "id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "tier": "primary_other_product_metadata",
        "accessed_at": "2026-10-15",
        "sha256": "d2faec152568b37bb18b8cde3804902fef68f893ed5ae33bdf4b0d92930a8969"
      },
      {
        "id": "mobile-311",
        "url": "https://www.sanguosha.cn/pc/hero-detail-311.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "477923e42b5e66b0d96457ce1a2fdd5100ea9064ca46ad424b0c21f370637361"
      },
      {
        "id": "ol-30",
        "url": "https://www.sanguosha.com/hero/30",
        "tier": "primary_other_product_rule_exclusion",
        "accessed_at": "2026-10-15"
      },
      {
        "id": "licensed-faq-wu",
        "url": "https://g.iqiyi.com/sanguosha/news/321011.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15",
        "published_date": "2011 (web indexed age)"
      },
      {
        "id": "licensed-faq-shu",
        "url": "https://g.iqiyi.com/sanguosha/news/321009.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15",
        "published_date": "2011 (web indexed age)"
      },
      {
        "id": "rule-wu",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
        "tier": "secondary_mirror_historical_rulebook",
        "accessed_at": "2026-10-15"
      },
      {
        "id": "yxs-li-shishi",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304254.shtml",
        "tier": "primary_historical_YXS_mobile",
        "accessed_at": "2026-10-15",
        "published_date": "2015-02-03",
        "sha256": "7c55e8dede9492033463f55b8613269cc7c190db3c85b66454e326f7e78ce024"
      }
    ],
    "compatibility_policies": [
      {
        "id": "JP1",
        "topic": "Cross-game card family and effective suit",
        "decision": "Retain existing Jianghu Slash-family inclusion (normal/fire/thunder/blood/poison) and shared H/E zone definitions. Hongyan uses a zone/action-aware projection, never mutation of a physical card. Record the hand-origin effective face when moving into processing so conversion/response does not lose its suit. Equipped spades do not turn heart merely because owner is XiaoQiao.",
        "basis": "Explicit host compatibility for original cards; mobile hand/judgment scope is source evidence."
      },
      {
        "id": "JP2",
        "topic": "Tianxiang with Manwu and integer armor",
        "decision": "Reuse the established host prevention-before-transfer eligibility for original integer armor, carry pre-final-defense amount, and apply final recipient armor once. Mixed Manwu/Tianxiang redirects require a fresh committed hand cost each time. Preserve the existing final-actual-recipient, one delayed draw per actual positive-damage event policy; no phantom draws for intermediate copies or zero-HP-loss custom armor outcomes.",
        "basis": "Cross-game convention, not publisher rule for two versions on one table. Future same-game 大雾/no-damage wording remains a source-specific edge and must not be claimed resolved."
      },
      {
        "id": "JP7",
        "topic": "Identity copies and character transformation",
        "decision": "Full-package acquisition uses stable source/skill IDs and local per-holder state. Never dispatch by display name, omit a passive, reuse a dead hero pile or overwrite current hand/role/team on copying a template. Existing 易装 copies male packets only, so XiaoQiao is not eligible by that skill; male WeiYan/PangDe/(resolved)ZhouTai/DianWei are eligible complete packets.",
        "basis": "Existing Jianghu transformation policy; preserve full source package and provenance."
      }
    ],
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "candidate": "yxs.adapted.base.hero.li-shi-shi",
        "decision": "distinct_complete_packets",
        "equal": [
          "HP3",
          "female",
          "heart-hand full-event redirect",
          "late lost-HP draw",
          "own judgment spade-to-heart"
        ],
        "counterexample": "An owned equipped printed-spade weapon, tested for a color-sensitive equipped-card cost, remains black under selected mobile Hongyan but is red under historical YXS Hongzhuang. Both complete packages are compared, not only Tianxiang/Manwu. Faction is preserved context, not the mechanical disproof.",
        "not_used_as_proof": "Existing host bugs or arbitrary differences in cross-copy policies are not source-intrinsic differences."
      },
      "merged_source_ids": []
    },
    "dedup_review": {
      "candidate": "yxs.adapted.base.hero.li-shi-shi",
      "decision": "distinct_complete_packets",
      "equal": [
        "HP3",
        "female",
        "heart-hand full-event redirect",
        "late lost-HP draw",
        "own judgment spade-to-heart"
      ],
      "counterexample": "An owned equipped printed-spade weapon, tested for a color-sensitive equipped-card cost, remains black under selected mobile Hongyan but is red under historical YXS Hongzhuang. Both complete packages are compared, not only Tianxiang/Manwu. Faction is preserved context, not the mechanical disproof.",
      "not_used_as_proof": "Existing host bugs or arbitrary differences in cross-copy policies are not source-intrinsic differences."
    },
    "variant_boundaries": {
      "mobile_jie": 311,
      "current_OL_same_numeric_id": 30,
      "base_hidden_guozhan_skills": [
        "红颜"
      ],
      "warning": "Hidden alternate-mode inventory is catalog evidence only, not proof that the live Guozhan client has only this skill."
    }
  },
  {
    "product": "sanguosha_mobile_cn",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "selected_mode": "身份",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_coverage": true,
    "implemented_by_this_research": false,
    "personal_lord_skills": [],
    "complete_skill_inventory_read": true,
    "source_only_exact_for_every_edge": false,
    "id": "sgs.adapted.base.hero.wei-yan",
    "slug": "wei-yan",
    "name": "魏延",
    "official_entry_id": 27,
    "max_hp": 4,
    "gender": "male",
    "faction": "蜀",
    "hp_evidence": {
      "primary_mainland_explicit": false,
      "mobile_secondary": "bwiki-wei-yan",
      "official_other_product": "ol-roster",
      "ol_gid": 27,
      "ol_hp": 4,
      "rejected_initial_hp": 0,
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 27,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "current_mobile_client_verified": false
    },
    "gender_evidence": "bwiki-wei-yan",
    "source_ids": [
      "mobile-27",
      "bwiki-wei-yan",
      "ol-roster",
      "mobile-308",
      "ol-27",
      "licensed-faq-shu",
      "licensed-faq-tricks",
      "rule-shu",
      "rule-decrease"
    ],
    "status": "source_ready_with_tiered_edges_and_disclosed_host_policies",
    "skills": [
      {
        "id": "sgs.kuanggu",
        "name": "狂骨",
        "optional": false,
        "trigger": "After each point of actual damage for which owner is source; any turn and damage kind, including self and chain.",
        "eligibility_snapshot": "Measure source-to-actual-recipient distance immediately before that recipient loses HP, after target transfers and pre-damage equipment removals. <=1 is inclusive; self distance is0.",
        "effect": "After all immediate dying/rescue resolves, the surviving source recovers1 for each point of damage, capped by effective maximum HP. No draw alternative, no damage-event-only cap, no play-phase restriction.",
        "ordering": "Source after-causing-damage precedes receiver after-taking-damage (e.g. Ganglie); Tianxiang draw is later. If source is target and dies without rescue, Kuanggu cannot rescue the corpse.",
        "sources": [
          "mobile-27",
          "bwiki-wei-yan",
          "licensed-faq-shu",
          "licensed-faq-tricks",
          "rule-shu",
          "rule-decrease"
        ],
        "excluded": [
          "Jie/OL heal-or-draw choice",
          "奇谋",
          "Star/势 skills",
          "publisher1v1 black-judgment per-event variant",
          "HP-loss healing",
          "range-at-Slash-declaration or distance-after-target-death recheck"
        ]
      }
    ],
    "full_intrinsic_skillset_semantics_ready": true,
    "variants": {
      "mobile_jie": 308,
      "current_OL_same_numeric_id": 27,
      "base_skill_count": 1,
      "mobile_mode_labels": [
        "身份"
      ],
      "warning": "Host1v1 must still use the selected identity packet, not publisher1v1."
    },
    "compare_existing_templates_count": 77,
    "proposed_merge": null,
    "display_name": "魏延",
    "skill_name": "狂骨",
    "skill_desc": "狂骨：对扣血前距离1以内的实际目标每造成1点伤害，救援结束后回复1点体力；锁定、可回合外，满血不超上限。",
    "skill_ids": [
      "sgs.kuanggu"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "魏延",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-27.html",
      "https://wiki.biligame.com/msgs/魏延",
      "https://www.sanguosha.com/hero",
      "https://www.sanguosha.cn/pc/hero-detail-308.html",
      "https://www.sanguosha.com/hero/27",
      "https://g.iqiyi.com/sanguosha/news/321009.html",
      "https://g.iqiyi.com/sanguosha/news/321006.html",
      "https://gltjk.com/sanguosha/rules/card/hero/shu.html",
      "https://gltjk.com/sanguosha/rules/flow/decreaselife.html"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "source_record_id": "sgs-mobile:hero-detail:27:identity:2026-10-15",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "aliases": [
      "三国杀魏延",
      "魏延·狂骨",
      "wei-yan"
    ],
    "portrait_path": "./portraits-sgs-next-identity/wei-yan.svg",
    "source_skill_rules": [
      {
        "id": "sgs.kuanggu",
        "name": "狂骨",
        "optional": false,
        "trigger": "After each point of actual damage for which owner is source; any turn and damage kind, including self and chain.",
        "eligibility_snapshot": "Measure source-to-actual-recipient distance immediately before that recipient loses HP, after target transfers and pre-damage equipment removals. <=1 is inclusive; self distance is0.",
        "effect": "After all immediate dying/rescue resolves, the surviving source recovers1 for each point of damage, capped by effective maximum HP. No draw alternative, no damage-event-only cap, no play-phase restriction.",
        "ordering": "Source after-causing-damage precedes receiver after-taking-damage (e.g. Ganglie); Tianxiang draw is later. If source is target and dies without rescue, Kuanggu cannot rescue the corpse.",
        "sources": [
          "mobile-27",
          "bwiki-wei-yan",
          "licensed-faq-shu",
          "licensed-faq-tricks",
          "rule-shu",
          "rule-decrease"
        ],
        "excluded": [
          "Jie/OL heal-or-draw choice",
          "奇谋",
          "Star/势 skills",
          "publisher1v1 black-judgment per-event variant",
          "HP-loss healing",
          "range-at-Slash-declaration or distance-after-target-death recheck"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.kuanggu",
          "name": "狂骨",
          "optional": false,
          "trigger": "After each point of actual damage for which owner is source; any turn and damage kind, including self and chain.",
          "eligibility_snapshot": "Measure source-to-actual-recipient distance immediately before that recipient loses HP, after target transfers and pre-damage equipment removals. <=1 is inclusive; self distance is0.",
          "effect": "After all immediate dying/rescue resolves, the surviving source recovers1 for each point of damage, capped by effective maximum HP. No draw alternative, no damage-event-only cap, no play-phase restriction.",
          "ordering": "Source after-causing-damage precedes receiver after-taking-damage (e.g. Ganglie); Tianxiang draw is later. If source is target and dies without rescue, Kuanggu cannot rescue the corpse.",
          "sources": [
            "mobile-27",
            "bwiki-wei-yan",
            "licensed-faq-shu",
            "licensed-faq-tricks",
            "rule-shu",
            "rule-decrease"
          ],
          "excluded": [
            "Jie/OL heal-or-draw choice",
            "奇谋",
            "Star/势 skills",
            "publisher1v1 black-judgment per-event variant",
            "HP-loss healing",
            "range-at-Slash-declaration or distance-after-target-death recheck"
          ]
        }
      ]
    },
    "full_intrinsic_skillset_verified": true,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "source_identity_context": {
      "faction": "蜀",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；当前目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页无明确数值体力及性别字段；采用手游BWIKI明确字段及官方OL跨产品hp交叉印证，拒绝initial_hp=0。",
      "历史授权OL运营FAQ、旧规则镜像只佐证匹配边界；跨作品整合按明确江湖兼容约定。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；当前江湖1v1/1v2仍用选定身份包，不替换成官方1v1、界、SP或国战版本。未来模式仍在整体范围。",
    "source_evidence_note": "大陆移动版完整目录确认身份技能与阵营；手游BWIKI确认经典体力/性别，官方OL名册仅跨产品佐证体力。历史授权OL运营FAQ与旧规则镜像分层标明，不声称当前客户端实测。",
    "source_evidence_tiers": [
      {
        "id": "mobile-27",
        "url": "https://www.sanguosha.cn/pc/hero-detail-27.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "c056de0e4700e81fff07fe56e024d2a40533270814aa1d3c70f147d7d43f4646"
      },
      {
        "id": "bwiki-wei-yan",
        "url": "https://wiki.biligame.com/msgs/魏延",
        "tier": "secondary_mobile_focused_community",
        "accessed_at": "2026-10-15",
        "sha256": "79d32bc8e157908b9bf9677d4ef549de422ff641e7125a5d4a50f98e1128050d"
      },
      {
        "id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "tier": "primary_other_product_metadata",
        "accessed_at": "2026-10-15",
        "sha256": "d2faec152568b37bb18b8cde3804902fef68f893ed5ae33bdf4b0d92930a8969"
      },
      {
        "id": "mobile-308",
        "url": "https://www.sanguosha.cn/pc/hero-detail-308.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "2140ae89fa1a4292899adecd6e6b3c49bf3f4983fb7d7923203c73689e8363f8"
      },
      {
        "id": "ol-27",
        "url": "https://www.sanguosha.com/hero/27",
        "tier": "primary_other_product_rule_exclusion",
        "accessed_at": "2026-10-15"
      },
      {
        "id": "licensed-faq-shu",
        "url": "https://g.iqiyi.com/sanguosha/news/321009.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15",
        "published_date": "2011 (web indexed age)"
      },
      {
        "id": "licensed-faq-tricks",
        "url": "https://g.iqiyi.com/sanguosha/news/321006.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15"
      },
      {
        "id": "rule-shu",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/shu.html",
        "tier": "secondary_mirror_historical_rulebook",
        "accessed_at": "2026-10-15"
      },
      {
        "id": "rule-decrease",
        "url": "https://gltjk.com/sanguosha/rules/flow/decreaselife.html",
        "tier": "secondary_mirror_historical_rulebook",
        "accessed_at": "2026-10-15"
      }
    ],
    "compatibility_policies": [
      {
        "id": "JP3",
        "topic": "New source damage window",
        "decision": "Freeze Kuanggu distance before actual target HP decrement. Resolve dying, then source after-causing-damage recovery, then receiver after-taking-damage skills, then delayed transfer draw. Do not recompute from seats after a death or a later equipment move. Source-derived equipment ordering must be named and regression-tested; use a stable shared window rather than silently pushing Kuanggu to card-end.",
        "basis": "Source snapshot/after-rescue/source-before-receiver order is evidenced; exact placement against unrelated cross-game derived weapons is host policy."
      },
      {
        "id": "JP7",
        "topic": "Identity copies and character transformation",
        "decision": "Full-package acquisition uses stable source/skill IDs and local per-holder state. Never dispatch by display name, omit a passive, reuse a dead hero pile or overwrite current hand/role/team on copying a template. Existing 易装 copies male packets only, so XiaoQiao is not eligible by that skill; male WeiYan/PangDe/(resolved)ZhouTai/DianWei are eligible complete packets.",
        "basis": "Existing Jianghu transformation policy; preserve full source package and provenance."
      }
    ],
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "distinct_complete_packets",
        "compared_templates": 77
      },
      "merged_source_ids": []
    },
    "dedup_review": {
      "decision": "do_not_merge",
      "compared_templates": 77
    },
    "variant_boundaries": {
      "mobile_jie": 308,
      "current_OL_same_numeric_id": 27,
      "base_skill_count": 1,
      "mobile_mode_labels": [
        "身份"
      ],
      "warning": "Host1v1 must still use the selected identity packet, not publisher1v1."
    }
  },
  {
    "product": "sanguosha_mobile_cn",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "selected_mode": "身份",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_coverage": true,
    "implemented_by_this_research": false,
    "personal_lord_skills": [],
    "complete_skill_inventory_read": true,
    "source_only_exact_for_every_edge": false,
    "id": "sgs.adapted.base.hero.pang-de",
    "slug": "pang-de",
    "name": "庞德",
    "official_entry_id": 39,
    "max_hp": 4,
    "gender": "male",
    "faction": "群",
    "hp_evidence": {
      "primary_mainland_explicit": false,
      "mobile_secondary": "bwiki-pang-de",
      "official_other_product": "ol-roster",
      "ol_gid": 39,
      "ol_hp": 4,
      "rejected_initial_hp": 0,
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 39,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "current_mobile_client_verified": false
    },
    "gender_evidence": "bwiki-pang-de",
    "source_ids": [
      "mobile-39",
      "bwiki-pang-de",
      "ol-roster",
      "mobile-267",
      "mobile-67",
      "licensed-faq-fire",
      "yxs-tiemuzhen"
    ],
    "status": "source_ready_with_tiered_edges_and_disclosed_host_policies",
    "skills": [
      {
        "id": "sgs.mashu",
        "name": "马术",
        "optional": false,
        "trigger": "Outgoing ordinary distance calculation.",
        "effect": "Subtract1 from owner-to-other distance, stacking with offensive horse; minimum nonself distance1. Does not alter incoming distance, weapon attack-range value or hard targeting prohibitions.",
        "sources": [
          "mobile-39"
        ],
        "cross_game_policy": "Use existing shared host distance and fixed-distance precedence; skill is not a real horse and cannot be discarded as equipment."
      },
      {
        "id": "sgs.mengjin",
        "name": "猛进",
        "optional": true,
        "trigger": "A Slash actually used by owner is fully cancelled by its final target using sufficient Dodge responses.",
        "cost": "No own hand/equipment discard and no judgment.",
        "targets": "Only the successfully dodging final target, not another role.",
        "effect": "Choose and discard one currently available card from that target hand or equipment. Hand choice remains hidden/blind; equipment is public. Judgment-area and special-pile cards are ineligible.",
        "frequency": "Once per completed Slash-target branch; repeated Slash uses can trigger again. Multi-target and redirected branches are independent.",
        "ordering": "Finish responder Dodge-trigger skills, then offer Mengjin, then Axe forced-hit or Blade follow-up. Loss/equipment-leave triggers settle before the next parent effect.",
        "sources": [
          "mobile-39",
          "licensed-faq-fire"
        ],
        "excluded": [
          "Partial double-Dodge response",
          "armor immunity/prevention without Dodge",
          "Dodge against arrows rather than own Slash",
          "response-only Slash in Duel",
          "SP own-card payment/obtain Dodge or silence",
          "Jie pre-response Jianchu",
          "YXS black-judgment obtain rather than discard"
        ]
      }
    ],
    "full_intrinsic_skillset_semantics_ready": true,
    "variants": {
      "mobile_jie": 267,
      "mobile_SP": 67,
      "base_hidden_guozhan_skills": [
        "马术"
      ],
      "warning": "SP67 currently has 决死, not some indexed unofficial SP articles claiming a different 猛进. Product/entry identity is mandatory."
    },
    "equivalence_focus": {
      "candidate": "yxs.adapted.base.hero.tie-mu-zhen",
      "decision": "distinct_complete_packets",
      "equal": [
        "HP4",
        "outgoing distance-1",
        "post-full-Dodge opportunity"
      ],
      "counterexample": "Mengjin discards H/E with no judgment; Qianglue requires a black judgment and obtains H/E/J. A red top card with an equipped victim is a direct discriminating case.",
      "other_close": [
        "马超 has designation red-judgment Dodge prohibition, not post-dodge discard.",
        "YXS关羽 has 补刀 in addition to 单骑; original 岚衣 adds own-Dodge draw and red-judgment obtain, lacks 马术."
      ]
    },
    "compare_existing_templates_count": 77,
    "proposed_merge": null,
    "display_name": "庞德",
    "skill_name": "马术 / 猛进",
    "skill_desc": "马术：到其他角色的距离减1。猛进：自己的杀被目标完整闪避后，可弃置该目标1张手牌或装备；不判定、不支付自己的牌。",
    "skill_ids": [
      "sgs.mashu",
      "sgs.mengjin"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "庞德",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-39.html",
      "https://wiki.biligame.com/msgs/庞德",
      "https://www.sanguosha.com/hero",
      "https://www.sanguosha.cn/pc/hero-detail-267.html",
      "https://www.sanguosha.cn/pc/hero-detail-67.html",
      "https://g.iqiyi.com/sanguosha/news/321021.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304230.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "source_record_id": "sgs-mobile:hero-detail:39:identity:2026-10-15",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "aliases": [
      "三国杀庞德",
      "庞德·马术·猛进",
      "pang-de"
    ],
    "portrait_path": "./portraits-sgs-next-identity/pang-de.svg",
    "source_skill_rules": [
      {
        "id": "sgs.mashu",
        "name": "马术",
        "optional": false,
        "trigger": "Outgoing ordinary distance calculation.",
        "effect": "Subtract1 from owner-to-other distance, stacking with offensive horse; minimum nonself distance1. Does not alter incoming distance, weapon attack-range value or hard targeting prohibitions.",
        "sources": [
          "mobile-39"
        ],
        "cross_game_policy": "Use existing shared host distance and fixed-distance precedence; skill is not a real horse and cannot be discarded as equipment."
      },
      {
        "id": "sgs.mengjin",
        "name": "猛进",
        "optional": true,
        "trigger": "A Slash actually used by owner is fully cancelled by its final target using sufficient Dodge responses.",
        "cost": "No own hand/equipment discard and no judgment.",
        "targets": "Only the successfully dodging final target, not another role.",
        "effect": "Choose and discard one currently available card from that target hand or equipment. Hand choice remains hidden/blind; equipment is public. Judgment-area and special-pile cards are ineligible.",
        "frequency": "Once per completed Slash-target branch; repeated Slash uses can trigger again. Multi-target and redirected branches are independent.",
        "ordering": "Finish responder Dodge-trigger skills, then offer Mengjin, then Axe forced-hit or Blade follow-up. Loss/equipment-leave triggers settle before the next parent effect.",
        "sources": [
          "mobile-39",
          "licensed-faq-fire"
        ],
        "excluded": [
          "Partial double-Dodge response",
          "armor immunity/prevention without Dodge",
          "Dodge against arrows rather than own Slash",
          "response-only Slash in Duel",
          "SP own-card payment/obtain Dodge or silence",
          "Jie pre-response Jianchu",
          "YXS black-judgment obtain rather than discard"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.mashu",
          "name": "马术",
          "optional": false,
          "trigger": "Outgoing ordinary distance calculation.",
          "effect": "Subtract1 from owner-to-other distance, stacking with offensive horse; minimum nonself distance1. Does not alter incoming distance, weapon attack-range value or hard targeting prohibitions.",
          "sources": [
            "mobile-39"
          ],
          "cross_game_policy": "Use existing shared host distance and fixed-distance precedence; skill is not a real horse and cannot be discarded as equipment."
        },
        {
          "id": "sgs.mengjin",
          "name": "猛进",
          "optional": true,
          "trigger": "A Slash actually used by owner is fully cancelled by its final target using sufficient Dodge responses.",
          "cost": "No own hand/equipment discard and no judgment.",
          "targets": "Only the successfully dodging final target, not another role.",
          "effect": "Choose and discard one currently available card from that target hand or equipment. Hand choice remains hidden/blind; equipment is public. Judgment-area and special-pile cards are ineligible.",
          "frequency": "Once per completed Slash-target branch; repeated Slash uses can trigger again. Multi-target and redirected branches are independent.",
          "ordering": "Finish responder Dodge-trigger skills, then offer Mengjin, then Axe forced-hit or Blade follow-up. Loss/equipment-leave triggers settle before the next parent effect.",
          "sources": [
            "mobile-39",
            "licensed-faq-fire"
          ],
          "excluded": [
            "Partial double-Dodge response",
            "armor immunity/prevention without Dodge",
            "Dodge against arrows rather than own Slash",
            "response-only Slash in Duel",
            "SP own-card payment/obtain Dodge or silence",
            "Jie pre-response Jianchu",
            "YXS black-judgment obtain rather than discard"
          ]
        }
      ]
    },
    "full_intrinsic_skillset_verified": true,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "source_identity_context": {
      "faction": "群",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；当前目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页无明确数值体力及性别字段；采用手游BWIKI明确字段及官方OL跨产品hp交叉印证，拒绝initial_hp=0。",
      "历史授权OL运营FAQ、旧规则镜像只佐证匹配边界；跨作品整合按明确江湖兼容约定。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；当前江湖1v1/1v2仍用选定身份包，不替换成官方1v1、界、SP或国战版本。未来模式仍在整体范围。",
    "source_evidence_note": "大陆移动版完整目录确认身份技能与阵营；手游BWIKI确认经典体力/性别，官方OL名册仅跨产品佐证体力。历史授权OL运营FAQ与旧规则镜像分层标明，不声称当前客户端实测。",
    "source_evidence_tiers": [
      {
        "id": "mobile-39",
        "url": "https://www.sanguosha.cn/pc/hero-detail-39.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "c25018bfa0e9157cdf28912e14c1fc65fc496f1db29c5cd22426f93ee544a7bf"
      },
      {
        "id": "bwiki-pang-de",
        "url": "https://wiki.biligame.com/msgs/庞德",
        "tier": "secondary_mobile_focused_community",
        "accessed_at": "2026-10-15",
        "sha256": "6ecf341831854d64475d753a942507b6a6c4233810d86840bd8e2f5082efc344"
      },
      {
        "id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "tier": "primary_other_product_metadata",
        "accessed_at": "2026-10-15",
        "sha256": "d2faec152568b37bb18b8cde3804902fef68f893ed5ae33bdf4b0d92930a8969"
      },
      {
        "id": "mobile-267",
        "url": "https://www.sanguosha.cn/pc/hero-detail-267.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "c00cdda349ec5a801cac7dbf0e97b73c70f3624d97c042d6006292cca40f99c6"
      },
      {
        "id": "mobile-67",
        "url": "https://www.sanguosha.cn/pc/hero-detail-67.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "81b0e696a44c354af734eb7f604255e0af2e02516fd428c653d5ad5df0fb4f19"
      },
      {
        "id": "licensed-faq-fire",
        "url": "https://g.iqiyi.com/sanguosha/news/321021.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15",
        "published_date": "2011 (web indexed age)"
      },
      {
        "id": "yxs-tiemuzhen",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304230.shtml",
        "tier": "primary_historical_YXS_mobile",
        "accessed_at": "2026-10-15",
        "published_date": "2015-02-03",
        "sha256": "f2d9b46dc2d06516de1886dbb2bc6d109cd279489318f8e2c44f87b7cfed637c"
      }
    ],
    "compatibility_policies": [
      {
        "id": "JP4",
        "topic": "Mengjin branch and zones",
        "decision": "Use existing successful-full-Dodge branch IDs and responder-before-attacker-before-weapon order. Allow H/E only, exclude physical judgment cards and original abstract markers. Hidden hand selection uses the engine deterministic blind selector; no reveal leakage. Commit removal through shared movement pipeline.",
        "basis": "H/E and timing corroborated by historical FAQ; deterministic UI/hidden selector is host policy."
      },
      {
        "id": "JP7",
        "topic": "Identity copies and character transformation",
        "decision": "Full-package acquisition uses stable source/skill IDs and local per-holder state. Never dispatch by display name, omit a passive, reuse a dead hero pile or overwrite current hand/role/team on copying a template. Existing 易装 copies male packets only, so XiaoQiao is not eligible by that skill; male WeiYan/PangDe/(resolved)ZhouTai/DianWei are eligible complete packets.",
        "basis": "Existing Jianghu transformation policy; preserve full source package and provenance."
      }
    ],
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "candidate": "yxs.adapted.base.hero.tie-mu-zhen",
        "decision": "distinct_complete_packets",
        "equal": [
          "HP4",
          "outgoing distance-1",
          "post-full-Dodge opportunity"
        ],
        "counterexample": "Mengjin discards H/E with no judgment; Qianglue requires a black judgment and obtains H/E/J. A red top card with an equipped victim is a direct discriminating case.",
        "other_close": [
          "马超 has designation red-judgment Dodge prohibition, not post-dodge discard.",
          "YXS关羽 has 补刀 in addition to 单骑; original 岚衣 adds own-Dodge draw and red-judgment obtain, lacks 马术."
        ]
      },
      "merged_source_ids": []
    },
    "dedup_review": {
      "candidate": "yxs.adapted.base.hero.tie-mu-zhen",
      "decision": "distinct_complete_packets",
      "equal": [
        "HP4",
        "outgoing distance-1",
        "post-full-Dodge opportunity"
      ],
      "counterexample": "Mengjin discards H/E with no judgment; Qianglue requires a black judgment and obtains H/E/J. A red top card with an equipped victim is a direct discriminating case.",
      "other_close": [
        "马超 has designation red-judgment Dodge prohibition, not post-dodge discard.",
        "YXS关羽 has 补刀 in addition to 单骑; original 岚衣 adds own-Dodge draw and red-judgment obtain, lacks 马术."
      ]
    },
    "variant_boundaries": {
      "mobile_jie": 267,
      "mobile_SP": 67,
      "base_hidden_guozhan_skills": [
        "马术"
      ],
      "warning": "SP67 currently has 决死, not some indexed unofficial SP articles claiming a different 猛进. Product/entry identity is mandatory."
    }
  },
  {
    "product": "sanguosha_mobile_cn",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "selected_mode": "身份",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_coverage": true,
    "implemented_by_this_research": false,
    "personal_lord_skills": [],
    "complete_skill_inventory_read": true,
    "source_only_exact_for_every_edge": false,
    "id": "sgs.adapted.base.hero.dian-wei",
    "slug": "dian-wei",
    "name": "典韦",
    "official_entry_id": 34,
    "max_hp": 4,
    "gender": "male",
    "faction": "魏",
    "hp_evidence": {
      "primary_mainland_explicit": false,
      "mobile_secondary": "bwiki-dian-wei",
      "official_other_product": "ol-roster",
      "ol_gid": 34,
      "ol_hp": 4,
      "rejected_initial_hp": 0,
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 34,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "current_mobile_client_verified": false
    },
    "gender_evidence": "bwiki-dian-wei",
    "source_ids": [
      "mobile-34",
      "bwiki-dian-wei",
      "ol-roster",
      "mobile-263",
      "licensed-faq-fire"
    ],
    "status": "source_ready_selected_replacement_after_explicit_parent_confirmation",
    "skills": [
      {
        "id": "sgs.qiangxi",
        "name": "强袭",
        "optional": true,
        "trigger": "Own genuine play phase idle action; once per phase.",
        "cost": {
          "choice": [
            "lose1HP",
            "discard1 weapon card from own hand or equipment"
          ],
          "weapon_cost_not_any_equipment": true
        },
        "targets": "One other living role within attack range after excluding an equipped weapon selected as cost; hand weapon cost leaves equipped range intact.",
        "effect": "After committed cost and its full loss/dying/rescue consequences, deal1 ordinary skill damage to chosen role. No Slash/Dodge/Nullification, no physical damage card. A committed effect continues even if owner died from HP cost, unless game has already ended.",
        "frequency": "One shared quota for both cost branches, tied to phase ID, not one per target or one per turn.",
        "sources": [
          "mobile-34",
          "bwiki-dian-wei",
          "licensed-faq-fire"
        ],
        "excluded": [
          "Jie one-per-target quota",
          "Guozhan self-damage cost instead of HP loss",
          "publisher1v1 range-free opponent target"
        ]
      }
    ],
    "full_intrinsic_skillset_semantics_ready": true,
    "variants": {
      "mobile_jie": 263,
      "base_hidden_guozhan": [
        "强袭"
      ],
      "other_mode_conflict": "BWIKI modern Guozhan self-damage version differs; identity selection remains HP loss."
    },
    "compare_existing_templates_count": 77,
    "proposed_merge": null,
    "display_name": "典韦",
    "skill_name": "强袭",
    "skill_desc": "强袭：每个出牌阶段限1次，失去1点体力或弃1张手牌/装备区武器，对攻击范围内另一角色造成1点伤害；弃掉的已装备武器不供射程。",
    "skill_ids": [
      "sgs.qiangxi"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "典韦",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-34.html",
      "https://wiki.biligame.com/msgs/典韦",
      "https://www.sanguosha.com/hero",
      "https://www.sanguosha.cn/pc/hero-detail-263.html",
      "https://g.iqiyi.com/sanguosha/news/321021.html"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "source_record_id": "sgs-mobile:hero-detail:34:identity:2026-10-15",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "aliases": [
      "三国杀典韦",
      "典韦·强袭",
      "dian-wei"
    ],
    "portrait_path": "./portraits-sgs-next-identity/dian-wei.svg",
    "source_skill_rules": [
      {
        "id": "sgs.qiangxi",
        "name": "强袭",
        "optional": true,
        "trigger": "Own genuine play phase idle action; once per phase.",
        "cost": {
          "choice": [
            "lose1HP",
            "discard1 weapon card from own hand or equipment"
          ],
          "weapon_cost_not_any_equipment": true
        },
        "targets": "One other living role within attack range after excluding an equipped weapon selected as cost; hand weapon cost leaves equipped range intact.",
        "effect": "After committed cost and its full loss/dying/rescue consequences, deal1 ordinary skill damage to chosen role. No Slash/Dodge/Nullification, no physical damage card. A committed effect continues even if owner died from HP cost, unless game has already ended.",
        "frequency": "One shared quota for both cost branches, tied to phase ID, not one per target or one per turn.",
        "sources": [
          "mobile-34",
          "bwiki-dian-wei",
          "licensed-faq-fire"
        ],
        "excluded": [
          "Jie one-per-target quota",
          "Guozhan self-damage cost instead of HP loss",
          "publisher1v1 range-free opponent target"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.qiangxi",
          "name": "强袭",
          "optional": true,
          "trigger": "Own genuine play phase idle action; once per phase.",
          "cost": {
            "choice": [
              "lose1HP",
              "discard1 weapon card from own hand or equipment"
            ],
            "weapon_cost_not_any_equipment": true
          },
          "targets": "One other living role within attack range after excluding an equipped weapon selected as cost; hand weapon cost leaves equipped range intact.",
          "effect": "After committed cost and its full loss/dying/rescue consequences, deal1 ordinary skill damage to chosen role. No Slash/Dodge/Nullification, no physical damage card. A committed effect continues even if owner died from HP cost, unless game has already ended.",
          "frequency": "One shared quota for both cost branches, tied to phase ID, not one per target or one per turn.",
          "sources": [
            "mobile-34",
            "bwiki-dian-wei",
            "licensed-faq-fire"
          ],
          "excluded": [
            "Jie one-per-target quota",
            "Guozhan self-damage cost instead of HP loss",
            "publisher1v1 range-free opponent target"
          ]
        }
      ]
    },
    "full_intrinsic_skillset_verified": true,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "source_identity_context": {
      "faction": "魏",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；当前目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页无明确数值体力及性别字段；采用手游BWIKI明确字段及官方OL跨产品hp交叉印证，拒绝initial_hp=0。",
      "历史授权OL运营FAQ、旧规则镜像只佐证匹配边界；跨作品整合按明确江湖兼容约定。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；当前江湖1v1/1v2仍用选定身份包，不替换成官方1v1、界、SP或国战版本。未来模式仍在整体范围。",
    "source_evidence_note": "大陆移动版完整目录确认身份技能与阵营；手游BWIKI确认经典体力/性别，官方OL名册仅跨产品佐证体力。历史授权OL运营FAQ与旧规则镜像分层标明，不声称当前客户端实测。",
    "source_evidence_tiers": [
      {
        "id": "mobile-34",
        "url": "https://www.sanguosha.cn/pc/hero-detail-34.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "3e777c579c1e92af251f4a9b644c93e4458ef287cff88b8d5fa8cdaee390cb06"
      },
      {
        "id": "bwiki-dian-wei",
        "url": "https://wiki.biligame.com/msgs/典韦",
        "tier": "secondary_mobile_focused_community",
        "accessed_at": "2026-10-15",
        "sha256": "e1d886648024f29554b26503a70b53e809fd547cd0652302d2e1c0939356f105"
      },
      {
        "id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "tier": "primary_other_product_metadata",
        "accessed_at": "2026-10-15",
        "sha256": "d2faec152568b37bb18b8cde3804902fef68f893ed5ae33bdf4b0d92930a8969"
      },
      {
        "id": "mobile-263",
        "url": "https://www.sanguosha.cn/pc/hero-detail-263.html",
        "tier": "primary_mainland_mobile_catalog",
        "accessed_at": "2026-10-15",
        "published_date": null,
        "sha256": "8ee1bbdad4376d588fd196f0729e61b7fc87e913a0369bc0fc91f4c6dc54f79f"
      },
      {
        "id": "licensed-faq-fire",
        "url": "https://g.iqiyi.com/sanguosha/news/321021.html",
        "tier": "primary_historical_licensed_OL_publisher_FAQ",
        "accessed_at": "2026-10-15",
        "published_date": "2011 (web indexed age)"
      }
    ],
    "compatibility_policies": [
      {
        "id": "JP6",
        "topic": "DianWei selected replacement and committed costs",
        "decision": "Track one cost-committed receipt per play-phase ID, snapshot legality with chosen weapon excluded, settle cost losses and dying first, and continue committed skill damage if source dies but match remains ongoing. HP-loss cost does not inherit damage-only boosts. Jianghu damage reductions and transfer skills apply to the1 skill damage.",
        "basis": "Source core and historical death continuation; applying original Jianghu reduction/transfer is host compatibility."
      },
      {
        "id": "JP7",
        "topic": "Identity copies and character transformation",
        "decision": "Full-package acquisition uses stable source/skill IDs and local per-holder state. Never dispatch by display name, omit a passive, reuse a dead hero pile or overwrite current hand/role/team on copying a template. Existing 易装 copies male packets only, so XiaoQiao is not eligible by that skill; male WeiYan/PangDe/(resolved)ZhouTai/DianWei are eligible complete packets.",
        "basis": "Existing Jianghu transformation policy; preserve full source package and provenance."
      }
    ],
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "distinct_complete_packets",
        "compared_templates": 77
      },
      "merged_source_ids": []
    },
    "dedup_review": {
      "decision": "do_not_merge",
      "compared_templates": 77
    },
    "variant_boundaries": {
      "mobile_jie": 263,
      "base_hidden_guozhan": [
        "强袭"
      ],
      "other_mode_conflict": "BWIKI modern Guozhan self-damage version differs; identity selection remains HP loss."
    }
  }
];
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const SGS_NEXT_IDENTITY_DEFINITIONS=freeze(definitions);
