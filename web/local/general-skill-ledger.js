/** Pure ownership overlay for M7/M13/M14. It does not dispatch game hooks.
 * Keep the full finite lifecycle template as source metadata; this ledger owns
 * actor-local skill instances, permanent loss receipts and awakening history.
 * All authority catalogs are trusted CODE, never supplied by save/UI payloads.
 * See docs/sgs-mountain/general-skill-ledger-contract.md for the host boundary.
 */
export const GENERAL_SKILL_LEDGER_CONTRACT = 'jianghu.general-skill-ledger.v1';
export const GENERAL_SKILL_LEDGER_SCHEMA = 1;
export const GENERAL_SKILL_SUPPRESSED_RULE_ID = 'jianghu.runtime.general-skills.suppressed';
export const GENERAL_SKILL_LEDGER_LIMITS = Object.freeze({actors:16, templates:256, skills:2048,
  rules:2048, commands:8192, instances:8192, resolutions:8192, effects:32768,
  text:512, context_bytes:16384, snapshot_bytes:16777216, depth:32, max_hp:99});
const L = GENERAL_SKILL_LEDGER_LIMITS;
const fail = message => { throw new TypeError(`General skill ledger: ${message}`); };
const str = (value, label = 'ID', max = L.text) => {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim() || value.length > max) fail(`invalid ${label}`);
  return value;
};
const int = (value, label, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isSafeInteger(value) || Object.is(value,-0) || value < min || value > max) fail(`invalid ${label}`);
  return value;
};
function plain(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || ![Object.prototype,null].includes(Object.getPrototypeOf(value))) fail(`invalid ${label}`);
}
function keys(value, allowed, label) {
  plain(value,label);
  if (Reflect.ownKeys(value).some(k => typeof k !== 'string' || !allowed.includes(k))) fail(`unexpected ${label} field`);
}
// Validate descriptors before reading values: no getters, prototypes, sparse
// arrays, cycles, functions, undefined, bigint, nonfinite numbers or -0.
function json(value, seen = new Set(), depth = 0) {
  if (depth > L.depth) fail('JSON nesting limit');
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number' && Number.isFinite(value) && !Object.is(value,-0)) return;
  if (!value || typeof value !== 'object' || seen.has(value)) fail('not lossless JSON');
  seen.add(value);
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype || Object.keys(value).length !== value.length
      || Reflect.ownKeys(value).length !== value.length+1) fail('sparse or decorated JSON array');
    for (let i=0;i<value.length;i++) {
      const d=Object.getOwnPropertyDescriptor(value,String(i));
      if (!d || !('value' in d)) fail('array accessor');
      json(d.value,seen,depth+1);
    }
  } else {
    plain(value,'JSON object');
    for (const k of Reflect.ownKeys(value)) {
      const d=Object.getOwnPropertyDescriptor(value,k);
      if (typeof k !== 'string' || !d.enumerable || !('value' in d)) fail('non-JSON property');
      json(d.value,seen,depth+1);
    }
  }
  seen.delete(value);
}
function copy(value) { json(value); return JSON.parse(JSON.stringify(value)); }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(k=>`${JSON.stringify(k)}:${canonical(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
function array(value,label,max) {
  if (!Array.isArray(value) || value.length>max) fail(`invalid or oversized ${label}`);
  return value;
}
function strings(value,label,max=L.skills) {
  array(value,label,max).forEach(v=>str(v,label));
  if (new Set(value).size!==value.length) fail(`duplicate ${label}`);
  return value;
}
function lookup(rows,key,id,label) { return rows.find(row=>row[key]===id) ?? fail(`unknown ${label}`); }
function unique(rows,key,label) {
  if (new Set(rows.map(row=>row[key])).size!==rows.length) fail(`duplicate ${label}`);
}
const bindId=(game,actor,template)=>JSON.stringify(['general-skill-binding',game,actor,template]);
const instanceId=(binding,skill,origin)=>JSON.stringify(['general-skill-instance',binding,skill,origin]);
const bool=(value,label)=>{if(typeof value!=='boolean')fail(`invalid ${label}`);return value;};

/** Catalog entries have no callbacks. Pure loss effects only name a trusted
 * pile; the host performs actual physical card movement and effect receipts.
 * The generic apply method and its convenience wrappers accept engine commands,
 * not raw browser requests. See the contract for each command's exact shape.
 */
export function create_general_skill_ledger({game_id,templates,skills,grants=[],max_hp_rules=[],template_rules=[],removal_rules=[],snapshot=null}) {
  str(game_id,'game ID');
  const manifest=copy({templates,skills,grants,max_hp_rules,template_rules,removal_rules});
  array(manifest.skills,'skills',L.skills).forEach(s=>{
    keys(s,['skill_id','provider','cleanup_pile_ids'],'skill');str(s.skill_id,'skill ID');
    if(!['general','equipment'].includes(s.provider))fail('unknown provider');
    strings(s.cleanup_pile_ids,'cleanup piles',32);
    if(s.provider==='equipment'&&s.cleanup_pile_ids.length)fail('equipment cleanup is not a general-skill effect');
  });
  unique(manifest.skills,'skill_id','skill ID');
  const getSkill=id=>lookup(manifest.skills,'skill_id',id,'skill ID');
  const general=id=>{const s=getSkill(id);if(s.provider!=='general')fail('equipment provider is outside this ledger');return s;};
  array(manifest.templates,'templates',L.templates).forEach(t=>{
    keys(t,['template_id','hero_id','display_name','max_hp','gender','skill_ids','personal_lord_skill_ids','complete'],'template');
    for(const key of ['template_id','hero_id','display_name'])str(t[key],key);
    if(t.hero_id===GENERAL_SKILL_SUPPRESSED_RULE_ID)fail('reserved suppressed rule ID');
    int(t.max_hp,'template max HP',1,L.max_hp);
    if(!(t.gender===null||['male','female','other'].includes(t.gender))||t.complete!==true)fail('incomplete template');
    strings(t.skill_ids,'template skills');t.skill_ids.forEach(general);
    strings(t.personal_lord_skill_ids,'lord skills');
    if(t.personal_lord_skill_ids.some(id=>!t.skill_ids.includes(id)))fail('lord skill missing from full template');
  });
  if(!manifest.templates.length)fail('full template catalog required');
  unique(manifest.templates,'template_id','template ID');
  const getTemplate=id=>lookup(manifest.templates,'template_id',id,'template ID');
  for(const [name,idKey] of [['grants','grant_id'],['max_hp_rules','rule_id'],['template_rules','rule_id'],['removal_rules','rule_id']]) {
    array(manifest[name],name,L.rules).forEach(r=>str(r[idKey],idKey));unique(manifest[name],idKey,name);
  }
  manifest.max_hp_rules.forEach(r=>{
    keys(r,['rule_id','source_skill_id','delta','awakening_id','once_per_binding'],'max HP rule');
    general(r.source_skill_id);int(r.delta,'max HP delta',-L.max_hp,L.max_hp);
    if(r.delta===0)fail('zero max HP delta');bool(r.once_per_binding,'once per binding');
    if(r.awakening_id!==null){str(r.awakening_id,'awakening ID');if(!r.once_per_binding)fail('awakening must be once per binding');}
  });
  unique(manifest.max_hp_rules.filter(r=>r.awakening_id!==null),'awakening_id','awakening ID');
  manifest.grants.forEach(r=>{
    keys(r,['grant_id','source_skill_id','skill_id','self_only','once_per_binding','requires_awakening'],'grant');
    general(r.source_skill_id);general(r.skill_id);bool(r.self_only,'self-only grant');bool(r.once_per_binding,'once per binding');
    if(r.requires_awakening!==null){
      const awakening=lookup(manifest.max_hp_rules,'awakening_id',r.requires_awakening,'grant awakening');
      if(awakening.source_skill_id!==r.source_skill_id)fail('grant awakening belongs to another skill');
    }
  });
  manifest.template_rules.forEach(r=>{
    keys(r,['rule_id','source_skill_id','from_template_ids','to_template_ids'],'template rule');general(r.source_skill_id);
    for(const key of ['from_template_ids','to_template_ids']){
      strings(r[key],key,L.templates);if(!r[key].length)fail('empty template authority');r[key].forEach(getTemplate);
    }
  });
  manifest.removal_rules.forEach(r=>{keys(r,['rule_id','source_skill_id'],'removal rule');general(r.source_skill_id);});
  const original={version:GENERAL_SKILL_LEDGER_SCHEMA,contract:GENERAL_SKILL_LEDGER_CONTRACT,game_id,manifest,
    commands:[],actors:[],receipts:[],effects:[],authority_events:[],acknowledged_effect_ids:[]};
  let state=copy(original);
  const actor=(s,id)=>lookup(s.actors,'actor_id',id,'actor ID');
  const binding=(a,id=a.current_template_id)=>lookup(a.bindings,'template_id',id,'actor template binding');
  const activeInstances=a=>a.instances.filter(i=>i.binding_id===binding(a).binding_id&&i.removed_by===null);
  const maxHP=a=>int(getTemplate(a.current_template_id).max_hp+a.mode_max_hp_bonus+binding(a).max_hp_delta,'effective max HP',1,L.max_hp);
  function source(s,c,skill_id,sourceId=c.actor_id) {
    const a=actor(s,sourceId);
    if(c.resolution_id!==undefined){
      str(c.resolution_id,'resolution ID');
      const r=lookup(a.resolutions,'resolution_id',c.resolution_id,'committed resolution');
      if(r.status!=='committed'||r.skill_id!==skill_id)fail('resolution lacks committed source authority');
      if(c.event_id!==r.resolution_id)fail('committed source authority is bound to its original event');
      if(!r.continuations.some(next=>next.kind===c.kind&&next.rule_id===(c.grant_id??c.rule_id)
        &&next.actor_id===c.actor_id&&(next.template_id??null)===(c.template_id??null)))fail('effect is outside captured continuation authority');
      if(r.binding_id!==binding(a).binding_id)fail('captured source binding is no longer current');
      return {actor:a,binding:binding(a),instance_id:r.instance_id,skill_id};
    }
    const i=activeInstances(a).find(i=>i.skill_id===skill_id);
    if(!i)fail('source general skill is not currently owned');
    return {actor:a,binding:binding(a),instance_id:i.instance_id,skill_id};
  }
  function claimEvent(s,c,rule_id,sourceId) {
    str(c.event_id,'authority event ID');
    const key=JSON.stringify([c.kind,rule_id,sourceId,c.event_id]);
    if(s.authority_events.some(e=>e.key===key))fail('authority event already consumed');
    s.authority_events.push({key,command_id:c.command_id});
  }
  function addEffect(s,c,kind,payload) {
    const effect={effect_id:JSON.stringify(['general-skill-effect',game_id,c.command_id,s.effects.filter(e=>e.command_id===c.command_id).length]),
      command_id:c.command_id,actor_id:c.actor_id,kind,payload:copy(payload)};
    s.effects.push(effect);return effect.effect_id;
  }
  function initializeBinding(a,template_id,c) {
    let b=a.bindings.find(b=>b.template_id===template_id);
    if(b)return b;
    const t=getTemplate(template_id);
    b={binding_id:bindId(game_id,a.actor_id,template_id),template_id,max_hp_delta:0,
      awakening_marks:[],max_hp_rule_receipts:[],grant_receipts:[],use_counters:[]};a.bindings.push(b);
    for(const skill_id of t.skill_ids)a.instances.push({instance_id:instanceId(b.binding_id,skill_id,'intrinsic'),
      skill_id,binding_id:b.binding_id,ownership:t.personal_lord_skill_ids.includes(skill_id)?'lord':a.real_hero_id===t.hero_id?'intrinsic':'copied',
      acquired_by:c.command_id,source_actor_id:a.actor_id,source_skill_id:null,source_instance_id:null,removed_by:null});
    return b;
  }
  function invalidatePrepared(s,a,c,ids,reason) {
    for(const r of a.resolutions)if(r.status==='prepared'&&ids.includes(r.instance_id)){
      r.status='invalidated';r.closed_by=c.command_id;
      addEffect(s,c,'invalidate_skill_prompt',{resolution_id:r.resolution_id,skill_id:r.skill_id,reason});
    }
  }
  const shapes={
    register_actor:['real_hero_id','template_id','current_hp','mode_max_hp_bonus'],
    install_template:['template_id','rule_id','event_id','resolution_id'],
    change_max_hp:['rule_id','event_id','current_hp','resolution_id'],
    acquire_skill:['grant_id','source_actor_id','event_id','resolution_id'],
    remove_all:['rule_id','source_actor_id','event_id','resolution_id'],
    prepare_skill:['skill_id','resolution_id','context','continuations'],commit_skill:['resolution_id'],
    finish_skill:['resolution_id'],cancel_skill:['resolution_id'],record_use:['skill_id'],update_hp:['current_hp'],
  };
  function validateCommand(command) {
    json(command);plain(command,'command');
    if(!Object.hasOwn(shapes,command.kind))fail('unknown command kind');
    keys(command,['kind','command_id','actor_id','expected_revision',...shapes[command.kind]],'command');
    str(command.command_id,'command ID');str(command.actor_id,'actor ID');int(command.expected_revision,'expected revision',0);
    // Command-local values are checked before every branch reads them.
    for(const k of ['real_hero_id','template_id','rule_id','event_id','grant_id','source_actor_id','skill_id','resolution_id'])
      if(Object.hasOwn(command,k))str(command[k],k);
  }
  function reduce(s,c) {
    if(c.kind==='register_actor'){
      if(s.actors.some(a=>a.actor_id===c.actor_id))fail('actor already registered');
      if(c.expected_revision!==0)fail('stale actor registration');
      const t=getTemplate(c.template_id);
      if(!manifest.templates.some(t=>t.hero_id===c.real_hero_id))fail('unknown real hero ID');
      // Register only the real initial identity. Copying is a separate authorized
      // operation and cannot bring in donor skill state, HP deltas or counters.
      if(t.hero_id!==c.real_hero_id)fail('registration cannot impersonate a copied template');
      int(c.mode_max_hp_bonus,'own mode max HP bonus',-L.max_hp,L.max_hp);
      const a={actor_id:c.actor_id,real_hero_id:c.real_hero_id,current_template_id:t.template_id,
        mode_max_hp_bonus:c.mode_max_hp_bonus,current_hp:c.current_hp,revision:1,bindings:[],instances:[],resolutions:[]};
      initializeBinding(a,t.template_id,c);int(c.current_hp,'current HP',-L.max_hp,maxHP(a));
      s.actors.push(a);return {actor_id:a.actor_id,binding_id:binding(a).binding_id,max_hp:maxHP(a),current_hp:a.current_hp};
    }
    const a=actor(s,c.actor_id);
    if(a.revision!==c.expected_revision)fail('stale actor revision');
    let result;
    if(c.kind==='install_template'){
      const r=lookup(manifest.template_rules,'rule_id',c.rule_id,'template rule');source(s,c,r.source_skill_id);
      if(!r.from_template_ids.includes(a.current_template_id)||!r.to_template_ids.includes(c.template_id))fail('template transition outside finite authority');
      claimEvent(s,c,r.rule_id,a.actor_id);
      const prior=binding(a),oldIds=activeInstances(a).map(i=>i.instance_id);
      initializeBinding(a,c.template_id,c);a.current_template_id=c.template_id;a.current_hp=Math.min(a.current_hp,maxHP(a));
      if(prior.binding_id!==binding(a).binding_id)invalidatePrepared(s,a,c,oldIds,'source template changed');
      addEffect(s,c,'template_overlay_changed',{previous_binding_id:prior.binding_id,binding_id:binding(a).binding_id,template_id:c.template_id});
      result={binding_id:binding(a).binding_id,template_id:c.template_id,max_hp:maxHP(a),current_hp:a.current_hp};
    }else if(c.kind==='change_max_hp'){
      const r=lookup(manifest.max_hp_rules,'rule_id',c.rule_id,'max HP rule'),src=source(s,c,r.source_skill_id),b=src.binding;
      if(r.once_per_binding&&b.max_hp_rule_receipts.some(x=>x.rule_id===r.rule_id))fail('max HP/awakening already consumed for own binding');
      if(r.awakening_id!==null&&b.awakening_marks.some(x=>x.awakening_id===r.awakening_id))fail('awakening already consumed');
      const before=maxHP(a);int(c.current_hp,'current HP',-L.max_hp,before);
      const after=before+r.delta;
      if(after<1)fail('unsupported low-max-HP policy: change would reduce maximum below 1');
      int(after,'changed max HP',1,L.max_hp);claimEvent(s,c,r.rule_id,a.actor_id);
      b.max_hp_delta+=r.delta;a.current_hp=Math.min(c.current_hp,after);
      b.max_hp_rule_receipts.push({rule_id:r.rule_id,command_id:c.command_id});
      if(r.awakening_id!==null)b.awakening_marks.push({awakening_id:r.awakening_id,source_skill_id:r.source_skill_id,command_id:c.command_id});
      // A clamp is explicitly NOT damage or HP loss: no rescue/damage hook.
      result={binding_id:b.binding_id,old_max_hp:before,max_hp:after,current_hp:a.current_hp,hp_clamped:c.current_hp-a.current_hp,damage:0};
      addEffect(s,c,'max_hp_changed',result);
    }else if(c.kind==='acquire_skill'){
      const r=lookup(manifest.grants,'grant_id',c.grant_id,'grant'),src=source(s,c,r.source_skill_id,c.source_actor_id),b=binding(a);
      if(r.self_only&&c.source_actor_id!==a.actor_id)fail('grant must target its source owner');
      if(r.requires_awakening!==null&&!src.binding.awakening_marks.some(x=>x.awakening_id===r.requires_awakening))fail('grant requires own awakening receipt');
      if(r.once_per_binding&&src.binding.grant_receipts.some(x=>x.grant_id===r.grant_id))fail('grant already consumed for source binding');
      claimEvent(s,c,r.grant_id,src.actor.actor_id);
      const existing=activeInstances(a).find(i=>i.skill_id===r.skill_id);
      let i=existing;
      if(!i){
        i={instance_id:instanceId(b.binding_id,r.skill_id,c.command_id),skill_id:r.skill_id,binding_id:b.binding_id,
          ownership:'granted',acquired_by:c.command_id,source_actor_id:src.actor.actor_id,source_skill_id:r.source_skill_id,source_instance_id:src.instance_id,removed_by:null};
        a.instances.push(i);addEffect(s,c,'general_skill_acquired',{instance_id:i.instance_id,skill_id:i.skill_id,binding_id:b.binding_id,grant_id:r.grant_id});
      }
      // The target command may consume authority owned by another actor. That
      // source's revision is advanced too, so its pending commands become stale.
      src.binding.grant_receipts.push({grant_id:r.grant_id,command_id:c.command_id,target_actor_id:a.actor_id});
      if(src.actor!==a)src.actor.revision++;
      result={instance_id:i.instance_id,skill_id:i.skill_id,acquired:!existing,binding_id:b.binding_id};
    }else if(c.kind==='remove_all'){
      const r=lookup(manifest.removal_rules,'rule_id',c.rule_id,'removal rule');source(s,c,r.source_skill_id,c.source_actor_id);
      claimEvent(s,c,r.rule_id,c.source_actor_id);
      const removed=activeInstances(a);for(const i of removed){
        i.removed_by=c.command_id;
        addEffect(s,c,'general_skill_lost',{instance_id:i.instance_id,skill_id:i.skill_id,binding_id:i.binding_id,ownership:i.ownership});
      }
      // One pile belongs to the actor/skill, even if two provider instances ever
      // refer to it. Cleanup remains a durable effect until the host acks it.
      const piles=new Set();for(const i of removed)for(const pile_id of general(i.skill_id).cleanup_pile_ids){
        const key=JSON.stringify([i.skill_id,pile_id]);if(piles.has(key))continue;piles.add(key);
        addEffect(s,c,'skill_pile_cleanup',{skill_id:i.skill_id,binding_id:i.binding_id,pile_id});
      }
      invalidatePrepared(s,a,c,removed.map(i=>i.instance_id),'general skill removed');
      result={removed_instance_ids:removed.map(i=>i.instance_id),removed_skill_ids:[...new Set(removed.map(i=>i.skill_id))],
        max_hp:maxHP(a),current_hp:a.current_hp,equipment_unchanged:true};
    }else if(c.kind==='prepare_skill'){
      general(c.skill_id);const i=activeInstances(a).find(i=>i.skill_id===c.skill_id);if(!i)fail('cannot prepare an unowned skill');
      str(c.resolution_id,'resolution ID');plain(c.context,'captured context');
      if(JSON.stringify(c.context).length>L.context_bytes)fail('captured context limit');
      if(s.actors.some(p=>p.resolutions.some(r=>r.resolution_id===c.resolution_id)))fail('resolution ID already exists');
      const continuations=c.continuations??[];array(continuations,'continuations',64);
      const seen=new Set();for(const next of continuations){
        keys(next,['kind','rule_id','actor_id',...(next.kind==='install_template'?['template_id']:[])],'continuation');
        str(next.rule_id,'continuation rule');str(next.actor_id,'continuation actor');actor(s,next.actor_id);
        const catalogs={change_max_hp:['max_hp_rules','rule_id'],acquire_skill:['grants','grant_id'],remove_all:['removal_rules','rule_id'],install_template:['template_rules','rule_id']};
        if(!Object.hasOwn(catalogs,next.kind))fail('unknown continuation kind');
        const [catalog,key]=catalogs[next.kind],rule=lookup(manifest[catalog],key,next.rule_id,'continuation rule');
        if(rule.source_skill_id!==c.skill_id)fail('continuation belongs to another source skill');
        if(['change_max_hp','install_template'].includes(next.kind)&&next.actor_id!==a.actor_id)fail('continuation must target its owner');
        if(next.kind==='install_template'&&!rule.to_template_ids.includes(next.template_id))fail('continuation template outside authority');
        if(next.kind==='acquire_skill'&&rule.self_only&&next.actor_id!==a.actor_id)fail('continuation grant must target its owner');
        const signature=canonical(next);if(seen.has(signature))fail('duplicate continuation');seen.add(signature);
      }
      const r={resolution_id:c.resolution_id,actor_id:a.actor_id,skill_id:i.skill_id,instance_id:i.instance_id,binding_id:i.binding_id,
        status:'prepared',prepared_by:c.command_id,committed_by:null,closed_by:null,context:copy(c.context),continuations:copy(continuations)};
      a.resolutions.push(r);result={resolution_id:r.resolution_id,status:r.status,instance_id:i.instance_id};
    }else if(['commit_skill','finish_skill','cancel_skill'].includes(c.kind)){
      const r=lookup(a.resolutions,'resolution_id',c.resolution_id,'resolution');
      if(c.kind==='commit_skill'){
        if(r.status!=='prepared'||!activeInstances(a).some(i=>i.instance_id===r.instance_id))fail('skill prompt is stale or invalidated');
        r.status='committed';r.committed_by=c.command_id;
      }else if(c.kind==='finish_skill'){
        if(r.status!=='committed')fail('only a committed resolution can finish');r.status='finished';r.closed_by=c.command_id;
      }else{
        if(r.status!=='prepared')fail('only an uncommitted prompt can cancel');r.status='cancelled';r.closed_by=c.command_id;
      }
      result={resolution_id:r.resolution_id,status:r.status};
    }else if(c.kind==='record_use'){
      general(c.skill_id);if(!activeInstances(a).some(i=>i.skill_id===c.skill_id))fail('cannot use an unowned skill');
      const b=binding(a);let use=b.use_counters.find(x=>x.skill_id===c.skill_id);
      if(!use)b.use_counters.push(use={skill_id:c.skill_id,count:0});int(use.count+1,'use count',1);use.count++;
      result={skill_id:c.skill_id,binding_id:b.binding_id,count:use.count};
    }else if(c.kind==='update_hp'){
      int(c.current_hp,'current HP',-L.max_hp,maxHP(a));a.current_hp=c.current_hp;result={current_hp:a.current_hp,max_hp:maxHP(a)};
    }
    int(a.revision+1,'next actor revision',1);a.revision++;return result;
  }
  function capacity(s) {
    if(s.actors.length>L.actors||s.commands.length>L.commands||s.effects.length>L.effects
      ||s.actors.reduce((n,a)=>n+a.instances.length,0)>L.instances
      ||s.actors.reduce((n,a)=>n+a.resolutions.length,0)>L.resolutions)fail('bounded ledger capacity exhausted; do not prune live receipts');
    if(JSON.stringify(s).length>L.snapshot_bytes)fail('snapshot size limit');
  }
  function apply(command) {
    validateCommand(command);
    const old=state.receipts.find(r=>r.command_id===command.command_id);
    if(old){if(canonical(old.request)!==canonical(command))fail('conflicting command receipt');return copy(old);}
    if(state.commands.length>=L.commands)fail('bounded command capacity exhausted');
    const c=copy(command),next=copy(state),result=reduce(next,c),a=actor(next,c.actor_id);
    const receipt={command_id:c.command_id,actor_id:c.actor_id,request:c,status:'committed',revision:a.revision,
      result,effect_ids:next.effects.filter(e=>e.command_id===c.command_id).map(e=>e.effect_id)};
    next.commands.push(c);next.receipts.push(receipt);capacity(next);state=next;return copy(receipt);
  }
  function acknowledge_effect(effect_id) {
    str(effect_id,'effect ID',8192);if(!state.effects.some(e=>e.effect_id===effect_id))fail('effect is not committed');
    if(!state.acknowledged_effect_ids.includes(effect_id)){
      const next=copy(state);next.acknowledged_effect_ids.push(effect_id);capacity(next);state=next;
    }
  }
  function projection(actor_id) {
    const a=actor(state,actor_id),b=binding(a),t=getTemplate(a.current_template_id),instances=activeInstances(a);
    // Inspect ORIGINAL instances, not just names: regranting one (or even all)
    // skill IDs does not silently resurrect the old broad legacy hero bundle.
    const originalInstances=a.instances.filter(i=>i.binding_id===b.binding_id&&i.ownership!=='granted');
    const legacy=originalInstances.every(i=>i.removed_by===null)&&originalInstances.length===t.skill_ids.length;
    const skill_ids=[...new Set(instances.map(i=>i.skill_id))];
    return {id:legacy?t.hero_id:GENERAL_SKILL_SUPPRESSED_RULE_ID,source_hero_id:t.hero_id,
      template_id:t.template_id,display_name:t.display_name,gender:t.gender,max_hp:maxHP(a),
      general_skill_binding_id:b.binding_id,legacy_intrinsics_enabled:legacy,
      skill_ids,personal_lord_skill_ids:t.personal_lord_skill_ids.filter(id=>skill_ids.includes(id)),
      overlay_skill_ids:[...new Set(instances.filter(i=>!legacy||i.ownership==='granted').map(i=>i.skill_id))],
      removed_skill_ids:[...new Set(a.instances.filter(i=>i.binding_id===b.binding_id&&i.removed_by!==null).map(i=>i.skill_id))],
      awakening_marks:b.awakening_marks.map(m=>({awakening_id:m.awakening_id,source_skill_id:m.source_skill_id}))};
  }
  function committed_context(actor_id,resolution_id) {
    const r=lookup(actor(state,actor_id).resolutions,'resolution_id',resolution_id,'resolution');
    if(!['committed','finished'].includes(r.status))fail('resolution has no committed context');return copy(r);
  }
  if(snapshot!==null){
    json(snapshot);keys(snapshot,Object.keys(original),'snapshot');
    if(JSON.stringify(snapshot).length>L.snapshot_bytes)fail('snapshot size limit');
    if(snapshot.version!==GENERAL_SKILL_LEDGER_SCHEMA||snapshot.contract!==GENERAL_SKILL_LEDGER_CONTRACT
      ||snapshot.game_id!==game_id||canonical(snapshot.manifest)!==canonical(manifest))fail('snapshot schema/catalog mismatch');
    array(snapshot.commands,'commands',L.commands);array(snapshot.acknowledged_effect_ids,'effect acknowledgements',L.effects);
    snapshot.acknowledged_effect_ids.forEach(id=>str(id,'effect acknowledgement',8192));
    if(new Set(snapshot.acknowledged_effect_ids).size!==snapshot.acknowledged_effect_ids.length)fail('duplicate effect acknowledgement');
    // Rebuild every derived instance, tombstone, receipt, context and effect.
    // Validation of selected fields alone would permit skill resurrection.
    for(const command of snapshot.commands){
      if(state.receipts.some(r=>r.command_id===command.command_id))fail('duplicate snapshot command');apply(command);
    }
    for(const id of snapshot.acknowledged_effect_ids)acknowledge_effect(id);
    if(canonical(state)!==canonical(snapshot))fail('snapshot differs from fully validated replay');
  }
  const api={apply,snapshot:()=>copy(state),actor_state:id=>copy(actor(state,id)),
    command_receipt:id=>copy(state.receipts.find(r=>r.command_id===id)??null),
    binding_id:id=>binding(actor(state,id)).binding_id,
    has_skill:(id,skill_id)=>manifest.skills.some(s=>s.skill_id===skill_id&&s.provider==='general')&&activeInstances(actor(state,id)).some(i=>i.skill_id===skill_id),
    effective_max_hp:id=>maxHP(actor(state,id)),
    rule_projection:id=>copy(projection(id)),
    public_state:id=>{const p=projection(id);return copy({actor_id:id,source_hero_id:p.source_hero_id,template_id:p.template_id,
      max_hp:p.max_hp,skill_ids:p.skill_ids,removed_skill_ids:p.removed_skill_ids,awakening_marks:p.awakening_marks,
      general_skills_removed:!p.legacy_intrinsics_enabled});},
    committed_context,pending_effects:()=>copy(state.effects.filter(e=>!state.acknowledged_effect_ids.includes(e.effect_id))),acknowledge_effect};
  for(const kind of Object.keys(shapes))api[kind]=request=>{json(request);keys(request,['command_id','actor_id','expected_revision',...shapes[kind]],`${kind} request`);return apply({kind,...request});};
  return Object.freeze(api);
}
