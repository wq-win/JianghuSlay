/** Source-backed mainland mobile base/identity 貂蝉 and 郭嘉.
 * Current-client parity is NOT claimed. Explicit cross-pack/rare-chain policies:
 * docs/sgs-following/duel-integration-contract.md. No registry or core patching.
 */
import {Card,CardType} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_FOLLOWING_DUEL_RULE_IDS=Object.freeze({diao:'sgs.adapted.base.hero.diao-chan',guo:'sgs.adapted.base.hero.guo-jia'});
export const SGS_FOLLOWING_DUEL_SKILL_IDS=Object.freeze({biyue:'sgs.biyue',lijian:'sgs.lijian',tiandu:'sgs.tiandu',yiji:'sgs.yiji'});
export const SGS_YIJI_HOST_POLICY='jianghu.sgs.yiji.live-deck-exact-identity.v1';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const live=p=>Boolean(p?.alive&&p.hp>0);
const seat=(g,p)=>g.seat_of(p);
const identity=(g,p)=>g.player_id?.(p)??seat(g,p);
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['pass','cancel','0'].includes(String(value));
const physicalId=(g,c)=>g.card_history_material_id(c);
const cardsInGame=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),
  ...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...slots.map(s=>p[s]).filter(Boolean)])];
function uniquePhysical(g,card){
  if(!card||card.virtual)return false;
  const id=card.physical_id??card.physicalCardId??null;
  return cardsInGame(g).filter(c=>c===card||id!==null&&(c.physical_id??c.physicalCardId)===id).length===1;
}
const phaseId=(g,a)=>Number.isSafeInteger(g.play_phase_event_counter)&&g.play_phase_event_counter>0?`play:${g.play_phase_event_counter}:${identity(g,a)}`:null;
const idlePlay=(g,a)=>live(a)&&g.is_own_play_phase(a)&&!g.response_stack?.length&&!g.card_history_stack?.length&&!g.damage_stack?.length&&!g.judgment_stack?.length;
const exact=(options,m)=>options.find(c=>c.card===m?.card&&c.zone===m.zone&&c.id===m.id&&c.index===m.index);
const ownEnd=(g,a)=>live(a)&&g.turn_phase==='end_phase'&&g.turn_actor===seat(g,a);
const endId=(g,a,event)=>event?.phase_event_id??event?.event_id??`end:${g.end_phase_event_counter??g.turn_event_counter??0}:${identity(g,a)}`;
const privateMeta=(g,a,skill,skill_id,stage,extra={})=>({skill,skill_id,stage,private_to:seat(g,a),...extra});
const duel=()=>new Card('决斗',CardType.SCROLL,{virtual:true,materials:[],suit:null,color:null,rank:null,
  source_skill:'sgs.lijian',source_skill_id:'sgs.lijian',source_game:'三国杀',source_rule_id:SGS_FOLLOWING_DUEL_RULE_IDS.diao});

/** All availability/target queries are read-only, including RNG and ID allocation. */
export const sgs_lijian_materials=(g,a)=>live(a)?g.skill_material_options(a).filter(m=>!m.card.virtual&&(m.zone==='hand'||slots.includes(m.zone))):[];
const males=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&g.effective_gender(p)==='male');
const legalPair=(g,a,first,second)=>first!==second&&males(g,a).includes(first)&&males(g,a).includes(second)
  &&g.can_duel_target(second,first,{allow_allies:true})&&g.can_trick_target(second,first,duel());
export const sgs_lijian_second_targets=(g,a,first)=>males(g,a).filter(second=>legalPair(g,a,first,second));
export const sgs_lijian_targets=(g,a)=>males(g,a).filter(first=>sgs_lijian_second_targets(g,a,first).length);
export function sgs_lijian_available(g,a,target=null){
  if(!idlePlay(g,a)||!phaseId(g,a)||a.sgs_lijian_receipts?.[phaseId(g,a)]||!sgs_lijian_materials(g,a).length)return false;
  const targets=sgs_lijian_targets(g,a);return target==null?targets.length>0:targets.includes(target);
}
export function sgs_lijian_unavailable_reason(g,a){
  if(!idlePlay(g,a)||!phaseId(g,a))return '只能在自己的空闲出牌阶段发动';
  if(a.sgs_lijian_receipts?.[phaseId(g,a)])return '本出牌阶段已发动离间';
  if(males(g,a).length<2)return '需要两名其他存活男性；双人对局无法发动';
  if(!sgs_lijian_materials(g,a).length)return '需要弃置一张手牌或装备';
  return sgs_lijian_targets(g,a).length?'':'没有符合普通决斗限制的目标组合';
}

/** Cost is a discarded card, NEVER a material of the zero-material Duel.
 * Reserve the phase before async movement, commit the receipt before loss hooks.
 */
export async function sgs_resolve_lijian(g,a,first,second,material){
  if(!sgs_lijian_available(g,a)||!legalPair(g,a,first,second))return false;
  const current=exact(sgs_lijian_materials(g,a),material);if(!current||!uniquePhysical(g,current.card))return false;
  const key=phaseId(g,a),turn=g.turn_event_counter,form=rule_hero(a)?.id,receipt={phase_id:key,status:'reserved',first_id:identity(g,first),second_id:identity(g,second),cost_id:physicalId(g,current.card)};
  (a.sgs_lijian_receipts??={})[key]=receipt;
  try{
    const paid=await g.public_card_loss(a,[current],{payment:true,to:'discard',reason:'离间',visibility:'public',action:'discard',
      validate:()=>phaseId(g,a)===key&&g.turn_event_counter===turn&&rule_hero(a)?.id===form&&idlePlay(g,a)
        &&a.sgs_lijian_receipts?.[key]===receipt&&legalPair(g,a,first,second)&&!!exact(sgs_lijian_materials(g,a),current),
      on_committed:(cards,movement)=>{
      if(cards.length!==1||cards[0]!==current.card)throw Error('离间必须提交一张选定实体成本');
      receipt.status='committed';receipt.move_id=movement.move_id;
    }});
    if(!paid?.committed){if(receipt.status==='reserved')delete a.sgs_lijian_receipts[key];return false;}
    receipt.status='committed';
    // Nested equipment/poison/loss effects finish first. A vanished participant
    // is not replaced and a legitimate paid cost is never refunded.
    if(!live(a)||!legalPair(g,a,first,second)){receipt.status='ended';return true;}
    g.view.emit(`${a.name}发动离间，由${second.name}对${first.name}使用决斗；${first.name}先响应杀。`);
    await g.resolve_scroll(second,first,duel(),{allow_allies:true,source_skill:'sgs.lijian',source_skill_id:'sgs.lijian',skill_initiator:a});
    receipt.status='ended';return true;
  }catch(error){receipt.status=receipt.status==='reserved'?'failed_before_commit':'failed_after_commit';throw error;}
}
async function chooseLijianMaterial(g,a,args){
  const options=sgs_lijian_materials(g,a);
  if(args.length){
    if(args.length===1&&pass(args[0]))return null;
    const id=args.length===1&&/^\d+$/.test(args[0])?`hand:${Number(args[0])}`:args.length===2&&args[0]==='eq'?`eq:${g.normalize_equipment_slot(args[1])}`:null;
    return id?options.find(o=>o.id===id)??false:false;
  }
  while(true){
    const answer=await g.view.ask_line('离间：弃置一张手牌或装备，或取消',{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌或次数'}],
      meta:privateMeta(g,a,'离间','sgs.lijian','lijian_material',{material_zones:['hand',...slots]}),
    });
    if(pass(answer))return null;const chosen=select(options,answer);if(chosen)return chosen;
  }
}
async function chooseLijianTarget(g,a,targets,stage){
  const options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${rule_hero(p).display_name??rule_hero(p).name} · ${p.hp}血）`}));
  while(targets.length){
    const answer=await g.view.ask_line(stage==='lijian_first'?'离间：选择先响应杀的男性 A':'离间：选择对 A 使用决斗的男性 B',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗牌或次数'}],
      meta:{skill:'离间',skill_id:'sgs.lijian',stage,first_responder:stage==='lijian_first'},
    });
    if(pass(answer))return null;const selected=select(options,answer),chosen=targets.find(p=>seat(g,p)===selected?.id);if(chosen)return chosen;
  }
  return null;
}
export async function sgs_player_lijian(g,a,_fallback,args=[]){
  if(!sgs_lijian_available(g,a)){g.view.emit(`离间：${sgs_lijian_unavailable_reason(g,a)}。`);return true;}
  const phase=phaseId(g,a),form=rule_hero(a)?.id,material=await chooseLijianMaterial(g,a,args);
  if(material===false)return false;if(!material)return true;
  const first=await chooseLijianTarget(g,a,sgs_lijian_targets(g,a),'lijian_first');if(!first)return true;
  const second=await chooseLijianTarget(g,a,sgs_lijian_second_targets(g,a,first),'lijian_second');
  if(second&&phase===phaseId(g,a)&&form===rule_hero(a)?.id)await sgs_resolve_lijian(g,a,first,second,material);return true;
}
/** No other hand faces or unrevealed deck cards participate in this policy. */
export function sgs_ai_lijian_pair(g,a){
  const candidates=[];
  for(const first of sgs_lijian_targets(g,a))for(const second of sgs_lijian_second_targets(g,a,first)){
    if(g.side_of(first)===g.side_of(a))continue;
    const enemy=g.side_of(second)!==g.side_of(a);
    if(!enemy&&first.hand.length>0&&second.hand.length<=first.hand.length+1)continue;
    candidates.push({first,second,score:(enemy?100:0)+(first.hand.length===0?12:0)+(first.hp===1?6:0)+Math.min(second.hand.length,5)-Math.min(first.hand.length,5)});
  }
  return candidates.sort((x,y)=>y.score-x.score)[0]??null;
}
export async function sgs_ai_lijian(g,a){
  if(!sgs_lijian_available(g,a))return false;
  const pair=sgs_ai_lijian_pair(g,a);if(!pair)return false;
  const material=sgs_lijian_materials(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y))
    .find(m=>!(m.card.type===CardType.TAO&&a.hp<rule_hero(a).max_hp));
  return material?sgs_resolve_lijian(g,a,pair.first,pair.second,material):false;
}

export async function sgs_on_end_phase_biyue(g,a,_target=null,event={}){
  if(!ownEnd(g,a))return false;
  const key=String(endId(g,a,event)),window=`${g.turn_event_counter}:${g.end_phase_event_counter}:${g.turn_actor}`;if(a.sgs_biyue_receipts?.[key])return false;
  const receipt={phase_id:key,status:'offered'},form=rule_hero(a)?.id;(a.sgs_biyue_receipts??={})[key]=receipt;
  const accepted=a.is_ai||await g.view.ask_confirm('闭月：弃牌阶段已经结束，是否摸一张牌？',{
    player_id:seat(g,a),meta:{skill:'闭月',skill_id:'sgs.biyue',stage:'biyue_start',after_discard:true,phase_event_id:key},
  });
  if(!accepted||!ownEnd(g,a)||String(endId(g,a,event))!==key||`${g.turn_event_counter}:${g.end_phase_event_counter}:${g.turn_actor}`!==window||rule_hero(a)?.id!==form){receipt.status='passed';return false;}
  receipt.status='committed';await g.draw_cards(a,1);receipt.status='ended';g.view.emit(`${a.name}发动闭月，在结束阶段摸一张牌。`);return true;
}

const tianduWindow=(g,a,event)=>live(a)&&event?.actor===a&&event.status==='effective'&&event.judgment_event_id
  &&!event.cancelled&&!event.closed&&event.card&&!event.card.virtual&&g.processing_cards.includes(event.card)&&uniquePhysical(g,event.card);
/** Host fixes event.result BEFORE this hook. Move only event.card, without
 * modifying or deriving the fixed result from a subsequently reset card face.
 */
export async function sgs_on_judgment_effective_tiandu(g,a,event){
  if(!tianduWindow(g,a,event)||a.sgs_tiandu_receipts?.[event.judgment_event_id])return false;
  const card=event.card,key=event.judgment_event_id,receipt={judgment_event_id:key,status:'offered',card_id:physicalId(g,card)},form=rule_hero(a)?.id;
  (a.sgs_tiandu_receipts??={})[key]=receipt;
  const accepted=a.is_ai||await g.view.ask_confirm(`天妒：是否获得本次最终判定牌${card}？判定结果不变。`,{
    player_id:seat(g,a),meta:{skill:'天妒',skill_id:'sgs.tiandu',stage:'tiandu_obtain',judgment_event_id:key,judged_seat:seat(g,a),judgment_card:{name:card.name,suit:card.suit,rank:card.rank}},
  });
  if(!accepted||!tianduWindow(g,a,event)||event.card!==card||rule_hero(a)?.id!==form){receipt.status='passed';return false;}
  const result=await g.public_card_loss(null,[{zone:'processing',index:g.processing_cards.indexOf(card),card}],{
    to:'hand',recipient:a,reason:'天妒',visibility:'public',source:null,source_zone:'judgment',source_skill:'sgs.tiandu',action:'obtain',poison_exempt:true,
    move_id:`sgs.tiandu:${identity(g,a)}:${key}`,on_committed:()=>{receipt.status='committed';},
  });
  if(!result?.committed){receipt.status='unavailable';return false;}
  receipt.status='ended';g.view.emit(`${a.name}发动天妒，获得最终判定牌。`);return true;
}

/** Narrow host adapter. Called ONLY after accepting one point of 遗计.
 * The top is the array's tail. Refill UNDER any existing top card, matching the
 * normal Deck draw order without drawing or moving either viewed card.
 */
export function sgs_yiji_view_top_cards(g,count=2){
  if(count!==2)throw Error('遗计每点只观看牌堆顶两张牌');
  if(g.deck.draw_pile.length<count&&g.deck.discard_pile.length){
    const refill=g.deck.discard_pile.splice(0);g.rng.shuffle(refill);g.deck.draw_pile.unshift(...refill);g.deck.on_reshuffle?.();
  }
  const cards=g.deck.draw_pile.slice(-count).reverse();
  if(cards.some(c=>!uniquePhysical(g,c)))throw Error('遗计观看需要唯一实体牌');
  return cards;
}
/** Atomic exact deck→hand gain. No fake processing reservation, draw callback,
 * owner hand loss, poison-draw replacement, or opponent-hand inspection.
 */
export async function sgs_yiji_give_viewed_card(g,a,card,target,receipt){
  if(!live(a)||!live(target)||!card||receipt.status!=='selected')return false;
  const index=g.deck.draw_pile.indexOf(card);if(index<0||!uniquePhysical(g,card)){receipt.status='unavailable';return false;}
  if(physicalId(g,card)!==receipt.card_id)return false;
  receipt.recipient_id=identity(g,target);receipt.status='committed';
  g.deck.draw_pile.splice(index,1);target.hand.push(card);
  g.copied_card_moved?.(card,'hand',target);
  await g.on_cards_obtained?.(target,[card],{source:a,source_zone:'draw_pile',destination:'hand',recipient:target,reason:'遗计',
    visibility:'private',action:'give',source_skill:'sgs.yiji',poison_exempt:true,move_id:receipt.move_id,host_policy:SGS_YIJI_HOST_POLICY});
  receipt.status='given';g.view.emit(`${a.name}发动遗计，将一张牌交给${target.name}。`);return true;
}
const yijiWindow=(a,amount,event)=>live(a)&&amount>0&&event?.target===a&&Number.isSafeInteger(event.damage)&&event.damage>0&&event.damage_event_id
  &&(event.dying_resolved===true||event.after_rescue===true)&&event.after_rescue!==false&&!event.dying_pending
  &&!event.cancelled&&!event.closed&&!['hp_loss','lose_hp','HP_LOSS'].includes(event.kind);
const viewedRecord=(g,card,index)=>({id:`viewed:${index+1}`,card_id:physicalId(g,card),name:card.name,type:card.type,suit:card.suit,rank:card.rank});
function yijiTarget(g,a){
  return g.all_players().filter(live).filter(p=>g.side_of(p)===g.side_of(a))
    .sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp||Number(y===a)-Number(x===a))[0]??a;
}
async function allocateYiji(g,a,cards,pointReceipt,context){
  let given=0;
  while(live(a)){
    // Host policy for rare nested effects: vanished cards are simply unavailable.
    // Never reclaim them, protect their zone, or replace them with another card.
    for(const row of pointReceipt.cards)if(row.status==='viewed'&&!g.deck.draw_pile.includes(cards.find(c=>physicalId(g,c)===row.card_id)))row.status='unavailable';
    const remaining=pointReceipt.cards.filter(row=>row.status==='viewed');if(!remaining.length)break;
    let chosen,target;
    if(a.is_ai){chosen=remaining[0];target=yijiTarget(g,a);}
    else{
      while(!chosen&&live(a)){
        const answer=await g.view.ask_line('遗计：选择本次观看的一张牌分配（接受观看后须分配所有仍可用的牌）',{
          kind:'choice',player_id:seat(g,a),options:remaining.map(row=>({id:row.id,label:`${row.name}［${row.suit} ${row.rank}］`})),
          meta:privateMeta(g,a,'遗计','sgs.yiji','yiji_card',{...context,viewed_cards:remaining.map(({id,card_id,name,type,suit,rank})=>({id,physical_id:card_id,name,type,suit,rank})),cancellable:false,source_zone:'draw_pile',host_policy:SGS_YIJI_HOST_POLICY}),
        });chosen=select(remaining,answer);
      }
      while(chosen&&!target&&live(a)){
        const targets=g.all_players().filter(live),options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${p.hp}血 · ${p.hand.length}张手牌）`}));
        const answer=await g.view.ask_line('遗计：将选定牌交给一名存活角色，可以选择自己',{
          kind:'choice',player_id:seat(g,a),options,meta:privateMeta(g,a,'遗计','sgs.yiji','yiji_target',{...context,selected_id:chosen.id,cancellable:false,allow_self:true,allow_allies:true}),
        });const option=select(options,answer);target=targets.find(p=>seat(g,p)===option?.id&&live(p));
      }
    }
    if(!chosen||!target||!live(a))break;
    chosen.status='selected';chosen.move_id=`sgs.yiji:${identity(g,a)}:${context.damage_event_id}:${context.point}:${chosen.id}`;
    const card=cards.find(c=>physicalId(g,c)===chosen.card_id);
    if(await sgs_yiji_give_viewed_card(g,a,card,target,chosen))given++;
    else if(chosen.status==='selected')chosen.status='unavailable';
  }
  return given;
}
/** Per ACTUAL damage point, only after the entire rescue. Every offered point,
 * including a decline, has a durable actor receipt surviving form transitions.
 */
export async function sgs_after_damage_yiji(g,a,amount,_source,event={}){
  if(!yijiWindow(a,amount,event)||a.sgs_yiji_receipts?.[event.damage_event_id])return 0;
  const points=Math.floor(event.damage),key=event.damage_event_id;
  const receipt={damage_event_id:key,status:'pending',points:Array.from({length:points},(_,i)=>({point:i+1,status:'unoffered',cards:[]}))};
  (a.sgs_yiji_receipts??={})[key]=receipt;let given=0;const initialForm=rule_hero(a)?.id;
  try{
    for(const pointReceipt of receipt.points){
      if(!yijiWindow(a,amount,event)||rule_hero(a)?.id!==initialForm)break;
      const context={damage_event_id:key,point:pointReceipt.point,points};pointReceipt.status='offered';
      const form=rule_hero(a)?.id,accepted=a.is_ai||await g.view.ask_confirm(`遗计：本次受到${points}点伤害，第${pointReceipt.point}次是否观看牌堆顶两张并分配？`,{
        player_id:seat(g,a),meta:privateMeta(g,a,'遗计','sgs.yiji','yiji_start',context),
      });
      if(!accepted||!yijiWindow(a,amount,event)||rule_hero(a)?.id!==form){pointReceipt.status='passed';continue;}
      const cards=sgs_yiji_view_top_cards(g);pointReceipt.cards=cards.map((c,i)=>({...viewedRecord(g,c,i),status:'viewed'}));pointReceipt.status='allocating';
      given+=await allocateYiji(g,a,cards,pointReceipt,context);pointReceipt.status=live(a)?'ended':'interrupted';
    }
    receipt.status='ended';return given;
  }catch(error){receipt.status='failed';throw error;}
}

export function sgs_following_duel_skill_definitions({SkillHooks,ActiveSkillDef}){
  const lijian=new ActiveSkillDef({skill_id:'离间',hotkey:'q',button_label:'离间',player:sgs_player_lijian,ai:sgs_ai_lijian,available:sgs_lijian_available,
    help_text:'离间：每出牌阶段一次，弃一张手牌或装备，先选男性 A，再选男性 B；B 对 A 使用普通决斗，可被无懈'});
  lijian.targets=sgs_lijian_targets;lijian.owns_target_selection=true;lijian.unavailable_reason=sgs_lijian_unavailable_reason;
  return {hooks:{
    [SGS_FOLLOWING_DUEL_RULE_IDS.diao]:SkillHooks({on_end_phase:[sgs_on_end_phase_biyue]}),
    [SGS_FOLLOWING_DUEL_RULE_IDS.guo]:SkillHooks({on_judgment_effective:[sgs_on_judgment_effective_tiandu],after_damage_resolved:[sgs_after_damage_yiji]}),
  },active:{[SGS_FOLLOWING_DUEL_RULE_IDS.diao]:[lijian]}};
}
