/** Exact deterministic V35 natural-game matrix and lossless shard aggregation. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdir,readFile} from 'node:fs/promises';
import {HEROES,SGS_CHENLIN_HEROES,SGS_CAOXIU_HEROES} from '../web/local/models.js';
import {CONTENT_PACKS} from '../web/local/content-packs.js';
import {runCase} from './test_equipment_games.mjs';
import {newCoverage} from './test_second_four_games.mjs';
export const SCHEMA='v35-obligation-identity-natural-games-1';
export function buildCases(kind='all'){
 const roster=HEROES;assert.ok(roster.length>=122,'V35 historical identities remain in the current roster');
 assert.ok(['all','packet'].includes(kind));
 const packet=[...SGS_CHENLIN_HEROES,...SGS_CAOXIU_HEROES].filter(h=>HEROES.includes(h));
 if(kind==='packet')assert.equal(packet.length,2,'V35 packet is Chen Lin and Cao Xiu');
 const cases=[];
 for(const [i,hero] of (kind==='all'?roster:packet).entries())for(const mode of ['ai','ai2'])for(const packs of [[],CONTENT_PACKS.map(p=>p.id)])for(const profile of kind==='all'?[0]:[0,1]){
  const idx=HEROES.indexOf(hero);
  const config={hero_index:idx,ai_hero_index:profile?idx:(idx+17)%roster.length,ai2_hero_index:mode==='ai2'?(idx+37)%roster.length:null,mode,content_packs:packs,seed:(kind==='all'?13010000:13030000)+i*173+(mode==='ai2'?10000:0)+(packs.length?20000:0)+profile*50000};
  cases.push({key:`${kind}:${hero.id}:${mode}:${packs.length?'all-packs':'default'}:profile-${profile}`,hero:hero.display_name??hero.name,config,options:{maxActions:4000,restoreEvery:kind==='all'?29:17,vehicleForm:profile?'defend':'attack'}});
 }
 assert.equal(cases.length,kind==='all'?roster.length*4:16);return cases;
}
export function shardCases(cases,index=0,count=1){assert.ok(Number.isInteger(count)&&count>=1&&count<=2,'at most two exact shards');assert.ok(Number.isInteger(index)&&index>=0&&index<count);return cases.filter((_,i)=>i%count===index);}
/** Numeric counters sum, maxima take max, explicitly declared set arrays union.
 * No averages, concatenated summaries, or overwritten maps can hide a gap. */
export function mergeCoverage(parts){
 function merge(a,b,key=''){
  if(typeof b==='number'){assert.ok(Number.isFinite(b));return key.startsWith('max')?Math.max(a??0,b):(a??0)+b;}
  if(Array.isArray(b)){assert.ok(a===undefined||Array.isArray(a));return key.endsWith('Set')?[...new Set([...(a??[]),...b])].sort():[...(a??[]),...b];}
  assert.ok(b&&typeof b==='object',`unsupported coverage field ${key}`);const out={...(a??{})};for(const [k,v] of Object.entries(b))out[k]=merge(out[k],v,k);return out;
 }
 return parts.reduce((out,part)=>merge(out,part),{});
}
export function mergeReports(reports,{kind='all',requireComplete=true}={}){
 assert.ok(reports.length>0,'reports required');const expected=buildCases(kind),byKey=new Map(expected.map(c=>[c.key,c])),seen=new Set(),cases=[];
 const fingerprint=reports[0].source_fingerprint;assert.ok(typeof fingerprint==='string'&&/^[0-9a-f]{64}$/.test(fingerprint),'validated source fingerprint required');
 for(const report of reports){
  assert.equal(report.schema_version,SCHEMA);assert.equal(report.kind,kind);assert.equal(report.source_fingerprint,fingerprint,'shards must use identical sources');
  for(const row of report.cases){assert.ok(byKey.has(row.key),`unknown case ${row.key}`);assert.ok(!seen.has(row.key),`duplicate case ${row.key}`);seen.add(row.key);
   const want=byKey.get(row.key);assert.deepEqual(row.config,want.config,`exact seed/config for ${row.key}`);assert.deepEqual(row.options,want.options,`exact budgets for ${row.key}`);
   assert.equal(row.hero,want.hero,'exact hero label');assert.deepEqual(row.result.config,row.config,'result/config mismatch');
   assert.equal(row.coverage.completed,1);assert.equal(row.coverage.planned,1);assert.equal(row.coverage.actions,row.result.actions);assert.equal(row.coverage.maxPrompts,row.result.actions);assert.equal(row.coverage.maxRounds,row.result.rounds);assert.ok(['player','ai'].includes(row.result.winner));assert.ok(Number.isSafeInteger(row.result.actions)&&row.result.actions>0&&row.result.actions<=row.options.maxActions);assert.ok(Number.isSafeInteger(row.result.rounds)&&row.result.rounds>=1);
   assert.deepEqual(row.coverage.caseKeySet,[row.key],'coverage must identify exactly its own case');
   cases.push(row);
  }
 }
 if(requireComplete)assert.equal(seen.size,expected.length,`missing cases: ${expected.filter(c=>!seen.has(c.key)).map(c=>c.key).join(', ')}`);
 cases.sort((a,b)=>expected.findIndex(c=>c.key===a.key)-expected.findIndex(c=>c.key===b.key));
 const coverage=mergeCoverage(cases.map(c=>c.coverage));assert.equal(coverage.completed,cases.length);
 return {schema_version:SCHEMA,kind,source_fingerprint:fingerprint,planned:expected.length,completed:cases.length,complete:cases.length===expected.length,caseKeySet:[...seen].sort(),coverage,cases};
}
export async function sourceFingerprint(){
 const root=new URL('../',import.meta.url),paths=[];
 for(const dir of ['web/local/'])for(const row of await readdir(new URL(dir,root),{withFileTypes:true}))if(row.isFile()&&/\.(mjs|js)$/.test(row.name))paths.push(dir+row.name);
 paths.push(...['game-physical-accounting.mjs','obligation-identity-game-suite.mjs','test_obligation_identity_all_games.mjs','test_obligation_identity_packet_games.mjs','test_equipment_games.mjs','test_second_four_games.mjs','test_expansion_games.mjs','sgs-liru-test-policy.mjs','future-identity-test-policy.mjs','obligation-identity-test-policy.mjs'].map(name=>'scripts/'+name));
 const hash=createHash('sha256');for(const path of paths.sort()){hash.update(path);hash.update(await readFile(new URL(path,root)));}return hash.digest('hex');
}
export async function runSuite({kind='all',shardIndex=0,shardCount=1}={}){
 const expected=buildCases(kind),selected=shardCases(expected,shardIndex,shardCount),source_fingerprint=await sourceFingerprint(),started=Date.now(),cases=[];
 for(const entry of selected){
  const coverage={...newCoverage(),planned:1,cardStages:{}};
  const result=await runCase(entry.config,coverage,entry.options);
  coverage.caseKeySet=[entry.key];coverage.heroIdSet=Object.keys(coverage.heroSeats).map(k=>k.split(':')[0]).filter((v,i,a)=>a.indexOf(v)===i);
  cases.push({...entry,result,coverage});console.error(JSON.stringify({key:entry.key,hero:entry.hero,...result}));
 }
 assert.equal(await sourceFingerprint(),source_fingerprint,'sources changed during natural-game validation; result requires rerun');
 const result=mergeReports([{schema_version:SCHEMA,kind,source_fingerprint,cases}],{kind,requireComplete:shardCount===1});
 return {...result,shard:{index:shardIndex,count:shardCount},elapsedMs:Date.now()-started};
}
