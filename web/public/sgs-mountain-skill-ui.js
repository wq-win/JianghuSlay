/** Original Mountain source artwork and complete base/granted skill guides.
 * Public DTOs only. A source snapshot is not current-client certification. */
import {html} from 'htm/react';
import {useState,useRef} from 'react';
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const source='来源：大陆三国杀移动版基础身份／神话再临·山，资料快照2026-10-15。官方移动目录确认完整技能与势力；体力、性别由匹配经典身份的手游社区补足，历史跨产品资料仅作程序佐证。未核验2026当前移动客户端。';
const input='触屏点选，或键盘Tab定位、Enter确认；只有明确提供取消的未提交步骤可Esc取消。已承诺效果不能退款，重复点击与过期提示不得重复结算。';
export const SGS_MOUNTAIN_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.zhang-he':{name:'张郃',hp:4,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.deng-ai':{name:'邓艾',hp:4,faction:'魏',gender:'男'},
 'sgs.adapted.base.hero.jiang-wei':{name:'姜维',hp:4,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.cai-wen-ji':{name:'蔡文姬',hp:3,faction:'群',gender:'女'}
});
export const SGS_MOUNTAIN_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.zhang-he':[
  {id:'sgs-mountain-qiaobian',source_skill_id:'sgs.qiaobian',name:'巧变',type:'optional',icon:'sgs-mountain-qiaobian',summary:'各判定／摸牌／出牌／弃牌阶段前可弃1手牌跳过；跳摸可取牌，跳出可移场牌',condition:'自己的判定、摸牌、出牌或弃牌阶段即将真实进入，且该阶段未被其他效果跳过，自己有可弃置手牌；准备与结束阶段不适用。',timing:'每个符合条件的阶段开始前各询问一次，先支付1手牌并跳过该阶段，再进行对应可选效果',cost:'每次发动分别弃置自己1张合法手牌；已装备、判定区与田均不能支付',limit:'每个真实合格阶段事件1次；不是整回合仅1次，额外真实阶段有自己的机会；整个翻面跳过的回合没有四次机会',effect:'跳过判定或弃牌没有额外效果。若跳过摸牌，可从至多两名不同的其他存活角色各获得1张手牌；按行动顺序发生各自失牌，最后合并获得已保留实体。若跳过出牌，可把一名角色装备区或判定区的1张实体移至另一名角色对应合法区域；双方任一人可为自己。装备须对应空槽，判定区不得同名重复，并检查目标禁止。',targets:'取牌为0至2名不同的其他存活且有手牌角色，每人至多1张，不限阵营或距离；移牌为两名不同存活角色，E→对应空E槽或J→合法J区',phase_use:'没有出牌阶段主动按钮；四个阶段前分别选择是否支付。跳过出牌后不会再提供普通出牌或出牌阶段技能。',response:'付费前可取消；已跳过后可放弃取牌／移牌，但不退代价、不恢复阶段。对手手牌只盲选；装备和判定区公开。',disabled_reason:'准备／结束阶段、阶段已跳过、整回合翻面跳过或没有合法手牌时不能发动；移牌不能替换占用装备、变成使用牌或无懈窗口。',notes:[source,'M1–M4：对应区域、真实阶段编号、逐人失牌后合并获得与中断策略均明示为江湖兼容边界。',input],hooks:['before_judgment_phase','before_draw_phase','before_play_phase','before_discard_phase'],callbacks:['sgs_before_judgment_qiaobian','sgs_before_draw_qiaobian','sgs_before_play_qiaobian','sgs_before_discard_qiaobian'],activeId:null}
 ],
 'sgs.adapted.base.hero.deng-ai':[
  {id:'sgs-mountain-tuntian',source_skill_id:'sgs.tuntian',name:'屯田',type:'optional',icon:'sgs-mountain-tuntian',summary:'回合外失去H/E牌后可判定；非红桃判定牌作田，每张田令自己向外距离−1',condition:'自己的回合外真实失去手牌或装备；同一事件批量失多张只提供一次机会，判定区或田单独离区不触发。',timing:'每个实际回合外失牌事件后可判定；非红桃最终判定牌在合法时放到武将牌旁作为公开田',cost:'发动无额外代价；田来自该次真实最终判定牌，不另摸1张、不复制虚拟牌',limit:'没有每回合次数上限；每个真实失牌事件一次，零张失牌和重复事件不触发；田无张数上限',effect:'可进行正常判定并允许合法改判。最终结果非红桃时，将尚可获得的该张判定实体置为田；红桃正常弃置，不获得。自己计算至其他角色距离时减去当前田数，下限1；其他人至自己的距离不因此减少。田不参与洗牌。',targets:'自己进行判定；持续修正只适用于技能拥有者→其他角色的方向',phase_use:'没有出牌阶段主动按钮；回合外失牌后选择接受或放弃判定。',response:'接受前可放弃；已选择判定且最终非红桃时入田为必须结果。用闪、被取牌、交牌或拼点的真实失牌可触发；同一拥有者H转E不算净失牌。',disabled_reason:'自己的回合内失牌、仅失判定区／田、零张事件或技能已移除时不触发；不是改版红桃获得牌的屯田。',notes:[source,'M5/M6：失牌事件与判定实体捕获时序为江湖政策；只读取公开田的实体牌面，绝不读取隐藏牌堆。',input],hooks:['after_cards_lost','outgoing_distance'],callbacks:['sgs_after_cards_lost_tuntian','sgs_tuntian_distance_modifier'],activeId:null},
  {id:'sgs-mountain-zaoxian',source_skill_id:'sgs.zaoxian',name:'凿险',type:'locked',awakening:true,icon:'sgs-mountain-zaoxian',summary:'准备阶段田≥3且未觉醒：体力上限−1，获得急袭；田与屯田保留',condition:'自己的真实准备阶段，当前至少3张田，且此技能拥有者尚未凿险觉醒。',timing:'准备阶段条件满足自动觉醒；先减体力上限1，再获得急袭',cost:'减少1点体力上限；当前体力仅在超过新上限时截至新上限，不视为伤害；不消耗田',limit:'此角色本局觉醒绑定限一次，存档恢复或阶段循环不重置；失去后重新取得不自动刷新觉醒标记',effect:'体力上限减少1并获得完整急袭。保留屯田与所有田；觉醒后田少于3也不会失去急袭。获得急袭不会立即自动使用顺手牵羊。',targets:'自己；觉醒进度按技能拥有者绑定，复制其他角色时不导入死者的田和觉醒历史',phase_use:'锁定觉醒，没有主动按钮；状态显示未觉醒／已觉醒与实际体力上限。',response:'条件达成必须结算；不提供自愿取消。体力上限≤1的极端情形由M7显式约束，不冒充来源定论。',disabled_reason:'非准备阶段、田不足3、已觉醒或凿险已移除时不再次触发。',notes:[source,'M7/M14：永久觉醒标记与独立复制绑定；实际HP/上限由对局DTO显示，不用来源4体力覆盖。',input],hooks:['on_prepare'],callbacks:['sgs_prepare_zaoxian'],activeId:null},
  {id:'sgs-mountain-jixi',source_skill_id:'sgs.jixi',name:'急袭',type:'active',acquired:true,granted_by:'sgs.zaoxian',icon:'sgs-mountain-jixi',summary:'凿险授予：用1张田作顺手牵羊，按消耗该田后的距离1选择其他角色',condition:'当前确已获得急袭，自己的空闲出牌阶段，至少1张实际拥有的田，并存在消耗所选田后仍合法的顺手牵羊目标。',timing:'先选田和消费后的合法目标，再把田移入处理区，按普通顺手牵羊结算',cost:'1张自己的真实田作为用牌素材；不是先弃牌再凭空生成牌，保留花色、点数、颜色与实体身份',limit:'印刷技能没有阶段次数上限；有合法田和目标可多次发动，每次各用1张田',effect:'将田当顺手牵羊使用，遵循其目标禁止、无懈与获得规则。生效时取得目标1张合法手牌／装备／判定区牌进入自己的手牌。该田离开后不再提供自身距离减免；被无懈或无效也已消耗，正常清理素材，不自动回田。',targets:'恰好1名其他存活角色，消耗所选田后的有效距离≤1且有可获得H/E/J牌；不限队伍，不能以武器攻击范围代替距离',phase_use:'凿险未授予时展示完整规则并标明未获得，不产生假主动回调；获得后点击急袭，选择田与合法目标。',response:'提交用牌前可取消；提交后普通无懈与选牌按原牌继续。对手手牌只盲选，装备和判定区可见。',disabled_reason:'未获得／已移除急袭、没有田、不是自己的空闲出牌阶段、消费后距离过远或目标禁止／没有可获得牌。',notes:[source,'M8：普通顺手牵羊展开采用本作现有牌规则；未另行认证当前移动版完整卡牌规则。消费田不计自身距离获历史同技能FAQ佐证。',input],hooks:['own_play','virtual_snatch'],callbacks:['sgs_player_jixi'],activeId:'sgs.jixi'}
 ],
 'sgs.adapted.base.hero.jiang-wei':[
  {id:'sgs-mountain-tiaoxin',source_skill_id:'sgs.tiaoxin',name:'挑衅',type:'active',icon:'sgs-mountain-tiaoxin',summary:'每出牌阶段1次，挑选攻击范围包含你的其他角色；其用杀，否则你弃其1张H/E',condition:'自己的空闲出牌阶段，本阶段未用；存在一名其他存活角色，其当前攻击范围包含自己。',timing:'选择合法目标并消耗本阶段次数；目标决定是否对自己使用1张合法杀；仅未使用杀才弃牌',cost:'发动没有弃牌代价；目标若用杀须正常支付真实或合法转化素材',limit:'每个真实出牌阶段限一次；合法承诺后目标无牌或无结果也计次，重复／过期输入不重复消耗',effect:'目标可对姜维使用一张杀，含合法转化杀，按真实用杀结算武器、防具、闪及伤害触发；不占其普通出牌阶段杀次数。只要已使用杀，即使被闪避或未造成伤害也不弃牌。若目标没有使用杀，姜维选择弃其1张合法手牌或装备；无可弃H/E则无后续。',targets:'1名其他存活角色；检查目标→自己的距离及目标的武器范围，不是自己的攻击范围，也不是只能挑敌方；目标无手牌仍可合法被挑衅',phase_use:'点击挑衅；显示反向攻击范围条件与本出牌阶段次数。',response:'目标可使用合法杀或放弃；放弃后由姜维选弃H/E，手牌盲选、装备可见，不含判定区。',disabled_reason:'非自己的空闲出牌阶段、次数已用、没有其攻击范围包含自己的其他角色；能否用杀与挑选目标的范围门槛分别检查。',notes:[source,'M9：真实回合外用杀，不是单纯打出杀或直接伤害；承诺后没有结果仍消耗阶段次数。',input],hooks:['own_play','out_of_turn_slash'],callbacks:['sgs_player_tiaoxin'],activeId:'sgs.tiaoxin'},
  {id:'sgs-mountain-zhiji',source_skill_id:'sgs.zhiji',name:'志继',type:'locked',awakening:true,icon:'sgs-mountain-zhiji',summary:'准备阶段无手牌且未觉醒：先回复1或摸2，再上限−1，获得普通观星',condition:'自己的真实准备阶段，手牌数为0，且此角色尚未志继觉醒；装备与特殊牌堆不计为手牌。',timing:'先选择并执行回复1体力或摸2牌，后减少体力上限1并截限，最后获得观星；可在同一准备阶段使用新观星',cost:'选择效果后体力上限减少1；不是先减上限再回复，不造成额外伤害',limit:'此角色本局觉醒绑定限一次；阶段循环、存档恢复和同阶段失去再取得都不刷新',effect:'必须选择：已受伤时可回复1体力，或摸2张牌。效果完成后减1上限，超限才截当前体力，并获得普通观星，保留挑衅。满体力的回复项按本作合法选择政策禁用并解释原因。',targets:'自己；无手牌仅看H，不要求装备区或田为空',phase_use:'没有出牌阶段主动按钮；满足条件自动进入必须分支选择。',response:'觉醒分支不可取消；显示先回复／摸牌、后降低上限的顺序。新观星可在本次准备阶段提供一次可选机会。',disabled_reason:'非准备阶段、仍有手牌、已经觉醒或志继已移除；体力上限≤1的边界需依M7处理。',notes:[source,'M7/M10：同准备阶段观星和顺序获历史FAQ佐证；满血禁选回复属于明示江湖政策，非当前客户端认证。',input],hooks:['on_prepare'],callbacks:['sgs_on_prepare_zhiji'],activeId:null},
  {id:'sgs-mountain-guanxing',source_skill_id:'sgs.guanxing',name:'观星',type:'optional',acquired:true,granted_by:'sgs.zhiji',icon:'sgs-mountain-guanxing',summary:'志继授予：准备阶段私看至多5张顶牌，X为存活人数，任意排序置顶／置底',condition:'当前确已获得观星且进入自己的真实准备阶段，包括志继刚获得观星的同一准备阶段。',timing:'准备阶段可选择发动；私看牌堆顶X张实际可用牌，X=min(5,存活角色数，含自己)，完成排列后一次提交',cost:'无弃牌或体力代价；不获得、不弃置、不摸走这些牌',limit:'每个真实准备阶段一次可选机会；没有界版结束阶段额外触发，少于5人不自动看5张',effect:'把私看的牌任意分成有序牌堆顶和有序牌堆底两组，可全部置顶或全部置底。顶组第一张是之后最先摸到的牌；底组按先后在原牌堆剩余牌之后摸到。只改变牌序，不公开牌面给对手、AI或战报。短牌堆只处理真实可用牌。',targets:'仅自己私看与排列；存活人数包括自己，不由原人数或敌人数替代',phase_use:'没有出牌阶段主动按钮；未获得仍展示完整规则与锁定原因，获得后在准备阶段选择。',response:'未查看前可放弃；已查看后必须提交完整排列，允许按原顺序全部放回顶端，不宣称可撤销已获得的信息。',disabled_reason:'未获得／已移除观星、非准备阶段或该真实准备阶段机会已处理；不读取原始引擎牌堆快照。',notes:[source,'M10/M14：私有牌序按精确实体排列，并保持拥有者绑定与存档隐私；来源未认证极端短牌堆程序。',input],hooks:['on_prepare','private_deck_order'],callbacks:['sgs_on_prepare_guanxing'],activeId:null}
 ],
 'sgs.adapted.base.hero.cai-wen-ji':[
  {id:'sgs-mountain-beige',source_skill_id:'sgs.beige',name:'悲歌',type:'optional',icon:'sgs-mountain-beige',summary:'角色因杀受伤后可弃1张H/E令其判定：红桃回血、方块摸2、梅花来源弃2、黑桃来源翻面',condition:'一名角色受到正数杀伤害并完成救援后，技能拥有者与受伤者均仍存活，且拥有者能弃1张合法H/E；受伤者可以是自己。',timing:'每个符合条件的伤害事件完成后提供一次机会；先付1H/E代价与其嵌套事件，再令受伤者进行正常判定',cost:'弃置自己1张合法手牌或装备，不含判定区／特殊牌堆；代价事件致死后不退款、不非法继续判定',limit:'每个杀伤害事件至多发动一次，一次2点伤害也只判一次；独立伤害事件分别询问，没有每回合总上限',effect:'以受伤者作为判定角色，采用最终判定花色：红桃令其回复1体力，方块令其摸2牌；梅花令实际伤害来源自行弃2张合法H/E，不足则弃光；黑桃令实际来源翻面，背面翻回正面。无来源或来源已死时梅花／黑桃无结果，红桃／方块仍有效。',targets:'受伤且存活角色，包括自己、队友和敌人；来源分支只找实际伤害来源，不猜测最后攻击者',phase_use:'没有出牌阶段主动按钮；杀伤害后选择支付代价，梅花弃牌由来源控制。',response:'付费前可放弃；付费后不能退款。判定允许合法改判和受伤者花色转换；翻面不会立刻结束当前回合。',disabled_reason:'零伤害、只失去体力、非杀来源、救援后拥有者／受伤者已死、没有合法H/E或悲歌已移除。',notes:[source,'M11/M12：传导／转移保留杀来源的事件归属、多复制者顺序与代价毒伤中断均为跨作品江湖政策，未获当前移动客户端认证。',input],hooks:['after_any_damage_resolved'],callbacks:['sgs_after_any_damage_resolved_beige'],activeId:null},
  {id:'sgs-mountain-duanchang',source_skill_id:'sgs.duanchang',name:'断肠',type:'locked',icon:'sgs-mountain-duanchang',summary:'最终死亡时令实际凶手永久失去当前所有武将技能；装备提供的技能保留',condition:'蔡文姬最终死亡，确有实际伤害来源／凶手，并且当前对局死亡调度仍允许执行此效果。',timing:'完成濒死救援后的最终死亡事件，按本作死亡调度执行一次',cost:'无，锁定生效；不能自愿取消',limit:'每个最终死亡事件一次；所移除技能不在回合结束恢复，但不禁止将来独立合法获得的新技能',effect:'凶手失去当时全部武将技能，包括固有、锁定、已觉醒／授予、当前借得／复制和当前有效个人主公技能；装备提供的技能不移除。保留体力上限、身份、队伍和装备。停止已移除技能的未来触发／持续效果；屯田等所属牌堆按实际归属清理，不能重算英雄时复活技能。',targets:'实际杀死蔡文姬的角色；无来源的失去体力、毒失血或其他无来源死亡不凭空指定凶手',phase_use:'没有主动按钮；死亡战报与凶手状态持续显示已移除武将技能、装备能力保留。',response:'已移除技能的未承诺提示取消；已承诺效果依记录的来源与合法性继续。复制形态不能让移除技能在回合末、重载或重新取模板时恢复。',disabled_reason:'尚未最终死亡、没有真实凶手或本作终局调度已停止时无接收者。完整身份奖励／惩罚／胜利优先级尚待身份模式实现。',notes:[source,'M13–M15：当前授予／借得技能与后续再获取、跨作品易装、牌堆清理及死亡时序明确为江湖兼容政策，不把完整技能组等同完整身份模式。',input],hooks:['before_death_commit','general_skill_removal'],callbacks:['sgs_before_death_duanchang'],activeId:null}
 ]
});
export const SGS_MOUNTAIN_SKILL_ICONS=freeze({
 'sgs-mountain-qiaobian':'<path d="M3 6h9v7H3Zm17 13h9v7h-9ZM18 5h9v8m0-8-9 9M5 19v8h9m-9 0 9-9M8 3v3m17 20v3M3 17l5-3m21 1-5 3"/>',
 'sgs-mountain-tuntian':'<path d="M3 20 16 14l13 6-13 9ZM3 14l13-6 13 6M9 23l13-6M16 14V3m0 6q-8 0-8-6 8 0 8 6Zm0 3q8 0 8-6-8 0-8 6Z"/>',
 'sgs-mountain-zaoxian':'<path d="m2 28 9-19 5 10 7-14 7 23ZM8 28l6-7m4 7 5-8M14 10l7-8m-4 1 5 5M12 15l-2 3M24 12l2 3"/>',
 'sgs-mountain-jixi':'<path d="M3 26 17 12l-5-2 16-7-6 16-2-5L6 29ZM3 11l6-4m-7 12 9-7M19 27h9m-3-3 3 3-3 3M15 3v4"/>',
 'sgs-mountain-tiaoxin':'<path d="M4 22 27 5m-6-1 7-1-1 7M6 18l7 10M3 29l5-4M2 10h11m-4-4 4 4-4 4M22 15v11m-4-4 4 4 4-4"/>',
 'sgs-mountain-zhiji':'<path d="M5 28V5h10l-3 6 3 6H5M5 28h13M19 28V13l4-6 4 6v15ZM19 19h8M17 4l2-2m9 4 2-1M9 22l4-2"/>',
 'sgs-mountain-guanxing':'<path d="m16 2 2 5 5 1-4 4 1 5-4-3-5 3 1-5-4-4 6-1ZM3 23h26M7 28h18M6 20l-3-5m23 5 3-5M11 20l1-3m8 3-1-3"/><circle cx="4" cy="8" r="1"/><circle cx="27" cy="6" r="1"/>',
 'sgs-mountain-beige':'<path d="M7 3h15l3 24H4ZM10 6 8 24m7-18v18m5-18 2 18M5 13h19M10 28h11M27 7q5 5 0 9M2 6l2 3"/>',
 'sgs-mountain-duanchang':'<path d="M16 8C8-3-4 9 9 22l6 7 2-9-5-4 7-6-3-2ZM19 7c10-7 16 6 5 15l-4 4 2-8-5-4 6-5ZM3 27l4-4m21-20 2-2"/>'
});
export const SGS_MOUNTAIN_HOST_POLICIES=freeze([
 ['M1','H为手牌、E为装备、J为判定区。巧变只付H；悲歌等一张牌代价用合法H/E。提交前可取消，付费后不退不恢复阶段；未知对手H盲选，非法／过期输入不得部分改变状态。'],
 ['M2','巧变每个真实未跳过的判定／摸牌／出牌／弃牌入口各一次且各付1H，额外阶段独立；跳判保留延时牌，跳阶段抑制整阶段事件。翻面跳过整个回合不产生四次巧变机会。'],
 ['M3','巧变跳摸后可选0至2名不同其他存活H>0角色，各取1H。按当前行动顺序逐人失牌并处理其触发，再合并获得预留实体；不抢取后来新摸的替代牌。'],
 ['M4','巧变移1实体E→同类空槽或J→合法J区，端点不同且存活，任一端可自己；不顶替装备、不产生用牌／无懈，不重复判定牌，并检查目标禁止；原延时身份和离装效果保留。'],
 ['M5','屯田只按回合外实际H/E失牌事件触发，一批多张一次；J／田单独离区不算，同拥有者H→E不是净失牌，零张无机会，嵌套不同事件分别处理并按事件ID去重。'],
 ['M6','屯田为可改判的真实判定，最终非红桃实际判定牌入公开田，红桃正常弃置，不额外复制。田不洗牌、无上限；只减拥有者向外距离，下限1，反向不减。'],
 ['M7','凿险／志继为技能拥有者独立且永久的觉醒绑定；上限−1后仅超限才截HP，不算伤害。复制不带死者田／觉醒记忆，移除不得被英雄模板重建。上限≤1异常路径须显式拦截，未认证移动端裁定。'],
 ['M8','急袭以1张真实田作普通顺手牵羊；目标预览先剔除所选田的距离贡献，范围为距离1而非武器攻击范围。可对其他队伍任意存活合法H/E/J目标，用正常无懈与实体清理，被取消不退田。牌规则展开是宿主兼容，非当前移动端卡牌认证。'],
 ['M9','挑衅检查目标→姜维的距离与目标武器攻击范围，每真实出牌阶段1次。目标真实使用杀且不占常规出牌杀次数；已用杀即使没伤害也不弃牌，只有未用杀才由姜维弃其1H/E，J不可。合法承诺无结果仍计次。'],
 ['M10','志继先回复1或摸2，再降上限并得观星；满血回复按本作合法选择政策禁用。允许同准备阶段观星，X=min(5,存活人数含自己)。牌序仅拥有者可见，顶／底任意有序分组，全顶全底合法；不把私牌写战报。'],
 ['M11','悲歌按一次正数杀伤害事件一次而非每点，救援后拥有者与受伤者须存活。判定属于受伤者；红桃其回复1，方块其摸2，梅花实际来源自弃2H/E不足全弃，黑桃来源正背切换。来源缺失／已死只使后两支无效；中途翻面不立即结束回合。'],
 ['M12','杀来源沿用牌ID穿过转移／传导，本作为每个存活伤害接收者提供悲歌；此归因与多复制者按行动顺序是跨作品政策。代价毒／失装触发先完结，拥有者或受伤者死亡则不非法判定，代价不退。'],
 ['M13','断肠移除凶手当时全部武将技能，含固有／锁定／授予／当前借得复制／个人主公技，保留装备技能和HP上限／身份／队伍。持续效果停止，技能牌堆清理且不重复弃实体；不禁止以后独立合法获得新技能。'],
 ['M14','原英雄、当前复制、授予技能和装备提供者分账。移除当前技能和复制来源能力，重载／重算不能复活；不重置觉醒或次数。未承诺技能提示取消，已承诺效果按记录继续；未来独立获取可重新增加技能。'],
 ['M15','无来源的失血／毒失血死亡不编造凶手。完整身份模式还需身份翻开、终局优先级、死亡技、主公关系与击杀奖惩调度；这些并未因固有技能完整而完成。四位没有遗漏的个人主公技。'],
 ['M16','展示完整固有及授予技能、真实HP上限、觉醒／移除／翻面和公开田；未知手牌与牌序不泄漏。来源姜维保留正式名，原江湖同名机制独立改为粮川且保留稳定ID；保存／回放和复制均按每个拥有者绑定。']
]);
const closeOnEscape=event=>{if(event.key==='Escape'&&event.currentTarget.open){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();event.preventDefault();event.stopPropagation();}};
export function SgsMountainPolicyGuide(){return html`<details className="hero-provenance sgs-mountain-policy-guide" onKeyDown=${closeOnEscape}><summary>M1–M16 · 江湖兼容边界</summary><p>下列精确时序、跨作品复制和异常分支是本作明示的兼容政策。历史FAQ仅作程序佐证，未实测2026当前移动客户端；完整武将技能不代表完整身份奖励、惩罚与胜利模式。</p><ol>${SGS_MOUNTAIN_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsMountainHpEvidence({hero}){const h=SGS_MOUNTAIN_HERO_IDENTITIES[hero?.id];if(!h)return null;return html`<p className="hero-hp-evidence" data-mountain-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有体力${h.hp}；通常以满体力${h.hp}/${h.hp}开局，这是M0初始化政策，不含身份加成。官方移动目录确认势力，匹配经典身份的手游社区补足体力／性别；历史跨产品资料仅作佐证，本次官方移动详情页未提供明确体力／性别字段，未实测2026当前移动客户端。当前体力上限以对局状态为准。</p>`;}
const STAGES=freeze({
 qiaobian_cost:['sgs.qiaobian','巧变','choice','弃1张自己的手牌，跳过当前阶段','只可支付手牌H。尚未提交可放弃；付费后即使放弃后续取牌／移牌，也不会退牌或恢复阶段。'],
 qiaobian_draw_target:['sgs.qiaobian','巧变','choice','摸牌阶段已跳过：选择0至2名不同其他角色','每人只取1张未知手牌；只列存活且有H的其他角色，不限队伍、距离。完成选择可不取牌，跳摸仍保留。'],
 qiaobian_hand:['sgs.qiaobian','巧变','choice','选择该目标的1张未知手牌','目标手牌全部盲选，不公开牌名、花色、点数。不能选装备／判定区；两名目标各至多1张。'],
 qiaobian_transfer:['sgs.qiaobian','巧变','choice','出牌阶段已跳过：移动1张公开场牌，或不移动','E只能移到对应空装备槽；J只能移到合法判定区，不能重名、不能突破目标禁止。端点不同且任一端可为自己；移牌不是使用牌。'],
 tuntian_offer:['sgs.tuntian','屯田','confirm','回合外真实失牌：是否进行一次判定？','同批多张失牌只判一次。最终非红桃真实判定牌入公开田；红桃正常弃置。每张田只减少自己向外距离。'],
 jixi_material:['sgs.jixi','急袭','choice','选择1张田作为顺手牵羊素材','目标距离先扣除所选田的贡献再检查：消耗后的有效距离须≤1，不是武器攻击范围。提交前可取消；无懈后也不会退田。'],
 jixi_target:['sgs.jixi','急袭','choice','选择消耗该田后仍在距离1内的目标','这里只列本次真实田消耗后仍合法且有H/E/J可获得的其他存活角色，不限队伍。选定后按普通顺手牵羊与无懈结算。'],
 tiaoxin_target:['sgs.tiaoxin','挑衅','choice','选择其攻击范围包含你的其他角色','检查目标→你的距离及目标当前武器范围。合法提交就消耗本出牌阶段次数，即使对方无牌或最终没有结果。'],
 tiaoxin_sha:['sgs.tiaoxin','挑衅','choice','是否对挑衅者真正使用一张杀？','可选择当前合法杀或转化素材，也可不使用。使用后正常响应闪／防具／伤害；不占普通出牌杀次数。只要用了杀，即使没伤害也不再弃牌。'],
 tiaoxin_discard:['sgs.tiaoxin','挑衅','choice','目标没有使用杀：弃其1张H/E','手牌盲选、装备明选，不可选判定区；已经使用但被闪掉的杀不会进入此步骤。已承诺效果必须完成。'],
 zhiji_choice:['sgs.zhiji','志继','choice','觉醒：先回复1或摸2，再减少体力上限1','此选择必须完成。满体力回复选项禁用；分支完成后才降低上限、截当前体力并取得观星，可在同准备阶段询问观星。'],
 guanxing_offer:['sgs.guanxing','观星','confirm','是否私看并排列牌堆顶牌？','X=min(5,当前存活人数，含自己)。只调整牌序，不摸牌、不弃牌；在查看前可放弃，牌面不向其他角色或战报公开。'],
 guanxing_order:['sgs.guanxing','观星','choice','仅你可见：排列牌堆顶与牌堆底','每区先选的牌先被摸到。可全顶或全底；全部选择后一次提交，或保持原顺序全部放回顶部。已查看的信息不能撤回。'],
 beige_cost:['sgs.beige','悲歌','select_hand','本次杀伤害后：弃1张H/E令受伤者判定','一次多点伤害只提供一次机会。先付代价与嵌套事件，再由受伤者进行判定；付费前可取消，不能用J或特殊牌堆。'],
 beige_source_discard:['sgs.beige','悲歌','select_hand','梅花结果：伤害来源自己弃牌','选择恰好当前要求的合法手牌／装备，不含判定区；不足2张时弃光全部合法牌。必须完成，由你自己选，不由蔡文姬查看你的手牌。']
});
export const SGS_MOUNTAIN_PROMPT_CONTEXTS=STAGES;
const skillIDs=new Set(Object.values(STAGES).map(r=>r[0]));
const promptID=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
const canonicalSeat=id=>['player','p1'].includes(id)?'p1':id;
const n=value=>Number.isSafeInteger(value)&&value>=0?value:'?';
const hp=value=>Number.isSafeInteger(value)?value:'?';
export function isSgsMountainPromptStage(prompt){return Object.hasOwn(STAGES,prompt?.meta?.stage)||skillIDs.has(promptID(prompt));}
export function isSgsMountainPrompt(prompt){
 const m=prompt?.meta||{},id=promptID(prompt),row=STAGES[m.stage];
 if(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id)return false;
 if(!row||row[0]!==id||row[2]!==prompt.kind)return false;
 if(m.stage==='qiaobian_cost'&&!['judgment','draw','play','discard'].includes(m.phase))return false;
 if(prompt.kind==='select_hand'&&(!Number.isSafeInteger(prompt.min_count)||prompt.min_count<1||prompt.max_count!==prompt.min_count||prompt.min_count>(m.stage==='beige_cost'?1:2)))return false;
 if(m.stage==='guanxing_order'&&(!m.private_cards||!['top','bottom'].includes(m.tray)||!Number.isSafeInteger(m.count)||m.count<1||m.count>5))return false;
 return true;
}
export function isSgsMountainPromptOwner(prompt,state){
 if(!isSgsMountainPrompt(prompt))return false;
 const seat=canonicalSeat(state?.players?.self?.seat);
 return Boolean(seat&&prompt.player_id&&canonicalSeat(prompt.player_id)===seat&&prompt.meta.private_to&&canonicalSeat(prompt.meta.private_to)===seat);
}
export function SgsMountainResponseContext({state,prompt}){
 if(!isSgsMountainPromptOwner(prompt,state))return null;
 const m=prompt.meta,row=STAGES[m.stage],phase={judgment:'判定',draw:'摸牌',play:'出牌',discard:'弃牌'}[m.phase];
 return html`<section className="response-context sgs-mountain-context" data-source-skill-id=${row[0]} data-response-stage=${m.stage}><div className="response-kicker">${row[1]} · ${m.mandatory?'必须完成':m.stage==='guanxing_order'?'私有牌序':'当前选择'}</div><strong>${row[3]}</strong><p>${row[4]}</p>
 ${phase?html`<p data-mountain-phase=${m.phase}>当前将跳过：${phase}阶段 · 本次代价1张手牌</p>`:null}
 ${m.stage==='qiaobian_draw_target'?html`<p data-mountain-selected-targets=${(m.selected_seats||[]).length}>已选 ${(m.selected_seats||[]).length} / 2 名不同角色</p>`:null}
 ${m.stage==='jixi_material'||m.stage==='jixi_target'?html`<p data-jixi-post-material-range="1">本次素材离田后重新计算 · 目标距离上限1 · 现有田 ${n(state.players.self.sgs_mountain?.field_count)} 张</p>`:null}
 ${m.stage==='zhiji_choice'?html`<p data-zhiji-order="choice-before-maxhp">先${m.recovery_available?'回复1或':''}摸2 → 体力上限−1 → 获得观星${m.recovery_available===false?'；当前不能选择回复：体力已满或不可回复。':''}</p>`:null}
 ${m.stage==='guanxing_offer'||m.stage==='guanxing_order'?html`<p data-guanxing-count=${n(m.count)}>本次实际／预计查看 ${n(m.count)} 张 · 仅当前选择者可见</p>`:null}
 ${prompt.kind==='select_hand'?html`<p data-exact-selection=${prompt.min_count}>必须恰好选择 ${prompt.min_count} 张合法手牌／装备</p>`:null}
 <small>${input}</small></section>`;
}
/** Full guide inventories stay available, but current providers are authoritative.
 * No client can revive removed/granted skills from a source template. */
export function sgsMountainSkillState(skill,player){
 if(!player)return {status:skill.acquired?'locked':'guide',label:skill.acquired?'觉醒后获得':'完整规则',available:false};
 const publicState=player.sgs_mountain||{},current=(player.effective_hero||player.hero)?.skill_ids||[],removed=publicState.removed_skill_ids||[];
 if(removed.includes(skill.source_skill_id)&&!current.includes(skill.source_skill_id))return {status:'removed',label:'已失去武将技能',available:false};
 if(skill.acquired&&!current.includes(skill.source_skill_id)&&!(publicState.granted_skill_ids||[]).includes(skill.source_skill_id))return {status:'locked',label:`未获得 · ${skill.granted_by==='sgs.zaoxian'?'凿险':'志继'}觉醒授予`,available:false};
 if(skill.awakening)return {status:publicState.awakened?.[skill.source_skill_id]?'awakened':'waiting',label:publicState.awakened?.[skill.source_skill_id]?'已觉醒 · 本局不再触发':'未觉醒 · 满足条件自动结算',available:false};
 return {status:'owned',label:skill.acquired?'已获得':'当前拥有',available:current.includes(skill.source_skill_id)||(publicState.granted_skill_ids||[]).includes(skill.source_skill_id)};
}
const allGuides=Object.values(SGS_MOUNTAIN_HERO_SKILLS_BY_ID).flat();
const knownName=id=>allGuides.find(s=>s.source_skill_id===id)?.name||id;
const publicPhysicalCard=card=>card&&typeof card==='object'&&!card.hidden&&!card.virtual&&typeof card.name==='string'&&card.name.length>0;
export function SgsMountainStatus({player,CardView=null}){
 if(!player)return null;
 const h=player.effective_hero||player.hero,guides=SGS_MOUNTAIN_HERO_SKILLS_BY_ID[h?.id],s=player.sgs_mountain||{},removed=Array.isArray(s.removed_skill_ids)?s.removed_skill_ids:[],fields=Array.isArray(s.fields)?s.fields.filter(publicPhysicalCard):[],faceDown=player.face_orientation==='face_down';
 if(!guides&&!removed.length&&!fields.length)return null;
 const current=h?.skill_ids||[],fieldOwner=guides?.some(g=>g.source_skill_id==='sgs.tuntian')||fields.length;
 return html`<section className="player-card-status sgs-mountain-status" aria-label="觉醒、田与技能状态" data-mountain-status=${player.seat}>
 <div className="card-status-flags"><span className="chip" data-mountain-current-hp=${`${hp(player.hp)}/${n(player.max_hp)}`}>当前体力 ${hp(player.hp)} / 实际上限 ${n(player.max_hp)}</span>${faceDown?html`<span className="chip" data-mountain-face="down">背面朝上 · 下个回合翻回并跳过整回合</span>`:html`<span className="chip" data-mountain-face="up">正面朝上</span>`}</div>
 ${guides?.filter(g=>g.awakening||g.acquired).map(g=>{const status=sgsMountainSkillState(g,player);return html`<p key=${g.id} data-mountain-skill-status=${g.source_skill_id} data-skill-state=${status.status}><strong>${g.name}</strong> · ${status.label}</p>`;})}
 ${fieldOwner?html`<details className="mountain-fields"><summary data-mountain-field-count=${n(s.field_count)}>公开田 ${n(s.field_count)} 张 · ${current.includes('sgs.tuntian')?'仅自己向外距离减少':'屯田当前不生效'}</summary><p>田面向所有角色公开，急袭用掉的田不再参与该次目标距离计算。</p><div className="eighth-form-choices">${fields.map((card,i)=>html`<section key=${card.uid||card.id||i} className="hero-skills" data-mountain-public-field=${i+1}><strong>田 ${i+1}</strong>${CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:html`<span>${card.name} · ${card.suit||'花色未提供'} ${card.rank??''}</span>`}</section>`)}</div>${fields.length!==s.field_count?html`<p role="status">部分公开田牌面尚未同步；仅显示已授权牌面，不从隐藏牌堆补取。</p>`:null}</details>`:null}
 ${removed.length?html`<p data-mountain-removed-skills=${removed.join(',')}><strong>断肠 · 已移除当前武将技能</strong>：${removed.map(knownName).join('、')}。没有回合末恢复；装备提供的能力保留。之后独立合法获得的新技能另行记录。</p>`:null}
 </section>`;
}
const submitOnce=(sent,key,busy,onRespond,value)=>{if(busy||sent.current===key)return;sent.current=key;let result;try{result=onRespond(value);}catch(error){sent.current=null;throw error;}if(result&&typeof result.then==='function'){const release=()=>{if(sent.current===key)sent.current=null;};Promise.resolve(result).then(release,release);}};
const legalMaterialID=id=>/^hand:[1-9]\d*$|^eq:(weapon|armor|offensive_horse|defensive_horse)$/.test(id);
const cardForOwnOption=(self,option)=>option.id.startsWith('hand:')?self.hand?.[Number(option.id.slice(5))-1]:option.id.startsWith('eq:')?self.equipment?.[option.id.slice(3)]:null;
/** Exact own H/E only; owner_seat is never used as a private card source. */
export function SgsMountainMaterialChoices({state,prompt,onRespond,busy=false,CardView=null}){
 const [selection,setSelection]=useState({key:null,ids:[]}),sent=useRef(null);
 if(!isSgsMountainPromptOwner(prompt,state)||prompt.kind!=='select_hand')return null;
 const key=prompt.prompt_id,need=prompt.min_count,allowed=(prompt.options||[]).filter(o=>legalMaterialID(o.id)),cancel=prompt.meta.mandatory?null:(prompt.options||[]).find(o=>['cancel','pass','0'].includes(o.id));
 const picked=(selection.key===key?selection.ids:[]).filter(id=>allowed.some(o=>o.id===id&&!o.disabled));
 const submit=value=>submitOnce(sent,key,busy,onRespond,value);
 const toggle=id=>setSelection(previous=>{const ids=previous.key===key?previous.ids:[];return {key,ids:ids.includes(id)?ids.filter(v=>v!==id):ids.length<need?[...ids,id]:ids};});
 return html`<section className="sgs-mountain-material-choices" aria-label="仅你可见的精确选牌"><p role="status" aria-live="polite">已选 ${picked.length} / ${need} 张${prompt.meta.mandatory?' · 必须完成':''}</p><div className="eighth-form-choices">${allowed.map(option=>{const card=cardForOwnOption(state.players.self,option),chosen=picked.includes(option.id);return html`<section key=${option.id} className="hero-skills" data-mountain-material=${option.id}><strong>${option.id.startsWith('hand:')?'自己的手牌':'自己的装备区'}</strong>${publicPhysicalCard(card)&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className=${`btn option ${chosen?'primary':''}`} data-option-id=${option.id} aria-pressed=${chosen} disabled=${busy||!!option.disabled||(!chosen&&picked.length>=need)} onClick=${()=>toggle(option.id)}>${chosen?'已选 · ':''}${option.label}</button></section>`;})}</div><div className="dialog-actions"><button type="button" className="btn primary" data-mountain-confirm="true" disabled=${busy||picked.length!==need} onClick=${()=>{if(picked.length===need)submit(picked.join(' '));}}>确认</button>${cancel?html`<button type="button" className="btn" data-option-id=${cancel.id} disabled=${busy||!!cancel.disabled} onClick=${()=>submit(cancel.id)}>${cancel.label}</button>`:null}</div></section>`;
}
/** Optional compact card faces never cover the native selectable button. */
export function SgsMountainChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){
 const sent=useRef(null);
 if(!isSgsMountainPromptOwner(prompt,state)||prompt.kind!=='choice'||prompt.meta.stage==='guanxing_order')return null;
 const submit=option=>{if(!option.disabled)submitOnce(sent,prompt.prompt_id,busy,onRespond,option.id);};
 return html`<div className="dialog-actions wrap sgs-mountain-choices">${(prompt.options||[]).map(option=>{let card=null;
  if(prompt.meta.stage==='qiaobian_cost'&&/^hand:[1-9]\d*$/.test(option.id))card=cardForOwnOption(state.players.self,option);
  if(prompt.meta.stage==='jixi_material'&&/^field:[1-9]\d*$/.test(option.id))card=state.players.self.sgs_mountain?.fields?.[Number(option.id.slice(6))-1];
  const showCard=publicPhysicalCard(card)&&CardView;
  const range=prompt.meta.stage==='jixi_material'?prompt.meta.field_previews?.find(p=>p.material_id===option.id):null;
  const noTarget=range&&Array.isArray(range.legal_targets)&&range.legal_targets.length===0;
  const targetName=seat=>[state.players.self,...(state.players.opponents||[])].find(p=>p.seat===seat)?.name||seat;
  return html`<section key=${option.id} className=${showCard?'hero-skills':''}>${showCard?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${option.id} disabled=${busy||!!option.disabled||noTarget} onClick=${()=>submit(option)}>${option.label}</button>${option.reason?html`<small>${option.reason}</small>`:null}${range?html`<p data-jixi-material-range=${option.id}>消耗后合法目标：${range.legal_targets?.length?range.legal_targets.map(t=>`${targetName(t.seat)} · 距离${n(t.distance)}`).join('；'):'无（该田无法完成此用牌）'}</p>`:null}</section>`;
 })}</div>`;
}
/** Reads only the already authenticated private prompt preview, never a deck. */
export function SgsMountainGuanxingChoices({state,prompt,onRespond,busy=false}){
 const sent=useRef(null);
 if(!isSgsMountainPromptOwner(prompt,state)||prompt.meta.stage!=='guanxing_order')return null;
 const m=prompt.meta,preview=Array.isArray(m.preview)?m.preview:[],ids=preview.map(c=>String(c.id)),selected=[...(m.selected_top||[]),...(m.selected_bottom||[])].map(String);
 if(preview.length!==m.count||new Set(ids).size!==ids.length||ids.some(id=>!/^([1-5])$/.test(id))||new Set(selected).size!==selected.length||selected.some(id=>!ids.includes(id)))return html`<p role="status">等待有效的私有完整牌序提示…</p>`;
 const label=id=>preview.find(c=>String(c.id)===String(id))?.label||'未提供牌面';
 const submit=option=>{if(!option.disabled)submitOnce(sent,prompt.prompt_id,busy,onRespond,option.id);};
 const tray=(title,list,description)=>html`<section className="guanxing-zone" aria-label=${title}><h3>${title}<span>${description}</span></h3>${list?.length?html`<ol>${list.map(id=>html`<li key=${id}>${label(id)}</li>`)}</ol>`:html`<p>尚未放牌</p>`}</section>`;
 return html`<section className="sgs-mountain-guanxing" aria-label="私有顶底牌序"><p className="guanxing-hint">仅你可见 · 当前安排${m.tray==='top'?'牌堆顶':'牌堆底'}；每区从上到下即先后摸到的顺序。</p><div className="guanxing-zones">${tray('牌堆顶',m.selected_top,'下次最先摸到')}${tray('牌堆底',m.selected_bottom,'原牌堆余牌之后先摸')}</div><div className="guanxing-remaining" aria-label="待排列的牌">${(prompt.options||[]).filter(o=>/^card:[1-5]$/.test(o.id)&&ids.includes(o.id.slice(5))&&!selected.includes(o.id.slice(5))).map(option=>html`<section className="guanxing-card" key=${option.id}><strong>${label(option.id.slice(5))}</strong><button type="button" className="btn option" data-option-id=${option.id} disabled=${busy||!!option.disabled} onClick=${()=>submit(option)}>下一张置于${m.tray==='top'?'顶部':'底部'}</button></section>`)}</div><div className="dialog-actions wrap">${(prompt.options||[]).filter(o=>['bottom','unchanged'].includes(o.id)).map(option=>html`<button type="button" className="btn" key=${option.id} data-option-id=${option.id} disabled=${busy||!!option.disabled} onClick=${()=>submit(option)}>${option.label}</button>`)}</div></section>`;
}
