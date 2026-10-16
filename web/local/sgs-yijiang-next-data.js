/** V28 complete selected mobile identity source packets. Runtime registration remains gated
 * until full parent validation. Source maxHP is separate from N0 initialHP policy. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.liao-hua",
    "source_name": "廖化",
    "suggested_display_name": "廖化",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "蜀",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "N0 host full-HP initialization",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "source_refs": [
      "mobile-liaohua",
      "bwiki-liaohua"
    ],
    "intrinsic_skill_inventory": [
      "当先",
      "伏枥"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "complete_selected_core_inventory_with_explicit_host_boundaries",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.dangxian",
        "name": "当先",
        "type": "locked_phase_insertion",
        "timing": "actual owner turn start before preparation",
        "quota": "one inserted play phase per actual turn start",
        "cost": "none",
        "targets": "owner",
        "effects": [
          "Execute a real additional play phase, then resume preparation/judgment/draw/normal play.",
          "No draw or extra whole turn. No inherent additional Slash uses inside one phase.",
          "No discard-pile Slash acquisition or HP payment."
        ],
        "official_rule_text": "锁定技，回合开始时，你执行一个额外的出牌阶段。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-liaohua",
          "bwiki-liaohua",
          "bwiki-dangxian"
        ],
        "policy_refs": [
          "N0",
          "N1"
        ]
      },
      {
        "id": "sgs.fuli",
        "name": "伏枥",
        "type": "optional_limited_dying_recovery_and_flip",
        "timing": "owner is still dying, at actual owner response opportunities before final death",
        "quota": "once per game for this skill owner",
        "cost": "spend limited marker; no physical card",
        "targets": "owner",
        "effects": [
          "Recover current HP to X (subject to maxHP); X is distinct factions among living actors.",
          "Then turn general card over; not always set face-down.",
          "No draw, cleanup, unchain, lost-HP prevention or post-death revival."
        ],
        "official_rule_text": "限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-liaohua",
          "bwiki-liaohua",
          "bwiki-fuli"
        ],
        "policy_refs": [
          "N0",
          "N2",
          "N3",
          "N4"
        ]
      }
    ],
    "excluded_variants": [
      "界当先 obtains Slash from discard; excluded.",
      "界伏枥 conditional flip when sole highestHP; excluded.",
      "OL一将之魂 HP loss/obtainSlash and hand refill variant; excluded."
    ],
    "skill_ids": [
      "sgs.dangxian",
      "sgs.fuli"
    ],
    "ui_requirements": [
      "Both actual intrinsic skills and exact selected variant visible.",
      "Source-backed ≠ current client certified.",
      "Stable phase/death/limited-state prompts and save/import receipts.",
      "Original-created portrait only; no official artwork imported.",
      "Show inserted phase distinct from ordinary play without suggesting extra turn.",
      "伏枥 preview: X, living faction roster and host 江湖 policy; spent marker and resulting HP/flip."
    ],
    "name": "廖化",
    "display_name": "廖化",
    "skill_name": "当先/伏枥",
    "skill_desc": "当先：锁定技，回合开始时，你执行一个额外的出牌阶段。 伏枥：限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。",
    "source_character_name": "廖化",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "蜀",
    "source_id_aliases": [],
    "aliases": [
      "三国杀廖化",
      "廖化·当先/伏枥",
      "liao-hua"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-115.html",
      "https://wiki.biligame.com/msgs/%E5%BB%96%E5%8C%96",
      "https://wiki.biligame.com/msgs/%E5%BD%93%E5%85%88",
      "https://wiki.biligame.com/msgs/%E4%BC%8F%E6%9E%A5"
    ],
    "source_records": [
      {
        "id": "mobile-liaohua",
        "url": "https://www.sanguosha.cn/pc/hero-detail-115.html",
        "status": 200,
        "bytes": 21271,
        "sha256": "1d62202ee15bf65a2947d1b329a3af613b1ccf696bddcd7f04cabff7eabbda7d",
        "accessed_at": "2026-10-15T22:37:39.311561+00:00",
        "raw_path": "evidence/mobile-liaohua.html",
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
                  "name": "当先",
                  "hidden": false,
                  "rule_text": "锁定技，回合开始时，你执行一个额外的出牌阶段。",
                  "rule_sha256": "ea020faf3e51ec66d97549223b8cdbf53ddcde67fbf4f3ccd74f982dfcf8da0b",
                  "html_line": 184
                },
                {
                  "name": "伏枥",
                  "hidden": true,
                  "rule_text": "限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。",
                  "rule_sha256": "10d5255894c56ae0332e6d826c42c87b3ac1623beb5762479340b007d7f5c60b",
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
          "initial_hp_explicit": null
        },
        "limitations": [
          "Undated website catalog; not authenticated current-client rules or HP.",
          "Official HTML has no direct numeric max HP or explicit game-gender field."
        ]
      },
      {
        "id": "bwiki-liaohua",
        "url": "https://wiki.biligame.com/msgs/%E5%BB%96%E5%8C%96",
        "status": 200,
        "bytes": 84014,
        "sha256": "03e41e654c00192a90140e65f0052f7ced29881c094251ae5988813e108a61f0",
        "accessed_at": "2026-10-15T22:37:39.503328+00:00",
        "raw_path": "evidence/bwiki-liaohua.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 35602,
        "modified_at": "2026-01-05T08:03:14Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "蜀",
          "initial_hp_explicit": null,
          "hp_html_line": 632,
          "gender_html_line": 627,
          "faction_html_line": 628,
          "selected_section": "经典, current branch; historical block excluded"
        }
      },
      {
        "id": "bwiki-dangxian",
        "url": "https://wiki.biligame.com/msgs/%E5%BD%93%E5%85%88",
        "status": 200,
        "bytes": 73317,
        "sha256": "a2bfc498ab176f1cfe546270bcb1b9edc5ea2543aa4cde3d1bea18102128ad54",
        "accessed_at": "2026-10-15T22:37:42.807745+00:00",
        "raw_path": "evidence/bwiki-dangxian.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 5024,
        "modified_at": "2022-03-22T08:36:24Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ]
      },
      {
        "id": "bwiki-fuli",
        "url": "https://wiki.biligame.com/msgs/%E4%BC%8F%E6%9E%A5",
        "status": 200,
        "bytes": 66300,
        "sha256": "cb2c3bbac2accc020fe475b4e8746b8226e0c917dd4feaa952b9bda9dbdc474b",
        "accessed_at": "2026-10-15T22:37:43.028965+00:00",
        "raw_path": "evidence/bwiki-fuli.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 10637,
        "modified_at": "2022-09-16T05:44:54Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.dangxian",
        "name": "当先",
        "type": "locked_phase_insertion",
        "timing": "actual owner turn start before preparation",
        "quota": "one inserted play phase per actual turn start",
        "cost": "none",
        "targets": "owner",
        "effects": [
          "Execute a real additional play phase, then resume preparation/judgment/draw/normal play.",
          "No draw or extra whole turn. No inherent additional Slash uses inside one phase.",
          "No discard-pile Slash acquisition or HP payment."
        ],
        "official_rule_text": "锁定技，回合开始时，你执行一个额外的出牌阶段。",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-liaohua",
          "bwiki-liaohua",
          "bwiki-dangxian"
        ],
        "policy_refs": [
          "N0",
          "N1"
        ]
      },
      {
        "id": "sgs.fuli",
        "name": "伏枥",
        "type": "optional_limited_dying_recovery_and_flip",
        "timing": "owner is still dying, at actual owner response opportunities before final death",
        "quota": "once per game for this skill owner",
        "cost": "spend limited marker; no physical card",
        "targets": "owner",
        "effects": [
          "Recover current HP to X (subject to maxHP); X is distinct factions among living actors.",
          "Then turn general card over; not always set face-down.",
          "No draw, cleanup, unchain, lost-HP prevention or post-death revival."
        ],
        "official_rule_text": "限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-liaohua",
          "bwiki-liaohua",
          "bwiki-fuli"
        ],
        "policy_refs": [
          "N0",
          "N2",
          "N3",
          "N4"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.dangxian",
      "sgs.fuli"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.dangxian",
      "sgs.fuli"
    ],
    "complete_skill_names": [
      "当先",
      "伏枥"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "aggregate-and-independent-validation-passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "N0",
        "title": "Scope and HP",
        "rule": "Base Mobile identity website snapshots only. Initial HP direct source=null; ordinary full-max-HP initialization is host policy. No native identity win/reward/lord system certification. Every supplied inherent skill is mandatory for the complete package.",
        "basis": "Official raw complete tabs plus BWIKI explicit classic HP/gender; user product scope frozen2026-10-15.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N1",
        "title": "Full phase execution",
        "rule": "当先 creates one actual owner PLAY phase inside current actual turn before preparation and judgment. Run proper play entry/action/end and phase-local quotas. Do not start a new turn, draw, judgment, discard or end phase. Keep turn-long buffs, use history, per-turn Wine and per-turn skill quotas intact. Never approximate by +1 Slash use. Face-down scheduled-turn skip happens before actual turn-start and produces no 当先. If owner dies, stop remaining phases.",
        "basis": "Official 当先; matching OL2016 before-judgment and per-phase Slash/per-turn Wine examples. Exact modern Mobile exotic phase-before/after trigger ordering unverified; this host provides explicit scheduler semantics.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N2",
        "title": "Distinct faction resolver",
        "rule": "Use actual current effective source form after 易装. Native SGS source context (including one merged SGS source alias) determines 魏/蜀/吴/群 etc; an actor with no SGS source faction is assigned one neutral 江湖 compatibility group. Never use human/AI sides or YXS君/臣/民 identity classes. Count each living actor once, distinct faction labels once; include dying-not-dead owner, exclude final dead. Do not count aliases as extra actors. Preserve immutable original/source provenance and expose count plus per-actor basis in 伏枥 UI.",
        "basis": "Explicit parent/root host decision relayed2026-10-15 22:40UTC; not a source-game rule and not native-mode certification. Source core remains X=全场势力数.",
        "status": "parent_confirmed_host_policy_not_yet_implemented"
      },
      {
        "id": "N3",
        "title": "Fuli resolution",
        "rule": "Optional unused 限定技 only while owner HP<=0 and not final-dead, at dying response. Commit lifetime-used marker before callbacks, snapshot current distinct living faction count X, recover toward min(X,currentMaxHP), then actually toggle general orientation. Recovery is recovery, not set-positive resurrection or damage prevention. No hand reset, draw, unchain or discard. The flip occurs even when X is small; existing face-down toggles face-up. Never reset the spent marker on phase/turn/save reload or skill reacquisition for that same owner lifetime.",
        "basis": "Official Mobile full hidden 伏枥 plus same-product skill page. Exact nested response priority, marker retention on cross-game copy/reacquisition, reduced-maxHP clamping are explicit host compatibility rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N4",
        "title": "Dying priority and recovery receipt",
        "rule": "伏枥 is available while owner remains dying, through a real owner dying-response choice alongside legal self rescue. An optional early owner offer may exist, but declining it cannot remove the unused skill from later owner response opportunities during the same still-open dying episode. Use receipts for each committed activation, not a permanent decline-as-spent flag. Once HP>0 or final-dead, no offer. Commit limited marker before recovery; skill removal disables it. A copy creates the receiving actor own unused marker unless that actor already spent this same skill. Exact cross-game response ordering is disclosed host policy.",
        "basis": "Official wording is 处于濒死, distinct from 进入濒死; optional choice must remain meaningful. Foreign skill priority and copy/marker behavior are explicit host requirements, not Mobile client certification.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N5",
        "title": "Anxu transaction",
        "rule": "Once per actual owner play phase, select two distinct other living actors with unequal HAND counts. Snapshot higher/lower roles at commitment, mark quota, then higher actor MUST choose one actual hand card to GIVE lower actor. Not owner-choice or random theft; no equipment, judgment or personal pile. Complete normal loss/gain events, then compare actual resulting hand counts. If equal and owner remains active, owner chooses draw1 or recover1 (only draw if full). No suit test, no mandatory reveal, no gain of the transferred card by owner. No distance/team/sex gate.",
        "basis": "Official2015-12-01 change and catalog. Receipt/revalidation, nested gain-loss ordering and stop on new death are disclosed host rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N6",
        "title": "Zhuiyi death action",
        "rule": "After unsuccessful rescue reaches committed final death, use pre-death effective-skill snapshot to offer 追忆 once per death receipt. Dead owner may choose one OTHER living actor except actual killer. Draw3 first then recover1 capped by recipient current maximum, with real draw/recovery callbacks. Full-HP recipient remains legal for draw3. No source/owner revival or transfer of dead hand. Final death caused solely by HP loss has no damage killer; the actor that caused HP loss is not automatically excluded. Source-less death excludes nobody except the dead owner.",
        "basis": "Official hidden 追忆 and exact same-product skill text. Kill attribution for HP loss follows host damage-vs-loss semantics; modern Mobile nested death ordering not client verified.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N7",
        "title": "Death lifecycle and finish boundary",
        "rule": "Record immutable death context (kind, damage-source/killer, source-skill, pre-death effective skill IDs, death ID) before asynchronous cleanup. Retain 追忆 ability long enough to execute even though owner.dead is true; do not reopen rescue. Shared host order: death receipt→intrinsic death effects→physical zone cleanup→match-end evaluation. A recipient that becomes final-dead during draw cannot recover. Respect prior skill loss, stale choices, cancellation, and one receipt across save/import/replay.",
        "basis": "Cross-game host ordering proposal, not a claim about Mobile native victory/reward order. Existing before_death_commit hook actually occurs after dead=true and is candidate integration point.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N9",
        "title": "Pinned catalog version",
        "rule": "Select exactly Mobile official catalog119 whole-turn 弓骑, source snapshot2026-10-15, with complete 解烦. Preserve BWIKI phase-duration variant as materially different; do not blend it or call selected catalog rules current-client certified.",
        "basis": "Parent instruction2026-10-15 22:50UTC plus raw official119. This is an explicit source-version choice, not silent reconciliation.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N10",
        "title": "Gongqi payment and true range",
        "rule": "Once per actual own playphase, discard exactly one own H/E card; no J/pile. Commit quota before callbacks, run actual loss and equipment-leave effects, then if actor remains active grant infinite ATTACK RANGE through current real turn end. An equipment-type cost from hand or equipment enables optional discard of one OTHER actor H/E. Hidden hand selection is blind; public equipment selectable. No extra Slash uses, no damage or additional targets, no immunity bypass, no global card-distance=1 shortcut. The resolved range effect lasts through extra play/end-phase queries and survives skill loss until true turn-end, but final death clears its active range.",
        "basis": "Official full text. H/E ownership and true range use existing shared material/range conventions; matching2016OL explicitly discusses payment of equipped cards and dismantlingH/E. Nested timing and effect persistence are host policy.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N11",
        "title": "Jiefan cost and eligibility",
        "rule": "Own actual playphase, unused lifetime limited marker. Choose any one living actor, including self. Commit marker and snapshot all living actors whose current attack range contains chosen actor, excluding chosen actor itself under host self-not-in-attack-range convention. Include韩当 if selecting another actor and his range contains them, including active弓骑 infinity. Evaluate effective range after costs already completed, with distance and equipment modifiers; never use teams as range.",
        "basis": "Official 解烦 plus matching2016OL confirms selftarget and 弓骑 helps chosen teammate. Self-exclusion and exact snapshot time are explicit host shared-range conventions.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N12",
        "title": "Jiefan sequential resolution",
        "rule": "Resolve frozen eligible actors in current action order starting with current turn owner. Each still-living eligible actor chooses discard exactly one own hand/equipped WEAPON, or make chosen actor draw1. No weapon means draw branch, never free refusal; do not discard armor/mount/J/pile. Each actual discard and draw finishes its normal callbacks before next participant. Discarding a weapon may change later range but does not alter frozen participant membership. Skip a participant if final-dead before its decision; stop if chosen actor final-dead. A committed effect can finish after skill-owner death while chosen actor lives; honor host final-effect/match-end boundary. Preserve participant cursor and receipts through save/import.",
        "basis": "Official says each actor chooses; no globaldrawN substitute. WeaponH/E and frozen-order/death/resume behavior are explicitly host contracts, not certified Mobile exotic timing.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N13",
        "title": "Limited-state and lifecycle",
        "rule": "解烦 once per game for skill owner, not once per phase/turn. Mark before any nested discard/draw. Persist spent marker through loss/reacquisition/save/import; copied full male packet receives its own marker, except sameactor prior spend remains spent. No界reset or olddyingSlash-toPeach branch.",
        "basis": "Selected official complete base identity inventory contains no reset; lifetime ownership and copied-state handling are shared N3/N4 host policies.",
        "status": "explicit_host_compatibility_requirement"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-next/liao-hua.svg",
    "skill_callback_modules": {
      "sgs.dangxian": "sgs-next-liaohua-skills.js",
      "sgs.fuli": "sgs-next-liaohua-skills.js"
    },
    "gender_official_field_verified": false,
    "metadata_provenance": {
      "source_id": "bwiki-liaohua",
      "revision_id": 35602,
      "revision_timestamp_utc": "2026-01-05T08:03:14Z",
      "raw_sha256": "03e41e654c00192a90140e65f0052f7ced29881c094251ae5988813e108a61f0",
      "evidence_kind": "community_same_product_base_metadata_or_skill",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "gender_provenance": {
      "source_id": "bwiki-liaohua",
      "revision_id": 35602,
      "revision_timestamp_utc": "2026-01-05T08:03:14Z",
      "raw_sha256": "03e41e654c00192a90140e65f0052f7ced29881c094251ae5988813e108a61f0",
      "evidence_kind": "community_same_product_base_metadata_or_skill",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-liaohua"
      ],
      "revision_id": 35602,
      "revision_timestamp_utc": "2026-01-05T08:03:14Z",
      "raw_sha256": "03e41e654c00192a90140e65f0052f7ced29881c094251ae5988813e108a61f0",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "N0",
      "display_note": "最大体力与性别来自同产品社区经典资料，数字与勾玉图标交叉核验；官网未提供数值HP字段。独立初始体力未知，满体力开局为N0宿主约定。"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-liaohua",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-115.html",
        "raw_path": "evidence/mobile-liaohua.html",
        "sha256": "1d62202ee15bf65a2947d1b329a3af613b1ccf696bddcd7f04cabff7eabbda7d",
        "current_client_verified": false
      },
      {
        "id": "bwiki-liaohua",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E5%BB%96%E5%8C%96",
        "raw_path": "evidence/bwiki-liaohua.html",
        "sha256": "03e41e654c00192a90140e65f0052f7ced29881c094251ae5988813e108a61f0",
        "current_client_verified": false
      },
      {
        "id": "bwiki-dangxian",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E5%BD%93%E5%85%88",
        "raw_path": "evidence/bwiki-dangxian.html",
        "sha256": "a2bfc498ab176f1cfe546270bcb1b9edc5ea2543aa4cde3d1bea18102128ad54",
        "current_client_verified": false
      },
      {
        "id": "bwiki-fuli",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E4%BC%8F%E6%9E%A5",
        "raw_path": "evidence/bwiki-fuli.html",
        "sha256": "cb2c3bbac2accc020fe475b4e8746b8226e0c917dd4feaa952b9bda9dbdc474b",
        "current_client_verified": false
      }
    ],
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.liao-hua",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "廖化",
      "faction": "蜀",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "N0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "当先",
        "伏枥"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "当先",
          "伏枥"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.dangxian",
            "name": "当先",
            "type": "locked_phase_insertion",
            "timing": "actual owner turn start before preparation",
            "quota": "one inserted play phase per actual turn start",
            "cost": "none",
            "targets": "owner",
            "effects": [
              "Execute a real additional play phase, then resume preparation/judgment/draw/normal play.",
              "No draw or extra whole turn. No inherent additional Slash uses inside one phase.",
              "No discard-pile Slash acquisition or HP payment."
            ],
            "official_rule_text": "锁定技，回合开始时，你执行一个额外的出牌阶段。",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-liaohua",
              "bwiki-liaohua",
              "bwiki-dangxian"
            ],
            "policy_refs": [
              "N0",
              "N1"
            ]
          },
          {
            "id": "sgs.fuli",
            "name": "伏枥",
            "type": "optional_limited_dying_recovery_and_flip",
            "timing": "owner is still dying, at actual owner response opportunities before final death",
            "quota": "once per game for this skill owner",
            "cost": "spend limited marker; no physical card",
            "targets": "owner",
            "effects": [
              "Recover current HP to X (subject to maxHP); X is distinct factions among living actors.",
              "Then turn general card over; not always set face-down.",
              "No draw, cleanup, unchain, lost-HP prevention or post-death revival."
            ],
            "official_rule_text": "限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-liaohua",
              "bwiki-liaohua",
              "bwiki-fuli"
            ],
            "policy_refs": [
              "N0",
              "N2",
              "N3",
              "N4"
            ]
          }
        ]
      },
      "signature_sha256": "65ee9c5393bd9bbc501dc859e6afb10bc2c1a579f3cccd5ef72746e23e3ff1c2",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 94,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "14f03a7432c62c09e8d2d1ba9b6175da974bf04a",
      "comparison_basis": "actual uncommitted V27 working tree snapshot, not commit alone",
      "comparison_scope": "Actual V27 94 selectable templates plus 7 SGS source aliases; not the entire source catalogs.",
      "same_name_collisions": []
    },
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
        "handling": "N0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "cross-game ordering",
        "handling": "N1–N7 explicitly disclosed host policies; current mobile client not tested"
      }
    ],
    "source_evidence_note": "官网完整身份技能面板均已读，包括隐藏技能；同产品经典社区提供数值HP、勾玉数量、性别、势力与页面修订。来源证据不是当前移动客户端验证，初始满体力是N0宿主政策。",
    "adaptation_notes": "N0–N7、N9–N13明确初始体力、真实额外出牌阶段、全场势力投影、限定濒死、赠牌、死亡、整回合攻击范围与逐人解烦流程。非三国杀来源角色统一江湖势力为本作政策，不按君臣民或队伍计数；当前客户端及完整身份模式未核验。"
  },
  {
    "id": "sgs.adapted.base.hero.bu-lian-shi",
    "source_name": "步练师",
    "suggested_display_name": "步练师",
    "max_hp": 3,
    "gender": "female",
    "source_faction": "吴",
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "N0 host full-HP initialization",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "source_refs": [
      "mobile-bulianshi",
      "bwiki-bulianshi",
      "mobile-skill-adjustment-2015"
    ],
    "intrinsic_skill_inventory": [
      "安恤",
      "追忆"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "complete_selected_core_inventory_with_explicit_host_boundaries",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.anxu",
        "name": "安恤",
        "type": "optional_play_phase_control_support",
        "timing": "owner actual play phase",
        "quota": "once per actual play phase",
        "cost": "no owner card or HP cost",
        "targets": "exactly two OTHER living actors with differing hand counts",
        "effects": [
          "Higher hand-count actor gives one chosen hand card to lower hand-count actor.",
          "After transfer, if actual hand counts equal, owner draws1 OR recovers1.",
          "No suit condition or compulsory reveal; giver owns card choice."
        ],
        "official_rule_text": "出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-bulianshi",
          "bwiki-bulianshi",
          "bwiki-anxu",
          "mobile-skill-adjustment-2015"
        ],
        "policy_refs": [
          "N0",
          "N5"
        ]
      },
      {
        "id": "sgs.zhuiyi",
        "name": "追忆",
        "type": "optional_final_death_support",
        "timing": "owner final death, not merely entering dying",
        "quota": "once per real death event",
        "cost": "none",
        "targets": "one OTHER living actor excluding actual killer",
        "effects": [
          "Chosen recipient draws3, then recovers1; fullHP still gets draw3.",
          "Dead owner remains dead and gains nothing.",
          "HP-loss-causing actor is not a damage killer merely because source was carried."
        ],
        "official_rule_text": "当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-bulianshi",
          "bwiki-bulianshi",
          "bwiki-zhuiyi"
        ],
        "policy_refs": [
          "N0",
          "N6",
          "N7"
        ]
      }
    ],
    "excluded_variants": [
      "Old base/OL安恤: lower actor obtains and reveals; non-spade reward; excluded.",
      "界安恤 equipment/extra reward or same-hand behavior; excluded."
    ],
    "skill_ids": [
      "sgs.anxu",
      "sgs.zhuiyi"
    ],
    "ui_requirements": [
      "Both actual intrinsic skills and exact selected variant visible.",
      "Source-backed ≠ current client certified.",
      "Stable phase/death/limited-state prompts and save/import receipts.",
      "Original-created portrait only; no official artwork imported.",
      "In1v1,安恤 unavailable because two OTHER actors do not exist; never simplify to buff.",
      "In1v2 allow either unequal other pair and show hand counts only. Donor chooses privately.",
      "追忆 offers legal living recipient even after owner death; actual killer visibly excluded."
    ],
    "name": "步练师",
    "display_name": "步练师",
    "skill_name": "安恤/追忆",
    "skill_desc": "安恤：出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力 追忆：当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。",
    "source_character_name": "步练师",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀步练师",
      "步练师·安恤/追忆",
      "bu-lian-shi"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-117.html",
      "https://wiki.biligame.com/msgs/%E6%AD%A5%E7%BB%83%E5%B8%88",
      "https://www.sanguosha.cn/pc/news-detail-98.html",
      "https://wiki.biligame.com/msgs/%E5%AE%89%E6%81%A4",
      "https://wiki.biligame.com/msgs/%E8%BF%BD%E5%BF%86"
    ],
    "source_records": [
      {
        "id": "mobile-bulianshi",
        "url": "https://www.sanguosha.cn/pc/hero-detail-117.html",
        "status": 200,
        "bytes": 22041,
        "sha256": "8c2b80a8a23846c8b039816269ee943146cf75829fdfe43665080a45af32723a",
        "accessed_at": "2026-10-15T22:37:39.443680+00:00",
        "raw_path": "evidence/mobile-bulianshi.html",
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
                  "name": "安恤",
                  "hidden": false,
                  "rule_text": "出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力",
                  "rule_sha256": "4ae4db64e844ba92de20393ec9dc776bbb11257c8b30c17961c71af5c68f43bd",
                  "html_line": 187
                },
                {
                  "name": "追忆",
                  "hidden": true,
                  "rule_text": "当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。",
                  "rule_sha256": "45ee3b3bf279c8f070e7718c52e665d2a888957d165cf1536edc4c1aa0bbdf8f",
                  "html_line": 188
                }
              ]
            }
          ],
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "Undated website catalog; not authenticated current-client rules or HP.",
          "Official HTML has no direct numeric max HP or explicit game-gender field."
        ]
      },
      {
        "id": "bwiki-bulianshi",
        "url": "https://wiki.biligame.com/msgs/%E6%AD%A5%E7%BB%83%E5%B8%88",
        "status": 200,
        "bytes": 89261,
        "sha256": "c2f8a77b2331b479f5e202564dc4fe178cee223d6f0410d27297e4a8f22a818b",
        "accessed_at": "2026-10-15T22:37:39.999301+00:00",
        "raw_path": "evidence/bwiki-bulianshi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 33728,
        "modified_at": "2025-10-21T02:47:54Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "female",
          "faction": "吴",
          "initial_hp_explicit": null,
          "hp_html_line": 632,
          "gender_html_line": 627,
          "faction_html_line": 628,
          "selected_section": "经典, current branch; historical block excluded"
        }
      },
      {
        "id": "mobile-skill-adjustment-2015",
        "url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "final_url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "status": 200,
        "bytes": 27188,
        "sha256": "cdf72dbb68a460995748ec57e97ddf95183cbb873e869738d4efb4b175caa21e",
        "accessed_at": "2026-10-15T22:38:54.063143+00:00",
        "raw_path": "evidence/mobile-skill-adjustment-2015.html",
        "current_client_verified": false,
        "publication_date": "2015-12-01 11:49:59",
        "tier": "official_same_product_dated_change_notice",
        "product": "三国杀移动版",
        "supports": [
          "Modern 安恤 donor chooses hand card; after transfer equality reward draw1 or heal1."
        ],
        "limitations": [
          "Other heroes in this notice not selected; does not supply 追忆 procedural FAQ."
        ]
      },
      {
        "id": "bwiki-anxu",
        "url": "https://wiki.biligame.com/msgs/%E5%AE%89%E6%81%A4",
        "status": 200,
        "bytes": 63076,
        "sha256": "78f93d73a8ae4f4ae8ddd9df765b6ee1bf24257bab94423376e8c3d17726eed2",
        "accessed_at": "2026-10-15T22:37:43.192981+00:00",
        "raw_path": "evidence/bwiki-anxu.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 7983,
        "modified_at": "2022-05-31T16:35:39Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ]
      },
      {
        "id": "bwiki-zhuiyi",
        "url": "https://wiki.biligame.com/msgs/%E8%BF%BD%E5%BF%86",
        "status": 200,
        "bytes": 62729,
        "sha256": "2c074413d050e0fe16fd5abc3b80278710ca27724842ff6f4a36fd1562ec5d6a",
        "accessed_at": "2026-10-15T22:37:43.126424+00:00",
        "raw_path": "evidence/bwiki-zhuiyi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "community_same_product_base_metadata_or_skill",
        "product": "三国杀移动版",
        "revision_id": 7986,
        "modified_at": "2022-05-31T16:37:29Z",
        "limitations": [
          "Same-product community evidence, not official client certification.",
          "Revision of enclosing article does not independently version transcluded skill rules."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.anxu",
        "name": "安恤",
        "type": "optional_play_phase_control_support",
        "timing": "owner actual play phase",
        "quota": "once per actual play phase",
        "cost": "no owner card or HP cost",
        "targets": "exactly two OTHER living actors with differing hand counts",
        "effects": [
          "Higher hand-count actor gives one chosen hand card to lower hand-count actor.",
          "After transfer, if actual hand counts equal, owner draws1 OR recovers1.",
          "No suit condition or compulsory reveal; giver owns card choice."
        ],
        "official_rule_text": "出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力",
        "official_panel_hidden": false,
        "source_refs": [
          "mobile-bulianshi",
          "bwiki-bulianshi",
          "bwiki-anxu",
          "mobile-skill-adjustment-2015"
        ],
        "policy_refs": [
          "N0",
          "N5"
        ]
      },
      {
        "id": "sgs.zhuiyi",
        "name": "追忆",
        "type": "optional_final_death_support",
        "timing": "owner final death, not merely entering dying",
        "quota": "once per real death event",
        "cost": "none",
        "targets": "one OTHER living actor excluding actual killer",
        "effects": [
          "Chosen recipient draws3, then recovers1; fullHP still gets draw3.",
          "Dead owner remains dead and gains nothing.",
          "HP-loss-causing actor is not a damage killer merely because source was carried."
        ],
        "official_rule_text": "当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。",
        "official_panel_hidden": true,
        "source_refs": [
          "mobile-bulianshi",
          "bwiki-bulianshi",
          "bwiki-zhuiyi"
        ],
        "policy_refs": [
          "N0",
          "N6",
          "N7"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.anxu",
      "sgs.zhuiyi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.anxu",
      "sgs.zhuiyi"
    ],
    "complete_skill_names": [
      "安恤",
      "追忆"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "aggregate-and-independent-validation-passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "N0",
        "title": "Scope and HP",
        "rule": "Base Mobile identity website snapshots only. Initial HP direct source=null; ordinary full-max-HP initialization is host policy. No native identity win/reward/lord system certification. Every supplied inherent skill is mandatory for the complete package.",
        "basis": "Official raw complete tabs plus BWIKI explicit classic HP/gender; user product scope frozen2026-10-15.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N1",
        "title": "Full phase execution",
        "rule": "当先 creates one actual owner PLAY phase inside current actual turn before preparation and judgment. Run proper play entry/action/end and phase-local quotas. Do not start a new turn, draw, judgment, discard or end phase. Keep turn-long buffs, use history, per-turn Wine and per-turn skill quotas intact. Never approximate by +1 Slash use. Face-down scheduled-turn skip happens before actual turn-start and produces no 当先. If owner dies, stop remaining phases.",
        "basis": "Official 当先; matching OL2016 before-judgment and per-phase Slash/per-turn Wine examples. Exact modern Mobile exotic phase-before/after trigger ordering unverified; this host provides explicit scheduler semantics.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N2",
        "title": "Distinct faction resolver",
        "rule": "Use actual current effective source form after 易装. Native SGS source context (including one merged SGS source alias) determines 魏/蜀/吴/群 etc; an actor with no SGS source faction is assigned one neutral 江湖 compatibility group. Never use human/AI sides or YXS君/臣/民 identity classes. Count each living actor once, distinct faction labels once; include dying-not-dead owner, exclude final dead. Do not count aliases as extra actors. Preserve immutable original/source provenance and expose count plus per-actor basis in 伏枥 UI.",
        "basis": "Explicit parent/root host decision relayed2026-10-15 22:40UTC; not a source-game rule and not native-mode certification. Source core remains X=全场势力数.",
        "status": "parent_confirmed_host_policy_not_yet_implemented"
      },
      {
        "id": "N3",
        "title": "Fuli resolution",
        "rule": "Optional unused 限定技 only while owner HP<=0 and not final-dead, at dying response. Commit lifetime-used marker before callbacks, snapshot current distinct living faction count X, recover toward min(X,currentMaxHP), then actually toggle general orientation. Recovery is recovery, not set-positive resurrection or damage prevention. No hand reset, draw, unchain or discard. The flip occurs even when X is small; existing face-down toggles face-up. Never reset the spent marker on phase/turn/save reload or skill reacquisition for that same owner lifetime.",
        "basis": "Official Mobile full hidden 伏枥 plus same-product skill page. Exact nested response priority, marker retention on cross-game copy/reacquisition, reduced-maxHP clamping are explicit host compatibility rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N4",
        "title": "Dying priority and recovery receipt",
        "rule": "伏枥 is available while owner remains dying, through a real owner dying-response choice alongside legal self rescue. An optional early owner offer may exist, but declining it cannot remove the unused skill from later owner response opportunities during the same still-open dying episode. Use receipts for each committed activation, not a permanent decline-as-spent flag. Once HP>0 or final-dead, no offer. Commit limited marker before recovery; skill removal disables it. A copy creates the receiving actor own unused marker unless that actor already spent this same skill. Exact cross-game response ordering is disclosed host policy.",
        "basis": "Official wording is 处于濒死, distinct from 进入濒死; optional choice must remain meaningful. Foreign skill priority and copy/marker behavior are explicit host requirements, not Mobile client certification.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N5",
        "title": "Anxu transaction",
        "rule": "Once per actual owner play phase, select two distinct other living actors with unequal HAND counts. Snapshot higher/lower roles at commitment, mark quota, then higher actor MUST choose one actual hand card to GIVE lower actor. Not owner-choice or random theft; no equipment, judgment or personal pile. Complete normal loss/gain events, then compare actual resulting hand counts. If equal and owner remains active, owner chooses draw1 or recover1 (only draw if full). No suit test, no mandatory reveal, no gain of the transferred card by owner. No distance/team/sex gate.",
        "basis": "Official2015-12-01 change and catalog. Receipt/revalidation, nested gain-loss ordering and stop on new death are disclosed host rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N6",
        "title": "Zhuiyi death action",
        "rule": "After unsuccessful rescue reaches committed final death, use pre-death effective-skill snapshot to offer 追忆 once per death receipt. Dead owner may choose one OTHER living actor except actual killer. Draw3 first then recover1 capped by recipient current maximum, with real draw/recovery callbacks. Full-HP recipient remains legal for draw3. No source/owner revival or transfer of dead hand. Final death caused solely by HP loss has no damage killer; the actor that caused HP loss is not automatically excluded. Source-less death excludes nobody except the dead owner.",
        "basis": "Official hidden 追忆 and exact same-product skill text. Kill attribution for HP loss follows host damage-vs-loss semantics; modern Mobile nested death ordering not client verified.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N7",
        "title": "Death lifecycle and finish boundary",
        "rule": "Record immutable death context (kind, damage-source/killer, source-skill, pre-death effective skill IDs, death ID) before asynchronous cleanup. Retain 追忆 ability long enough to execute even though owner.dead is true; do not reopen rescue. Shared host order: death receipt→intrinsic death effects→physical zone cleanup→match-end evaluation. A recipient that becomes final-dead during draw cannot recover. Respect prior skill loss, stale choices, cancellation, and one receipt across save/import/replay.",
        "basis": "Cross-game host ordering proposal, not a claim about Mobile native victory/reward order. Existing before_death_commit hook actually occurs after dead=true and is candidate integration point.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N9",
        "title": "Pinned catalog version",
        "rule": "Select exactly Mobile official catalog119 whole-turn 弓骑, source snapshot2026-10-15, with complete 解烦. Preserve BWIKI phase-duration variant as materially different; do not blend it or call selected catalog rules current-client certified.",
        "basis": "Parent instruction2026-10-15 22:50UTC plus raw official119. This is an explicit source-version choice, not silent reconciliation.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N10",
        "title": "Gongqi payment and true range",
        "rule": "Once per actual own playphase, discard exactly one own H/E card; no J/pile. Commit quota before callbacks, run actual loss and equipment-leave effects, then if actor remains active grant infinite ATTACK RANGE through current real turn end. An equipment-type cost from hand or equipment enables optional discard of one OTHER actor H/E. Hidden hand selection is blind; public equipment selectable. No extra Slash uses, no damage or additional targets, no immunity bypass, no global card-distance=1 shortcut. The resolved range effect lasts through extra play/end-phase queries and survives skill loss until true turn-end, but final death clears its active range.",
        "basis": "Official full text. H/E ownership and true range use existing shared material/range conventions; matching2016OL explicitly discusses payment of equipped cards and dismantlingH/E. Nested timing and effect persistence are host policy.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N11",
        "title": "Jiefan cost and eligibility",
        "rule": "Own actual playphase, unused lifetime limited marker. Choose any one living actor, including self. Commit marker and snapshot all living actors whose current attack range contains chosen actor, excluding chosen actor itself under host self-not-in-attack-range convention. Include韩当 if selecting another actor and his range contains them, including active弓骑 infinity. Evaluate effective range after costs already completed, with distance and equipment modifiers; never use teams as range.",
        "basis": "Official 解烦 plus matching2016OL confirms selftarget and 弓骑 helps chosen teammate. Self-exclusion and exact snapshot time are explicit host shared-range conventions.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N12",
        "title": "Jiefan sequential resolution",
        "rule": "Resolve frozen eligible actors in current action order starting with current turn owner. Each still-living eligible actor chooses discard exactly one own hand/equipped WEAPON, or make chosen actor draw1. No weapon means draw branch, never free refusal; do not discard armor/mount/J/pile. Each actual discard and draw finishes its normal callbacks before next participant. Discarding a weapon may change later range but does not alter frozen participant membership. Skip a participant if final-dead before its decision; stop if chosen actor final-dead. A committed effect can finish after skill-owner death while chosen actor lives; honor host final-effect/match-end boundary. Preserve participant cursor and receipts through save/import.",
        "basis": "Official says each actor chooses; no globaldrawN substitute. WeaponH/E and frozen-order/death/resume behavior are explicitly host contracts, not certified Mobile exotic timing.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N13",
        "title": "Limited-state and lifecycle",
        "rule": "解烦 once per game for skill owner, not once per phase/turn. Mark before any nested discard/draw. Persist spent marker through loss/reacquisition/save/import; copied full male packet receives its own marker, except sameactor prior spend remains spent. No界reset or olddyingSlash-toPeach branch.",
        "basis": "Selected official complete base identity inventory contains no reset; lifetime ownership and copied-state handling are shared N3/N4 host policies.",
        "status": "explicit_host_compatibility_requirement"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-next/bu-lian-shi.svg",
    "skill_callback_modules": {
      "sgs.anxu": "sgs-next-bulianshi-skills.js",
      "sgs.zhuiyi": "sgs-next-bulianshi-skills.js"
    },
    "gender_official_field_verified": false,
    "metadata_provenance": {
      "source_id": "bwiki-bulianshi",
      "revision_id": 33728,
      "revision_timestamp_utc": "2025-10-21T02:47:54Z",
      "raw_sha256": "c2f8a77b2331b479f5e202564dc4fe178cee223d6f0410d27297e4a8f22a818b",
      "evidence_kind": "community_same_product_base_metadata_or_skill",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "gender_provenance": {
      "source_id": "bwiki-bulianshi",
      "revision_id": 33728,
      "revision_timestamp_utc": "2025-10-21T02:47:54Z",
      "raw_sha256": "c2f8a77b2331b479f5e202564dc4fe178cee223d6f0410d27297e4a8f22a818b",
      "evidence_kind": "community_same_product_base_metadata_or_skill",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-bulianshi"
      ],
      "revision_id": 33728,
      "revision_timestamp_utc": "2025-10-21T02:47:54Z",
      "raw_sha256": "c2f8a77b2331b479f5e202564dc4fe178cee223d6f0410d27297e4a8f22a818b",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "N0",
      "display_note": "最大体力与性别来自同产品社区经典资料，数字与勾玉图标交叉核验；官网未提供数值HP字段。独立初始体力未知，满体力开局为N0宿主约定。"
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-bulianshi",
        "tier": "official_same_product_base_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-117.html",
        "raw_path": "evidence/mobile-bulianshi.html",
        "sha256": "8c2b80a8a23846c8b039816269ee943146cf75829fdfe43665080a45af32723a",
        "current_client_verified": false
      },
      {
        "id": "bwiki-bulianshi",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E6%AD%A5%E7%BB%83%E5%B8%88",
        "raw_path": "evidence/bwiki-bulianshi.html",
        "sha256": "c2f8a77b2331b479f5e202564dc4fe178cee223d6f0410d27297e4a8f22a818b",
        "current_client_verified": false
      },
      {
        "id": "mobile-skill-adjustment-2015",
        "tier": "official_same_product_dated_change_notice",
        "url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "raw_path": "evidence/mobile-skill-adjustment-2015.html",
        "sha256": "cdf72dbb68a460995748ec57e97ddf95183cbb873e869738d4efb4b175caa21e",
        "current_client_verified": false
      },
      {
        "id": "bwiki-anxu",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E5%AE%89%E6%81%A4",
        "raw_path": "evidence/bwiki-anxu.html",
        "sha256": "78f93d73a8ae4f4ae8ddd9df765b6ee1bf24257bab94423376e8c3d17726eed2",
        "current_client_verified": false
      },
      {
        "id": "bwiki-zhuiyi",
        "tier": "community_same_product_base_metadata_or_skill",
        "url": "https://wiki.biligame.com/msgs/%E8%BF%BD%E5%BF%86",
        "raw_path": "evidence/bwiki-zhuiyi.html",
        "sha256": "2c074413d050e0fe16fd5abc3b80278710ca27724842ff6f4a36fd1562ec5d6a",
        "current_client_verified": false
      }
    ],
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.bu-lian-shi",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-base-identity-catalog-2026-10-15",
      "source_character_name": "步练师",
      "faction": "吴",
      "gender": "female",
      "max_hp": 3,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "N0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "安恤",
        "追忆"
      ],
      "complete_signature": {
        "max_hp": 3,
        "intrinsic_skill_inventory": [
          "安恤",
          "追忆"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.anxu",
            "name": "安恤",
            "type": "optional_play_phase_control_support",
            "timing": "owner actual play phase",
            "quota": "once per actual play phase",
            "cost": "no owner card or HP cost",
            "targets": "exactly two OTHER living actors with differing hand counts",
            "effects": [
              "Higher hand-count actor gives one chosen hand card to lower hand-count actor.",
              "After transfer, if actual hand counts equal, owner draws1 OR recovers1.",
              "No suit condition or compulsory reveal; giver owns card choice."
            ],
            "official_rule_text": "出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力",
            "official_panel_hidden": false,
            "source_refs": [
              "mobile-bulianshi",
              "bwiki-bulianshi",
              "bwiki-anxu",
              "mobile-skill-adjustment-2015"
            ],
            "policy_refs": [
              "N0",
              "N5"
            ]
          },
          {
            "id": "sgs.zhuiyi",
            "name": "追忆",
            "type": "optional_final_death_support",
            "timing": "owner final death, not merely entering dying",
            "quota": "once per real death event",
            "cost": "none",
            "targets": "one OTHER living actor excluding actual killer",
            "effects": [
              "Chosen recipient draws3, then recovers1; fullHP still gets draw3.",
              "Dead owner remains dead and gains nothing.",
              "HP-loss-causing actor is not a damage killer merely because source was carried."
            ],
            "official_rule_text": "当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。",
            "official_panel_hidden": true,
            "source_refs": [
              "mobile-bulianshi",
              "bwiki-bulianshi",
              "bwiki-zhuiyi"
            ],
            "policy_refs": [
              "N0",
              "N6",
              "N7"
            ]
          }
        ]
      },
      "signature_sha256": "631f82e55af98a95470e528a40d0ebd79f9b529c3c0ad50672675b2844bfaf34",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 94,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "14f03a7432c62c09e8d2d1ba9b6175da974bf04a",
      "comparison_basis": "actual uncommitted V27 working tree snapshot, not commit alone",
      "comparison_scope": "Actual V27 94 selectable templates plus 7 SGS source aliases; not the entire source catalogs.",
      "same_name_collisions": []
    },
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
        "handling": "N0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "cross-game ordering",
        "handling": "N1–N7 explicitly disclosed host policies; current mobile client not tested"
      }
    ],
    "source_evidence_note": "官网完整身份技能面板均已读，包括隐藏技能；同产品经典社区提供数值HP、勾玉数量、性别、势力与页面修订。来源证据不是当前移动客户端验证，初始满体力是N0宿主政策。",
    "adaptation_notes": "N0–N7、N9–N13明确初始体力、真实额外出牌阶段、全场势力投影、限定濒死、赠牌、死亡、整回合攻击范围与逐人解烦流程。非三国杀来源角色统一江湖势力为本作政策，不按君臣民或队伍计数；当前客户端及完整身份模式未核验。"
  },
  {
    "id": "sgs.adapted.base.hero.han-dang",
    "source_name": "韩当",
    "suggested_display_name": "韩当",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "吴",
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "N0 host full-HP initialization",
    "product": "三国杀移动版",
    "variant": "mobile-official-catalog-119-turn-duration-snapshot-2026-10-15",
    "source_refs": [
      "official-handang",
      "bwiki-handang",
      "official-ol-handang-guide-2016"
    ],
    "intrinsic_skill_inventory": [
      "弓骑",
      "解烦"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "readiness": "complete_selected_core_inventory_with_explicit_host_boundaries",
    "implementation_status": "tested",
    "skills": [
      {
        "id": "sgs.gongqi",
        "name": "弓骑",
        "official_rule_text": "出牌阶段限一次，你可以弃置一张牌，然后你本回合的的攻击范围无限。若你以此法弃置的牌为装备牌，你可以弃置一名其他角色的一张牌。",
        "official_panel_hidden": false,
        "quota": "once per actual playphase",
        "cost": "discard exactly1ownH/E",
        "timing": "own actual playphase",
        "targets": "optional otherH/E discard afterequipmentcost",
        "effects": [
          "True attackrange unlimited through current actualturnend.",
          "Equipmentcost may additionally discard1otherH/E; noSlashquota or damagebonus."
        ],
        "source_refs": [
          "official-handang",
          "bwiki-gongqi-handang",
          "official-ol-handang-guide-2016"
        ],
        "policy_refs": [
          "N0",
          "N9",
          "N10"
        ]
      },
      {
        "id": "sgs.jiefan",
        "name": "解烦",
        "official_rule_text": "限定技，出牌阶段，你可以选择一名角色，然后令攻击范围内含有该角色的所有角色各选择一项：1.弃置一张武器牌；2.令其摸一张牌。",
        "official_panel_hidden": true,
        "quota": "once per game while own playphase",
        "cost": "spend limited marker; eligible actors then each discardweaponH/E OR granttargetdraw1",
        "timing": "own actual playphase",
        "targets": "choose1livingactor including self; snapshot all OTHER actors whose attackrangecontainschosen",
        "effects": [
          "Each eligibleactor sequentially discards1ownweaponH/E or chosentargetdraws1.",
          "No reset; not a dying rescue skill."
        ],
        "source_refs": [
          "official-handang",
          "bwiki-jiefan-handang",
          "official-ol-handang-guide-2016"
        ],
        "policy_refs": [
          "N0",
          "N9",
          "N11",
          "N12",
          "N13"
        ]
      }
    ],
    "ui_requirements": [
      "Show exact catalog whole-turn variant; do not label phase-duration BWIKI text as same version.",
      "Show finite used/unused limited marker and sequential recipient choices, hiding opponents hand identities.",
      "True infinite attack range visible separately from target distance and Slash quota.",
      "Original-created portrait only; no downloaded official art."
    ],
    "excluded_variants": [
      "Modern BWIKI base/classic phase-duration弓骑 kept separately.",
      "界/谋 same-suit additionalSlash or mounts/limited-reset excluded.",
      "Old2012 dyingSlash-toPeach解烦 excluded."
    ],
    "skill_ids": [
      "sgs.gongqi",
      "sgs.jiefan"
    ],
    "name": "韩当",
    "display_name": "韩当",
    "skill_name": "弓骑/解烦",
    "skill_desc": "弓骑：出牌阶段限一次，你可以弃置一张牌，然后你本回合的的攻击范围无限。若你以此法弃置的牌为装备牌，你可以弃置一名其他角色的一张牌。 解烦：限定技，出牌阶段，你可以选择一名角色，然后令攻击范围内含有该角色的所有角色各选择一项：1.弃置一张武器牌；2.令其摸一张牌。",
    "source_character_name": "韩当",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-official-catalog-119-turn-duration-snapshot-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀韩当",
      "韩当·弓骑/解烦",
      "han-dang"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-119.html",
      "https://wiki.biligame.com/msgs/%E9%9F%A9%E5%BD%93",
      "https://www.sanguosha.com/news/20161110_8825_5718",
      "https://wiki.biligame.com/msgs/%E5%BC%93%E9%AA%91/%E9%9F%A9%E5%BD%93",
      "https://wiki.biligame.com/msgs/%E8%A7%A3%E7%83%A6/%E9%9F%A9%E5%BD%93"
    ],
    "source_records": [
      {
        "id": "official-handang",
        "url": "https://www.sanguosha.cn/pc/hero-detail-119.html",
        "accessed_at": "2026-10-15T22:37:49.277996+00:00",
        "status": 200,
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-119.html",
        "bytes": 21988,
        "sha256": "1130c20247a0e6e0dbebf67ef60f9a9ca998ce30531075533fe1fd69f164d3fa",
        "raw_path": "handang-chengpu/evidence/official-handang.html",
        "current_client_verified": false,
        "positive_evidence": true,
        "derived_text_path": "handang-chengpu/evidence/official-handang-extracted.txt",
        "tier": "official_same_product",
        "product": "三国杀移动版",
        "limitations": [
          "Undated hero catalog or historical design article; not live-client verification."
        ]
      },
      {
        "id": "bwiki-handang",
        "url": "https://wiki.biligame.com/msgs/%E9%9F%A9%E5%BD%93",
        "accessed_at": "2026-10-15T22:37:49.281433+00:00",
        "status": 200,
        "final_url": "https://wiki.biligame.com/msgs/%E9%9F%A9%E5%BD%93",
        "bytes": 85470,
        "sha256": "0147bedaa3949c2fce33250c665eb3cdfbea6c4d0062094802ca137bbf5f8075",
        "raw_path": "handang-chengpu/evidence/bwiki-handang.html",
        "current_client_verified": false,
        "positive_evidence": true,
        "derived_text_path": "handang-chengpu/evidence/bwiki-handang-extracted.txt",
        "tier": "community_same_product_classic_or_skill_page",
        "product": "三国杀移动版",
        "wgRevisionId": 37830,
        "wgCurRevisionId": 37830,
        "wgArticleId": 2708,
        "revision_modified_utc": "2026-03-29T09:24:22Z",
        "visible_infobox_update": "2023-01-26",
        "footer_revision_date": "此页面最后编辑于2026年3月29日 (星期日) 17:24。",
        "limitations": [
          "Community documentation, not a live-client observation.",
          "Article revision can include transcluded skills; separately captured skill subpages carry their own revisions."
        ]
      },
      {
        "id": "official-ol-handang-guide-2016",
        "url": "https://www.sanguosha.com/news/20161110_8825_5718",
        "accessed_at": "2026-10-15T22:39:02.154680+00:00",
        "status": 200,
        "final_url": "https://www.sanguosha.com/news/20161110_8825_5718",
        "bytes": 69876,
        "sha256": "3f9201a1a0003e72bceaba4e0e5d3dcecb417729bd508faf15c0072ac97f9906",
        "raw_path": "handang-chengpu/evidence/official-ol-handang-guide-2016.html",
        "current_client_verified": false,
        "positive_evidence": true,
        "derived_text_path": "handang-chengpu/evidence/official-ol-handang-guide-2016-extracted.txt",
        "tier": "official_other_product_historical_guide",
        "product": "三国杀OL",
        "limitations": [
          "Historical OL guide, not Mobile certification.",
          "Only matching-rule corroboration and conflict detection; do not import client behavior wholesale."
        ]
      },
      {
        "id": "bwiki-gongqi-handang",
        "url": "https://wiki.biligame.com/msgs/%E5%BC%93%E9%AA%91/%E9%9F%A9%E5%BD%93",
        "accessed_at": "2026-10-15T22:39:02.151793+00:00",
        "status": 200,
        "final_url": "https://wiki.biligame.com/msgs/%E5%BC%93%E9%AA%91/%E9%9F%A9%E5%BD%93",
        "bytes": 68962,
        "sha256": "31f9e23717cf61c8d9ec5ff8648ac8dffc5c049c243dc934bd72ea6e5b46f1a0",
        "raw_path": "handang-chengpu/evidence/bwiki-gongqi-handang.html",
        "current_client_verified": false,
        "positive_evidence": true,
        "derived_text_path": "handang-chengpu/evidence/bwiki-gongqi-handang-extracted.txt",
        "tier": "community_same_product_classic_or_skill_page",
        "product": "三国杀移动版",
        "wgRevisionId": 21287,
        "wgCurRevisionId": 21287,
        "wgArticleId": 2726,
        "revision_modified_utc": "2023-01-26T13:02:01Z",
        "visible_infobox_update": "2023-01-26",
        "footer_revision_date": "此页面最后编辑于2023年1月26日 (星期四) 21:02。",
        "limitations": [
          "Community documentation, not a live-client observation.",
          "Article revision can include transcluded skills; separately captured skill subpages carry their own revisions."
        ]
      },
      {
        "id": "bwiki-jiefan-handang",
        "url": "https://wiki.biligame.com/msgs/%E8%A7%A3%E7%83%A6/%E9%9F%A9%E5%BD%93",
        "accessed_at": "2026-10-15T22:39:02.152592+00:00",
        "status": 200,
        "final_url": "https://wiki.biligame.com/msgs/%E8%A7%A3%E7%83%A6/%E9%9F%A9%E5%BD%93",
        "bytes": 68972,
        "sha256": "6482d68e143296a1b71b231103487b06b6f3ca8bf66ecf86150471f414e0ddee",
        "raw_path": "handang-chengpu/evidence/bwiki-jiefan-handang.html",
        "current_client_verified": false,
        "positive_evidence": true,
        "derived_text_path": "handang-chengpu/evidence/bwiki-jiefan-handang-extracted.txt",
        "tier": "community_same_product_classic_or_skill_page",
        "product": "三国杀移动版",
        "wgRevisionId": 21288,
        "wgCurRevisionId": 21288,
        "wgArticleId": 2727,
        "revision_modified_utc": "2023-01-26T13:02:30Z",
        "visible_infobox_update": "2023-01-26",
        "footer_revision_date": "此页面最后编辑于2023年1月26日 (星期四) 21:02。",
        "limitations": [
          "Community documentation, not a live-client observation.",
          "Article revision can include transcluded skills; separately captured skill subpages carry their own revisions."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.gongqi",
        "name": "弓骑",
        "official_rule_text": "出牌阶段限一次，你可以弃置一张牌，然后你本回合的的攻击范围无限。若你以此法弃置的牌为装备牌，你可以弃置一名其他角色的一张牌。",
        "official_panel_hidden": false,
        "quota": "once per actual playphase",
        "cost": "discard exactly1ownH/E",
        "timing": "own actual playphase",
        "targets": "optional otherH/E discard afterequipmentcost",
        "effects": [
          "True attackrange unlimited through current actualturnend.",
          "Equipmentcost may additionally discard1otherH/E; noSlashquota or damagebonus."
        ],
        "source_refs": [
          "official-handang",
          "bwiki-gongqi-handang",
          "official-ol-handang-guide-2016"
        ],
        "policy_refs": [
          "N0",
          "N9",
          "N10"
        ]
      },
      {
        "id": "sgs.jiefan",
        "name": "解烦",
        "official_rule_text": "限定技，出牌阶段，你可以选择一名角色，然后令攻击范围内含有该角色的所有角色各选择一项：1.弃置一张武器牌；2.令其摸一张牌。",
        "official_panel_hidden": true,
        "quota": "once per game while own playphase",
        "cost": "spend limited marker; eligible actors then each discardweaponH/E OR granttargetdraw1",
        "timing": "own actual playphase",
        "targets": "choose1livingactor including self; snapshot all OTHER actors whose attackrangecontainschosen",
        "effects": [
          "Each eligibleactor sequentially discards1ownweaponH/E or chosentargetdraws1.",
          "No reset; not a dying rescue skill."
        ],
        "source_refs": [
          "official-handang",
          "bwiki-jiefan-handang",
          "official-ol-handang-guide-2016"
        ],
        "policy_refs": [
          "N0",
          "N9",
          "N11",
          "N12",
          "N13"
        ]
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.gongqi",
      "sgs.jiefan"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.gongqi",
      "sgs.jiefan"
    ],
    "complete_skill_names": [
      "弓骑",
      "解烦"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "aggregate-and-independent-validation-passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "N0",
        "title": "Scope and HP",
        "rule": "Base Mobile identity website snapshots only. Initial HP direct source=null; ordinary full-max-HP initialization is host policy. No native identity win/reward/lord system certification. Every supplied inherent skill is mandatory for the complete package.",
        "basis": "Official raw complete tabs plus BWIKI explicit classic HP/gender; user product scope frozen2026-10-15.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N1",
        "title": "Full phase execution",
        "rule": "当先 creates one actual owner PLAY phase inside current actual turn before preparation and judgment. Run proper play entry/action/end and phase-local quotas. Do not start a new turn, draw, judgment, discard or end phase. Keep turn-long buffs, use history, per-turn Wine and per-turn skill quotas intact. Never approximate by +1 Slash use. Face-down scheduled-turn skip happens before actual turn-start and produces no 当先. If owner dies, stop remaining phases.",
        "basis": "Official 当先; matching OL2016 before-judgment and per-phase Slash/per-turn Wine examples. Exact modern Mobile exotic phase-before/after trigger ordering unverified; this host provides explicit scheduler semantics.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N2",
        "title": "Distinct faction resolver",
        "rule": "Use actual current effective source form after 易装. Native SGS source context (including one merged SGS source alias) determines 魏/蜀/吴/群 etc; an actor with no SGS source faction is assigned one neutral 江湖 compatibility group. Never use human/AI sides or YXS君/臣/民 identity classes. Count each living actor once, distinct faction labels once; include dying-not-dead owner, exclude final dead. Do not count aliases as extra actors. Preserve immutable original/source provenance and expose count plus per-actor basis in 伏枥 UI.",
        "basis": "Explicit parent/root host decision relayed2026-10-15 22:40UTC; not a source-game rule and not native-mode certification. Source core remains X=全场势力数.",
        "status": "parent_confirmed_host_policy_not_yet_implemented"
      },
      {
        "id": "N3",
        "title": "Fuli resolution",
        "rule": "Optional unused 限定技 only while owner HP<=0 and not final-dead, at dying response. Commit lifetime-used marker before callbacks, snapshot current distinct living faction count X, recover toward min(X,currentMaxHP), then actually toggle general orientation. Recovery is recovery, not set-positive resurrection or damage prevention. No hand reset, draw, unchain or discard. The flip occurs even when X is small; existing face-down toggles face-up. Never reset the spent marker on phase/turn/save reload or skill reacquisition for that same owner lifetime.",
        "basis": "Official Mobile full hidden 伏枥 plus same-product skill page. Exact nested response priority, marker retention on cross-game copy/reacquisition, reduced-maxHP clamping are explicit host compatibility rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N4",
        "title": "Dying priority and recovery receipt",
        "rule": "伏枥 is available while owner remains dying, through a real owner dying-response choice alongside legal self rescue. An optional early owner offer may exist, but declining it cannot remove the unused skill from later owner response opportunities during the same still-open dying episode. Use receipts for each committed activation, not a permanent decline-as-spent flag. Once HP>0 or final-dead, no offer. Commit limited marker before recovery; skill removal disables it. A copy creates the receiving actor own unused marker unless that actor already spent this same skill. Exact cross-game response ordering is disclosed host policy.",
        "basis": "Official wording is 处于濒死, distinct from 进入濒死; optional choice must remain meaningful. Foreign skill priority and copy/marker behavior are explicit host requirements, not Mobile client certification.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N5",
        "title": "Anxu transaction",
        "rule": "Once per actual owner play phase, select two distinct other living actors with unequal HAND counts. Snapshot higher/lower roles at commitment, mark quota, then higher actor MUST choose one actual hand card to GIVE lower actor. Not owner-choice or random theft; no equipment, judgment or personal pile. Complete normal loss/gain events, then compare actual resulting hand counts. If equal and owner remains active, owner chooses draw1 or recover1 (only draw if full). No suit test, no mandatory reveal, no gain of the transferred card by owner. No distance/team/sex gate.",
        "basis": "Official2015-12-01 change and catalog. Receipt/revalidation, nested gain-loss ordering and stop on new death are disclosed host rules.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N6",
        "title": "Zhuiyi death action",
        "rule": "After unsuccessful rescue reaches committed final death, use pre-death effective-skill snapshot to offer 追忆 once per death receipt. Dead owner may choose one OTHER living actor except actual killer. Draw3 first then recover1 capped by recipient current maximum, with real draw/recovery callbacks. Full-HP recipient remains legal for draw3. No source/owner revival or transfer of dead hand. Final death caused solely by HP loss has no damage killer; the actor that caused HP loss is not automatically excluded. Source-less death excludes nobody except the dead owner.",
        "basis": "Official hidden 追忆 and exact same-product skill text. Kill attribution for HP loss follows host damage-vs-loss semantics; modern Mobile nested death ordering not client verified.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N7",
        "title": "Death lifecycle and finish boundary",
        "rule": "Record immutable death context (kind, damage-source/killer, source-skill, pre-death effective skill IDs, death ID) before asynchronous cleanup. Retain 追忆 ability long enough to execute even though owner.dead is true; do not reopen rescue. Shared host order: death receipt→intrinsic death effects→physical zone cleanup→match-end evaluation. A recipient that becomes final-dead during draw cannot recover. Respect prior skill loss, stale choices, cancellation, and one receipt across save/import/replay.",
        "basis": "Cross-game host ordering proposal, not a claim about Mobile native victory/reward order. Existing before_death_commit hook actually occurs after dead=true and is candidate integration point.",
        "status": "disclosed_host_compatibility_requirement"
      },
      {
        "id": "N9",
        "title": "Pinned catalog version",
        "rule": "Select exactly Mobile official catalog119 whole-turn 弓骑, source snapshot2026-10-15, with complete 解烦. Preserve BWIKI phase-duration variant as materially different; do not blend it or call selected catalog rules current-client certified.",
        "basis": "Parent instruction2026-10-15 22:50UTC plus raw official119. This is an explicit source-version choice, not silent reconciliation.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N10",
        "title": "Gongqi payment and true range",
        "rule": "Once per actual own playphase, discard exactly one own H/E card; no J/pile. Commit quota before callbacks, run actual loss and equipment-leave effects, then if actor remains active grant infinite ATTACK RANGE through current real turn end. An equipment-type cost from hand or equipment enables optional discard of one OTHER actor H/E. Hidden hand selection is blind; public equipment selectable. No extra Slash uses, no damage or additional targets, no immunity bypass, no global card-distance=1 shortcut. The resolved range effect lasts through extra play/end-phase queries and survives skill loss until true turn-end, but final death clears its active range.",
        "basis": "Official full text. H/E ownership and true range use existing shared material/range conventions; matching2016OL explicitly discusses payment of equipped cards and dismantlingH/E. Nested timing and effect persistence are host policy.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N11",
        "title": "Jiefan cost and eligibility",
        "rule": "Own actual playphase, unused lifetime limited marker. Choose any one living actor, including self. Commit marker and snapshot all living actors whose current attack range contains chosen actor, excluding chosen actor itself under host self-not-in-attack-range convention. Include韩当 if selecting another actor and his range contains them, including active弓骑 infinity. Evaluate effective range after costs already completed, with distance and equipment modifiers; never use teams as range.",
        "basis": "Official 解烦 plus matching2016OL confirms selftarget and 弓骑 helps chosen teammate. Self-exclusion and exact snapshot time are explicit host shared-range conventions.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N12",
        "title": "Jiefan sequential resolution",
        "rule": "Resolve frozen eligible actors in current action order starting with current turn owner. Each still-living eligible actor chooses discard exactly one own hand/equipped WEAPON, or make chosen actor draw1. No weapon means draw branch, never free refusal; do not discard armor/mount/J/pile. Each actual discard and draw finishes its normal callbacks before next participant. Discarding a weapon may change later range but does not alter frozen participant membership. Skip a participant if final-dead before its decision; stop if chosen actor final-dead. A committed effect can finish after skill-owner death while chosen actor lives; honor host final-effect/match-end boundary. Preserve participant cursor and receipts through save/import.",
        "basis": "Official says each actor chooses; no globaldrawN substitute. WeaponH/E and frozen-order/death/resume behavior are explicitly host contracts, not certified Mobile exotic timing.",
        "status": "explicit_host_compatibility_requirement"
      },
      {
        "id": "N13",
        "title": "Limited-state and lifecycle",
        "rule": "解烦 once per game for skill owner, not once per phase/turn. Mark before any nested discard/draw. Persist spent marker through loss/reacquisition/save/import; copied full male packet receives its own marker, except sameactor prior spend remains spent. No界reset or olddyingSlash-toPeach branch.",
        "basis": "Selected official complete base identity inventory contains no reset; lifetime ownership and copied-state handling are shared N3/N4 host policies.",
        "status": "explicit_host_compatibility_requirement"
      }
    ],
    "portrait_path": "./portraits-sgs-yijiang-next/han-dang.svg",
    "skill_callback_modules": {
      "sgs.gongqi": "sgs-next-handang-skills.js",
      "sgs.jiefan": "sgs-next-handang-skills.js"
    },
    "gender_official_field_verified": false,
    "metadata_provenance": {
      "source_id": "bwiki-handang",
      "revision_id": 37830,
      "revision_timestamp_utc": "2026-03-29T09:24:22Z",
      "raw_sha256": "0147bedaa3949c2fce33250c665eb3cdfbea6c4d0062094802ca137bbf5f8075",
      "evidence_kind": "community_same_product_classic_or_skill_page",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "gender_provenance": {
      "source_id": "bwiki-handang",
      "revision_id": 37830,
      "revision_timestamp_utc": "2026-03-29T09:24:22Z",
      "raw_sha256": "0147bedaa3949c2fce33250c665eb3cdfbea6c4d0062094802ca137bbf5f8075",
      "evidence_kind": "community_same_product_classic_or_skill_page",
      "max_hp": "classic numeric value and matching icon count",
      "gender": "explicit game gender",
      "faction": "official catalog and classic community metadata",
      "initial_hp": "no separate field found",
      "maxHP_official_mobile_field_verified": false,
      "current_client_verified": false,
      "initialHP_directly_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-handang"
      ],
      "revision_id": 37830,
      "revision_timestamp_utc": "2026-03-29T09:24:22Z",
      "raw_sha256": "0147bedaa3949c2fce33250c665eb3cdfbea6c4d0062094802ca137bbf5f8075",
      "current_mobile_client_verified": false,
      "starting_hp_direct_source_value": null,
      "starting_hp_host_policy": "N0",
      "display_note": "最大体力与性别来自同产品社区经典资料，数字与勾玉图标交叉核验；官网未提供数值HP字段。独立初始体力未知，满体力开局为N0宿主约定。"
    },
    "source_evidence_tiers": [
      {
        "id": "official-handang",
        "tier": "official_same_product",
        "url": "https://www.sanguosha.cn/pc/hero-detail-119.html",
        "raw_path": "handang-chengpu/evidence/official-handang.html",
        "sha256": "1130c20247a0e6e0dbebf67ef60f9a9ca998ce30531075533fe1fd69f164d3fa",
        "current_client_verified": false
      },
      {
        "id": "bwiki-handang",
        "tier": "community_same_product_classic_or_skill_page",
        "url": "https://wiki.biligame.com/msgs/%E9%9F%A9%E5%BD%93",
        "raw_path": "handang-chengpu/evidence/bwiki-handang.html",
        "sha256": "0147bedaa3949c2fce33250c665eb3cdfbea6c4d0062094802ca137bbf5f8075",
        "current_client_verified": false
      },
      {
        "id": "official-ol-handang-guide-2016",
        "tier": "official_other_product_historical_guide",
        "url": "https://www.sanguosha.com/news/20161110_8825_5718",
        "raw_path": "handang-chengpu/evidence/official-ol-handang-guide-2016.html",
        "sha256": "3f9201a1a0003e72bceaba4e0e5d3dcecb417729bd508faf15c0072ac97f9906",
        "current_client_verified": false
      },
      {
        "id": "bwiki-gongqi-handang",
        "tier": "community_same_product_classic_or_skill_page",
        "url": "https://wiki.biligame.com/msgs/%E5%BC%93%E9%AA%91/%E9%9F%A9%E5%BD%93",
        "raw_path": "handang-chengpu/evidence/bwiki-gongqi-handang.html",
        "sha256": "31f9e23717cf61c8d9ec5ff8648ac8dffc5c049c243dc934bd72ea6e5b46f1a0",
        "current_client_verified": false
      },
      {
        "id": "bwiki-jiefan-handang",
        "tier": "community_same_product_classic_or_skill_page",
        "url": "https://wiki.biligame.com/msgs/%E8%A7%A3%E7%83%A6/%E9%9F%A9%E5%BD%93",
        "raw_path": "handang-chengpu/evidence/bwiki-jiefan-handang.html",
        "sha256": "6482d68e143296a1b71b231103487b06b6f3ca8bf66ecf86150471f414e0ddee",
        "current_client_verified": false
      }
    ],
    "source_identity_context": {
      "source_id": "sgs.adapted.base.hero.han-dang",
      "source_game": "三国杀",
      "product": "三国杀移动版",
      "variant": "mobile-official-catalog-119-turn-duration-snapshot-2026-10-15",
      "source_character_name": "韩当",
      "faction": "吴",
      "gender": "male",
      "max_hp": 4,
      "initial_hp_direct_source_value": null,
      "initial_hp_host_policy": "N0",
      "personal_lord_skills": [],
      "identity_mode_complete": false
    },
    "source_equivalence": {
      "status": "retain_distinct_complete_packet",
      "full_packet": [
        "弓骑",
        "解烦"
      ],
      "complete_signature": {
        "max_hp": 4,
        "intrinsic_skill_inventory": [
          "弓骑",
          "解烦"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "skills": [
          {
            "id": "sgs.gongqi",
            "name": "弓骑",
            "official_rule_text": "出牌阶段限一次，你可以弃置一张牌，然后你本回合的的攻击范围无限。若你以此法弃置的牌为装备牌，你可以弃置一名其他角色的一张牌。",
            "official_panel_hidden": false,
            "quota": "once per actual playphase",
            "cost": "discard exactly1ownH/E",
            "timing": "own actual playphase",
            "targets": "optional otherH/E discard afterequipmentcost",
            "effects": [
              "True attackrange unlimited through current actualturnend.",
              "Equipmentcost may additionally discard1otherH/E; noSlashquota or damagebonus."
            ],
            "source_refs": [
              "official-handang",
              "bwiki-gongqi-handang",
              "official-ol-handang-guide-2016"
            ],
            "policy_refs": [
              "N0",
              "N9",
              "N10"
            ]
          },
          {
            "id": "sgs.jiefan",
            "name": "解烦",
            "official_rule_text": "限定技，出牌阶段，你可以选择一名角色，然后令攻击范围内含有该角色的所有角色各选择一项：1.弃置一张武器牌；2.令其摸一张牌。",
            "official_panel_hidden": true,
            "quota": "once per game while own playphase",
            "cost": "spend limited marker; eligible actors then each discardweaponH/E OR granttargetdraw1",
            "timing": "own actual playphase",
            "targets": "choose1livingactor including self; snapshot all OTHER actors whose attackrangecontainschosen",
            "effects": [
              "Each eligibleactor sequentially discards1ownweaponH/E or chosentargetdraws1.",
              "No reset; not a dying rescue skill."
            ],
            "source_refs": [
              "official-handang",
              "bwiki-jiefan-handang",
              "official-ol-handang-guide-2016"
            ],
            "policy_refs": [
              "N0",
              "N9",
              "N11",
              "N12",
              "N13"
            ]
          }
        ]
      },
      "signature_sha256": "9d39380e28a82173dc345f2d54a2efd6b1cfd8c5c406e58e6144050e1ccb5422",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 94,
      "source_alias_records_checked": 7,
      "comparison_base_commit": "14f03a7432c62c09e8d2d1ba9b6175da974bf04a",
      "comparison_basis": "actual uncommitted V27 working tree snapshot, not commit alone",
      "comparison_scope": "Actual V27 94 selectable templates plus 7 SGS source aliases; not the entire source catalogs.",
      "same_name_collisions": []
    },
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
        "handling": "N0 full-max-HP host initialization; direct source value is null"
      },
      {
        "field": "cross-game ordering",
        "handling": "N1–N7 explicitly disclosed host policies; current mobile client not tested"
      },
      {
        "field": "gongqi_target_zones",
        "handling": "角色的牌按历史通用术语解释为H/E，移动同版直接目标区裁定未核；不声称当前客户端裁定已证。"
      }
    ],
    "source_evidence_note": "官网完整身份技能面板均已读，包括隐藏技能；同产品经典社区提供数值HP、勾玉数量、性别、势力与页面修订。来源证据不是当前移动客户端验证，初始满体力是N0宿主政策。",
    "adaptation_notes": "N0–N7、N9–N13明确初始体力、真实额外出牌阶段、全场势力投影、限定濒死、赠牌、死亡、整回合攻击范围与逐人解烦流程。非三国杀来源角色统一江湖势力为本作政策，不按君臣民或队伍计数；当前客户端及完整身份模式未核验。 弓骑的角色牌范围按历史通用术语解释为手牌／装备；移动同版直接目标区裁定未核。"
  }
];
export const SGS_YIJIANG_NEXT_DEFINITIONS = Object.freeze(definitions);
