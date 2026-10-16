/** V29 complete selected source guides. Public DTOs and private chooser boundaries only. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：三国杀移动版基础身份官网目录及同产品经典社区字段，2026-10-15资料快照；已核对完整固有技能，含隐藏面板。未核验2026当前移动客户端，不含界、谋、国战或OL异版。';
const input='触屏点选，或Tab定位、Enter确认；有明确取消选项才可Esc退出。每次选择绑定当前提示，重复或过期输入不重复结算。';
const record=(id,name,body)=>({id:`sgs-yijiang-later-${id}`,source_skill_id:`sgs.${id}`,name,type:'optional',icon:`sgs-yijiang-later-${id}`,activeId:null,...body,notes:[source,...body.notes,input]});
export const SGS_YIJIANG_LATER_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.cao-chong':{name:'曹冲',hp:3,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.guan-ping':{name:'关平',hp:4,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.yu-fan':{name:'虞翻',hp:3,faction:'吴',gender:'男'},
 'sgs.adapted.base.hero.guo-huai':{name:'郭淮',hp:4,faction:'魏',gender:'男'}
});
export const SGS_YIJIANG_LATER_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.cao-chong':[
 record('chengxiang','称象',{
 summary:'受到一次真实伤害后亮出顶4，获得点数和不大于13的任意子集',
 condition:'自己承受一次真实伤害，求救已完成且未最终死亡，仍持有称象。防止的伤害和单纯体力流失不触发。',
 timing:'一次伤害及求救完成 → 可选发动 → 公开亮出牌堆顶4 → 点选子集 → 获得所选，余牌弃置',
 cost:'无牌或体力费用；获得来自公开处理区，不是摸4后弃手牌',
 limit:'每次伤害事件一次，与伤害点数无关；一次2伤害只亮一批，两次伤害可分别发动',
 effect:'亮出最多4张真实牌堆顶实体牌，选择点数总和≤13的任意张获得，剩余进入弃牌堆。A/J/Q/K为1/11/12/13，恰好13与单独K合法。可空选，不能超13；不判定、不改判、不复制牌。',
 targets:'自己；只选择这批公开亮出的牌，不读取未来牌堆或他人暗手牌',
 phase_use:'没有自由主动按钮。触发窗口逐张点选／取消选中，实时显示点数和及13上限，确认后完成真实移动。',
 response:'发动前可不发动；亮出后取消取得视为空选，已亮出的牌进入弃牌堆，不放回牌堆。',
 disabled_reason:'无真实伤害事件、已最终死亡、已失去技能、同一事件已处理；无点数或已移走的牌不可选。',
 notes:['P7/P9：以事件而非每点伤害计算。P10：外来无点数牌公开展示但不可参与点数选择，不把null当0。牌堆不足按既有宿主洗牌规则处理。'],hooks:['after_damage_resolved','public_reveal_subset'],callbacks:['sgs_after_damage_chengxiang'] }),
 record('renxin','仁心',{
 summary:'其他角色当前1体力将受伤害时，自己翻面并弃1装备牌，防止全部伤害',
 condition:'最终承伤者是其他未最终死亡角色，当前恰好1体力且正要承受正数伤害；自己持有仁心且有可弃装备牌。',
 timing:'最终目标和防护确定后、扣体力前 → 可选发动 → 校验费用 → 真实翻面并弃装备 → 防止整个伤害事件',
 cost:'自己真实切换武将牌正反面，并弃恰好1张手牌或装备区的装备牌；背面也能翻回正面',
 limit:'没有每回合或一局次数限制；同一持有者对同一待结算伤害事件不重复支付',
 effect:'防止该次全部伤害。2点、3点也全部防止，不是减1或回复体力。无伤害来源也可触发；HP2将受2伤害不符合当前HP1条件。被防止后不产生该伤害的扣血、濒死、受伤收益或连环起点。',
 targets:'最终承伤的另一角色，可为队友或敌人，不限距离；不能保护自己',
 phase_use:'没有自由主动按钮。提示显示承伤者、伤害量、翻面方向和自己合法装备牌费用。',
 response:'费用提交前可取消。只能用自己的手牌／装备区装备牌，不能用普通基本牌、锦囊、判定区或特殊牌堆。',
 disabled_reason:'承伤者不是其他角色、体力不等于1、伤害已被防止、无合法装备、技能失去、重复或过期事件。',
 notes:['采用官网123及2015调整后防伤版，不是旧版濒死翻面交全手牌回复。P8全局最终承伤窗口与原子费用、嵌套回调为宿主合同，当前客户端优先级未验证。'],hooks:['before_any_receiving_damage','flip_and_equipment_cost'],callbacks:['sgs_before_any_receiving_damage_renxin'] })
 ],
 'sgs.adapted.base.hero.guan-ping':[
 record('longyin','龙吟',{
 summary:'角色在自己的出牌阶段用杀时，弃1H/E令此杀免阶段次数；红杀自己摸1',
 condition:'任意存活角色在其自己的真实出牌阶段，已合法提交一次杀的使用；自己持有龙吟且有1张可弃H/E。',
 timing:'用杀合法性及素材失牌提交 → 冻结有效牌色与目标 → 龙吟持有者选择 → 弃牌 → 本次杀免阶段额度 → 红杀持有者摸1 → 杀继续',
 cost:'弃自己恰好1张手牌或装备，不用判定、特殊牌堆、正在处理或此次杀素材',
 limit:'无每阶段／回合次数限制；每名技能持有者对同一次杀使用最多支付一次',
 effect:'仅让这一次已提交的杀不计入其出牌阶段杀次数，保留真实用牌历史和整回合统计。红色有效杀令龙吟持有者摸1，与弃牌颜色无关；黑色或无色不摸。已免费使用的红杀也可触发，额度不能减成负数。杀的目标、伤害、属性、距离规则和响应不改变。',
 targets:'实际杀使用事件；可为自己、队友或敌人，无距离／性别／势力限制',
 phase_use:'没有泛用加伤或额外出杀按钮。自己的额度已耗尽时，不能先非法出杀再指望龙吟补救。',
 response:'提示属于技能持有者；弃牌前可取消。决斗等只打出杀的响应不是使用，不触发。其他人的出牌阶段里被迫用杀不符合“其出牌阶段”。',
 disabled_reason:'非真实已提交杀、使用者不拥有当前出牌阶段、只有打出响应、无可弃牌、已失技、当前事件关闭或已经处理。',
 notes:['P4–P6：真实额外出牌阶段可用；免除原事件的阶段额度，不删除用牌历史、克己活动或原有整回合限额。多素材转化按最终有效牌色，不按任一素材红色判断。'],hooks:['on_committed_sha_use','exact_play_quota_exemption'],callbacks:['sgs_longyin_on_committed_sha_use','sgs_longyin_execute'] })
 ],
 'sgs.adapted.base.hero.yu-fan':[
 record('zongxuan','纵玄',{
 summary:'自己的牌因真实弃置进入弃牌堆后，选任意子集按指定顺序置顶',
 condition:'自己手牌／装备因真实弃置进入弃牌堆，属于同一移动批次且仍在弃牌堆；当前持有纵玄。',
 timing:'原弃置移动提交 → 从该批合格实体点选 → 确认从顶到底顺序 → 原实体移至牌堆顶',
 cost:'无额外费用；移动刚弃置的牌，不获得回手、不复制或洗牌',
 limit:'每个真实弃置批次一次选择，无每回合限次；自己或他人回合均可',
 effect:'可将本批任意张合格牌置于牌堆顶，先选择的是最上面、下一张将摸到的牌。未选留在弃牌堆。普通用牌／响应清理、重铸、赠予、装备替换、特殊牌堆清理和死亡清理不是弃置，不能只看目标区是弃牌堆。',
 targets:'本人本次弃置且仍存在的H/E实体，不能拿弃牌堆其他牌',
 phase_use:'没有界版的出牌阶段摸1放1主动按钮。逐张点选排序，已选顺序清楚展示；确认提交或取消全部。',
 response:'可跳过或只选部分。回顶不撤销原弃牌及毒／失装回调，也不会递归再次发动纵玄。',
 disabled_reason:'不是实际弃置、非本人H/E、实体已移走、已失技、本批已处理，或没有可选实体。',
 notes:['P13/P14：真实弃置语义、先选最顶、实体位置重验及跨包回调顺序是宿主合同。排除界／OL新增主动、上家弃牌与额外结束阶段条款。'],hooks:['after_cards_lost','ordered_discard_to_decktop'],callbacks:['sgs_after_cards_lost_zongxuan'] }),
 record('zhiyan','直言',{
 summary:'真实结束阶段令任一人摸1并展示；若为装备，实际使用后再回1',
 condition:'自己的真实结束阶段已开始，仍持有直言，尚未处理本阶段事件。',
 timing:'弃牌阶段后进入结束阶段 → 可选目标 → 目标摸1并展示该实体 → 若装备则目标真实使用 → 成功后回复1',
 cost:'无牌或体力费用；确定目标后不再提供装备保留／取消回复的第二选择',
 limit:'每个真实结束阶段事件一次；不是任意回合末，也不插入新的结束阶段',
 effect:'目标摸1并公开展示真正摸到的那张牌。非装备保留在手；装备须由目标作为用牌者真实使用，处理正常替换、离装与装入回调，再回复1，受当前上限限制。虞翻是技能发起者，不冒充目标用牌者。',
 targets:'任意一名未最终死亡角色，可选自己、队友、敌人，满体力也合法；不限距离／性别／势力',
 phase_use:'仅在真正结束阶段选目标，无自由主动按钮。摸牌、展示、装备使用和回复分别留下真实记录。',
 response:'选人前可不发动，确定后正常合法装备使用为强制。不得从目标手牌随便另选一张假装是摸到的牌。',
 disabled_reason:'未进入本人结束阶段、已经处理、已失技或目标已最终死亡；装备禁止／废槽／牌已移动时适用P17。',
 notes:['P17宿主政策：只在成功真实合法使用装备后回复；禁止使用、废除装备槽或实体过期时不伪造用牌、装备或回复，仍在手里的原牌保留。原生失败分支U2仍未核实，不能把本作政策当成移动客户端裁定。','选官网“使用此牌，然后回复”，排除历史先回复后使用版本。虞翻的来源规则性别为男。'],hooks:['on_end_phase','exact_draw_reveal','real_recipient_equipment_use','recover_after_use'],callbacks:['sgs_on_end_phase_zhiyan'] })
 ],
 'sgs.adapted.base.hero.guo-huai':[
 record('jingce','精策',{
 summary:'真实出牌阶段结束时，本回合本人真实用牌数≥当前体力，可摸2',
 condition:'本人一个实际进入并完成的出牌阶段结束，整回合本人真实使用的牌数不小于此刻体力。',
 timing:'真实出牌阶段结束 → 快照本回合用牌数与当前体力 → 可选摸2 → 继续后续阶段',
 cost:'无牌或体力费用',
 limit:'每个真实出牌阶段结束一次；真实额外阶段分别可触发，整回合计数延续，跳过／未进入不触发',
 effect:'统计当前整个回合自己真实使用牌的事件数，一次多素材或无实体虚拟用牌仍算1。嵌套的本人真实用牌各计1；被闪避、抵消、防止或龙吟免额度仍计使用。达到当前体力门槛可摸2。只打出响应、弃置、重铸、赠予、非用牌技能和他人用牌不计。',
 targets:'仅自己；无其他目标选择',
 phase_use:'无额外主动按钮。阶段末提示显示本回合实际用牌数、当前体力、是否额外阶段，可选择摸2或不发动。',
 response:'可以不发动；这是每个真实出牌阶段的结束窗口，不是回合结束自动摸牌。',
 disabled_reason:'跳过或未进入出牌阶段、阶段未真实完成、用牌数小于当前体力、已失技、已最终死亡或当前阶段已处理。',
 notes:['明确选择官网124“此回合内”整回合统计版本；同产品社区“本阶段”是未选的不同版本，不能混写。P16真实阶段结束与回合事件统计为宿主合同，非当前客户端认证。'],hooks:['on_play_phase_end','whole_turn_card_use_count'],callbacks:['sgs_on_play_phase_end_jingce'] })
 ]
});
export const SGS_YIJIANG_LATER_SKILL_ICONS=freeze({
 'sgs-yijiang-later-chengxiang':'<path d="M16 3v23M5 9h22M7 9 2 21h10L7 9m18 0-5 12h10L25 9M9 29h14m-13-8q-3 7-7 0m18 0q4 7 8 0"/>',
 'sgs-yijiang-later-renxin':'<path d="M16 29S3 22 3 12a7 7 0 0 1 13-4 7 7 0 0 1 13 4c0 10-13 17-13 17ZM16 12v11m-5-5h10"/>',
 'sgs-yijiang-later-longyin':'<path d="m3 27 21-21m-8 0 10-3 3 10-6-2M8 23l-4-4m4 8 4 4M17 14q8 0 6 7t-9 2M5 8q5-7 9-3m7 21q5 4 8-2"/>',
 'sgs-yijiang-later-zongxuan':'<path d="M4 16h12v14H4Zm6-7h12v14h-6M16 3h12v14h-6M3 4h7M7 1l3 3-3 3M7 21h6m0 4H7"/>',
 'sgs-yijiang-later-zhiyan':'<path d="M3 4h17v22H3Zm4 5h9m-9 5h9M20 10l9 5v12l-6 4-6-4V16m6 1v9m-4-5h8"/>',
 'sgs-yijiang-later-jingce':'<path d="M3 4h21v24H3Zm5 5h3m5 0h4M8 14h3m5 0h4M8 19h3m5 0h4M8 24h8M26 12l4 4-4 4m3-4h-8"/>'
});
export const SGS_YIJIANG_LATER_HOST_POLICIES=freeze([
 ['P0','最大体力3／4／3／4及全员男性来自同产品经典显式字段。独立初始体力未知，满体力开局为宿主政策；当前客户端、完整身份模式未认证。'],
 ['P1/P2','按当前有效技能和稳定事件回执处理；人类保留全部合法目标，AI偏好不改变合法性，不看他人暗手牌和未来牌堆。'],
 ['P3/P10','普通牌费用仅H/E。点数A/J/Q/K=1/11/12/13；外来无点数牌公开但不可参与称象点数选择，不把null默认为0。'],
 ['P4–P6','龙吟只对用牌者自己的真实出牌阶段已合法提交杀生效；免原事件阶段额度，保留用牌历史与整回合限制，不追溯取消原目标合法性。'],
 ['P7–P9','称象每伤害事件一次；仁心在最终目标扣血前真实翻面与弃装备，防止整个事件。跨包窗口及原子提交为明确宿主顺序。'],
 ['P13/P14','纵玄只选本人H/E实际弃置的当前批次；先选最顶，真实弃牌回顶不撤销原失牌回调。用牌清理、替换、死亡清理不冒充弃置。'],
 ['P15/P17','直言真实结束阶段，目标摸到的同一张牌公开；合法装备由目标真实使用后回1。禁止／废槽／过期失败不制造使用或回复。原生U2仍未验证。'],
 ['P16','精策明确选官网124“本回合”统计，排除社区“本阶段”版本；真实额外出牌阶段各自结束可触发，跳过阶段不触发。']
]);
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsYijiangLaterPolicyGuide(){return html`<details className="hero-provenance sgs-yijiang-later-policy-guide" onKeyDown=${close}><summary>P0–P17 · 来源版本与江湖兼容边界</summary><p>本批完整登记曹冲、关平、虞翻、郭淮。以上为该历史批次范围；满宠已由后续独立资料包核实并登记，御策完整规则与来源见满宠详情。</p><ol>${SGS_YIJIANG_LATER_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsYijiangLaterHpEvidence({hero}){const h=SGS_YIJIANG_LATER_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-yijiang-later-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。通常满体力${h.hp}/${h.hp}开局为P0宿主初始化，来源独立初始体力字段未知；不含身份主公加成。官网完整技能面板已核对，体力／性别为同产品经典社区显式字段。未实测2026当前移动客户端，实际体力上限以对局状态为准。</p>`:null;}
export const SGS_YIJIANG_LATER_PROMPT_CONTEXTS=freeze({
 chengxiang_offer:['sgs.chengxiang','称象','choice','每次伤害事件一次：可亮出顶4','选择发动后公开亮牌，点数和不大于13。一次多点伤害不会重复亮牌。'],
 chengxiang_subset:['sgs.chengxiang','称象','choice','选择要获得的牌：点数和≤13','逐张点选，实时累计；恰好13与单独K合法。无点数牌可见但不可选；取消取得即空选，余牌弃置。'],
 renxin_offer:['sgs.renxin','仁心','choice','翻面并弃1装备牌，防止全部待结算伤害','目标必须是另一名当前1体力角色；可保护敌人，无伤害来源也可。背面可以翻回正面。'],
 renxin_equipment:['sgs.renxin','仁心','choice','选择自己的1张装备牌作为费用','手牌中的装备和已装备的牌都可，不能用基本牌、锦囊、判定或特殊牌堆；确认前可取消。'],
 longyin_offer:['sgs.longyin','龙吟','choice','已合法使用的这一张杀：弃牌令其免阶段额度','不会额外出杀或加伤，保留全部用牌历史。红色有效杀令龙吟持有者摸1，与弃牌颜色无关。'],
 longyin_material:['sgs.longyin','龙吟','select_hand','弃置自己1张手牌或装备','费用提交前可取消。只能使用自己的H/E，不能选择当前处理中的杀素材。'],
 zongxuan_order:['sgs.zongxuan','纵玄','choice','点选真实弃牌：先选的牌在最顶','从本次实际弃置的合格实体逐张选择；下方顺序从顶到底。完成只提交已选子集，取消全部则留在弃牌堆。'],
 zhiyan_target:['sgs.zhiyan','直言','choice','选择任意角色摸1并展示；装备先用后回1','可选自己、队友、敌人和满体力者。正常合法装备使用强制；P17失败不伪造使用／回复，原生U2未验证。'],
 jingce_offer:['sgs.jingce','精策','choice','当前真实出牌阶段结束：整回合用牌统计','明确选择官网“本回合”版本，达到当前体力门槛可摸2。额外出牌阶段仍沿用本回合计数。']
});
const STAGES=SGS_YIJIANG_LATER_PROMPT_CONTEXTS,ids=new Set(Object.values(STAGES).map(r=>r[0]));
const seat=s=>s==='player'?'p1':s,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const n=v=>Number.isSafeInteger(v)?v:'?',flip=v=>v==='face_up'?'正面':v==='face_down'?'背面':'未知';
export const isSgsYijiangLaterMandatory=p=>p?.meta?.mandatory===true;
export const isSgsYijiangLaterPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||ids.has(skill(p));
export function isSgsYijiangLaterPrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&r[2]===p.kind&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsYijiangLaterPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsYijiangLaterPrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
export function SgsYijiangLaterResponseContext({state,prompt}){if(!isSgsYijiangLaterPromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage];return html`<section className="response-context sgs-yijiang-later-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前技能持有者决定</div><strong>${r[3]}</strong><p>${r[4]}</p>${r[0]==='sgs.renxin'?html`<p data-renxin-preview="true">最终承伤者 ${m.target_seat} · 将防止全部 ${n(m.damage)} 点伤害 · 自己${flip(m.flip_from)} → ${flip(m.flip_to)}</p>`:null}${r[0]==='sgs.longyin'?html`<p data-longyin-preview=${m.card_use_id}>杀使用者 ${m.card_user_id} · 有效牌色 ${m.used_card_color||'无色'} · ${m.quota_was_counted?'此杀原计入阶段次数':'此杀原已免阶段次数'} · ${m.used_card_color==='红'?'支付后自己摸1':'不产生红杀摸牌'}<small>原阶段 ${m.phase_event_id}；保留真实用牌历史。</small></p>`:null}${m.stage==='chengxiang_subset'?html`<p className="sgs-later-point-budget" data-point-sum=${n(m.point_sum)} aria-live="polite">已选点数和 ${n(m.point_sum)} / ${n(m.max_point_sum)} · ${m.point_sum===13?'恰好13，合法':'不大于13方可获得'}</p>`:null}${m.stage==='jingce_offer'?html`<p data-jingce-count=${n(m.card_use_count)}>本回合本人真实用牌 ${n(m.card_use_count)} 张 ≥ 当前体力 ${n(m.hp_threshold)} · ${m.extra?'真实额外出牌阶段':'真实出牌阶段'}结束</p>`:null}<small>${input}</small></section>`;}
const cancelID=id=>['cancel','pass','decline','0','n'].includes(id);
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const r=onRespond(value);if(r?.then)Promise.resolve(r).catch(()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
const equipmentTypes=new Set(['武器','防具','-1马','+1马']);
export function SgsYijiangLaterChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){const sent=useRef(null);if(!isSgsYijiangLaterPromptOwner(prompt,state))return null;const m=prompt.meta,stage=m.stage,own=['renxin_equipment','longyin_material'].includes(stage),self=state.players.self;const options=(prompt.options??[]).filter(o=>typeof o.id==='string'&&(!isSgsYijiangLaterMandatory(prompt)||!cancelID(o.id)));const ownCard=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:id.startsWith('eq:')?self.equipment?.[id.slice(3)]:null;
return html`<div className="sgs-yijiang-later-options">${stage==='zongxuan_order'?html`<section className="sgs-later-top-order" aria-label="纵玄牌堆顶顺序"><strong>从牌堆顶到底 · 第一张最先摸</strong><ol>${(m.selected_order??[]).map((c,i)=>html`<li key=${c.physical_id} data-top-order=${i+1}>${i===0?'最顶：':''}${c.name} · ${c.suit||'无花色'} ${c.rank??'无点数'}</li>`)}</ol>${!m.selected_order?.length?html`<p>尚未选牌</p>`:null}</section>`:null}<div className="dialog-actions wrap">${options.map(o=>{const card=own?ownCard(o.id):stage==='chengxiang_subset'?(m.revealed_cards??[]).find(c=>c.id===o.id):stage==='zongxuan_order'?(m.eligible_cards??[]).find(c=>c.id===o.id):null;const material=own&&!cancelID(o.id),invalidMaterial=material&&(!card||card.hidden||(stage==='renxin_equipment'&&!equipmentTypes.has(card.type)));if(invalidMaterial)return null;const selected=stage==='chengxiang_subset'&&card?.selected,disabled=busy||!!o.disabled||(stage==='chengxiang_subset'&&card&&(!card.available||!card.selectable)&&!selected);return html`<section key=${o.id} className=${selected?'is-selected':''}>${card&&!card.hidden&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}${card&&stage==='chengxiang_subset'?html`<small data-reveal-card=${card.material_id}>${card.name} · 点数 ${card.point??'未知，不可选'} · ${selected?'已选':'未选'}</small>`:null}${card&&stage==='zongxuan_order'?html`<small>来源 ${card.from_zone==='hand'?'手牌':'装备区'} · 本批真实弃置</small>`:null}<button type="button" className="btn option" data-option-id=${o.id} aria-pressed=${stage==='chengxiang_subset'&&card?!!selected:undefined} disabled=${disabled} title=${o.disabled?o.reason||'当前不可选择':undefined} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${o.label}${o.disabled&&o.reason?html`<small>${o.reason}</small>`:null}</button></section>`;})}</div></div>`;}
export function SgsYijiangLaterStatus({player}){if(!player)return null;const hero=player.effective_hero||player.hero,s=player.sgs_yijiang_later;if(!s&&!SGS_YIJIANG_LATER_HERO_IDENTITIES[hero?.id])return null;const c=s?.caochong,g=s?.guanping,y=s?.yufan,j=s?.guohuai;return html`<section className="player-card-status sgs-yijiang-later-status" data-yijiang-later-status=${player.seat}><span className="chip">当前体力 ${n(player.hp)} / 实际上限 ${n(player.max_hp)}</span>${c?.chengxiang_events?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-chengxiang-sum=${n(r.point_sum)}>称象：取得点数和 ${n(r.point_sum)}，按一次伤害事件结算。</p>`)}${c?.renxin_events?.filter(r=>r.prevented).slice(-1).map(r=>html`<p key=${r.event_id} data-renxin-prevented=${r.prevented_damage}>仁心：已防止 ${r.target_id} 的全部 ${n(r.prevented_damage)} 点伤害，翻为${flip(r.flip_to)}。</p>`)}${g?.longyin_events?.filter(r=>r.exempted).slice(-1).map(r=>html`<p key=${r.card_use_id} data-longyin-exempt=${r.card_use_id}>龙吟：${r.card_user_id} 此次杀免原出牌阶段次数，真实用牌历史保留；自己已摸 ${n(r.drawn)} 张。</p>`)}${y?.zongxuan?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id}>纵玄：已按顺序回顶 ${r.selected_order.length} 张。</p>`)}${y?.zhiyan?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id} data-zhiyan-outcome=${r.outcome||r.status}>直言：${r.target_id} · ${r.outcome==='equipment_used'?'装备真实使用已提交，随后处理回复':r.outcome==='equipment_use_prohibited'?'P17：装备使用失败，没有使用或回复；原生U2未验证':r.outcome==='non_equipment'?'展示非装备牌，保留在手':'按摸牌、展示、真实使用、回复顺序结算'}</p>`)}${j?.phases?.slice(-1).map(r=>html`<p key=${r.phase_event_id} data-jingce-phase=${r.phase_event_id}>精策整回合统计 ${n(r.count)} / 体力门槛 ${n(r.hp)} · ${r.draw_done?'已结算摸2':r.accepted?'正在摸牌':'未发动'}。官网本回合版。</p>`)}</section>`;}
