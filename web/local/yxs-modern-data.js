/** Two independent complete published YXS packets; source-ready, integration still testing. */
const definitions = [
  {
    "key": "zhang-qian",
    "id": "yxs.mobile.published.hero.zhang-qian.2026",
    "source_name": "张骞",
    "display_name": "张骞",
    "max_hp": 4,
    "source_hp_label": "血量",
    "starting_hp": 4,
    "starting_hp_basis": "H0 host initialization; no separately sourced startingHP field",
    "gender": null,
    "source_faction": null,
    "unverified_metadata_held": [
      "Dedicated native gameplay gender field",
      "Native 君/臣/民 faction field",
      "All-mode eligibility",
      "Exact live client build and rule revision"
    ],
    "host_gender_policy": "Unknown native and effective gender stays null; male-only interactions fail closed. No gender is inferred from original portraits.",
    "product": "腾讯英雄杀手游",
    "selected_source_version": {
      "snapshot": "2026-10-15",
      "publication": "2026-08-07",
      "label": "张骞现代手游官方发布基础规则",
      "client_build": null
    },
    "source_refs": [
      "primary-zhangqian"
    ],
    "normal_battle_mode_evidence": "Official guide explicitly discusses 常规3v3. No claim that every other mode permits the hero.",
    "intrinsic_skill_inventory": [
      "凿空"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "yxs.zaokong"
    ],
    "skills": [
      {
        "id": "yxs.zaokong",
        "name": "凿空",
        "type": "optional_target_branch_cancellation_distance_pair_draw",
        "timing": "When owner uses a qualifying damage card and designates targets, OR when owner is designated as a target of such a card; not when damage resolves.",
        "cost": "No card/HP cost; the triggering original card remains an actual use.",
        "quota": "Once for EACH of4 source card-name kinds in EACH actual global role-turn; outgoing/incoming branches share that kind allowance.",
        "native_qualifying_card_names": [
          "杀",
          "决斗",
          "烽火狼烟",
          "万箭齐发"
        ],
        "native_explicit_exclusions": [
          "借刀杀人",
          "手捧雷"
        ],
        "targets": "Choose ONE currently designated target of this card use. It can be self, ally or enemy. When owner is among an AOE target set, the chosen protected target can be somebody else.",
        "effects": [
          "Owner may decline. On acceptance this card use is ineffective against the one chosen target; other targets still resolve normally.",
          "After cancellation, chosen target draws1, then owner draws X where X is directed distance from owner to that target.",
          "If owner protects self, self distance0: owner receives only the first1 card, not1+1 and not2.",
          "No damage need occur; cancellation happens at target designation. A zero-damage immunity interaction is not required to earn the draws.",
          "A multi-target card never grants oneactivation per target. The same card-name kind allowance is shared between all qualifying uses and both trigger directions in that actual turn.",
          "Used杀 bucket does not block决斗/烽火/万箭 buckets. Declined use does not spend the budget; accepted effect does, even when the finite deck cannot supply all requested draws.",
          "No additional skill, awakening, limited marker, lord ability or star-based intrinsic branch is published in this complete hero section."
        ],
        "rule_text_paraphrase_zh": "自己用伤害牌指定目标，或自己成为伤害牌目标时，可挑该牌的一名目标免受该牌效果。先让其摸1张，再由自己按双方距离摸牌。每个角色回合内，杀、决斗、烽火狼烟、万箭齐发各只能发动1次。",
        "source_refs": [
          "primary-zhangqian"
        ],
        "source_locations": {
          "hp": "L39",
          "full_rule": "L45–47",
          "four_names_and_exclusions": "L62, L76",
          "self_distance": "L72",
          "other_AOE_target": "L82–86"
        },
        "intrinsic_unresolved": [],
        "integration_uncertainties_not_silently_native": [
          "Native order among overlapping redirect/cancellation skills is not established by article. H6 is a host order.",
          "Native distance resampling during exotic nested gain events is not separately established. H7 fixes the host reward snapshot."
        ]
      }
    ],
    "all_published_intrinsic_panels_read": true,
    "image_panels_read": false,
    "hp_and_intrinsic_rule_inventory_complete": true,
    "source_inventory_ready": true,
    "readiness": "source_ready_published_hp_and_complete_intrinsic_skill_with_explicit_host_contract",
    "native_metadata_complete": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "current_client_verified": false,
    "implementation_status": "tested",
    "runtime_validation_status": "passed",
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H8",
      "H9",
      "H10"
    ],
    "ui_requirements": [
      "卡面4血，固有技能列表恰为凿空；注明现代手游官方攻略日期/客户端未核验。",
      "显示本回合4个独立已用标记，进攻和被指定共用；不可画成每目标次数。",
      "一次可取消的目标选择提示，列原牌所有合法目标、本人至其距离与双方摸牌量；自己目标明确总共1张。",
      "不展示非目标、不把借刀或手捧雷作为触发项；同次牌只标记选中目标无效，其余目标继续。"
    ],
    "name": "张骞",
    "skill_name": "凿空",
    "skill_desc": "自己用伤害牌指定目标，或自己成为伤害牌目标时，可挑该牌的一名目标免受该牌效果。先让其摸1张，再由自己按双方距离摸牌。每个角色回合内，杀、决斗、烽火狼烟、万箭齐发各只能发动1次。",
    "source_game": "英雄杀",
    "source_label": "英雄杀现代手游官方发布",
    "source_variant": "modern-mobile-official-publication-2026-10-15",
    "source_status": "verified",
    "production_integration_status": "testing",
    "source_coverage": true,
    "source_character_name": "张骞",
    "source_gender": null,
    "faction": null,
    "gender_provenance": "unknown_native_field; no inferred host gender",
    "source_date": "2026-08-07",
    "source_publication_date": "2026-08-07",
    "source_publication_date_basis": "Year2026 corroborated by dated activity context in this release family; rendered page only shows month/day. No original-client build or historical archive asserted.",
    "source_read_date": "2026-10-16",
    "source_snapshot_date": "2026-10-15",
    "source_urls": [
      "https://www.taptap.cn/moment/834713369058477856"
    ],
    "source_evidence": [
      {
        "id": "primary-zhangqian",
        "url": "https://www.taptap.cn/moment/834713369058477856",
        "title": "英雄攻略丨 张骞攻略来了！（内含礼盒附赠CDK卡发货说明）",
        "displayed_author": "英雄杀官方版主",
        "tier": "official_product_moderator_primary_publication",
        "product": "腾讯英雄杀手游",
        "displayed_date": "08/07",
        "contextual_publication_date": "2026-08-07",
        "year_basis": "Year2026 corroborated by dated activity context in this release family; rendered page only shows month/day. No original-client build or historical archive asserted.",
        "read_date": "2026-10-16",
        "evidence_path": "evidence/readable-zhangqian.json",
        "evidence_sha256": "e395aabb6c45ee0db4e216a7aad03166a3b032c842438b81e76a0c390814b063",
        "verified_fields": {
          "hp": 4,
          "skills": [
            "凿空"
          ],
          "lines": "35–88",
          "normal_battle_evidence": "常规3v3 explicit at lines82–86"
        },
        "full_intrinsic_inventory_basis": "Read entire hero 技能 section in primary article, including each named ability and its explanatory paragraphs; 宝具推荐 section is separate. Images were not read successfully and are not silently counted as inspected.",
        "current_client_verified": false,
        "limitations": [
          "Readable extraction is substantive primary-page content. Separate HTTP200 files were WAF shells and are NOT article evidence.",
          "Live publication is not proof of exact content as of a historical date, newest client version, every mode pool, native gender/faction field, or all hero star/perk powers.",
          "No official artwork downloaded or included as game assets."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "yxs.zaokong",
        "name": "凿空",
        "type": "optional_target_branch_cancellation_distance_pair_draw",
        "timing": "When owner uses a qualifying damage card and designates targets, OR when owner is designated as a target of such a card; not when damage resolves.",
        "cost": "No card/HP cost; the triggering original card remains an actual use.",
        "quota": "Once for EACH of4 source card-name kinds in EACH actual global role-turn; outgoing/incoming branches share that kind allowance.",
        "native_qualifying_card_names": [
          "杀",
          "决斗",
          "烽火狼烟",
          "万箭齐发"
        ],
        "native_explicit_exclusions": [
          "借刀杀人",
          "手捧雷"
        ],
        "targets": "Choose ONE currently designated target of this card use. It can be self, ally or enemy. When owner is among an AOE target set, the chosen protected target can be somebody else.",
        "effects": [
          "Owner may decline. On acceptance this card use is ineffective against the one chosen target; other targets still resolve normally.",
          "After cancellation, chosen target draws1, then owner draws X where X is directed distance from owner to that target.",
          "If owner protects self, self distance0: owner receives only the first1 card, not1+1 and not2.",
          "No damage need occur; cancellation happens at target designation. A zero-damage immunity interaction is not required to earn the draws.",
          "A multi-target card never grants oneactivation per target. The same card-name kind allowance is shared between all qualifying uses and both trigger directions in that actual turn.",
          "Used杀 bucket does not block决斗/烽火/万箭 buckets. Declined use does not spend the budget; accepted effect does, even when the finite deck cannot supply all requested draws.",
          "No additional skill, awakening, limited marker, lord ability or star-based intrinsic branch is published in this complete hero section."
        ],
        "rule_text_paraphrase_zh": "自己用伤害牌指定目标，或自己成为伤害牌目标时，可挑该牌的一名目标免受该牌效果。先让其摸1张，再由自己按双方距离摸牌。每个角色回合内，杀、决斗、烽火狼烟、万箭齐发各只能发动1次。",
        "source_refs": [
          "primary-zhangqian"
        ],
        "source_locations": {
          "hp": "L39",
          "full_rule": "L45–47",
          "four_names_and_exclusions": "L62, L76",
          "self_distance": "L72",
          "other_AOE_target": "L82–86"
        },
        "intrinsic_unresolved": [],
        "integration_uncertainties_not_silently_native": [
          "Native order among overlapping redirect/cancellation skills is not established by article. H6 is a host order.",
          "Native distance resampling during exotic nested gain events is not separately established. H7 fixes the host reward snapshot."
        ]
      }
    ],
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization_and_unverified_metadata",
        "rule": "Propose startingHP=maxHP in the host. Published 血量 establishes the requested base HP value; no separate startingHP field is claimed. Native faction and dedicated gameplay-gender metadata were not exposed by these text pages: leave source fields null. A host may explicitly label male gender as a historical-identity adaptation for these two male historical figures, but must not report that field as client/card verified."
      },
      {
        "id": "H1",
        "category": "host_integrity",
        "rule": "Stable actor/use/turn/event/material identities; revalidate legal window, effective complete skill, materials and target snapshot before commit. Cancel/stale/illegal request before commit pays nothing and spends no quota. Commit once before awaited nested effects; retries return the same receipt. Save stage markers, not just final totals."
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "Actual death blocks new activations; resolve already committed use/effect through the engine standard lifecycle. No nonexistent draw recipient, no fabricated card, no duplicate draw on reload. Deferred prompts are tied to one original task and resume/replay never silently retries a paid action."
      },
      {
        "id": "H3",
        "category": "host_skill_copy",
        "rule": "Use effective full skill descriptor and stable player identity. Losing and reacquiring a skill must not refresh same-turn budgets or existing card-use history. A copied skill does not copy source HP/faction/gender unless an independently authorized transformation says so. No invented bonus/perk skills."
      },
      {
        "id": "H4",
        "category": "host_card_alias_and_pack_scope",
        "rule": "Output candidates are the active host card-function catalog filtered to non-delayed tricks, excluding Nullification. Include supported cross-game tricks such as火攻/铁索连环 and enabled 用间 tricks only as disclosed host extensions. Never add unsupported functions or infer all modern YXS card types. Exact source aliases already deduplicated in the host share ONE canonical name history; different mechanisms never collapse by similar display text. Supplied card rules retain their own targets/range/limits/counterspell behavior."
      },
      {
        "id": "H5",
        "category": "host_slash_family",
        "rule": "张骞 native four buckets are杀/决斗/烽火狼烟/万箭齐发. Map all host Slash variants to the same杀 bucket, including fire/thunder/血杀/毒杀/刺杀, as an explicit mixed-game extension. Native exclusions借刀杀人/手捧雷 remain exclusions. Host火攻 and other damaging tricks are NOT added to凿空. A real Slash generated by借刀 is a separate qualifying Slash use, never the借刀 card itself."
      },
      {
        "id": "H6",
        "category": "host_target_window_and_conflict_order",
        "rule": "Provide one aggregate immutable target-designation window per committed card use, before any target effect/response. Dispatch all eligible effective凿空 owners in deterministic action order. Owner qualifies once by being card user OR target; do not multiply offers per target. Cross-game redirect/protection precedence must be explicit and tested; do not advertise this engine order as verified native-client interaction. Branch cancellation affects only selected target for this one use. A target already cancelled cannot be selected again for additional reward."
      },
      {
        "id": "H7",
        "category": "host_distance_snapshot",
        "rule": "At accepted凿空 commitment snapshot directed distance from skill owner to selected target, applying engine distance modifiers but not weapon attack range; self distance is exactly0 despite existing distance_between clamp. Hold this X through paired draw callbacks so cross-game gain effects cannot alter a committed reward. Snapshot timing under exotic native nested effects is not separately client-certified."
      },
      {
        "id": "H8",
        "category": "host_conversion_composition",
        "rule": "画圣 consumes a trusted legal effective Slash resource plan without first USEing that Slash. Physical hand Slash is the primary closed path. A complete compatible host武圣/龙胆/傲剑/丈八 or other Slash-producing capability may supply a conversion plan as a named host extension; validate its actual materials/costs independently. Never use a virtual object as a physical cost, never consume original materials twice, never bypass source skill gates, never grant those capabilities merely for selecting吴道子. Native宝具 composition details remain held pending primary evidence and are not implemented by this packet."
      },
      {
        "id": "H9",
        "category": "host_conversion_face_and_recast",
        "rule": "Converted output is a real committed trick USE with its final effective face, source_skill_id and physical provenance. One physical material retains its effective suit/rank; multi-material metadata follows existing virtual-card policy, explicitly host-only. No intermediate Slash use/quota/history. Host铁索转换 is use-only, not recast; source says transform and play the trick, not replace a skill cost with recast."
      },
      {
        "id": "H10",
        "category": "host_ui_ai_privacy",
        "rule": "Original local card visuals/text UI only; no copyrighted official art reuse. Human owns optional decisions; AI may decline or optimize only with visible/public information and its own hand. Public log shows committed outcomes; hidden cards/materials stay private before commitment. Disabled buttons explain legal cause; metadata lists published source version and current_client_verified=false."
      }
    ],
    "adaptation_decisions": [
      {
        "id": "H0",
        "category": "host_initialization_and_unverified_metadata",
        "rule": "Propose startingHP=maxHP in the host. Published 血量 establishes the requested base HP value; no separate startingHP field is claimed. Native faction and dedicated gameplay-gender metadata were not exposed by these text pages: leave source fields null. A host may explicitly label male gender as a historical-identity adaptation for these two male historical figures, but must not report that field as client/card verified."
      },
      {
        "id": "H1",
        "category": "host_integrity",
        "rule": "Stable actor/use/turn/event/material identities; revalidate legal window, effective complete skill, materials and target snapshot before commit. Cancel/stale/illegal request before commit pays nothing and spends no quota. Commit once before awaited nested effects; retries return the same receipt. Save stage markers, not just final totals."
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "Actual death blocks new activations; resolve already committed use/effect through the engine standard lifecycle. No nonexistent draw recipient, no fabricated card, no duplicate draw on reload. Deferred prompts are tied to one original task and resume/replay never silently retries a paid action."
      },
      {
        "id": "H3",
        "category": "host_skill_copy",
        "rule": "Use effective full skill descriptor and stable player identity. Losing and reacquiring a skill must not refresh same-turn budgets or existing card-use history. A copied skill does not copy source HP/faction/gender unless an independently authorized transformation says so. No invented bonus/perk skills."
      },
      {
        "id": "H4",
        "category": "host_card_alias_and_pack_scope",
        "rule": "Output candidates are the active host card-function catalog filtered to non-delayed tricks, excluding Nullification. Include supported cross-game tricks such as火攻/铁索连环 and enabled 用间 tricks only as disclosed host extensions. Never add unsupported functions or infer all modern YXS card types. Exact source aliases already deduplicated in the host share ONE canonical name history; different mechanisms never collapse by similar display text. Supplied card rules retain their own targets/range/limits/counterspell behavior."
      },
      {
        "id": "H5",
        "category": "host_slash_family",
        "rule": "张骞 native four buckets are杀/决斗/烽火狼烟/万箭齐发. Map all host Slash variants to the same杀 bucket, including fire/thunder/血杀/毒杀/刺杀, as an explicit mixed-game extension. Native exclusions借刀杀人/手捧雷 remain exclusions. Host火攻 and other damaging tricks are NOT added to凿空. A real Slash generated by借刀 is a separate qualifying Slash use, never the借刀 card itself."
      },
      {
        "id": "H6",
        "category": "host_target_window_and_conflict_order",
        "rule": "Provide one aggregate immutable target-designation window per committed card use, before any target effect/response. Dispatch all eligible effective凿空 owners in deterministic action order. Owner qualifies once by being card user OR target; do not multiply offers per target. Cross-game redirect/protection precedence must be explicit and tested; do not advertise this engine order as verified native-client interaction. Branch cancellation affects only selected target for this one use. A target already cancelled cannot be selected again for additional reward."
      },
      {
        "id": "H7",
        "category": "host_distance_snapshot",
        "rule": "At accepted凿空 commitment snapshot directed distance from skill owner to selected target, applying engine distance modifiers but not weapon attack range; self distance is exactly0 despite existing distance_between clamp. Hold this X through paired draw callbacks so cross-game gain effects cannot alter a committed reward. Snapshot timing under exotic native nested effects is not separately client-certified."
      },
      {
        "id": "H8",
        "category": "host_conversion_composition",
        "rule": "画圣 consumes a trusted legal effective Slash resource plan without first USEing that Slash. Physical hand Slash is the primary closed path. A complete compatible host武圣/龙胆/傲剑/丈八 or other Slash-producing capability may supply a conversion plan as a named host extension; validate its actual materials/costs independently. Never use a virtual object as a physical cost, never consume original materials twice, never bypass source skill gates, never grant those capabilities merely for selecting吴道子. Native宝具 composition details remain held pending primary evidence and are not implemented by this packet."
      },
      {
        "id": "H9",
        "category": "host_conversion_face_and_recast",
        "rule": "Converted output is a real committed trick USE with its final effective face, source_skill_id and physical provenance. One physical material retains its effective suit/rank; multi-material metadata follows existing virtual-card policy, explicitly host-only. No intermediate Slash use/quota/history. Host铁索转换 is use-only, not recast; source says transform and play the trick, not replace a skill cost with recast."
      },
      {
        "id": "H10",
        "category": "host_ui_ai_privacy",
        "rule": "Original local card visuals/text UI only; no copyrighted official art reuse. Human owns optional decisions; AI may decline or optimize only with visible/public information and its own hand. Public log shows committed outcomes; hidden cards/materials stay private before commitment. Disabled buttons explain legal cause; metadata lists published source version and current_client_verified=false."
      }
    ],
    "starting_hp_direct_source_value": null,
    "aliases": [
      "英雄杀张骞",
      "现代手游张骞",
      "zhangqian",
      "zhang-qian"
    ],
    "portrait_path": "./portraits-yxs-modern/zhang-qian.svg",
    "artwork_original": true,
    "native_perks_implemented": false,
    "source_unknowns": [
      {
        "field": "native_metadata",
        "handling": "原生专用性别、君臣民字段与全部模式池未核验，字段保持未知；不按历史人物或原创立绘补写。"
      },
      {
        "field": "starting_hp",
        "handling": "来源血量作为最大体力；独立初始体力字段未知，满体力开局属于H0宿主初始化。"
      },
      {
        "field": "current_client",
        "handling": "选取2026官方发布基础规则，未实测当前客户端；原生宝具与升星子系统不在本包实现。"
      }
    ],
    "adaptation_notes": "H0–H10为明示江湖适配：满体力开局、真实全回合历史、聚合指定目标窗口、有向距离提交快照、跨作杀资源与当前启用锦囊目录、事务与公开日志。原生性别／君臣民字段未知；不实现或赠送宝具、升星、羁绊与皮肤。所选官方发布完整固有技能与血量已核对，未核验当前客户端及所有模式。"
  },
  {
    "key": "wu-dao-zi",
    "id": "yxs.mobile.published.hero.wu-dao-zi.2026",
    "source_name": "吴道子",
    "display_name": "吴道子",
    "max_hp": 3,
    "source_hp_label": "血量",
    "starting_hp": 3,
    "starting_hp_basis": "H0 host initialization; no separately sourced startingHP field",
    "gender": null,
    "source_faction": null,
    "unverified_metadata_held": [
      "Dedicated native gameplay gender field",
      "Native 君/臣/民 faction field",
      "All-mode eligibility",
      "Exact live client build and rule revision"
    ],
    "host_gender_policy": "Unknown native and effective gender stays null; male-only interactions fail closed. No gender is inferred from original portraits.",
    "product": "腾讯英雄杀手游",
    "selected_source_version": {
      "snapshot": "2026-10-15",
      "publication": "2026-02-02",
      "label": "吴道子现代手游官方发布基础规则",
      "client_build": null
    },
    "source_refs": [
      "primary-wudaozi"
    ],
    "normal_battle_mode_evidence": "Ownable hero is explicitly announced independently of reward path. Article does not enumerate native classic/3v3 eligibility; do not infer it from the 唐突PVE shop.",
    "intrinsic_skill_inventory": [
      "画圣"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "skill_ids": [
      "yxs.huasheng"
    ],
    "skills": [
      {
        "id": "yxs.huasheng",
        "name": "画圣",
        "type": "optional_active_slash_resource_to_unused_non_delayed_trick",
        "timing": "Own play-phase action window; not any response window.",
        "cost": "One legal effective Slash resource to be converted and played as the selected trick; physical hand Slash is the directly evidenced basic path.",
        "quota": "No independent once-phase/turn activation cap. Each selected output name must NOT have been used by this actor earlier in the same whole turn.",
        "targets": "Exactly the target set, target count and restrictions of the selected trick function; not forced to one enemy.",
        "effects": [
          "Choose a non-delayed trick that owner has not already USED this turn, with Nullification always excluded.",
          "The history predicate covers the owner's actual used names, regardless of whether earlier use was natural,画圣, another conversion, copied, or later countered. It is not a history of画圣 activations only.",
          "Earlier uses by other roles do not block owner. A new play phase inside the same turn does not clear history. A fresh actual turn does.",
          "Material is paid once as the resource of the final trick use. Do not first perform a Slash use, consume Slash attack quota, ask for闪, or trigger Slash-use hooks.",
          "The final function obeys normal legal targeting, trick restrictions, counterspell windows and effect resolution. It can be countered or have no ultimate effect and still counts as used.",
          "A normal later physical trick use of a name already converted is not prohibited by画圣. The limitation applies only when choosing an output for this skill.",
          "Mere discard, response, recast, reveal, transfer or a canceled precommit choice is not a USE of that trick name. A canceled or illegal conversion has no payment/history.",
          "No minimum/current Slash attack allowance is required to convert; the final action is a trick use. A blanket card-use ban still applies.",
          "No extra innate skill, lord ability, granted/acquired skill or star/perk branch is in the complete primary hero section. Native宝具 APIs are separate, never silently granted."
        ],
        "rule_text_paraphrase_zh": "自己的出牌阶段，可把可用的杀作为材料，使用一种本回合本人还没用过的非延时锦囊；无懈可击始终不能选。",
        "source_refs": [
          "primary-wudaozi"
        ],
        "source_locations": {
          "hp": "L80",
          "full_rule": "L86–88",
          "hero_and_star_boundary": "L72–92"
        },
        "intrinsic_unresolved": [],
        "native_perk_interaction_held": [
          {
            "id": "W-NATIVE-PERK-INPUT",
            "question": "Precise native宝具傲剑/战神 converted-Slash composition and all allowed input material zones. Primary launch does not explicitly qualify them; only a secondary repost elaborates.",
            "status": "held_native_perk_subsystem",
            "must_not_do": [
              "Reject every converted Slash solely because it is not physically printed杀.",
              "Treat raw hand/equipment cards as杀 without an actually owned legal provider.",
              "Claim native宝具 implementation or client certification from this packet."
            ],
            "basic_intrinsic_rule_impact": "Use an effective-Slash input abstraction; implement primary physical hand path and separately disclosed host combinations. Do not add a physical-only intrinsic restriction."
          }
        ],
        "integration_uncertainties_not_silently_native": [
          "Native all-card-name catalog and current-mode availability not enumerated by launch; H4 bounds the host compatibility catalog.",
          "Native gender/faction metadata remains null; H0 adaptation must be separately disclosed."
        ]
      }
    ],
    "all_published_intrinsic_panels_read": true,
    "image_panels_read": false,
    "hp_and_intrinsic_rule_inventory_complete": true,
    "source_inventory_ready": true,
    "readiness": "source_ready_published_hp_and_complete_intrinsic_skill_with_explicit_host_contract",
    "native_metadata_complete": false,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "current_client_verified": false,
    "implementation_status": "tested",
    "runtime_validation_status": "passed",
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H8",
      "H9",
      "H10"
    ],
    "ui_requirements": [
      "卡面3血，只列画圣；星级、宝具与皮肤不并入固有技能。",
      "依次选择合法杀资源方案、未用过的非延时锦囊、该锦囊自己的全部必要目标；任意提交前取消不付费。",
      "已用名字显示禁用原因；无懈、延时锦囊不可选；支持牌包改变时输出池按当前对局配置筛选。",
      "选择材料仍私密，提交后记录最终锦囊名和画圣来源；历史UI区分最终用牌与实体杀材料。"
    ],
    "name": "吴道子",
    "skill_name": "画圣",
    "skill_desc": "自己的出牌阶段，可把可用的杀作为材料，使用一种本回合本人还没用过的非延时锦囊；无懈可击始终不能选。",
    "source_game": "英雄杀",
    "source_label": "英雄杀现代手游官方发布",
    "source_variant": "modern-mobile-official-publication-2026-10-15",
    "source_status": "verified",
    "production_integration_status": "testing",
    "source_coverage": true,
    "source_character_name": "吴道子",
    "source_gender": null,
    "faction": null,
    "gender_provenance": "unknown_native_field; no inferred host gender",
    "source_date": "2026-02-02",
    "source_publication_date": "2026-02-02",
    "source_publication_date_basis": "Year2026 corroborated by dated activity context in this release family; rendered page only shows month/day. No original-client build or historical archive asserted.",
    "source_read_date": "2026-10-16",
    "source_snapshot_date": "2026-10-15",
    "source_urls": [
      "https://www.taptap.cn/moment/767485734243272517"
    ],
    "source_evidence": [
      {
        "id": "primary-wudaozi",
        "url": "https://www.taptap.cn/moment/767485734243272517",
        "title": "新英雄吴道子首发五星元神免费送！多款永久皮肤元宝等好礼大放送",
        "displayed_author": "coco官方版主",
        "tier": "official_product_moderator_primary_publication",
        "product": "腾讯英雄杀手游",
        "displayed_date": "02/02",
        "contextual_publication_date": "2026-02-02",
        "year_basis": "Year2026 corroborated by dated activity context in this release family; rendered page only shows month/day. No original-client build or historical archive asserted.",
        "read_date": "2026-10-16",
        "evidence_path": "evidence/readable-wudaozi.json",
        "evidence_sha256": "734f36487ce9fb307b2db76c4015057068a6bcda2c2161e38dae246b62c5376e",
        "verified_fields": {
          "hp": 3,
          "skills": [
            "画圣"
          ],
          "lines": "72–92",
          "normal_battle_evidence": "Ownable hero/intrinsic battle skill explicit. Exact normal-mode eligibility not enumerated; do not claim all identity/3v3 pools."
        },
        "full_intrinsic_inventory_basis": "Read entire hero 技能 section in primary article, including each named ability and its explanatory paragraphs; 宝具推荐 section is separate. Images were not read successfully and are not silently counted as inspected.",
        "current_client_verified": false,
        "limitations": [
          "Readable extraction is substantive primary-page content. Separate HTTP200 files were WAF shells and are NOT article evidence.",
          "Live publication is not proof of exact content as of a historical date, newest client version, every mode pool, native gender/faction field, or all hero star/perk powers.",
          "No official artwork downloaded or included as game assets."
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "yxs.huasheng",
        "name": "画圣",
        "type": "optional_active_slash_resource_to_unused_non_delayed_trick",
        "timing": "Own play-phase action window; not any response window.",
        "cost": "One legal effective Slash resource to be converted and played as the selected trick; physical hand Slash is the directly evidenced basic path.",
        "quota": "No independent once-phase/turn activation cap. Each selected output name must NOT have been used by this actor earlier in the same whole turn.",
        "targets": "Exactly the target set, target count and restrictions of the selected trick function; not forced to one enemy.",
        "effects": [
          "Choose a non-delayed trick that owner has not already USED this turn, with Nullification always excluded.",
          "The history predicate covers the owner's actual used names, regardless of whether earlier use was natural,画圣, another conversion, copied, or later countered. It is not a history of画圣 activations only.",
          "Earlier uses by other roles do not block owner. A new play phase inside the same turn does not clear history. A fresh actual turn does.",
          "Material is paid once as the resource of the final trick use. Do not first perform a Slash use, consume Slash attack quota, ask for闪, or trigger Slash-use hooks.",
          "The final function obeys normal legal targeting, trick restrictions, counterspell windows and effect resolution. It can be countered or have no ultimate effect and still counts as used.",
          "A normal later physical trick use of a name already converted is not prohibited by画圣. The limitation applies only when choosing an output for this skill.",
          "Mere discard, response, recast, reveal, transfer or a canceled precommit choice is not a USE of that trick name. A canceled or illegal conversion has no payment/history.",
          "No minimum/current Slash attack allowance is required to convert; the final action is a trick use. A blanket card-use ban still applies.",
          "No extra innate skill, lord ability, granted/acquired skill or star/perk branch is in the complete primary hero section. Native宝具 APIs are separate, never silently granted."
        ],
        "rule_text_paraphrase_zh": "自己的出牌阶段，可把可用的杀作为材料，使用一种本回合本人还没用过的非延时锦囊；无懈可击始终不能选。",
        "source_refs": [
          "primary-wudaozi"
        ],
        "source_locations": {
          "hp": "L80",
          "full_rule": "L86–88",
          "hero_and_star_boundary": "L72–92"
        },
        "intrinsic_unresolved": [],
        "native_perk_interaction_held": [
          {
            "id": "W-NATIVE-PERK-INPUT",
            "question": "Precise native宝具傲剑/战神 converted-Slash composition and all allowed input material zones. Primary launch does not explicitly qualify them; only a secondary repost elaborates.",
            "status": "held_native_perk_subsystem",
            "must_not_do": [
              "Reject every converted Slash solely because it is not physically printed杀.",
              "Treat raw hand/equipment cards as杀 without an actually owned legal provider.",
              "Claim native宝具 implementation or client certification from this packet."
            ],
            "basic_intrinsic_rule_impact": "Use an effective-Slash input abstraction; implement primary physical hand path and separately disclosed host combinations. Do not add a physical-only intrinsic restriction."
          }
        ],
        "integration_uncertainties_not_silently_native": [
          "Native all-card-name catalog and current-mode availability not enumerated by launch; H4 bounds the host compatibility catalog.",
          "Native gender/faction metadata remains null; H0 adaptation must be separately disclosed."
        ]
      }
    ],
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization_and_unverified_metadata",
        "rule": "Propose startingHP=maxHP in the host. Published 血量 establishes the requested base HP value; no separate startingHP field is claimed. Native faction and dedicated gameplay-gender metadata were not exposed by these text pages: leave source fields null. A host may explicitly label male gender as a historical-identity adaptation for these two male historical figures, but must not report that field as client/card verified."
      },
      {
        "id": "H1",
        "category": "host_integrity",
        "rule": "Stable actor/use/turn/event/material identities; revalidate legal window, effective complete skill, materials and target snapshot before commit. Cancel/stale/illegal request before commit pays nothing and spends no quota. Commit once before awaited nested effects; retries return the same receipt. Save stage markers, not just final totals."
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "Actual death blocks new activations; resolve already committed use/effect through the engine standard lifecycle. No nonexistent draw recipient, no fabricated card, no duplicate draw on reload. Deferred prompts are tied to one original task and resume/replay never silently retries a paid action."
      },
      {
        "id": "H3",
        "category": "host_skill_copy",
        "rule": "Use effective full skill descriptor and stable player identity. Losing and reacquiring a skill must not refresh same-turn budgets or existing card-use history. A copied skill does not copy source HP/faction/gender unless an independently authorized transformation says so. No invented bonus/perk skills."
      },
      {
        "id": "H4",
        "category": "host_card_alias_and_pack_scope",
        "rule": "Output candidates are the active host card-function catalog filtered to non-delayed tricks, excluding Nullification. Include supported cross-game tricks such as火攻/铁索连环 and enabled 用间 tricks only as disclosed host extensions. Never add unsupported functions or infer all modern YXS card types. Exact source aliases already deduplicated in the host share ONE canonical name history; different mechanisms never collapse by similar display text. Supplied card rules retain their own targets/range/limits/counterspell behavior."
      },
      {
        "id": "H5",
        "category": "host_slash_family",
        "rule": "张骞 native four buckets are杀/决斗/烽火狼烟/万箭齐发. Map all host Slash variants to the same杀 bucket, including fire/thunder/血杀/毒杀/刺杀, as an explicit mixed-game extension. Native exclusions借刀杀人/手捧雷 remain exclusions. Host火攻 and other damaging tricks are NOT added to凿空. A real Slash generated by借刀 is a separate qualifying Slash use, never the借刀 card itself."
      },
      {
        "id": "H6",
        "category": "host_target_window_and_conflict_order",
        "rule": "Provide one aggregate immutable target-designation window per committed card use, before any target effect/response. Dispatch all eligible effective凿空 owners in deterministic action order. Owner qualifies once by being card user OR target; do not multiply offers per target. Cross-game redirect/protection precedence must be explicit and tested; do not advertise this engine order as verified native-client interaction. Branch cancellation affects only selected target for this one use. A target already cancelled cannot be selected again for additional reward."
      },
      {
        "id": "H7",
        "category": "host_distance_snapshot",
        "rule": "At accepted凿空 commitment snapshot directed distance from skill owner to selected target, applying engine distance modifiers but not weapon attack range; self distance is exactly0 despite existing distance_between clamp. Hold this X through paired draw callbacks so cross-game gain effects cannot alter a committed reward. Snapshot timing under exotic native nested effects is not separately client-certified."
      },
      {
        "id": "H8",
        "category": "host_conversion_composition",
        "rule": "画圣 consumes a trusted legal effective Slash resource plan without first USEing that Slash. Physical hand Slash is the primary closed path. A complete compatible host武圣/龙胆/傲剑/丈八 or other Slash-producing capability may supply a conversion plan as a named host extension; validate its actual materials/costs independently. Never use a virtual object as a physical cost, never consume original materials twice, never bypass source skill gates, never grant those capabilities merely for selecting吴道子. Native宝具 composition details remain held pending primary evidence and are not implemented by this packet."
      },
      {
        "id": "H9",
        "category": "host_conversion_face_and_recast",
        "rule": "Converted output is a real committed trick USE with its final effective face, source_skill_id and physical provenance. One physical material retains its effective suit/rank; multi-material metadata follows existing virtual-card policy, explicitly host-only. No intermediate Slash use/quota/history. Host铁索转换 is use-only, not recast; source says transform and play the trick, not replace a skill cost with recast."
      },
      {
        "id": "H10",
        "category": "host_ui_ai_privacy",
        "rule": "Original local card visuals/text UI only; no copyrighted official art reuse. Human owns optional decisions; AI may decline or optimize only with visible/public information and its own hand. Public log shows committed outcomes; hidden cards/materials stay private before commitment. Disabled buttons explain legal cause; metadata lists published source version and current_client_verified=false."
      }
    ],
    "adaptation_decisions": [
      {
        "id": "H0",
        "category": "host_initialization_and_unverified_metadata",
        "rule": "Propose startingHP=maxHP in the host. Published 血量 establishes the requested base HP value; no separate startingHP field is claimed. Native faction and dedicated gameplay-gender metadata were not exposed by these text pages: leave source fields null. A host may explicitly label male gender as a historical-identity adaptation for these two male historical figures, but must not report that field as client/card verified."
      },
      {
        "id": "H1",
        "category": "host_integrity",
        "rule": "Stable actor/use/turn/event/material identities; revalidate legal window, effective complete skill, materials and target snapshot before commit. Cancel/stale/illegal request before commit pays nothing and spends no quota. Commit once before awaited nested effects; retries return the same receipt. Save stage markers, not just final totals."
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "Actual death blocks new activations; resolve already committed use/effect through the engine standard lifecycle. No nonexistent draw recipient, no fabricated card, no duplicate draw on reload. Deferred prompts are tied to one original task and resume/replay never silently retries a paid action."
      },
      {
        "id": "H3",
        "category": "host_skill_copy",
        "rule": "Use effective full skill descriptor and stable player identity. Losing and reacquiring a skill must not refresh same-turn budgets or existing card-use history. A copied skill does not copy source HP/faction/gender unless an independently authorized transformation says so. No invented bonus/perk skills."
      },
      {
        "id": "H4",
        "category": "host_card_alias_and_pack_scope",
        "rule": "Output candidates are the active host card-function catalog filtered to non-delayed tricks, excluding Nullification. Include supported cross-game tricks such as火攻/铁索连环 and enabled 用间 tricks only as disclosed host extensions. Never add unsupported functions or infer all modern YXS card types. Exact source aliases already deduplicated in the host share ONE canonical name history; different mechanisms never collapse by similar display text. Supplied card rules retain their own targets/range/limits/counterspell behavior."
      },
      {
        "id": "H5",
        "category": "host_slash_family",
        "rule": "张骞 native four buckets are杀/决斗/烽火狼烟/万箭齐发. Map all host Slash variants to the same杀 bucket, including fire/thunder/血杀/毒杀/刺杀, as an explicit mixed-game extension. Native exclusions借刀杀人/手捧雷 remain exclusions. Host火攻 and other damaging tricks are NOT added to凿空. A real Slash generated by借刀 is a separate qualifying Slash use, never the借刀 card itself."
      },
      {
        "id": "H6",
        "category": "host_target_window_and_conflict_order",
        "rule": "Provide one aggregate immutable target-designation window per committed card use, before any target effect/response. Dispatch all eligible effective凿空 owners in deterministic action order. Owner qualifies once by being card user OR target; do not multiply offers per target. Cross-game redirect/protection precedence must be explicit and tested; do not advertise this engine order as verified native-client interaction. Branch cancellation affects only selected target for this one use. A target already cancelled cannot be selected again for additional reward."
      },
      {
        "id": "H7",
        "category": "host_distance_snapshot",
        "rule": "At accepted凿空 commitment snapshot directed distance from skill owner to selected target, applying engine distance modifiers but not weapon attack range; self distance is exactly0 despite existing distance_between clamp. Hold this X through paired draw callbacks so cross-game gain effects cannot alter a committed reward. Snapshot timing under exotic native nested effects is not separately client-certified."
      },
      {
        "id": "H8",
        "category": "host_conversion_composition",
        "rule": "画圣 consumes a trusted legal effective Slash resource plan without first USEing that Slash. Physical hand Slash is the primary closed path. A complete compatible host武圣/龙胆/傲剑/丈八 or other Slash-producing capability may supply a conversion plan as a named host extension; validate its actual materials/costs independently. Never use a virtual object as a physical cost, never consume original materials twice, never bypass source skill gates, never grant those capabilities merely for selecting吴道子. Native宝具 composition details remain held pending primary evidence and are not implemented by this packet."
      },
      {
        "id": "H9",
        "category": "host_conversion_face_and_recast",
        "rule": "Converted output is a real committed trick USE with its final effective face, source_skill_id and physical provenance. One physical material retains its effective suit/rank; multi-material metadata follows existing virtual-card policy, explicitly host-only. No intermediate Slash use/quota/history. Host铁索转换 is use-only, not recast; source says transform and play the trick, not replace a skill cost with recast."
      },
      {
        "id": "H10",
        "category": "host_ui_ai_privacy",
        "rule": "Original local card visuals/text UI only; no copyrighted official art reuse. Human owns optional decisions; AI may decline or optimize only with visible/public information and its own hand. Public log shows committed outcomes; hidden cards/materials stay private before commitment. Disabled buttons explain legal cause; metadata lists published source version and current_client_verified=false."
      }
    ],
    "starting_hp_direct_source_value": null,
    "aliases": [
      "英雄杀吴道子",
      "现代手游吴道子",
      "wudaozi",
      "wu-dao-zi"
    ],
    "portrait_path": "./portraits-yxs-modern/wu-dao-zi.svg",
    "artwork_original": true,
    "native_perks_implemented": false,
    "source_unknowns": [
      {
        "field": "native_metadata",
        "handling": "原生专用性别、君臣民字段与全部模式池未核验，字段保持未知；不按历史人物或原创立绘补写。"
      },
      {
        "field": "starting_hp",
        "handling": "来源血量作为最大体力；独立初始体力字段未知，满体力开局属于H0宿主初始化。"
      },
      {
        "field": "current_client",
        "handling": "选取2026官方发布基础规则，未实测当前客户端；原生宝具与升星子系统不在本包实现。"
      }
    ],
    "adaptation_notes": "H0–H10为明示江湖适配：满体力开局、真实全回合历史、聚合指定目标窗口、有向距离提交快照、跨作杀资源与当前启用锦囊目录、事务与公开日志。原生性别／君臣民字段未知；不实现或赠送宝具、升星、羁绊与皮肤。所选官方发布完整固有技能与血量已核对，未核验当前客户端及所有模式。"
  }
];
const deepFreeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(deepFreeze);Object.freeze(value);}return value;};
export const YXS_MODERN_DEFINITIONS=deepFreeze(definitions);
