/** Independent release boundary checks. Real LocalMatch journals and Game APIs;
 * controlled combat fixtures are explicitly separate from save/replay tests. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../game.js';
import {LocalMatch,SAVE_KEY,PREVIOUS_SAVE_KEY,ENGINE_VERSION,CONTENT_VERSION} from '../session.js';
import {Card,CardType as T,CardSuit as S,Player,HEROES,HERO_SOURCE_MERGES,HERO_ORIGINAL_MERGES,DERIVED_HEROES,WANGYUN_HEROES,SGS_ZHANGFEN_HEROES,hero_by_id,canonical_hero_for_source,hero_source_context,Deck,SeededRNG,suit_color} from '../models.js';
import {CONTENT_PACKS,normalize_content_packs,ZHUQUE_EQUIPMENT_PACK_ID,YOUJIAN_EQUIPMENT_PACK_ID} from '../content-packs.js';
import {SANJIAN_PACK_ID} from '../sanjian-catalog.mjs';
import {EQUIPMENT_CATALOG,equipment_definition} from '../equipment-catalog.mjs';
import {DERIVED_EQUIPMENT_CATALOG} from '../derived-equipment.mjs';
import {WANGYUN_TRICK_CATALOG,QIBAO_RULES} from '../wangyun-card-effects.js';
import {ZHANGFEN_EQUIPMENT_CATALOG} from '../sgs-zhangfen-data.js';
import {CARD_HISTORY_FUNCTIONS,card_history_definition} from '../game-card-history.js';
import {skill_hooks_for_hero,active_skills_for_hero} from '../skills.js';
import {skillsForHero} from '../../public/skill-catalog.js';
import {eighthDependencies} from '../yxs-eighth-runtime.js';
import {yxs_resolve_yizhuang,yxs_yizhuang_materials} from '../yxs-eighth-skills.js';
import {rule_hero} from '../effective-hero.js';
import {ai_try_active_skill,ai_borrowed_weapon_plan} from '../ai.js';

const EXCLUDED=['sgs.mobile.base.hero.liu-ye','sgs.mobile.hero.wangyun.20231207','sgs.mobile.derived.hero.zhang-fen'];
const OLD_PACKS=[ZHUQUE_EQUIPMENT_PACK_ID,YOUJIAN_EQUIPMENT_PACK_ID,SANJIAN_PACK_ID];
const BASIC='jianghu.classic.hero.jiang-wei',CAO='yxs.adapted.base.hero.cao-cao',HUA='yxs.adapted.base.hero.hua-mu-lan';
const SPECIAL_NAMES=[...DERIVED_EQUIPMENT_CATALOG,...ZHANGFEN_EQUIPMENT_CATALOG,QIBAO_RULES,...WANGYUN_TRICK_CATALOG.filter(c=>!['五谷丰登','桃园结义'].includes(c.name))].map(c=>c.name);
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const H=id=>{const h=hero_by_id(id);assert.ok(h,`registered ${id}`);return h;};
const plain=value=>JSON.parse(JSON.stringify(value));
const memory=(entries=[])=>{const data=new Map(entries);return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
function matchFixture(t,storage=memory()){
 const errors=[],messages=[],m=new LocalMatch({storage,onError:e=>errors.push(e),onMessage:e=>messages.push(e)});t.after(()=>m.close());return {m,storage,errors,messages};
}
function C(name='闪',suit=S.SPADE,extra={}){const d=CARD_HISTORY_FUNCTIONS.find(d=>d.name===name);assert.ok(d,name);return new Card(name,d.type,{...d,suit,color:suit_color(suit),rank:7,...extra});}
function E(name){const d=equipment_definition(name);assert.ok(d,name);return new Card(d.name,d.type,{...d,equipment_id:d.id,suit:S.CLUB,color:'黑',rank:7});}
function gameFixture({ids=[CAO,BASIC,BASIC],actor=0,human=[],answers=[]}={}){
 const queue=[...answers],events=[],g=new Game({emit:(message,meta)=>events.push({message,meta}),async ask_line(message,options={}){assert.ok(queue.length,`Unexpected prompt: ${message} ${JSON.stringify(options)}`);return String(queue.shift());},async ask_confirm(message,options){return ['y','1'].includes(await this.ask_line(message,options));}},{seed:1016});
 const players=ids.map((id,i)=>new Player(`seat${i+1}`,H(id),!human.includes(i)));[g.player,g.ai,g.ai2]=players;[g.p1,g.p2,g.p3]=players;Object.assign(g,{mode:'1v2',turn_actor:`p${actor+1}`,turn_phase:'play',round_no:1,turn_event_counter:1,play_phase_event_counter:1});g.deck.draw_pile=[];g.deck.discard_pile=[];g.begin_history_turn(players[actor],'scope-turn:1');return {g,players,a:players[actor],p:players[0],b:players[1],c:players[2],queue,events};
}
function priorUse(g,actor,name){const c=C(name,S.HEART,{virtual:true,materials:[]});const scope=g.start_card_use(actor,c,{materials:[],sourceZones:[]});g.end_card_use(scope);return scope.record;}
function physical(g){return [...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...g.offboard_cards,...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...slots.map(s=>p[s]).filter(Boolean),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...(p.sgs_painting_pile??[])])];}
function untouched(m,storage,before){assert.equal(storage.getItem(SAVE_KEY),before.bytes);assert.equal(m.game,before.game);assert.equal(m.pending,before.pending);assert.equal(m._running,true);assert.deepEqual(m.snapshot(),before.snapshot);}
function capture(m,storage){return {bytes:storage.getItem(SAVE_KEY),game:m.game,pending:m.pending,snapshot:m.snapshot()};}

// Scope is asserted through live exported APIs, with no retired positional IDs.
test('conventional roster has 121 canonical choices and 194 guides; retired IDs cannot resolve or dispatch',()=>{
 assert.equal(HEROES.length,121);assert.equal(new Set(HEROES.map(h=>h.id)).size,121);assert.equal(HEROES.flatMap(skillsForHero).length,194);assert.deepEqual(LocalMatch.heroes().map(h=>h.id),HEROES.map(h=>h.id));
 for(const h of [...DERIVED_HEROES,...WANGYUN_HEROES,...SGS_ZHANGFEN_HEROES].filter(h=>EXCLUDED.includes(h.id))){assert.equal(hero_by_id(h.id),null);assert.equal(canonical_hero_for_source(h.id),null);assert.equal(skill_hooks_for_hero(h),null);assert.deepEqual(active_skills_for_hero(h),[]);assert.deepEqual(skillsForHero(h),[]);assert.equal(hero_source_context(h),null,'retired source cannot self-match two null canonical IDs');}
});
test('retained source aliases resolve only to live canonical heroes and do not create extra choices',()=>{
 assert.equal(HERO_SOURCE_MERGES.length,7);assert.equal(HERO_ORIGINAL_MERGES.length,1);
 for(const row of HERO_SOURCE_MERGES){const canonical=canonical_hero_for_source(row.source_id);assert.ok(canonical);assert.equal(canonical.id,row.canonical_id);assert.equal(HEROES.some(h=>h.id===row.source_id),false);assert.equal(hero_source_context(canonical,row.source_id).source_id,row.source_id);assert.ok(!EXCLUDED.includes(row.canonical_id));}
 for(const row of HERO_ORIGINAL_MERGES){assert.equal(canonical_hero_for_source(row.original_id).id,row.canonical_id);assert.equal(HEROES.some(h=>h.id===row.original_id),false);}
});
test('ordinary deck has 145 cards, 39 printed faces and 20 equipment mechanisms without optional packs',()=>{
 assert.deepEqual(CONTENT_PACKS,[]);assert.deepEqual(normalize_content_packs([]),[]);const d=new Deck(new SeededRNG(1016));assert.equal(d.draw_pile.length,145);assert.equal(new Set(d.draw_pile.map(c=>c.name)).size,39);assert.equal(EQUIPMENT_CATALOG.length,20);assert.equal(d.draw_pile.filter(c=>slots.some(s=>({'weapon':'武器','armor':'防具','offensive_horse':'-1马','defensive_horse':'+1马'})[s]===c.type)).length,20);
 for(const name of [...SPECIAL_NAMES,'血杀','毒杀','毒','刺杀','饮血剑','金鳞甲','乾坤袋','孔雀翎','护心镜'])assert.equal(d.draw_pile.some(c=>c.name===name),false,name);
 for(const name of ['无懈可击','借刀杀人','铁索连环','火攻','兵粮寸断','寒冰剑','雌雄双股剑','博浪锤','白银狮子','藤甲'])assert.ok(d.draw_pile.some(c=>c.name===name),name);
 assert.deepEqual(d.content_packs,[]);assert.ok(d.draw_pile.every(c=>!c.content_pack));
});
test('every retired pack is rejected by configuration and deck entry points',()=>{
 for(const pack of OLD_PACKS){assert.throws(()=>normalize_content_packs([pack]),/常规牌堆|牌包/);assert.throws(()=>new Deck(new SeededRNG(1),null,{content_packs:[pack]}),/常规牌堆|牌包/);}
 for(const bad of [null,'all',{},['unknown'],[null]])assert.throws(()=>normalize_content_packs(bad),/常规牌堆|牌包/);
});
test('copy function catalog contains only conventional deck faces plus the two ordinary global tricks',()=>{
 const names=new Set(new Deck(new SeededRNG(1)).draw_pile.map(c=>c.name));names.add('五谷丰登');names.add('桃园结义');assert.deepEqual(new Set(CARD_HISTORY_FUNCTIONS.map(c=>c.name)),names);assert.equal(CARD_HISTORY_FUNCTIONS.length,41);
 for(const c of [...DERIVED_EQUIPMENT_CATALOG,...ZHANGFEN_EQUIPMENT_CATALOG,QIBAO_RULES,...WANGYUN_TRICK_CATALOG.filter(c=>!names.has(c.name)),{name:'血杀',type:T.BLOOD_SHA},{name:'毒杀',type:T.POISON_SHA}])assert.throws(()=>card_history_definition(c),/unsupported effective card function/,c.name);
});
test('full lifecycle manifest contains only live heroes, no retired templates or evolved Wang Yun forms',()=>{
 const {g}=gameFixture({ids:[HUA,CAO,BASIC]});g.initialize_hero_lifecycle();const manifest=g.hero_lifecycle_state.manifest;assert.deepEqual(new Set(manifest.templates.map(t=>t.hero_id)),new Set(HEROES.map(h=>h.id)));assert.equal(manifest.templates.length,HEROES.length);assert.deepEqual(manifest.evolutions,[]);assert.ok(manifest.templates.every(t=>!EXCLUDED.includes(t.hero_id)));assert.deepEqual(g.offboard_cards,[]);
});
test('retained Hua Mulan inherits real dead Cao Cao with full copy skill and no offboard generation',async()=>{
 const {g,a,b,c}=gameFixture({ids:[HUA,CAO,BASIC]});g.initialize_hero_lifecycle();b.hp=0;await g.finalize_death(b,{source:a});const donor=g.yizhuang_candidates(a)[0];assert.equal(donor.hero.id,CAO);a.hand=[C('闪'),C('酒')];const before=physical(g);const result=await yxs_resolve_yizhuang(g,a,donor.death_id,yxs_yizhuang_materials(g,a).slice(0,2),{event_id:'scope-inherit-cao',dependencies:eighthDependencies});assert.equal(result.transformed,true);assert.equal(rule_hero(a).id,CAO);assert.equal(a.hero.id,HUA);assert.deepEqual(g.offboard_cards,[]);assert.deepEqual(new Set(physical(g)),new Set(before));
 a.hand=[C('闪')];g.deck.draw_pile=[C('桃'),C('酒')];priorUse(g,a,'无中生有');assert.equal(g.jianxiong_available(a),true);assert.equal(await g.use_jianxiong(a),true);assert.equal(a.hand.length,2);assert.equal(c.alive,true);assert.deepEqual(g.offboard_cards,[]);
});
for(const d of EQUIPMENT_CATALOG)test(`conventional copy retains ${d.name} equipment function and restores the same material on leaving`,async()=>{
 const {g,a,c}=gameFixture({human:[0]});priorUse(g,a,d.name);const material=C('闪',S.DIAMOND,{rank:2});a.hand=[material];assert.equal(await g.use_jianxiong(a,{material_id:'hand:1'}),true);const slot=({'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'})[d.type];assert.equal(a[slot],material);assert.equal(material.name,d.name);assert.equal(g.printed_card(material).name,'闪');await g.remove_equipment(a,slot,{to:'hand',recipient:c,reason:'scope copy restoration'});assert.ok(c.hand.includes(material));assert.equal(material.name,'闪');assert.equal(material.type,T.SHAN);assert.deepEqual(g.offboard_cards,[]);assert.equal(g.copied_card_roles.at(-1).status,'ended');
});
for(const name of ['五谷丰登','桃园结义'])test(`retained ordinary global ${name} resolves and can be copied cooperatively`,async()=>{
 const {g,a,p,c}=gameFixture({ids:[BASIC,CAO,BASIC],actor:1});for(const who of g.all_players())who.hp--;g.deck.draw_pile=[C('闪'),C('桃'),C('酒')];a.hand=[C('闪')];const before=physical(g);priorUse(g,a,name);assert.equal(await g.use_jianxiong(a),true);assert.equal(g.last_outer_card_use(a).effective_function.name,name);assert.deepEqual(new Set(physical(g)),new Set(before));assert.deepEqual(g.offboard_cards,[]);if(name==='桃园结义')assert.ok(g.all_players().every(who=>who.hp===rule_hero(who).max_hp));else{assert.equal(p.hand.length,1);assert.equal(a.hand.length,1);assert.equal(c.hand.length,1);}
});

test('new conventional journal resumes the exact next boundary with hidden hands, RNG and no special reserve',async t=>{
 const {m,storage,errors}=matchFixture(t);await m.create({hero_id:BASIC,ai_hero_id:CAO,ai2_hero_id:HUA,mode:'ai2',seed:87001});const snapshot=m.snapshot(),save=m.exportSave();assert.equal(save.engine_version,ENGINE_VERSION);assert.equal(save.content_version,CONTENT_VERSION);assert.deepEqual(save.config.content_packs,[]);assert.equal(Object.hasOwn(save.config,'zhangfen_faces'),false);assert.deepEqual(snapshot.offboard_cards,[]);assert.equal(physical(m.game).length,145);m.close();const b=matchFixture(t,storage);assert.equal(await b.m.resume(),true);assert.deepEqual(b.m.snapshot(),snapshot);assert.deepEqual(errors,[]);assert.deepEqual(b.errors,[]);
});
test('natural next action stays deterministic after a new-save import and subsequent resume',async t=>{
 const a=matchFixture(t),b=matchFixture(t);await a.m.create({hero_id:BASIC,ai_hero_id:BASIC,seed:87002});await b.m.importSave(a.m.exportSave());assert.deepEqual(a.m.snapshot(),b.m.snapshot());assert.equal(a.m.pending.prompt.kind,'play_card');const id=a.m.pending.prompt.prompt_id;await a.m.respond(id,'0');await b.m.respond(id,'0');assert.deepEqual(a.m.snapshot(),b.m.snapshot());const before=b.m.snapshot();b.m.close();assert.equal(await b.m.resume(),true);assert.deepEqual(b.m.snapshot(),before);assert.deepEqual([...a.errors,...b.errors],[]);
});
test('published V36 engine and content saves are refused without rewriting or deleting either save key',async t=>{
 const a=matchFixture(t);await a.m.create({hero_id:BASIC,ai_hero_id:BASIC,seed:87003});const old=a.m.exportSave();old.engine_version='jianghu-browser-confirmed-support-1';old.content_version='jianghu-confirmed-support-2026-10-15-a';const raw=JSON.stringify(old),legacy='untouched-older-save';const storage=memory([[SAVE_KEY,raw],[PREVIOUS_SAVE_KEY,legacy]]),b=matchFixture(t,storage);assert.equal(LocalMatch.isCurrentSave(old),false);assert.equal(await b.m.resume(),false);assert.equal(storage.getItem(SAVE_KEY),raw);assert.equal(storage.getItem(PREVIOUS_SAVE_KEY),legacy);assert.equal(b.m.game,null);assert.equal(b.m.pending,null);assert.match(b.errors.join('\n'),/版本已更新.*重新开局.*未被删除/);await assert.rejects(b.m.importSave(old),/版本已更新/);assert.equal(storage.getItem(SAVE_KEY),raw);
});
test('invalid new-match choices, retired IDs, old packs and vehicle parameters leave a running good save untouched',async t=>{
 const {m,storage}=matchFixture(t);await m.create({hero_id:BASIC,ai_hero_id:CAO,mode:'ai2',ai2_hero_id:HUA,seed:87004});const before=capture(m,storage);
 const invalid=[{hero_index:-1},{ai_hero_index:HEROES.length},{mode:'bad'},...EXCLUDED.flatMap(id=>[{hero_id:id},{ai_hero_id:id},{mode:'ai2',ai2_hero_id:id}]),...OLD_PACKS.map(pack=>({content_packs:[pack]})),{zhangfen_faces:{}},{zhangfen_faces:{attack:{suit:'黑桃',rank:1}}}];for(const options of invalid){await assert.rejects(m.create(options));untouched(m,storage,before);}
});
test('invalid imports fail before closing the good session, including retired IDs and old pack/vehicle configs',async t=>{
 const {m,storage}=matchFixture(t);await m.create({hero_id:BASIC,ai_hero_id:CAO,mode:'ai2',ai2_hero_id:HUA,seed:87005});const good=m.exportSave(),before=capture(m,storage);const mutated=[s=>{s.content_version='old-content'},...EXCLUDED.map(id=>s=>{s.config.hero_id=id}),...OLD_PACKS.map(pack=>s=>{s.config.content_packs=[pack]}),s=>{s.config.zhangfen_faces={}},s=>{s.config.ai2_hero_id=s.config.ai_hero_id;s.config.ai2_hero_index=s.config.ai_hero_index;}];for(const mutate of mutated){const bad=plain(good);mutate(bad);await assert.rejects(m.importSave(bad));untouched(m,storage,before);}
});
test('canonical source aliases cannot bypass the two-AI duplicate check; human mirrors remain valid',async t=>{
 const {m,storage}=matchFixture(t);await m.create({hero_id:BASIC,ai_hero_id:CAO,ai2_hero_id:HUA,mode:'ai2',seed:87006});const before=capture(m,storage);for(const row of HERO_SOURCE_MERGES){await assert.rejects(m.create({hero_id:BASIC,mode:'ai2',ai_hero_id:row.source_id,ai2_hero_id:row.canonical_id}),/两个人机不能选择同一英雄/);untouched(m,storage,before);}
 const merge=HERO_SOURCE_MERGES.find(r=>r.canonical_id==='yxs.mobile.historical.hero.yue-fei');assert.ok(merge);await m.create({hero_id:merge.source_id,ai_hero_id:merge.canonical_id,mode:'ai2',ai2_hero_id:BASIC,seed:87007});assert.equal(m.game.player.hero.id,merge.canonical_id);assert.equal(m.game.ai.hero.id,merge.canonical_id);assert.equal(m.game.ai2.hero.id,BASIC);
});
test('random two-AI starts use only current choices, avoid each other and the fixed player, and have no reserves',async t=>{
 const {m,errors}=matchFixture(t),seen=new Set();for(const seed of [19,53,813,160315,87009,87010,87011,87012]){await m.create({hero_id:BASIC,mode:'ai2',seed});const ids=m.game.all_players().map(p=>p.hero.id);ids.forEach(id=>{assert.ok(hero_by_id(id));assert.ok(!EXCLUDED.includes(id));seen.add(id);});assert.equal(new Set(ids).size,3);assert.deepEqual(m.game.offboard_cards,[]);assert.equal(physical(m.game).length,145);}assert.ok(seen.size>4,'genuine seeded random choices');assert.deepEqual(errors,[]);
});
test('two AI seats keep one team and use harmful active skills only against the human side',async()=>{
 const hero=HEROES.find(h=>h.name==='武则天'&&h.id.startsWith('jianghu.'));assert.ok(hero);const {g,p,b,c}=gameFixture({ids:[BASIC,hero.id,BASIC],actor:1});assert.equal(g.side_of(b),g.side_of(c));assert.notEqual(g.side_of(p),g.side_of(b));assert.equal(g.default_foe(b),p);assert.equal(g.default_foe(c),p);b.hand=[C('闪',S.HEART)];assert.equal(await ai_try_active_skill(g,b,p),true);assert.equal(p.judgment_mark_pending,true);assert.equal(c.judgment_mark_pending,false);
});
test('AI iron chain prioritizes unchaining its team while real AOE still damages other legal seats',async()=>{
 const {g,p,b,c}=gameFixture({ids:[BASIC,BASIC,BASIC],actor:1});b.chained=c.chained=true;let options=await g.prepare_card_use(b,C('铁索连环'),p);assert.deepEqual(options.targets,[b,c]);await g.resolve_scroll(b,options.target,C('铁索连环'),options);assert.equal(b.chained,false);assert.equal(c.chained,false);const hp=[p.hp,b.hp,c.hp];await g.resolve_card(b,p,C('万箭齐发'));assert.deepEqual([p.hp,b.hp,c.hp],[hp[0]-1,hp[1],hp[2]-1]);
});
test('AI borrowed weapon targets its teammate as attacker against human without reading hidden cards',async()=>{
 const {g,p,b,c}=gameFixture({ids:[BASIC,BASIC,BASIC],actor:1});c.weapon=E('虎符');const hidden={};Object.defineProperty(hidden,'type',{get(){throw Error('teammate hidden identity read')}});c.hand=[hidden];assert.deepEqual(ai_borrowed_weapon_plan(g,b),{target:c,forced_target:p});c.hand=[C('杀')];const card=C('借刀杀人'),options=await g.prepare_card_use(b,card,p);await g.resolve_card(b,options.target,card,options);assert.equal(p.hp,H(BASIC).max_hp-1);assert.equal(c.hp,H(BASIC).max_hp);assert.equal(b.hp,H(BASIC).max_hp);
});
