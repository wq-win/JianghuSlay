import {physicalCards,expectedNativeVehicles} from './game-physical-accounting.mjs';
import {printed_card_fields} from '../web/local/card-face-projection.js';
/** Complete, naturally dealt games through the browser's public LocalMatch API.
 * No fixture injection, monkey-patching, health edits or forced winner is used.
 * Every acknowledged answer is journaled; resumed matches replace live matches.
 *
 * ROUNDS_PER_HERO=4 node scripts/test_second_four_games.mjs
 * Narrow a reproduction with SECOND_FOUR_HEROES=赵云 SECOND_FOUR_MODES=ai2
 * SECOND_FOUR_CASES=mirror SECOND_FOUR_SEED=123 ROUNDS_PER_HERO=1.
 */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {LocalMatch, SAVE_KEY} from '../web/local/session.js';
import {CardType, CardSuit, Deck, SeededRNG, CLASSIC_HEROES, EXPANSION_HEROES,
  SECOND_FOUR_HEROES, HEROES, canonical_hero_for_source, is_sha_card} from '../web/local/models.js';
import {active_skills_for_hero} from '../web/local/skills.js';
import {memoryStorage, createPolicy, expectedPhysicalCards, chooseCommand as chooseEarlierCommand} from './test_expansion_games.mjs';

const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const NEW_NAMES=['赵云','马超','周瑜','诸葛亮'];
const PASSIVES=['铁骑','英姿','占卜'];
const increment=(record,key)=>{record[key]=(record[key]??0)+1;};
const list=value=>value?.split(',').map(item=>item.trim()).filter(Boolean);
const stringifyCards=cards=>cards.map(card=>JSON.stringify(printed_card_fields(card))).sort();
const skillOf=prompt=>prompt.meta.skill??PASSIVES.find(skill=>prompt.message.startsWith(`${skill}：`));
const guanxingIds=prompt=>[...new Set(prompt.options.filter(option=>/^(top|bottom):/.test(option.id))
  .map(option=>option.id.slice(option.id.indexOf(':')+1)))];

export function newCoverage() {
  return {planned:0,completed:0,actions:0,verifiedRestores:0,finalRestores:0,importedFinalReplays:0,
    duplicateRejections:0,conservationChecks:0,maxRounds:0,maxPrompts:0,winners:{player:0,ai:0},
    promptKinds:{},promptSeats:{},targetSelections:{},humanActiveSkills:{},passiveConfirmations:{},
    materialCosts:{},responseMaterials:{},responseConversions:{},ganglieChoices:{},restoredBoundaries:{},restoredSkillState:{},
    actionStages:{},phaseActions:{},vehicleChoices:{},vehicleCommits:{},vehicleEntities:{},vehicleForgeGained:0,vehicleDurabilitySpent:0,maxPlayPhases:0,
    heroSeats:{},cases:{},modes:{},optionalAnswers:{},fanjianSuits:{},guanxingDestinations:{},
    guanxingOrders:{},guanxingRemaining:{},guanxingCancels:0,skillEvents:{},results:[]};
}

/** A human command policy, using only legal public commands and visible choices. */
export function chooseCommand(match,policy,coverage) {
  const game=match.game, prompt=match.pending.prompt, skill=skillOf(prompt);
  const recordPrompt=()=>{increment(coverage.promptKinds,prompt.kind);increment(coverage.promptSeats,prompt.player_id);};
  if(prompt.kind==='play_card') {
    const actor=game.player;
    const enemies=game.alive_enemies(actor);
    if((policy.playCount+policy.variant)%2===0)enemies.reverse();
    for(const target of enemies)for(const active of active_skills_for_hero(actor.hero)) {
      if(!['龙胆','武穆','反间'].includes(active.skill_id))continue;
      if(active.available&&!active.available(game,actor,target))continue;
      let command=null;
      if(['龙胆','武穆'].includes(active.skill_id)&&game.can_use_sha(actor)&&game.can_sha_target(actor,target)
        &&game.in_attack_range(actor,target)) {
        const index=actor.hand.findIndex(card=>card.type===CardType.SHAN);
        if(index>=0)command=policy.variant%2===0?`${active.hotkey} ${index+1}`:active.hotkey;
      }
      if(active.skill_id==='反间'&&actor.hand.length&&!actor.used_active_skills.has('反间'))command=active.hotkey;
      if(command!==null) {
        recordPrompt();policy.target=game.seat_of(target);policy.playCount++;
        increment(coverage.humanActiveSkills,active.skill_id);
        return command;
      }
    }
  }
  if(prompt.kind==='choice'&&prompt.meta?.select_count)return chooseEarlierCommand(match,policy,coverage);
  if(prompt.kind==='choice'&&prompt.options.some(option=>/^p[123]$/.test(option.id))
    &&prompt.options.every(option=>/^p[123]$/.test(option.id)||option.id==='cancel')) {
    recordPrompt();
    // A nested new-card target window (e.g. borrowed sword's victim) has its own legal seats.
    const target=prompt.options.some(option=>option.id===policy.target)?policy.target:prompt.meta?.stage?prompt.options.find(option=>/^p[123]$/.test(option.id))?.id:policy.target;
    assert.ok(prompt.options.some(option=>option.id===target),`planned target ${target} is unavailable`);
    increment(coverage.targetSelections,target);
    return target;
  }
  if(prompt.kind==='choice'&&['龙胆','武穆'].includes(skill)&&prompt.meta.response_type) {
    recordPrompt();
    const actor=({p1:game.player,p2:game.ai,p3:game.ai2})[prompt.player_id];
    assert.ok(actor,'Longdan response has a known owner');
    const type=prompt.meta.response_type;
    const materials=game.response_material_options(actor,type);
    const converted=materials.find(material=>type===CardType.SHA?material.card.type===CardType.SHAN:is_sha_card(material.card));
    const chosen=converted??materials[0];
    assert.ok(chosen&&prompt.options.some(option=>option.id===chosen.id),'Longdan response has a visible legal material');
    increment(coverage.responseMaterials,chosen.zone==='hand'?'hand':'equipment');
    if(converted)increment(coverage.responseConversions,`${converted.card.type}->${type}`);
    return chosen.id;
  }
  if(prompt.kind==='confirm'&&PASSIVES.includes(skill)) {
    recordPrompt();increment(coverage.passiveConfirmations,skill);
    const number=policy.optionalCounts[skill]??0;policy.optionalCounts[skill]=number+1;
    // Exercise accepting and declining optional skills without ever making a
    // match stop early. The first occurrence always exercises the skill body.
    const answer=number>0&&(number+policy.variant)%5===0?'n':'y';
    increment(coverage.optionalAnswers,`${skill}:${answer}`);
    return answer;
  }
  if(prompt.kind==='choice'&&skill==='反间') {
    recordPrompt();
    const suits=Object.values(CardSuit);
    assert.equal(prompt.options.length,4,'Fanjian exposes all four suit choices');
    assert.deepEqual(new Set(prompt.options.map(option=>option.id)),new Set(suits));
    // Guess without inspecting the source's hidden cards or random state.
    const suit=suits[(policy.variant+policy.fanjianCount++)%suits.length];
    increment(coverage.fanjianSuits,suit);
    return suit;
  }
  if(prompt.kind==='choice'&&['观星','占卜'].includes(skill)) {
    recordPrompt();
    const ids=guanxingIds(prompt);
    assert.ok(ids.length>0,'Guanxing exposes remaining physical card choices');
    assert.equal(prompt.options.filter(option=>option.id!=='cancel').length,ids.length*2,'Every remaining card can go to top or bottom');
    assert.deepEqual(new Set(prompt.meta.remaining),new Set(ids),'remaining metadata agrees with public choice IDs');
    assert.equal(prompt.meta.private_to,prompt.player_id,'Guanxing preview is scoped to the chooser');
    const placed=[...prompt.meta.top,...prompt.meta.bottom];
    assert.equal(new Set([...ids,...placed]).size,ids.length+placed.length,'Guanxing placement IDs are unique');
    assert.deepEqual(new Set([...ids,...placed]),new Set(prompt.meta.preview.map(card=>card.id)),'every preview card is either pending or placed');
    if(policy.variant%7===0&&placed.length&&prompt.options.some(option=>option.id==='cancel')) {
      coverage.guanxingCancels++;return 'cancel';
    }
    for(const id of ids)for(const destination of ['top','bottom']) {
      assert.ok(prompt.options.some(option=>option.id===`${destination}:${id}`));
    }
    const mode=policy.variant%3;
    const destination=mode===0?'top':mode===1?'bottom':policy.guanxingCount%2?'bottom':'top';
    const index=(policy.variant+policy.guanxingCount++)%ids.length;
    const command=`${destination}:${ids[index]}`;
    increment(coverage.guanxingDestinations,destination);
    increment(coverage.guanxingOrders,index===0?'first':'nonfirst');
    increment(coverage.guanxingRemaining,String(ids.length));
    return command;
  }
  return chooseEarlierCommand(match,policy,coverage);
}

export function boundaryTag(match) {
  const prompt=match.pending?.prompt;
  if(!prompt)return 'finished';
  const skill=skillOf(prompt);
  if(['观星','占卜'].includes(skill)&&prompt.kind==='choice')return `观星:choice:${guanxingIds(prompt).length}-remaining`;
  if(prompt.meta.response_type)return `${skill??'card'}:response-material:${prompt.meta.response_type}`;
  if(skill)return `${skill}:${prompt.kind}`;
  if(prompt.kind==='choice'&&prompt.options.length&&prompt.options.some(option=>/^p[123]$/.test(option.id))
    &&prompt.options.every(option=>/^p[123]$/.test(option.id)||option.id==='cancel'))return 'enemy-target';
  for(const previous of ['裸衣','克己','复仇','集智'])if(prompt.message.startsWith(`${previous}：`))return `${previous}:${prompt.kind}`;
  return prompt.kind;
}

export function cardMultiset(game) {return stringifyCards(physicalCards(game));}

function assertBoundary(match,config) {
  const game=match.game;
  assert.equal(game.player.hero.id,HEROES[config.hero_index].id);
  assert.equal(game.ai.hero.id,HEROES[config.ai_hero_index].id);
  assert.equal(game.ai2?.hero.id??null,config.mode==='ai2'?HEROES[config.ai2_hero_index].id:null);
  for(const player of game.all_players()) {
    assert.ok(Number.isInteger(player.hp)&&player.hp<=player.hero.max_hp,'health remains an integer below its maximum');
    assert.ok(player.used_active_skills instanceof Set,'skill-use state remains a Set after replay');
    assert.ok(player.hand.every(Boolean),'hands never contain undefined cards');
  }
  if(game.winner) {
    assert.equal(match.pending,null,'terminal match has no prompt');
    assert.equal(game.turn_phase,'finished');
    assert.equal(game.winner,game.player.alive?'player':'ai');
    assert.equal(game.match_should_continue(),false,'winner is backed by surviving seats');
  }else assert.ok(match.pending,'every nonterminal boundary must have a prompt');
}

export async function runCase(testCase,coverage=newCoverage(),{restoreEvery=13,maxActions=4000}={}) {
  const {config,label,variant}=testCase;
  const storage=memoryStorage(),errors=[],history=[],restoredTags=new Set();
  const policy={...createPolicy(variant),optionalCounts:{},fanjianCount:0,guanxingCount:0};
  let initialCards;
  const makeMatch=(targetStorage=storage)=>new LocalMatch({storage:targetStorage,onError:error=>errors.push(String(error)),
    onMessage:message=>{
      // Replayed events are suppressed by LocalMatch, so count only live events.
      if(message.type==='event')for(const skill of ['龙胆','铁骑','英姿','反间','观星']) {
        if(message.event.message.includes(skill)&&!message.event.message.includes('选择了'))increment(coverage.skillEvents,skill);
      }
    }});
  let match=makeMatch(),actions=0,previousSignature=null,identicalCount=0;
  const checkCards=()=>{
    // The explicit processing zone retains resolving physical scrolls while
    // inner prompts are suspended. All physical cards must be accounted for at
    // every boundary, including partially arranged Guanxing and reaction chains.
    assert.deepEqual(cardMultiset(match.game),[...initialCards,...stringifyCards(expectedNativeVehicles(match.game))].sort(),'every original physical card is conserved at this boundary');
    coverage.conservationChecks++;
  };
  const restore=async terminal=>{
    const before=match.snapshot(),journal=match.exportSave(),previous=match,replica=makeMatch();
    try {
      assert.equal(await replica.resume(),true,'saved public-command journal resumes');
      assert.deepEqual(replica.snapshot(),before,'full hidden hands/decks/RNG/flags and suspended prompt replay identically');
      assert.deepEqual(replica.exportSave().actions,journal.actions,'resume preserves every acknowledged command');
      assert.deepEqual(replica.exportSave().config,journal.config,'resume preserves explicit hero seats');
      previous.close();match=replica;coverage.verifiedRestores++;
      const tag=boundaryTag(match);restoredTags.add(tag);increment(coverage.restoredBoundaries,tag);
      for(const player of match.game.all_players())for(const flag of ['luoyi_active','sha_activity_in_own_play']) {
        if(player[flag])increment(coverage.restoredSkillState,flag);
      }
      for(const player of match.game.all_players())for(const used of player.used_active_skills) {
        increment(coverage.restoredSkillState,`used:${used}`);
      }
      if(terminal)coverage.finalRestores++;
      checkCards();
    }catch(error){replica.close();throw error;}
  };
  try {
    await match.create(config);assertBoundary(match,config);initialCards=stringifyCards(expectedPhysicalCards(config.seed,{content_packs:config.content_packs??[],hero_ids:match.game.all_players().map(player=>player.hero.id)}));checkCards();await restore(false);
    while(match.pending) {
      assert.ok(actions<maxActions,`game did not reach a winner within ${maxActions} prompts`);
      if(!restoredTags.has(boundaryTag(match)))await restore(false);
      const prompt=match.pending.prompt;
      const stable=match.snapshot();stable.prompt={...stable.prompt,prompt_id:undefined};
      const signature=JSON.stringify(stable);
      identicalCount=signature===previousSignature?identicalCount+1:0;previousSignature=signature;
      assert.ok(identicalCount<4,'command policy repeatedly reached identical state without progress');
      const command=chooseCommand(match,policy,coverage);
      history.push({number:actions+1,round:match.game.round_no,turn:match.game.turn_actor,
        phase:match.game.turn_phase,kind:prompt.kind,player:prompt.player_id,message:prompt.message,
        meta:prompt.meta,command});
      if(history.length>24)history.shift();
      const response=match.respond(prompt.prompt_id,command);
      if(actions%17===0) {
        assert.equal(await match.respond(prompt.prompt_id,command),false,'duplicate/stale command must be rejected');
        coverage.duplicateRejections++;
      }
      assert.equal(await response,true,'public command must be acknowledged');
      actions++;coverage.actions++;
      assert.equal(errors.length,0,`runtime errors: ${errors.join('; ')}`);
      assert.equal(match.exportSave().actions.length,actions,'one journal entry per acknowledged command');
      assertBoundary(match,config);checkCards();
      if(match.pending&&actions%restoreEvery===0)await restore(false);
    }
    assert.ok(match.game.winner,'complete game reaches an actual winner');
    assert.deepEqual(cardMultiset(match.game),[...initialCards,...stringifyCards(expectedNativeVehicles(match.game))].sort(),'terminal game conserves the total original physical card multiset');
    await restore(true);
    assert.equal(await match.completion,match.game.winner,'terminal replay resolves with the same winner');
    assertBoundary(match,config);
    const finalSnapshot=match.snapshot(),exported=match.exportSave(),imported=makeMatch(memoryStorage());
    try {
      assert.equal(await imported.importSave(exported),true,'terminal journal imports into independent storage');
      assert.deepEqual(imported.snapshot(),finalSnapshot,'independent final replay matches the complete hidden snapshot');
      assert.equal(await imported.completion,match.game.winner,'independent final replay settles normally');
      assert.deepEqual(imported.exportSave().actions,exported.actions,'independent replay keeps the command journal');
      coverage.importedFinalReplays++;
    }finally{imported.close();}
    assert.equal(errors.length,0,`runtime errors: ${errors.join('; ')}`);
    assert.ok(storage.getItem(SAVE_KEY),'terminal state remains saved');
    coverage.completed++;increment(coverage.winners,match.game.winner);increment(coverage.cases,label);increment(coverage.modes,config.mode);
    for(const player of match.game.all_players())if(SECOND_FOUR_HEROES.some(hero=>canonical_hero_for_source(hero.id).id===player.hero.id)) {
      increment(coverage.heroSeats,`${player.hero.name}:${config.mode}:${match.game.seat_of(player)}`);
    }
    coverage.maxRounds=Math.max(coverage.maxRounds,match.game.round_no);coverage.maxPrompts=Math.max(coverage.maxPrompts,actions);
    const result={label,config,variant,actions,winner:match.game.winner,rounds:match.game.round_no};
    coverage.results.push(result);return result;
  }catch(error) {
    throw new Error(`${error.message}\nReproduction: ${JSON.stringify({label,config,variant,actions,errors,
      recentActions:history,currentPrompt:match.pending?.prompt??null,round:match.game?.round_no},null,2)}`,{cause:error});
  }finally{match.close();}
}

export function buildCases({rounds=4,heroFilter=null,modeFilter=null,caseFilter=null,seed=null}={}) {
  assert.deepEqual(SECOND_FOUR_HEROES.map(hero=>hero.name),NEW_NAMES,'second batch consists of the approved four heroes');
  assert.equal(HEROES.length,52,'52 canonical heroes must be available before integration testing');
  assert.equal(CLASSIC_HEROES.length,19,'the original archive retains all19 stable identities');
  assert.deepEqual(HEROES.slice(0,18),CLASSIC_HEROES.filter(hero=>hero.id!=='jianghu.classic.hero.shi-qian'),'18 distinct originals remain selectable; archived 时迁 resolves to formal source');
  for(const hero of CLASSIC_HEROES)assert.ok(HEROES.includes(canonical_hero_for_source(hero.id)),`${hero.id} resolves to a selectable canonical hero`);
  for(const hero of EXPANSION_HEROES)assert.ok(HEROES.includes(canonical_hero_for_source(hero.id)),`${hero.id} resolves to a playable canonical hero`);
  const cases=[];
  for(const [modeIndex,mode] of ['ai','ai2'].entries()) {
    if(modeFilter&&!modeFilter.includes(mode))continue;
    for(const [ordinal,hero] of SECOND_FOUR_HEROES.entries()) {
      const heroIndex=HEROES.indexOf(canonical_hero_for_source(hero.id));
      assert.ok(heroIndex>=0,`${hero.name} resolves to the canonical selectable roster`);
      if(heroFilter&&!heroFilter.some(value=>[String(heroIndex),hero.name,hero.id].includes(value)))continue;
      for(let iteration=0;iteration<rounds;iteration++) {
        const oldOrdinal=(ordinal+iteration*7)%CLASSIC_HEROES.length;
        const old=HEROES.indexOf(canonical_hero_for_source(CLASSIC_HEROES[oldOrdinal].id)),old2=HEROES.indexOf(canonical_hero_for_source(CLASSIC_HEROES[(oldOrdinal+5)%CLASSIC_HEROES.length].id));
        assert.ok(old>=0&&old2>=0,'classic archive IDs resolve to current selectable indexes');
        const first=HEROES.indexOf(canonical_hero_for_source(EXPANSION_HEROES[(ordinal+iteration)%EXPANSION_HEROES.length].id));
        const first2=HEROES.indexOf(canonical_hero_for_source(EXPANSION_HEROES[(ordinal+iteration+4)%EXPANSION_HEROES.length].id));
        const next=HEROES.indexOf(canonical_hero_for_source(SECOND_FOUR_HEROES[(ordinal+1)%SECOND_FOUR_HEROES.length].id));
        const next2=HEROES.indexOf(canonical_hero_for_source(SECOND_FOUR_HEROES[(ordinal+2)%SECOND_FOUR_HEROES.length].id));
        const variants=[['human-classic',heroIndex,old,old2],['human-first-eight',heroIndex,first,first2],
          ['human-second-four',heroIndex,next,next2],['ai-p2',old,heroIndex,next],['mirror',heroIndex,heroIndex,old],
          ...(mode==='ai2'?[['ai-p3',old,old2,heroIndex]]:[])];
        for(const [caseIndex,[label,human,ai,ai2]] of variants.entries()) {
          if(caseFilter&&!caseFilter.includes(label))continue;
          cases.push({label,variant:ordinal+iteration+caseIndex,config:{hero_index:human,mode,
            ai_hero_index:ai,ai2_hero_index:mode==='ai2'?ai2:null,
            seed:seed??(200000+modeIndex*1000000+ordinal*10000+iteration*101+caseIndex*17)}});
        }
      }
    }
  }
  // Fixed naturally dealt canonical-deck recipes retain both Longdan response
  // directions after equipment deduplication changed shuffled card positions.
  if(!heroFilter&&!modeFilter&&!caseFilter&&rounds>=4&&seed===null)for(const [naturalSeed,variant] of [[8,1],[10,3]])cases.push({label:'longdan-response',variant,config:{hero_index:HEROES.indexOf(canonical_hero_for_source('sgs.adapted.base.hero.zhao-yun')),mode:'ai2',ai_hero_index:20,ai2_hero_index:16,seed:naturalSeed}});
  assert.ok(cases.length,'filters must select at least one game');return cases;
}

async function main() {
  const rounds=Number(process.env.ROUNDS_PER_HERO??4);
  assert.ok(Number.isInteger(rounds)&&rounds>0,'ROUNDS_PER_HERO must be a positive integer');
  const options={rounds,heroFilter:list(process.env.SECOND_FOUR_HEROES),modeFilter:list(process.env.SECOND_FOUR_MODES),
    caseFilter:list(process.env.SECOND_FOUR_CASES),seed:process.env.SECOND_FOUR_SEED===undefined?null:Number(process.env.SECOND_FOUR_SEED)};
  if(options.seed!==null)assert.ok(Number.isInteger(options.seed)&&options.seed>=0&&options.seed<=0xffffffff,'SECOND_FOUR_SEED must be uint32');
  const coverage=newCoverage(),started=Date.now(),cases=buildCases(options);coverage.planned=cases.length;
  for(const testCase of cases) {
    if(process.env.SECOND_FOUR_VERBOSE==='1')console.error('START '+JSON.stringify(testCase));
    const result=await runCase(testCase,coverage);
    if(process.env.SECOND_FOUR_VERBOSE==='1')console.error(JSON.stringify(result));
  }
  if(!options.heroFilter&&!options.modeFilter&&!options.caseFilter) {
    for(const hero of SECOND_FOUR_HEROES)for(const mode of ['ai','ai2'])for(const seat of mode==='ai2'?['p1','p2','p3']:['p1','p2']) {
      assert.ok(coverage.heroSeats[`${canonical_hero_for_source(hero.id).name}:${mode}:${seat}`]>0,`${hero.name}/${mode}/${seat} completed coverage`);
    }
    assert.ok(coverage.targetSelections.p3>0,'explicit second-AI targets were selected');
    for(const skill of ['武穆','反间'])assert.ok(coverage.humanActiveSkills[skill]>0,`${skill} was submitted as a public active command`);
    for(const skill of PASSIVES) {
      assert.ok(coverage.passiveConfirmations[skill]>0,`${skill} had a human confirmation`);
      assert.ok(coverage.restoredBoundaries[`${skill}:confirm`]>0,`${skill} was resumed while confirmation was pending`);
    }
    assert.ok(coverage.restoredBoundaries['反间:choice']>0,'Fanjian suit choice was resumed while pending');
    for(const remaining of [1,2])assert.ok(coverage.restoredBoundaries[`观星:choice:${remaining}-remaining`]>0,`Guanxing ${remaining}-remaining choice was resumed`);
    for(const direction of ['top','bottom'])assert.ok(coverage.guanxingDestinations[direction]>0,`Guanxing ${direction} placements were exercised`);
    assert.ok(coverage.guanxingOrders.nonfirst>0,'Guanxing exercised nonoriginal ordering');
    if(rounds>=4) {
      for(const suit of Object.values(CardSuit))assert.ok(coverage.fanjianSuits[suit]>0,`Fanjian guessed ${suit}`);
      for(const skill of PASSIVES)for(const answer of ['y','n'])assert.ok(coverage.optionalAnswers[`${skill}:${answer}`]>0,`${skill} optional answer ${answer} was exercised`);
      assert.ok(coverage.restoredBoundaries['武穆:choice']>0,'Longdan active material choice was resumed while pending');
      for(const response of [CardType.SHA,CardType.SHAN]) {
        assert.ok(coverage.restoredBoundaries[`武穆:response-material:${response}`]>0,`Longdan ${response} response material choice was resumed`);
      }
      assert.ok(coverage.responseConversions[`${CardType.SHAN}->${CardType.SHA}`]>0,'Longdan converted a dodge into a slash response');
      assert.ok(Object.entries(coverage.responseConversions).some(([conversion,count])=>conversion.endsWith(`->${CardType.SHAN}`)&&count>0),'Longdan converted a slash into a dodge response');
      assert.ok(coverage.guanxingCancels>0,'partially arranged Guanxing was cancelled through its public command');
      assert.ok(coverage.restoredBoundaries['观星:choice:3-remaining']>0,'three living seats produced a resumed three-card Guanxing choice');
    }
  }
  assert.equal(coverage.completed,coverage.planned,'every planned game reached a winner without early termination');
  assert.equal(coverage.finalRestores,coverage.completed,'every game verified its terminal save');
  assert.equal(coverage.importedFinalReplays,coverage.completed,'every game verified an independent final import');
  console.log(JSON.stringify({...coverage,elapsedMs:Date.now()-started}));
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
