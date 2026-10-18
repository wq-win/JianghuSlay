import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM,VirtualConsole} from 'jsdom';
import {build} from 'esbuild';
import {Deck,SeededRNG} from '../web/local/models.js';
import {card_to_dict} from '../web/local/state.js';
import {CARD_ART,CardArt,EquipmentSlot,equipmentStat} from '../web/public/card-art.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const cards=new Deck(new SeededRNG(987)).draw_pile.map(c=>card_to_dict(c));
const pause=()=>new Promise(r=>setTimeout(r,10));
async function until(fn){for(let n=0;n<300;n++){if(fn())return;await pause();}assert.fail('UI condition timed out');}

test('all 145 cards have 39 distinct local original illustrations and hidden art is not requested',()=>{
  assert.equal(cards.length,145);
  const names=[...new Set(cards.map(c=>c.name))];assert.equal(names.length,39);
  assert.equal(Object.keys(CARD_ART).length,68);
  assert.equal(new Set(names.map(name=>CARD_ART[name].body)).size,39);
  for(const card of cards){
    assert.ok(CARD_ART[card.name],card.name);
    const svg=renderToStaticMarkup(createElement(CardArt,{card}));
    assert.match(svg,/<svg/);assert.ok(svg.includes(`data-art-name="${card.name}"`));
    assert.doesNotMatch(svg,/<script|<image|href=|https?:\/\/|\bonload=/i);
  }
  assert.match(renderToStaticMarkup(createElement(CardArt,{card:{name:'未来未知牌'}})),/<svg/);
});

test('all 20 equipment names render object slots and readable stats with keyboard/tap details',()=>{
  const slots={武器:'weapon',防具:'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
  const equipment=cards.filter(c=>slots[c.type]);assert.equal(equipment.length,20);
  for(const card of equipment){
    const slot=slots[card.type], markup=renderToStaticMarkup(createElement(EquipmentSlot,{card,slot}));
    const doc=new JSDOM(markup).window.document;
    assert.equal(doc.querySelectorAll('details > summary').length,1);
    assert.equal(doc.querySelectorAll('.sgs-card').length,0);
    assert.equal(doc.querySelectorAll('button.equipment-detail-close').length,1);
    assert.equal(doc.querySelector('.equipment-slot__name').textContent,card.name);
    assert.equal(doc.querySelector('.equipment-slot__stat').textContent,equipmentStat(card,slot));
    assert.equal(doc.querySelector('.equipment-slot__art svg').getAttribute('data-art-name'),card.name);
    assert.ok(doc.querySelector('summary').getAttribute('aria-label').includes(card.name));
  }
  for(const slot of Object.values(slots)) assert.match(renderToStaticMarkup(createElement(EquipmentSlot,{slot})),/未装备/);
});

test('complete 1v2 React table retains all four slots, all 145 illustrated hand faces, and discard gallery',async()=>{
  const bundle=await build({absWorkingDir:root,entryPoints:['web/public/app.js'],bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'fixture',setup(b){b.onResolve({filter:/^\.\.\/local\/session\.js$/},()=>({path:resolve(root,'tests/browser-ui.fixture.mjs')}));}}]});
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
  const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/game/jianghu-slay/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});
  const doc=dom.window.document;
  dom.window.fetch=()=>{throw new Error('network forbidden');};dom.window.WebSocket=class{constructor(){throw new Error('socket forbidden');}};
  const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
  try{
    dom.window.eval(bundle.outputFiles[0].text);await until(()=>button('开始对局'));
    const mode=doc.getElementById('match-mode');mode.value='ai2';mode.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await until(()=>doc.getElementById('ai2-hero'));
    button('开始对局').click();await until(()=>doc.querySelector('.action-dock'));
    const match=dom.window.__fixture,state=match.state();
    const slots={weapon:'武器',armor:'防具',offensive_horse:'-1马',defensive_horse:'+1马'};
    for(const [slot,type] of Object.entries(slots))state.players.self.equipment[slot]=cards.find(c=>c.type===type);
    state.players.self.hand=cards;state.players.self.hand_count=cards.length;
    state.recent_cards=cards.slice(0,3);state.discard_count=3;
    match.show('play_card',{},state);await until(()=>doc.querySelectorAll('.action-dock .sgs-card').length===145);
    assert.equal(doc.querySelector('.felt'),null);
    assert.equal(doc.querySelectorAll('.self-panel .general-seat.self').length,1);
    assert.equal(doc.querySelectorAll('.self-panel .equip-rail > .equipment-slot').length,4);
    assert.equal(doc.querySelectorAll('.opponent-panel').length,2);
    assert.equal(doc.querySelectorAll('.opponent-panel .equip-rail > .equipment-slot').length,8);
    assert.equal(doc.querySelectorAll('.equip-rail .sgs-card').length,0);
    for(const [i,node] of [...doc.querySelectorAll('.action-dock .sgs-card')].entries()){
      assert.equal(node.querySelector('.card-art').getAttribute('data-art-name'),cards[i].name);
      assert.equal(node.querySelector('.cname').textContent,cards[i].base_name||cards[i].name);
      assert.equal(node.querySelector('.corner.tl b').textContent,cards[i].rank_label);
      assert.ok(node.querySelector('.corner.tl i').textContent);
    }
    assert.equal(doc.querySelectorAll('.recent-discards .sgs-card').length,3);
    assert.equal(doc.querySelector('.recent-discards .cname').textContent,cards[2].name);
    assert.equal(doc.querySelectorAll('.sgs-card.back .card-art').length,0);
    const before=dom.window.localStorage.getItem('jh_browser_save_v2'),responses=match.responses.length;
    const horse=doc.querySelector('.self-panel [data-equipment-slot="defensive_horse"]');
    horse.querySelector('summary').click();assert.equal(horse.open,true);
    horse.querySelector('summary').click();assert.equal(horse.open,false);
    horse.querySelector('summary').click();
    horse.querySelector('.equipment-detail-close').click();assert.equal(horse.open,false);
    assert.equal(doc.activeElement,horse.querySelector('summary'));
    const rules=doc.querySelector('.self-panel > .table-inspector');
    rules.querySelector('summary').click();assert.equal(rules.open,true);
    rules.querySelector('.table-inspector-content > header button').click();assert.equal(rules.open,false);
    assert.equal(doc.activeElement,rules.querySelector('summary'));
    assert.equal(doc.querySelector('.player-row > .player-controls .action-dock') !== null,true);

    assert.equal(match.responses.length,responses);assert.equal(dom.window.localStorage.getItem('jh_browser_save_v2'),before);
    state.active_skills=[];state.players.self.marks.shixian=false;state.players.self.equipment.weapon=null;
    match.show('play_card',{},state);await until(()=>doc.querySelector('.dock-main--hand-only'));
    assert.equal(doc.querySelector('.skill-rail'),null,'a genuinely empty skill rail is not rendered');
    assert.equal(doc.querySelectorAll('.dock-main--hand-only .sgs-card').length,145);
    state.active_skills=[{id:'霸王',label:'霸王',hotkey:'q',arg_mode:'none'}];
    match.show('play_card',{},state);await until(()=>doc.querySelector('.skill-rail .active-skill-control'));
    assert.equal(doc.querySelector('.dock-main--hand-only'),null,'active skills retain their rail');
    state.active_skills=[];state.players.self.equipment.weapon={name:'丈八蛇矛',trait:'two_as_sha'};
    match.show('play_card',{},state);await until(()=>[...doc.querySelectorAll('.skill-rail button')].some(button=>button.textContent.trim()==='丈八'));
    assert.equal(doc.querySelector('.dock-main--hand-only'),null,'equipment conversion retains its control');
    assert.deepEqual(errors,[]);
  }finally{dom.window.close();}
});

test('single-screen styles define bounded tabletop bands, internal scrolling and safe details',async()=>{
  const css=await readFile(resolve(root,'web/public/layout.css'),'utf8');
  assert.match(css,/height:100dvh/);
  assert.match(css,/\.sgs-table \.dock-main\.dock-main--hand-only \{ grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css,/grid-template-rows:180px minmax\(70px,1fr\) minmax\(240px,38%\)/);
  assert.match(css,/\.player-row[^}]*grid-template-columns:300px minmax\(0,1fr\)/);
  assert.match(css,/@media \(max-width:640px\)/);
  assert.match(css,/@media \(max-height:500px\) and \(min-width:641px\)/);
  assert.match(css,/\.sgs-table \.hand-stage[^}]*overflow:auto/);
  assert.match(css,/\.table-inspector-content,\.battle-board \.equipment-slot__details[^}]*position:fixed[^}]*max-height:70dvh[^}]*overflow:auto/);
  assert.match(css,/\.sgs-table \.modal-mask \{ z-index:40/);
  const html=await readFile(resolve(root,'dist/index.html'),'utf8');
  for(const file of ['styles.css','card-art.css','layout.css'])assert.ok(html.includes(`./${file}`));
});
