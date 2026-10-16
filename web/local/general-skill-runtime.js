/** Trusted Game adapter for the pure M7/M13/M14 ledger. Hook dispatch is wired
 * separately by skills.js using the WeakMap-branded descriptor. These methods
 * never replace actor.hero or lifecycle's complete source templates. */
import {HEROES} from './models.js';
import {create_general_skill_ledger} from './general-skill-ledger.js';
import {make_general_skill_descriptor} from './general-skill-descriptor.js';
import {WANGYUN_LIFECYCLE_ID,WANGYUN_FORM_IDS,WANGYUN_EVOLUTIONS,wangyun_form_templates,wangyun_rule_descriptor} from './wangyun-lifecycle.js';
const copy=value=>JSON.parse(JSON.stringify(value));
const fail=message=>{throw TypeError(`General skill runtime: ${message}`);};
const HUA='yxs.adapted.base.hero.hua-mu-lan',BASE_GAME_ID='local-match-general-skill-ledger';
const PILE_FIELDS={'sgs.tuntian.fields':'sgs_mountain_fields','sgs.jieyue.cards':'sgs_following_jieyue_pile'};
const AWAKEN={
  'sgs.zaoxian':{rule_id:'sgs.zaoxian.max-hp',grant_id:'sgs.zaoxian.grant-jixi',skill_id:'sgs.jixi'},
  'sgs.zhiji':{rule_id:'sgs.zhiji.max-hp',grant_id:'sgs.zhiji.grant-guanxing',skill_id:'sgs.guanxing'},
};
const text=(value,label)=>{if(typeof value!=='string'||!value.trim()||value!==value.trim())fail(`invalid ${label}`);return value;};
const allowed=(options,fields)=>{if(!options||typeof options!=='object'||Array.isArray(options)||Object.keys(options).some(k=>!fields.includes(k)))fail('unexpected options');};
const manifest=hero=>({template_id:hero.id,hero_id:hero.id,display_name:hero.display_name??hero.name,max_hp:hero.max_hp,gender:hero.gender,
  skill_ids:[...(hero.skill_ids??hero.skill_name.split('/').map((name,i)=>`${hero.id}:intrinsic:${i}:${name}`))],personal_lord_skill_ids:[...(hero.personal_lord_skill_ids??[])],complete:true});
const commandId=(kind,actor,event)=>JSON.stringify(['general-skill',kind,actor,event]);
const sameTemplate=(a,b)=>b&&Object.keys(a).length===Object.keys(b).length&&Object.entries(a).every(([key,value])=>Array.isArray(value)?Array.isArray(b[key])&&JSON.stringify(value)===JSON.stringify(b[key]):b[key]===value);

/** The optional catalog is dependency injection for isolated tests / trusted
 * engine composition only. Never source it from game state, UI or a save. */
export function create_general_skill_runtime_methods({heroes=HEROES}={}){
  const byId=new Map(heroes.map(h=>[h.id,h]));
  if(byId.size!==heroes.length)fail('duplicate trusted hero ID');
  const templates=heroes.map(manifest),wangyun=templates.find(t=>t.hero_id===WANGYUN_LIFECYCLE_ID);
  if(wangyun)templates.push(...wangyun_form_templates(wangyun));
  const skillIds=new Set(templates.flatMap(t=>t.skill_ids));
  for(const hero of heroes)for(const key of ['granted_skill_ids','acquired_skill_ids','complete_skill_ids','all_source_skill_ids'])
    for(const id of hero[key]??[])skillIds.add(id);
  for(const [source,r] of Object.entries(AWAKEN))if(skillIds.has(source))skillIds.add(r.skill_id);
  const skills=[...skillIds].map(skill_id=>({skill_id,provider:'general',cleanup_pile_ids:skill_id==='sgs.tuntian'?['sgs.tuntian.fields']:skill_id==='sgs.jieyue'?['sgs.jieyue.cards']:[]}));
  const enabledAwakenings=Object.entries(AWAKEN).filter(([source])=>skillIds.has(source));
  const catalog={game_id:BASE_GAME_ID,templates,skills,
    grants:enabledAwakenings.map(([source_skill_id,r])=>({grant_id:r.grant_id,source_skill_id,skill_id:r.skill_id,self_only:true,once_per_binding:true,requires_awakening:source_skill_id})),
    max_hp_rules:enabledAwakenings.map(([source_skill_id,r])=>({rule_id:r.rule_id,source_skill_id,delta:-1,awakening_id:source_skill_id,once_per_binding:true})),
    template_rules:[...(byId.has(HUA)?[{rule_id:'lifecycle.yizhuang',source_skill_id:'yxs.yizhuang',from_template_ids:templates.map(t=>t.template_id),to_template_ids:templates.map(t=>t.template_id)}]:[]),
      ...(wangyun?WANGYUN_EVOLUTIONS.map(e=>({rule_id:`lifecycle.${e.evolution_id}`,source_skill_id:e.source_skill_id,from_template_ids:[e.from_template_id],to_template_ids:[e.to_template_id]})):[])],
    removal_rules:skillIds.has('sgs.duanchang')?[{rule_id:'sgs.duanchang.remove-all',source_skill_id:'sgs.duanchang'}]:[]};
  const cached=new WeakMap(),jobs=new WeakMap(),effectJobs=new WeakMap(),capturedCards=new WeakMap(),previewOwners=new WeakMap();
  function players(g){if(typeof g.all_players!=='function'||typeof g.player_id!=='function')fail('host needs stable actor identities');return g.all_players().filter(Boolean);}
  function playerId(g,a){if(!players(g).includes(a))fail('actor does not belong to this match');return text(g.player_id(a),'actor ID');}
  function readActor(g,a){
    if(players(g).includes(a))return a;
    const origin=a&&typeof a==='object'?previewOwners.get(a):null;
    if(!origin||!players(g).includes(origin))fail('untrusted read-only actor preview');
    if(a.hero!==origin.hero||a.effective_rule_hero!==origin.effective_rule_hero||a.effective_skill_ids!==origin.effective_skill_ids)fail('stale read-only actor preview');
    return origin;
  }
  const readPlayerId=(g,a)=>playerId(g,readActor(g,a));
  function persist(g,api){g.general_skill_ledger_state=api.snapshot();}
  function sourceDescriptor(template_id){
    const t=templates.find(t=>t.template_id===template_id);if(!t)fail('unknown trusted template');
    const base=byId.get(t.hero_id);return base.id===WANGYUN_LIFECYCLE_ID?wangyun_rule_descriptor(base,t):base;
  }
  function project(g,a,api){
    const id=playerId(g,a),projection=api.rule_projection(id);
    a.effective_rule_hero=make_general_skill_descriptor(sourceDescriptor(projection.template_id),projection);
    // Many existing source modules prefer this property to rule_hero().
    a.effective_skill_ids=Object.freeze([...projection.skill_ids]);
    const publicState=api.public_state(id),owned=api.actor_state(id).instances;
    a.general_skill_public_state={...publicState,granted_skill_ids:[...new Set(owned.filter(i=>i.removed_by===null&&i.binding_id===projection.general_skill_binding_id&&i.ownership==='granted').map(i=>i.skill_id))]};
    return projection;
  }
  function validateRestoredEffects(g,api){
    const snapshot=api.snapshot(),effects=new Map(snapshot.effects.map(e=>[e.effect_id,e]));
    const record=(value,label)=>{
      if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))fail(`invalid ${label}`);
      for(const key of Reflect.ownKeys(value)){
        const d=Object.getOwnPropertyDescriptor(value,key);
        if(typeof key!=='string'||!d.enumerable||!('value' in d))fail(`invalid ${label} property`);
      }
      return value;
    };
    const completed=record(g.general_skill_effect_receipts??{},'effect receipts'),acknowledged=new Set(snapshot.acknowledged_effect_ids);
    if(Object.keys(completed).length!==acknowledged.size||Object.entries(completed).some(([id,value])=>value!==true||!acknowledged.has(id)))
      fail('effect receipts disagree with validated ledger acknowledgements');
    const cleanups=record(g.general_skill_cleanup_receipts??{},'cleanup receipts');
    for(const [id,value] of Object.entries(cleanups)){
      const effect=effects.get(id);record(value,'cleanup receipt');
      if(!effect||effect.kind!=='skill_pile_cleanup'||Object.keys(value).some(k=>!['actor_id','pile_id','card_ids'].includes(k))
        ||value.actor_id!==effect.actor_id||value.pile_id!==effect.payload.pile_id||!Array.isArray(value.card_ids)
        ||value.card_ids.length>8192||new Set(value.card_ids).size!==value.card_ids.length
        ||value.card_ids.some(x=>!(typeof x==='string'&&x.trim())&&!Number.isSafeInteger(x)))fail('invalid captured cleanup receipt');
    }
    if(snapshot.effects.some(e=>e.kind==='skill_pile_cleanup'&&!Object.hasOwn(cleanups,e.effect_id)))fail('missing captured cleanup receipt');
  }
  function apiFor(g){
    if(cached.has(g))return cached.get(g);
    const restored=g.general_skill_ledger_state!=null;
    const api=create_general_skill_ledger({...catalog,snapshot:g.general_skill_ledger_state??null});
    const current=players(g),ids=current.map(a=>playerId(g,a));
    if(new Set(ids).size!==ids.length)fail('duplicate match actor ID');
    if(restored){
      const saved=api.snapshot().actors;if(saved.length!==current.length||saved.some(a=>!ids.includes(a.actor_id)))fail('saved actor roster differs from match');
      for(const a of current)if(api.actor_state(playerId(g,a)).real_hero_id!==a.hero?.id)fail('saved selected hero differs from match');
      validateRestoredEffects(g,api);
    }else for(const a of current){
      const id=playerId(g,a),hero=byId.get(a.hero?.id);if(!hero)fail('selected hero is not in trusted catalog');
      api.register_actor({command_id:commandId('register',id,hero.id),actor_id:id,expected_revision:0,real_hero_id:hero.id,template_id:hero.id,
        current_hp:a.hp,mode_max_hp_bonus:0});
    }
    cached.set(g,api);persist(g,api);
    // New matches need no eager effective descriptor; restored ledgers must
    // reconstruct the ownership overlay before any hook can dispatch.
    if(restored)for(const a of current)project(g,a,api);
    return api;
  }
  function oldReceipt(api,id,expected){
    const r=api.command_receipt(id);if(!r)return null;
    for(const [key,value] of Object.entries(expected))if(r.request[key]!==value)fail('conflicting repeated runtime command');
    return r;
  }
  function execute(g,a,kind,event,fields){
    const api=apiFor(g),id=playerId(g,a),command_id=commandId(kind,id,event),expected={kind,actor_id:id,...fields};
    // current_hp belongs to the original command. A retry must not heal/clamp
    // again just because intervening damage changed the live actor's HP.
    if(kind==='change_max_hp'||kind==='update_hp')delete expected.current_hp;
    const old=oldReceipt(api,command_id,expected);if(old)return {api,receipt:old,replayed:true};
    const receipt=api[kind]({command_id,actor_id:id,expected_revision:api.actor_state(id).revision,...fields});
    persist(g,api);return {api,receipt,replayed:false};
  }
  function withJob(g,id,signature,work){
    let map=jobs.get(g);if(!map)jobs.set(g,map=new Map());const running=map.get(id);
    if(running){if(running.signature!==signature)fail('conflicting in-flight runtime command');return running.promise;}
    const promise=Promise.resolve().then(work).finally(()=>map.delete(id));map.set(id,{signature,promise});return promise;
  }
  function cardId(g,card){
    const id=g.card_history_material_id?.(card)??card?.physical_id??card?.physicalCardId??card?.derived_identity;
    if(typeof id!=='string'&&!Number.isSafeInteger(id))fail('cleanup card lacks stable physical identity');return id;
  }
  function captureCleanup(g,a,receipt){
    const api=apiFor(g);let refs=capturedCards.get(g);if(!refs)capturedCards.set(g,refs=new Map());
    g.general_skill_cleanup_receipts??={};
    for(const effect of api.pending_effects().filter(e=>e.command_id===receipt.command_id&&e.kind==='skill_pile_cleanup')){
      const field=PILE_FIELDS[effect.payload.pile_id];if(!field)fail('unknown skill pile cleanup');
      if(g.general_skill_cleanup_receipts[effect.effect_id])continue;
      const cards=[...(a[field]??[])];refs.set(effect.effect_id,cards);
      g.general_skill_cleanup_receipts[effect.effect_id]={actor_id:playerId(g,a),pile_id:effect.payload.pile_id,card_ids:cards.map(c=>cardId(g,c))};
    }
  }
  function cleanupCards(g,a,e){
    const cachedRefs=capturedCards.get(g)?.get(e.effect_id);if(cachedRefs)return cachedRefs;
    const saved=g.general_skill_cleanup_receipts?.[e.effect_id];
    if(!saved||saved.actor_id!==e.actor_id||saved.pile_id!==e.payload.pile_id||!Array.isArray(saved.card_ids))fail('pending cleanup requires original captured cards / input-journal replay');
    const field=PILE_FIELDS[e.payload.pile_id];if(!field)fail('unknown skill pile cleanup');
    const cards=a[field]??[];
    return saved.card_ids.map(id=>cards.find(c=>cardId(g,c)===id)).filter(Boolean);
  }
  async function drain(g,{command_id=null}={}){
    const api=apiFor(g);let active=effectJobs.get(g);if(!active)effectJobs.set(g,active=new Map());
    for(const e of api.pending_effects().filter(e=>command_id===null||e.command_id===command_id)){
      if(active.has(e.effect_id))continue; // A nested card-loss continuation must not await itself.
      const a=players(g).find(a=>playerId(g,a)===e.actor_id);if(!a)fail('effect actor no longer exists');
      g.general_skill_effect_receipts??={};
      if(g.general_skill_effect_receipts[e.effect_id]===true){api.acknowledge_effect(e.effect_id);persist(g,api);continue;}
      if(e.kind==='max_hp_changed'){
        // No await or game callback separates logical commit and the clamp.
        // Even a recovered pending effect must never heal intervening damage.
        a.hp=Math.min(a.hp,e.payload.max_hp);g.general_skill_effect_receipts[e.effect_id]=true;
        api.acknowledge_effect(e.effect_id);persist(g,api);continue;
      }
      const work=Promise.resolve().then(async()=>{
        if(e.kind==='general_skill_lost'){
          if(typeof g.on_general_skill_lost!=='function')fail('host must handle general_skill_lost continuous-state cleanup');
          await g.on_general_skill_lost(a,{...e.payload,event_id:e.effect_id,effect_id:e.effect_id,command_id:e.command_id});
        }else if(e.kind==='skill_pile_cleanup'){
          const field=PILE_FIELDS[e.payload.pile_id],cards=cleanupCards(g,a,e);
          if(e.payload.pile_id==='sgs.tuntian.fields'){
            if(typeof g.clear_mountain_fields!=='function')fail('host must handle physical field cleanup');
            await g.clear_mountain_fields(a,{cards,event_id:e.effect_id,effect_id:e.effect_id,reason:'失去屯田：弃置原有田'});
          }else if(e.payload.pile_id==='sgs.jieyue.cards'){
            if(typeof g.sgs_move_jieyue_pile!=='function')fail('host must handle physical Jieyue cleanup');
            if(cards.length)await g.sgs_move_jieyue_pile(a,cards,{to:'discard',move_id:`skill-pile-cleanup:${e.effect_id}`,event_id:e.effect_id,reason:'失去节钺：弃置原有节钺牌'});
          }else fail('unknown skill pile cleanup');
          if(cards.some(c=>(a[field]??[]).includes(c)))fail('skill pile cleanup did not move every captured card');
        }else if(e.kind==='general_skill_acquired'){
          await g.on_general_skill_acquired?.(a,{...e.payload,event_id:e.effect_id,effect_id:e.effect_id});
        }else if(e.kind==='invalidate_skill_prompt'){
          await g.invalidate_general_skill_prompt?.(a,{...e.payload,event_id:e.effect_id,effect_id:e.effect_id});
        }else if(e.kind!=='template_overlay_changed')fail('unknown ledger effect');
        g.general_skill_effect_receipts[e.effect_id]=true;api.acknowledge_effect(e.effect_id);persist(g,api);
      });
      active.set(e.effect_id,work);try{await work;}finally{active.delete(e.effect_id);}
    }
  }
  function continuation(api,aId,event_id,source_skill,suffix){
    const base=event_id.endsWith(suffix)?event_id.slice(0,-suffix.length):null;
    if(!base)return {event_id};
    const row=api.actor_state(aId).resolutions.find(r=>r.resolution_id===base);
    if(!row)return {event_id};
    if(row.skill_id!==source_skill)fail('awakening receipt belongs to another skill');
    return {event_id:base,resolution_id:base};
  }
  const methods={
    initialize_general_skill_ledger(){return apiFor(this);},
    has_general_skill(actor,skill_id){const id=readPlayerId(this,actor);return apiFor(this).has_skill(id,skill_id);},
    general_skill_binding_id(actor,_skill_id){const id=readPlayerId(this,actor);return apiFor(this).binding_id(id);},
    general_skill_preview(origin,preview){
      const real=readActor(this,origin);
      if(!preview||typeof preview!=='object'||players(this).includes(preview)||preview.hero!==real.hero
        ||preview.effective_rule_hero!==real.effective_rule_hero||preview.effective_skill_ids!==real.effective_skill_ids)fail('invalid read-only actor preview');
      previewOwners.set(preview,real);preview._distance_origin=real;return preview;
    },
    effective_max_hp(actor){
      // Legacy previews and isolated skill fixtures may not have a catalogued
      // match yet. A max-HP read must not register actors or grant ownership.
      if(!cached.has(this)&&this.general_skill_ledger_state==null){
        const hp=(actor?.effective_rule_hero??actor?.hero)?.max_hp;
        if(!Number.isSafeInteger(hp)||hp<1)fail('invalid legacy maximum HP');return hp;
      }
      return apiFor(this).effective_max_hp(readPlayerId(this,actor));
    },
    general_skill_public_state(actor){const id=playerId(this,actor),api=apiFor(this),state=api.public_state(id),owned=api.actor_state(id).instances,binding=api.binding_id(id);return copy({...state,granted_skill_ids:[...new Set(owned.filter(i=>i.removed_by===null&&i.binding_id===binding&&i.ownership==='granted').map(i=>i.skill_id))]});},
    drain_general_skill_effects(options={}){return drain(this,options);},
    commit_general_skill_resolution(actor,options={}){
      allowed(options,['event_id','source_skill']);const {event_id,source_skill}=options;text(event_id,'awakening event ID');
      const rule=AWAKEN[source_skill];if(!rule)fail('unknown awakening source');
      const id=playerId(this,actor),api=apiFor(this),commitId=commandId('commit_skill',id,event_id);
      const old=oldReceipt(api,commitId,{kind:'commit_skill',actor_id:id,resolution_id:event_id});
      if(old){if(api.actor_state(id).resolutions.find(r=>r.resolution_id===event_id)?.skill_id!==source_skill)fail('conflicting awakening source');return old;}
      execute(this,actor,'prepare_skill',event_id,{skill_id:source_skill,resolution_id:event_id,context:{source_skill,binding_id:api.binding_id(id)},
        continuations:[{kind:'change_max_hp',rule_id:rule.rule_id,actor_id:id},{kind:'acquire_skill',rule_id:rule.grant_id,actor_id:id}]});
      return execute(this,actor,'commit_skill',event_id,{resolution_id:event_id}).receipt;
    },
    change_max_hp(actor,delta,options={}){
      allowed(options,['event_id','source_skill','minimum']);const {event_id,source_skill,minimum}=options;text(event_id,'max HP event ID');
      if(delta!==-1||minimum!==1||!AWAKEN[source_skill])fail('only audited mountain max HP -1 / minimum 1 is supported');
      const g=this,id=playerId(g,actor),signature=JSON.stringify([id,delta,source_skill,minimum]);
      return withJob(g,commandId('change_max_hp',id,event_id),signature,async()=>{
        const api=apiFor(g),fields={rule_id:AWAKEN[source_skill].rule_id,current_hp:actor.hp,...continuation(api,id,event_id,source_skill,':maxhp')};
        const result=execute(g,actor,'change_max_hp',event_id,fields);project(g,actor,api);await drain(g,{command_id:result.receipt.command_id});
        g.guard_state_changed?.();return copy(result.receipt);
      });
    },
    acquire_general_skill(actor,skill_id,options={}){
      allowed(options,['event_id','source_skill']);const {event_id,source_skill}=options;text(event_id,'grant event ID');
      const rule=AWAKEN[source_skill];if(!rule||rule.skill_id!==skill_id)fail('unknown source/grant pair');
      const g=this,id=playerId(g,actor),signature=JSON.stringify([id,skill_id,source_skill]);
      return withJob(g,commandId('acquire_skill',id,event_id),signature,async()=>{
        const api=apiFor(g),next=continuation(api,id,event_id,source_skill,':grant');
        const result=execute(g,actor,'acquire_skill',event_id,{grant_id:rule.grant_id,source_actor_id:id,...next});
        project(g,actor,api);await drain(g,{command_id:result.receipt.command_id});
        if(next.resolution_id&&api.actor_state(id).resolutions.find(r=>r.resolution_id===next.resolution_id)?.status==='committed')
          execute(g,actor,'finish_skill',next.resolution_id,{resolution_id:next.resolution_id});
        g.guard_state_changed?.();return copy(result.receipt);
      });
    },
    remove_general_skills(actor,options={}){
      allowed(options,['event_id','source_skill','source']);const {event_id,source_skill,source}=options;text(event_id,'removal event ID');
      if(source_skill!=='sgs.duanchang')fail('unknown general skill removal source');
      const g=this,id=playerId(g,actor),sourceId=playerId(g,source),signature=JSON.stringify([id,sourceId,source_skill]);
      return withJob(g,commandId('remove_all',id,event_id),signature,async()=>{
        const result=execute(g,actor,'remove_all',event_id,{rule_id:'sgs.duanchang.remove-all',source_actor_id:sourceId,event_id});
        if(!result.replayed)captureCleanup(g,actor,result.receipt);
        project(g,actor,result.api);await drain(g,{command_id:result.receipt.command_id});
        g.guard_state_changed?.();return copy(result.receipt);
      });
    },
    async sync_general_skill_template(actor,options={}){
      allowed(options,['event_id','transition_id']);const transition_id=text(options.transition_id??options.event_id,'lifecycle transition ID'),event_id=options.event_id??transition_id;
      const g=this,id=playerId(g,actor),api=apiFor(g);
      if(typeof g.initialize_hero_lifecycle!=='function')fail('trusted lifecycle adapter is required');
      const lifecycle=g.initialize_hero_lifecycle(),r=lifecycle.transition_receipt(transition_id);
      if(!r||r.status!=='committed'||r.request.actor_id!==id)fail('missing committed actor lifecycle transition');
      const t=r.target_template,known=templates.find(x=>x.template_id===t?.template_id);
      if(!known||!sameTemplate(known,t))fail('lifecycle target is not a complete trusted template');
      const installed=actor.hero_form?.template_id??actor.effective_rule_hero?.lifecycle_template_id??actor.effective_rule_hero?.id;
      if(installed!==known.template_id)fail('lifecycle target does not match the installed source form');
      const rule_id=r.request.evolution_id?`lifecycle.${r.request.evolution_id}`:'lifecycle.yizhuang';
      if(r.request.evolution_id&&!WANGYUN_EVOLUTIONS.some(e=>e.evolution_id===r.request.evolution_id))fail('unknown own evolution');
      if(!r.request.evolution_id&&typeof r.request.death_id!=='string')fail('copy transition lacks its real-death receipt');
      // Keep current live HP supplied by the authoritative lifecycle, but never
      // import its donor's transient max-HP delta or spent skill state.
      const old=api.command_receipt(commandId('install_template',id,event_id));
      if(!old&&actor.hp<=api.effective_max_hp(id))execute(g,actor,'update_hp',`${event_id}:hp`,{current_hp:actor.hp});
      const result=execute(g,actor,'install_template',event_id,{rule_id,template_id:known.template_id,event_id:transition_id});
      project(g,actor,api);actor.hp=Math.min(actor.hp,api.effective_max_hp(id));await drain(g,{command_id:result.receipt.command_id});
      g.guard_state_changed?.();return copy(result.receipt);
    },
  };
  return Object.freeze(methods);
}
export const generalSkillRuntimeMethods=create_general_skill_runtime_methods();
