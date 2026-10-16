/** Selected-source identity guides and strictly owner-bound decisions. No gameplay registration. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_IDENTITY_NEXT_HERO_IDENTITIES=freeze({
  "sgs.adapted.base.hero.man-chong": {
    "name": "满宠",
    "hp": 3,
    "faction": "魏",
    "gender": "男",
    "source_variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
    "portrait_path": "./portraits-sgs-identity-next/man-chong.svg"
  },
  "sgs.adapted.base.hero.li-ru": {
    "name": "李儒",
    "hp": 3,
    "faction": "群",
    "gender": "男",
    "source_variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
    "portrait_path": "./portraits-sgs-identity-next/li-ru.svg"
  }
});
export const SGS_IDENTITY_NEXT_HERO_SKILLS_BY_ID=freeze({
  "sgs.adapted.base.hero.man-chong": [
    {
      "id": "sgs-identity-next-junxing",
      "source_skill_id": "sgs.junxing",
      "name": "峻刑",
      "icon": "sgs-identity-next-junxing",
      "activeId": "sgs.junxing",
      "type": "active",
      "summary": "弃任意正整数张手牌；另一角色弃异类手牌，或翻面再摸等量",
      "condition": "自己的真实出牌阶段，未用本阶段额度，有至少一张可弃手牌及另一存活角色。",
      "phase_use": "点峻刑，点选多张手牌并确认，再选择目标。显示数量及基本／锦囊／装备类别；可选空手角色与队友。",
      "response": "目标本人选择异类手牌弃一张，或翻面后摸N张。提交成本前可取消，不扣牌或次数；已提交不退款。",
      "disabled_reason": "非本人真实出牌阶段、阶段已用、无可弃手牌、无其他存活角色、失技／死亡或当前正在结算。",
      "timing": "自己的每个真实出牌阶段动作窗口",
      "cost": "弃置自己任意正整数张可弃置手牌；数量和三大类别集合在成功支付时锁定；不允许装备区/判定区/私有牌堆支付",
      "limit": "每个出牌阶段限一次，不是每回合限一次；目标选择哪一项均耗本阶段机会",
      "effect": "由满宠选择成本手牌和目标，再由目标选择分支。成本不可为0张：该主动技要求实际执行弃置成本；不增加3张上限或“每类限一张”的限制。 分支1只弃目标自己的1张手牌，该牌类别必须不属于满宠本次弃置成本的任何类别。类别为基本/锦囊/装备，不是花色、牌名或普通/延时细类。 目标没有合格可弃手牌或选择不弃时，执行分支2：先翻面，再摸N张，N为满宠本次实际弃置数。不是摸至N，也不是摸至4。",
      "targets": "一名其他存活角色；不要求其有手牌，不限阵营或距离",
      "source_variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
      "notes": [
        "所选来源：移动版经典满宠完整双技能，2026-10-15目录选择快照。未实测2026当前移动客户端，不混入界、谋、OL、国战或其他改版。",
        "目标原来背面朝上时可翻回正面，仍摸N张；不是强制设置为背面。满宠可主动帮助队友复原。目标原来无手牌依然是合法目标。",
        "若成本含三大类则目标不存在不同于所有成本类别的牌，只能翻面摸牌；成本同类别多张仍令N增大。选择分支1成功后不摸牌、不翻面、不失去体力。",
        "弃成本与目标弃牌分别发出正常弃置事件，翻面发出双向状态变化事件，可触发现有法恩等。摸牌使用正常牌堆，不创造缺失的牌。",
        "H2：提交前取消不扣牌／次数，恰好一次提交后不退款；暗选由真正持有者或其AI完成，规则合法性不限敌友。",
        "触屏点选，或Tab定位、Enter确认；仅可取消提示支持Esc退出。重复或过期输入不重复结算。"
      ]
    },
    {
      "id": "sgs-identity-next-yuce",
      "source_skill_id": "sgs.yuce",
      "name": "御策",
      "icon": "sgs-identity-next-yuce",
      "activeId": null,
      "type": "optional",
      "summary": "受伤并获救后可展示一手牌；来源弃异类手牌，否则自己回复1",
      "condition": "本次实际伤害的来源存在；本人经救援后存活、有手牌且仍持有御策。",
      "phase_use": "没有自由出牌按钮。每次实际伤害后本人可选择展示一张手牌；该牌仍留在手中。",
      "response": "只公开选中的那张牌。真正伤害来源自行决定弃异类手牌或拒绝；拒绝／无合法牌才回复1，上限封顶。",
      "disabled_reason": "无伤害来源、空手、已死或失技、仅失去体力、伤害被完全防止；御策不能先于濒死救援自救。",
      "timing": "每次实际受到伤害并完成救援且自己存活之后",
      "cost": "展示自己1张现有手牌；不弃置、不交给伤害来源，展示后仍归自己",
      "limit": "每次伤害事件一次机会，不是每一点伤害一次；不设每回合次数上限",
      "effect": "自己必须仍有手牌。通过展示手牌后，伤害来源可弃1张与展示牌三大类别不同的手牌；来源手牌不足/无合格牌/拒绝，满宠回复1点体力。 来源支付不能用已安装装备、判定牌或私有堆；不能把2张同类别牌凑作1张不同类别。拒绝付款是允许选择，不按敌友自动决定。 这是伤害后回复，不能防止已发生的伤害、返还全部伤害或把多点伤害拆成多次御策。一次3点伤害存活后最多回复1点。失去体力、伤害完全被防止不会触发。",
      "targets": "固定为该伤害事件的实际来源；由来源决定是否弃不同类别手牌，回血对象固定为满宠",
      "source_variant": "mobile-classic-identity-official-catalog-selection-2026-10-15",
      "notes": [
        "所选来源：移动版经典满宠完整双技能，2026-10-15目录选择快照。未实测2026当前移动客户端，不混入界、谋、OL、国战或其他改版。",
        "若伤害使满宠进入濒死，先按正常求桃救援。被救回并仍有手牌后才有御策；已经死亡不能自救。回复上限封顶。",
        "同产品2022攻略明确无伤害来源不能发动御策；无来源闪电伤害不能直接让其回1。不要凭“否则”把不存在来源当作拒付。",
        "按真正伤害来源，不按杀的原使用者：转移/来源改写后的事件来源决定谁选择付款。自己造成自己伤害时来源可为自己，依正常手牌类别检查；展示牌仍在手中但其类别相同，不能拿它支付不同类别。",
        "H2：提交前取消不扣牌／次数，恰好一次提交后不退款；暗选由真正持有者或其AI完成，规则合法性不限敌友。",
        "触屏点选，或Tab定位、Enter确认；仅可取消提示支持Esc退出。重复或过期输入不重复结算。"
      ]
    }
  ],
  "sgs.adapted.base.hero.li-ru": [
    {
      "id": "sgs-identity-next-juece",
      "source_skill_id": "sgs.juece",
      "name": "绝策",
      "icon": "sgs-identity-next-juece",
      "activeId": null,
      "type": "optional",
      "summary": "结束阶段可对一名空手的其他角色造成1点普通伤害",
      "condition": "自己的真实结束阶段开始，正常弃牌阶段已完成，有空手的其他存活角色。",
      "phase_use": "没有自由出牌按钮。结束阶段收到目标提示，可放弃。装备与判定区有牌不影响空手判定。",
      "response": "选择合法目标后造成1点普通技能伤害；不是杀，无闪响应，也不是失去体力。可以选择队友。",
      "disabled_reason": "未进入真实结束阶段、该阶段机会已处理、无人符合空手条件、失技／死亡或对局已结束。",
      "timing": "自己的结束阶段开始时，已经完成正常弃牌阶段；非旧版回合内他人失去最后手牌时",
      "cost": "无牌成本",
      "limit": "每个结束阶段一个可选目标，不按空手次数重复",
      "effect": "造成来自李儒的1点普通技能伤害；不是杀、不是失去体力，不提供闪响应。目标可以有装备或判定区牌，只检查手牌。 没有手牌的自己不可以选。目标本回合没失去牌也可选；有手牌但曾失去牌不可选。绝策需结束阶段实际存在。 不采用历史原版“于你的回合失去最后手牌后”时序，也不采用界版“本回合失去过牌”条件。",
      "targets": "一名没有手牌的其他存活角色，不限距离或阵营",
      "source_variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
      "notes": [
        "所选来源：移动版2015-12-01修订历史李儒，灭计限定有手牌目标。未实测2026当前移动客户端，不混入界、谋、OL、国战或其他改版。",
        "H2：提交前取消不扣牌／次数，恰好一次提交后不退款；暗选由真正持有者或其AI完成，规则合法性不限敌友。",
        "触屏点选，或Tab定位、Enter确认；仅可取消提示支持Esc退出。重复或过期输入不重复结算。",
        "H8江湖兼容：已提交灭计／焚城在原持有者死亡或失技后继续；死者不再作为实际伤害来源，保留原发动归属。队列与上家映射不随换座变化，死亡目标跳过，终局停止；不是移动版原生死亡裁定认证。"
      ]
    },
    {
      "id": "sgs-identity-next-mieji",
      "source_skill_id": "sgs.mieji",
      "name": "灭计",
      "icon": "sgs-identity-next-mieji",
      "activeId": "sgs.mieji",
      "type": "active",
      "summary": "黑色锦囊手牌置牌堆顶；有手牌的另一角色弃一锦囊或逐次弃两非锦囊",
      "condition": "自己的真实出牌阶段，未用本阶段额度，持有一张黑色锦囊手牌且另一存活角色有手牌。",
      "phase_use": "点灭计，选一张黑色锦囊手牌及有手牌的另一角色。全局置顶，不是弃置、使用、交牌或私有牌堆。",
      "response": "目标自己选一锦囊／非锦囊分支，再逐张支付。第二张在第一张失牌与装备离场效果后重新选择；若无第二张合法非锦囊则结束。",
      "disabled_reason": "非本人真实出牌阶段、阶段已用、无黑色锦囊手牌、无人有手牌、失技／死亡或当前正在结算。",
      "timing": "自己的真实出牌阶段动作窗口",
      "cost": "将自己一张黑色锦囊手牌置于全局牌堆顶；不是弃置/使用，已在判定区的锦囊不能付",
      "limit": "每出牌阶段限一次，非本回合限一次；效果后不能取回成本刷新",
      "effect": "成本为自己真实手牌中的黑色锦囊，包含普通及延时锦囊；置入全局牌堆顶，保留实体、花色、点数。非使用/打出转换不改持有成本身份。 目标自己选择：弃置1张锦囊，或依次弃置2张非锦囊。目标支付可来自手牌及装备区，不来自判定区/私有牌堆；同产品历史指南明确装备配合。 “依次”解释为逐张选取、移动、完成该张失去/装备离场后再检查下一张。不能一次锁定2牌并同时移动，也不能让李儒看全手代选。",
      "targets": "一名有手牌的其他存活角色；所选2015-12-01官方历史版明确须有手牌，不能仅因有装备就合法",
      "source_variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
      "notes": [
        "所选来源：移动版2015-12-01修订历史李儒，灭计限定有手牌目标。未实测2026当前移动客户端，不混入界、谋、OL、国战或其他改版。",
        "若第二分支只有1张可弃非锦囊，先弃该张并完成对应事件，然后重查：若此时仍无可弃非锦囊，则结束，不强迫弃锦囊；若因枭姬等新得非锦囊，则必须继续弃第2张。总计最多2张非锦囊。",
        "恰有1非锦囊+1锦囊的目标可以选择只弃非锦囊（若第一弃后未新增非锦囊）。只有锦囊而无可弃非锦囊时不能选0张空付第二分支；须弃1张合法锦囊。所有合法牌均不能弃的特殊外来保护按H8处理。",
        "“不足”指本分支可弃非锦囊不足，不是从现有所有牌凑2张；不可混合1锦囊+1非锦囊。上述递归是文本语义推导，非独立FAQ或当前客户端实测。",
        "目标无手但有装备在选定版本不合法。目标选择完毕、李儒已置顶后，被嵌套效果抽空或死亡不返还成本/阶段次数；后续按H8处理。",
        "弃锦囊不会给李儒，排除界版改交锦囊；不采用OL界版红锦囊成本/两张任意牌。",
        "H2：提交前取消不扣牌／次数，恰好一次提交后不退款；暗选由真正持有者或其AI完成，规则合法性不限敌友。",
        "触屏点选，或Tab定位、Enter确认；仅可取消提示支持Esc退出。重复或过期输入不重复结算。",
        "H8江湖兼容：已提交灭计／焚城在原持有者死亡或失技后继续；死者不再作为实际伤害来源，保留原发动归属。队列与上家映射不随换座变化，死亡目标跳过，终局停止；不是移动版原生死亡裁定认证。",
        "逐张递归与重新检查是所选文本的语义推导，没有独立FAQ或当前客户端实测；全牌受外来保护时结束且不追加伤害。"
      ]
    },
    {
      "id": "sgs-identity-next-fencheng",
      "source_skill_id": "sgs.fencheng",
      "name": "焚城",
      "icon": "sgs-identity-next-fencheng",
      "activeId": "sgs.fencheng",
      "type": "limited_active",
      "summary": "限定一次：其他角色依序弃至少X张手牌／装备，或受2点火伤",
      "condition": "自己的真实出牌阶段，仍有焚城且本局限定标记未消耗。",
      "phase_use": "点焚城并确认。消耗限定标记后，所有其他角色含队友按发动时队列依次处理；不可自选起点或只选敌人。",
      "response": "当前角色自行多选至少X张手牌／装备后确认整批弃置，也可选择受2点火伤。可超额弃牌提高后继门槛；不足X不能部分支付。",
      "disabled_reason": "限定标记已消耗、非本人出牌阶段、失技／死亡、对局结束或当前正在结算；新阶段、额外回合或失技重获均不刷新标记。",
      "timing": "自己的出牌阶段",
      "cost": "消费一次限定标记，无手牌成本",
      "limit": "限定技，一局一次；不能因额外回合/阶段自动重置",
      "effect": "所有其他存活角色按行动顺序依次选择，第一位为李儒下家，不得任意选起点或跳队友。每人可弃至少X张手牌/装备，或受来自李儒的2点火焰技能伤害。 所选2015官方文字明确X按“发动此技能时该角色的上家”本次实际弃牌数+1。开始时锁定这张上家身份映射；首位上家为李儒，本次未以焚城弃牌，故X=1。 上家以本次焚城弃N张，则X=N+1；上家未以焚城弃牌则N=0，X=1。可超额弃牌抬高后继门槛，不是恰好X；不足X张不能部分付费充数。",
      "targets": "所有其他角色依次处理，包含队友；不得只选敌人或自行选起点",
      "source_variant": "mobile-identity-revised-2015-12-01-historical-has-hand-target",
      "notes": [
        "所选来源：移动版2015-12-01修订历史李儒，灭计限定有手牌目标。未实测2026当前移动客户端，不混入界、谋、OL、国战或其他改版。",
        "焚城弃牌可来自H/E，不能弃J或私有堆；每个目标选择的整批N须原子支付后记录实际N，再进行失去事件。",
        "火伤经过统一防伤、增减伤、濒死救援、链传播。不是杀或锦囊牌，不能用闪/无懈，实际被完全防止仍未以焚城弃牌，后继N视0。",
        "官方“发动时上家”与Wiki“上一名此技能目标”分开保存；不因后续跳过死亡人物而重新定义前者。初始上家未获执行便死亡，其弃N记录保持0；已弃N后死亡记录仍N。此为固定上家文字的直接结果。",
        "中途来源死亡、失技、角色换座及对局终局的事务续算采用明确H8，不能声称经手游客户端证实。",
        "H2：提交前取消不扣牌／次数，恰好一次提交后不退款；暗选由真正持有者或其AI完成，规则合法性不限敌友。",
        "触屏点选，或Tab定位、Enter确认；仅可取消提示支持Esc退出。重复或过期输入不重复结算。",
        "H8江湖兼容：已提交灭计／焚城在原持有者死亡或失技后继续；死者不再作为实际伤害来源，保留原发动归属。队列与上家映射不随换座变化，死亡目标跳过，终局停止；不是移动版原生死亡裁定认证。"
      ]
    }
  ]
});
export const SGS_IDENTITY_NEXT_HOST_POLICIES=freeze([
  {
    "id": "H0",
    "text": "3为本包经典模板体力上限。普通对战以满模板体力开始；身份模式主公加成独立由模式规则处理，不能更改模板3。本批阵营保存魏/群，队伍敌友另存。原网页无独立初始HP字段。"
  },
  {
    "id": "H1",
    "text": "江湖映射基本/锦囊/装备三大类；延时与普通锦囊同属锦囊；每次展示/成本/使用必须读该动作上下文的有效身份，不能把仅使用时转换套到展示或弃置。来源名与江湖同效卡名通过功能ID映射。"
  },
  {
    "id": "H2",
    "text": "主动成本、使用次数与决策ID采用原子提交、恰好一次。提交前取消不扣牌或次数；提交后触发技能嵌套不退款。手牌暗选由持有者/其AI完成，不向对方AI泄露。公共展示仅公开选中实体。"
  },
  {
    "id": "H3",
    "text": "实际伤害、失去体力和回复使用宿主统一管线。先完成濒死/救援再开启存活者的伤害后技能。游戏终局立即终止新决策。没有源产品证据的具体技能死亡续算不得借本约定静默补齐，李儒历史版额外标注H8兼容续算，不冒充当前手游证实。"
  },
  {
    "id": "H4",
    "text": "每真实出牌阶段都有独立phase_id；额外阶段重置阶段限一次，但不重置本回合效果。翻面/入链必须通过正式状态事件。缺牌摸牌按正常回收弃牌堆、洗牌与牌守恒处理，不能复制实体补足。"
  },
  {
    "id": "H5",
    "text": "复制/易装/变身从完整有效固有技能清单取得能力，不按显示名判断。新持有者用自己的事件与次数账本；失去再获得同一技能不刷新已用额度或限定标记。复制者的角色身份与阵营仍遵守既有变身契约。不能因仅能暂时复制而做英雄去重。"
  },
  {
    "id": "H6",
    "text": "本批满宠与李儒无专属持久实体牌堆；李儒的灭计置入全局牌堆顶，不是持有者私有堆。所有展示/拼点/置顶实体都纳入分区、序列化、死亡清理和重放守恒。已合法置顶不因持有者后来死亡或失技而取回。"
  },
  {
    "id": "H7",
    "text": "本次只设计经典身份实体；1V1、国战、欢乐、界、OL、十周年等各模式/变体后续单独盘点，不能视作本包已覆盖。个人主公技/授予技/获得技清单即使为空也必须显式记录。画面使用新制原创肖像和原创符号，保留真实姓名/技能名及来源链接。"
  },
  {
    "id": "H8",
    "text": "已提交的灭计/焚城独立效果继续按原事务处理，即使原持有者后来死亡、失技或易装；不能再以新发动资格中止已经承诺的全局队列。目标已死则跳过其新选择，不伪造弃牌。焚城初始队列/上家映射不随宿主异游戏换座改写；回合外新增角色不插入。每次伤害按源是否仍存活取得实际来源：原持有者已死则伤害来源为空，但causal_owner_id与原激活ID保留；不再触发死者技能/奖励。对局终局停止新选择。灭计逐次弃牌中目标死亡停止该目标，原持有者死亡不返还已置顶成本；可弃牌全受外来保护时无可付选项则结束不追加伤害。以上是声明的江湖兼容约定，不能外推为移动版原生死亡裁定。"
  }
]);
export const SGS_IDENTITY_NEXT_SKILL_ICONS=freeze({
 'sgs-identity-next-junxing':'<path d="M4 4h12v18H4zm4 5h4m-4 5h4M21 3v12m-4-8h9m-7 3-3 7h6l-3-7Zm7 0-3 7h6l-3-7ZM4 27h14m-4-4 4 4-4 4M25 23v8m-4-4h8"/>',
 'sgs-identity-next-yuce':'<path d="M4 5h13v20H4zM7 11l4-3 3 3-3 4-4-4ZM21 5l8 4v8q0 7-8 12-5-3-7-7m10-8v8m-4-4h8M7 20h6"/>',
 'sgs-identity-next-juece':'<path d="M25 3a10 10 0 0 0 4 16A11 11 0 0 1 25 3ZM3 7h12v16H3zm4 5h4m-4 4h4M16 24l8-8m-5 1 4 4m-7 3-4 5 6-3"/>',
 'sgs-identity-next-mieji':'<path d="M3 19h18v10H3zm3-4h18v10M9 11h18v10M12 2h14v6H12zM19 4v11m-4-4 4 4 4-4M5 23h8m-8 3h5"/>',
 'sgs-identity-next-fencheng':'<path d="M3 28V17h5v-5h5v5h6v-5h5v5h5v11H3Zm10 0v-7h6v7M12 9q-6-3-1-8-1 4 3 3 4-4 4-3 5 6-1 9M4 8h3m18 0h3M6 30h20"/>'
});
const close=e=>{if(e.key==='Escape'&&e.currentTarget.open){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsIdentityNextPolicyGuide({hero}){return html`<details className="hero-provenance sgs-identity-next-policy" onKeyDown=${close}><summary>H0–H8 · 所选来源版本与江湖兼容边界</summary><p>满宠：经典3体力魏男，峻刑／御策。李儒：3体力群男，绝策／灭计／焚城，选择2015-12-01历史修订的有手牌目标版本。两人无个人主公技、觉醒、授予技能或私有持久牌堆。</p><p>完整来源目标仍未完成；本批不代表全角色、全模式或2026当前客户端认证。</p><ol>${SGS_IDENTITY_NEXT_HOST_POLICIES.filter(p=>p.id!=='H8'||hero?.id==='sgs.adapted.base.hero.li-ru').map(p=>html`<li key=${p.id} data-policy-id=${p.id}><strong>${p.id}${p.id==='H8'?' · 江湖兼容，非移动客户端认证':''}</strong> · ${p.text}</li>`)}</ol><p className="hero-source-links"><a href="https://www.sanguosha.cn/hero-detail-125.html" target="_blank" rel="noopener noreferrer">满宠官方基础目录</a> · <a href="https://www.sanguosha.cn/hero-detail-133.html" target="_blank" rel="noopener noreferrer">李儒官方基础目录</a> · <a href="https://www.sanguosha.cn/pc/news-detail-98.html" target="_blank" rel="noopener noreferrer">李儒所选2015-12-01历史修订</a></p></details>`;}
export function SgsIdentityNextHpEvidence({hero}){const h=SGS_IDENTITY_NEXT_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-identity-next-source=${hero.id}>${h.name} · ${h.faction} · ${h.gender} · 固有最大体力3。同产品经典社区字段佐证；官方目录完整固有技能含隐藏面板已核对。满体力3/3开局是H0宿主初始化，独立初始体力字段未知，不含身份主公加成。${h.name==='李儒'?'采用2015-12-01历史修订版。':''}未实测2026当前移动客户端。</p>`:null;}
export const SGS_IDENTITY_NEXT_PROMPT_CONTEXTS=freeze({
 junxing_cost:['sgs.junxing','峻刑','选择任意正整数张可弃手牌','没有3张上限，也不限每类一张。确认成本和目标前尚未支付。'],
 junxing_target:['sgs.junxing','峻刑','选择另一名存活角色','空手与队友均合法，无距离限制；此时仍可取消不扣牌、不占次数。'],
 junxing_payment:['sgs.junxing','峻刑','由你弃一张异类手牌，或翻面再摸N张','异类必须不属于所有成本类别。翻面是正反切换，原来背面会翻回正面；仍摸N张。'],
 yuce_reveal:['sgs.yuce','御策','受伤与濒死救援已结束：可展示一张手牌','只公开选中的一张，仍留在你手中；不是弃置、使用或交给来源。可以放弃。'],
 yuce_payment:['sgs.yuce','御策','真正伤害来源选择：弃一张异类手牌，或令满宠回复1','这里只能用自己的手牌。已经发生的伤害不会撤销；拒绝后至多回复1点。'],
 juece_target:['sgs.juece','绝策','结束阶段：可选择一名空手的其他角色','正常弃牌阶段已完成。造成1点普通技能伤害，不是杀或失去体力；可放弃。'],
 mieji_cost:['sgs.mieji','灭计','选择一张黑色锦囊手牌置于全局牌堆顶','普通、延时锦囊均可；不是弃置或使用，不能用已在判定区的牌。尚未支付，可取消。'],
 mieji_target:['sgs.mieji','灭计','选择一名有手牌的其他角色','所选2015-12-01历史版：空手而有装备也不合法；可选队友。此时仍可取消。'],
 mieji_branch:['sgs.mieji','灭计','目标自己选择弃一张锦囊，或逐次弃两张非锦囊','费用已置全局牌堆顶。可弃手牌／装备，不可选判定区；有可付分支时必须选，不能零张空付。'],
 mieji_discard:['sgs.mieji','灭计','选择本分支下一张可弃的手牌／装备','非锦囊逐张支付，先完成本张失牌与装备离区再重查。没有第二张非锦囊时结束，不强迫补锦囊。'],
 fencheng_offer:['sgs.fencheng','焚城','确认发动本局一次的焚城？','确认后消耗限定标记，所有其他角色含队友按发动时顺序依次处理。此时取消不耗标记。'],
 fencheng_response:['sgs.fencheng','焚城','由你弃至少X张手牌／装备，或受2点火伤','可多弃抬高后继门槛；不足X不能部分支付。选择完成后确认整批弃置，不能用闪／无懈响应技能火伤。']
});
const STAGES=SGS_IDENTITY_NEXT_PROMPT_CONTEXTS;
const ids=new Set(Object.values(STAGES).map(row=>row[0]));
const seat=v=>v==='player'?'p1':v,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const n=v=>Number.isSafeInteger(v)&&v>=0?v:'?',category=v=>({basic:'基本',trick:'锦囊',equipment:'装备'}[v]??'未知类别');
const list=v=>Array.isArray(v)?v:[];
export const isSgsIdentityNextPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||ids.has(p?.meta?.skill_id)||ids.has(p?.meta?.source_skill_id);
export function isSgsIdentityNextPrompt(p){const m=p?.meta??{},row=STAGES[m.stage];return Boolean(row&&row[0]===skill(p)&&p.kind==='choice'&&typeof p.prompt_id==='string'&&p.prompt_id&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsIdentityNextPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsIdentityNextPrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
// A response branch (decline / damage) still resolves the committed skill. It is not cancellation.
export const isSgsIdentityNextMandatory=p=>['junxing_payment','yuce_payment','mieji_branch','mieji_discard','fencheng_response'].includes(p?.meta?.stage)||p?.meta?.mandatory===true;
const isCancel=id=>['cancel','pass','0','n'].includes(id);
const selectedFor=p=>p.meta.stage==='junxing_cost'?list(p.meta.selected_ids):list(p.meta.selected);
function PublicCard({card}){return card&&!card.hidden?html`<span className="sgs-identity-next-public-card">${card.name??card.type??'已展示牌'} · ${card.suit??'无花色'} ${card.rank??'无点数'}${card.category?` · ${category(card.category)}`:''}</span>`:null;}
export function SgsIdentityNextResponseContext({state,prompt}){
 if(!isSgsIdentityNextPromptOwner(prompt,state))return null;
 const m=prompt.meta,r=STAGES[m.stage];
 return html`<section className="response-context sgs-identity-next-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者自行决定</div><strong>${r[2]}</strong><p>${r[3]}</p>
 ${m.stage==='junxing_cost'?html`<p aria-live="polite" data-junxing-selection>已选 ${selectedFor(prompt).length} 张 · 类别：${list(m.selected_categories).map(category).join('、')||'无'} · 仅手牌，尚未支付</p>`:null}
 ${m.stage==='junxing_payment'?html`<p data-junxing-payment>已支付 ${n(m.draw_count)} 张 · 不能弃这些类别：${list(m.excluded_categories).map(category).join('、')||'未知'}。翻面分支摸 ${n(m.draw_count)} 张，不是摸至该数量。</p>`:null}
 ${m.stage==='yuce_payment'?html`<p data-yuce-reveal>唯一已公开牌：<${PublicCard} card=${m.revealed_card} />。其余暗牌不会公开。</p>`:null}
 ${m.stage==='mieji_discard'?html`<p data-mieji-step>当前分支：${m.branch==='trick'?'一张锦囊':m.branch==='nontrick'?'非锦囊逐张弃置':'按合法选项选择'}；第 ${n(m.ordinal)} / ${n(m.max_count)} 张，仅当前选择完成后才进入下一步。</p>`:null}
 ${m.stage==='fencheng_response'?html`<div className="sgs-identity-next-fire-threshold"><p data-fencheng-threshold><strong>当前门槛 X=${n(m.x)}</strong> · 发动时上家 ${m.predecessor_id??'未知'} 本次已弃 ${n(m.predecessor_discard_count)} 张</p><p aria-live="polite" data-fencheng-selection>已选 ${selectedFor(prompt).length} 张；${Number.isSafeInteger(m.x)&&selectedFor(prompt).length>=m.x?'已达到门槛，可确认或继续多选':'尚未达到门槛，也可选择受2点火伤'}。</p><p data-fencheng-order>固定顺序：${list(m.queue_ids).join(' → ')} · 当前响应：${m.responder_id??prompt.player_id}</p></div>`:null}
 ${r[0]==='sgs.mieji'||r[0]==='sgs.fencheng'?html`<p className="sgs-identity-next-h8" data-host-policy="H8">H8江湖兼容：已提交效果不因原持有者死亡／失技退款；固定队列与上家不随换座改变，死亡目标跳过，终局停止。非当前移动客户端认证。</p>`:null}
 <small>仅显示当前选择者自己的材料。Tab定位、Enter确认；${isSgsIdentityNextMandatory(prompt)?'已提交响应不能用Esc取消，请完成合法分支':'可按Esc放弃当前未提交选择'}。</small></section>`;
}
export function sgsIdentityNextSendOnce(ref,key,busy,onRespond,value){if(busy||!key||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)return Promise.resolve(result).catch(error=>{if(ref.current===key)ref.current=null;});return result;}catch(error){ref.current=null;throw error;}}
export function SgsIdentityNextChoiceButtons({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const ownGuard=useRef(null),sent=responseGuard??ownGuard;if(!isSgsIdentityNextPromptOwner(prompt,state))return null;
 const m=prompt.meta,stage=m.stage,self=state.players.self,multi=['junxing_cost','fencheng_response'].includes(stage),selected=selectedFor(prompt),mandatory=isSgsIdentityNextMandatory(prompt);
 const ownStages=['junxing_cost','junxing_payment','yuce_reveal','yuce_payment','mieji_cost','mieji_discard','fencheng_response'];
 const own=ownStages.includes(stage),equipment=['mieji_discard','fencheng_response'].includes(stage);
 const cardFor=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:equipment&&/^eq:[a-z_]+$/.test(id)?self.equipment?.[id.slice(3)]:null;
 const options=list(prompt.options).filter(o=>o&&typeof o.id==='string'&&(!mandatory||!isCancel(o.id)));
 return html`<div className="sgs-identity-next-choices" data-choice-stage=${stage}><div className="dialog-actions wrap">${options.map(o=>{
  const material=/^(hand|eq):/.test(o.id),card=material&&own?cardFor(o.id):null;
  if(material&&(!own||!card||card.hidden))return null;
  const notEnough=o.id==='done'&&stage==='junxing_cost'&&selected.length<1||o.id==='discard'&&stage==='fencheng_response'&&(!Number.isSafeInteger(m.x)||selected.length<m.x);
  return html`<section key=${o.id} className=${material?'sgs-identity-next-material':''}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className=${`btn option ${selected.includes(o.id)?'on':''}`} data-option-id=${o.id} aria-pressed=${multi&&material?selected.includes(o.id):undefined} disabled=${busy||!!o.disabled||notEnough} onClick=${()=>sgsIdentityNextSendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${o.label}</button></section>`;
 })}</div></div>`;
}
export function SgsIdentityNextStatus({player}){
 if(!player)return null;const hero=player.effective_hero||player.hero,skills=list(hero?.skill_ids),man=player.sgs_manchong,li=player.sgs_liru;
 const showMan=man||skills.some(id=>['sgs.junxing','sgs.yuce'].includes(id)),showLi=li||skills.some(id=>['sgs.juece','sgs.mieji','sgs.fencheng'].includes(id));if(!showMan&&!showLi)return null;
 return html`<section className="player-card-status sgs-identity-next-status" data-identity-next-status=${player.seat}>
 ${showMan?html`<div className="sgs-identity-next-manchong"><p data-junxing-used=${typeof man?.junxing_used==='boolean'?String(man.junxing_used):'unknown'}>峻刑：本真实出牌阶段${typeof man?.junxing_used!=='boolean'?'额度待同步':man.junxing_used?'已用':'未用'}。</p>${list(man?.junxing_events).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-junxing-result>已弃 ${n(r.count)} 张（${list(r.categories).map(category).join('、')}）；${r.branch==='discard'?'目标弃一张异类手牌':r.flipped?`目标已翻面，实际摸${n(r.drawn)}张`:'等待目标结算'}。</p>`)}${list(man?.yuce_events).filter(r=>r.committed&&r.reveal).slice(-1).map(r=>html`<details key=${r.event_id} onKeyDown=${close} data-yuce-public-reveal><summary>御策 · 查看唯一已展示牌与结果</summary><p><${PublicCard} card=${r.reveal} /></p><p>${r.paid?'来源已弃一张异类手牌':r.status==='done'?`来源未支付，实际回复${n(r.recovered)}点`:'等待来源选择'}。这是伤害后的结算；展示牌仍属原持有者。</p></details>`)}</div>`:null}
 ${showLi?html`<div className="sgs-identity-next-liru"><p data-mieji-used=${typeof li?.mieji_used==='boolean'?String(li.mieji_used):'unknown'}>灭计：本真实出牌阶段${typeof li?.mieji_used!=='boolean'?'额度待同步':li.mieji_used?'已用，成本已置全局牌堆顶':'未用'}。</p><p className="sgs-identity-next-limited" data-fencheng-used=${typeof li?.fencheng_used==='boolean'?String(li.fencheng_used):'unknown'}>焚城 · 限定标记：${typeof li?.fencheng_used!=='boolean'?'待同步':li.fencheng_used?'已消耗，本局不刷新':'未消耗，本局一次'}。</p>${list(li?.mieji_events).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-mieji-result>灭计：一张成本已置全局牌堆顶；目标 ${r.target_id} ${r.branch==='trick'?'选择锦囊':r.branch==='nontrick'?'选择逐次非锦囊':'正在选分支'}，已弃 ${n(r.discarded_count)} 张。${r.stopped==='branch_shortfall'?'该分支已无可弃材料，结束。':''}</p>`)}
 ${list(li?.fencheng_events).filter(r=>r.committed).slice(-1).map(r=>html`<details key=${r.event_id} onKeyDown=${close} data-fencheng-public-queue><summary>焚城 · 固定队列与逐人结算</summary><p>发动时固定顺序：${list(r.queue_ids).join(' → ')}；${r.status==='done'?'该次结算已结束':`当前响应：${r.responder_id??'等待'}`}。</p><p>原发动归属：${r.causal_owner_id??'未知'}。H8：若该角色已死，之后伤害按无实际来源处理。</p><ol>${list(r.responses).map((item,i)=>html`<li key=${`${item.target_id}:${i}`} data-fencheng-response=${item.target_id}>${item.target_id}：发动时上家 ${item.predecessor_id} 已弃 ${n(item.predecessor_discard_count)}，X=${n(item.x)}；${item.status==='skipped_dead'?'已死亡，跳过新选择':item.choice==='discard'?`实际整批弃${n(item.actual_discard_count)}张`:item.choice==='damage'?'选择承受2点火伤，实际伤害由统一伤害／救援流程决定':'等待本人选择'}。</li>`)}</ol></details>`)}
 <small data-host-policy="H8">2015-12-01历史李儒；已提交事务按H8江湖兼容继续，非当前客户端认证。</small></div>`:null}
 </section>`;
}
