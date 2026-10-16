/** Historical Mobile 陈琳: true-turn-start 笔伐 and per-target lifetime 颂词.
 * HR15/16/17 are explicit host compatibility, not native-client certification. */
import {CardType} from './models.js';
import {sgs_dingpin_card_category} from './sgs-followup-chenqun.js';
import {SGS_CHENLIN_HERO_ID as HERO,SGS_CHENLIN_SKILL_IDS as SK} from './sgs-chenlin-data.js';
import {chenlin_key as key,chenlin_live as live,chenlin_pid as pid,chenlin_actor as actorById,chenlin_ongoing as ongoing,
  chenlin_owned as owned,chenlin_binding as binding,chenlin_stable as stable,chenlin_read as read,chenlin_state as state,
  chenlin_methods as methods,chenlin_movement as movement,chenlin_pending as pending,chenlin_pile_material as pileMaterial,
  chenlin_next as next,chenlin_ticket as ticket} from './sgs-chenlin-runtime.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const pass=x=>['pass','cancel','decline','refuse','0','n','no'].includes(String(x));
const select=(os,v)=>os.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?os[Number(v)-1]:null);
const allied=(g,a,b)=>a===b||typeof g.side_of==='function'&&g.side_of(a)===g.side_of(b);
const cost=(g,m)=>g.material_ai_cost?.(m)??2;
const meta=(g,a,skill,stage,extra={})=>({skill:skill===SK.bifa?'笔伐':'颂词',skill_id:skill,stage,private_to:g.seat_of(a),private_choice:true,...extra});
const materialRequest=(g,m)=>m?{zone:m.zone,index:m.index,physical_id:g.card_history_material_id(m.card),epoch:m.epoch??g.card_location_epoch(m.card)}:null;
const exact=(os,m)=>m&&os.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||m.epoch===o.epoch));
export function sgs_chenlin_card_category(g,a,card,zone='hand',action='give'){
  return sgs_dingpin_card_category(g.effective_card?.(card,a,{action,zone})??card);
}
export function sgs_bifa_materials(g,a){
  if(!live(a))return [];
  return a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}：${card}`,
    category:sgs_chenlin_card_category(g,a,card)})).filter(m=>!m.card.virtual&&m.category);
}
export const sgs_bifa_targets=(g,a)=>g.all_players().filter(t=>t!==a&&live(t)&&!(t.sgs_bifa_pile?.length)&&!pending(g,t).length);
export const sgs_bifa_used=(g,a,phase=g.active_end_phase_id)=>Boolean(read(g)?.end_phases[key([pid(g,a),phase])]);
function endWindow(g,a,e){return owned(g,a,SK.bifa)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='end_phase'
  &&g.turn_actor===g.seat_of(a)&&stable(g.turn_event_counter)&&stable(e?.phase_event_id)&&g.active_end_phase_id===e.phase_event_id
  &&e.actor===a&&e.turn_id===g.turn_event_counter&&e.stage==='start'&&!e.closed&&!sgs_bifa_used(g,a,e.phase_event_id);}
export const sgs_bifa_available=(g,a,e)=>endWindow(g,a,e)&&sgs_bifa_materials(g,a).length>0&&sgs_bifa_targets(g,a).length>0;
/** AI reads its own cards and public opponent hand counts, never categories. */
export function sgs_ai_bifa_plan(g,a,e){
  if(!sgs_bifa_available(g,a,e)||typeof g.side_of!=='function')return null;
  const targets=sgs_bifa_targets(g,a).filter(t=>!allied(g,a,t)).sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp);
  const ms=sgs_bifa_materials(g,a).filter(m=>!(m.card.type===CardType.TAO&&a.hp<=1)).sort((x,y)=>cost(g,x)-cost(g,y));
  return targets.length&&ms.length?{target:targets[0],material:ms[0]}:null;
}
async function choosePlacement(g,a,e,row,valid){
  let material=null,target=null;
  while(valid()&&!material){const os=sgs_bifa_materials(g,a);if(!os.length)return null;
    const value=await g.view.ask_line('笔伐：选择一张手牌秘密扣置',{kind:'choice',player_id:g.seat_of(a),options:[...os.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],
      meta:meta(g,a,SK.bifa,'bifa_material',{event_id:row.event_id,phase_event_id:e.phase_event_id,material_zones:['hand'],optional:true})});
    if(!valid()||pass(value))return null;material=select(os,value);if(material&&!exact(sgs_bifa_materials(g,a),material))return null;
  }
  while(valid()&&!target){if(!exact(sgs_bifa_materials(g,a),material))return null;
    const os=sgs_bifa_targets(g,a).map(t=>({id:`target:${pid(g,t)}`,target:t,label:`${t.name}（${t.hp}血，${t.hand.length}手牌）`}));if(!os.length)return null;
    const value=await g.view.ask_line('笔伐：选择没有笔伐牌的其他角色',{kind:'choice',player_id:g.seat_of(a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消'}],
      meta:meta(g,a,SK.bifa,'bifa_target',{event_id:row.event_id,allow_self:false,hidden_placement:true})});
    if(!valid()||pass(value))return null;target=select(os,value)?.target??null;
  }
  return material&&target?{material,target}:null;
}
export async function sgs_bifa_place(g,a,{phase_event,event_id=null,material=null,target=null,choose:interactive=false}={}){
  const e=phase_event,id=event_id??`bifa-place:${key([pid(g,a),e?.phase_event_id])}`;
  const request={source_actor_id:pid(g,a),phase_id:e?.phase_event_id??null,choose:interactive,material:materialRequest(g,material),target_actor_id:pid(g,target)};
  if(read(g)?.placements[key(id)]){ticket(g,'placements',id,request);return false;}
  if(!sgs_bifa_available(g,a,e)||!interactive&&(!exact(sgs_bifa_materials(g,a),material)||!sgs_bifa_targets(g,a).includes(target)))return false;
  movement(g);const t=ticket(g,'placements',id,request),row=t.row,bound=binding(g,a,SK.bifa),s=state(g);
  const valid=()=>endWindow(g,a,e)&&binding(g,a,SK.bifa)===bound;
  try{
    const selected=interactive?await choosePlacement(g,a,e,row,valid):{material:{...material,epoch:g.card_location_epoch(material.card)},target};
    const legal=()=>valid()&&selected&&Boolean(exact(sgs_bifa_materials(g,a),selected.material))&&sgs_bifa_targets(g,a).includes(selected.target);
    if(!legal()){row.cancelled=true;t.finish();return false;}
    const m=selected.material,receiver=selected.target,obligation_id=`bifa:${key([pid(g,a),id])}`;row.status='placing';
    const result=await g.public_card_loss(a,[m],{to:'bifa',recipient:receiver,visibility:'private',reason:'笔伐·秘密扣置',action:'bifa_place',semantic_action:'bifa_place',source:a,source_skill:SK.bifa,
      move_id:`${obligation_id}:place`,validate:legal,on_committed:(cards,receipt)=>{
        if(cards.length!==1||cards[0]!==m.card)throw Error('笔伐须扣置恰好所选实体手牌');
        s.obligations[key(obligation_id)]={obligation_id,source_actor_id:pid(g,a),target_actor_id:pid(g,receiver),physical_card_id:g.card_history_material_id(m.card),card_epoch:g.card_location_epoch(m.card),
          placement_phase_id:e.phase_event_id,placement_receipt_id:receipt.move_id,settlement_turn_event_id:null,state:'PENDING',visibility_authorizations:[pid(g,a)],decision_id:null,branch_receipt:null,cleanup_receipts:{},turn_attempts:{}};
        s.end_phases[key([pid(g,a),e.phase_event_id])]=obligation_id;row.committed=true;row.obligation_id=obligation_id;row.status='placed';
      }});
    if(Boolean(result?.committed)!==row.committed)throw Error('笔伐扣置缺少一致原子回执');
    t.finish();if(row.committed)g.view.emit(`${a.name}将一张手牌秘密扣置为${receiver.name}的笔伐牌。`,{event_type:'skill_resolution',skill_id:SK.bifa,obligation_id,source_actor_id:pid(g,a),target_actor_id:pid(g,receiver),count:1});return row.committed;
  }catch(error){t.fail(error);throw error;}
}
export async function sgs_bifa_end_phase(g,a,_target,e){
  if(!sgs_bifa_available(g,a,e))return false;
  if(a.is_ai){const p=sgs_ai_bifa_plan(g,a,e);return p?sgs_bifa_place(g,a,{phase_event:e,...p}):false;}
  return sgs_bifa_place(g,a,{phase_event:e,choose:true});
}
sgs_bifa_end_phase.source_skill_id=SK.bifa;

/** Only a real turn opens the target's viewing permission. */
function turnWindow(g,target,e){return live(target)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='turn_start'&&g.turn_actor===g.seat_of(target)
  &&stable(e?.event_id)&&e.event_id===`turn:${g.turn_event_counter}`&&!e.closed;}
export function sgs_bifa_payment_materials(g,target,r){
  if(!r?.visibility_authorizations?.includes(pid(g,target)))return [];
  const held=pileMaterial(g,r);if(!held)return [];
  const category=sgs_chenlin_card_category(g,target,held.card,'bifa','reveal');
  return category?sgs_bifa_materials(g,target).filter(m=>m.category===category&&g.can_pay_materials?.(target,[m],{to:'hand',recipient:actorById(g,r.source_actor_id),action:'give',source_skill:SK.bifa})!==false):[];
}
export function sgs_ai_bifa_payment(g,target,source,r){
  const ms=sgs_bifa_payment_materials(g,target,r).sort((x,y)=>cost(g,x)-cost(g,y));if(!ms.length)return null;
  // Trade preserves HP. At safe HP, avoid surrendering the last rescue card
  // merely to acquire a less valuable card from a hostile source.
  const held=pileMaterial(g,r),m=ms[0];if(target.hp>1&&!allied(g,target,source)&&m.card.type===CardType.TAO&&held&&cost(g,m)>cost(g,held)+1)return null;
  return m;
}
const settlements=new WeakMap();
function inFlight(g){let jobs=settlements.get(g);if(!jobs)settlements.set(g,jobs=new Set());return jobs;}
const uncommitted=r=>['PENDING','AWAITING_CHOICE'].includes(r.state)&&!r.branch_receipt;
/** Game-scoped death cleanup is independent of current effective skill owner. */
export async function sgs_bifa_lifecycle(g,{actor,kind='death',death_event_id,event_id=death_event_id}={}){
  if(kind!=='death'||!actor?.dead||!stable(event_id))return false;
  const actorId=pid(g,actor),rows=Object.values(read(g)?.obligations??{});let changed=false;
  for(const r of rows){
    if(r.source_actor_id!==actorId&&r.target_actor_id!==actorId)continue;
    if(r.branch_receipt){if(r.target_actor_id===actorId&&!r.branch_receipt.hp_applied&&r.branch_receipt.branch==='refuse')r.stopped='target_dead';continue;}
    if(!uncommitted(r))continue;
    const cleanupId=`${r.obligation_id}:cleanup:${key(event_id)}`;if(r.cleanup_receipts[key(cleanupId)])continue;
    const m=pileMaterial(g,r),target=actorById(g,r.target_actor_id);
    if(!m){r.state='CANCELLED';r.stopped='pending_card_absent';r.cleanup_receipts[key(cleanupId)]={event_id,physical_card_id:r.physical_card_id,epoch:r.card_epoch,moved:false};changed=true;continue;}
    movement(g);
    const result=await g.public_card_loss(target,[m],{to:'discard',visibility:'public',action:'lifecycle_cleanup',semantic_action:'lifecycle_cleanup',death_cleanup:true,poison_exempt:true,
      reason:'笔伐·死亡清理（未提交分支，无体力损失）',source:actor,source_skill:SK.bifa,move_id:cleanupId,
      validate:()=>uncommitted(r)&&Boolean(pileMaterial(g,r))&&(actorById(g,r.source_actor_id)?.dead||target?.dead),
      on_committed:(cards,receipt)=>{if(cards.length!==1||cards[0]!==m.card)throw Error('笔伐死亡清理必须核对原实体');r.state='CANCELLED';r.stopped=target.dead?'target_dead':'source_dead';r.cleanup_receipts[key(cleanupId)]={event_id,physical_card_id:r.physical_card_id,epoch:r.card_epoch,moved:true,move_id:receipt.move_id};}});
    if(!result?.committed&&uncommitted(r))throw Error('笔伐死亡清理未能移动精确实体，不能遗失义务');changed=changed||result.committed;
  }
  return changed;
}
/** Commit the exact answered branch only; never reuse an old answer after a
 * location, category, actor-liveness or decision-window change. */
export async function sgs_bifa_commit_branch(g,obligation_id,{branch,material=null,decision_id,turn_event}={}){
  const r=read(g)?.obligations[key(obligation_id)];if(!r||!uncommitted(r)||r.decision_id!==decision_id)return false;
  const source=actorById(g,r.source_actor_id),target=actorById(g,r.target_actor_id),held=pileMaterial(g,r);
  const valid=()=>uncommitted(r)&&r.decision_id===decision_id&&turnWindow(g,target,turn_event)&&live(source)&&Boolean(pileMaterial(g,r))
    &&(branch==='refuse'||branch==='trade'&&Boolean(exact(sgs_bifa_payment_materials(g,target,r),material)));
  if(!held||!valid()||!['trade','refuse'].includes(branch))return false;
  movement(g,{transaction:branch==='trade'});methods(g,'lose_hp');
  const move_id=`${decision_id}:branch`,commit=(cardsByLeg,receipt)=>{
    const expected=branch==='trade'?[material.card,held.card]:[held.card];
    if(cardsByLeg.flat().length!==expected.length||cardsByLeg.flat().some((c,i)=>c!==expected[i]))throw Error('笔伐分支原子交易实体不一致');
    r.branch_receipt={branch,commit_event_id:move_id,selected_payment_card_id:material?g.card_history_material_id(material.card):null,
      selected_payment_epoch:material?.epoch??null,pile_card_id:r.physical_card_id,pile_card_epoch:r.card_epoch,
      physical_move_receipts:(receipt.moves??[receipt]).map(x=>({move_id:x.move_id})),hp_loss_receipt_id:branch==='refuse'?`${decision_id}:hp`:null,
      hp_applied:false,post_commit_hooks_completed:false};r.state=branch==='trade'?'TRADE_COMMITTED':'REFUSAL_COMMITTED';
  };
  let result;
  if(branch==='trade'){
    result=await g.public_card_transaction([
      {owner:target,materials:[material],to:'hand',recipient:source,visibility:'private',action:'give',semantic_action:'give',reason:'笔伐·同类手牌支付',source:target,source_skill:SK.bifa,payment:true},
      {owner:target,materials:[held],to:'hand',recipient:target,visibility:'private',action:'obtain',semantic_action:'obtain',reason:'笔伐·获得扣置牌',source,source_skill:SK.bifa},
    ],{move_id,validate:valid,on_committed:commit});
  }else result=await g.public_card_loss(target,[held],{to:'discard',visibility:'public',action:'bifa_remove',semantic_action:'bifa_remove',reason:'笔伐·拒绝或无法交牌',source,source_skill:SK.bifa,
    move_id,validate:valid,on_committed:(cards,receipt)=>commit([cards],receipt)});
  if(Boolean(result?.committed)!==Boolean(r.branch_receipt))throw Error('笔伐分支缺少一致原子回执');
  if(!r.branch_receipt)return false;
  r.branch_receipt.post_commit_hooks_completed=true;
  if(branch==='refuse'){
    if(live(target)&&ongoing(g)){
      // Durable before await: duplicate callers cannot issue a second HP loss.
      r.branch_receipt.hp_applied=true;
      await g.lose_hp(target,1,{source:null,source_skill:SK.bifa,reason:'笔伐',kind:'bifa_hp_loss',hp_loss_event_id:r.branch_receipt.hp_loss_receipt_id,obligation_id:r.obligation_id});
    }else r.stopped=target?.dead?'target_dead':'match_closed';
  }
  r.state='SETTLED';
  if(ongoing(g))g.view.emit(`${target.name}${branch==='trade'?'交给来源一张同类手牌并获得笔伐牌':r.branch_receipt.hp_applied?'移去笔伐牌并失去1点体力':'移去笔伐牌；体力结算已终止'}。`,
    {event_type:'skill_resolution',skill_id:SK.bifa,obligation_id:r.obligation_id,branch,host_lifecycle_policy:'HR15',hp_applied:r.branch_receipt.hp_applied});
  return true;
}
export async function sgs_bifa_turn_start(g,target,e){
  if(!turnWindow(g,target,e))return false;
  const rows=pending(g,target);let changed=false;
  for(const r of rows){
    if(inFlight(g).has(r.obligation_id)||r.turn_attempts[key(e.event_id)])continue;
    const source=actorById(g,r.source_actor_id);
    if(source?.dead){await sgs_bifa_lifecycle(g,{actor:source,death_event_id:`bifa-observed-death:${r.obligation_id}`});continue;}
    if(!live(source)||!pileMaterial(g,r))continue;
    inFlight(g).add(r.obligation_id);r.turn_attempts[key(e.event_id)]={status:'selecting',choice_counter:0,rejected_payments:[],refusal_rejected:false};
    const attempt=r.turn_attempts[key(e.event_id)];r.state='AWAITING_CHOICE';r.settlement_turn_event_id=e.event_id;
    if(!r.visibility_authorizations.includes(pid(g,target)))r.visibility_authorizations.push(pid(g,target));
    const valid=()=>uncommitted(r)&&turnWindow(g,target,e)&&live(source)&&Boolean(pileMaterial(g,r));
    const paymentKey=m=>key([g.card_history_material_id(m.card),m.epoch]);
    try{
      while(valid()){
        const decision_id=`${r.obligation_id}:decision:${key(e.event_id)}:${++attempt.choice_counter}`;r.decision_id=decision_id;
        const os=sgs_bifa_payment_materials(g,target,r).filter(m=>!attempt.rejected_payments.includes(paymentKey(m))),held=pileMaterial(g,r);
        if(!os.length&&attempt.refusal_rejected)break;
        let choice=null;
        if(!os.length)choice={branch:'refuse'};
        else if(target.is_ai){const preferred=sgs_ai_bifa_payment(g,target,source,r),m=os.find(x=>x.card===preferred?.card)??(attempt.refusal_rejected?os[0]:null);choice=m?{branch:'trade',material:m}:{branch:'refuse'};}
        else{
          const value=await g.view.ask_line(`笔伐：观看${held.card}，交给${source.name}一张同类手牌并获得此牌，或移去此牌失去1点体力`,{
            kind:'choice',player_id:g.seat_of(target),options:[...os.map(({id,label})=>({id,label})),...(!attempt.refusal_rejected?[{id:'refuse',label:'移去笔伐牌，失去1点体力'}]:[])],
            meta:meta(g,target,SK.bifa,'bifa_payment',{obligation_id:r.obligation_id,decision_id,source_actor_id:r.source_actor_id,material_zones:['hand'],
              held_card:{name:held.card.name,type:held.card.type,suit:held.card.suit,color:held.card.color,rank:held.card.rank},required_category:sgs_chenlin_card_category(g,target,held.card,'bifa','reveal'),optional:!attempt.refusal_rejected})});
          if(!valid())break;
          if(pass(value)&&!attempt.refusal_rejected)choice={branch:'refuse'};
          else {const m=select(os,value);if(m&&exact(sgs_bifa_payment_materials(g,target,r),m))choice={branch:'trade',material:m};}
        }
        if(!choice)continue;
        if(await sgs_bifa_commit_branch(g,r.obligation_id,{...choice,decision_id,turn_event:e})){changed=true;break;}
        if(!valid())break;
        // HR16: a failed exact leg never turns silently into refusal. Recompute
        // the chooser's remaining committable candidates under a fresh decision.
        // Each rejected entity/epoch or refusal branch is attempted once here.
        if(choice.branch==='trade')attempt.rejected_payments.push(paymentKey(choice.material));else attempt.refusal_rejected=true;
      }
      if(uncommitted(r)){r.state='PENDING';attempt.status='retry_next_true_turn';}else attempt.status='done';
    }catch(error){attempt.status='failed';attempt.error=String(error?.message??error);throw error;}
    finally{inFlight(g).delete(r.obligation_id);}
    if(!turnWindow(g,target,e))break;
  }
  return changed;
}

function playWindow(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===g.seat_of(a)
  &&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(g.turn_event_counter)&&stable(a.play_phase_id)&&g.active_play_phase_id===a.play_phase_id
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
export const sgs_songci_used=(g,a,t)=>Boolean(read(g)?.songci_targets[key(pid(g,a))]?.includes(pid(g,t)));
export function sgs_songci_options(g,a){
  if(!owned(g,a,SK.songci)||!playWindow(g,a))return [];
  if(Object.values(read(g)?.songci??{}).some(r=>r.source_actor_id===pid(g,a)&&!['done','cancelled'].includes(r.status)))return [];
  return g.all_players().filter(t=>live(t)&&t.hand.length!==t.hp&&!sgs_songci_used(g,a,t)).map(t=>({id:`target:${pid(g,t)}`,target:t,branch:t.hand.length<t.hp?'draw':'discard',label:`${t.name}（${t.hand.length}手牌 / ${t.hp}体力）：${t.hand.length<t.hp?'摸两张牌':'弃两张手牌/装备'}`}));
}
export const sgs_songci_available=(g,a)=>sgs_songci_options(g,a).length>0;
export const sgs_songci_unavailable_reason=(g,a)=>!owned(g,a,SK.songci)?'当前不拥有颂词':!playWindow(g,a)?'只能在自己的真实空闲出牌阶段发动':'没有手牌数不同于当前体力且未被自己颂词的角色';
export function sgs_songci_discard_materials(g,a){
  if(!live(a))return [];
  const ms=a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch(card),label:`手牌${index+1}：${card}`}));
  for(const slot of SLOTS)if(a[slot])ms.push({id:`eq:${slot}`,zone:slot,index:0,card:a[slot],epoch:g.card_location_epoch(a[slot]),label:`装备：${a[slot]}`});
  return ms.filter(m=>!m.card.virtual&&g.can_discard_material?.(a,m,{source:a,source_skill:SK.songci})!==false&&g.can_pay_materials?.(a,[m],{to:'discard',action:'discard',source_skill:SK.songci})!==false);
}
async function songciDiscard(g,target,r){
  let selected=[];
  while(live(target)&&ongoing(g)){
    const os=sgs_songci_discard_materials(g,target),count=Math.min(2,os.length);
    if(!count){r.discarded=0;return;}
    selected=selected.filter(m=>exact(os,m));
    if(os.length<=2)selected=os;
    else if(target.is_ai)selected=[...os].sort((x,y)=>cost(g,x)-cost(g,y)).slice(0,count);
    else if(selected.length<count){
      const value=await g.view.ask_line(`颂词：自己选择${count}张手牌/装备弃置（已选${selected.length}张）`,{kind:'choice',player_id:g.seat_of(target),
        options:os.filter(m=>!selected.some(x=>x.card===m.card)).map(({id,label})=>({id,label})),
        meta:meta(g,target,SK.songci,'songci_discard',{event_id:r.event_id,mandatory:true,material_zones:['hand',...SLOTS],exact_count:count,selected_ids:selected.map(m=>m.id)})});
      if(!live(target)||!ongoing(g))return;
      const m=select(os,value);if(m&&exact(sgs_songci_discard_materials(g,target),m)&&!selected.some(x=>x.card===m.card))selected.push(m);continue;
    }
    const valid=()=>live(target)&&ongoing(g)&&selected.length===Math.min(2,sgs_songci_discard_materials(g,target).length)&&selected.every(m=>exact(sgs_songci_discard_materials(g,target),m));
    if(!valid()){selected=[];continue;}
    const result=await g.public_card_loss(target,selected,{to:'discard',visibility:'public',action:'discard',semantic_action:'discard',reason:'颂词',source:actorById(g,r.source_actor_id),source_skill:SK.songci,
      move_id:`${r.event_id}:discard:${r.discard_attempts=(r.discard_attempts??0)+1}`,validate:valid,
      on_committed:(cards,receipt)=>{r.discarded=cards.length;r.discard_move_id=receipt.move_id;r.discard_card_ids=cards.map(c=>g.card_history_material_id(c));}});
    if(result?.committed)return;
    // A failed foreign movement protection must not create an unbounded loop.
    r.stopped='discard_movement_rejected';return;
  }
}
export async function sgs_songci_activate(g,a,{target=null,event_id=null,phase_event=null,choose:interactive=false}={}){
  const phase=phase_event?.phase_event_id??a?.play_phase_id;
  let id=event_id;
  const request={source_actor_id:pid(g,a),target_actor_id:pid(g,target),phase_id:phase,choose:interactive};
  if(id!==null&&read(g)?.songci[key(id)]){ticket(g,'songci',id,request);return false;}
  const options=sgs_songci_options(g,a);if(!options.length||phase!==a.play_phase_id||!interactive&&!options.some(x=>x.target===target))return false;
  movement(g);methods(g,'draw_cards');id??=next(g,'songci');const t=ticket(g,'songci',id,request),r=t.row,s=state(g),bound=binding(g,a,SK.songci),turn=g.turn_event_counter;
  r.source_actor_id=pid(g,a);
  const valid=()=>owned(g,a,SK.songci)&&playWindow(g,a)&&binding(g,a,SK.songci)===bound&&a.play_phase_id===phase&&g.turn_event_counter===turn;
  const targets=()=>g.all_players().filter(p=>live(p)&&p.hand.length!==p.hp&&!sgs_songci_used(g,a,p));
  try{
    if(interactive)while(valid()&&!target){const os=targets().map(p=>({id:`target:${pid(g,p)}`,target:p,label:`${p.name}（${p.hand.length}手牌 / ${p.hp}体力）：${p.hand.length<p.hp?'摸两张':'弃两张手牌/装备'}`}));if(!os.length)break;
      const value=await g.view.ask_line('颂词：选择本局未被你颂词的角色（可选自己）',{kind:'choice',player_id:g.seat_of(a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消'}],
        meta:meta(g,a,SK.songci,'songci_target',{event_id:id,allow_self:true,once_per_target_per_game:true,used_target_ids:[...(s.songci_targets[key(pid(g,a))]??[])]})});
      if(!valid()||pass(value))break;target=select(os,value)?.target??null;
    }
    if(!valid()||!targets().includes(target)){r.cancelled=true;t.finish();return false;}
    r.target_actor_id=pid(g,target);r.branch=target.hand.length<target.hp?'draw':'discard';r.hand_count_at_commit=target.hand.length;r.hp_at_commit=target.hp;
    r.committed=true;r.status='committed';s.songci_targets[key(pid(g,a))]??=[];s.songci_targets[key(pid(g,a))].push(pid(g,target));
    if(r.branch==='draw'){r.status='drawing';const cs=await g.draw_cards(target,2);if(!Array.isArray(cs)||cs.length>2)throw Error('颂词需要真实有限牌堆摸牌回执');r.drawn=cs.length;}
    else{r.status='discarding';await songciDiscard(g,target,r);}
    t.finish();if(ongoing(g))g.view.emit(`${a.name}发动颂词，${target.name}${r.branch==='draw'?`摸${r.drawn}张牌`:`弃置${r.discarded??0}张牌`}；此来源本局不能再对该角色发动。`,{event_type:'skill_resolution',skill_id:SK.songci,event_id:id,target_actor_id:r.target_actor_id,branch:r.branch});return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_ai_songci_target(g,a){
  return sgs_songci_options(g,a).filter(o=>o.branch==='draw'?allied(g,a,o.target):!allied(g,a,o.target))
    .sort((x,y)=>(x.branch==='discard'?0:1)-(y.branch==='discard'?0:1)||x.target.hp-y.target.hp)[0]?.target??null;
}
export async function sgs_ai_songci(g,a){const target=sgs_ai_songci_target(g,a);return target?sgs_songci_activate(g,a,{target}):false;}
export async function sgs_player_songci(g,a){if(!sgs_songci_available(g,a)){g.view.emit(`颂词：${sgs_songci_unavailable_reason(g,a)}。`);return true;}await sgs_songci_activate(g,a,{choose:true});return true;}
export function sgs_chenlin_skill_definitions({SkillHooks,ActiveSkillDef}){
  const active=new ActiveSkillDef({skill_id:SK.songci,hotkey:'q',button_label:'颂词',available:sgs_songci_available,player:sgs_player_songci,ai:sgs_ai_songci,
    help_text:'手牌少于当前体力摸两张，多于体力由目标弃两张手牌/装备；每个目标每位来源整局限一次，可在同阶段对不同目标连续发动。'});
  active.source_skill_id=SK.songci;active.owns_target_selection=true;active.unavailable_reason=sgs_songci_unavailable_reason;
  return {hooks:{[HERO]:SkillHooks({on_end_phase:[sgs_bifa_end_phase]})},active:{[HERO]:[active]}};
}
