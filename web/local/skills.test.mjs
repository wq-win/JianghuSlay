/** Run with: node --test web/local/skills.test.mjs */
import test from 'node:test';
import {Game} from './game.js';
import {trickMethods} from './game-tricks.js';
import {materialMethods} from './game-materials.js';
import {zoneMethods} from './game-zones.js';
import assert from 'node:assert/strict';
import { Card, CardType, CardColor, CardSuit, Player, CLASSIC_HEROES as HEROES, canonical_hero_for_source } from './models.js';
import { SkillHooks, ActiveSkillDef, SKILL_HOTKEYS, HERO_SKILL_HOOKS,
  ACTIVE_SKILLS_BY_HERO, active_skills_for_hero, active_skill_by_hotkey, skill_hooks_for_hero } from './skills.js';

const tick = () => new Promise(resolve => setImmediate(resolve));
function card(type = CardType.SHA, { color = CardColor.BLACK, suit = CardSuit.SPADE, name = type } = {}) {
  return new Card(name, type, { color, suit });
}
function player(heroName = '刘邦', hand = [], is_ai = false) {
  const actor = new Player(heroName, HEROES.find(h => h.name === heroName), is_ai);
  actor.hand = hand;
  return actor;
}
function game({ choices = [], confirms = [], deck = [] } = {}) {
  return {
    // Classic-only contract fixture uses the real public-cost kernels.
    consume_material:materialMethods.consume_material,consume_material_batch:materialMethods.consume_material_batch,can_pay_materials:materialMethods.can_pay_materials,
    move_card_from_zone:zoneMethods.move_card_from_zone,remove_equipment:zoneMethods.remove_equipment,
    processing_cards: [], judgment_stack: [], judgment_event_counter: 0, action_order:()=>[], reveal_judgment:trickMethods.reveal_judgment, finish_processing_card:trickMethods.finish_processing_card, register_judgment_material(){}, async finish_judgment_card(card){return this.finish_processing_card(card);},
    logs: [], calls: [], prompts: [], discarded: [], choices: [...choices], confirms: [...confirms], drawn: [...deck],
    canSha: true, inRange: true, canShunshou: true, immune: false, hasShixian: true,
    get view() {
      return {
        emit: message => this.logs.push(message),
        ask_line: async (message, options) => {
          this.prompts.push({ message, ...options }); await tick();
          assert.ok(this.choices.length, `Unexpected prompt: ${message}`);
          return this.choices.shift();
        },
        ask_confirm: async (message, options) => {
          this.prompts.push({ message, ...options }); await tick();
          assert.ok(this.confirms.length, `Unexpected confirmation: ${message}`);
          return this.confirms.shift();
        },
      };
    },
    get deck() {
      return {
        discard: cards => this.discarded.push(...(Array.isArray(cards) ? cards : [cards])),
        draw: count => this.drawn.splice(0, count),
      };
    },
    seat_of: p => p.is_ai ? 1 : 0,
    side_of: p => p.is_ai ? 'ai' : 'player',
    draw_cards(p, count) { this.calls.push(['draw', p, count]); p.hand.push(...Array.from({ length: count }, () => card())); },
    parse_hand_indexes(args, p) {
      if (!args.length || args.some(s => !/^\d+$/.test(s))) return [];
      const indexes = args.map(s => Number(s) - 1);
      return new Set(indexes).size !== indexes.length || indexes.some(i => i < 0 || i >= p.hand.length) ? [] : indexes;
    },
    pop_hand_indexes(p, indexes) { return [...indexes].sort((a, b) => b - a).map(i => p.hand.splice(i, 1)[0]).reverse(); },
    swap_all_hands(a, b) { [a.hand, b.hand] = [b.hand, a.hand]; this.calls.push(['swap_all']); },
    async swap_hand_cards(a, b, ai, bi) {
      await tick(); const ac = this.pop_hand_indexes(a, ai), bc = this.pop_hand_indexes(b, bi);
      a.hand.push(...bc); b.hand.push(...ac); this.calls.push(['swap_cards', ai, bi]);
    },
    async player_choose_hand_indexes(owner, count) { await tick(); return this.selected ?? Array.from({ length: count }, (_, i) => i); },
    async resolve_scroll(a, b, c) { await tick(); this.calls.push(['scroll', c]); },
    async try_shiquan_bonus_draw(a) { await tick(); this.calls.push(['bonus', a]); },
    async apply_damage(p, amount, options) { await tick(); p.hp -= amount; this.calls.push(['damage', p, amount, options]); },
    async check_dying(p, source) { await tick(); p.hp = 0; this.calls.push(['dying', p, source]); },
    async discard_from_hand(p, count, options) { await tick(); this.discarded.push(...p.hand.splice(0, count)); this.calls.push(['discard', options]); },
    // This classic-only fixture has no owner-scoped suit conversion.
    effective_card: card => card,
    effective_suit: card => card.suit,
    effective_color: card => card.color,
    material_sha(actor, cost) { return new Card('杀', CardType.SHA, {suit:cost.suit,color:cost.color,rank:cost.rank,virtual:true,materials:[cost]}); },
    async use_sha(a, b, name, options) { await tick(); this.calls.push(['sha', a, b, name, options]); },
    async take_target_card(a, b, action) { await tick(); this.calls.push(['take', a, b, action]);const card=b.hand.shift()??null;if(card)a.hand.push(card);return card; },
    async remove_target_card(a, b) { await tick(); this.calls.push(['remove', a, b]);const card=b.hand.shift()??null;if(card)this.deck.discard(card);return card; },
    can_trick_target: () => true, // Classic isolated fixture has no 控局 owner.
    target_has_card: p => p.hand.length > 0 || !!p.weapon,
    target_has_visible_equipment: p => !!p.weapon,
    can_use_sha() { return this.canSha; },
    in_attack_range() { return this.inRange; },
    can_use_shunshou() { return this.canShunshou; },
    is_immune_to_shunshou() { return this.immune; },
    has_shixian_playable() { return this.hasShixian; },
    distance_between: () => 2,
    find_card: (p, type) => { const i = p.hand.findIndex(c => c.type === type); return i < 0 ? null : i; },
    preview_sha_damage: a => 1 + a.bawang_stacks,
    is_red_card: c => c.color === CardColor.RED,
  };
}
const skill = name => active_skills_for_hero(HEROES.find(h => h.name === name))[0];
const hook = (name, kind) => skill_hooks_for_hero(HEROES.find(h=>h.name===name))[kind][0];

// Registry and exported contracts.
test('all 19 heroes retain their original active or passive skill registrations', () => {
  assert.equal(HEROES.filter(h => skill_hooks_for_hero(h)).length, 14);
  assert.equal(HEROES.filter(h => active_skills_for_hero(h).length).length, 9);
  assert.ok(HEROES.every(h=>skill_hooks_for_hero(h)||active_skills_for_hero(h).length));
  assert.deepEqual([...SKILL_HOTKEYS], ['q', 'w', 'e', 'r']);
  assert.deepEqual(active_skills_for_hero('未知'), []);
  assert.equal(active_skill_by_hotkey('秦始皇', 'q'), null);
  assert.equal(active_skill_by_hotkey('刘邦', 'Q'), null);
  assert.equal(active_skill_by_hotkey('刘邦', 'q'), null, 'same-name original/source lookup fails closed');
  assert.equal(active_skill_by_hotkey('jianghu.classic.hero.liu-bang', 'q'), skill('刘邦'));
  assert.equal(active_skill_by_hotkey('衡舟', 'q'), skill('刘邦'));
});

test('hook defaults are independent plain objects and preserve all passive flags', () => {
  const a = new SkillHooks(), b = SkillHooks();
  assert.equal(Object.getPrototypeOf(a), Object.prototype);
  a.on_damaged.push('test'); assert.deepEqual(b.on_damaged, []);
  assert.equal(a.max_sha_per_turn, 1);
  for (const key of ['red_hand_as_tao', 'immune_to_sha_without_hand', 'shunshou_no_distance_limit', 'immune_to_shunshou', 'response_sha_shan_swap', 'ai_prefer_wine_before_sha']) assert.equal(a[key], false);
  assert.equal(skill_hooks_for_hero(HEROES.find(h=>h.id==='jianghu.classic.hero.yang-yan-zhao')).max_sha_per_turn, 3);
  assert.equal(skill_hooks_for_hero('jianghu.classic.hero.wu-ze-tian').red_hand_as_tao, true);
  assert.equal(skill_hooks_for_hero(HEROES.find(h=>h.id==='jianghu.classic.hero.han-xin')).immune_to_sha_without_hand, true);
  assert.equal(skill_hooks_for_hero(HEROES.find(h=>h.id==='jianghu.classic.hero.shi-qian')).shunshou_no_distance_limit, true);
  assert.equal(skill_hooks_for_hero(HEROES.find(h=>h.id==='jianghu.classic.hero.shi-qian')).immune_to_shunshou, true);
  assert.equal(skill_hooks_for_hero(HEROES.find(h=>h.id==='jianghu.classic.hero.yue-fei')).response_sha_shan_swap, true);
});

test('active skill metadata includes the original selectors and serialization fields', () => {
  const expected = [
    ['李白', '诗仙', 'none', 0, 0, 'any'], ['武则天', '女帝', 'one_card', 1, 1, 'red'],
    ['项羽', '霸王', 'none', 0, 0, 'any'], ['刘邦', '驭人', 'cards', 1, 0, 'any'],
    ['赵匡胤', '释权', 'one_card', 1, 1, 'black'], ['杨再兴', '冲阵', 'one_card', 1, 1, 'shan'],
    ['褒姒', '换牌', 'cards_or_all', 1, 0, 'any'], ['韩信', '兵仙', 'exactly_n', 3, 3, 'any'],
    ['时迁', '神偷', 'none', 0, 0, 'any'],
  ];
  for (const [name, id, mode, min, max, filter] of expected) {
    const s = skill(name), data = s.to_client_dict();
    assert.equal(s instanceof ActiveSkillDef, true);
    assert.deepEqual(Object.keys(data), ['hotkey', 'id', 'help', 'label', 'arg_mode', 'min_cards', 'max_cards', 'card_filter']);
    assert.deepEqual([data.hotkey, data.id, data.label, data.arg_mode, data.min_cards, data.max_cards, data.card_filter], ['q', id, id, mode, min, max, filter]);
    assert.equal(typeof data.help, 'string');
    assert.equal(s.player.constructor.name, 'AsyncFunction');
    assert.equal(s.ai.constructor.name, 'AsyncFunction');
  }
});

test('驭人 preserves hand count, rejects invalid selections and is once per turn', async () => {
  const a = player('刘邦', [card(), card(CardType.SHAN), card(CardType.TAO)]), b = player(), g = game();
  assert.equal(await skill('刘邦').player(g, a, b, []), false);
  assert.equal(await skill('刘邦').player(g, a, b, ['1', '1']), false);
  assert.equal(await skill('刘邦').player(g, a, b, ['1', '3']), true);
  assert.equal(a.hand.length, 3); assert.equal(g.discarded.length, 2);
  await skill('刘邦').player(g, a, b, ['1']); assert.equal(g.discarded.length, 2);
});

test('驭人 AI only exchanges a sufficiently large hand, at most once', async () => {
  const a = player('刘邦', [card(), card(), card()], true), g = game();
  assert.equal(await skill('刘邦').ai(g, a, player()), false);
  a.hand.push(card()); assert.equal(await skill('刘邦').ai(g, a, player()), true);
  assert.equal(a.hand.length, 4); assert.equal(g.discarded.length, 2);
  assert.equal(await skill('刘邦').ai(g, a, player()), false);
});

test('释权 checks black cards and awaits scroll completion before bonus draw', async () => {
  const a = player('赵匡胤', [card(CardType.TAO, { color: CardColor.RED }), card()]), b = player(), g = game();
  assert.equal(await skill('赵匡胤').player(g, a, b, []), false);
  assert.equal(await skill('赵匡胤').player(g, a, b, ['1']), true); assert.equal(a.hand.length, 2);
  assert.equal(await skill('赵匡胤').player(g, a, b, ['2']), true);
  assert.deepEqual(g.calls.map(c => c[0]), ['scroll', 'bonus']);
  assert.equal(g.calls[0][1].name, '釜底抽薪'); assert.equal(g.calls[0][1].type, CardType.SCROLL);
});

test('释权 AI requires target cards and spends the first black card', async () => {
  const red = card(CardType.TAO, { color: CardColor.RED }), black = card();
  const a = player('赵匡胤', [red, black], true), b = player(), g = game();
  assert.equal(await skill('赵匡胤').ai(g, a, b), false);
  b.hand.push(card()); assert.equal(await skill('赵匡胤').ai(g, a, b), true);
  assert.deepEqual(a.hand, [red]); assert.deepEqual(g.calls.map(c => c[0]), ['scroll', 'bonus']);
  assert.equal(await skill('赵匡胤').ai(g, a, b), false);
});

test('冲阵 preserves unusable cards, checks range/turn limits and awaits Sha', async () => {
  const material = card(CardType.SHAN);
  const a = player('杨再兴', [card(), material]), b = player(), g = game();
  await skill('杨再兴').player(g, a, b, ['1']); assert.equal(a.hand.length, 2);
  g.canSha = false; await skill('杨再兴').player(g, a, b, ['2']); assert.equal(a.hand.length, 2);
  g.canSha = true; g.inRange = false; await skill('杨再兴').player(g, a, b, ['2']); assert.equal(a.hand.length, 2);
  g.inRange = true; await skill('杨再兴').player(g, a, b, ['2']);
  assert.equal(a.hand.length, 1); assert.equal(g.calls.at(-1)[0], 'sha');
  assert.equal(g.calls.at(-1)[3], '冲阵转化的杀');
  assert.equal(g.calls.at(-1)[4].source_card.type, CardType.SHA);
  assert.equal(g.calls.at(-1)[4].source_card.virtual, true);
  assert.equal(g.calls.at(-1)[4].source_card.materials[0], material);
  assert.equal(g.discarded[0], material);
  assert.equal(g.calls.at(-1)[4].source_last_hand, false);
});

test('冲阵 AI uses a Shan and respects attack legality', async () => {
  const material = card(CardType.SHAN);
  const a = player('杨再兴', [material], true), g = game();
  g.canSha = false; assert.equal(await skill('杨再兴').ai(g, a, player()), false);
  g.canSha = true; assert.equal(await skill('杨再兴').ai(g, a, player()), true);
  assert.equal(g.calls.at(-1)[0], 'sha'); assert.equal(a.hand.length, 0);
  assert.equal(g.calls.at(-1)[4].source_card.materials[0], material);
  assert.equal(g.calls.at(-1)[4].source_card.virtual, true);
  assert.equal(g.calls.at(-1)[4].source_last_hand, true);
  assert.equal(g.discarded[0], material);
  assert.equal(await skill('杨再兴').ai(g, a, player()), false);
});

test('换牌 full exchange accepts ALL and 0, handles empty hands, and is once per turn', async () => {
  const a = player('褒姒'), b = player(), g = game();
  assert.equal(await skill('褒姒').player(g, a, b, []), false);
  assert.equal(await skill('褒姒').player(g, a, b, ['0']), true);
  assert.equal(a.used_active_skills.size, 0);
  const hand = [card(), card()]; b.hand = hand;
  await skill('褒姒').player(g, a, b, ['ALL']); assert.equal(a.hand, hand); assert.equal(b.hand.length, 0);
  await skill('褒姒').player(g, a, b, ['all']); assert.equal(a.hand, hand);
});

test('换牌 partial exchange awaits selection and swapping, without revealing hidden cards', async () => {
  const a1 = card(CardType.SHAN), b1 = card(CardType.TAO), b2 = card(CardType.WINE);
  const a = player('褒姒', [a1]), b = player('刘邦', [b1, b2]), g = game();
  g.selected = [1];
  assert.equal(await skill('褒姒').player(g, a, b, ['1']), true);
  assert.deepEqual(a.hand, [b2]); assert.deepEqual(b.hand, [b1, a1]);
  assert.equal(g.calls.at(-1)[0], 'swap_cards');
  const x = player('褒姒', [card(), card()]);
  assert.equal(await skill('褒姒').player(g, x, player(), ['1']), true);
  assert.equal(x.used_active_skills.size, 0);
});

test('换牌 AI uses full/partial rules and supports elemental Sha', async () => {
  let a = player('褒姒', [card()], true), b = player('刘邦', [card(), card()]), g = game();
  assert.equal(await skill('褒姒').ai(g, a, b), true); assert.equal(g.calls[0][0], 'swap_all');
  a = player('褒姒', [card(CardType.SHAN), card(CardType.BLOOD_SHA)], true);
  b = player('刘邦', [card(CardType.POISON_SHA)]); g = game();
  assert.equal(await skill('褒姒').ai(g, a, b), true);
  assert.equal(a.hand[0].type, CardType.SHAN); assert.equal(a.hand[1].type, CardType.POISON_SHA);
  assert.equal(b.hand[0].type, CardType.BLOOD_SHA);
});

test('霸王 stacks, draws and enters dying at one HP using self as source', async () => {
  const a = player('项羽'), b = player(), g = game(); a.hp = 1;
  assert.equal(await skill('项羽').player(g, a, b, ['1']), false);
  assert.equal(await skill('项羽').player(g, a, b, []), true);
  assert.equal(a.hp, 0); assert.equal(a.bawang_stacks, 1); assert.equal(a.hand.length, 1); assert.equal(a.alive, false);
  assert.deepEqual(g.calls.at(-1), ['dying', a, a]);
  assert.equal(g.calls.some(c => c[0] === 'damage'), false);
  const count = g.calls.length; await skill('项羽').player(g, a, b, []); assert.equal(g.calls.length, count);
});

test('霸王 AI keeps at least two HP and passive damage remains synchronous', async () => {
  const a = player('项羽', [], true), b = player(), g = game(); a.hp = 3;
  assert.equal(await skill('项羽').ai(g, a, b), true); assert.equal(a.hp, 2);
  assert.equal(hook('项羽', 'sha_damage_bonus')(g, a, b), 1);
  assert.equal(await skill('项羽').ai(g, a, b), false);
});

test('女帝 requires red cards; AI does not reapply a pending mark', async () => {
  const a = player('武则天', [card(), card(CardType.TAO, { color: CardColor.RED })]), b = player(), g = game();
  await skill('武则天').player(g, a, b, ['1']); assert.equal(a.hand.length, 2);
  await skill('武则天').player(g, a, b, ['2']); assert.equal(b.judgment_mark_pending, true); assert.equal(a.hand.length, 1);
  a.hand.push(card(CardType.SHAN, { color: CardColor.RED }));
  assert.equal(await skill('武则天').ai(g, a, b), false);
  b.judgment_mark_pending = false; assert.equal(await skill('武则天').ai(g, a, b), true);
});

test('兵仙 requires three unique cards and awaits damage with the correct source', async () => {
  const a = player('韩信', [card(), card(), card(), card()]), b = player(), g = game();
  assert.equal(await skill('韩信').player(g, a, b, ['1', '1', '2']), false);
  assert.equal(await skill('韩信').player(g, a, b, ['1', '2']), false);
  assert.equal(await skill('韩信').player(g, a, b, ['1', '2', '3']), true);
  assert.equal(a.hand.length, 1); assert.equal(g.discarded.length, 3); assert.equal(b.hp, 3);
  assert.equal(g.calls.at(-1)[3].source, a);
});

test('兵仙 AI retains high-priority cards and discards blood/poison Sha without crashing', async () => {
  const a = player('韩信', [card(CardType.SHAN), card(CardType.BLOOD_SHA), card(CardType.TAO), card(CardType.POISON_SHA), card(CardType.ARMOR)], true), b = player(), g = game();
  assert.equal(await skill('韩信').ai(g, a, b), true);
  assert.deepEqual(a.hand.map(c => c.type), [CardType.SHAN, CardType.TAO]);
  assert.equal(b.hp, 3); assert.equal(await skill('韩信').ai(g, a, b), false);
});

test('诗仙 activation is once per turn and AI requires usable attack resources', async () => {
  const a = player('李白'), b = player(), g = game();
  assert.equal(await skill('李白').player(g, a, b, ['1']), false);
  assert.equal(await skill('李白').player(g, a, b, []), true); assert.equal(a.shixian_active, true);
  assert.equal(a.used_active_skills.has('诗仙'), true);
  assert.equal(await skill('李白').ai(g, a, b), false);
  a.shixian_active = false; g.hasShixian = false; assert.equal(await skill('李白').ai(g, a, b), false);
  g.hasShixian = true; assert.equal(await skill('李白').ai(g, a, b), true);
});

function sourceThiefFixture(ai=false) {
  const logs=[],prompts=[],g=new Game({emit:message=>logs.push(message),ask_line:async(message,options)=>{prompts.push({message,...options});return options.options.find(option=>!['cancel','pass','0'].includes(option.id))?.id??'1';}},{seed:82});
  const thief=new Player('时迁',canonical_hero_for_source('jianghu.classic.hero.shi-qian'),ai),other=player('姜维',[],!ai);
  [g.player,g.ai]=ai?[other,thief]:[thief,other];g.p1=g.player;g.p2=g.ai;g.p3=g.ai2=null;g.turn_actor=ai?'p2':'p1';g.turn_phase='play';
  return {g,a:thief,b:other,logs,prompts};
}

test('archived 飞贼 entry resolves full 神偷 rules: club cost, immunity, range and target-card legality', async () => {
  const {g,a,b}=sourceThiefFixture(),cost=card(CardType.SHAN,{suit:CardSuit.CLUB}),loot=card(CardType.TAO);
  a.hand=[card(),cost];b.hand=[loot];
  assert.equal(skill('时迁').skill_id,'神偷');assert.equal(active_skills_for_hero(a.hero)[0],skill('时迁'));
  await skill('时迁').player(g,a,b,['1']);assert.deepEqual(a.hand,[a.hand[0],cost],'non-club never pays');
  const hero=b.hero;b.hero=a.hero;await skill('时迁').player(g,a,b,['2']);assert.ok(a.hand.includes(cost),'轻敏 prohibits the target before paying');b.hero=hero;
  b.hand=[];await skill('时迁').player(g,a,b,['2']);assert.ok(a.hand.includes(cost),'empty target never pays');
  b.defensive_horse=new Card('synthetic far horse',CardType.DEFENSIVE_HORSE,{power:9});b.hand=[loot];assert.ok(g.distance_between(a,b)>1);assert.equal(g.can_use_shunshou(a,b),true,'full 飞贼 bypasses distance');
  await skill('时迁').player(g,a,b,['2']);assert.ok(!a.hand.includes(cost));assert.ok(g.deck.discard_pile.includes(cost));assert.equal(a.hand.length,2);assert.equal(g.processing_cards.length,0);
  assert.equal(b.hand.length+(b.defensive_horse?1:0),1,'exactly one target-zone card was acquired');
});

test('archived 飞贼 AI uses canonical 神偷 only with a legal target and spends one club', async () => {
  const {g,a,b}=sourceThiefFixture(true),cost=card(CardType.TAO,{suit:CardSuit.CLUB});a.hand=[card(),cost];
  assert.equal(await skill('时迁').ai(g,a,b),false);b.hand.push(card());
  assert.equal(await skill('时迁').ai(g,a,b),true);assert.ok(!a.hand.includes(cost));assert.ok(g.deck.discard_pile.includes(cost));assert.equal(a.hand.length,2);assert.equal(b.hand.length,0);
  assert.equal(await skill('时迁').ai(g,a,b),false);
});

test('秦始皇 gains two cards at start and asynchronously discards one at end', async () => {
  const a = player('秦始皇', [card()]), g = game(), b = player();
  assert.equal(hook('秦始皇', 'on_turn_start')(g, a, b), 2);
  await hook('秦始皇', 'on_turn_end')(g, a, b); assert.equal(a.hand.length, 0);
  assert.deepEqual(g.calls.at(-1), ['discard', { reason: '集权' }]);
  await hook('秦始皇', 'on_turn_end')(g, a, b); assert.equal(g.discarded.length, 1);
});

test('姜维, 程咬金, 荆轲 and 扁鹊 numeric bonuses remain synchronous', () => {
  const g = game(), a = player('姜维'), b = player('刘邦', [card(), card(), card()]);
  assert.equal(hook('姜维', 'on_turn_start')(g, a, b), 2); a.hand.push(card());
  assert.equal(hook('姜维', 'on_turn_start')(g, a, b), 0);
  a.hp = 2; assert.equal(hook('程咬金', 'on_turn_start')(g, a, b), 2);
  assert.equal(hook('荆轲', 'sha_unavoidable')(g, a, b), true);
  assert.equal(hook('荆轲', 'shans_required_to_dodge')(g, a, b), 2);
  a.hp = 3; assert.equal(hook('荆轲', 'shans_required_to_dodge')(g, a, b), 1);
  assert.equal(hook('扁鹊', 'tao_heal_bonus')(g, a), 1);
});

test('虞姬 prompts until valid and awaits retaliation', async () => {
  const a = player('虞姬'), b = player(), g = game({ choices: ['?', '2'] });
  await hook('虞姬', 'on_damaged')(g, a, 2, b);
  assert.equal(b.hp, 3); assert.equal(g.prompts.length, 2);
  assert.equal(g.calls.at(-1)[3].source, a); assert.match(g.calls.at(-1)[3].message, /舍身反击/);
  assert.deepEqual(g.prompts[0].options, ['摸2张牌', `令${b.name}失去1点血`]);
});

test('虞姬 draws twice when no eligible source or by human choice', async () => {
  const a = player('虞姬'), b = player(), g = game({ choices: ['1'] });
  await hook('虞姬', 'on_damaged')(g, a, 1, null); assert.equal(a.hand.length, 2);
  await hook('虞姬', 'on_damaged')(g, a, 1, a); assert.equal(a.hand.length, 4);
  await hook('虞姬', 'on_damaged')(g, a, 1, b); assert.equal(a.hand.length, 6);
  a.hp = 0; await hook('虞姬', 'on_damaged')(g, a, 1, b); assert.equal(a.hand.length, 6);
});

test('虞姬 AI follows lethal, self-preservation and relative HP choices', async () => {
  const a = player('虞姬', [], true), b = player(), g = game();
  b.hp = 1; await hook('虞姬', 'on_damaged')(g, a, 1, b); assert.equal(b.hp, 0);
  b.hp = 3; a.hp = 2; await hook('虞姬', 'on_damaged')(g, a, 1, b); assert.equal(a.hand.length, 2);
  a.hp = 3; await hook('虞姬', 'on_damaged')(g, a, 1, b); assert.equal(b.hp, 2);
});

test('岳飞 human steal and draw/discard choices await card operations', async () => {
  const loot = card(CardType.SHAN), a = player('岳飞'), b = player('刘邦', [loot, card()]), g = game({ choices: ['x', '1', '2'] });
  await hook('岳飞', 'on_damaged')(g, a, 1, b); assert.equal(a.hand[0], loot);
  await hook('岳飞', 'on_damaged')(g, a, 1, b); assert.equal(a.hand.length, 2); assert.equal(b.hand.length, 0);
  assert.equal(g.discarded.length, 1); assert.equal(g.calls.at(-1)[0], 'remove');
  await hook('岳飞', 'on_damaged')(g, a, 1, a); assert.equal(g.prompts.length, 3);
});

test('岳飞 AI takes a lone card, draws/discards against larger hands and draws against empty sources', async () => {
  const a = player('岳飞', [], true), b = player('刘邦', [card()]), g = game();
  await hook('岳飞', 'on_damaged')(g, a, 1, b); assert.equal(g.calls.at(-1)[0], 'take');
  b.hand.push(card(), card()); await hook('岳飞', 'on_damaged')(g, a, 1, b); assert.equal(g.calls.at(-1)[0], 'remove');
  b.hand = []; await hook('岳飞', 'on_damaged')(g, a, 1, b); assert.equal(g.calls.at(-1)[0], 'draw');
});

test('貂蝉 requires more opposing cards, then honors human draw/discard choices', async () => {
  const a = player('貂蝉'), b = player(), g = game({ choices: ['invalid', '1', '2'] });
  assert.equal(await hook('貂蝉', 'on_turn_start')(g, a, b), 0); assert.equal(g.prompts.length, 0);
  b.hand.push(card(), card(), card());
  await hook('貂蝉', 'on_turn_start')(g, a, b); assert.equal(a.hand.length, 1);
  await hook('貂蝉', 'on_turn_start')(g, a, b); assert.equal(b.hand.length, 2); assert.equal(g.discarded.length, 1);
});

test('貂蝉 AI prefers equipment discard, otherwise draws when low on cards', async () => {
  const a = player('貂蝉', [], true), b = player('刘邦', [card(), card()]), g = game();
  await hook('貂蝉', 'on_turn_start')(g, a, b); assert.equal(g.calls.at(-1)[0], 'draw');
  b.weapon = card(CardType.WEAPON); await hook('貂蝉', 'on_turn_start')(g, a, b); assert.equal(g.calls.at(-1)[0], 'remove');
});

test('花木兰 draws on dodge and only steals after a red judgment', async () => {
  const red = card(CardType.SHA, { color: CardColor.RED }), black = card(), loot = card(CardType.TAO);
  const a = player('花木兰'), b = player('刘邦', [loot]), g = game({ deck: [black, red] });
  await hook('花木兰', 'on_dodge')(g, a); assert.equal(a.hand.length, 1);
  await hook('花木兰', 'on_sha_dodged')(g, a, b); assert.equal(b.hand.length, 1);
  await hook('花木兰', 'on_sha_dodged')(g, a, b); assert.equal(a.hand.at(-1), loot); assert.equal(b.hand.length, 0);
  assert.deepEqual(g.discarded, [black, red]);
  await hook('花木兰', 'on_sha_dodged')(g, a, b); assert.match(g.logs.at(-1), /牌库为空/);
});

test('扁鹊鸩杀 requires a real Tao, supports declining and preserves unspent cards', async () => {
  const a = player('扁鹊', [card(CardType.WINE)]), b = player(), g = game({ confirms: [false] });
  assert.equal(await hook('扁鹊', 'on_opponent_dying')(g, a, b), false); assert.equal(g.prompts.length, 0);
  a.hand.push(card(CardType.TAO)); assert.equal(await hook('扁鹊', 'on_opponent_dying')(g, a, b), false);
  assert.equal(a.hand.length, 2); assert.equal(g.discarded.length, 0);
});

test('扁鹊鸩杀 awaits confirmation/selection and consumes selected Tao', async () => {
  const tao1 = card(CardType.TAO, { name: '桃甲' }), tao2 = card(CardType.TAO, { name: '桃乙' });
  const a = player('扁鹊', [tao1, card(), tao2]), b = player(), g = game({ confirms: [true], choices: ['2'] });
  assert.equal(await hook('扁鹊', 'on_opponent_dying')(g, a, b), true);
  assert.deepEqual(g.discarded, [tao2]); assert.deepEqual(a.hand, [tao1, a.hand[1]]);
  assert.equal(g.prompts[1].player_id, 0); assert.equal(g.prompts[1].options.length, 2);
});

test('扁鹊鸩杀 invalid selection cancels; AI uses the first Tao without prompting', async () => {
  const a = player('扁鹊', [card(CardType.TAO), card(CardType.TAO)]), b = player(), g = game({ confirms: [true], choices: ['0'] });
  assert.equal(await hook('扁鹊', 'on_opponent_dying')(g, a, b), false); assert.equal(a.hand.length, 2);
  a.is_ai = true; assert.equal(await hook('扁鹊', 'on_opponent_dying')(g, a, b), true); assert.equal(a.hand.length, 1);
  assert.equal(g.prompts.length, 2);
});
