/** Selected mainland mobile BASE 身份 小乔 / 魏延, catalog 2026-10-15.
 * Historical timing corroboration and Jianghu policies JP1/2/3/7 are explicit;
 * this module does not certify the current executable mobile client.
 * Host owns damage, rescue, actual movement and recovery. Physical cards are
 * never manufactured, mutated, or added to damage provenance by these skills.
 */
import {CardSuit,CardColor} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_NEXT_TRANSFER_RECOVERY_RULE_IDS=Object.freeze({xiaoqiao:'sgs.adapted.base.hero.xiao-qiao',weiyan:'sgs.adapted.base.hero.wei-yan'});
export const SGS_NEXT_TRANSFER_RECOVERY_SKILL_IDS=Object.freeze({tianxiang:'sgs.tianxiang',hongyan:'sgs.hongyan',kuanggu:'sgs.kuanggu'});
export const SGS_NEXT_TRANSFER_RECOVERY_SOURCE=Object.freeze({
  product:'sanguosha_mobile_cn',variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',
  current_client_rules_verified:false,current_client_hp_verified:false,source_only_exact_for_every_edge:false,
  policy_ids:Object.freeze(['JP1','JP2','JP3','JP7']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_NEXT_TRANSFER_RECOVERY_RULE_IDS.xiaoqiao,max_hp:3,gender:'female',source_faction:'吴',skill_ids:Object.freeze(['sgs.tianxiang','sgs.hongyan']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_NEXT_TRANSFER_RECOVERY_RULE_IDS.weiyan,max_hp:4,gender:'male',source_faction:'蜀',skill_ids:Object.freeze(['sgs.kuanggu']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-30.html','https://www.sanguosha.cn/pc/hero-detail-27.html',
    'https://wiki.biligame.com/msgs/小乔','https://wiki.biligame.com/msgs/魏延']),
});
const ID=SGS_NEXT_TRANSFER_RECOVERY_RULE_IDS,SK=SGS_NEXT_TRANSFER_RECOVERY_SKILL_IDS;
const OWNERS=Object.freeze({[SK.tianxiang]:ID.xiaoqiao,[SK.hongyan]:ID.xiaoqiao,[SK.kuanggu]:ID.weiyan});
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const ACTIONS=Object.freeze(['use','respond','response','discard','give','card_use','card_response','skill_cost']);
const living=p=>Boolean(p&&!p.dead),live=p=>living(p)&&p.hp>0;
const identity=(g,p)=>p?(g.player_id?.(p)??g.seat_of(p)):null;
const own=(p,skill)=>living(p)&&!p.skills_disabled&&!p.disabled_skill_ids?.includes(skill)
  &&((p.effective_skill_ids??rule_hero(p)?.skill_ids)?.includes(skill)??rule_hero(p)?.id===OWNERS[skill]);
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>=0;
const key=x=>JSON.stringify(x);
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const samePhysical=(a,b)=>a===b||physicalId(a)!==null&&physicalId(a)===physicalId(b);
const cardRecord=c=>({physical_id:physicalId(c),name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const physical=g=>[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
  ...g.all_players().flatMap(p=>[...(p.hand??[]),...(p.judgment_cards??[]),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...SLOTS.map(s=>p[s]).filter(Boolean)])];
const uniquePhysical=(g,c)=>Boolean(c&&!c.virtual&&physical(g).filter(x=>samePhysical(c,x)).length===1);
const incoming=e=>e?.damage??e?.amount??0;
const isDamage=e=>!!e&&Number.isSafeInteger(incoming(e))&&incoming(e)>0&&!e.cancelled&&!e.prevented&&!e.replaced&&!['lose_hp','hp_loss'].includes(e.kind);
const ongoing=g=>!g.winner&&(typeof g.resolution_should_continue!=='function'||g.resolution_should_continue());
const maxHP=(g,p)=>g.effective_max_hp?.(p)??rule_hero(p)?.max_hp;
const pass=x=>['pass','cancel','0','n','no'].includes(String(x));
const select=(options,x)=>options.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?options[Number(x)-1]:null);
const runtime=new WeakMap();
const rtFor=p=>{let r=runtime.get(p);if(!r)runtime.set(p,r={active:new Set(),references:new Map()});return r;};
const replayError=()=>Object.assign(Error('技能事务尚未结束，须从原动作日志重放，不能重付或重复回复。'),{code:'SGS_NEXT_REPLAY_REQUIRED'});
function state(p){
  const s=p.sgs_next_transfer_recovery_state??={version:1,counter:0,tianxiang:{},kuanggu:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['tianxiang','kuanggu'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS transfer/recovery receipt state');
  return s;
}
/** Local state has no Card/Player references. Restore completed receipts freely;
 * interrupted receipts are reconstructed by the host action journal, never by
 * replaying a possibly committed mutation against a detached pending snapshot. */
export function sgs_clone_transfer_recovery_state(p){return p?.sgs_next_transfer_recovery_state?JSON.parse(JSON.stringify(state(p))):null;}
function claim(p,namespace,k,request,refs){
  const s=state(p),rt=rtFor(p),rk=`${namespace}:${k}`,previous=s[namespace][k];
  if(previous){
    if(key(previous.request)!==key(request))throw Error('同一技能事件ID不能改写原伤害事实');
    const prior=rt.references.get(rk);if(prior&&prior.some((v,i)=>v!==refs[i]))throw Error('同一技能事件不能替换原角色或实体牌');
    if(previous.status!=='done'&&!rt.active.has(rk))throw replayError();
    return null;
  }
  if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('SGS transfer/recovery receipt counter exhausted');
  const receipt=s[namespace][k]={event_id:`${namespace}:${++s.counter}`,request,status:'pending',stage:'offer'};
  rt.active.add(rk);rt.references.set(rk,refs);
  return {receipt,finish(){receipt.status='done';receipt.stage='complete';rt.active.delete(rk);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);rt.active.delete(rk);}};
}

/** Explicit judgment owner takes precedence over former card ownership. Other
 * contexts require an actual owned hand card; equipped/J/processing cards do
 * not gain Hongyan merely because a caller supplies an old owner. */
export function sgs_hongyan_suit(card,owner,context={}){
  if(!card||card.fixed_judgment_result)return card?.suit;
  const judged=context.judged_actor??context.judgment_actor;
  if(judged)return own(judged,SK.hongyan)&&card.suit===CardSuit.SPADE?CardSuit.HEART:card.suit;
  const zone=context.zone??context.from_zone;
  if(zone!=null&&zone!=='hand'||context.action!=null&&!ACTIONS.includes(context.action))return card.suit;
  return own(owner,SK.hongyan)&&owner.hand?.includes(card)&&card.suit===CardSuit.SPADE?CardSuit.HEART:card.suit;
}
export function sgs_hongyan_color(card,owner,context={}){
  const suit=sgs_hongyan_suit(card,owner,context);
  return suit===CardSuit.HEART||suit===CardSuit.DIAMOND?CardColor.RED:suit===CardSuit.SPADE||suit===CardSuit.CLUB?CardColor.BLACK:card?.color;
}
/** Host captures this before a committed hand action and stores it in that
 * action's provenance. It is a detached face, not a replacement physical Card.
 * Never treat an untrusted saved snapshot as authority for new card rules. */
export function sgs_hongyan_action_face(card,owner,context={}){
  const suit=sgs_hongyan_suit(card,owner,context);
  return Object.freeze({suit,color:sgs_hongyan_color(card,owner,context),rank:card?.rank??null,
    source_skill:suit!==card?.suit?SK.hongyan:null});
}
export const sgs_tianxiang_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
export function sgs_tianxiang_materials(_g,a){
  return (a?.hand??[]).flatMap((card,index)=>!card.virtual&&sgs_hongyan_suit(card,a,{zone:'hand',action:'discard'})===CardSuit.HEART
    ?[{zone:'hand',index,card,id:`hand:${index+1}`,label:`手牌${index+1}：${card}`}]:[]);
}
const exactMaterial=(g,a,m)=>sgs_tianxiang_materials(g,a).find(x=>x.card===m?.card&&x.zone===m.zone&&x.index===m.index&&(m.id==null||x.id===m.id));
function windowKey(g,a,e){if(!stable(e?.damage_event_id))throw Error('天香需要稳定的 damage_event_id');return key([e.damage_event_id,e.transfers?.length??0,identity(g,a)]);}
function tianxiangEligible(g,a,e){return own(a,SK.tianxiang)&&live(a)&&e?.target===a&&isDamage(e)&&ongoing(g)&&sgs_tianxiang_materials(g,a).length>0&&sgs_tianxiang_targets(g,a).length>0;}
export function sgs_tianxiang_available(g,a,e){
  return Boolean(tianxiangEligible(g,a,e)&&!a.sgs_next_transfer_recovery_state?.tianxiang?.[windowKey(g,a,e)]);
}
const transferRequest=(g,a,e)=>({damage_event_id:e.damage_event_id,transfer_index:e.transfers?.length??0,actor_id:identity(g,a),source_id:identity(g,e.source),
  target_id:identity(g,e.target),damage:incoming(e),kind:e.kind??null,nature:e.nature??'normal',physical_cards:(e.physical_cards??[]).map(cardRecord)});
const transferRefs=(a,e)=>[a,e.source??null,e.target,...(e.physical_cards??[])];
function transferTicket(g,a,e){return claim(a,'tianxiang',windowKey(g,a,e),transferRequest(g,a,e),transferRefs(a,e));}
async function commitTransfer(g,a,e,material,target,ticket){
  const receipt=ticket.receipt,form=rule_hero(a)?.id,current=exactMaterial(g,a,material);
  if(!current||!tianxiangEligible(g,a,e)||!sgs_tianxiang_targets(g,a).includes(target)||!uniquePhysical(g,current.card)){ticket.finish();return null;}
  if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('天香需要原子 public_card_loss / validate / on_committed 内核');
  receipt.stage='cost';receipt.paid=false;receipt.target_id=identity(g,target);receipt.cost=cardRecord(current.card);
  const move_id=`sgs.tianxiang:${windowKey(g,a,e)}:cost`;receipt.move_id=move_id;
  const valid=()=>key(transferRequest(g,a,e))===key(receipt.request)&&rule_hero(a)?.id===form&&tianxiangEligible(g,a,e)&&sgs_tianxiang_targets(g,a).includes(target)&&!!exactMaterial(g,a,current)&&uniquePhysical(g,current.card);
  const result=await g.public_card_loss(a,[current],{to:'discard',visibility:'public',reason:'天香',action:'discard',source_skill:SK.tianxiang,move_id,validate:valid,
    on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==current.card)throw Error('天香必须提交所选一张实体手牌');receipt.paid=true;receipt.stage='loss_effects';receipt.move_id=movement.move_id;}});
  if(!result?.committed){ticket.finish();return null;}
  if(!receipt.paid)throw Error('天香移牌内核遗漏提交回执；禁止重付成本');
  // JP2 poison interoperability: commitment survives source death/form loss.
  // Finish all loss/rescue first; a dead destination or final match ends it.
  if(!live(target)||!ongoing(g)){receipt.ended_without_transfer=true;ticket.finish();return null;}
  receipt.stage='transferred';g.view.emit(`${a.name}发动天香，将本次完整伤害转移给${target.name}。`);
  const transfer={target,transfer:{skill:'天香',skill_id:SK.tianxiang,from:a,cost:current.card,cost_committed:true,move_id:receipt.move_id},
    after_resolve:async finalEvent=>{
      if(receipt.status==='done'||receipt.status==='pending'&&receipt.stage==='late_draw')return 0;
      if(receipt.status==='failed')throw replayError();
      try{
        const recipient=finalEvent?.target;
        // The latest effective callback wins; earlier/intermediate holders
        // cannot create phantom draws on the same actual positive damage.
        if(finalEvent?.damage_event_id!==e.damage_event_id||recipient!==target||!live(recipient)||!isDamage(finalEvent)||finalEvent.transfer_draw_settled){ticket.finish();return 0;}
        finalEvent.transfer_draw_settled=true;receipt.stage='late_draw';
        const count=Math.max(0,maxHP(g,recipient)-recipient.hp);receipt.draw_count=count;
        if(count){await g.draw_cards(recipient,count);g.view.emit(`${recipient.name}在天香伤害结算后，按当前缺血摸${count}张牌。`);}
        ticket.finish();return count;
      }catch(error){ticket.fail(error);throw error;}
    }};
  return transfer;
}
export async function sgs_commit_tianxiang(g,a,e,material,target){
  if(!tianxiangEligible(g,a,e))return null;
  const ticket=transferTicket(g,a,e);if(!ticket)return null;
  try{return await commitTransfer(g,a,e,material,target,ticket);}catch(error){ticket.fail(error);throw error;}
}
/** Public HP/armor/team only; never inspect an enemy hand or deck order. */
export function sgs_ai_tianxiang_choice(g,a,e){
  const targets=sgs_tianxiang_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a));
  const score=p=>{const damage=Math.max(0,incoming(e)-(p.defense_bonus??0));return (damage>=p.hp?100:0)+damage*4-Math.max(0,maxHP(g,p)-p.hp+damage);};
  const target=targets.sort((x,y)=>score(y)-score(x)||String(identity(g,x)).localeCompare(String(identity(g,y))))[0];
  const material=sgs_tianxiang_materials(g,a).sort((x,y)=>(g.material_ai_cost?.(x)??0)-(g.material_ai_cost?.(y)??0)||x.index-y.index)[0];
  return target&&material?{target,material}:null;
}
export async function sgs_before_damage_tianxiang(g,a,e){
  if(!tianxiangEligible(g,a,e))return null;
  const ticket=transferTicket(g,a,e);if(!ticket)return null;
  const receipt=ticket.receipt,form=rule_hero(a)?.id;
  const valid=()=>key(transferRequest(g,a,e))===key(receipt.request)&&form===rule_hero(a)?.id&&tianxiangEligible(g,a,e);
  try{
    let choice;
    if(a.is_ai)choice=sgs_ai_tianxiang_choice(g,a,e);
    else{
      let material,target;
      while(valid()&&!material){
        receipt.stage='material';const options=sgs_tianxiang_materials(g,a);
        const answer=await g.view.ask_line('天香：弃一张红桃手牌，转移即将承受的完整伤害，或取消',{
          kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动天香'}],
          meta:{skill:'天香',skill_id:SK.tianxiang,stage:'tianxiang_material',private_to:g.seat_of(a),material_zones:['hand'],damage:incoming(e),damage_event_id:e.damage_event_id}});
        if(pass(answer)||!valid()){ticket.finish();return null;}material=select(options,answer);
        if(!material)g.view.emit('请选择一张当前有效红桃手牌，或取消。');
      }
      while(valid()&&material&&!target){
        receipt.stage='target';const targets=sgs_tianxiang_targets(g,a),options=targets.map(p=>({id:g.seat_of(p),label:`${p.name}（${p.hp}/${maxHP(g,p)}体力）`}));
        const answer=await g.view.ask_line('天香：选择一名其他存活角色，或取消',{
          kind:'choice',player_id:g.seat_of(a),options:[...options,{id:'cancel',label:'取消，不消耗牌'}],
          meta:{skill:'天香',skill_id:SK.tianxiang,stage:'tianxiang_target',private_to:g.seat_of(a),damage:incoming(e),damage_event_id:e.damage_event_id}});
        if(pass(answer)||!valid()){ticket.finish();return null;}const selected=select(options,answer);target=targets.find(p=>g.seat_of(p)===selected?.id);
        if(!target)g.view.emit('请选择当前存活的其他角色，或取消。');
      }
      if(material&&target&&valid()){
        receipt.stage='confirm';
        const accepted=await g.view.ask_confirm(`天香：确认弃置所选手牌，将${incoming(e)}点伤害转移给${target.name}？`,{
          player_id:g.seat_of(a),meta:{skill:'天香',skill_id:SK.tianxiang,stage:'tianxiang_confirm',private_to:g.seat_of(a),damage_event_id:e.damage_event_id}});
        if(accepted&&valid())choice={material,target};
      }
    }
    if(!choice||!valid()){ticket.finish();return null;}
    return await commitTransfer(g,a,e,choice.material,choice.target,ticket);
  }catch(error){ticket.fail(error);throw error;}
}

/** Call once AFTER all redirects and final equipment commitments, immediately
 * BEFORE actual HP subtraction. Each chain recipient gets its own event ID. */
export function sgs_snapshot_kuanggu(g,source,e){
  if(!own(source,SK.kuanggu)||e?.source!==source||!live(source)||!live(e.target)||!isDamage(e))return null;
  if(!stable(e.damage_event_id))throw Error('狂骨需要稳定的 damage_event_id');
  const distance=source===e.target?0:g.distance_between(source,e.target);
  if(!Number.isFinite(distance)||distance<0)throw Error('狂骨需要有效的伤害前距离快照');
  const snapshot=Object.freeze({version:1,damage_event_id:e.damage_event_id,source_id:identity(g,source),target_id:identity(g,e.target),
    damage:incoming(e),distance,eligible:distance<=1,kind:e.kind??null,nature:e.nature??'normal'});
  if(e.sgs_kuanggu_snapshot&&key(e.sgs_kuanggu_snapshot)!==key(snapshot))throw Error('狂骨伤害前快照不可被后续距离覆盖');
  e.sgs_kuanggu_snapshot??=snapshot;return e.sgs_kuanggu_snapshot;
}
/** Mandatory source window: dying -> Kuanggu -> Sanjian -> receiver skills ->
 * derived cross-game weapon hooks -> delayed transfer draw (JP3 host order).
 * Target death never suppresses a surviving source's recovery. */
export async function sgs_after_source_damage_kuanggu(g,source,amount,target,e){
  const snap=e?.sgs_kuanggu_snapshot;
  if(!snap||!snap.eligible||!own(source,SK.kuanggu)||!live(source)||e.source!==source||e.target!==target||!isDamage(e)||e.dying_resolved!==true)return 0;
  if(snap.version!==1||snap.damage_event_id!==e.damage_event_id||snap.source_id!==identity(g,source)||snap.target_id!==identity(g,target)||snap.damage!==amount||amount!==incoming(e)
    ||snap.distance>1||snap.kind!==(e.kind??null)||snap.nature!==(e.nature??'normal'))throw Error('狂骨结算与伤害前快照不一致');
  if(typeof g.recover_hp!=='function')throw Error('狂骨需要有回执的 recover_hp 内核');
  const ticket=claim(source,'kuanggu',key([e.damage_event_id,identity(g,source)]),snap,[source,target]);if(!ticket)return 0;
  const receipt=ticket.receipt;receipt.stage='recover';receipt.points=[];let recovered=0;
  try{
    for(let point=1;point<=amount;point++){
      if(!live(source)||!own(source,SK.kuanggu))break;
      const recovery_event_id=`sgs.kuanggu:${key([e.damage_event_id,identity(g,source),point])}`;
      const part={point,recovery_event_id,status:'pending',amount:0};receipt.points.push(part);
      part.amount=await g.recover_hp(source,1,{source,source_skill:SK.kuanggu,recovery_event_id,damage_event_id:e.damage_event_id,damage_point:point});
      if(!Number.isInteger(part.amount)||part.amount<0||part.amount>1)throw Error('狂骨每点伤害最多回复一点体力');
      part.status='done';recovered+=part.amount;
    }
    receipt.recovered=recovered;ticket.finish();if(recovered)g.view.emit(`${source.name}触发狂骨，回复${recovered}点体力。`);return recovered;
  }catch(error){ticket.fail(error);throw error;}
}
export function sgs_next_transfer_recovery_skill_definitions({SkillHooks}){
  return {hooks:{
    [ID.xiaoqiao]:SkillHooks({before_damage_transfer:[sgs_before_damage_tianxiang]}),
    [ID.weiyan]:SkillHooks({before_damage_hp_loss:[sgs_snapshot_kuanggu],after_source_damage:[sgs_after_source_damage_kuanggu]}),
  },active:{}};
}
