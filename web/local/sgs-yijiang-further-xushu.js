/** 徐庶: selected Mobile classic damage-prevention/end-phase version.
 * Source inventory 2026-10-15; H0–H11 host integration is not client certification. */
import {rule_hero} from './effective-hero.js';
export const SGS_YIJIANG_FURTHER_XUSHU_RULE_IDS=Object.freeze({xushu:'sgs.adapted.base.hero.xu-shu'});
export const SGS_YIJIANG_FURTHER_XUSHU_SKILL_IDS=Object.freeze({wuyan:'sgs.wuyan',jujian:'sgs.jujian'});
const ID=SGS_YIJIANG_FURTHER_XUSHU_RULE_IDS,SK=SGS_YIJIANG_FURTHER_XUSHU_SKILL_IDS,FIELD='sgs_yijiang_further_xushu_state';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'],LIMIT=64;
export const SGS_YIJIANG_FURTHER_XUSHU_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7','H9','H11']),
  heroes:Object.freeze([Object.freeze({id:ID.xushu,name:'徐庶',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'蜀',skill_ids:Object.freeze([SK.wuyan,SK.jujian]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.wuyan]:'锁定技，当你使用锦囊牌造成伤害时，防止此伤害；当你受到锦囊牌造成的伤害时，防止此伤害。',[SK.jujian]:'结束阶段，你可以弃置一张非基本牌并令一名其他角色选择一项：1.摸两张牌；2.回复1点体力；3.复原武将牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-135.html','https://wiki.biligame.com/msgs/徐庶']),
  excluded_variants:Object.freeze(['old-nondelayed-trick-immunity','active-three-card-jujian','SP徐庶','友徐庶']),restore_ui_policy:'H11: omit unchanged restore from UI; core accepts idempotent no-op restore',
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),key=JSON.stringify;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const active=new WeakMap();
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!['jujian','wuyan','restores'].every(k=>Array.isArray(s[k])&&s[k].length<=LIMIT)||s.jujian.some(r=>!stable(r.event_id)||!stable(r.turn_id)||!['offered','paying','paid','resolving','done','failed'].includes(r.status)))throw Error('Invalid Xu Shu state');return s;}
function state(g,a){const owner=pid(g,a);if(!stable(owner))throw Error('徐庶需要稳定人物ID');const s=a[FIELD]??={version:1,owner_id:owner,jujian:[],wuyan:[],restores:[]};validate(s);if(s.owner_id!==owner)throw Error('徐庶事务不能继承另一人物');return s;}
function append(rows,r){if(rows.length>=LIMIT){const i=rows.findIndex(x=>x.status==='done');if(i<0)throw Error('徐庶尚有未完成事务，不能丢弃回执');rows.splice(i,1);}rows.push(r);return r;}
export const sgs_clone_yijiang_further_xushu_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validate(a[FIELD]))):null;
/** Committed function wins over physical material. A trick merely causing an
 * independent skill or borrowed Slash never makes that damage trick damage. */
export function sgs_wuyan_trick_damage(g,e={}){
  if(['hp_loss','skill','independent_skill','poison_loss'].includes(e.kind)||e.damage_origin==='independent_skill')return false;
  const identity=e.damage_card_identity;
  if(Object.hasOwn(e,'damage_card_identity')){if(!identity)return false;const f=identity.card_family??identity.family??g.card_family?.(identity);return f==='trick';}
  if(!['sha','duel','scroll','chain','delayed','lightning','leidian'].includes(e.kind))return false;
  return g.card_family?.(e.source_card)==='trick';
}
function prevent(g,a,e,direction){
  if(!owned(g,a,SK.wuyan)||(direction==='source'?e.source!==a:e.target!==a)||e.cancelled||!(e.damage>0)||!sgs_wuyan_trick_damage(g,e))return false;
  if(!stable(e.damage_event_id))throw Error('无言需要稳定伤害事件ID');
  const s=state(g,a),facts={event_id:e.damage_event_id,source_id:pid(g,e.source),target_id:pid(g,e.target),card_name:(e.damage_card_identity??e.source_card)?.name??null};
  const old=s.wuyan.find(r=>r.event_id===facts.event_id);
  if(old&&key(old.facts)!==key(facts))throw Error('同一无言伤害事件不能更换来源、目标或牌功能');
  e.prevented=true;e.prevented_by=SK.wuyan;e.prevented_amount=e.damage;e.damage=0;
  if(!old){append(s.wuyan,{event_id:facts.event_id,facts,direction,amount:e.prevented_amount,status:'done'});g.view.emit(`${a.name}的无言防止了${e.prevented_amount}点锦囊伤害。`,{event_type:'damage_prevented',skill_id:SK.wuyan,damage_event_id:e.damage_event_id,prevented_amount:e.prevented_amount,damage:0,source_id:facts.source_id,target_id:facts.target_id});}
  return true;
}
export const sgs_before_source_damage_wuyan=(g,a,e)=>prevent(g,a,e,'source');
export const sgs_before_receiving_damage_wuyan=(g,a,e)=>prevent(g,a,e,'receiver');
export function sgs_jujian_materials(g,a){if(!live(a))return [];return [...(a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])].filter(m=>m.card&&!m.card.virtual&&g.can_pay_materials?.(a,[m])!==false&&['trick','equipment'].includes(g.card_family?.(m.card))&&g.can_discard_material?.(a,m,{source:a,source_skill:SK.jujian})!==false).map(m=>({...m,epoch:g.card_location_epoch?.(m.card)??0}));}
const exact=(os,m)=>m&&os.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||m.epoch===o.epoch));
export const sgs_jujian_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
const maxhp=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp??a.max_hp??a.hp;
export function sgs_jujian_choices(g,target,{ui=true}={}){return [{id:'draw',label:'摸两张牌'},...(target.hp<maxhp(g,target)?[{id:'recover',label:'回复1点体力'}]:[]),...(!ui||target.face_orientation==='face_down'||target.chained?[{id:'restore',label:'复原武将牌：翻回正面并解除连环（保留判定牌和技能标记）'}]:[])];}
export const sgs_ai_jujian_choice=(g,p)=>p.face_orientation==='face_down'?'restore':p.hp<maxhp(g,p)&&(p.hp<=2||p.hand.length>=2)?'recover':'draw';
export function sgs_ai_jujian_plan(g,a){if(typeof g.side_of!=='function')return null;const target=sgs_jujian_targets(g,a).filter(p=>g.side_of(p)===g.side_of(a)).sort((x,y)=>(y.face_orientation==='face_down')-(x.face_orientation==='face_down')||x.hp-y.hp||x.hand.length-y.hand.length)[0];const material=sgs_jujian_materials(g,a).sort((x,y)=>(g.material_ai_cost?.(x)??2)-(g.material_ai_cost?.(y)??2))[0];return target&&material?{target,material}:null;}
/** H9: idempotent restore, flip then chain. No reset of other state. The receipt
 * is owned by the recipient and can be called independently of current skills. */
export async function sgs_restore_general(g,target,{source_skill=SK.jujian,event_id}={}){
  if(!stable(event_id))throw Error('复原需要稳定事件ID');if(!live(target)||!ongoing(g))return false;
  const s=state(g,target),old=s.restores.find(r=>r.event_id===event_id);
  if(old){if(old.source_skill!==source_skill)throw Error('同一复原事件不能更换技能');if(old.status!=='done')throw Object.assign(Error('复原中断，须恢复原协程或从输入日志重放'),{code:'SGS_XUSHU_REPLAY_REQUIRED'});return false;}
  const r=append(s.restores,{event_id,source_skill,status:'resolving',flipped:false,unchained:false});
  try{
    if(target.face_orientation==='face_down'){if(typeof g.flip_general!=='function')throw Error('复原需要正常翻面接口');r.flipped=Boolean(await g.flip_general(target,{source_skill,event_id:`${event_id}:flip`}));}
    if(live(target)&&ongoing(g)&&target.chained){target.chained=false;r.unchained=true;g.guard_state_changed?.();g.view.emit(`${target.name}解除连环。`,{event_type:'hero_chain',player_id:pid(g,target),chained:false,source_skill,event_id:`${event_id}:unchain`});}
    r.status='done';return r.flipped||r.unchained;
  }catch(error){r.status='failed';throw error;}
}
function window(g,a,e){return owned(g,a,SK.jujian)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='end_phase'&&g.turn_actor===seat(g,a)&&e.actor===a&&e.turn_id===g.turn_event_counter&&stable(e.turn_id)&&stable(e.phase_event_id)&&g.active_end_phase_id===e.phase_event_id&&e.stage==='start'&&!e.closed&&!e.cancelled&&!e.skipped&&!e.interrupted;}
function meta(g,a,stage,e,extra={}){return {skill:'举荐',skill_id:SK.jujian,stage,private_to:seat(g,a),phase_event_id:e.phase_event_id,...extra};}
/** Direct callers may supply cost and recipient; the recipient still always
 * chooses its own effect. No owner-controlled effect override exists. */
export async function sgs_jujian_execute(g,a,e={},options={}){
  if(!window(g,a,e))return false;
  const s=state(g,a),old=s.jujian.find(r=>r.event_id===e.phase_event_id);
  if(old){if(old.turn_id!==e.turn_id)throw Error('同一举荐结束阶段不能更换回合');if(old.status!=='done'&&!active.get(a)?.has(old))throw Object.assign(Error('举荐中断，须恢复原协程或从输入日志重放'),{code:'SGS_XUSHU_REPLAY_REQUIRED'});return false;}
  if(s.jujian.some(r=>r.status!=='done'))throw Error('举荐尚有未完成事务');
  const r=append(s.jujian,{event_id:e.phase_event_id,turn_id:e.turn_id,status:'offered',committed:false,drawn:0});let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());jobs.add(r);
  const bound=binding(g,a,SK.jujian),valid=()=>window(g,a,e)&&binding(g,a,SK.jujian)===bound&&e.phase_event_id===r.event_id&&e.turn_id===r.turn_id;
  const finish=()=>{r.status='done';jobs.delete(r);};
  try{
    if(!sgs_jujian_materials(g,a).length||!sgs_jujian_targets(g,a).length){r.ineligible=true;finish();return false;}
    let material=options.material??null,target=options.target??g.all_players().find(p=>pid(g,p)===options.target_id)??null;
    if(a.is_ai&&!material&&!target){const plan=sgs_ai_jujian_plan(g,a);material=plan?.material;target=plan?.target;}
    else if(options.choose!==false){
      while(valid()&&!material){const os=sgs_jujian_materials(g,a);if(!os.length)break;const answer=await g.view.ask_line('举荐：可弃置一张非基本手牌或装备，再由另一角色选择收益',{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动'}],meta:meta(g,a,'jujian_material',e,{optional:true,exact_count:1,material_zones:['hand',...SLOTS]})});if(!valid()||pass(answer))break;material=select(os,answer);if(material&&!exact(sgs_jujian_materials(g,a),material)){r.cancelled=true;finish();return false;}}
      while(valid()&&material&&!target){const ps=sgs_jujian_targets(g,a),os=ps.map(p=>({id:String(pid(g,p)),label:p.name}));if(!os.length)break;const answer=await g.view.ask_line('举荐：选择另一名角色（由其自行选择摸牌、回复或复原）',{kind:'choice',player_id:seat(g,a),options:[...os,{id:'cancel',label:'取消，不支付费用'}],meta:meta(g,a,'jujian_target',e,{optional:true,allow_self:false,allow_enemies:true,recipient_chooses:true})});if(!valid()||pass(answer))break;target=ps.find(p=>String(pid(g,p))===select(os,answer)?.id)??null;if(target&&!sgs_jujian_targets(g,a).includes(target)){r.cancelled=true;finish();return false;}}
    }
    const legal=()=>valid()&&Boolean(exact(sgs_jujian_materials(g,a),material))&&sgs_jujian_targets(g,a).includes(target);
    if(!legal()){r.cancelled=true;finish();return false;}
    if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('举荐需要原子 validate / on_committed 移牌边界');
    r.status='paying';r.target_id=pid(g,target);
    const move=await g.public_card_loss(a,[material],{payment:true,to:'discard',visibility:'public',reason:'举荐',action:'discard',semantic_action:'discard',source:a,source_skill:SK.jujian,move_id:`jujian:${key([pid(g,a),r.event_id])}:cost`,validate:legal,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==material.card)throw Error('举荐成本回执必须恰好一张所选非基本牌');r.committed=true;r.status='paid';r.move_id=movement.move_id;}});
    if(move?.committed&&!r.committed)throw Error('举荐缺少原子成本回执');if(!r.committed){r.cancelled=true;finish();return false;}
    // Paid loss callbacks settle completely. Skill removal or owner death does
    // not refund or invalidate the paid effect; recipient/match must still live.
    if(!live(target)||!ongoing(g)){r.stopped='recipient_dead_or_match_closed';finish();return true;}
    r.status='resolving';let choice=null;
    while(live(target)&&ongoing(g)&&!choice){
      if(target.is_ai)choice=sgs_ai_jujian_choice(g,target);
      else {const os=sgs_jujian_choices(g,target);const answer=await g.view.ask_line('举荐：由你选择一项。复原仅翻回正面并解除连环，不改变判定牌、技能标记或体力上限。',{kind:'choice',player_id:seat(g,target),options:os,meta:meta(g,target,'jujian_effect',e,{mandatory:true,recipient_chooses:true,source_id:pid(g,a),full_hp_recovery_allowed:false,noop_restore_ui_policy:'hidden_but_core_idempotent'})});if(!live(target)||!ongoing(g))break;choice=String(answer)==='restore'?'restore':select(os,answer)?.id;}
      if(choice&&!sgs_jujian_choices(g,target,{ui:false}).some(o=>o.id===choice))choice=null;
    }
    if(choice&&live(target)&&ongoing(g)){r.choice=choice;
      if(choice==='draw'){r.requested=2;const cards=await g.draw_cards(target,2);r.drawn=Array.isArray(cards)?cards.length:null;}
      else if(choice==='recover')r.recovered=await g.recover_hp(target,1,{source:a,source_skill:SK.jujian,recovery_event_id:`jujian:${key([pid(g,a),r.event_id])}:recover`});
      else r.restored=await sgs_restore_general(g,target,{source_skill:SK.jujian,event_id:`jujian:${key([pid(g,a),r.event_id])}:restore`});
    }else r.stopped='recipient_dead_or_match_closed';
    finish();g.view.emit(`${a.name}发动举荐，${target.name}${r.choice==='draw'?'摸两张牌':r.choice==='recover'?'回复1点体力':r.choice==='restore'?'复原武将牌':'的收益因离场而停止'}。`,{event_type:'skill_resolution',skill_id:SK.jujian,phase_event_id:r.event_id,target_id:r.target_id,choice:r.choice??null});return true;
  }catch(error){r.status='failed';r.error=String(error?.message??error);jobs.delete(r);throw error;}
}
export const sgs_on_end_phase_jujian=(g,a,_target,e)=>sgs_jujian_execute(g,a,e,{choose:true});
export function sgs_yijiang_further_xushu_public_state(a){if(!a?.[FIELD])return {jujian_events:[],wuyan_events:[],restore_events:[]};const s=validate(a[FIELD]);return {jujian_events:s.jujian.map(r=>({event_id:r.event_id,turn_id:r.turn_id,status:r.status,committed:r.committed,target_id:r.committed?r.target_id:null,choice:r.choice??null,requested:r.requested??0,drawn:r.drawn,recovered:r.recovered??0,stopped:r.stopped??null})),wuyan_events:s.wuyan.map(r=>({...r,facts:{...r.facts}})),restore_events:s.restores.map(r=>({...r}))};}
export function sgs_yijiang_further_xushu_skill_definitions({SkillHooks}){return {hooks:{[ID.xushu]:SkillHooks({before_source_damage_resolution:[sgs_before_source_damage_wuyan],before_receiving_damage_cost:[sgs_before_receiving_damage_wuyan],on_end_phase:[sgs_on_end_phase_jujian]})},active:{}};}
sgs_before_source_damage_wuyan.source_skill_id=SK.wuyan;sgs_before_receiving_damage_wuyan.source_skill_id=SK.wuyan;sgs_on_end_phase_jujian.source_skill_id=SK.jujian;
