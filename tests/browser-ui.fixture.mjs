// Test-only transport: exercise every full-card UI prompt without replacing engine tests.
import { HEROES } from '../web/local/models.js';
import {SAVE_KEY} from '../web/local/session.js';
export {SAVE_KEY};
const KEY = SAVE_KEY;
export class LocalMatch {
  static heroes() { return HEROES.map((h, index) => ({ ...h, index })); }
  constructor({ onMessage, onError }) { this.onMessage = onMessage; this.onError = onError; this.responses = []; window.__fixture = this; }
  hasSave() { return Boolean(localStorage.getItem(KEY)); }
  clearSave() { localStorage.removeItem(KEY); return true; }
  close() { this.closed = true; }
  async resume() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved?.config) return false;
      this.options = saved.config;
      this.open();
      return true;
    } catch { return false; }
  }
  open() {
    this.closed = false;
    const config = { ai_hero_index: null, ai2_hero_index: null, ...this.options };
    this.onMessage({ type: 'session', session: { mode: config.mode, config } });
    this.show('play_card');
  }
  async create(options) {
    this.options = options;
    window.__fixtureCreates = (window.__fixtureCreates || 0) + 1;
    localStorage.setItem(KEY, JSON.stringify({ config: options, seed: window.__fixtureCreates }));
    this.open();
  }
  state() {
    const card = (name, index) => ({ name, type: name, suit: index % 2 ? '黑桃' : '红桃', color: index % 2 ? '黑' : '红', rank_label: String(index + 1), label: `${name}-${index}`, description: name });
    const player = (seat, name, heroIndex) => ({ seat, name, alive: true, hp: 3, max_hp: 4, hero: HEROES[heroIndex], marks: {}, hand_count: 3, hand: ['杀', '闪', '桃'].map(card), equipment: { weapon: null, armor: null, offensive_horse: null, defensive_horse: null } });
    const me = player('player', '少侠', this.options?.hero_index ?? 0);
    const reserved = [this.options?.hero_index ?? 0, this.options?.ai_hero_index, this.options?.ai2_hero_index];
    const randomHero = () => { const index = HEROES.findIndex((_, i) => !reserved.includes(i)); reserved.push(index); return index; };
    const opponent = player('ai', 'AI甲', this.options?.ai_hero_index ?? randomHero());
    opponent.hand_count = 5;
    opponent.hand = Array.from({ length: 5 }, () => ({ hidden: true, name: '背面' }));
    const opponent2 = { ...player('ai2', 'AI乙', this.options?.ai2_hero_index ?? randomHero()), hand: [{ hidden: true }, { hidden: true }, { hidden: true }] };
    return { config: { ai_hero_index: null, ai2_hero_index: null, ...this.options }, phase: 'playing', winner: null, mode: this.options?.mode === 'ai2' ? '1v2' : '1v1', round: 1, deck_count: 100, discard_count: 0, save_status: 'saved', players: { self: me, opponents: this.options?.mode === 'ai2' ? [opponent, opponent2] : [opponent], opponent }, active_skills: [] };
  }
  show(kind, extras = {}, stateExtras = {}) {
    const state = Object.assign(this.state(), stateExtras);
    this.onMessage({ type: 'state', state });
    this.prompt = { prompt_id: `prompt-${(this.counter = (this.counter || 0) + 1)}`, kind, message: `测试 ${kind}`, options: [], ...extras };
    this.onMessage({ type: 'prompt', prompt: this.prompt });
    return this.prompt;
  }
  async respond(id, value) {
    if (this.prompt?.prompt_id !== id) return false;
    this.responses.push({ id, value });
    this.prompt = null;
    this.onMessage({ type: 'prompt', prompt: null });
    await new Promise(resolve => setTimeout(resolve, 10));
    this.show('play_card');
    return true;
  }
}
