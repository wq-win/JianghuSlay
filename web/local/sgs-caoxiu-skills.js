/** Classic Mobile 千驹 + 倾袭. Mixed-game order/lifecycle are explicit NH policies. */
import {CardType,is_sha_card} from './models.js';
import {equipment_definition} from './equipment-catalog.mjs';
import {rule_hero} from './effective-hero.js';
import {SGS_CAOXIU_HERO_ID as HERO,SGS_CAOXIU_SKILL_IDS as SK} from './sgs-caoxiu-data.js';
import {caoxiu_live as live,caoxiu_pid as pid,caoxiu_owned as owned,caoxiu_binding as binding,
  caoxiu_ongoing as ongoing,caoxiu_stable as stable,caoxiu_read as read,caoxiu_ticket as ticket} from './sgs-caoxiu-runtime.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'],key=JSON.stringify;
const pass=v=>['pass','decline','cancel','0','n','no'].includes(String(v));
const select=(os,v)=>os.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?os[Number(v)-1]:null);
const allied=(g,a,b)=>a===b||typeof g.side_of==='function'&&g.side_of(a)===g.side_of(b);
const costContext=(a,target)=>({to:'discard',visibility:'public',action:'discard',semantic_action:'discard',payment:true,source:a,chooser:target,source_skill:SK.qingxi});
const material=(g,card,zone,index=0)=>({id:zone==='hand'?`hand:${index+1}`:`eq:${zone}`,card,zone,index,epoch:g.card_location_epoch?.(card)??0,
  label:zone==='hand'?`手牌${index+1}：${card}`:`${card.name}`});
const exact=(os,m)=>m&&os.find(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index&&o.epoch===m.epoch);
const discardable=(g,a,m,context)=>g.can_discard_material?.(a,m,context)!==false&&g.can_discard_card?.(a,m.card,{...context,zone:m.zone})!==false;
/** Query every time: never cache initial HP, mutate range, or allocate receipts. */
export function sgs_qianju_outgoing_distance(g,a,target){
  if(a===target||!live(target)||!owned(g,a,SK.qianju))return 0;
  const max=g.effective_max_hp?.(a)??a.max_hp??rule_hero(a)?.max_hp;
  const lost=Number.isFinite(max)&&Number.isFinite(a.hp)?Math.max(0,max-a.hp):0;
  return lost>0?-lost:0;
}
/** A catalog or explicit trusted foreign mapping is required. Card.range alone can
 * be a constructor default and must never make an unknown weapon range-one. */
export function sgs_qingxi_printed_weapon_range(g,card){
  if(!card||card.virtual||card.type!==CardType.WEAPON)return null;
  const n=equipment_definition(card)?.range??g.sgs_caoxiu_printed_weapon_range?.(card)??card.printed_weapon_range;
  return Number.isSafeInteger(n)&&n>0?n:null;
}
export function sgs_qingxi_weapon_options(g,a){
  if(!live(a))return [];
  return SLOTS.flatMap(zone=>{const card=a[zone],range=sgs_qingxi_printed_weapon_range(g,card);return range===null||SLOTS.filter(s=>a[s]===card).length!==1?[]:[{...material(g,card,zone),range}];});
}
/** Private query: only the target's own chooser calls this hand-bearing function. */
export function sgs_qingxi_target_costs(g,target,x,owner=target){
  if(!live(target)||!Number.isSafeInteger(x)||x<=0)return [];
  const context=costContext(owner,target),os=(target.hand??[]).map((c,i)=>material(g,c,'hand',i))
    .filter(m=>m.card&&!m.card.virtual&&discardable(g,target,m,context)&&g.can_pay_materials?.(target,[m],context)!==false);
  return os.length>=x?os:[];
}
const facts=(g,a,e)=>({owner_id:pid(g,a),source_id:pid(g,e?.source),target_id:pid(g,e?.target),card_user_id:pid(g,e?.card_user),
  sha_target_id:pid(g,e?.sha_target),direct_target_id:pid(g,e?.direct_target),chain_transfer:e?.chain_transfer===true,transferred:e?.transferred===true,method:e?.method??null,
  damage_event_id:e?.damage_event_id,card_use_id:e?.card_use_id??null,kind:e?.kind,nature:e?.nature??'normal',source_card_type:e?.source_card?.type??e?.damage_card_identity?.type??null});
function direct(g,a,e){
  return live(a)&&live(e?.target)&&a!==e.target&&g.all_players().includes(a)&&g.all_players().includes(e.target)
    &&ongoing(g)&&e.source===a&&e.card_user===a&&e.sha_target===e.target&&e.direct_target===e.target
    &&e.kind==='sha'&&!e.chain_transfer&&!e.transferred&&e.method!=='transfer'&&e.method!=='chain'&&!e.prevented&&!e.cancelled&&!e.closed
    &&Number.isFinite(e.damage)&&e.damage>0&&stable(e.damage_event_id)&&is_sha_card(e.source_card??e.damage_card_identity);
}
export const sgs_qingxi_available=(g,a,e)=>direct(g,a,e)&&owned(g,a,SK.qingxi)&&!read(g,a)?.qingxi[key(e.damage_event_id)]&&sgs_qingxi_weapon_options(g,a).length>0;
const value=(g,m)=>g.material_ai_cost?.(m)??2;
/** Source AI sees its own public weapons and teams/HP. No target.hand enumeration. */
export function sgs_ai_qingxi_weapon(g,a,target){
  if(!live(a)||!live(target)||allied(g,a,target))return null;
  return sgs_qingxi_weapon_options(g,a).sort((x,y)=>y.range-x.range)[0]??null;
}
/** Target AI evaluates its own cards, keeping poison's real HP-loss cost in mind. */
export function sgs_ai_qingxi_choice(g,target,a,x,damage=1,options=null){
  const os=[...(options??sgs_qingxi_target_costs(g,target,x,a))].sort((l,r)=>{
    const v=m=>value(g,m)+(m.card.type===CardType.POISON?20:0);return v(l)-v(r);
  });
  if(os.length<x)return {kind:'boost'};
  const chosen=os.slice(0,x),poison=chosen.filter(m=>m.card.type===CardType.POISON).length;
  if(poison&&target.hp<=poison+damage)return {kind:'boost'};
  const total=chosen.reduce((n,m)=>n+value(g,m),0);
  return target.hp<=damage+1||!allied(g,target,a)&&total<=6?{kind:'discard',materials:chosen}:{kind:'boost'};
}
const meta=(g,actor,r,stage)=>({skill:'倾袭',skill_id:SK.qingxi,stage,private_choice:true,private_to:g.seat_of(actor),
  event_id:r.request.damage_event_id,owner_id:r.request.owner_id,target_id:r.request.target_id,host_policy:'NH5-NH9'});
async function chooseWeapon(g,a,target,r,valid){
  while(valid()){
    const os=sgs_qingxi_weapon_options(g,a);if(!os.length)return null;
    if(a.is_ai)return sgs_ai_qingxi_weapon(g,a,target);
    const v=await g.view.ask_line(`倾袭：令${target.name}弃所选武器范围张手牌并弃该武器，或此伤害+1`,{kind:'choice',player_id:g.seat_of(a),
      options:[...os.map(m=>({id:m.id,label:`发动：${m.card.name}（范围${m.range}）`})),{id:'pass',label:'不发动'}],
      meta:{...meta(g,a,r,'qingxi_weapon'),optional:true,material_zones:SLOTS}});
    if(!valid()||pass(v))return null;
    const m=select(os,v);if(m&&exact(sgs_qingxi_weapon_options(g,a),m))return m;
  }
  return null;
}
const rejectedBatch=(rejected,ms)=>rejected.some(prior=>prior.length===ms.length&&prior.every(p=>ms.some(m=>p.card===m.card&&p.epoch===m.epoch&&p.zone===m.zone)));
async function chooseTarget(g,a,target,r,weapon,valid,rejected){
  let chosen=[];
  while(valid()){
    const os=sgs_qingxi_target_costs(g,target,weapon.range,a);
    if(os.length<weapon.range)return {kind:'boost',reason:'no_exact_hand_payment'};
    if(chosen.some(m=>!exact(os,m)))chosen=[];
    if(target.is_ai){const result=sgs_ai_qingxi_choice(g,target,a,weapon.range,r.base_damage,os);return result.kind==='discard'&&rejectedBatch(rejected,result.materials)?{kind:'boost'}:result;}
    const options=[...os.map(m=>({id:m.id,label:`${chosen.some(c=>c.card===m.card)?'已选 ':'未选 '}${m.label}`})),
      {id:'discard',label:`确定弃置${weapon.range}张手牌`,disabled:chosen.length!==weapon.range||rejectedBatch(rejected,chosen)},
      {id:'boost',label:'令此伤害+1，不弃牌'}];
    const v=String(await g.view.ask_line(`倾袭：选择恰好${weapon.range}张手牌后确认，或令此伤害+1`,{kind:'choice',player_id:g.seat_of(target),options,
      meta:{...meta(g,target,r,'qingxi_target'),target_chooses:true,mandatory:true,material_zones:['hand'],exact_count:weapon.range,
        min_count:weapon.range,max_count:weapon.range,selected_ids:chosen.map(m=>m.id),selected_count:chosen.length,damage:r.base_damage,damage_increment:1,weapon:{...r.weapon}}})).trim();
    if(!valid())return {kind:'invalid'};
    if(v==='boost'||v==='damage'||pass(v))return {kind:'boost',reason:'choice'};
    const fresh=sgs_qingxi_target_costs(g,target,weapon.range,a);
    if(chosen.some(m=>!exact(fresh,m))){chosen=[];continue;}
    // Text clients may submit exact tokens in one reply; all still revalidate.
    const tokens=v.split(/[\s,]+/),many=tokens.map(t=>select(os,t));
    if(tokens.length>1&&many.every(Boolean)&&many.length===weapon.range&&new Set(many.map(m=>m.card)).size===weapon.range
      &&many.every(m=>exact(fresh,m))&&!rejectedBatch(rejected,many))return {kind:'discard',materials:many};
    if(v==='discard'){
      if(chosen.length===weapon.range&&!rejectedBatch(rejected,chosen))return {kind:'discard',materials:chosen};
      continue;
    }
    const m=select(os,v);if(!m||!exact(fresh,m))continue;
    if(chosen.some(c=>c.card===m.card))chosen=chosen.filter(c=>c.card!==m.card);
    else if(chosen.length<weapon.range)chosen.push(m);
  }
  return {kind:'invalid'};
}
function applyBoost(e,r){
  const marker=key([r.request.owner_id,r.request.damage_event_id]);
  if(e.sgs_qingxi_receipt_id===marker)return;
  if(e.sgs_qingxi_receipt_id!=null||e.damage!==r.base_damage)throw Error('倾袭重放伤害基数或回执不匹配');
  e.damage+=1;e.sgs_qingxi_receipt_id=marker;
}
export async function sgs_before_source_damage_qingxi(g,a,e={}){
  const request=facts(g,a,e),old=read(g,a)?.qingxi[key(e.damage_event_id)];
  if(old){
    const previous=ticket(g,a,request,e.target,e.damage,old.binding_id);
    if(previous.active)return false;
    if(old.committed&&old.branch==='boost')applyBoost(e,old);
    if(old.committed&&old.branch==='discard'&&['target_dead','match_ended'].includes(old.stopped)){e.cancelled=true;e.damage=0;}
    return old.committed;
  }
  if(!direct(g,a,e)||!owned(g,a,SK.qingxi)||!sgs_qingxi_weapon_options(g,a).length)return false;
  for(const method of ['public_card_loss','card_history_material_id','card_location_epoch'])if(typeof g[method]!=='function')throw Error(`倾袭接入缺少 ${method}`);
  if(g.public_card_loss_supports_on_committed!==true)throw Error('倾袭需要原子弃牌回执');
  const bound=binding(g,a,SK.qingxi),t=ticket(g,a,request,e.target,e.damage,bound),r=t.row,target=e.target;
  const unchanged=()=>key(facts(g,a,e))===key(request)&&e.source===a&&e.card_user===a&&e.target===target&&e.sha_target===target&&e.direct_target===target;
  const valid=()=>direct(g,a,e)&&e.damage===r.base_damage&&unchanged()&&owned(g,a,SK.qingxi)&&binding(g,a,SK.qingxi)===bound;
  const moveBase=`qingxi:${key([pid(g,a),e.damage_event_id])}`;
  try{
    const weapon=await chooseWeapon(g,a,target,r,valid);
    if(!valid()||!weapon){r.declined=!weapon;r.stopped=!valid()?'activation_invalidated':null;t.finish();return false;}
    r.weapon={card_id:g.card_history_material_id(weapon.card),zone:weapon.zone,epoch:weapon.epoch,range:weapon.range,name:weapon.card.name};
    const weaponPresent=()=>Boolean(exact(sgs_qingxi_weapon_options(g,a),weapon));
    const decisionValid=()=>valid()&&weaponPresent();
    const rejected=[];
    while(decisionValid()&&!r.committed){
      r.status='target_choice';const choice=await chooseTarget(g,a,target,r,weapon,decisionValid,rejected);
      if(!decisionValid()||choice.kind==='invalid'){r.stopped='target_choice_invalidated';break;}
      if(choice.kind==='boost'){
        // No await between final validation, commitment, and modifier application.
        r.committed=true;r.branch='boost';r.modifier=1;applyBoost(e,r);break;
      }
      const ms=choice.materials,context=costContext(a,target),legal=()=>decisionValid()&&ms.length===weapon.range&&new Set(ms.map(m=>m.card)).size===weapon.range
        &&ms.every(m=>exact(sgs_qingxi_target_costs(g,target,weapon.range,a),m))&&g.can_pay_materials?.(target,ms,context)!==false;
      if(!legal()){if(decisionValid())rejected.push(ms.map(m=>({...m})));continue;}
      if(rejectedBatch(rejected,ms))continue;
      r.status='paying';r.payment_attempts=(r.payment_attempts??0)+1;
      const result=await g.public_card_loss(target,ms,{...context,reason:'倾袭·目标弃手牌',move_id:`${moveBase}:hand:${r.payment_attempts}`,validate:legal,
        on_committed:(cards,moved)=>{
          if(cards.length!==weapon.range||cards.some((c,i)=>c!==ms[i].card)||moved.partial)throw Error('倾袭必须原子弃置恰好所选手牌');
          r.committed=true;r.branch='discard';r.modifier=0;r.status='paid';r.payment_move_id=moved.move_id;r.payment_card_ids=cards.map(c=>g.card_history_material_id(c));
        }});
      if(Boolean(result?.committed)!==r.committed)throw Error('倾袭手牌付款缺少一致原子回执');
      if(!r.committed)rejected.push(ms.map(m=>({...m})));
    }
    if(!r.committed){r.stopped??='decision_invalidated';t.finish();return false;}
    if(r.branch==='discard'){
      // NH7/NH8: after commitment, skill loss and source death cannot refund paid
      // hands. The exact original equipment epoch alone may still be discarded.
      r.status='weapon_effect';
      const sameWeapon=()=>a[weapon.zone]===weapon.card&&g.card_location_epoch(weapon.card)===weapon.epoch;
      const context={...costContext(a,a),payment:false,reason:'倾袭·弃武器'};
      if(ongoing(g)&&sameWeapon()&&discardable(g,a,weapon,context)){
        const result=await g.public_card_loss(a,[weapon],{...context,move_id:`${moveBase}:weapon`,validate:()=>ongoing(g)&&sameWeapon()&&discardable(g,a,weapon,context),
          on_committed:(cards,moved)=>{
            if(cards.length!==1||cards[0]!==weapon.card)throw Error('倾袭不能弃替代武器');
            r.weapon_discarded=true;r.weapon_move_id=moved.move_id;
          }});
        if(Boolean(result?.committed)!==(r.weapon_discarded===true))throw Error('倾袭武器移动缺少一致原子回执');
        r.weapon_effect=result?.committed?'discarded':'prevented';
      }else r.weapon_effect=!ongoing(g)?'match_ended':!sameWeapon()?'original_weapon_moved':'protected';
      if(!live(target)||!ongoing(g)){e.cancelled=true;e.damage=0;r.stopped=!live(target)?'target_dead':'match_ended';}
    }
    t.finish();g.view.emit(`${a.name}发动倾袭：${target.name}${r.branch==='boost'?'令此伤害+1':`弃置${r.weapon.range}张手牌${r.weapon_discarded?'，原武器弃置':'，原武器未被弃置'}`}。`,
      {event_type:'skill_resolution',skill_id:SK.qingxi,event_id:e.damage_event_id,owner_id:pid(g,a),target_id:pid(g,target),branch:r.branch,modifier:r.modifier,weapon_discarded:r.weapon_discarded===true});
    return true;
  }catch(error){t.fail(error);throw error;}
}
sgs_qianju_outgoing_distance.source_skill_id=SK.qianju;
sgs_before_source_damage_qingxi.source_skill_id=SK.qingxi;
export function sgs_caoxiu_skill_definitions({SkillHooks}){return {hooks:{[HERO]:SkillHooks({outgoing_distance:[sgs_qianju_outgoing_distance],before_source_damage_resolution:[sgs_before_source_damage_qingxi]})},active:{[HERO]:[]}};}
