/** Full classic Mobile 满宠: arbitrary positive hand cost, actual turnover,
 * and one optional recovery tax per resolved damage event. No 界峻刑 rules. */
import {CardType} from './models.js';
import {sgs_dingpin_card_category} from './sgs-followup-chenqun.js';
import {SGS_MANCHONG_HERO_ID as HERO,SGS_MANCHONG_SKILL_IDS as SK} from './sgs-manchong-data.js';
import {manchong_key as key,manchong_live as live,manchong_pid as pid,manchong_stable as stable,
  manchong_ongoing as ongoing,manchong_owned as owned,manchong_binding as binding,manchong_read as read,
  manchong_state as state,manchong_ticket as ticket,manchong_next as next,manchong_methods as methods,
  manchong_movement as movement} from './sgs-manchong-runtime.js';

const pass=value=>['cancel','pass','decline','0','n','no'].includes(String(value));
const select=(options,value)=>options.find(o=>String(o.id)===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const allied=(game,a,b)=>a===b||typeof game.side_of==='function'&&game.side_of(a)===game.side_of(b);
const cost=(game,material)=>game.material_ai_cost?.(material)??2;
const meta=(game,actor,skill,stage,extra={})=>({skill:skill===SK.junxing?'峻刑':'御策',skill_id:skill,stage,
  private_to:game.seat_of(actor),private_choice:true,...extra});

/** Context matters: functional physical faces apply; only-on-use conversions do
 * not. In particular 矢志 must never be asked for a reveal/discard identity. */
export function sgs_manchong_card_face(game,actor,card,action){
  return game.effective_card?.(card,actor,{action,zone:'hand'})??card;
}
export const sgs_manchong_card_category=(game,actor,card,action='discard')=>sgs_dingpin_card_category(sgs_manchong_card_face(game,actor,card,action));
function handMaterials(game,actor,{discard=false,skill=null}={}){
  if(!live(actor))return [];
  const action=discard?'discard':'reveal';
  return (actor.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,
    epoch:game.card_location_epoch?.(card)??0,label:`手牌${index+1}：${card}`,category:sgs_manchong_card_category(game,actor,card,action)}))
    .filter(m=>m.card&&!m.card.virtual&&m.category&&(!discard||game.can_discard_material?.(actor,m,{source:actor,source_skill:skill})!==false));
}
export const sgs_junxing_materials=(game,actor)=>handMaterials(game,actor,{discard:true,skill:SK.junxing});
export const sgs_yuce_reveal_materials=(game,actor)=>handMaterials(game,actor);
export const sgs_junxing_payment_materials=(game,target,categories)=>handMaterials(game,target,{discard:true,skill:SK.junxing}).filter(m=>!categories.includes(m.category));
export const sgs_yuce_payment_materials=(game,source,category)=>handMaterials(game,source,{discard:true,skill:SK.yuce}).filter(m=>m.category!==category);
const exact=(options,material)=>material&&options.find(o=>o.zone===material.zone&&o.index===material.index&&o.card===material.card
  &&(material.epoch===undefined||o.epoch===material.epoch));
const exactBatch=(options,materials)=>Array.isArray(materials)&&materials.length>0&&new Set(materials.map(m=>m?.card)).size===materials.length&&materials.every(m=>exact(options,m));
const requestMaterial=(game,m)=>m?{zone:m.zone??null,index:m.index??null,physical_id:m.card?game.card_history_material_id(m.card):null,epoch:m.epoch??null}:null;
export const sgs_junxing_targets=(game,actor)=>game.all_players().filter(p=>p!==actor&&live(p));
export const sgs_junxing_used=(game,actor,phase=actor?.play_phase_id)=>Boolean(read(game,actor)?.phases[key(phase)]);
function idle(game,actor){
  return live(actor)&&ongoing(game)&&game.actual_turn_active===true&&game.turn_phase==='play'
    &&game.turn_actor===game.seat_of(actor)&&game.is_own_play_phase?.(actor)===true&&!actor.skip_play_stage
    &&stable(game.turn_event_counter)&&stable(actor.play_phase_id)&&game.active_play_phase_id===actor.play_phase_id
    &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>game[k]?.length);
}
const unfinished=(game,actor,except=null)=>Object.values(read(game,actor)?.junxing??{}).some(r=>r!==except&&r.status!=='done');
export const sgs_junxing_available=(game,actor)=>owned(game,actor,SK.junxing)&&idle(game,actor)&&!sgs_junxing_used(game,actor)
  &&!unfinished(game,actor)&&sgs_junxing_materials(game,actor).length>0&&sgs_junxing_targets(game,actor).length>0;
export function sgs_junxing_unavailable_reason(game,actor){
  if(!owned(game,actor,SK.junxing))return '当前不拥有峻刑';
  if(!idle(game,actor))return '只能在自己的真实空闲出牌阶段发动';
  if(sgs_junxing_used(game,actor))return '本出牌阶段已发动峻刑';
  if(unfinished(game,actor))return '峻刑正在结算或需要恢复原事务';
  return '需要至少一张可弃手牌和另一名存活角色';
}
async function chooseCost(game,actor,row,valid){
  const selected=[];
  while(valid()){
    const options=sgs_junxing_materials(game,actor);
    if(!options.length||selected.some(m=>!exact(options,m)))return null;
    const categories=[...new Set(selected.map(m=>m.category))];
    const answer=await game.view.ask_line(`峻刑：选择任意正数张手牌，已选${selected.length}张`,{kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(m=>({id:m.id,label:`${selected.some(s=>s.card===m.card)?'✓ ':''}${m.label}`})),
        ...(selected.length?[{id:'done',label:`确定弃${selected.length}张`}]:[]),{id:'cancel',label:'取消，不弃牌'}],
      meta:meta(game,actor,SK.junxing,'junxing_cost',{event_id:row.event_id,material_zones:['hand'],min_count:1,max_count:null,
        selected_ids:selected.map(m=>m.id),selected_count:selected.length,selected_categories:categories})});
    if(!valid()||pass(answer)||selected.some(m=>!exact(sgs_junxing_materials(game,actor),m)))return null;
    if(answer==='done'){if(selected.length)return [...selected];continue;}
    const material=select(options,answer);if(!material)continue;
    if(!exact(sgs_junxing_materials(game,actor),material))return null;
    const index=selected.findIndex(m=>m.card===material.card);if(index<0)selected.push(material);else selected.splice(index,1);
  }
  return null;
}
async function chooseTarget(game,actor,row,valid){
  while(valid()){
    const options=sgs_junxing_targets(game,actor).map(target=>({id:`target:${pid(game,target)}`,label:`${target.name}（${target.hp}血，${target.face_orientation==='face_down'?'背面':'正面'}）`,target}));
    if(!options.length)return null;
    const answer=await game.view.ask_line('峻刑：选择一名其他存活角色',{kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌'}],
      meta:meta(game,actor,SK.junxing,'junxing_target',{event_id:row.event_id,allow_self:false,once_per_play_phase:true})});
    if(!valid()||pass(answer))return null;const chosen=select(options,answer);if(chosen)return chosen.target;
  }
  return null;
}
/** AI reads only the chooser's cards and public team/orientation/count facts. */
export function sgs_ai_junxing_payment(game,target,initiator,categories,count){
  if(target.face_orientation==='face_down')return null; // Restoring a turn is beneficial, even from an enemy.
  const options=sgs_junxing_payment_materials(game,target,categories).sort((a,b)=>cost(game,a)-cost(game,b));
  if(!options.length)return null;
  // Several cards can compensate for the lost turn; protect a last peach.
  if(count>=4||options[0].card.type===CardType.TAO&&target.hp<=1&&count>=2)return null;
  return options[0];
}
export function sgs_ai_yuce_reveal(game,actor){
  return sgs_yuce_reveal_materials(game,actor).sort((a,b)=>(a.category==='basic'?0:1)-(b.category==='basic'?0:1)||cost(game,a)-cost(game,b))[0]??null;
}
export function sgs_ai_yuce_payment(game,source,receiver,category){
  if(allied(game,source,receiver)||receiver.hp>=(game.effective_max_hp?.(receiver)??receiver.hero.max_hp))return null;
  const options=sgs_yuce_payment_materials(game,source,category).sort((a,b)=>cost(game,a)-cost(game,b));
  return options.find(m=>!(m.card.type===CardType.POISON&&source.hp<=1)&&!(m.card.type===CardType.TAO&&source.hp<=1))??null;
}
/** A private branch prompt belongs to its actual payer, never the initiator.
 * An invalidated pending choice stops; it is not converted to a refusal. */
async function choosePayment(game,payer,owner,row,{skill,materials,valid,declineLabel,ai}){
  while(valid()){
    const options=materials();if(!options.length)return {kind:'decline',reason:'no_legal_hand'};
    if(payer.is_ai){const material=ai();return material?{kind:'pay',material}:{kind:'decline',reason:'choice'};}
    const answer=await game.view.ask_line(skill===SK.junxing?'峻刑：弃一张异类别手牌，或翻面后摸牌':'御策：弃一张异类别手牌，或令受伤角色回复1点体力',{
      kind:'choice',player_id:game.seat_of(payer),options:[...options.map(({id,label})=>({id,label})),{id:'decline',label:declineLabel}],
      meta:meta(game,payer,skill,skill===SK.junxing?'junxing_payment':'yuce_payment',{event_id:row.event_id,owner_id:pid(game,owner),
        material_zones:['hand'],exact_count:1,optional:true,excluded_categories:skill===SK.junxing?[...row.categories]:[row.reveal.category],
        ...(skill===SK.junxing?{draw_count:row.count}:{revealed_card:row.reveal})})});
    if(!valid())return {kind:'invalid'};
    if(pass(answer))return {kind:'decline',reason:'choice'};
    const material=select(options,answer);if(material)return exact(materials(),material)?{kind:'pay',material}:{kind:'invalid'};
  }
  return {kind:'invalid'};
}
async function payOne(game,payer,owner,row,skill,material,legal){
  let paid=false;
  const result=await game.public_card_loss(payer,[material],{to:'discard',visibility:'public',payment:true,
    reason:skill===SK.junxing?'峻刑·目标弃牌':'御策·来源弃牌',action:'discard',semantic_action:'discard',source:owner,source_skill:skill,
    move_id:`${skill}:${key([pid(game,owner),row.event_id])}:response`,validate:legal,
    on_committed:(cards,movement)=>{
      if(cards.length!==1||cards[0]!==material.card)throw Error('满宠异类付款必须恰好弃一张所选手牌');
      paid=true;row.paid=true;row.payment_move_id=movement.move_id;row.payment_card_id=game.card_history_material_id(cards[0]);
      if(skill===SK.junxing)row.branch='discard';
    }});
  if(Boolean(result?.committed)!==paid)throw Error('满宠异类付款缺少一致原子回执');return paid;
}
export async function sgs_junxing_execute(game,actor,{event_id=null,phase_id=null,materials=null,target=null,choose:interactive=false}={}){
  const phase=phase_id??actor?.play_phase_id,old=event_id!==null?read(game,actor)?.junxing[key(event_id)]:null;
  if(!old&&(!sgs_junxing_available(game,actor)||phase!==actor.play_phase_id||target&&!sgs_junxing_targets(game,actor).includes(target)
    ||!interactive&&(!exactBatch(sgs_junxing_materials(game,actor),materials)||!target)))return false;
  movement(game);methods(game,'draw_cards','flip_general');
  const request={owner_id:pid(game,actor),phase_id:phase,choose:interactive,target_id:pid(game,target),materials:materials?.map(m=>requestMaterial(game,m))??null};
  const objects=[...(materials??[]).map(m=>m.card),...(target?[target]:[])];
  if(old){ticket(game,actor,'junxing',event_id,request,objects);return false;}
  const id=event_id??next(game,actor),t=ticket(game,actor,'junxing',id,request,objects),row=t.row,s=state(game,actor);
  const turn=game.turn_event_counter,bound=binding(game,actor,SK.junxing);
  const valid=()=>owned(game,actor,SK.junxing)&&idle(game,actor)&&actor.play_phase_id===phase&&game.turn_event_counter===turn
    &&binding(game,actor,SK.junxing)===bound&&!sgs_junxing_used(game,actor,phase)&&!unfinished(game,actor,row);
  const continues=()=>live(actor)&&live(target)&&ongoing(game)&&game.actual_turn_active===true&&game.turn_event_counter===turn
    &&game.active_play_phase_id===phase&&actor.play_phase_id===phase;
  try{
    row.status='selecting';
    if(interactive){materials=await chooseCost(game,actor,row,valid);if(materials)target=target??await chooseTarget(game,actor,row,()=>valid()&&exactBatch(sgs_junxing_materials(game,actor),materials));}
    else materials=materials.map(m=>({...m,epoch:m.epoch??game.card_location_epoch(m.card)}));
    const legal=()=>valid()&&exactBatch(sgs_junxing_materials(game,actor),materials)&&sgs_junxing_targets(game,actor).includes(target);
    if(!legal()){row.cancelled=true;t.finish();return false;}
    // Capture effective DISCARD categories before detachment. User-supplied
    // material metadata never controls the category or count.
    const categories=[...new Set(materials.map(m=>sgs_manchong_card_category(game,actor,m.card,'discard')))];
    row.status='paying';
    const result=await game.public_card_loss(actor,materials,{to:'discard',visibility:'public',payment:true,reason:'峻刑·费用',action:'discard',semantic_action:'discard',
      source:actor,source_skill:SK.junxing,move_id:`junxing:${key([pid(game,actor),id])}:cost`,validate:legal,
      on_committed:(cards,movement)=>{
        if(cards.length!==materials.length||cards.some((c,i)=>c!==materials[i].card))throw Error('峻刑必须实际弃置全部所选实体手牌');
        row.count=cards.length;row.categories=categories;row.target_id=pid(game,target);row.cost_move_id=movement.move_id;
        row.cost_card_ids=cards.map(c=>game.card_history_material_id(c));row.committed=true;row.status='paid';s.phases[key(phase)]=id;
      }});
    if(Boolean(result?.committed)!==row.committed)throw Error('峻刑缺少一致原子费用回执');
    if(!row.committed){row.cancelled=true;t.finish();return false;}
    if(!continues()){row.stopped=!live(actor)?'owner_dead':!live(target)?'target_dead':'window_closed';t.finish();return true;}
    const payment=await choosePayment(game,target,actor,row,{skill:SK.junxing,materials:()=>sgs_junxing_payment_materials(game,target,row.categories),valid:continues,
      declineLabel:`翻面，然后摸${row.count}张`,ai:()=>sgs_ai_junxing_payment(game,target,actor,row.categories,row.count)});
    if(payment.kind==='invalid'||!continues()){row.stopped='target_choice_invalidated';t.finish();return true;}
    if(payment.kind==='pay'){
      const legalPayment=()=>continues()&&Boolean(exact(sgs_junxing_payment_materials(game,target,row.categories),payment.material));
      row.status='paying';if(!await payOne(game,target,actor,row,SK.junxing,payment.material,legalPayment))row.stopped='target_payment_invalidated';
    }else{
      row.branch='flip_draw';row.status='flipping';
      row.flipped=await game.flip_general(target,{source_skill:SK.junxing,event_id:`junxing:${key([pid(game,actor),id])}:flip`});
      // Await the complete state event (including 法恩 and its nested hooks).
      if(continues()){
        row.status='drawing';const cards=await game.draw_cards(target,row.count);
        if(!Array.isArray(cards)||cards.length>row.count)throw Error('峻刑摸牌需要真实有限牌堆回执');row.drawn=cards.length;
      }else row.stopped='after_flip_window_closed';
    }
    t.finish();game.view.emit(`${actor.name}发动峻刑，${target.name}${row.branch==='discard'?'弃置一张异类别手牌':row.branch==='flip_draw'?`翻面并摸${row.drawn??0}张牌`:'的选择已失效'}。`,
      {event_type:'skill_resolution',skill_id:SK.junxing,event_id:id,target_id:row.target_id,count:row.count,categories:[...row.categories],branch:row.branch??null,drawn:row.drawn??0});
    return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_ai_junxing_plan(game,actor){
  if(!sgs_junxing_available(game,actor)||typeof game.side_of!=='function')return null;
  const materials=sgs_junxing_materials(game,actor).filter(m=>!(m.card.type===CardType.POISON&&actor.hp<=1))
    .sort((a,b)=>cost(game,a)-cost(game,b));
  if(!materials.length)return null;
  const targets=sgs_junxing_targets(game,actor),friend=targets.find(p=>allied(game,actor,p)&&p.face_orientation==='face_down');
  if(friend)return {target:friend,materials:[materials[0]]};
  const enemy=targets.filter(p=>!allied(game,actor,p)&&p.face_orientation!=='face_down').sort((a,b)=>a.hand.length-b.hand.length||a.hp-b.hp)[0];
  if(!enemy||materials[0].card.type===CardType.TAO&&actor.hp<=1)return null;
  return {target:enemy,materials:[materials[0]]};
}
export async function sgs_ai_junxing(game,actor){const plan=sgs_ai_junxing_plan(game,actor);return plan?sgs_junxing_execute(game,actor,plan):false;}
export async function sgs_player_junxing(game,actor){
  if(!sgs_junxing_available(game,actor)){game.view.emit(`峻刑：${sgs_junxing_unavailable_reason(game,actor)}。`);return true;}
  await sgs_junxing_execute(game,actor,{choose:true});return true;
}

const damageFacts=(game,actor,event)=>({owner_id:pid(game,actor),source_id:pid(game,event.source),target_id:pid(game,event.target),
  damage:event.damage,damage_event_id:event.damage_event_id});
function damageWindow(game,actor,event){
  return owned(game,actor,SK.yuce)&&ongoing(game)&&event.target===actor&&Boolean(event.source)
    &&stable(pid(game,event.source))&&game.all_players().includes(event.source)&&stable(event.damage_event_id)
    &&event.damage>0&&event.dying_resolved===true&&event.damage_window==='receiver_after_damage'
    &&!event.closed&&!event.cancelled&&!event.prevented&&sgs_yuce_reveal_materials(game,actor).length>0;
}
async function chooseReveal(game,actor,row,valid){
  if(actor.is_ai)return sgs_ai_yuce_reveal(game,actor);
  while(valid()){
    const options=sgs_yuce_reveal_materials(game,actor);if(!options.length)return null;
    const answer=await game.view.ask_line('御策：展示一张手牌，令伤害来源弃异类手牌或令你回复1点体力',{kind:'choice',player_id:game.seat_of(actor),
      options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],
      meta:meta(game,actor,SK.yuce,'yuce_reveal',{event_id:row.event_id,source_id:row.request.source_id,material_zones:['hand'],exact_count:1,optional:true})});
    if(!valid()||pass(answer))return null;
    const material=select(options,answer);if(material)return exact(sgs_yuce_reveal_materials(game,actor),material)?material:null;
  }
  return null;
}
/** Hook signature matches Game.apply_damage's post-rescue receiver window.
 * Existing-but-dead source cannot pay; a truly absent source never triggers. */
export async function sgs_after_damage_resolved_yuce(game,actor,_damage,_source,event={}){
  const id=event.damage_event_id,old=read(game,actor)?.yuce[key(id)];
  const request=damageFacts(game,actor,event);
  if(old){ticket(game,actor,'yuce',id,request,[event.source,actor]);return false;}
  if(!damageWindow(game,actor,event))return false;
  movement(game);methods(game,'recover_hp');
  const t=ticket(game,actor,'yuce',id,request,[event.source,actor]),row=t.row,bound=binding(game,actor,SK.yuce),source=event.source;
  const sameEvent=()=>key(damageFacts(game,actor,event))===key(request)&&!event.closed&&!event.cancelled&&!event.prevented;
  const valid=()=>damageWindow(game,actor,event)&&binding(game,actor,SK.yuce)===bound&&sameEvent();
  const continues=()=>live(actor)&&ongoing(game)&&sameEvent();
  try{
    row.status='selecting';const material=await chooseReveal(game,actor,row,valid);
    if(!valid()||!material||!exact(sgs_yuce_reveal_materials(game,actor),material)){row.declined=!material;row.cancelled=!valid();t.finish();return false;}
    const face=sgs_manchong_card_face(game,actor,material.card,'reveal');
    row.reveal={actor_id:pid(game,actor),physical_id:game.card_history_material_id(material.card),name:face.name,type:face.type,
      suit:face.suit??null,color:face.color??null,rank:face.rank??null,category:sgs_dingpin_card_category(face)};
    row.committed=true;row.status='revealed';
    game.view.emit(`${actor.name}发动御策，展示${face}。`,{event_type:'card_reveal',skill_id:SK.yuce,event_id:id,reveal:{...row.reveal}});
    if(!continues()){row.stopped='after_reveal_window_closed';t.finish();return true;}
    const payment=live(source)?await choosePayment(game,source,actor,row,{skill:SK.yuce,
      materials:()=>sgs_yuce_payment_materials(game,source,row.reveal.category),valid:()=>continues()&&live(source),
      declineLabel:`令${actor.name}回复1点体力`,ai:()=>sgs_ai_yuce_payment(game,source,actor,row.reveal.category)}):{kind:'decline',reason:'source_dead'};
    if(!continues()){row.stopped='source_choice_window_closed';t.finish();return true;}
    if(payment.kind==='pay'){
      row.status='paying';const legal=()=>continues()&&live(source)&&Boolean(exact(sgs_yuce_payment_materials(game,source,row.reveal.category),payment.material));
      if(!await payOne(game,source,actor,row,SK.yuce,payment.material,legal))row.stopped='source_payment_invalidated';
    }else if(payment.kind==='decline'||!live(source)){
      row.payment_declined=true;row.decline_reason=payment.reason??'source_dead';row.status='recovering';
      row.recovered=await game.recover_hp(actor,1,{source:actor,source_skill:SK.yuce,recovery_event_id:`yuce:${key([pid(game,actor),id])}:recover`,damage_event_id:id});
      game.view.emit(`${actor.name}因御策回复${row.recovered}点体力。`,{event_type:'skill_recovery',skill_id:SK.yuce,event_id:id,player_id:pid(game,actor),recovered:row.recovered});
    }else row.stopped='source_choice_invalidated';
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
sgs_after_damage_resolved_yuce.source_skill_id=SK.yuce;

export function sgs_manchong_skill_definitions({SkillHooks,ActiveSkillDef}){
  const active=new ActiveSkillDef({skill_id:SK.junxing,hotkey:'q',button_label:'峻刑',available:sgs_junxing_available,
    player:sgs_player_junxing,ai:sgs_ai_junxing,help_text:'每出牌阶段限一次，弃任意正数张手牌；其他角色弃一张异于全部成本类别的手牌，或翻面并摸等量牌。'});
  active.source_skill_id=SK.junxing;active.owns_target_selection=true;active.unavailable_reason=sgs_junxing_unavailable_reason;
  return {hooks:{[HERO]:SkillHooks({after_damage_resolved:[sgs_after_damage_resolved_yuce]})},active:{[HERO]:[active]}};
}
