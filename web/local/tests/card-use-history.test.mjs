/** Controlled host-contract tests for an UNWIRED history primitive.
 * Real Card/deck/equipment data are used; no test claims a Game commit hook.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Card,CardType as T,CardSuit as S,Deck,SeededRNG} from '../models.js';
import {printed_card_fields} from '../card-face-projection.js';
import {EQUIPMENT_CATALOG,equipment_definition} from '../equipment-catalog.mjs';
import {create_card_use_history,begin_card_use_turn,end_card_use_turn,record_card_use_event,
  latest_card_use,restore_card_use_history,snapshot_card_function,snapshot_card_use_material,
  snapshot_card_use_metadata,classify_card_use_event} from '../card-use-history.js';

const card = (name=T.SHA,type=name,options={})=>new Card(name,type,{suit:S.SPADE,color:'黑',rank:7,...options});
// The pure journal intentionally rejects arbitrary accessors. Physical Cards
// now expose code-owned face getters; fixtures explicitly supply their detached
// printed data without weakening the journal's plain-data boundary.
const fields = c=>c instanceof Card ? printed_card_fields(c) : c;
const metadata = c=>snapshot_card_use_metadata(fields(c));
const func = (c,category='basic',rule_id=`test.function.${c.name}`)=>snapshot_card_function(fields(c),{category,rule_id});
const material = (c,physical_id='physical:1',options={})=>snapshot_card_use_material(fields(c),{
  physical_id,owner_id:'actor:A',zone:'hand',visibility:'public',effective_metadata:metadata(c),...options});
const initial = ()=>begin_card_use_turn(create_card_use_history(),{turn_id:'turn:1',turn_owner_id:'actor:A'});
const event = (use_id='use:1',commit_seq=1,options={})=>{
  const c=card();
  return {kind:'card_use',stage:'committed',event_id:`commit:${use_id}`,use_id,parent_use_id:null,
    turn_id:'turn:1',turn_owner_id:'actor:A',actor_id:'actor:A',commit_seq,
    effective_function:func(c),effective_metadata:metadata(c),materials:[material(c,`physical:${use_id}`)],
    provenance:{kind:'physical'},...options};
};
const add = (h,e)=>record_card_use_event(h,e).history;
const latest = (h,options={})=>latest_card_use(h,{actor_id:'actor:A',turn_id:'turn:1',selection:'latest_any',...options});
const clone = value=>JSON.parse(JSON.stringify(value));

test('controlled contract: every real ordinary deck function has a detached category snapshot',()=>{
  const deck = new Deck(new SeededRNG(1401)),seen=new Map();
  let h=initial(),sequence=0;
  for (const c of deck.draw_pile) {
    if (seen.has(c.name)) continue;
    const equipment=[T.WEAPON,T.ARMOR,T.OFFENSIVE_HORSE,T.DEFENSIVE_HORSE].includes(c.type);
    const delayed=['手捧雷','画地为牢','兵粮寸断'].includes(c.name);
    // This table labels the known fixture deck, not a production category guess.
    const category=equipment?'equipment':delayed?'delayed_trick':c.type===T.SCROLL?'trick':'basic';
    const f=func(c,category,c.equipment_id??c.id??`test.function.${c.name}`);
    h=add(h,event(`deck:${++sequence}`,sequence,{effective_function:f,effective_metadata:metadata(c),materials:[material(c,`deck-physical:${sequence}`)]}));
    assert.deepEqual(latest(h).effective_function,f);
    assert.equal(latest(h).effective_function.suit,undefined);
    assert.equal(latest(h).effective_function.rank,undefined);
    seen.set(c.name,category);
  }
  for(const name of ['杀','火杀','雷杀','闪','桃','酒'])assert.equal(seen.get(name),'basic');
  for(const name of ['决斗','无中生有','无懈可击','借刀杀人','铁索连环','万箭齐发','烽火狼烟'])assert.equal(seen.get(name),'trick');
  for(const name of ['手捧雷','画地为牢','兵粮寸断'])assert.equal(seen.get(name),'delayed_trick');
  for(const spec of EQUIPMENT_CATALOG)assert.equal(seen.get(spec.name),'equipment');
  assert.equal(h.uses.length,seen.size);
});

test('new rule IDs/functions are accepted without a playable-card whitelist',()=>{
  const c=card('未来牌','新基本种类',{nature:'custom'});
  const h=add(initial(),event('new',1,{effective_function:func(c,'basic','extension.future-card')}));
  assert.equal(latest(h).effective_function.rule_id,'extension.future-card');
  assert.equal(latest(h).effective_function.nature,'custom');
});

test('equipment preserves intrinsic fields and provenance without retaining catalog objects',()=>{
  const spec=equipment_definition('虎符');
  const c=card(spec.name,spec.type,{...spec,equipment_id:spec.id});
  const f=func(c,'equipment',spec.id);
  const h=add(initial(),event('equipment',1,{effective_function:f,materials:[material(c)],
    provenance:{kind:'physical',source_game:spec.source_game,source_version:spec.source_version,source_rule_id:spec.id,source_urls:[...spec.source_urls]}}));
  assert.equal(latest(h).effective_function.equipment_id,spec.id);
  assert.equal(latest(h).effective_function.trait,spec.trait);
  assert.equal(latest(h).effective_function.range,spec.range);
  assert.equal(latest(h).effective_function.mechanism_signature,undefined);
  assert.deepEqual(latest(h).provenance.source_urls,spec.source_urls);
});

test('converted effective function remains separate from printed and owner-effective material metadata',()=>{
  const source=card('黑色防具',T.ARMOR,{rank:12});
  const effective=card('火杀',T.FIRE_SHA,{nature:'fire',suit:S.HEART,color:'红',rank:12,virtual:true,materials:[source]});
  const h=add(initial(),event('converted',1,{effective_function:func(effective,'basic','sgs.shared.basic.fire-sha'),
    effective_metadata:metadata(effective),materials:[material(source,'armor:1',{zone:'armor',effective_metadata:metadata(effective)})],
    provenance:{kind:'converted',source_skill_id:'test.conversion',source_game_lineage:{source_game:'test',source_version:'1',source_rule_id:'test.fire',source_skill:'转换'}}}));
  const r=latest(h);
  assert.equal(r.effective_function.name,'火杀');assert.equal(r.effective_function.nature,'fire');
  assert.equal(r.materials[0].printed.name,'黑色防具');assert.equal(r.materials[0].printed.color,'黑');
  assert.equal(r.materials[0].effective.color,'红');assert.equal(r.effective_metadata.rank,12);
  assert.equal(r.effective_function.materials,undefined);assert.equal(r.effective_function.color,undefined);
  // A future copy takes NEW material metadata; the template retains no old suit.
  const next=card('闪',T.SHAN,{suit:S.DIAMOND,color:'红',rank:3});
  const copied=add(h,event('copy',2,{effective_function:r.effective_function,effective_metadata:metadata(next),materials:[material(next,'new:material')],
    provenance:{kind:'converted',copied_from_use_id:r.use_id}}));
  assert.equal(latest(copied).effective_metadata.rank,3);assert.equal(latest(copied).effective_function.name,'火杀');
});

test('genuine no-material virtual use records a function, but direct skill damage does not',()=>{
  const h=add(initial(),event('virtual',1,{materials:[],effective_metadata:{suit:null,color:null,rank:null},provenance:{kind:'virtual',source_skill:'筹略'}}));
  assert.deepEqual(latest(h).materials,[]);assert.equal(latest(h).effective_metadata.rank,null);
  assert.equal(record_card_use_event(h,{kind:'skill_effect',stage:'committed'}).history,h);
});

test('host-declared genuine use in a response window is recorded without inferring a historical skill ruling',()=>{
  const counter=card('无懈可击',T.SCROLL);
  let h=add(initial(),event('root',1));
  h=add(h,event('counter-use',2,{parent_use_id:'root',window:'response',effective_function:func(counter,'trick')}));
  assert.equal(latest(h).use_id,'counter-use');
  assert.equal(latest(h,{selection:'outermost'}).use_id,'root');
  assert.equal(add(h,event('pure-response',3,{kind:'respond',window:'response'})),h);
});

test('pure response, gift, recast, judgment, compare, discard, reveal and moves never update history',()=>{
  const h=add(initial(),event());
  for(const kind of ['respond','give','recast','judgment','discard','compare','reveal','skill_effect','move']) {
    const result=record_card_use_event(h,event(`ignored:${kind}`,20,{kind}));
    assert.equal(result.record,null);assert.equal(result.history,h);assert.equal(result.recorded,false);
    assert.equal(result.reason,'not_card_use');
  }
  assert.equal(latest(h).use_id,'use:1');
});

test('declared, validated, rejected, aborted-before-use and finish notifications are absent',()=>{
  let h=initial();
  for(const stage of ['declared','validated','rejected','aborted','finished']) {
    const r=record_card_use_event(h,event('same-attempt',1,{stage}));
    assert.equal(r.history,h);assert.equal(h.uses.length,0);assert.equal(latest(h),null);
  }
  h=add(h,event('same-attempt',1));
  assert.equal(h.uses.length,1,'declarations did not reserve or spend a use');
});

test('unknown taxonomy is rejected rather than inferred from card name or hand movement',()=>{
  for(const input of [{kind:'sha',stage:'committed'},{kind:'card_use',stage:'used'},{stage:'committed'},{kind:'card_use'}]) {
    assert.throws(()=>classify_card_use_event(input),TypeError);
  }
});

test('committed but counterspelled/ineffective use still counts; later finish cannot overwrite it',()=>{
  const c=card('无中生有',T.SCROLL);
  const a=event('trick',1,{effective_function:func(c,'trick'),resolution:'nullified'});
  const h=add(add(initial(),a),event('later',2));
  assert.equal(h.uses[0].use_id,'trick');assert.equal(h.uses[0].resolution,undefined);
  const r=record_card_use_event(h,{...a,event_id:'finish:trick',stage:'finished'});
  assert.equal(r.history,h);assert.equal(latest(h).use_id,'later');
});

test('exact duplicates preserve state, sequence and card count, including after JSON restore',()=>{
  const e=event(),first=record_card_use_event(initial(),e);
  for(const h of [first.history,restore_card_use_history(clone(first.history))]) {
    const again=record_card_use_event(h,clone(e));
    assert.equal(again.history,h);assert.equal(again.record,h.uses[0]);assert.equal(again.duplicate,true);
    assert.equal(again.recorded,false);assert.equal(h.uses.length,1);
  }
});

test('same event/use identity cannot be rebound to actor, turn, order, function, cost or provenance',()=>{
  const e=event(),h=add(initial(),e);
  const alterations=[{actor_id:'actor:B'},{turn_id:'turn:2'},{turn_owner_id:'actor:B'},
    {commit_seq:2},{parent_use_id:'other'},{event_id:'other-event'},{use_id:'other-use'},
    {effective_function:func(card(T.TAO))},{effective_metadata:{suit:S.HEART,color:'红',rank:7}},
    {materials:[material(card(),'different-physical')]},{provenance:{kind:'converted',source_skill:'different'}},
    {kind:'respond'},{stage:'aborted'}];
  for(const change of alterations)assert.throws(()=>record_card_use_event(h,{...e,...change}),TypeError,JSON.stringify(change));
  assert.equal(h.uses.length,1);
});

test('different uses cannot share commit order; explicit order handles delayed same-turn delivery',()=>{
  let h=add(initial(),event('newer',3));
  h=add(h,event('older',1));
  assert.deepEqual(h.uses.map(u=>u.use_id),['older','newer']);assert.equal(latest(h).use_id,'newer');
  assert.throws(()=>add(h,event('collision',3)),/commit_seq/);
});

test('latest-any and outermost are explicit and differ for a pursuit new use',()=>{
  let h=add(initial(),event('original',1));
  h=add(h,event('pursuit',2,{parent_use_id:'original'}));
  assert.equal(latest(h).use_id,'pursuit');assert.equal(latest(h,{selection:'outermost'}).use_id,'original');
  assert.throws(()=>latest_card_use(h,{actor_id:'actor:A',turn_id:'turn:1'}),/selection policy/);
  assert.throws(()=>latest(h,{selection:'latest_owner_root'}),/selection policy/);
});

test('borrowed-sword nested use belongs to the weapon holder, not the caster or current seat',()=>{
  const borrow=card('借刀杀人',T.SCROLL);
  let h=add(initial(),event('borrow',1,{effective_function:func(borrow,'trick')}));
  h=add(h,event('holder-sha',2,{actor_id:'actor:B',parent_use_id:'borrow',materials:[material(card(),'holder:card',{owner_id:'actor:B'})]}));
  assert.equal(latest(h).use_id,'borrow');
  assert.equal(latest(h,{actor_id:'actor:B'}).use_id,'holder-sha');
  assert.equal(latest(h,{actor_id:'actor:B',selection:'outermost'}),null);
  assert.equal(latest(h,{actor_id:'actor:B',require_own_turn:true}),null);
});

test('one compound two-material conversion is one use; two target branches are not two uses',()=>{
  const a=card(T.SHAN),b=card(T.TAO,T.TAO,{suit:S.HEART,color:'红'});
  const e=event('compound',1,{materials:[material(a,'mat:A'),material(b,'mat:B')],
    effective_metadata:{suit:null,color:'红',rank:null},provenance:{kind:'converted',source_skill:'芦叶枪'},targets:['B','C']});
  const h=add(initial(),e);
  assert.equal(h.uses.length,1);assert.equal(latest(h).materials.length,2);assert.equal(latest(h).targets,undefined);
  assert.equal(record_card_use_event(h,{...e,targets:['C']}).duplicate,true,'branch/target callback cannot append another use');
});

test('parent identity is required; unknown, self, later and cross-turn parents are rejected',()=>{
  let h=add(initial(),event('root',4));
  for(const patch of [{parent_use_id:undefined},{parent_use_id:'missing'},{parent_use_id:'child'},{parent_use_id:'root',commit_seq:3}]) {
    assert.throws(()=>add(h,event('child',5,patch)),TypeError);
  }
  h=begin_card_use_turn(h,{turn_id:'turn:2',turn_owner_id:'actor:A'});
  assert.throws(()=>add(h,event('next',6,{turn_id:'turn:2',parent_use_id:'root'})),/same full turn/);
});

test('history is available before skill acquisition and survives hero/seat changes with the same actor ID',()=>{
  const actor={id:'physical-actor:A',hero:'花木兰',seat:0,skills:[]};
  const h=add(initial(),event('before-skill',1,{actor_id:actor.id}));
  actor.hero='曹操';actor.skills.push('奸雄');actor.seat=2;
  assert.equal(latest(h,{actor_id:actor.id}).use_id,'before-skill');
  assert.equal(latest(h,{actor_id:'曹操'}),null);
  assert.equal(latest(h,{actor_id:'actor:B'}),null);
});

test('extra play phases retain history, but ended/aborted/full new turns expire reads without mutation',()=>{
  for(const status of ['ended','aborted']) {
    const original=add(initial(),event()),before=JSON.stringify(original);
    assert.equal(latest(original,{phase:'extra-play-phase'}).use_id,'use:1');
    assert.equal(latest(original,{turn_id:'turn:next'}),null);assert.equal(JSON.stringify(original),before);
    const ended=end_card_use_turn(original,{turn_id:'turn:1',status});
    assert.equal(latest(ended),null);assert.equal(ended.uses.length,1);
    assert.equal(end_card_use_turn(ended,{turn_id:'turn:1',status}),ended);
    assert.equal(begin_card_use_turn(ended,{turn_id:'turn:1',turn_owner_id:'actor:A'}),ended,'replayed begin cannot resurrect a turn');
    assert.equal(record_card_use_event(ended,event()).duplicate,true,'late exact receipt is harmless');
    assert.throws(()=>add(ended,event('late-new',2)),/expired turn/);
    const next=begin_card_use_turn(ended,{turn_id:'turn:2',turn_owner_id:'actor:A'});
    assert.equal(latest(next,{turn_id:'turn:2'}),null);assert.equal(latest(next),null);
  }
});

test('beginning another full turn expires active history; globally ordered commits cannot run backwards',()=>{
  let h=add(initial(),event('first',10));
  h=begin_card_use_turn(h,{turn_id:'turn:2',turn_owner_id:'actor:B'});
  assert.equal(h.turns[0].status,'ended');assert.equal(latest(h),null);
  assert.throws(()=>add(h,event('second',9,{turn_id:'turn:2',turn_owner_id:'actor:B'})),/turn boundaries/);
  h=add(h,event('second',11,{turn_id:'turn:2',turn_owner_id:'actor:B',actor_id:'actor:B'}));
  assert.equal(latest(h,{actor_id:'actor:B',turn_id:'turn:2',require_own_turn:true}).use_id,'second');
});

test('turn IDs and terminal turn receipts are replay-safe, never silently reassigned',()=>{
  let h=initial();
  assert.equal(begin_card_use_turn(h,{turn_id:'turn:1',turn_owner_id:'actor:A'}),h);
  assert.throws(()=>begin_card_use_turn(h,{turn_id:'turn:1',turn_owner_id:'actor:B'}),/different owner/);
  assert.throws(()=>end_card_use_turn(h,{turn_id:'unknown',status:'ended'}),/unknown turn/);
  h=end_card_use_turn(h,{turn_id:'turn:1',status:'aborted'});
  assert.throws(()=>end_card_use_turn(h,{turn_id:'turn:1',status:'ended'}),/changed its status/);
});

test('all identity fields require explicit stable IDs; numeric and string IDs remain distinct',()=>{
  for(const bad of [undefined,null,'',' ',NaN,Infinity,1.5,{},()=>1,BigInt(1),-0]) {
    for(const field of ['event_id','use_id','actor_id','turn_id','turn_owner_id'])assert.throws(()=>add(initial(),event('a',1,{[field]:bad})),TypeError);
  }
  let h=begin_card_use_turn(create_card_use_history(),{turn_id:0,turn_owner_id:0});
  h=add(h,event(0,1,{event_id:0,actor_id:0,turn_id:0,turn_owner_id:0}));
  assert.equal(latest(h,{actor_id:0,turn_id:0}).use_id,0);assert.equal(latest(h,{actor_id:'0',turn_id:0}),null);
});

test('cost physical identities are mandatory, unique per use, and never inferred from equipment/rule ID',()=>{
  const c=card('虎符',T.WEAPON,{equipment_id:'rule.hufu',id:'rule.hufu'});
  assert.throws(()=>snapshot_card_use_material(c,{owner_id:'A',zone:'hand',visibility:'public',effective_metadata:metadata(c)}),/physical_id/);
  assert.throws(()=>add(initial(),event('dup-cost',1,{materials:[material(c,'same'),material(c,'same')],provenance:{kind:'converted'}})),/same physical/);
  assert.throws(()=>material(card(T.SHA,T.SHA,{virtual:true})),/virtual projection/);
  for(const patch of [{materials:[]},{materials:[],provenance:{kind:'converted'}},{provenance:{kind:'virtual'}}])assert.throws(()=>add(initial(),event('cost',1,patch)),TypeError);
});

test('history snapshots do not move, clone or consume physical cards or retain zone arrays',()=>{
  const c=card(),zones={hand:[c],processing:[],discard:[]},references=[...zones.hand],serialized=JSON.stringify(zones);
  const h=add(initial(),event('conserve',1,{materials:[material(c)],hand:zones.hand,processing:zones.processing}));
  const beforeRead=JSON.stringify(h);latest(h);restore_card_use_history(clone(h));
  assert.equal(JSON.stringify(zones),serialized);assert.equal(zones.hand[0],references[0]);
  assert.equal(zones.processing.length,0);assert.equal(zones.discard.length,0);assert.equal(JSON.stringify(h),beforeRead);
  assert.notEqual(latest(h).materials[0].printed,c);assert.equal(latest(h).materials[0].printed instanceof Card,false);
  assert.equal(latest(h).hand,undefined);
});

test('same physical card can back a later real use after host-controlled recovery, with a new use identity',()=>{
  const c=card(),m=material(c,'physical:reused');
  const h=add(add(initial(),event('first',1,{materials:[m]})),event('second',2,{materials:[m]}));
  assert.equal(h.uses.length,2);assert.equal(latest(h).use_id,'second');
  assert.equal(h.uses[0].materials[0].physical_id,h.uses[1].materials[0].physical_id);
  assert.equal(c.virtual,undefined,'journal creates descriptors, never replacement physical cards');
});

test('snapshots strip hands, targets, temporary flags, outcomes and callbacks without calling them',()=>{
  let called=0;
  const c={...fields(card(T.FIRE_SHA,T.FIRE_SHA,{nature:'fire'})),damage_bonus:3,dodge_blocked:true,targets:['hidden-player'],
    hand:[card('SECRET')],resolve(){called++;},toJSON(){called++;return 'SECRET';}};
  const p={kind:'physical',source_game_lineage:{source_game:'test',hand:['SECRET'],callback(){called++;}},callback(){called++;}};
  const h=add(initial(),event('sanitized',1,{effective_function:func(c),provenance:p,callbacks:[()=>called++],hand:['SECRET'],wine_bonus:3}));
  const output=JSON.stringify(h);
  assert.equal(called,0);assert.ok(!output.includes('SECRET'));
  for(const name of ['damage_bonus','dodge_blocked','targets','callback','wine_bonus'])assert.ok(!output.includes(name));
});

test('opaque costs retain provenance without copying hidden card names, colors or ranks',()=>{
  const secret=card('SECRET',T.TAO);
  const cost=material(secret,'opaque:1',{visibility:'opaque',effective_metadata:undefined});
  assert.equal(cost.printed,null);assert.equal(cost.effective,null);
  const h=add(initial(),event('opaque',1,{materials:[cost]}));
  assert.ok(!JSON.stringify(h).includes('SECRET'));
  assert.throws(()=>add(initial(),event('leak',1,{materials:[{...cost,printed:{name:'SECRET'}}]})),/hidden metadata/);
});

test('invalid schema values/functions/accessors cannot become silent JSON nulls or executable descriptors',()=>{
  for(const rank of [undefined,0,14,1.2,NaN,Infinity,'K'])assert.throws(()=>snapshot_card_use_metadata({suit:null,color:null,rank}),TypeError);
  for(const patch of [{power:NaN},{range:Infinity},{nature:()=>1},{trait:{}},{effect_id:Symbol('x')}])assert.throws(()=>func({...card(),...patch}),TypeError);
  let called=0;const accessor={...card()};Object.defineProperty(accessor,'name',{get(){called++;return 'not data';}});
  assert.throws(()=>snapshot_card_function(accessor,{category:'basic',rule_id:'test.accessor'}),/accessor/);assert.equal(called,0);
  assert.throws(()=>add(initial(),event('bad-provenance',1,{provenance:{kind:'physical',source_urls:[()=>1]}})),TypeError);
  assert.throws(()=>latest(initial(),{require_own_turn:'yes'}),/boolean/);
  const sparse=new Array(1);
  assert.throws(()=>add(initial(),event('sparse',1,{materials:sparse})),/holes/);
  const getterArray=[];Object.defineProperty(getterArray,'0',{get(){called++;return material(card());}});
  assert.throws(()=>add(initial(),event('accessor-array',1,{materials:getterArray})),/accessors/);assert.equal(called,0);
});

test('output snapshots and restored state are deeply immutable and detached from input',()=>{
  const e=event('detached',1,{provenance:{kind:'physical',source_urls:['https://example.test/rule']}});
  const h=add(initial(),e),before=JSON.stringify(h);
  e.provenance.source_urls.push('hidden');e.actor_id='replacement';
  assert.equal(JSON.stringify(h),before);
  assert.throws(()=>h.uses.push({}),TypeError);assert.throws(()=>latest(h).provenance.source_urls.push('x'),TypeError);
  const raw=clone(h),restored=restore_card_use_history(raw);raw.uses[0].actor_id='changed';
  assert.equal(JSON.stringify(restored),before);assert.ok(Object.isFrozen(restored.uses[0].materials[0].printed));
  assert.throws(()=>latest_card_use(raw,{actor_id:'actor:A',turn_id:'turn:1',selection:'latest_any'}),/restore/);
});

test('restore rejects corrupt identity, ordering, turn, parent, version and hidden-material payloads',()=>{
  let h=add(initial(),event('root',1));h=add(h,event('child',2,{parent_use_id:'root'}));
  const mutations=[s=>s.version=99,s=>s.current_turn_id='absent',s=>s.turns.push({...s.turns[0]}),
    s=>s.uses.push({...s.uses[0]}),s=>s.uses[1].commit_seq=1,s=>s.uses[1].parent_use_id='child',
    s=>s.uses[1].parent_use_id='missing',s=>s.uses[1].turn_owner_id='wrong',s=>s.uses[1].turn_id='absent',
    s=>s.turns[0].status='ended',s=>s.uses[1].materials[0].visibility='opaque'];
  for(const change of mutations){const s=clone(h);change(s);assert.throws(()=>restore_card_use_history(s),TypeError);}
  const reordered=clone(h);reordered.uses.reverse();assert.deepEqual(restore_card_use_history(reordered),h);
});

test('independent module has no production registrations, model creation, card moves or hero gates',async()=>{
  const source=await readFile(new URL('../card-use-history.js',import.meta.url),'utf8');
  assert.ok(!/^import /m.test(source));assert.ok(!/new Card\(|Game\.prototype|register.*skill|actor\.hero/.test(source));
});
