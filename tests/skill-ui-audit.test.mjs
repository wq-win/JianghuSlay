/** Independent rules/UI audit. DOM checks cover behavior and semantics, not layout. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Game } from '../web/local/game.js';
import { Card, CardType as T, CardSuit as S, CardColor as C, Player, CLASSIC_HEROES as HEROES } from '../web/local/models.js';
import { active_skills_for_hero } from '../web/local/skills.js';
import { active_skill_availability } from '../web/local/skill-availability.js';
import { serialize_match_state } from '../web/local/state.js';
import { skillsForHero } from '../web/public/skill-catalog.js';
import { skillAvailability } from '../web/public/skill-ui.js';

const card = (type = T.SHA, options = {}) => new Card(options.name || type, type, options);
const red = (type = T.TAO) => card(type, { suit: S.HEART, color: C.RED });
const hero = name => HEROES.find(h => h.name === name);
const text = skill => [skill.summary, skill.timing, skill.cost, skill.limit, skill.effect, ...skill.notes].join('\n');
function fixture(name, enemy = '杨延昭', { choices = [], confirms = [], third = null } = {}) {
  const prompts = [], logs = [], answers = [...choices], decisions = [...confirms];
  const g = new Game({
    emit: message => logs.push(message),
    ask_line: async (message, options) => {
      prompts.push({ message, ...options });
      assert.ok(answers.length, `Unexpected input request: ${message}`);
      return answers.shift();
    },
    ask_confirm: async (message, options) => {
      prompts.push({ kind: 'confirm', message, ...options });
      assert.ok(decisions.length, `Unexpected confirmation: ${message}`);
      return decisions.shift();
    },
  }, { seed: 2407 });
  const a = new Player('自己', hero(name));
  const b = new Player('对手甲', hero(enemy));
  const c = third ? new Player('对手乙', hero(third)) : null;
  Object.assign(g, { player: a, ai: b, ai2: c, p1: a, p2: b, p3: c, mode: c ? '1v2' : '1v1', turn_actor: 'p1', turn_phase: 'play' });
  a.hand = [card()]; b.hand = [card()]; if (c) c.hand = [card()];
  const active = active_skills_for_hero(hero(name))[0];
  return {
    g, a, b, c, prompts, logs,
    status: () => active_skill_availability(g, a, active.skill_id),
    run: args => active.player(g, a, b, args),
    dto: () => ({ ...serialize_match_state(g), turn_actor: g.turn_actor, turn_phase: g.turn_phase }),
  };
}

// Empty hand does not remove legal HP/equipment actions acquired by 易装.
test('empty-hand play remains open for legal 霸王 and equipped 诗仙, while legacy full-swap still auto-ends', async () => {
  for (const name of ['李白', '项羽']) {
    const f = fixture(name, '杨延昭', {choices:['0']});
    f.a.hand=[];f.a.weapon=card(T.WEAPON,{range:3});
    await f.g.player_play(f.a,f.b);
    assert.equal(f.prompts.length,1);assert.equal(f.prompts[0].kind,'play_card');
    assert.equal(f.status().available,true);
  }
  const f=fixture('褒姒');f.a.hand=[];
  await f.g.player_play(f.a,f.b);assert.deepEqual(f.prompts,[]);
  assert.match(f.logs.at(-1),/出牌阶段结束/);
  const dto=f.dto();assert.equal(skillAvailability(dto.active_skills[0],dto,null).available,false);
  assert.match(text(skillsForHero(hero('褒姒')).find(s=>s.type==='active')),/无手牌.*自动结束出牌阶段/);
});

test('1-HP 霸王 can rescue using the newly drawn card rather than requiring a pre-held 桃', async () => {
  const f = fixture('项羽', '杨延昭', { choices: ['1'] });
  f.a.hp = 1; f.a.hand = [card(T.SHAN)];
  const newRescue = card(T.WINE);
  f.g.deck.draw_pile = [newRescue]; f.g.deck.discard_pile = [];
  f.a.armor = card(T.ARMOR, { power: 3 });
  assert.equal(f.status().available, true);
  await f.run([]);
  assert.equal(f.a.hp, 1, 'direct HP cost ignores armor, new wine then rescues');
  assert.equal(f.a.bawang_stacks, 1);
  assert.equal(f.prompts[0].kind, 'rescue');
  assert.match(f.prompts[0].options[0].label, /酒/);
  assert.deepEqual(f.a.hand.map(c => c.type), [T.SHAN]);
  assert.equal(f.g.deck.discard_pile.at(-1), newRescue);
});

test('already-active 诗仙 keeps the empty-hand phase open only with usable equipment', async () => {
  const f = fixture('李白', '杨延昭', { choices: ['0'] });
  f.a.hand = []; f.a.shixian_active = true;
  f.a.weapon = card(T.WEAPON, { range: 3 });
  await f.g.player_play(f.a, f.b);
  assert.equal(f.prompts.length, 1);
  assert.equal(f.prompts[0].kind, 'play_card');
  f.a.prison_no_sha = true;
  await f.g.player_play(f.a, f.b);
  assert.equal(f.prompts.length, 1, 'prison leaves no usable equipment attack');
});

test('舍身, 离间 and 武穆 demand an effect choice rather than optional confirmation', async () => {
  const cases = [
    ['虞姬', 'sheshen', async f => { await f.g.apply_damage(f.a, 1, { source: f.b }); }],
    ['貂蝉', 'lijian', async f => { f.b.hand.push(card()); assert.equal(await f.g.draw_count_for_turn(f.a, f.b), 2); }],
    ['岳飞', 'wumu-damaged', async f => { await f.g.apply_damage(f.a, 1, { source: f.b }); }],
  ];
  for (const [name, id, trigger] of cases) {
    const f = fixture(name, '杨延昭', { choices: ['0', '1'] });
    assert.equal(skillsForHero(HEROES.find(h=>h.name===name)).find(s => s.id === id).type, 'choice');
    await trigger(f);
    assert.equal(f.prompts.length, 2, `${name}: invalid cancel must re-prompt`);
    for (const prompt of f.prompts) {
      assert.equal(prompt.kind, 'choice');
      assert.equal(prompt.options.length, 2);
      assert.ok(prompt.options.every(option => !/取消|放弃|不发动/.test(String(option))));
    }
  }
});

test('受伤选择 does not trigger for prevented or lethal damage, including subsequent rescue', async () => {
  for (const name of ['虞姬', '岳飞']) {
    const prevented = fixture(name);
    prevented.a.armor = card(T.ARMOR, { power: 1 });
    await prevented.g.apply_damage(prevented.a, 1, { source: prevented.b });
    assert.equal(prevented.prompts.length, 0);
    assert.equal(prevented.a.hp, prevented.a.hero.max_hp);
    const lethal = fixture(name, '杨延昭', { choices: ['1'] });
    lethal.a.hp = 1; lethal.a.hand = [red()];
    await lethal.g.apply_damage(lethal.a, 1, { source: lethal.b });
    assert.deepEqual(lethal.prompts.map(p => p.kind), ['rescue']);
    assert.equal(lethal.a.hp, 1);
    assert.equal(lethal.a.hand.length, 0, 'no deferred injured skill after rescue');
  }
});

test('舍身 handles no source automatically and retaliation uses normal armor reduction', async () => {
  const auto = fixture('虞姬');
  await auto.g.apply_damage(auto.a, 1);
  assert.equal(auto.a.hand.length, 3); assert.deepEqual(auto.prompts, []);
  const retaliation = fixture('虞姬', '杨延昭', { choices: ['2'] });
  retaliation.b.armor = card(T.ARMOR, { power: 1 });
  await retaliation.g.apply_damage(retaliation.a, 1, { source: retaliation.b });
  assert.equal(retaliation.b.hp, retaliation.b.hero.max_hp, 'retaliation is damage, not direct HP loss');
  assert.equal(retaliation.a.hand.length, 1);
});

test('武穆 with an empty source still offers required choice and draw-then-discard can draw', async () => {
  const f = fixture('岳飞', '杨延昭', { choices: ['2'] });
  f.b.hand = [];
  await f.g.apply_damage(f.a, 1, { source: f.b });
  assert.equal(f.prompts[0].kind, 'choice');
  assert.equal(f.a.hand.length, 2);
  const noSource = fixture('岳飞');
  await noSource.g.apply_damage(noSource.a, 1);
  assert.deepEqual(noSource.prompts, []); assert.equal(noSource.a.hand.length, 1);
});

test('鸩杀 is genuinely optional, uses a real 桃 and precedes the dying character rescue', async () => {
  const f = fixture('扁鹊', '项羽', { confirms: [false, true] });
  f.a.hand = [red()]; f.b.hp = 0; f.b.hand = [card(T.WINE)];
  assert.equal(skillsForHero(hero('扁鹊')).find(s => s.id === 'zhensha').type, 'optional');
  assert.equal(await f.g.trigger_opponent_dying_skills(f.b), false);
  assert.equal(f.a.hand.length, 1);
  await f.g.resolve_dying(f.b, f.a);
  assert.deepEqual(f.prompts.map(p => p.kind), ['confirm', 'confirm']);
  assert.equal(f.a.hand.length, 0); assert.equal(f.b.hp, 0); assert.equal(f.b.hand.length, 0); assert.equal(f.b.dead,true);
  f.a.hand = [red(T.SHA)];
  assert.equal(await f.g.trigger_opponent_dying_skills(f.b), false);
  assert.equal(f.prompts.length, 2, 'red cards are not a lethal 桃 for 扁鹊');
});

test('鸩杀 scans any other living 扁鹊, including the dying AI ally', async () => {
  const f = fixture('杨延昭', '项羽', { third: '扁鹊', confirms: [true] });
  f.c.hand = [red()]; f.b.hp = 0; f.b.hand = [red()];
  await f.g.resolve_dying(f.b);
  assert.equal(f.prompts[0].player_id, 'p3');
  assert.equal(f.b.hp, 0); assert.equal(f.b.hand.length, 0); assert.equal(f.c.hand.length, 0); assert.equal(f.b.dead,true);
});

test('女帝 distinguishes real normal-play red 闪 rejection from valid red-card self-rescue', async () => {
  const f = fixture('武则天', '杨延昭', { choices: ['1'] });
  f.a.hp = 2; const shan = red(T.SHAN); f.a.hand = [shan];
  assert.equal(f.g.can_play(f.a, f.b, shan), false);
  assert.deepEqual(f.g.find_rescue_card_indexes(f.a), [0]);
  f.a.hp = 0; await f.g.resolve_dying(f.a);
  assert.equal(f.a.hp, 1); assert.equal(f.a.hand.length, 0);
  assert.equal(f.prompts[0].kind, 'rescue');
  const rule = text(skillsForHero(hero('武则天')).find(s => s.id === 'nudi-heal'));
  assert.match(rule, /红色闪不能直接点击当桃/); assert.match(rule, /濒死自救时红闪可用/);
});

test('武穆 swaps only responses, prefers the native response type, and creates no variant hit effects', async () => {
  const f = fixture('岳飞', '杨延昭', { confirms: [true, true, false] });
  const swap = card(T.SHAN), native = card(T.POISON_SHA);
  f.a.hand = [swap, native];
  assert.equal(f.g.can_play(f.a, f.b, swap), false);
  assert.equal(f.g.find_response_card(f.a, T.SHA), 1);
  assert.equal(await f.g.play_required_card(f.a, T.SHA, '杀'), true);
  assert.deepEqual(f.a.hand, [swap]);
  f.a.hand = [card(T.BLOOD_SHA)]; f.a.hp = 2;
  assert.equal(await f.g.play_required_card(f.a, T.SHAN, '闪'), true);
  assert.equal(f.a.hp, 2); assert.equal(f.b.poison_mark_pending, false);
  f.a.hand = [card(T.POISON_SHA)];
  assert.equal(await f.g.play_required_card(f.a, T.SHAN, '闪'), false);
  assert.equal(f.a.hand.length, 1); assert.equal(f.a.sha_count_this_turn, 0);
  assert.deepEqual(active_skills_for_hero(HEROES.find(h=>h.name==='岳飞')), []);
  assert.equal(skillsForHero(HEROES.find(h=>h.name==='岳飞')).find(s => s.id === 'wumu-response').type, 'response');
});

test('draw-stage skills obey actual base counts and poison skip before any mandatory effect', async () => {
  for (const [name, hp, handCount, expected] of [
    ['秦始皇', 4, 1, 4], ['程咬金', 2, 1, 4], ['姜维', 4, 0, 4], ['姜维', 4, 1, 2],
  ]) {
    const f = fixture(name); f.a.hp = hp; f.a.hand = Array.from({ length: handCount }, () => card());
    assert.equal(await f.g.draw_count_for_turn(f.a, f.b), expected);
    f.a.block_turn_draw = true;
    assert.equal(await f.g.draw_count_for_turn(f.a, f.b), 0);
    assert.equal(f.prompts.length, 0);
  }
  const f = fixture('貂蝉'); f.b.hand.push(card()); f.a.block_turn_draw = true;
  assert.equal(await f.g.draw_count_for_turn(f.a, f.b), 0);
  assert.equal(f.prompts.length, 0, 'poison suppresses 离间 choice as well as normal draw');
});

test('集权 end discard is compulsory, separate from current-HP hand limit, and never spends equipment', async () => {
  const f = fixture('秦始皇', '杨延昭', { choices: ['0', '1', 'hand:1 hand:2'] });
  f.a.hp = 1; f.a.hand = [card(), card(), card(), card()];
  const armor = card(T.ARMOR, { power: 1 }); f.a.armor = armor;
  await f.g.trigger_on_turn_end(f.a, f.b);
  assert.equal(f.a.hand.length, 3);
  assert.equal(f.prompts.length, 2, 'invalid cancel must re-prompt');
  await f.g.discard_down_to_hp(f.a);
  assert.equal(f.a.hand.length, 1); assert.equal(f.a.armor, armor);
  assert.equal(f.prompts[2].kind, 'select_hand');
  assert.equal(f.prompts[2].meta.stage, 'mandatory_discard_batch');
  assert.equal(f.prompts[2].min_count, 2); assert.equal(f.prompts[2].max_count, 2);
  f.a.hand = []; await f.g.trigger_on_turn_end(f.a, f.b);
  assert.equal(f.prompts.length, 3, 'empty hand needs no additional compulsory discard');
});

test('花木兰 mandatory red-judgment theft happens after defender dodge draw', async () => {
  const f = fixture('花木兰', '花木兰', { confirms: [true] });
  const defenderDraw = card(T.WINE), judgment = red(T.SHA);
  f.a.hand = [card()]; f.b.hand = [card(T.SHAN)];
  f.g.deck.draw_pile = [judgment, defenderDraw]; f.g.deck.discard_pile = [];
  await f.g.resolve_attack(f.a, f.b, 1);
  assert.equal(f.prompts.length, 1, 'only original dodge is optional; theft requires no confirmation');
  assert.deepEqual(f.b.hand, []);
  assert.equal(f.a.hand.at(-1), defenderDraw);
  assert.equal(f.g.deck.discard_pile.at(-1), judgment);
  assert.equal(skillsForHero('jianghu.classic.hero.hua-mu-lan').find(s => s.id === 'yizhuang-take').type, 'locked');
});

test('荆轲 strict thresholds and successful double dodge trigger 易装 once', async () => {
  const f = fixture('荆轲', '花木兰', { confirms: [true] });
  f.a.hp = 1; f.a.hand = Array.from({ length: 4 }, () => card());
  f.b.hand = [card(T.SHAN), card(T.SHAN)];
  assert.equal(f.g.is_sha_unavoidable(f.a, f.b), false, 'equal HP and attacker hand is not unavoidable');
  await f.g.resolve_attack(f.a, f.b, 1);
  assert.equal(f.b.hand.length, 1, 'two consumed 闪 yield one draw for the successful response');
  assert.equal(f.b.hp, 4); assert.equal(f.prompts.length, 1);
  const short = fixture('荆轲', '花木兰');
  short.a.hp = 1; short.a.hand = Array.from({ length: 4 }, () => card());
  short.b.hand = [card(T.SHAN), card()];
  await short.g.resolve_attack(short.a, short.b, 1);
  assert.equal(short.b.hand.length, 2, 'insufficient double dodge consumes no 闪');
  assert.equal(short.b.hp, 3); assert.equal(short.prompts.length, 0);
});

const domBundle = await build({
  absWorkingDir: new URL('../', import.meta.url).pathname,
  stdin: { contents: `
    import React from 'react';
    import {createRoot} from 'react-dom/client';
    import {SkillCard, ActiveSkillButton, HeroSkills} from './web/public/skill-ui.js';
    import {skillsForHero} from './web/public/skill-catalog.js';
    const root=createRoot(document.getElementById('root'));
    window.renderAudit=(available=true)=>root.render(React.createElement(React.Fragment,null,
      React.createElement(SkillCard,{skill:skillsForHero({id:'jianghu.classic.hero.yu-ji',name:'虞姬',display_name:'绛璃'})[0]}),
      React.createElement(HeroSkills,{hero:{id:'jianghu.classic.hero.yue-fei',name:'岳飞'},compact:true}),
      React.createElement(ActiveSkillButton,{skill:{id:'霸王',label:'霸王',hotkey:'q'},availability:{status:available?'ready':'waiting',available,reason:available?'先摸牌再濒死':'请先完成当前响应'},onActivate:()=>window.activations++})
    ));
    window.activations=0;window.renderAudit();`, resolveDir: new URL('../', import.meta.url).pathname },
  bundle: true, write: false, format: 'iife', define: { 'process.env.NODE_ENV': '"production"' },
});
const settle = () => new Promise(resolve => setTimeout(resolve, 15));
test('skill inspector opens by click, exposes full rules, Esc closes and returns focus; disabled controls explain why', async () => {
  const errors = [], virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://audit.example/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole });
  try {
    dom.window.eval(domBundle.outputFiles[0].text); await settle();
    const doc = dom.window.document, details = doc.querySelector('[data-skill-id="sheshen"]'), summary = details.querySelector('summary');
    assert.equal(details.open, false); summary.click(); assert.equal(details.open, true);
    assert.match(details.textContent, /时机.*代价.*次数.*效果/s);
    assert.match(summary.getAttribute('aria-label'), /触发·需选择/);
    const icon = summary.querySelector('svg'); assert.equal(icon.getAttribute('aria-hidden'), 'true');
    details.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(details.open, false); assert.equal(doc.activeElement, summary);
    const compact = doc.querySelector('.opponent-skill-inspector');
    compact.querySelector('summary').click(); assert.equal(compact.open, true);
    assert.equal(compact.querySelectorAll('.hero-skill-card').length, 2);
    const button = doc.querySelector('.active-skill-control button'); button.click();
    assert.equal(dom.window.activations, 1);
    dom.window.renderAudit(false); await settle();
    assert.equal(button.disabled, true); button.click(); assert.equal(dom.window.activations, 1);
    assert.match(doc.getElementById(button.getAttribute('aria-describedby')).textContent, /等待结算.*请先完成当前响应/s);
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});
