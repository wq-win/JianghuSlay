/** Mainland-mobile base 身份 鲁肃 / 孙坚, catalog snapshot 2026-10-15.
 * F1–F4 are explicit host-composition policies, NOT current-client rulings.
 * The complete source packet and integration boundaries live in
 * docs/sgs-forest/support-integration-contract.md. */
import {rule_hero} from './effective-hero.js';

export const SGS_FOREST_SUPPORT_RULE_IDS=Object.freeze({lusu:'sgs.adapted.base.hero.lu-su',sunjian:'sgs.adapted.base.hero.sun-jian'});
export const SGS_FOREST_SUPPORT_SKILL_IDS=Object.freeze({haoshi:'sgs.haoshi',dimeng:'sgs.dimeng',yinghun:'sgs.yinghun'});
export const SGS_FOREST_SUPPORT_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_rules_verified:false,current_client_hp_verified:false,source_only_exact_for_every_edge:false,
  host_policy_ids:Object.freeze(['F1','F2','F3','F4']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_FOREST_SUPPORT_RULE_IDS.lusu,max_hp:3,starting_hp:3,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.haoshi','sgs.dimeng']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FOREST_SUPPORT_RULE_IDS.sunjian,max_hp:4,starting_hp:4,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.yinghun']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-49.html','https://www.sanguosha.cn/pc/hero-detail-44.html',
    'https://wiki.biligame.com/msgs/index.php?title=鲁肃&oldid=33820','https://wiki.biligame.com/msgs/index.php?title=孙坚&oldid=34810',
    'https://www.sanguosha.com/news/20140528_6674_0611']),
});
const ID=SGS_FOREST_SUPPORT_RULE_IDS,SK=SGS_FOREST_SUPPORT_SKILL_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const live=p=>Boolean(p?.alive&&!p.dead&&p.hp>0);
const own=(a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&((a.effective_skill_ids??rule_hero(a)?.skill_ids)?.includes(skill)??rule_hero(a)?.id===ID[skill===SK.yinghun?'sunjian':'lusu']);
const seat=(g,a)=>g.seat_of(a),identity=(g,a)=>g.player_id?.(a)??seat(g,a);
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const continuing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
const missingHP=(g,a)=>Math.max(0,maxHP(g,a)-a.hp);
const others=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&o.id===m.id);
const key=(g,a,id)=>JSON.stringify([identity(g,a),id]);
const active=new WeakMap();
const replayError=()=>Object.assign(Error('林武将技能事务中断；请从原动作日志重放，不能重复摸牌或支付。'),{code:'SGS_FOREST_SUPPORT_REPLAY_REQUIRED'});
function state(a){
  const s=a.sgs_forest_support_state??={version:1,counter:0,haoshi:{},dimeng:{},yinghun:{},exchanges:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['haoshi','dimeng','yinghun','exchanges'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS forest support state');
  return s;
}
export const sgs_clone_forest_support_state=a=>a.sgs_forest_support_state?JSON.parse(JSON.stringify(state(a))):null;
function enter(a,receipt){let set=active.get(a);if(!set)active.set(a,set=new Set());set.add(receipt);}
function leave(a,receipt){active.get(a)?.delete(receipt);}
function prior(a,namespace,k){
  const r=state(a)[namespace][k];
  if(r&&!['done','passed','awaiting_draw'].includes(r.status)&&!active.get(a)?.has(r))throw replayError();
  return r;
}
function reserve(a,namespace,k,data){
  const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('林武将技能计数器已耗尽');
  const r=s[namespace][k]={event_id:`forest:${namespace}:${k}:${++s.counter}`,status:'offered',...data};enter(a,r);return r;
}
function finish(a,r,status='done'){r.status=status;leave(a,r);}
function fail(a,r,error){r.status='failed';r.error=String(error?.message??error);leave(a,r);}
function movement(g){if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('林武将需要 public_card_loss 的 validate / on_committed 原子边界');}
function promptMeta(g,a,skill,stage,extra={}){return {skill:{[SK.haoshi]:'好施',[SK.dimeng]:'缔盟',[SK.yinghun]:'英魂'}[skill],skill_id:skill,stage,private_to:seat(g,a),...extra};}
export const sgs_forest_discard_materials=(g,a,options={})=>live(a)?g.skill_material_options(a,options).filter(m=>m.card&&!m.card.virtual&&(m.zone==='hand'||SLOTS.includes(m.zone))
  &&(typeof g.can_discard_material!=='function'||g.can_discard_material(a,m)!==false)
  &&(typeof g.can_discard_card!=='function'||g.can_discard_card(a,m.card,{zone:m.zone,reason:'技能弃牌'})!==false)):[];
const handMaterials=(g,a)=>g.skill_material_options(a).filter(m=>m.zone==='hand'&&m.card&&!m.card.virtual);
function parseMaterials(options,value,count){
  const tokens=String(value).trim().split(/[\s,，]+/).filter(Boolean),selected=tokens.map(v=>select(options,v));
  return tokens.length===count&&selected.every(Boolean)&&new Set(selected.map(m=>m.card)).size===count?selected:null;
}
/** Mandatory payments never offer cancel; a target controls its own discard. */
async function chooseMaterials(g,a,options,count,skill,stage,{mandatory=false,...extra}={}){
  if(count===0)return [];
  if(!Number.isSafeInteger(count)||count<0||options.length<count)throw Error('技能选牌数量或实体牌区域无效');
  if(a.is_ai)return [...options].sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y)).slice(0,count);
  while(live(a)&&continuing(g)){
    const answer=await g.view.ask_line(`${{[SK.haoshi]:'好施',[SK.dimeng]:'缔盟',[SK.yinghun]:'英魂'}[skill]}：选择${count}张牌${mandatory?'（必须完成）':'，或取消'}`,{
      kind:'select_hand',player_id:seat(g,a),min_count:count,max_count:count,
      options:[...options.map(({id,label})=>({id,label})),...mandatory?[]:[{id:'cancel',label:'取消，不支付'}]],
      meta:promptMeta(g,a,skill,stage,{mandatory,material_zones:[...new Set(options.map(m=>m.zone))],...extra}),
    });
    if(!mandatory&&pass(answer))return null;
    const chosen=parseMaterials(options,answer,count);if(chosen)return chosen;
    g.view.emit(`必须选择${count}张不同的合法牌。`,{private_to:seat(g,a)});
  }
  return null;
}
const phaseWindow=(g,a,phase)=>live(a)&&continuing(g)&&g.actual_turn_active!==false&&g.turn_phase===phase&&g.turn_actor===seat(g,a);
const drawId=e=>e?.draw_event_id??e?.event_id;
const normalDraw=(g,a,e)=>phaseWindow(g,a,'draw')&&stable(drawId(e))&&e.normal_draw===true&&!e.skipped&&!e.replaced&&!e.cancelled;

/** Invoke only after draw replacements have declined, BEFORE normal draw. */
export async function sgs_before_normal_draw_haoshi(g,a,_fallback,count,event={}){
  if(!own(a,SK.haoshi)||!normalDraw(g,a,event))return count;
  if(!Number.isSafeInteger(count)||count<0)throw Error('好施普通摸牌数量必须为非负整数');
  const k=key(g,a,drawId(event)),old=prior(a,'haoshi',k);
  if(old){if(old.base_count!==count)throw Error('同一好施摸牌事件的原数量已改变');return old.accepted?old.base_count+2:old.base_count;}
  const r=reserve(a,'haoshi',k,{draw_event_id:drawId(event),base_count:count,accepted:false}),form=rule_hero(a)?.id;
  try{
    const accepted=a.is_ai||await g.view.ask_confirm(`好施：本次普通摸牌多摸2张；摸完后手牌超过5，必须将一半（向下取整）交给手牌最少的其他角色。`,{
      player_id:seat(g,a),meta:promptMeta(g,a,SK.haoshi,'haoshi_offer',{draw_event_id:drawId(event),base_count:count,extra_count:2}),
    });
    if(!accepted||!own(a,SK.haoshi)||rule_hero(a)?.id!==form||!normalDraw(g,a,event)){finish(a,r,'passed');return count;}
    r.accepted=true;finish(a,r,'awaiting_draw');return count+2;
  }catch(error){fail(a,r,error);throw error;}
}
export function sgs_haoshi_recipients(g,a){
  const targets=others(g,a);if(!targets.length)return [];
  const minimum=Math.min(...targets.map(p=>p.hand.length));return targets.filter(p=>p.hand.length===minimum);
}
export function sgs_ai_haoshi_recipient(g,a){
  return sgs_haoshi_recipients(g,a).sort((x,y)=>Number(g.side_of(y)===g.side_of(a))-Number(g.side_of(x)===g.side_of(a))||x.hp-y.hp)[0]??null;
}
/** Whole draw and its nested gains MUST have settled. Accepted mandatory
 * transfer survives form loss, but cannot move cards of a finalized corpse. */
export async function sgs_after_normal_draw_haoshi(g,a,_fallback,event={}){
  if(!stable(drawId(event))||event.completed!==true||event.normal_draw!==true||event.skipped||event.replaced||event.cancelled)return false;
  const k=key(g,a,drawId(event)),r=prior(a,'haoshi',k);
  if(!r?.accepted||r.status!=='awaiting_draw')return false;
  movement(g);enter(a,r);r.status='resolving';
  try{
    while(live(a)&&continuing(g)&&a.hand.length>5){
      const count=Math.floor(a.hand.length/2),targets=sgs_haoshi_recipients(g,a);if(!targets.length)break;
      const before=a.hand.length;let recipient;
      if(a.is_ai)recipient=sgs_ai_haoshi_recipient(g,a);
      else{
        const options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${p.hand.length}张手牌，并列最少可选）`}));
        const answer=await g.view.ask_line(`好施：必须将${count}张手牌交给一名手牌最少的其他角色`,{
          kind:'choice',player_id:seat(g,a),options,meta:promptMeta(g,a,SK.haoshi,'haoshi_target',{mandatory:true,count,minimum_hand:targets[0].hand.length,draw_event_id:drawId(event)}),
        });
        recipient=targets.find(p=>seat(g,p)===select(options,answer)?.id);if(!recipient)continue;
      }
      const choices=await chooseMaterials(g,a,handMaterials(g,a),count,SK.haoshi,'haoshi_cards',{mandatory:true,recipient_seat:seat(g,recipient),draw_event_id:drawId(event)});
      if(!choices)break;
      const valid=()=>live(a)&&live(recipient)&&continuing(g)&&a.hand.length===before&&sgs_haoshi_recipients(g,a).includes(recipient)
        &&choices.every(m=>exact(handMaterials(g,a),m));
      if(!valid())continue;
      r.attempt=(r.attempt??0)+1;
      const moved=await g.public_card_loss(a,choices,{to:'hand',recipient,visibility:'private',reason:'好施',action:'give',source_skill:SK.haoshi,
        move_id:`${r.event_id}:give:${r.attempt}`,validate:valid,on_committed:(cards,m)=>{r.transfer_committed=true;r.transferred=cards.length;r.recipient_id=identity(g,recipient);r.move_id=m.move_id;},
      });
      if(moved?.committed){g.view.emit(`${a.name}发动好施，将${count}张手牌交给${recipient.name}。`);finish(a,r);return true;}
      if(valid())throw Error('好施实体牌事务未提交；禁止跳过强制交牌');
    }
    finish(a,r);return false;
  }catch(error){fail(a,r,error);throw error;}
}

export const sgs_dimeng_phase_key=(g,a)=>stable(a?.play_phase_id??g.play_phase_event_counter)?key(g,a,a.play_phase_id??g.play_phase_event_counter):null;
const idlePlay=(g,a)=>own(a,SK.dimeng)&&phaseWindow(g,a,'play')&&g.is_own_play_phase(a)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
export function sgs_dimeng_pairs(g,a){
  const targets=others(g,a),available=sgs_forest_discard_materials(g,a).length,pairs=[];
  for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++){
    const first=targets[i],second=targets[j],cost=Math.abs(first.hand.length-second.hand.length);
    if(cost<=available)pairs.push({targets:[first,second],cost,id:`${seat(g,first)}+${seat(g,second)}`});
  }
  return pairs;
}
export function sgs_dimeng_available(g,a){
  const k=sgs_dimeng_phase_key(g,a);return idlePlay(g,a)&&!!k&&!a.sgs_forest_support_state?.dimeng?.[k]&&sgs_dimeng_pairs(g,a).length>0;
}
export function sgs_dimeng_unavailable_reason(g,a){
  if(!own(a,SK.dimeng))return '当前没有可用的缔盟技能';
  if(!idlePlay(g,a)||!sgs_dimeng_phase_key(g,a))return '只能在自己的空闲出牌阶段发动';
  if(a.sgs_forest_support_state?.dimeng?.[sgs_dimeng_phase_key(g,a)])return '本出牌阶段已发动缔盟';
  if(others(g,a).length<2)return '需要两名其他存活角色；1对1没有合法目标组合';
  return sgs_dimeng_pairs(g,a).length?'':'没有能支付手牌数差的目标组合';
}
function physicalUnique(g,cards){
  const present=[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),
    ...g.all_players().flatMap(p=>[...p.hand,...(p.judgment_cards??[]),...SLOTS.map(s=>p[s]).filter(Boolean)])];
  const id=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
  return new Set(cards).size===cards.length&&cards.every(c=>c&&!c.virtual&&present.filter(x=>x===c||id(c)!==null&&id(x)===id(c)).length===1);
}
/** F3 atomic host policy: BOTH old packets leave and BOTH new packets arrive
 * synchronously before any trigger. Loss snapshots have hand_after:0 even when
 * the opposite packet is nonempty; subsequent 连营 draws stay with that holder.
 * No face is logged, no private exchange poison loss, no borrowed virtual shell. */
export async function sgs_exchange_dimeng_hands(g,a,first,second,eventId){
  if(!stable(eventId))throw Error('缔盟交换需要稳定事件ID');
  const k=key(g,a,eventId),old=prior(a,'exchanges',k);
  if(old){if(old.targets.join('|')!==[identity(g,first),identity(g,second)].join('|'))throw Error('同一缔盟交换不能替换目标');return false;}
  if(first===second||first===a||second===a||!g.all_players().includes(first)||!g.all_players().includes(second)||!live(first)||!live(second)||!continuing(g))return false;
  for(const name of ['after_cards_lost','equipment_after_cards_lost','card_history_material_id'])if(typeof g[name]!=='function')throw Error(`缔盟完整原子交换缺少 ${name}`);
  const packets=[{owner:first,recipient:second,cards:[...first.hand]},{owner:second,recipient:first,cards:[...second.hand]}];
  if(!physicalUnique(g,packets.flatMap(p=>p.cards)))throw Error('缔盟交换实体牌不唯一或包含虚拟牌');
  const r=reserve(a,'exchanges',k,{targets:[identity(g,first),identity(g,second)],packet_ids:packets.map(p=>p.cards.map(c=>g.card_history_material_id(c))),committed:false});
  try{
    for(const p of packets){p.materials=p.cards.map((card,index)=>({zone:'hand',index,card}));p.materials=g.capture_card_action_faces?.(p.owner,p.materials,{action:'give',to:'hand',move_id:eventId})??p.materials;}
    // Deliberately no callback or await inside this transaction.
    first.hand.splice(0,first.hand.length,...packets[1].cards);
    second.hand.splice(0,second.hand.length,...packets[0].cards);
    r.committed=true;r.status='committed';for(const p of packets)p.hand_after_receive=p.owner.hand.length;
    for(const p of packets)for(const c of p.cards)g.copied_card_moved?.(c,'hand',p.recipient);
    const context={move_id:eventId,committed:true,atomic_complete:true,to:'hand',visibility:'private',reason:'缔盟',action:'exchange',source:a,source_skill:SK.dimeng,source_zone:'player',poison_exempt:true};
    for(const p of packets)if(p.cards.length)await g.after_cards_lost(p.owner,{...context,owner:p.owner,recipient:p.recipient,hand_before:p.cards.length,hand_after:0,hand_after_receive:p.hand_after_receive,materials:p.materials});
    for(const p of packets)if(p.cards.length)await g.equipment_after_cards_lost(p.owner,p.cards,{...context,recipient:p.recipient,zones:p.cards.map(()=>'hand')});
    for(const p of packets)if(p.cards.length&&!p.recipient.dead)await g.on_cards_obtained?.(p.recipient,p.cards,{...context,source:p.owner,recipient:p.recipient,destination:'hand'});
    finish(a,r);return true;
  }catch(error){fail(a,r,error);throw error;}
}
export async function sgs_resolve_dimeng(g,a,targets,materials=[]){
  if(!sgs_dimeng_available(g,a)||!Array.isArray(targets)||targets.length!==2||targets[0]===targets[1])return false;
  const [first,second]=targets;if(!others(g,a).includes(first)||!others(g,a).includes(second))return false;
  const x=Math.abs(first.hand.length-second.hand.length),options=sgs_forest_discard_materials(g,a);
  if(!Array.isArray(materials)||materials.length!==x||new Set(materials.map(m=>m.card)).size!==x||materials.some(m=>!exact(options,m)))return false;
  movement(g);const k=sgs_dimeng_phase_key(g,a),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const r=reserve(a,'dimeng',k,{phase_key:k,targets:targets.map(t=>identity(g,t)),cost:x,paid:false});
  const valid=()=>idlePlay(g,a)&&sgs_dimeng_phase_key(g,a)===k&&g.turn_event_counter===turn&&rule_hero(a)?.id===form&&live(first)&&live(second)
    &&Math.abs(first.hand.length-second.hand.length)===x&&materials.every(m=>exact(sgs_forest_discard_materials(g,a),m))&&r.status==='offered';
  try{
    if(x){
      const moved=await g.public_card_loss(a,materials,{payment:true,to:'discard',visibility:'public',reason:'缔盟',action:'discard',source_skill:SK.dimeng,
        move_id:`${r.event_id}:cost`,validate:valid,on_committed:(cards,m)=>{if(cards.length!==x)throw Error('缔盟支付数量错误');r.paid=true;r.status='committed';r.move_id=m.move_id;},
      });
      if(!moved?.committed){delete state(a).dimeng[k];leave(a,r);return false;}
      if(!r.paid)throw Error('缔盟缺少支付提交回执');
    }else{if(!valid()){delete state(a).dimeng[k];leave(a,r);return false;}r.paid=true;r.status='committed';}
    // Nested costs finish first. Never recalculate X or refund a committed use.
    if(live(first)&&live(second)&&continuing(g))r.exchanged=await sgs_exchange_dimeng_hands(g,a,first,second,`${r.event_id}:exchange`);
    else r.exchanged=false;
    finish(a,r);g.view.emit(`${a.name}发动缔盟，弃置${x}张牌${r.exchanged?`，令${first.name}与${second.name}交换手牌`:'；目标已失效，未交换手牌'}。`);return true;
  }catch(error){fail(a,r,error);throw error;}
}
/** Uses only own material faces, public hand COUNTS/teams/HP. */
export function sgs_ai_dimeng_choice(g,a){
  if(!sgs_dimeng_available(g,a))return null;
  const choices=sgs_dimeng_pairs(g,a).map(p=>{
    const [x,y]=p.targets,alliedX=g.side_of(x)===g.side_of(a),alliedY=g.side_of(y)===g.side_of(a);
    return {...p,benefit:alliedX===alliedY?0:alliedX?y.hand.length-x.hand.length:x.hand.length-y.hand.length};
  }).filter(p=>p.benefit>0).sort((x,y)=>y.benefit-x.benefit||x.cost-y.cost);
  const chosen=choices[0];if(!chosen)return null;
  return {...chosen,materials:sgs_forest_discard_materials(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y)).slice(0,chosen.cost)};
}
export async function sgs_ai_dimeng(g,a){const c=sgs_ai_dimeng_choice(g,a);return c?sgs_resolve_dimeng(g,a,c.targets,c.materials):false;}
export async function sgs_player_dimeng(g,a){
  if(!sgs_dimeng_available(g,a)){g.view.emit(`缔盟：${sgs_dimeng_unavailable_reason(g,a)}。`);return true;}
  const phase=sgs_dimeng_phase_key(g,a),turn=g.turn_event_counter,form=rule_hero(a)?.id;
  const valid=()=>sgs_dimeng_available(g,a)&&sgs_dimeng_phase_key(g,a)===phase&&g.turn_event_counter===turn&&rule_hero(a)?.id===form;
  while(valid()){
    const pairs=sgs_dimeng_pairs(g,a),options=pairs.map(p=>({id:p.id,label:`${p.targets.map(t=>`${t.name}（${t.hand.length}张手牌）`).join(' ↔ ')}；弃${p.cost}张牌`}));
    const answer=await g.view.ask_line('缔盟：选择两名其他角色交换手牌',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不支付'}],meta:promptMeta(g,a,SK.dimeng,'dimeng_targets',{phase_key:phase,exact_target_count:2,hidden_hands:true}),
    });
    if(pass(answer))return true;const pair=pairs.find(p=>p.id===select(options,answer)?.id);if(!pair)continue;
    const materials=await chooseMaterials(g,a,sgs_forest_discard_materials(g,a),pair.cost,SK.dimeng,'dimeng_cost',{phase_key:phase});if(!materials)return true;
    if(pair.cost===0&&!await g.view.ask_confirm('缔盟：两名目标手牌数相同，无需弃牌，确认交换？',{
      player_id:seat(g,a),meta:promptMeta(g,a,SK.dimeng,'dimeng_zero_confirm',{cost_count:0,phase_key:phase}),
    }))return true;
    if(valid()&&pair.cost===Math.abs(pair.targets[0].hand.length-pair.targets[1].hand.length))await sgs_resolve_dimeng(g,a,pair.targets,materials);
    return true;
  }
  return true;
}

const prepareId=e=>e?.phase_event_id??e?.event_id;
export function sgs_ai_yinghun_choice(g,a){
  const targets=others(g,a),allies=targets.filter(t=>g.side_of(t)===g.side_of(a)).sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp);
  if(allies.length)return {target:allies[0],branch:'draw_x'};
  const target=targets.filter(t=>g.side_of(t)!==g.side_of(a)).sort((x,y)=>y.hand.length-x.hand.length||x.hp-y.hp)[0];
  return target?{target,branch:'discard_x'}:null;
}
/** Exactly one genuine preparation entry. The TARGET controls mandatory own
 * H/E discard AFTER normal draw events; X is frozen before that draw. */
export async function sgs_on_prepare_yinghun(g,a,_fallback,event={}){
  if(!own(a,SK.yinghun)||!phaseWindow(g,a,'prepare')||!stable(prepareId(event))||event.skipped||event.cancelled||missingHP(g,a)<=0||!others(g,a).length)return false;
  const k=key(g,a,prepareId(event));if(prior(a,'yinghun',k))return false;
  movement(g);const r=reserve(a,'yinghun',k,{phase_event_id:prepareId(event),accepted:false}),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const valid=()=>own(a,SK.yinghun)&&phaseWindow(g,a,'prepare')&&rule_hero(a)?.id===form&&g.turn_event_counter===turn&&missingHP(g,a)>0;
  try{
    let choice;
    if(a.is_ai)choice=sgs_ai_yinghun_choice(g,a);
    else{
      while(valid()&&!choice){
        const targets=others(g,a),options=targets.map(t=>({id:seat(g,t),label:`${t.name}（${t.hand.length}张手牌，${t.hp}体力）`}));
        const answer=await g.view.ask_line(`英魂：选择另一名角色（已损失${missingHP(g,a)}体力），或不发动`,{
          kind:'choice',player_id:seat(g,a),options:[...options,{id:'pass',label:'不发动'}],meta:promptMeta(g,a,SK.yinghun,'yinghun_target',{phase_event_id:prepareId(event),missing_hp:missingHP(g,a)}),
        });
        if(pass(answer)){finish(a,r,'passed');return false;}
        const target=targets.find(t=>seat(g,t)===select(options,answer)?.id);if(target)choice={target};
      }
      while(valid()&&choice&&!choice.branch){
        const x=missingHP(g,a),options=[{id:'draw_x',label:`令其摸${x}张牌，然后弃1张`},{id:'discard_x',label:`令其摸1张牌，然后弃${x}张`}];
        const answer=await g.view.ask_line('英魂：由你选择效果，目标随后自己选择弃牌',{
          kind:'choice',player_id:seat(g,a),options:[...options,{id:'pass',label:'取消，不发动'}],meta:promptMeta(g,a,SK.yinghun,'yinghun_branch',{phase_event_id:prepareId(event),target_seat:seat(g,choice.target),missing_hp:x}),
        });
        if(pass(answer)){finish(a,r,'passed');return false;}
        choice.branch=select(options,answer)?.id;
      }
    }
    if(!choice||!valid()||!live(choice.target)||choice.target===a){finish(a,r,'passed');return false;}
    const target=choice.target,x=missingHP(g,a);Object.assign(r,{accepted:true,status:'drawing',target_id:identity(g,target),branch:choice.branch,x});
    r.draw_count=choice.branch==='draw_x'?x:1;r.discard_count=choice.branch==='draw_x'?1:x;
    await g.draw_cards(target,r.draw_count);
    r.status='discarding';
    while(live(target)&&continuing(g)){
      const options=sgs_forest_discard_materials(g,target,{payment:false}),count=Math.min(r.discard_count,options.length);
      if(!count){r.discarded=0;break;}
      const selected=options.length<=r.discard_count?options:await chooseMaterials(g,target,options,count,SK.yinghun,'yinghun_discard',{mandatory:true,locked_x:x,owner_seat:seat(g,a),phase_event_id:prepareId(event)});
      if(!selected)break;
      const validDiscard=(allowed=selected,guard=null)=>live(target)&&continuing(g)&&(guard?.blocked_materials.length||Math.min(r.discard_count,sgs_forest_discard_materials(g,target,{payment:false}).length)===count)&&allowed.every(m=>exact(sgs_forest_discard_materials(g,target,{payment:false}),m));
      if(!validDiscard())continue;
      r.attempt=(r.attempt??0)+1;
      const result=await g.public_card_loss(target,selected,{to:'discard',visibility:'public',reason:'英魂',action:'discard',source:a,source_skill:SK.yinghun,
        move_id:`${r.event_id}:discard:${r.attempt}`,validate:validDiscard,on_committed:cards=>{r.discarded=cards.length;r.discard_committed=true;},
      });
      if(result?.committed||result?.blocked){r.discarded??=0;break;}
      if(validDiscard())throw Error('英魂实体牌事务未提交；禁止跳过强制弃牌');
    }
    finish(a,r);g.view.emit(`${a.name}发动英魂，令${target.name}摸${r.draw_count}张牌，然后弃${r.discarded??0}张牌（X=${x}）。`);return true;
  }catch(error){fail(a,r,error);throw error;}
}

export function sgs_forest_support_skill_definitions({SkillHooks,ActiveSkillDef}){
  const dimeng=new ActiveSkillDef({skill_id:SK.dimeng,hotkey:'q',button_label:'缔盟',available:sgs_dimeng_available,player:sgs_player_dimeng,ai:sgs_ai_dimeng,
    help_text:'缔盟：每出牌阶段一次，选择两名其他角色，弃置与双方手牌数之差相等的手牌/装备（可为0），然后交换全部手牌；1对1无合法目标。'});
  dimeng.owns_target_selection=true;dimeng.targets=(g,a)=>others(g,a);dimeng.unavailable_reason=sgs_dimeng_unavailable_reason;
  return {hooks:{
    [ID.lusu]:SkillHooks({before_normal_draw:[sgs_before_normal_draw_haoshi],after_normal_draw:[sgs_after_normal_draw_haoshi]}),
    [ID.sunjian]:SkillHooks({on_prepare:[sgs_on_prepare_yinghun]}),
  },active:{[ID.lusu]:[dimeng]}};
}
