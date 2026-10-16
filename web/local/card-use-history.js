/** Independent, immutable card-use journal. No Game hooks or playable skills.
 * The host must report actual commit events, never infer use from card movement.
 * See docs/yxs-final-classic/card-use-history.md for the unadopted source policies.
 */
export const CARD_USE_HISTORY_VERSION = 1;
export const CARD_FUNCTION_CATEGORIES = Object.freeze(['basic','trick','equipment','delayed_trick']);
export const CARD_USE_SELECTIONS = Object.freeze(['latest_any','outermost']);
const eventKinds = ['card_use','respond','give','recast','judgment','discard','compare','reveal','skill_effect','move'];
const stages = ['declared','validated','committed','rejected','aborted','finished'];
const validHistories = new WeakSet();
const fail = message => { throw new TypeError(`Card-use history: ${message}`); };
const object = (value,label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be a data object`);
  return value;
};
// Only own data properties are read: never execute a callback/getter while
// snapshotting. Extra fields (hands, targets, modifiers, closures) are ignored.
const own = (value,key) => {
  object(value,'input');
  const property = Object.getOwnPropertyDescriptor(value,key);
  if (property && !Object.hasOwn(property,'value')) fail(`${key} cannot be an accessor`);
  return property?.value;
};
const text = (value,label) => typeof value === 'string' && value.trim() ? value : fail(`${label} must be a nonempty string`);
const nullableText = (value,label) => value === null ? null : text(value,label);
const id = (value,label) => {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isSafeInteger(value) && !Object.is(value,-0)) return value;
  return fail(`${label} needs a stable string or safe integer ID`);
};
const nullableId = (value,label) => value === null ? null : id(value,label);
const key = value => JSON.stringify(value);
const enumValue = (value,values,label) => values.includes(value) ? value : fail(`invalid ${label}`);
const number = (value,label) => typeof value === 'number' && Number.isFinite(value) ? value : fail(`${label} must be finite`);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const list = (value,label) => {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
  const result = [];
  for (let index=0; index<value.length; index++) {
    const property = Object.getOwnPropertyDescriptor(value,String(index));
    if (!property || !Object.hasOwn(property,'value')) fail(`${label} cannot contain holes or accessors`);
    result.push(property.value);
  }
  return result;
};
const optional = (input,key,check,output) => {
  const value = own(input,key);
  if (value !== undefined) output[key] = check(value,key);
};
const strings = (value,label) => list(value,label).map(v=>text(v,label));
const positiveSequence = value => Number.isSafeInteger(value) && value > 0 ? value : fail('commit_seq must be a positive safe integer');

/** This is a field whitelist, NOT a whitelist of eligible card functions.
 * rule_id/category are deliberately supplied by the host rather than guessed
 * from a display name, a physical identity, or an old damage-only card table.
 */
export function snapshot_card_function(card,identity) {
  object(card,'card'); object(identity,'function identity');
  const result = {
    rule_id:text(own(identity,'rule_id'),'rule_id'),
    category:enumValue(own(identity,'category'),CARD_FUNCTION_CATEGORIES,'function category'),
    name:text(own(card,'name'),'name'), type:text(own(card,'type'),'type'),
  };
  for (const field of ['effect_id','equipment_id','mechanism_id','rule_type','nature','slot','target_mode']) optional(card,field,nullableText,result);
  optional(card,'trait',(value)=>value === null || typeof value === 'string' ? value : fail('trait must be a string or null'),result);
  for (const field of ['power','range']) optional(card,field,number,result);
  return freeze(result);
}

/** Suit/color/rank describe a particular use or material, never the copied
 * function. Unknown/colorless values must be explicit null; no black/A default.
 */
export function snapshot_card_use_metadata(card) {
  const rank = own(card,'rank');
  if (rank !== null && !(Number.isInteger(rank) && rank >= 1 && rank <= 13)) fail('rank must be null or an integer from 1 to 13');
  return freeze({suit:nullableText(own(card,'suit'),'suit'),color:nullableText(own(card,'color'),'color'),rank});
}

/** Stable physical IDs are assigned externally. card.id/equipment_id identify
 * rules in this engine and are NEVER substituted for a physical-card ID.
 * Opaque materials retain only host-supplied IDs/zone, not hidden card faces.
 */
export function snapshot_card_use_material(card,identity) {
  if (own(card,'virtual') === true) fail('a virtual projection is not a physical material');
  const visibility = enumValue(own(identity,'visibility'),['public','opaque'],'material visibility');
  const result = {
    physical_id:id(own(identity,'physical_id'),'physical_id'),
    owner_id:id(own(identity,'owner_id'),'material owner_id'),
    zone:text(own(identity,'zone'),'material zone'), visibility, printed:null, effective:null,
  };
  if (visibility === 'public') {
    result.printed = {name:text(own(card,'name'),'printed name'),type:text(own(card,'type'),'printed type'),
      ...snapshot_card_use_metadata(card)};
    optional(identity,'printed_rule_id',nullableText,result.printed);
    result.effective = snapshot_card_use_metadata(own(identity,'effective_metadata'));
  }
  return freeze(result);
}

function materialSnapshot(input) {
  const visibility = enumValue(own(input,'visibility'),['public','opaque'],'material visibility');
  const result = {physical_id:id(own(input,'physical_id'),'physical_id'),owner_id:id(own(input,'owner_id'),'material owner_id'),
    zone:text(own(input,'zone'),'material zone'),visibility,printed:null,effective:null};
  if (visibility === 'public') {
    const printed = own(input,'printed');
    result.printed = {name:text(own(printed,'name'),'printed name'),type:text(own(printed,'type'),'printed type'),...snapshot_card_use_metadata(printed)};
    optional(printed,'printed_rule_id',nullableText,result.printed);
    result.effective = snapshot_card_use_metadata(own(input,'effective'));
  } else if (own(input,'printed') !== null || own(input,'effective') !== null) fail('opaque material must not include hidden metadata');
  return result;
}

function provenanceSnapshot(input) {
  const result = {kind:enumValue(own(input,'kind'),['physical','converted','virtual'],'provenance kind')};
  for (const field of ['source_skill_id','source_skill','source_game','source_version','source_rule_id','source_record_id']) optional(input,field,nullableText,result);
  optional(input,'copied_from_use_id',nullableId,result);
  for (const field of ['source_record_ids','source_urls']) optional(input,field,strings,result);
  const lineage = own(input,'source_game_lineage');
  if (lineage !== undefined) {
    result.source_game_lineage = {};
    for (const field of ['source_game','source_version','source_rule_id','source_skill']) optional(lineage,field,nullableText,result.source_game_lineage);
  }
  return result;
}

/** Explicit host taxonomy. A genuine use during another use may still be a
 * card_use; a response-only 打出 is respond even when the card face is 杀.
 * Unknown event types/stages fail closed instead of silently choosing a rule.
 */
export function classify_card_use_event(event) {
  const kind = enumValue(own(event,'kind'),eventKinds,'event kind');
  const stage = enumValue(own(event,'stage'),stages,'event stage');
  return freeze({eligible:kind === 'card_use' && stage === 'committed',kind,stage,
    reason:kind !== 'card_use' ? 'not_card_use' : stage !== 'committed' ? 'not_commit_event' : null});
}

function useSnapshot(event) {
  const effective = own(event,'effective_function');
  const result = {
    event_id:id(own(event,'event_id'),'event_id'),use_id:id(own(event,'use_id'),'use_id'),
    // Null is explicit: omission must not silently turn an unknown parent into
    // an outermost use and thereby decide the future skill's history policy.
    parent_use_id:nullableId(own(event,'parent_use_id'),'parent_use_id'),
    turn_id:id(own(event,'turn_id'),'turn_id'),turn_owner_id:id(own(event,'turn_owner_id'),'turn_owner_id'),
    actor_id:id(own(event,'actor_id'),'actor_id'),commit_seq:positiveSequence(own(event,'commit_seq')),
    effective_function:snapshot_card_function(effective,effective),
    effective_metadata:snapshot_card_use_metadata(own(event,'effective_metadata')),
    materials:list(own(event,'materials'),'materials').map(materialSnapshot),
    provenance:provenanceSnapshot(own(event,'provenance')),
  };
  const materialIds = result.materials.map(m=>key(m.physical_id));
  if (new Set(materialIds).size !== materialIds.length) fail('one use cannot list the same physical material twice');
  if (result.provenance.kind === 'physical' && result.materials.length !== 1) fail('physical use requires exactly one material');
  if (result.provenance.kind === 'converted' && !result.materials.length) fail('converted use requires material; use virtual for no-material use');
  if (result.provenance.kind === 'virtual' && result.materials.length) fail('virtual provenance means no physical materials; use converted instead');
  return freeze(result);
}

const history = (turns,uses,current_turn_id) => {
  const value = freeze({version:CARD_USE_HISTORY_VERSION,current_turn_id,turns,uses});
  validHistories.add(value);
  return value;
};
const checked = value => validHistories.has(value) ? value : fail('use create_card_use_history or restore_card_use_history before accessing state');
const turnFor = (state,turnId) => state.turns.find(t=>t.turn_id === turnId);
const same = (left,right) => JSON.stringify(left) === JSON.stringify(right);

export function create_card_use_history() { return history([],[],null); }

/** A new full turn expires the prior turn; an extra play phase is NOT a turn.
 * Replayed turn beginnings do not reactivate historical turns.
 */
export function begin_card_use_turn(state,input) {
  checked(state);
  const turn_id = id(own(input,'turn_id'),'turn_id'),turn_owner_id = id(own(input,'turn_owner_id'),'turn_owner_id');
  const prior = turnFor(state,turn_id);
  if (prior) {
    if (prior.turn_owner_id !== turn_owner_id) fail('turn ID reused with a different owner');
    return state;
  }
  const turns = state.turns.map(t=>t.status === 'active' ? {...t,status:'ended'} : t);
  turns.push({turn_id,turn_owner_id,status:'active'});
  return history(turns,state.uses,turn_id);
}

export function end_card_use_turn(state,input) {
  checked(state);
  const turn_id = id(own(input,'turn_id'),'turn_id');
  const status = enumValue(own(input,'status'),['ended','aborted'],'turn end status');
  const prior = turnFor(state,turn_id);
  if (!prior) fail('cannot end an unknown turn');
  if (prior.status !== 'active') {
    if (prior.status !== status) fail('turn end replay changed its status');
    return state;
  }
  return history(state.turns.map(t=>t === prior ? {...t,status} : t),state.uses,null);
}

function validateRelations(state,record) {
  const turn = turnFor(state,record.turn_id);
  if (!turn || turn.turn_owner_id !== record.turn_owner_id) fail('use has an unknown turn or mismatched turn owner');
  if (record.parent_use_id !== null) {
    const parent = state.uses.find(u=>u.use_id === record.parent_use_id);
    if (!parent || parent.turn_id !== record.turn_id || parent.commit_seq >= record.commit_seq) fail('parent must be an earlier committed use in the same full turn');
  }
  if (state.uses.some(u=>u.commit_seq === record.commit_seq)) fail('commit_seq reused for another use');
  const turnIndex = state.turns.indexOf(turn);
  if (state.uses.some(u=>{
    const index = state.turns.findIndex(t=>t.turn_id === u.turn_id);
    return index < turnIndex && u.commit_seq >= record.commit_seq || index > turnIndex && u.commit_seq <= record.commit_seq;
  })) fail('commit order cannot cross full-turn boundaries');
}

/** The only journal append path. No materials move and no callbacks run.
 * An exact commit replay is harmless, even after its turn has expired.
 */
export function record_card_use_event(state,event) {
  checked(state);
  const classification = classify_card_use_event(event);
  const priorEvent = state.uses.find(u=>u.event_id === own(event,'event_id'));
  if (priorEvent && !classification.eligible) fail('committed event ID reused with a different classification');
  if (!classification.eligible) return freeze({history:state,record:null,recorded:false,duplicate:false,reason:classification.reason});
  const record = useSnapshot(event);
  const previous = state.uses.find(u=>u.use_id === record.use_id || u.event_id === record.event_id);
  if (previous) {
    if (!same(previous,record)) fail('event/use ID reused with changed identity or semantic payload');
    return freeze({history:state,record:previous,recorded:false,duplicate:true,reason:null});
  }
  validateRelations(state,record);
  if (state.current_turn_id !== record.turn_id || turnFor(state,record.turn_id)?.status !== 'active') fail('new use cannot be committed to an expired turn');
  // Host commit order, not callback/finish/delivery order, determines latest.
  const uses = [...state.uses,record].sort((a,b)=>a.commit_seq-b.commit_seq);
  return freeze({history:history(state.turns,uses,state.current_turn_id),record,recorded:true,duplicate:false,reason:null});
}

/** Explicit policy required. Outermost means parent_use_id === null globally,
 * not merely the first use performed by this actor within another actor's use.
 * Callers wanting only the active turn owner's own history set require_own_turn.
 */
export function latest_card_use(state,query) {
  checked(state);
  const actor_id = id(own(query,'actor_id'),'actor_id'),turn_id = id(own(query,'turn_id'),'turn_id');
  const selection = enumValue(own(query,'selection'),CARD_USE_SELECTIONS,'selection policy');
  const requireOwn = own(query,'require_own_turn');
  if (requireOwn !== undefined && typeof requireOwn !== 'boolean') fail('require_own_turn must be boolean');
  const turn = turnFor(state,turn_id);
  if (state.current_turn_id !== turn_id || turn?.status !== 'active' || requireOwn && turn.turn_owner_id !== actor_id) return null;
  for (let index = state.uses.length-1; index >= 0; index--) {
    const use = state.uses[index];
    if (use.turn_id === turn_id && use.actor_id === actor_id && (selection === 'latest_any' || use.parent_use_id === null)) return use;
  }
  return null;
}

/** Restore the detached JSON data, validate identities/parentage, then freeze.
 * There is no serialized class, callback, pending prompt or private hand.
 */
export function restore_card_use_history(snapshot) {
  if (own(snapshot,'version') !== CARD_USE_HISTORY_VERSION) fail('unsupported history version');
  const current = nullableId(own(snapshot,'current_turn_id'),'current_turn_id');
  const turns = list(own(snapshot,'turns'),'turns').map(t=>({turn_id:id(own(t,'turn_id'),'turn_id'),
    turn_owner_id:id(own(t,'turn_owner_id'),'turn_owner_id'),status:enumValue(own(t,'status'),['active','ended','aborted'],'turn status')}));
  if (new Set(turns.map(t=>key(t.turn_id))).size !== turns.length) fail('duplicate turn ID');
  const active = turns.filter(t=>t.status === 'active');
  if (current === null ? active.length : active.length !== 1 || active[0].turn_id !== current) fail('active turn disagrees with current_turn_id');
  if (active.length && turns.at(-1) !== active[0]) fail('only the latest full turn can be active');
  const uses = list(own(snapshot,'uses'),'uses').map(useSnapshot).sort((a,b)=>a.commit_seq-b.commit_seq);
  const checkedUses = [];
  for (const use of uses) {
    if (checkedUses.some(u=>u.event_id === use.event_id || u.use_id === use.use_id)) fail('duplicate event/use ID');
    validateRelations({turns,uses:checkedUses},use);
    checkedUses.push(use);
  }
  return history(turns,checkedUses,current);
}
