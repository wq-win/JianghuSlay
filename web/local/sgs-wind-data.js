/** Complete mobile-catalog identity packets. Locally integrated and independently tested; current-client parity remains unverified. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.hua-tuo",
    "name": "华佗",
    "display_name": "华佗",
    "max_hp": 3,
    "skill_name": "急救 / 青囊",
    "skill_desc": "急救：回合外可将红色手牌或装备当桃。青囊：每个出牌阶段限1次，弃1手牌令一名受伤角色回复1血。",
    "skill_ids": [
      "sgs.jijiu",
      "sgs.qingnang"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "群",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "华佗",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-22.html",
      "https://www.sanguosha.com.tw/newsinfo_915.html",
      "https://wiki.biligame.com/msgs/华佗",
      "https://www.sanguosha.com/hero",
      "https://gltjk.com/sanguosha/rules/flow/virtual.html",
      "https://gltjk.com/sanguosha/rules/flow/game.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304250.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:22:identity:2026-10-15",
    "source_ids": [
      "mobile-huatuo",
      "tw-huatuo",
      "bwiki-huatuo",
      "ol-roster",
      "mirror-virtual",
      "mirror-flow",
      "yxs-bianque"
    ],
    "aliases": [
      "三国杀华佗",
      "华佗·急救·青囊"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 22,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-huatuo",
        "field": "经典体力3"
      },
      "current_mobile_client_verified": false
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-huatuo",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-22.html",
        "publication_or_revision_date": null
      },
      {
        "id": "tw-huatuo",
        "tier": "primary_historical_Taiwan_mobile_other_product",
        "url": "https://www.sanguosha.com.tw/newsinfo_915.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "bwiki-huatuo",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/华佗",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:19"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_metadata",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-virtual",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/virtual.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-flow",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/game.html",
        "publication_or_revision_date": null
      },
      {
        "id": "yxs-bianque",
        "tier": "primary_historical_YXS_mobile",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304250.shtml",
        "publication_or_revision_date": "2015-02-03"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.jijiu",
        "name": "急救",
        "optional": true,
        "timing": "Outside owner's actual turn, at a legal Peach-use window. Host ordinarily offers this during dying rescue; not arbitrary off-turn healing.",
        "frequency": {
          "cap": null,
          "cost_per_use": 1
        },
        "cost": {
          "zones": [
            "hand",
            "equipment"
          ],
          "count": 1,
          "effective_color": "red",
          "judgment_allowed": false
        },
        "effect": "Use selected owned red card as Peach. Normal Peach recovery is1 subject to normal modifiers and HP cap.",
        "targets": "Any legal dying role including owner off-turn, ally or enemy; no intrinsic faction/gender/distance restriction.",
        "identity": "One-card conversion retains physical material, effective suit/rank/color. Its function is Peach use, not skill-only recovery.",
        "limits": [
          "Never during owner turn, including own judgment or counter-damage dying.",
          "No free heal of merely wounded non-dying role without a legal Peach window.",
          "No once-turn cap and no hand-only restriction."
        ],
        "ordering": "Commit H/E movement once; finish leave/loss triggers; revalidate dying condition before Peach. If loss already rescues the target, do not heal again. No cloning or second discard.",
        "sources": [
          "mobile-huatuo",
          "tw-huatuo",
          "mirror-virtual"
        ]
      },
      {
        "id": "sgs.qingnang",
        "name": "青囊",
        "optional": true,
        "timing": "Idle owner play phase.",
        "limit": {
          "count": 1,
          "scope": "play_phase_id"
        },
        "cost": {
          "zones": [
            "hand"
          ],
          "count": 1,
          "color": "any",
          "equipment_type_in_hand_allowed": true,
          "equipped_card_allowed": false
        },
        "targets": "One living wounded role; self/ally/enemy; any gender/faction; no range restriction.",
        "effect": "Discard first, then skill-recover1 capped at current maximum. Not Peach use.",
        "limits": [
          "Full-health target illegal.",
          "Cannot substitute for rescue inside resolution, even if own play phase.",
          "Genuine extra play phase gives another use; same-phase repeat forbidden.",
          "No Jie red-card repeat."
        ],
        "ordering": "Choose and revalidate material/target before commit. Quota commits with discard; loss triggers resolve before recovery. If target dies or is healed by nesting, committed cost/quota is not refunded.",
        "sources": [
          "mobile-huatuo",
          "mirror-flow"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.jijiu",
          "name": "急救",
          "optional": true,
          "timing": "Outside owner's actual turn, at a legal Peach-use window. Host ordinarily offers this during dying rescue; not arbitrary off-turn healing.",
          "frequency": {
            "cap": null,
            "cost_per_use": 1
          },
          "cost": {
            "zones": [
              "hand",
              "equipment"
            ],
            "count": 1,
            "effective_color": "red",
            "judgment_allowed": false
          },
          "effect": "Use selected owned red card as Peach. Normal Peach recovery is1 subject to normal modifiers and HP cap.",
          "targets": "Any legal dying role including owner off-turn, ally or enemy; no intrinsic faction/gender/distance restriction.",
          "identity": "One-card conversion retains physical material, effective suit/rank/color. Its function is Peach use, not skill-only recovery.",
          "limits": [
            "Never during owner turn, including own judgment or counter-damage dying.",
            "No free heal of merely wounded non-dying role without a legal Peach window.",
            "No once-turn cap and no hand-only restriction."
          ],
          "ordering": "Commit H/E movement once; finish leave/loss triggers; revalidate dying condition before Peach. If loss already rescues the target, do not heal again. No cloning or second discard.",
          "sources": [
            "mobile-huatuo",
            "tw-huatuo",
            "mirror-virtual"
          ]
        },
        {
          "id": "sgs.qingnang",
          "name": "青囊",
          "optional": true,
          "timing": "Idle owner play phase.",
          "limit": {
            "count": 1,
            "scope": "play_phase_id"
          },
          "cost": {
            "zones": [
              "hand"
            ],
            "count": 1,
            "color": "any",
            "equipment_type_in_hand_allowed": true,
            "equipped_card_allowed": false
          },
          "targets": "One living wounded role; self/ally/enemy; any gender/faction; no range restriction.",
          "effect": "Discard first, then skill-recover1 capped at current maximum. Not Peach use.",
          "limits": [
            "Full-health target illegal.",
            "Cannot substitute for rescue inside resolution, even if own play phase.",
            "Genuine extra play phase gives another use; same-phase repeat forbidden.",
            "No Jie red-card repeat."
          ],
          "ordering": "Choose and revalidate material/target before commit. Quota commits with discard; loss triggers resolve before recovery. If target dies or is healed by nesting, committed cost/quota is not refunded.",
          "sources": [
            "mobile-huatuo",
            "mirror-flow"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "群",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；公开基础身份目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页没有体力或性别字段；这些字段由手游BWIKI明确值及跨产品官方OL名册交叉佐证。",
      "跨作品嵌套、移牌、虚拟用牌及回放边界采用明示本作合同，不把本地测试称为源客户端认证。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；共享1v1/1v2、卡牌与装备内核的适配边界见技能说明。身份/主公及其他模式未由本批实现，不删减其整体范围。",
    "source_evidence_note": "当前大陆移动版目录确认完整基础身份技能；手游BWIKI明确体力/性别，官方OL同名对应版本仅交叉印证体力。历史台湾FAQ、旧官方资料与非官方规则镜像按各自来源分层，不混作当前客户端实测。",
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Mobile-focused BWIKI explicit classic field, corroborated by product-scoped official OL hp. Never initial_hp=0.",
      "page_audit": "All visible and hidden inline panels inspected; complete selected identity block only.",
      "copyright": "Paraphrased mechanics; no official artwork or raw fetched articles redistributed."
    },
    "dedup_review": {
      "decision": "do_not_merge",
      "closest": "yxs.adapted.base.hero.bian-que",
      "matching": [
        "HP3",
        "two skills",
        "red H/E off-turn Peach/medicine conversion",
        "own-turn exclusion; off-turn self rescue",
        "H1 discard -> any wounded role recover1"
      ],
      "decisive_difference": "SGS 青囊 is once per PLAY PHASE; official2015 YXS 疗伤 is once per TURN. Two play phases within one turn distinguish the full signatures.",
      "sources": [
        "mobile-huatuo",
        "yxs-bianque"
      ],
      "other": "Original Jianghu healer adds self-heal/kill behavior, also unequal. Normal single-phase equivalence is insufficient."
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "do_not_merge",
        "closest": "yxs.adapted.base.hero.bian-que",
        "matching": [
          "HP3",
          "two skills",
          "red H/E off-turn Peach/medicine conversion",
          "own-turn exclusion; off-turn self rescue",
          "H1 discard -> any wounded role recover1"
        ],
        "decisive_difference": "SGS 青囊 is once per PLAY PHASE; official2015 YXS 疗伤 is once per TURN. Two play phases within one turn distinguish the full signatures.",
        "sources": [
          "mobile-huatuo",
          "yxs-bianque"
        ],
        "other": "Original Jianghu healer adds self-heal/kill behavior, also unequal. Normal single-phase equivalence is insufficient."
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Hidden Guozhan panel contains 急救 ONLY; identity keeps both skills.",
      "Jie171 adds red-cost repeat with target history; excluded.",
      "Current OL standard HP3 corroborates metadata; old once-turn FAQ wording cannot override mobile once-phase text."
    ],
    "portrait_path": "./portraits-sgs-wind/hua-tuo.svg"
  },
  {
    "id": "sgs.adapted.base.hero.cao-ren",
    "name": "曹仁",
    "display_name": "曹仁",
    "max_hp": 4,
    "skill_name": "据守",
    "skill_desc": "据守：结束阶段可摸3张，然后翻面。背面朝上时下次轮到自己翻回正面并跳过整个回合。",
    "skill_ids": [
      "sgs.jushou"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "魏",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "曹仁",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-29.html",
      "https://wiki.biligame.com/msgs/曹仁",
      "https://gltjk.com/sanguosha/rules/card/hero/wei.html",
      "https://g.iqiyi.com/sanguosha/news/321010.html",
      "https://www.sanguosha.com/hero",
      "https://gltjk.com/sanguosha/rules/flow/game.html",
      "https://gltjk.com/sanguosha/rules/glossary/herocard.html"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:29:identity:2026-10-15",
    "source_ids": [
      "mobile-caoren",
      "bwiki-caoren",
      "mirror-wei",
      "iqiyi-wei",
      "ol-roster",
      "mirror-flow",
      "mirror-hero-operation"
    ],
    "aliases": [
      "三国杀曹仁",
      "曹仁·据守"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 29,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-caoren",
        "field": "经典体力4"
      },
      "current_mobile_client_verified": false
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-caoren",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-29.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-caoren",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/曹仁",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:24"
      },
      {
        "id": "mirror-wei",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wei.html",
        "publication_or_revision_date": null
      },
      {
        "id": "iqiyi-wei",
        "tier": "historical_licensed_OL_operator_FAQ",
        "url": "https://g.iqiyi.com/sanguosha/news/321010.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_metadata",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-flow",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/game.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-hero-operation",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/herocard.html",
        "publication_or_revision_date": null
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.jushou",
        "name": "据守",
        "optional": true,
        "timing": "Start of owner end phase, after normal discard.",
        "limit": {
          "count": 1,
          "scope": "this_end_phase_start_event",
          "intrinsic_turn_cap": null
        },
        "cost": "No card/HP cost. Choosing draw commits draw-then-flip sequence.",
        "effect": "Draw3, then toggle owner's general face orientation. Flip is mandatory after choosing the draw.",
        "not_effects": [
          "Not draw4 or draw1.",
          "No hand discard/equip substitution or 解围.",
          "Not merely skip draw/play.",
          "No immediate postdraw hand-limit discard.",
          "No face-up-only activation condition."
        ],
        "ordering": "Finish draw/obtain effects before flip. Stop for game end/dead owner under normal terminal rules; never resurrect or run dead-owner phases.",
        "sources": [
          "mobile-caoren",
          "mirror-wei"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.jushou",
          "name": "据守",
          "optional": true,
          "timing": "Start of owner end phase, after normal discard.",
          "limit": {
            "count": 1,
            "scope": "this_end_phase_start_event",
            "intrinsic_turn_cap": null
          },
          "cost": "No card/HP cost. Choosing draw commits draw-then-flip sequence.",
          "effect": "Draw3, then toggle owner's general face orientation. Flip is mandatory after choosing the draw.",
          "not_effects": [
            "Not draw4 or draw1.",
            "No hand discard/equip substitution or 解围.",
            "Not merely skip draw/play.",
            "No immediate postdraw hand-limit discard.",
            "No face-up-only activation condition."
          ],
          "ordering": "Finish draw/obtain effects before flip. Stop for game end/dead owner under normal terminal rules; never resurrect or run dead-owner phases.",
          "sources": [
            "mobile-caoren",
            "mirror-wei"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "魏",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；公开基础身份目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页没有体力或性别字段；这些字段由手游BWIKI明确值及跨产品官方OL名册交叉佐证。",
      "跨作品嵌套、移牌、虚拟用牌及回放边界采用明示本作合同，不把本地测试称为源客户端认证。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；共享1v1/1v2、卡牌与装备内核的适配边界见技能说明。身份/主公及其他模式未由本批实现，不删减其整体范围。",
    "source_evidence_note": "当前大陆移动版目录确认完整基础身份技能；手游BWIKI明确体力/性别，官方OL同名对应版本仅交叉印证体力。历史台湾FAQ、旧官方资料与非官方规则镜像按各自来源分层，不混作当前客户端实测。",
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Mobile-focused BWIKI explicit classic field, corroborated by product-scoped official OL hp. Never initial_hp=0.",
      "page_audit": "All visible and hidden inline panels inspected; complete selected identity block only.",
      "copyright": "Paraphrased mechanics; no official artwork or raw fetched articles redistributed."
    },
    "dedup_review": {
      "decision": "new_distinct",
      "scope": "Current65 roster + historical33 YXS catalog, not whole current YXS client.",
      "comparators": [
        "勾践 HP3 has conditional discard behavior and off-turn Dodge draw, unequal.",
        "李世民 HP4 has conditional discard skip/target prohibitions, unequal.",
        "陈圆圆 HP3 end draw1 + Duel creation, unequal."
      ],
      "reason": "No observed complete YXS packet has draw3 plus face-toggle/whole-turn-skip."
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "new_distinct",
        "scope": "Current65 roster + historical33 YXS catalog, not whole current YXS client.",
        "comparators": [
          "勾践 HP3 has conditional discard behavior and off-turn Dodge draw, unequal.",
          "李世民 HP4 has conditional discard skip/target prohibitions, unequal.",
          "陈圆圆 HP3 end draw1 + Duel creation, unequal."
        ],
        "reason": "No observed complete YXS packet has draw3 plus face-toggle/whole-turn-skip."
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Mobile29 has identity block only, no Guozhan block on this page.",
      "Jie310 adds draw4, equip substitution and 解围.",
      "Current OL same-name 曹仁 rules differ; HP4 is metadata corroboration only.",
      "2013/2017/2020 reworks and SP/谋 versions are not substitutes."
    ],
    "portrait_path": "./portraits-sgs-wind/cao-ren.svg",
    "flip_contract": {
      "type": "state_toggle",
      "states": [
        "face_up",
        "face_down"
      ],
      "initial": "face_up",
      "next_scheduled_turn": "Before actual turn begins, face-down owner flips face-up and skips the entire turn. No prepare/judgment/draw/play/discard/end phases or those personal triggers; delayed cards remain.",
      "unaffected": [
        "chain orientation",
        "identity/faction/gender",
        "normal responses/off-turn skills",
        "hand/equipment"
      ],
      "double_flip": "A second flip before next scheduled turn restores face-up and naturally removes skip. Never sticky skip_next_turn independent of orientation.",
      "sources": [
        "iqiyi-wei",
        "mirror-flow",
        "mirror-hero-operation"
      ],
      "mode_warning": "Guozhan reveal/conceal and stacked generals are different; face-down does not remove skills."
    }
  },
  {
    "id": "sgs.adapted.base.hero.xia-hou-yuan",
    "name": "夏侯渊",
    "display_name": "夏侯渊",
    "max_hp": 4,
    "skill_name": "神速",
    "skill_desc": "神速：判定前可跳过判定及摸牌；出牌前可弃1装备牌并跳过出牌。每项各视为使用一张无距离限制的杀。",
    "skill_ids": [
      "sgs.shensu"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "魏",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "夏侯渊",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-28.html",
      "https://wiki.biligame.com/msgs/夏侯渊",
      "https://g.iqiyi.com/sanguosha/news/321010.html",
      "https://gltjk.com/sanguosha/rules/flow/game.html",
      "https://gltjk.com/sanguosha/rules/flow/virtual.html",
      "https://www.sanguosha.com/hero"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:28:identity:2026-10-15",
    "source_ids": [
      "mobile-xiahouyuan",
      "bwiki-xiahouyuan",
      "iqiyi-wei",
      "mirror-flow",
      "mirror-virtual",
      "ol-roster"
    ],
    "aliases": [
      "三国杀夏侯渊",
      "夏侯渊·神速"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 28,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-xiahouyuan",
        "field": "经典体力4"
      },
      "current_mobile_client_verified": false
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-xiahouyuan",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-28.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-xiahouyuan",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/夏侯渊",
        "publication_or_revision_date": "2026年1月11日 (星期日) 15:33"
      },
      {
        "id": "iqiyi-wei",
        "tier": "historical_licensed_OL_operator_FAQ",
        "url": "https://g.iqiyi.com/sanguosha/news/321010.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "mirror-flow",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/game.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-virtual",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/virtual.html",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_metadata",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.shensu",
        "name": "神速",
        "optional": true,
        "branches": [
          {
            "id": "1",
            "timing": "Between prepare and judgment, before judgment starts or delayed-card Nullification.",
            "cost": "Skip upcoming judgment AND draw together.",
            "effect": "One zero-material ordinary virtual Slash, distance waived.",
            "remaining": "Play/discard/end normal unless separately skipped.",
            "sources": [
              "mobile-xiahouyuan",
              "mirror-flow",
              "iqiyi-wei"
            ]
          },
          {
            "id": "2",
            "timing": "Before upcoming play phase, after draw if it occurred.",
            "cost": "Skip play and discard one owned equipment-type card from hand or E.",
            "effect": "One zero-material ordinary virtual Slash, distance waived.",
            "remaining": "Discard/end still occur.",
            "sources": [
              "mobile-xiahouyuan",
              "mirror-flow",
              "iqiyi-wei"
            ]
          }
        ],
        "frequency": "One branch choice per genuine eligible phase-replacement window. Both branches can be selected separately at own timings in ordinary turn; no repeat button or invented global once-turn limit.",
        "independent_choice": "May use1 then decline2; decline1 then draw equipment and use2. Do not precommit both at turn start.",
        "targets": "One other living legal Slash target, ally or enemy; ignore distance ONLY. Empty-hand 空城, hard use bans and no self-target still apply. Require legal target before commit.",
        "virtual_identity": {
          "function": "ordinary Slash",
          "materials": [],
          "color": null,
          "suit": null,
          "rank": null,
          "damage_base": 1,
          "nature": "normal",
          "cost_is_damage_material": false
        },
        "quotas": "Outside play, these Slashes do not consume normal play Slash count. Branch1 can be followed by ordinary Slash in genuine play phase. Both are actual card-use events, not response-only events.",
        "equipment": "H/E equipment cost allowed. E removal fires real leave events. Discarded cost is not Slash material and cannot be obtained as damage card by 奸雄. Remaining weapons may trigger normally; Fan may convert to fire. source_last_hand stays false even if cost was last H.",
        "limits": [
          "Base has branches1/2 only; no third discard-skip flip branch.",
          "No off-turn activation.",
          "No non-equipment or judgment-zone cost.",
          "No branch2 if play already skipped by failed Indulgence.",
          "No waiting for delayed-card Nullification failure then choosing1 retroactively.",
          "No artificial hand-count/enemy-only/AI-value restrictions."
        ],
        "ordering": "Choose and validate target/material before commit. Branch2 skip and payment commit once, finish loss effects, then Slash if owner/target remain legal and game continues. No refund of committed cost on lost opportunity.",
        "sources": [
          "mobile-xiahouyuan",
          "iqiyi-wei",
          "mirror-flow",
          "mirror-virtual"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.shensu",
          "name": "神速",
          "optional": true,
          "branches": [
            {
              "id": "1",
              "timing": "Between prepare and judgment, before judgment starts or delayed-card Nullification.",
              "cost": "Skip upcoming judgment AND draw together.",
              "effect": "One zero-material ordinary virtual Slash, distance waived.",
              "remaining": "Play/discard/end normal unless separately skipped.",
              "sources": [
                "mobile-xiahouyuan",
                "mirror-flow",
                "iqiyi-wei"
              ]
            },
            {
              "id": "2",
              "timing": "Before upcoming play phase, after draw if it occurred.",
              "cost": "Skip play and discard one owned equipment-type card from hand or E.",
              "effect": "One zero-material ordinary virtual Slash, distance waived.",
              "remaining": "Discard/end still occur.",
              "sources": [
                "mobile-xiahouyuan",
                "mirror-flow",
                "iqiyi-wei"
              ]
            }
          ],
          "frequency": "One branch choice per genuine eligible phase-replacement window. Both branches can be selected separately at own timings in ordinary turn; no repeat button or invented global once-turn limit.",
          "independent_choice": "May use1 then decline2; decline1 then draw equipment and use2. Do not precommit both at turn start.",
          "targets": "One other living legal Slash target, ally or enemy; ignore distance ONLY. Empty-hand 空城, hard use bans and no self-target still apply. Require legal target before commit.",
          "virtual_identity": {
            "function": "ordinary Slash",
            "materials": [],
            "color": null,
            "suit": null,
            "rank": null,
            "damage_base": 1,
            "nature": "normal",
            "cost_is_damage_material": false
          },
          "quotas": "Outside play, these Slashes do not consume normal play Slash count. Branch1 can be followed by ordinary Slash in genuine play phase. Both are actual card-use events, not response-only events.",
          "equipment": "H/E equipment cost allowed. E removal fires real leave events. Discarded cost is not Slash material and cannot be obtained as damage card by 奸雄. Remaining weapons may trigger normally; Fan may convert to fire. source_last_hand stays false even if cost was last H.",
          "limits": [
            "Base has branches1/2 only; no third discard-skip flip branch.",
            "No off-turn activation.",
            "No non-equipment or judgment-zone cost.",
            "No branch2 if play already skipped by failed Indulgence.",
            "No waiting for delayed-card Nullification failure then choosing1 retroactively.",
            "No artificial hand-count/enemy-only/AI-value restrictions."
          ],
          "ordering": "Choose and validate target/material before commit. Branch2 skip and payment commit once, finish loss effects, then Slash if owner/target remain legal and game continues. No refund of committed cost on lost opportunity.",
          "sources": [
            "mobile-xiahouyuan",
            "iqiyi-wei",
            "mirror-flow",
            "mirror-virtual"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "魏",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；公开基础身份目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页没有体力或性别字段；这些字段由手游BWIKI明确值及跨产品官方OL名册交叉佐证。",
      "跨作品嵌套、移牌、虚拟用牌及回放边界采用明示本作合同，不把本地测试称为源客户端认证。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；共享1v1/1v2、卡牌与装备内核的适配边界见技能说明。身份/主公及其他模式未由本批实现，不删减其整体范围。",
    "source_evidence_note": "当前大陆移动版目录确认完整基础身份技能；手游BWIKI明确体力/性别，官方OL同名对应版本仅交叉印证体力。历史台湾FAQ、旧官方资料与非官方规则镜像按各自来源分层，不混作当前客户端实测。",
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Mobile-focused BWIKI explicit classic field, corroborated by product-scoped official OL hp. Never initial_hp=0.",
      "page_audit": "All visible and hidden inline panels inspected; complete selected identity block only.",
      "copyright": "Paraphrased mechanics; no official artwork or raw fetched articles redistributed."
    },
    "dedup_review": {
      "decision": "new_distinct",
      "scope": "Current roster and historical33 YXS catalog, not whole current client.",
      "comparators": [
        "杨延昭 unlimited play Slash still needs materials and no phase exchange.",
        "澹台名 red-card conversion has material/color/normal play constraints.",
        "秦琼 reactive counter-Slash + guard has different timing and full second skill.",
        "武松 draw-reduction damage boost does not skip phase into virtual Slash."
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "new_distinct",
        "scope": "Current roster and historical33 YXS catalog, not whole current client.",
        "comparators": [
          "杨延昭 unlimited play Slash still needs materials and no phase exchange.",
          "澹台名 red-card conversion has material/color/normal play constraints.",
          "秦琼 reactive counter-Slash + guard has different timing and full second skill.",
          "武松 draw-reduction damage boost does not skip phase into virtual Slash."
        ]
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Base identity and hidden Guozhan share two-branch text; do not infer mode HP/template equivalence.",
      "Jie309 adds skip-discard+flip branch3.",
      "Some OL Jie adds 设变; absent here.",
      "Historical publisher1v1 adds 肃资; Jianghu1v1 player count does not select that separate template."
    ],
    "portrait_path": "./portraits-sgs-wind/xia-hou-yuan.svg"
  },
  {
    "id": "sgs.adapted.base.hero.huang-zhong",
    "name": "黄忠",
    "display_name": "黄忠",
    "max_hp": 4,
    "skill_name": "烈弓",
    "skill_desc": "烈弓：自己出牌阶段的杀指定目标后，若目标手牌数≥自己的体力或≤攻击范围，可令该目标不能用闪响应此杀。",
    "skill_ids": [
      "sgs.liegong"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "蜀",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "黄忠",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-26.html",
      "https://wiki.biligame.com/msgs/黄忠",
      "https://g.iqiyi.com/sanguosha/news/321009.html",
      "https://gltjk.com/sanguosha/rules/card/hero/shu.html",
      "https://www.sanguosha.com/hero",
      "https://g.iqiyi.com/sanguosha/news/321006.html",
      "https://sanguosha.fandom.com/zh/wiki/%E9%BB%84%E5%BF%A0?variant=zh-cn",
      "https://news.7k7k.com/sgs/djt/2012/0307/161604.html"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:26:identity:2026-10-15",
    "source_ids": [
      "mobile-huangzhong",
      "bwiki-huangzhong",
      "iqiyi-shu",
      "mirror-shu",
      "ol-roster",
      "iqiyi-tricks",
      "community-huangzhong-faq",
      "7k7k-equipment-historical"
    ],
    "aliases": [
      "三国杀黄忠",
      "黄忠·烈弓"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 61,
        "extend": "风林火山",
        "hp_field": 4,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-huangzhong",
        "field": "经典体力4"
      },
      "current_mobile_client_verified": false
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-huangzhong",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-26.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-huangzhong",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/黄忠",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:31"
      },
      {
        "id": "iqiyi-shu",
        "tier": "historical_licensed_OL_operator_FAQ",
        "url": "https://g.iqiyi.com/sanguosha/news/321009.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-shu",
        "tier": "secondary_historical_rules_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/shu.html",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_metadata",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "iqiyi-tricks",
        "tier": "historical_licensed_OL_operator_FAQ",
        "url": "https://g.iqiyi.com/sanguosha/news/321006.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "community-huangzhong-faq",
        "tier": "secondary_historical_version_separated_community_FAQ",
        "url": "https://sanguosha.fandom.com/zh/wiki/%E9%BB%84%E5%BF%A0?variant=zh-cn",
        "publication_or_revision_date": null
      },
      {
        "id": "7k7k-equipment-historical",
        "tier": "secondary_historical_game_portal_rule_guide",
        "url": "https://news.7k7k.com/sgs/djt/2012/0307/161604.html",
        "publication_or_revision_date": "2012-03-07"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.liegong",
        "name": "烈弓",
        "optional": true,
        "timing": "Owner uses Slash within owner's play phase; after target designation before response. Forced Slash in that phase qualifies; response-only Slash does not.",
        "condition": {
          "expression": "target.hand_count >= owner.current_hp OR target.hand_count <= owner.attack_range",
          "comparison": "inclusive OR",
          "owner_hand_count_relevant": false,
          "target_hp_relevant": false,
          "owner_max_hp_used": false
        },
        "effect": "This target cannot use Dodge against this Slash.",
        "frequency": "No turn/phase cap; one optional decision per designated target per Slash.",
        "snapshot": "Store branch ID as well as target ID, hand count, owner currentHP, attack range, eligibility and choice. Finish all surviving branches' decisions before any response/damage. Multiple Liuli branches can address the same role and remain distinct. Later hand/HP/weapon changes or source death never alter stored branch decisions.",
        "range": "Attack range, normally1 or effective weapon/skill value. Horse distance changes do not change this threshold; waive-distance does not mean infinite attack range.",
        "not_effects": [
          "No bonus damage or rank-distance target extension.",
          "No unconditional auto-hit.",
          "No removing Renwang/Tengjia immunity or other prevention.",
          "Only Dodge prohibition, not all-response prohibition.",
          "No own-outside-play activation; another-turn Collateral Slash cannot qualify."
        ],
        "responses": "Blocks physical/conversion/Bagua/Yuruyi virtual Dodge; no successful-Dodge trigger. Other immunity/prevention remains.",
        "sources": [
          "mobile-huangzhong",
          "iqiyi-shu",
          "iqiyi-tricks",
          "mirror-shu"
        ],
        "historical_equipment_order": {
          "contract": "Resolve 流离 first, then Liegong on the replacement role; freeze Liegong before 雌雄双股剑 discard/draw. Later dual-sword hand changes do not re-evaluate Liegong.",
          "sources": [
            "community-huangzhong-faq",
            "7k7k-equipment-historical"
          ],
          "confidence": "explicit historical secondary crosscheck; no current client execution",
          "kernel_warning": "Current equipment_before_sha precedes on_sha_target in each branch; placing Liegong only in that callback produces wrong historical ordering."
        }
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.liegong",
          "name": "烈弓",
          "optional": true,
          "timing": "Owner uses Slash within owner's play phase; after target designation before response. Forced Slash in that phase qualifies; response-only Slash does not.",
          "condition": {
            "expression": "target.hand_count >= owner.current_hp OR target.hand_count <= owner.attack_range",
            "comparison": "inclusive OR",
            "owner_hand_count_relevant": false,
            "target_hp_relevant": false,
            "owner_max_hp_used": false
          },
          "effect": "This target cannot use Dodge against this Slash.",
          "frequency": "No turn/phase cap; one optional decision per designated target per Slash.",
          "snapshot": "Store branch ID as well as target ID, hand count, owner currentHP, attack range, eligibility and choice. Finish all surviving branches' decisions before any response/damage. Multiple Liuli branches can address the same role and remain distinct. Later hand/HP/weapon changes or source death never alter stored branch decisions.",
          "range": "Attack range, normally1 or effective weapon/skill value. Horse distance changes do not change this threshold; waive-distance does not mean infinite attack range.",
          "not_effects": [
            "No bonus damage or rank-distance target extension.",
            "No unconditional auto-hit.",
            "No removing Renwang/Tengjia immunity or other prevention.",
            "Only Dodge prohibition, not all-response prohibition.",
            "No own-outside-play activation; another-turn Collateral Slash cannot qualify."
          ],
          "responses": "Blocks physical/conversion/Bagua/Yuruyi virtual Dodge; no successful-Dodge trigger. Other immunity/prevention remains.",
          "sources": [
            "mobile-huangzhong",
            "iqiyi-shu",
            "iqiyi-tricks",
            "mirror-shu"
          ],
          "historical_equipment_order": {
            "contract": "Resolve 流离 first, then Liegong on the replacement role; freeze Liegong before 雌雄双股剑 discard/draw. Later dual-sword hand changes do not re-evaluate Liegong.",
            "sources": [
              "community-huangzhong-faq",
              "7k7k-equipment-historical"
            ],
            "confidence": "explicit historical secondary crosscheck; no current client execution",
            "kernel_warning": "Current equipment_before_sha precedes on_sha_target in each branch; placing Liegong only in that callback produces wrong historical ordering."
          }
        }
      ]
    },
    "source_identity_context": {
      "faction": "蜀",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_unknowns": [
      "未实测2026当前大陆移动版客户端；公开基础身份目录与历史FAQ不能证明当前可执行全细则。",
      "大陆移动版详情页没有体力或性别字段；这些字段由手游BWIKI明确值及跨产品官方OL名册交叉佐证。",
      "跨作品嵌套、移牌、虚拟用牌及回放边界采用明示本作合同，不把本地测试称为源客户端认证。"
    ],
    "adaptation_notes": "完整基础身份技能按稳定来源ID独立接入；共享1v1/1v2、卡牌与装备内核的适配边界见技能说明。身份/主公及其他模式未由本批实现，不删减其整体范围。",
    "source_evidence_note": "当前大陆移动版目录确认完整基础身份技能；手游BWIKI明确体力/性别，官方OL同名对应版本仅交叉印证体力。历史台湾FAQ、旧官方资料与非官方规则镜像按各自来源分层，不混作当前客户端实测。",
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Mobile-focused BWIKI explicit classic field, corroborated by product-scoped official OL hp. Never initial_hp=0.",
      "page_audit": "All visible and hidden inline panels inspected; complete selected identity block only.",
      "copyright": "Paraphrased mechanics; no official artwork or raw fetched articles redistributed."
    },
    "dedup_review": {
      "decision": "new_distinct",
      "scope": "Current roster/historical33 YXS catalog plus original 荆轲 checked.",
      "comparators": [
        "YXS项羽 HP4 requires two Dodges, not this threshold-based prohibition.",
        "YXS铁木真 distance+postdamage theft differs.",
        "Original荆轲 HP4 compares targetHP versus ownerH and adds double-Dodge condition, unequal full package.",
        "MaChao铁骑 requires judgment and has 马术; shared Dodge blocking not full equality."
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "decision": "new_distinct",
        "scope": "Current roster/historical33 YXS catalog plus original 荆轲 checked.",
        "comparators": [
          "YXS项羽 HP4 requires two Dodges, not this threshold-based prohibition.",
          "YXS铁木真 distance+postdamage theft differs.",
          "Original荆轲 HP4 compares targetHP versus ownerH and adds double-Dodge condition, unequal full package.",
          "MaChao铁骑 requires judgment and has 马术; shared Dodge blocking not full equality."
        ]
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Mobile26 base two target-hand thresholds + own-play timing; Jie307 has owner-hand/target-hand and HP comparisons, damage bonus and rank distance.",
      "OL base 黄忠 is gid61; OL gid26 is 界黄忠. Numeric IDs are product scoped.",
      "Historical publisher1v1 removes attack-range arm; do not apply that merely because Jianghu has1v1.",
      "Hidden Guozhan matches skill text only, not entire mode template."
    ],
    "portrait_path": "./portraits-sgs-wind/huang-zhong.svg"
  }
];
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const SGS_WIND_DEFINITIONS=freeze(definitions);
