/** Isolated source-selected guides and owner-bound UI. No gameplay registration or source art. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_FUTURE_IDENTITY_HERO_IDENTITIES=freeze({
  "sgs.adapted.base.hero.ling-cao": {
    "name": "凌操",
    "hp": 4,
    "max_hp": 4,
    "faction": "吴",
    "gender": "男",
    "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "portrait_path": "./portraits-sgs-future-identity/ling-cao.svg",
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "FH0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-59.html",
      "https://wiki.biligame.com/msgs/凌操"
    ]
  },
  "sgs.adapted.base.hero.sun-ru": {
    "name": "孙茹",
    "hp": 3,
    "max_hp": 3,
    "faction": "吴",
    "gender": "女",
    "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "portrait_path": "./portraits-sgs-future-identity/sun-ru.svg",
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "FH0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-58.html",
      "https://wiki.biligame.com/msgs/孙茹"
    ]
  },
  "sgs.adapted.base.hero.yue-jin": {
    "name": "乐进",
    "hp": 4,
    "max_hp": 4,
    "faction": "魏",
    "gender": "男",
    "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "portrait_path": "./portraits-sgs-future-identity/yue-jin.svg",
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "FH0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-82.html",
      "https://wiki.biligame.com/msgs/乐进",
      "https://www.sanguosha.cn/pc/guide-info-3.html"
    ]
  }
});
export const SGS_FUTURE_IDENTITY_HERO_SKILLS_BY_ID=freeze({
  "sgs.adapted.base.hero.ling-cao": [
    {
      "id": "sgs-future-identity-dujin",
      "source_skill_id": "sgs.dujin",
      "name": "独进",
      "icon": "sgs-future-identity-dujin",
      "activeId": null,
      "type": "optional",
      "summary": "正常摸牌时可多摸⌊装备区实体数 / 2⌋ + 1张",
      "condition": "自己的真实正常摸牌阶段，确定普通摸牌数量时，仍存活并持有独进。无需有装备；普通数量为0仍可修正。",
      "phase_use": "没有自由出牌按钮。提示中显示当前装备实体数E和额外张数，可发动或放弃。",
      "response": "选择发动后并入这次正常摸牌；不会另开一份摸牌。放弃不改变原数量。",
      "disabled_reason": "正常摸牌被替换、摸牌阶段或整回合跳过、同事件已处理、死亡／失技或对局结束。",
      "timing": "自己的真实正常摸牌数量确定窗口",
      "cost": "无牌、体力或跳阶段成本",
      "limit": "每个真实正常摸牌事件一次机会；不设每回合／整轮固定次数上限",
      "effect": "额外数量为floor(E/2)+1，向下取整。E=0/1、2/3、4/5分别多1、2、3；E=6多4，不增设四装备／五装备上限。只计当前装备区内实体，即使装备效果被压制或该车受保护不能弃也计数。手中装备、空槽、判定区、专属堆、装备下存牌都不计。",
      "targets": "自己；不选择其他角色",
      "notes": [
        "所选移动版经典身份来源，2026-10-15选择快照，2026-10-16实际读取。未实测2026当前移动客户端；实时读取不认证此前历史网页状态。不混入OL、界、谋或国战。",
        "提交时重新核对实际装备区，不沿用回合开始时数量。普通摸牌完全替换后没有残留独进。",
        "额外真实摸牌阶段产生新机会；额外出牌阶段不产生独进。普通牌堆耗尽只摸可用牌，不创造实体。",
        "FH2：过期输入重新校验；重复输入和重放不会再次加成。"
      ],
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-59.html",
        "https://wiki.biligame.com/msgs/凌操"
      ]
    }
  ],
  "sgs.adapted.base.hero.sun-ru": [
    {
      "id": "sgs-future-identity-yingjian",
      "source_skill_id": "sgs.yingjian",
      "name": "影箭",
      "icon": "sgs-future-identity-yingjian",
      "activeId": null,
      "type": "optional",
      "summary": "准备阶段可无材料视为使用无距离限制的普通杀",
      "condition": "自己的真实准备阶段，存活、仍有技能，至少有一名普通杀可合法指定的其他角色。",
      "phase_use": "没有自由出牌按钮。准备阶段直接选择合法目标或放弃；可选队友，空手也可发动。",
      "response": "是真实虚拟牌使用，目标可正常出闪，武器与杀的目标／响应／伤害规则照常结算。",
      "disabled_reason": "整个回合或准备阶段跳过、同准备事件已处理、无人满足普通杀目标限制、死亡／失技或终局。",
      "timing": "自己的真实准备阶段",
      "cost": "零实体材料；不弃牌、不失去体力、不跳过任何阶段",
      "limit": "每个真实准备阶段一次机会；不消耗后来出牌阶段的杀额度",
      "effect": "视为使用一张普通杀，无花色、颜色和点数，无实体材料。不限制距离，但不改变实际攻击范围，普通使用与目标禁令仍有效。进入真实用牌历史，绝非不可响应的独立技能伤害；装备可按正常规则改变杀属性。空手不等于使用最后一张实体手牌。",
      "targets": "一名其他存活且对普通杀合法的角色；不限阵营，技能本身不赠送额外目标",
      "notes": [
        "所选移动版经典身份来源，2026-10-15选择快照，2026-10-16实际读取。未实测2026当前移动客户端；实时读取不认证此前历史网页状态。不混入OL、界、谋或国战。",
        "后来判定令摸牌／出牌阶段跳过，不抹去先前准备机会；额外出牌阶段不额外触发。",
        "FH6：零材料杀不会进入牌堆／弃牌堆，也无可回收实体；正常附加目标效果仍走统一用牌流程。"
      ],
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-58.html",
        "https://wiki.biligame.com/msgs/孙茹"
      ]
    },
    {
      "id": "sgs-future-identity-shixin",
      "source_skill_id": "sgs.shixin",
      "name": "释衅",
      "icon": "sgs-future-identity-shixin",
      "activeId": null,
      "type": "locked",
      "summary": "锁定：防止自己将受到的全部火焰伤害",
      "condition": "自己为当前实际接收者，仍有效持有释衅，收到正数火焰伤害。",
      "phase_use": "锁定技自动生效，没有按钮和选择窗口。官方页隐藏技能面板也属于完整固有能力。",
      "response": "防止全部本次火伤。没有实际受伤，不进入濒死或伤后收益，也不因这次防止启动新连环传导。",
      "disabled_reason": "伤害为普通／雷电、直接失去体力、自己造成给别人的火伤，或释衅已失效／失去。",
      "timing": "火焰伤害的当前接收者结算前",
      "cost": "无成本，不摸牌、不回血",
      "limit": "每个适用火伤事件均防止，不设每回合次数上限",
      "effect": "包括火杀、火属性锦囊、独立技能、无来源火伤及连环分支。被防止的自己保持连环状态，其他已排队连环接收者继续。防具无视不等于无视此固有锁定技。",
      "targets": "自己作为当前伤害接收者；转移改变接收者后重查",
      "notes": [
        "所选移动版经典身份来源，2026-10-15选择快照，2026-10-16实际读取。未实测2026当前移动客户端；实时读取不认证此前历史网页状态。不混入OL、界、谋或国战。",
        "FH7江湖兼容：当前接收者强制免火先于可选转移，以及接收方防具／攻车耐久成本；转移到新接收者再检查。",
        "已提交的来源侧成本不退款。以上跨游戏顺序是宿主约定，非移动版原生混搭裁定。"
      ],
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-58.html",
        "https://wiki.biligame.com/msgs/孙茹"
      ]
    }
  ],
  "sgs.adapted.base.hero.yue-jin": [
    {
      "id": "sgs-future-identity-xiaoguo",
      "source_skill_id": "sgs.xiaoguo",
      "name": "骁果",
      "icon": "sgs-future-identity-xiaoguo",
      "activeId": null,
      "type": "optional",
      "summary": "他人结束阶段可弃1基本手牌；对方弃装备令自己摸1，或受1普通伤害",
      "condition": "另一存活角色真实结束阶段开始（正常弃牌后），本人存活、有技能及1张可弃的基本手牌。",
      "phase_use": "没有自由出牌按钮。先由本人选1张基本手牌或放弃，支付后由结束阶段角色自行决定分支。",
      "response": "目标弃1张合法装备牌，乐进摸1；或目标受乐进造成的1点普通独立技能伤害。有装备也可选受伤。",
      "disabled_reason": "自己的结束阶段、他人结束阶段／整回合跳过、无可弃基本手牌、同事件已处理、死亡／失技或终局。",
      "timing": "其他角色真实结束阶段开始；不是弃牌前旧回合结束钩子",
      "cost": "先弃自己的1张基本手牌；按弃置上下文判类，仅使用／打出时转换不适用。目标付款为自己的1张装备牌，可用手牌或装备区",
      "limit": "每个他人真实结束阶段一次机会；不设整轮三次或集中一人的限制，额外真实结束阶段可再触发",
      "effect": "目标可弃手牌／装备区装备，不能用判定区、专属堆或不可弃受保护攻车假付。成功付款后乐进摸1，目标不摸、不将装备交给乐进。未付款则1点普通技能伤害，不是杀或失去体力；不可用闪／无懈响应，正常减伤、防止、濒死救援仍适用。弃置成本不是伤害材料，不能被奸雄当伤害牌拿走。",
      "targets": "固定为该真实结束阶段角色；不检查距离，不要求目标有牌，不按阵营限制",
      "notes": [
        "所选移动版经典身份来源，2026-10-15选择快照，2026-10-16实际读取。未实测2026当前移动客户端；实时读取不认证此前历史网页状态。不混入OL、界、谋或国战。",
        "自己翻面仍可在别人结束阶段发动。弃牌后的实际牌区状态决定合法成本和装备响应。",
        "所选身份版本包含弃装备后乐进摸1；不采用历史国战不摸牌分支，不引入国战揭示／珠联璧合。2020-04-16官网承载攻略为同产品玩家资料，非官方裁定。",
        "FH5江湖兼容：成本提交后不退款；乐进因成本离区效果死亡时不启动新的伤害／摸牌。目标付装备后因离区效果死亡，仍存活的乐进在未终局时完成已承诺摸1。"
      ],
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-82.html",
        "https://wiki.biligame.com/msgs/乐进",
        "https://www.sanguosha.cn/pc/guide-info-3.html"
      ]
    }
  ]
});
export const SGS_FUTURE_IDENTITY_HOST_POLICIES=freeze([
  {
    "id": "FH0",
    "text": "4／3／4是凌操／孙茹／乐进经典模板体力上限。独立起始体力来源字段未知；满体力开局是江湖初始化，不含身份主公加成。阵营、性别与对局队伍、身份分开保存。"
  },
  {
    "id": "FH1",
    "text": "按上下文识别牌：使用／打出转换不改变弃置成本类别。独进数实体装备，受保护或效果压制仍计入；手牌装备与其他牌区不计入。"
  },
  {
    "id": "FH2",
    "text": "真实事件、持有者、技能绑定与稳定提示ID共同去重；过期选择提交前重查，重复输入／重放不重复扣牌、摸牌或用杀。未提交放弃无成本。"
  },
  {
    "id": "FH3",
    "text": "实际原子移牌与已提交回执先于嵌套离区效果；只有真实移动成功才算付款。牌堆不足只取可用实体，不补造牌。"
  },
  {
    "id": "FH4",
    "text": "阶段跳过不制造技能窗口；完全替换正常摸牌不保留独进。额外真实阶段有独立事件，额外出牌不额外产生准备／摸牌／结束。翻面乐进仍可在他人结束阶段发动。"
  },
  {
    "id": "FH5",
    "text": "跨游戏生命周期：已付骁果成本不退，已死持有者不再启动新的伤害／摸牌。目标弃装备后嵌套死亡，存活乐进仍在未终局时完成已承诺摸1。"
  },
  {
    "id": "FH6",
    "text": "影箭是零材料普通杀真实使用，无花色／颜色／点数，不耗出牌杀额度，不跳阶段。仍遵守其他目标与用牌禁令，空手不会伪装使用最后实体手牌。"
  },
  {
    "id": "FH7",
    "text": "江湖兼容，非移动客户端认证：当前接收者释衅强制免火先于可选转移及接收方防具／攻车耐久成本；新接收者重新检查。来源侧已付成本不退；无实际火伤便不触发伤后、濒死、新连环或解除本人连环。"
  },
  {
    "id": "FH8",
    "text": "能力按实际有效技能及绑定归属；复制完整库存包含孙茹释衅，不复制他人回执、不刷新同事件已用机会。性别为男／女／男。"
  },
  {
    "id": "FH9",
    "text": "保存／重放待决提示与公开回执，不能把未完成回调当完成。选择者仅见自己的私有牌，其他人只见该时点已经公开的成本与结果。"
  },
  {
    "id": "FH10",
    "text": "仅所选经典身份模板；没有个人主公技、授予技、获得技或衍生牌。OL向上取整独进、历史国战骁果无摸牌及其他模式不在本批；美术全新原创。"
  }
]);
export const SGS_FUTURE_IDENTITY_SKILL_ICONS=freeze({
 'sgs-future-identity-dujin':'<path d="M3 27h26M6 22l10-5 10 5-4 5H10ZM16 17V3l10 5-10 5M4 5h5v7H4Zm0 11h5m14-2h5v5h-5M12 23h8"/>',
 'sgs-future-identity-yingjian':'<path d="M8 3q17 13 0 26M8 3v26M3 16h25m-6-5 6 5-6 5M11 8l-3 8 3 8M2 12l4 4-4 4"/>',
 'sgs-future-identity-shixin':'<path d="M16 2 28 7v10q-2 8-12 13Q6 25 4 17V7ZM18 9q4 7 2 10-1 4-5 4-5-1-4-6 2 1 3-1l-1-5 5 4V9ZM7 27 27 5"/>',
 'sgs-future-identity-xiaoguo':'<path d="M3 4h9v14H3Zm3 4h3m-3 4h3M17 4l5 3 7-3v9l-7 7-5-7ZM6 22v7m-3-3 3 3 3-3M14 27l13-13m-9 1 8 8M13 20l-2 9 9-2"/>'
});
const list=v=>Array.isArray(v)?v:[],n=v=>Number.isSafeInteger(v)&&v>=0?v:'?';
const close=e=>{if(e.key==='Escape'&&e.currentTarget.open){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsFutureIdentityPolicyGuide({hero}){
 const h=SGS_FUTURE_IDENTITY_HERO_IDENTITIES[hero?.id];if(!h)return null;
 return html`<details className="hero-provenance sgs-future-identity-policy" onKeyDown=${close}><summary>FH0–FH10 · 经典身份来源与江湖兼容</summary><p>凌操4体力吴男：独进。孙茹3体力吴女：影箭／释衅。乐进4体力魏男：骁果。无个人主公技、授予技、获得技或专属衍生牌。</p><p>选择快照2026-10-15；实际读取2026-10-16，不认证历史网页状态。未实测2026当前移动客户端。完整来源目标仍未完成，本批不代表全角色或全模式覆盖。曹昂仍留置，不在本批可用清单。</p><ol>${SGS_FUTURE_IDENTITY_HOST_POLICIES.filter(p=>p.id!=='FH7'||hero.id==='sgs.adapted.base.hero.sun-ru').map(p=>html`<li key=${p.id} data-policy-id=${p.id}><strong>${p.id}</strong> · ${p.text}</li>`)}</ol><p className="hero-source-links">${h.source_urls.map((url,i)=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${i===0?`${h.name}官方身份目录`:i===1?'同产品社区：经典体力／性别与规则佐证':'2020-04-16官网承载玩家攻略'}</a>`)}</p></details>`;
}
export function SgsFutureIdentityHpEvidence({hero}){
 const h=SGS_FUTURE_IDENTITY_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-future-identity-source=${hero.id}>${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。同产品经典社区明确体力／性别字段；未从画像猜测，官方目录无独立体力／性别字段。独立初始体力字段未知；${h.hp}/${h.hp}满体力开局是FH0宿主初始化，不含身份主公加成。未实测2026当前移动客户端。</p>`:null;
}
export const SGS_FUTURE_IDENTITY_PROMPT_CONTEXTS=freeze({
 dujin_choice:['sgs.dujin','独进','正常摸牌：是否多摸⌊装备实体数 / 2⌋ + 1张？','0装备也可发动，向下取整。只计当前装备区实体，包括效果压制或受保护装备；并入这次正常摸牌。'],
 yingjian_target:['sgs.yingjian','影箭','准备阶段：选择一名普通杀合法目标，或放弃','无材料、无花色／颜色／点数，不限距离，不跳阶段，不消耗后来出牌杀额度。普通杀目标禁令与出闪响应仍有效。'],
 xiaoguo_cost:['sgs.xiaoguo','骁果','他人结束阶段：可弃1张基本手牌','只用自己的可弃基本手牌，按弃置上下文判类。尚未支付，可放弃；确认支付后不退成本，随后由目标自行选分支。'],
 xiaoguo_equipment:['sgs.xiaoguo','骁果','由你弃1张装备令发动者摸1，或受1点普通伤害','手牌或装备区的合法装备都可支付；不可用判定／专属堆或不可弃受保护攻车。即使有装备，也可选受伤。这是技能伤害，无闪／无懈响应。']
});
const STAGES=SGS_FUTURE_IDENTITY_PROMPT_CONTEXTS,skillIds=new Set(['sgs.dujin','sgs.yingjian','sgs.shixin','sgs.xiaoguo']);
const seat=v=>v==='player'?'p1':v,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
// Broad identification must precede the strict check in the host dialog: invalid/private DTOs never fall through to a generic renderer.
export const isSgsFutureIdentityPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||skillIds.has(p?.meta?.skill_id)||skillIds.has(p?.meta?.source_skill_id);
export function isSgsFutureIdentityPrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&p.kind==='choice'&&typeof p.prompt_id==='string'&&p.prompt_id.trim()&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsFutureIdentityPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsFutureIdentityPrompt(p)&&typeof self==='string'&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
// Equipment refusal is a committed damage branch, not cancellation even when the DTO says optional:true.
export const isSgsFutureIdentityMandatory=p=>p?.meta?.stage==='xiaoguo_equipment'||p?.meta?.mandatory===true;
export function SgsFutureIdentityResponseContext({state,prompt}){
 if(!isSgsFutureIdentityPromptOwner(prompt,state))return null;
 const m=prompt.meta,r=STAGES[m.stage],mandatory=isSgsFutureIdentityMandatory(prompt);
 return html`<section className="response-context sgs-future-identity-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者自行决定</div><strong>${r[2]}</strong><p>${r[3]}</p>
 ${m.stage==='dujin_choice'?html`<p aria-live="polite" data-dujin-count>装备实体 E=${n(m.equipment_count)} · 额外 ${n(m.bonus)} 张 · 原正常摸牌 ${n(m.ordinary_draw_count)} 张。E=0/1→+1；2/3→+2；4/5→+3。没有四装备上限。</p>`:null}
 ${m.stage==='yingjian_target'?html`<p data-yingjian-identity>真实使用普通杀 · 材料0张 · 不消耗出牌阶段杀额度；空手不算用掉最后手牌。队友与远处角色是否可选，以当前合法目标为准。</p>`:null}
 ${m.stage==='xiaoguo_cost'||m.stage==='xiaoguo_equipment'?html`<p data-xiaoguo-actors>发动者：${m.owner_id??'乐进持有者'} · 本次结束阶段角色：${m.target_id??'当前目标'}。</p>`:null}
 ${m.stage==='xiaoguo_equipment'?html`<p data-xiaoguo-committed>发动者的基本手牌成本已提交。弃1张装备→发动者摸1；选择受伤→由统一伤害／救援流程结算1点普通伤害。成本牌不是造成伤害的牌。</p>`:null}
 ${r[0]==='sgs.xiaoguo'?html`<small data-host-policy="FH5">FH5江湖兼容：已付成本不退；死亡持有者不启动新动作，已付款后的离区效果按公开生命周期处理。非移动版原生混搭裁定。</small>`:null}
 <small>只显示当前选择者自己的材料。Tab定位，Enter确认；${mandatory?'已提交响应不能按Esc取消，请选择合法付款或受伤':'可按Esc放弃当前未提交选择'}。过期选择会重新校验，重复输入不会重复结算。</small></section>`;
}
export function sgsFutureIdentitySendOnce(ref,key,busy,onRespond,value){if(busy||!key||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)return Promise.resolve(result).catch(()=>{if(ref.current===key)ref.current=null;});return result;}catch(error){if(ref.current===key)ref.current=null;throw error;}}
const equipmentSlots=new Set(['weapon','armor','offensive_horse','defensive_horse']);
export function SgsFutureIdentityChoiceButtons({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const local=useRef(null),sent=responseGuard??local;if(!isSgsFutureIdentityPromptOwner(prompt,state))return null;
 const stage=prompt.meta.stage,self=state.players.self,mandatory=isSgsFutureIdentityMandatory(prompt);
 const cardFor=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:stage==='xiaoguo_equipment'&&id.startsWith('eq:')&&equipmentSlots.has(id.slice(3))?self.equipment?.[id.slice(3)]:null;
 const allowed=id=>stage==='dujin_choice'?['activate','decline'].includes(id):stage==='yingjian_target'?id==='decline'||/^target:.+/.test(id):stage==='xiaoguo_cost'?/^hand:[1-9]\d*$/.test(id)||id==='pass':stage==='xiaoguo_equipment'?/^(hand:[1-9]\d*|eq:(weapon|armor|offensive_horse|defensive_horse))$/.test(id)||id==='damage':false;
 const seen=new Set(),options=list(prompt.options).filter(o=>{if(!o||typeof o.id!=='string'||seen.has(o.id)||!allowed(o.id)||mandatory&&['pass','decline','cancel'].includes(o.id))return false;seen.add(o.id);return true;});
 return html`<div className="sgs-future-identity-choices" data-choice-stage=${stage}><div className="dialog-actions wrap">${options.map(o=>{
  const material=/^(hand|eq):/.test(o.id),card=material?cardFor(o.id):null;
  if(material&&(!card||card.hidden))return null;
  return html`<section key=${o.id} className=${material?'sgs-future-identity-material':''}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${o.id} disabled=${busy||!!o.disabled} aria-describedby=${o.disabled&&o.reason?`future-reason-${stage}-${o.id.replace(/[^\w-]/g,'-')}`:undefined} onClick=${()=>sgsFutureIdentitySendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${o.label??o.id}</button>${o.disabled&&o.reason?html`<small id=${`future-reason-${stage}-${o.id.replace(/[^\w-]/g,'-')}`}>${o.reason}</small>`:null}</section>`;
 })}</div></div>`;
}
export function SgsFutureIdentityStatus({player}){
 if(!player)return null;const skills=list((player.effective_hero||player.hero)?.skill_ids),ling=player.sgs_lingcao,sun=player.sgs_sunru,yue=player.sgs_yuejin;
 const showLing=ling||skills.includes('sgs.dujin'),showSun=sun||skills.some(s=>s==='sgs.yingjian'||s==='sgs.shixin'),showYue=yue||skills.includes('sgs.xiaoguo');if(!showLing&&!showSun&&!showYue)return null;
 return html`<section className="player-card-status sgs-future-identity-status" data-future-identity-status=${player.seat}>
 ${showLing?html`<div><p>独进：真实正常摸牌时可多摸⌊装备实体数 / 2⌋ + 1。</p>${list(ling?.dujin_events).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id??r.phase_event_id} data-dujin-result>本次装备实体 ${n(r.equipment_count)} 张，正常摸牌数量增加 ${n(r.bonus)} 张；实际到手仍按牌堆可用数结算。</p>`)}</div>`:null}
 ${showSun?html`<div>${skills.includes('sgs.yingjian')||sun?html`<p>影箭：真实准备阶段可无材料使用普通杀，不耗后来出牌杀额度。</p>`:null}${list(sun?.yingjian_events).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.phase_event_id} data-yingjian-result>已提交零材料普通杀，目标 ${r.target_id??'已公开目标'}；使用结果由普通杀响应流程决定。</p>`)}${skills.includes('sgs.shixin')||sun?html`<p data-shixin-locked>释衅 · 锁定：有效持有时防止接收的全部火焰伤害，不防普通／雷伤或直接体力流失。</p>`:null}${list(sun?.shixin_events).filter(r=>Number.isSafeInteger(r.prevented)&&r.prevented>0).slice(-1).map(r=>html`<p key=${r.damage_event_id} data-shixin-result>释衅已防止 ${n(r.prevented)} 点火焰伤害；没有本次受伤或由此解除连环。</p>`)}<small data-host-policy="FH7">FH7江湖兼容：免火先于当前接收方可选转移与防具／攻车耐久成本；来源侧已付成本不退。</small></div>`:null}
 ${showYue?html`<div><p>骁果：每个他人真实结束阶段一次机会，无整轮固定次数上限。</p>${list(yue?.xiaoguo_events).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-xiaoguo-result>已弃基本手牌成本；目标 ${r.target_id??'当前结束阶段角色'}：${r.equipment_paid?(r.status==='done'?`已弃装备，发动者实际摸${n(r.drawn)}张`:'已弃装备，等待发动者摸牌结算'):r.branch==='damage'?(r.status==='done'?`选择1点普通技能伤害，实际伤害${n(r.damage)}点`:'选择1点普通技能伤害，等待伤害／救援结算'):r.stopped?'本次后续已停止，已付成本不退':'等待目标自行选择装备或伤害'}。</p>`)}<small data-host-policy="FH5">FH5江湖兼容：成本已付不退款，死亡／终局按公开生命周期停止新动作。</small></div>`:null}
 </section>`;
}
