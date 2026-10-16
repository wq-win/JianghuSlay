/** 朱然: complete selected mobile base 身份 sequential 胆守, 2026-10-15.
 * P0/P1/P3/P6–P8 are explicit host contracts, not current-client certification.
 * Costs are 1, 2, 3, 4, 5… per genuine play phase; never a four-use cap. */
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_MORE_ZHURAN_RULE_IDS=Object.freeze({zhuran:'sgs.adapted.base.hero.zhu-ran'});
export const SGS_YIJIANG_MORE_ZHURAN_SKILL_IDS=Object.freeze({danshou:'sgs.danshou'});
const ID=SGS_YIJIANG_MORE_ZHURAN_RULE_IDS,SK=SGS_YIJIANG_MORE_ZHURAN_SKILL_IDS;
const FIELD='sgs_yijiang_more_zhuran_state',SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
export const SGS_YIJIANG_MORE_ZHURAN_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-sequential-danshou-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P3','P6','P7','P8']),
  heroes:Object.freeze([Object.freeze({id:ID.zhuran,name:'朱然',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,
    starting_hp_basis:'P0 host full-HP initialization',gender:'male',source_faction:'吴',skill_ids:Object.freeze([SK.danshou]),
    personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.danshou]:'出牌阶段，你可以弃置X张牌并选择你攻击范围内的一名其他角色（X为你此阶段内发动"胆守"的次数），若X：是1，你弃置其一张牌；是2，其将一张牌交给你；是3，你对其造成1点伤害；不小于4，你与其各摸两张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-131.html','https://wiki.biligame.com/msgs/朱然']),bwiki_revision:35781,
  excluded_variants:Object.freeze(['after-damage-draw-one-and-end-turn','jie-reactive-retaliation','OL-end-phase-count','self-target']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null,key=x=>JSON.stringify(x);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK.danshou)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK.danshou):g.has_general_skill?.(a,SK.danshou)===true);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const binding=(g,a)=>key([g.general_skill_binding_id?.(a,SK.danshou)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(options,x)=>options.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?options[Number(x)-1]:null);
const exact=(options,m)=>m&&options.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card);
const meta=(g,a,stage,extra={})=>({skill:'胆守',skill_id:SK.danshou,stage,private_to:seat(g,a),...extra});
const branch=x=>x===1?'discard':x===2?'give':x===3?'damage':'draw';
const branchText=x=>x===1?'弃置目标一张牌':x===2?'目标自行选择一张牌交给你':x===3?'对目标造成1点普通伤害':'你与目标各摸两张牌';
const active=new WeakMap(),references=new WeakMap();
const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!record(s.phases)||!record(s.events)
    ||Object.values(s.phases).some(p=>!stable(p.phase_id)||!stable(p.turn_id)||!Number.isSafeInteger(p.count)||p.count<1||!stable(p.last_event_id))
    ||Object.values(s.events).some(r=>!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'||!['offered','paying','paid','resolving','done','failed'].includes(r.status)))throw Error('Invalid Zhu Ran skill state');
  return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('胆守需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,counter:0,phases:{},events:{}};validateState(s);
  if(s.owner_id!==owner)throw Error('胆守次数和事务不能继承另一人物');return s;
}
export const sgs_clone_yijiang_more_zhuran_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
function nextId(g,a){
  const s=state(g,a);let id;
  do{if(s.counter===Number.MAX_SAFE_INTEGER)throw Error('胆守事件计数耗尽');id=`danshou:${pid(g,a)}:${++s.counter}`;}while(Object.hasOwn(s.events,key(id)));
  return id;
}
function ticket(g,a,id,request,refs){
  if(!stable(id))throw Error('胆守需要稳定发动ID');
  const s=state(g,a),k=key(id),old=s.events[k];
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(key(old.request)!==key(request)||known.has(k)&&(known.get(k).length!==refs.length||known.get(k).some((v,i)=>v!==refs[i])))throw Error('同一胆守事件不能更换人物、费用或实体');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('胆守事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_YIJIANG_MORE_ZHURAN_REPLAY_REQUIRED'});
    return null;
  }
  const r=s.events[k]={event_id:id,request,status:'offered',committed:false,paid_count:0,draws:[]};running.add(r);known.set(k,refs);
  return {r,finish(){r.status='done';running.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);running.delete(r);}};
}
function idlePlay(g,a){
  return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&!a.skip_play_stage&&g.turn_actor===seat(g,a)
    &&g.is_own_play_phase?.(a)===true&&stable(a.play_phase_id)&&stable(g.turn_event_counter)
    &&(!Object.hasOwn(g,'active_play_phase_id')||g.active_play_phase_id===a.play_phase_id)
    &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
}
function phaseReady(g,a,except=null){
  if(!a?.[FIELD])return true;const s=state(g,a),p=s.phases[key(a.play_phase_id)];
  return (!p||p.turn_id===g.turn_event_counter)&&!Object.values(s.events).some(r=>r!==except&&r.status!=='done');
}
export const sgs_danshou_next_ordinal=(g,a)=>{const s=a?.[FIELD]?state(g,a):null;return (s?.phases[key(a?.play_phase_id)]?.count??0)+1;};
const discardable=(g,owner,m,source)=>g.can_discard_material?.(owner,m,{source,source_skill:SK.danshou})!==false;
const giveable=(g,owner,m,recipient)=>g.can_give_material?.(owner,m,{recipient,source_skill:SK.danshou})!==false;
function ownMaterials(g,a,{giving=false,recipient=null}={}){
  if(!live(a))return [];
  return [...(a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),
    ...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])]
    .filter(m=>m.card&&!m.card.virtual&&(giving?giveable(g,a,m,recipient):discardable(g,a,m,a)));
}
export const sgs_danshou_materials=(g,a)=>ownMaterials(g,a).filter(m=>g.can_pay_materials?.(a,[m])!==false);
export function sgs_danshou_give_materials(g,target,recipient,{private_view=true}={}){
  if(private_view)return ownMaterials(g,target,{giving:true,recipient});
  if(!live(target))return [];
  // Eligibility is public count/zone information. Do not format/read a foreign
  // hand merely to decide whether a forced give has at least one candidate.
  return [...target.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}（未知）`,hidden:true})),
    ...SLOTS.flatMap(zone=>target[zone]?[{id:`eq:${zone}`,zone,index:0,card:target[zone],label:`装备：${target[zone]}`}]:[])]
    .filter(m=>m.card&&giveable(g,target,m,recipient));
}
/** Hidden hands stay blind even when allied; only the selected physical card is
 * subsequently exposed by the public discard. Queries do not allocate IDs. */
export function sgs_danshou_discard_materials(g,a,target){
  if(a===target||!live(target))return [];
  return [...(target.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}（未知）`,hidden:true})),
    ...SLOTS.flatMap(zone=>target[zone]?[{id:`eq:${zone}`,zone,index:0,card:target[zone],label:`装备：${target[zone]}`,hidden:false}]:[]),
    ...(target.judgment_cards??[]).map((card,index)=>({id:`judgment:${index+1}`,zone:'judgment',index,card,label:`判定区：${g.effective_delayed_name?.(target,card)??card}`,hidden:false}))]
    .filter(m=>m.card&&(m.zone==='hand'||!m.card.virtual)&&discardable(g,target,m,a));
}
function validCosts(g,a,ms,n){
  if(!Array.isArray(ms)||ms.length!==n||new Set(ms.map(m=>m?.card)).size!==n)return false;
  const options=sgs_danshou_materials(g,a);return ms.every(m=>exact(options,m));
}
export function sgs_danshou_actor_after_cost(g,a,ms){
  if(!Array.isArray(ms)||!ms.every(m=>exact(sgs_danshou_materials(g,a),m))||new Set(ms.map(m=>m.card)).size!==ms.length)return null;
  const removed=new Set(ms.map(m=>m.card)),preview=Object.assign(Object.create(Object.getPrototypeOf(a),Object.getOwnPropertyDescriptors(a)),
    {hand:a.hand.filter(c=>!removed.has(c)),_distance_origin:a._distance_origin??a});
  for(const m of ms)if(SLOTS.includes(m.zone))preview[m.zone]=null;
  return g.general_skill_preview?.(a,preview)??preview;
}
function targetsFor(g,a,ms,n){
  if(!validCosts(g,a,ms,n))return [];const after=sgs_danshou_actor_after_cost(g,a,ms);
  if(typeof g.in_actual_attack_range!=='function')throw Error('胆守需要真实攻击范围接口');
  return g.all_players().filter(p=>p!==a&&live(p)&&g.in_actual_attack_range(after,p)
    &&(n===1?sgs_danshou_discard_materials(g,a,p).length>0:n===2?sgs_danshou_give_materials(g,p,a,{private_view:false}).length>0:true));
}
const costValue=(g,m)=>g.material_ai_cost?.(m)??(m.zone==='hand'?2:6);
/** Four equipment slots produce at most 16 projections. Ordinary hand choices
 * all remove the same number of hand cards, so no exponential hand search. */
function costPlans(g,a,n){
  const all=sgs_danshou_materials(g,a),hands=all.filter(m=>m.zone==='hand').sort((x,y)=>costValue(g,x)-costValue(g,y)),equipment=all.filter(m=>m.zone!=='hand'),plans=[];
  if(all.length<n)return plans;
  for(let mask=0;mask<2**equipment.length;mask++){
    const picked=equipment.filter((_,i)=>mask&(2**i)),needed=n-picked.length;
    if(needed<0||needed>hands.length)continue;
    const ms=[...hands.slice(0,needed),...picked],targets=targetsFor(g,a,ms,n);
    if(targets.length)plans.push({materials:ms,targets,cost:ms.reduce((sum,m)=>sum+costValue(g,m),0)});
  }
  return plans.sort((x,y)=>x.cost-y.cost);
}
export function sgs_danshou_targets(g,a,materials=null){
  if(!live(a))return [];const n=sgs_danshou_next_ordinal(g,a);
  return materials===null?[...new Set(costPlans(g,a,n).flatMap(p=>p.targets))]:targetsFor(g,a,materials,n);
}
export const sgs_danshou_available=(g,a)=>owned(g,a)&&idlePlay(g,a)&&phaseReady(g,a)&&costPlans(g,a,sgs_danshou_next_ordinal(g,a)).length>0;
export function sgs_danshou_unavailable_reason(g,a){
  if(!owned(g,a))return '当前不拥有胆守';if(!idlePlay(g,a))return '只能在自己的真实空闲出牌阶段发动';
  if(!phaseReady(g,a))return '胆守正在处理或需要恢复原事务';const n=sgs_danshou_next_ordinal(g,a);
  return sgs_danshou_materials(g,a).length<n?`下一次须恰好弃置${n}张手牌或装备`:'支付费用后攻击范围内没有符合当前分支的其他角色';
}
async function chooseCosts(g,a,n,r,valid){
  let chosen=[];
  while(valid()){
    const all=sgs_danshou_materials(g,a);
    if(chosen.some(m=>!exact(all,m)))chosen=[];
    if(all.length<n)return null;
    if(chosen.length===n)return chosen;
    const options=all.filter(m=>!chosen.some(c=>c.card===m.card));
    const answer=await g.view.ask_line(`胆守第${n}次：恰好弃${n}张牌（已选${chosen.length}张），然后${branchText(n)}`,{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌、不增加次数'}],
      meta:meta(g,a,'danshou_materials',{event_id:r.event_id,phase_id:r.request.phase_id,ordinal:n,exact_count:n,selected:chosen.map(m=>m.id),material_zones:['hand',...SLOTS],branch:branch(n)})});
    if(!valid()||pass(answer))return null;
    const selected=select(options,answer),now=sgs_danshou_materials(g,a);
    if(chosen.some(m=>!exact(now,m))){chosen=[];continue;}
    if(exact(now,selected))chosen.push(selected);
  }
  return null;
}
async function chooseTarget(g,a,ms,n,r,valid){
  while(valid()){
    const targets=targetsFor(g,a,ms,n);if(!targets.length)return null;
    const options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}血，${p.hand.length}张手牌）`}));
    const answer=await g.view.ask_line(`胆守第${n}次：选择支付后攻击范围内的其他角色，${branchText(n)}`,{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不弃牌、不增加次数'}],
      meta:meta(g,a,'danshou_target',{event_id:r.event_id,ordinal:n,branch:branch(n),cost_count:n,post_cost_range:true,allow_allies:true,allow_self:false})});
    if(!valid()||pass(answer))return null;const p=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);
    if(p&&targetsFor(g,a,ms,n).includes(p))return p;
  }
  return null;
}
const harmfulEquipment=(g,p,m)=>m.zone!=='hand'&&m.zone!=='judgment'&&(['broken_halberd','bee_robe','mobile_female_dress','inferior_horse'].includes(m.card.trait)
  ||m.card.trait==='silver_lion'&&p.hp<(g.effective_max_hp?.(p)??rule_hero(p)?.max_hp??p.hp));
export function sgs_ai_danshou_discard(g,a,target){
  const options=sgs_danshou_discard_materials(g,a,target),friendly=g.side_of(a)===g.side_of(target);
  if(friendly)return options.find(m=>m.zone==='judgment')??options.find(m=>harmfulEquipment(g,target,m))??options[0]??null;
  return options.find(m=>m.zone==='armor'&&!harmfulEquipment(g,target,m))??options.find(m=>m.zone==='weapon'&&!harmfulEquipment(g,target,m))
    ??options.find(m=>m.zone==='hand')??options.find(m=>m.zone!=='judgment'&&!harmfulEquipment(g,target,m))??options[0]??null;
}
export const sgs_ai_danshou_give=(g,target,recipient)=>sgs_danshou_give_materials(g,target,recipient).sort((x,y)=>costValue(g,x)-costValue(g,y))[0]??null;
export function sgs_ai_danshou_plan(g,a){
  if(!sgs_danshou_available(g,a))return null;const n=sgs_danshou_next_ordinal(g,a),choices=[];
  for(const plan of costPlans(g,a,n)){
    // Avoid voluntarily lethal public poison costs; possible rescue isn't assumed.
    if(plan.materials.filter(m=>m.zone==='hand'&&m.card.type==='毒').length>=a.hp)continue;
    for(const target of plan.targets){
      const friendly=g.side_of(a)===g.side_of(target);let benefit;
      if(n===1){
        const chosen=sgs_ai_danshou_discard(g,a,target),helpful=chosen&&(chosen.zone==='judgment'||harmfulEquipment(g,target,chosen));
        benefit=friendly?(helpful?6:0):chosen&&!helpful?6+SLOTS.filter(s=>target[s]).length:0;
      }
      else if(n===2)benefit=friendly?0:8;
      else if(n===3)benefit=friendly?0:12+(target.hp<=1?8:0);
      else benefit=friendly?15:0;
      if(benefit>0&&benefit>=plan.cost)choices.push({...plan,target,score:benefit-plan.cost});
    }
  }
  return choices.sort((x,y)=>y.score-x.score||x.cost-y.cost||x.target.hp-y.target.hp)[0]??null;
}
async function resolveCardBranch(g,a,target,n,r,valid,discardMaterial){
  const giving=n===2,chooser=giving?target:a;
  if(giving&&!live(a)){r.stopped='recipient_dead';return;}
  const canAct=()=>valid()&&(!giving||live(a));let supplied=discardMaterial;
  while(canAct()){
    const options=giving?sgs_danshou_give_materials(g,target,a):sgs_danshou_discard_materials(g,a,target);
    if(!options.length){r.stopped='no_remaining_material';return;}
    let chosen;
    if(chooser.is_ai)chosen=giving?sgs_ai_danshou_give(g,target,a):sgs_ai_danshou_discard(g,a,target);
    else if(!giving&&supplied){chosen=exact(options,supplied);supplied=null;}
    else{
      const answer=await g.view.ask_line(giving?`胆守：请选择一张手牌或装备交给${a.name}`:`胆守：弃置${target.name}的一张牌（手牌未知）`,{
        kind:'choice',player_id:seat(g,chooser),options:options.map(({id,label,hidden})=>({id,label,...(hidden===undefined?{}:{hidden})})),
        meta:meta(g,chooser,giving?'danshou_give':'danshou_discard',{event_id:r.event_id,ordinal:n,mandatory:true,target_seat:seat(g,target),
          material_zones:['hand',...SLOTS,...(giving?[]:['judgment'])],hidden_hands:!giving,target_chooses:giving})});
      if(!canAct())return;chosen=select(options,answer);
    }
    if(!chosen)continue;
    const current=()=>giving?sgs_danshou_give_materials(g,target,a):sgs_danshou_discard_materials(g,a,target);
    const legal=()=>canAct()&&Boolean(exact(current(),chosen));if(!legal())continue;
    const item=r.card_effect={kind:giving?'give':'discard',status:'paying',owner_id:pid(g,target),recipient_id:giving?pid(g,a):null};
    const move=await g.public_card_loss(target,[chosen],{to:giving?'hand':'discard',recipient:giving?a:null,visibility:'public',reason:giving?'胆守·交给':'胆守·弃置',
      action:giving?'give':'discard',semantic_action:giving?'give':'discard',source:giving?target:a,source_skill:SK.danshou,
      move_id:`danshou:${key([pid(g,a),r.event_id])}:${giving?'give':'discard'}:${r.card_attempt=(r.card_attempt??0)+1}`,validate:legal,
      on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==chosen.card)throw Error('胆守目标移牌回执不匹配');item.status='committed';item.move_id=movement.move_id;item.committed=true;}});
    if(move?.committed&&!item.committed)throw Error('胆守目标移牌缺少原子回执');
    if(item.committed||move?.blocked){item.status=move?.blocked?'blocked':'done';return;}
    if(legal())throw Error('胆守目标牌未实际移动，须按原输入日志恢复');
  }
}
const materialRequest=m=>m?{zone:m.zone,index:m.index,card_id:m.card?.physical_id??m.card?.physicalCardId??null}:null;
/** Direct callers supply exactly the next cost batch and target. `choose:true`
 * owns the human material and target stages. Branch 2 ALWAYS belongs to target. */
export async function sgs_danshou_execute(g,a,{event_id=null,phase_id=null,materials=null,target_id=null,discard_material=null,choose=false}={}){
  const phase=phase_id??a.play_phase_id,id=event_id??nextId(g,a),request={owner:pid(g,a),phase_id:phase,choose,target_id,
    materials:materials?.map(materialRequest)??null,discard_material:materialRequest(discard_material)},refs=[...(materials??[]).map(m=>m?.card),...(discard_material?[discard_material.card]:[])];
  if(state(g,a).events[key(id)]){ticket(g,a,id,request,refs);return false;}
  if(!sgs_danshou_available(g,a)||phase!==a.play_phase_id)return false;
  if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('胆守需要 validate / on_committed 原子移牌边界');
  const t=ticket(g,a,id,request,refs),r=t.r,turn=g.turn_event_counter,bound=binding(g,a),n=sgs_danshou_next_ordinal(g,a);
  r.ordinal=n;r.branch=branch(n);r.turn_id=turn;
  const valid=()=>owned(g,a)&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&binding(g,a)===bound&&phaseReady(g,a,r)&&sgs_danshou_next_ordinal(g,a)===n;
  try{
    const chosen=choose?await chooseCosts(g,a,n,r,valid):materials;
    if(!valid()||!validCosts(g,a,chosen,n)){t.finish();return false;}
    const target=choose?await chooseTarget(g,a,chosen,n,r,valid):g.all_players().find(p=>pid(g,p)===target_id);
    const legal=()=>valid()&&targetsFor(g,a,chosen,n).includes(target);
    if(!target||!legal()){t.finish();return false;}
    r.target_id=pid(g,target);r.status='paying';
    const paid=await g.public_card_loss(a,chosen,{payment:true,to:'discard',visibility:'public',reason:'胆守·费用',action:'discard',semantic_action:'discard',source:a,source_skill:SK.danshou,
      move_id:`danshou:${key([pid(g,a),id])}:cost`,validate:legal,on_committed:(cards,movement)=>{
        if(cards.length!==n||cards.some((c,i)=>c!==chosen[i].card))throw Error('胆守费用回执必须是完整的精确批次');
        r.committed=true;r.status='paid';r.paid_count=cards.length;r.cost_move_id=movement.move_id;
        r.paid_card_ids=cards.map(c=>c.physical_id??c.physicalCardId??g.card_history_material_id?.(c)??null);
        state(g,a).phases[key(phase)]={phase_id:phase,turn_id:turn,count:n,last_event_id:id};
      }});
    if(paid?.committed&&!r.committed)throw Error('胆守费用缺少原子提交回执');
    if(!r.committed){t.finish();return false;}
    // Already committed: loss of ownership/form/phase/source life cannot undo
    // damage/discard or select a new target. A dead recipient cannot gain cards.
    const effectValid=()=>live(target)&&ongoing(g);r.status='resolving';
    if(effectValid()){
      if(n<=2)await resolveCardBranch(g,a,target,n,r,effectValid,discard_material);
      else if(n===3){
        r.damage_event_id=`danshou:${key([pid(g,a),id])}:damage`;
        r.damage=await g.apply_damage(target,1,{source:a,kind:'skill',method:'skill',nature:'normal',source_skill:SK.danshou,source_skill_id:SK.danshou,
          source_rule_id:ID.zhuran,card_user:null,source_card:null,physical_cards:[],armor_ignored:false,committed_skill_effect:true,
          damage_event_id:r.damage_event_id,message:'{name}受到胆守 {damage} 点伤害，剩余血量 {hp}。'});
      }else{
        if(typeof g.action_order!=='function'||typeof g.draw_cards!=='function')throw Error('胆守需要行动顺序与真实摸牌回调');
        const order=g.action_order().filter(p=>p===a||p===target);
        if(new Set(order).size!==order.length||!order.includes(target)||live(a)&&!order.includes(a))throw Error('胆守摸牌需要完整且无重复的双方行动顺序');
        r.recipient_ids=order.map(p=>pid(g,p));
        for(const recipient of order){
          if(!effectValid())break;
          if(!live(recipient)){r.draws.push({player_id:pid(g,recipient),status:'skipped_dead',count:0});continue;}
          const item={player_id:pid(g,recipient),status:'started',count:2,drawn:null};r.draws.push(item);
          const cards=await g.draw_cards(recipient,2);item.drawn=Array.isArray(cards)?cards.length:null;item.status='done';
        }
      }
    }else r.stopped=target.dead?'target_dead':'match_closed';
    t.finish();g.view.emit(`${a.name}发动第${n}次胆守，弃置${n}张牌：${branchText(n)}。`,{event_type:'skill_resolution',skill_id:SK.danshou,stage:'danshou_summary',event_id:id,ordinal:n,branch:r.branch,target_id:r.target_id});return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_resolve_danshou=sgs_danshou_execute;
export async function sgs_player_danshou(g,a){
  if(!sgs_danshou_available(g,a)){g.view.emit(`胆守：${sgs_danshou_unavailable_reason(g,a)}。`);return true;}
  await sgs_danshou_execute(g,a,{choose:true});return true;
}
export async function sgs_ai_danshou(g,a){const p=sgs_ai_danshou_plan(g,a);return p?sgs_danshou_execute(g,a,{materials:p.materials,target_id:pid(g,p.target)}):false;}
/** Pure public projection excludes precommit costs, private card faces and IDs. */
export function sgs_yijiang_more_zhuran_public_state(a){
  if(!a?.[FIELD])return {danshou_phases:[],danshou_events:[]};const s=validateState(a[FIELD]);
  return {danshou_phases:Object.values(s.phases).map(p=>({...p})),danshou_events:Object.values(s.events).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,
    turn_id:r.turn_id??null,status:r.status,committed:r.committed,ordinal:r.ordinal??null,branch:r.branch??null,paid_count:r.paid_count,target_id:r.target_id??null,
    cost_move_id:r.cost_move_id??null,card_effect:r.card_effect?{...r.card_effect}:null,damage_event_id:r.damage_event_id??null,damage:r.damage??0,
    recipient_ids:[...(r.recipient_ids??[])],draws:r.draws.map(d=>({...d})),stopped:r.stopped??null}))};
}
export function sgs_yijiang_more_zhuran_skill_definitions({SkillHooks,ActiveSkillDef}){
  const skill=new ActiveSkillDef({skill_id:SK.danshou,hotkey:'q',button_label:'胆守',available:sgs_danshou_available,player:sgs_player_danshou,ai:sgs_ai_danshou,
    help_text:'每个真实出牌阶段依次弃1、2、3、4、5…张手牌或装备，选择支付后攻击范围内的其他角色。依次：弃其1牌、由其交1牌、造成1点普通伤害；第4次及以后双方各摸2张。不可跳阶，无4次上限。'});
  skill.source_skill_id=SK.danshou;skill.owns_target_selection=true;skill.targets=sgs_danshou_targets;skill.unavailable_reason=sgs_danshou_unavailable_reason;
  return {hooks:{[ID.zhuran]:SkillHooks({})},active:{[ID.zhuran]:[skill]}};
}
