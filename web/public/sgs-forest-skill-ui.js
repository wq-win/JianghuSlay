/** Complete mobile base-identity Forest guides and source-ID-bound UI.
 * Original vector assets only. Snapshot 2026-10-15 is public-source evidence, not current-client certification. */
import {html} from 'htm/react';
import {useState} from 'react';
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const source='来源：大陆三国杀移动版基础身份／神话再临·林，资料快照2026-10-15。官方目录确认完整技能与势力；体力、性别由匹配经典身份的手游社区资料补足，官方OL名册仅作跨产品佐证。未核验2026当前移动客户端。';
const input='触屏点选，或键盘Tab定位、Enter确认；只有明确提供取消的未提交步骤可Esc取消。已承诺的必须选牌不可跳过；重复点击与过期提示不得重复结算。';
const aoe='本作把来源【南蛮入侵】映射为【烽火狼烟】：所有其他存活角色（包括队友）逐一响应杀或受1点普通伤害，各目标保留正常无懈。不是火焰伤害，也不是仅敌方目标。';
export const SGS_FOREST_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.lu-su':{name:'鲁肃',hp:3,faction:'吴',gender:'男'},
 'sgs.adapted.base.hero.meng-huo':{name:'孟获',hp:4,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.zhu-rong':{name:'祝融',hp:4,faction:'蜀',gender:'女'},
 'sgs.adapted.base.hero.sun-jian':{name:'孙坚',hp:4,faction:'吴',gender:'男'}
});
export const SGS_FOREST_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.lu-su':[
  {id:'sgs-forest-haoshi',source_skill_id:'sgs.haoshi',name:'好施',type:'optional',icon:'sgs-forest-haoshi',summary:'正常摸牌可多摸2；摸后手牌超过5，须将一半给其他手牌最少者',condition:'自己的正常摸牌阶段确有正常摸牌操作；在摸牌前选择。若整个摸牌阶段被跳过，或正常摸牌被再起、双雄等替代，则没有此机会。',timing:'正常摸牌前决定是否多摸2；完成该次摸牌及即时嵌套获牌后，再检查手牌数并交牌',cost:'发动没有弃牌代价；发动后若手牌数大于5，必须交出当前手牌数的一半（向下取整）',limit:'每次真实正常阶段摸牌操作1次机会；不是出牌阶段随时可用的摸牌按钮',effect:'接受则在本次正常摸牌数量上加2，并非强制总共摸4。摸后若手牌H≤5，无后续交牌；H>5时，自己选择恰好floor(H/2)张手牌，交给一名其他存活角色中手牌最少者。装备与判定区不计入H，也不能交出。',targets:'交牌对象为其他存活角色中当前手牌最少者，可为队友或敌人；最少者并列时自由选一名，不可选自己',phase_use:'无出牌阶段发动按钮；正常摸牌前出现接受／放弃。',response:'接受前可放弃；符合H>5后选对象与精确数量手牌是必须完成的交牌，不能再取消好施。',disabled_reason:'正常摸牌被跳过或替代时不出现；未发动或摸后H≤5时不交牌。不是所有独立摸牌都触发好施。',notes:[source,'F1/F4：检查当前手牌和最少者，按真实实体移牌与获得事件结算；不限制阵营。',input],hooks:['before_normal_draw','after_normal_draw'],callbacks:['sgs_before_normal_draw_haoshi','sgs_after_normal_draw_haoshi'],activeId:null},
  {id:'sgs-forest-dimeng',source_skill_id:'sgs.dimeng',name:'缔盟',type:'active',icon:'sgs-forest-dimeng',summary:'每出牌阶段1次，弃两名其他角色手牌数之差，令其交换全部手牌',condition:'自己的空闲出牌阶段，本阶段未用；至少有两名不同的其他存活角色，且能弃置恰好等于其手牌数绝对差的合法牌。',timing:'选择两名其他角色，锁定手牌数绝对差X，再精确支付代价；代价与嵌套事件结束后交换其当前全部手牌',cost:'弃置自己恰好X张合法手牌或装备，X=两目标声明时手牌数绝对差；不得用判定区。X=0可确认零代价发动',limit:'每个真实出牌阶段限1次；同阶段失去再获得技能不刷新；无效或过期的提交不计次',effect:'成功支付后，两名目标同时失去各自当时全部手牌，再分别获得对方整包手牌，不能拒绝；手牌保持私密，装备与判定区不交换。目标手牌相等、其中一人零手牌均合法。交换后的失牌触发另行排队，连营新摸的牌不会误换走。',targets:'恰好两名不同的其他存活角色，都不能是发动者；不限距离、势力、性别或队伍。1v1只有一名其他角色，因此没有合法目标组合',phase_use:'点击缔盟或Q，选择两名目标后支付精确张数；提交前可取消。1v1显示无合法两人组合，不伪造与自己换手牌的按钮。',response:'代价承诺后不得取消或退款。交换双方不展示暗牌给发动者、对方以外的角色或旁观者；只公开牌数。',disabled_reason:'非自己的空闲出牌阶段、阶段次数已用、其他存活角色不足2名，或合法弃牌数不足所选目标的差值。',notes:[source,'F2/F3：代价锁定后不因嵌套摸牌改价。交换前目标退场则取消交换，已付代价与次数保留；发动者付费后退场但双方仍存活且对局继续，完成已承诺交换。此中断与原子交换时序为江湖政策。',input],hooks:['own_play'],callbacks:['sgs_player_dimeng','sgs_resolve_dimeng'],activeId:'sgs.dimeng'}
 ],
 'sgs.adapted.base.hero.meng-huo':[
  {id:'sgs-forest-huoshou',source_skill_id:'sgs.huoshou',name:'祸首',type:'locked',icon:'sgs-forest-huoshou',summary:'南蛮对自己无效；其他人用南蛮时由自己成为伤害来源',condition:'自己当前拥有祸首；南蛮效果对自己无效，另一名角色使用南蛮指定目标后设置该次用牌的伤害来源。',timing:'免疫持续有效；其他人用南蛮指定目标时记录来源，后续该次牌的伤害沿用该来源',cost:'无，锁定生效',limit:'无每回合或每阶段次数限制；每次符合条件的南蛮分别处理',effect:'南蛮对自己不生效。其他角色使用南蛮时，自己替代其成为此牌造成伤害的来源；原使用者仍是用牌者，不改目标或队伍。伤后反馈、转移伤害和击杀归属按真实伤害来源处理。自己用南蛮本就以自己为来源。',targets:'免疫只保护技能拥有者；伤害来源修改涵盖该次牌后续实际伤害，不能把队友从南蛮目标中删除',phase_use:'没有主动按钮；用牌与受效窗口自动处理。',response:'自己免疫此牌效果，不需为此效果打出杀；不是对所有伤害免疫，也不是防具或无懈抵消。其他目标仍正常响应。',disabled_reason:'不适用于万箭齐发、火攻或其他伤害。中途新获得祸首不追溯认领已指定目标的南蛮。',notes:[source,aoe,'F7/F10：记录的伤害来源最终死亡后，该次牌后续伤害无来源，不回退原用牌者；多个复制持有者按稳定行动顺序最后覆盖。身份奖励／惩罚模式未完成时不宣称完整身份模式。以上边界为江湖兼容政策。',input],hooks:['aoe_effect_immunity','aoe_damage_source'],callbacks:['sgs_forest_nanman_immunity','sgs_forest_begin_aoe','sgs_forest_aoe_damage_source'],activeId:null},
  {id:'sgs-forest-zaiqi',source_skill_id:'sgs.zaiqi',name:'再起',type:'optional',icon:'sgs-forest-zaiqi',summary:'受伤时可替代正常摸牌：亮X张，红桃回血，其余获得',condition:'自己的摸牌阶段确实进入且自己已受伤；整个阶段被跳过或当前满体力时不能发动。',timing:'正常阶段摸牌前选择替代；发动时锁定已损失体力X，亮出牌堆顶实际可用的X张牌',cost:'放弃本阶段整次正常摸牌；不先摸2，也不额外加1张',limit:'每次真实摸牌阶段对正常摸牌提供1次替代机会；没有出牌阶段反复发动',effect:'亮出X张牌，按其中红桃牌的张数回复体力（不超过上限），把这些红桃置入弃牌堆，再获得其余亮出的牌。亮牌不是判定，不接受改判；不可把红桃留作手牌而放弃回血。牌堆不足仅处理真实存在的牌。',targets:'自己；公开亮牌给所有角色，获得非红桃后正常成为自己的手牌',phase_use:'无出牌阶段主动按钮；摸牌前接受或放弃替代。',response:'接受前可取消并正常摸牌；接受后按亮牌自动完成回复、红桃弃置与其余获得。红桃按未持有的亮牌印刷花色计算。',disabled_reason:'满体力、整个摸牌阶段跳过、正常摸牌已处理或本次替代机会已使用。',notes:[source,'F5：一次合计回复，亮牌在处理区保护实体ID，全部结果完成前不混回洗牌。红桃弃置由同产品历史官方国战说明佐证，不把国战半体力或OL的X+1再起混入身份技能。','不是界孟获弃牌阶段再起、不是谋孟获蓄力，也不是先正常摸牌再亮牌。',input],hooks:['draw_phase_replacement'],callbacks:['sgs_replace_draw_zaiqi'],activeId:null}
 ],
 'sgs.adapted.base.hero.zhu-rong':[
  {id:'sgs-forest-juxiang',source_skill_id:'sgs.juxiang',name:'巨象',type:'locked',icon:'sgs-forest-juxiang',summary:'南蛮对自己无效；其他人南蛮全部结算后取得尚可获得的实体',condition:'自己当前拥有巨象；南蛮对自己无效。另一名角色使用的南蛮完成整次用牌后，仍有可获得的对应真实素材。',timing:'免疫持续有效；等该次南蛮所有目标、伤害及嵌套效果全部结束后，才取得剩余可获得素材',cost:'无，锁定生效',limit:'无每回合或每阶段次数限制；每次其他角色南蛮分别处理',effect:'南蛮对自己无效；其他角色使用的南蛮结算结束后，获得该次牌尚未被取得的真实素材。不能在自己免疫时提前收走。奸雄等已取得的牌不能从别人手中夺回，不能复制实体；自己使用的南蛮不回收。',targets:'免疫只保护自己；回收看原用牌者是否为其他角色，祸首改伤害来源不会改变这一判断',phase_use:'无主动按钮；自动免疫并在整次用牌结束后检查素材。',response:'零素材虚拟南蛮不获得牌；真实转化的南蛮回收所追踪的原始素材，不把虚拟牌壳放入手牌。',disabled_reason:'自己使用、没有实体素材、素材已被其他效果取得，或取得后另行弃置的同一牌，都不能再次认领。',notes:[source,aoe,'F8：英雄杀褒姒先弃1张本人装备区牌作代价，再生成无素材烽火；这张弃置代价不是南蛮素材。F10：多个复制持有者按稳定行动顺序结算，先实际取得者拥有素材，绝不重复。以上组合为江湖政策。',input],hooks:['aoe_effect_immunity','after_aoe_use_complete'],callbacks:['sgs_forest_nanman_immunity','sgs_forest_finish_aoe'],activeId:null},
  {id:'sgs-forest-lieren',source_skill_id:'sgs.lieren',name:'烈刃',type:'optional',icon:'sgs-forest-lieren',summary:'自己使用杀伤害直接目标后可拼点；严格赢则取得其1张牌',condition:'自己使用的杀对其直接目标造成正数实际伤害，完成濒死救援与伤后技能后双方仍存活，且双方各有合法手牌可拼点。',timing:'每个符合条件的直接伤害事件完成后询问；双方暗选手牌，锁定后同时公开，结果与嵌套获牌完成后清理拼点牌',cost:'双方各提交1张手牌拼点；不接受已装备或判定区牌；不消耗额外杀，不再造成一次杀伤害',limit:'没有印刷的每阶段或每回合上限；每个合格伤害事件1次机会，一次2点伤害也只有1次',effect:'可与受伤的直接目标拼点。自己的点数严格较大才赢，赢后获得目标1张合法手牌或装备：手牌盲选、装备可见。没赢（包括平点）不获得牌，也不交换双方拼点牌。拼点后目标没有合法H/E牌则没有奖励。',targets:'仅本次杀直接造成伤害的目标，不能另选其他角色；连环传导、反射或非杀伤害不提供烈刃机会',phase_use:'没有独立出牌阶段按钮；符合杀伤后条件才出现接受／放弃及私有选牌。',response:'接受前可放弃；已接受拼点后双方必须提交自己的手牌。获得阶段不能看到目标整手暗牌，判定区不可获得。',disabled_reason:'伤害被完全防止、仅失去体力、非直接目标、任一方最终死亡或无手牌不能拼点。',notes:[source,'F1/F9：比较用严格大于，拼点实体在处理区等结果结束再清理；手牌盲选与装备明选沿用真实区域事件。不是界祝融指定目标后拼点，也没有“没赢交换拼点牌”的改版效果。',input],hooks:['after_slash_damage_resolved'],callbacks:['sgs_after_sha_damage_lieren'],activeId:null}
 ],
 'sgs.adapted.base.hero.sun-jian':[
  {id:'sgs-forest-yinghun',source_skill_id:'sgs.yinghun',name:'英魂',type:'optional',icon:'sgs-forest-yinghun',summary:'受伤的准备阶段选其他1人：摸X弃1，或摸1弃X',condition:'自己的真实准备阶段进入且自己已受伤，并存在另一名存活角色；满体力时不出现发动机会。',timing:'准备阶段可发动，选择一名其他角色与分支，发动时锁定已损失体力X；目标先摸牌，再由目标自己选弃牌',cost:'发动者无弃牌或失血代价；目标按所选分支弃自己的合法手牌或装备，不得弃判定区',limit:'每次真实准备阶段1次可选机会；X=1时两分支数值相同但仍合法；不是出牌阶段主动技能',effect:'选择其一：令目标摸X张再弃1张；或令目标摸1张再弃X张。X在发动时锁定，不因后续体力变化改变。弃牌由目标控制，按摸牌后的当前H/E选；不足所需时弃光所有合法可弃牌。',targets:'恰好一名其他存活角色，可为队友或敌人，不限距离、势力、性别；不能选自己',phase_use:'无出牌阶段按钮；受伤准备阶段可选目标与明确分支，或放弃。',response:'目标摸牌后按当前必须张数私选自己的牌；发动者不能代替目标挑选，也不能看对方暗牌。',disabled_reason:'满体力、没有其他存活角色、没有真实准备阶段入口或本次机会已经处理。',notes:[source,'F1/F2/F4：X与分支在发动时固定，目标先摸后弃，真实阶段再进入才有新机会。保留完整基础身份英魂，不混入界孙坚破虏、国战半体力或专门1V1只写对手的版本。',input],hooks:['on_prepare'],callbacks:['sgs_on_prepare_yinghun'],activeId:null}
 ]
});
export const SGS_FOREST_SKILL_ICONS=freeze({
 'sgs-forest-haoshi':'<path d="M3 5h10v14H3ZM19 5h10v14H19ZM7 9h2m14 0h2M3 25h9l4 4 4-4h9M16 3v18m-4-4 4 4 4-4"/>',
 'sgs-forest-dimeng':'<path d="M3 10h21l-4-4m4 4-4 4M29 22H8l4-4m-4 4 4 4M3 15v12h4M29 17V5h-4M14 3h4v5h-4Zm0 21h4v5h-4Z"/>',
 'sgs-forest-huoshou':'<path d="M7 8 3 3l2 14 5 10 6 3 6-3 5-10 2-14-4 5M8 10l8-5 8 5-2 12-6 5-6-5ZM10 15l3 2m9-2-3 2M12 22h8M16 2v7"/>',
 'sgs-forest-zaiqi':'<path d="M5 14A11 11 0 0 1 25 8l3 5m-1-9 1 9h-9M27 21A11 11 0 0 1 7 27l-3-5m1 9-1-9h9M16 13c-5-7-12 3 0 10 12-7 5-17 0-10Z"/>',
 'sgs-forest-juxiang':'<path d="M3 13Q2 4 10 5l6-2 7 3q7 0 6 9l-2 9-5-2-1 7h-5V17h-4v12H7l-2-9ZM8 10l-3 5 5 6m13-11 3 5-5 6M17 11h1"/>',
 'sgs-forest-lieren':'<path d="m4 27 6-8 8-7L27 3l-3 12-10 8-8 6ZM8 18l10 10M3 7h8V3M5 5l5 5M22 25h7m-3-3v7M17 5l-3 3"/>',
 'sgs-forest-yinghun':'<path d="M8 29V3l7 3 12-1-4 7 4 8-12 1-7-3M4 29h10M15 10l4-2 3 2-1 6-3 2-3-3ZM11 25h14m-3-3 3 3-3 3"/>'
});
export const SGS_FOREST_HOST_POLICIES=freeze([
 ['F1','按当前存活角色检查目标，不限队伍。H为手牌、E为装备、J为判定区；未限定区域的弃牌／获得牌使用H/E，不含J。暗手牌盲选，实体离区、获得、毒与装备事件各执行一次。'],
 ['F2','英魂发动时锁定X和分支，目标摸后自选弃牌。缔盟声明时锁定差值，精确支付H/E代价（可为0），嵌套结算后交换当前手牌，不重定价；目标先死取消交换，代价与次数不退。发动者付费后先死但两目标仍存活且对局继续，则完成已承诺交换。'],
 ['F3','缔盟以原子事务同时交换两包完整当前手牌，先快照并互换，再排队处理失牌／获牌触发。连营新摸的牌留在本人手中；不把双方暗牌展示给发动者或旁观者。'],
 ['F4','好施在正常摸牌前选择，给该次正常摸牌数量+2；即时嵌套结束后检查H>5与当前最少者。再起／双雄替代或跳摸时不触发好施。英魂、缔盟按真实阶段入口／ID计机会，重复点击不创造新阶段。'],
 ['F5','再起锁定缺失体力X，亮出实际存在的X张顶牌，按亮牌印刷红桃合计回复一次，再弃红桃、得其余。不是判定或摸牌事件；处理区素材不参与洗牌，不凭空造牌。'],
 ['F6','南蛮入侵明确映射为烽火狼烟：所有其他存活角色（含队友）各响应杀或受1点普通伤害，保留逐目标无懈。用牌者、伤害来源、用牌事件ID与素材所有权分开。'],
 ['F7','祸首在指定目标时锁定该次南蛮的伤害来源，后续直接及转移伤害沿用；记录来源最终死亡则后续无来源，不恢复原用牌者。中途取得祸首不追溯认领已声明牌。'],
 ['F8','巨象只在整次其他人南蛮结束后认领该次尚未被取得的真实素材；不从手牌抢回、不复制、不追拿后来又弃置的牌。褒姒的弃装备代价不等于无素材虚拟烽火的素材。'],
 ['F9','烈刃在自己用杀的正数直接目标伤害及救援／伤后技能结束后询问；一次多点伤害只问一次。双方手牌锁定后同时公开，严格较大才赢，平点不赢；结果与嵌套获牌后清理拼点牌。传导／反射的非直接目标不触发。'],
 ['F10','复制技能导致多个祸首时，声明时按稳定行动顺序最后覆盖来源；多个巨象在完成时按稳定行动顺序，先实际取得者拥有素材，绝不复制实体。这是跨作品兼容政策，未有当前移动客户端实测裁定。']
]);
const closeOnEscape=event=>{if(event.key==='Escape'&&event.currentTarget.open){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();event.preventDefault();event.stopPropagation();}};
export function SgsForestPolicyGuide(){return html`<details className="hero-provenance sgs-forest-policy-guide" onKeyDown=${closeOnEscape}><summary>F1–F10 · 江湖兼容边界</summary><p>以下时序、跨作品与复制并存规则是本作明示的兼容政策，不是当前移动客户端已实测裁定。完整固有技能不代表身份奖励、惩罚与胜利模式全部完成。</p><ol>${SGS_FOREST_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsForestHpEvidence({hero}){const h=SGS_FOREST_HERO_IDENTITIES[hero?.id];if(!h)return null;return html`<p className="hero-hp-evidence" data-forest-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有体力${h.hp}，通常以满体力${h.hp}/${h.hp}开局。官方移动目录确认势力，匹配经典身份的手游社区补足体力／性别，官方OL名册仅作跨产品佐证；本次移动详情页未给出明确体力／性别字段。未实测2026当前移动客户端，体力不含身份模式加成。</p>`;}
const STAGES=freeze({
 haoshi_offer:['sgs.haoshi','好施','confirm','正常摸牌前：是否多摸2张？','接受后本次正常摸牌数量+2；随后手牌超过5，必须交出一半（向下取整）给其他手牌最少者。放弃则正常摸牌。'],
 haoshi_target:['sgs.haoshi','好施','choice','必须选择其他手牌最少者','这里只列当前其他存活角色中手牌最少的对象；并列最少者可任选，队友和敌人都算。已接受好施，此时不能取消交牌。'],
 haoshi_cards:['sgs.haoshi','好施','select_hand','仅你可见 · 必须交出精确数量手牌','选择恰好当前要求的手牌数量；不能交装备或判定区牌，已接受后的必须交牌不可跳过。'],
 dimeng_targets:['sgs.dimeng','缔盟','choice','选择两名其他角色的组合','选项同时列出两名不同目标及手牌数绝对差。两人都不能是自己，队友可选；零差值合法，暗牌牌面不公开。提交前可取消。'],
 dimeng_cost:['sgs.dimeng','缔盟','select_hand','仅你可见 · 支付锁定的手牌数差','精确选择X张自己的手牌或装备，不含判定区。提交前可取消；支付后先结算代价事件，再交换双方当前全部手牌，不因嵌套摸牌重新计价。'],
 dimeng_zero_confirm:['sgs.dimeng','缔盟','confirm','手牌数相等：确认零代价缔盟','X=0不需要弃牌，确认后仍消耗本出牌阶段的缔盟次数并交换两人的完整手牌。取消不计次。'],
 yinghun_target:['sgs.yinghun','英魂','choice','受伤准备阶段：选一名其他角色','可选任意其他存活角色，不限距离或队伍，不能选自己；也可放弃。接着由发动者选分支，目标摸牌后自己选弃牌。'],
 yinghun_branch:['sgs.yinghun','英魂','choice','选择摸X弃1，或摸1弃X','X为发动时已损失体力并锁定。目标先摸牌，再由目标自己弃合法手牌或装备；发动者不能挑选对方暗牌。X=1时两分支都合法。'],
 yinghun_discard:['sgs.yinghun','英魂','select_hand','仅你可见 · 摸牌后必须弃牌','你是英魂目标，自己选择应弃的手牌或装备，不含判定区。按发动时固定的X处理；可弃牌不足时弃光所有合法牌。不能取消已承诺效果。'],
 zaiqi_start:['sgs.zaiqi','再起','confirm','是否替代整个正常阶段摸牌？','确认后不先摸2：亮出已损失体力X张顶牌，红桃合计回复体力后弃置，非红桃获得。亮牌不是判定，不能改判；放弃则照常摸牌。'],
 lieren_start:['sgs.lieren','烈刃','confirm','本次杀伤害完成：是否与直接目标拼点？','双方须存活且有手牌；先完成救援和伤后技能。一次多点伤害只提供这一次机会；严格较大才赢，平点不赢。放弃不拼点。'],
 lieren_obtain:['sgs.lieren','烈刃','choice','拼点获胜：获得目标1张牌','只能从目标合法手牌或装备中选：手牌盲选，装备公开，判定区不可选。两张拼点牌仍在处理区，不属于可取得手牌；不能查看目标整手暗牌。']
});
export const SGS_FOREST_PROMPT_CONTEXTS=STAGES;
const promptID=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const privateStages=new Set(['haoshi_cards','dimeng_cost','yinghun_discard','pindian_private_card']);
export function isSgsForestPromptStage(prompt){return Object.hasOwn(STAGES,prompt?.meta?.stage)||(prompt?.meta?.stage==='pindian_private_card'&&(prompt?.meta?.skill_id==='sgs.lieren'||prompt?.meta?.source_skill_id==='sgs.lieren'));}
export function isSgsForestPrompt(prompt){
 const meta=prompt?.meta||{},id=promptID(prompt);if(meta.skill_id&&meta.source_skill_id&&meta.skill_id!==meta.source_skill_id)return false;
 if(meta.stage==='pindian_private_card')return prompt.kind==='choice'&&id==='sgs.lieren';
 const row=STAGES[meta.stage];return Boolean(row&&row[0]===id&&row[2]===prompt.kind);
}
const canonicalSeat=id=>['player','p1'].includes(id)?'p1':id;
export function isSgsForestPromptOwner(prompt,state){
 if(!isSgsForestPrompt(prompt))return false;
 const seat=canonicalSeat(state?.players?.self?.seat),meta=prompt.meta;
 if(!seat||!prompt.player_id||canonicalSeat(prompt.player_id)!==seat)return false;
 if(meta.private_to&&canonicalSeat(meta.private_to)!==seat)return false;
 if(privateStages.has(meta.stage)&&(!meta.private_to||canonicalSeat(meta.private_to)!==seat))return false;
 return true;
}
const numberOrUnknown=n=>Number.isSafeInteger(n)&&n>=0?n:'?';
export function SgsForestResponseContext({state,prompt}){
 if(!isSgsForestPromptOwner(prompt,state))return null;
 const meta=prompt.meta,stage=meta.stage,id=promptID(prompt),row=STAGES[stage]??[id,'烈刃','choice','仅你可见 · 必须提交1张拼点手牌','双方各自锁定一张手牌后才同时公开，严格较大才赢，平点没赢。已接受拼点，此处没有取消；不是出牌阶段用杀。'];
 return html`<section className="response-context sgs-forest-context" data-source-skill-id=${id} data-response-stage=${stage}><div className="response-kicker">${row[1]} · ${privateStages.has(stage)?'私有选牌':meta.mandatory?'必须完成':'当前选择'}</div><strong>${row[3]}</strong><p>${row[4]}</p>
 ${stage==='haoshi_offer'?html`<p data-haoshi-extra="2">正常摸牌 ${numberOrUnknown(meta.base_count)} + 2 张</p>`:null}
 ${stage==='haoshi_target'?html`<p data-haoshi-count=${numberOrUnknown(meta.count)}>必须交 ${numberOrUnknown(meta.count)} 张手牌 · 可选对象最低手牌数 ${numberOrUnknown(meta.minimum_hand)}</p>`:null}
 ${['haoshi_cards','dimeng_cost','yinghun_discard'].includes(stage)?html`<p data-exact-selection=${numberOrUnknown(prompt.min_count)}>必须恰好选择 ${numberOrUnknown(prompt.min_count)} 张${stage==='haoshi_cards'?'手牌':'合法手牌／装备'}</p>`:null}
 ${['yinghun_target','yinghun_branch','yinghun_discard'].includes(stage)?html`<p data-yinghun-x=${numberOrUnknown(meta.locked_x??meta.missing_hp)}>英魂 X=${numberOrUnknown(meta.locked_x??meta.missing_hp)}${stage==='yinghun_discard'?' · 发动时固定':''}；先摸，后由目标弃牌</p>`:null}
 <small>${input}</small></section>`;
}
/** Never inspect raw support/assault receipts or an opposing hand. */
export function SgsForestStatus({player}){
 const ids=(player?.effective_hero||player?.hero)?.skill_ids||[];
 const protections=[ids.includes('sgs.huoshou')?'祸首':null,ids.includes('sgs.juxiang')?'巨象':null].filter(Boolean);
 if(!protections.length)return null;
 return html`<section className="player-card-status sgs-forest-status" aria-label="南蛮技能状态"><div className="card-status-flags">${protections.map(name=>html`<span key=${name} className="chip">${name} · 南蛮效果免疫</span>`)}</div><small>本作南蛮对应烽火狼烟；仅免疫该牌对自己的效果，其他伤害照常。</small></section>`;
}
/** H/E multi-select uses exact prompt option IDs and only the verified chooser's
 * public DTO. owner_seat on Yinghun identifies the skill owner, not the chooser. */
export function SgsForestMaterialChoices({state,prompt,onRespond,busy=false,CardView=null}){
 const [selected,setSelected]=useState([]);
 if(!isSgsForestPromptOwner(prompt,state)||prompt.kind!=='select_hand')return null;
 const need=prompt.min_count,self=state.players.self;
 if(!Number.isSafeInteger(need)||need<1||prompt.max_count!==need)return html`<p role="status">等待有效的精确选牌提示…</p>`;
 const allowed=(prompt.options||[]).filter(o=>/^hand:[1-9]\d*$|^eq:(weapon|armor|offensive_horse|defensive_horse)$/.test(o.id));
 const cancel=prompt.meta?.mandatory?null:(prompt.options||[]).find(o=>['cancel','pass','0'].includes(o.id));
 const picked=selected.filter(id=>allowed.some(o=>o.id===id&&!o.disabled));
 const cardFor=option=>option.id.startsWith('hand:')?self.hand?.[Number(option.id.slice(5))-1]:self.equipment?.[option.id.slice(3)];
 const toggle=id=>setSelected(previous=>previous.includes(id)?previous.filter(x=>x!==id):previous.length<need?[...previous,id]:previous);
 return html`<section className="sgs-forest-material-choices" aria-label="仅你可见的精确选牌"><p role="status" aria-live="polite">已选 ${picked.length} / ${need} 张${prompt.meta?.mandatory?' · 必须完成':''}</p><div className="eighth-form-choices">${allowed.map(option=>{
  const card=cardFor(option),chosen=picked.includes(option.id),disabled=busy||!!option.disabled||(!chosen&&picked.length>=need);
  return html`<section key=${option.id} className="hero-skills" data-forest-material=${option.id}><strong>${option.id.startsWith('hand:')?'手牌':'装备区'}</strong>${card&&!card.hidden&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className=${`btn option ${chosen?'primary':''}`} data-option-id=${option.id} aria-pressed=${chosen} disabled=${disabled} onClick=${()=>toggle(option.id)}>${chosen?'已选 · ':''}${option.label}</button></section>`;
 })}</div><div className="dialog-actions"><button type="button" className="btn primary" data-forest-confirm="true" disabled=${busy||picked.length!==need} onClick=${()=>{if(picked.length===need)onRespond(picked.join(' '));}}>确认</button>${cancel?html`<button type="button" className="btn" data-option-id=${cancel.id} disabled=${busy} onClick=${()=>onRespond(cancel.id)}>${cancel.label}</button>`:null}</div></section>`;
}
