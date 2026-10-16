import React from 'react';
import {html} from 'htm/react';

const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};

/** Original, hand-authored SVG paths for the existing 120 × 104 CardArt frame.
 * CardView keeps the actual name/suit/rank and physical gift badge. No official
 * illustration, external image, text glyph, emoji, or fallback is embedded. */
export const YOUJIAN_CARD_ART=freeze({
 刺杀:{tone:'#657d79',wash:'#d8dfd0',subject:'夜色披风中的蒙面刺客，握着一柄斜出的冷青短刃',body:`
  <path d="M17 86V19m-4 20h8m-8 19h8M99 77V10m-4 18h8m-8 20h8" fill="none" stroke="#94a58b" stroke-width="2"/>
  <path d="M18 33q-12-8-9-17 11 2 9 17Zm0 18q13-6 16-17-14 3-16 17ZM99 32q-14-2-18-14 14 0 18 14Zm1 24q12-8 10-21-12 6-10 21Z" fill="#a4b393" stroke="none"/>
  <path d="M30 94 36 63 47 49 73 46 88 60 99 95Z" fill="#5d6864"/>
  <path d="M45 60 30 94 59 82 74 94 82 58Z" fill="#7b7c73"/>
  <path d="M44 51Q39 25 57 12q22-6 28 21L76 54Z" fill="#4f605d"/>
  <path d="M55 22q13-5 22 7l-1 18-26-1Z" fill="#d3ba8d"/>
  <path d="m52 36 24-1 3 14-17 10-15-12Z" fill="#697b74"/>
  <path d="m54 30 7 2m7-1 6-3" fill="none" stroke="#394d49" stroke-width="2.2"/>
  <path d="M47 50 63 61 73 53M42 67l13 5m15-9 11 9M36 85l21-5" fill="none" stroke="#b1b29a" stroke-width="1.3"/>
  <path d="M69 78 87 66 93 69 78 83Z" fill="#d2b68b"/><path d="m68 76 7 9-9 6-7-9Z" fill="#596f69"/>
  <path d="M27 25 36 35 74 73 66 81 29 40Z" fill="#9ab8ad"/>
  <path d="M27 25 29 40 66 81l4-4Z" fill="#edf0d8" stroke="none"/>
  <path d="M34 37 66 69" stroke="#6f9992" stroke-width="1.2"/>
  <path d="m61 76 10-10 5 5-11 11Z" fill="#bc9a5c"/><path d="m70 77 5-5 12 13-5 5Z" fill="#806145"/>
  <path d="m74 79 5-4m-2 8 5-4M84 88q12 2 14-9" fill="none" stroke="#b16b55" stroke-width="2"/>
  <path d="M20 96h83" fill="none" stroke="#8fa18e" stroke-width="1.2"/>
 `},
 树上开花:{tone:'#9a7c68',wash:'#e4ddc2',subject:'盘根的古树从枯枝上盛开浅红花朵，青苔与新叶环绕老木',body:`
  <path d="M14 93q13-14 31-10 8-11 21-5 18-6 39 15Z" fill="#a0ac8a"/>
  <path d="M38 90q15-16 13-34L37 39l-17-4 1-5 20 4 13 12 2-18-10-16 5-3 12 17 1 18 16-11 7-19 6 2-7 22-21 18q-5 18 7 34l-15-5-19 5Z" fill="#94714f"/>
  <path d="M54 80q7-14 5-31m2-15-3-13M44 37l-7-13m47 12 19 4M49 85l-9 3m21-9 5 7" fill="none" stroke="#d0ad72" stroke-width="2"/>
  <path d="m37 25-8-12m59 1 11-7M25 33 15 43" fill="none" stroke="#94714f" stroke-width="2"/>
  <g fill="#cf9485" stroke="#9a7362" stroke-width="1.1">
   <path d="M29 16q-9-7-7 2-10 1-3 7-2 9 6 5 7 7 8-3 10-1 3-6 4-8-7-5Z"/>
   <path d="M52 10q-9-7-7 2-9 1-3 7-2 9 6 5 7 6 8-3 9-1 3-6 3-8-7-5Z"/>
   <path d="M88 14q-10-7-8 3-10 1-3 7-2 10 7 5 7 7 8-3 10-1 3-7 4-9-7-5Z"/>
   <path d="M104 37q-8-6-7 2-9 1-2 6-2 8 5 5 7 6 7-3 9-1 3-6 3-7-6-4Z"/>
   <path d="M15 43q-7-5-6 2-8 1-2 6-1 7 5 4 6 5 6-2 7-1 2-5 3-6-5-5Z"/>
  </g>
  <g fill="#e8d29a" stroke="none"><circle cx="26" cy="23" r="2.5"/><circle cx="49" cy="17" r="2.5"/><circle cx="85" cy="22" r="2.6"/><circle cx="101" cy="43" r="2.2"/><circle cx="13" cy="49" r="2"/></g>
  <path d="M40 40q-15 3-17-8 12-4 17 8Zm24-2q-2-13 10-16 4 11-10 16Zm10 18q9-11 20-5-6 11-20 5ZM43 79q-12-11-19-4 5 10 19 4Zm31 8q9-12 20-5-6 10-20 5Z" fill="#8ca17b"/>
  <path d="M44 93q13-4 28 0M30 88l8-1m47 4h10" fill="none" stroke="#6d886d" stroke-width="1.4"/>
  <path d="m83 62-3 7 5 2 4-6m-60-8-2 6 5 2 3-5" fill="#d9a190" stroke="none"/>
 `},
 刮骨疗毒:{tone:'#688e83',wash:'#d9e2ce',subject:'青铜药钵、卷起的白布和细刃医刀，旁置清新的药草',body:`
  <path d="M16 86q41 10 89 1l-9 9H23Z" fill="#c9b180"/>
  <path d="m19 62 31-5 22 27-38 7Z" fill="#e9e6cd"/>
  <path d="M25 68 42 65m-12 9 17-3m-12 10 17-3" stroke="#b3b99c" stroke-width="1.3"/>
  <path d="M55 57h47l-5 19q-17 16-36-1Z" fill="#789c8d"/>
  <ellipse cx="79" cy="57" rx="24" ry="8" fill="#adc0a2"/><ellipse cx="79" cy="57" rx="17" ry="4" fill="#668c79"/>
  <path d="M64 70q14 8 29 0M67 77q11 5 23 0" fill="none" stroke="#c3c496" stroke-width="1.5"/>
  <path d="m80 51 12-26 6 3-10 27Z" fill="#b09a6b"/><path d="m90 30 7 3m-11 6 8 3" stroke="#d9ca97" stroke-width="1.5"/>
  <path d="M21 18 28 15 64 60 59 65Z" fill="#e4ead7"/>
  <path d="m21 18 3 12 35 35 2-3Z" fill="#94b3a6"/>
  <path d="m16 12 7-6 11 12-6 6Z" fill="#987548"/><path d="m22 13 4-4m0 9 5-4" stroke="#cbb47a" stroke-width="1.5"/>
  <path d="M16 62q9-14 25-18m-15 9 6-21m-10 26-11-11" fill="none" stroke="#62826b" stroke-width="2"/>
  <path d="M33 43q-12-1-11-13 12 0 11 13Zm-2 6q13 1 15-10-12-3-15 10ZM21 58q-14 1-13-11 11-1 13 11Zm12-23q-5-12 5-17 8 10-5 17Z" fill="#90ae83"/>
  <path d="M50 17q-6 7 0 13m10-18q-7 8 0 16m10-10q-6 7-1 12" fill="none" stroke="#a4b99d" stroke-width="1.4"/>
  <path d="m91 84 8-3 8 4-8 4Z" fill="#b59b63"/><path d="M39 93h13" stroke="#9d906c" stroke-width="1.2"/>
 `},
 推心置腹:{tone:'#8c8b64',wash:'#e2dfc5',subject:'两只敞开的手递送竹牍与青玉信物，红绳解开的竹函居中',body:`
  <path d="m24 39 48-13 24 22-47 17Z" fill="#c4a06b"/><path d="m25 39 25 20 46-11-1 19-45 16-24-22Z" fill="#9c794e"/>
  <path d="m33 40 35-9 18 15-35 12Z" fill="#e4c58e"/><path d="m40 39 16 14m-7-17 15 14m-6-17 15 14m-6-17 15 14" stroke="#b48f56" stroke-width="1.2"/>
  <path d="m27 48 22 19 43-13M50 65v17" fill="none" stroke="#d8b67a" stroke-width="1.5"/>
  <path d="M58 48q-12-20 4-23 12 5-4 23Zm1 0q14-16 20-7 0 10-20 7Z" fill="none" stroke="#b86a53" stroke-width="2.5"/>
  <path d="M59 48q-5 20-27 24m28-25q12 11 28 7" fill="none" stroke="#b86a53" stroke-width="2.3"/>
  <path d="m80 16 27 3-2 17-16-3-12 5-19-4 1-6 15 1-5-6 4-5Z" fill="#d5b78a"/>
  <path d="m97 16 17 3-4 20-13-5Z" fill="#63887c"/><path d="m100 20 10 2m-11 7 9 2" stroke="#a9baa0" stroke-width="1.2"/>
  <path d="m51 14 20 1-3 29-20-2Z" fill="#dfce9d"/><path d="m56 20 9 1m-10 6 9 1m-10 6 9 1" stroke="#8b9473" stroke-width="1.3"/>
  <path d="m14 75 19-1 12 7 24-5 4 5-21 13-20-2-14 2Z" fill="#dec198"/>
  <path d="m33 82 12 6 14-4" fill="none" stroke="#ae8a64" stroke-width="1.3"/>
  <path d="m7 76 14-2 5 23-17 2Z" fill="#a87662"/><path d="m12 80 8 17" stroke="#d7b186" stroke-width="1.5"/>
  <path d="m78 73 10-5 8 8-6 12-12-3Z" fill="#7d9c8a"/><path d="m83 76 5-2 3 3-3 5-5-1Z" fill="#dce2c6"/>
  <path d="M26 18h9m-5-5v10M82 96h21" fill="none" stroke="#b4a774" stroke-width="1.1"/>
 `},
 趁火打劫:{tone:'#9b785d',wash:'#e4d4bc',subject:'破墙与残灯旁，深色袖口伸手取走系口钱囊，远处余火隐约',body:`
  <path d="M15 75V33l13-5 9 10 14-5 4 41Z" fill="#aca88a"/>
  <path d="M16 47h35m-35 14h37M29 33v14m12 0v14M27 61v13" fill="none" stroke="#d6c9a5" stroke-width="1.4"/>
  <path d="M25 31q-7-10-2-21 2 7 8 9 5-9 3-14 16 14 5 29Z" fill="#bd7656" stroke="#a8704e" stroke-width="1.2"/>
  <path d="M29 31q-4-8 2-11 1 7 7 8l-3 5Z" fill="#e0b573" stroke="none"/>
  <path d="M77 24h22l-1 35-17 2Z" fill="#b68f59"/><path d="M80 29h16l-1 24-12 1Z" fill="#ddbb7d"/>
  <path d="M80 30 96 53m-13 1 13-25M76 22h24M79 59h21" fill="none" stroke="#786f4e" stroke-width="1.7"/>
  <path d="M85 22V14q3-7 8-1l2 9" fill="none" stroke="#8d7c56" stroke-width="1.6"/>
  <path d="M40 46q12-7 25 0l-5 11q23 12 13 34-15 12-34 0-11-18 7-34Z" fill="#c1a46a"/>
  <path d="M44 59q12 5 20-1M43 81q5 10 15 9" fill="none" stroke="#e2ca89" stroke-width="2"/>
  <path d="M42 52q11 6 23 0m-21 4q16 3 22-1" fill="none" stroke="#795f3f" stroke-width="2.2"/>
  <path d="m62 54 9 10-1 9m-11-19 8 15-1 7" fill="none" stroke="#a65b49" stroke-width="2"/>
  <path d="m87 65-17-7-13 4-5-3 8-9 12-1 19 6 18 2-3 17Z" fill="#c9ac82"/>
  <path d="m91 53 22 4-3 24-23-10Z" fill="#5c6c64"/><path d="m96 59-4 12" stroke="#a4b299" stroke-width="1.6"/>
  <path d="m68 57-9 2m15 3-9-3" fill="none" stroke="#9a7753" stroke-width="1.2"/>
  <ellipse cx="28" cy="90" rx="7" ry="4" fill="#ceb377"/><path d="M26 88h4v4h-4Z" fill="#8c7d51"/>
  <path d="M17 96h88M60 14q-7 9 0 17m6-21q-5 6-2 12" fill="none" stroke="#aeaa87" stroke-width="1.2"/>
 `},
});

export const YOUJIAN_SOURCE_VERSION='2020-09-21 + YJ01–YJ12';
export const YOUJIAN_SOURCE_DISCLOSURE='采用移动版2020-09-21历史核心，S0076实体资料与2023二手说明分层补充；YJ01–YJ12为江湖兼容裁定。当前客户端、全部移动版交互、原生整副牌库及完整六人身份模式均未核验。';
const official='https://www.sanguosha.cn/pc/news-detail-882.html';
const physical='https://www.bilibili.com/opus/909701299122995221';
const laterMobile='https://www.bilibili.com/opus/730689441788592137';
const slash='https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jibenpai/2013/0128/136.html';
const nullify='https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/99.html';
const tuixinCommunity='https://moegirl.uk/index.php?title=三国杀:推心置腹&variant=zh-cn';
export const YOUJIAN_SOURCE_PROVENANCE=freeze({
 source_game:'三国杀',source_version:YOUJIAN_SOURCE_VERSION,core_source_date:'2020-09-21',research_snapshot:'2026-10-15',
 historical_core_verified:true,core_effect_verified:true,current_client_verified:false,all_mobile_interactions_verified:false,
 source_micro_rulings_fully_verified:false,native_source_deck_complete:false,native_mobile_deck_verified:false,full_six_player_identity_mode:false,
 display_scope:'trusted_static_rule_reference_not_pack_activation',
 source_layers:[
  {id:'MOBILE2020',label:'官方历史核心 · 2020-09-21',url:official,scope:'五卡核心、普通交给与赠予区别'},
  {id:'PHYSICAL2020',label:'S0076实体照片 · 2024-06-09',url:physical,scope:'实体花色点数赠标、H/E/J区域与私有交牌；不证明移动版牌表'},
  {id:'MOBILE2023',label:'2023二手移动版说明',url:laterMobile,scope:'刺杀闪后空手与防具；并非官方当前客户端裁定'},
  {id:'SHA',label:'官方共享杀规则 · 2013',url:slash,scope:'只取共享杀规则，不移植国战牌数'},
  {id:'NULLIFY',label:'官方共享无懈规则 · 2013',url:nullify,scope:'普通无懈链，不含国战专属机制'},
  {id:'TUIXIN_COMMUNITY',label:'推心社区补充 · 未获官方认证',url:tuixinCommunity,scope:'非空前置与正数下界仅按YJ07本地重建'},
 ],
});
const commonTrick={type:'锦囊',kind:'非延时锦囊',recast:false,nullification:true,frequency_limit:null,
 timing:'自己的出牌阶段；完成用牌、目标触发及一次标准无懈链后开始完整效果',
 cost:'使用本牌或已获授权的转化材料；无额外宣布使用成本',
 limit:'本牌无独立每回合或每阶段次数上限；无重铸，不能作通用响应或桃式濒死救援',
 response:'效果前只有一次标准无懈链，可反无懈；不在复合步骤中间重开无懈，不能用闪抵消',
 face:'实际名称、花色、点数由宿主有效牌面投影显示；实体赠标仍由来源UI显示，复制功能不会生成赠标',
 acquisition:'用间兼容包默认关闭，开局显式开启后增加原有7装备、4毒及这五卡19张，共30张；本模块不注册牌库。五卡牌面来自S0076实体参照，不能称作移动版原生牌数',
 source_urls:[official,physical,nullify],
};
const rules={
 刺杀:{id:'sgs.mobile.youjian.cisha.20200921',effect_id:'basic.youjian.cisha',name:'刺杀',type:'刺杀',kind:'基本牌 · 杀家族独立子类',recast:false,nullification:false,frequency_limit:null,
 timing:'自己的出牌阶段主动使用；也可用于合法的杀使用或纯打出响应窗口',
 cost:'使用本牌或合法转化材料；使用者无额外成本。所需闪及逐次响应触发全部完成后，仅尚有手牌的目标再选择弃置1张自己的手牌',
 limit:'主动使用共享杀的攻击距离、配额与普通修正；默认出牌阶段1次杀配额，不新增第二次杀或额外次数限制',
 target:'主动或强制使用时为攻击范围内的一名其他合法存活角色，队友也可；决斗、南蛮等纯打出响应不另选攻击目标',
 effect:'造成基础1点普通属性杀伤害，不传导。全部所需闪完成后只检查一次：此时空手直接闪避；仍有手牌则弃1张手牌保留闪避，或拒弃让原刺杀继续造成原有伤害',
 flow:'双闪也只收一次弃牌，不能用装备区或判定区代付。弃牌先完成公开失牌、毒及完整濒死救援；获救后付款仍有效，最终死亡不再受杀。然后才到最终闪避钩子、贯石斧或追杀窗口',
 response:'可响应合法的杀使用/打出要求。纯打出不启动闪、刺弃牌或主动杀配额；转化成闪后不保留刺效果。刺杀不接受无懈可击',
 acquisition:'用间兼容包默认关闭，显式开启后按S0076实体参照加入10张刺杀，为五卡19张增量的一部分；本模块不注册牌库，未验证移动版初始牌数',
 face:commonTrick.face,
 notes:['拒弃不是追加1点伤害，也不是第二次用杀；伤害来源和材料仍为原刺杀者与原杀实体。','弃毒为无伤害来源的体力流失，不归因于刺杀者；不能跳过救援或重复收取弃牌。','普通伤害不等于普通杀。藤甲不免刺，黑刺仍受仁王盾；前者依据2023二手说明。朱雀羽扇/饮血剑的普通杀转换不作用于刺，为YJ01跨作裁定。'],
 compatibility_ids:['YJ01','YJ02','YJ03','YJ12'],source_urls:[official,physical,laterMobile,slash]},
 树上开花:{...commonTrick,id:'sgs.mobile.youjian.shushang_kaihua.20200921',effect_id:'trick.youjian.shushang_kaihua',name:'树上开花',
 target:'仅自己；不要求宣布使用前已有可弃牌，使用触发后可能先获得牌',
 cost:'使用本牌；额外弃置1至2张是无懈之后的效果，不是宣布成本。只能选本人手牌或装备区，不能选判定区或正在使用的本牌',
 effect:'一次批量弃置1至2张，再摸实际弃牌数N，加上是否至少含1张装备的布尔奖励：N + (含装备 ? 1 : 0)。手中的装备也算；两张装备共摸3张，绝不摸4张',
 flow:'在支付前冻结有效类别；完成整批离装、失牌、毒与濒死救援后才摸牌。最终死亡不摸；没有可弃牌时空结算，不凭空摸牌。摸牌沿用毒摸牌拦截',
 notes:['装备奖励最多额外1张，不采用BETA版逐张装备加摸。','本牌不可重铸。树的实体赠标可独立用于赠予；赠予树本身不发动树效果，也不算主动使用锦囊。'],
 compatibility_ids:['YJ04','YJ05','YJ11','YJ12']},
 刮骨疗毒:{...commonTrick,id:'sgs.mobile.youjian.guagu_liaodu.20200921',effect_id:'trick.youjian.guagu_liaodu',name:'刮骨疗毒',
 target:'一名宣布使用时已受伤的存活角色，包括自己、队友或敌方；无距离限制，不要求其持有毒',
 effect:'先回复目标1点体力，再由该目标选择是否弃置自己手中的1张实体毒。该次弃毒不触发毒的体力流失；也可不弃',
 flow:'回复受体力上限约束，走正常恢复钩子。先前合法目标中途已满血、实际回复为0时，只要仍存活仍可解毒；豁免只用于这一弃毒事件',
 notes:['允许自己；无重铸，不采用BETA的仅其他角色/可重铸版本。','只能弃1张手牌中的实体毒，不能以毒杀、状态标记或任意基本牌替代。此后公开失去其他毒仍会触发。','本牌不是桃、酒或药，不能作为濒死救援响应。'],
 compatibility_ids:['YJ06','YJ11','YJ12']},
 推心置腹:{...commonTrick,id:'sgs.mobile.youjian.tuixin_zhifu.20200921',effect_id:'trick.youjian.tuixin_zhifu',name:'推心置腹',
 target:'有效距离恰为1的一名其他存活角色，队友也可；武器攻击范围不能替代距离。YJ07明确采用有可获得H/E/J牌的前置条件',
 effect:'先从目标手牌、装备区、判定区一次批量获得至多2张牌；有可得牌时按YJ07选1至2张。随后从施术者当前手牌交还实际获得数N张，可以交还刚取得的原牌',
 flow:'这是先获得、后交给两段移动，不是预付交换。装备获得后入手，不自动装备；暗手选项不泄露牌面，装备/判定区公开。完成第一段全部触发后才选择返还，返还数量按实际获得数冻结',
 notes:['非空前置和正数下界为YJ07本地明确裁定；官方核心只写至多两张，不能标成官方微观核验。','YJ08：中途手牌不足则交现有可交手牌，不补摸、不造牌；角色最终死亡时停止不可能的后续步骤，不回滚已取得实体。','手牌取得及返还是普通私有H→H交给，不是赠予；战象不能拦，私有交毒不触发公开失毒。'],
 compatibility_ids:['YJ07','YJ08','YJ10','YJ11','YJ12'],source_nonempty_predicate_verified:false,source_urls:[official,physical,nullify,tuixinCommunity]},
 趁火打劫:{...commonTrick,id:'sgs.mobile.youjian.chenhuo_dajie.20200921',effect_id:'trick.youjian.chenhuo_dajie',name:'趁火打劫',
 target:'任意距离的一名其他存活且有手牌的角色，队友也可；仅有装备或判定牌不能满足条件',
 effect:'施术者选择目标的一张暗置手牌并公开展示；由目标选择把刚展示的精确实体交给施术者，或受到施术者造成的基础1点普通锦囊伤害',
 flow:'展示只改变公开知识，牌仍在目标手中。交给是普通私有H→H移动，不是赠予，战象不能拦。不能换另一张代付；不交时展示牌留在原手里',
 notes:['不能用闪响应；无需同花色弃牌。名字有火但不是火焰伤害，不传导，也不是体力流失。引蜂衣等正常锦囊伤害修正仍适用。','展示毒本身不失牌；展示后的私有交毒仍不触发公开失毒。公开知识不等于公开移动。','YJ09：展示实体异常消失时停止未完成分支，不替换实体、不凭空补伤害；原锦囊的材料用于伤害归因，不使用被展示的牌。'],
 compatibility_ids:['YJ09','YJ10','YJ11','YJ12']},
};
export const YOUJIAN_CARD_RULES=freeze(Object.fromEntries(Object.entries(rules).map(([name,rule])=>[name,{...YOUJIAN_SOURCE_PROVENANCE,...rule}])));

/** Explicit local compatibility, never a claim of publisher micro-rulings. */
export const YOUJIAN_LOCAL_POLICIES=freeze([
  {
    "id": "YJ01",
    "topic": "刺杀类型",
    "decision": "杀家族独立子类，普通伤害且不传导；不可由 nature=normal 推断它就是普通杀。藤甲不免刺、黑色刺仍被仁王盾防住，采用 MOBILE2023 补充。朱雀羽扇/饮血剑仅普通杀转换，不将刺转换或保留刺附效。后两项为江湖跨作裁定。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ02",
    "topic": "刺杀结算窗口",
    "decision": "先逐张完成所需闪及每次实际使用/失牌触发；只有达到全部闪需求后才检查一次刺杀弃牌。此时空手直接抵消；有手牌则由目标弃一张手牌或拒绝而让同一杀继续伤害。成功抵消的最终钩子、斧头与追杀窗口在刺弃牌决策后。双闪只收一次刺弃牌，不是每闪一张。细微排序是明示江湖裁定。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ03",
    "topic": "刺杀弃牌与死亡",
    "decision": "弃牌只能来自目标手牌，走公开真实移牌，毒及完整濒死先结算。不得拿装备或判定牌代付，不得给刺杀添加固定额外伤害或新杀计数。若弃毒后获救，付款仍有效；若目标最终死亡则不再结算对尸体的杀。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ04",
    "topic": "树上开花付款",
    "decision": "额外弃一至两张是锦囊效果，不是宣布使用的成本。先使用触发及无懈，再从本人H/E选择一批弃置；不可弃判定牌或正在使用的树上开花。无可弃牌时效果空结算而非凭空摸牌；不禁止最后一手树，因为使用触发可能先获得牌。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ05",
    "topic": "树上开花计数",
    "decision": "摸牌数为实际弃牌数，加上是否包含至少一张装备牌的布尔奖励。手中装备也计入；两装备只加一。支付时冻结有效类别供本次计数，跨作功能覆盖牌按支付前有效类别；原子移动完成离装、失牌、毒救援后才摸牌，最终死亡不摸。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ06",
    "topic": "刮骨疗毒顺序",
    "decision": "先回复1，再让该目标选是否弃自己手中一张实体毒；毒移动使用仅本事件 poison_exempt。不要求有毒才能选目标，不要求实际回复成功才开启弃毒（目标仍存活且可弃）；不把毒杀、标记、任意基本牌或后续毒永久豁免。不是濒死响应，不重铸。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ07",
    "topic": "推心置腹合法性边界",
    "decision": "使用时按有效距离=1及角色禁制判断其他存活角色，明示采用区域非空前置；选择可获得H/E/J中的1至2张作为一次批量获得，结算时已无可得牌则终止，不能凭空生成补偿。官方文字只写至多两张，非空前置和正数下界仅属社区补充及本地明确裁定，保留源微观未核验标记。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ08",
    "topic": "推心置腹两段移动",
    "decision": "先获得后交给，绝非原子交换或先付款。手牌选择不泄露暗牌；E/J公开。实际获得数N冻结，完成相关离区/获得触发后，由施术者从当前手牌交N张，允许交刚获得的原物；有不足则交现有全部，不补抽、不造牌。普通交给按私有手牌移动，战象不能拦。未核验的嵌套缩手/死亡行为明确按本地存活与尽量执行合同。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ09",
    "topic": "趁火打劫选择",
    "decision": "目标必须为有手牌的其他存活角色，无距离限制，队友合法。无懈通过后施术者选一张暗手牌并公开展示；目标自己选择交此精确实体或受施术者造成的1普通锦囊伤害。展示不移动，不能另付另一张牌，不使用闪响应。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ10",
    "topic": "展示不等于公开失去",
    "decision": "趁火展示结束后交牌使用私有H→H，依据印刷说明书毒备注；已公开知识与移动visibility是不同字段，不因大家知道牌面就触发毒。推心H→H及返还同理；E/J获得不是手牌失去。此印刷FAQ作为历史跨产品补充，不冒充当前移动客户端核验。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ11",
    "topic": "通用复合锦囊",
    "decision": "每个目标效果开始前只有一个标准无懈链；不在弃/摸、回/解毒、取/返、展示/选择之间另开无懈。先完成使用触发及目标钩子。按稳定use/branch/move ID保存、重放和去重；无牌/死亡动态边界用统一宿主合同，不回滚已经发生的成本和转移。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  },
  {
    "id": "YJ12",
    "topic": "功能复制与物理赠标",
    "decision": "曹操等复制有效功能时保留四锦囊完整目标/成本/效果和刺附效，使用历史不把赠予或纯响应打出记成主动使用。赠标属于实体来源，复制树上开花功能不会给一张本来无赠标的实体造赠标。转换刺为闪后不保留刺特效。",
    "status": "explicit_jianghu_compatibility_not_publisher_micro_ruling"
  }
]);

/** Physical reference ledger; registered by the host optional pack, not a native-mobile deck claim.
 * The legacy export name remains stable; this metadata itself never activates gifting. */
export const YOUJIAN_PHYSICAL_FACE_PROPOSAL=freeze({
  "status": "physical_reference_registered_in_optional_pack",
  "product": "S0076 physical reference",
  "source_url": "https://www.bilibili.com/opus/909701299122995221",
  "total_copies": 19,
  "native_mobile_deck_verified": false,
  "native_source_deck_complete": false,
  "default_on": false,
  "cards": [
    {
      "id": "sgs.mobile.youjian.cisha.20200921",
      "name": "刺杀",
      "product": "S0076 printed 用间篇, photographed in 2024",
      "native_mobile_deck_verified": false,
      "faces": [
        {
          "suit": "spade",
          "rank": 6,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "spade",
          "rank": 7,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "spade",
          "rank": 8,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 2,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 6,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 7,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 8,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 9,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "club",
          "rank": 10,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "diamond",
          "rank": 13,
          "copies": 1,
          "gift_mark": false
        }
      ],
      "total_copies": 10,
      "gift_marks_verified_from_photos": true
    },
    {
      "id": "sgs.mobile.youjian.shushang_kaihua.20200921",
      "name": "树上开花",
      "product": "S0076 printed 用间篇, photographed in 2024",
      "native_mobile_deck_verified": false,
      "faces": [
        {
          "suit": "diamond",
          "rank": 3,
          "copies": 1,
          "gift_mark": true
        },
        {
          "suit": "diamond",
          "rank": 4,
          "copies": 1,
          "gift_mark": true
        }
      ],
      "total_copies": 2,
      "gift_marks_verified_from_photos": true
    },
    {
      "id": "sgs.mobile.youjian.guagu_liaodu.20200921",
      "name": "刮骨疗毒",
      "product": "S0076 printed 用间篇, photographed in 2024",
      "native_mobile_deck_verified": false,
      "faces": [
        {
          "suit": "spade",
          "rank": 1,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "heart",
          "rank": 1,
          "copies": 1,
          "gift_mark": false
        }
      ],
      "total_copies": 2,
      "gift_marks_verified_from_photos": true
    },
    {
      "id": "sgs.mobile.youjian.tuixin_zhifu.20200921",
      "name": "推心置腹",
      "product": "S0076 printed 用间篇, photographed in 2024",
      "native_mobile_deck_verified": false,
      "faces": [
        {
          "suit": "diamond",
          "rank": 9,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "diamond",
          "rank": 10,
          "copies": 1,
          "gift_mark": false
        }
      ],
      "total_copies": 2,
      "gift_marks_verified_from_photos": true
    },
    {
      "id": "sgs.mobile.youjian.chenhuo_dajie.20200921",
      "name": "趁火打劫",
      "product": "S0076 printed 用间篇, photographed in 2024",
      "native_mobile_deck_verified": false,
      "faces": [
        {
          "suit": "spade",
          "rank": 12,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "spade",
          "rank": 13,
          "copies": 1,
          "gift_mark": false
        },
        {
          "suit": "heart",
          "rank": 6,
          "copies": 1,
          "gift_mark": false
        }
      ],
      "total_copies": 3,
      "gift_marks_verified_from_photos": true
    }
  ]
});
export const YOUJIAN_SOURCE_SIGNATURES=freeze({
  "sgs.mobile.youjian.cisha.20200921": "055d7a91f779db6bec86a9db1af7a579696ff5319416eaf8c87c03f2f9f1a560",
  "sgs.mobile.youjian.shushang_kaihua.20200921": "ac3d193c54dff5f40fb4e70a9b6fd23933a5ae3f58cdf5bb75dc9b516ee33fc7",
  "sgs.mobile.youjian.guagu_liaodu.20200921": "9e518280a80a15f59e648bbb79a17e8093dd80df3567d260ff348cf6f64ad009",
  "sgs.mobile.youjian.tuixin_zhifu.20200921": "7f53fc2a4f2c43a3a5d4a25aed773f51b4341f6fb012b169749ca01ea6a6fe4a",
  "sgs.mobile.youjian.chenhuo_dajie.20200921": "a9a5848b157e133b0f3e353b5e7ed95e92ab3855549ab8863f2d6c8db2474485"
});

/** Accept only a known effective card function, and ignore caller-supplied rule
 * prose, URLs and verification flags. A converted 闪 never regains 刺 by name. */
export function getYoujianCardRule(card){
 const rows=Object.values(YOUJIAN_CARD_RULES);
 if(typeof card==='string')return rows.find(r=>r.name===card||r.id===card||r.effect_id===card)??null;
 if(!card)return null;
 const record=rows.find(r=>[card.rule_id,card.canonical_id,card.id,card.effect_id].some(id=>id===r.id||id===r.effect_id))??YOUJIAN_CARD_RULES[card.name];
 if(!record||card.type!==undefined&&card.type!==record.type)return null;
 return record;
}
export const isYoujianCard=card=>Boolean(getYoujianCardRule(card));
const closeOnEscape=event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation?.();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}};
const sourceLabel=url=>YOUJIAN_SOURCE_PROVENANCE.source_layers.find(s=>s.url===url)?.label??'历史规则来源';

/** Read-only inspector: no game, card zones, RNG, history, or caller HTML. */
export function YoujianCardRules({card}){
 const record=getYoujianCardRule(card);if(!record)return null;
 return html`<section className="youjian-card-rules" data-youjian-card-rules=${record.id} aria-label=${`${record.name}完整规则`}>
  <strong>${record.name} · ${record.kind}</strong>
  <dl>${[['时机','timing'],['代价','cost'],['次数与响应限制','limit'],['目标','target'],['效果','effect'],['结算顺序','flow'],['响应与无懈','response'],['取得与牌库','acquisition'],['有效牌面与赠标','face']].map(([label,key])=>html`<${React.Fragment} key=${key}><dt>${label}</dt><dd>${record[key]}</dd></${React.Fragment}>`)}</dl>
  <ul>${record.notes.map((note,i)=>html`<li key=${i}>${note}</li>`)}</ul>
  <details className="youjian-card-policies" onKeyDown=${closeOnEscape}><summary>本牌的兼容边界 · ${record.compatibility_ids.join('、')}</summary>
   <ul>${YOUJIAN_LOCAL_POLICIES.filter(p=>record.compatibility_ids.includes(p.id)).map(p=>html`<li key=${p.id} data-youjian-policy=${p.id}><strong>${p.id} · ${p.topic}</strong><p>${p.decision}</p></li>`)}</ul>
  </details>
  <small data-source-version=${YOUJIAN_SOURCE_VERSION}>${YOUJIAN_SOURCE_DISCLOSURE}</small>
  <p className="youjian-card-source-links">${record.source_urls.map(url=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${sourceLabel(url)}</a>`)}</p>
 </section>`;
}
export function YoujianPolicyGuide(){return html`<details className="youjian-policy-guide" onKeyDown=${closeOnEscape}>
 <summary>用间五卡 · YJ01–YJ12兼容边界</summary><p>${YOUJIAN_SOURCE_DISCLOSURE}</p>
 <ol>${YOUJIAN_LOCAL_POLICIES.map(p=>html`<li key=${p.id} data-youjian-policy=${p.id}><strong>${p.id} · ${p.topic}</strong><p>${p.decision}</p></li>`)}</ol>
 </details>`;}
/** Importing or opening the guide neither enables a content pack nor supplies
 * physical suit/rank/gift badges. Those belong to the host's actual card face. */
export function YoujianCardsGuide(){return html`<details className="derived-equipment-guide youjian-cards-guide" onKeyDown=${closeOnEscape}>
 <summary>用间五卡图鉴 · 刺杀与四张锦囊</summary><p>${YOUJIAN_SOURCE_DISCLOSURE}</p>
 ${Object.values(YOUJIAN_CARD_RULES).map(card=>{const art=YOUJIAN_CARD_ART[card.name];return html`<details key=${card.id} className="youjian-card-guide-entry" data-youjian-card=${card.id} onKeyDown=${closeOnEscape}>
  <summary style=${{padding:'10px 14px',cursor:'pointer'}}><strong>${card.name}</strong> · ${card.kind}</summary>
  <div className="derived-guide-entry"><svg viewBox="0 0 120 104" width="120" height="104" aria-hidden="true" focusable="false" data-art-name=${card.name}><ellipse cx="60" cy="53" rx="48" ry="44" fill=${art.wash} opacity="0.75"/><g stroke="#494a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML=${{__html:art.body}}/></svg>
  <${YoujianCardRules} card=${card}/></div>
 </details>`;})}
 </details>`;}

/** Stable stage contracts shared with youjian-trick-effects / youjian-stab.
 * No regex over human messages and no inspection of option labels or hands. */
export const YOUJIAN_PROMPT_RULES=freeze({
 youjian_stab_hand_cost:{card_name:'刺杀',title:'闪后的一次弃牌选择',text:'全部所需闪与逐次响应触发已完成。此时有手牌者只能弃1张自己的手牌保留闪避，或让原刺杀继续命中；双闪也只收一次，空手免弃。',boundary:'装备区、判定区不能代付。公开弃毒须先完成体力流失与完整濒死救援；获救后不再收一次弃牌，最终死亡不再受杀。最后才继续最终闪避、贯石斧或追杀窗口。',compatibility_ids:['YJ02','YJ03']},
 youjian_tree_discard:{card_name:'树上开花',title:'先弃，再按实际数量摸牌',text:'无懈链已经结束。选择自己手牌或装备区的1至2张一次弃置；判定牌和正在使用的本牌不可选。弃牌属于效果，不能通过取消跳过必需的正数选择。',boundary:'摸牌数是实际弃牌数，加至多1张装备奖励；手中装备也算，两张装备共摸3张。先完成失牌、毒与救援，再摸牌；最终死亡不摸。',compatibility_ids:['YJ04','YJ05','YJ11']},
 youjian_detox:{card_name:'刮骨疗毒',title:'回复之后，自选是否解毒',text:'回复步骤已经完成。由目标决定是否弃置自己手中的1张实体毒，可选择不弃；不能弃毒杀、标记或两张毒。',boundary:'仅这一次弃毒免于毒的体力流失，不会形成永久免疫；回复实际为0但仍存活也可解毒。本锦囊不能当濒死救援牌，无重铸。',compatibility_ids:['YJ06','YJ11']},
 youjian_take:{card_name:'推心置腹',title:'从目标区域先获得1至2张',text:'目标按有效距离恰为1选择，武器范围不替代距离。选择目标手牌、装备区或判定区中可得的1至2张；暗手仅按牌位选择，不能先看牌面。',boundary:'这是第一段批量获得；装备取得后进入手牌，不自动装备。返还在全部取得触发之后才选，数量为实际获得数；非空与正数下界属于YJ07本地裁定。',compatibility_ids:['YJ07','YJ08','YJ10']},
 youjian_return:{card_name:'推心置腹',title:'按实际获得数，从当前手牌交还',text:'第一段已经完成。交还数量按实际获得数N冻结，从自己当前手牌选N张，允许把刚取得的原牌交回。',boundary:'如嵌套触发使当前手牌不足，按YJ08交现有可交手牌，不补摸、不造牌；死亡停止不可能的后续步骤。普通私有H→H交给不是赠予，战象不拦，私有交毒不触发公开失毒。',compatibility_ids:['YJ08','YJ10','YJ11']},
 youjian_reveal:{card_name:'趁火打劫',title:'施术者选择一个暗手牌位展示',text:'选择对方一张暗置手牌。展示之前只显示牌位；展示不移走牌，随后由目标决定交给这张精确实体或受伤。',boundary:'不能改成让目标挑展示牌。整段效果的无懈窗口已经结束，展示之后不再重开一次；展示毒不触发失毒。',compatibility_ids:['YJ09','YJ10','YJ11']},
 youjian_extort_branch:{card_name:'趁火打劫',title:'交这张牌，或受普通锦囊伤害',text:'只能交给刚展示的精确实体，不能换另一张代付；或选择受到施术者造成的基础1点普通锦囊伤害。不能用闪响应。',boundary:'交牌是普通私有H→H，不是赠予，战象不拦；已展示的毒仍不会因私有交给触发。伤害不是火焰、不传导，也不是体力流失；引蜂衣等正常锦囊修正照常。',compatibility_ids:['YJ09','YJ10']},
});
export function getYoujianPromptExplanation(prompt){
 const meta=prompt?.meta??prompt;if(!meta||typeof meta.stage!=='string')return null;
 if(meta.stage==='youjian_target'){
  const card=getYoujianCardRule(meta.card_rule_id??meta.rule_id??meta.card_name);
  if(!card||card.type!=='锦囊')return null;
  if(meta.card_name!==undefined&&meta.card_name!==card.name)return null;
  if([meta.card_rule_id,meta.rule_id].some(id=>id!==undefined&&id!==card.id))return null;
  return {stage:meta.stage,card_id:card.id,card_name:card.name,title:`${card.name}：选择目标`,text:card.target,boundary:'此时可取消，不消耗牌。确定合法使用后，先完成使用与目标触发，再经过一次标准无懈链。',compatibility_ids:card.compatibility_ids};
 }
 const entry=YOUJIAN_PROMPT_RULES[meta.stage];if(!entry)return null;
 if(meta.card_name!==undefined&&meta.card_name!==entry.card_name)return null;
 if([meta.card_rule_id,meta.rule_id].some(id=>id!==undefined&&id!==YOUJIAN_CARD_RULES[entry.card_name].id))return null;
 return {...entry,stage:meta.stage,card_id:YOUJIAN_CARD_RULES[entry.card_name].id};
}
export function YoujianPromptExplanation({prompt}){
 const detail=getYoujianPromptExplanation(prompt);if(!detail)return null;
 return html`<aside className="response-context youjian-prompt-explanation" data-youjian-prompt-stage=${detail.stage} data-youjian-card-rule=${detail.card_id} aria-label=${`${detail.card_name}当前选择说明`}>
  <strong>${detail.title}</strong><p>${detail.text}</p><p>${detail.boundary}</p>
  <small>历史2020-09-21核心 · ${detail.compatibility_ids.join('、')}兼容裁定；未核验当前客户端。</small>
 </aside>`;
}

export const isYoujianPrompt=prompt=>Boolean(getYoujianPromptExplanation(prompt));
export const isYoujianPromptStage=prompt=>prompt?.meta?.stage==='youjian_target'||Object.hasOwn(YOUJIAN_PROMPT_RULES,prompt?.meta?.stage??'');
/** Missing owners fail closed: these callbacks can contain the chooser's hand. */
export function isYoujianPromptOwner(prompt,state){
 const self=state?.players?.self?.seat,owner=prompt?.player_id,privateTo=prompt?.meta?.private_to;
 const same=seat=>Boolean(seat&&self&&(seat===self||['player','p1'].includes(seat)&&['player','p1'].includes(self)));
 return Boolean(isYoujianPrompt(prompt)&&same(owner)&&(privateTo===undefined||privateTo===null||same(privateTo)));
}
/** Options remain exactly the engine's IDs; blind stages cannot echo accidental
 * private labels, and only the explicitly revealed public face is illustrated. */
export function YoujianPromptOptions({prompt,state,onRespond,busy=false,CardView}){
 if(!isYoujianPromptOwner(prompt,state))return null;
 const stage=prompt.meta.stage;
 const revealed=stage==='youjian_extort_branch'?prompt.meta.revealed_card:null;
 const publicFace=revealed&&typeof revealed.name==='string'&&typeof revealed.suit==='string'&&Number.isInteger(revealed.rank)&&revealed.rank>=1&&revealed.rank<=13
  ?{name:revealed.name,type:revealed.type,suit:revealed.suit,rank:revealed.rank,rank_label:({1:'A',11:'J',12:'Q',13:'K'})[revealed.rank]??String(revealed.rank),color:['红桃','方块'].includes(revealed.suit)?'红':'黑'}:null;
 return html`<div className="youjian-prompt-options">
  ${publicFace?html`<section className="revealed-card" aria-label="刚展示的精确牌面" data-youjian-revealed="true">${CardView?html`<${CardView} card=${publicFace} compact=${true} />`:html`<strong>${publicFace.name} · ${publicFace.suit}${publicFace.rank_label}</strong>`}<small>只展示；此牌仍在目标手中。交牌只能交这一张。</small></section>`:null}
  <div className="dialog-actions wrap">${(prompt.options??[]).map(option=>{
   const hand=/^hand:([1-9]\d*)$/.exec(String(option.id));
   const blind=hand&&['youjian_take','youjian_reveal'].includes(stage);
   return html`<button key=${option.id} type="button" className="btn option" data-option-id=${option.id} data-youjian-blind=${blind?'true':undefined} disabled=${busy||!!option.disabled} onClick=${()=>{if(!busy&&!option.disabled)onRespond(option.id);}}>${blind?`暗置手牌 ${hand[1]}`:option.label}</button>`;
  })}</div>
  <small>触屏点选，或用 Tab / Enter 操作；仅有明确取消选项时可按 Escape。每次选择以当前提示为准。</small>
 </div>`;
}
export function YoujianHandRules({cards=[]}){
 const records=[...new Map(cards.filter(card=>card&&!card.hidden).map(card=>getYoujianCardRule(card)).filter(Boolean).map(record=>[record.id,record])).values()];
 if(!records.length)return null;
 return html`<details className="derived-equipment-guide youjian-hand-guide" data-youjian-hand-inspector="true" onKeyDown=${closeOnEscape}>
  <summary>手中用间牌规则 · ${records.map(r=>r.name).join('、')}</summary>
  <div style=${{maxHeight:'min(55dvh, 520px)',overflowY:'auto',padding:'0 14px 12px'}}>${records.map(record=>html`<details key=${record.id} data-youjian-hand-rule=${record.id} onKeyDown=${closeOnEscape}><summary>${record.name} · 完整规则与来源</summary><${YoujianCardRules} card=${record}/></details>`)}</div>
 </details>`;
}
