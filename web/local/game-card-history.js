import {CONVENTIONAL_GENERATED_CARD_NAMES} from './release-scope.js';
import {ZHANGFEN_EQUIPMENT_CATALOG} from './sgs-zhangfen-data.js';
import {WANGYUN_TRICK_CATALOG,QIBAO_RULES} from './wangyun-card-effects.js';
import {CONTENT_PACKS} from './content-packs.js';
/** Production host adapter for committed public card uses.
 * Historical YXS CC1/CC2/CC10/CC13 are explicitly adopted Jianghu policies,
 * not a claim of current-client parity. Zone movement never calls this adapter.
 */
import {CardType, Deck, SeededRNG} from './models.js';
import {DERIVED_EQUIPMENT_CATALOG} from './derived-equipment.mjs';
import {create_card_use_history, begin_card_use_turn, end_card_use_turn,
  record_card_use_event, latest_card_use, restore_card_use_history,
  snapshot_card_function, snapshot_card_use_metadata, snapshot_card_use_material} from './card-use-history.js';

export const GAME_CARD_HISTORY_VERSION = 1;
const fail = message => { throw new TypeError(`Game card history: ${message}`); };
const stable = (value,label) => typeof value === 'string' && value.trim() || typeof value === 'number' && Number.isSafeInteger(value) && !Object.is(value,-0)
  ? value : fail(`${label} needs a stable string or safe integer`);
const integer = (value,label) => Number.isSafeInteger(value) && value >= 0 ? value : fail(`${label} must be a nonnegative safe integer`);
const freeze = value => { if(value && typeof value === 'object' && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value; };
const slots = {武器:'weapon',防具:'armor','-1马':'offensive_horse','+1马':'defensive_horse'};
const delayed = new Set(['手捧雷','画地为牢','兵粮寸断']);
const intrinsic = ['effect_id','equipment_id','mechanism_id','rule_type','nature','trait','slot','target_mode','power','range'];

// This bootstrap reads only code-owned definitions. Its private deterministic
// RNG never touches a match's RNG or lazily allocated physical-card identities.
const catalogCards = [...new Deck(new SeededRNG(1),null,{content_packs:CONTENT_PACKS.map(pack=>pack.id)}).draw_pile,
  ...WANGYUN_TRICK_CATALOG.filter(card=>CONVENTIONAL_GENERATED_CARD_NAMES.includes(card.name))];
const definitions = [];
for(const card of catalogCards){
  if(definitions.some(def=>def.name===card.name && def.type===card.type))continue;
  const category=slots[card.type]?'equipment':delayed.has(card.name)?'delayed_trick':card.type===CardType.SCROLL?'trick':'basic';
  const row={rule_id:card.equipment_id??card.id??`jianghu.card.${card.name}`,category,name:card.name,type:card.type};
  for(const key of intrinsic)if(card[key]!==undefined && card[key]!==null)row[key]=card[key];
  if(category==='equipment')row.slot=slots[card.type];
  if(card.type===CardType.FIRE_SHA)row.nature='fire';
  else if(card.type===CardType.THUNDER_SHA)row.nature='thunder';
  else if([CardType.SHA,CardType.BLOOD_SHA,CardType.POISON_SHA,CardType.STAB_SHA].includes(card.type))row.nature='normal';
  definitions.push(Object.freeze({template_id:row.rule_id,...snapshot_card_function(row,row),
    ...(category==='delayed_trick'?{delayed_key:card.name}:{})}));
}
/** Every supported function, including functions lacking an idle-play window.
 * Catalog membership describes a function; it never authorizes its use.
 */
export const CARD_HISTORY_FUNCTIONS = Object.freeze(definitions.sort((a,b)=>a.rule_id<b.rule_id?-1:a.rule_id>b.rule_id?1:0));

export function card_history_definition(card){
  if(!card || typeof card!=='object')fail('a card definition is required');
  const identity=card.equipment_id??card.rule_id??card.template_id??card.id;
  const byId=CARD_HISTORY_FUNCTIONS.find(def=>def.rule_id===identity);
  // Legacy converted cards can carry their source's id. Name/type remain the
  // effective face; an id never silently overrides a different effective face.
  const byFace=CARD_HISTORY_FUNCTIONS.find(def=>def.name===card.name && def.type===card.type);
  const definition=byFace??byId;
  if(!definition || card.name!==undefined && card.name!==definition.name || card.type!==undefined && card.type!==definition.type)
    fail('unsupported effective card function');
  return definition;
}

const actorId = (game,actor) => {
  if(typeof game.player_id!=='function')fail('the host must provide player_id(actor)');
  return stable(game.player_id(actor),'actor ID');
};
function initialize(game){
  if(game.card_use_history===undefined)game.card_use_history=create_card_use_history();
  game.card_history_use_counter??=0;
  game.card_history_material_counter??=0;
  game.card_history_materials??=[];
  game.card_history_stack??=[];
  game.card_history_native_uses??=[];
  return game.card_use_history;
}
function metadata(game,card,owner,{effective=true}={}){
  const suit=effective && typeof game.effective_suit==='function'?game.effective_suit(card,owner):card.suit;
  const noSuit=suit===null || suit===undefined || suit==='无花色' || suit==='';
  const color=noSuit&&!(effective&&card.virtual===true&&card.formed_effective_color===true)?null:effective && typeof game.effective_color==='function'?game.effective_color(card,owner):card.color;
  return snapshot_card_use_metadata({suit:noSuit?null:suit,color:color===undefined || color==='无色' || color===''?null:color,
    rank:card.rank===0 || card.rank===undefined?null:card.rank});
}
function printed(game,card){
  const face=typeof game.printed_card==='function'?game.printed_card(card):card;
  if(!face || face.virtual===true)fail('a material must have a physical printed card');
  return {name:face.name,type:face.type,...metadata(game,face,null,{effective:false})};
}
function effectiveDefinition(game,card){
  const source=typeof game.effective_card_definition==='function'?game.effective_card_definition(card):card;
  return card_history_definition(source??card);
}
function sourceZone(game,actor,card){
  if(actor.hand?.includes(card))return 'hand';
  for(const slot of Object.values(slots))if(actor[slot]===card)return slot;
  if(actor.judgment_cards?.includes(card))return 'judgment';
  if(actor.sgs_mountain_fields?.includes(card))return 'field';
  if(actor.sgs_pojun_pile?.includes(card))return 'pojun_pile';
  if(actor.sgs_following_jieyue_pile?.includes(card))return 'jieyue';
  if(actor.sgs_followup_qian_pile?.includes(card))return 'qian';
  if(game.processing_cards?.includes(card))return 'processing';
  fail('sourceZones must identify a material outside the actor’s current zones');
}
function stageMaterials(game,actor,cards,zones,prior){
  if(!Array.isArray(cards) || zones!==undefined && !Array.isArray(zones))fail('materials and sourceZones must be arrays');
  if(zones!==undefined && zones.length!==cards.length)fail('sourceZones must match materials');
  if(new Set(cards).size!==cards.length)fail('one use cannot repeat a physical material');
  let counter=game.card_history_material_counter;
  const additions=[];
  const rows=cards.map((card,index)=>{
    if(!card || card.virtual===true)fail('virtual projections cannot be physical materials');
    let binding=game.card_history_materials.find(row=>row.card===card);
    if(!binding){integer(++counter,'material counter');binding={id:`history:material:${counter}`,card};additions.push(binding);}
    const zoneInfo=zones?.[index],owner=zoneInfo && typeof zoneInfo==='object'?zoneInfo.owner??actor:actor;
    const zone=typeof zoneInfo==='string'?zoneInfo:zoneInfo?.zone??prior?.materials[index]?.zone??sourceZone(game,owner,card);
    const visibility=typeof zoneInfo==='object'?zoneInfo.visibility??'public':'public';
    return snapshot_card_use_material(printed(game,card),{physical_id:binding.id,owner_id:actorId(game,owner),zone,visibility,
      effective_metadata:metadata(game,card,owner)});
  });
  return {rows,additions,counter};
}
const currentTurn = game => game.card_use_history.turns.find(turn=>turn.turn_id===game.card_use_history.current_turn_id);
function provenance(card,materials,explicit,prior){
  if(explicit!==undefined)return explicit;
  if(prior)return prior.provenance;
  const differentFace=materials.length===1 && materials[0].printed && (materials[0].printed.name!==card.name || materials[0].printed.type!==card.type);
  const result={kind:materials.length===0?'virtual':card.virtual || materials.length!==1 || differentFace?'converted':'physical'};
  for(const key of ['source_skill_id','source_skill','source_game','source_rule_id','source_record_id','source_record_ids','source_urls','source_game_lineage','copied_from_use_id'])
    if(card[key]!==undefined)result[key]=card[key];
  if(card.source_version??card.source_variant)result.source_version=card.source_version??card.source_variant;
  return result;
}

export const cardHistoryMethods={
  initialize_card_history(){initialize(this);return this.card_use_history;},
  /** Shared physical identity for the virtual-card registry. Allocating an ID
   * is not a card-use event and never exposes the private binding publicly.
   */
  card_history_material_id(card){
    initialize(this);
    if(!card || card.virtual===true)fail('virtual projections cannot be physical materials');
    printed(this,card);
    const prior=this.card_history_materials.find(row=>row.card===card);if(prior)return prior.id;
    const counter=integer(this.card_history_material_counter+1,'material counter');
    const id=`history:material:${counter}`;
    this.card_history_materials.push({id,card});this.card_history_material_counter=counter;return id;
  },
  begin_history_turn(actor,stableTurnId){
    initialize(this);stable(stableTurnId,'full-turn ID');
    const next=begin_card_use_turn(this.card_use_history,{turn_id:stableTurnId,turn_owner_id:actorId(this,actor)});
    if(next!==this.card_use_history && this.card_history_stack.length)fail('cannot begin a new full turn with active card-use scopes');
    this.card_use_history=next;return next;
  },
  end_history_turn(stableTurnId,status='ended'){
    initialize(this);
    if(this.card_history_stack.length)fail('cannot end a full turn with active card-use scopes');
    this.card_use_history=end_card_use_turn(this.card_use_history,{turn_id:stableTurnId,status});return this.card_use_history;
  },
  /** Call synchronously at the validated commit, before any loss/effect callback.
   * The host owns atomic card removal and must not call for a failed transaction.
   */
  start_card_use(actor,effectiveCard,options={}){
    initialize(this);
    if(options.kind!==undefined && options.kind!=='card_use' || options.stage!==undefined && options.stage!=='committed')
      fail('start_card_use accepts only committed card_use');
    const supplied=options.history_use_id;
    if(supplied!==undefined)stable(supplied,'history_use_id');
    const prior=supplied===undefined?null:this.card_use_history.uses.find(use=>use.use_id===supplied);
    const turn=prior?null:currentTurn(this);
    if(!prior && !turn)fail('begin_history_turn is required before card use');
    const sequence=prior?.commit_seq??this.card_history_use_counter+1;
    integer(sequence,'use counter');
    const use_id=prior?.use_id??supplied??`history:use:${sequence}`;
    const cards=options.materials??(prior?undefined:effectiveCard.materials??(effectiveCard.virtual?[]:[effectiveCard]));
    const staged=cards===undefined?{rows:prior.materials,additions:[],counter:this.card_history_material_counter}
      :stageMaterials(this,actor,cards,options.sourceZones,prior);
    const event={kind:'card_use',stage:'committed',event_id:prior?.event_id??`history:commit:${sequence}`,
      use_id,parent_use_id:prior?.parent_use_id??(prior?null:this.card_history_stack.at(-1)??null),
      turn_id:prior?.turn_id??turn.turn_id,turn_owner_id:prior?.turn_owner_id??turn.turn_owner_id,
      actor_id:actorId(this,actor),commit_seq:sequence,effective_function:effectiveDefinition(this,effectiveCard),
      effective_metadata:metadata(this,effectiveCard,actor),materials:staged.rows,
      provenance:provenance(effectiveCard,staged.rows,options.provenance,prior)};
    const result=record_card_use_event(this.card_use_history,event);
    let nativeLink;
    if(options.native_use_id!==undefined){
      stable(options.native_use_id,'native_use_id');
      nativeLink=this.card_history_native_uses.find(link=>link.history_use_id===use_id || link.native_use_id===options.native_use_id);
      if(nativeLink && (nativeLink.history_use_id!==use_id || nativeLink.native_use_id!==options.native_use_id))fail('conflicting native-use link');
    }
    // Code-owned preflight runs the exact validator before an atomic external cost.
    // No material IDs, sequence, journal or scope are committed in this mode.
    if(options.validate_only===true)return Object.freeze({use_id,history_use_id:use_id,owns_scope:false,record:result.record,validated:true});
    // No mutations before all validation succeeds, including replay payloads.
    this.card_use_history=result.history;
    this.card_history_materials.push(...staged.additions);
    this.card_history_material_counter=staged.counter;
    if(options.native_use_id!==undefined && !nativeLink)this.card_history_native_uses.push({history_use_id:use_id,native_use_id:options.native_use_id});
    if(!result.duplicate){this.card_history_use_counter=sequence;this.card_history_stack.push(use_id);}
    return Object.freeze({use_id,history_use_id:use_id,owns_scope:!result.duplicate,record:result.record});
  },
  /** A resolver reusing history_use_id receives a non-owning scope. Its finally
   * cannot close the original caller's scope or a nested child by mistake.
   */
  end_card_use(scope){
    initialize(this);
    if(!scope || scope.owns_scope!==true)return false;
    const index=this.card_history_stack.indexOf(scope.use_id);
    if(index<0)return false;
    if(index!==this.card_history_stack.length-1)fail('card-use scopes must close in nested order');
    this.card_history_stack.pop();return true;
  },
  async with_card_use(actor,card,options,resolve){
    if(typeof resolve!=='function')fail('with_card_use requires a resolver');
    const scope=this.start_card_use(actor,card,options);
    try{return await resolve(scope);}finally{this.end_card_use(scope);}
  },
  last_outer_card_use(actor){
    initialize(this);const turn=this.card_use_history.current_turn_id;if(turn===null)return null;
    return latest_card_use(this.card_use_history,{actor_id:actorId(this,actor),turn_id:turn,selection:'outermost',require_own_turn:true});
  },
  /** Public DTO contains only the pure journal, never live material bindings. */
  public_card_use_history(){initialize(this);return restore_card_use_history(this.card_use_history);},
  card_history_snapshot(){
    initialize(this);
    return freeze({version:GAME_CARD_HISTORY_VERSION,card_use_history:restore_card_use_history(this.card_use_history),
      card_history_use_counter:this.card_history_use_counter,card_history_material_counter:this.card_history_material_counter,
      card_history_materials:this.card_history_materials.map(({id,card})=>({id,printed:printed(this,card)})),
      card_history_stack:[...this.card_history_stack],card_history_native_uses:this.card_history_native_uses.map(link=>({...link}))});
  },
  /** JSON cannot preserve shared Card object references. The private match
   * loader must rebind each physical ID to its ONE restored physical Card.
   */
  restore_card_history(snapshot,{resolve_material}={}){
    if(snapshot?.version!==GAME_CARD_HISTORY_VERSION)fail('unsupported adapter version');
    const history=restore_card_use_history(snapshot.card_use_history);
    for(const use of history.uses){
      const definition=card_history_definition(use.effective_function);
      if(JSON.stringify(snapshot_card_function(definition,definition))!==JSON.stringify(use.effective_function))fail('saved function differs from trusted catalog');
    }
    const useCounter=integer(snapshot.card_history_use_counter,'use counter');
    const materialCounter=integer(snapshot.card_history_material_counter,'material counter');
    if(useCounter!==(history.uses.at(-1)?.commit_seq??0))fail('use counter disagrees with journal');
    if(!Array.isArray(snapshot.card_history_materials) || !Array.isArray(snapshot.card_history_stack) || !Array.isArray(snapshot.card_history_native_uses))fail('invalid adapter collections');
    const ids=new Set(),cards=new Set();
    const materials=snapshot.card_history_materials.map(row=>{
      stable(row.id,'material ID');
      if(ids.has(row.id))fail('duplicate physical material ID');ids.add(row.id);
      if(typeof resolve_material!=='function')fail('restore requires resolve_material for physical Card bindings');
      const card=resolve_material(row.id,row.printed);
      if(!card || cards.has(card))fail('material resolver must return one distinct physical Card for each ID');cards.add(card);
      if(JSON.stringify(printed(this,card))!==JSON.stringify(row.printed))fail('restored physical card differs from printed snapshot');
      const number=Number(String(row.id).replace(/^history:material:/,''));
      if(row.id!==`history:material:${number}` || !Number.isSafeInteger(number) || number<1 || number>materialCounter)fail('material ID disagrees with counter');
      return {id:row.id,card};
    });
    if(materialCounter!==materials.length || history.uses.some(use=>use.materials.some(material=>!ids.has(material.physical_id))))fail('material bindings disagree with journal');
    for(const use of history.uses)for(const material of use.materials){
      if(material.visibility!=='public')continue;
      const binding=materials.find(row=>row.id===material.physical_id);
      const face=material.printed;
      if(JSON.stringify(printed(this,binding.card))!==JSON.stringify({name:face.name,type:face.type,suit:face.suit,color:face.color,rank:face.rank}))
        fail('journal material differs from physical printed snapshot');
    }
    const stack=[...snapshot.card_history_stack];
    if(new Set(stack).size!==stack.length)fail('duplicate active scope');
    stack.forEach((id,index)=>{
      const record=history.uses.find(use=>use.use_id===id);
      if(!record || record.turn_id!==history.current_turn_id || record.parent_use_id!==(stack[index-1]??null))fail('invalid active scope chain');
    });
    const links=snapshot.card_history_native_uses.map(link=>({history_use_id:stable(link.history_use_id,'linked history ID'),native_use_id:stable(link.native_use_id,'native-use ID')}));
    if(new Set(links.map(link=>link.history_use_id)).size!==links.length || new Set(links.map(link=>link.native_use_id)).size!==links.length
      || links.some(link=>!history.uses.some(use=>use.use_id===link.history_use_id)))fail('invalid native-use links');
    this.card_use_history=history;this.card_history_use_counter=useCounter;this.card_history_material_counter=materialCounter;
    this.card_history_materials=materials;this.card_history_stack=stack;this.card_history_native_uses=links;
    return history;
  },
};
