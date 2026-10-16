import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES,hero_by_id,Player} from '../models.js';
import {generalSkillRuntimeMethods} from '../general-skill-runtime.js';
import {get_general_skill_descriptor} from '../general-skill-descriptor.js';
import {GENERAL_SKILL_SUPPRESSED_RULE_ID} from '../general-skill-ledger.js';
import {create_hero_lifecycle} from '../hero-lifecycle.js';
import {WANGYUN_LIFECYCLE_ID,WANGYUN_FORM_IDS,WANGYUN_EVOLUTIONS,wangyun_form_templates,wangyun_rule_descriptor} from '../wangyun-lifecycle.js';
const DA='sgs.adapted.base.hero.deng-ai',JW='sgs.adapted.base.hero.jiang-wei',CW='sgs.adapted.base.hero.cai-wen-ji',HUA='yxs.adapted.base.hero.hua-mu-lan';
const clone=x=>JSON.parse(JSON.stringify(x));
const manifest=h=>({template_id:h.id,hero_id:h.id,display_name:h.display_name??h.name,max_hp:h.max_hp,gender:h.gender,
  skill_ids:h.skill_ids??h.skill_name.split('/').map((n,i)=>`${h.id}:intrinsic:${i}:${n}`),personal_lord_skill_ids:h.personal_lord_skill_ids??[],complete:true});
function host(ids=[DA,CW,JW,HUA]){
  const actors=ids.map((id,index)=>Object.assign(new Player(`seat-${index+1}`,hero_by_id(id)),{pid:`p${index+1}`}));
  const lost=[],cleanup=[],discard=[];
  const g=Object.assign({actors,lost,cleanup,discard,all_players(){return this.actors;},player_id(a){return a.pid;},
    card_history_material_id(c){return c.physical_id;},guard_state_changed(){this.changed=(this.changed??0)+1;},
    on_general_skill_lost(a,payload){lost.push(payload);a.luoyi_active=false;},
    clear_mountain_fields(a,{cards,event_id}){cleanup.push({cards:[...cards],event_id});a.sgs_mountain_fields=(a.sgs_mountain_fields??[]).filter(c=>!cards.includes(c));discard.push(...cards.filter(c=>!discard.includes(c)));return true;},
  },generalSkillRuntimeMethods);
  return g;
}
function lifecycleHost(g){
  const templates=HEROES.map(manifest),wy=templates.find(t=>t.hero_id===WANGYUN_LIFECYCLE_ID);if(wy)templates.push(...wangyun_form_templates(wy));
  const skills=[...new Set(templates.flatMap(t=>t.skill_ids))].map(skill_id=>({skill_id,version:'isolated-runtime-test',on_lost:()=>({effects:[]}),on_acquired:()=>({state:{},effects:[]})}));
  const api=create_hero_lifecycle({game_id:'isolated-lifecycle',templates,skill_lifecycles:skills,evolutions:wy?WANGYUN_EVOLUTIONS:[]});
  for(const a of g.actors)api.register_player({player_id:a.pid,real_hero_id:a.hero.id,template_id:a.hero.id,current_hp:a.hp,mode_max_hp_bonus:0,
    skill_states:manifest(a.hero).skill_ids.map(skill_id=>({skill_id,state:{}})),temporary_skills:[]});
  g.initialize_hero_lifecycle=()=>api;return api;
}
function installRaw(a,form){const source=hero_by_id(form.template.hero_id);a.effective_rule_hero=wangyun_rule_descriptor(source,form.template);a.hero_form={template_id:form.template.template_id};a.hp=form.current_hp;}
const remove=(g,target,source,event='duanchang:death')=>g.remove_general_skills(target,{event_id:event,source_skill:'sgs.duanchang',source});

// Isolated adapter tests intentionally use a tiny host. Parent Game's resolver,
// scheduler, DTO and full-session wiring are tested separately by integration.
test('runtime registers complete HEROES manifests but no unearned awakening grants',()=>{
  const g=host(),[deng,cai,jiang]=g.actors;g.initialize_general_skill_ledger();
  assert.equal(g.has_general_skill(deng,'sgs.tuntian'),true);assert.equal(g.has_general_skill(deng,'sgs.jixi'),false);
  assert.equal(g.has_general_skill(jiang,'sgs.guanxing'),false);assert.equal(g.effective_max_hp(deng),4);
  cai.dead=true;cai.hp=0;assert.equal(g.has_general_skill(cai,'sgs.duanchang'),true);
  assert.equal(g.general_skill_ledger_state.manifest.templates.find(t=>t.hero_id===DA).skill_ids.length,2);
  assert.equal(g.general_skill_ledger_state.manifest.skills.some(s=>s.skill_id==='sgs.jixi'),true);
});

test('runtime awakening commits once, clamps HP and grants without replay healing',async()=>{
  const g=host(),deng=g.actors[0],binding=g.general_skill_binding_id(deng,'sgs.zaoxian');
  const committed=g.commit_general_skill_resolution(deng,{event_id:'zaoxian:own',source_skill:'sgs.zaoxian'});
  assert.deepEqual(g.commit_general_skill_resolution(deng,{event_id:'zaoxian:own',source_skill:'sgs.zaoxian'}),committed);
  assert.throws(()=>g.commit_general_skill_resolution(deng,{event_id:'zaoxian:own',source_skill:'sgs.zhiji'}),/conflicting awakening/);
  const maxOptions={event_id:'zaoxian:own:maxhp',source_skill:'sgs.zaoxian',minimum:1};
  const [r1,r2]=await Promise.all([g.change_max_hp(deng,-1,maxOptions),g.change_max_hp(deng,-1,maxOptions)]);assert.deepEqual(r1,r2);
  assert.equal(deng.hp,3);assert.equal(g.effective_max_hp(deng),3);assert.equal(deng.effective_rule_hero.max_hp,3);
  const grantOptions={event_id:'zaoxian:own:grant',source_skill:'sgs.zaoxian'};const gained=await g.acquire_general_skill(deng,'sgs.jixi',grantOptions);
  assert.equal(g.has_general_skill(deng,'sgs.jixi'),true);assert.deepEqual(get_general_skill_descriptor(deng.effective_rule_hero).overlay_skill_ids,['sgs.jixi']);
  deng.hp=1;assert.deepEqual(await g.change_max_hp(deng,-1,maxOptions),r1);assert.equal(deng.hp,1);
  assert.deepEqual(await g.acquire_general_skill(deng,'sgs.jixi',grantOptions),gained);assert.equal(deng.hp,1);
  assert.equal(g.general_skill_binding_id(deng,'sgs.zaoxian'),binding);
  assert.equal(g.initialize_general_skill_ledger().pending_effects().length,0);
});

test('runtime removal preserves equipment, real identity, spent counters, maxHP, and captures old fields before awaits',async()=>{
  const g=host(),[deng,cai]=g.actors,old=[{physical_id:'f1'},{physical_id:'f2'}],later={physical_id:'new-field'};
  deng.sgs_mountain_fields=[...old];deng.weapon={equipment_id:'crossbow'};deng.used_active_skills.add('limited');deng.luoyi_active=true;deng.team='blue';
  const original=deng.hero,baseLost=g.on_general_skill_lost;g.on_general_skill_lost=async(a,p)=>{baseLost(a,p);if(p.skill_id==='sgs.tuntian')a.sgs_mountain_fields.push(later);};
  const r=await remove(g,deng,cai);assert.equal(r.status,'committed');assert.equal(deng.hero,original);assert.equal(deng.hero.faction,'魏');assert.equal(deng.team,'blue');
  assert.equal(deng.weapon.equipment_id,'crossbow');assert.equal(deng.used_active_skills.has('limited'),true);assert.equal(deng.luoyi_active,false);
  assert.equal(g.effective_max_hp(deng),4);assert.deepEqual(deng.sgs_mountain_fields,[later]);assert.deepEqual(g.discard,old);
  assert.equal(deng.effective_rule_hero.id,GENERAL_SKILL_SUPPRESSED_RULE_ID);assert.equal(deng.effective_rule_hero.source_hero_id,DA);assert.deepEqual(deng.effective_skill_ids,[]);
  assert.equal(g.cleanup.length,1);assert.equal(g.lost.length,2);
  await remove(g,deng,cai);assert.equal(g.cleanup.length,1);assert.equal(g.lost.length,2);
});

test('a committed awakening grants later after loss; old intrinsic bundle stays suppressed',async()=>{
  const g=host(),[deng,cai]=g.actors;g.commit_general_skill_resolution(deng,{event_id:'already-paid',source_skill:'sgs.zaoxian'});
  await remove(g,deng,cai);assert.equal(g.has_general_skill(deng,'sgs.zaoxian'),false);
  await g.change_max_hp(deng,-1,{event_id:'already-paid:maxhp',source_skill:'sgs.zaoxian',minimum:1});
  await g.acquire_general_skill(deng,'sgs.jixi',{event_id:'already-paid:grant',source_skill:'sgs.zaoxian'});
  assert.equal(g.has_general_skill(deng,'sgs.jixi'),true);assert.equal(g.has_general_skill(deng,'sgs.tuntian'),false);
  assert.deepEqual(deng.effective_skill_ids,['sgs.jixi']);assert.equal(deng.effective_rule_hero.id,GENERAL_SKILL_SUPPRESSED_RULE_ID);
  assert.deepEqual(get_general_skill_descriptor(deng.effective_rule_hero).overlay_skill_ids,['sgs.jixi']);
  await assert.rejects(g.acquire_general_skill(deng,'sgs.jixi',{event_id:'invent-new-grant',source_skill:'sgs.zaoxian'}),/not currently owned/);
});

test('runtime fails closed unknown grant pairs and absent captured source ownership',async()=>{
  const g=host(),[deng,cai]=g.actors;g.initialize_general_skill_ledger();const before=clone(g.general_skill_ledger_state);
  assert.throws(()=>g.acquire_general_skill(deng,'equipment.crossbow',{event_id:'bad',source_skill:'sgs.zaoxian'}),/unknown source\/grant/);
  assert.throws(()=>g.change_max_hp(deng,-2,{event_id:'bad',source_skill:'sgs.zaoxian',minimum:1}),/only audited/);
  assert.deepEqual(g.general_skill_ledger_state,before);await remove(g,deng,cai);
  await assert.rejects(g.change_max_hp(deng,-1,{event_id:'not-committed:maxhp',source_skill:'sgs.zaoxian',minimum:1}),/not currently owned/);
});

test('failed physical cleanup stays pending and repeat command resumes without duplicate skill loss',async()=>{
  const g=host(),[deng,cai]=g.actors;deng.sgs_mountain_fields=[{physical_id:'f1'}];const real=g.clear_mountain_fields;let attempt=0;
  g.clear_mountain_fields=(...args)=>{if(++attempt===1)throw Error('interrupted cleanup');return real(...args);};
  await assert.rejects(remove(g,deng,cai),/interrupted cleanup/);
  assert.equal(g.has_general_skill(deng,'sgs.tuntian'),false);assert.equal(g.lost.length,2);assert.equal(deng.sgs_mountain_fields.length,1);
  assert.equal(g.initialize_general_skill_ledger().pending_effects().length,1);
  await remove(g,deng,cai);assert.equal(g.lost.length,2);assert.equal(g.cleanup.length,1);assert.equal(deng.sgs_mountain_fields.length,0);
});

test('snapshot reconstruction restores removal/maxHP overlay and cannot recreate broad source rules',async()=>{
  const g=host(),[deng,cai]=g.actors;
  await g.change_max_hp(deng,-1,{event_id:'awake:maxhp',source_skill:'sgs.zaoxian',minimum:1});await remove(g,deng,cai);
  const restored=host();restored.actors[0].hp=2;restored.general_skill_ledger_state=clone(g.general_skill_ledger_state);
  restored.general_skill_effect_receipts=clone(g.general_skill_effect_receipts);restored.general_skill_cleanup_receipts=clone(g.general_skill_cleanup_receipts);
  restored.initialize_general_skill_ledger();const actor=restored.actors[0];assert.equal(actor.hp,2);assert.equal(restored.effective_max_hp(actor),3);
  assert.equal(actor.effective_rule_hero.id,GENERAL_SKILL_SUPPRESSED_RULE_ID);assert.deepEqual(actor.effective_skill_ids,[]);assert.ok(get_general_skill_descriptor(actor.effective_rule_hero));
  assert.equal(get_general_skill_descriptor(clone(actor.effective_rule_hero)),null);
  const fakeAck=host();fakeAck.general_skill_ledger_state=clone(g.general_skill_ledger_state);fakeAck.general_skill_effect_receipts={...clone(g.general_skill_effect_receipts),'unknown-effect':true};fakeAck.general_skill_cleanup_receipts=clone(g.general_skill_cleanup_receipts);
  assert.throws(()=>fakeAck.initialize_general_skill_ledger(),/acknowledgements/);
  const view=restored.general_skill_public_state(actor);assert.ok(view.removed_skill_ids.includes('sgs.zaoxian'));assert.equal(JSON.stringify(view).includes('commands'),false);
  const bad=host();bad.general_skill_ledger_state=clone(g.general_skill_ledger_state);bad.general_skill_ledger_state.actors[0].instances[0].removed_by=null;
  assert.throws(()=>bad.initialize_general_skill_ledger(),/validated replay/);
});

test('sync only accepts a real committed finite lifecycle copy and imports no donor awakening state',async()=>{
  const g=host(),[deng,, ,hua]=g.actors;g.initialize_general_skill_ledger();const life=lifecycleHost(g);
  await g.change_max_hp(deng,-1,{event_id:'donor:maxhp',source_skill:'sgs.zaoxian',minimum:1});
  life.update_vitals(deng.pid,{current_hp:0});life.finalize_death(deng.pid,'real-death');
  const before=life.player_state(hua.pid);await life.replace_from_death({transition_id:'copy-real',actor_id:hua.pid,death_id:'real-death',expected_revision:before.revision});
  installRaw(hua,life.effective_form(hua.pid));await g.sync_general_skill_template(hua,{transition_id:'copy-real'});
  assert.equal(hua.hero.id,HUA);assert.equal(hua.effective_rule_hero.source_hero_id,DA);assert.equal(g.effective_max_hp(hua),4);
  assert.equal(g.effective_max_hp(deng),3);assert.equal(g.has_general_skill(hua,'sgs.zaoxian'),true);assert.equal(g.has_general_skill(hua,'sgs.jixi'),false);
  assert.notEqual(g.general_skill_binding_id(deng),g.general_skill_binding_id(hua));
  assert.deepEqual(g.general_skill_public_state(hua).awakening_marks,[]);
  await assert.rejects(g.sync_general_skill_template(hua,{transition_id:'invented'}),/missing committed/);
  const ownMax=await g.change_max_hp(hua,-1,{event_id:'own:maxhp',source_skill:'sgs.zaoxian',minimum:1});assert.equal(ownMax.result.max_hp,3);
});

test('archived WangYun finite forms remain outside conventional admission',{skip:!hero_by_id(WANGYUN_LIFECYCLE_ID)},async()=>{
  const g=host([WANGYUN_LIFECYCLE_ID,CW]),[wang]=g.actors;g.initialize_general_skill_ledger();const life=lifecycleHost(g);
  const [max,skill]=WANGYUN_EVOLUTIONS;
  await life.evolve_own_form({transition_id:'wy-max',actor_id:wang.pid,evolution_id:max.evolution_id,expected_revision:life.player_state(wang.pid).revision});
  installRaw(wang,life.effective_form(wang.pid));await g.sync_general_skill_template(wang,{transition_id:'wy-max'});assert.equal(g.effective_max_hp(wang),4);
  await life.evolve_own_form({transition_id:'wy-skill',actor_id:wang.pid,evolution_id:skill.evolution_id,continuation_transition_id:'wy-max',expected_revision:life.player_state(wang.pid).revision});
  installRaw(wang,life.effective_form(wang.pid));await g.sync_general_skill_template(wang,{transition_id:'wy-skill'});
  assert.equal(wang.effective_rule_hero.lifecycle_template_id,WANGYUN_FORM_IDS.awakened);assert.equal(g.has_general_skill(wang,'sgs.mobile.wangyun.jingong'),true);
  assert.equal(g.has_general_skill(wang,'sgs.mobile.wangyun.lianji'),false);
});

// These cases exercise the actual parent-wired Game resolver/lifecycle adapter;
// they do not by themselves establish complete browser or save replay parity.
import {Game} from '../game.js';
import {rule_hero} from '../effective-hero.js';
import {active_skills_for_hero,skill_hooks_for_hero,hero_has_capability,SkillHooks} from '../skills.js';
import {sgs_prepare_zaoxian} from '../sgs-mountain-field-skills.js';
function realGame(ids){
  const g=new Game({emit(){},ask_line(){throw Error('Unexpected isolated integration prompt');},ask_confirm(){return Promise.resolve(false);}},{seed:19});
  const actors=ids.map((id,i)=>new Player(`actor-${i}`,hero_by_id(id),true));
  [g.player,g.ai,g.ai2]=actors;[g.p1,g.p2,g.p3]=actors;g.mode=actors.length===3?'1v2':'1v1';
  g.turn_actor='p1';g.turn_phase='play';g.actual_turn_active=true;g.turn_event_counter=1;g.play_phase_event_counter=1;g.round_no=1;
  g.initialize_general_skill_ledger();if(ids.includes(HUA)||ids.includes(WANGYUN_LIFECYCLE_ID))g.initialize_hero_lifecycle();return g;
}
test('real Game copied legacy hero keeps its complete active packet until Duanchang removes it',async()=>{
  const donorId='jianghu.classic.hero.liu-bang',g=realGame([HUA,donorId,CW]),[hua,donor,cai]=g.all_players();
  donor.hp=0;donor.dead=true;g.archive_dead_hero(donor);const candidate=g.yizhuang_candidates(hua).find(c=>c.hero.id===donorId);assert.ok(candidate);
  const before=active_skills_for_hero(donor.hero).map(s=>s.skill_id);assert.ok(before.length);
  assert.equal((await g.apply_yizhuang(hua,candidate.death_id,{transition_id:'real-copy-legacy'})).transformed,true);
  assert.deepEqual(active_skills_for_hero(rule_hero(hua)).map(s=>s.skill_id),before);
  await g.remove_general_skills(hua,{source:cai,source_skill:'sgs.duanchang',event_id:'strip-copy'});
  assert.deepEqual(active_skills_for_hero(rule_hero(hua)),[]);
  assert.ok(Object.values(skill_hooks_for_hero(rule_hero(hua))).every(v=>!Array.isArray(v)||v.length===0));
  assert.equal(rule_hero(hua).id,GENERAL_SKILL_SUPPRESSED_RULE_ID);assert.equal(hua.hero.id,HUA);assert.equal(rule_hero(hua).source_hero_id,donorId);
});

test('real Game own Zaoxian, physical cleanup and grant overlay remain separate from full source copy',async()=>{
  const g=realGame([HUA,DA,CW]),[hua,deng,cai]=g.all_players();
  g.turn_actor='p2';g.turn_phase='prepare';deng.sgs_mountain_fields=g.deck.draw_pile.splice(-3);
  assert.equal(await sgs_prepare_zaoxian(g,deng,null,{phase_event_id:'deng-prep'}),true);
  assert.equal(g.effective_max_hp(deng),3);assert.equal(active_skills_for_hero(rule_hero(deng)).some(s=>s.skill_id==='sgs.jixi'),true);
  deng.hp=0;deng.dead=true;g.archive_dead_hero(deng);g.turn_actor='p1';g.turn_phase='play';
  const candidate=g.yizhuang_candidates(hua).find(c=>c.hero.id===DA);assert.ok(candidate);
  await g.apply_yizhuang(hua,candidate.death_id,{transition_id:'real-copy-deng'});
  assert.equal(g.effective_max_hp(hua),4);assert.equal(g.has_general_skill(hua,'sgs.jixi'),false);assert.equal(hua.sgs_mountain_fields?.length??0,0);
  g.turn_phase='prepare';hua.sgs_mountain_fields=g.deck.draw_pile.splice(-3);const fields=[...hua.sgs_mountain_fields];
  assert.equal(await sgs_prepare_zaoxian(g,hua,null,{phase_event_id:'hua-prep'}),true);assert.equal(g.effective_max_hp(hua),3);
  await g.remove_general_skills(hua,{source:cai,source_skill:'sgs.duanchang',event_id:'real-strip-deng-copy'});
  assert.deepEqual(hua.sgs_mountain_fields,[]);assert.ok(fields.every(c=>g.deck.discard_pile.includes(c)));
  assert.equal(active_skills_for_hero(rule_hero(hua)).length,0);assert.equal(g.has_general_skill(hua,'sgs.tuntian'),false);
  assert.equal(g.effective_max_hp(hua),3);assert.equal(hero_has_capability(rule_hero(hua),'scroll_no_distance_limit'),false);
});


test('real Game controlled Duanchang API strips every currently registered hero without changing gear/identity/maxHP',async()=>{
  let checked=0;
  for(const hero of HEROES){
    const g=realGame([hero.id,CW]),[target,cai]=g.all_players(),sourceHero=target.hero,max=g.effective_max_hp(target),faction=target.hero.faction,gender=rule_hero(target).gender;
    target.hp=Math.max(1,max-1);const hp=target.hp;target.used_active_skills.add('spent-before-strip');target.team='retained-team';
    const weapon=g.deck.draw_pile.find(c=>c.type==='武器');g.deck.draw_pile.splice(g.deck.draw_pile.indexOf(weapon),1);target.weapon=weapon;target.equipment_state={retained:true};
    const equipmentState=target.equipment_state,skills=g.initialize_general_skill_ledger().rule_projection(g.player_id(target)).skill_ids;
    if(hero.id==='jianghu.classic.hero.li-bai')target.shixian_active=true;
    if(hero.id==='jianghu.classic.hero.xiang-yu')target.bawang_stacks=3;
    if(skills.includes('yxs.yinren'))target.yinren_active=true;
    if(skills.includes('sgs.luoyi'))target.luoyi_active=true;
    if(skills.includes('yxs.zuijiu'))target.zuijiu_active=true;
    const before=g.initialize_general_skill_ledger().binding_id(g.player_id(target));
    const result=await g.remove_general_skills(target,{source:cai,source_skill:'sgs.duanchang',event_id:`controlled-strip:${hero.id}`});
    assert.equal(result.status,'committed',hero.id);assert.deepEqual(target.effective_skill_ids,[],hero.id);
    for(const id of skills)assert.equal(g.has_general_skill(target,id),false,`${hero.id}: ${id}`);
    assert.deepEqual(active_skills_for_hero(rule_hero(target)),[],hero.id);
    const hooks=skill_hooks_for_hero(rule_hero(target));assert.ok(hooks===null||JSON.stringify(hooks)===JSON.stringify(SkillHooks()),hero.id);
    assert.equal(hero_has_capability(rule_hero(target),'shixian'),false,hero.id);
    assert.equal(rule_hero(target).id,GENERAL_SKILL_SUPPRESSED_RULE_ID,hero.id);assert.equal(rule_hero(target).source_hero_id,hero.id);
    assert.equal(g.effective_max_hp(target),max,hero.id);assert.equal(target.hp,hp,hero.id);assert.equal(rule_hero(target).gender,gender);
    assert.equal(target.hero,sourceHero);assert.equal(target.hero.faction,faction);assert.equal(target.team,'retained-team');
    assert.equal(target.weapon,weapon);assert.equal(target.equipment_state,equipmentState);assert.ok(target.used_active_skills.has('spent-before-strip'));
    assert.equal(g.initialize_general_skill_ledger().binding_id(g.player_id(target)),before);
    if(hero.id==='jianghu.classic.hero.li-bai')assert.equal(target.shixian_active,false);
    if(hero.id==='jianghu.classic.hero.xiang-yu')assert.equal(target.bawang_stacks,0);
    if(skills.includes('yxs.yinren'))assert.equal(target.yinren_active,false);
    if(skills.includes('sgs.luoyi'))assert.equal(target.luoyi_active,false);
    if(skills.includes('yxs.zuijiu'))assert.equal(target.zuijiu_active,false);
    checked++;
  }
  assert.equal(checked,HEROES.length);
});


test('real material-cost previews have trusted read-only ownership but can never mutate a registered actor',async()=>{
  const g=realGame([DA,CW]),[deng,cai]=g.all_players();deng.sgs_mountain_fields=g.deck.draw_pile.splice(-3);
  const field=deng.sgs_mountain_fields[0],before=g.initialize_general_skill_ledger().snapshot();
  const preview=g.actor_after_material_cost(deng,{zone:'field',card:field});assert.notEqual(preview,deng);
  assert.equal(g.has_general_skill(preview,'sgs.tuntian'),true);assert.equal(g.general_skill_binding_id(preview),g.general_skill_binding_id(deng));
  assert.equal(g.effective_max_hp(preview),4);assert.equal(preview.sgs_mountain_fields.length,2);assert.equal(deng.sgs_mountain_fields.length,3);
  assert.equal(g.distance_between(preview,cai),1);
  const weapon=g.deck.draw_pile.find(c=>c.type==='武器');deng.weapon=weapon;
  const gearPreview=g.actor_after_material_cost(deng,{zone:'weapon',card:weapon});assert.equal(gearPreview.weapon,null);assert.equal(g.has_general_skill(gearPreview,'sgs.tuntian'),true);
  assert.doesNotThrow(()=>g.distance_between(gearPreview,cai));
  assert.deepEqual(g.initialize_general_skill_ledger().snapshot(),before);
  const spoof={...deng,_distance_origin:deng};assert.throws(()=>g.has_general_skill(spoof,'sgs.tuntian'),/untrusted read-only/);
  assert.throws(()=>g.change_max_hp(preview,-1,{event_id:'preview-mutation',source_skill:'sgs.zaoxian',minimum:1}),/does not belong/);
  assert.throws(()=>g.acquire_general_skill(preview,'sgs.jixi',{event_id:'preview-grant',source_skill:'sgs.zaoxian'}),/does not belong/);
  assert.throws(()=>g.remove_general_skills(preview,{source:cai,source_skill:'sgs.duanchang',event_id:'preview-strip'}),/does not belong/);
  await g.remove_general_skills(deng,{source:cai,source_skill:'sgs.duanchang',event_id:'actual-strip'});
  assert.throws(()=>g.has_general_skill(preview,'sgs.tuntian'),/stale read-only/);
  const current=g.actor_after_material_cost(deng,{zone:'weapon',card:weapon});assert.equal(g.has_general_skill(current,'sgs.tuntian'),false);
});


import {LocalMatch} from '../session.js';
test('legacy max-HP/preview reads are snapshot-pure before a ledger exists, including isolated unknown fixtures',()=>{
  for(const registered of [true,false]){
    const g=new Game({emit(){}},{seed:8650000});
    const hero=registered?hero_by_id('jianghu.classic.hero.qin-shi-huang'):{id:'isolated.fixture',name:'fixture',max_hp:4,skill_name:''};
    const a=new Player('legacy',hero),b=new Player('other',hero_by_id(CW));
    [g.player,g.ai]=[a,b];[g.p1,g.p2]=[a,b];g.p3=null;
    const session=new LocalMatch();session.game=g;const before=session.snapshot();
    assert.equal(g.effective_max_hp(a),hero.max_hp);assert.equal(g.general_skill_ledger_state,undefined);
    a.weapon={name:'fixture gear',range:3};const preview=g.actor_after_material_cost(a,{zone:'weapon',card:a.weapon});
    assert.equal(g.effective_max_hp(preview),hero.max_hp);assert.equal(preview.weapon,null);delete a.weapon; a.weapon=null;
    assert.deepEqual(session.snapshot(),before);
    assert.throws(()=>g.has_general_skill({...a,_distance_origin:a},'sgs.tuntian'),/untrusted read-only/);
    assert.equal(g.general_skill_ledger_state,undefined);assert.deepEqual(session.snapshot(),before);
  }
});
