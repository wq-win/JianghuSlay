/** Source-selected classic support UI. Pure adapters; production admission is host-owned. */
import {html} from 'htm/react';
import {useEffect,useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_CONFIRMED_SUPPORT_HERO_IDENTITIES=freeze({
  "sgs.adapted.base.hero.cao-ang": {
    "hp": 4,
    "max_hp": 4,
    "gender": "男",
    "source_label": "三国杀",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "product": "三国杀移动版",
    "mode": "身份",
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "native_lifecycle_verified": false,
    "snapshot_historical_state_certified": false,
    "selection_snapshot_date": "2026-10-15",
    "evidence_read_date": "2026-10-16",
    "name": "曹昂",
    "source_name": "曹昂",
    "faction": "魏",
    "source_variant": "mobile-classic-identity-official83-community-classic-selected-2026-10-15-read-2026-10-16",
    "portrait_path": "./portraits-sgs-confirmed-support/cao-ang.svg",
    "skill_ids": [
      "sgs.kangkai"
    ],
    "aliases": [
      "曹昂",
          "Cao Ang",
      "caoang",
      "kangkai",
      "慷忾",
      "魏",
      "三国杀",
      "三国杀移动版",
      "经典身份"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-83.html",
      "https://wiki.biligame.com/msgs/曹昂",
      "https://wiki.biligame.com/msgs/慷忾",
      "https://a.4399.cn/gl/33530415_83975.html"
    ]
  },
  "sgs.adapted.base.hero.pan-zhang-ma-zhong": {
    "hp": 4,
    "max_hp": 4,
    "gender": "男",
    "source_label": "三国杀",
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "product": "三国杀移动版",
    "mode": "身份",
    "starting_hp_direct_source_value": null,
    "starting_hp_basis": "H0 explicit host initialization",
    "current_client_rules_verified": false,
    "current_client_hp_verified": false,
    "native_lifecycle_verified": false,
    "snapshot_historical_state_certified": false,
    "selection_snapshot_date": "2026-10-15",
    "evidence_read_date": "2026-10-16",
    "name": "潘璋马忠",
    "source_name": "潘璋马忠",
    "faction": "吴",
    "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "portrait_path": "./portraits-sgs-confirmed-support/pan-zhang-ma-zhong.svg",
    "skill_ids": [
      "sgs.duodao",
      "sgs.anjian"
    ],
    "aliases": [
      "潘璋马忠",
      "潘璋",
      "马忠",
      "潘璋 马忠",
      "潘璋·马忠",
      "Pan Zhang Ma Zhong",
      "panzhangmazhong",
      "duodao",
      "anjian",
      "夺刀",
      "暗箭",
      "吴",
      "三国杀",
      "三国杀移动版",
      "经典身份"
    ],
    "source_urls": [
      "https://www.sanguosha.cn/pc/hero-detail-129.html",
      "https://wiki.biligame.com/msgs/潘璋马忠"
    ]
  }
});
export const SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID=freeze({
  "sgs.adapted.base.hero.cao-ang": [
    {
      "name": "慷忾",
      "type": "optional",
      "activeId": null,
      "summary": "距离1内角色成为杀的最终目标后，可摸1并给其1张牌；装备可由其立即使用",
      "condition": "本人存活且技能有效；一名存活角色成为杀的最终确认目标，自己到其当前定向距离不大于1。自己距离0符合。",
      "phase_use": "没有自由出牌按钮。每次合格目标确认时可发动或放弃；发动后先摸牌，另一角色的赠牌步骤必须完成。",
      "response": "自己成为目标只摸1，不交给自己、不展示自己的摸牌，也不能借此立即使用装备。其他目标收到并展示装备牌后，由该目标决定立即使用或保留。",
      "disabled_reason": "不是杀的最终目标确认、定向距离大于1、同一目标事件已处理、发动前死亡／失技／被压制或终局。不是受伤触发，闪避或防止伤害不撤销已发动效果。",
      "timing": "每名杀的最终目标确认后、该目标的装备／闪响应前；按宿主行动序逐一询问所有慷忾持有者",
      "cost": "发动无预付成本；摸1后，另一目标必须获赠自己恰好1张当前合法手牌或装备",
      "limit": "每个持有者对每次最终目标确认一次机会；无每回合／阶段上限，无队伍限制",
      "effect": "先正常摸1，再选当前手牌／装备交给目标手牌区并公开展示实际转移的实体牌。新摸牌和原有牌均可，判定区和专属堆不可。交牌不是弃置。若为装备且仍能合法使用，收牌者可立即真实使用，触发装备替换／离区／进入及用牌历史；保留则留在手牌。随后继续同一张杀，新防具可影响该杀；不增加或消耗杀次数。",
      "targets": "所有符合距离条件的最终杀目标，包括自己与敌方；距离是持有者到目标，不是武器攻击范围",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。历史来源边界单独保留，未实测2026当前移动客户端；不认证此前历史网页状态。本批不代表全角色、全来源或全模式覆盖。",
        "H2／H4：重定向、护卫和同时持有者顺序是江湖宿主兼容，非移动版原生时序认证。每个目标重新计算距离，先前赠送坐骑可能改变后续目标资格。",
        "H5：牌堆耗尽只摸现有实体；即使未摸到，仍须交可交的旧牌。已无任何合法手牌／装备才停止赠牌，不造牌。",
        "H6／H9：发动后失技、被压制或距离变化不取消已经承诺的合法赠牌；死亡、终局或目标窗口失效按宿主边界停止。赠牌提交后不退款；赠者死亡不自动撤销活着收牌者已获得的装备使用机会。",
        "H8：候选牌只向当前赠者显示；只有已经真实转移并展示的那张牌公开。不展示未选手牌、刚摸但未赠的牌或对手暗手。"
      ],
      "id": "sgs-confirmed-support-kangkai",
      "source_skill_id": "sgs.kangkai",
      "icon": "sgs-confirmed-support-kangkai",
      "source_variant": "mobile-classic-identity-official83-community-classic-selected-2026-10-15-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-83.html",
        "https://wiki.biligame.com/msgs/曹昂",
        "https://wiki.biligame.com/msgs/慷忾",
        "https://a.4399.cn/gl/33530415_83975.html"
      ]
    }
  ],
  "sgs.adapted.base.hero.pan-zhang-ma-zhong": [
    {
      "name": "夺刀",
      "type": "optional",
      "activeId": null,
      "summary": "受到杀的实际伤害后，可弃1手牌／装备，再获得实际伤害来源当前武器",
      "condition": "本人受到归因于杀的实际正数伤害，濒死救援结束后仍存活、持有技能且能弃恰好1张自己的手牌或装备。",
      "phase_use": "没有自由出牌按钮。每次合格伤害后选择自己的1张合法牌弃置，或放弃。来源没有武器也可选择发动，弃牌成本不会因此退还。",
      "response": "先实际弃置1张牌并结算离区效果，再检查实际伤害来源装备区里的当前武器；有合法实体则获得到自己手牌。",
      "disabled_reason": "非杀伤害、仅失去体力、伤害被防止或为0、只有成为目标、没有合法弃牌、本人阵亡／失技或终局。来源无武器不是额外的发动禁令。",
      "timing": "实际正数杀伤害提交、濒死救援结束后的伤后窗口；按伤害事件，不按伤害点数",
      "cost": "自愿弃恰好1张自己的合法手牌或装备；不能用判定区、专属堆或未来将得到的武器付款",
      "limit": "每次实际伤害事件一次机会；2点伤害仍只弃1次，不设每回合／阶段次数上限",
      "effect": "获得伤害来源装备区的当前武器到自己手牌，是获得而非自动装备，也不是弃掉该武器。实际伤害来源可能不同于用杀者。付款后重新读取当前武器；原武器移走或来源已死且无武器则不追入弃牌堆，成本保留。付款间替换武器则取现武器。不限制杀的颜色、属性、当前回合、距离、阵营或来源必须为他人。",
      "targets": "固定实际伤害来源的装备区武器；不查看其手牌，不把防具、坐骑、宝物或攻城车当作武器",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。历史来源边界单独保留，未实测2026当前移动客户端；不认证此前历史网页状态。本批不代表全角色、全来源或全模式覆盖。",
        "H1／H3／H5：先成本及嵌套离区，再取来源当前实体武器；无来源、无武器不退款，持有者死亡或终局停止后续。获得触发来源装备离区与正常获得钩子。均为显式宿主边界，非当前客户端认证。",
        "H2：转移／连环若宿主仍归因为杀伤害，实际受伤者可独立触发夺刀；普通技能伤害、决斗与失去体力不符合。不要套用暗箭的直接目标限制。",
        "采用经典夺刀的杀伤害与弃1成本；不混入界夺刀的全伤害、无成本机制。"
      ],
      "id": "sgs-confirmed-support-duodao",
      "source_skill_id": "sgs.duodao",
      "icon": "sgs-confirmed-support-duodao",
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-129.html",
        "https://wiki.biligame.com/msgs/潘璋马忠"
      ]
    },
    {
      "name": "暗箭",
      "type": "locked",
      "activeId": null,
      "summary": "锁定：自己的杀伤害直接目标时，若自己在目标攻击范围外，此伤害+1",
      "condition": "本人使用的杀将对其直接目标造成伤害；此时从目标到自己的定向距离大于目标的当前实际攻击范围。",
      "phase_use": "锁定技自动结算，没有发动、不可闪或加伤二选一按钮。",
      "response": "仅此伤害数值增加1，之后照常执行接收方转移、防止和防具；没有额外杀、额外伤害事件或额外闪要求。",
      "disabled_reason": "不是本人使用的杀、不是该杀直接目标、转移／连环衍生分支、没有进入伤害窗口，或自己仍在目标攻击范围内（距离等于范围也不加伤）。",
      "timing": "杀的直接目标伤害来源侧加成窗口；合法目标重定向后、接收方转移与减免前",
      "cost": "无牌、体力或次数成本；不要求自己有武器",
      "limit": "每个合格直接伤害事件自动+1一次，无每回合次数上限，不按每点伤害重复",
      "effect": "反向检查：目标到自己的当前距离 > 目标的当前实际攻击范围。用目标当前武器、坐骑及适用体力距离修正，不看自己的武器范围，不沿用出杀时快照。普通、红黑／无色及不同属性的合法杀都可，回合外也可。目标使用闪躲掉而没有伤害时不产生额外伤害。",
      "targets": "自己使用的这张杀经过合法目标重定向后的直接伤害目标",
      "notes": [
        "所选移动版经典身份来源；2026-10-15选择，2026-10-16读取。历史来源边界单独保留，未实测2026当前移动客户端；不认证此前历史网页状态。本批不代表全角色、全来源或全模式覆盖。",
        "H2／H4：来源加成只在直接目标窗口运行一次；转移／连环后续继承上游实际数值，不重新触发暗箭。与其他来源加成的先后是宿主确定性顺序，不宣称原生通用裁定。",
        "反向距离与攻击范围是不同数值。其他技能授予无距离限制出杀，不把角色攻击范围变为无限。",
        "经典暗箭不是界暗箭；不增加“不可响应／伤害+1”选择，不改闪数量。"
      ],
      "id": "sgs-confirmed-support-anjian",
      "source_skill_id": "sgs.anjian",
      "icon": "sgs-confirmed-support-anjian",
      "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
      "source_urls": [
        "https://www.sanguosha.cn/pc/hero-detail-129.html",
        "https://wiki.biligame.com/msgs/潘璋马忠"
      ]
    }
  ]
});
export const SGS_CONFIRMED_SUPPORT_SKILL_ICONS=freeze({
  "sgs-confirmed-support-kangkai": "<path d=\"M4 5h11v14H4ZM8 9h3M8 13h3M18 9h10v14H18ZM21 13h4M21 17h4M3 25l6 4h9l10-5M9 25h8l3-3-5-2H9l-6 3M14 5l3-3 3 3m-3-3v9\"/>",
  "sgs-confirmed-support-duodao": "<path d=\"M6 27 24 9m-5 0 5 5M24 9l-1-6 6 1-1 6M3 23l7 7M3 5h9v11H3Zm14 17h10m-4-4 4 4-4 4\"/>",
  "sgs-confirmed-support-anjian": "<path d=\"M3 24 26 4m-7 0h8v8M5 16q-2-9 6-13m-3 25q10 3 18-5M10 5q-3 6 0 10M18 25q6 0 10-5M3 24l-1 6 6-2M13 20l5 5\"/>"
});
const list=v=>Array.isArray(v)?v:[],text=v=>typeof v==='string'||typeof v==='number'?String(v):'',seat=v=>v==='player'?'p1':v;
const n=v=>Number.isFinite(v)&&v>=0?v:'?',safeCard=c=>c&&typeof c==='object'&&!c.hidden&&typeof c.name==='string'?{name:c.name,type:text(c.type),suit:text(c.suit),rank:text(c.rank),color:text(c.color)}:null;
const close=e=>{if(e.key==='Escape'&&e.currentTarget.open){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function sgsConfirmedSupportSearchText(heroId){const h=SGS_CONFIRMED_SUPPORT_HERO_IDENTITIES[heroId];return h?[h.name,h.source_name,h.source_label,h.product,h.mode,h.faction,h.gender,...h.aliases,...h.skill_ids,...SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID[heroId].map(s=>s.name)].join(' '):'';}
export const SGS_CONFIRMED_SUPPORT_HOST_POLICIES=freeze([
 {id:'H0',heroes:['cao-ang','pan-zhang-ma-zhong'],text:'两人固有体力上限均为4。独立初始体力来源字段未知；4/4满体力开局是江湖初始化，不含主公身份加成。'},
 {id:'CA H1–H4',heroes:['cao-ang'],text:'最终目标重定向与护卫结束后，在该目标装备／闪前按行动序询问全场有效慷忾持有者。每名目标重新测持有者到目标距离；不是攻击范围。稳定目标确认事件去重。'},
 {id:'CA H5–H6',heroes:['cao-ang'],text:'先摸再给；摸牌耗尽仍须给已有合法牌。仅无合法赠牌、死亡、终局或窗口失效时停止安全后续。赠牌实体与位置再次核验；已提交牌不退款、不重复。'},
 {id:'CA H7–H9',heroes:['cao-ang'],text:'交牌走真实转移，装备走真实使用／替换。发动后失技或距离改变不撤销必须完成的赠牌。未选手牌保密，只有真实转移并展示的牌公开。复制技能不复制来源账本。'},
 {id:'PM H1 / H3 / H5',heroes:['pan-zhang-ma-zhong'],text:'夺刀先弃1并处理嵌套离区，再检查实际伤害来源当前装备武器。来源无武器也可付成本；无可得实体不退款、不追弃牌堆，不自动装备。本人死亡或终局停止后续。'},
 {id:'PM H2 / H4',heroes:['pan-zhang-ma-zhong'],text:'暗箭只在自己使用杀的直接目标来源侧伤害窗口检验一次：目标到自己距离 > 目标实际攻击范围。转移／连环后续继承上游数值，不新检验；夺刀可听取仍归因为杀的实际伤害后续。'},
 {id:'PM H6',heroes:['pan-zhang-ma-zhong'],text:'当前选择者只看自己合法手牌／装备及公开来源武器。按真实事件与实体位置重新校验，重复输入／重放不重复扣牌、获得或加伤。'}
]);
export function SgsConfirmedSupportPolicyGuide({hero}){
 const h=SGS_CONFIRMED_SUPPORT_HERO_IDENTITIES[hero?.id];if(!h)return null;const slug=hero.id.replace('sgs.adapted.base.hero.','');
 return html`<details className="hero-provenance sgs-future-identity-policy sgs-confirmed-support-policy" onKeyDown=${close}><summary>经典身份来源 · 历史规则与江湖兼容</summary><p>${h.name} · ${h.faction} · 男 · 4体力。完整固有技能：${SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID[hero.id].map(s=>s.name).join('／')}。无个人主公技、授予技、获得技或专属衍生牌。</p><p>2026-10-15来源选择，2026-10-16读取。历史来源边界单独保留；未实测2026当前移动客户端，不认证此前历史网页状态。原生生命周期未核验，江湖混搭顺序是宿主约定；本批不代表全来源、全角色或全模式覆盖。</p><ol>${SGS_CONFIRMED_SUPPORT_HOST_POLICIES.filter(p=>p.heroes.includes(slug)).map(p=>html`<li key=${p.id} data-policy-id=${p.id}><strong>${p.id}</strong> · ${p.text}</li>`)}</ol><p>${h.source_urls.map((url,i)=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${i===0?'官方经典身份目录':i===3?'同移动版社区攻略（非官方裁定）':'同产品社区经典字段与规则佐证'}</a> `)}</p></details>`;
}
export function SgsConfirmedSupportHpEvidence({hero}){const h=SGS_CONFIRMED_SUPPORT_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-confirmed-support-source=${hero.id}>${h.name} · ${h.faction} · ${h.gender} · 固有最大体力4。体力与性别来自同产品经典明确字段，未从画像猜测。独立初始体力字段未知；4/4满体力开局是H0宿主初始化，不含主公加成。未实测2026当前移动客户端。</p>`:null;}
export function SgsConfirmedSupportSkillGuide({hero}){const rows=SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID[hero?.id];return rows?html`<section data-confirmed-support-guide=${hero.id}>${rows.map(s=>html`<details key=${s.id} onKeyDown=${close}><summary>${s.name} · ${s.type==='locked'?'锁定技 · 自动生效':'可选触发技'}</summary><p>${s.summary}</p>${[['发动条件','condition'],['时机','timing'],['成本','cost'],['次数','limit'],['目标','targets'],['操作','phase_use'],['响应','response'],['效果','effect'],['不可用原因','disabled_reason']].map(([label,key])=>html`<p key=${key}><strong>${label}：</strong>${s[key]}</p>`)}<ul>${s.notes.map(note=>html`<li key=${note}>${note}</li>`)}</ul></details>`)}</section>`:null;}
export const SGS_CONFIRMED_SUPPORT_PROMPT_CONTEXTS=freeze({
 kangkai_invoke:['sgs.kangkai','慷忾','最终杀目标已确认：是否发动慷忾？','发动先摸1。若目标是其他角色，随后必须交给其1张自己的手牌或装备并展示；赠牌不等于弃置。'],
 kangkai_gift:['sgs.kangkai','慷忾','已发动：必须选择1张牌赠给当前目标','先摸牌已经结算。新摸与原有的手牌／装备均可选；恰好交1张到目标手牌区。不能取消赠牌来保留免费摸牌。'],
 kangkai_equipment:['sgs.kangkai','慷忾','收牌者选择：立即使用装备，或保留在手牌','赠牌已转移并公开展示。仅收牌者决定是否立即真实使用该装备；替换、离区与进入照常处理。'],
 duodao_cost:['sgs.duodao','夺刀','受到杀的实际伤害后：弃1张牌发动，或放弃','弃自己的1张合法手牌／装备，结算离区效果后获得实际伤害来源当前装备武器到手牌。来源无武器也可发动，弃牌不会退还。']
});
const STAGES=SGS_CONFIRMED_SUPPORT_PROMPT_CONTEXTS,skills=new Set(['sgs.kangkai','sgs.duodao','sgs.anjian']);
const eq=/^eq:(weapon|armor|offensive_horse|defensive_horse)$/,hand=/^hand:[1-9]\d*$/;
const cancellation={kangkai_invoke:'pass',kangkai_equipment:'keep',duodao_cost:'pass'};
const labels={activate:'发动慷忾',pass:'不发动',use:'立即使用这张装备',keep:'保留在手牌'};
// Route malformed support prompts here too. They must not fall through to generic private labels.
export const isSgsConfirmedSupportPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||skills.has(p?.meta?.skill_id)||skills.has(p?.meta?.source_skill_id);
export function isSgsConfirmedSupportPrompt(p){const m=p?.meta??{},row=STAGES[m.stage];return Boolean(row&&row[0]===(m.skill_id??m.source_skill_id)&&p.kind==='choice'&&typeof p.prompt_id==='string'&&p.prompt_id.trim()&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsConfirmedSupportPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsConfirmedSupportPrompt(p)&&typeof self==='string'&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
export const isSgsConfirmedSupportMandatory=p=>p?.meta?.stage==='kangkai_gift'||p?.meta?.mandatory===true;
const allowed=(stage,id)=>stage==='kangkai_invoke'?['activate','pass'].includes(id):stage==='kangkai_gift'?hand.test(id)||eq.test(id):stage==='kangkai_equipment'?['use','keep'].includes(id):stage==='duodao_cost'?hand.test(id)||eq.test(id)||id==='pass':false;
/** No option.card or arbitrary option label is rendered; faces come from the current chooser's visible DTO only. */
export function sgsConfirmedSupportOptions(p,state){
 if(!isSgsConfirmedSupportPromptOwner(p,state))return [];
 const stage=p.meta.stage,self=state.players.self,seen=new Set();
 return list(p.options).flatMap(o=>{
  if(!o||typeof o.id!=='string'||seen.has(o.id)||!allowed(stage,o.id)||isSgsConfirmedSupportMandatory(p)&&['pass','keep'].includes(o.id))return [];
  seen.add(o.id);const material=hand.test(o.id)||eq.test(o.id),card=material?safeCard(hand.test(o.id)?self.hand?.[Number(o.id.slice(5))-1]:self.equipment?.[o.id.slice(3)]):null;
  if(material&&!card)return [];
  const zone=hand.test(o.id)?`手牌${o.id.slice(5)}`:eq.test(o.id)?({weapon:'武器',armor:'防具',offensive_horse:'进攻坐骑',defensive_horse:'防御坐骑'})[o.id.slice(3)]:null;
  return [{id:o.id,label:material?`${stage==='kangkai_gift'?'交给目标':'弃置'} · ${zone} · ${card.name}`:labels[o.id],card,zone,disabled:!!o.disabled,reason:o.disabled?'该选项当前不可用，请按最新合法选项选择':''}];
 });
}
export function sgsConfirmedSupportCancelOption(p,state){if(!isSgsConfirmedSupportPromptOwner(p,state)||isSgsConfirmedSupportMandatory(p))return null;return sgsConfirmedSupportOptions(p,state).find(o=>o.id===cancellation[p.meta.stage]&&!o.disabled)?.id??null;}
export function sgsConfirmedSupportSendOnce(ref,key,busy,onRespond,value){
 if(busy||typeof key!=='string'||!key.trim()||ref.current===key||typeof onRespond!=='function')return;
 ref.current=key;const reset=()=>{if(ref.current===key)ref.current=null;};
 try{const result=onRespond(value);if(result?.then)return Promise.resolve(result).then(accepted=>{if(accepted===false)reset();return accepted;},()=>{reset();});if(result===false)reset();return result;}catch(error){reset();throw error;}
}
function CardFace({card,CardView}){const c=safeCard(card);if(!c)return null;return CardView?html`<${CardView} card=${c} compact=${true} disabled=${true}/>`:html`<span data-card-face=${c.name}>${c.suit} ${c.rank} ${c.name}</span>`;}
export function SgsConfirmedSupportResponseContext({state,prompt,CardView=null}){
 if(!isSgsConfirmedSupportPromptOwner(prompt,state))return null;
 const m=prompt.meta,r=STAGES[m.stage],mandatory=isSgsConfirmedSupportMandatory(prompt);
 return html`<section className="response-context sgs-future-identity-context sgs-confirmed-support-context" data-response-stage=${m.stage} data-source-skill-id=${r[0]}><div className="response-kicker">${r[1]} · 当前选择者自行决定</div><strong>${r[2]}</strong><p>${r[3]}</p>
 ${m.stage==='kangkai_invoke'?html`<p data-kangkai-distance>自己到目标 ${text(m.target_id)||'当前目标'} 的距离 ${n(m.distance)}／要求≤1。${m.self_target?'自己成为目标：只摸1，不给自己、不展示摸牌、不立即使用装备。':'发动后必须给其他目标1张合法牌，无阵营限制。'}</p>`:null}
 ${m.stage==='kangkai_gift'?html`<p data-kangkai-mandatory>赠牌目标 ${text(m.target_id)||'当前目标'} · 必须恰好1张手牌／装备。未选手牌保持私密；只展示已真实转移的牌。</p>`:null}
 ${m.stage==='kangkai_equipment'?html`<div data-kangkai-public-gift><${CardFace} card=${m.gift} CardView=${CardView}/><p>此赠牌已经公开。立即使用会占用对应装备位置并替换旧装备；保留不装备、不弃置。</p></div>`:null}
 ${m.stage.startsWith('kangkai_')?html`<p data-pending-slash>当前这张杀仍待结算：慷忾结束后继续原杀的装备／闪响应与效果。立即装上的防具可影响同一张待决杀；不会另出一张杀。</p>`:null}
 ${m.stage==='duodao_cost'?html`<p data-duodao-cost>实际伤害来源 ${text(m.source_id)||'无来源'} · 本次受伤 ${n(m.damage)}点。这是伤后选择，不能撤销刚才的伤害。成本提交后才检查实际伤害来源的当前武器；无武器时仍失去已弃的牌。获得只进入手牌，不自动装备。</p>`:null}
 <small>Tab定位，Enter确认；${mandatory?'必须选合法赠牌，Esc不会取消已发动的承诺':'Esc仅选择当前已提供的放弃／保留选项'}。过期输入重新校验，重复输入不会重复结算。</small></section>`;
}
export function SgsConfirmedSupportChoiceButtons({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const local=useRef(null),latest=useRef(null);latest.current={state,prompt,busy,onRespond};const sent=responseGuard??local;
 if(!isSgsConfirmedSupportPromptOwner(prompt,state))return null;
 return html`<div className="sgs-future-identity-choices sgs-confirmed-support-choices" data-choice-stage=${prompt.meta.stage}><div className="dialog-actions wrap">${sgsConfirmedSupportOptions(prompt,state).map(o=>{const reasonId=`support-reason-${prompt.meta.stage}-${o.id.replace(/[^\w-]/g,'-')}`;return html`<section key=${o.id} className=${o.card?'sgs-future-identity-material':''}>${o.card?html`<${CardFace} card=${o.card} CardView=${CardView}/>`:null}<button type="button" className="btn option" data-option-id=${o.id} disabled=${busy||o.disabled} aria-describedby=${o.disabled?reasonId:undefined} onClick=${()=>{const now=latest.current;if(now.prompt?.prompt_id!==prompt.prompt_id)return;const current=sgsConfirmedSupportOptions(now.prompt,now.state).find(x=>x.id===o.id);if(!current||current.disabled)return;sgsConfirmedSupportSendOnce(sent,now.prompt.prompt_id,now.busy,now.onRespond,o.id);}}>${o.label}</button>${o.disabled?html`<small id=${reasonId}>${o.reason}</small>`:null}</section>`;})}</div></div>`;
}
/** Natural PromptLayer integration may mount context/buttons or this standalone accessible dialog. */
export function SgsConfirmedSupportPrompt({state,prompt,onRespond,busy=false,CardView=null,responseGuard=null}){
 const container=useRef(null),local=useRef(null),latest=useRef(null),sent=responseGuard??local;latest.current={state,prompt,onRespond,busy};const owner=isSgsConfirmedSupportPromptOwner(prompt,state);
 useEffect(()=>{const dialog=container.current;if(!owner||!dialog)return;const doc=dialog.ownerDocument,previous=doc.activeElement,focusable=()=>[...dialog.querySelectorAll('button:not(:disabled),summary,a[href],[tabindex="0"]')];(focusable()[0]??dialog).focus();const keydown=e=>{
  if(e.key==='Tab'){const all=focusable(),i=all.indexOf(doc.activeElement);if(!all.length){e.preventDefault();dialog.focus();}else if(e.shiftKey&&i<=0){e.preventDefault();all.at(-1).focus();}else if(!e.shiftKey&&(i<0||i===all.length-1)){e.preventDefault();all[0].focus();}}
  if(e.key==='Escape'){const now=latest.current,cancel=sgsConfirmedSupportCancelOption(now.prompt,now.state);if(cancel&&!dialog.closest('fieldset')?.disabled){e.preventDefault();sgsConfirmedSupportSendOnce(sent,now.prompt.prompt_id,now.busy,now.onRespond,cancel);}}
 };doc.addEventListener('keydown',keydown);return()=>{doc.removeEventListener('keydown',keydown);if(previous?.isConnected&&(doc.activeElement===doc.body||dialog.contains(doc.activeElement)))previous.focus();};},[prompt?.prompt_id,owner]);
 if(!prompt||!isSgsConfirmedSupportPromptStage(prompt))return null;
 if(!owner)return html`<div role="status">等待其他角色完成响应…</div>`;
 return html`<div className="modal-mask"><div ref=${container} className="sgs-dialog wide" role="dialog" aria-modal="true" tabIndex=${-1} aria-label=${STAGES[prompt.meta.stage][1]} data-response-stage=${prompt.meta.stage}><${SgsConfirmedSupportResponseContext} state=${state} prompt=${prompt} CardView=${CardView}/><${SgsConfirmedSupportChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} responseGuard=${sent}/></div></div>`;
}
/** Public Cao Ang receipts never authorize display of selected-but-uncommitted gifts. */
export function sgsConfirmedSupportPublicGift(row){return row?.given===true&&row?.revealed===true?safeCard(row.gift):null;}
export function SgsConfirmedSupportStatus({player,CardView=null}){
 if(!player)return null;const rows=list(player.sgs_caoang?.kangkai_events),duodao=list(player.sgs_panzhangmazhong?.duodao_events),anjian=list(player.sgs_panzhangmazhong?.anjian_events),skillIds=list((player.effective_hero||player.hero)?.skill_ids);
 if(!rows.length&&!duodao.length&&!anjian.length&&!skillIds.some(id=>skills.has(id)))return null;
 return html`<section className="player-card-status sgs-future-identity-status sgs-confirmed-support-status" data-confirmed-support-status=${seat(player.seat)}>
 ${rows.slice(-1).map(r=>html`<div key=${r.target_confirmed_id} data-kangkai-status=${text(r.status)}><p>慷忾 · 目标 ${text(r.target_id)} · ${r.invoked?'已发动':r.declined?'已放弃':'等待发动选择'}${r.draw_finished?` · 实际摸${n(r.draw_count)}张`:''}。</p>${sgsConfirmedSupportPublicGift(r)?html`<div data-kangkai-revealed><p>已交付并公开展示：</p><${CardFace} card=${sgsConfirmedSupportPublicGift(r)} CardView=${CardView}/></div>`:r.invoked&&seat(r.target_id)!==seat(player.seat)?html`<p>尚无已公开赠牌；候选手牌保密。</p>`:null}${r.equip_used?html`<p>收牌者已选择真实使用这张装备。返回同一张待决杀，实际装备效果按当前牌区结算。</p>`:r.equip_declined?html`<p>收牌者已选择保留装备，不立即使用；同一张杀继续。</p>`:r.equip_offered?html`<p>已授予收牌者立即使用装备的选择；同一张杀等待继续。</p>`:null}${r.stopped?html`<p>后续按宿主生命周期停止；已经提交的摸牌或交牌不回退。</p>`:null}</div>`)}
 ${duodao.slice(-1).map(r=>html`<div key=${r.damage_event_id} data-duodao-status=${text(r.status)}><p>夺刀 · 实际伤害来源 ${text(r.source_id)||'无来源'} · 此次受伤 ${n(r.damage)}点 · ${r.paid?'弃1成本已提交':r.declined?'已放弃，未付成本':'等待伤后选择'}。</p>${r.paid?html`<div data-duodao-paid><p>已弃置：</p><${CardFace} card=${r.cost} CardView=${CardView}/></div>`:null}${r.paid&&r.gained?html`<div data-duodao-gained><p>已获得来源武器到手牌：</p><${CardFace} card=${r.weapon} CardView=${CardView}/><p>不自动装备。</p></div>`:r.paid?html`<p>尚无已获得的武器；以付款后实际来源装备区为准，成本不退款。</p>`:null}${r.stopped?html`<p>后续已按宿主生命周期停止；已提交成本不退款。</p>`:null}</div>`)}
 ${anjian.slice(-1).map(r=>html`<p key=${r.damage_event_id} data-anjian-result>暗箭 · 直接目标 ${text(r.target_id)} → 自己距离 ${n(r.distance)} ／ 目标攻击范围 ${r.attack_range_infinite===true?'无限':n(r.attack_range)} · ${r.modifier===1?'已将此次来源伤害+1':'此次未加伤'}。基础伤害 ${n(r.base_damage)}；后续转移／防止／防具照常结算。</p>`)}
 ${skillIds.includes('sgs.duodao')?html`<p>夺刀 · 每次实际杀伤害后可弃1手牌／装备。取得来源当前武器到手牌；无武器也可付成本，提交后不退款。</p>`:null}
 ${skillIds.includes('sgs.anjian')?html`<p data-anjian-locked>暗箭 · 锁定，来源伤害窗口自动检查：目标到自己距离 > 目标实际攻击范围时，此伤害+1。转移／连环不新触发。</p>`:null}
 </section>`;
}
