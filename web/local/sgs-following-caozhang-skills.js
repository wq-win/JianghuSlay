/** 曹彰 · 将驰, selected mainland-mobile base 身份 catalog, 2026-10-15.
 * The whole intrinsic inventory is implemented. Current-client parity is NOT
 * certified. F4/F5 are explicit host policies for draw commitment, foreign
 * modifiers, extra genuine draw phases, and actual-turn cleanup.
 * No Game prototype patching, roster registration, target or damage bonuses.
 */
import {CardType,is_sha_type,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_FOLLOWING_CAOZHANG_RULE_IDS=Object.freeze({caozhang:'sgs.adapted.base.hero.cao-zhang'});
export const SGS_FOLLOWING_CAOZHANG_SKILL_IDS=Object.freeze({jiangchi:'sgs.jiangchi'});
export const SGS_FOLLOWING_CAOZHANG_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['F0','F1','F4','F5']),
  heroes:Object.freeze([Object.freeze({id:SGS_FOLLOWING_CAOZHANG_RULE_IDS.caozhang,name:'曹彰',max_hp:4,starting_hp:4,
    starting_hp_direct_source_value:null,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.jiangchi']),personal_lord_skill_ids:Object.freeze([])})]),
  official_rule_text:'摸牌阶段，你可以选择一项：1.多摸一张牌，然后本回合你不能使用或打出【杀】；2.少摸一张牌，然后本回合你使用【杀】无距离限制且可以多使用一张【杀】。',
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-111.html','https://wiki.biligame.com/msgs/曹彰']),
});
export const SGS_FOLLOWING_CAOZHANG_MECHANICS=Object.freeze({
  actor_state_field:'sgs_following_caozhang_state',whole_template_copy:true,copy_donor_state:false,
  source_skill_id:'sgs.jiangchi',once_per:'genuine_normal_draw_operation',commit_before:'physical_normal_draw',
  reset_on_skill_loss:false,expires_on:'actual_turn_finally_or_final_death',
  allowance_stacking:'additive',absolute_prohibition_wins:true,draw_count_floor:0,
  extra_targets:0,damage_bonus:0,unrelated_actual_attack_range_unchanged:true,
  foreign_zero_count_draw_policy:'Existing normal operation remains eligible; adjusted quantity is floored at zero (host F5).',
});
const ID=SGS_FOLLOWING_CAOZHANG_RULE_IDS,SK=SGS_FOLLOWING_CAOZHANG_SKILL_IDS;
const FIELD='sgs_following_caozhang_state';
const origin=a=>a?._distance_origin??a;
const live=a=>Boolean(a?.alive&&!a.dead&&a.hp>0);
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const pid=(g,a)=>g.player_id?.(origin(a))??g.seat_of(origin(a));
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const own=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK.jiangchi)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,SK.jiangchi)===true;
const binding=(g,a)=>g.general_skill_binding_id?.(a,SK.jiangchi)??null;
const key=e=>stable(e?.event_id)?JSON.stringify(e.event_id):null;
const replayError=()=>Object.assign(Error('将驰摸牌事务未完成；请恢复原协程或按输入日志重放，不能重复选择或提交'),{code:'SGS_FOLLOWING_CAOZHANG_REPLAY_REQUIRED'});
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!s.draws||typeof s.draws!=='object'||Array.isArray(s.draws)
    ||!Array.isArray(s.effects))throw Error('Invalid Caozhang state');
  return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('将驰需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,draws:{},effects:[]};validateState(s);
  if(s.owner_id!==owner)throw Error('将驰状态不能转移给另一人物');
  return s;
}
/** Serializer for this actor's state, not an invitation to copy donor markers. */
export function sgs_clone_following_caozhang_state(a){return a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;}
function window(g,a,e){
  return own(g,a)&&ongoing(g)&&g.actual_turn_active!==false&&g.turn_phase==='draw'
    &&g.turn_actor===g.seat_of(a)&&stable(g.turn_event_counter)&&e?.actor===a
    &&stable(e.phase_event_id)&&stable(e.event_id)&&e.turn_id===g.turn_event_counter
    &&e.normal_draw===true&&!e.skipped&&!e.replaced&&!e.closed&&!e.completed&&!e.draw_started
    &&!a.skip_draw_stage&&!a.block_turn_draw;
}
function signature(g,a,count,e){return {owner_id:pid(g,a),turn_id:e.turn_id,phase_event_id:e.phase_event_id,event_id:e.event_id,input_count:count};}
function matching(r,g,a,e,count=r.request.input_count){
  if(JSON.stringify(r.request)!==JSON.stringify(signature(g,a,count,e)))throw Error('同一将驰摸牌事件不能更换人物、回合、阶段或原始摸牌数');
}
export const sgs_jiangchi_available=(g,a,e={})=>window(g,a,e)&&!a[FIELD]?.draws?.[key(e)];
/** No writes, random calls, hidden hand inspection, identity fallback or ledger
 * initialization. Resolved effects do not depend on retaining the source skill. */
export function sgs_jiangchi_modifiers(g,a){
  const actor=origin(a),s=actor?.[FIELD],owner=pid(g,actor);
  const effects=live(actor)&&g.actual_turn_active!==false&&stable(g.turn_event_counter)&&s?.version===1&&s.owner_id===owner
    &&Array.isArray(s.effects)?s.effects.filter(e=>e.owner_id===owner&&e.turn_id===g.turn_event_counter&&!e.cleared):[];
  return {attack:effects.filter(e=>e.choice==='attack').length,defend:effects.filter(e=>e.choice==='defend').length};
}
export const sgs_jiangchi_sha_prohibited=(g,a)=>sgs_jiangchi_modifiers(g,a).defend>0;
export const sgs_jiangchi_sha_use_or_play_prohibited=sgs_jiangchi_sha_prohibited;
export const sgs_jiangchi_sha_allowance=(g,a,base=1)=>base+sgs_jiangchi_modifiers(g,a).attack;
export const sgs_jiangchi_attack_range=(g,a,base=1,{card_type=CardType.SHA}={})=>is_sha_type(card_type)&&sgs_jiangchi_modifiers(g,a).attack>0?Infinity:base;
/** Generic gate receives the EFFECTIVE function, never its physical material.
 * A real Slash used as Shan remains legal; a Shan used as Slash is prohibited. */
export function sgs_jiangchi_card_prohibited(g,a,cardOrType){return is_sha_type(typeof cardOrType==='string'?cardOrType:cardOrType?.type)&&sgs_jiangchi_sha_prohibited(g,a);}
export function sgs_jiangchi_public_state(g,a){
  const m=sgs_jiangchi_modifiers(g,a);
  return {turn_id:g.turn_event_counter??null,attack_choices:m.attack,defend_choices:m.defend,sha_use_bonus:m.attack,
    sha_use_prohibited:m.defend>0,sha_play_prohibited:m.defend>0,sha_infinite_range:m.attack>0,
    sha_target_bonus:0,damage_bonus:0,expires_on:'turn_end'};
}
/** Conservative AI: own hand and public living-team/range information only.
 * It never treats a friendly target as a reason to choose the offensive branch. */
export function sgs_ai_jiangchi_choice(g,a){
  if(a.prison_no_sha||g.sha_use_prohibited?.(a))return 'defend';
  const foes=g.all_players().filter(p=>p!==a&&live(p)&&g.side_of(p)!==g.side_of(a)&&g.can_sha_target(a,p,{allow_allies:false}));
  if(!foes.length)return 'defend';
  const slashes=(a.hand??[]).filter(c=>is_sha_card(c)).length;
  if(slashes>=2||slashes>0&&foes.some(p=>!g.in_attack_range(a,p)))return 'attack';
  return slashes>0?'decline':'defend';
}
const choices=Object.freeze([
  Object.freeze({id:'defend',label:'多摸一张；本回合不能使用或打出任何杀'}),
  Object.freeze({id:'attack',label:'少摸一张；本回合杀无距离限制，使用次数+1'}),
  Object.freeze({id:'decline',label:'不发动，正常摸牌'}),
]);
function selected(answer){
  const text=String(answer).trim().toLowerCase();
  if(['cancel','pass','0','n','no','decline'].includes(text))return 'decline';
  return choices.find(c=>c.id===text)?.id??(/^[1-3]$/.test(text)?choices[Number(text)-1].id:null);
}
/** Stage only. The host MUST run commit_normal_draw after every modifier and
 * before draw_cards; ordinary before-draw or replacement hooks are too early.
 * Durable selected/offered receipts are intentionally visible in snapshots. */
export async function sgs_before_normal_draw_jiangchi(g,a,_target,count,e={}){
  if(!Number.isSafeInteger(count)||count<0)throw Error('将驰需要非负整数摸牌数');
  const existing=a?.[FIELD]?.draws?.[key(e)];
  if(existing){
    matching(existing,g,a,e,count);
    if(['offered','failed'].includes(existing.status))throw replayError();
    return existing.output_count;
  }
  if(!window(g,a,e))return count;
  const s=state(g,a),r=s.draws[key(e)]={request:signature(g,a,count,e),status:'offered',choice:null,
    binding_id:binding(g,a),rule_id:rule_hero(a)?.id??null,output_count:count,delta:0,committed:false};
  const valid=()=>r.status==='offered'&&window(g,a,e)&&binding(g,a)===r.binding_id&&(rule_hero(a)?.id??null)===r.rule_id;
  try{
    let choice=null;
    if(a.is_ai)choice=sgs_ai_jiangchi_choice(g,a);
    while(choice===null&&valid()){
      const answer=await g.view.ask_line('将驰：摸牌前选择本回合的取舍',{
        kind:'choice',player_id:g.seat_of(a),options:choices.map(c=>({...c})),
        meta:{skill:'将驰',skill_id:SK.jiangchi,stage:'jiangchi_choice',private_to:g.seat_of(a),
          phase_event_id:e.phase_event_id,turn_id:e.turn_id,normal_draw:true,ordinary_draw_count:count},
      });
      if(!valid())break;choice=selected(answer);
      if(choice===null)g.view.emit('请选择多摸、少摸或不发动。',{private_to:g.seat_of(a)});
    }
    if(!valid()){r.status='aborted';return count;}
    r.choice=choice??'decline';
    r.output_count=Math.max(0,count+(r.choice==='defend'?1:r.choice==='attack'?-1:0));
    r.delta=r.output_count-count;r.status=r.choice==='decline'?'passed':'selected';
    return r.output_count;
  }catch(error){r.status='failed';r.error=String(error?.message??error);throw error;}
}
/** Atomic synchronous commit. Register this captured hook even if a preceding
 * modifier removes the skill, so its staged quantity can be rolled back. */
export function sgs_commit_normal_draw_jiangchi(g,a,_target,count,e={}){
  const r=a?.[FIELD]?.draws?.[key(e)];if(!r)return count;
  matching(r,g,a,e);
  if(['offered','failed'].includes(r.status))throw replayError();
  if(Object.hasOwn(r,'commit_input_count')){
    if(count!==r.commit_input_count)throw Error('同一将驰提交不能更换最终摸牌数');
    return r.final_count;
  }
  if(r.status==='passed'||r.status==='aborted'||r.status==='expired')return count;
  if(r.status!=='selected')throw Error('Invalid Jiangchi draw receipt');
  if(!window(g,a,e)||binding(g,a)!==r.binding_id||(rule_hero(a)?.id??null)!==r.rule_id){
    r.status='cancelled';r.cancelled_delta=r.delta;r.commit_input_count=count;r.final_count=Math.max(0,count-r.delta);
    return r.final_count;
  }
  const s=state(g,a);
  // Receipt and marker commit together before emit or any physical draw callback.
  r.committed=true;r.status='committed';r.commit_input_count=count;r.final_count=count;
  s.effects.push({event_id:e.event_id,phase_event_id:e.phase_event_id,turn_id:e.turn_id,owner_id:pid(g,a),choice:r.choice});
  g.view.emit(r.choice==='defend'?`${a.name}发动将驰，多摸一张；本回合不能使用或打出任何杀。`:
    `${a.name}发动将驰，少摸一张；本回合杀无距离限制，使用次数加一。`,{
      event_type:'jiangchi_committed',skill_id:SK.jiangchi,turn_id:e.turn_id,phase_event_id:e.phase_event_id,choice:r.choice,
    });
  return count;
}
/** Must be called from actual turn finally, independent of current skills.
 * Capture turn_id at turn entry so a newer/nested turn cannot be cleared. */
export function sgs_jiangchi_turn_finally(g,a,{turn_id=g.turn_event_counter}={}){
  const s=a?.[FIELD];if(!s||s.owner_id!==pid(g,a))return false;
  validateState(s);let changed=false;
  s.effects=s.effects.filter(e=>{if(e.turn_id!==turn_id)return true;changed=true;return false;});
  for(const r of Object.values(s.draws))if(r.request.turn_id===turn_id&&!['passed','aborted','cancelled','expired'].includes(r.status)){
    r.status='expired';changed=true;
  }
  return changed;
}
/** Final death only, not dying entry before rescue. */
export function sgs_jiangchi_death(g,a){
  const s=a?.[FIELD];if(!s||s.owner_id!==pid(g,a))return false;
  validateState(s);const had=s.effects.length>0;s.effects=[];
  for(const r of Object.values(s.draws))if(!['passed','aborted','cancelled','expired'].includes(r.status))r.status='expired';
  return had;
}
export function sgs_following_caozhang_skill_definitions({SkillHooks}){
  return {hooks:{[ID.caozhang]:SkillHooks({before_normal_draw:[sgs_before_normal_draw_jiangchi],commit_normal_draw:[sgs_commit_normal_draw_jiangchi]})},active:{}};
}
sgs_before_normal_draw_jiangchi.source_skill_id=SK.jiangchi;
sgs_commit_normal_draw_jiangchi.source_skill_id=SK.jiangchi;
