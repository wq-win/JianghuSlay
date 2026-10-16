/** Independent matrix/merge and public-projection acceptance for the conventional
 * release. Synthetic reports below test validation, never claim completed games. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdtemp,writeFile,rm,symlink,link} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {HEROES,hero_by_id,canonical_hero_for_source,hero_source_context,Deck,SeededRNG} from '../web/local/models.js';
import {skillsForHero} from '../web/public/skill-catalog.js';
import {LocalMatch} from '../web/local/session.js';
import {serialize_match_state} from '../web/local/state.js';
import {SCHEMA,buildCases,shardCases,mergeCoverage,mergeReports,sourceFingerprint} from '../scripts/conventional-game-suite.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const EXCLUDED=['sgs.mobile.base.hero.liu-ye','sgs.mobile.hero.wangyun.20231207','sgs.mobile.derived.hero.zhang-fen'];
const copy=x=>JSON.parse(JSON.stringify(x));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function syntheticReport(entries,{fingerprint='a'.repeat(64)}={}){
 return {schema_version:SCHEMA,kind:'all',source_fingerprint:fingerprint,cases:entries.map((entry,i)=>({...copy(entry),result:{config:copy(entry.config),actions:i+1,rounds:1,winner:i%2?'player':'ai'},coverage:{planned:1,completed:1,actions:i+1,maxPrompts:i+1,maxRounds:1,verifiedRestores:1,importedFinalReplays:1,conservationChecks:i+3,duplicateRejections:1,caseKeySet:[entry.key],heroIdSet:[HEROES[entry.config.hero_index].id],modes:{[entry.config.mode]:1}}}))};
}
function halves(){const all=buildCases();return [syntheticReport(shardCases(all,0,2)),syntheticReport(shardCases(all,1,2))];}

test('all-game matrix is the exact live 121×2 cartesian product with distinct in-scope AI seats and no packs',()=>{
 const rows=buildCases();assert.equal(rows.length,242);assert.equal(new Set(rows.map(r=>r.key)).size,242);const pairs=new Map();
 for(const row of rows){const c=row.config,h=HEROES[c.hero_index];assert.ok(h);assert.equal(row.hero,h.display_name??h.name);assert.ok(!EXCLUDED.includes(h.id));assert.deepEqual(c.content_packs,[]);assert.ok(!Object.hasOwn(c,'zhangfen_faces'));assert.ok(['ai','ai2'].includes(c.mode));assert.ok(HEROES[c.ai_hero_index]);assert.notEqual(c.hero_index,c.ai_hero_index);if(c.mode==='ai2'){assert.ok(HEROES[c.ai2_hero_index]);assert.notEqual(c.ai_hero_index,c.ai2_hero_index);assert.notEqual(c.hero_index,c.ai2_hero_index);}else assert.equal(c.ai2_hero_index,null);assert.equal(row.options.maxActions,4000);assert.equal(row.options.restoreEvery,29);assert.ok(Number.isSafeInteger(c.seed)&&c.seed>=0&&c.seed<=0xffffffff);pairs.set(h.id,[...(pairs.get(h.id)??[]),c.mode]);}
 assert.deepEqual(new Set(pairs.keys()),new Set(HEROES.map(h=>h.id)));for(const modes of pairs.values())assert.deepEqual(modes,['ai','ai2']);assert.deepEqual(buildCases(),rows,'case construction is deterministic');
});
test('two bounded shards partition the complete matrix once with neither duplicate nor dropped rows',()=>{
 const all=buildCases(),a=shardCases(all,0,2),b=shardCases(all,1,2);assert.equal(a.length,121);assert.equal(b.length,121);assert.deepEqual(new Set([...a,...b].map(r=>r.key)),new Set(all.map(r=>r.key)));assert.equal(a.some(r=>b.some(s=>s.key===r.key)),false);assert.deepEqual(shardCases(all,0,1),all);
 for(const [index,count] of [[-1,2],[2,2],[0,0],[0,3],[0.5,2],[0,1.5]])assert.throws(()=>shardCases(all,index,count));
});
test('retained V36 packet matrix samples both modes and mirror/nonmirror choices without archived packs',()=>{
 const rows=buildCases('packet');assert.equal(rows.length,8);assert.deepEqual(new Set(rows.map(r=>HEROES[r.config.hero_index].id)),new Set(['sgs.adapted.base.hero.cao-ang','sgs.adapted.base.hero.pan-zhang-ma-zhong']));for(const row of rows){assert.deepEqual(row.config.content_packs,[]);assert.equal(row.options.restoreEvery,17);if(row.config.mode==='ai2')assert.notEqual(row.config.ai_hero_index,row.config.ai2_hero_index);}assert.throws(()=>buildCases('unknown'));
});
test('synthetic merge recomputes a lossless ordered complete matrix and unions declared sets',()=>{
 const [a,b]=halves(),merged=mergeReports([b,a]);assert.equal(merged.complete,true);assert.equal(merged.completed,242);assert.equal(merged.planned,242);assert.deepEqual(merged.cases.map(r=>r.key),buildCases().map(r=>r.key));assert.equal(merged.coverage.completed,242);assert.equal(merged.coverage.actions,[...a.cases,...b.cases].reduce((n,c)=>n+c.result.actions,0));assert.equal(merged.coverage.maxPrompts,121);assert.equal(merged.coverage.verifiedRestores,242);assert.equal(merged.coverage.importedFinalReplays,242);assert.equal(merged.coverage.caseKeySet.length,242);assert.equal(merged.coverage.heroIdSet.length,121);assert.deepEqual(merged.coverage.modes,{ai:121,ai2:121});
});
test('synthetic merge rejects missing, duplicate and unknown cases rather than trusting summary counts',()=>{
 const [a,b]=halves();assert.throws(()=>mergeReports([a]),/missing cases/);const missing=copy(b);missing.cases.pop();assert.throws(()=>mergeReports([a,missing]),/missing cases/);assert.throws(()=>mergeReports([a,b,a]),/duplicate case/);const extra=copy(b);extra.cases[0].key='all:unknown:ai:default:profile-0';assert.throws(()=>mergeReports([a,extra]),/unknown case/);
 const partial=mergeReports([a],{requireComplete:false});assert.equal(partial.complete,false);assert.equal(partial.completed,121);assert.equal(partial.planned,242);assert.throws(()=>mergeReports([]),/reports required/);
});
test('synthetic merge rejects changed seed, hero, mode, pack, action budget or result configuration',()=>{
 for(const mutate of [r=>r.config.seed++,r=>r.config.hero_index++,r=>r.config.mode='ai',r=>r.config.content_packs=['retired-pack'],r=>r.options.restoreEvery++,r=>r.options.maxActions++,r=>r.hero='invented',r=>r.result.config.seed++]){const [a,b]=halves();mutate(b.cases[0]);assert.throws(()=>mergeReports([a,b]));}
});
test('synthetic merge refuses nonterminal results, altered row coverage and mismatched source identities',()=>{
 for(const mutate of [r=>r.result.winner=null,r=>r.result.winner='pending',r=>r.result.actions=0,r=>r.result.rounds=0,r=>r.coverage.completed=0,r=>r.coverage.planned=2,r=>r.coverage.actions++,r=>r.coverage.maxPrompts++,r=>r.coverage.maxRounds++,r=>r.coverage.caseKeySet=[]]){const [a,b]=halves();mutate(b.cases[0]);assert.throws(()=>mergeReports([a,b]));}
 for(const mutate of [r=>r.source_fingerprint='b'.repeat(64),r=>r.source_fingerprint='bad-hash',r=>r.schema_version='old-schema',r=>r.kind='packet']){const [a,b]=halves();mutate(b);assert.throws(()=>mergeReports([a,b]));}
});
test('coverage aggregation sums nested counters, takes maxima and unions only explicit set arrays',()=>{
 const result=mergeCoverage([{actions:3,maxRounds:8,nested:{card:2},heroIdSet:['b','a'],notes:[1]},{actions:4,maxRounds:5,nested:{card:5,skill:1},heroIdSet:['b','c'],notes:[2]}]);assert.deepEqual(result,{actions:7,maxRounds:8,nested:{card:7,skill:1},heroIdSet:['a','b','c'],notes:[1,2]});assert.throws(()=>mergeCoverage([{actions:NaN}]));assert.throws(()=>mergeCoverage([{actions:Infinity}]));
});
test('frozen nested production bytes supplement the runner’s nonrecursive source fingerprint',async()=>{
 // The already-running matrix deliberately preserves its original hash scheme.
 // This separate proof binds the omitted nested module to the frozen core commit.
 const path='web/local/equipment/mechanisms.mjs',live=await readFile(root+path),frozen='4847f87e1a7a1deb25082a35cfed7b36e3a257fa6282d822f01c2d381f4a2e94';assert.equal(hash(live),frozen,'nested source changed since V37 validation; matrix must be rerun');const fingerprint=await sourceFingerprint();assert.match(fingerprint,/^[0-9a-f]{64}$/);assert.equal(await sourceFingerprint(),fingerprint);
 async function nestedProduction(dir){const out=[];for(const entry of await readdir(root+dir,{withFileTypes:true})){if(entry.name==='tests')continue;const path=dir+entry.name;if(entry.isDirectory())out.push(...await nestedProduction(path+'/'));else if(/\.(mjs|js)$/.test(path)&&dir!=='web/local/')out.push(path);}return out.sort();}
 assert.deepEqual(await nestedProduction('web/local/'),[path],'any new nested production module requires supplemental coverage');
});
test('conventional public DTO has no vehicle/Wang Yun namespace and conceals other hands from every viewer',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},m=new LocalMatch({storage});try{
  await m.create({hero_id:'jianghu.classic.hero.jiang-wei',ai_hero_id:'yxs.adapted.base.hero.cao-cao',ai2_hero_id:'yxs.adapted.base.hero.hua-mu-lan',mode:'ai2',seed:87020});
  for(const viewer_seat of ['player','p1','p2','p3']){const state=serialize_match_state(m.game,{viewer_seat});assert.doesNotMatch(JSON.stringify(state),/"(?:sgs_zhangfen|zhangfen|wangyun|vehicle|offboard)[^"]*"/);assert.equal(state.players.opponents.length,2);for(const p of state.players.opponents){assert.ok(p.hand.every(c=>c.hidden===true));assert.ok(p.hand.every(c=>Object.keys(c).sort().join(',')==='hidden,name'));assert.ok(hero_by_id(p.hero.id));}assert.ok(state.players.self.hand.every(c=>c.hidden===false));}
  assert.deepEqual(m._state().config.content_packs,[]);assert.equal(Object.hasOwn(m._state().config,'zhangfen_faces'),false);assert.deepEqual(m.game.offboard_cards,[]);
 }finally{m.close();}
});

async function withInventory(body){
 const dir=await mkdtemp(join(tmpdir(),'conventional-export-review-'));
 try{const path=join(dir,'jianghu-conventional-v37-inventory.json'),env={...process.env,PUBLICATION_STATUS:'local-validation-not-published',SOURCE_COMMIT:'754823b'};execFileSync(process.execPath,[root+'scripts/export-conventional-inventory.mjs',path],{cwd:dir,env,stdio:'pipe'});const bytes=await readFile(path,'utf8');await body(JSON.parse(bytes),{dir,path,bytes,env});}finally{await rm(dir,{recursive:true,force:true});}
}
test('new inventory reproduces live heroes, full rule panels and physical deck rather than frozen V36 totals',async()=>withInventory(async out=>{
 assert.equal(out.schema_version,'jianghu-conventional-inventory-v37');assert.equal(out.publication,'local-validation-not-published');assert.equal(out.source_commit,'754823b');assert.deepEqual([out.counts.heroes,out.counts.skill_effect_cards,out.counts.card_types,out.counts.physical_cards,out.counts.equipment_rule_entities],[121,194,39,145,20]);assert.deepEqual(new Set(out.heroes.map(h=>h.id)),new Set(HEROES.map(h=>h.id)));for(const hero of out.heroes){assert.equal(hero.selectable,true);const live=hero_by_id(hero.id);const panels=skillsForHero(live);assert.equal(hero.effects.length,panels.length);for(const [i,panel] of panels.entries())for(const key of ['name','type','timing','cost','limit','effect','notes'])if(Object.hasOwn(panel,key))assert.deepEqual(hero.effects[i][key],panel[key],`${hero.id}:${i}:${key}`);}
 const physical=new Deck(new SeededRNG(42)).draw_pile,names=new Set(physical.map(c=>c.name));assert.deepEqual(new Set(out.cards.map(c=>c.name)),names);for(const row of out.cards){assert.equal(row.copies,physical.filter(c=>c.name===row.name).length);assert.equal(row.initial_deck_copies,row.copies);assert.equal(row.ordinary_deck,true);assert.equal(row.content_pack,null);}assert.equal(out.cards.reduce((n,c)=>n+c.copies,0),physical.length);assert.equal(out.counts.basic_copies+out.counts.trick_copies+out.equipment.reduce((n,c)=>n+c.copies,0),physical.length);
}));
test('new source coverage excludes all retired identities while preserving canonical source context',async()=>withInventory(async out=>{
 const aliases=out.hero_source_aliases;assert.equal(new Set(aliases.map(a=>a.source_id)).size,aliases.length);for(const alias of aliases){assert.ok(!EXCLUDED.includes(alias.source_id));assert.ok(!EXCLUDED.includes(alias.canonical_id));const canonical=canonical_hero_for_source(alias.source_id);assert.ok(canonical);assert.equal(alias.canonical_id,canonical.id);assert.deepEqual(alias.source_context,JSON.parse(JSON.stringify(hero_source_context(canonical,alias.source_id))));}
 assert.deepEqual([out.counts.source_hero_representatives,out.counts.source_identity_records],[103,110]);assert.equal(out.source_coverage.heroes.playable_source_representatives,out.heroes.filter(h=>h.source_coverage).length);assert.equal(out.source_coverage.heroes.source_identity_records,aliases.filter(a=>a.source_coverage).length);assert.deepEqual(out.source_coverage.heroes.source_identities_by_game,{三国杀:75,英雄杀:35});assert.equal(out.hero_source_merges.length,7);assert.equal(out.hero_original_merges.length,1);
 assert.deepEqual(new Set(out.local_archive_excluded.heroes.map(h=>h.id)),new Set(EXCLUDED));assert.ok(out.local_archive_excluded.heroes.every(h=>h.included_in_unfinished_goals===false));assert.equal(out.local_archive_excluded.counted_as_unfinished_scope,false);assert.equal(out.match_configuration.content_packs.length,0);
}));
test('inventory keeps the requested ten and two zero-copy conventional functions without reactivating archives',async()=>withInventory(async out=>{
 const requested=['无懈可击','借刀杀人','铁索连环','火攻','兵粮寸断','寒冰剑','雌雄双股剑','贯石斧','白银狮子','藤甲'];assert.deepEqual(out.required_ten.map(r=>r.requested_name),requested);for(const row of out.required_ten){const card=out.cards.find(c=>c.inventory_id===row.inventory_id);assert.ok(card);assert.equal(card.name,row.canonical_name);assert.ok(row.copies>0);}const axe=out.required_ten.find(r=>r.requested_name==='贯石斧');assert.equal(axe.canonical_name,'博浪锤');assert.equal(axe.satisfied_by_source_alias,true);assert.equal(out.equipment.filter(c=>c.name==='博浪锤').length,1);assert.equal(out.cards.some(c=>c.name==='贯石斧'),false);
 assert.deepEqual(new Set(out.conventional_functions_without_initial_copies.map(c=>c.name)),new Set(['五谷丰登','桃园结义']));for(const card of out.conventional_functions_without_initial_copies){assert.equal(card.initial_deck_copies,0);assert.equal(card.requires_retired_hero,false);assert.equal(out.cards.some(c=>c.name===card.name),false);}assert.equal(out.counts.conventional_card_functions_without_initial_copies,2);
 const archive=out.local_archive_excluded;assert.deepEqual(archive.counts,{heroes:3,optional_packs:3,optional_pack_types:19,optional_pack_physical_cards:36,custom_basic_types:2,custom_basic_physical_cards:12,derived_equipment:4,hero_only_tricks:2});for(const row of [...archive.packs,...archive.derived_equipment,...archive.hero_only_tricks,...archive.removed_custom_basic_cards]){assert.equal(row.status,'local-archive-excluded');assert.equal(row.included_in_unfinished_goals,false);}assert.deepEqual(new Set(archive.removed_custom_basic_cards.map(c=>c.name)),new Set(['血杀','毒杀']));
}));
test('inventory states remaining conventional gaps as bounded and never claims current-client or complete catalog certification',async()=>withInventory(async out=>{
 assert.equal(out.scope_complete,false);assert.equal(out.source_coverage.heroes.complete,false);assert.equal(out.source_coverage.heroes.target_total,null);assert.equal(out.source_coverage.cards.complete,false);assert.equal(out.source_coverage.equipment.complete,false);assert.equal(out.source_coverage.current_client_verification.complete,false);const gaps=out.conventional_scope_gaps;assert.equal(gaps.complete,false);assert.equal(gaps.unknown_catalog_boundary.total,null);assert.equal(gaps.unknown_catalog_boundary.completeness_verified,false);assert.deepEqual(gaps.known_missing_or_non_equivalent_functions.map(g=>g.id),['conventional.lightning-parity']);assert.ok(gaps.bounded_known_unimplemented_hero_candidates.every(h=>!EXCLUDED.includes(h.id)&&!['刘晔','王允','张奋'].includes(h.name)&&h.selectable===false&&h.counted_as_source_coverage===false));assert.ok(!Object.hasOwn(out,'future_targets'));
}));
test('inventory export is deterministic from another cwd and refuses a frozen V36 output without touching bytes',async()=>withInventory(async (out,{dir,path,bytes,env})=>{
 execFileSync(process.execPath,[root+'scripts/export-conventional-inventory.mjs',path],{cwd:dir,env,stdio:'pipe'});assert.equal(await readFile(path,'utf8'),bytes);const frozen=join(dir,'jianghu-confirmed-support-v36-inventory.json');await writeFile(frozen,'preserve frozen V36');assert.throws(()=>execFileSync(process.execPath,[root+'scripts/export-conventional-inventory.mjs',frozen],{cwd:dir,env,stdio:'pipe'}),/historical inventories must remain unchanged/i);assert.equal(await readFile(frozen,'utf8'),'preserve frozen V36');
 for(const alias of [symlink,link]){await rm(path);await alias(frozen,path);execFileSync(process.execPath,[root+'scripts/export-conventional-inventory.mjs',path],{cwd:dir,env,stdio:'pipe'});assert.equal(await readFile(frozen,'utf8'),'preserve frozen V36','atomic replace preserves a historical alias target');assert.equal(await readFile(path,'utf8'),bytes);}assert.ok((await readdir(dir)).every(name=>!name.includes('.tmp-')));
}));
