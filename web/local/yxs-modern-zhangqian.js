/** 张骞：4 血、完整固有技能凿空。官方发布规则，非当前客户端认证。
 * H5: mixed-game Slash variants share one bucket. H6: aggregate target window.
 * H7: directed distance is snapshotted at commitment, before either draw. */
import {CardType,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';

export const YXS_MODERN_ZHANGQIAN_RULE_IDS=Object.freeze({zhangqian:'yxs.mobile.published.hero.zhang-qian.2026'});
export const YXS_MODERN_ZHANGQIAN_SKILL_IDS=Object.freeze({zaokong:'yxs.zaokong'});
export const YXS_MODERN_ZHANGQIAN_SOURCE=Object.freeze({product:'腾讯英雄杀手游',snapshot_date:'2026-10-15',publication_date:'2026-08-07',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,image_panels_read:false,
  heroes:Object.freeze([Object.freeze({id:YXS_MODERN_ZHANGQIAN_RULE_IDS.zhangqian,name:'张骞',max_hp:4,starting_hp:4,
    starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:null,source_faction:null,
    skill_ids:Object.freeze(['yxs.zaokong']),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  urls:Object.freeze(['https://www.taptap.cn/moment/834713369058477856']),
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H5','H6','H7','H10']),
  native_kinds:Object.freeze(['杀','决斗','烽火狼烟','万箭齐发']),native_exclusions:Object.freeze(['借刀杀人','手捧雷']),
  mode_evidence:'Official guide discusses 常规3v3; other mode pools unverified',native_metadata_complete:false,
});
const SK='yxs.zaokong',FIELD='yxs_modern_zhangqian_state',KINDS=['sha','duel','fenghuo','wanjian'];
const key=JSON.stringify,copy=x=>JSON.parse(JSON.stringify(x));
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>=0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false);
const pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK)
  &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null
    ?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK):g.has_general_skill?.(a,SK)===true);
const binding=(g,a)=>key([g.general_skill_binding_id?.(a,SK)??pid(g,a),rule_hero(a)?.id]);
const active=new WeakMap();
function validate(s){
  if(s?.version!==1||!stable(s.owner_id)||!Array.isArray(s.budgets)||!Array.isArray(s.events)
    ||s.budgets.some(b=>!stable(b.turn_id)||!Array.isArray(b.kinds)||new Set(b.kinds).size!==b.kinds.length||b.kinds.some(k=>!KINDS.includes(k)))
    ||new Set(s.budgets.map(b=>key(b.turn_id))).size!==s.budgets.length
    ||s.events.some(r=>!stable(r.event_id)||!r.facts||typeof r.committed!=='boolean'||!['offered','drawing','done','failed'].includes(r.status)||!Array.isArray(r.draws))
    ||new Set(s.events.map(r=>key(r.event_id))).size!==s.events.length)throw Error('Invalid Zhang Qian state');
  return s;
}
function read(g,a){if(!a?.[FIELD])return null;const s=validate(a[FIELD]);if(s.owner_id!==pid(g,a))throw Error('凿空事务不能继承另一人物');return s;}
function state(g,a){const id=pid(g,a);if(!stable(id))throw Error('凿空需要稳定人物ID');return read(g,a)??(a[FIELD]={version:1,owner_id:id,budgets:[],events:[]});}
export const yxs_clone_modern_zhangqian_state=a=>a?.[FIELD]?copy(validate(a[FIELD])):null;
/** Only the four published kinds. Borrowed Weapon's subsequent real Slash is
 * separately eligible; Borrowed Weapon, Lightning and Fire Attack are not. */
export function yxs_zaokong_kind(card){
  if(is_sha_type(card?.type))return 'sha';
  if(card?.type!==CardType.SCROLL)return null;
  return ({决斗:'duel',烽火狼烟:'fenghuo',万箭齐发:'wanjian'})[card.name]??null;
}
const face=e=>e.effective_face??e.card??e.source_card;
function facts(g,e){return {event_id:e.event_id,card_use_id:e.card_use_id,turn_id:e.turn_id,card_user_id:pid(g,e.card_user),
  effective_face:{name:face(e)?.name??null,type:face(e)?.type??null},target_ids:(e.targets??[]).map(p=>pid(g,p))};}
function shape(g,e){return stable(e.event_id)&&stable(e.card_use_id)&&stable(e.turn_id)&&e.card_user&&Array.isArray(e.targets)
  &&e.targets.length>0&&e.targets.every(p=>p&&stable(pid(g,p)))&&new Set(e.targets.map(p=>pid(g,p))).size===e.targets.length
  &&Array.isArray(e.cancelled_target_ids)&&!!yxs_zaokong_kind(face(e));}
function window(g,a,e){return shape(g,e)&&owned(g,a)&&ongoing(g)&&g.actual_turn_active===true&&e.turn_id===g.turn_event_counter
  &&!e.closed&&!e.cancelled&&e.committed!==false&&(e.card_user===a||e.targets.includes(a))
  &&(g.yxs_modern_target_event_is_current?.(e)??true);}
export function yxs_zaokong_used_kinds(g,a,turn_id=g.turn_event_counter){return [...(read(g,a)?.budgets.find(b=>b.turn_id===turn_id)?.kinds??[])];}
export function yxs_zaokong_targets(g,a,e){
  if(!window(g,a,e)||yxs_zaokong_used_kinds(g,a,e.turn_id).includes(yxs_zaokong_kind(face(e))))return [];
  return e.targets.filter(p=>live(p)&&!e.cancelled_target_ids.includes(pid(g,p)));
}
export function yxs_zaokong_distance(g,a,target){
  if(a===target)return 0;
  const x=g.distance_between(a,target);
  if(!Number.isSafeInteger(x)||x<0)throw Error('凿空需要非负整数有向距离');return x;
}
export function yxs_zaokong_effect_is_cancelled(g,card_use_id,target){
  const id=typeof target==='object'?pid(g,target):target;
  return g.all_players().some(p=>read(g,p)?.events.some(r=>r.committed&&r.facts.card_use_id===card_use_id&&r.target_id===id));
}
export function yxs_ai_zaokong_target(g,a,e){
  if(typeof g.side_of!=='function')return null;
  return yxs_zaokong_targets(g,a,e).filter(p=>g.side_of(p)===g.side_of(a))
    .sort((x,y)=>x.hp-y.hp||yxs_zaokong_distance(g,a,y)-yxs_zaokong_distance(g,a,x))[0]??null;
}
function replay(g,a,e,options){
  const r=read(g,a)?.events.find(row=>row.event_id===e.event_id);if(!r)return null;
  if(key(r.facts)!==key(facts(g,e))||options.target&&r.target_id!==pid(g,options.target)||options.target_id!=null&&r.target_id!==options.target_id)
    throw Error('同一凿空事件不能更换用牌、目标或回合');
  if(r.committed&&!e.cancelled_target_ids.includes(r.target_id))e.cancelled_target_ids.push(r.target_id);
  if(r.status!=='done'&&!active.get(a)?.has(r))throw Object.assign(Error('凿空事务中断；须续接原协程或按原输入日志重放'),{code:'YXS_ZAOKONG_REPLAY_REQUIRED'});
  return r;
}
async function draw(g,p,count,r){
  const item={player_id:pid(g,p),requested:count,drawn:0,status:'pending'};r.draws.push(item);
  if(count===0){item.status='zero';return;}
  if(!live(p)||!ongoing(g)){item.status=!live(p)?'skipped_dead':'skipped_match_closed';return;}
  item.status='started';const cards=await g.draw_cards(p,count);item.drawn=Array.isArray(cards)?cards.length:null;item.status='done';
}
/** Exactly one offer per owner/use before ANY branch response. The aggregate
 * host owns immutable target membership and deterministic owner order. */
export async function yxs_on_card_targets_zaokong(g,a,e={},options={}){
  const old=replay(g,a,e,options);if(old)return Boolean(old.committed);
  const eligible=yxs_zaokong_targets(g,a,e);if(!eligible.length)return false;
  const s=state(g,a);if(s.events.some(r=>r.status!=='done'))return false;
  const request=facts(g,e),bound=binding(g,a),kind=yxs_zaokong_kind(face(e));
  const r={event_id:e.event_id,facts:request,kind,status:'offered',committed:false,draws:[]};s.events.push(r);
  let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());jobs.add(r);
  const valid=()=>window(g,a,e)&&binding(g,a)===bound&&key(facts(g,e))===key(request);
  const finish=()=>{r.status='done';jobs.delete(r);};
  try{
    let target=options.target??eligible.find(p=>pid(g,p)===options.target_id)??null;
    if(!target&&a.is_ai)target=yxs_ai_zaokong_target(g,a,e);
    else if(!target&&options.choose!==false){
      while(valid()){
        const targets=yxs_zaokong_targets(g,a,e);if(!targets.length)break;
        const choices=targets.map(p=>{const distance=yxs_zaokong_distance(g,a,p);return {id:String(pid(g,p)),label:p===a?`${p.name}：自己总共摸1张（距离0）`:`${p.name}摸1张；你摸${distance}张（有向距离${distance}）`,target_id:pid(g,p),distance,target_draw:1,owner_draw:distance};});
        const answer=await g.view.ask_line(`凿空：可令「${face(e).name}」对一名目标无效`,{kind:'choice',player_id:g.seat_of(a),options:[...choices,{id:'cancel',label:'不发动，不消耗本类次数'}],meta:{skill:'凿空',skill_id:SK,stage:'zaokong_target',private_to:g.seat_of(a),optional:true,event_id:e.event_id,card_use_id:e.card_use_id,kind,source_skill_id:SK,target_ids:choices.map(c=>c.target_id)}});
        if(!valid()||['cancel','pass','0','n','no'].includes(String(answer)))break;
        const selected=choices.find(c=>c.id===String(answer))??(/^\d+$/.test(String(answer))?choices[Number(answer)-1]:null);
        target=targets.find(p=>pid(g,p)===selected?.target_id);if(target)break;
      }
    }
    if(!target||!valid()||!yxs_zaokong_targets(g,a,e).includes(target)){r.declined=true;finish();return false;}
    const x=yxs_zaokong_distance(g,a,target);
    // No await between final validity, spending the shared kind, and cancelling.
    let budget=s.budgets.find(b=>b.turn_id===e.turn_id);if(!budget)s.budgets.push(budget={turn_id:e.turn_id,kinds:[]});
    budget.kinds.push(kind);r.target_id=pid(g,target);r.distance=x;r.committed=true;r.status='drawing';
    e.cancelled_target_ids.push(r.target_id);
    g.view.emit(`${a.name}发动凿空，「${face(e).name}」对${target.name}无效；${target.name}摸1张，${a.name}按距离${x}摸牌。`,{event_type:'skill_commit',skill_id:SK,card_use_id:e.card_use_id,target_id:r.target_id,distance:x,kind});
    await draw(g,target,1,r);await draw(g,a,x,r);
    finish();return true;
  }catch(error){r.status='failed';r.error=String(error?.message??error);jobs.delete(r);throw error;}
}
export const yxs_commit_zaokong=(g,a,e,options={})=>yxs_on_card_targets_zaokong(g,a,e,{...options,choose:false});
export function yxs_modern_zhangqian_public_state(a,g=null){
  const s=a?.[FIELD]?validate(a[FIELD]):null;
  return {used_kinds:g?yxs_zaokong_used_kinds(g,a):[],budgets:copy(s?.budgets??[]),events:(s?.events??[]).map(r=>({event_id:r.event_id,card_use_id:r.facts.card_use_id,turn_id:r.facts.turn_id,kind:r.kind,status:r.status,committed:r.committed,target_id:r.committed?r.target_id:null,distance:r.committed?r.distance:null,draws:copy(r.draws)}))};
}
export function yxs_modern_zhangqian_skill_definitions({SkillHooks}){return {hooks:{[YXS_MODERN_ZHANGQIAN_RULE_IDS.zhangqian]:SkillHooks({on_aggregate_card_targets:[yxs_on_card_targets_zaokong]})},active:{}};}
yxs_on_card_targets_zaokong.source_skill_id=SK;
