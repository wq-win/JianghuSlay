/** Complete base identity source records. Integration gates remain pending until parent acceptance. */
const definitions = [
  {
    "id": "sgs.adapted.base.hero.lu-xun",
    "name": "陆逊",
    "display_name": "陆逊",
    "max_hp": 3,
    "skill_name": "谦逊 / 连营",
    "skill_desc": "谦逊：不能成为顺手牵羊或画地为牢的目标。连营：失去最后的手牌后，可摸1张。",
    "skill_ids": [
      "sgs.qianxun",
      "sgs.lianying"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "吴",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "陆逊",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-14.html",
      "https://www.sanguosha.com.tw/newsinfo_918.html",
      "https://wiki.biligame.com/msgs/陆逊",
      "https://www.sanguosha.com/hero",
      "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://gltjk.com/sanguosha/rules/flow/move.html"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:14:identity:2026-10-15",
    "source_ids": [
      "mobile-luxun",
      "tw-luxun",
      "bwiki-luxun",
      "ol-roster",
      "mirror-wu",
      "mirror-gamecard",
      "mirror-move"
    ],
    "aliases": [
      "三国杀陆逊",
      "陆逊·谦逊·连营"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 14,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-luxun",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "mainland_mobile_page_faq_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject initial_hp=0 and structured description=0 defaults.",
      "gender_method": "Mobile-focused BWIKI explicit field; community secondary, not publisher mobile field.",
      "historical_tw_faq_scope": "Publisher/operator Taiwan standard FAQ dated 2021-07-02 is historical cross-product clarification, not current mainland executable proof.",
      "page_audit": "Raw catalog HTML includes hidden alternate-mode skill panels; selected base identity only, no all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal labels. No raw fetched pages or official art in deliverable."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-luxun",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-14.html",
        "publication_or_revision_date": null
      },
      {
        "id": "tw-luxun",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_918.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "bwiki-luxun",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/陆逊",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:30。"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_different_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-wu",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-move",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/move.html",
        "publication_or_revision_date": null
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.qianxun",
        "name": "谦逊",
        "timing": "target legality, before payment/commit",
        "locked": true,
        "optional": false,
        "effect": "Owner cannot be chosen as target of source-semantic Snatch or Indulgence.",
        "blocked_source_cards": [
          "顺手牵羊",
          "乐不思蜀"
        ],
        "shared_host_aliases": [
          "顺手牵羊/探囊取物",
          "画地为牢"
        ],
        "conditions": "No hand-count, color, distance, faction, user-side or turn condition.",
        "not_effects": [
          "not immunity to all tricks",
          "not remove existing judgement cards",
          "not later damage reduction"
        ],
        "range_override_priority": "Qicai/Feizei waive distance only and do not override this prohibition.",
        "transfer_boundary": "Re-check legality when a delayed Indulgence is moved into judgement zone; cannot directly place it to evade source target prohibition. Existing judgement card is not retroactively deleted solely because skill acquired.",
        "sources": [
          "mobile-luxun",
          "mirror-wu",
          "mirror-gamecard"
        ]
      },
      {
        "id": "sgs.lianying",
        "name": "连营",
        "timing": "immediately after completed card movement that removes last hand card, before enclosing action continues",
        "optional": true,
        "trigger": "before movement had one or more hand cards and the movement leaves zero hand cards",
        "effect": "May draw1, once for that last-hand-loss event.",
        "material": "No cost; applies use, play/respond, discard, give, obtain-by-other, hand->equipment. Exchange depends on the actual committed movement contract, not synthetic intermediate emptiness; equipment/J-only loss does not qualify.",
        "frequency": "No turn cap; batch losing multiple final hand cards is one empty-hand event, not one draw per card.",
        "decline": "Decline expires for this event; simply remaining empty is not a later trigger.",
        "nested": "New card may answer subsequent sequential response, including second Wushuang Dodge or next Duel response. Atomic two-card costs must be paid entirely before draw; cannot use first-loss draw to complete the cost.",
        "equipment": "Any remaining equipment is irrelevant to empty HAND condition.",
        "death": "No draw after owner dies; death cleanup is not a resurrection source.",
        "event_identity": "One trigger per immutable movement source event; duplicate delivery consumes no extra deck card.",
        "sources": [
          "mobile-luxun",
          "tw-luxun",
          "mirror-move",
          "mirror-gamecard"
        ],
        "exchange_boundary": {
          "historical_sgs_two_stage": "Historical nonpublisher rulebook mirror move.html item6 expressly describes both old hands entering processing, loss triggers, then both old opponent hands received; example is LuSu Dimeng with LuXun and ZhangChunHua. This historically explicit processing/loss window can support Lianying even if the later received hand is nonempty.",
          "current_mainland_client_exchange_verified": false,
          "host_atomic_swap_all_hands": "Existing original Jianghu BaoSi swap_all_hands directly swaps both hand arrays in one atomic commit. Evaluate completed movement: old H>0, real old-H departure, final H=0 yields one optional Lianying; final H>0 yields none. Old H=0 does not trigger. Do not empty hands or enqueue a loss trigger between the two assignments.",
          "host_partial_swap": "Same principle for an atomic equal-count partial swap: use committed final hand state, never internal pop/push intermediate state; replacing every old hand card while receiving cards is not itself a last-hand-loss event.",
          "evidence_class": "Historical SGS staged exchange and explicit cross-work host adaptation are separate contracts; no current-client certification or rule change for the original host skill.",
          "sources": [
            "mirror-move",
            "host-atomic-handswap"
          ]
        }
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.qianxun",
          "name": "谦逊",
          "timing": "target legality, before payment/commit",
          "locked": true,
          "optional": false,
          "effect": "Owner cannot be chosen as target of source-semantic Snatch or Indulgence.",
          "blocked_source_cards": [
            "顺手牵羊",
            "乐不思蜀"
          ],
          "shared_host_aliases": [
            "顺手牵羊/探囊取物",
            "画地为牢"
          ],
          "conditions": "No hand-count, color, distance, faction, user-side or turn condition.",
          "not_effects": [
            "not immunity to all tricks",
            "not remove existing judgement cards",
            "not later damage reduction"
          ],
          "range_override_priority": "Qicai/Feizei waive distance only and do not override this prohibition.",
          "transfer_boundary": "Re-check legality when a delayed Indulgence is moved into judgement zone; cannot directly place it to evade source target prohibition. Existing judgement card is not retroactively deleted solely because skill acquired.",
          "sources": [
            "mobile-luxun",
            "mirror-wu",
            "mirror-gamecard"
          ]
        },
        {
          "id": "sgs.lianying",
          "name": "连营",
          "timing": "immediately after completed card movement that removes last hand card, before enclosing action continues",
          "optional": true,
          "trigger": "before movement had one or more hand cards and the movement leaves zero hand cards",
          "effect": "May draw1, once for that last-hand-loss event.",
          "material": "No cost; applies use, play/respond, discard, give, obtain-by-other, hand->equipment. Exchange depends on the actual committed movement contract, not synthetic intermediate emptiness; equipment/J-only loss does not qualify.",
          "frequency": "No turn cap; batch losing multiple final hand cards is one empty-hand event, not one draw per card.",
          "decline": "Decline expires for this event; simply remaining empty is not a later trigger.",
          "nested": "New card may answer subsequent sequential response, including second Wushuang Dodge or next Duel response. Atomic two-card costs must be paid entirely before draw; cannot use first-loss draw to complete the cost.",
          "equipment": "Any remaining equipment is irrelevant to empty HAND condition.",
          "death": "No draw after owner dies; death cleanup is not a resurrection source.",
          "event_identity": "One trigger per immutable movement source event; duplicate delivery consumes no extra deck card.",
          "sources": [
            "mobile-luxun",
            "tw-luxun",
            "mirror-move",
            "mirror-gamecard"
          ],
          "exchange_boundary": {
            "historical_sgs_two_stage": "Historical nonpublisher rulebook mirror move.html item6 expressly describes both old hands entering processing, loss triggers, then both old opponent hands received; example is LuSu Dimeng with LuXun and ZhangChunHua. This historically explicit processing/loss window can support Lianying even if the later received hand is nonempty.",
            "current_mainland_client_exchange_verified": false,
            "host_atomic_swap_all_hands": "Existing original Jianghu BaoSi swap_all_hands directly swaps both hand arrays in one atomic commit. Evaluate completed movement: old H>0, real old-H departure, final H=0 yields one optional Lianying; final H>0 yields none. Old H=0 does not trigger. Do not empty hands or enqueue a loss trigger between the two assignments.",
            "host_partial_swap": "Same principle for an atomic equal-count partial swap: use committed final hand state, never internal pop/push intermediate state; replacing every old hand card while receiving cards is not itself a last-hand-loss event.",
            "evidence_class": "Historical SGS staged exchange and explicit cross-work host adaptation are separate contracts; no current-client certification or rule change for the original host skill.",
            "sources": [
              "mirror-move",
              "host-atomic-handswap"
            ]
          }
        }
      ]
    },
    "source_identity_context": {
      "faction": "吴",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "LX1",
        "kind": "target_prohibition",
        "decision": "谦逊按顺手牵羊/探囊取物与乐不思蜀/画地为牢的有效功能核验；免距不绕过禁制，已有判定牌不追溯删除。",
        "basis": "大陆目录、历史规则镜像与本作共享功能映射。"
      },
      {
        "id": "LX2",
        "kind": "atomic_loss",
        "decision": "连营按真实移牌后手牌由非空变空的事件可选摸1；批量最后手牌一次，保持空手不重复触发。",
        "basis": "大陆目录、台湾历史标准FAQ及本作不可变移动事件。"
      },
      {
        "id": "LX3",
        "kind": "nested_window",
        "decision": "顺序响应可在两次交牌之间连营；同批多牌代价必须先全部支付，不能用摸来的牌补付原成本。",
        "basis": "台湾历史标准FAQ与本作原子成本合同。"
      },
      {
        "id": "LX4",
        "kind": "atomic_host_exchange",
        "decision": "原创江湖褒姒换牌为一次原子交换，只按提交前与最终手牌数判断；最终仍有手牌不触发，不制造交换中间空手。历史三国杀缔盟的分步失牌窗口不迁移到本作换牌。",
        "basis": "历史规则镜像的分步交换与本作原子换手是分别标注的合同，未核验当前大陆客户端。"
      }
    ],
    "adaptation_notes": "完整基础身份技能组。3血依据官方OL对应标准武将hp=3与移动版BWIKI；性别依据移动版BWIKI。大陆移动版详情页无体力/性别字段；未核验2026当前客户端规则或体力。台湾2021标准FAQ为历史跨产品参考，历史规则镜像为次级资料。LX1：谦逊按顺手牵羊/探囊取物与乐不思蜀/画地为牢的有效功能核验；免距不绕过禁制，已有判定牌不追溯删除。 LX2：连营按真实移牌后手牌由非空变空的事件可选摸1；批量最后手牌一次，保持空手不重复触发。 LX3：顺序响应可在两次交牌之间连营；同批多牌代价必须先全部支付，不能用摸来的牌补付原成本。 LX4：原创江湖褒姒换牌为一次原子交换，只按提交前与最终手牌数判断；最终仍有手牌不触发，不制造交换中间空手。历史三国杀缔盟的分步失牌窗口不迁移到本作换牌。",
    "source_unknowns": [
      "No 2026 mainland executable playtest.",
      "Mainland catalog lacks HP/gender fields; mixed provenance disclosed.",
      "Nested cross-game movement and skill-copy lifetime edges follow explicit host event contracts, not claimed current-client rulings."
    ],
    "dedup_review": {
      "verdict": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.shi-qian",
          "equal": false,
          "reason": "Same3HP and Snatch prohibition only overlap; ShiQian adds Snatch range waiver and club-hand conversion, lacks Indulgence immunity and last-hand draw."
        },
        {
          "other_id": "jianghu.classic.hero.jiang-wei",
          "equal": false,
          "reason": "4HP start-turn emptyhand extra2 is not3HP every last-hand-loss optional1 and two-card target immunity."
        },
        {
          "other_id": "yxs.mobile.historical.hero.liu-bo-wen",
          "equal": false,
          "reason": "No-hand Slash/Duel prohibition and deck look/reorder are different target card types and triggers."
        }
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.shi-qian",
          "equal": false,
          "reason": "Same3HP and Snatch prohibition only overlap; ShiQian adds Snatch range waiver and club-hand conversion, lacks Indulgence immunity and last-hand draw."
        },
        {
          "other_id": "jianghu.classic.hero.jiang-wei",
          "equal": false,
          "reason": "4HP start-turn emptyhand extra2 is not3HP every last-hand-loss optional1 and two-card target immunity."
        },
        {
          "other_id": "yxs.mobile.historical.hero.liu-bo-wen",
          "equal": false,
          "reason": "No-hand Slash/Duel prohibition and deck look/reorder are different target card types and triggers."
        }
      ],
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "No Jie stash-hand skill or X recipients; no 国战度势; no lord skill."
    ],
    "portrait_path": "./portraits-sgs-following/lu-xun.svg"
  },
  {
    "id": "sgs.adapted.base.hero.diao-chan",
    "name": "貂蝉",
    "display_name": "貂蝉",
    "max_hp": 3,
    "skill_name": "闭月 / 离间",
    "skill_desc": "闭月：结束阶段可摸1张。离间：出牌阶段限1次，弃1张手牌或装备，令两名其他男性依次进行可无懈的虚拟决斗。",
    "skill_ids": [
      "sgs.biyue",
      "sgs.lijian"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "群",
    "gender": "female",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "貂蝉",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-24.html",
      "https://www.sanguosha.com.tw/newsinfo_913.html",
      "https://wiki.biligame.com/msgs/貂蝉",
      "https://www.sanguosha.com/hero",
      "https://gltjk.com/sanguosha/rules/card/hero/neutral.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304251.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:24:identity:2026-10-15",
    "source_ids": [
      "mobile-diaochan",
      "tw-diaochan",
      "bwiki-diaochan",
      "ol-roster",
      "mirror-neutral",
      "mirror-gamecard",
      "yxs-chen-mobile"
    ],
    "aliases": [
      "三国杀貂蝉",
      "貂蝉·闭月·离间"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 24,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-diaochan",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "mainland_mobile_page_faq_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject initial_hp=0 and structured description=0 defaults.",
      "gender_method": "Mobile-focused BWIKI explicit field; community secondary, not publisher mobile field.",
      "historical_tw_faq_scope": "Publisher/operator Taiwan standard FAQ dated 2021-07-02 is historical cross-product clarification, not current mainland executable proof.",
      "page_audit": "Raw catalog HTML includes hidden alternate-mode skill panels; selected base identity only, no all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal labels. No raw fetched pages or official art in deliverable."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-diaochan",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-24.html",
        "publication_or_revision_date": null
      },
      {
        "id": "tw-diaochan",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_913.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "bwiki-diaochan",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/貂蝉",
        "publication_or_revision_date": "2026年1月10日 (星期六) 21:20。"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_different_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-neutral",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/neutral.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "yxs-chen-mobile",
        "tier": "prior_capture_primary_historical_YXS_mobile",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304251.shtml",
        "publication_or_revision_date": "2015-02-03 22:09:07"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.biyue",
        "name": "闭月",
        "timing": "own end phase starts, after discard phase",
        "optional": true,
        "effect": "Draw exactly1.",
        "frequency": "once at each genuine end-phase start, not once on every UI refresh or arbitrary turn-end hook",
        "not_effects": [
          "no draw2 when empty (Jie only)",
          "no handlimit+1",
          "cannot retain an extra card by discarding one fewer first"
        ],
        "sources": [
          "mobile-diaochan",
          "tw-diaochan"
        ]
      },
      {
        "id": "sgs.lijian",
        "name": "离间",
        "timing": "idle own play phase",
        "optional": true,
        "limit": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": {
          "count": 1,
          "zones": [
            "hand",
            "equipment"
          ],
          "colors": "any",
          "judgment_allowed": false,
          "discard": true
        },
        "targets": {
          "count": 2,
          "distinct": true,
          "other_than_skill_owner": true,
          "alive": true,
          "gender": "current rules male",
          "side": "any",
          "distance_limit": null,
          "order": "player chooses first responder A, then virtual Duel user B; B uses Duel on A"
        },
        "effect": "After legal cost, chosen B virtually uses one ordinary Duel on chosen A. Normal trick use/target/nullification/response/damage pipeline.",
        "virtual_card": {
          "name": "决斗",
          "physical_materials": [],
          "color": null,
          "suit": null,
          "rank": null,
          "cost_is_not_material": true
        },
        "nullification": "Allowed before Duel takes effect; counter-nullification ordinary rules; do not import old no-Nullification clause.",
        "prohibition": "A must be legal Duel target for B. Emptyhand Kongcheng may be B (user), not A (target). Merely targeting skill pair does not override this.",
        "damage": "Duel winning participant is damage source; victim may be original user; skill owner is not automatic source. It is damage not HP loss.",
        "response": "Duel responses are PLAY Slash and do not consume normal active Slash quota. Apply intrinsic Wushuang/Bawang double requirement and proper use histories.",
        "cost_commit": "Validate full ordered pair, current gender, exact owned material and current phase together before discard and quota. Finish equipment-loss triggers before Duel; if participants die in intervening effects, do not fabricate Duel/damage or refund a legitimately paid cost.",
        "availability_1v1": "Two other males cannot exist in strict two-player game; skill disabled with explanation, Biyue retained.",
        "sources": [
          "mobile-diaochan",
          "tw-diaochan",
          "bwiki-diaochan",
          "mirror-neutral",
          "mirror-gamecard"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "female",
      "skills": [
        {
          "id": "sgs.biyue",
          "name": "闭月",
          "timing": "own end phase starts, after discard phase",
          "optional": true,
          "effect": "Draw exactly1.",
          "frequency": "once at each genuine end-phase start, not once on every UI refresh or arbitrary turn-end hook",
          "not_effects": [
            "no draw2 when empty (Jie only)",
            "no handlimit+1",
            "cannot retain an extra card by discarding one fewer first"
          ],
          "sources": [
            "mobile-diaochan",
            "tw-diaochan"
          ]
        },
        {
          "id": "sgs.lijian",
          "name": "离间",
          "timing": "idle own play phase",
          "optional": true,
          "limit": {
            "count": 1,
            "scope": "play_phase"
          },
          "cost": {
            "count": 1,
            "zones": [
              "hand",
              "equipment"
            ],
            "colors": "any",
            "judgment_allowed": false,
            "discard": true
          },
          "targets": {
            "count": 2,
            "distinct": true,
            "other_than_skill_owner": true,
            "alive": true,
            "gender": "current rules male",
            "side": "any",
            "distance_limit": null,
            "order": "player chooses first responder A, then virtual Duel user B; B uses Duel on A"
          },
          "effect": "After legal cost, chosen B virtually uses one ordinary Duel on chosen A. Normal trick use/target/nullification/response/damage pipeline.",
          "virtual_card": {
            "name": "决斗",
            "physical_materials": [],
            "color": null,
            "suit": null,
            "rank": null,
            "cost_is_not_material": true
          },
          "nullification": "Allowed before Duel takes effect; counter-nullification ordinary rules; do not import old no-Nullification clause.",
          "prohibition": "A must be legal Duel target for B. Emptyhand Kongcheng may be B (user), not A (target). Merely targeting skill pair does not override this.",
          "damage": "Duel winning participant is damage source; victim may be original user; skill owner is not automatic source. It is damage not HP loss.",
          "response": "Duel responses are PLAY Slash and do not consume normal active Slash quota. Apply intrinsic Wushuang/Bawang double requirement and proper use histories.",
          "cost_commit": "Validate full ordered pair, current gender, exact owned material and current phase together before discard and quota. Finish equipment-loss triggers before Duel; if participants die in intervening effects, do not fabricate Duel/damage or refund a legitimately paid cost.",
          "availability_1v1": "Two other males cannot exist in strict two-player game; skill disabled with explanation, Biyue retained.",
          "sources": [
            "mobile-diaochan",
            "tw-diaochan",
            "bwiki-diaochan",
            "mirror-neutral",
            "mirror-gamecard"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "群",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "DC1",
        "kind": "phase_quota",
        "decision": "离间每个真实出牌阶段1次；先选成本、先响应男性A、使用决斗男性B，提交前可取消且不付费。",
        "basis": "当前基础目录与2021台湾标准FAQ，按真实阶段ID记录次数。"
      },
      {
        "id": "DC2",
        "kind": "ordinary_virtual_duel",
        "decision": "B对A使用无实体、无色无花色无点数决斗，允许无懈；成本仅弃置，不作虚拟决斗素材。",
        "basis": "当前基础目录与台湾标准FAQ；不混用旧版不可无懈条款。"
      },
      {
        "id": "DC3",
        "kind": "identity_and_revalidation",
        "decision": "按当前规则性别与空城等禁制核验有序双目标；决斗胜者为伤害来源。严格1v1不足两名其他男性，禁用离间但保留闭月。",
        "basis": "台湾历史标准FAQ及本作有效形态、目标和事务合同。"
      },
      {
        "id": "DC4",
        "kind": "end_phase",
        "decision": "正常弃牌后，真实结束阶段开始可选摸1；不加手牌上限、不用界版空手摸2。",
        "basis": "大陆基础目录与台湾标准FAQ。"
      }
    ],
    "adaptation_notes": "完整基础身份技能组。3血依据官方OL对应标准武将hp=3与移动版BWIKI；性别依据移动版BWIKI。大陆移动版详情页无体力/性别字段；未核验2026当前客户端规则或体力。台湾2021标准FAQ为历史跨产品参考，历史规则镜像为次级资料。DC1：离间每个真实出牌阶段1次；先选成本、先响应男性A、使用决斗男性B，提交前可取消且不付费。 DC2：B对A使用无实体、无色无花色无点数决斗，允许无懈；成本仅弃置，不作虚拟决斗素材。 DC3：按当前规则性别与空城等禁制核验有序双目标；决斗胜者为伤害来源。严格1v1不足两名其他男性，禁用离间但保留闭月。 DC4：正常弃牌后，真实结束阶段开始可选摸1；不加手牌上限、不用界版空手摸2。",
    "source_unknowns": [
      "No 2026 mainland executable playtest.",
      "Mainland catalog lacks HP/gender fields; mixed provenance disclosed.",
      "Nested cross-game movement and skill-copy lifetime edges follow explicit host event contracts, not claimed current-client rulings."
    ],
    "dedup_review": {
      "verdict": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.chen-yuan-yuan",
          "equal": false,
          "reason": "Full package otherwise close but modern standard virtual Duel can be Nullified; ChenYuanYuan historical source forbids Nullification. Also do not erase phase-vs-turn quota difference."
        },
        {
          "other_id": "jianghu.classic.hero.diao-chan",
          "equal": false,
          "reason": "Original start-turn conditional draw/discard is not two-male virtual Duel plus optional end draw. Keep original mechanism/ID with a new unique display name; not official corpus credit."
        }
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.chen-yuan-yuan",
          "equal": false,
          "reason": "Full package otherwise close but modern standard virtual Duel can be Nullified; ChenYuanYuan historical source forbids Nullification. Also do not erase phase-vs-turn quota difference."
        },
        {
          "other_id": "jianghu.classic.hero.diao-chan",
          "equal": false,
          "reason": "Original start-turn conditional draw/discard is not two-male virtual Duel plus optional end draw. Keep original mechanism/ID with a new unique display name; not official corpus credit."
        }
      ],
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Old-standard cannot-Nullify is recorded as excluded historical variant, not silently combined. Current mainland catalog wording and2021 Taiwan standard agree on ordinary virtual Duel; current executable not tested."
    ],
    "portrait_path": "./portraits-sgs-following/diao-chan.svg"
  },
  {
    "id": "sgs.adapted.base.hero.sun-shang-xiang",
    "name": "孙尚香",
    "display_name": "孙尚香",
    "max_hp": 3,
    "skill_name": "枭姬 / 结姻",
    "skill_desc": "枭姬：每失去1张已装备牌可摸2张。结姻：出牌阶段限1次，弃2张手牌，与1名其他受伤男性各回复1血。",
    "skill_ids": [
      "sgs.xiaoji",
      "sgs.jieyin"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "吴",
    "gender": "female",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "孙尚香",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-25.html",
      "https://www.sanguosha.com.tw/newsinfo_909.html",
      "https://wiki.biligame.com/msgs/孙尚香",
      "https://www.sanguosha.com/hero",
      "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
      "https://gltjk.com/sanguosha/rules/flow/move.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304239.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:25:identity:2026-10-15",
    "source_ids": [
      "mobile-sunshangxiang",
      "tw-sunshangxiang",
      "bwiki-sunshangxiang",
      "ol-roster",
      "mirror-wu",
      "mirror-move",
      "mirror-gamecard",
      "yxs-mulan-mobile"
    ],
    "aliases": [
      "三国杀孙尚香",
      "孙尚香·枭姬·结姻"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 25,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-sunshangxiang",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "mainland_mobile_page_faq_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject initial_hp=0 and structured description=0 defaults.",
      "gender_method": "Mobile-focused BWIKI explicit field; community secondary, not publisher mobile field.",
      "historical_tw_faq_scope": "Publisher/operator Taiwan standard FAQ dated 2021-07-02 is historical cross-product clarification, not current mainland executable proof.",
      "page_audit": "Raw catalog HTML includes hidden alternate-mode skill panels; selected base identity only, no all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal labels. No raw fetched pages or official art in deliverable."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-sunshangxiang",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-25.html",
        "publication_or_revision_date": null
      },
      {
        "id": "tw-sunshangxiang",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_909.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "bwiki-sunshangxiang",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/孙尚香",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:21。"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_different_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-wu",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wu.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-move",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/flow/move.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "yxs-mulan-mobile",
        "tier": "prior_capture_primary_historical_YXS_mobile",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304239.shtml",
        "publication_or_revision_date": "2015-02-03 22:48:53"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.xiaoji",
        "name": "枭姬",
        "timing": "after actual equipment-zone card movement completes",
        "optional": true,
        "effect": "Draw2 for each equipped card lost.",
        "frequency": "each physical card leaving equipment zone, including several in one batch; no turn cap",
        "eligible": [
          "replacement",
          "discard from E by legal cost or effect",
          "theft/obtain",
          "E->own hand",
          "transfer to another role equipment"
        ],
        "ineligible": [
          "discard an equipment-TYPE card from hand",
          "querying/preview/cancel",
          "moving or revealing same card without leaving E",
          "duplicate notification of same physical loss",
          "virtual equipment status with no physical E card"
        ],
        "atomic": "For simultaneous batch: commit all cost cards once, then process each equipment-card-loss opportunity; nested draw cannot supply the original unpaid cost.",
        "free_discard": false,
        "lord_penalty": "Historical standard FAQ explicitly allows on lord-kills-loyalist equipment discard. Skill has no identity prerequisite; host modes need not implement that mode to retain this source rule.",
        "death": "Death cleanup does not let deceased owner draw.",
        "sources": [
          "mobile-sunshangxiang",
          "tw-sunshangxiang",
          "mirror-wu",
          "mirror-move",
          "mirror-gamecard"
        ]
      },
      {
        "id": "sgs.jieyin",
        "name": "结姻",
        "timing": "idle own play phase",
        "optional": true,
        "limit": {
          "count": 1,
          "scope": "play_phase"
        },
        "cost": {
          "count": 2,
          "zones": [
            "hand"
          ],
          "same_batch": true,
          "colors": "any",
          "equipment_type_in_hand_allowed": true,
          "equipped_cards_allowed": false
        },
        "targets": {
          "count": 1,
          "gender": "current rules male",
          "alive": true,
          "wounded": true,
          "other_than_owner": true,
          "side": "any including enemy",
          "distance_limit": null
        },
        "effect": "After both hand cards discarded, owner and target each recover1 up to individual maximum HP.",
        "owner_wounded_required": false,
        "owner_full_hp": "Legal if target male is wounded; target recovers1 and owner remains maxHP.",
        "no_wounded_male": "Cannot activate merely to heal self; no cost/quota consumed.",
        "not_effects": [
          "not Peach card use",
          "no extra draw",
          "no moving equipment to target",
          "no compare HP version",
          "no black/red cost bonus"
        ],
        "revalidate": "Check target wound, gender, life and both distinct material IDs at commit. Resolve real recovery events without damage, respecting current caps; nested changes must not over-heal or resurrect dead actors.",
        "sources": [
          "mobile-sunshangxiang",
          "tw-sunshangxiang",
          "mirror-wu"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "female",
      "skills": [
        {
          "id": "sgs.xiaoji",
          "name": "枭姬",
          "timing": "after actual equipment-zone card movement completes",
          "optional": true,
          "effect": "Draw2 for each equipped card lost.",
          "frequency": "each physical card leaving equipment zone, including several in one batch; no turn cap",
          "eligible": [
            "replacement",
            "discard from E by legal cost or effect",
            "theft/obtain",
            "E->own hand",
            "transfer to another role equipment"
          ],
          "ineligible": [
            "discard an equipment-TYPE card from hand",
            "querying/preview/cancel",
            "moving or revealing same card without leaving E",
            "duplicate notification of same physical loss",
            "virtual equipment status with no physical E card"
          ],
          "atomic": "For simultaneous batch: commit all cost cards once, then process each equipment-card-loss opportunity; nested draw cannot supply the original unpaid cost.",
          "free_discard": false,
          "lord_penalty": "Historical standard FAQ explicitly allows on lord-kills-loyalist equipment discard. Skill has no identity prerequisite; host modes need not implement that mode to retain this source rule.",
          "death": "Death cleanup does not let deceased owner draw.",
          "sources": [
            "mobile-sunshangxiang",
            "tw-sunshangxiang",
            "mirror-wu",
            "mirror-move",
            "mirror-gamecard"
          ]
        },
        {
          "id": "sgs.jieyin",
          "name": "结姻",
          "timing": "idle own play phase",
          "optional": true,
          "limit": {
            "count": 1,
            "scope": "play_phase"
          },
          "cost": {
            "count": 2,
            "zones": [
              "hand"
            ],
            "same_batch": true,
            "colors": "any",
            "equipment_type_in_hand_allowed": true,
            "equipped_cards_allowed": false
          },
          "targets": {
            "count": 1,
            "gender": "current rules male",
            "alive": true,
            "wounded": true,
            "other_than_owner": true,
            "side": "any including enemy",
            "distance_limit": null
          },
          "effect": "After both hand cards discarded, owner and target each recover1 up to individual maximum HP.",
          "owner_wounded_required": false,
          "owner_full_hp": "Legal if target male is wounded; target recovers1 and owner remains maxHP.",
          "no_wounded_male": "Cannot activate merely to heal self; no cost/quota consumed.",
          "not_effects": [
            "not Peach card use",
            "no extra draw",
            "no moving equipment to target",
            "no compare HP version",
            "no black/red cost bonus"
          ],
          "revalidate": "Check target wound, gender, life and both distinct material IDs at commit. Resolve real recovery events without damage, respecting current caps; nested changes must not over-heal or resurrect dead actors.",
          "sources": [
            "mobile-sunshangxiang",
            "tw-sunshangxiang",
            "mirror-wu"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "吴",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "SSX1",
        "kind": "equipment_loss",
        "decision": "枭姬每张真实装备区实体离区有一次可选摸2机会；手中装备类型牌不触发，不授予自由弃装。",
        "basis": "当前目录与台湾标准FAQ。"
      },
      {
        "id": "SSX2",
        "kind": "atomic_healing",
        "decision": "结姻每真实出牌阶段1次，原子弃2张手牌；目标须其他存活受伤男性，不限敌友，本人满血仍可发动。",
        "basis": "大陆基础目录、台湾标准FAQ与共享真实阶段/恢复合同。"
      },
      {
        "id": "SSX3",
        "kind": "nested_safety",
        "decision": "提交前重验两实体与目标；真实失装、死亡清理和恢复上限沿用共享事件，不重复摸牌或复活。",
        "basis": "本作事务及生命周期合同，非当前客户端边界实测。"
      }
    ],
    "adaptation_notes": "完整基础身份技能组。3血依据官方OL对应标准武将hp=3与移动版BWIKI；性别依据移动版BWIKI。大陆移动版详情页无体力/性别字段；未核验2026当前客户端规则或体力。台湾2021标准FAQ为历史跨产品参考，历史规则镜像为次级资料。SSX1：枭姬每张真实装备区实体离区有一次可选摸2机会；手中装备类型牌不触发，不授予自由弃装。 SSX2：结姻每真实出牌阶段1次，原子弃2张手牌；目标须其他存活受伤男性，不限敌友，本人满血仍可发动。 SSX3：提交前重验两实体与目标；真实失装、死亡清理和恢复上限沿用共享事件，不重复摸牌或复活。",
    "source_unknowns": [
      "No 2026 mainland executable playtest.",
      "Mainland catalog lacks HP/gender fields; mixed provenance disclosed.",
      "Nested cross-game movement and skill-copy lifetime edges follow explicit host event contracts, not claimed current-client rulings."
    ],
    "dedup_review": {
      "verdict": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.hua-mu-lan",
          "equal": false,
          "reason": "Mili equipment-loss draw overlaps, but complete second skill is transformation into dead male, not paired heal. Mili also historically disallows lord-kill-loyalist discard trigger, while Xiaojii allows it."
        },
        {
          "other_id": "yxs.adapted.base.hero.bao-si",
          "equal": false,
          "reason": "Zhiyu can use twoH to heal wounded self+any other wounded role, no male restriction; Fenghuo equips->AOE differs from Xiaojii. No full equality."
        }
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.hua-mu-lan",
          "equal": false,
          "reason": "Mili equipment-loss draw overlaps, but complete second skill is transformation into dead male, not paired heal. Mili also historically disallows lord-kill-loyalist discard trigger, while Xiaojii allows it."
        },
        {
          "other_id": "yxs.adapted.base.hero.bao-si",
          "equal": false,
          "reason": "Zhiyu can use twoH to heal wounded self+any other wounded role, no male restriction; Fenghuo equips->AOE differs from Xiaojii. No full equality."
        }
      ],
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Mainland catalog hidden 国战 duplicates current identity wording; not certification of actual 国战 per-batch variant. No Jie equip transfer or1v1 alternate heal/Xiaojii+Yinli."
    ],
    "portrait_path": "./portraits-sgs-following/sun-shang-xiang.svg"
  },
  {
    "id": "sgs.adapted.base.hero.guo-jia",
    "name": "郭嘉",
    "display_name": "郭嘉",
    "max_hp": 3,
    "skill_name": "天妒 / 遗计",
    "skill_desc": "天妒：自己的最终判定生效后可获得判定牌。遗计：每受1点伤害并存活后，可私看牌顶2张并将这两张逐张分配。",
    "skill_ids": [
      "sgs.tiandu",
      "sgs.yiji"
    ],
    "source_variant": "mainland-mobile-base-identity-catalog-2026-10-15+explicit-tiered-historical-reference",
    "faction": "魏",
    "gender": "male",
    "gender_provenance": "secondary-mobile-focused-BWIKI-explicit-field",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested-local",
    "source_game": "三国杀",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "郭嘉",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-20.html",
      "https://www.sanguosha.com.tw/newsinfo_914.html",
      "https://wiki.biligame.com/msgs/郭嘉",
      "https://www.sanguosha.com/hero",
      "https://g.iqiyi.com/sanguosha/news/321010.html",
      "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
      "https://gltjk.com/sanguosha/rules/card/hero/wei.html",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304247.shtml"
    ],
    "source_date": "2026-10-15 catalog snapshot; publication date not displayed",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": false,
    "full_intrinsic_skillset_verified": true,
    "source_record_id": "sgs-mobile:hero-detail:20:identity:2026-10-15",
    "source_ids": [
      "mobile-guojia",
      "tw-guojia",
      "bwiki-guojia",
      "ol-roster",
      "iqiyi-wei",
      "mirror-gamecard",
      "mirror-wei",
      "yxs-yuji-mobile"
    ],
    "aliases": [
      "三国杀郭嘉",
      "郭嘉·天妒·遗计"
    ],
    "hp_evidence": {
      "value": 3,
      "primary_mobile_explicit": false,
      "official_cross_product": {
        "source_id": "ol-roster",
        "url": "https://www.sanguosha.com/hero",
        "gid": 20,
        "extend": "标准",
        "hp_field": 3,
        "rejected_default_initial_hp": 0
      },
      "mobile_secondary": {
        "source_id": "bwiki-guojia",
        "field": "经典/标准体力3"
      },
      "current_mobile_client_verified": false
    },
    "evidence": {
      "current_client_rules_verified": false,
      "current_client_hp_verified": false,
      "mainland_mobile_page_hp_field_present": false,
      "mainland_mobile_page_gender_field_present": false,
      "mainland_mobile_page_faq_present": false,
      "hp_method": "Matching gid/name/standard variant hp field in publisher OL roster, corroborated by mobile-focused BWIKI. Cross-product primary, not mainland-mobile client verification. Reject initial_hp=0 and structured description=0 defaults.",
      "gender_method": "Mobile-focused BWIKI explicit field; community secondary, not publisher mobile field.",
      "historical_tw_faq_scope": "Publisher/operator Taiwan standard FAQ dated 2021-07-02 is historical cross-product clarification, not current mainland executable proof.",
      "page_audit": "Raw catalog HTML includes hidden alternate-mode skill panels; selected base identity only, no all-mode certification.",
      "copyright": "Paraphrased mechanics and minimal labels. No raw fetched pages or official art in deliverable."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-guojia",
        "tier": "primary_current_mainland_mobile_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-20.html",
        "publication_or_revision_date": null
      },
      {
        "id": "tw-guojia",
        "tier": "primary_historical_Taiwan_mobile_cross_product_FAQ",
        "url": "https://www.sanguosha.com.tw/newsinfo_914.html",
        "publication_or_revision_date": "2021-07-02"
      },
      {
        "id": "bwiki-guojia",
        "tier": "secondary_mobile_focused_community_wiki",
        "url": "https://wiki.biligame.com/msgs/郭嘉",
        "publication_or_revision_date": "2025年12月5日 (星期五) 22:30。"
      },
      {
        "id": "ol-roster",
        "tier": "primary_current_different_product_matching_standard_variant",
        "url": "https://www.sanguosha.com/hero",
        "publication_or_revision_date": null
      },
      {
        "id": "iqiyi-wei",
        "tier": "historical_licensed_operator_other_product",
        "url": "https://g.iqiyi.com/sanguosha/news/321010.html",
        "publication_or_revision_date": "2011-01-24"
      },
      {
        "id": "mirror-gamecard",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/glossary/gamecard.html",
        "publication_or_revision_date": null
      },
      {
        "id": "mirror-wei",
        "tier": "secondary_nonpublisher_historical_rulebook_mirror",
        "url": "https://gltjk.com/sanguosha/rules/card/hero/wei.html",
        "publication_or_revision_date": null
      },
      {
        "id": "yxs-yuji-mobile",
        "tier": "prior_capture_primary_historical_YXS_mobile",
        "url": "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304247.shtml",
        "publication_or_revision_date": "2015-02-03 21:59:22"
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.tiandu",
        "name": "天妒",
        "timing": "own final judgement result effective, after all retrials, before resolving effect which requested judgement",
        "optional": true,
        "effect": "Obtain the final physical judgement card into own hand if still available.",
        "scope": "Only owner is the judged role. A hostile MaChao Tieqi or XiaHoudun Ganglie judgement belongs to its skill owner, not GuoJia.",
        "result": "Obtain regardless red/black/success/failure; never change already-fixed result. Original replaced judgement is not acquired.",
        "nested": "Card usable at next legal nested window, e.g acquired wine/peach can later rescue after Lightning damage, acquired Dodge can satisfy later required Dodge.",
        "physical": "Transfer existing exact physical ID from processing; cleanup must not discard it again. If already moved by a higher priority event, never clone/reclaim from another owner.",
        "sources": [
          "mobile-guojia",
          "tw-guojia",
          "iqiyi-wei",
          "mirror-gamecard"
        ]
      },
      {
        "id": "sgs.yiji",
        "name": "遗计",
        "timing": "after positive damage and full dying/rescue; actor survives",
        "optional": true,
        "frequency": "one independent optional sequence per point of actual damage, not per event; a 2-point event can produce 0/1/2 activations",
        "cost": null,
        "effect": "Privately view current top2 deck cards, then allocate those exact two cards to living roles, including self; both may go to same role.",
        "zones": "Watching itself neither draws nor gains nor loses hand cards: under historical rulebook top2 remain in deck until given. No old hand card or equipment may be given as part of this skill.",
        "allocation": "Standard matching detailed reference says give one viewed card, then the other. Choose recipients including self/enemy, no distance/gender/faction restriction. After accepting skill, distribute all available viewed cards; cannot decline allocation to restore topdeck knowledge.",
        "multi_point": "Finish one viewed pair and gifts, including nested effects, before offering next point; do not reveal4 at once for2damage.",
        "not_triggered": [
          "HP loss",
          "prevented/zero damage",
          "healing",
          "dead owner after failed rescue"
        ],
        "sourceless_damage": true,
        "not_effects": [
          "not draw2-then-select-any-hand (Jie)",
          "not delayed gift attached to generals",
          "not once-per-event 国战",
          "no death-trigger"
        ],
        "edge_policy": "Maintain exact viewed physical IDs and revalidate their current zone at each transfer. Current mobile source does not specify case where intervening recipient trigger moves the second viewed card; do not invent reclamation or a protected reservation zone and call it official. Mark host resolution for this rare chain explicitly.",
        "sources": [
          "mobile-guojia",
          "tw-guojia",
          "bwiki-guojia",
          "mirror-wei",
          "mirror-gamecard",
          "iqiyi-wei"
        ]
      }
    ],
    "full_intrinsic_signature": {
      "max_hp": 3,
      "gender": "male",
      "skills": [
        {
          "id": "sgs.tiandu",
          "name": "天妒",
          "timing": "own final judgement result effective, after all retrials, before resolving effect which requested judgement",
          "optional": true,
          "effect": "Obtain the final physical judgement card into own hand if still available.",
          "scope": "Only owner is the judged role. A hostile MaChao Tieqi or XiaHoudun Ganglie judgement belongs to its skill owner, not GuoJia.",
          "result": "Obtain regardless red/black/success/failure; never change already-fixed result. Original replaced judgement is not acquired.",
          "nested": "Card usable at next legal nested window, e.g acquired wine/peach can later rescue after Lightning damage, acquired Dodge can satisfy later required Dodge.",
          "physical": "Transfer existing exact physical ID from processing; cleanup must not discard it again. If already moved by a higher priority event, never clone/reclaim from another owner.",
          "sources": [
            "mobile-guojia",
            "tw-guojia",
            "iqiyi-wei",
            "mirror-gamecard"
          ]
        },
        {
          "id": "sgs.yiji",
          "name": "遗计",
          "timing": "after positive damage and full dying/rescue; actor survives",
          "optional": true,
          "frequency": "one independent optional sequence per point of actual damage, not per event; a 2-point event can produce 0/1/2 activations",
          "cost": null,
          "effect": "Privately view current top2 deck cards, then allocate those exact two cards to living roles, including self; both may go to same role.",
          "zones": "Watching itself neither draws nor gains nor loses hand cards: under historical rulebook top2 remain in deck until given. No old hand card or equipment may be given as part of this skill.",
          "allocation": "Standard matching detailed reference says give one viewed card, then the other. Choose recipients including self/enemy, no distance/gender/faction restriction. After accepting skill, distribute all available viewed cards; cannot decline allocation to restore topdeck knowledge.",
          "multi_point": "Finish one viewed pair and gifts, including nested effects, before offering next point; do not reveal4 at once for2damage.",
          "not_triggered": [
            "HP loss",
            "prevented/zero damage",
            "healing",
            "dead owner after failed rescue"
          ],
          "sourceless_damage": true,
          "not_effects": [
            "not draw2-then-select-any-hand (Jie)",
            "not delayed gift attached to generals",
            "not once-per-event 国战",
            "no death-trigger"
          ],
          "edge_policy": "Maintain exact viewed physical IDs and revalidate their current zone at each transfer. Current mobile source does not specify case where intervening recipient trigger moves the second viewed card; do not invent reclamation or a protected reservation zone and call it official. Mark host resolution for this rare chain explicitly.",
          "sources": [
            "mobile-guojia",
            "tw-guojia",
            "bwiki-guojia",
            "mirror-wei",
            "mirror-gamecard",
            "iqiyi-wei"
          ]
        }
      ]
    },
    "source_identity_context": {
      "faction": "魏",
      "mode": "base identity",
      "personal_lord_skills": [],
      "intrinsic_hp_excludes_mode_bonus": true
    },
    "adaptation_decisions": [
      {
        "id": "GJ1",
        "kind": "final_judgment",
        "decision": "天妒在本人的最终判定生效后、导致判定的效果继续前，可获得尚在处理区的最终判定实体，不改变已定结果。",
        "basis": "当前目录与台湾历史标准FAQ。"
      },
      {
        "id": "GJ2",
        "kind": "per_point_allocation",
        "decision": "遗计先完整处理伤害及救援；每点实际伤害分别可选私看牌顶2张，再逐张交给任意存活角色含自己。",
        "basis": "当前身份目录、台湾标准FAQ及历史规则镜像；不采用国战每事件或界版摸到手牌。"
      },
      {
        "id": "GJ3",
        "kind": "private_deck_view",
        "decision": "私看不产生摸牌、获得手牌或失去手牌；仅分配本次精确牌顶实体，原手牌不可混入。接受后须完成可用牌分配，不能取消来保留牌顶知识。",
        "basis": "历史规则镜像对基础观看的分区说明，非2026大陆客户端实测。"
      },
      {
        "id": "GJ4",
        "kind": "nested_viewed_card",
        "decision": "两次分配间的嵌套移动可能改变第二张牌；按实体当前区域重验，不从他人手中追回、不复制或虚构受保护区域。具体结算由本作合同明示。",
        "basis": "直接当前来源未给出罕见跨作链，属于显式兼容政策。"
      }
    ],
    "adaptation_notes": "完整基础身份技能组。3血依据官方OL对应标准武将hp=3与移动版BWIKI；性别依据移动版BWIKI。大陆移动版详情页无体力/性别字段；未核验2026当前客户端规则或体力。台湾2021标准FAQ为历史跨产品参考，历史规则镜像为次级资料。GJ1：天妒在本人的最终判定生效后、导致判定的效果继续前，可获得尚在处理区的最终判定实体，不改变已定结果。 GJ2：遗计先完整处理伤害及救援；每点实际伤害分别可选私看牌顶2张，再逐张交给任意存活角色含自己。 GJ3：私看不产生摸牌、获得手牌或失去手牌；仅分配本次精确牌顶实体，原手牌不可混入。接受后须完成可用牌分配，不能取消来保留牌顶知识。 GJ4：两次分配间的嵌套移动可能改变第二张牌；按实体当前区域重验，不从他人手中追回、不复制或虚构受保护区域。具体结算由本作合同明示。",
    "source_unknowns": [
      "No 2026 mainland executable playtest.",
      "Mainland catalog lacks HP/gender fields; mixed provenance disclosed.",
      "Nested cross-game movement and skill-copy lifetime edges follow explicit host event contracts, not claimed current-client rulings.",
      "Second viewed-card movement during nested recipient effects lacks direct current-mainland ruling; exact physical IDs are revalidated without reclamation."
    ],
    "dedup_review": {
      "verdict": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.yu-ji",
          "equal": false,
          "reason": "Both damage-point two-card flow, but YXS draws2 into hand then may give new pair; GuoJia watches deck and gives directly. Second skills Tiandu vs dying bequest conclusively different."
        },
        {
          "other_id": "jianghu.classic.hero.yu-ji",
          "equal": false,
          "reason": "Original damage-event draw2 or source HP-loss choice lacks Tiandu and exact-point topdeck gift mechanics."
        }
      ]
    },
    "source_equivalence": {
      "status": "distinct_full_intrinsic_packet",
      "comparisons": [
        {
          "other_id": "yxs.adapted.base.hero.yu-ji",
          "equal": false,
          "reason": "Both damage-point two-card flow, but YXS draws2 into hand then may give new pair; GuoJia watches deck and gives directly. Second skills Tiandu vs dying bequest conclusively different."
        },
        {
          "other_id": "jianghu.classic.hero.yu-ji",
          "equal": false,
          "reason": "Original damage-event draw2 or source HP-loss choice lacks Tiandu and exact-point topdeck gift mechanics."
        }
      ],
      "merged_source_ids": []
    },
    "variant_boundaries": [
      "Chosen exact variant is mainland base identity2026 catalog. Do not use2011 old draw wording or2021 Jie draw-to-hand. Official2020 Guozhan guide differs (per event) even though current catalog hidden tab duplicates per-point text."
    ],
    "portrait_path": "./portraits-sgs-following/guo-jia.svg"
  }
];
const deepFreeze = value => { if(value && typeof value === "object" && !Object.isFrozen(value)){Object.values(value).forEach(deepFreeze);Object.freeze(value);} return value; };
export const SGS_FOLLOWING_DEFINITIONS = deepFreeze(definitions);
