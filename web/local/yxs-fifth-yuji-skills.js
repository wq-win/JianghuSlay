import {rule_hero} from './effective-hero.js';
/** Historical source-complete 虞姬: 舍身 / 诀别.
 * Exact boundaries and cross-game rulings: docs/yxs-fifth/yuji-rules.md.
 * Registration is by source ID only; the old Jianghu character is independent.
 */
import {CardType} from './models.js';

export const YXS_YUJI_RULE_ID='yxs.adapted.base.hero.yu-ji';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const cancelled=value=>['0','cancel','pass','keep'].includes(String(value));
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const gender=(game,player)=>game.effective_gender?game.effective_gender(player):player.rule_gender??player.gender??rule_hero(player).gender;
const currentPlayer=(game,player)=>game.all_players().includes(player);
const live=(game,player)=>!!player?.alive&&!player.dead&&currentPlayer(game,player);
const dying=player=>!!player&&!player.dead&&player.hp<=0;
// Runtime references remain outside the serializable player state. The input
// journal reconstructs this transaction, including exact identities, on replay.
const transfers=new WeakMap();

export function yxs_juebie_targets(game,actor){
  return game.all_players().filter(p=>p!==actor&&live(game,p)&&gender(game,p)==='male');
}

/** Policy only: own rescue materials and public counts/zones, never another
 * player's hidden card faces. Human opponents remain perfectly legal targets. */
export function yxs_ai_juebie_target(game,actor){
  if(!dying(actor))return null;
  const own=game.rescue_material_options(actor,actor);
  const rescueCount=new Set(own.map(m=>m.card)).size;
  if(actor.hp+rescueCount*game.tao_heal_amount(actor)>0)return null;
  const candidates=yxs_juebie_targets(game,actor).filter(p=>game.side_of(p)===game.side_of(actor));
  const gifts=actor.hand.length+slots.filter(slot=>actor[slot]).length;
  if(!gifts)return null;
  // Do not sacrifice just to donate more harmful delayed cards than useful H/E.
  const benefit=p=>gifts-actor.judgment_cards.filter(c=>!p.judgment_cards.some(other=>
    game.effective_delayed_effect_id(p,other)===game.effective_delayed_effect_id(actor,c))).length;
  return candidates.filter(p=>benefit(p)>0).sort((a,b)=>benefit(b)-benefit(a)||a.hand.length-b.hand.length||b.hp-a.hp)[0]??null;
}

export function yxs_ai_sheshen_recipient(game,actor,card){
  if(!live(game,actor))return null;
  if([CardType.TAO,CardType.WINE].includes(card.type)&&actor.hp<rule_hero(actor).max_hp)return null;
  return game.all_players().filter(p=>p!==actor&&live(game,p)&&game.side_of(p)===game.side_of(actor)
    &&p.hand.length+1<actor.hand.length).sort((a,b)=>a.hand.length-b.hand.length||a.hp-b.hp)[0]??null;
}

/** The list is an identity whitelist for this one draw, never a hand index
 * whitelist. An earlier transfer cannot shift an old hand card into eligibility. */
export async function yxs_distribute_sheshen_draw(game,actor,drawn,{damage_event_id=null,point=1}={}){
  const remaining=[...new Set(drawn)].filter(c=>c&&!c.virtual&&actor.hand.includes(c));
  let given=0;
  while(live(game,actor)&&remaining.length){
    for(let i=remaining.length-1;i>=0;i--)if(!actor.hand.includes(remaining[i]))remaining.splice(i,1);
    if(!remaining.length)break;
    let card,target;
    if(actor.is_ai){
      card=remaining.shift();target=yxs_ai_sheshen_recipient(game,actor,card);
      if(!target)continue;
    }else{
      if(!game.all_players().some(p=>p!==actor&&live(game,p)))break;
      const options=remaining.map((card,index)=>({id:`draw:${index+1}`,label:String(card),card}));
      options.push({id:'keep',label:'保留所有剩余牌，结束本次分配'});
      const answer=String(await game.view.ask_line('舍身：仅可分配本次新摸的牌，选择一张送出或保留剩余牌。',{
        kind:'choice',player_id:game.seat_of(actor),options:options.map(({id,label})=>({id,label})),
        meta:{skill:'舍身',stage:'sheshen_card',damage_event_id,point,new_draw_only:true,private_to:game.seat_of(actor)},
      })).trim();
      if(cancelled(answer))break;
      const chosen=select(options,answer);if(chosen?.id==='keep')break;
      if(!chosen?.card){game.view.emit('请选择本次新摸的牌，或保留剩余牌。');continue;}
      card=chosen.card;
      target=await game.choose_card_target(actor,game.all_players().filter(p=>p!==actor&&live(game,p)),{
        card_name:'舍身',stage:'sheshen_target',cancellable:true,
      });
      if(!target)break;
      remaining.splice(remaining.indexOf(card),1);
    }
    if(!live(game,actor)||!live(game,target)||!actor.hand.includes(card))continue;
    const moved=await game.move_card_from_zone(actor,{zone:'hand',index:actor.hand.indexOf(card),card},{to:'hand',visibility:'private',recipient:target,reason:'舍身分配'});
    if(!moved)continue;
    given++;
    // Public knowledge is the transfer and its count, never its hidden face.
    game.view.emit(`${actor.name}将舍身新摸的1张牌交给${target.name}。`);
  }
  return given;
}

export async function yxs_after_damage_sheshen(game,actor,amount,_source,event={}){
  if(!live(game,actor)||event.target!==actor||!(event.damage>0)||!(amount>0)
    ||['hp_loss','HP_LOSS'].includes(event.kind)||!event.damage_event_id)return 0;
  actor.yxs_sheshen_event_receipts??=[];
  if(actor.yxs_sheshen_event_receipts.includes(event.damage_event_id))return 0;
  actor.yxs_sheshen_event_receipts.push(event.damage_event_id);
  const points=Math.floor(Math.min(amount,event.damage));let draws=0;
  for(let point=1;point<=points&&live(game,actor);point++){
    const accepted=actor.is_ai||await game.view.ask_confirm(`舍身：本次受到${points}点伤害，第${point}次是否摸2张并分配？`,{
      player_id:game.seat_of(actor),meta:{skill:'舍身',stage:'sheshen_start',damage_event_id:event.damage_event_id,point,points},
    });
    if(!accepted||!live(game,actor))continue;
    const prior=new Set(actor.hand),result=await game.draw_cards(actor,2);
    // Keep the physical draw receipt: a nested gain is not a 舍身 card.
    const drawn=(Array.isArray(result)?result:actor.hand.filter(card=>!prior.has(card)).slice(0,2))
      .filter(card=>actor.hand.includes(card));draws+=drawn.length;
    game.view.emit(`${actor.name}发动舍身，摸${drawn.length}张牌。`);
    await yxs_distribute_sheshen_draw(game,actor,drawn,{damage_event_id:event.damage_event_id,point});
  }
  return draws;
}

function freezeTransfer(game,actor,target,event){
  const cards=[...actor.hand.map(card=>({zone:'hand',card})),
    ...slots.flatMap(zone=>actor[zone]?[{zone,card:actor[zone]}]:[]),
    ...actor.judgment_cards.map(card=>({zone:'judgment',card,effect_id:game.effective_delayed_effect_id(actor,card),
      identity:(actor.judgment_effects??[]).find(entry=>entry.card===card)??null}))];
  transfers.set(actor,{target,cards:cards.map(entry=>Object.freeze({...entry,
    ...(entry.identity?{identity:Object.freeze({...entry.identity})}:{})})),event_id:event.event_id});
  actor.yxs_juebie_transfer={event_id:event.event_id??null,target_seat:game.seat_of(target),confirmed:true,committed:false};
}

/** This is the personal DYING ENTRY window. No death flag, movement, healing or
 * rescue cost occurs before the final explicit confirmation. */
export async function yxs_on_dying_entry_juebie(game,actor,_source,event={}){
  if(!dying(actor))return null;
  if(event.event_id&&actor.yxs_juebie_last_entry_id===event.event_id)return null;
  if(event.event_id)actor.yxs_juebie_last_entry_id=event.event_id;
  const targets=yxs_juebie_targets(game,actor);if(!targets.length)return null;
  let target;
  if(actor.is_ai)target=yxs_ai_juebie_target(game,actor);
  else{
    target=await game.choose_card_target(actor,targets,{card_name:'诀别（可取消，继续正常救援）',stage:'juebie_target',cancellable:true});
    if(!target||!dying(actor)||!yxs_juebie_targets(game,actor).includes(target))return null;
    const accepted=await game.view.ask_confirm(`诀别：确认放弃自己及所有角色的全部救援并阵亡？手牌和装备交给${target.name}的手牌，判定牌转入其判定区（重复者弃置）。确认后不可撤回。`,{
      player_id:game.seat_of(actor),meta:{skill:'诀别',stage:'juebie_confirm',target_seat:game.seat_of(target),waives_all_rescue:true,irreversible:true,event_id:event.event_id??null},
    });
    if(!accepted)return null;
  }
  if(!target||!dying(actor)||!yxs_juebie_targets(game,actor).includes(target))return null;
  freezeTransfer(game,actor,target,event);
  game.view.emit(`${actor.name}发动诀别，放弃全部救援，将遗牌交给${target.name}。`);
  return {waive_rescue:true,reason:'诀别'};
}

/** Core has already marked the owner dead. Every physical destination commits
 * before ordinary death cleanup, loot, rewards or victory determination.
 * Entries are identity-checked; vanished cards are not reconstructed. */
export async function yxs_before_death_juebie(game,actor){
  const transaction=transfers.get(actor),receipt=actor.yxs_juebie_transfer;
  if(!actor.dead||!transaction||!receipt?.confirmed||receipt.committed)return false;
  receipt.committed=true;transfers.delete(actor);
  const {target,cards}=transaction;let handCount=0,judgmentCount=0,discarded=0;
  for(const entry of cards){
    const {zone,card}=entry;
    const index=zone==='hand'?actor.hand.indexOf(card):zone==='judgment'?actor.judgment_cards.indexOf(card):0;
    if(slots.includes(zone)?actor[zone]!==card:index<0)continue;
    const recipientValid=live(game,target)&&gender(game,target)==='male'
      &&game.seat_of(target)===receipt.target_seat;
    let to=recipientValid?'hand':'discard';
    if(zone==='judgment'&&recipientValid)to=target.judgment_cards.some(other=>
      game.effective_delayed_effect_id(target,other)===entry.effect_id)?'discard':'judgment';
    await game.move_card_from_zone(actor,{zone,index,card},{to,recipient:to==='discard'?null:target,visibility:zone==='hand'&&to==='hand'?'private':'public',reason:'诀别阵亡转移',armor_disabled:true,
      delayed_identity:entry.identity});
    if(to==='hand')handCount++;else if(to==='judgment')judgmentCount++;else discarded++;
  }
  game.view.emit(`${actor.name}诀别结算：${handCount}张手牌及装备转入手牌，${judgmentCount}张判定牌移区，${discarded}张弃置。`);
  return true;
}

export function yxs_fifth_yuji_skill_definitions({SkillHooks}){
  return {hooks:{[YXS_YUJI_RULE_ID]:SkillHooks({
    after_damage_resolved:[yxs_after_damage_sheshen],on_dying_entry:[yxs_on_dying_entry_juebie],before_death_commit:[yxs_before_death_juebie],
  })},active:{}};
}
