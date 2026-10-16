/** Historical 2023-12-07 mobile 王允 metadata. Source verification is not implementation acceptance. */
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const WANGYUN_HERO_ID="sgs.mobile.hero.wangyun.20231207";
export const WANGYUN_DEFINITIONS=freeze([
  {
    "id": "sgs.mobile.hero.wangyun.20231207",
    "name": "王允",
    "display_name": "王允",
    "max_hp": 3,
    "initial_hp": 3,
    "initial_max_hp": 3,
    "faction": "群",
    "gender": "male",
    "skill_name": "连计 / 谋逞",
    "skill_desc": "连计：每出牌阶段1次，指定两名其他角色，前者使用牌堆武器并对后者视为使用随机指定攻击牌；按前者该牌实际扣血累积标记。谋逞：标记达到3，伤害后立即加1体力上限、回复1，失去连计并获得矜功。",
    "skill_ids": [
      "sgs.mobile.wangyun.lianji",
      "sgs.mobile.wangyun.moucheng"
    ],
    "initial_skill_ids": [
      "sgs.mobile.wangyun.lianji",
      "sgs.mobile.wangyun.moucheng"
    ],
    "acquired_skill_ids": [
      "sgs.mobile.wangyun.jingong"
    ],
    "acquired_skill_names": [
      "矜功"
    ],
    "all_source_skill_ids": [
      "sgs.mobile.wangyun.lianji",
      "sgs.mobile.wangyun.moucheng",
      "sgs.mobile.wangyun.jingong"
    ],
    "source_variant": "mobile-cn-identity-2023-12-07+JH01-JH12",
    "source_game": "三国杀",
    "source_label": "三国杀移动版·2023历史身份版",
    "source_character_name": "王允",
    "source_record_id": "sgs.mobile.hero.wangyun.20231207",
    "source_date": "2023-12-07官方详细攻略；2026-10-15复核公开武将页",
    "historical_rules_date": "2023-12-07",
    "source_snapshot_date": "2026-10-15",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated-tested-historical-reconstruction",
    "source_coverage": false,
    "current_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "source_mode_complete": false,
    "native_exactness_closed": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/guide-info-163.html",
      "https://www.sanguosha.cn/pc/hero-detail-213.html",
      "https://www.sanguosha.cn/pc/guide-info-160.html",
      "https://wiki.biligame.com/msgs/王允"
    ],
    "source_ids": [
      "WY-O",
      "WY-H",
      "WY-D",
      "WY-W",
      "WY-M",
      "WY-FM",
      "WY-MM",
      "WY-MX",
      "WY-NM",
      "WY-NS",
      "WY-OLD",
      "WY-NC"
    ],
    "source_evidence_tiers": [
      {
        "id": "WY-O",
        "url": "https://www.sanguosha.cn/pc/guide-info-163.html",
        "title": "王允武将攻略",
        "tier": "first_party_mobile_guide",
        "publication_or_revision_date": "2023-12-07 14:36:01 China local site time",
        "limitations": [
          "Not a 2026 runtime trace",
          "Not a comprehensive timing rulebook",
          "美人计 prose has 一种 likely typo",
          "Strategic prose says 杀或武器 although formal skill says 杀或装备; use formal general equipment wording"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-H",
        "url": "https://www.sanguosha.cn/pc/hero-detail-213.html",
        "title": "Current public mobile 王允 hero entry",
        "tier": "first_party_mobile_hero",
        "publication_or_revision_date": null,
        "limitations": [
          "Gender and HP not explicit in text",
          "Acquired 矜功 only parenthetical summary",
          "Hidden conversion omitted, not evidence of removal",
          "Omitted source==card-user clause, more precise WY-O controls"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-D",
        "url": "https://www.sanguosha.cn/pc/guide-info-160.html",
        "title": "界沮授渐营攻略",
        "tier": "first_party_mobile_deck_guide",
        "publication_or_revision_date": "2023-12-07 14:20:23 China local site time",
        "limitations": [
          "Explicitly excludes special tricks including 奇正相生 and 调剂盐梅",
          "Not itself a 矜功 sampling table; exact 11 names are cross-source reconstruction with WY-O"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-W",
        "url": "https://wiki.biligame.com/msgs/王允",
        "title": "Mobile BWIKI 王允",
        "tier": "secondary_mobile_specific",
        "publication_or_revision_date": "2024-04-15",
        "limitations": [
          "50% 七宝 shortcut conflicts with preferred first-party guide",
          "逐鹿/草船借箭 FAQ may be cross-product inherited; does not prove mobile mode inclusion"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-M",
        "url": "https://moegirl.uk/三国杀:王允",
        "title": "Moegirl mirror 王允, mobile 2019 section",
        "tier": "secondary_mixed_products_editor_rewrite",
        "publication_or_revision_date": "2025-06-05",
        "limitations": [
          "Footnote 3 explicitly says this rule-like rewrite is not in official rulebook and may be wrong",
          "矜功 rewrite permits any hand card, contradicting formal 杀/装备 material filter; cannot treat rewrite as official or decisive",
          "Do not import invented 连/环 mark names as separate rule mechanics"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-FM",
        "url": "https://sanguosha.fandom.com/zh/wiki/美人计?variant=zh-hans",
        "title": "Fandom 美人计",
        "tier": "secondary_cross_product_card",
        "publication_or_revision_date": null,
        "limitations": [
          "Physical SP publication context, not independent mobile client proof"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-MM",
        "url": "https://moegirl.uk/index.php?title=三国杀:美人计&variant=zh-cn",
        "title": "Moegirl mirror 美人计",
        "tier": "secondary_cross_product_card",
        "publication_or_revision_date": null,
        "limitations": [
          "Not independently authoritative mobile scheduler",
          "Footnote explicitly says the formal rule-like wording is editor-authored and may contain errors; primary core text controls."
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-MX",
        "url": "https://moegirl.uk/三国杀:笑里藏刀",
        "title": "Moegirl mirror 笑里藏刀",
        "tier": "secondary_cross_product_card",
        "publication_or_revision_date": null,
        "limitations": [
          "No native material of its own; conversion material needs separate identity",
          "Not mobile runtime",
          "Footnote explicitly says the formal rule-like wording is editor-authored and may contain errors; primary core text controls."
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-NM",
        "url": "https://github.com/libccy/noname/blob/e18a8256e01ab1357e4c7472349dceb3d0aa1a3a/character/mobile/skill.js#L16078-L16186",
        "title": "Noname mobile relianji/remoucheng code",
        "tier": "tertiary_independent_reimplementation",
        "publication_or_revision_date": null,
        "limitations": [
          "Has 50% 青釭 priority path and counts damage events by ++, conflicting with official actual-HP points",
          "Not a Yoka client; cannot close native gaps"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-NS",
        "url": "https://github.com/libccy/noname/blob/e18a8256e01ab1357e4c7472349dceb3d0aa1a3a/character/sp/skill.js#L20466-L20547",
        "title": "Noname jingong code",
        "tier": "tertiary_independent_reimplementation",
        "publication_or_revision_date": null,
        "limitations": [
          "Uses hes and its own trick catalogue; not official mobile allowed zones/pool proof",
          "No source code copied into game"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-OLD",
        "url": "https://www.boxuu.com/articles/c/508238.html",
        "title": "Old reset-on-reshuffle claim",
        "tier": "secondary_historical_conflict",
        "publication_or_revision_date": "2020-09-09",
        "limitations": [
          "Reviewed through prior source packet; directly contradicted by WY-O permanent persistence"
        ],
        "current_client_verified": false
      },
      {
        "id": "WY-NC",
        "url": "https://github.com/libccy/noname/blob/e18a8256e01ab1357e4c7472349dceb3d0aa1a3a/character/sp/card.js",
        "title": "Noname exclusive trick card implementations",
        "tier": "tertiary_independent_reimplementation",
        "publication_or_revision_date": null,
        "limitations": [
          "Stops all later female transfers once male target has no hand cards; excludes female user. These are unresolved alternatives to literal all-female core text, not decisive native rules.",
          "Do not copy implementation as source fidelity."
        ],
        "current_client_verified": false
      }
    ],
    "source_evidence_note": "2023-12-07大陆移动版官方王允攻略确认3体力、三项技能、专属锦囊及七宝刀主干；当前公开武将页仅交叉确认身份与初始技能。男性由移动BWIKI明确字段佐证。普通11种候选由同日官方牌堆资料重构。未实测2026当前客户端；JH01–JH12是公开的本作边界裁定。",
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": true,
      "method": "first_party_mobile_guide_explicit_hp",
      "source_id": "WY-O",
      "url": "https://www.sanguosha.cn/pc/guide-info-163.html",
      "publication_date": "2023-12-07",
      "display_note": "体力3：2023-12-07移动版官方王允攻略明确；2026当前客户端体力未核验。",
      "current_mobile_client_verified": false
    },
    "gender_provenance": "secondary_mobile_specific_BWIKI_explicit_male_field",
    "gender_evidence": {
      "value": "male",
      "source_ids": [
        "WY-W",
        "WY-M"
      ],
      "inferred_from_portrait": false
    },
    "source_identity_context": {
      "faction": "群",
      "personal_lord_skills": [],
      "lord_skill_from_shared_mode": null
    },
    "source_skill_rules": [
      {
        "id": "sgs.mobile.wangyun.lianji",
        "sources": [
          "WY-O",
          "WY-H"
        ],
        "trigger": "own_play_phase_idle",
        "activation": "optional active skill",
        "limit": {
          "count": 1,
          "scope": "play_phase_instance",
          "not": "once for entire game or generic round"
        },
        "cost": {
          "cards": 0,
          "hp": 0,
          "note": "Do NOT import OL/十周年 discard or given 杀/black trick."
        },
        "selection": {
          "chooser": "W",
          "count": 2,
          "ordered": true,
          "targets": "two distinct living characters other than W",
          "first": "A = weapon/card user",
          "second": "B = mandated attack target",
          "self_allowed": false,
          "same_character_twice": false,
          "one_v_one_available": false
        },
        "sequence": [
          {
            "step": 1,
            "action": "select ordered A, B and commit phase-use receipt"
          },
          {
            "step": 2,
            "action": "randomly select one physical weapon in current draw pile for A to USE; if canonical 青釭剑 selected, permanently transform its rule identity into 七宝刀 before using",
            "equipment_use_actor": "A",
            "acquisition_owner": "A upon equip resolution",
            "not": "W gift / merely set slot / acquire into hand first / create extra deck copy"
          },
          {
            "step": 3,
            "action": "A is treated as using one randomly selected listed card name",
            "names": [
              "决斗",
              "火攻",
              "南蛮入侵",
              "万箭齐发",
              "普通杀"
            ],
            "material_cards": [],
            "card_user": "A",
            "skill_initiator": "W",
            "target": "B unless AOE, which expands to all other legal characters including W",
            "ordinary_card_response_windows": true
          },
          {
            "step": 4,
            "action": "for each qualifying card-caused damage event, add actual positive HP debit to W marks only if actual damage source is A",
            "not_count": [
              "armor-only debit",
              "prevented damage",
              "unrelated HP loss",
              "damage sourced from B on duel loss",
              "independent triggered skill damage under JH08"
            ]
          },
          {
            "step": 5,
            "action": "after each damage event recheck 谋逞 before next target/effect; already committed card resolution continues after awakening"
          }
        ],
        "forced_card_details": {
          "普通杀": {
            "material_cost": 0,
            "nature": "normal before any legitimate A weapon conversion",
            "responses": "B responds 闪; A own use/damage skills and equipped weapon apply",
            "quota_policy": "JH03"
          },
          "决斗": {
            "first_responder": "B",
            "response_owner": "current duelling participant",
            "damage_source": "the participant who wins, not necessarily A",
            "marks": "only if winning source == A"
          },
          "火攻": {
            "show_card_actor": "B",
            "same_suit_discard_actor": "A",
            "discard_material": "A own matching-suit hand card",
            "mandatory_damage": false,
            "note": "The virtual fire-attack has no material, but its normal later discard cost still belongs to A; W cannot pay it."
          },
          "南蛮入侵": {
            "card_user": "A",
            "targets": "all other legal living characters, not B only",
            "responses": "each target responds 杀",
            "source_replacement": "retain actual source rules; if source changes away from A no 连计 marks"
          },
          "万箭齐发": {
            "card_user": "A",
            "targets": "all other legal living characters",
            "responses": "each target responds 闪"
          }
        },
        "no_temporary_weapon_return": true,
        "weapon_stays_with_A_until_ordinary_movement": true,
        "virtual_card_recoverable_by_jianxiong": false,
        "failure_rng_range_policies": [
          "JH02",
          "JH03",
          "JH04",
          "JH08"
        ],
        "native_edge_gaps": [
          "G01",
          "G03",
          "G04",
          "G08"
        ],
        "name": "连计",
        "initial": true
      },
      {
        "id": "sgs.mobile.wangyun.moucheng",
        "sources": [
          "WY-O",
          "WY-H"
        ],
        "kind": "awakening, compulsory when legal trigger reached, once per game",
        "trigger": "after a character causes damage",
        "condition": "W has more than 2 连计 marks and has not awakened",
        "threshold": 3,
        "counts": "cumulative actual HP debit from qualifying 连计 damage, not number of skill activations, targets or damage events",
        "marks_can_overshoot": true,
        "sequence": [
          "mark awakening receipt before callbacks for replay safety",
          "increase current max HP by 1",
          "recover 1 HP using normal recovery rules",
          "remove 连计 from active skill set",
          "acquire complete 矜功"
        ],
        "no_forced_set_to_four_hp": true,
        "do_not_wait_for": [
          "next turn preparation",
          "end of current multi-target card",
          "exactly three marks"
        ],
        "remove_moucheng_or_marks": "Not specified; keep once-used awakening history/inert skill metadata; do not invent mark-consumption rule.",
        "same_play_phase_jingong": "Allowed by normal gained-skill availability if phase continues; engineering interpretation, not current-client trace",
        "native_edge_gaps": [
          "G08",
          "G10"
        ],
        "name": "谋逞",
        "initial": true
      },
      {
        "id": "sgs.mobile.wangyun.jingong",
        "sources": [
          "WY-O",
          "WY-H",
          "WY-W"
        ],
        "availability": "only after gained, including through host skill-copy if its rules permit",
        "trigger": "own_play_phase_idle",
        "activation": "optional view-as use",
        "limit": {
          "count": 1,
          "scope": "actual_play_phase_instance"
        },
        "cost": {
          "material_count": 1,
          "material_kinds": [
            "equipment of any subtype",
            "杀"
          ],
          "material_zones_native_exact": null,
          "local_material_zones": [
            "hand",
            "own equipped slot"
          ],
          "material_zone_policy": "JH05",
          "no_extra_discard_cost": true,
          "not_allowed": "arbitrary hand card, another player card, judgment card"
        },
        "menu": {
          "offered_count": 3,
          "ordinary_count": 2,
          "exclusive_count": 1,
          "ordinary_pool_names": [
            "过河拆桥",
            "顺手牵羊",
            "无中生有",
            "决斗",
            "借刀杀人",
            "南蛮入侵",
            "万箭齐发",
            "五谷丰登",
            "桃园结义",
            "火攻",
            "铁索连环"
          ],
          "ordinary_pool_size": 11,
          "excluded": [
            "无懈可击",
            "乐不思蜀",
            "兵粮寸断",
            "闪电",
            "all special/mode/derived/other-game tricks unless separately sourced edition"
          ],
          "exclusive_pool": [
            "美人计",
            "笑里藏刀"
          ],
          "pool_evidence": "11-count and 无懈 exclusion WY-O + exact name reconstruction from WY-D base+军争 inventory",
          "weights_native_verified": false,
          "duplicate_sampling_native_verified": false,
          "optional_expansion_pool_native_verified": false,
          "menu_generation_timing_native_verified": false,
          "local_policy": "JH01/JH02"
        },
        "use": {
          "user": "W",
          "target_legality": "chosen ordinary trick own target rules, no automatic distance bypass",
          "respond_available": false,
          "recast_policy": "no recast under JH10",
          "physical_materials_retained": true,
          "inherits_material_suit_rank": "normal one-material view-as identity; corroborated historical cross-product references; not permanent trick identity",
          "jianxiong_obtains": "underlying 杀/equipment material if normally available, not a fabricated exclusive trick entity"
        },
        "late_cost": {
          "when": "this turn end stage",
          "condition": "skill actually used and W caused no damage anywhere this turn",
          "effect": "W loses 1 HP, not damage",
          "counts_prior_turn_damage": false,
          "counts_damage_before_skill_this_turn": true,
          "counts_other_actor_lianji_damage": false,
          "damage_not_hp_debit_metric": "Unlike 连计 marks, condition is caused damage. Preserve separate damageOccurred and hpDeducted fields when armor/shield systems exist.",
          "native_special_stage_semantics": null,
          "local_policy": "JH09"
        },
        "native_edge_gaps": [
          "G01",
          "G02",
          "G05",
          "G07"
        ],
        "name": "矜功",
        "initial": false
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "male",
      "faction": "群",
      "initial_skill_ids": [
        "sgs.mobile.wangyun.lianji",
        "sgs.mobile.wangyun.moucheng"
      ],
      "acquired_skill_ids": [
        "sgs.mobile.wangyun.jingong"
      ],
      "skills": [
        {
          "id": "sgs.mobile.wangyun.lianji",
          "sources": [
            "WY-O",
            "WY-H"
          ],
          "trigger": "own_play_phase_idle",
          "activation": "optional active skill",
          "limit": {
            "count": 1,
            "scope": "play_phase_instance",
            "not": "once for entire game or generic round"
          },
          "cost": {
            "cards": 0,
            "hp": 0,
            "note": "Do NOT import OL/十周年 discard or given 杀/black trick."
          },
          "selection": {
            "chooser": "W",
            "count": 2,
            "ordered": true,
            "targets": "two distinct living characters other than W",
            "first": "A = weapon/card user",
            "second": "B = mandated attack target",
            "self_allowed": false,
            "same_character_twice": false,
            "one_v_one_available": false
          },
          "sequence": [
            {
              "step": 1,
              "action": "select ordered A, B and commit phase-use receipt"
            },
            {
              "step": 2,
              "action": "randomly select one physical weapon in current draw pile for A to USE; if canonical 青釭剑 selected, permanently transform its rule identity into 七宝刀 before using",
              "equipment_use_actor": "A",
              "acquisition_owner": "A upon equip resolution",
              "not": "W gift / merely set slot / acquire into hand first / create extra deck copy"
            },
            {
              "step": 3,
              "action": "A is treated as using one randomly selected listed card name",
              "names": [
                "决斗",
                "火攻",
                "南蛮入侵",
                "万箭齐发",
                "普通杀"
              ],
              "material_cards": [],
              "card_user": "A",
              "skill_initiator": "W",
              "target": "B unless AOE, which expands to all other legal characters including W",
              "ordinary_card_response_windows": true
            },
            {
              "step": 4,
              "action": "for each qualifying card-caused damage event, add actual positive HP debit to W marks only if actual damage source is A",
              "not_count": [
                "armor-only debit",
                "prevented damage",
                "unrelated HP loss",
                "damage sourced from B on duel loss",
                "independent triggered skill damage under JH08"
              ]
            },
            {
              "step": 5,
              "action": "after each damage event recheck 谋逞 before next target/effect; already committed card resolution continues after awakening"
            }
          ],
          "forced_card_details": {
            "普通杀": {
              "material_cost": 0,
              "nature": "normal before any legitimate A weapon conversion",
              "responses": "B responds 闪; A own use/damage skills and equipped weapon apply",
              "quota_policy": "JH03"
            },
            "决斗": {
              "first_responder": "B",
              "response_owner": "current duelling participant",
              "damage_source": "the participant who wins, not necessarily A",
              "marks": "only if winning source == A"
            },
            "火攻": {
              "show_card_actor": "B",
              "same_suit_discard_actor": "A",
              "discard_material": "A own matching-suit hand card",
              "mandatory_damage": false,
              "note": "The virtual fire-attack has no material, but its normal later discard cost still belongs to A; W cannot pay it."
            },
            "南蛮入侵": {
              "card_user": "A",
              "targets": "all other legal living characters, not B only",
              "responses": "each target responds 杀",
              "source_replacement": "retain actual source rules; if source changes away from A no 连计 marks"
            },
            "万箭齐发": {
              "card_user": "A",
              "targets": "all other legal living characters",
              "responses": "each target responds 闪"
            }
          },
          "no_temporary_weapon_return": true,
          "weapon_stays_with_A_until_ordinary_movement": true,
          "virtual_card_recoverable_by_jianxiong": false,
          "failure_rng_range_policies": [
            "JH02",
            "JH03",
            "JH04",
            "JH08"
          ],
          "native_edge_gaps": [
            "G01",
            "G03",
            "G04",
            "G08"
          ]
        },
        {
          "id": "sgs.mobile.wangyun.moucheng",
          "sources": [
            "WY-O",
            "WY-H"
          ],
          "kind": "awakening, compulsory when legal trigger reached, once per game",
          "trigger": "after a character causes damage",
          "condition": "W has more than 2 连计 marks and has not awakened",
          "threshold": 3,
          "counts": "cumulative actual HP debit from qualifying 连计 damage, not number of skill activations, targets or damage events",
          "marks_can_overshoot": true,
          "sequence": [
            "mark awakening receipt before callbacks for replay safety",
            "increase current max HP by 1",
            "recover 1 HP using normal recovery rules",
            "remove 连计 from active skill set",
            "acquire complete 矜功"
          ],
          "no_forced_set_to_four_hp": true,
          "do_not_wait_for": [
            "next turn preparation",
            "end of current multi-target card",
            "exactly three marks"
          ],
          "remove_moucheng_or_marks": "Not specified; keep once-used awakening history/inert skill metadata; do not invent mark-consumption rule.",
          "same_play_phase_jingong": "Allowed by normal gained-skill availability if phase continues; engineering interpretation, not current-client trace",
          "native_edge_gaps": [
            "G08",
            "G10"
          ]
        },
        {
          "id": "sgs.mobile.wangyun.jingong",
          "sources": [
            "WY-O",
            "WY-H",
            "WY-W"
          ],
          "availability": "only after gained, including through host skill-copy if its rules permit",
          "trigger": "own_play_phase_idle",
          "activation": "optional view-as use",
          "limit": {
            "count": 1,
            "scope": "actual_play_phase_instance"
          },
          "cost": {
            "material_count": 1,
            "material_kinds": [
              "equipment of any subtype",
              "杀"
            ],
            "material_zones_native_exact": null,
            "local_material_zones": [
              "hand",
              "own equipped slot"
            ],
            "material_zone_policy": "JH05",
            "no_extra_discard_cost": true,
            "not_allowed": "arbitrary hand card, another player card, judgment card"
          },
          "menu": {
            "offered_count": 3,
            "ordinary_count": 2,
            "exclusive_count": 1,
            "ordinary_pool_names": [
              "过河拆桥",
              "顺手牵羊",
              "无中生有",
              "决斗",
              "借刀杀人",
              "南蛮入侵",
              "万箭齐发",
              "五谷丰登",
              "桃园结义",
              "火攻",
              "铁索连环"
            ],
            "ordinary_pool_size": 11,
            "excluded": [
              "无懈可击",
              "乐不思蜀",
              "兵粮寸断",
              "闪电",
              "all special/mode/derived/other-game tricks unless separately sourced edition"
            ],
            "exclusive_pool": [
              "美人计",
              "笑里藏刀"
            ],
            "pool_evidence": "11-count and 无懈 exclusion WY-O + exact name reconstruction from WY-D base+军争 inventory",
            "weights_native_verified": false,
            "duplicate_sampling_native_verified": false,
            "optional_expansion_pool_native_verified": false,
            "menu_generation_timing_native_verified": false,
            "local_policy": "JH01/JH02"
          },
          "use": {
            "user": "W",
            "target_legality": "chosen ordinary trick own target rules, no automatic distance bypass",
            "respond_available": false,
            "recast_policy": "no recast under JH10",
            "physical_materials_retained": true,
            "inherits_material_suit_rank": "normal one-material view-as identity; corroborated historical cross-product references; not permanent trick identity",
            "jianxiong_obtains": "underlying 杀/equipment material if normally available, not a fabricated exclusive trick entity"
          },
          "late_cost": {
            "when": "this turn end stage",
            "condition": "skill actually used and W caused no damage anywhere this turn",
            "effect": "W loses 1 HP, not damage",
            "counts_prior_turn_damage": false,
            "counts_damage_before_skill_this_turn": true,
            "counts_other_actor_lianji_damage": false,
            "damage_not_hp_debit_metric": "Unlike 连计 marks, condition is caused damage. Preserve separate damageOccurred and hpDeducted fields when armor/shield systems exist.",
            "native_special_stage_semantics": null,
            "local_policy": "JH09"
          },
          "native_edge_gaps": [
            "G01",
            "G02",
            "G05",
            "G07"
          ]
        }
      ],
      "dependent_trick_ids": [
        "sgs.mobile.wangyun.meirenji",
        "sgs.mobile.wangyun.xiaolicangdao"
      ],
      "dependent_equipment_ids": [
        "sgs.mobile.equipment.qibao.20231207"
      ]
    },
    "local_policies": [
      {
        "id": "JH01",
        "topic": "Edition and candidate catalogue",
        "decision": "Pin official 2023-12-07 base mobile kit. Use exactly the 11 listed standard+军争 ordinary tricks for 矜功 plus one of the 2 exclusive tricks. Do not broaden to arbitrary enabled 江湖, 用间, 国战, OL or derived tricks. Catalogue selection is independent of remaining physical copies.",
        "evidence": "Cross-source reconstruction WY-O+WY-D; deliberate closed local edition boundary",
        "native_exact": false,
        "display_topic": "版本与候选池",
        "display_decision": "固定2023-12-07移动版身份规则；矜功普通候选严格使用下列11名，专属仅美人计、笑里藏刀。候选不依赖牌堆剩余副本，不混入其他模式、扩展或英雄杀锦囊。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH02",
        "topic": "Randomness and stable menu",
        "decision": "Use saved seeded RNG, uniform over eligible physical draw-pile weapon entities; filter five attack names for legality then sample uniformly. 矜功 offers two DISTINCT base names without replacement and one uniform special name; cache per actual play-phase instance, including reopen/cancel/save-load. Grey out illegal choices without rerolling the menu.",
        "evidence": "Recommended deterministic local policy; distributions and refresh timing not documented by primary sources",
        "native_exact": false,
        "display_topic": "随机与固定菜单",
        "display_decision": "存档保存随机状态。对当前牌堆合法武器实体均匀抽取；连计五牌先筛合法再均匀抽名。矜功抽2个不同普通名和1个专属名，每真实出牌阶段固定，重开、取消、读档不重抽；失去合法目标的选项置灰。概率及刷新时机并非官方实测。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH03",
        "topic": "Forced attack legality and counters",
        "decision": "B is mandatory primary target. Exempt B from attack-distance checking for the forced normal 杀, but keep prohibitions and card-specific prerequisites. Expanded secondary targets use their normal distance rules. Do not charge Wangyun or A an ordinary own-play 杀 quota. A must not spend a physical 杀. If no legal name remains, finish without substitute damage or refund.",
        "evidence": "WY-M editor interpretation + WY-NM independent behavior; declared host policy, not official scheduler proof",
        "native_exact": false,
        "display_topic": "连计目标与杀额度",
        "display_decision": "B为强制主要目标。连计普通杀只对B免距离，保留用牌禁令与各牌前提；扩展的其他杀目标照常检查距离。不花实体杀，不占A或王允主动杀次数；没有合法牌名时结束，不补伤害、不退已提交次数。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH04",
        "topic": "Weapon search and failed use",
        "decision": "Search current draw pile only. Do not automatically search discard/hand/equipment/offboard or reshuffle solely to find a weapon. If no usable weapon exists or A weapon slot is abolished, skip the weapon and continue attack if A/B remain alive. Use selected weapon directly from deck through processing to equipment, no invented hand gain. Revalidate after callbacks; no duplicate/replacement reroll on failure.",
        "evidence": "Draw-pile-only is literal WY-O; absent/abolished continuation is tertiary-supported host policy",
        "native_exact": false,
        "display_topic": "牌堆武器与失败",
        "display_decision": "只搜索当前摸牌堆，不为找武器主动洗牌、不搜弃牌或其他区域。无可用武器或武器栏废除时跳过装备，A/B仍存活则继续攻击。武器直接从牌堆经处理区使用到装备区，不能凭空先入手；失败不重抽或复制。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH05",
        "topic": "Conversion material zones",
        "decision": "Allow one owned physical 杀-family or equipment from hand or occupied equipment slot, subject to material-use prohibitions; exclude judgment, other players, unavailable private piles. Preserve suit/rank/material entity. Equipped material leaves through ordinary loss hooks. Never allow arbitrary hand cards or restrict equipment to weapons.",
        "evidence": "Formal WY-O kind filter; hand+equipped interpretation corroborated by WY-NS but native exact zone proof unresolved",
        "native_exact": false,
        "display_topic": "矜功材料区域",
        "display_decision": "允许本人手牌或装备区的一张杀类牌或任意类型装备；仍受材料禁用限制。禁止任意手牌、判定牌、别人的牌及未开放私有牌堆。保留实体、有效花色点数，装备材料照常离区并触发失牌效果。此区域范围是本作明示裁定。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH06",
        "topic": "Exclusive-trick sequence",
        "decision": "At 美人计 effect start, snapshot living female participants in normal active-turn action order, using effective rule gender; each still-living participant sequentially obtains one hidden hand card when available and then gives one currently held hand card to the living user if possible. Giving is attempted even if target hand has emptied. After all participants, compare live user/target current hand counts once. Ties do nothing; no women still permits comparison. Skip dead actors and impossible movements, never manufacture a card. If the effective-female participant is the user (skill copying or gender change), acquisition still happens and the self-give is a no-op; this exceptional mixed-game behavior is deliberately local.",
        "evidence": "Core transfers and final comparison from WY-O+WY-FM; exact empty-hand/death/order scheduling is declared host policy WY-NC instead stops transfers on empty target; unresolved native gap G06 is retained.",
        "native_exact": false,
        "display_topic": "美人计多人顺序",
        "display_decision": "牌效开始按当前行动顺序记录存活、有效规则性别为女性的参与者。每人依次尝试取男性目标1手牌，再交本人当前1手牌给存活使用者；目标已空手仍尝试交牌。跳过死亡或不可能步骤，全部完成后仅比较一次。无女性也比较；女性使用者取牌后给自己为无操作。原生空手停止与否尚未确认。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH07",
        "topic": "Exclusive target and draw timing",
        "decision": "Validate 美人计 other-male-with-hand at declaration; use ordinary target-confirmation/prohibition and 无懈 windows. If target becomes handless during resolution, continue legal remaining effect steps without re-targeting. For 笑里藏刀, evaluate lost HP just before its draw instruction; complete draw triggers before applying one normal damage. No wounded/hand/gender restriction beyond other living target.",
        "evidence": "Core target/effect WY-O; dynamic timing/death behavior local host scheduling",
        "native_exact": false,
        "display_topic": "专属目标与摸牌时点",
        "display_decision": "美人计声明时要求其他男性且有手牌；中途目标空手不另选目标，继续合法剩余步骤。笑里藏刀在摸牌指令前读取已损失体力，摸牌及其触发完成后再造成1点普通伤害；目标不要求受伤、有手牌或特定性别。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH08",
        "topic": "Damage and awakening receipts",
        "decision": "Track each 连计 forced-use ID separately with initiator W and card user A. Add only positive HP debit caused by that use when actual source remains A. Include chain/transfer retaining that causal card use; exclude duel retaliation by B and independent follow-up skill/weapon damage. Process a once-only awakening after each completed damage event before next AOE target. Do not cancel already committed card resolution when 连计 is removed.",
        "evidence": "Core source/HP/threshold/timing WY-O; chain/transfer and nested-effect attribution are declared causal host policy",
        "native_exact": false,
        "display_topic": "伤害归因与觉醒",
        "display_decision": "每次连计强制用牌单独记ID、王允及使用者A；仅该用牌且实际来源仍是A的正数实际扣血累加标记。同一根用牌的连环/转移算入，决斗反击和独立追加技能/武器伤害不算。每次完整伤害后立即检查一次觉醒；失去连计不取消已提交牌效。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH09",
        "topic": "矜功 end-stage obligation",
        "decision": "Arm a turn-scoped obligation only upon committed 矜功 card use. At first normal end-stage start for that turn, if W caused no positive damage event anywhere that turn, lose 1 HP once. Damage before 矜功 counts. Nullification does not refund use/material or erase obligation. A 连计 damage and damage dealt TO W by 美人计 do not count as W damage. Clear at turn end; if end stage is skipped do not invent a substitute end-turn HP loss.",
        "evidence": "Core condition from WY-O; skip/repeated-stage stacking behavior local policy",
        "native_exact": false,
        "display_topic": "矜功结束阶段义务",
        "display_decision": "真正提交矜功用牌后产生本回合义务；第一个正常结束阶段开始时，若本人整回合未造成正数伤害事件，仅流失1体力一次。发动前伤害也算；无懈不退材料或次数、不免义务。连计A的伤害、美人计对自己造成的伤害不算本人。跳结束阶段不另造回合末失血，回合结束清理义务。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH10",
        "topic": "View-as, recast and cleanup",
        "decision": "矜功 is USE only, not respond or recast: 铁索连环 must have legal target(s), no zero-target recast. Converted trick holds exactly one material in processing and normal tricks/physical-card recovery sees that material. At completion discard it only if still in processing; if recovered/moved never duplicate it. Conversion name does not permanently rename material, unlike 七宝刀 transformation.",
        "evidence": "WY-O actual material vs virtual distinction; recast exclusion follows use-only interpretation and explicit host policy",
        "native_exact": false,
        "display_topic": "转化、重铸与材料",
        "display_decision": "矜功仅用于使用，不可打出或响应，不可零目标重铸铁索连环。用牌只有1个真实材料；回收获得原材料，未被移动的处理区材料才弃置。不永久改名、不生成专属锦囊实体；与七宝刀永久实体转换不同。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH11",
        "topic": "Mixed-deck 青釭 lineage",
        "decision": "Select only a physical weapon whose normalized source lineage includes canonical SGS base 青釭剑. In 江湖 this is the deduplicated 鱼肠剑 representative when its source aliases explicitly include SGS 青釭. Transform that single entity in place, retaining source lineage and immutable UID/suit/rank while changing gameplay rule/equipment identity to 七宝刀. Never transform unrelated similarly named or mode-specific swords; never allocate a second sword.",
        "evidence": "WY-O conversion + host dedup adaptation",
        "native_exact": false,
        "display_topic": "七宝刀的青釭来源",
        "display_decision": "只转换规范化来源谱系包含三国杀基础青釭剑的当前武器实体。本作鱼肠剑代表须明确带此来源别名；保留同一UID、实际花色点数及来源，改为七宝刀规则身份。不转换无关同名剑或其他模式青釭，不产生第二件。",
        "status": "declared_local_policy"
      },
      {
        "id": "JH12",
        "topic": "七宝 combat timing in mixed game",
        "decision": "Stamp target-specific armor suppression for each confirmed direct 杀 branch; at direct damage-causing time add 1 if that receiver is unwounded and weapon active. Preserve existing source-bonus once receipt across transfer/chain; do not re-evaluate or duplicate bonus. Blood/poison 江湖 杀 variants belong to SHA family under existing declared cross-game policy.",
        "evidence": "Core WY-O range/ignore/full-HP damage-time effects; rare scheduler and cross-game interactions are explicit host policy",
        "native_exact": false,
        "display_topic": "七宝刀混合环境时序",
        "display_decision": "对杀确认后的每个直接目标记录防具忽略；直接伤害发生时，持有者武器仍有效且目标未损失体力则加1。连环与转移保留既有加伤凭据，不重算或重复加伤。血杀、毒杀按本作杀族处理，这是跨游戏裁定。",
        "status": "declared_local_policy"
      }
    ],
    "source_unknowns": [
      "G01 随机：原生武器/攻击/候选权重、是否允许重复、取消重开是否刷新未知；本作采用JH02。",
      "G02 卡池：11种普通锦囊名称由同日两份官方资料重构，未找到专用逐名抽样表；模式扩展加入条件未知，采用JH01。",
      "G03 武器失败：官方未明确无武器、废栏、装备中断后的全部后续；采用JH04。",
      "G04 强制用牌：原生先筛合法还是抽中后失败、距离例外及全禁用未实测；采用JH03。",
      "G05 材料区域：官方明确杀或装备1张，未逐项明确手牌/装备/特殊牌堆；采用JH05。",
      "G06 美人计：多人行动序、男性空手后仍给牌与否、参与者死亡等原生边界未闭合；JH06为本作选择，非官方答案。",
      "G07 结束义务：额外/跳过结束阶段及失去技能后的原生义务生命周期未确认；采用JH09。",
      "G08 伤害谱系：来源A、实际扣血与立即觉醒有官方支持；连环、转移及独立追加伤害采用JH08。",
      "G09 七宝牌面：未核验当前移动版七宝刀的印刷花色点数；沿用被转换青釭实体实际牌面，不能固定写黑桃6。",
      "G10 现行客户端：2026-10-15公开网页核对不等于2026当前移动客户端实测；规则与体力现行验证均为false。",
      "G11 混合环境：别名去重、规则性别、血/毒杀及跨包时序没有原生混合游戏答案；采用JH11–JH12。",
      "G12 全模式：本包只覆盖固定历史版本王允及依赖，未覆盖完整移动版模式、角色、牌堆或全武将。"
    ],
    "source_gaps": [
      {
        "id": "G01",
        "topic": "Native RNG weights and menu refresh",
        "severity": "material_native_parity_gap",
        "unknown": "No first-party probabilities, duplicate policy, or reroll schedule for weapon / five-name attack / two normal + special menu.",
        "proposed_policy": "JH02",
        "native_closure_evidence_needed": "Obtain current mobile rules/client trace across menu cancellation, phase restart and seeded/statistical sampling.",
        "status": "open_native_exactness"
      },
      {
        "id": "G02",
        "topic": "Optional mode/expansion candidate pool",
        "severity": "material_native_parity_gap",
        "unknown": "Official gives eleven ordinary names by count; WY-D deliberately excludes special tricks. BWIKI 逐鹿 phrase cannot establish which mobile modes include them.",
        "proposed_policy": "JH01",
        "native_closure_evidence_needed": "A mode-specific first-party pool table or client trace; do not silently enlarge pool.",
        "status": "open_native_exactness"
      },
      {
        "id": "G03",
        "topic": "No weapon / abolished slot / interrupted use",
        "severity": "material_native_parity_gap",
        "unknown": "Literal draw-pile search is clear, but failure does not have explicit primary continuation rules.",
        "proposed_policy": "JH04",
        "native_closure_evidence_needed": "Runtime test with no weapon in draw, all in discard, empty deck, abolished slot, and callbacks that kill A.",
        "status": "open_native_exactness"
      },
      {
        "id": "G04",
        "topic": "Illegal forced attack and range",
        "severity": "material_native_parity_gap",
        "unknown": "First-party five names fixed; prefilter vs choose-fail, mandated B distance exception, and all-prohibited outcome not formally documented.",
        "proposed_policy": "JH03",
        "native_closure_evidence_needed": "Runtime tests: empty-hand 火攻 target, 空城, distance, global use prohibition, no legal names.",
        "status": "open_native_exactness"
      },
      {
        "id": "G05",
        "topic": "矜功 exact material zones",
        "severity": "material_native_parity_gap",
        "unknown": "Kill/equipment kind and one-card count clear; primary does not expressly enumerate hand/equipment/private pile zones. Formal-looking community rewrite is inconsistent.",
        "proposed_policy": "JH05",
        "native_closure_evidence_needed": "Native equipped armor/weapon/mount conversion test and special-pile eligibility.",
        "status": "open_native_exactness"
      },
      {
        "id": "G06",
        "topic": "美人计 transfer and interruption ordering",
        "severity": "material_native_parity_gap",
        "unknown": "Core each-female steal/give followed by compare is clear. Exact order, empty target and participant death timing not primary-specified. Independent WY-NC stops remaining women when target hand empties and excludes user; this differs from the proposed literal JH06 fallback. A declared choice or native test is required, not silent adoption.",
        "proposed_policy": "JH06",
        "native_closure_evidence_needed": "Native test 3 women, target initially 1 card, gain/death/gender-change triggers, user death.",
        "status": "open_native_exactness"
      },
      {
        "id": "G07",
        "topic": "Delayed obligation with extra/skipped stages",
        "severity": "edge_native_parity_gap",
        "unknown": "Primary says this turn end stage; extra play/end stages and skill-loss obligation persistence are not explicit.",
        "proposed_policy": "JH09",
        "native_closure_evidence_needed": "Native tests extra play phases, skipped end stage, skill loss after use, repeated end stages.",
        "status": "open_native_exactness"
      },
      {
        "id": "G08",
        "topic": "Damage lineage chain/transfer/indirect costs",
        "severity": "edge_native_parity_gap",
        "unknown": "Official source=user and actual HP debit explicit, but all unusual nested interactions not replayed.",
        "proposed_policy": "JH08",
        "native_closure_evidence_needed": "Native fire-chain and redirection test, 南蛮 damage-source replacement, extra skill damage.",
        "status": "open_native_exactness"
      },
      {
        "id": "G09",
        "topic": "Physical 七宝 printed identity",
        "severity": "metadata_gap",
        "unknown": "Range/effects/persistence primary verified; exact mobile suit/rank face not observed.",
        "proposed_policy": "JH11",
        "native_closure_evidence_needed": "Native card face or authoritative card table. Preserve actual source card data instead of inventing a new face.",
        "status": "open_native_exactness"
      },
      {
        "id": "G10",
        "topic": "Current client / later changes",
        "severity": "current_status_gap",
        "unknown": "Current public hero HTML corroborates base skills; no 2026 runtime captured, no exhaustive post-2023 patch proof.",
        "proposed_policy": "JH01",
        "native_closure_evidence_needed": "Authenticated official current-client inspection/replay, without claiming page freshness equals runtime.",
        "status": "open_native_exactness"
      },
      {
        "id": "G11",
        "topic": "Mixed-game interactions",
        "severity": "intentional_adaptation_boundary",
        "unknown": "江湖 genders/aliases/血杀毒杀/曼舞 and local damage order have no native combined-game answer.",
        "proposed_policy": "JH11/JH12",
        "native_closure_evidence_needed": "Specify local policy and execute host regression tests; cannot be closed as original mobile fidelity.",
        "status": "open_native_exactness"
      },
      {
        "id": "G12",
        "topic": "Full source-mode breadth",
        "severity": "out_of_packet_boundary",
        "unknown": "This packet is one identity hero and dependencies, not full 2026 mobile modes, roles, deck catalogue or every hero.",
        "proposed_policy": "JH01",
        "native_closure_evidence_needed": "Separate full source-mode coverage programme; do not equate six named rule objects with entire mode.",
        "status": "open_native_exactness"
      }
    ],
    "adaptation_notes": "固定2023移动版完整技能与依赖的私有重构说明；初始只有连计、谋逞，觉醒获得矜功。江湖1v1没有两名其他角色，连计不可发动；1v2可有序选两人。候选、随机、区域、多人牌效和混合伤害按JH01–JH12明示处理。2023历史核心＋JH01–JH12江湖规则重建，已接入并测试；2026当前客户端与12项原生边界未全面核验；不宣称原生每一边界精确或整个模式完成。",
    "aliases": [
      "三国杀移动版王允",
      "王允·连计·谋逞·矜功"
    ],
    "variant_boundaries": [
      "不合并OL、十周年、欢乐、起、族、星王允。",
      "移动连计没有交牌/弃牌启动成本，没有把武器交回王允的步骤。",
      "谋逞在伤害后立即觉醒，不等待准备阶段。",
      "七宝刀由选中的青釭实体永久转换；不采用50%优先生成、重洗还原或开局随机预置。",
      "矜功材料为杀或任意装备，禁止按民间改写变成任意手牌。"
    ],
    "dedup_review": {
      "decision": "new_distinct_full_intrinsic_packet",
      "reason": "连计累计实际扣血、立即觉醒替换成完整矜功及七宝实体取得构成独立完整技能包；不得按局部装备或同名角色合并。"
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "merged_source_ids": []
    },
    "portrait_path": "./portraits-wangyun/wang-yun.svg",
    "art_provenance": {
      "kind": "original_hand_authored_svg",
      "official_art_used": false,
      "historical_portrait_claim": false
    },
    "evidence": {
      "copyright": "原创矢量画像、图标与卡图；仅重述来源机制，不分发官方美术或文章。",
      "source_status_scope": "verified historical core mechanics and attributed secondary identity fields; not every edge or current client"
    },
    "coverage": {
      "equipment_effect": {
        "documented": true,
        "implementation_verified_in_this_packet": false
      },
      "native_acquisition": {
        "primary_path_documented": true,
        "edge_exactness_closed": false,
        "implementation_verified_in_this_packet": false,
        "standalone_seed_counts": false
      },
      "full_hero": {
        "all_skill_and_card_dependencies_identified": true,
        "complete_primary_core_rules": true,
        "native_exactness_closed": false,
        "complete_declared_reconstruction_possible": "Only after explicit policy adoption, implementation of every branch and acceptance tests; no placeholder hero",
        "implementation_verified_in_this_packet": false,
        "implementation_gate": "Not cleared as exact native hero. Either close G01–G08 with authoritative/native evidence or adopt/display the complete pinned reconstruction contract before claiming its local implementation complete. Research alone does not mark any feature shipped."
      },
      "source_mode": {
        "full_original_mode_covered": false
      },
      "current_client_verified": false,
      "published": false,
      "code_changed": false
    }
  }
]);
export const WANGYUN_DEFINITION=WANGYUN_DEFINITIONS[0];
export const WANGYUN_LOCAL_POLICIES=WANGYUN_DEFINITION.local_policies;
export const WANGYUN_SOURCE_UNKNOWNS=WANGYUN_DEFINITION.source_unknowns;
export const WANGYUN_DEPENDENCY_SOURCE_DEFINITIONS=freeze([
  {
    "id": "sgs.mobile.wangyun.meirenji",
    "name": "美人计",
    "sources": [
      "WY-O",
      "WY-FM",
      "WY-MM"
    ],
    "type": "ordinary non-delayed trick",
    "native_initial_deck_copies": 0,
    "initial_random_deck_eligible": false,
    "native_acquisition": "one-material 矜功 view-as declaration",
    "intrinsic_per_phase_cap": null,
    "timing": "play phase",
    "targets": {
      "count": 1,
      "other": true,
      "gender": "male",
      "has_hand_cards_at_use": true,
      "no_required_female_participant_in_target_text": true,
      "distance_limit": null
    },
    "roles": {
      "user": "U (normally W)",
      "target": "M",
      "female_participants": "all living effective-female characters; not just allies",
      "steal_choice_actor": "each female participant, using ordinary hidden-hand acquisition",
      "give_choice_actor": "that female participant chooses her own current hand card",
      "give_recipient": "U, not M and not next woman"
    },
    "effect": [
      "Every participating female obtains 1 target hand card, then gives 1 hand card to U; may give the newly obtained card or another eligible hand card.",
      "After all transfers compare U and M CURRENT hand counts once.",
      "If U has fewer cards, U deals 1 normal damage to M.",
      "If M has fewer cards, M deals 1 normal damage to U.",
      "Equal hand counts: no damage branch."
    ],
    "damage_attribution": "actual fewer-hand participant is damage source; the card user remains U in use provenance",
    "nullifiable": true,
    "nullification_scope": "ordinary single-target trick effect; women are effect participants, not separately declared targets. Exact native nested counter windows not replayed.",
    "cleanup": "one 矜功 material follows ordinary processing→discard or recovery; no standalone trick inserted into deck",
    "edge_policy": "JH06/JH07/JH10",
    "native_edge_gaps": [
      "G06"
    ],
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated-tested-historical-reconstruction",
    "source_coverage": false,
    "current_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false
  },
  {
    "id": "sgs.mobile.wangyun.xiaolicangdao",
    "name": "笑里藏刀",
    "sources": [
      "WY-O",
      "WY-MX"
    ],
    "type": "ordinary non-delayed trick",
    "native_initial_deck_copies": 0,
    "initial_random_deck_eligible": false,
    "native_acquisition": "one-material 矜功 view-as declaration",
    "intrinsic_per_phase_cap": null,
    "timing": "play phase",
    "targets": {
      "count": 1,
      "other": true,
      "gender": null,
      "hand_requirement": null,
      "wounded_required": false,
      "distance_limit": null
    },
    "effect": [
      "Target draws min(its lost HP, 5).",
      "Then U deals 1 normal damage to that target."
    ],
    "zero_draw_case": "At full HP draw zero and still take the later damage, unless ordinarily prevented/cancelled.",
    "damage_source": "U",
    "nullifiable": true,
    "cleanup": "one material, ordinary processing cleanup/recovery; no native standalone deck card",
    "edge_policy": "JH07/JH10",
    "native_edge_gaps": [
      "G06"
    ],
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated-tested-historical-reconstruction",
    "source_coverage": false,
    "current_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false
  },
  {
    "id": "sgs.mobile.equipment.qibao.20231207",
    "name": "七宝刀",
    "sources": [
      "WY-O"
    ],
    "type": "weapon",
    "range": 2,
    "native_initial_deck_copies": 0,
    "normal_random_deck_eligible": false,
    "generation": "During 连计 A using selected draw-pile 青釭剑, change that existing physical entity to 七宝刀",
    "conditional_transform_probability": 1,
    "weapon_sampling_distribution_native_exact": null,
    "physical_entity_creation": false,
    "native_not_created_at_game_start": true,
    "ownership": "A uses/equips, not W; later ordinary holders retain transformed identity",
    "persistent_identity": {
      "through": [
        "hand",
        "equipment",
        "processing",
        "discard",
        "draw pile",
        "reshuffle",
        "save/load"
      ],
      "revert_on_leave": false,
      "destroy_on_leave": false,
      "replacement_rule_id_persistent_for_rest_of_game": true,
      "suit_rank": "preserve selected 青釭 physical face; no independently verified native card face in this packet",
      "uid": "same physical UID",
      "aliases": "preserve provenance, not old active armor-only rule"
    },
    "effects": [
      {
        "id": "armor_ignore",
        "locked": true,
        "cost": 0,
        "condition": "active weapon and own 杀 direct target",
        "effect": "ignore that target armor for this 杀",
        "does_not": "remove armor or invalidate target hero skills"
      },
      {
        "id": "unwounded_bonus",
        "locked": true,
        "cost": 0,
        "timing": "own 杀 causing damage",
        "condition": "target has no lost HP at damage-causing time",
        "effect": "damage +1",
        "does_not": "bonus for duel, fire attack, unrelated skill damage or HP loss"
      }
    ],
    "crossgame_policy": "JH11/JH12",
    "do_not_alias": [
      "七星宝刀",
      "古锭刀",
      "mode-specific 青釭剑"
    ],
    "native_edge_gaps": [
      "G01",
      "G03",
      "G09",
      "G11"
    ],
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated-tested-historical-reconstruction",
    "source_coverage": false,
    "current_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false
  }
]);
