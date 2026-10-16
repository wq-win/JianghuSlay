/** Mainland-mobile base 身份 张郃 / 姜维, source snapshot 2026-10-15.
 * Full packets with M0–M4/M7/M9/M10/M14 host policies, not current-client
 * certification. See docs/sgs-mountain/phase-integration-contract.md. */
import {rule_hero} from './effective-hero.js';
import {is_sha_card} from './models.js';

export const SGS_MOUNTAIN_PHASE_RULE_IDS=Object.freeze({zhanghe:'sgs.adapted.base.hero.zhang-he',jiangwei:'sgs.adapted.base.hero.jiang-wei'});
export const SGS_MOUNTAIN_PHASE_SKILL_IDS=Object.freeze({qiaobian:'sgs.qiaobian',tiaoxin:'sgs.tiaoxin',zhiji:'sgs.zhiji',guanxing:'sgs.guanxing'});
const ID=SGS_MOUNTAIN_PHASE_RULE_IDS,SK=SGS_MOUNTAIN_PHASE_SKILL_IDS;
export const SGS_MOUNTAIN_PHASE_SOURCE=Object.freeze({snapshot_date:'2026-10-15',variant:'mainland-mobile-base-identity',current_client_rules_verified:false,current_client_hp_verified:false,
  host_policy_ids:Object.freeze(['M0','M1','M2','M3','M4','M7','M9','M10','M14','M16']),
  heroes:Object.freeze([
    Object.freeze({id:ID.zhanghe,name:'张郃',max_hp:4,starting_hp:4,gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.qiaobian]),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:ID.jiangwei,name:'姜维',max_hp:4,starting_hp:4,gender:'male',source_faction:'蜀',skill_ids:Object.freeze([SK.tiaoxin,SK.zhiji]),granted_skill_ids:Object.freeze([SK.guanxing]),personal_lord_skill_ids:Object.freeze([])}),
  ]),urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-50.html','https://www.sanguosha.cn/pc/hero-detail-52.html','https://news.7k7k.com/content/20120307/161563.html','https://my.4399.com/yxxsgs/ziliao/6967']),
});
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const PHASES=Object.freeze(['judgment','draw','play','discard']);
const NAMES={[SK.qiaobian]:'巧变',[SK.tiaoxin]:'挑衅',[SK.zhiji]:'志继',[SK.guanxing]:'观星'};
const live=a=>Boolean(a?.alive&&!a.dead&&a.hp>0);
const continuing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const seat=(g,a)=>g.seat_of(a),identity=(g,a)=>g.player_id?.(a)??seat(g,a);
const stable=v=>typeof v==='string'&&v.length>0||Number.isSafeInteger(v)&&v>0;
const eventId=e=>e?.phase_event_id??e?.event_id;
const pass=v=>['pass','cancel','0','n','no','refuse'].includes(String(v));
const select=(options,v)=>options.find(o=>String(o.id)===String(v))??(/^\d+$/.test(String(v))?options[Number(v)-1]:null);
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&o.id===m.id);
const own=(g,a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&(typeof g.has_general_skill==='function'?g.has_general_skill(a,skill):(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill));
const key=(g,a,id)=>JSON.stringify([identity(g,a),id]);
const meta=(g,a,skill,stage,extra={})=>({skill:NAMES[skill],skill_id:skill,stage,private_to:seat(g,a),...extra});
const active=new WeakMap();
function state(a){const s=a.sgs_mountain_phase_state??={version:1,counter:0,qiaobian:{},tiaoxin:{},zhiji:{},guanxing:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['qiaobian','tiaoxin','zhiji','guanxing'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS mountain phase state');return s;}
export const sgs_clone_mountain_phase_state=a=>a.sgs_mountain_phase_state?JSON.parse(JSON.stringify(state(a))):null;
function old(a,namespace,k){const r=state(a)[namespace][k];if(r&&!['done','passed'].includes(r.status)&&!active.get(a)?.has(r))throw Object.assign(Error('山武将事务未完成，必须从原动作日志重放；不能重复付费、摸牌或觉醒。'),{code:'SGS_MOUNTAIN_PHASE_REPLAY_REQUIRED'});return r;}
function reserve(a,namespace,k,data={}){const s=state(a);if(s.counter===Number.MAX_SAFE_INTEGER)throw Error('山武将事件计数器已耗尽');const r=s[namespace][k]={event_id:`mountain:${namespace}:${k}:${++s.counter}`,status:'offered',...data};let set=active.get(a);if(!set)active.set(a,set=new Set());set.add(r);return r;}
function finish(a,r,status='done'){r.status=status;active.get(a)?.delete(r);}
function failure(a,r,error){r.status='failed';r.error=String(error?.message??error);active.get(a)?.delete(r);}
function requireMethods(g,names){for(const name of names)if(typeof g[name]!=='function')throw Error(`山武将完整规则接入缺少 ${name}`);}
function movement(g){requireMethods(g,['public_card_loss']);if(g.public_card_loss_supports_on_committed!==true)throw Error('山武将需要原子 validate/on_committed 移牌内核');}
const phaseWindow=(g,a,phase,e)=>live(a)&&continuing(g)&&g.actual_turn_active!==false&&g.turn_actor===seat(g,a)
  &&g.turn_phase===`before_${phase}`&&stable(eventId(e))&&!e.closed&&!e.skipped&&!e.cancelled&&!a[`skip_${phase}_stage`];
const prepared=(g,a,e)=>live(a)&&continuing(g)&&g.actual_turn_active!==false&&g.turn_actor===seat(g,a)&&g.turn_phase==='prepare'&&stable(eventId(e))&&!e.closed&&!e.skipped&&!e.cancelled;
const idlePlay=(g,a)=>live(a)&&continuing(g)&&g.actual_turn_active!==false&&g.is_own_play_phase(a)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const mayDiscard=(g,a,m)=>!m.card.virtual&&(g.can_discard_material?.(a,m)!==false)&&(g.can_discard_card?.(a,m.card,{zone:m.zone,reason:'技能弃牌'})!==false);
export const sgs_qiaobian_costs=(g,a)=>live(a)?g.skill_material_options(a).filter(m=>m.zone==='hand'&&mayDiscard(g,a,m)):[];
export const sgs_qiaobian_draw_targets=(g,a)=>g.all_players().filter(t=>t!==a&&live(t)&&t.hand.length>0);
const unabolished=(g,a,slot)=>!g.is_equipment_slot_abolished?.(a,slot)&&!a[`${slot}_abolished`]
  &&![a.abolished_slots,a.abolished_equipment_slots].some(v=>v instanceof Set?v.has(slot):Array.isArray(v)?v.includes(slot):v?.[slot]===true);
function boardMaterials(g,a){return [...SLOTS.flatMap(zone=>a[zone]?[{zone,index:0,card:a[zone],id:`eq:${zone}`,label:String(a[zone])}]:[]),
  ...(a.judgment_cards??[]).map((card,index)=>({zone:'judgment',index,card,id:`judgment:${index+1}`,label:`${g.effective_delayed_name(a,card)}（${card}）`}))].filter(m=>!m.card.virtual);}
export function sgs_qiaobian_transfer_legal(g,from,material,to){
  if(from===to||!g.all_players().includes(from)||!g.all_players().includes(to)||!live(from)||!live(to)||!exact(boardMaterials(g,from),material))return false;
  if(SLOTS.includes(material.zone))return !to[material.zone]&&unabolished(g,to,material.zone);
  if(material.zone!=='judgment')return false;
  const name=g.effective_delayed_name(from,material.card),effect_id=g.effective_delayed_effect_id(from,material.card);
  return !(to.judgment_cards??[]).some(c=>g.effective_delayed_name(to,c)===name)
    &&!g.card_target_prohibited?.(from,to,{...material.card,name,type:'锦囊',effect_id},{judgment_transfer:true});
}
export function sgs_qiaobian_transfers(g){const choices=[];for(const from of g.all_players().filter(live))for(const material of boardMaterials(g,from))for(const to of g.all_players().filter(live))
  if(sgs_qiaobian_transfer_legal(g,from,material,to))choices.push({from,to,material,id:`${seat(g,from)}:${material.id}>${seat(g,to)}`,label:`${from.name}的${material.label} → ${to.name}`});return choices;}
export function sgs_qiaobian_available(g,a,phase,e){return PHASES.includes(phase)&&own(g,a,SK.qiaobian)&&phaseWindow(g,a,phase,e)&&!a.sgs_mountain_phase_state?.qiaobian?.[key(g,a,eventId(e))]&&sgs_qiaobian_costs(g,a).length>0;}
/** Own cost faces and public board/counts only; ally targets stay legal. */
export function sgs_ai_qiaobian_choice(g,a,phase,e){
  if(!sgs_qiaobian_available(g,a,phase,e))return null;
  const cost=sgs_qiaobian_costs(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y))[0];
  if(phase==='judgment')return a.judgment_cards?.length||a.leidian_pending||a.poison_mark_pending||a.judgment_mark_pending?{cost,effect:{pass:true}}:null;
  if(phase==='discard')return a.hand.length>g.hand_limit(a)+1?{cost,effect:{pass:true}}:null;
  if(phase==='draw'){
    const targets=sgs_qiaobian_draw_targets(g,a).filter(t=>g.side_of(t)!==g.side_of(a)).sort((x,y)=>y.hand.length-x.hand.length).slice(0,2);
    return targets.length===2?{cost,effect:{targets}}:null;
  }
  const transfer=sgs_qiaobian_transfers(g).find(t=>t.material.zone==='judgment'?g.side_of(t.from)===g.side_of(a)&&g.side_of(t.to)!==g.side_of(a):g.side_of(t.from)!==g.side_of(a)&&g.side_of(t.to)===g.side_of(a));
  return transfer?{cost,effect:{transfer}}:null;
}
async function chooseQiaobianEffect(g,a,phase,r){
  if(phase==='draw'){
    const chosen=[];
    while(live(a)&&continuing(g)&&chosen.length<2){
      const targets=sgs_qiaobian_draw_targets(g,a).filter(t=>!chosen.includes(t));if(!targets.length)break;
      const options=targets.map(t=>({id:seat(g,t),label:`${t.name}（${t.hand.length}张手牌）`}));
      const answer=await g.view.ask_line(`巧变：选择第${chosen.length+1}名获得手牌的其他角色，或完成（可不选）`,{kind:'choice',player_id:seat(g,a),options:[...options,{id:'done',label:'完成选择'}],meta:meta(g,a,SK.qiaobian,'qiaobian_draw_target',{phase_event_id:r.phase_event_id,selected_seats:chosen.map(t=>seat(g,t)),hidden_hands:true})});
      if(pass(answer)||answer==='done')break;const target=targets.find(t=>seat(g,t)===select(options,answer)?.id);if(target)chosen.push(target);
    }return {targets:chosen};
  }
  if(phase==='play')while(live(a)&&continuing(g)){
    const options=sgs_qiaobian_transfers(g);if(!options.length)return {pass:true};
    const answer=await g.view.ask_line('巧变：可移动一张装备或判定牌，或不移动',{kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不移动（出牌阶段仍跳过）'}],meta:meta(g,a,SK.qiaobian,'qiaobian_transfer',{phase_event_id:r.phase_event_id})});
    if(pass(answer))return {pass:true};const transfer=select(options,answer);if(transfer)return {transfer};
  }
  return {pass:true};
}
/** Losses are awaited in action order; reserved physical cards are received as
 * ONE packet only after all target losses. Never reread a gained replacement. */
async function qiaobianSteal(g,a,r,targets){
  if(!Array.isArray(targets)||targets.length>2||new Set(targets).size!==targets.length||targets.some(t=>!sgs_qiaobian_draw_targets(g,a).includes(t)))return false;
  const order=g.action_order(),ordered=[...targets].sort((x,y)=>order.indexOf(x)-order.indexOf(y)),reserved=[];
  for(const target of ordered){
    if(!live(a)||!continuing(g))break;if(!live(target)||!target.hand.length)continue;
    // Index choice is blind for humans and seeded random for AI. Never inspect
    // another hand's face to rank a choice.
    let selected;
    if(a.is_ai)selected=g.rng.choice(target.hand);
    else while(live(a)&&live(target)&&continuing(g)&&target.hand.length){
      const options=target.hand.map((card,index)=>({id:`hand:${index+1}`,label:`手牌${index+1}（未知）`,card,index}));
      const answer=await g.view.ask_line(`巧变：选择${target.name}的一张未知手牌`,{kind:'choice',player_id:seat(g,a),options:options.map(({id,label})=>({id,label})),meta:meta(g,a,SK.qiaobian,'qiaobian_hand',{owner_seat:seat(g,target),hidden_hands:true,mandatory:true})});
      const chosen=select(options,answer);if(chosen&&target.hand[chosen.index]===chosen.card){selected=chosen.card;break;}
    }
    if(!selected)continue;
    const material={zone:'hand',index:target.hand.indexOf(selected),card:selected};r.loss_attempt=(r.loss_attempt??0)+1;
    await g.public_card_loss(target,[material],{to:'processing',visibility:'private',reason:'巧变',action:'obtain',source:a,source_skill:SK.qiaobian,move_id:`${r.event_id}:loss:${r.loss_attempt}`,
      validate:()=>live(a)&&live(target)&&continuing(g)&&target.hand[material.index]===selected,
      on_committed:cards=>{reserved.push(...cards);r.reserved_count=reserved.length;},
    });
  }
  const cards=reserved.filter(c=>g.processing_cards.includes(c));if(!cards.length)return false;
  const recipient=live(a)&&continuing(g)?a:null;
  await g.public_card_loss(null,cards.map(card=>({zone:'processing',index:g.processing_cards.indexOf(card),card})),{to:recipient?'hand':'discard',recipient,visibility:recipient?'private':'public',reason:'巧变',action:recipient?'obtain':'cleanup',source_skill:SK.qiaobian,
    source_zone:'player',move_id:`${r.event_id}:combined-gain`,on_committed:cs=>{r.gained_count=recipient?cs.length:0;}});
  return true;
}
export async function sgs_resolve_qiaobian(g,a,phase,e,material,{effect=null,receipt=null}={}){
  if(!PHASES.includes(phase)||!own(g,a,SK.qiaobian)||!phaseWindow(g,a,phase,e))return false;
  const k=key(g,a,eventId(e)),existing=old(a,'qiaobian',k);if(existing&&(existing!==receipt||existing.status!=='offered'))return false;
  const current=exact(sgs_qiaobian_costs(g,a),material);if(!current)return false;movement(g);
  const r=receipt??reserve(a,'qiaobian',k,{phase,phase_event_id:eventId(e),paid:false}),form=rule_hero(a)?.id,turn=g.turn_event_counter;r.status='paying';
  const valid=()=>own(g,a,SK.qiaobian)&&phaseWindow(g,a,phase,e)&&rule_hero(a)?.id===form&&g.turn_event_counter===turn&&!!exact(sgs_qiaobian_costs(g,a),current)&&r.status==='paying';
  try{
    const result=await g.public_card_loss(a,[current],{to:'discard',visibility:'public',reason:'巧变',action:'discard',source_skill:SK.qiaobian,move_id:`${r.event_id}:cost`,validate:valid,
      on_committed:()=>{a[`skip_${phase}_stage`]=true;g.note_phase_skip?.(a,phase,'巧变',SK.qiaobian);r.paid=true;r.status='committed';}});
    if(!result?.committed){finish(a,r,'passed');return false;}if(!r.paid)throw Error('巧变缺少提交回执');
    g.view.emit(`${a.name}发动巧变，跳过${{judgment:'判定',draw:'摸牌',play:'出牌',discard:'弃牌'}[phase]}阶段。`);
    if(live(a)&&continuing(g)){
      const choice=effect??await chooseQiaobianEffect(g,a,phase,r);
      if(phase==='draw'&&!choice?.pass)await qiaobianSteal(g,a,r,choice?.targets??[]);
      if(phase==='play'&&choice?.transfer){const {from,to,material:m}=choice.transfer;
        if(sgs_qiaobian_transfer_legal(g,from,m,to)){
          requireMethods(g,['move_board_card']);await g.move_board_card(from,m,to,{move_id:`${r.event_id}:board`,reason:'巧变',source:a,source_skill:SK.qiaobian,
            validate:()=>live(a)&&continuing(g)&&sgs_qiaobian_transfer_legal(g,from,m,to),on_committed:()=>{r.board_moved=true;}});
        }
      }
    }
    finish(a,r);return true;
  }catch(error){failure(a,r,error);throw error;}
}
async function qiaobianWindow(g,a,phase,e){
  if(!sgs_qiaobian_available(g,a,phase,e))return false;
  const ai=a.is_ai?sgs_ai_qiaobian_choice(g,a,phase,e):null,k=key(g,a,eventId(e)),r=reserve(a,'qiaobian',k,{phase,phase_event_id:eventId(e),paid:false});
  try{
    if(a.is_ai){if(ai)return await sgs_resolve_qiaobian(g,a,phase,e,ai.cost,{effect:ai.effect,receipt:r});finish(a,r,'passed');return false;}
    const form=rule_hero(a)?.id,turn=g.turn_event_counter;
    while(own(g,a,SK.qiaobian)&&phaseWindow(g,a,phase,e)&&rule_hero(a)?.id===form&&g.turn_event_counter===turn){
      const options=sgs_qiaobian_costs(g,a);if(!options.length)break;
      const answer=await g.view.ask_line(`巧变：可弃置一张手牌，跳过${{judgment:'判定',draw:'摸牌',play:'出牌',discard:'弃牌'}[phase]}阶段`,{kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],meta:meta(g,a,SK.qiaobian,'qiaobian_cost',{phase,phase_event_id:eventId(e),material_zones:['hand']})});
      if(pass(answer))break;const material=select(options,answer);if(material){const result=await sgs_resolve_qiaobian(g,a,phase,e,material,{receipt:r});if(!result&&r.status==='offered')finish(a,r,'passed');return result;}
    }
    finish(a,r,'passed');return false;
  }catch(error){failure(a,r,error);throw error;}
}
export const sgs_before_judgment_qiaobian=(g,a,_target,e={})=>qiaobianWindow(g,a,'judgment',e);
export const sgs_before_draw_qiaobian=(g,a,_target,e={})=>qiaobianWindow(g,a,'draw',e);
export const sgs_before_play_qiaobian=(g,a,_target,e={})=>qiaobianWindow(g,a,'play',e);
export const sgs_before_discard_qiaobian=(g,a,_target,e={})=>qiaobianWindow(g,a,'discard',e);

export const sgs_tiaoxin_phase_key=(g,a)=>stable(a?.play_phase_id)?key(g,a,a.play_phase_id):null;
export const sgs_tiaoxin_targets=(g,a)=>g.all_players().filter(t=>t!==a&&live(t)&&g.in_actual_attack_range(t,a));
export const sgs_tiaoxin_available=(g,a)=>own(g,a,SK.tiaoxin)&&idlePlay(g,a)&&!!sgs_tiaoxin_phase_key(g,a)
  &&!a.sgs_mountain_phase_state?.tiaoxin?.[sgs_tiaoxin_phase_key(g,a)]&&sgs_tiaoxin_targets(g,a).length>0;
export function sgs_tiaoxin_unavailable_reason(g,a){if(!own(g,a,SK.tiaoxin))return '当前没有挑衅';if(!idlePlay(g,a)||!sgs_tiaoxin_phase_key(g,a))return '只能在自己的实际出牌阶段发动';if(a.sgs_mountain_phase_state?.tiaoxin?.[sgs_tiaoxin_phase_key(g,a)])return '本出牌阶段已发动挑衅';return sgs_tiaoxin_targets(g,a).length?'':'没有其他角色的实际攻击范围包含你';}
function discardOptions(g,target){return [...SLOTS.flatMap(zone=>target[zone]?[{zone,index:0,card:target[zone],id:`eq:${zone}`,label:`装备：${target[zone]}`}]:[]),
  ...target.hand.map((card,index)=>({zone:'hand',index,card,id:`hand:${index+1}`,label:`手牌${index+1}（未知）`}))].filter(m=>mayDiscard(g,target,m));}
const sameForced=(x,y)=>x?.id===y?.id&&x.zone===y.zone&&(x.zone==='multi_hand'?x.cards.length===y.cards.length&&x.cards.every((c,i)=>c===y.cards[i]):x.card===y.card&&x.index===y.index);
/** Actual out-of-turn Slash USE, including legal conversions. Commit callback,
 * never damage count or a response receipt, decides whether discard is avoided. */
async function forcedTiaoxinSha(g,a,target,r){
  requireMethods(g,['forced_sha_materials','start_card_use','end_card_use','use_sha']);
  let chosen;while(live(a)&&live(target)&&continuing(g)){
    const options=g.forced_sha_materials(target,a);if(!options.length)return false;
    if(target.is_ai){if(g.side_of(target)===g.side_of(a))return false;chosen=options[0];break;}
    const answer=await g.view.ask_line(`挑衅：可对${a.name}使用一张杀，否则其弃置你的一张手牌或装备`,{kind:'choice',player_id:seat(g,target),options:[...options.map(({id,label})=>({id,label})),{id:'refuse',label:'不使用杀'}],meta:meta(g,target,SK.tiaoxin,'tiaoxin_sha',{target_seat:seat(g,a),action_kind:'use',forced:true})});
    if(pass(answer))return false;chosen=select(options,answer);if(chosen&&g.forced_sha_materials(target,a).some(m=>sameForced(m,chosen)))break;chosen=null;
  }
  if(!chosen)return false;
  const physical=chosen.zone==='multi_hand'?chosen.cards:[chosen.card];
  const source_card=chosen.zone==='multi_hand'?g.two_card_sha(target,physical):chosen.zone==='hand'&&is_sha_card(chosen.card)?chosen.card:g.material_sha(target,chosen.card);
  const materials=physical.map(card=>chosen.zone==='multi_hand'?{zone:'hand',index:target.hand.indexOf(card),card}:{zone:chosen.zone,index:chosen.index,card});
  let history=null,used=false;
  try{
    const paid=await g.public_card_loss(target,materials,{payment:true,to:'processing',visibility:'public',reason:'挑衅·使用杀',action:'card_use',source_skill:SK.tiaoxin,move_id:`${r.event_id}:sha-material`,
      validate:()=>live(a)&&live(target)&&continuing(g)&&g.forced_sha_materials(target,a).some(m=>sameForced(m,chosen)),
      on_committed:()=>{r.sha_material_committed=true;history=g.start_card_use(target,source_card,{materials:physical,sourceZones:materials.map(m=>m.zone),provenance:{kind:source_card.virtual?'converted':'physical',source_skill:SK.tiaoxin}});}});
    if(paid?.committed&&live(a)&&live(target)&&continuing(g)&&!target.prison_no_sha&&g.can_sha_target(target,a,{allow_allies:true})&&g.in_attack_range(target,a)){
      await g.use_sha(target,a,'挑衅·杀',{source_card,forced:true,source_skill:SK.tiaoxin,skill_initiator:a,source_last_hand:materials.some(m=>m.zone==='hand')&&target.hand.length===0,
        use_provenance:{kind:source_card.virtual?'converted':'physical',physical_cards:physical},history_use_id:history?.use_id,
        on_card_use_committed:event=>{used=true;r.sha_used=true;r.card_use_id=event.card_use_id;}});
    }
  }finally{for(const card of physical)g.finish_processing_card(card);g.end_card_use(history);}
  return used;
}
async function tiaoxinDiscard(g,a,target,r){
  while(live(a)&&live(target)&&continuing(g)){
    const options=discardOptions(g,target);if(!options.length)return false;let material;
    if(a.is_ai){const equipped=options.filter(m=>m.zone!=='hand');material=equipped[0]??g.rng.choice(options);}
    else{
      const answer=await g.view.ask_line(`挑衅：弃置${target.name}的一张手牌或装备`,{kind:'choice',player_id:seat(g,a),options:options.map(({id,label})=>({id,label})),meta:meta(g,a,SK.tiaoxin,'tiaoxin_discard',{owner_seat:seat(g,target),material_zones:['hand',...SLOTS],mandatory:true,hidden_hands:true})});
      material=select(options,answer);if(!material)continue;
    }
    if(!exact(discardOptions(g,target),material))continue;r.discard_attempt=(r.discard_attempt??0)+1;
    const result=await g.public_card_loss(target,[material],{to:'discard',visibility:'public',reason:'挑衅',action:'discard',source:a,source_skill:SK.tiaoxin,move_id:`${r.event_id}:discard:${r.discard_attempt}`,
      validate:()=>live(a)&&live(target)&&continuing(g)&&!!exact(discardOptions(g,target),material),on_committed:()=>{r.discarded=true;}});
    if(result?.committed)return true;if(result?.blocked)return false;if(exact(discardOptions(g,target),material))throw Error('挑衅强制弃牌没有提交');
  }return false;
}
export async function sgs_resolve_tiaoxin(g,a,target){
  if(!sgs_tiaoxin_available(g,a)||!sgs_tiaoxin_targets(g,a).includes(target))return false;movement(g);
  const k=sgs_tiaoxin_phase_key(g,a);if(old(a,'tiaoxin',k))return false;
  const r=reserve(a,'tiaoxin',k,{target_id:identity(g,target),phase_key:k,sha_used:false});r.status='committed';
  try{g.view.emit(`${a.name}对${target.name}发动挑衅。`);const used=await forcedTiaoxinSha(g,a,target,r);if(!used)await tiaoxinDiscard(g,a,target,r);finish(a,r);return true;}
  catch(error){failure(a,r,error);throw error;}
}
/** Policy uses no target hand faces. Empty-handed targets remain human-legal. */
export function sgs_ai_tiaoxin_target(g,a){return sgs_tiaoxin_available(g,a)?sgs_tiaoxin_targets(g,a).filter(t=>g.side_of(t)!==g.side_of(a)&&(t.hand.length||SLOTS.some(s=>t[s])))
  .sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp)[0]??null:null;}
export async function sgs_ai_tiaoxin(g,a){const target=sgs_ai_tiaoxin_target(g,a);return target?sgs_resolve_tiaoxin(g,a,target):false;}
export async function sgs_player_tiaoxin(g,a){
  if(!sgs_tiaoxin_available(g,a)){g.view.emit(`挑衅：${sgs_tiaoxin_unavailable_reason(g,a)}。`);return true;}
  const phase=sgs_tiaoxin_phase_key(g,a),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  while(sgs_tiaoxin_available(g,a)&&sgs_tiaoxin_phase_key(g,a)===phase&&rule_hero(a)?.id===form&&g.turn_event_counter===turn){
    const targets=sgs_tiaoxin_targets(g,a),options=targets.map(t=>({id:seat(g,t),label:`${t.name}（其攻击范围包含你）`}));
    const answer=await g.view.ask_line('挑衅：选择一名其他角色',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消'}],meta:meta(g,a,SK.tiaoxin,'tiaoxin_target',{phase_key:phase})});
    if(pass(answer))return true;const target=targets.find(t=>seat(g,t)===select(options,answer)?.id);
    if(target&&sgs_tiaoxin_phase_key(g,a)===phase&&rule_hero(a)?.id===form&&g.turn_event_counter===turn){await sgs_resolve_tiaoxin(g,a,target);return true;}
  }return true;
}

export async function sgs_on_prepare_zhiji(g,a,_target,e={}){
  if(!own(g,a,SK.zhiji)||!prepared(g,a,e)||a.hand.length!==0)return false;
  requireMethods(g,['general_skill_binding_id','effective_max_hp','change_max_hp','acquire_general_skill']);
  const binding=g.general_skill_binding_id(a,SK.zhiji);if(!stable(binding))throw Error('志继缺少稳定角色技能绑定');
  const k=key(g,a,binding);if(old(a,'zhiji',k))return false;
  if(g.effective_max_hp(a)<=1)throw Object.assign(Error('志继当前体力上限不超过1；该未认证边界不自动结算。'),{code:'SGS_MOUNTAIN_LOW_MAX_HP_UNSUPPORTED'});
  const form=rule_hero(a)?.id,turn=g.turn_event_counter,r=reserve(a,'zhiji',k,{binding_id:binding,phase_event_id:eventId(e),awakened:false});
  const valid=()=>own(g,a,SK.zhiji)&&prepared(g,a,e)&&a.hand.length===0&&rule_hero(a)?.id===form&&g.turn_event_counter===turn&&g.general_skill_binding_id(a,SK.zhiji)===binding;
  try{
    let choice;
    while(valid()){
      const wounded=a.hp<g.effective_max_hp(a),options=[{id:'recover',label:'先回复1点体力',disabled:!wounded,reason:wounded?'':'当前体力已满，不能选择回复'},{id:'draw',label:'先摸2张牌'}];
      if(a.is_ai)choice=wounded&&a.hp<=2?'recover':'draw';
      else choice=select(options,await g.view.ask_line('志继：必须选择一项，然后减少1点体力上限并获得观星',{kind:'choice',player_id:seat(g,a),options,meta:meta(g,a,SK.zhiji,'zhiji_choice',{mandatory:true,recovery_available:wounded,order:['choice_effect','max_hp_loss','acquire_guanxing']})}))?.id;
      if(!choice)continue;if(!valid())break;if(choice==='recover'&&a.hp>=g.effective_max_hp(a))continue;
      if(g.effective_max_hp(a)<=1)throw Object.assign(Error('志继体力上限已改变，无法安全觉醒。'),{code:'SGS_MOUNTAIN_LOW_MAX_HP_UNSUPPORTED'});
      r.status='committed';r.awakened=true;r.choice=choice;
      g.commit_general_skill_resolution?.(a,{event_id:r.event_id,source_skill:SK.zhiji});
      if(choice==='recover')await g.recover_hp(a,1,{recovery_event_id:`${r.event_id}:recover`,source_skill:SK.zhiji,reason:'志继'});else await g.draw_cards(a,2);
      if(live(a)&&continuing(g)){
        await g.change_max_hp(a,-1,{event_id:`${r.event_id}:maxhp`,source_skill:SK.zhiji,minimum:1});
        if(live(a)&&continuing(g))await g.acquire_general_skill(a,SK.guanxing,{event_id:`${r.event_id}:grant`,source_skill:SK.zhiji});
      }
      finish(a,r);g.view.emit(`${a.name}发动志继，${choice==='recover'?'先回复1点体力':'先摸2张牌'}，然后体力上限减少1并获得观星。`);return true;
    }
    // No awakening committed, so a later genuine preparation may try again.
    delete state(a).zhiji[k];active.get(a)?.delete(r);return false;
  }catch(error){failure(a,r,error);throw error;}
}
function deckPermutation(cards,top,bottom){return Array.isArray(top)&&Array.isArray(bottom)&&top.length+bottom.length===cards.length&&new Set([...top,...bottom]).size===cards.length&&[...top,...bottom].every(c=>cards.includes(c));}
export async function sgs_on_prepare_guanxing(g,a,_target,e={}){
  if(!own(g,a,SK.guanxing)||!prepared(g,a,e))return false;
  const k=key(g,a,eventId(e));if(old(a,'guanxing',k))return false;
  const r=reserve(a,'guanxing',k,{phase_event_id:eventId(e),viewed:false}),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const valid=()=>own(g,a,SK.guanxing)&&prepared(g,a,e)&&rule_hero(a)?.id===form&&g.turn_event_counter===turn;
  try{
    if(!a.is_ai&&!await g.view.ask_confirm('观星：是否私下观看并调整牌堆顶的牌？',{player_id:seat(g,a),meta:meta(g,a,SK.guanxing,'guanxing_offer',{count:Math.min(5,g.all_players().filter(live).length)})})){finish(a,r,'passed');return false;}
    if(!valid()){finish(a,r,'passed');return false;}
    const count=Math.min(5,g.all_players().filter(live).length),cards=g.deck.draw(count);
    if(cards.some(c=>!c||c.virtual)||new Set(cards).size!==cards.length)throw Error('观星牌堆包含无效实体');
    g.processing_cards.push(...cards);r.viewed=true;r.status='ordering';r.requested_count=count;r.actual_count=cards.length;
    let top=[],bottom=[],remaining=[...cards],tray='top';
    if(a.is_ai){top=[...cards];remaining=[];}
    while(remaining.length&&valid()){
      const options=remaining.map(card=>({id:`card:${cards.indexOf(card)+1}`,label:String(card),card}));
      const controls=tray==='top'?[{id:'bottom',label:'其余放到底部，开始安排底部顺序'}]:[];
      const answer=await g.view.ask_line(`观星：选择下一张${tray==='top'?'置于顶部（最先摸到）':'置于底部（其余牌后先摸到）'}的牌`,{kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),...controls,{id:'unchanged',label:'保持原顺序放回顶部'}],
        meta:meta(g,a,SK.guanxing,'guanxing_order',{phase_event_id:eventId(e),tray,count:cards.length,preview:cards.map((card,index)=>({id:index+1,label:String(card)})),selected_top:top.map(c=>cards.indexOf(c)+1),selected_bottom:bottom.map(c=>cards.indexOf(c)+1),next_draw_direction:'first_selected',private_cards:true})});
      if(answer==='unchanged'||pass(answer)){top=[...cards];bottom=[];remaining=[];break;}
      if(answer==='bottom'&&tray==='top'){tray='bottom';continue;}
      const chosen=select(options,answer);if(chosen){(tray==='top'?top:bottom).push(chosen.card);remaining.splice(remaining.indexOf(chosen.card),1);}
    }
    if(remaining.length||!valid()){top=[...cards];bottom=[];}
    if(!deckPermutation(cards,top,bottom)||cards.some(c=>g.processing_cards.filter(v=>v===c).length!==1))throw Error('观星实体或排列在选择期间已改变，须重放事务');
    // One synchronous reorder; no gain/discard/use event and no public faces.
    for(const card of cards)g.processing_cards.splice(g.processing_cards.indexOf(card),1);
    g.deck.draw_pile.unshift(...[...bottom].reverse());g.deck.draw_pile.push(...[...top].reverse());
    for(const card of cards)g.copied_card_moved?.(card,'draw_pile');
    r.top_count=top.length;r.bottom_count=bottom.length;finish(a,r);
    g.view.emit(`${a.name}发动观星，将${top.length}张牌置于牌堆顶、${bottom.length}张置于牌堆底。`);return true;
  }catch(error){failure(a,r,error);throw error;}
}
export async function sgs_on_prepare_jiangwei(g,a,target,e={}){await sgs_on_prepare_zhiji(g,a,target,e);return sgs_on_prepare_guanxing(g,a,target,e);}

export function sgs_mountain_phase_skill_definitions({SkillHooks,ActiveSkillDef}){
  const tiaoxin=new ActiveSkillDef({skill_id:SK.tiaoxin,hotkey:'q',button_label:'挑衅',available:sgs_tiaoxin_available,player:sgs_player_tiaoxin,ai:sgs_ai_tiaoxin,
    help_text:'挑衅：每实际出牌阶段一次，选择攻击范围包含你的另一名角色；其可对你使用一张杀，否则你弃置其一张手牌或装备。杀被闪避也不再弃牌。'});
  tiaoxin.source_skill_id=SK.tiaoxin;tiaoxin.owns_target_selection=true;tiaoxin.targets=sgs_tiaoxin_targets;tiaoxin.unavailable_reason=sgs_tiaoxin_unavailable_reason;
  return {hooks:{[ID.zhanghe]:SkillHooks({before_judgment_phase:[sgs_before_judgment_qiaobian],before_draw_phase:[sgs_before_draw_qiaobian],before_play_phase:[sgs_before_play_qiaobian],before_discard_phase:[sgs_before_discard_qiaobian]}),
    [ID.jiangwei]:SkillHooks({on_prepare:[sgs_on_prepare_jiangwei]})},active:{[ID.jiangwei]:[tiaoxin]},granted_hooks:{[SK.guanxing]:SkillHooks({on_prepare:[sgs_on_prepare_guanxing]})}};
}
