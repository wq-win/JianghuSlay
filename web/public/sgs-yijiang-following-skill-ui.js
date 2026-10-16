/** V27 original source-keyed art guides and private prompt controls.
 * Only explicit public DTOs and the viewer's own hand are read. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：大陆三国杀移动版基础身份目录，2026-10-15资料快照。官网确认完整五技能；同产品经典社区补足数字体力和性别，历史官方FAQ仅佐证匹配程序。未核验2026当前移动客户端；不混入界、谋、国战、OL异版或旧版技能。';
const input='触屏点选，或键盘Tab定位、Enter确认；仅有放弃选项的未承诺步骤可Esc取消。已提交代价不退款，重复或过期输入不会重复结算。';
const record=(id,name,type,body)=>({id:`sgs-yijiang-following-${id}`,source_skill_id:`sgs.${id}`,name,type,icon:`sgs-yijiang-following-${id}`,activeId:null,...body,notes:[source,...body.notes,input]});
export const SGS_YIJIANG_FOLLOWING_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.ma-su':{name:'马谡',hp:3,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.cao-zhang':{name:'曹彰',hp:4,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.yu-jin':{name:'于禁',hp:4,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.hua-xiong':{name:'华雄',hp:6,faction:'群',gender:'男'}
});
export const SGS_YIJIANG_FOLLOWING_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.ma-su':[
 record('sanyao','散谣','active',{
 summary:'每出牌阶段1次，弃1张手牌／装备，对当前体力最高的一名角色造成1伤害',
 condition:'自己的真实空闲出牌阶段，尚未使用散谣，有1张可弃的手牌或已装备牌；选择时目标当前体力为所有存活角色中最高，允许并列。',
 timing:'先选素材与目标；提交真实弃置并记录阶段次数，完整结算失牌后，对仍存活目标造成普通技能伤害',
 cost:'弃置恰好1张自己的手牌或装备区牌；不可用判定区、节钺等特殊牌堆支付',
 limit:'每个真实出牌阶段限一次；提交前取消不花牌或次数，弃置已提交不退款',
 effect:'对选中的当前体力最高角色造成1点普通伤害。不是使用杀，不消耗出杀额度，不需攻击范围，也不按手牌数或最大体力选人。可选择并列最高的一人，也可选自己。对其他角色的伤害可由自己的制蛮防止；对自己不能发动制蛮。',
 targets:'一名存活角色，包括自己、队友和敌人，不限距离；比较全部存活角色的当前体力',
 phase_use:'点击散谣或Q，先选自己1张H/E，再选最高体力目标；目标不是默认敌人，两步提交前均可取消。',
 response:'无杀／闪响应；属于技能伤害，仍进入合法的伤害防止与受伤流程。',
 disabled_reason:'非自己的出牌阶段、本真实阶段已用、没有可弃H/E、已失去散谣或没有合法目标。',
 notes:['F2：代价失牌后的死亡与重新验证顺序为江湖政策；不导入旧心战／挥泪、界多目标或OL手牌数分支。'],hooks:['own_play','ordinary_source_damage'],callbacks:['sgs_player_sanyao','sgs_sanyao_execute'],activeId:'sgs.sanyao'}),
 record('zhiman','制蛮','optional',{
 summary:'对其他角色造成伤害前，可防止整次伤害，再获得其1张装备／判定牌',
 condition:'自己是即将造成伤害的来源，受伤者是另一名角色；任意牌或技能伤害、回合外伤害均可。',
 timing:'来源造成伤害窗口，早于受伤者防具／转移等接受伤害窗口、扣体力与濒死',
 cost:'无牌或体力代价；发动后放弃本次整件伤害',
 limit:'每个真实伤害事件询问一次，不按伤害点重复；无每回合次数上限',
 effect:'选择发动即防止整个待结算伤害事件，再取得该角色装备区或判定区中的恰好1张牌到自己手中。目标没有装备／判定牌时仍可防止，此时不获得牌。不能拿手牌。被防止事件不记录实际伤害，不触发受伤、濒死或新的连环传导。',
 targets:'本次伤害的另一名接收者；不能对自己发动，不能改换目标',
 phase_use:'没有独立主动按钮；对其他人造成伤害时弹出选择，散谣造成的伤害也可进入。',
 response:'可选择正常结算伤害；确认防止后必须从现存公开E/J获得1张，无牌则自动结束，不可退款。',
 disabled_reason:'自伤、纯体力流失、无有效来源、同伤害已处理、已移除制蛮或事件在更早步骤失效。',
 notes:['F3：来源伤害取消先于受伤者窗口；与其他包技能的优先次序是宿主调度政策，非当前客户端认证。'],hooks:['source_causing_damage'],callbacks:['sgs_before_source_damage_resolution_zhiman']})
 ],
 'sgs.adapted.base.hero.cao-zhang':[
 record('jiangchi','将驰','optional',{
 summary:'正常摸牌前选：多摸1且本回合禁用／打出杀，或少摸1且杀无距离并多用1次',
 condition:'自己未被跳过或替代的正常摸牌阶段，确定摸牌数量时；须在看到所摸牌前选择。',
 timing:'真实正常摸牌数量结算前，所选限制或奖励持续到当前实际回合结束',
 cost:'摸牌数量的取舍，无额外弃牌或体力支付',
 limit:'每个真实正常摸牌操作一次选择；多段真实摸牌的叠加按F5，不是出牌阶段主动按钮',
 effect:'可不发动照常摸牌。备守：额外摸1张，然后本回合不能使用也不能打出任何杀，包含虚拟／转化杀、借刀强制出杀和决斗／南蛮响应。进击：少摸1张，本回合杀无距离限制且普通出杀额度额外增加1。无伤害加成、无额外目标、不生成免费杀。',
 targets:'只改变自己正常摸牌及本回合杀规则；距离豁免不越过空城等硬性禁止',
 phase_use:'没有主动按钮；显示本回合备守禁杀或进击剩余规则，需用自己的合法杀素材。',
 response:'备守禁止“使用”和“打出”，普通杀牌、武圣等转化与连弩都不能绕过；进击只影响主动杀距离及额度。',
 disabled_reason:'正常摸牌被跳过／替代、仅技能额外摸牌、本摸牌事件已选、已失去技能或当前不是有效摸牌数量窗口。',
 notes:['F4/F5：已提交标记即使失去将驰仍至真回合结束；多真实摸牌的额度可累加，任何禁杀标记优先，距离豁免不修改武器本身范围。','不导入界曹彰摸牌后弃置／重铸或出杀次数减一版本。'],hooks:['normal_draw_quantity','slash_use_and_play','turn_finally'],callbacks:['sgs_before_normal_draw_jiangchi','sgs_commit_normal_draw_jiangchi']})
 ],
 'sgs.adapted.base.hero.yu-jin':[
 record('jieyue','节钺','optional',{
 summary:'结束时弃1手牌索取其他人1H/E，否则由你弃其1H/E；有钺则红手牌闪／黑手牌无懈，准备时全取回',
 condition:'结束阶段有可弃手牌且有其他角色；转化须自己节钺堆至少1张且当前允许闪／无懈；准备阶段有钺牌自动回手。',
 timing:'真实结束阶段在常规弃牌之后；合法使用／打出闪或无懈窗口；自己的真实准备阶段',
 cost:'结束分支先弃1张手牌，装备不能支付；转化消耗1张对应颜色手牌，绝不消耗节钺堆的启用牌',
 limit:'每个真实结束阶段可选一次；转化无技能本身次数上限，仍受合法牌窗口限制；准备阶段一次收回所有现存钺',
 effect:'①结束：弃1手牌，选另一角色。②其可自己选择1张H/E放在你的武将牌上；若不放，由你选择弃其1张H/E，无牌则无后续。③有至少1张钺时，自己的红色手牌可当闪、黑色手牌可当无懈可击使用或打出，实际消耗的是手牌，钺保持。④准备阶段锁定取得全部钺到手牌，原装备也回手而非装备。',
 targets:'结束时任选一名其他存活角色，可为友方或无牌角色，不限距离；贡献由目标自己决定，拒绝后弃哪张由节钺拥有者决定',
 phase_use:'没有自由主动按钮；不能在出牌阶段任意打出闪／无懈。公开节钺区独立于手牌／装备，不能顺拆、救援或作为响应素材。',
 response:'红手牌闪与黑手牌无懈由正常合法响应弹窗提供，选择时标明转化；不增加牌数、不消耗钺，取消保留手牌。目标拒绝贡献后，拥有者只能暗选其手牌、明选其装备。',
 disabled_reason:'结束时无手牌、阶段已处理或已失技；转化时钺为空、素材是装备／钺／颜色不符或响应不合法；准备已清空则不取回。',
 notes:['F6/F7：本作节钺牌堆公开朝上；失技／死亡丢弃一次，复制以空堆开始。设备离区会真实触发失装，异常销毁牌不重造。','H/E范围由同文本历史官方案例与所有权术语佐证；牌堆公开、复制、失技与中断为明示江湖政策。旧毅重与界于禁完全排除。'],hooks:['end_phase','shan_wuxie_response','preparation','skill_loss_death'],callbacks:['sgs_jieyue_end_phase','sgs_jieyue_response_options','sgs_jieyue_prepare']})
 ],
 'sgs.adapted.base.hero.hua-xiong':[
 record('yaowu','耀武','locked',{
 summary:'红色杀将对自己造成伤害时，锁定令伤害来源选回复1或摸1；满体力只能摸1',
 condition:'自己进入红色有效杀的接收伤害窗口，实际伤害来源仍存活；不是闪避后的空事件，也不是来源已经防止的伤害。',
 timing:'每次红杀伤害事件扣体力前，先给来源奖励，再继续伤害与濒死；致命伤害仍触发',
 cost:'无额外牌或体力支付；锁定触发，奖励由伤害来源而非华雄选择',
 limit:'每次伤害事件一次，不按2点、3点伤害重复；没有每回合上限',
 effect:'实际伤害来源选择回复1点体力或摸1张牌；满体力只能摸牌。华雄本人不因黑色／无色杀摸牌，非杀伤害或直接失血不触发。红色虚拟／转化杀适用，有效颜色按真实素材规则冻结；混色双素材不是红色。按所选移动版示例携带红杀通道的连环伤害也适用。',
 targets:'奖励只给仍有效的实际伤害来源；不是华雄选择，也不要求华雄扣血后存活',
 phase_use:'锁定技没有主动按钮；来源是玩家时由玩家选择回复／摸牌。',
 response:'无取消分支；受伤来源满体力自动摸1，有伤则由来源必选。来源更早用制蛮防止伤害时，不进入耀武。',
 disabled_reason:'黑色或无色杀、非杀／体力流失、闪避或来源预防已取消、无有效伤害来源、已失去耀武或本事件已处理。',
 notes:['此为当前基础身份目录的经典6体力耀武全版本，明确不选旧一将2012恃勇、界／谋非红杀自摸或PVE魔躯。','F8/F9：受伤者多个跨包技能顺序是宿主政策；已给出的来源奖励不因后续取消倒退，转移后按真正受伤者重验。'],hooks:['receiver_pending_damage'],callbacks:['sgs_before_receiving_damage_yaowu']})
 ]
});
export const SGS_YIJIANG_FOLLOWING_SKILL_ICONS=freeze({
 'sgs-yijiang-following-sanyao':'<path d="M5 8h16v18H5Zm4 4h8m-8 5h6M24 4l5 5-5 5M23 19l6-2m-4 8 4 3M2 3l4 2M9 28l-2 3"/>',
 'sgs-yijiang-following-zhiman':'<path d="M16 3 28 8v10q-3 7-12 12Q7 25 4 18V8ZM8 15h16M11 11l-3 4 3 4M22 24l-4-4 4-4M18 20h11"/>',
 'sgs-yijiang-following-jiangchi':'<path d="m4 25 3-9 6-4 3-8 8 1 3 6-5 6-1 11M16 7l5 3-4 7-8 2-1 9M3 7h8M1 11h7M13 22l6 4M24 3l-2 5"/>',
 'sgs-yijiang-following-jieyue':'<path d="M12 29V3m1 2 13 4-2 12-11-3M11 7 4 10l1 9 7-2M9 23h7m-6 3 4 3 4-3"/><circle cx="19" cy="12" r="3"/>',
 'sgs-yijiang-following-yaowu':'<path d="m4 26 19-20M20 4q7 2 9-2 1 10-6 15l-7-5M9 19l6 6M4 9l4-3 4 3-4 4ZM20 24h9m-5-4v9"/>'
});
export const SGS_YIJIANG_FOLLOWING_HOST_POLICIES=freeze([
 ['F0','3／4／4／6为选定经典最大体力；独立初始体力未知，正常满体力开局为宿主政策；无固有主公技／授予技，身份模式仍未完成。'],
 ['F1','稳定实体、阶段、回合、伤害与牌事件回执；有效技能归当前拥有者，暗牌盲选，完整复制不带他人次数／牌堆。'],
 ['F2','散谣每真实出牌阶段一次，提交前按所有存活者当前体力最高选一人，自己／并列可选；先实际弃置，代价提交后不退款。'],
 ['F3','制蛮在来源伤害窗口防止整次对其他人的伤害；取得1E/J，无E/J仍可防止；不产生实际伤害与新传导。'],
 ['F4','将驰在未跳过／替代的正常摸牌量确定前选择；+1牌绝对禁用／打出杀，−1牌给距离豁免和+1普通杀额度。'],
 ['F5','将驰标记绑定当前真实回合，失技后已生效标记仍持续；多个真实摸牌可叠加正额度，禁杀优先，真回合末／死亡清除。'],
 ['F6','节钺四分支完整：结束弃1H索取H/E，拒绝由持技者弃H/E；有钺红H闪／黑H无懈；准备全钺回手。'],
 ['F7','节钺为独立公开朝上实体区，不能作手牌救援／响应或普通顺拆；转化不消耗钺；失技／死亡清理，复制空堆。'],
 ['F8','耀武在红色有效杀伤害扣血之前一次触发，实际来源选回复1／摸1，满体力摸1；致命伤害也触发，非红杀不给华雄摸牌。'],
 ['F9','有效杀身份／颜色随真实牌事件冻结；来源制蛮先防止则无耀武，受伤者跨包优先次序为宿主政策，已发奖励不回滚。']
]);
const closeOnEscape=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsYijiangFollowingPolicyGuide(){return html`<details className="hero-provenance sgs-yijiang-following-policy-guide" onKeyDown=${closeOnEscape}><summary>F0–F9 · 江湖兼容边界</summary><p>完整五技能来源与所选版本已整理；以下细时序、公开牌堆与跨包组合为明示宿主政策，未实测2026当前移动客户端，亦不代表完整身份模式。</p><ol>${SGS_YIJIANG_FOLLOWING_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsYijiangFollowingHpEvidence({hero}){const h=SGS_YIJIANG_FOLLOWING_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-yijiang-following-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。通常满体力${h.hp}/${h.hp}开局为F0宿主初始化，来源独立初始体力字段未知；不含身份主公加成。官网确认完整技能，同产品经典社区补足体力和性别。未实测2026当前移动客户端，实际体力上限以对局状态为准。</p>`:null;}
export const SGS_YIJIANG_FOLLOWING_PROMPT_CONTEXTS=freeze({
 sanyao_cost:['sgs.sanyao','散谣','select_hand','选择恰好1张自己的手牌或装备','随后选择全部存活者中当前体力最高的一人，包括自己或并列最高。此步取消不付费；不是按手牌数。'],
 sanyao_target:['sgs.sanyao','散谣','choice','选择当前体力最高的一名角色','可选自己、队友或敌人，不限距离，允许并列。目标确认后才真实弃牌并占用本阶段次数，然后造成1点普通技能伤害。'],
 zhiman_prevent:['sgs.zhiman','制蛮','choice','是否防止对其他角色的整次伤害？','防止后取得其1张装备或判定牌，不能拿手牌；没有E/J也可以防止。不是每点伤害各一次，不触发此次受伤或濒死。'],
 zhiman_obtain:['sgs.zhiman','制蛮','select_target_card','伤害已防止：获得目标1张装备或判定牌','仅公开E/J可选，取得到自己的手牌。此步必须完成，不可恢复已经防止的伤害。'],
 jiangchi_choice:['sgs.jiangchi','将驰','choice','在摸牌前选择本回合将驰路线','备守：多摸1，本回合禁用及打出任何杀。进击：少摸1，杀无距离且普通额度+1。也可不发动；无额外目标或伤害。'],
 jieyue_cost:['sgs.jieyue','节钺','select_hand','结束阶段：选择1张自己的手牌弃置','只能用手牌，不能用装备或节钺堆。随后选择其他角色；确认目标前可取消，本阶段不再重开已放弃的机会。'],
 jieyue_target:['sgs.jieyue','节钺','choice','选择一名其他角色索取节钺','可选盟友和无牌角色，不限距离。目标确认后弃牌提交；由目标自己选择是否放1H/E，若拒绝则由你弃其1H/E。'],
 jieyue_contribute:['sgs.jieyue','节钺','choice','你是被指定者：选择放置一张自己的H/E，或拒绝','所选牌放入对方公开朝上的节钺堆，暂非手牌／装备；其准备阶段全部回其手牌。拒绝后由对方选择弃你的一张H/E，不能自己决定弃哪张。'],
 jieyue_discard:['sgs.jieyue','节钺','select_target_card','对方未放置：由你弃其一张H/E','手牌暗选、装备明选，不含判定区。结束阶段代价已经支付；此步须完成，不可取消退款。'],
 yaowu_choice:['sgs.yaowu','耀武','choice','你是伤害来源：回复1点体力或摸1张牌','红色杀即将造成伤害，先给实际来源奖励，再继续扣体力／濒死。锁定必须选择，不由华雄代选；每事件一次。']
});
const STAGES=SGS_YIJIANG_FOLLOWING_PROMPT_CONTEXTS,skillIDs=new Set(Object.values(STAGES).map(r=>r[0]));
const canonicalSeat=s=>s==='player'?'p1':s;
const n=v=>Number.isSafeInteger(v)&&v>=0?v:'?';
const promptSkill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const mandatory=p=>['zhiman_obtain','jieyue_discard','yaowu_choice'].includes(p?.meta?.stage)||p?.meta?.mandatory===true;
export function isSgsYijiangFollowingPromptStage(p){return Object.hasOwn(STAGES,p?.meta?.stage)||skillIDs.has(promptSkill(p));}
export function isSgsYijiangFollowingPrompt(p){const m=p?.meta||{},row=STAGES[m.stage];return Boolean(row&&row[0]===promptSkill(p)&&row[2]===p.kind&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsYijiangFollowingPromptOwner(p,state){const self=canonicalSeat(state?.players?.self?.seat);return Boolean(isSgsYijiangFollowingPrompt(p)&&self&&p.player_id&&canonicalSeat(p.player_id)===self&&p.meta.private_to&&canonicalSeat(p.meta.private_to)===self);}
export function SgsYijiangFollowingResponseContext({state,prompt}){if(!isSgsYijiangFollowingPromptOwner(prompt,state))return null;const m=prompt.meta,row=STAGES[m.stage];return html`<section className="response-context sgs-yijiang-following-context" data-source-skill-id=${row[0]} data-response-stage=${m.stage}><div className="response-kicker">${row[1]} · ${mandatory(prompt)?'必须完成':'当前拥有者决定'}</div><strong>${row[3]}</strong><p>${row[4]}</p>${m.stage==='jieyue_contribute'?html`<p data-jieyue-pile-owner=${m.pile_owner}>当前被指定者决定贡献 · 公开牌堆归属 ${m.pile_owner}</p>`:null}${m.stage==='yaowu_choice'?html`<p data-yaowu-beneficiary=${canonicalSeat(prompt.player_id)}>当前实际来源 ${canonicalSeat(prompt.player_id)} 决定奖励 · 待受伤者 ${m.receiver_seat} · 扣体力前结算</p>`:null}${m.stage==='jiangchi_choice'?html`<p data-jiangchi-normal-draw=${n(m.ordinary_draw_count)}>普通摸牌数 ${n(m.ordinary_draw_count)} · 选择前不展示新摸牌 · 状态至本回合结束</p>`:null}<small>${input}</small></section>`;}
/** Public state supplied by serializer; never infer from raw physical pile/private receipts. */
export function SgsYijiangFollowingStatus({player,CardView=null}){if(!player)return null;const hero=player.effective_hero||player.hero,s=player.sgs_yijiang_following||{},j=s.jiangchi||{},guides=SGS_YIJIANG_FOLLOWING_HERO_SKILLS_BY_ID[hero?.id],cards=Array.isArray(s.jieyue_cards)?s.jieyue_cards:[],count=Number.isSafeInteger(s.jieyue_count)?s.jieyue_count:0;if(!guides&&!count&&!j.sha_use_prohibited&&!j.sha_infinite_range)return null;return html`<section className="player-card-status sgs-yijiang-following-status" data-yijiang-following-status=${player.seat} aria-label="一将续篇技能与公开节钺状态"><div className="card-status-flags"><span className="chip">当前体力 ${Number.isSafeInteger(player.hp)?player.hp:'?'} / 实际上限 ${n(player.max_hp)}</span>${s.sanyao_used?html`<span className="chip" data-sanyao-used="true">散谣 · 本出牌阶段已用</span>`:null}</div>${j.sha_use_prohibited||j.sha_play_prohibited?html`<p data-jiangchi-state="defend"><strong>将驰 · 备守禁杀</strong>：本回合不能使用或打出任何杀，含转化、虚拟、连弩、决斗／南蛮响应与借刀。禁令优先于额外额度，至本回合结束。</p>`:j.sha_infinite_range?html`<p data-jiangchi-state="attack"><strong>将驰 · 进击</strong>：本回合杀无距离限制，普通杀使用额度 +${n(j.sha_use_bonus)}；不额外加目标或伤害，不越过硬性禁止。至本回合结束。</p>`:guides?.some(g=>g.source_skill_id==='sgs.jiangchi')?html`<p data-jiangchi-state="none">将驰 · 本回合尚无备守／进击效果；只在正常摸牌前选择。</p>`:null}${count>0?html`<section data-jieyue-count=${count}><p><strong>公开节钺 ${count} 张</strong> · 这是独立牌堆，不能当手牌／装备、救援或顺拆。红手牌可闪、黑手牌可无懈，转化消耗手牌，钺不消耗。自己准备阶段全部回手，原装备也不自动装备。公开朝上为F7宿主政策。</p><div className="dialog-actions wrap">${cards.filter(c=>c&&!c.hidden&&typeof c.name==='string').map((card,i)=>CardView?html`<${CardView} key=${card.physical_id||i} card=${card} compact=${true} disabled=${true} />`:html`<span className="chip" key=${i} data-jieyue-public-card=${i}>${card.suit||''}${card.rank||''} ${card.name}</span>`)}</div></section>`:guides?.some(g=>g.source_skill_id==='sgs.jieyue')?html`<p data-jieyue-count="0">节钺堆为空 · 当前不能凭节钺转化闪／无懈。结束阶段可弃1手牌索取。</p>`:null}</section>`;}
const materialID=id=>/^hand:[1-9]\d*$|^eq:(weapon|armor|offensive_horse|defensive_horse)$/.test(id);
const cancelID=id=>['cancel','pass','decline','0'].includes(id);
const ownCard=(state,id)=>id.startsWith('hand:')?state.players.self.hand?.[Number(id.slice(5))-1]:state.players.self.equipment?.[id.slice(3)];
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const result=onRespond(value);if(result?.then)Promise.resolve(result).then(()=>{if(ref.current===key)ref.current=null;},()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
export function SgsYijiangFollowingChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){const sent=useRef(null);if(!isSgsYijiangFollowingPromptOwner(prompt,state))return null;const stage=prompt.meta.stage,showOwn=['sanyao_cost','jieyue_cost','jieyue_contribute'].includes(stage),options=(prompt.options||[]).filter(o=>typeof o.id==='string'&&(!mandatory(prompt)||!cancelID(o.id))&&!(stage==='zhiman_obtain'&&o.id.startsWith('hand:'))&&!(stage==='jieyue_cost'&&o.id.startsWith('eq:')));return html`<div className="dialog-actions wrap sgs-yijiang-following-options">${options.map(opt=>{const card=showOwn&&materialID(opt.id)?ownCard(state,opt.id):null,hidden=opt.id.startsWith('hand:')&&!showOwn;return html`<section key=${opt.id} className=${card&&!card.hidden&&CardView?'hero-skills':''}>${card&&!card.hidden&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${opt.id} disabled=${busy||!!opt.disabled} title=${opt.disabled?(opt.reason||'当前条件不满足'):undefined} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,opt.id)}>${hidden?`手牌 ${opt.id.slice(5)}（暗选）`:opt.label}${opt.disabled&&opt.reason?html`<small>${opt.reason}</small>`:null}</button></section>`;})}</div>`;}
/** Standard response windows retain their original stage and response pipeline.
 * Option-level source tags identify conversions without guessing from labels. */
export const isSgsJieyueConversionPrompt=p=>p?.kind==='choice'&&p.options?.some(o=>o.source_skill_id==='sgs.jieyue');
export function isSgsJieyueConversionOwner(p,state){const self=canonicalSeat(state?.players?.self?.seat);return Boolean(isSgsJieyueConversionPrompt(p)&&self&&canonicalSeat(p.player_id)===self&&p.meta?.private_to&&canonicalSeat(p.meta.private_to)===self);}
export function SgsJieyueConversionContext({prompt}){const types=[...new Set((prompt.options||[]).filter(o=>o.source_skill_id==='sgs.jieyue').map(o=>o.response_type))];return html`<section className="response-context sgs-jieyue-conversion-context" data-jieyue-conversion=${types.join('/')}><div className="response-kicker">节钺 · 合法响应转化</div><strong>${types.includes('无懈可击')?'黑色手牌 → 无懈可击':'红色手牌 → 闪'}</strong><p>选择并消耗自己的一张合法手牌，节钺堆只提供转化条件，不消耗钺、不额外生成牌。取消保留本次尚未支付的手牌。装备、判定牌与钺牌不能作材料。</p></section>`;}
export function SgsJieyueConversionChoices({state,prompt,onRespond,busy=false,CardView=null}){const sent=useRef(null);if(!isSgsJieyueConversionOwner(prompt,state))return null;return html`<div className="dialog-actions wrap sgs-jieyue-conversion-options">${(prompt.options||[]).map(opt=>{const card=materialID(opt.id)?ownCard(state,opt.id):null;return html`<section key=${opt.id}>${card&&!card.hidden&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${opt.id} data-source-skill-id=${opt.source_skill_id} disabled=${busy||!!opt.disabled} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,opt.id)}>${opt.label}</button></section>`;})}</div>`;}
