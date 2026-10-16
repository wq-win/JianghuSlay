/** Mainland mobile public-catalog base 身份 华佗 / 曹仁, observed 2026-10-15.
 * Source text and historical FAQ edges are not live-client certification.
 * Host owns exact atomic movements, Peach resolution, recovery and orientation.
 */
import {Card,CardType,CardColor} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_WIND_HEAL_FLIP_RULE_IDS=Object.freeze({huatuo:'sgs.adapted.base.hero.hua-tuo',caoren:'sgs.adapted.base.hero.cao-ren'});
export const SGS_WIND_HEAL_FLIP_SKILL_IDS=Object.freeze({jijiu:'sgs.jijiu',qingnang:'sgs.qingnang',jushou:'sgs.jushou'});
export const SGS_WIND_HEAL_FLIP_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',current_client_rules_verified:false,current_client_hp_verified:false,
  heroes:Object.freeze([
    Object.freeze({id:SGS_WIND_HEAL_FLIP_RULE_IDS.huatuo,max_hp:3,gender:'male',source_faction:'群',skill_ids:Object.freeze(['sgs.jijiu','sgs.qingnang']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_WIND_HEAL_FLIP_RULE_IDS.caoren,max_hp:4,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.jushou']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-22.html','https://www.sanguosha.cn/pc/hero-detail-29.html',
    'https://www.sanguosha.com.tw/newsinfo_915.html','https://gltjk.com/sanguosha/rules/card/hero/wei.html']),
});
const ID=SGS_WIND_HEAL_FLIP_RULE_IDS,SK=SGS_WIND_HEAL_FLIP_SKILL_IDS;
const slots=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const skillOwners=Object.freeze({[SK.jijiu]:ID.huatuo,[SK.qingnang]:ID.huatuo,[SK.jushou]:ID.caoren});
const seat=(g,a)=>g.seat_of(a);
const identity=(g,a)=>g.player_id?.(a)??seat(g,a);
const living=a=>Boolean(a&&!a.dead);
const live=a=>living(a)&&a.hp>0;
const own=(a,skill)=>living(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&((a.effective_skill_ids??rule_hero(a)?.skill_ids)?.includes(skill)??(rule_hero(a)?.id===skillOwners[skill]));
const color=(g,c,a)=>g.effective_color?.(c,a)??c.color;
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
const stable=value=>typeof value==='string'&&value.trim().length>0||Number.isSafeInteger(value)&&value>0;
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const samePhysical=(a,b)=>a===b||physicalId(a)!==null&&physicalId(a)===physicalId(b);
const allPhysical=g=>[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
  ...g.all_players().flatMap(p=>[...p.hand,...(p.judgment_cards??[]),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...slots.map(s=>p[s]).filter(Boolean)])];
const uniquePhysical=(g,c)=>!!c&&!c.virtual&&allPhysical(g).filter(x=>samePhysical(x,c)).length===1;
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id));
const ownTurn=(g,a)=>typeof g.is_own_actual_turn==='function'?g.is_own_actual_turn(a):g.turn_actor===seat(g,a)&&g.actual_turn_active!==false;
const ongoing=g=>!g.winner&&(typeof g.match_should_continue!=='function'||g.match_should_continue());
const idlePlay=(g,a)=>live(a)&&ownTurn(g,a)&&g.is_own_play_phase(a)&&ongoing(g)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack'].some(k=>g[k]?.length);
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const privateMeta=(g,a,skill,skill_id,stage,extra={})=>({skill,skill_id,stage,private_to:seat(g,a),...extra});
function state(a){
  const s=a.sgs_wind_heal_flip_state??={version:1,counter:0,jijiu:{},qingnang:{},jushou:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['jijiu','qingnang','jushou'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS heal/flip receipt state');
  return s;
}
function nextEvent(g,a,skill){const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('SGS heal/flip event counter exhausted');return `${skill}:${JSON.stringify([identity(g,a),++s.counter])}`;}
const requireMovement=g=>{if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('华佗需要完整的 public_card_loss / validate / on_committed 内核');};

/** A live dying window is mandatory. In particular neither being wounded nor
 * being outside one's play phase grants a free off-turn Peach-use window.
 */
function jijiuWindow(g,a,dying){
  return own(a,SK.jijiu)&&(live(a)||a===dying)&&living(dying)&&dying.hp<=0&&!g.winner&&!ownTurn(g,a)
    &&g.dying_stack?.includes(seat(g,dying));
}
function jijiuMaterials(g,a,dying){
  if(!jijiuWindow(g,a,dying))return [];
  return g.skill_material_options(a).filter(m=>(m.zone==='hand'||slots.includes(m.zone))&&m.card&&!m.card.virtual&&color(g,m.card,a)===CardColor.RED);
}
export function sgs_jijiu_materials(g,a,dying){
  return jijiuMaterials(g,a,dying).map(material=>{
    // An offered choice can commit once, even if nested effects return its card.
    let attempted=false;
    return {...material,id:`jijiu:${material.id}`,material_id:material.id,skill:'急救',skill_id:SK.jijiu,
      commit:async()=>{if(attempted)return null;attempted=true;return sgs_commit_jijiu(g,a,dying,material);}};
  });
}
export async function sgs_commit_jijiu(g,a,dying,material){
  const raw={...material,id:material?.material_id??material?.id},current=exact(jijiuMaterials(g,a,dying),raw);
  if(!current||!uniquePhysical(g,current.card))return null;
  requireMovement(g);
  const event_id=nextEvent(g,a,SK.jijiu),s=state(a),form=rule_hero(a)?.id;
  // Freeze effective metadata BEFORE leave effects or copied-face reversion.
  const peach=new Card('桃',CardType.TAO,{virtual:true,materials:[current.card],physical_cards:[current.card],
    suit:g.effective_suit?.(current.card,a)??current.card.suit,color:color(g,current.card,a),rank:current.card.rank,
    source_skill:SK.jijiu,source_skill_id:SK.jijiu,source_game:'三国杀',source_rule_id:ID.huatuo});
  const receipt=s.jijiu[event_id]={event_id,status:'reserved',target_id:identity(g,dying),source_zone:current.zone,paid:false};
  try{
    const result=await g.public_card_loss(a,[current],{payment:true,to:'processing',visibility:'public',reason:'急救·当桃使用',action:'card_use',source_skill:SK.jijiu,move_id:`${event_id}:material`,
      validate:()=>rule_hero(a)?.id===form&&jijiuWindow(g,a,dying)&&!!exact(jijiuMaterials(g,a,dying),current)&&uniquePhysical(g,current.card),
      on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==current.card)throw Error('急救必须提交所选一张实体牌');receipt.paid=true;receipt.status='committed';receipt.move_id=movement.move_id;},
    });
    if(!result?.committed){receipt.status='unavailable';return null;}
    if(!receipt.paid)throw Error('急救移牌缺少提交回执；禁止重复支付');
    // A committed conversion survives skill loss; finalized death/game end and
    // a target already rescued by leave/loss effects stop the pending Peach.
    if(a.dead||dying.dead||dying.hp>0||g.winner){g.finish_processing_card(peach);receipt.status='ended_without_peach';return null;}
    receipt.status='handed_to_peach';g.view.emit(`${a.name}发动急救，将${current.card}当桃救援${dying.name}。`);
    return peach;
  }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
}

/** This ID belongs to a genuine entered play phase. A skipped play phase does
 * not allocate one; form changes and clearing legacy turn flags do not reset it.
 */
export function sgs_qingnang_phase_key(g,a){
  const phase=a?.play_phase_id??g.play_phase_event_counter;
  return stable(phase)?JSON.stringify([identity(g,a),phase]):null;
}
export const sgs_qingnang_materials=(g,a)=>living(a)?g.skill_material_options(a).filter(m=>m.zone==='hand'&&m.card&&!m.card.virtual):[];
export const sgs_qingnang_targets=(g,_a)=>g.all_players().filter(p=>live(p)&&p.hp<maxHP(g,p));
function qingnangAvailable(g,a,target=null,reserved=null){
  const key=sgs_qingnang_phase_key(g,a),receipt=a?.sgs_wind_heal_flip_state?.qingnang?.[key];
  if(!own(a,SK.qingnang)||!idlePlay(g,a)||!key||receipt&&receipt!==reserved||!sgs_qingnang_materials(g,a).length)return false;
  const targets=sgs_qingnang_targets(g,a);return target===null?targets.length>0:targets.includes(target);
}
export const sgs_qingnang_available=(g,a,target=null)=>qingnangAvailable(g,a,target);
export function sgs_qingnang_unavailable_reason(g,a){
  if(!own(a,SK.qingnang))return '当前没有可用的青囊技能';
  if(!idlePlay(g,a)||!sgs_qingnang_phase_key(g,a))return '只能在自己的空闲出牌阶段发动';
  if(a.sgs_wind_heal_flip_state?.qingnang?.[sgs_qingnang_phase_key(g,a)])return '本出牌阶段已发动青囊';
  if(!sgs_qingnang_materials(g,a).length)return '需要一张实体手牌，已装备的牌不能支付';
  return sgs_qingnang_targets(g,a).length?'':'没有存活且受伤的角色';
}
export async function sgs_resolve_qingnang(g,a,target,material){
  if(!sgs_qingnang_available(g,a,target))return false;
  const current=exact(sgs_qingnang_materials(g,a),material);if(!current||!uniquePhysical(g,current.card))return false;
  requireMovement(g);if(typeof g.recover_hp!=='function')throw Error('青囊需要 recover_hp 内核');
  const key=sgs_qingnang_phase_key(g,a),turn=g.turn_event_counter,form=rule_hero(a)?.id,event_id=nextEvent(g,a,SK.qingnang),s=state(a);
  const receipt=s.qingnang[key]={phase_key:key,event_id,target_id:identity(g,target),status:'reserved',paid:false,recovered:0};
  try{
    const result=await g.public_card_loss(a,[current],{payment:true,to:'discard',visibility:'public',reason:'青囊',action:'discard',source_skill:SK.qingnang,move_id:`${event_id}:cost`,
      validate:()=>key===sgs_qingnang_phase_key(g,a)&&turn===g.turn_event_counter&&form===rule_hero(a)?.id&&qingnangAvailable(g,a,target,receipt)
        &&!!exact(sgs_qingnang_materials(g,a),current)&&uniquePhysical(g,current.card),
      on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==current.card)throw Error('青囊必须提交所选一张实体手牌');receipt.paid=true;receipt.status='committed';receipt.move_id=movement.move_id;},
    });
    if(!result?.committed){if(!receipt.paid)delete s.qingnang[key];return false;}
    if(!receipt.paid)throw Error('青囊移牌缺少提交回执；禁止重复支付');
    // Cost/quota remain spent when nesting removes the need or ability to heal.
    // Skill/form loss alone cannot undo the already committed effect.
    if(live(a)&&live(target)&&target.hp<maxHP(g,target)&&ongoing(g))receipt.recovered=await g.recover_hp(target,1,{source:a,source_skill:SK.qingnang,recovery_event_id:`${event_id}:recover`});
    receipt.status='done';g.view.emit(`${a.name}发动青囊，${target.name}回复${receipt.recovered}点体力。`);return true;
  }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
}
async function chooseQingnangMaterial(g,a,args){
  const options=sgs_qingnang_materials(g,a),phase=sgs_qingnang_phase_key(g,a),turn=g.turn_event_counter,form=rule_hero(a)?.id;
  if(args.length){if(args.length===1&&pass(args[0]))return null;return args.length===1?options.find(o=>o.id===(/^\d+$/.test(args[0])?`hand:${Number(args[0])}`:args[0]))??false:false;}
  while(true){
    const answer=await g.view.ask_line('青囊：弃置一张手牌，或取消',{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌或次数'}],
      meta:privateMeta(g,a,'青囊',SK.qingnang,'qingnang_material',{material_zones:['hand'],min_count:1,max_count:1}),
    });
    if(pass(answer)||phase!==sgs_qingnang_phase_key(g,a)||turn!==g.turn_event_counter||form!==rule_hero(a)?.id||!sgs_qingnang_available(g,a))return null;const selected=select(options,answer);if(selected)return selected;g.view.emit('请选择一张手牌，或取消。');
  }
}
export async function sgs_player_qingnang(g,a,_fallback,args=[]){
  if(!sgs_qingnang_available(g,a)){g.view.emit(`青囊：${sgs_qingnang_unavailable_reason(g,a)}。`);return true;}
  const phase=sgs_qingnang_phase_key(g,a),turn=g.turn_event_counter,form=rule_hero(a)?.id;
  const material=await chooseQingnangMaterial(g,a,args);if(material===false)return false;if(!material)return true;
  if(phase!==sgs_qingnang_phase_key(g,a)||turn!==g.turn_event_counter||form!==rule_hero(a)?.id||!sgs_qingnang_available(g,a))return true;
  const targets=sgs_qingnang_targets(g,a),options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${p.hp}/${maxHP(g,p)}体力）`}));
  while(targets.length){
    const answer=await g.view.ask_line('青囊：选择一名受伤角色，可以选择自己、队友或敌人',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗牌或次数'}],
      meta:privateMeta(g,a,'青囊',SK.qingnang,'qingnang_target',{allow_self:true,allow_allies:true}),
    });
    if(pass(answer)||phase!==sgs_qingnang_phase_key(g,a)||turn!==g.turn_event_counter||form!==rule_hero(a)?.id||!sgs_qingnang_available(g,a))return true;
    const selected=select(options,answer),target=targets.find(p=>seat(g,p)===selected?.id);
    if(target){if(phase===sgs_qingnang_phase_key(g,a)&&turn===g.turn_event_counter&&form===rule_hero(a)?.id)await sgs_resolve_qingnang(g,a,target,material);return true;}
    g.view.emit('请选择一名受伤角色，或取消。');
  }
  return true;
}
export async function sgs_ai_qingnang(g,a){
  if(!sgs_qingnang_available(g,a))return false;
  const target=sgs_qingnang_targets(g,a).filter(p=>g.side_of(p)===g.side_of(a)).sort((x,y)=>x.hp-y.hp||(maxHP(g,y)-y.hp)-(maxHP(g,x)-x.hp))[0];
  if(!target)return false;
  // Public allegiance/HP and OWN cards only. Preserve red rescue stock when an
  // otherwise comparable black card can pay; this is never a human restriction.
  const materials=sgs_qingnang_materials(g,a).sort((x,y)=>(g.material_ai_cost(x)+(color(g,x.card,a)===CardColor.RED?2:0))-(g.material_ai_cost(y)+(color(g,y.card,a)===CardColor.RED?2:0)));
  return sgs_resolve_qingnang(g,a,target,materials[0]);
}

const ownEnd=(g,a)=>live(a)&&own(a,SK.jushou)&&ownTurn(g,a)&&g.turn_phase==='end_phase'&&ongoing(g);
const endId=event=>event?.phase_event_id??event?.event_id;
/** Public state only. An already face-down general gains cards and turns up;
 * a healthy general holding a large hand may keep the next turn instead.
 */
export const sgs_ai_jushou_decision=(_g,a)=>a.face_orientation==='face_down'||a.hp<=2||a.hand.length<=a.hp+1;
export async function sgs_on_end_phase_jushou(g,a,_target=null,event={}){
  const event_id=endId(event);if(!ownEnd(g,a)||!stable(event_id)||event.cancelled||event.closed)return false;
  const key=JSON.stringify(event_id),s=state(a),request={event_id,actor_id:identity(g,a),turn_id:g.turn_event_counter,end_phase_id:g.end_phase_event_counter};
  const previous=s.jushou[key];
  if(previous){if(JSON.stringify(previous.request)!==JSON.stringify(request))throw Error('据守结束阶段事件不能改写原始时点');return false;}
  if(typeof g.flip_general!=='function')throw Error('据守需要真实武将翻面与整回合跳过内核');
  const receipt=s.jushou[key]={event_id,request,status:'offered',accepted:false,drawn:0,flipped:false},form=rule_hero(a)?.id;
  try{
    const accepted=a.is_ai?sgs_ai_jushou_decision(g,a):await g.view.ask_confirm('据守：弃牌阶段已结束，是否摸三张牌，然后将武将牌翻面？',{
      player_id:seat(g,a),meta:{skill:'据守',skill_id:SK.jushou,stage:'jushou_start',after_discard:true,draw_count:3,flip_required:true,phase_event_id:event_id},
    });
    receipt.accepted=Boolean(accepted);
    if(!accepted||!ownEnd(g,a)||event.cancelled||event.closed||endId(event)!==event_id||form!==rule_hero(a)?.id
      ||request.turn_id!==g.turn_event_counter||request.end_phase_id!==g.end_phase_event_counter){receipt.status='passed';return false;}
    receipt.status='drawing';const cards=await g.draw_cards(a,3);receipt.drawn=Array.isArray(cards)?cards.length:3;
    // Draw/obtain effects fully finish first. The chosen flip is compulsory even
    // if orientation, form or skill possession changes during those effects.
    if(live(a)&&ongoing(g)){
      receipt.status='flipping';await g.flip_general(a,{source_skill:SK.jushou,event_id:`sgs.jushou:${JSON.stringify([identity(g,a),event_id])}:flip`});receipt.flipped=true;
    }
    receipt.status='done';g.view.emit(`${a.name}发动据守，摸${receipt.drawn}张牌${receipt.flipped?'并翻面':''}。`);return true;
  }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
}

export function sgs_wind_heal_flip_skill_definitions({SkillHooks,ActiveSkillDef}){
  const qingnang=new ActiveSkillDef({skill_id:'青囊',hotkey:'q',button_label:'青囊',player:sgs_player_qingnang,ai:sgs_ai_qingnang,available:sgs_qingnang_available,
    help_text:'青囊：每个自己的出牌阶段限一次，弃一张任意颜色手牌，令任意一名受伤角色回复1点体力。',min_cards:1,max_cards:1,card_filter:'any'});
  qingnang.targets=sgs_qingnang_targets;qingnang.owns_target_selection=true;qingnang.unavailable_reason=sgs_qingnang_unavailable_reason;
  return {hooks:{[ID.huatuo]:SkillHooks({rescue_material_options:[sgs_jijiu_materials]}),[ID.caoren]:SkillHooks({on_end_phase:[sgs_on_end_phase_jushou]})},active:{[ID.huatuo]:[qingnang]}};
}
