/** Complete 影箭 / 释衅. FH6/FH7 are explicit cross-game host contracts. */
import {Card,CardType} from './models.js';
import {SGS_SUNRU_HERO_ID as ID,SGS_SUNRU_SKILL_IDS as SK} from './sgs-sunru-data.js';
import {sunru_stable as stable,sunru_pid as pid,sunru_live as live,sunru_ongoing as ongoing,sunru_owned as owned,sunru_binding as binding,sunru_read as read,sunru_state as state,sunru_replay_error as replayError} from './sgs-sunru-runtime.js';
const key=JSON.stringify,active=new WeakSet();
export const sgs_yingjian_virtual_sha=()=>new Card('杀',CardType.SHA,{virtual:true,materials:[],suit:null,color:null,rank:null,source_skill:SK.yingjian,source_skill_id:SK.yingjian});
/** Public target restrictions apply; distance, team, hand material and quota do not. */
export function sgs_yingjian_targets(g,a){if(!owned(g,a,SK.yingjian)||!ongoing(g)||a.prison_no_sha||g.sha_use_prohibited?.(a))return [];return g.all_players().filter(p=>p!==a&&live(p)&&g.can_sha_target(a,p,{allow_allies:true}));}
export function sgs_ai_yingjian_target(g,a){return sgs_yingjian_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((a,b)=>a.hp-b.hp)[0]??null;}
function window(g,a,e){return owned(g,a,SK.yingjian)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='prepare'&&g.turn_actor===g.seat_of(a)
 &&stable(g.turn_event_counter)&&e?.actor===a&&stable(e.phase_event_id)&&e.turn_id===g.turn_event_counter&&!e.skipped&&!e.closed&&!e.completed&&!e.cancelled;}
export const sgs_yingjian_available=(g,a,e={})=>window(g,a,e)&&!read(g,a)?.yingjian[key(e.phase_event_id)]&&sgs_yingjian_targets(g,a).length>0;
const request=(g,a,e)=>({owner_id:pid(g,a),turn_id:e.turn_id,phase_event_id:e.phase_event_id});
const decline=x=>['no','n','0','decline','cancel','pass'].includes(String(x).toLowerCase());
export async function sgs_on_prepare_yingjian(g,a,_foe,e={}){
 const prior=read(g,a)?.yingjian[key(e.phase_event_id)];
 if(prior){if(key(prior.request)!==key(request(g,a,e)))throw Error('同一影箭阶段不能更换人物或回合');if(prior.status!=='done'&&!active.has(prior))throw replayError();return prior.committed;}
 if(!window(g,a,e)||!sgs_yingjian_targets(g,a).length)return false;
 if(typeof g.use_sha!=='function')throw Error('影箭接入缺少真实 use_sha');
 const r=state(g,a).yingjian[key(e.phase_event_id)]={request:request(g,a,e),status:'offered',committed:false,binding_id:binding(g,a,SK.yingjian)};active.add(r);
 const valid=()=>r.status==='offered'&&window(g,a,e)&&binding(g,a,SK.yingjian)===r.binding_id;
 try{
  let chosen=null,passed=false;
  if(a.is_ai){chosen=sgs_ai_yingjian_target(g,a);passed=!chosen;}
  while(!chosen&&!passed&&valid()){
   const targets=sgs_yingjian_targets(g,a);if(!targets.length)break;
   const options=[...targets.map(p=>({id:`target:${pid(g,p)}`,label:`对${p.name}使用杀`})),{id:'decline',label:'不发动影箭'}];
   const answer=await g.view.ask_line('影箭：选择一名角色使用无距离限制的杀，或不发动',{kind:'choice',player_id:g.seat_of(a),options,meta:{skill:'影箭',skill_id:SK.yingjian,stage:'yingjian_target',private_to:g.seat_of(a),phase_event_id:e.phase_event_id,turn_id:e.turn_id,ignore_distance:true,material_count:0,quota_exempt:true}});
   if(!valid())break;if(decline(answer)){passed=true;break;}
   const selected=options.find(o=>o.id===String(answer))??(/^\d+$/.test(String(answer))?options[Number(answer)-1]:null);
   if(selected?.id==='decline'){passed=true;break;}
   chosen=targets.find(p=>`target:${pid(g,p)}`===selected?.id)??null;
   if(chosen&&!sgs_yingjian_targets(g,a).includes(chosen))chosen=null;
   if(!chosen)g.view.emit('目标已变化或选择无效，请重新选择。',{private_to:g.seat_of(a)});
  }
  if(!valid()||!chosen||!sgs_yingjian_targets(g,a).includes(chosen)){r.status='done';r.declined=passed;r.cancelled=!passed;return false;}
  r.target_id=pid(g,chosen);r.status='resolving';
  const result=await g.use_sha(a,chosen,'影箭·杀',{source_card:sgs_yingjian_virtual_sha(),forced:true,source_last_hand:false,ignore_distance:true,source_skill:SK.yingjian,use_provenance:{kind:'virtual',physical_cards:[],source_skill_id:SK.yingjian},on_card_use_committed:({card_use_id})=>{
   // Commit before target responses, nested deaths and any actual damage.
   if(!stable(card_use_id))throw Error('影箭需要稳定用牌ID');r.committed=true;r.card_use_id=card_use_id;
  }});
  if(!r.committed)throw Error(`影箭用牌未返回提交回执：${result?.card_use_id??'none'}`);
  r.status='done';return true;
 }catch(error){r.status='failed';r.error=String(error?.message??error);throw error;}finally{active.delete(r);}
}
/** Pure prevention probe for host AI/previews. Does not initialize skill state. */
export function sgs_shixin_prevents(g,a,e={}){return owned(g,a,SK.shixin)&&e.target===a&&e.nature==='fire'&&e.damage>0&&!e.cancelled&&!e.prevented&&!['hp_loss','poison_loss','lose_hp'].includes(e.kind);}
/** FH7: each current receiver, before optional transfer or recipient armor costs.
 * Source-side already committed costs remain. This is not a native cross-game ruling. */
export function sgs_before_receiver_fire_shixin(g,a,e={}){
 if(!sgs_shixin_prevents(g,a,e))return false;
 if(!stable(e.damage_event_id))throw Error('释衅需要稳定伤害事件ID');
 const facts={damage_event_id:e.damage_event_id,source_id:pid(g,e.source),target_id:pid(g,a),nature:e.nature,kind:e.kind??null,card_use_id:e.card_use_id??null};
 const s=state(g,a),prior=s.shixin[key(e.damage_event_id)];
 if(prior&&(key(prior.request)!==key(facts)||prior.amount!==e.damage))throw Error('同一释衅伤害事件不能更换来源、目标或伤害');
 const amount=e.damage;
 if(!prior)s.shixin[key(e.damage_event_id)]={request:facts,amount,status:'done',binding_id:binding(g,a,SK.shixin)};
 e.prevented=true;e.prevented_by=SK.shixin;e.prevented_amount=amount;e.damage=0;
 if(!prior)g.view.emit(`${a.name}的释衅防止了${amount}点火焰伤害。`,{event_type:'damage_prevented',skill_id:SK.shixin,damage_event_id:e.damage_event_id,source_id:facts.source_id,target_id:facts.target_id,prevented_amount:amount,damage:0,nature:'fire',host_policy:'FH7'});
 return true;
}
export function sgs_sunru_skill_definitions({SkillHooks}){return {hooks:{[ID]:SkillHooks({on_prepare:[sgs_on_prepare_yingjian],before_receiver_damage_transfer:[sgs_before_receiver_fire_shixin],prevents_damage_preview:[sgs_shixin_prevents]})},active:{[ID]:[]}};}
sgs_on_prepare_yingjian.source_skill_id=SK.yingjian;sgs_before_receiver_fire_shixin.source_skill_id=SK.shixin;sgs_shixin_prevents.source_skill_id=SK.shixin;
