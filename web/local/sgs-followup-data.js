/** Four complete selected source packets; local integration, current client unverified. */
const definitions = [
  {
    "key": "caozhen",
    "id": "sgs.adapted.base.hero.cao-zhen",
    "source_name": "曹真",
    "suggested_display_name": "曹真",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
    "gender": "male",
    "source_faction": "魏",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 174,
    "source_refs": [
      "mobile-caozhen",
      "bwiki-caozhen"
    ],
    "intrinsic_skill_inventory": [
      "司敌"
    ],
    "skill_ids": [
      "sgs.sidi"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.sidi",
        "name": "司敌",
        "type": "optional_dodge_to_physical_pile_and_phase_slash_limit_debit",
        "timing": "分支A：自己实际使用闪，或其他角色在自己的回合实际使用闪；分支B：其他角色每个真实出牌阶段开始",
        "quota": "A每次合格闪使用可选1次，无每回合上限；B每次阶段开始至多移去1张，不可对同一窗口重复移多张",
        "cost": "A把牌堆顶1张移入自己的钤牌堆；B从该牌堆移去恰好1张",
        "targets": "A自己；B固定为当前进入出牌阶段的其他角色，包含队友，不选自己",
        "effects": [
          "自己的闪在任意回合使用均合格；别人的闪必须在自己的回合。不要只检查杀的使用者或只检查自己成为杀目标。",
          "每次实际闪使用各给一次选择：双闪产生两次真实使用时可获得两张；技能防止伤害、失去体力、未实际使用闪均不能伪造触发。虚拟/转化闪按真正闪使用事件处理，不要求有闪的实体材料。",
          "取得的是当时牌堆顶1张实体牌，置于专属牌堆，不进手牌，不属于摸牌，也不是从使用者获得其闪；未消费的钤跨回合保留。",
          "花费1张钤只令该其他角色本出牌阶段正常杀次数上限减少1；不会禁用所有牌、限制某色牌、无效已有杀或附送杀。无钤不能支付。",
          "通常1次额度减为0；若另有有限加次数效果，按上限加减合成。真正无次数限制仍可出杀；杀使用后返还次数不能使原本不合法的零额度第一杀合法。",
          "效果作用于这个具体出牌阶段，到阶段结束清除；额外出牌阶段须重新消费钤才有新的限制。持有多钤不等于自动全耗，也无上限囤积张数。",
          "移去钤不等同于弃自己的手牌或装备；正常杀回应决斗等打出杀不消耗出牌阶段使用额度。"
        ],
        "source_refs": [
          "mobile-caozhen",
          "bwiki-caozhen",
          "bwiki-sidi-detail",
          "xiaomi-caozhen"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-caozhen.html",
          "line": 186,
          "rule_sha256": "5ba2544bfaec512b1f7f2ae8a898f9800f8f919de1cbd974d81d6efc0d1005fb"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "钤以真实卡牌ID/牌堆计数显示；取得提示明确为置牌，不播放摸牌。",
      "每个合格闪事件只向曹真给可选提示；对方出牌阶段开始才询问消费1张。",
      "被限制角色显示本阶段杀额度修正-1；仍正确显示连弩/无限杀与主动额外次数。"
    ],
    "rule_expansion_notes": [
      "官方钤与社区司敌牌为同一实体标记堆的命名差异。",
      "所选原版不包含OL禁同色牌/阶段末视为杀，也不包含移动界曹真预测目标机制。",
      "特殊牌堆可见性及异游戏复制/失去技能的存储生命周期仅按明确H6/H7宿主政策，不宣称客户端实测。"
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7"
    ],
    "name": "曹真",
    "display_name": "曹真",
    "skill_name": "司敌",
    "skill_desc": "司敌：自己的闪在任意回合使用均合格；别人的闪必须在自己的回合。不要只检查杀的使用者或只检查自己成为杀目标。 每次实际闪使用各给一次选择：双闪产生两次真实使用时可获得两张；技能防止伤害、失去体力、未实际使用闪均不能伪造触发。虚拟/转化闪按真正闪使用事件处理，不要求有闪的实体材料。 取得的是当时牌堆顶1张实体牌，置于专属牌堆，不进手牌，不属于摸牌，也不是从使用者获得其闪；未消费的钤跨回合保留。 花费1张钤只令该其他角色本出牌阶段正常杀次数上限减少1；不会禁用所有牌、限制某色牌、无效已有杀或附送杀。无钤不能支付。 通常1次额度减为0；若另有有限加次数效果，按上限加减合成。真正无次数限制仍可出杀；杀使用后返还次数不能使原本不合法的零额度第一杀合法。 效果作用于这个具体出牌阶段，到阶段结束清除；额外出牌阶段须重新消费钤才有新的限制。持有多钤不等于自动全耗，也无上限囤积张数。 移去钤不等同于弃自己的手牌或装备；正常杀回应决斗等打出杀不消耗出牌阶段使用额度。",
    "source_character_name": "曹真",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀曹真",
      "cao-zhen",
      "caozhen",
      "曹真·司敌"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-174.html",
      "https://wiki.biligame.com/msgs/%E6%9B%B9%E7%9C%9F",
      "https://wiki.biligame.com/msgs/%E5%8F%B8%E6%95%8C/%E6%9B%B9%E7%9C%9F",
      "https://game.xiaomi.com/viewpoint/1195705742_1783658213393_100"
    ],
    "source_records": [
      {
        "id": "mobile-caozhen",
        "url": "https://www.sanguosha.cn/pc/hero-detail-174.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-174.html",
        "status": 200,
        "bytes": 21727,
        "sha256": "9d66c82b652ada4b80774ccb5152f5e826da55ed0b9e8d7c9ab4639a6ab3b8a7",
        "accessed_at": "2026-10-16T00:53:27.406445+00:00",
        "raw_path": "evidence/mobile-caozhen.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_identity_catalog",
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
                  "name": "司敌",
                  "hidden": false,
                  "raw_rule_text": "当你使用或其他角色于你的回合内使用【闪】时，你可以将牌堆顶的一张牌置于武将牌上，称为“钤qián”；其他角色的出牌阶段开始时，你可以移去一张“钤”，然后该角色于此阶段内可以使用【杀】的次数-1。",
                  "html_line": 186,
                  "rule_sha256": "5ba2544bfaec512b1f7f2ae8a898f9800f8f919de1cbd974d81d6efc0d1005fb"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "faction": "魏",
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "官方目录未标注规则生效日期；未验证客户端。",
          "已读取隐藏技能栏；页面没有独立体力数值或性别字段。"
        ]
      },
      {
        "id": "bwiki-caozhen",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E7%9C%9F",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E7%9C%9F",
        "status": 200,
        "bytes": 80880,
        "sha256": "5754e502e96f983fd54a1d2ca276f232848812af77272841e5a7a7927abff286",
        "accessed_at": "2026-10-16T00:53:30.613814+00:00",
        "raw_path": "evidence/bwiki-caozhen.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 26191,
        "modified_at": "2024-02-24T10:32:31Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "魏",
          "selected_section": "经典",
          "hp_html_line": 632,
          "gender_html_line": 627,
          "faction_html_line": 628,
          "initial_hp_explicit": null
        }
      },
      {
        "id": "bwiki-sidi-detail",
        "url": "https://wiki.biligame.com/msgs/%E5%8F%B8%E6%95%8C/%E6%9B%B9%E7%9C%9F",
        "final_url": "https://wiki.biligame.com/msgs/%E5%8F%B8%E6%95%8C/%E6%9B%B9%E7%9C%9F",
        "status": 200,
        "bytes": 70315,
        "sha256": "b28ce3792d2936b6ca70d4ef2b5e8249b88aaf39b1b41a5ddfd5e8857b5720aa",
        "accessed_at": "2026-10-16T00:54:27.075833+00:00",
        "raw_path": "evidence/bwiki-sidi-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 38794,
        "modified_at": "2026-06-07T00:05:16Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      },
      {
        "id": "xiaomi-caozhen",
        "url": "https://game.xiaomi.com/viewpoint/1195705742_1783658213393_100",
        "final_url": "https://game.xiaomi.com/viewpoint/1195705742_1783658213393_100",
        "status": 200,
        "bytes": 36154,
        "sha256": "6ea6de5c528fb48852efc93f5ada08c83d4febc2ba87c9511f3bf74f52ad0382",
        "accessed_at": "2026-10-16T00:55:39.879328+00:00",
        "raw_path": "evidence/xiaomi-caozhen.html",
        "current_client_verified": false,
        "publication_date": "2026-07-10",
        "tier": "same_product_mobile_distribution_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "四体力单技能；司敌是实体牌标记，减的是出杀次数上限。",
          "无次数限制的杀、诸葛连弩、咆哮可越过减至0的通常上限。",
          "关平龙吟只是杀使用后不计次数，不能让零额度者先合法使用第一张杀。"
        ],
        "limitations": [
          "社区攻略，非官方规则FAQ；其泛称每回合一杀须按具体出牌阶段核算，不据此改成全回合计数。"
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.sidi",
        "name": "司敌",
        "type": "optional_dodge_to_physical_pile_and_phase_slash_limit_debit",
        "timing": "分支A：自己实际使用闪，或其他角色在自己的回合实际使用闪；分支B：其他角色每个真实出牌阶段开始",
        "quota": "A每次合格闪使用可选1次，无每回合上限；B每次阶段开始至多移去1张，不可对同一窗口重复移多张",
        "cost": "A把牌堆顶1张移入自己的钤牌堆；B从该牌堆移去恰好1张",
        "targets": "A自己；B固定为当前进入出牌阶段的其他角色，包含队友，不选自己",
        "effects": [
          "自己的闪在任意回合使用均合格；别人的闪必须在自己的回合。不要只检查杀的使用者或只检查自己成为杀目标。",
          "每次实际闪使用各给一次选择：双闪产生两次真实使用时可获得两张；技能防止伤害、失去体力、未实际使用闪均不能伪造触发。虚拟/转化闪按真正闪使用事件处理，不要求有闪的实体材料。",
          "取得的是当时牌堆顶1张实体牌，置于专属牌堆，不进手牌，不属于摸牌，也不是从使用者获得其闪；未消费的钤跨回合保留。",
          "花费1张钤只令该其他角色本出牌阶段正常杀次数上限减少1；不会禁用所有牌、限制某色牌、无效已有杀或附送杀。无钤不能支付。",
          "通常1次额度减为0；若另有有限加次数效果，按上限加减合成。真正无次数限制仍可出杀；杀使用后返还次数不能使原本不合法的零额度第一杀合法。",
          "效果作用于这个具体出牌阶段，到阶段结束清除；额外出牌阶段须重新消费钤才有新的限制。持有多钤不等于自动全耗，也无上限囤积张数。",
          "移去钤不等同于弃自己的手牌或装备；正常杀回应决斗等打出杀不消耗出牌阶段使用额度。"
        ],
        "source_refs": [
          "mobile-caozhen",
          "bwiki-caozhen",
          "bwiki-sidi-detail",
          "xiaomi-caozhen"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-caozhen.html",
          "line": 186,
          "rule_sha256": "5ba2544bfaec512b1f7f2ae8a898f9800f8f919de1cbd974d81d6efc0d1005fb"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.sidi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.sidi"
    ],
    "complete_skill_names": [
      "司敌"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization",
        "rule": "本地默认初始HP=maxHP；公开页仅核实maxHP，不把默认值伪装独立初始HP字段。"
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "使用真实actor、卡牌ID/location epoch和阶段/回合ID；提交前复核有效技能、费用、目标、次数。取消或失效输入不支付，已支付不回滚；事件精确一次。"
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "结算遵循现有死亡/濒死/比赛结束处理；死者不可成为新目标，终局停止后续非必要结算。已真实提交的伤害与支付保留日志。"
      },
      {
        "id": "H3",
        "category": "host_order_and_privacy",
        "rule": "同窗口多技能、多人伤害与摸牌遵守宿主一致的行动顺序；盲手牌以不透明槽选择；怃戎双方锁定前不公开，AI不得读对手锁定选择。回放不重复收费/摸牌。"
      },
      {
        "id": "H4",
        "category": "host_foreign_card_values",
        "rule": "外国血杀/毒杀/刺杀接入宿主统一杀族；非原生无色判定既非红也非黑，不伪造一支效果。类别映射显式限定为基本/锦囊/装备，延时属锦囊。"
      },
      {
        "id": "H5",
        "category": "host_extra_phase_accounting",
        "rule": "以实际被跳过的phase occurrence计数，同一阶段多原因只计1。额外阶段若被正式跳过可计1；直接结束/截断回合不把未来未到达阶段猜作跳过。被翻面整回合跳过不构造阶段记录。"
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "按现有effective-hero路由完整复制多分支技能，不复制HP/性别/势力。陈群自己的回合历史独立于技能是否当时有效，复制/重得不清掉同actor限制；曹真实体堆作为actor状态保留但技能失效不能操作，死亡按普通离场清理。异游戏多重转换只采用宿主统一优先级，不宣称手游原生组合。"
      },
      {
        "id": "H7",
        "category": "host_pile_and_deck",
        "rule": "钤为宿主专属公开牌堆，显示实体与数量，移去按pile removal进入弃牌堆而非手牌弃置；这是显式宿主存储/可见性政策。牌堆空时用正常重洗；仍无法提供则实际获得0，不制造牌。永久移除/技能替换时按同一宿主规则清理，不能暗中重置次数。"
      }
    ],
    "portrait_path": "./portraits-sgs-followup/cao-zhen.svg",
    "gender_provenance": {
      "source": "bwiki-caozhen",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "source": "bwiki-caozhen",
      "metadata": {
        "max_hp": 4,
        "hp_icon_count": 4,
        "hp_numeric": 4,
        "gender": "male",
        "faction": "魏",
        "selected_section": "经典",
        "hp_html_line": 632,
        "gender_html_line": 627,
        "faction_html_line": 628,
        "initial_hp_explicit": null
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "faction": "魏",
      "source_faction": "魏",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0",
        "detail": "独立初始体力字段未知；H0满体力开局仅为宿主初始化。"
      },
      {
        "field": "current_client",
        "status": "unverified",
        "detail": "未实测2026当前移动客户端。"
      },
      {
        "field": "cross_game",
        "status": "explicit_host_policy",
        "detail": "公开钤牌堆、额外阶段账本、异游戏复制及转换优先级见H0–H7，不冒充原生客户端认证。"
      }
    ],
    "source_evidence_note": "同产品移动官网基础身份目录核对全部固有面板；最大体力、性别与经典细化来自移动BWIKI；小米同产品攻略只作选定原版边界佐证。官网旧张嶷攻略只补怃戎，未采用旧全局矢志。",
    "source_equivalence": {
      "signature": {
        "key": "caozhen",
        "id": "sgs.adapted.base.hero.cao-zhen",
        "source_name": "曹真",
        "suggested_display_name": "曹真",
        "max_hp": 4,
        "starting_hp": 4,
        "starting_hp_direct_source_value": null,
        "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
        "gender": "male",
        "source_faction": "魏",
        "product": "三国杀移动版",
        "variant": "mobile-base-identity-catalog-2026-10-15",
        "official_page_id": 174,
        "source_refs": [
          "mobile-caozhen",
          "bwiki-caozhen"
        ],
        "intrinsic_skill_inventory": [
          "司敌"
        ],
        "skill_ids": [
          "sgs.sidi"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "all_intrinsic_panels_verified": true,
        "current_client_rules_verified": false,
        "current_client_hp_verified": false,
        "source_inventory_ready": true,
        "implementation_status": "research_only",
        "readiness": "source_ready_with_explicit_host_requirements",
        "intrinsic_unresolved": [],
        "skills": [
          {
            "id": "sgs.sidi",
            "name": "司敌",
            "type": "optional_dodge_to_physical_pile_and_phase_slash_limit_debit",
            "timing": "分支A：自己实际使用闪，或其他角色在自己的回合实际使用闪；分支B：其他角色每个真实出牌阶段开始",
            "quota": "A每次合格闪使用可选1次，无每回合上限；B每次阶段开始至多移去1张，不可对同一窗口重复移多张",
            "cost": "A把牌堆顶1张移入自己的钤牌堆；B从该牌堆移去恰好1张",
            "targets": "A自己；B固定为当前进入出牌阶段的其他角色，包含队友，不选自己",
            "effects": [
              "自己的闪在任意回合使用均合格；别人的闪必须在自己的回合。不要只检查杀的使用者或只检查自己成为杀目标。",
              "每次实际闪使用各给一次选择：双闪产生两次真实使用时可获得两张；技能防止伤害、失去体力、未实际使用闪均不能伪造触发。虚拟/转化闪按真正闪使用事件处理，不要求有闪的实体材料。",
              "取得的是当时牌堆顶1张实体牌，置于专属牌堆，不进手牌，不属于摸牌，也不是从使用者获得其闪；未消费的钤跨回合保留。",
              "花费1张钤只令该其他角色本出牌阶段正常杀次数上限减少1；不会禁用所有牌、限制某色牌、无效已有杀或附送杀。无钤不能支付。",
              "通常1次额度减为0；若另有有限加次数效果，按上限加减合成。真正无次数限制仍可出杀；杀使用后返还次数不能使原本不合法的零额度第一杀合法。",
              "效果作用于这个具体出牌阶段，到阶段结束清除；额外出牌阶段须重新消费钤才有新的限制。持有多钤不等于自动全耗，也无上限囤积张数。",
              "移去钤不等同于弃自己的手牌或装备；正常杀回应决斗等打出杀不消耗出牌阶段使用额度。"
            ],
            "source_refs": [
              "mobile-caozhen",
              "bwiki-caozhen",
              "bwiki-sidi-detail",
              "xiaomi-caozhen"
            ],
            "official_panel_hidden": false,
            "raw_evidence": {
              "path": "evidence/mobile-caozhen.html",
              "line": 186,
              "rule_sha256": "5ba2544bfaec512b1f7f2ae8a898f9800f8f919de1cbd974d81d6efc0d1005fb"
            },
            "limited_marker": null,
            "awakening_marker": null
          }
        ],
        "ui_requirements": [
          "钤以真实卡牌ID/牌堆计数显示；取得提示明确为置牌，不播放摸牌。",
          "每个合格闪事件只向曹真给可选提示；对方出牌阶段开始才询问消费1张。",
          "被限制角色显示本阶段杀额度修正-1；仍正确显示连弩/无限杀与主动额外次数。"
        ],
        "rule_expansion_notes": [
          "官方钤与社区司敌牌为同一实体标记堆的命名差异。",
          "所选原版不包含OL禁同色牌/阶段末视为杀，也不包含移动界曹真预测目标机制。",
          "特殊牌堆可见性及异游戏复制/失去技能的存储生命周期仅按明确H6/H7宿主政策，不宣称客户端实测。"
        ],
        "host_policy_refs": [
          "H0",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "H7"
        ]
      },
      "signature_sha256": "48bf646d73986edf3d22423e44f70c25e2b0bc71da038e4524bad6c374855711",
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 108,
      "source_alias_records_checked": 7,
      "original_alias_records_checked": 1,
      "comparison_basis": "Full108 playable templates plus7 source merges and1 original merge;464 selected pairwise comparisons; complete bundles remain distinct."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-caozhen",
        "tier": "official_same_product_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-174.html",
        "raw_path": "evidence/mobile-caozhen.html",
        "sha256": "9d66c82b652ada4b80774ccb5152f5e826da55ed0b9e8d7c9ab4639a6ab3b8a7",
        "current_client_verified": false
      },
      {
        "id": "bwiki-caozhen",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E7%9C%9F",
        "raw_path": "evidence/bwiki-caozhen.html",
        "sha256": "5754e502e96f983fd54a1d2ca276f232848812af77272841e5a7a7927abff286",
        "current_client_verified": false
      },
      {
        "id": "bwiki-sidi-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E5%8F%B8%E6%95%8C/%E6%9B%B9%E7%9C%9F",
        "raw_path": "evidence/bwiki-sidi-detail.html",
        "sha256": "b28ce3792d2936b6ca70d4ef2b5e8249b88aaf39b1b41a5ddfd5e8857b5720aa",
        "current_client_verified": false
      },
      {
        "id": "xiaomi-caozhen",
        "tier": "same_product_mobile_distribution_guide",
        "url": "https://game.xiaomi.com/viewpoint/1195705742_1783658213393_100",
        "raw_path": "evidence/xiaomi-caozhen.html",
        "sha256": "6ea6de5c528fb48852efc93f5ada08c83d4febc2ba87c9511f3bf74f52ad0382",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局是宿主初始化。H1–H7明示真实事件、原子支付、同时锁定与公开快照、外国牌值、额外阶段跳过台账、异游戏复制及公开实体钤牌堆。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "zhuhuan",
    "id": "sgs.adapted.base.hero.zhu-huan",
    "source_name": "朱桓",
    "suggested_display_name": "朱桓",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
    "gender": "male",
    "source_faction": "吴",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 181,
    "source_refs": [
      "mobile-zhuhuan",
      "bwiki-zhuhuan"
    ],
    "intrinsic_skill_inventory": [
      "奋励",
      "平寇"
    ],
    "skill_ids": [
      "sgs.fenli",
      "sgs.pingkou"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.fenli",
        "name": "奋励",
        "type": "optional_phase_skip_by_global_maximum",
        "timing": "自己摸牌/出牌/弃牌阶段将开始之前分别检查",
        "quota": "每个真实阶段各一次选择，三种条件独立，不是每回合任选一种",
        "cost": "跳过对应整个阶段；不弃置牌、不失去体力",
        "targets": "自己",
        "effects": [
          "摸牌阶段：当前手牌数达到所有存活角色中的最大值即可选择跳过；并列最多可用，0手牌与全场0手牌也满足。",
          "出牌阶段：当前体力值为全场最大即可选择跳过；比较当前HP而非体力上限，允许并列。",
          "弃牌阶段：自己装备区至少有1张，且装备数量为全场最大时才可跳过；全场均0装备仍不可。",
          "条件在对应阶段将开始时重新读取，不在回合开始时统一快照。跳过阶段不执行该阶段的开始/内容/结束技能。",
          "不跳过时阶段正常进行；没有增加摸牌、回复或装备获得等额外收益。已经因其他效果跳过的同一阶段只记录一次。"
        ],
        "source_refs": [
          "mobile-zhuhuan",
          "bwiki-zhuhuan",
          "bwiki-fenli-detail",
          "xiaomi-zhuhuan"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-zhuhuan.html",
          "line": 181,
          "rule_sha256": "fdd2195e9faee2483123d2aa837269de3e4efed5b653645be29056c9cec4c441"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.pingkou",
        "name": "平寇",
        "type": "optional_turn_end_multi_target_damage_from_skipped_phases",
        "timing": "自己的回合结束时，不是结束阶段开始",
        "quota": "每个真实回合末一次，可选0..X名不同其他角色",
        "cost": "无额外成本；X为本回合已实际跳过阶段数",
        "targets": "至多X名存活其他角色，任意阵营和距离；每名只能选择一次",
        "effects": [
          "每个所选角色各受到来自自己的1点普通技能伤害，不是把X点伤害集中到一个人。逐个经过正常伤害、濒死、救援流程。",
          "X计本回合因任何合法原因真正跳过的阶段，不能只累计奋励；兵粮寸断或乐不思蜀实际跳过相应阶段也计入。",
          "没有出牌、没有弃牌、手牌未超上限、摸不到牌，都不自动等于跳过阶段；仅真实skip事件可计数。",
          "翻面导致整个回合未执行不是六个阶段被逐一跳过，不产生一套平寇伤害。技能只在实际拥有回合末窗口时触发。",
          "回合结束的触发不能提前到结束阶段开始；原版不从牌堆取得装备。X=0无可受伤目标。"
        ],
        "source_refs": [
          "mobile-zhuhuan",
          "bwiki-zhuhuan",
          "bwiki-pingkou-detail",
          "mobile-zhuhuan-guide",
          "xiaomi-zhuhuan"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-zhuhuan.html",
          "line": 182,
          "rule_sha256": "0f4ef04b4a379296eb5704662dcf6f1546fe8cb3a9955bcc2595c9d602e58125"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "每种奋励提示列出此时自己的值、全场最大值及对应跳过阶段，允许拒绝。",
      "本回合跳过阶段台账显示原因，平寇在真正回合末选择不同目标并显示每人1点。",
      "不把普通结束出牌按钮当作跳过出牌；不得自动对敌方全体伤害。"
    ],
    "rule_expansion_notes": [
      "只选经典4HP男性吴版本；排除旧诱敌及界版平寇获得装备。",
      "跨游戏增加同名阶段/强制终止的计数采用H5，未发生的未来阶段不可猜算。"
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7"
    ],
    "name": "朱桓",
    "display_name": "朱桓",
    "skill_name": "奋励/平寇",
    "skill_desc": "奋励：摸牌阶段：当前手牌数达到所有存活角色中的最大值即可选择跳过；并列最多可用，0手牌与全场0手牌也满足。 出牌阶段：当前体力值为全场最大即可选择跳过；比较当前HP而非体力上限，允许并列。 弃牌阶段：自己装备区至少有1张，且装备数量为全场最大时才可跳过；全场均0装备仍不可。 条件在对应阶段将开始时重新读取，不在回合开始时统一快照。跳过阶段不执行该阶段的开始/内容/结束技能。 不跳过时阶段正常进行；没有增加摸牌、回复或装备获得等额外收益。已经因其他效果跳过的同一阶段只记录一次。 平寇：每个所选角色各受到来自自己的1点普通技能伤害，不是把X点伤害集中到一个人。逐个经过正常伤害、濒死、救援流程。 X计本回合因任何合法原因真正跳过的阶段，不能只累计奋励；兵粮寸断或乐不思蜀实际跳过相应阶段也计入。 没有出牌、没有弃牌、手牌未超上限、摸不到牌，都不自动等于跳过阶段；仅真实skip事件可计数。 翻面导致整个回合未执行不是六个阶段被逐一跳过，不产生一套平寇伤害。技能只在实际拥有回合末窗口时触发。 回合结束的触发不能提前到结束阶段开始；原版不从牌堆取得装备。X=0无可受伤目标。",
    "source_character_name": "朱桓",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "吴",
    "source_id_aliases": [],
    "aliases": [
      "三国杀朱桓",
      "zhu-huan",
      "zhuhuan",
      "朱桓·奋励/平寇"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-181.html",
      "https://wiki.biligame.com/msgs/%E6%9C%B1%E6%A1%93",
      "https://wiki.biligame.com/msgs/%E5%A5%8B%E5%8A%B1/%E6%9C%B1%E6%A1%93",
      "https://game.xiaomi.com/viewpoint/1127866428_1589198928352_16",
      "https://wiki.biligame.com/msgs/%E5%B9%B3%E5%AF%87/%E6%9C%B1%E6%A1%93",
      "https://www.sanguosha.cn/pc/guide-info-47.html"
    ],
    "source_records": [
      {
        "id": "mobile-zhuhuan",
        "url": "https://www.sanguosha.cn/pc/hero-detail-181.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-181.html",
        "status": 200,
        "bytes": 21013,
        "sha256": "186e90e8fef9100ae693d24bcbb7241e27ff4390b93af62025e7b02f3ee81ab6",
        "accessed_at": "2026-10-16T00:53:27.748652+00:00",
        "raw_path": "evidence/mobile-zhuhuan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_identity_catalog",
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
                  "name": "奋励",
                  "hidden": false,
                  "raw_rule_text": "若你的手牌数为全场最多，你可以跳过摸牌阶段；若你的体力值为全场最多，你可以跳过出牌阶段；若你的装备区里有牌且数量为全场最多，你可以跳过弃牌阶段。",
                  "html_line": 181,
                  "rule_sha256": "fdd2195e9faee2483123d2aa837269de3e4efed5b653645be29056c9cec4c441"
                },
                {
                  "name": "平寇",
                  "hidden": true,
                  "raw_rule_text": "回合结束时，你可以对至多X名其他角色各造成1点伤害（X为你本回合跳过的阶段数）。",
                  "html_line": 182,
                  "rule_sha256": "0f4ef04b4a379296eb5704662dcf6f1546fe8cb3a9955bcc2595c9d602e58125"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "faction": "吴",
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "官方目录未标注规则生效日期；未验证客户端。",
          "已读取隐藏技能栏；页面没有独立体力数值或性别字段。"
        ]
      },
      {
        "id": "bwiki-zhuhuan",
        "url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E6%A1%93",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E6%A1%93",
        "status": 200,
        "bytes": 95904,
        "sha256": "ca9f1870abe02b5fa593e0ed3c7710c377d618e559dd754434bccd8ddb7eee7e",
        "accessed_at": "2026-10-16T00:53:30.860906+00:00",
        "raw_path": "evidence/bwiki-zhuhuan.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 36203,
        "modified_at": "2026-01-23T17:18:36Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "吴",
          "selected_section": "经典",
          "hp_html_line": 632,
          "gender_html_line": 627,
          "faction_html_line": 628,
          "initial_hp_explicit": null
        }
      },
      {
        "id": "bwiki-fenli-detail",
        "url": "https://wiki.biligame.com/msgs/%E5%A5%8B%E5%8A%B1/%E6%9C%B1%E6%A1%93",
        "final_url": "https://wiki.biligame.com/msgs/%E5%A5%8B%E5%8A%B1/%E6%9C%B1%E6%A1%93",
        "status": 200,
        "bytes": 72739,
        "sha256": "3eeff1e171c4b6fcab760f6fc781142a92e449af65608b47c4a718b28fce87a6",
        "accessed_at": "2026-10-16T00:54:26.947956+00:00",
        "raw_path": "evidence/bwiki-fenli-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 38821,
        "modified_at": "2026-06-07T03:24:16Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      },
      {
        "id": "xiaomi-zhuhuan",
        "url": "https://game.xiaomi.com/viewpoint/1127866428_1589198928352_16",
        "final_url": "https://game.xiaomi.com/viewpoint/1127866428_1589198928352_16",
        "status": 200,
        "bytes": 58098,
        "sha256": "63bd7b5826e3881f98340d5f5927ea22f71fad2616e9ae85de307c09b57e0f61",
        "accessed_at": "2026-10-16T00:55:40.068511+00:00",
        "raw_path": "evidence/xiaomi-zhuhuan.html",
        "current_client_verified": false,
        "publication_date": "2020-05-11",
        "tier": "same_product_mobile_distribution_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "奋励允许并列最多；平寇无距离限制，不可重复同一目标。"
        ],
        "limitations": [
          "社区攻略，非客户端或官方规则FAQ。"
        ]
      },
      {
        "id": "bwiki-pingkou-detail",
        "url": "https://wiki.biligame.com/msgs/%E5%B9%B3%E5%AF%87/%E6%9C%B1%E6%A1%93",
        "final_url": "https://wiki.biligame.com/msgs/%E5%B9%B3%E5%AF%87/%E6%9C%B1%E6%A1%93",
        "status": 200,
        "bytes": 70425,
        "sha256": "13085df5431f5b2dba6096edab05f3fa8adce106b00120d9b38716e5c87a5f5c",
        "accessed_at": "2026-10-16T00:54:27.423800+00:00",
        "raw_path": "evidence/bwiki-pingkou-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 36206,
        "modified_at": "2026-01-23T17:19:49Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      },
      {
        "id": "mobile-zhuhuan-guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-47.html",
        "final_url": "https://www.sanguosha.cn/pc/guide-info-47.html",
        "status": 200,
        "bytes": 33458,
        "sha256": "9c548e3801b71be30c54c85f8454bb771267f39b1c960047526d58d1ef200962",
        "accessed_at": "2026-10-16T00:54:33.031204+00:00",
        "raw_path": "evidence/mobile-zhuhuan-guide.html",
        "current_client_verified": false,
        "publication_date": "2020-06-12T15:32:49+08:00",
        "tier": "official_same_product_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "跳弃牌阶段保留手牌；三个不同目标各1伤害；乐不思蜀的跳阶段也能构成优势。"
        ],
        "limitations": [
          "战略攻略不是精确时序FAQ；仅作机制佐证。"
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.fenli",
        "name": "奋励",
        "type": "optional_phase_skip_by_global_maximum",
        "timing": "自己摸牌/出牌/弃牌阶段将开始之前分别检查",
        "quota": "每个真实阶段各一次选择，三种条件独立，不是每回合任选一种",
        "cost": "跳过对应整个阶段；不弃置牌、不失去体力",
        "targets": "自己",
        "effects": [
          "摸牌阶段：当前手牌数达到所有存活角色中的最大值即可选择跳过；并列最多可用，0手牌与全场0手牌也满足。",
          "出牌阶段：当前体力值为全场最大即可选择跳过；比较当前HP而非体力上限，允许并列。",
          "弃牌阶段：自己装备区至少有1张，且装备数量为全场最大时才可跳过；全场均0装备仍不可。",
          "条件在对应阶段将开始时重新读取，不在回合开始时统一快照。跳过阶段不执行该阶段的开始/内容/结束技能。",
          "不跳过时阶段正常进行；没有增加摸牌、回复或装备获得等额外收益。已经因其他效果跳过的同一阶段只记录一次。"
        ],
        "source_refs": [
          "mobile-zhuhuan",
          "bwiki-zhuhuan",
          "bwiki-fenli-detail",
          "xiaomi-zhuhuan"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-zhuhuan.html",
          "line": 181,
          "rule_sha256": "fdd2195e9faee2483123d2aa837269de3e4efed5b653645be29056c9cec4c441"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.pingkou",
        "name": "平寇",
        "type": "optional_turn_end_multi_target_damage_from_skipped_phases",
        "timing": "自己的回合结束时，不是结束阶段开始",
        "quota": "每个真实回合末一次，可选0..X名不同其他角色",
        "cost": "无额外成本；X为本回合已实际跳过阶段数",
        "targets": "至多X名存活其他角色，任意阵营和距离；每名只能选择一次",
        "effects": [
          "每个所选角色各受到来自自己的1点普通技能伤害，不是把X点伤害集中到一个人。逐个经过正常伤害、濒死、救援流程。",
          "X计本回合因任何合法原因真正跳过的阶段，不能只累计奋励；兵粮寸断或乐不思蜀实际跳过相应阶段也计入。",
          "没有出牌、没有弃牌、手牌未超上限、摸不到牌，都不自动等于跳过阶段；仅真实skip事件可计数。",
          "翻面导致整个回合未执行不是六个阶段被逐一跳过，不产生一套平寇伤害。技能只在实际拥有回合末窗口时触发。",
          "回合结束的触发不能提前到结束阶段开始；原版不从牌堆取得装备。X=0无可受伤目标。"
        ],
        "source_refs": [
          "mobile-zhuhuan",
          "bwiki-zhuhuan",
          "bwiki-pingkou-detail",
          "mobile-zhuhuan-guide",
          "xiaomi-zhuhuan"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-zhuhuan.html",
          "line": 182,
          "rule_sha256": "0f4ef04b4a379296eb5704662dcf6f1546fe8cb3a9955bcc2595c9d602e58125"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.fenli",
      "sgs.pingkou"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.fenli",
      "sgs.pingkou"
    ],
    "complete_skill_names": [
      "奋励",
      "平寇"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization",
        "rule": "本地默认初始HP=maxHP；公开页仅核实maxHP，不把默认值伪装独立初始HP字段。"
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "使用真实actor、卡牌ID/location epoch和阶段/回合ID；提交前复核有效技能、费用、目标、次数。取消或失效输入不支付，已支付不回滚；事件精确一次。"
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "结算遵循现有死亡/濒死/比赛结束处理；死者不可成为新目标，终局停止后续非必要结算。已真实提交的伤害与支付保留日志。"
      },
      {
        "id": "H3",
        "category": "host_order_and_privacy",
        "rule": "同窗口多技能、多人伤害与摸牌遵守宿主一致的行动顺序；盲手牌以不透明槽选择；怃戎双方锁定前不公开，AI不得读对手锁定选择。回放不重复收费/摸牌。"
      },
      {
        "id": "H4",
        "category": "host_foreign_card_values",
        "rule": "外国血杀/毒杀/刺杀接入宿主统一杀族；非原生无色判定既非红也非黑，不伪造一支效果。类别映射显式限定为基本/锦囊/装备，延时属锦囊。"
      },
      {
        "id": "H5",
        "category": "host_extra_phase_accounting",
        "rule": "以实际被跳过的phase occurrence计数，同一阶段多原因只计1。额外阶段若被正式跳过可计1；直接结束/截断回合不把未来未到达阶段猜作跳过。被翻面整回合跳过不构造阶段记录。"
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "按现有effective-hero路由完整复制多分支技能，不复制HP/性别/势力。陈群自己的回合历史独立于技能是否当时有效，复制/重得不清掉同actor限制；曹真实体堆作为actor状态保留但技能失效不能操作，死亡按普通离场清理。异游戏多重转换只采用宿主统一优先级，不宣称手游原生组合。"
      },
      {
        "id": "H7",
        "category": "host_pile_and_deck",
        "rule": "钤为宿主专属公开牌堆，显示实体与数量，移去按pile removal进入弃牌堆而非手牌弃置；这是显式宿主存储/可见性政策。牌堆空时用正常重洗；仍无法提供则实际获得0，不制造牌。永久移除/技能替换时按同一宿主规则清理，不能暗中重置次数。"
      }
    ],
    "portrait_path": "./portraits-sgs-followup/zhu-huan.svg",
    "gender_provenance": {
      "source": "bwiki-zhuhuan",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "source": "bwiki-zhuhuan",
      "metadata": {
        "max_hp": 4,
        "hp_icon_count": 4,
        "hp_numeric": 4,
        "gender": "male",
        "faction": "吴",
        "selected_section": "经典",
        "hp_html_line": 632,
        "gender_html_line": 627,
        "faction_html_line": 628,
        "initial_hp_explicit": null
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "faction": "吴",
      "source_faction": "吴",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0",
        "detail": "独立初始体力字段未知；H0满体力开局仅为宿主初始化。"
      },
      {
        "field": "current_client",
        "status": "unverified",
        "detail": "未实测2026当前移动客户端。"
      },
      {
        "field": "cross_game",
        "status": "explicit_host_policy",
        "detail": "公开钤牌堆、额外阶段账本、异游戏复制及转换优先级见H0–H7，不冒充原生客户端认证。"
      }
    ],
    "source_evidence_note": "同产品移动官网基础身份目录核对全部固有面板；最大体力、性别与经典细化来自移动BWIKI；小米同产品攻略只作选定原版边界佐证。官网旧张嶷攻略只补怃戎，未采用旧全局矢志。",
    "source_equivalence": {
      "signature": {
        "key": "zhuhuan",
        "id": "sgs.adapted.base.hero.zhu-huan",
        "source_name": "朱桓",
        "suggested_display_name": "朱桓",
        "max_hp": 4,
        "starting_hp": 4,
        "starting_hp_direct_source_value": null,
        "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
        "gender": "male",
        "source_faction": "吴",
        "product": "三国杀移动版",
        "variant": "mobile-base-identity-catalog-2026-10-15",
        "official_page_id": 181,
        "source_refs": [
          "mobile-zhuhuan",
          "bwiki-zhuhuan"
        ],
        "intrinsic_skill_inventory": [
          "奋励",
          "平寇"
        ],
        "skill_ids": [
          "sgs.fenli",
          "sgs.pingkou"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "all_intrinsic_panels_verified": true,
        "current_client_rules_verified": false,
        "current_client_hp_verified": false,
        "source_inventory_ready": true,
        "implementation_status": "research_only",
        "readiness": "source_ready_with_explicit_host_requirements",
        "intrinsic_unresolved": [],
        "skills": [
          {
            "id": "sgs.fenli",
            "name": "奋励",
            "type": "optional_phase_skip_by_global_maximum",
            "timing": "自己摸牌/出牌/弃牌阶段将开始之前分别检查",
            "quota": "每个真实阶段各一次选择，三种条件独立，不是每回合任选一种",
            "cost": "跳过对应整个阶段；不弃置牌、不失去体力",
            "targets": "自己",
            "effects": [
              "摸牌阶段：当前手牌数达到所有存活角色中的最大值即可选择跳过；并列最多可用，0手牌与全场0手牌也满足。",
              "出牌阶段：当前体力值为全场最大即可选择跳过；比较当前HP而非体力上限，允许并列。",
              "弃牌阶段：自己装备区至少有1张，且装备数量为全场最大时才可跳过；全场均0装备仍不可。",
              "条件在对应阶段将开始时重新读取，不在回合开始时统一快照。跳过阶段不执行该阶段的开始/内容/结束技能。",
              "不跳过时阶段正常进行；没有增加摸牌、回复或装备获得等额外收益。已经因其他效果跳过的同一阶段只记录一次。"
            ],
            "source_refs": [
              "mobile-zhuhuan",
              "bwiki-zhuhuan",
              "bwiki-fenli-detail",
              "xiaomi-zhuhuan"
            ],
            "official_panel_hidden": false,
            "raw_evidence": {
              "path": "evidence/mobile-zhuhuan.html",
              "line": 181,
              "rule_sha256": "fdd2195e9faee2483123d2aa837269de3e4efed5b653645be29056c9cec4c441"
            },
            "limited_marker": null,
            "awakening_marker": null
          },
          {
            "id": "sgs.pingkou",
            "name": "平寇",
            "type": "optional_turn_end_multi_target_damage_from_skipped_phases",
            "timing": "自己的回合结束时，不是结束阶段开始",
            "quota": "每个真实回合末一次，可选0..X名不同其他角色",
            "cost": "无额外成本；X为本回合已实际跳过阶段数",
            "targets": "至多X名存活其他角色，任意阵营和距离；每名只能选择一次",
            "effects": [
              "每个所选角色各受到来自自己的1点普通技能伤害，不是把X点伤害集中到一个人。逐个经过正常伤害、濒死、救援流程。",
              "X计本回合因任何合法原因真正跳过的阶段，不能只累计奋励；兵粮寸断或乐不思蜀实际跳过相应阶段也计入。",
              "没有出牌、没有弃牌、手牌未超上限、摸不到牌，都不自动等于跳过阶段；仅真实skip事件可计数。",
              "翻面导致整个回合未执行不是六个阶段被逐一跳过，不产生一套平寇伤害。技能只在实际拥有回合末窗口时触发。",
              "回合结束的触发不能提前到结束阶段开始；原版不从牌堆取得装备。X=0无可受伤目标。"
            ],
            "source_refs": [
              "mobile-zhuhuan",
              "bwiki-zhuhuan",
              "bwiki-pingkou-detail",
              "mobile-zhuhuan-guide",
              "xiaomi-zhuhuan"
            ],
            "official_panel_hidden": true,
            "raw_evidence": {
              "path": "evidence/mobile-zhuhuan.html",
              "line": 182,
              "rule_sha256": "0f4ef04b4a379296eb5704662dcf6f1546fe8cb3a9955bcc2595c9d602e58125"
            },
            "limited_marker": null,
            "awakening_marker": null
          }
        ],
        "ui_requirements": [
          "每种奋励提示列出此时自己的值、全场最大值及对应跳过阶段，允许拒绝。",
          "本回合跳过阶段台账显示原因，平寇在真正回合末选择不同目标并显示每人1点。",
          "不把普通结束出牌按钮当作跳过出牌；不得自动对敌方全体伤害。"
        ],
        "rule_expansion_notes": [
          "只选经典4HP男性吴版本；排除旧诱敌及界版平寇获得装备。",
          "跨游戏增加同名阶段/强制终止的计数采用H5，未发生的未来阶段不可猜算。"
        ],
        "host_policy_refs": [
          "H0",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "H7"
        ]
      },
      "signature_sha256": "1209256c913090b2ca6c20f3880e5d500b8c3273d5de15f917f1b9d394c82a38",
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 108,
      "source_alias_records_checked": 7,
      "original_alias_records_checked": 1,
      "comparison_basis": "Full108 playable templates plus7 source merges and1 original merge;464 selected pairwise comparisons; complete bundles remain distinct."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-zhuhuan",
        "tier": "official_same_product_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-181.html",
        "raw_path": "evidence/mobile-zhuhuan.html",
        "sha256": "186e90e8fef9100ae693d24bcbb7241e27ff4390b93af62025e7b02f3ee81ab6",
        "current_client_verified": false
      },
      {
        "id": "bwiki-zhuhuan",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E6%9C%B1%E6%A1%93",
        "raw_path": "evidence/bwiki-zhuhuan.html",
        "sha256": "ca9f1870abe02b5fa593e0ed3c7710c377d618e559dd754434bccd8ddb7eee7e",
        "current_client_verified": false
      },
      {
        "id": "bwiki-fenli-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E5%A5%8B%E5%8A%B1/%E6%9C%B1%E6%A1%93",
        "raw_path": "evidence/bwiki-fenli-detail.html",
        "sha256": "3eeff1e171c4b6fcab760f6fc781142a92e449af65608b47c4a718b28fce87a6",
        "current_client_verified": false
      },
      {
        "id": "xiaomi-zhuhuan",
        "tier": "same_product_mobile_distribution_guide",
        "url": "https://game.xiaomi.com/viewpoint/1127866428_1589198928352_16",
        "raw_path": "evidence/xiaomi-zhuhuan.html",
        "sha256": "63bd7b5826e3881f98340d5f5927ea22f71fad2616e9ae85de307c09b57e0f61",
        "current_client_verified": false
      },
      {
        "id": "bwiki-pingkou-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E5%B9%B3%E5%AF%87/%E6%9C%B1%E6%A1%93",
        "raw_path": "evidence/bwiki-pingkou-detail.html",
        "sha256": "13085df5431f5b2dba6096edab05f3fa8adce106b00120d9b38716e5c87a5f5c",
        "current_client_verified": false
      },
      {
        "id": "mobile-zhuhuan-guide",
        "tier": "official_same_product_guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-47.html",
        "raw_path": "evidence/mobile-zhuhuan-guide.html",
        "sha256": "9c548e3801b71be30c54c85f8454bb771267f39b1c960047526d58d1ef200962",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局是宿主初始化。H1–H7明示真实事件、原子支付、同时锁定与公开快照、外国牌值、额外阶段跳过台账、异游戏复制及公开实体钤牌堆。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "chenqun",
    "id": "sgs.adapted.base.hero.chen-qun",
    "source_name": "陈群",
    "suggested_display_name": "陈群",
    "max_hp": 3,
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
    "gender": "male",
    "source_faction": "魏",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 176,
    "source_refs": [
      "mobile-chenqun",
      "bwiki-chenqun"
    ],
    "intrinsic_skill_inventory": [
      "定品",
      "法恩"
    ],
    "skill_ids": [
      "sgs.dingpin",
      "sgs.faen"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.dingpin",
        "name": "定品",
        "type": "active_hand_type_history_cost_wounded_judgment",
        "timing": "自己真实出牌阶段动作窗口",
        "quota": "无独立一次限制；本回合每个已用/已弃类别不可再支付；判黑目标本回合不能再选",
        "cost": "恰好1张可弃置手牌，其基本/锦囊/装备类别此前未被自己在本回合使用或弃置",
        "targets": "1名当前已受伤的存活角色，包含自己，无阵营距离限制",
        "effects": [
          "类别为基本、锦囊、装备三大类，不是杀/闪等牌名，也不是花色；普通与延时锦囊属于同一大类。已安装装备不能作为支付，判定区/私有牌堆也不能。",
          "历史记录包括本回合其他阶段发生的自己的使用/弃置，并包括定品本次成功弃置的成本；给牌、获得、重铸、纯响应打出不自动充当弃置或使用。正常使用式无懈属于使用。",
          "目标是判定角色，采用该角色自己的有效判定花色/颜色及正常改判流程；不把判定归陈群，也不绕开天妒等判定后机制。",
          "最终判定黑色：目标摸其当前已损失体力值张牌，随后该目标被本回合定品禁选；不设3张上限，不按当前HP摸。",
          "最终判定红色：陈群翻面，正变反或反变正，目标没有黑色禁选标记，可用另一未消耗类别再选。翻面本身不立即终止当前出牌阶段。",
          "定品成功弃掉的类别在同一回合一直占用，红色也不返还；额外出牌阶段不重置，下一真实回合重置。三大类最多支持3次，若已有其他使用/弃置则更少。",
          "黑色成功目标限制独立于成本类别限制；一人黑色后仍可对另一受伤角色用其他类别。禁止偷用界陈群无伤目标/非手牌成本/红桃不计类别。"
        ],
        "source_refs": [
          "mobile-chenqun",
          "bwiki-chenqun",
          "bwiki-dingpin-detail",
          "xiaomi-chenqun"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-chenqun.html",
          "line": 184,
          "rule_sha256": "09810b23d773fa308827aed628c5d47610dd583da26b7cf98db256b1a9ec3fce"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.faen",
        "name": "法恩",
        "type": "optional_draw_after_flip_or_enter_chain",
        "timing": "任一角色实际翻面后，或从未横置变为横置后",
        "quota": "每次真实状态变化均可选，无每回合上限",
        "cost": "无",
        "targets": "固定为刚变化的角色，包含自己和敌人",
        "effects": [
          "翻面两个方向均能触发；只允许翻回正面的规则属于其他版本，不能套用。自己的定品判红翻面也可法恩摸1。",
          "横置指进入连环状态；解除横置不触发。只播放铁索效果但状态未改变不得虚构触发。",
          "接受后仅该状态变化角色摸1，陈群不能把这张牌转给第三人。多名角色分别横置时各有独立事件与可选机会。",
          "技能造成的横置与牌造成的横置均可；实际复原若改变了正反面可触发翻面分支，解除连环本身仍不给法恩。"
        ],
        "source_refs": [
          "mobile-chenqun",
          "bwiki-chenqun",
          "bwiki-faen-detail"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-chenqun.html",
          "line": 185,
          "rule_sha256": "841bd38a4fefb7cb878e21998a76fe648b5cdbb7c1cea741fcb130c5e638c100"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "定品按钮显示本回合已使用/弃置的三大类别、可付手牌和已判黑禁选目标；不能只做三次按钮计数。",
      "判定牌归目标，显示最终判色和黑色摸牌数量，红色显示陈群真实翻面。",
      "法恩询问归陈群，目标固定；每次翻面/入链独立可拒绝。"
    ],
    "rule_expansion_notes": [
      "官方法恩简写铁索连环由同产品经典精确条目横置补足，排除解除连环。",
      "跨游戏异色/无色判定及复制技能历史采用H4/H6；不据此声称原手游存在无色判定。"
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7"
    ],
    "name": "陈群",
    "display_name": "陈群",
    "skill_name": "定品/法恩",
    "skill_desc": "定品：类别为基本、锦囊、装备三大类，不是杀/闪等牌名，也不是花色；普通与延时锦囊属于同一大类。已安装装备不能作为支付，判定区/私有牌堆也不能。 历史记录包括本回合其他阶段发生的自己的使用/弃置，并包括定品本次成功弃置的成本；给牌、获得、重铸、纯响应打出不自动充当弃置或使用。正常使用式无懈属于使用。 目标是判定角色，采用该角色自己的有效判定花色/颜色及正常改判流程；不把判定归陈群，也不绕开天妒等判定后机制。 最终判定黑色：目标摸其当前已损失体力值张牌，随后该目标被本回合定品禁选；不设3张上限，不按当前HP摸。 最终判定红色：陈群翻面，正变反或反变正，目标没有黑色禁选标记，可用另一未消耗类别再选。翻面本身不立即终止当前出牌阶段。 定品成功弃掉的类别在同一回合一直占用，红色也不返还；额外出牌阶段不重置，下一真实回合重置。三大类最多支持3次，若已有其他使用/弃置则更少。 黑色成功目标限制独立于成本类别限制；一人黑色后仍可对另一受伤角色用其他类别。禁止偷用界陈群无伤目标/非手牌成本/红桃不计类别。 法恩：翻面两个方向均能触发；只允许翻回正面的规则属于其他版本，不能套用。自己的定品判红翻面也可法恩摸1。 横置指进入连环状态；解除横置不触发。只播放铁索效果但状态未改变不得虚构触发。 接受后仅该状态变化角色摸1，陈群不能把这张牌转给第三人。多名角色分别横置时各有独立事件与可选机会。 技能造成的横置与牌造成的横置均可；实际复原若改变了正反面可触发翻面分支，解除连环本身仍不给法恩。",
    "source_character_name": "陈群",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "魏",
    "source_id_aliases": [],
    "aliases": [
      "三国杀陈群",
      "chen-qun",
      "chenqun",
      "陈群·定品/法恩"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-176.html",
      "https://wiki.biligame.com/msgs/%E9%99%88%E7%BE%A4",
      "https://wiki.biligame.com/msgs/%E5%AE%9A%E5%93%81/%E9%99%88%E7%BE%A4",
      "https://game.xiaomi.com/viewpoint/1195705742_1704875670654_100",
      "https://wiki.biligame.com/msgs/%E6%B3%95%E6%81%A9/%E9%99%88%E7%BE%A4"
    ],
    "source_records": [
      {
        "id": "mobile-chenqun",
        "url": "https://www.sanguosha.cn/pc/hero-detail-176.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-176.html",
        "status": 200,
        "bytes": 21481,
        "sha256": "732ad3346d767e2ad1498cfdba892ac3a0a66fa1c012780fcd952a2024c45890",
        "accessed_at": "2026-10-16T00:53:27.422693+00:00",
        "raw_path": "evidence/mobile-chenqun.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_identity_catalog",
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
                  "name": "定品",
                  "hidden": false,
                  "raw_rule_text": "出牌阶段，你可以弃置一张手牌（不能是你本回合使用或弃置过的类型）并选择一名已受伤的角色，令其进行判定，若结果为：黑色，该角色摸X张牌（X为其已损失的体力值），然后你于此回合内不能对其发动\"定品\"；红色，你翻面。",
                  "html_line": 184,
                  "rule_sha256": "09810b23d773fa308827aed628c5d47610dd583da26b7cf98db256b1a9ec3fce"
                },
                {
                  "name": "法恩",
                  "hidden": true,
                  "raw_rule_text": "当一名角色翻面或铁索连环后，你可以令其摸一张牌。",
                  "html_line": 185,
                  "rule_sha256": "841bd38a4fefb7cb878e21998a76fe648b5cdbb7c1cea741fcb130c5e638c100"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "faction": "魏",
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "官方目录未标注规则生效日期；未验证客户端。",
          "已读取隐藏技能栏；页面没有独立体力数值或性别字段。"
        ]
      },
      {
        "id": "bwiki-chenqun",
        "url": "https://wiki.biligame.com/msgs/%E9%99%88%E7%BE%A4",
        "final_url": "https://wiki.biligame.com/msgs/%E9%99%88%E7%BE%A4",
        "status": 200,
        "bytes": 81042,
        "sha256": "97ee0184c46dab4d4592a98599abc2f545a45a2056bfaac8d43f9490559ba24a",
        "accessed_at": "2026-10-16T00:53:30.782667+00:00",
        "raw_path": "evidence/bwiki-chenqun.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 33890,
        "modified_at": "2025-10-26T06:22:09Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "魏",
          "selected_section": "经典",
          "hp_html_line": 633,
          "gender_html_line": 628,
          "faction_html_line": 629,
          "initial_hp_explicit": null
        }
      },
      {
        "id": "bwiki-dingpin-detail",
        "url": "https://wiki.biligame.com/msgs/%E5%AE%9A%E5%93%81/%E9%99%88%E7%BE%A4",
        "final_url": "https://wiki.biligame.com/msgs/%E5%AE%9A%E5%93%81/%E9%99%88%E7%BE%A4",
        "status": 200,
        "bytes": 68031,
        "sha256": "844676ba4982ceb61fa29237eb49b43a55b44ff9db9cc98f5f1fc316090de63d",
        "accessed_at": "2026-10-16T00:54:27.685972+00:00",
        "raw_path": "evidence/bwiki-dingpin-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 10892,
        "modified_at": "2022-09-17T07:43:56Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      },
      {
        "id": "xiaomi-chenqun",
        "url": "https://game.xiaomi.com/viewpoint/1195705742_1704875670654_100",
        "final_url": "https://game.xiaomi.com/viewpoint/1195705742_1704875670654_100",
        "status": 200,
        "bytes": 36473,
        "sha256": "ebf79e57ccdb448c36822c03adb29e1e7be0f41393b3f4593a1f4a6f8a268ce9",
        "accessed_at": "2026-10-16T00:55:39.903288+00:00",
        "raw_path": "evidence/xiaomi-chenqun.html",
        "current_client_verified": false,
        "publication_date": "2024-01-10",
        "tier": "same_product_mobile_distribution_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "明确比较原版与界：原版只弃手牌、只选受伤者、按损失体力摸牌、红色均翻面。"
        ],
        "limitations": [
          "界陈群主体文章，仅使用明确写明原版的对比；不混入界版红桃返还类型、体力值至多3等效果。"
        ]
      },
      {
        "id": "bwiki-faen-detail",
        "url": "https://wiki.biligame.com/msgs/%E6%B3%95%E6%81%A9/%E9%99%88%E7%BE%A4",
        "final_url": "https://wiki.biligame.com/msgs/%E6%B3%95%E6%81%A9/%E9%99%88%E7%BE%A4",
        "status": 200,
        "bytes": 67928,
        "sha256": "fcae2f4f1e523167828838c6f672759bbb9ae4927e9bcbaf0fb64368eb47bba5",
        "accessed_at": "2026-10-16T00:54:27.652596+00:00",
        "raw_path": "evidence/bwiki-faen-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 10890,
        "modified_at": "2022-09-17T07:42:57Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.dingpin",
        "name": "定品",
        "type": "active_hand_type_history_cost_wounded_judgment",
        "timing": "自己真实出牌阶段动作窗口",
        "quota": "无独立一次限制；本回合每个已用/已弃类别不可再支付；判黑目标本回合不能再选",
        "cost": "恰好1张可弃置手牌，其基本/锦囊/装备类别此前未被自己在本回合使用或弃置",
        "targets": "1名当前已受伤的存活角色，包含自己，无阵营距离限制",
        "effects": [
          "类别为基本、锦囊、装备三大类，不是杀/闪等牌名，也不是花色；普通与延时锦囊属于同一大类。已安装装备不能作为支付，判定区/私有牌堆也不能。",
          "历史记录包括本回合其他阶段发生的自己的使用/弃置，并包括定品本次成功弃置的成本；给牌、获得、重铸、纯响应打出不自动充当弃置或使用。正常使用式无懈属于使用。",
          "目标是判定角色，采用该角色自己的有效判定花色/颜色及正常改判流程；不把判定归陈群，也不绕开天妒等判定后机制。",
          "最终判定黑色：目标摸其当前已损失体力值张牌，随后该目标被本回合定品禁选；不设3张上限，不按当前HP摸。",
          "最终判定红色：陈群翻面，正变反或反变正，目标没有黑色禁选标记，可用另一未消耗类别再选。翻面本身不立即终止当前出牌阶段。",
          "定品成功弃掉的类别在同一回合一直占用，红色也不返还；额外出牌阶段不重置，下一真实回合重置。三大类最多支持3次，若已有其他使用/弃置则更少。",
          "黑色成功目标限制独立于成本类别限制；一人黑色后仍可对另一受伤角色用其他类别。禁止偷用界陈群无伤目标/非手牌成本/红桃不计类别。"
        ],
        "source_refs": [
          "mobile-chenqun",
          "bwiki-chenqun",
          "bwiki-dingpin-detail",
          "xiaomi-chenqun"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-chenqun.html",
          "line": 184,
          "rule_sha256": "09810b23d773fa308827aed628c5d47610dd583da26b7cf98db256b1a9ec3fce"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.faen",
        "name": "法恩",
        "type": "optional_draw_after_flip_or_enter_chain",
        "timing": "任一角色实际翻面后，或从未横置变为横置后",
        "quota": "每次真实状态变化均可选，无每回合上限",
        "cost": "无",
        "targets": "固定为刚变化的角色，包含自己和敌人",
        "effects": [
          "翻面两个方向均能触发；只允许翻回正面的规则属于其他版本，不能套用。自己的定品判红翻面也可法恩摸1。",
          "横置指进入连环状态；解除横置不触发。只播放铁索效果但状态未改变不得虚构触发。",
          "接受后仅该状态变化角色摸1，陈群不能把这张牌转给第三人。多名角色分别横置时各有独立事件与可选机会。",
          "技能造成的横置与牌造成的横置均可；实际复原若改变了正反面可触发翻面分支，解除连环本身仍不给法恩。"
        ],
        "source_refs": [
          "mobile-chenqun",
          "bwiki-chenqun",
          "bwiki-faen-detail"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-chenqun.html",
          "line": 185,
          "rule_sha256": "841bd38a4fefb7cb878e21998a76fe648b5cdbb7c1cea741fcb130c5e638c100"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.dingpin",
      "sgs.faen"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.dingpin",
      "sgs.faen"
    ],
    "complete_skill_names": [
      "定品",
      "法恩"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization",
        "rule": "本地默认初始HP=maxHP；公开页仅核实maxHP，不把默认值伪装独立初始HP字段。"
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "使用真实actor、卡牌ID/location epoch和阶段/回合ID；提交前复核有效技能、费用、目标、次数。取消或失效输入不支付，已支付不回滚；事件精确一次。"
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "结算遵循现有死亡/濒死/比赛结束处理；死者不可成为新目标，终局停止后续非必要结算。已真实提交的伤害与支付保留日志。"
      },
      {
        "id": "H3",
        "category": "host_order_and_privacy",
        "rule": "同窗口多技能、多人伤害与摸牌遵守宿主一致的行动顺序；盲手牌以不透明槽选择；怃戎双方锁定前不公开，AI不得读对手锁定选择。回放不重复收费/摸牌。"
      },
      {
        "id": "H4",
        "category": "host_foreign_card_values",
        "rule": "外国血杀/毒杀/刺杀接入宿主统一杀族；非原生无色判定既非红也非黑，不伪造一支效果。类别映射显式限定为基本/锦囊/装备，延时属锦囊。"
      },
      {
        "id": "H5",
        "category": "host_extra_phase_accounting",
        "rule": "以实际被跳过的phase occurrence计数，同一阶段多原因只计1。额外阶段若被正式跳过可计1；直接结束/截断回合不把未来未到达阶段猜作跳过。被翻面整回合跳过不构造阶段记录。"
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "按现有effective-hero路由完整复制多分支技能，不复制HP/性别/势力。陈群自己的回合历史独立于技能是否当时有效，复制/重得不清掉同actor限制；曹真实体堆作为actor状态保留但技能失效不能操作，死亡按普通离场清理。异游戏多重转换只采用宿主统一优先级，不宣称手游原生组合。"
      },
      {
        "id": "H7",
        "category": "host_pile_and_deck",
        "rule": "钤为宿主专属公开牌堆，显示实体与数量，移去按pile removal进入弃牌堆而非手牌弃置；这是显式宿主存储/可见性政策。牌堆空时用正常重洗；仍无法提供则实际获得0，不制造牌。永久移除/技能替换时按同一宿主规则清理，不能暗中重置次数。"
      }
    ],
    "portrait_path": "./portraits-sgs-followup/chen-qun.svg",
    "gender_provenance": {
      "source": "bwiki-chenqun",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 3,
      "source": "bwiki-chenqun",
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "魏",
        "selected_section": "经典",
        "hp_html_line": 633,
        "gender_html_line": 628,
        "faction_html_line": 629,
        "initial_hp_explicit": null
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "faction": "魏",
      "source_faction": "魏",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0",
        "detail": "独立初始体力字段未知；H0满体力开局仅为宿主初始化。"
      },
      {
        "field": "current_client",
        "status": "unverified",
        "detail": "未实测2026当前移动客户端。"
      },
      {
        "field": "cross_game",
        "status": "explicit_host_policy",
        "detail": "公开钤牌堆、额外阶段账本、异游戏复制及转换优先级见H0–H7，不冒充原生客户端认证。"
      }
    ],
    "source_evidence_note": "同产品移动官网基础身份目录核对全部固有面板；最大体力、性别与经典细化来自移动BWIKI；小米同产品攻略只作选定原版边界佐证。官网旧张嶷攻略只补怃戎，未采用旧全局矢志。",
    "source_equivalence": {
      "signature": {
        "key": "chenqun",
        "id": "sgs.adapted.base.hero.chen-qun",
        "source_name": "陈群",
        "suggested_display_name": "陈群",
        "max_hp": 3,
        "starting_hp": 3,
        "starting_hp_direct_source_value": null,
        "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
        "gender": "male",
        "source_faction": "魏",
        "product": "三国杀移动版",
        "variant": "mobile-base-identity-catalog-2026-10-15",
        "official_page_id": 176,
        "source_refs": [
          "mobile-chenqun",
          "bwiki-chenqun"
        ],
        "intrinsic_skill_inventory": [
          "定品",
          "法恩"
        ],
        "skill_ids": [
          "sgs.dingpin",
          "sgs.faen"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "all_intrinsic_panels_verified": true,
        "current_client_rules_verified": false,
        "current_client_hp_verified": false,
        "source_inventory_ready": true,
        "implementation_status": "research_only",
        "readiness": "source_ready_with_explicit_host_requirements",
        "intrinsic_unresolved": [],
        "skills": [
          {
            "id": "sgs.dingpin",
            "name": "定品",
            "type": "active_hand_type_history_cost_wounded_judgment",
            "timing": "自己真实出牌阶段动作窗口",
            "quota": "无独立一次限制；本回合每个已用/已弃类别不可再支付；判黑目标本回合不能再选",
            "cost": "恰好1张可弃置手牌，其基本/锦囊/装备类别此前未被自己在本回合使用或弃置",
            "targets": "1名当前已受伤的存活角色，包含自己，无阵营距离限制",
            "effects": [
              "类别为基本、锦囊、装备三大类，不是杀/闪等牌名，也不是花色；普通与延时锦囊属于同一大类。已安装装备不能作为支付，判定区/私有牌堆也不能。",
              "历史记录包括本回合其他阶段发生的自己的使用/弃置，并包括定品本次成功弃置的成本；给牌、获得、重铸、纯响应打出不自动充当弃置或使用。正常使用式无懈属于使用。",
              "目标是判定角色，采用该角色自己的有效判定花色/颜色及正常改判流程；不把判定归陈群，也不绕开天妒等判定后机制。",
              "最终判定黑色：目标摸其当前已损失体力值张牌，随后该目标被本回合定品禁选；不设3张上限，不按当前HP摸。",
              "最终判定红色：陈群翻面，正变反或反变正，目标没有黑色禁选标记，可用另一未消耗类别再选。翻面本身不立即终止当前出牌阶段。",
              "定品成功弃掉的类别在同一回合一直占用，红色也不返还；额外出牌阶段不重置，下一真实回合重置。三大类最多支持3次，若已有其他使用/弃置则更少。",
              "黑色成功目标限制独立于成本类别限制；一人黑色后仍可对另一受伤角色用其他类别。禁止偷用界陈群无伤目标/非手牌成本/红桃不计类别。"
            ],
            "source_refs": [
              "mobile-chenqun",
              "bwiki-chenqun",
              "bwiki-dingpin-detail",
              "xiaomi-chenqun"
            ],
            "official_panel_hidden": false,
            "raw_evidence": {
              "path": "evidence/mobile-chenqun.html",
              "line": 184,
              "rule_sha256": "09810b23d773fa308827aed628c5d47610dd583da26b7cf98db256b1a9ec3fce"
            },
            "limited_marker": null,
            "awakening_marker": null
          },
          {
            "id": "sgs.faen",
            "name": "法恩",
            "type": "optional_draw_after_flip_or_enter_chain",
            "timing": "任一角色实际翻面后，或从未横置变为横置后",
            "quota": "每次真实状态变化均可选，无每回合上限",
            "cost": "无",
            "targets": "固定为刚变化的角色，包含自己和敌人",
            "effects": [
              "翻面两个方向均能触发；只允许翻回正面的规则属于其他版本，不能套用。自己的定品判红翻面也可法恩摸1。",
              "横置指进入连环状态；解除横置不触发。只播放铁索效果但状态未改变不得虚构触发。",
              "接受后仅该状态变化角色摸1，陈群不能把这张牌转给第三人。多名角色分别横置时各有独立事件与可选机会。",
              "技能造成的横置与牌造成的横置均可；实际复原若改变了正反面可触发翻面分支，解除连环本身仍不给法恩。"
            ],
            "source_refs": [
              "mobile-chenqun",
              "bwiki-chenqun",
              "bwiki-faen-detail"
            ],
            "official_panel_hidden": true,
            "raw_evidence": {
              "path": "evidence/mobile-chenqun.html",
              "line": 185,
              "rule_sha256": "841bd38a4fefb7cb878e21998a76fe648b5cdbb7c1cea741fcb130c5e638c100"
            },
            "limited_marker": null,
            "awakening_marker": null
          }
        ],
        "ui_requirements": [
          "定品按钮显示本回合已使用/弃置的三大类别、可付手牌和已判黑禁选目标；不能只做三次按钮计数。",
          "判定牌归目标，显示最终判色和黑色摸牌数量，红色显示陈群真实翻面。",
          "法恩询问归陈群，目标固定；每次翻面/入链独立可拒绝。"
        ],
        "rule_expansion_notes": [
          "官方法恩简写铁索连环由同产品经典精确条目横置补足，排除解除连环。",
          "跨游戏异色/无色判定及复制技能历史采用H4/H6；不据此声称原手游存在无色判定。"
        ],
        "host_policy_refs": [
          "H0",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "H7"
        ]
      },
      "signature_sha256": "8cc4541217432976538f789ddb3d5f89744fd03629155b53d079ae198d29b8f1",
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 108,
      "source_alias_records_checked": 7,
      "original_alias_records_checked": 1,
      "comparison_basis": "Full108 playable templates plus7 source merges and1 original merge;464 selected pairwise comparisons; complete bundles remain distinct."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-chenqun",
        "tier": "official_same_product_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-176.html",
        "raw_path": "evidence/mobile-chenqun.html",
        "sha256": "732ad3346d767e2ad1498cfdba892ac3a0a66fa1c012780fcd952a2024c45890",
        "current_client_verified": false
      },
      {
        "id": "bwiki-chenqun",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E9%99%88%E7%BE%A4",
        "raw_path": "evidence/bwiki-chenqun.html",
        "sha256": "97ee0184c46dab4d4592a98599abc2f545a45a2056bfaac8d43f9490559ba24a",
        "current_client_verified": false
      },
      {
        "id": "bwiki-dingpin-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E5%AE%9A%E5%93%81/%E9%99%88%E7%BE%A4",
        "raw_path": "evidence/bwiki-dingpin-detail.html",
        "sha256": "844676ba4982ceb61fa29237eb49b43a55b44ff9db9cc98f5f1fc316090de63d",
        "current_client_verified": false
      },
      {
        "id": "xiaomi-chenqun",
        "tier": "same_product_mobile_distribution_guide",
        "url": "https://game.xiaomi.com/viewpoint/1195705742_1704875670654_100",
        "raw_path": "evidence/xiaomi-chenqun.html",
        "sha256": "ebf79e57ccdb448c36822c03adb29e1e7be0f41393b3f4593a1f4a6f8a268ce9",
        "current_client_verified": false
      },
      {
        "id": "bwiki-faen-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E6%B3%95%E6%81%A9/%E9%99%88%E7%BE%A4",
        "raw_path": "evidence/bwiki-faen-detail.html",
        "sha256": "fcae2f4f1e523167828838c6f672759bbb9ae4927e9bcbaf0fb64368eb47bba5",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局是宿主初始化。H1–H7明示真实事件、原子支付、同时锁定与公开快照、外国牌值、额外阶段跳过台账、异游戏复制及公开实体钤牌堆。当前客户端与完整身份模式未核验。"
  },
  {
    "key": "zhangyi",
    "id": "sgs.adapted.base.hero.zhang-yi",
    "source_name": "张嶷",
    "suggested_display_name": "张嶷",
    "max_hp": 4,
    "starting_hp": 4,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
    "gender": "male",
    "source_faction": "蜀",
    "product": "三国杀移动版",
    "variant": "mobile-base-identity-catalog-2026-10-15",
    "official_page_id": 190,
    "source_refs": [
      "mobile-zhangyi",
      "bwiki-zhangyi"
    ],
    "intrinsic_skill_inventory": [
      "怃戎",
      "矢志"
    ],
    "skill_ids": [
      "sgs.wurong",
      "sgs.shizhi"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "tested",
    "readiness": "source_ready_with_explicit_host_requirements",
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.wurong",
        "name": "怃戎",
        "type": "once_phase_simultaneous_private_hand_reveal",
        "timing": "自己真实出牌阶段动作窗口",
        "quota": "每个真实出牌阶段限一次，成功完成展示即消耗，即使两分支都未命中",
        "cost": "开始不弃牌；双方各须至少1张手牌并各秘密选1张同时展示。只有成功分支才弃自己所展示实体牌",
        "targets": "1名其他存活角色，须有手牌，无阵营/距离限制",
        "effects": [
          "双方选择必须在不知道对方选择的情况下锁定，随后同时公开；不是拼点，不比较点数，也不是杀或闪的使用/打出。",
          "自己展示杀、对方展示非闪：弃自己的展示牌，然后对其造成1点普通技能伤害；不走杀的次数、距离、闪响应或武器命中路径。",
          "自己展示非杀、对方展示闪：弃自己的展示牌，然后获得其手牌区或装备区中的1张牌；不能取判定区、私有牌堆或标记牌。可取刚展示仍在其手中的闪。",
          "杀对闪或非杀对非闪：不弃任何展示牌，无伤害无获得；双方牌留在原手牌，使用机会仍已消耗。",
          "对方展示牌从不作为技能代价自动弃掉；已知展示牌公开记录不代表其整个手牌或后来摸牌永久公开。",
          "没有手牌的一方不能开始；自己不可作为目标。手牌身份采用展示时身份，不调用仅使用/打出时生效的转换。"
        ],
        "source_refs": [
          "mobile-zhangyi",
          "bwiki-zhangyi",
          "bwiki-wurong-detail",
          "mobile-zhangyi-guide"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-zhangyi.html",
          "line": 178,
          "rule_sha256": "68c474e74ac3152ff77d9b846679eb0fb533b0466be9dbab30ba877a6b59ee1e"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.shizhi",
        "name": "矢志",
        "type": "locked_one_hp_dodge_use_response_restriction",
        "timing": "每次构建实际使用/打出卡牌身份与合法性时，动态检查自己当前HP",
        "quota": "持续锁定，只有HP恰好1时生效；不是HP<=1",
        "cost": "原实体闪作为普通杀使用或打出材料；无额外支付",
        "targets": "沿用实际杀场景的合法目标/响应要求",
        "effects": [
          "HP=1时自己的闪只能以杀身份使用或打出，不能继续当闪防杀；主动杀仍需正常次数/距离，响应杀仍需对应响应请求。",
          "HP不等于1时立即恢复通常闪行为，不留下回合标记或永久改卡。改变HP后要重算尚未提交的输入合法性。",
          "精确所选文字仅约束使用或打出；持有、展示、弃置的原实体闪仍是闪。因此自己1HP时拿闪怃戎展示不能当作展示杀。",
          "这不是把所有闪全局重命名为杀；不让闪被杀的重铸按钮选择，不改公开展示/弃牌类别记录，也不把闪变成火杀或雷杀。",
          "使用/打出转换保留实体ID、花色、点数、颜色和来源；使用结果按普通杀处理，不触发使用闪的司敌。"
        ],
        "source_refs": [
          "mobile-zhangyi",
          "bwiki-zhangyi",
          "bwiki-shizhi-detail"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-zhangyi.html",
          "line": 179,
          "rule_sha256": "d3db57b0388cace3373e04a659499801b5127a5e376acd9a352dea983261208c"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "ui_requirements": [
      "怃戎按双方私选→锁定→同时揭示流程，不能向AI或对方提前公开玩家选择。",
      "四种组合显示各自正确结果；成功获得分支提供手牌盲选或公开装备，别展示整手。",
      "HP=1时显示矢志提示，杀入口可选闪，闪响应入口禁止实体闪；怃戎展示仍标闪。"
    ],
    "rule_expansion_notes": [
      "官方190的只能当做杀，由BWIKI经典精确使用或打出条目细化；历史版本全局视为杀明确排除。",
      "旧官方75攻略只用于未改动怃戎分支与取牌区域；不引用其旧矢志覆盖新版精确条目。",
      "八卦阵/外国转换的虚拟闪不伪造可挪用实体；宿主转换优先级单独H6。"
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7"
    ],
    "name": "张嶷",
    "display_name": "张嶷",
    "skill_name": "怃戎/矢志",
    "skill_desc": "怃戎：双方选择必须在不知道对方选择的情况下锁定，随后同时公开；不是拼点，不比较点数，也不是杀或闪的使用/打出。 自己展示杀、对方展示非闪：弃自己的展示牌，然后对其造成1点普通技能伤害；不走杀的次数、距离、闪响应或武器命中路径。 自己展示非杀、对方展示闪：弃自己的展示牌，然后获得其手牌区或装备区中的1张牌；不能取判定区、私有牌堆或标记牌。可取刚展示仍在其手中的闪。 杀对闪或非杀对非闪：不弃任何展示牌，无伤害无获得；双方牌留在原手牌，使用机会仍已消耗。 对方展示牌从不作为技能代价自动弃掉；已知展示牌公开记录不代表其整个手牌或后来摸牌永久公开。 没有手牌的一方不能开始；自己不可作为目标。手牌身份采用展示时身份，不调用仅使用/打出时生效的转换。 矢志：HP=1时自己的闪只能以杀身份使用或打出，不能继续当闪防杀；主动杀仍需正常次数/距离，响应杀仍需对应响应请求。 HP不等于1时立即恢复通常闪行为，不留下回合标记或永久改卡。改变HP后要重算尚未提交的输入合法性。 精确所选文字仅约束使用或打出；持有、展示、弃置的原实体闪仍是闪。因此自己1HP时拿闪怃戎展示不能当作展示杀。 这不是把所有闪全局重命名为杀；不让闪被杀的重铸按钮选择，不改公开展示/弃牌类别记录，也不把闪变成火杀或雷杀。 使用/打出转换保留实体ID、花色、点数、颜色和来源；使用结果按普通杀处理，不触发使用闪的司敌。",
    "source_character_name": "张嶷",
    "source_label": "三国杀",
    "source_status": "verified",
    "source_coverage": true,
    "source_game": "三国杀",
    "source_variant": "mobile-base-identity-catalog-2026-10-15",
    "snapshot_date": "2026-10-15",
    "faction": "蜀",
    "source_id_aliases": [],
    "aliases": [
      "三国杀张嶷",
      "zhang-yi",
      "zhangyi",
      "张嶷·怃戎/矢志",
      "zhangni",
      "zhang-ni"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-190.html",
      "https://wiki.biligame.com/msgs/%E5%BC%A0%E5%B6%B7",
      "https://wiki.biligame.com/msgs/%E6%80%83%E6%88%8E/%E5%BC%A0%E5%B6%B7",
      "https://www.sanguosha.cn/pc/guide-info-75.html",
      "https://wiki.biligame.com/msgs/%E7%9F%A2%E5%BF%97/%E5%BC%A0%E5%B6%B7"
    ],
    "source_records": [
      {
        "id": "mobile-zhangyi",
        "url": "https://www.sanguosha.cn/pc/hero-detail-190.html",
        "final_url": "https://www.sanguosha.cn/pc/hero-detail-190.html",
        "status": 200,
        "bytes": 20960,
        "sha256": "78eb7b2f5e61a14454f49e4acb60c01a34f14010603a555f4eabad537de88db8",
        "accessed_at": "2026-10-16T00:53:27.765806+00:00",
        "raw_path": "evidence/mobile-zhangyi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "official_same_product_identity_catalog",
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
                  "name": "怃戎",
                  "hidden": false,
                  "raw_rule_text": "出牌阶段限一次，你可以和一名其他角色同时展示一张手牌：然后若你展示的牌是【杀】且该角色不是【闪】，你弃置此【杀】，然后对其造成1点伤害。若你展示的牌不是【杀】且该角色是【闪】，你弃置此牌，然后获得其一张牌。",
                  "html_line": 178,
                  "rule_sha256": "68c474e74ac3152ff77d9b846679eb0fb533b0466be9dbab30ba877a6b59ee1e"
                },
                {
                  "name": "矢志",
                  "hidden": true,
                  "raw_rule_text": "锁定技，当你体力值为1时，你的【闪】只能当做【杀】。",
                  "html_line": 179,
                  "rule_sha256": "d3db57b0388cace3373e04a659499801b5127a5e376acd9a352dea983261208c"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "faction": "蜀",
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "官方目录未标注规则生效日期；未验证客户端。",
          "已读取隐藏技能栏；页面没有独立体力数值或性别字段。"
        ]
      },
      {
        "id": "bwiki-zhangyi",
        "url": "https://wiki.biligame.com/msgs/%E5%BC%A0%E5%B6%B7",
        "final_url": "https://wiki.biligame.com/msgs/%E5%BC%A0%E5%B6%B7",
        "status": 200,
        "bytes": 83618,
        "sha256": "44b6af3ae468116c5b884ce27ddc937d01b1fdc64a46009822c13e39ea6d0d35",
        "accessed_at": "2026-10-16T00:53:30.498730+00:00",
        "raw_path": "evidence/bwiki-zhangyi.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 6334,
        "modified_at": "2022-04-06T14:34:04Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ],
        "metadata": {
          "max_hp": 4,
          "hp_icon_count": 4,
          "hp_numeric": 4,
          "gender": "male",
          "faction": "蜀",
          "selected_section": "经典",
          "hp_html_line": 602,
          "gender_html_line": 597,
          "faction_html_line": 598,
          "initial_hp_explicit": null
        }
      },
      {
        "id": "bwiki-wurong-detail",
        "url": "https://wiki.biligame.com/msgs/%E6%80%83%E6%88%8E/%E5%BC%A0%E5%B6%B7",
        "final_url": "https://wiki.biligame.com/msgs/%E6%80%83%E6%88%8E/%E5%BC%A0%E5%B6%B7",
        "status": 200,
        "bytes": 74044,
        "sha256": "5dc70abbda052a5ee7386fe3607bb31161e32265341c7bdec0c2ec1c7b6fa168",
        "accessed_at": "2026-10-16T00:54:27.652182+00:00",
        "raw_path": "evidence/bwiki-wurong-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 38854,
        "modified_at": "2026-06-07T03:27:44Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      },
      {
        "id": "mobile-zhangyi-guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-75.html",
        "final_url": "https://www.sanguosha.cn/pc/guide-info-75.html",
        "status": 200,
        "bytes": 20790,
        "sha256": "09381c0551f4d429439c1a8b2a1cabd0f2478ed52a99fbdc4e405f28cdadd281",
        "accessed_at": "2026-10-16T00:54:32.863268+00:00",
        "raw_path": "evidence/mobile-zhangyi-guide.html",
        "current_client_verified": false,
        "publication_date": "2020-06-19T17:48:13+08:00",
        "tier": "official_same_product_historical_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "怃戎成功获得牌分支只含手牌区与装备区。",
          "两个不匹配组合不弃牌，展示牌回手，不能当成拼点或无条件伤害。"
        ],
        "excluded_claims": [
          "该旧攻略矢志写作全局视为杀，不能覆盖190目录和现行经典条目的使用/打出限制。"
        ]
      },
      {
        "id": "bwiki-shizhi-detail",
        "url": "https://wiki.biligame.com/msgs/%E7%9F%A2%E5%BF%97/%E5%BC%A0%E5%B6%B7",
        "final_url": "https://wiki.biligame.com/msgs/%E7%9F%A2%E5%BF%97/%E5%BC%A0%E5%B6%B7",
        "status": 200,
        "bytes": 71477,
        "sha256": "252dc3fff88346fc206ee8226070c2ef81a3121ec55d6cab4a01da7d9f3e5a38",
        "accessed_at": "2026-10-16T00:54:28.067371+00:00",
        "raw_path": "evidence/bwiki-shizhi-detail.html",
        "current_client_verified": false,
        "publication_date": null,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 39016,
        "modified_at": "2026-06-11T13:56:40Z",
        "limitations": [
          "同产品社区证据，不是官方裁定或客户端实测。",
          "文章修订日期不独立证明所有模板的生效时间；混合页仅选明确经典条目，不选页末可能错误的界/势卡片。"
        ]
      }
    ],
    "source_skill_rules": [
      {
        "id": "sgs.wurong",
        "name": "怃戎",
        "type": "once_phase_simultaneous_private_hand_reveal",
        "timing": "自己真实出牌阶段动作窗口",
        "quota": "每个真实出牌阶段限一次，成功完成展示即消耗，即使两分支都未命中",
        "cost": "开始不弃牌；双方各须至少1张手牌并各秘密选1张同时展示。只有成功分支才弃自己所展示实体牌",
        "targets": "1名其他存活角色，须有手牌，无阵营/距离限制",
        "effects": [
          "双方选择必须在不知道对方选择的情况下锁定，随后同时公开；不是拼点，不比较点数，也不是杀或闪的使用/打出。",
          "自己展示杀、对方展示非闪：弃自己的展示牌，然后对其造成1点普通技能伤害；不走杀的次数、距离、闪响应或武器命中路径。",
          "自己展示非杀、对方展示闪：弃自己的展示牌，然后获得其手牌区或装备区中的1张牌；不能取判定区、私有牌堆或标记牌。可取刚展示仍在其手中的闪。",
          "杀对闪或非杀对非闪：不弃任何展示牌，无伤害无获得；双方牌留在原手牌，使用机会仍已消耗。",
          "对方展示牌从不作为技能代价自动弃掉；已知展示牌公开记录不代表其整个手牌或后来摸牌永久公开。",
          "没有手牌的一方不能开始；自己不可作为目标。手牌身份采用展示时身份，不调用仅使用/打出时生效的转换。"
        ],
        "source_refs": [
          "mobile-zhangyi",
          "bwiki-zhangyi",
          "bwiki-wurong-detail",
          "mobile-zhangyi-guide"
        ],
        "official_panel_hidden": false,
        "raw_evidence": {
          "path": "evidence/mobile-zhangyi.html",
          "line": 178,
          "rule_sha256": "68c474e74ac3152ff77d9b846679eb0fb533b0466be9dbab30ba877a6b59ee1e"
        },
        "limited_marker": null,
        "awakening_marker": null
      },
      {
        "id": "sgs.shizhi",
        "name": "矢志",
        "type": "locked_one_hp_dodge_use_response_restriction",
        "timing": "每次构建实际使用/打出卡牌身份与合法性时，动态检查自己当前HP",
        "quota": "持续锁定，只有HP恰好1时生效；不是HP<=1",
        "cost": "原实体闪作为普通杀使用或打出材料；无额外支付",
        "targets": "沿用实际杀场景的合法目标/响应要求",
        "effects": [
          "HP=1时自己的闪只能以杀身份使用或打出，不能继续当闪防杀；主动杀仍需正常次数/距离，响应杀仍需对应响应请求。",
          "HP不等于1时立即恢复通常闪行为，不留下回合标记或永久改卡。改变HP后要重算尚未提交的输入合法性。",
          "精确所选文字仅约束使用或打出；持有、展示、弃置的原实体闪仍是闪。因此自己1HP时拿闪怃戎展示不能当作展示杀。",
          "这不是把所有闪全局重命名为杀；不让闪被杀的重铸按钮选择，不改公开展示/弃牌类别记录，也不把闪变成火杀或雷杀。",
          "使用/打出转换保留实体ID、花色、点数、颜色和来源；使用结果按普通杀处理，不触发使用闪的司敌。"
        ],
        "source_refs": [
          "mobile-zhangyi",
          "bwiki-zhangyi",
          "bwiki-shizhi-detail"
        ],
        "official_panel_hidden": true,
        "raw_evidence": {
          "path": "evidence/mobile-zhangyi.html",
          "line": 179,
          "rule_sha256": "d3db57b0388cace3373e04a659499801b5127a5e376acd9a352dea983261208c"
        },
        "limited_marker": null,
        "awakening_marker": null
      }
    ],
    "intrinsic_skill_ids": [
      "sgs.wurong",
      "sgs.shizhi"
    ],
    "granted_skill_ids": [],
    "complete_skill_ids": [
      "sgs.wurong",
      "sgs.shizhi"
    ],
    "complete_skill_names": [
      "怃戎",
      "矢志"
    ],
    "rules_complete_inventory_verified": true,
    "current_mobile_client_verified": false,
    "historical_core_rules_verified": true,
    "full_intrinsic_skillset_verified": true,
    "full_granted_skillset_expanded": true,
    "source_only_exact_for_every_edge": false,
    "runtime_validation_status": "passed",
    "production_integration_status": "integrated-tested",
    "host_compatibility_policies": [
      {
        "id": "H0",
        "category": "host_initialization",
        "rule": "本地默认初始HP=maxHP；公开页仅核实maxHP，不把默认值伪装独立初始HP字段。"
      },
      {
        "id": "H1",
        "category": "host_transaction_safety",
        "rule": "使用真实actor、卡牌ID/location epoch和阶段/回合ID；提交前复核有效技能、费用、目标、次数。取消或失效输入不支付，已支付不回滚；事件精确一次。"
      },
      {
        "id": "H2",
        "category": "host_lifecycle",
        "rule": "结算遵循现有死亡/濒死/比赛结束处理；死者不可成为新目标，终局停止后续非必要结算。已真实提交的伤害与支付保留日志。"
      },
      {
        "id": "H3",
        "category": "host_order_and_privacy",
        "rule": "同窗口多技能、多人伤害与摸牌遵守宿主一致的行动顺序；盲手牌以不透明槽选择；怃戎双方锁定前不公开，AI不得读对手锁定选择。回放不重复收费/摸牌。"
      },
      {
        "id": "H4",
        "category": "host_foreign_card_values",
        "rule": "外国血杀/毒杀/刺杀接入宿主统一杀族；非原生无色判定既非红也非黑，不伪造一支效果。类别映射显式限定为基本/锦囊/装备，延时属锦囊。"
      },
      {
        "id": "H5",
        "category": "host_extra_phase_accounting",
        "rule": "以实际被跳过的phase occurrence计数，同一阶段多原因只计1。额外阶段若被正式跳过可计1；直接结束/截断回合不把未来未到达阶段猜作跳过。被翻面整回合跳过不构造阶段记录。"
      },
      {
        "id": "H6",
        "category": "cross_game_skill_copy",
        "rule": "按现有effective-hero路由完整复制多分支技能，不复制HP/性别/势力。陈群自己的回合历史独立于技能是否当时有效，复制/重得不清掉同actor限制；曹真实体堆作为actor状态保留但技能失效不能操作，死亡按普通离场清理。异游戏多重转换只采用宿主统一优先级，不宣称手游原生组合。"
      },
      {
        "id": "H7",
        "category": "host_pile_and_deck",
        "rule": "钤为宿主专属公开牌堆，显示实体与数量，移去按pile removal进入弃牌堆而非手牌弃置；这是显式宿主存储/可见性政策。牌堆空时用正常重洗；仍无法提供则实际获得0，不制造牌。永久移除/技能替换时按同一宿主规则清理，不能暗中重置次数。"
      }
    ],
    "portrait_path": "./portraits-sgs-followup/zhang-yi.svg",
    "gender_provenance": {
      "source": "bwiki-zhangyi",
      "product": "三国杀移动版",
      "field": "explicit classic gender",
      "value": "male",
      "current_client_verified": false
    },
    "hp_evidence": {
      "value": 4,
      "source": "bwiki-zhangyi",
      "metadata": {
        "max_hp": 4,
        "hp_icon_count": 4,
        "hp_numeric": 4,
        "gender": "male",
        "faction": "蜀",
        "selected_section": "经典",
        "hp_html_line": 602,
        "gender_html_line": 597,
        "faction_html_line": 598,
        "initial_hp_explicit": null
      },
      "current_client_verified": false
    },
    "source_identity_context": {
      "product": "三国杀移动版",
      "mode": "身份",
      "faction": "蜀",
      "source_faction": "蜀",
      "initial_hp_host_policy": "H0",
      "initial_hp_direct_source_value": null,
      "personal_lord_dependency": false,
      "identity_mode_complete": false
    },
    "source_unknowns": [
      {
        "field": "initialHP",
        "status": "not_directly_sourced",
        "host_policy": "H0",
        "detail": "独立初始体力字段未知；H0满体力开局仅为宿主初始化。"
      },
      {
        "field": "current_client",
        "status": "unverified",
        "detail": "未实测2026当前移动客户端。"
      },
      {
        "field": "cross_game",
        "status": "explicit_host_policy",
        "detail": "公开钤牌堆、额外阶段账本、异游戏复制及转换优先级见H0–H7，不冒充原生客户端认证。"
      }
    ],
    "source_evidence_note": "同产品移动官网基础身份目录核对全部固有面板；最大体力、性别与经典细化来自移动BWIKI；小米同产品攻略只作选定原版边界佐证。官网旧张嶷攻略只补怃戎，未采用旧全局矢志。",
    "source_equivalence": {
      "signature": {
        "key": "zhangyi",
        "id": "sgs.adapted.base.hero.zhang-yi",
        "source_name": "张嶷",
        "suggested_display_name": "张嶷",
        "max_hp": 4,
        "starting_hp": 4,
        "starting_hp_direct_source_value": null,
        "starting_hp_basis": "H0 host initialization; no separately sourced initial HP field",
        "gender": "male",
        "source_faction": "蜀",
        "product": "三国杀移动版",
        "variant": "mobile-base-identity-catalog-2026-10-15",
        "official_page_id": 190,
        "source_refs": [
          "mobile-zhangyi",
          "bwiki-zhangyi"
        ],
        "intrinsic_skill_inventory": [
          "怃戎",
          "矢志"
        ],
        "skill_ids": [
          "sgs.wurong",
          "sgs.shizhi"
        ],
        "personal_lord_skills": [],
        "granted_skill_inventory": [],
        "acquired_skill_inventory": [],
        "all_intrinsic_panels_verified": true,
        "current_client_rules_verified": false,
        "current_client_hp_verified": false,
        "source_inventory_ready": true,
        "implementation_status": "research_only",
        "readiness": "source_ready_with_explicit_host_requirements",
        "intrinsic_unresolved": [],
        "skills": [
          {
            "id": "sgs.wurong",
            "name": "怃戎",
            "type": "once_phase_simultaneous_private_hand_reveal",
            "timing": "自己真实出牌阶段动作窗口",
            "quota": "每个真实出牌阶段限一次，成功完成展示即消耗，即使两分支都未命中",
            "cost": "开始不弃牌；双方各须至少1张手牌并各秘密选1张同时展示。只有成功分支才弃自己所展示实体牌",
            "targets": "1名其他存活角色，须有手牌，无阵营/距离限制",
            "effects": [
              "双方选择必须在不知道对方选择的情况下锁定，随后同时公开；不是拼点，不比较点数，也不是杀或闪的使用/打出。",
              "自己展示杀、对方展示非闪：弃自己的展示牌，然后对其造成1点普通技能伤害；不走杀的次数、距离、闪响应或武器命中路径。",
              "自己展示非杀、对方展示闪：弃自己的展示牌，然后获得其手牌区或装备区中的1张牌；不能取判定区、私有牌堆或标记牌。可取刚展示仍在其手中的闪。",
              "杀对闪或非杀对非闪：不弃任何展示牌，无伤害无获得；双方牌留在原手牌，使用机会仍已消耗。",
              "对方展示牌从不作为技能代价自动弃掉；已知展示牌公开记录不代表其整个手牌或后来摸牌永久公开。",
              "没有手牌的一方不能开始；自己不可作为目标。手牌身份采用展示时身份，不调用仅使用/打出时生效的转换。"
            ],
            "source_refs": [
              "mobile-zhangyi",
              "bwiki-zhangyi",
              "bwiki-wurong-detail",
              "mobile-zhangyi-guide"
            ],
            "official_panel_hidden": false,
            "raw_evidence": {
              "path": "evidence/mobile-zhangyi.html",
              "line": 178,
              "rule_sha256": "68c474e74ac3152ff77d9b846679eb0fb533b0466be9dbab30ba877a6b59ee1e"
            },
            "limited_marker": null,
            "awakening_marker": null
          },
          {
            "id": "sgs.shizhi",
            "name": "矢志",
            "type": "locked_one_hp_dodge_use_response_restriction",
            "timing": "每次构建实际使用/打出卡牌身份与合法性时，动态检查自己当前HP",
            "quota": "持续锁定，只有HP恰好1时生效；不是HP<=1",
            "cost": "原实体闪作为普通杀使用或打出材料；无额外支付",
            "targets": "沿用实际杀场景的合法目标/响应要求",
            "effects": [
              "HP=1时自己的闪只能以杀身份使用或打出，不能继续当闪防杀；主动杀仍需正常次数/距离，响应杀仍需对应响应请求。",
              "HP不等于1时立即恢复通常闪行为，不留下回合标记或永久改卡。改变HP后要重算尚未提交的输入合法性。",
              "精确所选文字仅约束使用或打出；持有、展示、弃置的原实体闪仍是闪。因此自己1HP时拿闪怃戎展示不能当作展示杀。",
              "这不是把所有闪全局重命名为杀；不让闪被杀的重铸按钮选择，不改公开展示/弃牌类别记录，也不把闪变成火杀或雷杀。",
              "使用/打出转换保留实体ID、花色、点数、颜色和来源；使用结果按普通杀处理，不触发使用闪的司敌。"
            ],
            "source_refs": [
              "mobile-zhangyi",
              "bwiki-zhangyi",
              "bwiki-shizhi-detail"
            ],
            "official_panel_hidden": true,
            "raw_evidence": {
              "path": "evidence/mobile-zhangyi.html",
              "line": 179,
              "rule_sha256": "d3db57b0388cace3373e04a659499801b5127a5e376acd9a352dea983261208c"
            },
            "limited_marker": null,
            "awakening_marker": null
          }
        ],
        "ui_requirements": [
          "怃戎按双方私选→锁定→同时揭示流程，不能向AI或对方提前公开玩家选择。",
          "四种组合显示各自正确结果；成功获得分支提供手牌盲选或公开装备，别展示整手。",
          "HP=1时显示矢志提示，杀入口可选闪，闪响应入口禁止实体闪；怃戎展示仍标闪。"
        ],
        "rule_expansion_notes": [
          "官方190的只能当做杀，由BWIKI经典精确使用或打出条目细化；历史版本全局视为杀明确排除。",
          "旧官方75攻略只用于未改动怃戎分支与取牌区域；不引用其旧矢志覆盖新版精确条目。",
          "八卦阵/外国转换的虚拟闪不伪造可挪用实体；宿主转换优先级单独H6。"
        ],
        "host_policy_refs": [
          "H0",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "H7"
        ]
      },
      "signature_sha256": "0f1f79300129a2c672920ebc7b3c1f15103cd8c45baaeccb6f6f93d674aae7a5",
      "decision": "retain_distinct_selected_complete_host_packet",
      "source_aliases": [],
      "distinct_from_existing_roster_count": 108,
      "source_alias_records_checked": 7,
      "original_alias_records_checked": 1,
      "comparison_basis": "Full108 playable templates plus7 source merges and1 original merge;464 selected pairwise comparisons; complete bundles remain distinct."
    },
    "source_evidence_tiers": [
      {
        "id": "mobile-zhangyi",
        "tier": "official_same_product_identity_catalog",
        "url": "https://www.sanguosha.cn/pc/hero-detail-190.html",
        "raw_path": "evidence/mobile-zhangyi.html",
        "sha256": "78eb7b2f5e61a14454f49e4acb60c01a34f14010603a555f4eabad537de88db8",
        "current_client_verified": false
      },
      {
        "id": "bwiki-zhangyi",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E5%BC%A0%E5%B6%B7",
        "raw_path": "evidence/bwiki-zhangyi.html",
        "sha256": "44b6af3ae468116c5b884ce27ddc937d01b1fdc64a46009822c13e39ea6d0d35",
        "current_client_verified": false
      },
      {
        "id": "bwiki-wurong-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E6%80%83%E6%88%8E/%E5%BC%A0%E5%B6%B7",
        "raw_path": "evidence/bwiki-wurong-detail.html",
        "sha256": "5dc70abbda052a5ee7386fe3607bb31161e32265341c7bdec0c2ec1c7b6fa168",
        "current_client_verified": false
      },
      {
        "id": "mobile-zhangyi-guide",
        "tier": "official_same_product_historical_guide",
        "url": "https://www.sanguosha.cn/pc/guide-info-75.html",
        "raw_path": "evidence/mobile-zhangyi-guide.html",
        "sha256": "09381c0551f4d429439c1a8b2a1cabd0f2478ed52a99fbdc4e405f28cdadd281",
        "current_client_verified": false
      },
      {
        "id": "bwiki-shizhi-detail",
        "tier": "same_product_community_wiki",
        "url": "https://wiki.biligame.com/msgs/%E7%9F%A2%E5%BF%97/%E5%BC%A0%E5%B6%B7",
        "raw_path": "evidence/bwiki-shizhi-detail.html",
        "sha256": "252dc3fff88346fc206ee8226070c2ef81a3121ec55d6cab4a01da7d9f3e5a38",
        "current_client_verified": false
      }
    ],
    "mode_status": {
      "personal_lord_dependency": false,
      "identity_mode_complete": false,
      "intrinsic_rules": "source-backed-selected-packet-with-explicit-host-policies-integration-pending",
      "identity_reward_and_victory_system": "mode_pending_not_claimed_complete"
    },
    "adaptation_notes": "H0满体力开局是宿主初始化。H1–H7明示真实事件、原子支付、同时锁定与公开快照、外国牌值、额外阶段跳过台账、异游戏复制及公开实体钤牌堆。当前客户端与完整身份模式未核验。"
  }
];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_FOLLOWUP_DEFINITIONS=freeze(definitions);
