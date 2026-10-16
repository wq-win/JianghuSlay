/** Controlled kernel contract only. No production Game adapter is installed. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {Card,CardType as T,Deck,SeededRNG} from '../models.js';
import {EQUIPMENT_CATALOG} from '../equipment-catalog.mjs';
import {MODE_EQUIPMENT_CATALOG,ZHUQUE_EQUIPMENT_PACK_ID} from '../mode-equipment-catalog.mjs';
import {YOUJIAN_EQUIPMENT_CATALOG,YOUJIAN_EQUIPMENT_PACK_ID} from '../youjian-equipment-catalog.mjs';
import {DERIVED_EQUIPMENT_CATALOG} from '../derived-equipment.mjs';
import {create_card_use_history,begin_card_use_turn,record_card_use_event} from '../card-use-history.js';
import {VIRTUAL_CARD_IDENTITY_VERSION,create_virtual_card_catalog,create_virtual_card_registry,
  apply_virtual_card_command,virtual_card_view,virtual_card_identity,restore_virtual_card_registry} from '../virtual-card-identity.js';

const copy=v=>JSON.parse(JSON.stringify(v));
const hand=(owner_id='A')=>({zone:'hand',owner_id,slot:null});
const shared=zone=>({zone,owner_id:null,slot:null});
const equip=(slot='weapon',owner_id='A')=>({zone:'equipment',owner_id,slot});
const judge=(owner_id='A')=>({zone:'judgment',owner_id,slot:null});
const metadata={suit:'红桃',color:'红',rank:12};
const slots={'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
const delayedNames=new Set(['手捧雷','画地为牢','兵粮寸断']);
const deck=new Deck(new SeededRNG(41));
const cards=[...deck.draw_pile];
// This explicitly reviewed fixture authority is independent from save/commands.
// New functions require adding trusted catalog entries, never a history object.
const fixtureById=new Map();
for (const c of cards) {
  const equipment=Object.hasOwn(slots,c.type);
  const template_id=c.equipment_id??c.id??`jianghu.function.${c.name}`;
  const category=equipment?'equipment':delayedNames.has(c.name)?'delayed_trick':c.type===T.SCROLL?'trick':'basic';
  const t={template_id,rule_id:template_id,category,name:c.name,type:c.type,power:c.power,range:c.range,trait:c.trait};
  if (equipment) Object.assign(t,{equipment_id:c.equipment_id,slot:slots[c.type]});
  if (category==='delayed_trick') t.delayed_key=`delayed:${c.name}`;
  for (const k of ['rule_type','nature','effect_id','mechanism_id','target_mode']) if (c[k] !== undefined) t[k]=c[k];
  fixtureById.set(template_id,t);
}
const templates=[...fixtureById.values()];
const catalog=create_virtual_card_catalog({catalog_id:'test.reviewed.current-functions',revision:'v14-contract-1',templates});
const byName=name=>templates.find(t=>t.name===name)??assert.fail(`missing fixture ${name}`);
const seed=(physical_id='p:1',name='闪',location=hand(),overrides={})=>({physical_id,printed_template_id:byName(name).template_id,metadata:{...metadata},location,...overrides});
const initial=(materials=[seed()])=>create_virtual_card_registry(catalog,materials);
const provenance={copied_from_use_id:'previous:use',source_material_ids:['old:template:material'],source_skill_id:'proposed.jianxiong',source_game:'英雄杀',source_record_id:'yxs-mobile:article:304220'};
const prepare=(command_id='prepare:1',virtual_id='v:1',templateName='虎符',physical_id='p:1',actor_id='A',extra={})=>({
  command_id,kind:'prepare',virtual_id,use_id:`use:${virtual_id}`,actor_id,template_id:byName(templateName).template_id,
  material_ids:[physical_id],provenance:copy(provenance),...extra});
const commit=(virtual_id='v:1',command_id=`commit:${virtual_id}`)=>({command_id,kind:'commit',virtual_id});
const apply=(s,c)=>apply_virtual_card_command(s,catalog,c);
const run=(s,c)=>apply(s,c).registry;
const view=(s,p='p:1')=>virtual_card_view(s,catalog,p);
const identity=(s,v='v:1')=>virtual_card_identity(s,catalog,v);
const active=(name='虎符',s=initial(),p='p:1',v='v:1')=>run(run(s,prepare(`prepare:${v}`,v,name,p)),commit(v));
const move=(s,p,to,command_id='move:1',extra={})=>({command_id,kind:'move',material:{physical_id:p,revision:view(s,p).revision},destination:to,intent:'relocate',replacement:null,...extra});
const finish=(virtual_id='v:1',command_id=`finish:${virtual_id}`,reason='effect_finished')=>({command_id,kind:'finish',virtual_id,reason});
const counts=s=>{
  assert.equal(s.materials.length,s.initial_materials.length);
  assert.equal(new Set(s.materials.map(m=>JSON.stringify(m.physical_id))).size,s.materials.length);
  assert.equal(new Set(s.materials.filter(m=>m.virtual_id!==null).map(m=>JSON.stringify(m.virtual_id))).size,s.identities.filter(v=>v.status==='active').length);
};

test('every retained conventional deck function uses the same trusted-template path',()=>{
  const seen=new Set();
  for (const t of templates) {
    let s=initial();
    const p=prepare(`prepare:${t.template_id}`,'v:all');p.template_id=t.template_id;
    s=run(run(s,p),commit('v:all'));
    assert.equal(view(s).effective_function.rule_id,t.rule_id);
    assert.equal(view(s).effective_function.name,t.name);
    assert.deepEqual(view(s).effective_metadata,metadata);
    if (t.category==='equipment') {
      s=run(s,move(s,'p:1',equip(t.slot)));
      for (const field of ['equipment_id','type','slot','range','power','trait']) assert.equal(view(s).effective_function[field],t[field]);
      assert.equal(identity(s,'v:all').phase,'equipment');
    } else if (t.category==='delayed_trick') {
      s=run(s,move(s,'p:1',judge()));assert.equal(identity(s,'v:all').phase,'judgment');
    } else {
      s=run(s,finish('v:all'));assert.equal(view(s).effective_function.name,'闪');
    }
    counts(s);seen.add(t.name);
  }
  for (const name of ['杀','火杀','雷杀','闪','桃','酒','无中生有','决斗','顺手牵羊','釜底抽薪','烽火狼烟','万箭齐发','无懈可击','借刀杀人','铁索连环','火攻','手捧雷','画地为牢','兵粮寸断']) assert.ok(seen.has(name),name);
  for (const c of EQUIPMENT_CATALOG) assert.ok(seen.has(c.name),c.name);
});

test('physical material, virtual instance and copied function are distinct identities',()=>{
  const input=[seed()];const s=active('虎符',initial(input));
  const v=view(s);
  assert.equal(v.physical_id,'p:1');assert.equal(v.virtual_id,'v:1');
  assert.equal(v.effective_function.rule_id,byName('虎符').rule_id);
  assert.equal(v.printed_function.name,'闪');assert.deepEqual(v.material_ids,['p:1']);
  assert.deepEqual(v.effective_metadata,metadata);
  assert.deepEqual(identity(s).source_materials[0].material_ids,['p:1']);
  assert.deepEqual(v.provenance.source_material_ids,['old:template:material']);
  assert.equal(s.materials.length,1);assert.equal(s.materials[0].printed_template_id,byName('闪').template_id);
  assert.notEqual(s.initial_materials[0],input[0]);
  assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(v.effective_function));
  assert.equal(Object.isFrozen(input[0]),false);
  assert.throws(()=>{v.effective_metadata.rank=1;},TypeError);
});

test('preparation/cancellation before commit does not move material or create active function',()=>{
  const start=initial(),p=prepare();let s=run(start,p);
  assert.equal(view(s).virtual_id,null);assert.equal(view(s).revision,0);
  assert.deepEqual(s.materials,start.materials);assert.deepEqual(s.receipts[0].changes,[]);
  const cancel={command_id:'cancel:1',kind:'cancel',virtual_id:'v:1',reason:'target_selection_cancelled'};
  s=run(s,cancel);
  assert.deepEqual(s.materials,start.materials);assert.equal(identity(s).status,'cancelled');
  assert.equal(apply(s,cancel).registry,s);assert.equal(apply(s,cancel).duplicate,true);
  assert.throws(()=>run(s,commit()),/only a prepared/);
  assert.throws(()=>run(s,prepare('other')),/already reserved/);
});

test('only one hand/equipment material is accepted and the actor must currently own it',()=>{
  for (const material_ids of [[],['p:1','p:1'],['p:1','p:2']]) assert.throws(()=>run(initial(),prepare('p','v:1','虎符','p:1','A',{material_ids})),/exactly one real material/);
  assert.throws(()=>run(initial(),prepare('p','v:1','虎符','missing')),/unknown physical/);
  assert.throws(()=>run(initial(),prepare('p','v:1','虎符','p:1','B')),/this actor/);
  const s=initial([seed('p:1','手捧雷',judge())]);
  assert.throws(()=>run(s,prepare()),/hand or equipment/);
  assert.throws(()=>run(initial(),prepare('p','p:1')),/distinct from physical/);
});

test('concurrent preparations cannot spend a material twice; moving away and back remains stale',()=>{
  let s=run(run(initial(),prepare()),prepare('prepare:2','v:2','桃'));
  s=run(s,commit());
  assert.throws(()=>run(s,commit('v:2')),/stale material revision/);counts(s);
  let t=run(initial(),prepare());
  t=run(t,move(t,'p:1',hand('B'),'out'));
  t=run(t,move(t,'p:1',hand('A'),'back'));
  assert.deepEqual(view(t).location,hand());
  assert.throws(()=>run(t,commit()),/stale material revision/);
});

test('ordinary functions are transient and cleanup is idempotent after discard/recovery/reuse',()=>{
  let s=active('无中生有');const f=finish();
  s=run(s,f);assert.equal(view(s).virtual_id,null);assert.equal(view(s).effective_function.name,'闪');
  assert.deepEqual(view(s).location,shared('discard_pile'));assert.equal(identity(s).end_reason,'effect_finished');
  assert.equal(apply(s,f).registry,s);
  s=run(s,move(s,'p:1',hand(),'recover'));
  s=active('杀',s,'p:1','v:2');
  const delayed=apply(s,finish('v:1','late-cleanup'));
  assert.deepEqual(delayed.receipt.changes,[]);assert.equal(view(delayed.registry).virtual_id,'v:2');
  assert.equal(identity(delayed.registry,'v:2').status,'active');counts(delayed.registry);
});

test('a committed material obtained by another mechanism is never reclaimed by cleanup',()=>{
  let s=active('决斗');s=run(s,move(s,'p:1',hand('B'),'obtain'));
  const result=apply(s,finish());s=result.registry;
  assert.equal(result.receipt.outcome,'already_left_use_processing');
  assert.deepEqual(view(s).location,hand('B'));assert.equal(view(s).effective_function.name,'闪');
  assert.equal(identity(s).status,'ended');counts(s);
});

test('commit is final despite nullification, actor death or cancellation after commitment',()=>{
  let s=active('无中生有');
  assert.throws(()=>run(s,{command_id:'cancel:late',kind:'cancel',virtual_id:'v:1',reason:'actor_died'}),/only a prepared/);
  s=run(s,finish('v:1','nullified','effect_nullified'));
  assert.equal(identity(s).committed_seq,2);assert.equal(identity(s).status,'ended');
  assert.deepEqual(view(s).location,shared('discard_pile'));counts(s);
});

test('copied equipment retains functional identity on equip and direct transfer; leaving restores printed face',()=>{
  let s=active('虎符');s=run(s,move(s,'p:1',equip(),'equip'));
  s=run(s,finish());assert.equal(view(s).effective_function.name,'虎符');
  assert.equal(identity(s).status,'active');
  s=run(s,move(s,'p:1',equip('weapon','B'),'transfer'));
  assert.equal(view(s).virtual_id,'v:1');assert.equal(view(s).location.owner_id,'B');
  s=run(s,move(s,'p:1',hand('C'),'take'));
  assert.equal(view(s).effective_function.name,'闪');assert.equal(view(s).virtual_id,null);
  assert.deepEqual(view(s).effective_metadata,metadata);
  assert.throws(()=>run(s,move(s,'p:1',equip('weapon','C'),'reequip-printed-dodge')),/does not fit/);
});

test('all nonpersistent destinations end a copied equipment role, including generic processing',()=>{
  for (const destination of [hand('B'),shared('draw_pile'),shared('discard_pile'),shared('offboard'),shared('exile'),shared('processing')]) {
    let s=active('虎符');s=run(s,move(s,'p:1',equip(),'equip'));
    s=run(s,move(s,'p:1',destination,'leave'));
    assert.equal(view(s).virtual_id,null);assert.equal(view(s).effective_function.name,'闪');counts(s);
  }
});

test('equipment replacement is explicit, revision checked, atomic, and emits old effective leave identity',()=>{
  let s=initial([seed(),seed('p:2','桃',hand('B'))]);
  s=active('虎符',s);s=run(s,move(s,'p:1',equip(),'equip-old'));
  s=run(run(s,prepare('prepare:2','v:2','虎符','p:2','B')),commit('v:2'));
  const before=copy(s),base=move(s,'p:2',equip(),'equip-new');
  assert.throws(()=>run(s,base),/exact occupied/);
  assert.throws(()=>run(s,{...base,replacement:{physical_id:'p:1',revision:0}}),/stale/);
  assert.deepEqual(s,before);
  const result=apply(s,{...base,replacement:{physical_id:'p:1',revision:view(s).revision}});s=result.registry;
  assert.equal(result.receipt.changes.length,2);
  const old=result.receipt.changes.find(c=>c.physical_id==='p:1');
  assert.equal(old.before.effective_function.name,'虎符');assert.equal(old.after.effective_function.name,'闪');
  assert.deepEqual(old.after.location,shared('discard_pile'));
  assert.equal(identity(s).end_reason,'equipment_replaced');assert.equal(view(s,'p:2').virtual_id,'v:2');counts(s);
});

test('wrong equipment slot and unrelated replacement fail without touching either material',()=>{
  let s=active('虎符',initial([seed(),seed('p:2','桃')]));const before=copy(s);
  assert.throws(()=>run(s,move(s,'p:1',equip('armor'))),/does not fit/);
  assert.throws(()=>run(s,move(s,'p:1',equip(),'other',{replacement:{physical_id:'p:2',revision:0}})),/unexpected replacement/);
  assert.deepEqual(s,before);
});

test('reusing an equipped transformed material ends the old role and creates one new use',()=>{
  let s=active('虎符');s=run(s,move(s,'p:1',equip(),'equip'));
  s=run(s,prepare('prepare:2','v:2','火杀'));
  assert.equal(view(s).effective_function.name,'虎符');
  const result=apply(s,commit('v:2'));s=result.registry;
  assert.equal(identity(s).end_reason,'material_reused');assert.equal(identity(s,'v:2').source_materials[0].virtual_id,'v:1');
  assert.equal(result.receipt.changes.length,1);assert.equal(result.receipt.changes[0].before.effective_function.name,'虎符');
  assert.equal(result.receipt.changes[0].after.effective_function.name,'火杀');assert.equal(view(s).printed_function.name,'闪');
  s=run(s,finish('v:2'));assert.equal(view(s).effective_function.name,'闪');counts(s);
});

test('a printed equipment material restores its full own attributes after copying another function',()=>{
  let s=active('画地为牢',initial([seed('p:1','虎符',equip())]));
  s=run(s,move(s,'p:1',judge('B'),'place'));
  s=run(s,move(s,'p:1',hand('C'),'stolen'));
  assert.equal(view(s).effective_function.equipment_id,byName('虎符').equipment_id);
  assert.equal(view(s).effective_function.trait,byName('虎符').trait);
  s=run(s,move(s,'p:1',equip('weapon','C'),'native-reequip'));
  assert.equal(view(s).virtual_id,null);assert.equal(view(s).effective_function.name,'虎符');counts(s);
});

test('delayed wrapper survives judgment processing and lawful transfer, never transfers judgment-result card',()=>{
  let s=active('手捧雷',initial([seed(),seed('result:1','桃',shared('draw_pile'),{metadata:{suit:'黑桃',color:'黑',rank:3}})]));
  s=run(s,move(s,'p:1',judge('B'),'place'));
  s=run(s,move(s,'p:1',shared('processing'),'judge-begin',{intent:'begin_judgment'}));
  assert.equal(view(s).effective_function.name,'手捧雷');assert.equal(identity(s).phase,'judgment');
  // Finishing the old use cannot consume a later judgment episode.
  s=run(s,finish());assert.equal(view(s).virtual_id,'v:1');
  s=run(s,move(s,'result:1',shared('processing'),'reveal-result'));
  s=run(s,move(s,'result:1',shared('discard_pile'),'finish-result'));
  s=run(s,move(s,'p:1',judge('C'),'pass',{intent:'delayed_transfer'}));
  assert.equal(view(s).effective_function.name,'手捧雷');assert.deepEqual(view(s).effective_metadata,metadata);
  assert.equal(view(s,'result:1').effective_function.name,'桃');assert.equal(view(s,'result:1').virtual_id,null);
  s=run(s,move(s,'p:1',shared('processing'),'judge-again',{intent:'begin_judgment'}));
  s=run(s,move(s,'p:1',shared('discard_pile'),'resolved'));
  assert.equal(view(s).effective_function.name,'闪');assert.equal(identity(s).status,'ended');counts(s);
});

test('direct judgment transfer preserves identity, duplicate delayed destination and mismatched role fail',()=>{
  let s=active('手捧雷',initial([seed(),seed('other:thunder','手捧雷',judge('C'))]));
  s=run(s,move(s,'p:1',judge('A'),'place'));
  s=run(s,move(s,'p:1',judge('B'),'pass-b',{intent:'delayed_transfer'}));
  const before=copy(s);
  assert.throws(()=>run(s,move(s,'p:1',judge('C'),'pass-c',{intent:'delayed_transfer'})),/duplicate delayed/);
  assert.deepEqual(s,before);
  assert.throws(()=>run(s,move(s,'p:1',equip(),'bad-role')),/does not fit/);
  assert.equal(view(s).virtual_id,'v:1');
});

test('judgment begin/transfer intents cannot keep an arbitrary transient use alive',()=>{
  const s=active('桃');
  assert.throws(()=>run(s,move(s,'p:1',judge(),'fake-transfer',{intent:'delayed_transfer'})),/current delayed/);
  assert.throws(()=>run(s,move(s,'p:1',hand(),'fake-judgment',{intent:'begin_judgment'})),/begin_judgment/);
  assert.throws(()=>run(s,move(s,'p:1',judge(),'place-basic')),/delayed function/);
  let t=active('画地为牢');t=run(t,move(t,'p:1',judge(),'place'));
  t=run(t,move(t,'p:1',shared('processing'),'ordinary-removal'));
  assert.equal(view(t).virtual_id,null);assert.equal(view(t).effective_function.name,'闪');
});

test('exact command replay works after later movements and JSON restore; changed payload always conflicts',()=>{
  const p=prepare();let s=run(run(initial(),p),commit());s=run(s,finish());
  s=restore_virtual_card_registry(copy(s),catalog);
  for (const c of [p,commit(),finish()]) {const r=apply(s,c);assert.equal(r.registry,s);assert.equal(r.duplicate,true);}
  for (const change of [{template_id:byName('桃').template_id},{actor_id:'B'},{material_ids:['other']},{provenance:{...provenance,copied_from_use_id:'other-use'}},{use_id:'other-use'}]) {
    assert.throws(()=>run(s,{...p,...change}),/changed payload/);
  }
  assert.throws(()=>run(s,{command_id:p.command_id,kind:'cancel',virtual_id:'v:1',reason:'cancel'}),/changed payload/);
  assert.throws(()=>run(s,commit('v:1','new-commit-id')),/only a prepared/);
});

test('catalog commands accept references only; arbitrary functional and temporary fields are rejected',()=>{
  const s=initial();
  for (const extra of [{effective_function:byName('虎符')},{name:'fake'},{range:99},{suit:'黑桃'},{rank:1},{targets:['B']},{wine_bonus:4},{callback:()=>{}}]) {
    assert.throws(()=>run(s,{...prepare(),...extra}),/unknown command field/);
  }
  assert.throws(()=>run(s,{...prepare(),template_id:'untrusted:unknown'}),/unknown trusted template/);
  for (const extra of [{suit:'黑桃'},{rank:2},{targets:['B']},{virtual:true},{damage_bonus:10},{description:'arbitrary executable data'}]) {
    assert.throws(()=>create_virtual_card_catalog({catalog_id:'bad',revision:'1',templates:[{...byName('虎符'),...extra}]}),/unknown template field/);
  }
  const v=view(active());assert.equal(v.effective_function.suit,undefined);assert.equal(v.effective_function.rank,undefined);
  assert.equal(v.effective_function.materials,undefined);assert.equal(v.effective_function.provenance,undefined);
});

test('catalog authority is explicit, detached, versioned and required again on restore',()=>{
  const input={catalog_id:'detached',revision:'1',templates:copy(templates)};const c=create_virtual_card_catalog(input);
  input.templates[0].name='mutated';assert.notEqual(c.templates[0].name,'mutated');
  const s=initial();
  assert.throws(()=>create_virtual_card_registry(copy(catalog),[seed()]),/trusted definitions/);
  assert.throws(()=>virtual_card_view(copy(s),catalog,'p:1'),/restore_virtual_card_registry/);
  const altered=copy(catalog);altered.templates.find(t=>t.name==='虎符').range=99;
  const forged=create_virtual_card_catalog(altered);
  assert.throws(()=>restore_virtual_card_registry(copy(active()),forged),/catalog identity/);
  const later=create_virtual_card_catalog({...copy(catalog),revision:'2'});
  assert.throws(()=>restore_virtual_card_registry(copy(s),later),/catalog identity/);
  const sameAuthority=create_virtual_card_catalog(copy(catalog));assert.deepEqual(restore_virtual_card_registry(copy(s),sameAuthority),s);
});

test('strict schemas reject duplicate IDs, invalid locations, impossible metadata and accessors without executing them',()=>{
  assert.throws(()=>initial([seed(),seed()]),/duplicate physical/);
  assert.throws(()=>initial([seed('p:1','虎符',equip()),seed('p:2','虎符',equip())]),/duplicate occupied/);
  assert.throws(()=>initial([seed('p:1','手捧雷',judge()),seed('p:2','手捧雷',judge())]),/duplicate delayed/);
  for (const loc of [{...hand(),owner_id:null},{...shared('draw_pile'),owner_id:'A'},{...hand(),slot:'weapon'},{...hand(),zone:'unknown'}]) {
    assert.throws(()=>initial([seed('p:1','闪',loc)]));
  }
  for (const meta of [{...metadata,rank:0},{...metadata,rank:14},{...metadata,color:'黑'},{...metadata,suit:'spade'},{...metadata,rank:undefined}]) {
    assert.throws(()=>initial([seed('p:1','闪',hand(),{metadata:meta})]));
  }
  const getters=[];const bad=prepare();Object.defineProperty(bad,'template_id',{enumerable:true,get(){getters.push(1);throw Error('executed');}});
  assert.throws(()=>run(initial(),bad),/data|accessor/);assert.deepEqual(getters,[]);
  const arr=['p:1'];Object.defineProperty(arr,'0',{get(){getters.push(1);}});
  assert.throws(()=>run(initial(),{...prepare(),material_ids:arr}),/accessors/);assert.deepEqual(getters,[]);
  assert.throws(()=>initial([seed('p:1','闪',hand(),{virtual:true})]),/unknown initial material/);
});

test('numeric and string IDs are distinct; object, negative zero and absent IDs are invalid',()=>{
  let s=initial([seed(0),seed('0')]);
  s=run(s,prepare('p',1,'桃',0));s=run(s,commit(1));
  assert.equal(view(s,0).virtual_id,1);assert.equal(view(s,'0').virtual_id,null);
  for (const badId of [-0,NaN,Infinity,{},undefined,'']) assert.throws(()=>initial([{...seed(),physical_id:badId}]));
});

test('restore rejects edited wrappers, original cards, locations, receipts, command reuse and duplicated material',()=>{
  let s=active('虎符');s=run(s,move(s,'p:1',equip(),'equip'));
  const edits=[
    saved=>{saved.version=VIRTUAL_CARD_IDENTITY_VERSION+1;},
    saved=>{saved.materials.push(copy(saved.materials[0]));},
    saved=>{saved.materials[0].physical_id='alien';},
    saved=>{saved.materials[0].metadata.rank=1;},
    saved=>{saved.materials[0].printed_template_id=byName('桃').template_id;},
    saved=>{saved.materials[0].location=hand('B');},
    saved=>{saved.materials[0].virtual_id='orphan';},
    saved=>{saved.identities[0].template_id=byName('杀').template_id;},
    saved=>{saved.identities[0].status='prepared';},
    saved=>{saved.identities[0].source_materials[0].physical_id='fake-cost';},
    saved=>{saved.receipts[1].changes[0].after.effective_function.range=999;},
    saved=>{saved.receipts.pop();},
    saved=>{saved.commands.push(copy(saved.commands[0]));},
    saved=>{saved.commands[1].virtual_id='missing';},
    saved=>{saved.commands[0].effective_function={name:'forged'};},
    saved=>{saved.initial_materials.push(copy(saved.initial_materials[0]));},
    saved=>{saved.extra='unexpected';},
  ];
  for (const edit of edits) {const saved=copy(s);edit(saved);assert.throws(()=>restore_virtual_card_registry(saved,catalog));}
  const reordered=Object.fromEntries(Object.entries(copy(s)).reverse());
  assert.deepEqual(restore_virtual_card_registry(reordered,catalog),s);
});

test('all lifecycle states restore, including pending cancellation, judgment processing and ended reuse',()=>{
  const states=[initial()];
  states.push(run(states.at(-1),prepare()));
  states.push(run(states.at(-1),{command_id:'cancel',kind:'cancel',virtual_id:'v:1',reason:'cancelled'}));
  let s=active('手捧雷');states.push(s);
  s=run(s,move(s,'p:1',judge(),'place'));states.push(s);
  s=run(s,move(s,'p:1',shared('processing'),'judging',{intent:'begin_judgment'}));states.push(s);
  s=run(s,move(s,'p:1',hand(),'obtain'));states.push(s);
  s=active('虎符',s,'p:1','v:2');states.push(s);
  for (const state of states) {
    const restored=restore_virtual_card_registry(copy(state),catalog);assert.deepEqual(restored,state);counts(restored);
    assert.ok(Object.isFrozen(restored.materials[0].metadata));
  }
});

test('proposed adapter feeds committed receipt into use history with new suit/rank and one material',()=>{
  let s=run(initial(),prepare());const prepared=identity(s);const staged=apply(s,commit());
  // A host could inspect staged.registry for post-cost range before publishing.
  assert.deepEqual(view(s).location,hand());assert.deepEqual(view(staged.registry).location,shared('processing'));
  s=staged.registry;const v=view(s);
  let history=begin_card_use_turn(create_card_use_history(),{turn_id:'turn:1',turn_owner_id:'A'});
  history=record_card_use_event(history,{
    kind:'card_use',stage:'committed',event_id:'event:1',use_id:prepared.use_id,parent_use_id:null,
    turn_id:'turn:1',turn_owner_id:'A',actor_id:'A',commit_seq:1,
    effective_function:v.effective_function,effective_metadata:v.effective_metadata,
    materials:[{physical_id:v.physical_id,owner_id:'A',zone:'hand',visibility:'public',
      printed:{name:v.printed_function.name,type:v.printed_function.type,...v.effective_metadata},effective:v.effective_metadata}],
    provenance:{kind:'converted',source_skill_id:'proposed.jianxiong',copied_from_use_id:provenance.copied_from_use_id},
  }).history;
  assert.equal(history.uses.length,1);assert.equal(history.uses[0].materials.length,1);
  assert.equal(history.uses[0].materials[0].physical_id,'p:1');assert.equal(history.uses[0].effective_function.name,'虎符');
  assert.equal(history.uses[0].effective_metadata.rank,12);
  assert.equal(identity(s).status,'active');counts(s);
});

test('a no-material historical use is an allowed template source, but this copy still pays one real material',()=>{
  const p=prepare('prepare:empty-source','v:1','雷杀');
  p.provenance={copied_from_use_id:'prior:no-material-use',source_material_ids:[]};
  let s=run(run(initial(),p),commit());
  assert.deepEqual(view(s).provenance.source_material_ids,[]);
  assert.deepEqual(view(s).material_ids,['p:1']);assert.deepEqual(view(s).effective_metadata,metadata);
  s=run(s,finish());counts(s);
});

test('trusted intrinsic nature is retained while colorless material metadata never defaults to template values',()=>{
  const definitions=copy(catalog);
  definitions.templates.find(t=>t.name==='火杀').nature='fire';
  const c=create_virtual_card_catalog(definitions);
  let s=create_virtual_card_registry(c,[seed('p:1','闪',hand(),{metadata:{suit:null,color:null,rank:null}})]);
  for (const cmd of [prepare('p','v:1','火杀'),commit()]) s=apply_virtual_card_command(s,c,cmd).registry;
  const v=virtual_card_view(s,c,'p:1');
  assert.equal(v.effective_function.nature,'fire');assert.deepEqual(v.effective_metadata,{suit:null,color:null,rank:null});
  assert.equal(v.effective_function.suit,undefined);assert.equal(v.effective_function.rank,undefined);
  assert.deepEqual(restore_virtual_card_registry(copy(s),c),s);
});

test('native delayed physical card uses the same judgment movement API without acquiring a wrapper',()=>{
  let s=initial([seed('p:1','手捧雷',judge())]);
  s=run(s,move(s,'p:1',shared('processing'),'native-judgment',{intent:'begin_judgment'}));
  s=run(s,move(s,'p:1',judge('B'),'native-transfer',{intent:'delayed_transfer'}));
  assert.equal(view(s).virtual_id,null);assert.equal(view(s).effective_function.name,'手捧雷');
  assert.deepEqual(view(s).location,judge('B'));assert.equal(s.identities.length,0);counts(s);
});
