/** Complete documented base packets, including granted-skill guides.
 * skill_ids are initial ownership only. Local registry availability is not release validation
 * or current-client / whole-mode certification. Source initialHP remains unobserved. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.zhang-he",
    "source_name": "张郃",
    "suggested_display_name": "张郃",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·山",
    "snapshot_date": "2026-10-15",
    "source_faction": "魏",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "M0 normal-full-HP initialization policy; separate source initialHP unobserved",
    "gender": "male",
    "metadata_provenance": {
      "maxHP": "bwiki-zhanghe 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-zhanghe explicit 性别",
      "faction": "mobile-zhanghe explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "source_refs": [
      "mobile-zhanghe",
      "bwiki-zhanghe",
      "mobile-zhanghe-9game"
    ],
    "intrinsic_skill_inventory": [
      "巧变"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every identity inline panel including hidden panels read; none marked 主公技. Granted 急袭 is not 国战主将技.",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_base_inventory_ready_for_host_implementation_with_disclosed_procedural_policies",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Source skill inventory complete does not certify identity rules/rewards/victory scheduler.",
      "intrinsic_rules": "complete-source-packet-with-explicit-host-policies-under-final-validation",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "qiaobian",
        "name": "巧变",
        "type": "optional_phase_skip_and_optional_control",
        "timing": "Before own unskipped judge/draw/play/discard phase",
        "quota": "once per genuine eligible phase event, separate cost each; no global once/turn cap",
        "cost": "discard1 legal HAND card",
        "trigger_gate": "phase not preparation/end, not already skipped; owner has legalH",
        "targets": "draw:0..2 distinct other living H>0; play:two distinct actors as transfer endpoints",
        "effect": [
          "Pay1H then skip that phase. Judge/discard skip has no extra effect.",
          "If draw skipped this way, optionally gain1H from each selected0..2 other actors; action-order losses then combined gain.",
          "If play skipped this way, optionally move1E/J from one actor to another corresponding legal empty slot. Either endpoint may be self."
        ],
        "source_refs": [
          "mobile-zhanghe",
          "bwiki-zhanghe",
          "bwiki-qiaobian",
          "operator-zhanghe-faq"
        ],
        "policy_refs": [
          "M1",
          "M2",
          "M3",
          "M4"
        ],
        "ui": "Four timed prompts rather than an active play button; after cost optional steal/transfer can be declined without undoing skip."
      }
    ],
    "ui_requirements": [
      "Show source variant/faction/HP/gender and entire intrinsic and granted skill packet",
      "Show costs, timing, phase use quota, awakening and removal state",
      "Accessible mobile dialogs, blind hand choices, private deck ordering, public fields",
      "Original art only; no copied publisher artwork"
    ],
    "excluded_variants": [
      "界/谋/势/SP/神 other namesakes",
      "国战 halfHP/general slots/资粮/遗志/天覆",
      "OL2020 balance changes",
      "十周年 or special1V1 variants"
    ],
    "name": "张郃",
    "display_name": "张郃",
    "skill_name": "巧变",
    "skill_desc": "巧变：自己的判定、摸牌、出牌或弃牌阶段前，可各弃1张手牌跳过该阶段。跳摸牌后可从至多两名不同的其他角色各获得1张手牌；跳出牌后可移动一张场上装备或判定牌至另一角色对应合法空位。",
    "skill_ids": [
      "sgs.qiaobian"
    ],
    "intrinsic_skill_ids": [
      "sgs.qiaobian"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.qiaobian"
    ],
    "complete_skill_names": [
      "巧变"
    ],
    "skill_ownership_policy": "skill_ids are initially owned intrinsic skills only; granted_skill_ids are documentation until a successful awakening grants a per-owner instance.",
    "source_skill_rules": [
      {
        "id": "qiaobian",
        "name": "巧变",
        "type": "optional_phase_skip_and_optional_control",
        "timing": "Before own unskipped judge/draw/play/discard phase",
        "quota": "once per genuine eligible phase event, separate cost each; no global once/turn cap",
        "cost": "discard1 legal HAND card",
        "trigger_gate": "phase not preparation/end, not already skipped; owner has legalH",
        "targets": "draw:0..2 distinct other living H>0; play:two distinct actors as transfer endpoints",
        "effect": [
          "Pay1H then skip that phase. Judge/discard skip has no extra effect.",
          "If draw skipped this way, optionally gain1H from each selected0..2 other actors; action-order losses then combined gain.",
          "If play skipped this way, optionally move1E/J from one actor to another corresponding legal empty slot. Either endpoint may be self."
        ],
        "source_refs": [
          "mobile-zhanghe",
          "bwiki-zhanghe",
          "bwiki-qiaobian",
          "operator-zhanghe-faq"
        ],
        "policy_refs": [
          "M1",
          "M2",
          "M3",
          "M4"
        ],
        "ui": "Four timed prompts rather than an active play button; after cost optional steal/transfer can be declined without undoing skip."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "runtime_validation_status": "release-blocked-until-parent-final-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "张郃",
    "source_variant": "基础身份／神话再临·山+明示M0–M16江湖适配",
    "source_date": "2026-10-15目录快照；经典身份规则与有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-50.html",
      "https://wiki.biligame.com/msgs/张郃",
      "https://www.9game.cn/sgs/11331031.html",
      "https://wiki.biligame.com/msgs/巧变/张郃",
      "https://news.7k7k.com/content/20120307/161563.html"
    ],
    "source_ids": [
      "mobile-zhanghe",
      "bwiki-zhanghe",
      "mobile-zhanghe-9game",
      "bwiki-qiaobian",
      "operator-zhanghe-faq"
    ],
    "source_record_id": "sgs.adapted.base.hero.zhang-he:2026-10-15",
    "faction": "魏",
    "source_gender": "male",
    "gender_provenance": {
      "maxHP": "bwiki-zhanghe 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-zhanghe explicit 性别",
      "faction": "mobile-zhanghe explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-zhanghe",
      "revision_id": 34817,
      "revision_timestamp_utc": "2025-12-05T14:23:37Z"
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-zhanghe",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-50.html",
        "publication_date": null,
        "sha256": "7268b09fe647e0de3c15882ddc7c365d9b6713eaf15c48e10af3ceffcb835140",
        "limitations": [
          "No publication/revision date; only snapshot access date is known.",
          "The page has faction and matching identity skills, but omits numerical HP and explicit gender metadata. Biography pronouns are not used as game-gender certification."
        ]
      },
      {
        "id": "bwiki-zhanghe",
        "tier": "community_same_product_matching_base_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/张郃",
        "revision_id": 34817,
        "revision_timestamp_utc": "2025-12-05T14:23:37Z",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId = RLCONF.wgCurRevisionId",
          "revision_id_line": 25,
          "timestamp_field": "meta[property=\"article:modified_time\"]",
          "timestamp_line": 50,
          "permanent_link_in_current_html": true,
          "revision_archive_reopened": false,
          "revision_archive_result": "HTTP 200 login gate, wgRevisionId=0; requires login; no bypass attempted",
          "transclusion_dates_independently_verified": false
        },
        "sha256": "f9fac1cb3d9416fe816eba7b2fa3100b960df0a89067c5afa505d4afa6acad60",
        "limitations": [
          "Secondary community metadata; neither official mobile numerical HP fields nor current-client observation.",
          "The public current article exposes revision and modified timestamp; explicit oldid URLs are login-gated.",
          "Page-level revision date does not separately date transcluded templates; capture date is the fixed snapshot date.",
          "No separate initial HP value is printed."
        ]
      },
      {
        "id": "mobile-zhanghe-9game",
        "tier": "secondary_same_product_dated_article_corroboration_only",
        "url": "https://www.9game.cn/sgs/11331031.html",
        "publication_timestamp": "2025-08-21T13:44:59+08:00",
        "sha256": "6047f0d5f0b0123a8fb040dcf64bf5af55deea66a662a0e74b43e406651524f4",
        "limitations": [
          "Article credits 作者：互联网 来源：96kaifa源码; corroboration only, not official game documentation.",
          "HP wording is 体力值, not a separately distinguished initial/max HP pair."
        ]
      },
      {
        "id": "bwiki-qiaobian",
        "tier": "community_same_product_skill_page_selected_classic_section",
        "url": "https://wiki.biligame.com/msgs/巧变/张郃",
        "revision_id": 27264,
        "revision_timestamp_utc": "2024-05-03T11:16:26Z",
        "sha256": "17d5d98bc27524ea43efc4017ec716a3d180f4e90a1a94ae820c343af5d42ecc"
      },
      {
        "id": "operator-zhanghe-faq",
        "tier": "operator_cross_product_historical_matching_base_faq",
        "url": "https://news.7k7k.com/content/20120307/161563.html",
        "publication_date": "2012-03-07",
        "sha256": "388af81917ae7f75ccd2f9c853674f1e9d7986de3979427c8463772dbad45601"
      }
    ],
    "source_evidence_note": "官网身份技能（含隐藏面板）和势力已逐项读取；体力与性别来自对应手游社区经典身份显式字段。历史跨产品FAQ只佐证流程，当前移动客户端未实测；初始满体力为M0本作初始化约定。",
    "source_unknowns": [
      {
        "id": "U1",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "巧变",
          "屯田"
        ],
        "detail": "Exact nested movement-trigger scheduling is historically corroborated by matching base FAQs, not verified in current mobile client."
      },
      {
        "id": "U2",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "急袭"
        ],
        "detail": "Card expansion relies on host Snatch contract; same-product current-mobile full card rules page not separately captured. Spent field exclusion is historical matching-base FAQ."
      },
      {
        "id": "U3",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "志继",
          "观星"
        ],
        "detail": "Immediate same-preparation trigger is supported by historical FAQ; fullHP recovery-option gating, short-deck processing and pathological maxHP1 awaken are host policies not settled by selected mobile text."
      },
      {
        "id": "U4",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "断肠"
        ],
        "detail": "Broad acquired/lord/current-skill loss plus later reacquisition and pile cleanup use dated matching-base cross-product FAQ. Public mobile page certifies only all-general-skills core, not complete modern skill taxonomy/death scheduler."
      },
      {
        "id": "U5",
        "category": "cross_game_host_policy",
        "applies_to": [
          "all"
        ],
        "detail": "YXS易装 copied templates, foreign poison during costs, host delayed-card immunities and multi-copy holders are M1-M16 adaptation policies; never source-certified."
      },
      {
        "id": "U6",
        "category": "mode_pending",
        "applies_to": [
          "断肠"
        ],
        "detail": "Identity victory/terminal event priority, lord-skill relationships, and kill reward/penalty order require full identity mode integration; no personal lord skill is omitted from candidates."
      }
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-zhanghe"
      ],
      "revision_id": 34817,
      "revision_timestamp_utc": "2025-12-05T14:23:37Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "M0",
      "display_note": "体力上限依据移动版社区经典身份字段；官网未给数值HP。初始满体力是M0本作约定，非单独观察到的initialHP；未实测当前移动客户端。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.zhang-he",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "基础身份／神话再临·山",
      "source_character_name": "张郃",
      "faction": "魏",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "M0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀张郃",
      "张郃·巧变",
      "zhang-he"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-mountain/zhang-he.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "M0",
        "title": "Initialization and source identity",
        "contract": "Use base maxHP4/4/4/3, source faction魏/魏/蜀/群 and male/male/male/female. Initialize full HP by normal host policy. A separate mobile initialHP field was not observed. Do not add identity-lord HP bonus in nonidentity host. Preserve source fields even when host faction differs.",
        "evidence": "Metadata same-product 经典, official faction; initialHP is initialization policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M1",
        "title": "Legal costs, privacy, and irreversible commitment",
        "contract": "Own cost: legal hand/equipment where skill says 一张牌; 巧变 explicitly hand only. Cannot use J or special piles unless named. Preview legal choices before cost; cancel before committing is free. Once cost paid and phase skipped/skill used, pass optional effect but never refund or resume phase. Invalid/stale payloads must not partially mutate. Unknown enemy H faces remain private; select blind index or seeded random identity.",
        "evidence": "Source explicit H vs generic cards; historical FAQs corroborate H/E versus J.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M2",
        "title": "Real phase event identities",
        "contract": "Offer Qiaobian once per actual judge/draw/play/discard phase-start-before-entry event, never preparation/end and never a phase already skipped. Pay separate1H each phase. Extra genuine phase gets its own event; duplicate/resumed UI does not. Skip judge retains attached delays; skip draw/play/discard suppresses entire phase and phase-only skills, not later phases. Face-down whole-turn skip bypasses all four windows.",
        "evidence": "BWiki classic exclusion plus operator2012 phase FAQ; extra-phase/cancellation is host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M3",
        "title": "Qiaobian hand movement order",
        "contract": "After paid draw skip optionally choose0..2 distinct OTHER living actors with H>0; no distance/team restriction, at most1 actual H each. Resolve target losses in current action/seat order, allowing loss triggers after each loss, then give all reserved cards to ZhangHe as one gain. No self-target, duplicate target, equipment or J, no two cards from sole opponent. Never steal cards gained after the chosen loss to replace reserved cards.",
        "evidence": "Operator2012 explicitly losses sequentially then combined gain; full trigger scheduler remains historical corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M4",
        "title": "Qiaobian corresponding-zone transfer",
        "contract": "After paid play skip optionally move exactly1 physical card E->same equipment subtype slot or J->J between two distinct living actors, either endpoint may be self. No distance/team check. Destination slot must be available and empty, no same-name delay duplicate, and delay-target immunity/prohibition checked. A move is not use/discard: no replacing occupied weapon, no Slash or normal trick use event and no Wuxie window just for the move. Keep original delay identity/material. Equipment leaving source triggers its legal loss effects once.",
        "evidence": "Official mobile corresponding-location text; operator2012 equipment/J and no replacement; cross-game slots and provenance are host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M5",
        "title": "Tuntian eligible movement events",
        "contract": "Offer one optional judgment per actual loss event from H/E outside owner turn, independent of cards in batch; J or field-only loss does not qualify. Responding, discarding, gifting, being stolen or comparing can qualify. Merely changing H->E within same owner is not a net loss of own cards. Loss must actually happen, no zero-size event. Nested distinct losses can each trigger; deduplicate by event id.",
        "evidence": "Mobile core offturn loss; operator2020 H/E vs J and batch FAQ. Own-zone and nested-event scheduler are host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M6",
        "title": "Judgment, fields and distance",
        "contract": "Tuntian uses a real modifiable judgment. After final judgment, nonheart actual surviving judgment card moves to public field pile, never draw an extra card/copy virtual shell; heart normally discarded, not gained (no OL2020 buff). Nonheart placement is mandatory once judgment chosen. Field cards stay out of reshuffle; no cap. Distance reduction is owner->other only, minimum1, stack normal distance modifiers.",
        "evidence": "Mobile final judgment and field text; official OL historical outgoing direction; operator2020 field persistence. Card capture priorities with other gain skills remain host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M7",
        "title": "Awakening state and bindings",
        "contract": "Zaoxian and Zhiji are mandatory once per actor-and-source-template binding for the game; marks persist after reload, phase loops and repeated adoption of the same template. Lower maxHP1 and clamp currentHP only when above new maximum; no separate damage event. Keep original skills unless text removes them. Granted skill is bound to this skill-owner character, not global hero name, and survives normal turns. Host copy/transform needs a stable per-actor binding, not awakening-state copied from the dead source actor. Losing source/granted general skills must not let an effective-hero getter recreate them. A maxHP<=1 awakening or external reacquisition/reset is an unresolved intrinsic corner; explicitly gate/test policy, never silently certify.",
        "evidence": "Official mobile awakening order; operator JiangWei once/game. Cross-game copying and low-maxHP not mobile-certified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M8",
        "title": "Jixi full virtual Snatch contract",
        "contract": "Only an actual owned field physical card is material. In own play phase may repeat without printed quota while legal fields/targets remain. Preview target with spent field excluded from field distance reduction; then commit field->processing once, use ordinary Snatch retaining material suit/rank/color. Target exactly1 other living actor in effective distance1, with obtainable H/E/J; no weapon range substitution, no self, not enemy-only. Respect Snatch immunity/prohibitions and normal Wuxie. On resolve gain one target H/E/J into own H; on cancellation/immunity gain none, material still spent. Final actual material goes to discard or another legitimate claim, never returns automatically to field. No auto-use at awakening.",
        "evidence": "Mobile grants 田-as-顺手牵羊; operator2020 consumed field excluded from distance. Expanded ordinary card behavior uses existing host Snatch compatibility, NOT separately certified current-mobile card record.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M9",
        "title": "Tiaoxin target and Slash response",
        "contract": "Choose exactly1 OTHER living actor whose attack range contains owner, using actor->owner distance and actor current weapon. This gate differs from whether a Slash is prohibited or actor has H/E. Once per actual play phase, mark spent on legal commitment even if target has no cards/no result. Target can voluntarily use1 legal Slash incl view-as or decline. This is actual out-of-turn USE aimed at JiangWei, not a pure response nor damage: usual targeting, weapon/armor, Shan and triggers; does not consume target normal play-phase Slash count. If target used Slash, no discard even if dodged/no damage. Only when no Slash was used, JiangWei chooses1 target H/E to discard; never J. No legal H/E means no further effect.",
        "evidence": "Mobile+BWiki target gate; operator2020 real Slash and H/E-only FAQ. Extra phase quota and host out-of-turn counter contract explicit.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M10",
        "title": "Zhiji and Guanxing order",
        "contract": "At own preparation with H0, first choose recover1 if wounded OR draw2; fullHP recovery option is disabled under explicit host legal-choice policy. Then maxHP-1, clamp, gain normal Guanxing. Allow one optional Guanxing in this same preparation after awakening; later genuine preparation events allow it again. Let X=min(5,living actors including self). Privately inspect exactlyX top cards; choose any subset ordered atop and all others ordered below, no gain/discard/draw, all-top/all-bottom legal. Respect deck top orientation; do not reveal to AI opponents or logs. No Jie end-phase extra trigger, no automatic5 when fewer live actors.",
        "evidence": "Mobile exact core and BWiki alive count/order; operator2020 same-prep and recovery-before-clamp. FullHP recovery disabled is a conservative host legal-choice policy, not certified by the selected mobile text; exhaustive short-deck handling is host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M11",
        "title": "Beige damage-event semantics",
        "contract": "One optional1H/E discard and1 judgment per qualifying positive Slash damage EVENT, not per damage point. Owner and injured actor must still be alive after rescue; self-injured survivor is allowed by mobile 一名角色. Judge belongs to injured actor, so its suit modifiers apply. Final heart heals injured1, diamond draws injured2, club makes actual source discard2H/E of its choice, shortfall all eligible; spade toggles actual source face. No source/dead source leaves club/spade without effect but does not suppress heart/diamond. Face-down toggles to face-up; flipping midturn does not end turn.",
        "evidence": "Mobile core suits; operator2020 event and rescue FAQ; source survival/missing-source branch is explicit host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M12",
        "title": "Slash cause attribution and cost interruptions",
        "contract": "Keep original Slash card/use id through host transfer/elemental-chain damage. Proposed host treats each surviving Slash-origin damage recipient event as Beige-eligible, but current mobile chained/transferred attribution is not certified. Cost poison/equipment-loss triggers complete first; if owner or victim dies, no illegal judgment; paid cost never refunded. Each actual holder can get one opportunity in action order; multiple copied holders need policy, not invented source fact.",
        "evidence": "Official text only says Slash-caused damage; chained/transferred/cost poison/multiple copies remain cross-game host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M13",
        "title": "Duanchang current general-skill removal",
        "contract": "At final CaiWenJi death from a known killer/damage source, locked effect strips ALL killer current general skills: innate, locked, awakened/granted, borrowed/copied and active personal lord skills. Equipment-granted skills stay. This is removal without turn-end expiry, not generic all-future-acquisition ban: valid later acquisition can add a new skill. Preserve maxHP, identity, team and equipment. Stop future continuous/trigger effects of removed skills; already-resolved non-skill effects may finish. Clean private skill piles when their owning skill is lost (DengAi fields discard); do not duplicate/discard cards twice.",
        "evidence": "Mobile ALL general skills; historical operator2020 acquired/lord/equipment distinction, fields and futureChanyuan. Borrowed foreign template binding beyond ZuoCi analogy is host policy, current-mobile detailed semantics unverified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M14",
        "title": "Removal, copying and future reacquisition ledger",
        "contract": "Host must distinguish actor original skills, current transformed skills, granted skills and equipment providers. Duanchang removes present general-skill instances and copy-grant abilities so recomputation/reload cannot resurrect them. It does not reset awakened marks, refill limited counts, regrant source-owner skills, erase equipment skills, or block a separately authorized future acquisition. Cancels uncommitted prompts tied to removed skill; committed effects follow recorded source context if still legal. Copying a dead DengAi/JiangWei begins that actor own awakening lifecycle without imported fields/awakening memory; copying CaiWenJi grants both skills. These choices are explicit cross-game host contract.",
        "evidence": "No official mobile rule for YXS易装; historical acquired/borrowed examples only corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M15",
        "title": "Death and identity mode boundary",
        "contract": "Do not fabricate a killer for HP loss, poison loss or sourceless death; Duanchang has no recipient then. Historical identity sequence reveals identity/checks terminal game before some death skills, then ordered death skills and rewards. Existing host without this full identity scheduler can test general-skill removal, but cannot claim complete identity death/reward/victory implementation. No candidate has a personal lord skill. Future identity mode must retain faction/lord status, lord-skill sharing and removal, reward/penalty ordering, terminal outcome priority.",
        "evidence": "Mobile death+killer core; operator2020 identity death examples only; source death scheduler and host terminal-priority decisions remain mode pending.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M16",
        "title": "UI, save/replay and original naming",
        "contract": "Show complete base and granted skill text, locked/awakening markers, exact target/cost/range/quota reasons, public field physical cards, face status, per-owner awakened state and removed-skill marker. Preserve deterministic AI/manual/replay/snapshot choices and no hidden hand/top-deck leakage. New source姜维 gets name姜维; rename only original jianghu.classic.hero.jiang-wei display to proposed粮川 at implementation, leaving stable ID/mechanics/internal legacy name and aliases. Never rename source hero, merge merely by same name, or apply rename before candidate added.",
        "evidence": "Host acceptance contract; no game files edited by research.",
        "status": "proposed_host_policy"
      }
    ],
    "adaptation_notes": "完整基础身份技能及觉醒后技能均保留；M0–M16明确满血初始化、真实阶段、实体田、后得技能、当前武将技能删除及跨作处理。当前客户端与完整身份模式未核验；不混用界、国战、OL2020改版。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "巧变"
      ],
      "complete_signature": {
        "intrinsic_max_hp": 4,
        "initial_hp": {
          "direct_source_value": null,
          "host_initialization": 4,
          "policy": "M0"
        },
        "source_gender": "male",
        "source_faction": "魏",
        "personal_lord_skills": [],
        "base_skill_count": 1,
        "granted_skill_count": 0,
        "skills": [
          {
            "type": "optional_phase_skip_and_optional_control",
            "timing": "Before own unskipped judge/draw/play/discard phase",
            "quota": "once per genuine eligible phase event, separate cost each; no global once/turn cap",
            "cost": "discard1 legal HAND card",
            "trigger_gate": "phase not preparation/end, not already skipped; owner has legalH",
            "targets": "draw:0..2 distinct other living H>0; play:two distinct actors as transfer endpoints",
            "effect": [
              "Pay1H then skip that phase. Judge/discard skip has no extra effect.",
              "If draw skipped this way, optionally gain1H from each selected0..2 other actors; action-order losses then combined gain.",
              "If play skipped this way, optionally move1E/J from one actor to another corresponding legal empty slot. Either endpoint may be self."
            ],
            "policy_refs": [
              "M1",
              "M2",
              "M3",
              "M4"
            ]
          }
        ]
      },
      "signature_sha256": "55463fb165f7c13c076c0a5a499012c4000f50335b22a54e023094bd8b24c0cb",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 82,
      "comparison_scope": "2026-10-15 captured 82-entity roster, including all 18 active originals; not entire-source-catalog certification",
      "reason": "Required unique combination:4HP + separately paid1HAND phase skips of judge/draw/play/discard, draw skip gains1H each from0..2 distinct OTHER actors, play skip moves1E/J between two distinct corresponding legal locations. Existing full equalHP packet lacks this full combination.",
      "same_name_collisions": []
    }
  },
  {
    "id": "sgs.adapted.base.hero.deng-ai",
    "source_name": "邓艾",
    "suggested_display_name": "邓艾",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·山",
    "snapshot_date": "2026-10-15",
    "source_faction": "魏",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "M0 normal-full-HP initialization policy; separate source initialHP unobserved",
    "gender": "male",
    "metadata_provenance": {
      "maxHP": "bwiki-dengai 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-dengai explicit 性别",
      "faction": "mobile-dengai explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "source_refs": [
      "mobile-dengai",
      "bwiki-dengai"
    ],
    "intrinsic_skill_inventory": [
      "屯田",
      "凿险"
    ],
    "granted_skill_inventory": [
      "急袭"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every identity inline panel including hidden panels read; none marked 主公技. Granted 急袭 is not 国战主将技.",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_base_inventory_ready_for_host_implementation_with_disclosed_procedural_policies",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Source skill inventory complete does not certify identity rules/rewards/victory scheduler.",
      "intrinsic_rules": "complete-source-packet-with-explicit-host-policies-under-final-validation",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "tuntian",
        "name": "屯田",
        "type": "optional_offturn_judgment_and_continuous_outgoing_distance",
        "timing": "After own actual H/E loss outside own turn",
        "quota": "one opportunity per loss event, no per-turn cap",
        "cost": "none",
        "trigger_gate": "actual offturn loss; not J/field-only",
        "targets": "self judgment; continuous owner->other distance",
        "effect": [
          "Optionally judge. Final nonheart judgment card becomes a public田 on own general; heart not gained.",
          "Owner outgoing distance to others reduces by number of fields; incoming distance unchanged.",
          "Distinct physical fields remain outside deck/discard while stored; no field count cap."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "bwiki-tuntian",
          "operator-dengai-faq",
          "ol-dengai-guide"
        ],
        "policy_refs": [
          "M5",
          "M6"
        ],
        "ui": "Offturn accept/pass; show final judgment and field card suit/rank; public pile and directional distance explanations."
      },
      {
        "id": "zaoxian",
        "name": "凿险",
        "type": "mandatory_once_game_awakening",
        "timing": "Own preparation phase",
        "quota": "once per game/skill binding",
        "cost": "maxHP-1, then clamp currentHP if needed",
        "trigger_gate": "not awakened and fields>=3",
        "targets": "self",
        "effect": [
          "Reduce maxHP1; then acquire急袭. Retain屯田.",
          "Fields are not consumed by awakening; threshold test before using any field; later falling below3 does not remove急袭."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "operator-dengai-faq"
        ],
        "policy_refs": [
          "M7",
          "M14"
        ],
        "grants": [
          "jixi"
        ],
        "ui": "Automatic awakening with permanent mark/maxHP change; grant panel visible immediately."
      },
      {
        "id": "jixi",
        "name": "急袭",
        "type": "granted_view_as_ordinary_trick",
        "timing": "Own play phase",
        "quota": "unlimited activations; one field per use",
        "cost": "one own actual田 as physical material, not discard cost",
        "trigger_gate": "already obtained急袭; a field and legal Snatch target",
        "targets": "one other living actor, effective distance1 after excluding selected field, has obtainableH/E/J",
        "effect": [
          "Use selected field as顺手牵羊; retain suit/rank/color/material identity.",
          "Go through normal target restrictions and Wuxie; if effective obtain exactly1 targetH/E/J into ownH.",
          "Committed material leaves field, spent even if nullified; no automatic return; no field counted for its own distance."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "operator-dengai-faq",
          "host-models"
        ],
        "policy_refs": [
          "M1",
          "M6",
          "M7",
          "M8",
          "M14"
        ],
        "granted_by": "zaoxian",
        "ui": "Field-material picker with post-material range preview; target zone choice respects hiddenH."
      }
    ],
    "ui_requirements": [
      "Show source variant/faction/HP/gender and entire intrinsic and granted skill packet",
      "Show costs, timing, phase use quota, awakening and removal state",
      "Accessible mobile dialogs, blind hand choices, private deck ordering, public fields",
      "Original art only; no copied publisher artwork"
    ],
    "excluded_variants": [
      "界/谋/势/SP/神 other namesakes",
      "国战 halfHP/general slots/资粮/遗志/天覆",
      "OL2020 balance changes",
      "十周年 or special1V1 variants"
    ],
    "name": "邓艾",
    "display_name": "邓艾",
    "skill_name": "屯田 / 凿险 / 急袭",
    "skill_desc": "屯田：回合外实际失去手牌或装备后，可判定；最终非红桃实体判定牌置为田，自己至他人的距离减田数。凿险：准备阶段田不少于3时，一局一次减1体力上限，保留田并获得急袭。急袭：可将一张田当顺手牵羊使用；距离须扣除所用田后检查。",
    "skill_ids": [
      "sgs.tuntian",
      "sgs.zaoxian"
    ],
    "intrinsic_skill_ids": [
      "sgs.tuntian",
      "sgs.zaoxian"
    ],
    "granted_skill_ids": [
      "sgs.jixi"
    ],
    "complete_skill_ids": [
      "sgs.tuntian",
      "sgs.zaoxian",
      "sgs.jixi"
    ],
    "complete_skill_names": [
      "屯田",
      "凿险",
      "急袭"
    ],
    "skill_ownership_policy": "skill_ids are initially owned intrinsic skills only; granted_skill_ids are documentation until a successful awakening grants a per-owner instance.",
    "source_skill_rules": [
      {
        "id": "tuntian",
        "name": "屯田",
        "type": "optional_offturn_judgment_and_continuous_outgoing_distance",
        "timing": "After own actual H/E loss outside own turn",
        "quota": "one opportunity per loss event, no per-turn cap",
        "cost": "none",
        "trigger_gate": "actual offturn loss; not J/field-only",
        "targets": "self judgment; continuous owner->other distance",
        "effect": [
          "Optionally judge. Final nonheart judgment card becomes a public田 on own general; heart not gained.",
          "Owner outgoing distance to others reduces by number of fields; incoming distance unchanged.",
          "Distinct physical fields remain outside deck/discard while stored; no field count cap."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "bwiki-tuntian",
          "operator-dengai-faq",
          "ol-dengai-guide"
        ],
        "policy_refs": [
          "M5",
          "M6"
        ],
        "ui": "Offturn accept/pass; show final judgment and field card suit/rank; public pile and directional distance explanations."
      },
      {
        "id": "zaoxian",
        "name": "凿险",
        "type": "mandatory_once_game_awakening",
        "timing": "Own preparation phase",
        "quota": "once per game/skill binding",
        "cost": "maxHP-1, then clamp currentHP if needed",
        "trigger_gate": "not awakened and fields>=3",
        "targets": "self",
        "effect": [
          "Reduce maxHP1; then acquire急袭. Retain屯田.",
          "Fields are not consumed by awakening; threshold test before using any field; later falling below3 does not remove急袭."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "operator-dengai-faq"
        ],
        "policy_refs": [
          "M7",
          "M14"
        ],
        "grants": [
          "jixi"
        ],
        "ui": "Automatic awakening with permanent mark/maxHP change; grant panel visible immediately."
      },
      {
        "id": "jixi",
        "name": "急袭",
        "type": "granted_view_as_ordinary_trick",
        "timing": "Own play phase",
        "quota": "unlimited activations; one field per use",
        "cost": "one own actual田 as physical material, not discard cost",
        "trigger_gate": "already obtained急袭; a field and legal Snatch target",
        "targets": "one other living actor, effective distance1 after excluding selected field, has obtainableH/E/J",
        "effect": [
          "Use selected field as顺手牵羊; retain suit/rank/color/material identity.",
          "Go through normal target restrictions and Wuxie; if effective obtain exactly1 targetH/E/J into ownH.",
          "Committed material leaves field, spent even if nullified; no automatic return; no field counted for its own distance."
        ],
        "source_refs": [
          "mobile-dengai",
          "bwiki-dengai",
          "operator-dengai-faq",
          "host-models"
        ],
        "policy_refs": [
          "M1",
          "M6",
          "M7",
          "M8",
          "M14"
        ],
        "granted_by": "zaoxian",
        "ui": "Field-material picker with post-material range preview; target zone choice respects hiddenH."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "runtime_validation_status": "release-blocked-until-parent-final-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "邓艾",
    "source_variant": "基础身份／神话再临·山+明示M0–M16江湖适配",
    "source_date": "2026-10-15目录快照；经典身份规则与有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-51.html",
      "https://wiki.biligame.com/msgs/邓艾",
      "https://wiki.biligame.com/msgs/屯田/邓艾",
      "https://my.4399.com/yxsgs/ziliao/6964/",
      "https://www.sanguosha.com/news/20140521_6817_2417"
    ],
    "source_ids": [
      "mobile-dengai",
      "bwiki-dengai",
      "bwiki-tuntian",
      "operator-dengai-faq",
      "ol-dengai-guide",
      "host-models"
    ],
    "source_record_id": "sgs.adapted.base.hero.deng-ai:2026-10-15",
    "faction": "魏",
    "source_gender": "male",
    "gender_provenance": {
      "maxHP": "bwiki-dengai 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-dengai explicit 性别",
      "faction": "mobile-dengai explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-dengai",
      "revision_id": 34837,
      "revision_timestamp_utc": "2025-12-05T14:30:33Z"
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-dengai",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-51.html",
        "publication_date": null,
        "sha256": "8d622c48bae50940fc86503482e8dada86ee380d0ac3af59b50cf7e3eebdb4fe",
        "limitations": [
          "No publication/revision date; only snapshot access date is known.",
          "The page has faction and matching identity skills, but omits numerical HP and explicit gender metadata. Biography pronouns are not used as game-gender certification."
        ]
      },
      {
        "id": "bwiki-dengai",
        "tier": "community_same_product_matching_base_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/邓艾",
        "revision_id": 34837,
        "revision_timestamp_utc": "2025-12-05T14:30:33Z",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId = RLCONF.wgCurRevisionId",
          "revision_id_line": 25,
          "timestamp_field": "meta[property=\"article:modified_time\"]",
          "timestamp_line": 50,
          "permanent_link_in_current_html": true,
          "revision_archive_reopened": false,
          "revision_archive_result": "HTTP 200 login gate, wgRevisionId=0; requires login; no bypass attempted",
          "transclusion_dates_independently_verified": false
        },
        "sha256": "0b51ca093e46c0b7fbedcad9e2621c2fde7d5f4ea53d2294ccee465b5eb86e11",
        "limitations": [
          "Secondary community metadata; neither official mobile numerical HP fields nor current-client observation.",
          "The public current article exposes revision and modified timestamp; explicit oldid URLs are login-gated.",
          "Page-level revision date does not separately date transcluded templates; capture date is the fixed snapshot date.",
          "No separate initial HP value is printed."
        ]
      },
      {
        "id": "bwiki-tuntian",
        "tier": "community_same_product_skill_page_selected_classic_section",
        "url": "https://wiki.biligame.com/msgs/屯田/邓艾",
        "revision_id": 32997,
        "revision_timestamp_utc": "2025-08-31T14:29:40Z",
        "sha256": "bc1e57cdc3e4c1637dab94bbf30ae318e5fba347d91437b928c80ae0f021aa69"
      },
      {
        "id": "operator-dengai-faq",
        "tier": "operator_cross_product_historical_matching_base_faq",
        "url": "https://my.4399.com/yxsgs/ziliao/6964/",
        "publication_date": "2020-08-13 19:13",
        "sha256": "47bc5ea4808d057de1d1f1a37b9a9a45f65c6109be288e844e7fc4a04188a5e0"
      },
      {
        "id": "ol-dengai-guide",
        "tier": "official_cross_product_historical_guide",
        "url": "https://www.sanguosha.com/news/20140521_6817_2417",
        "publication_date": "2014-05-21",
        "sha256": "47d4c096a0834549405927941157d7d2075a18067cce99dedda21d940d79c213"
      },
      {
        "id": "host-models",
        "tier": "existing_host_compatibility_contract_not_original_game_authority",
        "sha256": "f1e35e404e4a1d4a262e35841039f2280aa57f91e037e087f7025e4c7c579e5f"
      }
    ],
    "source_evidence_note": "官网身份技能（含隐藏面板）和势力已逐项读取；体力与性别来自对应手游社区经典身份显式字段。历史跨产品FAQ只佐证流程，当前移动客户端未实测；初始满体力为M0本作初始化约定。",
    "source_unknowns": [
      {
        "id": "U1",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "巧变",
          "屯田"
        ],
        "detail": "Exact nested movement-trigger scheduling is historically corroborated by matching base FAQs, not verified in current mobile client."
      },
      {
        "id": "U2",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "急袭"
        ],
        "detail": "Card expansion relies on host Snatch contract; same-product current-mobile full card rules page not separately captured. Spent field exclusion is historical matching-base FAQ."
      },
      {
        "id": "U3",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "志继",
          "观星"
        ],
        "detail": "Immediate same-preparation trigger is supported by historical FAQ; fullHP recovery-option gating, short-deck processing and pathological maxHP1 awaken are host policies not settled by selected mobile text."
      },
      {
        "id": "U4",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "断肠"
        ],
        "detail": "Broad acquired/lord/current-skill loss plus later reacquisition and pile cleanup use dated matching-base cross-product FAQ. Public mobile page certifies only all-general-skills core, not complete modern skill taxonomy/death scheduler."
      },
      {
        "id": "U5",
        "category": "cross_game_host_policy",
        "applies_to": [
          "all"
        ],
        "detail": "YXS易装 copied templates, foreign poison during costs, host delayed-card immunities and multi-copy holders are M1-M16 adaptation policies; never source-certified."
      },
      {
        "id": "U6",
        "category": "mode_pending",
        "applies_to": [
          "断肠"
        ],
        "detail": "Identity victory/terminal event priority, lord-skill relationships, and kill reward/penalty order require full identity mode integration; no personal lord skill is omitted from candidates."
      }
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-dengai"
      ],
      "revision_id": 34837,
      "revision_timestamp_utc": "2025-12-05T14:30:33Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "M0",
      "display_note": "体力上限依据移动版社区经典身份字段；官网未给数值HP。初始满体力是M0本作约定，非单独观察到的initialHP；未实测当前移动客户端。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.deng-ai",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "基础身份／神话再临·山",
      "source_character_name": "邓艾",
      "faction": "魏",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "M0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀邓艾",
      "邓艾·屯田·凿险",
      "deng-ai"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-mountain/deng-ai.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "M0",
        "title": "Initialization and source identity",
        "contract": "Use base maxHP4/4/4/3, source faction魏/魏/蜀/群 and male/male/male/female. Initialize full HP by normal host policy. A separate mobile initialHP field was not observed. Do not add identity-lord HP bonus in nonidentity host. Preserve source fields even when host faction differs.",
        "evidence": "Metadata same-product 经典, official faction; initialHP is initialization policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M1",
        "title": "Legal costs, privacy, and irreversible commitment",
        "contract": "Own cost: legal hand/equipment where skill says 一张牌; 巧变 explicitly hand only. Cannot use J or special piles unless named. Preview legal choices before cost; cancel before committing is free. Once cost paid and phase skipped/skill used, pass optional effect but never refund or resume phase. Invalid/stale payloads must not partially mutate. Unknown enemy H faces remain private; select blind index or seeded random identity.",
        "evidence": "Source explicit H vs generic cards; historical FAQs corroborate H/E versus J.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M2",
        "title": "Real phase event identities",
        "contract": "Offer Qiaobian once per actual judge/draw/play/discard phase-start-before-entry event, never preparation/end and never a phase already skipped. Pay separate1H each phase. Extra genuine phase gets its own event; duplicate/resumed UI does not. Skip judge retains attached delays; skip draw/play/discard suppresses entire phase and phase-only skills, not later phases. Face-down whole-turn skip bypasses all four windows.",
        "evidence": "BWiki classic exclusion plus operator2012 phase FAQ; extra-phase/cancellation is host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M3",
        "title": "Qiaobian hand movement order",
        "contract": "After paid draw skip optionally choose0..2 distinct OTHER living actors with H>0; no distance/team restriction, at most1 actual H each. Resolve target losses in current action/seat order, allowing loss triggers after each loss, then give all reserved cards to ZhangHe as one gain. No self-target, duplicate target, equipment or J, no two cards from sole opponent. Never steal cards gained after the chosen loss to replace reserved cards.",
        "evidence": "Operator2012 explicitly losses sequentially then combined gain; full trigger scheduler remains historical corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M4",
        "title": "Qiaobian corresponding-zone transfer",
        "contract": "After paid play skip optionally move exactly1 physical card E->same equipment subtype slot or J->J between two distinct living actors, either endpoint may be self. No distance/team check. Destination slot must be available and empty, no same-name delay duplicate, and delay-target immunity/prohibition checked. A move is not use/discard: no replacing occupied weapon, no Slash or normal trick use event and no Wuxie window just for the move. Keep original delay identity/material. Equipment leaving source triggers its legal loss effects once.",
        "evidence": "Official mobile corresponding-location text; operator2012 equipment/J and no replacement; cross-game slots and provenance are host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M5",
        "title": "Tuntian eligible movement events",
        "contract": "Offer one optional judgment per actual loss event from H/E outside owner turn, independent of cards in batch; J or field-only loss does not qualify. Responding, discarding, gifting, being stolen or comparing can qualify. Merely changing H->E within same owner is not a net loss of own cards. Loss must actually happen, no zero-size event. Nested distinct losses can each trigger; deduplicate by event id.",
        "evidence": "Mobile core offturn loss; operator2020 H/E vs J and batch FAQ. Own-zone and nested-event scheduler are host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M6",
        "title": "Judgment, fields and distance",
        "contract": "Tuntian uses a real modifiable judgment. After final judgment, nonheart actual surviving judgment card moves to public field pile, never draw an extra card/copy virtual shell; heart normally discarded, not gained (no OL2020 buff). Nonheart placement is mandatory once judgment chosen. Field cards stay out of reshuffle; no cap. Distance reduction is owner->other only, minimum1, stack normal distance modifiers.",
        "evidence": "Mobile final judgment and field text; official OL historical outgoing direction; operator2020 field persistence. Card capture priorities with other gain skills remain host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M7",
        "title": "Awakening state and bindings",
        "contract": "Zaoxian and Zhiji are mandatory once per actor-and-source-template binding for the game; marks persist after reload, phase loops and repeated adoption of the same template. Lower maxHP1 and clamp currentHP only when above new maximum; no separate damage event. Keep original skills unless text removes them. Granted skill is bound to this skill-owner character, not global hero name, and survives normal turns. Host copy/transform needs a stable per-actor binding, not awakening-state copied from the dead source actor. Losing source/granted general skills must not let an effective-hero getter recreate them. A maxHP<=1 awakening or external reacquisition/reset is an unresolved intrinsic corner; explicitly gate/test policy, never silently certify.",
        "evidence": "Official mobile awakening order; operator JiangWei once/game. Cross-game copying and low-maxHP not mobile-certified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M8",
        "title": "Jixi full virtual Snatch contract",
        "contract": "Only an actual owned field physical card is material. In own play phase may repeat without printed quota while legal fields/targets remain. Preview target with spent field excluded from field distance reduction; then commit field->processing once, use ordinary Snatch retaining material suit/rank/color. Target exactly1 other living actor in effective distance1, with obtainable H/E/J; no weapon range substitution, no self, not enemy-only. Respect Snatch immunity/prohibitions and normal Wuxie. On resolve gain one target H/E/J into own H; on cancellation/immunity gain none, material still spent. Final actual material goes to discard or another legitimate claim, never returns automatically to field. No auto-use at awakening.",
        "evidence": "Mobile grants 田-as-顺手牵羊; operator2020 consumed field excluded from distance. Expanded ordinary card behavior uses existing host Snatch compatibility, NOT separately certified current-mobile card record.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M9",
        "title": "Tiaoxin target and Slash response",
        "contract": "Choose exactly1 OTHER living actor whose attack range contains owner, using actor->owner distance and actor current weapon. This gate differs from whether a Slash is prohibited or actor has H/E. Once per actual play phase, mark spent on legal commitment even if target has no cards/no result. Target can voluntarily use1 legal Slash incl view-as or decline. This is actual out-of-turn USE aimed at JiangWei, not a pure response nor damage: usual targeting, weapon/armor, Shan and triggers; does not consume target normal play-phase Slash count. If target used Slash, no discard even if dodged/no damage. Only when no Slash was used, JiangWei chooses1 target H/E to discard; never J. No legal H/E means no further effect.",
        "evidence": "Mobile+BWiki target gate; operator2020 real Slash and H/E-only FAQ. Extra phase quota and host out-of-turn counter contract explicit.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M10",
        "title": "Zhiji and Guanxing order",
        "contract": "At own preparation with H0, first choose recover1 if wounded OR draw2; fullHP recovery option is disabled under explicit host legal-choice policy. Then maxHP-1, clamp, gain normal Guanxing. Allow one optional Guanxing in this same preparation after awakening; later genuine preparation events allow it again. Let X=min(5,living actors including self). Privately inspect exactlyX top cards; choose any subset ordered atop and all others ordered below, no gain/discard/draw, all-top/all-bottom legal. Respect deck top orientation; do not reveal to AI opponents or logs. No Jie end-phase extra trigger, no automatic5 when fewer live actors.",
        "evidence": "Mobile exact core and BWiki alive count/order; operator2020 same-prep and recovery-before-clamp. FullHP recovery disabled is a conservative host legal-choice policy, not certified by the selected mobile text; exhaustive short-deck handling is host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M11",
        "title": "Beige damage-event semantics",
        "contract": "One optional1H/E discard and1 judgment per qualifying positive Slash damage EVENT, not per damage point. Owner and injured actor must still be alive after rescue; self-injured survivor is allowed by mobile 一名角色. Judge belongs to injured actor, so its suit modifiers apply. Final heart heals injured1, diamond draws injured2, club makes actual source discard2H/E of its choice, shortfall all eligible; spade toggles actual source face. No source/dead source leaves club/spade without effect but does not suppress heart/diamond. Face-down toggles to face-up; flipping midturn does not end turn.",
        "evidence": "Mobile core suits; operator2020 event and rescue FAQ; source survival/missing-source branch is explicit host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M12",
        "title": "Slash cause attribution and cost interruptions",
        "contract": "Keep original Slash card/use id through host transfer/elemental-chain damage. Proposed host treats each surviving Slash-origin damage recipient event as Beige-eligible, but current mobile chained/transferred attribution is not certified. Cost poison/equipment-loss triggers complete first; if owner or victim dies, no illegal judgment; paid cost never refunded. Each actual holder can get one opportunity in action order; multiple copied holders need policy, not invented source fact.",
        "evidence": "Official text only says Slash-caused damage; chained/transferred/cost poison/multiple copies remain cross-game host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M13",
        "title": "Duanchang current general-skill removal",
        "contract": "At final CaiWenJi death from a known killer/damage source, locked effect strips ALL killer current general skills: innate, locked, awakened/granted, borrowed/copied and active personal lord skills. Equipment-granted skills stay. This is removal without turn-end expiry, not generic all-future-acquisition ban: valid later acquisition can add a new skill. Preserve maxHP, identity, team and equipment. Stop future continuous/trigger effects of removed skills; already-resolved non-skill effects may finish. Clean private skill piles when their owning skill is lost (DengAi fields discard); do not duplicate/discard cards twice.",
        "evidence": "Mobile ALL general skills; historical operator2020 acquired/lord/equipment distinction, fields and futureChanyuan. Borrowed foreign template binding beyond ZuoCi analogy is host policy, current-mobile detailed semantics unverified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M14",
        "title": "Removal, copying and future reacquisition ledger",
        "contract": "Host must distinguish actor original skills, current transformed skills, granted skills and equipment providers. Duanchang removes present general-skill instances and copy-grant abilities so recomputation/reload cannot resurrect them. It does not reset awakened marks, refill limited counts, regrant source-owner skills, erase equipment skills, or block a separately authorized future acquisition. Cancels uncommitted prompts tied to removed skill; committed effects follow recorded source context if still legal. Copying a dead DengAi/JiangWei begins that actor own awakening lifecycle without imported fields/awakening memory; copying CaiWenJi grants both skills. These choices are explicit cross-game host contract.",
        "evidence": "No official mobile rule for YXS易装; historical acquired/borrowed examples only corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M15",
        "title": "Death and identity mode boundary",
        "contract": "Do not fabricate a killer for HP loss, poison loss or sourceless death; Duanchang has no recipient then. Historical identity sequence reveals identity/checks terminal game before some death skills, then ordered death skills and rewards. Existing host without this full identity scheduler can test general-skill removal, but cannot claim complete identity death/reward/victory implementation. No candidate has a personal lord skill. Future identity mode must retain faction/lord status, lord-skill sharing and removal, reward/penalty ordering, terminal outcome priority.",
        "evidence": "Mobile death+killer core; operator2020 identity death examples only; source death scheduler and host terminal-priority decisions remain mode pending.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M16",
        "title": "UI, save/replay and original naming",
        "contract": "Show complete base and granted skill text, locked/awakening markers, exact target/cost/range/quota reasons, public field physical cards, face status, per-owner awakened state and removed-skill marker. Preserve deterministic AI/manual/replay/snapshot choices and no hidden hand/top-deck leakage. New source姜维 gets name姜维; rename only original jianghu.classic.hero.jiang-wei display to proposed粮川 at implementation, leaving stable ID/mechanics/internal legacy name and aliases. Never rename source hero, merge merely by same name, or apply rename before candidate added.",
        "evidence": "Host acceptance contract; no game files edited by research.",
        "status": "proposed_host_policy"
      }
    ],
    "adaptation_notes": "完整基础身份技能及觉醒后技能均保留；M0–M16明确满血初始化、真实阶段、实体田、后得技能、当前武将技能删除及跨作处理。当前客户端与完整身份模式未核验；不混用界、国战、OL2020改版。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "屯田",
        "凿险",
        "急袭"
      ],
      "complete_signature": {
        "intrinsic_max_hp": 4,
        "initial_hp": {
          "direct_source_value": null,
          "host_initialization": 4,
          "policy": "M0"
        },
        "source_gender": "male",
        "source_faction": "魏",
        "personal_lord_skills": [],
        "base_skill_count": 2,
        "granted_skill_count": 1,
        "skills": [
          {
            "type": "optional_offturn_judgment_and_continuous_outgoing_distance",
            "timing": "After own actual H/E loss outside own turn",
            "quota": "one opportunity per loss event, no per-turn cap",
            "cost": "none",
            "trigger_gate": "actual offturn loss; not J/field-only",
            "targets": "self judgment; continuous owner->other distance",
            "effect": [
              "Optionally judge. Final nonheart judgment card becomes a public田 on own general; heart not gained.",
              "Owner outgoing distance to others reduces by number of fields; incoming distance unchanged.",
              "Distinct physical fields remain outside deck/discard while stored; no field count cap."
            ],
            "policy_refs": [
              "M5",
              "M6"
            ]
          },
          {
            "type": "mandatory_once_game_awakening",
            "timing": "Own preparation phase",
            "quota": "once per game/skill binding",
            "cost": "maxHP-1, then clamp currentHP if needed",
            "trigger_gate": "not awakened and fields>=3",
            "targets": "self",
            "effect": [
              "Reduce maxHP1; then acquire急袭. Retain屯田.",
              "Fields are not consumed by awakening; threshold test before using any field; later falling below3 does not remove急袭."
            ],
            "policy_refs": [
              "M7",
              "M14"
            ],
            "grants": [
              "jixi"
            ]
          },
          {
            "type": "granted_view_as_ordinary_trick",
            "timing": "Own play phase",
            "quota": "unlimited activations; one field per use",
            "cost": "one own actual田 as physical material, not discard cost",
            "trigger_gate": "already obtained急袭; a field and legal Snatch target",
            "targets": "one other living actor, effective distance1 after excluding selected field, has obtainableH/E/J",
            "effect": [
              "Use selected field as顺手牵羊; retain suit/rank/color/material identity.",
              "Go through normal target restrictions and Wuxie; if effective obtain exactly1 targetH/E/J into ownH.",
              "Committed material leaves field, spent even if nullified; no automatic return; no field counted for its own distance."
            ],
            "policy_refs": [
              "M1",
              "M6",
              "M7",
              "M8",
              "M14"
            ],
            "granted_by": "zaoxian"
          }
        ]
      },
      "signature_sha256": "d34a465e34cf3dc4d59913143d1c04641748af1cf4343570aa9754050b16dbfb",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 82,
      "comparison_scope": "2026-10-15 captured 82-entity roster, including all 18 active originals; not entire-source-catalog certification",
      "reason": "Required unique combination:4HP + optional offturn H/E-loss-event nonheart-judgment physical田 pile/outgoing distance-N; own-prep>=3fields one-shot maxHP-1 awakening to repeated field-as-Snatch, spent field excluded. No inspected existing equalHP full packet has any田 resource lifecycle.",
      "same_name_collisions": []
    }
  },
  {
    "id": "sgs.adapted.base.hero.jiang-wei",
    "source_name": "姜维",
    "suggested_display_name": "姜维",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·山",
    "snapshot_date": "2026-10-15",
    "source_faction": "蜀",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "M0 normal-full-HP initialization policy; separate source initialHP unobserved",
    "gender": "male",
    "metadata_provenance": {
      "maxHP": "bwiki-jiangwei 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-jiangwei explicit 性别",
      "faction": "mobile-jiangwei explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "source_refs": [
      "mobile-jiangwei",
      "bwiki-jiangwei"
    ],
    "intrinsic_skill_inventory": [
      "挑衅",
      "志继"
    ],
    "granted_skill_inventory": [
      "观星"
    ],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every identity inline panel including hidden panels read; none marked 主公技. Granted 急袭 is not 国战主将技.",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_base_inventory_ready_for_host_implementation_with_disclosed_procedural_policies",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Source skill inventory complete does not certify identity rules/rewards/victory scheduler.",
      "intrinsic_rules": "complete-source-packet-with-explicit-host-policies-under-final-validation",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "tiaoxin",
        "name": "挑衅",
        "type": "optional_active_forced_choice",
        "timing": "Own play phase",
        "quota": "once per actual play phase",
        "cost": "none",
        "trigger_gate": "a distinct other actor whose attack range contains owner",
        "targets": "one such other living actor, not necessarily enemy or holding cards",
        "effect": [
          "Target may USE one legal Slash against姜维 including legal view-as Slash. Resolve normally with responses and damage.",
          "If target did not use Slash,姜维 discards one targetH/E if any. Never targetJ.",
          "If target used Slash but it was dodged or prevented, no discard."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "operator-jiangwei-faq",
          "mobile-guide147"
        ],
        "policy_refs": [
          "M1",
          "M9"
        ],
        "ui": "Show reciprocal range condition and spent-phase count; target choosesSlash/pass; owner choosesH/E only on failure."
      },
      {
        "id": "zhiji",
        "name": "志继",
        "type": "mandatory_once_game_awakening",
        "timing": "Own preparation phase",
        "quota": "once per game/skill binding",
        "cost": "maxHP-1 AFTER choice effect",
        "trigger_gate": "not awakened; own HAND count0; equipment/storage do not count",
        "targets": "self",
        "effect": [
          "Choose recover1 if wounded or draw2 first. Then maxHP-1 and clamp; obtain normal观星, retain挑衅.",
          "Can use acquired观星 during same preparation. No end-phase awakening."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "bwiki-zhiji",
          "operator-jiangwei-faq"
        ],
        "policy_refs": [
          "M7",
          "M10",
          "M14"
        ],
        "grants": [
          "guanxing"
        ],
        "ui": "Mandatory heal/draw choice with reason if heal unavailable; show order and same-preparation Guanxing prompt."
      },
      {
        "id": "guanxing",
        "name": "观星",
        "type": "granted_optional_private_top_bottom_ordering",
        "timing": "Own preparation phase, including same preparation after志继",
        "quota": "one opportunity per genuine preparation event",
        "cost": "none",
        "trigger_gate": "already owns观星",
        "targets": "self only; X=min(5,living actor count)",
        "effect": [
          "Privately inspect topX actual deck cards; put any number in chosen order atop, remaining in chosen order below.",
          "All top or all bottom valid; no card gained or discarded; no public reveal.",
          "No Jie end-phase trigger or minimum5 in small tables."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "operator-jiangwei-faq"
        ],
        "policy_refs": [
          "M7",
          "M10",
          "M14"
        ],
        "granted_by": "zhiji",
        "ui": "Private ordered top/bottom trays with explicit next-draw direction; commit exact permutation, supports cancel before viewing only or unchanged return policy."
      }
    ],
    "ui_requirements": [
      "Show source variant/faction/HP/gender and entire intrinsic and granted skill packet",
      "Show costs, timing, phase use quota, awakening and removal state",
      "Accessible mobile dialogs, blind hand choices, private deck ordering, public fields",
      "Original art only; no copied publisher artwork"
    ],
    "excluded_variants": [
      "界/谋/势/SP/神 other namesakes",
      "国战 halfHP/general slots/资粮/遗志/天覆",
      "OL2020 balance changes",
      "十周年 or special1V1 variants"
    ],
    "name": "姜维",
    "display_name": "姜维",
    "skill_name": "挑衅 / 志继 / 观星",
    "skill_desc": "挑衅：每出牌阶段1次，选择攻击范围内含有自己的另一角色，其可对自己实际使用杀；未使用则弃其1张手牌或装备，使用后被闪不再弃牌。志继：准备阶段无手牌时，一局一次先回复1或摸2，再减1体力上限并获得普通观星。观星：准备阶段私看至多存活人数且最多5张牌，任意排序置顶或底。",
    "skill_ids": [
      "sgs.tiaoxin",
      "sgs.zhiji"
    ],
    "intrinsic_skill_ids": [
      "sgs.tiaoxin",
      "sgs.zhiji"
    ],
    "granted_skill_ids": [
      "sgs.guanxing"
    ],
    "complete_skill_ids": [
      "sgs.tiaoxin",
      "sgs.zhiji",
      "sgs.guanxing"
    ],
    "complete_skill_names": [
      "挑衅",
      "志继",
      "观星"
    ],
    "skill_ownership_policy": "skill_ids are initially owned intrinsic skills only; granted_skill_ids are documentation until a successful awakening grants a per-owner instance.",
    "source_skill_rules": [
      {
        "id": "tiaoxin",
        "name": "挑衅",
        "type": "optional_active_forced_choice",
        "timing": "Own play phase",
        "quota": "once per actual play phase",
        "cost": "none",
        "trigger_gate": "a distinct other actor whose attack range contains owner",
        "targets": "one such other living actor, not necessarily enemy or holding cards",
        "effect": [
          "Target may USE one legal Slash against姜维 including legal view-as Slash. Resolve normally with responses and damage.",
          "If target did not use Slash,姜维 discards one targetH/E if any. Never targetJ.",
          "If target used Slash but it was dodged or prevented, no discard."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "operator-jiangwei-faq",
          "mobile-guide147"
        ],
        "policy_refs": [
          "M1",
          "M9"
        ],
        "ui": "Show reciprocal range condition and spent-phase count; target choosesSlash/pass; owner choosesH/E only on failure."
      },
      {
        "id": "zhiji",
        "name": "志继",
        "type": "mandatory_once_game_awakening",
        "timing": "Own preparation phase",
        "quota": "once per game/skill binding",
        "cost": "maxHP-1 AFTER choice effect",
        "trigger_gate": "not awakened; own HAND count0; equipment/storage do not count",
        "targets": "self",
        "effect": [
          "Choose recover1 if wounded or draw2 first. Then maxHP-1 and clamp; obtain normal观星, retain挑衅.",
          "Can use acquired观星 during same preparation. No end-phase awakening."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "bwiki-zhiji",
          "operator-jiangwei-faq"
        ],
        "policy_refs": [
          "M7",
          "M10",
          "M14"
        ],
        "grants": [
          "guanxing"
        ],
        "ui": "Mandatory heal/draw choice with reason if heal unavailable; show order and same-preparation Guanxing prompt."
      },
      {
        "id": "guanxing",
        "name": "观星",
        "type": "granted_optional_private_top_bottom_ordering",
        "timing": "Own preparation phase, including same preparation after志继",
        "quota": "one opportunity per genuine preparation event",
        "cost": "none",
        "trigger_gate": "already owns观星",
        "targets": "self only; X=min(5,living actor count)",
        "effect": [
          "Privately inspect topX actual deck cards; put any number in chosen order atop, remaining in chosen order below.",
          "All top or all bottom valid; no card gained or discarded; no public reveal.",
          "No Jie end-phase trigger or minimum5 in small tables."
        ],
        "source_refs": [
          "mobile-jiangwei",
          "bwiki-jiangwei",
          "operator-jiangwei-faq"
        ],
        "policy_refs": [
          "M7",
          "M10",
          "M14"
        ],
        "granted_by": "zhiji",
        "ui": "Private ordered top/bottom trays with explicit next-draw direction; commit exact permutation, supports cancel before viewing only or unchanged return policy."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "runtime_validation_status": "release-blocked-until-parent-final-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "姜维",
    "source_variant": "基础身份／神话再临·山+明示M0–M16江湖适配",
    "source_date": "2026-10-15目录快照；经典身份规则与有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-52.html",
      "https://wiki.biligame.com/msgs/姜维",
      "https://my.4399.com/yxxsgs/ziliao/6967",
      "https://www.sanguosha.cn/pc/guide-info-147.html",
      "https://wiki.biligame.com/msgs/志继/姜维"
    ],
    "source_ids": [
      "mobile-jiangwei",
      "bwiki-jiangwei",
      "operator-jiangwei-faq",
      "mobile-guide147",
      "bwiki-zhiji"
    ],
    "source_record_id": "sgs.adapted.base.hero.jiang-wei:2026-10-15",
    "faction": "蜀",
    "source_gender": "male",
    "gender_provenance": {
      "maxHP": "bwiki-jiangwei 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-jiangwei explicit 性别",
      "faction": "mobile-jiangwei explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-jiangwei",
      "revision_id": 35428,
      "revision_timestamp_utc": "2025-12-30T07:37:23Z"
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-jiangwei",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-52.html",
        "publication_date": null,
        "sha256": "167f106a8842225b581938d2f303a38aa2626cd5c7ecb271cf032355f875df1a",
        "limitations": [
          "No publication/revision date; only snapshot access date is known.",
          "The page has faction and matching identity skills, but omits numerical HP and explicit gender metadata. Biography pronouns are not used as game-gender certification."
        ]
      },
      {
        "id": "bwiki-jiangwei",
        "tier": "community_same_product_matching_base_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/姜维",
        "revision_id": 35428,
        "revision_timestamp_utc": "2025-12-30T07:37:23Z",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId = RLCONF.wgCurRevisionId",
          "revision_id_line": 25,
          "timestamp_field": "meta[property=\"article:modified_time\"]",
          "timestamp_line": 50,
          "permanent_link_in_current_html": true,
          "revision_archive_reopened": false,
          "revision_archive_result": "HTTP 200 login gate, wgRevisionId=0; requires login; no bypass attempted",
          "transclusion_dates_independently_verified": false
        },
        "sha256": "fffbddd7216394d56ac538fe2202d8e0214d5ce9d58040e869c0adfc019d26dc",
        "limitations": [
          "Secondary community metadata; neither official mobile numerical HP fields nor current-client observation.",
          "The public current article exposes revision and modified timestamp; explicit oldid URLs are login-gated.",
          "Page-level revision date does not separately date transcluded templates; capture date is the fixed snapshot date.",
          "No separate initial HP value is printed."
        ]
      },
      {
        "id": "operator-jiangwei-faq",
        "tier": "operator_cross_product_historical_matching_base_faq",
        "url": "https://my.4399.com/yxxsgs/ziliao/6967",
        "publication_date": "2020-08-13 19:13",
        "sha256": "8f598f3ae4df99dadee4726c52b183b6a7893d53cf1ebc6da8f717fe90f90b3e"
      },
      {
        "id": "mobile-guide147",
        "tier": "official_same_product_historical_variant_comparison",
        "url": "https://www.sanguosha.cn/pc/guide-info-147.html",
        "publication_date": "2023-07-05 10:22:10",
        "sha256": "db58399b16c2d148829b7d800ec00c298d25ea195c9e1bacd77dc17945e1b384"
      },
      {
        "id": "bwiki-zhiji",
        "tier": "community_same_product_skill_page_selected_classic_section",
        "url": "https://wiki.biligame.com/msgs/志继/姜维",
        "revision_id": 38617,
        "revision_timestamp_utc": "2026-06-05T01:11:31Z",
        "sha256": "802fb43ca61c358cac2504c4fe807d3f976fd484dd62a0272809437e38b5f3be"
      }
    ],
    "source_evidence_note": "官网身份技能（含隐藏面板）和势力已逐项读取；体力与性别来自对应手游社区经典身份显式字段。历史跨产品FAQ只佐证流程，当前移动客户端未实测；初始满体力为M0本作初始化约定。",
    "source_unknowns": [
      {
        "id": "U1",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "巧变",
          "屯田"
        ],
        "detail": "Exact nested movement-trigger scheduling is historically corroborated by matching base FAQs, not verified in current mobile client."
      },
      {
        "id": "U2",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "急袭"
        ],
        "detail": "Card expansion relies on host Snatch contract; same-product current-mobile full card rules page not separately captured. Spent field exclusion is historical matching-base FAQ."
      },
      {
        "id": "U3",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "志继",
          "观星"
        ],
        "detail": "Immediate same-preparation trigger is supported by historical FAQ; fullHP recovery-option gating, short-deck processing and pathological maxHP1 awaken are host policies not settled by selected mobile text."
      },
      {
        "id": "U4",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "断肠"
        ],
        "detail": "Broad acquired/lord/current-skill loss plus later reacquisition and pile cleanup use dated matching-base cross-product FAQ. Public mobile page certifies only all-general-skills core, not complete modern skill taxonomy/death scheduler."
      },
      {
        "id": "U5",
        "category": "cross_game_host_policy",
        "applies_to": [
          "all"
        ],
        "detail": "YXS易装 copied templates, foreign poison during costs, host delayed-card immunities and multi-copy holders are M1-M16 adaptation policies; never source-certified."
      },
      {
        "id": "U6",
        "category": "mode_pending",
        "applies_to": [
          "断肠"
        ],
        "detail": "Identity victory/terminal event priority, lord-skill relationships, and kill reward/penalty order require full identity mode integration; no personal lord skill is omitted from candidates."
      }
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-jiangwei"
      ],
      "revision_id": 35428,
      "revision_timestamp_utc": "2025-12-30T07:37:23Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "M0",
      "display_note": "体力上限依据移动版社区经典身份字段；官网未给数值HP。初始满体力是M0本作约定，非单独观察到的initialHP；未实测当前移动客户端。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.jiang-wei",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "基础身份／神话再临·山",
      "source_character_name": "姜维",
      "faction": "蜀",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "M0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀姜维",
      "姜维·挑衅·志继",
      "jiang-wei"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-mountain/jiang-wei.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "M0",
        "title": "Initialization and source identity",
        "contract": "Use base maxHP4/4/4/3, source faction魏/魏/蜀/群 and male/male/male/female. Initialize full HP by normal host policy. A separate mobile initialHP field was not observed. Do not add identity-lord HP bonus in nonidentity host. Preserve source fields even when host faction differs.",
        "evidence": "Metadata same-product 经典, official faction; initialHP is initialization policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M1",
        "title": "Legal costs, privacy, and irreversible commitment",
        "contract": "Own cost: legal hand/equipment where skill says 一张牌; 巧变 explicitly hand only. Cannot use J or special piles unless named. Preview legal choices before cost; cancel before committing is free. Once cost paid and phase skipped/skill used, pass optional effect but never refund or resume phase. Invalid/stale payloads must not partially mutate. Unknown enemy H faces remain private; select blind index or seeded random identity.",
        "evidence": "Source explicit H vs generic cards; historical FAQs corroborate H/E versus J.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M2",
        "title": "Real phase event identities",
        "contract": "Offer Qiaobian once per actual judge/draw/play/discard phase-start-before-entry event, never preparation/end and never a phase already skipped. Pay separate1H each phase. Extra genuine phase gets its own event; duplicate/resumed UI does not. Skip judge retains attached delays; skip draw/play/discard suppresses entire phase and phase-only skills, not later phases. Face-down whole-turn skip bypasses all four windows.",
        "evidence": "BWiki classic exclusion plus operator2012 phase FAQ; extra-phase/cancellation is host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M3",
        "title": "Qiaobian hand movement order",
        "contract": "After paid draw skip optionally choose0..2 distinct OTHER living actors with H>0; no distance/team restriction, at most1 actual H each. Resolve target losses in current action/seat order, allowing loss triggers after each loss, then give all reserved cards to ZhangHe as one gain. No self-target, duplicate target, equipment or J, no two cards from sole opponent. Never steal cards gained after the chosen loss to replace reserved cards.",
        "evidence": "Operator2012 explicitly losses sequentially then combined gain; full trigger scheduler remains historical corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M4",
        "title": "Qiaobian corresponding-zone transfer",
        "contract": "After paid play skip optionally move exactly1 physical card E->same equipment subtype slot or J->J between two distinct living actors, either endpoint may be self. No distance/team check. Destination slot must be available and empty, no same-name delay duplicate, and delay-target immunity/prohibition checked. A move is not use/discard: no replacing occupied weapon, no Slash or normal trick use event and no Wuxie window just for the move. Keep original delay identity/material. Equipment leaving source triggers its legal loss effects once.",
        "evidence": "Official mobile corresponding-location text; operator2012 equipment/J and no replacement; cross-game slots and provenance are host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M5",
        "title": "Tuntian eligible movement events",
        "contract": "Offer one optional judgment per actual loss event from H/E outside owner turn, independent of cards in batch; J or field-only loss does not qualify. Responding, discarding, gifting, being stolen or comparing can qualify. Merely changing H->E within same owner is not a net loss of own cards. Loss must actually happen, no zero-size event. Nested distinct losses can each trigger; deduplicate by event id.",
        "evidence": "Mobile core offturn loss; operator2020 H/E vs J and batch FAQ. Own-zone and nested-event scheduler are host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M6",
        "title": "Judgment, fields and distance",
        "contract": "Tuntian uses a real modifiable judgment. After final judgment, nonheart actual surviving judgment card moves to public field pile, never draw an extra card/copy virtual shell; heart normally discarded, not gained (no OL2020 buff). Nonheart placement is mandatory once judgment chosen. Field cards stay out of reshuffle; no cap. Distance reduction is owner->other only, minimum1, stack normal distance modifiers.",
        "evidence": "Mobile final judgment and field text; official OL historical outgoing direction; operator2020 field persistence. Card capture priorities with other gain skills remain host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M7",
        "title": "Awakening state and bindings",
        "contract": "Zaoxian and Zhiji are mandatory once per actor-and-source-template binding for the game; marks persist after reload, phase loops and repeated adoption of the same template. Lower maxHP1 and clamp currentHP only when above new maximum; no separate damage event. Keep original skills unless text removes them. Granted skill is bound to this skill-owner character, not global hero name, and survives normal turns. Host copy/transform needs a stable per-actor binding, not awakening-state copied from the dead source actor. Losing source/granted general skills must not let an effective-hero getter recreate them. A maxHP<=1 awakening or external reacquisition/reset is an unresolved intrinsic corner; explicitly gate/test policy, never silently certify.",
        "evidence": "Official mobile awakening order; operator JiangWei once/game. Cross-game copying and low-maxHP not mobile-certified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M8",
        "title": "Jixi full virtual Snatch contract",
        "contract": "Only an actual owned field physical card is material. In own play phase may repeat without printed quota while legal fields/targets remain. Preview target with spent field excluded from field distance reduction; then commit field->processing once, use ordinary Snatch retaining material suit/rank/color. Target exactly1 other living actor in effective distance1, with obtainable H/E/J; no weapon range substitution, no self, not enemy-only. Respect Snatch immunity/prohibitions and normal Wuxie. On resolve gain one target H/E/J into own H; on cancellation/immunity gain none, material still spent. Final actual material goes to discard or another legitimate claim, never returns automatically to field. No auto-use at awakening.",
        "evidence": "Mobile grants 田-as-顺手牵羊; operator2020 consumed field excluded from distance. Expanded ordinary card behavior uses existing host Snatch compatibility, NOT separately certified current-mobile card record.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M9",
        "title": "Tiaoxin target and Slash response",
        "contract": "Choose exactly1 OTHER living actor whose attack range contains owner, using actor->owner distance and actor current weapon. This gate differs from whether a Slash is prohibited or actor has H/E. Once per actual play phase, mark spent on legal commitment even if target has no cards/no result. Target can voluntarily use1 legal Slash incl view-as or decline. This is actual out-of-turn USE aimed at JiangWei, not a pure response nor damage: usual targeting, weapon/armor, Shan and triggers; does not consume target normal play-phase Slash count. If target used Slash, no discard even if dodged/no damage. Only when no Slash was used, JiangWei chooses1 target H/E to discard; never J. No legal H/E means no further effect.",
        "evidence": "Mobile+BWiki target gate; operator2020 real Slash and H/E-only FAQ. Extra phase quota and host out-of-turn counter contract explicit.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M10",
        "title": "Zhiji and Guanxing order",
        "contract": "At own preparation with H0, first choose recover1 if wounded OR draw2; fullHP recovery option is disabled under explicit host legal-choice policy. Then maxHP-1, clamp, gain normal Guanxing. Allow one optional Guanxing in this same preparation after awakening; later genuine preparation events allow it again. Let X=min(5,living actors including self). Privately inspect exactlyX top cards; choose any subset ordered atop and all others ordered below, no gain/discard/draw, all-top/all-bottom legal. Respect deck top orientation; do not reveal to AI opponents or logs. No Jie end-phase extra trigger, no automatic5 when fewer live actors.",
        "evidence": "Mobile exact core and BWiki alive count/order; operator2020 same-prep and recovery-before-clamp. FullHP recovery disabled is a conservative host legal-choice policy, not certified by the selected mobile text; exhaustive short-deck handling is host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M11",
        "title": "Beige damage-event semantics",
        "contract": "One optional1H/E discard and1 judgment per qualifying positive Slash damage EVENT, not per damage point. Owner and injured actor must still be alive after rescue; self-injured survivor is allowed by mobile 一名角色. Judge belongs to injured actor, so its suit modifiers apply. Final heart heals injured1, diamond draws injured2, club makes actual source discard2H/E of its choice, shortfall all eligible; spade toggles actual source face. No source/dead source leaves club/spade without effect but does not suppress heart/diamond. Face-down toggles to face-up; flipping midturn does not end turn.",
        "evidence": "Mobile core suits; operator2020 event and rescue FAQ; source survival/missing-source branch is explicit host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M12",
        "title": "Slash cause attribution and cost interruptions",
        "contract": "Keep original Slash card/use id through host transfer/elemental-chain damage. Proposed host treats each surviving Slash-origin damage recipient event as Beige-eligible, but current mobile chained/transferred attribution is not certified. Cost poison/equipment-loss triggers complete first; if owner or victim dies, no illegal judgment; paid cost never refunded. Each actual holder can get one opportunity in action order; multiple copied holders need policy, not invented source fact.",
        "evidence": "Official text only says Slash-caused damage; chained/transferred/cost poison/multiple copies remain cross-game host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M13",
        "title": "Duanchang current general-skill removal",
        "contract": "At final CaiWenJi death from a known killer/damage source, locked effect strips ALL killer current general skills: innate, locked, awakened/granted, borrowed/copied and active personal lord skills. Equipment-granted skills stay. This is removal without turn-end expiry, not generic all-future-acquisition ban: valid later acquisition can add a new skill. Preserve maxHP, identity, team and equipment. Stop future continuous/trigger effects of removed skills; already-resolved non-skill effects may finish. Clean private skill piles when their owning skill is lost (DengAi fields discard); do not duplicate/discard cards twice.",
        "evidence": "Mobile ALL general skills; historical operator2020 acquired/lord/equipment distinction, fields and futureChanyuan. Borrowed foreign template binding beyond ZuoCi analogy is host policy, current-mobile detailed semantics unverified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M14",
        "title": "Removal, copying and future reacquisition ledger",
        "contract": "Host must distinguish actor original skills, current transformed skills, granted skills and equipment providers. Duanchang removes present general-skill instances and copy-grant abilities so recomputation/reload cannot resurrect them. It does not reset awakened marks, refill limited counts, regrant source-owner skills, erase equipment skills, or block a separately authorized future acquisition. Cancels uncommitted prompts tied to removed skill; committed effects follow recorded source context if still legal. Copying a dead DengAi/JiangWei begins that actor own awakening lifecycle without imported fields/awakening memory; copying CaiWenJi grants both skills. These choices are explicit cross-game host contract.",
        "evidence": "No official mobile rule for YXS易装; historical acquired/borrowed examples only corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M15",
        "title": "Death and identity mode boundary",
        "contract": "Do not fabricate a killer for HP loss, poison loss or sourceless death; Duanchang has no recipient then. Historical identity sequence reveals identity/checks terminal game before some death skills, then ordered death skills and rewards. Existing host without this full identity scheduler can test general-skill removal, but cannot claim complete identity death/reward/victory implementation. No candidate has a personal lord skill. Future identity mode must retain faction/lord status, lord-skill sharing and removal, reward/penalty ordering, terminal outcome priority.",
        "evidence": "Mobile death+killer core; operator2020 identity death examples only; source death scheduler and host terminal-priority decisions remain mode pending.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M16",
        "title": "UI, save/replay and original naming",
        "contract": "Show complete base and granted skill text, locked/awakening markers, exact target/cost/range/quota reasons, public field physical cards, face status, per-owner awakened state and removed-skill marker. Preserve deterministic AI/manual/replay/snapshot choices and no hidden hand/top-deck leakage. New source姜维 gets name姜维; rename only original jianghu.classic.hero.jiang-wei display to proposed粮川 at implementation, leaving stable ID/mechanics/internal legacy name and aliases. Never rename source hero, merge merely by same name, or apply rename before candidate added.",
        "evidence": "Host acceptance contract; no game files edited by research.",
        "status": "proposed_host_policy"
      }
    ],
    "adaptation_notes": "完整基础身份技能及觉醒后技能均保留；M0–M16明确满血初始化、真实阶段、实体田、后得技能、当前武将技能删除及跨作处理。当前客户端与完整身份模式未核验；不混用界、国战、OL2020改版。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "挑衅",
        "志继",
        "观星"
      ],
      "complete_signature": {
        "intrinsic_max_hp": 4,
        "initial_hp": {
          "direct_source_value": null,
          "host_initialization": 4,
          "policy": "M0"
        },
        "source_gender": "male",
        "source_faction": "蜀",
        "personal_lord_skills": [],
        "base_skill_count": 2,
        "granted_skill_count": 1,
        "skills": [
          {
            "type": "optional_active_forced_choice",
            "timing": "Own play phase",
            "quota": "once per actual play phase",
            "cost": "none",
            "trigger_gate": "a distinct other actor whose attack range contains owner",
            "targets": "one such other living actor, not necessarily enemy or holding cards",
            "effect": [
              "Target may USE one legal Slash against姜维 including legal view-as Slash. Resolve normally with responses and damage.",
              "If target did not use Slash,姜维 discards one targetH/E if any. Never targetJ.",
              "If target used Slash but it was dodged or prevented, no discard."
            ],
            "policy_refs": [
              "M1",
              "M9"
            ]
          },
          {
            "type": "mandatory_once_game_awakening",
            "timing": "Own preparation phase",
            "quota": "once per game/skill binding",
            "cost": "maxHP-1 AFTER choice effect",
            "trigger_gate": "not awakened; own HAND count0; equipment/storage do not count",
            "targets": "self",
            "effect": [
              "Choose recover1 if wounded or draw2 first. Then maxHP-1 and clamp; obtain normal观星, retain挑衅.",
              "Can use acquired观星 during same preparation. No end-phase awakening."
            ],
            "policy_refs": [
              "M7",
              "M10",
              "M14"
            ],
            "grants": [
              "guanxing"
            ]
          },
          {
            "type": "granted_optional_private_top_bottom_ordering",
            "timing": "Own preparation phase, including same preparation after志继",
            "quota": "one opportunity per genuine preparation event",
            "cost": "none",
            "trigger_gate": "already owns观星",
            "targets": "self only; X=min(5,living actor count)",
            "effect": [
              "Privately inspect topX actual deck cards; put any number in chosen order atop, remaining in chosen order below.",
              "All top or all bottom valid; no card gained or discarded; no public reveal.",
              "No Jie end-phase trigger or minimum5 in small tables."
            ],
            "policy_refs": [
              "M7",
              "M10",
              "M14"
            ],
            "granted_by": "zhiji"
          }
        ]
      },
      "signature_sha256": "bf6af1c9c35bb6cfe153c05bc84011d1fa6a7a4e3477f81bb6c27d679452ac90",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 82,
      "comparison_scope": "2026-10-15 captured 82-entity roster, including all 18 active originals; not entire-source-catalog certification",
      "reason": "Required unique combination:4HP + once/play reciprocal target-range gate actual Slash-or-H/E discard challenge AND H0-prep one-shot heal1/draw2 BEFORE maxHP-1/grant min(alive,5) private top-bottom ordering. No inspected existing equalHP full packet contains this awakening plus active challenge.",
      "same_name_collisions": [
        {
          "id": "jianghu.classic.hero.jiang-wei",
          "display_name": "姜维",
          "mechanics": {
            "skills": null,
            "all_skill_names": "粮援",
            "all_skill_description": "回合开始时，若手牌为0，额外摸2张牌。",
            "adaptation_notes": "",
            "personal_lord_skills": null
          },
          "decision": "different_full_packet; source name keeps priority"
        }
      ]
    }
  },
  {
    "id": "sgs.adapted.base.hero.cai-wen-ji",
    "source_name": "蔡文姬",
    "suggested_display_name": "蔡文姬",
    "product": "三国杀移动版",
    "variant": "基础身份／神话再临·山",
    "snapshot_date": "2026-10-15",
    "source_faction": "群",
    "max_hp": 3,
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "M0 normal-full-HP initialization policy; separate source initialHP unobserved",
    "gender": "female",
    "metadata_provenance": {
      "maxHP": "bwiki-caiwenji 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-caiwenji explicit 性别",
      "faction": "mobile-caiwenji explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "source_refs": [
      "mobile-caiwenji",
      "bwiki-caiwenji"
    ],
    "intrinsic_skill_inventory": [
      "悲歌",
      "断肠"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every identity inline panel including hidden panels read; none marked 主公技. Granted 急袭 is not 国战主将技.",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_base_inventory_ready_for_host_implementation_with_disclosed_procedural_policies",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Source skill inventory complete does not certify identity rules/rewards/victory scheduler.",
      "intrinsic_rules": "complete-source-packet-with-explicit-host-policies-under-final-validation",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "beige",
        "name": "悲歌",
        "type": "optional_global_slash_after_damage_judgment",
        "timing": "After any actor positive Slash-caused damage and completed rescue",
        "quota": "once per damage EVENT, independent of damage points; no per-turn cap",
        "cost": "discard1 legalH/E",
        "trigger_gate": "owner and damaged actor alive after rescue; cost exists",
        "targets": "injured actor including self; source branches use actual damage source",
        "effect": [
          "Optional discard, then injured actor performs normal judgment.",
          "Finalheart: injured recovers1. Finaldiamond: injured draws2. Finalclub: source discards2H/E, shortfall all. Finalspade: source flips face.",
          "One2damage event is1judgment; separate events each offer once. No source does not invent one; club/spade no-op under host policy."
        ],
        "source_refs": [
          "mobile-caiwenji",
          "bwiki-caiwenji",
          "operator-caiwenji-faq"
        ],
        "policy_refs": [
          "M1",
          "M11",
          "M12"
        ],
        "ui": "Damage-event prompt/cost then public suit outcome; clearly name injured/source; no per-point repeat."
      },
      {
        "id": "duanchang",
        "name": "断肠",
        "type": "locked_on_final_death_general_skill_removal",
        "timing": "Owner final death with actual killer",
        "quota": "one effect per death event; no voluntary cancellation",
        "cost": "none",
        "trigger_gate": "owner dies, killer/source known, and game death scheduler permits effect",
        "targets": "killer, not last attacker if death is unrelated HP loss",
        "effect": [
          "Killer loses all CURRENT general skills, including innate/locked/awakened/acquired/current borrowed and lord skills; equipment skills excluded.",
          "No turn-end restoration; later independent skill acquisition remains possible.",
          "Remove skill-owned fields appropriately, stop continuous skills, retain already-created non-skill effects when applicable.",
          "No source => no recipient. Identity terminal/reward order and cross-game copy semantics need separate host implementation/policy."
        ],
        "source_refs": [
          "mobile-caiwenji",
          "bwiki-caiwenji",
          "bwiki-duanchang",
          "operator-caiwenji-faq"
        ],
        "policy_refs": [
          "M13",
          "M14",
          "M15"
        ],
        "ui": "Locked death log and durable removed-skills display; show equipment providers unaffected; remove stale skill buttons/prompts."
      }
    ],
    "ui_requirements": [
      "Show source variant/faction/HP/gender and entire intrinsic and granted skill packet",
      "Show costs, timing, phase use quota, awakening and removal state",
      "Accessible mobile dialogs, blind hand choices, private deck ordering, public fields",
      "Original art only; no copied publisher artwork"
    ],
    "excluded_variants": [
      "界/谋/势/SP/神 other namesakes",
      "国战 halfHP/general slots/资粮/遗志/天覆",
      "OL2020 balance changes",
      "十周年 or special1V1 variants"
    ],
    "name": "蔡文姬",
    "display_name": "蔡文姬",
    "skill_name": "悲歌 / 断肠",
    "skill_desc": "悲歌：一名角色受到一次杀伤害且获救存活后，可弃自己1张手牌或装备令其判定：红桃回1、方块摸2、梅花伤害来源弃2张手牌或装备、黑桃来源翻面。断肠：最终死亡时，实际击杀者失去当前所有武将技能，保留装备技能；未来独立获得技能仍可生效。",
    "skill_ids": [
      "sgs.beige",
      "sgs.duanchang"
    ],
    "intrinsic_skill_ids": [
      "sgs.beige",
      "sgs.duanchang"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.beige",
      "sgs.duanchang"
    ],
    "complete_skill_names": [
      "悲歌",
      "断肠"
    ],
    "skill_ownership_policy": "skill_ids are initially owned intrinsic skills only; granted_skill_ids are documentation until a successful awakening grants a per-owner instance.",
    "source_skill_rules": [
      {
        "id": "beige",
        "name": "悲歌",
        "type": "optional_global_slash_after_damage_judgment",
        "timing": "After any actor positive Slash-caused damage and completed rescue",
        "quota": "once per damage EVENT, independent of damage points; no per-turn cap",
        "cost": "discard1 legalH/E",
        "trigger_gate": "owner and damaged actor alive after rescue; cost exists",
        "targets": "injured actor including self; source branches use actual damage source",
        "effect": [
          "Optional discard, then injured actor performs normal judgment.",
          "Finalheart: injured recovers1. Finaldiamond: injured draws2. Finalclub: source discards2H/E, shortfall all. Finalspade: source flips face.",
          "One2damage event is1judgment; separate events each offer once. No source does not invent one; club/spade no-op under host policy."
        ],
        "source_refs": [
          "mobile-caiwenji",
          "bwiki-caiwenji",
          "operator-caiwenji-faq"
        ],
        "policy_refs": [
          "M1",
          "M11",
          "M12"
        ],
        "ui": "Damage-event prompt/cost then public suit outcome; clearly name injured/source; no per-point repeat."
      },
      {
        "id": "duanchang",
        "name": "断肠",
        "type": "locked_on_final_death_general_skill_removal",
        "timing": "Owner final death with actual killer",
        "quota": "one effect per death event; no voluntary cancellation",
        "cost": "none",
        "trigger_gate": "owner dies, killer/source known, and game death scheduler permits effect",
        "targets": "killer, not last attacker if death is unrelated HP loss",
        "effect": [
          "Killer loses all CURRENT general skills, including innate/locked/awakened/acquired/current borrowed and lord skills; equipment skills excluded.",
          "No turn-end restoration; later independent skill acquisition remains possible.",
          "Remove skill-owned fields appropriately, stop continuous skills, retain already-created non-skill effects when applicable.",
          "No source => no recipient. Identity terminal/reward order and cross-game copy semantics need separate host implementation/policy."
        ],
        "source_refs": [
          "mobile-caiwenji",
          "bwiki-caiwenji",
          "bwiki-duanchang",
          "operator-caiwenji-faq"
        ],
        "policy_refs": [
          "M13",
          "M14",
          "M15"
        ],
        "ui": "Locked death log and durable removed-skills display; show equipment providers unaffected; remove stale skill buttons/prompts."
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-production-integration-under-validation",
    "runtime_validation_status": "release-blocked-until-parent-final-validation",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "蔡文姬",
    "source_variant": "基础身份／神话再临·山+明示M0–M16江湖适配",
    "source_date": "2026-10-15目录快照；经典身份规则与有修订时间的手游社区元数据分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-57.html",
      "https://wiki.biligame.com/msgs/蔡文姬",
      "https://my.4399.com/yxxsgs/wenda/6962/",
      "https://wiki.biligame.com/msgs/断肠/蔡文姬"
    ],
    "source_ids": [
      "mobile-caiwenji",
      "bwiki-caiwenji",
      "operator-caiwenji-faq",
      "bwiki-duanchang"
    ],
    "source_record_id": "sgs.adapted.base.hero.cai-wen-ji:2026-10-15",
    "faction": "群",
    "source_gender": "female",
    "gender_provenance": {
      "maxHP": "bwiki-caiwenji 经典 card: numeric text and full 勾玉 count agree",
      "gender": "bwiki-caiwenji explicit 性别",
      "faction": "mobile-caiwenji explicit hero faction, agrees with BWiki",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false,
      "source_id": "bwiki-caiwenji",
      "revision_id": 35286,
      "revision_timestamp_utc": "2025-12-20T03:26:12Z"
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-caiwenji",
        "tier": "official_same_product_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-57.html",
        "publication_date": null,
        "sha256": "ff864374abd3db64cd3dabe103310d2a5201f9cb32371c53341d6b151f164895",
        "limitations": [
          "No publication/revision date; only snapshot access date is known.",
          "The page has faction and matching identity skills, but omits numerical HP and explicit gender metadata. Biography pronouns are not used as game-gender certification."
        ]
      },
      {
        "id": "bwiki-caiwenji",
        "tier": "community_same_product_matching_base_classic_identity_variant",
        "url": "https://wiki.biligame.com/msgs/蔡文姬",
        "revision_id": 35286,
        "revision_timestamp_utc": "2025-12-20T03:26:12Z",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId = RLCONF.wgCurRevisionId",
          "revision_id_line": 25,
          "timestamp_field": "meta[property=\"article:modified_time\"]",
          "timestamp_line": 50,
          "permanent_link_in_current_html": true,
          "revision_archive_reopened": false,
          "revision_archive_result": "HTTP 200 login gate, wgRevisionId=0; requires login; no bypass attempted",
          "transclusion_dates_independently_verified": false
        },
        "sha256": "a3c0756545cc2b30907f3fc642c435c31454a74d2b812ba33eecb4cd215ad91e",
        "limitations": [
          "Secondary community metadata; neither official mobile numerical HP fields nor current-client observation.",
          "The public current article exposes revision and modified timestamp; explicit oldid URLs are login-gated.",
          "Page-level revision date does not separately date transcluded templates; capture date is the fixed snapshot date.",
          "No separate initial HP value is printed."
        ]
      },
      {
        "id": "operator-caiwenji-faq",
        "tier": "operator_cross_product_historical_matching_base_faq",
        "url": "https://my.4399.com/yxxsgs/wenda/6962/",
        "publication_date": "2020-08-19 16:55",
        "sha256": "cfc298355e19fc561e554984576f2504d0cfb2aa7922c94bffc52e742fad4d50"
      },
      {
        "id": "bwiki-duanchang",
        "tier": "community_same_product_skill_page_selected_classic_section",
        "url": "https://wiki.biligame.com/msgs/断肠/蔡文姬",
        "revision_id": 20770,
        "revision_timestamp_utc": "2023-01-05T07:46:28Z",
        "sha256": "652054b4e446dc33e197d1540744e8db5f1cf53773dfc18e9b03a7cb6230c8cd"
      }
    ],
    "source_evidence_note": "官网身份技能（含隐藏面板）和势力已逐项读取；体力与性别来自对应手游社区经典身份显式字段。历史跨产品FAQ只佐证流程，当前移动客户端未实测；初始满体力为M0本作初始化约定。",
    "source_unknowns": [
      {
        "id": "U1",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "巧变",
          "屯田"
        ],
        "detail": "Exact nested movement-trigger scheduling is historically corroborated by matching base FAQs, not verified in current mobile client."
      },
      {
        "id": "U2",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "急袭"
        ],
        "detail": "Card expansion relies on host Snatch contract; same-product current-mobile full card rules page not separately captured. Spent field exclusion is historical matching-base FAQ."
      },
      {
        "id": "U3",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "志继",
          "观星"
        ],
        "detail": "Immediate same-preparation trigger is supported by historical FAQ; fullHP recovery-option gating, short-deck processing and pathological maxHP1 awaken are host policies not settled by selected mobile text."
      },
      {
        "id": "U4",
        "category": "source_intrinsic_procedural_not_current_mobile_certified",
        "applies_to": [
          "断肠"
        ],
        "detail": "Broad acquired/lord/current-skill loss plus later reacquisition and pile cleanup use dated matching-base cross-product FAQ. Public mobile page certifies only all-general-skills core, not complete modern skill taxonomy/death scheduler."
      },
      {
        "id": "U5",
        "category": "cross_game_host_policy",
        "applies_to": [
          "all"
        ],
        "detail": "YXS易装 copied templates, foreign poison during costs, host delayed-card immunities and multi-copy holders are M1-M16 adaptation policies; never source-certified."
      },
      {
        "id": "U6",
        "category": "mode_pending",
        "applies_to": [
          "断肠"
        ],
        "detail": "Identity victory/terminal event priority, lord-skill relationships, and kill reward/penalty order require full identity mode integration; no personal lord skill is omitted from candidates."
      }
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-caiwenji"
      ],
      "revision_id": 35286,
      "revision_timestamp_utc": "2025-12-20T03:26:12Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "M0",
      "display_note": "体力上限依据移动版社区经典身份字段；官网未给数值HP。初始满体力是M0本作约定，非单独观察到的initialHP；未实测当前移动客户端。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.cai-wen-ji",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "基础身份／神话再临·山",
      "source_character_name": "蔡文姬",
      "faction": "群",
      "gender": "female",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "M0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀蔡文姬",
      "蔡文姬·悲歌·断肠",
      "cai-wen-ji"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-mountain/cai-wen-ji.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "M0",
        "title": "Initialization and source identity",
        "contract": "Use base maxHP4/4/4/3, source faction魏/魏/蜀/群 and male/male/male/female. Initialize full HP by normal host policy. A separate mobile initialHP field was not observed. Do not add identity-lord HP bonus in nonidentity host. Preserve source fields even when host faction differs.",
        "evidence": "Metadata same-product 经典, official faction; initialHP is initialization policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M1",
        "title": "Legal costs, privacy, and irreversible commitment",
        "contract": "Own cost: legal hand/equipment where skill says 一张牌; 巧变 explicitly hand only. Cannot use J or special piles unless named. Preview legal choices before cost; cancel before committing is free. Once cost paid and phase skipped/skill used, pass optional effect but never refund or resume phase. Invalid/stale payloads must not partially mutate. Unknown enemy H faces remain private; select blind index or seeded random identity.",
        "evidence": "Source explicit H vs generic cards; historical FAQs corroborate H/E versus J.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M2",
        "title": "Real phase event identities",
        "contract": "Offer Qiaobian once per actual judge/draw/play/discard phase-start-before-entry event, never preparation/end and never a phase already skipped. Pay separate1H each phase. Extra genuine phase gets its own event; duplicate/resumed UI does not. Skip judge retains attached delays; skip draw/play/discard suppresses entire phase and phase-only skills, not later phases. Face-down whole-turn skip bypasses all four windows.",
        "evidence": "BWiki classic exclusion plus operator2012 phase FAQ; extra-phase/cancellation is host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M3",
        "title": "Qiaobian hand movement order",
        "contract": "After paid draw skip optionally choose0..2 distinct OTHER living actors with H>0; no distance/team restriction, at most1 actual H each. Resolve target losses in current action/seat order, allowing loss triggers after each loss, then give all reserved cards to ZhangHe as one gain. No self-target, duplicate target, equipment or J, no two cards from sole opponent. Never steal cards gained after the chosen loss to replace reserved cards.",
        "evidence": "Operator2012 explicitly losses sequentially then combined gain; full trigger scheduler remains historical corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M4",
        "title": "Qiaobian corresponding-zone transfer",
        "contract": "After paid play skip optionally move exactly1 physical card E->same equipment subtype slot or J->J between two distinct living actors, either endpoint may be self. No distance/team check. Destination slot must be available and empty, no same-name delay duplicate, and delay-target immunity/prohibition checked. A move is not use/discard: no replacing occupied weapon, no Slash or normal trick use event and no Wuxie window just for the move. Keep original delay identity/material. Equipment leaving source triggers its legal loss effects once.",
        "evidence": "Official mobile corresponding-location text; operator2012 equipment/J and no replacement; cross-game slots and provenance are host contract.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M5",
        "title": "Tuntian eligible movement events",
        "contract": "Offer one optional judgment per actual loss event from H/E outside owner turn, independent of cards in batch; J or field-only loss does not qualify. Responding, discarding, gifting, being stolen or comparing can qualify. Merely changing H->E within same owner is not a net loss of own cards. Loss must actually happen, no zero-size event. Nested distinct losses can each trigger; deduplicate by event id.",
        "evidence": "Mobile core offturn loss; operator2020 H/E vs J and batch FAQ. Own-zone and nested-event scheduler are host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M6",
        "title": "Judgment, fields and distance",
        "contract": "Tuntian uses a real modifiable judgment. After final judgment, nonheart actual surviving judgment card moves to public field pile, never draw an extra card/copy virtual shell; heart normally discarded, not gained (no OL2020 buff). Nonheart placement is mandatory once judgment chosen. Field cards stay out of reshuffle; no cap. Distance reduction is owner->other only, minimum1, stack normal distance modifiers.",
        "evidence": "Mobile final judgment and field text; official OL historical outgoing direction; operator2020 field persistence. Card capture priorities with other gain skills remain host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M7",
        "title": "Awakening state and bindings",
        "contract": "Zaoxian and Zhiji are mandatory once per actor-and-source-template binding for the game; marks persist after reload, phase loops and repeated adoption of the same template. Lower maxHP1 and clamp currentHP only when above new maximum; no separate damage event. Keep original skills unless text removes them. Granted skill is bound to this skill-owner character, not global hero name, and survives normal turns. Host copy/transform needs a stable per-actor binding, not awakening-state copied from the dead source actor. Losing source/granted general skills must not let an effective-hero getter recreate them. A maxHP<=1 awakening or external reacquisition/reset is an unresolved intrinsic corner; explicitly gate/test policy, never silently certify.",
        "evidence": "Official mobile awakening order; operator JiangWei once/game. Cross-game copying and low-maxHP not mobile-certified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M8",
        "title": "Jixi full virtual Snatch contract",
        "contract": "Only an actual owned field physical card is material. In own play phase may repeat without printed quota while legal fields/targets remain. Preview target with spent field excluded from field distance reduction; then commit field->processing once, use ordinary Snatch retaining material suit/rank/color. Target exactly1 other living actor in effective distance1, with obtainable H/E/J; no weapon range substitution, no self, not enemy-only. Respect Snatch immunity/prohibitions and normal Wuxie. On resolve gain one target H/E/J into own H; on cancellation/immunity gain none, material still spent. Final actual material goes to discard or another legitimate claim, never returns automatically to field. No auto-use at awakening.",
        "evidence": "Mobile grants 田-as-顺手牵羊; operator2020 consumed field excluded from distance. Expanded ordinary card behavior uses existing host Snatch compatibility, NOT separately certified current-mobile card record.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M9",
        "title": "Tiaoxin target and Slash response",
        "contract": "Choose exactly1 OTHER living actor whose attack range contains owner, using actor->owner distance and actor current weapon. This gate differs from whether a Slash is prohibited or actor has H/E. Once per actual play phase, mark spent on legal commitment even if target has no cards/no result. Target can voluntarily use1 legal Slash incl view-as or decline. This is actual out-of-turn USE aimed at JiangWei, not a pure response nor damage: usual targeting, weapon/armor, Shan and triggers; does not consume target normal play-phase Slash count. If target used Slash, no discard even if dodged/no damage. Only when no Slash was used, JiangWei chooses1 target H/E to discard; never J. No legal H/E means no further effect.",
        "evidence": "Mobile+BWiki target gate; operator2020 real Slash and H/E-only FAQ. Extra phase quota and host out-of-turn counter contract explicit.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M10",
        "title": "Zhiji and Guanxing order",
        "contract": "At own preparation with H0, first choose recover1 if wounded OR draw2; fullHP recovery option is disabled under explicit host legal-choice policy. Then maxHP-1, clamp, gain normal Guanxing. Allow one optional Guanxing in this same preparation after awakening; later genuine preparation events allow it again. Let X=min(5,living actors including self). Privately inspect exactlyX top cards; choose any subset ordered atop and all others ordered below, no gain/discard/draw, all-top/all-bottom legal. Respect deck top orientation; do not reveal to AI opponents or logs. No Jie end-phase extra trigger, no automatic5 when fewer live actors.",
        "evidence": "Mobile exact core and BWiki alive count/order; operator2020 same-prep and recovery-before-clamp. FullHP recovery disabled is a conservative host legal-choice policy, not certified by the selected mobile text; exhaustive short-deck handling is host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M11",
        "title": "Beige damage-event semantics",
        "contract": "One optional1H/E discard and1 judgment per qualifying positive Slash damage EVENT, not per damage point. Owner and injured actor must still be alive after rescue; self-injured survivor is allowed by mobile 一名角色. Judge belongs to injured actor, so its suit modifiers apply. Final heart heals injured1, diamond draws injured2, club makes actual source discard2H/E of its choice, shortfall all eligible; spade toggles actual source face. No source/dead source leaves club/spade without effect but does not suppress heart/diamond. Face-down toggles to face-up; flipping midturn does not end turn.",
        "evidence": "Mobile core suits; operator2020 event and rescue FAQ; source survival/missing-source branch is explicit host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M12",
        "title": "Slash cause attribution and cost interruptions",
        "contract": "Keep original Slash card/use id through host transfer/elemental-chain damage. Proposed host treats each surviving Slash-origin damage recipient event as Beige-eligible, but current mobile chained/transferred attribution is not certified. Cost poison/equipment-loss triggers complete first; if owner or victim dies, no illegal judgment; paid cost never refunded. Each actual holder can get one opportunity in action order; multiple copied holders need policy, not invented source fact.",
        "evidence": "Official text only says Slash-caused damage; chained/transferred/cost poison/multiple copies remain cross-game host policy.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M13",
        "title": "Duanchang current general-skill removal",
        "contract": "At final CaiWenJi death from a known killer/damage source, locked effect strips ALL killer current general skills: innate, locked, awakened/granted, borrowed/copied and active personal lord skills. Equipment-granted skills stay. This is removal without turn-end expiry, not generic all-future-acquisition ban: valid later acquisition can add a new skill. Preserve maxHP, identity, team and equipment. Stop future continuous/trigger effects of removed skills; already-resolved non-skill effects may finish. Clean private skill piles when their owning skill is lost (DengAi fields discard); do not duplicate/discard cards twice.",
        "evidence": "Mobile ALL general skills; historical operator2020 acquired/lord/equipment distinction, fields and futureChanyuan. Borrowed foreign template binding beyond ZuoCi analogy is host policy, current-mobile detailed semantics unverified.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M14",
        "title": "Removal, copying and future reacquisition ledger",
        "contract": "Host must distinguish actor original skills, current transformed skills, granted skills and equipment providers. Duanchang removes present general-skill instances and copy-grant abilities so recomputation/reload cannot resurrect them. It does not reset awakened marks, refill limited counts, regrant source-owner skills, erase equipment skills, or block a separately authorized future acquisition. Cancels uncommitted prompts tied to removed skill; committed effects follow recorded source context if still legal. Copying a dead DengAi/JiangWei begins that actor own awakening lifecycle without imported fields/awakening memory; copying CaiWenJi grants both skills. These choices are explicit cross-game host contract.",
        "evidence": "No official mobile rule for YXS易装; historical acquired/borrowed examples only corroboration.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M15",
        "title": "Death and identity mode boundary",
        "contract": "Do not fabricate a killer for HP loss, poison loss or sourceless death; Duanchang has no recipient then. Historical identity sequence reveals identity/checks terminal game before some death skills, then ordered death skills and rewards. Existing host without this full identity scheduler can test general-skill removal, but cannot claim complete identity death/reward/victory implementation. No candidate has a personal lord skill. Future identity mode must retain faction/lord status, lord-skill sharing and removal, reward/penalty ordering, terminal outcome priority.",
        "evidence": "Mobile death+killer core; operator2020 identity death examples only; source death scheduler and host terminal-priority decisions remain mode pending.",
        "status": "proposed_host_policy"
      },
      {
        "id": "M16",
        "title": "UI, save/replay and original naming",
        "contract": "Show complete base and granted skill text, locked/awakening markers, exact target/cost/range/quota reasons, public field physical cards, face status, per-owner awakened state and removed-skill marker. Preserve deterministic AI/manual/replay/snapshot choices and no hidden hand/top-deck leakage. New source姜维 gets name姜维; rename only original jianghu.classic.hero.jiang-wei display to proposed粮川 at implementation, leaving stable ID/mechanics/internal legacy name and aliases. Never rename source hero, merge merely by same name, or apply rename before candidate added.",
        "evidence": "Host acceptance contract; no game files edited by research.",
        "status": "proposed_host_policy"
      }
    ],
    "adaptation_notes": "完整基础身份技能及觉醒后技能均保留；M0–M16明确满血初始化、真实阶段、实体田、后得技能、当前武将技能删除及跨作处理。当前客户端与完整身份模式未核验；不混用界、国战、OL2020改版。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "悲歌",
        "断肠"
      ],
      "complete_signature": {
        "intrinsic_max_hp": 3,
        "initial_hp": {
          "direct_source_value": null,
          "host_initialization": 3,
          "policy": "M0"
        },
        "source_gender": "female",
        "source_faction": "群",
        "personal_lord_skills": [],
        "base_skill_count": 2,
        "granted_skill_count": 0,
        "skills": [
          {
            "type": "optional_global_slash_after_damage_judgment",
            "timing": "After any actor positive Slash-caused damage and completed rescue",
            "quota": "once per damage EVENT, independent of damage points; no per-turn cap",
            "cost": "discard1 legalH/E",
            "trigger_gate": "owner and damaged actor alive after rescue; cost exists",
            "targets": "injured actor including self; source branches use actual damage source",
            "effect": [
              "Optional discard, then injured actor performs normal judgment.",
              "Finalheart: injured recovers1. Finaldiamond: injured draws2. Finalclub: source discards2H/E, shortfall all. Finalspade: source flips face.",
              "One2damage event is1judgment; separate events each offer once. No source does not invent one; club/spade no-op under host policy."
            ],
            "policy_refs": [
              "M1",
              "M11",
              "M12"
            ]
          },
          {
            "type": "locked_on_final_death_general_skill_removal",
            "timing": "Owner final death with actual killer",
            "quota": "one effect per death event; no voluntary cancellation",
            "cost": "none",
            "trigger_gate": "owner dies, killer/source known, and game death scheduler permits effect",
            "targets": "killer, not last attacker if death is unrelated HP loss",
            "effect": [
              "Killer loses all CURRENT general skills, including innate/locked/awakened/acquired/current borrowed and lord skills; equipment skills excluded.",
              "No turn-end restoration; later independent skill acquisition remains possible.",
              "Remove skill-owned fields appropriately, stop continuous skills, retain already-created non-skill effects when applicable.",
              "No source => no recipient. Identity terminal/reward order and cross-game copy semantics need separate host implementation/policy."
            ],
            "policy_refs": [
              "M13",
              "M14",
              "M15"
            ]
          }
        ]
      },
      "signature_sha256": "1b3bbd4cba0f6e50e0852c38c39fd6689bc2b6ecabf4e8c245eab557805931f2",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 82,
      "comparison_scope": "2026-10-15 captured 82-entity roster, including all 18 active originals; not entire-source-catalog certification",
      "reason": "Required unique combination:3HP + paid1H/E once per Slash damage EVENT injured-owned suit judgment with fixed1heal/2draw/source2discard/flip, AND finaldeath removes killer current ALL general skills. No inspected existing equalHP packet includes this global damage judgment plus general-skill removal.",
      "same_name_collisions": []
    }
  }
];
export const SGS_MOUNTAIN_DEFINITIONS = Object.freeze(definitions);
