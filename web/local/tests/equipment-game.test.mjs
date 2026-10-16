import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../game.js';
import {Card,CardType as T,CardSuit as S,Player,HEROES,suit_color,Deck,SeededRNG} from '../models.js';
import {EQUIPMENT_CATALOG,EQUIPMENT_SOURCE_RECORDS,canonical_equipment_definition} from '../equipment-catalog.mjs';
const card=(type=T.SHA,suit=S.SPADE,options={})=>new Card(options.name??type,type,{suit,color:suit_color(suit),rank:7,...options});
const gear=name=>{const definition=EQUIPMENT_SOURCE_RECORDS.find(c=>c.name===name||c.base_name===name);assert.ok(definition,name);return new Card(definition.name,definition.type,{...definition,equipment_id:definition.id});};
class View {
 constructor(answers=[]){this.answers=[...answers];this.logs=[];this.prompts=[];}
 emit(message){this.logs.push(message);assert.ok(this.logs.length<1000,'rules must terminate');}
 async ask_line(message,options={}){this.prompts.push({message,...options});assert.ok(this.answers.length,`Unexpected prompt ${message}`);const answer=this.answers.shift();return String(typeof answer==='function'?await answer({message,...options}):answer);}
 async ask_confirm(message,options={}){return ['y','yes','1'].includes(await this.ask_line(message,{...options,kind:'confirm'}));}
}
function setup({answers=[],aHero='姜维',bHero='姜维',third=false}={}) {
 const v=new View(answers),g=new Game(v,{seed:319});g.player=new Player('你',(HEROES.find(h=>h.name===aHero)||HEROES.find(h=>h.aliases?.includes(aHero))),false);g.ai=new Player('乙',(HEROES.find(h=>h.name===bHero)||HEROES.find(h=>h.aliases?.includes(bHero))),true);g.ai2=third?new Player('丙',HEROES.find(h=>h.name==='姜维'),true):null;
 g.p1=g.player;g.p2=g.ai;g.p3=g.ai2;g.mode=third?'1v2':'1v1';g.turn_actor='p1';g.turn_phase='play';g.deck.draw_pile=[];g.deck.discard_pile=[];
 return {g,a:g.player,b:g.ai,c:g.ai2,v};
}
const top=(g,...cards)=>{g.deck.draw_pile=cards.slice().reverse();};
const zones=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,p.weapon,p.armor,p.offensive_horse,p.defensive_horse].filter(Boolean))];
const attack=async(g,a,b,type=T.SHA,suit=S.SPADE)=>{const sha=card(type,suit);a.hand.push(sha);const before=zones(g);a.hand.splice(a.hand.indexOf(sha),1);await g.resolve_card(a,b,sha);assert.deepEqual(new Set(zones(g)),new Set(before),'physical cards conserved');return sha;};

test('real deck has20 canonical equipment and145 cards, retaining36 source identities without duplicate physical aliases',()=>{
 const d=new Deck(new SeededRNG(3)),eq=d.draw_pile.filter(c=>[T.WEAPON,T.ARMOR,T.OFFENSIVE_HORSE,T.DEFENSIVE_HORSE].includes(c.type));assert.equal(d.draw_pile.length,145);assert.equal(eq.length,20);assert.equal(new Set(eq.map(c=>c.equipment_id)).size,20);assert.equal(eq.reduce((n,c)=>n+c.source_records.length,0),36);assert.equal(eq.filter(c=>c.trait==='unlimited_sha').length,1);assert.equal(eq.filter(c=>c.type===T.OFFENSIVE_HORSE).length,1);assert.equal(eq.filter(c=>c.type===T.DEFENSIVE_HORSE).length,1);assert.ok(eq.every(c=>c.source_urls.length&&c.source_variant));assert.equal(eq.some(c=>c.name==='龙鳞甲'),false);
});
test('real attack no flat weapon bonus; renwang blocks black normal/thunder and red SHA damages',async()=>{
 for(const type of [T.SHA,T.THUNDER_SHA]){const {g,a,b}=setup();a.weapon=gear('麒麟弓');b.armor=gear('仁王盾');await attack(g,a,b,type);assert.equal(b.hp,4);}
 const {g,a,b}=setup();a.weapon=gear('方天画戟');b.armor=gear('仁王盾');a.hand=[card(T.WINE)];await attack(g,a,b,T.SHA,S.HEART);assert.equal(b.hp,3);
});
test('real vine plain SHA invalid before dodge/cold; thunder is not blocked by normal-SHA immunity',async()=>{
 const {g,a,b,v}=setup();a.weapon=gear('寒冰剑');b.armor=gear('藤甲');b.hand=[card(T.SHAN)];await attack(g,a,b);assert.equal(b.hp,4);assert.equal(b.hand.length,1);assert.equal(v.prompts.length,0);
 a.weapon=null;b.hand=[];await attack(g,a,b,T.THUNDER_SHA);assert.equal(b.hp,3);assert.equal(b.poison_mark_pending,false);assert.equal(b.chained,false);
});
test('real fire SHA vs vine, direct armor ignore, and silver cap preserve damage type',async()=>{
 for(const [armor,weapon,loss] of [['藤甲',null,2],['藤甲','青釭剑',1],['藤甲','鱼肠剑',1],['白银狮子',null,1]]){const {g,a,b}=setup();b.armor=gear(armor);if(weapon)a.weapon=gear(weapon);a.wine_bonus=armor==='白银狮子'?3:0;await attack(g,a,b,T.FIRE_SHA);assert.equal(b.hp,4-loss);}
});
test('real silver cap each event, loseHP bypass, equip replacement and theft all heal once',async()=>{
 const {g,a,b}=setup();b.armor=gear('白银狮子');assert.equal(await g.apply_damage(b,3,{source:a}),1);assert.equal(await g.apply_damage(b,1,{source:a}),1);assert.equal(b.hp,2);await g.lose_hp(b,1);assert.equal(b.hp,1);
 g.equip_card(b,'armor',gear('仁王盾'));assert.equal(b.hp,2);assert.equal(g.deck.discard_pile.filter(c=>c.name==='白银狮子').length,1);
 b.armor=gear('白银狮子');g.remove_equipment(b,'armor',{to:'hand',recipient:a,reason:'顺手牵羊'});assert.equal(b.hp,3);assert.equal(a.hand.at(-1).name,'白银狮子');
});
test('real ice replaces all wine-enhanced damage without on-damaged hooks; sequential cards',async()=>{
 const {g,a,b,v}=setup({answers:['replace','hand:1'],bHero:'虞姬'});a.weapon=gear('寒冰剑');a.hp=2;a.wine_bonus=2;b.hand=[card(T.SHA),card(T.WINE)];await attack(g,a,b,T.FIRE_SHA);assert.equal(b.hp,3);assert.equal(b.hand.length,0);assert.equal(a.hp,2);assert.equal(a.wine_bonus,0);assert.equal(a.sha_count_this_turn,1);assert.equal(v.logs.some(s=>s.includes('舍身')),false);
});
test('real ice armor loss heals immediately before second discard',async()=>{
 const {g,a,b}=setup({answers:['replace','eq:armor']});a.weapon=gear('寒冰剑');b.hp=2;b.armor=gear('白银狮子');b.hand=[card(T.SHA)];await attack(g,a,b,T.SHA,S.HEART);assert.equal(b.hp,3);assert.equal(b.armor,null);assert.equal(b.hand.length,0);
});
test('real axe after physical dodge preserves wine damage, count1, and heals paid lion before hit',async()=>{
 const {g,a,b}=setup({answers:['hand:1 eq:armor']});a.weapon=gear('贯石斧');a.armor=gear('白银狮子');a.hp=2;a.wine_bonus=1;a.hand=[card(T.WINE)];b.hand=[card(T.SHAN)];await attack(g,a,b);assert.equal(b.hp,2);assert.equal(a.hp,3);assert.equal(a.armor,null);assert.equal(a.sha_count_this_turn,1);assert.equal(a.wine_bonus,0);assert.equal(a.hand.length,0);
});
test('real axe triggers on virtual bagua dodge and never creates another response window',async()=>{
 const {g,a,b,v}=setup({answers:['hand:1 hand:2']});a.weapon=gear('贯石斧');a.hand=[card(T.WINE),card(T.SHA)];a.wine_bonus=1;b.armor=gear('八卦阵');top(g,card(T.TAO,S.HEART));await attack(g,a,b);assert.equal(b.hp,2);assert.equal(a.sha_count_this_turn,1);assert.equal(v.logs.filter(s=>s.includes('八卦阵判定')).length,1);assert.equal(g.deck.draw_pile.length,0);
});
test('real bow removal happens pre-damage, is optional and attacker selects offensive horse',async()=>{
 for(const name of ['霸王弓','麒麟弓']){const {g,a,b}=setup({answers:['eq:offensive_horse']});a.weapon=gear(name);b.offensive_horse=gear('赤兔');b.defensive_horse=gear('绝影');const original=g.apply_damage.bind(g);g.apply_damage=async(...args)=>{assert.equal(b.hp,4);assert.equal(b.offensive_horse,null);assert.ok(b.defensive_horse);return original(...args);};await attack(g,a,b);assert.equal(b.hp,3);}
 const {g,a,b}=setup({answers:['cancel']});a.weapon=gear('霸王弓');b.offensive_horse=gear('赤兔');await attack(g,a,b);assert.ok(b.offensive_horse);assert.equal(b.hp,3);
});
test('real dual sword uses rule genders before dodge and discards only hand',async()=>{
 const {g,a,b,v}=setup({answers:['activate'],aHero:'姜维',bHero:'花木兰'});a.weapon=gear('雌雄双股剑');b.hand=[card(T.WINE),card(T.SHAN)];top(g,card(T.SHA));await attack(g,a,b);assert.equal(b.hp,4);assert.equal(b.hand.length,1);assert.equal(v.logs.some(s=>s.includes('雌雄双股剑')&&s.includes('弃置')),true);assert.equal(a.sha_count_this_turn,1);
});
test('real fire fan sends plain SHA through vine and chain; guding current hand0 grants one',async()=>{
 const x=setup({answers:['activate'],third:true});x.a.weapon=gear('朱雀羽扇');x.b.armor=gear('藤甲');x.b.chained=true;x.c.chained=true;await attack(x.g,x.a,x.b);assert.equal(x.b.hp,2);assert.equal(x.c.hp,2);assert.equal(x.b.chained,false);assert.equal(x.c.chained,false);
 const y=setup();y.a.weapon=gear('古锭刀');await attack(y.g,y.a,y.b);assert.equal(y.b.hp,2);
});
test('real chain does not repeat source bonus and armor ignore never leaks to another recipient',async()=>{
 const {g,a,b,c}=setup({third:true});a.weapon=gear('青釭剑');b.armor=gear('藤甲');c.armor=gear('藤甲');b.chained=true;c.chained=true;await attack(g,a,b,T.FIRE_SHA);assert.equal(b.hp,3);assert.equal(c.hp,2);assert.equal(b.chained,false);assert.equal(c.chained,false);
});
test('real final-hand halberd targets multiple opponents, one card and one quota, without +2 damage',async()=>{
 const {g,a,b,c}=setup({answers:['p3'],third:true});a.weapon=gear('方天画戟');await attack(g,a,b);assert.equal(b.hp,3);assert.equal(c.hp,3);assert.equal(a.sha_count_this_turn,1);assert.equal(g.deck.discard_pile.filter(c=>c.type===T.SHA).length,1);
});

test('real bagua and jade satisfy AOE flash response; black judgment falls back to hand flash',async()=>{
 for(const name of ['八卦阵','玉如意']){const {g,a,b}=setup();b.armor=gear(name);top(g,card(T.TAO,S.HEART));await g.resolve_scroll(a,b,card(T.SCROLL,S.HEART,{name:'万箭齐发'}));assert.equal(b.hp,4);assert.equal(g.deck.discard_pile.length,1);}
 const {g,b}=setup();b.armor=gear('玉如意');b.hand=[card(T.SHAN)];top(g,card(T.SHA));assert.equal(await g.play_required_card(b,T.SHAN,'闪'),true);assert.equal(b.hand.length,0);assert.equal(g.deck.discard_pile.length,2);
});
test('real vine makes both mixed AOE names ineffective without demanding cards',async()=>{
 for(const name of ['烽火狼烟','万箭齐发']){const {g,a,b}=setup();b.armor=gear('藤甲');b.hand=[card(T.SHAN),card(T.SHA)];await g.resolve_card(a,b,card(T.SCROLL,S.HEART,{name}));assert.equal(b.hp,4);assert.equal(b.hand.length,2);}
});
test('real spear variants answer SHA without extra virtual card, obey source-specific colors',async()=>{
 for(const name of ['丈八蛇矛','芦叶枪']){const {g,b}=setup();b.weapon=gear(name);b.hand=[card(T.SHAN,S.HEART),card(T.WINE,S.SPADE)];const before=zones(g);assert.equal(g.two_card_sha(b,b.hand).color,name==='芦叶枪'?'红':'无色');assert.equal(await g.play_required_card(b,T.SHA,'杀'),true);assert.equal(b.hand.length,0);assert.equal(g.deck.discard_pile.length,2);assert.equal(g.deck.discard_pile.some(c=>c.virtual),false);assert.deepEqual(new Set(zones(g)),new Set(before));}
});
test('real dragon blade may discard judgment unlike ice, and alias hammer restores original attack',async()=>{
 const x=setup({answers:['replace']});x.a.weapon=gear('龙鳞刀');x.b.judgment_cards=[card(T.SCROLL,S.CLUB,{name:'兵粮寸断'})];await attack(x.g,x.a,x.b);assert.equal(x.b.hp,4);assert.equal(x.b.judgment_cards.length,0);
 const y=setup({answers:['hand:1 hand:2']});y.a.weapon=gear('博浪锤');y.a.hand=[card(T.WINE),card(T.WINE)];y.b.hand=[card(T.SHAN)];y.a.wine_bonus=1;await attack(y.g,y.a,y.b);assert.equal(y.b.hp,2);assert.equal(y.a.sha_count_this_turn,1);
});
test('real silver lion heals before 李白装备转杀 and 武圣 equipped-material use',async()=>{
 const x=setup({aHero:'李白'});x.a.hp=2;x.a.armor=gear('白银狮子');x.a.shixian_active=true;await x.g.use_equipment_as_sha(x.a,x.b,'armor');assert.equal(x.a.hp,3);assert.equal(x.b.hp,3);assert.equal(x.a.armor,null);
 const y=setup({aHero:'关羽'});y.a.hp=2;y.a.armor=new Card('白银狮子',T.ARMOR,{...gear('白银狮子'),color:'红',suit:S.HEART});const material=y.g.skill_material_options(y.a).find(m=>m.zone==='armor');const used=y.g.consume_material(y.a,material);assert.equal(y.a.hp,3);assert.equal(used.name,'白银狮子');assert.equal(y.a.armor,null);
});
test('real all named horse variants only affect directed distance with minimum one',()=>{
 for(const definition of EQUIPMENT_SOURCE_RECORDS.filter(c=>c.type===T.OFFENSIVE_HORSE||c.type===T.DEFENSIVE_HORSE)){
  const {g,a,b}=setup();const horse=gear(definition.name);assert.equal(g.distance_between(a,b),1);
  if(definition.type===T.OFFENSIVE_HORSE){a.offensive_horse=horse;b.defensive_horse=gear('绝影');assert.equal(g.distance_between(a,b),1);assert.equal(g.distance_between(b,a),1);assert.equal(a.attack_bonus,0);}
  else {b.defensive_horse=horse;assert.equal(g.distance_between(a,b),2);assert.equal(g.distance_between(b,a),1);assert.equal(b.defense_bonus,0);}
 }
});
test('real crossbow and tiger seal quota stops on losing weapon, never grants attack damage',()=>{
 for(const name of ['诸葛连弩','虎符']){const {g,a}=setup();a.weapon=gear(name);a.sha_count_this_turn=10;assert.equal(g.can_use_sha(a),true);assert.equal(a.attack_bonus,0);g.remove_equipment(a,'weapon',{to:'discard'});assert.equal(g.can_use_sha(a),false);}
});
test('real qinglong follow uses fresh chosen thunder SHA, no old wine and no second play quota',async()=>{
 const {g,a,b}=setup({answers:['y']});a.weapon=gear('青龙偃月刀');a.hand=[card(T.THUNDER_SHA)];b.hand=[card(T.SHAN)];a.wine_bonus=2;await attack(g,a,b,T.FIRE_SHA);assert.equal(b.hp,3);assert.equal(b.poison_mark_pending,false);assert.equal(a.sha_count_this_turn,1);assert.equal(a.wine_bonus,0);assert.equal(a.hand.length,0);
});
test('real qinglong follow ignores changed distance but checks empty-hand target prohibitions',async()=>{
 const x=setup({answers:['y']});x.a.weapon=gear('青龙偃月刀');x.a.hand=[card(T.SHA)];x.b.hand=[card(T.SHAN)];x.g.trigger_on_dodge=async()=>{x.b.defensive_horse=card(T.DEFENSIVE_HORSE,S.SPADE,{power:9});};await x.g.use_sha(x.a,x.b);assert.equal(x.b.hp,3);assert.equal(x.a.sha_count_this_turn,1);
 const y=setup({bHero:'诸葛亮'});y.a.weapon=gear('青龙偃月刀');y.a.hand=[card(T.SHA)];y.b.hand=[card(T.SHAN)];await y.g.use_sha(y.a,y.b);assert.equal(y.b.hp,3);assert.equal(y.a.hand.length,1);assert.equal(y.v.prompts.length,0);
});
