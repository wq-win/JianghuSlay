/** 曹植: complete Mobile base identity packet, selected detailed 酒诗 rule.
 * P9–P13 deliberately preserve exact movement and both damage-time states.
 * Current Mobile-client behavior and native retrial order are not certified. */
import {Card,CardSuit,CardType,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_MORE_CAOZHI_RULE_IDS=Object.freeze({caozhi:'sgs.adapted.base.hero.cao-zhi'});
export const SGS_YIJIANG_MORE_CAOZHI_SKILL_IDS=Object.freeze({luoying:'sgs.luoying',jiushi:'sgs.jiushi'});
const ID=SGS_YIJIANG_MORE_CAOZHI_RULE_IDS,SK=SGS_YIJIANG_MORE_CAOZHI_SKILL_IDS,FIELD='sgs_yijiang_more_caozhi_state';
export const SGS_YIJIANG_MORE_CAOZHI_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-detailed-double-time-jiushi-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P6','P9','P10','P11','P12','P13']),native_unknown_ids:Object.freeze(['U1','U2']),
  heroes:Object.freeze([Object.freeze({id:ID.caozhi,name:'曹植',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'P0 host full-HP initialization',gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.luoying,SK.jiushi]),
    personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.luoying]:'当其他角色的一张梅花牌因弃置或判定而置入弃牌堆时，你可以获得之。',
    [SK.jiushi]:'当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上，你可以翻面。'}),
  selected_jiushi_rule:'Receiver must be face_down immediately before actual damage HP deduction AND after damage/rescue. Face-up lethal damage followed by dying Wine does not qualify.',
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-101.html','https://wiki.biligame.com/msgs/曹植','https://wiki.biligame.com/msgs/酒诗']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const extant=a=>Boolean(a&&!a.dead),live=a=>extant(a)&&a.hp>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const face=a=>a?.face_orientation??'face_up';
const owned=(g,a,id)=>extant(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const key=id=>JSON.stringify(id),copy=x=>JSON.parse(JSON.stringify(x));
const active=new WeakMap(),references=new WeakMap();
const meta=(g,a,id,stage,extra={})=>({skill:id===SK.luoying?'落英':'酒诗',skill_id:id,stage,private_to:seat(g,a),...extra});
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`曹植接入缺少 ${name}`);}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0
    ||['luoying','jiushi_wine','jiushi_return'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Cao Zhi skill state');return s;
}
function readState(g,a){const s=a?.[FIELD];if(!s)return null;validateState(s);if(s.owner_id!==pid(g,a))throw Error('曹植事务不能继承另一人物的状态');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('曹植技能需要稳定人物ID');return readState(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,luoying:{},jiushi_wine:{},jiushi_return:{}});}
export const sgs_clone_yijiang_more_caozhi_state=a=>a?.[FIELD]?copy(validateState(a[FIELD])):null;
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('曹植技能需要稳定事件ID');const s=state(g,a),rk=`${space}:${key(id)}`,old=s[space][key(id)];
  let running=active.get(a);if(!running)active.set(a,running=new Set());let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一曹植事件不能更换人物、实体或事实');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('曹植事务中断；须恢复原协程或按输入日志重放，不能重复获得、翻面或用酒'),{code:'SGS_YIJIANG_MORE_CAOZHI_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};running.add(r);known.set(rk,refs);
  return {receipt:r,finish(){r.status='done';running.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);running.delete(r);}};
}
function previous(g,a,space,id,request,refs=[]){if(!readState(g,a)?.[space][key(id)])return false;ticket(g,a,space,id,request,refs);return true;}
function nextId(g,a){const s=state(g,a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('曹植事件计数器已耗尽');return `jiushi:${key([pid(g,a),++s.counter])}`;}

function luoyingOrigin(g,e){
  if(!e.committed||e.to!=='discard'||!stable(e.move_id)||e.closed||e.cancelled||e.death_cleanup||e.pile_cleanup)return null;
  if(e.semantic_action==='discard')return e.owner??null;
  if(e.semantic_action==='judgment'&&stable(e.judgment_event_id))return e.judged_actor??null;
  return null;
}
function movementFacts(g,a,e){
  return {owner_id:pid(g,a),move_id:e.move_id,semantic_action:e.semantic_action,source_id:pid(g,luoyingOrigin(g,e)),
    judgment_event_id:e.judgment_event_id??null,materials:(e.materials??[]).map(m=>({physical_id:g.card_history_material_id(m.card),
      zone:m.zone??null,suit:m.effective_face?.suit??null,epoch:(e.locations??[]).find(l=>l.physical_id===g.card_history_material_id(m.card))?.epoch??null}))};
}
function physicalEntries(g,e){
  if(!Array.isArray(e.materials)||e.materials.some(m=>!m?.card||m.card.virtual)||new Set(e.materials.map(m=>m.card)).size!==e.materials.length)throw Error('落英需要唯一真实实体牌，不能获得虚拟判定结果');
  methods(g,'card_history_material_id','card_location_epoch');
  const rows=e.materials.map(m=>{const id=g.card_history_material_id(m.card),loc=e.locations?.find(l=>l.physical_id===id);
    if(!stable(id)||!loc||!Number.isSafeInteger(loc.epoch)||loc.epoch<0||!m.effective_face||!Object.hasOwn(m.effective_face,'suit'))throw Error('落英缺少原始花色或弃牌入口位置版本');
    return {card:m.card,id,suit:m.effective_face.suit,epoch:loc.epoch};});
  if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('落英实体标识重复');return rows;
}
const inDiscard=(g,r)=>g.deck?.discard_pile?.filter(c=>c===r.card).length===1&&g.card_location_epoch(r.card)===r.epoch;
/** New GLOBAL hook: call after original loss callbacks (including 纵玄), or
 * actual physical judgment cleanup, in current action order. Never call from
 * on_judgment_effective or infer semantic cause from the destination. */
export async function sgs_after_any_cards_enter_discard_luoying(g,a,e={}){
  const origin=luoyingOrigin(g,e);if(!origin||origin===a||!live(a)||!owned(g,a,SK.luoying)||!ongoing(g))return false;
  const rows=physicalEntries(g,e),request=movementFacts(g,a,e),refs=[origin,...rows.map(r=>r.card)];
  if(previous(g,a,'luoying',e.move_id,request,refs))return false;
  if(!rows.some(r=>r.suit===CardSuit.CLUB&&inDiscard(g,r)))return false;
  methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('落英需要原子 validate / on_committed 移牌边界');
  const bound=binding(g,a,SK.luoying),t=ticket(g,a,'luoying',e.move_id,request,refs),r=t.receipt;r.cards=[];
  const valid=()=>live(a)&&owned(g,a,SK.luoying)&&ongoing(g)&&luoyingOrigin(g,e)===origin&&binding(g,a,SK.luoying)===bound
    &&JSON.stringify(movementFacts(g,a,e))===JSON.stringify(request);
  try{
    for(const entry of rows.filter(c=>c.suit===CardSuit.CLUB)){
      if(!valid())break;if(!inDiscard(g,entry))continue;
      const choice={physical_id:entry.id,epoch:entry.epoch,status:'offered',committed:false};r.cards.push(choice);
      const yes=a.is_ai||await g.view.ask_confirm(`落英：是否获得${origin.name}因${e.semantic_action==='judgment'?'判定':'弃置'}进入弃牌堆的${entry.card}？`,{
        player_id:seat(g,a),meta:meta(g,a,SK.luoying,'luoying_offer',{move_id:e.move_id,physical_id:entry.id,source_seat:seat(g,origin),
          semantic_action:e.semantic_action,judgment_event_id:e.judgment_event_id??null,card:{name:entry.card.name,suit:entry.suit,rank:entry.card.rank??null},optional:true})});
      if(!valid()){choice.status='cancelled';break;}
      if(!inDiscard(g,entry)){choice.status='moved';continue;}
      if(!yes){choice.status='declined';continue;}
      choice.status='obtaining';r.status='obtaining';
      const result=await g.public_card_loss(null,[{zone:'discard',index:g.deck.discard_pile.indexOf(entry.card),card:entry.card}],{
        to:'hand',recipient:a,source:origin,source_skill:SK.luoying,reason:'落英获得',visibility:'public',action:'obtain',semantic_action:'obtain',
        move_id:`luoying:${key([pid(g,a),e.move_id,entry.id,entry.epoch])}`,validate:()=>valid()&&inDiscard(g,entry),
        on_committed:()=>{choice.committed=true;choice.status='obtained';r.committed=true;}});
      if(result?.committed!==choice.committed)throw Error('落英移牌回执缺少原子提交');
      if(!choice.committed)choice.status='cancelled';
    }
    t.finish();return r.committed;
  }catch(error){t.fail(error);throw error;}
}

/** Synchronous exact receiver boundary, after final source/receiver/transfer
 * reactions and immediately before positive damage HP deduction. Capture every
 * receiver; later effective skill ownership is tested at the return offer. */
export function sgs_capture_jiushi_damage_snapshot(g,a,e={}){
  if(!extant(a)||e.target!==a||!stable(e.damage_event_id)||!Number.isSafeInteger(e.damage)||e.damage<=0||e.prevented||e.cancelled
    ||e.kind==='hp_loss'||e.death_cause?.kind==='hp_loss')return null;
  const snapshot={damage_event_id:e.damage_event_id,target_id:pid(g,a),damage:e.damage,face_down:face(a)==='face_down'};
  if(e.jiushi_receiver_snapshot){
    if(JSON.stringify(e.jiushi_receiver_snapshot)!==JSON.stringify(snapshot))throw Error('酒诗伤害前状态不能重新捕获或更换接收者');
    return e.jiushi_receiver_snapshot;
  }
  e.jiushi_receiver_snapshot=Object.freeze(snapshot);return e.jiushi_receiver_snapshot;
}
function damageFacts(g,a,amount,source,e){return {owner_id:pid(g,a),source_id:pid(g,source),target_id:pid(g,e.target),damage_event_id:e.damage_event_id,
  damage:e.damage,amount,snapshot:e.jiushi_receiver_snapshot?{...e.jiushi_receiver_snapshot}:null};}
function returnWindow(g,a,amount,source,e){
  const s=e.jiushi_receiver_snapshot;
  return live(a)&&owned(g,a,SK.jiushi)&&ongoing(g)&&face(a)==='face_down'&&stable(e.damage_event_id)&&Number.isSafeInteger(e.damage)&&e.damage>0&&amount===e.damage
    &&e.target===a&&source===e.source&&e.dying_resolved===true&&e.damage_window==='receiver_after_damage'&&!e.closed&&!e.cancelled&&!e.prevented
    &&e.kind!=='hp_loss'&&e.death_cause?.kind!=='hp_loss'&&s?.face_down===true&&s.target_id===pid(g,a)&&s.damage===e.damage&&s.damage_event_id===e.damage_event_id;
}
export async function sgs_after_damage_resolved_jiushi(g,a,amount,source,e={}){
  const request=damageFacts(g,a,amount,source,e),refs=[source??null,e.target];
  if(previous(g,a,'jiushi_return',e.damage_event_id,request,refs))return false;
  if(!returnWindow(g,a,amount,source,e))return false;
  methods(g,'flip_general_atomic');const bound=binding(g,a,SK.jiushi),t=ticket(g,a,'jiushi_return',e.damage_event_id,request,refs),r=t.receipt;
  const valid=()=>returnWindow(g,a,amount,source,e)&&binding(g,a,SK.jiushi)===bound&&JSON.stringify(damageFacts(g,a,amount,source,e))===JSON.stringify(request);
  try{
    const yes=a.is_ai||await g.view.ask_confirm('酒诗：此次受到伤害前后均为背面，是否翻至正面？',{player_id:seat(g,a),
      meta:meta(g,a,SK.jiushi,'jiushi_return',{damage_event_id:e.damage_event_id,damage:amount,face_before_damage:'face_down',face_orientation:face(a),flip_to:'face_up',optional:true})});
    if(!valid()||!yes){r.declined=!yes;r.cancelled=!valid();t.finish();return false;}
    r.status='flipping';r.face_before=face(a);const flipped=g.flip_general_atomic(a,{source_skill:SK.jiushi,event_id:`jiushi-return:${key([pid(g,a),e.damage_event_id])}`});
    if(flipped&&typeof flipped.then==='function')throw Error('酒诗翻面必须同步提交');
    if(flipped!==true||face(a)!=='face_up')throw Error('酒诗回正翻面未实际提交');r.committed=true;r.face_after=face(a);t.finish();await g.flush_general_state_events?.();return true;
  }catch(error){t.fail(error);throw error;}
}

export const sgs_jiushi_virtual_wine=()=>new Card('酒',CardType.WINE,{virtual:true,materials:[],suit:null,color:null,rank:null,source_skill:SK.jiushi,source_skill_id:SK.jiushi});
const dyingId=e=>e?.dying_event_id??e?.event_id;
function wineWindow(g,a,{mode='play',dying_event=null}={}){
  if(!owned(g,a,SK.jiushi)||face(a)!=='face_up'||g.winner||typeof g.can_use_virtual_wine!=='function')return false;
  if(mode==='rescue'){
    if(a.hp>0||!stable(dyingId(dying_event))||dying_event?.dying_seat!==seat(g,a)||!g.dying_stack?.includes(seat(g,a))
      ||dying_event.closed||dying_event.cancelled||dying_event.waive_rescue||dying_event.dying&&dying_event.dying!==a)return false;
  }else if(mode==='play'){
    if(!live(a)||!ongoing(g)||g.actual_turn_active!==true||g.turn_phase!=='play'||g.turn_actor!==seat(g,a)||a.skip_play_stage
      ||!stable(g.turn_event_counter)||!stable(a.play_phase_id)||g.active_play_phase_id!==a.play_phase_id
      ||['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length))return false;
  }else return false;
  return g.can_use_virtual_wine(a,{mode,dying_event,source_skill:SK.jiushi})===true;
}
export const sgs_jiushi_available=(g,a)=>wineWindow(g,a)&&!Object.values(readState(g,a)?.jiushi_wine??{}).some(r=>r.status!=='done');
export const sgs_jiushi_can_rescue=(g,a,e)=>wineWindow(g,a,{mode:'rescue',dying_event:e})&&!Object.values(readState(g,a)?.jiushi_wine??{}).some(r=>r.status!=='done');
export function sgs_jiushi_unavailable_reason(g,a){
  if(!owned(g,a,SK.jiushi))return '当前不拥有酒诗';if(face(a)!=='face_up')return '酒诗用酒需要武将牌正面向上';
  if(Object.values(readState(g,a)?.jiushi_wine??{}).some(r=>r.status!=='done'))return '酒诗事务正在处理或需要按日志恢复';
  return sgs_jiushi_available(g,a)?'':'只能在合法空闲出牌阶段使用酒，且本回合普通酒次数未用尽';
}
/** Commit API is synchronous: all validations BEFORE before_atomic_commit,
 * then one orientation change, ordinary quota (offense only), and one real
 * material-free Wine use. It must return {committed:true,scope}. */
export async function sgs_jiushi_wine_execute(g,a,{mode='play',dying_event=null,event_id=null,accepted=false,source=null}={}){
  const id=event_id??(wineWindow(g,a,{mode,dying_event})?nextId(g,a):null);if(!stable(id))return false;
  const request={owner_id:pid(g,a),mode,event_id:id,dying_event_id:dyingId(dying_event)??null,source_id:pid(g,source),
    turn_id:g.turn_event_counter??null,phase_id:mode==='play'?a.play_phase_id:null};
  if(previous(g,a,'jiushi_wine',id,request,[a,source]))return false;
  if(!wineWindow(g,a,{mode,dying_event})||Object.values(readState(g,a)?.jiushi_wine??{}).some(r=>r.status!=='done'))return false;
  methods(g,'commit_virtual_wine_use','flip_general_atomic','end_card_use');if(mode==='rescue')methods(g,'recover_hp');
  const bound=binding(g,a,SK.jiushi),t=ticket(g,a,'jiushi_wine',id,request,[a,source]),r=t.receipt;
  const valid=()=>wineWindow(g,a,{mode,dying_event})&&binding(g,a,SK.jiushi)===bound&&g.turn_event_counter===request.turn_id
    &&(mode!=='play'||a.play_phase_id===request.phase_id)&&(dyingId(dying_event)??null)===request.dying_event_id;
  let scope=null;
  try{
    const yes=accepted===true||a.is_ai||await g.view.ask_confirm(`酒诗：翻至背面，视为使用一张酒${mode==='rescue'?'，自救回复1点体力':'，本回合下一张杀伤害+1'}？`,{
      player_id:seat(g,a),meta:meta(g,a,SK.jiushi,mode==='rescue'?'jiushi_rescue':'jiushi_wine',{event_id:id,dying_event_id:request.dying_event_id,
        zero_material:true,mode,face_orientation:face(a),flip_to:'face_down',recovery:mode==='rescue'?1:0,optional:true})});
    if(!valid()||!yes){r.declined=!yes;r.cancelled=!valid();t.finish();return false;}
    r.status='committing';r.face_before=face(a);
    const result=g.commit_virtual_wine_use(a,sgs_jiushi_virtual_wine(),{mode,event_id:id,dying_event,source_skill:SK.jiushi,validate:valid,
      before_atomic_commit:()=>{
        if(!valid())return false;
        const flipped=g.flip_general_atomic(a,{source_skill:SK.jiushi,event_id:`jiushi-wine:${key([pid(g,a),id])}`});
        if(flipped!==true||face(a)!=='face_down')throw Error('酒诗用酒翻面未实际提交');return true;
      }});
    if(result&&typeof result.then==='function')throw Error('酒诗用酒必须同步原子提交');
    if(!result?.committed){if(face(a)!==r.face_before)throw Error('酒诗失败用酒不能免费翻面');r.cancelled=true;t.finish();return false;}
    scope=result.scope;if(!stable(scope?.use_id)||face(a)!=='face_down')throw Error('酒诗缺少真实用酒回执或翻面费用');
    r.committed=true;r.history_use_id=scope.use_id;r.face_after=face(a);r.status='resolving';
    await g.flush_general_state_events?.();
    if(mode==='play'){a.wine_bonus=1;r.wine_bonus=1;g.view.emit(`${a.name}发动酒诗用酒，本回合下一张杀伤害+1。`);}
    else if(extant(a)&&a.hp<=0){r.recovered=await g.recover_hp(a,1,{source:a,source_skill:SK.jiushi,dying_event_id:request.dying_event_id,
      recovery_event_id:`jiushi:${key([pid(g,a),id])}:recover`,card_use_id:scope.use_id});r.hp_after=a.hp;
      g.view.emit(`${a.name}发动酒诗，用酒自救回复${r.recovered}点体力。`);}
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}finally{if(scope)g.end_card_use(scope);}
}
/** Self-only menu item; choosing it is the optional Wine decision. The live
 * dying event stays open until the host's rescue pass exits. */
export function sgs_jiushi_rescue_options(g,a,dying,source,e,opportunity_id){
  if(a!==dying||!stable(opportunity_id)||!sgs_jiushi_can_rescue(g,a,e))return [];
  const bound=binding(g,a,SK.jiushi),event_id=`jiushi-rescue:${key([dyingId(e),opportunity_id])}`;
  return [{id:'skill:sgs.jiushi',skill_id:SK.jiushi,skill:'酒诗',label:'翻至背面，视为使用酒自救回复1点（无需实体牌）',skill_action:true,
    public_details:{stage:'jiushi_rescue',zero_material:true,face_orientation:face(a),flip_to:'face_down',recovery:1,dying_event_id:dyingId(e)},
    execute:()=>binding(g,a,SK.jiushi)===bound?sgs_jiushi_wine_execute(g,a,{mode:'rescue',dying_event:e,event_id,accepted:true,source}):false}];
}
export async function sgs_player_jiushi(g,a){if(!sgs_jiushi_available(g,a)){g.view.emit(`酒诗：${sgs_jiushi_unavailable_reason(g,a)}。`);return true;}await sgs_jiushi_wine_execute(g,a);return true;}
export function sgs_ai_jiushi_decision(g,a){return sgs_jiushi_available(g,a)&&!a.wine_bonus&&a.hand.some(is_sha_card)
  &&(g.all_players?.()??[]).some(p=>p!==a&&live(p)&&g.side_of?.(p)!==g.side_of?.(a)&&g.can_sha_target?.(a,p)===true);}
export const sgs_ai_jiushi=(g,a)=>sgs_ai_jiushi_decision(g,a)?sgs_jiushi_wine_execute(g,a,{accepted:true}):false;
/** Pure public projection: no private cards, uncommitted request payloads or
 * lazy ledger initialization. Every obtained card had already been public. */
export function sgs_yijiang_more_caozhi_public_state(g,a){
  const s=readState(g,a);return {face_orientation:face(a),jiushi_available:sgs_jiushi_available(g,a),
    luoying_events:Object.values(s?.luoying??{}).map(r=>({move_id:r.event_id,status:r.status,committed:r.committed,cards:(r.cards??[]).map(c=>({...c}))})),
    jiushi_wine_events:Object.values(s?.jiushi_wine??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,mode:r.request.mode,
      declined:r.declined===true,cancelled:r.cancelled===true,history_use_id:r.history_use_id??null,face_before:r.face_before??null,face_after:r.face_after??null,recovered:r.recovered??0})),
    jiushi_return_events:Object.values(s?.jiushi_return??{}).map(r=>({damage_event_id:r.event_id,status:r.status,committed:r.committed,
      face_down_before_damage:r.request.snapshot?.face_down===true,declined:r.declined===true,cancelled:r.cancelled===true,face_after:r.face_after??null}))};
}
export function sgs_yijiang_more_caozhi_skill_definitions({SkillHooks,ActiveSkillDef}){
  const jiushi=new ActiveSkillDef({skill_id:SK.jiushi,hotkey:'q',button_label:'酒诗',player:sgs_player_jiushi,ai:sgs_ai_jiushi,available:sgs_jiushi_available,
    help_text:'正面向上时翻至背面，视为使用酒；普通酒每回合限一次。濒死时可用酒自救。受到伤害前后均背面向上时，可于伤害后翻回正面。'});
  jiushi.source_skill_id=SK.jiushi;jiushi.owns_target_selection=true;jiushi.targets=(g,a)=>sgs_jiushi_available(g,a)?[a]:[];jiushi.unavailable_reason=sgs_jiushi_unavailable_reason;
  return {hooks:{[ID.caozhi]:SkillHooks({after_any_cards_enter_discard:[sgs_after_any_cards_enter_discard_luoying],capture_before_receiver_hp_loss:[sgs_capture_jiushi_damage_snapshot],after_damage_resolved:[sgs_after_damage_resolved_jiushi]})},active:{[ID.caozhi]:[jiushi]}};
}
sgs_after_any_cards_enter_discard_luoying.source_skill_id=SK.luoying;
sgs_after_damage_resolved_jiushi.source_skill_id=SK.jiushi;
sgs_capture_jiushi_damage_snapshot.source_skill_id=SK.jiushi;
