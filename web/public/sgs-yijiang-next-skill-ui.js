/** V28 source-ID guides and private controls; consumes public DTOs and viewer hand only. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：三国杀移动版基础身份目录，2026-10-15资料快照；完整固有技能面板均已核对，含隐藏技能。最大体力及性别由同产品经典社区资料补足，独立初始体力未知。未核验2026当前移动客户端，不含界、谋、国战或OL异版。';
const input='触屏点选，或键盘Tab定位、Enter确认；只有明确提供取消的步骤可Esc退出。已提交次数不退还；重复或过期输入不会重复结算。';
const record=(id,name,type,body)=>({id:`sgs-yijiang-next-${id}`,source_skill_id:`sgs.${id}`,name,type,icon:`sgs-yijiang-next-${id}`,activeId:null,...body,notes:[source,...body.notes,input]});
export const SGS_YIJIANG_NEXT_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.liao-hua':{name:'廖化',hp:4,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.bu-lian-shi':{name:'步练师',hp:3,faction:'吴',gender:'女'},
 'sgs.adapted.base.hero.han-dang':{name:'韩当',hp:4,faction:'吴',gender:'男'}
});
export const SGS_YIJIANG_NEXT_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.liao-hua':[
 record('dangxian','当先','locked',{
 summary:'实际回合开始、准备阶段以前，执行一个真实额外出牌阶段',
 condition:'自己正面开始一个实际回合，当前仍持有当先；本回合开始事件尚未处理。翻面跳过整个预定回合时没有当先。',
 timing:'回合开始 → 当先额外出牌 → 准备 → 判定 → 摸牌 → 普通出牌 → 弃牌 → 结束',
 cost:'无牌或体力代价，锁定执行；不额外摸牌，也不从弃牌堆获得杀',
 limit:'每个实际回合开始一次额外出牌阶段；每阶段杀与阶段限次技能重新计算，酒和回合限次不重置',
 effect:'执行真实出牌阶段的进入、行动与结束，然后回到同一回合的准备阶段。不是额外整个回合，也不是单阶段多一次杀。其后乐不思蜀若生效，只跳过后面的普通出牌，已执行的当先阶段不被撤销。额外阶段结束没有提前判定、摸牌、弃牌或回合结束。',
 targets:'自己；阶段内每张牌和技能仍遵守各自目标规则',
 phase_use:'显示“当先 · 额外出牌（准备前）”；使用普通行动区，结束该阶段后继续准备等正常流程。',
 response:'锁定阶段没有取消技能按钮；可正常结束该出牌阶段。阶段内仍可进行所有合法响应。',
 disabled_reason:'翻面跳过的预定回合、已最终死亡、失去当先、本回合开始已处理或没有真实回合开始事件。',
 notes:['N1：阶段入口与跨包触发顺序是明示宿主政策。阶段杀额度和本回合用牌历史分开，普通酒每实际回合一次。'],hooks:['actual_turn_start','inserted_play_phase'],callbacks:['sgs_on_turn_begin_dangxian'] }),
 record('fuli','伏枥','limited',{
 summary:'濒死时一局一次，回复至全场势力数X，再将武将牌正反面切换',
 condition:'自己处于真实濒死流程，尚未最终死亡，仍持有伏枥且本人本局限定标记未使用。',
 timing:'濒死时本人响应机会；早期选择不发动后，只要仍濒死且未用，后续本人救援菜单仍可选',
 cost:'消耗本人本局一次限定标记；无手牌或额外体力代价，回复前先提交标记',
 limit:'本人本局生命周期一次，失技、复制、重获、换阶段、换回合和存档不刷新已用标记',
 effect:'计算所有未最终死亡角色的不同势力数X，把自己体力回复至min(X,当前体力上限)，然后真实翻面：正面转背面，背面转正面。是回复至目标，不是回复X点；负体力也按目标计算。没有摸牌、清区域、解除连环、免伤或死后复活。',
 targets:'仅自己；X包含濒死但未死的自己，排除已最终死亡角色',
 phase_use:'没有自由主动按钮；公共状态展示限定标记、当前X、预计回复目标及翻面方向。',
 response:'在伏枥提示或本人合法濒死救援菜单选择；可继续普通救援，不消耗限定标记，也不等于放弃全部求救。',
 disabled_reason:'不在濒死、已最终死亡、已用限定标记、已失去伏枥或该响应已经提交。',
 notes:['N2：以当前有效SGS来源形态及已合并SGS别名的势力计数；无SGS势力者统一为一个江湖中立势力。这是本作兼容，不按队伍或英雄杀君臣民计数。','N3/N4：本人限定标记持久化与跨包濒死响应顺序为宿主政策；完整复制取得技能，不复制别人的已用记录。'],hooks:['owner_dying','owner_rescue_response','recovery_then_flip'],callbacks:['sgs_on_dying_entry_fuli','sgs_fuli_can_rescue','sgs_fuli_rescue_execute'] })
 ],
 'sgs.adapted.base.hero.bu-lian-shi':[
 record('anxu','安恤','active',{
 summary:'每出牌阶段一次，令两名其他角色中手牌多者自选1张给少者；交后相等则摸1或回1',
 condition:'自己的真实空闲出牌阶段，尚未使用安恤；存在两名其他存活角色，且双方手牌数不同。',
 timing:'选定两人并提交阶段次数 → 多牌者私下自选交1手牌 → 完成真实失牌得牌 → 比较实际手牌数 → 相等则选收益',
 cost:'自己无牌或体力代价；选定合法两人即占用本阶段次数，多牌者必须交1张真实手牌',
 limit:'每个真实出牌阶段一次；选人前可取消，选定两人后赠牌不可取消，不是每回合一次',
 effect:'两名目标均不能是自己。手牌多者自己选择一张手牌交给少者，不能拿装备、判定或特殊牌堆。真实移动及嵌套失牌得牌结算后，如果两人手牌数相等，自己选摸1张或回复1体力；满体力只能摸1。没有花色判断、强制展示、盲偷或把牌给步练师。',
 targets:'恰好两名其他存活角色，可为队友或敌人，不限距离、性别、阵营；只公开手牌数',
 phase_use:'点击安恤或Q，选择符合条件的两人。1v1没有两名其他角色，安恤自然不可发动，显示原因。',
 response:'交牌只向赠予者显示其自己的手牌；步练师和接收者不代选。确认交牌及相等后的奖励均为必须完成。',
 disabled_reason:'非自己的空闲出牌阶段、本阶段已用、已失去安恤，或没有两名其他手牌数不同的存活角色。',
 notes:['采用移动版2015-12-01调整后交牌／交后相等收益版本，排除旧版获得展示、非黑桃奖励及界安恤。','N5：比较发生在真实失牌得牌回调完成后，嵌套中断与重新验证为明确宿主合同。'],hooks:['own_play','private_giver_choice','after_transfer'],callbacks:['sgs_player_anxu','sgs_anxu_execute'],activeId:'sgs.anxu' }),
 record('zhuiyi','追忆','death_trigger',{
 summary:'最终死亡时可令一名其他存活角色摸3再回1，排除实际击杀者',
 condition:'本人救援失败并已确认最终死亡；死亡前有效技能快照含追忆，该唯一死亡事件尚未处理。',
 timing:'最终死亡提交 → 追忆选择并结算 → 死者实体区域清理 → 对局终局检查',
 cost:'无牌或体力代价；本人已经阵亡，不能借此重新救援或复活',
 limit:'每个真实死亡事件一次，回执防重复；仅濒死或被救回不触发',
 effect:'可令一名其他存活角色先摸3张牌，再回复1点体力。满体力角色仍合法并得到3张牌，回复受当前上限限制。不是把死者手牌给他人，不改变死者死亡状态。实际伤害击杀者不能选择；单纯体力流失没有伤害击杀者，不能把导致失血者自动排除。',
 targets:'一名其他存活角色，排除实际击杀者；不按敌我、距离或是否受伤限制',
 phase_use:'没有自由主动按钮；本人已阵亡时仍能在死亡选择窗决定或不发动。',
 response:'可以不发动；选人后先真实摸3再回复1，摸牌期间目标已最终死亡则不继续回复。',
 disabled_reason:'尚在濒死、被救回、死亡前已失去追忆、该死亡事件已处理，或没有排除击杀者后的合法其他角色。',
 notes:['N6/N7：类型化死亡原因、死亡前有效技能快照、死亡技能在清理及终局以前处理，是本作明确调度合同，不代表原生身份模式已经完整实现。'],hooks:['committed_final_death','pre_cleanup','pre_terminal'],callbacks:['sgs_before_death_zhuiyi'] })
 ],
 'sgs.adapted.base.hero.han-dang':[
 record('gongqi','弓骑','active',{
 summary:'每出牌阶段一次，弃1H/E，本回合真实攻击范围无限；弃装备牌可再弃他人1H/E',
 condition:'自己的真实空闲出牌阶段，未用弓骑，有1张可弃置手牌或装备。',
 timing:'先选并弃1张H/E，完成真实失牌与失装回调，再取得本回合无限攻击范围；装备牌成本另有可选弃牌',
 cost:'弃置自己恰好1张手牌或装备，不能用判定区或特殊牌堆；装备牌无论来自手牌或装备区都启用后续',
 limit:'每个真实出牌阶段一次；无限攻击范围持续至本实际回合结束，额外出牌阶段和结束阶段仍生效',
 effect:'令自己的真实攻击范围无限，不是把距离设为1，也不是仅杀忽略距离。若成本是装备牌，可再弃一名其他角色1张手牌或装备；暗手牌盲选、公开装备明选。无杀次数、目标数或伤害加成，不绕过空城等硬性禁止，也不让顺手牵羊自动无距离。',
 targets:'额外弃牌可选一名其他存活且有可弃H/E角色，可为队友，不限距离；不能弃判定区或特殊牌堆',
 phase_use:'点击弓骑或Q选择1张自己的H/E；成本提交前可取消。装备成本后的弃他人牌是可选，不做也保留已经支付的成本与范围。',
 response:'没有杀／闪响应；真实失牌和失装会结算各自回调。后续弃他人牌不展示其手牌内容。',
 disabled_reason:'非自己的空闲出牌阶段、本阶段已用、没有可弃H/E、已失去弓骑；已生效范围失技后仍保留至真回合结束。',
 notes:['N9：明确选官网119整回合版；同产品BWIKI写本阶段，是未选的不同版本，不能混用或声称当前客户端已核验。','N10：角色的牌按历史通用术语解释为手牌／装备，移动同版直接目标区裁定未核。真实攻击范围参与解烦判断；最终死亡清除，真正回合结束清除。'],hooks:['own_play','real_attack_range','true_turn_end'],callbacks:['sgs_player_gongqi','sgs_gongqi_attack_range'],activeId:'sgs.gongqi' }),
 record('jiefan','解烦','limited_active',{
 summary:'出牌阶段一局一次，选一角色；攻击范围含其的其他人依次弃武器或令其摸1',
 condition:'自己的真实空闲出牌阶段，持有解烦且本人本局限定标记未用；目标可以是自己。',
 timing:'选择目标并消耗限定标记 → 冻结攻击范围含目标者 → 从当前回合者起按行动顺序逐一结算',
 cost:'本人消耗一局一次限定标记；每位参与者自己选择弃1张手牌／装备区武器，或让目标摸1',
 limit:'本人本局生命周期一次；换阶段、换回合、失技、重获和存档都不重置已经使用的标记',
 effect:'对冻结名单中的每名仍存活角色，分别完成其选武器并真实弃置，或令目标真实摸1，再进入下一人。无武器只能令目标摸牌。不能用防具、坐骑、判定或特殊牌堆支付。弃武器后攻击范围变化不重算名单；目标最终死亡则停止。不是濒死时出杀转桃，不含界版重置。',
 targets:'任意一名存活角色，包括自己、队友、敌人；该目标自己不算其攻击范围内的参与者。其他角色按实际攻击范围判断，弓骑范围无限可参与。',
 phase_use:'点击解烦或W先选目标，确认前可取消且不花限定；每位参与者会在自己的私有窗口作决定。',
 response:'参与者不能免费跳过：弃合法武器或令目标摸1。只看自己的手牌武器，其他人看不到牌面。',
 disabled_reason:'非自己的空闲出牌阶段、已用本局限定、已失去解烦或没有存活目标。',
 notes:['N11–N13：目标不计自己、参与名单冻结、行动顺序、死亡中断及持久限定标记是明示宿主合同。','锁定采用官网完整弓骑／解烦基础身份包，保留资料版本差异；不冒充当前客户端实测。'],hooks:['own_play','sequential_private_weapon_choice','lifetime_marker'],callbacks:['sgs_player_jiefan','sgs_jiefan_execute'],activeId:'sgs.jiefan' })
 ]
});
export const SGS_YIJIANG_NEXT_SKILL_ICONS=freeze({
 'sgs-yijiang-next-gongqi':'<path d="M9 3q20 13 0 26M9 3v26M3 16h27m-5-5 5 5-5 5M11 6l4 6m-4 14 4-6"/>',
 'sgs-yijiang-next-jiefan':'<path d="M16 3v7m-8 3 8-3 8 3M8 13v9m16-9v9M3 24h10v5H3Zm16 0h10v5H19ZM11 16h10m-5-6v12"/>',
 'sgs-yijiang-next-dangxian':'<path d="M5 29V4m1 1 15 2-4 6 6 5-17-2M12 29l8-9 8 9M20 21v10"/>',
 'sgs-yijiang-next-fuli':'<path d="M8 8a12 12 0 1 1-3 17M8 3v6H2m8 8 4-4 4 4-4 4Zm9-8 4 4-4 4M10 25h12"/>',
 'sgs-yijiang-next-anxu':'<path d="M3 5h9v13H3Zm17 9h9v13h-9M13 8h11l-3-3m3 3-3 3M19 24H8l3-3m-3 3 3 3M6 8h3m-3 4h3m14 6h3m-3 4h3"/>',
 'sgs-yijiang-next-zhuiyi':'<path d="M16 29V17M6 12q4-8 10 2 6-10 10-2 1 7-10 9Q5 19 6 12Zm10-7q-5 5 0 10 5-5 0-10ZM3 27l7-3m12 0 7 3M10 30h12"/>'
});
export const SGS_YIJIANG_NEXT_HOST_POLICIES=freeze([
 ['N0','最大体力4／3／4为同产品经典来源；独立初始体力未知，满体力开局是宿主政策。当前客户端和完整身份模式均未认证。'],
 ['N1','当先在同一真实回合准备前运行独立出牌阶段；只重置阶段额度，不刷新酒及回合次数，不额外摸牌或开新回合。'],
 ['N2','全场势力按当前有效SGS来源及其合并别名；其余角色统一一个江湖中立势力。包含濒死未死者，排除最终死亡者，不按队伍或君臣民。'],
 ['N3','伏枥先消耗本人生命周期限定标记，再回复至min(X,当前上限)，然后真实切换正反面；不复活、不摸牌或清区域。'],
 ['N4','早期不发动伏枥不消耗标记；仍濒死时后续本人救援菜单保留机会，回执和标记防止重复。'],
 ['N5','安恤选两名其他角色并提交阶段次数；多牌者私下自选交1手牌，全部失牌得牌回调后比较实际手牌数，再给相等奖励。'],
 ['N6','追忆只在最终死亡触发，先摸3再回1，排除真实伤害击杀者；纯体力流失来源不自动当作击杀者。'],
 ['N7','死亡前有效技能快照与唯一死亡回执；先死亡技能，再实体清理，再终局检查，已阵亡持有者仍可决定追忆。'],
 ['N9','韩当明确选官网119整回合版弓骑，社区本阶段版另存为未选实质不同版本；不混写，不认证当前客户端。'],
 ['N10','弓骑H/E按历史通用术语解释为手牌／装备；移动同版直接目标区裁定未核。先实际弃牌，再给真攻击范围无限；装备成本可选弃其他人H/E，范围至真回合结束，死亡清除。'],
 ['N11','解烦先选任意存活目标并消耗限定，按当前实际攻击范围冻结其他参与者；目标自身不参与。'],
 ['N12','参与者按当前行动顺序逐个弃自己的H/E武器或令目标摸1；失装／摸牌回调逐项完成，不合并摸N，后续范围变化不重算名单。'],
 ['N13','解烦限定是本人本局生命周期一次，存档、失技和重获不重置；复制不带别人的标记，不含界版重置。']
]);
const closeOnEscape=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsYijiangNextPolicyGuide(){return html`<details className="hero-provenance sgs-yijiang-next-policy-guide" onKeyDown=${closeOnEscape}><summary>N0–N7、N9–N13 · 江湖兼容边界</summary><p>以下为明确宿主规则，与已核对的来源技能分开；未实测2026当前移动客户端，不代表完整身份模式。</p><ol>${SGS_YIJIANG_NEXT_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsYijiangNextHpEvidence({hero}){const h=SGS_YIJIANG_NEXT_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-yijiang-next-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。通常满体力${h.hp}/${h.hp}开局为N0宿主初始化，来源独立初始体力字段未知；不含身份主公加成。官网完整技能与同产品经典数字／勾玉体力已核对。未实测2026当前移动客户端，实际体力上限以对局状态为准。</p>`:null;}
export const SGS_YIJIANG_NEXT_PROMPT_CONTEXTS=freeze({
 gongqi_cost:['sgs.gongqi','弓骑','select_hand','弃置自己1张手牌或装备','费用提交前可以取消。装备牌无论来自手牌还是已装备区，均可开启可选额外弃牌；范围维持整个实际回合。'],
 gongqi_target:['sgs.gongqi','弓骑','choice','装备牌费用已付：可选其他角色弃1H/E','可不弃，已提交费用和阶段次数不退还；不选判定牌。可选盟友，不限距离。'],
 gongqi_card:['sgs.gongqi','弓骑','select_target_card','选择该角色1张手牌或装备弃置','手牌暗选，公开装备明选。此后续可放弃；不会撤销已经支付的弓骑费用或无限攻击范围。'],
 jiefan_target:['sgs.jiefan','解烦','choice','限定：选择任意一名存活角色','可选自己。确认目标才消耗本局限定标记，并冻结当前攻击范围包含目标的其他参与者。'],
 jiefan_choice:['sgs.jiefan','解烦','choice','轮到你：弃1张武器，或令指定角色摸1','只能弃自己的手牌／装备区武器，不能用防具或坐骑。不能免费跳过；无武器自动令目标摸1，逐人完整结算。'],
 fuli_choice:['sgs.fuli','伏枥','choice','限定濒死回复：回复至X，再翻面','可以不发动并继续普通救援；未用且仍濒死时，后续本人救援菜单仍保留伏枥。不是回复X点，也不是死亡后复活。'],
 anxu_targets:['sgs.anxu','安恤','choice','选择两名其他角色，手牌多者交1张给少者','选人前可取消；确认合法两人后占用本阶段次数。只显示手牌数，赠予者自己私下选牌。1v1没有合法两人。'],
 anxu_give:['sgs.anxu','安恤','select_hand','你是手牌多者：选择1张自己的手牌交出','安恤已提交，必须交1张手牌；不能用装备、判定或特殊牌堆，也不能拒绝。牌面只对你显示。'],
 anxu_reward:['sgs.anxu','安恤','choice','交牌后双方手牌数相等：选择收益','真实失牌得牌回调均已完成，再比较实际手牌数。选择摸1或回复1；满体力只摸1。此步必须完成。'],
 zhuiyi_target:['sgs.zhuiyi','追忆','choice','最终死亡：可让其他人摸3，再回复1','你已阵亡，仍可决定追忆；满体力目标也合法。排除真实伤害击杀者，单纯失血没有伤害击杀者。可不发动。']
});
const STAGES=SGS_YIJIANG_NEXT_PROMPT_CONTEXTS,skillIDs=new Set(Object.values(STAGES).map(r=>r[0]));
const canonicalSeat=s=>s==='player'?'p1':s;
const n=v=>Number.isSafeInteger(v)&&v>=0?v:'?';
const promptSkill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
export const isSgsYijiangNextMandatory=p=>['anxu_give','anxu_reward','jiefan_choice'].includes(p?.meta?.stage)||p?.meta?.mandatory===true;
export function isSgsYijiangNextPromptStage(p){return Object.hasOwn(STAGES,p?.meta?.stage)||skillIDs.has(promptSkill(p));}
export function isSgsYijiangNextPrompt(p){const m=p?.meta||{},row=STAGES[m.stage];return Boolean(row&&row[0]===promptSkill(p)&&row[2]===p.kind&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
const privateOwner=(p,state)=>{const self=canonicalSeat(state?.players?.self?.seat);return Boolean(self&&p?.player_id&&canonicalSeat(p.player_id)===self&&p?.meta?.private_to&&canonicalSeat(p.meta.private_to)===self);};
export const isSgsYijiangNextPromptOwner=(p,state)=>isSgsYijiangNextPrompt(p)&&privateOwner(p,state);
const basisLabels={effective_sgs_source:'当前有效三国杀来源',merged_sgs_source_alias:'已合并三国杀来源别名',neutral_jianghu_host_policy:'N2宿主：无SGS势力，统一江湖'};
export function SgsFuliProjection({projection,recoveryTarget,flipTo}){if(!projection||!Array.isArray(projection.actors))return null;return html`<section className="sgs-fuli-projection" data-fuli-x=${n(projection.count)}><strong>伏枥当前 X=${n(projection.count)} · 预计回复至 ${n(recoveryTarget)} 体力 · 随后${flipTo==='face_up'?'翻为正面':'翻为背面'}</strong><ul>${projection.actors.map(row=>html`<li key=${row.actor_id} data-faction-actor=${row.actor_id}>${row.name||row.actor_id}${row.dying?'（濒死未阵亡）':''}：${row.faction} · ${basisLabels[row.basis]||'来源依据未知'}${row.source_ids?.length?` · ${row.source_ids.join('、')}`:''}${row.effective_hero_id!==row.original_hero_id?' · 按当前有效形态':''}</li>`)}</ul><small>N2宿主兼容：其余角色共用一个江湖势力；不按队伍或君臣民。只计未最终死亡角色，每人计一次。</small></section>`;}
export function SgsYijiangNextResponseContext({state,prompt}){if(!isSgsYijiangNextPromptOwner(prompt,state))return null;const m=prompt.meta,row=STAGES[m.stage];return html`<section className="response-context sgs-yijiang-next-context" data-source-skill-id=${row[0]} data-response-stage=${m.stage}><div className="response-kicker">${row[1]} · ${isSgsYijiangNextMandatory(prompt)?'必须完成':'当前响应者决定'}</div><strong>${row[3]}</strong><p>${row[4]}</p>${m.stage==='fuli_choice'?html`<${SgsFuliProjection} projection=${m.faction_projection} recoveryTarget=${m.recovery_target} flipTo=${m.flip_to} />`:null}${m.stage==='jiefan_choice'?html`<p data-jiefan-participant=${m.participant_index}>参与者 ${Number.isSafeInteger(m.participant_index)?m.participant_index+1:'?'} / ${n(m.participant_count)} · 指定摸牌者 ${m.recipient_seat}</p>`:null}${m.stage==='anxu_give'?html`<p data-anxu-recipient=${m.recipient_seat}>交给 ${m.recipient_seat} · 仅手牌，私下赠予</p>`:null}${m.stage==='zhuiyi_target'?html`<p data-zhuiyi-killer=${m.killer_seat||'none'}>${m.killer_seat?`排除实际击杀者：${m.killer_seat}`:'没有实际伤害击杀者；不额外排除失血来源'}</p>`:null}<small>${input}</small></section>`;}
export function SgsYijiangNextStatus({player,state=null}){if(!player)return null;const hero=player.effective_hero||player.hero,s=player.sgs_yijiang_next||{},l=s.liaohua||{},b=s.bulianshi||{},guides=SGS_YIJIANG_NEXT_HERO_SKILLS_BY_ID[hero?.id],skills=hero?.skill_ids||[];if(!guides&&!l.owned&&!l.used&&!b.anxu_used_phases?.length&&!b.zhuiyi_events?.length)return null;const used=b.anxu_used_phases?.includes(player.play_phase_id),inserted=state?.turn_actor===player.seat&&state?.turn_phase==='play'&&(state?.play_phase_kind==='dangxian'||state?.play_phase_source_skill==='sgs.dangxian'||state?.play_phase_context?.source_skill==='sgs.dangxian');return html`<section className="player-card-status sgs-yijiang-next-status" data-yijiang-next-status=${player.seat}><div className="card-status-flags"><span className="chip">当前体力 ${Number.isSafeInteger(player.hp)?player.hp:'?'} / 实际上限 ${n(player.max_hp)}</span>${inserted?html`<span className="chip" data-dangxian-phase="true">当先 · 额外出牌（准备前，同一回合）</span>`:null}${skills.includes('sgs.anxu')||guides?.some(g=>g.source_skill_id==='sgs.anxu')?html`<span className="chip" data-anxu-used=${String(!!used)}>安恤 · ${used?'本出牌阶段已用':'本出牌阶段未用'}</span>`:null}</div>${l.owned||l.used?html`<p key="fuli-marker" data-fuli-used=${String(!!l.used)}>伏枥 · ${l.used?'本局限定已用':'本局限定未用，仅濒死可选'}${!l.owned?' · 当前已失去技能，标记保留':''}</p><${SgsFuliProjection} key="fuli-projection" projection=${l.projection} recoveryTarget=${l.recovery_target} flipTo=${l.flip_to} />`:null}${b.zhuiyi_events?.some(e=>e.committed)?html`<p data-zhuiyi-resolved="true">追忆 · 本次死亡效果已提交；死者保持阵亡</p>`:null}</section>`;}
const cancelID=id=>['cancel','pass','decline','0','n'].includes(id);
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)Promise.resolve(result).catch(()=>{if(ref.current===key)ref.current=null;});}catch(error){ref.current=null;throw error;}}
export function SgsYijiangNextChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){const sent=useRef(null);if(!isSgsYijiangNextPromptOwner(prompt,state))return null;const stage=prompt.meta.stage,showOwn=['anxu_give','gongqi_cost','jiefan_choice'].includes(stage),options=(prompt.options||[]).filter(o=>typeof o.id==='string'&&(!isSgsYijiangNextMandatory(prompt)||!cancelID(o.id))&&(stage!=='anxu_give'||/^hand:[1-9]\d*$/.test(o.id))&&(stage!=='jiefan_choice'||o.id==='draw'||(/^hand:[1-9]\d*$/.test(o.id)?state.players.self.hand?.[Number(o.id.slice(5))-1]?.type==='武器':o.id==='eq:weapon'&&state.players.self.equipment?.weapon)));return html`<div className="dialog-actions wrap sgs-yijiang-next-options">${options.map(opt=>{const hand=/^hand:[1-9]\d*$/.test(opt.id),card=showOwn?(hand?state.players.self.hand?.[Number(opt.id.slice(5))-1]:opt.id.startsWith('eq:')?state.players.self.equipment?.[opt.id.slice(3)]:null):null;return html`<section key=${opt.id}>${card&&!card.hidden&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${opt.id} disabled=${busy||!!opt.disabled} title=${opt.disabled?(opt.reason||'当前条件不满足'):undefined} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,opt.id)}>${hand&&!showOwn?`手牌 ${opt.id.slice(5)}（暗选）`:opt.label}${opt.disabled&&opt.reason?html`<small>${opt.reason}</small>`:null}</button></section>`;})}</div>`;}
export const isSgsFuliRescuePrompt=p=>p?.kind==='rescue'&&p.options?.some(o=>o.source_skill_id==='sgs.fuli');
export const isSgsFuliRescueOwner=(p,state)=>isSgsFuliRescuePrompt(p)&&privateOwner(p,state);
export function SgsFuliRescueContext({state,prompt}){if(!isSgsFuliRescueOwner(prompt,state))return null;const o=prompt.options.find(o=>o.source_skill_id==='sgs.fuli'),m=o.skill_details??o.meta??prompt.meta??{},l=state.players.self.sgs_yijiang_next?.liaohua??{};return html`<section className="response-context sgs-fuli-rescue-context" data-fuli-rescue="true"><strong>伏枥 · 本人濒死救援</strong><p>未消耗限定时可在此发动。此前不发动没有花掉标记；选择后回复至当前X并翻面。也可选择合法普通救援。</p><${SgsFuliProjection} projection=${m.projection??m.faction_projection??l.projection} recoveryTarget=${m.recovery_target??l.recovery_target} flipTo=${m.flip_to??l.flip_to} /></section>`;}

export function SgsHandangStatus({player}){const hero=player?.effective_hero||player?.hero,h=player?.sgs_yijiang_next?.handang;if(!h)return null;const owns=hero?.skill_ids?.some(id=>['sgs.gongqi','sgs.jiefan'].includes(id))||hero?.id==='sgs.adapted.base.hero.han-dang';if(!owns&&!h.jiefan_used&&!h.gongqi_range_effect)return null;const used=h.gongqi_used_phases?.includes(player.play_phase_id),active=h.gongqi_range_effect;return html`<section className="player-card-status sgs-handang-status" data-handang-status=${player.seat}><span className="chip" data-gongqi-used=${String(!!used)}>弓骑 · ${used?'本出牌阶段已用':'本出牌阶段未用'}</span><p data-gongqi-infinite=${String(!!active)}>${active?'弓骑生效：本实际回合真实攻击范围无限；无杀次数、伤害或目标加成。':'弓骑范围未生效。'} 官网整回合版，不是社区本阶段版。</p><p data-jiefan-used=${String(!!h.jiefan_used)}>解烦 · ${h.jiefan_used?'本局限定已用':'本局限定未用'}</p>${(h.jiefan_events||[]).filter(e=>e.committed&&e.status!=='done').map(e=>html`<p key=${e.event_id} data-jiefan-progress=${e.cursor}>解烦逐项结算 ${n(e.cursor)} / ${n(e.participant_ids?.length)} · 目标 ${e.target_id}</p>`)}</section>`;}
