/**
 * Source-aware UI records for the first historical Heroes Kill mobile batch.
 * These descriptions are UI-only. They neither confer rules on a same-name hero
 * nor enter match-state fingerprints. Register only the six implemented IDs.
 * Source: the 2015 Tencent mobile hero pages, cross-checked with Tencent's
 * matching desktop HP icons. This does not certify a current mobile client.
 */
const skill = (id, name, type, icon, summary, timing, cost, limit, effect, notes = [], activeId = null) =>
  Object.freeze({ id, name, type, icon, summary, timing, cost, limit, effect, notes: Object.freeze(notes), activeId });
const id = slug => `yxs.mobile.historical.hero.${slug}`;
export const YXS_RULES_EDITION = '英雄杀手游2015官方基础规则；体力由同规则腾讯官网互证，当前客户端完整规则未认证';
export const YXS_PLAYABLE_HERO_IDS = Object.freeze(['song-jiang', 'lu-zhi-shen', 'shang-yang', 'liu-bo-wen', 'guan-yu', 'yue-fei'].map(id));
export const YXS_CANDIDATE_HERO_IDS = Object.freeze([id('wu-song')]);
export const YXS_HERO_SKILLS_BY_ID = Object.freeze({
  [id('song-jiang')]: Object.freeze([
    skill('yxs-shucai', '疏财', 'active', 'yxs-generosity', '交出手牌；本回合累计交出至少 2 张可回 1 血',
      '自己的出牌阶段', '将至少 1 张自己的手牌交给另一名存活角色；不是弃牌',
      '交牌不限次数；本回合实际回复最多 1 点体力',
      '选择任意数量手牌和另一名存活角色，将所选牌加入其手牌。可分次交给不同角色，累计达到 2 张后，若自己受伤且本回合尚未由疏财实际回复，回复 1 点体力。',
      ['目标不限敌我，也不受距离限制；不能交装备区或判定区的牌。', '累计数量和已实际回复记录在自己的下回合重置；满血也可交牌，回复不超过体力上限。', '江湖边界：满血首次达到 2 张时不消耗实际回复额度；若同回合后来受伤，再交牌仍可回复那 1 点。历史官网未单列这一组合时序。'], '疏财'),
  ]),
  [id('lu-zhi-shen')]: Object.freeze([
    skill('yxs-dili', '底力', 'locked', 'yxs-resolve', '摸牌阶段，每损失 1 血多摸 1 张',
      '自己的正常摸牌阶段，确定摸牌数量时', '无', '每次正常摸牌阶段计算一次；不是每次摸牌都触发',
      '正常摸牌数为 2 加当前已损失体力，即「体力上限 − 当前体力」。4/4 时摸 2 张，3/4 时摸 3 张，1/4 时摸 5 张；其他独立修正照常计算。',
      ['摸牌阶段被跳过时不触发；无中生有、受伤或技能奖励摸牌不会额外获得底力牌数。', '按进入摸牌阶段时的实际体力计算，包括判定阶段刚受到的伤害；不是固定最多摸 5 张。']),
    skill('yxs-kuangchan', '狂禅', 'locked', 'yxs-monk', '担任主公时，不获得主公的额外 1 点体力上限',
      '身份或模式赋予主公额外体力上限时', '无', '持续身份约束',
      '基础体力为 4；若某模式通常给予主公额外 1 点体力上限，狂禅使自己不获得该项加成。当前江湖单人对战没有主公身份加成，因此本技能保留展示，但在这些模式中没有额外效果。',
      ['只限制主公身份提供的那 1 点，不禁止其他来源增加体力上限。', '无主公加成时仍保留原人物完整技能说明，不将此技能删除或改成额外奖励。']),
  ]),
  [id('shang-yang')]: Object.freeze([
    skill('yxs-bianfa', '变法', 'optional', 'yxs-reform', '判定生效前，可用手牌或装备替换判定牌',
      '任意角色的判定牌即将生效之前', '使用自己的 1 张手牌或装备区牌作新的判定牌；不限颜色、花色、类型',
      '同一商鞅在同一次判定中至多发动 1 次；不同判定可继续发动',
      '可选一张真实素材，将其移出原区域并替换正在结算的判定牌；用新牌的花色、点数和颜色决定结果。可取消，不限判定者和距离。换下的旧牌进入弃牌堆，新牌在判定结束后正常清理。',
      ['手捧雷、玉如意、刚烈、铁骑及实体延时锦囊等统一判定窗口均可响应；不是只改自己的判定。', '装备作素材必须真实离开装备区，并结算其离场效果。乾坤袋、金鳞甲、白银狮子等不会被当作仍在装备区。', '不会获得旧判定牌；同一判定改牌后不重开新的判定次数，不复制素材。多名改判者使用一致的行动顺序。']),
    skill('yxs-fajia', '法家', 'optional', 'yxs-lawkeeper', '受伤结算并存活后，可拿伤害来源 1 张手牌或装备',
      '自己受到伤害，完成伤害及濒死救援后，若仍存活', '无', '每次伤害事件可发动 1 次；不按损失体力点数重复',
      '若该次伤害来自另一名仍存活且有手牌或装备的角色，可取得其 1 张手牌或装备，加入自己的手牌。手牌按暗牌选择，装备公开可选；无距离限制，也可取消。',
      ['不能取得判定区牌。得到的装备进入手牌，不会自动装备；原持有者的装备离场效果照常结算。', '受到 2 点伤害只取 1 张；两个独立伤害事件可分别询问。濒死救回后可以发动，未救回或阵亡后不能发动。', '体力流失不视为伤害；无来源、来源已死亡或无牌时不询问。江湖合法目标边界：伤害来源必须是另一角色，历史官网未单列自伤取自己牌。']),
  ]),
  [id('liu-bo-wen')]: Object.freeze([
    skill('yxs-zhanbu', '占卜', 'optional', 'yxs-divination', '准备阶段私看牌顶，自定牌顶与牌底顺序',
      '自己的回合开始，判定阶段之前，即准备阶段', '无；查看的牌不进入手牌',
      '每个自己的回合可发动 1 次；查看至多 min（存活人数，5）张',
      '可先取消而不看牌。发动后仅自己查看对应数量的牌堆顶牌，逐张安排到牌顶或牌底；两区均按自己的选择顺序排列，先选的先被摸到。可全部放顶或全部放底，所有牌恰好安排一次后提交，再继续判定和摸牌。',
      ['1v1 通常看 2 张，1v2 通常看 3 张；存活人数超过 5 时最多看 5 张。预览不向其他角色或人机公开。', '查看不触发摸牌或获得手牌的技能；即使本回合摸牌阶段将被跳过，占卜仍可在准备阶段发动。', '可保持原顺序结束；短牌堆按江湖通用洗牌规则补足可查看数量，不复制牌。这一短牌堆处理属于江湖兼容。', '与已核对的诸葛亮观星同机制，合并展示来源；占卜不是出牌阶段技能，不设出牌发动按钮。']),
    skill('yxs-guiyin', '归隐', 'locked', 'yxs-seclusion', '无手牌时，不能被指定为杀或决斗的目标',
      '其他角色检查杀或决斗目标是否合法时', '自己手牌为 0', '持续条件；得到手牌后立即不再满足',
      '无手牌时，其他角色不能以普通杀、火杀、雷杀、血杀、毒杀、合法转化杀或决斗指定自己为目标；装备区有牌也不影响归隐。借刀杀人的受击目标同样必须合法。',
      ['已经合法开始的决斗中，打出最后一张手牌不会追溯中止决斗，仍继续其响应与胜负结算。', '不免疫其他锦囊、技能伤害或体力流失。它是目标限制，不是所有伤害免疫。', '与已核对的诸葛亮基础空城同机制；弈川（旧江湖韩信）的本作同名空城只限制杀，仍保持独立。']),
  ]),
  [id('guan-yu')]: Object.freeze([
    skill('yxs-danqi', '单骑', 'locked', 'yxs-solitary-rider', '自己到其他角色的距离 −1，可与进攻马叠加',
      '计算自己到其他角色的距离时', '无', '持续生效',
      '自己视为额外装备一匹进攻马，使自己到其他角色的距离减少 1。与真实进攻马的减距叠加；没有进攻马时减 1，有进攻马时合计减 2，最终距离按通用下限计算。',
      ['不占装备槽，也不生成可以被取得或弃置的马牌；真马离场不会移除单骑。', '不改变别人到自己的距离；这是距离修正，不是武器攻击范围加 1。']),
    skill('yxs-budao', '补刀', 'optional', 'yxs-follow-through', '回合外，射程内角色被杀伤害后，可对其再用一张杀',
      '自己的回合外，某角色被杀直接造成实际伤害，伤害后反应及濒死救援结算完成之后',
      '使用 1 张合法杀并正常消耗素材；已支持的合法武器生成照常可用',
      '每个合格伤害事件可选 1 次；补刀杀再次造成合格伤害可继续；不耗未来出牌阶段出杀次数',
      '若刚受伤的另一名角色仍存活、处于自己当前攻击范围且可成为杀的目标，可选择向其使用一张杀。目标正常进行闪、防具和相关响应；不是直接追加伤害。每次重新检查目标和当前距离。',
      ['不限目标阵营；人机按自身策略选择敌方。自己回合内、被闪、伤害为 0、体力流失或目标死亡时不发动。', '每张补刀杀均真实消耗素材、独立响应；取消不会使用杀。补刀不绕过空手归隐或空城等目标限制。', '江湖边界：不能对自己补刀；只接受杀的直接伤害，不将跨作铁索连环传导伤害归入补刀触发。历史官网未给出这些组合的完整手游裁定。', '秦琼反击的特殊原版组合尚未加入，不能把本批补刀解释为已支持全部未来英雄交互。']),
  ]),
  [id('yue-fei')]: Object.freeze([
    skill('yxs-wumu', '武穆', 'active_response', 'yxs-martial-swap', '手中杀、闪互用；闪也可主动当普通杀',
      '自己出牌阶段，以及需要使用或打出杀、闪的合法响应窗口',
      '使用自己的 1 张实体手牌：杀转闪，闪转普通杀',
      '无独立次数上限；主动杀仍共用出杀次数，响应不消耗主动出杀次数',
      '出牌阶段点击武穆，可用一张闪当普通杀；需要杀时可用闪响应，需要闪时可用杀响应。每次只消耗一张真实素材，保留其花色、点数与颜色，并遵守转化后牌的目标、距离、次数和当前响应要求。',
      ['手牌中的普通杀、火杀、雷杀、血杀、毒杀按江湖共有适配均可转闪；转化后不继承原杀的属性、回血或中毒后效。', '不能将芦叶枪两张手牌生成的虚拟杀再当闪，也不能将玉如意红判的虚拟闪再当杀；装备区牌不能直接作为武穆素材。', '不是任意基本牌转化，也没有受伤后夺牌、摸牌或拆牌效果。原本作岳飞改名凌川后保留其独立原创机制。', '与已核对的赵云基础龙胆完整等效，合并人物但保留三国杀来源和原名；不是界版、小程序龙怒或其他强化版本。'], '武穆'),
  ]),
  [id('wu-song')]: Object.freeze([
    skill('yxs-zuijiu-candidate', '醉酒', 'optional', 'yxs-drunken-might', '候选：摸牌少 1 张，本回合杀与决斗基础伤害为 2',
      '自己的正常摸牌阶段，决定摸牌数量时', '基础规则下，本次正常摸牌由 2 张改为 1 张',
      '每次正常摸牌阶段选择 1 次；持续到本回合结束，不限第一张杀',
      '已核实的基础效果：选择醉酒后，自己本回合对别人使用杀或自己发起决斗所造成的默认 1 点伤害改为 2 点。自己发起决斗却失败时，不提高对手对自己的伤害。此人物暂为规则候选，未注册为可选英雄。',
      ['跳过摸牌阶段不获得效果；不提高体力流失、纯技能伤害或回合外杀伤害。', '历史官方措辞为默认 1 点改为 2 点；额外摸牌修正、酒、武器及其他增伤组合的完整叠加顺序尚未闭合，不能把一律加 1 冒充源规则。', '暂不与许褚裸衣合并，也不提供可发动按钮；补齐组合裁定并实施验收后再开放。']),
  ]),
});

/** Original 32 × 32 SVG strokes. The parent merges these into SKILL_ICONS. */
export const YXS_SKILL_ICONS = Object.freeze({
  'yxs-generosity': '<path d="M3 20h6l4 4h8l7-8q-2-3-5 0l-4 4h-5M3 28h8l4 2h7l8-10M5 5h9v11H5zM9 9h2M18 3h9v10h-6"/>',
  'yxs-resolve': '<path d="m5 25 3-10 6 1 2 6 6-3 1-9 6 2-2 12-8 5-10-1ZM9 15l2-9 6 1-1 8M4 5l3 2M22 3l-1 4M13 21l3 3"/>',
  'yxs-monk': '<circle cx="16" cy="10" r="6"/><path d="M6 28v-4q1-9 10-9t10 9v4M9 23l7 5 7-5M14 7h.1M18 7h.1M16 10h.1M13 13h6M4 29h24"/>',
  'yxs-reform': '<path d="M3 6h11v16H3zM19 10h10v18H19zM6 10h5m-5 4h5M17 3h10l-3 3m3-3-3-2M15 26H5l3-3m-3 3 3 3M22 15h4m-4 5h4"/>',
  'yxs-lawkeeper': '<path d="M7 3h18v19H7zM11 7h10m-10 4h10m-10 4h6M2 25l5-4 5 3 5-2 5 3 7-6M3 29h9l7 1 10-7M7 19v4"/>',
  'yxs-divination': '<circle cx="16" cy="16" r="12"/><path d="m7 11 8-6 4 9 8 3-7 7-7-1-6-12M15 5l-2 18M19 14l-12-3m12 3 1 10"/><circle cx="15" cy="5" r="2"/><circle cx="19" cy="14" r="2"/><circle cx="20" cy="24" r="2"/>',
  'yxs-seclusion': '<path d="M3 28h26M6 28V13h20v15M3 13l6-8h14l6 8M12 28V19h8v9M7 4 4 2m21 2 3-2M8 10h16M1 19h4m22 0h4"/><path d="M14 23h4"/>',
  'yxs-solitary-rider': '<path d="m4 23 4-9 9-2 4-7 6 2 1 9-7 1-2 6H8l-2 6m12-6 5 6M9 14 7 8l4-4 5 7M13 23v6M2 7h5M2 11h4"/><circle cx="23" cy="10" r="1"/>',
  'yxs-follow-through': '<path d="m8 29 13-21M20 4q9-1 9 6-2 7-10 7l1-6q7-1 0-7ZM11 22l6 3M4 16q-4-8 3-12M3 3l4 1-1 5M9 12q3-4 7-3"/>',
  'yxs-martial-swap': '<path d="M3 8h22l-5-5m5 5-5 5M29 24H7l5 5m-5-5 5-5M7 16 17 6m-8 5 4 4M25 16 15 26m8-5-4-4"/>',
  'yxs-drunken-might': '<path d="M4 15h14l-2 9q-5 6-10 0ZM6 15V8h10v7M8 8V3h6v5M21 28l7-19-3-5-5 4 3 4-6 14M3 29h15M23 19l5 2"/>',
});
export const YXS_PORTRAITS_BY_ID = Object.freeze(Object.fromEntries(
  [...YXS_PLAYABLE_HERO_IDS, ...YXS_CANDIDATE_HERO_IDS].map(heroId => [heroId, `./portraits-yxs/${heroId.split('.').at(-1)}.svg`]),
));

/** Pass this result to registerHeroSkillMetadata in skill-catalog.js.
 * Explicit stable IDs prevent same-name SGS 关羽 or original 凌川 inheriting rules.
 * Candidates fail closed rather than silently becoming playable.
 */
export function yxsHeroSkillMetadataEntries(heroes) {
  return heroes.map(hero => {
    if (!YXS_PLAYABLE_HERO_IDS.includes(hero?.id)) throw new Error(`Unregistered YXS playable hero ID: ${hero?.id || '(missing)'}`);
    return { hero, skills: YXS_HERO_SKILLS_BY_ID[hero.id] };
  });
}
