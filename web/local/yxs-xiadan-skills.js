/** Historical 任恒之 / 任桓之, 4 HP, 侠胆.
 * RH1–RH9 are explicitly adopted Jianghu compatibility rules. The original
 * quota/precedence/disposition/use-versus-response edges remain unverified.
 * This independent module does not register heroes or replace host SHA rules.
 */
import {is_sha_type} from './models.js';
import {pindian_hand_options,pindian_player_id,pindian_rank,resolve_pindian} from './pindian.js';

export const YXS_XIADAN_RULE_ID='yxs.adapted.base.hero.ren-heng-zhi';
export const YXS_XIADAN_SOURCE=Object.freeze({
  id:YXS_XIADAN_RULE_ID,display_name:'任恒之',aliases:Object.freeze(['任桓之']),max_hp:4,gender:'male',faction:'民',
  source_variant:'historical-mobile-2015+desktop-2012+jianghu-RH1-RH9',
  historical_full_skill_and_own_faq_verified:true,current_client_rules_verified:false,source_only_exact_for_every_edge:false,
  adaptation_status:'RH1-RH9-adopted-Jianghu-compatibility',
  unresolved_original_edges:Object.freeze(['activation_quota','repeat_win_loss_precedence','compare_card_disposition','sha_use_vs_respond_after_loss']),
  source_urls:Object.freeze([
    'https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11669/m9012/201502/304256.shtml',
    'https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1702/m1622/201204/63904.shtml',
  ]),
});
const alive=p=>Boolean(p?.alive&&!p.dead);
const turnId=(g,d={})=>d.turn_id?.()??g.turn_event_counter??0;
const ownerKey=(g,p,d)=>JSON.stringify(pindian_player_id(g,p,d));
const ownPlay=(g,p)=>alive(p)&&!p.skip_play_stage&&(g.is_own_play_phase?.(p)??(g.turn_phase==='play'&&g.turn_actor===g.seat_of(p)));
const ongoing=g=>g.match_should_continue?g.match_should_continue():g.turn_phase!=='finished';
export const yxs_xiadan_targets=(game,actor)=>(game.all_players?.()??game.players??[]).filter(p=>p!==actor&&alive(p)&&(p.hand?.length??0)>0);
export function yxs_xiadan_available(game,actor,target=null){
  if(!ownPlay(game,actor)||!pindian_hand_options(actor).length)return false;
  const targets=yxs_xiadan_targets(game,actor);return target?targets.includes(target):targets.length>0;
}
export function yxs_xiadan_modifiers(game,actor,dependencies={}){
  const state=game.xiadan_turn_modifiers?.[ownerKey(game,actor,dependencies)];
  return state?.turn_id===turnId(game,dependencies)?state:null;
}

/** The host must invoke these regardless of current skill ownership. A lost
 * skill does not revoke an already generated turn modifier. An extra play
 * phase must NOT call expiry; turn-finally does, even on death/interruption.
 */
export function yxs_xiadan_turn_begin(game,_actor=null,_event=null,dependencies={}){
  const current=turnId(game,dependencies);
  for(const [key,state] of Object.entries(game.xiadan_turn_modifiers??{}))if(state.turn_id!==current)delete game.xiadan_turn_modifiers[key];
  for(const [key,state] of Object.entries(game.xiadan_ai_plans??{}))if(state.turn_id!==current)delete game.xiadan_ai_plans[key];
}
export function yxs_xiadan_turn_end(game,actor,options={}){
  const dependencies=options.dependencies??{},turn_id=options.turn_id??turnId(game,dependencies);
  const key=ownerKey(game,actor,dependencies);
  if(game.xiadan_turn_modifiers?.[key]?.turn_id===turn_id)delete game.xiadan_turn_modifiers[key];
  if(game.xiadan_ai_plans?.[key]?.turn_id===turn_id)delete game.xiadan_ai_plans[key];
}
export function yxs_xiadan_sha_prohibited(game,actor,{response=false,dependencies={}}={}){
  return !response&&Boolean(yxs_xiadan_modifiers(game,actor,dependencies)?.lost);
}
export function yxs_xiadan_sha_allowance(game,actor,base=1,dependencies={}){
  return yxs_xiadan_modifiers(game,actor,dependencies)?.won?Math.max(base,2):base;
}
export function yxs_xiadan_sha_target_cap(game,actor,base=1,dependencies={}){
  return yxs_xiadan_modifiers(game,actor,dependencies)?.won?Math.max(base,2):base;
}
export function yxs_xiadan_attack_range(game,actor,base=1,{card_type='杀',dependencies={}}={}){
  return is_sha_type(card_type)&&yxs_xiadan_modifiers(game,actor,dependencies)?.won?Infinity:base;
}
/** A calculation helper, not a replacement for target prohibitions, ordinary
 * conversions, equipment snapshots, or real multi-target combat resolution. */
export function yxs_xiadan_sha_status(game,actor,{base_allowance=1,base_target_cap=1,base_range=1,used=actor.sha_count_this_turn??0,hard_prohibited=false,dependencies={}}={}){
  const allowance=yxs_xiadan_sha_allowance(game,actor,base_allowance,dependencies),prohibited=hard_prohibited||yxs_xiadan_sha_prohibited(game,actor,{dependencies});
  return {prohibited,allowance,used,remaining:prohibited?0:Math.max(0,allowance-used),can_use:!prohibited&&used<allowance,
    target_cap:yxs_xiadan_sha_target_cap(game,actor,base_target_cap,dependencies),attack_range:yxs_xiadan_attack_range(game,actor,base_range,{dependencies})};
}

export async function yxs_resolve_xiadan(game,actor,target,{compare_id,initiator_card=null,dependencies={}}={}){
  const turn=turnId(game,dependencies),phase=game.play_phase_event_counter;
  const result=await resolve_pindian(game,actor,target,{compare_id,initiator_card,disposition:'discard',reason:'侠胆',dependencies,
    validate:()=>turn===turnId(game,dependencies)&&phase===game.play_phase_event_counter&&yxs_xiadan_available(game,actor,target),
  });
  if(!result.committed)return false;
  const key=JSON.stringify(result.compare_id),receipts=game.xiadan_effect_receipts??={};
  if(Object.hasOwn(receipts,key))return true;
  // A paid comparison is never undone or re-asked after poison/rescue/death.
  const applicable=alive(actor)&&ongoing(game)&&turn===turnId(game,dependencies);
  receipts[key]={compare_id:result.compare_id,owner:pindian_player_id(game,actor,dependencies),turn_id:turn,applied:applicable,outcome:result.outcome};
  if(!applicable)return true;
  const owner=ownerKey(game,actor,dependencies),states=game.xiadan_turn_modifiers??={};
  let state=states[owner];if(state?.turn_id!==turn)state=states[owner]={owner:pindian_player_id(game,actor,dependencies),turn_id:turn,won:false,lost:false,compare_ids:[]};
  state.won ||= result.won;state.lost ||= !result.won;state.compare_ids.push(result.compare_id);
  game.view?.emit?.(result.won?'侠胆获胜：本回合杀的普通总许可至少2次、目标上限至少2、攻击范围无限。':'侠胆未赢：本回合不能使用杀，纯打出杀响应仍可。',{
    event_type:'xiadan_result',compare_id:result.compare_id,owner:state.owner,turn_id:turn,won:state.won,prohibit_sha_use:state.lost,
  });
  return true;
}

export async function yxs_player_xiadan(game,actor,_fallback,args=[],dependencies={}){
  if(!yxs_xiadan_available(game,actor))return true;
  let card=null;
  if(args.length){
    if(args.length!==1)return false;
    const option=pindian_hand_options(actor).find(o=>o.id===args[0]||String(o.index+1)===args[0]);
    if(!option)return false;card=option.card;
  }
  const turn=turnId(game,dependencies),phase=game.play_phase_event_counter;
  const targets=yxs_xiadan_targets(game,actor);
  const target=dependencies.choose_target?await dependencies.choose_target(actor,targets):await game.choose_card_target(actor,targets,{card_name:'侠胆·拼点对象',stage:'xiadan_target',cancellable:true});
  if(target&&turn===turnId(game,dependencies)&&phase===game.play_phase_event_counter&&yxs_xiadan_available(game,actor,target))await yxs_resolve_xiadan(game,actor,target,{initiator_card:card,dependencies});
  return true;
}

/** One attempt is the default AI strategy budget, NOT a skill action quota.
 * Human and direct legal compares remain repeatable. Target selection reads
 * only public HP, team, and hand count; card selection reads only its own hand.
 */
export async function yxs_ai_xiadan(game,actor,dependencies={}){
  if(!yxs_xiadan_available(game,actor)||yxs_xiadan_modifiers(game,actor,dependencies)?.lost)return false;
  const key=ownerKey(game,actor,dependencies),turn=turnId(game,dependencies),plans=game.xiadan_ai_plans??={};
  const plan=plans[key]?.turn_id===turn?plans[key]:(plans[key]={turn_id:turn,attempts:0});
  const budget=dependencies.ai_strategy_budget??1;
  if(plan.attempts>=budget)return false;
  const options=pindian_hand_options(actor).sort((a,b)=>pindian_rank(b.card)-pindian_rank(a.card)||a.index-b.index);
  if(pindian_rank(options[0]?.card)<10)return false;
  const targets=yxs_xiadan_targets(game,actor).filter(p=>!game.side_of||game.side_of(p)!==game.side_of(actor)).sort((a,b)=>a.hp-b.hp||a.hand.length-b.hand.length);
  if(!targets.length)return false;
  plan.attempts++;
  return yxs_resolve_xiadan(game,actor,targets[0],{initiator_card:options[0].card,dependencies});
}

/** Constructor injection avoids registry import cycles. No automatic install. */
export function yxs_xiadan_skill_definitions({SkillHooks,ActiveSkillDef,dependencies={}}){
  const active=new ActiveSkillDef({skill_id:'侠胆',hotkey:'q',button_label:'侠胆',
    help_text:'侠胆：与其他有手牌角色各选1手牌拼点；赢后本回合杀总许可至少2、目标至少2、范围无限；没赢则本回合禁用杀。可重复发动。',
    player:(g,a,t,args=[])=>yxs_player_xiadan(g,a,t,args,dependencies),ai:(g,a)=>yxs_ai_xiadan(g,a,dependencies),available:yxs_xiadan_available,
    arg_mode:'exactly_n',min_cards:1,max_cards:1,card_filter:'any'});
  active.targets=yxs_xiadan_targets;active.owns_target_selection=true;
  return {hooks:{[YXS_XIADAN_RULE_ID]:SkillHooks()},active:{[YXS_XIADAN_RULE_ID]:[active]}};
}
