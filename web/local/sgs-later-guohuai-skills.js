/** 郭淮: complete official Mobile 124 base identity packet, 2026-10-15.
 * The selected official 精策 counts the WHOLE TURN. BWIKI's per-phase wording
 * is a recorded version conflict, not blended into this adaptation. */
import {rule_hero} from './effective-hero.js';
export const SGS_LATER_GUOHUAI_RULE_IDS=Object.freeze({guohuai:'sgs.adapted.base.hero.guo-huai'});
export const SGS_LATER_GUOHUAI_SKILL_IDS=Object.freeze({jingce:'sgs.jingce'});
const ID=SGS_LATER_GUOHUAI_RULE_IDS,SK=SGS_LATER_GUOHUAI_SKILL_IDS;
export const SGS_LATER_GUOHUAI_SOURCE=Object.freeze({snapshot_date:'2026-10-15',variant:'mobile-base-identity-catalog-whole-turn-jingce-2026-10-15',
  current_client_verified:false,current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P4','P16']),count_scope:'whole_turn',excluded_count_scope:'BWIKI current PLAY phase',
  heroes:Object.freeze([Object.freeze({id:ID.guohuai,name:'郭淮',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,
    starting_hp_basis:'P0 host normal-full-HP initialization',gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.jingce]),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.jingce]:'出牌阶段结束时，若你于此回合内使用过的牌数量不小于你的体力值，则你可以摸两张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-124.html','https://wiki.biligame.com/msgs/郭淮'])});
const live=a=>!!a&&!a.dead&&a.hp>0;
const stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
const seat=(g,a)=>g.seat_of(a),pid=(g,a)=>g.player_id?.(a)??seat(g,a);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK.jingce)&&g.has_general_skill?.(a,SK.jingce)===true;
const binding=(g,a)=>JSON.stringify([g.general_skill_binding_id?.(a,SK.jingce)??pid(g,a),rule_hero(a)?.id]);
const active=new WeakMap();
function state(a){
  const s=a.sgs_later_guohuai_state??={version:1,phases:{}};
  if(s.version!==1||!s.phases||typeof s.phases!=='object'||Array.isArray(s.phases))throw Error('Invalid Guo Huai skill state');
  return s;
}
export const sgs_clone_later_guohuai_state=a=>a.sgs_later_guohuai_state?JSON.parse(JSON.stringify(state(a))):null;
/** The journal contains committed USE records only. Do not substitute a phase
 * quota, outermost-use lookup, material count, or cards entering discard. */
export function sgs_jingce_turn_use_count(g,a,turn_id=g.card_use_history?.current_turn_id){
  if(!stable(turn_id)||!Array.isArray(g.card_use_history?.uses))return 0;
  const uses=g.card_use_history.uses.filter(use=>use.actor_id===pid(g,a)&&use.turn_id===turn_id
    &&(use.kind===undefined||use.kind==='card_use')&&(use.stage===undefined||use.stage==='committed'));
  return new Set(uses.filter(use=>stable(use.use_id)).map(use=>JSON.stringify(use.use_id))).size;
}
const phaseKey=e=>e.phase_event_id??e.event_id;
const identity=(g,a,e)=>({owner_id:pid(g,a),phase_event_id:phaseKey(e),turn_id:e.turn_id,history_turn_id:e.history_turn_id??g.card_use_history?.current_turn_id,extra:e.extra===true});
function phaseValid(g,a,e,request){
  return owned(g,a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_actor===seat(g,a)&&g.turn_phase==='play'
    &&e.entered===true&&!e.skipped&&!e.interrupted&&(!e.actor||e.actor===a)
    &&stable(request.phase_event_id)&&a.play_phase_id===request.phase_event_id&&g.active_play_phase_id===request.phase_event_id
    &&e.turn_id===g.turn_event_counter&&stable(request.history_turn_id)&&g.card_use_history?.current_turn_id===request.history_turn_id;
}
export async function sgs_on_play_phase_end_jingce(g,a,_target,event={}){
  const request=identity(g,a,event),key=JSON.stringify(request.phase_event_id),old=a?.sgs_later_guohuai_state?.phases?.[key];
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request))throw Error('同一精策出牌阶段不能更换回合或人物');
    if(old.status!=='done'&&!active.get(a)?.has(old))throw Object.assign(Error('精策事务中断；须从动作日志恢复，不能重复摸牌'),{code:'SGS_LATER_GUOHUAI_REPLAY_REQUIRED'});
    return false;
  }
  if(!phaseValid(g,a,event,request))return false;
  const count=sgs_jingce_turn_use_count(g,a,request.history_turn_id),hp=a.hp;
  const row=state(a).phases[key]={request,status:'offered',count,hp,accepted:false,draw_started:false,draw_done:false};
  if(count<hp){row.status='done';return false;}
  let running=active.get(a);if(!running)active.set(a,running=new Set());running.add(row);
  const bound=binding(g,a),valid=()=>phaseValid(g,a,event,request)&&binding(g,a)===bound
    &&JSON.stringify(identity(g,a,event))===JSON.stringify(request);
  try{
    let accepted=a.is_ai===true;
    while(!accepted&&valid()&&!a.is_ai){
      const answer=String(await g.view.ask_line(`精策：本回合已使用${count}张牌，发动时体力${hp}，是否摸两张牌？`,{
        kind:'choice',player_id:seat(g,a),options:[{id:'draw',label:'发动精策，摸两张牌'},{id:'pass',label:'不发动'}],
        meta:{skill:'精策',skill_id:SK.jingce,stage:'jingce_offer',private_to:seat(g,a),phase_event_id:request.phase_event_id,
          history_turn_id:request.history_turn_id,count_scope:'whole_turn',card_use_count:count,hp_threshold:hp,extra:request.extra}}));
      if(['pass','cancel','0','n','no'].includes(answer))break;
      accepted=['draw','1','y','yes'].includes(answer);
    }
    if(!accepted||!valid()){row.status='done';return false;}
    if(typeof g.draw_cards!=='function')throw Error('精策接入缺少 draw_cards');
    row.accepted=true;row.draw_started=true;row.status='drawing';
    const drawn=await g.draw_cards(a,2);row.draw_done=true;
    row.drawn_count=Array.isArray(drawn)?drawn.length:null;
    row.status='done';
    g.view.emit(`${a.name}发动精策，摸两张牌。`,{event_type:'skill_draw',source_skill:SK.jingce,phase_event_id:request.phase_event_id,count_scope:'whole_turn',card_use_count:count});
    return true;
  }catch(error){row.status='failed';row.error=String(error?.message??error);throw error;}
  finally{running.delete(row);}
}
export function sgs_later_guohuai_public_state(a){return {phases:Object.values(a?.sgs_later_guohuai_state?.phases??{}).map(r=>({phase_event_id:r.request.phase_event_id,status:r.status,count:r.count,hp:r.hp,accepted:r.accepted,draw_done:r.draw_done}))};}
export function sgs_later_guohuai_skill_definitions({SkillHooks}){return {hooks:{[ID.guohuai]:SkillHooks({on_play_phase_end:[sgs_on_play_phase_end_jingce]})},active:{[ID.guohuai]:[]}};}
sgs_on_play_phase_end_jingce.source_skill_id=SK.jingce;
