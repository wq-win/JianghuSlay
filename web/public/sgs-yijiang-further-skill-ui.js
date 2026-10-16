/** V31 selected-source guides, exact callback prompts, and public-only status. */
import {html} from 'htm/react';
import {useRef} from 'react';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='来源：三国杀移动版基础身份官网完整目录及同产品经典字段，2026-10-15选择快照、2026-10-16读取，含隐藏固有技能面板。未实测2026当前移动客户端；不混入界、谋、OL、国战或其他改版。';
const input='触屏点选，或Tab定位、Enter确认；只有可取消的提示可按Esc退出。重复或过期输入不重复结算。';
const record=(id,name,body)=>({id:`sgs-yijiang-further-${id}`,source_skill_id:`sgs.${id}`,name,type:'optional',icon:`sgs-yijiang-further-${id}`,activeId:null,...body,notes:[source,...body.notes,input]});
export const SGS_YIJIANG_FURTHER_HERO_IDENTITIES=freeze({
 'sgs.adapted.base.hero.gu-yong':{name:'顾雍',hp:3,faction:'吴',gender:'男'},
 'sgs.adapted.base.hero.xiahou-shi':{name:'夏侯氏',hp:3,faction:'蜀',gender:'女'},
 'sgs.adapted.base.hero.xu-shu':{name:'徐庶',hp:3,faction:'蜀',gender:'男'},
 'sgs.adapted.base.hero.quan-cong':{name:'全琮',hp:4,faction:'吴',gender:'男'}
});
export const SGS_YIJIANG_FURTHER_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.gu-yong':[
 record('shenxing','慎行',{type:'active',activeId:'sgs.shenxing',summary:'出牌阶段，弃自己恰好两张手牌／装备，摸一张；不限次',condition:'自己的真实出牌阶段，仍有技能和至少两张可弃的手牌／装备。',timing:'选恰好两张费用 → 原子弃置并结算真实失牌 → 正常摸一张',cost:'恰好两张自己的可弃手牌或装备；可混选，不含判定区和特殊牌堆',limit:'出牌阶段不限次数；没有每回合一次或只能两次的限制',effect:'两张费用一起提交，然后摸一张。弃装备触发其正常离区效果；如费用引发失血、求救或其他技能，先完成共享结算。取消或非法输入不支付，已提交费用不因后续中断退款。',targets:'仅自己支付并摸牌，不需要伤害目标',phase_use:'点慎行，依次选择恰好两张材料。明确显示已选数量；不是拿两张牌当杀。',response:'提交前可取消；不得选同一实体两次。反复点击只提交一次。',disabled_reason:'非自己的真实出牌阶段、已失技／死亡、当前正在结算、可弃H/E不足两张。',notes:['H1–H4：原子费用、装备离区、死亡中断、耗尽牌堆属于共享宿主规则。不限次仍要求每次重新支付两张。'],hooks:['own_play_phase','atomic_exact_cost'],callbacks:['sgs_player_shenxing','sgs_shenxing_execute','sgs_shenxing_available']}),
 record('bingyi','秉壹',{summary:'结束阶段可公开全部手牌；同色时选至多X人各摸一张，可含自己',condition:'自己的真实结束阶段，仍有技能；先自愿展示全部手牌，再检查颜色。',timing:'真实结束阶段 → 可选公开全部手牌快照 → 同色检查 → 选至多X人 → 按行动顺序各摸一张',cost:'公开当时全部手牌，不弃置、不使用；X固定为本次展示的手牌数',limit:'每个真实结束阶段一次机会；选择0至X名不同角色，每人只摸一张',effect:'红色全部相同或黑色全部相同时，可选至多X名存活角色各摸一张。自己、队友、敌人均可选。不同颜色也可自愿公开，但无人因此摸牌。不能以同类别替代同色；公开不是把牌移走。',targets:'任意至多X名不同存活角色，不限距离、势力或性别，可包含自己，也可选零人',phase_use:'无自由出牌按钮。先确认公开，再用多选目标及确认按钮，显示已选／上限；新摸的牌不加入公开快照。',response:'展示前可拒绝；展示后仍可选择零目标，但已公开内容不会撤销。混色不会额外奖励。',disabled_reason:'未进入自己结束阶段、该阶段已处理、死亡或失技。空手X=0由H8隐藏无效果展示。',notes:['H7/H8：只显示已提交的不可变公开快照，永不把后来摸到的暗牌加入。无色实体按实际颜色比较，不当黑色；空手隐藏是宿主策略。'],hooks:['on_end_phase','whole_hand_public_reveal','bounded_multi_target'],callbacks:['sgs_on_end_phase_bingyi','sgs_bingyi_available']})
 ],
 'sgs.adapted.base.hero.xiahou-shi':[
 record('qiaoshi','樵拾',{summary:'他人结束阶段，若双方手牌数相同，可令自己与该角色各摸一张',condition:'另一名存活角色的真实结束阶段，双方当前手牌数严格相等，自己仍持有技能；0与0也相等。',timing:'其他角色真实结束阶段开始 → 按行动顺序逐持有者检查 → 本人可选 → 双方各摸一张',cost:'无费用',limit:'每个其他角色结束阶段一次机会；不是自己结束阶段，也不是每点伤害触发',effect:'发动则自己和当前结束阶段角色各正常摸一张。敌人也可以。前一位持有者摸牌后，后面持有者按新手牌数重新检查；不是同时缓存相等结果。',targets:'自己与正在结束阶段的另一角色；不任意挑第三人、不限距离或性别',phase_use:'没有主动按钮。本人收到提示，看见双方当前手牌数量，决定同意或拒绝。',response:'技能持有者作决定，回合主人不能代选；阶段被完整跳过时没有机会。',disabled_reason:'自己结束阶段、双方手牌数不同、任一人退场、已失技、当前机会已处理。',notes:['H2/H3：死亡中断与双方摸牌按共享行动顺序；不能读取他人暗牌内容。H6：复制完整技能后仍由当前持有者触发。'],hooks:['on_any_end_phase_start'],callbacks:['sgs_on_any_end_phase_start_qiaoshi']}),
 record('yanyu','燕语',{type:'active',activeId:'sgs.yanyu',summary:'不限次重铸手中杀；本出牌阶段至少两张，阶段结束可令一名男性摸两张',condition:'重铸：自己的真实出牌阶段有合法实体手牌杀。奖励：同一真实出牌阶段内已重铸至少两张杀。',timing:'出牌阶段逐张真实重铸并摸一张 → 同一出牌阶段结束时检查累计 → 可选一名男性摸两张',cost:'每次将一张真实手牌杀以重铸原因移入弃牌堆，然后摸一张',limit:'重铸不限次；阶段奖励至多一次，2／3／4／5张均只给一次摸两张；新真实出牌阶段归零',effect:'重铸不算使用杀，不占杀次数、没有目标或伤害，不算弃置，落英／纵玄等弃置限定技能不因此拿牌；仍是真实失手牌。阶段结束累计至少两张时，可令一名男性摸两张；不会每两张立即奖励。',targets:'重铸只用自己的实体手牌。奖励可选任意存活男性，队友敌人均可；原生夏侯氏为女性不能选自己，男性持有者复制后可选自己',phase_use:'点燕语并选择一张杀，独立重铸按钮不会走出杀。牌面公开，替换摸牌保持私有；状态显示当前真实阶段累计。',response:'重铸提交前可取消，阶段奖励可放弃。用杀、响应杀、弃杀或仅展示杀不增加计数；两个阶段各一次不能凑奖励。',disabled_reason:'非本人出牌阶段、无实体手牌杀、失技或退场；结束阶段计数0／1时无奖励。',notes:['H5：普通／火／雷杀为原生类别；本作血／毒／刺杀属于明示跨游戏扩展。用牌时的临时转化不能凭空制造可重铸手牌。H6：次数按角色与真实阶段持久化，失技重获不刷新。'],hooks:['own_play_phase','semantic_recast','on_play_phase_end'],callbacks:['sgs_player_yanyu','sgs_yanyu_execute','sgs_on_play_phase_end_yanyu']})
 ],
 'sgs.adapted.base.hero.xu-shu':[
 record('wuyan','无言',{type:'locked',summary:'防止本人实际造成或受到的全部锦囊牌伤害，非伤害锦囊仍生效',condition:'仍持有无言，当前伤害包实际来源是本人或实际承伤者是本人，且属于锦囊伤害渠道。',timing:'真实锦囊伤害结算中 → 整包防止 → 不产生已造成／已受到伤害后续触发',cost:'无费用，锁定生效',limit:'每个合格伤害包均生效；没有回合、次数或点数上限',effect:'防止整包锦囊伤害，不是减一点，也不改为流失体力。摸牌、拆牌、顺牵、延时与连环等非伤害效果照常。无来源闪电、锦囊来源传导进入本人也防止；借刀导致的杀仍属杀伤害，不防止。',targets:'按最终实际伤害来源与承伤角色判断，不把原用牌者冒充实际来源',phase_use:'无主动按钮，锁定标签说明防止事件。自己用南蛮而孟获替代成为伤害来源时，自己的来源分支不阻止对别人的伤害。',response:'仍照常处理锦囊合法使用、目标与响应；无言不是所有锦囊无效。独立技能伤害和体力流失不受此技能防止。',disabled_reason:'失技／退场；非锦囊渠道、借刀后的杀、独立技能伤害或已经改为体力流失，不符合防止条件。',notes:['H1–H3：渠道快照及原用牌者／实际来源分开记录；宿主共享伤害处理顺序不是当前原生客户端认证。被防止的伤害不触发伤害后技能。'],hooks:['before_trick_damage','actual_damage_source'],callbacks:['sgs_before_source_damage_wuyan','sgs_before_receiving_damage_wuyan']}),
 record('jujian','举荐',{summary:'结束阶段弃一张非基本手牌／装备，另一角色自选摸两张、回复一点或复原',condition:'自己的真实结束阶段，有一张可弃非基本H/E牌及一名其他存活角色。',timing:'结束阶段 → 选非基本费用和另一角色 → 弃置提交 → 由受荐者选择效果',cost:'恰好一张自己的非基本手牌或装备区牌；基本牌、判定区、特殊牌堆不可用',limit:'每个真实结束阶段一次可选机会',effect:'受荐者选一项：摸两张；受伤时回复一点（不超过实际上限）；复原为正面且解除连环。复原不清除延时牌、技能标记、已用限定技，不改当前体力或上限；正面不会被翻成背面。',targets:'恰好一名其他存活角色，不限距离、势力、队友敌人；由该角色自己决定效果',phase_use:'没有出牌阶段主动按钮。费用确认前可取消；支付后受荐者必须完成一项合法选择，推荐者不能替选。',response:'满血不可选回复，有同产品FAQ依据。已经正面且未连环时本作界面隐藏无变化复原；这只是H11展示策略，核心复原仍幂等。',disabled_reason:'非自己结束阶段、已处理、无非基本H/E费用、没有其他存活角色、失技或退场。',notes:['H9：复原同时变化时按翻面再解连环发送各一次正常事件，无变化不伪造事件。H11不宣称原生禁止选择无效果复原。正常摸牌遵守有限牌堆。'],hooks:['on_end_phase','recipient_owned_choice','restore_face_and_chain'],callbacks:['sgs_on_end_phase_jujian','sgs_restore_general']})
 ],
 'sgs.adapted.base.hero.quan-cong':[
 record('yaoming','邀名',{summary:'每个全局回合限一次，伤害后弃更多手牌者一张手牌，或令更少者摸一张',condition:'自己真实造成或受到正数伤害且求救结束，本全局回合尚未发动，有严格多于或少于自己手牌数的存活角色。',timing:'真实伤害／求救完成 → 比较当前手牌数 → 可选分支及目标 → 消耗本全局回合额度 → 弃一手牌或摸一张',cost:'无自身费用；弃牌分支只弃所选目标一张手牌',limit:'每个真实全局角色回合一次，两种伤害方向和两个分支共享；新出牌阶段不刷新，下一人或额外回合刷新',effect:'目标手牌严格更多：本人弃其一张手牌，不能弃装备或判定牌；目标手牌严格更少：令其摸一张。等量不合法。2点或更多伤害只给一个机会，拒绝或没有合法目标不消耗额度，之后新伤害仍可询问。',targets:'任意符合手牌严格比较的其他存活角色，不必是伤害参与者，不限距离／势力，队友敌人均合法；自己不可能满足严格比较',phase_use:'没有自由主动按钮。状态显示本全局回合已用／未用；提示显示两分支及当前手牌数量。',response:'弃他人手牌只显示不透明背面，提交后该牌才公开。自伤的两个伤害钩子共用一次机会，不能拒绝后在同一伤害重问。',disabled_reason:'本全局回合已用、无合法手牌数目标、失技／退场、仅流失体力、0或被防止伤害。',notes:['H10：同伤害事件与角色／全局回合去重，是宿主事件投递规则。接受后先记额度再处理嵌套弃牌／摸牌；不是自己回合一次，也无界全琮蓄力标记。'],hooks:['after_source_damage','after_damage_resolved','global_turn_quota'],callbacks:['sgs_after_source_damage_yaoming','sgs_after_damage_resolved_yaoming']})
 ]
});
export const SGS_YIJIANG_FURTHER_SKILL_ICONS=freeze({
 'sgs-yijiang-further-shenxing':'<path d="M3 4h9v13H3zm15 0h9v13h-9M8 21l8 7 8-7m-8-2v9M5 8h5m10 0h5M5 12h5m10 0h5"/>',
 'sgs-yijiang-further-bingyi':'<path d="M8 4h16v20H8zM3 8H1v20h17v-2M28 8h3v20H21v-2M11 10l5-4 5 4-5 5-5-5Zm0 10h10"/>',
 'sgs-yijiang-further-qiaoshi':'<path d="M3 7h9v13H3zm17 0h9v13h-9M14 10h4m-4 5h4M3 25h9m-4-3 4 3-4 3m21-3h-9m4-3-4 3 4 3"/>',
 'sgs-yijiang-further-yanyu':'<path d="M2 7q8 1 14 8Q22 8 30 7L23 18l-7-3-7 3L2 7ZM6 22a11 11 0 0 0 20 0m-4 0h4v5M10 3l6 4 6-4"/>',
 'sgs-yijiang-further-wuyan':'<path d="M16 2 28 7v9c0 6-6 11-12 14C10 27 4 22 4 16V7L16 2ZM10 11h12m-12 5h12M8 25 25 7"/>',
 'sgs-yijiang-further-jujian':'<path d="M3 4h15v18H3Zm4 5h7m-7 5h7m-7 4h4M19 18h10m-4-4 4 4-4 4M15 27h14m-7-4v7"/>',
 'sgs-yijiang-further-yaoming':'<path d="M16 3v26M5 29h22M4 8h24M7 8 2 21h10L7 8Zm18 0-5 13h10L25 8ZM12 4h8M4 24h6m12 0h6"/>'
});
export const SGS_YIJIANG_FURTHER_HOST_POLICIES=freeze([
 ['H0/H1','固有最大体力3／3／3／4、性别男／女／男／男和势力吴／蜀／蜀／吴来自同产品经典字段。独立初始体力未知，满血开局是宿主初始化。费用与事件按真实角色／阶段回执原子提交。'],
 ['H2–H4','死亡／失技和对局结束中断不退款；多人效果按共享行动顺序；正常摸牌遇耗尽只取得实际可用牌。'],
 ['H5/H6','燕语跨游戏血杀／毒杀／刺杀为明确扩展；复制完整双分支技能；单纯复制技能不自动复制他人体力、势力或性别，也不继承已消耗状态。额度按实际角色／阶段／全局回合维持。'],
 ['H7/H8','暗手牌只用不透明槽，公开快照不可变且不包含后来摸牌。秉壹空手无效展示隐藏、无色牌不当黑色是宿主策略。'],
 ['H9–H11','举荐复原按翻面再解连环发送真实变化，保留延时牌和标记；邀名自伤双钩子去重；界面隐藏无变化复原不代表原生禁止。']
]);
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function SgsYijiangFurtherPolicyGuide(){return html`<details className="hero-provenance sgs-yijiang-further-policy-guide" onKeyDown=${close}><summary>H0–H11 · 来源版本与江湖兼容边界</summary><p>本批完整登记顾雍、夏侯氏、徐庶、全琮七项技能；无额外主公、觉醒或授予技能。以上为该历史批次范围；后续已登记的满宠等角色在各自资料栏展示。</p><ol>${SGS_YIJIANG_FURTHER_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
export function SgsYijiangFurtherHpEvidence({hero}){const h=SGS_YIJIANG_FURTHER_HERO_IDENTITIES[hero?.id];return h?html`<p className="hero-hp-evidence" data-yijiang-further-source-identity=${hero.id}>基础身份来源：${h.name} · ${h.faction} · ${h.gender} · 固有最大体力${h.hp}。满体力${h.hp}/${h.hp}开局是H0宿主初始化，独立初始体力字段未知；不含身份主公加成。完整技能含隐藏面板已核对；体力／性别为同产品经典社区字段。未实测2026当前移动客户端，实际上限以对局为准。</p>`:null;}
export const SGS_YIJIANG_FURTHER_PROMPT_CONTEXTS=freeze({
 shenxing_materials:['sgs.shenxing','慎行','choice','恰好弃置两张自己的手牌／装备','不限次，每次重新付两张；当前尚未支付，可取消。'],
 bingyi_offer:['sgs.bingyi','秉壹','choice','是否公开此时全部手牌？','先展示再检查同色；混色也会公开但不摸牌。展示前可拒绝。'],
 bingyi_targets:['sgs.bingyi','秉壹','choice','选择至多X名不同角色各摸一张','可以选自己、敌人或零人。确认后各摸一张，已公开的牌不会撤销。'],
 qiaoshi_offer:['sgs.qiaoshi','樵拾','confirm','另一角色结束阶段：双方等手牌可各摸一张','由技能持有者决定，0／0也合法；敌人同样可选。'],
 yanyu_material:['sgs.yanyu','燕语','choice','选择一张真实手牌杀重铸','重铸不是出杀或弃置，不占杀次数。每次摸一张，累计只算本出牌阶段。'],
 yanyu_bonus_target:['sgs.yanyu','燕语','choice','出牌阶段结束：可令一名男性摸两张','本阶段至少重铸两张才有一次奖励，4张也只奖励一次；可放弃。'],
 jujian_material:['sgs.jujian','举荐','choice','选择一张非基本手牌或装备','基本牌不可支付。选目标前尚未支付，可以取消。'],
 jujian_target:['sgs.jujian','举荐','choice','选择另一名角色，由其自己决定效果','队友和敌人均合法。尚未支付费用，可以取消。'],
 jujian_effect:['sgs.jujian','举荐','choice','由你选择摸两张、回复一点或复原','满血不能回复。复原仅翻回正面并解连环，延时牌、技能标记和体力不重置。已支付，必须完成选择。'],
 yaoming_target:['sgs.yaoming','邀名','choice','本全局回合一次：严格比较当前手牌数','更多者弃一手牌，更少者摸一张，等量和自己不合法；拒绝保留额度。'],
 yaoming_discard:['sgs.yaoming','邀名','choice','选择目标的一张未知手牌弃置','只显示背面；不能选装备和判定牌。当前还可取消且不消耗本回合额度。']
});
const STAGES=SGS_YIJIANG_FURTHER_PROMPT_CONTEXTS,ids=new Set(Object.values(STAGES).map(r=>r[0]));
const seat=s=>s==='player'?'p1':s,skill=p=>p?.meta?.skill_id??p?.meta?.source_skill_id,n=v=>Number.isSafeInteger(v)?v:'?';
export const isSgsYijiangFurtherMandatory=p=>p?.meta?.mandatory===true||p?.meta?.stage==='jujian_effect';
export const isSgsYijiangFurtherPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||ids.has(skill(p));
export function isSgsYijiangFurtherPrompt(p){const m=p?.meta??{},r=STAGES[m.stage];return Boolean(r&&r[0]===skill(p)&&r[2]===p.kind&&!(m.skill_id&&m.source_skill_id&&m.skill_id!==m.source_skill_id));}
export function isSgsYijiangFurtherPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsYijiangFurtherPrompt(p)&&self&&p.player_id&&seat(p.player_id)===self&&p.meta.private_to&&seat(p.meta.private_to)===self);}
export function SgsYijiangFurtherResponseContext({state,prompt}){if(!isSgsYijiangFurtherPromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage];return html`<section className="response-context sgs-yijiang-further-context" data-source-skill-id=${r[0]} data-response-stage=${m.stage}><div className="response-kicker">${r[1]} · 当前选择者决定</div><strong>${r[3]}</strong><p>${r[4]}</p>${m.stage==='qiaoshi_offer'?html`<p data-qiaoshi-counts>你的手牌 ${n(m.owner_hand_count)} 张 · 回合主人 ${n(m.active_hand_count)} 张 · 双方各摸1</p>`:null}${r[0]==='sgs.yanyu'?html`<p data-yanyu-count=${n(m.recast_count)}>本真实出牌阶段已重铸 ${n(m.recast_count)} 张杀</p>`:null}${m.stage==='bingyi_offer'?html`<p>将公开全部 ${n(m.hand_count)} 张手牌，后来摸牌仍保密。</p>`:null}${m.stage==='bingyi_targets'?html`<p data-bingyi-selection>展示时X=${n(m.x)} · 同色${m.color??''} · 已选 ${(m.selected??[]).length} / ${n(m.max_targets)} 人</p>`:null}${r[0]==='sgs.yaoming'?html`<p>当前全局回合额度未用；只看手牌数量，不看暗牌内容。</p>`:null}<small>${input}</small></section>`;}
const cancelID=id=>['cancel','pass','decline','0','n'].includes(id);
function sendOnce(ref,key,busy,onRespond,value){if(busy||ref.current===key)return;ref.current=key;try{const r=onRespond(value);if(r?.then)Promise.resolve(r).catch(()=>{if(ref.current===key)ref.current=null;});}catch(e){ref.current=null;throw e;}}
export function SgsYijiangFurtherChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){
 const sent=useRef(null);if(!isSgsYijiangFurtherPromptOwner(prompt,state))return null;
 const m=prompt.meta,stage=m.stage,self=state.players.self,own=['shenxing_materials','yanyu_material','jujian_material'].includes(stage),mandatory=isSgsYijiangFurtherMandatory(prompt);
 const options=(prompt.options??(prompt.kind==='confirm'?[{id:'y',label:'发动'},{id:'n',label:'不发动'}]:[])).filter(o=>typeof o.id==='string'&&(!mandatory||!cancelID(o.id)));
 const ownCard=id=>/^hand:[1-9]\d*$/.test(id)?self.hand?.[Number(id.slice(5))-1]:id.startsWith('eq:')?self.equipment?.[id.slice(3)]:null;
 return html`<div className="sgs-yijiang-further-choices" data-choice-stage=${stage}>${stage==='shenxing_materials'?html`<p aria-live="polite">已选 ${(m.selected??[]).length} / 2 张，尚未支付</p>`:null}<div className="dialog-actions wrap">${options.map(o=>{const card=own?ownCard(o.id):null;if(own&&!cancelID(o.id)&&(!card||card.hidden))return null;const blind=stage==='yaoming_discard'&&/^hand:/.test(o.id),selected=stage==='bingyi_targets'&&o.id.startsWith('target:')&&(m.selected??[]).includes(o.id.slice(7));return html`<section key=${o.id}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}${blind?html`<span className="sgs-further-hidden-card" aria-label="未知手牌">手牌背面</span>`:null}<button type="button" className="btn option" data-option-id=${o.id} aria-pressed=${stage==='bingyi_targets'&&o.id.startsWith('target:')?selected:undefined} disabled=${busy||!!o.disabled} onClick=${()=>sendOnce(sent,prompt.prompt_id,busy,onRespond,o.id)}>${blind?`未知手牌 ${o.id.slice(5)}`:o.label}</button></section>`;})}</div></div>`;
}
export function SgsYijiangFurtherStatus({player}){
 if(!player)return null;const hero=player.effective_hero||player.hero,s=player.sgs_yijiang_further;if(!s&&!SGS_YIJIANG_FURTHER_HERO_IDENTITIES[hero?.id])return null;
 const gu=s?.guyong,xia=s?.xiahoushi,xu=s?.xushu,quan=s?.quancong;
 return html`<section className="player-card-status sgs-yijiang-further-status" data-yijiang-further-status=${player.seat}><span className="chip">当前体力 ${n(player.hp)} / 实际上限 ${n(player.max_hp)}</span>${gu?.shenxing_events?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id}>慎行已支付 ${n(r.paid_count)} 张；本阶段仍可继续支付发动。</p>`)}${gu?.bingyi_events?.filter(r=>r.committed).slice(-1).map(r=>html`<details key=${r.phase_event_id} className="sgs-further-public-reveal" onKeyDown=${close}><summary>秉壹已公开 ${n(r.x)} 张 · ${r.same_color?'同色':'混色，无摸牌'} · 查看当时牌面</summary><p>不可变公开快照；后来摸牌不在这里。</p><ul>${(r.reveal??[]).map((c,i)=>html`<li key=${i}>${c.name} · ${c.suit??'无花色'} ${c.rank??'无点数'} · ${c.color??'无色'}</li>`)}</ul><p>已选 ${(r.recipient_ids??[]).length} 人各摸一张</p></details>`)}${xia?html`<p data-yanyu-current=${n(xia.current_recast_count)}>燕语：本真实出牌阶段已重铸 ${n(xia.current_recast_count)} 张；结束时至少2张可选一名男性摸2。</p>`:null}${xu?.wuyan_events?.slice(-1).map(r=>html`<p key=${r.event_id} className="sgs-further-prevented" role="status">无言：已防止 ${n(r.amount)} 点锦囊伤害，实际伤害0。</p>`)}${xu?.jujian_events?.filter(r=>r.committed).slice(-1).map(r=>html`<p key=${r.event_id}>举荐：费用已支付，${r.choice==='draw'?'受荐者选择摸两张':r.choice==='recover'?'受荐者选择回复一点':r.choice==='restore'?'受荐者选择复原':'等待受荐者自行选择'}。</p>`)}${quan?html`<p data-yaoming-used=${quan.yaoming_used?'true':'false'}>邀名：当前全局回合${quan.yaoming_used?'已用，下一真实回合刷新':'未用，等待真实伤害后机会'}。</p>`:null}</section>`;
}
