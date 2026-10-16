/** Complete 2015-12-01 Mobile identity history packet; current-client verification is false. */
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
export const SGS_LIRU_DEFINITIONS=freeze([
  {
    "key": "liru",
    "id": "sgs.adapted.base.hero.li-ru",
    "source_name": "李儒",
    "suggested_display_name": "李儒",
    "max_hp": 3,
    "starting_hp": 3,
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 cross-game host initialization",
    "gender": "male",
    "source_faction": "群",
    "product": "三国杀移动版",
    "variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
    "official_page_id": 133,
    "source_refs": [
      "mobile-alt-liru",
      "bwiki-liru",
      "mobile-2015-adjustment"
    ],
    "intrinsic_skill_inventory": [
      "绝策",
      "灭计",
      "焚城"
    ],
    "skill_ids": [
      "sgs.juece",
      "sgs.mieji",
      "sgs.fencheng"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "all_intrinsic_panels_verified": true,
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_inventory_ready": true,
    "implementation_status": "isolated-implementation-awaiting-host-validation",
    "readiness": "source_ready_with_explicit_host_requirements",
    "ready_for_implementation": true,
    "intrinsic_unresolved": [],
    "skills": [
      {
        "id": "sgs.juece",
        "name": "绝策",
        "type": "optional_finish_phase_empty_hand_skill_damage",
        "timing": "自己的结束阶段开始时，已经完成正常弃牌阶段；非旧版回合内他人失去最后手牌时",
        "quota": "每个结束阶段一个可选目标，不按空手次数重复",
        "cost": "无牌成本",
        "targets": "一名没有手牌的其他存活角色，不限距离或阵营",
        "effects": [
          "造成来自李儒的1点普通技能伤害；不是杀、不是失去体力，不提供闪响应。目标可以有装备或判定区牌，只检查手牌。",
          "没有手牌的自己不可以选。目标本回合没失去牌也可选；有手牌但曾失去牌不可选。绝策需结束阶段实际存在。",
          "不采用历史原版“于你的回合失去最后手牌后”时序，也不采用界版“本回合失去过牌”条件。"
        ],
        "source_refs": [
          "mobile-alt-liru",
          "bwiki-liru",
          "bwiki-juece-detail",
          "xiaomi-liru-variant-comparison",
          "mobile-2015-adjustment"
        ],
        "raw_evidence": {
          "path": "evidence/mobile-alt-liru.html",
          "line": 188,
          "rule_sha256": "6094849e02b1faae440e288a94aadacec4cea68e5b336f4bf1ba7655c3f5beb0"
        },
        "official_panel_hidden": false,
        "intrinsic_unresolved": [],
        "limited_marker": null,
        "awakening_marker": null,
        "official_rule_text": "结束阶段开始时，你可以对没有手牌的一名其他角色造成1点伤害。",
        "selected_official_rule_sha256": "67b0b4f8e5efce863eb7fcc1870158c836ecf6b3859e1890178c532afc1d3290",
        "selected_official_source": "mobile-2015-adjustment"
      },
      {
        "id": "sgs.mieji",
        "name": "灭计",
        "type": "once_play_phase_black_trick_topdeck_then_forced_discard",
        "timing": "自己的真实出牌阶段动作窗口",
        "quota": "每出牌阶段限一次，非本回合限一次；效果后不能取回成本刷新",
        "cost": "将自己一张黑色锦囊手牌置于全局牌堆顶；不是弃置/使用，已在判定区的锦囊不能付",
        "targets": "一名有手牌的其他存活角色；所选2015-12-01官方历史版明确须有手牌，不能仅因有装备就合法",
        "effects": [
          "成本为自己真实手牌中的黑色锦囊，包含普通及延时锦囊；置入全局牌堆顶，保留实体、花色、点数。非使用/打出转换不改持有成本身份。",
          "目标自己选择：弃置1张锦囊，或依次弃置2张非锦囊。目标支付可来自手牌及装备区，不来自判定区/私有牌堆；同产品历史指南明确装备配合。",
          "“依次”解释为逐张选取、移动、完成该张失去/装备离场后再检查下一张。不能一次锁定2牌并同时移动，也不能让李儒看全手代选。",
          "若第二分支只有1张可弃非锦囊，先弃该张并完成对应事件，然后重查：若此时仍无可弃非锦囊，则结束，不强迫弃锦囊；若因枭姬等新得非锦囊，则必须继续弃第2张。总计最多2张非锦囊。",
          "恰有1非锦囊+1锦囊的目标可以选择只弃非锦囊（若第一弃后未新增非锦囊）。只有锦囊而无可弃非锦囊时不能选0张空付第二分支；须弃1张合法锦囊。所有合法牌均不能弃的特殊外来保护按H8处理。",
          "“不足”指本分支可弃非锦囊不足，不是从现有所有牌凑2张；不可混合1锦囊+1非锦囊。上述递归是文本语义推导，非独立FAQ或当前客户端实测。",
          "目标无手但有装备在选定版本不合法。目标选择完毕、李儒已置顶后，被嵌套效果抽空或死亡不返还成本/阶段次数；后续按H8处理。",
          "弃锦囊不会给李儒，排除界版改交锦囊；不采用OL界版红锦囊成本/两张任意牌。"
        ],
        "source_refs": [
          "mobile-alt-liru",
          "bwiki-liru",
          "xiaomi-liru-variant-comparison",
          "mobile-2015-adjustment",
          "xiaomi-liru-2022",
          "xiaomi-liru-2023"
        ],
        "raw_evidence": {
          "path": "evidence/mobile-alt-liru.html",
          "line": 189,
          "rule_sha256": "0921ddfc2389e82ddf94bdaf61c40c032b49ed25b32b882e8f52a2219262ccc8"
        },
        "official_panel_hidden": true,
        "intrinsic_unresolved": [],
        "limited_marker": null,
        "awakening_marker": null,
        "official_rule_text": "出牌阶段限一次，你可以将一张黑色锦囊牌置于牌堆顶并选择一名有手牌的其他角色，然后令该角色选择一项：弃置一张锦囊牌；或依次弃置两张非锦囊牌。",
        "selected_official_rule_sha256": "e5929f138faf88ace574dc99124495e92309b2ecb6ecbd2f51f9c712d807714f",
        "selected_official_source": "mobile-2015-adjustment"
      },
      {
        "id": "sgs.fencheng",
        "name": "焚城",
        "type": "limited_ordered_global_discard_escalation_or_fire_damage",
        "timing": "自己的出牌阶段",
        "quota": "限定技，一局一次；不能因额外回合/阶段自动重置",
        "cost": "消费一次限定标记，无手牌成本",
        "targets": "所有其他角色依次处理，包含队友；不得只选敌人或自行选起点",
        "effects": [
          "所有其他存活角色按行动顺序依次选择，第一位为李儒下家，不得任意选起点或跳队友。每人可弃至少X张手牌/装备，或受来自李儒的2点火焰技能伤害。",
          "所选2015官方文字明确X按“发动此技能时该角色的上家”本次实际弃牌数+1。开始时锁定这张上家身份映射；首位上家为李儒，本次未以焚城弃牌，故X=1。",
          "上家以本次焚城弃N张，则X=N+1；上家未以焚城弃牌则N=0，X=1。可超额弃牌抬高后继门槛，不是恰好X；不足X张不能部分付费充数。",
          "焚城弃牌可来自H/E，不能弃J或私有堆；每个目标选择的整批N须原子支付后记录实际N，再进行失去事件。",
          "火伤经过统一防伤、增减伤、濒死救援、链传播。不是杀或锦囊牌，不能用闪/无懈，实际被完全防止仍未以焚城弃牌，后继N视0。",
          "官方“发动时上家”与Wiki“上一名此技能目标”分开保存；不因后续跳过死亡人物而重新定义前者。初始上家未获执行便死亡，其弃N记录保持0；已弃N后死亡记录仍N。此为固定上家文字的直接结果。",
          "中途来源死亡、失技、角色换座及对局终局的事务续算采用明确H8，不能声称经手游客户端证实。"
        ],
        "source_refs": [
          "mobile-alt-liru",
          "bwiki-liru",
          "xiaomi-fencheng-reset",
          "xiaomi-liru-variant-comparison",
          "mobile-2015-adjustment",
          "xiaomi-liru-2023"
        ],
        "raw_evidence": {
          "path": "evidence/mobile-alt-liru.html",
          "line": 190,
          "rule_sha256": "56994270296a022b6b964bf40fed24456a32a3e17b39ef9d40b9a13ceb843461"
        },
        "official_panel_hidden": true,
        "intrinsic_unresolved": [],
        "limited_marker": "fencheng_once_per_game",
        "awakening_marker": null,
        "official_rule_text": "限定技，出牌阶段，你可以令所有其他角色依次选择一项：弃置至少X张牌（X为发动此技能时该角色的上家以此法弃置牌的数量+1）；或受到你对其造成的2点火焰伤害。",
        "selected_official_rule_sha256": "cb14d3bf7214c967bf4d1f2c26dd7d6ba2ee37f7b0e743435b5da8af86e3ce2c",
        "selected_official_source": "mobile-2015-adjustment"
      }
    ],
    "ui_requirements": [
      "绝策在真实结束阶段询问空手其他目标；UI区分普通伤害与火伤。",
      "灭计成本置顶有明确实体牌动画，目标依次选牌不可由李儒看全手代选。",
      "焚城显示一次性标记、固定顺序/上家、当前响应者、X、已弃N；宿主死亡续算见H8提示与审计，不能隐藏。"
    ],
    "rule_expansion_notes": [
      "选择2015-12-01移动版官方调整后的完整历史李儒，3HP男群，绝策/灭计/焚城齐全。官网角色目录补述非锦囊短缺处理，同产品2022/2023指南仅补明示共享规则。",
      "灭计目标须有手牌；不放宽为只要有装备，也不放宽为空手空装。当前目录省略、Wiki有牌的写法作为替代版本记录，未混成一个实体。",
      "顺次弃牌是逐次执行文本；1非锦囊+1锦囊只弃非锦囊和装备离场后重检属于明确语义推导，不伪装专门FAQ。",
      "焚城固定发动时上家/实际弃N由所选官方句法确定；中途死亡、换位、失技续算仅H8宿主兼容政策。",
      "不采用旧版失去最后手牌绝策/额外目标灭计/1火焚城，不采用界绝策/交锦囊灭计及OL自由选起点。1V1等模式另列待做。"
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H8"
    ],
    "version_conflicts": [
      {
        "id": "L-TARGET-VERSION",
        "selected": "2015-12-01官方修订版：灭计目标须有手牌",
        "alternatives": [
          "2026-10-16读取官网角色目录：只写一名其他角色",
          "2025-12-20移动版Wiki经典：有牌的其他角色"
        ],
        "resolution": "选择有明确官方发布日期的历史变体；不拼接放宽目标条件、不宣称当前客户端。"
      }
    ],
    "resolved_review_items": [
      {
        "id": "L1",
        "status": "split_into_literal_source_and_disclosed_H8",
        "source_resolution": "官方明确发动时上家。固定上家身份并记录本次实际弃N为文字的直接实现；来源死亡与异游戏中途换座的事务结算另属H8。",
        "old_review": {
          "id": "L1",
          "skill": "sgs.fencheng",
          "topic": "death_queue_and_predecessor_boundary",
          "material": true,
          "evidence": [
            "mobile-alt-liru",
            "bwiki-liru",
            "xiaomi-fencheng-reset"
          ],
          "problem": "官方以发动时该角色的上家弃牌数为X依据，社区经典写上一名此技能目标。连环/反伤导致排队角色未轮到便死亡、座次变化或李儒本人中途阵亡时，未取得精确同产品队列/继续结算/来源规则，不能把简单存活列表循环当成已验证。",
          "needed_to_close": "同产品所选焚城规则FAQ或客户端边界实证，确认初始目标队列、死亡跳过时X、本人死亡后的继续与伤害归属。"
        }
      },
      {
        "id": "L2",
        "status": "closed_by_dated_official_version_and_literal_recurrence",
        "source_resolution": "有手牌目标由2015官方明确；H/E弃牌由同产品历史指南明示；依次两张非锦囊及不足1张由官方角色目录补述，按每次移动后重新检查的递归语义实现。",
        "old_review": {
          "id": "L2",
          "skill": "sgs.mieji",
          "topic": "sequential_shortfall_and_zone_boundary",
          "material": true,
          "evidence": [
            "mobile-alt-liru",
            "bwiki-liru"
          ],
          "problem": "官方不写目标有牌，社区经典补有牌；两张非锦囊依次弃置，短缺时只弃1/全弃。普通效果可读，但尚缺同产品精确证据关闭仅装备目标、1非锦囊+1锦囊及第一次弃置触发补牌后第二次支付。其他产品对这些有不同版本FAQ，不能移植。",
          "needed_to_close": "同产品经典灭计合法目标区域和逐次弃置FAQ，覆盖0手牌有装备、混合牌类、首次弃置后的补牌/死亡/受保护牌。"
        }
      }
    ],
    "name": "李儒",
    "display_name": "李儒",
    "skill_name": "绝策/灭计/焚城",
    "skill_desc": "绝策：结束阶段开始时，可对一名空手的其他角色造成1点伤害。灭计：出牌阶段限一次，将一张黑色锦囊手牌置顶，令有手牌的其他角色弃一锦囊或依次弃两非锦囊。焚城：限定技，所有其他角色按固定顺序弃至少X牌或受2火伤；X为发动时上家本次实际弃牌数+1。",
    "source_character_name": "李儒",
    "source_game": "三国杀",
    "source_label": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_status": "source-ready-historical",
    "source_coverage": true,
    "source_variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
    "source_version": "移动版身份·2015-12-01历史修订版",
    "snapshot_date": "2026-10-15",
    "faction": "群",
    "source_id_aliases": [],
    "aliases": [
      "三国杀李儒",
      "li-ru",
      "liru",
      "李儒·绝策/灭计/焚城"
    ],
    "source_urls": [
      "https://sanguosha.cn/pc/news-detail-98.html",
      "https://www.sanguosha.cn/hero-detail-133.html",
      "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%84%92",
      "https://game.xiaomi.com/viewpoint/1456229614_1662274264016_134",
      "https://game.xiaomi.com/viewpoint/1456229614_1680509167365_9",
      "https://wiki.biligame.com/msgs/%E7%BB%9D%E7%AD%96/%E6%9D%8E%E5%84%92",
      "https://game.xiaomi.com/viewpoint/1359077112_1665973918336_100",
      "https://www.taptap.cn/moment/137271369468481050"
    ],
    "source_records": [
      {
        "id": "mobile-2015-adjustment",
        "url": "https://sanguosha.cn/pc/news-detail-98.html",
        "final_url": "https://www.sanguosha.cn/pc/news-detail-98.html",
        "status": 200,
        "bytes": 27188,
        "sha256": "cdf72dbb68a460995748ec57e97ddf95183cbb873e869738d4efb4b175caa21e",
        "accessed_at": "2026-10-16T02:18:46.747617+00:00",
        "raw_path": "evidence/mobile-2015-adjustment.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": "2015-12-01",
        "used_for_rules": true,
        "tier": "official_same_product_dated_revision",
        "product": "三国杀移动版",
        "selected_claims": [
          "李儒修订后灭计目标有手牌；绝策结束阶段开始空手其他；焚城发动时上家弃N+1及2火。",
          "伏皇后修订后惴恐用牌限制/单向距离及求援给闪或追加，不能求援杀使用者。"
        ],
        "limitations": [
          "仅改动后栏；改动前历史规则排除。",
          "公告对伏皇后技能误写救援，角色目录名求援为准；不是孙权个人主公技。",
          "官方公告日期明确，但不证明2026当前客户端仍采用有手牌目标版本。"
        ]
      },
      {
        "id": "mobile-alt-liru",
        "url": "https://www.sanguosha.cn/hero-detail-133.html",
        "final_url": "https://www.sanguosha.cn/hero-detail-133.html",
        "status": 200,
        "bytes": 22409,
        "sha256": "754b6c8c715ba4a2f3f4f68fdbb334cad0d33ced02985aed37e45ded14ef991f",
        "accessed_at": "2026-10-16T01:58:56.792896+00:00",
        "raw_path": "evidence/mobile-alt-liru.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": null,
        "used_for_rules": true,
        "tier": "official_same_product_identity_catalog",
        "product": "三国杀移动版",
        "canonical_page_url": "https://www.sanguosha.cn/pc/hero-detail-133.html",
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
                  "name": "绝策",
                  "hidden": false,
                  "raw_rule_text": "结束阶段，你可以对一名没有手牌的其他角色造成1点伤害。",
                  "html_line": 188,
                  "rule_sha256": "6094849e02b1faae440e288a94aadacec4cea68e5b336f4bf1ba7655c3f5beb0"
                },
                {
                  "name": "灭计",
                  "hidden": true,
                  "raw_rule_text": "出牌阶段限一次，你可以将一张黑色锦囊牌置于牌堆顶并选择一名其他角色，然后令该角色弃置一张锦囊牌，或依次弃置两张非锦囊牌（不足则只需弃1张）。",
                  "html_line": 189,
                  "rule_sha256": "0921ddfc2389e82ddf94bdaf61c40c032b49ed25b32b882e8f52a2219262ccc8"
                },
                {
                  "name": "焚城",
                  "hidden": true,
                  "raw_rule_text": "限定技，出牌阶段，你可以令所有其他角色依次选择一项：1.弃置至少X张牌（X为发动此技能时该角色的上家以此法弃置牌的数量+1）；2.受到你造成的2点火焰伤害。",
                  "html_line": 190,
                  "rule_sha256": "56994270296a022b6b964bf40fed24456a32a3e17b39ef9d40b9a13ceb843461"
                }
              ]
            }
          ],
          "selected_group": "身份",
          "inventory_complete_for_selected_group": true
        },
        "metadata": {
          "source_faction": "群",
          "max_hp_explicit": null,
          "gender_explicit": null,
          "initial_hp_explicit": null
        },
        "limitations": [
          "未标注规则生效日期；实时读取不能认证2026-10-15历史状态或当前客户端。",
          "/pc路径部分请求502/超时；无/pc的同站官方页面为实取来源，保留实际URL与返回URL。",
          "全部内嵌隐藏技能面板已逐项抽取；未从画像推算体力/性别。"
        ]
      },
      {
        "id": "bwiki-liru",
        "url": "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%84%92",
        "final_url": "https://wiki.biligame.com/msgs/%E6%9D%8E%E5%84%92",
        "status": 200,
        "bytes": 96709,
        "sha256": "45c0b9a27dc793e25ac3c89e4790e8e7a573f1f7b6a63633fef675344505df8a",
        "accessed_at": "2026-10-16T01:57:26.202981+00:00",
        "raw_path": "evidence/bwiki-liru.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": null,
        "used_for_rules": true,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 35313,
        "modified_at": "2025-12-20T13:37:33Z",
        "limitations": [
          "非官方裁定、非客户端实测。",
          "只选明确经典条目；排除原版历史块、1V1、界限突破和页末混用卡片。模板修订日期不是规则生效日期。"
        ],
        "metadata": {
          "max_hp": 3,
          "hp_icon_count": 3,
          "hp_numeric": 3,
          "gender": "male",
          "faction": "群",
          "selected_section": "经典",
          "hp_html_line": 634,
          "gender_html_line": 629,
          "faction_html_line": 630,
          "initial_hp_explicit": null
        }
      },
      {
        "id": "xiaomi-liru-2022",
        "url": "https://game.xiaomi.com/viewpoint/1456229614_1662274264016_134",
        "final_url": "https://game.xiaomi.com/viewpoint/1456229614_1662274264016_134",
        "status": 200,
        "bytes": 55061,
        "sha256": "d1f1f5e8b4292d91f5438f54d238094d5b4bfa603a081f9cbc187a59947adb46",
        "accessed_at": "2026-10-16T02:16:41.905429+00:00",
        "raw_path": "evidence/xiaomi-liru-2022.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": "2022-09-04",
        "used_for_rules": true,
        "tier": "same_product_historical_community_guide_mislabeled_variant",
        "product": "三国杀移动版",
        "selected_claims": [
          "正文说灭计成本为特定手牌、目标须有手牌、目标自己弃且可以弃手牌和装备。"
        ],
        "limitations": [
          "小节题名界李儒，正文空手绝策/弃牌灭计实际描述修订经典版；仅使用与2015官方明确相符的区域/付款者句子，不将题名当当前界版证据。"
        ]
      },
      {
        "id": "xiaomi-liru-2023",
        "url": "https://game.xiaomi.com/viewpoint/1456229614_1680509167365_9",
        "final_url": "https://game.xiaomi.com/viewpoint/1456229614_1680509167365_9",
        "status": 200,
        "bytes": 48033,
        "sha256": "b021675644e3b5caf02de78a76bdb2d457fb70a3ccf9cd9b6532e560a56d9443",
        "accessed_at": "2026-10-16T02:16:42.574339+00:00",
        "raw_path": "evidence/xiaomi-liru-2023.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": "2023-04-03",
        "used_for_rules": true,
        "tier": "same_product_historical_community_variant_comparison",
        "product": "三国杀移动版",
        "selected_claims": [
          "明确标界区别：弃锦囊改交锦囊；依次两非锦囊不足1张。",
          "焚城不改：允许超额弃，H/E均可。"
        ],
        "limitations": [
          "只取明示比较与共享焚城，界版绝策/交锦囊不覆盖经典。"
        ]
      },
      {
        "id": "bwiki-juece-detail",
        "url": "https://wiki.biligame.com/msgs/%E7%BB%9D%E7%AD%96/%E6%9D%8E%E5%84%92",
        "final_url": "https://wiki.biligame.com/msgs/%E7%BB%9D%E7%AD%96/%E6%9D%8E%E5%84%92",
        "status": 200,
        "bytes": 73026,
        "sha256": "31776e3dec9b79bb1ccd91cefbe8c855771a63225e03ed4138c60ed17a9f6c95",
        "accessed_at": "2026-10-16T01:58:34.696624+00:00",
        "raw_path": "evidence/bwiki-juece-detail.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": null,
        "used_for_rules": true,
        "tier": "same_product_community_wiki",
        "product": "三国杀移动版",
        "revision_id": 35318,
        "modified_at": "2025-12-21T08:30:52Z",
        "limitations": [
          "非官方裁定、非客户端实测。",
          "只选明确经典条目；排除原版历史块、1V1、界限突破和页末混用卡片。模板修订日期不是规则生效日期。"
        ]
      },
      {
        "id": "xiaomi-fencheng-reset",
        "url": "https://game.xiaomi.com/viewpoint/1359077112_1665973918336_100",
        "final_url": "https://game.xiaomi.com/viewpoint/1359077112_1665973918336_100",
        "status": 200,
        "bytes": 34598,
        "sha256": "02972094136c7dccfc8e10ef959cb8a1073a5ce7072c63ba87a30cb56be77e65",
        "accessed_at": "2026-10-16T02:01:24.217348+00:00",
        "raw_path": "evidence/xiaomi-fencheng-reset.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": "2022-10-17",
        "used_for_rules": true,
        "tier": "same_product_historical_community_guide",
        "product": "三国杀移动版",
        "selected_claims": [
          "上一名进行选择的角色未以焚城弃牌时，下一名所需弃牌数为1；弃N张后则N+1。"
        ],
        "excluded_claims": [
          "文章声称发动必有人死亡，属于夸张且错误的一般化，不能转为规则或验收断言。"
        ],
        "limitations": [
          "不能关闭目标中途死亡或李儒本人中途死亡时的队列与X取样。"
        ]
      },
      {
        "id": "xiaomi-liru-variant-comparison",
        "url": "https://www.taptap.cn/moment/137271369468481050",
        "final_url": "https://www.taptap.cn/moment/137271369468481050",
        "status": 200,
        "bytes": 16124,
        "sha256": "843959d1aac3f9c4d5c6e4b4d7a7765131f9881ff4d3f89ef2a0f111917ed962",
        "accessed_at": "2026-10-16T02:03:33.940017+00:00",
        "raw_path": "evidence/xiaomi-liru-variant-comparison.html",
        "snapshot_selection_date": "2026-10-15",
        "current_client_verified": false,
        "publication_date": "2021-04-30",
        "used_for_rules": true,
        "tier": "same_product_historical_community_guide",
        "product": "三国杀移动版 TapTap",
        "selected_claims": [
          "明确比较原版绝策需空手、界版改失去过牌；原版灭计弃锦囊，界版改交给李儒；焚城未修改。"
        ],
        "excluded_claims": [
          "界版绝策/灭计规则不得覆盖本包经典身份规则。"
        ],
        "limitations": [
          "题名未标界，正文实际界李儒；仅用明示标界对比。"
        ]
      }
    ],
    "current_client_verified": false,
    "host_compatibility_policies": [
      {
        "id": "H0",
        "kind": "cross_game_host_compatibility",
        "policy": "3为本包经典模板体力上限。普通对战以满模板体力开始；身份模式主公加成独立由模式规则处理，不能更改模板3。阵营保存魏/蜀/群，队伍敌友另存。原网页无独立初始HP字段。"
      },
      {
        "id": "H1",
        "kind": "cross_game_host_compatibility",
        "policy": "江湖映射基本/锦囊/装备三大类；延时与普通锦囊同属锦囊；每次展示/成本/使用必须读该动作上下文的有效身份，不能把仅使用时转换套到展示或弃置。来源名与江湖同效卡名通过功能ID映射。"
      },
      {
        "id": "H2",
        "kind": "cross_game_host_compatibility",
        "policy": "主动成本、使用次数与决策ID采用原子提交、恰好一次。提交前取消不扣牌或次数；提交后触发技能嵌套不退款。手牌暗选由持有者/其AI完成，不向对方AI泄露。公共展示仅公开选中实体。"
      },
      {
        "id": "H3",
        "kind": "cross_game_host_compatibility",
        "policy": "实际伤害、失去体力和回复使用宿主统一管线。先完成濒死/救援再开启存活者的伤害后技能。游戏终局立即终止新决策。没有源产品证据的具体技能死亡续算不得借本约定静默补齐，李儒历史版额外标注H8兼容续算，不冒充当前手游证实。"
      },
      {
        "id": "H4",
        "kind": "cross_game_host_compatibility",
        "policy": "每真实出牌阶段都有独立phase_id；额外阶段重置阶段限一次，但不重置本回合效果。翻面/入链必须通过正式状态事件。缺牌摸牌按正常回收弃牌堆、洗牌与牌守恒处理，不能复制实体补足。"
      },
      {
        "id": "H5",
        "kind": "cross_game_host_compatibility",
        "policy": "复制/易装/变身从完整有效固有技能清单取得能力，不按显示名判断。新持有者用自己的事件与次数账本；失去再获得同一技能不刷新已用额度或限定标记。复制者的角色身份与阵营仍遵守既有变身契约。不能因仅能暂时复制而做英雄去重。"
      },
      {
        "id": "H6",
        "kind": "cross_game_host_compatibility",
        "policy": "本包三位无专属持久实体牌堆；李儒的灭计置入全局牌堆顶，不是持有者私有堆。所有展示/拼点/置顶实体都纳入分区、序列化、死亡清理和重放守恒。已合法置顶不因持有者后来死亡或失技而取回。"
      },
      {
        "id": "H7",
        "kind": "cross_game_host_compatibility",
        "policy": "本次只设计经典身份实体；1V1、国战、欢乐、界、OL、十周年等各模式/变体后续单独盘点，不能视作本包已覆盖。个人主公技/授予技/获得技清单即使为空也必须显式记录。画面使用新制原创肖像和原创符号，保留真实姓名/技能名及来源链接。"
      },
      {
        "id": "H8",
        "kind": "cross_game_host_compatibility_not_mobile_client_certification",
        "scope": "liru only",
        "policy": "已提交的灭计/焚城独立效果继续按原事务处理，即使原持有者后来死亡、失技或易装；不能再以新发动资格中止已经承诺的全局队列。目标已死则跳过其新选择，不伪造弃牌。焚城初始队列/上家映射不随宿主异游戏换座改写；回合外新增角色不插入。每次伤害按源是否仍存活取得实际来源：原持有者已死则伤害来源为空，但causal_owner_id与原激活ID保留；不再触发死者技能/奖励。对局终局停止新选择。灭计逐次弃牌中目标死亡停止该目标，原持有者死亡不返还已置顶成本；可弃牌全受外来保护时无可付选项则结束不追加伤害。以上是声明的江湖兼容约定，不能外推为移动版原生死亡裁定。",
        "existing_precedent": "sgs-forest-assault-skills.js sgs_forest_aoe_damage_source already uses null when committed source deceased."
      }
    ],
    "artwork": {
      "kind": "original",
      "portrait": "portraits-sgs-identity-next/li-ru.svg"
    },
    "complete_mechanism_signature": {
      "identity": {
        "max_hp": 3,
        "gender": "male",
        "source_faction": "群",
        "variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target"
      },
      "skills": [
        {
          "id": "sgs.juece",
          "name": "绝策",
          "type": "optional_finish_phase_empty_hand_skill_damage",
          "timing": "自己的结束阶段开始时，已经完成正常弃牌阶段；非旧版回合内他人失去最后手牌时",
          "quota": "每个结束阶段一个可选目标，不按空手次数重复",
          "cost": "无牌成本",
          "targets": "一名没有手牌的其他存活角色，不限距离或阵营",
          "effects": [
            "造成来自李儒的1点普通技能伤害；不是杀、不是失去体力，不提供闪响应。目标可以有装备或判定区牌，只检查手牌。",
            "没有手牌的自己不可以选。目标本回合没失去牌也可选；有手牌但曾失去牌不可选。绝策需结束阶段实际存在。",
            "不采用历史原版“于你的回合失去最后手牌后”时序，也不采用界版“本回合失去过牌”条件。"
          ],
          "source_refs": [
            "mobile-alt-liru",
            "bwiki-liru",
            "bwiki-juece-detail",
            "xiaomi-liru-variant-comparison",
            "mobile-2015-adjustment"
          ],
          "raw_evidence": {
            "path": "evidence/mobile-alt-liru.html",
            "line": 188,
            "rule_sha256": "6094849e02b1faae440e288a94aadacec4cea68e5b336f4bf1ba7655c3f5beb0"
          },
          "official_panel_hidden": false,
          "intrinsic_unresolved": [],
          "limited_marker": null,
          "awakening_marker": null,
          "official_rule_text": "结束阶段开始时，你可以对没有手牌的一名其他角色造成1点伤害。",
          "selected_official_rule_sha256": "67b0b4f8e5efce863eb7fcc1870158c836ecf6b3859e1890178c532afc1d3290",
          "selected_official_source": "mobile-2015-adjustment"
        },
        {
          "id": "sgs.mieji",
          "name": "灭计",
          "type": "once_play_phase_black_trick_topdeck_then_forced_discard",
          "timing": "自己的真实出牌阶段动作窗口",
          "quota": "每出牌阶段限一次，非本回合限一次；效果后不能取回成本刷新",
          "cost": "将自己一张黑色锦囊手牌置于全局牌堆顶；不是弃置/使用，已在判定区的锦囊不能付",
          "targets": "一名有手牌的其他存活角色；所选2015-12-01官方历史版明确须有手牌，不能仅因有装备就合法",
          "effects": [
            "成本为自己真实手牌中的黑色锦囊，包含普通及延时锦囊；置入全局牌堆顶，保留实体、花色、点数。非使用/打出转换不改持有成本身份。",
            "目标自己选择：弃置1张锦囊，或依次弃置2张非锦囊。目标支付可来自手牌及装备区，不来自判定区/私有牌堆；同产品历史指南明确装备配合。",
            "“依次”解释为逐张选取、移动、完成该张失去/装备离场后再检查下一张。不能一次锁定2牌并同时移动，也不能让李儒看全手代选。",
            "若第二分支只有1张可弃非锦囊，先弃该张并完成对应事件，然后重查：若此时仍无可弃非锦囊，则结束，不强迫弃锦囊；若因枭姬等新得非锦囊，则必须继续弃第2张。总计最多2张非锦囊。",
            "恰有1非锦囊+1锦囊的目标可以选择只弃非锦囊（若第一弃后未新增非锦囊）。只有锦囊而无可弃非锦囊时不能选0张空付第二分支；须弃1张合法锦囊。所有合法牌均不能弃的特殊外来保护按H8处理。",
            "“不足”指本分支可弃非锦囊不足，不是从现有所有牌凑2张；不可混合1锦囊+1非锦囊。上述递归是文本语义推导，非独立FAQ或当前客户端实测。",
            "目标无手但有装备在选定版本不合法。目标选择完毕、李儒已置顶后，被嵌套效果抽空或死亡不返还成本/阶段次数；后续按H8处理。",
            "弃锦囊不会给李儒，排除界版改交锦囊；不采用OL界版红锦囊成本/两张任意牌。"
          ],
          "source_refs": [
            "mobile-alt-liru",
            "bwiki-liru",
            "xiaomi-liru-variant-comparison",
            "mobile-2015-adjustment",
            "xiaomi-liru-2022",
            "xiaomi-liru-2023"
          ],
          "raw_evidence": {
            "path": "evidence/mobile-alt-liru.html",
            "line": 189,
            "rule_sha256": "0921ddfc2389e82ddf94bdaf61c40c032b49ed25b32b882e8f52a2219262ccc8"
          },
          "official_panel_hidden": true,
          "intrinsic_unresolved": [],
          "limited_marker": null,
          "awakening_marker": null,
          "official_rule_text": "出牌阶段限一次，你可以将一张黑色锦囊牌置于牌堆顶并选择一名有手牌的其他角色，然后令该角色选择一项：弃置一张锦囊牌；或依次弃置两张非锦囊牌。",
          "selected_official_rule_sha256": "e5929f138faf88ace574dc99124495e92309b2ecb6ecbd2f51f9c712d807714f",
          "selected_official_source": "mobile-2015-adjustment"
        },
        {
          "id": "sgs.fencheng",
          "name": "焚城",
          "type": "limited_ordered_global_discard_escalation_or_fire_damage",
          "timing": "自己的出牌阶段",
          "quota": "限定技，一局一次；不能因额外回合/阶段自动重置",
          "cost": "消费一次限定标记，无手牌成本",
          "targets": "所有其他角色依次处理，包含队友；不得只选敌人或自行选起点",
          "effects": [
            "所有其他存活角色按行动顺序依次选择，第一位为李儒下家，不得任意选起点或跳队友。每人可弃至少X张手牌/装备，或受来自李儒的2点火焰技能伤害。",
            "所选2015官方文字明确X按“发动此技能时该角色的上家”本次实际弃牌数+1。开始时锁定这张上家身份映射；首位上家为李儒，本次未以焚城弃牌，故X=1。",
            "上家以本次焚城弃N张，则X=N+1；上家未以焚城弃牌则N=0，X=1。可超额弃牌抬高后继门槛，不是恰好X；不足X张不能部分付费充数。",
            "焚城弃牌可来自H/E，不能弃J或私有堆；每个目标选择的整批N须原子支付后记录实际N，再进行失去事件。",
            "火伤经过统一防伤、增减伤、濒死救援、链传播。不是杀或锦囊牌，不能用闪/无懈，实际被完全防止仍未以焚城弃牌，后继N视0。",
            "官方“发动时上家”与Wiki“上一名此技能目标”分开保存；不因后续跳过死亡人物而重新定义前者。初始上家未获执行便死亡，其弃N记录保持0；已弃N后死亡记录仍N。此为固定上家文字的直接结果。",
            "中途来源死亡、失技、角色换座及对局终局的事务续算采用明确H8，不能声称经手游客户端证实。"
          ],
          "source_refs": [
            "mobile-alt-liru",
            "bwiki-liru",
            "xiaomi-fencheng-reset",
            "xiaomi-liru-variant-comparison",
            "mobile-2015-adjustment",
            "xiaomi-liru-2023"
          ],
          "raw_evidence": {
            "path": "evidence/mobile-alt-liru.html",
            "line": 190,
            "rule_sha256": "56994270296a022b6b964bf40fed24456a32a3e17b39ef9d40b9a13ceb843461"
          },
          "official_panel_hidden": true,
          "intrinsic_unresolved": [],
          "limited_marker": "fencheng_once_per_game",
          "awakening_marker": null,
          "official_rule_text": "限定技，出牌阶段，你可以令所有其他角色依次选择一项：弃置至少X张牌（X为发动此技能时该角色的上家以此法弃置牌的数量+1）；或受到你对其造成的2点火焰伤害。",
          "selected_official_rule_sha256": "cb14d3bf7214c967bf4d1f2c26dd7d6ba2ee37f7b0e743435b5da8af86e3ce2c",
          "selected_official_source": "mobile-2015-adjustment"
        }
      ],
      "personal_lord_skills": [],
      "granted_skill_inventory": [],
      "acquired_skill_inventory": []
    },
    "complete_mechanism_signature_sha256": "0eee2a871a04b39bb7755b7e43b924717d3fdd4a623b5e3c805670d1b7a0a83a"
  }
]);
export const SGS_LIRU_DEFINITION=SGS_LIRU_DEFINITIONS[0];
