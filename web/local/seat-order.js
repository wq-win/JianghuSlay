/** Mutable physical seat ring. Actor IDs own cards, roles and controllers;
 * a seat position never does. Increasing array position means counterclockwise.
 * The host must use this ring for live distance and newly created action queues.
 * A pre-existing queue remains a snapshot. Competitive team-action modes need
 * their own scheduler and are intentionally not inferred from this helper.
 */
export function stable_actor_id(id) {
  if ((typeof id !== 'string' && typeof id !== 'number') || String(id).length === 0
    || typeof id === 'number' && !Number.isFinite(id)) throw Error('A stable actor ID is required');
  return id;
}
export function seat_player_id(game, player, dependencies = {}) {
  return stable_actor_id(dependencies.player_id?.(player) ?? game.player_id?.(player)
    ?? player?.player_id ?? game.seat_of?.(player));
}
function uniqueIds(ids) {
  if (!Array.isArray(ids) || !ids.length) throw Error('Seat order requires a nonempty actor-ID array');
  ids.forEach(stable_actor_id);
  if (new Set(ids).size !== ids.length) throw Error('Seat order cannot repeat an actor ID');
}
export function create_seat_order(actor_ids) {
  uniqueIds(actor_ids);
  return {version:1,direction:'counterclockwise',order:[...actor_ids],revision:0,swap_receipts:{}};
}
export function validate_seat_order(state) {
  if (state?.version !== 1 || state.direction !== 'counterclockwise'
    || !Number.isSafeInteger(state.revision) || state.revision < 0
    || !state.swap_receipts || Array.isArray(state.swap_receipts)) throw Error('Invalid seat-order state');
  uniqueIds(state.order);
  return state;
}
/** all_players must enumerate fixed identities, never whatever occupies slot 0.
 * The legacy seat_of fallback is permitted only if it is a stable p1/p2/p3 ID.
 */
export function ensure_seat_order(game, dependencies = {}) {
  const players = game.all_players?.() ?? game.players ?? [];
  const ids = players.map(p => seat_player_id(game,p,dependencies));
  uniqueIds(ids);
  if (!game.seat_order_state) game.seat_order_state = create_seat_order(ids);
  const state = validate_seat_order(game.seat_order_state);
  if (ids.length !== state.order.length || ids.some(id => !state.order.includes(id))) {
    throw Error('Actor roster changed; seat state needs an explicit roster migration');
  }
  return state;
}
export function seat_index(state, actor_id) {
  validate_seat_order(state);
  return state.order.indexOf(stable_actor_id(actor_id));
}
function indexOrThrow(state, id) {
  const index = seat_index(state,id);
  if (index < 0) throw Error('Actor ID is absent from seat order');
  return index;
}
export function snapshot_seat_order(state, {from_id=null,include_origin=true,living_ids=null} = {}) {
  validate_seat_order(state);
  let order = [...state.order];
  if (from_id !== null) {
    const i = indexOrThrow(state,from_id);
    order = [...order.slice(i),...order.slice(0,i)];
    if (!include_origin) order.shift();
  }
  if (living_ids !== null) {
    const living = new Set(living_ids);
    order = order.filter(id => living.has(id));
  }
  return {version:1,direction:state.direction,revision:state.revision,order};
}
export function next_seat_actor(state, actor_id, {living_ids=state.order} = {}) {
  const start = indexOrThrow(state,actor_id), living = new Set(living_ids);
  for (let n=1;n<=state.order.length;n++) {
    const id = state.order[(start+n)%state.order.length];
    if (living.has(id)) return id;
  }
  return null;
}
/** Ring distance only. The host layers horses, range and hard prohibitions on
 * top; an absent/dead endpoint returns null rather than fabricating distance 1.
 */
export function seat_distance(state, from_id, to_id, {living_ids=state.order} = {}) {
  indexOrThrow(state,from_id);indexOrThrow(state,to_id);
  const order = snapshot_seat_order(state,{living_ids}).order;
  const a=order.indexOf(from_id),b=order.indexOf(to_id);
  if(a<0||b<0)return null;
  const delta=Math.abs(a-b);
  return Math.min(delta,order.length-delta);
}
/** Requires a stable event ID. Duplicate receipts return the original result,
 * even after another swap; they never swap back. Everything is JSON-safe.
 */
export function swap_seats(state, actor_id, target_id, {event_id} = {}) {
  const a=indexOrThrow(state,actor_id),b=indexOrThrow(state,target_id);
  const key=JSON.stringify(stable_actor_id(event_id));
  const previous=Object.hasOwn(state.swap_receipts,key)?state.swap_receipts[key]:null;
  if(previous){
    if(previous.actor_id!==actor_id||previous.target_id!==target_id)throw Error('A seat event ID cannot be reused for different actors');
    return previous;
  }
  if(a!==b&&state.revision===Number.MAX_SAFE_INTEGER)throw Error('Seat revision exhausted; migrate the event log explicitly');
  const before=[...state.order];
  if(a!==b){[state.order[a],state.order[b]]=[state.order[b],state.order[a]];state.revision++;}
  const receipt={event_id,actor_id,target_id,changed:a!==b,revision:state.revision,before,after:[...state.order]};
  state.swap_receipts[key]=receipt;
  return receipt;
}
export function seat_order_players(game, {from_id=null,include_origin=true,living_only=false,dependencies={}} = {}) {
  const state=ensure_seat_order(game,dependencies),players=game.all_players?.()??game.players;
  const byId=new Map(players.map(p=>[seat_player_id(game,p,dependencies),p]));
  const living_ids=living_only?players.filter(p=>p.alive&&!p.dead).map(p=>seat_player_id(game,p,dependencies)):null;
  return snapshot_seat_order(state,{from_id,include_origin,living_ids}).order.map(id=>byId.get(id));
}
