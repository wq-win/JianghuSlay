/** 廖化 · complete Mobile base 身份 catalog snapshot, 2026-10-15.
 * N0–N4 are disclosed shared-host contracts, not current-client certification.
 * A genuine phase executor and authoritative general-skill ownership are required.
 */
import {hero_source_context} from './models.js';
import {rule_hero} from './effective-hero.js';
import {get_general_skill_descriptor} from './general-skill-descriptor.js';

export const SGS_NEXT_LIAOHUA_RULE_IDS=Object.freeze({liaohua:'sgs.adapted.base.hero.liao-hua'});
export const SGS_NEXT_LIAOHUA_SKILL_IDS=Object.freeze({dangxian:'sgs.dangxian',fuli:'sgs.fuli'});
export const SGS_NEXT_LIAOHUA_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['N0','N1','N2','N3','N4']),
  heroes:Object.freeze([Object.freeze({id:SGS_NEXT_LIAOHUA_RULE_IDS.liaohua,name:'廖化',max_hp:4,starting_hp:4,
    starting_hp_direct_source_value:null,starting_hp_basis:'N0 host full-HP initialization',gender:'male',source_faction:'蜀',
    skill_ids:Object.freeze(['sgs.dangxian','sgs.fuli']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    'sgs.dangxian':'锁定技，回合开始时，你执行一个额外的出牌阶段。',
    'sgs.fuli':'限定技，当你处于濒死状态时，你可以将体力回复至X点（X为全场势力数）。若如此做，你翻面。',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-115.html','https://wiki.biligame.com/msgs/廖化',
    'https://wiki.biligame.com/msgs/当先','https://wiki.biligame.com/msgs/伏枥']),
  bwiki_revision:35602,
});
export const SGS_NEXT_LIAOHUA_MECHANICS=Object.freeze({
  actor_state_field:'sgs_next_liaohua_state',whole_template_copy:true,copy_donor_state:false,
  phase_executor:'execute_extra_play_phase',phase_scope:'same_actual_turn_before_preparation',extra_turn:false,
  phase_local_quota_reset:true,turn_history_reset:false,wine_turn_quota_reset:false,turn_skill_quota_reset:false,
  limited_scope:'actor_lifetime',limited_reset_on_skill_loss:false,limited_reset_on_reacquisition:false,
  faction_policy:'current_effective_SGS_source_or_one_neutral_江湖_group',dying_not_dead_included:true,
  recovery:'recover_to_min_faction_count_and_current_max_hp',flip:'toggle_after_recovery',
});
const ID=SGS_NEXT_LIAOHUA_RULE_IDS,SK=SGS_NEXT_LIAOHUA_SKILL_IDS,FIELD='sgs_next_liaohua_state';
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const extant=a=>Boolean(a&&!a.dead),live=a=>extant(a)&&a.hp>0;
const pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
const owned=(g,a,skill)=>extant(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,skill)===true;
const bound=(g,a,skill)=>JSON.stringify([g.general_skill_binding_id?.(a,skill)??null,rule_hero(a)?.id??null]);
const key=id=>JSON.stringify(id),copy=value=>JSON.parse(JSON.stringify(value));
const running=new WeakMap(),references=new WeakMap();
const replayError=()=>Object.assign(Error('廖化技能事务未完成；须恢复原协程或按原输入日志重放，不能重复出牌、回复或翻面'),{code:'SGS_NEXT_LIAOHUA_REPLAY_REQUIRED'});
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!s.fuli_marker||typeof s.fuli_marker.used!=='boolean'
    ||['dangxian','dangxian_turns','fuli'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k]))
    ||s.fuli_marker.used&&!stable(s.fuli_marker.event_id))throw Error('Invalid Liao Hua state');
  return s;
}
function readState(g,a){
  const s=a?.[FIELD];if(!s)return null;validateState(s);
  if(s.owner_id!==pid(g,a))throw Error('廖化限定标记与事务不能转移给另一人物');return s;
}
function state(g,a){
  if(!stable(pid(g,a)))throw Error('廖化技能需要稳定人物ID');
  return readState(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),fuli_marker:{used:false,event_id:null},dangxian:{},dangxian_turns:{},fuli:{}});
}
/** Snapshot serializer only. Do not copy this state with a dead hero template. */
export const sgs_clone_next_liaohua_state=a=>a?.[FIELD]?copy(validateState(a[FIELD])):null;
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('廖化技能需要稳定事件ID');
  const s=state(g,a),rk=`${space}:${key(id)}`,old=s[space][key(id)];
  let active=running.get(a);if(!active)running.set(a,active=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((r,i)=>r!==refs[i]))throw Error('同一廖化事件不能更换人物、来源、回合或事件事实');
    if(old.status!=='done'&&!active.has(old))throw replayError();return null;
  }
  const receipt=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};active.add(receipt);known.set(rk,refs);
  return {receipt,finish(outcome){receipt.status='done';receipt.outcome=outcome;active.delete(receipt);},
    fail(error){receipt.status='failed';receipt.error=String(error?.message??error);active.delete(receipt);}};
}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`廖化接入缺少 ${name}`);}

/** Pure source projection. A branded suppressed-skill descriptor still retains
 * the current effective form's faction. No controller/team/YXS identity read.
 * The injectable resolver is for isolated source tests, not save/UI authority. */
export function sgs_liaohua_source_faction(actor,{resolve_source_context=hero_source_context}={}){
  const effective=rule_hero(actor),hero=get_general_skill_descriptor(effective)?.source_descriptor??effective;
  const native=typeof hero?.id==='string'&&hero.id.startsWith('sgs.');
  const sourceIds=native?[hero.id]:[...new Set((hero?.source_id_aliases??[]).filter(id=>id.startsWith('sgs.')))];
  const contexts=sourceIds.map(id=>resolve_source_context(hero,id)).filter(c=>c?.source_game==='三国杀'&&typeof c.faction==='string'&&c.faction.trim());
  if(sourceIds.length&&!contexts.length)throw Error('当前三国杀来源形态缺少已核验势力上下文');
  if(contexts.some(c=>['君','臣','民'].includes(c.faction)))throw Error('英雄杀身份类不能充当三国杀势力');
  const factions=[...new Set(contexts.map(c=>c.faction))];
  if(factions.length>1)throw Error('一个有效形态含相互冲突的三国杀势力，须先明确来源投影');
  return {effective_hero_id:hero?.id??null,original_hero_id:actor?.hero?.id??null,
    faction:factions[0]??'江湖',basis:contexts.length?(native?'effective_sgs_source':'merged_sgs_source_alias'):'neutral_jianghu_host_policy',
    source_ids:contexts.map(c=>c.source_id),host_policy_id:'N2'};
}
export function sgs_fuli_faction_projection(g,options={}){
  const rows=[],seen=new Map();
  for(const actor of g.all_players()){
    if(!extant(actor))continue;
    const id=pid(g,actor);if(!stable(id))throw Error('伏枥势力投影需要稳定人物ID');
    if(seen.has(id)){if(seen.get(id)!==actor)throw Error('伏枥势力投影遇到重复人物身份');continue;}seen.set(id,actor);
    rows.push({actor_id:id,name:actor.name??null,dying:actor.hp<=0,...sgs_liaohua_source_faction(actor,options)});
  }
  const factions=[...new Set(rows.map(r=>r.faction))];
  return {count:factions.length,factions,actors:rows,host_policy_id:'N2',neutral_faction:'江湖',
    basis:'当前有效三国杀来源势力；无三国杀来源势力者统一计为江湖；含濒死未阵亡者，排除已确认阵亡者'};
}
function turnWindow(g,a,e){
  return live(a)&&owned(g,a,SK.dangxian)&&!g.winner&&g.actual_turn_active===true&&g.turn_phase==='turn_start'
    &&g.turn_actor===g.seat_of(a)&&stable(g.turn_event_counter)&&stable(e?.event_id)
    &&(e.turn_id==null||e.turn_id===g.turn_event_counter)&&(e.actor==null||e.actor===a)
    &&!e.skipped&&!e.closed&&!e.cancelled;
}
export function sgs_dangxian_available(g,a,e={}){
  const s=readState(g,a);return turnWindow(g,a,e)&&!s?.dangxian[key(e.event_id)]&&!s?.dangxian_turns[key(g.turn_event_counter)];
}
/** The scheduler performs real PLAY entry/actions/end, returning its phase ID.
 * No card, quota, phase or turn variable is directly mutated by this module. */
export async function sgs_on_turn_begin_dangxian(g,a,target,e={}){
  const request={owner_id:pid(g,a),event_id:e.event_id,turn_id:e.turn_id??g.turn_event_counter};
  if(readState(g,a)?.dangxian[key(e.event_id)]){ticket(g,a,'dangxian',e.event_id,request,[a]);return false;}
  if(!sgs_dangxian_available(g,a,e))return false;
  methods(g,'execute_extra_play_phase');
  const t=ticket(g,a,'dangxian',e.event_id,request,[a]),s=state(g,a);
  try{
    t.receipt.status='executing_phase';t.receipt.committed=true;
    s.dangxian_turns[key(request.turn_id)]={event_id:e.event_id,committed:true};
    const phase=await g.execute_extra_play_phase(a,target,{event_id:`dangxian:${key([pid(g,a),e.event_id])}`,turn_id:request.turn_id,source_skill:SK.dangxian,before:'prepare'});
    if(!stable(phase?.phase_event_id)||!['done','interrupted'].includes(phase.status))throw Error('当先需要真实额外出牌阶段的完整回执');
    t.receipt.phase=copy(phase);t.finish(phase.status);return true;
  }catch(error){t.fail(error);throw error;}
}
const dyingId=e=>e?.dying_event_id??e?.event_id;
function dyingWindow(g,a,e){
  return owned(g,a,SK.fuli)&&a.hp<=0&&!g.winner&&stable(dyingId(e))
    &&e.dying_seat===g.seat_of(a)&&g.dying_stack?.includes(g.seat_of(a))
    &&(e.dying==null||e.dying===a)&&!e.closed&&!e.cancelled&&!e.waive_rescue;
}
const fuliReceiptId=(e,opportunity='entry')=>`fuli:${key([dyingId(e),opportunity])}`;
/** A declined entry offer does not consume this ongoing dying ability. */
export function sgs_fuli_can_rescue(g,a,e={}){
  const s=readState(g,a);return dyingWindow(g,a,e)&&!s?.fuli_marker.used
    &&!Object.values(s?.fuli??{}).some(r=>r.status!=='done');
}
export function sgs_fuli_available(g,a,e={}){
  return sgs_fuli_can_rescue(g,a,e)&&!readState(g,a)?.fuli[key(fuliReceiptId(e))];
}
export function sgs_fuli_public_state(g,a){
  const s=readState(g,a),projection=sgs_fuli_faction_projection(g),max=g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
  return {skill_id:SK.fuli,owned:owned(g,a,SK.fuli),used:s?.fuli_marker.used??false,
    used_event_id:s?.fuli_marker.event_id??null,scope:'actor_lifetime',faction_count:projection.count,
    recovery_target:Number.isSafeInteger(max)&&max>0?Math.min(max,projection.count):null,
    face_orientation:a?.face_orientation??'face_up',flip_to:a?.face_orientation==='face_down'?'face_up':'face_down',projection,
    events:Object.values(s?.fuli??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,outcome:r.outcome??null,
      recovered:r.recovered??null,hp_after:r.hp_after??null,face_after:r.face_after??null}))};
}
export const sgs_ai_fuli_decision=(g,a,e)=>sgs_fuli_available(g,a,e);
function decision(value){const v=String(value).trim().toLowerCase();return ['fuli','use','y','yes','1'].includes(v)?true:['pass','decline','cancel','0','n','no','2'].includes(v)?false:null;}
/** Owner dying response, before the generic rescue pass. Marker commits before
 * recovery callbacks. Skill loss after commitment cannot undo its pending flip;
 * final death does stop it. The skill never sets HP or resurrects a dead actor. */
async function resolveFuli(g,a,source,e={},options={}){
  const id=dyingId(e),opportunity=options.opportunity_id??'entry',receiptId=fuliReceiptId(e,opportunity);
  const request={owner_id:pid(g,a),source_id:pid(g,source),event_id:id,opportunity_id:opportunity,dying_seat:e.dying_seat??null};
  if(readState(g,a)?.fuli[key(receiptId)]){ticket(g,a,'fuli',receiptId,request,[a,source??null]);return false;}
  if(!sgs_fuli_can_rescue(g,a,e))return false;
  methods(g,'recover_hp','flip_general','effective_max_hp');
  const t=ticket(g,a,'fuli',receiptId,request,[a,source??null]),binding=bound(g,a,SK.fuli);
  const valid=()=>dyingId(e)===id&&dyingWindow(g,a,e)&&bound(g,a,SK.fuli)===binding&&!state(g,a).fuli_marker.used&&t.receipt.status==='offered';
  try{
    let accepted=options.accepted===true||a.is_ai?true:null;
    while(accepted===null&&valid()){
      const preview=sgs_fuli_public_state(g,a);
      const answer=await g.view.ask_line(`伏枥：消耗本局限定标记，将体力回复至${preview.recovery_target}点（X=${preview.faction_count}），然后翻面？`,{
        kind:'choice',player_id:g.seat_of(a),options:[{id:'fuli',label:'发动伏枥：回复至X并翻面'},{id:'pass',label:'不发动，继续通常救援'}],
        meta:{skill:'伏枥',skill_id:SK.fuli,stage:'fuli_choice',private_to:g.seat_of(a),event_id:id,dying_seat:g.seat_of(a),
          faction_count:preview.faction_count,recovery_target:preview.recovery_target,faction_projection:preview.projection,
          limited_scope:'actor_lifetime',face_orientation:preview.face_orientation,flip_to:preview.flip_to},
      });
      if(!valid())break;accepted=decision(answer);
      if(accepted===null)g.view.emit('请选择发动伏枥或继续通常救援。',{private_to:g.seat_of(a)});
    }
    if(!valid()||accepted!==true){t.finish(accepted===false?'declined':'stale');return false;}
    const projection=sgs_fuli_faction_projection(g),max=g.effective_max_hp(a);
    if(!Number.isSafeInteger(max)||max<1||projection.count<1)throw Error('伏枥需要有效体力上限与在场势力');
    t.receipt.faction_projection=projection;t.receipt.target_hp=Math.min(projection.count,max);t.receipt.hp_before=a.hp;
    t.receipt.face_before=a.face_orientation??'face_up';t.receipt.committed=true;t.receipt.status='recovering';
    state(g,a).fuli_marker={used:true,event_id:id};
    t.receipt.recovered=await g.recover_hp(a,Math.max(0,t.receipt.target_hp-a.hp),{source:a,source_skill:SK.fuli,
      recovery_event_id:`fuli:${key([pid(g,a),id])}:recover`,dying_event_id:id,recovery_target:t.receipt.target_hp});
    t.receipt.hp_after=a.hp;t.receipt.status='recovered';
    if(extant(a)){
      t.receipt.status='flipping';t.receipt.flipped=await g.flip_general(a,{source_skill:SK.fuli,event_id:`fuli:${key([pid(g,a),id])}:flip`});
      t.receipt.face_after=a.face_orientation??'face_up';
    }else t.receipt.flipped=false;
    t.finish(a.dead?'final_dead':'resolved');return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_on_dying_entry_fuli=(g,a,source,e={})=>resolveFuli(g,a,source,e);
/** Host calls this only after the owner selected 伏枥 in a real rescue menu.
 * Each menu action has a stable ID; no additional confirmation is necessary.
 * The original dying entry remains authoritative and must be closed on exit. */
export async function sgs_fuli_rescue_execute(g,a,source,e={},options={}){
  if(!stable(options.opportunity_id)||options.opportunity_id==='entry')throw Error('伏枥救援菜单需要独立稳定机会ID');
  return resolveFuli(g,a,source,e,{opportunity_id:options.opportunity_id,accepted:true});
}
export function sgs_next_liaohua_skill_definitions({SkillHooks}){
  return {hooks:{[ID.liaohua]:SkillHooks({on_turn_begin:[sgs_on_turn_begin_dangxian],on_dying_entry:[sgs_on_dying_entry_fuli]})},active:{}};
}
sgs_on_turn_begin_dangxian.source_skill_id=SK.dangxian;
sgs_on_dying_entry_fuli.source_skill_id=SK.fuli;
