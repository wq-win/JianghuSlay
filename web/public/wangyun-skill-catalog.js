/** Full historical mobile 王允 explanations, bound to stable source IDs.
 * A guide card is not evidence that its runtime has passed acceptance. */
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const HERO='sgs.mobile.hero.wangyun.20231207';
const source='版本：2023-12-07大陆移动版官方王允攻略；2026-10-15仅复核公开武将页。2023历史核心＋JH01–JH12江湖规则重建，已接入并测试；2026当前客户端与12项原生边界未全面核验；未完成整个原版模式。';
const input='按当前提示点选；键盘可Tab定位、Enter确认。提交前取消不扣材料或次数；陈旧或重复提交必须由引擎重新核验，不重复结算。';
const lianji={
 id:'wangyun-lianji',source_skill_id:'sgs.mobile.wangyun.lianji',name:'连计',type:'active',icon:'wangyun-lianji',initial:true,
 summary:'每出牌阶段1次，令A用随机武器并对B用五选一牌',
 condition:'自己的空闲出牌阶段，仍有连计，本阶段未用，且有两名不同的其他存活角色。1v1不能发动。',
 timing:'自己真实出牌阶段；按顺序选择使用者A，再选强制目标B',
 cost:'发动不交牌、不弃牌、不失体力。后续火攻若要造成伤害，仍须由A弃同花色手牌。',
 limit:'每个真实出牌阶段限1次；A、B均不可是自己，也不能是同一人。发动提交后占用次数。',
 effect:'A先使用当前牌堆中随机的一张实体武器；若选中基础青釭来源实体，永久转为七宝刀后使用。然后A视为使用普通杀、决斗、火攻、南蛮入侵、万箭齐发之一，B为所需目标。该攻击无实体材料。每次该牌且实际伤害来源为A的正数实际扣血，给王允累计同等数量连计标记。',
 targets:'有顺序的两名其他角色。南蛮和万箭仍覆盖A以外所有合法角色，包括王允；不是只打B，也不按队伍排除。',
 phase_use:'依次选A（用武器、用攻击牌者）和B（要求的目标）。不是王允本人使用或造成该牌的伤害；没有结束后把武器交回王允的步骤。',
 response:'普通杀需闪、决斗轮流打杀、火攻由B展示再由A弃同花色牌、南蛮需杀、万箭需闪；锦囊照常开无懈窗口，防具与A的技能照常处理。',
 disabled_reason:'非自己空闲出牌阶段、已失去连计、本阶段已用、其他存活角色不足两名、本人死亡或仍有未处理响应时不可用。',
 notes:[source,
  '计标记按实际扣血点数：一次扣2血加2；护甲承受、完全防止、单纯流失体力不加。决斗由B反击造成的伤害不加；每次完整伤害后立即检查谋逞。',
  'JH02–JH04：武器只从当前摸牌堆合法实体均匀抽取，不为找武器重洗；无武器/废栏则跳过装备继续合法攻击。五攻击先筛合法再均匀抽名。普通杀对B免距离、不占正常杀次数；其他禁令保留，无合法牌名不补扣血或退次数。上述随机与失败调度尚无原生实测。',
  'JH08：同一根用牌且来源仍为A的连环/转移扣血算入；独立追加技能/武器伤害不算。觉醒移除连计后，已提交的这张牌仍结算。',
  '七宝刀保留同一实体UID和实际花色点数，攻击范围2、杀无视防具、对伤害时满血目标杀伤害+1；离场、重洗、死亡、觉醒均不还原。只转换有基础青釭来源的选中实体。',
  '攻击无材料，不给奸雄凭空造牌；前面使用的武器仍是真实实体。JH11–JH12的别名与血/毒杀兼容是本作政策。',input],
 hooks:['own_play','after_damage'],callbacks:['wangyun_player_lianji','wangyun_resolve_lianji','wangyun_after_damage'],activeId:'连计',
 local_policy_ids:['JH02','JH03','JH04','JH08','JH11','JH12'],source_gap_ids:['G01','G03','G04','G08','G09','G10','G11','G12']
};
const moucheng={
 id:'wangyun-moucheng',source_skill_id:'sgs.mobile.wangyun.moucheng',name:'谋逞',type:'locked',icon:'wangyun-moucheng',initial:true,awakening:true,
 summary:'伤害后标记≥3立即觉醒：上限+1、回1，连计换矜功',
 condition:'本人存活、还未觉醒；连计标记累计达到3或更多。按扣血总点数，不按发动次数、目标数或伤害事件个数。',
 timing:'每次伤害结算完成后立即检查，在下一名AOE目标或下一效果之前',
 cost:'无需弃牌、交牌或消耗标记；觉醒是满足条件后必须执行的替换',
 limit:'整局只觉醒1次；标记可以超过3，不要求恰好3，不等待下回合准备阶段。',
 effect:'依次令当前体力上限增加1，按正常回复规则回复1体力，失去连计并获得完整矜功。不是直接把血量改为4/4；回复仍受当前上限与正常修正约束。',
 targets:'只改变本人。此前A使用的牌继续结算，不能因失去连计而中断。',
 phase_use:'没有主动按钮。若自己出牌阶段还在进行，正常获得矜功后可按其独立阶段额度使用，这是本作已说明的获得技能处理。',
 response:'觉醒不产生杀/闪响应；增加上限、回复和获得/失去技能分别经过正常事务。',
 disabled_reason:'标记不足3、已经觉醒、本人已死亡，或没有合法伤害后窗口时不会再次觉醒。',
 notes:[source,
  '例：已有2枚标记，一次符合条件的伤害实际扣2血，先累积为4，再立即觉醒；并非只加1枚或等待AOE整张结束。',
  '保留已觉醒记录与惰性谋逞说明，不凭空消耗连计标记；不能重复加上限、回复或获得技能。',
  'JH08明确嵌套伤害谱系与一次性觉醒收据；原生连环、转移及少见调度仍有G08空白。',input],
 hooks:['after_damage'],callbacks:['wangyun_after_damage','wangyun_awaken'],activeId:null,
 local_policy_ids:['JH08'],source_gap_ids:['G08','G10']
};
const jingong={
 id:'wangyun-jingong',source_skill_id:'sgs.mobile.wangyun.jingong',name:'矜功',type:'active',icon:'wangyun-jingong',initial:false,acquired:true,acquired_by:'sgs.mobile.wangyun.moucheng',
 summary:'觉醒获得；每出牌阶段1次，杀/装备当候选锦囊',
 condition:'已经实际获得矜功，自己的空闲出牌阶段未用过，且有一张可用杀类牌或任意类型装备，以及候选锦囊的合法目标。初始王允没有此技能。',
 timing:'自己的真实出牌阶段；本回合结束阶段另检查未造成伤害的失血义务',
 cost:'用恰好1张本人的杀类牌或任意类型装备作转化材料，没有再弃1张的额外代价。本作JH05允许手牌与自己装备区，不允许任意手牌、判定牌、别人牌或未开放私有牌堆。',
 limit:'每个真实出牌阶段限1次；实际提交才计次。菜单为2个不同普通锦囊名加1个专属名，本阶段固定；取消、重开、读档不刷新。',
 effect:'从本阶段3个候选中选1种，保留素材实体、有效花色和点数，作为该锦囊正常使用。普通池11名：过河拆桥、顺手牵羊、无中生有、决斗、借刀杀人、南蛮入侵、万箭齐发、五谷丰登、桃园结义、火攻、铁索连环；专属是美人计或笑里藏刀。若本回合使用后，本人整回合没造成过伤害，在结束阶段失去1体力。',
 targets:'按所选锦囊自己的合法目标与距离规则；全体锦囊照常覆盖所有合法角色。不自动免距离，不按阵营把目标缩成对手。',
 phase_use:'依次选固定候选、1张材料及该牌目标。不能选择无懈可击、延时锦囊或其他模式/游戏的任意锦囊；铁索连环须有合法目标，不能重铸。',
 response:'矜功是主动使用，不是响应或打出。锦囊照常可被无懈，成功无懈不退材料、次数或结束阶段义务。普通牌自身后续成本仍按原规则支付。',
 disabled_reason:'尚未获得矜功、本阶段已用、没有合法杀/装备材料、所有固定候选当前均不合法、非自己空闲出牌阶段或存在未完成响应时不可用。',
 notes:[source,
  '初始只有连计、谋逞；矜功作为觉醒后获得技能完整保留在图鉴中。技能是否实际可用由当前有效技能ID与引擎可用性决定，不按角色显示名猜测。',
  'JH01–JH02：11种名称由同日官方攻略的数量与基础/军争牌堆重构，未找到逐名专用抽样表。2普通不重复、专属等概率及阶段缓存是本作明示随机政策；不合法候选置灰，不能借取消重抽。',
  '美人计：目标须是其他有手牌男性；各女性先取其1手牌，再给使用者1手牌，最后当前手牌较少者对较多者造成1普通伤害，相等无伤害。没有女性仍比较。JH06采用目标空手后仍尝试给自有手牌；这一多人边界未确认为原生。',
  '笑里藏刀：对一名其他角色，先摸min(已损失体力,5)张，后由使用者造成1普通伤害；满血摸0仍受后续伤害。美人计、笑里藏刀自身无独立阶段上限，初始牌堆均0实体。',
  '五谷丰登：公开亮出存活人数张牌，包括自己在内各合法目标按行动序取1张，余牌弃置。桃园结义：所有合法目标各正常回复1，满血无回复量。两者无懈只抵消当前目标。',
  'JH09：发动前本回合已经造成的伤害也算；A通过连计造成的伤害不算本人，美人计反向打自己的伤害也不算。伤害事件与实际扣血分开记账；未造成伤害的代价是体力流失，不是伤害。同回合额外出牌阶段不叠多次结束失血；跳结束阶段不另造回合末失血。',
  'JH10：仅1个真实材料正常进入处理区；奸雄等回收原来的杀/装备，不能凭空拿新锦囊。材料未被移走才弃置，转化结束不永久改名。JH05–JH07、JH09–JH10均有明确本作时序，不能视为当前原生实测。',input],
 hooks:['own_play','after_damage','on_end_phase'],callbacks:['wangyun_player_jingong','wangyun_resolve_jingong','wangyun_end_phase'],activeId:'矜功',
 local_policy_ids:['JH01','JH02','JH05','JH06','JH07','JH09','JH10'],source_gap_ids:['G01','G02','G05','G06','G07','G10','G11','G12']
};
const tested={source_status:'verified',implementation_status:'tested',production_integration_status:'integrated-tested-historical-reconstruction',source_coverage:false,current_client_rules_verified:false,current_client_hp_verified:false,source_only_exact_for_every_edge:false};
for(const entry of [lianji,moucheng,jingong])Object.assign(entry,tested,{source_date:'2023-12-07',source_urls:['https://www.sanguosha.cn/pc/guide-info-163.html','https://www.sanguosha.cn/pc/hero-detail-213.html']});
/** Register the complete guide. `initial:false` means explanation only until acquired. */
export const WANGYUN_HERO_SKILLS_BY_ID=freeze({[HERO]:[lianji,moucheng,jingong]});
export const WANGYUN_INITIAL_HERO_SKILLS_BY_ID=freeze({[HERO]:[lianji,moucheng]});
export const WANGYUN_ACQUIRED_SKILLS_BY_ID=freeze({[jingong.source_skill_id]:jingong});
export const WANGYUN_SOURCE_SKILLS_BY_ID=freeze(Object.fromEntries([lianji,moucheng,jingong].map(s=>[s.source_skill_id,s])));
/** For match views, call with the authoritative current effective skill ID list.
 * This never infers an acquired skill from a display name or a portrait. */
export function wangyunSkillCardsForIds(ids){return Array.isArray(ids)?ids.filter((id,i)=>ids.indexOf(id)===i).map(id=>WANGYUN_SOURCE_SKILLS_BY_ID[id]).filter(Boolean):[];}

/** Public, static prompt explanations. Parent must still render ONLY the current
 * prompt actor's private options and let the engine validate every submission. */
export const WANGYUN_PROMPT_CONTEXTS=freeze({
 lianji_first:{skill_id:lianji.source_skill_id,title:'连计 · 先选用牌者A',text:'A将使用牌堆武器并使用随机攻击牌。再选另一名其他角色B。现在取消不计次。'},
 lianji_second:{skill_id:lianji.source_skill_id,title:'连计 · 再选要求目标B',text:'B不可是自己或A。A才是用牌者；若抽中南蛮/万箭，范围仍包括所有合法其他角色。'},
 jingong_menu:{skill_id:jingong.source_skill_id,title:'矜功 · 选择本阶段固定候选',text:'2个普通名＋1个专属名；本阶段取消、重开或读档不会刷新。不合法选项不能选。'},
 jingong_material:{skill_id:jingong.source_skill_id,title:'矜功 · 选择1张真实材料',text:'仅自己手牌或装备区的一张杀类牌/任意装备；保留花色点数。装备离区效果先完成。'},
 jingong_target:{skill_id:jingong.source_skill_id,title:'矜功 · 选择合法目标',text:'按所选锦囊自己的距离和目标要求；不免距离，铁索不可零目标重铸。'},
 wangyun_trick_target:{card_names:['美人计','笑里藏刀'],title:'矜功专属锦囊 · 选择目标',text:'美人计须为其他有手牌男性；笑里藏刀可选任意其他存活角色，满血也可。'},
 meirenji_obtain:{card_names:['美人计'],title:'美人计 · 盲取1张手牌',text:'只显示目标暗手牌编号，不显示牌名、花色、点数或实体ID。随后交给用牌者1张当前手牌。'},
 meirenji_give:{card_names:['美人计'],title:'美人计 · 交给使用者1张手牌',text:'可交刚取得的牌或其他本人当前手牌。目标空手后仍尝试给牌是JH06本作裁定。'},
 harvest_choose:{card_names:['五谷丰登'],title:'五谷丰登 · 选择1张公开牌',text:'从当前尚在公开牌池的牌中选1张入手；已被别人取得的牌不能再选。'},
});
