/**
 * UI-only records for the second historical Heroes Kill source batch.
 * The 2015 official mobile rules and matching historical HP are provenance,
 * not certification of the 2026 client. Cross-game choices are stated below.
 * Dispatch is exclusively by canonical stable ID, never by a visible name.
 */
const skill = (id, name, type, icon, summary, timing, cost, limit, effect, notes = [], activeId = null) =>
  Object.freeze({ id, name, type, icon, summary, timing, cost, limit, effect, notes: Object.freeze([...notes, YXS_NEXT_RULES_EDITION]), activeId });
const id = slug => `yxs.adapted.base.hero.${slug}`;
export const YXS_NEXT_RULES_EDITION = '英雄杀手游2015官方基础规则与匹配历史体力；2026客户端未逐项核验，跨作品组合采用明确的江湖兼容规则';
export const YXS_NEXT_PLAYABLE_HERO_IDS = Object.freeze(['ying-zheng', 'han-xin', 'zhao-kuang-yin', 'yang-yan-zhao', 'li-shi-shi', 'chen-sheng'].map(id));
export const YXS_NEXT_HERO_SKILLS_BY_ID = Object.freeze({
  [id('ying-zheng')]: Object.freeze([
    skill('yxs-next-jiquan', '集权', 'optional', 'yxs-next-imperial-claim', '受伤并存活后，可获得造成该次伤害的实体牌',
      '实际受到伤害后；若濒死，先完成救援，存活后再询问', '无；取得的是伤害牌，不是技能弃置费用',
      '每个伤害事件可选 1 次；没有回合次数上限，不按伤害点数重复',
      '可获得造成该次伤害的实体牌；普通伤害牌取得该牌，芦叶枪两牌合杀则取得两张真实素材。可取消。只取得尚可取得的实体，不复制虚拟杀、已被取得或已转移到其他角色区域的牌。',
      ['体力流失、零伤害、未获救或无实体伤害牌的技能伤害不触发；集权得到的桃不能倒过来救当前这次濒死。', '曼舞转移的伤害保留原始伤害牌；只收原牌，不收曼舞成本。盘龙棍只收最后命中的杀，博浪锤不收另弃的两张费用。', '江湖兼容：同一实体最多获得一次；收走范围锦囊不撤销其他已排队的目标效果。攻心揭示牌不是伤害素材，不能由集权取得。', '官方历史卡面标题为「嬴政-秦始皇」；这里主显示秦始皇，嬴政为来源别名。旧原创玄衡仍保留增摸与弃牌规则。']),
  ]),
  [id('han-xin')]: Object.freeze([
    skill('yxs-next-bingxian', '兵仙', 'locked', 'yxs-next-strategist', '正常摸牌阶段的基础摸牌数为 3',
      '自己的正常摸牌阶段，计算基础摸牌数量时', '无', '每次自己的正常摸牌阶段一次',
      '正常摸牌阶段的基础数量为 3 张，自动生效；其他独立摸牌修正按江湖规则在此基础上结算。不会每获得两张牌就额外再摸，也不需要出牌阶段点击技能。',
      ['整个摸牌阶段被跳过时不触发；无中生有、曼舞或其他阶段外摸牌不会被改成摸 3 张。', '不提高弃牌手牌上限，仍按当前体力计算。采用历史官网被动技的固定基础 3 张解释，当前客户端未逐项核验。']),
    skill('yxs-next-gongxin', '攻心', 'active', 'yxs-next-heart-gambit', '目标先猜花色再盲选；猜错先受伤，存活才得牌',
      '自己的出牌阶段', '发动时至少有 1 张手牌；最终可能交出其中 1 张，不预先弃牌',
      '每回合最多发动 1 次；取消目标选择不消耗次数，正式提交后计次',
      '选择另一名存活角色，目标先猜一种花色，再盲选自己的一张手牌并公开。猜中直接获得；猜错先受到自己造成的 1 点技能伤害，完整结算转移、救援与伤后技能后，原目标仍存活才最后取得该实体牌。',
      ['目标不限敌我、无距离限制；不能选自己。牌背选择不公开其他暗牌，也不能由韩信挑一张明送。没有手牌不能发动。', '揭示牌在伤害结算中仍是韩信手牌：商鞅法家等可取走，合法费用可弃掉；目标不能用尚未获得的桃自救。原目标阵亡时不会获牌。', '按韩信一侧有效花色判断；作为目标的李师师不会将韩信黑桃改成红桃。曼舞转移伤害后，最终获牌者仍是原攻心目标。', '攻心是技能伤害，可进入曼舞等伤害窗口，不是锦囊，不开无懈，也不受杀或决斗的空城保护；揭示牌不算集权可收的伤害牌。', '与周瑜反间的先交牌再伤害顺序不同。江湖兼容：仍在韩信手中、公共处理区或弃牌堆的同一实体可转交；已由其他角色取得或洗回牌库的牌不再追取，不复制。这些嵌套区域规则不是腾讯完整组合裁定。'], '攻心'),
  ]),
  [id('zhao-kuang-yin')]: Object.freeze([
    skill('yxs-next-shiquan', '释权', 'active', 'yxs-next-relinquish', '黑色手牌或装备当釜底抽薪，可拆其他任一角色',
      '自己的出牌阶段', '消耗 1 张有效黑色手牌或装备区牌；不能用判定区牌', '不限次数',
      '点击释权，先选择黑色手牌或装备作素材，再选择另一名有可弃牌的存活角色，视为使用釜底抽薪。无距离限制，可弃目标的 1 张手牌、装备或实体判定牌，正常进入无懈可击响应。选目标或素材时可以取消。',
      ['目标包括队友，但不能选自己；暗手牌只显示牌背编号。目标没有可弃牌或素材不合法时，不消耗代价。', '四个装备位均可作素材，真实离场并只结算一次离场效果；没有手牌但仍有黑色装备和合法目标时也可发动。', '不会额外摸牌。旧原创墨衡的黑手牌转换与概率摸牌保持独立；完整规则与三国杀基础甘宁奇袭归一，来源保留但不重复增加可选人物。', '过河拆桥按联合牌池归一为釜底抽薪；虚拟判定标记不是实体牌，不能弃掉。'], '释权'),
  ]),
  [id('yang-yan-zhao')]: Object.freeze([
    skill('yxs-next-tianlang', '天狼', 'locked', 'yxs-next-sky-wolf', '自己的出牌阶段，使用杀不限次数',
      '自己的出牌阶段，检查合法使用杀的次数时', '照常消耗实体杀或合法转化素材', '主动出杀无次数上限',
      '自动解除自己主动使用杀的数量上限。普通杀、火杀、雷杀、血杀、毒杀和合法转化杀均适用；每一张仍分别消耗素材、指定合法目标并完成正常响应。',
      ['不增加手牌、伤害或射程；距离、禁杀、空城与出牌窗口等条件照常检查。回合外必须有合法响应或技能窗口。', '与三国杀基础张飞咆哮的完整人物机制归一，保留双方来源；旧原创夜狼每回合最多 3 杀，与此人物分别保留。']),
  ]),
  [id('li-shi-shi')]: Object.freeze([
    skill('yxs-next-manwu', '曼舞', 'optional', 'yxs-next-silk-transfer', '扣血前可弃红桃手牌转移整次伤害；承伤者之后按缺血摸牌',
      '即将受到正数伤害，尚未扣除自己的体力时', '弃 1 张有效红桃手牌；黑桃经红妆可用，装备与判定牌不可用',
      '每次伤害事件可选 1 次；没有回合次数上限，转移多点伤害也只弃 1 张',
      '可选择另一名存活角色并弃置合法手牌，将本次完整伤害转给该角色，自己不承受这次伤害。原伤害来源、性质与实体牌关联保留。新受伤者先结算救援和伤后技能，仍存活时按最终缺血量「体力上限 − 当前体力」摸牌。',
      ['目标不限敌我、无距离限制，也能选原伤害来源，但不能选自己；可在确认前取消，不支付费用。', '先救援、后摸牌，不能用将摸到的牌自救。摸牌数不是本次伤害点数，也不是转移前的缺血数；未获救者不摸牌。', '直接失去体力、零伤害或龙鳞刀已将伤害改为弃牌时不发动。转移费用不是新伤害牌，伤害来源不会改成李师师。', '江湖兼容：原伤害加成只计算一次，承伤角色的防护按本作转移流程处理；元素连环只广播一次。这些联合牌池交互不是历史腾讯规则的客户端认证。']),
    skill('yxs-next-hongzhuang', '红妆', 'locked', 'yxs-next-rouge', '自己的黑桃视为红桃，自己的黑桃判定也按红桃',
      '检查自己的牌，或对自己最终判定牌的有效花色与颜色时', '无', '持续生效；根据持有者与当前结算语境重新计算',
      '自己的黑桃按红桃处理，颜色也按红色处理；黑桃手牌因此可以支付曼舞。对自己的最终判定，黑桃同样视为红桃，包括商鞅替换后的最终判定牌。',
      ['不会永久修改实体牌的原始花色；牌转交其他角色后，按新持有者与当前语境计算。不是将全场黑桃一律变成红桃。', '韩信攻心揭示的牌在交付前属于韩信，李师师作为目标不会改变该牌的猜花色结果；界面在需要时区分原始与有效花色。']),
  ]),
  [id('chen-sheng')]: Object.freeze([
    skill('yxs-next-qiyi', '起义', 'optional', 'yxs-next-uprising', '可放弃正常摸牌，向至多两名不同角色各取 1 张手牌',
      '自己的摸牌阶段开始，正常摸牌之前', '替换本次整个正常摸牌阶段的摸牌；不是额外摸牌',
      '每次自己的摸牌阶段选择 1 次；选择 1 至 2 名不同的其他角色，各取 1 张',
      '可放弃正常摸牌，选择至多两名有手牌的其他存活角色，从每人手中盲取 1 张加入自己手牌。也可取消并照常摸牌。只剩一名其他角色时最多取其 1 张，不能从同一个人取 2 张。',
      ['目标不限敌我、无距离限制；只取手牌，不取装备或判定牌，暗牌内容不会提前展示。不是锦囊，不进入无懈响应。', '摸牌阶段被跳过时没有起义窗口；画地为牢只跳过出牌阶段，仍可正常起义。回合开始等独立窗口的额外摸牌不被替换。', '「最多两名」按 1 至 2 名不同目标解释；不选任何目标视为不发动、正常摸牌。此技能只在摸牌窗口询问，没有出牌阶段 Q 按钮。']),
  ]),
});

/** Original 32 × 32 strokes, sharing the existing ink-seal renderer. */
export const YXS_NEXT_SKILL_ICONS = Object.freeze({
  'yxs-next-imperial-claim': '<path d="M5 10 3 4l8 4 5-6 5 6 8-4-2 9H5M6 13v4h20v-4M5 22h9l3 4h5l7-7M3 28h9l5 2h7l6-6M9 17v5m13-5v7"/>',
  'yxs-next-strategist': '<path d="M4 23V5h7v18M13 23V3h7v20M22 23V7h7v16M7 9h1m-1 4h1m8-6h1m-1 4h1m8 0h1m-1 4h1M2 28h28M7 23v5m10-5v5m9-5v5"/>',
  'yxs-next-heart-gambit': '<path d="M4 7h15v22H4zM12 7V3h16v22h-9M12 15q-5-6-7 0 0 4 7 8 7-4 7-8-2-6-7 0ZM23 8l3 4-3 4-3-4M8 4h1"/>',
  'yxs-next-relinquish': '<path d="m5 6 7 2 5-5 5 5 7-2-2 11H7ZM11 12h12M4 25h13l5-6M4 29h15l10-9M2 17l6 4-6 3M11 17l2 4"/>',
  'yxs-next-sky-wolf': '<path d="m6 12 1-9 8 6 10-6 1 13-5 10-7 4-8-9ZM9 14l5 2m8-3-5 3M12 22l4 2 4-5M3 7l-1 9m28-9 1 9M11 4l3 2"/>',
  'yxs-next-silk-transfer': '<path d="M4 5q18 0 8 11T5 29M13 3q20 6 5 14t10 12M4 15h10M20 20h9M6 11l-4 4 4 4m19-3 5 4-5 4M19 5l5 4"/>',
  'yxs-next-rouge': '<path d="M9 12Q0 8 3 19q2 6 12 10 10-7 12-14 0-8-9-3M9 12l6-9 7 9M12 24l5-13M8 7l3-2M24 25l4 3M15 4v5"/>',
  'yxs-next-uprising': '<path d="M9 30V3m0 2h19l-6 6 6 6H9M3 26l5-6m15 1 6 7M4 15h2M14 24h6v6h-6zM2 29h8M14 10h5m-5 3h4"/>',
});
export const YXS_NEXT_PORTRAITS_BY_ID = Object.freeze(Object.fromEntries(
  YXS_NEXT_PLAYABLE_HERO_IDS.map(heroId => [heroId, `./portraits-yxs-next/${heroId.split('.').at(-1)}.svg`]),
));
export function yxsNextHeroSkillMetadataEntries(heroes) {
  return heroes.map(hero => {
    if (!YXS_NEXT_PLAYABLE_HERO_IDS.includes(hero?.id)) throw new Error(`Unregistered next YXS hero ID: ${hero?.id || '(missing)'}`);
    return { hero, skills: YXS_NEXT_HERO_SKILLS_BY_ID[hero.id] };
  });
}
