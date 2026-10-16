/** Complete selected mobile identity packets; integration worktree only until final acceptance. */
const definitions = [
  {
    "source_product": "三国杀移动版 mainland",
    "variant": "基础身份版; official page snapshot 2026-10-15",
    "personal_lord_skills": [],
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "all_identity_skill_panels_verified": true,
    "source_only_exact_for_every_edge": false,
    "implementation_status": "tested",
    "mode_policy": "Retain source faction and complete personal package. This packet selects identity base rules; host 1v1/1v2 must not import special 1v1, 国战, 界, SP, 谋 rules. No personal lord skill appears in these complete identity blocks.",
    "id": "sgs.adapted.base.hero.xun-yu",
    "source_name": "荀彧",
    "display_name": "荀彧",
    "source_catalog_id": 35,
    "max_hp": 3,
    "base_hp": 3,
    "gender": "male",
    "source_faction": "魏",
    "complete_skill_names": [
      "驱虎",
      "节命"
    ],
    "skills": [
      {
        "id": "sgs.quhu",
        "name": "驱虎",
        "source_id": "mobile-xunyu",
        "optional": true,
        "timing": "Own play phase; once per genuine play-phase ID.",
        "quota": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": "Both owner and one other living role with strictly greater current HP must have a legal hand card; each commits exactly one hand card to a simultaneous rank comparison. No HP cost.",
        "target": "One other living role with current HP > owner current HP. No distance requirement on comparison. Target may be ally or enemy.",
        "win": "Owner chooses a living role other than the compared role, within that compared role’s actual attack range; compared role deals 1 normal skill damage to chosen role. Owner can be chosen if in range.",
        "not_win": "Tie or lower comparison result: compared role deals 1 normal skill damage to owner. This branch has no range check.",
        "no_victim": "No role in compared role attack range does not bar initiating Quhu; after a win, no damage is dealt.",
        "damage_attribution": "Compared role is source in both branches; owner is skill initiator only. No Slash card, no Dodge window, no use-Slash quota, no weapon-on-Slash hook, no Duel, no elemental chaining solely from Quhu. Ordinary damage prevention/transfer and postdamage triggers still apply.",
        "follow_up": "Not-win damage can trigger owner Jieming if actual positive damage occurred and owner survives the rescue/death process.",
        "source_support": [
          "mobile-xunyu",
          "mobile-xunyu-guide",
          "mirror-compare",
          "mirror-damage"
        ],
        "host_boundaries": [
          "H1",
          "H2",
          "H3",
          "H4"
        ],
        "compare_result_timing": "Historical general rule: hand cards remain in processing while win/not-win effects (Quhu damage and nested Jieming) resolve; compare cleanup moves remaining processing cards to discard afterward. Do not let nested draw reshuffle comparison cards early.",
        "postcommit_death": "Generic historical comparison still reveals committed cards if a participant dies before reveal. Modern mobile-specific Quhu continuation with a dead initiator/source is not verified; host must explicitly define legal continuation without card refund/cloning. No new target can be a dead role."
      },
      {
        "id": "sgs.jieming",
        "name": "节命",
        "source_id": "mobile-xunyu",
        "optional": true,
        "timing": "After owner actually receives damage; independently once for each point of actual damage. Resolve survival/rescue first under host damage contract.",
        "quota": {
          "count": null,
          "scope": "per_point_of_damage"
        },
        "cost": "None. Not HP loss, not prevented/zero damage. No requirement that damage has a source.",
        "target": "Any one living role per point, including self, ally or enemy; no distance/faction restriction. Same or different recipient may be chosen across points.",
        "draw": "Let X=min(recipient current max HP,5). Draw max(0,X-recipient current hand count). Uses max HP, never current HP. Existing hand above X is not discarded. Equipment and judgement cards do not count as hand.",
        "per_point": "One 2-damage event yields two sequential optional opportunities, not one draw-to-ten operation. Recompute recipient state for each opportunity.",
        "source_support": [
          "mobile-xunyu",
          "mobile-xunyu-guide",
          "mirror-damage"
        ],
        "host_boundaries": [
          "H3",
          "H4"
        ]
      }
    ],
    "metadata_sources": {
      "max_hp": [
        "mobile-xunyu-guide",
        "bwiki-xunyu",
        "ol-roster"
      ],
      "gender": [
        "mobile-xunyu-guide",
        "bwiki-xunyu"
      ],
      "faction": [
        "mobile-xunyu",
        "mobile-xunyu-guide"
      ]
    },
    "integration_decision": "add_distinct_selectable_entity",
    "official_skill_names": [
      "驱虎",
      "节命"
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "male",
      "complete_skill_names": [
        "驱虎",
        "节命"
      ],
      "personal_lord_skills": [],
      "mechanics": [
        {
          "id": "sgs.quhu",
          "name": "驱虎",
          "source_id": "mobile-xunyu",
          "optional": true,
          "timing": "Own play phase; once per genuine play-phase ID.",
          "quota": {
            "count": 1,
            "scope": "play_phase"
          },
          "cost": "Both owner and one other living role with strictly greater current HP must have a legal hand card; each commits exactly one hand card to a simultaneous rank comparison. No HP cost.",
          "target": "One other living role with current HP > owner current HP. No distance requirement on comparison. Target may be ally or enemy.",
          "win": "Owner chooses a living role other than the compared role, within that compared role’s actual attack range; compared role deals 1 normal skill damage to chosen role. Owner can be chosen if in range.",
          "not_win": "Tie or lower comparison result: compared role deals 1 normal skill damage to owner. This branch has no range check.",
          "no_victim": "No role in compared role attack range does not bar initiating Quhu; after a win, no damage is dealt.",
          "damage_attribution": "Compared role is source in both branches; owner is skill initiator only. No Slash card, no Dodge window, no use-Slash quota, no weapon-on-Slash hook, no Duel, no elemental chaining solely from Quhu. Ordinary damage prevention/transfer and postdamage triggers still apply.",
          "follow_up": "Not-win damage can trigger owner Jieming if actual positive damage occurred and owner survives the rescue/death process.",
          "source_support": [
            "mobile-xunyu",
            "mobile-xunyu-guide",
            "mirror-compare",
            "mirror-damage"
          ],
          "host_boundaries": [
            "H1",
            "H2",
            "H3",
            "H4"
          ],
          "compare_result_timing": "Historical general rule: hand cards remain in processing while win/not-win effects (Quhu damage and nested Jieming) resolve; compare cleanup moves remaining processing cards to discard afterward. Do not let nested draw reshuffle comparison cards early.",
          "postcommit_death": "Generic historical comparison still reveals committed cards if a participant dies before reveal. Modern mobile-specific Quhu continuation with a dead initiator/source is not verified; host must explicitly define legal continuation without card refund/cloning. No new target can be a dead role."
        },
        {
          "id": "sgs.jieming",
          "name": "节命",
          "source_id": "mobile-xunyu",
          "optional": true,
          "timing": "After owner actually receives damage; independently once for each point of actual damage. Resolve survival/rescue first under host damage contract.",
          "quota": {
            "count": null,
            "scope": "per_point_of_damage"
          },
          "cost": "None. Not HP loss, not prevented/zero damage. No requirement that damage has a source.",
          "target": "Any one living role per point, including self, ally or enemy; no distance/faction restriction. Same or different recipient may be chosen across points.",
          "draw": "Let X=min(recipient current max HP,5). Draw max(0,X-recipient current hand count). Uses max HP, never current HP. Existing hand above X is not discarded. Equipment and judgement cards do not count as hand.",
          "per_point": "One 2-damage event yields two sequential optional opportunities, not one draw-to-ten operation. Recompute recipient state for each opportunity.",
          "source_support": [
            "mobile-xunyu",
            "mobile-xunyu-guide",
            "mirror-damage"
          ],
          "host_boundaries": [
            "H3",
            "H4"
          ]
        }
      ]
    },
    "source_faction_retained": true,
    "ui_requirements": [
      "Show source label, variant and snapshot date; separate official source wording from host compatibility decisions.",
      "Show complete HP and every intrinsic skill; no unimplemented hero placeholder in selectable roster.",
      "Use newly created art/icons or authorized assets; raw publisher HTML/art is research only.",
      "Two skill panels 驱虎 and 节命, including the latter hidden in publisher HTML.",
      "Choose comparison target then card; after win choose legal damage recipient; each Jieming point offers recipient and decline."
    ],
    "name": "荀彧",
    "skill_name": "驱虎 / 节命",
    "skill_desc": "驱虎：每出牌阶段限1次，与体力值更高的其他角色拼点。赢则其对攻击范围内你选的一人造成1伤害，没赢则其对你造成1伤害。节命：每受1点伤害后，可令一人手牌摸至其体力上限（至多5）。",
    "skill_ids": [
      "sgs.quhu",
      "sgs.jieming"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.quhu",
        "name": "驱虎",
        "source_id": "mobile-xunyu",
        "optional": true,
        "timing": "Own play phase; once per genuine play-phase ID.",
        "quota": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": "Both owner and one other living role with strictly greater current HP must have a legal hand card; each commits exactly one hand card to a simultaneous rank comparison. No HP cost.",
        "target": "One other living role with current HP > owner current HP. No distance requirement on comparison. Target may be ally or enemy.",
        "win": "Owner chooses a living role other than the compared role, within that compared role’s actual attack range; compared role deals 1 normal skill damage to chosen role. Owner can be chosen if in range.",
        "not_win": "Tie or lower comparison result: compared role deals 1 normal skill damage to owner. This branch has no range check.",
        "no_victim": "No role in compared role attack range does not bar initiating Quhu; after a win, no damage is dealt.",
        "damage_attribution": "Compared role is source in both branches; owner is skill initiator only. No Slash card, no Dodge window, no use-Slash quota, no weapon-on-Slash hook, no Duel, no elemental chaining solely from Quhu. Ordinary damage prevention/transfer and postdamage triggers still apply.",
        "follow_up": "Not-win damage can trigger owner Jieming if actual positive damage occurred and owner survives the rescue/death process.",
        "source_support": [
          "mobile-xunyu",
          "mobile-xunyu-guide",
          "mirror-compare",
          "mirror-damage"
        ],
        "host_boundaries": [
          "H1",
          "H2",
          "H3",
          "H4"
        ],
        "compare_result_timing": "Historical general rule: hand cards remain in processing while win/not-win effects (Quhu damage and nested Jieming) resolve; compare cleanup moves remaining processing cards to discard afterward. Do not let nested draw reshuffle comparison cards early.",
        "postcommit_death": "Generic historical comparison still reveals committed cards if a participant dies before reveal. Modern mobile-specific Quhu continuation with a dead initiator/source is not verified; host must explicitly define legal continuation without card refund/cloning. No new target can be a dead role."
      },
      {
        "id": "sgs.jieming",
        "name": "节命",
        "source_id": "mobile-xunyu",
        "optional": true,
        "timing": "After owner actually receives damage; independently once for each point of actual damage. Resolve survival/rescue first under host damage contract.",
        "quota": {
          "count": null,
          "scope": "per_point_of_damage"
        },
        "cost": "None. Not HP loss, not prevented/zero damage. No requirement that damage has a source.",
        "target": "Any one living role per point, including self, ally or enemy; no distance/faction restriction. Same or different recipient may be chosen across points.",
        "draw": "Let X=min(recipient current max HP,5). Draw max(0,X-recipient current hand count). Uses max HP, never current HP. Existing hand above X is not discarded. Equipment and judgement cards do not count as hand.",
        "per_point": "One 2-damage event yields two sequential optional opportunities, not one draw-to-ten operation. Recompute recipient state for each opportunity.",
        "source_support": [
          "mobile-xunyu",
          "mobile-xunyu-guide",
          "mirror-damage"
        ],
        "host_boundaries": [
          "H3",
          "H4"
        ]
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "production_integration_status": "production-integrated-tested-source-mechanics-current-client-unverified",
    "source_coverage": true,
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "荀彧",
    "source_variant": "基础身份版; official page snapshot 2026-10-15+explicit-host-H1-H11",
    "source_date": "2026-10-15 catalog snapshot; historical official guide when listed",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-35.html",
      "https://www.sanguosha.cn/pc/guide-info-45.html",
      "https://gltjk.com/sanguosha/rules/flow/rankcompare.html",
      "https://gltjk.com/sanguosha/rules/flow/damage.html",
      "https://wiki.biligame.com/msgs/荀彧",
      "https://www.sanguosha.com/hero"
    ],
    "source_ids": [
      "mobile-xunyu",
      "mobile-xunyu-guide",
      "mirror-compare",
      "mirror-damage",
      "bwiki-xunyu",
      "ol-roster"
    ],
    "source_record_id": "sgs-mobile:hero-detail:35:identity:2026-10-15",
    "faction": "魏",
    "gender_provenance": "same-product official historical guide for Xunyu; matching mobile secondary base-variant fields for remaining three",
    "source_evidence_tiers": [
      {
        "id": "mobile-xunyu",
        "tier": "official_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-35.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mobile-xunyu-guide",
        "tier": "official_same_product_dated_guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-45.html",
        "publication_or_revision_date": "2020-06-12 14:42:29"
      },
      {
        "id": "mirror-compare",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/rankcompare.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-damage",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/damage.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-xunyu",
        "tier": "secondary_same_product_mobile_community_wiki",
        "url": "https://wiki.biligame.com/msgs/荀彧",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "official_different_product_OL_metadata_crosscheck",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      }
    ],
    "source_evidence_note": "官网身份技能逐项核验；当前客户端未实测，次级资料仅补同变体元数据与分级边界。",
    "source_unknowns": [
      "当前2026移动客户端未实测；全部模式和跨作组合未逐项复现。"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": true,
      "source_ids": [
        "mobile-xunyu-guide",
        "bwiki-xunyu",
        "ol-roster"
      ],
      "current_mobile_client_verified": false
    },
    "aliases": [
      "三国杀荀彧",
      "荀彧·驱虎·节命",
      "xun-yu"
    ],
    "portrait_path": "./portraits-sgs-fire/xun-yu.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "adaptation_notes": "核心采用所列移动官网身份技能；H1–H11明确拼点材料时序、跨作毒、额外阶段与改色等本作兼容裁定，当前客户端未核验。",
    "host_compatibility_policies": [
      {
        "id": "H1",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use the shared rank-compare service with a true per-play-phase quota. Two hand IDs lock before simultaneous processing/reveal, larger effective rank wins and tie is not-win. Resolve skill result and nested effects while materials are still in processing; cleanup remaining comparison materials afterward exactly once. Cannot cancel after reveal. No AI access to opposing hidden cards. Record printed/effective ranks; comparison is not use/respond/player-discard. Generic historical support: mirror-compare; postcommit-death mobile edge remains declared."
      },
      {
        "id": "H2",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "All choices revalidate actual owner, zone, life, skill and target legality before cost commit. Cancel/stale validation consumes neither card nor quota. After real commit never refund or repeat moves due to duplicate callback. Real hand/equipment loss emits its normal exact-ID movement events; no fabricated loss from UI preview."
      },
      {
        "id": "H3",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use genuine normal-skill-damage events with compared role as source for Quhu. Complete dying/rescue before Jieming opportunities. If owner is finally dead, no draws; if rescued, process each actual damage point once. No cards manufactured for a deck shortage. Public HP may change between sequential opportunities; read live max HP and hand count."
      },
      {
        "id": "H4",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Extra-phase quotas use phase IDs and per-turn lasting effects use turn IDs. Copying/losing/regaining a skill does not refresh an already spent same-phase quota. Expire generated state at turn end/abort; do not grant extra phase or lord mode merely to activate the skills."
      },
      {
        "id": "H5",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Duanliang accepts effective-black physical basic/equipment cards in H/E, including enabled-pack poison only if classified basic. Check color through owner-aware effective face, not raw color; check original physical category, not a chained preview conversion. Do not use type!=trick. Equipped material causes real equipment-loss hooks once. Cross-game poison loss follows the actual move contract, not invented source XuHuang text."
      },
      {
        "id": "H6",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "For an equipped offensive horse used as Duanliang material, evaluate destination distance after excluding that material’s own distance benefit. Other retained equipment/hero distance modifiers still apply. Weapon attack range never substitutes for card distance. Use a non-mutating legality preview; reject out-of-range without removing the horse."
      },
      {
        "id": "H7",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use existing persistent delayed-card wrapper with underlying material ID. While in J it has Supply Shortage semantics for duplicate checks, targeting and removal; when obtained into hand or discarded it returns to original basic/equipment identity. No cloned second physical card and no lingering marker. Transfer rechecks destination delayed-card legality."
      },
      {
        "id": "H8",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Reuse host standard Supply Shortage Nullification and judgement windows rather than inventing a Duanliang-only schedule. A real delayed-card effect and a poison skip-draw mark may each request the same phase be skipped, but never skip two turns from one next-phase skip. No source card-count recipe is claimed."
      },
      {
        "id": "H9",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Represent each successful Tianyi comparison by an additive +1 use/+1 target effect token expiring at actual turn end. Per-phase activation resets only in a genuine new play phase. Winning again in another phase adds another token; any not-win token keeps a hard use-Slash ban until turn end, subsequent wins do not clear it. Compose additions with host baseline allowance/target-cap and lawful equipment; retain Infinity for unlimited uses. For an equipment floor/cap of3 targets, +1 Tianyi is4, not max(3,2). Ordinary host counters remain separate and are not refunded. This extra-phase/mixed-effect composition is a disclosed host policy, not directly tested official-client behavior."
      },
      {
        "id": "H10",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Shuangxiong binds the final effective judgement color to an actual turn ID. Material eligibility uses owner-aware effective color at use time. If copied color-changing skills later change the acquired judgement card, do not change the recorded result. A colorless/unknown-result judgement grants no conversion in this host until a source ruling exists; do not invent red/black. Multiple real draw-phase replacements in one turn create independent eligibility tokens (union), rather than silently overwriting an earlier one; this exotic edge is unverified current-client behavior."
      },
      {
        "id": "H11",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use shared draw-phase replacement arbitration. Only a draw phase that actually occurs can be replaced; Supply Shortage/poison skip does not run Shuangxiong. On accepting Shuangxiong suppress the normal phase draw, keep unrelated independent draw/obtain effects. No extra judgement per UI click. Obtain only the still-available final judgement material; never clone a card acquired by a different intervening effect. Exact copied-skill competition for that material is unresolved source behavior and must follow explicit host event ordering."
      }
    ],
    "personal_lord_skill_ids": []
  },
  {
    "source_product": "三国杀移动版 mainland",
    "variant": "基础身份版; official page snapshot 2026-10-15",
    "personal_lord_skills": [],
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "all_identity_skill_panels_verified": true,
    "source_only_exact_for_every_edge": false,
    "implementation_status": "tested",
    "mode_policy": "Retain source faction and complete personal package. This packet selects identity base rules; host 1v1/1v2 must not import special 1v1, 国战, 界, SP, 谋 rules. No personal lord skill appears in these complete identity blocks.",
    "id": "sgs.adapted.base.hero.xu-huang",
    "source_name": "徐晃",
    "display_name": "徐晃",
    "source_catalog_id": 42,
    "max_hp": 4,
    "base_hp": 4,
    "gender": "male",
    "source_faction": "魏",
    "complete_skill_names": [
      "断粮"
    ],
    "skills": [
      {
        "id": "sgs.duanliang",
        "name": "断粮",
        "source_id": "mobile-xuhuang",
        "optional": true,
        "timing": "At a legal Supply Shortage card-use window, ordinarily own play phase. No once/turn/phase cap in selected skill text.",
        "quota": {
          "count": null,
          "scope": "no_intrinsic_quota"
        },
        "material": {
          "count": 1,
          "color": "effective black under owner/current card-face rule context, tested before commit; not raw printed black if an active suit/color rule makes it red",
          "printed_categories": [
            "basic",
            "equipment"
          ],
          "eligible_zones": [
            "own hand",
            "own equipment"
          ],
          "excluded": [
            "any trick even black",
            "red card",
            "other player card",
            "own judgement zone card",
            "unclassified custom card merely not a trick"
          ],
          "category_policy": "original physical basic/equipment category before Duanliang view-as; reject chained conversion of an unrelated trick just because its preview was a basic card. Source base XuHuang has no intrinsic color/type modifier."
        },
        "conversion": "Use one eligible physical card as a virtual 兵粮寸断; this is a delayed-trick use, not discard cost and not a direct skip-draw mark. Preserve single material identity/suit/rank/color through ordinary conversion pipeline.",
        "range": "Owner may use physical OR converted 兵粮寸断 on other roles at effective distance2, in addition to ordinary distance1. Applies to this card only, not all tricks or attacks. Does not bypass target prohibitions, duplicates or timing.",
        "target": "One other living role; ordinary Supply Shortage legality, no identical Supply Shortage already in target judgement zone. No blanket enemy-only restriction belongs to source.",
        "resolution": "Persist the actual material as converted Supply Shortage in judgement zone. Ordinary Nullification/judgement/retrial/effective-club test: non-club skips entire next draw phase; club does not. Both clear the delayed card normally. Card removed before judgement does not leave a skip flag.",
        "zones_basis": "Mainland hero text says a card without hand-only restriction. General card rules need H/E interpretation; historical mirror independently supports generic use material and delayed conversion. This is a declared host compatibility contract, not a same-page explicit zone FAQ.",
        "not_skills": [
          "截辎",
          "global no-distance limitation",
          "range>2 once-turn cap",
          "draw on missing target phase"
        ],
        "source_support": [
          "mobile-xuhuang",
          "mirror-gamecard",
          "mirror-scroll",
          "mirror-virtual"
        ],
        "host_boundaries": [
          "H2",
          "H4",
          "H5",
          "H6",
          "H7",
          "H8"
        ]
      }
    ],
    "metadata_sources": {
      "max_hp": [
        "bwiki-xuhuang",
        "ol-roster"
      ],
      "gender": [
        "bwiki-xuhuang"
      ],
      "faction": [
        "mobile-xuhuang"
      ]
    },
    "integration_decision": "add_distinct_selectable_entity",
    "metadata_warning": "Mobile catalog has no explicit HP/gender; selected classic HP4 male is dated community evidence plus OL max-HP corroboration. No official-mainland-HP or current-client claim.",
    "official_skill_names": [
      "断粮"
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "complete_skill_names": [
        "断粮"
      ],
      "personal_lord_skills": [],
      "mechanics": [
        {
          "id": "sgs.duanliang",
          "name": "断粮",
          "source_id": "mobile-xuhuang",
          "optional": true,
          "timing": "At a legal Supply Shortage card-use window, ordinarily own play phase. No once/turn/phase cap in selected skill text.",
          "quota": {
            "count": null,
            "scope": "no_intrinsic_quota"
          },
          "material": {
            "count": 1,
            "color": "effective black under owner/current card-face rule context, tested before commit; not raw printed black if an active suit/color rule makes it red",
            "printed_categories": [
              "basic",
              "equipment"
            ],
            "eligible_zones": [
              "own hand",
              "own equipment"
            ],
            "excluded": [
              "any trick even black",
              "red card",
              "other player card",
              "own judgement zone card",
              "unclassified custom card merely not a trick"
            ],
            "category_policy": "original physical basic/equipment category before Duanliang view-as; reject chained conversion of an unrelated trick just because its preview was a basic card. Source base XuHuang has no intrinsic color/type modifier."
          },
          "conversion": "Use one eligible physical card as a virtual 兵粮寸断; this is a delayed-trick use, not discard cost and not a direct skip-draw mark. Preserve single material identity/suit/rank/color through ordinary conversion pipeline.",
          "range": "Owner may use physical OR converted 兵粮寸断 on other roles at effective distance2, in addition to ordinary distance1. Applies to this card only, not all tricks or attacks. Does not bypass target prohibitions, duplicates or timing.",
          "target": "One other living role; ordinary Supply Shortage legality, no identical Supply Shortage already in target judgement zone. No blanket enemy-only restriction belongs to source.",
          "resolution": "Persist the actual material as converted Supply Shortage in judgement zone. Ordinary Nullification/judgement/retrial/effective-club test: non-club skips entire next draw phase; club does not. Both clear the delayed card normally. Card removed before judgement does not leave a skip flag.",
          "zones_basis": "Mainland hero text says a card without hand-only restriction. General card rules need H/E interpretation; historical mirror independently supports generic use material and delayed conversion. This is a declared host compatibility contract, not a same-page explicit zone FAQ.",
          "not_skills": [
            "截辎",
            "global no-distance limitation",
            "range>2 once-turn cap",
            "draw on missing target phase"
          ],
          "source_support": [
            "mobile-xuhuang",
            "mirror-gamecard",
            "mirror-scroll",
            "mirror-virtual"
          ],
          "host_boundaries": [
            "H2",
            "H4",
            "H5",
            "H6",
            "H7",
            "H8"
          ]
        }
      ]
    },
    "source_faction_retained": true,
    "ui_requirements": [
      "Show source label, variant and snapshot date; separate official source wording from host compatibility decisions.",
      "Show complete HP and every intrinsic skill; no unimplemented hero placeholder in selectable roster.",
      "Use newly created art/icons or authorized assets; raw publisher HTML/art is research only.",
      "Material picker shows both H and equipped E cards with zone labels and effective black eligibility.",
      "Show persistent Supply Shortage face over original material identity in judgement zone; show original when obtained back."
    ],
    "name": "徐晃",
    "skill_name": "断粮",
    "skill_desc": "断粮：可将黑色基本牌或装备当兵粮寸断使用；使用兵粮寸断的距离限制为2。材料按实际移出后距离校验，保留真实判定实体。",
    "skill_ids": [
      "sgs.duanliang"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.duanliang",
        "name": "断粮",
        "source_id": "mobile-xuhuang",
        "optional": true,
        "timing": "At a legal Supply Shortage card-use window, ordinarily own play phase. No once/turn/phase cap in selected skill text.",
        "quota": {
          "count": null,
          "scope": "no_intrinsic_quota"
        },
        "material": {
          "count": 1,
          "color": "effective black under owner/current card-face rule context, tested before commit; not raw printed black if an active suit/color rule makes it red",
          "printed_categories": [
            "basic",
            "equipment"
          ],
          "eligible_zones": [
            "own hand",
            "own equipment"
          ],
          "excluded": [
            "any trick even black",
            "red card",
            "other player card",
            "own judgement zone card",
            "unclassified custom card merely not a trick"
          ],
          "category_policy": "original physical basic/equipment category before Duanliang view-as; reject chained conversion of an unrelated trick just because its preview was a basic card. Source base XuHuang has no intrinsic color/type modifier."
        },
        "conversion": "Use one eligible physical card as a virtual 兵粮寸断; this is a delayed-trick use, not discard cost and not a direct skip-draw mark. Preserve single material identity/suit/rank/color through ordinary conversion pipeline.",
        "range": "Owner may use physical OR converted 兵粮寸断 on other roles at effective distance2, in addition to ordinary distance1. Applies to this card only, not all tricks or attacks. Does not bypass target prohibitions, duplicates or timing.",
        "target": "One other living role; ordinary Supply Shortage legality, no identical Supply Shortage already in target judgement zone. No blanket enemy-only restriction belongs to source.",
        "resolution": "Persist the actual material as converted Supply Shortage in judgement zone. Ordinary Nullification/judgement/retrial/effective-club test: non-club skips entire next draw phase; club does not. Both clear the delayed card normally. Card removed before judgement does not leave a skip flag.",
        "zones_basis": "Mainland hero text says a card without hand-only restriction. General card rules need H/E interpretation; historical mirror independently supports generic use material and delayed conversion. This is a declared host compatibility contract, not a same-page explicit zone FAQ.",
        "not_skills": [
          "截辎",
          "global no-distance limitation",
          "range>2 once-turn cap",
          "draw on missing target phase"
        ],
        "source_support": [
          "mobile-xuhuang",
          "mirror-gamecard",
          "mirror-scroll",
          "mirror-virtual"
        ],
        "host_boundaries": [
          "H2",
          "H4",
          "H5",
          "H6",
          "H7",
          "H8"
        ]
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "production_integration_status": "production-integrated-tested-source-mechanics-current-client-unverified",
    "source_coverage": true,
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "徐晃",
    "source_variant": "基础身份版; official page snapshot 2026-10-15+explicit-host-H1-H11",
    "source_date": "2026-10-15 catalog snapshot; historical official guide when listed",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-42.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://gltjk.com/sanguosha/rules/card/scroll.html",
      "https://gltjk.com/sanguosha/rules/flow/virtual.html",
      "https://wiki.biligame.com/msgs/徐晃",
      "https://www.sanguosha.com/hero"
    ],
    "source_ids": [
      "mobile-xuhuang",
      "mirror-gamecard",
      "mirror-scroll",
      "mirror-virtual",
      "bwiki-xuhuang",
      "ol-roster"
    ],
    "source_record_id": "sgs-mobile:hero-detail:42:identity:2026-10-15",
    "faction": "魏",
    "gender_provenance": "same-product official historical guide for Xunyu; matching mobile secondary base-variant fields for remaining three",
    "source_evidence_tiers": [
      {
        "id": "mobile-xuhuang",
        "tier": "official_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-42.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-scroll",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/scroll.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-virtual",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/virtual.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-xuhuang",
        "tier": "secondary_same_product_mobile_community_wiki",
        "url": "https://wiki.biligame.com/msgs/徐晃",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "official_different_product_OL_metadata_crosscheck",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      }
    ],
    "source_evidence_note": "官网身份技能逐项核验；当前客户端未实测，次级资料仅补同变体元数据与分级边界。",
    "source_unknowns": [
      "当前2026移动客户端未实测；全部模式和跨作组合未逐项复现。"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-xuhuang",
        "ol-roster"
      ],
      "current_mobile_client_verified": false
    },
    "aliases": [
      "三国杀徐晃",
      "徐晃·断粮",
      "xu-huang"
    ],
    "portrait_path": "./portraits-sgs-fire/xu-huang.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "adaptation_notes": "核心采用所列移动官网身份技能；H1–H11明确拼点材料时序、跨作毒、额外阶段与改色等本作兼容裁定，当前客户端未核验。",
    "host_compatibility_policies": [
      {
        "id": "H1",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use the shared rank-compare service with a true per-play-phase quota. Two hand IDs lock before simultaneous processing/reveal, larger effective rank wins and tie is not-win. Resolve skill result and nested effects while materials are still in processing; cleanup remaining comparison materials afterward exactly once. Cannot cancel after reveal. No AI access to opposing hidden cards. Record printed/effective ranks; comparison is not use/respond/player-discard. Generic historical support: mirror-compare; postcommit-death mobile edge remains declared."
      },
      {
        "id": "H2",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "All choices revalidate actual owner, zone, life, skill and target legality before cost commit. Cancel/stale validation consumes neither card nor quota. After real commit never refund or repeat moves due to duplicate callback. Real hand/equipment loss emits its normal exact-ID movement events; no fabricated loss from UI preview."
      },
      {
        "id": "H3",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use genuine normal-skill-damage events with compared role as source for Quhu. Complete dying/rescue before Jieming opportunities. If owner is finally dead, no draws; if rescued, process each actual damage point once. No cards manufactured for a deck shortage. Public HP may change between sequential opportunities; read live max HP and hand count."
      },
      {
        "id": "H4",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Extra-phase quotas use phase IDs and per-turn lasting effects use turn IDs. Copying/losing/regaining a skill does not refresh an already spent same-phase quota. Expire generated state at turn end/abort; do not grant extra phase or lord mode merely to activate the skills."
      },
      {
        "id": "H5",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Duanliang accepts effective-black physical basic/equipment cards in H/E, including enabled-pack poison only if classified basic. Check color through owner-aware effective face, not raw color; check original physical category, not a chained preview conversion. Do not use type!=trick. Equipped material causes real equipment-loss hooks once. Cross-game poison loss follows the actual move contract, not invented source XuHuang text."
      },
      {
        "id": "H6",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "For an equipped offensive horse used as Duanliang material, evaluate destination distance after excluding that material’s own distance benefit. Other retained equipment/hero distance modifiers still apply. Weapon attack range never substitutes for card distance. Use a non-mutating legality preview; reject out-of-range without removing the horse."
      },
      {
        "id": "H7",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use existing persistent delayed-card wrapper with underlying material ID. While in J it has Supply Shortage semantics for duplicate checks, targeting and removal; when obtained into hand or discarded it returns to original basic/equipment identity. No cloned second physical card and no lingering marker. Transfer rechecks destination delayed-card legality."
      },
      {
        "id": "H8",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Reuse host standard Supply Shortage Nullification and judgement windows rather than inventing a Duanliang-only schedule. A real delayed-card effect and a poison skip-draw mark may each request the same phase be skipped, but never skip two turns from one next-phase skip. No source card-count recipe is claimed."
      },
      {
        "id": "H9",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Represent each successful Tianyi comparison by an additive +1 use/+1 target effect token expiring at actual turn end. Per-phase activation resets only in a genuine new play phase. Winning again in another phase adds another token; any not-win token keeps a hard use-Slash ban until turn end, subsequent wins do not clear it. Compose additions with host baseline allowance/target-cap and lawful equipment; retain Infinity for unlimited uses. For an equipment floor/cap of3 targets, +1 Tianyi is4, not max(3,2). Ordinary host counters remain separate and are not refunded. This extra-phase/mixed-effect composition is a disclosed host policy, not directly tested official-client behavior."
      },
      {
        "id": "H10",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Shuangxiong binds the final effective judgement color to an actual turn ID. Material eligibility uses owner-aware effective color at use time. If copied color-changing skills later change the acquired judgement card, do not change the recorded result. A colorless/unknown-result judgement grants no conversion in this host until a source ruling exists; do not invent red/black. Multiple real draw-phase replacements in one turn create independent eligibility tokens (union), rather than silently overwriting an earlier one; this exotic edge is unverified current-client behavior."
      },
      {
        "id": "H11",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use shared draw-phase replacement arbitration. Only a draw phase that actually occurs can be replaced; Supply Shortage/poison skip does not run Shuangxiong. On accepting Shuangxiong suppress the normal phase draw, keep unrelated independent draw/obtain effects. No extra judgement per UI click. Obtain only the still-available final judgement material; never clone a card acquired by a different intervening effect. Exact copied-skill competition for that material is unresolved source behavior and must follow explicit host event ordering."
      }
    ],
    "personal_lord_skill_ids": []
  },
  {
    "source_product": "三国杀移动版 mainland",
    "variant": "基础身份版; official page snapshot 2026-10-15",
    "personal_lord_skills": [],
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "all_identity_skill_panels_verified": true,
    "source_only_exact_for_every_edge": false,
    "implementation_status": "tested",
    "mode_policy": "Retain source faction and complete personal package. This packet selects identity base rules; host 1v1/1v2 must not import special 1v1, 国战, 界, SP, 谋 rules. No personal lord skill appears in these complete identity blocks.",
    "id": "sgs.adapted.base.hero.tai-shi-ci",
    "source_name": "太史慈",
    "display_name": "太史慈",
    "source_catalog_id": 38,
    "max_hp": 4,
    "base_hp": 4,
    "gender": "male",
    "source_faction": "吴",
    "complete_skill_names": [
      "天义"
    ],
    "skills": [
      {
        "id": "sgs.tianyi",
        "name": "天义",
        "source_id": "mobile-taishici",
        "optional": true,
        "timing": "Own play phase; once per genuine play-phase ID.",
        "quota": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": "Owner and one other living role each commit exactly one hand card to rank comparison; both need legal hand cards. No HP/hand-count superiority or distance condition.",
        "win": "Through the END OF THIS TURN, owner has one additional Slash-use allowance, one additional Slash target, and no Slash distance restriction. These are additive +1 modifiers, not replace/floor-to-two.",
        "not_win": "Tie or lower result prohibits owner from using Slash for the remainder of this turn; this does not prohibit pure respond/play-a-Slash windows such as Duel.",
        "duration": "Selected official identity HTML says turn end / this turn. Community classic page oldid34809 instead says this phase. Preserve official selection and disclose conflict; no current-client parity assertion.",
        "interaction": "Use ordinary Slash categories and virtual conversions. No general all-card range waiver. No bypass of target immunity/prohibition. Crossbow/unlimited-use does not remove a hard no-Slash-use prohibition. Existing use counters are not reset by a win.",
        "additional_phases": "Skill use cap is phase-scoped, generated modifier is turn-scoped. Additional phase may permit a new comparison; accumulation and combining wins/losses with other host modifiers are H9 proposals, not an official FAQ finding.",
        "source_support": [
          "mobile-taishici",
          "mirror-wu",
          "mirror-compare"
        ],
        "host_boundaries": [
          "H1",
          "H2",
          "H4",
          "H9"
        ]
      }
    ],
    "metadata_sources": {
      "max_hp": [
        "bwiki-taishici",
        "ol-roster"
      ],
      "gender": [
        "bwiki-taishici"
      ],
      "faction": [
        "mobile-taishici"
      ]
    },
    "integration_decision": "add_distinct_selectable_entity",
    "metadata_warning": "Official catalog lacks HP/gender fields; BWIKI classic HP4 male is secondary and OL confirms 4HP. BWIKI skill duration differs and is excluded as authoritative skill text.",
    "official_skill_names": [
      "天义"
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "complete_skill_names": [
        "天义"
      ],
      "personal_lord_skills": [],
      "mechanics": [
        {
          "id": "sgs.tianyi",
          "name": "天义",
          "source_id": "mobile-taishici",
          "optional": true,
          "timing": "Own play phase; once per genuine play-phase ID.",
          "quota": {
            "count": 1,
            "scope": "play_phase"
          },
          "cost": "Owner and one other living role each commit exactly one hand card to rank comparison; both need legal hand cards. No HP/hand-count superiority or distance condition.",
          "win": "Through the END OF THIS TURN, owner has one additional Slash-use allowance, one additional Slash target, and no Slash distance restriction. These are additive +1 modifiers, not replace/floor-to-two.",
          "not_win": "Tie or lower result prohibits owner from using Slash for the remainder of this turn; this does not prohibit pure respond/play-a-Slash windows such as Duel.",
          "duration": "Selected official identity HTML says turn end / this turn. Community classic page oldid34809 instead says this phase. Preserve official selection and disclose conflict; no current-client parity assertion.",
          "interaction": "Use ordinary Slash categories and virtual conversions. No general all-card range waiver. No bypass of target immunity/prohibition. Crossbow/unlimited-use does not remove a hard no-Slash-use prohibition. Existing use counters are not reset by a win.",
          "additional_phases": "Skill use cap is phase-scoped, generated modifier is turn-scoped. Additional phase may permit a new comparison; accumulation and combining wins/losses with other host modifiers are H9 proposals, not an official FAQ finding.",
          "source_support": [
            "mobile-taishici",
            "mirror-wu",
            "mirror-compare"
          ],
          "host_boundaries": [
            "H1",
            "H2",
            "H4",
            "H9"
          ]
        }
      ]
    },
    "source_faction_retained": true,
    "ui_requirements": [
      "Show source label, variant and snapshot date; separate official source wording from host compatibility decisions.",
      "Show complete HP and every intrinsic skill; no unimplemented hero placeholder in selectable roster.",
      "Use newly created art/icons or authorized assets; raw publisher HTML/art is research only.",
      "Show once-per-play-phase action state, current additive use/target bonuses and turn-long hard ban.",
      "Keep distinct portrait/hero identity from RenHengZhi; do not alias the skill."
    ],
    "name": "太史慈",
    "skill_name": "天义",
    "skill_desc": "天义：每出牌阶段限1次，与其他角色拼点。赢则本回合杀无距离限制、可额外使用1张且可多指定1目标；没赢则本回合不能使用杀，仍可打出响应。",
    "skill_ids": [
      "sgs.tianyi"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.tianyi",
        "name": "天义",
        "source_id": "mobile-taishici",
        "optional": true,
        "timing": "Own play phase; once per genuine play-phase ID.",
        "quota": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": "Owner and one other living role each commit exactly one hand card to rank comparison; both need legal hand cards. No HP/hand-count superiority or distance condition.",
        "win": "Through the END OF THIS TURN, owner has one additional Slash-use allowance, one additional Slash target, and no Slash distance restriction. These are additive +1 modifiers, not replace/floor-to-two.",
        "not_win": "Tie or lower result prohibits owner from using Slash for the remainder of this turn; this does not prohibit pure respond/play-a-Slash windows such as Duel.",
        "duration": "Selected official identity HTML says turn end / this turn. Community classic page oldid34809 instead says this phase. Preserve official selection and disclose conflict; no current-client parity assertion.",
        "interaction": "Use ordinary Slash categories and virtual conversions. No general all-card range waiver. No bypass of target immunity/prohibition. Crossbow/unlimited-use does not remove a hard no-Slash-use prohibition. Existing use counters are not reset by a win.",
        "additional_phases": "Skill use cap is phase-scoped, generated modifier is turn-scoped. Additional phase may permit a new comparison; accumulation and combining wins/losses with other host modifiers are H9 proposals, not an official FAQ finding.",
        "source_support": [
          "mobile-taishici",
          "mirror-wu",
          "mirror-compare"
        ],
        "host_boundaries": [
          "H1",
          "H2",
          "H4",
          "H9"
        ]
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "production_integration_status": "production-integrated-tested-source-mechanics-current-client-unverified",
    "source_coverage": true,
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "太史慈",
    "source_variant": "基础身份版; official page snapshot 2026-10-15+explicit-host-H1-H11",
    "source_date": "2026-10-15 catalog snapshot; historical official guide when listed",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-38.html",
      "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
      "https://gltjk.com/sanguosha/rules/flow/rankcompare.html",
      "https://wiki.biligame.com/msgs/太史慈",
      "https://www.sanguosha.com/hero"
    ],
    "source_ids": [
      "mobile-taishici",
      "mirror-wu",
      "mirror-compare",
      "bwiki-taishici",
      "ol-roster"
    ],
    "source_record_id": "sgs-mobile:hero-detail:38:identity:2026-10-15",
    "faction": "吴",
    "gender_provenance": "same-product official historical guide for Xunyu; matching mobile secondary base-variant fields for remaining three",
    "source_evidence_tiers": [
      {
        "id": "mobile-taishici",
        "tier": "official_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-38.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-wu",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-compare",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/rankcompare.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-taishici",
        "tier": "secondary_same_product_mobile_community_wiki",
        "url": "https://wiki.biligame.com/msgs/太史慈",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "official_different_product_OL_metadata_crosscheck",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      }
    ],
    "source_evidence_note": "官网身份技能逐项核验；当前客户端未实测，次级资料仅补同变体元数据与分级边界。",
    "source_unknowns": [
      "当前2026移动客户端未实测；全部模式和跨作组合未逐项复现。"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-taishici",
        "ol-roster"
      ],
      "current_mobile_client_verified": false
    },
    "aliases": [
      "三国杀太史慈",
      "太史慈·天义",
      "tai-shi-ci"
    ],
    "portrait_path": "./portraits-sgs-fire/tai-shi-ci.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "adaptation_notes": "核心采用所列移动官网身份技能；H1–H11明确拼点材料时序、跨作毒、额外阶段与改色等本作兼容裁定，当前客户端未核验。",
    "host_compatibility_policies": [
      {
        "id": "H1",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use the shared rank-compare service with a true per-play-phase quota. Two hand IDs lock before simultaneous processing/reveal, larger effective rank wins and tie is not-win. Resolve skill result and nested effects while materials are still in processing; cleanup remaining comparison materials afterward exactly once. Cannot cancel after reveal. No AI access to opposing hidden cards. Record printed/effective ranks; comparison is not use/respond/player-discard. Generic historical support: mirror-compare; postcommit-death mobile edge remains declared."
      },
      {
        "id": "H2",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "All choices revalidate actual owner, zone, life, skill and target legality before cost commit. Cancel/stale validation consumes neither card nor quota. After real commit never refund or repeat moves due to duplicate callback. Real hand/equipment loss emits its normal exact-ID movement events; no fabricated loss from UI preview."
      },
      {
        "id": "H3",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use genuine normal-skill-damage events with compared role as source for Quhu. Complete dying/rescue before Jieming opportunities. If owner is finally dead, no draws; if rescued, process each actual damage point once. No cards manufactured for a deck shortage. Public HP may change between sequential opportunities; read live max HP and hand count."
      },
      {
        "id": "H4",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Extra-phase quotas use phase IDs and per-turn lasting effects use turn IDs. Copying/losing/regaining a skill does not refresh an already spent same-phase quota. Expire generated state at turn end/abort; do not grant extra phase or lord mode merely to activate the skills."
      },
      {
        "id": "H5",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Duanliang accepts effective-black physical basic/equipment cards in H/E, including enabled-pack poison only if classified basic. Check color through owner-aware effective face, not raw color; check original physical category, not a chained preview conversion. Do not use type!=trick. Equipped material causes real equipment-loss hooks once. Cross-game poison loss follows the actual move contract, not invented source XuHuang text."
      },
      {
        "id": "H6",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "For an equipped offensive horse used as Duanliang material, evaluate destination distance after excluding that material’s own distance benefit. Other retained equipment/hero distance modifiers still apply. Weapon attack range never substitutes for card distance. Use a non-mutating legality preview; reject out-of-range without removing the horse."
      },
      {
        "id": "H7",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use existing persistent delayed-card wrapper with underlying material ID. While in J it has Supply Shortage semantics for duplicate checks, targeting and removal; when obtained into hand or discarded it returns to original basic/equipment identity. No cloned second physical card and no lingering marker. Transfer rechecks destination delayed-card legality."
      },
      {
        "id": "H8",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Reuse host standard Supply Shortage Nullification and judgement windows rather than inventing a Duanliang-only schedule. A real delayed-card effect and a poison skip-draw mark may each request the same phase be skipped, but never skip two turns from one next-phase skip. No source card-count recipe is claimed."
      },
      {
        "id": "H9",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Represent each successful Tianyi comparison by an additive +1 use/+1 target effect token expiring at actual turn end. Per-phase activation resets only in a genuine new play phase. Winning again in another phase adds another token; any not-win token keeps a hard use-Slash ban until turn end, subsequent wins do not clear it. Compose additions with host baseline allowance/target-cap and lawful equipment; retain Infinity for unlimited uses. For an equipment floor/cap of3 targets, +1 Tianyi is4, not max(3,2). Ordinary host counters remain separate and are not refunded. This extra-phase/mixed-effect composition is a disclosed host policy, not directly tested official-client behavior."
      },
      {
        "id": "H10",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Shuangxiong binds the final effective judgement color to an actual turn ID. Material eligibility uses owner-aware effective color at use time. If copied color-changing skills later change the acquired judgement card, do not change the recorded result. A colorless/unknown-result judgement grants no conversion in this host until a source ruling exists; do not invent red/black. Multiple real draw-phase replacements in one turn create independent eligibility tokens (union), rather than silently overwriting an earlier one; this exotic edge is unverified current-client behavior."
      },
      {
        "id": "H11",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use shared draw-phase replacement arbitration. Only a draw phase that actually occurs can be replaced; Supply Shortage/poison skip does not run Shuangxiong. On accepting Shuangxiong suppress the normal phase draw, keep unrelated independent draw/obtain effects. No extra judgement per UI click. Obtain only the still-available final judgement material; never clone a card acquired by a different intervening effect. Exact copied-skill competition for that material is unresolved source behavior and must follow explicit host event ordering."
      }
    ],
    "personal_lord_skill_ids": []
  },
  {
    "source_product": "三国杀移动版 mainland",
    "variant": "基础身份版; official page snapshot 2026-10-15",
    "personal_lord_skills": [],
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "all_identity_skill_panels_verified": true,
    "source_only_exact_for_every_edge": false,
    "implementation_status": "tested",
    "mode_policy": "Retain source faction and complete personal package. This packet selects identity base rules; host 1v1/1v2 must not import special 1v1, 国战, 界, SP, 谋 rules. No personal lord skill appears in these complete identity blocks.",
    "id": "sgs.adapted.base.hero.yan-liang-wen-chou",
    "source_name": "颜良文丑",
    "display_name": "颜良文丑",
    "source_catalog_id": 40,
    "max_hp": 4,
    "base_hp": 4,
    "gender": "male",
    "source_faction": "群",
    "complete_skill_names": [
      "双雄"
    ],
    "skills": [
      {
        "id": "sgs.shuangxiong",
        "name": "双雄",
        "source_id": "mobile-yanliangwenchou",
        "optional": true,
        "timing": "Replace own normal draw-phase draw with one judgement. It is not an additional judgement after drawing and not a turn-start skill.",
        "quota": {
          "count": 1,
          "scope": "each_existing_draw_phase_replacement"
        },
        "cost": "Forego the normal draw action of this draw phase. No hand-card discard or HP cost. A skipped draw phase provides no opportunity.",
        "judgement": "Perform one ordinary judgement with all legitimate retrials. Obtain the final effective judgement card after result is fixed, not the initial top card and not two top cards. Preserve final result color as the conversion condition for this turn.",
        "conversion": "For rest of this turn, may use exactly one own HAND card of a color different from the fixed judgement result as Duel. May repeat with separate eligible cards as ordinary Duel permits; no intrinsic once-per-play-phase conversion quota. Equipment in hand is fine; equipment in E and cards in J are not.",
        "resolution": "Use ordinary single-material Duel: one other legal role, normally no distance restriction; target answers Slash first, then alternating responses. Ordinary Nullification can cancel Duel; damage source is the opposing successful Duel participant. No automatic damage, no Slash-use quota consumed by pure responses.",
        "not_skills": [
          "not draw-two/select-one variant",
          "no recovery of opposing response Slashes when taking Duel damage",
          "no compulsory activation",
          "no equipment-zone conversion",
          "no extra 1v1 or Guozhan rules"
        ],
        "source_support": [
          "mobile-yanliangwenchou",
          "mirror-neutral",
          "mirror-scroll",
          "mirror-gamecard",
          "mirror-virtual"
        ],
        "host_boundaries": [
          "H2",
          "H4",
          "H10",
          "H11"
        ]
      }
    ],
    "metadata_sources": {
      "max_hp": [
        "bwiki-yanliangwenchou",
        "ol-roster"
      ],
      "gender": [
        "bwiki-yanliangwenchou"
      ],
      "faction": [
        "mobile-yanliangwenchou"
      ]
    },
    "integration_decision": "add_distinct_selectable_entity",
    "metadata_warning": "Official catalog lacks explicit HP/gender; BWIKI identity classic HP4 male, revision35616 2026-01-05, is secondary. This is one composite hero with one HP pool, not two selectable characters.",
    "official_skill_names": [
      "双雄"
    ],
    "full_intrinsic_signature": {
      "max_hp": 4,
      "gender": "male",
      "complete_skill_names": [
        "双雄"
      ],
      "personal_lord_skills": [],
      "mechanics": [
        {
          "id": "sgs.shuangxiong",
          "name": "双雄",
          "source_id": "mobile-yanliangwenchou",
          "optional": true,
          "timing": "Replace own normal draw-phase draw with one judgement. It is not an additional judgement after drawing and not a turn-start skill.",
          "quota": {
            "count": 1,
            "scope": "each_existing_draw_phase_replacement"
          },
          "cost": "Forego the normal draw action of this draw phase. No hand-card discard or HP cost. A skipped draw phase provides no opportunity.",
          "judgement": "Perform one ordinary judgement with all legitimate retrials. Obtain the final effective judgement card after result is fixed, not the initial top card and not two top cards. Preserve final result color as the conversion condition for this turn.",
          "conversion": "For rest of this turn, may use exactly one own HAND card of a color different from the fixed judgement result as Duel. May repeat with separate eligible cards as ordinary Duel permits; no intrinsic once-per-play-phase conversion quota. Equipment in hand is fine; equipment in E and cards in J are not.",
          "resolution": "Use ordinary single-material Duel: one other legal role, normally no distance restriction; target answers Slash first, then alternating responses. Ordinary Nullification can cancel Duel; damage source is the opposing successful Duel participant. No automatic damage, no Slash-use quota consumed by pure responses.",
          "not_skills": [
            "not draw-two/select-one variant",
            "no recovery of opposing response Slashes when taking Duel damage",
            "no compulsory activation",
            "no equipment-zone conversion",
            "no extra 1v1 or Guozhan rules"
          ],
          "source_support": [
            "mobile-yanliangwenchou",
            "mirror-neutral",
            "mirror-scroll",
            "mirror-gamecard",
            "mirror-virtual"
          ],
          "host_boundaries": [
            "H2",
            "H4",
            "H10",
            "H11"
          ]
        }
      ]
    },
    "source_faction_retained": true,
    "ui_requirements": [
      "Show source label, variant and snapshot date; separate official source wording from host compatibility decisions.",
      "Show complete HP and every intrinsic skill; no unimplemented hero placeholder in selectable roster.",
      "Use newly created art/icons or authorized assets; raw publisher HTML/art is research only.",
      "Draw-phase replace/decline prompt; final judgement color badge expiring at turn end; hand-only Duel conversion picker."
    ],
    "name": "颜良文丑",
    "skill_name": "双雄",
    "skill_desc": "双雄：可用一次判定替代整个摸牌阶段，并获得最终判定牌。本回合可将与判定结果颜色不同的手牌当普通决斗使用。",
    "skill_ids": [
      "sgs.shuangxiong"
    ],
    "source_skill_rules": [
      {
        "id": "sgs.shuangxiong",
        "name": "双雄",
        "source_id": "mobile-yanliangwenchou",
        "optional": true,
        "timing": "Replace own normal draw-phase draw with one judgement. It is not an additional judgement after drawing and not a turn-start skill.",
        "quota": {
          "count": 1,
          "scope": "each_existing_draw_phase_replacement"
        },
        "cost": "Forego the normal draw action of this draw phase. No hand-card discard or HP cost. A skipped draw phase provides no opportunity.",
        "judgement": "Perform one ordinary judgement with all legitimate retrials. Obtain the final effective judgement card after result is fixed, not the initial top card and not two top cards. Preserve final result color as the conversion condition for this turn.",
        "conversion": "For rest of this turn, may use exactly one own HAND card of a color different from the fixed judgement result as Duel. May repeat with separate eligible cards as ordinary Duel permits; no intrinsic once-per-play-phase conversion quota. Equipment in hand is fine; equipment in E and cards in J are not.",
        "resolution": "Use ordinary single-material Duel: one other legal role, normally no distance restriction; target answers Slash first, then alternating responses. Ordinary Nullification can cancel Duel; damage source is the opposing successful Duel participant. No automatic damage, no Slash-use quota consumed by pure responses.",
        "not_skills": [
          "not draw-two/select-one variant",
          "no recovery of opposing response Slashes when taking Duel damage",
          "no compulsory activation",
          "no equipment-zone conversion",
          "no extra 1v1 or Guozhan rules"
        ],
        "source_support": [
          "mobile-yanliangwenchou",
          "mirror-neutral",
          "mirror-scroll",
          "mirror-gamecard",
          "mirror-virtual"
        ],
        "host_boundaries": [
          "H2",
          "H4",
          "H10",
          "H11"
        ]
      }
    ],
    "source_game": "三国杀",
    "source_status": "verified",
    "production_integration_status": "production-integrated-tested-source-mechanics-current-client-unverified",
    "source_coverage": true,
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "颜良文丑",
    "source_variant": "基础身份版; official page snapshot 2026-10-15+explicit-host-H1-H11",
    "source_date": "2026-10-15 catalog snapshot; historical official guide when listed",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-40.html",
      "https://gltjk.com/sanguosha/rules/card/hero/neutral.html",
      "https://gltjk.com/sanguosha/rules/card/scroll.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://gltjk.com/sanguosha/rules/flow/virtual.html",
      "https://wiki.biligame.com/msgs/颜良文丑",
      "https://www.sanguosha.com/hero"
    ],
    "source_ids": [
      "mobile-yanliangwenchou",
      "mirror-neutral",
      "mirror-scroll",
      "mirror-gamecard",
      "mirror-virtual",
      "bwiki-yanliangwenchou",
      "ol-roster"
    ],
    "source_record_id": "sgs-mobile:hero-detail:40:identity:2026-10-15",
    "faction": "群",
    "gender_provenance": "same-product official historical guide for Xunyu; matching mobile secondary base-variant fields for remaining three",
    "source_evidence_tiers": [
      {
        "id": "mobile-yanliangwenchou",
        "tier": "official_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-40.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-neutral",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/neutral.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-scroll",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/scroll.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-virtual",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/virtual.html",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-yanliangwenchou",
        "tier": "secondary_same_product_mobile_community_wiki",
        "url": "https://wiki.biligame.com/msgs/颜良文丑",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "official_different_product_OL_metadata_crosscheck",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      }
    ],
    "source_evidence_note": "官网身份技能逐项核验；当前客户端未实测，次级资料仅补同变体元数据与分级边界。",
    "source_unknowns": [
      "当前2026移动客户端未实测；全部模式和跨作组合未逐项复现。"
    ],
    "hp_evidence": {
      "value": 4,
      "primary_mobile_explicit": false,
      "source_ids": [
        "bwiki-yanliangwenchou",
        "ol-roster"
      ],
      "current_mobile_client_verified": false
    },
    "aliases": [
      "三国杀颜良文丑",
      "颜良文丑·双雄",
      "yan-liang-wen-chou"
    ],
    "portrait_path": "./portraits-sgs-fire/yan-liang-wen-chou.svg",
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "adaptation_notes": "核心采用所列移动官网身份技能；H1–H11明确拼点材料时序、跨作毒、额外阶段与改色等本作兼容裁定，当前客户端未核验。",
    "host_compatibility_policies": [
      {
        "id": "H1",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use the shared rank-compare service with a true per-play-phase quota. Two hand IDs lock before simultaneous processing/reveal, larger effective rank wins and tie is not-win. Resolve skill result and nested effects while materials are still in processing; cleanup remaining comparison materials afterward exactly once. Cannot cancel after reveal. No AI access to opposing hidden cards. Record printed/effective ranks; comparison is not use/respond/player-discard. Generic historical support: mirror-compare; postcommit-death mobile edge remains declared."
      },
      {
        "id": "H2",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "All choices revalidate actual owner, zone, life, skill and target legality before cost commit. Cancel/stale validation consumes neither card nor quota. After real commit never refund or repeat moves due to duplicate callback. Real hand/equipment loss emits its normal exact-ID movement events; no fabricated loss from UI preview."
      },
      {
        "id": "H3",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use genuine normal-skill-damage events with compared role as source for Quhu. Complete dying/rescue before Jieming opportunities. If owner is finally dead, no draws; if rescued, process each actual damage point once. No cards manufactured for a deck shortage. Public HP may change between sequential opportunities; read live max HP and hand count."
      },
      {
        "id": "H4",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Extra-phase quotas use phase IDs and per-turn lasting effects use turn IDs. Copying/losing/regaining a skill does not refresh an already spent same-phase quota. Expire generated state at turn end/abort; do not grant extra phase or lord mode merely to activate the skills."
      },
      {
        "id": "H5",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Duanliang accepts effective-black physical basic/equipment cards in H/E, including enabled-pack poison only if classified basic. Check color through owner-aware effective face, not raw color; check original physical category, not a chained preview conversion. Do not use type!=trick. Equipped material causes real equipment-loss hooks once. Cross-game poison loss follows the actual move contract, not invented source XuHuang text."
      },
      {
        "id": "H6",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "For an equipped offensive horse used as Duanliang material, evaluate destination distance after excluding that material’s own distance benefit. Other retained equipment/hero distance modifiers still apply. Weapon attack range never substitutes for card distance. Use a non-mutating legality preview; reject out-of-range without removing the horse."
      },
      {
        "id": "H7",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use existing persistent delayed-card wrapper with underlying material ID. While in J it has Supply Shortage semantics for duplicate checks, targeting and removal; when obtained into hand or discarded it returns to original basic/equipment identity. No cloned second physical card and no lingering marker. Transfer rechecks destination delayed-card legality."
      },
      {
        "id": "H8",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Reuse host standard Supply Shortage Nullification and judgement windows rather than inventing a Duanliang-only schedule. A real delayed-card effect and a poison skip-draw mark may each request the same phase be skipped, but never skip two turns from one next-phase skip. No source card-count recipe is claimed."
      },
      {
        "id": "H9",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Represent each successful Tianyi comparison by an additive +1 use/+1 target effect token expiring at actual turn end. Per-phase activation resets only in a genuine new play phase. Winning again in another phase adds another token; any not-win token keeps a hard use-Slash ban until turn end, subsequent wins do not clear it. Compose additions with host baseline allowance/target-cap and lawful equipment; retain Infinity for unlimited uses. For an equipment floor/cap of3 targets, +1 Tianyi is4, not max(3,2). Ordinary host counters remain separate and are not refunded. This extra-phase/mixed-effect composition is a disclosed host policy, not directly tested official-client behavior."
      },
      {
        "id": "H10",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Shuangxiong binds the final effective judgement color to an actual turn ID. Material eligibility uses owner-aware effective color at use time. If copied color-changing skills later change the acquired judgement card, do not change the recorded result. A colorless/unknown-result judgement grants no conversion in this host until a source ruling exists; do not invent red/black. Multiple real draw-phase replacements in one turn create independent eligibility tokens (union), rather than silently overwriting an earlier one; this exotic edge is unverified current-client behavior."
      },
      {
        "id": "H11",
        "status": "proposed_host_policy_not_current_client_ruling",
        "rule": "Use shared draw-phase replacement arbitration. Only a draw phase that actually occurs can be replaced; Supply Shortage/poison skip does not run Shuangxiong. On accepting Shuangxiong suppress the normal phase draw, keep unrelated independent draw/obtain effects. No extra judgement per UI click. Obtain only the still-available final judgement material; never clone a card acquired by a different intervening effect. Exact copied-skill competition for that material is unresolved source behavior and must follow explicit host event ordering."
      }
    ],
    "personal_lord_skill_ids": []
  }
];
export const SGS_FIRE_DEFINITIONS=Object.freeze(definitions.map(row=>Object.freeze(row)));
