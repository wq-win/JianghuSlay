/** Unwired, immutable physical-card / copied-function registry.
 * CC5 lifetime is a proposed Jianghu compatibility rule, not an official ruling.
 * No Card objects, effects, legality checks, callbacks, or Game mutations live here.
 */
export const VIRTUAL_CARD_IDENTITY_VERSION = 1;
export const VIRTUAL_CARD_ZONES = Object.freeze(['hand','equipment','judgment','field','processing','draw_pile','discard_pile','offboard','exile']);
const categories = ['basic','trick','equipment','delayed_trick'];
const slots = ['weapon','armor','offensive_horse','defensive_horse'];
const equipmentTypes = {'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
const catalogs = new WeakSet(), registries = new WeakSet();
const fail = message => { throw new TypeError(`Virtual-card identity: ${message}`); };
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
};
const object = (value,label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) fail(`${label} must be a plain data object`);
  return value;
};
const own = (value,key) => {
  object(value,'input');
  const property = Object.getOwnPropertyDescriptor(value,key);
  if (property && !Object.hasOwn(property,'value')) fail(`${key} cannot be an accessor`);
  return property?.value;
};
const shape = (value,allowed,label) => {
  object(value,label);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string' || !allowed.includes(key)) fail(`unknown ${label} field ${String(key)}`);
    const p=Object.getOwnPropertyDescriptor(value,key);
    if (!Object.hasOwn(p,'value') || !p.enumerable) fail(`${label}.${key} must be enumerable data`);
  }
  return value;
};
const list = (value,label) => {
  if (!Array.isArray(value)) fail(`${label} must be an array`);
  if (Reflect.ownKeys(value).length !== value.length+1) fail(`${label} cannot have holes or extra properties`);
  return Array.from({length:value.length},(_,i)=>{
    const p=Object.getOwnPropertyDescriptor(value,String(i));
    if (!p || !Object.hasOwn(p,'value') || !p.enumerable) fail(`${label} cannot have holes or accessors`);
    return p.value;
  });
};
const text = (v,label) => typeof v === 'string' && v.trim() ? v : fail(`${label} must be a nonempty string`);
const id = (v,label) => typeof v === 'string' && v.trim() || typeof v === 'number' && Number.isSafeInteger(v) && !Object.is(v,-0) ? v : fail(`${label} needs a stable string or safe integer ID`);
const nullableId = (v,label) => v === null ? null : id(v,label);
const enumValue = (v,values,label) => values.includes(v) ? v : fail(`invalid ${label}`);
const integer = (v,label) => Number.isSafeInteger(v) && v >= 0 && !Object.is(v,-0) ? v : fail(`${label} must be a nonnegative safe integer`);
const equalId = (a,b) => a === b;
const unique = (values,label) => { if (new Set(values.map(v=>JSON.stringify(v))).size !== values.length) fail(`duplicate ${label}`); };
// Canonical JSON also validates raw saved data, without invoking toJSON/getters.
const canonical = (value,ancestors=new Set()) => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number') return Number.isFinite(value) && !Object.is(value,-0) ? JSON.stringify(value) : fail('non-JSON number');
  if (!value || typeof value !== 'object') fail('non-JSON value');
  if (ancestors.has(value)) fail('cyclic data');
  ancestors.add(value);
  let out;
  if (Array.isArray(value)) out=`[${list(value,'saved array').map(v=>canonical(v,ancestors)).join(',')}]`;
  else {
    object(value,'saved value');
    const keys=Reflect.ownKeys(value);
    if (keys.some(k=>typeof k !== 'string')) fail('non-JSON key');
    out=`{${keys.sort().map(k=>{
      const p=Object.getOwnPropertyDescriptor(value,k);
      if (!Object.hasOwn(p,'value') || !p.enumerable) fail('saved value must contain only enumerable data');
      return `${JSON.stringify(k)}:${canonical(p.value,ancestors)}`;
    }).join(',')}}`;
  }
  ancestors.delete(value);return out;
};
const same = (a,b) => canonical(a) === canonical(b);
const functionFields = ['rule_id','category','name','type','effect_id','equipment_id','mechanism_id','rule_type','nature','trait','slot','target_mode','power','range'];
function template(input) {
  shape(input,['template_id','delayed_key',...functionFields],'template');
  const result={template_id:text(own(input,'template_id'),'template_id'),rule_id:text(own(input,'rule_id'),'rule_id'),
    category:enumValue(own(input,'category'),categories,'category'),name:text(own(input,'name'),'name'),type:text(own(input,'type'),'type')};
  for (const k of ['effect_id','equipment_id','mechanism_id','rule_type','nature','trait','slot','target_mode']) {
    const v=own(input,k);
    if (v !== undefined) result[k]=v === null ? null : k === 'trait' && typeof v === 'string' ? v : text(v,k);
  }
  for (const k of ['power','range']) {
    const v=own(input,k);
    if (v !== undefined) result[k]=v === null || typeof v === 'number' && Number.isFinite(v) && !Object.is(v,-0) ? v : fail(`${k} must be finite or null`);
  }
  if (result.category === 'equipment') {
    enumValue(result.slot,slots,'equipment slot');
    if (!Object.hasOwn(equipmentTypes,result.type) || equipmentTypes[result.type] !== result.slot) fail('equipment type and slot disagree');
    text(result.equipment_id,'equipment_id');
    if (result.power === undefined || result.range === undefined || result.trait === undefined) fail('equipment template needs explicit power, range and trait');
    if (result.slot === 'weapon' && !(typeof result.range === 'number' && result.range >= 0)) fail('weapon range must be nonnegative');
  } else if (own(input,'slot') !== undefined || own(input,'equipment_id') !== undefined || Object.hasOwn(equipmentTypes,result.type)) fail('equipment fields require an equipment category');
  if (['trick','delayed_trick'].includes(result.category) && result.type !== '锦囊') fail('trick category needs the trick card type');
  if (result.category === 'basic' && result.type === '锦囊') fail('basic cannot use the trick card type');
  if (result.category === 'delayed_trick') result.delayed_key=text(own(input,'delayed_key'),'delayed_key');
  else if (own(input,'delayed_key') !== undefined) fail('delayed_key belongs to delayed tricks');
  return result;
}

/** Privileged bootstrap: pass code-owned, explicitly projected catalog data.
 * Never construct this authority from a command, history descriptor, or save.
 */
export function create_virtual_card_catalog(input) {
  shape(input,['catalog_id','revision','templates'],'catalog');
  const value={catalog_id:text(own(input,'catalog_id'),'catalog_id'),revision:text(own(input,'revision'),'catalog revision'),
    templates:list(own(input,'templates'),'templates').map(template).sort((a,b)=>a.template_id < b.template_id ? -1 : a.template_id > b.template_id ? 1 : 0)};
  if (!value.templates.length) fail('catalog cannot be empty');
  unique(value.templates.map(t=>t.template_id),'template ID');unique(value.templates.map(t=>t.rule_id),'rule ID');
  freeze(value);catalogs.add(value);return value;
}
const checkedCatalog = c => catalogs.has(c) ? c : fail('use create_virtual_card_catalog with trusted definitions');
const catalogIdentity = c => ({catalog_id:c.catalog_id,revision:c.revision,fingerprint:canonical(c.templates)});
const lookup = (c,templateId) => c.templates.find(t=>t.template_id === templateId) ?? fail(`unknown trusted template ${String(templateId)}`);
const functionOf = t => Object.fromEntries(functionFields.filter(k=>Object.hasOwn(t,k)).map(k=>[k,t[k]]));
const location = input => {
  shape(input,['zone','owner_id','slot'],'location');
  const result={zone:enumValue(own(input,'zone'),VIRTUAL_CARD_ZONES,'zone'),owner_id:nullableId(own(input,'owner_id'),'location owner_id'),slot:own(input,'slot')};
  if (['hand','equipment','judgment'].includes(result.zone)) {
    if (result.owner_id === null) fail('player zone needs an owner');
  } else if (result.owner_id !== null) fail('shared zone must use null owner');
  if (result.zone === 'equipment') result.slot=enumValue(result.slot,slots,'location slot');
  else if (result.slot !== null) fail('non-equipment zone needs null slot');
  return result;
};
const sharedLocation = zone => ({zone,owner_id:null,slot:null});
function metadata(input) {
  shape(input,['suit','color','rank'],'metadata');
  const suit=enumValue(own(input,'suit'),['红桃','方块','黑桃','梅花',null],'printed suit');
  const color=enumValue(own(input,'color'),['红','黑',null],'printed color');
  const rank=own(input,'rank');
  if (rank !== null && !(Number.isInteger(rank) && rank >= 1 && rank <= 13)) fail('printed rank must be null or 1–13');
  if (suit !== null && color !== (['红桃','方块'].includes(suit) ? '红' : '黑')) fail('printed suit/color disagree');
  return {suit,color,rank};
}
function seedMaterial(input,catalog) {
  shape(input,['physical_id','printed_template_id','metadata','location'],'initial material');
  const result={physical_id:id(own(input,'physical_id'),'physical_id'),printed_template_id:text(own(input,'printed_template_id'),'printed_template_id'),
    metadata:metadata(own(input,'metadata')),location:location(own(input,'location'))};
  lookup(catalog,result.printed_template_id);return result;
}
const materialFor = (state,physicalId) => state.materials.find(m=>equalId(m.physical_id,physicalId)) ?? fail('unknown physical material');
const identityFor = (state,virtualId) => state.identities.find(v=>equalId(v.virtual_id,virtualId)) ?? fail('unknown virtual identity');
const effectiveTemplate = (state,catalog,m) => lookup(catalog,m.virtual_id === null ? m.printed_template_id : identityFor(state,m.virtual_id).template_id);
function validatePlacement(state,catalog) {
  unique(state.materials.map(m=>m.physical_id),'physical material');
  const occupied=[],delayed=[];
  for (const m of state.materials) {
    const t=effectiveTemplate(state,catalog,m),loc=m.location;
    if (loc.zone === 'equipment') {
      if (t.category !== 'equipment' || t.slot !== loc.slot) fail('card function does not fit equipment destination');
      occupied.push([loc.owner_id,loc.slot]);
    }
    if (loc.zone === 'judgment') {
      if (t.category !== 'delayed_trick') fail('judgment zone needs a delayed function');
      delayed.push([loc.owner_id,t.delayed_key]);
    }
  }
  unique(occupied,'occupied equipment slot');unique(delayed,'delayed function at one owner');
  const bound=state.materials.filter(m=>m.virtual_id !== null);
  unique(bound.map(m=>m.virtual_id),'bound virtual identity');
  for (const v of state.identities) {
    const m=bound.find(m=>equalId(m.virtual_id,v.virtual_id));
    if (v.status !== 'active') {if (m) fail('inactive virtual identity still owns a material');continue;}
    if (!m || !equalId(v.material_ids[0],m.physical_id)) fail('active identity is missing its one physical material');
    if (!(v.phase === 'use' && m.location.zone === 'processing' ||
      v.phase === 'equipment' && m.location.zone === 'equipment' ||
      v.phase === 'judgment' && ['judgment','processing'].includes(m.location.zone))) fail('virtual phase does not fit its physical zone');
  }
}
const seal = state => { freeze(state);registries.add(state);return state; };
const checked = (state,catalog) => {
  checkedCatalog(catalog);
  if (!registries.has(state)) fail('use create_virtual_card_registry or restore_virtual_card_registry');
  if (!same(state.catalog,catalogIdentity(catalog))) fail('trusted catalog identity/version/content mismatch');
  return state;
};

export function create_virtual_card_registry(catalog,initialMaterials) {
  checkedCatalog(catalog);
  const initial_materials=list(initialMaterials,'initial materials').map(m=>seedMaterial(m,catalog));
  const state={version:VIRTUAL_CARD_IDENTITY_VERSION,catalog:catalogIdentity(catalog),initial_materials,
    materials:initial_materials.map(m=>({...m,revision:0,virtual_id:null})),identities:[],commands:[],receipts:[]};
  validatePlacement(state,catalog);return seal(state);
}

function provenance(input) {
  const strings=['source_skill_id','source_game','source_version','source_rule_id','source_record_id'];
  shape(input,['copied_from_use_id','source_material_ids','source_urls',...strings],'provenance');
  const result={copied_from_use_id:nullableId(own(input,'copied_from_use_id'),'copied_from_use_id'),
    source_material_ids:list(own(input,'source_material_ids'),'source material IDs').map(v=>id(v,'source material ID'))};
  unique(result.source_material_ids,'source material ID');
  for (const k of strings) if (own(input,k) !== undefined) result[k]=text(own(input,k),k);
  if (own(input,'source_urls') !== undefined) result.source_urls=list(own(input,'source_urls'),'source_urls').map(v=>text(v,'source URL'));
  return result;
}
const expected = input => {
  shape(input,['physical_id','revision'],'expected material');
  return {physical_id:id(own(input,'physical_id'),'expected physical_id'),revision:integer(own(input,'revision'),'expected revision')};
};
function command(input) {
  const kind=enumValue(own(input,'kind'),['prepare','cancel','commit','move','finish'],'command kind');
  const fields={prepare:['virtual_id','use_id','actor_id','template_id','material_ids','provenance'],cancel:['virtual_id','reason'],
    commit:['virtual_id'],move:['material','destination','intent','replacement'],finish:['virtual_id','reason']}[kind];
  shape(input,['command_id','kind',...fields],'command');
  const result={command_id:id(own(input,'command_id'),'command_id'),kind};
  if (['prepare','cancel','commit','finish'].includes(kind)) result.virtual_id=id(own(input,'virtual_id'),'virtual_id');
  if (kind === 'prepare') {
    result.use_id=id(own(input,'use_id'),'use_id');result.actor_id=id(own(input,'actor_id'),'actor_id');
    result.template_id=text(own(input,'template_id'),'template_id');
    result.material_ids=list(own(input,'material_ids'),'material IDs').map(v=>id(v,'material ID'));
    if (result.material_ids.length !== 1) fail('this copied-function registry requires exactly one real material');
    result.provenance=provenance(own(input,'provenance'));
  }
  if (kind === 'cancel' || kind === 'finish') result.reason=text(own(input,'reason'),'reason');
  if (kind === 'move') {
    result.material=expected(own(input,'material'));result.destination=location(own(input,'destination'));
    result.intent=enumValue(own(input,'intent'),['relocate','begin_judgment','delayed_transfer'],'movement intent');
    result.replacement=own(input,'replacement') === null ? null : expected(own(input,'replacement'));
  }
  return result;
}
function viewAt(state,catalog,m) {
  const identity=m.virtual_id === null ? null : identityFor(state,m.virtual_id);
  return {physical_id:m.physical_id,virtual_id:m.virtual_id,printed_template_id:m.printed_template_id,
    effective_function:functionOf(effectiveTemplate(state,catalog,m)),effective_metadata:{...m.metadata},
    printed_function:functionOf(lookup(catalog,m.printed_template_id)),location:{...m.location},revision:m.revision,
    // These references describe THIS physical cost, never old template materials.
    material_ids:[m.physical_id],provenance:identity === null ? null : identity.provenance};
}
export function virtual_card_view(state,catalog,physicalId) {
  checked(state,catalog);return freeze(viewAt(state,catalog,materialFor(state,id(physicalId,'physical_id'))));
}
export function virtual_card_identity(state,catalog,virtualId) {
  checked(state,catalog);return identityFor(state,id(virtualId,'virtual_id'));
}
const requireRevision = (state,ref) => {
  const m=materialFor(state,ref.physical_id);
  if (m.revision !== ref.revision) fail('stale material revision');
  return m;
};

/** One command = one atomic, immutable transition plus an auditable receipt.
 * The host must publish the resulting registry/zone change before callbacks.
 */
export function apply_virtual_card_command(state,catalog,input) {
  checked(state,catalog);
  const cmd=command(input),previous=state.commands.find(c=>equalId(c.command_id,cmd.command_id));
  if (previous) {
    if (!same(previous,cmd)) fail('command ID reused with a changed payload');
    return freeze({registry:state,receipt:state.receipts.find(r=>equalId(r.command_id,cmd.command_id)),duplicate:true});
  }
  const seq=state.commands.length+1;
  const next={...state,materials:state.materials.map(m=>({...m})),identities:state.identities.map(v=>({...v}))};
  const changed=[];
  const touch=(physicalId,destination,virtualId) => {
    const m=materialFor(next,physicalId);
    if (!changed.some(x=>equalId(x,physicalId))) changed.push(physicalId);
    m.location=destination;m.virtual_id=virtualId;m.revision++;
    if (!Number.isSafeInteger(m.revision)) fail('material revision exhausted');
  };
  const end=(virtualId,reason) => {
    if (virtualId === null) return;
    const v=identityFor(next,virtualId);
    if (v.status !== 'active') fail('only an active identity may be ended');
    v.status='ended';v.phase=null;v.ended_seq=seq;v.end_reason=reason;
  };
  let outcome=cmd.kind;
  if (cmd.kind === 'prepare') {
    lookup(catalog,cmd.template_id);
    if (next.identities.some(v=>equalId(v.virtual_id,cmd.virtual_id) || equalId(v.use_id,cmd.use_id))) fail('virtual or use ID already reserved');
    if (next.materials.some(m=>equalId(m.physical_id,cmd.virtual_id))) fail('virtual ID must be distinct from physical IDs');
    const m=materialFor(next,cmd.material_ids[0]);
    if (!['hand','equipment'].includes(m.location.zone) || !equalId(m.location.owner_id,cmd.actor_id)) fail('copy material must be in this actor’s hand or equipment');
    next.identities.push({virtual_id:cmd.virtual_id,use_id:cmd.use_id,actor_id:cmd.actor_id,template_id:cmd.template_id,
      material_ids:cmd.material_ids,source_materials:[viewAt(state,catalog,materialFor(state,m.physical_id))],
      source_revision:m.revision,provenance:cmd.provenance,status:'prepared',phase:null,
      prepared_seq:seq,committed_seq:null,ended_seq:null,end_reason:null});
  } else if (cmd.kind === 'cancel') {
    const v=identityFor(next,cmd.virtual_id);
    if (v.status !== 'prepared') fail('only a prepared identity can be cancelled');
    v.status='cancelled';v.ended_seq=seq;v.end_reason=cmd.reason;
  } else if (cmd.kind === 'commit') {
    const v=identityFor(next,cmd.virtual_id);
    if (v.status !== 'prepared') fail('only a prepared identity can be committed');
    const m=requireRevision(next,{physical_id:v.material_ids[0],revision:v.source_revision});
    if (!same(m.location,v.source_materials[0].location)) fail('material moved since preparation');
    end(m.virtual_id,'material_reused');
    v.status='active';v.phase='use';v.committed_seq=seq;
    touch(m.physical_id,sharedLocation('processing'),v.virtual_id);
  } else if (cmd.kind === 'finish') {
    const v=identityFor(next,cmd.virtual_id),m=materialFor(next,v.material_ids[0]);
    if (v.status === 'prepared') fail('an uncommitted identity must be cancelled');
    if (v.status !== 'active' || v.phase !== 'use' || m.location.zone !== 'processing' || !equalId(m.virtual_id,v.virtual_id)) outcome='already_left_use_processing';
    else {end(v.virtual_id,cmd.reason);touch(m.physical_id,sharedLocation('discard_pile'),null);outcome='discarded_remaining_material';}
  } else {
    const m=requireRevision(next,cmd.material),to=cmd.destination,from=m.location;
    if (same(from,to)) fail('movement must change location');
    let active=m.virtual_id === null ? null : identityFor(next,m.virtual_id);
    const current=effectiveTemplate(next,catalog,m);
    if (cmd.intent === 'begin_judgment' && !(from.zone === 'judgment' && to.zone === 'processing' && current.category === 'delayed_trick')) fail('begin_judgment needs a delayed card from judgment to processing');
    if (cmd.intent === 'delayed_transfer' && !(to.zone === 'judgment' && current.category === 'delayed_trick' && (from.zone === 'judgment' || from.zone === 'processing' && (active === null || active.phase === 'judgment')))) fail('delayed_transfer needs a current delayed judgment role');
    const keep=active !== null && (
      active.phase === 'use' && from.zone === 'processing' && ['equipment','judgment'].includes(to.zone) ||
      from.zone === 'equipment' && to.zone === 'equipment' ||
      from.zone === 'judgment' && to.zone === 'judgment' ||
      cmd.intent === 'begin_judgment' ||
      active.phase === 'judgment' && from.zone === 'processing' && to.zone === 'judgment');
    if (active && !keep) {end(active.virtual_id,'left_function_role');active=null;}
    if (keep) active.phase=to.zone === 'equipment' ? 'equipment' : 'judgment';
    const occupant=to.zone === 'equipment' ? next.materials.find(x=>!equalId(x.physical_id,m.physical_id) && same(x.location,to)) : null;
    if (occupant) {
      if (cmd.replacement === null || !equalId(cmd.replacement.physical_id,occupant.physical_id)) fail('equipment replacement requires the exact occupied material');
      requireRevision(next,cmd.replacement);
      end(occupant.virtual_id,'equipment_replaced');touch(occupant.physical_id,sharedLocation('discard_pile'),null);
    } else if (cmd.replacement !== null) fail('unexpected replacement material');
    touch(m.physical_id,to,active?.virtual_id ?? null);
  }
  validatePlacement(next,catalog);
  const receipt={command_id:cmd.command_id,seq,kind:cmd.kind,outcome,
    changes:changed.map(physicalId=>({physical_id:physicalId,before:viewAt(state,catalog,materialFor(state,physicalId)),after:viewAt(next,catalog,materialFor(next,physicalId))}))};
  next.commands=[...state.commands,cmd];next.receipts=[...state.receipts,receipt];
  return freeze({registry:seal(next),receipt:freeze(receipt),duplicate:false});
}

/** Restore validates against an EXTERNAL trusted catalog and replays all accepted
 * commands. Snapshot/receipt tampering, duplication and orphan wrappers fail.
 * Replay consistency is not a cryptographic authenticity / anti-cheat guarantee.
 */
export function restore_virtual_card_registry(saved,catalog) {
  checkedCatalog(catalog);
  canonical(saved);
  shape(saved,['version','catalog','initial_materials','materials','identities','commands','receipts'],'saved registry');
  if (own(saved,'version') !== VIRTUAL_CARD_IDENTITY_VERSION) fail('unsupported registry version');
  if (!same(own(saved,'catalog'),catalogIdentity(catalog))) fail('trusted catalog identity/version/content mismatch');
  let state=create_virtual_card_registry(catalog,own(saved,'initial_materials'));
  for (const cmd of list(own(saved,'commands'),'saved commands')) {
    const result=apply_virtual_card_command(state,catalog,cmd);
    if (result.duplicate) fail('saved command log repeats a command');
    state=result.registry;
  }
  if (!same(saved,state)) fail('saved registry or receipts do not match replay');
  return state;
}
