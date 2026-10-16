/** Mandatory discard: collect the whole current excess, then commit one move.
 * Every loss callback sees all costs already in discard. Nested recovery/draw or
 * HP loss completes before re-evaluating whether a further batch is necessary.
 */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {ai_choose_discard} from './ai.js';
export const discardPhaseMethods={
 async discard_down_to_hp(actor){
  for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_discard??[])if(await hook(this,actor))return;
  let fixedLimit=null;
  for(const hook of skill_hooks_for_hero(rule_hero(actor))?.discard_limit_override??[]){const n=await hook(this,actor,this.hand_limit(actor));if(n!=null)fixedLimit=n;}
  this.mandatory_discard_counter??=0;this.mandatory_discard_receipts??={};
  while(actor.alive){
   const limit=fixedLimit??this.hand_limit(actor),count=actor.hand.length-limit;if(count<=0)return;
   const before=[...actor.hand],id=`mandatory-discard:${++this.mandatory_discard_counter}`;
   const receipt=this.mandatory_discard_receipts[id]={event_id:id,actor_id:this.player_id(actor),turn_id:this.turn_event_counter,phase_id:actor.yijiang_discard_phase_id??null,count,limit,status:'selecting'};
   let selected=[];
   if(actor.is_ai){const choices=[...before];while(selected.length<count){const index=ai_choose_discard({hand:choices});selected.push(choices.splice(index,1)[0]);}}
   else while(actor.alive){
    const text=await this.view.ask_line(`手牌超过上限 ${limit}，请选择恰好 ${count} 张牌一次弃置`,{kind:'select_hand',player_id:this.seat_of(actor),min_count:count,max_count:count,
     options:before.map((card,i)=>({id:`hand:${i+1}`,label:String(card)})),meta:{stage:'mandatory_discard_batch',owner_seat:this.seat_of(actor),discard_event_id:id,discard_count:count,mandatory:true,atomic_batch:true}});
    if(actor.hand.length!==before.length||before.some((card,i)=>actor.hand[i]!==card)||(fixedLimit??this.hand_limit(actor))!==limit){receipt.status='stale';break;}
    const tokens=String(text).trim().split(/[\s,，]+/).filter(Boolean),indexes=tokens.map(t=>/^(?:hand:)?[1-9]\d*$/.test(t)?Number(t.replace('hand:',''))-1:-1);
    if(indexes.length===count&&new Set(indexes).size===count&&indexes.every(i=>i>=0&&i<before.length)){selected=indexes.map(i=>before[i]);break;}
    this.view.emit(`必须选择恰好 ${count} 张不同手牌；尚未弃置任何牌。`,{private_to:this.seat_of(actor)});
   }
   if(!actor.alive){receipt.status='interrupted';return;}
   if(receipt.status==='stale')continue;
   const valid=()=>actor.alive&&actor.hand.length===before.length&&before.every((card,i)=>actor.hand[i]===card)&&(fixedLimit??this.hand_limit(actor))===limit;
   receipt.status='committing';
   const moved=await this.public_card_loss(actor,selected.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})),{to:'discard',action:'discard',semantic_action:'mandatory_discard',reason:'弃牌阶段',move_id:id,validate:valid,
    on_committed:(_cards,result)=>{receipt.status='committed';receipt.move_id=result.move_id;receipt.physical_ids=selected.map(c=>this.card_history_material_id(c));}});
   if(!moved.committed){receipt.status='stale';continue;}
   receipt.status='done';this.view.emit(`${actor.name}一次弃置了 ${selected.length} 张手牌。`,{event_type:'mandatory_discard_batch',event_id:id,count:selected.length});
  }
 },
};
