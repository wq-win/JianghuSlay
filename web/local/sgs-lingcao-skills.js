/** 独进: optional floor(E/2)+1 ordinary-draw modifier, never a replacement. */
import {SGS_LINGCAO_HERO_ID as ID,SGS_LINGCAO_SKILL_IDS as SK} from './sgs-lingcao-data.js';
import {lingcao_stable as stable,lingcao_pid as pid,lingcao_ongoing as ongoing,lingcao_owned as owned,lingcao_binding as binding,lingcao_read as read,lingcao_state as state,lingcao_replay_error as replayError} from './sgs-lingcao-runtime.js';
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']),key=JSON.stringify;
/** Host has four physical slots. Suppressing a card's effects does not remove it. */
export const sgs_dujin_count_equipment_entities=cards=>new Set(cards.filter(c=>c&&!c.virtual)).size;
export const sgs_dujin_equipment_count=(_g,a)=>sgs_dujin_count_equipment_entities(SLOTS.map(slot=>a?.[slot]));
export function sgs_dujin_bonus(count){if(!Number.isSafeInteger(count)||count<0)throw Error('独进装备数量须为非负整数');return 1+Math.floor(count/2);}
function window(g,a,e){return owned(g,a,SK.dujin)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='draw'&&g.turn_actor===g.seat_of(a)
 &&stable(g.turn_event_counter)&&e?.actor===a&&stable(e.phase_event_id)&&stable(e.event_id)&&e.turn_id===g.turn_event_counter
 &&e.normal_draw===true&&!e.skipped&&!e.replaced&&!e.closed&&!e.completed&&!e.draw_started&&!a.skip_draw_stage&&!a.block_turn_draw;}
const request=(g,a,count,e)=>({owner_id:pid(g,a),turn_id:e.turn_id,phase_event_id:e.phase_event_id,event_id:e.event_id,input_count:count});
function match(r,g,a,e,count=r.request.input_count){if(key(r.request)!==key(request(g,a,count,e)))throw Error('同一独进事件不能更换人物、阶段或摸牌数');}
export const sgs_dujin_available=(g,a,e={})=>window(g,a,e)&&!read(g,a)?.draws[key(e.event_id)];
export const sgs_ai_dujin_choice=()=>true; // Extra cards have no mandatory price; no hidden observations.
const choice=x=>['yes','y','1','activate'].includes(String(x).toLowerCase())?true:['no','n','0','2','decline','cancel','pass'].includes(String(x).toLowerCase())?false:null;
export async function sgs_before_normal_draw_dujin(g,a,_target,count,e={}){
 if(!Number.isSafeInteger(count)||count<0)throw Error('独进需要非负整数摸牌数');
 const prior=read(g,a)?.draws[key(e.event_id)];if(prior){match(prior,g,a,e,count===prior.output_count?prior.request.input_count:count);if(['offered','failed'].includes(prior.status))throw replayError();return prior.output_count;}
 if(!window(g,a,e))return count;
 const r=state(g,a).draws[key(e.event_id)]={request:request(g,a,count,e),status:'offered',binding_id:binding(g,a,SK.dujin),committed:false,output_count:count,delta:0};
 const valid=()=>r.status==='offered'&&window(g,a,e)&&binding(g,a,SK.dujin)===r.binding_id;
 try{
  let selected=a.is_ai?sgs_ai_dujin_choice(g,a):null;
  while(selected===null&&valid()){
   const equipment_count=sgs_dujin_equipment_count(g,a),bonus=sgs_dujin_bonus(equipment_count);
   const answer=await g.view.ask_line(`独进：是否多摸${bonus}张牌？`,{kind:'choice',player_id:g.seat_of(a),options:[{id:'activate',label:`发动独进，多摸${bonus}张`},{id:'decline',label:'不发动'}],meta:{skill:'独进',skill_id:SK.dujin,stage:'dujin_choice',private_to:g.seat_of(a),phase_event_id:e.phase_event_id,turn_id:e.turn_id,equipment_count,bonus,ordinary_draw_count:count,normal_draw:true}});
   if(!valid())break;
   // A stale equipment count invalidates the answer, including an affirmative one.
   if(equipment_count!==sgs_dujin_equipment_count(g,a)){g.view.emit('装备数量已变化，请重新选择独进。',{private_to:g.seat_of(a)});continue;}
   selected=choice(answer);if(selected===null)g.view.emit('请选择发动或不发动。',{private_to:g.seat_of(a)});
  }
  if(!valid()){r.status='aborted';return count;}
  r.equipment_count=sgs_dujin_equipment_count(g,a);r.delta=selected?sgs_dujin_bonus(r.equipment_count):0;r.output_count=count+r.delta;r.status=selected?'selected':'passed';return r.output_count;
 }catch(error){r.status='failed';r.error=String(error?.message??error);throw error;}
}
/** Captured commit hook runs after all modifiers, even after skill loss. */
export function sgs_commit_normal_draw_dujin(g,a,_target,count,e={}){
 const r=read(g,a)?.draws[key(e.event_id)];if(!r)return count;match(r,g,a,e);
 if(['offered','failed'].includes(r.status))throw replayError();
 if(Object.hasOwn(r,'commit_input_count')){if(r.commit_input_count!==count)throw Error('同一独进提交不能更换最终摸牌数');return r.final_count;}
 if(['passed','aborted'].includes(r.status))return count;
 if(r.status!=='selected')throw Error('Invalid Dujin commit');
 r.commit_input_count=count;
 if(!window(g,a,e)||binding(g,a,SK.dujin)!==r.binding_id){r.status='cancelled';r.final_count=Math.max(0,count-r.delta);return r.final_count;}
 // Equipment count was fixed when this modifier resolved, not re-read after others.
 r.committed=true;r.status='committed';r.final_count=count;
 g.view.emit(`${a.name}发动独进，多摸${r.delta}张牌。`,{event_type:'dujin_committed',skill_id:SK.dujin,phase_event_id:e.phase_event_id,turn_id:e.turn_id,equipment_count:r.equipment_count,bonus:r.delta});return count;
}
export function sgs_lingcao_skill_definitions({SkillHooks}){return {hooks:{[ID]:SkillHooks({before_normal_draw:[sgs_before_normal_draw_dujin],commit_normal_draw:[sgs_commit_normal_draw_dujin]})},active:{[ID]:[]}};}
sgs_before_normal_draw_dujin.source_skill_id=SK.dujin;sgs_commit_normal_draw_dujin.source_skill_id=SK.dujin;
