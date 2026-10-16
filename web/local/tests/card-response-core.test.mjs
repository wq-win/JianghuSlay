import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../game.js';
import {Card,CardType as T,CardSuit as S,Player,HEROES,Deck,SeededRNG,JIANGHU_DECK_SIZE,suit_color,canonical_hero_for_source,CLASSIC_HEROES,EXPANSION_HEROES} from '../models.js';
import {EQUIPMENT_CATALOG,EQUIPMENT_SOURCE_RECORDS} from '../equipment-catalog.mjs';
const hero=n=>canonical_hero_for_source(EXPANSION_HEROES.find(h=>h.name===n)?.id)??CLASSIC_HEROES.find(h=>h.name===n)??HEROES.find(h=>h.id===n||h.display_name===n);
const card=(name,type=T.SCROLL,suit=S.SPADE,extra={})=>new Card(name,type,{suit,color:suit_color(suit),rank:7,...extra});
const gear=name=>{const d=EQUIPMENT_SOURCE_RECORDS.find(e=>e.name===name);assert.ok(d,name);return new Card(d.name,d.type,{...d,equipment_id:d.id,suit:S.CLUB,color:'黑',rank:6});};
function setup({names=['姜维','姜维','姜维'],answers=[],human=[]}={}){
  const prompts=[],logs=[];let g;
  const view={emit:m=>logs.push(m),ask_line:async(message,options)=>{prompts.push({message,...options});assert.ok(answers.length,`unexpected prompt ${message}`);const answer=answers.shift();return String(typeof answer==='function'?await answer(g,{message,...options}):answer);},ask_confirm:async(message,options)=>['y','1'].includes(await view.ask_line(message,{...options,kind:'confirm'}))};
  g=new Game(view,{seed:21});[g.player,g.ai,g.ai2]=names.map((n,i)=>new Player(`P${i+1}`,hero(n),!human.includes(i)));[g.p1,g.p2,g.p3]=g.all_players();g.turn_actor='p1';g.turn_phase='play';g.mode='1v2';
  return {g,a:g.player,b:g.ai,c:g.ai2,prompts,logs};
}
const zones=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,p.weapon,p.armor,p.offensive_horse,p.defensive_horse].filter(Boolean))];
const signature=g=>zones(g).map(c=>JSON.stringify(c)).sort();
async function use(g,a,b,c,options={}){a.hand.splice(a.hand.indexOf(c),1);await g.resolve_card(a,b,c,options);}
function pile(g,cards){g.deck.draw_pile=[...cards].reverse();g.deck.discard_pile=[];}

test('adapted deck contains 145 physical cards, 20 deduplicated equipment entities and all five new tricks',()=>{
  const deck=new Deck(new SeededRNG(3));assert.equal(deck.draw_pile.length,JIANGHU_DECK_SIZE);assert.equal(JIANGHU_DECK_SIZE,145);assert.equal(EQUIPMENT_SOURCE_RECORDS.length,36);
  assert.equal(deck.draw_pile.filter(c=>c.equipment_id).length,20);assert.equal(new Set(deck.draw_pile.filter(c=>c.equipment_id).map(c=>c.equipment_id)).size,20);
  for(const name of ['无懈可击','借刀杀人','铁索连环','火攻','兵粮寸断'])assert.ok(deck.draw_pile.some(c=>c.name===name));
  assert.equal(deck.draw_pile.some(c=>c.name==='龙鳞甲'),false);assert.ok(deck.draw_pile.every(c=>c.rank>=1&&c.rank<=13));
});
test('one nullification cancels fire before reveal/payment; its physical card cannot be drawn while countering',async()=>{
  const {g,a,b,prompts}=setup();const fire=card('火攻'),payment=card('桃',T.TAO,S.HEART),nullify=card('无懈可击');a.hand=[fire,payment];b.hand=[nullify,card('闪',T.SHAN,S.HEART)];const before=signature(g);
  await use(g,a,b,fire);assert.equal(b.hp,4);assert.ok(a.hand.includes(payment));assert.equal(prompts.length,0);assert.ok(g.deck.discard_pile.includes(nullify));assert.deepEqual(signature(g),before);assert.deepEqual(g.response_stack,[]);
});
test('two nested nullifications restore the original fire effect and keep cards conserved',async()=>{
  const {g,a,b}=setup();const fire=card('火攻'),payment=card('桃',T.TAO,S.HEART);a.hand=[fire,payment,card('无懈可击')];b.hand=[card('闪',T.SHAN,S.HEART),card('无懈可击')];const reveal=b.hand[0],before=signature(g);
  await use(g,a,b,fire);assert.equal(b.hp,3);assert.ok(b.hand.includes(reveal));assert.equal(a.hand.length,0);assert.deepEqual(signature(g),before);assert.equal(g.processing_cards.length,0);
});
test('nullification response stack is per target, including legacy AOE',async()=>{
  const {g,a,b,c}=setup();const aoe=card('万箭齐发');a.hand=[aoe];b.hand=[card('无懈可击')];c.hand=[];await use(g,a,b,aoe);assert.equal(b.hp,4);assert.equal(c.hp,3);
});
test('counter prompt exposes only JSON frame metadata and conserves all physical cards during every wait',async()=>{
  const {g,a,b}=setup({human:[1],answers:[(game,prompt)=>{assert.equal(prompt.meta.stage,'nullification');assert.equal(prompt.meta.private_to,'p2');assert.equal(game.processing_cards.length,1);assert.equal(game.response_stack[0].card_name,'火攻');assert.deepEqual(signature(game),before);JSON.stringify(game.response_stack);return 'hand:2';}]});
  const fire=card('火攻');a.hand=[fire,card('闪',T.SHAN,S.HEART)];b.hand=[card('桃',T.TAO,S.HEART),card('无懈可击')];const before=signature(g);await use(g,a,b,fire);assert.deepEqual(signature(g),before);
});
test('nullification does not cancel SHA, equipment effects or hero skills',async()=>{
  const {g,a,b,prompts}=setup();b.hand=[card('无懈可击')];const sha=card('杀',T.SHA,S.HEART);a.hand=[sha];await use(g,a,b,sha);assert.equal(b.hp,3);assert.equal(b.hand[0].name,'无懈可击');assert.equal(prompts.length,0);
});
test('fire uses four exact suits, not color, and revealed card stays in target hand',async()=>{
  const {g,a,b}=setup();const fire=card('火攻'),pay=card('杀',T.SHA,S.HEART),show=card('闪',T.SHAN,S.DIAMOND);a.hand=[fire,pay];b.hand=[show];await use(g,a,b,fire);assert.equal(b.hp,4);assert.ok(a.hand.includes(pay));assert.ok(b.hand.includes(show));assert.ok(g.deck.discard_pile.includes(fire));
});
test('fire target selects revealed card; caster may cancel matching cost',async()=>{
  const {g,a,b,prompts}=setup({human:[0,1],answers:['hand:2','cancel']});const fire=card('火攻'),pay=card('杀',T.SHA,S.HEART);a.hand=[fire,pay];b.hand=[card('闪',T.SHAN,S.CLUB),card('桃',T.TAO,S.HEART)];await use(g,a,b,fire);assert.equal(b.hp,4);assert.ok(a.hand.includes(pay));assert.deepEqual(prompts.map(p=>p.meta.stage),['fire_reveal','fire_pay']);assert.equal(prompts[1].meta.revealed_card.suit,S.HEART);
});
test('self fire permits revealing and paying the same remaining card',async()=>{
  const {g,a}=setup();const fire=card('火攻'),pay=card('闪',T.SHAN,S.HEART);a.hand=[fire,pay];await use(g,a,a,fire);assert.equal(a.hp,3);assert.equal(a.hand.length,0);
});
test('last-card self fire is target-legal but fails when hand becomes empty during resolution',async()=>{
  const {g,a}=setup();const fire=card('火攻');a.hand=[fire];assert.equal(g.can_play(a,a,fire),true);await use(g,a,a,fire);assert.equal(a.hp,4);assert.equal(a.hand.length,0);
});
test('iron chain toggles two targets separately and recast never uses trick/集智/nullification',async()=>{
  const {g,a,b,c}=setup({names:['黄月英','姜维','姜维']});const chain=card('铁索连环');a.hand=[chain];b.chained=false;c.chained=true;await use(g,a,b,chain,{targets:[b,c]});assert.equal(b.chained,true);assert.equal(c.chained,false);
  const recast=card('铁索连环');a.hand=[recast];b.hand=[card('无懈可击')];const before=g.deck.draw_pile.length;await use(g,a,a,recast,{recast:true});assert.equal(a.hand.length,1);assert.equal(g.deck.draw_pile.length,before-1);assert.equal(b.hand.length,1);
});
test('chain selection cancel after first target is free and preserves both states',async()=>{
  const {g,a,b}=setup({human:[0],answers:['link','p2','cancel']});const chain=card('铁索连环');a.hand=[chain];assert.equal(await g.prepare_card_use(a,chain,b),null);assert.deepEqual(a.hand,[chain]);assert.equal(b.chained,false);
});
test('normal damage and HP loss do not propagate or unlink',async()=>{
  const {g,a,b,c}=setup();b.chained=c.chained=true;await g.apply_damage(b,1,{source:a,nature:'normal'});await g.lose_hp(b,1);assert.equal(b.hp,2);assert.equal(c.hp,4);assert.equal(b.chained,true);
});
test('fire chain includes allies, uses initial final damage baseline and never compounds later vine',async()=>{
  const {g,a,b,c}=setup();a.chained=b.chained=c.chained=true;b.armor=gear('藤甲');c.armor=gear('藤甲');await g.apply_damage(b,1,{source:a,nature:'fire'});assert.equal(b.hp,2);assert.equal(c.hp,1);assert.equal(a.hp,2);assert.ok(g.all_players().every(p=>!p.chained));
});
test('silver cap on initial elemental damage becomes fixed chain baseline',async()=>{
  const {g,a,b,c}=setup();b.chained=c.chained=true;b.armor=gear('白银狮子');await g.apply_damage(b,4,{source:a,nature:'thunder'});assert.equal(b.hp,3);assert.equal(c.hp,3);
});
test('fully prevented elemental damage neither propagates nor unlinks',async()=>{
  const {g,a,b,c}=setup();b.chained=c.chained=true;b.armor=card('synthetic barrier',T.ARMOR,S.CLUB,{power:4});await g.apply_damage(b,2,{source:a,nature:'fire'});assert.equal(b.hp,4);assert.equal(c.hp,4);assert.equal(b.chained,true);
});
test('dead initial recipient cannot abort chain; corpse cannot heal from armor departure or later heal()',async()=>{
  const {g,a,b,c}=setup();b.hp=1;b.chained=c.chained=true;b.armor=gear('白银狮子');b.hand=[card('杀',T.SHA)];await g.apply_damage(b,3,{source:a,nature:'fire'});assert.equal(b.dead,true);assert.equal(b.alive,false);assert.equal(c.hp,3);assert.equal(b.armor,null);assert.equal(b.hand.length,0);assert.equal(b.heal(99),0);assert.equal(b.hp,0);
});
test('ordinary armor ignoring is scoped to direct target, not chained recipients',async()=>{
  const {g,a,b,c}=setup();a.weapon=gear('青釭剑');b.armor=gear('藤甲');c.armor=gear('藤甲');b.chained=c.chained=true;const fire=card('火杀',T.FIRE_SHA,S.HEART);a.hand=[fire];await use(g,a,b,fire);assert.equal(b.hp,3);assert.equal(c.hp,2);
});
test('retired blood and poison cannot enter the conventional card-function path',async()=>{
  for(const type of [T.BLOOD_SHA,T.POISON_SHA]){const {g,a,b}=setup();const sha=card(type,type);a.hand=[sha];await assert.rejects(use(g,a,b,sha),/unsupported effective card function/);assert.equal(b.hp,4);}
});
test('supply is a physical unique distance-one judgment card; weapon range is irrelevant',async()=>{
  const {g,a,b}=setup();const supply=card('兵粮寸断');a.weapon=gear('麒麟弓');b.defensive_horse=gear('绝影');a.hand=[supply];assert.equal(g.can_place_delayed(a,b,supply),false);a.offensive_horse=gear('赤兔');assert.equal(g.can_place_delayed(a,b,supply),true);await use(g,a,b,supply);assert.deepEqual(b.judgment_cards,[supply]);assert.ok(!g.deck.discard_pile.includes(supply));assert.equal(g.can_place_delayed(a,b,supply),false);
});
test('supply has no insertion nullification, resolves nullification before flipping judgment',async()=>{
  const {g,a,b}=setup();const supply=card('兵粮寸断'),counter=card('无懈可击');a.hand=[supply];b.hand=[counter];await use(g,a,b,supply);assert.ok(b.hand.includes(counter));const count=g.deck.draw_pile.length;await g.resolve_judgment_cards(b);assert.equal(g.deck.draw_pile.length,count);assert.equal(b.skip_draw_stage,false);assert.equal(b.judgment_cards.length,0);assert.ok(g.deck.discard_pile.includes(supply));
});
for(const suit of Object.values(S))test(`supply final ${suit} judgment skips iff not club`,async()=>{
  const {g,a,b}=setup();const supply=card('兵粮寸断');a.hand=[supply];await use(g,a,b,supply);pile(g,[card('杀',T.SHA,suit)]);await g.resolve_judgment_cards(b);assert.equal(b.skip_draw_stage,suit!==S.CLUB);assert.equal(b.judgment_cards.length,0);assert.equal(g.deck.discard_pile.length,2);
});
test('supply skips full draw phase including 英姿 but allows play and end; flag clears after once',async()=>{
  const {g,a,b}=setup({names:['姜维','周瑜','姜维']});const supply=card('兵粮寸断');b.judgment_cards=[supply];pile(g,[card('杀',T.SHA,S.HEART),...Array.from({length:6},()=>card('闪',T.SHAN))]);let played=0;g.ai_play=async()=>played++;g.discard_down_to_hp=async()=>{};await g.take_turn(b,a);assert.equal(b.hand.length,0);assert.equal(played,1);assert.equal(b.skip_draw_stage,false);await g.take_turn(b,a);assert.equal(b.hand.length,3);assert.equal(played,2);
});
test('borrowed weapon chooses both targets before spending; cancellation preserves source and weapon',async()=>{
  const {g,a,b}=setup({human:[0],answers:['p2','cancel']});b.weapon=gear('青龙偃月刀');const borrowed=card('借刀杀人');a.hand=[borrowed];assert.equal(await g.prepare_card_use(a,borrowed,b),null);assert.ok(a.hand.includes(borrowed));assert.ok(b.weapon);
});
test('borrowed refusal transfers weapon to caster hand without equipping',async()=>{
  const {g,a,b,c}=setup();const weapon=gear('贯石斧');b.weapon=weapon;const borrowed=card('借刀杀人');a.hand=[borrowed];await use(g,a,b,borrowed,{forced_target:c});assert.ok(a.hand.includes(weapon));assert.equal(a.weapon,null);assert.equal(b.weapon,null);assert.equal(b.weapon_range,1);
});
test('borrowed real SHA at caster bypasses holder quota; dodge fulfills command without handing weapon',async()=>{
  const {g,a,b}=setup();const weapon=gear('诸葛连弩');b.weapon=weapon;b.sha_count_this_turn=3;b.used_sha_this_turn=true;const borrowed=card('借刀杀人');a.hand=[borrowed,card('闪',T.SHAN)];b.hand=[card('杀',T.SHA)];await use(g,a,b,borrowed,{forced_target:a});assert.equal(a.hp,4);assert.equal(b.weapon,weapon);assert.equal(b.sha_count_this_turn,3);assert.equal(b.hand.length,0);
});
test('borrowed Wusheng conversion keeps its source/gear and bypasses own play quota',async()=>{
  const {g,a,b}=setup({names:['姜维','关羽','姜维']});b.weapon=gear('青龙偃月刀');b.sha_count_this_turn=1;b.hand=[card('闪',T.SHAN,S.HEART)];const borrowed=card('借刀杀人');a.hand=[borrowed];await use(g,a,b,borrowed,{forced_target:a});assert.equal(a.hp,3);assert.equal(b.sha_count_this_turn,1);assert.ok(b.weapon);
});
test('borrowed and duel two-card spear responses consume two physical costs and no virtual card',async()=>{
  const {g,a,b}=setup();b.weapon=gear('丈八蛇矛');b.hand=[card('桃',T.TAO,S.HEART),card('闪',T.SHAN,S.CLUB)];const borrowed=card('借刀杀人');a.hand=[borrowed];const before=signature(g);await use(g,a,b,borrowed,{forced_target:a});assert.equal(a.hp,3);assert.equal(b.hand.length,0);assert.deepEqual(signature(g),before);assert.ok(zones(g).every(c=>!c.virtual));
});
test('borrowed nullification suppresses both forced SHA and weapon surrender',async()=>{
  const {g,a,b}=setup();const borrowed=card('借刀杀人'),weapon=gear('寒冰剑');a.hand=[borrowed];b.weapon=weapon;b.hand=[card('无懈可击')];await use(g,a,b,borrowed,{forced_target:a});assert.equal(b.weapon,weapon);assert.equal(a.hand.length,0);assert.equal(a.hp,4);
});
test('ordinary virtual trick skills participate in nullification',async()=>{
  const {g,a,b}=setup({names:['甘宁','姜维','姜维']});a.hand=[card('闪',T.SHAN,S.CLUB)];b.hand=[card('无懈可击'),card('桃',T.TAO)];await g.player_use_active_skill(a,b,'q',['1']);assert.equal(b.hand.length,1);assert.equal(b.hand[0].name,'桃');
});
test('lightning and prison now own physical judgment cards until their next judgment stage',async()=>{
  const {g,a,b,c}=setup();const lightning=card('手捧雷'),prison=card('画地为牢');a.hand=[lightning,prison];await use(g,a,b,lightning);await use(g,a,b,prison);assert.equal(b.prison_no_sha,false);assert.equal(b.judgment_cards.length,2);pile(g,[card('闪',T.SHAN,S.CLUB),card('杀',T.SHA,S.HEART)]);await g.resolve_judgment_cards(b);assert.equal(b.prison_no_sha,false);assert.equal(b.skip_play_stage,true);assert.ok(c.judgment_cards.includes(lightning));assert.ok(g.deck.discard_pile.includes(prison));
});

test('three nested nullifications cancel the single effect and consume exactly three counters',async()=>{
  const {g,a,b}=setup();const fire=card('火攻');a.hand=[fire,card('杀',T.SHA,S.HEART),card('无懈可击')];b.hand=[card('闪',T.SHAN,S.HEART),card('无懈可击'),card('无懈可击')];await use(g,a,b,fire);assert.equal(b.hp,4);assert.equal(g.deck.discard_pile.filter(c=>c.name==='无懈可击').length,3);assert.equal(a.hand.length,1);assert.equal(b.hand.length,1);
});
test('physical judgment cards can be stolen or removed by mixed-game ordinary tricks',async()=>{
  const {g,a,b}=setup({human:[0],answers:['1','1']});const supply=card('兵粮寸断');b.judgment_cards=[supply];const steal=card('顺手牵羊');a.hand=[steal];await use(g,a,b,steal);assert.ok(a.hand.includes(supply));assert.equal(b.judgment_cards.length,0);
  b.judgment_cards=[a.hand.splice(a.hand.indexOf(supply),1)[0]];const remove=card('釜底抽薪');a.hand.push(remove);await use(g,a,b,remove);assert.equal(b.judgment_cards.length,0);assert.ok(g.deck.discard_pile.includes(supply));
});
test('borrowed initial legality rejects missing weapon and out-of-range victim; conversion cost is revalidated',()=>{
  const {g,a,b}=setup({names:['姜维','关羽','姜维']});const borrowed=card('借刀杀人');assert.equal(g.can_play(a,b,borrowed),false);b.weapon=gear('青龙偃月刀');a.defensive_horse=gear('绝影');b.offensive_horse=card('马',T.OFFENSIVE_HORSE,S.HEART,{power:1});assert.equal(g.borrowed_victims(b).includes(a),true);
  b.weapon=gear('诸葛连弩');assert.equal(g.can_convert_material_to_sha(b,a,g.skill_material_options(b).find(m=>m.zone==='offensive_horse'),{ignore_quota:true,allow_allies:true}),false);
});
test('classic red-SHAN human gate remains explicit while other red cards can heal before new trick targeting',async()=>{
  const {g,a,b}=setup({names:['武则天','姜维','姜维']});a.hp=3;const dodge=card('闪',T.SHAN,S.HEART),fire=card('火攻',T.SCROLL,S.HEART);a.hand=[dodge,fire];assert.equal(g.can_play(a,b,dodge),false);assert.equal(g.can_play(a,b,fire),true);assert.deepEqual(await g.prepare_card_use(a,fire,b),{target:b});await use(g,a,b,fire);assert.equal(a.hp,4);
});
test('preview and dodge damage include vine, silver cap and empty-hand weapon bonus',()=>{
  const {g,a,b}=setup();a.weapon=gear('古锭刀');assert.equal(g.preview_sha_damage(a,b),2);b.armor=gear('白银狮子');assert.equal(g.preview_sha_damage(a,b),1);b.armor=gear('藤甲');assert.equal(g.preview_sha_damage(a,b),0);assert.equal(g.preview_sha_damage(a,b,card('火杀',T.FIRE_SHA)),3);
});

test('multi-target last-hand SHA resolves action order, keeps one wine baseline and independent target hooks',async()=>{
  const {g,a,b,c,logs}=setup({names:['马超','姜维','姜维']});a.weapon=gear('狼牙棒');a.wine_bonus=2;const sha=card('杀',T.SHA,S.HEART);a.hand=[sha];pile(g,[card('闪',T.SHAN,S.CLUB),card('杀',T.SHA,S.HEART)]);await use(g,a,c,sha);assert.equal(b.hp,1);assert.equal(c.hp,1);assert.equal(a.wine_bonus,0);assert.equal(a.sha_count_this_turn,1);
  const attacks=logs.filter(m=>m.includes('使用杀，威力'));assert.ok(attacks[0].includes('P2'));assert.ok(attacks[1].includes('P3'));assert.equal(logs.filter(m=>m.includes('铁骑判定')).length,2);
});

test('archived SGS Guan Yu resolves to one complete Dantai Ming source while source YXS Guan Yu stays distinct',async()=>{
  const source=EXPANSION_HEROES.find(h=>h.id==='sgs.adapted.base.hero.guan-yu'),canonical=hero('关羽');
  assert.equal(source.display_name,'云锋');assert.equal(source.source_character_name,'关羽');assert.match(source.identity_note,/三国杀基础关羽.*完整武圣机制.*来源ID/);
  assert.equal(canonical.id,'yxs.adapted.base.hero.dan-tai-ming');assert.equal(canonical.display_name,'澹台名');assert.equal(HEROES.includes(source),false);
  const {g,prompts}=setup({answers:[String(HEROES.indexOf(canonical)+1)]});assert.equal(await g.choose_hero(),canonical);
  const option=prompts[0].options.find(o=>o.id===String(HEROES.indexOf(canonical)+1));assert.ok(option.label.startsWith('澹台名'));assert.ok(!prompts[0].options.some(option=>option.label.startsWith('云锋')));
  assert.equal(HEROES.find(h=>h.display_name==='关羽').id,'yxs.mobile.historical.hero.guan-yu');
});
