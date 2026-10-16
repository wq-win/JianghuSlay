/** Awaitable physical-card transactions for the optional mobile Youjian pack.
 * No monkey-patching: the host explicitly installs these methods and awaits all
 * production callers. Rule provenance and local choices: card-event-rules.md.
 */
import {zhangfen_vehicle} from './sgs-zhangfen-runtime.js';
import {
  YOUJIAN_EQUIPMENT_PACK_ID,
  youjian_equipment_definition,
  youjian_equipment_gift_mark,
} from './youjian-equipment-catalog.mjs';

const SLOTS = Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SLOT_BY_TYPE = Object.freeze({'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'});
const runtimeByGame = new WeakMap();
const alive = player => Boolean(player?.alive && !player.dead);
const enabled = game => Array.isArray(game.content_packs) && game.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID);
const seat = (game, player) => player ? game.seat_of?.(player) ?? player.name ?? null : null;
const emit = (game, text, event = {}) => game.view?.emit?.(text,event);
const requireMethod = (object, method) => {
  if (typeof object?.[method] !== 'function') throw Error(`用间牌事务接入缺少 ${method}`);
};
const runtime = game => {
  let state = runtimeByGame.get(game);
  if (!state) runtimeByGame.set(game,state = {moves:new Map(),moveRequests:new Map(),transactions:new Map(),transactionRequests:new Map(),gifts:new WeakMap(),draws:new Set()});
  return state;
};
function nextId(game, prefix = 'move') {
  const counter = game.card_move_counter ?? 0;
  if (!Number.isSafeInteger(counter) || counter < 0 || counter >= Number.MAX_SAFE_INTEGER) throw Error('无效的稳定移牌计数器');
  game.card_move_counter = counter + 1;
  return `${prefix}:${game.card_move_counter}`;
}
function validId(id) {
  if (!['string','number'].includes(typeof id) || String(id).length === 0 || typeof id === 'number' && !Number.isFinite(id)) throw Error('移牌ID必须是稳定的非空字符串或有限数字');
  return id;
}
const physicalId = card => card?.physical_id ?? card?.physicalCardId ?? card?.derived_identity ?? null;
const cardRecord = card => ({physical_id:physicalId(card),name:card?.name ?? null,type:card?.type ?? null,suit:card?.suit ?? null,rank:card?.rank ?? null});
const participants = (game, ...extra) => [...new Set([...(game.all_players?.() ?? game.players ?? []),...extra].filter(Boolean))];
function allCards(game, ...extra) {
  return [...(game.deck?.draw_pile ?? []),...(game.deck?.discard_pile ?? []),...(game.processing_cards ?? []),...(game.offboard_cards ?? []),...(game.sgs_zhangfen_removed_cards ?? []),...(game.sgs_zhangfen_destroyed_cards ?? []),
    ...participants(game,...extra).flatMap(player=>[...(player.hand ?? []),...(player.judgment_cards ?? []),...(player.sgs_mountain_fields ?? []),...(player.sgs_pojun_pile ?? []),...(player.sgs_following_jieyue_pile ?? []),...(player.sgs_followup_qian_pile ?? []),...(player.sgs_painting_pile ?? []),...(player.sgs_bifa_pile ?? []),...SLOTS.map(slot=>player[slot]).filter(Boolean)])];
}
function uniquePhysicalCards(game, cards, ...extra) {
  if (new Set(cards).size !== cards.length || cards.some(card=>!card || typeof card !== 'object' || card.virtual)) return false;
  const ids = cards.map(physicalId).filter(id=>id !== null);
  if (new Set(ids).size !== ids.length) return false;
  const present = allCards(game,...extra);
  return cards.every(card=>present.filter(candidate=>candidate === card || physicalId(card) !== null && physicalId(candidate) === physicalId(card)).length === 1);
}
function sourceArray(game, owner, zone) {
  if (zone === 'offboard') return game.offboard_cards;
  if (zone === 'zhangfen_removed') return game.sgs_zhangfen_removed_cards;
  if (zone === 'zhangfen_destroyed') return game.sgs_zhangfen_destroyed_cards;
  if (zone === 'bifa') return owner?.sgs_bifa_pile;
  if (zone === 'painting') return owner?.sgs_painting_pile;
  if (zone === 'hand') return owner?.hand;
  if (zone === 'judgment') return owner?.judgment_cards;
  if (zone === 'field') return owner?.sgs_mountain_fields;
  if (zone === 'pojun_pile') return owner?.sgs_pojun_pile;
  if (zone === 'qian') return owner?.sgs_followup_qian_pile;
  if (zone === 'jieyue') return owner?.sgs_following_jieyue_pile;
  if (zone === 'draw_pile') return game.deck?.draw_pile;
  if (zone === 'processing') return game.processing_cards;
  if (zone === 'discard') return game.deck?.discard_pile;
  return null;
}
function validMaterials(game, owner, materials, recipient) {
  if (!Array.isArray(materials) || !materials.length || !uniquePhysicalCards(game,materials.map(m=>m?.card),owner,recipient)) return false;
  return materials.every(material=>{
    if (material?.epoch!==undefined&&material.epoch!==game.card_location_epoch?.(material.card)) return false;
    if (!material || !Number.isInteger(material.index) || material.index < 0 || ['zhangfen_removed','zhangfen_destroyed'].includes(material.zone)) return false;
    if (SLOTS.includes(material.zone)) return material.index === 0 && owner?.[material.zone] === material.card;
    const cards = sourceArray(game,owner,material.zone);
    return Array.isArray(cards) && cards[material.index] === material.card;
  });
}
function destination(game, to, recipient) {
  if (to === 'zhangfen_removed') return game.sgs_zhangfen_removed_cards ??= [];
  if (to === 'zhangfen_destroyed') return game.sgs_zhangfen_destroyed_cards ??= [];
  if (to === 'decktop' && Array.isArray(game.deck?.draw_pile)) return game.deck.draw_pile;
  if (to === 'discard' && Array.isArray(game.deck?.discard_pile)) return game.deck.discard_pile;
  if (to === 'processing' && Array.isArray(game.processing_cards)) return game.processing_cards;
  if (to === 'hand' && Array.isArray(recipient?.hand)) return recipient.hand;
  if (to === 'bifa' && recipient) return recipient.sgs_bifa_pile??=[];
  if (to === 'qian' && recipient) return recipient.sgs_followup_qian_pile??=[];
  if (to === 'jieyue' && recipient) return recipient.sgs_following_jieyue_pile??=[];
  if (to === 'pojun_pile' && recipient) return recipient.sgs_pojun_pile??=[];
  if (to === 'field' && Array.isArray(recipient?.sgs_mountain_fields)) return recipient.sgs_mountain_fields;
  if (to === 'judgment' && Array.isArray(recipient?.judgment_cards)) return recipient.judgment_cards;
  if (to === 'board_equipment' && recipient) return null;
  throw Error(`无效移牌终点或缺少区域：${to}`);
}
function slotAbolished(game, player, slot) {
  if (!slot) return false;
  if (typeof game.is_equipment_slot_abolished === 'function' && game.is_equipment_slot_abolished(player,slot)) return true;
  if (player[`${slot}_abolished`]) return true;
  return [player.abolished_slots,player.abolished_equipment_slots].some(value=>value instanceof Set ? value.has(slot) : Array.isArray(value) ? value.includes(slot) : value?.[slot] === true);
}
const ownPlay = (game, actor) => alive(actor) && !actor.skip_play_stage && game.turn_phase === 'play' && game.turn_actor === seat(game,actor);
function giftMarked(game, card) {
  if (!enabled(game) || !card || card.virtual || card.gift_mark !== true) return false;
  if (card.content_pack && !game.content_packs.includes(card.content_pack)) return false;
  // A forged physical mark must not turn source-unmarked 倚天剑/战象 into gifts.
  return youjian_equipment_definition(card) ? youjian_equipment_gift_mark(card) : true;
}
export const is_youjian_poison = card => Boolean(card && !card.virtual && card.type === '毒');

async function gained(game, recipient, cards, context) {
  if (cards.length && !recipient.dead && typeof game.on_cards_obtained === 'function') await game.on_cards_obtained(recipient,cards,context);
}
function requestRecord(game, owner, materials, options) {
  return {owner:seat(game,owner),materials:(Array.isArray(materials) ? materials : []).map(m=>({zone:m?.zone ?? null,index:m?.index ?? null,card:cardRecord(m?.card?(game.printed_card?.(m.card)??m.card):null)})),
    payment:options.payment===true,zhangfen_cause:options.zhangfen_cause??null,action:options.action??null,semantic_action:options.semantic_action??null,judged_actor:seat(game,options.judged_actor),judgment_event_id:options.judgment_event_id??null,judgment_face:options.judgment_face??null,origin_move_id:options.origin_move_id??null,top_order:options.top_order??null,death_cleanup:options.death_cleanup??false,to:options.to,recipient:seat(game,options.recipient),pile_id:options.pile_id??null,turn_id:options.turn_id??null,source:seat(game,options.source),destination_slot:options.destination_slot??null,delayed_name:options.delayed_identity?.name??null,visibility:options.visibility,reason:options.reason,poison_exempt:options.poison_exempt};
}
async function completeMove(game, owner, materials, options, receipt) {
  const {to,recipient,visibility,reason,move_id,poison_exempt} = options;
  const targetPile = destination(game,to,recipient);
  if (typeof options.validate==='function'&&!options.validate() || !validMaterials(game,owner,materials,recipient)
    || to==='zhangfen_destroyed'&&(options.action!=='destroy'||materials.some(m=>zhangfen_vehicle(game,m.card)?.durability!==0))
    || to === 'hand' && recipient.dead
    || ['hand','field','judgment','board_equipment','pojun_pile','qian','jieyue','bifa'].includes(to)&&recipient?.dead
    || to==='board_equipment'&&(materials.length!==1||SLOT_BY_TYPE[materials[0]?.card?.type]!==options.destination_slot||!SLOTS.includes(options.destination_slot)||recipient[options.destination_slot]||slotAbolished(game,recipient,options.destination_slot))
    || targetPile&&materials.some(m=>sourceArray(game,owner,m.zone) === targetPile)) {
    receipt.status = 'done';
    return receipt.result = {committed:false,move_id};
  }
  if(to==='decktop'){
    const permitted=options.source_skill==='sgs.mieji'
      ? game.sgs_liru_validate_topdeck_cost?.(owner,materials,options)===true
      : game.validate_discard_origin(materials,options);
    if(!permitted){receipt.status='done';return receipt.result={committed:false,move_id};}
  }
  if(to==='pojun_pile')game.validate_pojun_obligation(owner,materials,options);
  // The exact source and destination have already passed validation. A forced
  // departure may destroy its car and run nested loss effects, so revalidate
  // the permitted subset before taking any action-face/loss snapshot.
  const epochs = new Map(materials.map(m=>[m.card,game.card_location_epoch?.(m.card)]));
  let guard = null;
  if (options.payment === true && game.sgs_zhangfen_payment_preflight?.(owner,materials,options)?.allowed === false) {
    receipt.status='done';
    return receipt.result={committed:false,move_id,payment_rejected:true};
  }
  if (game.sgs_zhangfen_before_move) {
    receipt.stage='movement_guard';
    guard=await game.sgs_zhangfen_before_move(owner,materials,options);
    materials=guard.allowed_materials;
    if (options.payment === true && guard.blocked_materials.length) materials=[];
    if (!materials.length || typeof options.validate==='function'&&!options.validate(materials,guard)
      || !validMaterials(game,owner,materials,recipient)
      || ['hand','field','judgment','board_equipment','pojun_pile','qian','jieyue','bifa'].includes(to)&&recipient?.dead
      || to==='board_equipment'&&(recipient[options.destination_slot]||slotAbolished(game,recipient,options.destination_slot))
      || materials.some(m=>epochs.get(m.card)!==game.card_location_epoch?.(m.card))) {
      receipt.status='done';
      return receipt.result={committed:false,move_id,...(guard.blocked_materials.length?{
        blocked:guard.blocked_materials.length,destroyed_ids:guard.destroyed_ids??[]}: {})};
    }
  }
  // Board transfers cannot install other equipment beside a surviving car.
  // The incoming physical card is discarded with no replacement or entry event.
  if (to==='board_equipment' && game.sgs_zhangfen_entry_replacement?.(recipient,materials[0].card)?.prevented) {
    const blockedEntry={...options,to:'discard',recipient:null,action:'equipment_entry_prevented',semantic_action:'equipment_entry_prevented',validate:null};
    const result=await completeMove(game,owner,materials,blockedEntry,receipt);
    if(result.committed){result.entry_prevented=true;emit(game,`${recipient.name}的大攻车阻止其他装备进入。`,{event_type:'equipment_entry_prevented',move_id});}
    return result;
  }
  const hand_before=owner?.hand?.length??0;
  const cards = materials.map(material=>material.card);
  const leaveFaces=new Map(materials.filter(m=>SLOTS.includes(m.zone)).map(m=>[m.card,{...m.card}]));
  const poisonCards = enabled(game) && visibility === 'public' && !poison_exempt
    ? materials.filter(material=>material.zone === 'hand' && is_youjian_poison(material.card)).map(material=>material.card) : [];
  if (poisonCards.length) requireMethod(game,'lose_hp');
  const snapshot = Boolean(game.youjian_poison_armor_snapshot?.(owner,options));
  receipt.youjian_poison_armor_snapshot = snapshot;
  receipt.poison_count = poisonCards.length;
  receipt.poison_resolved = 0;

  const semantic=options.semantic_action??options.action??(to==='discard'?'discard':null);
  const captureGlobal=to==='discard'&&['discard','judgment'].includes(semantic)&&!options.death_cleanup&&Boolean(game.more_discard_observers?.().length);
  let actionMaterials=owner?game.capture_card_action_faces?.(owner,materials,{action:options.action??(to==='processing'?'card_use':to==='hand'?'give':'discard'),to,move_id})??materials:materials;
  if(captureGlobal)actionMaterials=actionMaterials.map(m=>{const face=options.judgment_face??game.effective_card(m.card,owner??options.judged_actor);return {...m,effective_face:{name:face.name,type:face.type,suit:face.suit,color:face.color,rank:face.rank}};});
  if(['discard','mandatory_discard'].includes(options.semantic_action??options.action)&&game.record_committed_discard_categories)actionMaterials=actionMaterials.map(m=>({...m,action_card_family:game.card_family(m.card)}));
  receipt.effective_faces=actionMaterials.map(m=>m.effective_face??null);
  // Code-owned atomic precommit only: e.g. flip before paying Renxin.
  if(options.before_atomic_commit){const result=options.before_atomic_commit();if(result&&typeof result.then==='function')throw Error('原子移牌前置提交必须同步');}
  // No await, hook, log, or user code between first detach and final destination.
  // Array identities are retained so concurrent host references stay valid.
  for (const zone of ['hand','judgment','processing','draw_pile','field','pojun_pile','qian','jieyue','bifa','painting','discard','offboard','zhangfen_removed','zhangfen_destroyed']) {
    const pile = sourceArray(game,owner,zone);
    for (const material of materials.filter(m=>m.zone === zone).sort((a,b)=>b.index-a.index)) pile.splice(material.index,1);
  }
  for (const material of materials.filter(m=>SLOTS.includes(m.zone))) owner[material.zone] = null;
  if(to==='board_equipment'){if(cards.length!==1)throw Error('装备移动必须恰好一张实体');recipient[options.destination_slot]=cards[0];}
  else targetPile.push(...(to==='decktop'?[...cards].reverse():cards));
  if(to==='judgment'&&options.delayed_identity){recipient.judgment_effects??=[];recipient.judgment_effects.push({...options.delayed_identity,card:cards[0]});}
  for(const card of cards)game.copied_card_moved?.(card,to==='board_equipment'?options.destination_slot:to,recipient,options);
  if(to==='pojun_pile')game.register_pojun_obligation(owner,cards,options);
  receipt.locations=typeof game.card_location_epoch==='function'&&typeof game.card_history_material_id==='function'?cards.map(card=>({physical_id:game.card_history_material_id(card),epoch:game.card_location_epoch(card)})):[];
  receipt.committed = true;
  receipt.result = {committed:true,move_id,...(guard?.blocked_materials.length?{partial:true,moved_count:materials.length,blocked:guard.blocked_materials.length,destroyed_ids:guard.destroyed_ids??[]}: {})};
  const hand_after=owner?.hand?.length??0;
  receipt.hand_before=hand_before;receipt.hand_after=hand_after;
  return finishCommittedMove(game,owner,materials,options,receipt,{cards,actionMaterials,leaveFaces,poisonCards,snapshot,captureGlobal,semantic,hand_before,hand_after});
}

async function finishCommittedMove(game,owner,materials,options,receipt,facts,{skipCallback=false}={}){
  const {to,recipient,reason,move_id}=options;
  const {cards,actionMaterials,leaveFaces,poisonCards,snapshot,captureGlobal,semantic,hand_before,hand_after}=facts;
  game.record_committed_discard_categories?.(owner,actionMaterials,options);
  receipt.stage = 'commit_callback';
  if(!skipCallback){await options.on_committed?.(cards,receipt.result);await game.flush_general_state_events?.();}
  receipt.stage = 'hero_loss';
  await game.after_cards_lost?.(owner,{...options,move_id,committed:true,hand_before,hand_after,materials:actionMaterials.map(m=>({...m}))});
  receipt.stage = 'leave';

  // Clear delayed identities only after every exact physical destination exists.
  for (const material of materials.filter(m=>m.zone === 'judgment')) {
    if (game.clear_delayed_identity) await game.clear_delayed_identity(owner,material.card);
    else if (Array.isArray(owner.judgment_effects)) owner.judgment_effects = owner.judgment_effects.filter(entry=>entry.card !== material.card);
  }
  const context = {...options,zones:materials.map(material=>material.zone),youjian_poison_armor_snapshot:snapshot};
  for (const material of materials.filter(m=>SLOTS.includes(m.zone)).sort((a,b)=>SLOTS.indexOf(a.zone)-SLOTS.indexOf(b.zone))) {
    if (game.equipment_on_leave) await game.equipment_on_leave(owner,material.card,{...context,equipment_face:leaveFaces.get(material.card),slot:material.zone,armor_disabled:options.armor_ignored || options.armor_disabled});
  }
  receipt.stage = 'loss';
  const owned = materials.filter(material=>!['processing','discard','draw_pile','offboard','zhangfen_removed','zhangfen_destroyed'].includes(material.zone));
  if (owned.length && game.equipment_after_cards_lost) await game.equipment_after_cards_lost(owner,owned.map(material=>material.card),{...context,zones:owned.map(material=>material.zone)});
  receipt.stage = 'poison';
  for (const [index,card] of poisonCards.entries()) {
    if (owner.dead) break;
    // lose_hp applies youjian_modify_hp_loss exactly once, then awaits rescue.
    // In particular this is not damage, and neither armor nor fire can reduce it.
    await game.lose_hp(owner,1,{...context,source:null,reason:'毒',kind:'poison_basic',source_card:card,
      poison_event_id:`${JSON.stringify(move_id)}:poison:${index+1}`,poison_index:index+1,poison_count:poisonCards.length});
    receipt.poison_resolved = index + 1;
  }
  receipt.stage = 'gain';
  if (to === 'hand') await gained(game,recipient,cards,{...context,source:options.source ?? owner,source_zone:options.source_zone ?? (materials.every(m=>m.zone === 'processing') ? 'processing' : 'player'),destination:'hand',recipient});
  if(to==='board_equipment'&&recipient[options.destination_slot]===cards[0]&&!recipient.dead){
    receipt.stage='equipment_entry';
    const entry={...options,slot:options.destination_slot,entry_id:`equipment-entry:${game.equipment_entry_counter=(game.equipment_entry_counter??0)+1}`};
    await game.sgs_zhangfen_on_equipment_enter?.(recipient,cards[0],entry);
    await game.equipment_on_enter?.(recipient,cards[0],entry);
    if(game.youjian_events_enabled?.()&&recipient[options.destination_slot]===cards[0]&&!recipient.dead)await game.youjian_on_enter?.(recipient,cards[0],entry);
  }
  if(captureGlobal){receipt.stage='global_discard';await game.dispatch_after_cards_enter_discard({move_id,committed:true,to:'discard',semantic_action:semantic,owner,judged_actor:options.judged_actor??null,judgment_event_id:options.judgment_event_id??null,materials:actionMaterials.map(m=>({...m})),locations:receipt.locations.map(x=>({...x}))});}
  receipt.stage = 'complete';
  receipt.status = 'done';
  return receipt.result;
}

async function processingMove(game, card, to, recipient, options) {
  const index = game.processing_cards.indexOf(card);
  if (index < 0) return false;
  const result = await game.public_card_loss(null,[{zone:'processing',index,card}],{...options,to,recipient,poison_exempt:true});
  return result.committed;
}
function publicPoisonTarget(game, owner, targets) {
  // Only public allegiance and HP are used. Never inspect another hand, even
  // when the host happens to have its complete cards in memory.
  return [...targets].sort((a,b)=>{
    const hostile = target => game.side_of ? Number(game.side_of(target) !== game.side_of(owner)) : 0;
    return hostile(b)-hostile(a) || (Number(a.hp) || 0)-(Number(b.hp) || 0);
  })[0] ?? null;
}
async function choosePoisonRecipient(game, owner, card, {event_id,reason,index,count}) {
  while (owner && !owner.dead) {
    const targets = participants(game).filter(player=>player !== owner && alive(player));
    if (!targets.length) return null;
    if (owner.is_ai) return publicPoisonTarget(game,owner,targets);
    requireMethod(game.view,'ask_line');
    const answer = String(await game.view.ask_line(`即将从牌堆获得毒（本次${count}张中的第${index+1}张）：可展示并交给另一名存活角色，或保留入手。`,{
      kind:'choice',player_id:seat(game,owner),options:[...targets.map(target=>({id:`give:${seat(game,target)}`,label:`展示并交给${target.name}`})),{id:'keep',label:'保留这张毒'}],
      meta:{skill:'毒',stage:'draw_intercept',private_to:seat(game,owner),action:'give',reason,event_id,draw_count:count,draw_index:index,source_zone:'draw_pile',card:cardRecord(card)},
    })).trim();
    if (['keep','cancel','pass','0','n'].includes(answer)) return null;
    const chosen = targets.find(target=>answer === `give:${seat(game,target)}` || answer === String(seat(game,target)));
    if (chosen && alive(chosen)) return chosen;
    emit(game,'请选择当前存活的其他角色，或保留毒。',{private_to:seat(game,owner)});
  }
  return null;
}


/** Atomic H / private obligation-pile exchange. All exact destinations exist
 * before any callback or loss/gain effect can re-enter the host. */
function syncCallback(value,label){
 if(value==null)return;
 if(typeof value!=='function'||['AsyncFunction','GeneratorFunction','AsyncGeneratorFunction'].includes(value.constructor?.name))throw Error(`${label}必须是同步函数`);
}
function syncPredicate(fn,label){
 if(fn==null)return true;
 const value=fn();
 if(value&&typeof value.then==='function'){Promise.resolve(value).catch(()=>{});throw Error(`${label}不能返回Promise`);}
 if(typeof value!=='boolean')throw Error(`${label}必须返回布尔值`);
 return value;
}
async function completeTransaction(game,legs,options,receipt){
 const valid=()=>syncPredicate(options.validate,'原子移牌validate')&&legs.every(l=>
   syncPredicate(l.options.validate,'原子移牌腿validate')&&validMaterials(game,l.owner,l.materials,l.options.recipient)
   &&l.materials.every(m=>m.epoch===game.card_location_epoch(m.card))
   &&(l.options.to!=='hand'||!l.options.recipient.dead)
   &&l.materials.every(m=>sourceArray(game,l.owner,m.zone)!==destination(game,l.options.to,l.options.recipient)));
 const reject=()=>{receipt.status='done';return receipt.result={committed:false,move_id:options.move_id,moves:[]};};
 const cards=legs.flatMap(l=>l.materials.map(m=>m.card));
 if(new Set(cards).size!==cards.length||!valid())return reject();
 for(const leg of legs){
  if(leg.options.payment===true&&game.sgs_zhangfen_payment_preflight?.(leg.owner,leg.materials,leg.options)?.allowed===false)return reject();
  if(game.sgs_zhangfen_before_move){const guard=await game.sgs_zhangfen_before_move(leg.owner,leg.materials,leg.options);
   if(guard.blocked_materials.length||guard.allowed_materials.length!==leg.materials.length||!valid())return reject();}
 }
 if(!valid())return reject();
 const prepared=legs.map(leg=>{
  const {owner,materials,options:o}=leg,cards=materials.map(m=>m.card),semantic=o.semantic_action??o.action??(o.to==='discard'?'discard':null);
  const captureGlobal=o.to==='discard'&&['discard','judgment'].includes(semantic)&&!o.death_cleanup&&Boolean(game.more_discard_observers?.().length);
  let actionMaterials=game.capture_card_action_faces?.(owner,materials,{action:o.action??(o.to==='hand'?'give':'discard'),to:o.to,move_id:o.move_id})??materials;
  if(captureGlobal)actionMaterials=actionMaterials.map(m=>{const f=game.effective_card(m.card,owner);return {...m,effective_face:{name:f.name,type:f.type,suit:f.suit,color:f.color,rank:f.rank}};});
  if(['discard','mandatory_discard'].includes(o.semantic_action??o.action)&&game.record_committed_discard_categories)actionMaterials=actionMaterials.map(m=>({...m,action_card_family:game.card_family(m.card)}));
  const poisonCards=enabled(game)&&o.visibility==='public'&&!o.poison_exempt?materials.filter(m=>m.zone==='hand'&&is_youjian_poison(m.card)).map(m=>m.card):[];
  if(poisonCards.length)requireMethod(game,'lose_hp');
  const facts={cards,actionMaterials,leaveFaces:new Map(),poisonCards,snapshot:Boolean(game.youjian_poison_armor_snapshot?.(owner,o)),captureGlobal,semantic,hand_before:owner.hand.length};
  return {leg,facts};
 });
 // Group removals across legs: a prior splice must never shift another exact index.
 const removals=new Map();for(const {owner,materials} of legs)for(const m of materials){const pile=sourceArray(game,owner,m.zone);if(!removals.has(pile))removals.set(pile,[]);removals.get(pile).push(m);}
 for(const [pile,rows] of removals)for(const m of rows.sort((a,b)=>b.index-a.index))pile.splice(m.index,1);
 for(const {leg,facts} of prepared)destination(game,leg.options.to,leg.options.recipient).push(...facts.cards);
 // Movement hooks are code-owned and synchronous; no observer sees a half trade.
 for(const {leg,facts} of prepared)for(const card of facts.cards)game.copied_card_moved?.(card,leg.options.to,leg.options.recipient,leg.options);
 for(const {leg,facts} of prepared){
  facts.hand_after=leg.owner.hand.length;
  const r=leg.receipt;r.committed=true;r.stage='commit_callback';r.effective_faces=facts.actionMaterials.map(m=>m.effective_face??null);r.hand_before=facts.hand_before;r.hand_after=facts.hand_after;
  r.locations=facts.cards.map(card=>({physical_id:game.card_history_material_id(card),epoch:game.card_location_epoch(card)}));
  r.youjian_poison_armor_snapshot=facts.snapshot;r.poison_count=facts.poisonCards.length;r.poison_resolved=0;
  r.result={committed:true,move_id:leg.options.move_id};
 }
 receipt.committed=true;receipt.result={committed:true,move_id:options.move_id,moves:legs.map(l=>l.receipt.result)};
 let callbackError=null;
 try{const callback=options.on_committed?.(prepared.map(p=>p.facts.cards),receipt.result);
  if(callback&&typeof callback.then==='function'){Promise.resolve(callback).catch(()=>{});callbackError=Error('多腿原子移牌提交回调必须同步');}
 }catch(error){callbackError=error;}
 // A malformed return from an otherwise synchronous code-owned callback can
 // only be discovered after commit. Finish all committed effects, then report.
 await game.flush_general_state_events?.();
 for(const {leg,facts} of prepared)await finishCommittedMove(game,leg.owner,leg.materials,leg.options,leg.receipt,facts,{skipCallback:true});
 receipt.status='done';if(callbackError)throw callbackError;return receipt.result;
}

export const youjianCardEventMethods = {
  public_card_transaction(rawLegs,rawOptions={}){
   rawOptions={...rawOptions}; // Stable request/callback identity is captured before yielding.
   try{
    if(!Array.isArray(rawLegs)||!rawLegs.length)throw Error('原子移牌需要至少一腿');
    syncCallback(rawOptions.validate,'原子移牌validate');syncCallback(rawOptions.on_committed,'原子移牌on_committed');
    const move_id=validId(rawOptions.move_id),key=JSON.stringify(move_id),state=runtime(this),receipts=this.card_transaction_receipts??={};
    const legs=rawLegs.map((l,i)=>{
     const materials=l.materials?.map(m=>({...m}));
     const options={to:'hand',recipient:null,visibility:'private',reason:'原子交换',poison_exempt:false,...l,move_id:`${JSON.stringify(move_id)}:leg:${i+1}`};delete options.owner;delete options.materials;
     if(!l.owner||!['hand','discard'].includes(options.to)||!['public','private'].includes(options.visibility)||options.to==='hand'&&!options.recipient?.hand
       ||!Array.isArray(materials)||!materials.length||materials.some(m=>!['hand','bifa'].includes(m.zone)||!Number.isSafeInteger(m.epoch)||m.epoch<0))throw Error('原子移牌仅支持带epoch的手牌/笔伐区至手牌/弃牌堆');
     syncCallback(options.validate,'原子移牌腿validate');
     if(options.on_committed!=null||options.before_atomic_commit!=null)throw Error('原子交换只允许统一提交回调');
     return {owner:l.owner,materials,options};
    });
    const request=legs.map(l=>({...requestRecord(this,l.owner,l.materials,l.options),epochs:l.materials.map(m=>m.epoch)}));
    if(Object.hasOwn(receipts,key)){
     const old=receipts[key],refs=state.transactionRequests.get(key);
     if(JSON.stringify(old.request)!==JSON.stringify(request)||refs&&legs.some((l,i)=>refs[i].owner!==l.owner||refs[i].recipient!==l.options.recipient||l.materials.some((m,j)=>refs[i].cards[j]!==m.card)))throw Error('同一原子移牌ID不能改换实体、来源或终点');
     if(state.transactions.has(key)){if(rawOptions.reentrant)return old.committed?Promise.resolve(old.result):Promise.reject(Error('不能重入未提交原子移牌'));return state.transactions.get(key);}
     if(old.status==='done')return Promise.resolve(old.result);
     throw Error('原子移牌尚未完成，须恢复原协程或动作日志');
    }
    this.card_move_receipts??={};
    for(const l of legs)if(Object.hasOwn(this.card_move_receipts,JSON.stringify(l.options.move_id)))throw Error('原子移牌子ID已被占用');
    nextId(this);const receipt=receipts[key]={status:'pending',committed:false,move_id,request};
    for(const l of legs){nextId(this);l.receipt=this.card_move_receipts[JSON.stringify(l.options.move_id)]={status:'pending',stage:'validate',committed:false,move_id:l.options.move_id,request:requestRecord(this,l.owner,l.materials,l.options)};}
    state.transactionRequests.set(key,legs.map(l=>({owner:l.owner,recipient:l.options.recipient,cards:l.materials.map(m=>m.card)})));
    const promise=Promise.resolve().then(()=>completeTransaction(this,legs,rawOptions,receipt)).then(result=>{if(!result.committed)for(const l of legs){l.receipt.status='done';l.receipt.result={committed:false,move_id:l.options.move_id};}return result;}).catch(e=>{receipt.status='failed';receipt.error=String(e.message??e);throw e;}).finally(()=>state.transactions.delete(key));
    state.transactions.set(key,promise);return promise;
   }catch(error){return Promise.reject(error);}
  },

  /** All requested exact indexes are validated together. A stale/duplicate
   * physical card rejects the whole batch; accepted moves await all effects. */
  public_card_loss(owner, materials, rawOptions = {}) {
    const options = {to:'discard',recipient:null,visibility:'public',reason:'移动牌',poison_exempt:false,...rawOptions};
    if (!['public','private'].includes(options.visibility)) return Promise.reject(Error('牌移动缺少明确的公开性'));
    if (!['discard','processing','hand','field','judgment','board_equipment','pojun_pile','qian','jieyue','bifa','decktop','zhangfen_removed','zhangfen_destroyed'].includes(options.to)) return Promise.reject(Error(`不支持的移牌终点：${options.to}`));
    const receipts = this.card_move_receipts ??= {};
    materials = Array.isArray(materials) ? materials.map(material=>material && {...material}) : materials;
    const state = runtime(this), pending = state.moves;
    let move_id;
    try {
      if (options.move_id == null) do { move_id=nextId(this); } while (Object.hasOwn(receipts,JSON.stringify(move_id)));
      else move_id=validId(options.move_id);
    } catch (error) { return Promise.reject(error); }
    options.move_id = move_id;
    const key = JSON.stringify(move_id);
    const request = requestRecord(this,owner,materials,options);
    if (Object.hasOwn(receipts,key)) {
      const receipt = receipts[key], original = state.moveRequests.get(key);
      if (original && (original.owner !== owner || original.recipient !== options.recipient || original.cards.length !== (materials?.length ?? 0) || original.cards.some((card,index)=>card !== materials[index]?.card))) return Promise.reject(Error('同一移牌ID不能替换原实体引用'));
      if (JSON.stringify(receipt.request) !== JSON.stringify(request)) return Promise.reject(Error('同一移牌ID不能用于不同实体、来源或终点'));
      if (pending.has(key)) {
        if (rawOptions.reentrant === true) return receipt.committed ? Promise.resolve(receipt.result) : Promise.reject(Error('不能重入等待尚未提交的同一移牌事务'));
        return pending.get(key);
      }
      if (receipt.status === 'done') return Promise.resolve(receipt.result);
      return Promise.reject(Error('移牌事务尚未完成，须恢复原事务或从动作日志重放，不能重复移牌'));
    }
    if (rawOptions.move_id != null) nextId(this); // Each new explicit ID also advances the stable sequence.
    const receipt = receipts[key] = {status:'pending',stage:'validate',committed:false,move_id,request};
    state.moveRequests.set(key,{owner,recipient:options.recipient,cards:Array.isArray(materials) ? materials.map(material=>material?.card) : []});
    const promise = Promise.resolve().then(()=>completeMove(this,owner,materials,options,receipt)).catch(error=>{
      receipt.status = 'failed';receipt.error = String(error?.message ?? error);throw error;
    }).finally(()=>pending.delete(key));
    pending.set(key,promise);
    return promise;
  },

  /** There is no global async drain: each transaction directly awaits its own
   * child effects. This is intentionally safe inside an active loss/rescue. */
  async flush_card_events() {},

  gift_targets(actor, card) {
    if (!ownPlay(this,actor) || !giftMarked(this,card) || !actor.hand?.includes(card)) return [];
    const slot = SLOT_BY_TYPE[card.type];
    return participants(this).filter(target=>target !== actor && alive(target) && !slotAbolished(this,target,slot));
  },
  can_give_gift(actor, card, target) { return this.gift_targets(actor,card).includes(target); },
  gift_available_actions(actor) {
    if (!ownPlay(this,actor)) return [];
    return actor.hand.flatMap((card,index)=>{
      const targets = this.gift_targets(actor,card);
      return targets.length ? [{id:`gift:${index+1}`,card,index,targets,available:true}] : [];
    });
  },

  /** A gift is a separate action, never a card use or a nullifiable trick.
   * True means committed, including a later legal failure to discard. */
  give_gift(actor, card, target) {
    const gifts = runtime(this).gifts;
    const existing = card && typeof card === 'object' ? gifts.get(card) : null;
    if (existing) return existing.actor === actor && existing.target === target ? existing.promise : Promise.resolve(false);
    if (!this.can_give_gift(actor,card,target)) return Promise.resolve(false);
    const slot = SLOT_BY_TYPE[card.type];
    if (slot) requireMethod(this,'equip_card');
    requireMethod(this,'youjian_gift_blocked');
    const event_id = nextId(this,'gift');
    const receipt = (this.youjian_card_event_receipts ??= {})[event_id] = {kind:'gift',status:'pending',actor:seat(this,actor),target:seat(this,target),card:cardRecord(card),stage:'offer'};
    const promise = Promise.resolve().then(async()=>{
      if (!this.can_give_gift(actor,card,target)) { receipt.status='done';receipt.result=false;return false; }
      const moved = await this.public_card_loss(actor,[{zone:'hand',index:actor.hand.indexOf(card),card}],
        {to:'processing',visibility:'public',reason:'赠予',move_id:`${event_id}:offer`,action:'gift',recipient:null,gift_target:seat(this,target)});
      receipt.committed = moved.committed;
      if (!moved.committed) { receipt.status='done';receipt.result=false;return false; }
      // Source death intentionally does not cancel an already committed gift.
      receipt.stage = 'deliver';
      if (!this.processing_cards.includes(card)) {
        receipt.status='done';receipt.stage='complete';receipt.failure='赠物已由触发效果移动';receipt.result=true;return true;
      }
      let failure = !alive(target) ? '目标已死亡' : slotAbolished(this,target,slot) ? '对应装备槽已废除' : this.youjian_gift_blocked(target,{action:'gift',source:actor}) ? '战象' : null;
      if (failure) {
        await processingMove(this,card,'discard',null,{reason:`赠予失败：${failure}`,visibility:'public',move_id:`${event_id}:discard`,action:'gift'});
        emit(this,`${actor.name}赠予${target.name}的${card.name}因${failure}进入弃牌堆。`);
      } else if (slot) {
        // Host retains processing ownership through old-slot leave callbacks,
        // then atomically puts this same object into the destination equipment.
        const equipped = await this.equip_card(target,slot,card,{reason:'赠予',source:actor,action:'gift',from_processing:true,gift_event_id:event_id});
        if (this.processing_cards.includes(card)) {
          failure = '结算时目标或装备槽已失效';
          await processingMove(this,card,'discard',null,{reason:`赠予失败：${failure}`,visibility:'public',move_id:`${event_id}:discard`,action:'gift'});
        } else if (equipped === null || equipped === false) {
          failure = '结算时目标或装备槽已失效';
          emit(this,`${actor.name}赠予${target.name}的${card.name}因${failure}进入弃牌堆。`);
        } else emit(this,`${actor.name}将${card.name}赠予${target.name}并进入其装备区。`);
      } else {
        const delivered = await processingMove(this,card,'hand',target,{reason:'赠予获得',visibility:'public',move_id:`${event_id}:deliver`,action:'gift',source:actor});
        if (delivered) emit(this,`${actor.name}将${card.name}赠予${target.name}。`);
        else if (this.processing_cards.includes(card)) {
          failure = '结算时目标已失效';
          await processingMove(this,card,'discard',null,{reason:`赠予失败：${failure}`,visibility:'public',move_id:`${event_id}:discard`,action:'gift'});
        }
      }
      receipt.status='done';receipt.stage='complete';receipt.failure=failure;receipt.result=true;
      return true;
    }).catch(error=>{receipt.status='failed';receipt.error=String(error?.message ?? error);throw error;}).finally(()=>gifts.delete(card));
    gifts.set(card,{actor,target,promise});
    return promise;
  },

  /** Input cards are the exact Deck.draw result, already tracked in processing.
   * The source classification is explicit; other gains must not call this API. */
  obtain_drawn_cards(owner, cards, {reason='摸牌'} = {}) {
    const draws = runtime(this).draws;
    if (!Array.isArray(cards)) return Promise.reject(Error('牌堆获得须传入实体牌数组'));
    for (const pending of draws) if (pending.owner === owner && pending.cards.length === cards.length && pending.cards.every((card,index)=>card === cards[index])) return pending.promise;
    if (!cards.length) return Promise.resolve([]);
    const copy = [...cards];
    const materials = copy.map(card=>({zone:'processing',index:this.processing_cards.indexOf(card),card}));
    if (!validMaterials(this,null,materials,owner)) return Promise.resolve([]);
    const event_id = nextId(this,'draw');
    const receipt = (this.youjian_card_event_receipts ??= {})[event_id] = {kind:'draw',status:'pending',owner:seat(this,owner),reason,cards:copy.map(cardRecord),resolved:0,choices:[]};
    const pending = {owner,cards:copy,promise:null};
    const promise = Promise.resolve().then(async()=>{
      const obtained = [];
      for (const [index,card] of copy.entries()) {
        if (!this.processing_cards.includes(card)) { receipt.resolved=index+1;continue; }
        let target = null;
        if (!owner.dead && enabled(this) && is_youjian_poison(card)) target = await choosePoisonRecipient(this,owner,card,{event_id,reason,index,count:copy.length});
        if (!this.processing_cards.includes(card)) { receipt.resolved=index+1;continue; }
        if (target && !alive(target)) target = null;
        const recipient = target ?? owner;
        const to = recipient.dead ? 'discard' : 'hand';
        receipt.choices.push({index,target:target ? seat(this,target) : null,to});
        const moved = await processingMove(this,card,to,to === 'hand' ? recipient : null,{reason:target ? '毒·牌堆展示交给' : reason,
          visibility:target ? 'public' : 'private',move_id:`${event_id}:${index+1}`,action:target ? 'give' : 'draw',draw_event_id:event_id,original_recipient:seat(this,owner),source_zone:'draw_pile'});
        if (moved && target) emit(this,`${owner.name}展示即将获得的毒，并交给${target.name}。`);
        if (moved && !target && to === 'hand') obtained.push(card);
        receipt.resolved=index+1;
      }
      receipt.status='done';receipt.result={obtained:obtained.map(cardRecord)};
      return obtained;
    }).catch(error=>{receipt.status='failed';receipt.error=String(error?.message ?? error);throw error;}).finally(()=>draws.delete(pending));
    pending.promise=promise;draws.add(pending);
    return promise;
  },
};
