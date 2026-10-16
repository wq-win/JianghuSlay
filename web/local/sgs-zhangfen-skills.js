/** Both intrinsic skills and both complete equipment damage signatures.
 * Integration must keep true play-start / global turn-end and source/receiver
 * windows distinct. See docs/sgs-zhangfen/host-integration.md. */
import {ZHANGFEN_HERO_ID,ZHANGFEN_SKILL_IDS as SK,ZHANGFEN_FORGE_COSTS as COSTS,ZHANGFEN_EQUIPMENT_BY_FORM as FORMS} from './sgs-zhangfen-data.js';
import {ZHANGFEN_SLOTS as SLOTS,zhangfen_alive as live,zhangfen_actor_id as pid,zhangfen_card_id as cid,zhangfen_enabled as has,
 zhangfen_binding as binding,zhangfen_state as state,zhangfen_actor_ledger as ledger,zhangfen_ticket as ticket,zhangfen_emit as emit,
 zhangfen_vehicle,zhangfen_active_vehicle,zhangfen_field_vehicles,zhangfen_has_own_vehicle,zhangfen_locations,zhangfen_is_equipment,
 zhangfen_create_native,zhangfen_cause,zhangfen_obtain_then_use,zhangfen_spend_durability} from './sgs-zhangfen-runtime.js';
const key=JSON.stringify,stable=x=>typeof x==='string'&&x.length>0||Number.isSafeInteger(x)&&x>=0;
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const cancelled=x=>['pass','cancel','0','n','no','decline'].includes(String(x));
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const ownPlay=(g,a)=>has(g,a,SK.quchong)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===g.seat_of(a)&&!a.skip_play_stage&&stable(g.active_play_phase_id)&&a.play_phase_id===g.active_play_phase_id;
const meta=(g,a,stage,e={})=>({skill:'渠冲',skill_id:SK.quchong,stage,private_to:g.seat_of(a),event_id:e.event_id??e.phase_event_id??null,phase_event_id:g.active_play_phase_id,turn_id:g.turn_event_counter,optional:true});
async function ask(g,a,text,options,stage,event,valid,extra={}){
 while(valid()){const answer=await g.view.ask_line(text,{kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动'}],meta:{...meta(g,a,stage,event),...extra}});
  if(!valid()||cancelled(answer))return null;const chosen=select(options,answer);if(chosen)return chosen;
 }return null;
}
export function zhangfen_recast_materials(g,a){return [...(a.hand??[]).map((card,index)=>({zone:'hand',index,card,id:`hand:${index+1}`,label:`重铸手牌${index+1}：${card.name}`})),...SLOTS.filter(zone=>a[zone]).map(zone=>({zone,index:0,card:a[zone],id:`eq:${zone}`,label:`重铸装备：${a[zone].name}`}))].filter(m=>zhangfen_is_equipment(m.card));}
export const zhangfen_recast_available=(g,a)=>ownPlay(g,a)&&zhangfen_recast_materials(g,a).length>0;
/** Unlimited activations; each actual action has its own event ID. Recast is
 * neither discard nor card use/respond, though physical loss callbacks run. */
export async function zhangfen_recast(g,a,{event_id,material=null,choose=material===null}={}){
 if(!ownPlay(g,a)||!zhangfen_recast_materials(g,a).length)return false;
 if(!stable(event_id))throw Error('渠冲重铸需要每次真实操作的稳定 event_id');
 const t=ticket(g,'recast',event_id,{owner_id:pid(g,a),phase_id:g.active_play_phase_id,turn_id:g.turn_event_counter,choose,card_id:material?cid(g,material.card):null,zone:material?.zone??null});if(!t.run)return false;
 const bound=binding(g,a),phase=g.active_play_phase_id,turn=g.turn_event_counter;
 const valid=()=>ownPlay(g,a)&&binding(g,a)===bound&&g.active_play_phase_id===phase&&g.turn_event_counter===turn;
 try{let chosen=material;
  if(choose){const os=zhangfen_recast_materials(g,a);chosen=a.is_ai?os.filter(m=>m.zone==='hand').sort((x,y)=>(g.material_ai_cost?.(x)??0)-(g.material_ai_cost?.(y)??0))[0]??null:await ask(g,a,'渠冲：重铸一张自己的装备牌并摸一张牌',os,'quchong_recast',{event_id},valid,{material_zones:['hand',...SLOTS],exact_count:1});}
  const exact=()=>valid()&&chosen&&zhangfen_recast_materials(g,a).some(m=>m.card===chosen.card&&m.zone===chosen.zone&&m.index===chosen.index);
  if(!exact()){t.row.cancelled=true;return t.finish(false);}
  // The cause lease authorizes only this exact physical movement. An actor name
  // or a generic reason string does not exempt unrelated movements.
  t.row.card_id=cid(g,chosen.card);t.row.committed=true;t.row.status='resolving';let paid=false;
  const result=await g.public_card_loss(a,[chosen],{to:'discard',reason:'渠冲重铸',source_skill:SK.quchong,zhangfen_cause:zhangfen_cause(g,t,a,chosen.card),move_id:`${t.key}:recast`,action:'recast',semantic_action:'recast',visibility:'public',payment:true,validate:exact,on_committed:cards=>{if(cards.length!==1||cards[0]!==chosen.card)throw Error('重铸必须实际移动所选一张牌');paid=true;t.row.paid=true;}});
  if(Boolean(result?.committed)!==paid)throw Error('重铸原子支付回执不一致');if(!paid){t.row.committed=false;return t.finish(false);}
  let drawn=0;if(live(a)&&ongoing(g)){const cards=await g.draw_cards(a,1);if(!Array.isArray(cards)||cards.length>1)throw Error('重铸摸牌需实际有限牌堆回执');drawn=cards.length;}t.row.drawn=drawn;
  emit(g,`${a.name}发动渠冲重铸${chosen.card.name}，摸${drawn}张牌。`,{event_type:'card_recast',skill_id:SK.quchong,event_id,physical_id:t.row.card_id,drawn});return t.finish(true);
 }catch(e){t.fail(e);throw e;}
}
function phaseWindow(g,a,e){return ownPlay(g,a)&&e.actor===a&&e.phase_event_id===g.active_play_phase_id&&e.turn_id===g.turn_event_counter&&e.entered===true&&!e.closed&&!e.skipped&&!e.interrupted;}
const legalRecipient=(_g,p)=>live(p); // Source allows any living role; later use may be prohibited.
const aiRecipient=(g,a,players)=>players.filter(p=>p===a||g.side_of?.(p)===g.side_of?.(a)).sort((x,y)=>SLOTS.filter(s=>x[s]).length-SLOTS.filter(s=>y[s]).length||x.hp-y.hp)[0]??null;
/** Creator chooses form / current car / recipient. After gain, all use-trigger
 * decisions belong to the recipient (the real card user). */
export async function zhangfen_on_play_phase_begin(g,a,_target,e={}){
 if(!phaseWindow(g,a,e))return false;
 const t=ticket(g,'phase',e.phase_event_id,{owner_id:pid(g,a),phase_id:e.phase_event_id,turn_id:e.turn_id});if(!t.run)return false;
 const bound=binding(g,a),valid=()=>phaseWindow(g,a,e)&&binding(g,a)===bound;
 try{let cars=zhangfen_field_vehicles(g),selected=null,form=null;
  if(cars.length){const os=cars.map(c=>({id:`vehicle:${c.vehicle.physical_id}`,label:`${c.owner.name}的${c.card.name}（耐久${c.vehicle.durability}）`,...c}));
   selected=a.is_ai?os.find(c=>g.side_of?.(c.owner)!==g.side_of?.(a))??null:await ask(g,a,'渠冲：选择移交一辆场上的大攻车',os,'quchong_transfer_car',e,valid);
   if(!selected)return t.finish(false);
  }else{const l=ledger(g,a),cost=COSTS[l.manufactured];if(cost===undefined||l.forge<cost)return t.finish(false);
   const os=Object.values(FORMS).map(d=>({id:d.form,label:`制造${d.name}（耐久${d.initial_durability}，消耗${cost}铸造值）`}));
   const chosen=a.is_ai?os.find(o=>o.id===(a.hp<=2?'defend':'attack')):await ask(g,a,'渠冲：选择大攻车形态',os,'quchong_manufacture_form',e,valid,{forge:l.forge,manufactured:l.manufactured,next_cost:cost});
   if(!chosen)return t.finish(false);form=chosen.id;
  }
  let targets=g.all_players().filter(p=>legalRecipient(g,p)&&p!==selected?.owner);
  const target=a.is_ai?aiRecipient(g,a,targets):(await ask(g,a,'渠冲：选择获得并使用大攻车的角色',targets.map(p=>({id:`target:${pid(g,p)}`,label:`${p.name}（${p.hp}体力）`,target:p})),'quchong_recipient',e,valid,{allow_self:true,creator_id:pid(g,a)}))?.target;
  if(!target||!valid()||!legalRecipient(g,target))return t.finish(false);
  let card,owner=null,zone='offboard';
  if(selected){const current=zhangfen_field_vehicles(g).find(x=>x.card===selected.card&&x.owner===selected.owner);if(!current||target===current.owner)return t.finish(false);
   card=current.card;owner=current.owner;zone=current.zone;Object.assign(t.row,{committed:true,status:'resolving',card_id:cid(g,card),transfer:true,cost:0});
  }else{if(zhangfen_field_vehicles(g).length)return t.finish(false);card=zhangfen_create_native(g,a,form,t);if(!card)return t.finish(false);}
  t.row.recipient_id=pid(g,target);t.row.equipped=await zhangfen_obtain_then_use(g,target,card,{owner,zone,cause:zhangfen_cause(g,t,a,card),event_id:t.key});
  // Once manufactured, target death / loss / prohibition does not refund cost,
  // manufacture count, repair, or create an extra entity.
  return t.finish(true);
 }catch(e2){t.fail(e2);throw e2;}
}
function endWindow(g,e){return g.actual_turn_active===true&&g.turn_phase==='turn_end'&&e.stage==='turn_end'&&e.actor&&g.turn_actor===g.seat_of(e.actor)&&stable(e.event_id)&&e.turn_id===g.turn_event_counter&&!e.closed&&!e.interrupted&&!e.skipped_turn;}
/** Mandatory collection, dispatched in current action order after pending
 * discard/gain reactions have finished. Each later holder sees the current pile. */
export async function zhangfen_on_actual_turn_end(g,a,_target,e={}){
 if(!has(g,a,SK.quchong)||!endWindow(g,e))return false;
 const t=ticket(g,'collect',key([pid(g,a),e.event_id]),{owner_id:pid(g,a),turn_id:e.turn_id,turn_actor_id:pid(g,e.actor),event_id:e.event_id});if(!t.run)return false;
 try{await g.flush_card_events?.();await g.flush_general_state_events?.();if(!has(g,a,SK.quchong)||!endWindow(g,e))return t.finish(false);
  const materials=g.deck.discard_pile.map((card,index)=>({zone:'discard',index,card})).filter(m=>zhangfen_is_equipment(m.card));if(!materials.length)return t.finish(false);
  t.row.status='resolving';let removed=0;const result=await g.public_card_loss(null,materials,{to:'zhangfen_removed',reason:'渠冲收集铸造值',source_skill:SK.quchong,move_id:`${t.key}:collect`,action:'remove_from_game',semantic_action:'remove_from_game',visibility:'public',on_committed:cards=>{removed=cards.length;ledger(g,a).forge+=removed;t.row.committed=true;t.row.removed_ids=cards.map(c=>cid(g,c));t.row.forge_gained=removed;}});
  if(Boolean(result?.committed)!==t.row.committed)throw Error('铸造值必须对应实际移出数量');
  emit(g,`${a.name}因渠冲将弃牌堆${removed}张装备移出游戏，获得${removed}铸造值。`,{event_type:'quchong_forge',event_id:e.event_id,owner_id:pid(g,a),removed,forge:ledger(g,a).forge});return t.finish(removed>0);
 }catch(error){t.fail(error);throw error;}
}
const damageWindow=e=>stable(e?.damage_event_id)&&e.damage>0&&!e.prevented&&!e.cancelled&&!e.closed&&e.kind!=='hp_loss'&&e.kind!=='lose_hp'&&live(e.target);
function damageFacts(g,e){return {source_id:pid(g,e.source),target_id:pid(g,e.target),kind:e.kind??null,nature:e.nature??null};}
function replayDamage(t,e){if(t.row.status==='done'&&t.row.output_damage!==undefined){if(e.damage!==t.row.input_damage&&e.damage!==t.row.output_damage)throw Error('伤害回执与输入金额不一致');e.damage=t.row.output_damage;}return false;}
export async function zhangfen_attack_before_damage(g,e){
 if(!damageWindow(e))return false;const car=zhangfen_active_vehicle(g,e.source,'attack');
 const old=state(g).receipts[key(['attack',e.damage_event_id])];if(!car&&!old)return false;
 if(!Number.isInteger(g.round_no)||g.round_no<1)throw Error('大攻车加伤需要首轮为1的全局轮数');
 const t=ticket(g,'attack',e.damage_event_id,damageFacts(g,e));if(!t.run)return replayDamage(t,e);
 try{const valid=()=>damageWindow(e)&&zhangfen_active_vehicle(g,e.source,'attack')?.card===car.card;
  const bonus=Math.min(g.round_no,3);let accepted=e.source.is_ai&&(g.side_of?.(e.source)!==g.side_of?.(e.target));
  if(!e.source.is_ai)accepted=Boolean(await ask(g,e.source,`大攻车·进击：消耗1耐久，使本次伤害+${bonus}？`,[{id:'activate',label:`伤害${e.damage}→${e.damage+bonus}（${car.vehicle.durability===1?'车将销毁':'消耗1耐久'}）`}],'siege_attack',e,valid,{skill:null,skill_id:null,equipment:car.card.name,damage_event_id:e.damage_event_id,bonus,global_round:g.round_no,durability:car.vehicle.durability}));
  if(!accepted||!valid())return t.finish(false);
  t.row.input_damage=e.damage;t.row.output_damage=e.damage+bonus;t.row.bonus=bonus;t.row.committed=true;t.row.status='resolving';e.damage=t.row.output_damage;
  await zhangfen_spend_durability(g,car.card,1,{event_id:`${t.key}:cost`,reason:'进击加伤'});return t.finish(true);
 }catch(error){t.fail(error);throw error;}
}
export async function zhangfen_xunjie_before_damage(g,a,e){
 if(!damageWindow(e)||e.target!==a)return false;const old=state(g).receipts[key(['xunjie',e.damage_event_id])];
 if(!old&&(!has(g,a,SK.xunjie)||!e.source||!(e.source.hp>a.hp)||zhangfen_has_own_vehicle(g,a)))return false;
 const t=ticket(g,'xunjie',e.damage_event_id,damageFacts(g,e));if(!t.run)return replayDamage(t,e);
 try{t.row.input_damage=e.damage;t.row.status='resolving';t.row.committed=true;let judgment=null;
  try{judgment=await g.reveal_judgment(a,'逊节',{good_for:a,favorable:c=>c.color==='红'});t.row.judgment=judgment?{suit:judgment.suit,rank:judgment.rank,color:judgment.color}:null;
   if(judgment?.color==='红'&&damageWindow(e))e.damage=Math.max(0,e.damage-1);t.row.output_damage=e.damage;
  }finally{if(judgment)await g.finish_judgment_card(judgment);}
  emit(g,`${a.name}发动逊节，${judgment?.color==='红'?'红色判定，本次伤害-1':'本次未减伤'}。`,{event_type:'xunjie_judgment',damage_event_id:e.damage_event_id,red:judgment?.color==='红',damage:e.damage});return t.finish(true);
 }catch(error){t.fail(error);throw error;}
}
export async function zhangfen_defense_before_damage(g,e){
 if(!damageWindow(e))return false;const car=zhangfen_active_vehicle(g,e.target,'defend'),old=state(g).receipts[key(['defense',e.damage_event_id])];if(!car&&!old)return false;
 const t=ticket(g,'defense',e.damage_event_id,damageFacts(g,e));if(!t.run)return replayDamage(t,e);
 try{const amount=Math.min(e.damage,car.vehicle.durability);t.row.input_damage=e.damage;t.row.output_damage=e.damage-amount;t.row.prevented_amount=amount;t.row.committed=true;t.row.status='resolving';e.damage=t.row.output_damage;
  await zhangfen_spend_durability(g,car.card,amount,{event_id:`${t.key}:cost`,reason:'守御防止伤害'});return t.finish(true);
 }catch(error){t.fail(error);throw error;}
}
/** DH2 target compatibility order. Snapshot the decision once before defense;
 * a newly destroyed own car never reopens Xunjie on this same packet. */
export async function zhangfen_receiver_before_damage(g,e){
 if(!g.sgs_zhangfen_state||!damageWindow(e))return false;
 // Unrelated damage has no vehicle decision to journal. Preserve an existing
 // receipt for idempotence, but do not grow every ordinary hero's replay state.
 const prior=state(g).receipts[key(['receiver',e.damage_event_id])];
 const eligibleXunjie=has(g,e.target,SK.xunjie)&&e.source&&e.source.hp>e.target.hp&&!zhangfen_has_own_vehicle(g,e.target);
 if(!prior&&!eligibleXunjie&&!zhangfen_active_vehicle(g,e.target,'defend'))return false;
 const t=ticket(g,'receiver',e.damage_event_id,damageFacts(g,e));if(!t.run)return replayDamage(t,e);
 try{t.row.input_damage=e.damage;t.row.status='resolving';await zhangfen_xunjie_before_damage(g,e.target,e);await zhangfen_defense_before_damage(g,e);t.row.output_damage=e.damage;t.row.committed=true;return t.finish(t.row.input_damage!==e.damage);}catch(error){t.fail(error);throw error;}
}
export async function zhangfen_player_recast(g,a){if(!zhangfen_recast_available(g,a))return false;if(state(g).action_counter>=Number.MAX_SAFE_INTEGER)throw Error('渠冲操作序列耗尽');state(g).action_counter++;return zhangfen_recast(g,a,{event_id:`quchong-action:${state(g).action_counter}`,choose:true});}
export const ZHANGFEN_AI_RECAST_BUDGET=8; // Strategy only: never caps a human's legal recasts.
export async function zhangfen_ai_recast(g,a){if(!zhangfen_recast_available(g,a))return false;
 // An equipment-only exhausted deck can redraw the same recast material forever.
 // Bound AI speculation per real phase, while normal hand-card play still runs.
 const committed=Object.values(state(g).receipts).filter(r=>r.kind==='recast'&&r.committed&&r.facts.owner_id===pid(g,a)&&r.facts.phase_id===g.active_play_phase_id).length;
 if(committed>=ZHANGFEN_AI_RECAST_BUDGET)return false;
 const material=zhangfen_recast_materials(g,a).find(m=>m.zone==='hand'&&(a[m.card.type==='武器'?'weapon':m.card.type==='防具'?'armor':m.card.type==='-1马'?'offensive_horse':'defensive_horse']||zhangfen_active_vehicle(g,a)));if(!material)return false;if(state(g).action_counter>=Number.MAX_SAFE_INTEGER)throw Error('渠冲操作序列耗尽');state(g).action_counter++;return zhangfen_recast(g,a,{event_id:`quchong-action:${state(g).action_counter}`,material});}
export function zhangfen_skill_definitions({SkillHooks,ActiveSkillDef}){const active=new ActiveSkillDef({skill_id:SK.quchong,hotkey:'q',button_label:'渠冲',available:zhangfen_recast_available,player:zhangfen_player_recast,ai:zhangfen_ai_recast,help_text:'重铸一张自己的装备牌并摸一张。回合末收集弃牌堆装备获得铸造值；出牌阶段开始可制造或移交大攻车。'});active.source_skill_id=SK.quchong;active.owns_target_selection=true;return {hooks:{[ZHANGFEN_HERO_ID]:SkillHooks({on_play_phase_begin:[zhangfen_on_play_phase_begin],on_any_actual_turn_end:[zhangfen_on_actual_turn_end]})},active:{[ZHANGFEN_HERO_ID]:[active]}};}

zhangfen_on_play_phase_begin.source_skill_id=SK.quchong;zhangfen_on_actual_turn_end.source_skill_id=SK.quchong;zhangfen_xunjie_before_damage.source_skill_id=SK.xunjie;
export const zhangfenDamageMethods={sgs_zhangfen_source_damage(e){return this.sgs_zhangfen_state?zhangfen_attack_before_damage(this,e):false;},sgs_zhangfen_receiver_damage(e){return zhangfen_receiver_before_damage(this,e);}};
