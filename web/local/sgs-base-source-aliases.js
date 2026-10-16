export const SGS_BASE_SOURCE_ALIAS_DEFINITIONS=Object.freeze([
  {
    "id": "sgs.adapted.base.hero.zhang-liao",
    "name": "张辽",
    "display_name": "张辽",
    "max_hp": 4,
    "skill_name": "突袭",
    "skill_desc": "摸牌阶段可放弃正常摸牌，从至多两名不同的其他存活角色各获得1张手牌；不限距离，无手牌数比较。",
    "faction": "魏",
    "gender": "male",
    "gender_provenance": "mobile-bwiki-addendum explicit 男; same mobile-focused classic section has four HP icons; secondary, not official field.",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "三国杀移动版基础身份·分级参考",
    "source_character_name": "张辽",
    "source_coverage": true,
    "source_variant": "current official mobile catalog base identity text, with matching OL standard HP cross-check",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-18.html",
      "https://www.sanguosha.cn/pc/hero-detail-167.html",
      "https://www.sanguosha.cn/pc/guide-info-84.html",
      "https://www.sanguosha.com/hero",
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304221.shtml",
      "https://wiki.biligame.com/msgs/张辽"
    ],
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_identity_context": {
      "faction": "魏",
      "system": "三国杀势力",
      "personal_lord_skills": []
    },
    "source_equivalence": {
      "canonical_existing_id": "yxs.adapted.base.hero.chen-sheng",
      "source_name": "陈胜",
      "existing_max_hp": 4,
      "existing_gender": "male",
      "existing_faction": "君",
      "complete_skill_names": [
        "起义"
      ],
      "official_yxs_source_rechecked": true,
      "official_yxs_hidden_faq_rechecked": true,
      "yxs_source_date": "2015-02-03 22:49:08",
      "yxs_source_summary": "Only 起义; replaces own draw by one hand card from each of up to two other characters. FAQ explicitly limits a two-person endgame to one card and says skipping play does not prevent the draw-phase skill.",
      "comparison_dimensions_equal": [
        "4 intrinsic max HP",
        "male template under disclosed secondary provenance",
        "one complete optional skill, no omitted personal lord/awakening/passive skill",
        "own draw-phase window",
        "whole normal-draw replacement",
        "one or two distinct other living hand-bearing targets under shared host contract",
        "allies permitted and no range restriction",
        "one card per target, hand only",
        "no hand-count comparison",
        "no residual ordinary draw",
        "no independent trick nullification",
        "no skill window when draw phase is skipped"
      ],
      "source_context_differences_preserved": [
        "张辽 / 陈胜 names",
        "突袭 / 起义 skill labels",
        "SGS 魏 / YXS 君 identity contexts",
        "SGS mobile catalog snapshot / historical 2015 YXS rules versions",
        "separate source URLs and provenance"
      ],
      "deduplication_convention_basis": "docs/yxs-fifth/INDEPENDENT-AUDIT.md §1.3 treats source faction and shared mode powers as context outside intrinsic skill template; docs/yxs-final-classic/hero-lifecycle.md also separates faction from intrinsic template.",
      "verdict": "Equivalent complete intrinsic ability template under the documented shared host contract. Recommend adding only a source alias/provenance record to canonical 陈胜 after independent integration validation, not an additional selectable hero.",
      "not_claimed": [
        "full product-mode identity equivalence",
        "official mobile gender-field verification",
        "2026 mobile executable verification",
        "all shared-host cross-skill timing combinations verified",
        "runtime equivalence tests or registry edits performed in this research"
      ],
      "code_model_observation": "models/hero.py is a generic 4-field Hero dataclass and contains no 陈胜 record; concrete current comparison is drawn from docs/yxs-eighth/content-inventory.json and docs/yxs-next/specs.json. No production source files were changed."
    },
    "adaptation_notes": "完整固有HP/技能与英雄杀陈胜起义等效，合并后沿用陈胜名称；SGS魏势力保留于来源上下文。摸牌数被其他技能改为0时不开放替代的当前主机规则为明示适配，未核现行客户端该边界。"
  }
].map(Object.freeze));
