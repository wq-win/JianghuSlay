import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import { build } from 'esbuild';
import { HEROES } from '../web/local/models.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const pause = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms));
async function until(predicate, message = 'condition did not become true') {
  for (let i = 0; i < 300; i++) { if (predicate()) return; await pause(); }
  assert.fail(message);
}
function mount(code, saved = null) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'https://example.test/game/jianghu-slay/', runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole,
  });
  dom.window.fetch = () => { throw new Error('A static game must not fetch a backend'); };
  dom.window.WebSocket = class { constructor() { throw new Error('A static game must not open a socket'); } };
  if (saved) dom.window.localStorage.setItem('jh_browser_save_v2', saved);
  dom.window.eval(code);
  const buttons = (label) => [...dom.window.document.querySelectorAll('button')].filter(b => b.textContent.trim() === label);
  const click = (label) => {
    const button = buttons(label)[0];
    assert.ok(button, `button not found: ${label}`);
    assert.equal(button.disabled, false, `button disabled: ${label}`);
    button.click();
    return button;
  };
  const select = (id, value) => {
    const input = dom.window.document.getElementById(id);
    assert.ok(input, `select not found: ${id}`);
    input.value = String(value);
    input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
  };
  return { dom, errors, document: dom.window.document, buttons, click, select };
}

const production = await readFile(resolve(root, 'dist/app.js'), 'utf8');
const fixtureBundle = await build({
  absWorkingDir: root, entryPoints: ['web/public/app.js'], bundle: true, write: false, format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [{ name: 'test-session', setup(build) {
    build.onResolve({ filter: /^\.\.\/local\/session\.js$/ }, () => ({ path: resolve(root, 'tests/browser-ui.fixture.mjs') }));
  } }],
});
const fixture = fixtureBundle.outputFiles[0].text;

test('static build uses nested-path local assets and 19 original portraits and twelve original expansion SVG portraits', async () => {
  const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
  assert.doesNotMatch(html, /(?:src|href)=["']https?:|\/static\/|importmap/);
  assert.match(html, /src="\.\/app.js"/);
  assert.match(html, /href="\.\/styles.css"/);
  const { LocalMatch } = await import('../web/local/session.js');
  const {CLASSIC_HEROES}=await import('../web/local/models.js');
  assert.equal(LocalMatch.heroes().length, HEROES.length);
  for (const hero of CLASSIC_HEROES) assert.ok((await stat(resolve(root, 'dist/portraits', `${hero.name}.jpg`))).size > 0);
  for (const name of ['guanyu','zhangfei','ganning','huanggai','lvmeng','xuchu','xiahoudun','huangyueying','zhaoyun','machao','zhouyu','zhugeliang']) assert.ok((await stat(resolve(root,'dist/portraits-expansion',`${name}.svg`))).size>0);
  const source = await readFile(resolve(root, 'web/public/app.js'), 'utf8');
  assert.doesNotMatch(source, /fetch\(|WebSocket|\/api\/|\/static\/|创建房间|加入房间/);
});

test('production UI retains chosen opponents, resumes, cancels replacement, and restarts with a fresh seed', async () => {
  let app = mount(production);
  try {
    await until(() => app.buttons('开始对局').length);
    assert.equal(app.document.querySelectorAll('.hero-chip').length, HEROES.length);
    assert.equal(app.document.getElementById('ai-hero').options.length, HEROES.length + 1);
    assert.equal(app.document.getElementById('ai-hero').value, 'random');
    assert.equal(app.document.getElementById('ai2-hero'), null);
    app.document.querySelector('[aria-label="选择玄衡"]').click();
    app.select('ai-hero', 0); // Explicit mirror picks are permitted.
    await pause();
    app.click('开始对局');
    await until(() => app.document.querySelector('.action-dock'), '1v1 did not reach a playable prompt');
    assert.equal(app.document.querySelectorAll('.general-seat.opponent').length, 1);
    assert.equal(app.document.querySelector('.general-seat.opponent .portrait-banner').textContent, '玄衡');
    const oldCards = [...app.document.querySelectorAll('.action-dock .sgs-card')].map(e => e.getAttribute('aria-label'));
    const oldSave = app.dom.window.localStorage.getItem('jh_browser_save_v2');
    assert.ok(JSON.parse(oldSave).checkpoint);
    assert.equal(JSON.parse(oldSave).config.ai_hero_index, 0);
    app.click('更换英雄/模式');
    await until(() => app.buttons('继续上局').length);
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), oldSave, 'returning to configuration must not write or delete the save');
    app.select('match-mode', 'ai2');
    await pause();
    app.select('ai2-hero', 3);
    await pause();
    app.click('开始对局');
    await until(() => app.buttons('取消').length);
    assert.match(app.document.querySelector('.config-summary').textContent, /人机 2：指定 李白/);
    app.click('取消');
    await pause();
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), oldSave);
    assert.equal(app.document.getElementById('ai2-hero').value, '3', 'cancel keeps the configuration draft');
    app.click('继续上局');
    await until(() => app.document.querySelector('.action-dock'));
    assert.deepEqual([...app.document.querySelectorAll('.action-dock .sgs-card')].map(e => e.getAttribute('aria-label')), oldCards);
    const saved = app.dom.window.localStorage.getItem('jh_browser_save_v2');
    app.dom.window.close();
    app = mount(production, saved);
    await until(() => app.buttons('继续上局').length);
    assert.equal(app.document.getElementById('match-mode').value, 'ai');
    assert.equal(app.document.getElementById('ai-hero').value, '0', 'refresh hydrates the saved opponent policy');
    app.click('继续上局');
    await until(() => app.document.querySelector('.action-dock'));
    assert.deepEqual([...app.document.querySelectorAll('.action-dock .sgs-card')].map(e => e.getAttribute('aria-label')), oldCards);
    app.click('更换英雄/模式');
    await until(() => app.buttons('开始对局').length);
    assert.equal(app.document.getElementById('ai-hero').value, '0', 'resume hydrates the saved opponent policy');
    app.select('match-mode', 'ai2');
    await pause();
    app.select('ai-hero', 1);
    app.select('ai2-hero', 3);
    await pause();
    assert.equal(app.document.getElementById('ai2-hero').options.length, HEROES.length + 1);
    app.click('开始对局');
    await until(() => app.buttons('覆盖存档并开始').length);
    app.click('覆盖存档并开始');
    await until(() => app.document.querySelectorAll('.general-seat.opponent').length === 2);
    const beforeRestart = app.dom.window.localStorage.getItem('jh_browser_save_v2');
    const previous = JSON.parse(beforeRestart);
    assert.equal(previous.config.mode, 'ai2');
    assert.equal(previous.config.ai_hero_index, 1);
    assert.equal(previous.config.ai2_hero_index, 3);
    assert.deepEqual([...app.document.querySelectorAll('.general-seat.opponent .portrait-banner')].map(e => e.textContent), ['撼岳', '李白']);
    app.click('重新开局');
    await until(() => app.buttons('取消').length);
    assert.match(app.document.querySelector('.config-summary').textContent, /人机 1：指定 撼岳；本局 撼岳/);
    assert.match(app.document.querySelector('.config-summary').textContent, /人机 2：指定 李白；本局 李白/);
    app.click('取消');
    await pause();
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), beforeRestart, 'cancelled restart preserves the exact save bytes');
    app.click('重新开局');
    await until(() => app.buttons('确认重新开局').length);
    app.click('确认重新开局');
    await until(() => !app.buttons('确认重新开局').length && app.document.querySelector('.action-dock') && app.document.querySelectorAll('.general-seat.opponent').length === 2 && app.dom.window.localStorage.getItem('jh_browser_save_v2') !== beforeRestart);
    const restarted = JSON.parse(app.dom.window.localStorage.getItem('jh_browser_save_v2'));
    assert.deepEqual(restarted.config, previous.config);
    assert.notEqual(restarted.seed, previous.seed);
    assert.notEqual(restarted.game_id, previous.game_id);
    assert.deepEqual(restarted.actions, []);
    assert.deepEqual([...app.document.querySelectorAll('.general-seat.opponent .portrait-banner')].map(e => e.textContent), ['撼岳', '李白']);
    app.click('更换英雄/模式');
    await until(() => app.buttons('清除存档').length);
    app.click('清除存档');
    await until(() => app.buttons('确认清除').length);
    app.click('确认清除');
    await pause();
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), null);
    assert.equal(app.buttons('继续上局').length, 0);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('AI 2 draft survives mode changes; 1v1 omits it; duplicate starts and restarts create one match', async () => {
  const app = mount(fixture);
  try {
    await until(() => app.buttons('开始对局').length);
    app.select('match-mode', 'ai2'); await pause();
    app.select('ai-hero', 18);
    app.select('ai2-hero', 17); await pause();
    app.select('match-mode', 'ai'); await pause();
    assert.equal(app.document.getElementById('ai2-hero'), null);
    app.select('match-mode', 'ai2'); await pause();
    assert.equal(app.document.getElementById('ai2-hero').value, '17');
    app.select('match-mode', 'ai'); await pause();
    const start = app.buttons('开始对局')[0];
    start.click(); start.click();
    await until(() => app.document.querySelector('.action-dock'));
    assert.equal(app.dom.window.__fixtureCreates, 1);
    assert.deepEqual(JSON.parse(JSON.stringify(app.dom.window.__fixture.options)), { hero_index: 0, mode: 'ai', ai_hero_index: 18 });
    app.click('重新开局'); await until(() => app.buttons('确认重新开局').length);
    const restart = app.buttons('确认重新开局')[0];
    restart.click(); restart.click();
    await until(() => app.document.querySelector('.action-dock'));
    assert.equal(app.dom.window.__fixtureCreates, 2);
    assert.equal(app.dom.window.__fixture.options.ai_hero_index, 18);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('current-version random saves resume and restart as random rather than locking the drawn hero', async () => {
  let app = mount(production);
  try {
    await until(() => app.buttons('开始对局').length);
    app.select('match-mode', 'ai2'); await pause();
    app.click('开始对局');
    await until(() => app.document.querySelector('.action-dock'));
    const legacy = JSON.parse(app.dom.window.localStorage.getItem('jh_browser_save_v2'));
    assert.equal(legacy.config.ai_hero_id, null);
    assert.equal(legacy.config.ai2_hero_id, null);
    app.dom.window.close();
    app = mount(production, JSON.stringify(legacy));
    await until(() => app.buttons('继续上局').length);
    assert.equal(app.document.getElementById('match-mode').value, 'ai2');
    assert.equal(app.document.getElementById('ai-hero').value, 'random');
    assert.equal(app.document.getElementById('ai2-hero').value, 'random');
    app.click('继续上局');
    await until(() => app.document.querySelector('.action-dock'));
    app.click('重新开局');
    await until(() => app.buttons('确认重新开局').length);
    const summary = app.document.querySelector('.config-summary').textContent;
    assert.match(summary, /人机 1：随机英雄（重新抽选）；本局/);
    assert.match(summary, /人机 2：随机英雄（重新抽选）；本局/);
    app.click('确认重新开局');
    await until(() => !app.buttons('确认重新开局').length && app.document.querySelector('.action-dock') && app.document.querySelectorAll('.general-seat.opponent').length === 2);
    const restarted = JSON.parse(app.dom.window.localStorage.getItem('jh_browser_save_v2'));
    assert.equal(restarted.config.ai_hero_index, null);
    assert.equal(restarted.config.ai2_hero_index, null);
    assert.notEqual(restarted.seed, legacy.seed);
    const names = [...app.document.querySelectorAll('.portrait-banner')].map(e => e.textContent);
    assert.equal(new Set(names).size, 3, 'random heroes are distinct from each other and the player');
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('corrupt saved game fails safely and offers a clear path to a new game', async () => {
  const app = mount(production, '{broken');
  try {
    await until(() => app.buttons('继续上局').length);
    app.click('继续上局');
    await until(() => app.document.querySelector('[role="alert"]'));
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), '{broken');
    await until(() => app.buttons('开始对局').length);
    app.click('清除存档');
    await until(() => app.buttons('确认清除').length);
    app.click('确认清除');
    await pause();
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), null);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('full card UI covers skills, targets, responses, discard, hidden-card selection, equipment, and game-over', async () => {
  const app = mount(fixture);
  try {
    await until(() => app.buttons('开始对局').length);
    app.click('开始对局');
    await until(() => app.document.querySelector('.action-dock'));
    const match = app.dom.window.__fixture;
    const playable = () => app.document.querySelector('.action-dock') && !app.document.querySelector('.prompt-controls')?.disabled;
    async function show(kind, extras = {}, stateExtras = {}) {
      const oldDock = app.document.querySelector('.action-dock');
      const oldDialog = app.document.querySelector('[role="dialog"]');
      const prompt = match.show(kind, extras, stateExtras);
      // React may yield longer than 10 ms under suite load. Wait for this prompt's
      // keyed subtree to replace the previous one, not for a timer to expire.
      await until(() => {
        if (['finished', 'ended'].includes(stateExtras.phase) || stateExtras.winner) return app.document.querySelector('.end-dock');
        if (['play_card', 'discard'].includes(kind)) return playable() && app.document.querySelector('.action-dock') !== oldDock;
        const dialog = app.document.querySelector('[role="dialog"]');
        return dialog && dialog !== oldDialog && dialog.getAttribute('aria-label') === prompt.message;
      }, `prompt did not render: ${kind}`);
    }
    async function clickOnNextPlay(label, stateExtras) {
      const oldDock = app.document.querySelector('.action-dock');
      let clicked = false;
      // Regress the real fast-click bug: act at DOM commit, before a delayed
      // passive effect could erase the player's newly selected mode.
      const observer = new app.dom.window.MutationObserver(() => {
        const dock = app.document.querySelector('.action-dock');
        const button = app.buttons(label)[0];
        if (!clicked && dock && dock !== oldDock && button && !button.disabled) {
          clicked = true;
          observer.disconnect();
          button.click();
        }
      });
      observer.observe(app.document.getElementById('root'), { childList: true, subtree: true });
      try {
        await show('play_card', {}, stateExtras);
        await until(() => clicked, `fast click did not reach ${label}`);
      } finally { observer.disconnect(); }
    }
    async function waitForNextPlay(promptId, oldDock) {
      await until(() => match.prompt?.kind === 'play_card' && match.prompt.prompt_id !== promptId && playable() && app.document.querySelector('.action-dock') !== oldDock && !app.document.querySelector('[role="dialog"]'), 'next play prompt did not settle');
    }
    async function respond(label, expected) {
      const count = match.responses.length;
      const promptId = match.prompt.prompt_id;
      const oldDock = app.document.querySelector('.action-dock');
      app.click(label);
      await until(() => match.responses.length > count);
      assert.equal(match.responses.at(-1).value, expected);
      await waitForNextPlay(promptId, oldDock);
    }
    await show('confirm'); await respond('确定', 'y');
    await show('confirm'); await respond('取消', 'n');
    for (const kind of ['choice', 'rescue', 'select_target_card', 'hero_select']) {
      await show(kind, { options: [{ id: 'ai2', label: '第二名对手' }, { id: '0', label: '放弃' }] });
      await respond('第二名对手', 'ai2');
    }
    await show('discard');
    const discardId = match.prompt.prompt_id, discardDock = app.document.querySelector('.action-dock');
    app.document.querySelectorAll('.action-dock .sgs-card')[1].click();
    await until(() => match.responses.at(-1).value === '2');
    await waitForNextPlay(discardId, discardDock);
    // Rapid duplicate clicks are tied to the old prompt and accepted only once.
    const end = app.buttons('结束出牌')[0], oldCount = match.responses.length;
    const endId = match.prompt.prompt_id, endDock = app.document.querySelector('.action-dock');
    end.click(); end.click();
    await until(() => match.responses.length > oldCount);
    assert.equal(match.responses.length, oldCount + 1);
    await waitForNextPlay(endId, endDock);
    await show('select_hand', { min_count: 2, max_count: 2, meta: { owner_seat: 'ai' } });
    assert.equal(app.document.querySelectorAll('.sgs-dialog .sgs-card.back').length, 5);
    app.document.querySelector('[aria-label="未知手牌 2"]').click();
    app.document.querySelector('[aria-label="未知手牌 5"]').click();
    await until(() => app.buttons('确认')[0] && !app.buttons('确认')[0].disabled, 'hidden card selection did not become ready');
    await respond('确认', '2 5');
    const skillState = match.state();
    skillState.active_skills = [{ label: '女帝', hotkey: 'q', arg_mode: 'one_card', min_cards: 1, max_cards: 1, card_filter: 'red' }];
    await show('play_card', {}, skillState);
    app.click('女帝');
    await until(() => app.buttons('确认发动').length && app.document.querySelectorAll('.action-dock .sgs-card')[1].disabled, 'red-card skill selector did not render');
    assert.equal(app.document.querySelectorAll('.action-dock .sgs-card')[1].disabled, true);
    app.document.querySelectorAll('.action-dock .sgs-card')[0].click();
    await until(() => app.buttons('确认发动')[0] && !app.buttons('确认发动')[0].disabled, 'skill selection did not become ready');
    await respond('确认发动', 'q 1');
    const eqState = match.state();
    eqState.players.self.marks.shixian = true;
    eqState.players.self.equipment.weapon = { ...eqState.players.self.hand[0], name: '丈八蛇矛', trait: 'two_as_sha' };
    await clickOnNextPlay('装杀', eqState);
    await until(() => app.buttons('武器·丈八蛇矛').length, 'equipment attack selector did not render');
    await respond('武器·丈八蛇矛', 'eq weapon');
    await clickOnNextPlay('丈八', eqState);
    await until(() => app.buttons('当杀打出').length, 'two-card attack selector did not render');
    const hand = app.document.querySelectorAll('.action-dock .sgs-card');
    hand[0].click(); hand[1].click();
    await until(() => app.buttons('当杀打出')[0] && !app.buttons('当杀打出')[0].disabled, 'two-card attack did not become ready');
    await respond('当杀打出', 'sha 1 2');
    await show('play_card', {}, { phase: 'finished', winner: 'player' });
    assert.ok(app.document.querySelector('.end-dock').textContent.includes('赢得此局'));
    assert.equal(app.document.querySelector('.action-dock'), null);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('storage failure is visible, keeps play available, and confirms leaving unsaved progress', async () => {
  const app = mount(production);
  try {
    await until(() => app.buttons('开始对局').length);
    app.dom.window.Storage.prototype.setItem = () => { throw new Error('Quota exceeded'); };
    app.click('开始对局');
    await until(() => app.document.querySelector('.action-dock'));
    assert.match(app.document.querySelector('[role="alert"]').textContent, /自动存档失败/);
    assert.match(app.document.querySelector('.table-status').textContent, /存档不可用/);
    app.click('结束出牌');
    await pause(60);
    assert.match(app.document.querySelector('[role="alert"]').textContent, /自动存档失败/);
    app.click('关闭提示');
    await pause();
    app.click('更换英雄/模式');
    await until(() => app.buttons('仍然离开').length);
    app.click('取消');
    await pause();
    assert.ok(app.document.querySelector('.action-dock'));
    app.click('更换英雄/模式');
    await until(() => app.buttons('仍然离开').length);
    app.click('仍然离开');
    await until(() => app.buttons('开始对局').length);
    assert.deepEqual(app.errors, []);
  } finally { app.dom.window.close(); }
});

test('game instructions are available from the game without starting or replacing a match', async () => {
  const app = mount(production);
  try {
    await until(() => app.buttons('玩法说明').length);
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), null);
    app.click('玩法说明');
    await until(() => app.document.querySelector('.help-dialog'));
    const link = app.document.querySelector('.help-dialog a');
    assert.equal(link.href, 'https://example.test/game/jianghu-slay.html');
    assert.match(link.textContent, /游戏介绍与存档说明/);
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), null);
    app.click('知道了');
    await until(() => !app.document.querySelector('.help-dialog'));
    assert.ok(app.buttons('开始对局').length);
    app.click('开始对局');
    await until(() => app.document.querySelector('.action-dock'));
    const saved = app.dom.window.localStorage.getItem('jh_browser_save_v2');
    app.click('说明');
    await until(() => app.document.querySelector('.help-dialog'));
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), saved);
    app.click('知道了');
    await until(() => !app.document.querySelector('.help-dialog'));
    assert.ok(app.document.querySelector('.action-dock'));
    assert.equal(app.dom.window.localStorage.getItem('jh_browser_save_v2'), saved);
    assert.equal(app.errors.length, 0);
  } finally { app.dom.window.close(); }
});
