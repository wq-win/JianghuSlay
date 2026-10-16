/** Complete mobile base-identity guides and source-ID-bound UI. No game rules live here.
 * Original SVG art only. Source wording snapshot 2026-10-15, not client parity. */
import {html} from 'htm/react';
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const source='来源：大陆三国杀移动版基础身份目录，快照2026-10-15；荀彧另有同产品历史官方攻略，其余体力/性别采用明示的手游社区与跨产品OL佐证。未核验2026当前客户端全细则。';
const input='触屏点选，或键盘Tab定位、Enter确认；提交前可Esc取消。重复点击与过期提示不得重复扣牌、计次或结算。';
export const SGS_FIRE_HERO_SKILLS_BY_ID=freeze({
 'sgs.adapted.base.hero.xun-yu':[
  {id:'sgs-fire-quhu',source_skill_id:'sgs.quhu',name:'驱虎',type:'active',icon:'sgs-fire-quhu',summary:'每出牌阶段1次，与体力更高者拼点，令其造成伤害',condition:'自己的空闲出牌阶段，本阶段未发动；自己及另一名当前体力严格更高的存活角色均有合法手牌。相等体力不可选。',timing:'先选拼点对象，再私选手牌；双方锁定后同时亮牌；先完成结果伤害与嵌套技能，再清理拼点牌',cost:'双方各提交1张手牌作拼点；不失去体力，装备与判定区牌不可用',limit:'每个真实出牌阶段限1次；额外出牌阶段可再用，同阶段失去/重获技能不刷新',effect:'严格赢时，由自己选择拼点对象攻击范围内的另一名存活角色，由拼点对象对其造成1点普通技能伤害。没赢（含平点）时，拼点对象对自己造成1点伤害，不检查此伤害的距离。',targets:'拼点对象可为队友或敌人，不限距离；赢后受伤者不能是拼点对象，但可为自己。没有合法受伤者不禁止先拼点，赢后无伤害',phase_use:'点击驱虎或Q，依次选择目标与自己的手牌；提交前取消不消耗牌或阶段次数。',response:'这不是杀或决斗，不询问闪、无懈，不占出杀次数；伤害正常接受预防、转移、濒死救援和伤后技能。',disabled_reason:'非自己的空闲出牌阶段、本阶段已用、自己无合法手牌，或没有体力严格更高且有手牌的其他存活角色。',notes:[source,'伤害来源始终是拼点对象，荀彧只是技能发起者。输后真实受到伤害且获救存活，可逐点触发节命。','H1/H2/H3/H4：实际锁牌前重验目标与素材；结果及嵌套摸牌期间拼点牌留在处理区；提交后不退款，死亡分支遵循明示江湖时序。',input],hooks:['own_play','pindian_on_result'],callbacks:['sgs_player_quhu','sgs_resolve_quhu'],activeId:'sgs.quhu'},
  {id:'sgs-fire-jieming',source_skill_id:'sgs.jieming',name:'节命',type:'optional',icon:'sgs-fire-jieming',summary:'每受1点真实伤害，可令1人补手牌至体力上限，最多5',condition:'自己实际承受正数伤害，先完成濒死救援，最终仍存活；无来源伤害也可。直接失去体力或被预防的伤害不算。',timing:'救援后，按本次实际伤害点数，依次提供独立的可选机会',cost:'无；每点可独立放弃，不影响后续点数的机会',limit:'每点实际伤害1次；2点伤害是两次选择，非一次补至10张',effect:'每次选择一名存活角色，令其手牌补至min（当前体力上限，5）；已达到或超过该数不摸也不弃。每次读取最新手牌和体力上限，装备与判定区不算手牌。',targets:'任意一名存活角色，包括自己、队友或敌人；无距离限制，各点可选相同或不同角色',phase_use:'无出牌阶段发动按钮，伤害结算符合条件时才出现选择。',response:'可选目标或放弃本点；两点以上逐点询问。自己未获救而死亡则无后续补牌。',disabled_reason:'只有失血、没有实际正伤害、自己最终死亡或该点已结算时不触发。',notes:[source,'H3：牌堆不足按本作真实牌堆处理，不凭空造牌。H4：变身与失去技能不克隆旧机会。',input],hooks:['after_damage_resolved'],callbacks:['sgs_after_damage_jieming'],activeId:null}
 ],
 'sgs.adapted.base.hero.tai-shi-ci':[
  {id:'sgs-fire-tianyi',source_skill_id:'sgs.tianyi',name:'天义',type:'active',icon:'sgs-fire-tianyi',summary:'每出牌阶段1次拼点；赢则本回合杀次数/目标各+1，没赢禁用杀',condition:'自己的空闲出牌阶段，本阶段未用；自己与另一名存活角色均有合法手牌，无体力高低或距离条件。',timing:'先选对象与自己的手牌，双方锁定后同时亮牌；效果持续到本回合真正结束',cost:'双方各1张手牌拼点；不失血，不可用装备区或判定区牌',limit:'每个真实出牌阶段限1次；胜利加成和失败禁令都持续本回合，不在阶段结束时消失',effect:'赢：使用杀无距离限制，出杀次数在原额度上+1，每张杀目标上限在原上限上+1。没赢（含平点）：本回合不能使用杀。胜利不清零已用次数，不绕过目标禁令。',targets:'另一名有手牌的存活角色，可为队友或敌人；杀的额外目标必须各不相同且合法',phase_use:'点击天义或Q，依次选目标和手牌；提交前取消不扣牌、不计次。',response:'失败只禁止使用杀；决斗等纯粹打出杀的响应仍可。无限出杀装备不能解除本回合禁令。',disabled_reason:'非自己的空闲出牌阶段、本阶段已发动、自己无合法手牌或没有其他有手牌的存活角色。',notes:[source,'官方目录写“本回合”，社区经典页有“本阶段”的冲突；本作选用官方目录回合时长，不宣称客户端逐项一致。','H9江湖组合规则：额外真实出牌阶段可再拼点，每次胜利各叠加+1次数/+1目标；任一失败的回合禁杀不被后续胜利解除；原3目标加1为4，无限次数仍无限。','与任恒之的完整技能包、体力和效果不同，保持独立人物，不借同类拼点技能合并。',input],hooks:['own_play','slash_use_limit','slash_target_bonus','slash_distance'],callbacks:['sgs_player_tianyi','sgs_resolve_tianyi'],activeId:'sgs.tianyi'}
 ],
 'sgs.adapted.base.hero.yan-liang-wen-chou':[
  {id:'sgs-fire-shuangxiong',source_skill_id:'sgs.shuangxiong',name:'双雄',type:'optional_active',icon:'sgs-fire-shuangxiong',summary:'放弃本阶段正常摸牌，判定并得牌；本回合异色手牌当决斗',condition:'自己的摸牌阶段确实进入，可选择替代整次正常阶段摸牌；本回合已获得有效判定颜色后，才可用异色手牌转化。',timing:'摸牌阶段替代询问→真实判定及改判→获得仍可取得的最终判定牌；本回合合法出牌时可转化',cost:'发动时放弃本阶段整次正常摸牌；每次决斗另消耗1张与固定判定颜色相反的自己的手牌',limit:'每个实际摸牌阶段可替代1次；本回合转化无独立次数上限，每次需新素材',effect:'进行1次普通判定，记录最终有效颜色，并获得仍在结算中的最终判定实体牌。本回合可把异色手牌当普通决斗：目标先打出杀，之后交替响应，先不能响应者受对方伤害。',targets:'转化决斗选择另一名普通决斗合法的存活角色；通常无距离限制，仍受空城等目标禁令',phase_use:'摸牌选择是否替代；满足颜色条件后点击双雄·决斗或Q，先选手牌，再选目标。',response:'决斗有正常无懈和交替杀响应，纯响应不占主动出杀次数。手中装备牌可转化，已装备与判定区牌不可。',disabled_reason:'整个摸牌阶段被跳过时没有替代；本回合尚无有效判定颜色、没有异色手牌或无合法决斗目标时不能转化。',notes:[source,'这是一个共享4体力的双人物武将。不是摸2选1、不是额外摸牌后再判定，也没有受决斗伤害后取回对方响应杀。','H10：固定最终判定颜色，之后手牌改色不追溯；无色判定不给转化；同回合多个真实摸牌阶段的颜色令牌取并集。','H11：接受后只替代整次正常阶段摸牌，独立摸牌/获牌仍各自结算；已被别的效果取得的判定实体不可克隆。',input],hooks:['draw_phase_replacement','own_play'],callbacks:['sgs_replace_draw_phase_shuangxiong','sgs_player_shuangxiong'],activeId:'sgs.shuangxiong'}
 ],
 'sgs.adapted.base.hero.xu-huang':[
  {id:'sgs-fire-duanliang',source_skill_id:'sgs.duanliang',name:'断粮',type:'active',icon:'sgs-fire-duanliang',summary:'黑色基本牌或装备当兵粮寸断；兵粮距离上限至少2',condition:'自己的合法兵粮寸断使用窗口；有1张有效黑色的实体基本牌或装备牌，来自自己的手牌或装备区，且有合法目标。',timing:'先选素材、再选目标；支付后按普通延时锦囊用牌与判定区流程结算',cost:'1张有效黑色基本牌或装备牌作为兵粮寸断使用；不接受黑色锦囊、未知类型牌或判定区牌',limit:'没有技能独立次数限制；仍遵守兵粮使用时机、距离、重复延时牌与目标禁令',effect:'素材以兵粮寸断身份进入目标判定区，保留同一实体、花色和点数；正常无懈、判定和改判后，非梅花跳过整个下次摸牌阶段，梅花不跳。实体移出判定区后恢复原牌身份。',targets:'另一名存活角色，可为队友或敌人；兵粮有效距离上限至少2，实体兵粮与转化兵粮都享受此距离规则',phase_use:'点击断粮或Q，选择手牌/装备素材，再选目标；两步提交前可取消。无手牌但有合法装备仍可用。',response:'不是直接设置跳摸标记；正常兵粮无懈/判定均保留。提前移走延时牌不留下跳阶段标记。',disabled_reason:'无有效黑色基本/装备素材、选中素材移出后距离超限、目标已有兵粮、目标禁令或非合法用牌窗口。',notes:[source,'徐晃来源为“林”人物，本批目录名“fire”只是工作批次。没有截辎、全局无距离或额外摸牌。','H5/H6：按持有者的有效颜色与原始实体类别核验；消耗进攻马后排除该马减距，保留其他合法距离修正；武器射程不等于兵粮距离。','H7/H8：实体延时包装不克隆牌，移出恢复原名；兵粮与毒可共同跳过同一个下次摸牌阶段，不凭一次标记跳两回合。',input],hooks:['own_play','supply_shortage_distance_limit'],callbacks:['sgs_player_duanliang','sgs_resolve_duanliang'],activeId:'sgs.duanliang'}
 ]
});
export const SGS_FIRE_SKILL_ICONS=freeze({
 'sgs-fire-quhu':'<path d="M4 6l5-3 7 6 7-6 5 3-2 15-10 8-10-8ZM9 12l4 2m10-2-4 2M10 20l6-3 6 3-6 6Z M1 16h5m20 0h5M16 9v8"/>',
 'sgs-fire-jieming':'<path d="M3 5h10v20H3ZM19 5h10v20H19ZM7 9h2m-2 4h2m14-4h2m-2 4h2M16 4v25m-4-5 4 5 4-5M5 29h22"/>',
 'sgs-fire-tianyi':'<path d="M4 27 24 7m-5-3 9-1-1 9M4 7l20 20m-5 1 9 1-1-9M3 15h8m-4-4v8M21 15h8m-4-4v8M13 3l3 3 3-3"/>',
 'sgs-fire-shuangxiong':'<path d="M2 5h12v22H2ZM18 5h12v22H18ZM5 11l6 10m0-10L5 21M21 11l6 10m0-10-6 10M14 16h4M8 2v3m16-3v3M8 27v3m16-3v3"/>',
 'sgs-fire-duanliang':'<path d="M4 24q12-4 24 0v5H4ZM16 23V3m0 7Q7 10 7 4q9 0 9 6m0 7q9 0 9-7-9 0-9 7M3 3l26 26M3 16l6 2m14-1 6-3"/>'
});
export const SGS_FIRE_HOST_POLICIES=freeze([
 ['H1','拼点双方手牌锁定后同时公开；严格较大才赢，平点没赢。结果伤害与嵌套技能先结算，处理区拼点牌最后清理；AI不能读对手暗牌。'],
 ['H2','提交前重验主人、区域、存活、技能与目标。取消/过期不付费；真实提交后不退款、不重复移动。装备真实离区事件只触发一次。'],
 ['H3','驱虎伤害来源为拼点对象；节命在救援后逐点提供，最终死亡不摸。每点读取当前体力上限与手牌，不凭空造牌。'],
 ['H4','次数使用真实出牌阶段ID，持续效果使用回合ID。失去/重获技能不刷新同阶段额度；回合结束或中止清理效果。'],
 ['H5','断粮接受自己手牌/装备区的有效黑色实体基本或装备牌；看原实体类别，不允许把锦囊经别的预览当作基本牌。跨作品毒按真实移牌事件处理。'],
 ['H6','断粮消耗已装备进攻马时，先按移除该马的减距预览目标；无合法目标不移牌。其他距离修正保留，武器射程不替代牌的距离。'],
 ['H7','兵粮保留同一素材实体ID，在判定区具兵粮语义；移入手牌或弃牌后恢复原牌。移动重验延时牌合法性，不能复制第二张牌。'],
 ['H8','断粮使用本作普通兵粮的无懈与判定窗口。多个原因跳过同一个下次摸牌阶段，不累计跳两回合。'],
 ['H9','天义每次胜利叠加+1出杀额度与+1目标，到实际回合末失效；任一失败仍硬性禁用杀，后续胜利和无限出杀不能解除。原3目标+1为4。'],
 ['H10','双雄固定最终有效判定颜色，手牌以使用时的有效色检查。无色不授予转化；同回合多个真实摸牌阶段的颜色令牌取并集。'],
 ['H11','双雄只替代实际发生的整次正常阶段摸牌；独立获牌照常。取得最终仍可获得的判定素材，被其他效果取得的不克隆。']
]);
const closeOnEscape=event=>{if(event.key==='Escape'&&event.currentTarget.open){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();event.preventDefault();event.stopPropagation();}};
export function SgsFirePolicyGuide(){return html`<details className="hero-provenance sgs-fire-policy-guide" onKeyDown=${closeOnEscape}><summary>H1–H11 · 江湖兼容边界</summary><p>以下为本作明确选择的组合与异常时序政策，并非当前官方客户端实测裁定；官方基础技能与这些政策分开记录。</p><ol>${SGS_FIRE_HOST_POLICIES.map(([id,text])=>html`<li key=${id} data-policy-id=${id}><strong>${id}</strong> · ${text}</li>`)}</ol></details>`;}
const STAGES=freeze({
 quhu_target:['sgs.quhu','驱虎','选体力严格更高的拼点对象','仅要求当前体力严格更高且有合法手牌，不限制距离；提交前取消不扣牌、不计次。'],
 quhu_material:['sgs.quhu','驱虎','仅你可见 · 选择拼点手牌','双方最终锁定后才同时公开。这里只显示自己的合法手牌；提交前可以取消。'],
 quhu_victim:['sgs.quhu','驱虎','指定真正的受伤者','只能选拼点对象攻击范围内的另一名存活角色，可选自己。伤害来源是拼点对象，不是荀彧；不是杀，不询问闪。'],
 jieming_target:['sgs.jieming','节命','选择本点伤害的补牌对象','手牌补至min（当前体力上限，5），不是当前体力。每点独立选择或放弃，先完成救援后才询问。'],
 tianyi_target:['sgs.tianyi','天义','选择拼点对象','可选另一名有合法手牌的存活角色，包括队友；不检查体力高低或距离。'],
 tianyi_material:['sgs.tianyi','天义','仅你可见 · 选择拼点手牌','提交前可以取消。赢：本回合杀次数与目标上限各+1且无距离限制；没赢含平点：本回合禁止使用杀。'],
 shuangxiong_draw:['sgs.shuangxiong','双雄','是否替代本次正常摸牌？','确定后放弃本阶段整次正常摸牌，进行1次真实判定并获得最终仍可取得的判定牌；取消则照常摸牌。'],
 shuangxiong_material:['sgs.shuangxiong','双雄','仅你可见 · 选择异色手牌当决斗','素材仅限手牌，与本回合固定的有效判定颜色相反。已装备牌不可用；取消不消耗素材。'],
 shuangxiong_target:['sgs.shuangxiong','双雄','选择普通决斗目标','所选手牌按普通决斗使用，有正常无懈与交替杀响应；目标先响应，无法响应者受对方伤害。'],
 duanliang_material:['sgs.duanliang','断粮','仅你可见 · 选择黑色基本或装备牌','选择自己的手牌或装备区素材，按有效黑色与原实体类别检查；黑色锦囊不合法。'],
 duanliang_target:['sgs.duanliang','断粮','选择兵粮寸断目标','按素材移出后的距离检查，上限至少2；目标不能已有兵粮。提交后是实体延时锦囊，非梅花才跳过下次整个摸牌阶段。']
});
export const SGS_FIRE_PROMPT_CONTEXTS=STAGES;
const fireIDs=new Set(Object.values(STAGES).map(v=>v[0]));
const promptID=p=>p?.meta?.skill_id??p?.meta?.source_skill_id;
export function isSgsFirePromptStage(prompt){return Object.hasOwn(STAGES,prompt?.meta?.stage)||(prompt?.meta?.stage==='pindian_private_card'&&(fireIDs.has(prompt?.meta?.skill_id)||fireIDs.has(prompt?.meta?.source_skill_id)))||(prompt?.meta?.stage==='extra_targets'&&promptID(prompt)==='sgs.tianyi');}
export function isSgsFirePrompt(prompt){
 const meta=prompt?.meta||{},id=promptID(prompt);if(meta.skill_id&&meta.source_skill_id&&meta.skill_id!==meta.source_skill_id)return false;
 if(meta.stage==='pindian_private_card')return prompt.kind==='choice'&&['sgs.quhu','sgs.tianyi'].includes(id);
 if(meta.stage==='extra_targets')return prompt.kind==='choice'&&id==='sgs.tianyi';
 return Object.hasOwn(STAGES,meta.stage)&&STAGES[meta.stage][0]===id&&prompt.kind===(meta.stage==='shuangxiong_draw'?'confirm':'choice');
}
const canonicalSeat=id=>['player','p1'].includes(id)?'p1':id;
export function isSgsFirePromptOwner(prompt,state){
 if(!isSgsFirePrompt(prompt))return false;
 const self=state?.players?.self,meta=prompt.meta,seat=canonicalSeat(self?.seat);
 if(!seat||!prompt.player_id||canonicalSeat(prompt.player_id)!==seat)return false;
 if(meta.private_to&&canonicalSeat(meta.private_to)!==seat)return false;
 if(/_material$/.test(meta.stage)||meta.stage==='pindian_private_card')return Boolean(meta.private_to)&&canonicalSeat(meta.private_to)===seat;
 return true;
}
export function SgsFireResponseContext({state,prompt}){
 if(!isSgsFirePromptOwner(prompt,state))return null;
 const meta=prompt.meta,id=promptID(prompt),stage=meta.stage;
 const controls=['quhu_victim','pindian_private_card'].includes(stage)?'触屏点选，或键盘Tab定位、Enter确认；此步必须选择，Esc不会撤回已提交的拼点。重复输入不重复结算。':stage==='extra_targets'?'触屏点选，或键盘Tab定位、Enter确认；选择“完成目标选择”可停止追加，Esc不会撤回已经使用的杀。':input;
 const row=STAGES[stage]??(stage==='pindian_private_card'?[id,id==='sgs.quhu'?'驱虎':'天义','仅你可见 · 必须提交1张拼点手牌','双方锁定后同时公开牌面与点数，严格较大才赢，平点也算没赢；此处是已接受拼点的必须响应。']:[id,'天义','为同一张杀追加目标','每次成功天义在原目标上限上+1；每个目标须不同且合法，所有目标共享这一次用杀。']);
 return html`<section className="response-context sgs-fire-context" data-source-skill-id=${id} data-response-stage=${stage}><div className="response-kicker">${row[1]} · ${/_material$/.test(stage)||stage==='pindian_private_card'?'私有选牌':'当前选择'}</div><strong>${row[2]}</strong><p>${row[3]}</p>${stage==='jieming_target'?html`<p>本次伤害第 ${meta.point??'?'} / ${meta.points??'?'} 点 · 每点重新计算</p>`:null}${['duanliang_target','shuangxiong_target'].includes(stage)?html`<p data-effective-card=${stage==='duanliang_target'?'兵粮寸断':'决斗'}>本次有效牌：${stage==='duanliang_target'?'兵粮寸断 · 实体延时锦囊':'决斗 · 普通锦囊'}</p>`:null}<small>${controls}</small></section>`;
}
/** Read public turn receipts only; never infer a color from an opposing hand. */
export function SgsFireStatus({player}){
 const status=player?.sgs_fire;if(!status)return null;
 const ids=(player.effective_hero||player.hero)?.skill_ids||[],t=status.tianyi||{},s=status.shuangxiong||{};
 const showT=ids.includes('sgs.tianyi')||Number(t.wins)>0||t.sha_use_prohibited,showS=ids.includes('sgs.shuangxiong')||(s.judgment_colors||[]).length>0;
 if(!showT&&!showS)return null;
 return html`<section className="player-card-status sgs-fire-status" aria-label="来源技能本回合状态" data-sgs-fire-turn=${status.turn_id}>
 ${showT?html`<div data-tianyi-status=${t.sha_use_prohibited?'prohibited':Number(t.wins)>0?'boosted':'idle'}><strong>天义 · ${t.phase_used?'本出牌阶段已用':'本出牌阶段未用'}</strong><div className="card-status-flags">${t.sha_use_prohibited?html`<span className="chip">本回合禁止使用杀</span>`:null}${Number(t.wins)>0?html`<span key="use" className="chip">出杀额度 +${t.sha_use_bonus}</span><span key="target" className="chip">每杀目标 +${t.sha_target_bonus}</span>${t.sha_infinite_range?html`<span key="range" className="chip">杀无距离限制</span>`:null}`:null}</div><small>回合末失效；纯粹打出杀响应仍可，已用杀次数不重置。</small></div>`:null}
 ${showS?html`<div data-shuangxiong-colors=${(s.judgment_colors||[]).join(',')}><strong>双雄 · ${(s.judgment_colors||[]).length?`固定判定颜色：${s.judgment_colors.join('、')}`:'本回合尚未取得有效判定颜色'}</strong>${(s.eligible_material_colors||[]).length?html`<p>可转化手牌颜色：${s.eligible_material_colors.join('、')} → 决斗</p>`:null}<small>仅手牌；本回合结束失效，不随判定牌后来改色而变。</small></div>`:null}
 </section>`;
}

export function SgsFireHpEvidence({hero}){
 if(!Object.hasOwn(SGS_FIRE_HERO_SKILLS_BY_ID,hero?.id))return null;
 return html`<p className="hero-hp-evidence">体力依据：hp=${hero.max_hp??hero.hp_evidence?.value}，${hero.hp_evidence?.primary_mobile_explicit?'同产品历史官方荀彧攻略明确标明3体力，另以移动版社区与官方OL名册交叉印证':'移动版经典身份社区资料补足体力与性别，官方OL名册仅作跨产品体力佐证；本次移动版详情页没有明确体力/性别字段'}。未实测2026当前移动客户端体力。</p>`;
}
