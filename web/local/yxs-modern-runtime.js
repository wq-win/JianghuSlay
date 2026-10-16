import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {yxs_zaokong_kind,yxs_modern_zhangqian_public_state} from './yxs-modern-zhangqian.js';
import {yxs_modern_wudaozi_public_state} from './yxs-modern-wudaozi.js';
// Only live task identity is ephemeral. All rule facts and outcomes below are
// JSON-owned; LocalMatch reconstructs the awaiting task from its input journal.
const liveEvents=new WeakMap();
export const modernRuntimeMethods={
 yxs_modern_target_event_is_current(event){return liveEvents.get(this)?.includes(event)===true&&!event.closed;},
 async dispatch_modern_card_targets({card_use_id,history_use_id=null,card_user,card,targets}){
  if(!yxs_zaokong_kind(card))return {cancelled_target_ids:[]};
  const unique=[...new Set(targets)].filter(p=>p&&!p.dead),target_ids=unique.map(p=>this.player_id(p));
  const facts={event_id:`modern-targets:${card_use_id}`,card_use_id,history_use_id,turn_id:this.turn_event_counter,card_user_id:this.player_id(card_user),effective_face:{name:card.name,type:card.type},target_ids};
  this.modern_target_events??=[];let row=this.modern_target_events.find(r=>r.facts?.card_use_id===card_use_id);
  if(row){if(JSON.stringify(row.facts)!==JSON.stringify(facts))throw Error('同一次目标事件不能更换用牌或目标');if(row.status!=='done')throw Error('目标事件尚未完成，须按原输入日志恢复');return {cancelled_target_ids:[...row.cancelled_target_ids]};}
  row={facts,status:'pending',cancelled_target_ids:[]};this.modern_target_events.push(row);
  const event={...facts,card_user,card,source_card:card,targets:Object.freeze(unique),cancelled_target_ids:row.cancelled_target_ids,committed:true,closed:false};
  let stack=liveEvents.get(this);if(!stack)liveEvents.set(this,stack=[]);stack.push(event);
  try{
   for(const holder of this.action_order()){
    if(holder.dead||!holder.alive||!this.resolution_should_continue())continue;
    for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_aggregate_card_targets??[])await hook(this,holder,event);
   }
   row.status='done';return {cancelled_target_ids:[...row.cancelled_target_ids]};
  }catch(error){row.status='failed';throw error;}
  finally{event.closed=true;const i=stack.indexOf(event);if(i>=0)stack.splice(i,1);}
 },
 modern_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[],z=ids.includes('yxs.zaokong')||actor.yxs_modern_zhangqian_state,w=ids.includes('yxs.huasheng')||actor.yxs_modern_wudaozi_state;
  return z||w?{zhangqian:z?yxs_modern_zhangqian_public_state(actor,this):null,wudaozi:w?yxs_modern_wudaozi_public_state(actor,this):null}:null;
 },
};
