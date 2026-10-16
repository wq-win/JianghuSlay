import {rule_hero} from './effective-hero.js';
/** Source-closed historical YXS 澹台名 / 赵飞燕 / 铁木真.
 * Stable-ID registration belongs to skills.js. Shared rules and explicit
 * cross-game compatibility decisions: docs/yxs-fourth/module-rules.md.
 */
import {Card,CardColor,CardType,is_sha_card} from './models.js';

export const YXS_FOURTH_RULE_IDS=Object.freeze({
  dan:'yxs.adapted.base.hero.dan-tai-ming',
  zhao:'yxs.adapted.base.hero.zhao-fei-yan',
  tie:'yxs.adapted.base.hero.tie-mu-zhen',
});
export const YXS_QIANGLUE_WEAPON_ORDER='jianghu.sha_dodged.hero_before_weapon.v1';
/** An AI continuation policy, never a rule limit for human 玉步. */
export const YXS_YUBU_AI_MAX_JUDGMENTS=20;
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const labels={weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'};
const color=(game,card,actor)=>game.effective_color?.(card,actor,{judged_actor:actor})??card.color;
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const preparing=(game,actor)=>actor.alive&&game.turn_phase==='prepare'&&game.turn_actor===game.seat_of(actor);

/** Reuse the engine's red H/E -> ordinary SHA kernel, including post-cost
 * range, ordinary quota and response windows. No display-name dispatch. */
export const yxs_aojian_materials=(game,actor)=>game.skill_material_options(actor,{color:CardColor.RED}).filter(m=>!m.card.virtual);
export function yxs_aojian_targets(game,actor,material=null){
  const materials=material?[material]:yxs_aojian_materials(game,actor);
  return game.all_players().filter(target=>materials.some(m=>game.can_convert_material_to_sha(actor,target,m)));
}
export function yxs_aojian_available(game,actor,target=null){
  if(!game.is_own_play_phase(actor))return false;
  const targets=yxs_aojian_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export async function yxs_resolve_aojian(game,actor,target,material){
  if(!game.is_own_play_phase(actor))return false;
  const current=yxs_aojian_materials(game,actor).find(m=>m.id===material?.id&&m.zone===material.zone&&m.card===material.card);
  if(!current||!game.can_convert_material_to_sha(actor,target,current))return false;
  const paid=await game.consume_material(actor,current,{to:'processing',reason:'傲剑·当杀使用'});
  if(!paid)return false;
  if(!actor.alive||!target.alive){game.finish_processing_card(paid);return true;}
  const sha=new Card('杀',CardType.SHA,{...game.material_sha(actor,paid),source_skill:'yxs.aojian'});
  try{
    await game.use_sha(actor,target,`傲剑·${paid.name}当普通杀`,{
      source_card:sha,source_last_hand:current.zone==='hand'&&actor.hand.length===0,
      use_provenance:{kind:'skill_conversion',skill_id:'yxs.aojian',physical_cards:[paid],material_zone:current.zone},
    });
  }finally{game.finish_processing_card(sha);}
  return true;
}
export async function yxs_player_aojian(game,actor,_fallback,args=[]){
  if(!yxs_aojian_available(game,actor))return true;
  const material=await game.choose_skill_material(actor,args,{color:CardColor.RED,skill:'傲剑'});
  if(material===false)return false;if(!material)return true;
  const targets=yxs_aojian_targets(game,actor,material);
  if(!targets.length){game.view.emit('消耗这张牌后没有合法杀目标，未消耗素材。');return true;}
  const target=await game.choose_card_target(actor,targets,{card_name:'傲剑·普通杀',stage:'aojian_target',cancellable:true});
  if(target)await yxs_resolve_aojian(game,actor,target,material);return true;
}
export async function yxs_ai_aojian(game,actor,target){
  if(!yxs_aojian_available(game,actor)||actor.hand.some(is_sha_card))return false;
  const options=yxs_aojian_materials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b));
  for(const material of options){
    if(material.card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp)continue;
    const targets=yxs_aojian_targets(game,actor,material).filter(p=>game.side_of(p)!==game.side_of(actor));
    const chosen=targets.includes(target)?target:targets.sort((a,b)=>a.hp-b.hp)[0];
    if(chosen)return yxs_resolve_aojian(game,actor,chosen,material);
  }
  return false;
}

/** Preparation only, before delayed tricks. Each judgment uses the replaceable
 * shared kernel; only its final physical card can be gained. No draw modifier. */
export async function yxs_on_prepare_yubu(game,actor){
  if(!preparing(game,actor))return 0;
  let judgments=0,gained=0;
  while(preparing(game,actor)){
    const accepted=actor.is_ai?judgments<YXS_YUBU_AI_MAX_JUDGMENTS:await game.view.ask_confirm(
      gained?'玉步：已获得黑色判定牌，是否继续判定？':'玉步：是否在判定区结算前开始判定？黑色收入手牌并可继续，红色停止。',{
        player_id:game.seat_of(actor),meta:{skill:'玉步',stage:judgments?'yubu_continue':'yubu_start',judgments,gained},
      });
    if(!accepted||!preparing(game,actor))break;
    const judgment=await game.reveal_judgment(actor,'玉步',{good_for:actor,favorable:c=>c.color===CardColor.BLACK});
    if(!judgment)break;judgments++;
    try{
      if(!actor.alive||color(game,judgment,actor)!==CardColor.BLACK){
        game.view.emit(`${actor.name}玉步判定未获得黑色结果，停止。`);break;
      }
      const index=game.processing_cards.indexOf(judgment);
      if(index<0)throw Error('玉步最终判定牌不在结算区，不能重复获得。');
      game.processing_cards.splice(index,1);actor.hand.push(judgment);game.copied_card_moved?.(judgment,'hand',actor);gained++;
      game.view.emit(`${actor.name}发动玉步，获得最终黑色判定牌${judgment}。`);
    }finally{await game.finish_judgment_card(judgment);}
  }
  return gained;
}

/** A hand group contains no hidden card references. Public equipment and
 * effective delayed names are visible. Blind hand selection consumes RNG once. */
export function yxs_qianglue_options(game,target){
  const options=[];
  if(!target?.alive)return options;
  if(target.hand.length)options.push({id:'hand',zone:'hand',label:`随机获得1张手牌（共${target.hand.length}张，内容不可见）`});
  for(const slot of slots)if(target[slot])options.push({id:`eq:${slot}`,zone:slot,index:0,card:target[slot],label:`${labels[slot]}：${target[slot]}`});
  target.judgment_cards.forEach((card,index)=>options.push({id:`judgment:${index+1}`,zone:'judgment',index,card,
    label:`判定区：${game.effective_delayed_name(target,card)}（素材：${card}）`}));
  return options;
}
const harmfulDelayed=(game,target,option)=>option.zone==='judgment'
  &&['画地为牢','兵粮寸断','手捧雷'].includes(game.effective_delayed_name(target,option.card));
/** Team policy sees own identity, public teams, counts and public zones only.
 * Help an ally by taking a harmful delayed trick; never strip an ally's hand. */
export function yxs_ai_qianglue_option(game,actor,target,options=yxs_qianglue_options(game,target)){
  if(game.side_of(actor)===game.side_of(target))return options.find(o=>harmfulDelayed(game,target,o))??null;
  return options.find(o=>slots.includes(o.zone))??options.find(o=>o.zone==='hand')
    ??options.find(o=>!harmfulDelayed(game,target,o))??null;
}
function completedDodge(actor,target,event){
  return actor?.alive&&target?.alive&&event?.kind==='sha'&&(event.card_user??event.source)===actor
    &&event.target===target&&Number.isInteger(event.shans_required)&&event.shans_required>0
    &&event.shans_supplied>=event.shans_required&&(!event.source_card||is_sha_card(event.source_card));
}
/** Only the completed SHA-target dodge event enters here, not every SHAN, an
 * immunity or an incomplete two-SHAN response. Reserve once before any prompt. */
export async function yxs_on_sha_dodged_qianglue(game,actor,target,event){
  if(!completedDodge(actor,target,event))return false;
  const branch=event.branch_id??(event.card_use_id?`${event.card_use_id}:${game.seat_of(target)}`:null);
  if(!branch)return false;
  if(actor.qianglue_last_dodge_id===branch)return false;
  actor.qianglue_last_dodge_id=branch;
  if(!yxs_qianglue_options(game,target).length)return false;
  const accepted=actor.is_ai?!!yxs_ai_qianglue_option(game,actor,target):await game.view.ask_confirm(
    `强掠：${target.name}已完全闪避这次杀，是否判定？黑色可获得其手牌、装备或判定区的1张牌。`,{
      player_id:game.seat_of(actor),meta:{skill:'强掠',stage:'qianglue_start',target_seat:game.seat_of(target),branch_id:branch,
        shans_required:event.shans_required,shans_supplied:event.shans_supplied,compatibility:YXS_QIANGLUE_WEAPON_ORDER},
    });
  if(!accepted||!actor.alive||!target.alive)return false;
  const judgment=await game.reveal_judgment(actor,'强掠',{good_for:actor,favorable:c=>c.color===CardColor.BLACK});
  if(!judgment)return false;
  try{
    if(color(game,judgment,actor)!==CardColor.BLACK){game.view.emit(`${actor.name}强掠判定为红色，未获得牌。`);return false;}
    if(!actor.alive||!target.alive)return false;
    let options=yxs_qianglue_options(game,target),chosen=null;
    if(!options.length)return false;
    if(actor.is_ai)chosen=yxs_ai_qianglue_option(game,actor,target,options);
    else while(!chosen){
      const answer=String(await game.view.ask_line(`强掠：选择获得${target.name}的1张牌`,{
        kind:'select_target_card',player_id:game.seat_of(actor),options:options.map(({id,label})=>({id,label})),
        meta:{skill:'强掠',stage:'qianglue_card',target_seat:game.seat_of(target),target_zones:['hand',...slots,'judgment'],branch_id:branch},
      })).trim();
      chosen=select(options,answer);if(!chosen)game.view.emit('请选择可获得的手牌、装备或判定区牌。');
    }
    if(!chosen||!actor.alive||!target.alive)return false;
    options=yxs_qianglue_options(game,target);
    const current=options.find(o=>o.id===chosen.id&&(o.zone==='hand'||o.card===chosen.card));if(!current)return false;
    const material=current.zone==='hand'?(()=>{const index=Math.floor(game.rng.random()*target.hand.length);return {zone:'hand',index,card:target.hand[index]};})():current;
    const gained=await game.move_card_from_zone(target,material,{to:'hand',visibility:'private',recipient:actor,reason:'强掠'});
    if(!gained)return false;
    game.view.emit(`${actor.name}发动强掠，获得${target.name}的${current.zone==='hand'?'1张手牌':String(gained)}。`);
    return true;
  }finally{await game.finish_judgment_card(judgment);}
}

export function yxs_fourth_skill_definitions({SkillHooks,ActiveSkillDef}){
  const aojian=new ActiveSkillDef({skill_id:'傲剑',hotkey:'q',button_label:'傲剑',
    help_text:'傲剑：将一张红色手牌或装备当普通杀；消耗装备后重算距离，仍受杀次数限制',
    player:yxs_player_aojian,ai:yxs_ai_aojian,available:yxs_aojian_available});
  aojian.targets=yxs_aojian_targets;aojian.owns_target_selection=true;
  return {hooks:{
    [YXS_FOURTH_RULE_IDS.dan]:SkillHooks({response_sha_material_color:CardColor.RED,response_material_name:'傲剑'}),
    [YXS_FOURTH_RULE_IDS.zhao]:SkillHooks({on_prepare:[yxs_on_prepare_yubu],response_shan_hand_color:CardColor.BLACK,response_material_name:'轻影'}),
    [YXS_FOURTH_RULE_IDS.tie]:SkillHooks({distance_modifier:-1,on_sha_dodged:[yxs_on_sha_dodged_qianglue]}),
  },active:{[YXS_FOURTH_RULE_IDS.dan]:[aojian]}};
}
