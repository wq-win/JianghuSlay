/** 曹真: the complete classic Mobile 司敌 source packet, 2026-10-15.
 * Qian is a real public physical pile under explicit host policy H7, not a draw.
 * Current-client rules and native cross-game combinations remain unverified. */
import {rule_hero} from './effective-hero.js';
import {CardType} from './models.js';
export const SGS_FOLLOWUP_CAOZHEN_RULE_IDS=Object.freeze({caozhen:'sgs.adapted.base.hero.cao-zhen'});
export const SGS_FOLLOWUP_CAOZHEN_SKILL_IDS=Object.freeze({sidi:'sgs.sidi'});
const ID=SGS_FOLLOWUP_CAOZHEN_RULE_IDS,SK=SGS_FOLLOWUP_CAOZHEN_SKILL_IDS;
const FIELD='sgs_followup_caozhen_state',PILE='sgs_followup_qian_pile',DEBITS='sgs_followup_sidi_debits';
export const SGS_FOLLOWUP_CAOZHEN_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
 current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
 host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7']),
 heroes:Object.freeze([Object.freeze({id:ID.caozhen,name:'曹真',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.sidi]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
 literal_skill_text:Object.freeze({[SK.sidi]:'当你使用或其他角色于你的回合内使用【闪】时，你可以将牌堆顶的一张牌置于武将牌上，称为“钤qián”；其他角色的出牌阶段开始时，你可以移去一张“钤”，然后该角色于此阶段内可以使用【杀】的次数-1。'}),
 urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-174.html','https://wiki.biligame.com/msgs/曹真','https://wiki.biligame.com/msgs/司敌']),
 excluded_variants:Object.freeze(['OL same-color prohibition','end-phase virtual Slash','界曹真 target prediction']),pile_visibility:'public-H7',
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),key=JSON.stringify;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK.sidi)
 &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK.sidi):typeof g.has_general_skill==='function'?g.has_general_skill(a,SK.sidi):(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK.sidi));
const binding=(g,a)=>key([g.general_skill_binding_id?.(a,SK.sidi)??pid(g,a),rule_hero(a)?.id]);
const pile=a=>a?.[PILE]??[];
const cardId=(c,g=null)=>c?.physical_id??c?.physicalCardId??g?.card_history_materials?.find(row=>row.card===c)?.id??null;
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const active=new WeakMap();
const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
function debits(a){const rows=a?.[DEBITS]??[];if(!Array.isArray(rows)||rows.some(d=>!stable(d.owner_id)||!stable(d.target_id)||!stable(d.phase_event_id)||!stable(d.turn_id)||d.amount!==-1)||new Set(rows.map(d=>key([d.owner_id,d.phase_event_id]))).size!==rows.length)throw Error('Invalid Sidi phase debits');return rows;}
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!record(s.dodges)||!record(s.phases)||[...Object.values(s.dodges),...Object.values(s.phases)].some(r=>!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'||!['offered','paying','done','failed'].includes(r.status)))throw Error('Invalid Cao Zhen state');return s;}
function read(g,a){const s=a?.[FIELD];if(!s)return null;validate(s);if(s.owner_id!==pid(g,a))throw Error('司敌事务不能继承另一人物');return s;}
function ticket(g,a,space,id,request){
 if(!stable(id)||!stable(pid(g,a)))throw Error('司敌需要稳定人物与事件ID');
 const s=read(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),dodges:{},phases:{}}),old=s[space][key(id)];
 let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());
 if(old){if(key(old.request)!==key(request))throw Error('同一司敌事件不能更换事实');if(old.status!=='done'&&!jobs.has(old))throw Object.assign(Error('司敌事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_FOLLOWUP_CAOZHEN_REPLAY_REQUIRED'});return null;}
 if([...Object.values(s.dodges),...Object.values(s.phases)].some(r=>r.status!=='done'))return null;
 const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};jobs.add(r);
 return {r,finish(){r.status='done';jobs.delete(r);},fail(e){r.status='failed';r.error=String(e?.message??e);jobs.delete(r);}};
}
export const sgs_clone_followup_caozhen_state=a=>a?.[FIELD]?JSON.parse(key(validate(a[FIELD]))):null;
const meta=(g,a,stage,e,extra={})=>({skill:'司敌',skill_id:SK.sidi,stage,private_to:seat(g,a),event_id:e.event_id??e.response_id??e.id,turn_id:g.turn_event_counter,...extra});
const responseId=e=>e.event_id??e.response_id??e.id;
function dodgeWindow(g,a,responder,type,e){return owned(g,a)&&ongoing(g)&&g.actual_turn_active===true&&stable(g.turn_event_counter)&&Boolean(responder)
 &&type===CardType.SHAN&&(e.type===undefined||e.type===type)&&e.success===true&&e.action_kind!=='play'&&e.actual_card_use!==false&&!e.closed&&!e.cancelled
 &&stable(responseId(e))&&(e.turn_id===undefined||e.turn_id===g.turn_event_counter)&&(responder===a||g.turn_actor===seat(g,a));}
/** Broadcast once per committed actual Dodge, including virtual and each double Dodge. */
export async function sgs_on_any_response_sidi(g,a,responder,type,e={}){
 const id=responseId(e),request={owner_id:pid(g,a),responder_id:pid(g,responder),response_id:responseId(e),type,action_kind:e.action_kind??null,turn_id:e.turn_id??g.turn_event_counter};
 if(!read(g,a)?.dodges[key(id)]&&!dodgeWindow(g,a,responder,type,e))return false;
 const t=ticket(g,a,'dodges',id,request);if(!t)return false;const {r}=t,bound=binding(g,a),turn=g.turn_event_counter;
 const valid=()=>dodgeWindow(g,a,responder,type,e)&&g.turn_event_counter===turn&&binding(g,a)===bound&&key({owner_id:pid(g,a),responder_id:pid(g,responder),response_id:responseId(e),type,action_kind:e.action_kind??null,turn_id:e.turn_id??g.turn_event_counter})===key(request);
 try{
  let accepted=a.is_ai;
  while(valid()&&!a.is_ai){const answer=await g.view.ask_line('司敌：将牌堆顶一张牌置为钤（不是摸牌）？',{kind:'choice',player_id:seat(g,a),options:[{id:'store',label:'置一张钤'},{id:'pass',label:'不发动'}],meta:meta(g,a,'sidi_store',e,{optional:true,pile_count:pile(a).length,pile_visibility:'public',not_draw:true})});if(!valid()||pass(answer))break;if(['store','1','y','yes'].includes(String(answer))){accepted=true;break;}}
  if(!accepted||!valid()){r.declined=!accepted;r.cancelled=accepted;t.finish();return false;}
  if(typeof g.capture_sidi_qian!=='function')throw Error('司敌需要原子牌堆顶→钤 capture_sidi_qian');
  r.status='paying';r.accepted=true;r.acquired=0;
  const result=await g.capture_sidi_qian(a,{move_id:`sidi:${key([pid(g,a),id])}:store`,source_skill:SK.sidi,validate:valid,on_committed:(cards,movement)=>{
   if(cards.length!==1||cards[0]?.virtual||!pile(a).includes(cards[0]))throw Error('司敌置钤需要恰好一张已落位实体牌');
   r.committed=true;r.acquired=1;r.card_id=cardId(cards[0],g);r.move_id=movement?.move_id??null;
  }});
  if(Boolean(result?.committed)!==r.committed)throw Error('司敌置钤缺少一致的原子回执');
  t.finish();g.view.emit(`${a.name}${r.acquired?'将牌堆顶一张牌置为钤':'发动司敌，但牌堆无法提供牌'}。`,{event_type:'skill_resolution',skill_id:SK.sidi,stage:'sidi_store_summary',event_id:id,acquired:r.acquired,pile_count:pile(a).length});return true;
 }catch(error){t.fail(error);throw error;}
}
function phaseWindow(g,a,target,e){return owned(g,a)&&live(target)&&target!==a&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'
 &&g.turn_actor===seat(g,target)&&stable(e.phase_event_id)&&e.phase_event_id===target.play_phase_id&&g.active_play_phase_id===e.phase_event_id
 &&e.turn_id===g.turn_event_counter&&!e.closed&&!e.skipped&&e.entered!==false;}
export function sgs_sidi_materials(g,a){return pile(a).map((card,index)=>({id:`qian:${index+1}`,zone:'qian',index,card,epoch:g.card_location_epoch?.(card)??0,label:`钤${index+1}：${card}`})).filter(m=>m.card&&!m.card.virtual);}
const exact=(g,a,m)=>m&&sgs_sidi_materials(g,a).some(o=>o.card===m.card&&o.index===m.index&&o.epoch===m.epoch);
/** No opponent hand inspection. Spending on an ally or unlimited weapon is optional for humans. */
export function sgs_ai_sidi_should_debit(g,a,target){return typeof g.side_of==='function'&&g.side_of(a)!==g.side_of(target)&&target?.weapon?.trait!=='unlimited_sha'&&pile(a).length>0;}
export async function sgs_on_any_play_phase_sidi(g,a,target,e={}){
 const id=e.phase_event_id,request={owner_id:pid(g,a),target_id:pid(g,target),phase_event_id:id,turn_id:e.turn_id};
 if(!read(g,a)?.phases[key(id)]&&(!phaseWindow(g,a,target,e)||!pile(a).length))return false;
 const t=ticket(g,a,'phases',id,request);if(!t)return false;const {r}=t,bound=binding(g,a),turn=g.turn_event_counter;
 const valid=()=>phaseWindow(g,a,target,e)&&g.turn_event_counter===turn&&binding(g,a)===bound&&key({owner_id:pid(g,a),target_id:pid(g,target),phase_event_id:e.phase_event_id,turn_id:e.turn_id})===key(request);
 try{
  let chosen=null;
  if(a.is_ai){if(sgs_ai_sidi_should_debit(g,a,target))chosen=sgs_sidi_materials(g,a)[0];}
  else while(valid()&&!chosen){const os=sgs_sidi_materials(g,a);if(!os.length)break;const answer=await g.view.ask_line(`司敌：移去一张钤，使${target.name}本出牌阶段的杀次数上限-1`,{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],meta:meta(g,a,'sidi_debit',e,{optional:true,phase_event_id:id,target_id:pid(g,target),exact_count:1,material_zones:['qian'],slash_limit_modifier:-1})});if(!valid()||pass(answer))break;chosen=select(os,answer);if(chosen&&!exact(g,a,chosen)){r.cancelled=true;t.finish();return false;}}
  const legal=()=>valid()&&exact(g,a,chosen);
  if(!legal()){r.declined=!chosen;r.cancelled=Boolean(chosen);t.finish();return false;}
  if(typeof g.remove_sidi_qian!=='function')throw Error('司敌需要原子钤→弃牌堆 remove_sidi_qian');
  r.status='paying';r.pending_card_id=cardId(chosen.card,g);
  const result=await g.remove_sidi_qian(a,chosen.card,{move_id:`sidi:${key([pid(g,a),id])}:remove`,source_skill:SK.sidi,action:'pile_removal',semantic_action:'pile_removal',validate:legal,on_committed:(cards,movement)=>{
   if(cards.length!==1||cards[0]!==chosen.card||pile(a).includes(chosen.card))throw Error('司敌费用必须恰好移去所选钤');
   r.committed=true;r.card_id=cardId(cards[0],g);r.move_id=movement?.move_id??null;
   target[DEBITS]??=[];if(target[DEBITS].some(x=>x.owner_id===pid(g,a)&&x.phase_event_id===id))throw Error('同一持有者不能重复扣减同一出牌阶段');
   target[DEBITS].push({owner_id:pid(g,a),target_id:pid(g,target),phase_event_id:id,turn_id:turn,amount:-1,event_id:id});
  }});
  if(Boolean(result?.committed)!==r.committed)throw Error('司敌移钤缺少一致的原子回执');
  delete r.pending_card_id;t.finish();if(!r.committed)return false;
  g.view.emit(`${a.name}移去一张钤，${target.name}本出牌阶段的杀次数上限-1。`,{event_type:'skill_resolution',skill_id:SK.sidi,stage:'sidi_debit_summary',event_id:id,target_id:pid(g,target),phase_event_id:id,slash_limit_modifier:-1});return true;
 }catch(error){t.fail(error);throw error;}
}
/** Finite limits compose before legality. Unlimited-attack exceptions stay in the host. */
export function sgs_sidi_slash_modifier(g,a){if(g.turn_phase!=='play'||g.actual_turn_active!==true||g.turn_actor!==seat(g,a)||g.active_play_phase_id!==a?.play_phase_id)return 0;
 return debits(a).filter(d=>d.target_id===pid(g,a)&&d.phase_event_id===g.active_play_phase_id&&d.turn_id===g.turn_event_counter).reduce((n,d)=>n+d.amount,0);}
export function sgs_clear_sidi_phase(g,a,phase_event_id){if(a?.[DEBITS])a[DEBITS]=a[DEBITS].filter(d=>d.phase_event_id!==phase_event_id);}
export function sgs_followup_caozhen_public_state(a,g=null){const s=a?.[FIELD]?validate(a[FIELD]):null;
 return {qian_count:pile(a).length,qian_cards:pile(a).map(c=>({physical_id:cardId(c,g),name:c.name,type:c.type,suit:c.suit??null,rank:c.rank??null})),
  sidi_slash_modifier:g?sgs_sidi_slash_modifier(g,a):0,sidi_debits:debits(a).map(d=>({...d})),
  sidi_dodges:Object.values(s?.dodges??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,acquired:r.acquired??0,card_id:r.committed?r.card_id:null,declined:r.declined===true,cancelled:r.cancelled===true})),
  sidi_phases:Object.values(s?.phases??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,target_id:r.request.target_id,phase_event_id:r.request.phase_event_id,declined:r.declined===true,cancelled:r.cancelled===true}))};}
export function sgs_followup_caozhen_skill_definitions({SkillHooks}){return {hooks:{[ID.caozhen]:SkillHooks({on_any_response_card:[sgs_on_any_response_sidi],on_any_play_phase_begin:[sgs_on_any_play_phase_sidi]})},active:{}};}
sgs_on_any_response_sidi.source_skill_id=SK.sidi;sgs_on_any_play_phase_sidi.source_skill_id=SK.sidi;
