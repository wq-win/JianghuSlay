/** Source-bounded Zhang Fen UI. Uses public DTOs only; never reads rule receipts. */
import {html} from 'htm/react';
import {useRef,useState} from 'react';
import {ZHANGFEN_HERO_ID,ZHANGFEN_SKILL_IDS as SK,ZHANGFEN_EQUIPMENT_CATALOG,zhangfen_equipment_definition,validate_zhangfen_faces} from '../local/sgs-zhangfen-data.js';
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const source='所选来源：三国杀移动版身份，2026-10-15目录快照。官网与同产品社区资料分层核对；未实测2026当前客户端，完整身份模式仍未完成。';
const input='触屏点选，或Tab定位、Enter确认；Esc只选择本提示明确提供的取消。重复与过期输入不重复提交。';
export const SGS_ZHANGFEN_HERO_IDENTITIES=freeze({[ZHANGFEN_HERO_ID]:{name:'张奋',hp:4,faction:'吴',gender:'男'}});
export const SGS_ZHANGFEN_HERO_SKILLS_BY_ID=freeze({[ZHANGFEN_HERO_ID]:[
 {id:'sgs-zhangfen-quchong',source_skill_id:SK.quchong,name:'渠冲',type:'active',icon:'sgs-zhangfen-quchong',activeId:SK.quchong,
  summary:'重铸装备；每名角色真实回合末收集铸造值；出牌阶段开始制造或移交大攻车',
  condition:'持有渠冲。制造须场上无大攻车、未制造满4辆且铸造值足够；有车时改为移交现有车。',
  timing:'自己出牌阶段可重铸；每名角色真实回合结束强制收集；自己的真实出牌阶段开始可制造或移交。',
  cost:'重铸自己手牌或装备区一张装备并摸1；身份版第1至4次制造消耗0／5／10／10铸造值。移交不支付制造费用。',
  limit:'重铸无技能次数上限；两种形态共享整局4次制造。一次真实出牌阶段开始仅有一次制造或移交窗口。',
  targets:'制造可选自己或任意存活角色；移交必须选择当前承载者以外的一名存活角色。',
  effect:'每名角色真实回合末，将当时弃牌堆中所有装备移出游戏，每实际移出1张获得1铸造值。制造选择进击或守御，交给目标并由目标实际使用；移交保留同一实体、形态、制造者与剩余耐久。',
  phase_use:'主动按钮只重铸自己的装备。装备区大攻车由渠冲重铸时正常离场并摸1，不扣非渠冲离场耐久。制造与移交不能在出牌中途自由发动。',
  response:'制造形态、车与接收者由渠冲持有者决定；接收者取得后实际使用，随后使用触发的决定权归接收者。',
  disabled_reason:'不是自己的真实出牌阶段、没有合法重铸装备、失技或退场时无重铸入口；制造次数满或铸造值不足时不能制造。',
  notes:[source,'收集是必结算，不能只选一部分弃牌装备。重铸并不立即获得铸造值，装备须留在弃牌堆直到收集。','大攻车仅由渠冲衍生，普通初始牌堆0张；转交不修复、不升级、不重置制造次数。','此处只用身份费用，不混入团战／斗地主0／2／5／5或十周年宝物车技能。',input]},
 {id:'sgs-zhangfen-xunjie',source_skill_id:SK.xunjie,name:'逊节',type:'locked',icon:'sgs-zhangfen-xunjie',activeId:null,
  summary:'场上无自己制造的车且伤害来源当前HP更高时判定；红色减伤1',
  condition:'受到正数伤害前，场上任意存活角色装备区均无自己原生制造的大攻车，且真实伤害来源当前体力严格高于自己。',
  timing:'当前最终受伤者的扣体力前窗口；按明示宿主次序先逊节、后守御。',
  cost:'满足条件强制进行正常判定，可经过改判；不消耗铸造值。',limit:'无回合或轮次上限；每个真实伤害事件独立检查。',targets:'自己将受到的这一包伤害。',
  effect:'最终有效判定为红桃或方块时，该伤害减1；黑桃或梅花不减。减到0不产生实际伤害与伤后效果。',
  phase_use:'锁定技，没有自由主动按钮。',response:'没有拒绝判定或选颜色的窗口；来源不存在、来源HP相等或更低、体力流失均不触发。',
  disabled_reason:'自己制造的车即使借给队友或敌人仍在场，也不满足条件。复制功能车不算任何人的原生制造。',
  notes:[source,'判断的是自己的原生制造者身份，不是本人武器槽是否空置。守御在同一伤害中耗尽销毁，不回头补开逊节。','判红减伤，绝不是“非黑桃就减伤”。',input]}
]});
export const SGS_ZHANGFEN_SKILL_ICONS=freeze({
 'sgs-zhangfen-quchong':'<path d="M3 21h26v5H3zM8 21 13 7h7l5 14M10 14h13M15 7V3h5M4 13l5 3m18-5 3-3"/><circle cx="9" cy="27" r="3"/><circle cx="24" cy="27" r="3"/><path d="m17 11 3 5-4 2"/>',
 'sgs-zhangfen-xunjie':'<path d="M16 3 28 8v10q-2 9-12 12Q6 27 4 18V8Z"/><path d="M10 12h12v10H10zM16 14q-4-4-4 0 0 3 4 5 4-2 4-5 0-4-4 0ZM8 6l3 3m13-3-3 3"/>'
});
const close=e=>{if(e.key==='Escape'){e.preventDefault();e.currentTarget.open=false;e.currentTarget.querySelector(':scope > summary')?.focus();e.stopPropagation();}};
const n=v=>Number.isSafeInteger(v)?v:'?';
export const zhangfenRankLabel=v=>({1:'A',11:'J',12:'Q',13:'K'}[v]??String(v??'?'));
export const zhangfenFaceLabel=f=>f?`${f.suit??'未知花色'} ${zhangfenRankLabel(f.rank)}`:'尚未配置';
/** A disclosed UI initial choice only. The rules module itself has no default. */
export const ZHANGFEN_SETUP_INITIAL_FACES=freeze({attack:{suit:'黑桃',rank:1},defend:{suit:'黑桃',rank:1}});
export function zhangfenSetupFaces(faces){return validate_zhangfen_faces(faces??ZHANGFEN_SETUP_INITIAL_FACES);}
export function ZhangfenFaceSetup({value,onChange,disabled=false}){
 const faces=zhangfenSetupFaces(value);
 return html`<details className="zhangfen-face-setup" onKeyDown=${close}><summary>大攻车自定义牌面（仅衍生时生效）</summary>
  <p>本作初始选择：进击与守御均为黑桃A。这是宿主配置，不是来源固定印刷牌面；四种花色与A至K均可选，只有实际制造时才生成实体，不会加入随机牌堆。</p>
  <div className="zhangfen-face-fields">${['attack','defend'].map(form=>{const label=form==='attack'?'进击':'守御';return html`<fieldset key=${form} disabled=${disabled}><legend>大攻车·${label}</legend><label htmlFor=${`zhangfen-${form}-suit`}>${label}花色<select id=${`zhangfen-${form}-suit`} value=${faces[form].suit} onChange=${e=>onChange(validate_zhangfen_faces({...faces,[form]:{...faces[form],suit:e.target.value}}))}>${['黑桃','红桃','梅花','方块'].map(s=>html`<option key=${s} value=${s}>${s}</option>`)}</select></label><label htmlFor=${`zhangfen-${form}-rank`}>${label}点数<select id=${`zhangfen-${form}-rank`} value=${faces[form].rank} onChange=${e=>onChange(validate_zhangfen_faces({...faces,[form]:{...faces[form],rank:Number(e.target.value)}}))}>${Array.from({length:13},(_,i)=>i+1).map(r=>html`<option key=${r} value=${r}>${zhangfenRankLabel(r)}</option>`)}</select></label></fieldset>`;})}</div>
  <p className="config-hint">修改用于下一局；继续存档与重新开局保留该局配置。当前选择：进击 ${zhangfenFaceLabel(faces.attack)} · 守御 ${zhangfenFaceLabel(faces.defend)}。</p>
 </details>`;
}
export function SgsZhangfenHpEvidence({hero}){return hero?.id===ZHANGFEN_HERO_ID?html`<p className="hero-hp-evidence" data-zhangfen-source-identity>张奋 · 男 · 吴 · 固有最大体力4。4/4开局为DH0宿主通常满体力初始化，独立初始体力字段未另获来源确认。两项固有技能为渠冲、逊节。</p>`:null;}
export function SgsZhangfenPolicyGuide(){return html`<details className="hero-provenance zhangfen-policy-guide" onKeyDown=${close}><summary>来源与DH0–DH10宿主边界</summary><p>${source}</p><ul>
 <li>身份制造费用0／5／10／10，两形态共用4次上限；原生车范围9，进击初始耐久2、守御初始耐久3。</li>
 <li>DH2伤害顺序：来源加伤→逊节→守御。同一包守御销毁后不追溯开启逊节；连环各包由共享引擎独立处理。</li>
 <li>DH4阵亡承载者的正耐久车弃置并保留耐久；远端车不因制造者阵亡自动销毁。这是明示宿主兼容，不声称原生特殊FAQ已闭合。</li>
 <li>DH5非渠冲转化付款不使用装备区车作实际素材；被阻止的移出不得算作已支付。</li>
 <li>DH6复制功能保留真实素材牌面与实体，独立初始化耐久，不伪造原生制造者；DH7复制英雄保留行为者自己的铸造与制造台账。</li>
 <li>DH8每形态开局自定义花色、点数；本作初值黑桃A仅为宿主选择。DH9／DH10按真实输入回放恢复未完成提示，不重复支付。</li>
 </ul><small>当前客户端、原生特殊边界与完整来源模式仍未全面认证；原创矢量美术，不使用官方素材。</small></details>`;}
export const SGS_ZHANGFEN_PROMPT_CONTEXTS=freeze({
 quchong_recast:['渠冲 · 重铸','重铸一张自己的手牌装备或已装备牌，然后摸1。','当前选择前尚未支付；重铸不是弃置，须留到真实回合末才可能变为铸造值。'],
 quchong_manufacture_form:['渠冲 · 制造','选择新车形态：进击2耐久，守御3耐久。','形态与目标均确认后才支付。两形态共用制造上限，牌面沿用本局配置。'],
 quchong_transfer_car:['渠冲 · 移交','选择场上现有大攻车。','随后必须选择当前承载者以外的角色；同一实体转交，不修复耐久、不推进制造次数。'],
 quchong_recipient:['渠冲 · 接收者','选择获得并实际使用这辆车的存活角色。','制造可选自己；移交不能选当前承载者。接收后实际使用的触发由接收者决定。'],
 siege_attack:['大攻车·进击 · 加伤','可消耗1耐久，提高当前这一包伤害。','最后1耐久也能发动：车会销毁，但本包加伤仍生效。取消不耗耐久。']
});
const STAGES=SGS_ZHANGFEN_PROMPT_CONTEXTS,seat=s=>s==='player'?'p1':s;
export const isSgsZhangfenPromptStage=p=>Object.hasOwn(STAGES,p?.meta?.stage)||[p?.meta?.skill_id,p?.meta?.source_skill_id].some(s=>Object.values(SK).includes(s));
export function isSgsZhangfenPrompt(p){const m=p?.meta??{};if(!Object.hasOwn(STAGES,m.stage)||p.kind!=='choice'||!p.prompt_id)return false;if(m.stage==='siege_attack')return m.skill_id==null&&m.source_skill_id==null&&m.equipment==='大攻车·进击'&&m.damage_event_id!=null;return m.skill_id===SK.quchong&&(!m.source_skill_id||m.source_skill_id===SK.quchong);}
export function isSgsZhangfenPromptOwner(p,state){const self=seat(state?.players?.self?.seat);return Boolean(isSgsZhangfenPrompt(p)&&self&&p.player_id&&p.meta.private_to&&seat(p.player_id)===self&&seat(p.meta.private_to)===self);}
export function SgsZhangfenResponseContext({state,prompt}){if(!isSgsZhangfenPromptOwner(prompt,state))return null;const m=prompt.meta,r=STAGES[m.stage],s=state.players.self.sgs_zhangfen;return html`<section className="response-context zhangfen-context" data-response-stage=${m.stage}><div className="response-kicker">${r[0]}</div><strong>${r[1]}</strong><p>${r[2]}</p>
 ${m.stage==='quchong_manufacture_form'?html`<p key="manufacture" data-zhangfen-manufacture>铸造值 ${n(m.forge)} · 已制造 ${n(m.manufactured)}/4 · 本次消耗 ${n(m.next_cost)}</p><p key="faces">本局进击 ${zhangfenFaceLabel(s?.faces?.attack)} · 守御 ${zhangfenFaceLabel(s?.faces?.defend)}</p>`:null}
 ${m.stage==='siege_attack'?html`<p data-zhangfen-attack-offer>全局第 ${n(m.global_round)} 轮 · 本次加伤 +${n(m.bonus)}（最多+3） · 当前耐久 ${n(m.durability)}${m.durability===1?'；确认后此车销毁':''}</p>`:null}<small>${input}</small></section>`;}
const cancel=id=>['cancel','pass','0','n','no','decline'].includes(id);
export function SgsZhangfenChoiceButtons({state,prompt,onRespond,busy=false,CardView=null}){
 const sent=useRef(null),latest=useRef(null),[submitted,setSubmitted]=useState(null);latest.current=prompt?.prompt_id;if(!isSgsZhangfenPromptOwner(prompt,state))return null;
 const send=id=>{if(busy||latest.current!==prompt.prompt_id||sent.current===prompt.prompt_id)return;sent.current=prompt.prompt_id;setSubmitted(prompt.prompt_id);try{const promise=onRespond(id);if(promise?.then)Promise.resolve(promise).catch(()=>{sent.current=null;setSubmitted(false);});}catch(e){sent.current=null;setSubmitted(false);throw e;}};
 const stage=prompt.meta.stage,self=state.players.self,ids=new Set();
 return html`<div className="zhangfen-choices" data-choice-stage=${stage}><div className="dialog-actions wrap">${(prompt.options??[]).filter(o=>typeof o.id==='string'&&!ids.has(o.id)&&ids.add(o.id)).map(o=>{
  let card=null;if(stage==='quchong_recast'&&!cancel(o.id)){if(/^hand:[1-9]\d*$/.test(o.id))card=self.hand?.[Number(o.id.slice(5))-1];else if(/^eq:(weapon|armor|offensive_horse|defensive_horse)$/.test(o.id))card=self.equipment?.[o.id.slice(3)];if(!card||card.hidden)return null;}
  return html`<section key=${o.id}>${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}<button type="button" className="btn option" data-option-id=${o.id} disabled=${busy||submitted===prompt.prompt_id||Boolean(o.disabled)} onClick=${()=>send(o.id)}>${o.label}</button></section>`;
 })}</div></div>`;
}
export const isZhangfenVehicle=card=>Boolean(zhangfen_equipment_definition(card));
export function ZhangfenVehicleState({vehicle,card}){if(!vehicle)return null;const f=vehicle.form==='attack'?'进击':'守御';return html`<div className="zhangfen-vehicle-state" data-zhangfen-vehicle=${vehicle.physical_id}><strong>大攻车·${f} · 耐久 ${n(vehicle.durability)}/${n(vehicle.max_durability)}</strong><p>制造者：${vehicle.native?vehicle.creator_actor_id??'未知':'功能复制（无原生制造者）'}${vehicle.native?` · 第 ${n(vehicle.creation_ordinal)} 辆`:''} · 实际牌面：${zhangfenFaceLabel(card?{suit:card.physical_suit??card.suit,rank:card.rank}:null)}</p><small>实体 ${vehicle.physical_id} · 转交保留当前耐久，不修复。</small></div>`;}
export function SgsZhangfenStatus({player}){const s=player?.sgs_zhangfen,h=player?.effective_hero??player?.hero,has=(h?.skill_ids??[]).some(id=>Object.values(SK).includes(id));if(!s||(!has&&!s.vehicle&&!s.manufactured&&!s.forge))return null;return html`<section className="player-card-status zhangfen-status" data-zhangfen-status=${player.seat}>
 ${has||s.manufactured||s.forge?html`<p data-zhangfen-forge>铸造值 ${n(s.forge)} · 制造 ${n(s.manufactured)}/${n(s.manufacture_limit)} · ${s.next_cost===null?'已达制造上限':`下次费用 ${n(s.next_cost)}`}</p>`:null}
 <p data-zhangfen-round>全局第 ${n(s.global_round)} 轮 · 进击可选加伤 +${n(s.attack_bonus)}（最多+3）</p>
 ${has?html`<p data-zhangfen-xunjie>${s.own_vehicle_on_field?'场上仍有自己制造的车：逊节不满足无车条件':'场上无自己制造的车：逊节仍须来源当前HP更高'}</p>`:null}
 <${ZhangfenVehicleState} vehicle=${s.vehicle} card=${player.equipment?.weapon} />
 </section>`;}
export function ZhangfenCardRules({card,vehicle=null}){const d=zhangfen_equipment_definition(card);if(!d)return null;return html`<section className="derived-card-rules zhangfen-card-rules" data-zhangfen-rules=${d.id}><strong>渠冲衍生武器 · ${d.form==='attack'?'进击':'守御'} · 范围9 · 初始耐久${d.initial_durability}</strong>
 <p>普通初始牌堆0张；仅制造时生成实体，目标先获得再实际使用。花色与点数按本局各形态配置；图鉴没有固定印刷牌面。</p>
 <p>${d.form==='attack'?'造成正数伤害时可消耗1耐久，使这一包伤害+min(全局轮数,3)，首轮为1；不限于杀。最后1耐久销毁后，加伤仍生效。':'受到正数伤害时强制减少min(伤害,剩余耐久)点伤害并消耗等量耐久，不可少选或拒绝；不处理体力流失。'}</p>
 <p>入装备区后弃置承载者其他装备；已装备时，其他装备欲进入改为弃置，不能替换车。非渠冲移出被阻止并耗1耐久；耐久归零销毁，不进弃牌堆、不重洗、不提供铸造值。</p>
 <p>渠冲移交与渠冲重铸保留真实离场语义，不扣上述耐久；重入不修复。正耐久车的阵亡弃置按DH4宿主政策处理。</p>
 <${ZhangfenVehicleState} vehicle=${vehicle} card=${card} /><small>${source}</small></section>`;}
export function ZhangfenEquipmentGuide({CardView=null,faces=null}){return html`<details className="derived-equipment-guide zhangfen-equipment-guide" onKeyDown=${close}><summary>大攻车图鉴 · 进击 / 守御 <span>渠冲衍生，普通初始牌堆0张</span></summary><div className="zhangfen-guide-grid">${ZHANGFEN_EQUIPMENT_CATALOG.map(card=>html`<article className="derived-guide-entry" key=${card.id}><div className="derived-guide-art">${CardView?html`<${CardView} card=${card} />`:null}<strong>${card.name}</strong><small>${faces?`本局配置：${zhangfenFaceLabel(faces[card.form])}`:'花色与点数可在开局配置'}</small></div><${ZhangfenCardRules} card=${card} /></article>`)}</div><${SgsZhangfenPolicyGuide} /></details>`;}
