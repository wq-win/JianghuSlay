/** 朱桓: complete classic 4HP Mobile 奋励 / 平寇 packet, 2026-10-15.
 * Actual phase occurrences and true turn end are host contracts, never inferred
 * from an empty action list or the legacy pre-discard on_turn_end hook. */
import {rule_hero} from './effective-hero.js';
export const SGS_FOLLOWUP_ZHUHUAN_RULE_IDS=Object.freeze({zhuhuan:'sgs.adapted.base.hero.zhu-huan'});
export const SGS_FOLLOWUP_ZHUHUAN_SKILL_IDS=Object.freeze({fenli:'sgs.fenli',pingkou:'sgs.pingkou'});
const ID=SGS_FOLLOWUP_ZHUHUAN_RULE_IDS,SK=SGS_FOLLOWUP_ZHUHUAN_SKILL_IDS,FIELD='sgs_followup_zhuhuan_state';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'],PHASES={draw:'摸牌',play:'出牌',discard:'弃牌'};
export const SGS_FOLLOWUP_ZHUHUAN_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
 current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
 host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7']),
 heroes:Object.freeze([Object.freeze({id:ID.zhuhuan,name:'朱桓',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'吴',skill_ids:Object.freeze([SK.fenli,SK.pingkou]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
 literal_skill_text:Object.freeze({[SK.fenli]:'若你的手牌数为全场最多，你可以跳过摸牌阶段；若你的体力值为全场最多，你可以跳过出牌阶段；若你的装备区里有牌且数量为全场最多，你可以跳过弃牌阶段。',
 [SK.pingkou]:'回合结束时，你可以对至多X名其他角色各造成1点伤害（X为你本回合跳过的阶段数）。'}),
 urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-181.html','https://wiki.biligame.com/msgs/朱桓','https://wiki.biligame.com/msgs/奋励','https://wiki.biligame.com/msgs/平寇']),
 excluded_variants:Object.freeze(['诱敌','界朱桓 equipment gain','end-phase-start Pingkou']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0,key=JSON.stringify;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
 &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):typeof g.has_general_skill==='function'?g.has_general_skill(a,id):(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id));
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const active=new WeakMap(),record=x=>x&&typeof x==='object'&&!Array.isArray(x);
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!record(s.fenli)||!record(s.pingkou)||[...Object.values(s.fenli),...Object.values(s.pingkou)].some(r=>!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'||!['offered','selecting','resolving','done','failed'].includes(r.status)))throw Error('Invalid Zhu Huan state');return s;}
function read(g,a){const s=a?.[FIELD];if(!s)return null;validate(s);if(s.owner_id!==pid(g,a))throw Error('朱桓事务不能继承另一人物');return s;}
function ticket(g,a,space,id,request){
 if(!stable(id)||!stable(pid(g,a)))throw Error('朱桓需要稳定人物与事件ID');
 const s=read(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),fenli:{},pingkou:{}}),old=s[space][key(id)];let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());
 if(old){if(key(old.request)!==key(request))throw Error('同一朱桓事件不能更换事实');if(old.status!=='done'&&!jobs.has(old))throw Object.assign(Error('朱桓事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_FOLLOWUP_ZHUHUAN_REPLAY_REQUIRED'});return null;}
 if([...Object.values(s.fenli),...Object.values(s.pingkou)].some(r=>r.status!=='done'))return null;
 const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};jobs.add(r);
 return {r,finish(){r.status='done';jobs.delete(r);},fail(e){r.status='failed';r.error=String(e?.message??e);jobs.delete(r);}};
}
export const sgs_clone_followup_zhuhuan_state=a=>a?.[FIELD]?JSON.parse(key(validate(a[FIELD]))):null;
/** Only public counts/current HP. Ties qualify; zero equipment never qualifies. */
export function sgs_fenli_condition(g,a,phase){
 if(!PHASES[phase]||!live(a))return {eligible:false,value:0,maximum:0,phase};
 const count=p=>phase==='draw'?(p.hand?.length??0):phase==='play'?p.hp:SLOTS.filter(s=>p[s]).length;
 const value=count(a),maximum=Math.max(0,...g.all_players().filter(live).map(count));
 return {eligible:value===maximum&&(phase!=='discard'||value>0),value,maximum,phase};
}
const ownTurn=(g,a)=>g.actual_turn_active===true&&g.turn_actor===seat(g,a)&&stable(g.turn_event_counter);
function fenliWindow(g,a,phase,e){return owned(g,a,SK.fenli)&&ongoing(g)&&ownTurn(g,a)&&g.turn_phase===`before_${phase}`&&stable(e.phase_event_id)
 &&e.turn_id===g.turn_event_counter&&!e.closed&&!e.skipped&&!a[`skip_${phase}_stage`]&&(e.upcoming_phases??[]).includes(phase);}
export function sgs_ai_fenli_should_skip(g,a,phase){
 if(!sgs_fenli_condition(g,a,phase).eligible||typeof g.side_of!=='function')return false;
 const enemies=g.all_players().filter(p=>p!==a&&live(p)&&g.side_of(p)!==g.side_of(a));if(!enemies.length)return false;
 // Public-only benefit/cost policy, not an interpretation of the source rule.
 return phase==='discard'?(a.hand?.length??0)>a.hp:phase==='draw'?(a.hand?.length??0)>=Math.max(3,a.hp):(a.hand?.length??0)===0;
}
export async function sgs_before_phase_fenli(g,a,_target,phase,e={}){
 const id=e.phase_event_id,request={owner_id:pid(g,a),phase,phase_event_id:id,turn_id:e.turn_id};
 if(!read(g,a)?.fenli[key(id)]&&(!fenliWindow(g,a,phase,e)||!sgs_fenli_condition(g,a,phase).eligible))return false;
 const t=ticket(g,a,'fenli',id,request);if(!t)return false;const {r}=t,bound=binding(g,a,SK.fenli),turn=g.turn_event_counter;
 const valid=()=>fenliWindow(g,a,phase,e)&&g.turn_event_counter===turn&&binding(g,a,SK.fenli)===bound&&sgs_fenli_condition(g,a,phase).eligible&&e.phase_event_id===id&&e.turn_id===turn;
 try{
  let accepted=a.is_ai&&sgs_ai_fenli_should_skip(g,a,phase);
  if(!a.is_ai)while(valid()){
   const c=sgs_fenli_condition(g,a,phase),answer=await g.view.ask_line(`奋励：你当前${phase==='draw'?'手牌':phase==='play'?'体力':'装备'}${c.value}，全场最多${c.maximum}，是否跳过${PHASES[phase]}阶段？`,{kind:'choice',player_id:seat(g,a),options:[{id:'skip',label:`跳过${PHASES[phase]}阶段`},{id:'pass',label:'正常进行'}],meta:{skill:'奋励',skill_id:SK.fenli,stage:`fenli_${phase}`,private_to:seat(g,a),optional:true,phase_event_id:id,turn_id:turn,...c}});
   if(!valid()||pass(answer))break;if(['skip','1','y','yes'].includes(String(answer))){accepted=true;break;}
  }
  if(!accepted||!valid()){r.declined=!accepted;r.cancelled=accepted;t.finish();return false;}
  if(typeof g.record_phase_skip!=='function')throw Error('奋励需要真实阶段 skip 台账');
  const condition=sgs_fenli_condition(g,a,phase);
  g.record_phase_skip(a,{phase_event_id:id,phase,turn_id:turn,reason:'奋励',source_skill:SK.fenli});
  a[`skip_${phase}_stage`]=true;r.committed=true;r.condition=condition;t.finish();
  g.view.emit(`${a.name}发动奋励，跳过${PHASES[phase]}阶段。`,{event_type:'skill_resolution',skill_id:SK.fenli,stage:`fenli_${phase}_summary`,phase_event_id:id,turn_id:turn});return true;
 }catch(error){t.fail(error);throw error;}
}
export const sgs_before_draw_fenli=(g,a,t,e={})=>sgs_before_phase_fenli(g,a,t,'draw',e);
export const sgs_before_play_fenli=(g,a,t,e={})=>sgs_before_phase_fenli(g,a,t,'play',e);
export const sgs_before_discard_fenli=(g,a,t,e={})=>sgs_before_phase_fenli(g,a,t,'discard',e);
/** Authoritative ledger entries only; one count per actual occurrence regardless of reasons. */
export function sgs_pingkou_skipped_phases(g,a,turn_id=g.turn_event_counter){
 if(typeof g.phase_skip_records!=='function')throw Error('平寇需要可审计的真实阶段 skip 台账');
 const rows=g.phase_skip_records(a,turn_id);if(!Array.isArray(rows))throw Error('平寇阶段台账必须为数组');
 const unique=new Map();for(const row of rows){if(row.turn_id!==turn_id||row.actor_id!==pid(g,a)||!stable(row.phase_event_id)||row.status!=='skipped')continue;
  if(!unique.has(row.phase_event_id))unique.set(row.phase_event_id,{phase_event_id:row.phase_event_id,phase:row.phase,turn_id:row.turn_id,actor_id:row.actor_id,reasons:[...(row.reasons??[row.reason].filter(Boolean))]});}
 return [...unique.values()];
}
export const sgs_pingkou_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
export function sgs_ai_pingkou_targets(g,a,count){if(typeof g.side_of!=='function')return [];return sgs_pingkou_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>x.hp-y.hp).slice(0,count);}
function endWindow(g,a,e){return owned(g,a,SK.pingkou)&&ongoing(g)&&ownTurn(g,a)&&g.turn_phase==='turn_end'&&e.actor===a
 &&stable(e.event_id)&&e.turn_id===g.turn_event_counter&&e.stage==='turn_end'&&!e.closed&&!e.interrupted&&!e.skipped_turn;}
/** Never register on legacy on_turn_end or on_end_phase. Snapshot then lock all distinct recipients. */
export async function sgs_on_actual_turn_end_pingkou(g,a,_target,e={}){
 const request={owner_id:pid(g,a),turn_id:e.turn_id,event_id:e.event_id};
 if(!read(g,a)?.pingkou[key(e.event_id)]&&!endWindow(g,a,e))return false;
 const t=ticket(g,a,'pingkou',e.event_id,request);if(!t)return false;const {r}=t,bound=binding(g,a,SK.pingkou),turn=g.turn_event_counter;
 try{
  const skips=sgs_pingkou_skipped_phases(g,a,turn),limit=skips.length;r.skipped_phases=skips;r.limit=limit;r.damage=[];r.selected_target_ids=[];
  const valid=()=>endWindow(g,a,e)&&g.turn_event_counter===turn&&binding(g,a,SK.pingkou)===bound&&e.event_id===request.event_id&&e.turn_id===turn&&key(sgs_pingkou_skipped_phases(g,a,turn))===key(skips);
  if(!limit||!sgs_pingkou_targets(g,a).length){t.finish();return false;}
  let selected=[];r.status='selecting';
  if(a.is_ai)selected=sgs_ai_pingkou_targets(g,a,limit);
  else while(valid()){
   if(selected.some(p=>!sgs_pingkou_targets(g,a).includes(p))){r.cancelled=true;t.finish();return false;}
   const remaining=sgs_pingkou_targets(g,a).filter(p=>!selected.includes(p)),os=selected.length<limit?remaining.map(p=>({id:`target:${pid(g,p)}`,label:`${p.name}（${p.hp}体力）`,target:p})):[];
   const answer=await g.view.ask_line(`平寇：本回合实际跳过${limit}个阶段，选择至多${limit}名不同其他角色各受1点伤害（已选${selected.length}）`,{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'done',label:selected.length?'确认所选目标':'不发动'},{id:'cancel',label:'取消全部选择'}],meta:{skill:'平寇',skill_id:SK.pingkou,stage:'pingkou_targets',private_to:seat(g,a),optional:true,event_id:e.event_id,turn_id:turn,max_count:limit,distinct_targets:true,allow_self:false,selected_target_ids:selected.map(p=>pid(g,p)),damage_each:1,skipped_phases:skips}});
   if(!valid()){r.cancelled=true;t.finish();return false;}if(pass(answer)){selected=[];break;}if(answer==='done')break;
   const picked=select(os,answer);if(picked&&sgs_pingkou_targets(g,a).includes(picked.target)&&!selected.includes(picked.target)){selected.push(picked.target);r.selected_target_ids=selected.map(p=>pid(g,p));}
  }
  if(!valid()||selected.length===0||selected.length>limit||new Set(selected).size!==selected.length||selected.some(p=>!sgs_pingkou_targets(g,a).includes(p))){r.declined=selected.length===0;r.cancelled=!valid();r.selected_target_ids=[];t.finish();return false;}
  if(typeof g.action_order!=='function'||typeof g.apply_damage!=='function')throw Error('平寇需要标准行动顺序与伤害流程');
  const ordered=g.action_order().filter(p=>selected.includes(p));if(ordered.length!==selected.length||new Set(ordered).size!==ordered.length)throw Error('平寇需要完整且无重复的目标行动顺序');
  r.selected_target_ids=ordered.map(p=>pid(g,p));r.committed=true;r.status='resolving';
  for(const target of ordered){
   if(!ongoing(g)){r.stopped='match_closed';break;}
   if(!live(target)){r.damage.push({target_id:pid(g,target),status:'skipped_dead',damage:0});continue;}
   const item={target_id:pid(g,target),event_id:`pingkou:${key([pid(g,a),e.event_id,pid(g,target)])}`,status:'started',damage:null};r.damage.push(item);
   item.damage=await g.apply_damage(target,1,{source:a,kind:'skill',method:'skill',nature:'normal',source_skill:SK.pingkou,source_skill_id:SK.pingkou,source_rule_id:ID.zhuhuan,
    source_card:null,card_user:null,physical_cards:[],armor_ignored:false,committed_skill_effect:true,damage_event_id:item.event_id,message:'{name}受到平寇 {damage} 点伤害，剩余血量 {hp}。'});
   item.status='done';
  }
  t.finish();g.view.emit(`${a.name}发动平寇，对${r.selected_target_ids.length}名不同角色各造成1点普通技能伤害。`,{event_type:'skill_resolution',skill_id:SK.pingkou,stage:'pingkou_summary',event_id:e.event_id,turn_id:turn,skipped_count:limit,target_ids:[...r.selected_target_ids],damage_each:1});return true;
 }catch(error){t.fail(error);throw error;}
}
export function sgs_followup_zhuhuan_public_state(a,g=null){const s=a?.[FIELD]?validate(a[FIELD]):null;return {
 current_turn_id:g?.turn_event_counter??null,current_skipped_phases:g&&typeof g.phase_skip_records==='function'&&g.actual_turn_active===true&&g.turn_actor===seat(g,a)?JSON.parse(key(sgs_pingkou_skipped_phases(g,a))):[],
 fenli_events:Object.values(s?.fenli??{}).map(r=>({event_id:r.event_id,phase:r.request.phase,turn_id:r.request.turn_id,status:r.status,committed:r.committed,condition:r.condition?{...r.condition}:null,declined:r.declined===true,cancelled:r.cancelled===true})),
 pingkou_events:Object.values(s?.pingkou??{}).map(r=>({event_id:r.event_id,turn_id:r.request.turn_id,status:r.status,committed:r.committed,limit:r.limit??0,skipped_phases:JSON.parse(key(r.skipped_phases??[])),target_ids:r.committed?[...(r.selected_target_ids??[])]:[],damage:(r.damage??[]).map(d=>({...d})),declined:r.declined===true,cancelled:r.cancelled===true,stopped:r.stopped??null}))};}
export function sgs_followup_zhuhuan_skill_definitions({SkillHooks}){return {hooks:{[ID.zhuhuan]:SkillHooks({before_draw_phase:[sgs_before_draw_fenli],before_play_phase:[sgs_before_play_fenli],before_discard_phase:[sgs_before_discard_fenli],on_actual_turn_end:[sgs_on_actual_turn_end_pingkou]})},active:{}};}
for(const hook of [sgs_before_draw_fenli,sgs_before_play_fenli,sgs_before_discard_fenli])hook.source_skill_id=SK.fenli;
sgs_on_actual_turn_end_pingkou.source_skill_id=SK.pingkou;
