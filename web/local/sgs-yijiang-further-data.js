/** V31 complete selected source packets. Independent and full aggregate checks passed; current-client verification remains false. */
const definitions = [
  {
    "key": "guyong",
    "id": "sgs.adapted.base.hero.gu-yong",
    "source_name": "顾雍",
    "suggested_display_name": "顾雍",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "吴",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 182,
    "source_refs": [
      "mobile-guyong",
      "bwiki-guyong"
    ],
    "intrinsic_skill_inventory": [
      "慎行",
      "秉壹"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.shenxing",
      "sgs.bingyi"
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
        "id": "sgs.shenxing",
        "name": "慎行",
        "type": "optional_active_exact_cost_draw",
        "timing": "Owner real play phase action window",
        "quota": "No skill activation limit; repeat while two legal material cards remain",
        "cost": "Exactly2 discardable owned hand/equipment physical cards, one batch",
        "targets": "Self only; no chosen other target",
        "effects": [
          "Pay exactly2 as discard, then owner draws1. Any mix of H/E allowed; judge/private-pile cards are not own ordinary cost cards.",
          "Cannot pay1, pay0, pay3, or substitute lossHP. This is a skill action, not a card use/recast.",
          "No once-turn gate. Cost-loss triggers use real discarded identities; successful payment stays paid if moved later by another skill.",
          "Equipped cards lose their equipment effects when leaving; use standard move/loss and resulting triggers before next player action."
        ],
        "official_rule_text": "出牌阶段，你可以弃置两张牌，然后摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guyong",
          "bwiki-guyong"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.bingyi",
        "name": "秉壹",
        "type": "optional_public_full_hand_reveal_distribute_draw",
        "timing": "Owner actual end phase start",
        "quota": "One offer per real end phase entry",
        "cost": "No discard; publicly reveal every current hand card",
        "targets": "Up to X distinct living roles including self, any faction/team/distance; X=owner hand count at reveal",
        "effects": [
          "Owner may reveal the whole hand, not a chosen subset. A nonempty same-color hand permits the subsequent allocation; one hand card always meets same-color.",
          "If revealed hand contains both red and black, no recipients draw. Matching category without matching color does not qualify.",
          "Choose0..min(X,livingCount) distinct recipients; each draws exactly1, never X each. Owner may include self.",
          "Revealed cards stay in the hand and remain usable; reveal is not discard, use, response, loss or transfer.",
          "X is fixed from this reveal; drawing for an earlier recipient cannot grow the current recipient cap. New end-phase entry is a new opportunity; no active-play allocation."
        ],
        "official_rule_text": "结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-guyong",
          "bwiki-guyong"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "慎行 active button shows exact2 material requirement, H/E multiselect, cancel before commit.",
      "秉壹 optional end-phase prompt followed by public immutable reveal log; select at mostX distinct recipients including self; show red/black check and recipient cap.",
      "Mixed-color reveal remains a real public reveal even though it yields no draws. No hand faces leak before owner accepts; never permanently reveal newly drawn cards."
    ],
    "rule_expansion_notes": [
      "Zero cards gives X0 and no tangible effect; UI may suppress no-op reveal under H8, never award cards.",
      "Color condition uses effective card color in owner context, not suit/category or raw printed color when a real color-changing effect applies. Host-only no-color/copy interactions are separately declared H8/H6."
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H8"
    ],
    "name": "顾雍",
    "display_name": "顾雍",
    "skill_name": "慎行/秉壹",
    "skill_desc": "慎行：出牌阶段，你可以弃置两张牌，然后摸一张牌。 秉壹：结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。",
    "source_character_name": "顾雍",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀顾雍",
      "gu-yong",
      "guyong",
      "顾雍·慎行/秉壹"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-182.html",
      "https://wiki.biligame.com/msgs/%E9%A1%BE%E9%9B%8D"
    ],
    "source_records": [
      {
        "id": "mobile-guyong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-182.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-182.html",
        "status": 200,
        "bytes": 21038,
        "sha256": "e6705adab8cc0b2492358ad70284623bd2b839b8685d5ba42438bcfd17c8b931",
        "accessed_at": "2026-10-16T00:26:32.460319+00:00",
        "raw_path": "evidence/mobile-guyong.html",
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
                  "name": "慎行",
                  "hidden": false,
                  "rule_text": "出牌阶段，你可以弃置两张牌，然后摸一张牌。",
                  "html_line": 181,
                  "rule_sha256": "b38df1a9e07d9345eb7f12da82a90efd95634a485c77a613567787f5f9b18bc4"
                },
                {
                  "name": "秉壹",
                  "hidden": true,
                  "rule_text": "结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。",
                  "html_line": 182,
                  "rule_sha256": "dcad4660c3e40a77018d8ef0e28f1008ae061328e4d9fae49969b20f8b5820d2"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "吴"
        },
        "limitations": [
          "Undated catalog; does not certify current Mobile client.",
          "All skill panels including hidden panels inspected; official HP/gender numeric field absent."
        ]
      },
      {
        "id": "bwiki-guyong",
        "url": "https://wiki.biligame.com/msgs/%E9%A1%BE%E9%9B%8D",
        "final_url": "https://wiki.biligame.com/msgs/%E9%A1%BE%E9%9B%8D",
        "status": 200,
        "bytes": 78374,
        "sha256": "17fd84c5b33573c9389631fc0a13db9e8e34b1a8bf5e80ecf217243b33d6d7e6",
        "accessed_at": "2026-10-16T00:26:38.815342+00:00",
        "raw_path": "evidence/bwiki-guyong.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 9927,
        "modified_at": "2022-08-29T11:08:47Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "吴",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 635,
          "gender_html_line": 626,
          "faction_html_line": 627
        }
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.shenxing",
        "name": "慎行",
        "type": "optional_active_exact_cost_draw",
        "timing": "Owner real play phase action window",
        "quota": "No skill activation limit; repeat while two legal material cards remain",
        "cost": "Exactly2 discardable owned hand/equipment physical cards, one batch",
        "targets": "Self only; no chosen other target",
        "effects": [
          "Pay exactly2 as discard, then owner draws1. Any mix of H/E allowed; judge/private-pile cards are not own ordinary cost cards.",
          "Cannot pay1, pay0, pay3, or substitute lossHP. This is a skill action, not a card use/recast.",
          "No once-turn gate. Cost-loss triggers use real discarded identities; successful payment stays paid if moved later by another skill.",
          "Equipped cards lose their equipment effects when leaving; use standard move/loss and resulting triggers before next player action."
        ],
        "official_rule_text": "出牌阶段，你可以弃置两张牌，然后摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-guyong",
          "bwiki-guyong"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.bingyi",
        "name": "秉壹",
        "type": "optional_public_full_hand_reveal_distribute_draw",
        "timing": "Owner actual end phase start",
        "quota": "One offer per real end phase entry",
        "cost": "No discard; publicly reveal every current hand card",
        "targets": "Up to X distinct living roles including self, any faction/team/distance; X=owner hand count at reveal",
        "effects": [
          "Owner may reveal the whole hand, not a chosen subset. A nonempty same-color hand permits the subsequent allocation; one hand card always meets same-color.",
          "If revealed hand contains both red and black, no recipients draw. Matching category without matching color does not qualify.",
          "Choose0..min(X,livingCount) distinct recipients; each draws exactly1, never X each. Owner may include self.",
          "Revealed cards stay in the hand and remain usable; reveal is not discard, use, response, loss or transfer.",
          "X is fixed from this reveal; drawing for an earlier recipient cannot grow the current recipient cap. New end-phase entry is a new opportunity; no active-play allocation."
        ],
        "official_rule_text": "结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-guyong",
          "bwiki-guyong"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.shenxing",
      "sgs.bingyi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.shenxing",
      "sgs.bingyi"
    ],
    "complete_skill_names": [
      "慎行",
      "秉壹"
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
        "id": "H0",
        "category": "host_initialization",
        "rule": "Start at maxHP unless match config says otherwise; no standalone numeric initialHP claimed from official catalog."
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "Use real physical IDs/location epochs; validate actor, effective skill, phase, cost, target and prompt ownership immediately before commit. Cancel/stale precommit input has no cost/quota/event. Atomic payment occurs once and remains paid after nested losses; no rollback after commit."
      },
      {
        "id": "H2",
        "category": "host_resolution_lifecycle",
        "rule": "On death/match termination skip impossible recipients and stop unsafe continuation. Death/loss skill before activation blocks it; already-paid synchronous skill effect is separate from future skill availability. This does not settle unresolved source-delayed skills such as笔伐."
      },
      {
        "id": "H3",
        "category": "host_event_order",
        "rule": "Use existing deterministic action-order convention for same-window owners and multi-recipient draw; record each effect receipt. Do not invent simultaneous unlogged hand mutation or repeated events on replay."
      },
      {
        "id": "H4",
        "category": "host_finite_deck",
        "rule": "Use normal draw API/reshuffle. If truly exhausted draw only available cards and record requested vs actual; no fabricated cards and no infinite retry."
      },
      {
        "id": "H5",
        "category": "cross_game_card_identity",
        "rule": "Native Mobile Slash family covers normal/fire/thunder. For host血杀/毒杀/刺杀 use existing full Slash-family classification explicitly as host extension. Recast requires a real hand card; use-only conversion skills do not make arbitrary cards recastable. No native Mobile claim for foreign identities."
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "Copy/disable through effective-hero descriptor and stable actor identity. Full two-branch skills copy together. Do not copy source heroHP/faction/gender automatically; use effective gameplay-gender contract. Losing/reacquiring skill does not refresh same actor/global-turn or same phase receipt."
      },
      {
        "id": "H7",
        "category": "host_privacy_and_replay",
        "rule": "Stable opaque hand slots, immutable public reveal snapshots, and exactly-once receipts survive checkpoint/replay. Local cancel/AI policy never changes legal target sets or mandatory effects."
      },
      {
        "id": "H8",
        "category": "host_noop_and_foreign_colors",
        "rule": "For秉壹 empty hand X0, no draw possible; suppress no-op reveal UI. For host-only no-color physical materials require uniform actual color; do not treat no-color as black. Native catalog selected cards are ordinarily red/black. Reveal snapshot bounds X; fresh cards stay hidden."
      },
      {
        "id": "H9",
        "category": "host_state_notifications",
        "rule": "举荐复原 sets face-up and unchained, without unrelated reset; use existing normal state change dispatch, deterministic flip-then-chain order if both change, each exactly once. Internal notification order not Mobile-client-certified."
      },
      {
        "id": "H10",
        "category": "host_duplicate_hook_delivery",
        "rule": "邀名 uses one damage event identity plus actor/globalTurnId; self-damage source+target hook delivery represents one shared opportunity, not two opportunities to re-prompt a declined same packet. Native once-turn limit still applies independently."
      },
      {
        "id": "H11",
        "category": "host_noop_choice_ui",
        "rule": "The local recipient UI may omit a no-change restore option when already face-up and unchained. This is a host presentation choice, not a sourced native prohibition. Core restore remains idempotent and, if a restore request is accepted, emits no fake flip/chain event and changes nothing else. Do not reject it by falsely citing an original-game rule; draw2 and wounded-only recover1 remain the other source effects."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-further/gu-yong.svg",
    "gender_provenance": {
      "source": "bwiki-guyong",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-guyong",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "吴",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 635,
        "gender_html_line": 626,
        "faction_html_line": 627
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "吴",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "cross-game identity, event ordering, death interruption, finite deck, copy and replay",
        "status": "shared_host",
        "host_policy": "H1-H11"
      }
    ],
    "source_equivalence": {
      "signature_sha256": "591bcb4feaa4eccfd71fcbacdc1e96472c93d88ff8b61cfb4da9adc679d33620",
      "signature": {
        "id": "candidate.guyong",
        "name": "顾雍",
        "max_hp": 3,
        "gender": "male",
        "source_faction": "吴",
        "skills": [
          {
            "id": "sgs.shenxing",
            "name": "慎行",
            "timing": "Owner real play phase action window",
            "cost": "Exactly2 discardable owned hand/equipment physical cards, one batch",
            "targets": "Self only; no chosen other target",
            "limit": "No skill activation limit; repeat while two legal material cards remain",
            "effect": [
              "Pay exactly2 as discard, then owner draws1. Any mix of H/E allowed; judge/private-pile cards are not own ordinary cost cards.",
              "Cannot pay1, pay0, pay3, or substitute lossHP. This is a skill action, not a card use/recast.",
              "No once-turn gate. Cost-loss triggers use real discarded identities; successful payment stays paid if moved later by another skill.",
              "Equipped cards lose their equipment effects when leaving; use standard move/loss and resulting triggers before next player action."
            ],
            "intrinsic_questions": []
          },
          {
            "id": "sgs.bingyi",
            "name": "秉壹",
            "timing": "Owner actual end phase start",
            "cost": "No discard; publicly reveal every current hand card",
            "targets": "Up to X distinct living roles including self, any faction/team/distance; X=owner hand count at reveal",
            "limit": "One offer per real end phase entry",
            "effect": [
              "Owner may reveal the whole hand, not a chosen subset. A nonempty same-color hand permits the subsequent allocation; one hand card always meets same-color.",
              "If revealed hand contains both red and black, no recipients draw. Matching category without matching color does not qualify.",
              "Choose0..min(X,livingCount) distinct recipients; each draws exactly1, never X each. Owner may include self.",
              "Revealed cards stay in the hand and remain usable; reveal is not discard, use, response, loss or transfer.",
              "X is fixed from this reveal; drawing for an earlier recipient cannot grow the current recipient cap. New end-phase entry is a new opportunity; no active-play allocation."
            ],
            "intrinsic_questions": []
          }
        ],
        "admission_group": "selected_source_candidate",
        "source_verification_status": "Complete source specification supplied by parent verifier and read verbatim; this task verifies existing-code comparison, not public source authenticity.",
        "starting_hp": {
          "direct_source_value": null,
          "host_normal_initialization_if_admitted": 3
        },
        "personal_lord_skills": {
          "inventory": [],
          "source_complete_verified_by_parent": true
        },
        "granted_or_acquired_intrinsic_skills": {
          "granted": [],
          "acquired": [],
          "source_complete_verified_by_parent": true
        },
        "verified_parent_source_spec": {
          "key": "guyong",
          "id": "sgs.adapted.base.hero.gu-yong",
          "source_name": "顾雍",
          "suggested_display_name": "顾雍",
          "max_hp": 3,
          "gender": "male",
          "source_faction": "吴",
          "starting_hp": 3,
          "starting_hp_direct_source_value": null,
          "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
          "product": "三国杀移动版",
          "variant": "mobile-base-identity-catalog-2026-10-15",
          "official_page_id": 182,
          "source_refs": [
            "mobile-guyong",
            "bwiki-guyong"
          ],
          "intrinsic_skill_inventory": [
            "慎行",
            "秉壹"
          ],
          "personal_lord_skills": [],
          "granted_skill_inventory": [],
          "acquired_skill_inventory": [],
          "skill_ids": [
            "sgs.shenxing",
            "sgs.bingyi"
          ],
          "all_intrinsic_panels_verified": true,
          "current_client_rules_verified": false,
          "current_client_hp_verified": false,
          "source_inventory_ready": true,
          "implementation_status": "research_only",
          "readiness": "source_ready_with_explicit_host_requirements",
          "intrinsic_unresolved": [],
          "skills": [
            {
              "id": "sgs.shenxing",
              "name": "慎行",
              "type": "optional_active_exact_cost_draw",
              "timing": "Owner real play phase action window",
              "quota": "No skill activation limit; repeat while two legal material cards remain",
              "cost": "Exactly2 discardable owned hand/equipment physical cards, one batch",
              "targets": "Self only; no chosen other target",
              "effects": [
                "Pay exactly2 as discard, then owner draws1. Any mix of H/E allowed; judge/private-pile cards are not own ordinary cost cards.",
                "Cannot pay1, pay0, pay3, or substitute lossHP. This is a skill action, not a card use/recast.",
                "No once-turn gate. Cost-loss triggers use real discarded identities; successful payment stays paid if moved later by another skill.",
                "Equipped cards lose their equipment effects when leaving; use standard move/loss and resulting triggers before next player action."
              ],
              "official_rule_text": "出牌阶段，你可以弃置两张牌，然后摸一张牌。",
              "official_panel_hidden": false,
              "source_refs": [
                "mobile-guyong",
                "bwiki-guyong"
              ],
              "limited_marker": null,
              "awakening_marker": null
            },
            {
              "id": "sgs.bingyi",
              "name": "秉壹",
              "type": "optional_public_full_hand_reveal_distribute_draw",
              "timing": "Owner actual end phase start",
              "quota": "One offer per real end phase entry",
              "cost": "No discard; publicly reveal every current hand card",
              "targets": "Up to X distinct living roles including self, any faction/team/distance; X=owner hand count at reveal",
              "effects": [
                "Owner may reveal the whole hand, not a chosen subset. A nonempty same-color hand permits the subsequent allocation; one hand card always meets same-color.",
                "If revealed hand contains both red and black, no recipients draw. Matching category without matching color does not qualify.",
                "Choose0..min(X,livingCount) distinct recipients; each draws exactly1, never X each. Owner may include self.",
                "Revealed cards stay in the hand and remain usable; reveal is not discard, use, response, loss or transfer.",
                "X is fixed from this reveal; drawing for an earlier recipient cannot grow the current recipient cap. New end-phase entry is a new opportunity; no active-play allocation."
              ],
              "official_rule_text": "结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。",
              "official_panel_hidden": true,
              "source_refs": [
                "mobile-guyong",
                "bwiki-guyong"
              ],
              "limited_marker": null,
              "awakening_marker": null
            }
          ],
          "ui_requirements": [
            "慎行 active button shows exact2 material requirement, H/E multiselect, cancel before commit.",
            "秉壹 optional end-phase prompt followed by public immutable reveal log; select at mostX distinct recipients including self; show red/black check and recipient cap.",
            "Mixed-color reveal remains a real public reveal even though it yields no draws. No hand faces leak before owner accepts; never permanently reveal newly drawn cards."
          ],
          "rule_expansion_notes": [
            "Zero cards gives X0 and no tangible effect; UI may suppress no-op reveal under H8, never award cards.",
            "Color condition uses effective card color in owner context, not suit/category or raw printed color when a real color-changing effect applies. Host-only no-color/copy interactions are separately declared H8/H6."
          ],
          "host_policy_refs": [
            "H0",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "H7",
            "H8"
          ]
        },
        "canonical_proposed_id": "sgs.adapted.base.hero.gu-yong",
        "source_packet_ref": "../specs.json",
        "signature_sha256": "591bcb4feaa4eccfd71fcbacdc1e96472c93d88ff8b61cfb4da9adc679d33620"
      },
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 104,
      "source_alias_records_checked": 7,
      "comparison_basis": "Full104 playable templates plus7 source merge records;444 selected comparisons and6 selected candidate pairs; none equivalent."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-guyong",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-182.html",
        "raw_path": "evidence/mobile-guyong.html",
        "sha256": "e6705adab8cc0b2492358ad70284623bd2b839b8685d5ba42438bcfd17c8b931",
        "current_client_verified": false
      },
      {
        "id": "bwiki-guyong",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E9%A1%BE%E9%9B%8D",
        "raw_path": "evidence/bwiki-guyong.html",
        "sha256": "17fd84c5b33573c9389631fc0a13db9e8e34b1a8bf5e80ecf217243b33d6d7e6",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局为江湖初始化。H1–H11明示真实事件回执、原子费用、实际角色性别、重铸语义、全局回合额度、公开快照、跨游戏技能复制及复原无变化UI政策。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "xiahou-shi",
    "id": "sgs.adapted.base.hero.xiahou-shi",
    "source_name": "夏侯氏",
    "suggested_display_name": "夏侯氏",
    "max_hp": 3,
    "gender": "female",
    "source_faction": "蜀",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 189,
    "source_refs": [
      "mobile-xiahou-shi",
      "bwiki-xiahou-shi"
    ],
    "intrinsic_skill_inventory": [
      "樵拾",
      "燕语"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.qiaoshi",
      "sgs.yanyu"
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
        "id": "sgs.qiaoshi",
        "name": "樵拾",
        "type": "optional_other_end_equal_hand_pair_draw",
        "timing": "Start of any OTHER living role actual end phase",
        "quota": "One optional opportunity for each owner for that end-phase event; no global-round cap",
        "cost": "None",
        "targets": "Owner and the active end-phase role, if their current hand counts are equal; includes enemies",
        "effects": [
          "Compare hand counts, not HP, hand limit, equipment count or faction.0H vs0H qualifies.",
          "Owner chooses whether both draw1. Neither participant is selected anew and the target cannot refuse after owner accepts.",
          "Only OTHER role end phase. Own end phase is ineligible. There is no loop merely because both drawing preserves equality.",
          "A skipped whole turn or nonexistent end phase generates no fake opportunity; a real additional end phase generates a new opportunity.",
          "Recheck hand equality at actual offer/commit; prior same-window effects may have changed one hand. Pair draws use ordinary draw events."
        ],
        "official_rule_text": "其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xiahou-shi",
          "bwiki-xiahou-shi"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.yanyu",
        "name": "燕语",
        "type": "optional_sha_recast_and_phase_end_male_draw",
        "timing": "Active branch during owner real play phase; bonus at that SAME play phase end",
        "quota": "Recast no count limit; bonus at most once at end of each real play phase if at least2 Slash cards were recast in it",
        "cost": "Recast1 physical Slash hand card each activation, moving it to discard with recast reason, then draw1",
        "targets": "Recast owner; bonus optional one living male role, no faction/distance requirement",
        "effects": [
          "Slash includes ordinary/fire/thunder Slash. Recast does not use Slash and has no attack target, no use-limit cost, no damage or response window.",
          "A Slash merely used, responded, discarded, obtained or revealed is not recast and does not increase the stage counter.",
          "Record actual recast cards in this exact phase, not turn total or a consecutive-pair requirement.2,3,4,5... all yield only one optional2-card bonus at this phase end.",
          "At phase end if counter>=2, owner may select one male role and that role draws2. At count0/1 there is no bonus.",
          "Fresh actual play phase starts with zero count, including extra play phases; two separate phases with one recast each do not qualify.",
          "The native owner is female so cannot select herself; if the complete skill is copied by a male host role, any-male wording includes that actor under the declared copied-skill gender policy.",
          "Recast is not discard: Luoying/Zongxuan discard-only hooks must not consume recast cards. Recast is still real hand loss for applicable hand-loss mechanics."
        ],
        "official_rule_text": "出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-xiahou-shi",
          "bwiki-xiahou-shi",
          "bwiki-skill-concepts"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "樵拾 appears to skill owner during another role end phase; show both current counts and optional accept/decline, even0/0.",
      "Separate 燕语重铸 button and explicit selected Slash identity; never route it through 出杀.",
      "Public recast count tied to phase label; phase-end optional male target selector highlights legal gender; do not auto-award after every pair.",
      "Recast card is public upon movement, drawn replacement remains private; phase event and counter persist across checkpoint/replay."
    ],
    "rule_expansion_notes": [
      "Printed Slash family is sufficient for native package. Cross-game 血杀/毒杀/刺杀 and continuous identity filtering require H5; do not assert these existed in the Mobile native rule.",
      "No intrinsically granted skills/awakening/lord skill. One full ability has two timing branches, both mandatory implementation scope."
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7"
    ],
    "name": "夏侯氏",
    "display_name": "夏侯氏",
    "skill_name": "樵拾/燕语",
    "skill_desc": "樵拾：其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。 燕语：出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。",
    "source_character_name": "夏侯氏",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "蜀",
    "source_id_aliases": [],
    "aliases": [
      "三国杀夏侯氏",
      "xiahou-shi",
      "xiahou-shi",
      "夏侯氏·樵拾/燕语"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-189.html",
      "https://wiki.biligame.com/msgs/%E5%A4%8F%E4%BE%AF%E6%B0%8F",
      "https://wiki.biligame.com/msgs/%E6%8A%80%E8%83%BD%E6%A6%82%E5%BF%B5%E4%BB%8B%E7%BB%8D"
    ],
    "source_records": [
      {
        "id": "mobile-xiahou-shi",
        "url": "https://www.sanguosha.cn/pc/hero-detail-189.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-189.html",
        "status": 200,
        "bytes": 22134,
        "sha256": "25804d29b335cc86f6e975c4715e5dd714da70775b6906d52d1fb3f1df9abb0b",
        "accessed_at": "2026-10-16T00:26:31.847761+00:00",
        "raw_path": "evidence/mobile-xiahou-shi.html",
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
                  "name": "樵拾",
                  "hidden": false,
                  "rule_text": "其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。",
                  "html_line": 190,
                  "rule_sha256": "0e515112976ce3d596d966e273565875cbad22c6b510bff07e4a987f0260ecfa"
                },
                {
                  "name": "燕语",
                  "hidden": true,
                  "rule_text": "出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。",
                  "html_line": 191,
                  "rule_sha256": "c1ea69d4e7f1cf42e26b34cfa6b028e9ca58817f2f595ab977755dae3e252c5c"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "蜀"
        },
        "limitations": [
          "Undated catalog; does not certify current Mobile client.",
          "All skill panels including hidden panels inspected; official HP/gender numeric field absent."
        ]
      },
      {
        "id": "bwiki-xiahou-shi",
        "url": "https://wiki.biligame.com/msgs/%E5%A4%8F%E4%BE%AF%E6%B0%8F",
        "final_url": "https://wiki.biligame.com/msgs/%E5%A4%8F%E4%BE%AF%E6%B0%8F",
        "status": 200,
        "bytes": 85342,
        "sha256": "8c6a9abd25661f5b75f085dc6d591110033ec52bb89516ccc5e004603eaeba8c",
        "accessed_at": "2026-10-16T00:26:37.003501+00:00",
        "raw_path": "evidence/bwiki-xiahou-shi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 34641,
        "modified_at": "2025-11-27T08:57:38Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "female",
          "faction": "蜀",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 665,
          "gender_html_line": 656,
          "faction_html_line": 657
        }
      },
      {
        "id": "bwiki-skill-concepts",
        "url": "https://wiki.biligame.com/msgs/%E6%8A%80%E8%83%BD%E6%A6%82%E5%BF%B5%E4%BB%8B%E7%BB%8D",
        "final_url": "https://wiki.biligame.com/msgs/%E6%8A%80%E8%83%BD%E6%A6%82%E5%BF%B5%E4%BB%8B%E7%BB%8D",
        "status": 200,
        "bytes": 231984,
        "sha256": "485f752e7fcfa360520b7c47c6649f9e1e46bc86e89befffda5e19a9c185d5e6",
        "accessed_at": "2026-10-16T00:29:38.361808+00:00",
        "raw_path": "evidence/bwiki-skill-concepts.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 40721,
        "modified_at": "2026-10-11T13:38:27Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.qiaoshi",
        "name": "樵拾",
        "type": "optional_other_end_equal_hand_pair_draw",
        "timing": "Start of any OTHER living role actual end phase",
        "quota": "One optional opportunity for each owner for that end-phase event; no global-round cap",
        "cost": "None",
        "targets": "Owner and the active end-phase role, if their current hand counts are equal; includes enemies",
        "effects": [
          "Compare hand counts, not HP, hand limit, equipment count or faction.0H vs0H qualifies.",
          "Owner chooses whether both draw1. Neither participant is selected anew and the target cannot refuse after owner accepts.",
          "Only OTHER role end phase. Own end phase is ineligible. There is no loop merely because both drawing preserves equality.",
          "A skipped whole turn or nonexistent end phase generates no fake opportunity; a real additional end phase generates a new opportunity.",
          "Recheck hand equality at actual offer/commit; prior same-window effects may have changed one hand. Pair draws use ordinary draw events."
        ],
        "official_rule_text": "其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xiahou-shi",
          "bwiki-xiahou-shi"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.yanyu",
        "name": "燕语",
        "type": "optional_sha_recast_and_phase_end_male_draw",
        "timing": "Active branch during owner real play phase; bonus at that SAME play phase end",
        "quota": "Recast no count limit; bonus at most once at end of each real play phase if at least2 Slash cards were recast in it",
        "cost": "Recast1 physical Slash hand card each activation, moving it to discard with recast reason, then draw1",
        "targets": "Recast owner; bonus optional one living male role, no faction/distance requirement",
        "effects": [
          "Slash includes ordinary/fire/thunder Slash. Recast does not use Slash and has no attack target, no use-limit cost, no damage or response window.",
          "A Slash merely used, responded, discarded, obtained or revealed is not recast and does not increase the stage counter.",
          "Record actual recast cards in this exact phase, not turn total or a consecutive-pair requirement.2,3,4,5... all yield only one optional2-card bonus at this phase end.",
          "At phase end if counter>=2, owner may select one male role and that role draws2. At count0/1 there is no bonus.",
          "Fresh actual play phase starts with zero count, including extra play phases; two separate phases with one recast each do not qualify.",
          "The native owner is female so cannot select herself; if the complete skill is copied by a male host role, any-male wording includes that actor under the declared copied-skill gender policy.",
          "Recast is not discard: Luoying/Zongxuan discard-only hooks must not consume recast cards. Recast is still real hand loss for applicable hand-loss mechanics."
        ],
        "official_rule_text": "出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-xiahou-shi",
          "bwiki-xiahou-shi",
          "bwiki-skill-concepts"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.qiaoshi",
      "sgs.yanyu"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.qiaoshi",
      "sgs.yanyu"
    ],
    "complete_skill_names": [
      "樵拾",
      "燕语"
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
        "id": "H0",
        "category": "host_initialization",
        "rule": "Start at maxHP unless match config says otherwise; no standalone numeric initialHP claimed from official catalog."
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "Use real physical IDs/location epochs; validate actor, effective skill, phase, cost, target and prompt ownership immediately before commit. Cancel/stale precommit input has no cost/quota/event. Atomic payment occurs once and remains paid after nested losses; no rollback after commit."
      },
      {
        "id": "H2",
        "category": "host_resolution_lifecycle",
        "rule": "On death/match termination skip impossible recipients and stop unsafe continuation. Death/loss skill before activation blocks it; already-paid synchronous skill effect is separate from future skill availability. This does not settle unresolved source-delayed skills such as笔伐."
      },
      {
        "id": "H3",
        "category": "host_event_order",
        "rule": "Use existing deterministic action-order convention for same-window owners and multi-recipient draw; record each effect receipt. Do not invent simultaneous unlogged hand mutation or repeated events on replay."
      },
      {
        "id": "H4",
        "category": "host_finite_deck",
        "rule": "Use normal draw API/reshuffle. If truly exhausted draw only available cards and record requested vs actual; no fabricated cards and no infinite retry."
      },
      {
        "id": "H5",
        "category": "cross_game_card_identity",
        "rule": "Native Mobile Slash family covers normal/fire/thunder. For host血杀/毒杀/刺杀 use existing full Slash-family classification explicitly as host extension. Recast requires a real hand card; use-only conversion skills do not make arbitrary cards recastable. No native Mobile claim for foreign identities."
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "Copy/disable through effective-hero descriptor and stable actor identity. Full two-branch skills copy together. Do not copy source heroHP/faction/gender automatically; use effective gameplay-gender contract. Losing/reacquiring skill does not refresh same actor/global-turn or same phase receipt."
      },
      {
        "id": "H7",
        "category": "host_privacy_and_replay",
        "rule": "Stable opaque hand slots, immutable public reveal snapshots, and exactly-once receipts survive checkpoint/replay. Local cancel/AI policy never changes legal target sets or mandatory effects."
      },
      {
        "id": "H8",
        "category": "host_noop_and_foreign_colors",
        "rule": "For秉壹 empty hand X0, no draw possible; suppress no-op reveal UI. For host-only no-color physical materials require uniform actual color; do not treat no-color as black. Native catalog selected cards are ordinarily red/black. Reveal snapshot bounds X; fresh cards stay hidden."
      },
      {
        "id": "H9",
        "category": "host_state_notifications",
        "rule": "举荐复原 sets face-up and unchained, without unrelated reset; use existing normal state change dispatch, deterministic flip-then-chain order if both change, each exactly once. Internal notification order not Mobile-client-certified."
      },
      {
        "id": "H10",
        "category": "host_duplicate_hook_delivery",
        "rule": "邀名 uses one damage event identity plus actor/globalTurnId; self-damage source+target hook delivery represents one shared opportunity, not two opportunities to re-prompt a declined same packet. Native once-turn limit still applies independently."
      },
      {
        "id": "H11",
        "category": "host_noop_choice_ui",
        "rule": "The local recipient UI may omit a no-change restore option when already face-up and unchained. This is a host presentation choice, not a sourced native prohibition. Core restore remains idempotent and, if a restore request is accepted, emits no fake flip/chain event and changes nothing else. Do not reject it by falsely citing an original-game rule; draw2 and wounded-only recover1 remain the other source effects."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-further/xiahou-shi.svg",
    "gender_provenance": {
      "source": "bwiki-xiahou-shi",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "female",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-xiahou-shi",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "female",
        "faction": "蜀",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 665,
        "gender_html_line": 656,
        "faction_html_line": 657
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "蜀",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "cross-game identity, event ordering, death interruption, finite deck, copy and replay",
        "status": "shared_host",
        "host_policy": "H1-H11"
      }
    ],
    "source_equivalence": {
      "signature_sha256": "9c586f66a305557c71a7d6e40b7917f8131b6f7b4f05087c6d08b7d8141d6aea",
      "signature": {
        "id": "candidate.xiahoushi",
        "name": "夏侯氏",
        "max_hp": 3,
        "gender": "female",
        "source_faction": "蜀",
        "skills": [
          {
            "id": "sgs.qiaoshi",
            "name": "樵拾",
            "timing": "Start of any OTHER living role actual end phase",
            "cost": "None",
            "targets": "Owner and the active end-phase role, if their current hand counts are equal; includes enemies",
            "limit": "One optional opportunity for each owner for that end-phase event; no global-round cap",
            "effect": [
              "Compare hand counts, not HP, hand limit, equipment count or faction.0H vs0H qualifies.",
              "Owner chooses whether both draw1. Neither participant is selected anew and the target cannot refuse after owner accepts.",
              "Only OTHER role end phase. Own end phase is ineligible. There is no loop merely because both drawing preserves equality.",
              "A skipped whole turn or nonexistent end phase generates no fake opportunity; a real additional end phase generates a new opportunity.",
              "Recheck hand equality at actual offer/commit; prior same-window effects may have changed one hand. Pair draws use ordinary draw events."
            ],
            "intrinsic_questions": []
          },
          {
            "id": "sgs.yanyu",
            "name": "燕语",
            "timing": "Active branch during owner real play phase; bonus at that SAME play phase end",
            "cost": "Recast1 physical Slash hand card each activation, moving it to discard with recast reason, then draw1",
            "targets": "Recast owner; bonus optional one living male role, no faction/distance requirement",
            "limit": "Recast no count limit; bonus at most once at end of each real play phase if at least2 Slash cards were recast in it",
            "effect": [
              "Slash includes ordinary/fire/thunder Slash. Recast does not use Slash and has no attack target, no use-limit cost, no damage or response window.",
              "A Slash merely used, responded, discarded, obtained or revealed is not recast and does not increase the stage counter.",
              "Record actual recast cards in this exact phase, not turn total or a consecutive-pair requirement.2,3,4,5... all yield only one optional2-card bonus at this phase end.",
              "At phase end if counter>=2, owner may select one male role and that role draws2. At count0/1 there is no bonus.",
              "Fresh actual play phase starts with zero count, including extra play phases; two separate phases with one recast each do not qualify.",
              "The native owner is female so cannot select herself; if the complete skill is copied by a male host role, any-male wording includes that actor under the declared copied-skill gender policy.",
              "Recast is not discard: Luoying/Zongxuan discard-only hooks must not consume recast cards. Recast is still real hand loss for applicable hand-loss mechanics."
            ],
            "intrinsic_questions": []
          }
        ],
        "admission_group": "selected_source_candidate",
        "source_verification_status": "Complete source specification supplied by parent verifier and read verbatim; this task verifies existing-code comparison, not public source authenticity.",
        "starting_hp": {
          "direct_source_value": null,
          "host_normal_initialization_if_admitted": 3
        },
        "personal_lord_skills": {
          "inventory": [],
          "source_complete_verified_by_parent": true
        },
        "granted_or_acquired_intrinsic_skills": {
          "granted": [],
          "acquired": [],
          "source_complete_verified_by_parent": true
        },
        "verified_parent_source_spec": {
          "key": "xiahou-shi",
          "id": "sgs.adapted.base.hero.xiahou-shi",
          "source_name": "夏侯氏",
          "suggested_display_name": "夏侯氏",
          "max_hp": 3,
          "gender": "female",
          "source_faction": "蜀",
          "starting_hp": 3,
          "starting_hp_direct_source_value": null,
          "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
          "product": "三国杀移动版",
          "variant": "mobile-base-identity-catalog-2026-10-15",
          "official_page_id": 189,
          "source_refs": [
            "mobile-xiahou-shi",
            "bwiki-xiahou-shi"
          ],
          "intrinsic_skill_inventory": [
            "樵拾",
            "燕语"
          ],
          "personal_lord_skills": [],
          "granted_skill_inventory": [],
          "acquired_skill_inventory": [],
          "skill_ids": [
            "sgs.qiaoshi",
            "sgs.yanyu"
          ],
          "all_intrinsic_panels_verified": true,
          "current_client_rules_verified": false,
          "current_client_hp_verified": false,
          "source_inventory_ready": true,
          "implementation_status": "research_only",
          "readiness": "source_ready_with_explicit_host_requirements",
          "intrinsic_unresolved": [],
          "skills": [
            {
              "id": "sgs.qiaoshi",
              "name": "樵拾",
              "type": "optional_other_end_equal_hand_pair_draw",
              "timing": "Start of any OTHER living role actual end phase",
              "quota": "One optional opportunity for each owner for that end-phase event; no global-round cap",
              "cost": "None",
              "targets": "Owner and the active end-phase role, if their current hand counts are equal; includes enemies",
              "effects": [
                "Compare hand counts, not HP, hand limit, equipment count or faction.0H vs0H qualifies.",
                "Owner chooses whether both draw1. Neither participant is selected anew and the target cannot refuse after owner accepts.",
                "Only OTHER role end phase. Own end phase is ineligible. There is no loop merely because both drawing preserves equality.",
                "A skipped whole turn or nonexistent end phase generates no fake opportunity; a real additional end phase generates a new opportunity.",
                "Recheck hand equality at actual offer/commit; prior same-window effects may have changed one hand. Pair draws use ordinary draw events."
              ],
              "official_rule_text": "其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。",
              "official_panel_hidden": false,
              "source_refs": [
                "mobile-xiahou-shi",
                "bwiki-xiahou-shi"
              ],
              "limited_marker": null,
              "awakening_marker": null
            },
            {
              "id": "sgs.yanyu",
              "name": "燕语",
              "type": "optional_sha_recast_and_phase_end_male_draw",
              "timing": "Active branch during owner real play phase; bonus at that SAME play phase end",
              "quota": "Recast no count limit; bonus at most once at end of each real play phase if at least2 Slash cards were recast in it",
              "cost": "Recast1 physical Slash hand card each activation, moving it to discard with recast reason, then draw1",
              "targets": "Recast owner; bonus optional one living male role, no faction/distance requirement",
              "effects": [
                "Slash includes ordinary/fire/thunder Slash. Recast does not use Slash and has no attack target, no use-limit cost, no damage or response window.",
                "A Slash merely used, responded, discarded, obtained or revealed is not recast and does not increase the stage counter.",
                "Record actual recast cards in this exact phase, not turn total or a consecutive-pair requirement.2,3,4,5... all yield only one optional2-card bonus at this phase end.",
                "At phase end if counter>=2, owner may select one male role and that role draws2. At count0/1 there is no bonus.",
                "Fresh actual play phase starts with zero count, including extra play phases; two separate phases with one recast each do not qualify.",
                "The native owner is female so cannot select herself; if the complete skill is copied by a male host role, any-male wording includes that actor under the declared copied-skill gender policy.",
                "Recast is not discard: Luoying/Zongxuan discard-only hooks must not consume recast cards. Recast is still real hand loss for applicable hand-loss mechanics."
              ],
              "official_rule_text": "出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。",
              "official_panel_hidden": true,
              "source_refs": [
                "mobile-xiahou-shi",
                "bwiki-xiahou-shi",
                "bwiki-skill-concepts"
              ],
              "limited_marker": null,
              "awakening_marker": null
            }
          ],
          "ui_requirements": [
            "樵拾 appears to skill owner during another role end phase; show both current counts and optional accept/decline, even0/0.",
            "Separate 燕语重铸 button and explicit selected Slash identity; never route it through 出杀.",
            "Public recast count tied to phase label; phase-end optional male target selector highlights legal gender; do not auto-award after every pair.",
            "Recast card is public upon movement, drawn replacement remains private; phase event and counter persist across checkpoint/replay."
          ],
          "rule_expansion_notes": [
            "Printed Slash family is sufficient for native package. Cross-game 血杀/毒杀/刺杀 and continuous identity filtering require H5; do not assert these existed in the Mobile native rule.",
            "No intrinsically granted skills/awakening/lord skill. One full ability has two timing branches, both mandatory implementation scope."
          ],
          "host_policy_refs": [
            "H0",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "H7"
          ]
        },
        "canonical_proposed_id": "sgs.adapted.base.hero.xiahou-shi",
        "source_packet_ref": "../specs.json",
        "signature_sha256": "9c586f66a305557c71a7d6e40b7917f8131b6f7b4f05087c6d08b7d8141d6aea"
      },
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 104,
      "source_alias_records_checked": 7,
      "comparison_basis": "Full104 playable templates plus7 source merge records;444 selected comparisons and6 selected candidate pairs; none equivalent."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-xiahou-shi",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-189.html",
        "raw_path": "evidence/mobile-xiahou-shi.html",
        "sha256": "25804d29b335cc86f6e975c4715e5dd714da70775b6906d52d1fb3f1df9abb0b",
        "current_client_verified": false
      },
      {
        "id": "bwiki-xiahou-shi",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E5%A4%8F%E4%BE%AF%E6%B0%8F",
        "raw_path": "evidence/bwiki-xiahou-shi.html",
        "sha256": "8c6a9abd25661f5b75f085dc6d591110033ec52bb89516ccc5e004603eaeba8c",
        "current_client_verified": false
      },
      {
        "id": "bwiki-skill-concepts",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E6%8A%80%E8%83%BD%E6%A6%82%E5%BF%B5%E4%BB%8B%E7%BB%8D",
        "raw_path": "evidence/bwiki-skill-concepts.html",
        "sha256": "485f752e7fcfa360520b7c47c6649f9e1e46bc86e89befffda5e19a9c185d5e6",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局为江湖初始化。H1–H11明示真实事件回执、原子费用、实际角色性别、重铸语义、全局回合额度、公开快照、跨游戏技能复制及复原无变化UI政策。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "xushu",
    "id": "sgs.adapted.base.hero.xu-shu",
    "source_name": "徐庶",
    "suggested_display_name": "徐庶",
    "max_hp": 3,
    "gender": "male",
    "source_faction": "蜀",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 135,
    "source_refs": [
      "mobile-xushu",
      "bwiki-xushu"
    ],
    "intrinsic_skill_inventory": [
      "无言",
      "举荐"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.wuyan",
      "sgs.jujian"
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
        "id": "sgs.wuyan",
        "name": "无言",
        "type": "locked_trick_channel_damage_prevention",
        "timing": "When owner is actual source about to deal trick-card-channel damage, or actual target about to receive trick-card-channel damage",
        "quota": "Always while effective skill available; no per-turn/point budget",
        "cost": "None",
        "targets": "Every such actual damage packet, any role; source-less incoming trick damage also qualifies",
        "effects": [
          "Prevent the entire damage packet, not reduce by1 and not convert it to HP loss. Damage is not dealt/taken and downstream after-damage effects must not fire.",
          "Only damage is prevented. Non-damaging trick effects (draw, steal, discard, delay, chain) remain legal and effective. Card targeting/response/legal use still occurs; no blanket trick immunity.",
          "Use actual damage source after source substitutions. If XuShu uses 南蛮 while MengHuo becomes its source, source-side 无言 does not prevent damage to other roles.",
          "Incoming trick damage qualifies even without a source (e.g. lightning). Chain propagation retains its actual damage-card channel; a trick-origin chain packet into owner is prevented.",
          "A Slash used due to 借刀/skill remains Slash damage, not trick damage just because a trick prompted it. Source-independent skill damage and HP loss are not prevented.",
          "If a prior effect replaces damage with HP loss there is no damage packet for 无言. Keep original card user and actual damage source separate in the event record."
        ],
        "official_rule_text": "锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xushu",
          "bwiki-xushu",
          "xiaomi-xushu",
          "xianhua-xushu"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.jujian",
        "name": "举荐",
        "type": "optional_nonbasic_cost_recipient_choice",
        "timing": "Owner actual end phase start",
        "quota": "One optional offer at each real end phase",
        "cost": "Exactly1 discardable nonbasic owned H/E card; equipment in hand or installed equipment permitted",
        "targets": "Exactly one OTHER living role, any faction/team/distance; that recipient chooses effect",
        "effects": [
          "Discard1 trick or equipment card. Basic cards cannot pay; installed equipment is valid and its ordinary loss effects resolve. Judge/private pile are not payment zones.",
          "Recipient, not owner or AI teammate, chooses exactly one legal option: draw2, recover1, restore general card.",
          "Recover1 is available only if recipient is wounded and is capped by current maxHP. A full-HP recipient cannot choose recovery (same-product FAQ).",
          "Restore clears chained state and turns face-down to face-up. It never turns a face-up card down. It preserves delayed tricks, skill marks, spent limited skills, maxHP and currentHP.",
          "Restore changes state only if chained or face-down. Each state actually changed emits its normal change event. Source evidence here does not separately establish whether an already-normal role may choose a no-op restore; H11 governs only local UI handling without claiming native prohibition.",
          "Draw2 is normal card draw, not hand refill or guaranteed minimum2 if finite host deck cannot supply. Do not force restore or heal simply because strategically superior.",
          "This is the current selected Mobile classic damage-prevention/end-phase version; exclude old non-delayed-trick-invalidating/active3-card version, SP徐庶 and友徐庶."
        ],
        "official_rule_text": "结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-xushu",
          "bwiki-xushu",
          "xiaomi-xushu"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "无言 locked badge and prevented damage event animation; show zero dealt/taken, never fake伤害回执.",
      "举荐 end-phase optional H/E nonbasic picker then other-role picker; final choice prompt belongs to recipient.",
      "Disable recovery at fullHP; restore option describes 翻回正面并解除连环, not reset英雄. Explain existing delay/marks remain.",
      "All options and source attribution survive resume; no public exposure of rejected unselected hand cards."
    ],
    "rule_expansion_notes": [
      "Same-product FAQ explicitly closes fullHP recovery, recipient-choice ownership, equipment payment and faceup behavior.",
      "Xiaomi Mobile-channel guide plus official-domain Mobile community source close 孟获actual-source exception and restore including chain; no OL rules borrowed.",
      "H9 defines internal flip/chain notification order when restoring both together; resulting source effect is fixed, ordering is host integration."
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H9",
      "H11"
    ],
    "name": "徐庶",
    "display_name": "徐庶",
    "skill_name": "无言/举荐",
    "skill_desc": "无言：锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。 举荐：结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。",
    "source_character_name": "徐庶",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "蜀",
    "source_id_aliases": [],
    "aliases": [
      "三国杀徐庶",
      "xu-shu",
      "xushu",
      "徐庶·无言/举荐"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-135.html",
      "https://wiki.biligame.com/msgs/%E5%BE%90%E5%BA%B6",
      "https://game.xiaomi.com/viewpoint/1127866428_1589250759109_16",
      "https://xianhua.sanguosha.cn/postDetails?id=11701765"
    ],
    "source_records": [
      {
        "id": "mobile-xushu",
        "url": "https://www.sanguosha.cn/pc/hero-detail-135.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-135.html",
        "status": 200,
        "bytes": 20323,
        "sha256": "b91c7cb4559702c9435c7e893221f31c9e257dff74c7a5e1a65857fd05473eac",
        "accessed_at": "2026-10-16T00:26:31.675870+00:00",
        "raw_path": "evidence/mobile-xushu.html",
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
                  "name": "无言",
                  "hidden": false,
                  "rule_text": "锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。",
                  "html_line": 175,
                  "rule_sha256": "444df541b1da4620740173119f8f42ad5d5848aa43d73a7f355a01b59a593b33"
                },
                {
                  "name": "举荐",
                  "hidden": true,
                  "rule_text": "结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。",
                  "html_line": 176,
                  "rule_sha256": "28a3a6c26c3b41aa6a8a1b9c66eb9050959a9c2cdb3f030524f265f713ec59b5"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "蜀"
        },
        "limitations": [
          "Undated catalog; does not certify current Mobile client.",
          "All skill panels including hidden panels inspected; official HP/gender numeric field absent."
        ]
      },
      {
        "id": "bwiki-xushu",
        "url": "https://wiki.biligame.com/msgs/%E5%BE%90%E5%BA%B6",
        "final_url": "https://wiki.biligame.com/msgs/%E5%BE%90%E5%BA%B6",
        "status": 200,
        "bytes": 102444,
        "sha256": "72ae589d7bc02434e2ec1d45dba2f0c2fa8eff475a917844b0618c28dde929e4",
        "accessed_at": "2026-10-16T00:26:37.066833+00:00",
        "raw_path": "evidence/bwiki-xushu.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 33676,
        "modified_at": "2025-10-21T01:20:40Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "蜀",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 697,
          "gender_html_line": 688,
          "faction_html_line": 689
        }
      },
      {
        "id": "xiaomi-xushu",
        "url": "https://game.xiaomi.com/viewpoint/1127866428_1589250759109_16",
        "final_url": "https://game.xiaomi.com/viewpoint/1127866428_1589250759109_16",
        "status": 200,
        "bytes": 43422,
        "sha256": "0b1dfcb62104f4ecff6a84c822751cd92509494e367294d99380edb89ebf49b8",
        "accessed_at": "2026-10-16T00:29:34.225079+00:00",
        "raw_path": "evidence/xiaomi-xushu.html",
        "current_client_verified": false,
        "publication_date": "2020-05-12T10:32:00+08:00",
        "tier": "same_product_mobile_channel_community_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "举荐手牌/装备区的非基本牌成本",
          "复原解除铁索并翻正，保留延时锦囊",
          "无言按实际伤害来源，孟获代来源例外",
          "无言防止锦囊渠道的铁索伤害"
        ],
        "limitations": [
          "Guide is not client certification; historical anecdote about国战 not selected.",
          "The article links Xiaomi game62234151. The linked app metadata is recorded separately if fetched; this guide alone does not certify a current client build."
        ]
      },
      {
        "id": "xianhua-xushu",
        "url": "https://xianhua.sanguosha.cn/postDetails?id=11701765",
        "final_url": "https://xianhua.sanguosha.cn/postDetails?id=11701765",
        "status": 200,
        "bytes": 325710,
        "sha256": "34245cdabae6b9b890b294b5bc0e0330fe0e6db8eaeb3ddada6da80487af0a81",
        "accessed_at": "2026-10-16T00:29:38.032778+00:00",
        "raw_path": "evidence/xianhua-xushu.html",
        "current_client_verified": false,
        "publication_date": "2025-12-09T19:32:07+08:00",
        "tier": "same_product_official_domain_community_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "徐庶3/3",
          "孟获替代来源时徐庶南蛮可造成伤害",
          "举荐可翻回背面"
        ],
        "limitations": [
          "Official-domain community post is not official rule FAQ.",
          "Author calls绝情HP-loss伤害 colloquially; do not adopt this terminology."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.wuyan",
        "name": "无言",
        "type": "locked_trick_channel_damage_prevention",
        "timing": "When owner is actual source about to deal trick-card-channel damage, or actual target about to receive trick-card-channel damage",
        "quota": "Always while effective skill available; no per-turn/point budget",
        "cost": "None",
        "targets": "Every such actual damage packet, any role; source-less incoming trick damage also qualifies",
        "effects": [
          "Prevent the entire damage packet, not reduce by1 and not convert it to HP loss. Damage is not dealt/taken and downstream after-damage effects must not fire.",
          "Only damage is prevented. Non-damaging trick effects (draw, steal, discard, delay, chain) remain legal and effective. Card targeting/response/legal use still occurs; no blanket trick immunity.",
          "Use actual damage source after source substitutions. If XuShu uses 南蛮 while MengHuo becomes its source, source-side 无言 does not prevent damage to other roles.",
          "Incoming trick damage qualifies even without a source (e.g. lightning). Chain propagation retains its actual damage-card channel; a trick-origin chain packet into owner is prevented.",
          "A Slash used due to 借刀/skill remains Slash damage, not trick damage just because a trick prompted it. Source-independent skill damage and HP loss are not prevented.",
          "If a prior effect replaces damage with HP loss there is no damage packet for 无言. Keep original card user and actual damage source separate in the event record."
        ],
        "official_rule_text": "锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xushu",
          "bwiki-xushu",
          "xiaomi-xushu",
          "xianhua-xushu"
        ],
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.jujian",
        "name": "举荐",
        "type": "optional_nonbasic_cost_recipient_choice",
        "timing": "Owner actual end phase start",
        "quota": "One optional offer at each real end phase",
        "cost": "Exactly1 discardable nonbasic owned H/E card; equipment in hand or installed equipment permitted",
        "targets": "Exactly one OTHER living role, any faction/team/distance; that recipient chooses effect",
        "effects": [
          "Discard1 trick or equipment card. Basic cards cannot pay; installed equipment is valid and its ordinary loss effects resolve. Judge/private pile are not payment zones.",
          "Recipient, not owner or AI teammate, chooses exactly one legal option: draw2, recover1, restore general card.",
          "Recover1 is available only if recipient is wounded and is capped by current maxHP. A full-HP recipient cannot choose recovery (same-product FAQ).",
          "Restore clears chained state and turns face-down to face-up. It never turns a face-up card down. It preserves delayed tricks, skill marks, spent limited skills, maxHP and currentHP.",
          "Restore changes state only if chained or face-down. Each state actually changed emits its normal change event. Source evidence here does not separately establish whether an already-normal role may choose a no-op restore; H11 governs only local UI handling without claiming native prohibition.",
          "Draw2 is normal card draw, not hand refill or guaranteed minimum2 if finite host deck cannot supply. Do not force restore or heal simply because strategically superior.",
          "This is the current selected Mobile classic damage-prevention/end-phase version; exclude old non-delayed-trick-invalidating/active3-card version, SP徐庶 and友徐庶."
        ],
        "official_rule_text": "结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-xushu",
          "bwiki-xushu",
          "xiaomi-xushu"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.wuyan",
      "sgs.jujian"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.wuyan",
      "sgs.jujian"
    ],
    "complete_skill_names": [
      "无言",
      "举荐"
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
        "id": "H0",
        "category": "host_initialization",
        "rule": "Start at maxHP unless match config says otherwise; no standalone numeric initialHP claimed from official catalog."
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "Use real physical IDs/location epochs; validate actor, effective skill, phase, cost, target and prompt ownership immediately before commit. Cancel/stale precommit input has no cost/quota/event. Atomic payment occurs once and remains paid after nested losses; no rollback after commit."
      },
      {
        "id": "H2",
        "category": "host_resolution_lifecycle",
        "rule": "On death/match termination skip impossible recipients and stop unsafe continuation. Death/loss skill before activation blocks it; already-paid synchronous skill effect is separate from future skill availability. This does not settle unresolved source-delayed skills such as笔伐."
      },
      {
        "id": "H3",
        "category": "host_event_order",
        "rule": "Use existing deterministic action-order convention for same-window owners and multi-recipient draw; record each effect receipt. Do not invent simultaneous unlogged hand mutation or repeated events on replay."
      },
      {
        "id": "H4",
        "category": "host_finite_deck",
        "rule": "Use normal draw API/reshuffle. If truly exhausted draw only available cards and record requested vs actual; no fabricated cards and no infinite retry."
      },
      {
        "id": "H5",
        "category": "cross_game_card_identity",
        "rule": "Native Mobile Slash family covers normal/fire/thunder. For host血杀/毒杀/刺杀 use existing full Slash-family classification explicitly as host extension. Recast requires a real hand card; use-only conversion skills do not make arbitrary cards recastable. No native Mobile claim for foreign identities."
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "Copy/disable through effective-hero descriptor and stable actor identity. Full two-branch skills copy together. Do not copy source heroHP/faction/gender automatically; use effective gameplay-gender contract. Losing/reacquiring skill does not refresh same actor/global-turn or same phase receipt."
      },
      {
        "id": "H7",
        "category": "host_privacy_and_replay",
        "rule": "Stable opaque hand slots, immutable public reveal snapshots, and exactly-once receipts survive checkpoint/replay. Local cancel/AI policy never changes legal target sets or mandatory effects."
      },
      {
        "id": "H8",
        "category": "host_noop_and_foreign_colors",
        "rule": "For秉壹 empty hand X0, no draw possible; suppress no-op reveal UI. For host-only no-color physical materials require uniform actual color; do not treat no-color as black. Native catalog selected cards are ordinarily red/black. Reveal snapshot bounds X; fresh cards stay hidden."
      },
      {
        "id": "H9",
        "category": "host_state_notifications",
        "rule": "举荐复原 sets face-up and unchained, without unrelated reset; use existing normal state change dispatch, deterministic flip-then-chain order if both change, each exactly once. Internal notification order not Mobile-client-certified."
      },
      {
        "id": "H10",
        "category": "host_duplicate_hook_delivery",
        "rule": "邀名 uses one damage event identity plus actor/globalTurnId; self-damage source+target hook delivery represents one shared opportunity, not two opportunities to re-prompt a declined same packet. Native once-turn limit still applies independently."
      },
      {
        "id": "H11",
        "category": "host_noop_choice_ui",
        "rule": "The local recipient UI may omit a no-change restore option when already face-up and unchained. This is a host presentation choice, not a sourced native prohibition. Core restore remains idempotent and, if a restore request is accepted, emits no fake flip/chain event and changes nothing else. Do not reject it by falsely citing an original-game rule; draw2 and wounded-only recover1 remain the other source effects."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-further/xu-shu.svg",
    "gender_provenance": {
      "source": "bwiki-xushu",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-xushu",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "蜀",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 697,
        "gender_html_line": 688,
        "faction_html_line": 689
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "蜀",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "cross-game identity, event ordering, death interruption, finite deck, copy and replay",
        "status": "shared_host",
        "host_policy": "H1-H11"
      }
    ],
    "source_equivalence": {
      "signature_sha256": "8cc353b5fb3e2c43b41164a1a810e7b60b2244e922b0bc6ebf51b282b30ee832",
      "signature": {
        "id": "candidate.xushu",
        "name": "徐庶",
        "max_hp": 3,
        "gender": "male",
        "source_faction": "蜀",
        "skills": [
          {
            "id": "sgs.wuyan",
            "name": "无言",
            "timing": "When owner is actual source about to deal trick-card-channel damage, or actual target about to receive trick-card-channel damage",
            "cost": "None",
            "targets": "Every such actual damage packet, any role; source-less incoming trick damage also qualifies",
            "limit": "Always while effective skill available; no per-turn/point budget",
            "effect": [
              "Prevent the entire damage packet, not reduce by1 and not convert it to HP loss. Damage is not dealt/taken and downstream after-damage effects must not fire.",
              "Only damage is prevented. Non-damaging trick effects (draw, steal, discard, delay, chain) remain legal and effective. Card targeting/response/legal use still occurs; no blanket trick immunity.",
              "Use actual damage source after source substitutions. If XuShu uses 南蛮 while MengHuo becomes its source, source-side 无言 does not prevent damage to other roles.",
              "Incoming trick damage qualifies even without a source (e.g. lightning). Chain propagation retains its actual damage-card channel; a trick-origin chain packet into owner is prevented.",
              "A Slash used due to 借刀/skill remains Slash damage, not trick damage just because a trick prompted it. Source-independent skill damage and HP loss are not prevented.",
              "If a prior effect replaces damage with HP loss there is no damage packet for 无言. Keep original card user and actual damage source separate in the event record."
            ],
            "intrinsic_questions": []
          },
          {
            "id": "sgs.jujian",
            "name": "举荐",
            "timing": "Owner actual end phase start",
            "cost": "Exactly1 discardable nonbasic owned H/E card; equipment in hand or installed equipment permitted",
            "targets": "Exactly one OTHER living role, any faction/team/distance; that recipient chooses effect",
            "limit": "One optional offer at each real end phase",
            "effect": [
              "Discard1 trick or equipment card. Basic cards cannot pay; installed equipment is valid and its ordinary loss effects resolve. Judge/private pile are not payment zones.",
              "Recipient, not owner or AI teammate, chooses exactly one legal option: draw2, recover1, restore general card.",
              "Recover1 is available only if recipient is wounded and is capped by current maxHP. A full-HP recipient cannot choose recovery (same-product FAQ).",
              "Restore clears chained state and turns face-down to face-up. It never turns a face-up card down. It preserves delayed tricks, skill marks, spent limited skills, maxHP and currentHP.",
              "Restore changes state only if chained or face-down. Each state actually changed emits its normal change event. Source evidence here does not separately establish whether an already-normal role may choose a no-op restore; H11 governs only local UI handling without claiming native prohibition.",
              "Draw2 is normal card draw, not hand refill or guaranteed minimum2 if finite host deck cannot supply. Do not force restore or heal simply because strategically superior.",
              "This is the current selected Mobile classic damage-prevention/end-phase version; exclude old non-delayed-trick-invalidating/active3-card version, SP徐庶 and友徐庶."
            ],
            "intrinsic_questions": []
          }
        ],
        "admission_group": "selected_source_candidate",
        "source_verification_status": "Complete source specification supplied by parent verifier and read verbatim; this task verifies existing-code comparison, not public source authenticity.",
        "starting_hp": {
          "direct_source_value": null,
          "host_normal_initialization_if_admitted": 3
        },
        "personal_lord_skills": {
          "inventory": [],
          "source_complete_verified_by_parent": true
        },
        "granted_or_acquired_intrinsic_skills": {
          "granted": [],
          "acquired": [],
          "source_complete_verified_by_parent": true
        },
        "verified_parent_source_spec": {
          "key": "xushu",
          "id": "sgs.adapted.base.hero.xu-shu",
          "source_name": "徐庶",
          "suggested_display_name": "徐庶",
          "max_hp": 3,
          "gender": "male",
          "source_faction": "蜀",
          "starting_hp": 3,
          "starting_hp_direct_source_value": null,
          "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
          "product": "三国杀移动版",
          "variant": "mobile-base-identity-catalog-2026-10-15",
          "official_page_id": 135,
          "source_refs": [
            "mobile-xushu",
            "bwiki-xushu"
          ],
          "intrinsic_skill_inventory": [
            "无言",
            "举荐"
          ],
          "personal_lord_skills": [],
          "granted_skill_inventory": [],
          "acquired_skill_inventory": [],
          "skill_ids": [
            "sgs.wuyan",
            "sgs.jujian"
          ],
          "all_intrinsic_panels_verified": true,
          "current_client_rules_verified": false,
          "current_client_hp_verified": false,
          "source_inventory_ready": true,
          "implementation_status": "research_only",
          "readiness": "source_ready_with_explicit_host_requirements",
          "intrinsic_unresolved": [],
          "skills": [
            {
              "id": "sgs.wuyan",
              "name": "无言",
              "type": "locked_trick_channel_damage_prevention",
              "timing": "When owner is actual source about to deal trick-card-channel damage, or actual target about to receive trick-card-channel damage",
              "quota": "Always while effective skill available; no per-turn/point budget",
              "cost": "None",
              "targets": "Every such actual damage packet, any role; source-less incoming trick damage also qualifies",
              "effects": [
                "Prevent the entire damage packet, not reduce by1 and not convert it to HP loss. Damage is not dealt/taken and downstream after-damage effects must not fire.",
                "Only damage is prevented. Non-damaging trick effects (draw, steal, discard, delay, chain) remain legal and effective. Card targeting/response/legal use still occurs; no blanket trick immunity.",
                "Use actual damage source after source substitutions. If XuShu uses 南蛮 while MengHuo becomes its source, source-side 无言 does not prevent damage to other roles.",
                "Incoming trick damage qualifies even without a source (e.g. lightning). Chain propagation retains its actual damage-card channel; a trick-origin chain packet into owner is prevented.",
                "A Slash used due to 借刀/skill remains Slash damage, not trick damage just because a trick prompted it. Source-independent skill damage and HP loss are not prevented.",
                "If a prior effect replaces damage with HP loss there is no damage packet for 无言. Keep original card user and actual damage source separate in the event record."
              ],
              "official_rule_text": "锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。",
              "official_panel_hidden": false,
              "source_refs": [
                "mobile-xushu",
                "bwiki-xushu",
                "xiaomi-xushu",
                "xianhua-xushu"
              ],
              "limited_marker": null,
              "awakening_marker": null
            },
            {
              "id": "sgs.jujian",
              "name": "举荐",
              "type": "optional_nonbasic_cost_recipient_choice",
              "timing": "Owner actual end phase start",
              "quota": "One optional offer at each real end phase",
              "cost": "Exactly1 discardable nonbasic owned H/E card; equipment in hand or installed equipment permitted",
              "targets": "Exactly one OTHER living role, any faction/team/distance; that recipient chooses effect",
              "effects": [
                "Discard1 trick or equipment card. Basic cards cannot pay; installed equipment is valid and its ordinary loss effects resolve. Judge/private pile are not payment zones.",
                "Recipient, not owner or AI teammate, chooses exactly one legal option: draw2, recover1, restore general card.",
                "Recover1 is available only if recipient is wounded and is capped by current maxHP. A full-HP recipient cannot choose recovery (same-product FAQ).",
                "Restore clears chained state and turns face-down to face-up. It never turns a face-up card down. It preserves delayed tricks, skill marks, spent limited skills, maxHP and currentHP.",
                "Restore changes state only if chained or face-down. Each state actually changed emits its normal change event. Source evidence here does not separately establish whether an already-normal role may choose a no-op restore; H11 governs only local UI handling without claiming native prohibition.",
                "Draw2 is normal card draw, not hand refill or guaranteed minimum2 if finite host deck cannot supply. Do not force restore or heal simply because strategically superior.",
                "This is the current selected Mobile classic damage-prevention/end-phase version; exclude old non-delayed-trick-invalidating/active3-card version, SP徐庶 and友徐庶."
              ],
              "official_rule_text": "结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。",
              "official_panel_hidden": true,
              "source_refs": [
                "mobile-xushu",
                "bwiki-xushu",
                "xiaomi-xushu"
              ],
              "limited_marker": null,
              "awakening_marker": null
            }
          ],
          "ui_requirements": [
            "无言 locked badge and prevented damage event animation; show zero dealt/taken, never fake伤害回执.",
            "举荐 end-phase optional H/E nonbasic picker then other-role picker; final choice prompt belongs to recipient.",
            "Disable recovery at fullHP; restore option describes 翻回正面并解除连环, not reset英雄. Explain existing delay/marks remain.",
            "All options and source attribution survive resume; no public exposure of rejected unselected hand cards."
          ],
          "rule_expansion_notes": [
            "Same-product FAQ explicitly closes fullHP recovery, recipient-choice ownership, equipment payment and faceup behavior.",
            "Xiaomi Mobile-channel guide plus official-domain Mobile community source close 孟获actual-source exception and restore including chain; no OL rules borrowed.",
            "H9 defines internal flip/chain notification order when restoring both together; resulting source effect is fixed, ordering is host integration."
          ],
          "host_policy_refs": [
            "H0",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "H7",
            "H9",
            "H11"
          ]
        },
        "canonical_proposed_id": "sgs.adapted.base.hero.xu-shu",
        "source_packet_ref": "../specs.json",
        "signature_sha256": "8cc353b5fb3e2c43b41164a1a810e7b60b2244e922b0bc6ebf51b282b30ee832"
      },
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 104,
      "source_alias_records_checked": 7,
      "comparison_basis": "Full104 playable templates plus7 source merge records;444 selected comparisons and6 selected candidate pairs; none equivalent."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-xushu",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-135.html",
        "raw_path": "evidence/mobile-xushu.html",
        "sha256": "b91c7cb4559702c9435c7e893221f31c9e257dff74c7a5e1a65857fd05473eac",
        "current_client_verified": false
      },
      {
        "id": "bwiki-xushu",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E5%BE%90%E5%BA%B6",
        "raw_path": "evidence/bwiki-xushu.html",
        "sha256": "72ae589d7bc02434e2ec1d45dba2f0c2fa8eff475a917844b0618c28dde929e4",
        "current_client_verified": false
      },
      {
        "id": "xiaomi-xushu",
        "tier": "same_product_mobile_channel_community_guide",
        "url": "https://game.xiaomi.com/viewpoint/1127866428_1589250759109_16",
        "raw_path": "evidence/xiaomi-xushu.html",
        "sha256": "0b1dfcb62104f4ecff6a84c822751cd92509494e367294d99380edb89ebf49b8",
        "current_client_verified": false
      },
      {
        "id": "xianhua-xushu",
        "tier": "same_product_official_domain_community_guide",
        "url": "https://xianhua.sanguosha.cn/postDetails?id=11701765",
        "raw_path": "evidence/xianhua-xushu.html",
        "sha256": "34245cdabae6b9b890b294b5bc0e0330fe0e6db8eaeb3ddada6da80487af0a81",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局为江湖初始化。H1–H11明示真实事件回执、原子费用、实际角色性别、重铸语义、全局回合额度、公开快照、跨游戏技能复制及复原无变化UI政策。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "quancong",
    "id": "sgs.adapted.base.hero.quan-cong",
    "source_name": "全琮",
    "suggested_display_name": "全琮",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "吴",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 193,
    "source_refs": [
      "mobile-quancong",
      "bwiki-quancong"
    ],
    "intrinsic_skill_inventory": [
      "邀名"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "sgs.yaoming"
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
        "id": "sgs.yaoming",
        "name": "邀名",
        "type": "optional_once_global_turn_damage_hand_compare",
        "timing": "After owner actually deals damage OR receives damage; after associated dying/rescue settles",
        "quota": "Once per actual GLOBAL role-turn, shared by both damage directions and both options; no per-point repetition",
        "cost": "No own payment",
        "targets": "One living role with handcount strictly greater than owner for discard OR strictly less for draw; strict comparison inherently excludes self",
        "effects": [
          "Option1: owner discards exactly1 HAND card from a role whose current hand count is >owner hand count. Equipment/judge cards cannot be chosen.",
          "Option2: a role whose current hand count is <owner hand count draws exactly1. Equal-count roles qualify for neither branch.",
          "The chosen role need not be a damage participant, ally/enemy, in range, or same faction. Owner chooses target and branch.",
          "A2+ damage event gives one opportunity, not one per point. Accepting consumes this turn allowance before nested move/draw callbacks; subsequent incoming/outgoing damage in same global turn gives no new use.",
          "Declining a prompt or having no legal target does not consume the once-turn allowance; another later damage event in the same turn may offer it.",
          "At next real global turn, including another player or an additional turn, allowance refreshes. New play phase within same turn does not refresh.",
          "HP loss, prevented/zero damage and mere card use do not trigger. Actual damage source/recipient rather than card user determines which role has an opportunity.",
          "Source-less damage received still qualifies; self-damage meets both descriptions but cannot circumvent shared once-turn quota. H10 deduplicates one packet offer."
        ],
        "official_rule_text": "每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-quancong",
          "bwiki-quancong",
          "bwiki-yaoming"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "Show 邀名 unused/used state for current global turn. On trigger show optional branch and eligible hand-count targets; refresh counts before commit.",
      "Discard branch uses private-hand backs/opaque slots, not visible hand identities; selected discarded card becomes public only after committed move.",
      "Draw branch can choose enemies. Equal-count role and self are never valid.",
      "Do not add proactive play button or 蓄力/阴阳 markers from界全琮."
    ],
    "rule_expansion_notes": [
      "Base classic is4HP male吴 and only邀名. Do not borrow3HP,界蓄力,主动邀名,≥/≤ comparisons or全区域弃牌.",
      "Self-damage dual-hook dedup is a host event delivery rule; both source triggers remain bound to same once-turn skill allowance."
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H10"
    ],
    "name": "全琮",
    "display_name": "全琮",
    "skill_name": "邀名",
    "skill_desc": "邀名：每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。",
    "source_character_name": "全琮",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀全琮",
      "quan-cong",
      "quancong",
      "全琮·邀名"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-193.html",
      "https://wiki.biligame.com/msgs/%E5%85%A8%E7%90%AE",
      "https://wiki.biligame.com/msgs/%E9%82%80%E5%90%8D"
    ],
    "source_records": [
      {
        "id": "mobile-quancong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-193.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-193.html",
        "status": 200,
        "bytes": 20421,
        "sha256": "6395241891bad8820524a6057e155b10fc811bdd10280edb5cd3f18a43f78d53",
        "accessed_at": "2026-10-16T00:30:39.782876+00:00",
        "raw_path": "evidence/mobile-quancong.html",
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
                  "name": "邀名",
                  "hidden": false,
                  "rule_text": "每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。",
                  "html_line": 177,
                  "rule_sha256": "03acc7fe6b66be8cc25d1abe14b8388bd2e6152a8712a2fa469917778b167dfe"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null,
          "faction": "吴"
        },
        "limitations": [
          "Undated catalog; does not certify current Mobile client.",
          "All skill panels including hidden panels inspected; official HP/gender numeric field absent."
        ]
      },
      {
        "id": "bwiki-quancong",
        "url": "https://wiki.biligame.com/msgs/%E5%85%A8%E7%90%AE",
        "final_url": "https://wiki.biligame.com/msgs/%E5%85%A8%E7%90%AE",
        "status": 200,
        "bytes": 82651,
        "sha256": "40985f84be2bf651901c21b07e92f59270d1605a7a53fa2b9c440aceb43d2966",
        "accessed_at": "2026-10-16T00:30:37.612489+00:00",
        "raw_path": "evidence/bwiki-quancong.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 35629,
        "modified_at": "2026-01-05T14:20:28Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "吴",
          "initial_hp_explicit": null,
          "selected_section": "经典",
          "hp_html_line": 636,
          "gender_html_line": 627,
          "faction_html_line": 628
        }
      },
      {
        "id": "bwiki-yaoming",
        "url": "https://wiki.biligame.com/msgs/%E9%82%80%E5%90%8D",
        "final_url": "https://wiki.biligame.com/msgs/%E9%82%80%E5%90%8D",
        "status": 200,
        "bytes": 66904,
        "sha256": "a62a734b90f85e1ca78a8ce9dc28115e5a53bed25f1401b225b1257c31aa3a6d",
        "accessed_at": "2026-10-16T00:30:38.084400+00:00",
        "raw_path": "evidence/bwiki-yaoming.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community",
        "product": "三国杀移动版",
        "revision_id": 9354,
        "modified_at": "2022-07-14T04:09:45Z",
        "limitations": [
          "Community evidence, not official/client-certified.",
          "Article revision date does not independently date every transcluded template."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.yaoming",
        "name": "邀名",
        "type": "optional_once_global_turn_damage_hand_compare",
        "timing": "After owner actually deals damage OR receives damage; after associated dying/rescue settles",
        "quota": "Once per actual GLOBAL role-turn, shared by both damage directions and both options; no per-point repetition",
        "cost": "No own payment",
        "targets": "One living role with handcount strictly greater than owner for discard OR strictly less for draw; strict comparison inherently excludes self",
        "effects": [
          "Option1: owner discards exactly1 HAND card from a role whose current hand count is >owner hand count. Equipment/judge cards cannot be chosen.",
          "Option2: a role whose current hand count is <owner hand count draws exactly1. Equal-count roles qualify for neither branch.",
          "The chosen role need not be a damage participant, ally/enemy, in range, or same faction. Owner chooses target and branch.",
          "A2+ damage event gives one opportunity, not one per point. Accepting consumes this turn allowance before nested move/draw callbacks; subsequent incoming/outgoing damage in same global turn gives no new use.",
          "Declining a prompt or having no legal target does not consume the once-turn allowance; another later damage event in the same turn may offer it.",
          "At next real global turn, including another player or an additional turn, allowance refreshes. New play phase within same turn does not refresh.",
          "HP loss, prevented/zero damage and mere card use do not trigger. Actual damage source/recipient rather than card user determines which role has an opportunity.",
          "Source-less damage received still qualifies; self-damage meets both descriptions but cannot circumvent shared once-turn quota. H10 deduplicates one packet offer."
        ],
        "official_rule_text": "每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-quancong",
          "bwiki-quancong",
          "bwiki-yaoming"
        ],
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.yaoming"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.yaoming"
    ],
    "complete_skill_names": [
      "邀名"
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
        "id": "H0",
        "category": "host_initialization",
        "rule": "Start at maxHP unless match config says otherwise; no standalone numeric initialHP claimed from official catalog."
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "Use real physical IDs/location epochs; validate actor, effective skill, phase, cost, target and prompt ownership immediately before commit. Cancel/stale precommit input has no cost/quota/event. Atomic payment occurs once and remains paid after nested losses; no rollback after commit."
      },
      {
        "id": "H2",
        "category": "host_resolution_lifecycle",
        "rule": "On death/match termination skip impossible recipients and stop unsafe continuation. Death/loss skill before activation blocks it; already-paid synchronous skill effect is separate from future skill availability. This does not settle unresolved source-delayed skills such as笔伐."
      },
      {
        "id": "H3",
        "category": "host_event_order",
        "rule": "Use existing deterministic action-order convention for same-window owners and multi-recipient draw; record each effect receipt. Do not invent simultaneous unlogged hand mutation or repeated events on replay."
      },
      {
        "id": "H4",
        "category": "host_finite_deck",
        "rule": "Use normal draw API/reshuffle. If truly exhausted draw only available cards and record requested vs actual; no fabricated cards and no infinite retry."
      },
      {
        "id": "H5",
        "category": "cross_game_card_identity",
        "rule": "Native Mobile Slash family covers normal/fire/thunder. For host血杀/毒杀/刺杀 use existing full Slash-family classification explicitly as host extension. Recast requires a real hand card; use-only conversion skills do not make arbitrary cards recastable. No native Mobile claim for foreign identities."
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "Copy/disable through effective-hero descriptor and stable actor identity. Full two-branch skills copy together. Do not copy source heroHP/faction/gender automatically; use effective gameplay-gender contract. Losing/reacquiring skill does not refresh same actor/global-turn or same phase receipt."
      },
      {
        "id": "H7",
        "category": "host_privacy_and_replay",
        "rule": "Stable opaque hand slots, immutable public reveal snapshots, and exactly-once receipts survive checkpoint/replay. Local cancel/AI policy never changes legal target sets or mandatory effects."
      },
      {
        "id": "H8",
        "category": "host_noop_and_foreign_colors",
        "rule": "For秉壹 empty hand X0, no draw possible; suppress no-op reveal UI. For host-only no-color physical materials require uniform actual color; do not treat no-color as black. Native catalog selected cards are ordinarily red/black. Reveal snapshot bounds X; fresh cards stay hidden."
      },
      {
        "id": "H9",
        "category": "host_state_notifications",
        "rule": "举荐复原 sets face-up and unchained, without unrelated reset; use existing normal state change dispatch, deterministic flip-then-chain order if both change, each exactly once. Internal notification order not Mobile-client-certified."
      },
      {
        "id": "H10",
        "category": "host_duplicate_hook_delivery",
        "rule": "邀名 uses one damage event identity plus actor/globalTurnId; self-damage source+target hook delivery represents one shared opportunity, not two opportunities to re-prompt a declined same packet. Native once-turn limit still applies independently."
      },
      {
        "id": "H11",
        "category": "host_noop_choice_ui",
        "rule": "The local recipient UI may omit a no-change restore option when already face-up and unchained. This is a host presentation choice, not a sourced native prohibition. Core restore remains idempotent and, if a restore request is accepted, emits no fake flip/chain event and changes nothing else. Do not reject it by falsely citing an original-game rule; draw2 and wounded-only recover1 remain the other source effects."
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-further/quan-cong.svg",
    "gender_provenance": {
      "source": "bwiki-quancong",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "source": "bwiki-quancong",
      "metadata": {
        "max_hp": 4,
        "hp_icon_count": 4,
        "hp_numeric": 4,
        "gender": "male",
        "faction": "吴",
        "initial_hp_explicit": null,
        "selected_section": "经典",
        "hp_html_line": 636,
        "gender_html_line": 627,
        "faction_html_line": 628
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "source_faction": "吴",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0"
      },
      {
        "field": "current_client",
        "status": "unverified"
      },
      {
        "field": "cross-game identity, event ordering, death interruption, finite deck, copy and replay",
        "status": "shared_host",
        "host_policy": "H1-H11"
      }
    ],
    "source_equivalence": {
      "signature_sha256": "c205822c27591f5b96b99b8bf3ccbec0c3f67a2fee9f34b925438a6867d8f6a2",
      "signature": {
        "id": "candidate.quancong",
        "name": "全琮",
        "max_hp": 4,
        "gender": "male",
        "source_faction": "吴",
        "skills": [
          {
            "id": "sgs.yaoming",
            "name": "邀名",
            "timing": "After owner actually deals damage OR receives damage; after associated dying/rescue settles",
            "cost": "No own payment",
            "targets": "One living role with handcount strictly greater than owner for discard OR strictly less for draw; strict comparison inherently excludes self",
            "limit": "Once per actual GLOBAL role-turn, shared by both damage directions and both options; no per-point repetition",
            "effect": [
              "Option1: owner discards exactly1 HAND card from a role whose current hand count is >owner hand count. Equipment/judge cards cannot be chosen.",
              "Option2: a role whose current hand count is <owner hand count draws exactly1. Equal-count roles qualify for neither branch.",
              "The chosen role need not be a damage participant, ally/enemy, in range, or same faction. Owner chooses target and branch.",
              "A2+ damage event gives one opportunity, not one per point. Accepting consumes this turn allowance before nested move/draw callbacks; subsequent incoming/outgoing damage in same global turn gives no new use.",
              "Declining a prompt or having no legal target does not consume the once-turn allowance; another later damage event in the same turn may offer it.",
              "At next real global turn, including another player or an additional turn, allowance refreshes. New play phase within same turn does not refresh.",
              "HP loss, prevented/zero damage and mere card use do not trigger. Actual damage source/recipient rather than card user determines which role has an opportunity.",
              "Source-less damage received still qualifies; self-damage meets both descriptions but cannot circumvent shared once-turn quota. H10 deduplicates one packet offer."
            ],
            "intrinsic_questions": []
          }
        ],
        "admission_group": "selected_source_candidate",
        "source_verification_status": "Complete source specification supplied by parent verifier and read verbatim; this task verifies existing-code comparison, not public source authenticity.",
        "starting_hp": {
          "direct_source_value": null,
          "host_normal_initialization_if_admitted": 4
        },
        "personal_lord_skills": {
          "inventory": [],
          "source_complete_verified_by_parent": true
        },
        "granted_or_acquired_intrinsic_skills": {
          "granted": [],
          "acquired": [],
          "source_complete_verified_by_parent": true
        },
        "verified_parent_source_spec": {
          "key": "quancong",
          "id": "sgs.adapted.base.hero.quan-cong",
          "source_name": "全琮",
          "suggested_display_name": "全琮",
          "max_hp": 4,
          "gender": "male",
          "source_faction": "吴",
          "starting_hp": 4,
          "starting_hp_direct_source_value": null,
          "starting_hp_basis": "H0 host initialization; not separately sourced numeric initial HP",
          "product": "三国杀移动版",
          "variant": "mobile-base-identity-catalog-2026-10-15",
          "official_page_id": 193,
          "source_refs": [
            "mobile-quancong",
            "bwiki-quancong"
          ],
          "intrinsic_skill_inventory": [
            "邀名"
          ],
          "personal_lord_skills": [],
          "granted_skill_inventory": [],
          "acquired_skill_inventory": [],
          "skill_ids": [
            "sgs.yaoming"
          ],
          "all_intrinsic_panels_verified": true,
          "current_client_rules_verified": false,
          "current_client_hp_verified": false,
          "source_inventory_ready": true,
          "implementation_status": "research_only",
          "readiness": "source_ready_with_explicit_host_requirements",
          "intrinsic_unresolved": [],
          "skills": [
            {
              "id": "sgs.yaoming",
              "name": "邀名",
              "type": "optional_once_global_turn_damage_hand_compare",
              "timing": "After owner actually deals damage OR receives damage; after associated dying/rescue settles",
              "quota": "Once per actual GLOBAL role-turn, shared by both damage directions and both options; no per-point repetition",
              "cost": "No own payment",
              "targets": "One living role with handcount strictly greater than owner for discard OR strictly less for draw; strict comparison inherently excludes self",
              "effects": [
                "Option1: owner discards exactly1 HAND card from a role whose current hand count is >owner hand count. Equipment/judge cards cannot be chosen.",
                "Option2: a role whose current hand count is <owner hand count draws exactly1. Equal-count roles qualify for neither branch.",
                "The chosen role need not be a damage participant, ally/enemy, in range, or same faction. Owner chooses target and branch.",
                "A2+ damage event gives one opportunity, not one per point. Accepting consumes this turn allowance before nested move/draw callbacks; subsequent incoming/outgoing damage in same global turn gives no new use.",
                "Declining a prompt or having no legal target does not consume the once-turn allowance; another later damage event in the same turn may offer it.",
                "At next real global turn, including another player or an additional turn, allowance refreshes. New play phase within same turn does not refresh.",
                "HP loss, prevented/zero damage and mere card use do not trigger. Actual damage source/recipient rather than card user determines which role has an opportunity.",
                "Source-less damage received still qualifies; self-damage meets both descriptions but cannot circumvent shared once-turn quota. H10 deduplicates one packet offer."
              ],
              "official_rule_text": "每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。",
              "official_panel_hidden": false,
              "source_refs": [
                "mobile-quancong",
                "bwiki-quancong",
                "bwiki-yaoming"
              ],
              "limited_marker": null,
              "awakening_marker": null
            }
          ],
          "ui_requirements": [
            "Show 邀名 unused/used state for current global turn. On trigger show optional branch and eligible hand-count targets; refresh counts before commit.",
            "Discard branch uses private-hand backs/opaque slots, not visible hand identities; selected discarded card becomes public only after committed move.",
            "Draw branch can choose enemies. Equal-count role and self are never valid.",
            "Do not add proactive play button or 蓄力/阴阳 markers from界全琮."
          ],
          "rule_expansion_notes": [
            "Base classic is4HP male吴 and only邀名. Do not borrow3HP,界蓄力,主动邀名,≥/≤ comparisons or全区域弃牌.",
            "Self-damage dual-hook dedup is a host event delivery rule; both source triggers remain bound to same once-turn skill allowance."
          ],
          "host_policy_refs": [
            "H0",
            "H1",
            "H2",
            "H3",
            "H4",
            "H5",
            "H6",
            "H7",
            "H10"
          ]
        },
        "canonical_proposed_id": "sgs.adapted.base.hero.quan-cong",
        "source_packet_ref": "../specs.json",
        "signature_sha256": "c205822c27591f5b96b99b8bf3ccbec0c3f67a2fee9f34b925438a6867d8f6a2"
      },
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 104,
      "source_alias_records_checked": 7,
      "comparison_basis": "Full104 playable templates plus7 source merge records;444 selected comparisons and6 selected candidate pairs; none equivalent."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-quancong",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-193.html",
        "raw_path": "evidence/mobile-quancong.html",
        "sha256": "6395241891bad8820524a6057e155b10fc811bdd10280edb5cd3f18a43f78d53",
        "current_client_verified": false
      },
      {
        "id": "bwiki-quancong",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E5%85%A8%E7%90%AE",
        "raw_path": "evidence/bwiki-quancong.html",
        "sha256": "40985f84be2bf651901c21b07e92f59270d1605a7a53fa2b9c440aceb43d2966",
        "current_client_verified": false
      },
      {
        "id": "bwiki-yaoming",
        "tier": "same_product_community",
        "url": "https://wiki.biligame.com/msgs/%E9%82%80%E5%90%8D",
        "raw_path": "evidence/bwiki-yaoming.html",
        "sha256": "a62a734b90f85e1ca78a8ce9dc28115e5a53bed25f1401b225b1257c31aa3a6d",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局为江湖初始化。H1–H11明示真实事件回执、原子费用、实际角色性别、重铸语义、全局回合额度、公开快照、跨游戏技能复制及复原无变化UI政策。当前客户端与完整身份模式未核验。"
  }
];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_YIJIANG_FURTHER_DEFINITIONS=freeze(definitions);
