import {rule_hero} from './effective-hero.js';
/** Historical YXS: 嬴政 / 韩信 / 李师师. Source: docs/yxs-next/specs.json.
 * Core owns damage/rescue/chain scheduling. These hooks NEVER undo HP loss.
 * Cross-game ownership and armor ordering are documented in damage-integration.md.
 */
import {CardColor,CardSuit} from './models.js';

export const YXS_NEXT_DAMAGE_RULE_IDS=Object.freeze({
  ying:'yxs.adapted.base.hero.ying-zheng',
  han:'yxs.adapted.base.hero.han-xin',
  li:'yxs.adapted.base.hero.li-shi-shi',
});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const suits=Object.values(CardSuit);
// Cross-copy local policy: only the final effective transfer awards one draw.
// Shared event receipt also covers mixed 天香/曼舞 redirects.
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const others=(game,actor)=>game.all_players().filter(p=>p!==actor&&p.alive);
const emit=(game,message)=>game.view.emit(message);
const idOf=actor=>rule_hero(actor)?.id;
// Preserve the no-pack synchronous API while fully chaining interactive loss hooks.
const afterMove=(value,done)=>value?.then?value.then(done):done(value);

/** A projection, never a mutation. A final/replaced judgment belongs to the
 * judged actor for this query, rather than the donor of the replacement card. */
export function yxs_effective_suit(card,owner,context={}){
  const subject=context.judged_actor??context.judgment_actor??owner;
  return idOf(subject)===YXS_NEXT_DAMAGE_RULE_IDS.li&&card?.suit===CardSuit.SPADE?CardSuit.HEART:card?.suit;
}
export function yxs_effective_color(card,owner,context={}){
  const suit=yxs_effective_suit(card,owner,context);
  if(suit===CardSuit.HEART||suit===CardSuit.DIAMOND)return CardColor.RED;
  if(suit===CardSuit.SPADE||suit===CardSuit.CLUB)return CardColor.BLACK;
  return card?.color;
}

/** Find the exact physical object. Ambiguous duplicate placement is an error
 * state, not permission to manufacture a third copy or delete an arbitrary one. */
export function yxs_locate_physical_card(game,card){
  if(!card||card.virtual)return {status:'not_physical',locations:[]};
  const locations=[];
  const scan=(cards,zone,owner=null)=>{(cards??[]).forEach((c,index)=>{if(c===card)locations.push({zone,owner,index,card,cards});});};
  for(const owner of game.all_players()){
    scan(owner.hand,'hand',owner);scan(owner.judgment_cards,'judgment',owner);scan(owner.sgs_mountain_fields,'field',owner);scan(owner.sgs_pojun_pile,'pojun_pile',owner);
    for(const zone of slots)if(owner[zone]===card)locations.push({zone,owner,index:0,card});
  }
  scan(game.processing_cards,'processing');scan(game.deck.discard_pile,'discard');scan(game.deck.draw_pile,'draw');
  return {status:locations.length===1?'found':locations.length?'ambiguous':'missing',location:locations.length===1?locations[0]:null,locations};
}

/** One committed move, with exact-card checks. Public-only is 集权; 攻心 may
 * additionally move from its original owner's hand. Later third-party ownership
 * and a reshuffled deck take precedence in this local adaptation. */
export function yxs_acquire_physical_card(game,card,recipient,{from_owner=null,public_only=false,reason='获得实体牌'}={}){
  if(!recipient?.alive)return {moved:false,reason:'recipient_dead'};
  const found=yxs_locate_physical_card(game,card);
  if(found.status!=='found')return {moved:false,reason:found.status};
  const location=found.location;
  if(location.owner===recipient)return {moved:false,reason:'already_owned',card};
  if(location.owner){
    if(public_only||location.owner!==from_owner||location.zone!=='hand')return {moved:false,reason:'claimed_by_other_owner'};
    return afterMove(game.move_card_from_zone(location.owner,location,{to:'hand',recipient,visibility:'private',reason}),
      moved=>moved?{moved:true,reason:'acquired',card}:{moved:false,reason:'stale_zone'});
  }else{
    if(!['processing','discard'].includes(location.zone))return {moved:false,reason:'returned_to_draw_pile'};
    if(location.cards[location.index]!==card)return {moved:false,reason:'stale_zone'};
    location.cards.splice(location.index,1);recipient.hand.push(card);game.copied_card_moved?.(card,'hand',recipient);
  }
  return {moved:true,reason:'acquired',card};
}

/** Explicit [] is significant: revealing a card for 攻心 is not damage-card
 * provenance. Never infer virtual ingredients from unrelated costs/responses. */
export function yxs_damage_physical_cards(event={}){
  const explicit=event.physical_cards??event.physical_materials;
  const provenance=event.use_provenance??event.provenance;
  const candidates=explicit??provenance?.physical_cards??provenance?.physical_materials
    ??(provenance?.physical_card?[provenance.physical_card]
      :event.source_card&&!event.source_card.virtual?[event.source_card]:[]);
  return [...new Set(Array.isArray(candidates)?candidates:[])].filter(card=>card&&!card.virtual);
}
export async function yxs_after_damage_jiquan(game,actor,amount,_source,event={}){
  if(!actor.alive||amount<=0)return [];
  const candidates=yxs_damage_physical_cards(event).filter(card=>{
    const found=yxs_locate_physical_card(game,card);
    return found.status==='found'&&['processing','discard'].includes(found.location.zone);
  });
  if(!candidates.length)return [];
  if(!actor.is_ai&&!await game.view.ask_confirm(`集权：是否获得造成此次伤害的${candidates.length}张实体牌？`,{
    player_id:game.seat_of(actor),meta:{skill:'集权',stage:'damage_card_acquisition',damage_event_id:event.damage_event_id,card_use_id:event.card_use_id},
  }))return [];
  if(!actor.alive)return [];
  const obtained=[];
  for(const card of candidates){
    const result=await yxs_acquire_physical_card(game,card,actor,{public_only:true,reason:'集权'});
    if(result.moved)obtained.push(card);
  }
  if(obtained.length)emit(game,`${actor.name}发动集权，获得伤害牌${obtained.map(String).join('、')}。`);
  return obtained;
}

export const yxs_gongxin_targets=(game,actor)=>others(game,actor);
export function yxs_gongxin_available(game,actor,target=null){
  if(!game.is_own_play_phase(actor)||!actor.hand.length||actor.used_active_skills.has('攻心'))return false;
  const targets=yxs_gongxin_targets(game,actor);
  return target==null?targets.length>0:targets.includes(target);
}
export function yxs_before_draw_bingxian(game,actor,_target,count){
  if(!actor.alive||actor.skip_draw_stage||actor.block_turn_draw||game.turn_phase!=='draw'
    ||game.turn_actor!==game.seat_of(actor)||count<=0)return count;
  // The engine starts normal draw at 2. Replace that base with 3, preserving
  // unrelated prepare/mode modifiers already represented in count.
  return count+1;
}
async function guess_gongxin(game,actor,target){
  if(target.is_ai)return suits[Math.floor(game.rng.random()*suits.length)];
  while(true){
    const options=suits.map(suit=>({id:suit,label:suit}));
    const answer=await game.view.ask_line(`攻心：先猜一种花色，再盲选${actor.name}的一张手牌`,{
      kind:'choice',player_id:game.seat_of(target),options,
      meta:{skill:'攻心',stage:'guess_suit',source_seat:game.seat_of(actor),mandatory:true},
    });
    const chosen=select(options,answer);if(chosen)return chosen.id;
    emit(game,'攻心已发动，请选择红桃、方块、黑桃或梅花。');
  }
}
async function choose_gongxin_card(game,actor,target){
  if(!actor.hand.length)return null;
  if(target.is_ai)return actor.hand[Math.floor(game.rng.random()*actor.hand.length)];
  while(actor.hand.length){
    const snapshot=[...actor.hand];
    const options=snapshot.map((_,index)=>({id:`back:${index+1}`,label:`背面手牌${index+1}`}));
    const answer=await game.view.ask_line(`攻心：盲选${actor.name}的一张手牌（牌面不可见）`,{
      kind:'choice',player_id:game.seat_of(target),options,
      meta:{skill:'攻心',stage:'blind_choose_hand',source_seat:game.seat_of(actor),mandatory:true,hidden:true},
    });
    const chosen=select(options,answer);
    if(chosen){const card=snapshot[options.indexOf(chosen)];if(actor.hand.includes(card))return card;}
    emit(game,'请选择一张仍在韩信手中的背面牌。');
  }
  return null;
}
export async function yxs_finish_gongxin_card(game,actor,target,card){
  const result=await yxs_acquire_physical_card(game,card,target,{from_owner:actor,reason:'攻心结算'});
  if(result.moved)emit(game,`${target.name}在攻心结算后获得${card}。`);
  else if(!['recipient_dead','already_owned'].includes(result.reason)){
    const why={claimed_by_other_owner:'已被其他角色取得',returned_to_draw_pile:'已进入牌库',missing:'已不在可追踪区域',ambiguous:'区域记录不唯一',not_physical:'不是实体牌',stale_zone:'所在区域已变化'}[result.reason]??'已无法取得';
    emit(game,`攻心所选牌${why}，依本地结算规则不再转交，不复制牌。`);
  }
  return result;
}
export async function yxs_resolve_gongxin(game,actor,target){
  if(!yxs_gongxin_available(game,actor,target))return false;
  // Commit the use before mandatory target responses; no card has left hand.
  actor.used_active_skills.add('攻心');
  const guess=await guess_gongxin(game,actor,target);
  const card=await choose_gongxin_card(game,actor,target);
  if(!card)return true;
  const actual=yxs_effective_suit(card,actor);
  emit(game,`${target.name}攻心猜测${guess}，盲选并展示${card}。`);
  if(actual!==guess){
    await game.apply_damage(target,1,{source:actor,kind:'skill',skill_id:'攻心',card_user:actor,
      source_card:null,physical_cards:[],physical_materials:[],
      message:'{name}攻心猜错，受到 {damage} 点伤害，剩余血量 {hp}。'});
  }else emit(game,`${target.name}攻心猜中，不受到伤害。`);
  // Await must include nested transfer, dying/rescue, and all after-damage hooks.
  await yxs_finish_gongxin_card(game,actor,target,card);
  return true;
}
async function player_gongxin(game,actor,_fallback,args=[]){
  if(args.length)return false;
  if(!yxs_gongxin_available(game,actor))return true;
  const target=await game.choose_card_target(actor,yxs_gongxin_targets(game,actor),{
    card_name:'攻心',stage:'gongxin_target',cancellable:true,
  });
  if(target)await yxs_resolve_gongxin(game,actor,target);
  return true;
}
export async function yxs_ai_gongxin(game,actor,target){
  if(!yxs_gongxin_available(game,actor))return false;
  // Legality allows allies. Policy chooses enemy damage opportunities, using
  // only public HP/armor and not the unseen target hand to predict survival.
  const candidates=yxs_gongxin_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor)&&p.defense_bonus<1);
  if(!candidates.includes(target))target=candidates.sort((a,b)=>a.hp-b.hp)[0];
  return target?yxs_resolve_gongxin(game,actor,target):false;
}

export const yxs_manwu_targets=(game,actor)=>others(game,actor);
export function yxs_manwu_materials(_game,actor){
  return actor.hand.flatMap((card,index)=>!card.virtual&&yxs_effective_suit(card,actor)===CardSuit.HEART
    ?[{zone:'hand',index,card,id:`hand:${index+1}`,label:`手牌${index+1}：${card}`}]:[]);
}
const incoming=event=>event.damage??event.amount??0;
export function yxs_manwu_available(game,actor,event){
  return actor.alive&&event?.target===actor&&incoming(event)>0&&!event.cancelled&&!event.prevented&&!event.replaced
    &&!['lose_hp','hp_loss'].includes(event.kind)&&yxs_manwu_materials(game,actor).length>0&&yxs_manwu_targets(game,actor).length>0;
}
export function yxs_commit_manwu(game,actor,event,material,target){
  if(!yxs_manwu_available(game,actor,event)||!yxs_manwu_targets(game,actor).includes(target))return null;
  const current=yxs_manwu_materials(game,actor).find(m=>m.card===material?.card);
  if(!current)return null;
  return afterMove(game.move_card_from_zone(actor,current,{to:'discard',visibility:'public',reason:'曼舞'}),paid=>{
  if(!paid||!actor.alive||!target.alive)return null;
  emit(game,`${actor.name}发动曼舞，将本次伤害转移给${target.name}。`);
  let completed=false;
  return {target,transfer:{skill:'曼舞',skill_id:'yxs.manwu',from:actor,cost:current.card,cost_committed:true},
    // Intermediate transfer destinations did not receive this damage. Only the
    // final effective redirect can award a draw; reciprocal copies cannot stack
    // phantom draws on one actual HP loss (explicit local cross-copy policy).
    after_resolve:async(finalEvent)=>{
      if(completed)return 0;completed=true;
      const recipient=finalEvent?.target;
      if(recipient!==target||!recipient?.alive||!(finalEvent?.damage>0)||finalEvent.transfer_draw_settled)return 0;
      finalEvent.transfer_draw_settled=true;
      const count=Math.max(0,rule_hero(recipient).max_hp-recipient.hp);
      if(count){await game.draw_cards(recipient,count);emit(game,`${recipient.name}在曼舞伤害结算后，按当前缺血摸${count}张牌。`);}
      return count;
    },
  };
  });
}
export async function yxs_before_damage_manwu(game,actor,event){
  if(!yxs_manwu_available(game,actor,event))return null;
  let material,target;
  if(actor.is_ai){
    // Allies are legal but the simple AI never redirects damage to them merely
    // to generate draw. It may still send damage back to its original source.
    target=yxs_manwu_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor)).sort((a,b)=>a.hp-b.hp)[0];
    if(!target)return null;
    material=yxs_manwu_materials(game,actor).sort((a,b)=>(game.material_ai_cost?.(a)??0)-(game.material_ai_cost?.(b)??0)||a.index-b.index)[0];
  }else{
    while(!material){
      const options=yxs_manwu_materials(game,actor);
      const answer=await game.view.ask_line(`曼舞：弃一张红桃手牌，将即将承受的完整伤害转给其他角色`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不发动曼舞'}],
        meta:{skill:'曼舞',stage:'transfer_material',private_to:game.seat_of(actor),material_zones:['hand'],damage:incoming(event),damage_event_id:event.damage_event_id},
      });
      if(['pass','cancel','0'].includes(answer))return null;
      material=select(options,answer);
    }
    target=await game.choose_card_target(actor,yxs_manwu_targets(game,actor),{card_name:'曼舞',stage:'manwu_target',cancellable:true});
    if(!target)return null;
  }
  return await yxs_commit_manwu(game,actor,event,material,target);
}

export function yxs_next_damage_skill_definitions({SkillHooks,ActiveSkillDef}){
  const gongxin=new ActiveSkillDef({skill_id:'攻心',hotkey:'q',button_label:'攻心',
    help_text:'攻心：每回合一次，其他角色先猜花色再盲选你的手牌；猜错先受1点伤害，结算后存活才获得所选牌',
    player:player_gongxin,ai:yxs_ai_gongxin,available:yxs_gongxin_available});
  gongxin.targets=yxs_gongxin_targets;gongxin.owns_target_selection=true;
  return {hooks:{
    [YXS_NEXT_DAMAGE_RULE_IDS.ying]:SkillHooks({after_damage_resolved:[yxs_after_damage_jiquan]}),
    [YXS_NEXT_DAMAGE_RULE_IDS.han]:SkillHooks({before_draw:[yxs_before_draw_bingxian]}),
    [YXS_NEXT_DAMAGE_RULE_IDS.li]:SkillHooks({before_damage_transfer:[yxs_before_damage_manwu]}),
  },active:{[YXS_NEXT_DAMAGE_RULE_IDS.han]:[gongxin]}};
}
