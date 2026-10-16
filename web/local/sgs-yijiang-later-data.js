/** V29 selected source packets. Only parent-validated runtime registration may set tested. */
const definitions = [
  {
    "key": "caochong",
    "id": "sgs.adapted.base.hero.cao-chong",
    "source_name": "曹冲",
    "suggested_display_name": "曹冲",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "魏",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host full-max-HP initialization; independent initialHP unknown",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 123,
    "source_refs": [
      "mobile-caochong",
      "bwiki-caochong"
    ],
    "intrinsic_skill_inventory": [
      "称象",
      "仁心"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "source_ready_with_explicit_host_requirements",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.chengxiang",
        "name": "称象",
        "type": "optional_after_damage_reveal_subset_obtain",
        "timing": "After owner receives one resolved damage EVENT and remains living after rescue",
        "quota": "No turn quota; once per actual damage event, regardless of amount",
        "cost": "No card or HP cost",
        "targets": "Owner; reveals actual top 4 cards publicly",
        "effects": [
          "Optionally reveal 4 from deck. Choose any subset whose point SUM<=13, including a K alone or combinations totaling exactly 13.",
          "Obtain selected subset into own hand; put all other revealed cards into discard. This is not draw 4 and discard H, a judgment, or random card selection.",
          "No per-damage-point repetition: one damage packet of 2 gives one reveal 4 opportunity; two separate events may each trigger."
        ],
        "official_rule_text": "当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caochong",
          "mobile-skill-adjustment-2015",
          "bwiki-chengxiang"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P7",
          "P9",
          "P10"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.renxin",
        "name": "仁心",
        "type": "optional_global_pre_damage_prevention",
        "timing": "OTHER actor currently HP=1 is about to receive positive damage",
        "quota": "No once/turn or once/game quota; each actual pending damage can offer; no duplicate on same event per owner",
        "cost": "Owner actually flips, AND discards exactly 1 equipment CARD from HAND or EQUIPMENT",
        "targets": "Any OTHER living final damage receiver at HP exactly 1; self excluded; allies and enemies legal; no range",
        "effects": [
          "After cost, prevent the ENTIRE pending damage, not reduce damage by 1 and not recover HP.",
          "No dying restriction:HP=1 prior to damage; anHP 2 actor taking 2 is ineligible;HP 0 or negative actor is not hp 1.",
          "Source may be absent; no damage-source condition. Face-down holder can toggle face-up; no forced-face-down prerequisite.",
          "No all-hand transfer, rescue-card use, granted skill, delayed effect or lifetime limited marker."
        ],
        "official_rule_text": "当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-caochong",
          "mobile-skill-adjustment-2015",
          "bwiki-renxin"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P7",
          "P8"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "skill_ids": [
      "sgs.chengxiang",
      "sgs.renxin"
    ],
    "intrinsic_unresolved": [],
    "ui_requirements": [
      "称象 public 4-card tray with exact ranks, running sum, allowed<=13, chosen/unselected and confirm/cancel.",
      "仁心 owner prompt identifies final other receiver hp 1 and damage amount; exact equipment cost and flip preview; prevent whole damage.",
      "Show that face-down owner may flip up; no once/game icon; do not expose another hand."
    ],
    "ai_policy": [
      "称象 optimizes subsets of at most 4 publicly revealed cards with sum <= 13 using own priorities. No hidden deck peek.",
      "仁心 typically saves allies and declines enemies; enumerate all OTHER legal targets before AI preference. Compare survival value to actual equipment/flip cost."
    ],
    "excluded_variants": [
      "Old称象 sum<13 excluded.",
      "Old仁心 dying flip+all hand give+heal 1 excluded.",
      "No skin-based duplicate heroes."
    ],
    "name": "曹冲",
    "display_name": "曹冲",
    "skill_name": "称象/仁心",
    "skill_desc": "称象：当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。 仁心：当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。",
    "source_character_name": "曹冲",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀曹冲",
      "cao-chong"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-123.html",
      "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%86%B2",
      "https://wiki.biligame.com/msgs/%E7%A7%B0%E8%B1%A1",
      "https://wiki.biligame.com/msgs/%E4%BB%81%E5%BF%83",
      "https://www.sanguosha.cn/pc/news-detail-98.html"
    ],
    "source_records": [
      {
        "id": "mobile-caochong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-123.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-123.html",
        "status": 200,
        "bytes": 21400,
        "sha256": "b9566793e3087ec2094ff2071ea0c576741b9774c2851eedf28f50628258666c",
        "accessed_at": "2026-10-15T23:09:36.047479+00:00",
        "raw_path": "evidence/mobile-caochong.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
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
                  "name": "称象",
                  "hidden": false,
                  "rule_text": "当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。",
                  "rule_sha256": "1bd2891360a20d304c95eb27c1cf515bb5e07fcb97e4158d6d9a85fc48b77f79",
                  "html_line": 184
                },
                {
                  "name": "仁心",
                  "hidden": true,
                  "rule_text": "当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。",
                  "rule_sha256": "dec7b3c089ac4629bc9cf10eab6ab6cea121ba4dca6b59e3f4043f709fd99802",
                  "html_line": 185
                }
              ]
            }
          ],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "魏"
        },
        "limitations": [
          "Undated public catalog, not a logged-in 2026 client audit.",
          "No explicit numeric maxHP or gameplay gender field in this official HTML. Skins are not rules variants."
        ]
      },
      {
        "id": "bwiki-caochong",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%86%B2",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%86%B2",
        "status": 200,
        "bytes": 103160,
        "sha256": "6b0ba31980f573b4e915961baacd0eb3a406dd8e0b8c4e304d2a6bced4450e8c",
        "accessed_at": "2026-10-15T23:09:38.430058+00:00",
        "raw_path": "evidence/bwiki-caochong.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 35950,
        "modified_at": "2026-01-16T08:50:37Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典, not historical/国战/界 variants",
          "hp_html_line": 665,
          "gender_html_line": 656,
          "faction_html_line": 657,
          "gender_excerpt": ">性别男 势力魏 <p class=",
          "faction_excerpt": ">势力魏 别称冲儿、虫儿 <div class=\"锚点\" style=\"position:",
          "classic_section_html_line": 661,
          "hp_hidden_numeric_html_line": 665,
          "hp_evidence_locator": "First classic-section HP icon row and hidden numeric span; section heading recorded separately."
        }
      },
      {
        "id": "bwiki-chengxiang",
        "url": "https://wiki.biligame.com/msgs/%E7%A7%B0%E8%B1%A1",
        "final_url": "https://wiki.biligame.com/msgs/%E7%A7%B0%E8%B1%A1",
        "status": 200,
        "bytes": 72422,
        "sha256": "d7cc459c868cf48c34bc993590748a1079a2027c2d9f5c36c25f3dd34a264717",
        "accessed_at": "2026-10-15T23:09:40.933987+00:00",
        "raw_path": "evidence/bwiki-chengxiang.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 34250,
        "modified_at": "2025-11-11T14:03:34Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ]
      },
      {
        "id": "bwiki-renxin",
        "url": "https://wiki.biligame.com/msgs/%E4%BB%81%E5%BF%83",
        "final_url": "https://wiki.biligame.com/msgs/%E4%BB%81%E5%BF%83",
        "status": 200,
        "bytes": 72241,
        "sha256": "7fb309ef8cf970dd58680f0a59e905f873339de6362f380eecdca501097fafd7",
        "accessed_at": "2026-10-15T23:09:40.318152+00:00",
        "raw_path": "evidence/bwiki-renxin.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 34251,
        "modified_at": "2025-11-11T14:04:23Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ]
      },
      {
        "id": "mobile-skill-adjustment-2015",
        "url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "final_url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "status": 200,
        "bytes": 27188,
        "sha256": "cdf72dbb68a460995748ec57e97ddf95183cbb873e869738d4efb4b175caa21e",
        "accessed_at": "2026-10-15T23:11:13.195205+00:00",
        "raw_path": "evidence/mobile-skill-adjustment-2015.html",
        "current_client_verified": false,
        "publication_date": "2015-12-01 11:49:59",
        "tier": "official_same_product_dated_change_notice",
        "product": "三国杀移动版",
        "supports": [
          "曹冲 revised 称象 <=13 and unchosen cards enter discard; revised 仁心 prevents the complete damage to OTHER actor with1HP, at flip+equipment-discard cost."
        ],
        "limitations": [
          "Dated original→new table, not an assertion of all2026 client details."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.chengxiang",
        "name": "称象",
        "type": "optional_after_damage_reveal_subset_obtain",
        "timing": "After owner receives one resolved damage EVENT and remains living after rescue",
        "quota": "No turn quota; once per actual damage event, regardless of amount",
        "cost": "No card or HP cost",
        "targets": "Owner; reveals actual top 4 cards publicly",
        "effects": [
          "Optionally reveal 4 from deck. Choose any subset whose point SUM<=13, including a K alone or combinations totaling exactly 13.",
          "Obtain selected subset into own hand; put all other revealed cards into discard. This is not draw 4 and discard H, a judgment, or random card selection.",
          "No per-damage-point repetition: one damage packet of 2 gives one reveal 4 opportunity; two separate events may each trigger."
        ],
        "official_rule_text": "当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caochong",
          "mobile-skill-adjustment-2015",
          "bwiki-chengxiang"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P7",
          "P9",
          "P10"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.renxin",
        "name": "仁心",
        "type": "optional_global_pre_damage_prevention",
        "timing": "OTHER actor currently HP=1 is about to receive positive damage",
        "quota": "No once/turn or once/game quota; each actual pending damage can offer; no duplicate on same event per owner",
        "cost": "Owner actually flips, AND discards exactly 1 equipment CARD from HAND or EQUIPMENT",
        "targets": "Any OTHER living final damage receiver at HP exactly 1; self excluded; allies and enemies legal; no range",
        "effects": [
          "After cost, prevent the ENTIRE pending damage, not reduce damage by 1 and not recover HP.",
          "No dying restriction:HP=1 prior to damage; anHP 2 actor taking 2 is ineligible;HP 0 or negative actor is not hp 1.",
          "Source may be absent; no damage-source condition. Face-down holder can toggle face-up; no forced-face-down prerequisite.",
          "No all-hand transfer, rescue-card use, granted skill, delayed effect or lifetime limited marker."
        ],
        "official_rule_text": "当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-caochong",
          "mobile-skill-adjustment-2015",
          "bwiki-renxin"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P7",
          "P8"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.chengxiang",
      "sgs.renxin"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.chengxiang",
      "sgs.renxin"
    ],
    "complete_skill_names": [
      "称象",
      "仁心"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed-automated-rules-ui-replay-acceptance",
    "production_integration_status": "integrated-private-release",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "title": "Scope and initial HP",
        "rule": "This is a base identity public-catalog snapshot dated 2026-10-15; no Skins, no OL/界/国战 branches. Initial HP itself is not separately sourced, so host full-max initialization is disclosed. Max HP/gender/faction are actual classic same-product dated community fields cross checked against official faction. Keep all skills; do not raise playable counts before implementation/testing.",
        "basis": "Official full inline panels; BWIKI revision/date/HP icon+number.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P1",
        "title": "Event ownership and receipts",
        "rule": "Use real current effective skill ownership, stable actor/use/damage/movement/phase IDs, and JSON-safe receipts. Freeze event identity and revalidate after each awaited prompt. A declined optional activation has no cost; a completed cost cannot be paid twice on duplicate event, replay, repeated click or save reload. A removed skill is unavailable for a new activation. Do not let lifecycle copying mutate the immutable original source template.",
        "basis": "Existing hero lifecycle/general-skill descriptor and event ledger design; host compatibility.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P2",
        "title": "Lawful options versus AI",
        "rule": "Legal target enumeration must not depend on team, distance, faction or gender unless a source clause says so. AI may prefer allies for support and enemies for disruption, using public board and its own private cards only. AI never knows another actor hand faces or future deck order. UI must offer all legal choices to a human.",
        "basis": "Explicit team mode compatibility, not native identity-strategy certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P3",
        "title": "Broad card zones and foreign types",
        "rule": "Unqualified discard-one-card uses own HAND or EQUIPMENT, never judgment or personal piles; discard-hand uses HAND only. Card category is basic/trick/equipment, not concrete names; delayed trick belongs to trick. SGS names and foreign analogous families need explicit host mappings. Null/invalid ranks are never silently treated as 0,1,13; supported rank policy must be declared before 称象 encounters rank less foreign cards.",
        "basis": "Common source vocabulary and existing host material API; cross-game rank/category mappings are separate unverified host decisions.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P4",
        "title": "Delayed and extra phases",
        "rule": "Skills listen to event actor, not globally active UI owner. 龙吟 requires Slash user to be the owner of that real active PLAY phase, including actual extra play; another actor using Slash inside that phase does not qualify. No new whole turn/phase is created by any of these four heroes. 峻刑 quotas belong to each actual owner PLAY phase; 直言 belongs only to owner END-phase occur ren ce, not arbitrary global turn end. Flipping toggles face orientation; it does not immediately skip a currently running phase or force face-down.",
        "basis": "Selected source clauses plus actual V 28 phase and flip contracts.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P5",
        "title": "History versus quota",
        "rule": "Long yin excludes one committed Slash from its source PLAY-phase quota. Preserve immutable card-use history, physical card use, used-Slash flags, action activity for 克己/隐忍 and per-turn totals. Do not blindly decrement sha_count_this_turn: current host also uses it for original whole-turn allowances. Track phase quota exclusion by exact use receipt, clamp exempt counts at 0, and retain an already quota-free use as a real use. Whole-turn original limits remain their own explicit host rule.",
        "basis": "Mobile 龙吟 phase-use wording plus actual V 28 counter/history split; cross-game scope is host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P6",
        "title": "Window after commitment",
        "rule": "龙吟 is post-legal-use commitment, not permission to announce a second illegal Slash when quota is already exhausted. Finish initial card material-loss events and freeze final effective Slash face before offering; then resolve it before target response/damage. Removing the attacker weapon as cost does not retroactively cancel already committed target legality. Shared ordering among cross-game before-target mechanisms requires an explicit new global hook, not one offer per target.",
        "basis": "Mobile uses-when trigger; exact host hook ordering proposed. Current-client exotic nested priority not verified.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P7",
        "title": "Damage event cardinality",
        "rule": "称象 and 御策 trigger once per resolved damage EVENT, not once per damage point; a 2 damage event gets one chance. Use actual damage receiver after transfer and rescue; finally-dead holder cannot use ordinary after-damage abilities. Prevented damage and pure HP loss are not damage. 仁心 prevents complete pending damage, so no receiver after-damage, dying, card-damage benefit or chain propagation origin at es from prevented HP loss.",
        "basis": "Official Mobile 2015 explicitly一次伤害; catalog受伤 wording; current host damage event lifecycle. Cross-game callback order disclosed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P8",
        "title": "Ren xin global window and costs",
        "rule": "Offer all living effective 仁心 holders other than final damage receiver when receiver currently HP=1 and positive damage is about to reduce HP. Freeze exact damage_event_id and final receiver; source may be absent. Source core order is flip owner AND discard 1 equipment then prevent this entire damage. Pre validate selected card before irreversible flip; protect against stale/double commit. Use real flip toggle, even face-down→face-up. Equipment may be in hand or equipped. Do not require owner face-up or ally target.",
        "basis": "Official Mobile 123 hidden panel and 2015 notice. Placement after transfer/armor and global action-order arbitration are explicit shared-host ordering, not current-client precedence certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P9",
        "title": "Reveal-four transaction",
        "rule": "称象 removes up to 4 actual top physical cards into a public processing batch, offers any subset with printed/effective source point sum <= 13, then owner obtains chosen cards and all unchosen cards go to discard. It is obtain, not draw 4 then discard; no judgment/retrial. Numeric A/J/Q/K use 1/11/12/13. Original order and physical identities preserved, no cloning. Empty selection is safe decline of obtain; source catalog permits任意张.",
        "basis": "Official Mobile 123 +2015 notice remainder clause. Empty deck reshuffle and foreign null-rank support are separate host card/deck policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P10",
        "title": "Unresolved rank less foreign material",
        "rule": "Shared-policy proposal only: reveal rank less foreign cards visibly but do not select them for a numeric-sum requirement until the host has an approved rank convention; valid rank 1..13 cards remain selectable. Never treat null as 0 or invent source ranks. A host may alternatively disable foreign unranked packs for this interaction; source SGS rules are unchanged.",
        "basis": "Foreign synthetic equipment may have rank null in actual host. This is not a missing intrinsic Mobile skill clause.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P11",
        "title": "Junxing transaction",
        "rule": "Once per actual owner PLAY, commit N>=1 exact owner hand discards and freeze their broad category SET. Other living target, including ally, chooses discard 1 HAND whose category is absent from every paid category, OR actually flips and drawsN. N is paid physical count, not unique-category count or current hand size. Empty-hand target remains legal, with flip/draw mandatory. Selecting all 3 categories makes discard branch impossible. No damage/HP loss, no draw-to 4, no extra forced cost.",
        "basis": "Mobile 125 full panel; OL 2016 explicitly at least 1 and flip-then-draw, supporting equal wording, not client certification. Class if ying foreign card families use sp 3.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P12",
        "title": "Yuce transaction",
        "rule": "After one actual damage event, living owner with hand may publicly reveal one exact HAND card, retaining it. Actual DAMAGE SOURCE may discard one of its own HAND cards in a different broad category; if it does, owner recovers 0, otherwise owner recovers 1. Owner does not choose/source steal the card. Same-source-as-owner is not excluded by Mobile wording. No skill if owner cannot show a handcard. Source-less or departed/dead-source execution is intrinsic-unverified U 1, not resolved by this contract.",
        "basis": "Mobile 125 hidden panel. No invented source-less heal/no-heal decision; OL contradiction is recorded.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P13",
        "title": "Zongxuan semantic discard",
        "rule": "Only cards belonging to holder HAND/EQUIPMENT immediately before an actual DISCARD and now in discard for that same movement may be selected. Exclude ordinary use/response cleanup, recast, obtain/give, equip replacement, personal-pile cleanup and death cleanup: to=discard alone is not reason=discard. Cards are moved, never copied, in owner-selected top-to-bottom order, without shuffling. May decline or choose subset; no artificial per-turn quota.",
        "basis": "Official Mobile 130 says因弃置而置入弃牌堆后. Own-card zone vocabulary and ordered top placement are usual shared-rule interpretation. Exact competition order with foreign loss triggers is host policy; no native judgment-zone expansion asserted.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P14",
        "title": "Zongxuan callback ordering",
        "rule": "Use committed movement record with immutable from-zone/card-owner/action and a current-physical-location recheck. Place selected subset after original discard commit and before later queued discard consumers in a disclosed stable host order. Do not recurse on the resulting discard→deck placement. Existing public_card_loss has no deck top destination, so add a trusted atomic ordered placement primitive plus origin audit; never re-gain into hand or independently splice duplicate cards.",
        "basis": "Actual V 28 movement API lacks decktop. Host ordering proposal, especially with foreign poison/loss callbacks, is not client certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P15",
        "title": "Zhi yan real use",
        "rule": "At actual owner END-phase event choose one living actor, including self/enemy, then that actor draws 1 and reveals that exact physical card. If it is equipment, recipient is actual USER of that card and must use it, then recipient recovers 1. Do not simply grant weapon, discard, or heal before use. Actual use history, equipment replacement/enter/leave, and any legal on-use reactions must run. Owner does not become card user or gain the card.",
        "basis": "Mobile 130 hidden panel; OL 2017 matching order; OL 2016 update changed old heal-before-use order. Generic prohibited/abolished-slot use branch remain su 2, not implicitly healed or suppressed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P16",
        "title": "Jingce real phase end and immutable use count",
        "rule": "Dispatch once at the genuine end of an actual entered owner PLAY phase, before restoring phase or running END; this is not restricted to clicking an End button. Exclude skipped or never-entered phases and finally-dead owners. Count all committed actual use records with actor_id=owner and turn_id=current, not only outermost uses, material counts, discard totals or Slash quota. Longyin-exempt Slash remains a use. Snapshot use count and current HP at this event; keep the use count until the whole-turn boundary. Each actual extra PLAY and normal PLAY has its own end event.",
        "basis": "Official Mobile 124 explicit whole turn; BWIKI current phase excluded. Extra PLAY scheduler/interrupt/replay semantics are disclosed host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P17",
        "title": "Parent-confirmed Zhi yan failed-use compatibility",
        "rule": "On 直言 equipment branch, attempt the recipient actual legal use of that exact card. Only a successful real equipment use is followed by skill recovery 1. If card use is prohibited or the required slot is abolished, leave the card in recipient hand, do not equip or claim a use, and do not recover. If a draw interceptor already moved the card, do not reclaim or substitute it. Native Mobile failure-path behavior remains unverified U 2.",
        "basis": "Parent task instruction 2026-10-15 T 23:26 UTC explicitly selected this host policy; it is not a newly verified source-game rule.",
        "status": "parent_confirmed_host_compatibility_not_native_client_certification"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-later/cao-chong.svg",
    "skill_callback_modules": {
      "sgs.chengxiang": "sgs-later-caochong-skills.js",
      "sgs.renxin": "sgs-later-caochong-skills.js"
    },
    "gender_official_field_verified": false,
    "gender_provenance": {
      "source_id": "bwiki-caochong",
      "kind": "same_product_classic_explicit_gender",
      "raw_sha256": "6b0ba31980f573b4e915961baacd0eb3a406dd8e0b8c4e304d2a6bced4450e8c",
      "revision_id": 35950,
      "revision_timestamp_utc": "2026-01-16T08:50:37Z",
      "html_line": 656,
      "field": "gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_id": "bwiki-caochong",
      "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%86%B2",
      "raw_sha256": "6b0ba31980f573b4e915961baacd0eb3a406dd8e0b8c4e304d2a6bced4450e8c",
      "revision_id": 35950,
      "revision_timestamp_utc": "2026-01-16T08:50:37Z",
      "html_line": 665,
      "hp_numeric": 3,
      "hp_icon_count": 3,
      "initial_hp_direct_source_value": null,
      "current_client_verified": false,
      "display_note": "同产品经典社区显式数字／勾玉体力与性别；非官网显式字段，未核验2026当前客户端。独立初始体力未知，P0满体力初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.cao-chong",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "曹冲",
      "faction": "魏",
      "gender": "male",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "P0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "称象",
        "仁心"
      ],
      "complete_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "称象",
          "仁心"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.chengxiang",
            "name": "称象",
            "type": "optional_after_damage_reveal_subset_obtain",
            "timing": "After owner receives one resolved damage EVENT and remains living after rescue",
            "quota": "No turn quota; once per actual damage event, regardless of amount",
            "cost": "No card or HP cost",
            "targets": "Owner; reveals actual top 4 cards publicly",
            "effects": [
              "Optionally reveal 4 from deck. Choose any subset whose point SUM<=13, including a K alone or combinations totaling exactly 13.",
              "Obtain selected subset into own hand; put all other revealed cards into discard. This is not draw 4 and discard H, a judgment, or random card selection.",
              "No per-damage-point repetition: one damage packet of 2 gives one reveal 4 opportunity; two separate events may each trigger."
            ],
            "official_rule_text": "当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-caochong",
              "mobile-skill-adjustment-2015",
              "bwiki-chengxiang"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P7",
              "P9",
              "P10"
            ],
            "limited_marker": null,
            "awakening_marker": null
          },
          {
            "id": "sgs.renxin",
            "name": "仁心",
            "type": "optional_global_pre_damage_prevention",
            "timing": "OTHER actor currently HP=1 is about to receive positive damage",
            "quota": "No once/turn or once/game quota; each actual pending damage can offer; no duplicate on same event per owner",
            "cost": "Owner actually flips, AND discards exactly 1 equipment CARD from HAND or EQUIPMENT",
            "targets": "Any OTHER living final damage receiver at HP exactly 1; self excluded; allies and enemies legal; no range",
            "effects": [
              "After cost, prevent the ENTIRE pending damage, not reduce damage by 1 and not recover HP.",
              "No dying restriction:HP=1 prior to damage; anHP 2 actor taking 2 is ineligible;HP 0 or negative actor is not hp 1.",
              "Source may be absent; no damage-source condition. Face-down holder can toggle face-up; no forced-face-down prerequisite.",
              "No all-hand transfer, rescue-card use, granted skill, delayed effect or lifetime limited marker."
            ],
            "official_rule_text": "当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-caochong",
              "mobile-skill-adjustment-2015",
              "bwiki-renxin"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P2",
              "P3",
              "P7",
              "P8"
            ],
            "limited_marker": null,
            "awakening_marker": null
          }
        ]
      },
      "signature_sha256": "7aa5cb87296041b20386050c1ec862deb28eda9fbca3cfc8cfe970a47ecba7a8",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 97,
      "source_alias_records_checked": 7,
      "comparison_basis": "actual V28 working tree source records captured2026-10-15, not a previous release label",
      "comparison_scope": "Frozen V28 97 selectable entities plus 7 source aliases; no new aliases."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-caochong",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-123.html",
        "raw_path": "evidence/mobile-caochong.html",
        "sha256": "b9566793e3087ec2094ff2071ea0c576741b9774c2851eedf28f50628258666c",
        "current_client_verified": false
      },
      {
        "id": "bwiki-caochong",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E5%86%B2",
        "raw_path": "evidence/bwiki-caochong.html",
        "sha256": "6b0ba31980f573b4e915961baacd0eb3a406dd8e0b8c4e304d2a6bced4450e8c",
        "current_client_verified": false
      },
      {
        "id": "bwiki-chengxiang",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E7%A7%B0%E8%B1%A1",
        "raw_path": "evidence/bwiki-chengxiang.html",
        "sha256": "d7cc459c868cf48c34bc993590748a1079a2027c2d9f5c36c25f3dd34a264717",
        "current_client_verified": false
      },
      {
        "id": "bwiki-renxin",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E4%BB%81%E5%BF%83",
        "raw_path": "evidence/bwiki-renxin.html",
        "sha256": "7fb309ef8cf970dd58680f0a59e905f873339de6362f380eecdca501097fafd7",
        "current_client_verified": false
      },
      {
        "id": "mobile-skill-adjustment-2015",
        "tier": "official_same_product_dated_change_notice",
        "url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "raw_path": "evidence/mobile-skill-adjustment-2015.html",
        "sha256": "cdf72dbb68a460995748ec57e97ddf95183cbb873e869738d4efb4b175caa21e",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "reason": "Complete personal skill inventory does not certify native identity, lord, rewards or victory scheduling."
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "handling": "P0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "current client",
        "handling": "Undated official selected catalog and dated community metadata are not logged-in current-client verification"
      },
      {
        "field": "cross-game ordering",
        "handling": "P1–P17 are explicit host contracts, not native client certification"
      }
    ],
    "adaptation_notes": "P0满体力初始化；P1–P17为明示江湖兼容，包括事件回执、全局伤害与用牌、阶段次数与整回合历史分离、真实弃牌排序回顶、结束阶段装备使用及来源版本选择。最大体力与性别为同产品经典社区字段，当前客户端及完整身份模式未核验。"
  },
  {
    "key": "guanping",
    "id": "sgs.adapted.base.hero.guan-ping",
    "source_name": "关平",
    "suggested_display_name": "关平",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "蜀",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host full-max-HP initialization; independent initialHP unknown",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 126,
    "source_refs": [
      "mobile-guanping",
      "bwiki-guanping"
    ],
    "intrinsic_skill_inventory": [
      "龙吟"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "source_ready_with_explicit_host_requirements",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.longyin",
        "name": "龙吟",
        "type": "optional_global_slash_use_quota_exemption",
        "timing": "Any living actor uses a Slash during that SAME actor real PLAY phase, including self",
        "quota": "No per-phase/turn limit; at most one owner activation for a single card-use event",
        "cost": "Discard exactly 1 owner physical HAND or EQUIPMENT card; no HP cost; no target/attacker payment",
        "targets": "The actual Slash-use event; actor can be owner, ally or enemy. No target-side distance/gender/faction gate.",
        "effects": [
          "After cost commits, mark THIS Slash as not counted toward its PLAY-phase Slash-use quota. It remains a used card for all actual history/used-card triggers.",
          "If the effective used Slash is RED, the skill OWNER draws 1. A black or colorless Slash provides no draw.",
          "Slash retains same targets, damage, nature and response requirements. No automatic second Slash and no damage increase.",
          "A response-only Slash to Duel/AOE is not a use and cannot trigger; own-phase real forced/free Slash is still a use even if already quota-free.",
          "Red/black color belongs to the effective used Slash, not the discarded cost; conversion with multiple materials uses established virtual face, not any red material test."
        ],
        "official_rule_text": "当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guanping",
          "bwiki-longyin"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5",
          "P6"
        ],
        "source_legal_targets": {
          "includes_self_as_user": true,
          "includes_allies_as_user": true,
          "includes_enemies_as_user": true,
          "distance_limit": null
        },
        "source_quota_per_turn": null,
        "limited_marker": null,
        "awakening_marker": null,
        "delayed_effect": null
      }
    ],
    "skill_ids": [
      "sgs.longyin"
    ],
    "ui_requirements": [
      "Passive global reaction prompt belongs to skill OWNER, even when another actor is active.",
      "Display committed Slash user, effective color, phase ID, current quota inclusion and one exact cost.",
      "Offer own hand or equipment, cancel before commitment, then show no-quota status and red-only draw.",
      "Keep source badge current-client unverified; no clickable generic damage buff.",
      "Public logs must not reveal another actor hand contents."
    ],
    "ai_policy": [
      "Default accepts self/allied uses when a cheap own material is worth freeing quota; prefer red uses for replacement draw.",
      "May conservatively decline enemy uses; this is AI policy, never a legal-target filter.",
      "A smarter enemy-red policy may use publicly known lack of follow-up, but must not inspect hidden hand."
    ],
    "excluded_variants": [
      "No damage buff, attack-limit buff lasting entire turn, or free virtual Slash.",
      "Skins do not add a second龙吟 or distinct roster entry."
    ],
    "intrinsic_unresolved": [],
    "name": "关平",
    "display_name": "关平",
    "skill_name": "龙吟",
    "skill_desc": "龙吟：当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。",
    "source_character_name": "关平",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "蜀",
    "source_id_aliases": [],
    "aliases": [
      "三国杀关平",
      "guan-ping"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-126.html",
      "https://wiki.biligame.com/msgs/%E5%85%B3%E5%B9%B3",
      "https://wiki.biligame.com/msgs/%E9%BE%99%E5%90%9F"
    ],
    "source_records": [
      {
        "id": "mobile-guanping",
        "url": "https://www.sanguosha.cn/pc/hero-detail-126.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-126.html",
        "status": 200,
        "bytes": 21268,
        "sha256": "ccf8062f20421ebec712de49a8d34eb12da198e01386dfb5e6112b499cbfa250",
        "accessed_at": "2026-10-15T23:09:36.232620+00:00",
        "raw_path": "evidence/mobile-guanping.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
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
                  "name": "龙吟",
                  "hidden": false,
                  "rule_text": "当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。",
                  "rule_sha256": "7f884daf230ff3b387351642dfc4d36d437f10043b6df3ac3caa6e66f37cab8b",
                  "html_line": 183
                }
              ]
            }
          ],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "蜀"
        },
        "limitations": [
          "Undated public catalog, not a logged-in 2026 client audit.",
          "No explicit numeric maxHP or gameplay gender field in this official HTML. Skins are not rules variants."
        ]
      },
      {
        "id": "bwiki-guanping",
        "url": "https://wiki.biligame.com/msgs/%E5%85%B3%E5%B9%B3",
        "final_url": "https://wiki.biligame.com/msgs/%E5%85%B3%E5%B9%B3",
        "status": 200,
        "bytes": 77807,
        "sha256": "77ae4047cec0b9d8df39dce710f28e296a83bd58dece3a8fbfaa421dd360f228",
        "accessed_at": "2026-10-15T23:09:40.068885+00:00",
        "raw_path": "evidence/bwiki-guanping.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 21335,
        "modified_at": "2023-02-01T07:12:19Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "蜀",
          "initial_hp_explicit": null,
          "selected_section": "经典, not historical/国战/界 variants",
          "hp_html_line": 603,
          "gender_html_line": 594,
          "faction_html_line": 595,
          "gender_excerpt": ">性别男 势力蜀 <p class=",
          "faction_excerpt": ">势力蜀 别称人型AK <div class=\"锚点\" style=\"position:r",
          "classic_section_html_line": 599,
          "hp_hidden_numeric_html_line": 603,
          "hp_evidence_locator": "First classic-section HP icon row and hidden numeric span; section heading recorded separately."
        }
      },
      {
        "id": "bwiki-longyin",
        "url": "https://wiki.biligame.com/msgs/%E9%BE%99%E5%90%9F",
        "final_url": "https://wiki.biligame.com/msgs/%E9%BE%99%E5%90%9F",
        "status": 200,
        "bytes": 69722,
        "sha256": "3950d7ad4f38d4aa5c38b1cd069c97d029a3e282b92fcbc6c2afbc21e8cb1b1c",
        "accessed_at": "2026-10-15T23:09:43.996843+00:00",
        "raw_path": "evidence/bwiki-longyin.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 28130,
        "modified_at": "2024-08-07T03:13:37Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.longyin",
        "name": "龙吟",
        "type": "optional_global_slash_use_quota_exemption",
        "timing": "Any living actor uses a Slash during that SAME actor real PLAY phase, including self",
        "quota": "No per-phase/turn limit; at most one owner activation for a single card-use event",
        "cost": "Discard exactly 1 owner physical HAND or EQUIPMENT card; no HP cost; no target/attacker payment",
        "targets": "The actual Slash-use event; actor can be owner, ally or enemy. No target-side distance/gender/faction gate.",
        "effects": [
          "After cost commits, mark THIS Slash as not counted toward its PLAY-phase Slash-use quota. It remains a used card for all actual history/used-card triggers.",
          "If the effective used Slash is RED, the skill OWNER draws 1. A black or colorless Slash provides no draw.",
          "Slash retains same targets, damage, nature and response requirements. No automatic second Slash and no damage increase.",
          "A response-only Slash to Duel/AOE is not a use and cannot trigger; own-phase real forced/free Slash is still a use even if already quota-free.",
          "Red/black color belongs to the effective used Slash, not the discarded cost; conversion with multiple materials uses established virtual face, not any red material test."
        ],
        "official_rule_text": "当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guanping",
          "bwiki-longyin"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5",
          "P6"
        ],
        "source_legal_targets": {
          "includes_self_as_user": true,
          "includes_allies_as_user": true,
          "includes_enemies_as_user": true,
          "distance_limit": null
        },
        "source_quota_per_turn": null,
        "limited_marker": null,
        "awakening_marker": null,
        "delayed_effect": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.longyin"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.longyin"
    ],
    "complete_skill_names": [
      "龙吟"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed-automated-rules-ui-replay-acceptance",
    "production_integration_status": "integrated-private-release",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "title": "Scope and initial HP",
        "rule": "This is a base identity public-catalog snapshot dated 2026-10-15; no Skins, no OL/界/国战 branches. Initial HP itself is not separately sourced, so host full-max initialization is disclosed. Max HP/gender/faction are actual classic same-product dated community fields cross checked against official faction. Keep all skills; do not raise playable counts before implementation/testing.",
        "basis": "Official full inline panels; BWIKI revision/date/HP icon+number.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P1",
        "title": "Event ownership and receipts",
        "rule": "Use real current effective skill ownership, stable actor/use/damage/movement/phase IDs, and JSON-safe receipts. Freeze event identity and revalidate after each awaited prompt. A declined optional activation has no cost; a completed cost cannot be paid twice on duplicate event, replay, repeated click or save reload. A removed skill is unavailable for a new activation. Do not let lifecycle copying mutate the immutable original source template.",
        "basis": "Existing hero lifecycle/general-skill descriptor and event ledger design; host compatibility.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P2",
        "title": "Lawful options versus AI",
        "rule": "Legal target enumeration must not depend on team, distance, faction or gender unless a source clause says so. AI may prefer allies for support and enemies for disruption, using public board and its own private cards only. AI never knows another actor hand faces or future deck order. UI must offer all legal choices to a human.",
        "basis": "Explicit team mode compatibility, not native identity-strategy certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P3",
        "title": "Broad card zones and foreign types",
        "rule": "Unqualified discard-one-card uses own HAND or EQUIPMENT, never judgment or personal piles; discard-hand uses HAND only. Card category is basic/trick/equipment, not concrete names; delayed trick belongs to trick. SGS names and foreign analogous families need explicit host mappings. Null/invalid ranks are never silently treated as 0,1,13; supported rank policy must be declared before 称象 encounters rank less foreign cards.",
        "basis": "Common source vocabulary and existing host material API; cross-game rank/category mappings are separate unverified host decisions.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P4",
        "title": "Delayed and extra phases",
        "rule": "Skills listen to event actor, not globally active UI owner. 龙吟 requires Slash user to be the owner of that real active PLAY phase, including actual extra play; another actor using Slash inside that phase does not qualify. No new whole turn/phase is created by any of these four heroes. 峻刑 quotas belong to each actual owner PLAY phase; 直言 belongs only to owner END-phase occur ren ce, not arbitrary global turn end. Flipping toggles face orientation; it does not immediately skip a currently running phase or force face-down.",
        "basis": "Selected source clauses plus actual V 28 phase and flip contracts.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P5",
        "title": "History versus quota",
        "rule": "Long yin excludes one committed Slash from its source PLAY-phase quota. Preserve immutable card-use history, physical card use, used-Slash flags, action activity for 克己/隐忍 and per-turn totals. Do not blindly decrement sha_count_this_turn: current host also uses it for original whole-turn allowances. Track phase quota exclusion by exact use receipt, clamp exempt counts at 0, and retain an already quota-free use as a real use. Whole-turn original limits remain their own explicit host rule.",
        "basis": "Mobile 龙吟 phase-use wording plus actual V 28 counter/history split; cross-game scope is host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P6",
        "title": "Window after commitment",
        "rule": "龙吟 is post-legal-use commitment, not permission to announce a second illegal Slash when quota is already exhausted. Finish initial card material-loss events and freeze final effective Slash face before offering; then resolve it before target response/damage. Removing the attacker weapon as cost does not retroactively cancel already committed target legality. Shared ordering among cross-game before-target mechanisms requires an explicit new global hook, not one offer per target.",
        "basis": "Mobile uses-when trigger; exact host hook ordering proposed. Current-client exotic nested priority not verified.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P7",
        "title": "Damage event cardinality",
        "rule": "称象 and 御策 trigger once per resolved damage EVENT, not once per damage point; a 2 damage event gets one chance. Use actual damage receiver after transfer and rescue; finally-dead holder cannot use ordinary after-damage abilities. Prevented damage and pure HP loss are not damage. 仁心 prevents complete pending damage, so no receiver after-damage, dying, card-damage benefit or chain propagation origin at es from prevented HP loss.",
        "basis": "Official Mobile 2015 explicitly一次伤害; catalog受伤 wording; current host damage event lifecycle. Cross-game callback order disclosed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P8",
        "title": "Ren xin global window and costs",
        "rule": "Offer all living effective 仁心 holders other than final damage receiver when receiver currently HP=1 and positive damage is about to reduce HP. Freeze exact damage_event_id and final receiver; source may be absent. Source core order is flip owner AND discard 1 equipment then prevent this entire damage. Pre validate selected card before irreversible flip; protect against stale/double commit. Use real flip toggle, even face-down→face-up. Equipment may be in hand or equipped. Do not require owner face-up or ally target.",
        "basis": "Official Mobile 123 hidden panel and 2015 notice. Placement after transfer/armor and global action-order arbitration are explicit shared-host ordering, not current-client precedence certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P9",
        "title": "Reveal-four transaction",
        "rule": "称象 removes up to 4 actual top physical cards into a public processing batch, offers any subset with printed/effective source point sum <= 13, then owner obtains chosen cards and all unchosen cards go to discard. It is obtain, not draw 4 then discard; no judgment/retrial. Numeric A/J/Q/K use 1/11/12/13. Original order and physical identities preserved, no cloning. Empty selection is safe decline of obtain; source catalog permits任意张.",
        "basis": "Official Mobile 123 +2015 notice remainder clause. Empty deck reshuffle and foreign null-rank support are separate host card/deck policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P10",
        "title": "Unresolved rank less foreign material",
        "rule": "Shared-policy proposal only: reveal rank less foreign cards visibly but do not select them for a numeric-sum requirement until the host has an approved rank convention; valid rank 1..13 cards remain selectable. Never treat null as 0 or invent source ranks. A host may alternatively disable foreign unranked packs for this interaction; source SGS rules are unchanged.",
        "basis": "Foreign synthetic equipment may have rank null in actual host. This is not a missing intrinsic Mobile skill clause.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P11",
        "title": "Junxing transaction",
        "rule": "Once per actual owner PLAY, commit N>=1 exact owner hand discards and freeze their broad category SET. Other living target, including ally, chooses discard 1 HAND whose category is absent from every paid category, OR actually flips and drawsN. N is paid physical count, not unique-category count or current hand size. Empty-hand target remains legal, with flip/draw mandatory. Selecting all 3 categories makes discard branch impossible. No damage/HP loss, no draw-to 4, no extra forced cost.",
        "basis": "Mobile 125 full panel; OL 2016 explicitly at least 1 and flip-then-draw, supporting equal wording, not client certification. Class if ying foreign card families use sp 3.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P12",
        "title": "Yuce transaction",
        "rule": "After one actual damage event, living owner with hand may publicly reveal one exact HAND card, retaining it. Actual DAMAGE SOURCE may discard one of its own HAND cards in a different broad category; if it does, owner recovers 0, otherwise owner recovers 1. Owner does not choose/source steal the card. Same-source-as-owner is not excluded by Mobile wording. No skill if owner cannot show a handcard. Source-less or departed/dead-source execution is intrinsic-unverified U 1, not resolved by this contract.",
        "basis": "Mobile 125 hidden panel. No invented source-less heal/no-heal decision; OL contradiction is recorded.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P13",
        "title": "Zongxuan semantic discard",
        "rule": "Only cards belonging to holder HAND/EQUIPMENT immediately before an actual DISCARD and now in discard for that same movement may be selected. Exclude ordinary use/response cleanup, recast, obtain/give, equip replacement, personal-pile cleanup and death cleanup: to=discard alone is not reason=discard. Cards are moved, never copied, in owner-selected top-to-bottom order, without shuffling. May decline or choose subset; no artificial per-turn quota.",
        "basis": "Official Mobile 130 says因弃置而置入弃牌堆后. Own-card zone vocabulary and ordered top placement are usual shared-rule interpretation. Exact competition order with foreign loss triggers is host policy; no native judgment-zone expansion asserted.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P14",
        "title": "Zongxuan callback ordering",
        "rule": "Use committed movement record with immutable from-zone/card-owner/action and a current-physical-location recheck. Place selected subset after original discard commit and before later queued discard consumers in a disclosed stable host order. Do not recurse on the resulting discard→deck placement. Existing public_card_loss has no deck top destination, so add a trusted atomic ordered placement primitive plus origin audit; never re-gain into hand or independently splice duplicate cards.",
        "basis": "Actual V 28 movement API lacks decktop. Host ordering proposal, especially with foreign poison/loss callbacks, is not client certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P15",
        "title": "Zhi yan real use",
        "rule": "At actual owner END-phase event choose one living actor, including self/enemy, then that actor draws 1 and reveals that exact physical card. If it is equipment, recipient is actual USER of that card and must use it, then recipient recovers 1. Do not simply grant weapon, discard, or heal before use. Actual use history, equipment replacement/enter/leave, and any legal on-use reactions must run. Owner does not become card user or gain the card.",
        "basis": "Mobile 130 hidden panel; OL 2017 matching order; OL 2016 update changed old heal-before-use order. Generic prohibited/abolished-slot use branch remain su 2, not implicitly healed or suppressed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P16",
        "title": "Jingce real phase end and immutable use count",
        "rule": "Dispatch once at the genuine end of an actual entered owner PLAY phase, before restoring phase or running END; this is not restricted to clicking an End button. Exclude skipped or never-entered phases and finally-dead owners. Count all committed actual use records with actor_id=owner and turn_id=current, not only outermost uses, material counts, discard totals or Slash quota. Longyin-exempt Slash remains a use. Snapshot use count and current HP at this event; keep the use count until the whole-turn boundary. Each actual extra PLAY and normal PLAY has its own end event.",
        "basis": "Official Mobile 124 explicit whole turn; BWIKI current phase excluded. Extra PLAY scheduler/interrupt/replay semantics are disclosed host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P17",
        "title": "Parent-confirmed Zhi yan failed-use compatibility",
        "rule": "On 直言 equipment branch, attempt the recipient actual legal use of that exact card. Only a successful real equipment use is followed by skill recovery 1. If card use is prohibited or the required slot is abolished, leave the card in recipient hand, do not equip or claim a use, and do not recover. If a draw interceptor already moved the card, do not reclaim or substitute it. Native Mobile failure-path behavior remains unverified U 2.",
        "basis": "Parent task instruction 2026-10-15 T 23:26 UTC explicitly selected this host policy; it is not a newly verified source-game rule.",
        "status": "parent_confirmed_host_compatibility_not_native_client_certification"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-later/guan-ping.svg",
    "skill_callback_modules": {
      "sgs.longyin": "sgs-later-guanping-skills.js"
    },
    "gender_official_field_verified": false,
    "gender_provenance": {
      "source_id": "bwiki-guanping",
      "kind": "same_product_classic_explicit_gender",
      "raw_sha256": "77ae4047cec0b9d8df39dce710f28e296a83bd58dece3a8fbfaa421dd360f228",
      "revision_id": 21335,
      "revision_timestamp_utc": "2023-02-01T07:12:19Z",
      "html_line": 594,
      "field": "gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_id": "bwiki-guanping",
      "url": "https://wiki.biligame.com/msgs/%E5%85%B3%E5%B9%B3",
      "raw_sha256": "77ae4047cec0b9d8df39dce710f28e296a83bd58dece3a8fbfaa421dd360f228",
      "revision_id": 21335,
      "revision_timestamp_utc": "2023-02-01T07:12:19Z",
      "html_line": 603,
      "hp_numeric": 4,
      "hp_icon_count": 4,
      "initial_hp_direct_source_value": null,
      "current_client_verified": false,
      "display_note": "同产品经典社区显式数字／勾玉体力与性别；非官网显式字段，未核验2026当前客户端。独立初始体力未知，P0满体力初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.guan-ping",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "关平",
      "faction": "蜀",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "P0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "龙吟"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "龙吟"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.longyin",
            "name": "龙吟",
            "type": "optional_global_slash_use_quota_exemption",
            "timing": "Any living actor uses a Slash during that SAME actor real PLAY phase, including self",
            "quota": "No per-phase/turn limit; at most one owner activation for a single card-use event",
            "cost": "Discard exactly 1 owner physical HAND or EQUIPMENT card; no HP cost; no target/attacker payment",
            "targets": "The actual Slash-use event; actor can be owner, ally or enemy. No target-side distance/gender/faction gate.",
            "effects": [
              "After cost commits, mark THIS Slash as not counted toward its PLAY-phase Slash-use quota. It remains a used card for all actual history/used-card triggers.",
              "If the effective used Slash is RED, the skill OWNER draws 1. A black or colorless Slash provides no draw.",
              "Slash retains same targets, damage, nature and response requirements. No automatic second Slash and no damage increase.",
              "A response-only Slash to Duel/AOE is not a use and cannot trigger; own-phase real forced/free Slash is still a use even if already quota-free.",
              "Red/black color belongs to the effective used Slash, not the discarded cost; conversion with multiple materials uses established virtual face, not any red material test."
            ],
            "official_rule_text": "当一名角色于其出牌阶段内使用【杀】时，你可以弃置一张牌，令此【杀】不计入出牌阶段的使用次数，然后若此【杀】为红色，你摸一张牌。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-guanping",
              "bwiki-longyin"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P2",
              "P3",
              "P4",
              "P5",
              "P6"
            ],
            "source_legal_targets": {
              "includes_self_as_user": true,
              "includes_allies_as_user": true,
              "includes_enemies_as_user": true,
              "distance_limit": null
            },
            "source_quota_per_turn": null,
            "limited_marker": null,
            "awakening_marker": null,
            "delayed_effect": null
          }
        ]
      },
      "signature_sha256": "c8a8449625f9fb3f4978f8e9b15fb7b5dc1ed30d41dd3af0b7afe83544aa3342",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 97,
      "source_alias_records_checked": 7,
      "comparison_basis": "actual V28 working tree source records captured2026-10-15, not a previous release label",
      "comparison_scope": "Frozen V28 97 selectable entities plus 7 source aliases; no new aliases."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-guanping",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-126.html",
        "raw_path": "evidence/mobile-guanping.html",
        "sha256": "ccf8062f20421ebec712de49a8d34eb12da198e01386dfb5e6112b499cbfa250",
        "current_client_verified": false
      },
      {
        "id": "bwiki-guanping",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E5%85%B3%E5%B9%B3",
        "raw_path": "evidence/bwiki-guanping.html",
        "sha256": "77ae4047cec0b9d8df39dce710f28e296a83bd58dece3a8fbfaa421dd360f228",
        "current_client_verified": false
      },
      {
        "id": "bwiki-longyin",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E9%BE%99%E5%90%9F",
        "raw_path": "evidence/bwiki-longyin.html",
        "sha256": "3950d7ad4f38d4aa5c38b1cd069c97d029a3e282b92fcbc6c2afbc21e8cb1b1c",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "reason": "Complete personal skill inventory does not certify native identity, lord, rewards or victory scheduling."
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "handling": "P0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "current client",
        "handling": "Undated official selected catalog and dated community metadata are not logged-in current-client verification"
      },
      {
        "field": "cross-game ordering",
        "handling": "P1–P17 are explicit host contracts, not native client certification"
      }
    ],
    "adaptation_notes": "P0满体力初始化；P1–P17为明示江湖兼容，包括事件回执、全局伤害与用牌、阶段次数与整回合历史分离、真实弃牌排序回顶、结束阶段装备使用及来源版本选择。最大体力与性别为同产品经典社区字段，当前客户端及完整身份模式未核验。"
  },
  {
    "key": "yufan",
    "id": "sgs.adapted.base.hero.yu-fan",
    "source_name": "虞翻",
    "suggested_display_name": "虞翻",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "吴",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host full-max-HP initialization; independent initialHP unknown",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 130,
    "source_refs": [
      "mobile-yufan",
      "bwiki-yufan"
    ],
    "intrinsic_skill_inventory": [
      "纵玄",
      "直言"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "source_ready_with_parent_confirmed_host_failure_policy",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.zongxuan",
        "name": "纵玄",
        "type": "optional_after_own_discard_ordered_decktop",
        "timing": "After holder cards actually enter discard because of DISCARD, own or other turns",
        "quota": "No per-turn or per-phase limit; once per actual movement batch",
        "cost": "No additional card/HP cost; move subset of that actual discarded batch",
        "targets": "Own just-discarded eligible physical cards, no actor target",
        "effects": [
          "May move any selected subset of those cards to top of deck in chosen order; top-order visibly pre viewed, first selected top convention explicit.",
          "Cards not selected remain discard. Do not recover into hand, shuffle, copy or substitute other discard cards.",
          "Actual use/response cleanup, equipment replacement and giving are not by themselves discard actions.",
          "No界 active PLAY draw 1+put 1 branch or上家 discard/END trigger."
        ],
        "official_rule_text": "当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-yufan",
          "bwiki-zongxuan"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P3",
          "P13",
          "P14"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.zhiyan",
        "name": "直言",
        "type": "optional_end_phase_draw_reveal_forced_equipment_use_recover",
        "timing": "Owner actual END-phase occur ren ce after discard phase",
        "quota": "One optional activation per END-phase occur ren ce; no action button outside this window",
        "cost": "No card or HP cost",
        "targets": "One living actor, including self, ally or enemy; no range/faction/gender/HP restriction",
        "effects": [
          "Target draws 1 and publicly reveals this exact physical card.",
          "If not equipment, no further effect: target keeps drawn card normally.",
          "If equipment, target uses it as real card user, then recovers 1 capped by max HP; mandatory after initial target selection when use legal.",
          "Existing same-slot equipment replaces with full leave/enter callbacks; source owner is not equipment user.",
          "Native prohibited-use/abolished-slot branch remains unverified U 2. Host P 17: if a real legal equipment use succeeds, recover 1 afterward; if prohibited or required slot abolished, keep the drawn card in hand, record no card use, and do not recover."
        ],
        "official_rule_text": "结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-yufan",
          "bwiki-zhiyan"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P4",
          "P15",
          "P17"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "intrinsic_unresolved": [
          "U2"
        ]
      }
    ],
    "skill_ids": [
      "sgs.zongxuan",
      "sgs.zhiyan"
    ],
    "intrinsic_unresolved": [
      "U2 native branch remains unverified; P17 resolves only this host"
    ],
    "ui_requirements": [
      "纵玄: public discarded-batch multiselect plus top-to-bottom order, origin zones and current existence; skip allowed.",
      "直言: choose any living actor; exact drawn card reveal; equipment use and heal are distinct logs; no optional keep-equipment branch when normal use legal.",
      "Explain the P 17 host compatibility rule on failed equipment use; do not label this unverified native branch as a current Mobile ruling."
    ],
    "ai_policy": [
      "纵玄 may use public discarded cards and visible nextactor/known upcoming draw to choose topcard. Must not inspect hidden deck.",
      "直言 generally chooses self/allied damaged or needy actor. All actors remain legal; no forced allied-only target list."
    ],
    "excluded_variants": [
      "界纵玄 active PLAY draw 1/put 1 excluded.",
      "OL latest界上家 discard/END additions excluded.",
      "Historical直言 heal before equipment use excluded."
    ],
    "source_only_exact_for_every_edge": false,
    "name": "虞翻",
    "display_name": "虞翻",
    "skill_name": "纵玄/直言",
    "skill_desc": "纵玄：当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。 直言：结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。",
    "source_character_name": "虞翻",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀虞翻",
      "yu-fan"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-130.html",
      "https://wiki.biligame.com/msgs/%E8%99%9E%E7%BF%BB",
      "https://wiki.biligame.com/msgs/%E7%BA%B5%E7%8E%84",
      "https://wiki.biligame.com/msgs/%E7%9B%B4%E8%A8%80"
    ],
    "source_records": [
      {
        "id": "mobile-yufan",
        "url": "https://www.sanguosha.cn/pc/hero-detail-130.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-130.html",
        "status": 200,
        "bytes": 21474,
        "sha256": "28adb36d4ff8ece67ef8c9fbb61af4e7844c893b775805eed9db65dfdad953dc",
        "accessed_at": "2026-10-15T23:09:36.199821+00:00",
        "raw_path": "evidence/mobile-yufan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
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
                  "name": "纵玄",
                  "hidden": false,
                  "rule_text": "当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。",
                  "rule_sha256": "d7293e7cb0de176c52f0ba6d2a0572213b6fe9ea06c993332dfa1b676311ea89",
                  "html_line": 184
                },
                {
                  "name": "直言",
                  "hidden": true,
                  "rule_text": "结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。",
                  "rule_sha256": "802f953961b6507e51dd4eb9df3d3fae23f01517c3bd3b0288b2267681c46d9b",
                  "html_line": 185
                }
              ]
            }
          ],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "吴"
        },
        "limitations": [
          "Undated public catalog, not a logged-in 2026 client audit.",
          "No explicit numeric maxHP or gameplay gender field in this official HTML. Skins are not rules variants."
        ]
      },
      {
        "id": "bwiki-yufan",
        "url": "https://wiki.biligame.com/msgs/%E8%99%9E%E7%BF%BB",
        "final_url": "https://wiki.biligame.com/msgs/%E8%99%9E%E7%BF%BB",
        "status": 200,
        "bytes": 80370,
        "sha256": "ae60c10d7b459a6888a296309eaf400dfe8a3c7a1613f908c986cd2e33cfc207",
        "accessed_at": "2026-10-15T23:09:40.215244+00:00",
        "raw_path": "evidence/bwiki-yufan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 26175,
        "modified_at": "2024-02-24T10:11:00Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "吴",
          "initial_hp_explicit": null,
          "selected_section": "经典, not historical/国战/界 variants",
          "hp_html_line": 635,
          "gender_html_line": 626,
          "faction_html_line": 627,
          "gender_excerpt": ">性别男 势力吴 <p class=",
          "faction_excerpt": ">势力吴 别称无别称 <div class=\"锚点\" style=\"position:re",
          "classic_section_html_line": 631,
          "hp_hidden_numeric_html_line": 635,
          "hp_evidence_locator": "First classic-section HP icon row and hidden numeric span; section heading recorded separately."
        }
      },
      {
        "id": "bwiki-zongxuan",
        "url": "https://wiki.biligame.com/msgs/%E7%BA%B5%E7%8E%84",
        "final_url": "https://wiki.biligame.com/msgs/%E7%BA%B5%E7%8E%84",
        "status": 200,
        "bytes": 65226,
        "sha256": "85b0692cab28ef74a8208a90d7f02ec180e23581a4c6f3287042d1220c1c72a6",
        "accessed_at": "2026-10-15T23:09:44.179697+00:00",
        "raw_path": "evidence/bwiki-zongxuan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 10818,
        "modified_at": "2022-09-16T18:35:08Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ]
      },
      {
        "id": "bwiki-zhiyan",
        "url": "https://wiki.biligame.com/msgs/%E7%9B%B4%E8%A8%80",
        "final_url": "https://wiki.biligame.com/msgs/%E7%9B%B4%E8%A8%80",
        "status": 200,
        "bytes": 65197,
        "sha256": "ef9a4378abd630007dcedcbe39e64de48db6bdc57885b13073175305b8a86980",
        "accessed_at": "2026-10-15T23:09:44.241640+00:00",
        "raw_path": "evidence/bwiki-zhiyan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 10820,
        "modified_at": "2022-09-16T18:35:44Z",
        "limitations": [
          "Community source, not official or current-client certification.",
          "Enclosing article revision does not independently version transcluded skill templates."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.zongxuan",
        "name": "纵玄",
        "type": "optional_after_own_discard_ordered_decktop",
        "timing": "After holder cards actually enter discard because of DISCARD, own or other turns",
        "quota": "No per-turn or per-phase limit; once per actual movement batch",
        "cost": "No additional card/HP cost; move subset of that actual discarded batch",
        "targets": "Own just-discarded eligible physical cards, no actor target",
        "effects": [
          "May move any selected subset of those cards to top of deck in chosen order; top-order visibly pre viewed, first selected top convention explicit.",
          "Cards not selected remain discard. Do not recover into hand, shuffle, copy or substitute other discard cards.",
          "Actual use/response cleanup, equipment replacement and giving are not by themselves discard actions.",
          "No界 active PLAY draw 1+put 1 branch or上家 discard/END trigger."
        ],
        "official_rule_text": "当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-yufan",
          "bwiki-zongxuan"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P3",
          "P13",
          "P14"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.zhiyan",
        "name": "直言",
        "type": "optional_end_phase_draw_reveal_forced_equipment_use_recover",
        "timing": "Owner actual END-phase occur ren ce after discard phase",
        "quota": "One optional activation per END-phase occur ren ce; no action button outside this window",
        "cost": "No card or HP cost",
        "targets": "One living actor, including self, ally or enemy; no range/faction/gender/HP restriction",
        "effects": [
          "Target draws 1 and publicly reveals this exact physical card.",
          "If not equipment, no further effect: target keeps drawn card normally.",
          "If equipment, target uses it as real card user, then recovers 1 capped by max HP; mandatory after initial target selection when use legal.",
          "Existing same-slot equipment replaces with full leave/enter callbacks; source owner is not equipment user.",
          "Native prohibited-use/abolished-slot branch remains unverified U 2. Host P 17: if a real legal equipment use succeeds, recover 1 afterward; if prohibited or required slot abolished, keep the drawn card in hand, record no card use, and do not recover."
        ],
        "official_rule_text": "结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-yufan",
          "bwiki-zhiyan"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P4",
          "P15",
          "P17"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "intrinsic_unresolved": [
          "U2"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.zongxuan",
      "sgs.zhiyan"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.zongxuan",
      "sgs.zhiyan"
    ],
    "complete_skill_names": [
      "纵玄",
      "直言"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "runtime_validation_status": "passed-automated-rules-ui-replay-acceptance",
    "production_integration_status": "integrated-private-release",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "title": "Scope and initial HP",
        "rule": "This is a base identity public-catalog snapshot dated 2026-10-15; no Skins, no OL/界/国战 branches. Initial HP itself is not separately sourced, so host full-max initialization is disclosed. Max HP/gender/faction are actual classic same-product dated community fields cross checked against official faction. Keep all skills; do not raise playable counts before implementation/testing.",
        "basis": "Official full inline panels; BWIKI revision/date/HP icon+number.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P1",
        "title": "Event ownership and receipts",
        "rule": "Use real current effective skill ownership, stable actor/use/damage/movement/phase IDs, and JSON-safe receipts. Freeze event identity and revalidate after each awaited prompt. A declined optional activation has no cost; a completed cost cannot be paid twice on duplicate event, replay, repeated click or save reload. A removed skill is unavailable for a new activation. Do not let lifecycle copying mutate the immutable original source template.",
        "basis": "Existing hero lifecycle/general-skill descriptor and event ledger design; host compatibility.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P2",
        "title": "Lawful options versus AI",
        "rule": "Legal target enumeration must not depend on team, distance, faction or gender unless a source clause says so. AI may prefer allies for support and enemies for disruption, using public board and its own private cards only. AI never knows another actor hand faces or future deck order. UI must offer all legal choices to a human.",
        "basis": "Explicit team mode compatibility, not native identity-strategy certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P3",
        "title": "Broad card zones and foreign types",
        "rule": "Unqualified discard-one-card uses own HAND or EQUIPMENT, never judgment or personal piles; discard-hand uses HAND only. Card category is basic/trick/equipment, not concrete names; delayed trick belongs to trick. SGS names and foreign analogous families need explicit host mappings. Null/invalid ranks are never silently treated as 0,1,13; supported rank policy must be declared before 称象 encounters rank less foreign cards.",
        "basis": "Common source vocabulary and existing host material API; cross-game rank/category mappings are separate unverified host decisions.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P4",
        "title": "Delayed and extra phases",
        "rule": "Skills listen to event actor, not globally active UI owner. 龙吟 requires Slash user to be the owner of that real active PLAY phase, including actual extra play; another actor using Slash inside that phase does not qualify. No new whole turn/phase is created by any of these four heroes. 峻刑 quotas belong to each actual owner PLAY phase; 直言 belongs only to owner END-phase occur ren ce, not arbitrary global turn end. Flipping toggles face orientation; it does not immediately skip a currently running phase or force face-down.",
        "basis": "Selected source clauses plus actual V 28 phase and flip contracts.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P5",
        "title": "History versus quota",
        "rule": "Long yin excludes one committed Slash from its source PLAY-phase quota. Preserve immutable card-use history, physical card use, used-Slash flags, action activity for 克己/隐忍 and per-turn totals. Do not blindly decrement sha_count_this_turn: current host also uses it for original whole-turn allowances. Track phase quota exclusion by exact use receipt, clamp exempt counts at 0, and retain an already quota-free use as a real use. Whole-turn original limits remain their own explicit host rule.",
        "basis": "Mobile 龙吟 phase-use wording plus actual V 28 counter/history split; cross-game scope is host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P6",
        "title": "Window after commitment",
        "rule": "龙吟 is post-legal-use commitment, not permission to announce a second illegal Slash when quota is already exhausted. Finish initial card material-loss events and freeze final effective Slash face before offering; then resolve it before target response/damage. Removing the attacker weapon as cost does not retroactively cancel already committed target legality. Shared ordering among cross-game before-target mechanisms requires an explicit new global hook, not one offer per target.",
        "basis": "Mobile uses-when trigger; exact host hook ordering proposed. Current-client exotic nested priority not verified.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P7",
        "title": "Damage event cardinality",
        "rule": "称象 and 御策 trigger once per resolved damage EVENT, not once per damage point; a 2 damage event gets one chance. Use actual damage receiver after transfer and rescue; finally-dead holder cannot use ordinary after-damage abilities. Prevented damage and pure HP loss are not damage. 仁心 prevents complete pending damage, so no receiver after-damage, dying, card-damage benefit or chain propagation origin at es from prevented HP loss.",
        "basis": "Official Mobile 2015 explicitly一次伤害; catalog受伤 wording; current host damage event lifecycle. Cross-game callback order disclosed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P8",
        "title": "Ren xin global window and costs",
        "rule": "Offer all living effective 仁心 holders other than final damage receiver when receiver currently HP=1 and positive damage is about to reduce HP. Freeze exact damage_event_id and final receiver; source may be absent. Source core order is flip owner AND discard 1 equipment then prevent this entire damage. Pre validate selected card before irreversible flip; protect against stale/double commit. Use real flip toggle, even face-down→face-up. Equipment may be in hand or equipped. Do not require owner face-up or ally target.",
        "basis": "Official Mobile 123 hidden panel and 2015 notice. Placement after transfer/armor and global action-order arbitration are explicit shared-host ordering, not current-client precedence certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P9",
        "title": "Reveal-four transaction",
        "rule": "称象 removes up to 4 actual top physical cards into a public processing batch, offers any subset with printed/effective source point sum <= 13, then owner obtains chosen cards and all unchosen cards go to discard. It is obtain, not draw 4 then discard; no judgment/retrial. Numeric A/J/Q/K use 1/11/12/13. Original order and physical identities preserved, no cloning. Empty selection is safe decline of obtain; source catalog permits任意张.",
        "basis": "Official Mobile 123 +2015 notice remainder clause. Empty deck reshuffle and foreign null-rank support are separate host card/deck policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P10",
        "title": "Unresolved rank less foreign material",
        "rule": "Shared-policy proposal only: reveal rank less foreign cards visibly but do not select them for a numeric-sum requirement until the host has an approved rank convention; valid rank 1..13 cards remain selectable. Never treat null as 0 or invent source ranks. A host may alternatively disable foreign unranked packs for this interaction; source SGS rules are unchanged.",
        "basis": "Foreign synthetic equipment may have rank null in actual host. This is not a missing intrinsic Mobile skill clause.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P11",
        "title": "Junxing transaction",
        "rule": "Once per actual owner PLAY, commit N>=1 exact owner hand discards and freeze their broad category SET. Other living target, including ally, chooses discard 1 HAND whose category is absent from every paid category, OR actually flips and drawsN. N is paid physical count, not unique-category count or current hand size. Empty-hand target remains legal, with flip/draw mandatory. Selecting all 3 categories makes discard branch impossible. No damage/HP loss, no draw-to 4, no extra forced cost.",
        "basis": "Mobile 125 full panel; OL 2016 explicitly at least 1 and flip-then-draw, supporting equal wording, not client certification. Class if ying foreign card families use sp 3.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P12",
        "title": "Yuce transaction",
        "rule": "After one actual damage event, living owner with hand may publicly reveal one exact HAND card, retaining it. Actual DAMAGE SOURCE may discard one of its own HAND cards in a different broad category; if it does, owner recovers 0, otherwise owner recovers 1. Owner does not choose/source steal the card. Same-source-as-owner is not excluded by Mobile wording. No skill if owner cannot show a handcard. Source-less or departed/dead-source execution is intrinsic-unverified U 1, not resolved by this contract.",
        "basis": "Mobile 125 hidden panel. No invented source-less heal/no-heal decision; OL contradiction is recorded.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P13",
        "title": "Zongxuan semantic discard",
        "rule": "Only cards belonging to holder HAND/EQUIPMENT immediately before an actual DISCARD and now in discard for that same movement may be selected. Exclude ordinary use/response cleanup, recast, obtain/give, equip replacement, personal-pile cleanup and death cleanup: to=discard alone is not reason=discard. Cards are moved, never copied, in owner-selected top-to-bottom order, without shuffling. May decline or choose subset; no artificial per-turn quota.",
        "basis": "Official Mobile 130 says因弃置而置入弃牌堆后. Own-card zone vocabulary and ordered top placement are usual shared-rule interpretation. Exact competition order with foreign loss triggers is host policy; no native judgment-zone expansion asserted.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P14",
        "title": "Zongxuan callback ordering",
        "rule": "Use committed movement record with immutable from-zone/card-owner/action and a current-physical-location recheck. Place selected subset after original discard commit and before later queued discard consumers in a disclosed stable host order. Do not recurse on the resulting discard→deck placement. Existing public_card_loss has no deck top destination, so add a trusted atomic ordered placement primitive plus origin audit; never re-gain into hand or independently splice duplicate cards.",
        "basis": "Actual V 28 movement API lacks decktop. Host ordering proposal, especially with foreign poison/loss callbacks, is not client certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P15",
        "title": "Zhi yan real use",
        "rule": "At actual owner END-phase event choose one living actor, including self/enemy, then that actor draws 1 and reveals that exact physical card. If it is equipment, recipient is actual USER of that card and must use it, then recipient recovers 1. Do not simply grant weapon, discard, or heal before use. Actual use history, equipment replacement/enter/leave, and any legal on-use reactions must run. Owner does not become card user or gain the card.",
        "basis": "Mobile 130 hidden panel; OL 2017 matching order; OL 2016 update changed old heal-before-use order. Generic prohibited/abolished-slot use branch remain su 2, not implicitly healed or suppressed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P16",
        "title": "Jingce real phase end and immutable use count",
        "rule": "Dispatch once at the genuine end of an actual entered owner PLAY phase, before restoring phase or running END; this is not restricted to clicking an End button. Exclude skipped or never-entered phases and finally-dead owners. Count all committed actual use records with actor_id=owner and turn_id=current, not only outermost uses, material counts, discard totals or Slash quota. Longyin-exempt Slash remains a use. Snapshot use count and current HP at this event; keep the use count until the whole-turn boundary. Each actual extra PLAY and normal PLAY has its own end event.",
        "basis": "Official Mobile 124 explicit whole turn; BWIKI current phase excluded. Extra PLAY scheduler/interrupt/replay semantics are disclosed host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P17",
        "title": "Parent-confirmed Zhi yan failed-use compatibility",
        "rule": "On 直言 equipment branch, attempt the recipient actual legal use of that exact card. Only a successful real equipment use is followed by skill recovery 1. If card use is prohibited or the required slot is abolished, leave the card in recipient hand, do not equip or claim a use, and do not recover. If a draw interceptor already moved the card, do not reclaim or substitute it. Native Mobile failure-path behavior remains unverified U 2.",
        "basis": "Parent task instruction 2026-10-15 T 23:26 UTC explicitly selected this host policy; it is not a newly verified source-game rule.",
        "status": "parent_confirmed_host_compatibility_not_native_client_certification"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-later/yu-fan.svg",
    "skill_callback_modules": {
      "sgs.zongxuan": "sgs-later-yufan-skills.js",
      "sgs.zhiyan": "sgs-later-yufan-skills.js"
    },
    "gender_official_field_verified": false,
    "gender_provenance": {
      "source_id": "bwiki-yufan",
      "kind": "same_product_classic_explicit_gender",
      "raw_sha256": "ae60c10d7b459a6888a296309eaf400dfe8a3c7a1613f908c986cd2e33cfc207",
      "revision_id": 26175,
      "revision_timestamp_utc": "2024-02-24T10:11:00Z",
      "html_line": 626,
      "field": "gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_id": "bwiki-yufan",
      "url": "https://wiki.biligame.com/msgs/%E8%99%9E%E7%BF%BB",
      "raw_sha256": "ae60c10d7b459a6888a296309eaf400dfe8a3c7a1613f908c986cd2e33cfc207",
      "revision_id": 26175,
      "revision_timestamp_utc": "2024-02-24T10:11:00Z",
      "html_line": 635,
      "hp_numeric": 3,
      "hp_icon_count": 3,
      "initial_hp_direct_source_value": null,
      "current_client_verified": false,
      "display_note": "同产品经典社区显式数字／勾玉体力与性别；非官网显式字段，未核验2026当前客户端。独立初始体力未知，P0满体力初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.yu-fan",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "虞翻",
      "faction": "吴",
      "gender": "male",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "P0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "纵玄",
        "直言"
      ],
      "complete_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "纵玄",
          "直言"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.zongxuan",
            "name": "纵玄",
            "type": "optional_after_own_discard_ordered_decktop",
            "timing": "After holder cards actually enter discard because of DISCARD, own or other turns",
            "quota": "No per-turn or per-phase limit; once per actual movement batch",
            "cost": "No additional card/HP cost; move subset of that actual discarded batch",
            "targets": "Own just-discarded eligible physical cards, no actor target",
            "effects": [
              "May move any selected subset of those cards to top of deck in chosen order; top-order visibly pre viewed, first selected top convention explicit.",
              "Cards not selected remain discard. Do not recover into hand, shuffle, copy or substitute other discard cards.",
              "Actual use/response cleanup, equipment replacement and giving are not by themselves discard actions.",
              "No界 active PLAY draw 1+put 1 branch or上家 discard/END trigger."
            ],
            "official_rule_text": "当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-yufan",
              "bwiki-zongxuan"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P3",
              "P13",
              "P14"
            ],
            "limited_marker": null,
            "awakening_marker": null
          },
          {
            "id": "sgs.zhiyan",
            "name": "直言",
            "type": "optional_end_phase_draw_reveal_forced_equipment_use_recover",
            "timing": "Owner actual END-phase occur ren ce after discard phase",
            "quota": "One optional activation per END-phase occur ren ce; no action button outside this window",
            "cost": "No card or HP cost",
            "targets": "One living actor, including self, ally or enemy; no range/faction/gender/HP restriction",
            "effects": [
              "Target draws 1 and publicly reveals this exact physical card.",
              "If not equipment, no further effect: target keeps drawn card normally.",
              "If equipment, target uses it as real card user, then recovers 1 capped by max HP; mandatory after initial target selection when use legal.",
              "Existing same-slot equipment replaces with full leave/enter callbacks; source owner is not equipment user.",
              "Native prohibited-use/abolished-slot branch remains unverified U 2. Host P 17: if a real legal equipment use succeeds, recover 1 afterward; if prohibited or required slot abolished, keep the drawn card in hand, record no card use, and do not recover."
            ],
            "official_rule_text": "结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-yufan",
              "bwiki-zhiyan"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P2",
              "P4",
              "P15",
              "P17"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "intrinsic_unresolved": [
              "U2"
            ]
          }
        ]
      },
      "signature_sha256": "9eab78c5d83b3723e953e3afb8746a0f71de4fa60967dc67a3272886f8aafed6",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 97,
      "source_alias_records_checked": 7,
      "comparison_basis": "actual V28 working tree source records captured2026-10-15, not a previous release label",
      "comparison_scope": "Frozen V28 97 selectable entities plus 7 source aliases; no new aliases."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-yufan",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-130.html",
        "raw_path": "evidence/mobile-yufan.html",
        "sha256": "28adb36d4ff8ece67ef8c9fbb61af4e7844c893b775805eed9db65dfdad953dc",
        "current_client_verified": false
      },
      {
        "id": "bwiki-yufan",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E8%99%9E%E7%BF%BB",
        "raw_path": "evidence/bwiki-yufan.html",
        "sha256": "ae60c10d7b459a6888a296309eaf400dfe8a3c7a1613f908c986cd2e33cfc207",
        "current_client_verified": false
      },
      {
        "id": "bwiki-zongxuan",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E7%BA%B5%E7%8E%84",
        "raw_path": "evidence/bwiki-zongxuan.html",
        "sha256": "85b0692cab28ef74a8208a90d7f02ec180e23581a4c6f3287042d1220c1c72a6",
        "current_client_verified": false
      },
      {
        "id": "bwiki-zhiyan",
        "tier": "same_product_dated_community_metadata_or_skill_crosscheck",
        "url": "https://wiki.biligame.com/msgs/%E7%9B%B4%E8%A8%80",
        "raw_path": "evidence/bwiki-zhiyan.html",
        "sha256": "ef9a4378abd630007dcedcbe39e64de48db6bdc57885b13073175305b8a86980",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "reason": "Complete personal skill inventory does not certify native identity, lord, rewards or victory scheduling."
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "handling": "P0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "current client",
        "handling": "Undated official selected catalog and dated community metadata are not logged-in current-client verification"
      },
      {
        "field": "cross-game ordering",
        "handling": "P1–P17 are explicit host contracts, not native client certification"
      },
      {
        "field": "U2 forced equipment use prohibited/abolished/stale",
        "handling": "Native branch unverified. P17 host: only successful real legal equipment use then heal; prohibited/abolished/stale produces no fake use/equip/heal."
      }
    ],
    "adaptation_notes": "P0满体力初始化；P1–P17为明示江湖兼容，包括事件回执、全局伤害与用牌、阶段次数与整回合历史分离、真实弃牌排序回顶、结束阶段装备使用及来源版本选择。最大体力与性别为同产品经典社区字段，当前客户端及完整身份模式未核验。 直言U2原生分支未证；P17仅成功真实合法使用装备后回复，禁止／废槽／过期失败不制造用牌、装备或回复。"
  },
  {
    "key": "guohuai",
    "id": "sgs.adapted.base.hero.guo-huai",
    "source_name": "郭淮",
    "suggested_display_name": "郭淮",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "魏",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host full-max-HP initialization; independent initialHP unknown",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-whole-turn-jingce-2026-10-15",
    "official_page_id": 124,
    "source_refs": [
      "mobile-guohuai",
      "bwiki-guohuai"
    ],
    "intrinsic_skill_inventory": [
      "精策"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "source_ready_with_explicit_primary_secondary_version_boundary",
    "implementation_status": "tested",
    "skill_ids": [
      "sgs.jingce"
    ],
    "intrinsic_unresolved": [],
    "replaces_candidate": "满宠",
    "substitution_reason": "U 1 material source-less御策 branch unresolved. Preserve original complete满宠 inventory but do not implement invented effect.",
    "ui_requirements": [
      "At real owner PLAY end show count of real used cards in this whole turn and current HP threshold, optional draw 2.",
      "Show selected official whole turn scope, not BWIKI current phase text.",
      "No generic turn end extra-draw button or per-card trigger."
    ],
    "ai_policy": [
      "Normally accept eligible draw 2; no hidden-card/nextdeck need.",
      "Any optional choice remains available; target always owner."
    ],
    "excluded_variants": [
      "BWIKI current phase text is recorded conflict, not blended with selected official whole turn clause.",
      "界精策 counts cards entering discard from use/response on any turn END; excluded.",
      "谋精策 predictions/third-sixth-ninth deck positions excluded."
    ],
    "skills": [
      {
        "id": "sgs.jingce",
        "name": "精策",
        "type": "optional_play_phase_end_whole_turn_use_count_draw",
        "timing": "At end of an actual owner PLAY phase",
        "quota": "One opportunity per genuine PLAY end; no explicit once per turn marker",
        "cost": "none",
        "targets": "owner only",
        "effects": [
          "Count actual card USE events by this owner during current whole turn, including before current PLAY and nested actual uses. One view-as card use counts 1 regardless of material count, and material-free legal virtual use counts 1.",
          "If count >= current HP at trigger, owner may draw 2. Uses remain counted even if effect canceled/dodged/prevented.",
          "Response-only play, discard, recast, gift, skill activation without actual card use, and another actor use do not count.",
          "Skipped play has no actual entered-phase end opportunity. Actual extra PLAY each provides its own end opportunity; whole turn count continues."
        ],
        "official_rule_text": "出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guohuai"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P4",
          "P16"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "delayed_effect": null
      }
    ],
    "name": "郭淮",
    "display_name": "郭淮",
    "skill_name": "精策",
    "skill_desc": "精策：出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。",
    "source_character_name": "郭淮",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-whole-turn-jingce-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀郭淮",
      "guo-huai"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-124.html",
      "https://wiki.biligame.com/msgs/%E9%83%AD%E6%B7%AE"
    ],
    "source_records": [
      {
        "id": "mobile-guohuai",
        "url": "https://www.sanguosha.cn/pc/hero-detail-124.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-124.html",
        "status": 200,
        "bytes": 21501,
        "sha256": "9bcfd9debb6e3f7674fc98d6c35c326dbc56fe6c4e2f887bec072cd1a658751a",
        "accessed_at": "2026-10-15T23:17:27.724903+00:00",
        "raw_path": "evidence/mobile-guohuai.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
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
                  "name": "精策",
                  "hidden": false,
                  "rule_text": "出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。",
                  "rule_sha256": "8eb234769069ec82ad97e07bcddd2d37439449435c24298e3ad85d65f2e063a0",
                  "html_line": 186
                }
              ]
            }
          ],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "魏"
        },
        "limitations": [
          "Undated public catalog, no current-client audit.",
          "精策 selected primary wording counts wholeTURN; BWIKI classic says currentPHASE and is NOT chosen for skill text."
        ]
      },
      {
        "id": "bwiki-guohuai",
        "url": "https://wiki.biligame.com/msgs/%E9%83%AD%E6%B7%AE",
        "final_url": "https://wiki.biligame.com/msgs/%E9%83%AD%E6%B7%AE",
        "status": 200,
        "bytes": 82074,
        "sha256": "deca0f83252294a03134b86688138f27d877b828b9ec06ad59757c8ffed7443c",
        "accessed_at": "2026-10-15T23:17:27.770968+00:00",
        "raw_path": "evidence/bwiki-guohuai.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community_metadata_only_for_guohuai",
        "product": "三国杀移动版",
        "revision_id": 33756,
        "modified_at": "2025-10-21T13:06:43Z",
        "limitations": [
          "Community, not official/client authority.",
          "Skill wording is not authoritative here: currentPHASE differs selected official wholeTURN. HP/gender/faction fields used only."
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 637,
          "gender_html_line": 628,
          "faction_html_line": 629,
          "gender_excerpt": ">性别男 势力魏 <p class=",
          "faction_excerpt": ">势力魏 别称无别称 <div class=\"锚点\" style=\"position:re",
          "classic_section_html_line": 633,
          "hp_hidden_numeric_html_line": 637,
          "hp_evidence_locator": "First classic-section HP icon row and hidden numeric span; section heading recorded separately."
        }
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.jingce",
        "name": "精策",
        "type": "optional_play_phase_end_whole_turn_use_count_draw",
        "timing": "At end of an actual owner PLAY phase",
        "quota": "One opportunity per genuine PLAY end; no explicit once per turn marker",
        "cost": "none",
        "targets": "owner only",
        "effects": [
          "Count actual card USE events by this owner during current whole turn, including before current PLAY and nested actual uses. One view-as card use counts 1 regardless of material count, and material-free legal virtual use counts 1.",
          "If count >= current HP at trigger, owner may draw 2. Uses remain counted even if effect canceled/dodged/prevented.",
          "Response-only play, discard, recast, gift, skill activation without actual card use, and another actor use do not count.",
          "Skipped play has no actual entered-phase end opportunity. Actual extra PLAY each provides its own end opportunity; whole turn count continues."
        ],
        "official_rule_text": "出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guohuai"
        ],
        "policy_refs": [
          "P0",
          "P1",
          "P4",
          "P16"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "delayed_effect": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.jingce"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.jingce"
    ],
    "complete_skill_names": [
      "精策"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed-automated-rules-ui-replay-acceptance",
    "production_integration_status": "integrated-private-release",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "title": "Scope and initial HP",
        "rule": "This is a base identity public-catalog snapshot dated 2026-10-15; no Skins, no OL/界/国战 branches. Initial HP itself is not separately sourced, so host full-max initialization is disclosed. Max HP/gender/faction are actual classic same-product dated community fields cross checked against official faction. Keep all skills; do not raise playable counts before implementation/testing.",
        "basis": "Official full inline panels; BWIKI revision/date/HP icon+number.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P1",
        "title": "Event ownership and receipts",
        "rule": "Use real current effective skill ownership, stable actor/use/damage/movement/phase IDs, and JSON-safe receipts. Freeze event identity and revalidate after each awaited prompt. A declined optional activation has no cost; a completed cost cannot be paid twice on duplicate event, replay, repeated click or save reload. A removed skill is unavailable for a new activation. Do not let lifecycle copying mutate the immutable original source template.",
        "basis": "Existing hero lifecycle/general-skill descriptor and event ledger design; host compatibility.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P2",
        "title": "Lawful options versus AI",
        "rule": "Legal target enumeration must not depend on team, distance, faction or gender unless a source clause says so. AI may prefer allies for support and enemies for disruption, using public board and its own private cards only. AI never knows another actor hand faces or future deck order. UI must offer all legal choices to a human.",
        "basis": "Explicit team mode compatibility, not native identity-strategy certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P3",
        "title": "Broad card zones and foreign types",
        "rule": "Unqualified discard-one-card uses own HAND or EQUIPMENT, never judgment or personal piles; discard-hand uses HAND only. Card category is basic/trick/equipment, not concrete names; delayed trick belongs to trick. SGS names and foreign analogous families need explicit host mappings. Null/invalid ranks are never silently treated as 0,1,13; supported rank policy must be declared before 称象 encounters rank less foreign cards.",
        "basis": "Common source vocabulary and existing host material API; cross-game rank/category mappings are separate unverified host decisions.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P4",
        "title": "Delayed and extra phases",
        "rule": "Skills listen to event actor, not globally active UI owner. 龙吟 requires Slash user to be the owner of that real active PLAY phase, including actual extra play; another actor using Slash inside that phase does not qualify. No new whole turn/phase is created by any of these four heroes. 峻刑 quotas belong to each actual owner PLAY phase; 直言 belongs only to owner END-phase occur ren ce, not arbitrary global turn end. Flipping toggles face orientation; it does not immediately skip a currently running phase or force face-down.",
        "basis": "Selected source clauses plus actual V 28 phase and flip contracts.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P5",
        "title": "History versus quota",
        "rule": "Long yin excludes one committed Slash from its source PLAY-phase quota. Preserve immutable card-use history, physical card use, used-Slash flags, action activity for 克己/隐忍 and per-turn totals. Do not blindly decrement sha_count_this_turn: current host also uses it for original whole-turn allowances. Track phase quota exclusion by exact use receipt, clamp exempt counts at 0, and retain an already quota-free use as a real use. Whole-turn original limits remain their own explicit host rule.",
        "basis": "Mobile 龙吟 phase-use wording plus actual V 28 counter/history split; cross-game scope is host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P6",
        "title": "Window after commitment",
        "rule": "龙吟 is post-legal-use commitment, not permission to announce a second illegal Slash when quota is already exhausted. Finish initial card material-loss events and freeze final effective Slash face before offering; then resolve it before target response/damage. Removing the attacker weapon as cost does not retroactively cancel already committed target legality. Shared ordering among cross-game before-target mechanisms requires an explicit new global hook, not one offer per target.",
        "basis": "Mobile uses-when trigger; exact host hook ordering proposed. Current-client exotic nested priority not verified.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P7",
        "title": "Damage event cardinality",
        "rule": "称象 and 御策 trigger once per resolved damage EVENT, not once per damage point; a 2 damage event gets one chance. Use actual damage receiver after transfer and rescue; finally-dead holder cannot use ordinary after-damage abilities. Prevented damage and pure HP loss are not damage. 仁心 prevents complete pending damage, so no receiver after-damage, dying, card-damage benefit or chain propagation origin at es from prevented HP loss.",
        "basis": "Official Mobile 2015 explicitly一次伤害; catalog受伤 wording; current host damage event lifecycle. Cross-game callback order disclosed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P8",
        "title": "Ren xin global window and costs",
        "rule": "Offer all living effective 仁心 holders other than final damage receiver when receiver currently HP=1 and positive damage is about to reduce HP. Freeze exact damage_event_id and final receiver; source may be absent. Source core order is flip owner AND discard 1 equipment then prevent this entire damage. Pre validate selected card before irreversible flip; protect against stale/double commit. Use real flip toggle, even face-down→face-up. Equipment may be in hand or equipped. Do not require owner face-up or ally target.",
        "basis": "Official Mobile 123 hidden panel and 2015 notice. Placement after transfer/armor and global action-order arbitration are explicit shared-host ordering, not current-client precedence certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P9",
        "title": "Reveal-four transaction",
        "rule": "称象 removes up to 4 actual top physical cards into a public processing batch, offers any subset with printed/effective source point sum <= 13, then owner obtains chosen cards and all unchosen cards go to discard. It is obtain, not draw 4 then discard; no judgment/retrial. Numeric A/J/Q/K use 1/11/12/13. Original order and physical identities preserved, no cloning. Empty selection is safe decline of obtain; source catalog permits任意张.",
        "basis": "Official Mobile 123 +2015 notice remainder clause. Empty deck reshuffle and foreign null-rank support are separate host card/deck policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P10",
        "title": "Unresolved rank less foreign material",
        "rule": "Shared-policy proposal only: reveal rank less foreign cards visibly but do not select them for a numeric-sum requirement until the host has an approved rank convention; valid rank 1..13 cards remain selectable. Never treat null as 0 or invent source ranks. A host may alternatively disable foreign unranked packs for this interaction; source SGS rules are unchanged.",
        "basis": "Foreign synthetic equipment may have rank null in actual host. This is not a missing intrinsic Mobile skill clause.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P11",
        "title": "Junxing transaction",
        "rule": "Once per actual owner PLAY, commit N>=1 exact owner hand discards and freeze their broad category SET. Other living target, including ally, chooses discard 1 HAND whose category is absent from every paid category, OR actually flips and drawsN. N is paid physical count, not unique-category count or current hand size. Empty-hand target remains legal, with flip/draw mandatory. Selecting all 3 categories makes discard branch impossible. No damage/HP loss, no draw-to 4, no extra forced cost.",
        "basis": "Mobile 125 full panel; OL 2016 explicitly at least 1 and flip-then-draw, supporting equal wording, not client certification. Class if ying foreign card families use sp 3.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P12",
        "title": "Yuce transaction",
        "rule": "After one actual damage event, living owner with hand may publicly reveal one exact HAND card, retaining it. Actual DAMAGE SOURCE may discard one of its own HAND cards in a different broad category; if it does, owner recovers 0, otherwise owner recovers 1. Owner does not choose/source steal the card. Same-source-as-owner is not excluded by Mobile wording. No skill if owner cannot show a handcard. Source-less or departed/dead-source execution is intrinsic-unverified U 1, not resolved by this contract.",
        "basis": "Mobile 125 hidden panel. No invented source-less heal/no-heal decision; OL contradiction is recorded.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P13",
        "title": "Zongxuan semantic discard",
        "rule": "Only cards belonging to holder HAND/EQUIPMENT immediately before an actual DISCARD and now in discard for that same movement may be selected. Exclude ordinary use/response cleanup, recast, obtain/give, equip replacement, personal-pile cleanup and death cleanup: to=discard alone is not reason=discard. Cards are moved, never copied, in owner-selected top-to-bottom order, without shuffling. May decline or choose subset; no artificial per-turn quota.",
        "basis": "Official Mobile 130 says因弃置而置入弃牌堆后. Own-card zone vocabulary and ordered top placement are usual shared-rule interpretation. Exact competition order with foreign loss triggers is host policy; no native judgment-zone expansion asserted.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P14",
        "title": "Zongxuan callback ordering",
        "rule": "Use committed movement record with immutable from-zone/card-owner/action and a current-physical-location recheck. Place selected subset after original discard commit and before later queued discard consumers in a disclosed stable host order. Do not recurse on the resulting discard→deck placement. Existing public_card_loss has no deck top destination, so add a trusted atomic ordered placement primitive plus origin audit; never re-gain into hand or independently splice duplicate cards.",
        "basis": "Actual V 28 movement API lacks decktop. Host ordering proposal, especially with foreign poison/loss callbacks, is not client certification.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P15",
        "title": "Zhi yan real use",
        "rule": "At actual owner END-phase event choose one living actor, including self/enemy, then that actor draws 1 and reveals that exact physical card. If it is equipment, recipient is actual USER of that card and must use it, then recipient recovers 1. Do not simply grant weapon, discard, or heal before use. Actual use history, equipment replacement/enter/leave, and any legal on-use reactions must run. Owner does not become card user or gain the card.",
        "basis": "Mobile 130 hidden panel; OL 2017 matching order; OL 2016 update changed old heal-before-use order. Generic prohibited/abolished-slot use branch remain su 2, not implicitly healed or suppressed.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P16",
        "title": "Jingce real phase end and immutable use count",
        "rule": "Dispatch once at the genuine end of an actual entered owner PLAY phase, before restoring phase or running END; this is not restricted to clicking an End button. Exclude skipped or never-entered phases and finally-dead owners. Count all committed actual use records with actor_id=owner and turn_id=current, not only outermost uses, material counts, discard totals or Slash quota. Longyin-exempt Slash remains a use. Snapshot use count and current HP at this event; keep the use count until the whole-turn boundary. Each actual extra PLAY and normal PLAY has its own end event.",
        "basis": "Official Mobile 124 explicit whole turn; BWIKI current phase excluded. Extra PLAY scheduler/interrupt/replay semantics are disclosed host policy.",
        "status": "explicit_host_contract_not_native_client_certification"
      },
      {
        "id": "P17",
        "title": "Parent-confirmed Zhi yan failed-use compatibility",
        "rule": "On 直言 equipment branch, attempt the recipient actual legal use of that exact card. Only a successful real equipment use is followed by skill recovery 1. If card use is prohibited or the required slot is abolished, leave the card in recipient hand, do not equip or claim a use, and do not recover. If a draw interceptor already moved the card, do not reclaim or substitute it. Native Mobile failure-path behavior remains unverified U 2.",
        "basis": "Parent task instruction 2026-10-15 T 23:26 UTC explicitly selected this host policy; it is not a newly verified source-game rule.",
        "status": "parent_confirmed_host_compatibility_not_native_client_certification"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-later/guo-huai.svg",
    "skill_callback_modules": {
      "sgs.jingce": "sgs-later-guohuai-skills.js"
    },
    "gender_official_field_verified": false,
    "gender_provenance": {
      "source_id": "bwiki-guohuai",
      "kind": "same_product_classic_explicit_gender",
      "raw_sha256": "deca0f83252294a03134b86688138f27d877b828b9ec06ad59757c8ffed7443c",
      "revision_id": 33756,
      "revision_timestamp_utc": "2025-10-21T13:06:43Z",
      "html_line": 628,
      "field": "gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_id": "bwiki-guohuai",
      "url": "https://wiki.biligame.com/msgs/%E9%83%AD%E6%B7%AE",
      "raw_sha256": "deca0f83252294a03134b86688138f27d877b828b9ec06ad59757c8ffed7443c",
      "revision_id": 33756,
      "revision_timestamp_utc": "2025-10-21T13:06:43Z",
      "html_line": 637,
      "hp_numeric": 4,
      "hp_icon_count": 4,
      "initial_hp_direct_source_value": null,
      "current_client_verified": false,
      "display_note": "同产品经典社区显式数字／勾玉体力与性别；非官网显式字段，未核验2026当前客户端。独立初始体力未知，P0满体力初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.guo-huai",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-whole-turn-jingce-2026-10-15",
      "source_character_name": "郭淮",
      "faction": "魏",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "P0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "精策"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "精策"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.jingce",
            "name": "精策",
            "type": "optional_play_phase_end_whole_turn_use_count_draw",
            "timing": "At end of an actual owner PLAY phase",
            "quota": "One opportunity per genuine PLAY end; no explicit once per turn marker",
            "cost": "none",
            "targets": "owner only",
            "effects": [
              "Count actual card USE events by this owner during current whole turn, including before current PLAY and nested actual uses. One view-as card use counts 1 regardless of material count, and material-free legal virtual use counts 1.",
              "If count >= current HP at trigger, owner may draw 2. Uses remain counted even if effect canceled/dodged/prevented.",
              "Response-only play, discard, recast, gift, skill activation without actual card use, and another actor use do not count.",
              "Skipped play has no actual entered-phase end opportunity. Actual extra PLAY each provides its own end opportunity; whole turn count continues."
            ],
            "official_rule_text": "出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-guohuai"
            ],
            "policy_refs": [
              "P0",
              "P1",
              "P4",
              "P16"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "delayed_effect": null
          }
        ]
      },
      "signature_sha256": "6a4f360435c9182b7f8d29232c896e78f9869f1edbacb0f4048ab2614bc9a058",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 97,
      "source_alias_records_checked": 7,
      "comparison_basis": "actual V28 working tree source records captured2026-10-15, not a previous release label",
      "comparison_scope": "Frozen V28 97 selectable entities plus 7 source aliases; no new aliases."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-guohuai",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-124.html",
        "raw_path": "evidence/mobile-guohuai.html",
        "sha256": "9bcfd9debb6e3f7674fc98d6c35c326dbc56fe6c4e2f887bec072cd1a658751a",
        "current_client_verified": false
      },
      {
        "id": "bwiki-guohuai",
        "tier": "same_product_dated_community_metadata_only_for_guohuai",
        "url": "https://wiki.biligame.com/msgs/%E9%83%AD%E6%B7%AE",
        "raw_path": "evidence/bwiki-guohuai.html",
        "sha256": "deca0f83252294a03134b86688138f27d877b828b9ec06ad59757c8ffed7443c",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "reason": "Complete personal skill inventory does not certify native identity, lord, rewards or victory scheduling."
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "handling": "P0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "current client",
        "handling": "Undated official selected catalog and dated community metadata are not logged-in current-client verification"
      },
      {
        "field": "cross-game ordering",
        "handling": "P1–P17 are explicit host contracts, not native client certification"
      },
      {
        "field": "whole-turn versus current-phase Jingce",
        "handling": "Explicitly selected official catalog124 whole-turn use count. Community current-phase wording is an excluded different variant."
      }
    ],
    "adaptation_notes": "P0满体力初始化；P1–P17为明示江湖兼容，包括事件回执、全局伤害与用牌、阶段次数与整回合历史分离、真实弃牌排序回顶、结束阶段装备使用及来源版本选择。最大体力与性别为同产品经典社区字段，当前客户端及完整身份模式未核验。 精策选择官网124本回合用牌统计；社区本阶段版独立排除。"
  }
];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_YIJIANG_LATER_DEFINITIONS=freeze(definitions);
