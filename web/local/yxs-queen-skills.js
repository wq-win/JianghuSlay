/** Historical 武则天: complete named skills, explicit WZ1-WZ8 adaptations.
 * This module does not install production registry, scheduler or UI wiring.
 * See docs/yxs-final-classic/queen-rules.md for contracts and unknown boundaries.
 */
import {CardColor,CardType} from './models.js';
import {create_seat_order,ensure_seat_order,seat_player_id,swap_seats,next_seat_actor,stable_actor_id} from './seat-order.js';
export const YXS_QUEEN_RULE_ID='yxs.adapted.base.hero.wu-ze-tian';
export const YXS_QUEEN_SKILLS=Object.freeze({qiandu:'yxs.qiandu',nvquan:'yxs.nvquan'});
export const YXS_QUEEN_SOURCE=Object.freeze({
  id:YXS_QUEEN_RULE_ID,display_name:'武则天',max_hp:4,gender:'female',faction:'君',
  full_skill_names:Object.freeze(['迁都','女权']),
  source_variant:'historical-mobile-2015+official-desktop-2012-hp+Jianghu-WZ1-WZ8',
  historical_full_skill_and_own_faq_verified:true,current_client_rules_verified:false,
  source_only_exact_for_every_edge:false,production_integration_verified:false,
  source_unknowns:Object.freeze(['qiandu_self_target','qiandu_quota','mid_resolution_seat_queue']),
  source_urls:Object.freeze([
    'https://yxsm.qq.com/webplat/info/news_version3/11657/11658/11665/11666/11667/m9012/201502/304231.shtml',
    'https://yxs.qq.com/webplat/info/news_version3/416/1620/1695/1696/1700/m1622/201203/59694.shtml',
  ]),
});
const alive=p=>Boolean(p?.alive&&!p.dead);
const players=g=>g.all_players?.()??g.players??[];
const ongoing=g=>g.match_should_continue?g.match_should_continue():g.turn_phase!=='finished';
const id=(g,p,d)=>seat_player_id(g,p,d);
const keyOf=value=>JSON.stringify(stable_actor_id(value));
const own=(g,p,skill,d)=>{
  if(typeof d.has_skill!=='function')throw Error('Queen module requires effective has_skill(game, actor, skill_id)');
  return Boolean(d.has_skill(g,p,skill));
};
const ownPlay=(g,p)=>alive(p)&&!p.skip_play_stage&&Boolean(g.is_own_play_phase?.(p));
const gender=(g,p,d)=>d.effective_gender?.(g,p)??g.effective_gender?.(p)??null;
const state=g=>g.yxs_queen_state??={version:1,counter:0,qiandu:{},exchanges:{},ai:{}};
const runtimes=new WeakMap();
const runtime=g=>{let r=runtimes.get(g);if(!r)runtimes.set(g,r={pending:new Map(),references:new Map()});return r;};
function nextId(g,prefix){const s=state(g);if(!Number.isSafeInteger(s.counter)||s.counter<0||s.counter===Number.MAX_SAFE_INTEGER)throw Error('Invalid queen event counter');return `${prefix}:${++s.counter}`;}
const cardRecord=c=>({physical_id:c?.physical_id??c?.physicalCardId??c?.derived_identity??null,name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const pendingError=()=>Object.assign(Error('Queen transaction interrupted; restore its original task or replay the action log. Do not pay or respond again.'),{code:'QUEEN_PENDING_REPLAY_REQUIRED'});
function prior(g,namespace,event_id,request,refs=null,{reentrant=false}={}){
  const key=keyOf(event_id),receipt=state(g)[namespace][key],rt=runtime(g),runtimeKey=`${namespace}:${key}`;
  if(!receipt)return null;
  if(JSON.stringify(receipt.request)!==JSON.stringify(request))throw Error('A queen event ID cannot change its actors, materials or response rule');
  const original=rt.references.get(runtimeKey);
  if(refs&&original&&(refs.length!==original.length||refs.some((v,i)=>v!==original[i])))throw Error('A queen event ID cannot substitute physical references');
  if(rt.pending.has(runtimeKey)){
    if(reentrant)throw pendingError(); // Waiting on one's own loss/response callback would deadlock.
    return rt.pending.get(runtimeKey);
  }
  if(receipt.status==='done')return Promise.resolve(receipt.result);
  throw pendingError();
}
function run(g,namespace,event_id,request,refs,body){
  const key=keyOf(event_id),runtimeKey=`${namespace}:${key}`,rt=runtime(g);
  const receipt=state(g)[namespace][key]={event_id,request,status:'pending',stage:'validate',committed:false};
  if(refs)rt.references.set(runtimeKey,refs);
  const task=Promise.resolve().then(()=>body(receipt)).catch(error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>rt.pending.delete(runtimeKey));
  rt.pending.set(runtimeKey,task);return task;
}
const finish=(receipt,result)=>{receipt.status='done';receipt.stage='complete';receipt.result=result;return result;};
export function yxs_qiandu_materials(game,actor){
  return game.skill_material_options(actor).filter(m=>m.zone==='hand'&&!m.card.virtual&&game.effective_color(m.card,actor)===CardColor.BLACK);
}
export function yxs_qiandu_targets(game,_actor){return players(game).filter(alive);}
export function yxs_qiandu_available(game,actor,target=null,dependencies={}){
  if(!own(game,actor,YXS_QUEEN_SKILLS.qiandu,dependencies)||!ownPlay(game,actor)||!['1v1','1v2'].includes(game.mode))return false;
  const targets=yxs_qiandu_targets(game,actor);
  return yxs_qiandu_materials(game,actor).length>=2&&(target===null?targets.length>0:targets.includes(target));
}
export function yxs_qiandu_preview(game,actor,target,dependencies={}){
  const seats=ensure_seat_order(game,dependencies),copy=create_seat_order(seats.order);
  const actor_id=id(game,actor,dependencies),target_id=id(game,target,dependencies);
  swap_seats(copy,actor_id,target_id,{event_id:'preview'});
  const living_ids=players(game).filter(alive).map(p=>id(game,p,dependencies));
  return {actor_id,target_id,order:[...copy.order],changed:actor!==target,next_actor_id:next_seat_actor(copy,actor_id,{living_ids})};
}
/** Two exact hand cards move in a single normal public_card_loss transaction.
 * The cost is irreversible after commit; all loss/poison/rescue hooks finish
 * before swap. Recovery at zero HP may permit it; final death never does.
 */
export function yxs_resolve_qiandu(game,actor,target,materials,{event_id=null,dependencies={},reentrant=false}={}){
  materials=Array.isArray(materials)?materials.map(m=>({...m})):[];
  if(event_id===null)do{event_id=nextId(game,'qiandu');}while(Object.hasOwn(state(game).qiandu,keyOf(event_id)));
  const request={actor_id:id(game,actor,dependencies),target_id:id(game,target,dependencies),materials:materials.map(m=>({zone:m.zone??null,index:m.index??null,card:cardRecord(m.card)}))};
  const refs=[actor,target,...materials.map(m=>m.card)];
  try{const old=prior(game,'qiandu',event_id,request,refs,{reentrant});if(old)return old;}catch(error){return Promise.reject(error);}
  return run(game,'qiandu',event_id,request,refs,async receipt=>{
    if(!yxs_qiandu_available(game,actor,target,dependencies)||materials.length!==2||new Set(materials.map(m=>m.card)).size!==2)return finish(receipt,{committed:false,swapped:false,event_id});
    const current=yxs_qiandu_materials(game,actor);
    if(materials.some(m=>!current.some(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index)))return finish(receipt,{committed:false,swapped:false,event_id});
    const seats=ensure_seat_order(game,dependencies); // Fail before payment if stable identity is invalid.
    if(typeof game.public_card_loss!=='function')throw Error('迁都 requires the atomic awaited public_card_loss host contract');
    receipt.stage='cost';receipt.move_id=`qiandu-cost:${keyOf(event_id)}`;
    let moved;
    try{moved=await game.public_card_loss(actor,materials,{to:'discard',visibility:'public',reason:'迁都',action:'discard',move_id:receipt.move_id});}
    finally{receipt.committed=Boolean(moved?.committed??game.card_move_receipts?.[keyOf(receipt.move_id)]?.committed);}
    if(!receipt.committed)return finish(receipt,{committed:false,swapped:false,event_id});
    receipt.stage='swap';
    if(!alive(actor)||!alive(target)||!ongoing(game))return finish(receipt,{committed:true,swapped:false,event_id,interrupted:true});
    const swap=swap_seats(seats,request.actor_id,request.target_id,{event_id:`qiandu-seat:${keyOf(event_id)}`});
    const living_ids=players(game).filter(alive).map(p=>id(game,p,dependencies));
    const result={committed:true,swapped:swap.changed,event_id,order:[...seats.order],next_actor_id:next_seat_actor(seats,request.actor_id,{living_ids})};
    finish(receipt,result);
    game.view?.emit?.(`${actor.name}发动迁都${actor===target?'，选择自己，座次不变':`，与${target.name}交换座位`}。`,{event_type:'qiandu',...result,actor_id:request.actor_id,target_id:request.target_id});
    return result;
  });
}
export async function yxs_player_qiandu(game,actor,_fallback,args=[],dependencies={}){
  if(!yxs_qiandu_available(game,actor,null,dependencies))return true;
  const turn=game.turn_event_counter,phase=game.play_phase_event_counter,options=yxs_qiandu_materials(game,actor);
  const parse=answer=>String(answer).trim().split(/\s+/).map(value=>options.find(o=>o.id===value||String(o.index+1)===value));
  const valid=pair=>pair.length===2&&pair.every(Boolean)&&pair[0].card!==pair[1].card;
  let pair;
  if(args.length){pair=parse(args.join(' '));if(!valid(pair))return false;}
  else while(!pair){
    const answer=await game.view.ask_line('迁都：选择两张黑色手牌，编号空格分隔；取消不付费。',{kind:'select_hand',player_id:id(game,actor,dependencies),min_count:2,max_count:2,
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消'}],meta:{skill:'迁都',stage:'qiandu_cost',material_zones:['hand'],private_to:id(game,actor,dependencies)}});
    if(['cancel','0'].includes(String(answer).trim()))return true;
    const choice=parse(answer);if(valid(choice))pair=choice;else game.view.emit('必须选择两张不同的黑色手牌。');
  }
  const targets=yxs_qiandu_targets(game,actor);
  let target=null;
  if(dependencies.choose_target)target=await dependencies.choose_target(actor,targets);
  else{
    const previews=targets.map(p=>yxs_qiandu_preview(game,actor,p,dependencies));
    const byId=new Map(players(game).map(p=>[id(game,p,dependencies),p]));
    const targetOptions=targets.map((p,i)=>({id:String(id(game,p,dependencies)),label:`${p.name}${p===actor?'（只付成本，不换位）':''}；之后行动：${byId.get(previews[i].next_actor_id)?.name??'无'}`}));
    while(!target){
      const answer=String(await game.view.ask_line('迁都：选择换位对象（自选不换位）',{kind:'choice',player_id:id(game,actor,dependencies),
        options:[...targetOptions,{id:'cancel',label:'取消，不消耗牌'}],meta:{skill:'迁都',stage:'qiandu_target',seat_previews:previews}})).trim();
      if(['cancel','0'].includes(answer))return true;
      const selected=targetOptions.find(o=>o.id===answer)??(/^\d+$/.test(answer)?targetOptions[Number(answer)-1]:null);
      target=targets.find(p=>String(id(game,p,dependencies))===selected?.id)??null;
      if(!target)game.view.emit('请选择存活角色，或取消。');
    }
  }
  if(target&&turn===game.turn_event_counter&&phase===game.play_phase_event_counter)await yxs_resolve_qiandu(game,actor,target,pair,{dependencies});
  return true;
}
/** Conservative public/team strategy: only swap if it makes the next actor an
 * ally instead of an enemy. It reads one's own materials and public allegiance,
 * never another hand. One attempt/turn is an AI budget, not a rules quota.
 */
export function yxs_ai_qiandu_target(game,actor,dependencies={}){
  if(typeof game.side_of!=='function')return null;
  const seats=ensure_seat_order(game,dependencies),living=players(game).filter(alive),actorId=id(game,actor,dependencies);
  const living_ids=living.map(p=>id(game,p,dependencies)),byId=new Map(living.map(p=>[id(game,p,dependencies),p]));
  const current=byId.get(next_seat_actor(seats,actorId,{living_ids})),side=game.side_of(actor);
  if(!current||game.side_of(current)===side)return null;
  return living.find(target=>target!==actor&&game.side_of(byId.get(yxs_qiandu_preview(game,actor,target,dependencies).next_actor_id))===side)??null;
}
export async function yxs_ai_qiandu(game,actor,dependencies={}){
  if(!yxs_qiandu_available(game,actor,null,dependencies))return false;
  const key=keyOf(id(game,actor,dependencies)),turn=game.turn_event_counter??0,plans=state(game).ai;
  if(plans[key]?.turn_id===turn)return false;
  const target=yxs_ai_qiandu_target(game,actor,dependencies);if(!target)return false;
  const materials=yxs_qiandu_materials(game,actor).sort((a,b)=>(game.material_ai_cost?.(a)??0)-(game.material_ai_cost?.(b)??0)).slice(0,2);
  plans[key]={turn_id:turn,attempted:true};
  return (await yxs_resolve_qiandu(game,actor,target,materials,{dependencies})).committed;
}
/** Call for both original declaration and final redirected duel target, before
 * payment and before branch resolution respectively. It is not late immunity.
 */
export function yxs_nvquan_prohibits_duel(game,duel_user,target,dependencies={}){
  return Boolean(alive(duel_user)&&alive(target)&&gender(game,duel_user,dependencies)==='male'&&own(game,target,YXS_QUEEN_SKILLS.nvquan,dependencies));
}
export function yxs_nvquan_sha_requirement(game,duel_user,responder,{base_required=1}={},dependencies={}){
  if(!Number.isSafeInteger(base_required)||base_required<1)throw Error('Duel response requirement must be a positive integer');
  const boosted=duel_user!==responder&&alive(duel_user)&&gender(game,responder,dependencies)==='male'&&own(game,duel_user,YXS_QUEEN_SKILLS.nvquan,dependencies);
  return Math.max(base_required,boosted?2:1);
}
/** One duel EXCHANGE, not the whole card. The host preserves original duel_user,
 * resolves nullification/redirects first, and applies one normal damage on a
 * failed non-interrupted result. Real play_required_card performs each material
 * movement and after-response hook, so a first response may draw the second.
 * Never precheck that the responder already owns two SHA.
 */
export function yxs_resolve_duel_exchange(game,{duel_id,exchange_id,duel_user,responder,opponent,base_required=1,source_card=null,card_use_id=null,branch_id=null},dependencies={}){
  stable_actor_id(duel_id);stable_actor_id(exchange_id);
  const required=yxs_nvquan_sha_requirement(game,duel_user,responder,{base_required},dependencies);
  const request={duel_id,duel_user_id:id(game,duel_user,dependencies),responder_id:id(game,responder,dependencies),opponent_id:id(game,opponent,dependencies),base_required,card_use_id,branch_id,source_card:source_card?cardRecord(source_card):null};
  try{const old=prior(game,'exchanges',exchange_id,request,[duel_user,responder,opponent],{reentrant:dependencies.reentrant});if(old)return old;}catch(error){return Promise.reject(error);}
  return run(game,'exchanges',exchange_id,request,[duel_user,responder,opponent],async receipt=>{
    if(responder===opponent||![responder,opponent].includes(duel_user)||[duel_user,responder,opponent].some(p=>!players(game).includes(p)))throw Error('Duel exchange requires two distinct current actors and their original duel user');
    receipt.required=required;receipt.supplied=0;
    const result=interrupted=>({duel_id,exchange_id,required,supplied:receipt.supplied,success:receipt.supplied===required&&!interrupted,interrupted});
    if(!alive(duel_user)||!alive(responder)||!alive(opponent)||!ongoing(game))return finish(receipt,result(true));
    if(typeof game.play_required_card!=='function')throw Error('女权 requires awaited play_required_card with normal material and response hooks');
    for(let n=0;n<required;n++){
      receipt.stage='response';receipt.response_id=`duel-response:${keyOf(exchange_id)}:${n+1}`;
      const context={kind:'duel',duel_id,duel_user_id:request.duel_user_id,exchange_id,response_request_id:receipt.response_id,required,supplied:n,source_card,card_use_id,branch_id};
      const accepted=await game.play_required_card(responder,CardType.SHA,'杀',{response_context:context});
      if(accepted){receipt.supplied++;receipt.committed=true;}
      if(!alive(duel_user)||!alive(responder)||!alive(opponent)||!ongoing(game))return finish(receipt,result(true));
      if(!accepted)return finish(receipt,result(false));
      game.view?.emit?.(`${responder.name}已响应${receipt.supplied}/${required}张杀。`,{event_type:'duel_response_progress',duel_id,exchange_id,actor_id:request.responder_id,required,supplied:receipt.supplied});
    }
    return finish(receipt,result(false));
  });
}
/** Explicit constructor injection; copied skill owners must use the same helpers.
 * Queen's origin-sensitive response hook is NOT put into the old three-argument
 * duel_shas_required hook: that legacy call has no original duel-user context.
 */
export function yxs_queen_skill_definitions({SkillHooks,ActiveSkillDef,has_skill,dependencies={}}){
  const deps={...dependencies,has_skill:has_skill??dependencies.has_skill};
  if(typeof deps.has_skill!=='function')throw Error('Queen registration requires effective has_skill');
  const active=new ActiveSkillDef({skill_id:'迁都',hotkey:'q',button_label:'迁都',
    help_text:'迁都：弃两张黑色手牌，与任意存活角色换位；从本人新位置逆时针续行。可重复；自选只支付成本。',
    player:(g,a,t,args=[])=>yxs_player_qiandu(g,a,t,args,deps),ai:(g,a)=>yxs_ai_qiandu(g,a,deps),available:(g,a,t=null)=>yxs_qiandu_available(g,a,t,deps),
    arg_mode:'exactly_n',min_cards:2,max_cards:2,card_filter:'black'});
  active.targets=yxs_qiandu_targets;active.owns_target_selection=true;
  return {hooks:{[YXS_QUEEN_RULE_ID]:SkillHooks()},active:{[YXS_QUEEN_RULE_ID]:[active]}};
}
