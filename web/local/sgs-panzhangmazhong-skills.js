/** Complete classic 夺刀/暗箭. PM1/PM2 lifecycle and mixed-host order are not client certification. */
import {CardType,is_sha_card} from './models.js';
import {SGS_PANZHANGMAZHONG_HERO_ID as HERO,SGS_PANZHANGMAZHONG_SKILL_IDS as SK} from './sgs-panzhangmazhong-data.js';
import {pm_live as live,pm_pid as pid,pm_owned as owned,pm_binding as binding,pm_ongoing as ongoing,
 pm_stable as stable,pm_read as read,pm_state as state,pm_ticket as ticket} from './sgs-panzhangmazhong-runtime.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'],key=JSON.stringify;
const pass=v=>['pass','decline','cancel','0','n','no'].includes(String(v));
const select=(os,v)=>os.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?os[Number(v)-1]:null);
const allied=(g,a,b)=>a===b||b&&typeof g.side_of==='function'&&g.side_of(a)===g.side_of(b);
const need=(g,...ns)=>{for(const n of ns)if(typeof g[n]!=='function')throw Error(`潘璋马忠接入缺少 ${n}`);};
const costContext=a=>({to:'discard',visibility:'public',action:'discard',semantic_action:'discard',payment:true,source:a,chooser:a,source_skill:SK.duodao,reason:'夺刀费用'});
const gainContext=a=>({to:'hand',recipient:a,visibility:'public',action:'obtain',semantic_action:'obtain',payment:false,source:a,source_skill:SK.duodao,reason:'夺刀获得武器'});
const material=(g,card,zone,index=0)=>({card,zone,index,epoch:g.card_location_epoch?.(card)??0,
 id:zone==='hand'?`hand:${index+1}`:`eq:${zone}`,label:zone==='hand'?`手牌${index+1}：${card}`:`装备：${card.name}`});
const exact=(os,m)=>m&&os.find(o=>o.card===m.card&&o.zone===m.zone&&o.index===m.index&&o.epoch===m.epoch);
const discardable=(g,a,m,c)=>g.can_discard_material?.(a,m,c)!==false&&g.can_discard_card?.(a,m.card,{...c,zone:m.zone})!==false;
const rejectedMaterial=(rs,m)=>rs.some(x=>x.card===m.card&&x.zone===m.zone&&x.epoch===m.epoch);
const cardFace=(g,m)=>({card_id:g.card_history_material_id(m.card),zone:m.zone,epoch:m.epoch,name:m.card.name,type:m.card.type,suit:m.card.suit??null,color:m.card.color??null,rank:m.card.rank??null});
/** Owner-only private options; ordinary H/E, no judgment/private/virtual payment. */
export function sgs_duodao_materials(g,a){
 if(!live(a))return [];
 const c=costContext(a);
 return [...(a.hand??[]).map((x,i)=>material(g,x,'hand',i)),...SLOTS.flatMap(s=>a[s]?[material(g,a[s],s)]:[])]
  .filter(m=>m.card&&!m.card.virtual&&discardable(g,a,m,c)&&g.can_pay_materials?.(a,[m],c)!==false);
}
function abolished(g,a,slot){return g.is_equipment_slot_abolished?.(a,slot)===true||a?.[`${slot}_abolished`]===true
 ||[a?.abolished_slots,a?.abolished_equipment_slots].some(v=>v instanceof Set?v.has(slot):Array.isArray(v)?v.includes(slot):v?.[slot]===true);}
/** This is deliberately queried AFTER the paid cost, including its nested loss hooks. */
export function sgs_duodao_current_weapon(g,source,a){
 const card=source?.weapon;if(!source||!g.all_players().includes(source)||!card||card.virtual||card.type!==CardType.WEAPON||abolished(g,source,'weapon'))return null;
 const m=material(g,card,'weapon'),c=gainContext(a);
 if(g.can_obtain_material?.(a,source,m,c)===false||g.can_obtain_card?.(a,card,source,c)===false||g.can_gain_card?.(a,card,c)===false)return null;
 return m;
}
// Explicit null revokes a former Slash identity; it must never fall back to its material.
const damageIdentity=e=>e&&Object.hasOwn(e,'damage_card_identity')?e.damage_card_identity:e?.source_card;
export const sgs_pm_slash_damage=e=>{
 if(!e||(e.kind!=='sha'&&!(e.kind==='chain'&&e.chain_transfer===true)))return false;
 const identity=damageIdentity(e);return Boolean(identity&&is_sha_card(identity));
};
const facts=(g,a,e,damage=e.damage)=>({owner_id:pid(g,a),source_id:pid(g,e.source),target_id:pid(g,e.target),card_user_id:pid(g,e.card_user),
 sha_target_id:pid(g,e.sha_target),direct_target_id:pid(g,e.direct_target),damage_event_id:e.damage_event_id,damage,
 kind:e.kind,nature:e.nature??'normal',source_card_type:damageIdentity(e)?.type??null,
 card_use_id:e.card_use_id??null,branch_id:e.branch_id??null,parent_damage_event_id:e.parent_damage_event_id??null,origin_damage_event_id:e.origin_damage_event_id??null,
 chain_transfer:e.chain_transfer===true,transferred:e.transferred===true,method:e.method??null});
const receivedFacts=(g,a,e,n)=>({...facts(g,a,e,n),source_stage_anjian_receipt_id:e.sgs_anjian_receipt_id??null});
function received(g,a,n,source,e){
 return live(a)&&g.all_players().includes(a)&&ongoing(g)&&e.target===a&&(e.source??null)===(source??null)
  &&(source==null||g.all_players().includes(source))&&stable(e.damage_event_id)&&Number.isFinite(n)&&n>0&&e.damage===n
  &&e.dying_resolved===true&&e.damage_window==='receiver_after_damage'&&!e.closed&&!e.prevented&&!e.cancelled&&sgs_pm_slash_damage(e);
}
export const sgs_duodao_available=(g,a,n,source,e)=>received(g,a,n,source,e)&&owned(g,a,SK.duodao)
 &&!read(g,a)?.duodao[key(e.damage_event_id)]&&sgs_duodao_materials(g,a).length>0;
/** Public target weapon/team + owner's own costs only. Never inspect another hand or deck. */
export function sgs_ai_duodao_material(g,a,source,options=null){
 const weapon=sgs_duodao_current_weapon(g,source,a);if(!weapon||allied(g,a,source))return null;
 const value=m=>(g.material_ai_cost?.(m)??2)+(m.zone==='hand'?0:3)+(m.card.type===CardType.POISON?30:0);
 return [...(options??sgs_duodao_materials(g,a))].sort((l,r)=>value(l)-value(r)).find(m=>m.card.type!==CardType.POISON||a.hp>2)??null;
}
async function chooseCost(g,a,source,r,valid,rejected){
 while(valid()){
  const os=sgs_duodao_materials(g,a).filter(m=>!rejectedMaterial(rejected,m));if(!os.length){r.no_legal_cost=true;return null;}
  if(a.is_ai)return sgs_ai_duodao_material(g,a,source,os);
  const v=await g.view.ask_line(`夺刀：可弃一张手牌或装备，然后获得伤害来源当前装备的武器。无武器也可付费，费用不退。`,{
   kind:'choice',player_id:g.seat_of(a),options:[...os.map(({id,label})=>({id,label})),{id:'pass',label:'不发动夺刀'}],
   meta:{skill:'夺刀',skill_id:SK.duodao,source_skill_id:SK.duodao,stage:'duodao_cost',private_choice:true,private_to:g.seat_of(a),optional:true,exact_count:1,
    material_zones:['hand',...SLOTS],owner_id:r.request.owner_id,source_id:r.request.source_id,damage_event_id:r.request.damage_event_id,damage:r.request.damage,
    per_damage_event:true,host_policy:'PM1/H1/H3/H5/H6',current_client_verified:false}});
  if(!valid()||pass(v))return null;
  const m=select(os,v);if(m&&exact(sgs_duodao_materials(g,a),m)&&!rejectedMaterial(rejected,m))return m;
 }
 return null;
}
export async function sgs_after_damage_duodao(g,a,n,source,e={}){
 const request=receivedFacts(g,a,e,n),old=read(g,a)?.duodao[key(e.damage_event_id)];
 if(old){const previous=ticket(g,a,request,[source??null,e.target],old.binding_id);return previous.active?false:old.paid;}
 if(!received(g,a,n,source,e)||!owned(g,a,SK.duodao))return false;
 need(g,'public_card_loss','card_history_material_id','card_location_epoch');
 if(g.public_card_loss_supports_on_committed!==true)throw Error('夺刀需要原子移牌提交回执');
 const bound=binding(g,a,SK.duodao),t=ticket(g,a,request,[source??null,e.target],bound),r=t.row;
 const unchanged=()=>key(receivedFacts(g,a,e,n))===key(request)&&e.target===a&&(e.source??null)===(source??null);
 const valid=()=>received(g,a,n,source,e)&&unchanged()&&owned(g,a,SK.duodao)&&binding(g,a,SK.duodao)===bound;
 // H1/H3: skill loss after commitment does not refund or cancel the committed gain.
 const continuing=()=>live(a)&&g.all_players().includes(a)&&ongoing(g)&&unchanged();
 const base=`duodao:${key([pid(g,a),e.damage_event_id])}`;
 const finish=()=>{t.finish();g.view.emit(`${a.name}夺刀：${r.paid?'已弃置一张牌':'未发动'}${r.gained?`，获得${r.weapon.name}`:r.paid?'，未获得武器':''}。`,{
  event_type:'skill_resolution',skill_id:SK.duodao,owner_id:pid(g,a),source_id:pid(g,source),target_id:pid(g,a),damage_event_id:e.damage_event_id,
  paid:r.paid,declined:r.declined===true,cost:r.paid?{...r.cost}:null,weapon:r.gained?{...r.weapon}:null,gained:r.gained===true,stopped:r.stopped??null,host_policy:'PM1/H1'});};
 try{
  const rejected=[];
  while(valid()&&!r.paid){
   const m=await chooseCost(g,a,source,r,valid,rejected);
   if(!valid()||!m){r.declined=valid()&&!m&&!r.no_legal_cost;r.stopped=!valid()?'activation_invalidated':r.no_legal_cost?'no_legal_cost':null;break;}
   const legal=()=>valid()&&Boolean(exact(sgs_duodao_materials(g,a),m));if(!legal())continue;
   r.status='paying';r.payment_attempts=(r.payment_attempts??0)+1;
   const result=await g.public_card_loss(a,[m],{...costContext(a),move_id:`${base}:cost:${r.payment_attempts}`,validate:legal,on_committed:(cards,moved)=>{
    if(cards.length!==1||cards[0]!==m.card||moved.partial)throw Error('夺刀必须原子弃置所选的一张实体牌');
    r.paid=true;r.status='paid';r.cost=cardFace(g,m);r.cost_move_id=moved.move_id;
   }});
   if(Boolean(result?.committed)!==r.paid)throw Error('夺刀费用缺少一致原子回执');
   if(!r.paid)rejected.push({...m});
  }
  if(!r.paid){finish();return false;}
  if(!continuing()){r.stopped=!ongoing(g)?'match_ended':!live(a)?'owner_dead':'event_invalidated';finish();return true;}
  const weapon=sgs_duodao_current_weapon(g,source,a);
  if(!weapon){r.stopped=source?'no_current_weapon':'no_source';finish();return true;}
  r.status='gaining';const legal=()=>continuing()&&Boolean(exact([sgs_duodao_current_weapon(g,source,a)].filter(Boolean),weapon));
  const result=await g.public_card_loss(source,[weapon],{...gainContext(a),move_id:`${base}:weapon`,validate:legal,on_committed:(cards,moved)=>{
   if(cards.length!==1||cards[0]!==weapon.card||moved.partial)throw Error('夺刀不能获得替代武器');
   r.gained=true;r.weapon=cardFace(g,weapon);r.weapon_move_id=moved.move_id;
  }});
  if(Boolean(result?.committed)!==(r.gained===true))throw Error('夺刀获得武器缺少一致原子回执');
  if(!r.gained)r.stopped=!ongoing(g)?'match_ended':!live(a)?'owner_dead':'weapon_move_prevented';
  finish();
  return true;
 }catch(error){t.fail(error);throw error;}
}
function direct(g,a,e){return live(a)&&live(e.target)&&a!==e.target&&g.all_players().includes(a)&&g.all_players().includes(e.target)&&ongoing(g)
 &&e.source===a&&e.card_user===a&&e.sha_target===e.target&&e.direct_target===e.target&&e.kind==='sha'&&sgs_pm_slash_damage(e)
 &&!e.chain_transfer&&!e.transferred&&!['transfer','chain'].includes(e.method)&&!e.prevented&&!e.cancelled&&!e.closed
 &&stable(e.damage_event_id)&&Number.isFinite(e.damage)&&e.damage>0;}
function applyAnjian(e,r){
 const marker=key([r.request.owner_id,r.request.damage_event_id]);if(e.sgs_anjian_receipt_id===marker)return;
 if(e.sgs_anjian_receipt_id!=null||e.damage!==r.request.damage)throw Error('暗箭重放伤害基数或回执不匹配');
 e.damage+=r.modifier;e.sgs_anjian_receipt_id=marker;
}
/** Mandatory, once/direct event, after redirects and before receiver transfers. */
export function sgs_before_source_damage_anjian(g,a,e={}){
 const old=read(g,a)?.anjian[key(e.damage_event_id)];
 if(old){
  if(key(facts(g,a,e,old.request.damage))!==key(old.request))throw Error('同一暗箭事件不能更换用牌、来源或目标');
  applyAnjian(e,old);return old.modifier===1;
 }
 if(!direct(g,a,e)||!owned(g,a,SK.anjian))return false;
 need(g,'distance_between','actual_attack_range');
 const distance=g.distance_between(e.target,a),attack_range=g.actual_attack_range(e.target);
 if(!Number.isFinite(distance)||distance<0||!(Number.isFinite(attack_range)||attack_range===Infinity)||attack_range<0)throw Error('暗箭需要有效反向距离和实际攻击范围');
 const r={request:facts(g,a,e),binding_id:binding(g,a,SK.anjian),status:'done',distance,attack_range:attack_range===Infinity?null:attack_range,attack_range_infinite:attack_range===Infinity,modifier:distance>attack_range?1:0};
 state(g,a).anjian[key(e.damage_event_id)]=r;applyAnjian(e,r);
 g.view.emit(`${a.name}暗箭判定：目标至其距离${distance}，目标攻击范围${attack_range}${r.modifier?'，此伤害+1':'，伤害不变'}。`,{
  event_type:'skill_resolution',skill_id:SK.anjian,owner_id:pid(g,a),target_id:pid(g,e.target),damage_event_id:e.damage_event_id,distance,attack_range:r.attack_range,attack_range_infinite:r.attack_range_infinite,modifier:r.modifier,host_policy:'PM2/H2/H4'});
 return r.modifier===1;
}
sgs_after_damage_duodao.source_skill_id=SK.duodao;
sgs_before_source_damage_anjian.source_skill_id=SK.anjian;
export function sgs_panzhangmazhong_skill_definitions({SkillHooks}){return {hooks:{[HERO]:SkillHooks({
 before_source_damage_resolution:[sgs_before_source_damage_anjian],after_damage_resolved:[sgs_after_damage_duodao]})},active:{[HERO]:[]}};}
