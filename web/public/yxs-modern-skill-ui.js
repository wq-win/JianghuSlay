/** Modern official-publication packets. Reads only owner-authenticated prompts and public projections. */
import {html} from 'htm/react';
import {useRef} from 'react';
import {YXS_MODERN_DEFINITIONS} from '../local/yxs-modern-data.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const input='触屏点选或Tab定位、Enter确认；可取消选择用Esc退出，重复／过期输入不重复提交。';
const detail={
 zaokong:{type:'optional',summary:'保护该牌的一名实际目标；其先摸1，你按至其有向距离摸X，选自己总共1张',condition:'自己使用杀、决斗、烽火狼烟、万箭齐发指定目标，或自己被其中一张牌指定为目标；当前类别尚未发动。',timing:'整张牌指定全部目标后、任何目标响应或结算前；进攻／被指定两个分支共享同类额度。',cost:'不弃牌、不失去体力；原牌已经提交，仍消耗原牌材料与正常出杀次数。',limit:'每个角色的实际回合，杀／决斗／烽火狼烟／万箭齐发四类各1次。不是每目标1次；拒绝不耗额度。',effect:'令原牌仅对所选目标无效，其他目标照常结算。所选目标先摸1，你再摸X；X为提交时从你到其的有向距离，计距离修正，不是武器范围。选自己时X=0，自己总共只摸1。',targets:'从该牌完整的实际目标集合选恰好一名仍存活、尚未被取消的目标，可选自己、队友或敌人。AOE来袭时可保护另一目标，包括结算顺序在自己之前的人。',phase_use:'无自由主动按钮。杀四类在任何真实角色回合分别刷新；自己的进攻与被指定共用同一类标记。',response:'在任何闪、无懈或伤害之前作出决定；被保护目标无需再响应此牌，其余目标保留正常响应。借刀本身与手捧雷不触发，借刀产生的真实杀另按杀判断。',disabled_reason:'不是上述四类、本人既非使用者也非目标、同类已用、目标不在该牌内或已取消、死亡／失技／事件过期。',hooks:['on_aggregate_card_targets'],callbacks:['yxs_on_card_targets_zaokong'],notes:['火杀、雷杀、血杀、毒杀、刺杀共用杀额度属于H5跨作扩展；火攻和独立技能伤害不纳入凿空。','H6先完成重定向／增改目标并提交最终目标，再按行动顺序处理所有凿空持有者；早于逐目标免疫、无懈、闪和伤害。此为江湖兼容顺序，非原生跨作顺序。H7承诺时快照X，后续摸牌不重算；无牌可摸不退次数。']},
 huasheng:{type:'active',activeId:'yxs.huasheng',summary:'以合法杀资源直接使用本整回合尚未用过的非延时锦囊，无懈除外',condition:'自己的实际出牌阶段，可构造一个真实合法杀资源，且有本回合尚未用过、能合法使用的非延时锦囊。',timing:'自己的空闲出牌阶段主动发动；响应窗口不可发动。',cost:'一个受信任、当前可用的杀资源计划，支付其真实材料一次。手牌实体杀为直接路径；已有合法技能／装备能形成杀时才可使用相应组合。',limit:'没有独立每回合／每阶段一次次数帽。每次输出名称必须本人本整回合未使用；额外出牌阶段与失去重获技能不清空。',effect:'选择最终非延时锦囊，始终排除无懈可击；按最终锦囊的真实目标、距离、次数、禁用与无懈规则使用。所有已提交用牌最终牌名均计入，包括实体牌、画圣、其他转化和被无懈的用牌。',targets:'完全遵循所选锦囊：借刀须选持武器者与被杀者；连环选1至2人；AOE／全体牌按全体目标；治疗与取牌按各自资格。不能默认只选一个敌人。',phase_use:'先选可用杀资源，再选完整锦囊功能，最后完成该锦囊目标／分支。提交前取消无消耗；真正提交后不因无效或被无懈退还材料或名称。',response:'这是最终锦囊的一次真实使用。不会先使用杀、消耗杀次数、询问闪或触发杀使用钩子；没有剩余杀次数仍可转换。连环只允许使用，不允许重铸。',disabled_reason:'非本人出牌阶段、没有可用杀资源、输出是延时／无懈／已用名称、最终目标非法、普通禁用牌限制、死亡／失技／正在结算。',hooks:['own_play_phase','whole_turn_card_use_history'],callbacks:['yxs_player_huasheng','yxs_huasheng_execute','yxs_huasheng_available'],notes:['名称历史覆盖本人本整回合全部渠道；其他人用牌、纯响应打出、弃牌、重铸、展示、赠牌和提交前取消不计。画圣限制只管本次输出，不禁止以后普通使用同名实体锦囊。','H4使用当前启用的宿主完整非延时锦囊目录，外作火攻／铁索与用间包属明示扩展；等价别名合并，机制不同不因名字相似合并。','H8仅接入实际持有且合法的杀生产能力，不因选择吴道子赠送武圣、龙胆、傲剑、丈八或矢志。原生宝具傲剑／战神细则仍待官方证据，不实现宝具养成。','H9单材料保留有效花色点数，多材料遵守宿主虚拟牌政策；虚拟杀对象不是额外实体成本，不双付、不留下中间杀历史。']}
};
export const YXS_MODERN_HERO_IDENTITIES=freeze(Object.fromEntries(YXS_MODERN_DEFINITIONS.map(h=>[h.id,{name:h.name,hp:h.max_hp,faction:null,gender:null,publication:h.source_publication_date}])));
export const YXS_MODERN_HERO_SKILLS_BY_ID=freeze(Object.fromEntries(YXS_MODERN_DEFINITIONS.map(h=>[h.id,h.skill_ids.map(skill=>{const id=skill.split('.')[1],d=detail[id];return {id:`yxs-modern-${id}`,source_skill_id:skill,name:h.intrinsic_skill_inventory[0],icon:`yxs-modern-${id}`,activeId:null,...d,notes:[`英雄杀现代手游官方发布：${h.source_publication_date}；2026-10-15选择快照、2026-10-16读取。当前客户端未核验，原生性别／君臣民字段未知。`,...d.notes,input]};})])));
export const YXS_MODERN_SKILL_ICONS=freeze({
 'yxs-modern-zaokong':'<path d="M4 28V11l12-8 12 8v17M10 28V15l6-4 6 4v13M2 28h28M5 18h5m12 0h5M13 21h6m-3-3 3 3-3 3"/>',
 'yxs-modern-huasheng':'<path d="M3 5h18v23H3zM7 9h8M7 23h10M13 19 25 3l4 3-12 16M13 19q-5 0-5 6 6 0 9-2M22 7l4 3M23 22h6m-3-3v6"/>'
});
export const YXS_MODERN_HOST_POLICIES=freeze([
 ['H0','来源血量4／3作为最大体力，满体力开局是宿主初始化；独立初始体力、原生性别与君臣民字段未知，不按立绘推断；需要已知男性的易装等交互不会把未知当男性。'],
 ['H1','人物、回合、用牌、事件、材料均用稳定身份；提交前重验，取消／非法不付费，提交一次后才进入嵌套效果。'],
 ['H2','死亡不新开技能，已承诺流程遵守正常濒死／救援；中断重放不重复材料、摸牌或效果。'],
 ['H3','按有效完整技能描述与人物身份判断；失去重获不刷新本回合额度／名称历史，复制技能不顺带复制体力或身份。'],
 ['H4','画圣目录为当前启用的宿主非延时锦囊，排除无懈；外作／用间牌是兼容扩展，准确等价别名共用名称。'],
 ['H5','凿空四类保持杀／决斗／烽火／万箭，宿主所有杀变体共用杀类；借刀本身、手捧雷和火攻不纳入。'],
 ['H6','先完成重定向／增改目标并提交最终目标，再开一个聚合凿空窗口，按行动顺序处理所有持有者；早于逐目标免疫、无懈、闪和伤害。只对本次牌取消所选最终目标，不能重复领奖；这是确定的江湖兼容优先级，不是原生跨作顺序。'],
 ['H7','凿空提交时快照本人至目标有向距离；包括距离修正，不包括攻击范围。自己固定0，成对摸牌期间不重算。'],
 ['H8','画圣只支付受信任杀资源的真实材料；现有杀生产能力须实际持有且逐项合法，不中途先出杀、不双付。原生宝具组合仍未闭合，不凭空赠送。'],
 ['H9','转换只产生最终锦囊使用与实体来源；单材料保留有效花色点数，多材料遵循宿主虚拟规则，不用连环重铸替代使用。'],
 ['H10','新增美术为原创本地矢量。公开状态只记录已承诺结果，未提交私选不泄露；不可用原因明确，发布版本与当前客户端未核验分别标示。']
]);
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function YxsModernPolicyGuide(){return html`<details className="hero-provenance yxs-modern-policy-guide" onKeyDown=${close}><summary>H0–H10 · 现代发布来源与江湖兼容边界</summary><p>张骞完整固有技能只有凿空；吴道子只有画圣。两个独立完整模板，不合并历史曹操、慕容或王允；不额外授予宝具、升星、羁绊、皮肤或主公技能。</p><ol>${YXS_MODERN_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function YxsModernHpEvidence({hero}){const h=YXS_MODERN_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-modern-source-identity=${hero.id}>${h.name} · 官方发布${h.publication}，正文血量${h.hp}。满体力${h.hp}/${h.hp}开局为H0宿主初始化，独立初始体力字段未知；原生性别／君臣民字段未知。页面显示月／日，年份由同发布活动上下文佐证；未实测当前客户端，未核验全部模式池。官方卡图未成功读取，本作立绘为原创。</p>`:null;}
export const YXS_MODERN_PROMPT_CONTEXTS=freeze({
 zaokong_target:['yxs.zaokong','凿空','选一名实际目标，仅令该牌对其无效','该目标先摸1，你按提交时有向距离摸X；选择自己总共只摸1。其余目标照常结算。'],
 huasheng_resource:['yxs.huasheng','画圣','选择当前可用的杀资源','只支付所示真实材料一次，不先使用杀，也不消耗杀次数；提交前可取消。'],
 huasheng_output:['yxs.huasheng','画圣','选择本整回合未用的非延时锦囊','无懈始终排除；实体牌、其他转化和被无懈用牌的最终名称都计入。没有独立一次次数帽。'],
 youjian_target:['yxs.huasheng','画圣 · 用间锦囊','选择当前启用锦囊的完整合法目标','用间牌是H4宿主兼容扩展；按最终锦囊重验材料离区后的目标资格，仍可取消。'],
 wangyun_trick_target:['yxs.huasheng','画圣 · 锦囊','选择最终锦囊的合法目标','按最终锦囊的人物资格、距离、牌区与限制选择；尚未支付杀资源。'],
 huasheng_target:['yxs.huasheng','画圣','选择最终锦囊的合法目标','仍未支付材料；完成全部目标和分支后，按最终锦囊一次提交。'],
 borrow_weapon:['yxs.huasheng','画圣 · 借刀','选择实际持有武器的角色','下一步还须选择其杀目标；取消任何一步均不支付。'],
 borrow_victim:['yxs.huasheng','画圣 · 借刀','选择持武器者可以杀的目标','持武器者和最终杀目标各自重验；这不是画圣使用者自己先出杀。'],
 snatch_target:['yxs.huasheng','画圣','选择最终取牌锦囊的合法目标','检查移除材料后的距离、目标区域和当前使用限制。'],
 discard_target:['yxs.huasheng','画圣','选择最终弃牌锦囊的合法目标','仅显示实际合法目标；仍可取消，不支付杀资源。'],
 fire_target:['yxs.huasheng','画圣 · 火攻','选择有手牌的角色','火攻属于H4宿主兼容扩展；按普通火攻展示、支付与伤害结算。'],
 iron_chain_mode:['yxs.huasheng','画圣 · 铁索','选择连环／解链','画圣必须使用最终锦囊，不能重铸。'],
 iron_chain_targets:['yxs.huasheng','画圣 · 铁索','选择1至2名不同角色并确认','只按最终连环锦囊结算，不能重复目标或改为重铸。']
});
const STAGES=YXS_MODERN_PROMPT_CONTEXTS,ownedStages=new Set(['zaokong_target','huasheng_resource','huasheng_output','huasheng_target']),ids=new Set(['yxs.zaokong','yxs.huasheng']);
const seat=s=>s==='player'?'p1':s,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id,number=n=>Number.isSafeInteger(n)&&n>=0?n:'?';
const cancelled=id=>['cancel','pass','decline','0','n'].includes(id);
export const isYxsModernPromptStage=p=>ownedStages.has(p?.meta?.stage)||ids.has(p?.meta?.skill_id)||ids.has(p?.meta?.source_skill_id);
export function isYxsModernPrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&p.kind==='choice'&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isYxsModernPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isYxsModernPrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
const labels=freeze({sha:'杀',duel:'决斗',fenghuo:'烽火狼烟',wanjian:'万箭齐发'});
export function YxsModernQuotas({used=[]}){return html`<div className="yxs-modern-quotas" aria-label="凿空当前行动者回合四类额度">${Object.entries(labels).map(([kind,label])=>html`<span key=${kind} data-zaokong-kind=${kind} data-used=${used.includes(kind)}>${label} · ${used.includes(kind)?'已用':'可用'}</span>`)}</div>`;}
export function YxsModernResponseContext({state,prompt}){if(!isYxsModernPromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage];return html`<section className="response-context yxs-modern-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者决定</div><strong>${r[2]}</strong><p>${r[3]}</p>${r[0]==='yxs.zaokong'?html`<${YxsModernQuotas} used=${state.players.self.yxs_modern?.zhangqian?.used_kinds??[]} /><p>本次类别：${labels[m.kind]??'以实际牌为准'}；进攻／被指定共享额度</p>`:null}${m.stage==='huasheng_output'?html`<p data-huasheng-used-names>本人本整回合已用：${(m.used_names??[]).join('、')||'无'}</p>`:null}${(m.chosen_card_name||m.card_name)?html`<p data-huasheng-final-card>最终锦囊：${m.chosen_card_name||m.card_name}</p>`:null}${m.stage==='iron_chain_targets'?html`<p>已选 ${(m.selected_seats??[]).length} / 2 人；至少1人后确认</p>`:null}<small>${input}</small></section>`;}
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)Promise.resolve(result).catch(()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
export function YxsModernChoiceButtons({state,prompt,onRespond,busy=false}){
 const sent=useRef(null);if(!isYxsModernPromptOwner(prompt,state))return null;const m=prompt.meta,self=state.players.self;
 const options=(prompt.options??[]).filter(o=>typeof o.id==='string'&&o.id!=='recast'&&(m.stage!=='zaokong_target'||cancelled(o.id)||(m.target_ids??[]).some(id=>String(id)===String(o.target_id??o.id))));
 return html`<div className="yxs-modern-choices" data-choice-stage=${m.stage}><div className="dialog-actions wrap">${options.map(o=>{const isSelf=m.stage==='zaokong_target'&&!cancelled(o.id)&&seat(o.target_id??o.id)===seat(self.seat);return html`<section key=${o.id}><button type="button" className="btn option" data-option-id=${o.id} data-target-id=${m.stage==='zaokong_target'&&!cancelled(o.id)?o.target_id??o.id:null} disabled=${busy||!!o.disabled} aria-label=${o.disabled?`${o.label}，不可选择`:o.label} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy||!!o.disabled,onRespond,o.id)}>${o.label}</button>${m.stage==='zaokong_target'&&!cancelled(o.id)?html`<small data-zaokong-draw-preview>${isSelf?'保护自己：距离0，自己总共摸1张':`目标先摸1张 · 你摸${number(o.owner_draw??o.distance)}张 · 有向距离${number(o.distance)}`}</small>`:null}${o.disabled?html`<small>本整回合已使用，不能再次作为画圣输出</small>`:null}</section>`;})}</div></div>`;
}
export function YxsModernStatus({player}){if(!player)return null;const h=player.effective_hero||player.hero,skills=h?.skill_ids??[],s=player.yxs_modern??{},z=s.zhangqian,w=s.wudaozi;const showZ=skills.includes('yxs.zaokong'),showW=skills.includes('yxs.huasheng');if(!showZ&&!showW)return null;return html`<section className="player-card-status yxs-modern-status" data-modern-status=${player.seat}>${showZ?html`<div className="yxs-modern-zaokong"><strong>凿空 · 当前行动者回合四类独立额度</strong><${YxsModernQuotas} used=${z?.used_kinds??[]} /><small>进攻／被指定共用；保护自己总共摸1</small>${(z?.events??[]).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-zaokong-committed>已保护 ${r.target_id} · 有向距离快照 ${number(r.distance)} · 仅该牌对其无效</p>`)}</div>`:null}${showW?html`<div className="yxs-modern-huasheng"><p data-huasheng-used-names>画圣 · 本整回合已用名称：${(w?.used_names??[]).join('、')||'无'}</p><small>所有本人实际用牌渠道共计；无独立次数帽；无懈除外</small>${(w?.events??[]).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-huasheng-committed>已提交 ${r.output?.name??'锦囊'} · 真实材料 ${number(r.paid_count)} 张</p>`)}</div>`:null}</section>`;}
