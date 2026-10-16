/** Team policy regressions. Legal targets remain separate from AI allegiance. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../web/local/game.js';
import {Card,CardType as T,CardSuit as S,Player,HEROES,CLASSIC_HEROES,YXS_FIRST_HEROES,suit_color} from '../web/local/models.js';
import {ai_try_active_skill,ai_choose_card,ai_borrowed_weapon_plan} from '../web/local/ai.js';
import {skill_hooks_for_hero} from '../web/local/skills.js';

const hero=name=>CLASSIC_HEROES.find(h=>h.name===name)??HEROES.find(h=>h.id===name||h.display_name===name||h.aliases?.includes(name));
const yxs=name=>YXS_FIRST_HEROES.find(h=>h.name===name);
const card=(type=T.SHAN,suit=S.SPADE,name=type)=>new Card(name,type,{suit,color:suit_color(suit),rank:7});
const scroll=name=>card(T.SCROLL,S.CLUB,name);
function setup(aiHero='姜维',thirdHero='姜维',answers=[]){
  const logs=[],prompts=[];
  const view={emit:message=>logs.push(message),ask_line:async(message,options={})=>{
    prompts.push({message,...options});assert.ok(answers.length,`Unexpected prompt: ${message}`);return answers.shift();
  }};
  view.ask_confirm=async(message,options)=>['y','1'].includes(await view.ask_line(message,options));
  const g=new Game(view,{seed:31});
  g.player=g.p1=new Player('玩家',hero('姜维'),true);
  g.ai=g.p2=new Player('AI1',hero(aiHero),true);
  g.ai2=g.p3=new Player('AI2',hero(thirdHero),true);
  g.mode='1v2';g.turn_actor='p2';g.turn_phase='play';
  return {g,p:g.player,a:g.ai,b:g.ai2,logs,prompts};
}

test('1v2 allegiance follows seat, with both AI seats sharing one side',()=>{
  const {g,p,a,b}=setup();
  assert.equal(g.side_of(a),g.side_of(b));assert.notEqual(g.side_of(p),g.side_of(a));
  for(const actor of [a,b]){
    assert.equal(g.default_foe(actor),p);assert.deepEqual(g.alive_enemies(actor),[p]);
    assert.deepEqual(g.alive_allies(actor),[actor===a?b:a]);
    assert.equal(g.can_sha_target(actor,actor===a?b:a),true);
  }
  b.dead=true;assert.deepEqual(g.alive_allies(a),[]);
});

test('negative active skills use the human-side foe and do not mark their teammate',async()=>{
  const {g,p,a,b}=setup('武则天');a.hand=[card(T.SHAN,S.HEART)];
  assert.equal(await ai_try_active_skill(g,a,g.default_foe(a)),true);
  assert.equal(p.judgment_mark_pending,true);assert.equal(b.judgment_mark_pending,false);
});

test('貂蝉离间 removes a player card, never the teammate card',async()=>{
  const {g,p,a,b}=setup('貂蝉');a.hand=[card(),card(),card()];
  p.hand=[card(),card(),card(),card()];b.hand=[card(),card(),card(),card(),card()];
  await g.trigger_on_turn_start(a,g.default_foe(a));
  assert.equal(p.hand.length,3);assert.equal(b.hand.length,5);
});

test('classic 扁鹊 AI never executes an ally; global rescue follows current seat order',async()=>{
  for(const bianqueSeat of ['p2','p3']){
    const {g,a,b,logs}=setup('扁鹊','姜维');
    const bianque=bianqueSeat==='p2'?a:b,ally=bianque===a?b:a;
    bianque.hero=hero('扁鹊');ally.hero=hero('姜维');
    const kept=card(T.TAO,S.HEART);bianque.hand=[kept];ally.hand=[card(T.TAO,S.HEART)];ally.hp=0;
    await g.resolve_dying(ally);
    assert.equal(ally.alive,true);assert.equal(ally.hp,bianqueSeat==='p2'?2:1);assert.deepEqual(bianque.hand,bianqueSeat==='p2'?[]:[kept]);
    assert.equal(ally.hand.length,bianqueSeat==='p2'?1:0,'current actor saves before the later ally self-rescue');
    assert.ok(!logs.some(log=>log.includes('发动鸩杀')));
  }
});

test('扁鹊 AI still executes an enemy before enemy self-rescue',async()=>{
  const {g,p,a}=setup('扁鹊');a.hand=[card(T.TAO,S.HEART)];p.hand=[card(T.TAO,S.HEART)];p.hp=0;
  await g.resolve_dying(p);assert.equal(p.dead,true);assert.equal(a.hand.length,0);
});

test('鸩杀 team avoidance is AI policy and preserves a human-controlled holder choice',async()=>{
  const {g,a,b,prompts}=setup('扁鹊','姜维',['y']);a.is_ai=false;a.hand=[card(T.TAO,S.HEART)];b.hp=0;
  const hook=skill_hooks_for_hero(a.hero).on_opponent_dying[0];
  assert.equal(await hook(g,a,b),true);assert.equal(a.hand.length,0);assert.equal(prompts.length,1);
});

test('无懈可击 protects an ally from a harmful trick and leaves ally draw intact',async()=>{
  const {g,p,a,b}=setup();a.hand=[scroll('无懈可击')];
  assert.equal(await g.nullification_window(p,b,scroll('釜底抽薪')),true);assert.equal(a.hand.length,0);
  a.hand=[scroll('无懈可击')];
  assert.equal(await g.nullification_window(b,b,scroll('无中生有')),false);assert.equal(a.hand.length,1);
  assert.equal(await g.nullification_window(p,p,scroll('无中生有')),true);assert.equal(a.hand.length,0);
});

test('mixed-game AOE affects all other living players, independently of the AI selection policy',async()=>{
  for(const name of ['万箭齐发','烽火狼烟']){
    const {g,p,a,b}=setup();const hp=[p.hp,a.hp,b.hp];
    await g.resolve_card(a,p,scroll(name));
    assert.deepEqual([p.hp,a.hp,b.hp],[hp[0]-1,hp[1],hp[2]-1]);
    await g.resolve_card(p,a,scroll(name));
    assert.deepEqual([p.hp,a.hp,b.hp],[hp[0]-1,hp[1]-1,hp[2]-2]);
  }
});

test('宋江疏财 sends spare cards to the teammate and heals its owner',async()=>{
  const {g,p,a,b}=setup();a.hero=yxs('宋江');a.hp=3;a.hand=[card(),card()];
  assert.equal(await ai_try_active_skill(g,a,p),true);
  assert.equal(a.hp,4);assert.equal(a.hand.length,0);assert.equal(b.hand.length,2);assert.equal(p.hand.length,0);
});

test('商鞅变法 chooses good allied judgments and bad enemy judgments',async()=>{
  for(const allied of [true,false]){
    const {g,p,a,b}=setup();a.hero=yxs('商鞅');const judged=allied?b:p;
    a.hand=[card(T.SHAN,allied?S.HEART:S.SPADE)];
    g.deck.draw_pile=[card(T.SHAN,allied?S.SPADE:S.HEART)];
    const result=await g.reveal_judgment(judged,'测试判定',{favorable:c=>c.suit===S.HEART});
    assert.equal(result.suit,allied?S.HEART:S.SPADE);assert.equal(a.hand.length,0);g.finish_processing_card(result);
  }
});

test('关羽补刀 declines an ally and spends a kill card against the player',async()=>{
  const {g,p,a,b}=setup();a.hero=yxs('关羽');a.hand=[card(T.SHA)];g.turn_actor='p3';
  await g.trigger_after_sha_damage({target:b,source:p,damage:1,kind:'sha'});assert.equal(a.hand.length,1);
  await g.trigger_after_sha_damage({target:p,source:b,damage:1,kind:'sha'});assert.equal(a.hand.length,0);assert.equal(p.hp,3);
});

test('虞姬 chooses draw rather than retaliating against a low-HP teammate',async()=>{
  const {g,a,b}=setup('虞姬');b.hp=1;
  await g.apply_damage(a,1,{source:b,kind:'chain',nature:'fire',chain_transfer:true});
  assert.equal(b.hp,1);assert.equal(b.alive,true);assert.equal(a.hand.length,2);
});

test('夏侯惇 AI declines ally retaliation without spending a judgment, but still retaliates against enemies',async()=>{
  const {g,p,a,b}=setup('夏侯惇');const judgment=card(T.SHAN,S.SPADE);g.deck.draw_pile=[judgment];
  await g.apply_damage(a,1,{source:b,kind:'chain',nature:'fire',chain_transfer:true});
  assert.equal(b.hp,4);assert.deepEqual(g.deck.draw_pile,[judgment]);
  await g.apply_damage(a,1,{source:p,kind:'skill'});assert.equal(p.hp,3);assert.equal(g.deck.draw_pile.length,0);
});

test('human-controlled 夏侯惇 can still elect to retaliate against a teammate',async()=>{
  const {g,a,b}=setup('夏侯惇','姜维',['y']);a.is_ai=false;g.deck.draw_pile=[card(T.SHAN,S.SPADE)];
  await g.apply_damage(a,1,{source:b,kind:'skill'});assert.equal(b.hp,3);
});

test('借刀 AI chooses an armed teammate to attack the player, not the reverse',async()=>{
  const {g,p,a,b}=setup();p.weapon=card(T.WEAPON,S.SPADE,'玩家武器');b.weapon=card(T.WEAPON,S.SPADE,'队友武器');
  const trick=scroll('借刀杀人');a.hand=[trick];b.hand=[card(T.SHA)];
  assert.deepEqual(ai_borrowed_weapon_plan(g,a),{target:b,forced_target:p});
  assert.equal(ai_choose_card(g,a,p),0);
  const options=await g.prepare_card_use(a,trick,p);assert.deepEqual(options,{target:b,forced_target:p});
  a.hand=[];await g.resolve_card(a,options.target,trick,options);
  assert.equal(p.hp,3);assert.equal(a.hp,4);assert.equal(b.hp,4);assert.ok(b.weapon);
});

test('借刀 skips an unsafe or out-of-range plan and continues ordinary AI attacks',async()=>{
  const {g,p,a,b}=setup();p.weapon=card(T.WEAPON);const trick=scroll('借刀杀人');a.hand=[trick,card(T.SHA)];
  assert.equal(ai_borrowed_weapon_plan(g,a),null);assert.equal(ai_choose_card(g,a,p),1);
  await g.ai_play(a,p);assert.equal(p.hp,3);assert.deepEqual(a.hand,[trick]);
  b.weapon=card(T.WEAPON);p.defensive_horse=new Card('远距马',T.DEFENSIVE_HORSE,{power:3});
  assert.equal(ai_borrowed_weapon_plan(g,a),null);
  p.defensive_horse=null;p.hero=yxs('刘伯温');p.hand=[];
  assert.equal(ai_borrowed_weapon_plan(g,a),null,'empty-hand immunity excludes the forced victim');
});

test('借刀 pairing does not read a teammate hidden card identity',()=>{
  const {g,p,a,b}=setup();b.weapon=card(T.WEAPON);const hidden={};
  Object.defineProperty(hidden,'type',{get(){throw Error('read hidden teammate card');}});b.hand=[hidden];
  assert.deepEqual(ai_borrowed_weapon_plan(g,a),{target:b,forced_target:p});
});

test('无懈 AI recognizes cooperative borrowed attacks rather than cancelling its teammate',async()=>{
  const {g,p,a,b}=setup();a.hand=[scroll('无懈可击')];b.hand=[scroll('无懈可击')];
  const options={forced_target:p};
  assert.equal(await g.nullification_window(a,b,scroll('借刀杀人'),options),false);
  assert.equal(a.hand.length,1);assert.equal(b.hand.length,1);
  a.hand=[];b.hand=[];p.hand=[scroll('无懈可击')];
  assert.equal(await g.nullification_window(a,b,scroll('借刀杀人'),options),true);
  assert.equal(p.hand.length,0);
});

test('铁索 AI unchains both allies first, then can unchain one ally and chain the player',async()=>{
  const {g,p,a,b}=setup();const trick=scroll('铁索连环');a.chained=b.chained=true;
  let options=await g.prepare_card_use(a,trick,p);assert.deepEqual(options.targets,[a,b]);
  await g.resolve_scroll(a,options.target,trick,options);assert.equal(a.chained,false);assert.equal(b.chained,false);assert.equal(p.chained,false);
  b.chained=true;options=await g.prepare_card_use(a,trick,p);assert.deepEqual(options.targets,[b,p]);
  await g.resolve_scroll(a,options.target,trick,options);assert.equal(b.chained,false);assert.equal(p.chained,true);
  options=await g.prepare_card_use(a,trick,p);assert.equal(options.recast,true);
});

test('forced last-hand multi-target weapon AI never appends its teammate',async()=>{
  const {g,p,a,b}=setup();a.weapon=new Card('狼牙棒',T.WEAPON,{range:4,trait:'last_hand_targets'});
  await g.use_sha(a,p,'借刀杀人',{source_card:card(T.SHA),forced:true,source_last_hand:true});
  assert.equal(p.hp,3);assert.equal(b.hp,4);
});
