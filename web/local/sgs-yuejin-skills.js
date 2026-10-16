/** Complete selected Mobile identity 骁果, including the equipment-payment draw.
 * FH5 lifecycle is a declared Jianghu policy, not current mobile certification. */
import {CardType} from './models.js';
import {equipment_effect} from './equipment.mjs';
import {sgs_dingpin_card_category} from './sgs-followup-chenqun.js';
import {SGS_YUEJIN_HERO_ID as HERO,SGS_YUEJIN_SKILL_IDS} from './sgs-yuejin-data.js';
import {yuejin_key as key,yuejin_stable as stable,yuejin_live as live,yuejin_pid as pid,
  yuejin_ongoing as ongoing,yuejin_owned as owned,yuejin_binding as binding,yuejin_read as read,yuejin_ticket as ticket} from './sgs-yuejin-runtime.js';
const SK=SGS_YUEJIN_SKILL_IDS.xiaoguo,SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const pass=v=>['pass','decline','cancel','damage','0','n','no'].includes(String(v));
const choose=(os,v)=>os.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?os[Number(v)-1]:null);
const allied=(g,a,b)=>a===b||typeof g.side_of==='function'&&g.side_of(a)===g.side_of(b);
const exact=(os,m)=>m&&os.find(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index&&o.epoch===m.epoch);
const meta=(g,a,stage,r)=>({skill:'骁果',skill_id:SK,stage,private_choice:true,private_to:g.seat_of(a),event_id:r.event_id,
  owner_id:r.request.owner_id,target_id:r.request.target_id,optional:true,exact_count:1});
const context=a=>({to:'discard',visibility:'public',payment:true,action:'discard',semantic_action:'discard',source:a,source_skill:SK});
function material(g,a,card,zone,index){return {id:zone==='hand'?`hand:${index+1}`:`eq:${zone}`,zone,index,card,epoch:g.card_location_epoch?.(card)??0,label:`${zone==='hand'?`手牌${index+1}`:'装备'}：${card}`};}
function payable(g,a,m){return m.card&&!m.card.virtual&&g.can_discard_material?.(a,m,context(a))!==false&&g.can_pay_materials?.(a,[m],context(a))!==false;}
const category=(g,a,m)=>sgs_dingpin_card_category(g.effective_card?.(m.card,a,{action:'discard',zone:m.zone})??m.card);
/** Only a chooser may call its hand-bearing query. No ID allocation or RNG. */
export function sgs_xiaoguo_costs(g,a){return live(a)?(a.hand??[]).map((c,i)=>material(g,a,c,'hand',i)).filter(m=>payable(g,a,m)&&category(g,a,m)==='basic'):[];}
export function sgs_xiaoguo_equipment_options(g,a){
  if(!live(a))return [];
  return [...(a.hand??[]).map((c,i)=>material(g,a,c,'hand',i)),...SLOTS.filter(s=>a[s]).map(s=>material(g,a,a[s],s,0))]
    .filter(m=>payable(g,a,m)&&category(g,a,m)==='equipment');
}
const facts=(g,a,e)=>({owner_id:pid(g,a),target_id:pid(g,e.actor),turn_id:e.turn_id,phase_event_id:e.phase_event_id});
function phase(g,a,e){
  return live(a)&&live(e?.actor)&&a!==e.actor&&g.all_players().includes(a)&&g.all_players().includes(e.actor)
    &&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='end_phase'&&g.turn_actor===g.seat_of(e.actor)
    &&stable(e.phase_event_id)&&e.phase_event_id===g.active_end_phase_id&&stable(e.turn_id)&&e.turn_id===g.turn_event_counter
    &&e.stage==='start'&&!e.closed&&!e.skipped&&!e.cancelled&&!e.interrupted&&e.entered!==false;
}
export const sgs_xiaoguo_available=(g,a,e)=>phase(g,a,e)&&owned(g,a,SK)&&!read(g,a)?.xiaoguo[key(e.phase_event_id)]&&sgs_xiaoguo_costs(g,a).length>0;
const value=(g,m)=>g.material_ai_cost?.(m)??2;
const wounded=(g,a)=>a.hp<(g.effective_max_hp?.(a)??a.hero.max_hp);
function healingEquipment(g,a,m){return m.zone==='armor'&&!a.armor_disabled&&!a.equipment_disabled&&['silver_lion','golden_armor'].includes(equipment_effect(m.card))&&wounded(g,a);}
/** Activation uses only its own hand, target public HP/team/equipment. */
export function sgs_ai_xiaoguo_cost(g,a,target){
  if(!live(a)||!live(target)||a===target)return null;
  const costs=sgs_xiaoguo_costs(g,a).filter(m=>!(m.card.type===CardType.POISON&&a.hp<=1)&&!(m.card.type===CardType.TAO&&a.hp<=1))
    .sort((x,y)=>value(g,x)-value(g,y));
  if(!costs.length)return null;
  if(allied(g,a,target)){
    // A visible wounded ally's healing armor is a genuine beneficial use. No
    // target.hand enumeration, even to predict whether a hidden equipment exists.
    const armor=target.armor?material(g,target,target.armor,'armor',0):null;
    if(!armor||!healingEquipment(g,target,armor)||!payable(g,target,armor))return null;
    if(costs[0].card.type===CardType.TAO&&wounded(g,a))return null;
  }
  return costs[0];
}
/** The target chooses its own equipment or knowingly accepts damage. */
export function sgs_ai_xiaoguo_payment(g,target,owner,materials=null){
  const os=(materials??sgs_xiaoguo_equipment_options(g,target)).sort((a,b)=>value(g,a)-value(g,b));
  if(!os.length)return null;
  const healing=os.find(m=>healingEquipment(g,target,m));if(healing)return healing;
  if(allied(g,target,owner)||target.hp<=2)return os[0];
  // A healthy enemy may preserve valuable installed gear, despite being able to pay.
  return value(g,os[0])<=4?os[0]:null;
}
async function chooseCost(g,a,target,r,valid){
  while(valid()){
    const os=sgs_xiaoguo_costs(g,a);if(!os.length)return null;
    if(a.is_ai)return sgs_ai_xiaoguo_cost(g,a,target);
    const answer=await g.view.ask_line(`骁果：弃一张基本手牌，令${target.name}弃装备或受到1点伤害`,{kind:'choice',player_id:g.seat_of(a),
      options:[...os.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],meta:{...meta(g,a,'xiaoguo_cost',r),material_zones:['hand'],category:'basic'}});
    if(!valid()||pass(answer))return null;
    const selected=choose(os,answer);if(selected&&exact(sgs_xiaoguo_costs(g,a),selected))return selected;
    // A stale object/zone epoch is discarded and the actual payer is reprompted.
  }
  return null;
}
async function choosePayment(g,target,a,r,valid,rejected=new Set()){
  while(valid()){
    const os=sgs_xiaoguo_equipment_options(g,target).filter(m=>!rejected.has(m.card));if(!os.length)return {kind:'damage',reason:'no_legal_equipment'};
    if(target.is_ai){const m=sgs_ai_xiaoguo_payment(g,target,a,os);return m?{kind:'equipment',material:m}:{kind:'damage',reason:'choice'};}
    const answer=await g.view.ask_line(`骁果：弃一张装备牌令${a.name}摸1张，或受到其造成的1点伤害`,{kind:'choice',player_id:g.seat_of(target),
      options:[...os.map(({id,label})=>({id,label})),{id:'damage',label:`受到${a.name}造成的1点伤害`}],
      meta:{...meta(g,target,'xiaoguo_equipment',r),material_zones:['hand',...SLOTS],category:'equipment',owner_draw:1,damage:1,damage_nature:'normal'}});
    if(!valid())return {kind:'invalid'};
    if(pass(answer))return {kind:'damage',reason:'choice'};
    const selected=choose(os,answer);if(selected&&exact(sgs_xiaoguo_equipment_options(g,target),selected))return {kind:'equipment',material:selected};
  }
  return {kind:'invalid'};
}
export async function sgs_on_any_end_phase_xiaoguo(g,a,event={}){
  const id=event.phase_event_id,request=facts(g,a,event),old=read(g,a)?.xiaoguo[key(id)];
  if(old){ticket(g,a,id,request,event.actor);return false;}
  if(!phase(g,a,event)||!owned(g,a,SK))return false;
  for(const name of ['public_card_loss','card_history_material_id','card_location_epoch','draw_cards','apply_damage'])if(typeof g[name]!=='function')throw Error(`骁果接入缺少 ${name}`);
  if(g.public_card_loss_supports_on_committed!==true)throw Error('骁果需要原子弃牌回执');
  const t=ticket(g,a,id,request,event.actor),r=t.row,target=event.actor,bound=binding(g,a,SK),moveBase=`xiaoguo:${key([pid(g,a),id])}`;
  r.skill_binding_id=bound;
  const same=()=>key(facts(g,a,event))===key(request)&&!event.closed&&!event.skipped&&!event.cancelled
    &&!event.interrupted&&event.entered!==false&&event.stage==='start'&&g.actual_turn_active===true&&g.turn_phase==='end_phase'&&g.turn_actor===g.seat_of(target)
    &&g.active_end_phase_id===id&&g.turn_event_counter===request.turn_id;
  const valid=()=>phase(g,a,event)&&owned(g,a,SK)&&binding(g,a,SK)===bound&&same();
  // A committed action belongs to this receipt even if the skill is later lost.
  const continues=()=>live(a)&&ongoing(g)&&same();
  const stop=()=>!live(a)?'owner_dead':!ongoing(g)?'match_ended':!same()?'window_closed':!live(target)?'target_dead':null;
  try{
    r.status='selecting';const cost=await chooseCost(g,a,target,r,valid);
    if(!valid()||!cost||!exact(sgs_xiaoguo_costs(g,a),cost)){r.declined=!cost;r.stopped=!valid()?'activation_invalidated':null;t.finish();return false;}
    r.status='paying';
    const result=await g.public_card_loss(a,[cost],{...context(a),reason:'骁果·基本牌费用',move_id:`${moveBase}:cost`,
      validate:()=>valid()&&Boolean(exact(sgs_xiaoguo_costs(g,a),cost)),on_committed:(cards,moved)=>{
        if(cards.length!==1||cards[0]!==cost.card)throw Error('骁果必须实际弃一张所选基本手牌');
        r.committed=true;r.status='paid';r.cost_card_id=g.card_history_material_id(cost.card);r.cost_move_id=moved.move_id;
      }});
    if(Boolean(result?.committed)!==r.committed)throw Error('骁果费用缺少一致原子回执');
    if(!r.committed){r.stopped='cost_not_committed';t.finish();return false;}
    if(!continues()||!live(target)){r.stopped=stop();t.finish();return true;}
    const rejected=new Set();let payment;
    while(continues()&&live(target)){
      r.status='responding';payment=await choosePayment(g,target,a,r,()=>continues()&&live(target),rejected);
      if(payment.kind==='invalid'||!continues()||!live(target)){r.stopped=stop()??'target_choice_invalidated';t.finish();return true;}
      if(payment.kind!=='equipment')break;
      const m=payment.material;r.status='paying';r.payment_attempts=(r.payment_attempts??0)+1;
      const paid=await g.public_card_loss(target,[m],{...context(a),reason:'骁果·目标弃装备',move_id:`${moveBase}:equipment:${r.payment_attempts}`,
        validate:()=>continues()&&live(target)&&Boolean(exact(sgs_xiaoguo_equipment_options(g,target),m)),on_committed:(cards,moved)=>{
          if(cards.length!==1||cards[0]!==m.card)throw Error('骁果目标必须实际弃一张所选装备牌');
          r.equipment_paid=true;r.branch='equipment';r.payment_card_id=g.card_history_material_id(m.card);r.payment_move_id=moved.move_id;
        }});
      if(Boolean(paid?.committed)!==(r.equipment_paid===true))throw Error('骁果装备付款缺少一致原子回执');
      if(r.equipment_paid)break;
      // Rejected movement is no payment. Recompute other equipment, or damage
      // if none remains; never spin on an externally unpayable physical card.
      rejected.add(m.card);
    }
    if(!r.equipment_paid&&(!continues()||!live(target))){r.stopped=stop();t.finish();return true;}
    if(r.equipment_paid){
      // FH5: the paid target may die in leave hooks; surviving holder still draws
      // if this match/window continues. The target's death does not undo payment.
      if(continues()){
        r.status='drawing';const cards=await g.draw_cards(a,1);
        if(!Array.isArray(cards)||cards.length>1)throw Error('骁果摸牌需要真实有限牌堆回执');r.drawn=cards.length;
      }else r.stopped=stop();
    }else{
      r.branch='damage';r.damage_reason=payment.reason;r.status='damaging';
      r.damage=await g.apply_damage(target,1,{source:a,source_skill:SK,source_skill_id:SK,kind:'skill',nature:'normal',
        physical_cards:[],source_card:null,card_user:null,card_use_id:null,damage_card_identity:null,
        damage_event_id:`${moveBase}:damage`,activation_id:id,causal_owner_id:pid(g,a),host_policy:'FH5',
        message:'{name}因骁果受到 {damage} 点伤害，剩余血量 {hp}。'});
    }
    t.finish();g.view.emit(`${a.name}发动骁果，${target.name}${r.branch==='equipment'?`弃装备，${a.name}摸${r.drawn??0}张牌`:`受到${r.damage??0}点伤害`}。`,
      {event_type:'skill_resolution',skill_id:SK,event_id:id,owner_id:pid(g,a),target_id:pid(g,target),branch:r.branch,drawn:r.drawn??0,damage:r.damage??0});
    return true;
  }catch(error){t.fail(error);throw error;}
}
sgs_on_any_end_phase_xiaoguo.source_skill_id=SK;
export function sgs_yuejin_skill_definitions({SkillHooks}){return {hooks:{[HERO]:SkillHooks({on_any_end_phase_start:[sgs_on_any_end_phase_xiaoguo]})},active:{[HERO]:[]}};}
