import test from 'node:test';
import assert from 'node:assert/strict';
import {create_hero_lifecycle,HERO_LIFECYCLE_CONTRACT,HERO_LIFECYCLE_CURRENT_CLIENT_RULES_VERIFIED} from '../hero-lifecycle.js';

const clone = x => JSON.parse(JSON.stringify(x));
const templates = [
  {template_id:'mulan.v1',hero_id:'yxs.adapted.base.hero.hua-mu-lan',display_name:'花木兰',max_hp:3,gender:'female',
    skill_ids:['yxs.mili','yxs.yizhuang'],personal_lord_skill_ids:[],complete:true},
  {template_id:'male.v1',hero_id:'test.hero.male',display_name:'同名',max_hp:4,gender:'male',
    skill_ids:['test.active','test.response','test.passive','test.limited','test.lord'],personal_lord_skill_ids:['test.lord'],complete:true},
  {template_id:'small.v1',hero_id:'test.hero.small',display_name:'同名',max_hp:2,gender:'male',
    skill_ids:['test.active','test.response'],personal_lord_skill_ids:[],complete:true},
  {template_id:'unused.v1',hero_id:'test.hero.unused',display_name:'未出场',max_hp:9,gender:'male',
    skill_ids:['test.passive'],personal_lord_skill_ids:[],complete:true},
];
function configuration(overrides = {}) {
  const calls = [], skills = [...new Set(templates.flatMap(t => t.skill_ids)), 'test.borrowed'];
  const skill_lifecycles = skills.map(skill_id => ({skill_id,version:'1',
    on_lost(context) {calls.push({event:'skill_lost',skill_id,context});return {effects:[{kind:'end_owned_effects',payload:{owner:context.actor_id,skill_id}}]};},
    on_acquired(context) {calls.push({event:'skill_acquired',skill_id,context});return {state:{used:false,acquired_by:context.actor_id},effects:[]};},
    ...overrides[skill_id],
  }));
  return {config:{game_id:'match-1',templates:clone(templates),skill_lifecycles},calls};
}
function register(k, id, template_id='mulan.v1', extras={}) {
  const t = templates.find(t => t.template_id === template_id);
  return k.register_player({player_id:id,real_hero_id:t.hero_id,template_id,current_hp:t.max_hp,
    skill_states:t.skill_ids.map(skill_id => ({skill_id,state:{used:true,owner:id,marks:7}})),...extras});
}
function fixture(overrides={}) {
  const {config,calls}=configuration(overrides), k=create_hero_lifecycle(config);
  register(k,'p1');register(k,'p2','male.v1');register(k,'p3','small.v1');
  return {k,config,calls};
}
function kill(k,id='p2',death_id=`death:${id}`) {k.update_vitals(id,{current_hp:0});return k.finalize_death(id,death_id);}
const request = (k, extras={}) => ({transition_id:'change:1',actor_id:'p1',death_id:'death:p2',expected_revision:k.player_state('p1').revision,...extras});
const replace = (k, extras={}) => k.replace_from_death(request(k,extras));

test('the contract is explicitly proposed and does not claim current-client verification',()=>{
  const {k}=fixture();assert.match(HERO_LIFECYCLE_CONTRACT,/proposed/);
  assert.equal(HERO_LIFECYCLE_CURRENT_CLIENT_RULES_VERIFIED,false);
  assert.equal(k.snapshot().current_client_rules_verified,false);
});

test('dying, living and unplayed roster entries cannot become archive candidates',()=>{
  const {k}=fixture();assert.deepEqual(k.dead_candidates(),[]);
  assert.throws(()=>k.finalize_death('p2','d1'),/finalized dying/);
  k.update_vitals('p2',{current_hp:-2});assert.equal(k.player_state('p2').life_status,'dying');
  assert.deepEqual(k.dead_candidates(),[]);
  const d=k.finalize_death('p2','d1');assert.deepEqual(k.dead_candidates(),[d]);
  assert.equal(d.effective_template.template_id,'male.v1');
  assert.equal(k.dead_candidates().some(d=>d.effective_template.template_id==='unused.v1'),false);
});

test('revival permanently invalidates the old death; a later real death has its own receipt',()=>{
  const {k}=fixture();const d=kill(k);k.revive_player('p2',{revival_id:'revive:1',current_hp:1});
  assert.deepEqual(k.dead_candidates(),[]);
  assert.throws(()=>replace(k),/ineligible/);
  assert.equal(k.finalize_death('p2',d.death_id).invalidated_by,'revive:1');
  assert.equal(k.player_state('p2').life_status,'alive');
  kill(k,'p2','death:p2:again');assert.deepEqual(k.dead_candidates().map(d=>d.death_id),['death:p2:again']);
  assert.throws(()=>k.finalize_death('p3',d.death_id),/conflicting death/);
});

test('female finalized dead templates are archived but excluded from male candidates',()=>{
  const {k}=fixture();kill(k,'p1');assert.equal(k.snapshot().deaths.length,1);assert.deepEqual(k.dead_candidates(),[]);
});

test('same-name dead actors remain distinct candidates with their full snapshots',()=>{
  const {k}=fixture();kill(k);kill(k,'p3');
  assert.deepEqual(k.dead_candidates().map(d=>d.player_id),['p2','p3']);
  assert.deepEqual(k.dead_candidates().map(d=>d.effective_template.display_name),['同名','同名']);
});

test('all intrinsic active/response/passive/limited/personal-lord definitions transfer without donor state',async()=>{
  const {k,calls}=fixture();kill(k);const r=await replace(k), p=k.player_state('p1');
  assert.equal(r.status,'committed');assert.equal(p.real_hero_id,'yxs.adapted.base.hero.hua-mu-lan');
  assert.equal(p.player_id,'p1');assert.equal(p.effective_template.hero_id,'test.hero.male');
  assert.equal(p.effective_template.gender,'male');assert.equal(p.current_hp,3);assert.equal(p.effective_max_hp,4);
  assert.deepEqual(p.effective_template.skill_ids,templates[1].skill_ids);
  assert.deepEqual(p.effective_template.personal_lord_skill_ids,['test.lord']);
  assert.deepEqual(p.hero_skills.map(s=>s.skill_id),templates[1].skill_ids);
  for(const skill of p.hero_skills)assert.deepEqual(skill.state,{used:false,acquired_by:'p1'});
  assert.deepEqual(calls.map(c=>c.event),['skill_lost','skill_lost',...Array(5).fill('skill_acquired')]);
  assert.equal(calls.some(c=>['game_start','cards_moved','damage'].includes(c.event)),false);
  assert.equal(calls.some(c=>c.context.old_state?.owner==='p2'),false);
});

test('current HP clamps to new intrinsic HP plus own mode bonus, without a heal or donor bonus',async()=>{
  const {k}=fixture();k.update_vitals('p1',{current_hp:4,mode_max_hp_bonus:2});
  k.update_vitals('p3',{current_hp:5,mode_max_hp_bonus:3});kill(k,'p3');
  await replace(k,{death_id:'death:p3'});
  assert.equal(k.player_state('p1').effective_max_hp,4);assert.equal(k.player_state('p1').current_hp,4);
  const {k:low}=fixture();kill(low,'p3');await replace(low,{death_id:'death:p3'});
  assert.equal(low.player_state('p1').current_hp,2);assert.equal(low.player_state('p1').effective_max_hp,2);
  kill(low);await replace(low,{transition_id:'change:2'});
  assert.equal(low.player_state('p1').current_hp,2);assert.equal(low.player_state('p1').effective_max_hp,4);
});

test('non-cloning: donor marks/cards and actor history/faction/control never enter the lifecycle',async()=>{
  const {k}=fixture();const actor={id:'p1',hero:{id:templates[0].hero_id,faction:'臣'},controller:'human',team:'A',
    hand:[{id:'own-card'}],equipment:{id:'own-equip'},shared_history:{sha:3,uses:[{id:'u1'}]}};
  const donor={id:'p2',hero:{id:templates[1].hero_id,faction:'君'},controller:'ai',team:'B',hand:[{id:'donor-card'}],marks:{used:42}};
  const before=clone({actor,donor});kill(k);await replace(k);assert.deepEqual({actor,donor},before);
  const data=JSON.stringify(k.snapshot());assert.doesNotMatch(data,/donor-card|own-card|controller|faction|shared_history/);
  assert.notEqual(k.player_state('p1').hero_skills[0].state.owner,'p2');
});

test('all old hero-owned temporary and intrinsic skills are lost, including an overlapping new skill',async()=>{
  const {k,calls}=fixture();const rows=k.player_state('p1').hero_skills;
  rows.push({skill_id:'test.active',ownership:'temporary',state:{used:true,old_mark:1}});
  rows.push({skill_id:'test.borrowed',ownership:'temporary',state:{guard:'p3'}});
  k.sync_hero_skill_states('p1',rows);kill(k);await replace(k);
  assert.deepEqual(calls.filter(c=>c.event==='skill_lost').map(c=>c.skill_id),['yxs.mili','yxs.yizhuang','test.active','test.borrowed']);
  assert.equal(k.player_state('p1').hero_skills.some(s=>s.skill_id==='test.borrowed'),false);
  assert.deepEqual(k.player_state('p1').hero_skills.find(s=>s.skill_id==='test.active').state,{used:false,acquired_by:'p1'});
});

test('death after replacement records the current effective template, never the real hero or temporary skills',async()=>{
  const {k}=fixture();kill(k);await replace(k);
  const rows=k.player_state('p1').hero_skills;rows.push({skill_id:'test.borrowed',ownership:'temporary',state:{used:true}});
  k.sync_hero_skill_states('p1',rows);const d=kill(k,'p1');
  assert.equal(d.effective_template.hero_id,'test.hero.male');assert.equal(d.effective_template.gender,'male');
  assert.equal(d.effective_template.skill_ids.includes('test.borrowed'),false);
  assert.equal('hero_skills' in d,false);assert.equal('current_hp' in d,false);
});

test('completed duplicate receipts are stable, do not rerun callbacks, and reject changed targets/revisions',async()=>{
  const {k,calls}=fixture();kill(k);kill(k,'p3');const req=request(k), r=await k.replace_from_death(req), count=calls.length;
  assert.deepEqual(await k.replace_from_death(req),r);assert.equal(calls.length,count);
  assert.throws(()=>k.replace_from_death({...req,death_id:'death:p3'}),/conflicting/);
  assert.throws(()=>k.replace_from_death({...req,expected_revision:req.expected_revision+1}),/conflicting/);
  k.update_vitals('p1',{current_hp:1});k.revive_player('p2',{revival_id:'r',current_hp:1});
  assert.deepEqual(await k.replace_from_death(req),r);assert.equal(k.player_state('p1').current_hp,1);
});

test('an interrupted pure callback leaves form/HP/ownership untouched and resumes staged checkpoints after JSON restore',async()=>{
  let shouldFail=true,attempts=0;
  const {k,config,calls}=fixture({'test.response':{on_acquired(c){attempts++;if(shouldFail)throw Error('interrupt');return {state:{owner:c.actor_id},effects:[]};}}});
  kill(k);const before=k.player_state('p1'),req=request(k);
  await assert.rejects(k.replace_from_death(req),/interrupt/);
  assert.deepEqual(k.player_state('p1'),before);assert.deepEqual(k.pending_effects(),[]);
  assert.equal(k.transition_receipt(req.transition_id).status,'interrupted');
  const oldLosses=calls.filter(c=>c.event==='skill_lost').length;
  shouldFail=false;const restored=create_hero_lifecycle({...config,snapshot:clone(k.snapshot())});
  const done=await restored.replace_from_death(req);assert.equal(done.status,'committed');assert.equal(attempts,2);
  assert.equal(calls.filter(c=>c.event==='skill_lost').length,oldLosses);
  assert.equal(calls.filter(c=>c.skill_id==='test.active').length,1);
  assert.equal(restored.player_state('p1').effective_template.template_id,'male.v1');
});

test('concurrent same-receipt attempts share one staged run; conflicting attempts do not call callbacks',async()=>{
  let release,entered;const waiting=new Promise(resolve=>entered=resolve);let count=0;
  const {k}=fixture({'yxs.mili':{async on_lost(){count++;entered();await new Promise(resolve=>release=resolve);return {effects:[]};}}});
  kill(k);kill(k,'p3');const req=request(k), first=k.replace_from_death(req);await waiting;
  const same=k.replace_from_death(req);
  assert.throws(()=>k.replace_from_death({...req,death_id:'death:p3'}),/conflicting/);
  assert.throws(()=>k.replace_from_death({...req,transition_id:'change:other'}),/unfinished/);
  release();assert.deepEqual(await first,await same);assert.equal(count,1);
});

test('a staging snapshot can resume safely in a fresh runtime without installing any partial form',async()=>{
  let release,entered;const ready=new Promise(resolve=>entered=resolve);let pause=true;
  const {k,config}=fixture({'test.active':{async on_acquired(){if(pause){entered();await new Promise(resolve=>release=resolve);}return {state:{limited_available:true},effects:[]};}}});
  kill(k);const req=request(k), running=k.replace_from_death(req);await ready;
  const snap=clone(k.snapshot());assert.equal(snap.transitions[0].status,'staging');
  assert.equal(k.player_state('p1').effective_template.template_id,'mulan.v1');
  pause=false;const recovered=create_hero_lifecycle({...config,snapshot:snap});await recovered.replace_from_death(req);
  release();await running;assert.deepEqual(recovered.snapshot(),k.snapshot());
});

test('actor death or donor revival during a callback aborts before form change or effect publication',async()=>{
  for(const change of ['actor','donor']){
    let release,entered;const ready=new Promise(resolve=>entered=resolve);
    const {k}=fixture({'yxs.mili':{async on_lost(){entered();await new Promise(resolve=>release=resolve);return {effects:[{kind:'clear_guard',payload:{}}]};}}});
    kill(k);const req=request(k), running=k.replace_from_death(req);await ready;
    if(change==='actor')kill(k,'p1');else k.revive_player('p2',{revival_id:'revive',current_hp:1});
    release();await assert.rejects(running,/stale/);assert.equal(k.transition_receipt(req.transition_id).status,'aborted');
    assert.equal(k.player_state('p1').effective_template.template_id,'mulan.v1');assert.deepEqual(k.pending_effects(),[]);
    assert.throws(()=>k.replace_from_death(req),/aborted/);
  }
});

test('callback input is detached and deeply frozen; non-JSON callback state cannot commit',async()=>{
  const {k}=fixture({'test.active':{on_acquired(c){assert.equal(Object.isFrozen(c.new_template.skill_ids),true);return {state:{bad:new Set()},effects:[]};}}});
  kill(k);const before=k.player_state('p1');await assert.rejects(replace(k),/JSON object/);
  assert.deepEqual(k.player_state('p1'),before);assert.deepEqual(k.pending_effects(),[]);
});

test('effect outbox appears only after commit, uses deterministic IDs, and acknowledgements survive restore',async()=>{
  const {k,config}=fixture();kill(k);await replace(k);const effects=k.pending_effects();
  assert.equal(effects.length,2);assert.equal(new Set(effects.map(e=>e.effect_id)).size,2);
  assert.ok(effects.every(e=>e.event==='skill_lost'&&e.actor_id==='p1'));
  k.acknowledge_effect(effects[0].effect_id);k.acknowledge_effect(effects[0].effect_id);
  const restored=create_hero_lifecycle({...config,snapshot:clone(k.snapshot())});assert.equal(restored.pending_effects().length,1);
  assert.throws(()=>restored.acknowledge_effect('not-an-effect'),/not committed/);
});

test('pure DTO queries allocate copies, never initialize/mutate state, and never execute callbacks',()=>{
  const {k,calls}=fixture();kill(k);const before=k.snapshot();
  for(let i=0;i<10;i++){
    const p=k.player_state('p1'),v=k.effective_form('p1'),d=k.dead_candidates(),s=k.snapshot();
    p.hero_skills[0].state.used=false;v.template.skill_ids.pop();d[0].effective_template.skill_ids=[];s.players=[];
    assert.equal(k.transition_receipt('unknown'),null);assert.deepEqual(k.pending_effects(),[]);
  }
  assert.deepEqual(k.snapshot(),before);assert.equal(calls.length,0);
});

test('malformed/partial manifests, missing implementations and missing callbacks fail closed',()=>{
  for(const mutate of [
    t=>delete t.skill_ids,t=>t.skill_ids=[],t=>t.skill_ids.push(t.skill_ids[0]),t=>t.max_hp=NaN,
    t=>t.gender='unknown',t=>t.complete=false,t=>delete t.personal_lord_skill_ids,t=>t.skill_ids.push('unimplemented'),
    t=>t.personal_lord_skill_ids.push('omitted'),t=>t.faction='君',t=>t.controller='ai',t=>t.hand=[],
  ]){
    const {config}=configuration();mutate(config.templates[0]);assert.throws(()=>create_hero_lifecycle(config));
  }
  const {config}=configuration();delete config.skill_lifecycles[0].on_acquired;
  assert.throws(()=>create_hero_lifecycle(config),/missing lifecycle/);
});

test('partial all-skill snapshots and incompatible lifecycle versions are rejected on restore',()=>{
  const {k,config}=fixture();kill(k);const snapshot=k.snapshot();
  snapshot.deaths[0].effective_template.skill_ids.pop();
  assert.throws(()=>create_hero_lifecycle({...config,snapshot}),/lord skill omitted|partial/);
  const changed={...config,skill_lifecycles:config.skill_lifecycles.map(s=>({...s,version:'2'}))};
  assert.throws(()=>create_hero_lifecycle({...changed,snapshot:k.snapshot()}),/manifest/);
});

test('bad transition and skill-state inputs fail before creating receipts or changing identity',()=>{
  const {k}=fixture();kill(k);const before=k.snapshot();
  for(const bad of [{...request(k),death_id:'unused.v1'},{...request(k),expected_revision:100},
    {...request(k),actor_id:'p2'},{...request(k),transition_id:''},{...request(k),extra:true}])assert.throws(()=>k.replace_from_death(bad));
  assert.throws(()=>k.sync_hero_skill_states('p1',[]),/omitted/);
  assert.throws(()=>k.update_vitals('p1',{current_hp:-0}),/invalid current HP/);
  assert.deepEqual(k.snapshot(),before);
  k.update_vitals('p1',{current_hp:0});assert.throws(()=>replace(k),/ineligible/);
});

test('registration rejects lossy JSON, unexpected donor properties, duplicate players and omitted skill state',()=>{
  const {k}=fixture();const before=k.snapshot();
  assert.throws(()=>register(k,'p1'),/already registered/);
  assert.throws(()=>register(k,'new','male.v1',{skill_states:[]}),/omitted/);
  assert.throws(()=>register(k,'new','male.v1',{controller:'donor'}),/unexpected/);
  for(const value of [new Map(),new Set(),undefined,Infinity,()=>{},Symbol('s')])assert.throws(()=>register(k,'new','male.v1',{
    skill_states:templates[1].skill_ids.map(skill_id=>({skill_id,state:{value}})),
  }));
  const state={};state.self=state;assert.throws(()=>register(k,'new','male.v1',{skill_states:[{skill_id:'test.active',state}]}));
  assert.deepEqual(k.snapshot(),before);
});

test('a lost skill receives current explicitly synchronized state, never an initialization-time stale mark',async()=>{
  const {k,calls}=fixture();const rows=k.player_state('p1').hero_skills;rows[0].state={marks:99};
  k.sync_hero_skill_states('p1',rows);kill(k);await replace(k);
  assert.deepEqual(calls[0].context.old_state,{marks:99});
});

test('request and catalog mutation after start cannot alter the target or operation receipt',async()=>{
  const {k,config}=fixture();kill(k);const req=request(k),promise=k.replace_from_death(req);
  req.death_id='forged';config.templates[1].skill_ids=[];const result=await promise;
  assert.equal(result.request.death_id,'death:p2');assert.deepEqual(result.target_template.skill_ids,templates[1].skill_ids);
});

test('invalid resulting HP or overflowing revision is rejected before journaling or callbacks',()=>{
  const {k,config,calls}=fixture();kill(k,'p3');
  k.update_vitals('p1',{current_hp:1,mode_max_hp_bonus:-2});const before=k.snapshot();
  assert.throws(()=>replace(k,{death_id:'death:p3'}),/new effective max HP/);
  assert.deepEqual(k.snapshot(),before);assert.equal(calls.length,0);
  const snapshot=k.snapshot();snapshot.players[0].revision=Number.MAX_SAFE_INTEGER;
  const restored=create_hero_lifecycle({...config,snapshot});kill(restored);const maxBefore=restored.snapshot();
  assert.throws(()=>replace(restored),/next player revision/);assert.deepEqual(restored.snapshot(),maxBefore);
});

test('a partial or changed staged callback plan cannot resume as a successful copy',async()=>{
  const {k,config}=fixture({'test.response':{on_acquired(){throw Error('paused');}}});
  kill(k);await assert.rejects(replace(k),/paused/);
  const snapshot=k.snapshot();snapshot.transitions[0].operations.pop();
  assert.throws(()=>create_hero_lifecycle({...config,snapshot}),/partial callback plan/);
});
