import React from 'react';
import {html} from 'htm/react';
import {WANGYUN_LOCAL_POLICIES} from '../local/wangyun-data.js';

/** Five original hand-authored vector illustrations. CardView owns the visible
 * name and ACTUAL suit/rank; no printed face is fabricated inside these paths. */
export const WANGYUN_CARD_ART=Object.freeze({
 美人计:Object.freeze({tone:'#ad6f6c',wash:'#ead5cd',subject:'红绢折扇、金簪与两张相交换的锦牌',body:`
  <path d="M14 84Q29 73 52 83T105 83" fill="none" stroke="#b59776" stroke-width="1.1"/>
  <path d="M52 78 14 34Q48 1 88 26Z" fill="#bd7568"/>
  <path d="M52 78 23 27Q50 6 80 22Z" fill="#e0b19a"/>
  <path d="M52 78 22 28M52 78 36 20M52 78 51 17M52 78 67 18M52 78 80 23" fill="none" stroke="#92734d" stroke-width="1.5"/>
  <path d="M52 79 54 94M49 85l7 1" fill="none" stroke="#a3814e" stroke-width="4"/>
  <path d="M61 63q20-6 27 9t22-4M53 83q18-2 22 9l17-4" fill="none" stroke="#ab514a" stroke-width="3"/>
  <path d="M58 32 83 28 89 61 64 65Z" fill="#efe5c9"/><path d="M78 45 101 51 94 81 71 75Z" fill="#d1bd8e"/>
  <path d="M65 40l12-2m-10 9 12-2m-10 9 10-2M83 56l10 3m-12 4 10 3m-12 4 9 3" fill="none" stroke="#7c8470" stroke-width="1.2"/>
  <path d="M14 65 36 43" stroke="#a88c55" stroke-width="3"/><path d="m35 36 5-4 7 5-3 7-8-1Z" fill="#78968b"/><circle cx="40" cy="38" r="2" fill="#dfc184"/>
  <path d="M29 42q-3 12-12 10m5-8q-8-2-11 4" fill="none" stroke="#c9a26e" stroke-width="1.1"/>
 `}),
 笑里藏刀:Object.freeze({tone:'#977458',wash:'#e6d9bd',subject:'微笑的金色面具背后露出一柄冷青短刀',body:`
  <path d="M66 80 83 20 95 10 99 32 79 84Z" fill="#90afa4"/><path d="M95 10 94 32 75 82l4 2 20-52Z" fill="#e4ead9" stroke="none"/>
  <path d="M68 75 86 82 84 88 66 82Z" fill="#b39758"/><path d="M70 84 80 88 76 101 65 97Z" fill="#6f5945"/>
  <path d="M18 24q24-8 53 1l8 31q-7 26-27 35Q29 82 23 61Z" fill="#d2b678"/>
  <path d="M23 29q24-5 44 0l6 28q-7 23-22 28Q33 77 28 58Z" fill="#e9d59d" stroke="none"/>
  <path d="M29 44q7-7 15 0m11 0q7-7 14 0" fill="none" stroke="#725c43" stroke-width="2.5"/>
  <path d="M48 43 43 58l8 3 6-4" fill="none" stroke="#a18250" stroke-width="1.4"/>
  <path d="M34 65q17 17 32-1-16 8-32 1Z" fill="#8b6350"/><path d="M39 66q12 7 22-1" stroke="#f3e6bf" stroke-width="2"/>
  <path d="M29 53l5 4m30-4 4-4" stroke="#c29760" stroke-width="2"/>
  <path d="M20 31Q4 44 17 55l4 17M74 31q16-7 22 6" fill="none" stroke="#a85c4c" stroke-width="3"/>
  <path d="M16 89h20m54-36 12 4m-9-42 8-4" stroke="#b3a47e" stroke-width="1.1"/>
 `}),
 五谷丰登:Object.freeze({tone:'#a38b46',wash:'#e9e1bd',subject:'盛满稻穗的编织粮篮与公开摊开的五张牌',body:`
  <path d="M22 56h49l-5 32q-19 10-38-1Z" fill="#b09559"/><ellipse cx="46" cy="56" rx="25" ry="7" fill="#d8bd72"/>
  <path d="M28 64h37m-36 8h35m-33 8h31M34 61l4 27m10-26v28m12-29-5 28" fill="none" stroke="#7f7446" stroke-width="1.3"/>
  <path d="M44 57 32 14m17 42 7-44m-18 45-16-30m32 31 20-31" fill="none" stroke="#8d844c" stroke-width="2"/>
  <path d="M32 23q-12 0-12-10 10 0 12 10Zm3 10q9-4 5-14-9 4-5 14Zm-1 4q-12 0-13-11 10 1 13 11Zm6 10q9-4 6-13-9 3-6 13ZM55 22q-9-4-5-13 8 3 5 13Zm-1 10q11-1 12-11-9 0-12 11Zm-1 8q-11-5-6-15 8 4 6 15Zm-1 12q11-1 13-11-10-1-13 11ZM24 34q-9 2-12-7 9-2 12 7Zm42 3q1-10 12-11 1 8-12 11Z" fill="#c9b35f"/>
  <path d="m66 63 16-7 14 27-16 7Z" fill="#d3c497"/><path d="m75 60 17-3 7 31-17 3Z" fill="#e7dcb7"/><path d="M85 59h17v32H85Z" fill="#f0e6c5"/>
  <path d="m92 60 16 4-7 31-17-4Z" fill="#d7c797"/><path d="m101 65 14 8-16 27-15-8Z" fill="#eee2bb"/>
  <path d="m101 77 6 4m-10 2 7 4M15 95h57" fill="none" stroke="#898e65" stroke-width="1.3"/>
 `}),
 桃园结义:Object.freeze({tone:'#a9786f',wash:'#e7d8cc',subject:'桃花枝下三只青铜酒杯，环绕一枚完整桃实',body:`
  <path d="M11 45q21-5 34-24 21 1 43-13M38 28 32 9m26 10 9 15m-12-14 4-13m17 7 18 13" fill="none" stroke="#8b6f56" stroke-width="3"/>
  <g fill="#cb8e89" stroke="#9e6a66" stroke-width="1.1">
   <path d="M31 10q-9-8-8 2-11 1-2 7-3 10 6 6 7 8 8-2 10 0 4-7 5-8-8-6Z"/>
   <path d="M67 32q-8-7-8 2-9 1-2 6-2 9 5 6 6 6 7-2 8 0 4-6 4-7-6-6Z"/>
   <path d="M94 25q-8-7-8 1-10 1-2 7-3 9 5 5 6 7 7-1 8 0 4-6 4-8-6-6Z"/>
  </g>
  <circle cx="28" cy="17" r="2.3" fill="#ead190"/><circle cx="64" cy="38" r="2" fill="#ead190"/><circle cx="91" cy="31" r="2" fill="#ead190"/>
  <path d="M46 58q-19-14-26 3-7 19 23 31 30-15 24-31-7-16-21-3Z" fill="#ca9a7c"/><path d="M46 58q-6 13-3 33m5-39q4-14 19-12-2 13-19 12Z" fill="#8ca27c"/>
  <g fill="#73958a"><path d="M10 67h20l-3 11-6 5-1 11h-7l1-11-5-6Zm45 3h22l-3 12-6 4 1 10h-8l1-10-6-5Zm28-18h23l-3 12-7 5 2 13h-9l2-13-7-5Z"/></g>
  <path d="M8 65h24m21 3h25m3-18h27M12 94h15m31 2h16m12-14h17" stroke="#c9ae6d" stroke-width="3"/>
  <path d="M16 71h8m36 2h10m19-17h10M15 99h88" fill="none" stroke="#b8b794" stroke-width="1.2"/>
 `}),
 七宝刀:Object.freeze({tone:'#657f7b',wash:'#dce3cf',subject:'七枚有色宝石嵌于弧形刀背，青金护手与红绦相连的七宝刀',body:`
  <path d="M32 76Q62 51 66 14L85 7Q101 46 50 86Z" fill="#8faaa1"/><path d="M85 7Q101 46 50 86l-5-5Q85 45 82 17Z" fill="#e5ead6" stroke="none"/>
  <path d="M37 74Q67 47 71 18" fill="none" stroke="#ceb77e" stroke-width="4"/>
  <g stroke="#806c43" stroke-width=".9"><circle cx="73" cy="21" r="2.6" fill="#bc6b57"/><circle cx="71" cy="29" r="2.6" fill="#6f9583"/><circle cx="68" cy="37" r="2.6" fill="#b7a66a"/><circle cx="64" cy="45" r="2.6" fill="#7297a6"/><circle cx="59" cy="53" r="2.6" fill="#a9879d"/><circle cx="53" cy="61" r="2.6" fill="#c39155"/><circle cx="46" cy="69" r="2.6" fill="#b2bda1"/></g>
  <path d="M25 69 33 66 55 82 53 91 42 88Z" fill="#b99d60"/><path d="m30 81 11 8-14 14-11-9Z" fill="#445f5b"/>
  <path d="m24 87 9 7m-13-2 9 7" stroke="#bb9c60" stroke-width="2"/><circle cx="40" cy="79" r="3.4" fill="#779b91"/>
  <path d="M34 82q-21-2-22-16l-7 6q4 17 25 15m13 1q5 12 19 10l-5-7q-7 2-11-5" fill="#a75549" stroke="#8c5046" stroke-width="1"/>
  <path d="M25 18h8m-4-4v8M94 62l6 3m-9 6 7 3M77 94h27" fill="none" stroke="#a6ad88" stroke-width="1.1"/>
 `}),
});
const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const official='https://www.sanguosha.cn/pc/guide-info-163.html';
const reconstruction='2023历史核心＋JH01–JH12江湖规则重建，已接入并测试；2026当前客户端与12项原生边界未全面核验；不代表完整原版模式覆盖。';
export const WANGYUN_CARD_RULES=freeze({
 美人计:{id:'sgs.mobile.wangyun.meirenji',name:'美人计',kind:'非延时锦囊',timing:'自己的出牌阶段，按普通目标确认及无懈窗口结算',cost:'由矜功使用时，以1张合法杀/装备作真实转化材料；没有额外弃牌成本',limit:'本牌无独立次数上限；受矜功每出牌阶段1次限制',target:'一名其他、有效规则性别为男性且声明时有手牌的存活角色；不限距离',effect:'每名女性依次从男性目标获得1张手牌，再把本人当前1张手牌给使用者。全部完成后比较使用者与男性目标当前手牌数；较少者对较多者造成1点普通伤害，相等不造成伤害。',flow:'无懈成功取消该目标的整段牌效。实际较少手牌者是伤害来源，用牌者身份不变。女参与者不另作为独立声明目标。',acquisition:'专属转化牌；初始牌堆0个原生实体。用完不凭空增加美人计，回收只取得原材料。',face:'有效花色、点数来自实际转化材料；图鉴没有固定牌面',notes:['没有女性仍作最后手牌比较。可交刚获得的牌，也可交本人其他手牌。','JH06：按有效规则性别与行动序快照女性；男性手牌中途耗尽后仍尝试交本人手牌，跳过死亡及不可能步骤；女性使用者取得后自给为无操作。原生空手中断方案存在分歧。'],source_urls:[official]},
 笑里藏刀:{id:'sgs.mobile.wangyun.xiaolicangdao',name:'笑里藏刀',kind:'非延时锦囊',timing:'自己的出牌阶段；目标确认、无懈之后先摸牌，再结算伤害',cost:'由矜功使用时，以1张合法杀/装备作真实转化材料',limit:'本牌无独立次数上限；受矜功每出牌阶段1次限制',target:'任意一名其他存活角色；不要求受伤、有手牌或特定性别，不限距离',effect:'目标摸等于min(当前已损失体力,5)的牌，然后使用者对该目标造成1点普通伤害。满血时摸0张，后续伤害仍结算。',flow:'无懈成功取消整段摸牌与伤害。JH07在摸牌指令前读取已损失体力；完成摸牌及触发后再按正常存活/伤害规则结算。',acquisition:'专属转化牌；初始牌堆0个原生实体。正常回收/弃置唯一原材料，绝不另造实体。',face:'有效花色、点数来自实际转化材料；图鉴没有固定牌面',notes:['摸牌上限5不是伤害上限。伤害为普通属性且来源为用牌者。','无懈不退矜功材料、阶段额度或结束义务。'],source_urls:[official]},
 五谷丰登:{id:'sgs.adapted.trick.amazing-grace',name:'五谷丰登',kind:'非延时·全体锦囊',timing:'自己的出牌阶段；首个目标无懈之前先公开亮牌',cost:'矜功使用时1张合法杀/装备；其他来源按其正常用牌材料',limit:'本牌无固有阶段上限；矜功转化受自身每阶段1次限制',target:'包括使用者在内的所有合法角色，按正常行动顺序逐一处理',effect:'公开亮出存活角色人数张牌，各目标从当前剩余公开牌池选1张加入手牌。所有目标结束后，仍未取得的牌进入弃牌堆。',flow:'每个目标独立进行无懈；被抵消者不取牌，不影响其他目标。公开亮牌不是某角色摸牌，取得后走正常获得效果；已取走的实体不能重复领取。',acquisition:'本包作为矜功普通候选依赖接入，不据此往当前初始牌堆额外塞实体',face:'使用牌面来自当前真实用牌/转化材料；公开池每张牌显示自己的真实花色点数',notes:['采用官方共享基础效果；未引入国战专用无懈或队伍代选。','牌库不足、死亡及余牌清理沿用本作事务；公开池可见，不暴露牌堆其他位置或任何暗手牌。'],source_urls:['https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/110.html']},
 桃园结义:{id:'sgs.adapted.trick.god-salvation',name:'桃园结义',kind:'非延时·全体锦囊',timing:'自己的出牌阶段；各目标独立确认和无懈后回复',cost:'矜功使用时1张合法杀/装备；其他来源按其正常用牌材料',limit:'本牌无固有阶段上限；矜功转化受自身每阶段1次限制',target:'包括使用者在内的所有合法角色，不以队伍筛掉敌方或满血者',effect:'每个未被抵消的合法目标正常回复1点体力，不超过当前体力上限。满血角色没有实际回复量。',flow:'无懈只取消当前目标的效果；其余目标继续。通过正常回复事务结算，不直接改写体力，也不把此牌改称使用桃。',acquisition:'本包作为矜功普通候选依赖接入，不据此增加当前初始牌堆实体',face:'有效花色、点数随本次真实材料',notes:['普通全体回复效果与本作其他相似但目标范围不同的牌不按显示名合并。','采用官方共享基础效果；多人行动序和混合技能按本作正常事务。'],source_urls:['https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/109.html']},
 七宝刀:{id:'sgs.mobile.equipment.qibao.20231207',name:'七宝刀',kind:'武器 · 攻击范围2',timing:'有效装备时，自己使用杀指定直接目标及该杀造成伤害的时点',cost:'两项效果均为锁定，无额外弃牌或体力代价',limit:'无额外次数上限；仅自己的杀，不能把决斗、火攻、技能伤害或体力流失也加伤害',target:'自己这张杀的合法直接目标；无视防具不移除防具，也不封禁武将技能',effect:'杀无视目标防具；杀造成伤害时，若目标此刻未损失体力，伤害+1。两项同时保留，仍走正常响应、预防与伤害流程。',flow:'转换后的实际实体可正常入手、装备、替换、弃置和重洗；本局始终是七宝刀。王允死亡、觉醒或武器离场均不销毁、不还原。',acquisition:'连计从当前牌堆选中的基础青釭来源实体，在由A使用之前永久转换。初始牌堆不预置，不另造一把，不以50%转换失败替代官方路径。',face:'保留被转换实体的原UID和实际花色、点数；不能假造固定黑桃6',notes:['JH11：江湖的鱼肠剑代表须带明确三国杀基础青釭来源才可转换，不按显示名或相似机制猜测。','JH12：确认直接目标时记录防具忽略，伤害时检查仍有效的武器与满血；连环/转移保留加伤凭据且不重复叠加。血/毒杀兼容为本作政策。','不是七星宝刀或古锭刀；精确原生卡面与混合调度仍未知。'],source_urls:[official]},
});
export function isWangyunDependency(card){return Boolean(card&&(WANGYUN_CARD_RULES[card.name]||Object.values(WANGYUN_CARD_RULES).some(r=>[card.id,card.rule_id,card.equipment_id].includes(r.id))));}
/** Static guide only. No match mutation, RNG, hidden hands or deck locations. */
export function WangyunCardRules({card}){
 const record=Object.values(WANGYUN_CARD_RULES).find(r=>[card?.id,card?.rule_id,card?.equipment_id].includes(r.id))||WANGYUN_CARD_RULES[card?.name];
 if(!record)return null;
 return html`<section className="wangyun-card-rules" data-wangyun-card-rules=${record.id} aria-label=${`${record.name}完整规则`}>
  <strong>${record.name} · ${record.kind}</strong>
  <dl>${[['时机','timing'],['代价','cost'],['次数','limit'],['目标','target'],['效果','effect'],['结算','flow'],['取得与实体','acquisition'],['花色点数','face']].map(([label,key])=>html`<${React.Fragment} key=${key}><dt>${label}</dt><dd>${record[key]}</dd></${React.Fragment}>`)}</dl>
  <ul>${record.notes.map((note,i)=>html`<li key=${i}>${note}</li>`)}</ul>
  <small>${reconstruction}</small>
  <p>${record.source_urls.map(url=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${url===official?'历史官方：王允攻略（2023-12-07）':'历史官方：共享基础卡牌效果（2013）'}</a>`)}</p>
 </section>`;
}
/** This is explicitly a local-rule disclosure, never a native certification. */
export function WangyunPolicyGuide(){return html`<details className="wangyun-policy-guide" onKeyDown=${event=>{if(event.key==='Escape'){event.preventDefault();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}}}>
 <summary>王允 · JH01–JH12本作边界处理与未决原生细则</summary>
 <p>${reconstruction}固定2023-12-07版本；重构按以下本作政策实现，不会关闭原生精确性空白。</p>
 <ol>${WANGYUN_LOCAL_POLICIES.map(p=>html`<li key=${p.id} data-host-policy=${p.id}><strong>${p.id} · ${p.display_topic}</strong><p>${p.display_decision}</p></li>`)}</ol>
 </details>`;}
/** Complete dependency guide; closed by default so mobile skill panels stay compact. */
export function WangyunDependenciesGuide(){return html`<details className="derived-equipment-guide wangyun-dependencies-guide" onKeyDown=${event=>{if(event.key==='Escape'){event.preventDefault();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}}}>
 <summary>王允依赖图鉴 · 两种专属锦囊、五谷、桃园与七宝刀</summary>
 <p>${reconstruction}</p>
 ${Object.values(WANGYUN_CARD_RULES).map(card=>{const art=WANGYUN_CARD_ART[card.name];return html`<details key=${card.id} className="derived-guide-entry" data-wangyun-dependency=${card.id}>
  <summary><strong>${card.name}</strong> · ${card.kind}</summary>
  <svg viewBox="0 0 120 104" width="120" height="104" aria-hidden="true" focusable="false" data-art-name=${card.name}><ellipse cx="60" cy="53" rx="48" ry="44" fill=${art.wash}/><g stroke="#494a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML=${{__html:art.body}}/></svg>
  <${WangyunCardRules} card=${card} />
 </details>`;})}
 </details>`;}
