/** Source-closed historical YXS packet, bound to stable IDs in skills.js.
 * See docs/yxs-next/source-mapping.md for sources and canonical alias boundaries.
 */
import {Card,CardColor,CardType} from './models.js';

export const YXS_NEXT_RULE_IDS=Object.freeze({
  yang:'yxs.adapted.base.hero.yang-yan-zhao',
  zhao:'yxs.adapted.base.hero.zhao-kuang-yin',
  chen:'yxs.adapted.base.hero.chen-sheng',
});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(value)?options[Number(value)-1]:null);
const others=(game,actor)=>game.all_players().filter(p=>p!==actor&&p.alive);
const hasCard=target=>target.hand.length>0||target.judgment_cards.length>0||slots.some(slot=>target[slot]);

/** Pure projections: no log, prompt, card movement or random choice. */
export const yxs_shiquan_targets=(game,actor)=>others(game,actor).filter(p=>hasCard(p)&&game.can_trick_target(actor,p,{type:CardType.SCROLL,name:'釜底抽薪'}));
export const yxs_qiyi_targets=(game,actor)=>others(game,actor).filter(p=>p.hand.length>0);
export function yxs_shiquan_available(game,actor,target=null){
  if(!game.is_own_play_phase(actor)||!game.skill_material_options(actor,{color:CardColor.BLACK}).length)return false;
  const targets=yxs_shiquan_targets(game,actor);
  return target==null?targets.length>0:targets.includes(target);
}

async function resolve_shiquan(game,actor,target,material){
  // Prompts are provisional. Revalidate the exact physical cost and target before
  // moving anything; a stale index must never silently spend a different card.
  if(!yxs_shiquan_available(game,actor,target)
    ||!game.skill_material_options(actor,{color:CardColor.BLACK}).some(m=>m.id===material.id&&m.card===material.card))return false;
  const cost=await game.consume_material(actor,material,{to:'processing',reason:'释权'});
  if(!cost)return false;
  if(!actor.alive||!target.alive){game.finish_processing_card(cost);return true;}
  const trick=new Card('釜底抽薪',CardType.SCROLL,{suit:game.effective_suit?.(cost,actor)??cost.suit,color:game.effective_color?.(cost,actor)??cost.color,rank:cost.rank,virtual:true,materials:[cost]});
  try{
    game.view.emit(`${actor.name}发动释权，将${cost}当釜底抽薪使用。`);
    // Shared engine owns the real counterspell stack and target-zone choice.
    // Keep the physical cost out of a reshuffle until resolution has finished.
    await game.resolve_scroll(actor,target,trick,{trick_declaration_validated:true});
  }finally{game.finish_processing_card(cost);}
  return true;
}

async function player_shiquan(game,actor,_fallback,args){
  if(!yxs_shiquan_available(game,actor))return true;
  const material=await choose_shiquan_material(game,actor,args);
  if(material===false)return false;if(!material)return true;
  const target=await game.choose_card_target(actor,yxs_shiquan_targets(game,actor),{
    card_name:'释权·釜底抽薪',stage:'shiquan_target',cancellable:true,
  });
  if(!target)return true;
  await resolve_shiquan(game,actor,target,material);return true;
}

async function choose_shiquan_material(game,actor,args){
  const options=game.skill_material_options(actor,{color:CardColor.BLACK});
  if(args.length){
    let id=null;
    if(args.length===1&&/^\d+$/.test(args[0]))id=`hand:${Number(args[0])}`;
    if(args.length===2&&args[0].toLowerCase()==='eq')id=`eq:${game.normalize_equipment_slot(args[1])}`;
    return id?options.find(m=>m.id===id)??null:false;
  }
  while(true){
    const answer=await game.view.ask_line('释权：选择一张黑色手牌或装备作为釜底抽薪',{
      kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill:'释权',stage:'shiquan_material',private_to:game.seat_of(actor),material_zones:['hand',...slots]},
    });
    if(['cancel','0'].includes(answer))return null;
    const chosen=select(options,answer);if(chosen)return chosen;
    game.view.emit('请选择黑色手牌或装备，或取消释权。');
  }
}

async function ai_shiquan(game,actor,target){
  if(!yxs_shiquan_available(game,actor))return false;
  const candidates=yxs_shiquan_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor));
  // AI policy may decline an ally-only opportunity; legality still permits it.
  if(!candidates.includes(target))target=candidates[0];if(!target)return false;
  const materials=game.skill_material_options(actor,{color:CardColor.BLACK})
    .sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b));
  return resolve_shiquan(game,actor,target,materials[0]);
}

async function before_draw_qiyi(game,actor,_target,count){
  // before_draw is an awaited *normal draw-phase* hook. Ordinary draw_cards,
  // prepare draws and off-turn draws do not create this activation window.
  if(!actor.alive||game.turn_phase!=='draw'||game.turn_actor!==game.seat_of(actor)
    ||actor.skip_draw_stage||actor.block_turn_draw||count<=0)return count;
  if(actor.used_active_skills.has('起义'))return 0;
  if(!yxs_qiyi_targets(game,actor).length)return count;
  let targets=[];
  if(actor.is_ai){
    // Only public team membership and hand counts inform the decision.
    targets=yxs_qiyi_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor))
      .sort((a,b)=>b.hand.length-a.hand.length).slice(0,2);
    if(!targets.length)return count;
  }else{
    while(targets.length<2){
      const candidates=yxs_qiyi_targets(game,actor).filter(p=>!targets.includes(p));
      if(!candidates.length)break;
      const options=candidates.map(p=>({id:game.seat_of(p),label:`${p.name}（手牌${p.hand.length}张，内容不可见）`}));
      if(targets.length)options.push({id:'done',label:'只选择这1名角色，确认起义'});
      options.push({id:'cancel',label:'放弃起义，正常摸牌'});
      const answer=await game.view.ask_line('起义：放弃正常摸牌，从1至2名不同的其他角色各随机获得1张手牌',{
        kind:'choice',player_id:game.seat_of(actor),options,
        meta:{skill:'起义',stage:'qiyi_targets',selected_seats:targets.map(p=>game.seat_of(p)),
          target_scope:'other_living_with_hand',target_zones:['hand'],min_targets:1,max_targets:2},
      });
      if(['cancel','0'].includes(answer))return count;
      if(answer==='done'&&targets.length)break;
      const option=select(options,answer),chosen=candidates.find(p=>game.seat_of(p)===option?.id);
      if(chosen)targets.push(chosen);
      else game.view.emit('请选择未选择过的其他存活角色，或取消起义。');
    }
  }
  // All choices are staged, including the first target. Cancellation or a stale
  // participant leaves every hand and RNG state intact and preserves normal draw.
  if(!targets.length||!actor.alive||actor.skip_draw_stage||actor.block_turn_draw
    ||game.turn_phase!=='draw'||game.turn_actor!==game.seat_of(actor)
    ||targets.some(p=>!yxs_qiyi_targets(game,actor).includes(p)))return count;
  actor.used_active_skills.add('起义');
  for(const target of targets){
    const index=Math.floor(game.rng.random()*target.hand.length);
    const moved=game.move_card_from_zone(target,{zone:'hand',index,card:target.hand[index]},{to:'hand',visibility:'private',recipient:actor,reason:'起义'});
    // An opaque hidden physical card must never be inspected for a `then` field.
    if(moved instanceof Promise)await moved;
    // The chosen card becomes private information of its new holder; no face is
    // emitted to shared logs, and neither UI nor AI saw unchosen hand identities.
    game.view.emit(`${actor.name}发动起义，获得${target.name}的1张手牌。`);
  }
  return 0;
}

export function yxs_next_skill_definitions({SkillHooks,ActiveSkillDef}){
  const shiquan=new ActiveSkillDef({skill_id:'释权',hotkey:'q',
    help_text:'释权：选择黑色手牌或装备当釜底抽薪；可选其他任一角色，含队友及判定区；无距离限制，可被无懈抵消',
    player:player_shiquan,ai:ai_shiquan,button_label:'释权',available:yxs_shiquan_available});
  // The handler owns both cost and target selection; skip legacy enemy preselection.
  shiquan.targets=yxs_shiquan_targets;
  shiquan.owns_target_selection=true;
  return {
    hooks:{
      [YXS_NEXT_RULE_IDS.yang]:SkillHooks({max_sha_per_turn:Infinity}),
      [YXS_NEXT_RULE_IDS.zhao]:SkillHooks(),
      [YXS_NEXT_RULE_IDS.chen]:SkillHooks({before_draw:[before_draw_qiyi]}),
    },
    active:{[YXS_NEXT_RULE_IDS.zhao]:[shiquan]},
  };
}
