/** V30 selected-source guides and owner-only choices. No current-client certification. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：三国杀移动版基础身份官网完整目录及同产品经典社区字段，2026-10-15资料快照，含隐藏固有技能面板。未实测2026当前移动客户端；不混入界、谋、OL、国战或其他改版。';
const input='触屏点选，或Tab定位、Enter确认；只有可取消的提示可按Esc退出。重复或过期输入不重复结算。';
const record=(id,name,body)=>({id:`sgs-yijiang-more-${id}`,source_skill_id:`sgs.${id}`,name,type:'optional',icon:`sgs-yijiang-more-${id}`,activeId:null,...body,notes:[source,...body.notes,input]});
export const SGS_YIJIANG_MORE_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.li-dian':{name:'李典',hp:3,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.cao-zhi':{name:'曹植',hp:3,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.zhu-ran':{name:'朱然',hp:4,faction:'吴',gender:'男'}
});
export const SGS_YIJIANG_MORE_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.li-dian':[
 record('xunxun','恂恂',{summary:'真实摸牌阶段开始，私看顶4，选2置顶、其余置底，随后正常摸牌',
 condition:'本人真正进入摸牌阶段，仍持有恂恂且当前阶段未处理。跳过或封锁整个摸牌阶段不触发。',timing:'摸牌阶段跳过检查 → 真实开始 → 可选私看顶4 → 顶2及底2分别排序 → 正常摸牌或后续摸牌替代',cost:'无费用；只移动原牌堆实体，不直接获得牌，不产生失手牌、弃置或用牌',limit:'每个真实摸牌阶段开始一次；额外阶段单独处理，没有一局限次',effect:'私下观看实际顶4。先依次选恰好2张置顶，再依次选其余2张置底。两个序列都是先选先摸；置底牌要等原有中间牌摸完。回牌后继续正常摸牌，不是直接拿2，也不替代摸牌。',targets:'自己私看这一批牌；不公开牌面，不读取更深牌堆或他人暗手牌',phase_use:'没有自由主动按钮。确认发动后必须完成顶底两个顺序；界面显示各槽及下一张摸到的方向。',response:'发动前可拒绝。观看后不能用取消少放或多放；技能或阶段失效会恢复原实体顺序。',disabled_reason:'未进入真实摸牌阶段、跳过／封锁、死亡、已失技、当前阶段已处理。',notes:['P4：洗牌后实际不足4张时，顶min(2,n)，其余置底。这是有限牌堆宿主政策，非原生客户端裁定。P5：只替代普通摸牌的其他技能不会撤销已经发生的阶段开始排序。'],hooks:['on_draw_phase_start','private_deck_partition'],callbacks:['sgs_on_draw_phase_start_xunxun']}),
 record('wangxi','忘隙',{summary:'与其他人造成或受到每1点真实伤害后，可分别决定双方各摸1',
 condition:'自己对其他角色造成伤害，或受到其他来源角色的伤害；求救后双方仍存活并持有技能。',timing:'真实伤害及求救完成 → 按实际伤害点数逐次可选 → 双方按行动座次先后各摸1',cost:'无牌或体力费用',limit:'每1点实际伤害一个独立机会；一次2伤害可以发动0、1或2次；无回合次数上限',effect:'每次同意，自己与本次真实另一伤害参与者各摸1。来源看最终实际来源，目标看最终承伤者。双方按共享行动座次顺序摸牌，正常处理毒和摸牌拦截。',targets:'实际另一伤害参与者，队友和敌人都合法，不限距离、手牌数或性别',phase_use:'没有主动伤害按钮。提示显示伤害事件、第几／共几点、另一角色及各摸1。',response:'每点可以独立拒绝，不会一并拒绝后面的点。生命／技能变化按P2/P3处理后续机会。',disabled_reason:'自己伤害自己、无来源伤害、体力流失、被防止的0伤害、双方已死亡或已失技不产生机会。',notes:['P2/P3：双方存活及共享摸牌顺序是明示江湖合同。已完成的摸牌不会因后续死亡、拦截或失技回滚。'],hooks:['after_source_damage','after_damage_resolved'],callbacks:['sgs_after_source_damage_wangxi','sgs_after_damage_resolved_wangxi']})
 ],
 'sgs.adapted.base.hero.cao-zhi':[
 record('luoying','落英',{summary:'其他角色的梅花牌因真实弃置或判定入弃牌堆后，可取得该实体',
 condition:'另一角色的有效梅花实体牌因真实弃置或判定进入弃牌堆，自己仍持有落英，原牌仍在弃牌堆。',timing:'原失牌／判定移动完成 → 按行动顺序提供逐张机会 → 可获得仍在弃牌堆的原牌',cost:'无费用；取得符合条件的原实体，非随机摸牌',limit:'无回合限次；每张合格实体独立选择，同一事件不能重复拿牌',effect:'手牌与装备的真实弃置都可能合格，不限弃牌阶段。另一角色的判定牌也可能合格。天妒、洛神或纵玄已移走的牌不可再取，不从手里或牌堆偷回，也不复制。',targets:'其他角色这次弃置／判定的梅花实体，不包括自己的牌',phase_use:'没有泛用从弃牌堆拿牌按钮。逐张显示公开牌与语义原因，可独立同意或拒绝。',response:'真实弃置和判定才触发。普通用牌／响应清理、重铸、拼点、死亡清理和特殊牌堆清理不因落入弃牌堆而合格。',disabled_reason:'非梅花、自己的牌、非真实弃置／判定、牌已移走、失技、已处理同一实体位置事件。',notes:['P9–P11：有效花色取原移动语境；改判中被替换和最终判定牌按被判定者归属，竞争回收按共享行动顺序。U2原生移动客户端改判归属／竞争顺序未核实。'],hooks:['after_any_cards_enter_discard','judgment_discard'],callbacks:['sgs_after_any_cards_enter_discard_luoying']}),
 record('jiushi','酒诗',{type:'active',activeId:'sgs.jiushi',summary:'正面时翻为背面，真实视为用酒；受伤前后均背面才可伤后翻回',
 condition:'需要合法使用酒且武将牌正面向上；另一个伤后分支要求扣血前立即快照为背面、伤害及求救后仍为背面。',timing:'合法酒窗口 → 可选翻面并真实用虚拟酒；或真实伤害／求救完成 → 双时点均背面 → 可选翻回正面',cost:'用酒分支由正面真实翻为背面，无实体素材；伤后翻回无额外牌费',limit:'出牌用酒遵守普通酒的真实整回合额度与禁用；濒死自救酒不消耗进攻酒额度；翻回每次伤害事件一次，非每点',effect:'出牌阶段酒产生下一次杀的酒加成；自己濒死时酒回复自己1。必须真实记录一次无素材虚拟酒使用。伤前正面、濒死中用酒诗翻成背面，不获得这次伤害的翻回机会。',targets:'酒仅自己，不能替别人喝酒救援；翻面只改变自己的武将牌朝向',phase_use:'合法出牌阶段用酒时点酒诗按钮。濒死自救通过全局救援选项；背面或酒禁用时不可点。',response:'伤后翻回是独立可拒绝机会。体力流失、被防止伤害不触发；嵌套伤害各有独立快照。',disabled_reason:'背面不能翻面用酒；酒被禁用、额度用尽或无合法用酒窗口时无免费翻面。伤后分支须伤前和伤后均背面。',notes:['P12明确选同产品详细基础酒诗双时点规则。官网简文只写伤后背面，差异U1保留，不能据简文改成只查当前背面。无成章觉醒、摸锦囊或衍生技能。'],hooks:['real_virtual_wine_use','global_rescue','after_damage_resolved'],callbacks:['sgs_jiushi_available','sgs_jiushi_rescue_options']})
 ],
 'sgs.adapted.base.hero.zhu-ran':[
 record('danshou','胆守',{type:'active',activeId:'sgs.danshou',summary:'本出牌阶段依次弃1/2/3/4/5…张：弃其1、其交1、伤1、双方各摸2',
 condition:'本人真实出牌阶段，拥有下一次所需恰好X张可弃手牌／装备；支付所选装备后攻击范围内仍有合法其他角色。',timing:'显示下一次序号X → 精确选X张费用 → 预览支付后范围选目标 → 原子弃置 → 只结算对应分支',cost:'第X次恰好弃自己X张手牌或装备；不含判定区／特殊牌堆，不能任意指定X跳阶',limit:'X为本真实出牌阶段发动序号，自1开始；取消或非法选择不增。真实新阶段重新计数；无第4次上限',effect:'X=1：自己弃目标H/E/J一张，暗手牌只选背面。X=2：目标自行选择交给自己H/E一张。X=3：对目标造成1点普通伤害。X≥4：双方各摸2，第5次仍各2。各分支不累加。',targets:'支付费用后仍在自己攻击范围内的一名其他存活角色；队友也合法，不能自己。杀的无限距离不等同攻击范围',phase_use:'点胆守，界面显示下一次序号和准确费用。材料选择后再选支付后范围内目标；可以停止继续发动。',response:'费用提交前可取消。第1次弃牌由自己选，第2次交牌由目标私选；这两个已支付后的选择无取消。',disabled_reason:'不在本人真实出牌阶段、下一费用不足、支付武器／进攻马后目标出范围、分支1目标无H/E/J、分支2目标无H/E。',notes:['P6–P8：普通费用与交牌H/E；弃他人牌H/E/J。支付后范围、原子费用、存活及中断为江湖合同。费用完成后不因后续死亡或效果失败退款。排除旧伤后摸1终止回合，以及界／OL／谋反应版。'],hooks:['own_play_phase','atomic_exact_cost','post_cost_attack_range'],callbacks:['sgs_player_danshou','sgs_danshou_execute','sgs_danshou_available']})
 ]
});
export const SGS_YIJIANG_MORE_SKILL_ICONS=freeze({
 'sgs-yijiang-more-xunxun':'<path d="M3 8h10v15H3Zm16 0h10v15H19M4 3h8m-4-2L5 3l3 2m12 23h8m-4-2 3 2-3 2M6 12h4m-4 4h4m12-4h4m-4 4h4"/>',
 'sgs-yijiang-more-wangxi':'<path d="M4 12a7 7 0 0 1 12-5 7 7 0 0 1 12 5c0 8-12 16-12 16S4 20 4 12ZM2 17h10m-3-3 3 3-3 3m21-3H20m3-3-3 3 3 3"/>',
 'sgs-yijiang-more-luoying':'<path d="M16 27V15m-5 13h10M16 4a5 5 0 0 1 5 5 5 5 0 1 1-5 7 5 5 0 1 1-5-7 5 5 0 0 1 5-5ZM4 2l2 3M27 3l-2 3M3 25l3-3m21 3-3-3"/>',
 'sgs-yijiang-more-jiushi':'<path d="M6 3h20l-3 12q-7 7-14 0L6 3Zm10 16v9m-6 1h12M8 8h16M2 18v7h5m-5 0 4-5m24-4v-7h-5m5 0-4 5"/>',
 'sgs-yijiang-more-danshou':'<path d="M3 28V21h7v-7h7V7h7V2h5m-5 0h5v5M6 25h1m6-7h1m6-7h1M3 3l7 7m-7 0 7-7"/>'
});
export const SGS_YIJIANG_MORE_HOST_POLICIES=freeze([
 ['P0/P1','最大体力李典3、曹植3、朱然4及男性／魏魏吴来自同产品经典字段；独立初始体力未知，满体力开局是宿主初始化。技能按当前持有者与真实事件回执处理，不复制他人消耗状态。'],
 ['P2–P5','忘隙逐点独立、双方按行动顺序摸牌；恂恂真实摸牌阶段开始先私有排序，再继续正常摸牌。有限牌堆顶min(2,n)是宿主退化规则。'],
 ['P6–P8','普通弃牌与交牌只H/E，弃别人一张可H/E/J。胆守支付后真实攻击范围、原子精确费用与本阶段序号为明确合同。'],
 ['P9–P11','落英只认真实弃置／判定语义和弃牌堆当前位置；改判归属及多持有者竞争顺序是宿主政策，U2原生细则未认证。'],
 ['P12/P13','酒诗双时点：扣血前背面且伤后仍背面才能翻回。用酒是真实零素材虚拟用牌；遵守普通酒合法窗口和额度。官网简文差异U1与当前客户端认证均保留。']
]);
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsYijiangMorePolicyGuide(){return html`<details className="hero-provenance sgs-yijiang-more-policy-guide" onKeyDown=${close}><summary>P0–P13 · 来源版本与江湖兼容边界</summary><p>本历史批次完整登记李典、曹植、朱然。当时陈琳笔伐来源死亡／失技后的U4生命周期未决，因此隔离于该批次之外。后续陈琳已按历史真实回合开始版及HR15／HR16／HR17宿主生命周期边界独立接入；完整笔伐、颂词与P17整局记账见陈琳资料栏。原生生命周期与当前客户端仍未核验。</p><ol>${SGS_YIJIANG_MORE_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsYijiangMoreHpEvidence({hero}){const h=SGS_YIJIANG_MORE_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-yijiang-more-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。满体力${h.hp}/${h.hp}开局是P0宿主初始化，独立初始体力字段未知；不含身份主公加成。完整技能含隐藏面板已核对；体力／性别为同产品经典社区字段。未实测2026当前移动客户端，实际上限以对局为准。</p>`:null;}
export const SGS_YIJIANG_MORE_PROMPT_CONTEXTS=freeze({
 xunxun_offer:['sgs.xunxun','恂恂','confirm','真实摸牌阶段开始：可私看顶4','先选择是否发动。排序完成后继续正常摸牌，没有直接获得或替代摸牌。'],
 xunxun_top_order:['sgs.xunxun','恂恂','choice','私选置顶牌：第一张最先摸到','恰好选所需顶牌，再排序其余底牌；发动后必须完成全部顺序。'],
 xunxun_bottom_order:['sgs.xunxun','恂恂','choice','私选置底牌：第一张在底部序列中先摸到','原有中间牌摸完才到这组底牌。必须完成其余牌顺序，牌面仅当前持有者可见。'],
 wangxi_offer:['sgs.wangxi','忘隙','confirm','每1点伤害独立决定双方各摸1','可以拒绝当前一点而接受下一点。敌人也合法，双方按行动座次先后正常摸牌。'],
 luoying_offer:['sgs.luoying','落英','confirm','获得其他人这张真实弃置／判定的梅花牌？','逐张独立选择；只取原实体当前仍在弃牌堆的牌，不拿已被其他技能移走的牌。'],
 jiushi_wine:['sgs.jiushi','酒诗','confirm','正面翻为背面，真实使用一张虚拟酒','零实体素材；遵守酒的合法窗口和额度，不能因禁用或费用失败白翻面。'],
 jiushi_rescue:['sgs.jiushi','酒诗','confirm','正面翻为背面，真实用酒自救回复1','只用于本人濒死，零实体素材；此次不消耗进攻酒额度。伤前正面、此时才翻背面，不获得同一伤害的翻回机会。'],
 jiushi_return:['sgs.jiushi','酒诗','confirm','本次扣血前及伤后均背面：可翻回正面','每次真实伤害事件一次。伤前正面、濒死时才酒诗翻背面的同一伤害不触发。'],
 danshou_materials:['sgs.danshou','胆守','choice','选择下一次所需的准确费用','只用自己的手牌或装备。当前尚未支付，选择目标前可以取消。不能跳阶。'],
 danshou_target:['sgs.danshou','胆守','choice','选择支付所选装备后仍在攻击范围内的其他人','队友也合法，自己不合法。失去武器／进攻马后的范围已用于目标筛选。'],
 danshou_discard:['sgs.danshou','胆守','choice','第1次：弃置目标的一张牌','目标手牌不展示牌面；可选公开装备或判定牌。费用已提交，必须完成合法选择。'],
 danshou_give:['sgs.danshou','胆守','choice','第2次：由你选择交给胆守持有者一张牌','你是目标，私下选择自己的手牌或装备；不能交判定牌或特殊牌堆。费用已提交，必须选择。']
});
const STAGES=SGS_YIJIANG_MORE_PROMPT_CONTEXTS,ids=new Set(Object.values(STAGES).map(r=>r[0]));
const seat=s=>s==='player'?'p1':s,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const n=v=>Number.isSafeInteger(v)?v:'?';
export const isSgsYijiangMoreMandatory=p=>p?.meta?.mandatory===true;
export const isSgsYijiangMorePromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||ids.has(skill(p));
export function isSgsYijiangMorePrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&r[2]===p.kind&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsYijiangMorePromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsYijiangMorePrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
export function SgsYijiangMoreResponseContext({state,prompt}){if(!isSgsYijiangMorePromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage];return html`<section className="response-context sgs-yijiang-more-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者决定</div><strong>${r[3]}</strong><p>${r[4]}</p>${r[0]==='sgs.luoying'&&m.card?html`<p data-luoying-card=${m.physical_id}>来源 ${m.source_seat} · ${m.semantic_action==='judgment'?'判定':'真实弃置'} · ${m.card.name} · ${m.card.suit} ${m.card.rank??'无点数'}</p>`:null}${r[0]==='sgs.wangxi'?html`<p data-wangxi-point=${n(m.point)}>第 ${n(m.point)} / ${n(m.damage)} 点 · 另一参与者 ${m.other_seat} · 双方各摸1</p>`:null}${r[0]==='sgs.danshou'?html`<p data-danshou-ordinal=${n(m.ordinal)}>当前第 ${n(m.ordinal)} 次 · 精确费用 ${n(m.exact_count??m.cost_count??m.ordinal)} 张 · ${m.ordinal===1?'弃目标1牌':m.ordinal===2?'目标交给你1牌':m.ordinal===3?'对目标造成1点普通伤害':'双方各摸2张'}</p>`:null}<small>${input}</small></section>`;}
const cancelID=id=>['cancel','pass','decline','0','n'].includes(id);
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const r=onRespond(value);if(r?.then)Promise.resolve(r).catch(()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
export function SgsYijiangMoreChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){const sent=useRef(null);if(!isSgsYijiangMorePromptOwner(prompt,state))return null;const m=prompt.meta,stage=m.stage,self=state.players.self,own=['danshou_materials','danshou_give'].includes(stage);const options=(prompt.options??[]).filter(o=>typeof o.id==='string'&&(!isSgsYijiangMoreMandatory(prompt)||!cancelID(o.id)));const ownCard=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:id.startsWith('eq:')?self.equipment?.[id.slice(3)]:null;const label=id=>(m.preview??[]).find(c=>c.id===id)?.label??'已选实体';
 return html`<div className="sgs-yijiang-more-choices" data-choice-stage=${stage}>${stage.startsWith('xunxun_')&&stage!=='xunxun_offer'?html`<section className="sgs-more-private-order" aria-label="恂恂私有置顶置底顺序"><p>仅你可见 · 共 ${n(m.count)} 张 · 顶 ${n(m.top_count)} 张／底 ${n(m.bottom_count)} 张</p><div className="sgs-more-order-trays">${[['top','置顶：第一张下一次先摸',m.selected_top??[]],['bottom','置底：中间牌之后，第一张先摸',m.selected_bottom??[]]].map(([tray,title,selected])=>html`<section key=${tray} data-order-tray=${tray}><strong>${title}</strong><ol>${selected.map((id,i)=>html`<li key=${id} data-order-index=${i+1}>${label(id)}</li>`)}</ol>${!selected.length?html`<small>尚未选牌</small>`:null}</section>`)}</div></section>`:null}${stage==='danshou_materials'?html`<p aria-live="polite">已选 ${(m.selected??[]).length} / ${n(m.exact_count)} 张，尚未支付</p>`:null}<div className="dialog-actions wrap">${options.map(o=>{const card=own?ownCard(o.id):null;if(own&&!cancelID(o.id)&&(!card||card.hidden))return null;const blind=stage==='danshou_discard'&&/^hand:/.test(o.id);return html`<section key=${o.id}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}${blind?html`<span className="sgs-more-hidden-card" aria-label="未知手牌">手牌背面</span>`:null}<button type="button" className="btn option" data-option-id=${o.id} disabled=${busy||!!o.disabled} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${blind?`未知手牌 ${o.id.slice(5)}`:o.label}</button></section>`;})}</div></div>`;}
export function SgsYijiangMoreStatus({player}){if(!player)return null;const hero=player.effective_hero||player.hero,s=player.sgs_yijiang_more;if(!s&&!SGS_YIJIANG_MORE_HERO_IDENTITIES[hero?.id])return null;const l=s?.lidian,c=s?.caozhi,z=s?.zhuran;return html`<section className="player-card-status sgs-yijiang-more-status" data-yijiang-more-status=${player.seat}><span className="chip">当前体力 ${n(player.hp)} / 实际上限 ${n(player.max_hp)}</span>${l?.xunxun_events?.filter(r=>r.reordered).slice(-1).map(r=>html`<p key=${r.phase_event_id}>恂恂：已私下置顶 ${n(r.top_count)} 张、置底 ${n(r.bottom_count)} 张，继续正常摸牌。</p>`)}${l?.wangxi_events?.slice(-1).map(r=>html`<p key=${r.damage_event_id}>忘隙：本次 ${r.points?.filter(p=>p.accepted).length??0} 点已选择双方各摸1。</p>`)}${z?html`<p data-danshou-next=${n(z.next_ordinal)}>胆守下一次费用 ${n(z.next_ordinal)} 张；1弃牌／2交牌／3伤害／4及以上双方各摸2。</p>`:null}${z?.danshou_events?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id}>胆守已支付第 ${n(r.ordinal)} 次 ${n(r.paid_count)} 张费用。</p>`)}${c?html`<p>酒诗：${player.face_orientation==='face_down'?'背面，不能翻面用酒':'正面，可在合法酒窗口翻面用酒'}；伤后翻回须本次伤前也为背面。</p>`:null}</section>`;}
