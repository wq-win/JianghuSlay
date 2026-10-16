import {rule_hero} from './effective-hero.js';
/** Historical YXS 扁鹊 / 西施. Stable-ID dispatch lives in skills.js.
 * Core owns dying order, delayed-card identity and SHA branch scheduling.
 * See docs/yxs-third/response-rules.md for the shared-kernel contracts.
 */
import {Card,CardType,CardColor,CardSuit,is_sha_card} from './models.js';

export const YXS_THIRD_RESPONSE_RULE_IDS=Object.freeze({
  bian:'yxs.adapted.base.hero.bian-que',
  xi:'yxs.adapted.base.hero.xi-shi',
});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const emit=(game,text)=>game.view.emit(text);
// Public helpers remain synchronous when their underlying movement is synchronous.
const afterMove=(value,done)=>value?.then?value.then(done):done(value);
const suit=(game,card,actor)=>game.effective_suit?.(card,actor)??card.suit;
const color=(game,card,actor)=>game.effective_color?.(card,actor)??card.color;
const physicalMaterials=(game,actor)=>game.skill_material_options(actor).filter(m=>!m.card.virtual);
const currentMaterial=(options,material)=>options.find(m=>m.card===material?.card&&m.zone===material.zone&&m.id===material.id);
const byCost=game=>(a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b);
const virtualCard=(game,actor,material,name,type,skill)=>new Card(name,type,{
  suit:suit(game,material,actor),color:color(game,material,actor),rank:material.rank,
  virtual:true,materials:[material],source_skill:skill,
});

/** Pure, off-turn-only rescue options. Dying self is !dead, not .alive (HP>0).
 * Option commit stages one real material in processing; core revalidates the
 * dying HP after equipment-leave effects, heals exactly once, then cleans up.
 */
export function yxs_huichun_materials(game,actor,dying){
  if(!actor||actor.dead||(!actor.alive&&actor!==dying)||!dying||dying.dead||dying.hp>0
    ||game.turn_actor===game.seat_of(actor))return [];
  return physicalMaterials(game,actor).filter(m=>color(game,m.card,actor)===CardColor.RED).map(m=>({
    ...m,id:`huichun:${m.id}`,material_id:m.id,skill:'回春',label:m.label,
    commit:async()=>yxs_commit_huichun(game,actor,dying,m),
  }));
}
export function yxs_commit_huichun(game,actor,dying,material){
  const option=yxs_huichun_materials(game,actor,dying).find(m=>m.card===material?.card
    &&m.zone===material.zone&&(m.material_id===material.id||m.id===material.id));
  if(!option)return null;
  return afterMove(game.consume_material(actor,{...option,id:option.material_id},{to:'processing',reason:'回春·当桃使用'}),paid=>{
  if(!paid)return null;
  if(actor.dead){game.finish_processing_card(paid);return null;}
  emit(game,`${actor.name}发动回春，将${paid}当桃救援${dying.name}。`);
  return virtualCard(game,actor,paid,'桃',CardType.TAO,'yxs.huichun');
  });
}

/** 疗伤 is a discard, not a 桃 use: never call use_tao or grant 桃 bonuses. */
export const yxs_liaoshang_targets=(game,_actor)=>game.all_players().filter(p=>p.alive&&p.hp<rule_hero(p).max_hp);
export const yxs_liaoshang_materials=(game,actor)=>physicalMaterials(game,actor).filter(m=>m.zone==='hand');
export function yxs_liaoshang_available(game,actor,target=null){
  if(!game.is_own_play_phase(actor)||actor.used_active_skills.has('疗伤')||!yxs_liaoshang_materials(game,actor).length)return false;
  const targets=yxs_liaoshang_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export function yxs_commit_liaoshang(game,actor,target,material){
  if(!yxs_liaoshang_available(game,actor,target))return false;
  const current=currentMaterial(yxs_liaoshang_materials(game,actor),material);if(!current)return false;
  actor.used_active_skills.add('疗伤');
  return afterMove(game.consume_material(actor,current,{to:'discard',reason:'疗伤',action:'discard'}),paid=>{
  if(!paid){actor.used_active_skills.delete('疗伤');return false;}
  if(!actor.alive||!target.alive)return true;
  const healed=target.heal(1);
  emit(game,`${actor.name}发动疗伤，${target.name}回复${healed}点体力。`);return true;
  });
}
async function chooseMaterial(game,actor,{skill,stage,options,args=[],zones=['hand',...slots]}){
  if(args.length){
    let id=null;
    if(args.length===1&&/^\d+$/.test(args[0]))id=`hand:${Number(args[0])}`;
    if(args.length===2&&args[0].toLowerCase()==='eq')id=`eq:${game.normalize_equipment_slot(args[1])}`;
    return id?options.find(m=>m.id===id)??null:false;
  }
  while(true){
    const answer=await game.view.ask_line(`${skill}：选择一张素材牌`,{
      kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill,stage,private_to:game.seat_of(actor),material_zones:zones},
    });
    if(['cancel','pass','0'].includes(answer))return null;
    const material=select(options,answer);if(material)return material;
    emit(game,'请选择合法素材，或取消发动。');
  }
}
async function player_liaoshang(game,actor,_fallback,args=[]){
  if(!yxs_liaoshang_available(game,actor))return true;
  const material=await chooseMaterial(game,actor,{skill:'疗伤',stage:'liaoshang_material',options:yxs_liaoshang_materials(game,actor),args,zones:['hand']});
  if(material===false)return false;if(!material)return true;
  const target=await game.choose_card_target(actor,yxs_liaoshang_targets(game,actor),{card_name:'疗伤',stage:'liaoshang_target',cancellable:true});
  if(target)await yxs_commit_liaoshang(game,actor,target,material);return true;
}
export async function yxs_ai_liaoshang(game,actor,_fallback){
  if(!yxs_liaoshang_available(game,actor))return false;
  const target=yxs_liaoshang_targets(game,actor).filter(p=>game.side_of(p)===game.side_of(actor))
    .sort((a,b)=>a.hp-b.hp||(rule_hero(b).max_hp-b.hp)-(rule_hero(a).max_hp-a.hp))[0];
  if(!target)return false;
  // Own cards and public HP only. Preserve red rescue stock when a black cost
  // with the same ordinary value exists; hand equipment is a legal discard.
  const materials=yxs_liaoshang_materials(game,actor).sort((a,b)=>
    (game.material_ai_cost(a)+(color(game,a.card,actor)===CardColor.RED?2:0))
    -(game.material_ai_cost(b)+(color(game,b.card,actor)===CardColor.RED?2:0)));
  return await yxs_commit_liaoshang(game,actor,target,materials[0]);
}

const prisonView=()=>new Card('画地为牢',CardType.SCROLL,{virtual:true,materials:[]});
export const yxs_meihuo_materials=(game,actor)=>physicalMaterials(game,actor).filter(m=>suit(game,m.card,actor)===CardSuit.DIAMOND);
export const yxs_meihuo_targets=(game,actor)=>game.all_players().filter(p=>game.can_place_delayed(actor,p,prisonView()));
export function yxs_meihuo_available(game,actor,target=null){
  if(!game.is_own_play_phase(actor)||!yxs_meihuo_materials(game,actor).length)return false;
  const targets=yxs_meihuo_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export async function yxs_resolve_meihuo(game,actor,target,material){
  if(!yxs_meihuo_available(game,actor,target))return false;
  const current=currentMaterial(yxs_meihuo_materials(game,actor),material);if(!current)return false;
  const cost=await game.consume_material(actor,current,{to:'processing',reason:'魅惑·当画地为牢使用'});
  if(!cost)return false;
  if(!actor.alive||!target.alive){game.finish_processing_card(cost);return true;}
  const converted=virtualCard(game,actor,cost,'画地为牢',CardType.SCROLL,'yxs.meihuo');
  try{
    emit(game,`${actor.name}发动魅惑，将${cost}当画地为牢使用。`);
    // Core installs the immutable real card with effective delayed identity.
    // It owns nullification, the later judgment and the skipped play phase.
    await game.resolve_scroll(actor,target,converted,{physical_material:cost,source_skill:'yxs.meihuo',trick_declaration_validated:true});
  }finally{game.finish_processing_card(converted);}
  return true;
}
async function player_meihuo(game,actor,_fallback,args=[]){
  if(!yxs_meihuo_available(game,actor))return true;
  const material=await chooseMaterial(game,actor,{skill:'魅惑',stage:'meihuo_material',options:yxs_meihuo_materials(game,actor),args});
  if(material===false)return false;if(!material)return true;
  const target=await game.choose_card_target(actor,yxs_meihuo_targets(game,actor),{card_name:'魅惑·画地为牢',stage:'meihuo_target',cancellable:true});
  if(target)await yxs_resolve_meihuo(game,actor,target,material);return true;
}
export async function yxs_ai_meihuo(game,actor,target){
  if(!yxs_meihuo_available(game,actor))return false;
  const targets=yxs_meihuo_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor));
  if(!targets.includes(target))target=targets[0];if(!target)return false;
  return yxs_resolve_meihuo(game,actor,target,yxs_meihuo_materials(game,actor).sort(byCost(game))[0]);
}

const shaUser=event=>event?.card_user??event?.source;
function chenyuWindow(actor,event){
  return !!actor?.alive&&event?.target===actor&&!!shaUser(event)&&event.chenyu_allowed!==false
    &&!event.cancelled&&!event.chain_transfer&&!event.response_started&&!event.armor_judgment_started
    &&!(event.shans_played>0)&&(!event.kind||event.kind==='sha')
    &&(!event.source_card||is_sha_card(event.source_card));
}
/** Target legality is evaluated after losing the selected weapon/horse. Never
 * use the original attacker's range, own-use quota, or enemy-only UI filter. */
export function yxs_chenyu_targets(game,actor,event,material){
  if(!chenyuWindow(actor,event))return [];
  const current=currentMaterial(physicalMaterials(game,actor),material);if(!current)return [];
  const after=game.actor_after_material_cost(actor,current),source=shaUser(event);
  return game.all_players().filter(p=>p.alive&&p!==actor&&p!==source
    &&game.can_sha_target(source,p,{allow_allies:true})&&game.in_actual_attack_range(after,p));
}
export function yxs_chenyu_materials(game,actor,event){
  if(!chenyuWindow(actor,event))return [];
  return physicalMaterials(game,actor).filter(m=>yxs_chenyu_targets(game,actor,event,m).length);
}
export const yxs_chenyu_available=(game,actor,event)=>yxs_chenyu_materials(game,actor,event).length>0;
export function yxs_commit_chenyu(game,actor,event,material,target){
  if(!yxs_chenyu_targets(game,actor,event,material).includes(target))return null;
  const current=currentMaterial(physicalMaterials(game,actor),material);if(!current)return null;
  return afterMove(game.consume_material(actor,current,{to:'discard',reason:'沉鱼',action:'discard'}),paid=>{
  if(!paid||!actor.alive||!target.alive)return null;
  emit(game,`${actor.name}发动沉鱼，将${shaUser(event).name}这次杀的目标转移给${target.name}。`);
  // Never rewrite source, card use ID, material provenance, nature or damage.
  return {target,transfer:{skill:'沉鱼',skill_id:'yxs.chenyu',from:actor,cost:current.card,branch_id:event.branch_id}};
  });
}
export async function yxs_before_sha_target_chenyu(game,actor,event){
  if(!yxs_chenyu_available(game,actor,event))return null;
  let material,target;
  if(actor.is_ai){
    // Legal friendly targets remain in human queries. AI redirects only to an
    // enemy other than the original user, based on public HP and its own costs.
    for(const candidate of yxs_chenyu_materials(game,actor,event).sort(byCost(game))){
      const enemy=yxs_chenyu_targets(game,actor,event,candidate).filter(p=>game.side_of(p)!==game.side_of(actor)).sort((a,b)=>a.hp-b.hp)[0];
      if(enemy){material=candidate;target=enemy;break;}
    }
    if(!target)return null;
  }else{
    material=await chooseMaterial(game,actor,{skill:'沉鱼',stage:'chenyu_material',options:yxs_chenyu_materials(game,actor,event)});
    if(!material)return null;
    target=await game.choose_card_target(actor,yxs_chenyu_targets(game,actor,event,material),{card_name:'沉鱼',stage:'chenyu_target',cancellable:true});
    if(!target)return null;
  }
  return await yxs_commit_chenyu(game,actor,event,material,target);
}

export function yxs_third_response_skill_definitions({SkillHooks,ActiveSkillDef}){
  const liaoshang=new ActiveSkillDef({skill_id:'疗伤',hotkey:'q',button_label:'疗伤',
    help_text:'疗伤：自己出牌阶段每回合一次，弃一张手牌，使任意受伤存活角色回复1点体力',
    player:player_liaoshang,ai:yxs_ai_liaoshang,available:yxs_liaoshang_available});
  liaoshang.targets=yxs_liaoshang_targets;liaoshang.owns_target_selection=true;
  const meihuo=new ActiveSkillDef({skill_id:'魅惑',hotkey:'q',button_label:'魅惑',
    help_text:'魅惑：自己的出牌阶段，将方块手牌或装备当画地为牢使用；保留实体素材，进入目标判定区',
    player:player_meihuo,ai:yxs_ai_meihuo,available:yxs_meihuo_available});
  meihuo.targets=yxs_meihuo_targets;meihuo.owns_target_selection=true;
  return {hooks:{
    [YXS_THIRD_RESPONSE_RULE_IDS.bian]:SkillHooks({rescue_material_options:[yxs_huichun_materials]}),
    [YXS_THIRD_RESPONSE_RULE_IDS.xi]:SkillHooks({before_sha_target_response:[yxs_before_sha_target_chenyu]}),
  },active:{[YXS_THIRD_RESPONSE_RULE_IDS.bian]:[liaoshang],[YXS_THIRD_RESPONSE_RULE_IDS.xi]:[meihuo]}};
}
