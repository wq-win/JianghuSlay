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
    assert.equal(doc.querySelectorAll('button, .sgs-card').length,0);
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
    assert.equal(match.responses.length,responses);assert.equal(dom.window.localStorage.getItem('jh_browser_save_v2'),before);
    assert.deepEqual(errors,[]);
  }finally{dom.window.close();}
});

test('static styles declare responsive normal-flow panels and local assets (not a geometry test)',async()=>{
  const css=await readFile(resolve(root,'web/public/layout.css'),'utf8');
  assert.match(css,/grid-template-columns:\s*20rem minmax\(0, 1fr\)/);
  assert.match(css,/@media \(max-width: 640px\)/);
  assert.match(css,/grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css,/\.sgs-table\s*\{[^}]*height:\s*auto/s);
  assert.match(css,/\.sgs-table\s*\{[^}]*overflow:\s*visible/s);
  const html=await readFile(resolve(root,'dist/index.html'),'utf8');
  for(const file of ['styles.css','card-art.css','layout.css'])assert.ok(html.includes(`./${file}`));
});
