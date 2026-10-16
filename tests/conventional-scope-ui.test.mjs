/** Ordinary-scope App integration: real session transport and DOM callbacks.
 * In-memory instrumentation observes create calls without changing rule behavior.
 * JSDOM covers state/DOM/replay, not visual geometry or touch behavior. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {JSDOM,VirtualConsole} from 'jsdom';
import {SAVE_KEY,ENGINE_VERSION,CONTENT_VERSION} from '../web/local/session.js';
import {HEROES,JIANGHU_DECK_SIZE} from '../web/local/models.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const plain=value=>JSON.parse(JSON.stringify(value));
const retiredNames=['刘晔','王允','张奋'];
const retiredCopy=/朱雀装备兼容包|用间赠予兼容包|国战装备兼容包|大攻车|霹雳车|孔雀翎|护心镜|完整合集|联合牌池/;
async function until(check,label='DOM commit'){
 const deadline=Date.now()+10000;
 while(Date.now()<deadline){if(check())return;await new Promise(resolve=>setTimeout(resolve,5));}
 assert.fail(label+' timed out');
}
const appCode=(await build({absWorkingDir:root,entryPoints:['web/public/app.js'],bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'},plugins:[{
 name:'observe-conventional-app',setup(builder){
  builder.onLoad({filter:/\/web\/public\/app\.js$/},async args=>({
   contents:"import {flushSync as testFlush} from 'react-dom';window.__flush=testFlush;\n"+(await readFile(args.path,'utf8'))+'\nwindow.__normalizeMatchConfig=normalizeMatchConfig;',
   loader:'js',resolveDir:root+'web/public',
  }));
  builder.onResolve({filter:/^\.\.\/local\/session\.js$/},args=>args.importer.endsWith('/app.js')?{path:'observe-conventional-session',namespace:'conventional-test'}:null);
  builder.onLoad({filter:/.*/,namespace:'conventional-test'},()=>({resolveDir:root,contents:`
   import {LocalMatch as Base,SAVE_KEY} from './web/local/session.js';
   export {SAVE_KEY};
   export class LocalMatch extends Base {
    constructor(options){super(options);window.__match=this;}
    create(options){(window.__creates??=[]).push(JSON.parse(JSON.stringify(options)));return super.create({...options,seed:1081+(window.__creates.length-1)});}
   }
  `}));
 },
}]})).outputFiles[0].text;
function mount({saved=null,code=appCode}={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',error=>errors.push(error));
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://example.test/game/jianghu-slay/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
 dom.window.fetch=()=>{throw Error('No backend fetch allowed');};
 dom.window.WebSocket=class{constructor(){throw Error('No backend socket allowed');}};
 if(saved)dom.window.localStorage.setItem(SAVE_KEY,saved);
 dom.window.eval(code);
 const doc=dom.window.document;
 const flush=fn=>dom.window.__flush?dom.window.__flush(fn):fn();
 const button=label=>[...doc.querySelectorAll('button')].find(el=>el.textContent.trim()===label);
 return {dom,doc,errors,button,flush,get match(){return dom.window.__match;},get saved(){return dom.window.localStorage.getItem(SAVE_KEY);},get creates(){return plain(dom.window.__creates??[]);},
  click(label,{twice=false}={}){const el=button(label);assert.ok(el,`Missing ${label}`);assert.equal(el.disabled,false);flush(()=>{el.click();if(twice)el.click();});return el;},
  select(id,value){const el=doc.getElementById(id);assert.ok(el,`Missing ${id}`);flush(()=>{el.value=String(value);el.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});},
  async home(){await until(()=>button('开始对局')&&!button('开始对局').disabled&&(!saved||button('继续上局')),'Home ready');},
  async play(){await until(()=>{const error=doc.querySelector('.error-notice');if(error)assert.fail(error.textContent);return doc.querySelector('.action-dock')&&!doc.querySelector('.prompt-controls')?.disabled;},'Playable match');},
  close(){this.match?.close();dom.window.close();},
 };
}
function assertOrdinarySetup(a){
 assert.equal(a.doc.querySelectorAll('.hero-chip').length,HEROES.length);
 for(const name of retiredNames){
  assert.equal(a.doc.querySelector(`[aria-label="选择${name}"]`),null,`${name} is not selectable`);
  assert.ok(![...a.doc.getElementById('ai-hero').options].some(option=>option.textContent===name));
 }
 assert.equal(a.doc.querySelector('[data-content-pack],.optional-packs,[data-zhangfen-face],.zhangfen-face-setup'),null);
 assert.doesNotMatch(a.doc.body.textContent,retiredCopy);
 const deck=a.doc.querySelector('[data-conventional-deck]');assert.ok(deck);
 assert.match(deck.textContent,new RegExp(`常规牌堆（${JIANGHU_DECK_SIZE} 张）`));
 for(const name of ['无懈可击','借刀杀人','铁索连环','火攻','兵粮寸断','寒冰剑','雌雄双股剑','博浪锤（贯石斧）','白银狮子','藤甲'])assert.ok(deck.textContent.includes(name),`${name} remains advertised as ordinary content`);
 assert.deepEqual([...a.doc.getElementById('match-mode').options].map(option=>option.value),['ai','ai2']);
}
function assertNoRetiredOptions(config){
 assert.equal(Object.hasOwn(config,'content_packs'),false);
 assert.equal(Object.hasOwn(config,'zhangfen_faces'),false);
}

test('ordinary setup and help show conventional content without optional packs or derived equipment guides',async()=>{
 const a=mount();try{
  await a.home();assertOrdinarySetup(a);
  a.click('玩法说明');await until(()=>a.doc.querySelector('.help-dialog'));
  const help=a.doc.querySelector('.help-dialog');assert.match(help.textContent,/普通角色与常规牌堆/);assert.doesNotMatch(help.textContent,retiredCopy);
  assert.match(help.textContent,/无懈可击/);assert.match(help.textContent,/博浪锤（贯石斧）/);
  a.click('知道了');await until(()=>!a.doc.querySelector('.help-dialog'));assertOrdinarySetup(a);assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});

test('setup normalization drops retired settings and never rebinds an obsolete identity by index',async()=>{
 const a=mount();try{
  await a.home();const heroes=HEROES.map((hero,index)=>({...hero,index}));
  const config=plain(a.dom.window.__normalizeMatchConfig({hero_id:'retired.hero',hero_index:3,ai_hero_id:'retired.opponent',ai_hero_index:4,ai2_hero_id:null,ai2_hero_index:5,mode:'ai2',content_packs:['sgs_youjian_equipment_compat_1'],zhangfen_faces:{attack:{suit:'红桃',rank:13}}},heroes));
  assert.deepEqual(config,{hero_index:0,mode:'ai2',ai_hero_index:null,ai2_hero_index:null});assertNoRetiredOptions(config);
  const valid=plain(a.dom.window.__normalizeMatchConfig({hero_id:HEROES[3].id,hero_index:0,ai_hero_id:HEROES[4].id,ai_hero_index:1,mode:'ai'},heroes));
  assert.equal(valid.hero_index,3);assert.equal(valid.ai_hero_index,4);
 }finally{a.close();}
});

for(const mode of ['ai','ai2'])test(`actual App ${mode}: start, cancel, restart and reload retain only ordinary settings`,async()=>{
 let a=mount();try{
  await a.home();a.select('match-mode',mode);a.select('ai-hero',1);if(mode==='ai2')a.select('ai2-hero',3);
  a.click('开始对局',{twice:true});await a.play();assert.equal(a.creates.length,1);
  const expected={hero_index:0,mode,ai_hero_index:1};if(mode==='ai2')expected.ai2_hero_index=3;
  assert.deepEqual(a.creates[0],expected);assertNoRetiredOptions(a.creates[0]);
  assert.equal(a.doc.querySelectorAll('.general-seat.opponent').length,mode==='ai2'?2:1);
  const original=a.saved;
  a.click('重新开局');await until(()=>a.doc.querySelector('.config-summary'));
  assert.match(a.doc.querySelector('.config-summary').textContent,new RegExp(`常规牌堆（${JIANGHU_DECK_SIZE} 张）`));
  assert.doesNotMatch(a.doc.querySelector('.config-summary').textContent,retiredCopy);
  a.click('取消');await a.play();assert.equal(a.saved,original);assert.equal(a.creates.length,1);
  a.click('重新开局');await until(()=>a.button('确认重新开局'));a.click('确认重新开局',{twice:true});await a.play();
  assert.equal(a.creates.length,2);assert.deepEqual(a.creates[1],expected);assert.notEqual(a.saved,original);
  const save=a.saved,prompt=a.match.pending.prompt.prompt_id,snapshot=plain(a.match.snapshot());
  a.close();a=mount({saved:save});await a.home();assertOrdinarySetup(a);assert.equal(a.doc.getElementById('match-mode').value,mode);
  a.click('继续上局');await a.play();assert.equal(a.match.pending.prompt.prompt_id,prompt);assert.deepEqual(plain(a.match.snapshot()),snapshot);assert.equal(a.creates.length,0);assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});

test('retired-version save stays untouched until an explicit conventional replacement is confirmed',async()=>{
 const old=JSON.stringify({version:2,engine_version:'jianghu-browser-confirmed-support-1',content_version:'jianghu-confirmed-support-2026-10-15-a',config:{hero_id:'sgs.adapted.base.hero.zhang-fen',hero_index:3,mode:'ai2',ai_hero_index:4,ai2_hero_index:5,content_packs:['sgs_youjian_equipment_compat_1'],zhangfen_faces:{attack:{suit:'红桃',rank:13}}},seed:3,game_id:'old-scope',actions:[],checkpoint:null});
 assert.notEqual(`${ENGINE_VERSION}/${CONTENT_VERSION}`,'jianghu-browser-confirmed-support-1/jianghu-confirmed-support-2026-10-15-a','Scope change must version the save contract');
 const a=mount({saved:old});try{
  await a.home();assertOrdinarySetup(a);assert.equal(a.doc.getElementById('match-mode').value,'ai');assert.equal(a.doc.getElementById('ai-hero').value,'random');assert.equal(a.saved,old);
  a.click('继续上局');await until(()=>a.doc.querySelector('[role="alert"]')&&a.button('开始对局')&&!a.button('开始对局').disabled,'Legacy resume rejected');assert.match(a.doc.querySelector('[role="alert"]').textContent,/版本|范围|重新开局/);assert.equal(a.saved,old);assert.equal(a.creates.length,0);
  a.click('关闭提示');a.click('开始对局');await until(()=>a.doc.querySelector('.config-summary'));assert.doesNotMatch(a.doc.querySelector('.config-summary').textContent,retiredCopy);a.click('取消');assert.equal(a.saved,old);
  a.click('开始对局');await until(()=>a.button('覆盖存档并开始'));a.click('覆盖存档并开始',{twice:true});await a.play();assert.equal(a.creates.length,1);assertNoRetiredOptions(a.creates[0]);assert.notEqual(a.saved,old);assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});

for(const [label,patch] of [
 ['retired pack',{content_packs:['sgs_youjian_equipment_compat_1']}],
 ['derived equipment setup',{zhangfen_faces:{attack:{suit:'红桃',rank:13},defend:{suit:'梅花',rank:12}}}],
 ['retired player identity',{hero_id:'sgs.mobile.derived.hero.zhang-fen',hero_index:3}],
 ['retired AI identity',{ai_hero_id:'sgs.mobile.hero.wangyun.20231207',ai_hero_index:4}],
])test(`current-version save with ${label} is rejected, never silently resumed or overwritten`,async()=>{
 let a=mount();try{
  await a.home();a.select('ai-hero',1);a.click('开始对局');await a.play();
  const candidate=JSON.parse(a.saved);Object.assign(candidate.config,patch);const raw=JSON.stringify(candidate);
  a.close();a=mount({saved:raw});await a.home();assertOrdinarySetup(a);a.click('继续上局');
  await until(()=>a.doc.querySelector('[role="alert"]')&&a.button('开始对局')&&!a.button('开始对局').disabled,`${label} rejected`);assert.equal(a.saved,raw);assert.equal(a.creates.length,0);assert.equal(a.doc.querySelector('.action-dock'),null);assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});

test('production build exposes the same conventional setup and scoped help',async()=>{
 const a=mount({code:await readFile(root+'dist/app.js','utf8')});try{
  await a.home();assertOrdinarySetup(a);a.click('玩法说明');await until(()=>a.doc.querySelector('.help-dialog'));assert.doesNotMatch(a.doc.querySelector('.help-dialog').textContent,retiredCopy);assert.deepEqual(a.errors,[]);
 }finally{a.close();}
});
