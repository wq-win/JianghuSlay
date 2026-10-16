import {printed_card_fields} from '../web/local/card-face-projection.js';
/** Full games through the same LocalMatch commands as the browser, with no
 * engine mutation. Each restore becomes the live game, including suspended
 * target, response, discard and passive-skill prompts.
 *
 * ROUNDS_PER_HERO=4 node scripts/test_expansion_games.mjs
 * Narrow a reproduction with EXPANSION_HEROES=19 EXPANSION_MODES=ai2
 * EXPANSION_CASES=mirror EXPANSION_SEED=123 ROUNDS_PER_HERO=1.
 */
import assert from 'node:assert/strict';
import {CONTENT_PACKS} from '../web/local/content-packs.js';
import {pathToFileURL} from 'node:url';
import {LocalMatch, SAVE_KEY} from '../web/local/session.js';
import {Card, Deck, SeededRNG, JIANGHU_DECK_SIZE, CardType, CardColor, CLASSIC_HEROES, EXPANSION_HEROES, HEROES, canonical_hero_for_source} from '../web/local/models.js';
import {derivedEquipmentMethods,LIUYE_HERO_ID,PILICHE_ID} from '../web/local/derived-equipment.mjs';
import {active_skills_for_hero} from '../web/local/skills.js';
import {ai_choose_card, ai_choose_discard} from '../web/local/ai.js';

const SLOTS = ['weapon', 'armor', 'offensive_horse', 'defensive_horse'];
const increment = (record, key) => { record[key] = (record[key] ?? 0) + 1; };
const list = value => value?.split(',').map(item => item.trim()).filter(Boolean);
const seatPlayer = (game, seat) => ({p1:game.player, p2:game.ai, p3:game.ai2,
  player:game.player, ai:game.ai, ai2:game.ai2})[seat];

export function memoryStorage() {
  const data = new Map();
  return {getItem:key => data.get(key) ?? null, setItem:(key,value) => data.set(key,value),
    removeItem:key => data.delete(key)};
}

function classicSkillArgs(game, actor, target, skill) {
  const find = test => { const index=actor.hand.findIndex(test); return index<0?null:String(index+1); };
  switch (skill.skill_id) {
    case '诗仙': return !actor.shixian_active && game.has_shixian_playable(actor,target) ? '' : null;
    case '霸王': return actor.hp>=3 && actor.bawang_stacks<1 && game.can_use_sha(actor) ? '' : null;
    case '驭人': return !actor.used_active_skills.has('驭人') && actor.hand.length ? String(ai_choose_discard(actor)+1) : null;
    case '女帝': return !target.judgment_mark_pending ? find(card=>card.color===CardColor.RED) : null;
    case '释权': return game.target_has_card(target) ? find(card=>card.color===CardColor.BLACK) : null;
    case '兵仙': return actor.hand.length>=3 ? '1 2 3' : null;
    case '冲阵': return game.can_use_sha(actor) && game.in_attack_range(actor,target) && game.can_sha_target(actor,target)
      ? find(card=>card.type===CardType.SHAN) : null;
    case '换牌': return !actor.used_active_skills.has('换牌') && actor.hand.length<target.hand.length ? 'all' : null;
    case '飞贼': return game.target_has_card(target) && game.can_use_shunshou(actor,target) ? find(card=>card.suit==='梅花') : null;
    default: return null;
  }
}

/** Policy counters are runner state, never added to the serialized engine. */
export function createPolicy(variant=0) {
  return {variant, target:null, playCount:0, turn:null, kurouUses:0, previousPlay:null,
    identicalPlayCount:0};
}

function choosePlay(match, policy, coverage) {
  const game=match.game, actor=game.player;
  const turn=`${game.round_no}:${game.turn_actor}`;
  if (policy.turn!==turn) { policy.turn=turn; policy.kurouUses=0; }
  const state=match.snapshot(); delete state.prompt;
  const signature=JSON.stringify(state);
  policy.identicalPlayCount=signature===policy.previousPlay ? policy.identicalPlayCount+1 : 0;
  policy.previousPlay=signature;
  assert.ok(policy.identicalPlayCount<4, 'human policy repeatedly reached the same play state without progress');
  const enemies=game.alive_enemies(actor);
  assert.ok(enemies.length, 'play prompt requires an enemy');
  // Alternate preferred seats, then validate the action against that exact
  // target before submitting it. The subsequent p2/p3 prompt uses this plan.
  if ((policy.playCount++ + policy.variant)%2===0) enemies.reverse();
  const plan=(command,target,skill=null,zone=null) => {
    policy.target=game.seat_of(target);
    if (skill) {
      increment(coverage.humanActiveSkills,skill);
      increment(coverage.humanActiveHeroSkills??={},`${actor.hero.id}:${skill}`);
    }
    if (zone) increment(coverage.materialCosts,`${skill}:${zone}`);
    return command;
  };

  // Half of the policies equip first so equipped conversion costs are reached
  // naturally rather than injecting cards or editing equipment slots.
  if (policy.variant%2===0 && !actor.shixian_active) {
    const index=game.find_better_equipment(actor);
    if (index!==null && game.can_play(actor,enemies[0],actor.hand[index])) return plan(String(index+1),enemies[0]);
  }
  // Source-defined skills own their complete target picker. Its callbacks, not
  // a same-named original skill, decide legal targets and material zones.
  for (const skill of active_skills_for_hero(actor.hero).filter(skill=>skill.owns_target_selection)) {
    if (!skill.available?.(game,actor)||typeof skill.targets!=='function') continue;
    const targets=skill.targets(game,actor).filter(target=>skill.available(game,actor,target));
    const target=skill.skill_id==='疗伤'
      ? (targets.includes(actor)?actor:targets.find(candidate=>game.side_of(candidate)===game.side_of(actor)))
      : enemies.find(enemy=>targets.includes(enemy))??targets[0];
    if (!target) continue;
    if (['攻心','驭人','疗伤','魅惑','神偷','红颜','奸雄'].includes(skill.skill_id)) return plan(skill.hotkey,target,skill.skill_id);
    if (skill.skill_id==='傲剑') {
      const materials=game.skill_material_options(actor,{color:CardColor.RED}).filter(material=>game.can_convert_material_to_sha(actor,target,material));
      materials.sort((a,b)=>policy.variant%2===0?Number(a.zone==='hand')-Number(b.zone==='hand')||game.material_ai_cost(a)-game.material_ai_cost(b):game.material_ai_cost(a)-game.material_ai_cost(b));
      const material=materials[0];
      if(material)return plan(`${skill.hotkey} ${game.material_command_args(material).join(' ')}`,target,skill.skill_id,material.zone==='hand'?'hand':'equipment');
    }
    if (skill.skill_id==='释权') {
      const materials=game.skill_material_options(actor,{color:CardColor.BLACK});
      materials.sort((a,b)=>policy.variant%2===0
        ? Number(a.zone==='hand')-Number(b.zone==='hand')||game.material_ai_cost(a)-game.material_ai_cost(b)
        : game.material_ai_cost(a)-game.material_ai_cost(b));
      const material=materials[0];
      if (material) {
        policy.material=material.id;
        // Exercise both explicit material arguments and the suspended picker.
        const command=policy.playCount%2===0?skill.hotkey:`${skill.hotkey} ${game.material_command_args(material).join(' ')}`;
        return plan(command,target,skill.skill_id,material.zone==='hand'?'hand':'equipment');
      }
    }
  }
  for (const target of enemies) for (const skill of active_skills_for_hero(actor.hero).filter(skill=>!skill.owns_target_selection)) {
    if (skill.available && !skill.available(game,actor,target)) continue;
    if (skill.skill_id==='武圣' || skill.skill_id==='奇袭') {
      const color=skill.skill_id==='武圣' ? CardColor.RED : CardColor.BLACK;
      const materials=game.skill_material_options(actor,{color}).filter(material =>
        skill.skill_id!=='武圣' || game.can_convert_material_to_sha(actor,target,material));
      materials.sort((a,b) => policy.variant%2===0
        ? Number(a.zone==='hand')-Number(b.zone==='hand') || game.material_ai_cost(a)-game.material_ai_cost(b)
        : game.material_ai_cost(a)-game.material_ai_cost(b));
      const material=materials[0];
      if (material) return plan(`${skill.hotkey} ${game.material_command_args(material).join(' ')}`,
        target,skill.skill_id,material.zone==='hand'?'hand':'equipment');
    } else if (skill.skill_id==='苦肉') {
      // A conservative human policy, not a limitation imposed on the skill.
      if (actor.hp>2 && policy.kurouUses<2) {
        policy.kurouUses++;
        return plan(skill.hotkey,target,skill.skill_id);
      }
    } else {
      const args=classicSkillArgs(game,actor,target,skill);
      if (args!==null) return plan(`${skill.hotkey} ${args}`.trim(),target,skill.skill_id);
    }
  }
  for (const target of enemies) {
    // Printed non-target cards are dispatched against the default foe, even
    // when a classic conversion changes their effect. Do not invent a p3
    // selector that the public command does not actually expose.
    const publicTarget=card=>game.card_needs_enemy_target(card)?target:game.default_foe(actor);
    const canSubmit=card=>game.can_play(actor,publicTarget(card),card);
    const preferred=ai_choose_card(game,actor,target);
    if (preferred!==null && canSubmit(actor.hand[preferred])) return plan(String(preferred+1),publicTarget(actor.hand[preferred]));
    const index=actor.hand.findIndex(canSubmit);
    if (index>=0) return plan(String(index+1),publicTarget(actor.hand[index]));
    if (actor.shixian_active) for (const slot of SLOTS) {
      if (game.can_use_equipment_as_sha(actor,target,slot)) return plan(`eq ${slot}`,target);
    }
    if (actor.weapon?.trait==='two_as_sha' && actor.hand.length>=2 && game.can_use_sha(actor)
      && game.in_attack_range(actor,target) && game.can_sha_target(actor,target)) return plan('sha 1 2',target);
  }
  return '0';
}

export function chooseCommand(match, policy, coverage) {
  const prompt=match.pending.prompt, game=match.game;
  const actor=seatPlayer(game,prompt.player_id);
  assert.ok(actor, `unknown prompt owner ${prompt.player_id}`);
  increment(coverage.promptKinds,prompt.kind);
  increment(coverage.promptSeats,prompt.player_id);
  if (prompt.kind==='play_card') return choosePlay(match,policy,coverage);
  if (prompt.meta.skill==='起义' && prompt.meta.stage==='qiyi_targets'
    && !prompt.meta.selected_seats.length && game.round_no%3===0) return 'cancel';
  if (prompt.meta.stage==='shiquan_material' && prompt.options.some(option=>option.id===policy.material)) return policy.material;
  if (prompt.kind==='discard') {
    // Ganglie's discard belongs to its damage source; never assume p1 here.
    const source=seatPlayer(game,prompt.meta.source_seat ?? prompt.meta.owner_seat ?? prompt.player_id);
    assert.ok(source?.hand.length, 'discard prompt requires a source hand');
    return String(ai_choose_discard(source)+1);
  }
  if(prompt.kind==='choice'&&prompt.meta.select_count)return prompt.options.filter(o=>!['cancel','0','pass'].includes(o.id)).slice(0,prompt.meta.select_count).map(o=>o.id).join(prompt.meta.submit_join??' ');
  if (prompt.kind==='select_hand') {
    const owner=seatPlayer(game,prompt.meta.owner_seat ?? prompt.player_id);
    assert.ok(owner && owner.hand.length>=prompt.min_count, 'selection must fit its owner hand');
    return Array.from({length:prompt.min_count},(_,index)=>String(index+1)).join(' ');
  }
  if (prompt.kind==='confirm') {
    for (const skill of ['裸衣','克己','复仇','集智']) {
      if (prompt.message.startsWith(`${skill}：`)) increment(coverage.passiveConfirmations,skill);
    }
    return 'y';
  }
  if (prompt.kind==='choice' && prompt.options.length && prompt.options.every(option=>/^p[123]$/.test(option.id))) {
    assert.ok(prompt.options.some(option=>option.id===policy.target), `planned target ${policy.target} is unavailable`);
    increment(coverage.targetSelections,policy.target);
    return policy.target;
  }
  if (prompt.kind==='choice' && prompt.options.some(option=>option.id==='discard')
    && prompt.options.some(option=>option.id==='damage')) {
    const choice=actor.hand.length>=2 && (actor.hp<=2 || actor.hand.length>=4) ? 'discard' : 'damage';
    increment(coverage.ganglieChoices,choice);
    return choice;
  }
  if (prompt.kind==='choice' && prompt.meta.material_zones) {
    let options=prompt.options.filter(option=>option.id!=='cancel');
    if (policy.variant%2===0) options=[...options.filter(o=>o.id.startsWith('eq:')), ...options.filter(o=>!o.id.startsWith('eq:'))];
    assert.ok(options.length, 'material prompt requires legal options');
    if (prompt.meta.response_type) increment(coverage.responseMaterials,options[0].id.startsWith('eq:')?'equipment':'hand');
    return options[0].id;
  }
  const choice=prompt.options.find(option=>!['0','cancel'].includes(option.id));
  assert.ok(choice, `unhandled prompt: ${JSON.stringify(prompt)}`);
  return choice.id;
}

function newCoverage() {
  return {completed:0,actions:0,verifiedRestores:0,finalRestores:0,duplicateRejections:0,
    maxRounds:0,maxPrompts:0,winners:{player:0,ai:0},promptKinds:{},promptSeats:{},
    targetSelections:{},humanActiveSkills:{},passiveConfirmations:{},materialCosts:{},
    responseMaterials:{},ganglieChoices:{},restoredBoundaries:{},restoredSkillState:{},
    heroSeats:{},cases:{},modes:{}};
}

function boundaryTag(match) {
  const prompt=match.pending?.prompt;
  if (!prompt) return 'finished';
  if (prompt.meta.response_type) return `response-material:${prompt.meta.response_type}`;
  if (prompt.kind==='choice' && prompt.options.length && prompt.options.every(option=>/^p[123]$/.test(option.id))) return 'enemy-target';
  for (const skill of ['裸衣','克己','复仇','集智']) {
    if (prompt.message.startsWith(`${skill}：`)) return `${skill}:${prompt.kind}`;
  }
  return prompt.kind;
}

/** Build the physical baseline independently of the observed live zones.
 * A Liu Ye seat plans one deterministic reserve entity, even in a mirror.
 * The derived card is not a normal deck card and allocation consumes no RNG. */
export function expectedPhysicalCards(seed, {content_packs=[],hero_ids=[]}={}) {
  const cards=new Deck(new SeededRNG(seed),null,{content_packs}).draw_pile.slice();
  const hasLiuYe=hero_ids.includes(LIUYE_HERO_ID);
  assert.equal(cards.length,JIANGHU_DECK_SIZE+CONTENT_PACKS.filter(p=>content_packs.includes(p.id)).reduce((n,p)=>n+p.added_cards,0));
  assert.equal(cards.some(card=>card.equipment_id===PILICHE_ID),false,'ordinary deck never allocates derived gear');
  if(hasLiuYe){
    const reserve={offboard_cards:[],derived_equipment_initialized:false};
    const derived=derivedEquipmentMethods.initialize_derived_equipment.call(reserve,Card);
    assert.equal(reserve.offboard_cards.length,1);
    assert.equal(derived.equipment_id,PILICHE_ID);
    assert.equal(derived.derived_identity,'derived:sgs_piliche:1');
    assert.equal(derived.source_hero_id,LIUYE_HERO_ID);
    assert.equal(derived.source_skill,'破橹');
    assert.equal(derived.virtual,undefined);
    cards.push(derived);
  }
  assert.equal(cards.filter(card=>card.equipment_id===PILICHE_ID).length,hasLiuYe?1:0);
  return cards;
}

export function cardMultiset(game) {
  return [...game.deck.draw_pile,...game.deck.discard_pile,...(game.processing_cards??[]),...(game.offboard_cards??[]),
    ...game.all_players().flatMap(player=>[...player.hand,...(player.judgment_cards??[]),...SLOTS.map(slot=>player[slot]).filter(Boolean)])]
    .map(card=>JSON.stringify(printed_card_fields(card))).sort();
}

function assertBoundary(match, config) {
  const game=match.game;
  assert.equal(game.player.hero.id,HEROES[config.hero_index].id);
  assert.equal(game.ai.hero.id,HEROES[config.ai_hero_index].id);
  assert.equal(game.ai2?.hero.id ?? null,config.mode==='ai2'?HEROES[config.ai2_hero_index].id:null);
  for (const player of game.all_players()) {
    assert.ok(Number.isInteger(player.hp) && player.hp<=player.hero.max_hp, 'health stays integer and below maximum');
    assert.ok(player.used_active_skills instanceof Set, 'skill-use state remains a Set after replay');
    assert.ok(player.hand.every(Boolean), 'no undefined cards in a hand');
  }
  if (game.winner) {
    assert.equal(match.pending,null, 'terminal match has no prompt');
    assert.equal(game.turn_phase,'finished');
    assert.equal(game.winner,game.player.alive?'player':'ai');
    assert.equal(game.match_should_continue(),false, 'terminal winner reflects the live seats');
  } else assert.ok(match.pending, 'every nonterminal boundary supplies a prompt');
}

export async function runCase(testCase, coverage=newCoverage(), {restoreEvery=13,maxActions=4000}={}) {
  const {config,label,variant}=testCase;
  const storage=memoryStorage(), errors=[], policy=createPolicy(variant), history=[], restoredTags=new Set();
  const makeMatch=()=>new LocalMatch({storage,onError:error=>errors.push(String(error))});
  let match=makeMatch(), actions=0;
  const restore=async terminal => {
    const before=match.snapshot(), journal=match.exportSave(), previous=match, replica=makeMatch();
    try {
      assert.equal(await replica.resume(),true, 'saved journal resumes successfully');
      assert.deepEqual(replica.snapshot(),before, 'full hidden hands/decks/RNG/flags/prompt replay equality');
      assert.deepEqual(replica.exportSave().actions,journal.actions, 'resume preserves acknowledged command journal');
      assert.deepEqual(replica.exportSave().config,journal.config, 'resume preserves explicit hero seat configuration');
      previous.close(); match=replica;
      coverage.verifiedRestores++;
      const tag=boundaryTag(match);
      restoredTags.add(tag); increment(coverage.restoredBoundaries,tag);
      for (const player of match.game.all_players()) for (const flag of ['luoyi_active','sha_activity_in_own_play']) {
        if (player[flag]) increment(coverage.restoredSkillState,flag);
      }
      if (terminal) coverage.finalRestores++;
    } catch (error) { replica.close(); throw error; }
  };
  try {
    await match.create(config);
    assertBoundary(match,config);
    const originalCards=expectedPhysicalCards(config.seed,{content_packs:config.content_packs??[],hero_ids:match.game.all_players().map(player=>player.hero.id)}).map(card=>JSON.stringify(printed_card_fields(card))).sort();
    assert.deepEqual(cardMultiset(match.game),originalCards,'initialized match contains only the planned deck and unique derived reserve');
    await restore(false);
    while (match.pending) {
      assert.ok(actions<maxActions, `match did not finish within ${maxActions} prompts`);
      // In addition to periodic checkpoints, resume the first appearance of
      // each distinct pending operation so suspended inner skill calls count.
      if (!restoredTags.has(boundaryTag(match))) await restore(false);
      const prompt=match.pending.prompt;
      const command=chooseCommand(match,policy,coverage);
      history.push({number:actions+1,round:match.game.round_no,turn:match.game.turn_actor,
        phase:match.game.turn_phase,kind:prompt.kind,player:prompt.player_id,message:prompt.message,command});
      if (history.length>24) history.shift();
      const response=match.respond(prompt.prompt_id,command);
      if (actions%17===0) {
        assert.equal(await match.respond(prompt.prompt_id,command),false,'duplicate/stale command is rejected');
        coverage.duplicateRejections++;
      }
      assert.equal(await response,true, 'public command is acknowledged');
      actions++; coverage.actions++;
      assert.equal(errors.length,0, `runtime errors: ${errors.join('; ')}`);
      assertBoundary(match,config);
      if (match.pending && actions%restoreEvery===0) await restore(false);
    }
    assert.ok(match.game.winner, 'game reaches a winner');
    assert.deepEqual(cardMultiset(match.game),originalCards,'full game conserves every physical card');
    await restore(true);
    assert.equal(await match.completion,match.game.winner,'final replay settles with the same winner');
    assertBoundary(match,config);
    assert.equal(errors.length,0,`runtime errors: ${errors.join('; ')}`);
    assert.ok(storage.getItem(SAVE_KEY),'final state remains saved');
    coverage.completed++;
    increment(coverage.winners,match.game.winner);
    increment(coverage.cases,label);
    increment(coverage.modes,config.mode);
    for (const player of match.game.all_players()) {
      if (EXPANSION_HEROES.some(hero=>canonical_hero_for_source(hero.id).id===player.hero.id)) increment(coverage.heroSeats,
        `${player.hero.id}:${config.mode}:${match.game.seat_of(player)}`);
    }
    coverage.maxRounds=Math.max(coverage.maxRounds,match.game.round_no);
    coverage.maxPrompts=Math.max(coverage.maxPrompts,actions);
    return {label,config,actions,winner:match.game.winner,rounds:match.game.round_no};
  } catch (error) {
    const reproduction={label,config,variant,actions,errors,recentActions:history,
      currentPrompt:match.pending?.prompt ?? null,round:match.game?.round_no};
    throw new Error(`${error.message}\nReproduction: ${JSON.stringify(reproduction,null,2)}`,{cause:error});
  } finally { match.close(); }
}

export function buildCases({rounds=4,heroFilter=null,modeFilter=null,caseFilter=null,seed=null}={}) {
  const cases=[];
  assert.equal(EXPANSION_HEROES.length,8,'expected the approved eight-hero expansion');
  for (let modeIndex=0;modeIndex<2;modeIndex++) {
    const mode=['ai','ai2'][modeIndex];
    if (modeFilter && !modeFilter.includes(mode)) continue;
    for (const [ordinal,hero] of EXPANSION_HEROES.entries()) {
      const heroIndex=HEROES.indexOf(canonical_hero_for_source(hero.id));
      assert.ok(heroIndex>=0,'archived source resolves to a selectable canonical hero');
      if (heroFilter && !heroFilter.some(value=>[String(heroIndex),hero.name,hero.id].includes(value))) continue;
      for (let iteration=0;iteration<rounds;iteration++) {
        const oldOrdinal=(ordinal+iteration*7)%CLASSIC_HEROES.length;
        const old=HEROES.indexOf(canonical_hero_for_source(CLASSIC_HEROES[oldOrdinal].id));
        const old2=HEROES.indexOf(canonical_hero_for_source(CLASSIC_HEROES[(oldOrdinal+5)%CLASSIC_HEROES.length].id));
        assert.ok(old>=0&&old2>=0,'classic archive IDs resolve through canonical selection');
        const next=HEROES.indexOf(canonical_hero_for_source(EXPANSION_HEROES[(ordinal+1)%EXPANSION_HEROES.length].id));
        const next2=HEROES.indexOf(canonical_hero_for_source(EXPANSION_HEROES[(ordinal+2)%EXPANSION_HEROES.length].id));
        const variants=[['human-classic',heroIndex,old,old2],['human-expansion',heroIndex,next,next2],
          ['ai-p2',old,heroIndex,next],['mirror',heroIndex,heroIndex,old],
          ...(mode==='ai2'?[['ai-p3',old,old2,heroIndex]]:[])];
        for (const [caseIndex,[label,human,ai,ai2]] of variants.entries()) {
          if (caseFilter && !caseFilter.includes(label)) continue;
          cases.push({label,variant:ordinal+iteration+caseIndex,config:{hero_index:human,mode,
            ai_hero_index:ai,ai2_hero_index:mode==='ai2'?ai2:null,
            seed:seed ?? (100000+modeIndex*1000000+ordinal*10000+iteration*101+caseIndex*17)}});
        }
      }
    }
  }
  assert.ok(cases.length,'filters must select at least one case');
  return cases;
}

async function main() {
  const rounds=Number(process.env.ROUNDS_PER_HERO ?? 4);
  assert.ok(Number.isInteger(rounds) && rounds>0,'ROUNDS_PER_HERO must be a positive integer');
  const options={rounds,heroFilter:list(process.env.EXPANSION_HEROES),modeFilter:list(process.env.EXPANSION_MODES),
    caseFilter:list(process.env.EXPANSION_CASES),seed:process.env.EXPANSION_SEED===undefined?null:Number(process.env.EXPANSION_SEED)};
  if (options.seed!==null) assert.ok(Number.isInteger(options.seed) && options.seed>=0 && options.seed<=0xffffffff,'EXPANSION_SEED must be uint32');
  const coverage=newCoverage(), started=Date.now(), cases=buildCases(options);
  for (const testCase of cases) {
    const result=await runCase(testCase,coverage);
    if (process.env.EXPANSION_VERBOSE==='1') console.error(JSON.stringify(result));
  }
  if (!options.heroFilter && !options.modeFilter && !options.caseFilter) {
    for (const hero of EXPANSION_HEROES) for (const mode of ['ai','ai2']) {
      for (const seat of mode==='ai2'?['p1','p2','p3']:['p1','p2']) {
        assert.ok(coverage.heroSeats[`${canonical_hero_for_source(hero.id).id}:${mode}:${seat}`]>0,`${hero.name}/${mode}/${seat} was covered`);
      }
    }
    assert.ok(coverage.targetSelections.p3>0,'explicit second-AI target choices were exercised');
    if (rounds>=4) {
      for (const skill of ['傲剑','释权']) for (const zone of ['hand','equipment']) {
        assert.ok(coverage.materialCosts[`${skill}:${zone}`]>0,`${skill} used ${zone} costs`);
      }
      for (const skill of ['裸衣','克己','复仇','集智']) {
        assert.ok(coverage.passiveConfirmations[skill]>0,`${skill} had human confirmation coverage`);
        assert.ok(coverage.restoredBoundaries[`${skill}:confirm`]>0,`${skill} had suspended-prompt replay coverage`);
      }
      for (const choice of ['damage','discard']) assert.ok(coverage.ganglieChoices[choice]>0,`Ganglie ${choice} choice was exercised`);
    }
  }
  assert.equal(coverage.finalRestores,coverage.completed,'every complete game verifies its terminal save');
  console.log(JSON.stringify({...coverage,elapsedMs:Date.now()-started}));
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  await main();
}
