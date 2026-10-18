// Targeted independent UI subcases reset both Slash counters; this fixture reset is not a real phase transition.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Game } from '../web/local/game.js';
import { Card, CardType as T, CardColor as C, CardSuit as S, CLASSIC_HEROES as HEROES, Player } from '../web/local/models.js';
import { active_skills_for_hero, HERO_SKILL_HOOKS, skill_hooks_for_hero } from '../web/local/skills.js';
import { active_skill_availability } from '../web/local/skill-availability.js';
import { serialize_match_state } from '../web/local/state.js';
import { HERO_SKILLS, SKILL_TYPES, activeSkillMetadata } from '../web/public/skill-catalog.js';
import { SKILL_ICONS, SkillIcon, SkillCard, skillAvailability } from '../web/public/skill-ui.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const card = (type = T.SHA, options = {}) => new Card(type, type, options);
const red = (type = T.TAO) => card(type, { color: C.RED, suit: S.HEART });
const club = () => card(T.SHA, { suit: S.CLUB, color: C.BLACK });
function setup(name, targetName = '杨延昭', { third = false } = {}) {
  const logs = [], prompts = [];
  const g = new Game({ emit: text => logs.push(text), ask_line: async (message, options) => { prompts.push({ message, ...options }); return '1'; }, ask_confirm: async (message, options) => { prompts.push({ kind: 'confirm', message, ...options }); return false; } }, { seed: 772 });
  const a = new Player('你', HEROES.find(h => h.name === name));
  const b = new Player('对手甲', HEROES.find(h => h.name === targetName), true);
  const c = third ? new Player('对手乙', HEROES.find(h => h.name === '姜维'), true) : null;
  Object.assign(g, { player: a, ai: b, ai2: c, p1: a, p2: b, p3: c, mode: third ? '1v2' : '1v1', turn_actor: 'p1', turn_phase: 'play' });
  a.hand = [card(), card(T.SHAN), red()]; b.hand = [card()]; if (c) c.hand = [card()];
  const active = active_skills_for_hero(HEROES.find(h=>h.name===name))[0];
  return { g, a, b, c, logs, prompts, active, status: () => active_skill_availability(g, a, active.skill_id), run: args => active.player(g, a, b, args) };
}

// Independent expected manifest: missing a sub-effect or changing mandatory into
// optional must fail even if both the catalog and renderer remain internally valid.
const EXPECTED = {
  秦始皇: ['jiquan-draw:locked', 'jiquan-discard:locked'],
  项羽: ['bawang:active', 'bawang-damage:locked'],
  虞姬: ['sheshen:choice'], 李白: ['shixian:active'],
  武则天: ['nudi-mark:active', 'nudi-heal:conversion'], 刘邦: ['yuren:active'],
  赵匡胤: ['shiquan:active', 'shiquan-draw:locked'], 杨延昭: ['tianlang:locked'],
  扁鹊: ['huichun:locked', 'zhensha:optional'], 荆轲: ['cike-hit:locked', 'cike-double:locked'],
  韩信: ['bingxian:active', 'kongcheng:locked'], 程咬金: ['sanbanfu:locked'],
  花木兰: ['yizhuang-dodge:locked', 'yizhuang-take:locked'], 貂蝉: ['lijian:choice'],
  岳飞: ['wumu-damaged:choice', 'wumu-response:response'], 杨再兴: ['chongzhen:active'],
  姜维: ['liangyuan:locked'], 褒姒: ['huanpai:active'],
  时迁: ['feizei:active', 'feizei-range:locked', 'feizei-immune:locked'],
};

test('all 19 heroes have all 30 correctly typed effects, complete rules, and original local icons', () => {
  assert.deepEqual(Object.keys(HERO_SKILLS).filter(name=>HEROES.some(h=>h.name===name)), HEROES.map(h => h.name));
  const entries = HEROES.flatMap(h=>HERO_SKILLS[h.name]);
  assert.equal(entries.length, 30);
  assert.equal(new Set(entries.map(s => s.id)).size, 30);
  assert.equal(new Set(entries.map(s => SKILL_ICONS[s.icon])).size, 30);
  for (const hero of HEROES) {
    assert.deepEqual(HERO_SKILLS[hero.name].map(s => `${s.id}:${s.type}`), EXPECTED[hero.name], hero.name);
    const actualActives = active_skills_for_hero(hero).map(s => s.skill_id);
    assert.deepEqual(HERO_SKILLS[hero.name].filter(s => s.activeId).map(s => hero.id==='jianghu.classic.hero.shi-qian'?'神偷':s.activeId), actualActives, hero.name);
    for (const s of HERO_SKILLS[hero.name]) {
      for (const field of ['name', 'summary', 'timing', 'cost', 'limit', 'effect']) assert.ok(s[field]?.length >= 1, `${s.id}.${field}`);
      assert.ok(SKILL_TYPES[s.type]); assert.ok(SKILL_ICONS[s.icon]); assert.ok(s.notes.length);
      const markup = renderToStaticMarkup(createElement(SkillCard, { skill: s }));
      const doc = new JSDOM(markup).window.document;
      assert.equal(doc.querySelectorAll('details > summary').length, 1);
      assert.equal(doc.querySelectorAll('dl dt').length, 4);
      assert.ok(doc.querySelector('summary').getAttribute('aria-label').includes(SKILL_TYPES[s.type].label));
      assert.ok(doc.querySelector('[data-skill-icon]'));
      assert.doesNotMatch(markup, /<script|<image|href=|https?:\/\/|\bonload=/i);
    }
  }
  assert.equal(entries.filter(s => s.type === 'active').length, 9);
  assert.equal(entries.filter(s => s.type === 'optional').length, 1);
  assert.ok(skill_hooks_for_hero(HEROES.find(h=>h.name==='扁鹊')).on_opponent_dying.length);
  assert.match(HERO_SKILLS['武则天'][1].notes.join(''), /红色闪不能直接点击当桃.*濒死自救时红闪可用/);
  assert.match(HERO_SKILLS['岳飞'][1].notes.join(''), /不能凭此主动把闪当杀/);
});

test('all 9 availability projections are read-only, public-only and match actual ready callbacks', async () => {
  const args = { 李白: [], 武则天: ['3'], 项羽: [], 刘邦: ['1'], 赵匡胤: ['1'], 杨再兴: ['2'], 褒姒: ['all'], 韩信: ['1', '2', '3'], 时迁: ['1'] };
  for (const [name, values] of Object.entries(args)) {
    const f = setup(name);
    if (name === '时迁') f.a.hand[0] = club();
    const before = JSON.stringify({ a: f.a, b: f.b, deck: f.g.deck, rng: f.g.rng.state });
    const projection = f.status();
    assert.equal(projection.available, true, name);
    assert.equal(JSON.stringify({ a: f.a, b: f.b, deck: f.g.deck, rng: f.g.rng.state }), before, `${name} projection mutated rules`);
    assert.deepEqual(f.logs, []); assert.deepEqual(f.prompts, []);
    assert.equal(await f.run(values), true, `${name} ready callback rejected`);
    assert.notEqual(JSON.stringify({ a: f.a, b: f.b, deck: f.g.deck, rng: f.g.rng.state }), before, `${name} callback had no effect`);
    assert.ok(f.logs.length);
    assert.ok(projection.targets.every(t => !('hand' in t) && !('cards' in t)), 'target projection contains no hidden cards');
  }
});

test('诗仙 remains legal with no cards, spent attacks or prison; only reactivation is disabled', async () => {
  const f = setup('李白'); f.a.hand = []; f.a.sha_count_this_turn = 3; f.a.prison_no_sha = true;
  assert.equal(f.status().available, true);
  await f.run([]); assert.equal(f.a.shixian_active, true);
  assert.equal(f.status().status, 'used');
  const logCount = f.logs.length; await f.run([]);
  assert.equal(f.logs.length, logCount + 1); assert.match(f.logs.at(-1), /已发动/);
});

test('霸王 at 1 HP is available, draws before real rescue prompt, and can repeat after rescue', async () => {
  const f = setup('项羽'); f.a.hp = 1; f.a.hand = [red()]; f.a.armor = card(T.ARMOR, { power: 2 });
  assert.equal(f.status().available, true); assert.match(f.status().reason, /会濒死/);
  await f.run([]);
  assert.equal(f.a.hp, 1); assert.equal(f.a.bawang_stacks, 1);
  assert.ok(f.prompts.some(p => p.kind === 'rescue'));
  assert.equal(f.status().available, true);
  f.a.hp = 0; assert.equal(f.status().available, false);
});

test('女帝 accepts red 闪 and repeated existing marks; red normal-play and rescue gates stay distinct', async () => {
  const f = setup('武则天'); f.a.hand = [card()]; assert.equal(f.status().status, 'condition');
  f.a.hand = [red(T.SHAN)]; f.b.judgment_mark_pending = true;
  assert.equal(f.status().available, true); assert.match(f.status().targets[0].note, /不叠加/);
  f.a.hp = 3; assert.equal(f.g.can_play(f.a, f.b, f.a.hand[0]), false);
  assert.deepEqual(f.g.find_rescue_card_indexes(f.a), [0]);
  await f.run(['1']); assert.equal(f.a.hand.length, 0); assert.equal(f.b.judgment_mark_pending, true);
  f.a.hand = [red()]; assert.equal(f.status().available, true);
});

test('驭人 requires cards, consumes real once-per-turn usage and resets only with engine state', async () => {
  const f = setup('刘邦'); f.a.hand = []; assert.equal(f.status().status, 'condition');
  f.a.hand = [card(), card(T.SHAN)]; await f.run(['1', '2']);
  assert.equal(f.a.hand.length, 2); assert.equal(f.status().status, 'used');
  const hand = [...f.a.hand]; await f.run(['1']); assert.deepEqual(f.a.hand, hand);
  f.a.used_active_skills.clear(); assert.equal(f.status().available, true);
});

test('释权 allows empty target, still executes 25% bonus, and has no invented usage cap', async () => {
  const f = setup('赵匡胤'); f.a.hand = [red()]; assert.equal(f.status().status, 'condition');
  f.a.hand = [card()]; f.b.hand = []; f.g.rng.random = () => 0;
  assert.equal(f.status().available, true); assert.match(f.status().targets[0].note, /无牌可弃/);
  await f.run(['1']); assert.equal(f.a.hand.length, 1); assert.match(f.logs.join(''), /额外触发/);
  f.a.hand = [card()]; f.a.used_active_skills.add('释权'); assert.equal(f.status().available, true);
});

test('冲阵 reflects actual range, prison and shared Sha limits without rejecting the engine 空城 quirk', async () => {
  const f = setup('杨再兴', '韩信', { third: true }); f.a.hand = [card(T.SHAN)]; f.b.hand = [];
  f.b.defensive_horse = card(T.DEFENSIVE_HORSE, { power: 1 });
  assert.equal(f.status().available, true, 'second target is in range');
  assert.equal(f.status().targets[0].available, false); assert.equal(f.status().targets[1].available, true);
  f.c.hp = 0; assert.equal(f.status().status, 'condition');
  f.b.defensive_horse = null; assert.equal(f.status().available, true); assert.match(f.status().targets[0].note, /空城/);
  await f.run(['1']); assert.equal(f.a.hand.length, 0); assert.equal(f.a.sha_count_this_turn, 0); assert.equal(f.b.hp, 4);
  f.a.hand = [card(T.SHAN)]; f.a.prison_no_sha = true; assert.equal(f.status().status, 'condition');
  f.a.prison_no_sha = false; f.a.sha_count_this_turn = 1; assert.equal(f.status().status, 'used');
  f.a.weapon = card(T.WEAPON, { trait: 'unlimited_sha' }); assert.equal(f.status().available, true);
  f.b.hand = [card()]; await f.run(['1']); assert.equal(f.b.hp, 3); assert.equal(f.a.sha_count_this_turn, 2);
  f.a.hand = []; assert.equal(f.status().status, 'condition');
});

test('换牌 preserves unequal all-swap, empty-self all-swap, partial nested choices and once usage', async () => {
  const f = setup('褒姒'); f.a.hand = []; f.b.hand = []; assert.equal(f.status().status, 'condition');
  f.b.hand = [card(), red()]; assert.equal(f.status().available, true);
  await f.run(['all']); assert.equal(f.a.hand.length, 2); assert.equal(f.b.hand.length, 0); assert.equal(f.status().status, 'used');
  const p = setup('褒姒'); p.a.hand = [red(), card()]; p.b.hand = [card(T.SHAN), card()];
  await p.run(['1']); assert.ok(p.prompts.some(prompt => prompt.kind === 'select_hand' && prompt.max_count === 1));
  assert.equal(p.a.hand.at(-1).type, T.SHAN); assert.equal(p.status().status, 'used');
});

test('兵仙 requires exactly 3 hand cards, deals armor-reduced damage, and can repeat', async () => {
  const f = setup('韩信'); f.a.hand = [card(), card()]; assert.equal(f.status().status, 'condition');
  f.a.hand.push(red()); f.b.armor = card(T.ARMOR, { power: 1 }); assert.equal(f.status().available, true);
  await f.run(['1', '2', '3']); assert.equal(f.a.hand.length, 0); assert.equal(f.b.hp, 4);
  f.a.hand = [card(), card(), card()]; f.a.used_active_skills.add('兵仙'); assert.equal(f.status().available, true);
  f.b.armor = null; await f.run(['1', '2', '3']); assert.equal(f.b.hp, 3);
});

test('飞贼 checks clubs, immunity and public target cards, ignores range, and is repeatable', async () => {
  const f = setup('时迁', '时迁'); f.a.hand = [card()]; assert.equal(f.status().status, 'condition');
  f.a.hand = [club()]; assert.equal(f.status().status, 'condition'); assert.equal(f.g.is_immune_to_shunshou(f.b),true);assert.match(f.status().reason,/没有可被探囊取物选择/);
  f.b.hero = HEROES.find(h => h.name === '姜维'); f.b.hand = []; assert.equal(f.status().status, 'condition');
  f.b.defensive_horse = card(T.DEFENSIVE_HORSE, { power: 9 }); assert.equal(f.status().available, true);
  await f.run(['1']); assert.equal(f.a.hand.at(-1).type, T.DEFENSIVE_HORSE); assert.equal(f.b.defensive_horse, null);
  f.a.hand = [club()]; f.b.hand = [card()]; assert.equal(f.status().available, true);
});

test('availability phase overlays cover all 9 actives, other turns, p3 viewer and nested prompt states', () => {
  for (const hero of HEROES.filter(h => active_skills_for_hero(h).length)) {
    const f = setup(hero.name); if (hero.name === '时迁') f.a.hand[0] = club();
    const dto = { ...serialize_match_state(f.g), turn_actor: 'p1', turn_phase: 'play' };
    const raw = dto.active_skills[0], prompt = { kind: 'play_card', player_id: 'p1' };
    assert.equal(skillAvailability(raw, dto, prompt).available, true, hero.name);
    assert.equal(skillAvailability(raw, { ...dto, turn_actor: 'p2' }, prompt).status, 'not_turn');
    for (const kind of ['confirm', 'choice', 'select_hand', 'rescue', 'discard']) assert.equal(skillAvailability(raw, dto, { ...prompt, kind }).status, 'waiting');
    assert.equal(skillAvailability(raw, dto, prompt, true).available, false);
    assert.equal(skillAvailability(raw, { ...dto, phase: 'finished' }, prompt).status, 'ended');
  }
  const f = setup('姜维', '姜维', { third: true }); f.c.hero = HEROES.find(h => h.name === '项羽');
  const dto = { ...serialize_match_state(f.g, { viewer_seat: 'p3' }), turn_actor: 'p3', turn_phase: 'play' };
  assert.equal(skillAvailability(dto.active_skills[0], dto, { kind: 'play_card', player_id: 'p3' }).available, true);
  assert.equal(skillAvailability(dto.active_skills[0], { ...dto, turn_actor: 'p1' }, { kind: 'play_card', player_id: 'p3' }).status, 'not_turn');
});

const pause = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, label = 'UI transition') { for (let i = 0; i < 350; i++) { if (check()) return; await pause(); } assert.fail(`${label} timed out`); }
const bundle = async fixture => (await build({ absWorkingDir: root, entryPoints: ['web/public/app.js'], bundle: true, write: false, format: 'iife', define: { 'process.env.NODE_ENV': '"production"' }, plugins: [{ name: 'observe-session', setup(b) { b.onResolve({ filter: /^\.\.\/local\/session\.js$/ }, () => ({ path: resolve(root, fixture) })); } }] })).outputFiles[0].text;
const fixtureCode = await bundle('tests/browser-ui.fixture.mjs');
const realCode = await bundle('tests/skill-ui.session.mjs');
function mount(code) {
  const errors = [], vc = new VirtualConsole(); vc.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.test/game/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
  dom.window.fetch = () => { throw Error('unexpected network'); };
  dom.window.eval(code); const doc = dom.window.document;
  const button = label => [...doc.querySelectorAll('button')].find(b => b.textContent.trim() === label);
  const click = label => { const b = button(label); assert.ok(b, label); assert.equal(b.disabled, false, label); b.click(); return b; };
  return { dom, doc, errors, button, click, async start(hero = '秦始皇', mode = 'ai') {
    await until(() => button('开始对局')); doc.querySelector(`[aria-label="选择${hero}"]`).click();
    const modeSelect = doc.getElementById('match-mode'); modeSelect.value = mode; modeSelect.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
    await pause(); click('开始对局'); await until(() => doc.querySelector('.action-dock'));
  } };
}
async function showFixture(app, state, kind = 'play_card', extra = {}) {
  const old = app.doc.querySelector('.action-dock'), oldDialog = app.doc.querySelector('[role="dialog"]');
  const p = app.dom.window.__fixture.show(kind, extra, state);
  await until(() => kind === 'play_card' ? app.doc.querySelector('.action-dock') !== old && app.doc.querySelector('.action-dock') : app.doc.querySelector('[role="dialog"]') !== oldDialog && app.doc.querySelector('[role="dialog"]'), `show ${kind}`);
  return p;
}
function dtoFor(f) { return { ...serialize_match_state(f.g), turn_actor: 'p1', turn_phase: 'play' }; }

test('all 9 rendered active controls expose ready/condition/used/turn reasons without mutating on disabled clicks', async () => {
  const app = mount(fixtureCode);
  try {
    await app.start(); const match = app.dom.window.__fixture;
    for (const hero of HEROES.filter(h => active_skills_for_hero(h).length)) {
      const f = setup(hero.name); if (hero.name === '时迁') f.a.hand[0] = club();
      await showFixture(app, dtoFor(f));
      const label = f.active.button_label;
      let control = app.doc.querySelector(`[data-active-skill="${label}"]`);
      assert.equal(control.dataset.skillState, 'ready', label);
      assert.ok(control.querySelector('svg'));
      assert.equal(control.querySelector('button').disabled, false);
      for (const status of ['condition', 'used']) {
        const dto = dtoFor(f); dto.active_skills[0].availability = { available: false, status, reason: `${label}测试原因` };
        await showFixture(app, dto);
        control = app.doc.querySelector(`[data-active-skill="${label}"]`);
        const b = control.querySelector('button'); assert.equal(b.disabled, true);
        assert.ok(app.doc.getElementById(b.getAttribute('aria-describedby')).textContent.includes(`${label}测试原因`));
        const count = match.responses.length; b.click(); b.click(); await pause(); assert.equal(match.responses.length, count);
        assert.ok(app.button('结束出牌'), 'invalid activation does not remove normal controls');
      }
      await showFixture(app, { ...dtoFor(f), turn_actor: 'p2' }, 'confirm');
      control = app.doc.querySelector(`.self-panel [data-active-skill="${label}"]`);
      assert.equal(control.dataset.skillState, 'not_turn', label); assert.equal(control.querySelector('button').disabled, true);
      assert.match(control.textContent, /非自己回合/);
    }
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('skill details work by click/touch-equivalent and Escape, persist through nested prompts, and never answer prompts', async () => {
  const app = mount(fixtureCode);
  try {
    await app.start('武则天', 'ai2'); const match = app.dom.window.__fixture;
    const f = setup('武则天', '扁鹊', { third: true });
    await showFixture(app, dtoFor(f));
    const details = app.doc.querySelector('[data-skill-id="nudi-heal"]'), summary = details.querySelector('summary');
    const before = match.responses.length;
    summary.click(); assert.equal(details.open, true); assert.match(details.textContent, /红色闪不能直接点击当桃/);
    summary.focus(); assert.equal(app.doc.activeElement, summary);
    details.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(details.open, false); assert.equal(app.doc.activeElement, summary);
    summary.click(); await showFixture(app, dtoFor(f), 'confirm', { message: '是否打出闪响应？' });
    assert.equal(app.doc.querySelector('[data-skill-id="nudi-heal"]').open, true);
    const opponent = app.doc.querySelector('.opponent-panel > .table-inspector'); opponent.querySelector('summary').click();
    const optional = opponent.querySelector('[data-skill-id="zhensha"]'); optional.querySelector('summary').click();
    assert.equal(optional.open, true); assert.match(optional.textContent, /可选触发/);
    optional.dispatchEvent(new app.dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(optional.open, false); assert.equal(opponent.open, true, 'Escape closes nearest detail only');
    assert.equal(match.responses.length, before);
    assert.ok(app.button('确定')); assert.ok(app.button('取消'));
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('cancel, immediate repeated skill clicks, filters, insufficient partial swaps and fresh prompts stay responsive', async () => {
  const app = mount(fixtureCode);
  try {
    await app.start(); const match = app.dom.window.__fixture, f = setup('武则天');
    await showFixture(app, dtoFor(f)); const count = match.responses.length;
    const activate = app.button('女帝'); activate.click(); activate.click();
    await until(() => app.button('确认发动'));
    assert.equal(app.doc.querySelectorAll('.action-dock .sgs-card')[0].disabled, true);
    app.click('取消'); await until(() => !app.button('确认发动')); assert.equal(match.responses.length, count);
    app.click('女帝'); await until(() => app.button('确认发动'));
    app.doc.querySelectorAll('.action-dock .sgs-card')[2].click(); await until(() => !app.button('确认发动').disabled);
    const confirm = app.button('确认发动'); confirm.click(); confirm.click();
    await until(() => match.responses.length > count); assert.equal(match.responses.length, count + 1); assert.equal(match.responses.at(-1).value, 'q 3');
    await until(() => app.button('结束出牌') && !app.doc.querySelector('.prompt-controls').disabled);
    const swap = setup('褒姒'); swap.b.hand = [card()]; await showFixture(app, dtoFor(swap)); app.click('换牌');
    await until(() => app.button('确认发动'));
    const hand = app.doc.querySelectorAll('.action-dock .sgs-card'); hand[0].click(); hand[1].click();
    await until(() => app.doc.querySelector('.dock-tip').textContent.includes('没有对手持有足够手牌'));
    assert.equal(app.button('确认发动').disabled, true); assert.equal(app.button('换全部').disabled, false);
    app.click('取消'); await until(() => !app.button('确认发动')); app.click('换牌');
    await until(() => app.button('确认发动')); assert.equal(app.doc.querySelectorAll('.action-dock .sgs-card.selected').length, 0);
    const count2 = match.responses.length; app.click('换全部'); await until(() => match.responses.length > count2);
    assert.equal(match.responses.at(-1).value, 'q all');
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

async function refreshReal(app, match) {
  // Cards inserted by Node fixtures must use the browser realm's Card class:
  // Deck.discard intentionally distinguishes a Card from an iterable of cards.
  for (const player of match.game.all_players()) player.hand = player.hand.map(app.dom.window.__skillCard);
  match._notify({ type: 'state', state: match._state() });
  await pause();
}
async function nextPrompt(app, match, click, kind) {
  const before = match.pending?.prompt.prompt_id; click();
  try { await until(() => match.pending?.prompt.kind === kind && match.pending.prompt.prompt_id !== before && !app.doc.querySelector('.prompt-controls')?.disabled, `real ${kind}`); } catch (error) { throw new Error(`${error.message}: ${JSON.stringify({ prompt: match.pending?.prompt, events: match.events.slice(-8), hand: match.game.player.hand, hero: match.game.player.hero.name, alert: app.doc.querySelector('[role="alert"]')?.textContent, running: match._running })}`); }
  await pause();
}

test('real 1v2 callbacks: swap activation → target → hidden-card selection → used state; rapid confirm accepted once', async () => {
  const app = mount(realCode);
  try {
    await app.start('绫月', 'ai2'); const match = app.dom.window.__skillMatch;
    const g = match.game; g.player.hand = [red(), card()]; g.ai.hand = [card(T.SHAN)]; g.ai2.hand = [card(T.WINE), card(T.SHAN)];
    await refreshReal(app, match); app.click('换牌'); await until(() => app.button('确认发动'));
    app.doc.querySelector('.action-dock .sgs-card').click(); await until(() => !app.button('确认发动').disabled);
    const actions = match.exportSave().actions.length;
    await nextPrompt(app, match, () => { const b = app.button('确认发动'); b.click(); b.click(); }, 'choice');
    assert.equal(match.exportSave().actions.length, actions + 1);
    assert.equal(app.doc.querySelector('.self-panel [data-active-skill]').dataset.skillState, 'waiting');
    const option = match.pending.prompt.options.find(o => o.id === 'p3');
    await nextPrompt(app, match, () => app.click(option.label), 'select_hand');
    assert.equal(app.doc.querySelectorAll('.sgs-dialog .sgs-card.back').length, 2);
    app.doc.querySelector('[aria-label="未知手牌 2"]').click(); await until(() => !app.button('确认').disabled);
    await nextPrompt(app, match, () => app.click('确认'), 'play_card');
    assert.equal(g.player.hand.at(-1).type, T.SHAN); assert.equal(g.ai2.hand.at(-1).type, T.TAO);
    assert.equal(app.doc.querySelector('.action-dock [data-active-skill]').dataset.skillState, 'used');
    assert.equal(app.button('换牌').disabled, true);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.__skillMatch?.close(); app.dom.window.close(); }
});

test('real optional 鸩杀 can decline, confirm and continue nested rescue in 1v2; mandatory 舍身 remains a choice', async () => {
  const app = mount(realCode);
  try {
    await app.start('青蘅', 'ai2'); const match = app.dom.window.__skillMatch, g = match.game;
    g.player.hand = [card(), red(), card(T.WINE)]; g.ai.hp = 1; g.ai.hero = HEROES.find(h => h.name === '姜维'); g.ai.hand = [red()]; g.ai.armor = null;
    g.ai2.hero = HEROES.find(h => h.name === '姜维'); g.ai2.hand = []; g.player.sha_count_this_turn = 0; g.player.sha_count_this_play_phase = 0;
    await refreshReal(app, match);
    await nextPrompt(app, match, () => app.doc.querySelector('.action-dock .sgs-card').click(), 'choice');
    await nextPrompt(app, match, () => app.click(match.pending.prompt.options.find(o => o.id === 'p2').label), 'confirm');
    assert.match(match.pending.prompt.message, /鸩杀/); assert.ok(app.button('取消'));
    await nextPrompt(app, match, () => app.click('取消'), 'rescue');
    await nextPrompt(app, match, () => app.click(match.pending.prompt.options.find(o=>o.id==='0').label), 'play_card');
    assert.equal(g.ai.hp, 1, 'declined 鸩杀 lets enemy use 桃'); assert.ok(g.player.hand.some(c => c.type === T.TAO));
    g.player.hand = [card(), red(), card(T.WINE)]; g.player.sha_count_this_turn = 0; g.player.sha_count_this_play_phase = 0; g.ai.hand = []; await refreshReal(app, match);
    await nextPrompt(app, match, () => app.doc.querySelector('.action-dock .sgs-card').click(), 'choice');
    await nextPrompt(app, match, () => app.click(match.pending.prompt.options.find(o => o.id === 'p2').label), 'confirm');
    await nextPrompt(app, match, () => app.click('确定'), 'play_card');
    assert.equal(g.ai.alive, false); assert.equal(g.player.hand.some(c => c.type === T.TAO), false);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.__skillMatch?.close(); app.dom.window.close(); }
  const mandatory = mount(realCode);
  try {
    await mandatory.start('绛璃'); const match = mandatory.dom.window.__skillMatch, g = match.game;
    g.player.hand = []; g.player.hp = 3; g.ai.hero = HEROES.find(h => h.name === '韩信'); g.ai.hp = g.ai.hero.max_hp; g.ai.hand = [card(), card(), card()]; g.ai.armor = null;
    // The controlled hero replacement above also resets HP to the new maximum,
    // independent of the randomly selected previous opponent. Production HP
    // validation remains unchanged. Skip AI draw so it deterministically uses 兵仙 and opens the player's true
    // mandatory hook prompt, rather than replacing it with a synthetic dialog.
    g.ai.block_turn_draw = true; await refreshReal(mandatory, match);
    await nextPrompt(mandatory, match, () => mandatory.click('结束出牌'), 'choice');
    assert.match(match.pending.prompt.options.map(o => o.label).join(''), /摸2张牌/);
    assert.equal(mandatory.button('取消'), undefined);
    const opt = match.pending.prompt.options.find(o => o.label === '摸2张牌');
    mandatory.click(opt.label); await until(() => match.pending?.prompt.kind === 'play_card' || match.pending?.prompt.kind === 'discard');
    assert.ok(g.player.hand.length >= 2); assert.deepEqual(mandatory.errors, []);
  } finally { mandatory.dom.window.__skillMatch?.close(); mandatory.dom.window.close(); }
});

test('skill stylesheet is shipped and details stay in normal flow (static assertion, not geometry proof)', async () => {
  const [css, entry, shipped] = await Promise.all(['web/public/skill-ui.css', 'dist/index.html', 'dist/skill-ui.css'].map(path => readFile(resolve(root, path), 'utf8')));
  assert.equal(shipped, css); assert.match(entry, /\.\/skill-ui\.css/);
  assert.match(css, /min-height:\s*44px/); assert.match(css, /focus-visible/);
  assert.match(css, /@media \(max-width: 640px\)/); assert.doesNotMatch(css, /position:\s*(fixed|absolute)/);
});
