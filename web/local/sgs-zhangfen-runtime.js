/** Isolated native-entity runtime. Host transactions MUST invoke the pre-detach
 * guard, and support offboard / zhangfen_removed / zhangfen_destroyed zones.
 * No function in this module inserts a card into the ordinary random deck. */
import {Card} from './models.js';
import {rule_hero} from './effective-hero.js';
import {ZHANGFEN_HERO_ID,ZHANGFEN_SKILL_IDS as SK,ZHANGFEN_FORGE_COSTS as COSTS,
 ZHANGFEN_EQUIPMENT_BY_FORM as FORMS,ZHANGFEN_COMPATIBILITY,validate_zhangfen_faces} from './sgs-zhangfen-data.js';
export const ZHANGFEN_STATE_FIELD='sgs_zhangfen_state';
export const ZHANGFEN_SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SLOTS=ZHANGFEN_SLOTS,copy=x=>JSON.parse(JSON.stringify(x)),key=JSON.stringify;
export const zhangfen_alive=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
export const zhangfen_actor_id=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
export const zhangfen_card_id=(g,c)=>c?.physical_id??c?.derived_identity??g.card_history_material_id?.(c)??null;
export const zhangfen_enabled=(g,a,id)=>zhangfen_alive(a)&&!a.skills_disabled&&!a.skill_disabled&&!a.disabled_skill_ids?.includes(id)
 &&(typeof g.has_general_skill==='function'&&g.general_skill_ledger_state!==null?g.has_general_skill(a,id):(a.effective_skill_ids??rule_hero(a)?.skill_ids??(rule_hero(a)?.id===ZHANGFEN_HERO_ID?Object.values(SK):[])).includes(id));
export const zhangfen_binding=(g,a)=>g.general_skill_binding_id?.(a,SK.quchong)??`${zhangfen_actor_id(g,a)}:${SK.quchong}`;
export const zhangfen_emit=(g,text,event={})=>g.view?.emit?.(text,event);
const stable=id=>(typeof id==='string'&&id.length>0)||(Number.isSafeInteger(id)&&id>=0);
const active=new WeakMap();
function need(g,name){if(typeof g[name]!=='function')throw Error(`张奋宿主缺少 ${name}`);}
export function zhangfen_state(g){const s=g[ZHANGFEN_STATE_FIELD];if(!s||s.version!==1)throw Error('张奋需开局前初始化合法自定义卡面');return s;}
export function initialize_zhangfen(g,{faces,match_id='match',mode='identity'}={}){
 if(g[ZHANGFEN_STATE_FIELD])return zhangfen_state(g);
 if(!stable(match_id)||mode!=='identity')throw Error('张奋所选身份版本需稳定对局ID；不可自动切换团战成本');
 g.offboard_cards??=[];g.sgs_zhangfen_removed_cards??=[];g.sgs_zhangfen_destroyed_cards??=[];
 return g[ZHANGFEN_STATE_FIELD]={version:1,match_id,mode,faces:validate_zhangfen_faces(faces),counter:0,action_counter:0,actors:{},vehicles:{},receipts:{}};
}
export function zhangfen_actor_ledger(g,a){const s=zhangfen_state(g),id=zhangfen_actor_id(g,a);if(!stable(id))throw Error('渠冲需要稳定人物ID');return s.actors[key(id)]??=( {actor_id:id,forge:0,manufactured:0,creation_ids:[]} );}
/** Receipts do not retain callbacks or live player/card objects. Re-entry cannot
 * restart a suspended transaction. A cold mid-commit save requires input replay. */
export function zhangfen_ticket(g,kind,id,facts={}){
 if(!stable(id))throw Error(`${kind}需要稳定事件ID`);
 const s=zhangfen_state(g),k=key([kind,id]),old=s.receipts[k];let running=active.get(g);if(!running)active.set(g,running=new Set());
 if(old){if(key(old.facts)!==key(facts))throw Error('同一张奋事件ID不能改写事实');
  if(old.status!=='done'&&!running.has(k))throw Object.assign(Error('张奋事务中断；请从原始输入日志恢复，不能重复扣费'),{code:'ZHANGFEN_REPLAY_REQUIRED'});
  return {run:false,row:old,key:k};}
 const row=s.receipts[k]={kind,id,facts,status:'offered',committed:false};running.add(k);
 return {run:true,row,key:k,finish(result=false){row.result=result;row.status='done';running.delete(k);return result;},fail(e){row.status='failed';row.error=String(e?.message??e);running.delete(k);}};
}
export function zhangfen_locations(g){
 if(typeof g.sgs_zhangfen_card_locations==='function')return g.sgs_zhangfen_card_locations();
 const rows=[];const add=(cards,zone,owner=null)=>{for(const [index,card] of (cards??[]).entries())if(card)rows.push({card,zone,index,owner});};
 add(g.deck?.draw_pile,'draw_pile');add(g.deck?.discard_pile,'discard');add(g.processing_cards,'processing');add(g.offboard_cards,'offboard');
 add(g.sgs_zhangfen_removed_cards,'zhangfen_removed');add(g.sgs_zhangfen_destroyed_cards,'zhangfen_destroyed');
 for(const a of g.all_players()){
  for(const [field,zone] of [['hand','hand'],['judgment_cards','judgment'],['sgs_mountain_fields','field'],['sgs_pojun_pile','pojun_pile'],['sgs_following_jieyue_pile','jieyue'],['sgs_followup_qian_pile','qian'],['sgs_painting_pile','painting'],['sgs_bifa_pile','bifa']])add(a[field],zone,a);
  for(const slot of SLOTS)if(a[slot])rows.push({card:a[slot],zone:slot,index:0,owner:a});
 }return rows;
}
export function zhangfen_vehicle(g,card){if(!card||card.virtual)return null;const s=g[ZHANGFEN_STATE_FIELD];if(!s)return null;const id=zhangfen_card_id(g,card),row=s.vehicles[key(id)];
 if(!row||row.physical_id!==id||row.status==='destroyed'||row.status==='ended')return null;
 if(row.native&&(card.derived_identity!==id||card.creator_actor_id!==row.creator_actor_id||card.creation_ordinal!==row.creation_ordinal||card.equipment_id!==FORMS[row.form]?.id))return null;
 return row;
}
export function zhangfen_field_vehicles(g){return g.all_players().filter(owner=>owner&&!owner.dead).flatMap(owner=>SLOTS.map(zone=>({owner,zone,index:0,card:owner[zone],vehicle:zhangfen_vehicle(g,owner[zone])}))).filter(x=>x.vehicle&&x.vehicle.durability>0);}
export function zhangfen_has_own_vehicle(g,a){return zhangfen_field_vehicles(g).some(x=>x.vehicle.native&&x.vehicle.creator_actor_id===zhangfen_actor_id(g,a));}
export function zhangfen_active_vehicle(g,a,form=null){if(!zhangfen_alive(a)||a.weapon_disabled||a.equipment_disabled)return null;const row=zhangfen_vehicle(g,a.weapon);return row&&row.durability>0&&(!form||row.form===form)?{card:a.weapon,vehicle:row,owner:a,zone:'weapon'}:null;}
const equipment=c=>!c?.virtual&&['武器','防具','-1马','+1马'].includes(c?.type);
export const zhangfen_is_equipment=equipment;
function materialExists(g,owner,m){return zhangfen_locations(g).some(x=>x.card===m.card&&x.owner===(owner??null)&&x.zone===m.zone&&x.index===(m.index??0));}
function causeValid(g,context,card){const c=context.zhangfen_cause;if(!c||c.skill_id!==SK.quchong)return false;
 const r=zhangfen_state(g).receipts[c.receipt_key];if(!r?.committed||r.status!=='resolving'||!['recast','phase'].includes(r.kind)||r.card_id!==zhangfen_card_id(g,card)||r.facts.owner_id!==c.owner_id)return false;
 if(context.preserve_function_only===true)return true;
 return r.kind==='recast'?context.action==='recast'&&context.to==='discard'&&context.move_id===`${c.receipt_key}:recast`:context.action==='give'&&context.to==='hand'&&context.move_id===`${c.receipt_key}:gain`&&zhangfen_actor_id(g,context.recipient)===r.recipient_id;
}
export function zhangfen_cause(g,t,a,card){return {skill_id:SK.quchong,receipt_key:t.key,owner_id:zhangfen_actor_id(g,a),physical_id:zhangfen_card_id(g,card)};}
/** Call at material-selection legality and again before committing a full cost.
 * Unresolved native conversion edge is held. No durability or unrelated payment
 * is taken merely because an unpayable cost was selected. */
export function zhangfen_payment_preflight(g,owner,materials,context={}){
 const blocked=materials.filter(m=>SLOTS.includes(m.zone)&&owner?.[m.zone]===m.card&&zhangfen_vehicle(g,m.card)&&!causeValid(g,context,m.card));
 return {allowed:blocked.length===0,blocked_materials:blocked,reason:blocked.length?'equipped_siege_vehicle_not_payable_DH5_C2':null,held_native_boundary:blocked.length>0};
}
async function move(g,owner,materials,options){need(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('张奋要求原子 public_card_loss 的 validate/on_committed');return g.public_card_loss(owner,materials,options);}
/** One legitimate forced movement attempt may partly succeed. Parent must use
 * allowed_materials only, and expose partial results (never whole-cost success).
 * This guard runs BEFORE detachment, capture-loss snapshots and callbacks. */
export async function zhangfen_before_move(g,owner,materials,context={}){
 if(!g[ZHANGFEN_STATE_FIELD])return {allowed:true,allowed_materials:materials,blocked_materials:[],destroyed_ids:[]};
 if(context.payment===true){const p=zhangfen_payment_preflight(g,owner,materials,context);if(!p.allowed)return {...p,allowed_materials:[],destroyed_ids:[]};}
 const candidates=materials.filter(m=>SLOTS.includes(m.zone)&&owner?.[m.zone]===m.card&&zhangfen_vehicle(g,m.card));
 const blocked=[];const destroyed=[];
 for(const m of candidates){const row=zhangfen_vehicle(g,m.card);
  if(owner?.dead===true&&context.action==='death_cleanup')continue;
  if(row.durability===0&&context.action==='destroy'&&context.to==='zhangfen_destroyed')continue;
  if(causeValid(g,context,m.card))continue;
  if(!materialExists(g,owner,m))continue;
  const id=context.move_id;if(!stable(id))throw Error('大攻车移出拦截需要稳定 move_id');
  const t=zhangfen_ticket(g,'move-attempt',key([id,row.physical_id]),{owner_id:zhangfen_actor_id(g,owner),physical_id:row.physical_id,to:context.to??null,recipient:zhangfen_actor_id(g,context.recipient),action:context.action??null});
  blocked.push(m);if(!t.run){if(t.row.destroyed)destroyed.push(row.physical_id);continue;}
  try{t.row.committed=true;t.row.status='resolving';await zhangfen_spend_durability(g,m.card,1,{event_id:`${t.key}:durability`,reason:'阻止非渠冲移出',attempt_id:id});
   t.row.destroyed=row.status==='destroyed';if(t.row.destroyed)destroyed.push(row.physical_id);
   zhangfen_emit(g,`${owner.name}的${m.card.name}阻止移出，损失1点耐久。`,{event_type:'siege_move_prevented',move_id:id,physical_id:row.physical_id,ordinary_move_committed:false,durability:row.durability});t.finish(true);
  }catch(e){t.fail(e);throw e;}
 }
 return {allowed:blocked.length===0,allowed_materials:materials.filter(m=>!blocked.includes(m)),blocked_materials:blocked,destroyed_ids:destroyed,ordinary_move_committed:false};
}
export async function zhangfen_spend_durability(g,card,n,{event_id,reason,attempt_id=null}={}){
 const row=zhangfen_vehicle(g,card);if(!row||!Number.isInteger(n)||n<1||n>row.durability)return false;
 const t=zhangfen_ticket(g,'durability',event_id,{physical_id:row.physical_id,n,reason,attempt_id});if(!t.run)return false;
 try{row.durability-=n;t.row.committed=true;t.row.status='resolving';t.row.remaining=row.durability;
  zhangfen_emit(g,`${card.name}耐久减少${n}，剩余${row.durability}。`,{event_type:'siege_durability',physical_id:row.physical_id,spent:n,remaining:row.durability,event_id});
  if(row.durability===0){const found=zhangfen_locations(g).filter(x=>x.card===card);if(found.length!==1)throw Error('销毁车需要唯一物理落点');const m=found[0];
   const result=await move(g,m.owner,[m],{to:'zhangfen_destroyed',action:'destroy',semantic_action:'destroy',reason:'大攻车耐久耗尽',move_id:`${event_id}:destroy`,visibility:'public',on_committed:()=>{row.status='destroyed';row.destroy_event_id=event_id;t.row.destroyed=true;}});
   if(!result.committed||row.status!=='destroyed')throw Error('0耐久车必须原子销毁，不能送给原移动目标');
   zhangfen_emit(g,`${card.name}耐久耗尽，销毁并移出游戏。`,{event_type:'siege_destroyed',physical_id:row.physical_id,event_id});
  }t.finish(true);return true;
 }catch(e){t.fail(e);throw e;}
}
/** Replacement is checked BEFORE existing-slot replacement and before an entry
 * event. The caller moves the incoming card to discard without any entry hook. */
export function zhangfen_entry_replacement(g,owner,incoming){const held=zhangfen_field_vehicles(g).find(x=>x.owner===owner&&x.card!==incoming);
 return held?{prevented:true,to:'discard',reason:'大攻车阻止其他装备进入',physical_id:held.vehicle.physical_id,emit_entry:false,replace_existing:false}:{prevented:false};}
export async function zhangfen_on_equipment_enter(g,owner,card,event={}){
 const row=zhangfen_vehicle(g,card);if(!row||owner.weapon!==card||!zhangfen_alive(owner))return false;
 const t=zhangfen_ticket(g,'entry',event.entry_id,{owner_id:zhangfen_actor_id(g,owner),physical_id:row.physical_id});if(!t.run)return false;
 try{const others=SLOTS.filter(zone=>owner[zone]&&owner[zone]!==card).map(zone=>({zone,index:0,card:owner[zone]}));
  t.row.committed=true;t.row.status='resolving';if(others.length)await move(g,owner,others,{to:'discard',action:'discard',semantic_action:'discard',reason:'大攻车入场清除其他装备',move_id:`${t.key}:discard`,visibility:'public'});
  return t.finish(true);
 }catch(e){t.fail(e);throw e;}
}
export function zhangfen_create_native(g,a,form,t){const s=zhangfen_state(g),ledger=zhangfen_actor_ledger(g,a),def=FORMS[form],cost=COSTS[ledger.manufactured];
 if(!def||cost===undefined||ledger.forge<cost||zhangfen_field_vehicles(g).length||!zhangfen_enabled(g,a,SK.quchong))return null;
 if(!t?.run||t.row.kind!=='phase'||t.row.committed||t.row.facts.owner_id!==zhangfen_actor_id(g,a))throw Error('制造需尚未提交的真实阶段事务');
 if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('大攻车实体序列耗尽');
 const ordinal=ledger.manufactured+1,physical_id=`zhangfen:${encodeURIComponent(String(s.match_id))}:${s.counter+1}`,face=s.faces[form],creator_actor_id=zhangfen_actor_id(g,a),creator_skill_binding=zhangfen_binding(g,a);
 const card=new Card(def.name,'武器',{...def,...face,color:['红桃','方块'].includes(face.suit)?'红':'黑',equipment_id:def.id,physical_id,derived_identity:physical_id,creator_actor_id,creator_skill_binding,creation_ordinal:ordinal,source_skill:SK.quchong,source_hero_id:ZHANGFEN_HERO_ID,acquisition_origin:'quchong-manufacture'});
 // One synchronous commit: resources, ordinal, registry and physical reserve.
 s.counter++;ledger.forge-=cost;ledger.manufactured=ordinal;ledger.creation_ids.push(physical_id);
 s.vehicles[key(physical_id)]={physical_id,native:true,form,creator_actor_id,creator_skill_binding,creation_ordinal:ordinal,creation_receipt:t.key,durability:def.initial_durability,max_durability:def.initial_durability,status:'live'};
 g.offboard_cards.push(card);Object.assign(t.row,{committed:true,status:'resolving',card_id:physical_id,form,cost,creation_ordinal:ordinal});
 zhangfen_emit(g,`${a.name}消耗${cost}铸造值，制造${card.name}（${ordinal}/4）。`,{event_type:'siege_manufactured',physical_id,creator_actor_id,cost,ordinal});return card;
}
/** Gain then a real equipment use, even on a third-party recipient. No prompted
 * card use is delegated to the creator. Equipment use is compulsory after gain. */
export async function zhangfen_obtain_then_use(g,a,card,{owner=null,zone='offboard',cause,event_id}={}){
 const found=zhangfen_locations(g).find(x=>x.card===card&&x.owner===owner&&x.zone===zone);if(!found||!zhangfen_alive(a))return false;
 const result=await move(g,owner,[found],{to:'hand',recipient:a,reason:'渠冲获得大攻车',source_skill:SK.quchong,zhangfen_cause:cause,move_id:`${event_id}:gain`,action:'give',semantic_action:'give',visibility:'public'});
 if(!result.committed||!zhangfen_alive(a)||!a.hand.includes(card))return false;
 if(g.can_use_equipment_card?.(a,card,{source_skill:SK.quchong})===false||(a.abolished_equipment_slots??[]).includes('weapon'))return false;
 need(g,'start_card_use');need(g,'end_card_use');need(g,'equip_card');need(g,'finish_processing_card');let scope=null;
 try{const paid=await move(g,a,[{zone:'hand',index:a.hand.indexOf(card),card}],{to:'processing',reason:'渠冲使用大攻车',source_skill:SK.quchong,move_id:`${event_id}:use-material`,action:'card_use',semantic_action:'card_use',visibility:'public',on_committed:()=>{scope=g.start_card_use(a,card,{materials:[card],sourceZones:['hand'],provenance:{kind:'physical',source_skill:SK.quchong}});}});
  if(!paid.committed)return false;
  if(typeof g.on_equipment_card_use==='function')await g.on_equipment_card_use(a,card,{source_skill:SK.quchong,card_use_id:scope?.use_id??`${event_id}:use`});
  if(!zhangfen_alive(a)||!g.processing_cards.includes(card))return false;
  await g.equip_card(a,'weapon',card,{source_skill:SK.quchong,card_use_id:scope?.use_id??`${event_id}:use`});return a.weapon===card;
 }finally{g.finish_processing_card(card);g.end_card_use(scope);}
}
/** DH6 only: adopt a paid real material whose equipment FUNCTION has already
 * committed. No native creator or ordinal is copied, and no entity is spawned. */
export function zhangfen_register_functional_copy(g,owner,card,form,{use_id,committed=false}={}){
 const def=FORMS[form],id=zhangfen_card_id(g,card);if(!committed||!stable(use_id)||!stable(id)||!def||card.virtual||card.derived_identity||owner.weapon!==card)throw Error('复制大攻车须为成功使用后的唯一真实素材');
 if(zhangfen_locations(g).filter(x=>x.card===card||zhangfen_card_id(g,x.card)===id).length!==1)throw Error('复制车素材重复');
 const t=zhangfen_ticket(g,'functional-copy',use_id,{owner_id:zhangfen_actor_id(g,owner),physical_id:id,form});if(!t.run)return zhangfen_vehicle(g,card);
 const row=zhangfen_state(g).vehicles[key(id)]={physical_id:id,native:false,form,creator_actor_id:null,creator_skill_binding:null,creation_ordinal:null,copy_use_id:use_id,durability:def.initial_durability,max_durability:def.initial_durability,status:'live'};
 t.row.committed=true;t.finish(true);return row;
}
export function zhangfen_end_functional_copy(g,card,{cause=null}={}){const row=zhangfen_vehicle(g,card);if(!row||row.native||causeValid(g,{zhangfen_cause:cause,preserve_function_only:true},card))return false;row.status='ended';return true;}
export function zhangfen_public_state(g,a){if(!g[ZHANGFEN_STATE_FIELD])return null;const ledger=zhangfen_state(g).actors[key(zhangfen_actor_id(g,a))]??{forge:0,manufactured:0};const vehicle=zhangfen_active_vehicle(g,a);
 return {forge:ledger.forge,manufactured:ledger.manufactured,manufacture_limit:4,next_cost:COSTS[ledger.manufactured]??null,global_round:g.round_no,attack_bonus:Math.min(Math.max(1,g.round_no??1),3),
  own_vehicle_on_field:zhangfen_has_own_vehicle(g,a),vehicle:vehicle?copy(vehicle.vehicle):null,faces:copy(zhangfen_state(g).faces),compatibility:ZHANGFEN_COMPATIBILITY};}
export function zhangfen_snapshot(g){const s=copy(zhangfen_state(g));return {state:s,requires_input_replay:Object.values(s.receipts).some(r=>r.status!=='done')};}
export function zhangfen_restore(g,snapshot){const s=copy(snapshot?.state??snapshot);
 if(s.version!==1||s.mode!=='identity'||!stable(s.match_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!Number.isSafeInteger(s.action_counter)||s.action_counter<0||!s.actors||!s.vehicles||!s.receipts)throw Error('无效张奋存档');validate_zhangfen_faces(s.faces);
 const locations=zhangfen_locations(g),ids=new Set();
 for(const [k,row] of Object.entries(s.vehicles)){
  if(typeof row.native!=='boolean'||k!==key(row.physical_id)||!stable(row.physical_id)||!FORMS[row.form]||!Number.isInteger(row.durability)||row.durability<0||row.durability>FORMS[row.form].initial_durability||row.max_durability!==FORMS[row.form].initial_durability||!['live','destroyed','ended'].includes(row.status))throw Error('车身份或耐久存档无效');
  if(ids.has(row.physical_id))throw Error('车实体ID重复');ids.add(row.physical_id);
  const present=locations.filter(x=>zhangfen_card_id(g,x.card)===row.physical_id);if(present.length!==1)throw Error('车必须恰好位于一个物理区域');const {card,zone}=present[0];
  if(row.status==='destroyed'&&(row.durability!==0||zone!=='zhangfen_destroyed')||row.status==='live'&&(row.durability<=0||zone==='zhangfen_destroyed'))throw Error('销毁墓碑与活车冲突');
  if(row.native){if(row.status==='ended')throw Error('原生车不能静默结束身份');const ledger=s.actors[key(row.creator_actor_id)],receipt=s.receipts[row.creation_receipt];
   if(!ledger||!receipt?.committed||receipt.kind!=='phase'||receipt.card_id!==row.physical_id||receipt.facts.owner_id!==row.creator_actor_id||receipt.creation_ordinal!==row.creation_ordinal||receipt.cost!==COSTS[row.creation_ordinal-1]||receipt.form!==row.form||ledger.creation_ids[row.creation_ordinal-1]!==row.physical_id||card.derived_identity!==row.physical_id||card.creator_actor_id!==row.creator_actor_id||card.creator_skill_binding!==row.creator_skill_binding||card.creation_ordinal!==row.creation_ordinal||card.equipment_id!==FORMS[row.form].id||card.suit!==s.faces[row.form].suit||card.rank!==s.faces[row.form].rank)throw Error('不可从独立save字段伪造原生制造身份');
  }else{
   if(row.creator_actor_id!==null||row.creator_skill_binding!==null||row.creation_ordinal!==null)throw Error('功能复制不能携带原生制造者');
   const receipt=stable(row.copy_use_id)?s.receipts[key(['functional-copy',row.copy_use_id])]:null;
   if(!receipt?.committed||receipt.status!=='done'||receipt.kind!=='functional-copy'||receipt.id!==row.copy_use_id||receipt.facts.physical_id!==row.physical_id||receipt.facts.form!==row.form||!stable(receipt.facts.owner_id))throw Error('功能复制缺少对应的已提交使用身份回执');
  }
 }
 for(const [k,l] of Object.entries(s.actors)){if(k!==key(l.actor_id)||!Number.isSafeInteger(l.forge)||l.forge<0||!Number.isInteger(l.manufactured)||l.manufactured<0||l.manufactured>4||!Array.isArray(l.creation_ids)||l.creation_ids.length!==l.manufactured||new Set(l.creation_ids).size!==l.manufactured||l.creation_ids.some(id=>!s.vehicles[key(id)]?.native||s.vehicles[key(id)].creator_actor_id!==l.actor_id))throw Error('无效制造账本');}
 if(Object.values(s.vehicles).filter(r=>r.native).length!==s.counter)throw Error('制造总数不一致');
 for(const r of Object.values(s.receipts))if(!stable(r.id)||!r.facts||!['offered','resolving','done','failed'].includes(r.status)||typeof r.committed!=='boolean')throw Error('无效事件回执');
 g[ZHANGFEN_STATE_FIELD]=s;active.delete(g);return {requires_input_replay:Object.values(s.receipts).some(r=>r.status!=='done')};
}
export const zhangfenRuntimeMethods={
 initialize_zhangfen(options){return initialize_zhangfen(this,options);},
 sgs_zhangfen_before_move(owner,materials,context){return zhangfen_before_move(this,owner,materials,context);},
 sgs_zhangfen_payment_preflight(owner,materials,context){return zhangfen_payment_preflight(this,owner,materials,context);},
 sgs_zhangfen_entry_replacement(owner,card){return zhangfen_entry_replacement(this,owner,card);},
 sgs_zhangfen_on_equipment_enter(owner,card,event){return zhangfen_on_equipment_enter(this,owner,card,event);},
 sgs_zhangfen_public_state(owner){return zhangfen_public_state(this,owner);},
 sgs_zhangfen_snapshot(){return zhangfen_snapshot(this);},
 sgs_zhangfen_restore(snapshot){return zhangfen_restore(this,snapshot);},
};
