/** 于禁 / 华雄: complete selected mobile base identity inventories, 2026-10-15.
 * F0/F1/F6–F9 are disclosed host policies, not executable-client certification.
 * The host owns real zones, equipment-loss hooks, ledger and damage scheduling.
 * This module never stores a virtual projection in a physical card zone.
 */
import {Card,CardType,CardColor,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_FOLLOWING_JIEYUE_RULE_IDS=Object.freeze({yujin:'sgs.adapted.base.hero.yu-jin',huaxiong:'sgs.adapted.base.hero.hua-xiong'});
export const SGS_FOLLOWING_JIEYUE_SKILL_IDS=Object.freeze({jieyue:'sgs.jieyue',yaowu:'sgs.yaowu'});
export const SGS_JIEYUE_PILE_ID='sgs.jieyue.cards';
export const SGS_JIEYUE_RESPONSE_WUXIE='无懈可击';
export const SGS_FOLLOWING_JIEYUE_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['F0','F1','F6','F7','F8','F9']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_FOLLOWING_JIEYUE_RULE_IDS.yujin,name:'于禁',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.jieyue']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FOLLOWING_JIEYUE_RULE_IDS.huaxiong,name:'华雄',max_hp:6,starting_hp:6,starting_hp_direct_source_value:null,gender:'male',source_faction:'群',skill_ids:Object.freeze(['sgs.yaowu']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  literal_skill_text:Object.freeze({
    'sgs.jieyue':'结束阶段，你可以弃置一张手牌并选择一名其他角色。若如此做，除非该角色将一张牌置于你的武将牌上，否则你弃置其一张牌。若你有“节钺”牌，则你可以将红色手牌当【闪】、黑色手牌当【无懈可击】使用或打出。准备阶段，你获得“节钺”牌。',
    'sgs.yaowu':'锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，你令伤害来源选择一项：回复1点体力或摸一张牌',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-109.html','https://www.sanguosha.cn/pc/hero-detail-150.html','https://wiki.biligame.com/msgs/于禁','https://wiki.biligame.com/msgs/华雄']),
});
const SK=SGS_FOLLOWING_JIEYUE_SKILL_IDS,ID=SGS_FOLLOWING_JIEYUE_RULE_IDS;
const FIELD='sgs_following_jieyue_state',PILE='sgs_following_jieyue_pile';
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const own=(g,a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,skill)===true;
const binding=(g,a,skill)=>JSON.stringify([g.general_skill_binding_id?.(a,skill)??pid(g,a),rule_hero(a)?.id??null]);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const physicalId=(g,c)=>g.card_history_material_id?.(c)??c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const fact=(g,m)=>m?{zone:m.zone,index:m.index??null,physical_id:physicalId(g,m.card),name:m.card?.name??null,type:m.card?.type??null,suit:m.card?.suit??null,rank:m.card?.rank??null}:null;
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['cancel','pass','0','n','no','decline'].includes(String(value));
const meta=(g,a,stage,extra={})=>({skill:'节钺',skill_id:SK.jieyue,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),references=new WeakMap();
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||['end','prepare','cleanup','responses','yaowu'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Jieyue/Yaowu state');
  return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('节钺/耀武需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,end:{},prepare:{},cleanup:{},responses:{},yaowu:{}};
  validateState(s);if(s.owner_id!==owner)throw Error('节钺/耀武状态不能转移给另一人物');return s;
}
/** Receipt serialization only. Physical pile is serialized by the trusted host;
 * copying a hero template must not call this on the donor or copy its pile. */
export const sgs_clone_following_jieyue_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('节钺/耀武需要稳定事件ID');
  const s=state(g,a),k=JSON.stringify(id),rk=`${space}:${k}`,old=s[space][k];
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((r,i)=>r!==refs[i]))throw Error('同一节钺/耀武事件不能更换事实或实体牌');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('节钺/耀武事务中断；须恢复原协程或按输入日志重放'),{code:'SGS_FOLLOWING_JIEYUE_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[space][k]={event_id:id,request,status:'offered',committed:false};running.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';running.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
function movement(g,pile=false){
  if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('节钺需要 validate / on_committed 原子移牌边界');
  if(pile&&typeof g.sgs_move_jieyue_pile!=='function')throw Error('节钺需要独立实体牌堆移牌内核');
}
function commitCards(receipt,property,expected,cards){
  if(!Array.isArray(cards)||cards.length!==expected.length||cards.some((c,i)=>c!==expected[i]))throw Error('节钺原子移牌提交与实体牌选择不一致');
  receipt[property]=true;receipt.status=property;
}
function checkReceipt(result,committed){if(result?.committed&&!committed)throw Error('节钺原子移牌缺少 on_committed 回执');}
/** Owner-bound physical zone. No mutation and no fallback to an ordinary zone. */
export function sgs_jieyue_pile(g,a){
  const cards=a?.[PILE]??[];
  if(!Array.isArray(cards)||cards.some(c=>!c||c.virtual)||new Set(cards).size!==cards.length)throw Error('Invalid physical Jieyue pile');
  if(a?.[FIELD]&&validateState(a[FIELD]).owner_id!==pid(g,a))throw Error('节钺牌堆不能继承另一人物的事务所有权');
  return [...cards];
}
function materials(g,a,{discard=false,chooser=a,private_view=true}={}){
  if(!live(a))return [];
  const rows=[...(a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,
    label:private_view?`手牌${index+1}：${card}`:`手牌${index+1}（暗牌）`})),
    ...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])];
  return rows.filter(m=>m.card&&!m.card.virtual&&(!discard||g.can_discard_material?.(a,m,{chooser,source_skill:SK.jieyue})!==false
    &&g.can_discard_card?.(a,m.card,{chooser,zone:m.zone,source_skill:SK.jieyue,reason:'节钺'})!==false));
}
export const sgs_jieyue_cost_materials=(g,a)=>materials(g,a,{discard:true}).filter(m=>m.zone==='hand');
export const sgs_jieyue_contribution_materials=(g,target)=>materials(g,target).filter(m=>g.can_pay_materials?.(target,[m])!==false&&g.can_move_material?.(target,m,{to:'jieyue',source_skill:SK.jieyue})!==false);
export const sgs_jieyue_discard_materials=(g,a,target)=>materials(g,target,{discard:true,chooser:a,private_view:false});
export const sgs_jieyue_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
function phase(g,a,e,kind){
  return own(g,a,SK.jieyue)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_actor===seat(g,a)
    &&g.turn_phase===kind&&e?.actor===a&&e.turn_id===g.turn_event_counter&&stable(e.turn_id)&&stable(e.phase_event_id)
    &&!e.closed&&!e.cancelled&&!e.skipped;
}
export const sgs_jieyue_end_available=(g,a,e)=>phase(g,a,e,'end_phase')&&!a[FIELD]?.end?.[JSON.stringify(e.phase_event_id)]
  &&sgs_jieyue_cost_materials(g,a).length>0&&sgs_jieyue_targets(g,a).length>0;
const aiCost=(g,m)=>g.material_ai_cost?.(m)??(m.card.type===CardType.POISON?0:m.zone==='hand'?1:2);
/** Host AI uses own hand and public equipment/counts. Humans may choose any
 * other actor, including an empty ally; range and allegiance never bar legality. */
export function sgs_ai_jieyue_plan(g,a,e){
  if(!sgs_jieyue_end_available(g,a,e))return null;
  const target=sgs_jieyue_targets(g,a).find(p=>g.side_of(p)!==g.side_of(a)&&((p.hand?.length??0)>0||SLOTS.some(s=>p[s])));
  return target?{target,material:[...sgs_jieyue_cost_materials(g,a)].sort((x,y)=>aiCost(g,x)-aiCost(g,y))[0]}:null;
}
export function sgs_ai_jieyue_contribution(g,target,owner){
  const options=sgs_jieyue_contribution_materials(g,target).sort((x,y)=>aiCost(g,x)-aiCost(g,y));
  if(!options.length)return null;
  if(g.side_of(target)===g.side_of(owner))return options[0];
  // Give the cheapest own card only to protect a more valuable public equip.
  return options.some(m=>SLOTS.includes(m.zone)&&aiCost(g,m)>aiCost(g,options[0]))?options[0]:null;
}
async function chooseCost(g,a,e,valid){
  while(valid()){
    const options=sgs_jieyue_cost_materials(g,a);if(!options.length)return null;
    const answer=await g.view.ask_line('节钺：弃置一张手牌，或不发动',{kind:'select_hand',player_id:seat(g,a),
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动'}],meta:meta(g,a,'jieyue_cost',{phase_event_id:e.phase_event_id,material_zones:['hand']})});
    if(!valid()||pass(answer))return null;const chosen=select(options,answer);if(exact(sgs_jieyue_cost_materials(g,a),chosen))return chosen;
  }return null;
}
async function chooseTarget(g,a,e,valid){
  while(valid()){
    const targets=sgs_jieyue_targets(g,a),options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hand.length}张手牌）`}));if(!targets.length)return null;
    const answer=await g.view.ask_line('节钺：选择一名其他角色',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不支付'}],
      meta:meta(g,a,'jieyue_target',{phase_event_id:e.phase_event_id,allow_allies:true,allow_empty:true})});
    if(!valid()||pass(answer))return null;const selected=select(options,answer);const target=targets.find(p=>String(pid(g,p))===selected?.id);if(target)return target;
  }return null;
}
async function contribution(g,a,target,eventId,valid){
  if(target.is_ai)return sgs_ai_jieyue_contribution(g,target,a);
  while(valid()){
    const options=sgs_jieyue_contribution_materials(g,target);if(!options.length)return null;
    const answer=await g.view.ask_line(`节钺：将一张手牌或装备置于${a.name}的节钺牌堆？`,{kind:'choice',player_id:seat(g,target),
      options:[...options.map(({id,label})=>({id,label})),{id:'decline',label:'不放置，由对方弃置我的一张牌'}],
      meta:meta(g,target,'jieyue_contribute',{event_id:eventId,pile_owner:seat(g,a),material_zones:['hand',...SLOTS]})});
    if(!valid()||pass(answer))return null;const chosen=select(options,answer);if(exact(sgs_jieyue_contribution_materials(g,target),chosen))return chosen;
  }return null;
}
async function chooseDiscard(g,a,target,eventId,valid){
  while(valid()){
    const options=sgs_jieyue_discard_materials(g,a,target);if(!options.length)return null;
    if(a.is_ai)return options.find(m=>SLOTS.includes(m.zone))??options[0];
    const answer=await g.view.ask_line(`节钺：弃置${target.name}的一张手牌或装备`,{kind:'select_target_card',player_id:seat(g,a),
      options:options.map(({id,label})=>({id,label})),meta:meta(g,a,'jieyue_discard',{event_id:eventId,owner_seat:seat(g,target),hidden_hands:true,mandatory:true,material_zones:['hand',...SLOTS]})});
    if(!valid())return null;const chosen=select(options,answer);if(exact(sgs_jieyue_discard_materials(g,a,target),chosen))return chosen;
  }return null;
}
export async function sgs_jieyue_end_phase(g,a,_target,e={}){
  const id=e.phase_event_id,request={owner_id:pid(g,a),phase_event_id:id??null,turn_id:e.turn_id??null,actor_id:pid(g,e.actor)};
  if(a?.[FIELD]?.end?.[JSON.stringify(id)]){ticket(g,a,'end',id,request,[e.actor]);return false;}
  if(!sgs_jieyue_end_available(g,a,e))return false;
  movement(g);const bound=binding(g,a,SK.jieyue),t=ticket(g,a,'end',id,request,[e.actor]),r=t.receipt;
  const valid=()=>phase(g,a,e,'end_phase')&&e.phase_event_id===id&&e.turn_id===request.turn_id&&binding(g,a,SK.jieyue)===bound;
  try{
    let target,cost;if(a.is_ai){ // no hidden-hand AI query
      const candidates=sgs_jieyue_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)&&((p.hand?.length??0)>0||SLOTS.some(s=>p[s])));
      target=candidates[0];cost=[...sgs_jieyue_cost_materials(g,a)].sort((x,y)=>aiCost(g,x)-aiCost(g,y))[0];
    }else{cost=await chooseCost(g,a,e,valid);if(cost)target=await chooseTarget(g,a,e,valid);}
    const legal=()=>valid()&&Boolean(exact(sgs_jieyue_cost_materials(g,a),cost))&&sgs_jieyue_targets(g,a).includes(target);
    if(!cost||!target||!legal()){r.declined=true;t.finish();return false;}
    r.target_id=pid(g,target);r.cost=fact(g,cost);
    const paid=await g.public_card_loss(a,[cost],{to:'discard',visibility:'public',reason:'节钺',action:'discard',source:a,source_skill:SK.jieyue,
      move_id:`jieyue:${JSON.stringify([pid(g,a),id])}:cost`,validate:legal,on_committed:cards=>commitCards(r,'committed',[cost.card],cards)});
    checkReceipt(paid,r.committed);if(!r.committed){t.finish();return false;}
    // Cost remains paid if nested losses remove the skill/kill an actor. The
    // owner-bound pile cannot be recreated after its source was removed.
    const canContinue=()=>own(g,a,SK.jieyue)&&binding(g,a,SK.jieyue)===bound&&live(target)&&ongoing(g);
    if(canContinue()){
      const chosen=await contribution(g,a,target,id,canContinue);r.contributed=false;
      if(chosen&&canContinue()){
        r.contribution=fact(g,chosen);
        const legalContribution=()=>canContinue()&&Boolean(exact(sgs_jieyue_contribution_materials(g,target),chosen));
        const moved=await g.public_card_loss(target,[chosen],{payment:true,to:'jieyue',recipient:a,pile_id:SGS_JIEYUE_PILE_ID,visibility:'public',reason:'节钺',action:'place',source:a,source_skill:SK.jieyue,
          move_id:`jieyue:${JSON.stringify([pid(g,a),id])}:contribution`,validate:legalContribution,on_committed:cards=>commitCards(r,'contributed',[chosen.card],cards)});
        checkReceipt(moved,r.contributed);
      }
      if(!r.contributed&&canContinue()){
        r.declined_contribution=true;const discarded=await chooseDiscard(g,a,target,id,canContinue);
        if(discarded&&canContinue()){
          r.discard=fact(g,discarded);
          const moved=await g.public_card_loss(target,[discarded],{to:'discard',visibility:'public',reason:'节钺',action:'discard',source:a,source_skill:SK.jieyue,
            move_id:`jieyue:${JSON.stringify([pid(g,a),id])}:discard`,validate:()=>canContinue()&&Boolean(exact(sgs_jieyue_discard_materials(g,a,target),discarded)),on_committed:cards=>commitCards(r,'discarded',[discarded.card],cards)});
          checkReceipt(moved,r.discarded);
        }
      }
    }
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export async function sgs_jieyue_prepare(g,a,_target,e={}){
  const id=e.phase_event_id,request={owner_id:pid(g,a),phase_event_id:id??null,turn_id:e.turn_id??null,actor_id:pid(g,e.actor)};
  if(a?.[FIELD]?.prepare?.[JSON.stringify(id)]){ticket(g,a,'prepare',id,request,[e.actor]);return false;}
  if(!phase(g,a,e,'prepare'))return false;
  movement(g,true);const bound=binding(g,a,SK.jieyue),t=ticket(g,a,'prepare',id,request,[e.actor]),r=t.receipt;
  try{
    const cards=sgs_jieyue_pile(g,a);r.cards=cards.map(card=>fact(g,{zone:'jieyue',card}));
    if(cards.length){
      const moved=await g.sgs_move_jieyue_pile(a,cards,{to:'hand',recipient:a,visibility:'public',reason:'节钺准备阶段收回',action:'obtain',source_skill:SK.jieyue,
        move_id:`jieyue:${JSON.stringify([pid(g,a),id])}:retrieve`,validate:()=>phase(g,a,e,'prepare')&&e.phase_event_id===id&&e.turn_id===request.turn_id&&binding(g,a,SK.jieyue)===bound&&cards.every(c=>sgs_jieyue_pile(g,a).includes(c)),
        on_committed:actual=>commitCards(r,'committed',cards,actual)});
      checkReceipt(moved,r.committed);
    }
    t.finish();return r.committed;
  }catch(error){t.fail(error);throw error;}
}
/** Final-death / actual skill-loss cleanup, called independently of live hooks.
 * An owned skill cannot be cleared with a forged ordinary cleanup request. */
export async function sgs_jieyue_cleanup(g,a,{event_id,reason='skill_loss'}={}){
  const request={owner_id:pid(g,a),reason};
  if(a?.[FIELD]?.cleanup?.[JSON.stringify(event_id)]){ticket(g,a,'cleanup',event_id,request);return false;}
  if(!['skill_loss','death'].includes(reason)||(reason==='death'?!a?.dead:typeof g.has_general_skill!=='function'||g.has_general_skill(a,SK.jieyue)!==false))return false;
  movement(g,true);const t=ticket(g,a,'cleanup',event_id,request),r=t.receipt;
  try{
    const cards=sgs_jieyue_pile(g,a);r.cards=cards.map(card=>fact(g,{zone:'jieyue',card}));
    if(cards.length){const moved=await g.sgs_move_jieyue_pile(a,cards,{to:'discard',visibility:'public',reason:`节钺${reason==='death'?'阵亡':'失去技能'}清理`,action:'cleanup',source_skill:SK.jieyue,
      move_id:`jieyue:${JSON.stringify([pid(g,a),event_id])}:cleanup`,validate:()=>cards.every(c=>sgs_jieyue_pile(g,a).includes(c)),on_committed:actual=>commitCards(r,'committed',cards,actual)});checkReceipt(moved,r.committed);}
    t.finish();return r.committed;
  }catch(error){t.fail(error);throw error;}
}
const responseType=type=>type===CardType.SHAN?CardType.SHAN:type===SGS_JIEYUE_RESPONSE_WUXIE?SGS_JIEYUE_RESPONSE_WUXIE:null;
function responseWindow(type,c={}){
  const action=c.action_kind??(type===SGS_JIEYUE_RESPONSE_WUXIE?'use':'play');
  return ['use','play'].includes(action)&&c.legal!==false&&!c.prohibited&&!c.cancelled&&!c.closed&&!c.response_prohibited
    &&!(action==='use'?c.use_prohibited:c.play_prohibited)&&!(type===CardType.SHAN&&c.dodge_blocked)
    &&(type!==SGS_JIEYUE_RESPONSE_WUXIE||c.stage==='nullification'||c.kind==='nullification'||c.nullification===true);
}
export function sgs_jieyue_response_options(g,a,type,context={}){
  type=responseType(type);if(!type||!own(g,a,SK.jieyue)||!sgs_jieyue_pile(g,a).length||!responseWindow(type,context))return [];
  const required=type===CardType.SHAN?CardColor.RED:CardColor.BLACK;
  return materials(g,a).filter(m=>m.zone==='hand'&&(g.effective_color?.(m.card,a,{zone:'hand',action:'respond'})??m.card.color)===required)
    .map(m=>({...m,source_skill:SK.jieyue,source_skill_id:SK.jieyue,response_type:type,binding_id:binding(g,a,SK.jieyue),label:`节钺：${m.label} → ${type}`}));
}
export function sgs_jieyue_response_valid(g,a,option,context={}){
  if(option?.source_skill!==SK.jieyue&&option?.source_skill_id!==SK.jieyue)return false;
  return Boolean(exact(sgs_jieyue_response_options(g,a,option.response_type,context),option))&&option.binding_id===binding(g,a,SK.jieyue);
}
export function sgs_jieyue_response_card(g,a,type,option,context={}){
  if(responseType(type)!==option?.response_type||!sgs_jieyue_response_valid(g,a,option,context))return null;
  const physical=option.card;return new Card(type,type===CardType.SHAN?CardType.SHAN:CardType.SCROLL,{virtual:true,materials:[physical],
    suit:g.effective_suit?.(physical,a,{zone:'hand',action:'respond'})??physical.suit,color:g.effective_color?.(physical,a,{zone:'hand',action:'respond'})??physical.color,
    rank:physical.rank,source_skill:SK.jieyue,source_skill_id:SK.jieyue,logical_category:type===CardType.SHAN?'basic':'ordinary_trick',action_kind:context.action_kind??(type===CardType.SHAN?'play':'use')});
}
/** Both conversions spend one real HAND card, never the enabling pile. The host
 * assigns a stable response_event_id and supplies the real legal response window.
 * Wuxie history/counterspell integration runs in on_resolved or defer_cleanup. */
export async function sgs_commit_jieyue_response(g,a,type,option,context={}){
  if(option?.source_skill!==SK.jieyue&&option?.source_skill_id!==SK.jieyue)return {handled:false,success:false};
  const id=context.response_event_id??context.event_id,request={owner_id:pid(g,a),type,material:fact(g,option),
    action_kind:context.action_kind??(type===CardType.SHAN?'play':'use'),card_use_id:context.card_use_id??null,branch_id:context.branch_id??null};
  if(a?.[FIELD]?.responses?.[JSON.stringify(id)]){ticket(g,a,'responses',id,request,[option.card]);return {handled:true,success:false,duplicate:true};}
  const logical=sgs_jieyue_response_card(g,a,type,option,context);if(!logical)return {handled:true,success:false};
  movement(g);if(typeof g.finish_processing_card!=='function')throw Error('节钺响应需要实体处理区清理');
  const t=ticket(g,a,'responses',id,request,[option.card]),r=t.receipt,physical=option.card;let success=false;
  try{
    const moved=await g.public_card_loss(a,[option],{to:'processing',visibility:'public',reason:`节钺·${type}`,action:request.action_kind,source:a,source_skill:SK.jieyue,
      move_id:`jieyue:${JSON.stringify([pid(g,a),id])}:response`,validate:()=>{const current=sgs_jieyue_response_card(g,a,type,option,context);return Boolean(current)&&current.suit===logical.suit&&current.color===logical.color&&current.rank===logical.rank;},on_committed:cards=>{
        commitCards(r,'committed',[physical],cards);
        // The host establishes true card-use history synchronously, before any
        // nested hand/equipment loss callback can inspect the committed action.
        const callback=context.on_committed?.(logical,physical);
        if(callback&&typeof callback.then==='function')throw Error('节钺 on_committed 历史回调必须同步提交');
      }});
    checkReceipt(moved,r.committed);
    if(!r.committed||!live(a)||!responseWindow(type,context)||!g.processing_cards?.includes(physical)){t.finish();return {handled:true,success:false};}
    // A committed conversion is not undone by losing the skill/enabling pile in
    // a nested loss callback; authority was captured at payment.
    g.view.emit(`${a.name}发动节钺，将${physical}当${type}${request.action_kind==='use'?'使用':'打出'}。`);
    let event=null;
    if(type===CardType.SHAN){
      if(typeof g.after_response_card!=='function')throw Error('节钺闪需要响应事件内核');
      event=await g.after_response_card(a,CardType.SHAN,{...context,card:logical,virtual:true,source_skill:SK.jieyue,source_skill_id:SK.jieyue,material:option,
        physical_card:physical,physical_cards:[physical],response_provenance:{kind:'skill_conversion',skill_id:SK.jieyue,physical_cards:[physical],material_zone:'hand'}});
    }
    if(context.on_resolved)await context.on_resolved(logical,physical,event);
    r.success=true;success=true;t.finish();return {handled:true,success:true,card:logical,event};
  }catch(error){t.fail(error);throw error;}finally{if(r.committed&&!(success&&context.defer_cleanup))g.finish_processing_card(logical);}
}
/** No owner-effective recalculation here: source_card or damage_card_identity
 * must carry the already-frozen actual use face, including virtual colorless
 * mixed materials. Chain branches retain the same effective Slash channel. */
function damageIdentity(e){
  const frozen=e.damage_card_identity??e.effective_card_identity,card=frozen??e.source_card;
  return {type:card?.type??null,name:card?.name??null,color:frozen?frozen.color:(e.effective_face?.color??e.source_card?.color??null),
    card_use_id:e.card_use_id??null};
}
const damageId=e=>e.damage_event_id??e.event_id;
function yaowuWindow(g,a,e){
  const identity=damageIdentity(e);
  return own(g,a,SK.yaowu)&&ongoing(g)&&e.target===a&&Boolean(e.source&&!e.source.dead)&&(e.damage??e.amount)>0
    &&!e.prevented&&!e.cancelled&&!e.closed&&!e.dying_resolved&&!e.hp_deducted&&!e.hp_loss
    &&['sha','chain'].includes(e.kind)&&is_sha_type(identity.type)&&identity.color===CardColor.RED;
}
export function sgs_ai_yaowu_choice(g,source){return source.hp<(g.effective_max_hp?.(source)??rule_hero(source)?.max_hp)?'recover':'draw';}
export async function sgs_before_receiving_damage_yaowu(g,a,e={}){
  const id=damageId(e),identity=damageIdentity(e),source=e.source,request={owner_id:pid(g,a),target_id:pid(g,e.target),source_id:pid(g,source),
    amount:e.damage??e.amount??null,kind:e.kind??null,nature:e.nature??null,identity};
  if(a?.[FIELD]?.yaowu?.[JSON.stringify(id)]){ticket(g,a,'yaowu',id,request,[source,e.target,e.source_card]);return false;}
  if(!yaowuWindow(g,a,e))return false;
  if(typeof g.draw_cards!=='function'||typeof g.recover_hp!=='function')throw Error('耀武需要实际摸牌与回复体力内核');
  const bound=binding(g,a,SK.yaowu),t=ticket(g,a,'yaowu',id,request,[source,e.target,e.source_card]),r=t.receipt;
  const valid=()=>yaowuWindow(g,a,e)&&binding(g,a,SK.yaowu)===bound&&e.source===source&&damageId(e)===id
    &&JSON.stringify(damageIdentity(e))===JSON.stringify(identity);
  try{
    let choice=null;
    while(valid()&&!choice){
      const wounded=source.hp<(g.effective_max_hp?.(source)??rule_hero(source)?.max_hp);
      if(!wounded)choice='draw';else if(source.is_ai)choice=sgs_ai_yaowu_choice(g,source);
      else{
        const options=[{id:'recover',label:'回复1点体力'},{id:'draw',label:'摸一张牌'}];
        const answer=await g.view.ask_line(`${a.name}的耀武：选择回复1点体力或摸一张牌`,{kind:'choice',player_id:seat(g,source),options,
          meta:{skill:'耀武',skill_id:SK.yaowu,stage:'yaowu_choice',event_id:id,private_to:seat(g,source),receiver_seat:seat(g,a),mandatory:true,before_hp_loss:true}});
        if(valid())choice=select(options,answer)?.id??null;
      }
    }
    if(!choice||!valid()){t.finish();return false;}
    if(choice==='recover'&&source.hp>=(g.effective_max_hp?.(source)??rule_hero(source)?.max_hp))choice='draw';
    r.choice=choice;r.committed=true;r.status='committed';
    if(choice==='recover')r.recovered=await g.recover_hp(source,1,{source:a,source_skill:SK.yaowu,recovery_event_id:`yaowu:${JSON.stringify([pid(g,a),id])}:recover`});
    else{const cards=await g.draw_cards(source,1);r.drawn=Array.isArray(cards)?cards.length:1;}
    g.view.emit(`${a.name}触发耀武，${source.name}${choice==='recover'?'回复1点体力':'摸一张牌'}。`);
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_following_jieyue_public_state(g,a){
  const pile=sgs_jieyue_pile(g,a);return {pile_id:SGS_JIEYUE_PILE_ID,pile_count:pile.length,
    cards:pile.map(card=>fact(g,{zone:'jieyue',card})),public:true,owner_id:pid(g,a),
    red_hand_as_shan:own(g,a,SK.jieyue)&&pile.length>0,black_hand_as_wuxie:own(g,a,SK.jieyue)&&pile.length>0};
}
export function sgs_following_jieyue_skill_definitions({SkillHooks}){
  return {hooks:{[ID.yujin]:SkillHooks({on_end_phase:[sgs_jieyue_end_phase],on_prepare:[sgs_jieyue_prepare],response_material_name:'节钺',resolve_response_material:[sgs_commit_jieyue_response]}),
    [ID.huaxiong]:SkillHooks({before_receiving_damage:[sgs_before_receiving_damage_yaowu]})},active:{}};
}
for(const hook of [sgs_jieyue_end_phase,sgs_jieyue_prepare,sgs_commit_jieyue_response])hook.source_skill_id=SK.jieyue;
sgs_before_receiving_damage_yaowu.source_skill_id=SK.yaowu;
