/** 马谡, mainland-mobile base identity catalog snapshot 2026-10-15.
 * Complete selected 散谣/制蛮 inventory. F0–F3 are explicit host policies:
 * full-HP initialization, effective ownership/transaction IDs, committed-cost
 * interruption, and source-before-receiver cancellation. Not client certification.
 */
import {rule_hero} from './effective-hero.js';

export const SGS_FOLLOWING_MASU_RULE_IDS=Object.freeze({masu:'sgs.adapted.base.hero.ma-su'});
export const SGS_FOLLOWING_MASU_SKILL_IDS=Object.freeze({sanyao:'sgs.sanyao',zhiman:'sgs.zhiman'});
export const SGS_FOLLOWING_MASU_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,
  initial_hp_directly_verified:false,host_policy_ids:Object.freeze(['F0','F1','F2','F3']),
  heroes:Object.freeze([Object.freeze({id:SGS_FOLLOWING_MASU_RULE_IDS.masu,name:'马谡',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'F0 host normal-full-HP initialization',gender:'male',source_faction:'蜀',
    skill_ids:Object.freeze(['sgs.sanyao','sgs.zhiman']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    'sgs.sanyao':'出牌阶段限一次，你可以弃置一张牌并选择一名体力值最大的角色，然后你对其造成1点伤害。',
    'sgs.zhiman':'当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-106.html','https://wiki.biligame.com/msgs/马谡',
    'https://www.sanguosha.cn/pc/guide-info-36.html','https://www.sanguosha.com/news/20161101_2982_2319']),
  bwiki_revision:24570,
});
const ID=SGS_FOLLOWING_MASU_RULE_IDS,SK=SGS_FOLLOWING_MASU_SKILL_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const NAMES=Object.freeze({[SK.sanyao]:'散谣',[SK.zhiman]:'制蛮'});
const live=a=>Boolean(a&&!a.dead&&a.hp>0);
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
// Never resurrect a removed or forged packet from selected hero identity.
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,id)===true;
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const phaseId=(_g,a)=>a?.play_phase_id;
const idlePlay=(g,a)=>live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'
  &&(g.is_own_actual_turn?.(a)??g.turn_actor===seat(g,a))&&g.is_own_play_phase(a)
  &&!a.skip_play_stage&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=v=>['cancel','pass','0','n','no'].includes(String(v));
const meta=(g,a,skill,stage,extra={})=>({skill:NAMES[skill],skill_id:skill,stage,private_to:seat(g,a),...extra});
const physicalId=(g,c)=>g.card_history_material_id?.(c)??c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const fact=(g,m)=>m?{zone:m.zone,index:m.index,physical_id:physicalId(g,m.card),name:m.card?.name,type:m.card?.type}:null;
const active=new WeakMap(),references=new WeakMap();
function state(a){
  const s=a.sgs_following_masu_state??={version:1,counter:0,sanyao:{},sanyao_phases:{},zhiman:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['sanyao','sanyao_phases','zhiman'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Ma Su skill state');
  return s;
}
export const sgs_clone_following_masu_state=a=>a.sgs_following_masu_state?JSON.parse(JSON.stringify(state(a))):null;
function ticket(a,namespace,id,request,refs=[]){
  if(!stable(id))throw Error('马谡技能需要稳定事件ID');
  const key=JSON.stringify(id),s=state(a),old=s[namespace][key],rk=`${namespace}:${key}`;
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一马谡事件不能更换目标、事实或实体牌');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('马谡事务中断；须重放原动作日志，不能重复支付或移牌'),{code:'SGS_FOLLOWING_MASU_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[namespace][key]={event_id:id,request,status:'offered',committed:false};running.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';running.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
function nextId(g,a,skill){const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('马谡事务计数器已耗尽');return `${skill}:${JSON.stringify([pid(g,a),++s.counter])}`;}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`马谡接入缺少 ${name}`);}
function movement(g){methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('马谡需要 validate / on_committed 原子移牌边界');}
const equipment=a=>SLOTS.flatMap(zone=>a?.[zone]&&!a[zone].virtual?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:String(a[zone])}]:[]);
const discardable=(g,a,m)=>g.can_discard_material?.(a,m,{chooser:a,source_skill:SK.sanyao})!==false
  &&g.can_discard_card?.(a,m.card,{zone:m.zone,reason:'散谣',chooser:a,source_skill:SK.sanyao})!==false;
export function sgs_sanyao_materials(g,a){
  if(!live(a))return [];
  return [...a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),...equipment(a)]
    .filter(m=>m.card&&!m.card.virtual&&g.can_pay_materials?.(a,[m])!==false&&discardable(g,a,m));
}
export function sgs_sanyao_targets(g,a){
  if(!owned(g,a,SK.sanyao))return [];
  const players=g.all_players().filter(live),max=Math.max(...players.map(p=>p.hp));return players.filter(p=>p.hp===max);
}
function phaseReady(a,id,except=null){
  if(!a.sgs_following_masu_state)return true;
  const s=state(a);return !s.sanyao_phases[JSON.stringify(id)]&&!Object.values(s.sanyao).some(r=>r!==except&&r.request.phase_id===id&&r.status!=='done');
}
export const sgs_sanyao_available=(g,a)=>owned(g,a,SK.sanyao)&&idlePlay(g,a)&&stable(phaseId(g,a))&&phaseReady(a,phaseId(g,a))
  &&sgs_sanyao_materials(g,a).length>0&&sgs_sanyao_targets(g,a).length>0;
export function sgs_sanyao_unavailable_reason(g,a){
  if(!owned(g,a,SK.sanyao))return '当前不拥有散谣';
  if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!stable(phaseId(g,a)))return '缺少真实出牌阶段标识';
  if(!phaseReady(a,phaseId(g,a)))return '本出牌阶段散谣已发动或正在处理';
  return sgs_sanyao_materials(g,a).length?'':'没有可以弃置的手牌或装备';
}
const exact=(options,m)=>options.find(n=>n.zone===m?.zone&&n.index===m.index&&n.card===m.card);
/** Human legality includes self and allies. Host AI policy spends only against
 * hostile maxima; this preference is not a source rules restriction. */
export function sgs_ai_sanyao_plan(g,a){
  if(!sgs_sanyao_available(g,a))return null;
  const target=sgs_sanyao_targets(g,a).find(p=>g.side_of(p)!==g.side_of(a));
  return target?{target,material:sgs_sanyao_materials(g,a).sort((x,y)=>(g.material_ai_cost?.(x)??0)-(g.material_ai_cost?.(y)??0))[0]}:null;
}
async function resolveSanyao(g,a,{target_id=null,material=null,material_id=null,event_id=null,phase_id=null,choose=false}={}){
  const phase=phase_id??phaseId(g,a),id=event_id??nextId(g,a,SK.sanyao);
  const request={owner:pid(g,a),phase_id:phase,target_id,material:fact(g,material),material_id,choose};
  if(state(a).sanyao[JSON.stringify(id)]){ticket(a,'sanyao',id,request,material?[material.card]:[]);return false;}
  if(!sgs_sanyao_available(g,a)||phase!==phaseId(g,a))return false;
  movement(g);methods(g,'apply_damage');
  const bound=binding(g,a,SK.sanyao),turn=g.turn_event_counter,t=ticket(a,'sanyao',id,request,material?[material.card]:[]);
  const valid=()=>owned(g,a,SK.sanyao)&&binding(g,a,SK.sanyao)===bound&&g.turn_event_counter===turn&&idlePlay(g,a)
    &&phase===phaseId(g,a)&&phaseReady(a,phase,t.receipt);
  try{
    let chosen=material?exact(sgs_sanyao_materials(g,a),material):sgs_sanyao_materials(g,a).find(m=>m.id===material_id),target=g.all_players().find(p=>pid(g,p)===target_id);
    if(choose){
      while(valid()){
        const options=sgs_sanyao_materials(g,a);if(!options.length)break;
        const answer=await g.view.ask_line('散谣：选择一张手牌或装备弃置',{kind:'select_hand',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗次数'}],meta:meta(g,a,SK.sanyao,'sanyao_cost',{phase_id:phase,material_zones:['hand',...SLOTS]})});
        if(!valid()||pass(answer))break;
        chosen=select(options,answer);if(chosen&&exact(sgs_sanyao_materials(g,a),chosen))break;chosen=null;
      }
      if(chosen&&valid())while(valid()){
        const targets=sgs_sanyao_targets(g,a),options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}点体力）`}));
        const answer=await g.view.ask_line('散谣：选择当前体力值最大的角色（含自己及友方）',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗次数'}],meta:meta(g,a,SK.sanyao,'sanyao_target',{phase_id:phase,allow_self:true,allow_allies:true})});
        if(!valid()||pass(answer))break;
        target=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);if(target)break;
      }
    }
    const legal=()=>valid()&&Boolean(exact(sgs_sanyao_materials(g,a),chosen))&&sgs_sanyao_targets(g,a).includes(target);
    if(!chosen||!target||!legal()){t.finish();return false;}
    t.receipt.target=pid(g,target);t.receipt.material=fact(g,chosen);t.receipt.status='paying';
    const result=await g.public_card_loss(a,[chosen],{payment:true,to:'discard',visibility:'public',reason:'散谣',action:'discard',source:a,source_skill:SK.sanyao,
      move_id:`sanyao:${JSON.stringify([pid(g,a),id])}:cost`,validate:legal,on_committed:()=>{
        t.receipt.committed=true;t.receipt.status='committed';state(a).sanyao_phases[JSON.stringify(phase)]={event_id:id,used:true};
      }});
    if(result?.committed&&!t.receipt.committed)throw Error('散谣弃牌缺少原子提交回执');
    // F2: selected maximum is snapshotted on payment. Nested loss hooks may
    // change HP/ownership, but cannot refund the cost or redirect the effect.
    if(t.receipt.committed&&live(a)&&live(target)&&ongoing(g))t.receipt.damage=await g.apply_damage(target,1,{source:a,source_skill:SK.sanyao,source_skill_id:SK.sanyao,kind:'skill',nature:'normal',method:'sanyao',damage_event_id:`sanyao:${JSON.stringify([pid(g,a),id])}:damage`});
    t.finish();return t.receipt.committed;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_sanyao_execute=(g,a,options)=>resolveSanyao(g,a,options);
export const sgs_resolve_sanyao=sgs_sanyao_execute;
export async function sgs_player_sanyao(g,a){if(!sgs_sanyao_available(g,a)){g.view.emit(`散谣：${sgs_sanyao_unavailable_reason(g,a)}。`);return true;}await resolveSanyao(g,a,{choose:true});return true;}
export async function sgs_ai_sanyao(g,a){const plan=sgs_ai_sanyao_plan(g,a);return plan?sgs_sanyao_execute(g,a,{target_id:pid(g,plan.target),material:plan.material}):false;}

export function sgs_zhiman_materials(g,a,target){
  if(!live(a)||!live(target)||a===target)return [];
  return [...equipment(target),...(target.judgment_cards??[]).map((card,index)=>({id:`judgment:${index+1}`,zone:'judgment',index,card,label:`判定区：${card}`}))]
    .filter(m=>m.card&&!m.card.virtual&&g.can_obtain_material?.(target,m,{recipient:a,source:a,source_skill:SK.zhiman})!==false);
}
const damageId=e=>e.damage_event_id??e.event_id;
const damageAmount=e=>e.amount??e.damage;
const damageRequest=(g,a,e)=>({owner:pid(g,a),source:pid(g,e.source),target:pid(g,e.target),amount:damageAmount(e),kind:e.kind??null,nature:e.nature??'normal',card_use_id:e.card_use_id??null});
const validDamage=(g,a,e)=>owned(g,a,SK.zhiman)&&ongoing(g)&&e.source===a&&live(e.target)&&e.target!==a
  &&damageAmount(e)>0&&!e.prevented&&!e.cancelled&&!e.closed;
/** Host AI avoids stripping allies and declines hostile prevention without an
 * obtainable equipment card. Humans retain the complete source choice. */
export const sgs_ai_zhiman_decision=(g,a,e)=>validDamage(g,a,e)&&g.side_of(a)!==g.side_of(e.target)
  &&sgs_zhiman_materials(g,a,e.target).some(m=>SLOTS.includes(m.zone));
function prevent(e){e.prevented=true;e.prevented_by=SK.zhiman;e.prevention_skill_id=SK.zhiman;e.damage=0;}
export async function sgs_before_source_damage_resolution_zhiman(g,a,event={}){
  const id=damageId(event),target=event.target,request=damageRequest(g,a,event);
  // Completed cancellation stays cancelled even if skills were subsequently
  // removed or a replay supplies a fresh event object. No movement repeats.
  const old=a?.sgs_following_masu_state?.zhiman?.[JSON.stringify(id)];
  if(old){ticket(a,'zhiman',id,request,[event.source,target]);if(old.committed)prevent(event);return old.committed;}
  if(!validDamage(g,a,event))return false;
  const bound=binding(g,a,SK.zhiman),t=ticket(a,'zhiman',id,request,[event.source,target]);
  const valid=()=>validDamage(g,a,event)&&binding(g,a,SK.zhiman)===bound&&event.target===target&&damageId(event)===id
    &&JSON.stringify(damageRequest(g,a,event))===JSON.stringify(request);
  try{
    let accepted=false;
    if(a.is_ai)accepted=sgs_ai_zhiman_decision(g,a,event);
    else while(valid()){
      const answer=await g.view.ask_line(`制蛮：防止对${target.name}的全部${damageAmount(event)}点伤害，然后获得其一张装备或判定牌？`,{kind:'choice',player_id:seat(g,a),options:[{id:'prevent',label:'发动制蛮，防止全部伤害'},{id:'pass',label:'不发动，正常结算伤害'}],meta:meta(g,a,SK.zhiman,'zhiman_prevent',{event_id:id,target_seat:seat(g,target),whole_event:true,empty_zone_allowed:true})});
      if(!valid()||pass(answer))break;
      if(['prevent','y','yes','1'].includes(String(answer))){accepted=true;break;}
    }
    if(!accepted||!valid()){t.finish();return false;}
    movement(g);t.receipt.committed=true;t.receipt.status='prevented';prevent(event);
    g.view.emit(`${a.name}发动制蛮，防止对${target.name}的此次全部伤害。`,{source_skill:SK.zhiman,event_type:'damage_prevented',damage_event_id:id});
    // F3: cancellation is irrevocable before the obtain choice and all nested
    // E-loss callbacks. A later interruption never restores the damage event.
    const canObtain=()=>live(a)&&live(target)&&ongoing(g);
    while(canObtain()){
      const options=sgs_zhiman_materials(g,a,target);if(!options.length)break;
      let chosen=null;
      if(a.is_ai)chosen=options.find(m=>SLOTS.includes(m.zone))??options[0];
      else{
        const answer=await g.view.ask_line(`制蛮已发动：获得${target.name}的一张装备或判定牌`,{kind:'select_target_card',player_id:seat(g,a),options:options.map(({id,label})=>({id,label})),meta:meta(g,a,SK.zhiman,'zhiman_obtain',{event_id:id,owner_seat:seat(g,target),hidden_hands:true,material_zones:[...SLOTS,'judgment'],mandatory:true})});
        if(!canObtain())break;chosen=select(options,answer);
      }
      const legal=()=>canObtain()&&Boolean(exact(sgs_zhiman_materials(g,a,target),chosen));
      if(!chosen||!legal())continue;
      t.receipt.material=fact(g,chosen);let committed=false;
      const result=await g.public_card_loss(target,[chosen],{to:'hand',recipient:a,visibility:'public',reason:'制蛮',action:'obtain',source:a,source_skill:SK.zhiman,
        move_id:`zhiman:${JSON.stringify([pid(g,a),id])}:obtain`,validate:legal,on_committed:()=>{committed=true;t.receipt.obtained=true;t.receipt.status='obtained';}});
      if(result?.committed&&!committed)throw Error('制蛮获得牌缺少原子提交回执');
      break;
    }
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_following_masu_public_state(a){
  if(!a?.sgs_following_masu_state)return {sanyao_used_phases:[],zhiman_events:[]};
  const s=state(a);return {sanyao_used_phases:Object.entries(s.sanyao_phases).filter(([,r])=>r.used).map(([key])=>JSON.parse(key)),
    zhiman_events:Object.values(s.zhiman).map(r=>({event_id:r.event_id,status:r.status,prevented:r.committed,obtained:r.obtained===true}))};
}
export function sgs_following_masu_skill_definitions({SkillHooks,ActiveSkillDef}){
  const sanyao=new ActiveSkillDef({skill_id:SK.sanyao,hotkey:'q',button_label:'散谣',player:sgs_player_sanyao,ai:sgs_ai_sanyao,available:sgs_sanyao_available,
    help_text:'出牌阶段限一次，弃置一张手牌或装备，对当前体力值最大的角色造成1点伤害；可选并列、自己或友方，无距离限制。'});
  sanyao.source_skill_id=SK.sanyao;sanyao.owns_target_selection=true;sanyao.targets=sgs_sanyao_targets;sanyao.unavailable_reason=sgs_sanyao_unavailable_reason;
  return {hooks:{[ID.masu]:SkillHooks({before_source_damage_resolution:[sgs_before_source_damage_resolution_zhiman]})},active:{[ID.masu]:[sanyao]}};
}
sgs_before_source_damage_resolution_zhiman.source_skill_id=SK.zhiman;
