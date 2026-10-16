/** Isolated, unregistered 三尖两刃刀 module.
 * Install only at source-after-damage AFTER rescue and BEFORE receiver reactions.
 * See docs/sanjian/INTEGRATION-CONTRACT.md for the mandatory host boundaries.
 */
import {is_sha_type} from './models.js';

export const SANJIAN_EQUIPMENT_ID = 'sgs.guozhan.equipment.sanjian';
export const SANJIAN_PACK_ID = 'sgs_guozhan_sanjian_compat_1';
export const SANJIAN_DAMAGE_WINDOW = 'source_after_damage_after_rescue';
export const SANJIAN_RULES = Object.freeze({
  id:SANJIAN_EQUIPMENT_ID,name:'三尖两刃刀',slot:'weapon',range:3,suit:'diamond',rank:12,
  pack_id:SANJIAN_PACK_ID,default_enabled:false,enabled_copies:1,default_copies:0,
  hero_generated:false,current_client_all_interactions_verified:false,
  source_status:'historical_mobile_membership_official_shared_core',
});
const alive = p => Boolean(p?.alive && !p.dead);
const players = g => g.all_players?.() ?? g.players ?? [];
const validId = id => (typeof id === 'string' && id.length > 0) || (typeof id === 'number' && Number.isFinite(id));
const id = (g,p) => {
  if (!p || !players(g).includes(p)) throw Error('三尖两刃刀需要当前人物名单内的稳定身份');
  const value = g.player_id?.(p) ?? p.player_id ?? g.seat_of?.(p);
  if (!validId(value)) throw Error('三尖两刃刀缺少稳定人物ID');
  return value;
};
const physicalId = c => c?.physical_id ?? c?.physicalCardId ?? c?.derived_identity ?? null;
const cardRecord = c => ({physical_id:physicalId(c),name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const emit = (g,text,event) => g.view?.emit?.(text,event);
const runtimes = new WeakMap();
function runtime(g) {
  let r = runtimes.get(g);
  if (!r) runtimes.set(g,r={pending:new Map(),references:new Map()});
  return r;
}
export function create_sanjian_state() { return {version:1,receipts:{}}; }
function state(g) {
  g.sanjian_state ??= create_sanjian_state();
  if (g.sanjian_state.version !== 1 || !g.sanjian_state.receipts || Array.isArray(g.sanjian_state.receipts)) throw Error('无效三尖两刃刀事务状态');
  return g.sanjian_state;
}
export function sanjian_enabled(game) { return Array.isArray(game.content_packs) && game.content_packs.includes(SANJIAN_PACK_ID); }
export function sanjian_weapon_active(game,actor) {
  const weapon=actor?.weapon;
  return sanjian_enabled(game) && alive(actor) && !actor.equipment_disabled && !actor.weapon_disabled
    && weapon?.type === '武器' && !weapon.virtual
    && [SANJIAN_EQUIPMENT_ID,'sgs_sanjian'].includes(weapon.equipment_id)
    && (!weapon.content_pack || weapon.content_pack === SANJIAN_PACK_ID);
}
/** Missing provenance is rejected, never inferred from a retained kind:'sha'. */
export function sanjian_event_rejection(game,event) {
  if (!sanjian_enabled(game)) return 'pack_disabled';
  if (event?.damage_window !== SANJIAN_DAMAGE_WINDOW || event.dying_resolved !== true) return 'wrong_window';
  if (!validId(event.damage_event_id) || !validId(event.card_use_id)) return 'missing_event_identity';
  if (event.method !== 'direct_card_effect' || event.chain_transfer || event.transferred
    || (event.transfers?.length ?? 0) > 0) return 'not_direct_card_effect';
  if (event.kind !== 'sha' || !is_sha_type(event.source_card?.type)
    || !event.source || event.card_user !== event.source || event.sha_user && event.sha_user !== event.source) return 'not_source_sha_use';
  if (!Number.isFinite(event.damage) || event.damage <= 0 || event.prevented === true || event.cancelled === true) return 'no_actual_damage';
  if (event.current_sha_target !== event.target) return 'not_current_sha_target';
  if (!players(game).includes(event.source) || !players(game).includes(event.target)) return 'unknown_participant';
  if (!sanjian_weapon_active(game,event.source)) return 'inactive_weapon';
  if (!alive(event.target)) return 'dead_origin';
  return null;
}
/** Living endpoint validation precedes the host distance query. In particular,
 * Game.distance_between's missing-seat fallback must never revive dead B. */
export function sanjian_targets(game,origin) {
  if (!alive(origin) || !players(game).includes(origin)) return [];
  const ring=game.turn_order?.() ?? players(game);
  if (!ring.includes(origin)) return [];
  if (typeof game.distance_between !== 'function') throw Error('三尖两刃刀缺少有向距离查询');
  return players(game).filter(target=>target !== origin && alive(target) && ring.includes(target)
    && game.distance_between(origin,target) === 1);
}
function uniquePhysical(game,card) {
  const all=[...(game.deck?.draw_pile??[]),...(game.deck?.discard_pile??[]),...(game.processing_cards??[]),...(game.offboard_cards??[]),
    ...players(game).flatMap(p=>[...(p.hand??[]),...(p.judgment_cards??[]),p.weapon,p.armor,p.offensive_horse,p.defensive_horse].filter(Boolean))];
  return all.filter(other=>other === card || physicalId(card) !== null && physicalId(other) === physicalId(card)).length === 1;
}
export function sanjian_hand_options(game,actor,event,{can_discard_hand=null}={}) {
  const excluded=new Set([event?.source_card,...(event?.physical_cards??[]),...(event?.source_card?.materials??[])]);
  const permit=can_discard_hand ?? game.sanjian_can_discard_hand;
  return (actor?.hand??[]).flatMap((card,index)=>{
    if (!card || card.virtual || card.discardable === false || excluded.has(card)
      || (game.processing_cards??[]).includes(card) || !uniquePhysical(game,card)) return [];
    if (permit) {
      const allowed=permit.call(game,actor,card,{zone:'hand',action:'discard',equipment_id:SANJIAN_EQUIPMENT_ID});
      if (allowed?.then) throw Error('弃牌合法性查询必须同步且无副作用');
      if (!allowed) return [];
    }
    return [{id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`}];
  });
}
function publicTarget(game,actor,target) {
  return {player_id:id(game,target),name:target.name??'',hp:target.hp,
    is_self:target===actor,is_enemy:typeof game.side_of === 'function' ? game.side_of(target)!==game.side_of(actor) : false};
}
/** Own cards + public target summaries only. Self/ally remain legal for humans;
 * this conservative policy declines when no enemy has a positive damage preview. */
export function sanjian_ai_choice(costs,targets) {
  const target=[...targets].filter(t=>t.is_enemy && t.damage_preview>0).sort((a,b)=>a.hp-b.hp)[0];
  const cost=[...costs].sort((a,b)=>(a.ai_cost??0)-(b.ai_cost??0)||a.index-b.index)[0];
  return target && cost ? {cost_id:cost.id,target_id:target.player_id} : null;
}
const materialCost = card => ({桃:6,闪:4,酒:3,杀:2,血杀:2,毒杀:2,毒:8}[card.type]??1);
async function choose(game,actor,origin,costs,targets,event,dependencies) {
  const publicTargets=targets.map(target=>({...publicTarget(game,actor,target),damage_preview:typeof game.equipment_modify_damage === 'function'
    ? game.equipment_modify_damage(target,1,{source:actor,kind:'skill',method:'skill_effect',source_card:null,card_user:null,nature:'normal',physical_cards:[],armor_ignored:false}) : 1}));
  const ownCosts=costs.map(c=>({...c,ai_cost:materialCost(c.card)}));
  const offer={actor_id:id(game,actor),origin:publicTarget(game,actor,origin),costs:ownCosts,targets:publicTargets,
    damage_event_id:event.damage_event_id,cancellable:true};
  if (dependencies.choose) return dependencies.choose(offer);
  if (actor.is_ai) return sanjian_ai_choice(ownCosts,publicTargets);
  if (typeof game.view?.ask_line !== 'function') throw Error('三尖两刃刀缺少私有选择接口');
  const combinations=costs.flatMap(cost=>publicTargets.map(target=>({
    cost_id:cost.id,target_id:target.player_id,
    label:`弃置${cost.label}，对${target.name}造成1点普通伤害`,
  }))).map((option,index)=>({...option,id:`choice:${index+1}`}));
  while (true) {
    const answer=await game.view.ask_line(`三尖两刃刀：从受伤者${origin.name}计算距离，选择一张手牌和一名距离为1的角色；确认后弃牌。`,{
      kind:'choice',player_id:game.seat_of?.(actor)??id(game,actor),
      options:[...combinations.map(({id,label})=>({id,label})),{id:'cancel',label:'放弃发动，不弃牌'}],
      meta:{equipment:'三尖两刃刀',equipment_id:SANJIAN_EQUIPMENT_ID,stage:'sanjian_cost_target',
        private_to:game.seat_of?.(actor)??id(game,actor),origin_id:id(game,origin),damage_event_id:event.damage_event_id,
        cost_zone:'own_hand',cancellable:true,targets:publicTargets.map(({player_id,name})=>({player_id,name}))},
    });
    if (answer==null || ['cancel','0','pass','n','timeout'].includes(String(answer).trim())) return null;
    const selected=combinations.find(c=>c.id===String(answer).trim());
    if (selected) return {cost_id:selected.cost_id,target_id:selected.target_id};
    emit(game,'请选择完整的手牌与目标组合，或放弃发动。',{private_to:game.seat_of?.(actor)??id(game,actor)});
  }
}
function requestRecord(game,event) {
  return {damage_event_id:event.damage_event_id,card_use_id:event.card_use_id,actor_id:id(game,event.source),
    origin_id:id(game,event.target),card_user_id:event.card_user ? id(game,event.card_user) : null,
    sha_user_id:event.sha_user ? id(game,event.sha_user) : null,current_sha_target_id:event.current_sha_target ? id(game,event.current_sha_target) : null,
    method:event.method??null,kind:event.kind??null,nature:event.nature??'normal',damage:event.damage,
    source_card:cardRecord(event.source_card),chain_transfer:!!event.chain_transfer,transferred:!!event.transferred,
    transfers:(event.transfers??[]).map(t=>({skill:t.skill??null,from:t.from??null,to:t.to??null})),
    prevented:event.prevented===true,cancelled:event.cancelled===true,damage_window:event.damage_window??null,dying_resolved:event.dying_resolved===true};
}
function result(receipt,outcome,extra={}) {
  receipt.status='done';receipt.stage='complete';
  return receipt.result={damage_event_id:receipt.request.damage_event_id,actor_id:receipt.request.actor_id,
    offered:receipt.offered,committed:receipt.committed,outcome,...extra};
}
const pendingError = () => Object.assign(Error('三尖两刃刀事务尚未完成；恢复原协程或从动作日志重放，不能重新扣牌'),{code:'SANJIAN_PENDING_REPLAY_REQUIRED'});
/** Exactly one opportunity per original damage event and source actor.
 * A returned committed:true also covers a paid effect whose target later died.
 * A saved pending/failed receipt never authorizes an unsafe second payment.
 */
export function resolve_sanjian_after_damage(game,event,{dependencies={},reentrant=false}={}) {
  // Unrelated events do not create state or consume a future valid opportunity.
  if (!sanjian_enabled(game) || !validId(event?.damage_event_id) || !event?.source || !players(game).includes(event.source)
    || !event.target || !players(game).includes(event.target)) return Promise.resolve({offered:false,committed:false,outcome:'ineligible'});
  let request,key;
  try {
    request=requestRecord(game,event);key=JSON.stringify([request.damage_event_id,request.actor_id]);
    const allIds=players(game).map(p=>id(game,p));if (new Set(allIds).size!==allIds.length) throw Error('三尖两刃刀人物ID不能重复');
  } catch(error) { return Promise.reject(error); }
  const receipts=state(game).receipts,r=runtime(game),prior=Object.hasOwn(receipts,key)?receipts[key]:null;
  if (prior) {
    if (JSON.stringify(prior.request)!==JSON.stringify(request)) return Promise.reject(Error('同一伤害事件ID不能替换三尖两刃刀的来源、目标或伤害事实'));
    const refs=r.references.get(key);
    if (refs && (refs.actor!==event.source || refs.origin!==event.target || refs.card!==event.source_card)) return Promise.reject(Error('同一伤害事件不能替换原人物或牌引用'));
    if (r.pending.has(key)) {
      if (reentrant) return prior.committed ? Promise.resolve({offered:prior.offered,committed:true,in_progress:true,outcome:'resolving'}) : Promise.reject(pendingError());
      return r.pending.get(key);
    }
    return prior.status==='done' ? Promise.resolve(prior.result) : Promise.reject(pendingError());
  }
  const receipt=receipts[key]={request,status:'pending',stage:'validate',offered:false,committed:false};
  r.references.set(key,{actor:event.source,origin:event.target,card:event.source_card});
  const task=Promise.resolve().then(async()=>{
    if (JSON.stringify(requestRecord(game,event))!==JSON.stringify(request)) return result(receipt,'stale_event');
    const rejection=sanjian_event_rejection(game,event);
    if (rejection) return result(receipt,rejection);
    if (typeof game.public_card_loss!=='function' || typeof game.apply_damage!=='function') throw Error('三尖两刃刀需要公开移牌事务和普通伤害内核');
    if (game.public_card_loss_supports_on_committed !== true) throw Object.assign(Error('三尖两刃刀需要已接入的公开移牌 on_committed 边界；未支付费用'),{code:'SANJIAN_COMMIT_HOOK_REQUIRED'});
    const actor=event.source,origin=event.target,weapon=actor.weapon;
    const costs=sanjian_hand_options(game,actor,event,dependencies),targets=sanjian_targets(game,origin);
    if (!costs.length || !targets.length) return result(receipt,!costs.length?'no_hand_cost':'no_target');
    receipt.offered=true;receipt.stage='choose';
    emit(game,`${actor.name}可发动三尖两刃刀（从${origin.name}计算距离）。`,{event_type:'sanjian_offer',damage_event_id:event.damage_event_id,actor_id:request.actor_id,origin_id:request.origin_id});
    const selected=await choose(game,actor,origin,costs,targets,event,dependencies);
    if (!selected) return result(receipt,'declined');
    const cost=costs.find(c=>c.id===selected.cost_id),target=targets.find(p=>id(game,p)===selected.target_id);
    if (!cost || !target) return result(receipt,'invalid_selection');
    // Revalidate the entire tuple AFTER the asynchronous choice, BEFORE payment.
    if (JSON.stringify(requestRecord(game,event))!==JSON.stringify(request) || sanjian_event_rejection(game,event) || actor.weapon!==weapon || !sanjian_targets(game,origin).includes(target)
      || !sanjian_hand_options(game,actor,event,dependencies).some(c=>c.card===cost.card && c.index===cost.index)) return result(receipt,'stale_selection');
    receipt.stage='paying';receipt.target_id=id(game,target);receipt.cost=cardRecord(cost.card);
    receipt.distance_origin_id=request.origin_id;receipt.distance_at_commit=1;
    receipt.seat_order_revision=game.seat_order_state?.revision??null;
    receipt.move_id=`sanjian-cost:${key}`;
    const onCommitted=()=>{
      if (receipt.committed) return;
      receipt.committed=true;receipt.stage='cost_effects';
      emit(game,`${actor.name}发动三尖两刃刀，弃置${cost.card}，选择${target.name}。`,{
        event_type:'sanjian_cost',damage_event_id:event.damage_event_id,move_id:receipt.move_id,
        actor_id:request.actor_id,origin_id:request.origin_id,target_id:receipt.target_id,cost:receipt.cost,
      });
    };
    const paid=await game.public_card_loss(actor,[cost],{to:'discard',reason:'三尖两刃刀',action:'discard',
      equipment_id:SANJIAN_EQUIPMENT_ID,operation:'discard',visibility:'public',move_id:receipt.move_id,
      damage_event_id:event.damage_event_id,on_committed:onCommitted});
    if (!paid.committed) return result(receipt,'cost_rejected');
    // Required host hook: after the atomic destination exists, before nested loss
    // effects. Fail closed if an older mover silently ignores the callback.
    if (!receipt.committed) {
      receipt.committed=true;
      throw Object.assign(Error('公开移牌缺少提交后、失牌事件前的 on_committed 边界；费用已付，禁止重试扣牌'),{code:'SANJIAN_COMMIT_HOOK_REQUIRED'});
    }
    if (!alive(target) || !players(game).includes(target)) return result(receipt,'target_dead',{target_id:receipt.target_id,damage:0});
    // Do not recheck weapon, B, or distance after the accepted cost. This is an
    // explicitly labelled cross-pack committed-effect policy, not a second SHA.
    receipt.stage='damage';
    const source=alive(actor) && players(game).includes(actor) ? actor : null;
    const context={source,kind:'skill',method:'skill_effect',channel:'equipment_skill:sanjian',
      source_skill:'三尖两刃刀',equipment_id:SANJIAN_EQUIPMENT_ID,origin_actor_id:request.actor_id,
      parent_damage_event_id:event.damage_event_id,parent_card_use_id:event.card_use_id,
      damage_event_id:`sanjian-damage:${key}`,card_use_id:null,card_user:null,source_card:null,physical_cards:[],
      nature:'normal',chain_transfer:false,armor_ignored:false,
      message:'{name}受到三尖两刃刀 {damage} 点普通伤害，剩余血量 {hp}。'};
    emit(game,`三尖两刃刀对${target.name}结算1点普通伤害。`,{event_type:'sanjian_effect',
      damage_event_id:context.damage_event_id,parent_damage_event_id:event.damage_event_id,
      actor_id:source?request.actor_id:null,origin_actor_id:request.actor_id,target_id:receipt.target_id});
    const damage=await game.apply_damage(target,1,context);
    receipt.actual_receiver_id=context.result_event?.target ? id(game,context.result_event.target) : receipt.target_id;
    return result(receipt,'resolved',{target_id:receipt.target_id,actual_receiver_id:receipt.actual_receiver_id,damage});
  }).catch(error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>r.pending.delete(key));
  r.pending.set(key,task);return task;
}
