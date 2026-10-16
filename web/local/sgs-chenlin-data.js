/** Complete historical Mobile identity. Native lifecycle/current client remain unverified. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_CHENLIN_HERO_ID="sgs.adapted.base.hero.chen-lin";
export const SGS_CHENLIN_SKILL_IDS=freeze({bifa:"sgs.bifa",songci:"sgs.songci"});
export const SGS_CHENLIN_DEFINITION=freeze({
  "key": "chenlin",
  "id": "sgs.adapted.base.hero.chen-lin",
  "source_name": "陈琳",
  "suggested_display_name": "陈琳",
  "max_hp": 3,
  "gender": "male",
  "source_faction": "魏",
  "starting_hp": 3,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "P0 host initialization",
  "product": "三国杀移动版",
  "variant": "mobile-classic-identity-historical-turn-start-bifa-host-lifecycle-selected-2026-10-15",
  "official_page_id": 75,
  "source_refs": [
    "mobile-chenlin",
    "bwiki-chenlin-readable"
  ],
  "intrinsic_skill_inventory": [
    "笔伐",
    "颂词"
  ],
  "personal_lord_skills": [],
  "granted_skill_inventory": [],
  "acquired_skill_inventory": [],
  "skill_ids": [
    "sgs.bifa",
    "sgs.songci"
  ],
  "all_intrinsic_panels_verified": true,
  "current_client_rules_verified": false,
  "current_client_hp_verified": false,
  "source_inventory_ready": true,
  "implementation_status": "tested",
  "readiness": "complete_historical_core_with_explicit_native_unverified_host_lifecycle",
  "skills": [
    {
      "id": "sgs.bifa",
      "name": "笔伐",
      "type": "optional_end_hand_to_hidden_pile_delayed_category_trade_or_hp_loss",
      "timing": "One optional owner actual END phase placement; settle at target next true TURN START (selected historical catalog)",
      "quota": "Once per actual END-phase event; one existing Bifa card maximum per target across all holders",
      "cost": "Place exactly1 owner HAND card facedown into target separate Bifa pile",
      "targets": "Exactly1 OTHER living actor with no Bifa card; no team/range condition",
      "effects": [
        "At owner END optionally privately store1H beside chosen other target. It leaves hand; not a target hand card, equipment or delayed trick.",
        "At later target true turn start, target privately views the exact stored card and chooses give source1 own HAND card of same basic/trick/equipment category then obtain stored card, or remove stored card then lose1HP.",
        "Gift choice belongs to target. Same category may different card name/suit; pending card cannot itself pay; equipped equipment cannot pay but equipment CARD in hand can.",
        "Decline or no legal hand payment follows remove+HP-loss branch. No damage/source armor/prevention/after-damage triggers.",
        "Exact source/target/pile physical IDs and hidden visibility persist; lifecycle uses explicit native-unverified HR15. Native boundary remains unverified even after host implementation passes."
      ],
      "official_rule_text": "结束阶段，你可以将一张手牌扣置于没有“笔伐”牌的一名其他角色武将牌旁，然后该角色的回合开始时，其观看“笔伐”牌并选择一项：1.交给你一张类别相同的手牌，并获得此牌；2.移去此牌，然后失去1点体力。",
      "official_panel_hidden": false,
      "source_refs": [
        "mobile-chenlin",
        "bwiki-chenlin-readable",
        "bwiki-bifa-search"
      ],
      "limited_marker": null,
      "awakening_marker": null,
      "policy_refs": [
        "P0",
        "P1",
        "P6",
        "P14",
        "HR15",
        "P16",
        "P18"
      ]
    },
    {
      "id": "sgs.songci",
      "name": "颂词",
      "type": "repeatable_play_target_lifetime_hand_hp_draw_or_discard",
      "timing": "Owner own actual PLAY phase",
      "quota": "Once PER TARGET for entire game/owner; no total once/phase cap, no turn refresh",
      "cost": "No owner card/HP cost",
      "targets": "Any living actor including SELF whose HAND count differs from CURRENT HP and not already used by this owner",
      "effects": [
        "If target H<currentHP: target draws2. If H>currentHP: target chooses/discards2 ordinary H/E. H==HP not legal.",
        "Only hand count used for comparison; equipped cards do not raise comparison count, maxHP/lostHP not used.",
        "Distinct eligible targets may be selected in same PLAY; both outcome branches share same per-target lifetime mark.",
        "No equal-case bonus, all-target completion reward, phase/round reset or additional Pindi skill."
      ],
      "official_rule_text": "出牌阶段，你可以选择一项：1.令一名手牌数小于其体力值的角色摸两张牌；2.令一名手牌数大于其体力值的角色弃置两张牌。每名角色限一次。",
      "official_panel_hidden": true,
      "source_refs": [
        "mobile-chenlin",
        "bwiki-chenlin-readable",
        "mobile-chenlin-guide-2020"
      ],
      "limited_marker": null,
      "awakening_marker": null,
      "policy_refs": [
        "P0",
        "P1",
        "P6",
        "P17",
        "P18"
      ]
    }
  ],
  "intrinsic_unresolved": [],
  "ui_requirements": [
    "END prompt ownH and other targets without pending Bifa; face-down pile public count/source only.",
    "On target turn start only target sees stored card and same-category payment options; public logs do not leak pre-view faces.",
    "Songci shows each target H/currentHP and spent lifetime mark; self legal; equality unavailable.",
    "Show historical turn-start source-version badge and current-client unverified status."
  ],
  "ai_policy": [
    "Bifa selects based only on own card category, public hand counts and known visible context; never reads opponent private hand categories.",
    "Target AI may inspect own hand and the now-legally-viewed stored card.",
    "Songci typically draws for allies/self and discards enemies; human legal alternatives must remain."
  ],
  "excluded_variants": [
    "Current community preparation-phase Bifa excluded from selected historical packet.",
    "No群 faction imported from other products; official and same-product classic say魏.",
    "No神陈琳, other prefixed hero or Songci all-target bonus."
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
      "field": "native_historical_lifecycle",
      "status": "unverified_compatibility_contract_not_original_rules_proof",
      "host_policy_refs": [
        "P14",
        "HR15",
        "P17"
      ]
    }
  ],
  "ready_for_implementation_with_disclosed_host_contract": true,
  "source_ready": true,
  "mode": "身份",
  "derived_card_inventory": [],
  "core_rules_source_complete": true,
  "native_lifecycle_certified": false,
  "snapshot_historical_state_certified": false,
  "native_unverified_edges": [
    {
      "id": "U3",
      "field": "Face-down skipped turn versus historical true turn start",
      "compatibility_policy": "P14"
    },
    {
      "id": "U4",
      "field": "Source death, target death, skill loss/invalidation/transformation, already committed transaction",
      "compatibility_policy": "HR15"
    },
    {
      "id": "U5",
      "field": "Songci ledger after skill loss/copy/revival",
      "compatibility_policy": "P17"
    },
    {
      "id": "U6",
      "field": "Relative order versus mixed-game turn-start hooks",
      "compatibility_policy": "HR17"
    }
  ],
  "rule_expansion_notes": [
    "Original historical Mobile catalog turn-start Bifa selected; current same-product wiki preparation timing remains excluded, not silently reconciled.",
    "Host lifecycle choices do not change printed placement HAND cost, settlement same-category HAND payment, other-target/no-existing-pile constraint, timing, or lifetime Songci quota.",
    "Source coverage must separately record core historical source implementation and native-unverified compatibility. No current client certification or playable increment is claimed."
  ],
  "host_policy_refs": [
    "P0",
    "P1",
    "P6",
    "P14",
    "P16",
    "P17",
    "P18",
    "HR15",
    "HR16",
    "HR17"
  ],
  "name": "陈琳",
  "display_name": "陈琳",
  "skill_name": "笔伐/颂词",
  "skill_desc": "笔伐：结束阶段可将一张手牌扣置于无笔伐牌的其他角色旁；其下个真实回合开始时，可交给你一张同类别手牌并获得此牌，否则移去此牌并失去1点体力。颂词：出牌阶段，令手牌少于当前体力的角色摸两张，或多于体力的角色弃两张手牌/装备；每名角色每位来源整局限一次。",
  "source_game": "三国杀",
  "source_label": "三国杀",
  "source_product": "sanguosha_mobile_cn",
  "source_character_name": "陈琳",
  "source_status": "verified",
  "runtime_validation_status": "module-and-real-host-tests-passed",
  "source_coverage": false,
  "source_core_rules_implemented": true,
  "host_lifecycle_policy": "HR15",
  "host_lifecycle_tested": true,
  "native_lifecycle_verified": false,
  "current_client_verified": false,
  "faction": "魏",
  "source_variant": "mobile-classic-identity-historical-turn-start-bifa-host-lifecycle-selected-2026-10-15",
  "source_version": "历史移动版身份目录回合开始笔伐；当前客户端未认证",
  "snapshot_date": "2026-10-15",
  "aliases": [
    "三国杀陈琳",
    "chen-lin",
    "chenlin"
  ],
  "source_id_aliases": [],
  "personal_lord_skill_ids": [],
  "granted_skill_ids": [],
  "acquired_skill_ids": [],
  "source_skill_rules": [
    {
      "id": "sgs.bifa",
      "name": "笔伐",
      "type": "optional_end_hand_to_hidden_pile_delayed_category_trade_or_hp_loss",
      "timing": "One optional owner actual END phase placement; settle at target next true TURN START (selected historical catalog)",
      "quota": "Once per actual END-phase event; one existing Bifa card maximum per target across all holders",
      "cost": "Place exactly1 owner HAND card facedown into target separate Bifa pile",
      "targets": "Exactly1 OTHER living actor with no Bifa card; no team/range condition",
      "effects": [
        "At owner END optionally privately store1H beside chosen other target. It leaves hand; not a target hand card, equipment or delayed trick.",
        "At later target true turn start, target privately views the exact stored card and chooses give source1 own HAND card of same basic/trick/equipment category then obtain stored card, or remove stored card then lose1HP.",
        "Gift choice belongs to target. Same category may different card name/suit; pending card cannot itself pay; equipped equipment cannot pay but equipment CARD in hand can.",
        "Decline or no legal hand payment follows remove+HP-loss branch. No damage/source armor/prevention/after-damage triggers.",
        "Exact source/target/pile physical IDs and hidden visibility persist; lifecycle uses explicit native-unverified HR15. Native boundary remains unverified even after host implementation passes."
      ],
      "official_rule_text": "结束阶段，你可以将一张手牌扣置于没有“笔伐”牌的一名其他角色武将牌旁，然后该角色的回合开始时，其观看“笔伐”牌并选择一项：1.交给你一张类别相同的手牌，并获得此牌；2.移去此牌，然后失去1点体力。",
      "official_panel_hidden": false,
      "source_refs": [
        "mobile-chenlin",
        "bwiki-chenlin-readable",
        "bwiki-bifa-search"
      ],
      "limited_marker": null,
      "awakening_marker": null,
      "policy_refs": [
        "P0",
        "P1",
        "P6",
        "P14",
        "HR15",
        "P16",
        "P18"
      ]
    },
    {
      "id": "sgs.songci",
      "name": "颂词",
      "type": "repeatable_play_target_lifetime_hand_hp_draw_or_discard",
      "timing": "Owner own actual PLAY phase",
      "quota": "Once PER TARGET for entire game/owner; no total once/phase cap, no turn refresh",
      "cost": "No owner card/HP cost",
      "targets": "Any living actor including SELF whose HAND count differs from CURRENT HP and not already used by this owner",
      "effects": [
        "If target H<currentHP: target draws2. If H>currentHP: target chooses/discards2 ordinary H/E. H==HP not legal.",
        "Only hand count used for comparison; equipped cards do not raise comparison count, maxHP/lostHP not used.",
        "Distinct eligible targets may be selected in same PLAY; both outcome branches share same per-target lifetime mark.",
        "No equal-case bonus, all-target completion reward, phase/round reset or additional Pindi skill."
      ],
      "official_rule_text": "出牌阶段，你可以选择一项：1.令一名手牌数小于其体力值的角色摸两张牌；2.令一名手牌数大于其体力值的角色弃置两张牌。每名角色限一次。",
      "official_panel_hidden": true,
      "source_refs": [
        "mobile-chenlin",
        "bwiki-chenlin-readable",
        "mobile-chenlin-guide-2020"
      ],
      "limited_marker": null,
      "awakening_marker": null,
      "policy_refs": [
        "P0",
        "P1",
        "P6",
        "P17",
        "P18"
      ]
    }
  ],
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-75.html",
    "https://wiki.biligame.com/msgs/%E9%99%88%E7%90%B3"
  ],
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
      "id": "P6",
      "scope": "shared_host",
      "contract": "Unqualified own discard/give uses hand or equipment, not judgment/skill piles. Discard another role one card uses H/E/J with blind hand choice. Category projection is basic/trick/equipment; imported card categories explicitly mapped."
    },
    {
      "id": "P14",
      "scope": "selected_historical_rule_parent_confirmed",
      "contract": "Bifa uses saved official historical TRUE TURN START timing, not current wiki preparation text. In this host scheduled face-down whole-turn skip is processed BEFORE true on_turn_begin, so skipped scheduled turns do not settle Bifa. Native historical face-down interaction was not independently sourced; do not claim the timing words alone prove otherwise.",
      "approval_status": "parent_confirmed_2026-10-16T00:03Z"
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
    },
    {
      "id": "HR15",
      "scope": "native_unverified_compatibility",
      "approved_by_parent_at": "2026-10-16T03:10:25Z",
      "native_verified": false,
      "contract": [
        "Placed Bifa is an independent physical obligation. A living source losing/invalidation of Bifa or transforming does not cancel it. Restoring the skill cannot duplicate or refresh that obligation.",
        "Source death cancels all its not-yet-committed Bifa obligations: move each still-present physical card to discard with lifecycle_cleanup reason, do not impose HP loss, and tombstone each obligation. Mere private viewing or an open prompt is not commitment.",
        "Target death cancels every obligation attached to that target, moves still-present physical cards to discard with lifecycle_cleanup reason, and starts no choice or HP loss. The same rule applies whether source death also occurs in the same nested event.",
        "Settlement begins at atomic BRANCH_COMMITTED receipt after the target answer, source/target liveness, current exact card positions and category eligibility are revalidated. The receipt is durable before any nested movement hook. REVEALED/AWAITING_CHOICE alone is still uncommitted.",
        "For TRADE, atomically move the selected target HAND payment to the living source HAND and the Bifa card to the living target HAND, recording both moves and branch completion before running either movement loss/gain hook. Causal semantic order is payment then acquisition. A nested death after commit does not refund, repeat, redirect or cancel either committed move; ordinary death cleanup may subsequently discard cards now held by the deceased.",
        "For REFUSE/UNABLE, atomically remove the still-present Bifa card to discard and commit a one-HP-loss obligation for the target before nested movement hooks. Source death after this receipt does not cancel already committed HP loss. Target death before HP application stops new HP loss on a corpse; the card never returns. This narrow active-transaction distinction must be explicit in UI/logs and tests.",
        "Competing cleanup is idempotent by obligation ID plus physical-card epoch. A stale source-death cleanup cannot remove a card that has already entered a target hand via a completed trade. Multiple source copies each own separate source IDs; cleaning one source never clears another source obligation. One pending card maximum per target remains global.",
        "On terminal match end stop new decisions/effects and retain conservation-consistent terminal receipts; no callbacks run after completion. Save/replay stores all branch/cleanup receipts, views and pending decision identity without exposing hidden cards to opponents."
      ]
    },
    {
      "id": "HR16",
      "scope": "native_unverified_cross_game_movement_failure",
      "native_verified": false,
      "contract": "Ordinary H/E equipment protections do not apply to Bifa special-pile cleanup. If an external all-zone movement prohibition genuinely prevents committing a Bifa removal/transfer, do not fabricate a payment or impose uncommitted HP loss; reject the stale choice and recompute legal choices. If no complete branch is committable, leave the physical pending card and retry at the next real target turn start. Death cleanup still uses the formal lifecycle cleanup path with exact entity conservation. This is an explicitly foreign-host fallback, not an original Mobile rule."
    },
    {
      "id": "HR17",
      "scope": "native_unverified_cross_game_turn_start_order",
      "native_verified": false,
      "contract": "At the host true turn-start event, run existing actor on_turn_begin hooks, then the independent Bifa obligation dispatcher, before entering prepare. Recheck source/target death and match termination after each step. This tie-order choice preserves the selected historical turn-start timing but is a Jianghu compatibility order, not a Mobile-native simultaneous-trigger certification. The dispatcher is game-scoped and must run even if neither current target nor living source currently owns Bifa."
    }
  ],
  "adaptation_notes": "历史目录回合开始版；P14先处理整回合翻面跳过，HR17在既有回合开始钩子后结算。HR15独立笔伐义务：活着的来源失技不取消；来源死亡且尚未提交分支时清牌无扣血；两腿交易原子提交；拒绝提交后来源死亡不取消已承诺失去体力。P17颂词按来源/目标终身记账。原生边界与当前客户端均未认证。"
});
export const SGS_CHENLIN_DEFINITIONS=Object.freeze([SGS_CHENLIN_DEFINITION]);
