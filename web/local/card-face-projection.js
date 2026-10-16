/** Functional faces on an existing physical Card.
 *
 * Card construction calls prepare_card_face BEFORE Object.freeze. A private
 * cache then changes only code-selected functional getters; the Card object,
 * printed identity, physical metadata, and zone references never change.
 *
 * This module validates plain data, not catalog authority. The host must resolve
 * trusted, code-owned definitions before calling set_card_face; a save, command,
 * or history descriptor is never itself an authority to create card rules.
 */
const states = new WeakMap();
const fail = message => { throw new TypeError(`Card face: ${message}`); };
const own = (value,key) => {
  const descriptor = Object.getOwnPropertyDescriptor(value,key);
  if (descriptor && !Object.hasOwn(descriptor,'value')) fail(`${key} cannot be an accessor`);
  return descriptor?.value;
};
const dataObject = (value,label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)
      || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) fail(`${label} must be a plain data object`);
  return value;
};
const cardObject = card => {
  if (!card || typeof card !== 'object' || Array.isArray(card)) fail('a Card object is required');
  return card;
};

// An explicit whitelist: never add physical identity/metadata, materials,
// virtual flags, gift marks, acquisition origins, or derived lifecycles here.
const functionFields = Object.freeze([
  'name','type','power','description','range','trait',
  'id','equipment_id','canonical_id','catalog_id','template_id','rule_id','category','delayed_key',
  'effect_id','mechanism_id','mechanism_key','mechanism_signature','mechanism_signature_key',
  'rule_type','nature','slot','target_mode','ui_name','base_name','aliases','alias_ids',
  'source_original_name','source_type','source_game','source_games','source_variant',
  'source_version','source_product','source_status','source_urls','source_ids','source_evidence',
  'source_records','source_aliases','source_catalog_id','source_snapshot','source_rules',
  'source_mechanism_signature','source_mechanism_signature_sha256','source_rule_id',
  'source_record_id','source_record_ids','source_game_lineage','source_skill','source_skill_id',
  'implementation_status','adaptation_notes','version_notes','uncertainty_ids','completeness',
  'merge_reason','condition','effect','timing','limits','response','rule_timing','rule_limits',
  'follow_sha_no_distance','content_pack',
]);
const functional = new Set(functionFields);
const defaults = Object.freeze({power:0,description:'',range:1,trait:''});
const text = (value,label) => typeof value === 'string' && value.trim()
  ? value : fail(`${label} must be a nonempty string`);
const stableId = value => typeof value === 'string' && value.trim()
  || typeof value === 'number' && Number.isSafeInteger(value) && !Object.is(value,-0)
  ? value : fail('virtual_id needs a stable string or safe integer ID');

/** Copy JSON data without executing getters, setters, functions, or toJSON.
 * Shared subobjects are legal; cycles, sparse arrays, symbols, class instances,
 * undefined values, and non-enumerable data are rejected.
 */
function immutableData(value,label,ancestors=new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value,-0)) fail(`${label} must contain JSON-safe numbers`);
    return value;
  }
  if (!value || typeof value !== 'object') fail(`${label} must contain only plain JSON data`);
  if (ancestors.has(value)) fail(`${label} cannot contain cyclic data`);
  ancestors.add(value);
  let result;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value)!==Array.prototype) fail(`${label} must be a plain array`);
    if (Reflect.ownKeys(value).length !== value.length+1) fail(`${label} cannot contain holes or extra array properties`);
    result=[];
    for (let index=0; index<value.length; index++) {
      const descriptor=Object.getOwnPropertyDescriptor(value,String(index));
      if (!descriptor || !descriptor.enumerable || !Object.hasOwn(descriptor,'value')) fail(`${label} cannot contain holes or accessors`);
      result.push(immutableData(descriptor.value,`${label}[${index}]`,ancestors));
    }
  } else {
    dataObject(value,label);
    const entries=[];
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key!=='string') fail(`${label} cannot contain symbol keys`);
      const descriptor=Object.getOwnPropertyDescriptor(value,key);
      if (!descriptor.enumerable || !Object.hasOwn(descriptor,'value')) fail(`${label}.${key} must be enumerable data`);
      entries.push([key,immutableData(descriptor.value,`${label}.${key}`,ancestors)]);
    }
    result=Object.fromEntries(entries);
  }
  ancestors.delete(value);
  return Object.freeze(result);
}

function initialFields(card) {
  const entries=[];
  for (const key of Reflect.ownKeys(card)) {
    if (typeof key!=='string') fail('printed fields cannot contain symbol keys');
    const descriptor=Object.getOwnPropertyDescriptor(card,key);
    if (!descriptor.enumerable || !Object.hasOwn(descriptor,'value')) fail(`printed ${key} must be enumerable data`);
    // Spreading a prepared Card includes optional functional getters whose value
    // is undefined. They are absent from the printed/JSON baseline, just as they
    // were before the getter was installed.
    if (descriptor.value===undefined) continue;
    entries.push([key,immutableData(descriptor.value,`printed ${key}`)]);
  }
  return Object.freeze(Object.fromEntries(entries));
}

/** Install once during construction, never by replacing a frozen physical Card.
 * Existing legacy virtual views retain their live material references unchanged.
 */
export function prepare_card_face(card) {
  cardObject(card);
  if (states.has(card)) return card;
  if (own(card,'virtual')===true) return card;
  if (!Object.isExtensible(card)) fail('prepare_card_face must run before the Card is frozen');
  const printed=initialFields(card);
  for (const key of functionFields) {
    const descriptor=Object.getOwnPropertyDescriptor(card,key);
    if (descriptor && !descriptor.configurable) fail(`printed ${key} must be configurable before preparation`);
  }
  const state={printed,permanent:null,face:null};
  const descriptors=Object.fromEntries(functionFields.map(key=>[key,{
    enumerable:true,configurable:false,
    get:()=>state.face!==null ? state.face.effective_function[key] : state.permanent!==null ? state.permanent.effective_function[key] : state.printed[key],
  }]));
  Object.defineProperties(card,descriptors);
  states.set(card,state);
  return card;
}

/** Immutable original own fields, independent of the current functional face.
 * Unprepared legacy virtual views receive a shallow, frozen data projection;
 * their material array/references must not be cloned into new physical cards.
 */
export function printed_card_fields(card) {
  cardObject(card);
  const state=states.get(card);
  if (state) return state.printed;
  if (own(card,'virtual')!==true) fail('physical Card was not prepared');
  const entries=[];
  for (const key of Reflect.ownKeys(card)) {
    if (typeof key!=='string') fail('virtual fields cannot contain symbol keys');
    const descriptor=Object.getOwnPropertyDescriptor(card,key);
    if (!descriptor.enumerable || !Object.hasOwn(descriptor,'value')) fail(`virtual ${key} must be enumerable data`);
    entries.push([key,descriptor.value]);
  }
  return Object.freeze(Object.fromEntries(entries));
}

/** Replace the whole effective definition atomically. Missing fields do not
 * inherit a prior copied face or the printed card's equipment/trick rules.
 * Nonfunctional plain fields are validated but never copied from the template.
 */
export function set_card_face(card,definition,options) {
  cardObject(card);
  const state=states.get(card);
  if (!state) fail('set_card_face requires a prepared physical Card');
  dataObject(definition,'effective definition');
  const input=immutableData(definition,'effective definition');
  dataObject(options,'face options');
  const metadata=immutableData(options,'face options');
  if (Object.keys(metadata).some(key=>!['virtual_id','source_skill'].includes(key))) fail('unknown face option');
  const virtual_id=stableId(metadata.virtual_id);
  const source_skill=metadata.source_skill===undefined || metadata.source_skill===null
    ? null : text(metadata.source_skill,'source_skill');
  text(input.name,'name');text(input.type,'type');
  for (const key of ['power','range']) {
    if (Object.hasOwn(input,key) && input[key]!==null && typeof input[key]!=='number') fail(`${key} must be numeric or null`);
  }
  for (const key of ['description','trait']) {
    if (Object.hasOwn(input,key) && input[key]!==null && typeof input[key]!=='string') fail(`${key} must be text or null`);
  }
  const effective=Object.fromEntries(Object.entries(input).filter(([key])=>functional.has(key)));
  for (const [key,value] of Object.entries(defaults)) if (!Object.hasOwn(effective,key)) effective[key]=value;
  if (source_skill!==null) effective.source_skill=source_skill;
  const effective_function=Object.freeze(effective);
  state.face=Object.freeze({virtual_id,source_skill,printed:state.printed,effective_function});
  return card;
}

/** Clear only the cache. The same physical object immediately reads as printed. */
export function clear_card_face(card) {
  cardObject(card);
  const state=states.get(card);
  if (state) state.face=null;
  return card;
}

/** JSON-safe immutable marker, physical baseline, and current functional data.
 * This is a snapshot for presentation/replay checks, never restore authority.
 */
export function card_face_record(card) {
  cardObject(card);
  return states.get(card)?.face??null;
}

/** Detached, immutable, plain current face (not a replacement physical Card). */
export function snapshot_card_face(card) {
  cardObject(card);
  const state=states.get(card);
  if (!state || state.face===null&&state.permanent===null) return printed_card_fields(card);
  const selected=state.face??state.permanent;
  return Object.freeze(Object.fromEntries([
    ...Object.entries(state.printed).filter(([key])=>!functional.has(key)),
    ...Object.entries(selected.effective_function),
  ]));
}

/** Trusted permanent derived identity, separate from a temporary copied face.
 * Immutable original print and physical metadata remain untouched. */
export function set_permanent_card_face(card,definition,{identity_id,source_skill=null}={}){
  const state=states.get(card);if(!state)fail('permanent identity requires a prepared physical Card');
  const prior=state.face;set_card_face(card,definition,{virtual_id:identity_id,source_skill});
  state.permanent=state.face;state.face=prior;return card;
}
export function permanent_card_face_record(card){return states.get(card)?.permanent??null;}
export function permanent_card_fields(card){
  const state=states.get(card);if(!state?.permanent)return printed_card_fields(card);
  return Object.freeze({...Object.fromEntries(Object.entries(state.printed).filter(([key])=>!functional.has(key))),...state.permanent.effective_function});
}
