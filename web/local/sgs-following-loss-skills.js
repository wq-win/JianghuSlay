/** Base 身份 陆逊 / 孙尚香. Publisher catalog snapshot: 2026-10-15.
 * Atomic movement, cross-pack aliases and lifecycle rules are explicit Jianghu
 * interpretations; this is NOT certification of the current executable client.
 * The host owns movements/recovery; this module never clones physical cards.
 */
import {CardType} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_FOLLOWING_LOSS_RULE_IDS=Object.freeze({
  luxun:'sgs.adapted.base.hero.lu-xun',sunshangxiang:'sgs.adapted.base.hero.sun-shang-xiang',
});
export const SGS_FOLLOWING_LOSS_SKILL_IDS=Object.freeze({qianxun:'sgs.qianxun',lianying:'sgs.lianying',xiaoji:'sgs.xiaoji',jieyin:'sgs.jieyin'});
export const SGS_FOLLOWING_LOSS_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',
  current_client_rules_verified:false,current_client_hp_verified:false,
  cross_pack_interpretation:true,
  heroes:Object.freeze([
    Object.freeze({id:SGS_FOLLOWING_LOSS_RULE_IDS.luxun,max_hp:3,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.qianxun','sgs.lianying']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FOLLOWING_LOSS_RULE_IDS.sunshangxiang,max_hp:3,gender:'female',source_faction:'吴',skill_ids:Object.freeze(['sgs.xiaoji','sgs.jieyin']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-14.html','https://www.sanguosha.cn/pc/hero-detail-25.html',
    'https://www.sanguosha.com.tw/newsinfo_918.html','https://www.sanguosha.com.tw/newsinfo_909.html']),
});
const SK=SGS_FOLLOWING_LOSS_SKILL_IDS,ID=SGS_FOLLOWING_LOSS_RULE_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SLOT_TYPE=Object.freeze({weapon:CardType.WEAPON,armor:CardType.ARMOR,offensive_horse:CardType.OFFENSIVE_HORSE,defensive_horse:CardType.DEFENSIVE_HORSE});
const OWNER=Object.freeze({[SK.qianxun]:ID.luxun,[SK.lianying]:ID.luxun,[SK.xiaoji]:ID.sunshangxiang,[SK.jieyin]:ID.sunshangxiang});
const seat=(game,actor)=>game.player_id?.(actor)??game.seat_of(actor);
const living=actor=>!!actor&&!actor.dead;
const own=(actor,skill)=>{
  if(!living(actor)||actor.skills_disabled||actor.disabled_skill_ids?.includes(skill))return false;
  const ids=actor.effective_skill_ids??rule_hero(actor)?.skill_ids;
  return ids?ids.includes(skill):rule_hero(actor)?.id===OWNER[skill];
};
const maxHP=(game,actor)=>game.effective_max_hp?.(actor)??rule_hero(actor)?.max_hp;
const physicalId=card=>card?.physical_id??card?.physicalCardId??card?.derived_identity??null;
const physicalRecord=card=>({physical_id:physicalId(card),name:card?.name??null,type:card?.type??null,suit:card?.suit??null,rank:card?.rank??null});
const samePhysical=(a,b)=>!!a&&!!b&&(a===b||physicalId(a)!==null&&physicalId(a)===physicalId(b));
const key=value=>JSON.stringify(value);
const stable=value=>typeof value==='string'&&value.length>0||typeof value==='number'&&Number.isSafeInteger(value)&&value>=0;
const runtime=new WeakMap();
function state(actor){
  const s=actor.sgs_following_loss_state??={version:1,counter:0,lianying:{},xiaoji:{},jieyin:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['lianying','xiaoji','jieyin'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS following loss state');
  return s;
}
function runtimeFor(actor){let r=runtime.get(actor);if(!r)runtime.set(actor,r={active:new Set(),references:new Map()});return r;}
const replayError=()=>Object.assign(Error('技能事件中断；请从原操作日志重放，不能再次摸牌或支付。'),{code:'SGS_FOLLOWING_REPLAY_REQUIRED'});
/** Claim BEFORE a prompt or draw. Stored receipts contain only JSON values;
 * same-session references additionally reject forged IDs for another object.
 */
function claim(actor,namespace,eventId,request,references){
  if(!stable(eventId))throw Error('SGS loss hook requires a stable source event ID');
  const s=state(actor),k=key(eventId),rt=runtimeFor(actor),rk=`${namespace}:${k}`,previous=s[namespace][k];
  if(previous){
    if(JSON.stringify(previous.request)!==JSON.stringify(request))throw Error('SGS source event ID changed its immutable movement facts');
    const refs=rt.references.get(rk);if(refs&&refs.some((v,i)=>v!==references[i]))throw Error('SGS source event ID replaced its physical card');
    if(previous.status!=='done'&&!rt.active.has(rk))throw replayError();
    return null;
  }
  const receipt=s[namespace][k]={event_id:eventId,request,status:'pending',stage:'offer',accepted:false,drawn:0};
  rt.references.set(rk,references);rt.active.add(rk);
  return {receipt,finish(){receipt.status='done';receipt.stage='complete';rt.active.delete(rk);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);rt.active.delete(rk);}};
}
const select=(options,value)=>options.find(o=>o.id===value)??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['pass','cancel','0','n','no'].includes(String(value));
async function optionalDraw(game,actor,skill,count,eventId,eligible,receipt){
  let accepted=actor.is_ai;
  if(!actor.is_ai){
    while(true){
      const answer=String(await game.view.ask_line(`${skill}：是否摸${count}张牌？`,{
        kind:'choice',player_id:game.seat_of(actor),options:[{id:'draw',label:`发动${skill}，摸${count}张牌`},{id:'pass',label:'不发动'}],
        meta:{skill,skill_id:skill==='连营'?SK.lianying:SK.xiaoji,stage:skill==='连营'?'lianying_draw':'xiaoji_draw',event_id:eventId},
      }));
      if(pass(answer)||answer==='2'){accepted=false;break;}
      if(['draw','y','yes','1'].includes(answer)){accepted=true;break;}
      game.view.emit('请选择发动或不发动。');
    }
  }
  receipt.accepted=accepted;
  if(!accepted||!eligible())return false;
  receipt.stage='draw';
  const cards=await game.draw_cards(actor,count);receipt.drawn=Array.isArray(cards)?cards.length:count;
  game.view.emit(`${actor.name}发动${skill}，摸${receipt.drawn}张牌。`);
  return true;
}

/** This is target prohibition, not effect immunity or a distance modifier.
 * Host passes the effective declared card; material/printed source faces must
 * not override a converted Slash. Judgment transfers pass effective identity.
 */
export function sgs_qianxun_prohibits(_game,target,_source,card,context={}){
  if(!own(target,SK.qianxun)||!card)return false;
  const name=context.effective_name??context.delayed_identity?.name??card.name;
  const effect=context.effect_id??context.delayed_identity?.effect_id??card.effect_id;
  return ['顺手牵羊','探囊取物','乐不思蜀','画地为牢'].includes(name)
    ||['trick.snatch','trick.skip_play'].includes(effect);
}

/** One receipt for the WHOLE positive-H -> zero-H atomic loss, even if several
 * cards left. Snapshot counts win over later nested gains; death does not.
 */
export async function sgs_after_cards_lost_lianying(game,actor,event={}){
  const materials=event.materials??[];
  if(event.committed!==true||event.cancelled||event.atomic_complete===false||!Number.isInteger(event.hand_before)
    ||event.hand_before<=0||event.hand_after!==0||!materials.some(m=>m.zone==='hand'&&m.card&&!m.card.virtual)
    ||!own(actor,SK.lianying)||event.owner&&event.owner!==actor)return false;
  const eventId=event.move_id;
  const request={actor_id:seat(game,actor),hand_before:event.hand_before,hand_after:event.hand_after,
    materials:materials.map(m=>({zone:m.zone,index:m.index??null,card:physicalRecord(m.card)}))};
  const ticket=claim(actor,'lianying',eventId,request,materials.map(m=>m.card));if(!ticket)return false;
  try{
    const result=await optionalDraw(game,actor,'连营',1,eventId,()=>own(actor,SK.lianying),ticket.receipt);
    ticket.finish();return result;
  }catch(error){ticket.fail(error);throw error;}
}

/** Equipment loss is per actual physical E card, unlike whole-hand Lianying.
 * Deliberately DOES NOT inherit Hua's lord-kills-loyalist suppression exception.
 */
export async function sgs_on_equipment_leave_xiaoji(game,actor,card,context={}){
  const slot=context.from_zone??context.slot,face=context.equipment_face??card;
  if(context.committed!==true||context.cancelled||!SLOTS.includes(slot)||context.slot&&context.slot!==slot
    ||!card||card.virtual||face.type!==SLOT_TYPE[slot]||SLOTS.some(s=>samePhysical(actor?.[s],card))||!own(actor,SK.xiaoji))return false;
  // A batch's move+slot is the same immutable physical exit even if an adapter
  // redelivers it with a freshly allocated outer equipment-loss notification ID.
  const eventId=stable(context.move_id)?`move-equipment:${key([context.move_id,slot])}`:context.equipment_loss_id;
  const request={actor_id:seat(game,actor),slot,card:physicalRecord(card),reason:context.reason??null};
  const ticket=claim(actor,'xiaoji',eventId,request,[card]);if(!ticket)return false;
  try{
    const result=await optionalDraw(game,actor,'枭姬',2,eventId,()=>own(actor,SK.xiaoji),ticket.receipt);
    ticket.finish();return result;
  }catch(error){ticket.fail(error);throw error;}
}

/** Positive monotonic host play-phase IDs only. A turn change, UI refresh,
 * form acquisition or clearing used_active_skills cannot manufacture a phase.
 */
export function sgs_jieyin_phase_key(game,actor){
  return Number.isSafeInteger(game.play_phase_event_counter)&&game.play_phase_event_counter>0
    ?key([seat(game,actor),game.play_phase_event_counter]):null;
}
export const sgs_jieyin_materials=(game,actor)=>game.skill_material_options(actor).filter(m=>m.zone==='hand'&&m.card&&!m.card.virtual);
export function sgs_jieyin_targets(game,actor){
  return game.all_players().filter(p=>p!==actor&&p.alive&&p.hp<maxHP(game,p)
    &&(game.effective_gender?.(p)??rule_hero(p)?.gender)==='male');
}
function phaseAvailable(game,actor,target=null,ownReceipt=null){
  const phaseKey=sgs_jieyin_phase_key(game,actor),receipt=actor.sgs_following_loss_state?.jieyin?.[phaseKey];
  if(!own(actor,SK.jieyin)||!actor.alive||!game.is_own_play_phase(actor)||!phaseKey
    ||receipt&&receipt!==ownReceipt||sgs_jieyin_materials(game,actor).length<2)return false;
  const targets=sgs_jieyin_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export const sgs_jieyin_available=(game,actor,target=null)=>phaseAvailable(game,actor,target);
const exactPair=(game,actor,materials)=>{
  if(!Array.isArray(materials)||materials.length!==2||samePhysical(materials[0]?.card,materials[1]?.card))return null;
  const current=sgs_jieyin_materials(game,actor),pair=materials.map(m=>current.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id)));
  return pair.every(Boolean)?pair:null;
};
export async function sgs_resolve_jieyin(game,actor,target,materials){
  if(!sgs_jieyin_available(game,actor,target))return false;
  const pair=exactPair(game,actor,materials);if(!pair)return false;
  if(typeof game.public_card_loss!=='function'||game.public_card_loss_supports_on_committed!==true||typeof game.recover_hp!=='function')throw Error('结姻需要完整的原子移牌 on_committed / validate 与 recover_hp 内核');
  const phaseKey=sgs_jieyin_phase_key(game,actor),turn=game.turn_event_counter,s=state(actor);
  if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('SGS skill transaction counter exhausted');
  const receipt=s.jieyin[phaseKey]={phase_key:phaseKey,event_id:`jieyin:${key([seat(game,actor),++s.counter])}`,target_id:seat(game,target),status:'pending',stage:'cost',paid:false,recovered:[]};
  const samePhase=()=>turn===game.turn_event_counter&&phaseKey===sgs_jieyin_phase_key(game,actor);
  const valid=()=>samePhase()&&phaseAvailable(game,actor,target,receipt)&&!!exactPair(game,actor,pair);
  try{
    const moved=await game.public_card_loss(actor,pair,{to:'discard',visibility:'public',reason:'结姻',action:'discard',
      move_id:`${receipt.event_id}:cost`,validate:valid,on_committed:cards=>{
        if(cards.length!==2||cards.some((card,index)=>card!==pair[index].card))throw Error('结姻必须一次提交恰好两张已选实体手牌');
        receipt.paid=true;receipt.stage='loss_effects';
      }});
    if(!moved?.committed){delete s.jieyin[phaseKey];return false;}
    if(!receipt.paid)throw Error('结姻移牌内核遗漏 on_committed；禁止重付费用');
    // The already committed skill remains in flight despite form/phase changes.
    // It neither resurrects finalized deaths nor refunds a lawful cost.
    receipt.stage='recover';
    for(const participant of [actor,target]){
      const amount=participant.alive?await game.recover_hp(participant,1,{source:actor,source_skill:SK.jieyin,
        recovery_event_id:`${receipt.event_id}:recover:${seat(game,participant)}`}):0;
      receipt.recovered.push({player_id:seat(game,participant),amount});
    }
    receipt.status='done';receipt.stage='complete';
    game.view.emit(`${actor.name}发动结姻，自己回复${receipt.recovered[0].amount}点，${target.name}回复${receipt.recovered[1].amount}点体力。`);
    return true;
  }catch(error){
    // Fail closed after ANY possibly committed loss. Only explicit no-commit
    // results permit a fresh attempt; replay reconstructs interrupted actions.
    receipt.status='failed';receipt.error=String(error?.message??error);throw error;
  }
}
function parsePair(options,answer){
  const pair=String(answer).trim().split(/\s+/).filter(Boolean).map(value=>options.find(o=>o.id===(/^\d+$/.test(value)?`hand:${Number(value)}`:value)));
  return pair.length===2&&pair.every(Boolean)&&!samePhysical(pair[0].card,pair[1].card)?pair:null;
}
export async function sgs_player_jieyin(game,actor,_fallback,args=[]){
  if(!sgs_jieyin_available(game,actor))return true;
  const phaseKey=sgs_jieyin_phase_key(game,actor),turn=game.turn_event_counter,options=sgs_jieyin_materials(game,actor);
  let pair;
  if(args.length){pair=parsePair(options,args.join(' '));if(!pair)return false;}
  else while(!pair){
    const answer=String(await game.view.ask_line('结姻：选择两张不同手牌（编号空格分隔），或取消',{
      kind:'select_hand',player_id:game.seat_of(actor),min_count:2,max_count:2,
      options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill:'结姻',skill_id:SK.jieyin,stage:'jieyin_materials',private_to:game.seat_of(actor),material_zones:['hand']},
    }));
    if(pass(answer))return true;pair=parsePair(options,answer);if(!pair)game.view.emit('必须选择两张不同手牌，已装备的牌不能支付结姻。');
  }
  const targets=sgs_jieyin_targets(game,actor);let target=null;
  if(targets.length){
    const choices=targets.map(p=>({id:game.seat_of(p),label:`${p.name}（${p.hp}/${maxHP(game,p)}体力）`}));
    while(!target){
      const answer=String(await game.view.ask_line('结姻：选择另一名受伤男性',{
        kind:'choice',player_id:game.seat_of(actor),options:[...choices,{id:'cancel',label:'取消，不消耗牌'}],
        meta:{skill:'结姻',skill_id:SK.jieyin,stage:'jieyin_target',private_to:game.seat_of(actor),card_name:'结姻·其他受伤男性'},
      }));
      if(pass(answer))return true;
      const chosen=select(choices,answer);target=targets.find(p=>game.seat_of(p)===chosen?.id);
      if(!target)game.view.emit('请选择另一名受伤男性，或取消。');
    }
  }
  if(target&&turn===game.turn_event_counter&&phaseKey===sgs_jieyin_phase_key(game,actor))await sgs_resolve_jieyin(game,actor,target,pair);
  return true;
}
export async function sgs_ai_jieyin(game,actor){
  if(!sgs_jieyin_available(game,actor))return false;
  const target=sgs_jieyin_targets(game,actor).filter(p=>game.side_of(p)===game.side_of(actor))
    .sort((a,b)=>a.hp-b.hp||(maxHP(game,b)-b.hp)-(maxHP(game,a)-a.hp))[0];
  if(!target)return false;
  // Only OWN material faces, public gender/HP and public allegiance are read.
  const pair=sgs_jieyin_materials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b)).slice(0,2);
  return sgs_resolve_jieyin(game,actor,target,pair);
}
export function sgs_following_loss_skill_definitions({SkillHooks,ActiveSkillDef}){
  const jieyin=new ActiveSkillDef({skill_id:'结姻',hotkey:'q',button_label:'结姻',
    help_text:'结姻：每个自己的出牌阶段限一次，弃两张手牌，选择另一名受伤男性，双方各回复1点体力；自己满血也可发动。',
    player:sgs_player_jieyin,ai:sgs_ai_jieyin,available:sgs_jieyin_available,arg_mode:'none',min_cards:2,max_cards:2,card_filter:'any'});
  jieyin.targets=sgs_jieyin_targets;jieyin.owns_target_selection=true;
  return {hooks:{
    [ID.luxun]:SkillHooks({prohibit_card_target:[sgs_qianxun_prohibits],after_cards_lost:[sgs_after_cards_lost_lianying]}),
    [ID.sunshangxiang]:SkillHooks({on_equipment_leave:[sgs_on_equipment_leave_xiaoji]}),
  },active:{[ID.sunshangxiang]:[jieyin]}};
}
