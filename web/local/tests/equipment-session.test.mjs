import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {LocalMatch,SAVE_KEY,ENGINE_VERSION,CONTENT_VERSION} from '../session.js';
import {Game} from '../game.js';
import {Player,Card,CardType,HEROES,Deck,SeededRNG,canonical_hero_for_source,EXPANSION_HEROES} from '../models.js';
import {serialize_match_state,card_to_dict} from '../state.js';
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};

test('canonical source aliases and adapted-character identity survive public DTOs',()=>{
 const deck=new Deck(new SeededRNG(1));
 const counter=card_to_dict(deck.draw_pile.find(c=>c.name==='无懈可击'));
 assert.equal(counter.source_game,'三国杀');assert.ok(counter.source_urls.length);assert.match(counter.rule_timing,/锦囊/);
 const hammer=card_to_dict(deck.draw_pile.find(c=>c.name==='博浪锤'));
 assert.ok(hammer.aliases.includes('贯石斧'));assert.ok(hammer.source_records.some(r=>r.name==='贯石斧'));
 const source=EXPANSION_HEROES.find(h=>h.id==='sgs.adapted.base.hero.guan-yu'),canonical=canonical_hero_for_source(source.id);
 const hero=LocalMatch.heroes().find(h=>h.id===canonical.id);assert.equal(hero.name,'澹台名');assert.equal(hero.display_name,'澹台名');
 assert.ok(hero.source_id_aliases.includes(source.id));assert.match(source.identity_note,/三国杀基础关羽.*完整武圣机制/);assert.equal(LocalMatch.heroes().some(h=>h.id===source.id),false);
});

test('actual published V5 save is preserved byte-for-byte and rejected before any replay',async t=>{
 const fixture=JSON.parse(await readFile(new URL('../../../tests/fixtures/save-v5-before-equipment.json',import.meta.url),'utf8'));
 assert.equal(fixture.source_version,5);assert.equal(fixture.save.engine_version,'jianghu-browser-expansion-2');
 const storage=memory(),errors=[],messages=[],m=new LocalMatch({storage,onError:e=>errors.push(e),onMessage:e=>messages.push(e)});t.after(()=>m.close());
 const raw=JSON.stringify(fixture.save);storage.setItem(SAVE_KEY,raw);
 assert.equal(await m.resume(),false);assert.equal(m.game,null);assert.equal(storage.getItem(SAVE_KEY),raw);
 assert.match(errors.at(-1),/版本已更新.*重新开局.*未被删除/);assert.equal(messages.some(x=>x.type==='session'),false);
 await assert.rejects(m.importSave(fixture.save),/版本已更新/);assert.equal(storage.getItem(SAVE_KEY),raw);
 assert.notEqual(ENGINE_VERSION,fixture.save.engine_version);assert.notEqual(CONTENT_VERSION,fixture.save.content_version);
});

test('public state exposes chain and judgment zones without exposing hidden opposing hands',()=>{
 const g=new Game({emit(){}},{seed:87}),p=new Player('玩家',HEROES[0]),a=new Player('人机',HEROES[1],true);
 g.player=g.p1=p;g.ai=g.p2=a;g.ai2=g.p3=null;g.mode='1v1';
 a.hand=[new Card('秘密手牌',CardType.TAO)];a.judgment_cards=[new Card('兵粮寸断',CardType.SCROLL)];a.chained=true;a.skip_draw_stage=true;
 const state=serialize_match_state(g),foe=state.players.opponent;
 assert.deepEqual(foe.hand,[{hidden:true,name:'背面'}]);assert.equal(foe.judgment_cards[0].name,'兵粮寸断');
 assert.equal(foe.marks.chained,true);assert.equal(foe.marks.skip_draw_stage,true);
 assert.equal(state.players.self.marks.chained,false);assert.doesNotMatch(JSON.stringify(state),/秘密手牌/);
});

test('complete snapshot fingerprints pending counter frames and all new physical/phase state',()=>{
 const m=new LocalMatch({storage:memory()}),g=new Game({emit(){}},{seed:88}),p=new Player('玩家',HEROES[0]),a=new Player('人机',HEROES[1],true);
 g.player=g.p1=p;g.ai=g.p2=a;g.ai2=g.p3=null;g.mode='1v1';m.game=g;
 g.response_stack=[{type:'effect',card_name:'火攻',source_seat:'p1',target_seat:'p2',depth:0,effect_active:true},{type:'counter',card_name:'无懈可击',source_seat:'p2',target_seat:'p2',depth:1,effect_active:false}];
 const counter=new Card('无懈可击',CardType.SCROLL);g.processing_cards=[counter];a.judgment_cards=[new Card('兵粮寸断',CardType.SCROLL)];a.chained=true;a.skip_draw_stage=true;
 const first=m.snapshot(),hash=m._checkpoint(null);assert.deepEqual(first.response_stack,g.response_stack);assert.equal(first.processing_cards[0].name,'无懈可击');
 assert.equal(first.players[1].chained,true);assert.equal(first.players[1].judgment_cards[0].name,'兵粮寸断');
 g.response_stack[1].effect_active=true;assert.notEqual(m._checkpoint(null),hash);assert.equal(first.response_stack[1].effect_active,false,'snapshot is detached from live mutable frame');
});
