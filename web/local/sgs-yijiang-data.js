/** Complete selected Yijiang source packets. Source inventory and local runtime
 * validation are separate. Unknown source procedures remain explicit host policies;
 * independent initial HP and current mobile client behavior are not certified.
 * Native integration candidate; release remains blocked until aggregate independent validation. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.wu-guo-tai",
    "source_name": "吴国太",
    "suggested_display_name": "吴国太",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "吴",
    "max_hp": 3,
    "gender": "female",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "Y0 host normal-full-HP initialization, not separate verified mobile initialHP field",
    "source_refs": [
      "mobile-wuguotai",
      "bwiki-wuguotai"
    ],
    "metadata_provenance": {
      "max_hp": "bwiki-wuguotai classic icon+numeric double check",
      "gender": "bwiki-wuguotai explicit game gender",
      "faction": "mobile-wuguotai plus bwiki-wuguotai",
      "initial_hp": "No explicit field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "甘露",
      "补益"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every official inline identity panel read, none is lord skill; no granted skill references",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_explicit_procedural_and_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-implemented-selected-packet-with-explicit-host-policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.ganlu",
        "name": "甘露",
        "type": "optional_active",
        "timing": "own play phase",
        "quota": "once per genuine play phase",
        "cost": "none",
        "trigger_gate": "equipment-count difference <= own missingHP",
        "targets": "two distinct living actors, self may be one; either team",
        "effect": [
          "Exchange ALL E cards between corresponding zones, never into H.",
          "Empty side allowed; no self exemption from count-difference gate.",
          "Commit whole exchange escrow and loss batches before opposing installation."
        ],
        "official_rule_text": "出牌阶段限一次，你可以选择两名装备区里的牌数之差不大于你已损失体力值数的角色，交换他们装备区里的牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-wuguotai",
          "bwiki-wuguotai",
          "bwiki-ganlu",
          "bwiki-lingtong",
          "public-faq-wuguotai"
        ],
        "policy_refs": [
          "Y0",
          "Y1",
          "Y2",
          "Y3",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Both-empty legal but no-effect activation not explicit in chosen mobile text.",
          "Modern abolished/extra slots and derived destroy behavior unspecified."
        ]
      },
      {
        "id": "sgs.buyi",
        "name": "补益",
        "type": "optional_global_dying_entry",
        "timing": "a character ENTERS dying",
        "quota": "once per holder per actual dying-entry, not perturn",
        "cost": "none from owner; target may discard shown nonbasic",
        "trigger_gate": "dying actor has>=1H; holder not dead",
        "targets": "dying actor including owner, any team",
        "effect": [
          "Reveal1 targetH; self selectable, others blind.",
          "If nonbasic, that actor discards exact card THEN recovers1; basic remains with no heal.",
          "Still<=0 continues rescue without another same-entry Buyi."
        ],
        "official_rule_text": "当一名角色进入濒死状态时，你可以展示其一张手牌，然后若此牌不为基本牌，则该角色弃置此牌，然后回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-wuguotai",
          "bwiki-wuguotai",
          "bwiki-buyi",
          "public-faq-wuguotai"
        ],
        "policy_refs": [
          "Y1",
          "Y4",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Choice/privacy and repeated-entry details historically corroborated, not client-tested.",
          "Same-window Nepan/Juebie/Buyi order is host scheduler."
        ]
      }
    ],
    "excluded_variants": [
      "界吴国太 self-included difference exemption not imported",
      "国战补益军令 branch excluded"
    ],
    "skill_ids": [
      "sgs.ganlu",
      "sgs.buyi"
    ],
    "ui_requirements": [
      "Show all intrinsic skills plus once/phase or event states; no hidden passive omissions.",
      "Use original-created art only; no official portrait asset redistribution.",
      "Describe source variant and client-verification status visibly in details.",
      "Do not reveal enemy H faces or temporary concealed cards."
    ],
    "name": "吴国太",
    "display_name": "吴国太",
    "skill_name": "甘露/补益",
    "skill_desc": "甘露：出牌阶段限一次，你可以选择两名装备区里的牌数之差不大于你已损失体力值数的角色，交换他们装备区里的牌。 补益：当一名角色进入濒死状态时，你可以展示其一张手牌，然后若此牌不为基本牌，则该角色弃置此牌，然后回复1点体力。",
    "intrinsic_skill_ids": [
      "sgs.ganlu",
      "sgs.buyi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.ganlu",
      "sgs.buyi"
    ],
    "complete_skill_names": [
      "甘露",
      "补益"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.ganlu",
        "name": "甘露",
        "type": "optional_active",
        "timing": "own play phase",
        "quota": "once per genuine play phase",
        "cost": "none",
        "trigger_gate": "equipment-count difference <= own missingHP",
        "targets": "two distinct living actors, self may be one; either team",
        "effect": [
          "Exchange ALL E cards between corresponding zones, never into H.",
          "Empty side allowed; no self exemption from count-difference gate.",
          "Commit whole exchange escrow and loss batches before opposing installation."
        ],
        "official_rule_text": "出牌阶段限一次，你可以选择两名装备区里的牌数之差不大于你已损失体力值数的角色，交换他们装备区里的牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-wuguotai",
          "bwiki-wuguotai",
          "bwiki-ganlu",
          "bwiki-lingtong",
          "public-faq-wuguotai"
        ],
        "policy_refs": [
          "Y0",
          "Y1",
          "Y2",
          "Y3",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Both-empty legal but no-effect activation not explicit in chosen mobile text.",
          "Modern abolished/extra slots and derived destroy behavior unspecified."
        ]
      },
      {
        "id": "sgs.buyi",
        "name": "补益",
        "type": "optional_global_dying_entry",
        "timing": "a character ENTERS dying",
        "quota": "once per holder per actual dying-entry, not perturn",
        "cost": "none from owner; target may discard shown nonbasic",
        "trigger_gate": "dying actor has>=1H; holder not dead",
        "targets": "dying actor including owner, any team",
        "effect": [
          "Reveal1 targetH; self selectable, others blind.",
          "If nonbasic, that actor discards exact card THEN recovers1; basic remains with no heal.",
          "Still<=0 continues rescue without another same-entry Buyi."
        ],
        "official_rule_text": "当一名角色进入濒死状态时，你可以展示其一张手牌，然后若此牌不为基本牌，则该角色弃置此牌，然后回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-wuguotai",
          "bwiki-wuguotai",
          "bwiki-buyi",
          "public-faq-wuguotai"
        ],
        "policy_refs": [
          "Y1",
          "Y4",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Choice/privacy and repeated-entry details historically corroborated, not client-tested.",
          "Same-window Nepan/Juebie/Buyi order is host scheduler."
        ]
      }
    ],
    "skill_ownership_policy": "All six source skills are intrinsic; no granted or personal-lord skill is omitted. Each active owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "吴国太",
    "source_variant": "基础身份／一将成名2011经典目录+明示Y0–Y13江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-107.html",
      "https://wiki.biligame.com/msgs/%E5%90%B4%E5%9B%BD%E5%A4%AA",
      "https://wiki.biligame.com/msgs/%E7%94%98%E9%9C%B2/%E5%90%B4%E5%9B%BD%E5%A4%AA",
      "https://wiki.biligame.com/msgs/%E5%87%8C%E7%BB%9F",
      "https://sanguosha.fandom.com/zh/wiki/吴国太",
      "https://wiki.biligame.com/msgs/%E8%A1%A5%E7%9B%8A/%E5%90%B4%E5%9B%BD%E5%A4%AA"
    ],
    "source_ids": [
      "mobile-wuguotai",
      "bwiki-wuguotai",
      "bwiki-ganlu",
      "bwiki-lingtong",
      "public-faq-wuguotai",
      "bwiki-buyi"
    ],
    "source_record_id": "sgs.adapted.base.hero.wu-guo-tai:2026-10-15",
    "faction": "吴",
    "source_gender": "female",
    "gender_provenance": {
      "max_hp": "bwiki-wuguotai classic icon+numeric double check",
      "gender": "bwiki-wuguotai explicit game gender",
      "faction": "mobile-wuguotai plus bwiki-wuguotai",
      "initial_hp": "No explicit field found",
      "source_id": "bwiki-wuguotai",
      "revision_id": 35897,
      "revision_timestamp_utc": "2026-01-13T02:00:35Z",
      "official_field_verified": false,
      "current_client_verified": false
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-wuguotai",
        "url": "https://www.sanguosha.cn/pc/hero-detail-107.html",
        "status": 200,
        "sha256": "0ad12402c00a45dd3b7f78927e1de16d4d3f9a5b7c281b82cdad2a8ccbb8eddb",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "吴国太",
          "faction": "吴",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "limitations": [
          "Undated catalog; capture fixed to snapshot date.",
          "HP/gender/initialHP not explicit fields in this official page.",
          "Not a current-client login observation."
        ]
      },
      {
        "id": "bwiki-wuguotai",
        "url": "https://wiki.biligame.com/msgs/%E5%90%B4%E5%9B%BD%E5%A4%AA",
        "status": 200,
        "sha256": "bd32b71758c4f09e5abe805f3d4943e3adc7f25070c8d1b0dbf66e9fd39020f1",
        "access_date": "2026-10-15",
        "tier": "community_same_product_classic_metadata_and_rules_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 35897,
        "revision_timestamp_utc": "2026-01-13T02:00:35Z",
        "revision_url": "https://wiki.biligame.com/msgs/index.php?title=吴国太&oldid=35897",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId",
          "timestamp_field": "meta article:modified_time",
          "historical_revision_reopened": false,
          "transclusion_dates_independently_verified": false
        },
        "metadata": {
          "max_hp": 3,
          "initial_hp_explicit": null,
          "gender": "female",
          "gender_source_text": "女",
          "faction": "吴",
          "selected_section": "经典 base identity; historical, 国战 and hover blocks are not imported",
          "pack": "一将成名-2011"
        },
        "current_client_verified": false,
        "limitations": [
          "Community secondary evidence, not official numeric HP/gender certification.",
          "Page-level revision does not separately date transcluded templates.",
          "Visible update date and search cache may lag raw meta; preserve raw timestamp.",
          "No independent initialHP field; no historical revision login attempted."
        ]
      },
      {
        "id": "bwiki-ganlu",
        "url": "https://wiki.biligame.com/msgs/%E7%94%98%E9%9C%B2/%E5%90%B4%E5%9B%BD%E5%A4%AA",
        "status": 200,
        "sha256": "5bf358b167df32db89f1b768c81a6b297f319a0bf572b6f55349820021c91007",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 21019,
        "revision_timestamp_utc": "2023-01-18T08:54:47Z"
      },
      {
        "id": "bwiki-lingtong",
        "url": "https://wiki.biligame.com/msgs/%E5%87%8C%E7%BB%9F",
        "status": 200,
        "sha256": "b99d45c3f6695b076bc3c5eae99302a5c7fa2c6faafe6177558cd5979e73f884",
        "access_date": "2026-10-15",
        "tier": "community_same_product_classic_metadata_and_rules_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 38769,
        "revision_timestamp_utc": "2026-06-07T00:01:23Z",
        "revision_url": "https://wiki.biligame.com/msgs/index.php?title=凌统&oldid=38769",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId",
          "timestamp_field": "meta article:modified_time",
          "historical_revision_reopened": false,
          "transclusion_dates_independently_verified": false
        },
        "metadata": {
          "max_hp": 4,
          "initial_hp_explicit": null,
          "gender": "male",
          "gender_source_text": "男",
          "faction": "吴",
          "selected_section": "经典 base identity; historical, 国战 and hover blocks are not imported",
          "pack": "一将成名-2011"
        },
        "current_client_verified": false,
        "limitations": [
          "Community secondary evidence, not official numeric HP/gender certification.",
          "Page-level revision does not separately date transcluded templates.",
          "Visible update date and search cache may lag raw meta; preserve raw timestamp.",
          "No independent initialHP field; no historical revision login attempted."
        ]
      },
      {
        "id": "public-faq-wuguotai",
        "url": "https://sanguosha.fandom.com/zh/wiki/吴国太",
        "tier": "community_cross_product_historical_faq_public_search_observation",
        "publication_date": null,
        "access_date": "2026-10-15",
        "sha256": null,
        "summary": "Historical cross-product base FAQ: self permitted; equipment returns to E; Buyi self chooses, other hand random; one opportunity per dying entry even if still <=0. Conflicting enhanced-mobile Ganlu clause is not adopted.",
        "observation_type": "partial public web search/open text, before attempted raw fetch",
        "not_current_mobile_procedure_certification": true,
        "current_client_verified": false
      },
      {
        "id": "bwiki-buyi",
        "url": "https://wiki.biligame.com/msgs/%E8%A1%A5%E7%9B%8A/%E5%90%B4%E5%9B%BD%E5%A4%AA",
        "status": 200,
        "sha256": "205ab1227f83bc61943cc9f2ad9bf47b5304a488e6a88d6f95093d8f9abc6836",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 21020,
        "revision_timestamp_utc": "2023-01-18T08:55:32Z"
      }
    ],
    "source_evidence_note": "官网完整身份技能（含隐藏补益、智迟面板）与势力已核；体力上限和规则性别来自同产品社区经典身份明确字段。历史跨产品FAQ只作旁证，部分仅有公开检索摘录；不冒充原始页面或当前移动客户端验证。初始满体力为Y0宿主约定。",
    "source_unknowns": [
      {
        "id": "U1",
        "hero": "吴国太",
        "skill": "甘露",
        "detail": "Both-empty legal but no-effect activation not explicit in chosen mobile text."
      },
      {
        "id": "U2",
        "hero": "吴国太",
        "skill": "甘露",
        "detail": "Modern abolished/extra slots and derived destroy behavior unspecified."
      },
      {
        "id": "U3",
        "hero": "吴国太",
        "skill": "补益",
        "detail": "Choice/privacy and repeated-entry details historically corroborated, not client-tested."
      },
      {
        "id": "U4",
        "hero": "吴国太",
        "skill": "补益",
        "detail": "Same-window Nepan/Juebie/Buyi order is host scheduler."
      }
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-wuguotai"
      ],
      "revision_id": 35897,
      "revision_timestamp_utc": "2026-01-13T02:00:35Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "Y0",
      "display_note": "体力上限由手游社区经典勾玉图标与隐藏数值双核；官网无数值HP。独立initialHP未观察，满血开局是Y0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.wu-guo-tai",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "吴国太",
      "faction": "吴",
      "gender": "female",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "Y0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀吴国太",
      "吴国太·甘露/补益",
      "wu-guo-tai"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang/wu-guo-tai.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "Y0",
        "title": "Metadata and initialization",
        "contract": "Use selected base maxHP3/4/4/3, genderF/M/M/M and faction吴/吴/吴/群. Independent source initialHP=null. FullHP start is host initialization, no identity-lord bonus inferred. All personal-lord/granted lists empty.",
        "basis": "Official identity inventory and same-product classic explicit HP/gender fields.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y1",
        "title": "Event identity, legal choices and privacy",
        "contract": "Every real movement, phase, damage, dying entry, Slash target branch and turn gets stable immutable ID. Claim receipts before effects. Stale/forged IDs cannot mutate state. Cancel before commitment free; committed effects/paid costs are not refunded. Hidden H represented by blind positions/seeded random, never whole enemy hand preview. Preserve physical identity and card family.",
        "basis": "Source distinctions H/E and events; transactional/privacy implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y2",
        "title": "Ganlu normal exchange",
        "contract": "Select two distinct living actors, self allowed; all E cards; abs(EA-EB)<=owner missingHP at commitment. Detach both whole E sets into exchange escrow before loss triggers, one loss batch per former owner, equipment-specific per-card leave effects as applicable; dispatch action order; then install reserved opposing set into matching slots. Not use/discard and not to hand.",
        "basis": "Official/mobile classic core; BWIKI Lingtong rule FAQ explicitly staged simultaneous exchange/loss before entry.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y3",
        "title": "Ganlu unusual zones and interruption",
        "contract": "Reject both-empty action as no-op UI policy; one empty allowed. Reject any exchange whose incoming standard corresponding slot is unavailable/abolished at initial validation. After commit no rollback: if destination dies or a nested effect makes installation impossible, resolve reserved cards through lawful discard or that card’s leave/destroy rule, never hand as fallback/duplicate. Reserved cards cannot be selected by nested Xuanfeng. Base source text does not certify these cross-pack cases.",
        "basis": "Host atomic ownership/conservation and derived equipment rules; source intrinsic unresolved two-empty no-effect legality.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y4",
        "title": "Buyi entry and choice",
        "contract": "One optional per holder per genuine dying-entry, including own holder at hp<=0 but not dead. Global action-order entry dispatch before Peach polling; respect already committed waive-rescue/death. Self chooses one H, another actor blind/seeded random. Reveal public then nonbasic discard by dying actor followed by recover1; basic remains. No retries in same entry after fail/still<=0; separate later entry eligible. EmptyH unavailable. Nested costs obey actual card-family and death checks.",
        "basis": "Official trigger/result; historical base FAQ procedural corroboration. Ordering against other same-window skills and foreign poison is host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y5",
        "title": "Xuanfeng equipment batch and sequential discard",
        "contract": "A committed owner loss batch with>=1E yields one optional offer regardless of number; hand-held equip loss not E. Independent batches each offer. Can sequentially discard0..2 total H/E from1..2 other actors, either side, no range; revalidate target/card after each nested move. No J/special pile. Support royal loyalist punishment loss; dead owner cannot newly act. Explicit host policy allows holder and target at hp<=0 but not finalized dead during nested rescue; selected mobile text lacks a separate no-dying gate, and current-client behavior is not certified.",
        "basis": "Official main trigger; BWIKI classic says sequential/up-to2; same-product FAQ batch and exchange. H/E not J and death cleanup are stated base/host boundary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y6",
        "title": "Xuanfeng discard stage",
        "contract": "During one actual own discard phase count own H/E actual discarded materials, not gift/steal/board moves or others cards owner discards. Offer once after ordinary discard before phase exit if count>=2; not every pair. E discard separately offers equipment-loss trigger. Skipped phase has no offer. Complex forced extra discards/reentrant phase-end exact timing is not current-client certified.",
        "basis": "Official discard>=2; BWIKI FAQ confirms within discard-phase timing. Specific aggregation/window is explicit host scheduler.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y7",
        "title": "Pojun designation and batch",
        "contract": "Once each Slash-use target branch in owner own play phase; snapshot target current positiveHP before response/damage. Select0..min(HP,H/E count), all chosen cards moved as one batch to target-owned facedown Pojun pile. No perturn cap. Original source uses designation wording; host currently places source designation after legal redirects, so original-target-before-Liuli timing is an unresolved intrinsic procedure and must be labeled.",
        "basis": "Official mobile and dated2020 comparison; historical matching FAQ H/E/batch/preHP.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y8",
        "title": "Pojun persistent return obligation",
        "contract": "Reserve physical IDs by target/turn/use/branch; exclude pile from H/E/ordinary-targetable zones and deck reshuffle. At actual turn-finally after end-stage effects return all existing batch cards to targetH, equipment included. Obligation survives XuSheng death/skill loss; dead target pile goes discard once, destroyed derived cards never recreated. Save/load preserve receipts and ownership; abnormal interruption must not strand cards.",
        "basis": "Official return core and historical FAQ hand; death/ledger/turn-abort/derived cases are explicit host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y9",
        "title": "Mingce gift then decision",
        "contract": "Once per actual play phase; give1 real H Slash or H/E equipment to distinct other living actorH. Slash variants qualify as physical Slash, not arbitrary view-as-eligible red card. Set quota when gift commits; resolve loss/gain then owner selects recipient legal attack-range target (may owner, not recipient); recipient picks materialless normal Slash or draw1; no target only draw. Gift itself is not consumed for Slash.",
        "basis": "Official gift/choice; same-product BWIKI explicit normalSlash/no-target; historical FAQ equipped gift and target-before-choice.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y10",
        "title": "Mingce virtual card and interruptions",
        "contract": "Recipient is card user/damage source; materialless ordinary normal Slash via actual use/response/equipment pipeline, no copied gift nature. Ignore ordinary own-play Slash quota for forced offturn use but honor real prohibitions. Giving equipment does not equip recipient. Hand gift faces are private to giver/recipient; equipment-origin cards remain publicly known; source does not explicitly specify visibility. If gift loss/gain nested triggers kill an actor or remove legal target, revalidate; committed gift persists, no refund. Third-party skill removal/effective-card conversions are host integration.",
        "basis": "Same-product core plus host real-card-use contract; no-current-client advanced-interaction certification.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y11",
        "title": "Zhichi trigger and effect invalidity",
        "contract": "Owner receives a positive damage EVENT outside owner actual turn, after damage/rescue survival, locked create shield until active turnID ends. First event not retroactively prevented. HP loss/ownturn damage no trigger, damage source not required. While shield active, effective Slash and ordinary-trick effect on owner invalid including beneficial effects; not targeting prohibition, not generic damage prevention. Basic Peach/Wine, equipment, delayedtrick, direct skill damage/HP loss unaffected.",
        "basis": "Official mobile full rule; card-family semantic expansion.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y12",
        "title": "Zhichi chain and persistence boundaries",
        "contract": "Check immunity at each fresh card-target effect entrance; do not reopen an already resolving Duel merely because a nested damage activates shield. Chain-propagated damage is not a new card effect so not automatically blocked. A created turn-effect persists through general-skill removal to turn-finally; no further activation after loss. Exact old-mobile chain/ongoingDuel/skillloss timing not verified; these are host contracts.",
        "basis": "Host consequence of effect-vs-damage architecture and existing Duanchang ledger conventions.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y13",
        "title": "Effective ownership and mode",
        "contract": "Every skill checks effective skill ledger; HuaMuLan copy gets full male packet/maxHP and new owner binding without importing other actor quotas/piles. CaiWenJi removes current skill providers, not equipment; resolved independent Pojun return/Zhichi shield remain. No personal lord skills truncated, but full identity relationships/reveal/reward/terminal ordering remains mode_pending.",
        "basis": "Cross-game host compatibility, not source law.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整六项固有技能按选定基础身份版本保留；Y0–Y13明确初始化、交换事务、失装批次、濒死进入、扣置归还、真实借杀与牌效果无效。现行客户端与完整身份模式未核，不混入界、国战、旧一将或其他产品变体。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "甘露",
        "补益"
      ],
      "complete_signature": {
        "max_hp": 3,
        "gender": "female",
        "source_faction": "吴",
        "intrinsic_skill_inventory": [
          "甘露",
          "补益"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "initial_hp_direct_source_value": null,
        "skills": [
          {
            "id": "sgs.ganlu",
            "type": "optional_active",
            "timing": "own play phase",
            "quota": "once per genuine play phase",
            "cost": "none",
            "trigger_gate": "equipment-count difference <= own missingHP",
            "targets": "two distinct living actors, self may be one; either team",
            "effect": [
              "Exchange ALL E cards between corresponding zones, never into H.",
              "Empty side allowed; no self exemption from count-difference gate.",
              "Commit whole exchange escrow and loss batches before opposing installation."
            ],
            "policy_refs": [
              "Y0",
              "Y1",
              "Y2",
              "Y3",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Both-empty legal but no-effect activation not explicit in chosen mobile text.",
              "Modern abolished/extra slots and derived destroy behavior unspecified."
            ]
          },
          {
            "id": "sgs.buyi",
            "type": "optional_global_dying_entry",
            "timing": "a character ENTERS dying",
            "quota": "once per holder per actual dying-entry, not perturn",
            "cost": "none from owner; target may discard shown nonbasic",
            "trigger_gate": "dying actor has>=1H; holder not dead",
            "targets": "dying actor including owner, any team",
            "effect": [
              "Reveal1 targetH; self selectable, others blind.",
              "If nonbasic, that actor discards exact card THEN recovers1; basic remains with no heal.",
              "Still<=0 continues rescue without another same-entry Buyi."
            ],
            "policy_refs": [
              "Y1",
              "Y4",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Choice/privacy and repeated-entry details historically corroborated, not client-tested.",
              "Same-window Nepan/Juebie/Buyi order is host scheduler."
            ]
          }
        ]
      },
      "signature_sha256": "9fb511518d563cb8ac6ee7ea79828bf350bfa6d6ceed9b7e32c1817c1b62810b",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 86,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "55e9893",
      "comparison_scope": "2026-10-15 captured 86 complete local entities plus 7 archived source identities; all 18 active originals included; not whole-source-catalog equivalence certification",
      "reason": "3HP full packet requires BOTH once/play allE exchange of2 actors gated by E-count difference<=own missingHP AND global true-dying-entry H-reveal/nonbasicdiscard/heal1. Existing equalHP full packet lacks this combination.",
      "same_name_collisions": []
    },
    "skill_callback_modules": {
      "sgs.ganlu": "sgs-yijiang-equipment-skills.js",
      "sgs.buyi": "sgs-yijiang-equipment-skills.js"
    }
  },
  {
    "id": "sgs.adapted.base.hero.ling-tong",
    "source_name": "凌统",
    "suggested_display_name": "凌统",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "吴",
    "max_hp": 4,
    "gender": "male",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "Y0 host normal-full-HP initialization, not separate verified mobile initialHP field",
    "source_refs": [
      "mobile-lingtong",
      "bwiki-lingtong"
    ],
    "metadata_provenance": {
      "max_hp": "bwiki-lingtong classic icon+numeric double check",
      "gender": "bwiki-lingtong explicit game gender",
      "faction": "mobile-lingtong plus bwiki-lingtong",
      "initial_hp": "No explicit field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "旋风"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every official inline identity panel read, none is lord skill; no granted skill references",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_explicit_procedural_and_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-implemented-selected-packet-with-explicit-host-policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.xuanfeng",
        "name": "旋风",
        "type": "optional_triggered",
        "timing": "own discard phase after >=2 own actual discards OR committed loss of E cards",
        "quota": "once per E-loss batch; once per real discard phase for discard trigger",
        "cost": "none",
        "trigger_gate": "eligible committed batch or discard threshold",
        "targets": "up to2 OTHER living actors; sequentially0..2 totalH/E; no range/team gate",
        "effect": [
          "Sequentially discard up to2 total; allow same target twice or two targets once each.",
          "Resolve first card nested triggers then reselect/revalidate second.",
          "Whole E-loss batch once; independent batches independently trigger."
        ],
        "official_rule_text": "当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，你可以弃置至多两名其他角色的共计两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-lingtong",
          "bwiki-lingtong",
          "bwiki-xuanfeng",
          "bwiki-lingtong"
        ],
        "policy_refs": [
          "Y1",
          "Y5",
          "Y6",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Official says2 total, same-product classic clarifies up-to2; explicit selected reconciliation.",
          "Complex discard-end scheduling and dying-nested loss not current-client-tested; allowing hp<=0 but !dead holder/targets is a host policy."
        ]
      }
    ],
    "excluded_variants": [
      "界凌统 equip transfer branch excluded",
      "国战旋略/勇进 excluded",
      "old2011 virtualSlash/directdamage excluded"
    ],
    "skill_ids": [
      "sgs.xuanfeng"
    ],
    "ui_requirements": [
      "Show all intrinsic skills plus once/phase or event states; no hidden passive omissions.",
      "Use original-created art only; no official portrait asset redistribution.",
      "Describe source variant and client-verification status visibly in details.",
      "Do not reveal enemy H faces or temporary concealed cards."
    ],
    "name": "凌统",
    "display_name": "凌统",
    "skill_name": "旋风",
    "skill_desc": "旋风：当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，你可以弃置至多两名其他角色的共计两张牌。",
    "intrinsic_skill_ids": [
      "sgs.xuanfeng"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.xuanfeng"
    ],
    "complete_skill_names": [
      "旋风"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.xuanfeng",
        "name": "旋风",
        "type": "optional_triggered",
        "timing": "own discard phase after >=2 own actual discards OR committed loss of E cards",
        "quota": "once per E-loss batch; once per real discard phase for discard trigger",
        "cost": "none",
        "trigger_gate": "eligible committed batch or discard threshold",
        "targets": "up to2 OTHER living actors; sequentially0..2 totalH/E; no range/team gate",
        "effect": [
          "Sequentially discard up to2 total; allow same target twice or two targets once each.",
          "Resolve first card nested triggers then reselect/revalidate second.",
          "Whole E-loss batch once; independent batches independently trigger."
        ],
        "official_rule_text": "当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，你可以弃置至多两名其他角色的共计两张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-lingtong",
          "bwiki-lingtong",
          "bwiki-xuanfeng",
          "bwiki-lingtong"
        ],
        "policy_refs": [
          "Y1",
          "Y5",
          "Y6",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Official says2 total, same-product classic clarifies up-to2; explicit selected reconciliation.",
          "Complex discard-end scheduling and dying-nested loss not current-client-tested; allowing hp<=0 but !dead holder/targets is a host policy."
        ]
      }
    ],
    "skill_ownership_policy": "All six source skills are intrinsic; no granted or personal-lord skill is omitted. Each active owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "凌统",
    "source_variant": "基础身份／一将成名2011经典目录+明示Y0–Y13江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-105.html",
      "https://wiki.biligame.com/msgs/%E5%87%8C%E7%BB%9F",
      "https://wiki.biligame.com/msgs/%E6%97%8B%E9%A3%8E/%E5%87%8C%E7%BB%9F"
    ],
    "source_ids": [
      "mobile-lingtong",
      "bwiki-lingtong",
      "bwiki-xuanfeng"
    ],
    "source_record_id": "sgs.adapted.base.hero.ling-tong:2026-10-15",
    "faction": "吴",
    "source_gender": "male",
    "gender_provenance": {
      "max_hp": "bwiki-lingtong classic icon+numeric double check",
      "gender": "bwiki-lingtong explicit game gender",
      "faction": "mobile-lingtong plus bwiki-lingtong",
      "initial_hp": "No explicit field found",
      "source_id": "bwiki-lingtong",
      "revision_id": 38769,
      "revision_timestamp_utc": "2026-06-07T00:01:23Z",
      "official_field_verified": false,
      "current_client_verified": false
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-lingtong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-105.html",
        "status": 200,
        "sha256": "09c272d4a061acd9a7918b28626c7e686864e3e49fc4622159bf57c05658dc0b",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "凌统",
          "faction": "吴",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "limitations": [
          "Undated catalog; capture fixed to snapshot date.",
          "HP/gender/initialHP not explicit fields in this official page.",
          "Not a current-client login observation."
        ]
      },
      {
        "id": "bwiki-lingtong",
        "url": "https://wiki.biligame.com/msgs/%E5%87%8C%E7%BB%9F",
        "status": 200,
        "sha256": "b99d45c3f6695b076bc3c5eae99302a5c7fa2c6faafe6177558cd5979e73f884",
        "access_date": "2026-10-15",
        "tier": "community_same_product_classic_metadata_and_rules_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 38769,
        "revision_timestamp_utc": "2026-06-07T00:01:23Z",
        "revision_url": "https://wiki.biligame.com/msgs/index.php?title=凌统&oldid=38769",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId",
          "timestamp_field": "meta article:modified_time",
          "historical_revision_reopened": false,
          "transclusion_dates_independently_verified": false
        },
        "metadata": {
          "max_hp": 4,
          "initial_hp_explicit": null,
          "gender": "male",
          "gender_source_text": "男",
          "faction": "吴",
          "selected_section": "经典 base identity; historical, 国战 and hover blocks are not imported",
          "pack": "一将成名-2011"
        },
        "current_client_verified": false,
        "limitations": [
          "Community secondary evidence, not official numeric HP/gender certification.",
          "Page-level revision does not separately date transcluded templates.",
          "Visible update date and search cache may lag raw meta; preserve raw timestamp.",
          "No independent initialHP field; no historical revision login attempted."
        ]
      },
      {
        "id": "bwiki-xuanfeng",
        "url": "https://wiki.biligame.com/msgs/%E6%97%8B%E9%A3%8E/%E5%87%8C%E7%BB%9F",
        "status": 200,
        "sha256": "2ff4b3ead3a98e0aa79b06f65efa319ee7aef5456b2d0be701cd6f927220ff0e",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 21044,
        "revision_timestamp_utc": "2023-01-18T14:11:50Z"
      }
    ],
    "source_evidence_note": "官网完整身份技能（含隐藏补益、智迟面板）与势力已核；体力上限和规则性别来自同产品社区经典身份明确字段。历史跨产品FAQ只作旁证，部分仅有公开检索摘录；不冒充原始页面或当前移动客户端验证。初始满体力为Y0宿主约定。",
    "source_unknowns": [
      {
        "id": "U5",
        "hero": "凌统",
        "skill": "旋风",
        "detail": "Official says2 total, same-product classic clarifies up-to2; explicit selected reconciliation."
      },
      {
        "id": "U6",
        "hero": "凌统",
        "skill": "旋风",
        "detail": "Complex discard-end scheduling and dying-nested loss not current-client-tested; allowing hp<=0 but !dead holder/targets is a host policy."
      }
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-lingtong"
      ],
      "revision_id": 38769,
      "revision_timestamp_utc": "2026-06-07T00:01:23Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "Y0",
      "display_note": "体力上限由手游社区经典勾玉图标与隐藏数值双核；官网无数值HP。独立initialHP未观察，满血开局是Y0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.ling-tong",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "凌统",
      "faction": "吴",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "Y0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀凌统",
      "凌统·旋风",
      "ling-tong"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang/ling-tong.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "Y0",
        "title": "Metadata and initialization",
        "contract": "Use selected base maxHP3/4/4/3, genderF/M/M/M and faction吴/吴/吴/群. Independent source initialHP=null. FullHP start is host initialization, no identity-lord bonus inferred. All personal-lord/granted lists empty.",
        "basis": "Official identity inventory and same-product classic explicit HP/gender fields.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y1",
        "title": "Event identity, legal choices and privacy",
        "contract": "Every real movement, phase, damage, dying entry, Slash target branch and turn gets stable immutable ID. Claim receipts before effects. Stale/forged IDs cannot mutate state. Cancel before commitment free; committed effects/paid costs are not refunded. Hidden H represented by blind positions/seeded random, never whole enemy hand preview. Preserve physical identity and card family.",
        "basis": "Source distinctions H/E and events; transactional/privacy implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y2",
        "title": "Ganlu normal exchange",
        "contract": "Select two distinct living actors, self allowed; all E cards; abs(EA-EB)<=owner missingHP at commitment. Detach both whole E sets into exchange escrow before loss triggers, one loss batch per former owner, equipment-specific per-card leave effects as applicable; dispatch action order; then install reserved opposing set into matching slots. Not use/discard and not to hand.",
        "basis": "Official/mobile classic core; BWIKI Lingtong rule FAQ explicitly staged simultaneous exchange/loss before entry.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y3",
        "title": "Ganlu unusual zones and interruption",
        "contract": "Reject both-empty action as no-op UI policy; one empty allowed. Reject any exchange whose incoming standard corresponding slot is unavailable/abolished at initial validation. After commit no rollback: if destination dies or a nested effect makes installation impossible, resolve reserved cards through lawful discard or that card’s leave/destroy rule, never hand as fallback/duplicate. Reserved cards cannot be selected by nested Xuanfeng. Base source text does not certify these cross-pack cases.",
        "basis": "Host atomic ownership/conservation and derived equipment rules; source intrinsic unresolved two-empty no-effect legality.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y4",
        "title": "Buyi entry and choice",
        "contract": "One optional per holder per genuine dying-entry, including own holder at hp<=0 but not dead. Global action-order entry dispatch before Peach polling; respect already committed waive-rescue/death. Self chooses one H, another actor blind/seeded random. Reveal public then nonbasic discard by dying actor followed by recover1; basic remains. No retries in same entry after fail/still<=0; separate later entry eligible. EmptyH unavailable. Nested costs obey actual card-family and death checks.",
        "basis": "Official trigger/result; historical base FAQ procedural corroboration. Ordering against other same-window skills and foreign poison is host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y5",
        "title": "Xuanfeng equipment batch and sequential discard",
        "contract": "A committed owner loss batch with>=1E yields one optional offer regardless of number; hand-held equip loss not E. Independent batches each offer. Can sequentially discard0..2 total H/E from1..2 other actors, either side, no range; revalidate target/card after each nested move. No J/special pile. Support royal loyalist punishment loss; dead owner cannot newly act. Explicit host policy allows holder and target at hp<=0 but not finalized dead during nested rescue; selected mobile text lacks a separate no-dying gate, and current-client behavior is not certified.",
        "basis": "Official main trigger; BWIKI classic says sequential/up-to2; same-product FAQ batch and exchange. H/E not J and death cleanup are stated base/host boundary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y6",
        "title": "Xuanfeng discard stage",
        "contract": "During one actual own discard phase count own H/E actual discarded materials, not gift/steal/board moves or others cards owner discards. Offer once after ordinary discard before phase exit if count>=2; not every pair. E discard separately offers equipment-loss trigger. Skipped phase has no offer. Complex forced extra discards/reentrant phase-end exact timing is not current-client certified.",
        "basis": "Official discard>=2; BWIKI FAQ confirms within discard-phase timing. Specific aggregation/window is explicit host scheduler.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y7",
        "title": "Pojun designation and batch",
        "contract": "Once each Slash-use target branch in owner own play phase; snapshot target current positiveHP before response/damage. Select0..min(HP,H/E count), all chosen cards moved as one batch to target-owned facedown Pojun pile. No perturn cap. Original source uses designation wording; host currently places source designation after legal redirects, so original-target-before-Liuli timing is an unresolved intrinsic procedure and must be labeled.",
        "basis": "Official mobile and dated2020 comparison; historical matching FAQ H/E/batch/preHP.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y8",
        "title": "Pojun persistent return obligation",
        "contract": "Reserve physical IDs by target/turn/use/branch; exclude pile from H/E/ordinary-targetable zones and deck reshuffle. At actual turn-finally after end-stage effects return all existing batch cards to targetH, equipment included. Obligation survives XuSheng death/skill loss; dead target pile goes discard once, destroyed derived cards never recreated. Save/load preserve receipts and ownership; abnormal interruption must not strand cards.",
        "basis": "Official return core and historical FAQ hand; death/ledger/turn-abort/derived cases are explicit host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y9",
        "title": "Mingce gift then decision",
        "contract": "Once per actual play phase; give1 real H Slash or H/E equipment to distinct other living actorH. Slash variants qualify as physical Slash, not arbitrary view-as-eligible red card. Set quota when gift commits; resolve loss/gain then owner selects recipient legal attack-range target (may owner, not recipient); recipient picks materialless normal Slash or draw1; no target only draw. Gift itself is not consumed for Slash.",
        "basis": "Official gift/choice; same-product BWIKI explicit normalSlash/no-target; historical FAQ equipped gift and target-before-choice.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y10",
        "title": "Mingce virtual card and interruptions",
        "contract": "Recipient is card user/damage source; materialless ordinary normal Slash via actual use/response/equipment pipeline, no copied gift nature. Ignore ordinary own-play Slash quota for forced offturn use but honor real prohibitions. Giving equipment does not equip recipient. Hand gift faces are private to giver/recipient; equipment-origin cards remain publicly known; source does not explicitly specify visibility. If gift loss/gain nested triggers kill an actor or remove legal target, revalidate; committed gift persists, no refund. Third-party skill removal/effective-card conversions are host integration.",
        "basis": "Same-product core plus host real-card-use contract; no-current-client advanced-interaction certification.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y11",
        "title": "Zhichi trigger and effect invalidity",
        "contract": "Owner receives a positive damage EVENT outside owner actual turn, after damage/rescue survival, locked create shield until active turnID ends. First event not retroactively prevented. HP loss/ownturn damage no trigger, damage source not required. While shield active, effective Slash and ordinary-trick effect on owner invalid including beneficial effects; not targeting prohibition, not generic damage prevention. Basic Peach/Wine, equipment, delayedtrick, direct skill damage/HP loss unaffected.",
        "basis": "Official mobile full rule; card-family semantic expansion.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y12",
        "title": "Zhichi chain and persistence boundaries",
        "contract": "Check immunity at each fresh card-target effect entrance; do not reopen an already resolving Duel merely because a nested damage activates shield. Chain-propagated damage is not a new card effect so not automatically blocked. A created turn-effect persists through general-skill removal to turn-finally; no further activation after loss. Exact old-mobile chain/ongoingDuel/skillloss timing not verified; these are host contracts.",
        "basis": "Host consequence of effect-vs-damage architecture and existing Duanchang ledger conventions.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y13",
        "title": "Effective ownership and mode",
        "contract": "Every skill checks effective skill ledger; HuaMuLan copy gets full male packet/maxHP and new owner binding without importing other actor quotas/piles. CaiWenJi removes current skill providers, not equipment; resolved independent Pojun return/Zhichi shield remain. No personal lord skills truncated, but full identity relationships/reveal/reward/terminal ordering remains mode_pending.",
        "basis": "Cross-game host compatibility, not source law.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整六项固有技能按选定基础身份版本保留；Y0–Y13明确初始化、交换事务、失装批次、濒死进入、扣置归还、真实借杀与牌效果无效。现行客户端与完整身份模式未核，不混入界、国战、旧一将或其他产品变体。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "旋风"
      ],
      "complete_signature": {
        "max_hp": 4,
        "gender": "male",
        "source_faction": "吴",
        "intrinsic_skill_inventory": [
          "旋风"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "initial_hp_direct_source_value": null,
        "skills": [
          {
            "id": "sgs.xuanfeng",
            "type": "optional_triggered",
            "timing": "own discard phase after >=2 own actual discards OR committed loss of E cards",
            "quota": "once per E-loss batch; once per real discard phase for discard trigger",
            "cost": "none",
            "trigger_gate": "eligible committed batch or discard threshold",
            "targets": "up to2 OTHER living actors; sequentially0..2 totalH/E; no range/team gate",
            "effect": [
              "Sequentially discard up to2 total; allow same target twice or two targets once each.",
              "Resolve first card nested triggers then reselect/revalidate second.",
              "Whole E-loss batch once; independent batches independently trigger."
            ],
            "policy_refs": [
              "Y1",
              "Y5",
              "Y6",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Official says2 total, same-product classic clarifies up-to2; explicit selected reconciliation.",
              "Complex discard-end scheduling and dying-nested loss not current-client-tested; allowing hp<=0 but !dead holder/targets is a host policy."
            ]
          }
        ]
      },
      "signature_sha256": "f451e6da053b1972d14ac9f5ed8ad922aa5746699ab52e6c2013e7a66684b70e",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 86,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "55e9893",
      "comparison_scope": "2026-10-15 captured 86 complete local entities plus 7 archived source identities; all 18 active originals included; not whole-source-catalog equivalence certification",
      "reason": "4HP requires both own-discard>=2 and anyE-loss-batch optional sequential0..2 H/E discard across up to2 OTHER actors, no range, no cost. No existing equalHP template has this dual-trigger batch-counted ability.",
      "same_name_collisions": []
    },
    "skill_callback_modules": {
      "sgs.xuanfeng": "sgs-yijiang-equipment-skills.js"
    }
  },
  {
    "id": "sgs.adapted.base.hero.xu-sheng",
    "source_name": "徐盛",
    "suggested_display_name": "徐盛",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "吴",
    "max_hp": 4,
    "gender": "male",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "Y0 host normal-full-HP initialization, not separate verified mobile initialHP field",
    "source_refs": [
      "mobile-xusheng",
      "bwiki-xusheng"
    ],
    "metadata_provenance": {
      "max_hp": "bwiki-xusheng classic icon+numeric double check",
      "gender": "bwiki-xusheng explicit game gender",
      "faction": "mobile-xusheng plus bwiki-xusheng",
      "initial_hp": "No explicit field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "破军"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every official inline identity panel read, none is lord skill; no granted skill references",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_explicit_procedural_and_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-implemented-selected-packet-with-explicit-host-policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.pojun",
        "name": "破军",
        "type": "optional_slash_target",
        "timing": "owner own play phase Slash target designation, before response/damage",
        "quota": "once per Slash-use target branch, no perturn cap",
        "cost": "none",
        "trigger_gate": "target currentHP>0 and legal H/E exists",
        "targets": "that Slash target",
        "effect": [
          "Snapshot current targetHP asX; temporarily move<=X targetH/E in one batch to target facedown pile.",
          "Pile unusable and excluded from hand/equipment; E abilities stop, actual loss triggers run.",
          "At true current turn end return those existing physical cards to targetH, not E."
        ],
        "official_rule_text": "当你于出牌阶段内使用【杀】指定一个目标后，你可以将其至多X张牌扣置于该角色的武将牌旁（X为其体力值）。若如此做，当前回合结束后，该角色获得这些牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xusheng",
          "bwiki-xusheng",
          "bwiki-pojun",
          "mobile-xusheng-guide",
          "public-faq-xusheng"
        ],
        "policy_refs": [
          "Y1",
          "Y7",
          "Y8",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Source target designation versus Liuli redirect ordering not settled by selected mobile pages.",
          "Exact return end-window priority/death/skillloss handling separated as host policy."
        ]
      }
    ],
    "excluded_variants": [
      "Old damage-then draw/flip Pojun excluded",
      "界徐盛 offturn plus damage+1 excluded",
      "国战疑城 excluded"
    ],
    "skill_ids": [
      "sgs.pojun"
    ],
    "ui_requirements": [
      "Show all intrinsic skills plus once/phase or event states; no hidden passive omissions.",
      "Use original-created art only; no official portrait asset redistribution.",
      "Describe source variant and client-verification status visibly in details.",
      "Do not reveal enemy H faces or temporary concealed cards."
    ],
    "name": "徐盛",
    "display_name": "徐盛",
    "skill_name": "破军",
    "skill_desc": "破军：当你于出牌阶段内使用【杀】指定一个目标后，你可以将其至多X张牌扣置于该角色的武将牌旁（X为其体力值）。若如此做，当前回合结束后，该角色获得这些牌。",
    "intrinsic_skill_ids": [
      "sgs.pojun"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.pojun"
    ],
    "complete_skill_names": [
      "破军"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.pojun",
        "name": "破军",
        "type": "optional_slash_target",
        "timing": "owner own play phase Slash target designation, before response/damage",
        "quota": "once per Slash-use target branch, no perturn cap",
        "cost": "none",
        "trigger_gate": "target currentHP>0 and legal H/E exists",
        "targets": "that Slash target",
        "effect": [
          "Snapshot current targetHP asX; temporarily move<=X targetH/E in one batch to target facedown pile.",
          "Pile unusable and excluded from hand/equipment; E abilities stop, actual loss triggers run.",
          "At true current turn end return those existing physical cards to targetH, not E."
        ],
        "official_rule_text": "当你于出牌阶段内使用【杀】指定一个目标后，你可以将其至多X张牌扣置于该角色的武将牌旁（X为其体力值）。若如此做，当前回合结束后，该角色获得这些牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-xusheng",
          "bwiki-xusheng",
          "bwiki-pojun",
          "mobile-xusheng-guide",
          "public-faq-xusheng"
        ],
        "policy_refs": [
          "Y1",
          "Y7",
          "Y8",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Source target designation versus Liuli redirect ordering not settled by selected mobile pages.",
          "Exact return end-window priority/death/skillloss handling separated as host policy."
        ]
      }
    ],
    "skill_ownership_policy": "All six source skills are intrinsic; no granted or personal-lord skill is omitted. Each active owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "徐盛",
    "source_variant": "基础身份／一将成名2011经典目录+明示Y0–Y13江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-108.html",
      "https://wiki.biligame.com/msgs/%E5%BE%90%E7%9B%9B",
      "https://wiki.biligame.com/msgs/%E7%A0%B4%E5%86%9B/%E5%BE%90%E7%9B%9B",
      "https://www.sanguosha.cn/index.php/pc/guide-info-79.html",
      "https://sanguosha.fandom.com/zh/wiki/徐盛?variant=zh-hans"
    ],
    "source_ids": [
      "mobile-xusheng",
      "bwiki-xusheng",
      "bwiki-pojun",
      "mobile-xusheng-guide",
      "public-faq-xusheng"
    ],
    "source_record_id": "sgs.adapted.base.hero.xu-sheng:2026-10-15",
    "faction": "吴",
    "source_gender": "male",
    "gender_provenance": {
      "max_hp": "bwiki-xusheng classic icon+numeric double check",
      "gender": "bwiki-xusheng explicit game gender",
      "faction": "mobile-xusheng plus bwiki-xusheng",
      "initial_hp": "No explicit field found",
      "source_id": "bwiki-xusheng",
      "revision_id": 34820,
      "revision_timestamp_utc": "2025-12-05T14:24:21Z",
      "official_field_verified": false,
      "current_client_verified": false
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-xusheng",
        "url": "https://www.sanguosha.cn/pc/hero-detail-108.html",
        "status": 200,
        "sha256": "b98eefa4337bb4f68e5533a24ae84683a859928b309561a0a7c0760e5f0c39c7",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "徐盛",
          "faction": "吴",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "limitations": [
          "Undated catalog; capture fixed to snapshot date.",
          "HP/gender/initialHP not explicit fields in this official page.",
          "Not a current-client login observation."
        ]
      },
      {
        "id": "bwiki-xusheng",
        "url": "https://wiki.biligame.com/msgs/%E5%BE%90%E7%9B%9B",
        "status": 200,
        "sha256": "a3eba9b645b984d7346680503e9eb2121e4b62d220b8cc746c6c05be1fad7c09",
        "access_date": "2026-10-15",
        "tier": "community_same_product_classic_metadata_and_rules_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 34820,
        "revision_timestamp_utc": "2025-12-05T14:24:21Z",
        "revision_url": "https://wiki.biligame.com/msgs/index.php?title=徐盛&oldid=34820",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId",
          "timestamp_field": "meta article:modified_time",
          "historical_revision_reopened": false,
          "transclusion_dates_independently_verified": false
        },
        "metadata": {
          "max_hp": 4,
          "initial_hp_explicit": null,
          "gender": "male",
          "gender_source_text": "男",
          "faction": "吴",
          "selected_section": "经典 base identity; historical, 国战 and hover blocks are not imported",
          "pack": "一将成名-2011"
        },
        "current_client_verified": false,
        "limitations": [
          "Community secondary evidence, not official numeric HP/gender certification.",
          "Page-level revision does not separately date transcluded templates.",
          "Visible update date and search cache may lag raw meta; preserve raw timestamp.",
          "No independent initialHP field; no historical revision login attempted."
        ]
      },
      {
        "id": "bwiki-pojun",
        "url": "https://wiki.biligame.com/msgs/%E7%A0%B4%E5%86%9B/%E5%BE%90%E7%9B%9B",
        "status": 200,
        "sha256": "63574847b39c90219e9087766bfae2ce2b183f71e1ffa793dde39170c4c37b0e",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 39020,
        "revision_timestamp_utc": "2026-06-11T13:57:51Z"
      },
      {
        "id": "mobile-xusheng-guide",
        "url": "https://www.sanguosha.cn/index.php/pc/guide-info-79.html",
        "status": 200,
        "sha256": "f7c6251c2e25decc0fc8888e09886a4373e31e295ff873f1593991ea101684d8",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "official_same_product_dated_variant_comparison",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "publication_date": "2020-06-19 20:36:52",
        "findings": "Explicit base Pojun own play phase vs Jie outside-turn trigger and conditional damage+1. No Jie additions imported."
      },
      {
        "id": "public-faq-xusheng",
        "url": "https://sanguosha.fandom.com/zh/wiki/徐盛?variant=zh-hans",
        "tier": "community_cross_product_historical_faq_public_search_observation",
        "publication_date": null,
        "access_date": "2026-10-15",
        "sha256": null,
        "summary": "Historical tabletop60/base FAQ: own play only; repeat per Slash and target; choose H/E using pre-damage HP; batch movement once; withheld equipment returns to hand.",
        "observation_type": "partial public web search/open text, before attempted raw fetch",
        "not_current_mobile_procedure_certification": true,
        "current_client_verified": false
      }
    ],
    "source_evidence_note": "官网完整身份技能（含隐藏补益、智迟面板）与势力已核；体力上限和规则性别来自同产品社区经典身份明确字段。历史跨产品FAQ只作旁证，部分仅有公开检索摘录；不冒充原始页面或当前移动客户端验证。初始满体力为Y0宿主约定。",
    "source_unknowns": [
      {
        "id": "U7",
        "hero": "徐盛",
        "skill": "破军",
        "detail": "Source target designation versus Liuli redirect ordering not settled by selected mobile pages."
      },
      {
        "id": "U8",
        "hero": "徐盛",
        "skill": "破军",
        "detail": "Exact return end-window priority/death/skillloss handling separated as host policy."
      }
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-xusheng"
      ],
      "revision_id": 34820,
      "revision_timestamp_utc": "2025-12-05T14:24:21Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "Y0",
      "display_note": "体力上限由手游社区经典勾玉图标与隐藏数值双核；官网无数值HP。独立initialHP未观察，满血开局是Y0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.xu-sheng",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "徐盛",
      "faction": "吴",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "Y0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀徐盛",
      "徐盛·破军",
      "xu-sheng"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang/xu-sheng.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "Y0",
        "title": "Metadata and initialization",
        "contract": "Use selected base maxHP3/4/4/3, genderF/M/M/M and faction吴/吴/吴/群. Independent source initialHP=null. FullHP start is host initialization, no identity-lord bonus inferred. All personal-lord/granted lists empty.",
        "basis": "Official identity inventory and same-product classic explicit HP/gender fields.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y1",
        "title": "Event identity, legal choices and privacy",
        "contract": "Every real movement, phase, damage, dying entry, Slash target branch and turn gets stable immutable ID. Claim receipts before effects. Stale/forged IDs cannot mutate state. Cancel before commitment free; committed effects/paid costs are not refunded. Hidden H represented by blind positions/seeded random, never whole enemy hand preview. Preserve physical identity and card family.",
        "basis": "Source distinctions H/E and events; transactional/privacy implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y2",
        "title": "Ganlu normal exchange",
        "contract": "Select two distinct living actors, self allowed; all E cards; abs(EA-EB)<=owner missingHP at commitment. Detach both whole E sets into exchange escrow before loss triggers, one loss batch per former owner, equipment-specific per-card leave effects as applicable; dispatch action order; then install reserved opposing set into matching slots. Not use/discard and not to hand.",
        "basis": "Official/mobile classic core; BWIKI Lingtong rule FAQ explicitly staged simultaneous exchange/loss before entry.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y3",
        "title": "Ganlu unusual zones and interruption",
        "contract": "Reject both-empty action as no-op UI policy; one empty allowed. Reject any exchange whose incoming standard corresponding slot is unavailable/abolished at initial validation. After commit no rollback: if destination dies or a nested effect makes installation impossible, resolve reserved cards through lawful discard or that card’s leave/destroy rule, never hand as fallback/duplicate. Reserved cards cannot be selected by nested Xuanfeng. Base source text does not certify these cross-pack cases.",
        "basis": "Host atomic ownership/conservation and derived equipment rules; source intrinsic unresolved two-empty no-effect legality.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y4",
        "title": "Buyi entry and choice",
        "contract": "One optional per holder per genuine dying-entry, including own holder at hp<=0 but not dead. Global action-order entry dispatch before Peach polling; respect already committed waive-rescue/death. Self chooses one H, another actor blind/seeded random. Reveal public then nonbasic discard by dying actor followed by recover1; basic remains. No retries in same entry after fail/still<=0; separate later entry eligible. EmptyH unavailable. Nested costs obey actual card-family and death checks.",
        "basis": "Official trigger/result; historical base FAQ procedural corroboration. Ordering against other same-window skills and foreign poison is host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y5",
        "title": "Xuanfeng equipment batch and sequential discard",
        "contract": "A committed owner loss batch with>=1E yields one optional offer regardless of number; hand-held equip loss not E. Independent batches each offer. Can sequentially discard0..2 total H/E from1..2 other actors, either side, no range; revalidate target/card after each nested move. No J/special pile. Support royal loyalist punishment loss; dead owner cannot newly act. Explicit host policy allows holder and target at hp<=0 but not finalized dead during nested rescue; selected mobile text lacks a separate no-dying gate, and current-client behavior is not certified.",
        "basis": "Official main trigger; BWIKI classic says sequential/up-to2; same-product FAQ batch and exchange. H/E not J and death cleanup are stated base/host boundary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y6",
        "title": "Xuanfeng discard stage",
        "contract": "During one actual own discard phase count own H/E actual discarded materials, not gift/steal/board moves or others cards owner discards. Offer once after ordinary discard before phase exit if count>=2; not every pair. E discard separately offers equipment-loss trigger. Skipped phase has no offer. Complex forced extra discards/reentrant phase-end exact timing is not current-client certified.",
        "basis": "Official discard>=2; BWIKI FAQ confirms within discard-phase timing. Specific aggregation/window is explicit host scheduler.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y7",
        "title": "Pojun designation and batch",
        "contract": "Once each Slash-use target branch in owner own play phase; snapshot target current positiveHP before response/damage. Select0..min(HP,H/E count), all chosen cards moved as one batch to target-owned facedown Pojun pile. No perturn cap. Original source uses designation wording; host currently places source designation after legal redirects, so original-target-before-Liuli timing is an unresolved intrinsic procedure and must be labeled.",
        "basis": "Official mobile and dated2020 comparison; historical matching FAQ H/E/batch/preHP.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y8",
        "title": "Pojun persistent return obligation",
        "contract": "Reserve physical IDs by target/turn/use/branch; exclude pile from H/E/ordinary-targetable zones and deck reshuffle. At actual turn-finally after end-stage effects return all existing batch cards to targetH, equipment included. Obligation survives XuSheng death/skill loss; dead target pile goes discard once, destroyed derived cards never recreated. Save/load preserve receipts and ownership; abnormal interruption must not strand cards.",
        "basis": "Official return core and historical FAQ hand; death/ledger/turn-abort/derived cases are explicit host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y9",
        "title": "Mingce gift then decision",
        "contract": "Once per actual play phase; give1 real H Slash or H/E equipment to distinct other living actorH. Slash variants qualify as physical Slash, not arbitrary view-as-eligible red card. Set quota when gift commits; resolve loss/gain then owner selects recipient legal attack-range target (may owner, not recipient); recipient picks materialless normal Slash or draw1; no target only draw. Gift itself is not consumed for Slash.",
        "basis": "Official gift/choice; same-product BWIKI explicit normalSlash/no-target; historical FAQ equipped gift and target-before-choice.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y10",
        "title": "Mingce virtual card and interruptions",
        "contract": "Recipient is card user/damage source; materialless ordinary normal Slash via actual use/response/equipment pipeline, no copied gift nature. Ignore ordinary own-play Slash quota for forced offturn use but honor real prohibitions. Giving equipment does not equip recipient. Hand gift faces are private to giver/recipient; equipment-origin cards remain publicly known; source does not explicitly specify visibility. If gift loss/gain nested triggers kill an actor or remove legal target, revalidate; committed gift persists, no refund. Third-party skill removal/effective-card conversions are host integration.",
        "basis": "Same-product core plus host real-card-use contract; no-current-client advanced-interaction certification.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y11",
        "title": "Zhichi trigger and effect invalidity",
        "contract": "Owner receives a positive damage EVENT outside owner actual turn, after damage/rescue survival, locked create shield until active turnID ends. First event not retroactively prevented. HP loss/ownturn damage no trigger, damage source not required. While shield active, effective Slash and ordinary-trick effect on owner invalid including beneficial effects; not targeting prohibition, not generic damage prevention. Basic Peach/Wine, equipment, delayedtrick, direct skill damage/HP loss unaffected.",
        "basis": "Official mobile full rule; card-family semantic expansion.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y12",
        "title": "Zhichi chain and persistence boundaries",
        "contract": "Check immunity at each fresh card-target effect entrance; do not reopen an already resolving Duel merely because a nested damage activates shield. Chain-propagated damage is not a new card effect so not automatically blocked. A created turn-effect persists through general-skill removal to turn-finally; no further activation after loss. Exact old-mobile chain/ongoingDuel/skillloss timing not verified; these are host contracts.",
        "basis": "Host consequence of effect-vs-damage architecture and existing Duanchang ledger conventions.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y13",
        "title": "Effective ownership and mode",
        "contract": "Every skill checks effective skill ledger; HuaMuLan copy gets full male packet/maxHP and new owner binding without importing other actor quotas/piles. CaiWenJi removes current skill providers, not equipment; resolved independent Pojun return/Zhichi shield remain. No personal lord skills truncated, but full identity relationships/reveal/reward/terminal ordering remains mode_pending.",
        "basis": "Cross-game host compatibility, not source law.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整六项固有技能按选定基础身份版本保留；Y0–Y13明确初始化、交换事务、失装批次、濒死进入、扣置归还、真实借杀与牌效果无效。现行客户端与完整身份模式未核，不混入界、国战、旧一将或其他产品变体。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "破军"
      ],
      "complete_signature": {
        "max_hp": 4,
        "gender": "male",
        "source_faction": "吴",
        "intrinsic_skill_inventory": [
          "破军"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "initial_hp_direct_source_value": null,
        "skills": [
          {
            "id": "sgs.pojun",
            "type": "optional_slash_target",
            "timing": "owner own play phase Slash target designation, before response/damage",
            "quota": "once per Slash-use target branch, no perturn cap",
            "cost": "none",
            "trigger_gate": "target currentHP>0 and legal H/E exists",
            "targets": "that Slash target",
            "effect": [
              "Snapshot current targetHP asX; temporarily move<=X targetH/E in one batch to target facedown pile.",
              "Pile unusable and excluded from hand/equipment; E abilities stop, actual loss triggers run.",
              "At true current turn end return those existing physical cards to targetH, not E."
            ],
            "policy_refs": [
              "Y1",
              "Y7",
              "Y8",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Source target designation versus Liuli redirect ordering not settled by selected mobile pages.",
              "Exact return end-window priority/death/skillloss handling separated as host policy."
            ]
          }
        ]
      },
      "signature_sha256": "a870d0f021f77f77074ea20e28557701987345a209bbb98bf9b7cf6dd959f8da",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 86,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "55e9893",
      "comparison_scope": "2026-10-15 captured 86 complete local entities plus 7 archived source identities; all 18 active originals included; not whole-source-catalog equivalence certification",
      "reason": "4HP requires every own-play Slash target optional <=current targetHP H/E physical temporary withholding in target pile, followed by return to targetH at turn end. Existing equalHP templates lack this timed temporary zone obligation.",
      "same_name_collisions": []
    },
    "skill_callback_modules": {
      "sgs.pojun": "sgs-yijiang-combat-skills.js"
    }
  },
  {
    "id": "sgs.adapted.base.hero.chen-gong",
    "source_name": "陈宫",
    "suggested_display_name": "陈宫",
    "product": "三国杀移动版",
    "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "source_faction": "群",
    "max_hp": 3,
    "gender": "male",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "Y0 host normal-full-HP initialization, not separate verified mobile initialHP field",
    "source_refs": [
      "mobile-chengong",
      "bwiki-chengong"
    ],
    "metadata_provenance": {
      "max_hp": "bwiki-chengong classic icon+numeric double check",
      "gender": "bwiki-chengong explicit game gender",
      "faction": "mobile-chengong plus bwiki-chengong",
      "initial_hp": "No explicit field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "intrinsic_skill_inventory": [
      "明策",
      "智迟"
    ],
    "granted_skill_inventory": [],
    "personal_lord_skills": [],
    "lord_inventory_basis": "Every official inline identity panel read, none is lord skill; no granted skill references",
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "implementation_status": "tested",
    "readiness": "complete_selected_core_inventory_with_explicit_procedural_and_host_boundaries",
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "reason": "Complete personal skill inventory does not certify identity/lord/reward/death/terminal scheduling.",
      "intrinsic_rules": "source-backed-implemented-selected-packet-with-explicit-host-policies",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "skills": [
      {
        "id": "sgs.mingce",
        "name": "明策",
        "type": "optional_active",
        "timing": "own play phase",
        "quota": "once per genuine play phase",
        "cost": "GIVE1 H Slash or H/E equipment",
        "trigger_gate": "distinct living recipient; eligible physical material",
        "targets": "recipient then owner-selected different legal Slash target within recipient range; can target owner",
        "effect": [
          "Gift enters recipientH first, resolves real losses/gains.",
          "Owner selects target before recipient chooses normal virtualSlash or draw1; no target forces draw.",
          "Slash is materialless ordinary normalSlash; recipient actual user/source; gifted card remains inH."
        ],
        "official_rule_text": "出牌阶段限一次，你可以将一张装备牌或【杀】交给一名其他角色，然后其选择一项：1.视为对其攻击范围内你选择的另一名角色使用【杀】；2.摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-chengong",
          "bwiki-chengong",
          "bwiki-mingce",
          "public-faq-chengong"
        ],
        "policy_refs": [
          "Y1",
          "Y9",
          "Y10",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Gifted effective-card families after foreign conversions and nested death/skillloss are host integration."
        ]
      },
      {
        "id": "sgs.zhichi",
        "name": "智迟",
        "type": "locked_trigger_and_temporary_card_effect_immunity",
        "timing": "after positive damage to owner outside owner actual turn",
        "quota": "per damage event marker; expires true current turn end",
        "cost": "none",
        "trigger_gate": "owner survives/rescued; actual turn belongs another actor",
        "targets": "owner as card-effect target",
        "effect": [
          "Until current turn ends, effective Slash and ordinary-trick effects on owner are invalid.",
          "Includes beneficial ordinary-trick effects, not a cannot-target prohibition.",
          "Does not stop Peach/Wine/equipment/delayedtricks/direct skill damage/HP loss; no retroactive first damage cancellation."
        ],
        "official_rule_text": "锁定技，当你于回合外受到伤害后，直到当前回合结束，【杀】和普通锦囊牌对你无效。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-chengong",
          "bwiki-chengong",
          "bwiki-zhichi",
          "public-faq-chengong"
        ],
        "policy_refs": [
          "Y1",
          "Y11",
          "Y12",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Chain transfer, currently-resolving Duel and effect persistence after skill loss are explicit host policies."
        ]
      }
    ],
    "excluded_variants": [
      "谋陈宫策marks/HP-loss directdamage excluded",
      "No different-product self-gift Mingce imported"
    ],
    "skill_ids": [
      "sgs.mingce",
      "sgs.zhichi"
    ],
    "ui_requirements": [
      "Show all intrinsic skills plus once/phase or event states; no hidden passive omissions.",
      "Use original-created art only; no official portrait asset redistribution.",
      "Describe source variant and client-verification status visibly in details.",
      "Do not reveal enemy H faces or temporary concealed cards."
    ],
    "name": "陈宫",
    "display_name": "陈宫",
    "skill_name": "明策/智迟",
    "skill_desc": "明策：出牌阶段限一次，你可以将一张装备牌或【杀】交给一名其他角色，然后其选择一项：1.视为对其攻击范围内你选择的另一名角色使用【杀】；2.摸一张牌。 智迟：锁定技，当你于回合外受到伤害后，直到当前回合结束，【杀】和普通锦囊牌对你无效。",
    "intrinsic_skill_ids": [
      "sgs.mingce",
      "sgs.zhichi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.mingce",
      "sgs.zhichi"
    ],
    "complete_skill_names": [
      "明策",
      "智迟"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.mingce",
        "name": "明策",
        "type": "optional_active",
        "timing": "own play phase",
        "quota": "once per genuine play phase",
        "cost": "GIVE1 H Slash or H/E equipment",
        "trigger_gate": "distinct living recipient; eligible physical material",
        "targets": "recipient then owner-selected different legal Slash target within recipient range; can target owner",
        "effect": [
          "Gift enters recipientH first, resolves real losses/gains.",
          "Owner selects target before recipient chooses normal virtualSlash or draw1; no target forces draw.",
          "Slash is materialless ordinary normalSlash; recipient actual user/source; gifted card remains inH."
        ],
        "official_rule_text": "出牌阶段限一次，你可以将一张装备牌或【杀】交给一名其他角色，然后其选择一项：1.视为对其攻击范围内你选择的另一名角色使用【杀】；2.摸一张牌。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-chengong",
          "bwiki-chengong",
          "bwiki-mingce",
          "public-faq-chengong"
        ],
        "policy_refs": [
          "Y1",
          "Y9",
          "Y10",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Gifted effective-card families after foreign conversions and nested death/skillloss are host integration."
        ]
      },
      {
        "id": "sgs.zhichi",
        "name": "智迟",
        "type": "locked_trigger_and_temporary_card_effect_immunity",
        "timing": "after positive damage to owner outside owner actual turn",
        "quota": "per damage event marker; expires true current turn end",
        "cost": "none",
        "trigger_gate": "owner survives/rescued; actual turn belongs another actor",
        "targets": "owner as card-effect target",
        "effect": [
          "Until current turn ends, effective Slash and ordinary-trick effects on owner are invalid.",
          "Includes beneficial ordinary-trick effects, not a cannot-target prohibition.",
          "Does not stop Peach/Wine/equipment/delayedtricks/direct skill damage/HP loss; no retroactive first damage cancellation."
        ],
        "official_rule_text": "锁定技，当你于回合外受到伤害后，直到当前回合结束，【杀】和普通锦囊牌对你无效。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-chengong",
          "bwiki-chengong",
          "bwiki-zhichi",
          "public-faq-chengong"
        ],
        "policy_refs": [
          "Y1",
          "Y11",
          "Y12",
          "Y13"
        ],
        "source_procedure_unknowns": [
          "Chain transfer, currently-resolving Duel and effect persistence after skill loss are explicit host policies."
        ]
      }
    ],
    "skill_ownership_policy": "All six source skills are intrinsic; no granted or personal-lord skill is omitted. Each active owner uses its own effective-skill binding.",
    "source_game": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "production_integration_status": "local-registration-awaiting-callback-and-ui-integration",
    "runtime_validation_status": "native-mechanisms-tested-release-controlled-by-validation-report",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "陈宫",
    "source_variant": "基础身份／一将成名2011经典目录+明示Y0–Y13江湖适配",
    "source_date": "2026-10-15目录快照；官网完整身份技能、手游社区经典元数据与历史流程旁证分列",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-103.html",
      "https://wiki.biligame.com/msgs/%E9%99%88%E5%AE%AB",
      "https://wiki.biligame.com/msgs/%E6%98%8E%E7%AD%96/%E9%99%88%E5%AE%AB",
      "https://sanguosha.fandom.com/zh/wiki/陈宫",
      "https://wiki.biligame.com/msgs/%E6%99%BA%E8%BF%9F/%E9%99%88%E5%AE%AB"
    ],
    "source_ids": [
      "mobile-chengong",
      "bwiki-chengong",
      "bwiki-mingce",
      "public-faq-chengong",
      "bwiki-zhichi"
    ],
    "source_record_id": "sgs.adapted.base.hero.chen-gong:2026-10-15",
    "faction": "群",
    "source_gender": "male",
    "gender_provenance": {
      "max_hp": "bwiki-chengong classic icon+numeric double check",
      "gender": "bwiki-chengong explicit game gender",
      "faction": "mobile-chengong plus bwiki-chengong",
      "initial_hp": "No explicit field found",
      "source_id": "bwiki-chengong",
      "revision_id": 35717,
      "revision_timestamp_utc": "2026-01-09T08:16:59Z",
      "official_field_verified": false,
      "current_client_verified": false
    },
    "gender_official_field_verified": false,
    "source_evidence_tiers": [
      {
        "id": "mobile-chengong",
        "url": "https://www.sanguosha.cn/pc/hero-detail-103.html",
        "status": 200,
        "sha256": "2befcd0d8f6bba70c463ac49ed43b93be6ad7165582ca704cdfa63501e1b1d3f",
        "access_date": "2026-10-15",
        "tier": "official_same_product_base_identity_catalog",
        "product": "三国杀移动版",
        "publication_date": null,
        "current_client_verified": false,
        "metadata": {
          "source_name": "陈宫",
          "faction": "群",
          "max_hp_direct": null,
          "gender_direct": null,
          "initial_hp_direct": null
        },
        "limitations": [
          "Undated catalog; capture fixed to snapshot date.",
          "HP/gender/initialHP not explicit fields in this official page.",
          "Not a current-client login observation."
        ]
      },
      {
        "id": "bwiki-chengong",
        "url": "https://wiki.biligame.com/msgs/%E9%99%88%E5%AE%AB",
        "status": 200,
        "sha256": "d69a30a632293df092e610dfa447b0830480a55e01404bb8015de1f3340cdde2",
        "access_date": "2026-10-15",
        "tier": "community_same_product_classic_metadata_and_rules_crosscheck",
        "product": "三国杀移动版",
        "revision_id": 35717,
        "revision_timestamp_utc": "2026-01-09T08:16:59Z",
        "revision_url": "https://wiki.biligame.com/msgs/index.php?title=陈宫&oldid=35717",
        "revision_evidence": {
          "revision_id_field": "RLCONF.wgRevisionId",
          "timestamp_field": "meta article:modified_time",
          "historical_revision_reopened": false,
          "transclusion_dates_independently_verified": false
        },
        "metadata": {
          "max_hp": 3,
          "initial_hp_explicit": null,
          "gender": "male",
          "gender_source_text": "男",
          "faction": "群",
          "selected_section": "经典 base identity; historical, 国战 and hover blocks are not imported",
          "pack": "一将成名-2011"
        },
        "current_client_verified": false,
        "limitations": [
          "Community secondary evidence, not official numeric HP/gender certification.",
          "Page-level revision does not separately date transcluded templates.",
          "Visible update date and search cache may lag raw meta; preserve raw timestamp.",
          "No independent initialHP field; no historical revision login attempted."
        ]
      },
      {
        "id": "bwiki-mingce",
        "url": "https://wiki.biligame.com/msgs/%E6%98%8E%E7%AD%96/%E9%99%88%E5%AE%AB",
        "status": 200,
        "sha256": "28089e59128b830db455a3cfb48c6ca4e0b5069fc4aececedf2a0b21c7a530f2",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 38886,
        "revision_timestamp_utc": "2026-06-07T12:54:26Z"
      },
      {
        "id": "public-faq-chengong",
        "url": "https://sanguosha.fandom.com/zh/wiki/陈宫",
        "tier": "community_cross_product_historical_faq_public_search_observation",
        "publication_date": null,
        "access_date": "2026-10-15",
        "sha256": null,
        "summary": "Historical base FAQ: Mingce owner selects Slash target before recipient chooses; no target forces draw; equipped card can be given; Zhichi until active current turn ends.",
        "observation_type": "partial public web search/open text, before attempted raw fetch",
        "not_current_mobile_procedure_certification": true,
        "current_client_verified": false
      },
      {
        "id": "bwiki-zhichi",
        "url": "https://wiki.biligame.com/msgs/%E6%99%BA%E8%BF%9F/%E9%99%88%E5%AE%AB",
        "status": 200,
        "sha256": "6f4434a89170b9088206741746cbb2dd14a8f54ca9b6c8843c140877c9f32d13",
        "access_date": "2026-10-15",
        "current_client_verified": false,
        "tier": "community_same_product_classic_skill_page",
        "selection": "Classic section only; never append related/hover hero or 国战/historical block.",
        "revision_id": 38928,
        "revision_timestamp_utc": "2026-06-11T03:43:19Z"
      }
    ],
    "source_evidence_note": "官网完整身份技能（含隐藏补益、智迟面板）与势力已核；体力上限和规则性别来自同产品社区经典身份明确字段。历史跨产品FAQ只作旁证，部分仅有公开检索摘录；不冒充原始页面或当前移动客户端验证。初始满体力为Y0宿主约定。",
    "source_unknowns": [
      {
        "id": "U9",
        "hero": "陈宫",
        "skill": "明策",
        "detail": "Gifted effective-card families after foreign conversions and nested death/skillloss are host integration."
      },
      {
        "id": "U10",
        "hero": "陈宫",
        "skill": "智迟",
        "detail": "Chain transfer, currently-resolving Duel and effect persistence after skill loss are explicit host policies."
      }
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-chengong"
      ],
      "revision_id": 35717,
      "revision_timestamp_utc": "2026-01-09T08:16:59Z",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "Y0",
      "display_note": "体力上限由手游社区经典勾玉图标与隐藏数值双核；官网无数值HP。独立initialHP未观察，满血开局是Y0本作初始化。"
    },
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.chen-gong",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mainland-mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "陈宫",
      "faction": "群",
      "gender": "male",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "Y0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "aliases": [
      "三国杀陈宫",
      "陈宫·明策/智迟",
      "chen-gong"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-sgs-yijiang/chen-gong.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "host_compatibility_policies": [
      {
        "id": "Y0",
        "title": "Metadata and initialization",
        "contract": "Use selected base maxHP3/4/4/3, genderF/M/M/M and faction吴/吴/吴/群. Independent source initialHP=null. FullHP start is host initialization, no identity-lord bonus inferred. All personal-lord/granted lists empty.",
        "basis": "Official identity inventory and same-product classic explicit HP/gender fields.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y1",
        "title": "Event identity, legal choices and privacy",
        "contract": "Every real movement, phase, damage, dying entry, Slash target branch and turn gets stable immutable ID. Claim receipts before effects. Stale/forged IDs cannot mutate state. Cancel before commitment free; committed effects/paid costs are not refunded. Hidden H represented by blind positions/seeded random, never whole enemy hand preview. Preserve physical identity and card family.",
        "basis": "Source distinctions H/E and events; transactional/privacy implementation contract.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y2",
        "title": "Ganlu normal exchange",
        "contract": "Select two distinct living actors, self allowed; all E cards; abs(EA-EB)<=owner missingHP at commitment. Detach both whole E sets into exchange escrow before loss triggers, one loss batch per former owner, equipment-specific per-card leave effects as applicable; dispatch action order; then install reserved opposing set into matching slots. Not use/discard and not to hand.",
        "basis": "Official/mobile classic core; BWIKI Lingtong rule FAQ explicitly staged simultaneous exchange/loss before entry.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y3",
        "title": "Ganlu unusual zones and interruption",
        "contract": "Reject both-empty action as no-op UI policy; one empty allowed. Reject any exchange whose incoming standard corresponding slot is unavailable/abolished at initial validation. After commit no rollback: if destination dies or a nested effect makes installation impossible, resolve reserved cards through lawful discard or that card’s leave/destroy rule, never hand as fallback/duplicate. Reserved cards cannot be selected by nested Xuanfeng. Base source text does not certify these cross-pack cases.",
        "basis": "Host atomic ownership/conservation and derived equipment rules; source intrinsic unresolved two-empty no-effect legality.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y4",
        "title": "Buyi entry and choice",
        "contract": "One optional per holder per genuine dying-entry, including own holder at hp<=0 but not dead. Global action-order entry dispatch before Peach polling; respect already committed waive-rescue/death. Self chooses one H, another actor blind/seeded random. Reveal public then nonbasic discard by dying actor followed by recover1; basic remains. No retries in same entry after fail/still<=0; separate later entry eligible. EmptyH unavailable. Nested costs obey actual card-family and death checks.",
        "basis": "Official trigger/result; historical base FAQ procedural corroboration. Ordering against other same-window skills and foreign poison is host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y5",
        "title": "Xuanfeng equipment batch and sequential discard",
        "contract": "A committed owner loss batch with>=1E yields one optional offer regardless of number; hand-held equip loss not E. Independent batches each offer. Can sequentially discard0..2 total H/E from1..2 other actors, either side, no range; revalidate target/card after each nested move. No J/special pile. Support royal loyalist punishment loss; dead owner cannot newly act. Explicit host policy allows holder and target at hp<=0 but not finalized dead during nested rescue; selected mobile text lacks a separate no-dying gate, and current-client behavior is not certified.",
        "basis": "Official main trigger; BWIKI classic says sequential/up-to2; same-product FAQ batch and exchange. H/E not J and death cleanup are stated base/host boundary.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y6",
        "title": "Xuanfeng discard stage",
        "contract": "During one actual own discard phase count own H/E actual discarded materials, not gift/steal/board moves or others cards owner discards. Offer once after ordinary discard before phase exit if count>=2; not every pair. E discard separately offers equipment-loss trigger. Skipped phase has no offer. Complex forced extra discards/reentrant phase-end exact timing is not current-client certified.",
        "basis": "Official discard>=2; BWIKI FAQ confirms within discard-phase timing. Specific aggregation/window is explicit host scheduler.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y7",
        "title": "Pojun designation and batch",
        "contract": "Once each Slash-use target branch in owner own play phase; snapshot target current positiveHP before response/damage. Select0..min(HP,H/E count), all chosen cards moved as one batch to target-owned facedown Pojun pile. No perturn cap. Original source uses designation wording; host currently places source designation after legal redirects, so original-target-before-Liuli timing is an unresolved intrinsic procedure and must be labeled.",
        "basis": "Official mobile and dated2020 comparison; historical matching FAQ H/E/batch/preHP.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y8",
        "title": "Pojun persistent return obligation",
        "contract": "Reserve physical IDs by target/turn/use/branch; exclude pile from H/E/ordinary-targetable zones and deck reshuffle. At actual turn-finally after end-stage effects return all existing batch cards to targetH, equipment included. Obligation survives XuSheng death/skill loss; dead target pile goes discard once, destroyed derived cards never recreated. Save/load preserve receipts and ownership; abnormal interruption must not strand cards.",
        "basis": "Official return core and historical FAQ hand; death/ledger/turn-abort/derived cases are explicit host policy.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y9",
        "title": "Mingce gift then decision",
        "contract": "Once per actual play phase; give1 real H Slash or H/E equipment to distinct other living actorH. Slash variants qualify as physical Slash, not arbitrary view-as-eligible red card. Set quota when gift commits; resolve loss/gain then owner selects recipient legal attack-range target (may owner, not recipient); recipient picks materialless normal Slash or draw1; no target only draw. Gift itself is not consumed for Slash.",
        "basis": "Official gift/choice; same-product BWIKI explicit normalSlash/no-target; historical FAQ equipped gift and target-before-choice.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y10",
        "title": "Mingce virtual card and interruptions",
        "contract": "Recipient is card user/damage source; materialless ordinary normal Slash via actual use/response/equipment pipeline, no copied gift nature. Ignore ordinary own-play Slash quota for forced offturn use but honor real prohibitions. Giving equipment does not equip recipient. Hand gift faces are private to giver/recipient; equipment-origin cards remain publicly known; source does not explicitly specify visibility. If gift loss/gain nested triggers kill an actor or remove legal target, revalidate; committed gift persists, no refund. Third-party skill removal/effective-card conversions are host integration.",
        "basis": "Same-product core plus host real-card-use contract; no-current-client advanced-interaction certification.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y11",
        "title": "Zhichi trigger and effect invalidity",
        "contract": "Owner receives a positive damage EVENT outside owner actual turn, after damage/rescue survival, locked create shield until active turnID ends. First event not retroactively prevented. HP loss/ownturn damage no trigger, damage source not required. While shield active, effective Slash and ordinary-trick effect on owner invalid including beneficial effects; not targeting prohibition, not generic damage prevention. Basic Peach/Wine, equipment, delayedtrick, direct skill damage/HP loss unaffected.",
        "basis": "Official mobile full rule; card-family semantic expansion.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y12",
        "title": "Zhichi chain and persistence boundaries",
        "contract": "Check immunity at each fresh card-target effect entrance; do not reopen an already resolving Duel merely because a nested damage activates shield. Chain-propagated damage is not a new card effect so not automatically blocked. A created turn-effect persists through general-skill removal to turn-finally; no further activation after loss. Exact old-mobile chain/ongoingDuel/skillloss timing not verified; these are host contracts.",
        "basis": "Host consequence of effect-vs-damage architecture and existing Duanchang ledger conventions.",
        "classification": "host_compatibility_policy"
      },
      {
        "id": "Y13",
        "title": "Effective ownership and mode",
        "contract": "Every skill checks effective skill ledger; HuaMuLan copy gets full male packet/maxHP and new owner binding without importing other actor quotas/piles. CaiWenJi removes current skill providers, not equipment; resolved independent Pojun return/Zhichi shield remain. No personal lord skills truncated, but full identity relationships/reveal/reward/terminal ordering remains mode_pending.",
        "basis": "Cross-game host compatibility, not source law.",
        "classification": "host_compatibility_policy"
      }
    ],
    "adaptation_notes": "完整六项固有技能按选定基础身份版本保留；Y0–Y13明确初始化、交换事务、失装批次、濒死进入、扣置归还、真实借杀与牌效果无效。现行客户端与完整身份模式未核，不混入界、国战、旧一将或其他产品变体。",
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "明策",
        "智迟"
      ],
      "complete_signature": {
        "max_hp": 3,
        "gender": "male",
        "source_faction": "群",
        "intrinsic_skill_inventory": [
          "明策",
          "智迟"
        ],
        "granted_skill_inventory": [],
        "personal_lord_skills": [],
        "initial_hp_direct_source_value": null,
        "skills": [
          {
            "id": "sgs.mingce",
            "type": "optional_active",
            "timing": "own play phase",
            "quota": "once per genuine play phase",
            "cost": "GIVE1 H Slash or H/E equipment",
            "trigger_gate": "distinct living recipient; eligible physical material",
            "targets": "recipient then owner-selected different legal Slash target within recipient range; can target owner",
            "effect": [
              "Gift enters recipientH first, resolves real losses/gains.",
              "Owner selects target before recipient chooses normal virtualSlash or draw1; no target forces draw.",
              "Slash is materialless ordinary normalSlash; recipient actual user/source; gifted card remains inH."
            ],
            "policy_refs": [
              "Y1",
              "Y9",
              "Y10",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Gifted effective-card families after foreign conversions and nested death/skillloss are host integration."
            ]
          },
          {
            "id": "sgs.zhichi",
            "type": "locked_trigger_and_temporary_card_effect_immunity",
            "timing": "after positive damage to owner outside owner actual turn",
            "quota": "per damage event marker; expires true current turn end",
            "cost": "none",
            "trigger_gate": "owner survives/rescued; actual turn belongs another actor",
            "targets": "owner as card-effect target",
            "effect": [
              "Until current turn ends, effective Slash and ordinary-trick effects on owner are invalid.",
              "Includes beneficial ordinary-trick effects, not a cannot-target prohibition.",
              "Does not stop Peach/Wine/equipment/delayedtricks/direct skill damage/HP loss; no retroactive first damage cancellation."
            ],
            "policy_refs": [
              "Y1",
              "Y11",
              "Y12",
              "Y13"
            ],
            "source_procedure_unknowns": [
              "Chain transfer, currently-resolving Duel and effect persistence after skill loss are explicit host policies."
            ]
          }
        ]
      },
      "signature_sha256": "a1eb4f2030ac716ae36973e03c3fe00e2524c7402622bef18dc35c676addaab8",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 86,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "55e9893",
      "comparison_scope": "2026-10-15 captured 86 complete local entities plus 7 archived source identities; all 18 active originals included; not whole-source-catalog equivalence certification",
      "reason": "3HP requires once/play gift realSlash/equipment to OTHER actor, owner chooses target before recipient chooses virtualnormalSlash or draw1, PLUS locked offturn-postdamage Slash/allordinarytrick effect invalidity until currentturn ends. No equalHP existing full packet contains both.",
      "same_name_collisions": []
    },
    "skill_callback_modules": {
      "sgs.mingce": "sgs-yijiang-combat-skills.js",
      "sgs.zhichi": "sgs-yijiang-combat-skills.js"
    }
  }
];
export const SGS_YIJIANG_DEFINITIONS = Object.freeze(definitions);
