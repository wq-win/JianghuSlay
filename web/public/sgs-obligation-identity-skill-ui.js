/** Pure, isolated Chen Lin / Cao Xiu adapters. No game registration, application wiring or native-client certification. */
import {html} from 'htm/react';
import {useEffect,useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_OBLIGATION_IDENTITY_HERO_IDENTITIES=freeze({
  "sgs.adapted.base.hero.chen-lin": {
    "name": "陈琳",
    "hp": 3,
    "max_hp": 3,
    "gender": "男",
    "faction": "魏",
    "source_variant": "mobile-classic-identity-historical-turn-start-bifa-host-lifecycle-selected-2026-10-15",
    "portrait_path": "./portraits-sgs-obligation-identity/chen-lin.svg",
    "skill_ids": [
      "sgs.bifa",
      "sgs.songci"
    ],
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "P0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "native_lifecycle_verified": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-75.html",
      "https://wiki.biligame.com/msgs/陈琳"
    ]
  },
  "sgs.adapted.base.hero.cao-xiu": {
    "name": "曹休",
    "hp": 4,
    "max_hp": 4,
    "gender": "男",
    "faction": "魏",
    "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "portrait_path": "./portraits-sgs-obligation-identity/cao-xiu.svg",
    "skill_ids": [
      "sgs.qianju",
      "sgs.qingxi"
    ],
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "NH0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "native_lifecycle_verified": false,
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-186.html",
      "https://wiki.biligame.com/msgs/曹休"
    ]
  }
});
export const SGS_OBLIGATION_IDENTITY_HERO_SKILLS_BY_ID=freeze({
  "sgs.adapted.base.hero.chen-lin": [
    {
      "name": "笔伐",
      "type": "optional",
      "activeId": null,
      "summary": "结束阶段扣置一手牌；目标真实回合开始交同类手牌换取，或失去1体力",
      "condition": "自己的真实结束阶段，有手牌及没有笔伐牌的其他存活角色。",
      "phase_use": "没有自由出牌按钮。先选自己的1张手牌，再选目标；提交前可取消。",
      "response": "目标本人观看扣置牌，交给来源1张同类别手牌并获得扣置牌；或移去扣置牌，失去1点体力。",
      "disabled_reason": "不是自己的真实结束阶段、该结束事件已用、无手牌或没有其他未带笔伐牌的存活角色。目标响应以实际义务结算，不依赖来源仍有技能。",
      "timing": "自己真实结束阶段扣置；目标下一次真实回合开始结算，早于准备阶段",
      "cost": "放置自己的恰好1张手牌至独立暗置笔伐区；响应只能交1张同三大类别的手牌",
      "limit": "每个真实结束阶段一次机会；每个目标全场至多1张待决笔伐牌",
      "effect": "基本／锦囊／装备只比较类别，不要求同牌名、花色或点数。手中的装备牌可交，装备区不能交；扣置牌不能拿来付自己。成功先交后得，两腿原子提交。拒绝先移去扣置牌，再失去1点体力，不是伤害，不触发防具或伤后收益。",
      "targets": "一名其他存活且没有任何来源笔伐牌的角色；不限制距离或队伍",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。未实测2026当前移动客户端，不认证此前历史网页状态。全来源、全角色和全模式目标仍未完成。",
        "本包采用历史官网“回合开始时”，不替换为当前社区“准备阶段”。P14：翻面整回合跳过先处理，跳过的排程回合不结算；HR17：既有回合开始钩子后、准备前处理独立义务。均非原生时序认证。",
        "只有来源记忆与获授权的目标可看扣置牌，旁观者仅见牌背、数量、来源和目标。公开日志不会提前泄露牌面。",
        "HR15：活着的来源失去技能不取消义务。来源死亡且分支未提交时清牌不扣血；仅观看或打开选择尚未提交。交易两腿提交后不退款；拒绝提交后的来源死亡不取消已承诺体力流失，目标已死则不再扣尸体。",
        "HR16：外国牌区移动限制令整支无法提交时，不造牌不假付、不强扣体力；保留义务至下一真实回合重试。原生生命周期未核验。"
      ],
      "id": "sgs-obligation-identity-bifa",
      "source_skill_id": "sgs.bifa",
      "icon": "sgs-obligation-identity-bifa",
      "source_variant": "mobile-classic-identity-historical-turn-start-bifa-host-lifecycle-selected-2026-10-15",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-75.html",
        "https://wiki.biligame.com/msgs/陈琳"
      ]
    },
    {
      "name": "颂词",
      "type": "active",
      "activeId": "sgs.songci",
      "summary": "每个目标整局一次：手牌少于当前体力摸2，多于当前体力弃2",
      "condition": "自己的真实空闲出牌阶段，有存活目标的手牌数不等于当前体力，且未被此来源颂词。",
      "phase_use": "点颂词后选目标，可选自己。可在同一出牌阶段对多个不同目标发动。",
      "response": "手牌少于当前体力：目标摸2。手牌多于当前体力：目标自己选2张手牌／装备弃置。",
      "disabled_reason": "非本人真实出牌阶段、失技／死亡／正结算；目标已被此来源使用、已死或手牌数等于当前体力。",
      "timing": "自己的每个真实出牌阶段动作窗口",
      "cost": "来源无牌或体力成本；弃置分支由目标选择自己的手牌或装备",
      "limit": "每个来源对每个目标整局限一次；不是每阶段或每回合限一次",
      "effect": "比较手牌数与当前体力，不计装备数，不看体力上限。少则摸2、多则弃2、相等不可选。合法发动时冻结分支并记录终身标记；若嵌套变化后可弃少于2则弃所有剩余合法牌。没有全目标完成奖励。",
      "targets": "任一存活角色，包括自己；同局此来源尚未使用且手牌数不等于当前体力",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。未实测2026当前移动客户端，不认证此前历史网页状态。全来源、全角色和全模式目标仍未完成。",
        "P17：来源／目标稳定ID整局记账。回合、阶段、失去再获得技能、死亡复活不刷新。另一复制者有自己的账本，不能继承或清空他人的标记。",
        "来源选择目标，目标自己选择弃牌。P18：仅手牌／装备，不用判定区、笔伐区或专属堆；两分支共用同一目标标记。"
      ],
      "id": "sgs-obligation-identity-songci",
      "source_skill_id": "sgs.songci",
      "icon": "sgs-obligation-identity-songci",
      "source_variant": "mobile-classic-identity-historical-turn-start-bifa-host-lifecycle-selected-2026-10-15",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-75.html",
        "https://wiki.biligame.com/msgs/陈琳"
      ]
    }
  ],
  "sgs.adapted.base.hero.cao-xiu": [
    {
      "name": "千驹",
      "type": "locked",
      "activeId": null,
      "summary": "锁定：自己计算到其他角色的距离减少当前已损失体力值",
      "condition": "本人存活且千驹有效；每次计算自己到其他角色距离时检查当前体力。",
      "phase_use": "锁定技自动计算，没有发动按钮或次数标记。",
      "response": "距离修正即时变化。回复体力时减小，体力上限变化后按新上限重新计算。",
      "disabled_reason": "满体力时修正0、技能失效或本人死亡。不会修改别人到自己的距离。",
      "timing": "每次由自己到其他角色的定向距离查询",
      "cost": "无牌、体力或次数成本",
      "limit": "持续生效，无每回合或每阶段次数限制",
      "effect": "X=max(0,当前体力上限−当前体力)。对外距离−X，NH4宿主角色间距离下限1。不是攻击范围加成，不重写武器印制范围；固定距离和无视距离仍按原宿主规则。",
      "targets": "自己到每个其他角色，单向修正",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。未实测2026当前移动客户端，不认证此前历史网页状态。全来源、全角色和全模式目标仍未完成。",
        "NH4为跨游戏定向距离兼容，不改变收到攻击的距离，也不能把减距算进倾袭弃牌张数。",
        "当前采用经典曹休，未混入界曹休的清算、颜色或次数机制。"
      ],
      "id": "sgs-obligation-identity-qianju",
      "source_skill_id": "sgs.qianju",
      "icon": "sgs-obligation-identity-qianju",
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-186.html",
        "https://wiki.biligame.com/msgs/曹休"
      ]
    },
    {
      "name": "倾袭",
      "type": "optional",
      "activeId": null,
      "summary": "自己使用杀将伤害直接目标时，可令其弃武器范围张手牌后弃该武器，或伤害+1",
      "condition": "自己使用的杀对其直接目标将造成正数伤害，且装备区有一张具明确自身范围的实际武器。",
      "phase_use": "没有自由出牌按钮。伤害前选择发动及实际武器；发动者可放弃，目标自己选付款或伤害+1。",
      "response": "目标弃恰好X张自己的手牌，然后弃该快照武器；或此伤害+1且不弃武器。有足够手牌也可选择加伤。",
      "disabled_reason": "无实际已装备武器、范围未映射、无正数直接杀伤害、转移／连环后续或决斗／独立技能；无新闪或无懈窗口。",
      "timing": "自己使用杀的直接伤害来源侧窗口；普通响应已经结束",
      "cost": "来源发动无预付成本。目标选择付款时须恰好X张可弃实体手牌，X为具体武器自身印制范围",
      "limit": "每个合格直接杀伤害事件一次机会；无每回合上限，不按每点伤害触发",
      "effect": "付款后仅不加这1点，原杀伤害仍继续。手牌不足不能部分付款，装备／判定／专属堆不可代替。NH6：锁定具体武器实体及其自身范围，忽略持有者总攻击范围和千驹减距；武器效果失效仍保留实体身份。",
      "targets": "当前这张杀的直接目标；由目标选择其手牌",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。未实测2026当前移动客户端，不认证此前历史网页状态。全来源、全角色和全模式目标仍未完成。",
        "NH5：先做来源侧倾袭，再接收方转移、防止、防具及扣血。此为江湖混搭顺序，非原生客户端认证；加伤后仍可能被正常防止。连环后续继承实际根伤害，不再提示倾袭。",
        "NH7：先付完整手牌，再弃原来源装备区的原武器。不追踪已移动的武器，不弃替换武器；后续外国保护阻止弃武器也不退款或补加伤。",
        "NH8：提交后离区触发死亡／失技不退款，已死目标不再受伤；终局停止。NH9：只把当前伤害增加1，不另打一次、不使杀不可闪，也不增加出牌次数。"
      ],
      "id": "sgs-obligation-identity-qingxi",
      "source_skill_id": "sgs.qingxi",
      "icon": "sgs-obligation-identity-qingxi",
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-186.html",
        "https://wiki.biligame.com/msgs/曹休"
      ]
    }
  ]
});
export const SGS_OBLIGATION_IDENTITY_SKILL_ICONS=freeze({
  "sgs-obligation-identity-bifa": "<path d=\"M4 6h16v21H4ZM8 11h7M8 16h7M8 21h5M17 18 26 3l3 2-9 15-4 4ZM22 8l4 2M21 25h8M25 22v7\"/>",
  "sgs-obligation-identity-songci": "<path d=\"M4 6q6-3 12 1 6-4 12-1v21q-6-3-12 1-6-4-12-1ZM16 7v21M7 11h5M7 16h5M7 21h5M20 12h5m-2-3v6M20 21h5\"/>",
  "sgs-obligation-identity-qianju": "<path d=\"M3 25h9l5-9 6 3 6-6-4-8-7-3-3 5-6 2 1 6 7 1M18 2l3 5m0 2h1M18 16l-5 13M23 19l-2 10M3 7h6M2 12h4M1 18h5\"/>",
  "sgs-obligation-identity-qingxi": "<path d=\"M5 27 24 8m-7 1 7 7M24 8l-1-5 6 1-1 6ZM3 22l7 7M3 4h8v11H3Zm12 18h5v10h-5Zm8 1h6m-3-3v6\"/>"
});
const list=v=>Array.isArray(v)?v:[],n=v=>Number.isSafeInteger(v)&&v>=0?v:'?',seat=v=>v==='player'?'p1':v==='ai'?'p2':v==='ai2'?'p3':v;
const text=v=>typeof v==='string'||typeof v==='number'?String(v):'';
const safeCard=c=>c&&typeof c==='object'&&!c.hidden&&typeof c.name==='string'?{name:c.name,type:c.type,suit:c.suit,color:c.color,rank:c.rank}:null;
const close=e=>{if(e.key==='Escape'&&e.currentTarget.open){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export const SGS_OBLIGATION_IDENTITY_HOST_POLICIES=freeze([
 {id:'P0 / NH0',heroes:['chen-lin','cao-xiu'],text:'3／4是陈琳／曹休体力上限。独立初始体力字段未知；满体力开局是江湖初始化，不含身份主公加成。'},
 {id:'P14 / HR17',heroes:['chen-lin'],text:'所选历史笔伐在真实回合开始结算，早于准备阶段。整回合翻面跳过先处理；既有回合开始钩子后再分派独立笔伐。原生细节未核验。'},
 {id:'HR15',heroes:['chen-lin'],text:'活着的来源失技不取消笔伐。来源死亡且分支未提交：清牌不扣血。观看不等于提交；交易两腿原子提交后不退款，拒绝提交后来源死亡不抹去已承诺的体力流失，目标已死不再扣血。'},
 {id:'HR16',heroes:['chen-lin'],text:'外国全牌区移动限制若阻止整支提交，不制造付款或体力流失；保留实体，下一真实目标回合重试。原生生命周期与跨游戏边界未核验。'},
 {id:'P17 / P18',heroes:['chen-lin'],text:'颂词依稳定来源／目标ID整局记账，失去再获得技能或死亡复活不重置。比较手牌与当前体力；少摸2，多弃2手牌／装备，相等不可选。'},
 {id:'NH4',heroes:['cao-xiu'],text:'千驹按当前已损失体力减少对外距离，角色间宿主下限1。不是攻击范围加成，不影响来向距离或武器自身范围。'},
 {id:'NH5 / NH9',heroes:['cao-xiu'],text:'倾袭在来源侧直接杀伤害窗口，早于转移、防止及接收方防具。只加当前伤害1；原杀仍可正常被减免，连环后续不再提示。非原生混搭顺序认证。'},
 {id:'NH6 / NH7',heroes:['cao-xiu'],text:'锁定具体已装备武器及自身印制范围X。目标付恰好X手牌后弃原区原武器，不追牌不弃替换物。后续保护阻止弃武器也不退款或补加伤。'},
 {id:'NH8',heroes:['cao-xiu'],text:'精确手牌付款与分支提交后，嵌套死亡／失技不退款；不伤害已死目标，终局停止。'},
 {id:'P1 / NH1–NH3',heroes:['chen-lin','cao-xiu'],text:'按真实技能归属、稳定事件与实体位置校验。过期输入重查；同一已提交回执不重复扣牌、扣血或摸牌。私有材料只对实际选择者可见。'}
]);
export function SgsObligationIdentityPolicyGuide({hero}){
 const h=SGS_OBLIGATION_IDENTITY_HERO_IDENTITIES[hero?.id];if(!h)return null;const slug=hero.id.endsWith('chen-lin')?'chen-lin':'cao-xiu';
 return html`<details className="hero-provenance sgs-future-identity-policy sgs-obligation-identity-policy" onKeyDown=${close}><summary>经典身份来源 · 历史规则与江湖兼容</summary><p>${h.name} · 魏 · 男 · ${h.hp}体力。完整固有技能：${SGS_OBLIGATION_IDENTITY_HERO_SKILLS_BY_ID[hero.id].map(s=>s.name).join('／')}。无个人主公技、授予技、获得技或专属衍生牌。</p><p>2026-10-15来源选择，2026-10-16读取。未实测2026当前移动客户端；不认证此前历史网页状态。原生生命周期未核验，以下宿主策略不会转为原生认证。本批不代表全角色或全模式覆盖。</p><ol>${SGS_OBLIGATION_IDENTITY_HOST_POLICIES.filter(p=>p.heroes.includes(slug)).map(p=>html`<li key=${p.id} data-policy-id=${p.id}><strong>${p.id}</strong> · ${p.text}</li>`)}</ol><p>${h.source_urls.map((url,i)=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${i===0?'官方经典身份目录':'同产品社区经典字段与规则佐证'}</a> `)}</p></details>`;
}
export function SgsObligationIdentityHpEvidence({hero}){
 const h=SGS_OBLIGATION_IDENTITY_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-obligation-identity-source=${hero.id}>${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。体力／性别取同产品经典明确字段，未从画像猜测。独立初始体力字段未知；${h.hp}/${h.hp}满体力开局是${h.hp===3?'P0':'NH0'}宿主初始化，不含主公加成。未实测2026当前移动客户端。</p>`:null;
}
export const SGS_OBLIGATION_IDENTITY_PROMPT_CONTEXTS=freeze({
 bifa_material:['sgs.bifa','笔伐','结束阶段：选择1张手牌秘密扣置','先选自己的手牌，再选目标；仍未提交，可放弃。不公开牌面，也不触发公开展示。'],
 bifa_target:['sgs.bifa','笔伐','选择没有笔伐牌的其他角色','不限制距离或队伍；选择目标后才提交暗置。可以取消本次尚未提交的放置。'],
 bifa_payment:['sgs.bifa','笔伐','真实回合开始：交同类手牌换取，或移去扣置牌失去1体力','基本／锦囊／装备三大类别相同即可。只交自己的手牌，不能用装备区或扣置牌自身。拒绝是体力流失分支，不是免费取消。'],
 songci_target:['sgs.songci','颂词','选择此来源本局尚未使用过的角色','可选自己；手牌少于当前体力摸2，多于当前体力弃2，相等不可选。每个目标整局一次。'],
 songci_discard:['sgs.songci','颂词','目标自己选择手牌／装备弃置','本次目标标记已提交。逐张选择，由引擎原子弃置；剩余合法牌不足2时弃所有剩余牌，不能取消。'],
 qingxi_weapon:['sgs.qingxi','倾袭','选择一张实际已装备武器发动，或放弃','目标自行选择弃恰好武器自身范围X张手牌后弃这张武器，或此伤害+1。X不取总攻击范围，也不受千驹减距影响。'],
 qingxi_target:['sgs.qingxi','倾袭','选择恰好X张自己的手牌后确认，或此伤害+1','点手牌切换选择，凑足X才可确认。装备区与专属堆不能支付。有足够牌也可选加伤；付款后原杀伤害仍继续。']
});
const STAGES=SGS_OBLIGATION_IDENTITY_PROMPT_CONTEXTS,skills=new Set(['sgs.bifa','sgs.songci','sgs.qianju','sgs.qingxi']);
const eq=/^eq:(weapon|armor|offensive_horse|defensive_horse)$/,hand=/^hand:[1-9]\d*$/;
// Broad routing first: malformed or unknown packet prompts must never reach generic private-message rendering.
export const isSgsObligationIdentityPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||skills.has(p?.meta?.skill_id)||skills.has(p?.meta?.source_skill_id);
export function isSgsObligationIdentityPrompt(p){const m=p?.meta??{},row=STAGES[m.stage];return Boolean(row&&row[0]===(m.skill_id??m.source_skill_id)&&p.kind==='choice'&&typeof p.prompt_id==='string'&&p.prompt_id.trim()&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsObligationIdentityPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsObligationIdentityPrompt(p)&&typeof self==='string'&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
export const isSgsObligationIdentityMandatory=p=>['bifa_payment','songci_discard','qingxi_target'].includes(p?.meta?.stage)||p?.meta?.mandatory===true;
const cancellation={bifa_material:'pass',bifa_target:'cancel',songci_target:'cancel',qingxi_weapon:'pass'};
export function sgsObligationIdentityCancelOption(p,state){if(!isSgsObligationIdentityPromptOwner(p,state)||isSgsObligationIdentityMandatory(p))return null;const id=cancellation[p.meta.stage];return list(p.options).some(o=>o?.id===id&&!o.disabled)?id:null;}
const allowed=(stage,id)=>stage==='bifa_material'?hand.test(id)||id==='pass':stage==='bifa_target'||stage==='songci_target'?/^target:.+/.test(id)||id==='cancel':stage==='bifa_payment'?hand.test(id)||id==='refuse':stage==='songci_discard'?hand.test(id)||eq.test(id):stage==='qingxi_weapon'?eq.test(id)||id==='pass':stage==='qingxi_target'?hand.test(id)||['discard','boost'].includes(id):false;
/** Owner-only materials are resolved from the owner's DTO, never arbitrary option.card or opponent hand data. */
export function sgsObligationIdentityOptions(p,state){
 if(!isSgsObligationIdentityPromptOwner(p,state))return [];
 const stage=p.meta.stage,self=state.players.self,seen=new Set(),selected=new Set(list(p.meta.selected_ids).filter(id=>typeof id==='string'));
 return list(p.options).flatMap(o=>{
  if(!o||typeof o.id!=='string'||seen.has(o.id)||!allowed(stage,o.id)||isSgsObligationIdentityMandatory(p)&&['pass','cancel','decline'].includes(o.id))return [];
  seen.add(o.id);const material=hand.test(o.id)||eq.test(o.id),card=material?safeCard(hand.test(o.id)?self.hand?.[Number(o.id.slice(5))-1]:self.equipment?.[o.id.slice(3)]):null;
  if(material&&!card)return [];
  let disabled=!!o.disabled,reason=text(o.reason);
  if(stage==='songci_discard'&&selected.has(o.id))return [];
  if(stage==='qingxi_target'&&o.id==='discard'){
   const exact=p.meta.exact_count,valid=Number.isSafeInteger(exact)&&exact>0&&p.meta.selected_count===exact&&selected.size===exact&&[...selected].every(id=>hand.test(id)&&safeCard(self.hand?.[Number(id.slice(5))-1])&&list(p.options).some(x=>x?.id===id));
   if(!valid){disabled=true;reason||='须选择恰好指定数量的合法手牌';}
  }
  return [{id:o.id,label:text(o.label)||o.id,disabled,reason,card,selected:stage==='qingxi_target'&&hand.test(o.id)?selected.has(o.id):null}];
 });
}
export function sgsObligationIdentitySendOnce(ref,key,busy,onRespond,value){
 if(busy||typeof key!=='string'||!key.trim()||ref.current===key||typeof onRespond!=='function')return;
 ref.current=key;const reset=()=>{if(ref.current===key)ref.current=null;};
 try{const result=onRespond(value);if(result?.then)return Promise.resolve(result).then(accepted=>{if(accepted===false)reset();return accepted;},()=>{reset();});if(result===false)reset();return result;}catch(error){reset();throw error;}
}
function CardFace({card,CardView}){const c=safeCard(card);if(!c)return null;return CardView?html`<${CardView} card=${{...c,rank_label:({1:'A',11:'J',12:'Q',13:'K'})[c.rank]??String(c.rank??'')}} compact=${true} disabled=${true}/>`:html`<span data-card-face=${c.name}>${c.suit??''} ${c.rank??''} ${c.name}</span>`;}
export function SgsObligationIdentityResponseContext({state,prompt,CardView=null}){
 if(!isSgsObligationIdentityPromptOwner(prompt,state))return null;
 const m=prompt.meta,r=STAGES[m.stage],mandatory=isSgsObligationIdentityMandatory(prompt),weapon=m.weapon;
 return html`<section className="response-context sgs-future-identity-context sgs-obligation-identity-context" data-response-stage=${m.stage} data-source-skill-id=${r[0]}><div className="response-kicker">${r[1]} · 当前选择者自行决定</div><strong>${r[2]}</strong><p>${r[3]}</p>
 ${m.stage==='bifa_payment'?html`<div data-bifa-private-view><p>历史真实回合开始版 · 来源 ${text(m.source_actor_id)||'笔伐来源'} · 同类要求 ${({basic:'基本',trick:'锦囊',equipment:'装备'})[m.required_category]??'以当前合法手牌选项为准'}。</p><${CardFace} card=${m.held_card} CardView=${CardView}/><small>仅获授权的当前目标观看。HR15：观看尚未提交；交付／拒绝分支提交后按原子回执继续，来源之后死亡不退款。</small></div>`:null}
 ${m.stage==='songci_target'?html`<${SgsObligationIdentitySongciTargets} state=${state} sourceActorId=${state.players.self.seat} usedTargetIds=${m.used_target_ids}/>`:null}
 ${m.stage==='songci_discard'||m.stage==='qingxi_target'?html`<p data-exact-selection aria-live="polite">需 ${n(m.exact_count)} 张 · 已选 ${n(m.selected_count??list(m.selected_ids).length)} 张${m.stage==='qingxi_target'?' · 仅手牌；点已选牌可撤选':' · 手／装备；逐张选择'}。</p>`:null}
 ${m.stage==='qingxi_target'?html`<div data-qingxi-weapon><p>实际武器：${text(weapon?.name)||'待接入具体武器字段'} · 原装备位置 ${text(weapon?.zone)||'?'} · 自身印制范围 ${n(weapon?.range)} · 本次精确弃牌 X=${n(m.exact_count)}。</p><p>当前待结算伤害 ${n(m.damage)} · 加伤分支 +1；付款只取消这1点加成，原杀伤害继续。后续防止／防具仍适用。</p><small>NH6–NH8：先足额弃手牌，再处理原区原武器；不追牌、不弃替换物，后续保护或嵌套死亡不退款。</small></div>`:null}
 <small>Tab定位，Enter确认；${mandatory?'必须明确选择合法分支，Esc不会代选拒绝、加伤或取消':'可按Esc选择当前有效的取消／放弃选项'}。过期输入重新校验，重复输入不会重复结算。</small></section>`;
}
export function SgsObligationIdentityChoiceButtons({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const local=useRef(null),latest=useRef(null);latest.current={state,prompt,busy};const sent=responseGuard??local;
 const options=sgsObligationIdentityOptions(prompt,state);if(!isSgsObligationIdentityPromptOwner(prompt,state))return null;
 return html`<div className="sgs-future-identity-choices sgs-obligation-identity-choices" data-choice-stage=${prompt.meta.stage}><div className="dialog-actions wrap">${options.map(o=>{
  const reasonId=`obligation-reason-${prompt.meta.stage}-${o.id.replace(/[^\w-]/g,'-')}`;
  return html`<section key=${o.id} className=${o.card?'sgs-future-identity-material':''}>${o.card?html`<${CardFace} card=${o.card} CardView=${CardView}/>`:null}<button type="button" className="btn option" data-option-id=${o.id} aria-pressed=${o.selected===null?undefined:o.selected} disabled=${busy||o.disabled} aria-describedby=${o.disabled&&o.reason?reasonId:undefined} onClick=${()=>{
   const now=latest.current;if(now.prompt?.prompt_id!==prompt.prompt_id)return;
   const current=sgsObligationIdentityOptions(now.prompt,now.state).find(x=>x.id===o.id);if(!current||current.disabled)return;
   sgsObligationIdentitySendOnce(sent,prompt.prompt_id,now.busy,onRespond,o.id);
  }}>${o.label}</button>${o.disabled&&o.reason?html`<small id=${reasonId}>${o.reason}</small>`:null}</section>`;
 })}</div></div>`;
}
/** Standalone accessible dialog for isolated QA or host adoption. Hosts using their
 * existing PromptLayer may instead wire the context/buttons plus cancel/send helpers. */
export function SgsObligationIdentityPrompt({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const container=useRef(null),local=useRef(null),latest=useRef(null);const sent=responseGuard??local;
 latest.current={state,prompt,onRespond,busy};const owner=isSgsObligationIdentityPromptOwner(prompt,state);
 useEffect(()=>{
  const dialog=container.current;if(!owner||!dialog)return;const doc=dialog.ownerDocument,previous=doc.activeElement;
  const focusable=()=>[...dialog.querySelectorAll('button:not(:disabled),summary,a[href],[tabindex="0"]')];(focusable()[0]??dialog).focus();
  const keydown=e=>{
   if(e.key==='Tab'){const all=focusable(),i=all.indexOf(doc.activeElement);if(!all.length){e.preventDefault();dialog.focus();}else if(e.shiftKey&&i<=0){e.preventDefault();all.at(-1).focus();}else if(!e.shiftKey&&(i<0||i===all.length-1)){e.preventDefault();all[0].focus();}}
   if(e.key==='Escape'){const now=latest.current,cancel=sgsObligationIdentityCancelOption(now.prompt,now.state);if(cancel&&!dialog.closest('fieldset')?.disabled){e.preventDefault();sgsObligationIdentitySendOnce(sent,now.prompt.prompt_id,now.busy,now.onRespond,cancel);}}
  };
  doc.addEventListener('keydown',keydown);return()=>{doc.removeEventListener('keydown',keydown);if(previous?.isConnected&&(doc.activeElement===doc.body||dialog.contains(doc.activeElement)))previous.focus();};
 },[prompt?.prompt_id,owner]);
 if(!prompt||!isSgsObligationIdentityPromptStage(prompt))return null;
 if(!owner)return html`<div role="status">等待其他角色完成响应…</div>`;
 return html`<div className="modal-mask"><div ref=${container} className="sgs-dialog wide" role="dialog" aria-modal="true" tabIndex=${-1} aria-label=${STAGES[prompt.meta.stage][1]} data-response-stage=${prompt.meta.stage}><${SgsObligationIdentityResponseContext} state=${state} prompt=${prompt} CardView=${CardView}/><${SgsObligationIdentityChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} responseGuard=${sent}/></div></div>`;
}
const players=state=>{const seen=new Set();return [state?.players?.self,...list(state?.players?.opponents),state?.players?.opponent,...['p1','p2','p3'].map(k=>state?.players?.[k])].filter(p=>{const id=seat(p?.seat);if(!id||seen.has(id))return false;seen.add(id);return true;});};
export function sgsObligationIdentitySongciTargetRows(state,sourceActorId,usedTargetIds=null){
 const id=seat(sourceActorId),ledger=state?.sgs_chenlin?.songci_targets,used=new Set(list(usedTargetIds??ledger?.[JSON.stringify(id)]).map(seat));
 return players(state).map(p=>{const count=Number.isSafeInteger(p.hand_count)?p.hand_count:null,hp=Number.isFinite(p.hp)?p.hp:null,spent=used.has(seat(p.seat)),alive=p.alive!==false&&(hp===null||hp>0);return {id:seat(p.seat),name:text(p.name)||seat(p.seat),hand_count:count,hp,spent,branch:spent?'spent':!alive?'dead':count===null||hp===null?'unknown':count===hp?'equal':count<hp?'draw':'discard'};});
}
export function SgsObligationIdentitySongciTargets({state,sourceActorId,usedTargetIds=null}){
 return html`<ul data-songci-lifetime>${sgsObligationIdentitySongciTargetRows(state,sourceActorId,usedTargetIds).map(r=>html`<li key=${r.id} data-target-id=${r.id} data-songci-state=${r.branch}>${r.name} · 手${n(r.hand_count)}／当前体力${n(r.hp)} · ${({spent:'此来源整局已用',dead:'已阵亡',unknown:'公开数值未知',equal:'相等，不可选',draw:'整局未用，可摸2',discard:'整局未用，可弃2手／装备'})[r.branch]}</li>`)}</ul>`;
}
/** Never spread raw obligations/card fields into the DOM. The normal public
 * status shows backs; an envelope bound to the current viewer plus an explicit
 * row authorization permits the source or authorized target to see its card. */
export function sgsObligationIdentityBifaFace(row,state,prompt=null){
 const viewer=seat(state?.players?.self?.seat),projection=state?.sgs_chenlin;
 if(!viewer||seat(projection?.viewer_actor_id)!==viewer||row?.viewer_authorized!==true||!['PENDING','AWAITING_CHOICE'].includes(row.state)||row.count!==1)return null;
 if(seat(row.source_actor_id)!==viewer&&seat(row.target_actor_id)!==viewer)return null;
 return safeCard(row.card);
}
export function SgsObligationIdentityStatus({player,state,prompt=null,CardView=null}){
 if(!player)return null;const id=seat(player.seat),skillIds=list((player.effective_hero||player.hero)?.skill_ids),chen=state?.sgs_chenlin;
 const bifa=list(chen?.bifa).filter(r=>seat(r.source_actor_id)===id||seat(r.target_actor_id)===id),songci=list(chen?.songci).filter(r=>seat(r.source_actor_id)===id),cao=player.sgs_caoxiu;
 const showsSongci=skillIds.includes('sgs.songci')||Object.hasOwn(chen?.songci_targets??{},JSON.stringify(id));
 if(!bifa.length&&!showsSongci&&!cao&&!skillIds.some(s=>skills.has(s)))return null;
 return html`<section className="player-card-status sgs-future-identity-status sgs-obligation-identity-status" data-obligation-identity-status=${id}>
 ${bifa.map(r=>{const card=sgsObligationIdentityBifaFace(r,state,prompt);return html`<div key=${r.obligation_id} data-bifa-state=${r.state}><p>笔伐 · ${text(r.source_actor_id)} → ${text(r.target_actor_id)} · ${r.count===1?'暗置1张':r.state==='CANCELLED'?'义务已清理':r.state==='SETTLED'?'已结算':'已提交，等待安全后续'} · 历史真实回合开始版</p>${r.count===1?(card?html`<${CardFace} card=${card} CardView=${CardView}/>`:html`<span data-bifa-card-back aria-label="暗置笔伐牌">笔伐 · 牌背</span>`):null}${r.branch==='refuse'?html`<p>${r.hp_applied?'已执行1点体力流失（非伤害）':r.stopped?'已提交拒绝分支；后续按生命周期停止':'拒绝已提交，等待体力流失／救援结算'}。</p>`:null}${r.branch==='trade'?html`<p>同类手牌交付与获得笔伐牌已原子提交，不重复移牌。</p>`:null}</div>`;})}
 ${showsSongci?html`<div><p>颂词 · 每个来源对每个目标整局一次；不随回合、失技或复活刷新。</p><${SgsObligationIdentitySongciTargets} state=${state} sourceActorId=${id}/>${songci.slice(-1).map(r=>html`<p key=${r.event_id}>最近目标 ${text(r.target_actor_id)}：${r.status==='done'?(r.branch==='draw'?`实际摸${n(r.drawn)}张`:`实际弃${n(r.discarded)}张`):r.branch==='draw'?'等待摸牌结算':'等待目标弃牌结算'}。</p>`)}</div>`:null}
 ${skillIds.includes('sgs.qianju')?html`<p data-qianju-distance>千驹 · 当前已损失体力 ${Number.isFinite(player.max_hp)&&Number.isFinite(player.hp)?Math.max(0,player.max_hp-player.hp):'?'}；对外距离减少同值，宿主下限1。来向距离和武器自身范围不变。</p>`:null}
 ${list(cao?.qingxi_events).filter(r=>r.committed).slice(-1).map(r=>html`<div key=${r.damage_event_id} data-qingxi-result><p>倾袭 · 目标 ${text(r.target_id)} · 快照武器 ${text(r.weapon?.name)||'已公开实体'}／${text(r.weapon?.zone)} · 自身范围 ${n(r.weapon?.range)}。</p><p>${r.branch==='boost'?'已提交此伤害+1；最终伤害仍由后续防止、防具与救援决定':r.status==='done'?`已付恰好${n(r.weapon?.range)}张手牌，${r.weapon_discarded?'原武器已弃':'原武器未弃，按实际移动／保护结果处理'}；原杀伤害继续`:'精确手牌付款已提交，等待原武器后续；不退款、不增加伤害'}。</p></div>`)}
 </section>`;
}
