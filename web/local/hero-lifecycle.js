/** Pure, validated Jianghu lifecycle kernel; production adapters provide the
 * trusted finite catalog and dispatch its committed effect outbox. HM and JH
 * policies remain host adaptations, not verified current-client timing rules.
 * See docs/yxs-final-classic/hero-lifecycle.md and docs/wangyun/lifecycle-contract.md.
 */
export const HERO_LIFECYCLE_CONTRACT = 'jianghu.proposed.hero-lifecycle.v2';
export const HERO_LIFECYCLE_CURRENT_CLIENT_RULES_VERIFIED = false;

const fail = message => { throw new TypeError(`Hero lifecycle: ${message}`); };
const string = (value, label) => {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim()) fail(`invalid ${label}`);
  return value;
};
const integer = (value, label, min = Number.MIN_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(value) || Object.is(value,-0) || value < min) fail(`invalid ${label}`);
  return value;
};
function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail(`invalid ${label}`);
  return value;
}
function keys(value, allowed, label) {
  object(value, label);
  if (Reflect.ownKeys(value).some(key => typeof key !== 'string' || !allowed.includes(key))) fail(`unexpected field in ${label}`);
}
// Reject lossy JSON values, accessors, sparse arrays, cyclic values and prototypes.
function json(value, seen = new Set()) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return;
  if (typeof value === 'number' && Number.isFinite(value) && !Object.is(value,-0)) return;
  if (!value || typeof value !== 'object' || seen.has(value)) fail('value is not lossless JSON');
  seen.add(value);
  if (Array.isArray(value)) {
    if (Object.keys(value).length !== value.length || Reflect.ownKeys(value).length !== value.length+1) fail('sparse/decorated array');
    for (let i = 0; i < value.length; i++) {
      const d = Object.getOwnPropertyDescriptor(value, String(i));
      if (!d || !('value' in d)) fail('array accessor');
      json(d.value, seen);
    }
  } else {
    object(value, 'JSON object');
    for (const key of Reflect.ownKeys(value)) {
      const d = Object.getOwnPropertyDescriptor(value, key);
      if (typeof key !== 'string' || !d.enumerable || !('value' in d)) fail('non-JSON property');
      json(d.value, seen);
    }
  }
  seen.delete(value);
}
function copy(value) { json(value); return JSON.parse(JSON.stringify(value)); }
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function uniqueStrings(value, label, nonempty = false) {
  if (!Array.isArray(value) || (nonempty && !value.length)) fail(`invalid ${label}`);
  value.forEach(v => string(v, label));
  if (new Set(value).size !== value.length) fail(`duplicate ${label}`);
  return value;
}
const templateFields = ['template_id','hero_id','display_name','max_hp','gender','skill_ids','personal_lord_skill_ids','complete'];
function template(value, lifecycles) {
  json(value); keys(value, templateFields, 'template');
  for (const key of ['template_id','hero_id','display_name']) string(value[key], key);
  integer(value.max_hp, 'template HP', 1);
  // null is explicit unverified source metadata, never an inferred male/female.
  // Gender-gated mechanics still require their exact known value.
  if (!(value.gender===null||['male','female','other'].includes(value.gender)) || value.complete !== true) fail('incomplete template or invalid gender');
  uniqueStrings(value.skill_ids, 'intrinsic skills', true);
  uniqueStrings(value.personal_lord_skill_ids, 'personal lord skills');
  for (const id of value.skill_ids) if (!lifecycles.has(id)) fail(`unimplemented skill ${id}`);
  if (value.personal_lord_skill_ids.some(id => !value.skill_ids.includes(id))) fail('lord skill omitted from full skill list');
  return copy(value);
}
function skillState(value) { json(value); object(value, 'skill state'); return copy(value); }
function effects(value) {
  if (!Array.isArray(value)) fail('callback effects must be explicit');
  return value.map(effect => {
    json(effect); keys(effect, ['kind','payload'], 'effect');
    string(effect.kind, 'effect kind'); object(effect.payload, 'effect payload'); return copy(effect);
  });
}

/** Templates are audited manifests, NOT inferred from active buttons. Every
 * intrinsic and temporary skill needs explicit versioned acquisition/loss
 * callbacks, including explicit no-ops. Callbacks only return staged JSON;
 * they must not mutate the Game, draw cards or perform external side effects.
 */
export function create_hero_lifecycle({game_id, templates, skill_lifecycles, evolutions = [], snapshot = null}) {
  string(game_id, 'game ID');
  if (!Array.isArray(skill_lifecycles)) fail('skill lifecycle list required');
  const contracts = new Map();
  for (const contract of skill_lifecycles) {
    keys(contract, ['skill_id','version','on_lost','on_acquired'], 'skill contract');
    string(contract.skill_id, 'skill ID'); string(contract.version, 'lifecycle version');
    if (contracts.has(contract.skill_id)) fail('duplicate skill contract');
    if (typeof contract.on_lost !== 'function' || typeof contract.on_acquired !== 'function') fail(`missing lifecycle callback for ${contract.skill_id}`);
    contracts.set(contract.skill_id, Object.freeze({...contract}));
  }
  if (!Array.isArray(templates) || !templates.length) fail('complete template catalog required');
  const catalog = templates.map(t => template(t, contracts));
  if (new Set(catalog.map(t => t.template_id)).size !== catalog.length) fail('duplicate template ID');
  // Evolution edges are code-owned finite authority, never command/save supplied
  // skill lists. An edge cannot impersonate a different hero or change sex.
  if (!Array.isArray(evolutions)) fail('evolution catalog required');
  const edges = evolutions.map(value => {
    json(value); keys(value, ['evolution_id','from_template_id','to_template_id','source_skill_id','continuation_of'], 'evolution');
    for (const key of ['evolution_id','from_template_id','to_template_id','source_skill_id']) string(value[key], 'evolution identity');
    if (value.continuation_of !== undefined) string(value.continuation_of, 'continuation edge');
    const from = catalog.find(t => t.template_id === value.from_template_id);
    const to = catalog.find(t => t.template_id === value.to_template_id);
    if (!from || !to || from.template_id === to.template_id || from.hero_id !== to.hero_id
      || from.gender !== to.gender || !from.skill_ids.includes(value.source_skill_id)) fail('invalid trusted evolution edge');
    return copy(value);
  });
  if (new Set(edges.map(e => e.evolution_id)).size !== edges.length) fail('duplicate evolution ID');
  for (const edge of edges.filter(e => e.continuation_of)) {
    const predecessor = edges.find(e => e.evolution_id === edge.continuation_of);
    if (!predecessor || predecessor.to_template_id !== edge.from_template_id || predecessor.evolution_id === edge.evolution_id) fail('invalid continuation edge');
  }
  const manifest = {templates: catalog, evolutions:edges, lifecycle_versions: [...contracts].map(([skill_id, c]) => ({skill_id, version:c.version}))};
  const initial = {version:2, game_id, contract:HERO_LIFECYCLE_CONTRACT, current_client_rules_verified:false,
    manifest, players:[], deaths:[], transitions:[]};
  const state = snapshot === null ? initial : copy(snapshot);
  const inflight = new Map();
  function knownTemplate(value) {
    const normalized = template(value, contracts);
    if (!catalog.some(t => canonical(t) === canonical(normalized))) fail('partial, changed or unknown full template snapshot');
    return normalized;
  }
  const getTemplate = id => catalog.find(t => t.template_id === id) ?? fail('unknown template ID');
  const player = id => state.players.find(p => p.player_id === id) ?? fail(`unknown player ${id}`);
  const death = id => state.deaths.find(d => d.death_id === id) ?? fail(`unknown real-death receipt ${id}`);
  const evolution = id => edges.find(e => e.evolution_id === id) ?? fail('unknown trusted evolution ID');
  const isEvolution = request => Object.hasOwn(request, 'evolution_id');
  function continuation(request, before) {
    const edge = evolution(request.evolution_id);
    if (!edge.continuation_of) {
      if (request.continuation_transition_id !== undefined) fail('unexpected continuation authority');
      return false;
    }
    string(request.continuation_transition_id, 'continuation transition ID');
    const prior = state.transitions.find(r => r.request.transition_id === request.continuation_transition_id);
    if (!prior || prior.status !== 'committed' || prior.request.actor_id !== request.actor_id
      || prior.request.evolution_id !== edge.continuation_of || prior.result.revision > before.revision
      || prior.target_template.template_id !== edge.from_template_id
      || state.transitions.some(r => r.status === 'committed' && r.request.actor_id === request.actor_id
        && r.result.revision > prior.result.revision && r.result.revision <= before.revision)) fail('invalid or stale continuation receipt');
    return true;
  }
  function validateSkills(rows, t) {
    if (!Array.isArray(rows)) fail('skill ownership list required');
    const ids = new Set();
    for (const row of rows) {
      keys(row, ['skill_id','ownership','state'], 'owned skill');
      if (!contracts.has(row.skill_id) || ids.has(row.skill_id)) fail('unimplemented or duplicate owned skill');
      ids.add(row.skill_id); skillState(row.state);
      if (!['intrinsic','temporary'].includes(row.ownership)) fail('invalid hero skill ownership');
      if ((row.ownership === 'intrinsic') !== t.skill_ids.includes(row.skill_id)) fail('inconsistent intrinsic skill ownership');
    }
    if (t.skill_ids.some(id => !rows.some(r => r.skill_id === id && r.ownership === 'intrinsic'))) fail('omitted intrinsic skill state');
  }
  function validatePlayer(p) {
    keys(p, ['player_id','real_hero_id','effective_template','current_hp','effective_max_hp','mode_max_hp_bonus','life_status','revision','death_id','hero_skills'], 'player');
    string(p.player_id, 'player ID'); string(p.real_hero_id, 'real hero ID'); knownTemplate(p.effective_template);
    integer(p.current_hp, 'current HP'); integer(p.mode_max_hp_bonus, 'own mode HP bonus'); integer(p.revision, 'player revision', 0);
    integer(p.effective_max_hp, 'effective max HP', 1);
    if (p.effective_max_hp !== p.effective_template.max_hp + p.mode_max_hp_bonus || p.current_hp > p.effective_max_hp) fail('inconsistent HP');
    if (!['alive','dying','dead'].includes(p.life_status)
      || (p.life_status === 'alive' && p.current_hp <= 0) || (p.life_status === 'dying' && p.current_hp > 0)) fail('invalid life status');
    if (p.life_status === 'dead') string(p.death_id, 'death ID'); else if (p.death_id !== null) fail('living player has death ID');
    validateSkills(p.hero_skills, p.effective_template);
  }
  function eligible(d) {
    const owner = state.players.find(p => p.player_id === d.player_id);
    return !!owner && owner.life_status === 'dead' && owner.death_id === d.death_id
      && d.invalidated_by === null && d.effective_template.gender === 'male';
  }
  function operations(request, oldSkills, target) {
    const own = isEvolution(request);
    const retained = own ? oldSkills.filter(s => s.ownership === 'intrinsic' && target.skill_ids.includes(s.skill_id)).map(s => s.skill_id) : [];
    const lost = own ? oldSkills.filter(s => s.ownership === 'intrinsic' ? !retained.includes(s.skill_id) : target.skill_ids.includes(s.skill_id)) : oldSkills;
    return [...lost.map(s => ({event:'skill_lost', skill_id:s.skill_id, ownership:s.ownership, old_state:copy(s.state)})),
      ...target.skill_ids.filter(id => !retained.includes(id)).map(skill_id => ({event:'skill_acquired', skill_id, ownership:'intrinsic', old_state:null}))]
      .map((op, i) => ({...op, operation_id:JSON.stringify([game_id,request.transition_id,i,op.event,op.skill_id]), result:null}));
  }
  function validateSnapshot() {
    keys(state, Object.keys(initial), 'snapshot');
    if (state.version !== 2 || state.game_id !== game_id || state.contract !== HERO_LIFECYCLE_CONTRACT
      || state.current_client_rules_verified !== false || canonical(state.manifest) !== canonical(manifest)) fail('snapshot manifest/version mismatch');
    for (const field of ['players','deaths','transitions']) if (!Array.isArray(state[field])) fail(`invalid ${field}`);
    if (new Set(state.players.map(p => p.player_id)).size !== state.players.length) fail('duplicate player');
    state.players.forEach(validatePlayer);
    if (new Set(state.deaths.map(d => d.death_id)).size !== state.deaths.length) fail('duplicate death receipt');
    for (const d of state.deaths) {
      keys(d, ['death_id','player_id','player_revision','effective_template','template_history','invalidated_by'], 'death receipt');
      string(d.death_id, 'death ID'); player(d.player_id); integer(d.player_revision, 'death revision', 1); knownTemplate(d.effective_template);
      if (d.invalidated_by !== null) string(d.invalidated_by, 'revival ID');
      if (!Array.isArray(d.template_history)) fail('death template history required');
      let previous=null;
      for (const entry of d.template_history) {
        keys(entry,['transition_id','before_template','after_template'],'death template history');
        knownTemplate(entry.before_template);knownTemplate(entry.after_template);
        const transition=state.transitions.find(r=>r.request?.transition_id===entry.transition_id);
        if (!transition || transition.status!=='committed' || !isEvolution(transition.request)
          || transition.request.actor_id!==d.player_id || transition.before.life_status!=='dead'
          || transition.before.death_id!==d.death_id
          || canonical(transition.before.effective_template)!==canonical(entry.before_template)
          || canonical(transition.target_template)!==canonical(entry.after_template)
          || previous && canonical(previous)!==canonical(entry.before_template)) fail('inconsistent death template history');
        previous=entry.after_template;
      }
      if (previous && canonical(previous)!==canonical(d.effective_template)) fail('inconsistent final death template');
    }
    for (const p of state.players.filter(p => p.life_status === 'dead')) {
      const d = death(p.death_id);
      if (d.player_id !== p.player_id || d.invalidated_by !== null || canonical(d.effective_template) !== canonical(p.effective_template)) fail('inconsistent active death');
    }
    if (new Set(state.transitions.map(r => r.request.transition_id)).size !== state.transitions.length) fail('duplicate transition');
    for (const r of state.transitions) {
      keys(r, ['request','status','before','target_template','operations','acknowledged_effect_ids','result'], 'transition receipt');
      validateRequest(r.request); validatePlayer(r.before); knownTemplate(r.target_template);
      if (r.before.player_id !== r.request.actor_id || r.before.revision !== r.request.expected_revision) fail('inconsistent transition identity');
      if (isEvolution(r.request)) {
        const edge = evolution(r.request.evolution_id), continuing = continuation(r.request,r.before);
        if (r.before.life_status === 'dead' && !continuing) fail('dead evolution lacks continuation');
        if (r.before.effective_template.template_id !== edge.from_template_id
          || r.target_template.template_id !== edge.to_template_id) fail('inconsistent evolution identity');
      } else {
        const d = death(r.request.death_id);
        if (r.before.life_status !== 'alive' || d.player_id === r.request.actor_id || d.effective_template.gender !== 'male'
          || ![d.effective_template,...d.template_history.map(h=>h.before_template)].some(t=>canonical(t)===canonical(r.target_template))) fail('inconsistent transition identity');
      }
      const plan = operations(r.request, r.before.hero_skills, r.target_template);
      if (!Array.isArray(r.operations) || r.operations.length !== plan.length) fail('partial callback plan');
      let pending = false;
      r.operations.forEach((op, i) => {
        if (canonical({...op,result:null}) !== canonical(plan[i])) fail('changed callback plan');
        if (op.result === null) pending = true;
        else { if (pending) fail('unordered callback checkpoint'); validateCallbackResult(op, op.result); }
      });
      if (!['staging','interrupted','aborted','committed'].includes(r.status)) fail('invalid transition status');
      uniqueStrings(r.acknowledged_effect_ids, 'effect acknowledgements');
      if (r.status === 'committed') {
        if (pending || canonical(r.result) !== canonical(commitResult(r))) fail('incomplete committed transition');
        const ids = receiptEffects(r).map(e => e.effect_id);
        if (r.acknowledged_effect_ids.some(id => !ids.includes(id))) fail('unknown effect acknowledgement');
      } else if (r.result !== null || r.acknowledged_effect_ids.length) fail('uncommitted result/effects');
    }
  }
  function validateRequest(request) {
    json(request); object(request, 'transition request');
    const target = isEvolution(request) ? 'evolution_id' : 'death_id';
    keys(request, ['transition_id','actor_id',target,'expected_revision',...(isEvolution(request)?['continuation_transition_id']:[])], 'transition request');
    for (const key of ['transition_id','actor_id',target]) string(request[key], key);
    integer(request.expected_revision, 'expected actor revision', 0);
  }
  function validateCallbackResult(op, result) {
    json(result); keys(result, op.event === 'skill_lost' ? ['effects'] : ['state','effects'], 'callback result');
    effects(result.effects);
    if (op.event === 'skill_acquired') skillState(result.state);
    return copy(result);
  }
  function commitResult(r) {
    const max_hp = r.target_template.max_hp + r.before.mode_max_hp_bonus;
    integer(max_hp, 'new effective max HP', 1);
    return {player_id:r.request.actor_id, real_hero_id:r.before.real_hero_id, template_id:r.target_template.template_id,
      effective_max_hp:max_hp, current_hp:Math.min(r.before.current_hp,max_hp), revision:integer(r.before.revision+1, 'next player revision', 1)};
  }
  function receiptEffects(r) {
    return r.operations.flatMap(op => (op.result?.effects ?? []).map((effect, i) => ({
      effect_id:JSON.stringify([op.operation_id,i]), transition_id:r.request.transition_id,
      actor_id:r.request.actor_id, skill_id:op.skill_id, event:op.event, ...copy(effect),
    })));
  }
  validateSnapshot();

  function register_player(input) {
    json(input); keys(input, ['player_id','real_hero_id','template_id','current_hp','mode_max_hp_bonus','skill_states','temporary_skills'], 'registration');
    string(input.player_id, 'player ID'); string(input.real_hero_id, 'real hero ID');
    if (state.players.some(p => p.player_id === input.player_id)) fail('player already registered');
    const t = getTemplate(input.template_id), states = input.skill_states;
    if (!Array.isArray(states) || !Array.isArray(input.temporary_skills ?? [])) fail('explicit skill states required');
    for (const s of [...states,...(input.temporary_skills ?? [])]) keys(s, ['skill_id','state'], 'initial skill state');
    const hp = integer(input.current_hp, 'current HP');
    const bonus = integer(input.mode_max_hp_bonus ?? 0, 'own mode HP bonus');
    const p = {player_id:input.player_id, real_hero_id:input.real_hero_id, effective_template:copy(t),
      current_hp:hp,effective_max_hp:t.max_hp+bonus,mode_max_hp_bonus:bonus,life_status:hp>0?'alive':'dying',revision:0,death_id:null,
      hero_skills:[...states.map(s => ({...copy(s),ownership:'intrinsic'})),...(input.temporary_skills ?? []).map(s => ({...copy(s),ownership:'temporary'}))]};
    validatePlayer(p); state.players.push(p); return copy(p);
  }
  function update_vitals(player_id, {current_hp, mode_max_hp_bonus = player(player_id).mode_max_hp_bonus}) {
    const p = player(player_id);
    if (p.life_status === 'dead') fail('use explicit revival for a finalized dead player');
    integer(current_hp, 'current HP'); integer(mode_max_hp_bonus, 'own mode HP bonus');
    const next = {...p,current_hp,mode_max_hp_bonus,effective_max_hp:p.effective_template.max_hp+mode_max_hp_bonus,
      life_status:current_hp>0?'alive':'dying',revision:p.revision+1};
    validatePlayer(next); Object.assign(p,next); return copy(p);
  }
  function sync_hero_skill_states(player_id, rows) {
    const p = player(player_id);
    if (p.life_status === 'dead') fail('cannot change a finalized dead hero skill state');
    json(rows); validateSkills(rows,p.effective_template);
    const next_revision=integer(p.revision+1, 'next player revision', 1);
    p.hero_skills=copy(rows);p.revision=next_revision;return copy(p);
  }
  /** Call ONLY at the host's real-death commit, after rescue is finally denied. */
  function finalize_death(player_id, death_id) {
    string(death_id, 'death ID'); const p = player(player_id), previous = state.deaths.find(d => d.death_id === death_id);
    if (previous) {
      if (previous.player_id !== player_id) fail('conflicting death receipt');
      return copy(previous); // Never re-kill or rearchive after revival/replacement.
    }
    if (p.life_status !== 'dying') fail('only a finalized dying actor may enter the real-death archive');
    const next_revision=integer(p.revision+1, 'next player revision', 1);
    const receipt = {death_id,player_id,player_revision:next_revision,effective_template:knownTemplate(p.effective_template),template_history:[],invalidated_by:null};
    p.life_status='dead';p.death_id=death_id;p.revision=next_revision;
    state.deaths.push(receipt); return copy(receipt);
  }
  function revive_player(player_id, {revival_id,current_hp}) {
    string(revival_id, 'revival ID'); integer(current_hp, 'revival HP', 1); const p = player(player_id);
    if (p.life_status !== 'dead') fail('only finalized dead actors can revive');
    if (current_hp > p.effective_max_hp) fail('revival HP exceeds maximum');
    const next_revision=integer(p.revision+1, 'next player revision', 1);
    const d = death(p.death_id);d.invalidated_by=revival_id;
    p.death_id=null;p.life_status='alive';p.current_hp=current_hp;p.revision=next_revision;return copy(p);
  }
  async function runTransition(r) {
    const p = player(r.request.actor_id), own = isEvolution(r.request);
    const d = own ? null : death(r.request.death_id);
    const valid = () => (p.life_status !== 'dead' || own && continuation(r.request,r.before)) && p.revision === r.before.revision && canonical(p) === canonical(r.before) && (own || eligible(d));
    if (!valid()) { r.status='aborted'; fail('stale transition; actor changed or donor revived'); }
    r.status='staging';
    try {
      for (const op of r.operations) {
        if (op.result !== null) continue;
        const callback = contracts.get(op.skill_id)[op.event === 'skill_lost' ? 'on_lost' : 'on_acquired'];
        const context = freeze(copy({event:op.event,event_id:op.operation_id,transition_id:r.request.transition_id,
          actor_id:p.player_id,real_hero_id:p.real_hero_id,skill_id:op.skill_id,ownership:op.ownership,
          old_state:op.old_state,old_template:r.before.effective_template,new_template:r.target_template,
          transition_kind:own?'own_evolution':'death_replacement'}));
        const result = validateCallbackResult(op, await callback(context));
        if (!valid()) { r.status='aborted'; fail('stale transition during callback'); }
        op.result=result;
      }
      const result = commitResult(r);
      const acquired = r.operations.filter(op => op.event === 'skill_acquired').map(op => ({skill_id:op.skill_id,ownership:'intrinsic',state:copy(op.result.state)}));
      const retained = own ? r.before.hero_skills.filter(s => !r.operations.some(op => op.event === 'skill_lost' && op.skill_id === s.skill_id)) : [];
      const hero_skills = [...r.target_template.skill_ids.map(id => acquired.find(s => s.skill_id === id) ?? retained.find(s => s.skill_id === id)),
        ...retained.filter(s => s.ownership === 'temporary')].map(copy);
      const next = {...p,effective_template:copy(r.target_template),hero_skills,current_hp:result.current_hp,
        effective_max_hp:result.effective_max_hp,revision:result.revision};
      validatePlayer(next); // No partial form, HP, ownership or donor state is ever installed.
      // Only an explicitly trusted continuation can finish an already committed
      // multi-stage evolution after final death. Keep the death identity/status/
      // HP; atomically update the active archive, never create a fake death.
      if (p.life_status === 'dead') {
        if (!own || !continuation(r.request,r.before)) fail('finalized death cannot evolve');
        const archived=death(p.death_id);
        if (archived.invalidated_by!==null) fail('invalidated death continuation');
        archived.template_history.push({transition_id:r.request.transition_id,before_template:copy(archived.effective_template),after_template:copy(r.target_template)});
        archived.effective_template=copy(r.target_template);
      }
      Object.assign(p,next);r.result=result;r.status='committed';return copy(r);
    } catch (error) { if (r.status !== 'aborted') r.status='interrupted'; throw error; }
  }
  function transition(request, own) {
    validateRequest(request);
    if (isEvolution(request) !== own) fail('wrong transition authority');
    let r = state.transitions.find(r => r.request.transition_id === request.transition_id);
    if (r) {
      if (canonical(r.request) !== canonical(request)) fail('conflicting transition receipt');
      if (r.status === 'committed') return Promise.resolve(copy(r));
      if (r.status === 'aborted') fail('transition was aborted; use a new validated request');
      if (inflight.has(request.transition_id)) return inflight.get(request.transition_id).then(copy);
    } else {
      const p = player(request.actor_id);
      let target;
      if (own) {
        const edge = evolution(request.evolution_id), continuing = continuation(request,p);
        if ((p.life_status === 'dead' && !continuing) || p.revision !== request.expected_revision || p.effective_template.template_id !== edge.from_template_id) fail('ineligible or stale own-form evolution');
        target = getTemplate(edge.to_template_id);
      } else {
        const d = death(request.death_id);
        if (p.life_status !== 'alive' || p.revision !== request.expected_revision || d.player_id === p.player_id || !eligible(d)) fail('ineligible actor or real-death candidate');
        target = knownTemplate(d.effective_template);
      }
      if (state.transitions.some(r => r.request.actor_id === p.player_id && ['staging','interrupted'].includes(r.status))) fail('actor has an unfinished transition');
      integer(target.max_hp+p.mode_max_hp_bonus, 'new effective max HP', 1);
      integer(p.revision+1, 'next player revision', 1);
      r = {request:copy(request),status:'staging',before:copy(p),target_template:target,
        operations:operations(request,p.hero_skills,target),acknowledged_effect_ids:[],result:null};
      state.transitions.push(r);
    }
    // Defer the first callback until the concurrency guard has been installed.
    const job = Promise.resolve().then(() => runTransition(r)).finally(() => inflight.delete(request.transition_id));
    inflight.set(request.transition_id,job);return job.then(copy);
  }
  const replace_from_death = request => transition(request, false);
  const evolve_own_form = request => transition(request, true);
  function pending_effects() {
    return state.transitions.filter(r => r.status === 'committed').flatMap(r => receiptEffects(r).filter(e => !r.acknowledged_effect_ids.includes(e.effect_id)));
  }
  function acknowledge_effect(effect_id) {
    string(effect_id, 'effect ID');
    const r = state.transitions.find(r => r.status === 'committed' && receiptEffects(r).some(e => e.effect_id === effect_id));
    if (!r) fail('effect is not committed');
    if (!r.acknowledged_effect_ids.includes(effect_id)) r.acknowledged_effect_ids.push(effect_id);
  }
  return Object.freeze({
    register_player,update_vitals,sync_hero_skill_states,finalize_death,revive_player,replace_from_death,evolve_own_form,pending_effects,acknowledge_effect,
    snapshot:() => copy(state),
    player_state:id => copy(player(id)),
    effective_form:id => { const p=player(id); return copy({player_id:p.player_id,real_hero_id:p.real_hero_id,
      template:p.effective_template,current_hp:p.current_hp,effective_max_hp:p.effective_max_hp,gender:p.effective_template.gender}); },
    dead_candidates:() => state.deaths.filter(eligible).map(d => copy(d)),
    transition_receipt:id => copy(state.transitions.find(r => r.request.transition_id === id) ?? null),
  });
}
