/** Mainland-mobile base identity 荀彧 / 徐晃, publisher snapshot 2026-10-15.
 * Source rules and explicit mixed-game policies: docs/sgs-fire/control-integration-contract.md.
 * This isolated module registers nothing and never substitutes direct HP/skip flags
 * for real comparison, damage, movement or delayed-card transactions.
 */
import {Card,CardType,CardColor,SHA_CARD_TYPES} from './models.js';
import {rule_hero} from './effective-hero.js';
import {printed_card_fields} from './card-face-projection.js';
import {pindian_hand_options,pindian_rank,resolve_pindian} from './pindian.js';

export const SGS_FIRE_CONTROL_RULE_IDS=Object.freeze({xunyu:'sgs.adapted.base.hero.xun-yu',xuhuang:'sgs.adapted.base.hero.xu-huang'});
export const SGS_FIRE_CONTROL_SKILL_IDS=Object.freeze({quhu:'sgs.quhu',jieming:'sgs.jieming',duanliang:'sgs.duanliang'});
export const SGS_FIRE_CONTROL_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',current_client_rules_verified:false,current_client_hp_verified:false,
  source_only_exact_for_every_edge:false,host_policy_ids:Object.freeze(['H1','H2','H3','H4','H5','H6','H7','H8']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_FIRE_CONTROL_RULE_IDS.xunyu,max_hp:3,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.quhu','sgs.jieming']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FIRE_CONTROL_RULE_IDS.xuhuang,max_hp:4,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.duanliang']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-35.html','https://www.sanguosha.cn/pc/guide-info-45.html',
    'https://www.sanguosha.cn/pc/hero-detail-42.html','https://gltjk.com/sanguosha/rules/flow/rankcompare.html']),
});
const ID=SGS_FIRE_CONTROL_RULE_IDS,SK=SGS_FIRE_CONTROL_SKILL_IDS;
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const BASIC=new Set([...SHA_CARD_TYPES,CardType.SHAN,CardType.TAO,CardType.WINE,CardType.POISON]);
const EQUIPMENT=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const OWNER={[SK.quhu]:ID.xunyu,[SK.jieming]:ID.xunyu,[SK.duanliang]:ID.xuhuang};
const live=p=>Boolean(p?.alive&&!p.dead);
const pid=(g,p)=>g.player_id?.(p)??g.seat_of(p);
const key=value=>JSON.stringify(value);
const stable=value=>typeof value==='string'&&value.length>0||Number.isSafeInteger(value)&&value>=0;
const own=(p,skill)=>{
  if(!live(p)||p.skills_disabled||p.disabled_skill_ids?.includes(skill))return false;
  const skills=p.effective_skill_ids??rule_hero(p)?.skill_ids;
  return skills?skills.includes(skill):rule_hero(p)?.id===OWNER[skill];
};
const idlePlay=(g,p)=>live(p)&&g.is_own_play_phase(p)&&!p.skip_play_stage&&!g.response_stack?.length
  &&!g.card_history_stack?.length&&!g.damage_stack?.length&&!g.judgment_stack?.length;
const pass=value=>['pass','cancel','0','no','n'].includes(String(value));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id));
const print=c=>printed_card_fields(c);
const cardRecord=c=>({physical_id:c.physical_id??c.physicalCardId??null,name:print(c).name,type:print(c).type,suit:c.suit,rank:c.rank});
const allCards=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),
  ...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...SLOTS.map(s=>p[s]).filter(Boolean)])];
function uniquePhysical(g,c){
  if(!c||c.virtual)return false;const id=c.physical_id??c.physicalCardId??null;
  return allCards(g).filter(x=>x===c||id!==null&&(x.physical_id??x.physicalCardId)===id).length===1;
}
function state(actor){
  const s=actor.sgs_fire_control_state??={version:1,counter:0,quhu:{},jieming:{},duanliang:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['quhu','jieming','duanliang'].some(n=>!s[n]||typeof s[n]!=='object'||Array.isArray(s[n])))throw Error('Invalid SGS fire control state');
  return s;
}
const runtime=new WeakMap();
function runtimeFor(a){let r=runtime.get(a);if(!r)runtime.set(a,r={tasks:new Map(),refs:new Map()});return r;}
const pendingError=()=>Object.assign(Error('技能事务尚未完成；恢复原协程或重放输入日志，不能重新支付或摸牌。'),{code:'SGS_FIRE_CONTROL_REPLAY_REQUIRED'});
function prior(actor,namespace,id,request,refs=[]){
  const r=actor.sgs_fire_control_state?.[namespace]?.[key(id)];if(!r)return null;
  if(JSON.stringify(r.request)!==JSON.stringify(request))throw Error('同一火包技能事务ID不能替换人物、材料或原事件');
  const rt=runtimeFor(actor),rk=`${namespace}:${key(id)}`,old=rt.refs.get(rk);
  if(old&&old.some((v,i)=>v!==refs[i]))throw Error('同一火包技能事务不能替换实体引用');
  if(rt.tasks.has(rk))return rt.tasks.get(rk);
  if(r.status==='done')return Promise.resolve(r.result);
  throw pendingError();
}
function begin(actor,namespace,id,request,refs,execute){
  const s=state(actor),rt=runtimeFor(actor),rk=`${namespace}:${key(id)}`;
  const receipt=s[namespace][key(id)]={event_id:id,request,status:'pending',stage:'start',committed:false};
  rt.refs.set(rk,refs);
  const task=Promise.resolve().then(()=>execute(receipt)).then(result=>{
    receipt.status='done';receipt.stage='complete';receipt.result=result;return result;
  },error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>{if(rt.tasks.get(rk)===task)rt.tasks.delete(rk);});
  rt.tasks.set(rk,task);return task;
}
function nextId(g,a,skill){const s=state(a);if(s.counter===Number.MAX_SAFE_INTEGER)throw Error('SGS fire control counter exhausted');return `${skill}:${pid(g,a)}:${++s.counter}`;}
export const sgs_quhu_phase_key=(g,a)=>Number.isSafeInteger(g.play_phase_event_counter)&&g.play_phase_event_counter>0
  ?key([pid(g,a),g.play_phase_event_counter]):null;
/** All public legality and AI PLAN functions are pure: no RNG, receipt/ID writes,
 * logs, prompts, moves or opponent-hand face reads. Rank validity of the target's
 * hand is deliberately left to the private shared comparison resolver. */
export const sgs_quhu_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&p.hp>a.hp&&p.hand.length>0);
function quhuAvailable(g,a,target=null,receipt=null){
  const phase=sgs_quhu_phase_key(g,a),old=a.sgs_fire_control_state?.quhu?.[key(phase)];
  if(!own(a,SK.quhu)||!idlePlay(g,a)||phase===null||old&&old!==receipt||!pindian_hand_options(a).length)return false;
  const targets=sgs_quhu_targets(g,a);return target==null?targets.length>0:targets.includes(target);
}
export const sgs_quhu_available=(g,a,target=null)=>quhuAvailable(g,a,target);
export function sgs_quhu_unavailable_reason(g,a){
  if(!own(a,SK.quhu)||!idlePlay(g,a)||!sgs_quhu_phase_key(g,a))return '只能在拥有驱虎的自己的空闲出牌阶段发动';
  if(a.sgs_fire_control_state?.quhu?.[key(sgs_quhu_phase_key(g,a))])return '本出牌阶段已经发动或正在结算驱虎';
  if(!pindian_hand_options(a).length)return '自己需要一张合法手牌用于拼点';
  return sgs_quhu_targets(g,a).length?'':'需要一名当前体力严格更高且有手牌的其他角色';
}
export const sgs_quhu_victims=(g,compared)=>live(compared)?g.all_players().filter(p=>p!==compared&&live(p)&&g.in_actual_attack_range(compared,p)):[];
export function sgs_ai_quhu_plan(g,a){
  if(!sgs_quhu_available(g,a))return null;
  const card=pindian_hand_options(a).filter(m=>!(print(m.card).type===CardType.POISON&&g.youjian_events_enabled?.()
    &&a.hp<=1+(g.youjian_poison_armor_snapshot?.(a)?1:0))).sort((x,y)=>pindian_rank(y.card)-pindian_rank(x.card)||x.index-y.index)[0]?.card;
  if(!card||pindian_rank(card)<10)return null;
  const plans=sgs_quhu_targets(g,a).map(target=>({target,card,victims:sgs_quhu_victims(g,target).filter(p=>g.side_of(p)!==g.side_of(a))}))
    .filter(p=>p.victims.length).sort((x,y)=>x.target.hand.length-y.target.hand.length||y.victims.length-x.victims.length);
  return plans[0]??null;
}
async function quhuDamage(g,a,compared,result,receipt,dependencies){
  receipt.stage='result';receipt.outcome=result.outcome;
  // H2/H3: no refund after a comparison cost, but a finally dead participant
  // cannot originate a new cross-game skill damage or choose a fresh victim.
  if(!live(a)||!live(compared)){receipt.interrupted='participant_dead';return;}
  let victim=a;
  if(result.won){
    const victims=sgs_quhu_victims(g,compared);if(!victims.length){receipt.no_victim=true;return;}
    if(dependencies.choose_victim)victim=await dependencies.choose_victim(a,compared,victims,result);
    else if(a.is_ai)victim=[...victims].sort((x,y)=>(g.side_of(x)===g.side_of(a))-(g.side_of(y)===g.side_of(a))||y.hp-x.hp)[0];
    else victim=await g.choose_card_target(a,victims,{card_name:'驱虎·伤害目标',stage:'quhu_victim',cancellable:false,source_skill_id:SK.quhu});
    // Selection is mandatory after reveal. A stale callback cannot invent a
    // new victim or re-open the already consumed skill transaction.
    if(!live(a)||!live(compared)||!sgs_quhu_victims(g,compared).includes(victim)){receipt.interrupted='victim_unavailable';return;}
  }
  if(!live(victim))return;
  receipt.victim_id=pid(g,victim);receipt.damage_started=true;
  receipt.damage=await g.apply_damage(victim,1,{source:compared,card_user:null,kind:'skill',method:'skill',nature:'normal',
    source_card:null,physical_cards:[],source_skill:SK.quhu,source_skill_id:SK.quhu,skill_initiator:a,
    compare_id:result.compare_id,damage_event_id:`${result.compare_id}:quhu-damage`,
    message:'{name}受到驱虎 {damage} 点伤害，剩余血量 {hp}。'});
}
export function sgs_resolve_quhu(g,a,target,{initiator_card=null,dependencies={}}={}){
  const phase=sgs_quhu_phase_key(g,a),request={actor_id:pid(g,a),target_id:pid(g,target),phase_id:phase};
  try{const existing=prior(a,'quhu',phase,request,[a,target,initiator_card]);if(existing)return existing;}catch(error){return Promise.reject(error);}
  if(!sgs_quhu_available(g,a,target)||initiator_card&&!pindian_hand_options(a).some(m=>m.card===initiator_card))return Promise.resolve(false);
  if(resolve_pindian.result_callback_before_cleanup!==true)return Promise.reject(Error('驱虎需要拼点结果在处理区清理前的 on_result 内核'));
  const turn=g.turn_event_counter,form=rule_hero(a)?.id,compare_id=nextId(g,a,SK.quhu);
  return begin(a,'quhu',phase,request,[a,target,initiator_card],async receipt=>{
    receipt.compare_id=compare_id;receipt.stage='compare';
    const result=await resolve_pindian(g,a,target,{compare_id,initiator_card,reason:'驱虎',source_skill_id:SK.quhu,disposition:'discard',
      dependencies:{...dependencies,on_reveal:async result=>{receipt.committed=true;await dependencies.on_reveal?.(result);}},
      validate:()=>turn===g.turn_event_counter&&phase===sgs_quhu_phase_key(g,a)&&form===rule_hero(a)?.id&&quhuAvailable(g,a,target,receipt),
      on_result:result=>quhuDamage(g,a,target,result,receipt,dependencies),
    });
    if(!result.committed){delete state(a).quhu[key(phase)];return false;}
    receipt.committed=true;return true;
  });
}
export async function sgs_player_quhu(g,a,_fallback,args=[]){
  if(!sgs_quhu_available(g,a))return true;
  if(args.length===1&&pass(args[0]))return true;
  if(args.length>1)return false;
  let card=args.length?pindian_hand_options(a).find(m=>m.id===args[0]||String(m.index+1)===String(args[0]))?.card:null;
  if(args.length&&!card)return false;
  const phase=sgs_quhu_phase_key(g,a),form=rule_hero(a)?.id;
  const target=await g.choose_card_target(a,sgs_quhu_targets(g,a),{card_name:'驱虎·拼点对象',stage:'quhu_target',cancellable:true,source_skill_id:SK.quhu});
  if(!target||phase!==sgs_quhu_phase_key(g,a)||form!==rule_hero(a)?.id||!sgs_quhu_available(g,a,target))return true;
  if(!card){
    const options=pindian_hand_options(a);
    while(!card){
      const answer=await g.view.ask_line('驱虎：选择自己的一张拼点手牌，或取消',{
        kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌或次数'}],
        meta:{skill:'驱虎',skill_id:SK.quhu,source_skill_id:SK.quhu,stage:'quhu_material',private_to:g.seat_of(a),material_zones:['hand']},
      });
      if(pass(answer))return true;card=select(options,answer)?.card;
    }
  }
  if(phase===sgs_quhu_phase_key(g,a)&&form===rule_hero(a)?.id)await sgs_resolve_quhu(g,a,target,{initiator_card:card});
  return true;
}
export const sgs_ai_quhu=(g,a)=>{const plan=sgs_ai_quhu_plan(g,a);return plan?sgs_resolve_quhu(g,a,plan.target,{initiator_card:plan.card}):Promise.resolve(false);};

export const sgs_jieming_targets=g=>g.all_players().filter(live);
export function sgs_jieming_draw_count(g,target){
  const max=g.effective_max_hp?.(target)??rule_hero(target)?.max_hp;
  return live(target)&&Number.isFinite(max)?Math.max(0,Math.min(Math.max(0,Math.floor(max)),5)-target.hand.length):0;
}
export function sgs_ai_jieming_target(g,a){
  return sgs_jieming_targets(g).filter(p=>g.side_of(p)===g.side_of(a)&&sgs_jieming_draw_count(g,p)>0)
    .sort((x,y)=>sgs_jieming_draw_count(g,y)-sgs_jieming_draw_count(g,x)||x.hp-y.hp)[0]??null;
}
function jiemingWindow(a,amount,event){
  return own(a,SK.jieming)&&Number.isInteger(amount)&&amount>0&&Number.isInteger(event.damage??amount)&&(event.damage??amount)>0
    &&(!event.target||event.target===a)&&event.after_rescue!==false&&event.dying_resolved!==false&&!event.dying_pending
    &&!event.cancelled&&!event.closed&&!['hp_loss','lose_hp'].includes(event.kind)
    &&(!event.damage_window||event.damage_window==='receiver_after_damage');
}
export function sgs_after_damage_jieming(g,a,amount,_source,event={}){
  if(!jiemingWindow(a,amount,event))return Promise.resolve(0);
  const id=event.damage_event_id;if(!stable(id))return Promise.reject(Error('节命需要稳定的实际伤害事件ID'));
  const points=event.damage??amount,request={actor_id:pid(g,a),damage_event_id:id,points};
  try{const existing=prior(a,'jieming',id,request,[a]);if(existing)return existing;}catch(error){return Promise.reject(error);}
  return begin(a,'jieming',id,request,[a],async receipt=>{
    receipt.points=[];let total=0;
    for(let point=1;point<=points;point++){
      if(!jiemingWindow(a,amount,event))break;
      const row={point,status:'offered',target_id:null,drawn:0};receipt.points.push(row);receipt.stage=`point:${point}`;
      let target;
      if(a.is_ai)target=sgs_ai_jieming_target(g,a);
      else {
        const targets=sgs_jieming_targets(g),options=targets.map(p=>({id:g.seat_of(p),label:`${p.name}：补至${Math.min(g.effective_max_hp?.(p)??rule_hero(p).max_hp,5)}张（现有${p.hand.length}张）`}));
        while(true){
          const answer=await g.view.ask_line(`节命：受到${points}点伤害，第${point}次选择补牌角色，或不发动`,{
            kind:'choice',player_id:g.seat_of(a),options:[...options,{id:'pass',label:'本次不发动'}],
            meta:{skill:'节命',skill_id:SK.jieming,stage:'jieming_target',damage_event_id:id,point,points},
          });
          if(pass(answer)){target=null;break;}
          const choice=select(options,answer);target=targets.find(p=>g.seat_of(p)===choice?.id);if(target)break;
        }
      }
      if(!target){row.status='passed';continue;}
      if(!jiemingWindow(a,amount,event)||!sgs_jieming_targets(g).includes(target)){row.status='unavailable';continue;}
      const count=sgs_jieming_draw_count(g,target);row.target_id=pid(g,target);row.requested=count;row.status='drawing';
      const drawn=count?await g.draw_cards(target,count):[];row.drawn=Array.isArray(drawn)?drawn.length:count;row.status='done';total+=row.drawn;
      g.view.emit(`${a.name}发动节命，${target.name}摸${row.drawn}张牌。`);
    }
    return total;
  });
}

/** Distance hook applies equally to a physical or a converted Supply Shortage.
 * Compose with the host's other lawful distance limits, including Infinity.
 */
export function sgs_duanliang_distance_limit(_g,a,card,base=1){
  return own(a,SK.duanliang)&&card?.type===CardType.SCROLL&&(card.name==='兵粮寸断'||card.effect_id==='trick.skip_draw')?Math.max(base,2):base;
}
const supplyView=(g,a,m=null)=>new Card('兵粮寸断',CardType.SCROLL,{virtual:true,materials:m?[m.card]:[],
  suit:m?g.effective_suit(m.card,a,{zone:m.zone,action:'card_use'}):null,color:m?g.effective_color(m.card,a,{zone:m.zone,action:'card_use'}):null,rank:m?m.card.rank:null,
  source_skill:SK.duanliang,source_skill_id:SK.duanliang,source_game:'三国杀',source_rule_id:ID.xuhuang,effect_id:'trick.skip_draw'});
export function sgs_duanliang_materials(g,a){
  if(!own(a,SK.duanliang))return [];
  return g.skill_material_options(a).filter(m=>m.card&&!m.card.virtual&&(m.zone==='hand'||SLOTS.includes(m.zone))
    &&(BASIC.has(print(m.card).type)||EQUIPMENT.has(print(m.card).type))
    &&g.effective_color(m.card,a,{zone:m.zone,action:'card_use'})===CardColor.BLACK);
}
export function sgs_duanliang_targets(g,a,material=null){
  if(!own(a,SK.duanliang))return [];
  const current=material?exact(sgs_duanliang_materials(g,a),material):null;
  if(material&&!current)return [];
  if(!current){const candidates=sgs_duanliang_materials(g,a);return g.all_players().filter(p=>candidates.some(m=>sgs_duanliang_targets(g,a,m).includes(p)));}
  const after=g.actor_after_material_cost(a,current),view=supplyView(g,a,current);
  // Parent can_place_delayed must compose the exported Supply-only distance
  // hook. Ordinary target prohibitions/duplicate rules remain owned by host.
  return g.all_players().filter(p=>p!==a&&live(p)&&g.can_place_delayed(after,p,view));
}
export function sgs_duanliang_available(g,a,target=null){
  if(!own(a,SK.duanliang)||!idlePlay(g,a))return false;
  const targets=sgs_duanliang_targets(g,a);return target==null?targets.length>0:targets.includes(target);
}
export function sgs_duanliang_unavailable_reason(g,a){
  if(!own(a,SK.duanliang)||!idlePlay(g,a))return '只能在拥有断粮的自己的空闲出牌阶段使用';
  if(!sgs_duanliang_materials(g,a).length)return '需要一张有效黑色基本牌或装备牌（手牌或装备区）';
  return sgs_duanliang_targets(g,a).length?'':'没有合法目标：检查兵粮寸断重复、目标限制与移出材料后的距离';
}
export function sgs_ai_duanliang_plan(g,a){
  if(!sgs_duanliang_available(g,a))return null;
  const materials=sgs_duanliang_materials(g,a).filter(m=>!(m.zone==='hand'&&print(m.card).type===CardType.POISON
    &&g.youjian_events_enabled?.()&&a.hp<=1+(g.youjian_poison_armor_snapshot?.(a)?1:0)))
    .sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y));
  for(const material of materials){const target=sgs_duanliang_targets(g,a,material).find(p=>g.side_of(p)!==g.side_of(a));if(target)return {material,target};}
  return null;
}
export function sgs_resolve_duanliang(g,a,target,material,{action_id=null}={}){
  if(action_id!==null&&!stable(action_id))return Promise.reject(Error('断粮需要稳定事务ID'));
  const phase=sgs_quhu_phase_key(g,a),request={actor_id:pid(g,a),target_id:pid(g,target),phase_id:phase,material:material?{zone:material.zone,index:material.index,card:cardRecord(material.card)}:null};
  try{if(action_id!==null){const existing=prior(a,'duanliang',action_id,request,[a,target,material?.card]);if(existing)return existing;}}catch(error){return Promise.reject(error);}
  if(!sgs_duanliang_available(g,a,target)||!sgs_duanliang_targets(g,a,material).includes(target))return Promise.resolve(false);
  const current=exact(sgs_duanliang_materials(g,a),material);if(!current||!uniquePhysical(g,current.card))return Promise.resolve(false);
  if(g.public_card_loss_supports_on_committed!==true)return Promise.reject(Error('断粮需要支持 validate/on_committed 的原子移牌内核'));
  const id=action_id??nextId(g,a,SK.duanliang),turn=g.turn_event_counter,form=rule_hero(a)?.id,view=supplyView(g,a,current);
  return begin(a,'duanliang',id,request,[a,target,current.card],async receipt=>{
    let scope=null;
    try{
      receipt.stage='material';
      const moved=await g.public_card_loss(a,[current],{payment:true,to:'processing',visibility:'public',reason:'断粮·当兵粮寸断使用',action:'card_use',move_id:`${id}:material`,
        validate:()=>turn===g.turn_event_counter&&phase===sgs_quhu_phase_key(g,a)&&form===rule_hero(a)?.id
          &&sgs_duanliang_available(g,a,target)&&!!exact(sgs_duanliang_materials(g,a),current)&&sgs_duanliang_targets(g,a,current).includes(target),
        on_committed:cards=>{
          if(cards.length!==1||cards[0]!==current.card)throw Error('断粮必须提交恰好一张选定实体材料');
          receipt.committed=true;receipt.stage='loss_effects';
          scope=g.start_card_use(a,view,{materials:[current.card],sourceZones:[current.zone],provenance:{kind:'converted',source_skill_id:SK.duanliang}});
          receipt.history_use_id=scope.use_id;
        },
      });
      if(!moved?.committed)return false;
      if(!receipt.committed)throw Error('断粮移牌未执行 on_committed；禁止重复支付');
      if(!live(a)||!live(target)){receipt.interrupted='participant_dead';return true;}
      receipt.stage='resolve';
      await g.resolve_scroll(a,target,view,{physical_material:current.card,source_skill:SK.duanliang,source_skill_id:SK.duanliang,
        trick_declaration_validated:true,history_use_id:scope.use_id,effect_id:'trick.skip_draw'});
      receipt.placed=target.judgment_cards.includes(current.card);return true;
    }finally{if(receipt.committed)g.finish_processing_card(view);if(scope)g.end_card_use(scope);}
  });
}
export async function sgs_player_duanliang(g,a,_fallback,args=[]){
  if(!sgs_duanliang_available(g,a))return true;
  const phase=sgs_quhu_phase_key(g,a),form=rule_hero(a)?.id,options=sgs_duanliang_materials(g,a);let material;
  if(args.length){
    if(args.length===1&&pass(args[0]))return true;
    const id=args.length===1?( /^\d+$/.test(args[0])?`hand:${Number(args[0])}`:args[0]):args.length===2&&args[0]==='eq'?`eq:${g.normalize_equipment_slot(args[1])}`:null;
    material=options.find(m=>m.id===id);if(!material)return false;
  }else while(!material){
    const value=await g.view.ask_line('断粮：选择一张黑色基本牌或装备牌，当兵粮寸断使用',{
      kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌'}],
      meta:{skill:'断粮',skill_id:SK.duanliang,stage:'duanliang_material',private_to:g.seat_of(a),material_zones:['hand',...SLOTS]},
    });
    if(pass(value))return true;material=select(options,value);
  }
  const target=await g.choose_card_target(a,sgs_duanliang_targets(g,a,material),{card_name:'断粮·兵粮寸断',stage:'duanliang_target',cancellable:true,source_skill_id:SK.duanliang});
  if(target&&phase===sgs_quhu_phase_key(g,a)&&form===rule_hero(a)?.id)await sgs_resolve_duanliang(g,a,target,material);
  return true;
}
export const sgs_ai_duanliang=(g,a)=>{const plan=sgs_ai_duanliang_plan(g,a);return plan?sgs_resolve_duanliang(g,a,plan.target,plan.material):Promise.resolve(false);};

export function sgs_fire_control_skill_definitions({SkillHooks,ActiveSkillDef}){
  const quhu=new ActiveSkillDef({skill_id:SK.quhu,hotkey:'q',button_label:'驱虎',player:sgs_player_quhu,ai:sgs_ai_quhu,available:sgs_quhu_available,
    help_text:'驱虎：每出牌阶段一次，与当前体力更高的其他角色拼点；赢则令其对其攻击范围内自选另一角色造成1点伤害，没赢则其对你造成1点伤害。'});
  quhu.targets=sgs_quhu_targets;quhu.owns_target_selection=true;quhu.unavailable_reason=sgs_quhu_unavailable_reason;
  const duanliang=new ActiveSkillDef({skill_id:SK.duanliang,hotkey:'q',button_label:'断粮',player:sgs_player_duanliang,ai:sgs_ai_duanliang,available:sgs_duanliang_available,
    help_text:'断粮：将一张有效黑色基本牌或装备牌当兵粮寸断使用；兵粮寸断距离上限至少2，按移出装备材料后的距离检查。'});
  duanliang.targets=sgs_duanliang_targets;duanliang.owns_target_selection=true;duanliang.unavailable_reason=sgs_duanliang_unavailable_reason;
  return {hooks:{[ID.xunyu]:SkillHooks({after_damage_resolved:[sgs_after_damage_jieming]}),[ID.xuhuang]:SkillHooks({supply_shortage_distance_limit:[sgs_duanliang_distance_limit]})},
    active:{[ID.xunyu]:[quhu],[ID.xuhuang]:[duanliang]}};
}
