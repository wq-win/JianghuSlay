/** Mainland-mobile base 身份 徐盛 / 陈宫, catalog snapshot 2026-10-15.
 * Explicit host composition, not current-client certification. Physical Pojun
 * piles and unconditional turn-finally obligations are owned by the host. */
import {Card, CardType, is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_COMBAT_RULE_IDS = Object.freeze({
  xusheng:'sgs.adapted.base.hero.xu-sheng', chengong:'sgs.adapted.base.hero.chen-gong',
});
export const SGS_YIJIANG_COMBAT_SKILL_IDS = Object.freeze({pojun:'sgs.pojun', mingce:'sgs.mingce', zhichi:'sgs.zhichi'});
export const SGS_YIJIANG_COMBAT_SOURCE = Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15', selected_mode:'身份', snapshot_date:'2026-10-15',
  current_client_rules_verified:false, current_client_hp_verified:false, initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['Y0','Y1','Y7','Y8','Y9','Y10','Y11','Y12','Y13']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_YIJIANG_COMBAT_RULE_IDS.xusheng,name:'徐盛',max_hp:4,starting_hp:4,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.pojun']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_YIJIANG_COMBAT_RULE_IDS.chengong,name:'陈宫',max_hp:3,starting_hp:3,gender:'male',source_faction:'群',skill_ids:Object.freeze(['sgs.mingce','sgs.zhichi']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-108.html','https://www.sanguosha.cn/index.php/pc/guide-info-79.html',
    'https://www.sanguosha.cn/pc/hero-detail-103.html','https://wiki.biligame.com/msgs/徐盛','https://wiki.biligame.com/msgs/陈宫']),
});
const ID=SGS_YIJIANG_COMBAT_RULE_IDS, SK=SGS_YIJIANG_COMBAT_SKILL_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const EQUIPMENT_TYPES=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const NAMES=Object.freeze({[SK.pojun]:'破军',[SK.mingce]:'明策',[SK.zhichi]:'智迟'});
const live=a=>Boolean(a?.alive&&!a.dead&&a.hp>0);
const stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
const seat=(g,a)=>g.seat_of(a), pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const turnId=g=>g.turn_event_counter;
const phaseId=(g,a)=>a.play_phase_id??g.play_phase_event_counter;
const ownTurn=(g,a)=>g.is_own_actual_turn?.(a)??(g.actual_turn_active!==false&&g.turn_actor===seat(g,a));
// Ownership must come from the current trusted general-skill ledger. Original
// selection/display identity alone must never resurrect a removed packet.
const own=(g,a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,skill)===true;
const play=(g,a)=>live(a)&&ongoing(g)&&g.actual_turn_active!==false&&ownTurn(g,a)&&g.turn_phase==='play'&&g.is_own_play_phase(a);
const idlePlay=(g,a)=>play(g,a)&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const materialId=(g,c)=>g.card_history_material_id?.(c)??physicalId(c);
const materialFact=(g,m)=>({zone:m.zone,index:m.index,physical_id:materialId(g,m.card),type:m.card.type});
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id));
const active=new WeakMap(), references=new WeakMap();
function state(a){
  const s=a.sgs_yijiang_combat_state??={version:1,counter:0,pojun:{},mingce:{},mingce_phases:{},zhichi:{},zhichi_effect:null};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['pojun','mingce','mingce_phases','zhichi'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Yijiang combat state');
  return s;
}
export const sgs_clone_yijiang_combat_state=a=>a.sgs_yijiang_combat_state?JSON.parse(JSON.stringify(state(a))):null;
function ticket(a,namespace,id,request,refs=[]){
  if(!stable(id))throw Error('一将武将技能需要稳定事件ID');
  const key=JSON.stringify(id),s=state(a),old=s[namespace][key],rk=`${namespace}:${key}`;
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一一将事件不能更换目标、事实或实体牌');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('一将技能事务中断；须重放原动作，不能再次支付或结算'),{code:'SGS_YIJIANG_COMBAT_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[namespace][key]={event_id:id,request,status:'offered',committed:false};running.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';running.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
function nextId(g,a,skill){const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('一将技能事务计数器已耗尽');return `${skill}:${JSON.stringify([pid(g,a),++s.counter])}`;}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`一将武将接入缺少 ${name}`);}
function movement(g){methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('一将武将需要 validate / on_committed 原子移牌边界');}
const meta=(g,a,skill,stage,extra={})=>({skill:NAMES[skill],skill_id:skill,stage,private_to:seat(g,a),...extra});
const materials=(g,a,options={})=>live(a)?g.skill_material_options(a,options).filter(m=>m.card&&!m.card.virtual&&(m.zone==='hand'||SLOTS.includes(m.zone))):[];

/** Private hand options intentionally reveal only position, never face/ID. */
export function sgs_pojun_materials(g,target){
  return materials(g,target,{payment:false}).filter(m=>g.can_set_aside_material?.(target,m,{source_skill:SK.pojun})!==false)
    .map(m=>({...m,label:m.zone==='hand'?`手牌${m.index+1}（暗选）`:m.label??String(m.card)}));
}
function pojunEligible(g,a,event){
  return own(g,a,SK.pojun)&&play(g,a)&&stable(turnId(g))&&event.kind==='sha'&&stable(event.card_use_id)
    &&!event.closed&&!event.cancelled&&(!event.source_card||is_sha_card(event.source_card))&&Array.isArray(event.target_events);
}
async function choosePojun(g,a,target,limit,valid){
  const options=sgs_pojun_materials(g,target),max=Math.min(limit,options.length);
  if(a.is_ai){
    if(g.side_of(a)===g.side_of(target))return [];
    // Equipment faces are public; hand choices use position only.
    return [...options.filter(m=>m.zone!=='hand'),...options.filter(m=>m.zone==='hand')].slice(0,max);
  }
  while(valid()){
    const answer=await g.view.ask_line(`破军：扣置${target.name}至多${max}张手牌或装备牌`,{
      kind:'select_hand',player_id:seat(g,a),min_count:0,max_count:max,
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不扣置'}],
      meta:meta(g,a,SK.pojun,'pojun_cards',{target_seat:seat(g,target),hp_limit:limit,hidden_hands:true,material_zones:['hand',...SLOTS]}),
    });
    if(!valid()||pass(answer)||String(answer).trim()==='')return [];
    const tokens=String(answer).trim().split(/[\s,，]+/).filter(Boolean),chosen=tokens.map(v=>select(options,v));
    if(tokens.length<=max&&chosen.every(Boolean)&&new Set(chosen.map(m=>m.card)).size===chosen.length)return chosen;
    g.view.emit(`请选择0至${max}张不同的合法牌。`,{private_to:seat(g,a)});
  }
  return [];
}
/** One offer per actual Slash use / final target, after existing redirects and
 * before any dodge, armor response or damage. No enhanced variant damage bonus. */
export async function sgs_on_sha_targets_designated_pojun(g,a,targets,event={}){
  if(!pojunEligible(g,a,event))return false;
  let committed=false;
  for(const target of [...new Set(targets??[])]){
    const branch=event.target_events.find(e=>e.target===target&&!e.cancelled);
    if(!branch||!live(target)||!pojunEligible(g,a,event))continue;
    const id=`pojun:${JSON.stringify([pid(g,a),event.card_use_id,pid(g,target)])}`;
    const request={actor:pid(g,a),target:pid(g,target),card_use_id:event.card_use_id,turn_id:turnId(g),source_type:event.source_card?.type??CardType.SHA};
    const t=ticket(a,'pojun',id,request,[target,event.source_card]);if(!t)continue;
    const limit=Math.max(0,Math.floor(target.hp)),form=rule_hero(a)?.id,binding=g.general_skill_binding_id?.(a,SK.pojun),turn=turnId(g);
    t.receipt.hp_limit=limit;
    const valid=()=>pojunEligible(g,a,event)&&turn===turnId(g)&&live(target)&&rule_hero(a)?.id===form
      &&binding===g.general_skill_binding_id?.(a,SK.pojun);
    try{
      if(!limit||!sgs_pojun_materials(g,target).length){t.finish();continue;}
      const chosen=await choosePojun(g,a,target,limit,valid);
      if(!chosen.length||!valid()||chosen.some(m=>!exact(sgs_pojun_materials(g,target),m))){t.finish();continue;}
      movement(g);
      const result=await g.public_card_loss(target,chosen,{to:'pojun_pile',recipient:target,source:a,pile_id:id,turn_id:turn,
        visibility:'private',reason:'破军',action:'set_aside',source_skill:SK.pojun,move_id:`${id}:hold`,
        validate:(allowed=chosen)=>valid()&&allowed.length<=limit&&allowed.every(m=>exact(sgs_pojun_materials(g,target),m)),
        on_committed:cards=>{
          if(!cards.length||cards.some(c=>!chosen.some(m=>m.card===c)))throw Error('破军必须原子扣置选定的实体牌子集');
          t.receipt.committed=true;t.receipt.status='committed';t.receipt.count=cards.length;t.receipt.pile_id=id;
          t.receipt.physical_ids=cards.map(c=>materialId(g,c));
        },
      });
      if(result?.committed!==t.receipt.committed)throw Error('破军移牌提交回执矛盾；禁止重新扣牌');
      committed=t.receipt.committed||committed;t.finish();
      if(t.receipt.committed)g.view.emit(`${a.name}发动破军，扣置${target.name}的${chosen.length}张牌，当前回合结束后归还。`);
    }catch(error){t.fail(error);throw error;}
  }
  return committed;
}

export const sgs_mingce_materials=(g,a)=>own(g,a,SK.mingce)?materials(g,a).filter(m=>m.zone==='hand'&&is_sha_card(m.card)||EQUIPMENT_TYPES.has(m.card.type)):[];
export const sgs_mingce_recipients=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
const mingcePhaseKey=(g,a)=>stable(phaseId(g,a))&&stable(turnId(g))?JSON.stringify([pid(g,a),turnId(g),phaseId(g,a)]):null;
export function sgs_mingce_available(g,a){
  const key=mingcePhaseKey(g,a);
  return own(g,a,SK.mingce)&&idlePlay(g,a)&&!!key&&!a.sgs_yijiang_combat_state?.mingce_phases?.[key]
    &&sgs_mingce_materials(g,a).length>0&&sgs_mingce_recipients(g,a).length>0;
}
export function sgs_mingce_unavailable_reason(g,a){
  if(!own(g,a,SK.mingce))return '当前没有明策技能';
  if(!idlePlay(g,a)||!mingcePhaseKey(g,a))return '只能在自己的空闲出牌阶段发动';
  if(a.sgs_yijiang_combat_state?.mingce_phases?.[mingcePhaseKey(g,a)])return '本出牌阶段已发动明策';
  if(!sgs_mingce_materials(g,a).length)return '需要一张实体杀或装备牌（手牌或装备区）';
  return sgs_mingce_recipients(g,a).length?'':'没有其他存活角色';
}
function mingceSha(){return new Card('杀',CardType.SHA,{virtual:true,materials:[],physical_cards:[],suit:null,color:null,rank:null,
  source_skill:SK.mingce,source_skill_id:SK.mingce,source_rule_id:ID.chengong,source_game:'三国杀'});}
/** Recipient's actual range and prohibitions. Never its play-phase Slash quota. */
export function sgs_mingce_targets(g,_actor,recipient){
  if(!live(recipient)||recipient.prison_no_sha)return [];
  const card=mingceSha();
  return g.all_players().filter(p=>p!==recipient&&live(p)&&g.can_sha_target(recipient,p,{allow_allies:true})
    &&(g.in_actual_attack_range?.(recipient,p)??g.in_attack_range(recipient,p))&&!g.card_target_prohibited?.(recipient,p,card));
}
async function chooseMingceTarget(g,a,recipient,valid){
  while(valid()){
    const targets=sgs_mingce_targets(g,a,recipient);if(!targets.length)return null;
    if(a.is_ai)return targets.find(p=>g.side_of(p)!==g.side_of(recipient))??targets[0];
    const options=targets.map(p=>({id:seat(g,p),label:p.name}));
    const answer=await g.view.ask_line(`明策：选择${recipient.name}攻击范围内的杀目标，再由其选择出杀或摸牌`,{
      kind:'choice',player_id:seat(g,a),options,
      meta:meta(g,a,SK.mingce,'mingce_sha_target',{mandatory:true,recipient_seat:seat(g,recipient),range_owner:seat(g,recipient)}),
    });
    if(!valid())return null;
    const target=targets.find(p=>seat(g,p)===select(options,answer)?.id);
    if(target&&sgs_mingce_targets(g,a,recipient).includes(target))return target;
  }
  return null;
}
async function mingceChoice(g,a,recipient,target,valid){
  if(!target)return 'draw';
  if(recipient.is_ai)return g.side_of(recipient)!==g.side_of(target)?'sha':'draw';
  while(valid()){
    if(!sgs_mingce_targets(g,a,recipient).includes(target))return 'draw';
    const options=[{id:'sha',label:`视为对${target.name}使用一张普通杀`},{id:'draw',label:'摸一张牌'}];
    const answer=await g.view.ask_line('明策：选择出杀或摸一张牌',{
      kind:'choice',player_id:seat(g,recipient),options,
      meta:meta(g,recipient,SK.mingce,'mingce_recipient_choice',{mandatory:true,initiator_seat:seat(g,a),target_seat:seat(g,target)}),
    });
    if(!valid())return null;
    const chosen=select(options,answer);if(chosen)return chosen.id;
  }
  return null;
}
export async function sgs_resolve_mingce(g,a,recipient,material,{action_id=null}={}){
  if(action_id!==null&&!stable(action_id))throw Error('明策需要稳定动作ID');
  const request={actor:pid(g,a),recipient:pid(g,recipient),turn_id:turnId(g),phase_id:phaseId(g,a),material:material?materialFact(g,material):null};
  if(action_id!==null&&a.sgs_yijiang_combat_state?.mingce?.[JSON.stringify(action_id)]){ticket(a,'mingce',action_id,request,[recipient,material?.card]);return false;}
  if(!sgs_mingce_available(g,a)||!sgs_mingce_recipients(g,a).includes(recipient))return false;
  const m=exact(sgs_mingce_materials(g,a),material);if(!m)return false;
  movement(g);methods(g,'use_sha','draw_cards');
  const id=action_id??nextId(g,a,SK.mingce),t=ticket(a,'mingce',id,request,[recipient,m.card]),key=mingcePhaseKey(g,a);
  const form=rule_hero(a)?.id,binding=g.general_skill_binding_id?.(a,SK.mingce),turn=turnId(g),phase=phaseId(g,a);
  const reservation=state(a).mingce_phases[key]={action_id:id,committed:false};
  const valid=()=>own(g,a,SK.mingce)&&idlePlay(g,a)&&turn===turnId(g)&&phase===phaseId(g,a)&&live(recipient)
    &&rule_hero(a)?.id===form&&binding===g.general_skill_binding_id?.(a,SK.mingce)&&!!exact(sgs_mingce_materials(g,a),m);
  // Committed continuation survives source-skill removal, but not death,
  // terminal game or actual-turn interruption. Never refund the physical gift.
  const continuing=()=>live(a)&&live(recipient)&&ongoing(g)&&g.actual_turn_active!==false&&turn===turnId(g);
  try{
    const result=await g.public_card_loss(a,[m],{payment:true,to:'hand',recipient,source:a,visibility:m.zone==='hand'?'private':'public',
      reason:'明策',action:'give',source_skill:SK.mingce,move_id:`mingce:${JSON.stringify([pid(g,a),id])}:gift`,validate:valid,
      on_committed:cards=>{
        if(cards.length!==1||cards[0]!==m.card)throw Error('明策必须交给选定的一张实体牌');
        reservation.committed=true;t.receipt.committed=true;t.receipt.status='committed';
      },
    });
    if(result?.committed!==t.receipt.committed)throw Error('明策交牌提交回执矛盾；禁止重新支付');
    if(!t.receipt.committed){delete state(a).mingce_phases[key];t.finish();return false;}
    if(!continuing()){t.finish();return true;}
    const target=await chooseMingceTarget(g,a,recipient,continuing);
    if(!continuing()){t.finish();return true;}
    const choice=await mingceChoice(g,a,recipient,target,continuing);
    if(!continuing()){t.finish();return true;}
    t.receipt.target_id=pid(g,target);t.receipt.choice=choice;
    if(choice==='sha'&&sgs_mingce_targets(g,a,recipient).includes(target)){
      const result=await g.use_sha(recipient,target,'明策·杀',{source_card:mingceSha(),forced:true,source_skill:SK.mingce,
        skill_initiator:a,use_provenance:{kind:'virtual',source_skill:SK.mingce,source_skill_id:SK.mingce,physical_cards:[]},
        on_card_use_committed:use=>{t.receipt.card_use_id=use.card_use_id;},
      });
      t.receipt.card_use_id??=result?.card_use_id??null;
    }else if(choice==='draw'||choice==='sha'){
      // A stale selected target leaves only the source's draw branch available.
      t.receipt.choice='draw';await g.draw_cards(recipient,1);t.receipt.drawn=1;
    }
    t.finish();return true;
  }catch(error){
    if(!t.receipt.committed&&state(a).mingce_phases[key]===reservation)delete state(a).mingce_phases[key];
    t.fail(error);throw error;
  }
}
export const sgs_mingce_execute=(g,a,{recipient,material,action_id=null}={})=>sgs_resolve_mingce(g,a,recipient,material,{action_id});
export function sgs_ai_mingce_plan(g,a){
  if(!sgs_mingce_available(g,a))return null;
  const recipients=sgs_mingce_recipients(g,a).filter(p=>g.side_of(p)===g.side_of(a));if(!recipients.length)return null;
  const recipient=recipients.find(p=>sgs_mingce_targets(g,a,p).some(t=>g.side_of(t)!==g.side_of(p)))??recipients[0];
  const material=[...sgs_mingce_materials(g,a)].sort((x,y)=>(g.material_ai_cost?.(x)??0)-(g.material_ai_cost?.(y)??0))[0];
  return {recipient,material};
}
export async function sgs_ai_mingce(g,a){const p=sgs_ai_mingce_plan(g,a);return p?sgs_resolve_mingce(g,a,p.recipient,p.material):false;}
export async function sgs_player_mingce(g,a,_fallback,args=[]){
  if(!sgs_mingce_available(g,a)){g.view.emit(`明策：${sgs_mingce_unavailable_reason(g,a)}。`);return true;}
  const turn=turnId(g),phase=phaseId(g,a),form=rule_hero(a)?.id,binding=g.general_skill_binding_id?.(a,SK.mingce);
  const valid=()=>sgs_mingce_available(g,a)&&turn===turnId(g)&&phase===phaseId(g,a)&&form===rule_hero(a)?.id&&binding===g.general_skill_binding_id?.(a,SK.mingce);
  let m=null;
  if(args.length){if(args.length===1&&pass(args[0]))return true;m=args.length===1?select(sgs_mingce_materials(g,a),args[0]):null;if(!m)return false;}
  while(!m&&valid()){
    const options=sgs_mingce_materials(g,a),answer=await g.view.ask_line('明策：选择一张杀或装备牌交给其他角色',{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不交牌'}],
      meta:meta(g,a,SK.mingce,'mingce_material',{material_zones:['hand',...SLOTS]}),
    });if(pass(answer))return true;m=select(options,answer);
  }
  if(!m||!valid())return true;
  while(valid()){
    const recipients=sgs_mingce_recipients(g,a),options=recipients.map(p=>({id:seat(g,p),label:p.name}));
    const answer=await g.view.ask_line('明策：选择获得这张牌的其他角色',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不交牌'}],
      meta:meta(g,a,SK.mingce,'mingce_recipient',{cancellable:true}),
    });if(pass(answer)||!valid())return true;
    const recipient=recipients.find(p=>seat(g,p)===select(options,answer)?.id);if(!recipient)continue;
    await sgs_resolve_mingce(g,a,recipient,m);return true;
  }
  return true;
}

/** Positive actual damage after rescue, once per event, on another real turn.
 * Creating this immutable turn effect is separate from future skill ownership. */
export function sgs_after_damage_zhichi(g,a,event={}){
  if(!own(g,a,SK.zhichi)||event.target!==a||!(event.damage>0)||event.dying_resolved!==true||event.cancelled
    ||g.actual_turn_active===false||ownTurn(g,a)||!stable(turnId(g))||event.kind==='hp_loss'||event.is_hp_loss)return false;
  const id=event.damage_event_id;
  const request={actor:pid(g,a),turn_id:turnId(g),damage:event.damage,source:pid(g,event.source),card_use_id:event.card_use_id??null};
  const t=ticket(a,'zhichi',id,request,[event.source]);if(!t)return false;
  t.receipt.committed=true;
  if(state(a).zhichi_effect?.turn_id!==turnId(g))state(a).zhichi_effect={turn_id:turnId(g),damage_event_id:id,source_skill:SK.zhichi};
  t.finish();return true;
}
export const sgs_after_any_damage_resolved_zhichi=sgs_after_damage_zhichi;
/** Call at EACH target's card-effect entry, never legal-target or damage layers.
 * Delayed cards, non-Slash basics, skills, HP loss and chain propagation bypass. */
export function sgs_zhichi_effect_invalid(g,target,card,context={}){
  if(!live(target)||g.actual_turn_active===false||target.sgs_yijiang_combat_state?.zhichi_effect?.turn_id!==turnId(g))return false;
  if(!card||context.chain_transfer||context.is_hp_loss||['skill','hp_loss'].includes(context.kind)
    ||context.method&&context.method!=='direct_card_effect'||context.direct_card_effect===false)return false;
  if(is_sha_card(card))return true;
  const family=typeof g.card_family==='function'?g.card_family(card):(EQUIPMENT_TYPES.has(card.type)?'equipment':card.type===CardType.SCROLL?'trick':'basic');
  return family==='trick'&&!(g.is_delayed_scroll?.(card)??card.delayed===true);
}
/** Host calls even after source skill loss/death/turn cancellation. Physical
 * held-card return remains the host's independently persisted obligation. */
export function sgs_yijiang_combat_end_turn(g,endedTurnId){
  if(!stable(endedTurnId))throw Error('一将回合清理需要稳定turn_id');
  for(const a of g.all_players())if(a.sgs_yijiang_combat_state?.zhichi_effect?.turn_id===endedTurnId)a.sgs_yijiang_combat_state.zhichi_effect=null;
}
export function sgs_yijiang_combat_public_state(g,a){
  const effect=a.sgs_yijiang_combat_state?.zhichi_effect,key=mingcePhaseKey(g,a);
  const batches=(g.sgs_pojun_obligations??[]).filter(o=>o.owner_id===pid(g,a)&&o.status!=='done').map(o=>({turn_id:o.turn_id,source_id:o.source_id,
    count:(a.sgs_pojun_pile??[]).filter(c=>o.physical_ids.includes(materialId(g,c))).length})).filter(o=>o.count>0);
  return {pojun_count:(a.sgs_pojun_pile??[]).length,pojun_batches:batches,zhichi_active:!!effect&&effect.turn_id===turnId(g)&&g.actual_turn_active!==false,
    zhichi_turn_id:effect?.turn_id??null,mingce_used:!!a.sgs_yijiang_combat_state?.mingce_phases?.[key]?.committed};
}
export function sgs_yijiang_combat_skill_definitions({SkillHooks,ActiveSkillDef}){
  const mingce=new ActiveSkillDef({skill_id:SK.mingce,hotkey:'q',button_label:'明策',player:sgs_player_mingce,ai:sgs_ai_mingce,available:sgs_mingce_available,
    help_text:'出牌阶段限一次，将一张杀或装备牌交给其他角色；你选其攻击范围内另一角色，其选择视为使用普通杀或摸一张牌。'});
  mingce.source_skill_id=SK.mingce;mingce.owns_target_selection=true;mingce.targets=sgs_mingce_recipients;mingce.unavailable_reason=sgs_mingce_unavailable_reason;
  return {hooks:{[ID.xusheng]:SkillHooks({on_sha_targets_designated:[sgs_on_sha_targets_designated_pojun]}),
    [ID.chengong]:SkillHooks({after_any_damage_resolved:[sgs_after_damage_zhichi]})},active:{[ID.chengong]:[mingce]}};
}
sgs_on_sha_targets_designated_pojun.source_skill_id=SK.pojun;
sgs_after_damage_zhichi.source_skill_id=SK.zhichi;
