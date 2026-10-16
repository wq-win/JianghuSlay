import {ZHANGFEN_EQUIPMENT_CATALOG} from './sgs-zhangfen-data.js';
import {QIBAO_RULES,QIBAO_EQUIPMENT_ID} from './wangyun-card-effects.js';
import {sanjian_equipment_definition} from './sanjian-catalog.mjs';
/** Mechanism-deduplicated ordinary-battle catalog, snapshot 2026-10-15.
 * 36 source identities map to 20 playable mechanisms; matching mechanics use
 * the Heroes Kill name. Source aliases remain queryable, never separate cards.
 * Current mobile availability and version limitations are retained per entry;
 * this is not a claim to cover every 2026 live-client equipment or mode.
 * Display names distinguish source variants; neither mode nor generated cards
 * enter the ordinary deck. See source_urls, completeness and adaptation_notes.
 */
import {youjian_equipment_definition} from './youjian-equipment-catalog.mjs';
import {mode_equipment_definition} from './mode-equipment-catalog.mjs';
import {decorate_equipment_source, EQUIPMENT_CANONICAL_BY_MECHANISM} from './equipment/mechanisms.mjs';
export {EQUIPMENT_MECHANISMS,EQUIPMENT_SOURCE_MECHANISMS,EQUIPMENT_CANONICAL_BY_MECHANISM} from './equipment/mechanisms.mjs';
const deepFreeze = value => { if (value && typeof value === 'object') { for (const child of Object.values(value)) deepFreeze(child); Object.freeze(value); } return value; };
export const EQUIPMENT_SOURCE_RECORDS = deepFreeze([
  {
    "id": "sgs.base.equipment.crossbow",
    "name": "诸葛连弩",
    "ui_name": "诸葛连弩",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 1,
    "condition": "正常目标与距离合法",
    "effect": "装备有效时出牌阶段使用杀不限次数",
    "timing": "出牌阶段使用杀",
    "limits": "无手牌杀不会凭空生成；失去武器后恢复常规次数限制",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/114.html"
    ],
    "source_deck_copies": 2,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_crossbow",
    "base_name": "诸葛连弩",
    "power": 0,
    "trait": "unlimited_sha",
    "description": "装备有效时出牌阶段使用杀不限次数；无手牌杀不会凭空生成；失去武器后恢复常规次数限制。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.qinggang",
    "name": "青釭剑",
    "ui_name": "青釭剑",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "杀合法指定目标",
    "effect": "本次杀无视其目标防具",
    "timing": "杀指定目标至该杀结算结束",
    "limits": "只对该杀的目标与该次事件屏蔽防具；不删除装备；不屏蔽马",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/115.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_qinggang",
    "base_name": "青釭剑",
    "power": 0,
    "trait": "ignore_armor",
    "description": "本次杀无视其目标防具；只对该杀的目标与该次事件屏蔽防具；不删除装备；不屏蔽马。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.cixiong",
    "name": "雌雄双股剑",
    "ui_name": "雌雄双股剑",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "双方规则性别不同",
    "effect": "可令异性目标选弃1张手牌或让使用者摸1",
    "timing": "杀指定异性目标后，闪前",
    "limits": "目标无手牌只能让使用者摸；被闪仍已结算",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/116.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_cixiong",
    "base_name": "雌雄双股剑",
    "power": 0,
    "trait": "double_swords",
    "description": "可令异性目标选弃1张手牌或让使用者摸1；目标无手牌只能让使用者摸；被闪仍已结算。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.hanbing",
    "name": "寒冰剑",
    "ui_name": "寒冰剑",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "目标有可弃的手牌或装备",
    "effect": "可防止此次杀的全部伤害，依次弃目标2张手牌/装备",
    "timing": "杀将造成伤害时",
    "limits": "1张只弃1；0张不能发动；不可弃判定区；不是造成伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/117.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_hanbing",
    "base_name": "寒冰剑",
    "power": 0,
    "trait": "ice_sword",
    "description": "可防止此次杀的全部伤害，依次弃目标2张手牌/装备；1张只弃1；0张不能发动；不可弃判定区；不是造成伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.axe",
    "name": "贯石斧",
    "ui_name": "贯石斧",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "有2张可弃手牌/装备，不含斧自身",
    "effect": "杀被闪抵消后，可弃2张自己的牌使该杀仍造成伤害",
    "timing": "杀被足够数量的闪抵消后",
    "limits": "2张同时弃；不再次询问闪；保留原杀属性及酒等修正",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/120.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_axe",
    "base_name": "贯石斧",
    "power": 0,
    "trait": "axe",
    "description": "杀被闪抵消后，可弃2张自己的牌使该杀仍造成伤害；2张同时弃；不再次询问闪；保留原杀属性及酒等修正。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.qinglong",
    "name": "青龙偃月刀",
    "ui_name": "青龙偃月刀",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "仍能合法指定该目标且有杀/转换材料",
    "effect": "可对刚用闪抵消杀的目标追加使用一张杀",
    "timing": "杀被闪抵消后",
    "limits": "追杀是新杀且无距离限制，可再闪；不沿用前一张酒加成；不额外增加普通出牌阶段杀计数",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/青龙偃月刀",
      "https://wiki.biligame.com/msgs/公孙瓒"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_qinglong",
    "base_name": "青龙偃月刀",
    "power": 0,
    "trait": "follow_sha",
    "description": "可对刚用闪抵消杀的目标追加使用一张杀；追杀是新杀且无距离限制，可再闪；不沿用前一张酒加成；不额外增加普通出牌阶段杀计数。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.zhangba",
    "name": "丈八蛇矛",
    "ui_name": "丈八蛇矛",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "恰好2张手牌",
    "effect": "可将任意2张手牌作为一张普通杀使用或打出",
    "timing": "需要使用或打出杀时",
    "limits": "不收装备区牌；两红为红、两黑为黑、混色为无色；不自带无限杀",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/121.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_zhangba",
    "base_name": "丈八蛇矛",
    "power": 0,
    "trait": "two_as_sha",
    "description": "可将任意2张手牌作为一张普通杀使用或打出；不收装备区牌；两红为红、两黑为黑、混色为无色；不自带无限杀。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.fangtian",
    "name": "方天画戟",
    "ui_name": "方天画戟",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 4,
    "condition": "杀耗尽手牌且各目标合法",
    "effect": "使用的杀为最后手牌时，可额外指定至多2个目标",
    "timing": "杀选目标时",
    "limits": "总计最多3目标，各自闪与结算；无固定加伤；国战/胜者为王版本另建实体",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/方天画戟",
      "https://www.sanguosha.cn/pc/guide-info-154.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_fangtian",
    "base_name": "方天画戟",
    "power": 0,
    "trait": "last_hand_targets",
    "description": "使用的杀为最后手牌时，可额外指定至多2个目标；总计最多3目标，各自闪与结算；无固定加伤；国战/胜者为王版本另建实体。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.qilin",
    "name": "麒麟弓",
    "ui_name": "麒麟弓",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 5,
    "condition": "目标装备有马",
    "effect": "可弃置受此杀伤害目标装备区的一匹马",
    "timing": "杀造成伤害时",
    "limits": "可放弃；两匹时由攻击者选；不加伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/123.html",
      "https://www.sanguosha.cn/pc/guide-info-36.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_qilin",
    "base_name": "麒麟弓",
    "power": 0,
    "trait": "dismount",
    "description": "可弃置受此杀伤害目标装备区的一匹马；可放弃；两匹时由攻击者选；不加伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.guding",
    "name": "古锭刀",
    "ui_name": "古锭刀",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "目标此时无手牌",
    "effect": "对无手牌目标的杀伤害+1",
    "timing": "计算该次杀伤害时",
    "limits": "不是使用时无手牌快照；不增强决斗等其他伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/古锭刀"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_guding",
    "base_name": "古锭刀",
    "power": 0,
    "trait": "empty_hand_damage",
    "description": "对无手牌目标的杀伤害+1；不是使用时无手牌快照；不增强决斗等其他伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.fan",
    "name": "朱雀羽扇",
    "ui_name": "朱雀羽扇",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 4,
    "condition": "该牌为可转换的普通杀",
    "effect": "可把使用的普通杀改为火杀",
    "timing": "使用普通杀时",
    "limits": "不是任意牌变杀；雷杀不能变；转火后处理藤甲和连环",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/122.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_fan",
    "base_name": "朱雀羽扇",
    "power": 0,
    "trait": "fire_fan",
    "description": "可把使用的普通杀改为火杀；不是任意牌变杀；雷杀不能变；转火后处理藤甲和连环。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.bagua",
    "name": "八卦阵",
    "ui_name": "八卦阵",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "防具",
    "range": 1,
    "condition": "防具有效且允许提供闪",
    "effect": "可判定，红色提供一张虚拟闪，黑色仍可从手牌出闪",
    "timing": "每次需要使用/打出闪时",
    "limits": "每次闪需求独立选择与判定；不能拿判定牌当手牌",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/124.html"
    ],
    "source_deck_copies": 2,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_bagua",
    "base_name": "八卦阵",
    "power": 0,
    "trait": "bagua",
    "description": "可判定，红色提供一张虚拟闪，黑色仍可从手牌出闪；每次闪需求独立选择与判定；不能拿判定牌当手牌。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.renwang",
    "name": "仁王盾",
    "ui_name": "仁王盾",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "防具",
    "range": 1,
    "condition": "杀最终颜色为黑且防具有效",
    "effect": "黑色杀对你无效",
    "timing": "杀对目标生效前",
    "limits": "黑色雷杀也无效；不减少红杀、无色杀、决斗伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/125.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_renwang",
    "base_name": "仁王盾",
    "power": 0,
    "trait": "renwang",
    "description": "黑色杀对你无效；黑色雷杀也无效；不减少红杀、无色杀、决斗伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.tengjia",
    "name": "藤甲",
    "ui_name": "藤甲",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "防具",
    "range": 1,
    "condition": "防具有效",
    "effect": "普通杀、南蛮入侵、万箭齐发无效；所受火伤害+1",
    "timing": "牌生效检查及火伤害计算",
    "limits": "雷伤不免；火攻不免；无视防具时不加火伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/127.html"
    ],
    "source_deck_copies": 2,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_tengjia",
    "base_name": "藤甲",
    "power": 0,
    "trait": "vine",
    "description": "普通杀、南蛮入侵、万箭齐发无效；所受火伤害+1；雷伤不免；火攻不免；无视防具时不加火伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 烽火狼烟按南蛮入侵适配藤甲免疫；血杀、毒杀不是普通杀，不被藤甲阻挡。无视防具仅适用当前杀直接目标。"
  },
  {
    "id": "sgs.base.equipment.lion",
    "name": "白银狮子",
    "ui_name": "白银狮子",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "防具",
    "range": 1,
    "condition": "伤害大于1；离场时仍存活且未满体力才有实际恢复",
    "effect": "每次所受伤害最多1；离开装备区回复1体力",
    "timing": "伤害结算/离开装备区",
    "limits": "不是全伤害减1；失去体力不封顶；从手牌丢弃不恢复",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/126.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_lion",
    "base_name": "白银狮子",
    "power": 0,
    "trait": "silver_lion",
    "description": "每次所受伤害最多1；离开装备区回复1体力；不是全伤害减1；失去体力不封顶；从手牌丢弃不恢复。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "shared.base.equipment.chitu",
    "name": "赤兔",
    "ui_name": "赤兔",
    "source_game": [
      "三国杀",
      "英雄杀"
    ],
    "source_version": [
      "移动版普通身份共享规则",
      "腾讯经典、手游经典交叉证据"
    ],
    "category": "baseline_first_pack",
    "type": "-1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "你到其他角色的距离-1",
    "timing": "持续距离计算",
    "limits": "距离下限1；不增加杀次数或伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/128.html",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": {
      "三国杀": 1,
      "英雄杀": 1
    },
    "completeness": {
      "rules": "跨作同名同效已核",
      "mobile_availability": "三国杀官网交叉；英雄杀当前逐名官方证据未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "跨作同名且同为进攻马，仅合并规则实体；默认混合牌堆张数由产品另定。"
    ],
    "source_catalog_id": "shared_chitu",
    "base_name": "赤兔",
    "power": 1,
    "trait": "distance_minus_one",
    "description": "你到其他角色的距离-1；距离下限1；不增加杀次数或伤害。",
    "source_variant": [
      "移动版普通身份共享规则",
      "腾讯经典、手游经典交叉证据"
    ],
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 跨作同名且同为进攻马，仅合并规则实体；默认混合牌堆张数由产品另定。"
  },
  {
    "id": "sgs.base.equipment.dayuan",
    "name": "大宛",
    "ui_name": "大宛",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "-1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "你到其他角色的距离-1",
    "timing": "持续距离计算",
    "limits": "距离下限1；不增加杀次数或伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/128.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_dayuan",
    "base_name": "大宛",
    "power": 1,
    "trait": "distance_minus_one",
    "description": "你到其他角色的距离-1；距离下限1；不增加杀次数或伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.zixing",
    "name": "紫骍",
    "ui_name": "紫骍",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "-1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "你到其他角色的距离-1",
    "timing": "持续距离计算",
    "limits": "距离下限1；不增加杀次数或伤害",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/128.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_zixing",
    "base_name": "紫骍",
    "power": 1,
    "trait": "distance_minus_one",
    "description": "你到其他角色的距离-1；距离下限1；不增加杀次数或伤害。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.dilu",
    "name": "的卢〔三国杀·防马〕",
    "ui_name": "的卢〔三国杀·防马〕",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "不减伤、不加体力；骅骝属军争",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/129.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_dilu",
    "base_name": "的卢",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；不减伤、不加体力；骅骝属军争。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.jueying",
    "name": "绝影",
    "ui_name": "绝影",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "不减伤、不加体力；骅骝属军争",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/129.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_jueying",
    "base_name": "绝影",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；不减伤、不加体力；骅骝属军争。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.zhuahuang",
    "name": "爪黄飞电",
    "ui_name": "爪黄飞电",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "不减伤、不加体力；骅骝属军争",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/129.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_zhuahuang",
    "base_name": "爪黄飞电",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；不减伤、不加体力；骅骝属军争。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "sgs.base.equipment.hualiu",
    "name": "骅骝",
    "ui_name": "骅骝",
    "source_game": "三国杀",
    "source_version": "移动版普通身份·标准加军争共享规则",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "不减伤、不加体力；骅骝属军争",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://wwwtest.sanguosha.cn/pc/guide-info-160.html",
      "https://sanguosha.fandom.com/zh/wiki/三国杀游戏卡牌?variant=zh-my",
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/129.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "共享官方规则或标注的标准规则二手来源已核实",
      "mobile_availability": "移动官网2023牌堆攻略交叉；不是2026全量官方目录",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "sgs_hualiu",
    "base_name": "骅骝",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；不减伤、不加体力；骅骝属军争。",
    "source_variant": "移动版普通身份·标准加军争共享规则",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.longlin",
    "name": "龙鳞刀",
    "ui_name": "龙鳞刀",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "目标有牌",
    "effect": "可取消杀伤害，依次弃目标2张牌",
    "timing": "杀将造成伤害时",
    "limits": "可弃手牌、装备、判定区；不足2则全弃；不是寒冰同区域规则",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_longlin",
    "base_name": "龙鳞刀",
    "power": 0,
    "trait": "dragon_blade",
    "description": "可取消杀伤害，依次弃目标2张牌；可弃手牌、装备、判定区；不足2则全弃；不是寒冰同区域规则。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 可弃实体判定区牌；寒冰剑不能弃判定区。"
  },
  {
    "id": "yxs.base.equipment.panlong",
    "name": "盘龙棍",
    "ui_name": "盘龙棍",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "有杀且新杀目标合法",
    "effect": "杀被闪后可继续对同一目标使用杀",
    "timing": "杀被闪后",
    "limits": "每次为新杀，仍可闪；没有固定加伤",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "盘龙再次出杀与归隐等禁制已核；追杀距离豁免没有一手明文闭合，不自动继承三国杀青龙规则。"
    ],
    "source_catalog_id": "yxs_panlong",
    "base_name": "盘龙棍",
    "power": 0,
    "trait": "follow_sha",
    "description": "杀被闪后可继续对同一目标使用杀；每次为新杀，仍可闪；没有固定加伤。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 盘龙再次出杀与归隐等禁制已核；追杀距离豁免没有一手明文闭合，不自动继承三国杀青龙规则。 距离豁免未见闭合原文；江湖兼容保留新杀常规距离复核，不把青龙偃月刀的无距离限制冒称盘龙原规则。"
  },
  {
    "id": "yxs.base.equipment.yuchang",
    "name": "鱼肠剑",
    "ui_name": "鱼肠剑",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 2,
    "condition": "合法杀目标",
    "effect": "使用杀时无视该目标防具",
    "timing": "该次杀结算期间",
    "limits": "不删除防具，不免除马的距离影响",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_yuchang",
    "base_name": "鱼肠剑",
    "power": 0,
    "trait": "ignore_armor",
    "description": "使用杀时无视该目标防具；不删除防具，不免除马的距离影响。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.luye",
    "name": "芦叶枪",
    "ui_name": "芦叶枪",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "恰好2张手牌",
    "effect": "2张手牌当1张杀使用或打出",
    "timing": "需要杀时",
    "limits": "腾讯旧FAQ：只要材料含红色即视为红杀；不同于丈八混色无色",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_luye",
    "base_name": "芦叶枪",
    "power": 0,
    "trait": "two_as_sha",
    "description": "2张手牌当1张杀使用或打出；腾讯旧FAQ：只要材料含红色即视为红杀；不同于丈八混色无色。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 两张手牌素材包含任一红色时为红杀；全部黑色才为黑杀。与丈八蛇矛混色无色分开实现。"
  },
  {
    "id": "yxs.base.equipment.bolang",
    "name": "博浪锤",
    "ui_name": "博浪锤",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 3,
    "condition": "有2张可弃的手牌/装备",
    "effect": "杀被闪后可弃2张自己的牌使该杀继续命中",
    "timing": "杀被闪后",
    "limits": "排除锤本身；保留醉酒等伤害修正，勿写死1点",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_bolang",
    "base_name": "博浪锤",
    "power": 0,
    "trait": "axe",
    "description": "杀被闪后可弃2张自己的牌使该杀继续命中；排除锤本身；保留醉酒等伤害修正，勿写死1点。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.hufu",
    "name": "虎符",
    "ui_name": "虎符",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 1,
    "condition": "正常目标/距离合法",
    "effect": "装备有效时出牌阶段杀不限次数",
    "timing": "出牌阶段使用杀",
    "limits": "不提供额外杀牌；换掉后不能继续按无限次数出杀",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 2,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_hufu",
    "base_name": "虎符",
    "power": 0,
    "trait": "unlimited_sha",
    "description": "装备有效时出牌阶段杀不限次数；不提供额外杀牌；换掉后不能继续按无限次数出杀。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.bawang",
    "name": "霸王弓",
    "ui_name": "霸王弓",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 5,
    "condition": "目标有装备马",
    "effect": "可弃置被杀命中目标的一匹马",
    "timing": "命中后扣血前的武器窗口",
    "limits": "可取消；攻击者选马；先结算失装，再伤害，不强制优先+1马",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_bawang",
    "base_name": "霸王弓",
    "power": 0,
    "trait": "dismount",
    "description": "可弃置被杀命中目标的一匹马；可取消；攻击者选马；先结算失装，再伤害，不强制优先+1马。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.langya",
    "name": "狼牙棒",
    "ui_name": "狼牙棒",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "武器",
    "range": 4,
    "condition": "杀为最后手牌",
    "effect": "最后手牌为杀时可选至多3名合法目标",
    "timing": "杀选目标时",
    "limits": "不能选自己；按行动顺序结算；无固定伤害加成",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_langya",
    "base_name": "狼牙棒",
    "power": 0,
    "trait": "last_hand_targets",
    "description": "最后手牌为杀时可选至多3名合法目标；不能选自己；按行动顺序结算；无固定伤害加成。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.yuruyi",
    "name": "玉如意",
    "ui_name": "玉如意",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "防具",
    "range": 1,
    "condition": "防具有效",
    "effect": "需要闪时可判定；红色提供闪，黑色可继续出手牌闪",
    "timing": "每次闪需求",
    "limits": "不是全伤害减免；判定与闪响应独立",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://m.18183.com/yingxiongsha/201508/374396.html",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 2,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "source_catalog_id": "yxs_yuruyi",
    "base_name": "玉如意",
    "power": 0,
    "trait": "bagua",
    "description": "需要闪时可判定；红色提供闪，黑色可继续出手牌闪；不是全伤害减免；判定与闪响应独立。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。"
  },
  {
    "id": "yxs.base.equipment.wuzhui",
    "name": "乌骓",
    "ui_name": "乌骓",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "-1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "你到其他角色的距离-1",
    "timing": "持续距离计算",
    "limits": "的卢是腾讯经典攻马；必须与三国杀的卢防马区分",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "手机攻略核到攻马3张总数；逐匹当前客户端名字尚无一手闭合"
    ],
    "source_catalog_id": "yxs_wuzhui",
    "base_name": "乌骓",
    "power": 1,
    "trait": "distance_minus_one",
    "description": "你到其他角色的距离-1；的卢是腾讯经典攻马；必须与三国杀的卢防马区分。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 手机攻略核到攻马3张总数；逐匹当前客户端名字尚无一手闭合"
  },
  {
    "id": "yxs.base.equipment.dilu",
    "name": "的卢〔英雄杀·攻马〕",
    "ui_name": "的卢〔英雄杀·攻马〕",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "-1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "你到其他角色的距离-1",
    "timing": "持续距离计算",
    "limits": "的卢是腾讯经典攻马；必须与三国杀的卢防马区分",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "手机攻略核到攻马3张总数；逐匹当前客户端名字尚无一手闭合"
    ],
    "source_catalog_id": "yxs_dilu",
    "base_name": "的卢",
    "power": 1,
    "trait": "distance_minus_one",
    "description": "你到其他角色的距离-1；的卢是腾讯经典攻马；必须与三国杀的卢防马区分。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 手机攻略核到攻马3张总数；逐匹当前客户端名字尚无一手闭合"
  },
  {
    "id": "yxs.base.equipment.nieying",
    "name": "蹑影",
    "ui_name": "蹑影",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "每类马通常单槽；不是伤害减免",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
    ],
    "source_catalog_id": "yxs_nieying",
    "base_name": "蹑影",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；每类马通常单槽；不是伤害减免。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
  },
  {
    "id": "yxs.base.equipment.huleibo",
    "name": "忽雷驳",
    "ui_name": "忽雷驳",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "每类马通常单槽；不是伤害减免",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
    ],
    "source_catalog_id": "yxs_huleibo",
    "base_name": "忽雷驳",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；每类马通常单槽；不是伤害减免。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
  },
  {
    "id": "yxs.base.equipment.zhuifeng",
    "name": "追风",
    "ui_name": "追风",
    "source_game": "英雄杀",
    "source_version": "腾讯经典规则，手游经典候选",
    "category": "baseline_first_pack",
    "type": "+1马",
    "range": 1,
    "condition": "装备有效",
    "effect": "其他角色到你的距离+1",
    "timing": "持续距离计算",
    "limits": "每类马通常单槽；不是伤害减免",
    "acquisition": "对应经典/标准军争牌堆；跨作混合牌堆属于江湖杀的兼容规则",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://zh.wikipedia.org/wiki/英雄杀",
      "https://zhidao.baidu.com/question/1696225926596375228.html"
    ],
    "source_deck_copies": 1,
    "completeness": {
      "rules": "官方历史规则已核实",
      "mobile_availability": "手游早期经典牌堆交叉证据；2026逐名官方清单未闭合",
      "entire_game_coverage": false
    },
    "version_notes": [
      "手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
    ],
    "source_catalog_id": "yxs_zhuifeng",
    "base_name": "追风",
    "power": 1,
    "trait": "distance_plus_one",
    "description": "其他角色到你的距离+1；每类马通常单槽；不是伤害减免。",
    "source_variant": "腾讯经典规则，手游经典候选",
    "source_status": "verified-classic-rules",
    "implementation_status": "tested",
    "ordinary_deck": true,
    "adaptation_notes": "双游戏经典规则混合牌堆为江湖兼容；仅每个去重后的机制实体放一张，来源记录不另产实体卡，不冒充任一原作张数。 杀家族含血杀、毒杀，但二者均为非传导普通伤害。 手机攻略核到防马3张总数；逐匹当前客户端名字尚无一手闭合"
  }
].map(decorate_equipment_source));
export const EQUIPMENT_SPECIAL_REGISTRY = deepFreeze([
  {
    "id": "sgs.special.equipment.yuanrong",
    "name": "元戎精械弩〔移动·马钧精械〕",
    "ui_name": "元戎精械弩〔移动·马钧精械〕",
    "source_game": "三国杀",
    "source_version": "移动·马钧精械",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 3,
    "acquisition": "马钧精械升级手牌/装备区的诸葛连弩",
    "effect": "杀不限次数，攻击范围3",
    "timing": "出牌阶段出杀",
    "condition": "精械升级后的连弩有效",
    "limits": "马钧技能升级，不是普通牌堆另一份卡",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-258.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.xiantian",
    "name": "先天八卦阵〔移动·马钧精械〕",
    "ui_name": "先天八卦阵〔移动·马钧精械〕",
    "source_game": "三国杀",
    "source_version": "移动·马钧精械",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "马钧精械升级手牌/装备区的八卦阵",
    "effect": "闪判定非黑桃即可提供虚拟闪",
    "timing": "需要使用/打出闪",
    "condition": "防具有效",
    "limits": "失败仍可手牌闪",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-258.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.jingang",
    "name": "仁王金刚盾〔移动·马钧精械〕",
    "ui_name": "仁王金刚盾〔移动·马钧精械〕",
    "source_game": "三国杀",
    "source_version": "移动·马钧精械",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "马钧精械升级手牌/装备区的仁王盾",
    "effect": "黑色杀及红桃杀对你无效",
    "timing": "杀生效前",
    "condition": "最终花色/颜色符合",
    "limits": "方块和无色杀不因此无效",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-258.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.zhaoyue",
    "name": "照月狮子盔〔移动·马钧精械〕",
    "ui_name": "照月狮子盔〔移动·马钧精械〕",
    "source_game": "三国杀",
    "source_version": "移动·马钧精械",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "马钧精械升级手牌/装备区的白银狮子",
    "effect": "单次伤害最多1；离装备区回复1再摸2",
    "timing": "伤害/离场",
    "condition": "装备区离开",
    "limits": "满体力仍摸2；官方说明段内仍写白银狮子，应按升级项上下文读",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-258.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.tongyou",
    "name": "桐油百韧甲〔移动·马钧精械〕",
    "ui_name": "桐油百韧甲〔移动·马钧精械〕",
    "source_game": "三国杀",
    "source_version": "移动·马钧精械",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "马钧精械升级手牌/装备区的藤甲",
    "effect": "保留藤甲效果，并防止被横置",
    "timing": "普通杀/群体牌/火伤/横置",
    "condition": "防具有效",
    "limits": "火伤仍+1；不是所有伤害免疫",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-258.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.car_attack",
    "name": "大攻车·进击〔移动·张奋渠冲〕",
    "ui_name": "大攻车·进击〔移动·张奋渠冲〕",
    "source_game": "三国杀",
    "source_version": "移动·张奋渠冲",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 9,
    "acquisition": "渠冲消耗铸造生成并令一名角色使用；场上已有车时按技能移动",
    "effect": "造成伤害时可耗1耐久，使伤害加min(轮数,3)",
    "timing": "造成伤害时",
    "condition": "对应大攻车装备有效",
    "limits": "初始耐久2；装备时弃其他装备、此后阻止其他装备进入；非渠冲移动改为耐久-1；耐久0销毁",
    "source_urls": [
      "https://www.sanguosha.cn/hero-detail-593.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "新三国杀/十周年的大攻车宝物升级版不得混用。技能造车成本还依身份或斗地主/团战不同。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.car_defend",
    "name": "大攻车·守御〔移动·张奋渠冲〕",
    "ui_name": "大攻车·守御〔移动·张奋渠冲〕",
    "source_game": "三国杀",
    "source_version": "移动·张奋渠冲",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 9,
    "acquisition": "渠冲消耗铸造生成并令一名角色使用；场上已有车时按技能移动",
    "effect": "受到伤害时消耗耐久，按消耗量减伤",
    "timing": "受到伤害时",
    "condition": "对应大攻车装备有效",
    "limits": "初始耐久3；装备时弃其他装备、此后阻止其他装备进入；非渠冲移动改为耐久-1；耐久0销毁",
    "source_urls": [
      "https://www.sanguosha.cn/hero-detail-593.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "新三国杀/十周年的大攻车宝物升级版不得混用。技能造车成本还依身份或斗地主/团战不同。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.piliche",
    "name": "霹雳车〔移动·刘晔破橹〕",
    "ui_name": "霹雳车〔移动·刘晔破橹〕",
    "source_game": "三国杀",
    "source_version": "移动·刘晔破橹",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 9,
    "acquisition": "刘晔破橹回合开始时生成使用",
    "effect": "对其他角色造成伤害后，可弃其装备区全部牌",
    "timing": "造成伤害后",
    "condition": "目标有装备",
    "limits": "官网只给破坏防具概述；旧版只弃防具/+1马，新版BWIKI为全部装备",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-306.html",
      "https://wiki.biligame.com/msgs/霹雳车"
    ],
    "completeness": {
      "source_tier": "primary_acquisition_secondary_latest_effect",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "当前效果需客户端复核；不要把旧版销毁条件未经核验套给新版本。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.xuanjian",
    "name": "玄剑〔移动·友徐庶侠行〕",
    "ui_name": "玄剑〔移动·友徐庶侠行〕",
    "source_game": "三国杀",
    "source_version": "移动·友徐庶侠行",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 3,
    "acquisition": "友徐庶游戏开始以侠行从游戏外获得并使用",
    "effect": "可将一种花色的全部手牌当普通杀",
    "timing": "使用/打出杀时",
    "condition": "该花色手牌至少1张",
    "limits": "不是任选其中部分；不自带无限杀",
    "source_urls": [
      "https://wiki.biligame.com/msgs/玄剑"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.taiping",
    "name": "太平要术〔移动·国战/技能衍生〕",
    "ui_name": "太平要术〔移动·国战/技能衍生〕",
    "source_game": "三国杀",
    "source_version": "移动·国战/技能衍生",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "国战牌堆；南华老仙天书或谋张角黄天",
    "effect": "防止属性伤害；手牌上限加势力数-1；离装备区摸2，体力>1则失去1",
    "timing": "伤害/弃牌上限/装备离场",
    "condition": "防具有效；离场按当时体力",
    "limits": "牌堆入口和衍生入口分别登记",
    "source_urls": [
      "https://wiki.biligame.com/msgs/太平要术"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.yuxi",
    "name": "玉玺〔移动·国战〕",
    "ui_name": "玉玺〔移动·国战〕",
    "source_game": "三国杀",
    "source_version": "移动·国战",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "国战专属牌堆",
    "effect": "所属势力视为唯一大势力；摸牌阶段多1；出牌阶段开始视为用知己知彼",
    "timing": "持续/摸牌/出牌阶段开始",
    "condition": "对应国战身份势力规则有效",
    "limits": "需大小势力及知己知彼系统，不能将作用简化为普通身份抽1",
    "source_urls": [
      "https://wiki.biligame.com/msgs/玉玺"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.feilong",
    "name": "飞龙夺凤〔移动·2026国战君威〕",
    "ui_name": "飞龙夺凤〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "君刘备发动君威生成",
    "effect": "每回合首次杀伤害后，可得1阴阳鱼标记或1张目标手牌",
    "timing": "每回合首次杀伤害后",
    "condition": "目标和技能选择仍合法",
    "limits": "离装备区销毁；不是旧国战范围2武器",
    "source_urls": [
      "https://wiki.biligame.com/msgs/飞龙夺凤"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.dinglan",
    "name": "定澜夜明珠〔移动·2026国战君威〕",
    "ui_name": "定澜夜明珠〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "君孙权发动君威生成",
    "effect": "每回合首次弃牌后摸1",
    "timing": "首次弃牌后",
    "condition": "本回合尚未触发",
    "limits": "离装备区销毁；不是旧移动版制衡宝物",
    "source_urls": [
      "https://wiki.biligame.com/msgs/定澜夜明珠"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.liulong_jun",
    "name": "六龙骖驾〔移动·2026国战君威〕",
    "ui_name": "六龙骖驾〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "君曹操发动君威生成",
    "effect": "你到其他角色的距离-3",
    "timing": "持续距离计算",
    "condition": "装备有效",
    "limits": "不套御曹植K牌数版，亦不套旧国战双马版",
    "source_urls": [
      "https://wiki.biligame.com/msgs/六龙骖驾"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.mengjun",
    "name": "盟军大纛〔移动·2026国战君威〕",
    "ui_name": "盟军大纛〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "君袁绍发动君威生成",
    "effect": "可弃2张自己的牌防止本次全部伤害",
    "timing": "受到伤害前",
    "condition": "能支付2张手牌/装备",
    "limits": "可含本防具；离装备区销毁",
    "source_urls": [
      "https://wiki.biligame.com/msgs/盟军大纛"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.bawangdao",
    "name": "霸王凶刀〔移动·2026国战君威〕",
    "ui_name": "霸王凶刀〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 2,
    "acquisition": "君董卓发动君威生成",
    "effect": "伤害其他角色后，废除其一个装备栏直到其下回合开始",
    "timing": "造成伤害后",
    "condition": "伤害目标是其他角色",
    "limits": "离装备区销毁；需装备栏废除/恢复流程",
    "source_urls": [
      "https://wiki.biligame.com/msgs/霸王凶刀"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.panlongshuang",
    "name": "盘龙双震〔移动·2026国战君威〕",
    "ui_name": "盘龙双震〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 2,
    "acquisition": "君孙策发动君威生成",
    "effect": "杀结算完，若最后目标响应过该杀，对首目标造成1伤害",
    "timing": "整张杀结算结束后",
    "condition": "最后目标有响应记录",
    "limits": "这是额外普通伤害事件；离装备区销毁",
    "source_urls": [
      "https://wiki.biligame.com/msgs/盘龙双震"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.zhenchao",
    "name": "镇朝睚眦〔移动·2026国战君威〕",
    "ui_name": "镇朝睚眦〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "君曹丕发动君威生成",
    "effect": "成为杀目标后，若攻击者武将牌状态不同，令其弃1牌",
    "timing": "成为杀目标后",
    "condition": "双方武将牌状态不同",
    "limits": "状态维度与国战规则需复核，不猜成性别或势力；离场销毁",
    "source_urls": [
      "https://wiki.biligame.com/msgs/镇朝睚眦"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.chushibiao",
    "name": "出师表〔移动·2026国战君威〕",
    "ui_name": "出师表〔移动·2026国战君威〕",
    "source_game": "三国杀",
    "source_version": "移动·2026国战君威",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "君刘禅发动君威生成",
    "effect": "准备阶段从牌堆获得1张普通锦囊",
    "timing": "准备阶段",
    "condition": "牌堆有符合牌",
    "limits": "不是随机生成新锦囊；离装备区销毁",
    "source_urls": [
      "https://wiki.biligame.com/msgs/出师表"
    ],
    "completeness": {
      "source_tier": "secondary_mobile_specific",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "2026年7–9月移动版专属社区条目；官方现行客户端逐条复核尚未闭合。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.liulong_yu",
    "name": "六龙骖驾〔移动·御曹植辔东〕",
    "ui_name": "六龙骖驾〔移动·御曹植辔东〕",
    "source_game": "三国杀",
    "source_version": "移动·御曹植辔东",
    "category": "target_not_baseline",
    "type": "宝物",
    "range": null,
    "acquisition": "御曹植辔东引入",
    "effect": "你到其他角色距离-X，其他角色到你距离+X；X为全场区域K点数牌数量",
    "timing": "持续距离计算",
    "condition": "装备有效",
    "limits": "与君曹操版同名异效必须独立ID",
    "source_urls": [
      "https://wiki.biligame.com/msgs/六龙骖驾",
      "https://xianhua.sanguosha.cn/postDetails?id=11696921"
    ],
    "completeness": {
      "source_tier": "mobile_secondary_plus_official_community_announcement",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "咸话官方站帖子证明该宝物2025体验入口；帖子并非完整规则书。场上区域与K计数边界待复核。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.zheji",
    "name": "折戟〔移动·用间篇〕",
    "ui_name": "折戟〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 0,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "攻击范围0，无其他能力",
    "timing": "持续",
    "condition": "装备有效",
    "limits": "不能当普通无武器范围1；带赠予标记",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/折戟"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.qixing",
    "name": "七星宝刀〔移动·用间篇〕",
    "ui_name": "七星宝刀〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 2,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "进入装备区时，弃自己判定区及装备区其他所有牌",
    "timing": "装备进入后",
    "condition": "相应区域有牌",
    "limits": "不是王允七宝刀；带赠予标记",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/七星宝刀"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.yitian",
    "name": "倚天剑〔移动·用间篇〕",
    "ui_name": "倚天剑〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 2,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "杀伤害后可弃1手牌回复1",
    "timing": "杀造成伤害后",
    "condition": "有手牌可弃",
    "limits": "按受伤上限回复；不是固定加伤",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/倚天剑"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.nvzhuang",
    "name": "女装〔移动·用间篇〕",
    "ui_name": "女装〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "男性成为杀目标时判定，黑色令该杀伤害+1",
    "timing": "成为杀目标后",
    "condition": "规则性别男",
    "limits": "不会改变性别；带赠予标记",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/女装"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.yinfeng",
    "name": "引蜂衣〔移动·用间篇〕",
    "ui_name": "引蜂衣〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "所受锦囊伤害+1；因毒失去体力额外+1",
    "timing": "锦囊伤害/毒失去体力",
    "condition": "对应伤害或毒事件",
    "limits": "毒失去体力不是伤害；带赠予标记",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/引蜂衣"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.numa",
    "name": "驽马〔移动·用间篇〕",
    "ui_name": "驽马〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "进攻马",
    "range": null,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "你到他人距离-1；他人到你固定为1",
    "timing": "持续距离计算",
    "condition": "装备有效",
    "limits": "固定值与加减值按距离规则优先；带赠予标记",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/驽马"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.zhanxiang",
    "name": "战象〔移动·用间篇〕",
    "ui_name": "战象〔移动·用间篇〕",
    "source_game": "三国杀",
    "source_version": "移动·用间篇",
    "category": "target_not_baseline",
    "type": "防御马",
    "range": null,
    "acquisition": "用间专属牌堆；带赠予标记者可从手牌赠予直接入目标装备区",
    "effect": "他人到你距离+1；他人赠予你均失败",
    "timing": "持续/赠予结算",
    "condition": "装备有效",
    "limits": "赠予失败的牌入弃牌堆；不是交给都失败",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-882.html",
      "https://wiki.biligame.com/msgs/战象"
    ],
    "completeness": {
      "source_tier": "primary_mobile",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "用间为独立卡包；熟人房切换证据来自移动BWIKI，非普通身份默认牌堆。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.wuliu",
    "name": "吴六剑〔国战共享/移动交叉〕",
    "ui_name": "吴六剑〔国战共享/移动交叉〕",
    "source_game": "三国杀",
    "source_version": "国战共享/移动交叉",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 2,
    "acquisition": "国战牌堆",
    "effect": "与你同势力的其他角色攻击范围+1",
    "timing": "持续或杀伤害后",
    "condition": "国战势力与距离规则",
    "limits": "三尖不可打原受伤者；不是额外杀",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/118.html",
      "https://www.sohu.com/a/455780752_120594769"
    ],
    "completeness": {
      "source_tier": "official_guozhan_mobile_secondary",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.sanjian",
    "name": "三尖两刃刀〔国战共享/移动交叉〕",
    "ui_name": "三尖两刃刀〔国战共享/移动交叉〕",
    "source_game": "三国杀",
    "source_version": "国战共享/移动交叉",
    "category": "target_not_baseline",
    "type": "武器",
    "range": 3,
    "acquisition": "国战牌堆",
    "effect": "杀造成伤害后，可弃1手牌，对与伤害目标距离1的另一角色造成1伤害",
    "timing": "持续或杀伤害后",
    "condition": "国战势力与距离规则",
    "limits": "三尖不可打原受伤者；不是额外杀",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/119.html",
      "https://www.sohu.com/a/455780752_120594769"
    ],
    "completeness": {
      "source_tier": "official_guozhan_mobile_secondary",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.mingguang",
    "name": "明光铠〔移动·国战模式〕",
    "ui_name": "明光铠〔移动·国战模式〕",
    "source_game": "三国杀",
    "source_version": "移动·国战模式",
    "category": "target_not_baseline",
    "type": "防具",
    "range": null,
    "acquisition": "国战扩展牌堆，具体当前配置待核",
    "effect": "火杀、火攻、火烧连营指定你为目标时取消；小势力时防止进入连环状态",
    "timing": "成为目标时/进入连环前",
    "condition": "防具有效，第二项要求小势力",
    "limits": "成为目标时早于青釭剑指定目标后；不防所有火焰技能伤害",
    "source_urls": [
      "https://www.sanguosha.cn/index.php/pc/news-detail-1959.html",
      "https://game.xiaomi.com/viewpoint/1195705742_1786341205830_100",
      "https://app.ali213.net/gl/181547_12.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_existence_secondary_shared_effect",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "移动官网2024规则描述调整明确点名此牌，存在性已核；效果交叉包含OL移动版老文，必须再核当前手机完整描述。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_cixiong",
    "name": "雌雄双股剑〔移动·胜者为王2019专用〕",
    "ui_name": "雌雄双股剑〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "首次对异性出杀，弃其1牌且自己摸1",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_zhangba",
    "name": "丈八蛇矛〔移动·胜者为王2019专用〕",
    "ui_name": "丈八蛇矛〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "首次出杀摸2；有闪时须弃1闪",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_fangtian",
    "name": "方天画戟〔移动·胜者为王2019专用〕",
    "ui_name": "方天画戟〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "最后手牌杀不能被响应且伤害+2",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_qinglong",
    "name": "青龙偃月刀〔移动·胜者为王2019专用〕",
    "ui_name": "青龙偃月刀〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "首次命中的杀伤害+1",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_axe",
    "name": "贯石斧〔移动·胜者为王2019专用〕",
    "ui_name": "贯石斧〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "首次杀强制命中",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_qinggang",
    "name": "青釭剑〔移动·胜者为王2019专用〕",
    "ui_name": "青釭剑〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "杀无视防具",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_crossbow",
    "name": "诸葛连弩〔移动·胜者为王2019专用〕",
    "ui_name": "诸葛连弩〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "首次杀多出一张虚拟杀",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_qilin",
    "name": "麒麟弓〔移动·胜者为王2019专用〕",
    "ui_name": "麒麟弓〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "杀造成伤害后获得25军需",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_hanbing",
    "name": "寒冰剑〔移动·胜者为王2019专用〕",
    "ui_name": "寒冰剑〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "武器",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "杀命中后令敌方不能获得60起始军需",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_bagua",
    "name": "八卦阵〔移动·胜者为王2019专用〕",
    "ui_name": "八卦阵〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "防具",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "每受到1点伤害获得25军需",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_renwang",
    "name": "仁王盾〔移动·胜者为王2019专用〕",
    "ui_name": "仁王盾〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "防具",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "黑色杀无效",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  },
  {
    "id": "sgs.special.equipment.winner_lion",
    "name": "白银狮子〔移动·胜者为王2019专用〕",
    "ui_name": "白银狮子〔移动·胜者为王2019专用〕",
    "source_game": "三国杀",
    "source_version": "移动·胜者为王2019专用",
    "category": "special_mode_variant_registry",
    "type": "防具",
    "range": null,
    "acquisition": "模式内消耗军需给武将购置",
    "effect": "超过1的伤害削至1",
    "timing": "专用模式自动出牌/伤害窗口",
    "condition": "对应出战武将装备生效",
    "limits": "首次的具体重置周期以该模式为准；不使用普通空间攻击范围",
    "source_urls": [
      "https://www.sanguosha.cn/pc/news-detail-607.html",
      "https://www.sanguosha.cn/guide-info-89.html"
    ],
    "completeness": {
      "source_tier": "primary_mobile_mode",
      "rules": "摘要已核；完整交互待实施测试",
      "current_mobile_availability": "一手或专属手游二手来源；版本限定，不推断全部模式常驻",
      "entire_game_coverage": false
    },
    "version_notes": [
      "仅证明2019模式存在与当时效果；2026当前入口/平衡改动未闭合，不作为本轮普通牌堆实现项。"
    ],
    "ordinary_deck": false,
    "implementation_status": "not-implemented-mode-or-generated"
  }
]);
const MODE_REGISTRY_SOURCE = [
  {
    "id": "yxs_zhuque_饮血剑",
    "name": "饮血剑",
    "source_game": "英雄杀",
    "source_version": "腾讯旧朱雀规则；手游2026-10-16至10-31限时回归公告",
    "category": "mobile_mode_equipment_scheduled_return",
    "type": "武器",
    "range": 2,
    "condition": "对应朱雀卡包开启且装备有效",
    "effect": "可将实体普通杀转为血杀",
    "timing": "使用普通杀",
    "limits": "血杀伤害性质依英雄杀朱雀另实现",
    "acquisition": "朱雀模式牌堆",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://www.taptap.cn/moment/852313126639502699?group_id=1334"
    ],
    "completeness": {
      "historical_rules_verified": true,
      "mobile_mode_identity_verified": true,
      "scheduled_return_started_as_of_2026_10_15": false,
      "announced_mobile_core_effect_verified": true,
      "live_client_rule_equivalence_verified": false
    },
    "ordinary_deck": false,
    "implementation_status": "mode-target-not-implemented"
  },
  {
    "id": "yxs_zhuque_孔雀翎",
    "name": "孔雀翎",
    "source_game": "英雄杀",
    "source_version": "腾讯旧朱雀规则；手游2026-10-16至10-31限时回归公告",
    "category": "mobile_mode_equipment_scheduled_return",
    "type": "武器",
    "range": 4,
    "condition": "对应朱雀卡包开启且装备有效",
    "effect": "出牌阶段失去1体力，本回合杀伤害+1",
    "timing": "主动付代价",
    "limits": "公告明确不能与鸩叠加；旧版重复发动也不叠加",
    "acquisition": "朱雀模式牌堆",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://www.taptap.cn/moment/852313126639502699?group_id=1334"
    ],
    "completeness": {
      "historical_rules_verified": true,
      "mobile_mode_identity_verified": true,
      "scheduled_return_started_as_of_2026_10_15": false,
      "announced_mobile_core_effect_verified": true,
      "live_client_rule_equivalence_verified": false
    },
    "ordinary_deck": false,
    "implementation_status": "mode-target-not-implemented"
  },
  {
    "id": "yxs_zhuque_护心镜",
    "name": "护心镜",
    "source_game": "英雄杀",
    "source_version": "腾讯旧朱雀规则；手游2026-10-16至10-31限时回归公告",
    "category": "mobile_mode_equipment_scheduled_return",
    "type": "防具",
    "range": null,
    "condition": "对应朱雀卡包开启且装备有效",
    "effect": "抵挡累计至多2点杀伤害；耗尽时丢弃镜并弃1手牌",
    "timing": "杀伤害前",
    "limits": "不抵挡所有伤害",
    "acquisition": "朱雀模式牌堆",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://www.taptap.cn/moment/852313126639502699?group_id=1334"
    ],
    "completeness": {
      "historical_rules_verified": true,
      "mobile_mode_identity_verified": true,
      "scheduled_return_started_as_of_2026_10_15": false,
      "announced_mobile_core_effect_verified": true,
      "live_client_rule_equivalence_verified": false
    },
    "ordinary_deck": false,
    "implementation_status": "mode-target-not-implemented"
  },
  {
    "id": "yxs_zhuque_金鳞甲",
    "name": "金鳞甲",
    "source_game": "英雄杀",
    "source_version": "腾讯旧朱雀规则；手游2026-10-16至10-31限时回归公告",
    "category": "mobile_mode_equipment_scheduled_return",
    "type": "防具",
    "range": null,
    "condition": "对应朱雀卡包开启且装备有效",
    "effect": "烽火狼烟、万箭齐发无效；离装备区回复1",
    "timing": "牌生效/装备离场",
    "limits": "不是现有虚构龙鳞甲",
    "acquisition": "朱雀模式牌堆",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://www.taptap.cn/moment/852313126639502699?group_id=1334"
    ],
    "completeness": {
      "historical_rules_verified": true,
      "mobile_mode_identity_verified": true,
      "scheduled_return_started_as_of_2026_10_15": false,
      "announced_mobile_core_effect_verified": true,
      "live_client_rule_equivalence_verified": false
    },
    "ordinary_deck": false,
    "implementation_status": "mode-target-not-implemented"
  },
  {
    "id": "yxs_zhuque_乾坤袋",
    "name": "乾坤袋",
    "source_game": "英雄杀",
    "source_version": "腾讯旧朱雀规则；手游2026-10-16至10-31限时回归公告",
    "category": "mobile_mode_equipment_scheduled_return",
    "type": "防具",
    "range": null,
    "condition": "对应朱雀卡包开启且装备有效",
    "effect": "手牌上限+1；离装备区摸1",
    "timing": "持续/装备离场",
    "limits": "旧英雄杀占防具槽，不可擅自放宝物槽",
    "acquisition": "朱雀模式牌堆",
    "source_urls": [
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1699/m1628/201203/56651.shtml?3",
      "https://www.taptap.cn/moment/852313126639502699?group_id=1334"
    ],
    "completeness": {
      "historical_rules_verified": true,
      "mobile_mode_identity_verified": true,
      "scheduled_return_started_as_of_2026_10_15": false,
      "announced_mobile_core_effect_verified": true,
      "live_client_rule_equivalence_verified": false
    },
    "ordinary_deck": false,
    "implementation_status": "mode-target-not-implemented"
  }
 ];
export const EQUIPMENT_MODE_REGISTRY = deepFreeze(MODE_REGISTRY_SOURCE.map(record=>{
  const implemented=mode_equipment_definition(record.id);
  return implemented?{...record,...implemented,id:record.id,canonical_id:implemented.id}:record;
}));
export const EQUIPMENT_PENDING_REGISTRY = deepFreeze([
  {
    "name": "七宝刀",
    "source_game": "三国杀",
    "reason": "2023-12-07官方详细攻略明确基础青釭转七宝；当前武将简表省略不能证明移除。已按历史核心及JH政策可玩重建，当前原生边界仍未核完；不是用间七星宝刀。",
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-213.html",
      "https://www.sohu.com/a/402490794_120099884"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "V21历史重建可通过连计获得，初始牌堆0；原生边界/2026客户端未全面核验",
    "acquisition": "连计选中基础青釭实体永久转换，保留牌面与实体",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "木牛流马",
    "source_game": "三国杀",
    "reason": "标准军争移动牌堆资料明确不含；其他模式/衍生当前移动存在性尚未证实。",
    "source_urls": [
      "https://moegirl.uk/index.php?title=三国杀%2F牌堆结构&variant=zh-cn"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "护心镜",
    "source_game": "三国杀",
    "reason": "国战实体/OL可见不能直接视为移动已上线；需要逐名当前手机来源。",
    "source_urls": [
      "https://guozhan.sanguosha.com/"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "惊帆",
    "source_game": "三国杀",
    "reason": "国战实体/OL可见不能直接视为移动已上线；需要逐名当前手机来源。",
    "source_urls": [
      "https://guozhan.sanguosha.com/"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "青龙偃月刀〔国战版〕",
    "source_game": "三国杀",
    "reason": "国战实体/OL可见不能直接视为移动已上线；需要逐名当前手机来源。",
    "source_urls": [
      "https://guozhan.sanguosha.com/"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "方天画戟〔国战版〕",
    "source_game": "三国杀",
    "reason": "国战实体/OL可见不能直接视为移动已上线；需要逐名当前手机来源。",
    "source_urls": [
      "https://guozhan.sanguosha.com/"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "无双方天戟",
    "source_game": "三国杀",
    "reason": "虎牢模式装备线索；检索到咸话文章跨版本叙述，尚不能认定移动当前卡牌入口。",
    "source_urls": [
      "https://xianhua.sanguosha.cn/postDetails?id=11142281"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "红锦百花袍",
    "source_game": "三国杀",
    "reason": "虎牢模式装备线索；检索到咸话文章跨版本叙述，尚不能认定移动当前卡牌入口。",
    "source_urls": [
      "https://xianhua.sanguosha.cn/postDetails?id=11142281"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "玲珑狮蛮带",
    "source_game": "三国杀",
    "reason": "虎牢模式装备线索；检索到咸话文章跨版本叙述，尚不能认定移动当前卡牌入口。",
    "source_urls": [
      "https://xianhua.sanguosha.cn/postDetails?id=11142281"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "束发紫金冠",
    "source_game": "三国杀",
    "reason": "虎牢模式装备线索；检索到咸话文章跨版本叙述，尚不能认定移动当前卡牌入口。",
    "source_urls": [
      "https://xianhua.sanguosha.cn/postDetails?id=11142281"
    ],
    "type": "待核目标版本",
    "range": null,
    "condition": null,
    "effect": null,
    "timing": null,
    "limits": "证据未闭合，禁止据名字实现或混入牌堆",
    "acquisition": "待核",
    "completeness": "候选名册，不算已验证规则实体",
    "ordinary_deck": false,
    "implementation_status": "pending-source"
  },
  {
    "name": "龙鳞甲",
    "ordinary_deck": false,
    "implementation_status": "removed-unsupported",
    "reason": "未核实为所选双游戏普通装备；仅怒焰三国杀同名线索，不与金鳞甲别名合并。"
  }
]);
/** One representative per complete signature, with explicit source lineage. */
export const EQUIPMENT_CATALOG = deepFreeze(Object.entries(EQUIPMENT_CANONICAL_BY_MECHANISM).map(([mechanism_key,id]) => {
  const source_records=EQUIPMENT_SOURCE_RECORDS.filter(record=>record.mechanism_key===mechanism_key);
  const representative=source_records.find(record=>record.id===id);
  if(!representative)throw Error(`Missing canonical equipment representative: ${id}`);
  if(new Set(source_records.map(record=>record.mechanism_signature_key)).size!==1)throw Error(`Different mechanisms merged: ${id}`);
  const name=representative.source_original_name;
  const source_aliases=source_records.map(record=>({id:record.id,name:record.name,source_original_name:record.source_original_name,source_game:record.source_game,source_variant:record.source_variant,canonical_id:id}));
  return {...representative,name,ui_name:name,base_name:name,ordinary_deck:true,source_only:false,
    aliases:[...new Set(source_records.flatMap(record=>[record.name,record.source_original_name]))].filter(alias=>alias!==name),
    alias_ids:source_records.map(record=>record.id).filter(alias=>alias!==id),source_aliases,source_records,
    source_games:[...new Set(source_records.map(record=>record.source_game))],
    source_urls:[...new Set(source_records.flatMap(record=>record.source_urls))],
    merge_reason:{policy:'identical_complete_mechanism_heroes_kill_name_preferred',mechanism_signature_key:representative.mechanism_signature_key,source_count:source_records.length,physical_deck_copies:1},
  };
}));
export const EQUIPMENT_BY_ID = Object.freeze(Object.fromEntries(EQUIPMENT_CATALOG.map(definition=>[definition.id,definition])));
export const EQUIPMENT_SOURCE_BY_ID = Object.freeze(Object.fromEntries(EQUIPMENT_SOURCE_RECORDS.map(definition=>[definition.id,definition])));
export const EQUIPMENT_ALIAS_TO_CANONICAL = Object.freeze(Object.fromEntries(EQUIPMENT_SOURCE_RECORDS.map(record=>[record.id,record.canonical_id])));
export const EQUIPMENT_CANONICAL_MAPPING = deepFreeze(EQUIPMENT_CATALOG.map(record=>({canonical_id:record.id,canonical_name:record.name,mechanism_key:record.mechanism_key,mechanism_signature:record.mechanism_signature,sources:record.source_aliases})));
/** Get original source rows; an unqualified ambiguous name is not guessed. */
export function equipment_source_records(cardOrIdOrName) {
  if(!cardOrIdOrName)return [];
  const card=typeof cardOrIdOrName==='string'?{id:cardOrIdOrName,name:cardOrIdOrName}:cardOrIdOrName;
  const id=card.equipment_id??card.id;
  if(id&&EQUIPMENT_SOURCE_BY_ID[id])return [EQUIPMENT_SOURCE_BY_ID[id]];
  if(id&&typeof cardOrIdOrName!=='string')return [];
  return EQUIPMENT_SOURCE_RECORDS.filter(record=>(record.name===card.name||record.source_original_name===card.name)&&(!card.type||record.type===card.type));
}
export function source_equipment_definition(cardOrIdOrName) {
  const matches=equipment_source_records(cardOrIdOrName);
  return matches.length===1?matches[0]:null;
}
/** Resolve both old IDs/names and current cards to a single production entity. */
export function canonical_equipment_definition(cardOrIdOrName) {
  if(!cardOrIdOrName)return null;
  const card=typeof cardOrIdOrName==='string'?{id:cardOrIdOrName,name:cardOrIdOrName}:cardOrIdOrName;
  const id=card.equipment_id??card.id;
  if(id&&EQUIPMENT_BY_ID[id])return EQUIPMENT_BY_ID[id];
  if(id&&EQUIPMENT_ALIAS_TO_CANONICAL[id])return EQUIPMENT_BY_ID[EQUIPMENT_ALIAS_TO_CANONICAL[id]];
  const sources=equipment_source_records(cardOrIdOrName),ids=[...new Set(sources.map(record=>record.canonical_id))];
  return ids.length===1?EQUIPMENT_BY_ID[ids[0]]:null;
}
export function equipment_definition(cardOrIdOrName) {
  const key=typeof cardOrIdOrName==='string'?cardOrIdOrName:cardOrIdOrName?.equipment_id??cardOrIdOrName?.rule_id;
  if(key===QIBAO_EQUIPMENT_ID||key==='七宝刀')return QIBAO_RULES;
  return ZHANGFEN_EQUIPMENT_CATALOG.find(r=>r.id===key||r.name===key||(r.aliases??[]).includes(key)) ?? canonical_equipment_definition(cardOrIdOrName) ?? mode_equipment_definition(cardOrIdOrName) ?? youjian_equipment_definition(cardOrIdOrName) ?? sanjian_equipment_definition(cardOrIdOrName);
}
