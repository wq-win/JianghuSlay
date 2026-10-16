import {rule_hero} from './effective-hero.js';
/** Historical YXS 慕容 / 时迁 / 陈圆圆, independently registered by stable ID.
 * Source and explicit mixed-game boundaries: docs/yxs-fourth/trick-rules.md.
 */
import {Card,CardType,CardSuit} from './models.js';

export const YXS_FOURTH_TRICK_RULE_IDS=Object.freeze({
  mu:'yxs.adapted.base.hero.mu-rong',
  shi:'yxs.adapted.base.hero.shi-qian',
  chen:'yxs.adapted.base.hero.chen-yuan-yuan',
});
export const YXS_DIEHUN_IRON_CHAIN_POLICY='jianghu.diehun.iron_chain_default_multi.v1';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const ownPlay=(game,actor)=>game.is_own_play_phase(actor)&&!actor.skip_play_stage;
const hasCard=target=>target.hand.length>0||target.judgment_cards.length>0||slots.some(slot=>target[slot]);
const harmfulJudgments=(game,target)=>target.judgment_cards.filter(card=>
  ['画地为牢','兵粮寸断','手捧雷'].includes(game.effective_delayed_name(target,card)));

/** Eligibility is card-default topology, never the number of surviving targets.
 * A legal target event is required, including when the caster is the owner. */
export function yxs_diehun_eligible(actor,event){
  return !!actor?.alive&&event?.target===actor&&event.card?.type===CardType.SCROLL
    &&event.default_multi===true&&Array.isArray(event.targets)&&event.targets.includes(actor);
}
export function yxs_ai_diehun(_game,actor,event){
  if(event.card.name==='铁索连环')return !actor.chained;
  // Future source cards may reuse this hook, but are not in the shipped deck.
  if(['休养生息','桃园结义'].includes(event.card.name))return actor.hp>=rule_hero(actor).max_hp;
  return true;
}
export async function yxs_before_trick_target_diehun(game,actor,event){
  if(!yxs_diehun_eligible(actor,event))return false;
  event.diehun_receipts??=[];
  const seat=game.seat_of(actor),existing=event.diehun_receipts.find(r=>r.seat===seat);
  if(existing)return existing.skipped;
  // Reserve before asking; duplicate dispatch never prompts or draws twice.
  const receipt={seat,skipped:false};event.diehun_receipts.push(receipt);
  const accepted=actor.is_ai?yxs_ai_diehun(game,actor,event):await game.view.ask_confirm(
    `蝶魂：是否跳过「${event.card.name}」对自己的效果，并摸1张牌？`,{
      player_id:seat,meta:{skill:'蝶魂',stage:'diehun',card_name:event.card.name,
        target_seat:seat,source_seat:game.seat_of(event.actor??event.source),
        default_multi:true,actual_target_count:event.targets.length,
        ...(event.card.name==='铁索连环'?{compatibility:YXS_DIEHUN_IRON_CHAIN_POLICY}:{})},
    });
  if(!accepted||!yxs_diehun_eligible(actor,event))return false;
  receipt.skipped=true;await game.draw_cards(actor,1);
  game.view.emit(`${actor.name}发动蝶魂，跳过${event.card.name}对自己的效果，摸1张牌。`);
  return true;
}

export function yxs_shentou_materials(game,actor){
  return game.skill_material_options(actor).filter(m=>m.zone==='hand'&&!m.card.virtual
    &&(game.effective_suit?.(m.card,actor)??m.card.suit)===CardSuit.CLUB);
}
export function yxs_shentou_targets(game,actor){
  return game.all_players().filter(p=>p!==actor&&p.alive&&hasCard(p)&&game.can_use_shunshou(actor,p));
}
export function yxs_shentou_available(game,actor,target=null){
  if(!ownPlay(game,actor)||!yxs_shentou_materials(game,actor).length)return false;
  const targets=yxs_shentou_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
async function chooseMaterial(game,actor,args,skill,materials){
  const options=materials(game,actor);
  if(args.length){
    const id=args.length===1&&/^\d+$/.test(args[0])?`hand:${Number(args[0])}`
      :args.length===2&&args[0].toLowerCase()==='eq'?`eq:${game.normalize_equipment_slot(args[1])}`:null;
    return id?options.find(m=>m.id===id)??null:false;
  }
  while(true){
    const answer=String(await game.view.ask_line(`${skill}：选择1张${skill==='神偷'?'梅花手牌':'手牌或装备'}作为成本`,{
      kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill,stage:skill==='神偷'?'shentou_material':'hongyan_material',private_to:game.seat_of(actor),
        material_zones:skill==='神偷'?['hand']:['hand',...slots]},
    })).trim();
    if(['cancel','0'].includes(answer))return null;
    const material=select(options,answer);if(material)return material;
    game.view.emit('请选择有效素材，或取消发动。');
  }
}
export async function yxs_resolve_shentou(game,actor,target,material){
  if(!yxs_shentou_available(game,actor,target))return false;
  const current=yxs_shentou_materials(game,actor).find(m=>m.id===material?.id&&m.card===material.card);
  if(!current)return false;
  const paid=await game.consume_material(actor,current,{to:'processing',reason:'神偷·探囊取物'});
  if(!paid)return false;
  if(!actor.alive||!target.alive){game.finish_processing_card(paid);return true;}
  const trick=new Card('顺手牵羊',CardType.SCROLL,{suit:game.effective_suit?.(paid,actor)??paid.suit,
    color:game.effective_color?.(paid,actor)??paid.color,rank:paid.rank,virtual:true,materials:[paid],
    source_skill:'yxs.shentou',source_original_name:'探囊取物',source_game:'英雄杀',
    source_rule_id:'yxs.shared.trick.tannang-quwu',source_version:'腾讯手游2015基础英雄历史规则'});
  try{
    game.view.emit(`${actor.name}发动神偷，将${paid}当探囊取物（顺手牵羊）使用。`);
    await game.resolve_scroll(actor,target,trick,{trick_declaration_validated:true});
  }finally{game.finish_processing_card(trick);}
  return true;
}
export async function yxs_player_shentou(game,actor,_fallback,args=[]){
  if(!yxs_shentou_available(game,actor))return true;
  const material=await chooseMaterial(game,actor,args,'神偷',yxs_shentou_materials);
  if(material===false)return false;if(!material)return true;
  const target=await game.choose_card_target(actor,yxs_shentou_targets(game,actor),{
    card_name:'神偷·探囊取物',stage:'shentou_target',cancellable:true,
  });
  if(target)await yxs_resolve_shentou(game,actor,target,material);return true;
}
/** Only own card values and public teams/zones/counts. Ally relief beats theft;
 * never repeatedly strip friendly cards simply because they are legal targets. */
export async function yxs_ai_shentou(game,actor,target){
  if(!yxs_shentou_available(game,actor))return false;
  const candidates=yxs_shentou_targets(game,actor);
  const ally=candidates.find(p=>game.side_of(p)===game.side_of(actor)&&harmfulJudgments(game,p).length);
  const enemies=candidates.filter(p=>game.side_of(p)!==game.side_of(actor)
    &&(p.hand.length||slots.some(slot=>p[slot])||p.judgment_cards.length>harmfulJudgments(game,p).length));
  const chosen=ally??(enemies.includes(target)?target:enemies[0]);if(!chosen)return false;
  const materials=yxs_shentou_materials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b));
  const material=materials.find(m=>!(m.card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp));
  return material?yxs_resolve_shentou(game,actor,chosen,material):false;
}

export const yxs_hongyan_materials=(game,actor)=>game.skill_material_options(actor)
  .filter(m=>!m.card.virtual&&(m.zone==='hand'||slots.includes(m.zone)));
/** Runtime gender is explicit, provenance-labelled metadata. Neither display
 * names nor portrait appearance can decide whether an unknown hero is male. */
const maleParticipants=(game,actor)=>game.all_players().filter(p=>p!==actor&&p.alive&&(game.effective_gender?game.effective_gender(p):rule_hero(p).gender)==='male');
const legalPair=(game,first,second)=>first!==second&&game.can_duel_target(second,first,{allow_allies:true});
export function yxs_hongyan_targets(game,actor){
  const males=maleParticipants(game,actor);return males.filter(first=>males.some(second=>legalPair(game,first,second)));
}
export function yxs_hongyan_available(game,actor,target=null){
  if(!ownPlay(game,actor)||actor.used_active_skills.has('红颜')||!yxs_hongyan_materials(game,actor).length)return false;
  const targets=yxs_hongyan_targets(game,actor);
  return targets.length>0&&(target==null||targets.includes(target));
}
export async function yxs_resolve_hongyan(game,actor,first,second,material){
  if(!yxs_hongyan_available(game,actor)||first===second)return false;
  const targets=maleParticipants(game,actor);
  if(!targets.includes(first)||!targets.includes(second)||!legalPair(game,first,second))return false;
  const current=yxs_hongyan_materials(game,actor).find(m=>m.id===material?.id&&m.zone===material.zone&&m.card===material.card);
  if(!current)return false;
  actor.used_active_skills.add('红颜');
  // Commit once before equipment-loss hooks; nested draws are not this cost.
  const paid=await game.consume_material_batch(actor,[current],{to:'discard',reason:'红颜'});
  if(!paid){actor.used_active_skills.delete('红颜');return false;}
  if(!actor.alive||!first.alive||!second.alive)return true;
  game.view.emit(`${actor.name}发动红颜，使${first.name}与${second.name}决斗；${first.name}先响应杀。`);
  await game.resolve_duel(second,first,null,{allow_allies:true,
    skill_initiator:actor,card_user:null,source_skill:'yxs.hongyan'});
  return true;
}
export async function yxs_player_hongyan(game,actor,_fallback,args=[]){
  if(!yxs_hongyan_available(game,actor))return true;
  const material=await chooseMaterial(game,actor,args,'红颜',yxs_hongyan_materials);
  if(material===false)return false;if(!material)return true;
  const first=await game.choose_card_target(actor,yxs_hongyan_targets(game,actor),{
    card_name:'红颜·先响应杀者',stage:'hongyan_first',cancellable:true,
  });if(!first)return true;
  const second=await game.choose_card_target(actor,maleParticipants(game,actor).filter(p=>legalPair(game,first,p)),{
    card_name:'红颜·另一名男性',stage:'hongyan_second',cancellable:true,
  });if(second)await yxs_resolve_hongyan(game,actor,first,second,material);return true;
}
/** At most N*(N-1) public pair comparisons. Prefer enemy/enemy; for an allied
 * second participant require a public advantage rather than inspect their hand. */
export function yxs_ai_hongyan_pair(game,actor){
  const targets=maleParticipants(game,actor),pairs=[];
  for(const first of targets)for(const second of targets){
    if(!legalPair(game,first,second)||game.side_of(first)===game.side_of(actor))continue;
    const secondEnemy=game.side_of(second)!==game.side_of(actor);
    const secondBawang=rule_hero(second).id==='yxs.adapted.base.hero.xiang-yu';
    if(!secondEnemy&&!(first.hand.length===0||second.hand.length>first.hand.length+(secondBawang?-1:1)))continue;
    pairs.push({first,second,score:(secondEnemy?100:0)+10*(first.hand.length===0)+3*(secondBawang?1:0)
      +Math.min(5,second.hand.length)-Math.min(5,first.hand.length)+(first.hp===1?4:0)});
  }
  return pairs.sort((a,b)=>b.score-a.score)[0]??null;
}
export async function yxs_ai_hongyan(game,actor){
  if(!yxs_hongyan_available(game,actor))return false;
  const pair=yxs_ai_hongyan_pair(game,actor);if(!pair)return false;
  const material=yxs_hongyan_materials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b))
    .find(m=>!(m.card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp));
  return material?yxs_resolve_hongyan(game,actor,pair.first,pair.second,material):false;
}

export async function yxs_on_end_phase_chuchu(game,actor){
  const eligible=()=>actor.alive&&game.turn_actor===game.seat_of(actor)&&game.turn_phase==='end_phase';
  if(!eligible())return false;
  const key=`${game.turn_event_counter??0}:${game.round_no??0}:${game.turn_actor}`;
  if(actor.chuchu_end_phase_receipt===key)return false;
  actor.chuchu_end_phase_receipt=key;
  const accepted=actor.is_ai||await game.view.ask_confirm('楚楚：是否在弃牌结束后摸1张牌？',{
    player_id:game.seat_of(actor),meta:{skill:'楚楚',stage:'chuchu',after_discard:true},
  });
  if(!accepted||!eligible())return false;
  await game.draw_cards(actor,1);game.view.emit(`${actor.name}发动楚楚，在结束阶段摸1张牌。`);return true;
}

export function yxs_fourth_trick_skill_definitions({SkillHooks,ActiveSkillDef}){
  const shentou=new ActiveSkillDef({skill_id:'神偷',hotkey:'q',button_label:'神偷',
    help_text:'神偷：将1张梅花手牌当探囊取物，无距离限制，允许合法队友目标与判定区牌',
    player:yxs_player_shentou,ai:yxs_ai_shentou,available:yxs_shentou_available});
  shentou.targets=yxs_shentou_targets;shentou.owns_target_selection=true;
  const hongyan=new ActiveSkillDef({skill_id:'红颜',hotkey:'q',button_label:'红颜',
    help_text:'红颜：每回合一次，弃1张手牌或装备，使两名男性决斗；先选者先响应，不可无懈',
    player:yxs_player_hongyan,ai:yxs_ai_hongyan,available:yxs_hongyan_available});
  hongyan.targets=yxs_hongyan_targets;hongyan.owns_target_selection=true;
  return {hooks:{
    [YXS_FOURTH_TRICK_RULE_IDS.mu]:SkillHooks({before_trick_target_nullification:[yxs_before_trick_target_diehun]}),
    [YXS_FOURTH_TRICK_RULE_IDS.shi]:SkillHooks({immune_to_shunshou:true,shunshou_no_distance_limit:true}),
    [YXS_FOURTH_TRICK_RULE_IDS.chen]:SkillHooks({on_end_phase:[yxs_on_end_phase_chuchu]}),
  },active:{[YXS_FOURTH_TRICK_RULE_IDS.shi]:[shentou],[YXS_FOURTH_TRICK_RULE_IDS.chen]:[hongyan]}};
}
