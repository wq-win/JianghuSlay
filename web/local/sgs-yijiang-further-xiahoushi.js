/** 夏侯氏: complete Mobile base 身份 樵拾 + two-branch 燕语, 2026-10-15.
 * H0–H7 are explicit host contracts, not current Mobile-client certification.
 * Recast is physical hand loss, neither Slash use nor a discard action. */
import {is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_FURTHER_XIAHOUSHI_RULE_IDS=Object.freeze({xiahoushi:'sgs.adapted.base.hero.xiahou-shi'});
export const SGS_YIJIANG_FURTHER_XIAHOUSHI_SKILL_IDS=Object.freeze({qiaoshi:'sgs.qiaoshi',yanyu:'sgs.yanyu'});
const ID=SGS_YIJIANG_FURTHER_XIAHOUSHI_RULE_IDS,SK=SGS_YIJIANG_FURTHER_XIAHOUSHI_SKILL_IDS,FIELD='sgs_yijiang_further_xiahoushi_state';
export const SGS_YIJIANG_FURTHER_XIAHOUSHI_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7']),
  heroes:Object.freeze([Object.freeze({id:ID.xiahoushi,name:'夏侯氏',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'H0 host full-HP initialization',gender:'female',source_faction:'蜀',skill_ids:Object.freeze([SK.qiaoshi,SK.yanyu]),
    personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.qiaoshi]:'其他角色的结束阶段，若其手牌数等于你，你可以与其各摸一张牌。',
    [SK.yanyu]:'出牌阶段，你可以重铸【杀】；出牌阶段结束时，若你于此阶段内重铸过两张或更多的【杀】，则你可以令一名男性角色摸两张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-189.html','https://wiki.biligame.com/msgs/夏侯氏','https://wiki.biligame.com/msgs/技能概念介绍']),
  slash_host_extension:Object.freeze(['血杀','毒杀','刺杀']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const key=x=>JSON.stringify(x),copy=x=>JSON.parse(JSON.stringify(x)),record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null
    ?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(options,x)=>options.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?options[Number(x)-1]:null);
const meta=(g,a,id,stage,extra={})=>({skill:id===SK.qiaoshi?'樵拾':'燕语',skill_id:id,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),references=new WeakMap();
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`夏侯氏接入缺少 ${name}`);}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0
    ||['phases','recasts','bonuses','qiaoshi'].some(k=>!record(s[k]))
    ||Object.values(s.phases).some(p=>!stable(p.phase_id)||!stable(p.turn_id)||!Number.isSafeInteger(p.count)||p.count<1)
    ||['recasts','bonuses','qiaoshi'].some(k=>Object.values(s[k]).some(r=>!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'||!Array.isArray(r.draws)
      ||!['offered','paying','paid','drawing','done','failed'].includes(r.status))))throw Error('Invalid Xiahou Shi skill state');
  return s;
}
function readState(g,a){const s=a?.[FIELD];if(!s)return null;validateState(s);if(s.owner_id!==pid(g,a))throw Error('夏侯氏事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('夏侯氏需要稳定人物ID');return readState(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,phases:{},recasts:{},bonuses:{},qiaoshi:{}});}
export const sgs_clone_yijiang_further_xiahoushi_state=a=>a?.[FIELD]?copy(validateState(a[FIELD])):null;
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('夏侯氏需要稳定事件ID');const s=state(g,a),rk=`${space}:${key(id)}`,old=s[space][key(id)];
  let running=active.get(a);if(!running)active.set(a,running=new Set());let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(key(old.request)!==key(request)||known.has(rk)&&(known.get(rk).length!==refs.length||known.get(rk).some((v,i)=>v!==refs[i])))throw Error('同一夏侯氏事件不能更换人物、实体或事实');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('夏侯氏事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_YIJIANG_FURTHER_XIAHOUSHI_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false,draws:[]};running.add(r);known.set(rk,refs);
  return {r,finish(){r.status='done';running.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);running.delete(r);}};
}
function previous(g,a,space,id,request,refs=[]){if(!readState(g,a)?.[space][key(id)])return false;ticket(g,a,space,id,request,refs);return true;}
function nextId(g,a){const s=state(g,a);let id;do{if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('燕语事件计数耗尽');id=`yanyu:${key([pid(g,a),++s.counter])}`;}while(s.recasts[key(id)]);return id;}
const unfinished=(g,a,except=null)=>{const s=readState(g,a);return s&&['recasts','bonuses','qiaoshi'].some(k=>Object.values(s[k]).some(r=>r!==except&&r.status!=='done'));};
async function draw(g,a,count,r){
  const item={player_id:pid(g,a),requested:count,drawn:0,status:live(a)?'started':'skipped_dead'};r.draws.push(item);
  if(!live(a))return;if(!ongoing(g)){item.status='skipped_match_closed';return;}
  const cards=await g.draw_cards(a,count);item.drawn=Array.isArray(cards)?cards.length:null;item.status='done';
}
const phaseFacts=(g,a,e)=>({owner_id:pid(g,a),actor_id:pid(g,e.actor),phase_event_id:e.phase_event_id,turn_id:e.turn_id});
function endWindow(g,a,e){return owned(g,a,SK.qiaoshi)&&live(e.actor)&&e.actor!==a&&ongoing(g)
  &&g.actual_turn_active===true&&g.turn_phase==='end_phase'&&g.turn_actor===seat(g,e.actor)&&e.turn_id===g.turn_event_counter
  &&g.active_end_phase_id===e.phase_event_id&&e.stage==='start'&&stable(e.phase_event_id)&&stable(e.turn_id)&&!e.skipped&&!e.interrupted&&!e.closed&&!e.cancelled&&e.entered!==false;}
export const sgs_ai_qiaoshi=(g,a,other)=>typeof g.side_of==='function'&&g.side_of(a)===g.side_of(other);
/** GLOBAL actual END-start hook; dispatch each living holder in action order. */
export async function sgs_on_any_end_phase_start_qiaoshi(g,a,e={}){
  const id=e.phase_event_id,request=phaseFacts(g,a,e);
  if(previous(g,a,'qiaoshi',id,request,[e.actor]))return false;
  if(!endWindow(g,a,e)||unfinished(g,a))return false;
  methods(g,'draw_cards','action_order');
  const t=ticket(g,a,'qiaoshi',id,request,[e.actor]),r=t.r,bound=binding(g,a,SK.qiaoshi);
  r.owner_hand_count=a.hand.length;r.active_hand_count=e.actor.hand.length;
  const valid=()=>endWindow(g,a,e)&&key(phaseFacts(g,a,e))===key(request)&&binding(g,a,SK.qiaoshi)===bound&&a.hand.length===e.actor.hand.length;
  try{
    // An ineligible observation is final for this owner/window; later equal
    // counts cannot manufacture a second opportunity inside the same END.
    if(!valid()){r.ineligible=true;t.finish();return false;}
    const yes=a.is_ai?sgs_ai_qiaoshi(g,a,e.actor):await g.view.ask_confirm(`樵拾：你与${e.actor.name}均有${a.hand.length}张手牌，是否各摸一张牌？`,{
      player_id:seat(g,a),meta:meta(g,a,SK.qiaoshi,'qiaoshi_offer',{phase_event_id:id,active_id:pid(g,e.actor),owner_hand_count:a.hand.length,active_hand_count:e.actor.hand.length,draw_count_each:1,allow_enemies:true,optional:true})});
    if(!valid()){r.cancelled=true;t.finish();return false;}if(!yes){r.declined=true;t.finish();return false;}
    const order=g.action_order().filter(p=>p===a||p===e.actor);if(order.length!==2||new Set(order).size!==2)throw Error('樵拾需要完整且无重复的双方行动顺序');
    r.committed=true;r.status='drawing';r.recipient_ids=order.map(p=>pid(g,p));
    for(const recipient of order)await draw(g,recipient,1,r);
    t.finish();g.view.emit(`${a.name}发动樵拾，与${e.actor.name}各摸一张牌。`,{event_type:'skill_resolution',skill_id:SK.qiaoshi,phase_event_id:id});return true;
  }catch(error){t.fail(error);throw error;}
}
function ownPlay(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===seat(g,a)
  &&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(a.play_phase_id)&&stable(g.turn_event_counter)
  &&g.active_play_phase_id===a.play_phase_id;}
function idlePlay(g,a){return ownPlay(g,a)&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
function phaseReady(g,a,except=null){const s=readState(g,a),p=s?.phases[key(a.play_phase_id)];return (!p||p.turn_id===g.turn_event_counter)&&!s?.bonuses[key(a.play_phase_id)]&&!unfinished(g,a,except);}
export const sgs_yanyu_recast_count=(g,a,phase_id=a?.play_phase_id)=>readState(g,a)?.phases[key(phase_id)]?.count??0;
/** Owner-private choices. Current physical functional identity is used; use-only
 * conversions such as 武圣 never enter this recast path. Blood/poison/stab
 * Slash are explicit H5 host-family extensions, not native Mobile claims. */
export function sgs_yanyu_materials(g,a){
  if(!live(a))return [];
  return (a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}：${card}`}))
    .filter(m=>m.card&&!m.card.virtual&&is_sha_card(m.card)&&g.can_recast_material?.(a,m,{source:a,source_skill:SK.yanyu})!==false);
}
const exact=(options,m)=>m&&options.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||m.epoch===o.epoch));
const materialRequest=(g,m)=>m?{zone:m.zone,index:m.index,physical_id:m.card?g.card_history_material_id?.(m.card)??m.card.physical_id??m.card.physicalCardId??null:null,epoch:m.epoch??null}:null;
export const sgs_yanyu_available=(g,a)=>owned(g,a,SK.yanyu)&&idlePlay(g,a)&&phaseReady(g,a)&&sgs_yanyu_materials(g,a).length>0;
export function sgs_yanyu_unavailable_reason(g,a){
  if(!owned(g,a,SK.yanyu))return '当前不拥有燕语';if(!idlePlay(g,a))return '只能在自己的真实空闲出牌阶段重铸';
  if(!phaseReady(g,a))return '燕语正在处理、此阶段已结束或需要恢复原事务';return '需要一张实体杀手牌（含火、雷及本地扩展杀）';
}
export async function sgs_yanyu_execute(g,a,{event_id=null,phase_id=null,material=null,choose=false}={}){
  const phase=phase_id??a?.play_phase_id;
  if(material?.card?.virtual)return false;
  const old=event_id!==null?readState(g,a)?.recasts[key(event_id)]:null;
  // Reject malformed or ineligible first requests before allocating physical IDs.
  if(!old&&(!sgs_yanyu_available(g,a)||phase!==a?.play_phase_id||!choose&&!exact(sgs_yanyu_materials(g,a),material)))return false;
  const request={owner_id:pid(g,a),phase_id:phase,choose,material:materialRequest(g,material)},refs=material?[material.card]:[];
  if(event_id!==null&&previous(g,a,'recasts',event_id,request,refs))return false;
  if(!sgs_yanyu_available(g,a)||phase!==a.play_phase_id)return false;
  methods(g,'public_card_loss','draw_cards','card_location_epoch','card_history_material_id');
  if(g.public_card_loss_supports_on_committed!==true)throw Error('燕语需要 validate / on_committed 原子移牌边界');
  const id=event_id??nextId(g,a),t=ticket(g,a,'recasts',id,request,refs),r=t.r,turn=g.turn_event_counter,bound=binding(g,a,SK.yanyu);
  const valid=()=>owned(g,a,SK.yanyu)&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&phaseReady(g,a,r)&&binding(g,a,SK.yanyu)===bound;
  try{
    let chosen=material;
    if(choose){
      chosen=null;
      while(valid()&&!chosen){
        const options=sgs_yanyu_materials(g,a);if(!options.length)break;
        const answer=await g.view.ask_line('燕语：选择一张杀手牌重铸（不使用杀、不消耗出杀次数）',{
          kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不重铸'}],
          meta:meta(g,a,SK.yanyu,'yanyu_material',{event_id:id,phase_id:phase,recast_count:sgs_yanyu_recast_count(g,a),material_zone:'hand',semantic_action:'recast',optional:true})});
        if(!valid()||pass(answer)){r.cancelled=true;t.finish();return false;}
        chosen=select(options,answer);
        // A stale selected slot is rejected, never reinterpreted as a fresh card.
        if(chosen&&!exact(sgs_yanyu_materials(g,a),chosen)){r.cancelled=true;t.finish();return false;}
      }
    }
    if(!valid()||!exact(sgs_yanyu_materials(g,a),chosen)){r.cancelled=true;t.finish();return false;}
    chosen={...chosen,epoch:g.card_location_epoch(chosen.card)};
    const legal=()=>valid()&&Boolean(exact(sgs_yanyu_materials(g,a),chosen));
    const physicalId=g.card_history_material_id(chosen.card);if(!stable(physicalId))throw Error('燕语需要稳定实体牌ID');
    const currentFace=g.effective_card?.(chosen.card,a,{zone:'hand',action:'recast'})??chosen.card;
    const face={name:currentFace.name,type:currentFace.type,suit:currentFace.suit??null,color:currentFace.color??null,rank:currentFace.rank??null};
    r.turn_id=turn;r.status='paying';
    const moved=await g.public_card_loss(a,[chosen],{to:'discard',visibility:'public',reason:'燕语·重铸',action:'recast',semantic_action:'recast',source:a,source_skill:SK.yanyu,
      move_id:`yanyu:${key([pid(g,a),id])}:recast`,validate:legal,on_committed:(cards,movement)=>{
        if(cards.length!==1||cards[0]!==chosen.card)throw Error('燕语重铸回执必须恰好一张所选实体杀');
        r.committed=true;r.status='paid';r.move_id=movement.move_id;r.card_id=physicalId;r.recast_face={...face};
        const count=sgs_yanyu_recast_count(g,a,phase)+1;
        state(g,a).phases[key(phase)]={phase_id:phase,turn_id:turn,count,last_event_id:id};r.recast_count=count;
      }});
    if(moved?.committed&&!r.committed)throw Error('燕语重铸缺少原子提交回执');
    if(!r.committed){r.cancelled=true;t.finish();return false;}
    // Committed hand loss can trigger nested effects. Skill/form/phase changes
    // cannot undo it; only a dead recipient or closed match prevents its draw.
    r.status='drawing';await draw(g,a,1,r);t.finish();
    g.view.emit(`${a.name}发动燕语，重铸${face.name}并摸一张牌（本阶段${r.recast_count}张）。`,{event_type:'skill_resolution',skill_id:SK.yanyu,stage:'yanyu_recast',event_id:id,phase_id:phase,recast_count:r.recast_count});return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_resolve_yanyu=sgs_yanyu_execute;
export function sgs_yanyu_male_targets(g){return g.all_players().filter(p=>live(p)&&(g.effective_gender?.(p)??rule_hero(p)?.gender)==='male');}
export function sgs_ai_yanyu_target(g,a){return sgs_yanyu_male_targets(g).filter(p=>g.side_of?.(p)===g.side_of?.(a)&&typeof g.side_of==='function').sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp)[0]??null;}
function bonusWindow(g,a,e){return owned(g,a,SK.yanyu)&&ownPlay(g,a)&&e.actor===a&&e.entered===true&&!e.skipped&&!e.interrupted&&!e.closed&&!e.cancelled
  &&e.phase_event_id===a.play_phase_id&&e.turn_id===g.turn_event_counter;}
export async function sgs_on_play_phase_end_yanyu(g,a,_target,e={}){
  const id=e.phase_event_id,request=phaseFacts(g,a,e);
  if(previous(g,a,'bonuses',id,request,[e.actor]))return false;
  if(!bonusWindow(g,a,e)||unfinished(g,a))return false;
  methods(g,'draw_cards','all_players');
  const t=ticket(g,a,'bonuses',id,request,[e.actor]),r=t.r,bound=binding(g,a,SK.yanyu);r.recast_count=sgs_yanyu_recast_count(g,a,id);
  const valid=()=>bonusWindow(g,a,e)&&key(phaseFacts(g,a,e))===key(request)&&binding(g,a,SK.yanyu)===bound;
  try{
    if(r.recast_count<2){r.ineligible=true;t.finish();return false;}
    let target=null;
    if(a.is_ai)target=sgs_ai_yanyu_target(g,a);
    else while(valid()&&!target){
      const candidates=sgs_yanyu_male_targets(g);if(!candidates.length)break;
      const options=candidates.map(p=>({id:String(pid(g,p)),label:`${p.name}（男性，${p.hand.length}张手牌）`}));
      const answer=await g.view.ask_line(`燕语：本出牌阶段重铸了${r.recast_count}张杀，可令一名男性角色摸两张牌`,{
        kind:'choice',player_id:seat(g,a),options:[...options,{id:'pass',label:'不发动'}],
        meta:meta(g,a,SK.yanyu,'yanyu_bonus_target',{phase_event_id:id,recast_count:r.recast_count,draw_count:2,gender:'male',allow_enemies:true,allow_self:true,optional:true})});
      if(!valid()||pass(answer))break;
      const chosen=select(options,answer);target=candidates.find(p=>String(pid(g,p))===chosen?.id)??null;
      if(target&&!sgs_yanyu_male_targets(g).includes(target)){r.cancelled=true;t.finish();return false;}
    }
    if(!valid()){r.cancelled=true;t.finish();return false;}if(!target){r.declined=true;t.finish();return false;}
    if(!sgs_yanyu_male_targets(g).includes(target)){r.cancelled=true;t.finish();return false;}
    r.target_id=pid(g,target);r.committed=true;r.status='drawing';await draw(g,target,2,r);t.finish();
    g.view.emit(`${a.name}发动燕语，令${target.name}摸两张牌。`,{event_type:'skill_resolution',skill_id:SK.yanyu,stage:'yanyu_bonus',phase_event_id:id,target_id:r.target_id});return true;
  }catch(error){t.fail(error);throw error;}
}
export async function sgs_player_yanyu(g,a){if(!sgs_yanyu_available(g,a)){g.view.emit(`燕语：${sgs_yanyu_unavailable_reason(g,a)}。`);return true;}await sgs_yanyu_execute(g,a,{choose:true});return true;}
export function sgs_ai_yanyu_plan(g,a){
  // A bounded public-team policy prevents an all-Slash finite deck from causing
  // endless voluntary recasts. This is AI policy, never a human legality cap.
  if(!sgs_yanyu_available(g,a)||sgs_yanyu_recast_count(g,a)>=2||!sgs_ai_yanyu_target(g,a))return null;
  return sgs_yanyu_materials(g,a).sort((x,y)=>(g.material_ai_cost?.(x)??2)-(g.material_ai_cost?.(y)??2))[0]??null;
}
export async function sgs_ai_yanyu(g,a){const material=sgs_ai_yanyu_plan(g,a);return material?sgs_yanyu_execute(g,a,{material}):false;}
/** Pure public projection: no allocation and no pending cost or replacement face. */
export function sgs_yijiang_further_xiahoushi_public_state(a){
  if(!a?.[FIELD])return {yanyu_phases:[],yanyu_recasts:[],yanyu_bonuses:[],qiaoshi_events:[]};const s=validateState(a[FIELD]);
  const shared=r=>({event_id:r.event_id,status:r.status,committed:r.committed,declined:r.declined===true,cancelled:r.cancelled===true,ineligible:r.ineligible===true,draws:r.draws.map(d=>({...d}))});
  return {yanyu_phases:Object.values(s.phases).map(p=>({...p})),
    yanyu_recasts:Object.values(s.recasts).map(r=>({...shared(r),phase_id:r.request.phase_id,turn_id:r.turn_id??null,move_id:r.move_id??null,recast_count:r.recast_count??null,
      recast_face:r.committed?{...r.recast_face}:null})),
    yanyu_bonuses:Object.values(s.bonuses).map(r=>({...shared(r),phase_event_id:r.event_id,recast_count:r.recast_count,target_id:r.target_id??null})),
    qiaoshi_events:Object.values(s.qiaoshi).map(r=>({...shared(r),phase_event_id:r.event_id,active_id:r.request.actor_id,owner_hand_count:r.owner_hand_count,active_hand_count:r.active_hand_count,recipient_ids:[...(r.recipient_ids??[])]}))};
}
export function sgs_yijiang_further_xiahoushi_skill_definitions({SkillHooks,ActiveSkillDef}){
  const skill=new ActiveSkillDef({skill_id:SK.yanyu,hotkey:'q',button_label:'燕语·重铸',available:sgs_yanyu_available,player:sgs_player_yanyu,ai:sgs_ai_yanyu,
    help_text:'出牌阶段可不限次数重铸一张杀手牌并摸一张牌，不占出杀次数。仅在该出牌阶段结束时，若本阶段重铸至少两张杀，可令一名男性角色摸两张牌。'});
  skill.source_skill_id=SK.yanyu;skill.owns_target_selection=true;skill.unavailable_reason=sgs_yanyu_unavailable_reason;
  return {hooks:{[ID.xiahoushi]:SkillHooks({on_any_end_phase_start:[sgs_on_any_end_phase_start_qiaoshi],on_play_phase_end:[sgs_on_play_phase_end_yanyu]})},active:{[ID.xiahoushi]:[skill]}};
}
sgs_on_any_end_phase_start_qiaoshi.source_skill_id=SK.qiaoshi;
sgs_on_play_phase_end_yanyu.source_skill_id=SK.yanyu;
