import test from 'node:test';
import assert from 'node:assert/strict';
import {Card,CardType as T} from '../web/local/models.js';
import {EQUIPMENT_CATALOG} from '../web/local/equipment-catalog.mjs';
import {MODE_EQUIPMENT_CATALOG} from '../web/local/mode-equipment-catalog.mjs';
import {YOUJIAN_EQUIPMENT_CATALOG} from '../web/local/youjian-equipment-catalog.mjs';
import {DERIVED_EQUIPMENT_CATALOG} from '../web/local/derived-equipment.mjs';
import {prepare_card_face,printed_card_fields,set_card_face,clear_card_face,
  card_face_record,snapshot_card_face} from '../web/local/card-face-projection.js';

const plain=value=>JSON.parse(JSON.stringify(value));
const printed={name:'闪',type:T.SHAN,power:0,description:'原印刷牌',range:1,trait:'',suit:'红桃',color:'红',rank:12};
// Exercise the exact Card prototype while keeping helper tests independent of
// the host's constructor wiring. No replacement occurs once this object exists.
const physical=(extra={})=>{
  const card=Object.assign(Object.create(Card.prototype),printed,extra);
  assert.equal(prepare_card_face(card),card);
  return Object.freeze(card);
};
const basic=(extra={})=>({rule_id:'jianghu.card.杀',category:'basic',name:'杀',type:T.SHA,power:0,description:'复制的杀',range:1,trait:'',...extra});
const weapon={rule_id:'gear:fixture',category:'equipment',name:'测试武器',type:T.WEAPON,
  id:'gear:fixture',equipment_id:'gear:fixture',mechanism_id:'weapon-mechanism',slot:'weapon',power:0,range:4,trait:'repeat_sha',
  source_game:'测试来源',source_urls:['https://example.invalid/weapon'],source_variant:'fixture-v1',
  mechanism_signature:{activation:'locked',limits:{per_turn:null}},aliases:['测试旧名'],description:'武器规则'};
const set=(card,definition=basic(),virtual_id='copy:1')=>set_card_face(card,definition,{virtual_id,source_skill:'测试复制'});

function assertDeepFrozen(value) {
  if (value && typeof value==='object') {
    assert.ok(Object.isFrozen(value));
    for (const child of Object.values(value)) assertDeepFrozen(child);
  }
}

test('production Card constructor prepares physical getters before freeze and leaves legacy virtual views intact',()=>{
  const card=new Card('闪',T.SHAN,{suit:'方块',color:'红',rank:5});
  assert.ok(Object.isFrozen(card));
  assert.equal(typeof Object.getOwnPropertyDescriptor(card,'name').get,'function');
  const baseline=printed_card_fields(card);
  assert.equal(set(card,weapon),card);
  assert.equal(card.name,weapon.name);assert.equal(card.suit,'方块');assert.equal(card.rank,5);
  clear_card_face(card);assert.equal(card.name,'闪');assert.equal(printed_card_fields(card),baseline);
  const materials=[card];
  const legacy=new Card('杀',T.SHA,{virtual:true,materials,suit:null,color:null,rank:null});
  assert.ok(Object.isFrozen(legacy));assert.equal(legacy.materials,materials);
  assert.equal(legacy.materials[0],card);assert.equal(card_face_record(legacy),null);
});

test('prepared frozen Card retains object identity, class methods, and physical zone references',()=>{
  const card=physical(),zone=[card],identity=new Map([[card,'physical:one']]);
  assert.ok(card instanceof Card);
  assert.ok(Object.isFrozen(card));
  assert.equal(set(card,weapon),card);
  assert.equal(zone[0],card);
  assert.equal(identity.get(card),'physical:one');
  assert.equal(card.name,weapon.name);
  assert.equal(card.type,T.WEAPON);
  assert.equal(card.equipment_id,weapon.equipment_id);
  assert.equal(card.range,4);
  assert.equal(String(card),'[红桃Q]测试武器(武器 距离4)');
  assert.ok(Object.isFrozen(card));
  assert.throws(()=>{card.name='伪造';},TypeError);
  assert.throws(()=>Object.defineProperty(card,'name',{value:'伪造'}),TypeError);
  assert.equal(prepare_card_face(card),card);
  assert.equal(card.name,weapon.name,'idempotent prepare must not clear a current copy');
});

test('functional fields enumerate and serialize with the current face, without mutable cache internals',()=>{
  const card=physical();
  assert.deepEqual(plain(card),printed);
  assert.deepEqual(printed_card_fields(card),printed);
  const originalDescriptor=Object.getOwnPropertyDescriptor(card,'suit');
  set(card,weapon);
  const descriptor=Object.getOwnPropertyDescriptor(card,'name');
  assert.equal(typeof descriptor.get,'function');
  assert.equal(descriptor.set,undefined);
  assert.equal(descriptor.enumerable,true);
  assert.equal(descriptor.configurable,false);
  assert.ok(Object.keys(card).includes('equipment_id'));
  assert.equal({...card}.name,weapon.name);
  assert.deepEqual(Object.getOwnPropertyDescriptor(card,'suit'),originalDescriptor);
  assert.deepEqual(plain(card),plain(snapshot_card_face(card)));
  for (const key of ['face','printed','effective_function','virtual_id']) assert.equal(Object.hasOwn(card,key),false);
  assert.equal(plain(card).suit,'红桃');
  assert.equal(plain(card).equipment_id,weapon.equipment_id);
});

test('immutable original baseline is detached and preserved across copy and clear',()=>{
  const metadata={tags:['original'],nested:{value:1}};
  const card=physical({physical_metadata:metadata,source_urls:['https://example.invalid/printed']});
  const baseline=printed_card_fields(card);
  metadata.tags.push('later');metadata.nested.value=9;
  assert.deepEqual(baseline.physical_metadata,{tags:['original'],nested:{value:1}});
  assertDeepFrozen(baseline);
  assert.throws(()=>baseline.physical_metadata.tags.push('forged'),TypeError);
  set(card,weapon);
  assert.equal(printed_card_fields(card),baseline);
  assert.equal(card.source_urls[0],'https://example.invalid/weapon');
  assert.equal(clear_card_face(card),card);
  assert.equal(card.name,'闪');
  assert.equal(card.source_urls[0],'https://example.invalid/printed');
  assert.equal(card.equipment_id,undefined);
  assert.equal(card_face_record(card),null);
  assert.equal(printed_card_fields(card),baseline);
  assert.equal(clear_card_face(card),card,'clear is idempotent');
});

test('copied functional templates cannot import suit, ranks, physical IDs, gifts, materials, or derived flags',()=>{
  const materialArray=Object.freeze([]);
  const original={suit:'梅花',color:'黑',rank:7,physical_id:'material:real',derived_identity:'derived:real:1',
    gift_mark:false,derived:false,virtual:false,materials:materialArray,material_ids:['material:real'],
    acquisition_origin:'hand',lifecycle:{kind:'ordinary'},ordinary_deck:true,normal_random_deck_eligible:true};
  const card=physical(original);
  set(card,{...weapon,suit:'方块',color:'红',rank:1,physical_id:'template:physical',derived_identity:'derived:template:1',
    gift_mark:true,derived:true,virtual:true,materials:[],material_ids:['template:old'],
    acquisition_origin:'derived_reserve',lifecycle:{kind:'unique_derived'},ordinary_deck:false,normal_random_deck_eligible:false});
  for (const [key,value] of Object.entries(original)) assert.equal(card[key],value,key);
  for (const key of Object.keys(original)) assert.equal(Object.hasOwn(card_face_record(card).effective_function,key),false,key);
  assert.equal(card.materials,materialArray);
  assert.equal(card.equipment_id,weapon.equipment_id);
});

test('physical gift and derived marks persist even when the template omits them',()=>{
  const card=physical({gift_mark:true,derived_identity:'derived:sgs_piliche:1',physical_id:'p:one'});
  set(card,basic());
  assert.equal(card.gift_mark,true);
  assert.equal(card.derived_identity,'derived:sgs_piliche:1');
  assert.equal(card.physical_id,'p:one');
  clear_card_face(card);
  assert.equal(card.gift_mark,true);
  assert.equal(card.derived_identity,'derived:sgs_piliche:1');
});

test('copy-to-copy replaces the whole cache and removes stale equipment, source, and rule fields',()=>{
  const card=physical({id:'printed:gear',equipment_id:'printed:gear',slot:'armor',rule_type:'printed-delay'});
  set(card,weapon,'copy:weapon');
  const first=card_face_record(card);
  set(card,basic({nature:'fire',type:T.FIRE_SHA,name:'火杀'}),'copy:fire');
  assert.equal(card.name,'火杀');assert.equal(card.nature,'fire');
  for (const field of ['id','equipment_id','mechanism_id','slot','source_game','source_urls','source_variant','mechanism_signature','aliases','rule_type']) {
    assert.equal(card[field],undefined,field);
    assert.equal(Object.hasOwn(card_face_record(card).effective_function,field),false,field);
  }
  assert.equal(card_face_record(card).virtual_id,'copy:fire');
  assert.equal(first.virtual_id,'copy:weapon');
  assert.equal(first.effective_function.equipment_id,weapon.equipment_id,'old record is a stable snapshot');
  clear_card_face(card);
  assert.equal(card.equipment_id,'printed:gear');assert.equal(card.slot,'armor');assert.equal(card.rule_type,'printed-delay');
});

test('minimal definitions use Card defaults instead of leaking the original functional values',()=>{
  const card=physical({power:8,range:9,trait:'old-effect',description:'old-description'});
  set(card,{name:'桃',type:T.TAO});
  assert.equal(card.power,0);assert.equal(card.range,1);assert.equal(card.trait,'');assert.equal(card.description,'');
});

test('record and current-face snapshots are deeply immutable plain JSON data',()=>{
  const card=physical({gift_mark:true});
  const definition=structuredClone(weapon);
  set(card,definition);
  const record=card_face_record(card),snapshot=snapshot_card_face(card);
  definition.source_urls.push('https://example.invalid/forged');
  definition.mechanism_signature.limits.per_turn=77;
  assert.equal(card.source_urls.length,1);
  assert.equal(card.mechanism_signature.limits.per_turn,null);
  assert.equal(record.source_skill,'测试复制');assert.equal(card.source_skill,'测试复制');
  assert.equal(record.printed,printed_card_fields(card));
  assert.deepEqual(plain(record),record);
  assert.deepEqual(plain(snapshot),snapshot);
  assert.equal(Object.getPrototypeOf(record),Object.prototype);
  assertDeepFrozen(record);assertDeepFrozen(snapshot);
  clear_card_face(card);
  assert.equal(snapshot.name,weapon.name);
  assert.equal(snapshot.gift_mark,true);
  assert.equal(snapshot_card_face(card),printed_card_fields(card));
});

test('the complete equipment catalogs fit the whitelist without copying physical eligibility or provenance',()=>{
  for (const definition of [...EQUIPMENT_CATALOG,...MODE_EQUIPMENT_CATALOG,...YOUJIAN_EQUIPMENT_CATALOG,...DERIVED_EQUIPMENT_CATALOG]) {
    const card=physical({gift_mark:false});
    set(card,{...definition,equipment_id:definition.id},`copy:${definition.id}`);
    for (const key of ['name','type','trait','power','range','description']) assert.equal(card[key],definition[key],`${definition.name}: ${key}`);
    assert.equal(card.equipment_id,definition.id);
    assert.equal(card.suit,'红桃');assert.equal(card.rank,12);assert.equal(card.gift_mark,false);
    assert.equal(card.derived_identity,undefined);assert.equal(card.lifecycle,undefined);
    assert.deepEqual(card.source_urls,definition.source_urls);
    assert.deepEqual(plain(card_face_record(card)),card_face_record(card));
  }
});

test('legacy virtual views keep their exact material references and cannot be re-faced',()=>{
  const material=physical(),materials=[material];
  const virtual=Object.assign(Object.create(Card.prototype),printed,{name:'杀',type:T.SHA,virtual:true,materials});
  assert.equal(prepare_card_face(virtual),virtual);
  Object.freeze(virtual);
  assert.equal(virtual.materials,materials);assert.equal(virtual.materials[0],material);
  assert.equal(Object.hasOwn(Object.getOwnPropertyDescriptor(virtual,'name'),'value'),true);
  assert.equal(printed_card_fields(virtual).materials,materials);
  assert.equal(card_face_record(virtual),null);
  assert.equal(clear_card_face(virtual),virtual);
  assert.throws(()=>set(virtual),/prepared physical Card/);
});

test('preparation must happen before freeze and rejects unsupported targets without mutations',()=>{
  const unprepared=Object.freeze({...printed});
  assert.throws(()=>prepare_card_face(unprepared),/before the Card is frozen/);
  assert.throws(()=>set(unprepared),/prepared physical Card/);
  assert.throws(()=>printed_card_fields(unprepared),/not prepared/);
  for (const input of [null,undefined,4,'card',[]]) assert.throws(()=>prepare_card_face(input),TypeError);
  const card={...printed};Object.defineProperty(card,'name',{value:'闪',enumerable:true,configurable:false});
  assert.throws(()=>prepare_card_face(card),/configurable/);
  assert.equal(Object.hasOwn(Object.getOwnPropertyDescriptor(card,'type'),'value'),true);
  assert.equal(card_face_record(card),null);
});

test('plain-data enforcement rejects accessors without running them, even on excluded template fields',()=>{
  const card=physical();set(card);
  const initial=card_face_record(card);let reads=0;
  for (const key of ['name','source_urls','materials','gift_mark','unknown']) {
    const input=basic();Object.defineProperty(input,key,{get(){reads++;return 'bad';},enumerable:true});
    assert.throws(()=>set(card,input),/enumerable data/);
    assert.equal(reads,0);assert.equal(card_face_record(card),initial);
  }
  const nested=basic({source_rules:{}});
  Object.defineProperty(nested.source_rules,'x',{get(){reads++;return 1;},enumerable:true});
  assert.throws(()=>set(card,nested),/enumerable data/);assert.equal(reads,0);
  const options={virtual_id:'copy:new'};
  Object.defineProperty(options,'source_skill',{get(){reads++;return 'bad';},enumerable:true});
  assert.throws(()=>set_card_face(card,basic(),options),/enumerable data/);assert.equal(reads,0);
});

test('plain-data enforcement rejects functions, class instances, symbols, cycles, and non-JSON numbers atomically',()=>{
  const card=physical();set(card,weapon);
  const record=card_face_record(card);
  const cyclic={};cyclic.self=cyclic;
  class Foreign {constructor(){this.value=1;}}
  for (const value of [()=>1,undefined,NaN,Infinity,-Infinity,-0,1n,Symbol('x'),new Date(),new Foreign(),cyclic]) {
    assert.throws(()=>set(card,basic({unknown:value})),TypeError);
    assert.equal(card_face_record(card),record);
  }
  const symbolKey=basic();symbolKey[Symbol('secret')]=1;
  assert.throws(()=>set(card,symbolKey),/symbol/);
  const hidden=basic();Object.defineProperty(hidden,'secret',{value:1});
  assert.throws(()=>set(card,hidden),/enumerable data/);
  const inherited=Object.assign(Object.create({name:'杀'}),{type:T.SHA});
  assert.throws(()=>set(card,inherited),/plain data object/);
  let calls=0;
  assert.throws(()=>set(card,basic({toJSON(){calls++;return {};}})),/plain JSON data/);
  assert.equal(calls,0);assert.equal(card_face_record(card),record);
});

test('strict arrays reject holes, accessor elements, extra properties, and subclasses without executing code',()=>{
  const card=physical();let calls=0;
  const sparse=new Array(2);
  const accessor=[0];Object.defineProperty(accessor,'0',{get(){calls++;return 1;},enumerable:true});
  const extra=[];extra.label='x';
  class OtherArray extends Array {}
  for (const value of [sparse,accessor,extra,new OtherArray('x')]) assert.throws(()=>set(card,basic({aliases:value})),TypeError);
  assert.equal(calls,0);assert.equal(card_face_record(card),null);
});

test('invalid markers and core fields fail before replacing a valid active face',()=>{
  const card=physical();set(card,weapon);const record=card_face_record(card);
  for (const marker of [undefined,{},[],{virtual_id:''},{virtual_id:NaN},{virtual_id:-0},{virtual_id:'next',source_skill:4},{virtual_id:'next',unexpected:true}]) {
    assert.throws(()=>set_card_face(card,basic(),marker),TypeError);
    assert.equal(card_face_record(card),record);
  }
  for (const fields of [{name:''},{type:''},{range:'4'},{power:'2'},{trait:3},{description:4}]) {
    assert.throws(()=>set(card,basic(fields)),TypeError);assert.equal(card_face_record(card),record);
  }
  assert.equal(set_card_face(card,basic(),{virtual_id:0}),card);
  assert.equal(card_face_record(card).virtual_id,0);assert.equal(card_face_record(card).source_skill,null);
});

test('printed baseline validation is atomic, never executes accessors, and handles undefined optional spread fields',()=>{
  let reads=0;const bad={...printed};
  Object.defineProperty(bad,'rank',{get(){reads++;return 1;},enumerable:true});
  assert.throws(()=>prepare_card_face(bad),/enumerable data/);assert.equal(reads,0);
  assert.equal(Object.hasOwn(Object.getOwnPropertyDescriptor(bad,'name'),'value'),true);
  assert.equal(card_face_record(bad),null);
  const first=physical();const spread={...first};
  assert.equal(Object.hasOwn(spread,'equipment_id'),true);
  const next=Object.assign(Object.create(Card.prototype),spread);
  prepare_card_face(next);Object.freeze(next);
  assert.deepEqual(printed_card_fields(next),printed);
  assert.deepEqual(plain(next),printed);
});

test('plain null-prototype definitions and shared subobjects are copied safely',()=>{
  const card=physical(),shared={value:1};
  const definition=Object.assign(Object.create(null),basic(),{source_rules:{first:shared,second:shared}});
  set(card,definition);
  assert.deepEqual(card.source_rules,{first:{value:1},second:{value:1}});
  assertDeepFrozen(card.source_rules);
  assert.equal({}.value,undefined);
});
