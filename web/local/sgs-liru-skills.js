/** Li Ru's complete Mobile identity 2015-12-01 historical revision.
 * H8 is an explicit Jianghu continuation policy, not a native Mobile FAQ.
 * No registration, Game patching, UI rendering or source artwork lives here. */
import {rule_hero} from './effective-hero.js';
import {snapshot_card_face} from './card-face-projection.js';

export const SGS_LIRU_RULE_IDS=Object.freeze({liru:'sgs.adapted.base.hero.li-ru'});
export const SGS_LIRU_SKILL_IDS=Object.freeze({juece:'sgs.juece',mieji:'sgs.mieji',fencheng:'sgs.fencheng'});
export const SGS_LIRU_STATE_FIELD='sgs_liru_state';
const SK=SGS_LIRU_SKILL_IDS,FIELD=SGS_LIRU_STATE_FIELD,SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null,key=JSON.stringify;
const copy=x=>JSON.parse(JSON.stringify(x)),record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null
    ?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):typeof g.has_general_skill==='function'?g.has_general_skill(a,id):(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id));
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(opts,x)=>opts.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?opts[Number(x)-1]:null);
const exact=(opts,m)=>m&&opts.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card);
const epoch=(g,c)=>g.card_location_epoch(c),lock=(g,m)=>({...m,epoch:epoch(g,m.card)});
const cardId=(g,c)=>g.card_history_material_id(c);
const materialRecord=(g,m)=>({zone:m.zone,index:m.index,physical_id:cardId(g,m.card),epoch:m.epoch??epoch(g,m.card)});
const skillName=id=>({[SK.juece]:'绝策',[SK.mieji]:'灭计',[SK.fencheng]:'焚城'})[id];
const meta=(g,a,id,stage,extra={})=>({skill:skillName(id),skill_id:id,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),references=new WeakMap();
function methods(g,...names){for(const n of names)if(typeof g[n]!=='function')throw Error(`李儒接入缺少 ${n}`);}
function movement(g){methods(g,'public_card_loss','card_location_epoch','card_history_material_id');if(g.public_card_loss_supports_on_committed!==true)throw Error('李儒需要 validate/on_committed 原子移牌');}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||typeof s.fencheng_used!=='boolean'
    ||!record(s.juece)||!record(s.mieji)||!record(s.fencheng)||!record(s.mieji_phases))throw Error('Invalid Li Ru skill state');
  for(const r of [...Object.values(s.juece),...Object.values(s.mieji),...Object.values(s.fencheng)]){
    if(!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'||!['offered','paying','paid','resolving','done','failed'].includes(r.status))throw Error('Invalid Li Ru receipt');
    if(r.queue_ids&&(!Array.isArray(r.queue_ids)||new Set(r.queue_ids).size!==r.queue_ids.length||!record(r.predecessors)||!record(r.discard_counts)||!Array.isArray(r.responses)||!Number.isSafeInteger(r.queue_index)||r.queue_index<0||r.queue_index>r.queue_ids.length))throw Error('Invalid Fencheng queue');
  }
  if(Object.values(s.mieji_phases).some(p=>!stable(p.phase_id)||!stable(p.turn_id)||!stable(p.event_id)))throw Error('Invalid Mieji quota');
  return s;
}
function readState(g,a){const s=a?.[FIELD];if(!s)return null;validateState(s);if(s.owner_id!==pid(g,a))throw Error('李儒事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('李儒需要稳定人物ID');return readState(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,juece:{},mieji:{},mieji_phases:{},fencheng:{},fencheng_used:false});}
export const sgs_clone_liru_state=a=>a?.[FIELD]?copy(validateState(a[FIELD])):null;
const unfinished=(g,a,except=null)=>{const s=readState(g,a);return s&&[...Object.values(s.juece),...Object.values(s.mieji),...Object.values(s.fencheng)].some(r=>r!==except&&r.status!=='done');};
function nextId(g,a,space){const s=state(g,a);let id;do{if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('李儒事件计数耗尽');id=`${space}:${key([pid(g,a),++s.counter])}`;}while(s[space][key(id)]);return id;}
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('李儒需要稳定事件ID');const s=state(g,a),k=key(id),rk=`${space}:${k}`,old=s[space][k];
  let running=active.get(a);if(!running)active.set(a,running=new Set());let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(key(old.request)!==key(request)||known.has(rk)&&(known.get(rk).length!==refs.length||known.get(rk).some((v,i)=>v!==refs[i])))throw Error('同一李儒事件不能更换人物、费用或事实');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('李儒事务中断；须恢复原协程或从原输入日志重放'),{code:'SGS_LIRU_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][k]={event_id:id,request,status:'offered',committed:false};running.add(r);known.set(rk,refs);
  return {r,finish(){r.status='done';running.delete(r);},fail(e){r.status='failed';r.error=String(e?.message??e);running.delete(r);}};
}
function idlePlay(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===seat(g,a)
  &&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(a.play_phase_id)&&stable(g.turn_event_counter)
  &&(!Object.hasOwn(g,'active_play_phase_id')||g.active_play_phase_id===a.play_phase_id)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
function endWindow(g,a,e){return owned(g,a,SK.juece)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='end_phase'&&g.turn_actor===seat(g,a)
  &&e.actor===a&&e.turn_id===g.turn_event_counter&&stable(e.turn_id)&&stable(e.phase_event_id)
  &&(!Object.hasOwn(g,'active_end_phase_id')||g.active_end_phase_id===e.phase_event_id)&&(!e.stage||e.stage==='start')&&!e.closed&&!e.skipped&&!e.blocked&&!e.cancelled&&!e.completed;}
const resolvePlayer=(g,id)=>g.all_players().find(p=>pid(g,p)===id);
/** Every new damage packet re-evaluates liveness. The causal owner is never erased. */
export const sgs_liru_damage_source=(g,owner_id)=>{const p=resolvePlayer(g,owner_id);return live(p)?p:null;};
async function damage(g,a,target,n,id,r,receipt,nature){
  methods(g,'apply_damage');receipt.damage_event_id=`${id}:${key([pid(g,a),r.event_id,pid(g,target)])}:damage`;receipt.status='damaging';
  const source=sgs_liru_damage_source(g,pid(g,a));receipt.damage_source_id=pid(g,source);receipt.causal_owner_id=pid(g,a);
  receipt.damage=await g.apply_damage(target,n,{source,kind:'skill',method:'skill',nature,card_user:null,source_card:null,physical_cards:[],
    source_skill:id,source_skill_id:id,source_rule_id:SGS_LIRU_RULE_IDS.liru,committed_skill_effect:true,
    activation_id:r.event_id,causal_owner_id:pid(g,a),host_policy:'H8',damage_event_id:receipt.damage_event_id,
    message:`{name}受到${skillName(id)} {damage} 点${nature==='fire'?'火焰':''}伤害，剩余血量 {hp}。`});
  receipt.status='done';
}

// 绝策: actual finish phase, once per entry, other CURRENTLY empty hands.
export const sgs_juece_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&p.hand.length===0);
export const sgs_juece_available=(g,a,e)=>endWindow(g,a,e)&&!readState(g,a)?.juece[key(e.phase_event_id)]&&!unfinished(g,a)&&sgs_juece_targets(g,a).length>0;
export const sgs_ai_juece_target=(g,a)=>sgs_juece_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((p,q)=>p.hp-q.hp)[0]??null;
export async function sgs_on_end_phase_juece(g,a,_foe,e={}){
  const id=e.phase_event_id,request={owner:pid(g,a),actor:pid(g,e.actor),phase_event_id:id??null,turn_id:e.turn_id??null};
  if(readState(g,a)?.juece[key(id)]){ticket(g,a,'juece',id,request,[e.actor]);return false;}
  if(!endWindow(g,a,e)||unfinished(g,a))return false;
  const t=ticket(g,a,'juece',id,request,[e.actor]),r=t.r,bound=binding(g,a,SK.juece);
  const valid=()=>endWindow(g,a,e)&&request.phase_event_id===e.phase_event_id&&request.turn_id===e.turn_id&&binding(g,a,SK.juece)===bound&&!unfinished(g,a,r);
  try{
    let target=null;
    while(valid()){
      const targets=sgs_juece_targets(g,a);if(!targets.length)break;
      if(a.is_ai){target=sgs_ai_juece_target(g,a);break;}
      const options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}血，0手牌）`}));
      const answer=await g.view.ask_line('绝策：选择一名没有手牌的其他角色，造成1点普通技能伤害',{
        kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'不发动'}],
        meta:meta(g,a,SK.juece,'juece_target',{event_id:id,phase_event_id:id,optional:true,allow_allies:true,allow_self:false,nature:'normal',damage:1})});
      if(!valid()||pass(answer))break;
      target=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);if(target&&sgs_juece_targets(g,a).includes(target))break;target=null;
    }
    if(!target||!valid()||!sgs_juece_targets(g,a).includes(target)){r.declined=true;t.finish();return false;}
    r.committed=true;r.target_id=pid(g,target);r.status='resolving';r.damage_receipt={};
    await damage(g,a,target,1,SK.juece,r,r.damage_receipt,'normal');t.finish();return true;
  }catch(e){t.fail(e);throw e;}
}

// 灭计: black trick HAND -> global deck top; owner-private exact physical cost.
function trick(card){return snapshot_card_face(card).type==='锦囊';}
function costColor(g,a,card){return typeof g.effective_color==='function'?g.effective_color(card,a,{zone:'hand',action:'put',source_skill:SK.mieji}):snapshot_card_face(card).color;}
export function sgs_mieji_costs(g,a){return live(a)?a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`}))
  .filter(m=>m.card&&!m.card.virtual&&trick(m.card)&&costColor(g,a,m.card)==='黑'&&g.can_pay_materials?.(a,[m],{to:'decktop',action:'put',source_skill:SK.mieji})!==false):[];}
/** Eligibility uses counts only, never the opposing hand faces. */
export const sgs_mieji_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&p.hand.length>0);
const miejiUsed=(g,a)=>Boolean(readState(g,a)?.mieji_phases[key(a?.play_phase_id)]);
export const sgs_mieji_available=(g,a)=>owned(g,a,SK.mieji)&&idlePlay(g,a)&&!unfinished(g,a)&&!miejiUsed(g,a)&&sgs_mieji_costs(g,a).length>0&&sgs_mieji_targets(g,a).length>0;
export function sgs_mieji_unavailable_reason(g,a){if(!owned(g,a,SK.mieji))return '当前不拥有灭计';if(!idlePlay(g,a))return '只能在自己的真实空闲出牌阶段发动';if(unfinished(g,a))return '李儒技能正在处理或等待恢复';if(miejiUsed(g,a))return '本出牌阶段已发动灭计';return '须有黑色锦囊手牌，并选择有手牌的其他角色';}
/** Narrow topdeck authority called by host public_card_loss before detach.
 * Never use this to waive 纵玄's discard-origin receipt for other movements. */
export function sgs_liru_validate_topdeck_cost(g,a,ms,o={}){
  const r=readState(g,a)?.mieji[key(o.liru_activation_id)],m=ms?.[0],c=r?.pending_cost;
  return Boolean(o.to==='decktop'&&o.payment===true&&o.action==='put'&&o.semantic_action==='put'&&o.source===a&&o.source_skill===SK.mieji
    &&o.top_order==='first_selected_is_top'&&r&&active.get(a)?.has(r)&&r.status==='paying'&&!r.committed&&c&&ms.length===1
    &&m.zone==='hand'&&m.index===c.index&&cardId(g,m.card)===c.physical_id&&epoch(g,m.card)===c.epoch
    &&exact(sgs_mieji_costs(g,a),m)&&owned(g,a,SK.mieji)&&idlePlay(g,a)&&a.play_phase_id===r.request.phase_id&&g.turn_event_counter===r.turn_id
    &&r.binding===binding(g,a,SK.mieji)&&!miejiUsed(g,a)&&!unfinished(g,a,r)&&sgs_mieji_targets(g,a).some(p=>pid(g,p)===r.target_id));
}
/** Recipient-private only. H/E, never J/private piles. Forced effect moves are
 * distinct from payments; blocked equipment moves contribute ZERO actual cards. */
export function sgs_liru_discard_options(g,target,{branch=null,payment=false,skill_id=SK.mieji}={}){
  if(!live(target))return [];
  return [...target.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),
    ...SLOTS.flatMap(zone=>target[zone]?[{id:`eq:${zone}`,zone,index:0,card:target[zone],label:`装备：${target[zone]}`}]:[])]
    .filter(m=>m.card&&!m.card.virtual&&g.can_discard_material?.(target,m,{source:target,source_skill:skill_id})!==false
      &&(!payment||g.can_pay_materials?.(target,[m],{source_skill:skill_id,to:'discard',action:'discard',payment:true})!==false)
      &&(!branch||(branch==='trick'?trick(m.card):!trick(m.card))));
}
const value=(g,m)=>g.material_ai_cost?.(m)??(m.zone==='hand'?2:6);
export function sgs_ai_mieji_plan(g,a){
  if(!sgs_mieji_available(g,a))return null;
  const costs=sgs_mieji_costs(g,a).sort((x,y)=>value(g,x)-value(g,y));
  const targets=sgs_mieji_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((p,q)=>p.hand.length-q.hand.length||p.hp-q.hp);
  return targets.length?{material:costs[0],target:targets[0]}:null;
}
export function sgs_ai_mieji_branch(g,target){
  const ts=sgs_liru_discard_options(g,target,{branch:'trick'}).sort((a,b)=>value(g,a)-value(g,b));
  const ns=sgs_liru_discard_options(g,target,{branch:'nontrick'}).sort((a,b)=>value(g,a)-value(g,b));
  if(!ts.length)return ns.length?'nontrick':null;if(!ns.length)return 'trick';
  return ns.slice(0,2).reduce((n,m)=>n+value(g,m),0)<value(g,ts[0])?'nontrick':'trick';
}
async function chooseMiejiCost(g,a,r,valid){
  while(valid()){
    const opts=sgs_mieji_costs(g,a).map(m=>lock(g,m));if(!opts.length)return null;
    const x=await g.view.ask_line('灭计：将一张黑色锦囊手牌置于牌堆顶（不是弃置或使用）',{
      kind:'choice',player_id:seat(g,a),options:[...opts.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不置顶、不消耗次数'}],
      meta:meta(g,a,SK.mieji,'mieji_cost',{event_id:r.event_id,phase_id:r.request.phase_id,optional:true,material_zones:['hand'],destination:'decktop'})});
    if(!valid()||pass(x))return null;const m=select(opts,x);if(m&&epoch(g,m.card)===m.epoch&&exact(sgs_mieji_costs(g,a),m))return m;
  }return null;
}
async function chooseMiejiTarget(g,a,r,valid){
  while(valid()){
    const targets=sgs_mieji_targets(g,a);if(!targets.length)return null;
    const opts=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}血，${p.hand.length}张手牌）`}));
    const x=await g.view.ask_line('灭计：选择一名有手牌的其他角色',{
      kind:'choice',player_id:seat(g,a),options:[...opts,{id:'cancel',label:'取消，不置顶、不消耗次数'}],
      meta:meta(g,a,SK.mieji,'mieji_target',{event_id:r.event_id,optional:true,allow_self:false,allow_allies:true,requires_hand:true})});
    if(!valid()||pass(x))return null;const p=targets.find(p=>String(pid(g,p))===select(opts,x)?.id);if(p&&sgs_mieji_targets(g,a).includes(p))return p;
  }return null;
}
async function resolveMieji(g,a,target,r){
  const valid=()=>live(target)&&ongoing(g);r.discards=[];r.discarded_count=0;r.blocked_materials=[];r.status='resolving';
  // H8 cross-packet policy: an immovable entity gets one legitimate forced
  // attempt per unchanged location epoch. Do not grind its durability by
  // repeatedly selecting the same still-equipped card to satisfy one discard.
  const remaining=branch=>sgs_liru_discard_options(g,target,{branch}).filter(m=>!r.blocked_materials.some(b=>b.physical_id===cardId(g,m.card)&&b.epoch===epoch(g,m.card)));
  while(valid()&&!r.branch){
    const ts=remaining('trick'),ns=remaining('nontrick');
    if(!ts.length&&!ns.length){r.stopped='no_discardable_cards_H8';return;}
    if(target.is_ai){r.branch=sgs_ai_mieji_branch(g,target);break;}
    const opts=[...(ts.length?[{id:'trick',label:'弃置一张锦囊牌'}]:[]),...(ns.length?[{id:'nontrick',label:'依次弃置两张非锦囊（不足则尽量）'}]:[])];
    const x=await g.view.ask_line('灭计：由你选择弃置分支',{
      kind:'choice',player_id:seat(g,target),options:opts,meta:meta(g,target,SK.mieji,'mieji_branch',{event_id:r.event_id,mandatory:true,target_chooses:true,owner_id:pid(g,a),host_policy:'H8'})});
    if(!valid())return;const pick=select(opts,x);if(pick&&sgs_liru_discard_options(g,target,{branch:pick.id}).length)r.branch=pick.id;
  }
  const total=r.branch==='trick'?1:2;
  while(valid()&&r.branch&&r.discarded_count<total){
    const opts=remaining(r.branch).map(m=>lock(g,m));
    if(!opts.length){r.stopped=r.blocked_materials.length?'no_other_movable_cards_H8':'branch_shortfall';return;}
    let m;
    if(target.is_ai)m=[...opts].sort((a,b)=>value(g,a)-value(g,b))[0];
    else{
      const x=await g.view.ask_line(`灭计：弃置第${r.discarded_count+1}/${total}张${r.branch==='trick'?'锦囊':'非锦囊'}，每次弃置后重新检查`,{
        kind:'choice',player_id:seat(g,target),options:opts.map(({id,label})=>({id,label})),
        meta:meta(g,target,SK.mieji,'mieji_discard',{event_id:r.event_id,mandatory:true,target_chooses:true,branch:r.branch,
          ordinal:r.discarded_count+1,max_count:total,material_zones:['hand',...SLOTS],host_policy:'H8'})});
      if(!valid())return;m=select(opts,x);
    }
    const legal=()=>valid()&&m&&epoch(g,m.card)===m.epoch&&Boolean(exact(remaining(r.branch),m));if(!legal())continue;
    const receipt={attempt:r.discards.length+1,status:'paying',actual_count:0};r.discards.push(receipt);
    const result=await g.public_card_loss(target,[m],{to:'discard',payment:false,action:'discard',semantic_action:'discard',visibility:'public',reason:'灭计',source:a,source_skill:SK.mieji,
      move_id:`mieji:${key([pid(g,a),r.event_id])}:discard:${receipt.attempt}`,validate:legal,on_committed:(cards,movement)=>{
        if(cards.length>1||cards.some(c=>c!==m.card))throw Error('灭计弃牌回执实体不匹配');
        receipt.actual_count=cards.length;receipt.move_id=movement.move_id;receipt.card_ids=cards.map(c=>cardId(g,c));receipt.status='committed';r.discarded_count+=cards.length;
      }});
    if(result.committed&&receipt.status!=='committed')throw Error('灭计弃牌缺少原子回执');
    receipt.status=result.blocked?'blocked':result.committed?'done':'stale';
    if(result.blocked){r.blocked_materials.push({physical_id:cardId(g,m.card),epoch:m.epoch});receipt.host_policy='H8';}
    if(!result.committed&&!result.blocked&&legal())throw Error('灭计弃牌无进展，须从输入日志恢复');
  }
  if(!live(target))r.stopped='target_dead_H8';else if(!ongoing(g))r.stopped='game_over_H8';
}
export async function sgs_mieji_execute(g,a,{event_id=null,phase_id=null,material=null,target_id=null,choose=false}={}){
  const phase=phase_id??a.play_phase_id,id=event_id??nextId(g,a,'mieji'),request={owner:pid(g,a),phase_id:phase,choose,target_id,material:material?{zone:material.zone,index:material.index,physical_id:material.card?.physical_id??null}:null};
  if(readState(g,a)?.mieji[key(id)]){ticket(g,a,'mieji',id,request,material?[material.card]:[]);return false;}
  if(!sgs_mieji_available(g,a)||phase!==a.play_phase_id)return false;movement(g);
  const t=ticket(g,a,'mieji',id,request,material?[material.card]:[]),r=t.r,turn=g.turn_event_counter;r.turn_id=turn;r.binding=binding(g,a,SK.mieji);
  const valid=()=>owned(g,a,SK.mieji)&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&binding(g,a,SK.mieji)===r.binding&&!miejiUsed(g,a)&&!unfinished(g,a,r);
  try{
    const m=choose?await chooseMiejiCost(g,a,r,valid):material&&lock(g,material);
    const locked=()=>valid()&&m&&epoch(g,m.card)===m.epoch&&Boolean(exact(sgs_mieji_costs(g,a),m));
    if(!locked()){t.finish();return false;}
    const target=choose?await chooseMiejiTarget(g,a,r,locked):resolvePlayer(g,target_id);
    const legal=()=>locked()&&sgs_mieji_targets(g,a).includes(target);
    if(!target||!legal()){t.finish();return false;}
    r.target_id=pid(g,target);r.pending_cost=materialRecord(g,m);r.status='paying';
    const result=await g.public_card_loss(a,[m],{payment:true,to:'decktop',action:'put',semantic_action:'put',visibility:'public',reason:'灭计·置顶',source:a,source_skill:SK.mieji,
      top_order:'first_selected_is_top',liru_activation_id:id,move_id:`mieji:${key([pid(g,a),id])}:topdeck`,validate:legal,
      on_committed:(cards,movement)=>{
        if(cards.length!==1||cards[0]!==m.card)throw Error('灭计置顶费用必须完整提交');
        r.committed=true;r.status='paid';r.cost_move_id=movement.move_id;r.cost_card_id=cardId(g,m.card);
        state(g,a).mieji_phases[key(phase)]={phase_id:phase,turn_id:turn,event_id:id};
      }});
    if(result.committed&&!r.committed)throw Error('灭计置顶缺少原子回执');if(!r.committed){t.finish();return false;}
    await resolveMieji(g,a,target,r);t.finish();return true;
  }catch(e){t.fail(e);throw e;}
}
export const sgs_player_mieji=(g,a)=>sgs_mieji_execute(g,a,{choose:true});
export const sgs_ai_mieji=(g,a)=>{const p=sgs_ai_mieji_plan(g,a);return p?sgs_mieji_execute(g,a,{material:p.material,target_id:pid(g,p.target)}):false;};

// 焚城: one limited mark, immutable activation ring and initial predecessor.
export const sgs_fencheng_available=(g,a)=>owned(g,a,SK.fencheng)&&idlePlay(g,a)&&!unfinished(g,a)&&!readState(g,a)?.fencheng_used&&g.all_players().some(p=>p!==a&&live(p));
export function sgs_fencheng_unavailable_reason(g,a){if(!owned(g,a,SK.fencheng))return '当前不拥有焚城';if(readState(g,a)?.fencheng_used)return '限定技焚城本局已发动';if(unfinished(g,a))return '李儒技能正在处理或等待恢复';return '只能在自己的真实空闲出牌阶段发动';}
function initialQueue(g,a){
  methods(g,'action_order');const ring=g.action_order().filter(live),i=ring.indexOf(a);if(i<0)throw Error('焚城行动顺序缺少发动者');
  const ordered=[...ring.slice(i),...ring.slice(0,i)],ids=ordered.map(p=>pid(g,p));
  if(ids.some(x=>!stable(x))||new Set(ids).size!==ids.length)throw Error('焚城行动顺序人物不唯一');
  return {queue_ids:ids.slice(1),predecessors:Object.fromEntries(ids.slice(1).map((id,i)=>[key(id),ids[i]])),discard_counts:Object.fromEntries(ids.map(id=>[key(id),0]))};
}
const fenchengOptions=(g,p)=>sgs_liru_discard_options(g,p,{payment:true,skill_id:SK.fencheng});
/** Public-information activation policy: do not read other hands or the deck. */
export function sgs_ai_fencheng_should_use(g,a){
  if(!sgs_fencheng_available(g,a))return false;let benefit=0;
  for(const p of g.all_players().filter(p=>p!==a&&live(p))){
    const count=p.hand.length+SLOTS.filter(s=>p[s]).length,pressure=count===0?7+(p.hp<=2?6:0):count===1?4:2;
    benefit+=(g.side_of(p)===g.side_of(a)?-1.4:1)*pressure;
  }return benefit>2;
}
/** Only responder's private cards are examined. Overpay when it cheaply makes
 * the INITIAL next opponent's minimum unaffordable; never punish an ally. */
export function sgs_ai_fencheng_response(g,target,r,x){
  const opts=fenchengOptions(g,target).sort((a,b)=>value(g,a)-value(g,b));
  if(opts.length<x)return {kind:'damage',materials:[]};
  const damageCost=target.hp<=2?100:target.hp===3?12:8,minimum=opts.slice(0,x),cost=minimum.reduce((n,m)=>n+value(g,m),0);
  if(cost>damageCost)return {kind:'damage',materials:[]};
  const nextId=r.queue_ids[r.queue_ids.indexOf(pid(g,target))+1],next=resolvePlayer(g,nextId);
  let n=x;
  if(next&&live(next)&&g.side_of(next)!==g.side_of(target)){
    const publicCount=next.hand.length+SLOTS.filter(s=>next[s]).length,candidate=Math.max(x,publicCount);
    if(candidate<=opts.length&&candidate<=x+2&&opts.slice(x,candidate).reduce((n,m)=>n+value(g,m),0)<=3)n=candidate;
  }
  return {kind:'discard',materials:opts.slice(0,n)};
}
async function chooseFenchengResponse(g,a,target,r,item){
  const valid=()=>live(target)&&ongoing(g);let chosen=[];
  while(valid()){
    const opts=fenchengOptions(g,target).map(m=>lock(g,m));
    if(chosen.some(m=>epoch(g,m.card)!==m.epoch||!exact(opts,m)))chosen=[];
    if(target.is_ai)return sgs_ai_fencheng_response(g,target,r,item.x);
    const selected=chosen.map(m=>m.id);
    const options=[...opts.map(({id,label})=>({id,label:`${selected.includes(id)?'已选 ':'未选 '}${label}`})),
      {id:'discard',label:`确认弃置${chosen.length}张（至少${item.x}张）`,disabled:chosen.length<item.x},
      {id:'damage',label:'受到2点火焰伤害，不弃牌'}];
    const x=await g.view.ask_line(`焚城：弃置至少${item.x}张手牌或装备，或受到2点火焰伤害`,{
      kind:'choice',player_id:seat(g,target),options,
      meta:meta(g,target,SK.fencheng,'fencheng_response',{event_id:r.event_id,mandatory:true,target_chooses:true,host_policy:'H8',
        x:item.x,responder_id:pid(g,target),predecessor_id:item.predecessor_id,predecessor_discard_count:item.predecessor_discard_count,
        queue_ids:[...r.queue_ids],queue_index:r.queue_index,selected,selected_count:selected.length,min_count:item.x,
        material_zones:['hand',...SLOTS],allow_overpay:true,nature:'fire',damage:2,causal_owner_id:pid(g,a)})});
    if(!valid())return null;const pick=select(options,x);if(!pick||pick.disabled)continue;
    if(pick.id==='damage')return {kind:'damage',materials:[]};
    if(pick.id==='discard'){
      if(chosen.length>=item.x&&chosen.every(m=>epoch(g,m.card)===m.epoch&&exact(fenchengOptions(g,target),m)))return {kind:'discard',materials:chosen};
      chosen=[];continue;
    }
    const m=opts.find(o=>o.id===pick.id);if(!m||epoch(g,m.card)!==m.epoch||!exact(fenchengOptions(g,target),m))continue;
    chosen=chosen.some(c=>c.card===m.card)?chosen.filter(c=>c.card!==m.card):[...chosen,m];
  }return null;
}
async function resolveFencheng(g,a,r){
  r.status='resolving';
  while(r.queue_index<r.queue_ids.length&&ongoing(g)){
    const target_id=r.queue_ids[r.queue_index],target=resolvePlayer(g,target_id),predecessor_id=r.predecessors[key(target_id)],predecessor_discard_count=r.discard_counts[key(predecessor_id)]??0;
    const item={target_id,predecessor_id,predecessor_discard_count,x:predecessor_discard_count+1,status:'offered',actual_discard_count:0};r.responses.push(item);
    if(!live(target)){item.status='skipped_dead';r.queue_index++;continue;}
    while(live(target)&&ongoing(g)&&item.status!=='done'){
      const choice=await chooseFenchengResponse(g,a,target,r,item);if(!choice)break;
      if(choice.kind==='damage'){item.choice='damage';r.discard_counts[key(target_id)]=0;await damage(g,a,target,2,SK.fencheng,r,item,'fire');break;}
      const chosen=choice.materials.map(m=>m.epoch===undefined?lock(g,m):m);
      const legal=(actual=chosen)=>live(target)&&ongoing(g)&&actual.length===chosen.length&&chosen.length>=item.x&&new Set(chosen.map(m=>m.card)).size===chosen.length
        &&chosen.every(m=>epoch(g,m.card)===m.epoch&&exact(fenchengOptions(g,target),m));
      if(!legal())continue;
      item.status='paying';item.attempt=(item.attempt??0)+1;
      const result=await g.public_card_loss(target,chosen,{payment:true,to:'discard',action:'discard',semantic_action:'discard',visibility:'public',reason:'焚城',source:a,source_skill:SK.fencheng,
        move_id:`fencheng:${key([pid(g,a),r.event_id,target_id])}:discard:${item.attempt}`,validate:legal,
        on_committed:(cards,movement)=>{
          if(cards.length!==chosen.length||cards.length<item.x||cards.some((c,i)=>c!==chosen[i].card))throw Error('焚城需完整支付至少X张，不能用阻止移动的装备充数');
          item.choice='discard';item.actual_discard_count=cards.length;item.card_ids=cards.map(c=>cardId(g,c));item.move_id=movement.move_id;item.status='committed';
          r.discard_counts[key(target_id)]=cards.length;
        }});
      if(result.committed&&item.status!=='committed')throw Error('焚城费用缺少原子回执');
      if(item.status==='committed'){item.status='done';break;}
      item.status='offered';if(!result.blocked&&!result.payment_rejected&&legal())throw Error('焚城费用无进展，须从原输入日志恢复');
    }
    if(item.status!=='done')item.status=!live(target)?'skipped_dead':'stopped_game_over';
    r.queue_index++;
  }
  if(!ongoing(g))r.stopped='game_over_H8';
}
export async function sgs_fencheng_execute(g,a,{event_id=null,phase_id=null,choose=false}={}){
  const phase=phase_id??a.play_phase_id,id=event_id??nextId(g,a,'fencheng'),request={owner:pid(g,a),phase_id:phase,choose};
  if(readState(g,a)?.fencheng[key(id)]){ticket(g,a,'fencheng',id,request);return false;}
  if(!sgs_fencheng_available(g,a)||phase!==a.play_phase_id)return false;movement(g);
  const t=ticket(g,a,'fencheng',id,request),r=t.r,turn=g.turn_event_counter,bound=binding(g,a,SK.fencheng);
  const valid=()=>owned(g,a,SK.fencheng)&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&binding(g,a,SK.fencheng)===bound&&!state(g,a).fencheng_used&&!unfinished(g,a,r);
  try{
    if(choose){
      let accepted=false;
      while(valid()){
        const opts=[{id:'activate',label:'发动焚城（本局一次，所有其他角色含队友）'},{id:'cancel',label:'取消，不消耗限定标记'}];
        const x=await g.view.ask_line('焚城：是否消耗本局唯一限定标记？',{
          kind:'choice',player_id:seat(g,a),options:opts,meta:meta(g,a,SK.fencheng,'fencheng_offer',{event_id:id,optional:true,limited:true,includes_allies:true,host_policy:'H8'})});
        if(!valid()||pass(x))break;if(select(opts,x)?.id==='activate'){accepted=true;break;}
      }
      if(!accepted){t.finish();return false;}
    }
    if(!valid()){t.finish();return false;}
    Object.assign(r,initialQueue(g,a),{queue_index:0,responses:[],turn_id:turn,causal_owner_id:pid(g,a),host_policy:'H8'});
    state(g,a).fencheng_used=true;r.committed=true;r.status='paid';
    g.view.emit(`${a.name}发动焚城：按发动时座次依次结算；来源死亡、失技续算采用江湖H8兼容规则。`,{event_type:'skill_activation',skill_id:SK.fencheng,activation_id:id,causal_owner_id:pid(g,a),host_policy:'H8',queue_ids:[...r.queue_ids],predecessors:{...r.predecessors}});
    await resolveFencheng(g,a,r);t.finish();return true;
  }catch(e){t.fail(e);throw e;}
}
export const sgs_player_fencheng=(g,a)=>sgs_fencheng_execute(g,a,{choose:true});
export const sgs_ai_fencheng=(g,a)=>sgs_ai_fencheng_should_use(g,a)?sgs_fencheng_execute(g,a):false;

/** Pure public DTO: no pending cost/card identities, private choice, or hand faces. */
export function sgs_liru_public_state(a,g=null){
  const s=a?.[FIELD]?validateState(a[FIELD]):null,phase=a?.play_phase_id??null;
  return {current_play_phase_id:phase,mieji_used:Boolean(s?.mieji_phases[key(phase)]),fencheng_used:s?.fencheng_used??false,host_policy:'H8',
    juece_events:Object.values(s?.juece??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,target_id:r.target_id??null,damage:r.damage_receipt?.damage??0})),
    mieji_phases:Object.values(s?.mieji_phases??{}).map(copy),
    mieji_events:Object.values(s?.mieji??{}).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,status:r.status,committed:r.committed,
      target_id:r.committed?r.target_id:null,branch:r.branch??null,discarded_count:r.discarded_count??0,cost_card_id:r.committed?r.cost_card_id:null,
      discards:(r.discards??[]).map(d=>({status:d.status,actual_count:d.actual_count,move_id:d.move_id??null})),stopped:r.stopped??null})),
    fencheng_events:Object.values(s?.fencheng??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,queue_ids:[...(r.queue_ids??[])],
      queue_index:r.queue_index??0,predecessors:{...r.predecessors},discard_counts:{...r.discard_counts},causal_owner_id:r.causal_owner_id??null,
      responder_id:r.queue_ids?.[r.queue_index]??null,responses:(r.responses??[]).map(({card_ids,...row})=>copy(row)),stopped:r.stopped??null,host_policy:'H8'}))};
}
export function sgs_liru_skill_definitions({SkillHooks,ActiveSkillDef}){
  const mieji=new ActiveSkillDef({skill_id:SK.mieji,hotkey:'q',button_label:'灭计',available:sgs_mieji_available,player:sgs_player_mieji,ai:sgs_ai_mieji,
    help_text:'2015历史版：出牌阶段限一次，将一张黑色锦囊手牌置于全局牌堆顶。须选择有手牌的其他角色，由其弃一张锦囊或依次弃两张非锦囊。'});
  const fencheng=new ActiveSkillDef({skill_id:SK.fencheng,hotkey:'e',button_label:'焚城',available:sgs_fencheng_available,player:sgs_player_fencheng,ai:sgs_ai_fencheng,
    help_text:'限定技：所有其他角色从你的下家依次弃至少X张手牌/装备或受2火伤。X为发动时上家本次实际弃牌数+1。包含队友；中途死亡续算采用H8。'});
  Object.assign(mieji,{source_skill_id:SK.mieji,owns_target_selection:true,targets:sgs_mieji_targets,unavailable_reason:sgs_mieji_unavailable_reason});
  Object.assign(fencheng,{source_skill_id:SK.fencheng,owns_target_selection:true,unavailable_reason:sgs_fencheng_unavailable_reason});
  return {hooks:{[SGS_LIRU_RULE_IDS.liru]:SkillHooks({on_end_phase:[sgs_on_end_phase_juece]})},active:{[SGS_LIRU_RULE_IDS.liru]:[mieji,fencheng]}};
}
