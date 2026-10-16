/** 顾雍: complete selected Mobile base 身份 packet, snapshot 2026-10-15.
 * H0–H8 are explicit shared-host policies, not current Mobile-client certification.
 * 慎行 is unlimited exact-two discard; 秉壹 is same COLOR, never same category. */
import {rule_hero} from './effective-hero.js';
import {snapshot_card_face} from './card-face-projection.js';

export const SGS_YIJIANG_FURTHER_GUYONG_RULE_IDS=Object.freeze({guyong:'sgs.adapted.base.hero.gu-yong'});
export const SGS_YIJIANG_FURTHER_GUYONG_SKILL_IDS=Object.freeze({shenxing:'sgs.shenxing',bingyi:'sgs.bingyi'});
const ID=SGS_YIJIANG_FURTHER_GUYONG_RULE_IDS,SK=SGS_YIJIANG_FURTHER_GUYONG_SKILL_IDS;
const FIELD='sgs_yijiang_further_guyong_state',SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
export const SGS_YIJIANG_FURTHER_GUYONG_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H6','H7','H8']),
  heroes:Object.freeze([Object.freeze({id:ID.guyong,name:'顾雍',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'吴',skill_ids:Object.freeze([SK.shenxing,SK.bingyi]),
    personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.shenxing]:'出牌阶段，你可以弃置两张牌，然后摸一张牌。',
    [SK.bingyi]:'结束阶段，你可以展示所有手牌，若颜色均相同，你选择至多X名角色（X为你的手牌数），然后这些角色各摸一张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-182.html','https://wiki.biligame.com/msgs/顾雍']),
  excluded_variants:Object.freeze(['界顾雍 same-category alternative','once-per-turn 慎行','play-phase 秉壹']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null,key=x=>JSON.stringify(x);
const copy=x=>JSON.parse(JSON.stringify(x)),record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
// Queries must not initialize the effective-skill ledger or allocate card IDs.
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null
    ?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(options,x)=>options.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?options[Number(x)-1]:null);
const meta=(g,a,id,stage,extra={})=>({skill:id===SK.shenxing?'慎行':'秉壹',skill_id:id,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),references=new WeakMap();
function methods(g,...names){for(const n of names)if(typeof g[n]!=='function')throw Error(`顾雍接入缺少 ${n}`);}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!record(s.shenxing)||!record(s.bingyi)
    ||[...Object.values(s.shenxing),...Object.values(s.bingyi)].some(r=>!stable(r.event_id)||!record(r.request)||typeof r.committed!=='boolean'
      ||!['offered','paying','paid','revealed','selecting','drawing','done','failed'].includes(r.status)||!Array.isArray(r.draws)))throw Error('Invalid Gu Yong skill state');
  return s;
}
function readState(g,a){const s=a?.[FIELD];if(!s)return null;validateState(s);if(s.owner_id!==pid(g,a))throw Error('顾雍事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('顾雍需要稳定人物ID');return readState(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,shenxing:{},bingyi:{}});}
export const sgs_clone_yijiang_further_guyong_state=a=>a?.[FIELD]?copy(validateState(a[FIELD])):null;
function nextId(g,a){const s=state(g,a);let id;do{if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('慎行事件计数耗尽');id=`shenxing:${key([pid(g,a),++s.counter])}`;}while(s.shenxing[key(id)]);return id;}
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('顾雍需要稳定事件ID');const s=state(g,a),k=key(id),rk=`${space}:${k}`,old=s[space][k];
  let running=active.get(a);if(!running)active.set(a,running=new Set());let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(key(old.request)!==key(request)||known.has(rk)&&(known.get(rk).length!==refs.length||known.get(rk).some((v,i)=>v!==refs[i])))throw Error('同一顾雍事件不能更换人物、费用或事实');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('顾雍事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_YIJIANG_FURTHER_GUYONG_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][k]={event_id:id,request,status:'offered',committed:false,draws:[]};running.add(r);known.set(rk,refs);
  return {r,finish(){r.status='done';running.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);running.delete(r);}};
}
const unfinished=(g,a,except=null)=>{const s=readState(g,a);return s&&[...Object.values(s.shenxing),...Object.values(s.bingyi)].some(r=>r!==except&&r.status!=='done');};
function idlePlay(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===seat(g,a)
  &&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(a.play_phase_id)&&stable(g.turn_event_counter)
  &&(!Object.hasOwn(g,'active_play_phase_id')||g.active_play_phase_id===a.play_phase_id)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
const discardable=(g,a,m)=>g.can_discard_material?.(a,m,{source:a,source_skill:SK.shenxing})!==false;
/** Owner-private material helper; never call this to format another actor's hand. */
export function sgs_shenxing_materials(g,a){
  if(!live(a))return [];
  return [...(a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),
    ...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])]
    .filter(m=>m.card&&!m.card.virtual&&g.can_pay_materials?.(a,[m])!==false&&discardable(g,a,m));
}
const exact=(options,m)=>m&&options.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card);
function validCosts(g,a,ms){return Array.isArray(ms)&&ms.length===2&&new Set(ms.map(m=>m?.card)).size===2
  &&ms.every(m=>exact(sgs_shenxing_materials(g,a),m));}
export const sgs_shenxing_available=(g,a)=>owned(g,a,SK.shenxing)&&idlePlay(g,a)&&!unfinished(g,a)&&sgs_shenxing_materials(g,a).length>=2;
export function sgs_shenxing_unavailable_reason(g,a){
  if(!owned(g,a,SK.shenxing))return '当前不拥有慎行';if(!idlePlay(g,a))return '只能在自己的真实空闲出牌阶段发动';
  if(unfinished(g,a))return '顾雍技能正在处理或需要恢复原事务';return '须恰好弃置两张可弃置的手牌或装备';
}
const lock=(g,m)=>({...m,epoch:g.card_location_epoch(m.card)});
const stillLocked=(g,a,ms)=>validCosts(g,a,ms)&&ms.every(m=>g.card_location_epoch(m.card)===m.epoch);
async function chooseCosts(g,a,r,valid){
  let chosen=[];
  while(valid()){
    const all=sgs_shenxing_materials(g,a);if(all.length<2)return null;
    if(chosen.some(m=>!exact(all,m)||g.card_location_epoch(m.card)!==m.epoch))chosen=[];
    r.pending_materials=chosen.map(m=>({zone:m.zone,index:m.index,physical_id:g.card_history_material_id(m.card),epoch:m.epoch}));
    if(chosen.length===2)return chosen;
    const options=all.filter(m=>!chosen.some(c=>c.card===m.card)).map(m=>lock(g,m));
    const answer=await g.view.ask_line(`慎行：恰好弃置两张手牌或装备（已选${chosen.length}/2），然后摸一张牌`,{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌'}],
      meta:meta(g,a,SK.shenxing,'shenxing_materials',{event_id:r.event_id,phase_id:r.request.phase_id,exact_count:2,selected:chosen.map(m=>m.id),material_zones:['hand',...SLOTS],unlimited:true})});
    if(!valid()||pass(answer))return null;
    const now=sgs_shenxing_materials(g,a),picked=select(options,answer);
    if(chosen.some(m=>!exact(now,m)||g.card_location_epoch(m.card)!==m.epoch)){chosen=[];continue;}
    if(exact(now,picked)&&g.card_location_epoch(picked.card)===picked.epoch)chosen.push(picked);
  }return null;
}
const materialRequest=(g,m)=>m?{zone:m.zone??null,index:m.index??null,physical_id:m.card?g.card_history_material_id(m.card):null}:null;
/** Direct calls must provide exactly two current physical H/E materials.
 * choose:true owns the private cancellable human selection. No card-use is made. */
export async function sgs_shenxing_execute(g,a,{event_id=null,phase_id=null,materials=null,choose=false}={}){
  const phase=phase_id??a?.play_phase_id;
  // Invalid first-time commands must not allocate state/IDs or partial payment.
  const old=event_id!==null?readState(g,a)?.shenxing[key(event_id)]:null;
  if(!old&&(!sgs_shenxing_available(g,a)||phase!==a.play_phase_id||!choose&&!validCosts(g,a,materials)))return false;
  methods(g,'public_card_loss','card_history_material_id','card_location_epoch','draw_cards');
  if(g.public_card_loss_supports_on_committed!==true)throw Error('慎行需要 validate / on_committed 原子移牌边界');
  const request={owner:pid(g,a),phase_id:phase,choose,materials:materials?.map(m=>materialRequest(g,m))??null},refs=(materials??[]).map(m=>m?.card);
  const id=event_id??nextId(g,a),t=ticket(g,a,'shenxing',id,request,refs);if(!t)return false;
  const r=t.r,turn=g.turn_event_counter;let bound;r.turn_id=turn;r.paid_count=0;
  const valid=()=>owned(g,a,SK.shenxing)&&idlePlay(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase
    &&binding(g,a,SK.shenxing)===bound&&!unfinished(g,a,r);
  try{
    bound=binding(g,a,SK.shenxing);
    const chosen=choose?await chooseCosts(g,a,r,valid):materials.map(m=>lock(g,m));
    if(!valid()||!chosen||!stillLocked(g,a,chosen)){delete r.pending_materials;r.cancelled=true;t.finish();return false;}
    const legal=()=>valid()&&stillLocked(g,a,chosen);r.cost_materials=chosen.map(m=>({zone:m.zone,index:m.index,physical_id:g.card_history_material_id(m.card),epoch:m.epoch}));r.status='paying';
    const paid=await g.public_card_loss(a,chosen,{payment:true,to:'discard',visibility:'public',reason:'慎行·费用',action:'discard',semantic_action:'discard',source:a,source_skill:SK.shenxing,
      move_id:`shenxing:${key([pid(g,a),id])}:cost`,validate:legal,on_committed:(cards,movement)=>{
        if(cards.length!==2||cards.some((c,i)=>c!==chosen[i].card))throw Error('慎行费用必须是完整的两张实体牌');
        r.committed=true;r.status='paid';r.paid_count=2;r.cost_move_id=movement.move_id;r.paid_card_ids=cards.map(c=>g.card_history_material_id(c));
      }});
    if(Boolean(paid?.committed)!==r.committed)throw Error('慎行费用缺少一致的原子提交回执');
    if(!r.committed){delete r.pending_materials;r.cancelled=true;t.finish();return false;}
    // All loss/equipment/poison/落英/纵玄 effects finish before the draw.
    // Removing the skill after payment does not cancel its committed effect.
    if(live(a)&&ongoing(g)){r.status='drawing';await drawOne(g,a,r);}else r.stopped=live(a)?'match_closed':'owner_dead';
    delete r.pending_materials;t.finish();g.view.emit(`${a.name}发动慎行，弃置两张牌${r.draws.length?'并摸一张牌':''}。`,{event_type:'skill_resolution',skill_id:SK.shenxing,stage:'shenxing_summary',event_id:id,paid_count:2,drawn:r.draws[0]?.drawn??0});return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_resolve_shenxing=sgs_shenxing_execute;
async function drawOne(g,a,r){const d={player_id:pid(g,a),status:'started',requested:1,drawn:null};r.draws.push(d);
  const cards=await g.draw_cards(a,1);if(!Array.isArray(cards)||cards.length>1||cards.some(c=>!c||c.virtual))throw Error('顾雍摸一张需要真实0或1张实体回执');d.drawn=cards.length;d.status='done';}
export async function sgs_player_shenxing(g,a){if(!sgs_shenxing_available(g,a)){g.view.emit(`慎行：${sgs_shenxing_unavailable_reason(g,a)}。`);return true;}
  await sgs_shenxing_execute(g,a,{choose:true});return true;}
export function sgs_ai_shenxing_plan(g,a){
  if(!sgs_shenxing_available(g,a))return null;
  const cost=m=>g.material_ai_cost?.(m)??(m.zone==='hand'?2:6),all=sgs_shenxing_materials(g,a).sort((x,y)=>cost(x)-cost(y));
  // Only own cards are inspected. Avoid voluntarily lethal poison payments.
  let best=null;
  for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
    const materials=[all[i],all[j]],value=cost(all[i])+cost(all[j]);
    if(value>4||materials.filter(m=>m.zone==='hand'&&m.card.type==='毒').length>=a.hp)continue;
    if(!best||value<best.cost)best={materials,cost:value};
  }return best;
}
export async function sgs_ai_shenxing(g,a){const p=sgs_ai_shenxing_plan(g,a);return p?sgs_shenxing_execute(g,a,{materials:p.materials}):false;}

function endWindow(g,a,e){return owned(g,a,SK.bingyi)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='end_phase'
  &&g.turn_actor===seat(g,a)&&e.actor===a&&e.turn_id===g.turn_event_counter&&stable(e.turn_id)&&stable(e.phase_event_id)
  &&(!Object.hasOwn(g,'active_end_phase_id')||g.active_end_phase_id===e.phase_event_id)
  &&(!e.stage||e.stage==='start')&&!e.skipped&&!e.blocked&&!e.cancelled&&!e.closed&&!e.completed;}
/** Pure legal target query uses public liveness only, never foreign hand faces. */
export const sgs_bingyi_targets=g=>(g.all_players?.()??[]).filter(live);
export const sgs_bingyi_available=(g,a,e)=>endWindow(g,a,e)&&Boolean(a.hand?.length)&&!readState(g,a)?.bingyi[key(e.phase_event_id)]&&!unfinished(g,a);
export function sgs_bingyi_targets_valid(g,targets,x){return Number.isSafeInteger(x)&&x>=0&&Array.isArray(targets)&&targets.length<=x
  &&new Set(targets).size===targets.length&&new Set(targets.map(p=>pid(g,p))).size===targets.length&&targets.every(p=>stable(pid(g,p))&&sgs_bingyi_targets(g).includes(p));}
export function sgs_bingyi_same_color(faces){return Array.isArray(faces)&&faces.length>0
  &&faces[0].color!==null&&faces[0].color!==undefined&&faces[0].color!==''&&faces.every(c=>c.color===faces[0].color);}
function handFaces(g,a){return a.hand.map((card,index)=>{
  if(!card||card.virtual)throw Error('秉壹只能展示当前真实手牌');
  const f=snapshot_card_face(card),suit=typeof g.effective_suit==='function'?g.effective_suit(card,a,{zone:'hand',action:'reveal'}):f.suit??null;
  const color=typeof g.effective_color==='function'?g.effective_color(card,a,{zone:'hand',action:'reveal'}):f.color;
  return Object.freeze({id:`card:${index+1}`,physical_id:g.card_history_material_id(card),name:f.name,type:f.type,suit,
    color:color??null,rank:f.rank??null,epoch:g.card_location_epoch(card)});
});}
export function sgs_ai_bingyi_targets(g,a,x){
  const ownSide=g.side_of?.(a),targets=sgs_bingyi_targets(g).filter(p=>p===a||ownSide!==undefined&&g.side_of?.(p)===ownSide);
  return targets.sort((p,q)=>(p.hand?.length??0)-(q.hand?.length??0)||p.hp-q.hp).slice(0,x);
}
export function sgs_ai_bingyi_should_reveal(g,a){
  // Color checks stay owner-private; mixed hands gain nothing from disclosure.
  return live(a)&&sgs_bingyi_same_color((a.hand??[]).map(card=>({color:typeof g.effective_color==='function'
    ?g.effective_color(card,a,{zone:'hand',action:'reveal'}):card.color})));
}
async function offerBingyi(g,a,e,valid){
  if(a.is_ai)return sgs_ai_bingyi_should_reveal(g,a);
  while(valid()){
    const options=[{id:'activate',label:'展示全部手牌，检查颜色'},{id:'cancel',label:'不发动'}];
    const answer=await g.view.ask_line('秉壹：是否展示全部手牌？颜色全部相同，可令至多X名角色各摸一张牌（X为展示张数）',{
      kind:'choice',player_id:seat(g,a),options,meta:meta(g,a,SK.bingyi,'bingyi_offer',{phase_event_id:e.phase_event_id,hand_count:a.hand.length,optional:true,whole_hand:true})});
    if(!valid()||pass(answer))return false;
    if(['y','yes'].includes(String(answer))||select(options,answer)?.id==='activate')return true;
  }return false;
}
async function chooseBingyiTargets(g,a,r,valid){
  if(a.is_ai)return sgs_ai_bingyi_targets(g,a,r.x);
  let chosen=[];
  while(valid()){
    const targets=sgs_bingyi_targets(g);chosen=chosen.filter(p=>targets.includes(p));
    r.pending_target_ids=chosen.map(p=>pid(g,p));
    const options=targets.map(p=>({id:`target:${pid(g,p)}`,label:`${chosen.includes(p)?'已选':'未选'} ${p.name}（${p.hp}血，${p.hand.length}张手牌）`,
      disabled:!chosen.includes(p)&&chosen.length>=r.x}));
    options.push({id:'confirm',label:`确认${chosen.length}/${Math.min(r.x,targets.length)}名角色各摸一张`},{id:'cancel',label:'不令任何角色摸牌（展示已完成）'});
    const answer=await g.view.ask_line(`秉壹：选择至多${Math.min(r.x,targets.length)}名不同存活角色，可含自己`,{
      kind:'choice',player_id:seat(g,a),options,meta:meta(g,a,SK.bingyi,'bingyi_targets',{phase_event_id:r.event_id,x:r.x,max_targets:Math.min(r.x,targets.length),
        same_color:true,color:r.color,selected:r.pending_target_ids,allow_empty:true,allow_self:true,allow_enemies:true,draw_each:1,confirm_required:true})});
    if(!valid()||pass(answer))return [];
    const option=select(options,answer);if(!option||option.disabled)continue;
    if(option.id==='confirm'){if(sgs_bingyi_targets_valid(g,chosen,r.x))return chosen;continue;}
    const target=targets.find(p=>option.id===`target:${pid(g,p)}`);if(!target||!live(target))continue;
    chosen=chosen.includes(target)?chosen.filter(p=>p!==target):[...chosen,target];
  }return [];
}
/** The actual end-phase entry is the offer identity. Completed/declined entries
 * are not refreshed by copying, losing/reacquiring skills or duplicate delivery. */
export async function sgs_on_end_phase_bingyi(g,a,_target,e={}){
  const id=e.phase_event_id,request={owner:pid(g,a),phase_event_id:id??null,turn_id:e.turn_id??null,actor:pid(g,e.actor)};
  if(readState(g,a)?.bingyi[key(id)]){ticket(g,a,'bingyi',id,request,[e.actor]);return false;}
  if(!endWindow(g,a,e)||unfinished(g,a))return false;
  const t=ticket(g,a,'bingyi',id,request,[e.actor]),r=t.r;
  // Suppressing an empty-hand UI still consumes this entry's opportunity. A
  // later gain plus duplicate hook delivery must not invent a second window.
  if(!a.hand?.length){r.empty_hand=true;t.finish();return false;}
  let bound;
  const valid=()=>endWindow(g,a,e)&&id===e.phase_event_id&&request.turn_id===e.turn_id&&binding(g,a,SK.bingyi)===bound&&!unfinished(g,a,r);
  try{
    methods(g,'card_history_material_id','card_location_epoch','draw_cards','action_order');bound=binding(g,a,SK.bingyi);
    if(!await offerBingyi(g,a,e,valid)){r.declined=true;t.finish();return false;}
    if(!valid()||!a.hand.length){r.cancelled=true;t.finish();return false;}
    // Synchronous accepted snapshot: never retain a Card object or getter in a
    // public receipt. Future draws and face changes cannot rewrite this reveal.
    const cards=[...a.hand],faces=handFaces(g,a);
    if(new Set(cards).size!==cards.length||new Set(faces.map(f=>f.physical_id)).size!==faces.length
      ||faces.some(f=>!stable(f.physical_id)||!Number.isSafeInteger(f.epoch)||f.epoch<0))throw Error('秉壹实体标识或位置版本无效');
    r.reveal=Object.freeze(faces);r.x=faces.length;r.same_color=sgs_bingyi_same_color(faces);r.color=r.same_color?faces[0].color:null;
    r.committed=true;r.status='revealed';r.recipient_ids=[];
    g.view.emit(`${a.name}发动秉壹，展示全部${r.x}张手牌：${faces.map(f=>`${f.name}（${f.suit??'无花色'}${f.rank??''}）`).join('、')}。${r.same_color?'颜色相同。':'颜色不同，不摸牌。'}`,
      Object.freeze({event_type:'bingyi_reveal',skill_id:SK.bingyi,stage:'bingyi_reveal',phase_event_id:id,owner_id:pid(g,a),public_reveal:true,whole_hand:true,cards:r.reveal,x:r.x,same_color:r.same_color,color:r.color}));
    if(r.same_color){
      r.status='selecting';const targets=await chooseBingyiTargets(g,a,r,()=>live(a)&&ongoing(g));
      if(live(a)&&ongoing(g)&&sgs_bingyi_targets_valid(g,targets,r.x)){
        const order=g.action_order().filter(p=>targets.includes(p));
        if(order.length!==targets.length||new Set(order).size!==order.length)throw Error('秉壹需要完整无重复的目标行动顺序');
        r.recipient_ids=order.map(p=>pid(g,p));r.status='drawing';
        for(const recipient of order){
          if(!ongoing(g)){r.stopped='match_closed';break;}
          if(!live(recipient)){r.draws.push({player_id:pid(g,recipient),status:'skipped_dead',requested:1,drawn:0});continue;}
          await drawOne(g,recipient,r);
        }
      }else r.stopped=live(a)?'match_closed':'owner_dead';
    }
    delete r.pending_target_ids;t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
/** Pure public projection. Only already accepted reveal snapshots expose faces;
 * staged costs, owner-private IDs and targets remain hidden until commitment. */
export function sgs_yijiang_further_guyong_public_state(a){
  if(!a?.[FIELD])return {shenxing_events:[],bingyi_events:[]};const s=validateState(a[FIELD]);
  return {shenxing_events:Object.values(s.shenxing).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,turn_id:r.turn_id??null,status:r.status,
    committed:r.committed,paid_count:r.paid_count??0,cost_move_id:r.cost_move_id??null,draws:copy(r.draws),cancelled:r.cancelled===true,stopped:r.stopped??null})),
    bingyi_events:Object.values(s.bingyi).map(r=>({phase_event_id:r.event_id,turn_id:r.request.turn_id,status:r.status,committed:r.committed,
      declined:r.declined===true,cancelled:r.cancelled===true,empty_hand:r.empty_hand===true,x:r.x??0,same_color:r.same_color??null,color:r.color??null,
      reveal:r.committed?copy(r.reveal??[]):[],recipient_ids:[...(r.recipient_ids??[])],draws:copy(r.draws),stopped:r.stopped??null}))};
}
export function sgs_yijiang_further_guyong_skill_definitions({SkillHooks,ActiveSkillDef}){
  const skill=new ActiveSkillDef({skill_id:SK.shenxing,hotkey:'q',button_label:'慎行',available:sgs_shenxing_available,player:sgs_player_shenxing,ai:sgs_ai_shenxing,
    help_text:'自己的出牌阶段，可不限次恰好弃置两张手牌或装备，然后摸一张牌。付款前可取消；不是使用牌或重铸。'});
  skill.source_skill_id=SK.shenxing;skill.owns_target_selection=true;skill.unavailable_reason=sgs_shenxing_unavailable_reason;
  return {hooks:{[ID.guyong]:SkillHooks({on_end_phase:[sgs_on_end_phase_bingyi]})},active:{[ID.guyong]:[skill]}};
}
sgs_on_end_phase_bingyi.source_skill_id=SK.bingyi;
