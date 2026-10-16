/** Complete selected classic Mobile identity packet. Module-tested; host admission/UI remain separate. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_MANCHONG_HERO_ID="sgs.adapted.base.hero.man-chong";
export const SGS_MANCHONG_SKILL_IDS=freeze({junxing:"sgs.junxing",yuce:"sgs.yuce"});
export const SGS_MANCHONG_DEFINITION=freeze({
  "key": "manchong",
  "id": "sgs.adapted.base.hero.man-chong",
  "source_name": "满宠",
  "suggested_display_name": "满宠",
  "max_hp": 3,
  "starting_hp": 3,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "H0 cross-game host initialization",
  "gender": "male",
  "source_faction": "魏",
  "product": "三国杀移动版",
  "variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
  "official_page_id": 125,
  "source_refs": [
    "mobile-alt-manchong",
    "bwiki-manchong"
  ],
  "intrinsic_skill_inventory": [
    "峻刑",
    "御策"
  ],
  "skill_ids": [
    "sgs.junxing",
    "sgs.yuce"
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
  "ready_for_implementation": true,
  "intrinsic_unresolved": [],
  "skills": [
    {
      "id": "sgs.junxing",
      "name": "峻刑",
      "type": "optional_active_discard_type_choice_flip_draw",
      "timing": "自己的每个真实出牌阶段动作窗口",
      "quota": "每个出牌阶段限一次，不是每回合限一次；目标选择哪一项均耗本阶段机会",
      "cost": "弃置自己任意正整数张可弃置手牌；数量和三大类别集合在成功支付时锁定；不允许装备区/判定区/私有牌堆支付",
      "targets": "一名其他存活角色；不要求其有手牌，不限阵营或距离",
      "effects": [
        "由满宠选择成本手牌和目标，再由目标选择分支。成本不可为0张：该主动技要求实际执行弃置成本；不增加3张上限或“每类限一张”的限制。",
        "分支1只弃目标自己的1张手牌，该牌类别必须不属于满宠本次弃置成本的任何类别。类别为基本/锦囊/装备，不是花色、牌名或普通/延时细类。",
        "目标没有合格可弃手牌或选择不弃时，执行分支2：先翻面，再摸N张，N为满宠本次实际弃置数。不是摸至N，也不是摸至4。",
        "目标原来背面朝上时可翻回正面，仍摸N张；不是强制设置为背面。满宠可主动帮助队友复原。目标原来无手牌依然是合法目标。",
        "若成本含三大类则目标不存在不同于所有成本类别的牌，只能翻面摸牌；成本同类别多张仍令N增大。选择分支1成功后不摸牌、不翻面、不失去体力。",
        "弃成本与目标弃牌分别发出正常弃置事件，翻面发出双向状态变化事件，可触发现有法恩等。摸牌使用正常牌堆，不创造缺失的牌。"
      ],
      "source_refs": [
        "mobile-alt-manchong",
        "bwiki-manchong",
        "bwiki-junxing-detail"
      ],
      "raw_evidence": {
        "path": "evidence/mobile-alt-manchong.html",
        "line": 184,
        "rule_sha256": "b503a3e6dc1c4cb21e1034bfe9072baa684bb7c6badd19fcac5637843b42dee1"
      },
      "official_panel_hidden": false,
      "intrinsic_unresolved": [],
      "limited_marker": null,
      "awakening_marker": null
    },
    {
      "id": "sgs.yuce",
      "name": "御策",
      "type": "optional_after_damage_reveal_type_tax_or_heal",
      "timing": "每次实际受到伤害并完成救援且自己存活之后",
      "quota": "每次伤害事件一次机会，不是每一点伤害一次；不设每回合次数上限",
      "cost": "展示自己1张现有手牌；不弃置、不交给伤害来源，展示后仍归自己",
      "targets": "固定为该伤害事件的实际来源；由来源决定是否弃不同类别手牌，回血对象固定为满宠",
      "effects": [
        "自己必须仍有手牌。通过展示手牌后，伤害来源可弃1张与展示牌三大类别不同的手牌；来源手牌不足/无合格牌/拒绝，满宠回复1点体力。",
        "来源支付不能用已安装装备、判定牌或私有堆；不能把2张同类别牌凑作1张不同类别。拒绝付款是允许选择，不按敌友自动决定。",
        "这是伤害后回复，不能防止已发生的伤害、返还全部伤害或把多点伤害拆成多次御策。一次3点伤害存活后最多回复1点。失去体力、伤害完全被防止不会触发。",
        "若伤害使满宠进入濒死，先按正常求桃救援。被救回并仍有手牌后才有御策；已经死亡不能自救。回复上限封顶。",
        "同产品2022攻略明确无伤害来源不能发动御策；无来源闪电伤害不能直接让其回1。不要凭“否则”把不存在来源当作拒付。",
        "按真正伤害来源，不按杀的原使用者：转移/来源改写后的事件来源决定谁选择付款。自己造成自己伤害时来源可为自己，依正常手牌类别检查；展示牌仍在手中但其类别相同，不能拿它支付不同类别。"
      ],
      "source_refs": [
        "mobile-alt-manchong",
        "bwiki-manchong",
        "bwiki-yuce-detail",
        "xiaomi-manchong-2022",
        "xiaomi-manchong-2023",
        "mobile-manchong-comparison"
      ],
      "raw_evidence": {
        "path": "evidence/mobile-alt-manchong.html",
        "line": 185,
        "rule_sha256": "8c5247137078bb98a656acacf2387074c497d3c3fee1e3507161180e0071c84e"
      },
      "official_panel_hidden": true,
      "intrinsic_unresolved": [],
      "limited_marker": null,
      "awakening_marker": null
    }
  ],
  "ui_requirements": [
    "峻刑成本支持多张手牌，预览数量及三大类别；目标自己的二选一界面不向满宠暴露其他暗牌。",
    "御策公开且只公开1张选定手牌；来源收到合格异类别手牌/拒绝提示。区分受到伤害、濒死救援、之后回血动画。",
    "次数绑定实际阶段；翻回正面也应显示并广播真实翻面事件。"
  ],
  "rule_expansion_notes": [
    "选择经典3HP男魏全两技能，不采用界峻刑等量弃牌加失去体力，也不采用一将之魂摸至4。",
    "御策边界来自同产品历史界满宠指南，只因技能未改且官方社区明确比较一致而使用，非把整位界满宠规则移入。",
    "死亡/失技发生在跨游戏嵌套成本回调时遵守H2/H3稳定事务规则；不额外获得源手游未写明的死亡触发。"
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
  "name": "满宠",
  "display_name": "满宠",
  "skill_name": "峻刑/御策",
  "skill_desc": "峻刑：出牌阶段限一次，弃置任意正数张手牌，令其他角色弃一张类别不同于所有成本的手牌，或翻面并摸等量牌。御策：每次实际受伤并完成救援后，可展示一张手牌；实际伤害来源弃一张异类别手牌，否则自己回复1点体力。无来源不能发动。",
  "source_character_name": "满宠",
  "source_label": "三国杀",
  "source_status": "verified",
  "source_coverage": true,
  "source_game": "三国杀",
  "source_variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
  "snapshot_date": "2026-10-15",
  "faction": "魏",
  "source_id_aliases": [],
  "aliases": [
    "三国杀满宠",
    "man-chong",
    "manchong",
    "满宠·峻刑"
  ],
  "source_urls": [
    "https://www.sanguosha.cn/hero-detail-125.html",
    "https://wiki.biligame.com/msgs/%E6%BB%A1%E5%AE%A0",
    "https://wiki.biligame.com/msgs/%E5%B3%BB%E5%88%91/%E6%BB%A1%E5%AE%A0",
    "https://wiki.biligame.com/msgs/%E5%BE%A1%E7%AD%96/%E6%BB%A1%E5%AE%A0",
    "https://game.xiaomi.com/viewpoint/1195705742_1642595800733_100",
    "https://game.xiaomi.com/viewpoint/1456229614_1680508985240_9",
    "https://xianhua.sanguosha.cn/postDetails?id=11430666"
  ],
  "source_records": [
    {
      "id": "mobile-alt-manchong",
      "url": "https://www.sanguosha.cn/hero-detail-125.html",
      "final_url": "https://www.sanguosha.cn/hero-detail-125.html",
      "status": 200,
      "bytes": 21608,
      "sha256": "eedf4ae254396017e71c043c0f4d4c7dee27e52cbf92657a1c7c394a0d5940c8",
      "accessed_at": "2026-10-16T01:58:56.692294+00:00",
      "raw_path": "evidence/mobile-alt-manchong.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "used_for_rules": true,
      "tier": "official_same_product_identity_catalog",
      "product": "三国杀移动版",
      "canonical_page_url": "https://www.sanguosha.cn/pc/hero-detail-125.html",
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
                "name": "峻刑",
                "hidden": false,
                "raw_rule_text": "出牌阶段限一次，你可以弃置任意张手牌并选择一名其他角色，然后令其选择一项：1.弃置与你弃置的牌类别均不同的一张手牌；2.翻面，然后摸等量的牌。",
                "html_line": 184,
                "rule_sha256": "b503a3e6dc1c4cb21e1034bfe9072baa684bb7c6badd19fcac5637843b42dee1"
              },
              {
                "name": "御策",
                "hidden": true,
                "raw_rule_text": "当你受到伤害后，你可以展示一张手牌。若如此做，除非伤害来源弃置与你展示的牌类别不同的一张手牌，否则你回复1点体力。",
                "html_line": 185,
                "rule_sha256": "8c5247137078bb98a656acacf2387074c497d3c3fee1e3507161180e0071c84e"
              }
            ]
          }
        ],
        "selected_group": "身份",
        "inventory_complete_for_selected_group": true
      },
      "metadata": {
        "source_faction": "魏",
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
      "id": "bwiki-manchong",
      "url": "https://wiki.biligame.com/msgs/%E6%BB%A1%E5%AE%A0",
      "final_url": "https://wiki.biligame.com/msgs/%E6%BB%A1%E5%AE%A0",
      "status": 200,
      "bytes": 80654,
      "sha256": "a4ac6142a11b445e93088cd21623e793fa3e291c6bc63e98c5011ef0a9ec6788",
      "accessed_at": "2026-10-16T01:57:26.286677+00:00",
      "raw_path": "evidence/bwiki-manchong.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "used_for_rules": true,
      "tier": "same_product_community_wiki",
      "product": "三国杀移动版",
      "revision_id": 21351,
      "modified_at": "2023-02-01T12:54:12Z",
      "limitations": [
        "非官方裁定、非客户端实测。",
        "只选明确经典条目；排除原版历史块、1V1、界限突破和页末混用卡片。模板修订日期不是规则生效日期。"
      ],
      "metadata": {
        "max_hp": 3,
        "hp_icon_count": 3,
        "hp_numeric": 3,
        "gender": "male",
        "faction": "魏",
        "selected_section": "经典",
        "hp_html_line": 602,
        "gender_html_line": 597,
        "faction_html_line": 598,
        "initial_hp_explicit": null
      }
    },
    {
      "id": "bwiki-junxing-detail",
      "url": "https://wiki.biligame.com/msgs/%E5%B3%BB%E5%88%91/%E6%BB%A1%E5%AE%A0",
      "final_url": "https://wiki.biligame.com/msgs/%E5%B3%BB%E5%88%91/%E6%BB%A1%E5%AE%A0",
      "status": 200,
      "bytes": 68318,
      "sha256": "b91c410201d6a09514ea144021a00726ee313e132558f91f66794f7784b2fbae",
      "accessed_at": "2026-10-16T01:58:30.289629+00:00",
      "raw_path": "evidence/bwiki-junxing-detail.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "used_for_rules": true,
      "tier": "same_product_community_wiki",
      "product": "三国杀移动版",
      "revision_id": 21353,
      "modified_at": "2023-02-01T12:57:02Z",
      "limitations": [
        "非官方裁定、非客户端实测。",
        "只选明确经典条目；排除原版历史块、1V1、界限突破和页末混用卡片。模板修订日期不是规则生效日期。"
      ]
    },
    {
      "id": "bwiki-yuce-detail",
      "url": "https://wiki.biligame.com/msgs/%E5%BE%A1%E7%AD%96/%E6%BB%A1%E5%AE%A0",
      "final_url": "https://wiki.biligame.com/msgs/%E5%BE%A1%E7%AD%96/%E6%BB%A1%E5%AE%A0",
      "status": 200,
      "bytes": 68457,
      "sha256": "b0232114ef5a08e7b9a1419af57d3354f22c9e8a76b4d1f921d1cfbae9ce7c5d",
      "accessed_at": "2026-10-16T01:58:30.962727+00:00",
      "raw_path": "evidence/bwiki-yuce-detail.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": null,
      "used_for_rules": true,
      "tier": "same_product_community_wiki",
      "product": "三国杀移动版",
      "revision_id": 21354,
      "modified_at": "2023-02-01T12:58:07Z",
      "limitations": [
        "非官方裁定、非客户端实测。",
        "只选明确经典条目；排除原版历史块、1V1、界限突破和页末混用卡片。模板修订日期不是规则生效日期。"
      ]
    },
    {
      "id": "xiaomi-manchong-2022",
      "url": "https://game.xiaomi.com/viewpoint/1195705742_1642595800733_100",
      "final_url": "https://game.xiaomi.com/viewpoint/1195705742_1642595800733_100",
      "status": 200,
      "bytes": 51684,
      "sha256": "01ca737fe4d7a7d5f8eb5ba18455595369a3ac5681e000a22e8afa4ae1e0add9",
      "accessed_at": "2026-10-16T02:00:22.830511+00:00",
      "raw_path": "evidence/xiaomi-manchong-2022.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": "2022-01-19",
      "used_for_rules": true,
      "tier": "same_product_historical_community_guide",
      "product": "三国杀移动版 Xiaomi Android",
      "selected_claims": [
        "御策无伤害来源或无手牌不能发动。",
        "濒死先求桃获救存活，之后才可发动御策；不能用御策代替救援。",
        "伤害来源可以主动不弃牌而令满宠回复。"
      ],
      "excluded_claims": [
        "文章讨论界满宠，峻刑改为等量弃牌并失去体力的部分全部排除。",
        "2023文章复述2022内容，不能算作独立的规则交叉验证。"
      ],
      "limitations": [
        "只补未改动的御策，原版/界版一致性另见同产品官方社区比较；非当前客户端或官方FAQ认证。"
      ]
    },
    {
      "id": "xiaomi-manchong-2023",
      "url": "https://game.xiaomi.com/viewpoint/1456229614_1680508985240_9",
      "final_url": "https://game.xiaomi.com/viewpoint/1456229614_1680508985240_9",
      "status": 200,
      "bytes": 42197,
      "sha256": "d6534fe22aabf359b3c599c563b142eb604a6dae0862c3ffdef43497557def6f",
      "accessed_at": "2026-10-16T02:00:23.462616+00:00",
      "raw_path": "evidence/xiaomi-manchong-2023.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": "2023-04-03",
      "used_for_rules": true,
      "tier": "same_product_historical_community_guide",
      "product": "三国杀移动版 Xiaomi Android",
      "selected_claims": [
        "御策无伤害来源或无手牌不能发动。",
        "濒死先求桃获救存活，之后才可发动御策；不能用御策代替救援。",
        "伤害来源可以主动不弃牌而令满宠回复。"
      ],
      "excluded_claims": [
        "文章讨论界满宠，峻刑改为等量弃牌并失去体力的部分全部排除。",
        "2023文章复述2022内容，不能算作独立的规则交叉验证。"
      ],
      "limitations": [
        "只补未改动的御策，原版/界版一致性另见同产品官方社区比较；非当前客户端或官方FAQ认证。"
      ]
    },
    {
      "id": "mobile-manchong-comparison",
      "url": "https://xianhua.sanguosha.cn/postDetails?id=11430666",
      "final_url": "https://xianhua.sanguosha.cn/postDetails?id=11430666",
      "status": 200,
      "bytes": 350786,
      "sha256": "b1cbaa047f12d56e99a5164514e6e6325c4167116b70ec6d1f4f0abe4dd8944f",
      "accessed_at": "2026-10-16T02:00:24.364678+00:00",
      "raw_path": "evidence/mobile-manchong-comparison.html",
      "snapshot_selection_date": "2026-10-15",
      "current_client_verified": false,
      "publication_date": "2025-08-28",
      "used_for_rules": true,
      "tier": "official_hosted_same_product_community_post",
      "product": "三国杀移动版 三国咸话",
      "selected_claims": [
        "明确说标满宠与界满宠的御策没有变化，改变的是峻刑。"
      ],
      "limitations": [
        "官方社区承载的玩家帖，并非官方规则裁定。"
      ]
    }
  ],
  "source_skill_rules": [
    {
      "id": "sgs.junxing",
      "name": "峻刑",
      "type": "optional_active_discard_type_choice_flip_draw",
      "timing": "自己的每个真实出牌阶段动作窗口",
      "quota": "每个出牌阶段限一次，不是每回合限一次；目标选择哪一项均耗本阶段机会",
      "cost": "弃置自己任意正整数张可弃置手牌；数量和三大类别集合在成功支付时锁定；不允许装备区/判定区/私有牌堆支付",
      "targets": "一名其他存活角色；不要求其有手牌，不限阵营或距离",
      "effects": [
        "由满宠选择成本手牌和目标，再由目标选择分支。成本不可为0张：该主动技要求实际执行弃置成本；不增加3张上限或“每类限一张”的限制。",
        "分支1只弃目标自己的1张手牌，该牌类别必须不属于满宠本次弃置成本的任何类别。类别为基本/锦囊/装备，不是花色、牌名或普通/延时细类。",
        "目标没有合格可弃手牌或选择不弃时，执行分支2：先翻面，再摸N张，N为满宠本次实际弃置数。不是摸至N，也不是摸至4。",
        "目标原来背面朝上时可翻回正面，仍摸N张；不是强制设置为背面。满宠可主动帮助队友复原。目标原来无手牌依然是合法目标。",
        "若成本含三大类则目标不存在不同于所有成本类别的牌，只能翻面摸牌；成本同类别多张仍令N增大。选择分支1成功后不摸牌、不翻面、不失去体力。",
        "弃成本与目标弃牌分别发出正常弃置事件，翻面发出双向状态变化事件，可触发现有法恩等。摸牌使用正常牌堆，不创造缺失的牌。"
      ],
      "source_refs": [
        "mobile-alt-manchong",
        "bwiki-manchong",
        "bwiki-junxing-detail"
      ],
      "raw_evidence": {
        "path": "evidence/mobile-alt-manchong.html",
        "line": 184,
        "rule_sha256": "b503a3e6dc1c4cb21e1034bfe9072baa684bb7c6badd19fcac5637843b42dee1"
      },
      "official_panel_hidden": false,
      "intrinsic_unresolved": [],
      "limited_marker": null,
      "awakening_marker": null
    },
    {
      "id": "sgs.yuce",
      "name": "御策",
      "type": "optional_after_damage_reveal_type_tax_or_heal",
      "timing": "每次实际受到伤害并完成救援且自己存活之后",
      "quota": "每次伤害事件一次机会，不是每一点伤害一次；不设每回合次数上限",
      "cost": "展示自己1张现有手牌；不弃置、不交给伤害来源，展示后仍归自己",
      "targets": "固定为该伤害事件的实际来源；由来源决定是否弃不同类别手牌，回血对象固定为满宠",
      "effects": [
        "自己必须仍有手牌。通过展示手牌后，伤害来源可弃1张与展示牌三大类别不同的手牌；来源手牌不足/无合格牌/拒绝，满宠回复1点体力。",
        "来源支付不能用已安装装备、判定牌或私有堆；不能把2张同类别牌凑作1张不同类别。拒绝付款是允许选择，不按敌友自动决定。",
        "这是伤害后回复，不能防止已发生的伤害、返还全部伤害或把多点伤害拆成多次御策。一次3点伤害存活后最多回复1点。失去体力、伤害完全被防止不会触发。",
        "若伤害使满宠进入濒死，先按正常求桃救援。被救回并仍有手牌后才有御策；已经死亡不能自救。回复上限封顶。",
        "同产品2022攻略明确无伤害来源不能发动御策；无来源闪电伤害不能直接让其回1。不要凭“否则”把不存在来源当作拒付。",
        "按真正伤害来源，不按杀的原使用者：转移/来源改写后的事件来源决定谁选择付款。自己造成自己伤害时来源可为自己，依正常手牌类别检查；展示牌仍在手中但其类别相同，不能拿它支付不同类别。"
      ],
      "source_refs": [
        "mobile-alt-manchong",
        "bwiki-manchong",
        "bwiki-yuce-detail",
        "xiaomi-manchong-2022",
        "xiaomi-manchong-2023",
        "mobile-manchong-comparison"
      ],
      "raw_evidence": {
        "path": "evidence/mobile-alt-manchong.html",
        "line": 185,
        "rule_sha256": "8c5247137078bb98a656acacf2387074c497d3c3fee1e3507161180e0071c84e"
      },
      "official_panel_hidden": true,
      "intrinsic_unresolved": [],
      "limited_marker": null,
      "awakening_marker": null
    }
  ],
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
  "personal_lord_skill_ids": [],
  "granted_skill_ids": [],
  "acquired_skill_ids": [],
  "integration_status": "isolated-module-awaiting-host-admission",
  "current_client_verified": false,
  "source_equivalence": {
    "signature": {
      "id": "sgs.adapted.base.hero.man-chong",
      "max_hp": 3,
      "gender": "male",
      "faction": "魏",
      "skill_ids": [
        "sgs.junxing",
        "sgs.yuce"
      ],
      "personal_lord_skill_ids": [],
      "granted_skill_ids": [],
      "acquired_skill_ids": [],
      "variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
      "current_client_rules_verified": false
    },
    "merged": false,
    "policy": "complete intrinsic mechanism identity; temporary copying is not hero equivalence"
  }
});
export const SGS_MANCHONG_DEFINITIONS=Object.freeze([SGS_MANCHONG_DEFINITION]);
