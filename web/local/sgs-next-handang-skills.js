/** 韩当: complete Mobile official catalog119 whole-TURN variant, 2026-10-15.
 * BWIKI's phase-duration branch is deliberately NOT merged. N0/N9–N13 are
 * disclosed host contracts; no present-client certification is claimed. */
import {CardType} from './models.js';
import {rule_hero} from './effective-hero.js';
export const SGS_NEXT_HANDANG_RULE_IDS=Object.freeze({handang:'sgs.adapted.base.hero.han-dang'});
export const SGS_NEXT_HANDANG_SKILL_IDS=Object.freeze({gongqi:'sgs.gongqi',jiefan:'sgs.jiefan'});
export const SGS_NEXT_HANDANG_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-official-catalog-119-turn-duration-snapshot-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['N0','N9','N10','N11','N12','N13']),
  heroes:Object.freeze([Object.freeze({id:SGS_NEXT_HANDANG_RULE_IDS.handang,name:'韩当',max_hp:4,starting_hp:4,
    starting_hp_direct_source_value:null,starting_hp_basis:'N0 host full-HP initialization',gender:'male',source_faction:'吴',
    skill_ids:Object.freeze(['sgs.gongqi','sgs.jiefan']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    'sgs.gongqi':'出牌阶段限一次，你可以弃置一张牌，然后你本回合的的攻击范围无限。若你以此法弃置的牌为装备牌，你可以弃置一名其他角色的一张牌。',
    'sgs.jiefan':'限定技，出牌阶段，你可以选择一名角色，然后令攻击范围内含有该角色的所有角色各选择一项：1.弃置一张武器牌；2.令其摸一张牌。',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-119.html','https://wiki.biligame.com/msgs/韩当']),
  bwiki_revision:37830,unselected_variant:'mobile-bwiki-base-classic-phase-duration-revision37830',
});
const ID=SGS_NEXT_HANDANG_RULE_IDS,SK=SGS_NEXT_HANDANG_SKILL_IDS,FIELD='sgs_next_handang_state';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const EQUIPMENT=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const extant=a=>Boolean(a&&!a.dead),live=a=>extant(a)&&a.hp>0;
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&g.has_general_skill?.(a,id)===true;
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const inPlay=(g,a)=>live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&!a.skip_play_stage
  &&(g.is_own_actual_turn?.(a)??g.turn_actor===seat(g,a))&&g.is_own_play_phase(a);
const idlePlay=(g,a)=>inPlay(g,a)&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const pass=v=>['cancel','pass','0','n','no','decline'].includes(String(v));
const select=(options,v)=>options.find(o=>o.id===String(v))??(/^\d+$/.test(String(v))?options[Number(v)-1]:null);
const meta=(g,a,skill,stage,extra={})=>({skill:skill===SK.gongqi?'弓骑':'解烦',skill_id:skill,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),refs=new WeakMap();
const key=x=>JSON.stringify(x);
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||typeof s.jiefan_marker?.used!=='boolean'
    ||s.jiefan_marker.used&&!stable(s.jiefan_marker.event_id)||['gongqi','gongqi_phases','jiefan'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))
    ||s.range_effect!==null&&(!s.range_effect||!stable(s.range_effect.turn_id)||!stable(s.range_effect.event_id)))throw Error('Invalid Han Dang state');return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('韩当技能需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,counter:0,gongqi:{},gongqi_phases:{},jiefan:{},jiefan_marker:{used:false,event_id:null},range_effect:null};
  validateState(s);if(s.owner_id!==owner)throw Error('韩当限定标记与事务不能继承另一人物');return s;
}
export const sgs_clone_next_handang_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
function ticket(g,a,space,id,request,references=[]){
  if(!stable(id))throw Error('韩当技能需要稳定事件ID');const s=state(g,a),old=s[space][key(id)],rk=`${space}:${key(id)}`;
  let running=active.get(a);if(!running)active.set(a,running=new Set());let known=refs.get(a);if(!known)refs.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==references[i]))throw Error('同一韩当事件不能更换目标、来源或实体');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('韩当事务中断；须恢复原协程或按原输入日志重放，不能重复弃牌或摸牌'),{code:'SGS_NEXT_HANDANG_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};running.add(r);known.set(rk,references);
  return {receipt:r,finish(){r.status='done';running.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);running.delete(r);}};
}
function nextId(g,a,skill){const s=state(g,a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('韩当事件计数器已耗尽');return `${skill}:${key([pid(g,a),++s.counter])}`;}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`韩当接入缺少 ${name}`);}
function movement(g){methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('韩当需要 validate / on_committed 原子移牌边界');}
const discardable=(g,a,m,chooser,skill)=>g.can_discard_material?.(a,m,{chooser,source_skill:skill})!==false&&g.can_discard_card?.(a,m.card,{zone:m.zone,chooser,source_skill:skill})!==false;
const exact=(options,m)=>options.find(n=>n.zone===m?.zone&&n.index===m.index&&n.card===m.card);
function ownMaterials(g,a,skill){
  if(!extant(a))return [];
  return [...a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),
    ...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])]
    .filter(m=>m.card&&!m.card.virtual&&g.can_pay_materials?.(a,[m])!==false&&discardable(g,a,m,a,skill));
}
export const sgs_gongqi_materials=(g,a)=>ownMaterials(g,a,SK.gongqi);
export const sgs_jiefan_weapon_materials=(g,a)=>ownMaterials(g,a,SK.jiefan).filter(m=>m.card.type===CardType.WEAPON);
function phaseReady(g,a,except=null){
  if(!a[FIELD])return true;const s=state(g,a),phase=a.play_phase_id;
  return !s.gongqi_phases[key(phase)]&&!Object.values(s.gongqi).some(r=>r!==except&&r.request.phase_id===phase&&r.status!=='done');
}
export const sgs_gongqi_available=(g,a)=>owned(g,a,SK.gongqi)&&idlePlay(g,a)&&stable(a.play_phase_id)&&stable(g.turn_event_counter)&&phaseReady(g,a)&&sgs_gongqi_materials(g,a).length>0;
export function sgs_gongqi_unavailable_reason(g,a){
  if(!owned(g,a,SK.gongqi))return '当前不拥有弓骑';if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!stable(a.play_phase_id)||!stable(g.turn_event_counter))return '缺少真实回合或出牌阶段标识';if(!phaseReady(g,a))return '本出牌阶段弓骑已发动或正在处理';
  return sgs_gongqi_materials(g,a).length?'':'需要一张可弃置的手牌或装备';
}
/** This is actual attack RANGE, not distance, Slash-only range or target bypass. */
export function sgs_gongqi_attack_range(g,a,base=1){
  if(!a?.[FIELD])return base;const s=state(g,a);
  return extant(a)&&g.actual_turn_active===true&&s.range_effect?.turn_id===g.turn_event_counter?Infinity:base;
}
/** Run irrespective of current skill ownership at the true turn-finally boundary. */
export function sgs_next_handang_turn_end(g,_actor=null,{turn_id=g.turn_event_counter}={}){
  for(const a of g.all_players())if(a[FIELD]&&state(g,a).range_effect?.turn_id===turn_id)state(g,a).range_effect=null;
}
export function sgs_next_handang_final_death(g,a){if(a?.[FIELD]&&a.dead)state(g,a).range_effect=null;}
/** Public equipment and blind hand positions only; never judgment or a pile. */
export function sgs_gongqi_target_materials(g,a,target){
  if(a===target||!extant(target))return [];
  return [...SLOTS.flatMap(zone=>target[zone]?[{id:`eq:${zone}`,zone,index:0,card:target[zone],label:`装备：${target[zone]}`}]:[]),
    ...target.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}（未知）`}))]
    .filter(m=>m.card&&!m.card.virtual&&discardable(g,target,m,a,SK.gongqi));
}
export const sgs_gongqi_targets=(g,a)=>g.all_players().filter(p=>p!==a&&extant(p)&&sgs_gongqi_target_materials(g,a,p).length>0);
async function chooseCost(g,a,valid){
  while(valid()){
    const options=sgs_gongqi_materials(g,a);if(!options.length)return null;
    const answer=await g.view.ask_line('弓骑：弃置一张手牌或装备，本回合攻击范围无限',{kind:'select_hand',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗次数'}],meta:meta(g,a,SK.gongqi,'gongqi_cost',{material_zones:['hand',...SLOTS]})});
    if(!valid()||pass(answer))return null;const chosen=select(options,answer);if(exact(sgs_gongqi_materials(g,a),chosen))return chosen;
  }return null;
}
export function sgs_ai_gongqi_plan(g,a){
  if(!sgs_gongqi_available(g,a))return null;
  const targets=sgs_gongqi_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a));
  const needRange=g.all_players().some(p=>p!==a&&live(p)&&g.side_of(p)!==g.side_of(a)&&!g.in_actual_attack_range(a,p));
  return sgs_gongqi_materials(g,a).filter(m=>EQUIPMENT.has(m.card.type)&&targets.length||needRange)
    .sort((x,y)=>(g.material_ai_cost?.(x)??(EQUIPMENT.has(x.card.type)?0:1))-(g.material_ai_cost?.(y)??(EQUIPMENT.has(y.card.type)?0:1)))[0]??null;
}
async function discardFollowOn(g,a,r,valid,{target_id=null,target_material=null,choose=false}={}){
  while(valid()){
    const targets=sgs_gongqi_targets(g,a);if(!targets.length)return;
    let target=target_id===null?null:targets.find(p=>pid(g,p)===target_id);
    if(a.is_ai)target=targets.filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>SLOTS.filter(s=>y[s]).length-SLOTS.filter(s=>x[s]).length||y.hand.length-x.hand.length)[0];
    else if(choose){
      const options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hand.length}张手牌）`}));
      const answer=await g.view.ask_line('弓骑：可再弃置一名其他角色的一张手牌或装备',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'不弃置'}],meta:meta(g,a,SK.gongqi,'gongqi_target',{event_id:r.event_id,allow_allies:true})});
      if(!valid()||pass(answer))return;target=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);
    }
    if(!target||!valid()||!sgs_gongqi_targets(g,a).includes(target)){if(choose)continue;return;}
    const options=sgs_gongqi_target_materials(g,a,target);let chosen=target_material;
    if(a.is_ai){chosen=options.find(m=>m.zone!=='hand');if(!chosen){methods(g.rng,'choice');chosen=g.rng.choice(options);}}
    else if(choose){
      const answer=await g.view.ask_line(`弓骑：弃置${target.name}的一张牌`,{kind:'select_target_card',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不弃置'}],meta:meta(g,a,SK.gongqi,'gongqi_card',{event_id:r.event_id,owner_seat:seat(g,target),hidden_hands:true,material_zones:['hand',...SLOTS]})});
      if(!valid()||pass(answer))return;chosen=select(options,answer);
    }
    const legal=()=>valid()&&Boolean(exact(sgs_gongqi_target_materials(g,a,target),chosen));
    if(!legal()){if(choose)continue;return;}
    let committed=false;const result=await g.public_card_loss(target,[chosen],{to:'discard',visibility:'public',reason:'弓骑',action:'discard',source:a,source_skill:SK.gongqi,
      move_id:`gongqi:${key([pid(g,a),r.event_id])}:follow`,validate:legal,on_committed:cards=>{if(cards.length!==1||cards[0]!==chosen.card)throw Error('弓骑追加弃牌回执不匹配');committed=true;r.follow_discarded=true;r.follow_target_id=pid(g,target);}});
    if(result?.committed&&!committed)throw Error('弓骑追加弃牌缺少原子提交回执');return;
  }
}
export async function sgs_gongqi_execute(g,a,{material=null,event_id=null,phase_id=null,choose=false,target_id=null,target_material=null}={}){
  const phase=phase_id??a.play_phase_id,id=event_id??nextId(g,a,SK.gongqi),request={owner:pid(g,a),phase_id:phase,choose,target_id,material:material?{zone:material.zone,index:material.index}:null,target_material:target_material?{zone:target_material.zone,index:target_material.index}:null},references=[...(material?[material.card]:[]),...(target_material?[target_material.card]:[])];
  if(state(g,a).gongqi[key(id)]){ticket(g,a,'gongqi',id,request,references);return false;}
  if(!sgs_gongqi_available(g,a)||phase!==a.play_phase_id)return false;movement(g);
  const t=ticket(g,a,'gongqi',id,request,references),r=t.receipt,turn=g.turn_event_counter,bound=binding(g,a,SK.gongqi);
  const valid=()=>owned(g,a,SK.gongqi)&&binding(g,a,SK.gongqi)===bound&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&phaseReady(g,a,r);
  try{
    const chosen=choose?await chooseCost(g,a,valid):material;
    const legal=()=>valid()&&Boolean(exact(sgs_gongqi_materials(g,a),chosen));if(!legal()){t.finish();return false;}
    // Capture the paid face BEFORE a copied card reverts on physical movement.
    const equipment=EQUIPMENT.has(chosen.card.type);r.status='paying';
    const paid=await g.public_card_loss(a,[chosen],{payment:true,to:'discard',visibility:'public',reason:'弓骑',action:'discard',source:a,source_skill:SK.gongqi,
      move_id:`gongqi:${key([pid(g,a),id])}:cost`,validate:legal,on_committed:cards=>{
        if(cards.length!==1||cards[0]!==chosen.card)throw Error('弓骑费用回执不匹配');r.committed=true;r.equipment_cost=equipment;r.status='paid';state(g,a).gongqi_phases[key(phase)]={event_id:id,used:true};
      }});
    if(paid?.committed&&!r.committed)throw Error('弓骑费用缺少原子提交回执');
    // Committed effect survives form/skill loss; all real loss callbacks precede
    // the grant. Final death or actual turn closure prevents a stale grant.
    const effectValid=()=>live(a)&&!g.winner&&g.actual_turn_active===true&&g.turn_event_counter===turn;
    if(r.committed&&effectValid()){
      state(g,a).range_effect={turn_id:turn,event_id:id};r.range_granted=true;
      if(equipment)await discardFollowOn(g,a,r,effectValid,{target_id,target_material,choose});
    }
    t.finish();return r.committed;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_resolve_gongqi=sgs_gongqi_execute;
export async function sgs_player_gongqi(g,a){if(!sgs_gongqi_available(g,a)){g.view.emit(`弓骑：${sgs_gongqi_unavailable_reason(g,a)}。`);return true;}await sgs_gongqi_execute(g,a,{choose:true});return true;}
export async function sgs_ai_gongqi(g,a){const material=sgs_ai_gongqi_plan(g,a);return material?sgs_gongqi_execute(g,a,{material}):false;}

export const sgs_jiefan_targets=(g,_a)=>g.all_players().filter(live);
function limitedReady(g,a,except=null){if(!a[FIELD])return true;const s=state(g,a);return !s.jiefan_marker.used&&!Object.values(s.jiefan).some(r=>r!==except&&r.status!=='done');}
export const sgs_jiefan_available=(g,a)=>owned(g,a,SK.jiefan)&&idlePlay(g,a)&&stable(a.play_phase_id)&&stable(g.turn_event_counter)&&limitedReady(g,a);
export function sgs_jiefan_unavailable_reason(g,a){
  if(!owned(g,a,SK.jiefan))return '当前不拥有解烦';if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!stable(a.play_phase_id)||!stable(g.turn_event_counter))return '缺少真实回合或出牌阶段标识';return limitedReady(g,a)?'':'限定技解烦已使用或正在处理';
}
/** Frozen at activation; later equipment loss must not recompute this list. */
export function sgs_jiefan_participants(g,target){
  if(!live(target))return [];methods(g,'action_order','in_actual_attack_range');
  return [...new Set(g.action_order())].filter(p=>p!==target&&live(p)&&g.in_actual_attack_range(p,target));
}
export function sgs_ai_jiefan_target(g,a){
  if(!sgs_jiefan_available(g,a))return null;
  return sgs_jiefan_targets(g,a).filter(p=>g.side_of(p)===g.side_of(a)).map(p=>({p,n:sgs_jiefan_participants(g,p).length}))
    .filter(x=>x.n>0).sort((x,y)=>y.n-x.n||x.p.hand.length-y.p.hand.length)[0]?.p??null;
}
export function sgs_ai_jiefan_choice(g,holder,target){
  if(g.side_of(holder)===g.side_of(target))return {branch:'draw'};
  const material=sgs_jiefan_weapon_materials(g,holder).sort((x,y)=>(g.material_ai_cost?.(x)??(x.zone==='hand'?0:1))-(g.material_ai_cost?.(y)??(y.zone==='hand'?0:1)))[0];
  return material?{branch:'discard',material}:{branch:'draw'};
}
async function chooseJiefan(g,holder,target,r,valid){
  while(valid()){
    const weapons=sgs_jiefan_weapon_materials(g,holder);if(!weapons.length)return {branch:'draw'};
    if(holder.is_ai)return sgs_ai_jiefan_choice(g,holder,target);
    const options=[...weapons.map(m=>({id:m.id,label:`弃置${m.label}`})),{id:'draw',label:`令${target.name}摸一张牌`}];
    const answer=await g.view.ask_line(`解烦：弃置一张武器牌，或令${target.name}摸一张牌`,{kind:'choice',player_id:seat(g,holder),options,
      meta:meta(g,holder,SK.jiefan,'jiefan_choice',{event_id:r.event_id,recipient_seat:seat(g,target),participant_index:r.cursor,participant_count:r.participant_ids.length,mandatory:true,weapon_only:true,material_zones:['hand',...SLOTS]})});
    if(!valid())return null;const chosen=select(options,answer);if(chosen?.id==='draw')return {branch:'draw'};
    const material=weapons.find(m=>m.id===chosen?.id);if(exact(sgs_jiefan_weapon_materials(g,holder),material))return {branch:'discard',material};
    // No free refusal. Recompute private weapon legality after a stale prompt.
  }return null;
}
export async function sgs_jiefan_execute(g,a,{target_id=null,event_id=null,phase_id=null,choose=false}={}){
  const phase=phase_id??a.play_phase_id,id=event_id??nextId(g,a,SK.jiefan),request={owner:pid(g,a),phase_id:phase,target_id,choose};
  if(state(g,a).jiefan[key(id)]){ticket(g,a,'jiefan',id,request);return false;}
  if(!sgs_jiefan_available(g,a)||phase!==a.play_phase_id)return false;movement(g);methods(g,'draw_cards','action_order','in_actual_attack_range');
  const t=ticket(g,a,'jiefan',id,request),r=t.receipt,turn=g.turn_event_counter,bound=binding(g,a,SK.jiefan);
  const valid=()=>owned(g,a,SK.jiefan)&&binding(g,a,SK.jiefan)===bound&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&limitedReady(g,a,r);
  try{
    let target=null;
    if(choose)while(valid()){
      const targets=sgs_jiefan_targets(g,a),options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${sgs_jiefan_participants(g,p).length}名范围持有者）`}));
      const answer=await g.view.ask_line('解烦（限定技）：选择一名角色，包括自己',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗限定标记'}],meta:meta(g,a,SK.jiefan,'jiefan_target',{event_id:id,allow_self:true,allow_allies:true,limited:true})});
      if(!valid()||pass(answer))break;target=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);if(target&&live(target))break;target=null;
    }else target=sgs_jiefan_targets(g,a).find(p=>pid(g,p)===target_id);
    if(!target||!valid()||!live(target)){t.finish();return false;}
    const participants=sgs_jiefan_participants(g,target);
    r.committed=true;r.target_id=pid(g,target);r.participant_ids=participants.map(p=>pid(g,p));r.cursor=0;r.decisions=[];r.status='resolving';
    state(g,a).jiefan_marker={used:true,event_id:id};
    // Host match-end is evaluated only after the awaited turn returns.
    // No owner life, ownership, binding, phase or range recheck after commitment.
    const effectValid=()=>extant(target)&&!g.winner;
    while(r.cursor<participants.length&&effectValid()){
      const holder=participants[r.cursor],item={holder_id:pid(g,holder),status:'offered'};r.decisions.push(item);
      if(!extant(holder)){item.status='skipped_dead';r.cursor++;continue;}
      const canAct=()=>effectValid()&&extant(holder);
      const choice=await chooseJiefan(g,holder,target,r,canAct);
      if(!canAct()||!choice){item.status=holder.dead?'skipped_dead':'stopped';if(holder.dead&&effectValid()){r.cursor++;continue;}break;}
      item.branch=choice.branch;
      if(choice.branch==='discard'){
        const {material}=choice;item.status='discarding';
        const result=await g.public_card_loss(holder,[material],{payment:true,to:'discard',visibility:'public',reason:'解烦',action:'discard',source:a,source_skill:SK.jiefan,
          move_id:`jiefan:${key([pid(g,a),id])}:holder:${r.cursor}`,validate:()=>canAct()&&Boolean(exact(sgs_jiefan_weapon_materials(g,holder),material)),
          on_committed:cards=>{if(cards.length!==1||cards[0]!==material.card)throw Error('解烦武器回执不匹配');item.committed=true;item.status='discarded';}});
        if(result?.committed&&!item.committed)throw Error('解烦弃武器缺少原子提交回执');
        // A failed transaction is not a participant's free third option. Fail
        // closed for journal replay instead of silently treating it as paid.
        if(!item.committed&&canAct())throw Error('解烦武器未实际弃置，须重新结算该参与者');
      }else{
        item.status='drawing';item.committed=true;const cards=await g.draw_cards(target,1);item.drawn=Array.isArray(cards)?cards.length:1;
      }
      item.status='done';r.cursor++;
    }
    r.stopped_recipient_dead=target.dead===true;t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_resolve_jiefan=sgs_jiefan_execute;
export async function sgs_player_jiefan(g,a){if(!sgs_jiefan_available(g,a)){g.view.emit(`解烦：${sgs_jiefan_unavailable_reason(g,a)}。`);return true;}await sgs_jiefan_execute(g,a,{choose:true});return true;}
export async function sgs_ai_jiefan(g,a){const target=sgs_ai_jiefan_target(g,a);return target?sgs_jiefan_execute(g,a,{target_id:pid(g,target)}):false;}
export function sgs_next_handang_public_state(a){
  if(!a?.[FIELD])return {gongqi_used_phases:[],gongqi_range_effect:null,jiefan_used:false,gongqi_events:[],jiefan_events:[]};const s=validateState(a[FIELD]);
  return {gongqi_used_phases:Object.keys(s.gongqi_phases).map(JSON.parse),gongqi_range_effect:s.range_effect?{...s.range_effect}:null,jiefan_used:s.jiefan_marker.used,
    gongqi_events:Object.values(s.gongqi).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,equipment_cost:r.equipment_cost??false,range_granted:r.range_granted===true,follow_discarded:r.follow_discarded===true,follow_target_id:r.follow_target_id??null})),
    jiefan_events:Object.values(s.jiefan).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,target_id:r.target_id??null,participant_ids:[...(r.participant_ids??[])],cursor:r.cursor??0,
      decisions:(r.decisions??[]).map(d=>({holder_id:d.holder_id,status:d.status,branch:d.branch??null,committed:d.committed===true,drawn:d.drawn??0}))}))};
}
export function sgs_next_handang_skill_definitions({SkillHooks,ActiveSkillDef}){
  const gongqi=new ActiveSkillDef({skill_id:SK.gongqi,hotkey:'q',button_label:'弓骑',player:sgs_player_gongqi,ai:sgs_ai_gongqi,available:sgs_gongqi_available,
    help_text:'出牌阶段限一次，弃置一张手牌或装备，本回合攻击范围无限。装备牌费用可再弃置一名其他角色的一张手牌或装备。不会增加杀次数、目标或伤害。'});
  const jiefan=new ActiveSkillDef({skill_id:SK.jiefan,hotkey:'w',button_label:'解烦',player:sgs_player_jiefan,ai:sgs_ai_jiefan,available:sgs_jiefan_available,
    help_text:'限定技，出牌阶段选择一名角色，包括自己。其在攻击范围内的所有其他角色依次弃置一张手牌或装备区的武器，或令其摸一张牌。'});
  for(const [def,skill,targets,reason] of [[gongqi,SK.gongqi,sgs_gongqi_targets,sgs_gongqi_unavailable_reason],[jiefan,SK.jiefan,sgs_jiefan_targets,sgs_jiefan_unavailable_reason]]){
    def.source_skill_id=skill;def.owns_target_selection=true;def.targets=targets;def.unavailable_reason=reason;
  }
  return {hooks:{[ID.handang]:SkillHooks({})},active:{[ID.handang]:[gongqi,jiefan]}};
}
