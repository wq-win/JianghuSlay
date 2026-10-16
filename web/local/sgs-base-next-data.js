/** Base identity catalog snapshot plus explicitly tiered historical references.
 * Implementation flags are promoted only after integration acceptance. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.sima-yi",
    "name": "司马懿",
    "display_name": "司马懿",
    "max_hp": 3,
    "skill_name": "反馈 / 鬼才",
    "skill_desc": "反馈：受到一次伤害后可获得来源的1张手牌或装备。鬼才：判定生效前可用1张手牌替换判定牌；每次判定一次机会。",
    "skill_ids": [
      "sgs.fankui",
      "sgs.guicai"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "魏",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated_tested",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "司马懿",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-16.html",
      "https://www.sanguosha.com/hero",
      "https://wiki.biligame.com/msgs/司马懿",
      "https://www.sanguosha.com.tw/newsinfo_921.html",
      "https://www.sanguosha.cn/pc/news-detail-1377.html",
      "https://gltjk.com/sanguosha/rules/flow/judge.html",
      "https://gltjk.com/sanguosha/rules/glossary/cardinfo.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://gltjk.com/sanguosha/rules/flow/death.html",
      "https://gltjk.com/sanguosha/rules/flow/damage.html",
      "https://sanguosha.fandom.com/zh/wiki/%E5%8F%B8%E9%A9%AC%E6%87%BF?variant=zh-hans"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:16:identity:2026-10-15",
    "source_ids": [
      "mobile-sima",
      "ol-roster",
      "bwiki-sima",
      "tw-sima",
      "mainland-no-source",
      "mirror-judge",
      "mirror-cardinfo",
      "mirror-gamecard",
      "mirror-death",
      "mirror-damage",
      "fandom-sima-standard"
    ],
    "aliases": [
      "三国杀司马懿",
      "司马懿·反馈·鬼才"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 16,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-sima",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject detail og:description=0 and initial_hp=0 as defaults.",
      "gender_method": "Mobile-focused BWIKI explicit gender field, secondary; inspected publisher mobile/OL details have no gender field.",
      "mainland_mobile_page_faq_present": false,
      "historical_tw_faq_scope": "Publisher/operator Taiwan mobile standard edition FAQ dated 2021-07-02. Cross-product/historical clarification, not proof of 2026 mainland executable behavior.",
      "page_audit": "Full raw HTML, both 身份 and hidden 国战 skill groups, all hidden skill-description li elements inspected. No deferred skill fetch observed. Identity-only packet; duplicated catalog 国战 text is not all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal identifying labels only; raw fetched pages retained temporarily outside deliverable; no art."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-sima",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-16.html",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-sima",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/司马懿",
        "publication_or_revision_date": "2025-10-24"
      },
      {
        "id": "tw-sima",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_921.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "mainland-no-source",
        "tier": "primary_mainland_mobile_mode_rule_statement",
        "url": "https://www.sanguosha.cn/pc/news-detail-1377.html",
        "publication_or_revision_date": "2022-12-02"
      },
      {
        "id": "mirror-judge",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/judge.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-cardinfo",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/cardinfo.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-death",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/death.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-damage",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/damage.html",
        "publication_or_revision_date": null
      },
      {
        "id": "fandom-sima-standard",
        "tier": "secondary_community_page_with_distinct_variant_FAQ",
        "url": "https://sanguosha.fandom.com/zh/wiki/%E5%8F%B8%E9%A9%AC%E6%87%BF?variant=zh-hans",
        "publication_or_revision_date": null
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.fankui",
        "name": "反馈",
        "timing": "after damage resolution and any resulting dying/rescue; actor must survive",
        "optional": true,
        "frequency": "once per damage EVENT regardless of points, not once per point",
        "cost": null,
        "effect": "Choose and obtain one eligible H/E card belonging to actual damage source, into own hand. Equipment is not installed. No judgment card.",
        "selection": {
          "equipment": "choose visible concrete card",
          "hand": "blind/random selection, never inspect faces",
          "count": 1,
          "distance_limit": null,
          "allow_allies": true
        },
        "source_rules": {
          "actual_source_preserved": true,
          "sourceless_damage": "no source-targeted acquisition; never fabricate a source from retrial or chain propagation",
          "self_source": "allowed by historical Taiwan standard FAQ; normal obtain semantics supports self equipment into hand. Do not copy existing 商鞅 self-source exclusion. Self-hand no-op is excluded by the host movement-legality contract, not by a directly observed current-standard FAQ; do not invent a benefit for it.",
          "dead_source": "Revalidate at resolution. Do not fetch from discard or reclaim a dead source’s former cards. Direct current-mobile ruling for source dying mid-resolution not obtained; host may require living source after death cleanup, explicitly as safety/compatibility policy.",
          "empty_HE": "no obtainable card, no fabricated deck draw",
          "HP_loss_or_zero_prevented_damage": "not a positive damage event, no trigger"
        },
        "evidence_labels": {
          "per_event_and_H_only_retrial": "direct current mainland mobile",
          "HE_selection_rescue_self_source": "historical Taiwan mobile standard FAQ",
          "no_source": "current mainland announcement explains source-dependent skills do not trigger on sourceless damage; ordinary source-target existence inference",
          "self_equipment_not_self_hand": "Self-equipment: historical standard rulebook mirror. Self-hand: host no-op movement contract; secondary Jie-variant FAQ corroboration is not promoted to direct base proof."
        },
        "implementation_hooks": [
          "post_rescue_after_damage",
          "preserve_damage_source_id",
          "obtain_from_hand_or_equipment",
          "hidden_random_hand_picker",
          "equipment_leave"
        ]
      },
      {
        "id": "sgs.guicai",
        "name": "鬼才",
        "timing": "after judgement physical card is revealed, before effective result",
        "optional": true,
        "cost": {
          "kind": "play_to_replace_judgement_not_discard_activation",
          "count": 1,
          "zones": [
            "hand"
          ],
          "suit": "any",
          "forbid": [
            "equipment",
            "judgment",
            "arbitrary_private_piles"
          ]
        },
        "effect": "Move selected hand card to pending judgement processing; discard old pending judgement card. Continue same judgement with new effective suit/rank; retrial supplier gains no old card.",
        "frequency": "one opportunity for this actor in each distinct judgement, whether used or passed; no later return after another retrial",
        "ordering": "Historical FAQ: start from current turn actor, proceed in normal seat order (stated anticlockwise); each eligible retrial actor responds once. Use the host canonical action-order orientation, not array-order accident.",
        "effective_card": "Use shared judged-role card modifiers (e.g. judged 小乔 spade→heart if that exact passive is present). Provider’s printed/hand suit and judgement-effective suit are separate contexts. Changing Lightning result does not make provider its damage source.",
        "atomicity": "Pure eligibility query. Validate exact hand card and live pending judgement before commit. Cancel/stale event consumes nothing. Install replacement and discard previous processing card exactly once, retaining judgement ID and ancestry. No repeated opportunity for same actor; next separate judgement permits again.",
        "unclosed": "Stored 木牛流马 and other special-pile permission is not inferred from hand-only current text; do not silently expand to all nonequipment zones.",
        "implementation_hooks": [
          "judgment_before_effective",
          "once_actor_per_judgment",
          "hand_material_options",
          "judgment_card_substitution",
          "effective_judgment_suit"
        ]
      }
    ],
    "source_identity_context": {
      "faction": "魏",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "SM1",
        "kind": "death_and_movement",
        "decision": "反馈先完整救援；需要仍存活来源及合法H/E，不能追回死亡清理牌。",
        "basis": "当前目录+历史台湾FAQ；来源中途死亡采用本作安全合同。"
      },
      {
        "id": "SM2",
        "kind": "self_source",
        "decision": "自身来源允许装备入手，自身手牌不作无效移动。",
        "basis": "自身来源有历史台湾FAQ；自身装备有历史规则镜像，自身手牌排除为本作合同。"
      },
      {
        "id": "SM3",
        "kind": "retrial_order",
        "decision": "每判定每人一次机会，按当前行动者起的统一座序；旧判定牌弃置，无交换收益。",
        "basis": "历史台湾标准FAQ及本作统一改判队列。"
      },
      {
        "id": "SM4",
        "kind": "cross_game_atomicity",
        "decision": "素材与判定事件提交前核验；有效花色按受判者；物理素材与虚拟功能分离。",
        "basis": "历史通则镜像与跨作事务合同，未声称当前客户端细则。"
      }
    ],
    "adaptation_notes": "身份基础版完整技能组；3血来自官方OL名册对应标准武将hp=3并由移动版BWIKI交叉印证，性别依据移动版BWIKI，非大陆手游详情页字段。未核验2026当前客户端规则或体力；2021台湾标准FAQ、历史授权FAQ与规则镜像均分级使用，不能冒充大陆当前裁定。 SM1–SM4为江湖兼容：反馈每次实际伤害事件一次，救援后存活才询问；手牌暗取，装备入手，不拿判定牌。自身伤害来源可取自己的装备；自己的手牌无移动收益不提供。来源死亡或已无合法牌不追回弃牌。鬼才仅用手牌，每个判定每人一次改判或放弃，旧牌弃置而非交换。判定按受判者的有效花色结算，提供改判牌不成为伤害来源。与商鞅的装备改判权限不同，保留独立人物。",
    "source_unknowns": [
      "No 2026 mainland executable playtest.",
      "Mainland catalog lacks HP/gender fields; disclosed mixed provenance above.",
      "Dead source before feedback and nested cross-game movement reactions lack direct current-client ruling; no resurrecting discarded cards.",
      "Special-pile retrial scope and simultaneous borrowed-skill expiry are not certified."
    ],
    "dedup_review": {
      "compare_to": "yxs.mobile.historical.hero.shang-yang",
      "existing_name": "商鞅",
      "verdict": "distinct_full_intrinsic_packet",
      "same_person": false,
      "rename_required": false,
      "decisive_difference": "Existing source-backed 变法 permits H/E; base 鬼才 permits HAND only. Existing local 法家 additionally excludes self-source; SGS standard FAQ explicitly allows self-source. Equal HP and similar damage acquisition are insufficient.",
      "source_names_or_factions_are_not_reason": "No arbitrary split by faction/name; skill constraints already differ."
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "compare_to": "yxs.mobile.historical.hero.shang-yang",
        "existing_name": "商鞅",
        "verdict": "distinct_full_intrinsic_packet",
        "same_person": false,
        "rename_required": false,
        "decisive_difference": "Existing source-backed 变法 permits H/E; base 鬼才 permits HAND only. Existing local 法家 additionally excludes self-source; SGS standard FAQ explicitly allows self-source. Equal HP and similar damage acquisition are insufficient.",
        "source_names_or_factions_are_not_reason": "No arbitrary split by faction/name; skill constraints already differ."
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      {
        "variant": "身份 界司马懿",
        "difference": "Feedback per damage point; retrial H/E. Do not import either upgrade into base."
      },
      {
        "variant": "2020 mainland 国战界 guide",
        "difference": "Feedback remains per-event in that mode; retrial extended to equipment. Not 身份界."
      },
      {
        "variant": "catalog hidden 国战",
        "difference": "Identical displayed two-skill block inspected; no paired-HP/mode mechanics certified."
      }
    ],
    "portrait_path": "./portraits-sgs-base-next/sima-yi.svg"
  },
  {
    "id": "sgs.adapted.base.hero.da-qiao",
    "name": "大乔",
    "display_name": "大乔",
    "max_hp": 3,
    "skill_name": "国色 / 流离",
    "skill_desc": "国色：方块手牌或装备当画地为牢。流离：被杀指定后、响应前可弃1张手牌或装备，将此杀转给弃牌后自己范围内的另一合法角色。",
    "skill_ids": [
      "sgs.guose",
      "sgs.liuli"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "吴",
    "gender": "female",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated_tested",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "大乔",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-13.html",
      "https://www.sanguosha.com/hero",
      "https://wiki.biligame.com/msgs/大乔",
      "https://www.sanguosha.com.tw/newsinfo_912.html",
      "https://g.iqiyi.com/sanguosha/news/321011.html",
      "https://g.iqiyi.com/sanguosha/news/321006.html",
      "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
      "https://gltjk.com/sanguosha/rules/flow/virtual.html",
      "https://gltjk.com/sanguosha/rules/glossary/cardinfo.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304260.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:13:identity:2026-10-15",
    "source_ids": [
      "mobile-daqiao",
      "ol-roster",
      "bwiki-daqiao",
      "tw-daqiao",
      "iqiyi-wu-faq",
      "iqiyi-tricks-faq",
      "mirror-wu",
      "mirror-virtual",
      "mirror-cardinfo",
      "yxs-xishi-mobile-local"
    ],
    "aliases": [
      "三国杀大乔",
      "大乔·国色·流离"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 13,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-daqiao",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject detail og:description=0 and initial_hp=0 as defaults.",
      "gender_method": "Mobile-focused BWIKI explicit gender field, secondary; inspected publisher mobile/OL details have no gender field.",
      "mainland_mobile_page_faq_present": false,
      "historical_tw_faq_scope": "Publisher/operator Taiwan mobile standard edition FAQ dated 2021-07-02. Cross-product/historical clarification, not proof of 2026 mainland executable behavior.",
      "page_audit": "Full raw HTML, both 身份 and hidden 国战 skill groups, all hidden skill-description li elements inspected. No deferred skill fetch observed. Identity-only packet; duplicated catalog 国战 text is not all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal identifying labels only; raw fetched pages retained temporarily outside deliverable; no art."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-daqiao",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-13.html",
        "publication_or_revision_date": null
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_other_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "bwiki-daqiao",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/大乔",
        "publication_or_revision_date": "2025-06-03"
      },
      {
        "id": "tw-daqiao",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_912.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "iqiyi-wu-faq",
        "tier": "historical_licensed_operator_OL_FAQ_cross_product",
        "url": "https://g.iqiyi.com/sanguosha/news/321011.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "iqiyi-tricks-faq",
        "tier": "historical_licensed_operator_OL_FAQ_cross_product",
        "url": "https://g.iqiyi.com/sanguosha/news/321006.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "mirror-wu",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-virtual",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/virtual.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-cardinfo",
        "tier": "secondary_nonpublisher_historical_official_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/cardinfo.html",
        "publication_or_revision_date": null
      },
      {
        "id": "yxs-xishi-mobile-local",
        "tier": "local_readonly_prior_source_capture",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304260.shtml",
        "publication_or_revision_date": "2015-02-03"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.guose",
        "name": "国色",
        "optional": true,
        "timing": "normal legal use window for delayed trick, ordinarily own play phase",
        "material": {
          "count": 1,
          "suit": "diamond",
          "zones": [
            "hand",
            "equipment"
          ],
          "not_zones": [
            "judgment",
            "discard",
            "arbitrary_private_piles"
          ]
        },
        "effective_card": "乐不思蜀",
        "shared_host_card_alias": "画地为牢",
        "independent_use_limit": null,
        "bonus_draw": 0,
        "remove_existing_delayed_trick_option": false,
        "target": "One other living character without same effective delayed-trick name already in judgment area and without applicable target prohibition; no distance limit. Cannot target self.",
        "effect": "Place converted physical material in target judgment region as effective 乐不思蜀. At normal judgment timing, non-heart skips whole play phase; heart does not. Remove consumed delayed trick after resolution. Do not skip draw/discard/end phases or invent next-turn lock duration.",
        "nullification": "Use the existing shared delayed-trick 无懈 timing. Historical licensed FAQ places cancellation before its judgement reveal rather than placement/after revealed judgement; if host card uses another policy, record compatibility explicitly instead of silently making Guose a second card rule.",
        "physical_identity": "Material retains printed card identity; if another role obtains it from judgment, the recipient receives the original physical card and cannot use it as 乐不思蜀 solely because Daqiao converted it earlier.",
        "atomicity": "Validate diamond context, H/E ownership, unique physical ID, target and duplicate effective-name prohibition before removing material. If equipment, lose equipment once; then retain one card object with physical+effective identities in judgment. Cancel/illegal/stale choice no cost.",
        "implementation_hooks": [
          "diamond_HE_virtual_delayed_trick",
          "shared_delayed_trick_duplicate_guard",
          "equipment_leave",
          "effective_and_printed_card_identity"
        ]
      },
      {
        "id": "sgs.liuli",
        "name": "流离",
        "optional": true,
        "timing": "when becoming target of a Slash, before own Dodge/Bagua response",
        "cost": {
          "kind": "discard",
          "count": 1,
          "zones": [
            "hand",
            "equipment"
          ],
          "suit": "any"
        },
        "target": {
          "count": 1,
          "alive": true,
          "exclude": [
            "self",
            "original Slash user"
          ],
          "allow_allies": true,
          "range_origin": "Daqiao",
          "range_test": "post-cost attack range and distance including removal of discarded weapon/offensive horse",
          "original_attacker_distance_rechecked": false,
          "target_prohibition": "must still be legal Slash target for original user, so standard 空城 empty-hand Zhuge is prohibited; ignore only original-user range",
          "armor_immunity": "armor effects like 仁王盾 are resolution defenses, not targeting prohibitions; legal recipient then may block the Slash"
        },
        "effect": "Transfer this target branch to recipient; preserve original Slash user, source, effective card, nature, damage bonus, and ancestry. Daqiao is not new damage source. Recipient receives its own targeting/response/armor checks.",
        "frequency": "One optional transfer decision at this target-branch window; no independent per-turn or per-phase cap. A weapon-generated new Slash after Daqiao dodged is a new opportunity, per historical Taiwan standard FAQ.",
        "cannot_after": [
          "Dodge response already started",
          "failed Bagua judgement",
          "one Dodge supplied toward a two-Dodge demand"
        ],
        "Qinglong_followup": "A attacks Daqiao; she dodges; A uses Qinglong new Slash against Daqiao: she may now Liuli to B. If B dodges and A follows up again, that next Slash targets B.",
        "duplicate_original_target": "Historical rulebook mirror permits transfer to someone already another target of this Slash, creating separate branch resolution. Do not deduplicate by player ID. Complex duplicate multi-target branch ordering is not verified in 2026 mainland client.",
        "atomicity": "Offer material+recipient pairs using projected post-discard range. Revalidate active branch and legal target before commit; consume material once, fire equipment-leave once, then transfer branch. Invalid/cancel/stale no discard. Do not spend card then discover its weapon/horse was the only source of range.",
        "implementation_hooks": [
          "become_slash_target_before_response",
          "project_post_cost_attack_range",
          "slash_target_prohibition",
          "preserve_damage_source",
          "branch_target_transfer",
          "weapon_followup_new_slash"
        ]
      }
    ],
    "source_identity_context": {
      "faction": "吴",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "DQ1",
        "kind": "shared_delayed_trick",
        "decision": "乐不思蜀适配共享画地为牢，并继承共享无懈时机；不是第二套延时规则。",
        "basis": "官方基础转换+历史授权FAQ与本作共享牌规则。"
      },
      {
        "id": "DQ2",
        "kind": "physical_identity",
        "decision": "国色持续于判定功能区，离开到手牌/弃牌恢复实体印刷身份。",
        "basis": "历史台湾FAQ与统一单素材功能区合同。"
      },
      {
        "id": "DQ3",
        "kind": "target_transfer",
        "decision": "流离预先验证弃牌后的自身射程；保留原杀来源、属性、加成与分支。",
        "basis": "历史台湾/授权FAQ及跨作分支事务。"
      },
      {
        "id": "DQ4",
        "kind": "followup_permission",
        "decision": "本人闪后武器追加的新杀重新获得流离机会，下一追杀跟随新目标。",
        "basis": "2021台湾标准FAQ，非2026大陆客户端实测。"
      },
      {
        "id": "DQ5",
        "kind": "duplicate_target_and_cost_interrupt",
        "decision": "已是另一个目标的合法人物仍可承接独立分支；成本离区触发完整结算，取消或无效提交不扣牌。",
        "basis": "历史规则镜像与明确跨作结算；复杂当前客户端排序未核验。"
      }
    ],
    "adaptation_notes": "身份基础版完整技能组；3血来自官方OL名册对应标准武将hp=3并由移动版BWIKI交叉印证，性别依据移动版BWIKI，非大陆手游详情页字段。未核验2026当前客户端规则或体力；2021台湾标准FAQ、历史授权FAQ与规则镜像均分级使用，不能冒充大陆当前裁定。 DQ1–DQ5为江湖兼容：国色乐不思蜀映射共享画地为牢，沿用共享无懈与判定时机；方块手牌/装备单素材、无额外次数上限、无摸牌或移除判定牌分支。判定区保持有效延时身份，取入手后恢复实体牌。流离在闪/防具响应前，按弃牌后的本人范围验证，禁止转给自己或原使用者；保留杀的原来源、属性与加成。历史台湾FAQ允许自己闪后武器追加新杀时再流离，区别西施；重复目标按分支处理。",
    "source_unknowns": [
      "No current mainland executable test.",
      "Mainland page lacks HP/gender fields; mixed provenance disclosed.",
      "Target prohibition, original-user exclusion and source-preservation use historical licensed OL FAQ/rulebook cross-check, not an embedded mainland mobile FAQ.",
      "Multiple simultaneous redirected target branches, nested loss-trigger death and new target-selection reactions require host event policy and tests.",
      "Exact 2026 mainland Qinglong follow-up behavior not directly tested; implemented profile must declare historical Taiwan standard FAQ rather than silently claim client parity."
    ],
    "dedup_review": {
      "compare_to": "yxs.adapted.base.hero.xi-shi",
      "existing_name": "西施",
      "verdict": "distinct_full_intrinsic_packet",
      "same_person": false,
      "rename_required": false,
      "matching_subfeatures": [
        "3HP",
        "female",
        "diamond H/E as delayed skip-play trick",
        "H/E discard redirect in own post-cost range"
      ],
      "decisive_difference": "Official YXS historical mobile FAQ says if 西施 declined 沉鱼 on first Slash, dodged, and the attacker follows with 盘龙棍, she cannot 沉鱼 that follow-up. Official Taiwan SGS standard FAQ explicitly allows 大乔 流离 that analogous 青龙 follow-up. Preserve this intrinsic chain permission; do not merge by one-turn outcomes or matching visible skill text.",
      "confidence": "Difference is verified between the declared historical/reference products; current mainland mobile full corner-case executable behavior is not certified."
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparison": {
        "compare_to": "yxs.adapted.base.hero.xi-shi",
        "existing_name": "西施",
        "verdict": "distinct_full_intrinsic_packet",
        "same_person": false,
        "rename_required": false,
        "matching_subfeatures": [
          "3HP",
          "female",
          "diamond H/E as delayed skip-play trick",
          "H/E discard redirect in own post-cost range"
        ],
        "decisive_difference": "Official YXS historical mobile FAQ says if 西施 declined 沉鱼 on first Slash, dodged, and the attacker follows with 盘龙棍, she cannot 沉鱼 that follow-up. Official Taiwan SGS standard FAQ explicitly allows 大乔 流离 that analogous 青龙 follow-up. Preserve this intrinsic chain permission; do not merge by one-turn outcomes or matching visible skill text.",
        "confidence": "Difference is verified between the declared historical/reference products; current mainland mobile full corner-case executable behavior is not certified."
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      {
        "variant": "界大乔",
        "difference": "国色 gains once-per-play-phase limit, removal alternative, and extra draw. None belong to base."
      },
      {
        "variant": "谋大乔",
        "difference": "Additional limits/mark/extra-phase mechanics; not base."
      },
      {
        "variant": "historical dedicated 1v1",
        "difference": "Replaces 流离 with 婉容, unlike placing base identity packet in host two-player match."
      },
      {
        "variant": "hidden 国战",
        "difference": "Both full displayed skills inspected and identical; no paired HP or all-mode availability certification."
      }
    ],
    "portrait_path": "./portraits-sgs-base-next/da-qiao.svg"
  },
  {
    "id": "sgs.adapted.base.hero.zhen-ji",
    "name": "甄姬",
    "display_name": "甄姬",
    "max_hp": 3,
    "skill_name": "洛神 / 倾国",
    "skill_desc": "洛神：准备阶段可反复判定，每次最终黑牌立即入手，再选择继续；红色停止。倾国：合法闪窗口可将1张有效黑色手牌当闪。",
    "skill_ids": [
      "sgs.luoshen",
      "sgs.qingguo"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "魏",
    "gender": "female",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "integrated_tested",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "甄姬",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-21.html",
      "https://www.sanguosha.com/hero",
      "https://wiki.biligame.com/msgs/%E7%94%84%E5%A7%AC",
      "https://www.sanguosha.com/news/20161025_6540_1618",
      "https://gltjk.com/sanguosha/rules/flow/judge.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://sanguosha.fandom.com/zh/wiki/%E7%94%84%E5%A7%AC?variant=zh-hans"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:21:identity:2026-10-15",
    "source_ids": [
      "zhenji:mobile_base",
      "zhenji:ol_standard_roster",
      "zhenji:mobile_bwiki",
      "zhenji:ol_standard_guide",
      "zhenji:mirror_rule_judge",
      "zhenji:mirror_rule_gamecard",
      "zhenji:fandom_faq"
    ],
    "aliases": [
      "三国杀甄姬",
      "甄姬·洛神·倾国"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "zhenji:ol_standard_roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 21,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "zhenji:mobile_bwiki",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "name": "甄姬",
      "faction": "魏",
      "max_hp": 3,
      "gender": "female",
      "skill_names": [
        "洛神",
        "倾国"
      ],
      "faction_evidence": [
        "mobile_base",
        "mobile_bwiki",
        "ol_standard_roster"
      ],
      "hp_evidence": {
        "primary_mobile_explicit": false,
        "official_matching_standard_crosscheck": "ol_standard_roster gid=21 extend=标准 hp=3; separate initial_hp=0 rejected as max HP",
        "historical_official_crosscheck": "ol_standard_guide 2016-10-25 identifies standard 3 HP; its separate 4 HP passage concerns lord role",
        "product_specific_secondary": "mobile_bwiki classic/standard explicit 3"
      },
      "gender_evidence": {
        "explicit_mobile_secondary": "mobile_bwiki female",
        "official_mobile_explicit_gender_field": false,
        "official_biography_support": "Empress/wife biography is corroboration, not an explicit gender field"
      },
      "no_added_skills": true
    },
    "source_evidence_tiers": [
      {
        "id": "zhenji:mobile_base",
        "tier": "official_mobile_current_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-21.html",
        "publication_or_revision_date": null
      },
      {
        "id": "zhenji:ol_standard_roster",
        "tier": "official_OL_catalog_crosscheck_not_mobile",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "zhenji:mobile_bwiki",
        "tier": "secondary_mobile_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E7%94%84%E5%A7%AC",
        "publication_or_revision_date": "2022-12-11 displayed update; oldid=30726"
      },
      {
        "id": "zhenji:ol_standard_guide",
        "tier": "official_OL_historical_guide",
        "url": "https://www.sanguosha.com/news/20161025_6540_1618",
        "publication_or_revision_date": "2016-10-25 18:11:42"
      },
      {
        "id": "zhenji:mirror_rule_judge",
        "tier": "third_party_mirror_historical_rules",
        "url": "https://gltjk.com/sanguosha/rules/flow/judge.html",
        "publication_or_revision_date": null
      },
      {
        "id": "zhenji:mirror_rule_gamecard",
        "tier": "third_party_mirror_historical_rules",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "zhenji:fandom_faq",
        "tier": "secondary_community_FAQ",
        "url": "https://sanguosha.fandom.com/zh/wiki/%E7%94%84%E5%A7%AC?variant=zh-hans",
        "publication_or_revision_date": null
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.luoshen",
        "name": "洛神",
        "kind": "optional preparation trigger with optional repetition",
        "sources": [
          "mobile_base",
          "mobile_sima",
          "mobile_xiaoqiao",
          "mirror_rule_judge",
          "mirror_rule_gamecard"
        ],
        "timing": "Own preparation stage; before ordinary judgment stage and draw stage. Not a draw replacement.",
        "cost": "No card or HP payment. Owner may decline initial activation and may decline each permitted repeat.",
        "target": "Self is judgment subject; no chosen other player.",
        "process": [
          "Run one real judgment including lawful replacement/retrial windows.",
          "After the final black judgment takes effect, gain that exact effective judgment material into hand immediately.",
          "Only a black result permits optional next judgment. A nonblack result gives no Luoshen gain and ends this sequence.",
          "After stopping, advance normal turn stages; do not restart this preparation trigger after its window."
        ],
        "acquisition_timing": "PER_JUDGMENT_AFTER_EFFECT_BEFORE_OPTIONAL_REPEAT",
        "acquisition_compulsory_given_success": "The selected skill sequence says gain, not a separate optional gain; do not add a second decline-to-gain choice.",
        "is_real_judgment": true,
        "uses_final_effective_card": true,
        "uses_effective_color": true,
        "repeat_cap": null,
        "repeat_cap_semantics": "No fixed numerical maximum specified. Continue as long as a black result and owner consent permit. Do not add 3/5/10/20/100 cap; scheduler safety must suspend/resume without silently ending the rule.",
        "normal_draw_unchanged": true,
        "base_hand_limit_exemption": false,
        "retrial_details": "Red to final black succeeds and gains replacement. Black to final red fails without gaining either old black or final red via Luoshen. Replaced originals follow replacement skill movement; never gain duplicates.",
        "effective_suit_details": "Judge using current effective suit/color of the final card for the judged owner. If an actually applicable Hongyan effect treats its spade judgment as heart, it is nonblack and cannot continue/gain. Base Zhen Ji does not innately have Hongyan; another player merely owning it does not filter Zhen Ji judgments.",
        "cleanup": "Successful directly acquired black card does not first enter discard. Failed judgment follows normal cleanup unless another legal effect changes movement.",
        "engine_boundary_unknowns": [
          "Current-client deck exhaustion/reshuffle behavior not tested. Use independently verified global judgment/deck rules, not a hero-specific invented cap.",
          "Complex simultaneous after-judgment/gain trigger ordering beyond inspected sources remains global-engine work, not certified by this hero page."
        ],
        "normalized_signature": "REPEAT_JUDGE[phase=OWN_PREPARE_before_JUDGE_and_DRAW; optional_start; subject=SELF; ordinary_retrial; result=FINAL_EFFECTIVE_COLOR; BLACK=>GAIN_EXACT_FINAL_MATERIAL_TO_HAND_at_JUDGE_EFFECTIVE_then_optional_repeat; nonBLACK=>no_gain+stop; numeric_cap=NONE; normal_draw=UNCHANGED; hand_limit_exemption=NONE]"
      },
      {
        "id": "sgs.qingguo",
        "name": "倾国",
        "kind": "one-card conversion for legal use or play",
        "sources": [
          "mobile_base",
          "mobile_xiaoqiao",
          "mirror_rule_virtual",
          "mirror_rule_gamecard"
        ],
        "timing": "Whenever allowed to use or play a Shan. No unrestricted proactive Shan button in idle action phase.",
        "material_count": 1,
        "material_zone": "HAND_ONLY",
        "material_color": "BLACK_EFFECTIVE",
        "equipment_zone_allowed": false,
        "judgment_zone_allowed": false,
        "output": {
          "logical_name": "闪",
          "logical_type": "basic",
          "material_card_count": 1,
          "physical_identity": "retain exact selected card ID; do not create a new physical Shan",
          "suit_rank": "one-material conversion preserves relevant material suit/rank; supported by historical mirrored general rule, not separately restated by mobile hero page"
        },
        "event_semantics": "Execute the requested Shan use or Shan play event and its appropriate legality/response hooks. Do not implement as generic damage cancellation or discard-without-response.",
        "legal_limits": "One material per Shan. If event requires multiple Shan, satisfy each separately. Conversion does not bypass a prohibition on the relevant use/play action. A black equipment-card TYPE in hand is eligible; a card currently in equipment zone is not.",
        "physical_movement": "Exact material leaves hand for normal use/play processing, followed by ordinary cleanup once; logical Shan must not mutate printed material name/type.",
        "quota": null,
        "normalized_signature": "CONVERT[material=EXACTLY_1_EFFECTIVE_BLACK_HAND_CARD; into=SHAN_BASIC; window=LEGAL_USE_OR_PLAY; identity=VIRTUAL_SHAN_WITH_EXACT_PHYSICAL_MATERIAL; suit_rank=ONE_MATERIAL_RULE; use_play_prohibitions=RESPECTED; numeric_quota=NONE]"
      }
    ],
    "source_identity_context": {
      "faction": "魏",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "ZJ1",
        "kind": "judgment_scheduler",
        "decision": "准备阶段的每次最终黑判定立即获牌再问继续；没有数值上限，沿用全局牌堆与调度。",
        "basis": "大陆基础身份目录+历史判定通则；全局牌堆耗尽非武将限次。"
      },
      {
        "id": "ZJ2",
        "kind": "effective_card",
        "decision": "洛神用受判者的最终有效花色，成功牌直接入手不经过弃牌。",
        "basis": "目录及历史通则镜像；无关人物的红颜不影响本人。"
      },
      {
        "id": "ZJ3",
        "kind": "conversion_event",
        "decision": "倾国一张有效黑色手牌映射一次所需闪事件；沿用单素材花色点数和精确物理ID。",
        "basis": "大陆目录+历史单素材通则镜像，不伪装现行独立FAQ。"
      },
      {
        "id": "ZJ4",
        "kind": "source_equivalence_boundary",
        "decision": "与赵飞燕保留独立来源人物；玉步的历史逐次获牌时点未证完整相同。",
        "basis": "英雄杀历史原文时点未闭合，本地归一不得升级为来源相等。"
      }
    ],
    "adaptation_notes": "身份基础版完整技能组；3血来自官方OL名册对应标准武将hp=3并由移动版BWIKI交叉印证，性别依据移动版BWIKI，非大陆手游详情页字段。未核验2026当前客户端规则或体力；2021台湾标准FAQ、历史授权FAQ与规则镜像均分级使用，不能冒充大陆当前裁定。 ZJ1–ZJ4为江湖兼容：洛神在准备阶段逐次真判定，最终有效黑牌生效后立即入手，再决定继续；无固定次数上限，红色结束，正常摸牌不减少。基础版没有洛神牌不计手牌上限。倾国只能将1张有效黑色手牌当闪，装备区不可用；双闪逐张交，保留素材花色点数及印刷身份，不绕过禁闪。与赵飞燕的来源级逐次获牌时点未证明相同，不能凭本地效果相同认证整将合并；国战和界版边界保留。",
    "source_unknowns": [
      "No direct current mobile-client HP/gender/rules inspection.",
      "No explicit gender/HP field on current official mobile hero-detail page.",
      "Current mobile Guozhan true timing unresolved due catalog duplication vs historical and secondary evidence.",
      "Original YXS Yubu acquisition event timing unresolved.",
      "Fresh primary mobile general-rule proof of exact one-material virtual suit/rank inheritance not found; historical secondary rule explicitly supports it."
    ],
    "dedup_review": {
      "compared_id": "yxs.adapted.base.hero.zhao-fei-yan",
      "compared_name": "赵飞燕",
      "decision": "NO_SOURCE_LEVEL_WHOLE_HERO_MERGE_CERTIFIED",
      "identity_source_ready_but_merge_uncertain": true,
      "same_intrinsic_dimensions": [
        "HP3",
        "female (SGS explicit community field; YXS local biographical-adaptation field)",
        "two-skill structure",
        "optional black judgment loop before delayed tricks/normal draw",
        "black hand-only Shan conversion"
      ],
      "different_metadata": {
        "sgs_faction": "魏",
        "yxs_faction": "臣",
        "note": "Different source-game faction vocabularies; ignore only under an explicitly defined normalization, preserve original source fields."
      },
      "unresolved_intrinsic_dimension": "YXS original official 2015 mobile and 2012 desktop say all black judgment cards enter hand without saying when within sequence; their FAQ only proves availability AFTER Yubu. This does not establish source-equivalent per-judgment gain.",
      "local_adaptation_matches": "Local docs normalize Yubu to each final-black gain before repeat, explicitly labeled as Jianghu adaptation. Equal implemented outcomes/signatures cannot upgrade that adaptation to historical source fact.",
      "source_full_signature": {
        "sgs_hp": 3,
        "sgs_skills": [
          "sgs.luoshen",
          "sgs.qingguo"
        ],
        "yxs_hp": 3,
        "yxs_skills": [
          "玉步",
          "轻影"
        ],
        "judgment_acquisition_timing_equal": null,
        "full_equivalence_proven": false
      },
      "do_not": "Do not add SGS source as a proven YXS alias, alter canonical identity, inflate unique count, or silently rewrite YXS timing provenance on this research alone.",
      "reusable_mechanisms": "Real-judgment/retrial scheduler and one-material Shan conversion can be shared once tests preserve each source rule. Mechanism reuse does not establish whole-hero identity equivalence.",
      "models_read_result": "models/hero.py contains only frozen Hero dataclass fields, no Zhao Feiyan source rule. Detailed comparison taken from docs/yxs-fourth and latest docs/youjian inventory.",
      "local_existing_signature": {
        "max_hp": 3,
        "skills": [
          {
            "name": "玉步",
            "signature": "REPEAT_JUDGE[phase=PREPARE_before_delayed; optional_start=true; final_color=BLACK->gain_final_card+optional_repeat; RED->stop+discard; draw_phase_unmodified]"
          },
          {
            "name": "轻影",
            "signature": "CONVERT[cost=1 BLACK card in H; into=SHAN; window=legal_response; quota=per_requested_card]"
          }
        ]
      },
      "local_existing_equivalence": {
        "status": "full_equivalence_pending",
        "compared_source_name": "三国杀甄姬",
        "differences_or_gaps": [
          "玉步最终黑牌逐张获得的时点采用明示江湖归一，未证完整来源一致"
        ],
        "merged_source_ids": []
      },
      "local_sources": [
        {
          "path": "source-notes/hero.py",
          "sha256": "77635c4dd5ab94839e333c15b27d403ed36227fd85e8cb5b40d7451a5bcbf640",
          "bytes": 178,
          "access": "read_only"
        },
        {
          "path": "source-notes/specs.json",
          "sha256": "f10fe2616e3866aa3547e0c9287217fb291ec9d541d6b5a339d8ae9b9d6b91a6",
          "bytes": 28560,
          "access": "read_only"
        },
        {
          "path": "source-notes/equivalence.json",
          "sha256": "e46bec9523cd2fb34af0986622cb34f600a760c495801291a818838a7728401e",
          "bytes": 3323,
          "access": "read_only"
        },
        {
          "path": "source-notes/full-html-audit.json",
          "sha256": "c80cea6db9ecd5ccd5b1ca05e866c0d0b3fd34b19ff8f5a34b4f816a60710538",
          "bytes": 14474,
          "access": "read_only"
        },
        {
          "path": "source-notes/source-mapping.md",
          "sha256": "997ca318fd72100a43919486d23330d0eee0f882cf2d50ad78815d0ad1395b5c",
          "bytes": 10205,
          "access": "read_only"
        },
        {
          "path": "source-notes/content-inventory.json",
          "sha256": "9a76ea57749201d037ce56a4791dbe3bd4df7670eacd4d3f12c5cf6289bb5ebd",
          "bytes": 4054970,
          "access": "read_only"
        }
      ]
    },
    "source_equivalence": {
      "status": "full_equivalence_pending",
      "comparison": {
        "compared_id": "yxs.adapted.base.hero.zhao-fei-yan",
        "compared_name": "赵飞燕",
        "decision": "NO_SOURCE_LEVEL_WHOLE_HERO_MERGE_CERTIFIED",
        "identity_source_ready_but_merge_uncertain": true,
        "same_intrinsic_dimensions": [
          "HP3",
          "female (SGS explicit community field; YXS local biographical-adaptation field)",
          "two-skill structure",
          "optional black judgment loop before delayed tricks/normal draw",
          "black hand-only Shan conversion"
        ],
        "different_metadata": {
          "sgs_faction": "魏",
          "yxs_faction": "臣",
          "note": "Different source-game faction vocabularies; ignore only under an explicitly defined normalization, preserve original source fields."
        },
        "unresolved_intrinsic_dimension": "YXS original official 2015 mobile and 2012 desktop say all black judgment cards enter hand without saying when within sequence; their FAQ only proves availability AFTER Yubu. This does not establish source-equivalent per-judgment gain.",
        "local_adaptation_matches": "Local docs normalize Yubu to each final-black gain before repeat, explicitly labeled as Jianghu adaptation. Equal implemented outcomes/signatures cannot upgrade that adaptation to historical source fact.",
        "source_full_signature": {
          "sgs_hp": 3,
          "sgs_skills": [
            "sgs.luoshen",
            "sgs.qingguo"
          ],
          "yxs_hp": 3,
          "yxs_skills": [
            "玉步",
            "轻影"
          ],
          "judgment_acquisition_timing_equal": null,
          "full_equivalence_proven": false
        },
        "do_not": "Do not add SGS source as a proven YXS alias, alter canonical identity, inflate unique count, or silently rewrite YXS timing provenance on this research alone.",
        "reusable_mechanisms": "Real-judgment/retrial scheduler and one-material Shan conversion can be shared once tests preserve each source rule. Mechanism reuse does not establish whole-hero identity equivalence.",
        "models_read_result": "models/hero.py contains only frozen Hero dataclass fields, no Zhao Feiyan source rule. Detailed comparison taken from docs/yxs-fourth and latest docs/youjian inventory.",
        "local_existing_signature": {
          "max_hp": 3,
          "skills": [
            {
              "name": "玉步",
              "signature": "REPEAT_JUDGE[phase=PREPARE_before_delayed; optional_start=true; final_color=BLACK->gain_final_card+optional_repeat; RED->stop+discard; draw_phase_unmodified]"
            },
            {
              "name": "轻影",
              "signature": "CONVERT[cost=1 BLACK card in H; into=SHAN; window=legal_response; quota=per_requested_card]"
            }
          ]
        },
        "local_existing_equivalence": {
          "status": "full_equivalence_pending",
          "compared_source_name": "三国杀甄姬",
          "differences_or_gaps": [
            "玉步最终黑牌逐张获得的时点采用明示江湖归一，未证完整来源一致"
          ],
          "merged_source_ids": []
        },
        "local_sources": [
          {
            "path": "source-notes/hero.py",
            "sha256": "77635c4dd5ab94839e333c15b27d403ed36227fd85e8cb5b40d7451a5bcbf640",
            "bytes": 178,
            "access": "read_only"
          },
          {
            "path": "source-notes/specs.json",
            "sha256": "f10fe2616e3866aa3547e0c9287217fb291ec9d541d6b5a339d8ae9b9d6b91a6",
            "bytes": 28560,
            "access": "read_only"
          },
          {
            "path": "source-notes/equivalence.json",
            "sha256": "e46bec9523cd2fb34af0986622cb34f600a760c495801291a818838a7728401e",
            "bytes": 3323,
            "access": "read_only"
          },
          {
            "path": "source-notes/full-html-audit.json",
            "sha256": "c80cea6db9ecd5ccd5b1ca05e866c0d0b3fd34b19ff8f5a34b4f816a60710538",
            "bytes": 14474,
            "access": "read_only"
          },
          {
            "path": "source-notes/source-mapping.md",
            "sha256": "997ca318fd72100a43919486d23330d0eee0f882cf2d50ad78815d0ad1395b5c",
            "bytes": 10205,
            "access": "read_only"
          },
          {
            "path": "source-notes/content-inventory.json",
            "sha256": "9a76ea57749201d037ce56a4791dbe3bd4df7670eacd4d3f12c5cf6289bb5ebd",
            "bytes": 4054970,
            "access": "read_only"
          }
        ]
      },
      "merged_source_ids": []
    },
    "variant_boundaries": [
      {
        "variant": "界甄姬",
        "difference": "洛神牌不计手牌上限不属于基础版。"
      },
      {
        "variant": "国战甄姬",
        "difference": "现目录重复文本不能证明国战与身份相同；历史国战集中获得时点不同。"
      }
    ],
    "portrait_path": "./portraits-sgs-base-next/zhen-ji.svg"
  }
];
const deepFreeze = value => { if(value && typeof value === "object" && !Object.isFrozen(value)){Object.values(value).forEach(deepFreeze);Object.freeze(value);} return value; };
export const SGS_BASE_NEXT_DEFINITIONS = deepFreeze(definitions);
