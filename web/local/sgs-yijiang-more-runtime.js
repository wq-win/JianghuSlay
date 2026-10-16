import {sgs_jiushi_rescue_options,sgs_yijiang_more_caozhi_public_state} from './sgs-yijiang-more-caozhi.js';
import {sgs_yijiang_more_zhuran_public_state,sgs_danshou_next_ordinal} from './sgs-yijiang-more-zhuran.js';
/** Exact shared windows for V30. No asynchronous work inside atomic Wine commit. */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {Card,CardType} from './models.js';
import {sgs_yijiang_more_lidian_public_state} from './sgs-yijiang-more-lidian.js';
const stable=x=>typeof x==='string'&&x.length>0;
export const yijiangMoreRuntimeMethods={
 more_discard_observers(){return this.action_order().filter(p=>p?.alive&&(skill_hooks_for_hero(rule_hero(p))?.after_any_cards_enter_discard??[]).length);},
 async dispatch_after_cards_enter_discard(event){
  if(!event?.committed||event.to!=='discard'||!['discard','judgment'].includes(event.semantic_action))return;
  try{for(const holder of this.more_discard_observers()){
   for(const hook of skill_hooks_for_hero(rule_hero(holder))?.after_any_cards_enter_discard??[])await hook(this,holder,event);
  }}finally{event.closed=true;}
 },
 register_judgment_material(card,event,{final_face=null}={}){
  if(!card||!event?.actor||!stable(event.judgment_event_id))throw Error('判定实体缺少真实事件来源');
  this.judgment_material_receipts??=[];
  let row=this.judgment_material_receipts.find(r=>r.card===card&&r.judgment_event_id===event.judgment_event_id);
  if(!row)this.judgment_material_receipts.push(row={card,judgment_event_id:event.judgment_event_id,judged_actor_id:this.player_id(event.actor),status:'processing'});
  if(final_face)row.final_face={...final_face};return row;
 },
 async finish_judgment_card(card,event=null){
  const physical=card?.virtual?(card.materials??[]):[card];let moved=false;
  for(const material of physical){
   if(event)this.register_judgment_material(material,event);
   const row=[...(this.judgment_material_receipts??[])].reverse().find(r=>r.card===material&&r.status==='processing');
   if(!row){moved=this.finish_processing_card(material)||moved;continue;}
   const index=this.processing_cards.indexOf(material);
   if(index<0){row.status='already_moved';continue;}
   const judged=this.all_players().find(p=>this.player_id(p)===row.judged_actor_id);
   if(!judged)throw Error('判定角色来源已丢失');
   // No global observer: retain the local physical-only cleanup path, which
   // never traverses unrelated private hands merely to discard a public judgment.
   if(!this.more_discard_observers().length){row.status='done';moved=this.finish_processing_card(material)||moved;continue;}
   const face=row.final_face??this.effective_card(material,judged,{judged_actor:judged});
   row.effective_face={name:face.name,type:face.type,suit:face.suit,color:face.color,rank:face.rank};row.status='discarding';
   const move_id=`judgment-discard:${row.judgment_event_id}:${this.card_history_material_id(material)}`;
   const result=await this.public_card_loss(null,[{zone:'processing',index,card:material}],{to:'discard',action:'judgment',semantic_action:'judgment',reason:'判定牌结算结束',move_id,judged_actor:judged,judgment_event_id:row.judgment_event_id,judgment_face:row.effective_face,poison_exempt:true});
   row.status=result.committed?'done':'stale';moved=result.committed||moved;
  }
  return moved;
 },
 can_use_virtual_wine(actor,{mode,dying_event=null}={}){
  if(!actor||actor.dead||!this.card_use_history?.current_turn_id)return false;
  const turn=this.card_use_history.turns.find(t=>t.turn_id===this.card_use_history.current_turn_id);if(!turn||turn.status!=='active')return false;
  const card=new Card('酒',CardType.WINE,{virtual:true,source_skill:'sgs.jiushi'});
  if(this.card_use_prohibited?.(actor,card))return false;
  if(mode==='play')return this.actual_turn_active===true&&this.is_own_play_phase(actor)&&this.can_use_offensive_wine(actor);
  if(mode==='rescue')return actor.hp<=0&&dying_event&&!dying_event.closed&&stable(dying_event.event_id)&&dying_event.dying_seat===this.seat_of(actor)&&this.dying_stack.includes(this.seat_of(actor));
  return false;
 },
 commit_virtual_wine_use(actor,card,{mode,event_id,dying_event=null,before_atomic_commit,validate}={}){
  if(typeof validate==='function'&&!validate())return {committed:false};
  if(!stable(event_id)||card?.type!==CardType.WINE||card.virtual!==true||!this.can_use_virtual_wine(actor,{mode,dying_event}))return {committed:false};
  this.virtual_wine_receipts??={};
  if(this.virtual_wine_receipts[event_id])return {committed:false,already_committed:true};
  this.start_card_use(actor,card,{materials:[],sourceZones:[],provenance:{kind:'virtual',source_skill:'sgs.jiushi'},validate_only:true});
  if(typeof before_atomic_commit!=='function')throw Error('酒诗需要同步翻面代价');
  const result=before_atomic_commit();if(result&&typeof result.then==='function')throw Error('酒诗翻面提交必须同步');if(result===false)return {committed:false};
  if(mode==='play'&&!this.commit_offensive_wine(actor))throw Error('酒诗普通酒次数在原子提交期间失效');
  const scope=this.start_card_use(actor,card,{materials:[],sourceZones:[],provenance:{kind:'virtual',source_skill:'sgs.jiushi'}});
  this.virtual_wine_receipts[event_id]={event_id,actor_id:this.player_id(actor),mode,dying_event_id:dying_event?.event_id??null,history_use_id:scope.use_id,committed:true};
  return {committed:true,scope};
 },
 more_dying_skill_options(actor,dying,source,entry,opportunity_id){return sgs_jiushi_rescue_options(this,actor,dying,source,entry,opportunity_id);},
 yijiang_more_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[],has=(skills,field)=>skills.some(id=>ids.includes(id))||Boolean(actor[field]);
  const li=has(['sgs.xunxun','sgs.wangxi'],'sgs_yijiang_more_lidian_state'),cao=has(['sgs.luoying','sgs.jiushi'],'sgs_yijiang_more_caozhi_state'),zhu=has(['sgs.danshou'],'sgs_yijiang_more_zhuran_state');
  if(!li&&!cao&&!zhu)return null;
  return {lidian:li?sgs_yijiang_more_lidian_public_state(actor):null,caozhi:cao?sgs_yijiang_more_caozhi_public_state(this,actor):null,zhuran:zhu?{...sgs_yijiang_more_zhuran_public_state(actor),next_ordinal:sgs_danshou_next_ordinal(this,actor)}:null};
 },
};
