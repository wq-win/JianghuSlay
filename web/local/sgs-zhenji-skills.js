/** Mainland mobile base/identity 甄姬. The independent source ID is intentional:
 * YXS 赵飞燕's original acquisition timing is not source-equivalent evidence.
 * See docs/sgs-base-next/zhenji-integration-contract.md for provenance and hooks.
 */
import {Card,CardType,CardColor} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_ZHENJI_RULE_ID='sgs.adapted.base.hero.zhen-ji';
export const SGS_ZHENJI_SKILL_IDS=Object.freeze({luoshen:'sgs.luoshen',qingguo:'sgs.qingguo'});
const preparing=(game,actor)=>Boolean(actor?.alive&&game.turn_phase==='prepare'&&game.turn_actor===game.seat_of(actor));
const effectiveColor=(game,card,actor,judgment=false)=>game.effective_color(card,actor,judgment?{judged_actor:actor}:{});
const turnId=game=>`turn:${game.turn_event_counter??0}`;

/** Policy sees only its own live phase. The actual deck/judgment kernel, rather
 * than a human/AI numerical limit or a peek at future cards, bounds progress. */
export const sgs_ai_luoshen_continue=(game,actor)=>preparing(game,actor);

/** Exactly the live final judgment can move. Never search discard or recover a
 * card another trigger already moved. The generic processing transaction has
 * no hand loss and does not treat this as drawing (important for poison).
 */
export async function sgs_gain_luoshen_judgment(game,actor,card){
  if(!actor?.alive||!card||card.virtual)return false;
  const index=game.processing_cards.indexOf(card);
  if(index<0)return false;
  const result=await game.public_card_loss(null,[{zone:'processing',index,card}],{
    to:'hand',recipient:actor,reason:'洛神',visibility:'public',source:null,
    source_zone:'judgment',source_skill:SGS_ZHENJI_SKILL_IDS.luoshen,action:'obtain',poison_exempt:true,
  });
  return Boolean(result?.committed);
}

/** One preparation window, optional initial activation and every repeat. The
 * final effective black card enters hand before the next prompt. Successful
 * gains never enter discard; failed judgments use the ordinary cleanup.
 * A serializable receipt blocks reentry and same-turn replay of the trigger.
 */
export async function sgs_on_prepare_luoshen(game,actor){
  if(!preparing(game,actor))return 0;
  const turn_event_id=turnId(game),hero_id=rule_hero(actor)?.id;
  if(actor.sgs_luoshen_turn_receipt?.turn_event_id===turn_event_id)return 0;
  const receipt={turn_event_id,status:'offered',judgments:0,gained:0};
  actor.sgs_luoshen_turn_receipt=receipt;
  const current=()=>preparing(game,actor)&&turnId(game)===turn_event_id
    &&rule_hero(actor)?.id===hero_id&&actor.sgs_luoshen_turn_receipt===receipt;
  try{
    while(current()){
      receipt.status='offered';
      const accepted=actor.is_ai?sgs_ai_luoshen_continue(game,actor):await game.view.ask_confirm(
        receipt.judgments?'洛神：已获得最终黑色判定牌，是否继续判定？':'洛神：是否开始判定？最终黑色牌立即获得并可继续，否则停止。',{
          player_id:game.seat_of(actor),meta:{skill:'洛神',skill_id:SGS_ZHENJI_SKILL_IDS.luoshen,
            stage:receipt.judgments?'luoshen_continue':'luoshen_start',turn_event_id,
            judgments:receipt.judgments,gained:receipt.gained},
        });
      if(!accepted||!current())break;
      receipt.status='judging';
      const judgment=await game.reveal_judgment(actor,'洛神',{
        good_for:actor,favorable:card=>card.color===CardColor.BLACK,
      });
      if(!judgment)break;
      receipt.judgments++;
      try{
        if(!current()||effectiveColor(game,judgment,actor,true)!==CardColor.BLACK){
          game.view.emit(`${actor.name}洛神未获得有效黑色判定结果，停止。`);break;
        }
        receipt.status='gaining';
        if(!await sgs_gain_luoshen_judgment(game,actor,judgment))break;
        receipt.gained++;
        game.view.emit(`${actor.name}发动洛神，获得最终黑色判定牌${judgment}。`);
      }finally{await game.finish_judgment_card(judgment);}
    }
    receipt.status='ended';return receipt.gained;
  }catch(error){receipt.status='failed';throw error;}
}

/** Material enumeration is a private owner query, not a proactive SHAN action.
 * Equipment TYPE in hand qualifies; an equipped card never qualifies.
 */
export function sgs_qingguo_materials(game,actor){
  if(!actor?.alive)return [];
  return game.skill_material_options(actor).filter(material=>material.zone==='hand'
    &&!material.card.virtual&&effectiveColor(game,material.card,actor)===CardColor.BLACK);
}
function legalResponse(context,action_kind){
  return ['use','play'].includes(action_kind)&&context.legal!==false&&!context.prohibited
    &&!context.response_prohibited&&!context.dodge_blocked&&!context.cancelled&&!context.closed
    &&!(action_kind==='use'?context.use_prohibited:context.play_prohibited);
}
function currentMaterial(game,actor,material){
  return sgs_qingguo_materials(game,actor).find(candidate=>candidate.card===material?.card
    &&candidate.zone===material.zone&&candidate.id===material.id&&candidate.index===material.index)??null;
}

/** Event-level logical basic SHAN, mapped to exactly one unchanged real card.
 * Suit/color are owner-effective; the single material's rank is retained.
 * This projection is never appended to any physical zone or draw pile.
 */
export function sgs_qingguo_card(game,actor,material,{action_kind='play',response_context={}}={}){
  if(!legalResponse(response_context,action_kind))return null;
  const current=currentMaterial(game,actor,material);if(!current)return null;
  const card=current.card;
  return new Card('闪',CardType.SHAN,{
    virtual:true,materials:[card],suit:game.effective_suit(card,actor),
    color:effectiveColor(game,card,actor),rank:card.rank,source_skill:SGS_ZHENJI_SKILL_IDS.qingguo,
    logical_category:'basic',action_kind,
  });
}

/** The shared response caller owns the legal window and final aggregate dodge.
 * This helper owns only conversion/payment/the one response event/cleanup.
 * Costs, poison HP loss, rescue and loss hooks finish BEFORE success/callbacks.
 */
export async function sgs_resolve_qingguo(game,actor,material,{action_kind='play',response_context={},on_resolved=null}={}){
  const logical=sgs_qingguo_card(game,actor,material,{action_kind,response_context});
  if(!logical)return {success:false};
  const physical=logical.materials[0];
  let paid=null,committed=false;
  try{
    paid=await game.consume_material(actor,material,{
      to:'processing',reason:action_kind==='use'?'倾国·当闪使用':'倾国·当闪打出',visibility:'public',
      on_committed:cards=>{committed=cards.length===1&&cards[0]===physical;},
    });
    if(!paid||paid!==physical||!actor.alive||!legalResponse(response_context,action_kind))return {success:false};
    // A nested legitimate movement owns its destination. Do not conjure a SHAN
    // after the material has left this response's processing transaction.
    if(!game.processing_cards.includes(physical))return {success:false};
    game.view.emit(`${actor.name}发动倾国，将${physical}当闪${action_kind==='use'?'使用':'打出'}。`);
    const event=await game.after_response_card(actor,CardType.SHAN,{
      ...response_context,action_kind,virtual:true,source_skill:SGS_ZHENJI_SKILL_IDS.qingguo,
      material,card:logical,physical_card:physical,physical_cards:[physical],
      response_provenance:{kind:'skill_conversion',skill_id:SGS_ZHENJI_SKILL_IDS.qingguo,
        physical_cards:[physical],material_zone:'hand'},
    });
    if(on_resolved)await on_resolved(event,logical);
    return {success:true,card:logical,event};
  }finally{
    // Also cover an exception after the physical move but before its async
    // payment promise returned. Exact-card cleanup cannot reclaim gained cards.
    if(committed||paid===physical)game.finish_processing_card(logical);
  }
}

/** Hook array entry. A normal printed SHAN remains on the normal kernel path;
 * explicit source_skill can select Qingguo even for a black printed SHAN.
 */
export async function sgs_commit_qingguo_response(game,actor,type,material,response_context={}){
  if(type!==CardType.SHAN||material?.card?.type===CardType.SHAN
    &&material.source_skill!==SGS_ZHENJI_SKILL_IDS.qingguo)return {handled:false,success:false};
  const result=await sgs_resolve_qingguo(game,actor,material,{
    action_kind:response_context.action_kind??'play',response_context,
  });
  return {handled:true,...result};
}

export function sgs_zhenji_skill_definitions({SkillHooks}){
  return {hooks:{[SGS_ZHENJI_RULE_ID]:SkillHooks({
    on_prepare:[sgs_on_prepare_luoshen],response_shan_hand_color:CardColor.BLACK,
    response_material_name:'倾国',response_card_conversion:[sgs_qingguo_card],
    resolve_response_material:[sgs_commit_qingguo_response],
  })},active:{}};
}
