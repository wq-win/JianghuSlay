/** Complete documented intrinsic packets; current-client and whole-mode certification remain pending. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.lu-su",
    "source_name": "鲁肃",
    "suggested_display_name": "鲁肃",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·林",
    "snapshot_date": "2026-10-15",
    "source_faction": "吴",
    "max_hp": 3,
    "starting_hp": 3,
    "gender": "male",
    "metadata_provenance": {
      "hp_gender": "bwiki-lusu",
      "faction": "mobile-lusu",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 33820,
      "revision_timestamp_utc": "2025-10-24T01:14:51Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_refs": [
      "mobile-lusu",
      "bwiki-lusu"
    ],
    "intrinsic_skill_inventory": [
      "好施",
      "缔盟"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "every identity skill panel read; none labeled 主公技",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "mode_status": {
      "intrinsic_rules": "ready_for_implementation_with_labeled_policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "personal_lord_dependency": false,
      "small_seat_adaptation": "Preserve complete skills. LuSu Dimeng naturally unavailable with fewer than two other living actors; never rewrite to self-exchange."
    },
    "skills": [
      {
        "id": "haoshi",
        "name": "好施",
        "type": "optional_draw_modifier_then_mandatory_transfer",
        "timing": "own normal draw-phase draw, decide before drawing",
        "quota": "one opportunity for this draw operation; no turn-long active action",
        "cost": null,
        "trigger_gate": "normal draw operation exists; not phase skipped/replaced",
        "effect": [
          "If accepted add2 to normal draw quantity.",
          "After drawing, if owner H<=5 nothing else. If H>5, owner must give floor(H/2) chosen hand cards to exactly one other living actor whose H count is minimum among other actors.",
          "Tied minimum recipients are selectable; recipient may be enemy; equipped cards do not count or transfer."
        ],
        "source_refs": [
          "mobile-lusu",
          "bwiki-lusu",
          "fandom-lusu"
        ],
        "policy_refs": [
          "F1",
          "F4"
        ],
        "ui": "Show accept/pass before cards revealed; after activation, forced exact N hand multi-select plus minimum-hand eligible recipient. Show count and why recipients excluded."
      },
      {
        "id": "dimeng",
        "name": "缔盟",
        "type": "optional_active_exchange",
        "timing": "own play phase",
        "quota": "once per actual play phase",
        "cost": "discard exactly abs(H(A)-H(B)) own legal cards; H/E procedural contract F1",
        "targets": "two distinct other living actors; neither is LuSu; no distance/faction/gender restriction",
        "effect": [
          "Pay cost, then exchange all their hands. Zero hand or equal counts is legal under selected identity text; equal count gives cost0.",
          "Targets cannot refuse. Hands stay private, equipment and judgment cards never exchanged.",
          "Needs at least two other actors; with only one other actor the complete skill is present but has no legal target pair."
        ],
        "source_refs": [
          "mobile-lusu",
          "bwiki-lusu",
          "ol-lusu-guide",
          "fandom-lusu"
        ],
        "policy_refs": [
          "F1",
          "F2",
          "F3"
        ],
        "ui": "Choose exactly two other actors and display absolute difference; exact H/E cost picker including0 confirmation; never reveal unknown enemy hand faces."
      }
    ],
    "ui_requirements": [
      "Show source product, base identity variant, original name, HP, gender and source faction",
      "All intrinsic skills visible with timing, optional/locked, costs, quota, targets and complete effect",
      "No official art redistribution; use original readable portraits/icons, accessible text alternatives",
      "Decision dialogs support cancel only before commitment; mobile layout, controller/AI parity, snapshot reload and replay consistency"
    ],
    "excluded_variants": [
      "国战双将/半体力",
      "界鲁肃",
      "神鲁肃",
      "势鲁肃",
      "其他OL或桌游改版"
    ],
    "name": "鲁肃",
    "display_name": "鲁肃",
    "skill_name": "好施 / 缔盟",
    "skill_desc": "好施：正常摸牌时可额外摸2，摸后手牌多于5须将一半交给手牌最少的其他一人。缔盟：每出牌阶段1次，弃置两名其他角色手牌差数量的手牌/装备，令二人交换全部手牌。",
    "complete_skill_names": [
      "好施",
      "缔盟"
    ],
    "skill_ids": [
      "sgs.haoshi",
      "sgs.dimeng"
    ],
    "source_skill_rules": [
      {
        "id": "haoshi",
        "name": "好施",
        "type": "optional_draw_modifier_then_mandatory_transfer",
        "timing": "own normal draw-phase draw, decide before drawing",
        "quota": "one opportunity for this draw operation; no turn-long active action",
        "cost": null,
        "trigger_gate": "normal draw operation exists; not phase skipped/replaced",
        "effect": [
          "If accepted add2 to normal draw quantity.",
          "After drawing, if owner H<=5 nothing else. If H>5, owner must give floor(H/2) chosen hand cards to exactly one other living actor whose H count is minimum among other actors.",
          "Tied minimum recipients are selectable; recipient may be enemy; equipped cards do not count or transfer."
        ],
        "source_refs": [
          "mobile-lusu",
          "bwiki-lusu",
          "fandom-lusu"
        ],
        "policy_refs": [
          "F1",
          "F4"
        ],
        "ui": "Show accept/pass before cards revealed; after activation, forced exact N hand multi-select plus minimum-hand eligible recipient. Show count and why recipients excluded."
      },
      {
        "id": "dimeng",
        "name": "缔盟",
        "type": "optional_active_exchange",
        "timing": "own play phase",
        "quota": "once per actual play phase",
        "cost": "discard exactly abs(H(A)-H(B)) own legal cards; H/E procedural contract F1",
        "targets": "two distinct other living actors; neither is LuSu; no distance/faction/gender restriction",
        "effect": [
          "Pay cost, then exchange all their hands. Zero hand or equal counts is legal under selected identity text; equal count gives cost0.",
          "Targets cannot refuse. Hands stay private, equipment and judgment cards never exchanged.",
          "Needs at least two other actors; with only one other actor the complete skill is present but has no legal target pair."
        ],
        "source_refs": [
          "mobile-lusu",
          "bwiki-lusu",
          "ol-lusu-guide",
          "fandom-lusu"
        ],
        "policy_refs": [
          "F1",
          "F2",
          "F3"
        ],
        "ui": "Choose exactly two other actors and display absolute difference; exact H/E cost picker including0 confirmation; never reveal unknown enemy hand faces."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "鲁肃",
    "source_variant": "基础身份／神话再临·林+明示F1–F10江湖适配",
    "source_date": "2026-10-15目录快照；历史规则及有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-49.html",
      "https://wiki.biligame.com/msgs/鲁肃",
      "https://sanguosha.fandom.com/zh/wiki/鲁肃?variant=zh",
      "https://www.sanguosha.com/news/20140528_6674_0611"
    ],
    "source_ids": [
      "mobile-lusu",
      "bwiki-lusu",
      "fandom-lusu",
      "ol-lusu-guide"
    ],
    "source_record_id": "sgs.adapted.base.hero.lu-su:2026-10-15",
    "faction": "吴",
    "gender_provenance": {
      "hp_gender": "bwiki-lusu",
      "faction": "mobile-lusu",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 33820,
      "revision_timestamp_utc": "2025-10-24T01:14:51Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-lusu",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-49.html",
        "publication_date": null
      },
      {
        "id": "bwiki-lusu",
        "tier": "community_same_product_matching_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/鲁肃"
      },
      {
        "id": "fandom-lusu",
        "tier": "community_cross_product_historical_faq",
        "url": "https://sanguosha.fandom.com/zh/wiki/鲁肃?variant=zh",
        "publication_date": null
      },
      {
        "id": "ol-lusu-guide",
        "tier": "official_cross_product_historical_community_authored_guide",
        "url": "https://www.sanguosha.com/news/20140528_6674_0611",
        "publication_date": "2014-05-28 11:00:00"
      }
    ],
    "source_evidence_note": "移动官网身份技能逐项核验；血量/性别由对应手游社区基础变体字段与OL资料交叉。当前客户端未实测。",
    "source_unknowns": [
      "Current mobile identity death-source timing beyond public core",
      "Atomic exchange trigger scheduler and interruptions",
      "Multiple copied Huoshou/Juxiang holders",
      "Cross-game transforms, BaoSi costs versus true virtual subcards, poison during costs",
      "Client playable-version HP and skills not observed in authenticated client"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-lusu"
      ],
      "current_mobile_client_verified": false,
      "display_note": "体力依据：移动版社区基础变体，标注修订时间；OL只作跨产品佐证，未实测当前移动客户端。"
    },
    "aliases": [
      "三国杀鲁肃",
      "鲁肃·好施·缔盟",
      "lu-su"
    ],
    "portrait_path": "./portraits-sgs-forest/lu-su.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F1",
        "title": "General event and zone contract",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "All four skills use live living-seat targets, independent of team. H means hand, E equipped, J judgment. Discard own unspecified cards uses H/E, never J. Obtain another player unspecified card uses H/E unless text explicitly allows J; hidden H selection remains blind. Existing owner zone-leave, gain, poison and equipment events must run once per physical move. No invented extra hand-only cost or target-enemy filter.",
        "evidence_basis": "Historical FAQ supports Dimeng H/E and Lieren H/E. Dated4399 OL2019 same-text Yinghun FAQ supports H/E notJ, discard shortfall and single-batch discard, without discarding later Lianying gains again. These are cross-product corroboration, not verified current-mobile clauses. Cross-game interactions are host composition."
      },
      {
        "id": "F2",
        "title": "Resolution-time values and costs",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lock Yinghun X and chosen option at activation before target draw; target chooses own legal discard after draw. Lock Dimeng X=absolute hand-count difference during legal declaration; require exactly X discardable H/E cards, permit X=0. Reject invalid/stale selections without spending quota. After successful cost, resolve losses and their nested effects, then swap current hands. Do not pay a different price after nested draws. If a participant dies before swap, cancel the swap, preserve paid cost/quota. If LuSu dies after committing the cost while both exchange participants remain alive and the match continues, finish the already-committed exchange; do not create another skill use. This continuation is explicit host policy, not verified mobile behavior.",
        "evidence_basis": "Official text establishes order, not all nested interruption semantics. This particular nested-cost/swap policy is proposed, not claimed native."
      },
      {
        "id": "F3",
        "title": "Simultaneous private hand exchange",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Dimeng moves the complete current A/B hands as one simultaneous exchange transaction. Snapshot both at exchange start, clear both, assign opposite packets; loss events know each lost all old H, gain events receive only opposite packet. Queue triggered draws after transaction so Lianying gains remain with its owner. Do not expose either old hand to LuSu or spectators, and do not sequence A->B then B->A.",
        "evidence_basis": "OL 2014 official-hosted guide explicitly says simultaneous loss/gain; exact mobile trigger scheduler unverified, so atomic-then-trigger ordering is host proposal."
      },
      {
        "id": "F4",
        "title": "Phase windows and extra phases",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Haoshi decision occurs before normal draw; +2 changes this draw operation rather than forces total4. Complete draw and immediate nested gains, then evaluate H>5 and mandatory half transfer; choose least-H other from current state. No Haoshi if normal draw replaced by Zaiqi/Shuangxiong or entire draw phase skipped. Re-entered genuine phase supplies fresh per-phase opportunity, not repeated UI clicks. Yinghun once at each genuine preparation entry, optional.",
        "evidence_basis": "Official core + cross-product pre-draw FAQ; mixed extra-draw/replacement composition is proposed."
      },
      {
        "id": "F5",
        "title": "Zaiqi reveal handling",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Snapshot missing HP X when replacing the normal draw; reveal exactly X available top cards together into processing, no judgment/retrial. Count printed heart suits of these unowned revealed cards; recover that many as one recovery operation capped at maxHP, discard those heart cards from processing, then obtain remaining cards. Do not treat as draw. Keep all revealed physical IDs protected from reshuffle until resolution; a short deck yields only actual cards.",
        "evidence_basis": "Official identity says reveal, recover count, obtain rest; mobile historical Guozhan guide adds heart cleanup. One recovery operation follows identity wording; cross-game suit transformation/effect replacement remains proposed."
      },
      {
        "id": "F6",
        "title": "AOE semantic mapping",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Map source 南蛮入侵 to existing canonical host 烽火狼烟 with source alias retained, only if entire ordinary card semantics remain all other living seats including same-team AI, each response Kill or normal1damage, per-target nullification. Skill immunity is to that card effect; it is not all damage immunity. Card user, damage source, cause-card-use ID and material ownership must be distinct. No new second physical card entity needed.",
        "evidence_basis": "Source Nanman targets from official card definition; host mapping is explicit cross-game policy, not publisher naming."
      },
      {
        "id": "F7",
        "title": "Huoshou source lifetime",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Set override on this AOE use at target specification, not when each victim is hit. Living MengHuo is source of all later direct and transferred damage from that use; original user stays user for targets/order, use triggers and Juxiang other-user test. If recorded source finally dies during this AOE, later damage is sourceless, not reverted to original user. Newly acquiring Huoshou mid-resolution does not retroactively claim an already-declared AOE.",
        "evidence_basis": "Core timing from mobile; death/source-transfer edge only historical Fandom FAQ. Explicit host policy pending current-mobile confirmation."
      },
      {
        "id": "F8",
        "title": "Juxiang physical material provenance",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "After all targets and nested effects finish, recover only still-unclaimed physical materials of that exact other-player AOE use. Material already gained by Jianxiong/Jiquan is not stolen, cloned, pulled from hands or re-acquired after unrelated later discard. Zero-material virtual use gives no card. YXS BaoSi discards exactly1 card already in her equipment zone as cost, then creates a material-free virtual AOE; that discarded cost card is not a Juxiang material. Her separate Zhiyu skill costs2 hand cards and must not be conflated with Fenghuo. True view-as/borrowed-material AOE returns its tracked materials as original physical cards. No virtual shell enters hand.",
        "evidence_basis": "Mobile historical guide confirms Jianxiong precedence. Official YXS2015 mobile/2012 desktop sources establish BaoSi Fenghuo1E versus Zhiyu2H. Multi-material and cross-game effects are host contract. Do not assume prior discard costs become materials."
      },
      {
        "id": "F9",
        "title": "Damage completion and Lieren compare",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lieren checks each positive direct damage event from a Slash used by its owner, and only the current direct target. Finish dying/rescue and damage triggers before asking if both living actors can compare. After both secretly choose H, lock, reveal, compare strictly higher; tied is not win. Keep compare cards in processing through win reward and nested gains; clean afterward. Multi-point damage gives one offer, not one per HP. Chained/reflected non-target damage does not give offers. No default phase quota.",
        "evidence_basis": "Mobile text says damage to target, not per point; ordinary compare history from previous packet; specific scheduler and transformed cross-game Slash are host contract."
      },
      {
        "id": "F10",
        "title": "Multiple copied skill holders",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "If cross-game copies yield several Huoshou or Juxiang holders, source publisher behavior is unverified. Proposed: at AOE declaration resolve Huoshou in stable action order with last override winning; at completion eligible Juxiang holders resolve in stable action order, first actual successful claim owns remaining materials. Never duplicate physical IDs. Show as explicit compatibility policy or keep this coexistence pending.",
        "evidence_basis": "No native evidence; cross-game-only proposed policy. Do not mislabel as mobile FAQ."
      }
    ],
    "adaptation_notes": "完整身份核心采用逐项来源，F1–F10明确本作事件/跨作毒/重复拥有者等处理；当前客户端及全模式尚未核验。",
    "source_equivalence": {
      "status": "distinct-complete-intrinsic-packet-pending-independent-signature-review",
      "full_packet": [
        "好施",
        "缔盟"
      ],
      "hp": 3
    }
  },
  {
    "id": "sgs.adapted.base.hero.meng-huo",
    "source_name": "孟获",
    "suggested_display_name": "孟获",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·林",
    "snapshot_date": "2026-10-15",
    "source_faction": "蜀",
    "max_hp": 4,
    "starting_hp": 4,
    "gender": "male",
    "metadata_provenance": {
      "hp_gender": "bwiki-menghuo",
      "faction": "mobile-menghuo",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 35245,
      "revision_timestamp_utc": "2025-12-19T08:36:12Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_refs": [
      "mobile-menghuo",
      "bwiki-menghuo"
    ],
    "intrinsic_skill_inventory": [
      "祸首",
      "再起"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "every identity skill panel read; none labeled 主公技",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "mode_status": {
      "intrinsic_rules": "ready_for_implementation_with_labeled_policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "personal_lord_dependency": false,
      "small_seat_adaptation": "Preserve complete skills. LuSu Dimeng naturally unavailable with fewer than two other living actors; never rewrite to self-exchange."
    },
    "skills": [
      {
        "id": "huoshou",
        "name": "祸首",
        "type": "locked_immunity_and_damage_source_override",
        "timing": [
          "continuous immunity to Nanman effect",
          "after another actor uses Nanman and specifies targets"
        ],
        "quota": null,
        "cost": null,
        "effect": [
          "Nanman effect does not affect MengHuo.",
          "Replace damage source for that Nanman use with MengHuo. Do not replace the card user or remove allies from targets.",
          "Feedback/revenge/damage-trigger and kill attribution follow actual damage source. Own Nanman naturally keeps self source."
        ],
        "source_refs": [
          "mobile-menghuo",
          "bwiki-menghuo"
        ],
        "policy_refs": [
          "F6",
          "F7",
          "F10"
        ],
        "mode_dependency": "Identity reward/penalty integration remains mode-pending in a host without identity awards. Do not advertise full identity completion from immunity alone.",
        "ui": "Damage log records original card user and MengHuo source; immunity logs distinct from nullification or armor."
      },
      {
        "id": "zaiqi",
        "name": "再起",
        "type": "optional_draw_replacement",
        "timing": "own normal draw phase",
        "quota": "once for replaced phase draw",
        "cost": "forgo normal phase draw",
        "trigger_gate": "owner currently wounded, draw phase not skipped",
        "effect": [
          "Let X be missing HP. Reveal X top-deck cards, recover equal to the number of hearts, obtain nonheart revealed cards.",
          "Revealed hearts are not gained; move them to discard as corroborated by same-product historical other-mode explanation.",
          "No judgment, no initial normal2draw, no X+1, no choice to keep hearts instead of healing, no discard-phase/red-discard-count effect."
        ],
        "source_refs": [
          "mobile-menghuo",
          "bwiki-menghuo",
          "mobile-guide131"
        ],
        "policy_refs": [
          "F4",
          "F5"
        ],
        "ui": "Accept/pass before reveal; public reveal shows all actual cards, heart recovery and nonheart gains, plus discard destinations."
      }
    ],
    "ui_requirements": [
      "Show source product, base identity variant, original name, HP, gender and source faction",
      "All intrinsic skills visible with timing, optional/locked, costs, quota, targets and complete effect",
      "No official art redistribution; use original readable portraits/icons, accessible text alternatives",
      "Decision dialogs support cancel only before commitment; mobile layout, controller/AI parity, snapshot reload and replay consistency"
    ],
    "excluded_variants": [
      "界孟获弃牌阶段再起",
      "谋孟获蓄力/额外祸首段落",
      "OL X+1再起",
      "专门1V1蛮裔",
      "国战双将/半体力"
    ],
    "name": "孟获",
    "display_name": "孟获",
    "skill_name": "祸首 / 再起",
    "skill_desc": "祸首：免疫烽火狼烟，对其他人使用的烽火造成的伤害担任伤害来源。再起：受伤时可用亮出已损失体力数量牌替代正常摸牌，红桃逐张回复，其余获得。",
    "complete_skill_names": [
      "祸首",
      "再起"
    ],
    "skill_ids": [
      "sgs.huoshou",
      "sgs.zaiqi"
    ],
    "source_skill_rules": [
      {
        "id": "huoshou",
        "name": "祸首",
        "type": "locked_immunity_and_damage_source_override",
        "timing": [
          "continuous immunity to Nanman effect",
          "after another actor uses Nanman and specifies targets"
        ],
        "quota": null,
        "cost": null,
        "effect": [
          "Nanman effect does not affect MengHuo.",
          "Replace damage source for that Nanman use with MengHuo. Do not replace the card user or remove allies from targets.",
          "Feedback/revenge/damage-trigger and kill attribution follow actual damage source. Own Nanman naturally keeps self source."
        ],
        "source_refs": [
          "mobile-menghuo",
          "bwiki-menghuo"
        ],
        "policy_refs": [
          "F6",
          "F7",
          "F10"
        ],
        "mode_dependency": "Identity reward/penalty integration remains mode-pending in a host without identity awards. Do not advertise full identity completion from immunity alone.",
        "ui": "Damage log records original card user and MengHuo source; immunity logs distinct from nullification or armor."
      },
      {
        "id": "zaiqi",
        "name": "再起",
        "type": "optional_draw_replacement",
        "timing": "own normal draw phase",
        "quota": "once for replaced phase draw",
        "cost": "forgo normal phase draw",
        "trigger_gate": "owner currently wounded, draw phase not skipped",
        "effect": [
          "Let X be missing HP. Reveal X top-deck cards, recover equal to the number of hearts, obtain nonheart revealed cards.",
          "Revealed hearts are not gained; move them to discard as corroborated by same-product historical other-mode explanation.",
          "No judgment, no initial normal2draw, no X+1, no choice to keep hearts instead of healing, no discard-phase/red-discard-count effect."
        ],
        "source_refs": [
          "mobile-menghuo",
          "bwiki-menghuo",
          "mobile-guide131"
        ],
        "policy_refs": [
          "F4",
          "F5"
        ],
        "ui": "Accept/pass before reveal; public reveal shows all actual cards, heart recovery and nonheart gains, plus discard destinations."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "孟获",
    "source_variant": "基础身份／神话再临·林+明示F1–F10江湖适配",
    "source_date": "2026-10-15目录快照；历史规则及有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-47.html",
      "https://wiki.biligame.com/msgs/孟获",
      "https://www.sanguosha.cn/pc/guide-info-131.html"
    ],
    "source_ids": [
      "mobile-menghuo",
      "bwiki-menghuo",
      "mobile-guide131"
    ],
    "source_record_id": "sgs.adapted.base.hero.meng-huo:2026-10-15",
    "faction": "蜀",
    "gender_provenance": {
      "hp_gender": "bwiki-menghuo",
      "faction": "mobile-menghuo",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 35245,
      "revision_timestamp_utc": "2025-12-19T08:36:12Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-menghuo",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-47.html",
        "publication_date": null
      },
      {
        "id": "bwiki-menghuo",
        "tier": "community_same_product_matching_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/孟获"
      },
      {
        "id": "mobile-guide131",
        "tier": "official_same_product_historical_other_mode",
        "url": "https://www.sanguosha.cn/pc/guide-info-131.html",
        "publication_date": "2020-07-01 10:34:10"
      }
    ],
    "source_evidence_note": "移动官网身份技能逐项核验；血量/性别由对应手游社区基础变体字段与OL资料交叉。当前客户端未实测。",
    "source_unknowns": [
      "Current mobile identity death-source timing beyond public core",
      "Atomic exchange trigger scheduler and interruptions",
      "Multiple copied Huoshou/Juxiang holders",
      "Cross-game transforms, BaoSi costs versus true virtual subcards, poison during costs",
      "Client playable-version HP and skills not observed in authenticated client"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-menghuo"
      ],
      "current_mobile_client_verified": false,
      "display_note": "体力依据：移动版社区基础变体，标注修订时间；OL只作跨产品佐证，未实测当前移动客户端。"
    },
    "aliases": [
      "三国杀孟获",
      "孟获·祸首·再起",
      "meng-huo"
    ],
    "portrait_path": "./portraits-sgs-forest/meng-huo.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F1",
        "title": "General event and zone contract",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "All four skills use live living-seat targets, independent of team. H means hand, E equipped, J judgment. Discard own unspecified cards uses H/E, never J. Obtain another player unspecified card uses H/E unless text explicitly allows J; hidden H selection remains blind. Existing owner zone-leave, gain, poison and equipment events must run once per physical move. No invented extra hand-only cost or target-enemy filter.",
        "evidence_basis": "Historical FAQ supports Dimeng H/E and Lieren H/E. Dated4399 OL2019 same-text Yinghun FAQ supports H/E notJ, discard shortfall and single-batch discard, without discarding later Lianying gains again. These are cross-product corroboration, not verified current-mobile clauses. Cross-game interactions are host composition."
      },
      {
        "id": "F2",
        "title": "Resolution-time values and costs",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lock Yinghun X and chosen option at activation before target draw; target chooses own legal discard after draw. Lock Dimeng X=absolute hand-count difference during legal declaration; require exactly X discardable H/E cards, permit X=0. Reject invalid/stale selections without spending quota. After successful cost, resolve losses and their nested effects, then swap current hands. Do not pay a different price after nested draws. If a participant dies before swap, cancel the swap, preserve paid cost/quota. If LuSu dies after committing the cost while both exchange participants remain alive and the match continues, finish the already-committed exchange; do not create another skill use. This continuation is explicit host policy, not verified mobile behavior.",
        "evidence_basis": "Official text establishes order, not all nested interruption semantics. This particular nested-cost/swap policy is proposed, not claimed native."
      },
      {
        "id": "F3",
        "title": "Simultaneous private hand exchange",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Dimeng moves the complete current A/B hands as one simultaneous exchange transaction. Snapshot both at exchange start, clear both, assign opposite packets; loss events know each lost all old H, gain events receive only opposite packet. Queue triggered draws after transaction so Lianying gains remain with its owner. Do not expose either old hand to LuSu or spectators, and do not sequence A->B then B->A.",
        "evidence_basis": "OL 2014 official-hosted guide explicitly says simultaneous loss/gain; exact mobile trigger scheduler unverified, so atomic-then-trigger ordering is host proposal."
      },
      {
        "id": "F4",
        "title": "Phase windows and extra phases",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Haoshi decision occurs before normal draw; +2 changes this draw operation rather than forces total4. Complete draw and immediate nested gains, then evaluate H>5 and mandatory half transfer; choose least-H other from current state. No Haoshi if normal draw replaced by Zaiqi/Shuangxiong or entire draw phase skipped. Re-entered genuine phase supplies fresh per-phase opportunity, not repeated UI clicks. Yinghun once at each genuine preparation entry, optional.",
        "evidence_basis": "Official core + cross-product pre-draw FAQ; mixed extra-draw/replacement composition is proposed."
      },
      {
        "id": "F5",
        "title": "Zaiqi reveal handling",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Snapshot missing HP X when replacing the normal draw; reveal exactly X available top cards together into processing, no judgment/retrial. Count printed heart suits of these unowned revealed cards; recover that many as one recovery operation capped at maxHP, discard those heart cards from processing, then obtain remaining cards. Do not treat as draw. Keep all revealed physical IDs protected from reshuffle until resolution; a short deck yields only actual cards.",
        "evidence_basis": "Official identity says reveal, recover count, obtain rest; mobile historical Guozhan guide adds heart cleanup. One recovery operation follows identity wording; cross-game suit transformation/effect replacement remains proposed."
      },
      {
        "id": "F6",
        "title": "AOE semantic mapping",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Map source 南蛮入侵 to existing canonical host 烽火狼烟 with source alias retained, only if entire ordinary card semantics remain all other living seats including same-team AI, each response Kill or normal1damage, per-target nullification. Skill immunity is to that card effect; it is not all damage immunity. Card user, damage source, cause-card-use ID and material ownership must be distinct. No new second physical card entity needed.",
        "evidence_basis": "Source Nanman targets from official card definition; host mapping is explicit cross-game policy, not publisher naming."
      },
      {
        "id": "F7",
        "title": "Huoshou source lifetime",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Set override on this AOE use at target specification, not when each victim is hit. Living MengHuo is source of all later direct and transferred damage from that use; original user stays user for targets/order, use triggers and Juxiang other-user test. If recorded source finally dies during this AOE, later damage is sourceless, not reverted to original user. Newly acquiring Huoshou mid-resolution does not retroactively claim an already-declared AOE.",
        "evidence_basis": "Core timing from mobile; death/source-transfer edge only historical Fandom FAQ. Explicit host policy pending current-mobile confirmation."
      },
      {
        "id": "F8",
        "title": "Juxiang physical material provenance",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "After all targets and nested effects finish, recover only still-unclaimed physical materials of that exact other-player AOE use. Material already gained by Jianxiong/Jiquan is not stolen, cloned, pulled from hands or re-acquired after unrelated later discard. Zero-material virtual use gives no card. YXS BaoSi discards exactly1 card already in her equipment zone as cost, then creates a material-free virtual AOE; that discarded cost card is not a Juxiang material. Her separate Zhiyu skill costs2 hand cards and must not be conflated with Fenghuo. True view-as/borrowed-material AOE returns its tracked materials as original physical cards. No virtual shell enters hand.",
        "evidence_basis": "Mobile historical guide confirms Jianxiong precedence. Official YXS2015 mobile/2012 desktop sources establish BaoSi Fenghuo1E versus Zhiyu2H. Multi-material and cross-game effects are host contract. Do not assume prior discard costs become materials."
      },
      {
        "id": "F9",
        "title": "Damage completion and Lieren compare",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lieren checks each positive direct damage event from a Slash used by its owner, and only the current direct target. Finish dying/rescue and damage triggers before asking if both living actors can compare. After both secretly choose H, lock, reveal, compare strictly higher; tied is not win. Keep compare cards in processing through win reward and nested gains; clean afterward. Multi-point damage gives one offer, not one per HP. Chained/reflected non-target damage does not give offers. No default phase quota.",
        "evidence_basis": "Mobile text says damage to target, not per point; ordinary compare history from previous packet; specific scheduler and transformed cross-game Slash are host contract."
      },
      {
        "id": "F10",
        "title": "Multiple copied skill holders",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "If cross-game copies yield several Huoshou or Juxiang holders, source publisher behavior is unverified. Proposed: at AOE declaration resolve Huoshou in stable action order with last override winning; at completion eligible Juxiang holders resolve in stable action order, first actual successful claim owns remaining materials. Never duplicate physical IDs. Show as explicit compatibility policy or keep this coexistence pending.",
        "evidence_basis": "No native evidence; cross-game-only proposed policy. Do not mislabel as mobile FAQ."
      }
    ],
    "adaptation_notes": "完整身份核心采用逐项来源，F1–F10明确本作事件/跨作毒/重复拥有者等处理；当前客户端及全模式尚未核验。",
    "source_equivalence": {
      "status": "distinct-complete-intrinsic-packet-pending-independent-signature-review",
      "full_packet": [
        "祸首",
        "再起"
      ],
      "hp": 4
    }
  },
  {
    "id": "sgs.adapted.base.hero.zhu-rong",
    "source_name": "祝融",
    "suggested_display_name": "祝融",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·林",
    "snapshot_date": "2026-10-15",
    "source_faction": "蜀",
    "max_hp": 4,
    "starting_hp": 4,
    "gender": "female",
    "metadata_provenance": {
      "hp_gender": "bwiki-zhurong",
      "faction": "mobile-zhurong",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 39023,
      "revision_timestamp_utc": "2026-06-11T13:58:14Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_refs": [
      "mobile-zhurong",
      "bwiki-zhurong"
    ],
    "intrinsic_skill_inventory": [
      "巨象",
      "烈刃"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "every identity skill panel read; none labeled 主公技",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "mode_status": {
      "intrinsic_rules": "ready_for_implementation_with_labeled_policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "personal_lord_dependency": false,
      "small_seat_adaptation": "Preserve complete skills. LuSu Dimeng naturally unavailable with fewer than two other living actors; never rewrite to self-exchange."
    },
    "skills": [
      {
        "id": "juxiang",
        "name": "巨象",
        "type": "locked_immunity_and_card_recovery",
        "timing": [
          "continuous Nanman effect immunity",
          "completion of entire other-actor Nanman use"
        ],
        "quota": null,
        "cost": null,
        "effect": [
          "Nanman effect does not affect ZhuRong.",
          "When another actor’s Nanman finishes resolving, gain that card if its actual materials are still eligible. Own-used Nanman is not recovered.",
          "Wait for all targets rather than gaining immediately on own immunity or first victim. Prior Jianxiong gain prevents later Juxiang claim."
        ],
        "source_refs": [
          "mobile-zhurong",
          "bwiki-zhurong",
          "mobile-guide137"
        ],
        "policy_refs": [
          "F6",
          "F8",
          "F10"
        ],
        "ui": "Automatic immunity/recovery; log actual material origin and why nothing recovered for no-material/self-used/already claimed cards."
      },
      {
        "id": "lieren",
        "name": "烈刃",
        "type": "optional_after_damage_compare_then_gain",
        "timing": "after owner-used Slash deals positive damage to its target",
        "quota": "no printed per-phase/per-turn cap; once per qualifying damage event",
        "cost": "each actor commits one hand card for comparison; not equipment or judgment",
        "targets": "the damaged direct target only, if comparison legal",
        "effect": [
          "Optionally compare points with that target. Win strictly higher => obtain one of target’s cards. Not win, including tie => no gain and no special exchange of comparison cards.",
          "Both must have a hand card when the compare begins; after compare target may have no eligible H/E card, in which case no reward.",
          "One 2-point damage event means one compare opportunity. New qualifying Slash damage gives another."
        ],
        "source_refs": [
          "mobile-zhurong",
          "bwiki-zhurong",
          "mobile-guide137"
        ],
        "policy_refs": [
          "F1",
          "F9"
        ],
        "ui": "Offer pass/compare after complete damage/rescue; each participant chooses hidden H, reveal together; winner blind H or visible E selection; do not expose full enemy H."
      }
    ],
    "ui_requirements": [
      "Show source product, base identity variant, original name, HP, gender and source faction",
      "All intrinsic skills visible with timing, optional/locked, costs, quota, targets and complete effect",
      "No official art redistribution; use original readable portraits/icons, accessible text alternatives",
      "Decision dialogs support cancel only before commitment; mobile layout, controller/AI parity, snapshot reload and replay consistency"
    ],
    "excluded_variants": [
      "界祝融指定目标后拼点及未赢换拼点牌",
      "谋祝融唯一目标/后续伤害/场外南蛮",
      "国战双将/半体力"
    ],
    "name": "祝融",
    "display_name": "祝融",
    "skill_name": "巨象 / 烈刃",
    "skill_desc": "巨象：免疫烽火狼烟，其他人使用的该牌整张结算后可获得未被别人取得的实体素材。烈刃：杀对目标造成伤害后可与其拼点，赢则获得其一张手牌或装备。",
    "complete_skill_names": [
      "巨象",
      "烈刃"
    ],
    "skill_ids": [
      "sgs.juxiang",
      "sgs.lieren"
    ],
    "source_skill_rules": [
      {
        "id": "juxiang",
        "name": "巨象",
        "type": "locked_immunity_and_card_recovery",
        "timing": [
          "continuous Nanman effect immunity",
          "completion of entire other-actor Nanman use"
        ],
        "quota": null,
        "cost": null,
        "effect": [
          "Nanman effect does not affect ZhuRong.",
          "When another actor’s Nanman finishes resolving, gain that card if its actual materials are still eligible. Own-used Nanman is not recovered.",
          "Wait for all targets rather than gaining immediately on own immunity or first victim. Prior Jianxiong gain prevents later Juxiang claim."
        ],
        "source_refs": [
          "mobile-zhurong",
          "bwiki-zhurong",
          "mobile-guide137"
        ],
        "policy_refs": [
          "F6",
          "F8",
          "F10"
        ],
        "ui": "Automatic immunity/recovery; log actual material origin and why nothing recovered for no-material/self-used/already claimed cards."
      },
      {
        "id": "lieren",
        "name": "烈刃",
        "type": "optional_after_damage_compare_then_gain",
        "timing": "after owner-used Slash deals positive damage to its target",
        "quota": "no printed per-phase/per-turn cap; once per qualifying damage event",
        "cost": "each actor commits one hand card for comparison; not equipment or judgment",
        "targets": "the damaged direct target only, if comparison legal",
        "effect": [
          "Optionally compare points with that target. Win strictly higher => obtain one of target’s cards. Not win, including tie => no gain and no special exchange of comparison cards.",
          "Both must have a hand card when the compare begins; after compare target may have no eligible H/E card, in which case no reward.",
          "One 2-point damage event means one compare opportunity. New qualifying Slash damage gives another."
        ],
        "source_refs": [
          "mobile-zhurong",
          "bwiki-zhurong",
          "mobile-guide137"
        ],
        "policy_refs": [
          "F1",
          "F9"
        ],
        "ui": "Offer pass/compare after complete damage/rescue; each participant chooses hidden H, reveal together; winner blind H or visible E selection; do not expose full enemy H."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "祝融",
    "source_variant": "基础身份／神话再临·林+明示F1–F10江湖适配",
    "source_date": "2026-10-15目录快照；历史规则及有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-46.html",
      "https://wiki.biligame.com/msgs/祝融",
      "https://www.sanguosha.cn/pc/guide-info-137.html"
    ],
    "source_ids": [
      "mobile-zhurong",
      "bwiki-zhurong",
      "mobile-guide137"
    ],
    "source_record_id": "sgs.adapted.base.hero.zhu-rong:2026-10-15",
    "faction": "蜀",
    "gender_provenance": {
      "hp_gender": "bwiki-zhurong",
      "faction": "mobile-zhurong",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 39023,
      "revision_timestamp_utc": "2026-06-11T13:58:14Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-zhurong",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-46.html",
        "publication_date": null
      },
      {
        "id": "bwiki-zhurong",
        "tier": "community_same_product_matching_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/祝融"
      },
      {
        "id": "mobile-guide137",
        "tier": "official_same_product_historical_variant_comparison",
        "url": "https://www.sanguosha.cn/pc/guide-info-137.html",
        "publication_date": "2020-07-01 15:12:38"
      }
    ],
    "source_evidence_note": "移动官网身份技能逐项核验；血量/性别由对应手游社区基础变体字段与OL资料交叉。当前客户端未实测。",
    "source_unknowns": [
      "Current mobile identity death-source timing beyond public core",
      "Atomic exchange trigger scheduler and interruptions",
      "Multiple copied Huoshou/Juxiang holders",
      "Cross-game transforms, BaoSi costs versus true virtual subcards, poison during costs",
      "Client playable-version HP and skills not observed in authenticated client"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-zhurong"
      ],
      "current_mobile_client_verified": false,
      "display_note": "体力依据：移动版社区基础变体，标注修订时间；OL只作跨产品佐证，未实测当前移动客户端。"
    },
    "aliases": [
      "三国杀祝融",
      "祝融·巨象·烈刃",
      "zhu-rong"
    ],
    "portrait_path": "./portraits-sgs-forest/zhu-rong.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F1",
        "title": "General event and zone contract",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "All four skills use live living-seat targets, independent of team. H means hand, E equipped, J judgment. Discard own unspecified cards uses H/E, never J. Obtain another player unspecified card uses H/E unless text explicitly allows J; hidden H selection remains blind. Existing owner zone-leave, gain, poison and equipment events must run once per physical move. No invented extra hand-only cost or target-enemy filter.",
        "evidence_basis": "Historical FAQ supports Dimeng H/E and Lieren H/E. Dated4399 OL2019 same-text Yinghun FAQ supports H/E notJ, discard shortfall and single-batch discard, without discarding later Lianying gains again. These are cross-product corroboration, not verified current-mobile clauses. Cross-game interactions are host composition."
      },
      {
        "id": "F2",
        "title": "Resolution-time values and costs",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lock Yinghun X and chosen option at activation before target draw; target chooses own legal discard after draw. Lock Dimeng X=absolute hand-count difference during legal declaration; require exactly X discardable H/E cards, permit X=0. Reject invalid/stale selections without spending quota. After successful cost, resolve losses and their nested effects, then swap current hands. Do not pay a different price after nested draws. If a participant dies before swap, cancel the swap, preserve paid cost/quota. If LuSu dies after committing the cost while both exchange participants remain alive and the match continues, finish the already-committed exchange; do not create another skill use. This continuation is explicit host policy, not verified mobile behavior.",
        "evidence_basis": "Official text establishes order, not all nested interruption semantics. This particular nested-cost/swap policy is proposed, not claimed native."
      },
      {
        "id": "F3",
        "title": "Simultaneous private hand exchange",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Dimeng moves the complete current A/B hands as one simultaneous exchange transaction. Snapshot both at exchange start, clear both, assign opposite packets; loss events know each lost all old H, gain events receive only opposite packet. Queue triggered draws after transaction so Lianying gains remain with its owner. Do not expose either old hand to LuSu or spectators, and do not sequence A->B then B->A.",
        "evidence_basis": "OL 2014 official-hosted guide explicitly says simultaneous loss/gain; exact mobile trigger scheduler unverified, so atomic-then-trigger ordering is host proposal."
      },
      {
        "id": "F4",
        "title": "Phase windows and extra phases",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Haoshi decision occurs before normal draw; +2 changes this draw operation rather than forces total4. Complete draw and immediate nested gains, then evaluate H>5 and mandatory half transfer; choose least-H other from current state. No Haoshi if normal draw replaced by Zaiqi/Shuangxiong or entire draw phase skipped. Re-entered genuine phase supplies fresh per-phase opportunity, not repeated UI clicks. Yinghun once at each genuine preparation entry, optional.",
        "evidence_basis": "Official core + cross-product pre-draw FAQ; mixed extra-draw/replacement composition is proposed."
      },
      {
        "id": "F5",
        "title": "Zaiqi reveal handling",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Snapshot missing HP X when replacing the normal draw; reveal exactly X available top cards together into processing, no judgment/retrial. Count printed heart suits of these unowned revealed cards; recover that many as one recovery operation capped at maxHP, discard those heart cards from processing, then obtain remaining cards. Do not treat as draw. Keep all revealed physical IDs protected from reshuffle until resolution; a short deck yields only actual cards.",
        "evidence_basis": "Official identity says reveal, recover count, obtain rest; mobile historical Guozhan guide adds heart cleanup. One recovery operation follows identity wording; cross-game suit transformation/effect replacement remains proposed."
      },
      {
        "id": "F6",
        "title": "AOE semantic mapping",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Map source 南蛮入侵 to existing canonical host 烽火狼烟 with source alias retained, only if entire ordinary card semantics remain all other living seats including same-team AI, each response Kill or normal1damage, per-target nullification. Skill immunity is to that card effect; it is not all damage immunity. Card user, damage source, cause-card-use ID and material ownership must be distinct. No new second physical card entity needed.",
        "evidence_basis": "Source Nanman targets from official card definition; host mapping is explicit cross-game policy, not publisher naming."
      },
      {
        "id": "F7",
        "title": "Huoshou source lifetime",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Set override on this AOE use at target specification, not when each victim is hit. Living MengHuo is source of all later direct and transferred damage from that use; original user stays user for targets/order, use triggers and Juxiang other-user test. If recorded source finally dies during this AOE, later damage is sourceless, not reverted to original user. Newly acquiring Huoshou mid-resolution does not retroactively claim an already-declared AOE.",
        "evidence_basis": "Core timing from mobile; death/source-transfer edge only historical Fandom FAQ. Explicit host policy pending current-mobile confirmation."
      },
      {
        "id": "F8",
        "title": "Juxiang physical material provenance",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "After all targets and nested effects finish, recover only still-unclaimed physical materials of that exact other-player AOE use. Material already gained by Jianxiong/Jiquan is not stolen, cloned, pulled from hands or re-acquired after unrelated later discard. Zero-material virtual use gives no card. YXS BaoSi discards exactly1 card already in her equipment zone as cost, then creates a material-free virtual AOE; that discarded cost card is not a Juxiang material. Her separate Zhiyu skill costs2 hand cards and must not be conflated with Fenghuo. True view-as/borrowed-material AOE returns its tracked materials as original physical cards. No virtual shell enters hand.",
        "evidence_basis": "Mobile historical guide confirms Jianxiong precedence. Official YXS2015 mobile/2012 desktop sources establish BaoSi Fenghuo1E versus Zhiyu2H. Multi-material and cross-game effects are host contract. Do not assume prior discard costs become materials."
      },
      {
        "id": "F9",
        "title": "Damage completion and Lieren compare",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lieren checks each positive direct damage event from a Slash used by its owner, and only the current direct target. Finish dying/rescue and damage triggers before asking if both living actors can compare. After both secretly choose H, lock, reveal, compare strictly higher; tied is not win. Keep compare cards in processing through win reward and nested gains; clean afterward. Multi-point damage gives one offer, not one per HP. Chained/reflected non-target damage does not give offers. No default phase quota.",
        "evidence_basis": "Mobile text says damage to target, not per point; ordinary compare history from previous packet; specific scheduler and transformed cross-game Slash are host contract."
      },
      {
        "id": "F10",
        "title": "Multiple copied skill holders",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "If cross-game copies yield several Huoshou or Juxiang holders, source publisher behavior is unverified. Proposed: at AOE declaration resolve Huoshou in stable action order with last override winning; at completion eligible Juxiang holders resolve in stable action order, first actual successful claim owns remaining materials. Never duplicate physical IDs. Show as explicit compatibility policy or keep this coexistence pending.",
        "evidence_basis": "No native evidence; cross-game-only proposed policy. Do not mislabel as mobile FAQ."
      }
    ],
    "adaptation_notes": "完整身份核心采用逐项来源，F1–F10明确本作事件/跨作毒/重复拥有者等处理；当前客户端及全模式尚未核验。",
    "source_equivalence": {
      "status": "distinct-complete-intrinsic-packet-pending-independent-signature-review",
      "full_packet": [
        "巨象",
        "烈刃"
      ],
      "hp": 4
    }
  },
  {
    "id": "sgs.adapted.base.hero.sun-jian",
    "source_name": "孙坚",
    "suggested_display_name": "孙坚",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·林",
    "snapshot_date": "2026-10-15",
    "source_faction": "吴",
    "max_hp": 4,
    "starting_hp": 4,
    "gender": "male",
    "metadata_provenance": {
      "hp_gender": "bwiki-sunjian",
      "faction": "mobile-sunjian",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 34810,
      "revision_timestamp_utc": "2025-12-05T14:20:49Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_refs": [
      "mobile-sunjian",
      "bwiki-sunjian"
    ],
    "intrinsic_skill_inventory": [
      "英魂"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "every identity skill panel read; none labeled 主公技",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "mode_status": {
      "intrinsic_rules": "ready_for_implementation_with_labeled_policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete",
      "personal_lord_dependency": false,
      "small_seat_adaptation": "Preserve complete skills. LuSu Dimeng naturally unavailable with fewer than two other living actors; never rewrite to self-exchange."
    },
    "skills": [
      {
        "id": "yinghun",
        "name": "英魂",
        "type": "optional_preparation_targeted_draw_discard",
        "timing": "own preparation phase",
        "quota": "one opportunity each genuine preparation entry",
        "cost": null,
        "trigger_gate": "owner is wounded",
        "targets": "one other living actor, no distance/faction/gender constraint",
        "effect": [
          "Owner chooses target and one branch. Set X=owner missing HP. BranchA target drawsX then discards1; branchB target draws1 then discardsX.",
          "Target chooses which of its own legal H/E cards to discard after receiving draws; cannot use J. If fewer than needed, discard all available legal cards. This is one discard batch: later Lianying gains do not refill a shortfall or require another discard. Dated matching-text OL FAQ corroborates these procedures; current mobile client unverified.",
          "SunJian cannot target self; X=1 makes branches numerically equal but still valid. At full HP no activation."
        ],
        "source_refs": [
          "mobile-sunjian",
          "bwiki-sunjian",
          "operator-sunjian-faq"
        ],
        "policy_refs": [
          "F1",
          "F2",
          "F4"
        ],
        "ui": "Wounded prephase prompt with skip, any-other target and two explicit branches; target gets discard control; show locked X. No play-phase active button."
      }
    ],
    "ui_requirements": [
      "Show source product, base identity variant, original name, HP, gender and source faction",
      "All intrinsic skills visible with timing, optional/locked, costs, quota, targets and complete effect",
      "No official art redistribution; use original readable portraits/icons, accessible text alternatives",
      "Decision dialogs support cancel only before commitment; mobile layout, controller/AI parity, snapshot reload and replay consistency"
    ],
    "excluded_variants": [
      "界孙坚破虏",
      "专门1V1仅对手目标文本",
      "国战2或2.5半体力",
      "起孙坚等其他变体"
    ],
    "name": "孙坚",
    "display_name": "孙坚",
    "skill_name": "英魂",
    "skill_desc": "英魂：准备阶段若已受伤，可选择另一人，令其摸已损失体力数张后弃1，或摸1后弃已损失体力数张。",
    "complete_skill_names": [
      "英魂"
    ],
    "skill_ids": [
      "sgs.yinghun"
    ],
    "source_skill_rules": [
      {
        "id": "yinghun",
        "name": "英魂",
        "type": "optional_preparation_targeted_draw_discard",
        "timing": "own preparation phase",
        "quota": "one opportunity each genuine preparation entry",
        "cost": null,
        "trigger_gate": "owner is wounded",
        "targets": "one other living actor, no distance/faction/gender constraint",
        "effect": [
          "Owner chooses target and one branch. Set X=owner missing HP. BranchA target drawsX then discards1; branchB target draws1 then discardsX.",
          "Target chooses which of its own legal H/E cards to discard after receiving draws; cannot use J. If fewer than needed, discard all available legal cards. This is one discard batch: later Lianying gains do not refill a shortfall or require another discard. Dated matching-text OL FAQ corroborates these procedures; current mobile client unverified.",
          "SunJian cannot target self; X=1 makes branches numerically equal but still valid. At full HP no activation."
        ],
        "source_refs": [
          "mobile-sunjian",
          "bwiki-sunjian",
          "operator-sunjian-faq"
        ],
        "policy_refs": [
          "F1",
          "F2",
          "F4"
        ],
        "ui": "Wounded prephase prompt with skip, any-other target and two explicit branches; target gets discard control; show locked X. No play-phase active button."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "孙坚",
    "source_variant": "基础身份／神话再临·林+明示F1–F10江湖适配",
    "source_date": "2026-10-15目录快照；历史规则及有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-44.html",
      "https://wiki.biligame.com/msgs/孙坚",
      "https://my.4399.com/yxsgs/wenda/11983/"
    ],
    "source_ids": [
      "mobile-sunjian",
      "bwiki-sunjian",
      "operator-sunjian-faq"
    ],
    "source_record_id": "sgs.adapted.base.hero.sun-jian:2026-10-15",
    "faction": "吴",
    "gender_provenance": {
      "hp_gender": "bwiki-sunjian",
      "faction": "mobile-sunjian",
      "hp_official_mobile_field_verified": false,
      "starting_hp_basis": "normal full-HP initialization for matching classic card; no distinct initialHP printed",
      "revision_id": 34810,
      "revision_timestamp_utc": "2025-12-05T14:20:49Z",
      "cross_product_corroboration": "ol-metadata"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-sunjian",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-44.html",
        "publication_date": null
      },
      {
        "id": "bwiki-sunjian",
        "tier": "community_same_product_matching_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/孙坚"
      },
      {
        "id": "operator-sunjian-faq",
        "tier": "operator_hosted_cross_product_historical_faq",
        "url": "https://my.4399.com/yxsgs/wenda/11983/",
        "publication_date": "2019-02-12 13:57"
      }
    ],
    "source_evidence_note": "移动官网身份技能逐项核验；血量/性别由对应手游社区基础变体字段与OL资料交叉。当前客户端未实测。",
    "source_unknowns": [
      "Current mobile identity death-source timing beyond public core",
      "Atomic exchange trigger scheduler and interruptions",
      "Multiple copied Huoshou/Juxiang holders",
      "Cross-game transforms, BaoSi costs versus true virtual subcards, poison during costs",
      "Client playable-version HP and skills not observed in authenticated client"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-sunjian"
      ],
      "current_mobile_client_verified": false,
      "display_note": "体力依据：移动版社区基础变体，标注修订时间；OL只作跨产品佐证，未实测当前移动客户端。"
    },
    "aliases": [
      "三国杀孙坚",
      "孙坚·英魂",
      "sun-jian"
    ],
    "portrait_path": "./portraits-sgs-forest/sun-jian.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "F1",
        "title": "General event and zone contract",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "All four skills use live living-seat targets, independent of team. H means hand, E equipped, J judgment. Discard own unspecified cards uses H/E, never J. Obtain another player unspecified card uses H/E unless text explicitly allows J; hidden H selection remains blind. Existing owner zone-leave, gain, poison and equipment events must run once per physical move. No invented extra hand-only cost or target-enemy filter.",
        "evidence_basis": "Historical FAQ supports Dimeng H/E and Lieren H/E. Dated4399 OL2019 same-text Yinghun FAQ supports H/E notJ, discard shortfall and single-batch discard, without discarding later Lianying gains again. These are cross-product corroboration, not verified current-mobile clauses. Cross-game interactions are host composition."
      },
      {
        "id": "F2",
        "title": "Resolution-time values and costs",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lock Yinghun X and chosen option at activation before target draw; target chooses own legal discard after draw. Lock Dimeng X=absolute hand-count difference during legal declaration; require exactly X discardable H/E cards, permit X=0. Reject invalid/stale selections without spending quota. After successful cost, resolve losses and their nested effects, then swap current hands. Do not pay a different price after nested draws. If a participant dies before swap, cancel the swap, preserve paid cost/quota. If LuSu dies after committing the cost while both exchange participants remain alive and the match continues, finish the already-committed exchange; do not create another skill use. This continuation is explicit host policy, not verified mobile behavior.",
        "evidence_basis": "Official text establishes order, not all nested interruption semantics. This particular nested-cost/swap policy is proposed, not claimed native."
      },
      {
        "id": "F3",
        "title": "Simultaneous private hand exchange",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Dimeng moves the complete current A/B hands as one simultaneous exchange transaction. Snapshot both at exchange start, clear both, assign opposite packets; loss events know each lost all old H, gain events receive only opposite packet. Queue triggered draws after transaction so Lianying gains remain with its owner. Do not expose either old hand to LuSu or spectators, and do not sequence A->B then B->A.",
        "evidence_basis": "OL 2014 official-hosted guide explicitly says simultaneous loss/gain; exact mobile trigger scheduler unverified, so atomic-then-trigger ordering is host proposal."
      },
      {
        "id": "F4",
        "title": "Phase windows and extra phases",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Haoshi decision occurs before normal draw; +2 changes this draw operation rather than forces total4. Complete draw and immediate nested gains, then evaluate H>5 and mandatory half transfer; choose least-H other from current state. No Haoshi if normal draw replaced by Zaiqi/Shuangxiong or entire draw phase skipped. Re-entered genuine phase supplies fresh per-phase opportunity, not repeated UI clicks. Yinghun once at each genuine preparation entry, optional.",
        "evidence_basis": "Official core + cross-product pre-draw FAQ; mixed extra-draw/replacement composition is proposed."
      },
      {
        "id": "F5",
        "title": "Zaiqi reveal handling",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Snapshot missing HP X when replacing the normal draw; reveal exactly X available top cards together into processing, no judgment/retrial. Count printed heart suits of these unowned revealed cards; recover that many as one recovery operation capped at maxHP, discard those heart cards from processing, then obtain remaining cards. Do not treat as draw. Keep all revealed physical IDs protected from reshuffle until resolution; a short deck yields only actual cards.",
        "evidence_basis": "Official identity says reveal, recover count, obtain rest; mobile historical Guozhan guide adds heart cleanup. One recovery operation follows identity wording; cross-game suit transformation/effect replacement remains proposed."
      },
      {
        "id": "F6",
        "title": "AOE semantic mapping",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Map source 南蛮入侵 to existing canonical host 烽火狼烟 with source alias retained, only if entire ordinary card semantics remain all other living seats including same-team AI, each response Kill or normal1damage, per-target nullification. Skill immunity is to that card effect; it is not all damage immunity. Card user, damage source, cause-card-use ID and material ownership must be distinct. No new second physical card entity needed.",
        "evidence_basis": "Source Nanman targets from official card definition; host mapping is explicit cross-game policy, not publisher naming."
      },
      {
        "id": "F7",
        "title": "Huoshou source lifetime",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Set override on this AOE use at target specification, not when each victim is hit. Living MengHuo is source of all later direct and transferred damage from that use; original user stays user for targets/order, use triggers and Juxiang other-user test. If recorded source finally dies during this AOE, later damage is sourceless, not reverted to original user. Newly acquiring Huoshou mid-resolution does not retroactively claim an already-declared AOE.",
        "evidence_basis": "Core timing from mobile; death/source-transfer edge only historical Fandom FAQ. Explicit host policy pending current-mobile confirmation."
      },
      {
        "id": "F8",
        "title": "Juxiang physical material provenance",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "After all targets and nested effects finish, recover only still-unclaimed physical materials of that exact other-player AOE use. Material already gained by Jianxiong/Jiquan is not stolen, cloned, pulled from hands or re-acquired after unrelated later discard. Zero-material virtual use gives no card. YXS BaoSi discards exactly1 card already in her equipment zone as cost, then creates a material-free virtual AOE; that discarded cost card is not a Juxiang material. Her separate Zhiyu skill costs2 hand cards and must not be conflated with Fenghuo. True view-as/borrowed-material AOE returns its tracked materials as original physical cards. No virtual shell enters hand.",
        "evidence_basis": "Mobile historical guide confirms Jianxiong precedence. Official YXS2015 mobile/2012 desktop sources establish BaoSi Fenghuo1E versus Zhiyu2H. Multi-material and cross-game effects are host contract. Do not assume prior discard costs become materials."
      },
      {
        "id": "F9",
        "title": "Damage completion and Lieren compare",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "Lieren checks each positive direct damage event from a Slash used by its owner, and only the current direct target. Finish dying/rescue and damage triggers before asking if both living actors can compare. After both secretly choose H, lock, reveal, compare strictly higher; tied is not win. Keep compare cards in processing through win reward and nested gains; clean afterward. Multi-point damage gives one offer, not one per HP. Chained/reflected non-target damage does not give offers. No default phase quota.",
        "evidence_basis": "Mobile text says damage to target, not per point; ordinary compare history from previous packet; specific scheduler and transformed cross-game Slash are host contract."
      },
      {
        "id": "F10",
        "title": "Multiple copied skill holders",
        "status": "proposed_host_policy_not_current_mobile_client_ruling",
        "policy": "If cross-game copies yield several Huoshou or Juxiang holders, source publisher behavior is unverified. Proposed: at AOE declaration resolve Huoshou in stable action order with last override winning; at completion eligible Juxiang holders resolve in stable action order, first actual successful claim owns remaining materials. Never duplicate physical IDs. Show as explicit compatibility policy or keep this coexistence pending.",
        "evidence_basis": "No native evidence; cross-game-only proposed policy. Do not mislabel as mobile FAQ."
      }
    ],
    "adaptation_notes": "完整身份核心采用逐项来源，F1–F10明确本作事件/跨作毒/重复拥有者等处理；当前客户端及全模式尚未核验。",
    "source_equivalence": {
      "status": "distinct-complete-intrinsic-packet-pending-independent-signature-review",
      "full_packet": [
        "英魂"
      ],
      "hp": 4
    }
  }
];
export const SGS_FOREST_DEFINITIONS=Object.freeze(definitions);
