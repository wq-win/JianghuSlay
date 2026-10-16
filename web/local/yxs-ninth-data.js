/** Raw ninth-packet metadata. Registration and production acceptance are owned by models/integration. */
const definitions = [
  {
    "id": "yxs.adapted.base.hero.cao-cao",
    "name": "曹操",
    "display_name": "曹操",
    "max_hp": 4,
    "skill_name": "奸雄",
    "skill_desc": "出牌阶段以1张手牌或装备区牌复制本回合本人前一张合格用牌的功能；保留本次素材花色点数，每回合1次。所有已支持牌类别均按自身规则重新使用；本作最外层历史与普通杀额度为明示适配。",
    "skill_ids": [
      "yxs.jianxiong"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-compatibility-2026-10-15",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "historical-source-biographical-template",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "曹操",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304220.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59439.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63849.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1697/m1628/201203/56649.shtml?1"
    ],
    "source_date": "2015-02-03 22:49:08",
    "desktop_date": {
      "year_month": "201203",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 4,
      "source_id": "yxs-cao-cao-desktop",
      "mobile_explicit_numeric_hp": false,
      "official_desktop_url": "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59439.shtml"
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.cao-cao",
    "legacy_source_ids": [
      "yxs.mobile.historical.hero.cao-cao"
    ],
    "source_record_id": "yxs-mobile:article:304220",
    "source_ids": [
      "yxs-cao-cao-mobile",
      "yxs-cao-cao-desktop",
      "yxs-zhuge-liang-jianxiong-faq",
      "yxs-basic-card-rules"
    ],
    "aliases": [
      "英雄杀曹操",
      "曹操·奸雄",
      "乱世奸雄"
    ],
    "source_identity_context": {
      "faction": "君",
      "lord_skill_from_shared_mode": "激将",
      "lord_hp_bonus_from_mode": 1,
      "not_part_of_intrinsic_signature": true,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1"
    },
    "official_skill_text": "出牌时，你可以出一张牌（手牌或装备区的牌），当作你本回合内前一张出的牌来使用。每回合限用一次。",
    "adaptation_decisions": [
      {
        "id": "CC1",
        "kind": "history_semantics_explicit_adaptation",
        "decision": "记录本人当前回合成功提交的最外层card_use有效功能；纯respond、打出杀/闪响应、技能弃牌、赠予、重铸、判定与展示不更新候选，其他人的牌永不更新。回合开始清空；原用牌已提交但被无懈仍是合格前牌。",
        "basis": "官方前一张自己出的牌与结算后示例；use/respond、嵌套定义未有专属FAQ，故本作明确选定。"
      },
      {
        "id": "CC2",
        "kind": "effective_template",
        "decision": "模板取上一use的effective_card/effect_id与固有属性（如火杀/雷杀），不是上一张素材印刷牌面；无实体的真实虚拟用牌可为模板，纯技能伤害不能。只存白名单描述字段，不存对象引用/函数或旧目标。",
        "basis": "只复制牌功能的官方原理；多种跨作转换的事件表达为明确扩展。"
      },
      {
        "id": "CC3",
        "kind": "official_material_metadata",
        "decision": "素材花色、点数保留；不得从模板复制花色/点数或总是改为无色。有效花色转换仍按统一当前拥有者规则，物理印刷属性保持不变。",
        "basis": "诸葛亮官方FAQ直接收口。"
      },
      {
        "id": "CC4",
        "kind": "all_card_categories",
        "decision": "不增添“仅基本和普通锦囊”的原文外白名单。每一种已支持牌功能均从同一card_use管线尝试：治疗、杀、酒、单体/多目标/AOE锦囊、延时牌、武器、防具和马。闪/无懈若没有合法主动时机则因时机不可主动复制，不可包装为缺机制。",
        "basis": "官方没有卡类型排除；以牌自身合法使用语义限制。"
      },
      {
        "id": "CC5",
        "kind": "persistent_transformed_wrapper",
        "decision": "复制装备/延时牌只用1个物理素材ID，角色区存包装effective_identity。装备在装备区持续为复制功能，延时牌在判定区及合法向下一判定区传递时持续该功能；离开持续角色到手牌/弃牌/牌堆时恢复印刷功能。区域内直接移装维持包装。",
        "basis": "官方未给变形持续时长FAQ；明确本作生命周期，禁止无素材复制或永久改写牌。"
      },
      {
        "id": "CC6",
        "kind": "kill_quota_historical_unresolved_explicit_adaptation",
        "decision": "本作明确采用复制杀检查并消耗统一普通主动杀额度；奸雄不额外授予1杀。虎符/侠胆/其他真实增额可使复制合法。官方普通杀的武将技能例外未点名奸雄，另一解释可允许额外杀；本选择在规则说明展示，不能称官方已确认。",
        "basis": "共享引擎view-as用牌统一性；父级已明确采纳，仍不是原作专属FAQ定论。"
      },
      {
        "id": "CC7",
        "kind": "post_material_removal_legality",
        "decision": "素材可为武器/马，提交前以移除素材后的预计装备状态校验距离和出杀额度；用虎符作素材时不能借尚未移除的虎符额度强行合法。校验不可改变真实状态，取消/非法不花牌或次数。",
        "basis": "完整事务及装备离区原则；不能先扣牌后发现非法。"
      },
      {
        "id": "CC8",
        "kind": "one_material_transaction",
        "decision": "预验证->原子将素材从H/E转processing->登记一次技能已用与新use->结算素材离区触发->继续新牌效果->清理仍在processing素材。装备离区收益可触发当前技能；不得复制、追回或二次弃置已被别的合法机制取得的素材。",
        "basis": "跨作牌流幂等合同。"
      },
      {
        "id": "CC9",
        "kind": "copied_properties_vs_temporary_modifiers",
        "decision": "不复制上一用牌的酒加伤、不可闪、临时增伤、已选目标、分支决定、无懈结果或伤害来源。新牌自身按当前状态重新产生这些修饰；新来源是本人。",
        "basis": "复制功能不等于复制结算快照；原作未枚举跨作修饰，明示统一。"
      },
      {
        "id": "CC10",
        "kind": "nested_and_cancellation_commit_order",
        "decision": "候选按最外层用牌提交序号确定，不在finish事件把较旧外层牌覆盖更新的合法外层事件；嵌套响应从未成为候选。技能已用标记在效果前记录，重复回执只返回原use；无懈/无效/死亡不退回已提交次数。",
        "basis": "避免重入、嵌套与存档产生双付/无限奸雄。"
      },
      {
        "id": "CC11",
        "kind": "cost_death_boundary",
        "decision": "素材移动诱发毒/失装/最后手牌效果，必须完整等待。若本人死亡或对局终止，不再强行创建后续效果；已提交素材与次数保持已用。获救后继续合法已提交用牌，不能免费重开。",
        "basis": "原作没有毒成本FAQ；继承共享异步移动/濒死合同。"
      },
      {
        "id": "CC12",
        "kind": "card_branch_reselection",
        "decision": "借刀要重新选持武器者和杀目标；AOE按当前全体合法目标；治疗按当前伤势；酒按当前酒限额；连环选择当前合法使用分支，不能借技能重铸补摸而仍称复制用牌。已有同名延时牌照普通重复限制禁止。",
        "basis": "完整牌功能复用与新使用事件，而非硬编码仅无中/决斗。"
      },
      {
        "id": "CC13",
        "kind": "history_before_acquisition",
        "decision": "用牌历史是人物回合公共事实，始终维护；花木兰本回合先出无中后易装为曹操，若有素材可引用该无中，易装本身不是card_use不抹掉候选。奸雄每回合技能使用标记不因暂时丢失重获而重置。",
        "basis": "跨作技能获得，无官方FAQ；防止依赖名字与循环重获刷次数。"
      }
    ],
    "source_unknowns": [
      {
        "field": "card_use_vs_response",
        "kind": "unanswered_original_edge",
        "handling": "原作未给use/respond或嵌套的专属定义；CC1采用本人本回合已提交最外层用牌，纯响应、重铸、赠予、判定与技能成本不更新。"
      },
      {
        "field": "activation_window",
        "kind": "unanswered_original_edge",
        "handling": "原文只写“出牌时”；CC1采用本人空闲出牌阶段，不能在响应窗口发动。"
      },
      {
        "field": "transformed_source",
        "kind": "unanswered_original_edge",
        "handling": "CC2按有效功能记录转化/无实体真实虚拟用牌；跨作虚拟事件是本作适配。"
      },
      {
        "field": "persistent_lifetime",
        "kind": "unanswered_original_edge",
        "handling": "CC5采用装备/判定功能持续区包装；合法区内移装或延时传递保留功能，进入手牌/弃牌/牌堆恢复素材印刷身份。"
      },
      {
        "field": "sha_quota",
        "kind": "unanswered_original_edge",
        "handling": "CC6复制杀遵守并消耗普通主动杀额度；奸雄自身不增加次数。原作一般武将技能例外未点名奸雄，不能称此为已核实原作裁定。"
      },
      {
        "field": "nested_atomicity",
        "kind": "unanswered_original_edge",
        "handling": "CC7–CC13明确素材离区后合法性、提交次数、救援/死亡边界、目标重选与变身前历史；这些跨作事务边界没有逐项历史FAQ。"
      }
    ],
    "adaptation_notes": "CC1–CC13为已批准的显式江湖适配。历史原文为“出牌时”，素材是“一张牌（手牌或装备区的牌）”，并限每回合一次；诸葛亮FAQ明确仅复制功能、保留素材花色点数。本作选择本人空闲出牌阶段、最外层已提交用牌历史、普通主动杀额度，以及装备/延时牌持续区功能生命周期。取消或非法选择在提交前免费；提交后被无懈、无效或死亡不退次数。完整历史边界未逐项获官方FAQ证实，未核验2026当前客户端。",
    "source_equivalence": {
      "status": "independent_historical_core_with_explicit_compatibility",
      "intrinsic_signature": [
        "OWN_PLAY_AFTER_RESOLUTION; MATERIAL1_H_OR_E; VIEW_AS_LAST_OWN_TURN_CARD_FUNCTION; MATERIAL_SUIT_RANK; 1/TURN"
      ],
      "candidate_source_ids": [],
      "unshipped_comparison": [
        "SGS曹操：受伤获得造成伤害的牌，完整机制不同；当前注册器没有此人物。"
      ]
    },
    "portrait_path": "./portraits-yxs-ninth/cao-cao.svg"
  }
];
const deepFreeze = value => { if(value && typeof value === "object" && !Object.isFrozen(value)){Object.values(value).forEach(deepFreeze);Object.freeze(value);} return value; };
export const YXS_NINTH_DEFINITIONS = deepFreeze(definitions);
