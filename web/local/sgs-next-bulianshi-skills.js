/** 步练师: complete selected mobile base identity inventory, 2026-10-15.
 * Anxu is the official 2015 adjusted GIVE version, never the old steal/reveal
 * version. N0/N5–N7 are explicit cross-game host policies, not client certification.
 * The host owns atomic physical movement, recovery, and committed final death.
 */
import {rule_hero} from './effective-hero.js';

export const SGS_NEXT_BULIANSHI_RULE_IDS=Object.freeze({bulianshi:'sgs.adapted.base.hero.bu-lian-shi'});
export const SGS_NEXT_BULIANSHI_SKILL_IDS=Object.freeze({anxu:'sgs.anxu',zhuiyi:'sgs.zhuiyi'});
export const SGS_NEXT_BULIANSHI_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,
  initial_hp_directly_verified:false,host_policy_ids:Object.freeze(['N0','N5','N6','N7']),
  heroes:Object.freeze([Object.freeze({id:SGS_NEXT_BULIANSHI_RULE_IDS.bulianshi,name:'步练师',max_hp:3,starting_hp:3,
    starting_hp_direct_source_value:null,starting_hp_basis:'N0 host full-HP initialization',gender:'female',source_faction:'吴',
    skill_ids:Object.freeze(['sgs.anxu','sgs.zhuiyi']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    'sgs.anxu':'出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌多的角色将一张手牌交给手牌少的角色，然后若这两名角色手牌数相等，你摸一张牌或回复1点体力',
    'sgs.zhuiyi':'当你死亡时，你可以令一名其他角色（杀死你的角色除外）摸三张牌。若如此做，该角色回复1点体力。',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-117.html','https://www.sanguosha.cn/pc/news-detail-98.html',
    'https://wiki.biligame.com/msgs/步练师','https://wiki.biligame.com/msgs/安恤','https://wiki.biligame.com/msgs/追忆']),
  bwiki_revision:33728,
});
const ID=SGS_NEXT_BULIANSHI_RULE_IDS,SK=SGS_NEXT_BULIANSHI_SKILL_IDS,FIELD='sgs_next_bulianshi_state';
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,id)===true;
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const phaseId=(_g,a)=>a?.play_phase_id;
const inPlay=(g,a)=>live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'
  &&(g.is_own_actual_turn?.(a)??g.turn_actor===seat(g,a))&&g.is_own_play_phase(a)&&!a.skip_play_stage;
const idlePlay=(g,a)=>inPlay(g,a)&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp??a.max_hp;
const select=(options,v)=>options.find(o=>o.id===String(v))??(/^\d+$/.test(String(v))?options[Number(v)-1]:null);
const pass=v=>['cancel','pass','0','n','no','decline'].includes(String(v));
const meta=(g,a,skill,stage,extra={})=>({skill:skill===SK.anxu?'安恤':'追忆',skill_id:skill,stage,private_to:seat(g,a),...extra});
const active=new WeakMap(),references=new WeakMap();
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('步练师技能需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,counter:0,anxu:{},anxu_phases:{},zhuiyi:{}};
  validateState(s);if(s.owner_id!==owner)throw Error('步练师事务不能继承另一人物的状态');return s;
}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0
    ||['anxu','anxu_phases','zhuiyi'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Bu Lian Shi skill state');return s;
}
export const sgs_clone_next_bulianshi_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('步练师技能需要稳定事件ID');
  const s=state(g,a),key=JSON.stringify(id),rk=`${space}:${key}`,old=s[space][key];
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一步练师事件不能更换目标、事实或实体');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('步练师事务中断；须恢复原协程或按输入日志重放'),{code:'SGS_NEXT_BULIANSHI_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[space][key]={event_id:id,request,status:'offered',committed:false};running.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';running.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
function nextId(g,a,skill){const s=state(g,a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('步练师事务计数器已耗尽');return `${skill}:${JSON.stringify([pid(g,a),++s.counter])}`;}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`步练师接入缺少 ${name}`);}
function movement(g){methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('安恤需要 validate / on_committed 原子移牌边界');}
function phaseReady(g,a,phase,except=null){
  if(!a[FIELD])return true;const s=state(g,a);
  return !s.anxu_phases[JSON.stringify(phase)]&&!Object.values(s.anxu).some(r=>r!==except&&r.request.phase_id===phase&&r.status!=='done');
}
/** Public selection data. Never inspect any other actor's card faces. */
export function sgs_anxu_pairs(g,a){
  if(!owned(g,a,SK.anxu))return [];
  const others=g.all_players().filter(p=>p!==a&&live(p)),pairs=[];
  for(let i=0;i<others.length;i++)for(let j=i+1;j<others.length;j++){
    const x=others[i],y=others[j];if(x.hand.length===y.hand.length)continue;
    const giver=x.hand.length>y.hand.length?x:y,recipient=giver===x?y:x;
    pairs.push({id:`pair:${JSON.stringify([pid(g,x),pid(g,y)])}`,targets:[x,y],giver,recipient,counts:[x.hand.length,y.hand.length]});
  }return pairs;
}
export const sgs_anxu_targets=(g,a)=>[...new Set(sgs_anxu_pairs(g,a).flatMap(p=>p.targets))];
export const sgs_anxu_available=(g,a)=>owned(g,a,SK.anxu)&&idlePlay(g,a)&&stable(phaseId(g,a))&&phaseReady(g,a,phaseId(g,a))&&sgs_anxu_pairs(g,a).length>0;
export function sgs_anxu_unavailable_reason(g,a){
  if(!owned(g,a,SK.anxu))return '当前不拥有安恤';
  if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!stable(phaseId(g,a)))return '缺少真实出牌阶段标识';
  if(!phaseReady(g,a,phaseId(g,a)))return '本出牌阶段安恤已发动或正在处理';
  return sgs_anxu_pairs(g,a).length?'':'需要两名其他存活角色，且两者手牌数不同';
}
/** Only the giver sees these faces. Equipment/J/personal piles never enter. */
export function sgs_anxu_give_materials(g,giver,recipient){
  if(!live(giver)||!live(recipient)||giver===recipient)return [];
  return giver.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`}))
    .filter(m=>m.card&&!m.card.virtual&&g.can_move_material?.(giver,m,{to:'hand',recipient,action:'give',source_skill:SK.anxu})!==false);
}
const exact=(options,m)=>options.find(n=>n.zone===m?.zone&&n.index===m.index&&n.card===m.card);
export function sgs_ai_anxu_plan(g,a){
  if(!sgs_anxu_available(g,a))return null;
  const ally=p=>g.side_of(p)===g.side_of(a);
  return sgs_anxu_pairs(g,a).map(p=>({...p,benefit:(ally(p.recipient)?2:0)-(ally(p.giver)?2:0)+(Math.abs(p.counts[0]-p.counts[1])===2?1:0)}))
    .filter(p=>p.benefit>0).sort((x,y)=>y.benefit-x.benefit)[0]??null;
}
export function sgs_ai_anxu_give(g,giver,recipient){
  // The giver may evaluate their own hand; pair/reward policy never may.
  return sgs_anxu_give_materials(g,giver,recipient).sort((x,y)=>(g.material_ai_cost?.(x)??0)-(g.material_ai_cost?.(y)??0))[0]??null;
}
async function choosePair(g,a,phase,valid){
  while(valid()){
    const pairs=sgs_anxu_pairs(g,a);if(!pairs.length)return null;
    const options=pairs.map(p=>({id:p.id,label:`${p.giver.name}（${p.giver.hand.length}张） → ${p.recipient.name}（${p.recipient.hand.length}张）`}));
    const answer=await g.view.ask_line('安恤：选择两名其他角色，由手牌多者自行选择一张交给手牌少者',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗次数'}],
      meta:meta(g,a,SK.anxu,'anxu_targets',{phase_id:phase,exact_target_count:2,allow_self:false,allow_allies:true,hidden_hands:true})});
    if(!valid()||pass(answer))return null;
    const pair=pairs.find(p=>p.id===select(options,answer)?.id);
    if(pair)return pair;
  }return null;
}
async function chooseGift(g,giver,recipient,event_id,valid){
  while(valid()){
    const options=sgs_anxu_give_materials(g,giver,recipient);if(!options.length)return null;
    if(giver.is_ai)return sgs_ai_anxu_give(g,giver,recipient);
    const answer=await g.view.ask_line(`安恤：请选择一张手牌交给${recipient.name}`,{kind:'select_hand',player_id:seat(g,giver),min_count:1,max_count:1,options:options.map(({id,label})=>({id,label})),
      meta:meta(g,giver,SK.anxu,'anxu_give',{event_id,recipient_seat:seat(g,recipient),mandatory:true,material_zones:['hand'],visibility:'private'})});
    if(!valid())return null;const selected=select(options,answer);
    if(exact(sgs_anxu_give_materials(g,giver,recipient),selected))return selected;
    // Once owner commits, cancel is not permission to skip the mandatory gift.
  }return null;
}
async function chooseReward(g,a,event_id,valid){
  if(a.is_ai)return a.hp<maxHP(g,a)?'recover':'draw';
  while(valid()){
    if(a.hp>=maxHP(g,a))return 'draw';
    const options=[{id:'draw',label:'摸一张牌'},{id:'recover',label:'回复1点体力'}];
    const answer=await g.view.ask_line('安恤：双方当前手牌数相等，选择奖励',{kind:'choice',player_id:seat(g,a),options,meta:meta(g,a,SK.anxu,'anxu_reward',{event_id,mandatory:true})});
    if(!valid())return null;const selected=select(options,answer);if(selected?.id==='draw'||selected?.id==='recover'&&a.hp<maxHP(g,a))return selected.id;
  }return null;
}
async function resolveAnxu(g,a,{target_ids=null,event_id=null,phase_id=null,choose=false}={}){
  const phase=phase_id??phaseId(g,a),id=event_id??nextId(g,a,SK.anxu);
  const request={owner:pid(g,a),phase_id:phase,target_ids:Array.isArray(target_ids)?[...target_ids]:null,choose};
  if(state(g,a).anxu[JSON.stringify(id)]){ticket(g,a,'anxu',id,request);return false;}
  if(!sgs_anxu_available(g,a)||phase!==phaseId(g,a))return false;
  if(!choose&&(!Array.isArray(target_ids)||target_ids.length!==2||new Set(target_ids).size!==2))return false;
  movement(g);methods(g,'draw_cards','recover_hp');
  const bound=binding(g,a,SK.anxu),turn=g.turn_event_counter,t=ticket(g,a,'anxu',id,request),r=t.receipt;
  const activeOwner=()=>owned(g,a,SK.anxu)&&binding(g,a,SK.anxu)===bound&&g.turn_event_counter===turn&&phase===phaseId(g,a)&&inPlay(g,a);
  const valid=()=>activeOwner()&&idlePlay(g,a)&&phaseReady(g,a,phase,r);
  try{
    const pair=choose?await choosePair(g,a,phase,valid):sgs_anxu_pairs(g,a).find(p=>target_ids.every(v=>p.targets.some(t=>pid(g,t)===v)));
    if(!pair||!valid()||pair.targets.some((p,i)=>!live(p)||p.hand.length!==pair.counts[i])){t.finish();return false;}
    const {giver,recipient}=pair;
    if(!sgs_anxu_give_materials(g,giver,recipient).length){t.finish();return false;}
    // There is no physical activation cost: source activation/quota commit on
    // the exact valid target pair, before the giver's mandatory private choice.
    r.committed=true;r.status='giving';r.giver_id=pid(g,giver);r.recipient_id=pid(g,recipient);r.initial_counts=[giver.hand.length,recipient.hand.length];
    state(g,a).anxu_phases[JSON.stringify(phase)]={event_id:id,used:true};
    const canGive=()=>activeOwner()&&live(giver)&&live(recipient);
    const chosen=await chooseGift(g,giver,recipient,id,canGive);
    if(chosen&&canGive()){
      const legal=()=>canGive()&&Boolean(exact(sgs_anxu_give_materials(g,giver,recipient),chosen));
      const moved=await g.public_card_loss(giver,[chosen],{to:'hand',recipient,visibility:'private',action:'give',reason:'安恤',source:a,source_skill:SK.anxu,
        move_id:`anxu:${JSON.stringify([pid(g,a),id])}:give`,validate:legal,on_committed:cards=>{
          if(cards.length!==1||cards[0]!==chosen.card)throw Error('安恤赠予提交与所选实体手牌不一致');r.transferred=true;r.status='transferred';
        }});
      if(moved?.committed&&!r.transferred)throw Error('安恤赠予缺少原子提交回执');
    }
    // Actual post-loss/post-gain counts are authoritative, not an arithmetic
    // prediction made before 连营/屯田/other nested movement finished.
    if(r.transferred&&canGive()){
      r.final_counts=[giver.hand.length,recipient.hand.length];r.equal=giver.hand.length===recipient.hand.length;
      if(r.equal){
        const reward=await chooseReward(g,a,id,canGive);
        if(reward&&canGive()){
          r.reward=reward;r.status='rewarding';
          if(reward==='recover')r.recovered=await g.recover_hp(a,1,{source:a,source_skill:SK.anxu,recovery_event_id:`anxu:${JSON.stringify([pid(g,a),id])}:recover`});
          else{const cards=await g.draw_cards(a,1);r.drawn=Array.isArray(cards)?cards.length:1;}
        }
      }
    }
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_anxu_execute=(g,a,options)=>resolveAnxu(g,a,options);
export const sgs_resolve_anxu=sgs_anxu_execute;
export async function sgs_player_anxu(g,a){if(!sgs_anxu_available(g,a)){g.view.emit(`安恤：${sgs_anxu_unavailable_reason(g,a)}。`);return true;}await resolveAnxu(g,a,{choose:true});return true;}
export async function sgs_ai_anxu(g,a){const plan=sgs_ai_anxu_plan(g,a);return plan?sgs_anxu_execute(g,a,{target_ids:plan.targets.map(p=>pid(g,p))}):false;}

/** Death-source attribution is deliberately typed. An HP-loss source is never
 * the damage killer, and an untyped historical source must not invent one. */
export function sgs_zhuiyi_damage_killer(g,event={}){
  const cause=event.death_cause;
  return cause?.kind==='damage'&&stable(cause.killer_id)?g.all_players().find(p=>pid(g,p)===cause.killer_id)??null:null;
}
function deathOwn(g,a,e){
  return a?.dead===true&&e.owner_dead===true&&stable(e.death_event_id)&&!e.cancelled&&!e.closed&&!g.winner
    &&['damage','hp_loss','other'].includes(e.death_cause?.kind)
    &&[e.death_cause.source_id,e.death_cause.killer_id].every(id=>id===null||stable(id))
    &&Array.isArray(e.pre_death_skill_ids)&&e.pre_death_skill_ids.includes(SK.zhuiyi)&&stable(e.pre_death_skill_binding_id);
}
export function sgs_zhuiyi_targets(g,a,event={}){
  if(!deathOwn(g,a,event))return [];
  const killer=sgs_zhuiyi_damage_killer(g,event);return g.all_players().filter(p=>p!==a&&p!==killer&&live(p));
}
export function sgs_ai_zhuiyi_target(g,a,event={}){
  return sgs_zhuiyi_targets(g,a,event).filter(p=>g.side_of(p)===g.side_of(a))
    .sort((x,y)=>(maxHP(g,y)-y.hp)-(maxHP(g,x)-x.hp)||x.hand.length-y.hand.length)[0]??null;
}
const deathRequest=(g,a,e)=>({owner:pid(g,a),kind:e.death_cause?.kind??null,killer_id:e.death_cause?.killer_id??null,
  source_id:e.death_cause?.source_id??null,damage_event_id:e.death_cause?.damage_event_id??null,skill_ids:[...(e.pre_death_skill_ids??[])],binding:e.pre_death_skill_binding_id??null});
export async function sgs_before_death_zhuiyi(g,a,event={}){
  const id=event.death_event_id,request=deathRequest(g,a,event),refs=[sgs_zhuiyi_damage_killer(g,event)];
  if(a?.[FIELD]?.zhuiyi?.[JSON.stringify(id)]){ticket(g,a,'zhuiyi',id,request,refs);return false;}
  if(!deathOwn(g,a,event))return false;
  methods(g,'draw_cards','recover_hp');const t=ticket(g,a,'zhuiyi',id,request,refs),r=t.receipt;
  // Do not use resolution_should_continue(): human final death makes that
  // ordinary attack guard false before this required intrinsic death window.
  const valid=()=>deathOwn(g,a,event)&&event.death_event_id===id&&JSON.stringify(deathRequest(g,a,event))===JSON.stringify(request);
  try{
    let target;
    if(a.is_ai)target=sgs_ai_zhuiyi_target(g,a,event);
    else while(valid()){
      const targets=sgs_zhuiyi_targets(g,a,event);if(!targets.length)break;
      const options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}/${maxHP(g,p)}体力，${p.hand.length}张手牌）`}));
      const killer=sgs_zhuiyi_damage_killer(g,event);
      const answer=await g.view.ask_line('追忆：选择一名其他存活角色摸三张牌，然后回复1点体力（杀死你的角色除外）',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'不发动'}],
        meta:meta(g,a,SK.zhuiyi,'zhuiyi_target',{death_event_id:id,owner_dead:true,allow_allies:true,full_hp_legal:true,killer_seat:killer?seat(g,killer):null})});
      if(!valid()||pass(answer))break;
      const selected=select(options,answer);target=targets.find(p=>String(pid(g,p))===selected?.id);
      if(target&&sgs_zhuiyi_targets(g,a,event).includes(target))break;target=null;
    }
    if(!target||!valid()||!sgs_zhuiyi_targets(g,a,event).includes(target)){t.finish();return false;}
    r.committed=true;r.target_id=pid(g,target);r.status='drawing';
    const cards=await g.draw_cards(target,3);r.drawn=Array.isArray(cards)?cards.length:3;
    // This paid death effect survives later skill changes; final-dead recipients
    // cannot recover. A full-HP recipient still received the three-card draw.
    if(live(target)&&!g.winner){r.status='recovering';r.recovered=await g.recover_hp(target,1,{source:a,source_skill:SK.zhuiyi,recovery_event_id:`zhuiyi:${JSON.stringify([pid(g,a),id])}:recover`});}
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_next_bulianshi_public_state(a){
  if(!a?.[FIELD])return {anxu_used_phases:[],anxu_events:[],zhuiyi_events:[]};const s=validateState(a[FIELD]);
  return {anxu_used_phases:Object.entries(s.anxu_phases).filter(([,r])=>r.used).map(([key])=>JSON.parse(key)),
    anxu_events:Object.values(s.anxu).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,giver_id:r.giver_id??null,recipient_id:r.recipient_id??null,transferred:r.transferred===true,equal:r.equal??null,reward:r.reward??null})),
    zhuiyi_events:Object.values(s.zhuiyi).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,target_id:r.target_id??null,drawn:r.drawn??0,recovered:r.recovered??0}))};
}
export function sgs_next_bulianshi_skill_definitions({SkillHooks,ActiveSkillDef}){
  const anxu=new ActiveSkillDef({skill_id:SK.anxu,hotkey:'q',button_label:'安恤',player:sgs_player_anxu,ai:sgs_ai_anxu,available:sgs_anxu_available,
    help_text:'出牌阶段限一次，选择手牌数不同的两名其他角色，由多者自行选择一张手牌交给少者；交牌后双方手牌数相等，你摸一张牌或回复1点体力。1v1无合法目标。'});
  anxu.source_skill_id=SK.anxu;anxu.owns_target_selection=true;anxu.targets=sgs_anxu_targets;anxu.unavailable_reason=sgs_anxu_unavailable_reason;
  return {hooks:{[ID.bulianshi]:SkillHooks({before_death_commit:[sgs_before_death_zhuiyi]})},active:{[ID.bulianshi]:[anxu]}};
}
sgs_before_death_zhuiyi.source_skill_id=SK.zhuiyi;
