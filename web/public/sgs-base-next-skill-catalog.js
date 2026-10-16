/** Base identity skill copy. Mechanics provenance is catalog + declared historical tiers,
 * never a claim that the current executable mobile client was tested. */
const freeze = value => { if(value && typeof value==='object' && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value; };
const sourceNote='来源分层：大陆移动版基础身份目录（2026-10-15快照）；历史台湾标准FAQ为跨产品参考，规则镜像为次级资料。未核验2026当前客户端。';
export const SGS_BASE_NEXT_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.sima-yi':[
  {id:'sgs-base-next-fankui',source_skill_id:'sgs.fankui',name:'反馈',type:'optional',icon:'sgs-base-next-fankui',
   summary:'每次受伤后，可获得实际来源的1张手牌或装备',
   condition:'受到正数伤害，完整处理濒死与救援后自己仍存活；实际伤害来源尚存活且有可获得的手牌或装备。',
   timing:'一次实际伤害事件及救援结束后；在后续受伤技能继续前处理当前选择',
   cost:'无牌或体力代价；可放弃。不是用一张牌交换，也不从牌堆额外摸牌。',
   limit:'每次伤害事件一次，受2点或3点伤害也只取1张；不同伤害事件可分别发动，无回合上限',
   effect:'选择实际伤害来源的1张手牌或装备，移入自己的手牌。暗手牌只选背面编号，装备可明确选择；不能取判定区牌。获得装备不是立即装备。',
   targets:'真实伤害来源，不限敌友或距离；自身为来源时，可将自己的装备移入自己的手牌',
   notes:[sourceNote,'SM1/SM2显式适配：来源中途死亡不追回已清理牌；自身手牌移回自身没有合法移动收益，不提供该无效选择。自身来源可触发依据历史台湾FAQ，自身装备入手另有历史规则镜像印证。','体力流失、被完全防止的0伤害、无来源伤害均不产生反馈取牌；改判者不会因此成为手捧雷的伤害来源。','本次放弃不影响下一次伤害事件；不会套用界版每点伤害取一次。触屏点选或键盘确认当前弹窗，Esc放弃；提交中的重复输入不二次取牌。'],
   hooks:['after_damage'],callbacks:['sgs_after_damage_fankui'],activeId:null},
  {id:'sgs-base-next-guicai',source_skill_id:'sgs.guicai',name:'鬼才',type:'optional',icon:'sgs-base-next-guicai',
   summary:'判定生效前，用1张手牌替换判定牌',
   condition:'存在已翻开但尚未生效的真实判定；自己仍有合法手牌，且本次判定尚未用过或放弃自己的改判机会。',
   timing:'判定牌翻开后、生效前；按当前行动者起的统一座序轮到自己时',
   cost:'打出1张本人手牌作新判定牌，任何花色均可；装备区、判定区及任意私有牌堆不可用',
   limit:'每个独立判定每人一次机会；选过或放弃后，不因别人再次改判而重新询问。新判定可再发动，无回合上限。',
   effect:'精确的1张手牌进入本次判定处理区，旧判定牌弃置。本人不获得旧牌；继续同一判定，以最终判定牌在受判者上下文中的有效花色、点数生效。',
   targets:'当前判定，不另选受判人物；全场合法判定均可在自己的改判窗口处理',
   notes:[sourceNote,'SM3/SM4：这是替换而非交换；保留原判定事件及原伤害来源，不把改判者当作手捧雷来源。','界司马懿的装备改判权限不属于基础鬼才；与商鞅变法因此保留独立人物。持有黑色装备但无手牌时不可鬼才。','选择手牌前取消/陈旧选项不扣牌；提交后只移动一次。触屏点牌，键盘按可见选项确认，Esc放弃本次机会。'],
   hooks:['judgment_before_effective'],callbacks:['sgs_on_judgment_guicai'],activeId:null}
 ],
 'sgs.adapted.base.hero.da-qiao':[
  {id:'sgs-base-next-guose',source_skill_id:'sgs.guose',name:'国色',type:'active',icon:'sgs-base-next-guose',
   summary:'1张方块手牌或装备当画地为牢',
   condition:'自己的合法出牌窗口，有方块手牌或装备，并有未被同名有效延时牌占据判定区的合法其他目标。',
   timing:'自己的空闲出牌阶段；延时牌按共享画地为牢时机判定',
   cost:'1张有效方块的本人手牌或装备区牌作为唯一实体素材；不允许判定区牌。选素材/目标时取消不付费。',
   limit:'基础版没有独立每回合或每阶段次数上限；无额外摸牌，不提供移除已有延时牌的分支',
   effect:'将素材作为乐不思蜀的本作对应牌画地为牢，放入目标判定区。正常判定时非红桃跳过其整个出牌阶段，红桃无跳过；不跳过摸牌、弃牌和结束阶段。',
   targets:'一名其他存活且可成为画地为牢目标的角色；无距离限制，不可自选，不可重复放同名有效延时牌',
   notes:[sourceNote,'DQ1：国色复用共享画地为牢的用牌、无懈与判定流程；历史授权FAQ的无懈在判定前时机与本作共享牌选择分开标注，不为国色另创一套窗口。','DQ2：素材印刷身份不变，在判定区显示画地为牢功能；若被取得入手，恢复原牌功能。装备素材实际离区一次，并处理正常失装触发。','没有方块素材、没有合法目标、已经进入其他响应或当前忙碌时按钮显示相应原因；不是因无手牌就忽略可用的方块装备。','触屏点击国色按钮；键盘使用按钮所示快捷键。按提示选择合法目标和素材，Esc在付款前取消；无效或陈旧选项不扣牌。'],
   hooks:['own_play'],callbacks:['sgs_resolve_guose'],activeId:'国色'},
  {id:'sgs-base-next-liuli',source_skill_id:'sgs.liuli',name:'流离',type:'optional',icon:'sgs-base-next-liuli',
   summary:'杀响应前弃1牌，将此目标分支转给自己范围内的另一角色',
   condition:'成为杀的目标，尚未开始闪或防具响应；存在弃掉1张手牌/装备后仍在本人攻击范围内的合法接收者。',
   timing:'当前杀指定自己后，自己的闪、双闪或玉如意判定之前',
   cost:'弃1张本人手牌或装备。合法性按该牌移除后的装备与距离计算；弃武器/进攻马不能借用已失去的射程。',
   limit:'每个当前杀目标分支的一次可选转移；没有回合上限。自己闪后武器发起的新杀可以有新的流离机会。',
   effect:'把当前杀对自己的这个分支转给接收者，保留原杀使用者、伤害来源、属性与加成。接收者重新走自身目标与响应、防具流程；不会让大乔成为杀的使用者。',
   targets:'本人弃牌后攻击范围内的一名存活角色，可为队友；不能是自己或原杀使用者，且仍须满足原杀的非距离目标禁制',
   notes:[sourceNote,'DQ3：只忽略原使用者到新目标的距离；空城等目标禁制仍阻止转移，仁王盾等防具是转移后的结算防御。','已经开始闪响应、双闪已交1张或玉如意判定失败后，不能回头流离。','DQ4：台湾2021标准FAQ允许自己闪后青龙追加新杀再流离；这与英雄杀西施沉鱼的历史追加杀限制不同。未声称2026大陆客户端这一边界实测。','DQ5：历史规则允许接收者已是另一目标时保留两个独立分支；复杂排序采用本作事件合同。选择素材/接收者时触屏或键盘确认，Esc放弃且不扣牌。'],
   hooks:['become_slash_target_before_response'],callbacks:['sgs_before_sha_target_liuli'],activeId:null}
 ],
 'sgs.adapted.base.hero.zhen-ji':[
  {id:'sgs-base-next-luoshen',source_skill_id:'sgs.luoshen',name:'洛神',type:'optional',icon:'sgs-base-next-luoshen',
   summary:'准备阶段判定，最终黑牌立即获得，再决定是否继续',
   condition:'自己的准备阶段；初次可不发动，每次最终黑色判定生效并获牌后可选择继续或停止。',
   timing:'自己的准备阶段，早于延时牌判定与正常摸牌；每次黑牌立即入手后再询问下一次',
   cost:'无牌、无体力代价；发起后成功黑牌按效果获得，不另加可拒绝获牌步骤',
   limit:'无固定数值上限；最终黑色且本人继续即可再判，非黑色立即结束。不能在准备阶段已结束后重新开始。',
   effect:'执行包含合法改判窗口的真实判定。最终有效黑色时，精确的最终判定实体直接进入本人手牌，再选择是否继续；非黑色不获得并按普通判定清理。',
   targets:'自己为受判者；没有其他人物目标',
   notes:[sourceNote,'ZJ1/ZJ2：用最终有效判定牌而非最初翻出的牌。红改黑可获得替换牌，黑改红不能拿旧黑牌；成功黑牌不先落弃牌，不能重复获得。','正常摸牌阶段照常进行；洛神不是替换摸牌，所得牌按普通手牌上限弃置，没有界甄姬的不计上限。','仅实际适用于受判者的花色效果生效；别的角色拥有红颜不改变甄姬判定。','ZJ4：赵飞燕玉步历史来源未明确每次黑牌的获牌时点，本地归一相同不等于完整来源相同；保持独立身份。国战集中获牌不能静默套到本身份版。','触屏确认/停止；键盘使用当前弹窗的确认与Esc放弃。每次黑牌入手后都可停，停止不收回已得牌；连续选择不会额外重复一次判定。'],
   hooks:['prepare_phase','judgment_after_effective'],callbacks:['sgs_on_prepare_luoshen'],activeId:null},
  {id:'sgs-base-next-qingguo',source_skill_id:'sgs.qingguo',name:'倾国',type:'response',icon:'sgs-base-next-qingguo',
   summary:'合法闪窗口中，将1张有效黑色手牌当闪',
   condition:'当前要求且允许使用或打出闪，自己有至少1张有效黑色手牌；禁闪时不能绕过禁制。',
   timing:'杀、万箭齐发等合法闪的使用/打出响应窗口；空闲出牌阶段没有主动闪按钮',
   cost:'每张闪消耗1张有效黑色手牌；手中装备类型牌可用，已装备或判定区的黑牌不可用',
   limit:'无独立回合次数上限；双闪逐张响应，需要两个合法素材，一张素材不能同时满足两闪',
   effect:'将精确的1张素材作为虚拟闪，执行当前要求的闪使用或打出事件。保留素材花色、点数和物理ID，正常移牌/清理一次，不改写素材的印刷名称。',
   targets:'当前响应所指定的杀或范围效果；不能另选目标，也不是直接取消任意伤害',
   notes:[sourceNote,'ZJ3：有效颜色决定素材资格；获得本技能的形态也按当前有效颜色检查，不把已经视为红色的黑桃硬算黑色。','多张可用牌时按弹窗选素材；选择或响应放弃均可Esc。已提交第一张闪后第二张不足，不退第一张。','响应牌用尽、没有有效黑手牌、禁闪或不在闪窗口均不提供虚假的发动按钮。基础倾国不含额外摸牌、装备区素材或全局伤害免疫。'],
   hooks:['shan_use','shan_play'],callbacks:['sgs_commit_qingguo_response'],activeId:null}
 ]
});

/** Archived source identity only: no fourth selectable hero or extra Chen Sheng skill. */
export const SGS_BASE_NEXT_SOURCE_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.zhang-liao':[{id:'sgs-base-source-tuxi',source_skill_id:'sgs.tuxi',name:'突袭',type:'optional',icon:'yxs-next-uprising',
 summary:'放弃正常摸牌，改取至多两名其他角色各1张手牌',condition:'自己的正常摸牌阶段存在合法窗口，至少一名其他存活角色有手牌；不比较双方手牌数。',
 timing:'自己的正常摸牌阶段，普通摸牌执行前',cost:'替换本次完整正常摸牌，发动后不保留普通牌堆摸牌；无其他弃牌成本',limit:'本次摸牌操作一次选择；选择1至2名不同目标，每人仅1张，不随摸牌数增加目标上限',
 effect:'可选择至多两名有手牌的其他存活角色，从每人手牌盲取1张；装备区、判定区不能取。可以放弃技能而正常摸牌。',targets:'其他存活且有手牌的角色，包含队友，不含自己，无距离限制',
 notes:['当前可选人物仍为陈胜，完整来源对比后将张辽列作合并来源；这条只展示归档三国杀标准身份突袭，不在陈胜面板新增技能。','基础突袭不是界版按少摸牌数取牌，不要求目标手牌比自己多；跳过整个摸牌阶段时没有发动窗口，阶段外摸牌不替换。','共享摸牌数被其他机制改成0时是否还有原作窗口未获直接来源证明，沿用明示本作合同，不能称当前移动版已核验。','魏、男性、4血保留为张辽独立来源身份；官方OL标准hp与移动版BWIKI交叉印证。未核验2026当前客户端。','触屏选择不同目标，键盘Tab/Enter操作；付款前Esc取消。对方手牌始终只显示暗牌编号。'],hooks:['draw_phase'],callbacks:['before_draw_qiyi'],activeId:null}]
});
