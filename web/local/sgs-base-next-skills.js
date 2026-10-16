/** Source-verified base 身份 packet: 司马懿 / 大乔.
 * Current mainland mobile skill text + explicitly historical/cross-product
 * clarifications; see docs/sgs-base-next/skill-integration-contract.md.
 * No name dispatch, display-name merging, extra buffs or synthetic cost cards.
 */
import {Card,CardType,CardSuit,is_sha_card} from './models.js';

export const SGS_BASE_NEXT_RULE_IDS=Object.freeze({
  sima:'sgs.adapted.base.hero.sima-yi',
  daqiao:'sgs.adapted.base.hero.da-qiao',
});
export const SGS_BASE_NEXT_SKILL_IDS=Object.freeze({fankui:'sgs.fankui',guicai:'sgs.guicai',guose:'sgs.guose',liuli:'sgs.liuli'});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const select=(options,value)=>options.find(o=>o.id===value)??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['pass','cancel','0'].includes(value);
const playerId=(game,actor)=>game.player_id?.(actor)??game.seat_of(actor);
const live=actor=>!!actor?.alive&&actor.hp>0;
const byCost=game=>(a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b);
const exact=(options,material)=>options.find(m=>m.card===material?.card&&m.zone===material.zone&&m.id===material.id);
const physicalMaterials=(game,actor)=>game.skill_material_options(actor).filter(m=>!m.card.virtual);
const effectiveSuit=(game,card,actor)=>game.effective_suit(card,actor);
const receiptKey=(game,actor,skill)=>`${skill}:${playerId(game,actor)}`;
const seen=(game,actor,event,skill)=>Boolean(event?.sgs_skill_receipts?.[receiptKey(game,actor,skill)]);
function receipt(game,actor,event,skill,status){
  if(!event)return;
  event.sgs_skill_receipts??={};event.sgs_skill_receipts[receiptKey(game,actor,skill)]=status;
}
/** Read-only identity check; never allocates IDs or inspects other hand faces. */
function uniquePhysical(game,card){
  let count=0;
  for(const pile of [game.deck?.draw_pile,game.deck?.discard_pile,game.processing_cards,game.offboard_cards])for(const item of pile??[])if(item===card)count++;
  for(const p of game.all_players()){
    for(const pile of [p.hand,p.judgment_cards,p.sgs_mountain_fields,p.sgs_pojun_pile])for(const item of pile??[])if(item===card)count++;
    for(const slot of slots)if(p[slot]===card)count++;
  }
  return count===1;
}
async function chooseMaterial(game,actor,{skill,stage,options,args=[],zones=['hand',...slots]}){
  if(args.length){
    let id=null;
    if(args.length===1&&/^\d+$/.test(args[0]))id=`hand:${Number(args[0])}`;
    if(args.length===2&&args[0].toLowerCase()==='eq')id=`eq:${game.normalize_equipment_slot(args[1])}`;
    return id?options.find(m=>m.id===id)??null:false;
  }
  while(true){
    const value=await game.view.ask_line(`${skill}：选择一张牌，或取消`,{
      kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill,stage,private_to:game.seat_of(actor),material_zones:zones},
    });
    if(pass(value))return null;const chosen=select(options,value);if(chosen)return chosen;
    game.view.emit('请选择有效素材，或取消。');
  }
}

/** Hidden hand choices expose only a count. Self hand is not an obtain action. */
export function sgs_fankui_options(game,actor,source){
  if(!live(actor)||!live(source))return [];
  const options=slots.filter(slot=>source[slot]).map(slot=>({id:`eq:${slot}`,slot,card:source[slot],label:`装备：${source[slot]}`}));
  if(source!==actor&&source.hand.length)options.push({id:'hand',label:`随机获得1张手牌（共${source.hand.length}张，内容不可见）`});
  return options;
}
function fankuiWindow(actor,amount,event){
  return live(actor)&&amount>0&&(!event?.target||event.target===actor)
    &&event?.after_rescue!==false&&!event?.dying_pending&&!event?.cancelled&&!event?.closed
    &&event?.kind!=='hp_loss'&&event?.kind!=='lose_hp';
}
export async function sgs_after_damage_fankui(game,actor,amount,source,event={}){
  // The final event's actual source wins over any caller's stale source argument.
  if(Object.hasOwn(event,'source'))source=event.source;
  if(!fankuiWindow(actor,amount,event)||seen(game,actor,event,'sgs.fankui'))return false;
  const options=sgs_fankui_options(game,actor,source);if(!options.length)return false;
  receipt(game,actor,event,'sgs.fankui','offered');
  let chosen;
  if(actor.is_ai){
    if(source!==actor&&game.side_of(actor)===game.side_of(source)&&actor.hp>1){receipt(game,actor,event,'sgs.fankui','passed');return false;}
    chosen=options[0];
  }else{
    while(!chosen){
      const value=await game.view.ask_line(`反馈：可获得伤害来源${source.name}的一张手牌或装备`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],
        meta:{skill:'反馈',skill_id:'sgs.fankui',stage:'fankui_take',source_seat:game.seat_of(source),target_zones:['hand',...slots],damage_event_id:event.damage_event_id??null},
      });
      if(pass(value)){receipt(game,actor,event,'sgs.fankui','passed');return false;}chosen=select(options,value);
    }
  }
  const current=sgs_fankui_options(game,actor,source).find(o=>o.id===chosen.id&&(o.id==='hand'||o.card===chosen.card));
  if(!fankuiWindow(actor,amount,event)||Object.hasOwn(event,'source')&&event.source!==source||!current)return false;
  let moved;
  if(current.id==='hand'){
    // Do not look at any candidate's face, even for AI. RNG advances only now.
    const index=Math.floor(game.rng.random()*source.hand.length),card=source.hand[index];
    const movement=game.move_card_from_zone(source,{zone:'hand',index,card},{to:'hand',recipient:actor,visibility:'private',reason:'反馈'});
    moved=movement instanceof Promise?await movement:movement;
    if(moved)game.view.emit(`${actor.name}发动反馈，获得${source.name}的1张手牌。`);
  }else{
    if(!uniquePhysical(game,current.card))return false;
    moved=await game.remove_equipment(source,current.slot,{to:'hand',recipient:actor,reason:'反馈',expected_card:current.card});
    if(moved)game.view.emit(`${actor.name}发动反馈，获得${source.name}的${current.card}。`);
  }
  if(moved)receipt(game,actor,event,'sgs.fankui','committed');return Boolean(moved);
}

function judgmentWindow(game,event){
  return !!event?.actor&&!!event.card&&!event.card.virtual&&!event.closed&&!event.cancelled&&!event.resolved
    &&(!event.status||['revealed','retrial','pending'].includes(event.status))
    &&game.processing_cards.includes(event.card)&&uniquePhysical(game,event.card);
}
export const sgs_guicai_materials=(game,actor)=>live(actor)?physicalMaterials(game,actor).filter(m=>m.zone==='hand'):[];
/** Canonical judgment event owns the once-per-actor receipt, including passes.
 * Replacement is installed in the movement commit before awaited loss effects.
 */
export async function sgs_on_judgment_guicai(game,actor,event){
  if(!live(actor)||!judgmentWindow(game,event)||seen(game,actor,event,'sgs.guicai'))return false;
  receipt(game,actor,event,'sgs.guicai','offered');
  const options=sgs_guicai_materials(game,actor),old=event.card;
  if(!options.length)return false;
  let chosen;
  if(actor.is_ai){
    if(typeof event.favorable!=='function'||!event.good_for)return false;
    // favorable is the host's judged-role-aware predicate, not provider context.
    const wanted=game.side_of(actor)===game.side_of(event.good_for);
    if(Boolean(event.favorable(old))===wanted)return false;
    chosen=options.filter(m=>Boolean(event.favorable(m.card))===wanted).sort(byCost(game))[0];if(!chosen)return false;
  }else{
    while(!chosen){
      const value=await game.view.ask_line(`鬼才：是否替换${event.actor.name}「${event.reason}」的判定牌 ${old}？`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不改判'}],
        meta:{skill:'鬼才',skill_id:'sgs.guicai',stage:'guicai_retrial',private_to:game.seat_of(actor),judged_seat:game.seat_of(event.actor),judgment_event_id:event.judgment_event_id??null,material_zones:['hand'],judgment_card:{name:old.name,suit:old.suit,rank:old.rank,color:old.color}},
      });
      if(pass(value)){receipt(game,actor,event,'sgs.guicai','passed');return false;}chosen=select(options,value);
    }
  }
  const current=exact(sgs_guicai_materials(game,actor),chosen);
  if(!current||!uniquePhysical(game,current.card)||!judgmentWindow(game,event)||event.card!==old)return false;
  let installed=false;
  const replacement=await game.consume_material(actor,current,{to:'processing',reason:'鬼才',on_committed:async cards=>{
    if(cards.length!==1||cards[0]!==current.card)throw Error('鬼才改判必须提交恰好一张选定实体手牌。');
    event.card=current.card;game.register_judgment_material(current.card,event);installed=true;receipt(game,actor,event,'sgs.guicai','committed');await game.finish_judgment_card(old,event);
  }});
  if(!replacement)return false;
  if(!installed)throw Error('鬼才需要支持 on_committed 的实体移动事务。');
  game.view.emit(`${actor.name}发动鬼才，改判为${replacement}。`);return true;
}

const prisonView=()=>new Card('画地为牢',CardType.SCROLL,{virtual:true,materials:[],source_skill:'sgs.guose',effect_id:'trick.skip_play'});
export const sgs_guose_materials=(game,actor)=>physicalMaterials(game,actor).filter(m=>effectiveSuit(game,m.card,actor)===CardSuit.DIAMOND);
export function sgs_guose_targets(game,actor){
  return game.all_players().filter(p=>game.can_place_delayed(actor,p,prisonView())
    &&!p.judgment_cards.some(card=>(game.effective_delayed_effect_id?.(p,card)??game.effective_delayed_name(p,card))==='trick.skip_play'
      ||['画地为牢','乐不思蜀'].includes(game.effective_delayed_name(p,card))));
}
export function sgs_guose_available(game,actor,target=null){
  if(!live(actor)||!game.is_own_play_phase(actor)||!sgs_guose_materials(game,actor).length)return false;
  const targets=sgs_guose_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export async function sgs_resolve_guose(game,actor,target,material){
  if(!sgs_guose_available(game,actor,target))return false;
  const current=exact(sgs_guose_materials(game,actor),material);if(!current||!uniquePhysical(game,current.card))return false;
  const converted=new Card('画地为牢',CardType.SCROLL,{suit:effectiveSuit(game,current.card,actor),color:game.effective_color(current.card,actor),rank:current.card.rank,
    virtual:true,materials:[current.card],source_skill:'sgs.guose',source_skill_id:'sgs.guose',source_game:'三国杀',source_rule_id:SGS_BASE_NEXT_RULE_IDS.daqiao,effect_id:'trick.skip_play'});
  let scope,committed=false;
  try{
    const cost=await game.consume_material(actor,current,{to:'processing',reason:'国色·当画地为牢使用',on_committed:()=>{
      committed=true;
      scope=game.start_card_use(actor,converted,{materials:[current.card],sourceZones:[current.zone]});
    }});
    if(!cost)return false;
    if(!live(actor)||!live(target))return true;
    game.view.emit(`${actor.name}发动国色，将${cost}当画地为牢使用。`);
    await game.resolve_scroll(actor,target,converted,{physical_material:cost,source_skill:'sgs.guose',source_skill_id:'sgs.guose',trick_declaration_validated:true,history_use_id:scope?.use_id});
  }finally{if(committed)game.finish_processing_card(converted);if(scope)game.end_card_use(scope);}
  return true;
}
async function player_guose(game,actor,_fallback,args=[]){
  if(!sgs_guose_available(game,actor))return true;
  const material=await chooseMaterial(game,actor,{skill:'国色',stage:'guose_material',options:sgs_guose_materials(game,actor),args});
  if(material===false)return false;if(!material)return true;
  const target=await game.choose_card_target(actor,sgs_guose_targets(game,actor),{card_name:'国色·画地为牢',stage:'guose_target',cancellable:true});
  if(target)await sgs_resolve_guose(game,actor,target,material);return true;
}
export async function sgs_ai_guose(game,actor,target){
  if(!sgs_guose_available(game,actor))return false;
  const targets=sgs_guose_targets(game,actor).filter(p=>game.side_of(p)!==game.side_of(actor));
  if(!targets.includes(target))target=targets[0];if(!target)return false;
  return sgs_resolve_guose(game,actor,target,sgs_guose_materials(game,actor).sort(byCost(game))[0]);
}

const shaUser=event=>event?.card_user??event?.source;
function liuliWindow(actor,event){
  return live(actor)&&event?.target===actor&&live(shaUser(event))&&!event.cancelled&&!event.closed
    &&event.liuli_allowed!==false&&!event.chain_transfer&&!event.response_started&&!event.armor_judgment_started
    &&!(event.shans_played>0)&&!(event.response_supplied>0)&&(!event.kind||event.kind==='sha')
    &&(!event.source_card||is_sha_card(event.source_card));
  // chenyu_allowed is deliberately absent: 西施's pursuit rule is not 流离.
}
/** Costs and targets are paired: range is 大乔's after paying that exact card. */
export function sgs_liuli_targets(game,actor,event,material){
  if(!liuliWindow(actor,event))return [];
  const current=exact(physicalMaterials(game,actor),material);if(!current)return [];
  const after=game.actor_after_material_cost(actor,current),source=shaUser(event);
  return game.all_players().filter(p=>live(p)&&p!==actor&&p!==source
    &&game.can_sha_target(source,p,{allow_allies:true})&&game.in_actual_attack_range(after,p));
}
export const sgs_liuli_materials=(game,actor,event)=>liuliWindow(actor,event)?physicalMaterials(game,actor).filter(m=>sgs_liuli_targets(game,actor,event,m).length):[];
export const sgs_liuli_available=(game,actor,event)=>sgs_liuli_materials(game,actor,event).length>0;
export async function sgs_commit_liuli(game,actor,event,material,target){
  if(!sgs_liuli_targets(game,actor,event,material).includes(target))return null;
  const current=exact(physicalMaterials(game,actor),material);if(!current||!uniquePhysical(game,current.card))return null;
  const paid=await game.consume_material(actor,current,{to:'discard',reason:'流离',action:'discard'});
  if(!paid||!live(actor)||!live(target)||!live(shaUser(event)))return null;
  game.view.emit(`${actor.name}发动流离，将${shaUser(event).name}这次杀的目标转移给${target.name}。`);
  return {target,transfer:{skill:'流离',skill_id:'sgs.liuli',from:actor,cost:current.card,branch_id:event.branch_id}};
}
export async function sgs_before_sha_target_liuli(game,actor,event){
  if(!sgs_liuli_available(game,actor,event))return null;
  let material,target;
  if(actor.is_ai){
    for(const candidate of sgs_liuli_materials(game,actor,event).sort(byCost(game))){
      const enemy=sgs_liuli_targets(game,actor,event,candidate).filter(p=>game.side_of(p)!==game.side_of(actor)).sort((a,b)=>a.hp-b.hp)[0];
      if(enemy){material=candidate;target=enemy;break;}
    }
    if(!target)return null;
  }else{
    material=await chooseMaterial(game,actor,{skill:'流离',stage:'liuli_material',options:sgs_liuli_materials(game,actor,event)});
    if(!material)return null;
    target=await game.choose_card_target(actor,sgs_liuli_targets(game,actor,event,material),{card_name:'流离',stage:'liuli_target',cancellable:true});
    if(!target)return null;
  }
  return sgs_commit_liuli(game,actor,event,material,target);
}

export function sgs_base_next_skill_definitions({SkillHooks,ActiveSkillDef}){
  const guose=new ActiveSkillDef({skill_id:'国色',hotkey:'q',button_label:'国色',
    help_text:'国色：自己的出牌阶段，将一张方块手牌或装备当画地为牢使用；无独立次数上限，保留实体素材',
    player:player_guose,ai:sgs_ai_guose,available:sgs_guose_available});
  guose.targets=sgs_guose_targets;guose.owns_target_selection=true;
  return {hooks:{
    [SGS_BASE_NEXT_RULE_IDS.sima]:SkillHooks({after_damage_resolved:[sgs_after_damage_fankui],on_judgment:[sgs_on_judgment_guicai]}),
    [SGS_BASE_NEXT_RULE_IDS.daqiao]:SkillHooks({before_sha_target_response:[sgs_before_sha_target_liuli]}),
  },active:{[SGS_BASE_NEXT_RULE_IDS.daqiao]:[guose]}};
}
