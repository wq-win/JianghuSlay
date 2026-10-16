/** Complete selected Mobile base guides; public status never reads private rule receipts. */
import {html} from 'htm/react';
import {useRef} from 'react';
import {SGS_FOLLOWUP_DEFINITIONS} from '../local/sgs-followup-data.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：三国杀移动版基础身份官网全部固有面板与同产品经典精确条目，2026-10-15选择快照、2026-10-16读取。最大体力／性别为同产品社区字段；未实测2026当前移动客户端。';
const input='触屏点选或Tab定位、Enter确认；可取消提示用Esc退出。重复／过期输入不重复提交。';
const detail={
 sidi:{summary:'真实用闪后可置牌为钤；其他角色出牌阶段移去一钤，令其本阶段杀额度−1',condition:'自己任意回合实际使用闪，或其他角色在自己的回合实际使用闪；消费则仅在其他角色真实出牌阶段开始且有钤。',phase_use:'无自由主动按钮。置牌提示只存牌堆顶实体，不把用出的闪拿回来，也不是摸牌。消费时选择公开的一张钤。',response:'实际虚拟／转化闪也可触发；防伤或未实际使用闪不触发。正常杀额度减少但真正不限次仍有效，决斗打出杀不受出牌次数限制。',disabled_reason:'无对应真实用闪／阶段事件、没有钤、死亡或失技；同一阶段窗口不可重复移去多钤。',notes:['所选基础司敌不含OL同色牌封禁、阶段末附送杀或界曹真预测。H7把钤设为公开实体牌堆，移去进入弃牌堆且不当手牌弃置；属于明示宿主可见性政策。'],hooks:['on_any_response_card','on_any_play_phase_begin'],callbacks:['sgs_on_any_response_sidi','sgs_on_any_play_phase_sidi','sgs_sidi_slash_modifier']},
 fenli:{summary:'手牌／当前体力／装备并列最多时，可分别跳过摸牌／出牌／弃牌阶段',condition:'摸牌前手牌并列最多；出牌前当前HP并列最多；弃牌前装备至少1张且并列最多，条件逐阶段重新检查。',phase_use:'各阶段开始前独立可选，提示显示本人值和当前全场最大值。0手牌与全场0可跳摸牌；全场0装备不可跳弃牌。',response:'跳过整个阶段，不执行其开始、内容、结束效果；正常点结束出牌只是结束已经执行的阶段。',disabled_reason:'不是对应本人真实阶段、条件不满足、死亡或失技；不能通过同阶段多次跳过制造台账。',notes:['三种选择独立，非全回合只能选一种。比较当前HP而非最大体力。H5只记已实际跳过的阶段，不猜算未到达阶段。'],hooks:['before_draw_phase','before_play_phase','before_discard_phase'],callbacks:['sgs_before_draw_fenli','sgs_before_play_fenli','sgs_before_discard_fenli']},
 pingkou:{summary:'真实回合末，按本回合实际跳过阶段数X，选至多X名其他角色各受1点伤害',condition:'自己的真实回合结束窗口，X为本回合全部原因造成的实际阶段跳过数，且仍有其他存活角色。',phase_use:'没有主动出牌按钮，也不在结束阶段开始提前发动。回合末多选不同目标，显示台账、上限与每人1点。',response:'可选择零人、少于X人或X人；不能重复目标或集中X点伤害给一人。逐人通过正常伤害、濒死与救援。',disabled_reason:'X=0、不是实际回合末、无其他存活角色、失技／退场；翻面整回合跳过不会构造六个阶段。',notes:['任何真实跳过原因均计入，包括延时锦囊；无牌可摸、未出牌、无需弃牌均不等于跳过。H5处理额外阶段／截断回合。原版没有界平寇获得装备。'],hooks:['on_actual_turn_end'],callbacks:['sgs_on_actual_turn_end_pingkou','sgs_pingkou_skipped_phases']},
 dingpin:{type:'active',activeId:'sgs.dingpin',summary:'弃本回合未用／弃类别的一张手牌，令受伤角色判定；黑摸损失体力值，红自己翻面',condition:'自己的真实出牌阶段，有未被自己本回合使用／弃置类别的手牌，且存在受伤而未被本回合定品判黑的角色。',phase_use:'只选择手牌，三大类为基本／锦囊／装备，延时牌也属锦囊。可选自己或其他受伤者；界面显示已用类别和判黑禁选目标。',response:'先选成本与目标，提交前取消不支付。由目标进行正常可改判判定；最终黑色摸其当前已损失HP张牌，红色本人真实翻面并可触发法恩。',disabled_reason:'非本人真实出牌、无合法手牌类别、目标未受伤或本回合已判黑、死亡／失技／正在结算。',notes:['使用或弃置历史覆盖本人本回合所有阶段，成本自身立即占用类别。重铸、赠牌、纯响应打出不自动算用／弃。无独立三次按钮额度：可用类别可能不足三种，额外出牌阶段不重置。红色不退还类别，黑色不设摸3上限。'],hooks:['own_play_phase','own_turn_category_history','target_judgment'],callbacks:['sgs_player_dingpin','sgs_dingpin_execute','sgs_dingpin_available']},
 faen:{summary:'任意角色实际双向翻面或进入连环后，可令该角色摸一张',condition:'任意存活角色实际正反面发生改变，或由未横置进入横置，自己仍持有法恩。',phase_use:'无主动按钮。决定权归法恩持有者，目标固定为刚发生变化的角色，可含自己、队友或敌人。',response:'每次事件独立可拒绝，不限回合次数；定品判红的本人翻面也可发动。解除连环、无变化设值不触发。',disabled_reason:'没有真实变化、仅解除连环、目标退场、本人死亡或失技、事件已处理。',notes:['经典法恩两个翻面方向都触发。复原若真实翻回正面可以触发，但解除连环本身不给牌；不能把牌改送第三人。'],hooks:['on_any_general_state_changed'],callbacks:['sgs_on_general_state_changed_faen']},
 wurong:{type:'active',activeId:'sgs.wurong',summary:'每出牌阶段一次，双方秘密选手牌后同时展示；杀对非闪伤1，非杀对闪取一牌',condition:'自己的真实出牌阶段尚未用过，自己与另一存活角色均有手牌。',phase_use:'双方各私选一张并锁定，再同时公开，不拼点。先选人和自己手牌；不能看到对方选择后改选。',response:'杀／非闪：只弃自己展示牌后技能伤害1；非杀／闪：只弃自己展示牌后取得对方一张手牌或装备。另两种组合不弃不伤不取，但机会已用。获得暗手牌只用盲选，公开装备可直接选。',disabled_reason:'同一真实出牌阶段已展示、任一方无手牌、目标为自己、死亡／失技／正在结算。',notes:['展示不是使用或打出；双方锁定前不泄露选择，展示快照不永久公开整手牌。HP恰好1的矢志仍不能把此处的实体闪视为展示杀；获得区不含判定或特殊牌堆。H3规定同时锁定与回放精确一次。'],hooks:['own_play_phase','simultaneous_private_reveal'],callbacks:['sgs_player_wurong','sgs_wurong_execute','sgs_wurong_available']},
 shizhi:{type:'locked',summary:'HP恰好1时，闪只能作为普通杀使用／打出；持有、展示、弃置仍是闪',condition:'动态检查本人当前HP恰好1，且当前正在构建使用或打出身份；不是HP≤1。',phase_use:'主动入口允许以实体闪当普通杀，仍检查杀次数、距离与目标。恢复到其他HP立即恢复闪行为，未提交输入必须重算。',response:'响应杀可用实体闪，响应闪不能把该实体继续当闪；保留实体ID、花色、点数与颜色。矢志后的普通杀不产生使用闪的司敌事件。',disabled_reason:'HP不等于1或技能失效时不转换；杀额度不足、距离不符或响应种类不符仍不可使用。',notes:['仅使用／打出转换，绝非全局重命名。展示、弃置、怃戎分支判断和杀重铸不采用矢志转换。官网旧攻略只用于未改动怃戎，不混入旧全局闪视为杀版本。H4/H6的外国牌及多重转换优先级是宿主扩展。'],hooks:['contextual_use_response_identity'],callbacks:['sgs_shizhi_use_face','sgs_shizhi_response_materials','sgs_commit_shizhi_response']}
};
export const SGS_FOLLOWUP_HERO_IDENTITIES=freeze(Object.fromEntries(SGS_FOLLOWUP_DEFINITIONS.map(h=>[h.id,{name:h.name,hp:h.max_hp,faction:h.faction,gender:'男'}])));
export const SGS_FOLLOWUP_HERO_SKILLS_BY_ID=freeze(Object.fromEntries(SGS_FOLLOWUP_DEFINITIONS.map(h=>[h.id,h.source_skill_rules.map(s=>{const id=s.id.split('.')[1],d=detail[id];return {id:`sgs-followup-${id}`,source_skill_id:s.id,name:s.name,type:'optional',icon:`sgs-followup-${id}`,activeId:null,...d,timing:s.timing,cost:s.cost,limit:s.quota,targets:s.targets,effect:s.effects.join(' '),notes:[source,...d.notes,input]};})])));
export const SGS_FOLLOWUP_SKILL_ICONS=freeze({
 'sgs-followup-sidi':'<path d="M5 3h18v16H5zM9 7h10M9 11h10M3 23h16v7H3zM22 23h8M26 19v11M7 26h8"/>',
 'sgs-followup-fenli':'<path d="M4 6h5v5H4zm9 0h5v5h-5zm9 0h5v5h-5M4 16h23M7 21v8m-4-4 4 4 4-4M16 21v8m-4-4 4 4 4-4M25 21v8m-4-4 4 4 4-4"/>',
 'sgs-followup-pingkou':'<path d="M16 3v10M5 27l11-14 11 14M2 22l3 5 6-1m10 0 6 1 3-5M16 13v17m-4-4 4 4 4-4M10 5h12"/>',
 'sgs-followup-dingpin':'<path d="M4 3h24v26H4zM9 8h3m5 0h7M9 14h3m5 0h7M9 20h3m5 0h7M8 25h16"/>',
 'sgs-followup-faen':'<path d="M10 8a8 8 0 1 0 0 16m12-16a8 8 0 1 1 0 16M10 8l-4-4m4 4-5 1m17 15 4 4m-4-4 5-1M12 12h8v8h-8z"/>',
 'sgs-followup-wurong':'<path d="M2 4h11v19H2zm17 0h11v19H19M5 14l5-7m-5 1 5 5m12-5h5v7h-5M8 28h16m-13-3-3 3 3 3m10-6 3 3-3 3"/>',
 'sgs-followup-shizhi':'<path d="M4 4h10v16H4zM8 8h3m-3 5h3M19 18l8-13 3-2-1 5-8 13m-4-4 6 5M4 26h19m-4-4 4 4-4 4M8 23v6"/>'
});
export const SGS_FOLLOWUP_HOST_POLICIES=freeze(SGS_FOLLOWUP_DEFINITIONS[0].host_compatibility_policies.map(p=>[p.id,p.rule]));
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsFollowupPolicyGuide(){return html`<details className="hero-provenance sgs-followup-policy-guide" onKeyDown=${close}><summary>H0–H7 · 来源版本与江湖兼容边界</summary><p>曹真、朱桓、陈群、张嶷共七项完整固有技能；不额外授予个人主公、觉醒或派生技能。采用基础身份所选版本，未验证当前客户端或完整身份模式。</p><ol>${SGS_FOLLOWUP_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsFollowupHpEvidence({hero}){const h=SGS_FOLLOWUP_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-followup-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。满体力${h.hp}/${h.hp}开局仅为H0宿主初始化，独立初始体力字段未知，不含身份主公加成。官网全部固有技能含隐藏面板已核对；体力／性别来自同产品经典社区字段。未实测2026当前移动客户端，实际上限以对局为准。</p>`:null;}
export const SGS_FOLLOWUP_PROMPT_CONTEXTS=freeze({
 sidi_store:['sgs.sidi','司敌','将牌堆顶一张实体置为钤？','这是置牌，不是摸牌或取得刚使用的闪；钤按H7公开保存。'],
 sidi_debit:['sgs.sidi','司敌','移去恰好一张钤，令当前角色本出牌阶段杀额度−1','效果仅此阶段；真正不限杀仍有效。可拒绝，不自动耗尽多张钤。'],
 fenli_draw:['sgs.fenli','奋励','手牌数并列最多：是否跳过整个摸牌阶段？','此刻重新比较全场存活角色；0手牌并列也满足。'],
 fenli_play:['sgs.fenli','奋励','当前体力并列最多：是否跳过整个出牌阶段？','比较当前HP而非最大体力；已跳过阶段不执行开始／内容／结束效果。'],
 fenli_discard:['sgs.fenli','奋励','至少一件装备且并列最多：是否跳过弃牌阶段？','全场零装备不满足；同一阶段多原因只记一次。'],
 pingkou_targets:['sgs.pingkou','平寇','真实回合末：选择不同其他角色，各受1点伤害','可选零人或少于上限；选择完还须确认，不能把X点集中给一个人。'],
 dingpin_material:['sgs.dingpin','定品','选择本回合未使用／弃置类别的一张手牌','只看基本／锦囊／装备三大类；装备区不能支付。此时尚未弃牌。'],
 dingpin_target:['sgs.dingpin','定品','选择一名受伤角色进行判定，可选自己','黑色摸当前已损失体力值张牌且本回合禁选；红色你翻面。此时仍可取消不支付。'],
 faen_offer:['sgs.faen','法恩','是否令刚变化的角色摸一张？','两个方向翻面或进入连环均可；解除连环不触发。目标固定。'],
 wurong_target:['sgs.wurong','怃戎','选择一名有手牌的其他角色','双方各秘密选一手牌，锁定后同时展示；不是拼点或使用杀。'],
 wurong_private_reveal:['sgs.wurong','怃戎','秘密选择你的一张手牌','对方已选牌不会显示；双方锁定后同时公开。此处实体闪仍展示为闪，矢志不改展示。'],
 wurong_obtain:['sgs.wurong','怃戎','获得目标一张手牌或装备','己方展示牌已支付，须完成合法获得；手牌只按未知槽盲选，不含判定／特殊牌堆。']
});
const STAGES=SGS_FOLLOWUP_PROMPT_CONTEXTS,ids=new Set(Object.values(STAGES).map(r=>r[0]));
const seat=s=>s==='player'?'p1':s,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id,n=v=>Number.isSafeInteger(v)?v:'?';
const category=v=>({basic:'基本',trick:'锦囊',equipment:'装备'}[v]??'未知类别');
const phase=v=>({draw:'摸牌',play:'出牌',discard:'弃牌',prepare:'准备',judge:'判定',end:'结束'}[v]??v??'未知阶段');
const cancelID=id=>['cancel','pass','decline','0','n'].includes(id);
export const isSgsFollowupMandatory=p=>p?.meta?.mandatory===true||p?.meta?.stage==='wurong_obtain';
export const isSgsFollowupPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||ids.has(p?.meta?.skill_id)||ids.has(p?.meta?.source_skill_id)||skill(p)==='sgs.shizhi';
export function isSgsFollowupPrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&p.kind==='choice'&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsFollowupPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsFollowupPrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
function SkipLedger({items=[]}){return items.length?html`<ul className="sgs-followup-skip-ledger">${items.map((r,i)=>html`<li key=${r.phase_event_id??r.id??i}>${phase(r.phase??r.stage)}：${r.reason??r.reasons?.join('、')??'已记录真实跳过'}</li>`)}</ul>`:null;}
export function SgsFollowupResponseContext({state,prompt}){if(!isSgsFollowupPromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage];return html`<section className="response-context sgs-followup-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者决定</div><strong>${r[2]}</strong><p>${r[3]}</p>${m.stage.startsWith('fenli_')?html`<p data-fenli-values>本人 ${n(m.value)} · 全场最大 ${n(m.maximum)} · 跳过${phase(m.phase)}阶段</p>`:null}${m.stage==='sidi_store'?html`<p>现有公开钤 ${n(m.pile_count)} 张</p>`:null}${m.stage==='sidi_debit'?html`<p>本阶段正常杀上限修正 −1；移去的是公开钤，不是弃手牌。</p>`:null}${m.stage==='pingkou_targets'?html`<p data-pingkou-selection>已选 ${(m.selected_target_ids??[]).length} / ${n(m.max_count)} 人 · 每人1点</p><${SkipLedger} items=${m.skipped_phases??[]} />`:null}${m.stage==='dingpin_material'?html`<p data-dingpin-categories>本回合已用／弃类别：${(m.used_categories??[]).map(category).join('、')||'无'}</p>`:null}${m.stage==='dingpin_target'?html`<p>本回合已判黑禁选：${(m.black_target_ids??[]).join('、')||'无'}</p>`:null}${m.stage==='wurong_private_reveal'?html`<p data-wurong-private>仅显示你自己的手牌；双方锁定前没有公开展示。</p>`:null}<small>${input}</small></section>`;}
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)Promise.resolve(result).catch(()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
export function SgsFollowupChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){
 const sent=useRef(null);if(!isSgsFollowupPromptOwner(prompt,state))return null;
 const m=prompt.meta,stage=m.stage,self=state.players.self,own=['dingpin_material','wurong_private_reveal'].includes(stage),mandatory=isSgsFollowupMandatory(prompt);
 const options=(prompt.options??[]).filter(o=>typeof o.id==='string'&&(!mandatory||!cancelID(o.id)));
 const ownCard=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:null;
 const qianCard=id=>/^qian:[1-9]\d*$/.test(id)?self.sgs_followup?.caozhen?.qian_cards?.[Number(id.slice(5))-1]:null;
 return html`<div className="sgs-followup-choices" data-choice-stage=${stage}><div className="dialog-actions wrap">${options.map(o=>{const card=own?ownCard(o.id):stage==='sidi_debit'?qianCard(o.id):null;if(own&&!cancelID(o.id)&&(!card||card.hidden))return null;const blind=stage==='wurong_obtain'&&/^hand:/.test(o.id);return html`<section key=${o.id}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}${blind?html`<span className="sgs-followup-hidden-card" aria-label="未知手牌">手牌背面</span>`:null}<button type="button" className="btn option" data-option-id=${o.id} disabled=${busy||!!o.disabled} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${blind?`未知手牌 ${o.id.slice(5)}`:o.label}</button></section>`;})}</div></div>`;
}
export function SgsFollowupStatus({player}){
 if(!player)return null;const h=player.effective_hero||player.hero,skills=h?.skill_ids??[],s=player.sgs_followup??{},ca=s.caozhen,zhu=s.zhuhuan,chen=s.chenqun,zhang=s.zhangni;
 const showPile=skills.includes('sgs.sidi')||(ca?.qian_count??0)>0;
 const showCao=skills.includes('sgs.sidi')||(ca?.qian_count??0)>0||(ca?.sidi_slash_modifier??0)!==0,showZhu=skills.includes('sgs.fenli')||skills.includes('sgs.pingkou'),showChen=skills.includes('sgs.dingpin')||skills.includes('sgs.faen'),showZhang=skills.includes('sgs.wurong')||skills.includes('sgs.shizhi');
 if(!showCao&&!showZhu&&!showChen&&!showZhang)return null;
 return html`<section className="player-card-status sgs-followup-status" data-followup-status=${player.seat}>
 ${showPile?html`<details className="sgs-followup-public-pile" onKeyDown=${close}><summary>钤 · 公开实体牌堆 ${n(ca?.qian_count??0)} 张</summary><p>H7宿主公开牌堆：置牌而非摸牌，保留真实实体。</p><ul>${(ca?.qian_cards??[]).map(c=>html`<li key=${c.physical_id} data-qian-id=${c.physical_id}>${c.name} · ${c.suit??'无花色'} ${c.rank??'无点数'} · 实体 ${c.physical_id}</li>`)}</ul></details>`:null}
 ${ca?.sidi_slash_modifier?html`<p data-sidi-modifier=${ca.sidi_slash_modifier}>司敌：本出牌阶段正常杀上限修正 ${ca.sidi_slash_modifier}；真正不限杀仍有效。</p>`:null}
 ${showZhu?html`<div data-fenli-ledger>本回合真实跳过：<${SkipLedger} items=${zhu?.current_skipped_phases??[]} />${(zhu?.fenli_events??[]).filter(r=>r.committed&&r.turn_id===zhu.current_turn_id).slice(-3).map(r=>html`<span className="chip" key=${r.event_id}>奋励已跳过${phase(r.phase)}</span>`)}</div>`:null}
 ${showChen?html`<div className="sgs-followup-chenqun"><p data-dingpin-used-categories>定品本回合已用／弃：${(chen?.used_categories??[]).map(category).join('、')||'无'}；判黑禁选：${(chen?.black_target_ids??[]).join('、')||'无'}</p>${(chen?.dingpin_events??[]).filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-dingpin-result=${r.branch}>定品判定归 ${r.target_id}：${r.judgment?.name??'待判定'} ${r.judgment?.suit??''} ${r.judgment?.rank??''} · ${r.branch==='black'?`最终黑色，摸${n(r.drawn)}张（已损失体力值${n(r.requested)}）`:r.branch==='red'?'最终红色，本人翻面':r.branch==='colorless'?'无色，不产生红黑效果':'正在结算'}</p>`)}</div>`:null}
 ${showZhang?html`<div className="sgs-followup-zhangni"><p data-wurong-used=${zhang?.wurong_used?'true':'false'}>怃戎：本真实出牌阶段${zhang?.wurong_used?'已用':'未用'}。</p><p data-shizhi-active=${zhang?.shizhi_active?'true':'false'}>矢志${zhang?.shizhi_active?'生效：HP恰好1，闪仅使用／打出时当普通杀；不能响应闪':'未生效：仅HP恰好1时启用'}。持有、展示、弃置仍为闪。</p>${(zhang?.wurong_events??[]).filter(r=>r.committed).slice(-1).map(r=>html`<details className="sgs-followup-public-reveal" key=${r.event_id} onKeyDown=${close}><summary>怃戎双方已同时展示 · ${r.branch==='damage'?'杀对非闪，弃己牌伤害1':r.branch==='obtain'?'非杀对闪，弃己牌取一牌':'均不命中，双方留牌'}</summary><p>仅本次公开快照；其余暗牌与后来摸牌不公开。</p><ul>${(r.reveal??[]).map(c=>html`<li key=${c.actor_id}>${c.actor_id}：${c.name} · ${c.suit??''} ${c.rank??''}</li>`)}</ul></details>`)}</div>`:null}
 </section>`;
}
