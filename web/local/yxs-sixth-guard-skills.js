import {rule_hero} from './effective-hero.js';
/** Complete historical YXS 秦琼 / 李世民 rules, independent of kernel wiring.
 * The host contracts and declared cross-game rulings are in guard-rules.md.
 * Ownership is injected explicitly; display names never grant a skill.
 */
import {CardColor,CardType,is_sha_card} from './models.js';

export const YXS_SIXTH_GUARD_RULE_IDS=Object.freeze({
  qin:'yxs.adapted.base.hero.qin-qiong',
  li:'yxs.adapted.base.hero.li-shi-min',
});
export const YXS_GUARD_SKILLS=Object.freeze({fanji:'yxs.fanji',menshen:'yxs.menshen',kongju:'yxs.kongju'});
export const YXS_GUARD_COMPATIBILITY='jianghu.yxs.guard.historical.v1';
const ownPhase=(g,a,phase)=>a?.alive&&g.turn_phase===phase&&g.turn_actor===identity(g,a);
const cancel=value=>['cancel','pass','refuse','0','n'].includes(String(value));
const select=(options,value)=>options.find(o=>o.id===String(value))
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const emit=(g,message)=>g.view.emit(message);
function requireFunction(value,label){if(typeof value!=='function')throw new TypeError(`YXS guard kernel requires ${label}.`);return value;}
function identity(game,player){
  if(!game.all_players().includes(player))throw new TypeError('YXS guard player is outside this match.');
  const id=game.seat_of(player);
  if(typeof id!=='string'||!id)throw new TypeError('YXS guard requires a stable player ID.');
  return id;
}
function enabled(game,actor,skill,has_skill){
  requireFunction(has_skill,'has_skill(game, player, skill_id)');
  return !!actor?.alive&&!actor.dead&&has_skill(game,actor,skill)===true;
}
function state(game){
  game.yxs_sixth_guard_state??={version:1,fanji:{},kongju:{},menshen:{},guards:{}};
  const s=game.yxs_sixth_guard_state;
  if(s.version!==1)throw new Error('Unsupported YXS guard state version.');
  return s;
}
function phaseId(game,actor,phase,event={}){
  const explicit=event.phase_event_id??event.event_id;
  if(explicit!=null){if(typeof explicit!=='string'||!explicit)throw new TypeError('Invalid phase event ID.');return explicit;}
  if(!Number.isInteger(game.turn_event_counter)||game.turn_event_counter<1)throw new TypeError('YXS guard requires a stable phase ID or positive turn_event_counter.');
  return `turn:${game.turn_event_counter}:${phase}:${identity(game,actor)}`;
}
function actorReceipt(table,eventId,actorId){return table[eventId]?.[actorId]??null;}
function putReceipt(table,eventId,actorId,value){(table[eventId]??={})[actorId]=value;return value;}
function maxHp(game,actor){
  const value=game.effective_max_hp?game.effective_max_hp(actor):rule_hero(actor).max_hp;
  if(!Number.isFinite(value)||value<0)throw new TypeError('Invalid effective maximum HP.');
  return value;
}

/** Compatibility normalization for existing real/converted Card views. Explicit
 * effect_id wins over the printed material name, including unknown effect IDs.
 * Equipment/skill direct theft is NOT a trick merely because it moves a card. */
const effectAliases=Object.freeze({
  sha:'sha',duel:'duel',snatch:'snatch',dismantle:'dismantle',prison:'prison',
  '探囊取物':'snatch','顺手牵羊':'snatch','釜底抽薪':'dismantle','过河拆桥':'dismantle','画地为牢':'prison','乐不思蜀':'prison','决斗':'duel',
});
export function yxs_guard_card_effect(card){
  if(!card)return null;
  if(card.effect_id!=null)return effectAliases[card.effect_id]??card.effect_id;
  if(is_sha_card(card))return 'sha';
  return card.type===CardType.SCROLL?(effectAliases[card.name]??null):null;
}

/** Declaration-time only. Call before costs for both physical and virtual uses.
 * This never removes an existing judgment or rechecks a resolving legal trick. */
export function yxs_kongju_prohibits(game,target,card,{has_skill,stage='declaration',effect_id=yxs_guard_card_effect(card)}={}){
  if(stage!=='declaration'||!enabled(game,target,YXS_GUARD_SKILLS.kongju,has_skill))return false;
  const hand=target.hand.length,max=maxHp(game,target);
  return (hand<max&&['snatch','dismantle'].includes(effect_id))||(hand>max&&effect_id==='prison');
}

/** Snapshot once at discard entry; declining returns to the host's CURRENT-HP
 * normal discard algorithm. No dynamic MAXHP hand-limit override is installed. */
export async function yxs_before_discard_kongju(game,actor,event={}, {has_skill}={}){
  if(!ownPhase(game,actor,'discard')||!enabled(game,actor,YXS_GUARD_SKILLS.kongju,has_skill))return false;
  const eventId=phaseId(game,actor,'discard',event),actorId=identity(game,actor),table=state(game).kongju;
  const previous=actorReceipt(table,eventId,actorId);if(previous)return previous.skip===true;
  const hand=actor.hand.length,max=maxHp(game,actor),turnAtEntry=game.turn_event_counter;
  const receipt=putReceipt(table,eventId,actorId,{event_id:eventId,actor_id:actorId,hand_at_entry:hand,max_hp_at_entry:max,status:'selecting',skip:false});
  if(hand>max){receipt.status='ineligible';return false;}
  try{
    const yes=actor.is_ai||await game.view.ask_confirm(`控局：弃牌阶段入口手牌${hand}张，不大于体力上限${max}，是否跳过本次正常弃牌？`,{
      player_id:actorId,meta:{skill:'控局',skill_id:YXS_GUARD_SKILLS.kongju,stage:'kongju_discard',phase_event_id:eventId,
        hand_at_entry:hand,max_hp_at_entry:max,compatibility:YXS_GUARD_COMPATIBILITY},
    });
    // Counts are intentionally NOT re-evaluated after the prompt. The entry
    // snapshot decides eligibility, while a stale phase/removed skill cannot act.
    receipt.skip=!!yes&&ownPhase(game,actor,'discard')&&enabled(game,actor,YXS_GUARD_SKILLS.kongju,has_skill)
      &&game.turn_event_counter===turnAtEntry&&phaseId(game,actor,'discard',event)===eventId;
    receipt.status=receipt.skip?'resolved':'declined';
    if(receipt.skip)emit(game,`${actor.name}发动控局，跳过本次正常弃牌。`);
    return receipt.skip;
  }catch(error){receipt.status='interrupted';throw error;}
}

export const yxs_menshen_targets=(game,actor)=>actor?.alive?game.all_players().filter(p=>p.alive):[];
/** Public HP, hand count and team only; never inspect another player's cards.
 * In 1v1 AI declines a purposeless self guard; humans may still choose anyone. */
export function yxs_ai_menshen_target(game,actor){
  return yxs_menshen_targets(game,actor).filter(p=>p!==actor&&game.side_of(p)===game.side_of(actor)
    &&(actor.hp>p.hp||(p.hp<=2&&actor.hp>1)))
    .sort((a,b)=>a.hp-b.hp||a.hand.length-b.hand.length||identity(game,a).localeCompare(identity(game,b)))[0]??null;
}
export async function yxs_on_end_phase_menshen(game,actor,_target,event={}, {has_skill}={}){
  if(!ownPhase(game,actor,'end_phase')||!enabled(game,actor,YXS_GUARD_SKILLS.menshen,has_skill))return null;
  const eventId=phaseId(game,actor,'end_phase',event),actorId=identity(game,actor),s=state(game),turnAtEntry=game.turn_event_counter;
  const previous=actorReceipt(s.menshen,eventId,actorId);if(previous)return previous;
  const receipt=putReceipt(s.menshen,eventId,actorId,{event_id:eventId,actor_id:actorId,status:'selecting',target_id:null});
  let target;
  try{
    if(actor.is_ai)target=yxs_ai_menshen_target(game,actor);
    else while(true){
      const candidates=yxs_menshen_targets(game,actor);
      if(!candidates.length)break;
      const options=candidates.map(p=>({id:identity(game,p),label:`${p.name}（${p.hp}血${p===actor?'；自守无重定向效果':''}）`}));
      const answer=await game.view.ask_line('门神：选择保护角色，直到自己下次回合开始（可取消）',{
        kind:'choice',player_id:actorId,options:[...options,{id:'cancel',label:'不发动门神'}],
        meta:{skill:'门神',skill_id:YXS_GUARD_SKILLS.menshen,stage:'menshen_target',phase_event_id:eventId,allow_self:true,allow_allies:true},
      });
      if(cancel(answer))break;
      const option=select(options,answer);if(option){target=candidates.find(p=>identity(game,p)===option.id);break;}
      emit(game,'请选择仍存活的保护目标，或取消。');
    }
    if(!target){receipt.status='declined';return receipt;}
    if(!ownPhase(game,actor,'end_phase')||!enabled(game,actor,YXS_GUARD_SKILLS.menshen,has_skill)||!target.alive
      ||game.turn_event_counter!==turnAtEntry||phaseId(game,actor,'end_phase',event)!==eventId){receipt.status='stale';return receipt;}
    const targetId=identity(game,target);
    s.guards[actorId]={guard_id:actorId,target_id:targetId,created_phase_id:eventId,created_turn:game.turn_event_counter,
      expires_on:'next_own_turn_begin',source_skill:YXS_GUARD_SKILLS.menshen};
    receipt.status='resolved';receipt.target_id=targetId;
    emit(game,`${actor.name}发动门神，保护${target.name}直到自己下次回合开始。`);
    return receipt;
  }catch(error){receipt.status='interrupted';throw error;}
}

/** Run globally at EVERY turn entry before skill hooks/prepare, even if a skill
 * was lost or the turn later skips. It does not clear other holders' guards. */
export function yxs_expire_menshen_on_turn_begin(game,actor){
  const s=state(game),id=identity(game,actor),had=!!s.guards[id];delete s.guards[id];return had;
}
/** Call on death/skill changes as well as before rewrite. Lost guards are deleted
 * permanently, so regaining the skill does not resurrect an expired effect.
 * HP<=0 with rescue pending is not final death; retain the mark but exclude
 * that holder from current target routing until alive again. */
export function yxs_prune_menshen(game,{has_skill}={}){
  requireFunction(has_skill,'has_skill(game, player, skill_id)');
  const guards=state(game).guards,players=new Map(game.all_players().map(p=>[identity(game,p),p]));
  const removed=[];
  for(const [id,guard] of Object.entries(guards)){
    const holder=players.get(id),target=players.get(guard.target_id);
    if(!holder||holder.dead||!target||target.dead||has_skill(game,holder,YXS_GUARD_SKILLS.menshen)!==true){
      delete guards[id];removed.push(id);
    }
  }
  return removed;
}

/** JSON-safe per-card-use context, shared by ALL original target branches. */
export function yxs_create_menshen_use_context(game,actor,{card_use_id,kind}={}){
  if(typeof card_use_id!=='string'||!card_use_id||!['sha','duel'].includes(kind))throw new TypeError('门神 requires explicit SHA/DUEL use ID and kind.');
  return {version:1,card_use_id,actor_id:identity(game,actor),kind,used_guard_ids:[],resolved_target_ids:[],branches:{}};
}
/** Return a rewritten EVENT, never apply damage or consume the attack again.
 * Original legality runs first. Final legality ignores distance and team policy
 * but must retain hard prohibitions. A skipped branch is explicit and replayable.
 * Multi-copy ordering is the host's current action_order; no arbitrary cap. */
export function yxs_redirect_menshen_branch(game,event,use,{has_skill,validate_original,validate_final,defer_final_claim=false}={}){
  requireFunction(validate_original,'validate_original(event)');requireFunction(validate_final,'validate_final(event)');
  const actor=event.card_user??event.source,original=event.target;
  if(use?.version!==1||use.card_use_id!==event.card_use_id||use.actor_id!==identity(game,actor)||use.kind!==event.kind
    ||typeof event.branch_id!=='string'||!event.branch_id)throw new TypeError('Mismatched 门神 card-use/branch context.');
  const originalId=identity(game,original),prior=use.branches[event.branch_id];
  if(prior){
    if(prior.original_target_id!==originalId)throw new Error('A 门神 branch ID cannot be reused for a different original target.');
    return {...event,target:game.all_players().find(p=>identity(game,p)===(prior.final_target_id??prior.target_id))??null,
      original_target:original,guard_receipt:prior,cancelled:prior.cancelled,replayed:true};
  }
  const receipt={branch_id:event.branch_id,original_target_id:originalId,target_id:originalId,
    visited_player_ids:[originalId],guard_ids:[],cancelled:false,reason:null,claimed:false,final_target_id:null};
  const finish=(target,reason=null)=>{
    receipt.target_id=target?identity(game,target):null;receipt.cancelled=reason!==null;receipt.reason=reason;
    use.branches[event.branch_id]=receipt;
    if(!receipt.cancelled&&!defer_final_claim){use.resolved_target_ids.push(receipt.target_id);receipt.claimed=true;receipt.final_target_id=receipt.target_id;}
    return {...event,target,original_target:original,guard_receipt:receipt,cancelled:receipt.cancelled,replayed:false};
  };
  if(!original?.alive||!actor?.alive||!validate_original(event))return finish(original,'illegal_original_target');
  yxs_prune_menshen(game,{has_skill});
  const guards=state(game).guards;
  const order=game.action_order();
  if(new Set(order).size!==order.length||game.all_players().some(p=>p.alive&&!order.includes(p)))throw new Error('门神 requires a complete unique action order.');
  let current=original;
  while(true){
    const guard=order.find(p=>p.alive&&guards[identity(game,p)]?.target_id===identity(game,current)
      &&!use.used_guard_ids.includes(identity(game,p))&&!receipt.visited_player_ids.includes(identity(game,p)));
    if(!guard)break;
    const id=identity(game,guard);use.used_guard_ids.push(id);receipt.guard_ids.push(id);receipt.visited_player_ids.push(id);current=guard;
  }
  const rewritten={...event,target:current,original_target:original,guard_receipt:receipt,ignore_distance:true,allow_allies:true};
  if(current===actor)return finish(current,'redirected_to_source');
  if(!current.alive||!validate_final(rewritten))return finish(current,'illegal_final_target');
  if(!defer_final_claim&&use.resolved_target_ids.includes(identity(game,current)))return finish(current,'duplicate_final_target');
  return finish(current);
}

/** When another target-changing mechanism (e.g. 沉鱼) follows 门神, request
 * defer_final_claim above and call this AFTER all target rewrites, BEFORE any
 * response. Dedupe the true endpoint, not a discarded intermediate target. */
export function yxs_finalize_menshen_branch(game,event,use,{validate_final}={}){
  requireFunction(validate_final,'validate_final(event)');
  const receipt=use?.branches?.[event.branch_id],actor=event.card_user??event.source;
  if(!receipt||use.card_use_id!==event.card_use_id||use.actor_id!==identity(game,actor)||use.kind!==event.kind)throw new TypeError('Missing/mismatched 门神 final branch.');
  if(receipt.cancelled)return {...event,guard_receipt:receipt,cancelled:true,replayed:true};
  const id=event.target?identity(game,event.target):null;
  if(receipt.claimed){
    if(receipt.final_target_id!==id)throw new Error('Cannot change an already claimed 门神 endpoint.');
    return {...event,guard_receipt:receipt,cancelled:false,replayed:true};
  }
  const reason=event.cancelled?'cancelled_after_redirect':!actor.alive||!event.target?.alive?'dead_final_target'
    :event.target===actor?'redirected_to_source':!validate_final({...event,ignore_distance:true,allow_allies:true})?'illegal_final_target'
    :use.resolved_target_ids.includes(id)?'duplicate_final_target':null;
  receipt.final_target_id=id;receipt.cancelled=reason!==null;receipt.reason=reason;receipt.claimed=true;
  if(!receipt.cancelled)use.resolved_target_ids.push(id);
  return {...event,guard_receipt:receipt,cancelled:receipt.cancelled,replayed:false};
}

export function yxs_fanji_eligible(game,actor,amount,source,event,{has_skill}={}){
  if(!enabled(game,actor,YXS_GUARD_SKILLS.fanji,has_skill)||!(amount>0)||!(event?.damage>0)||event.target!==actor
    ||!['sha','duel'].includes(event.kind)||event.chain_transfer||event.cancelled||event.prevented)return false;
  // Actual damage source wins over the original card user or a stale argument.
  const actual=event.source!==undefined?event.source:source;
  return !!actual?.alive&&actual!==actor&&game.all_players().includes(actual);
}
export function yxs_fanji_materials(game,actor,source){
  return game.forced_sha_materials(actor,source,{ignore_distance:true});
}
function sameMaterial(a,b){
  if(a.id!==b.id||a.zone!==b.zone)return false;
  if(a.zone==='multi_hand')return a.cards.length===b.cards.length&&a.cards.every((c,i)=>c===b.cards[i]);
  return a.card===b.card;
}
/** Effective color is queried with the material owner; no mutation of immutable
 * Card attributes. The luye exception applies ONLY to this weapon's pair. */
export function yxs_fanji_is_red(game,actor,card,material,weapon=actor.weapon){
  const effective=c=>game.effective_color?.(c,actor)??c.color;
  if(material?.zone==='multi_hand'&&(weapon?.equipment_id??weapon?.id)==='yxs.base.equipment.luye')return material.cards.some(c=>effective(c)===CardColor.RED);
  return effective(card)===CardColor.RED;
}
export function yxs_ai_fanji_material(game,actor,source,options){
  if(game.side_of(actor)===game.side_of(source))return null;
  // Only own materials and public target defenses influence the choice.
  return options.filter(m=>{
    const card=m.zone==='hand'&&is_sha_card(m.card)||m.card.virtual?m.card:game.material_sha(actor,m.card);
    const context={kind:'sha',source_card:card,nature:card.type===CardType.FIRE_SHA?'fire':card.type===CardType.THUNDER_SHA?'thunder':'normal'};
    context.armor_ignored=!!game.equipment_ignores_armor?.(actor,context);
    return !game.equipment_sha_immunity?.(actor,source,context);
  }).sort((a,b)=>{
    const cost=m=>m.zone==='multi_hand'?m.cards.reduce((n,card)=>n+game.material_ai_cost({zone:'hand',card}),0):game.material_ai_cost(m);
    return cost(a)-cost(b)||Number(yxs_fanji_is_red(game,actor,b.card,b))-Number(yxs_fanji_is_red(game,actor,a.card,a));
  })[0]??null;
}

/** Await after rescue, before 补刀. The host use_sha must support the context and
 * return actual positive direct-SHA damage_events; void is a contract failure.
 * No default damage is manufactured and active SHA quota is never consumed. */
export async function yxs_after_damage_fanji(game,actor,amount,source,event={}, {has_skill}={}){
  if(!yxs_fanji_eligible(game,actor,amount,source,event,{has_skill}))return null;
  if(typeof event.damage_event_id!=='string'||!event.damage_event_id)throw new TypeError('反击 requires a stable damage_event_id.');
  const actorId=identity(game,actor),eventId=event.damage_event_id,table=state(game).fanji;
  const previous=actorReceipt(table,eventId,actorId);if(previous)return previous;
  source=event.source!==undefined?event.source:source;
  const receipt=putReceipt(table,eventId,actorId,{damage_event_id:eventId,actor_id:actorId,source_id:identity(game,source),
    status:'selecting',used:false,suppress_original_budao:false,card_use_id:null,damage_events:[]});
  let options=yxs_fanji_materials(game,actor,source),chosen;
  if(!options.length){receipt.status='unavailable';return receipt;}
  try{
    if(actor.is_ai)chosen=yxs_ai_fanji_material(game,actor,source,options);
    else while(true){
      const answer=await game.view.ask_line(`反击：可立即对实际伤害来源${source.name}使用一张杀（红杀不可出闪）`,{
        kind:'choice',player_id:actorId,options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动反击'}],
        meta:{skill:'反击',skill_id:YXS_GUARD_SKILLS.fanji,stage:'fanji_material',damage_event_id:eventId,
          target_id:identity(game,source),private_to:actorId,ignore_distance:true,ignore_quota:true,compatibility:YXS_GUARD_COMPATIBILITY},
      });
      if(cancel(answer))break;chosen=select(options,answer);if(chosen)break;
      emit(game,'请选择仍可用的杀或转换素材，或取消。');
    }
    if(!chosen){receipt.status='declined';return receipt;}
    if(!yxs_fanji_eligible(game,actor,amount,source,event,{has_skill})){receipt.status='stale';return receipt;}
    options=yxs_fanji_materials(game,actor,source);
    const current=options.find(m=>sameMaterial(m,chosen));if(!current){receipt.status='stale';return receipt;}
    const weapon=actor.weapon,physical=current.zone==='multi_hand'?[...current.cards]:[current.card];
    // Resolve the projection BEFORE equipment costs leave; preserve the actual
    // elemental card, or a same-suit/rank virtual SHA with exact provenance.
    const projection=current.zone==='multi_hand'?game.two_card_sha(actor,physical)
      :current.zone==='hand'&&is_sha_card(current.card)?current.card:game.material_sha(actor,current.card,physical);
    const red=yxs_fanji_is_red(game,actor,projection,current,weapon);
    receipt.status='committed';
    const paid=await game.consume_material(actor,current,{to:'processing',reason:'反击'});
    if(!paid){receipt.status='stale';return receipt;}
    receipt.used=true;
    try{
      if(!actor.alive||!source.alive){receipt.status='resolved';return receipt;}
      const provenance=projection===physical[0]&&!projection.virtual?{kind:'physical',physical_card:physical[0],physical_cards:physical}
        :{kind:'virtual',source_skill:YXS_GUARD_SKILLS.fanji,physical_cards:physical};
      const result=await game.use_sha(actor,source,'反击',{source_card:projection,forced:true,ignore_distance:true,
        source_last_hand:actor.hand.length===0&&physical.some(c=>current.zone==='hand'||current.zone==='multi_hand'),
        use_provenance:provenance,source_skill:YXS_GUARD_SKILLS.fanji,parent_damage_event_id:eventId,dodge_blocked:red});
      if(!result||typeof result.card_use_id!=='string'||!Array.isArray(result.damage_events))throw new Error('反击 host use_sha must return {card_use_id, damage_events}.');
      receipt.card_use_id=result.card_use_id;
      for(const damage of result.damage_events){
        if(damage.kind!=='sha'||!(damage.damage>0)||damage.chain_transfer||damage.source!==actor
          ||(damage.card_use_id!=null&&damage.card_use_id!==result.card_use_id))continue;
        if(typeof damage.damage_event_id!=='string'||!damage.target)throw new Error('反击 damage receipt lacks stable event/target identity.');
        receipt.damage_events.push({damage_event_id:damage.damage_event_id,target_id:identity(game,damage.target),
          source_id:damage.source?identity(game,damage.source):null,card_use_id:damage.card_use_id??result.card_use_id,damage:damage.damage,kind:'sha'});
      }
      receipt.suppress_original_budao=receipt.damage_events.length>0;
      receipt.status='resolved';return receipt;
    }finally{for(const card of physical)game.finish_processing_card(card);}
  }catch(error){receipt.status=receipt.used?'interrupted_after_cost':'interrupted';throw error;}
}
export function yxs_fanji_suppresses_original_budao(game,event){
  return Object.values(state(game).fanji[event?.damage_event_id]??{}).some(receipt=>receipt.suppress_original_budao===true);
}

/** Explicit packet only; the parent integrates hooks and target declarations. */
export function yxs_sixth_guard_skill_definitions({SkillHooks,has_skill}){
  requireFunction(has_skill,'has_skill(game, player, skill_id)');
  return {hooks:{
    [YXS_SIXTH_GUARD_RULE_IDS.qin]:SkillHooks({
      after_damage_resolved:[(g,a,n,s,e)=>yxs_after_damage_fanji(g,a,n,s,e,{has_skill})],
      on_turn_begin:[(g,a)=>yxs_expire_menshen_on_turn_begin(g,a)],
      on_end_phase:[(g,a,t,e)=>yxs_on_end_phase_menshen(g,a,t,e,{has_skill})],
    }),
    [YXS_SIXTH_GUARD_RULE_IDS.li]:SkillHooks({before_discard:[(g,a,e)=>yxs_before_discard_kongju(g,a,e,{has_skill})]}),
  },active:{[YXS_SIXTH_GUARD_RULE_IDS.qin]:[],[YXS_SIXTH_GUARD_RULE_IDS.li]:[]}};
}
