/** Complete selected identity packet. No public roster or coverage admission occurs here. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_YUEJIN_HERO_ID="sgs.adapted.base.hero.yue-jin";
export const SGS_YUEJIN_SKILL_IDS=freeze({xiaoguo:"sgs.xiaoguo"});
export const SGS_YUEJIN_DEFINITION=freeze({
  "key": "yuejin",
  "id": "sgs.adapted.base.hero.yue-jin",
  "source_name": "乐进",
  "display_name_proposal": "乐进",
  "product": "三国杀移动版",
  "mode": "身份",
  "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "official_page_id": 82,
  "catalog_record_id": "sgs-mobile:hero-page:82",
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "FH0 explicit host initialization",
  "gender": "male",
  "source_faction": "魏",
  "intrinsic_skill_inventory": [
    "骁果"
  ],
  "skill_ids": [
    "sgs.xiaoguo"
  ],
  "personal_lord_skills": [],
  "granted_skill_inventory": [],
  "acquired_skill_inventory": [],
  "derived_card_inventory": [],
  "all_official_inline_panels_read": true,
  "full_selected_intrinsic_inventory_verified": true,
  "current_client_rules_verified": false,
  "current_client_hp_verified": false,
  "snapshot_historical_state_certified": false,
  "source_ready": true,
  "ready_for_implementation_with_disclosed_host_contract": true,
  "implementation_status": "tested",
  "skills": [
    {
      "skill_id": "sgs.xiaoguo",
      "name": "骁果",
      "kind": "optional_other_end_phase_basic_discard_choice",
      "timing": "At start of each OTHER living character actual end phase, after its discard phase",
      "quota": "One optional trigger per holder per other-player end-phase event, no once-per-round cap",
      "cost": "Owner may discard exactly one legal basic card from hand. Use discard-context identity, no use-only conversion; no equipment/trick/special-pile cost",
      "targets": "That end-phase owner only; any team/faction, no distance, no requirement target has hand/equipment",
      "effects": [
        "After the basic-card cost actually commits, the end-phase owner chooses between discarding one equipment card or suffering one damage from the holder.",
        "Equipment is a card family, not just an occupied slot: a legal hand-held or currently equipped equipment may pay. Judgment/special piles are not payment zones.",
        "If equipment is successfully discarded, Yue Jin draws exactly one card. The target does not draw; Yue Jin does not obtain the discarded equipment.",
        "If the target declines or has no payable equipment, deal exactly one normal-nature independent SKILL damage with Yue Jin as source. It is not HP loss or a virtual Slash.",
        "Dodge/Nullification and Slash-specific target restrictions are not responses to this skill; no attack-distance check. Generic prevention/reduction and dying/rescue still apply.",
        "Do not attach the discarded basic/equipment as damage materials. Damage-source theft such as Jianxiong cannot obtain the cost as a damage card.",
        "All loss/equipment-leave effects process through real card movement, then the selected branch completes once. Paid movement blocked by vehicle retention is not equipment-discard success.",
        "Declining activation spends nothing; after paying the basic cost, not having a convenient target reply does not refund the cost. Target may choose damage even when equipment can be discarded.",
        "Face-down Yue Jin can still invoke at others end phases. Skipping another player end phase/whole turn yields no trigger; additional end phase is a distinct event."
      ],
      "derived_interpretations": [
        "2020-04-16 official-hosted mobile guide supplies explicit phase-start timing and independently documents draw1 on equipment payment.",
        "Hand/equipment payment follows unspecified-zone discard + equipment-family semantics; equipped payment independently corroborated by guide discussion of Sun Shangxiang/Ling Tong loss synergies.",
        "Player guide armor shorthand is not adopted as a universal ignore-all-armor flag."
      ],
      "source_refs": [
        "official-yuejin",
        "bwiki-yuejin",
        "official-yuejin-guide-2020"
      ],
      "original_evidence": {
        "source_id": "official-yuejin",
        "html_path": "evidence/official-yuejin.html",
        "html_line": 181,
        "original_text": "其他角色的结束阶段，你可以弃置一张基本牌，然后该角色选择一项：1.弃置一张装备牌，你摸一张牌；2.受到你造成的1点伤害。",
        "text_sha256": "bf5e3bec32e0b86e12a7ae9ced174cbed1d0c72ae14bd5e991891226978cdb50",
        "hidden_panel": false
      }
    }
  ],
  "source_refs": [
    "official-yuejin",
    "bwiki-yuejin"
  ],
  "version_and_scope_notes": [
    "Select classic identity variant with draw1 when equipment is discarded; it is documented in 2020 guide and matches official identity tab.",
    "Official page also has a hidden Guozhan group with same present text. All groups were read but Guozhan history/reveal/partner rules are excluded. Wiki old Guozhan omits draw1; never substitute it.",
    "4HP male Wei; no lord/acquired/granted skills."
  ],
  "intrinsic_unresolved": [],
  "host_policy_refs": [
    "FH0",
    "FH1",
    "FH2",
    "FH3",
    "FH4",
    "FH5",
    "FH6",
    "FH7",
    "FH8",
    "FH9",
    "FH10"
  ],
  "name": "乐进",
  "display_name": "乐进",
  "skill_name": "骁果",
  "skill_desc": "其他角色的结束阶段开始时，可弃一张基本手牌；该角色自行弃一张手牌或装备区的装备牌，令你摸一张牌，或受到你造成的1点普通技能伤害。",
  "source_character_name": "乐进",
  "source_label": "三国杀",
  "source_game": "三国杀",
  "source_status": "verified",
  "source_coverage": false,
  "runtime_validation_status": "module-tested-local",
  "production_integration_status": "independent-module-not-publicly-admitted",
  "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "snapshot_date": "2026-10-15",
  "source_date": "2026-10-15",
  "faction": "魏",
  "aliases": [
    "三国杀乐进",
    "yue-jin",
    "yuejin",
    "骁果"
  ],
  "source_id_aliases": [],
  "personal_lord_skill_ids": [],
  "granted_skill_ids": [],
  "acquired_skill_ids": [],
  "source_urls": [
    "https://www.sanguosha.cn/pc/guide-info-3.html",
    "https://www.sanguosha.cn/pc/hero-detail-82.html",
    "https://wiki.biligame.com/msgs/%E4%B9%90%E8%BF%9B"
  ],
  "source_records": [
    {
      "id": "official-yuejin-guide-2020",
      "url": "https://www.sanguosha.cn/pc/guide-info-3.html",
      "captured_at": "2026-10-16T02:48:23.626107+00:00",
      "status": 200,
      "final_url": "https://www.sanguosha.cn/pc/guide-info-3.html",
      "bytes": 22847,
      "sha256": "117ad38a1a9c652c3671151fea03c2e85b8023f2a52c758743b5afffc84486fa",
      "raw_path": "evidence/official-yuejin-guide-2020.html",
      "selection_snapshot_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": "2020-04-16",
      "limitations": [
        "Read on 2026-10-16; retrieval is not a certified 2026-10-15 archive or an authenticated current-client inspection.",
        "Raw HTML is private audit evidence; no official artwork bytes downloaded, no redistribution as game assets."
      ],
      "tier": "official_hosted_same_product_historical_player_guide",
      "product": "三国杀移动版",
      "used_for_selected_rules": true,
      "selected_claims": [
        "Xiaoguo opens at start of other player end phase.",
        "Equipment-discard branch explicitly lets Yue Jin draw 1; same identity wording existed in 2020.",
        "Range does not gate Xiaoguo; Dodge and Slash-specific defense do not answer independent skill damage.",
        "Equipped-card loss can interact with Sun Shangxiang/Ling Tong."
      ],
      "excluded_claims": [
        "Claims of usually only three activations/one target per round are tactical estimates, never hard quotas.",
        "Broad not affected by armor is tactical shorthand; it does not authorize bypassing generic damage prevention, armor caps or reductions."
      ],
      "rule_html_line": 216
    },
    {
      "id": "official-yuejin",
      "url": "https://www.sanguosha.cn/pc/hero-detail-82.html",
      "captured_at": "2026-10-16T02:45:14.023487+00:00",
      "status": 200,
      "final_url": "https://www.sanguosha.cn/pc/hero-detail-82.html",
      "bytes": 21674,
      "sha256": "f9d8b5a90277fef64f97e69311fd04cc42512c9fe6fa990e548a0d3936cd6079",
      "raw_path": "evidence/official-yuejin.html",
      "selection_snapshot_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "limitations": [
        "Read on 2026-10-16; retrieval is not a certified 2026-10-15 archive or an authenticated current-client inspection.",
        "Raw HTML is private audit evidence; no official artwork bytes downloaded, no redistribution as game assets."
      ],
      "tier": "official_same_product_identity_catalog",
      "product": "三国杀移动版",
      "used_for_selected_rules": true,
      "hero": "yuejin",
      "audit": {
        "all_inline_hidden_panels_read": true,
        "all_mode_groups_read": true,
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
                "name": "骁果",
                "hidden": false,
                "original_text": "其他角色的结束阶段，你可以弃置一张基本牌，然后该角色选择一项：1.弃置一张装备牌，你摸一张牌；2.受到你造成的1点伤害。",
                "html_line": 181,
                "text_sha256": "bf5e3bec32e0b86e12a7ae9ced174cbed1d0c72ae14bd5e991891226978cdb50"
              }
            ]
          },
          {
            "mode": "国战",
            "group_hidden": true,
            "panels": [
              {
                "name": "骁果",
                "hidden": false,
                "original_text": "其他角色的结束阶段，你可以弃置一张基本牌，然后该角色选择一项：1.弃置一张装备牌，你摸一张牌；2.受到你造成的1点伤害。",
                "html_line": 181,
                "text_sha256": "bf5e3bec32e0b86e12a7ae9ced174cbed1d0c72ae14bd5e991891226978cdb50"
              }
            ]
          }
        ],
        "selected_mode": "身份",
        "selected_group_index": 0,
        "selected_intrinsic_inventory": [
          "骁果"
        ]
      },
      "metadata": {
        "faction": "魏",
        "faction_basis": "official hero heading",
        "max_hp_explicit_field": null,
        "gender_explicit_field": null,
        "starting_hp_explicit_field": null
      }
    },
    {
      "id": "bwiki-yuejin",
      "url": "https://wiki.biligame.com/msgs/%E4%B9%90%E8%BF%9B",
      "captured_at": "2026-10-16T02:45:14.028388+00:00",
      "status": 200,
      "final_url": "https://wiki.biligame.com/msgs/%E4%B9%90%E8%BF%9B",
      "bytes": 93961,
      "sha256": "5e7bd0158fac97fd4ef43bc78aeec34da8e62c746715a0cb93dd158e852f03e5",
      "raw_path": "evidence/bwiki-yuejin.html",
      "selection_snapshot_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "limitations": [
        "Read on 2026-10-16; retrieval is not a certified 2026-10-15 archive or an authenticated current-client inspection.",
        "Raw HTML is private audit evidence; no official artwork bytes downloaded, no redistribution as game assets.",
        "Community evidence, not an official rules ruling. Page revision predating selection is not proof of client version."
      ],
      "tier": "same_product_community_wiki",
      "product": "三国杀移动版",
      "used_for_selected_rules": true,
      "hero": "yuejin",
      "revision_id": 33699,
      "metadata": {
        "selected_section": "经典",
        "max_hp": 4,
        "hp_icon_count": 4,
        "hidden_numeric_hp": 4,
        "gender": "male",
        "faction": "魏",
        "hp_html_line": 632,
        "gender_html_line": 627,
        "faction_html_line": 628,
        "starting_hp_explicit": null
      },
      "selected_claims": [
        "Explicit classic max HP and gender; selected skill inventory cross-check."
      ],
      "excluded_sections": [
        "国战",
        "1V1",
        "historical versions",
        "skin speech",
        "automatically included final card when not classic"
      ],
      "excluded_claims": [
        "Old Guozhan Xiaoguo with no draw; do not splice into selected identity."
      ]
    }
  ],
  "source_skill_rules": [
    {
      "skill_id": "sgs.xiaoguo",
      "name": "骁果",
      "kind": "optional_other_end_phase_basic_discard_choice",
      "timing": "At start of each OTHER living character actual end phase, after its discard phase",
      "quota": "One optional trigger per holder per other-player end-phase event, no once-per-round cap",
      "cost": "Owner may discard exactly one legal basic card from hand. Use discard-context identity, no use-only conversion; no equipment/trick/special-pile cost",
      "targets": "That end-phase owner only; any team/faction, no distance, no requirement target has hand/equipment",
      "effects": [
        "After the basic-card cost actually commits, the end-phase owner chooses between discarding one equipment card or suffering one damage from the holder.",
        "Equipment is a card family, not just an occupied slot: a legal hand-held or currently equipped equipment may pay. Judgment/special piles are not payment zones.",
        "If equipment is successfully discarded, Yue Jin draws exactly one card. The target does not draw; Yue Jin does not obtain the discarded equipment.",
        "If the target declines or has no payable equipment, deal exactly one normal-nature independent SKILL damage with Yue Jin as source. It is not HP loss or a virtual Slash.",
        "Dodge/Nullification and Slash-specific target restrictions are not responses to this skill; no attack-distance check. Generic prevention/reduction and dying/rescue still apply.",
        "Do not attach the discarded basic/equipment as damage materials. Damage-source theft such as Jianxiong cannot obtain the cost as a damage card.",
        "All loss/equipment-leave effects process through real card movement, then the selected branch completes once. Paid movement blocked by vehicle retention is not equipment-discard success.",
        "Declining activation spends nothing; after paying the basic cost, not having a convenient target reply does not refund the cost. Target may choose damage even when equipment can be discarded.",
        "Face-down Yue Jin can still invoke at others end phases. Skipping another player end phase/whole turn yields no trigger; additional end phase is a distinct event."
      ],
      "derived_interpretations": [
        "2020-04-16 official-hosted mobile guide supplies explicit phase-start timing and independently documents draw1 on equipment payment.",
        "Hand/equipment payment follows unspecified-zone discard + equipment-family semantics; equipped payment independently corroborated by guide discussion of Sun Shangxiang/Ling Tong loss synergies.",
        "Player guide armor shorthand is not adopted as a universal ignore-all-armor flag."
      ],
      "source_refs": [
        "official-yuejin",
        "bwiki-yuejin",
        "official-yuejin-guide-2020"
      ],
      "original_evidence": {
        "source_id": "official-yuejin",
        "html_path": "evidence/official-yuejin.html",
        "html_line": 181,
        "original_text": "其他角色的结束阶段，你可以弃置一张基本牌，然后该角色选择一项：1.弃置一张装备牌，你摸一张牌；2.受到你造成的1点伤害。",
        "text_sha256": "bf5e3bec32e0b86e12a7ae9ced174cbed1d0c72ae14bd5e991891226978cdb50",
        "hidden_panel": false
      }
    }
  ],
  "host_compatibility_policies": [
    {
      "id": "FH0",
      "kind": "cross_game_host_compatibility",
      "rule": "Template HP is the explicit classic metadata, not a lord bonus. Normal Jianghu initialization begins at template max HP; starting HP is not a separately sourced original field. Save original faction/gender separately from team, role and mutable runtime max HP."
    },
    {
      "id": "FH1",
      "kind": "cross_game_host_compatibility",
      "rule": "Use contextual functional identity: use-only/response-only conversion never changes a discard, count or transfer classification. Cost card categories are basic/trick/equipment; delayed and nondelayed tricks share trick family. Only physically present cards count in equipped-zone counts even if effects are suppressed. Special piles and judgment area are not owner hand/equipment payment zones."
    },
    {
      "id": "FH2",
      "kind": "cross_game_host_compatibility",
      "rule": "Exact once per actual event, using stable owner, skill-binding, turn, phase/card-use/damage identifiers. Pure legal-option probes never allocate state or consume RNG. Repeated UI answers and replay cannot pay, draw, attack or prevent again. Stale decision input is rejected and recomputed before commitment; cancellation before commitment costs nothing."
    },
    {
      "id": "FH3",
      "kind": "cross_game_host_compatibility",
      "rule": "Move real cards through the atomic public card movement path. Commit receipts before nested loss/leave hooks. Pay only if the selected physical entity actually moves as required. Prevented movement (including protected derived vehicles) is not successful cost. Do not fabricate card copies or fill an empty deck; normal draw/shuffle rules apply."
    },
    {
      "id": "FH4",
      "kind": "cross_game_host_compatibility",
      "rule": "A real phase has its own phase_event_id. Skipped phases and skipped face-down turns create no skill window; face-down holders may still act at another player end phase. A replacement of normal draw suppresses normal draw-count modifiers. Extra phases create new events; extra play phases alone do not create prepare/draw/end windows."
    },
    {
      "id": "FH5",
      "kind": "cross_game_host_compatibility",
      "rule": "No new decision by a dead holder; terminate on actual match end. For mixed-game nested loss/death interactions, committed costs remain paid. Yue Jin who dies during his cost cannot start a new independent damage or draw action; if target successfully discarded equipment then dies during its leave triggers, a surviving Yue Jin still completes his already-committed draw. This is a disclosed Jianghu lifecycle choice, not a native mobile ruling."
    },
    {
      "id": "FH6",
      "kind": "cross_game_host_compatibility",
      "rule": "Sun Ru zero-material ordinary Slash is a real virtual card USE with no suit/color/rank/material entity. It has no distance or play-phase quota cost, but still respects target/use prohibitions, equipment transformations and ordinary response, target, damage and card-use histories. No phase is skipped. Existing physical last-hand bonuses cannot be inferred from having zero hand."
    },
    {
      "id": "FH7",
      "kind": "cross_game_host_compatibility",
      "rule": "Shixin is a locked receive-side prevention for the current final receiver on positive fire damage, including chain-transferred or sourceless damage. Implement before consuming receiver armor/derived-vehicle durability and before HP loss/dying/damage history/chain unchaining. Source-side already committed costs are not refunded. Mixed-game ordering versus optional damage-transfer skills is explicit host policy: mandatory fire immunity of the current receiver precedes its optional transfer; re-evaluate immunity when a transfer changes receiver. This is not an official mobile cross-game ordering ruling."
    },
    {
      "id": "FH8",
      "kind": "cross_game_host_compatibility",
      "rule": "Effective skills and binding identity govern ownership, copies, disability, loss and regain. Copying does not copy another player receipts or refresh already-used same-event opportunities; complete intrinsic inventory including locked Shixin is required. Sun Ru is female, Ling Cao/Yue Jin male, preserved for existing gender-sensitive skills. No dependence on display name."
    },
    {
      "id": "FH9",
      "kind": "cross_game_host_compatibility",
      "rule": "Persist public receipts and pending decisions with schema/content migration and deterministic replay. Never silently load an unfinished callback as completed. UI/AI see only public counts and their own private cards; selected disclosed cost or transfer becomes public only at the correct movement/show step."
    },
    {
      "id": "FH10",
      "kind": "cross_game_host_compatibility",
      "rule": "The selected units are classic identity templates only; common mode rules are external. No Guozhan partners/reveal rules, 1v1 mode or OL ceil-Dujin included. Original portraits/icons must be newly authored; preserved original names, skill names and source links do not grant permission to ship official art or raw research HTML."
    }
  ],
  "adaptation_notes": "经典移动版身份乐进；装备弃置后乐进摸1。历史官方攻略及当前目录实取，不认证当前客户端或2026-10-15历史页面快照。死亡与嵌套失牌采用FH5宿主约定。",
  "source_identity_context": {
    "selected_product": "三国杀移动版",
    "selected_mode": "身份",
    "selected_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "catalog_record_id": "sgs-mobile:hero-page:82",
    "selected_skill_inventory": [
      "骁果"
    ],
    "source_read_date": "2026-10-16",
    "selection_date": "2026-10-15",
    "current_client_verified": false,
    "snapshot_historical_state_certified": false,
    "excluded_variants": [
      "old Guozhan without draw1",
      "OL and other modes"
    ],
    "host_policy_ids": [
      "FH0",
      "FH1",
      "FH2",
      "FH3",
      "FH4",
      "FH5",
      "FH6",
      "FH7",
      "FH8",
      "FH9",
      "FH10"
    ]
  },
  "complete_mechanism_signature": {
    "max_hp": 4,
    "gender": "male",
    "source_faction": "魏",
    "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "skills": [
      {
        "skill_id": "sgs.xiaoguo",
        "name": "骁果",
        "kind": "optional_other_end_phase_basic_discard_choice",
        "timing": "At start of each OTHER living character actual end phase, after its discard phase",
        "quota": "One optional trigger per holder per other-player end-phase event, no once-per-round cap",
        "cost": "Owner may discard exactly one legal basic card from hand. Use discard-context identity, no use-only conversion; no equipment/trick/special-pile cost",
        "targets": "That end-phase owner only; any team/faction, no distance, no requirement target has hand/equipment",
        "effects": [
          "After the basic-card cost actually commits, the end-phase owner chooses between discarding one equipment card or suffering one damage from the holder.",
          "Equipment is a card family, not just an occupied slot: a legal hand-held or currently equipped equipment may pay. Judgment/special piles are not payment zones.",
          "If equipment is successfully discarded, Yue Jin draws exactly one card. The target does not draw; Yue Jin does not obtain the discarded equipment.",
          "If the target declines or has no payable equipment, deal exactly one normal-nature independent SKILL damage with Yue Jin as source. It is not HP loss or a virtual Slash.",
          "Dodge/Nullification and Slash-specific target restrictions are not responses to this skill; no attack-distance check. Generic prevention/reduction and dying/rescue still apply.",
          "Do not attach the discarded basic/equipment as damage materials. Damage-source theft such as Jianxiong cannot obtain the cost as a damage card.",
          "All loss/equipment-leave effects process through real card movement, then the selected branch completes once. Paid movement blocked by vehicle retention is not equipment-discard success.",
          "Declining activation spends nothing; after paying the basic cost, not having a convenient target reply does not refund the cost. Target may choose damage even when equipment can be discarded.",
          "Face-down Yue Jin can still invoke at others end phases. Skipping another player end phase/whole turn yields no trigger; additional end phase is a distinct event."
        ],
        "derived_interpretations": [
          "2020-04-16 official-hosted mobile guide supplies explicit phase-start timing and independently documents draw1 on equipment payment.",
          "Hand/equipment payment follows unspecified-zone discard + equipment-family semantics; equipped payment independently corroborated by guide discussion of Sun Shangxiang/Ling Tong loss synergies.",
          "Player guide armor shorthand is not adopted as a universal ignore-all-armor flag."
        ],
        "source_refs": [
          "official-yuejin",
          "bwiki-yuejin",
          "official-yuejin-guide-2020"
        ],
        "original_evidence": {
          "source_id": "official-yuejin",
          "html_path": "evidence/official-yuejin.html",
          "html_line": 181,
          "original_text": "其他角色的结束阶段，你可以弃置一张基本牌，然后该角色选择一项：1.弃置一张装备牌，你摸一张牌；2.受到你造成的1点伤害。",
          "text_sha256": "bf5e3bec32e0b86e12a7ae9ced174cbed1d0c72ae14bd5e991891226978cdb50",
          "hidden_panel": false
        }
      }
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": []
  },
  "complete_mechanism_signature_sha256": "2124bc21c482c766f10e53b301355cf85631d2fa938e2e711eb8aa86ef124378"
});
export const SGS_YUEJIN_DEFINITIONS=freeze([SGS_YUEJIN_DEFINITION]);
