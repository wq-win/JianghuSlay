import {is_hero_in_release} from './release-scope.js';
import {SGS_PANZHANGMAZHONG_DEFINITIONS} from './sgs-panzhangmazhong-data.js';
import {SGS_CAOANG_DEFINITIONS} from './sgs-caoang-data.js';
import {SGS_CAOXIU_DEFINITIONS} from './sgs-caoxiu-data.js';
import {SGS_CHENLIN_DEFINITIONS} from './sgs-chenlin-data.js';
import {SGS_LINGCAO_DEFINITIONS} from './sgs-lingcao-data.js';
import {SGS_SUNRU_DEFINITIONS} from './sgs-sunru-data.js';
import {SGS_YUEJIN_DEFINITIONS} from './sgs-yuejin-data.js';
import {SGS_MANCHONG_DEFINITIONS} from './sgs-manchong-data.js';
import {SGS_LIRU_DEFINITIONS} from './sgs-liru-data.js';
import {SGS_ZHANGFEN_DEFINITIONS} from './sgs-zhangfen-registration.js';
import {YXS_MODERN_DEFINITIONS} from './yxs-modern-data.js';
import {SGS_FOLLOWUP_DEFINITIONS} from './sgs-followup-data.js';
import {SGS_YIJIANG_FURTHER_DEFINITIONS} from './sgs-yijiang-further-data.js';
import {SGS_YIJIANG_MORE_DEFINITIONS} from './sgs-yijiang-more-data.js';
import {SGS_YIJIANG_LATER_DEFINITIONS} from './sgs-yijiang-later-data.js';
import {SGS_YIJIANG_NEXT_DEFINITIONS} from './sgs-yijiang-next-data.js';
import {SGS_YIJIANG_FOLLOWING_DEFINITIONS} from './sgs-yijiang-following-data.js';
import {SGS_YIJIANG_DEFINITIONS} from './sgs-yijiang-data.js';
import {SGS_MOUNTAIN_DEFINITIONS} from './sgs-mountain-data.js';
import {SGS_FOREST_DEFINITIONS} from './sgs-forest-data.js';
import {SGS_FIRE_DEFINITIONS} from './sgs-fire-data.js';
import {YOUJIAN_STAB_CATALOG} from './youjian-stab.js';
import {YOUJIAN_TRICK_CATALOG} from './youjian-trick-effects.js';
import {WANGYUN_DEFINITIONS} from './wangyun-data.js';
import {SGS_NEXT_IDENTITY_DEFINITIONS} from './sgs-next-identity-data.js';
import {SGS_WIND_DEFINITIONS} from './sgs-wind-data.js';
import {SGS_FOLLOWING_DEFINITIONS} from './sgs-following-data.js';
import {SGS_BASE_SOURCE_ALIAS_DEFINITIONS} from './sgs-base-source-aliases.js';
import {SGS_BASE_NEXT_DEFINITIONS} from './sgs-base-next-data.js';
import {SANJIAN_EQUIPMENT_CATALOG,SANJIAN_PACK_ID} from './sanjian-catalog.mjs';
import {prepare_card_face} from './card-face-projection.js';
import {YXS_NINTH_DEFINITIONS} from './yxs-ninth-data.js';
import {EQUIPMENT_CATALOG} from './equipment-catalog.mjs';
import {enabled_mode_equipment} from './mode-equipment-catalog.mjs';
import {YOUJIAN_EQUIPMENT_CATALOG, YOUJIAN_EQUIPMENT_PACK_ID} from './youjian-equipment-catalog.mjs';
import {normalize_content_packs} from './content-packs.js';
import {TRICK_BY_NAME} from './trick-catalog.js';
import {HERO_RULE_GENDER} from './hero-rule-gender.js';
import {rule_hero} from './effective-hero.js';
// Browser-native models. Card text, deck composition, and hero definitions mirror
// models/*.py and heroes.py; there is no server or Python runtime dependency.
export const CardColor = Object.freeze({ RED: "红", BLACK: "黑" });
export const CardSuit = Object.freeze({
  HEART: "红桃", DIAMOND: "方块", SPADE: "黑桃", CLUB: "梅花",
});
export const CardType = Object.freeze({
  POISON: "毒", STAB_SHA: "刺杀", SHA: "杀", FIRE_SHA: "火杀", THUNDER_SHA: "雷杀", BLOOD_SHA: "血杀", POISON_SHA: "毒杀", SHAN: "闪", TAO: "桃", WINE: "酒",
  WEAPON: "武器", ARMOR: "防具", OFFENSIVE_HORSE: "-1马", DEFENSIVE_HORSE: "+1马", SCROLL: "锦囊",
});
export const SHA_CARD_TYPES = new Set([CardType.SHA, CardType.FIRE_SHA, CardType.THUNDER_SHA, CardType.BLOOD_SHA, CardType.POISON_SHA, CardType.STAB_SHA]);
export function suit_color(suit) {
  return suit === CardSuit.HEART || suit === CardSuit.DIAMOND ? CardColor.RED : CardColor.BLACK;
}
export const card_suit_color = suit_color;
export function rank_label(rank) {
  if (rank === null) return '—';
  if (rank <= 10) return String(rank);
  const label = { 11: "J", 12: "Q", 13: "K" }[rank];
  if (label === undefined) throw new RangeError(`Invalid card rank: ${rank}`);
  return label;
}
export const is_sha_type = (card_type) => SHA_CARD_TYPES.has(card_type);
export const is_sha_card = (card) => SHA_CARD_TYPES.has(card.type);

export class Card {
  constructor(name, type, power = 0, description = "", range = 1, trait = "", suit = CardSuit.SPADE, color = CardColor.BLACK, rank = 1) {
    let metadata = {};
    // Also accept an options object for callers that would use Python keywords.
    if (power !== null && typeof power === "object") {
      const options = power; metadata = options;
      power = options.power ?? 0;
      description = options.description ?? "";
      range = options.range ?? 1;
      trait = options.trait ?? "";
      suit = options.suit === null ? null : options.suit ?? CardSuit.SPADE;
      color = options.color === null ? null : options.color ?? CardColor.BLACK;
      rank = options.rank === null ? null : options.rank ?? 1;
    }
    Object.assign(this, metadata, { name, type, power, description, range, trait, suit, color, rank });
    prepare_card_face(this);Object.freeze(this);
  }
  toString() {
    const suit_tag = this.suit === null || this.rank === null
      ? `[${this.suit ?? "无花色"}/${this.rank === null ? "无点数" : rank_label(this.rank)}]`
      : `[${this.suit}${rank_label(this.rank)}]`;
    if(this.equipment_id&&this.type===CardType.WEAPON)return `${suit_tag}${this.name}(武器 距离${this.range})`;
    if(this.equipment_id&&this.type===CardType.ARMOR)return `${suit_tag}${this.name}(防具)`;
    if (this.type === CardType.WEAPON) return `${suit_tag}${this.name}(武器 距离${this.range} 伤害+${this.power})`;
    if (this.type === CardType.ARMOR) return `${suit_tag}${this.name}(${this.type}+${this.power})`;
    if ([CardType.OFFENSIVE_HORSE, CardType.DEFENSIVE_HORSE].includes(this.type)) return `${suit_tag}${this.name}(${this.type})`;
    return `${suit_tag}${this.name}`;
  }
}

export class Hero {
  constructor(name, max_hp, skill_name, skill_desc, metadata = {}) {
    Object.assign(this, { name, display_name:name, max_hp, skill_name, skill_desc, ...metadata },HERO_RULE_GENDER[metadata.id]??{},metadata.id==='sgs.adapted.base.hero.guan-yu'?{display_name:'云锋',source_character_name:'关羽',source_label:'三国杀',former_names:Object.freeze(['关羽']),aliases:Object.freeze(['三国杀关羽','关羽·武圣','武圣']),identity_note:'三国杀基础关羽的江湖适配显示名；完整武圣机制与来源ID保留，区别于英雄杀关羽·单骑/补刀。'}:{});
    Object.freeze(this);
  }
}

const classicDefinitions = [
  new Hero("秦始皇", 4, "集权", "回合开始额外摸2张牌，回合结束弃1张牌（无手牌则不弃）。"),
  new Hero("项羽", 5, "霸王", "主动技：失去1点血并摸1张牌，可叠加（每次发动杀伤害+1）；1血也可发动，无桃/酒则阵亡。"),
  new Hero("虞姬", 3, "舍身", "受到伤害后摸2张牌，或令伤害来源失去1点血。"),
  new Hero("李白", 4, "诗仙", "主动技：发动后本回合手牌与装备均可当杀使用。"),
  new Hero("武则天", 4, "女帝", "红色手牌可当桃；可将一张红色手牌对对手施加标记，其下回合开始前判定，若为红色则受到1点伤害。"),
  new Hero("刘邦", 4, "驭人", "主动技：每回合一次，弃任意张手牌并摸等量牌。"),
  new Hero("赵匡胤", 4, "释权", "主动技：将一张黑色手牌当釜底抽薪使用，成功后有25%额外摸1张牌。"),
  new Hero("杨延昭", 4, "天狼", "回合内可以使用三张杀。"),
  new Hero("扁鹊", 3, "回春/鸩杀", "使用桃额外回复1点血；他人濒死时可用一张桃令其直接阵亡。"),
  new Hero("荆轲", 4, "刺客", "攻击目标血量高于自身手牌数时，杀必中；对手手牌数高于自身血量时，需两张闪才能躲过。"),
  new Hero("韩信", 4, "兵仙/空城", "主动技：弃置3张牌，令对手失去1点血；无手牌时，别人不能对其出杀。"),
  new Hero("程咬金", 4, "三板斧", "回合开始额外摸（血量上限-当前血量）张牌。"),
  new Hero("花木兰", 4, "易装", "打出闪后摸1张牌；出杀被闪后判定，若为红色则强制获得对手1张牌。"),
  new Hero("貂蝉", 3, "离间", "回合开始若对手手牌更多，可选择额外摸1张牌或弃置对手1张牌。"),
  new Hero("岳飞", 4, "武穆", "受到伤害后，可获得对手1张牌，或摸1张牌并弃置对手1张牌；响应时杀闪可互用。"),
  new Hero("杨再兴", 4, "冲阵", "主动技：可将一张闪当杀使用。"),
  new Hero("姜维", 4, "粮援", "回合开始时，若手牌为0，额外摸2张牌。"),
  new Hero("褒姒", 3, "换牌", "主动技：每回合一次，可交换全部手牌，或用若干张手牌与对手等量手牌交换。"),
  new Hero("时迁", 3, "飞贼", "被动：使用顺手牵羊无距离限制，免疫顺手牵羊；主动：可将一张梅花手牌当顺手牵羊使用。"),
 ];
// Original mechanisms keep their IDs and legacy internal names. Only their
// visible names change when a real historical source character joins the roster.
const classicSourceConflictNames=Object.freeze({
  'qin-shi-huang':'玄衡','han-xin':'弈川','zhao-kuang-yin':'墨衡','yang-yan-zhao':'夜狼',
  'wu-ze-tian':'昭宁','xiang-yu':'撼岳','liu-bang':'衡舟','bian-que':'青蘅','shi-qian':'掠影','yu-ji':'绛璃','bao-si':'绫月','hua-mu-lan':'岚衣','diao-chan':'绮罗','jiang-wei':'粮川',
});
const classicIds = ['qin-shi-huang','xiang-yu','yu-ji','li-bai','wu-ze-tian','liu-bang','zhao-kuang-yin','yang-yan-zhao','bian-que','jing-ke','han-xin','cheng-yao-jin','hua-mu-lan','diao-chan','yue-fei','yang-zai-xing','jiang-wei','bao-si','shi-qian'];
export const CLASSIC_HEROES = Object.freeze(classicDefinitions.map((hero, index) => new Hero(
  hero.name, hero.max_hp, hero.skill_name, hero.skill_desc, {
    id: `jianghu.classic.hero.${classicIds[index]}`, source_variant: 'jianghu-classic',
    faction: null, gender: null, source_status: 'original', implementation_status: 'tested', source_urls: Object.freeze([]), adaptation_notes: '', source_coverage:false,
    ...(classicSourceConflictNames[classicIds[index]]?{display_name:classicSourceConflictNames[classicIds[index]],former_names:Object.freeze([hero.name]),aliases:Object.freeze([`旧江湖${hero.name}`,...(classicIds[index]==='jiang-wei'?['姜维·粮援']:[])]),identity_note:`原创江湖角色，曾用名${hero.name}；稳定ID和原有机制不变，区别于同名已接入原作来源角色。`}:{}),
    ...(hero.name==='岳飞'?{display_name:'凌川',aliases:Object.freeze(['旧江湖岳飞']),identity_note:'原创江湖角色，曾用名岳飞；保留受伤应敌与响应转换，区别于英雄杀岳飞·武穆。'}:{}),
  },
)));
// This is an explicitly adapted content pack. Skill references are the publisher's
// mobile base pages; HP is verified against the OL standard roster, not inferred
// from illustrations or a different edition. No publisher artwork is bundled.
const expansionDefinitions = [
  ['guan-yu','关羽',4,'蜀',2,'武圣','可将一张红色手牌或装备当普通杀使用或打出；仍遵守出杀次数、距离和合法窗口。','武圣转换为江湖普通杀，不保留素材的血杀/毒杀效果；按消耗素材后的装备状态检查距离；只有合法才消耗，伤害按消耗后的装备计算。'],
  ['zhang-fei','张飞',4,'蜀',3,'咆哮','使用杀没有次数限制；仍须遵守距离、画地为牢和合法出牌窗口。','江湖普通杀、血杀、毒杀均属杀；咆哮不解除其他限制。'],
  ['gan-ning','甘宁',4,'吴',9,'奇袭','可将一张黑色手牌或装备当釜底抽薪使用，弃置任意其他角色一张手牌、装备或判定区牌。','原版过河拆桥适配为江湖釜底抽薪；可弃置任意其他角色的手牌、装备与实体判定区牌，不附加原创墨衡的额外摸牌；本版本完整规则合并到英雄杀赵匡胤·释权。'],
  ['huang-gai','黄盖',4,'吴',11,'苦肉','出牌阶段可失去1点体力，先结算濒死；存活则摸2张牌。没有发动次数上限。','沿用江湖自救规则：先失去体力并结算濒死，阵亡时不摸牌；体力流失不触发受伤技能。'],
  ['lv-meng','吕蒙',4,'吴',10,'克己','若自己出牌阶段未使用或打出杀，可选择跳过本回合弃牌阶段。','统计自己出牌阶段的使用杀和响应杀，包括决斗响应；其他角色回合打出的杀不影响克己。'],
  ['xu-chu','许褚',4,'魏',19,'裸衣','摸牌阶段可少摸1张牌；本回合自己使用杀或决斗造成的伤害各增加1点。','仅强化本回合由自己使用、自己造成的杀/决斗伤害；不强化他人发起的决斗、其他锦囊、反击或体力流失。'],
  ['xia-hou-dun','夏侯惇',4,'魏',17,'刚烈','受到一次伤害且存活或获救后可判定；非红桃时，来源弃2张手牌或受到1点伤害。','每次伤害事件触发一次；先处理濒死，无有效来源则跳过；不足2张手牌必须受伤，按江湖护甲减伤。'],
  ['huang-yue-ying','黄月英',3,'蜀',7,'集智/奇才','使用普通锦囊时可先摸1张牌；使用锦囊无距离限制。','手捧雷和画地为牢视为延时锦囊，不触发集智；奇才不解除目标免疫或其他合法性条件。'],
];
export const EXPANSION_HEROES = Object.freeze(expansionDefinitions.map(([id,name,hp,faction,page,skill,description,notes]) => new Hero(
  name,hp,skill,description,{
    id: `sgs.adapted.base.hero.${id}`, source_variant: 'jianghu-adapted:mobile-base+ol-standard:2026-10-15',
    faction, gender: null, source_status: 'verified', implementation_status: 'tested',
    source_urls: Object.freeze([`https://www.sanguosha.cn/pc/hero-detail-${page}.html`, 'https://www.sanguosha.com/hero']),
    adaptation_notes: notes,
  },
)));
// Second source-closed batch: metadata comes from the matching mobile-base / OL
// standard snapshot. Keep the original eight-hero export stable for its fixtures.
const secondFourDefinitions = [
  ['zhao-yun','赵云',4,'蜀',5,'龙胆','可将自己手牌中的杀当闪、闪当普通杀使用或打出；遵守对应时机、目标和次数限制。','血杀、毒杀均可作闪素材，转化后不保留原牌附效；只用自己手牌，保留素材花色点数，不能用装备。'],
  ['ma-chao','马超',4,'蜀',6,'马术/铁骑','马术：自己至其他角色距离-1。铁骑：使用杀指定目标后可判定，红色时该目标不能用闪响应这张杀。','存活座次环形距离，马术与进攻马分别叠加，最低为1；铁骑对每个杀目标独立判定，不封技能、不忽略江湖护甲。'],
  ['zhou-yu','周瑜',3,'吴',12,'英姿/反间','英姿：摸牌阶段可多摸1张。反间：出牌阶段限一次，敌方先猜花色，再随机获得并展示你的一张手牌；猜错受到你造成的1点伤害。','反间按当前来源顺序先获得并展示再伤害；江湖盲取用确定性随机抽取，不允许周瑜选牌；沿用敌方目标、护甲和自救规则。'],
  ['zhu-ge-liang','诸葛亮',3,'蜀',4,'观星/空城','观星：准备阶段可观看牌堆顶至多存活人数（最多5）张牌，任意排序置于牌堆顶或底。空城：无手牌时不能成为杀或决斗目标。','观星以OL标准补清存活人数与双区任意排序；不足时按江湖规则洗入弃牌堆。顶区顺序为接下来摸牌顺序；底区顺序为其最终被摸到的顺序。合法指定目标后不追溯取消；与韩信只防杀的自定义空城区别。'],
];
export const SECOND_FOUR_HEROES = Object.freeze(secondFourDefinitions.map(([id,name,hp,faction,page,skill,description,notes]) => new Hero(
  name,hp,skill,description,{
    id: `sgs.adapted.base.hero.${id}`, source_variant: 'jianghu-adapted:mobile-base+ol-standard:2026-10-15',
    faction, gender: null, source_status: 'verified', implementation_status: 'tested',
    source_urls: Object.freeze([`https://www.sanguosha.cn/pc/hero-detail-${page}.html`, `https://www.sanguosha.com/hero/${page}`, 'https://www.sanguosha.com/hero']),
    adaptation_notes: notes,
  },
)));
// Source-complete historical mobile base packet, with explicit cross-game boundaries.
const yxsFirstDefinitions = [
  {
    "id": "yxs.mobile.historical.hero.song-jiang",
    "name": "宋江",
    "max_hp": 4,
    "skill_name": "疏财",
    "skill_desc": "疏财：本回合交出牌达到2张后，自己回复1点；之后仍可交牌但不再以此技能回复。",
    "faction": "民",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "宋江",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304258.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63910.shtml",
      "https://www.bilibili.com/opus/1073332947415728130"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "分次交牌累计达到2张后，本回合最多实际回复1点。满血时不消耗实际回复额度；之后同回合受伤并继续交牌可回复。该满血组合为本作兼容边界。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs/song-jiang.svg"
  },
  {
    "id": "yxs.mobile.historical.hero.lu-zhi-shen",
    "name": "鲁智深",
    "max_hp": 4,
    "skill_name": "底力/狂禅",
    "skill_desc": "底力：基础摸牌数为2+当前已损失体力（max_hp-hp）。；狂禅：不获得主公身份通常提供的额外1点体力上限。",
    "faction": "民",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "鲁智深",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304255.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63903.shtml",
      "https://www.taptap.cn/moment/302976287381651552?group_id=1334"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "底力只修正未跳过的正常摸牌阶段；狂禅完整保留，但本作1v1/1v2没有主公身份与主公加成，因而当前模式不触发。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs/lu-zhi-shen.svg"
  },
  {
    "id": "yxs.mobile.historical.hero.shang-yang",
    "name": "商鞅",
    "max_hp": 3,
    "skill_name": "变法/法家",
    "skill_desc": "变法：选择素材并移出原区，将其作为此判定的最终牌，按新牌花色/点数/颜色求结果。；法家：从来源手牌或装备区取得1张牌，加入自己的手牌。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "商鞅",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304243.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63844.shtml",
      "https://www.9game.cn/news/11273127.html"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "变法每个真实判定每名商鞅至多一次，按行动顺序；法家濒死获救后可发动，仅从另一存活伤害来源的手牌或装备取得1张，不能取判定区。自伤来源排除为本作兼容边界。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs/shang-yang.svg"
  },
  {
    "id": "yxs.mobile.historical.hero.liu-bo-wen",
    "name": "刘伯温",
    "max_hp": 3,
    "skill_name": "占卜/归隐",
    "skill_desc": "占卜：仅自己查看这些牌；任意数量放顶、其余放底，两区内任意排序，然后进入判定/摸牌/出牌阶段。；归隐：空手时不能被其他人主动指定为杀或决斗目标。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "刘伯温",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304241.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63838.shtml",
      "https://www.taptap.cn/moment/363070081137115541"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "与三国杀基础诸葛亮在本作中的完整HP/占卜准备阶段活人数上限5/任意顶底顺序/空手禁杀决斗机制相同，合并为一个可选角色。短牌堆洗牌采用本作通用规则。",
    "aliases": [
      "诸葛亮",
      "三国杀基础诸葛亮"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.zhu-ge-liang"
    ],
    "portrait_path": "./portraits-yxs/liu-bo-wen.svg"
  },
  {
    "id": "yxs.mobile.historical.hero.guan-yu",
    "name": "关羽",
    "max_hp": 4,
    "skill_name": "单骑/补刀",
    "skill_desc": "单骑：视为额外进攻马的距离-1；与真实进攻马的-1叠加。；补刀：对伤者使用杀，正常提供闪/护甲/其他杀响应；不是直接追加伤害。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "关羽",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304237.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63828.shtml",
      "https://www.taptap.cn/moment/699731204198370296",
      "https://www.9game.cn/yxs/9284026.html"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "补刀仅自己回合外，对当前攻击范围内的直接杀伤害承受者发动；目标须存活且合法，可对队友但AI主动避开。连环传导不触发补刀，是本作跨作兼容边界。秦琼特殊联动随该角色接入另行验收。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs/guan-yu.svg"
  },
  {
    "id": "yxs.mobile.historical.hero.yue-fei",
    "name": "岳飞",
    "max_hp": 4,
    "skill_name": "武穆",
    "skill_desc": "武穆：以素材花色/点数/颜色的虚拟目标牌结算；只消费素材1次。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "岳飞",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304248.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63835.shtml",
      "https://apps.apple.com/cn/app/%E8%8B%B1%E9%9B%84%E6%9D%80/id483330461"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "adaptation_notes": "与三国杀基础赵云在本作中的4体力、实体手牌杀闪双向转换完整机制相同，合并保留英雄杀岳飞。属性杀、血杀、毒杀可转闪但失去原牌附效；不能用武器虚拟杀或判定虚拟闪二次转换。",
    "aliases": [
      "赵云",
      "三国杀基础赵云"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.zhao-yun"
    ],
    "portrait_path": "./portraits-yxs/yue-fei.svg"
  }
];
export const SGS_BASE_SOURCE_ALIAS_HEROES=Object.freeze(SGS_BASE_SOURCE_ALIAS_DEFINITIONS.map(({name,max_hp,skill_name,skill_desc,...metadata})=>new Hero(name,max_hp,skill_name,skill_desc,metadata)));
const sourceMergedHero=({name,max_hp,skill_name,skill_desc,...metadata})=>{
  const aliases=(metadata.source_id_aliases??[]).map(id=>[...EXPANSION_HEROES,...SECOND_FOUR_HEROES,...SGS_BASE_SOURCE_ALIAS_HEROES].find(hero=>hero.id===id)).filter(Boolean);
  return new Hero(name,max_hp,skill_name,skill_desc,{...metadata,
    source_urls:[...new Set([...(metadata.source_urls??[]),...aliases.flatMap(hero=>hero.source_urls??[])])],
    merged_source_records:aliases.map(hero=>({id:hero.id,name:hero.source_character_name??hero.name,max_hp:hero.max_hp,faction:hero.faction??null,gender:hero.gender??null,gender_provenance:hero.gender_provenance??hero.gender_source??hero.gender_basis??null,source_identity_context:hero.source_identity_context??null,skill_name:hero.skill_name,skill_desc:hero.skill_desc,source_variant:hero.source_variant,source_urls:hero.source_urls}))});
};
export const YXS_FIRST_HEROES=Object.freeze(yxsFirstDefinitions.map(sourceMergedHero));
// Six source identities; two source aliases merge only after full-rule equivalence.
const yxsNextDefinitions = [
  {
    "id": "yxs.adapted.base.hero.ying-zheng",
    "name": "秦始皇",
    "max_hp": 4,
    "skill_name": "集权",
    "skill_desc": "集权：实际受到伤害并存活或获救后，可获得造成该次伤害的实体牌；虚拟杀取得其真实素材，无实体伤害牌则不获牌。",
    "faction": "君",
    "gender": "male",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "嬴政",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304229.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63809.shtml",
      "https://www.taptap.cn/moment/826469801726576781"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "濒死救援及伤后结算后取得仍可获得的实体素材；保留伤害来源及原用牌标识，已进入他人手牌的实体不复制。历史来源卡面标题为“嬴政-秦始皇”，本作展示秦始皇并保留嬴政别名。",
    "aliases": [
      "嬴政"
    ],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-next/ying-zheng.svg",
    "source_card_heading": "嬴政-秦始皇",
    "identity_note": "展示秦始皇，保留官方网页标题嬴政为来源名及别名；2015手游与2012桌面卡面标题均为嬴政-秦始皇。二者不是不同规则版本。"
  },
  {
    "id": "yxs.adapted.base.hero.han-xin",
    "name": "韩信",
    "max_hp": 3,
    "skill_name": "攻心/兵仙",
    "skill_desc": "攻心：出牌阶段限一次，其他角色先猜花色，再盲选你的一张手牌；猜错先受到1点伤害，完整结算后存活才获得该牌。兵仙：正常摸牌阶段基础摸3张。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "韩信",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304238.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63834.shtml",
      "https://www.taptap.cn/moment/733488040781022614",
      "https://www.taptap.cn/moment/834695097231606692",
      "https://www.k73.com/glzq/38950.html"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "攻心先伤害、后交牌，与三国杀周瑜反间顺序不同，不能合并。选牌在伤害中仍为韩信手牌；可被技能取得或用于救援，最终按唯一实体位置结算。其他角色目标范围为历史文本的明确本作解释。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-next/han-xin.svg"
  },
  {
    "id": "yxs.adapted.base.hero.zhao-kuang-yin",
    "name": "赵匡胤",
    "max_hp": 4,
    "skill_name": "释权",
    "skill_desc": "释权：出牌阶段可将一张黑色手牌或装备当釜底抽薪，弃置任意其他角色的一张手牌、装备或判定区牌；无次数或距离限制，可被无懈抵消。",
    "faction": "君",
    "gender": "male",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "赵匡胤",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304233.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63806.shtml",
      "https://www.taptap.cn/moment/826469801726576781",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1698/m1628/201203/56650.shtml?2"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "釜底抽薪与过河拆桥采用同一任意其他角色、手牌/装备/判定区、可无懈的完整规则；与4血三国杀基础甘宁整套合并。素材仅手牌/装备，无原创25%额外摸牌。",
    "aliases": [
      "甘宁",
      "三国杀基础甘宁"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.gan-ning"
    ],
    "portrait_path": "./portraits-yxs-next/zhao-kuang-yin.svg"
  },
  {
    "id": "yxs.adapted.base.hero.yang-yan-zhao",
    "name": "杨延昭",
    "max_hp": 4,
    "skill_name": "天狼",
    "skill_desc": "天狼：使用杀没有次数限制；仍须满足出牌窗口、目标、距离和禁杀条件。",
    "faction": "臣",
    "gender": "male",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "杨延昭",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304245.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63827.shtml",
      "https://www.taptap.cn/moment/832385130004744945",
      "https://www.taptap.cn/moment/261625946568656063"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "与4血三国杀基础张飞单技能咆哮整套合并；本作全部杀子类共用无限次数，不解除其他使用限制。原创夜狼每回合最多3杀，另行保留。",
    "aliases": [
      "张飞",
      "三国杀基础张飞"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.zhang-fei"
    ],
    "portrait_path": "./portraits-yxs-next/yang-yan-zhao.svg"
  },
  {
    "id": "yxs.adapted.base.hero.li-shi-shi",
    "name": "李师师",
    "max_hp": 3,
    "skill_name": "曼舞/红妆",
    "skill_desc": "曼舞：承受伤害前可弃一张有效红桃手牌，将整次伤害转给其他角色；完成救援及伤后技能后，存活的受伤者按当前缺血量摸牌。红妆：自己的黑桃按红桃处理，包括自己的判定。",
    "faction": "民",
    "gender": "female",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "李师师",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304254.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63905.shtml",
      "https://www.taptap.cn/moment/830758001819258139",
      "https://yxs.qq.com/web201202/rule.shtml?3",
      "https://jingyan.baidu.com/article/0bc808fc6f11c61bd485b9d5.html",
      "https://www.k73.com/glzq/38950.html"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "伤害来源、属性和实体素材沿转移保持；护甲及属性连环依统一联合牌池规则只结算一次，为本作跨作品适配。有效花色随持有者或判定对象查询，不永久改写物理牌。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-next/li-shi-shi.svg"
  },
  {
    "id": "yxs.adapted.base.hero.chen-sheng",
    "name": "陈胜",
    "max_hp": 4,
    "skill_name": "起义",
    "skill_desc": "起义：正常摸牌阶段可放弃摸牌，从至多两名不同的其他角色各随机获得一张手牌；只有一名其他角色时只取一张。",
    "faction": "君",
    "gender": "male",
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "陈胜",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304221.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59293.shtml",
      "https://www.taptap.cn/moment/829068286296591729",
      "https://www.taptap.cn/moment/754836623429996172"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "adaptation_notes": "起义只在未跳过的正常摸牌阶段发动，不是出牌阶段按钮；可选择1至2名不同的其他存活角色，允许队友，仅取手牌。1至2目标为“最多两名”的显式解释。与三国杀基础张辽（4体力、突袭）固有效果合并；魏势力等来源上下文保留。摸牌数被其它效果改为0时不触发，为共享主机适配。",
    "aliases": ["张辽", "突袭", "三国杀张辽"],
    "source_id_aliases": ["sgs.adapted.base.hero.zhang-liao"],
    "portrait_path": "./portraits-yxs-next/chen-sheng.svg"
  }
];
export const YXS_NEXT_HEROES=Object.freeze(yxsNextDefinitions.map(sourceMergedHero));
// Third source-complete historical packet. Historical research IDs are legacy
// identifiers, not extra source identities or separately selectable entities.
const yxsThirdDefinitions = [
  {
    "id": "yxs.adapted.base.hero.bian-que",
    "name": "扁鹊",
    "max_hp": 3,
    "skill_name": "回春/疗伤",
    "skill_desc": "回春：自己回合外的濒死救援窗口，可将红色手牌或装备当桃使用，每张回复1点。疗伤：出牌阶段每回合限一次，弃一张手牌，令任意存活受伤角色回复1点。",
    "faction": "民",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "扁鹊",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304250.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63908.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.bian-que",
    "legacy_source_ids": [
      "yxs.mobile.historical.hero.bian-que"
    ],
    "adaptation_notes": "药映射本作桃；从当前回合主人起按行动顺序询问全体存活角色，濒死者到本人座位时自救。回春仅回合外合法濒死救援，真实装备离区事件先于这次药效果；酒仅本人自救。疗伤含自己、队友及敌人，手牌限定且每回合一次。旧原创青蘅保留额外自疗与鸩杀，机制不合并。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/bian-que.svg",
    "source_equivalence": {
      "status": "no_existing_complete_equivalent_in_current_roster",
      "merged_source_ids": [],
      "notes": "SGS华佗可能对应但未在当前12名源英雄中；此包不认证未来华佗版本，不能以名字或一项回血技能先合并。"
    }
  },
  {
    "id": "yxs.adapted.base.hero.xi-shi",
    "name": "西施",
    "max_hp": 3,
    "skill_name": "魅惑/沉鱼",
    "skill_desc": "魅惑：出牌阶段可将方块手牌或装备当画地为牢，作为实体延时牌置入其他角色判定区。沉鱼：杀的闪避响应前，可弃一张手牌或装备，把当前杀目标转给支付后自己攻击范围内另一角色，不能转给原使用者。",
    "faction": "民",
    "gender": "female",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "西施",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304260.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63909.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.xi-shi",
    "legacy_source_ids": [
      "yxs.mobile.historical.hero.xi-shi"
    ],
    "adaptation_notes": "画地为牢为真实延时牌：仅判定翻牌前可无懈、放置时无无懈窗口，红桃正常、非红桃跳过整个出牌阶段，摸牌与弃牌仍进行。沉鱼按弃牌后的武器/坐骑计算范围，保留原使用者、属性和伤害；每目标分支独立，已闪或玉如意尝试后不得再转移，遵守盘龙棍追杀链限制。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/xi-shi.svg",
    "source_equivalence": {
      "status": "no_existing_complete_equivalent_in_current_roster",
      "merged_source_ids": [],
      "notes": "SGS大乔为未来候选；本包未认证其完整版本及追杀/多目标FAQ一致，当前无对应已注册来源人物。"
    }
  },
  {
    "id": "yxs.adapted.base.hero.wu-song",
    "name": "武松",
    "max_hp": 4,
    "skill_name": "醉酒",
    "skill_desc": "醉酒：正常摸牌阶段可将基础摸牌数从2改为1；本回合自己使用且自己造成伤害的杀或决斗，普通基础伤害改为2，其他独立摸牌及伤害修正仍叠加。",
    "faction": "民",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "武松",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304259.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63911.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.wu-song",
    "legacy_source_ids": [
      "yxs.mobile.historical.hero.wu-song"
    ],
    "adaptation_notes": "采用jianghu.zuijiu.set_base_then_addmods.v1：基础摸牌1、合格杀/决斗基础伤害2，再叠加独立修正。与三国杀标准许褚同为4体力、单技能，但醉酒设置基础值、裸衣增加独立修正，完整机制签名不同，因此分别保留，不建立来源合并或许褚别名。当前基础摸2、杀/决斗基础1时结果相同不足以认定完整等价。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/wu-song.svg",
    "source_equivalence": {
      "status": "distinct_base_set_vs_add",
      "compared_id": "sgs.adapted.base.hero.xu-chu",
      "hp_pair": [
        4,
        4
      ],
      "full_skill_lists": {
        "武松": [
          "醉酒"
        ],
        "许褚": [
          "裸衣"
        ]
      },
      "differences": [
        "醉酒将普通摸牌基础设为1；裸衣是独立少摸1张。",
        "醉酒将合格杀/决斗普通基础伤害设为2；裸衣是独立伤害+1。",
        "当前基础摸2、伤害1的相同结果不代表完整机制相同；不同基础值或其他设值效果时两者可以分歧。"
      ],
      "sources": [
        "wu-song-mobile",
        "wu-song-desktop",
        "wang-zhao-jun-official",
        "sgs-xuchu-mobile",
        "sgs-standard-hp"
      ],
      "merged_source_ids": [],
      "strict_all_products_all_future_variants_equivalence": false,
      "review_note": "采用完整机制签名判重，否决只凭当前数值域结果一致的研究合并建议。"
    }
  },
  {
    "id": "yxs.adapted.base.hero.xiang-yu",
    "name": "项羽",
    "max_hp": 4,
    "skill_name": "霸王",
    "skill_desc": "霸王：杀目标须连续响应两张闪；与自己决斗的对手每轮须连续响应两张杀，自己通常响应一张。每张响应后立即结算响应触发，未完成整组只受一次失败伤害。",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "项羽",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304232.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63796.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.xiang-yu",
    "legacy_source_ids": [],
    "adaptation_notes": "逐个杀/闪响应可由合法转换或装备提供；同类需两张不相乘，每份成功响应的触发在下一份之前结算。霸王不增加伤害或出杀次数，且决斗无论哪方发起都要求对手每轮两杀；不同于5体力原创撼岳的主动失血增伤。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/xiang-yu.svg",
    "source_equivalence": {
      "status": "no_existing_complete_equivalent_in_current_roster",
      "merged_source_ids": [],
      "notes": "SGS标准吕布为未来候选，当前没有已注册吕布；此包只验证源项羽完整能力，不用传言先建立别名。"
    }
  },
  {
    "id": "yxs.adapted.base.hero.liu-bang",
    "name": "刘邦",
    "max_hp": 4,
    "skill_name": "驭人",
    "skill_desc": "驭人：出牌阶段每回合限一次，可弃任意数量的手牌和装备并摸等量牌；至少一张，先锁定费用数量再结算装备离场与摸牌。",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "刘邦",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304225.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63807.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.liu-bang",
    "legacy_source_ids": [],
    "adaptation_notes": "手牌和装备区任意混合，可仅用装备；判定区不可用，取消或零张不消耗次数。先一次锁定N并弃置，再结算离装事件和摸N，离装摸牌不增加N。旧原创衡舟仅换手牌，单独保留；不得只比较制衡就合并另有救援的孙权。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/liu-bang.svg",
    "source_equivalence": {
      "status": "no_existing_complete_equivalent_in_current_roster",
      "merged_source_ids": [],
      "notes": "SGS孙权有制衡和救援两项，完整技能数已知不同；不能因为驭人与制衡类似就合并。"
    }
  },
  {
    "id": "yxs.adapted.base.hero.gou-jian",
    "name": "勾践",
    "max_hp": 3,
    "skill_name": "隐忍/图强",
    "skill_desc": "隐忍：本回合自己的出牌阶段未使用或打出杀，可在弃牌阶段按20张手牌上限保留。图强：自己回合外每成功提供一张闪后可立即摸一张，连续双闪之间也能发动。",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "2015-official-mobile-base+matching-2012-desktop-hp",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "勾践",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304222.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63804.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.gou-jian",
    "legacy_source_ids": [],
    "adaptation_notes": "隐忍可选，最终手牌上限固定为20，超过20仍弃牌，乾坤袋等不再叠加；跳过出牌按空历史处理。图强仅回合外每个成功闪事件一次，玉如意红判算一闪，最终双闪失败不撤销已触发摸牌。与4体力单技能吕蒙克己不等效。",
    "aliases": [],
    "source_id_aliases": [],
    "portrait_path": "./portraits-yxs-third/gou-jian.svg",
    "source_equivalence": {
      "status": "not_equivalent",
      "compared_id": "sgs.adapted.base.hero.lv-meng",
      "hp_pair": [
        3,
        4
      ],
      "skill_counts": [
        2,
        1
      ],
      "differences": [
        "勾践3HP，吕蒙4HP",
        "勾践另有回合外每闪摸牌图强",
        "勾践有来源明确20张保留上限，吕蒙克己跳过弃牌阶段没有该20文字"
      ],
      "sources": [
        "gou-jian-mobile",
        "gou-jian-desktop",
        "sgs-lvmeng-mobile",
        "sgs-standard-hp"
      ],
      "merged_source_ids": []
    }
  }
];
export const YXS_THIRD_HEROES=Object.freeze(yxsThirdDefinitions.map(sourceMergedHero));
// Complete fourth historical source packet; identity decisions use all source skills.
const yxsFourthDefinitions=[
  {
    "id": "yxs.adapted.base.hero.dan-tai-ming",
    "name": "澹台名",
    "max_hp": 4,
    "skill_name": "傲剑",
    "skill_desc": "傲剑：消耗材料形成普通杀；材料的花色/点数与实体身份保留；失去装备的效果在本次杀中不再有效",
    "faction": "臣",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "澹台名",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304235.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63826.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_dantaiming",
    "source_record_id": "yxs-mobile:article:304235",
    "legacy_source_ids": [
      "yxs_dantaiming"
    ],
    "adaptation_notes": "红色手牌及装备转为普通杀，保留花色点数和实体素材；自身没有额外技能次数限制，主动次数继承合集统一杀规则。消耗素材后重新检查武器、坐骑距离及效果。与三国杀基础关羽武圣的内在完整4体力/单技能签名相同，先保留独立来源身份，最终合并待独立审查及主动、响应、距离测试；底层杀次数差异单列为共享卡规则适配。 完整内在技能与4血单武圣的三国杀基础关羽等效，合并保留澹台名；武圣、云锋及原来源ID可查，基础杀额度由合集共享牌规则统一处理。",
    "aliases": [
      "三国杀关羽",
      "关羽·武圣",
      "武圣",
      "云锋"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.guan-yu"
    ],
    "full_source_signature": {
      "max_hp": 4,
      "skills": [
        {
          "name": "傲剑",
          "signature": "CONVERT[cost=1 RED card in H|E; into=normal_SHA; window=USE|RESPOND; retain=suit,rank,physical; range=after_cost; quota=SHA_normal]"
        }
      ]
    },
    "source_equivalence": {
      "status": "verified_intrinsic_complete_signature_shared_card_rules",
      "compared_id": "sgs.adapted.base.hero.guan-yu",
      "hp_pair": [
        4,
        4
      ],
      "skill_counts": [
        1,
        1
      ],
      "source_signatures": [
        "CONVERT[cost=1 RED card in H|E; into=normal_SHA; window=USE|RESPOND; retain=suit,rank,physical; range=after_cost; quota=SHA_normal]"
      ],
      "unresolved": [
        "independent_full_signature_and_integration_review_before_canonical_merge"
      ],
      "merged_source_ids": [
        "sgs.adapted.base.hero.guan-yu"
      ],
      "intrinsic": {
        "max_hp": 4,
        "full_skill_count": 1,
        "skill_category": "optional_conversion",
        "cost": {
          "count": 1,
          "effective_color": "red",
          "zones": [
            "hand",
            "equipment"
          ],
          "judgment_zone_allowed": false
        },
        "result": "normal_sha",
        "windows": [
          "legal_use",
          "legal_response"
        ],
        "retain": [
          "suit",
          "rank",
          "physical_material"
        ],
        "target_legality": "normal_sha",
        "post_cost_equipment_range": true,
        "independent_skill_quota": null,
        "additional_intrinsic_effects": []
      },
      "shared_card_rule_adaptation": {
        "sha_use_quota": "shared_Jianghu_sha_rule",
        "source_game_quota_differences_not_intrinsic": true,
        "range_and_response": "shared_Jianghu_card_rule_with_cost_removed",
        "source_factions_preserved": [
          "臣",
          "蜀"
        ],
        "mode_boundary": "current_1v1_and_1v2_has_no_source_faction_skill",
        "current_clients_fully_certified": false
      },
      "independent_verification": "fourth-independent-audit: HP, full skill, H/E, use/respond, ordinary quota, post-cost range, borrowed weapon passed"
    },
    "portrait_path": "./portraits-yxs-fourth/dan-tai-ming.svg"
  },
  {
    "id": "yxs.adapted.base.hero.zhao-fei-yan",
    "name": "赵飞燕",
    "max_hp": 3,
    "skill_name": "玉步/轻影",
    "skill_desc": "玉步：做一次标准可改判判定，最终为黑则取得该判定牌并可继续；最终为红则停止且不得取得红牌；黑牌收入手牌；然后仍执行正常判定/摸牌；轻影：黑色手牌作为闪；满足杀或万箭等要求，触发真正闪的响应事件",
    "faction": "臣",
    "gender": "female",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "赵飞燕",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304249.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63822.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_zhaofeiyan",
    "source_record_id": "yxs-mobile:article:304249",
    "legacy_source_ids": [
      "yxs_zhaofeiyan"
    ],
    "adaptation_notes": "玉步在准备阶段、延时牌和正常摸牌之前，采用可改判的真实判定并逐张获得最终黑牌；逐张获得为明示江湖规范化，不宣称已核当前客户端时点。轻影只用黑色手牌，响应被禁止时不能转化绕过。",
    "aliases": [],
    "source_id_aliases": [],
    "full_source_signature": {
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
    "source_equivalence": {
      "status": "full_equivalence_pending",
      "compared_source_name": "三国杀甄姬",
      "differences_or_gaps": [
        "玉步最终黑牌逐张获得的时点采用明示江湖归一，未证完整来源一致"
      ],
      "merged_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fourth/zhao-fei-yan.svg"
  },
  {
    "id": "yxs.adapted.base.hero.tie-mu-zhen",
    "name": "铁木真",
    "max_hp": 4,
    "skill_name": "骑射/强掠",
    "skill_desc": "骑射：视为额外进攻马，距离减1；与真实进攻马叠加；最小距离仍1；强掠：标准可改判判定，最终黑色则从该目标手牌/装备区/判定区取得1张实体牌入自己手牌；红色无效果",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "铁木真",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304230.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63808.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_tiemuzhen",
    "source_record_id": "yxs-mobile:article:304230",
    "legacy_source_ids": [
      "yxs_tiemuzhen"
    ],
    "adaptation_notes": "骑射为自身到他人的距离-1，与进攻马叠加；强掠按整次杀对目标被足额闪避事件一次判定，取手/装/判实体而非处理区。强掠与盘龙追杀的跨来源顺序按本作统一事件队列明示。",
    "aliases": [],
    "source_id_aliases": [],
    "full_source_signature": {
      "max_hp": 4,
      "skills": [
        {
          "name": "骑射",
          "signature": "DISTANCE[from=SELF; delta=-1; stack=offensive_horse; floor=1; not_weapon_range]"
        },
        {
          "name": "强掠",
          "signature": "AFTER_SHA_DODGED[owner=sha_user; per_target_event=1; optional_judge; BLACK->GAIN1 target(H|E|J) into H; RED->none]"
        }
      ]
    },
    "source_equivalence": {
      "status": "not_equivalent",
      "compared_id": "yxs.mobile.historical.hero.guan-yu",
      "differences": [
        "铁木真强掠与关羽补刀不同；单一距离被动相同不等于整英雄等价"
      ],
      "merged_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fourth/tie-mu-zhen.svg"
  },
  {
    "id": "yxs.adapted.base.hero.mu-rong",
    "name": "慕容",
    "max_hp": 4,
    "skill_name": "蝶魂",
    "skill_desc": "蝶魂：可跳过此锦囊对自己的效果并立即摸1张；其他目标照常结算",
    "faction": "君",
    "gender": "female",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "慕容",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304226.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59693.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_murong",
    "source_record_id": "yxs-mobile:article:304226",
    "legacy_source_ids": [
      "yxs_murong"
    ],
    "adaptation_notes": "蝶魂按锦囊默认目标类型判断，在自己的目标无懈窗口前可跳过仅自己的效果并摸1。烽火/万箭采用全部其他合法角色目标，队友不因阵营自动排除；满血且不是休养合法目标者不凭技能加入。",
    "aliases": [],
    "source_id_aliases": [],
    "full_source_signature": {
      "max_hp": 4,
      "skills": [
        {
          "name": "蝶魂",
          "signature": "BEFORE_TRICK_TARGET_NULLIFICATION[card.default_multi=true AND self in legal_targets; optional->SKIP_SELF_EFFECT+DRAW1; keep_other_targets; actual_target_count_irrelevant]"
        }
      ]
    },
    "source_equivalence": {
      "status": "independent_complete_source",
      "merged_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fourth/mu-rong.svg"
  },
  {
    "id": "yxs.adapted.base.hero.shi-qian",
    "name": "时迁",
    "max_hp": 3,
    "skill_name": "轻敏/飞贼/神偷",
    "skill_desc": "轻敏：不能被选择为探囊取物目标；飞贼：忽略探囊取物距离上限；神偷：材料按探囊取物使用，走无懈和手/装/判区域获得流程",
    "faction": "民",
    "gender": "male",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "时迁",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304257.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63902.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_shiqian",
    "source_record_id": "yxs-mobile:article:304257",
    "legacy_source_ids": [
      "yxs_shiqian"
    ],
    "adaptation_notes": "完整三技能分别注册；探囊取物在本作对应保留来源谱系的顺手牵羊。神偷只消耗梅花手牌，允许任意其他合法角色包含队友，轻敏在付费前禁止目标；原创同名角色改显示名为掠影并保留旧ID。 与旧江湖3血时迁的完整三项能力等效，合并保留正式时迁；旧江湖ID/飞贼入口归一至完整来源规则，不额外保留掠影选项，原创不计官方来源身份。",
    "aliases": [
      "旧江湖时迁",
      "江湖时迁",
      "掠影"
    ],
    "source_id_aliases": [],
    "full_source_signature": {
      "max_hp": 3,
      "skills": [
        {
          "name": "轻敏",
          "signature": "PROHIBIT_TARGET[card.semantic=YXS_TANNANG; target=self]"
        },
        {
          "name": "飞贼",
          "signature": "IGNORE_DISTANCE[card.semantic=YXS_TANNANG; user=self]"
        },
        {
          "name": "神偷",
          "signature": "CONVERT[cost=1 CLUB card in H; into=YXS_TANNANG; window=OWN_PLAY; quota=none; preserve_physical=true]"
        }
      ]
    },
    "source_equivalence": {
      "status": "verified_original_complete_signature",
      "max_hp": 3,
      "intrinsic": [
        "snatch_target_prohibition",
        "snatch_ignore_distance",
        "club_hand_to_snatch_no_intrinsic_quota"
      ],
      "merged_original_ids": [
        "jianghu.classic.hero.shi-qian"
      ],
      "original_is_not_official_source_identity": true,
      "independent_verification": "fourth-independent-audit: original described full three capabilities, shared target/provenance adapter defects are corrected by source implementation"
    },
    "portrait_path": "./portraits-yxs-fourth/shi-qian.svg",
    "merged_original_ids": [
      "jianghu.classic.hero.shi-qian"
    ]
  },
  {
    "id": "yxs.adapted.base.hero.chen-yuan-yuan",
    "name": "陈圆圆",
    "max_hp": 3,
    "skill_name": "红颜/楚楚",
    "skill_desc": "红颜：使两名男性进行不允许无懈抵消的决斗；不交足所需杀者受到另一方1点伤害；陈圆圆不自动成为伤害来源；楚楚：可从牌堆摸1张",
    "faction": "民",
    "gender": "female",
    "gender_provenance": "jianghu-biographical-adaptation:2026-10-15",
    "gender_official_field_verified": false,
    "source_variant": "yxs-mobile-historical:2015+official-hp:2012",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "英雄杀",
    "source_character_name": "陈圆圆",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304251.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63906.shtml"
    ],
    "source_date": "2015",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs_chenyuanyuan",
    "source_record_id": "yxs-mobile:article:304251",
    "legacy_source_ids": [
      "yxs_chenyuanyuan"
    ],
    "adaptation_notes": "红颜由陈圆圆弃1张手牌或装备，按先后选两名其他男性，后选男性向先选男性发起无实体决斗，不能无懈；楚楚在真正结束阶段可摸1。规则性别为江湖传记适配，2026客户端未逐项认证。",
    "aliases": [],
    "source_id_aliases": [],
    "full_source_signature": {
      "max_hp": 3,
      "skills": [
        {
          "name": "红颜",
          "signature": "FORCED_DUEL[cost=1 H|E; phase=OWN_PLAY; quota=1/turn; ordered_targets=2 distinct living males; first_target=first_responder; damage_source=winning_participant; nullifiable=false]"
        },
        {
          "name": "楚楚",
          "signature": "END_PHASE_DRAW[owner_turn_only; amount=1; optional_as_source_can; after_discard=true]"
        }
      ]
    },
    "source_equivalence": {
      "status": "independent_complete_source",
      "merged_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fourth/chen-yuan-yuan.svg"
  }
];
export const YXS_FOURTH_HEROES=Object.freeze(yxsFourthDefinitions.map(sourceMergedHero));
// Complete source hero tied to outside-deck derived equipment.
const derivedHeroDefinitions=[
  {
    "id": "sgs.mobile.base.hero.liu-ye",
    "name": "刘晔",
    "max_hp": 3,
    "skill_name": "破橹/筹略",
    "skill_desc": "破橹：回合开始从场外、牌堆或弃牌堆取得唯一霹雳车并使用；每受1点伤害后若未装备霹雳车，摸1并随机取得牌堆武器使用。筹略：出牌阶段开始可请另一角色交牌，成功后视为使用最后对自己造成伤害的非延时牌。",
    "gender": "male",
    "gender_provenance": "mobile-specific-secondary-metadata",
    "gender_official_field_verified": false,
    "faction": "魏",
    "source_variant": "sgs-mobile-identity:2021-08-03-official-update",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_label": "三国杀",
    "source_character_name": "刘晔",
    "source_coverage": true,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-306.html",
      "https://www.sanguosha.cn/pc/news-detail-1051.html",
      "https://wiki.biligame.com/msgs/刘晔",
      "https://www.taptap.cn/moment/175933234947820060",
      "https://wiki.biligame.com/msgs/霹雳车"
    ],
    "source_date": "2021-08-03",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "sgs.mobile.liuye.20210803",
    "legacy_source_ids": [
      "sgs.mobile.liuye.20210803"
    ],
    "aliases": [],
    "source_id_aliases": [],
    "adaptation_notes": "采用2021-08-03官方技改破橹和新版霹雳车，不用旧官网破橹覆盖新版。3体力由移动版专门二手资料交叉；未亲测当前客户端。破橹伤害先完整救援再逐点重检，随机武器仅查当前牌堆并用可回放RNG；筹略保留记录牌规则和杀属性，合法目标由刘晔选，不耗正常杀次数且不免距离。",
    "source_equivalence": {
      "status": "independent_complete_source",
      "merged_source_ids": []
    },
    "derived_equipment_ids": [
      "sgs_piliche"
    ],
    "portrait_path": "./portraits-yxs-fourth/liu-ye.svg"
  }
];
export const DERIVED_HEROES=Object.freeze(derivedHeroDefinitions.map(sourceMergedHero));
const yxsFifthDefinitions=[
  {
    "id": "yxs.adapted.base.hero.li-kui",
    "name": "李逵",
    "display_name": "李逵",
    "max_hp": 4,
    "skill_name": "复仇",
    "skill_desc": "复仇：最终判定非红桃时，由来源选弃2张手牌或受到李逵造成的1点普通伤害；不足2手牌不能选择弃牌",
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-rulings-2026-10-15",
    "faction": "民",
    "gender": "male",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304252.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63901.shtml"
    ],
    "source_date": "2015-02-03 22:12:05",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs-mobile:article:304252",
    "legacy_source_ids": [
      "yxs-mobile:article:304252"
    ],
    "aliases": [
      "夏侯惇",
      "三国杀基础夏侯惇",
      "刚烈"
    ],
    "source_id_aliases": [
      "sgs.adapted.base.hero.xia-hou-dun"
    ],
    "source_identity_context": {
      "faction": "民",
      "lord_skill_from_shared_mode": "救援",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_notes": "“掉血”在此为伤害，反伤同样为有来源伤害；不能调用lose_hp。 纯体力流失、0伤害、不存在有效来源不触发；本人获救后才触发。来源已死亡无可处分目标时结束；跨作自伤事件若本人仍存活，来源可为本人，依同一伤害事件流程处理，不应硬加“其他角色”。 与SGS基础夏侯惇刚烈内在全技能及HP强等价候选，统一共享伤害契约后优先李逵。保留两游戏来源身份映射，不以民/魏共享模式区别否决合并。 与三国杀基础夏侯惇4体力、刚烈完整内在机制相同，依用户规则合并保留李逵；夏侯惇/刚烈保留可检索来源别名。民/魏阵营与模式主公授予分别保存，不作为个人技能差异。",
    "source_equivalence": {
      "status": "complete_intrinsic_signature_equal_independently_reviewed",
      "compared_id": "sgs.adapted.base.hero.xia-hou-dun",
      "intrinsic": {
        "max_hp": 4,
        "full_skill_count": 1,
        "timing": "after_positive_damage_event_after_rescue",
        "activation": "optional",
        "trigger_limit": "once_per_damage_event_not_per_point",
        "judgment": "final_suit_not_heart",
        "target": "living_damage_source_including_self",
        "source_choice": {
          "discard": {
            "count": 2,
            "zones": [
              "hand"
            ],
            "atomic": true
          },
          "damage": {
            "amount": 1,
            "source": "skill_owner",
            "nature": "normal"
          }
        },
        "independent_skill_quota": null
      },
      "shared_card_rule_adaptation": {
        "base_damage_rescue_judgment": "shared_engine",
        "faction_and_lord_mode_grants_not_intrinsic": true
      },
      "review": "docs/yxs-fifth/INDEPENDENT-AUDIT.md"
    },
    "portrait_path": "./portraits-yxs-fifth/li-kui.svg",
    "merged_identity_contexts": [
      {
        "source_id": "sgs.adapted.base.hero.xia-hou-dun",
        "faction": "魏",
        "personal_lord_skills": [],
        "mode_grants_not_intrinsic": true
      }
    ]
  },
  {
    "id": "yxs.adapted.base.hero.yu-ji",
    "name": "虞姬",
    "display_name": "虞姬",
    "max_hp": 3,
    "skill_name": "舍身/诀别",
    "skill_desc": "舍身：按受到的伤害点数逐点提供机会；每次仅分配本次新取2张，不可混入原手牌；可2给一人、1+1、1留1送或全留；诀别：确认后锁定不救援并结算本人阵亡；H+E实体牌全部加入该男性手牌，J实体牌移入该男性判定区；同类延时牌重复的本人J直接弃掉",
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-rulings-2026-10-15",
    "faction": "臣",
    "gender": "female",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304247.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63841.shtml"
    ],
    "source_date": "2015-02-03 21:59:22",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs-mobile:article:304247",
    "legacy_source_ids": [
      "yxs-mobile:article:304247"
    ],
    "aliases": [],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "臣",
      "lord_skill_from_shared_mode": "护主",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_notes": "舍身绑定伤害事件，不把SGS苦肉或原创主动失血也当受伤；原文“每掉1点血”未单独定义跨作HP_LOSS，因此这是本作明确兼容边界。 诀别确认须在任何自动自救和第三者濒死技能之前；放弃包括江湖桃/酒及技能转药在内的所有普通救援。 J移动保持原物理牌、转换后的延时效果身份与来源；按标准化effect_id查重复，不能只看实体素材名；转移不视为使用，不重走距离/控局/魅惑目标宣告。 先冻结遗赠快照并移动H/E/J，后做普通死亡清理、奖励及胜负；其他死亡得牌技能只见剩余牌；若赠与已消失目标则该份弃置，不复制牌。死亡装备移出不触发死者回血或摸牌。 诀别是虞姬本人第二技能，不是全体角色的死亡分牌系统；3v3无主公技仍保留诀别。",
    "source_equivalence": {
      "status": "independent_complete_source",
      "intrinsic_signature": [
        "AFTER_DAMAGE_POINT(optional); DRAW2_INTO_OWN_HAND; DISTRIBUTE_SUBSET_OF_THIS_DRAW_TO_ANY_ALIVE; DYING_RESOLVES_FIRST",
        "DYING_ENTRY(optional,target=ALIVE_MALE); WAIVE_ALL_RESCUE; ON_DEATH TRANSFER(H+E -> target.H, J -> target.J unless duplicate then discard)"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fifth/yu-ji.svg"
  },
  {
    "id": "yxs.adapted.base.hero.bao-si",
    "name": "褒姒",
    "display_name": "褒姒",
    "max_hp": 3,
    "skill_name": "治愈/烽火",
    "skill_desc": "治愈：弃牌成功后本人及该男性各回复1，均不超过各自上限；本人满血仍可发动，只对方实回；烽火：成本弃置后视为使用烽火狼烟，按行动顺序逐人进入正常无懈/杀响应/伤害流程，伤害来源为褒姒",
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-rulings-2026-10-15",
    "faction": "臣",
    "gender": "female",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304234.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63831.shtml"
    ],
    "source_date": "2015-02-03 22:48:53",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs-mobile:article:304234",
    "legacy_source_ids": [
      "yxs-mobile:article:304234"
    ],
    "aliases": [],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "臣",
      "lord_skill_from_shared_mode": "护主",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_notes": "主公杀忠臣强制弃装备不能转换为烽火；装备被拆、拿走、死亡清理也不自动发动。 烽火使用共享AOE真实全体其他存活目标和目标单独无懈；不能沿用旧单机只打敌方。以effect_id映射可复用SGS南蛮入侵，保留YXS名称/来源。 “弃置装备，视为出牌”不同于将装备牌当AOE；成本牌直接到弃牌堆，虚拟AOE默认无花色点数且无可回收物理伤害牌。 使用当前规则性别；易装后的男性花木兰可被治愈；无性/未知性别不能当男性。",
    "source_equivalence": {
      "status": "independent_complete_source",
      "intrinsic_signature": [
        "OWN_PLAY; DISCARD2_H; TARGET1_ALIVE_INJURED_MALE; HEAL(self,1)+HEAL(target,1); QUOTA=1/TURN",
        "OWN_PLAY; DISCARD1_E; VIRTUAL_USE(FENGHUO, all_other_alive); NO_ADDED_QUOTA"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-fifth/bao-si.svg"
  }
];
export const YXS_FIFTH_HEROES=Object.freeze(yxsFifthDefinitions.map(sourceMergedHero));
// Sixth historical source packet: complete personal skills, tested in the current 1v1/1v2 runtime.
// Historical source rules are integrated and independently tested; current-client scope remains unverified.
const yxsSixthDefinitions=[
  {
    "id": "yxs.adapted.base.hero.qin-qiong",
    "name": "秦琼",
    "display_name": "秦琼",
    "max_hp": 4,
    "skill_name": "反击/门神",
    "skill_desc": "反击：受到杀或决斗的直接伤害且存活/获救后，可对实际来源使用1张杀；红色反击杀禁止闪响应。门神：正常弃牌后的结束阶段可选1名存活角色，其杀/决斗目标改为自己，直到自己下次回合开始。",
    "skill_ids": [
      "yxs.fanji",
      "yxs.menshen"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-rulings-2026-10-15",
    "faction": "臣",
    "gender": "male",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "verified",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "秦琼",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304242.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63823.shtml"
    ],
    "source_date": "2015-02-03 22:48:53",
    "desktop_date": {
      "year_month": "201204",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 4,
      "official_desktop_url": "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63823.shtml",
      "mobile_explicit_numeric_hp": false,
      "secondary_crosscheck": {
        "url": "https://zh.wikipedia.org/w/index.php?title=英雄杀&oldid=80763160",
        "last_revision": "2024-02-02",
        "method": "web open read corresponding base hero row, only HP used",
        "hp": 4
      }
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs-mobile:article:304242",
    "legacy_source_ids": [
      "yxs-mobile:article:304242"
    ],
    "aliases": [
      "英雄杀秦琼",
      "秦琼·反击/门神"
    ],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "臣",
      "lord_skill_from_shared_mode": "护主",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_notes": "反击为指定来源的即时技能出杀，采用不检查主动杀距离、不计入主动杀额度的触发出杀契约；仍检查目标禁制和响应合法性。 芦叶枪2材料至少1红，秦琼反击杀即按红色；不能套SGS丈八红黑混合无色后导致反击失效。 反击结算完才触发关羽补刀；当反击实际造成杀伤害，补刀针对该反击受伤者，不先补刀打秦琼。反击不发动/未伤时仍保留原伤害事件的通常补刀判断。 先验证原声明目标，不能通过保护空城目标绕过原禁制；随后改为秦琼，不重查攻击距离，但对最终人物检查硬目标禁制/自杀非法。若重定向终点是使用者本人，则该目标分支取消不造成自己杀自己。 多目标杀在每个原目标分支分别执行门神；相同最终目标只结算一次。多个守护者按当前行动序，单个守护者对同一use_id只能重定向一次，已访问角色避免循环；不因无限循环剥夺整个技能。 任意角色包括本人时允许自守但不形成循环；守护者死亡/技能丢失立即失效，目标死亡也清除；下次本人回合入口清除，即使该回合以后被跳过。 门神覆盖共享is_sha类型家族（火、雷、血、毒等杀）和决斗，不覆盖AOE响应杀/伤害传导；反击只由直接杀/决斗伤害触发，传导kind=chain不当直接杀。 来源为2015手游和2012桌面历史资料；4体力依据官方桌面血量标记，不是手游正文的数字声明。当前1v1/1v2无身份主公模式；共享模式能力不算个人技能，未核验2026客户端全细则。",
    "source_equivalence": {
      "status": "independent_complete_source",
      "intrinsic_signature": [
        "AFTER_DAMAGE_EVENT(kind in SHA,DUEL, optional); USE1_SHA_AT_DAMAGE_SOURCE; IF RED -> NO_SHAN_RESPONSE",
        "END_PHASE(optional,1_target); UNTIL_NEXT_OWN_TURN_START redirect SHA|DUEL target=GUARDED -> SELF"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-sixth/qin-qiong.svg"
  },
  {
    "id": "yxs.adapted.base.hero.li-shi-min",
    "name": "李世民",
    "display_name": "李世民",
    "max_hp": 4,
    "skill_name": "控局",
    "skill_desc": "控局：弃牌入口手牌数不大于有效体力上限时，可跳过普通弃牌；手牌数小于上限时免疫探囊取物/釜底抽薪的目标指定，大于上限时免疫画地为牢；相等时无上述目标免疫。",
    "skill_ids": [
      "yxs.kongju"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012+explicit-jianghu-rulings-2026-10-15",
    "faction": "君",
    "gender": "male",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "verified",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "李世民",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304223.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63794.shtml"
    ],
    "source_date": "2015-02-03 22:49:08",
    "desktop_date": {
      "year_month": "201204",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 4,
      "official_desktop_url": "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201204/63794.shtml",
      "mobile_explicit_numeric_hp": false,
      "secondary_crosscheck": {
        "url": "https://zh.wikipedia.org/w/index.php?title=英雄杀&oldid=80763160",
        "last_revision": "2024-02-02",
        "method": "web open read corresponding base hero row, only HP used",
        "hp": 4
      }
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "research_source_id": "yxs-mobile:article:304223",
    "legacy_source_ids": [
      "yxs-mobile:article:304223"
    ],
    "aliases": [
      "英雄杀李世民",
      "李世民·控局"
    ],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "君",
      "lord_skill_from_shared_mode": "激将",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_notes": "冻结为弃牌阶段入口检查一次H≤MAXHP：成立则可跳过；不成立则按通常当前HP手牌上限弃足，不在中途达到MAXHP时重新跳过。 禁制按规范化牌效果身份识别；真实牌、释权虚拟釜底、神偷虚拟探囊、魅惑虚拟牢都遵守。起义/强掠/博浪锤/龙鳞刀不是上述三张牌，不被控局一概拦住。 身份主公MAXHP通常5时阈值用5；SGS及原创改上限技能也读取实时有效上限，不硬编码4。 来源为2015手游和2012桌面历史资料；4体力依据官方桌面血量标记，不是手游正文的数字声明。当前1v1/1v2无身份主公模式；共享模式能力不算个人技能，未核验2026客户端全细则。",
    "source_equivalence": {
      "status": "independent_complete_source",
      "intrinsic_signature": [
        "DISCARD_ENTRY(H<=MAXHP -> SKIP); PROHIBIT((H<MAXHP AND card∈{TANNANG,FUDI}) OR (H>MAXHP AND card=HUADI)); equality strict"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-sixth/li-shi-min.svg"
  }
];
export const YXS_SIXTH_HEROES=Object.freeze(yxsSixthDefinitions.map(sourceMergedHero));
// Seventh historical packet. Private integration preview; source/client parity is not implied.
const yxsSeventhDefinitions=[
  {
    "id": "yxs.adapted.base.hero.ren-heng-zhi",
    "name": "任恒之",
    "display_name": "任恒之",
    "max_hp": 4,
    "skill_name": "侠胆",
    "skill_desc": "侠胆：与另一有手牌角色各自暗选1手牌，双方锁定后同时亮牌拼点。赢后本回合杀总许可至少2次、至多2目标且范围无限；没赢则本回合不能使用杀，纯响应仍可。可重复，胜利不叠加，败禁令优先。",
    "skill_ids": [
      "yxs.xiadan"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012-hp+explicit-jianghu-compatibility-2026-10-15",
    "faction": "民",
    "gender": "male",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "verified",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "任恒之",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304256.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63904.shtml"
    ],
    "source_date": "2015-02-03 22:18:54",
    "desktop_date": {
      "year_month": "201204",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 4,
      "source_id": "yxs-ren-heng-zhi-desktop",
      "mobile_explicit_numeric_hp": false
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "historical_full_skill_and_own_faq_verified": true,
    "research_source_id": "yxs-mobile:article:304256",
    "legacy_source_ids": [
      "yxs-mobile:article:304256",
      "yxs.mobile.historical.hero.ren-huan-zhi"
    ],
    "aliases": [
      "任桓之",
      "英雄杀任恒之",
      "任恒之·侠胆"
    ],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "民",
      "lord_skill_from_shared_mode": "救援",
      "lord_hp_bonus_from_mode": 1,
      "not_part_of_intrinsic_signature": true,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1"
    },
    "adaptation_status": "RH1-RH9-adopted-Jianghu-compatibility",
    "adaptation_decisions": [
      {
        "id": "RH1",
        "kind": "historical_quota_unknown_explicit_proposal",
        "decision": "可重复拼点，不凭太史慈的天义补每阶段一次。胜利把本回合普通主动杀总额度提高到至少2而不是每赢再+2；任意没赢设置本回合禁用杀，后续胜利不清除禁令。",
        "basis": "官方未写技能次数，写胜败均持续本回合；重复胜败优先级是本作明示裁定，非已核验原客户端。"
      },
      {
        "id": "RH2",
        "kind": "shared_compare_transaction",
        "decision": "两名不同人物各选1H，双盲同时亮牌，记录原始点数及最终比较点数；经典本人没有+3点被动。两牌使用独立compare_id，置入processing并在结算后弃置，重复回调不能再丢一次。只在双方均有合法牌且选择锁定后提交。",
        "basis": "官方点数/不可拒绝/手牌FAQ+现代拼点弃置旁证；2015本人页没写完整弃牌流程，故处置显式适配。"
      },
      {
        "id": "RH3",
        "kind": "dont_generalize_special_card",
        "decision": "隔岸观火的保留拼点手牌特例与侠胆分开。共享拼点必须接受disposition参数；侠胆为discard、隔岸观火为retain。在侠胆中手牌实离区可触发按真实移动的技能，但拼点不是使用/打出牌。",
        "basis": "官方锦囊页的局部特例；禁止把所有拼点强制相同化。"
      },
      {
        "id": "RH4",
        "kind": "use_vs_response",
        "decision": "没赢禁止本回合以杀发起card_use，包括被借刀要求使用杀；决斗或烽火里的纯respond_sha仍可。不能用禁杀标记把本回合所有手牌杀丢弃，亦不能由虎符消除硬禁令。",
        "basis": "出牌/响应区别的共享合同；源文没有逐项枚举，明确本作解释。"
      },
      {
        "id": "RH5",
        "kind": "range_and_target_union",
        "decision": "赢只使攻击范围无限，不能让探囊等非杀距离自动无限，不能绕过归隐/空城或禁止成为目标。目标上限与合法装备取max而非相加；狼牙棒/方天类若给3目标则最多3，虎符仍能给无限杀而不是被2杀覆盖。",
        "basis": "本人FAQ明确仍触发相应武器；扩展交集按显式最大许可处理。"
      },
      {
        "id": "RH6",
        "kind": "history_not_extra_allowance",
        "decision": "先普通使用1杀再拼赢，本回合通常只剩1次主动杀；先已使用2杀再赢不刷新。每次杀可选1或2个不同合法目标，不能把2次杀解释成4个独立use。胜利多目标逐分支保持同一用牌ID，酒/毒/火雷属性按原牌保留。",
        "basis": "可以出两张而不是额外两张；共享用牌事件身份。"
      },
      {
        "id": "RH7",
        "kind": "turn_scoped_modifier_lifecycle",
        "decision": "胜败状态绑定实际turn_id和人物ID，回合结束或被中止均过期，额外出牌阶段不清。技能失去不撤销已经生成的“本回合”效果；下一新回合无论是否再拥有侠胆都先清旧状态。",
        "basis": "持续本回合的显式生存期；跨作技能转移不得形成永久禁杀。"
      },
      {
        "id": "RH8",
        "kind": "public_information_ai",
        "decision": "AI拼点选牌只能基于自己的手牌和对方公开信息，不读取对方隐藏点数。发起者可以在目标确定前取消；目标进入合法拼点后不能拒绝，用确定性合法选择代替超时，不能偷偷给赢。",
        "basis": "官方目标不得拒绝；双盲隐私合同。"
      },
      {
        "id": "RH9",
        "kind": "async_move_and_death_boundary",
        "decision": "拼点提交前两牌仍在原主人手牌且双方存活；陈旧选择回滚为未发动。正式亮牌/移牌后不可重新询问、返还或重复支付；毒牌、最后手牌等触发按牌流合同结算，若发起者死亡/对局已结束不再授予可行动窗口。",
        "basis": "跨作移动/毒卡合同；原作无异步跨作FAQ。"
      }
    ],
    "source_unknowns": [
      {
        "field": "activation_quota",
        "kind": "historical_text_omission",
        "handling": "RH1明确可重复，不称原客户端次数已核验。"
      },
      {
        "field": "repeat_win_loss_precedence",
        "kind": "unanswered_original_edge",
        "handling": "RH1不叠胜、败禁令优先。"
      },
      {
        "field": "compare_card_disposition",
        "kind": "own_page_omission",
        "handling": "RH2弃置，由现代旁证支持，禁止借隔岸观火特例偷换。"
      },
      {
        "field": "sha_use_vs_respond_after_loss",
        "kind": "unanswered_original_edge",
        "handling": "RH4明示使用禁止、纯响应允许。"
      }
    ],
    "adaptation_notes": "RH1：可重复拼点，不凭太史慈的天义补每阶段一次。胜利把本回合普通主动杀总额度提高到至少2而不是每赢再+2；任意没赢设置本回合禁用杀，后续胜利不清除禁令。 RH2：两名不同人物各选1H，双盲同时亮牌，记录原始点数及最终比较点数；经典本人没有+3点被动。两牌使用独立compare_id，置入processing并在结算后弃置，重复回调不能再丢一次。只在双方均有合法牌且选择锁定后提交。 RH3：隔岸观火的保留拼点手牌特例与侠胆分开。共享拼点必须接受disposition参数；侠胆为discard、隔岸观火为retain。在侠胆中手牌实离区可触发按真实移动的技能，但拼点不是使用/打出牌。 RH4：没赢禁止本回合以杀发起card_use，包括被借刀要求使用杀；决斗或烽火里的纯respond_sha仍可。不能用禁杀标记把本回合所有手牌杀丢弃，亦不能由虎符消除硬禁令。 RH5：赢只使攻击范围无限，不能让探囊等非杀距离自动无限，不能绕过归隐/空城或禁止成为目标。目标上限与合法装备取max而非相加；狼牙棒/方天类若给3目标则最多3，虎符仍能给无限杀而不是被2杀覆盖。 RH6：先普通使用1杀再拼赢，本回合通常只剩1次主动杀；先已使用2杀再赢不刷新。每次杀可选1或2个不同合法目标，不能把2次杀解释成4个独立use。胜利多目标逐分支保持同一用牌ID，酒/毒/火雷属性按原牌保留。 RH7：胜败状态绑定实际turn_id和人物ID，回合结束或被中止均过期，额外出牌阶段不清。技能失去不撤销已经生成的“本回合”效果；下一新回合无论是否再拥有侠胆都先清旧状态。 RH8：AI拼点选牌只能基于自己的手牌和对方公开信息，不读取对方隐藏点数。发起者可以在目标确定前取消；目标进入合法拼点后不能拒绝，用确定性合法选择代替超时，不能偷偷给赢。 RH9：拼点提交前两牌仍在原主人手牌且双方存活；陈旧选择回滚为未发动。正式亮牌/移牌后不可重新询问、返还或重复支付；毒牌、最后手牌等触发按牌流合同结算，若发起者死亡/对局已结束不再授予可行动窗口。 来源为2015手游与2012桌面历史资料；4体力依据官方桌面血量标记。当前1v1/1v2无身份主公模式，未核验2026当前客户端全部细则。",
    "source_equivalence": {
      "status": "independent_complete_historical_source_with_explicit_compatibility",
      "intrinsic_signature": [
        "PLAY; PINDIAN_1H_VS_1H; SELF_WIN -> TURN(RANGE_INF,SHA_ALLOWANCE_FLOOR2,TARGET_CAP_FLOOR2); SELF_NOT_WIN -> TURN(PROHIBIT_SHA_USE); NO_SOURCE_QUOTA"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-seventh/ren-heng-zhi.svg"
  },
  {
    "id": "yxs.adapted.base.hero.wu-ze-tian",
    "name": "武则天",
    "display_name": "武则天",
    "max_hp": 4,
    "skill_name": "迁都/女权",
    "skill_desc": "迁都：出牌阶段弃2张有效黑色手牌，与任意存活角色交换座位；可重复，自选照付成本但不换位。女权：男性不能对自己使用决斗；自己对男性发起决斗，对方每轮须连续响应2张杀。",
    "skill_ids": [
      "yxs.qiandu",
      "yxs.nvquan"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012-hp+explicit-jianghu-compatibility-2026-10-15",
    "faction": "君",
    "gender": "female",
    "gender_provenance": "dated-source-and-biographical-crosscheck",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "verified",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "武则天",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304231.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59694.shtml"
    ],
    "source_date": "2015-02-03 22:49:07",
    "desktop_date": {
      "year_month": "201203",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 4,
      "official_desktop_url": "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59694.shtml",
      "mobile_explicit_numeric_hp": false,
      "secondary_crosscheck": {
        "url": "https://zh.wikipedia.org/w/index.php?title=英雄杀&oldid=80763160",
        "last_revision": "2024-02-02",
        "method": "web open read corresponding base hero row, only HP used",
        "hp": 4
      }
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "full_skillset_verified": true,
    "historical_full_skill_and_own_faq_verified": true,
    "research_source_id": "yxs-mobile:article:304231",
    "legacy_source_ids": [
      "yxs-mobile:article:304231"
    ],
    "aliases": [
      "英雄杀武则天",
      "武则天·迁都/女权"
    ],
    "source_id_aliases": [],
    "source_identity_context": {
      "faction": "君",
      "lord_skill_from_shared_mode": "激将",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_status": "WZ1-WZ8-adopted-Jianghu-compatibility",
    "adaptation_decisions": [
      {
        "id": "WZ1",
        "kind": "source_literal_edge_decision",
        "decision": "原文任意存活角色未排除本人：允许选自己消耗2黑H后座次不变。UI可以标注“不会换位”，不能暗加other-only限制并称官方规则。",
        "basis": "严格保留任意存活角色；当前客户端自选可用性未核验。"
      },
      {
        "id": "WZ2",
        "kind": "shared_response_adaptation",
        "decision": "与项羽霸王等要求叠加时取max，不相乘；本人对项羽决斗时双方各需2杀，不是4。女权只按原始duel_user/duel_origin判本人主动决斗，不由当前响应方向推断。",
        "basis": "独立双杀需求是1轮需要数；跨作多技能并存统一规则。"
      },
      {
        "id": "WZ3",
        "kind": "shared_seat_adaptation",
        "decision": "即时距离/之后新建求药、改判和AOE队列用新座序；已开始的原子结算队列保留快照，避免换位让同一目标重复/漏结算。主公/控制权不随座位索引转移。",
        "basis": "官方明确换位改变后续行动顺序；跨作中途换位队列为本作一致决定。"
      },
      {
        "id": "WZ4",
        "kind": "shared_duel_adaptation",
        "decision": "女权查询当前规则性别与实际决斗发起者；花木兰易装为男性后可以成为武则天双杀目标，却不能直接易装仍为女性的武则天。若跨作其他技能给男性女权，再按同一禁制处理。",
        "basis": "性别和技能拥有权分离，不能把未合法获得的女权当作原作易装案例。"
      },
      {
        "id": "WZ5",
        "kind": "counterclockwise_ring_contract",
        "decision": "常规轮转模式保存一个具有明确逆时针语义的座位环。交换人物占位不旋转控制者，当前人物继续原回合；回合完毕从其新位置取逆时针下一存活者。1v1可能只有显示位置变化；1v2可使旧下家暂被跳过。",
        "basis": "本人官方FAQ；不能只交换头像。"
      },
      {
        "id": "WZ6",
        "kind": "shared_modes_not_fake_completion",
        "decision": "竞技3v3使用队伍行动权，不凭迁都FAQ把它改成通常座位循环。现有1v1/1v2采用统一轮转可实现；未来身份/竞技/国战必须各自接模式调度，保持未实现模式状态。",
        "basis": "官方共享模式页明示竞技调度，与当前模式隔离。"
      },
      {
        "id": "WZ7",
        "kind": "cost_and_duel_response_contract",
        "decision": "迁都两黑手牌同批支付，颜色用当前有效颜色；若代价导致死亡不换位。女权每轮2杀必须逐张响应并分别结算手牌离区触发，不要求最初就手握2杀；第一张已经成功响应不会因第二张缺失而回滚。",
        "basis": "两牌成本原子性与连续响应区别；跨作强运等允许在第一张后补牌。"
      },
      {
        "id": "WZ8",
        "kind": "redirection_hard_target_prohibition",
        "decision": "男性发起决斗若被门神等重定向到拥有女权的角色，最终硬禁制仍有效，取消该目标分支；不能因为未直接点击武则天而绕过。女权双杀依据持有者自己为决斗发起者，不因反向响应或伤害来源更新而误开启。",
        "basis": "原作未逐条写多门神/跨作复制边界；采用统一目标声明/最终禁制合同。"
      }
    ],
    "source_unknowns": [
      {
        "field": "qiandu_self_target",
        "kind": "historical_text_ambiguity",
        "handling": "WZ1按任意存活角色保留自选无位移成本分支；未实测客户端按钮。"
      },
      {
        "field": "qiandu_quota",
        "kind": "historical_text_omission",
        "handling": "不增添源文未写的回合次数上限；同回合再次满足成本可重复，属显式文字适配。"
      },
      {
        "field": "mid_resolution_seat_queue",
        "kind": "crossgame_has_no_official_FAQ",
        "handling": "WZ3队列快照，不重排已开始结算；新建队列按新座位。"
      }
    ],
    "adaptation_notes": "WZ1：原文任意存活角色未排除本人：允许选自己消耗2黑H后座次不变。UI可以标注“不会换位”，不能暗加other-only限制并称官方规则。 WZ2：与项羽霸王等要求叠加时取max，不相乘；本人对项羽决斗时双方各需2杀，不是4。女权只按原始duel_user/duel_origin判本人主动决斗，不由当前响应方向推断。 WZ3：即时距离/之后新建求药、改判和AOE队列用新座序；已开始的原子结算队列保留快照，避免换位让同一目标重复/漏结算。主公/控制权不随座位索引转移。 WZ4：女权查询当前规则性别与实际决斗发起者；花木兰易装为男性后可以成为武则天双杀目标，却不能直接易装仍为女性的武则天。若跨作其他技能给男性女权，再按同一禁制处理。 WZ5：常规轮转模式保存一个具有明确逆时针语义的座位环。交换人物占位不旋转控制者，当前人物继续原回合；回合完毕从其新位置取逆时针下一存活者。1v1可能只有显示位置变化；1v2可使旧下家暂被跳过。 WZ6：竞技3v3使用队伍行动权，不凭迁都FAQ把它改成通常座位循环。现有1v1/1v2采用统一轮转可实现；未来身份/竞技/国战必须各自接模式调度，保持未实现模式状态。 WZ7：迁都两黑手牌同批支付，颜色用当前有效颜色；若代价导致死亡不换位。女权每轮2杀必须逐张响应并分别结算手牌离区触发，不要求最初就手握2杀；第一张已经成功响应不会因第二张缺失而回滚。 WZ8：男性发起决斗若被门神等重定向到拥有女权的角色，最终硬禁制仍有效，取消该目标分支；不能因为未直接点击武则天而绕过。女权双杀依据持有者自己为决斗发起者，不因反向响应或伤害来源更新而误开启。 来源为2015手游与2012桌面历史资料；4体力依据官方桌面血量标记。当前1v1/1v2无身份主公模式，未核验2026当前客户端全部细则。",
    "source_equivalence": {
      "status": "independent_complete_historical_source_with_explicit_compatibility",
      "intrinsic_signature": [
        "OWN_PLAY; DISCARD2_BLACK_H; SWAP_SEATS(self,alive_target); CONTINUE_CURRENT_TURN; next=successor(new_seat); no_added_quota",
        "PROHIBIT(DUEL user.MALE -> SELF); OWN_INITIATED_DUEL opponent.MALE -> REQUIRED_SHA=2 EACH_EXCHANGE"
      ],
      "candidate_source_ids": []
    },
    "portrait_path": "./portraits-yxs-seventh/wu-ze-tian.svg"
  }
];
export const YXS_SEVENTH_HEROES=Object.freeze(yxsSeventhDefinitions.map(sourceMergedHero));
// Eighth historical packet: full skill replacement, explicitly adopted HM1–HM12.
// Full production integration is covered by the eighth-packet acceptance suite.
const yxsEighthDefinitions=[
  {
    "id": "yxs.adapted.base.hero.hua-mu-lan",
    "name": "花木兰",
    "display_name": "花木兰",
    "max_hp": 3,
    "skill_name": "迷离/易装",
    "skill_desc": "迷离：每张装备实际离开装备区后自动摸2张，忠臣处罚与死亡清理除外。易装：出牌阶段弃2张手牌，改为本局已阵亡男性英雄的完整固有技能、模板体力上限与男性规则性别；保留人物身份和队伍，上限增加不回血。",
    "skill_ids": [
      "yxs.mili",
      "yxs.yizhuang"
    ],
    "source_variant": "historical-mobile-2015+official-desktop-2012-hp+explicit-jianghu-compatibility-2026-10-15",
    "faction": "臣",
    "gender": "female",
    "gender_provenance": "historical-source-biographical-template;transformation-gender-explicit-own-FAQ",
    "source_status": "verified",
    "implementation_status": "tested",
    "production_integration_status": "tested",
    "source_game": "英雄杀",
    "source_label": "英雄杀手游历史来源",
    "source_character_name": "花木兰",
    "source_coverage": true,
    "source_urls": [
      "https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11668/m9012/201502/304239.shtml",
      "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63830.shtml"
    ],
    "source_date": "2015-02-03 22:48:53",
    "desktop_date": {
      "year_month": "201204",
      "date_basis": "URL archive year/month; no exact publication day displayed"
    },
    "hp_evidence": {
      "official_desktop_blood_span_count": 3,
      "official_desktop_url": "https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1701/m1622/201204/63830.shtml",
      "mobile_explicit_numeric_hp": false,
      "secondary_crosscheck": {
        "url": "https://zh.wikipedia.org/w/index.php?title=英雄杀&oldid=80763160",
        "last_revision": "2024-02-02",
        "method": "web open read corresponding base hero row, only HP used",
        "hp": 3
      }
    },
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_only_exact_for_every_edge": false,
    "historical_core_rules_verified": true,
    "historical_full_skill_and_own_faq_verified": true,
    "research_source_id": "yxs.mobile.historical.hero.hua-mu-lan",
    "legacy_source_ids": [
      "yxs.mobile.historical.hero.hua-mu-lan"
    ],
    "source_record_id": "yxs-mobile:article:304239",
    "source_ids": [
      "yxs-hua-mu-lan-mobile",
      "yxs-hua-mu-lan-desktop"
    ],
    "aliases": [
      "英雄杀花木兰",
      "花木兰·迷离/易装"
    ],
    "source_identity_context": {
      "faction": "臣",
      "lord_skill_from_shared_mode": "护主",
      "lord_hp_bonus_from_mode": 1,
      "mode_reference": "https://yxs.qq.com/web201202/rule.shtml?1",
      "not_part_of_intrinsic_signature": true
    },
    "adaptation_decisions": [
      {
        "id": "HM1",
        "kind": "official_exception",
        "decision": "主公花木兰击杀忠臣的H/E全弃不触发迷离；死亡清理时不让死者抽牌。",
        "basis": "本人FAQ明确忠臣处罚；一般存活技能执行规则。"
      },
      {
        "id": "HM2",
        "kind": "shared_maxhp_adaptation",
        "decision": "复制目标的英雄固有血量模板，再叠本人仍适用的身份模式加成；不复制目标临时增减上限或其主公身份加成。当前HP=min(旧HP,新MAXHP)，上限变大不回血。",
        "basis": "技能说英雄上限，不说获得其角色身份；主公/临时改上限与跨作继承边界明确化。"
      },
      {
        "id": "HM3",
        "kind": "shared_identity_adaptation",
        "decision": "保留花木兰稳定来源身份ID和个人控制权，另存变身形态id、完整技能快照、当前性别/有效MAXHP；不能直接把player.hero换成阵亡对象实例而改阵营或混用共享状态。",
        "basis": "本人FAQ明确阵营不改、性别改男。"
      },
      {
        "id": "HM4",
        "kind": "crossgame_skill_transfer",
        "decision": "可以复制已阵亡SGS/原创男性的已实现完整技能组，保留其个人固有主公技能定义，但只由当前模式和本人身份决定是否激活；共享君臣民主公机制仍由本人保留的臣阵营决定。",
        "basis": "原作无跨游戏场景，本作一致兼容；不得因为难实现而只拷被动技。"
      },
      {
        "id": "HM5",
        "kind": "crossgame_state_transfer",
        "decision": "不继承死者已经消耗的牌、标记或回合统计。新技能局内限制状态按技能新获得规则初始化；本回合杀使用历史与其他共享历史保留。涉及初始化奖励/限定技的未实现来源应标缺机制，不能无声给空技能。",
        "basis": "skill ownership 与 player history 分离；适配声明而非现行官方裁定。"
      },
      {
        "id": "HM6",
        "kind": "equipment_event_order",
        "decision": "装备离区提交->装备自身离区效果->迷离每牌摸2->继续父效果；同批多件按稳定槽序。强制忠臣处罚用显式reason标志而非中文字符串碰运气。",
        "basis": "立即摸牌及既有destination-first框架；跨作同时序固定决定。"
      },
      {
        "id": "HM7",
        "kind": "source_gap_explicit_proposal",
        "decision": "本批采用沿历史被动技实现自动每装备摸2，不额外提供放弃按钮。仅为对“能马上”的明确解释；官方已读FAQ没有锁定/可拒绝细则，不能称已实测。摸毒是跨作机制，照统一摸牌替代/私有选择处理。",
        "basis": "原文被动技分类；避免无声改变第五批默认。"
      },
      {
        "id": "HM8",
        "kind": "skill_acquisition_lifecycle",
        "decision": "易装两手牌先按旧技能快照原子弃置并结算该移动已有触发，再切换角色技能。新获强运不得追溯观察成本：即使用最后两手牌变朱元璋也不额外摸2。只向新技能派发skill_acquired，不重播game_start、damage或cards_moved。",
        "basis": "官方强运事件语义+两家次级FAQ，跨作新技能生命周期明示适配。"
      },
      {
        "id": "HM9",
        "kind": "crossgame_dead_snapshot",
        "decision": "死亡档案保存本局该角色死亡时的有效英雄形态、完整固有技能模板、模板HP和规则性别。只选目前仍阵亡且快照为男性的已出场人物；不因同名去重丢失别名。复制模板而非活体对象/已消耗状态；不复制其临时借用/装备/模式赋予技能。未知或未实现模板必须显式说明缺口，不能作为空技能成功。",
        "basis": "“本局阵亡男性英雄”与完整技能约束；原作没有跨作或多次复活形态FAQ。"
      },
      {
        "id": "HM10",
        "kind": "crossgame_skill_ownership",
        "decision": "技能替换移除本人当前所有人物来源技能（固有及人物临时获得），保留装备来源和模式来源技能；持久效果按各技能失去合同清理，例如门神立即结束；不把原英雄的主动次数共享给死者。本人本回合杀历史保留。",
        "basis": "所有技能的历史语境指英雄技能；跨作技能来源明确化。"
      },
      {
        "id": "HM11",
        "kind": "crossgame_cost_interrupt",
        "decision": "两手牌成本引起毒/HP流失时先完整求药。本人死亡或对局结束不继续变身，成本已经提交不返还；陈旧/非法选择在提交前不扣牌。若获救且仍符合技能和阶段则继续。",
        "basis": "现有异步事务约束；原作没有毒成本FAQ。"
      },
      {
        "id": "HM12",
        "kind": "dying_is_not_dead",
        "decision": "人物HP<=0但尚在濒死流程时仍可执行迷离；死亡已经确认后的装备清理不触发。不能用HP>0代替alive状态。失装自带离区效果、迷离和后续父效果顺序使用全局稳定规则。",
        "basis": "次级霸王弓/濒死FAQ作佐证；跨作时序明示。"
      }
    ],
    "source_unknowns": [
      {
        "field": "mili_decline",
        "kind": "historical_text_ambiguity",
        "handling": "HM7自动触发是显式江湖兼容，未伪装成官方锁定技或当前客户端实测。"
      },
      {
        "field": "mode_bonus_and_temporary_maxhp_copy",
        "kind": "unanswered_original_edge",
        "handling": "HM2固定模板+本人模式加成；不复制死者主公与临时上限。"
      },
      {
        "field": "crossgame_acquired_limited_awaken_state",
        "kind": "crossgame_has_no_official_FAQ",
        "handling": "HM5/HM8-HM11给出有限、可实现生命周期合同；不能为等不到跨作FAQ而全局停工。"
      }
    ],
    "adaptation_notes": "HM1：主公花木兰击杀忠臣的H/E全弃不触发迷离；死亡清理时不让死者抽牌。 HM2：复制目标的英雄固有血量模板，再叠本人仍适用的身份模式加成；不复制目标临时增减上限或其主公身份加成。当前HP=min(旧HP,新MAXHP)，上限变大不回血。 HM3：保留花木兰稳定来源身份ID和个人控制权，另存变身形态id、完整技能快照、当前性别/有效MAXHP；不能直接把player.hero换成阵亡对象实例而改阵营或混用共享状态。 HM4：可以复制已阵亡SGS/原创男性的已实现完整技能组，保留其个人固有主公技能定义，但只由当前模式和本人身份决定是否激活；共享君臣民主公机制仍由本人保留的臣阵营决定。 HM5：不继承死者已经消耗的牌、标记或回合统计。新技能局内限制状态按技能新获得规则初始化；本回合杀使用历史与其他共享历史保留。涉及初始化奖励/限定技的未实现来源应标缺机制，不能无声给空技能。 HM6：装备离区提交->装备自身离区效果->迷离每牌摸2->继续父效果；同批多件按稳定槽序。强制忠臣处罚用显式reason标志而非中文字符串碰运气。 HM7：本批采用沿历史被动技实现自动每装备摸2，不额外提供放弃按钮。仅为对“能马上”的明确解释；官方已读FAQ没有锁定/可拒绝细则，不能称已实测。摸毒是跨作机制，照统一摸牌替代/私有选择处理。 HM8：易装两手牌先按旧技能快照原子弃置并结算该移动已有触发，再切换角色技能。新获强运不得追溯观察成本：即使用最后两手牌变朱元璋也不额外摸2。只向新技能派发skill_acquired，不重播game_start、damage或cards_moved。 HM9：死亡档案保存本局该角色死亡时的有效英雄形态、完整固有技能模板、模板HP和规则性别。只选目前仍阵亡且快照为男性的已出场人物；不因同名去重丢失别名。复制模板而非活体对象/已消耗状态；不复制其临时借用/装备/模式赋予技能。未知或未实现模板必须显式说明缺口，不能作为空技能成功。 HM10：技能替换移除本人当前所有人物来源技能（固有及人物临时获得），保留装备来源和模式来源技能；持久效果按各技能失去合同清理，例如门神立即结束；不把原英雄的主动次数共享给死者。本人本回合杀历史保留。 HM11：两手牌成本引起毒/HP流失时先完整求药。本人死亡或对局结束不继续变身，成本已经提交不返还；陈旧/非法选择在提交前不扣牌。若获救且仍符合技能和阶段则继续。 HM12：人物HP<=0但尚在濒死流程时仍可执行迷离；死亡已经确认后的装备清理不触发。不能用HP>0代替alive状态。失装自带离区效果、迷离和后续父效果顺序使用全局稳定规则。 HM1–HM12为明示江湖兼容；来源为2015手游与2012桌面历史资料，未核验2026当前客户端全部细则。当前1v1/1v2不授予身份模式主公加成。",
    "source_equivalence": {
      "status": "independent_complete_historical_source_with_explicit_compatibility",
      "intrinsic_signature": [
        "EQUIPMENT_LEAVE_PER_CARD -> DRAW2; EXCLUDE_LORD_KILLS_LOYALIST_PENALTY",
        "OWN_PLAY; DISCARD2_H; DEAD_MALE_HERO_FROM_THIS_GAME; REPLACE_ALL_INTRINSIC_SKILLS; SET_HERO_MAXHP; SET_GENDER_MALE; PRESERVE_FACTION_AND_PLAYER_ID"
      ],
      "candidate_source_ids": [],
      "distinct_from": [
        "jianghu.classic.hero.hua-mu-lan",
        "sgs.hero.sun-shang-xiang"
      ]
    },
    "portrait_path": "./portraits-yxs-eighth/hua-mu-lan.svg"
  }
];
export const YXS_EIGHTH_HEROES=Object.freeze(yxsEighthDefinitions.map(sourceMergedHero));
export const YXS_NINTH_HEROES=Object.freeze(YXS_NINTH_DEFINITIONS.map(sourceMergedHero));
export const SGS_LINGCAO_HEROES=Object.freeze(SGS_LINGCAO_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-future-identity/ling-cao.svg'})));
export const SGS_SUNRU_HEROES=Object.freeze(SGS_SUNRU_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-future-identity/sun-ru.svg'})));
export const SGS_YUEJIN_HEROES=Object.freeze(SGS_YUEJIN_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-future-identity/yue-jin.svg'})));
export const SGS_PANZHANGMAZHONG_HEROES=Object.freeze(SGS_PANZHANGMAZHONG_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-confirmed-support/pan-zhang-ma-zhong.svg'})));
export const SGS_CAOANG_HEROES=Object.freeze(SGS_CAOANG_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-confirmed-support/cao-ang.svg'})));
export const SGS_CAOXIU_HEROES=Object.freeze(SGS_CAOXIU_DEFINITIONS.map(d=>sourceMergedHero({...d,current_client_verified:false,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-obligation-identity/cao-xiu.svg'})));
export const SGS_CHENLIN_HEROES=Object.freeze(SGS_CHENLIN_DEFINITIONS.map(d=>sourceMergedHero({...d,source_coverage:true,implementation_status:'tested',runtime_validation_status:'passed',portrait_path:'./portraits-sgs-obligation-identity/chen-lin.svg'})));
export const SGS_MANCHONG_HEROES=Object.freeze(SGS_MANCHONG_DEFINITIONS.map(d=>sourceMergedHero({...d,implementation_status:'tested',source_coverage:true,runtime_validation_status:'passed',portrait_path:'./portraits-sgs-identity-next/man-chong.svg',adaptation_notes:'经典身份满宠完整峻刑、御策。H0满体力开局；H1–H7采用共享原子费用、真实翻面、伤害后救援、私有付款和复制额度规则。御策使用实际伤害来源；无来源不发动。已核所列来源，未实测2026当前移动客户端。'})));
export const SGS_LIRU_HEROES=Object.freeze(SGS_LIRU_DEFINITIONS.map(d=>sourceMergedHero({...d,source_status:'verified',implementation_status:'tested',source_coverage:true,runtime_validation_status:'passed',portrait_path:'./portraits-sgs-identity-next/li-ru.svg',adaptation_notes:'采用2015-12-01移动版历史调整：绝策结束阶段选空手他人，灭计只选有手牌他人，焚城按发动时上家实际弃牌数递增。H0满体力开局；H8已提交队列在来源死亡或失技后继续，来源死亡后伤害无来源但保留因果记录，对局终局停止。未认证2026当前客户端或其他改版。'})));
export const SGS_ZHANGFEN_HEROES=Object.freeze(SGS_ZHANGFEN_DEFINITIONS.map(sourceMergedHero));
export const YXS_MODERN_HEROES=Object.freeze(YXS_MODERN_DEFINITIONS.map(sourceMergedHero));
export const SGS_FOLLOWUP_HEROES=Object.freeze(SGS_FOLLOWUP_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_FURTHER_HEROES=Object.freeze(SGS_YIJIANG_FURTHER_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_MORE_HEROES=Object.freeze(SGS_YIJIANG_MORE_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_LATER_HEROES=Object.freeze(SGS_YIJIANG_LATER_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_NEXT_HEROES=Object.freeze(SGS_YIJIANG_NEXT_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_FOLLOWING_HEROES=Object.freeze(SGS_YIJIANG_FOLLOWING_DEFINITIONS.map(sourceMergedHero));
export const SGS_YIJIANG_HEROES=Object.freeze(SGS_YIJIANG_DEFINITIONS.map(sourceMergedHero));
export const SGS_MOUNTAIN_HEROES=Object.freeze(SGS_MOUNTAIN_DEFINITIONS.map(sourceMergedHero));
export const SGS_FOREST_HEROES=Object.freeze(SGS_FOREST_DEFINITIONS.map(sourceMergedHero));
export const SGS_FIRE_HEROES=Object.freeze(SGS_FIRE_DEFINITIONS.map(sourceMergedHero));
export const WANGYUN_HEROES=Object.freeze(WANGYUN_DEFINITIONS.map(sourceMergedHero));
export const SGS_NEXT_IDENTITY_HEROES=Object.freeze(SGS_NEXT_IDENTITY_DEFINITIONS.map(sourceMergedHero));
export const SGS_WIND_HEROES=Object.freeze(SGS_WIND_DEFINITIONS.map(sourceMergedHero));
export const SGS_FOLLOWING_HEROES=Object.freeze(SGS_FOLLOWING_DEFINITIONS.map(sourceMergedHero));
export const SGS_BASE_NEXT_HEROES=Object.freeze(SGS_BASE_NEXT_DEFINITIONS.map(sourceMergedHero));
export const HERO_SOURCE_MERGES=Object.freeze([...YXS_FIRST_HEROES,...YXS_NEXT_HEROES,...YXS_THIRD_HEROES,...YXS_FOURTH_HEROES,...YXS_FIFTH_HEROES,...YXS_SIXTH_HEROES,...YXS_SEVENTH_HEROES,...YXS_EIGHTH_HEROES,...YXS_NINTH_HEROES].flatMap(hero=>(hero.source_id_aliases||[]).map(source_id=>Object.freeze({source_id,canonical_id:hero.id,canonical_name:hero.name,policy:'equal_hp_complete_skill_mechanism_yxs_priority'}))));
export const HERO_ORIGINAL_MERGES=Object.freeze(YXS_FOURTH_HEROES.flatMap(hero=>(hero.merged_original_ids??[]).map(original_id=>Object.freeze({original_id,canonical_id:hero.id,canonical_name:hero.name,policy:'equal_hp_complete_skill_original_yields_to_source',counts_as_source_identity:false}))));
const mergedSourceHeroIds=new Set(HERO_SOURCE_MERGES.map(row=>row.source_id));
const mergedOriginalHeroIds=new Set(HERO_ORIGINAL_MERGES.map(row=>row.original_id));
export const HEROES = Object.freeze([...CLASSIC_HEROES.filter(hero=>!mergedOriginalHeroIds.has(hero.id)), ...EXPANSION_HEROES.filter(hero=>!mergedSourceHeroIds.has(hero.id)), ...SECOND_FOUR_HEROES.filter(hero=>!mergedSourceHeroIds.has(hero.id)), ...YXS_FIRST_HEROES, ...YXS_NEXT_HEROES, ...YXS_THIRD_HEROES, ...YXS_FOURTH_HEROES, ...DERIVED_HEROES, ...YXS_FIFTH_HEROES, ...YXS_SIXTH_HEROES,...YXS_SEVENTH_HEROES,...YXS_EIGHTH_HEROES,...YXS_NINTH_HEROES,...SGS_BASE_NEXT_HEROES,...SGS_FOLLOWING_HEROES,...SGS_WIND_HEROES,...SGS_NEXT_IDENTITY_HEROES,...WANGYUN_HEROES,...SGS_FIRE_HEROES,...SGS_FOREST_HEROES,...SGS_MOUNTAIN_HEROES,...SGS_YIJIANG_HEROES,...SGS_YIJIANG_FOLLOWING_HEROES,...SGS_YIJIANG_NEXT_HEROES,...SGS_YIJIANG_LATER_HEROES,...SGS_YIJIANG_MORE_HEROES,...SGS_YIJIANG_FURTHER_HEROES,...SGS_FOLLOWUP_HEROES,...YXS_MODERN_HEROES,...SGS_ZHANGFEN_HEROES,...SGS_MANCHONG_HEROES,...SGS_LIRU_HEROES,...SGS_LINGCAO_HEROES,...SGS_SUNRU_HEROES,...SGS_YUEJIN_HEROES,...SGS_CHENLIN_HEROES,...SGS_CAOXIU_HEROES,...SGS_CAOANG_HEROES,...SGS_PANZHANGMAZHONG_HEROES].filter(is_hero_available));
export const HERO_BY_ID = Object.freeze(Object.assign(Object.create(null),Object.fromEntries(HEROES.map(hero => [hero.id, hero]))));
export const hero_by_id = id => typeof id === 'string' && Object.hasOwn(HERO_BY_ID,id) ? HERO_BY_ID[id] : null;
export const canonical_hero_for_source = id => hero_by_id(id) || hero_by_id(HERO_SOURCE_MERGES.find(row=>row.source_id===id)?.canonical_id) || hero_by_id(HERO_ORIGINAL_MERGES.find(row=>row.original_id===id)?.canonical_id) || HEROES.find(hero=>(hero.legacy_source_ids??[]).includes(id)) || null;
/** Source systems remain distinct after selectable-mechanism merging. Future
 * lord/faction skills query their own source, never reinterpret 民/臣 as 蜀/魏. */
export function hero_source_context(hero,source_id=hero?.id){
  if(!hero||!canonical_hero_for_source(hero.id)||!canonical_hero_for_source(source_id))return null;
  const archived=[...EXPANSION_HEROES,...SECOND_FOUR_HEROES,...YXS_FIRST_HEROES,...YXS_NEXT_HEROES,...YXS_THIRD_HEROES,...YXS_FOURTH_HEROES,...DERIVED_HEROES,...YXS_FIFTH_HEROES,...YXS_SIXTH_HEROES,...YXS_SEVENTH_HEROES,...YXS_EIGHTH_HEROES,...YXS_NINTH_HEROES,...SGS_BASE_NEXT_HEROES,...SGS_FOLLOWING_HEROES,...SGS_WIND_HEROES,...SGS_NEXT_IDENTITY_HEROES,...WANGYUN_HEROES,...SGS_FIRE_HEROES,...SGS_FOREST_HEROES,...SGS_MOUNTAIN_HEROES,...SGS_YIJIANG_HEROES,...SGS_YIJIANG_FOLLOWING_HEROES,...SGS_YIJIANG_NEXT_HEROES,...SGS_YIJIANG_LATER_HEROES,...SGS_YIJIANG_MORE_HEROES,...SGS_YIJIANG_FURTHER_HEROES,...SGS_FOLLOWUP_HEROES,...YXS_MODERN_HEROES,...SGS_ZHANGFEN_HEROES,...SGS_MANCHONG_HEROES,...SGS_LIRU_HEROES,...SGS_LINGCAO_HEROES,...SGS_SUNRU_HEROES,...SGS_YUEJIN_HEROES,...SGS_CHENLIN_HEROES,...SGS_CAOXIU_HEROES,...SGS_CAOANG_HEROES,...SGS_PANZHANGMAZHONG_HEROES,...SGS_BASE_SOURCE_ALIAS_HEROES].find(h=>h.id===source_id);
  if(!archived||canonical_hero_for_source(archived.id)?.id!==canonical_hero_for_source(hero.id)?.id)return null;
  return {source_id:archived.id,source_game:archived.id.startsWith('yxs.')?'英雄杀':'三国杀',source_character_name:archived.source_character_name??archived.name,faction:archived.faction??null,gender:archived.gender??null,gender_provenance:archived.gender_provenance??archived.gender_source??archived.gender_basis??null,identity_context:archived.source_identity_context??null,max_hp:archived.max_hp,skill_name:archived.skill_name,skill_desc:archived.skill_desc,source_variant:archived.source_variant,source_urls:archived.source_urls};
}

export function is_hero_available(hero) {
  return Boolean(is_hero_in_release(hero) && ['original','verified'].includes(hero.source_status) && hero.implementation_status === 'tested');
}

export class Player {
  constructor(name, hero, is_ai = false) {
    Object.assign(this, {
      name, hero, is_ai, hp: hero.max_hp, hand: [],
      judgment_cards: [], sgs_pojun_pile: [], sgs_following_jieyue_pile: [], sgs_followup_qian_pile: [], chained: false, face_orientation:'face_up', play_phase_id:null, skip_judgment_stage:false, skip_draw_stage: false, dead: false,
      weapon: null, armor: null, offensive_horse: null, defensive_horse: null,
      used_sha_this_turn: false, wine_bonus: 0, sha_count_this_turn: 0,
      tao_count_this_turn: 0, bawang_stacks: 0, judgment_mark_pending: false,
      poison_mark_pending: false, block_turn_draw: false, prison_no_sha: false,
      leidian_pending: false, shixian_active: false, used_active_skills: new Set(),
      sha_activity_in_own_play: false, luoyi_active: false, kurou_ai_uses: 0,
      zuijiu_active: false, yinren_active: false, tuqiang_response_ids: [], skip_play_stage: false,
    });
  }
  get alive() { return !this.dead && this.hp > 0; }
  get attack_bonus() { return this.weapon ? this.weapon.power : 0; }
  get defense_bonus() { return this.armor ? this.armor.power : 0; }
  get weapon_range() { return this.weapon ? this.weapon.range : 1; }
  heal(amount) {
    if (this.dead) return 0;
    const old_hp = this.hp;
    this.hp = Math.min(rule_hero(this).max_hp, this.hp + amount);
    return this.hp - old_hp;
  }
  take_damage(amount) {
    const real_damage = Math.max(0, amount - this.defense_bonus);
    this.hp -= real_damage;
    return real_damage;
  }
}

// Mulberry32 is deliberately explicit: restoring .state reproduces all future
// random choices. No gameplay code needs Math.random(), enabling saved replays.
export class SeededRNG {
  constructor(seed = Date.now()) {
    if (typeof seed === "string") {
      let hash = 2166136261;
      for (const char of seed) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
      seed = hash;
    }
    this.state = Number(seed) >>> 0;
  }
  random() {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }
  choice(array) {
    if (!array.length) throw new RangeError("Cannot choose from an empty sequence");
    return array[Math.floor(this.random() * array.length)];
  }
  shuffle(array) {
    for (let index = array.length - 1; index > 0; index -= 1) {
      const swap_index = Math.floor(this.random() * (index + 1));
      [array[index], array[swap_index]] = [array[swap_index], array[index]];
    }
    return array;
  }
  sample(array, count) {
    if (!Number.isInteger(count) || count < 0 || count > array.length) throw new RangeError("Sample larger than population or negative");
    const pool = array.slice();
    const result = [];
    for (let index = 0; index < count; index += 1) {
      const selected = Math.floor(this.random() * pool.length);
      result.push(pool[selected]);
      pool[selected] = pool[pool.length - 1];
      pool.pop();
    }
    return result;
  }
}

// Explicit mixed-game composition. These counts are an adaptation, not either
// publisher's physical deck list. Each ordinary catalog entity has one copy.
export const JIANGHU_DECK_COUNTS=Object.freeze({
  杀:20,火杀:4,雷杀:3,闪:24,桃:12,酒:6,
  无中生有:4,顺手牵羊:8,釜底抽薪:12,决斗:3,烽火狼烟:4,万箭齐发:2,手捧雷:2,画地为牢:4,
  无懈可击:6,借刀杀人:2,铁索连环:4,火攻:3,兵粮寸断:2,
});
export const JIANGHU_DECK_SIZE=Object.values(JIANGHU_DECK_COUNTS).reduce((a,b)=>a+b,0)+EQUIPMENT_CATALOG.length;

export class Deck {
  constructor(rng = new SeededRNG(), on_reshuffle = null, {content_packs=[]}={}) {
    this.content_packs=normalize_content_packs(content_packs);
    this.rng = rng;
    this.draw_pile = [];
    this.discard_pile = [];
    this.on_reshuffle = on_reshuffle;
    this._build();
  }
  _build() {
    const cards = [];
    const add = (name, type, count, description) => {
      count=JIANGHU_DECK_COUNTS[name]??count;
      for (let index = 0; index < count; index += 1) cards.push(new Card(name,type,{...(TRICK_BY_NAME[name]??{}),power:0,description}));
    };
    add("杀", CardType.SHA, 12, "对攻击范围内合法目标使用；基础1点普通伤害，目标可用闪响应。通常出牌阶段限1张，受技能和装备修正");
    add("火杀", CardType.FIRE_SHA, 4, "造成1点火焰伤害，可经连环传导");
    add("雷杀", CardType.THUNDER_SHA, 3, "造成1点雷电伤害，可经连环传导");
    add("闪", CardType.SHAN, 16, "响应时抵消一次杀或万箭齐发；部分技能要求连续两张闪，受装备和英雄响应规则修正");
    add("桃", CardType.TAO, 10, "回复1点血");
    add("酒", CardType.WINE, 6, "普通酒每实际回合限一次，本回合下一张杀伤害+1；濒死酒仅自救回1（基础值，受技能修正），不占普通酒次数");
    const scroll_specs = [
      ["无懈可击", 6, "响应一项锦囊效果或另一张无懈可击，抵消当前目标上的效果"],
      ["借刀杀人", 2, "持武器者对合法目标使用杀，否则将武器交给你"],
      ["铁索连环", 4, "切换1至2名角色的连环状态；或重铸摸1张"],
      ["火攻", 3, "目标展示手牌，你可弃同花色手牌造成1点火焰伤害"],
      ["兵粮寸断", 2, "距离1的其他角色下次判定：非梅花跳过整个摸牌阶段"],
      ["无中生有", 4, "摸2张牌"],
      ["顺手牵羊", 8, "对距离1内任一合法其他角色获得1张手牌、装备或实体判定区牌（可含队友）；隐藏手牌不展示牌面，不受攻击范围替代；受免疫和英雄距离技能修正"],
      ["釜底抽薪", 12, "弃置合法敌方1张手牌、装备或实体判定区牌，无距离限制；先结算无懈响应"],
      ["决斗", 3, "目标先响应，双方轮流打出杀，先不出者受对方造成的基础1点普通伤害；响应杀不占出牌阶段次数"],
      ["烽火狼烟", 4, "按行动顺序对所有其他存活角色（含AI队友）逐目标结算：可无懈当前目标效果，否则打出杀或受1点普通伤害"],
      ["万箭齐发", 2, "按行动顺序对所有其他存活角色（含AI队友）逐目标结算：可无懈当前目标效果，否则打出闪或受1点普通伤害"],
      ["手捧雷", 2, "进入目标实体判定区；其判定阶段先可无懈，非红桃受基础3点雷电伤害（可连环），红桃传给下一存活座位，包括AI队友"],
      ["画地为牢", 4, "进入目标实体判定区；其下个判定阶段先可无懈，否则判定：红桃正常，非红桃跳过整个出牌阶段；摸牌与弃牌阶段仍进行"],
    ];
    for (const [name, count, description] of scroll_specs) add(name, CardType.SCROLL, count, description);
    for(const spec of [...EQUIPMENT_CATALOG,...(this.content_packs.includes(SANJIAN_PACK_ID)?SANJIAN_EQUIPMENT_CATALOG:[]),...enabled_mode_equipment(this.content_packs),...(this.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID)?YOUJIAN_EQUIPMENT_CATALOG:[])])cards.push(new Card(spec.name,spec.type,{...spec,equipment_id:spec.id}));
    if(this.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID))for(let i=0;i<4;i++)cards.push(new Card('毒',CardType.POISON,{id:'sgs.youjian.basic.poison',gift_mark:true,source_game:'三国杀',source_version:'移动版用间·官网2020-09-21规则/2026-10-15调研快照',source_urls:['https://www.sanguosha.cn/pc/news-detail-882.html'],source_status:'verified-official-core',description:'不能直接使用。公开失去每张毒时失去1点体力；引蜂衣使每张额外流失1点。摸到毒、尚未获得时，可展示交给其他角色以免除这次流失。带赠予标记，可在自己的出牌阶段交给另一角色。',adaptation_notes:'本作兼容配方加入4张赠予毒；多毒分别结算、引蜂衣按批次移出前状态计算。',content_pack:YOUJIAN_EQUIPMENT_PACK_ID}));
    if(this.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID))for(const spec of [YOUJIAN_STAB_CATALOG,...YOUJIAN_TRICK_CATALOG])for(const face of spec.physical_faces){const {physical_faces,...definition}=spec;cards.push(new Card(spec.name,spec.type,{...definition,...face,fixed_suit:face.suit,fixed_rank:face.rank,content_pack:YOUJIAN_EQUIPMENT_PACK_ID,implementation_status:'implemented-historical-core-with-disclosed-adaptations',selectable:true,adaptation_notes:'本作19张用间五牌兼容配方；花色点数参考S0076实体照片，并非移动版完整原始牌表。YJ01–YJ12边界见详情。'}));}
    this.rng.shuffle(cards);
    this.draw_pile = this._assign_suits_and_ranks(cards);
  }
  _assign_suits_and_ranks(cards) {
    const suit_values = Object.values(CardSuit);
    const suits = Array.from({ length: Math.floor(cards.length / suit_values.length) + 1 }, () => suit_values).flat();
    const ranks = cards.map((_, index) => (index % 13) + 1);
    this.rng.shuffle(suits);
    this.rng.shuffle(ranks);
    return cards.map((card, index) => new Card(card.name,card.type,{...card,suit:card.fixed_suit??suits[index],color:suit_color(card.fixed_suit??suits[index]),rank:card.fixed_rank??ranks[index]}));
  }
  draw(count) {
    const cards = [];
    for (let index = 0; index < count; index += 1) {
      if (!this.draw_pile.length) {
        if (!this.discard_pile.length) break;
        this.draw_pile = this.discard_pile;
        this.discard_pile = [];
        this.rng.shuffle(this.draw_pile);
        if (this.on_reshuffle !== null) this.on_reshuffle();
      }
      const drawn=this.draw_pile.pop();this.on_card_move?.(drawn,'drawn');cards.push(drawn);
    }
    return cards;
  }
  discard(cards) {
    if (cards === null || cards === undefined) return;
    for(const card of cards instanceof Card?[cards]:cards)this.on_card_move?.(card,'discard');
    if (cards instanceof Card) {if(!cards.virtual)this.discard_pile.push(cards);}
    else this.discard_pile.push(...cards.filter(card=>!card.virtual));
  }
}
