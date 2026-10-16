/** V30 complete selected source packets. Runtime integration and final private-release checks passed; current-client certification remains false. */
const definitions = [
  {
    "key": "lidian",
    "id": "sgs.adapted.base.hero.li-dian",
    "source_name": "李典",
    "suggested_display_name": "李典",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "魏",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host initialization",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 170,
    "source_refs": [
      "mobile-lidian",
      "bwiki-lidian",
      "bwiki-wangxi"
    ],
    "intrinsic_skill_inventory": [
      "恂恂",
      "忘隙"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.xunxun",
      "sgs.wangxi"
    ],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.xunxun",
        "name": "恂恂",
        "type": "optional_private_draw_start_top_bottom_order",
        "timing": "Start of owner actually entered DRAW phase",
        "quota": "One opportunity per real DRAW phase start; no once/game marker",
        "cost": "None",
        "targets": "Owner privately views real deck top4",
        "effects": [
          "Optionally inspect exactly top4; choose exactly2 in desired top order, all remaining2 in desired bottom order. Both orders selectable.",
          "Return cards to deck; do not directly gain selected cards and do not replace normal drawing. Subsequent ordinary/modifier/replacement draws occur normally.",
          "Stage/order selection cannot publicly expose faces, cause fake hand loss, obtain/discard, or count a card use."
        ],
        "official_rule_text": "摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-lidian",
          "bwiki-lidian"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5"
        ]
      },
      {
        "id": "sgs.wangxi",
        "name": "忘隙",
        "type": "optional_per_damage_point_pair_draw",
        "timing": "After owner deals damage to OTHER, or receives damage from OTHER; after rescue",
        "quota": "One optional offer PER POINT of actual damage, not once per damage event, no turn quota",
        "cost": "None",
        "targets": "Owner and the other actual damage participant; any team; no distance condition",
        "effects": [
          "For each actual damage point, owner may cause owner and that OTHER participant each draw1. Choices are independent per point; a2 damage event permits0/1/2 activations.",
          "Source branch uses actual damage source and final receiver; incoming branch uses actual other source, never substitutes card user. Self damage and source-less damage do not qualify.",
          "Shared action order resolves recipients; no damage reduction, prevention, counter-damage or hand-size condition. Only resolved positive damage, not HP loss or prevented damage."
        ],
        "official_rule_text": "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-lidian",
          "bwiki-lidian",
          "bwiki-wangxi"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5"
        ]
      }
    ],
    "ui_requirements": [
      "Private4-card ordering tray, exactly2 top and2 bottom, explicit first-next-draw direction in each tray; no public card faces.",
      "Damage-event and point-index owner prompt; identify actual other participant and sequential pair-draw order.",
      "Both skills optional; enemy legal despite AI declining. No active generic damage skill."
    ],
    "ai_policy": [
      "Xunxun may score only the4 legitimately viewed cards with own known cards/public board.",
      "Wangxi can decline enemy support and accept own/allied value; cannot remove legally valid enemy offers or inspect enemy hand."
    ],
    "excluded_variants": [
      "Official group0身份 only. Group1国战 audited separately but not merged as second skill set.",
      "Do not use OL earlier Xunxun take2-into-hand/replacement wording.",
      "No骥李典 or other prefixed character."
    ],
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "P0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "finite deck / death-between-recipients / foreign poison",
        "status": "shared_host",
        "host_policy": "P2-P5"
      }
    ],
    "name": "李典",
    "display_name": "李典",
    "skill_name": "恂恂/忘隙",
    "skill_desc": "恂恂：摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。 忘隙：当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
    "source_character_name": "李典",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀李典",
      "li-dian"
    ],
    "source_urls": [
      "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%85%B8",
      "https://wiki.biligame.com/msgs/%E5%BF%98%E9%9A%99",
      "https://www.sanguosha.cn/pc/hero-detail-170.html"
    ],
    "source_records": [
      {
        "id": "bwiki-lidian",
        "url": "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%85%B8",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%85%B8",
        "status": 200,
        "bytes": 91100,
        "sha256": "8a853f04b64415e34ff5556f19ececa61c1afdad72b063913ef7e1c67869e6d4",
        "accessed_at": "2026-10-15T23:50:40.955593+00:00",
        "raw_path": "evidence/bwiki-lidian.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community",
        "product": "三国杀移动版",
        "revision_id": 38079,
        "modified_at": "2026-04-15T12:48:52Z",
        "limitations": [
          "Community source; not official or current-client certification.",
          "Article date does not independently date all transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 695,
          "gender_html_line": 686,
          "faction_html_line": 687,
          "gender_excerpt": ">性别男 势力魏 <p class=",
          "faction_excerpt": ">势力魏 别称大哥 <div class=\"锚点\" style=\"position:rel"
        }
      },
      {
        "id": "bwiki-wangxi",
        "url": "https://wiki.biligame.com/msgs/%E5%BF%98%E9%9A%99",
        "final_url": "https://wiki.biligame.com/msgs/%E5%BF%98%E9%9A%99",
        "status": 200,
        "bytes": 68330,
        "sha256": "f1318d388a5eda2b775cfe69b67c315241fc24662acee5b75accc76fc89da8df",
        "accessed_at": "2026-10-15T23:50:44.972555+00:00",
        "raw_path": "evidence/bwiki-wangxi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community",
        "product": "三国杀移动版",
        "revision_id": 22448,
        "modified_at": "2023-04-26T10:51:02Z",
        "limitations": [
          "Community source; not official or current-client certification.",
          "Article date does not independently date all transcluded skill templates."
        ]
      },
      {
        "id": "mobile-lidian",
        "url": "https://www.sanguosha.cn/pc/hero-detail-170.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-170.html",
        "status": 200,
        "bytes": 21694,
        "sha256": "378bf147e520e2b74e570c7fa96321ae106c579fbf48be97ea6c723fb001c9e9",
        "accessed_at": "2026-10-15T23:52:04.621615+00:00",
        "raw_path": "evidence/mobile-lidian.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
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
                  "name": "恂恂",
                  "hidden": false,
                  "rule_text": "摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。",
                  "html_line": 179,
                  "rule_sha256": "27c6e047ce5d9554026e73452c73b60072af8325dbc78fd702791ae18300d5f2"
                },
                {
                  "name": "忘隙",
                  "hidden": true,
                  "rule_text": "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
                  "html_line": 180,
                  "rule_sha256": "48e515b1347abdd10e18255a14fdfcfb094bd176d79515911a16904d478d0466"
                }
              ]
            },
            {
              "mode": "国战",
              "group_hidden": true,
              "panels": [
                {
                  "name": "恂恂",
                  "hidden": false,
                  "rule_text": "摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。",
                  "html_line": 179,
                  "rule_sha256": "27c6e047ce5d9554026e73452c73b60072af8325dbc78fd702791ae18300d5f2"
                },
                {
                  "name": "忘隙",
                  "hidden": true,
                  "rule_text": "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
                  "html_line": 180,
                  "rule_sha256": "48e515b1347abdd10e18255a14fdfcfb094bd176d79515911a16904d478d0466"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "excluded_groups": [
            "国战"
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
          "Undated public catalog; not a current logged-in Mobile client audit.",
          "No direct numeric maxHP or gameplay gender field in official HTML; no art downloaded."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.xunxun",
        "name": "恂恂",
        "type": "optional_private_draw_start_top_bottom_order",
        "timing": "Start of owner actually entered DRAW phase",
        "quota": "One opportunity per real DRAW phase start; no once/game marker",
        "cost": "None",
        "targets": "Owner privately views real deck top4",
        "effects": [
          "Optionally inspect exactly top4; choose exactly2 in desired top order, all remaining2 in desired bottom order. Both orders selectable.",
          "Return cards to deck; do not directly gain selected cards and do not replace normal drawing. Subsequent ordinary/modifier/replacement draws occur normally.",
          "Stage/order selection cannot publicly expose faces, cause fake hand loss, obtain/discard, or count a card use."
        ],
        "official_rule_text": "摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-lidian",
          "bwiki-lidian"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5"
        ]
      },
      {
        "id": "sgs.wangxi",
        "name": "忘隙",
        "type": "optional_per_damage_point_pair_draw",
        "timing": "After owner deals damage to OTHER, or receives damage from OTHER; after rescue",
        "quota": "One optional offer PER POINT of actual damage, not once per damage event, no turn quota",
        "cost": "None",
        "targets": "Owner and the other actual damage participant; any team; no distance condition",
        "effects": [
          "For each actual damage point, owner may cause owner and that OTHER participant each draw1. Choices are independent per point; a2 damage event permits0/1/2 activations.",
          "Source branch uses actual damage source and final receiver; incoming branch uses actual other source, never substitutes card user. Self damage and source-less damage do not qualify.",
          "Shared action order resolves recipients; no damage reduction, prevention, counter-damage or hand-size condition. Only resolved positive damage, not HP loss or prevented damage."
        ],
        "official_rule_text": "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-lidian",
          "bwiki-lidian",
          "bwiki-wangxi"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P2",
          "P3",
          "P4",
          "P5"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.xunxun",
      "sgs.wangxi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.xunxun",
      "sgs.wangxi"
    ],
    "complete_skill_names": [
      "恂恂",
      "忘隙"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "scope": "shared_host",
        "contract": "Initialize starting HP to maxHP. Direct independent initialHP field remains null; team identity/reward/victory adaptations are not native-client certification."
      },
      {
        "id": "P1",
        "scope": "shared_host",
        "contract": "Use actor-scoped live effective skill ownership, actual phase IDs and damage IDs. Persist committed receipts; never duplicate cost/draw/order on stale prompt or replay. Do not mutate immutable templates when copied or removed."
      },
      {
        "id": "P2",
        "scope": "shared_host",
        "contract": "Only a live effective owner and live other damage participant may start Wangxi. Source-less and self-inflicted damage fail its OTHER-role clause. If either dies between per-point opportunities, stop later opportunities. Shared native death timing is not independently certified by these sources."
      },
      {
        "id": "P3",
        "scope": "shared_host",
        "contract": "Two draw recipients resolve one at a time in current action order, preserving poison/other draw interception and any already committed draw. AI cannot see opponents hands or unviewed deck."
      },
      {
        "id": "P4",
        "scope": "shared_host",
        "contract": "Deck top is array end in this engine. Privately stage actual top cards with physical identity; atomic ordered top/bottom return has no gain/discard/use events. If fewer than4 exist after normal refill, use available count, top min(2,n), others bottom. This finite-deck fallback is host policy."
      },
      {
        "id": "P5",
        "scope": "shared_host",
        "contract": "Xunxun is draw-phase START ordering, not replacement of normal drawing and not before a skip decision. If phase is skipped/blocked entirely no opportunity. If only ordinary drawing later replaced, ordering has still happened."
      },
      {
        "id": "P6",
        "scope": "shared_host",
        "contract": "Unqualified own discard/give uses hand or equipment, not judgment/skill piles. Discard another role one card uses H/E/J with blind hand choice. Category projection is basic/trick/equipment; imported card categories explicitly mapped."
      },
      {
        "id": "P7",
        "scope": "shared_host",
        "contract": "For a range-gated skill paid by equipment, legal target must remain in actual attack range after selected equipment is removed, including weapon and offensive horse. Other physical modifiers remain. Do not substitute Slash-only unlimited distance for attack range."
      },
      {
        "id": "P8",
        "scope": "shared_host",
        "contract": "Commit exact N-card cost atomically, freeze next activation ordinal and consume phase count at successful payment. Invalid/cancelled precommit does not increment. Resolved cost triggers still run even if effect later impossible; no refund or forced alternate target."
      },
      {
        "id": "P9",
        "scope": "shared_host",
        "contract": "Luoying requires semantic DISCARD or JUDGMENT movement into discard, not destination alone. Use effective club suit captured for the original loss/judgment context, other former/judged actor, current discard physical location+epoch. Exclude use/response/recast/Pindian and ordinary death/pile cleanup, and equipment replacement lacking actual discard reason. No re-taking a card already gained/moved by another skill."
      },
      {
        "id": "P10",
        "scope": "shared_host_native_edge_unverified",
        "contract": "Judgment-origin Luoying attribution: both replaced judgment cards and final judgment cards discarded from another actor judgment may qualify; record judged actor and judgment ID when physical card enters judgment processing. Retrial material becomes a judgment card, not an ordinary response loss. Merely resolving/discarding the delayed-trick card does not qualify by judgment cause. This is explicit host interpretation, not directly certified Mobile FAQ."
      },
      {
        "id": "P11",
        "scope": "shared_host",
        "contract": "Global Luoying opportunities follow owner loss/judgment movement receipt and current action order. Each owner may independently choose eligible exact cards still in discard. Batch may offer subset via independent per-card decisions; no card cloned and no original equipment/poison callback undone."
      },
      {
        "id": "P12",
        "scope": "selected_rule_interpretation_parent_confirmed",
        "contract": "Jiushi recovery selected from same-product detailed base skill: snapshot face_down immediately before actual HP deduction of this damage event; after damage/rescue require still face_down to offer one optional flip. Face-up damage then dying-Jiushi flip-down does not qualify. Official catalog shorthand only checks after-damage current face; discrepancy retained, not described as official client certification."
      },
      {
        "id": "P13",
        "scope": "shared_host",
        "contract": "Jiushi flip-to-wine is a real zero-material virtual Wine use. Validate ordinary Wine window/prohibition; offense shares existing once/actual-turn Wine quota, self-dying Wine does not consume offensive quota and recovers1. Commit flip and use atomically; record exactly1 real card use, not physical draw/discard. No free flip when Wine cannot be legally committed."
      },
      {
        "id": "P14",
        "scope": "selected_historical_rule_parent_confirmed",
        "contract": "Bifa uses saved official historical TRUE TURN START timing, not current wiki preparation text. In this host scheduled face-down whole-turn skip is processed BEFORE true on_turn_begin, so skipped scheduled turns do not settle Bifa. Native historical face-down interaction was not independently sourced; do not claim the timing words alone prove otherwise.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P15",
        "scope": "host_policy_pending_parent_decision",
        "contract": "Bifa pending cards are physical delayed obligations attributed to source and target. Native source death and source skill-loss behavior is unresolved. Do NOT decide that source skill loss cancels placed effects; do NOT decide source death forces later HP loss. Parent will choose unified lifecycle behavior after same-product research. Target-death cleanup must conserve exact physical card. No dependent implementation/expected result may be certified yet."
      },
      {
        "id": "P16",
        "scope": "shared_host",
        "contract": "Bifa placement is private hand-to-pile movement; private source loss does not public-reveal poison. At settlement only target gains viewing permission. Successful same-category target-hand give commits before target obtains pile card; refusal removes pile card to discard then target loses1HP (not damage). If nested death/cleanup makes the pile disappear, never duplicate it or manufacture unpaid gain."
      },
      {
        "id": "P17",
        "scope": "shared_host_native_lifecycle_unverified",
        "contract": "Songci one-time target usage persists by stable source actor and target ID for whole game, including later turns, phase changes and remove/reacquire of that actor skill. Copies on a different actor have their own ledger. Death/revival never refreshes old actor ledger. Commit mark at legal activation before effect; frozen less/greater branch based on current H versus HP. Losing/reacquiring resets no spent marks.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P18",
        "scope": "shared_host",
        "contract": "Songci discard2 permits target H/E only and target chooses its own cards; if fewer than2 legal cards remain due to intervening events, discard all available. Equality initially is ineligible. Bifa exact payment remains HAND only. Foreign categories use explicit basic/trick/equipment projection and never silently assign unknown category."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-more/li-dian.svg",
    "gender_provenance": {
      "source": "bwiki-lidian",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-lidian",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "魏",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 695,
        "gender_html_line": 686,
        "faction_html_line": 687,
        "gender_excerpt": ">性别男 势力魏 <p class=",
        "faction_excerpt": ">势力魏 别称大哥 <div class=\"锚点\" style=\"position:rel"
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "魏",
      "initial_hp_host_policy": "P0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "candidate_id": "sgs.adapted.base.hero.li-dian",
      "source_name": "李典",
      "complete_intrinsic_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "恂恂",
          "忘隙"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.xunxun",
            "name": "恂恂",
            "type": "optional_private_draw_start_top_bottom_order",
            "timing": "Start of owner actually entered DRAW phase",
            "quota": "One opportunity per real DRAW phase start; no once/game marker",
            "cost": "None",
            "targets": "Owner privately views real deck top4",
            "effects": [
              "Optionally inspect exactly top4; choose exactly2 in desired top order, all remaining2 in desired bottom order. Both orders selectable.",
              "Return cards to deck; do not directly gain selected cards and do not replace normal drawing. Subsequent ordinary/modifier/replacement draws occur normally.",
              "Stage/order selection cannot publicly expose faces, cause fake hand loss, obtain/discard, or count a card use."
            ],
            "official_rule_text": "摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-lidian",
              "bwiki-lidian"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "policy_refs": [
              "P0",
              "P1",
              "P2",
              "P3",
              "P4",
              "P5"
            ]
          },
          {
            "id": "sgs.wangxi",
            "name": "忘隙",
            "type": "optional_per_damage_point_pair_draw",
            "timing": "After owner deals damage to OTHER, or receives damage from OTHER; after rescue",
            "quota": "One optional offer PER POINT of actual damage, not once per damage event, no turn quota",
            "cost": "None",
            "targets": "Owner and the other actual damage participant; any team; no distance condition",
            "effects": [
              "For each actual damage point, owner may cause owner and that OTHER participant each draw1. Choices are independent per point; a2 damage event permits0/1/2 activations.",
              "Source branch uses actual damage source and final receiver; incoming branch uses actual other source, never substitutes card user. Self damage and source-less damage do not qualify.",
              "Shared action order resolves recipients; no damage reduction, prevention, counter-damage or hand-size condition. Only resolved positive damage, not HP loss or prevented damage."
            ],
            "official_rule_text": "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-lidian",
              "bwiki-lidian",
              "bwiki-wangxi"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "policy_refs": [
              "P0",
              "P1",
              "P2",
              "P3",
              "P4",
              "P5"
            ]
          }
        ],
        "native_unknowns": []
      },
      "signature_sha256": "6929e03a33a5ad5169d42a68de3131a57f4f2e71164d74838717b419e93ffe1b",
      "decision": "retain_distinct_selected_complete_host_packet",
      "not_implemented_in_comparison_snapshot": true,
      "source_aliases": [],
      "distinct_from_existing_roster_count": 101,
      "source_alias_records_checked": 7,
      "comparison_basis": "ActualV29 frozen101 playable heroes and7 complete source aliases, source tree read-only"
    },
    "source_evidence_tiers": [
      {
        "id": "bwiki-lidian",
        "tier": "same_product_dated_community",
        "url": "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%85%B8",
        "raw_path": "evidence/bwiki-lidian.html",
        "evidence_path": null,
        "sha256": "8a853f04b64415e34ff5556f19ececa61c1afdad72b063913ef7e1c67869e6d4",
        "current_client_verified": false
      },
      {
        "id": "bwiki-wangxi",
        "tier": "same_product_dated_community",
        "url": "https://wiki.biligame.com/msgs/%E5%BF%98%E9%9A%99",
        "raw_path": "evidence/bwiki-wangxi.html",
        "evidence_path": null,
        "sha256": "f1318d388a5eda2b775cfe69b67c315241fc24662acee5b75accc76fc89da8df",
        "current_client_verified": false
      },
      {
        "id": "mobile-lidian",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-170.html",
        "raw_path": "evidence/mobile-lidian.html",
        "evidence_path": null,
        "sha256": "378bf147e520e2b74e570c7fa96321ae106c579fbf48be97ea6c723fb001c9e9",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "P0满体力开局为江湖初始化。P1–P13为明示宿主合同，包括真实事件回执、私有排序、逐点伤害机会、弃牌语义、支付后范围和真实虚拟酒。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "caozhi",
    "id": "sgs.adapted.base.hero.cao-zhi",
    "source_name": "曹植",
    "suggested_display_name": "曹植",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "魏",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host initialization",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-detailed-double-time-jiushi-2026-10-15",
    "official_page_id": 101,
    "source_refs": [
      "mobile-caozhi",
      "bwiki-caozhi"
    ],
    "intrinsic_skill_inventory": [
      "落英",
      "酒诗"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.luoying",
      "sgs.jiushi"
    ],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "complete_inventory_selected_variant_with_explicit_host_native_unknowns",
    "skills": [
      {
        "id": "sgs.luoying",
        "name": "落英",
        "type": "optional_global_other_club_discard_judgment_obtain",
        "timing": "After another actor club card enters discard from actual DISCARD or JUDGMENT",
        "quota": "No turn/game quota; per eligible card opportunity",
        "cost": "None",
        "targets": "Owner obtains exact eligible other actor physical cards still in discard",
        "effects": [
          "May obtain eligible CLUB physical card(s) into hand; not random draw. Source owner/judged actor must differ from holder.",
          "Not limited to discard phase or hand; actual discarded equipment and actual judgment cards included by appropriate semantic movement.",
          "Use/response cleanup, recast/Pindian leftovers, private pile cleanup and ordinary death cleanup do not qualify solely by discard destination.",
          "A card already obtained by Tiandu/Luoshen or moved by Zongxuan is no longer available; cannot take it from hand/deck."
        ],
        "official_rule_text": "当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caozhi",
          "bwiki-caozhi",
          "bwiki-luoying-caozhi-search"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P6",
          "P9",
          "P10",
          "P11"
        ]
      },
      {
        "id": "sgs.jiushi",
        "name": "酒诗",
        "type": "optional_flip_zero_material_wine_and_damage_snapshot_return",
        "timing": "Legal need-to-USE Wine while FACE_UP; separately after a damage event with receiver previously FACE_DOWN",
        "quota": "Wine obeys ordinary card quota/window; damage-return once/event not per-point; no inherent limited marker",
        "cost": "Wine branch toggles actual face-up to face-down; no physical card cost. Return branch free optional flip-up",
        "targets": "Only self for Wine/self-dying recovery and orientation",
        "effects": [
          "Legal Wine-use window: optionally flip face-up to face-down and actually use virtual Wine; ordinary play Wine grants next Slash bonus, self-dying Wine recovers1.",
          "Damage-return: selected detailed same-product rule requires face_down immediately before HP was deducted AND currently face_down after damage/rescue. May then flip face-up.",
          "If face-up when damage received and uses Jiushi while dying to become face-down, cannot then return from that same damage event. Nested damage has independent snapshots.",
          "HP loss/prevented0damage has no return opportunity. No gain of trick card, no Chengzhang awakening or any derived skill."
        ],
        "official_rule_text": "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-caozhi",
          "bwiki-caozhi",
          "bwiki-jiushi",
          "bwiki-jiushi-caozhi-readable"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P12",
          "P13"
        ],
        "selected_rule_basis": "Same-product detailed classic rules plus parent-confirmed P12; official shorthand retained for audit, not implemented literally."
      }
    ],
    "intrinsic_unresolved": [
      {
        "id": "U1",
        "field": "Native relationship between official shorthand and detailed Jiushi eligibility",
        "selected_host_resolution": "P12 double-time chosen; do not create current-state-only version",
        "native_verified": false
      },
      {
        "id": "U2",
        "field": "Native Mobile retrial-card attribution / competing Luoying recovery order",
        "selected_host_resolution": "P9-P11 explicit event attribution/action-order",
        "native_verified": false
      }
    ],
    "ui_requirements": [
      "Show actual face orientation; legal Wine control only face-up.",
      "Self-dying prompt must expose zero-material Wine, owned by dying actor, with flip cost.",
      "Luoying optional exact eligible public discard-card subset; cannot inspect original hidden hands.",
      "Show damage-return optional prompt only when event snapshot and current state both face-down; no per-point repetition."
    ],
    "ai_policy": [
      "Luoying may value visible clubs; never inspect unseen card faces or deck.",
      "Wine decision considers own Slash/rescue need and cost of losing next turn; retain optionality.",
      "Return flip normally beneficial; no hidden information needed."
    ],
    "excluded_variants": [
      "Official shorthand current-state-only interpretation excluded by selected P12.",
      "No界曹植翻面后取锦囊; no成章; no国战 blending."
    ],
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "P0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "id": "U1",
        "field": "Native relationship between official shorthand and detailed Jiushi eligibility",
        "selected_host_resolution": "P12 double-time chosen; do not create current-state-only version",
        "native_verified": false
      },
      {
        "id": "U2",
        "field": "Native Mobile retrial-card attribution / competing Luoying recovery order",
        "selected_host_resolution": "P9-P11 explicit event attribution/action-order",
        "native_verified": false
      }
    ],
    "name": "曹植",
    "display_name": "曹植",
    "skill_name": "落英/酒诗",
    "skill_desc": "落英：当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。 酒诗：当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。",
    "source_character_name": "曹植",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-detailed-double-time-jiushi-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀曹植",
      "cao-zhi"
    ],
    "source_urls": [
      "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%A4%8D",
      "https://wiki.biligame.com/msgs/%E9%85%92%E8%AF%97",
      "https://www.sanguosha.cn/pc/hero-detail-101.html",
      "https://wiki.biligame.com/msgs/酒诗/曹植",
      "https://wiki.biligame.com/msgs/落英/曹植"
    ],
    "source_records": [
      {
        "id": "bwiki-caozhi",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%A4%8D",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%A4%8D",
        "status": 200,
        "bytes": 84150,
        "sha256": "307b0f9d0e9450ddbeca703968140253728b8e3ae590ad74f2bc01ad0be1a859",
        "accessed_at": "2026-10-15T23:50:41.318842+00:00",
        "raw_path": "evidence/bwiki-caozhi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community",
        "product": "三国杀移动版",
        "revision_id": 25828,
        "modified_at": "2024-01-14T15:44:34Z",
        "limitations": [
          "Community source; not official or current-client certification.",
          "Article date does not independently date all transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "魏",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 637,
          "gender_html_line": 628,
          "faction_html_line": 629,
          "gender_excerpt": ">性别男 势力魏 <p class=",
          "faction_excerpt": ">势力魏 别称子建 <div class=\"锚点\" style=\"position:rel"
        }
      },
      {
        "id": "bwiki-jiushi",
        "url": "https://wiki.biligame.com/msgs/%E9%85%92%E8%AF%97",
        "final_url": "https://wiki.biligame.com/msgs/%E9%85%92%E8%AF%97",
        "status": 200,
        "bytes": 69435,
        "sha256": "660e2cc938b72989399c31e67ef184c0f62eb25e71b667356b174ac08a07e5fe",
        "accessed_at": "2026-10-15T23:50:45.116258+00:00",
        "raw_path": "evidence/bwiki-jiushi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community",
        "product": "三国杀移动版",
        "revision_id": 10511,
        "modified_at": "2022-09-15T15:02:40Z",
        "limitations": [
          "Community source; not official or current-client certification.",
          "Article date does not independently date all transcluded skill templates."
        ]
      },
      {
        "id": "mobile-caozhi",
        "url": "https://www.sanguosha.cn/pc/hero-detail-101.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-101.html",
        "status": 200,
        "bytes": 22076,
        "sha256": "851c06975efa7b0904ce59622fbfc3b99afb5b15a1427e15cbdb168d5760f116",
        "accessed_at": "2026-10-15T23:52:04.433986+00:00",
        "raw_path": "evidence/mobile-caozhi.html",
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
                  "name": "落英",
                  "hidden": false,
                  "rule_text": "当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。",
                  "html_line": 187,
                  "rule_sha256": "a706e59e8a6290f3c0af95e7f8af200cc13ede2294a7cc89dfcedf78e8f193aa"
                },
                {
                  "name": "酒诗",
                  "hidden": true,
                  "rule_text": "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。",
                  "html_line": 188,
                  "rule_sha256": "af517ae2b37597f7c4f2bb66109f6f66d548acdcf15f474ecf64615ff05e9409"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "excluded_groups": [],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "魏"
        },
        "limitations": [
          "Undated public catalog; not a current logged-in Mobile client audit.",
          "No direct numeric maxHP or gameplay gender field in official HTML; no art downloaded."
        ]
      },
      {
        "id": "bwiki-jiushi-caozhi-readable",
        "url": "https://wiki.biligame.com/msgs/酒诗/曹植",
        "evidence_format": "web_readable",
        "evidence_path": "evidence/web-readable-evidence.json",
        "bytes": 24202,
        "sha256": "d23432ca13d48297068d3b9d9e88888a89961a874c2f567090c88e548673dbcc",
        "raw_html_available": false,
        "metadata": {
          "revision_id": 27556,
          "visible_page_update": "2024-07-07"
        },
        "product": "三国杀移动版",
        "tier": "same_product_community_readable_or_search_evidence",
        "current_client_verified": false,
        "limitations": [
          "Capture contains multiple tool results; only this exact URL section adopted.",
          "Not raw HTML. Page edit dates are not patch effective dates.",
          "Skill-template date may differ enclosing hero-page date."
        ]
      },
      {
        "id": "bwiki-luoying-caozhi-search",
        "url": "https://wiki.biligame.com/msgs/落英/曹植",
        "evidence_format": "search_index",
        "evidence_path": "evidence/bifa-luoying-search-evidence.json",
        "bytes": 25670,
        "sha256": "a9c1e82b1af67142e62ca456021ad2ebd4d9aebc608c60c6104f97fdb29009ea",
        "raw_html_available": false,
        "metadata": {
          "revision_id": 21008,
          "visible_page_update": "2023-01-17"
        },
        "product": "三国杀移动版",
        "tier": "same_product_community_readable_or_search_evidence",
        "current_client_verified": false,
        "limitations": [
          "Capture contains multiple tool results; only this exact URL section adopted.",
          "Not raw HTML. Page edit dates are not patch effective dates.",
          "Skill-template date may differ enclosing hero-page date."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.luoying",
        "name": "落英",
        "type": "optional_global_other_club_discard_judgment_obtain",
        "timing": "After another actor club card enters discard from actual DISCARD or JUDGMENT",
        "quota": "No turn/game quota; per eligible card opportunity",
        "cost": "None",
        "targets": "Owner obtains exact eligible other actor physical cards still in discard",
        "effects": [
          "May obtain eligible CLUB physical card(s) into hand; not random draw. Source owner/judged actor must differ from holder.",
          "Not limited to discard phase or hand; actual discarded equipment and actual judgment cards included by appropriate semantic movement.",
          "Use/response cleanup, recast/Pindian leftovers, private pile cleanup and ordinary death cleanup do not qualify solely by discard destination.",
          "A card already obtained by Tiandu/Luoshen or moved by Zongxuan is no longer available; cannot take it from hand/deck."
        ],
        "official_rule_text": "当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-caozhi",
          "bwiki-caozhi",
          "bwiki-luoying-caozhi-search"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P6",
          "P9",
          "P10",
          "P11"
        ]
      },
      {
        "id": "sgs.jiushi",
        "name": "酒诗",
        "type": "optional_flip_zero_material_wine_and_damage_snapshot_return",
        "timing": "Legal need-to-USE Wine while FACE_UP; separately after a damage event with receiver previously FACE_DOWN",
        "quota": "Wine obeys ordinary card quota/window; damage-return once/event not per-point; no inherent limited marker",
        "cost": "Wine branch toggles actual face-up to face-down; no physical card cost. Return branch free optional flip-up",
        "targets": "Only self for Wine/self-dying recovery and orientation",
        "effects": [
          "Legal Wine-use window: optionally flip face-up to face-down and actually use virtual Wine; ordinary play Wine grants next Slash bonus, self-dying Wine recovers1.",
          "Damage-return: selected detailed same-product rule requires face_down immediately before HP was deducted AND currently face_down after damage/rescue. May then flip face-up.",
          "If face-up when damage received and uses Jiushi while dying to become face-down, cannot then return from that same damage event. Nested damage has independent snapshots.",
          "HP loss/prevented0damage has no return opportunity. No gain of trick card, no Chengzhang awakening or any derived skill."
        ],
        "official_rule_text": "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-caozhi",
          "bwiki-caozhi",
          "bwiki-jiushi",
          "bwiki-jiushi-caozhi-readable"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P12",
          "P13"
        ],
        "selected_rule_basis": "Same-product detailed classic rules plus parent-confirmed P12; official shorthand retained for audit, not implemented literally."
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.luoying",
      "sgs.jiushi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.luoying",
      "sgs.jiushi"
    ],
    "complete_skill_names": [
      "落英",
      "酒诗"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "scope": "shared_host",
        "contract": "Initialize starting HP to maxHP. Direct independent initialHP field remains null; team identity/reward/victory adaptations are not native-client certification."
      },
      {
        "id": "P1",
        "scope": "shared_host",
        "contract": "Use actor-scoped live effective skill ownership, actual phase IDs and damage IDs. Persist committed receipts; never duplicate cost/draw/order on stale prompt or replay. Do not mutate immutable templates when copied or removed."
      },
      {
        "id": "P2",
        "scope": "shared_host",
        "contract": "Only a live effective owner and live other damage participant may start Wangxi. Source-less and self-inflicted damage fail its OTHER-role clause. If either dies between per-point opportunities, stop later opportunities. Shared native death timing is not independently certified by these sources."
      },
      {
        "id": "P3",
        "scope": "shared_host",
        "contract": "Two draw recipients resolve one at a time in current action order, preserving poison/other draw interception and any already committed draw. AI cannot see opponents hands or unviewed deck."
      },
      {
        "id": "P4",
        "scope": "shared_host",
        "contract": "Deck top is array end in this engine. Privately stage actual top cards with physical identity; atomic ordered top/bottom return has no gain/discard/use events. If fewer than4 exist after normal refill, use available count, top min(2,n), others bottom. This finite-deck fallback is host policy."
      },
      {
        "id": "P5",
        "scope": "shared_host",
        "contract": "Xunxun is draw-phase START ordering, not replacement of normal drawing and not before a skip decision. If phase is skipped/blocked entirely no opportunity. If only ordinary drawing later replaced, ordering has still happened."
      },
      {
        "id": "P6",
        "scope": "shared_host",
        "contract": "Unqualified own discard/give uses hand or equipment, not judgment/skill piles. Discard another role one card uses H/E/J with blind hand choice. Category projection is basic/trick/equipment; imported card categories explicitly mapped."
      },
      {
        "id": "P7",
        "scope": "shared_host",
        "contract": "For a range-gated skill paid by equipment, legal target must remain in actual attack range after selected equipment is removed, including weapon and offensive horse. Other physical modifiers remain. Do not substitute Slash-only unlimited distance for attack range."
      },
      {
        "id": "P8",
        "scope": "shared_host",
        "contract": "Commit exact N-card cost atomically, freeze next activation ordinal and consume phase count at successful payment. Invalid/cancelled precommit does not increment. Resolved cost triggers still run even if effect later impossible; no refund or forced alternate target."
      },
      {
        "id": "P9",
        "scope": "shared_host",
        "contract": "Luoying requires semantic DISCARD or JUDGMENT movement into discard, not destination alone. Use effective club suit captured for the original loss/judgment context, other former/judged actor, current discard physical location+epoch. Exclude use/response/recast/Pindian and ordinary death/pile cleanup, and equipment replacement lacking actual discard reason. No re-taking a card already gained/moved by another skill."
      },
      {
        "id": "P10",
        "scope": "shared_host_native_edge_unverified",
        "contract": "Judgment-origin Luoying attribution: both replaced judgment cards and final judgment cards discarded from another actor judgment may qualify; record judged actor and judgment ID when physical card enters judgment processing. Retrial material becomes a judgment card, not an ordinary response loss. Merely resolving/discarding the delayed-trick card does not qualify by judgment cause. This is explicit host interpretation, not directly certified Mobile FAQ."
      },
      {
        "id": "P11",
        "scope": "shared_host",
        "contract": "Global Luoying opportunities follow owner loss/judgment movement receipt and current action order. Each owner may independently choose eligible exact cards still in discard. Batch may offer subset via independent per-card decisions; no card cloned and no original equipment/poison callback undone."
      },
      {
        "id": "P12",
        "scope": "selected_rule_interpretation_parent_confirmed",
        "contract": "Jiushi recovery selected from same-product detailed base skill: snapshot face_down immediately before actual HP deduction of this damage event; after damage/rescue require still face_down to offer one optional flip. Face-up damage then dying-Jiushi flip-down does not qualify. Official catalog shorthand only checks after-damage current face; discrepancy retained, not described as official client certification."
      },
      {
        "id": "P13",
        "scope": "shared_host",
        "contract": "Jiushi flip-to-wine is a real zero-material virtual Wine use. Validate ordinary Wine window/prohibition; offense shares existing once/actual-turn Wine quota, self-dying Wine does not consume offensive quota and recovers1. Commit flip and use atomically; record exactly1 real card use, not physical draw/discard. No free flip when Wine cannot be legally committed."
      },
      {
        "id": "P14",
        "scope": "selected_historical_rule_parent_confirmed",
        "contract": "Bifa uses saved official historical TRUE TURN START timing, not current wiki preparation text. In this host scheduled face-down whole-turn skip is processed BEFORE true on_turn_begin, so skipped scheduled turns do not settle Bifa. Native historical face-down interaction was not independently sourced; do not claim the timing words alone prove otherwise.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P15",
        "scope": "host_policy_pending_parent_decision",
        "contract": "Bifa pending cards are physical delayed obligations attributed to source and target. Native source death and source skill-loss behavior is unresolved. Do NOT decide that source skill loss cancels placed effects; do NOT decide source death forces later HP loss. Parent will choose unified lifecycle behavior after same-product research. Target-death cleanup must conserve exact physical card. No dependent implementation/expected result may be certified yet."
      },
      {
        "id": "P16",
        "scope": "shared_host",
        "contract": "Bifa placement is private hand-to-pile movement; private source loss does not public-reveal poison. At settlement only target gains viewing permission. Successful same-category target-hand give commits before target obtains pile card; refusal removes pile card to discard then target loses1HP (not damage). If nested death/cleanup makes the pile disappear, never duplicate it or manufacture unpaid gain."
      },
      {
        "id": "P17",
        "scope": "shared_host_native_lifecycle_unverified",
        "contract": "Songci one-time target usage persists by stable source actor and target ID for whole game, including later turns, phase changes and remove/reacquire of that actor skill. Copies on a different actor have their own ledger. Death/revival never refreshes old actor ledger. Commit mark at legal activation before effect; frozen less/greater branch based on current H versus HP. Losing/reacquiring resets no spent marks.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P18",
        "scope": "shared_host",
        "contract": "Songci discard2 permits target H/E only and target chooses its own cards; if fewer than2 legal cards remain due to intervening events, discard all available. Equality initially is ineligible. Bifa exact payment remains HAND only. Foreign categories use explicit basic/trick/equipment projection and never silently assign unknown category."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-more/cao-zhi.svg",
    "gender_provenance": {
      "source": "bwiki-caozhi",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-caozhi",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "魏",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 637,
        "gender_html_line": 628,
        "faction_html_line": 629,
        "gender_excerpt": ">性别男 势力魏 <p class=",
        "faction_excerpt": ">势力魏 别称子建 <div class=\"锚点\" style=\"position:rel"
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "魏",
      "initial_hp_host_policy": "P0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "candidate_id": "sgs.adapted.base.hero.cao-zhi",
      "source_name": "曹植",
      "complete_intrinsic_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "落英",
          "酒诗"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.luoying",
            "name": "落英",
            "type": "optional_global_other_club_discard_judgment_obtain",
            "timing": "After another actor club card enters discard from actual DISCARD or JUDGMENT",
            "quota": "No turn/game quota; per eligible card opportunity",
            "cost": "None",
            "targets": "Owner obtains exact eligible other actor physical cards still in discard",
            "effects": [
              "May obtain eligible CLUB physical card(s) into hand; not random draw. Source owner/judged actor must differ from holder.",
              "Not limited to discard phase or hand; actual discarded equipment and actual judgment cards included by appropriate semantic movement.",
              "Use/response cleanup, recast/Pindian leftovers, private pile cleanup and ordinary death cleanup do not qualify solely by discard destination.",
              "A card already obtained by Tiandu/Luoshen or moved by Zongxuan is no longer available; cannot take it from hand/deck."
            ],
            "official_rule_text": "当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-caozhi",
              "bwiki-caozhi",
              "bwiki-luoying-caozhi-search"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "policy_refs": [
              "P0",
              "P1",
              "P6",
              "P9",
              "P10",
              "P11"
            ]
          },
          {
            "id": "sgs.jiushi",
            "name": "酒诗",
            "type": "optional_flip_zero_material_wine_and_damage_snapshot_return",
            "timing": "Legal need-to-USE Wine while FACE_UP; separately after a damage event with receiver previously FACE_DOWN",
            "quota": "Wine obeys ordinary card quota/window; damage-return once/event not per-point; no inherent limited marker",
            "cost": "Wine branch toggles actual face-up to face-down; no physical card cost. Return branch free optional flip-up",
            "targets": "Only self for Wine/self-dying recovery and orientation",
            "effects": [
              "Legal Wine-use window: optionally flip face-up to face-down and actually use virtual Wine; ordinary play Wine grants next Slash bonus, self-dying Wine recovers1.",
              "Damage-return: selected detailed same-product rule requires face_down immediately before HP was deducted AND currently face_down after damage/rescue. May then flip face-up.",
              "If face-up when damage received and uses Jiushi while dying to become face-down, cannot then return from that same damage event. Nested damage has independent snapshots.",
              "HP loss/prevented0damage has no return opportunity. No gain of trick card, no Chengzhang awakening or any derived skill."
            ],
            "official_rule_text": "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-caozhi",
              "bwiki-caozhi",
              "bwiki-jiushi",
              "bwiki-jiushi-caozhi-readable"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "policy_refs": [
              "P0",
              "P1",
              "P12",
              "P13"
            ],
            "selected_rule_basis": "Same-product detailed classic rules plus parent-confirmed P12; official shorthand retained for audit, not implemented literally."
          }
        ],
        "native_unknowns": [
          {
            "id": "U1",
            "field": "Native relationship between official shorthand and detailed Jiushi eligibility",
            "selected_host_resolution": "P12 double-time chosen; do not create current-state-only version",
            "native_verified": false
          },
          {
            "id": "U2",
            "field": "Native Mobile retrial-card attribution / competing Luoying recovery order",
            "selected_host_resolution": "P9-P11 explicit event attribution/action-order",
            "native_verified": false
          }
        ]
      },
      "signature_sha256": "4ed74222876d61bcb00fbd586d0857ea46bc30c3436d89652af93d9803038165",
      "decision": "retain_distinct_selected_complete_host_packet",
      "not_implemented_in_comparison_snapshot": true,
      "source_aliases": [],
      "distinct_from_existing_roster_count": 101,
      "source_alias_records_checked": 7,
      "comparison_basis": "ActualV29 frozen101 playable heroes and7 complete source aliases, source tree read-only"
    },
    "source_evidence_tiers": [
      {
        "id": "bwiki-caozhi",
        "tier": "same_product_dated_community",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%A4%8D",
        "raw_path": "evidence/bwiki-caozhi.html",
        "evidence_path": null,
        "sha256": "307b0f9d0e9450ddbeca703968140253728b8e3ae590ad74f2bc01ad0be1a859",
        "current_client_verified": false
      },
      {
        "id": "bwiki-jiushi",
        "tier": "same_product_dated_community",
        "url": "https://wiki.biligame.com/msgs/%E9%85%92%E8%AF%97",
        "raw_path": "evidence/bwiki-jiushi.html",
        "evidence_path": null,
        "sha256": "660e2cc938b72989399c31e67ef184c0f62eb25e71b667356b174ac08a07e5fe",
        "current_client_verified": false
      },
      {
        "id": "mobile-caozhi",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-101.html",
        "raw_path": "evidence/mobile-caozhi.html",
        "evidence_path": null,
        "sha256": "851c06975efa7b0904ce59622fbfc3b99afb5b15a1427e15cbdb168d5760f116",
        "current_client_verified": false
      },
      {
        "id": "bwiki-jiushi-caozhi-readable",
        "tier": "same_product_community_readable_or_search_evidence",
        "url": "https://wiki.biligame.com/msgs/酒诗/曹植",
        "raw_path": null,
        "evidence_path": "evidence/web-readable-evidence.json",
        "sha256": "d23432ca13d48297068d3b9d9e88888a89961a874c2f567090c88e548673dbcc",
        "current_client_verified": false
      },
      {
        "id": "bwiki-luoying-caozhi-search",
        "tier": "same_product_community_readable_or_search_evidence",
        "url": "https://wiki.biligame.com/msgs/落英/曹植",
        "raw_path": null,
        "evidence_path": "evidence/bifa-luoying-search-evidence.json",
        "sha256": "a9c1e82b1af67142e62ca456021ad2ebd4d9aebc608c60c6104f97fdb29009ea",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "P0满体力开局为江湖初始化。P1–P13为明示宿主合同，包括真实事件回执、私有排序、逐点伤害机会、弃牌语义、支付后范围和真实虚拟酒。当前客户端与完整身份模式未核验。 酒诗明确选择P12受伤前及伤害后均背面的双时点版本；官网简文差异和落英改判归属／竞争顺序U1/U2原生未决保留。"
  },
  {
    "key": "zhuran",
    "id": "sgs.adapted.base.hero.zhu-ran",
    "source_name": "朱然",
    "suggested_display_name": "朱然",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "吴",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 host initialization",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-sequential-danshou-2026-10-15",
    "official_page_id": 131,
    "source_refs": [
      "mobile-zhuran",
      "bwiki-zhuran"
    ],
    "intrinsic_skill_inventory": [
      "胆守"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.danshou"
    ],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.danshou",
        "name": "胆守",
        "type": "repeatable_play_phase_escalating_exact_cost_four_branch",
        "timing": "Owner own actual PLAY phase",
        "quota": "No fixed once/phase cap. X=current committed activation ordinal in this actual PLAY; first1 then2 then3 then4 then5 etc. Reset on new real PLAY, not merely turn.",
        "cost": "Exactly X own hand/equipment cards discarded together; no HP alternative",
        "targets": "Exactly1 OTHER live character in owner actual attack range after payment, regardless team. Branch1 needs discardable H/E/J; branch2 needs giveable H/E.",
        "effects": [
          "X=1: owner discards1 card of chosen target. Owner chooses card/zone, hidden hand blind.",
          "X=2: target chooses1 own card and gives it to owner. Target-owned prompt, not owner steal choice.",
          "X=3: owner deals exactly1 normal skill damage to target; no actual card use or Slash quota.",
          "X>=4: owner and target each draw2 in action order; fifth cost5 still gives each2, not eachX.",
          "Exactly one matching branch per activation. Cannot start at3 by discarding3 or resolve first3 branches together; different activations may choose different targets."
        ],
        "official_rule_text": "出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动\"胆守\"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-zhuran",
          "bwiki-zhuran"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P3",
          "P6",
          "P7",
          "P8"
        ]
      }
    ],
    "ui_requirements": [
      "Show next ordinal X and exact cost count before choosing materials/target.",
      "Show four different branch descriptions; disable unaffordable next branch rather than allow selecting arbitrary X.",
      "Branch1 owner blind target hand choices plus public E/J; branch2 target privately chooses own H/E; branch4 draw2 both.",
      "Range preview reflects proposed equipment cost. Human may target allies."
    ],
    "ai_policy": [
      "Score owned payment cards and public target zones/HP/counts; no hidden enemy hand or future deck access.",
      "Can stop at any stage. Consider hostile removal/give/damage vs allied fourth-stage draw; never auto-spend into unaffordable escalation."
    ],
    "excluded_variants": [
      "Old after-damage draw1 and terminate current turn/settlements excluded.",
      "界/OL/谋 reactive target-count or end-phase damage clauses excluded.",
      "Do not implement old self-target version: selected Mobile explicitly OTHER."
    ],
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "P0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "foreign equipment, cost survival, pile zones",
        "status": "shared_host",
        "host_policy": "P6-P8"
      }
    ],
    "name": "朱然",
    "display_name": "朱然",
    "skill_name": "胆守",
    "skill_desc": "胆守：出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动\"胆守\"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。",
    "source_character_name": "朱然",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-sequential-danshou-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀朱然",
      "zhu-ran"
    ],
    "source_urls": [
      "https://wiki.biligame.com/msgs/%E6%9C%B1%E7%84%B6",
      "https://www.sanguosha.cn/pc/hero-detail-131.html"
    ],
    "source_records": [
      {
        "id": "bwiki-zhuran",
        "url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E7%84%B6",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E7%84%B6",
        "status": 200,
        "bytes": 84548,
        "sha256": "709879d71924f7897800c17d849eacbcd630d9c87e5acd7152128f3a2ad560a5",
        "accessed_at": "2026-10-15T23:50:45.081740+00:00",
        "raw_path": "evidence/bwiki-zhuran.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_dated_community",
        "product": "三国杀移动版",
        "revision_id": 35781,
        "modified_at": "2026-01-10T07:04:41Z",
        "limitations": [
          "Community source; not official or current-client certification.",
          "Article date does not independently date all transcluded skill templates."
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "吴",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 635,
          "gender_html_line": 626,
          "faction_html_line": 627,
          "gender_excerpt": ">性别男 势力吴 <p class=",
          "faction_excerpt": ">势力吴 别称助燃 <div class=\"锚点\" style=\"position:rel"
        }
      },
      {
        "id": "mobile-zhuran",
        "url": "https://www.sanguosha.cn/pc/hero-detail-131.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-131.html",
        "status": 200,
        "bytes": 21741,
        "sha256": "de767894f121d56eef1975805536f83d30bd4114e2af3d04532eccfcf9baf02c",
        "accessed_at": "2026-10-15T23:52:05.658458+00:00",
        "raw_path": "evidence/mobile-zhuran.html",
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
                  "name": "胆守",
                  "hidden": false,
                  "rule_text": "出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动\"胆守\"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。",
                  "html_line": 186,
                  "rule_sha256": "b39e28ff2f8df0c2c54281afa9fffb3389f44c4aeb6518c15c5fd946f4915f2c"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "excluded_groups": [],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "吴"
        },
        "limitations": [
          "Undated public catalog; not a current logged-in Mobile client audit.",
          "No direct numeric maxHP or gameplay gender field in official HTML; no art downloaded."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.danshou",
        "name": "胆守",
        "type": "repeatable_play_phase_escalating_exact_cost_four_branch",
        "timing": "Owner own actual PLAY phase",
        "quota": "No fixed once/phase cap. X=current committed activation ordinal in this actual PLAY; first1 then2 then3 then4 then5 etc. Reset on new real PLAY, not merely turn.",
        "cost": "Exactly X own hand/equipment cards discarded together; no HP alternative",
        "targets": "Exactly1 OTHER live character in owner actual attack range after payment, regardless team. Branch1 needs discardable H/E/J; branch2 needs giveable H/E.",
        "effects": [
          "X=1: owner discards1 card of chosen target. Owner chooses card/zone, hidden hand blind.",
          "X=2: target chooses1 own card and gives it to owner. Target-owned prompt, not owner steal choice.",
          "X=3: owner deals exactly1 normal skill damage to target; no actual card use or Slash quota.",
          "X>=4: owner and target each draw2 in action order; fifth cost5 still gives each2, not eachX.",
          "Exactly one matching branch per activation. Cannot start at3 by discarding3 or resolve first3 branches together; different activations may choose different targets."
        ],
        "official_rule_text": "出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动\"胆守\"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-zhuran",
          "bwiki-zhuran"
        ],
        "limited_marker": null,
        "awakening_marker": null,
        "policy_refs": [
          "P0",
          "P1",
          "P3",
          "P6",
          "P7",
          "P8"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.danshou"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.danshou"
    ],
    "complete_skill_names": [
      "胆守"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "P0",
        "scope": "shared_host",
        "contract": "Initialize starting HP to maxHP. Direct independent initialHP field remains null; team identity/reward/victory adaptations are not native-client certification."
      },
      {
        "id": "P1",
        "scope": "shared_host",
        "contract": "Use actor-scoped live effective skill ownership, actual phase IDs and damage IDs. Persist committed receipts; never duplicate cost/draw/order on stale prompt or replay. Do not mutate immutable templates when copied or removed."
      },
      {
        "id": "P2",
        "scope": "shared_host",
        "contract": "Only a live effective owner and live other damage participant may start Wangxi. Source-less and self-inflicted damage fail its OTHER-role clause. If either dies between per-point opportunities, stop later opportunities. Shared native death timing is not independently certified by these sources."
      },
      {
        "id": "P3",
        "scope": "shared_host",
        "contract": "Two draw recipients resolve one at a time in current action order, preserving poison/other draw interception and any already committed draw. AI cannot see opponents hands or unviewed deck."
      },
      {
        "id": "P4",
        "scope": "shared_host",
        "contract": "Deck top is array end in this engine. Privately stage actual top cards with physical identity; atomic ordered top/bottom return has no gain/discard/use events. If fewer than4 exist after normal refill, use available count, top min(2,n), others bottom. This finite-deck fallback is host policy."
      },
      {
        "id": "P5",
        "scope": "shared_host",
        "contract": "Xunxun is draw-phase START ordering, not replacement of normal drawing and not before a skip decision. If phase is skipped/blocked entirely no opportunity. If only ordinary drawing later replaced, ordering has still happened."
      },
      {
        "id": "P6",
        "scope": "shared_host",
        "contract": "Unqualified own discard/give uses hand or equipment, not judgment/skill piles. Discard another role one card uses H/E/J with blind hand choice. Category projection is basic/trick/equipment; imported card categories explicitly mapped."
      },
      {
        "id": "P7",
        "scope": "shared_host",
        "contract": "For a range-gated skill paid by equipment, legal target must remain in actual attack range after selected equipment is removed, including weapon and offensive horse. Other physical modifiers remain. Do not substitute Slash-only unlimited distance for attack range."
      },
      {
        "id": "P8",
        "scope": "shared_host",
        "contract": "Commit exact N-card cost atomically, freeze next activation ordinal and consume phase count at successful payment. Invalid/cancelled precommit does not increment. Resolved cost triggers still run even if effect later impossible; no refund or forced alternate target."
      },
      {
        "id": "P9",
        "scope": "shared_host",
        "contract": "Luoying requires semantic DISCARD or JUDGMENT movement into discard, not destination alone. Use effective club suit captured for the original loss/judgment context, other former/judged actor, current discard physical location+epoch. Exclude use/response/recast/Pindian and ordinary death/pile cleanup, and equipment replacement lacking actual discard reason. No re-taking a card already gained/moved by another skill."
      },
      {
        "id": "P10",
        "scope": "shared_host_native_edge_unverified",
        "contract": "Judgment-origin Luoying attribution: both replaced judgment cards and final judgment cards discarded from another actor judgment may qualify; record judged actor and judgment ID when physical card enters judgment processing. Retrial material becomes a judgment card, not an ordinary response loss. Merely resolving/discarding the delayed-trick card does not qualify by judgment cause. This is explicit host interpretation, not directly certified Mobile FAQ."
      },
      {
        "id": "P11",
        "scope": "shared_host",
        "contract": "Global Luoying opportunities follow owner loss/judgment movement receipt and current action order. Each owner may independently choose eligible exact cards still in discard. Batch may offer subset via independent per-card decisions; no card cloned and no original equipment/poison callback undone."
      },
      {
        "id": "P12",
        "scope": "selected_rule_interpretation_parent_confirmed",
        "contract": "Jiushi recovery selected from same-product detailed base skill: snapshot face_down immediately before actual HP deduction of this damage event; after damage/rescue require still face_down to offer one optional flip. Face-up damage then dying-Jiushi flip-down does not qualify. Official catalog shorthand only checks after-damage current face; discrepancy retained, not described as official client certification."
      },
      {
        "id": "P13",
        "scope": "shared_host",
        "contract": "Jiushi flip-to-wine is a real zero-material virtual Wine use. Validate ordinary Wine window/prohibition; offense shares existing once/actual-turn Wine quota, self-dying Wine does not consume offensive quota and recovers1. Commit flip and use atomically; record exactly1 real card use, not physical draw/discard. No free flip when Wine cannot be legally committed."
      },
      {
        "id": "P14",
        "scope": "selected_historical_rule_parent_confirmed",
        "contract": "Bifa uses saved official historical TRUE TURN START timing, not current wiki preparation text. In this host scheduled face-down whole-turn skip is processed BEFORE true on_turn_begin, so skipped scheduled turns do not settle Bifa. Native historical face-down interaction was not independently sourced; do not claim the timing words alone prove otherwise.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P15",
        "scope": "host_policy_pending_parent_decision",
        "contract": "Bifa pending cards are physical delayed obligations attributed to source and target. Native source death and source skill-loss behavior is unresolved. Do NOT decide that source skill loss cancels placed effects; do NOT decide source death forces later HP loss. Parent will choose unified lifecycle behavior after same-product research. Target-death cleanup must conserve exact physical card. No dependent implementation/expected result may be certified yet."
      },
      {
        "id": "P16",
        "scope": "shared_host",
        "contract": "Bifa placement is private hand-to-pile movement; private source loss does not public-reveal poison. At settlement only target gains viewing permission. Successful same-category target-hand give commits before target obtains pile card; refusal removes pile card to discard then target loses1HP (not damage). If nested death/cleanup makes the pile disappear, never duplicate it or manufacture unpaid gain."
      },
      {
        "id": "P17",
        "scope": "shared_host_native_lifecycle_unverified",
        "contract": "Songci one-time target usage persists by stable source actor and target ID for whole game, including later turns, phase changes and remove/reacquire of that actor skill. Copies on a different actor have their own ledger. Death/revival never refreshes old actor ledger. Commit mark at legal activation before effect; frozen less/greater branch based on current H versus HP. Losing/reacquiring resets no spent marks.",
        "approval_status": "parent_confirmed_2026-10-16T00:03Z"
      },
      {
        "id": "P18",
        "scope": "shared_host",
        "contract": "Songci discard2 permits target H/E only and target chooses its own cards; if fewer than2 legal cards remain due to intervening events, discard all available. Equality initially is ineligible. Bifa exact payment remains HAND only. Foreign categories use explicit basic/trick/equipment projection and never silently assign unknown category."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-more/zhu-ran.svg",
    "gender_provenance": {
      "source": "bwiki-zhuran",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "source": "bwiki-zhuran",
      "metadata": {
        "max_hp": 4,
        "hp_icon_count": 4,
        "hp_numeric": 4,
        "gender": "male",
        "faction": "吴",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 635,
        "gender_html_line": 626,
        "faction_html_line": 627,
        "gender_excerpt": ">性别男 势力吴 <p class=",
        "faction_excerpt": ">势力吴 别称助燃 <div class=\"锚点\" style=\"position:rel"
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "吴",
      "initial_hp_host_policy": "P0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "candidate_id": "sgs.adapted.base.hero.zhu-ran",
      "source_name": "朱然",
      "complete_intrinsic_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "胆守"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.danshou",
            "name": "胆守",
            "type": "repeatable_play_phase_escalating_exact_cost_four_branch",
            "timing": "Owner own actual PLAY phase",
            "quota": "No fixed once/phase cap. X=current committed activation ordinal in this actual PLAY; first1 then2 then3 then4 then5 etc. Reset on new real PLAY, not merely turn.",
            "cost": "Exactly X own hand/equipment cards discarded together; no HP alternative",
            "targets": "Exactly1 OTHER live character in owner actual attack range after payment, regardless team. Branch1 needs discardable H/E/J; branch2 needs giveable H/E.",
            "effects": [
              "X=1: owner discards1 card of chosen target. Owner chooses card/zone, hidden hand blind.",
              "X=2: target chooses1 own card and gives it to owner. Target-owned prompt, not owner steal choice.",
              "X=3: owner deals exactly1 normal skill damage to target; no actual card use or Slash quota.",
              "X>=4: owner and target each draw2 in action order; fifth cost5 still gives each2, not eachX.",
              "Exactly one matching branch per activation. Cannot start at3 by discarding3 or resolve first3 branches together; different activations may choose different targets."
            ],
            "official_rule_text": "出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动\"胆守\"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-zhuran",
              "bwiki-zhuran"
            ],
            "limited_marker": null,
            "awakening_marker": null,
            "policy_refs": [
              "P0",
              "P1",
              "P3",
              "P6",
              "P7",
              "P8"
            ]
          }
        ],
        "native_unknowns": []
      },
      "signature_sha256": "c6a485d042a601aa1d449a10a651bf5922ff2d6a3b7a934e5bf2e4cf0fdd5f7e",
      "decision": "retain_distinct_selected_complete_host_packet",
      "not_implemented_in_comparison_snapshot": true,
      "source_aliases": [],
      "distinct_from_existing_roster_count": 101,
      "source_alias_records_checked": 7,
      "comparison_basis": "ActualV29 frozen101 playable heroes and7 complete source aliases, source tree read-only"
    },
    "source_evidence_tiers": [
      {
        "id": "bwiki-zhuran",
        "tier": "same_product_dated_community",
        "url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E7%84%B6",
        "raw_path": "evidence/bwiki-zhuran.html",
        "evidence_path": null,
        "sha256": "709879d71924f7897800c17d849eacbcd630d9c87e5acd7152128f3a2ad560a5",
        "current_client_verified": false
      },
      {
        "id": "mobile-zhuran",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-131.html",
        "raw_path": "evidence/mobile-zhuran.html",
        "evidence_path": null,
        "sha256": "de767894f121d56eef1975805536f83d30bd4114e2af3d04532eccfcf9baf02c",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "P0满体力开局为江湖初始化。P1–P13为明示宿主合同，包括真实事件回执、私有排序、逐点伤害机会、弃牌语义、支付后范围和真实虚拟酒。当前客户端与完整身份模式未核验。"
  }
];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_YIJIANG_MORE_DEFINITIONS=freeze(definitions);
