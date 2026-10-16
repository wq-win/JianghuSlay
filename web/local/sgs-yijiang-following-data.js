/** Complete V27 selected source packets. Source evidence is separate from runtime validation.
 * F0–F9 are explicit host policies; initial HP and current-client behavior are not certified.
 * Keep unavailable until full callback/UI integration and independent validation pass. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.ma-su",
    "source_name": "马谡",
    "suggested_display_name": "马谡",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "蜀",
    "max_hp": 3,
    "gender": "male",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "F0 host normal-full-HP initialization, not independently documented mobile starting HP",
    "source_refs": [
      "mobile-masu",
      "bwiki-masu"
    ],
    "metadata_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "散谣",
      "制蛮"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_disclosed_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.sanyao",
        "name": "散谣",
        "type": "optional_active",
        "timing": "own actual play phase",
        "quota": "once per actual play phase",
        "cost": "discard exactly1 H/E",
        "trigger_gate": "target currentHP is maximum among all living roles, including tie",
        "targets": "one actor, self allowed, any side/distance",
        "effect": [
          "Commit discard then deal1 ordinary damage from owner to selected target.",
          "No Slash used, no Slash quota/range requirement.",
          "Damage may be prevented by own Zhiman only if target is another role."
        ],
        "official_rule_text": "出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-masu",
          "bwiki-masu",
          "official-ol-masu-2016"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F2"
        ],
        "source_procedure_unknowns": [
          "Nested cost-loss death/revalidation ordering is explicit host policy, not client observed."
        ]
      },
      {
        "id": "sgs.zhiman",
        "name": "制蛮",
        "type": "optional_source_damage_prevention_and_obtain",
        "timing": "source causing-damage stage before receiver damage stage",
        "quota": "once per damage event, not per point, no turn cap",
        "cost": "none",
        "trigger_gate": "owner about to cause damage to OTHER role",
        "targets": "the pending other damage recipient",
        "effect": [
          "May prevent entire damage event.",
          "After prevention obtain exactly one target E/J if available; no hand card.",
          "May prevent even if target E/J empty, then obtain nothing.",
          "Any source damage, including offturn; no dying/death trigger requirement."
        ],
        "official_rule_text": "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-masu",
          "bwiki-masu",
          "official-ol-masu-2016",
          "mobile-zhiman-timing-guide"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F3"
        ],
        "source_procedure_unknowns": [
          "Priority with foreign pre-damage replacement/cancellation providers is host scheduler."
        ]
      }
    ],
    "excluded_variants": [
      "Old 心战/挥泪 not selected.",
      "OL handcount-max alternate branch and 界 multi-target散谣 excluded.",
      "国战 deputy-general replacement extension excluded; hidden second mode audited separately."
    ],
    "ui_requirements": [
      "Complete intrinsic skill list, source variant and verification status visible.",
      "Original-created art only; source illustrations are not application assets.",
      "Never expose opponent hand identities for blind selections."
    ],
    "skill_ids": [
      "sgs.sanyao",
      "sgs.zhiman"
    ],
    "name": "马谡",
    "display_name": "马谡",
    "skill_name": "散谣/制蛮",
    "skill_desc": "散谣：出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。 制蛮：当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
    "intrinsic_skill_ids": [
      "sgs.sanyao",
      "sgs.zhiman"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.sanyao",
      "sgs.zhiman"
    ],
    "complete_skill_names": [
      "散谣",
      "制蛮"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.sanyao",
        "name": "散谣",
        "type": "optional_active",
        "timing": "own actual play phase",
        "quota": "once per actual play phase",
        "cost": "discard exactly1 H/E",
        "trigger_gate": "target currentHP is maximum among all living roles, including tie",
        "targets": "one actor, self allowed, any side/distance",
        "effect": [
          "Commit discard then deal1 ordinary damage from owner to selected target.",
          "No Slash used, no Slash quota/range requirement.",
          "Damage may be prevented by own Zhiman only if target is another role."
        ],
        "official_rule_text": "出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-masu",
          "bwiki-masu",
          "official-ol-masu-2016"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F2"
        ],
        "source_procedure_unknowns": [
          "Nested cost-loss death/revalidation ordering is explicit host policy, not client observed."
        ]
      },
      {
        "id": "sgs.zhiman",
        "name": "制蛮",
        "type": "optional_source_damage_prevention_and_obtain",
        "timing": "source causing-damage stage before receiver damage stage",
        "quota": "once per damage event, not per point, no turn cap",
        "cost": "none",
        "trigger_gate": "owner about to cause damage to OTHER role",
        "targets": "the pending other damage recipient",
        "effect": [
          "May prevent entire damage event.",
          "After prevention obtain exactly one target E/J if available; no hand card.",
          "May prevent even if target E/J empty, then obtain nothing.",
          "Any source damage, including offturn; no dying/death trigger requirement."
        ],
        "official_rule_text": "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-masu",
          "bwiki-masu",
          "official-ol-masu-2016",
          "mobile-zhiman-timing-guide"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F3"
        ],
        "source_procedure_unknowns": [
          "Priority with foreign pre-damage replacement/cancellation providers is host scheduler."
        ]
      }
    ],
    "skill_ownership_policy": "All five selected source skills are intrinsic; no granted or personal-lord skill is omitted. Each owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "马谡",
    "source_variant": "基础身份／经典目录+明示F0–F9江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-106.html",
      "https://wiki.biligame.com/msgs/%E9%A9%AC%E8%B0%A1",
      "https://www.sanguosha.com/news/20161101_2982_2319",
      "https://www.sanguosha.cn/pc/guide-info-36.html"
    ],
    "source_ids": [
      "mobile-masu",
      "bwiki-masu",
      "official-ol-masu-2016",
      "mobile-zhiman-timing-guide"
    ],
    "source_record_id": "sgs.adapted.base.hero.ma-su:2026-10-15",
    "faction": "蜀",
    "source_gender": "male",
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-masu",
        "url": "https://www.sanguosha.cn/pc/hero-detail-106.html",
        "status": 200,
        "bytes": 21740,
        "sha256": "b1f684d991831bee5f9c46379a531350ac8ffd8e25f413799f528f7ce559cd24",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "raw_path": "evidence/mobile-masu.html",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "马谡",
          "faction": "蜀",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "audit": {
          "all_inline_panels_read": true,
          "mode_tabs": [
            "身份",
            "国战"
          ],
          "groups": [
            {
              "mode": "身份",
              "group_hidden": false,
              "panels": [
                {
                  "name": "散谣",
                  "hidden": false,
                  "rule_text": "出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。",
                  "rule_text_sha256": "140f7be9a0b30081e40940ddfff5c04afce72964c0d3726d13fd14d0c5ab4f5b",
                  "html_line": 182
                },
                {
                  "name": "制蛮",
                  "hidden": true,
                  "rule_text": "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
                  "rule_text_sha256": "72b3e1dd06b8d144dd5c9f346fcc8d2b6f5590fad6ba3ab39f15d749f75998b1",
                  "html_line": 183
                }
              ]
            },
            {
              "mode": "国战",
              "group_hidden": true,
              "panels": [
                {
                  "name": "制蛮",
                  "hidden": false,
                  "rule_text": "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
                  "rule_text_sha256": "72b3e1dd06b8d144dd5c9f346fcc8d2b6f5590fad6ba3ab39f15d749f75998b1",
                  "html_line": 183
                }
              ]
            }
          ],
          "selected_group": 0,
          "personal_lord_skills": [],
          "granted_skills": [],
          "inventory_complete_for_selected_identity_panel": true
        },
        "limitations": [
          "Undated catalog snapshot, not live client verification.",
          "HP/gender/initial HP have no explicit official numeric fields.",
          "Other mode groups retained only as excluded evidence."
        ]
      },
      {
        "id": "bwiki-masu",
        "url": "https://wiki.biligame.com/msgs/%E9%A9%AC%E8%B0%A1",
        "tier": "community_same_product_classic_metadata_and_rules_web_observation",
        "product": "三国杀移动版",
        "observation_path": "evidence/bwiki-masu-web-observation.txt",
        "observation_sha256": "d0e5dd47fae6ccf67ae3cb920133e69883166479045b6a213df04250ac25b721",
        "raw_path": null,
        "access_date": "2026-10-15",
        "revision_id": 24570,
        "visible_update_date": "2023-09-26",
        "current_client_verified": false,
        "metadata": {
          "max_hp": 3,
          "gender": "male",
          "faction": "蜀",
          "initial_hp_explicit": null,
          "selected_section": "经典 base identity"
        },
        "limitations": [
          "Raw HTTP fetch returned567; webtool extracted observation retained, not a raw HTML claim.",
          "Visible revision date does not independently date transclusions.",
          "Classic HP numeric and icon count plus explicit game gender/faction read."
        ]
      },
      {
        "id": "official-ol-masu-2016",
        "url": "https://www.sanguosha.com/news/20161101_2982_2319",
        "status": 200,
        "bytes": 44604,
        "sha256": "22b3b33358c563312935dc57d8ca7aa0b1e97424cc19f08d38bfbc7a92d26f53",
        "access_date": "2026-10-15",
        "raw_path": "evidence/official-ol-masu-2016.html",
        "current_client_verified": false,
        "tier": "official_other_product_historical_same_skill_variant",
        "publication_date_visible": "2016-11-01 19:19:12"
      },
      {
        "id": "mobile-zhiman-timing-guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-36.html",
        "status": 200,
        "bytes": 26912,
        "sha256": "5148f5ed8b9d81ca6cdb4aea5003860298d72fa08de1a4a0da1f02e78fc7d19e",
        "access_date": "2026-10-15",
        "raw_path": "evidence/mobile-zhiman-timing-guide.html",
        "current_client_verified": false,
        "tier": "official_same_product_dated_guide",
        "publication_date_visible": "2020-05-28 20:56:23"
      }
    ],
    "lord_inventory_basis": "Every selected official inline identity panel was read; no intrinsic lord skill or granted skill exists in this packet.",
    "source_evidence_note": "官网完整身份技能与势力已核；体力上限和规则性别来自同产品社区经典身份公开观察。BWIKI未获得原始HTML，不冒称原始页面或现行客户端验证；显示更新日期不当作独立修订时间。初始满体力是F0宿主约定。",
    "source_unknowns": [
      {
        "hero": "马谡",
        "skill": "散谣",
        "detail": "Nested cost-loss death/revalidation ordering is explicit host policy, not client observed."
      },
      {
        "hero": "马谡",
        "skill": "制蛮",
        "detail": "Priority with foreign pre-damage replacement/cancellation providers is host scheduler."
      }
    ],
    "aliases": [
      "三国杀马谡",
      "马谡·散谣/制蛮",
      "ma-su"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang-following/ma-su.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F0",
        "title": "Source and initialization",
        "contract": "Selected base identity official full inventories only; direct initialHP=null. Normal-full-HP initialization is host policy. No intrinsic lord skill or grant exists in selected packets; identity mode itself remains pending. No client certification.",
        "basis": "Official all-tab inspection; dated same-product metadata.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F1",
        "title": "Transactional events and effective skills",
        "contract": "Stable movement/phase/turn/damage/card-use IDs; receipt before nested callbacks; stale UI revalidation; actual physical cards exactly once. All skill checks through effective skill ledger, including Duanchang and HuaMuLan. Copied male packet copies complete intrinsic template/maxHP, not another owner markers/piles. Hidden enemy hand choices blind; visible E/J selectable.",
        "basis": "Shared host implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F2",
        "title": "Sanyao commitment",
        "contract": "Once per actual owner play-phase ID, discard exactly one legal H/E material and select any living currentHP-maximum actor including tied maxima/self. No distance/faction/handcount gate. Snapshot legal target at commitment; ordinary payment/loss callbacks run, then if owner and target still active deal1 ordinary source damage. Mark quota before nested callbacks. No refund after cost commitment.",
        "basis": "Official mobile core; official OL2016 matching variant confirms E cost, ties and no distance. Nested interruptions are host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F3",
        "title": "Zhiman cancellation",
        "contract": "Offer owner at source causing-damage window against OTHER actor, before receiver transfer/prevention/armor and before HP decrement. Once per actual damage EVENT, not point, any source damage incl skill/offturn/each independently created chain branch. Accept cancels entire pending damage; gain one eligible target E/J into owner H if any. Empty E/J does not prevent cancellation. No source damage history, after-damage, dying or new chain propagation from prevented event. Self-damage never eligible.",
        "basis": "Official mobile text; dated mobile guide36 puts Zhiman before receiver RenShi; matching OL2016 empty-zone/offturn/equipment FAQ. Shared event semantics.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F4",
        "title": "Jiangchi draw and turn markers",
        "contract": "Only an existing normal draw-phase quantity operation: optionally +1 draw plus forbid all Slash USE and PLAY for rest of current turn, OR -1 draw plus no distance and +1 normal Slash-use allowance for rest of current turn, OR decline. Decide before actual draw, not after seeing cards. Replaced/skipped normal draw has no offer. Positive ban overrides crossbow and forced/virtual Slash, Duel/Nanman responses. Attack branch no extra target and no damage bonus.",
        "basis": "Official mobile and dated same-product classic text; baseline draw/Slash card policy separate.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F5",
        "title": "Jiangchi shared stacking",
        "contract": "Shared host policy: branch markers bind actual turnID and survive resolved skill removal; clear at true turn-finally/death. Multiple genuine draw phases produce one opportunity each; +1 allowances additive with independently earned positive modifiers, prohibition wins, unlimited weapon remains unlimited unless banned. Distance waiver does not bypass hard prohibitions, alter weapon range value for unrelated skills, or grant extra targets. Existing draw-replacement selection resolves before modifiers.",
        "basis": "Cross-game host stacking and phase architecture, not claimed canonical mobile exotic procedure.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F6",
        "title": "Jieyue four branches",
        "contract": "At each genuine owner end-phase entry optionally discard exactly1 HAND card and choose one OTHER actor. Target chooses1 own H/E to put on owner Jieyue pile; if it does not contribute owner discards1 target H/E, if any. No distance/faction requirement. End-phase starts after ordinary discard, not arbitrary turn-finally. With at least1 extant Jieyue pile card, optional one RED H->Shan or one BLACK H->Wuxie at legal card-use/play windows. The selected HAND material is spent, pile stays. At owner actual preparation entry compulsory gain ALL extant Jieyue cards into hand, emptying pile.",
        "basis": "Official mobile complete one-skill text; exact mobile skillpage; exact-matching officialOL2016 target selfchooses incl equipment and preparatory gain. H/E conventional ownership corroborated by2011 publisher glossary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F7",
        "title": "Jieyue zones and lifecycle",
        "contract": "Pile is a separate owner-bound public physical zone, not hand/equipment, not ordinary Snatch/Dismantle targetable, not eligible response/heal material. Target equipment contribution runs real leave/loss hooks. Every grant/decline/cost and preparation retrieval has stable receipt. Multiple end phases may accumulate; retrieval gains all. Empty target may legally receive offer and cost yields no effect if no eligible card remains. Host policy: pile faceup; skill removal or owner death discards pile once, no preparation retrieval without skill; copies start empty. Derived cards obey leave/destroy rules rather than recreated cards.",
        "basis": "Persistent physical-pile source core; visibility/removal/copy/interruption are disclosed cross-game host contracts. No mode-lord dependency intrinsic.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F8",
        "title": "Yaowu pending damage window",
        "contract": "Locked once per red effective-Slash damage EVENT reaching owner receiver damage window, before HP decrement/rescue/death. Actual damage source chooses recover1 if wounded or draw1; fullHP forces draw. Not per damage point. Black/colorless Slash, nonSlash damage and HP loss do nothing. Real/virtual/view-as red Slash qualify; carried red-Slash channel on elemental chain damage qualifies under mobile catalog example. Source must exist and still be an active role to gain effect.",
        "basis": "Official mobile received-damage wording and chain example; dated same-product FAQ source choice/fullHP/conversion/dodge. No victim-survival condition can be added before impending lethal damage.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F9",
        "title": "Yaowu scheduler and color",
        "contract": "Effective card identity/color is frozen from actual use, not discarded-material scan or printed sourcehero. Two-material virtual red only if bothred; mixed colors colorless. Source damage prevention (Zhiman) happens first and prevents receiver event entirely. At receiver stage apply shared action-order provider scheduler; once benefit resolves, later cancellation does not roll back. A transfer reevaluates actualrecipient, not originalcardtarget. Shared compatibility ordering for multiple foreign receiver effects is host policy, not a guessed mobile precedence.",
        "basis": "Mobile FAQ for transformedSlash colors and no-benefit when dodged; shared damage-event transaction and foreign-skill ordering contract.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整五项固有技能按选定移动版基础身份经典目录保留；F0–F9明示初始化、来源伤害取消、摸牌与杀禁令、实体节钺牌堆及扣血前耀武时序。当前客户端与完整身份模式未核；华雄是经典耀武，不混入2012恃勇或界/谋/国战变体。",
    "skill_callback_modules": {
      "sgs.sanyao": "sgs-following-masu-skills.js",
      "sgs.zhiman": "sgs-following-masu-skills.js"
    },
    "gender_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-masu",
      "revision_id": 24570,
      "visible_update_date": "2023-09-26",
      "revision_timestamp_utc": null,
      "official_field_verified": false,
      "evidence_kind": "community_same_product_classic_metadata_and_rules_web_observation",
      "observation_sha256": "d0e5dd47fae6ccf67ae3cb920133e69883166479045b6a213df04250ac25b721"
    },
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-masu"
      ],
      "revision_id": 24570,
      "visible_update_date": "2023-09-26",
      "revision_timestamp_utc": null,
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "F0",
      "display_note": "体力上限来自同产品社区经典数值与勾玉图标公开观察，官网无数值HP字段。独立initialHP未观察；满体力开局为F0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.ma-su",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "马谡",
      "faction": "蜀",
      "gender": "male",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "F0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "散谣",
        "制蛮"
      ],
      "complete_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "散谣",
          "制蛮"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "skills": [
          {
            "id": "sgs.sanyao",
            "name": "散谣",
            "type": "optional_active",
            "timing": "own actual play phase",
            "quota": "once per actual play phase",
            "cost": "discard exactly1 H/E",
            "trigger_gate": "target currentHP is maximum among all living roles, including tie",
            "targets": "one actor, self allowed, any side/distance",
            "effect": [
              "Commit discard then deal1 ordinary damage from owner to selected target.",
              "No Slash used, no Slash quota/range requirement.",
              "Damage may be prevented by own Zhiman only if target is another role."
            ],
            "official_rule_text": "出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-masu",
              "bwiki-masu",
              "official-ol-masu-2016"
            ],
            "policy_refs": [
              "F0",
              "F1",
              "F2"
            ],
            "source_procedure_unknowns": [
              "Nested cost-loss death/revalidation ordering is explicit host policy, not client observed."
            ]
          },
          {
            "id": "sgs.zhiman",
            "name": "制蛮",
            "type": "optional_source_damage_prevention_and_obtain",
            "timing": "source causing-damage stage before receiver damage stage",
            "quota": "once per damage event, not per point, no turn cap",
            "cost": "none",
            "trigger_gate": "owner about to cause damage to OTHER role",
            "targets": "the pending other damage recipient",
            "effect": [
              "May prevent entire damage event.",
              "After prevention obtain exactly one target E/J if available; no hand card.",
              "May prevent even if target E/J empty, then obtain nothing.",
              "Any source damage, including offturn; no dying/death trigger requirement."
            ],
            "official_rule_text": "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-masu",
              "bwiki-masu",
              "official-ol-masu-2016",
              "mobile-zhiman-timing-guide"
            ],
            "policy_refs": [
              "F0",
              "F1",
              "F3"
            ],
            "source_procedure_unknowns": [
              "Priority with foreign pre-damage replacement/cancellation providers is host scheduler."
            ]
          }
        ]
      },
      "signature_sha256": "94dba4406fa867dd31336bc2152381ac0364c31cc173da49b19aa507ff908ae6",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 90,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "90ed7301ef7a78f6cd8ce7cd4840b8badba70eca",
      "comparison_scope": "Exhaustive actual90+7alias universe, not entire public all-hero universe. 比干 is absent from actual90,7aliases and locally available verified YXS packet records; no invented 比干 signature or merge. 张春华 blocked and not counted.",
      "reason": "3HP complete packet combines once/play discard1H/E direct1damage to ANY tied maximum-currentHP actor including self, with optional source-stage prevention of entire damage to OTHER actor and E/J obtain even when zones empty. No equalHP existing full packet has this conjunction.",
      "same_name_collisions": []
    }
  },
  {
    "id": "sgs.adapted.base.hero.cao-zhang",
    "source_name": "曹彰",
    "suggested_display_name": "曹彰",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "魏",
    "max_hp": 4,
    "gender": "male",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "F0 host normal-full-HP initialization, not independently documented mobile starting HP",
    "source_refs": [
      "mobile-caozhang",
      "bwiki-caozhang"
    ],
    "metadata_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "将驰"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_disclosed_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.jiangchi",
        "name": "将驰",
        "type": "optional_draw_modifier_with_exclusive_turn_effect",
        "timing": "normal own draw-phase quantity calculation before drawing",
        "quota": "one choice per genuine normal draw operation; no per-turn active button",
        "cost": "choose draw quantity tradeoff, no card/HP payment",
        "trigger_gate": "normal phase draw not skipped/replaced",
        "targets": "owner only",
        "effect": [
          "Decline for ordinary draw.",
          "Branch1 draw one extra; cannot USE OR PLAY any Slash through this turn end.",
          "Branch2 draw one fewer; Slash distance unrestricted and one extra use this turn.",
          "No damage boost, no additional target, no free Slash/card creation."
        ],
        "official_rule_text": "摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caozhang",
          "bwiki-caozhang"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F4",
          "F5"
        ],
        "source_procedure_unknowns": [
          "Multiple genuine draw-phase and cross-game modifier stacking are explicitly host policy."
        ]
      }
    ],
    "excluded_variants": [
      "界曹彰 draw-end discard/recast choice not selected.",
      "界 quota-minus-one branch is not base absolute Slash use/play ban."
    ],
    "ui_requirements": [
      "Complete intrinsic skill list, source variant and verification status visible.",
      "Original-created art only; source illustrations are not application assets.",
      "Never expose opponent hand identities for blind selections."
    ],
    "skill_ids": [
      "sgs.jiangchi"
    ],
    "name": "曹彰",
    "display_name": "曹彰",
    "skill_name": "将驰",
    "skill_desc": "将驰：摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。",
    "intrinsic_skill_ids": [
      "sgs.jiangchi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.jiangchi"
    ],
    "complete_skill_names": [
      "将驰"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.jiangchi",
        "name": "将驰",
        "type": "optional_draw_modifier_with_exclusive_turn_effect",
        "timing": "normal own draw-phase quantity calculation before drawing",
        "quota": "one choice per genuine normal draw operation; no per-turn active button",
        "cost": "choose draw quantity tradeoff, no card/HP payment",
        "trigger_gate": "normal phase draw not skipped/replaced",
        "targets": "owner only",
        "effect": [
          "Decline for ordinary draw.",
          "Branch1 draw one extra; cannot USE OR PLAY any Slash through this turn end.",
          "Branch2 draw one fewer; Slash distance unrestricted and one extra use this turn.",
          "No damage boost, no additional target, no free Slash/card creation."
        ],
        "official_rule_text": "摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caozhang",
          "bwiki-caozhang"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F4",
          "F5"
        ],
        "source_procedure_unknowns": [
          "Multiple genuine draw-phase and cross-game modifier stacking are explicitly host policy."
        ]
      }
    ],
    "skill_ownership_policy": "All five selected source skills are intrinsic; no granted or personal-lord skill is omitted. Each owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "曹彰",
    "source_variant": "基础身份／经典目录+明示F0–F9江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-111.html",
      "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%BD%B0"
    ],
    "source_ids": [
      "mobile-caozhang",
      "bwiki-caozhang"
    ],
    "source_record_id": "sgs.adapted.base.hero.cao-zhang:2026-10-15",
    "faction": "魏",
    "source_gender": "male",
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-caozhang",
        "url": "https://www.sanguosha.cn/pc/hero-detail-111.html",
        "status": 200,
        "bytes": 21544,
        "sha256": "a37dd359f3243d93ff973ba0f03eef5acfe183a5d0e009818c369c1ad436e090",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "raw_path": "evidence/mobile-caozhang.html",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "曹彰",
          "faction": "魏",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "audit": {
          "all_inline_panels_read": true,
          "mode_tabs": [
            "身份"
          ],
          "groups": [
            {
              "mode": "身份",
              "group_hidden": false,
              "panels": [
                {
                  "name": "将驰",
                  "hidden": false,
                  "rule_text": "摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。",
                  "rule_text_sha256": "f8d75606f619a2b2943d8f6efcb82256b9b83b0f64f529f709b90a0cc43bf291",
                  "html_line": 186
                }
              ]
            }
          ],
          "selected_group": 0,
          "personal_lord_skills": [],
          "granted_skills": [],
          "inventory_complete_for_selected_identity_panel": true
        },
        "limitations": [
          "Undated catalog snapshot, not live client verification.",
          "HP/gender/initial HP have no explicit official numeric fields.",
          "Other mode groups retained only as excluded evidence."
        ]
      },
      {
        "id": "bwiki-caozhang",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%BD%B0",
        "tier": "community_same_product_classic_metadata_and_rules_web_observation",
        "product": "三国杀移动版",
        "observation_path": "evidence/bwiki-caozhang-web-observation.txt",
        "observation_sha256": "37a8cc41ee9fb253f42c0e955617431f52e167073f010a889b3deea1fc005a4c",
        "raw_path": null,
        "access_date": "2026-10-15",
        "revision_id": 35437,
        "visible_update_date": "2025-12-30",
        "current_client_verified": false,
        "metadata": {
          "max_hp": 4,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典 base identity"
        },
        "limitations": [
          "Raw HTTP fetch returned567; webtool extracted observation retained, not a raw HTML claim.",
          "Visible revision date does not independently date transclusions.",
          "Classic HP numeric and icon count plus explicit game gender/faction read."
        ]
      }
    ],
    "lord_inventory_basis": "Every selected official inline identity panel was read; no intrinsic lord skill or granted skill exists in this packet.",
    "source_evidence_note": "官网完整身份技能与势力已核；体力上限和规则性别来自同产品社区经典身份公开观察。BWIKI未获得原始HTML，不冒称原始页面或现行客户端验证；显示更新日期不当作独立修订时间。初始满体力是F0宿主约定。",
    "source_unknowns": [
      {
        "hero": "曹彰",
        "skill": "将驰",
        "detail": "Multiple genuine draw-phase and cross-game modifier stacking are explicitly host policy."
      }
    ],
    "aliases": [
      "三国杀曹彰",
      "曹彰·将驰",
      "cao-zhang"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang-following/cao-zhang.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F0",
        "title": "Source and initialization",
        "contract": "Selected base identity official full inventories only; direct initialHP=null. Normal-full-HP initialization is host policy. No intrinsic lord skill or grant exists in selected packets; identity mode itself remains pending. No client certification.",
        "basis": "Official all-tab inspection; dated same-product metadata.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F1",
        "title": "Transactional events and effective skills",
        "contract": "Stable movement/phase/turn/damage/card-use IDs; receipt before nested callbacks; stale UI revalidation; actual physical cards exactly once. All skill checks through effective skill ledger, including Duanchang and HuaMuLan. Copied male packet copies complete intrinsic template/maxHP, not another owner markers/piles. Hidden enemy hand choices blind; visible E/J selectable.",
        "basis": "Shared host implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F2",
        "title": "Sanyao commitment",
        "contract": "Once per actual owner play-phase ID, discard exactly one legal H/E material and select any living currentHP-maximum actor including tied maxima/self. No distance/faction/handcount gate. Snapshot legal target at commitment; ordinary payment/loss callbacks run, then if owner and target still active deal1 ordinary source damage. Mark quota before nested callbacks. No refund after cost commitment.",
        "basis": "Official mobile core; official OL2016 matching variant confirms E cost, ties and no distance. Nested interruptions are host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F3",
        "title": "Zhiman cancellation",
        "contract": "Offer owner at source causing-damage window against OTHER actor, before receiver transfer/prevention/armor and before HP decrement. Once per actual damage EVENT, not point, any source damage incl skill/offturn/each independently created chain branch. Accept cancels entire pending damage; gain one eligible target E/J into owner H if any. Empty E/J does not prevent cancellation. No source damage history, after-damage, dying or new chain propagation from prevented event. Self-damage never eligible.",
        "basis": "Official mobile text; dated mobile guide36 puts Zhiman before receiver RenShi; matching OL2016 empty-zone/offturn/equipment FAQ. Shared event semantics.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F4",
        "title": "Jiangchi draw and turn markers",
        "contract": "Only an existing normal draw-phase quantity operation: optionally +1 draw plus forbid all Slash USE and PLAY for rest of current turn, OR -1 draw plus no distance and +1 normal Slash-use allowance for rest of current turn, OR decline. Decide before actual draw, not after seeing cards. Replaced/skipped normal draw has no offer. Positive ban overrides crossbow and forced/virtual Slash, Duel/Nanman responses. Attack branch no extra target and no damage bonus.",
        "basis": "Official mobile and dated same-product classic text; baseline draw/Slash card policy separate.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F5",
        "title": "Jiangchi shared stacking",
        "contract": "Shared host policy: branch markers bind actual turnID and survive resolved skill removal; clear at true turn-finally/death. Multiple genuine draw phases produce one opportunity each; +1 allowances additive with independently earned positive modifiers, prohibition wins, unlimited weapon remains unlimited unless banned. Distance waiver does not bypass hard prohibitions, alter weapon range value for unrelated skills, or grant extra targets. Existing draw-replacement selection resolves before modifiers.",
        "basis": "Cross-game host stacking and phase architecture, not claimed canonical mobile exotic procedure.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F6",
        "title": "Jieyue four branches",
        "contract": "At each genuine owner end-phase entry optionally discard exactly1 HAND card and choose one OTHER actor. Target chooses1 own H/E to put on owner Jieyue pile; if it does not contribute owner discards1 target H/E, if any. No distance/faction requirement. End-phase starts after ordinary discard, not arbitrary turn-finally. With at least1 extant Jieyue pile card, optional one RED H->Shan or one BLACK H->Wuxie at legal card-use/play windows. The selected HAND material is spent, pile stays. At owner actual preparation entry compulsory gain ALL extant Jieyue cards into hand, emptying pile.",
        "basis": "Official mobile complete one-skill text; exact mobile skillpage; exact-matching officialOL2016 target selfchooses incl equipment and preparatory gain. H/E conventional ownership corroborated by2011 publisher glossary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F7",
        "title": "Jieyue zones and lifecycle",
        "contract": "Pile is a separate owner-bound public physical zone, not hand/equipment, not ordinary Snatch/Dismantle targetable, not eligible response/heal material. Target equipment contribution runs real leave/loss hooks. Every grant/decline/cost and preparation retrieval has stable receipt. Multiple end phases may accumulate; retrieval gains all. Empty target may legally receive offer and cost yields no effect if no eligible card remains. Host policy: pile faceup; skill removal or owner death discards pile once, no preparation retrieval without skill; copies start empty. Derived cards obey leave/destroy rules rather than recreated cards.",
        "basis": "Persistent physical-pile source core; visibility/removal/copy/interruption are disclosed cross-game host contracts. No mode-lord dependency intrinsic.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F8",
        "title": "Yaowu pending damage window",
        "contract": "Locked once per red effective-Slash damage EVENT reaching owner receiver damage window, before HP decrement/rescue/death. Actual damage source chooses recover1 if wounded or draw1; fullHP forces draw. Not per damage point. Black/colorless Slash, nonSlash damage and HP loss do nothing. Real/virtual/view-as red Slash qualify; carried red-Slash channel on elemental chain damage qualifies under mobile catalog example. Source must exist and still be an active role to gain effect.",
        "basis": "Official mobile received-damage wording and chain example; dated same-product FAQ source choice/fullHP/conversion/dodge. No victim-survival condition can be added before impending lethal damage.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F9",
        "title": "Yaowu scheduler and color",
        "contract": "Effective card identity/color is frozen from actual use, not discarded-material scan or printed sourcehero. Two-material virtual red only if bothred; mixed colors colorless. Source damage prevention (Zhiman) happens first and prevents receiver event entirely. At receiver stage apply shared action-order provider scheduler; once benefit resolves, later cancellation does not roll back. A transfer reevaluates actualrecipient, not originalcardtarget. Shared compatibility ordering for multiple foreign receiver effects is host policy, not a guessed mobile precedence.",
        "basis": "Mobile FAQ for transformedSlash colors and no-benefit when dodged; shared damage-event transaction and foreign-skill ordering contract.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整五项固有技能按选定移动版基础身份经典目录保留；F0–F9明示初始化、来源伤害取消、摸牌与杀禁令、实体节钺牌堆及扣血前耀武时序。当前客户端与完整身份模式未核；华雄是经典耀武，不混入2012恃勇或界/谋/国战变体。",
    "skill_callback_modules": {
      "sgs.jiangchi": "sgs-following-caozhang-skills.js"
    },
    "gender_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-caozhang",
      "revision_id": 35437,
      "visible_update_date": "2025-12-30",
      "revision_timestamp_utc": null,
      "official_field_verified": false,
      "evidence_kind": "community_same_product_classic_metadata_and_rules_web_observation",
      "observation_sha256": "37a8cc41ee9fb253f42c0e955617431f52e167073f010a889b3deea1fc005a4c"
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-caozhang"
      ],
      "revision_id": 35437,
      "visible_update_date": "2025-12-30",
      "revision_timestamp_utc": null,
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "F0",
      "display_note": "体力上限来自同产品社区经典数值与勾玉图标公开观察，官网无数值HP字段。独立initialHP未观察；满体力开局为F0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.cao-zhang",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "曹彰",
      "faction": "魏",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "F0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "将驰"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "将驰"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "skills": [
          {
            "id": "sgs.jiangchi",
            "name": "将驰",
            "type": "optional_draw_modifier_with_exclusive_turn_effect",
            "timing": "normal own draw-phase quantity calculation before drawing",
            "quota": "one choice per genuine normal draw operation; no per-turn active button",
            "cost": "choose draw quantity tradeoff, no card/HP payment",
            "trigger_gate": "normal phase draw not skipped/replaced",
            "targets": "owner only",
            "effect": [
              "Decline for ordinary draw.",
              "Branch1 draw one extra; cannot USE OR PLAY any Slash through this turn end.",
              "Branch2 draw one fewer; Slash distance unrestricted and one extra use this turn.",
              "No damage boost, no additional target, no free Slash/card creation."
            ],
            "official_rule_text": "摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-caozhang",
              "bwiki-caozhang"
            ],
            "policy_refs": [
              "F0",
              "F1",
              "F4",
              "F5"
            ],
            "source_procedure_unknowns": [
              "Multiple genuine draw-phase and cross-game modifier stacking are explicitly host policy."
            ]
          }
        ]
      },
      "signature_sha256": "39749c4aa2251414472a42a77fdce470d652789a1264e72af417623d5f0583f3",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 90,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "90ed7301ef7a78f6cd8ce7cd4840b8badba70eca",
      "comparison_scope": "Exhaustive actual90+7alias universe, not entire public all-hero universe. 比干 is absent from actual90,7aliases and locally available verified YXS packet records; no invented 比干 signature or merge. 张春华 blocked and not counted.",
      "reason": "4HP complete packet permits exclusive normal-draw +1 with absolute all-Slash use/play ban OR draw-1 with distance waiver/+1Slash allowance through turn; no damage bonus. Existing equalHP full packet lacks this exact dual tradeoff.",
      "same_name_collisions": []
    }
  },
  {
    "id": "sgs.adapted.base.hero.yu-jin",
    "source_name": "于禁",
    "suggested_display_name": "于禁",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "魏",
    "max_hp": 4,
    "gender": "male",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "F0 host normal-full-HP initialization, not independently documented mobile starting HP",
    "source_refs": [
      "mobile-yujin",
      "bwiki-yujin"
    ],
    "metadata_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "节钺"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_disclosed_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.jieyue",
        "name": "节钺",
        "type": "optional_endphase_coercion_and_viewas_with_compulsory_preparation_return",
        "timing": "own endphase; conditional legal Shan/Wuxie windows; own preparation",
        "quota": "one optional per genuine end-phase entry; no intrinsic view-as count cap; once prepentry retrievesall",
        "cost": "endbranch discard1H; responsebranch consumes1 qualifyingH, never pilecard",
        "trigger_gate": "end ownerH>0; conversion pilecount>=1; return existingpile",
        "targets": "one other actor for coercion, any side/range; self forpile/return",
        "effect": [
          "End: pay1H, then target may place1 ownH/E on owner general as Jieyue.",
          "If no contribution, owner chooses/discards1 targetH/E if any; target cannot choose which card to discard.",
          "While pile nonempty, redHAND asShan and blackHAND asWuxie, respecting legaluse/play windows.",
          "Conversions consume the HAND material; enablement pile not spent and grants no extra card.",
          "Preparation: compulsory gain ALL existingpile into ownerHAND, equipment included.",
          "No dying/death trigger; pile is not ownhand rescue/response material."
        ],
        "official_rule_text": "节钺[yuè],结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-yujin",
          "bwiki-yujin",
          "bwiki-jieyue-yujin",
          "official-ol-yujin-2016",
          "publisher-rule-glossary"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F6",
          "F7"
        ],
        "source_procedure_unknowns": [
          "Pile faceup visibility and skillloss/death/copy cleanup explicitly host policy, not current-client observed.",
          "H/E-only interpretation uses conventional ownership glossary and matching official2016 equipment examples; no newer mobile zone FAQ located."
        ]
      }
    ],
    "excluded_variants": [
      "Old 毅重 armorless-blackSlash immunity excluded.",
      "OL/十周年镇军 excluded.",
      "界于禁 keep1H1E-or-draw3 gift skill excluded.",
      "国战 militaryorder and谋 variants excluded."
    ],
    "ui_requirements": [
      "Complete intrinsic skill list, source variant and verification status visible.",
      "Original-created art only; source illustrations are not application assets.",
      "Never expose opponent hand identities for blind selections."
    ],
    "skill_ids": [
      "sgs.jieyue"
    ],
    "name": "于禁",
    "display_name": "于禁",
    "skill_name": "节钺",
    "skill_desc": "节钺：节钺[yuè],结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。",
    "intrinsic_skill_ids": [
      "sgs.jieyue"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.jieyue"
    ],
    "complete_skill_names": [
      "节钺"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.jieyue",
        "name": "节钺",
        "type": "optional_endphase_coercion_and_viewas_with_compulsory_preparation_return",
        "timing": "own endphase; conditional legal Shan/Wuxie windows; own preparation",
        "quota": "one optional per genuine end-phase entry; no intrinsic view-as count cap; once prepentry retrievesall",
        "cost": "endbranch discard1H; responsebranch consumes1 qualifyingH, never pilecard",
        "trigger_gate": "end ownerH>0; conversion pilecount>=1; return existingpile",
        "targets": "one other actor for coercion, any side/range; self forpile/return",
        "effect": [
          "End: pay1H, then target may place1 ownH/E on owner general as Jieyue.",
          "If no contribution, owner chooses/discards1 targetH/E if any; target cannot choose which card to discard.",
          "While pile nonempty, redHAND asShan and blackHAND asWuxie, respecting legaluse/play windows.",
          "Conversions consume the HAND material; enablement pile not spent and grants no extra card.",
          "Preparation: compulsory gain ALL existingpile into ownerHAND, equipment included.",
          "No dying/death trigger; pile is not ownhand rescue/response material."
        ],
        "official_rule_text": "节钺[yuè],结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-yujin",
          "bwiki-yujin",
          "bwiki-jieyue-yujin",
          "official-ol-yujin-2016",
          "publisher-rule-glossary"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F6",
          "F7"
        ],
        "source_procedure_unknowns": [
          "Pile faceup visibility and skillloss/death/copy cleanup explicitly host policy, not current-client observed.",
          "H/E-only interpretation uses conventional ownership glossary and matching official2016 equipment examples; no newer mobile zone FAQ located."
        ]
      }
    ],
    "skill_ownership_policy": "All five selected source skills are intrinsic; no granted or personal-lord skill is omitted. Each owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "于禁",
    "source_variant": "基础身份／经典目录+明示F0–F9江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-109.html",
      "https://wiki.biligame.com/msgs/%E4%BA%8E%E7%A6%81",
      "https://wiki.biligame.com/msgs/%E8%8A%82%E9%92%BA/%E4%BA%8E%E7%A6%81",
      "https://www.sanguosha.com/news/20161117_1906_2717",
      "https://g.iqiyi.com/sanguosha/news/321004.html"
    ],
    "source_ids": [
      "mobile-yujin",
      "bwiki-yujin",
      "bwiki-jieyue-yujin",
      "official-ol-yujin-2016",
      "publisher-rule-glossary"
    ],
    "source_record_id": "sgs.adapted.base.hero.yu-jin:2026-10-15",
    "faction": "魏",
    "source_gender": "male",
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-yujin",
        "url": "https://www.sanguosha.cn/pc/hero-detail-109.html",
        "status": 200,
        "bytes": 21331,
        "sha256": "f1f96f558fdbeca2dae7ad03b1d29989f397fe88025cc66b741c82807557e236",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "raw_path": "evidence/mobile-yujin.html",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "于禁",
          "faction": "魏",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "audit": {
          "all_inline_panels_read": true,
          "mode_tabs": [
            "身份"
          ],
          "groups": [
            {
              "mode": "身份",
              "group_hidden": false,
              "panels": [
                {
                  "name": "节钺",
                  "hidden": false,
                  "rule_text": "节钺[yuè],结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。",
                  "rule_text_sha256": "a5a311c8a4e95c4ad4233efffec2f48ee27dc6fe9d8ce74f16532508aeb672f3",
                  "html_line": 183
                }
              ]
            }
          ],
          "selected_group": 0,
          "personal_lord_skills": [],
          "granted_skills": [],
          "inventory_complete_for_selected_identity_panel": true
        },
        "limitations": [
          "Undated catalog snapshot, not live client verification.",
          "HP/gender/initial HP have no explicit official numeric fields.",
          "Other mode groups retained only as excluded evidence."
        ]
      },
      {
        "id": "bwiki-yujin",
        "url": "https://wiki.biligame.com/msgs/%E4%BA%8E%E7%A6%81",
        "tier": "community_same_product_classic_metadata_and_rules_web_observation",
        "product": "三国杀移动版",
        "observation_path": "evidence/bwiki-yujin-web-observation.txt",
        "observation_sha256": "72943f239ff40aecc6750d8b9bb58e5b00f30106e77649db8c2f5af1e9fda67f",
        "raw_path": null,
        "access_date": "2026-10-15",
        "revision_id": 35813,
        "visible_update_date": "2026-01-10",
        "current_client_verified": false,
        "metadata": {
          "max_hp": 4,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典 base identity"
        },
        "limitations": [
          "Raw HTTP fetch returned567; webtool extracted observation retained, not a raw HTML claim.",
          "Visible revision date does not independently date transclusions.",
          "Classic HP numeric and icon count plus explicit game gender/faction read."
        ]
      },
      {
        "id": "bwiki-jieyue-yujin",
        "url": "https://wiki.biligame.com/msgs/%E8%8A%82%E9%92%BA/%E4%BA%8E%E7%A6%81",
        "tier": "community_same_product_exact_skill_variant_web_observation",
        "observation_path": "evidence/bwiki-jieyue-yujin-click-observation.txt",
        "observation_sha256": "af66473ac25604ce08b77f51b0177c9ca81b2c87e5cf2c8584481d066ee48a5e",
        "raw_path": null,
        "revision_id": 21004,
        "visible_update_date": "2023-01-17",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "visible_last_edit_local": "2023-01-17 22:26"
      },
      {
        "id": "official-ol-yujin-2016",
        "url": "https://www.sanguosha.com/news/20161117_1906_2717",
        "status": 200,
        "bytes": 42992,
        "sha256": "479fb35dbd7c99ed4683e326cb421858f2b23b59d644a55cc6e5bda10a341285",
        "access_date": "2026-10-15",
        "raw_path": "evidence/official-ol-yujin-2016.html",
        "current_client_verified": false,
        "tier": "official_other_product_historical_same_skill_variant",
        "publication_date_visible": "2016-11-17 17:19:06"
      },
      {
        "id": "publisher-rule-glossary",
        "url": "https://g.iqiyi.com/sanguosha/news/321004.html",
        "tier": "publisher_historical_other_product_glossary",
        "observation_path": "evidence/publisher-rule-glossary-web-observation.txt",
        "observation_sha256": "03b5ec74bf2d27a0a5599e04ed6a5d99fe95888a274e16d5811fbf2d7d53db14",
        "raw_path": null,
        "publication_date_visible": "2011-01-24",
        "revision_id": null,
        "current_client_verified": false,
        "access_date": "2026-10-15",
        "limitations": [
          "Only cited ownership/color terminology corroborates this packet; unrelated historic draw/death rules are not imported."
        ]
      }
    ],
    "lord_inventory_basis": "Every selected official inline identity panel was read; no intrinsic lord skill or granted skill exists in this packet.",
    "source_evidence_note": "官网完整身份技能与势力已核；体力上限和规则性别来自同产品社区经典身份公开观察。BWIKI未获得原始HTML，不冒称原始页面或现行客户端验证；显示更新日期不当作独立修订时间。初始满体力是F0宿主约定。",
    "source_unknowns": [
      {
        "hero": "于禁",
        "skill": "节钺",
        "detail": "Pile faceup visibility and skillloss/death/copy cleanup explicitly host policy, not current-client observed."
      },
      {
        "hero": "于禁",
        "skill": "节钺",
        "detail": "H/E-only interpretation uses conventional ownership glossary and matching official2016 equipment examples; no newer mobile zone FAQ located."
      }
    ],
    "aliases": [
      "三国杀于禁",
      "于禁·节钺",
      "yu-jin"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang-following/yu-jin.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F0",
        "title": "Source and initialization",
        "contract": "Selected base identity official full inventories only; direct initialHP=null. Normal-full-HP initialization is host policy. No intrinsic lord skill or grant exists in selected packets; identity mode itself remains pending. No client certification.",
        "basis": "Official all-tab inspection; dated same-product metadata.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F1",
        "title": "Transactional events and effective skills",
        "contract": "Stable movement/phase/turn/damage/card-use IDs; receipt before nested callbacks; stale UI revalidation; actual physical cards exactly once. All skill checks through effective skill ledger, including Duanchang and HuaMuLan. Copied male packet copies complete intrinsic template/maxHP, not another owner markers/piles. Hidden enemy hand choices blind; visible E/J selectable.",
        "basis": "Shared host implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F2",
        "title": "Sanyao commitment",
        "contract": "Once per actual owner play-phase ID, discard exactly one legal H/E material and select any living currentHP-maximum actor including tied maxima/self. No distance/faction/handcount gate. Snapshot legal target at commitment; ordinary payment/loss callbacks run, then if owner and target still active deal1 ordinary source damage. Mark quota before nested callbacks. No refund after cost commitment.",
        "basis": "Official mobile core; official OL2016 matching variant confirms E cost, ties and no distance. Nested interruptions are host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F3",
        "title": "Zhiman cancellation",
        "contract": "Offer owner at source causing-damage window against OTHER actor, before receiver transfer/prevention/armor and before HP decrement. Once per actual damage EVENT, not point, any source damage incl skill/offturn/each independently created chain branch. Accept cancels entire pending damage; gain one eligible target E/J into owner H if any. Empty E/J does not prevent cancellation. No source damage history, after-damage, dying or new chain propagation from prevented event. Self-damage never eligible.",
        "basis": "Official mobile text; dated mobile guide36 puts Zhiman before receiver RenShi; matching OL2016 empty-zone/offturn/equipment FAQ. Shared event semantics.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F4",
        "title": "Jiangchi draw and turn markers",
        "contract": "Only an existing normal draw-phase quantity operation: optionally +1 draw plus forbid all Slash USE and PLAY for rest of current turn, OR -1 draw plus no distance and +1 normal Slash-use allowance for rest of current turn, OR decline. Decide before actual draw, not after seeing cards. Replaced/skipped normal draw has no offer. Positive ban overrides crossbow and forced/virtual Slash, Duel/Nanman responses. Attack branch no extra target and no damage bonus.",
        "basis": "Official mobile and dated same-product classic text; baseline draw/Slash card policy separate.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F5",
        "title": "Jiangchi shared stacking",
        "contract": "Shared host policy: branch markers bind actual turnID and survive resolved skill removal; clear at true turn-finally/death. Multiple genuine draw phases produce one opportunity each; +1 allowances additive with independently earned positive modifiers, prohibition wins, unlimited weapon remains unlimited unless banned. Distance waiver does not bypass hard prohibitions, alter weapon range value for unrelated skills, or grant extra targets. Existing draw-replacement selection resolves before modifiers.",
        "basis": "Cross-game host stacking and phase architecture, not claimed canonical mobile exotic procedure.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F6",
        "title": "Jieyue four branches",
        "contract": "At each genuine owner end-phase entry optionally discard exactly1 HAND card and choose one OTHER actor. Target chooses1 own H/E to put on owner Jieyue pile; if it does not contribute owner discards1 target H/E, if any. No distance/faction requirement. End-phase starts after ordinary discard, not arbitrary turn-finally. With at least1 extant Jieyue pile card, optional one RED H->Shan or one BLACK H->Wuxie at legal card-use/play windows. The selected HAND material is spent, pile stays. At owner actual preparation entry compulsory gain ALL extant Jieyue cards into hand, emptying pile.",
        "basis": "Official mobile complete one-skill text; exact mobile skillpage; exact-matching officialOL2016 target selfchooses incl equipment and preparatory gain. H/E conventional ownership corroborated by2011 publisher glossary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F7",
        "title": "Jieyue zones and lifecycle",
        "contract": "Pile is a separate owner-bound public physical zone, not hand/equipment, not ordinary Snatch/Dismantle targetable, not eligible response/heal material. Target equipment contribution runs real leave/loss hooks. Every grant/decline/cost and preparation retrieval has stable receipt. Multiple end phases may accumulate; retrieval gains all. Empty target may legally receive offer and cost yields no effect if no eligible card remains. Host policy: pile faceup; skill removal or owner death discards pile once, no preparation retrieval without skill; copies start empty. Derived cards obey leave/destroy rules rather than recreated cards.",
        "basis": "Persistent physical-pile source core; visibility/removal/copy/interruption are disclosed cross-game host contracts. No mode-lord dependency intrinsic.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F8",
        "title": "Yaowu pending damage window",
        "contract": "Locked once per red effective-Slash damage EVENT reaching owner receiver damage window, before HP decrement/rescue/death. Actual damage source chooses recover1 if wounded or draw1; fullHP forces draw. Not per damage point. Black/colorless Slash, nonSlash damage and HP loss do nothing. Real/virtual/view-as red Slash qualify; carried red-Slash channel on elemental chain damage qualifies under mobile catalog example. Source must exist and still be an active role to gain effect.",
        "basis": "Official mobile received-damage wording and chain example; dated same-product FAQ source choice/fullHP/conversion/dodge. No victim-survival condition can be added before impending lethal damage.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F9",
        "title": "Yaowu scheduler and color",
        "contract": "Effective card identity/color is frozen from actual use, not discarded-material scan or printed sourcehero. Two-material virtual red only if bothred; mixed colors colorless. Source damage prevention (Zhiman) happens first and prevents receiver event entirely. At receiver stage apply shared action-order provider scheduler; once benefit resolves, later cancellation does not roll back. A transfer reevaluates actualrecipient, not originalcardtarget. Shared compatibility ordering for multiple foreign receiver effects is host policy, not a guessed mobile precedence.",
        "basis": "Mobile FAQ for transformedSlash colors and no-benefit when dodged; shared damage-event transaction and foreign-skill ordering contract.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整五项固有技能按选定移动版基础身份经典目录保留；F0–F9明示初始化、来源伤害取消、摸牌与杀禁令、实体节钺牌堆及扣血前耀武时序。当前客户端与完整身份模式未核；华雄是经典耀武，不混入2012恃勇或界/谋/国战变体。",
    "skill_callback_modules": {
      "sgs.jieyue": "sgs-following-jieyue-skills.js"
    },
    "gender_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-yujin",
      "revision_id": 35813,
      "visible_update_date": "2026-01-10",
      "revision_timestamp_utc": null,
      "official_field_verified": false,
      "evidence_kind": "community_same_product_classic_metadata_and_rules_web_observation",
      "observation_sha256": "72943f239ff40aecc6750d8b9bb58e5b00f30106e77649db8c2f5af1e9fda67f"
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-yujin"
      ],
      "revision_id": 35813,
      "visible_update_date": "2026-01-10",
      "revision_timestamp_utc": null,
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "F0",
      "display_note": "体力上限来自同产品社区经典数值与勾玉图标公开观察，官网无数值HP字段。独立initialHP未观察；满体力开局为F0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.yu-jin",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "于禁",
      "faction": "魏",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "F0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "节钺"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "节钺"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "skills": [
          {
            "id": "sgs.jieyue",
            "name": "节钺",
            "type": "optional_endphase_coercion_and_viewas_with_compulsory_preparation_return",
            "timing": "own endphase; conditional legal Shan/Wuxie windows; own preparation",
            "quota": "one optional per genuine end-phase entry; no intrinsic view-as count cap; once prepentry retrievesall",
            "cost": "endbranch discard1H; responsebranch consumes1 qualifyingH, never pilecard",
            "trigger_gate": "end ownerH>0; conversion pilecount>=1; return existingpile",
            "targets": "one other actor for coercion, any side/range; self forpile/return",
            "effect": [
              "End: pay1H, then target may place1 ownH/E on owner general as Jieyue.",
              "If no contribution, owner chooses/discards1 targetH/E if any; target cannot choose which card to discard.",
              "While pile nonempty, redHAND asShan and blackHAND asWuxie, respecting legaluse/play windows.",
              "Conversions consume the HAND material; enablement pile not spent and grants no extra card.",
              "Preparation: compulsory gain ALL existingpile into ownerHAND, equipment included.",
              "No dying/death trigger; pile is not ownhand rescue/response material."
            ],
            "official_rule_text": "节钺[yuè],结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-yujin",
              "bwiki-yujin",
              "bwiki-jieyue-yujin",
              "official-ol-yujin-2016",
              "publisher-rule-glossary"
            ],
            "policy_refs": [
              "F0",
              "F1",
              "F6",
              "F7"
            ],
            "source_procedure_unknowns": [
              "Pile faceup visibility and skillloss/death/copy cleanup explicitly host policy, not current-client observed.",
              "H/E-only interpretation uses conventional ownership glossary and matching official2016 equipment examples; no newer mobile zone FAQ located."
            ]
          }
        ]
      },
      "signature_sha256": "20e0955c18b47880fd8d2336805561b3d879e60583833c9eb994f786a3e3509c",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 90,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "90ed7301ef7a78f6cd8ce7cd4840b8badba70eca",
      "comparison_scope": "Exhaustive actual90+7alias universe, not entire public all-hero universe. 比干 is absent from actual90,7aliases and locally available verified YXS packet records; no invented 比干 signature or merge. 张春华 blocked and not counted.",
      "reason": "4HP full packet combines endphase discard1H coercive other H/E contribution-or-discard, persistent card pile enabling redH-Shan/blackH-Wuxie without consuming pile, and compulsory preparation gain-all. No existing equalHP packet has this lifecycle.",
      "same_name_collisions": []
    }
  },
  {
    "id": "sgs.adapted.base.hero.hua-xiong",
    "source_name": "华雄",
    "suggested_display_name": "华雄",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "群",
    "max_hp": 6,
    "gender": "male",
    "starting_hp": 6,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "F0 host normal-full-HP initialization, not independently documented mobile starting HP",
    "source_refs": [
      "mobile-huaxiong",
      "bwiki-huaxiong"
    ],
    "metadata_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "耀武"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_disclosed_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.yaowu",
        "name": "耀武",
        "type": "locked_receiver_damage_trigger_with_source_choice",
        "timing": "receiving red-Slash damage, before HP decrement",
        "quota": "once per damage EVENT regardless points, no turn limit",
        "cost": "none",
        "trigger_gate": "pending positive damage channel is effective redSlash; actualsource exists",
        "targets": "actual damage source, not holder choice or original carduser",
        "effect": [
          "Source must choose recover1HP or draw1card; if fullHP onlydraw.",
          "Trigger before lethal damage/dying, no requirement holder survives.",
          "No owner benefit for black/colorlessSlash; no activation for nonSlash or HP loss.",
          "Virtual redSlash qualifies; actual color computed from materials per shared card rules."
        ],
        "official_rule_text": "锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-huaxiong",
          "bwiki-huaxiong"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F8",
          "F9"
        ],
        "source_procedure_unknowns": [
          "Multiple foreign receiving-damage cancellation/transfer ordering explicitly host scheduler."
        ]
      }
    ],
    "excluded_variants": [
      "界/谋 nonredSlash selfdraw branch excluded.",
      "将华雄恃勇 maxHP loss excluded.",
      "国战 awakening/death faction effects and PVE 魔躯 excluded."
    ],
    "ui_requirements": [
      "Complete intrinsic skill list, source variant and verification status visible.",
      "Original-created art only; source illustrations are not application assets.",
      "Never expose opponent hand identities for blind selections."
    ],
    "source_pack_note": "Selected catalog150 classic base identity corresponds to standard-era 华雄, NOT old 一将成名2012 恃勇 variant. This is an explicit replacement whole variant.",
    "skill_ids": [
      "sgs.yaowu"
    ],
    "name": "华雄",
    "display_name": "华雄",
    "skill_name": "耀武",
    "skill_desc": "耀武：锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌",
    "intrinsic_skill_ids": [
      "sgs.yaowu"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.yaowu"
    ],
    "complete_skill_names": [
      "耀武"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.yaowu",
        "name": "耀武",
        "type": "locked_receiver_damage_trigger_with_source_choice",
        "timing": "receiving red-Slash damage, before HP decrement",
        "quota": "once per damage EVENT regardless points, no turn limit",
        "cost": "none",
        "trigger_gate": "pending positive damage channel is effective redSlash; actualsource exists",
        "targets": "actual damage source, not holder choice or original carduser",
        "effect": [
          "Source must choose recover1HP or draw1card; if fullHP onlydraw.",
          "Trigger before lethal damage/dying, no requirement holder survives.",
          "No owner benefit for black/colorlessSlash; no activation for nonSlash or HP loss.",
          "Virtual redSlash qualifies; actual color computed from materials per shared card rules."
        ],
        "official_rule_text": "锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-huaxiong",
          "bwiki-huaxiong"
        ],
        "policy_refs": [
          "F0",
          "F1",
          "F8",
          "F9"
        ],
        "source_procedure_unknowns": [
          "Multiple foreign receiving-damage cancellation/transfer ordering explicitly host scheduler."
        ]
      }
    ],
    "skill_ownership_policy": "All five selected source skills are intrinsic; no granted or personal-lord skill is omitted. Each owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "华雄",
    "source_variant": "基础身份／经典目录+明示F0–F9江湖适配；标准时代耀武，非一将2012恃勇",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-150.html",
      "https://wiki.biligame.com/msgs/%E5%8D%8E%E9%9B%84"
    ],
    "source_ids": [
      "mobile-huaxiong",
      "bwiki-huaxiong"
    ],
    "source_record_id": "sgs.adapted.base.hero.hua-xiong:2026-10-15",
    "faction": "群",
    "source_gender": "male",
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-huaxiong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-150.html",
        "status": 200,
        "bytes": 21494,
        "sha256": "1609bfe928ed0ac32e369c0c710f765975359a736ac34ba698c30946516398e0",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "raw_path": "evidence/mobile-huaxiong.html",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "华雄",
          "faction": "群",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "audit": {
          "all_inline_panels_read": true,
          "mode_tabs": [
            "身份"
          ],
          "groups": [
            {
              "mode": "身份",
              "group_hidden": false,
              "panels": [
                {
                  "name": "耀武",
                  "hidden": false,
                  "rule_text": "锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌",
                  "rule_text_sha256": "044b4078a5f045d86c7a1778223797b34e17263563bb17a6e421c7ead1bac9b4",
                  "html_line": 186
                }
              ]
            }
          ],
          "selected_group": 0,
          "personal_lord_skills": [],
          "granted_skills": [],
          "inventory_complete_for_selected_identity_panel": true
        },
        "limitations": [
          "Undated catalog snapshot, not live client verification.",
          "HP/gender/initial HP have no explicit official numeric fields.",
          "Other mode groups retained only as excluded evidence."
        ]
      },
      {
        "id": "bwiki-huaxiong",
        "url": "https://wiki.biligame.com/msgs/%E5%8D%8E%E9%9B%84",
        "tier": "community_same_product_classic_metadata_and_rules_web_observation",
        "product": "三国杀移动版",
        "observation_path": "evidence/bwiki-huaxiong-web-observation.txt",
        "observation_sha256": "0b31b140498a6b019ee8d4d3496580f1e3682f20ea34a73c56502c689cfeaaed",
        "raw_path": null,
        "access_date": "2026-10-15",
        "revision_id": 38784,
        "visible_update_date": "2025-12-19",
        "current_client_verified": false,
        "metadata": {
          "max_hp": 6,
          "gender": "male",
          "faction": "群",
          "initial_hp_explicit": null,
          "selected_section": "经典 base identity"
        },
        "limitations": [
          "Exact public search result retained; full-page open timed out.",
          "Classic numericHP and sixicons plus game gender/faction visible in search observation.",
          "Visible update2025-12-19 differs from search index Published4months; no raw revision timestamp verified."
        ],
        "observation_type": "public_search_extracted_text"
      }
    ],
    "lord_inventory_basis": "Every selected official inline identity panel was read; no intrinsic lord skill or granted skill exists in this packet.",
    "source_evidence_note": "官网完整身份技能与势力已核；体力上限和规则性别来自同产品社区经典身份公开观察。BWIKI未获得原始HTML，不冒称原始页面或现行客户端验证；显示更新日期不当作独立修订时间。初始满体力是F0宿主约定。",
    "source_unknowns": [
      {
        "hero": "华雄",
        "skill": "耀武",
        "detail": "Multiple foreign receiving-damage cancellation/transfer ordering explicitly host scheduler."
      }
    ],
    "aliases": [
      "三国杀华雄",
      "华雄·耀武",
      "hua-xiong"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang-following/hua-xiong.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F0",
        "title": "Source and initialization",
        "contract": "Selected base identity official full inventories only; direct initialHP=null. Normal-full-HP initialization is host policy. No intrinsic lord skill or grant exists in selected packets; identity mode itself remains pending. No client certification.",
        "basis": "Official all-tab inspection; dated same-product metadata.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F1",
        "title": "Transactional events and effective skills",
        "contract": "Stable movement/phase/turn/damage/card-use IDs; receipt before nested callbacks; stale UI revalidation; actual physical cards exactly once. All skill checks through effective skill ledger, including Duanchang and HuaMuLan. Copied male packet copies complete intrinsic template/maxHP, not another owner markers/piles. Hidden enemy hand choices blind; visible E/J selectable.",
        "basis": "Shared host implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F2",
        "title": "Sanyao commitment",
        "contract": "Once per actual owner play-phase ID, discard exactly one legal H/E material and select any living currentHP-maximum actor including tied maxima/self. No distance/faction/handcount gate. Snapshot legal target at commitment; ordinary payment/loss callbacks run, then if owner and target still active deal1 ordinary source damage. Mark quota before nested callbacks. No refund after cost commitment.",
        "basis": "Official mobile core; official OL2016 matching variant confirms E cost, ties and no distance. Nested interruptions are host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F3",
        "title": "Zhiman cancellation",
        "contract": "Offer owner at source causing-damage window against OTHER actor, before receiver transfer/prevention/armor and before HP decrement. Once per actual damage EVENT, not point, any source damage incl skill/offturn/each independently created chain branch. Accept cancels entire pending damage; gain one eligible target E/J into owner H if any. Empty E/J does not prevent cancellation. No source damage history, after-damage, dying or new chain propagation from prevented event. Self-damage never eligible.",
        "basis": "Official mobile text; dated mobile guide36 puts Zhiman before receiver RenShi; matching OL2016 empty-zone/offturn/equipment FAQ. Shared event semantics.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F4",
        "title": "Jiangchi draw and turn markers",
        "contract": "Only an existing normal draw-phase quantity operation: optionally +1 draw plus forbid all Slash USE and PLAY for rest of current turn, OR -1 draw plus no distance and +1 normal Slash-use allowance for rest of current turn, OR decline. Decide before actual draw, not after seeing cards. Replaced/skipped normal draw has no offer. Positive ban overrides crossbow and forced/virtual Slash, Duel/Nanman responses. Attack branch no extra target and no damage bonus.",
        "basis": "Official mobile and dated same-product classic text; baseline draw/Slash card policy separate.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F5",
        "title": "Jiangchi shared stacking",
        "contract": "Shared host policy: branch markers bind actual turnID and survive resolved skill removal; clear at true turn-finally/death. Multiple genuine draw phases produce one opportunity each; +1 allowances additive with independently earned positive modifiers, prohibition wins, unlimited weapon remains unlimited unless banned. Distance waiver does not bypass hard prohibitions, alter weapon range value for unrelated skills, or grant extra targets. Existing draw-replacement selection resolves before modifiers.",
        "basis": "Cross-game host stacking and phase architecture, not claimed canonical mobile exotic procedure.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F6",
        "title": "Jieyue four branches",
        "contract": "At each genuine owner end-phase entry optionally discard exactly1 HAND card and choose one OTHER actor. Target chooses1 own H/E to put on owner Jieyue pile; if it does not contribute owner discards1 target H/E, if any. No distance/faction requirement. End-phase starts after ordinary discard, not arbitrary turn-finally. With at least1 extant Jieyue pile card, optional one RED H->Shan or one BLACK H->Wuxie at legal card-use/play windows. The selected HAND material is spent, pile stays. At owner actual preparation entry compulsory gain ALL extant Jieyue cards into hand, emptying pile.",
        "basis": "Official mobile complete one-skill text; exact mobile skillpage; exact-matching officialOL2016 target selfchooses incl equipment and preparatory gain. H/E conventional ownership corroborated by2011 publisher glossary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F7",
        "title": "Jieyue zones and lifecycle",
        "contract": "Pile is a separate owner-bound public physical zone, not hand/equipment, not ordinary Snatch/Dismantle targetable, not eligible response/heal material. Target equipment contribution runs real leave/loss hooks. Every grant/decline/cost and preparation retrieval has stable receipt. Multiple end phases may accumulate; retrieval gains all. Empty target may legally receive offer and cost yields no effect if no eligible card remains. Host policy: pile faceup; skill removal or owner death discards pile once, no preparation retrieval without skill; copies start empty. Derived cards obey leave/destroy rules rather than recreated cards.",
        "basis": "Persistent physical-pile source core; visibility/removal/copy/interruption are disclosed cross-game host contracts. No mode-lord dependency intrinsic.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F8",
        "title": "Yaowu pending damage window",
        "contract": "Locked once per red effective-Slash damage EVENT reaching owner receiver damage window, before HP decrement/rescue/death. Actual damage source chooses recover1 if wounded or draw1; fullHP forces draw. Not per damage point. Black/colorless Slash, nonSlash damage and HP loss do nothing. Real/virtual/view-as red Slash qualify; carried red-Slash channel on elemental chain damage qualifies under mobile catalog example. Source must exist and still be an active role to gain effect.",
        "basis": "Official mobile received-damage wording and chain example; dated same-product FAQ source choice/fullHP/conversion/dodge. No victim-survival condition can be added before impending lethal damage.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "F9",
        "title": "Yaowu scheduler and color",
        "contract": "Effective card identity/color is frozen from actual use, not discarded-material scan or printed sourcehero. Two-material virtual red only if bothred; mixed colors colorless. Source damage prevention (Zhiman) happens first and prevents receiver event entirely. At receiver stage apply shared action-order provider scheduler; once benefit resolves, later cancellation does not roll back. A transfer reevaluates actualrecipient, not originalcardtarget. Shared compatibility ordering for multiple foreign receiver effects is host policy, not a guessed mobile precedence.",
        "basis": "Mobile FAQ for transformedSlash colors and no-benefit when dodged; shared damage-event transaction and foreign-skill ordering contract.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整五项固有技能按选定移动版基础身份经典目录保留；F0–F9明示初始化、来源伤害取消、摸牌与杀禁令、实体节钺牌堆及扣血前耀武时序。当前客户端与完整身份模式未核；华雄是经典耀武，不混入2012恃勇或界/谋/国战变体。",
    "skill_callback_modules": {
      "sgs.yaowu": "sgs-following-jieyue-skills.js"
    },
    "gender_provenance": {
      "max_hp": "dated same-product BWIKI classic explicit number+icons",
      "gender": "same-product explicit game gender",
      "faction": "official and same-product classic",
      "initial_hp": "not separately documented",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-huaxiong",
      "revision_id": 38784,
      "visible_update_date": "2025-12-19",
      "revision_timestamp_utc": null,
      "official_field_verified": false,
      "evidence_kind": "community_same_product_classic_metadata_and_rules_web_observation",
      "observation_sha256": "0b31b140498a6b019ee8d4d3496580f1e3682f20ea34a73c56502c689cfeaaed"
    },
    "hp_evidence": {
      "value": 6,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-huaxiong"
      ],
      "revision_id": 38784,
      "visible_update_date": "2025-12-19",
      "revision_timestamp_utc": null,
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "F0",
      "display_note": "体力上限来自同产品社区经典数值与勾玉图标公开观察，官网无数值HP字段。独立initialHP未观察；满体力开局为F0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.hua-xiong",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "华雄",
      "faction": "群",
      "gender": "male",
      "max_hp": 6,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "F0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "耀武"
      ],
      "complete_signature": {
        "max_hp": 6,
        "intrinsic_skill_inventory": [
          "耀武"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "skills": [
          {
            "id": "sgs.yaowu",
            "name": "耀武",
            "type": "locked_receiver_damage_trigger_with_source_choice",
            "timing": "receiving red-Slash damage, before HP decrement",
            "quota": "once per damage EVENT regardless points, no turn limit",
            "cost": "none",
            "trigger_gate": "pending positive damage channel is effective redSlash; actualsource exists",
            "targets": "actual damage source, not holder choice or original carduser",
            "effect": [
              "Source must choose recover1HP or draw1card; if fullHP onlydraw.",
              "Trigger before lethal damage/dying, no requirement holder survives.",
              "No owner benefit for black/colorlessSlash; no activation for nonSlash or HP loss.",
              "Virtual redSlash qualifies; actual color computed from materials per shared card rules."
            ],
            "official_rule_text": "锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-huaxiong",
              "bwiki-huaxiong"
            ],
            "policy_refs": [
              "F0",
              "F1",
              "F8",
              "F9"
            ],
            "source_procedure_unknowns": [
              "Multiple foreign receiving-damage cancellation/transfer ordering explicitly host scheduler."
            ]
          }
        ]
      },
      "signature_sha256": "5dde9350112347e0abf3af0369ca872e6b7772ff2ea30a8ee673cea783dee0bf",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 90,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "90ed7301ef7a78f6cd8ce7cd4840b8badba70eca",
      "comparison_scope": "Exhaustive actual90+7alias universe, not entire public all-hero universe. 比干 is absent from actual90,7aliases and locally available verified YXS packet records; no invented 比干 signature or merge. 张春华 blocked and not counted.",
      "reason": "6HP full intrinsic sole locked red-Slash RECEIVING-damage event makes actualSOURCE choose heal1 or draw1 before owner HP loss; no nonred selfdraw or maxHP loss. No existing6HP template, and no lowerHP packet has this complete negative skill.",
      "same_name_collisions": []
    }
  }
];
export const SGS_YIJIANG_FOLLOWING_DEFINITIONS = Object.freeze(definitions);
