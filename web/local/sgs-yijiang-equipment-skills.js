/** Mainland-mobile base identity 吴国太 / 凌统, snapshot 2026-10-15.
 * Complete selected inventories; explicit Y0–Y6/Y13 host policies, not current
 * client certification. See docs/sgs-yijiang/equipment-integration-contract.md. */
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_EQUIPMENT_RULE_IDS=Object.freeze({wuguotai:'sgs.adapted.base.hero.wu-guo-tai',lingtong:'sgs.adapted.base.hero.ling-tong'});
export const SGS_YIJIANG_EQUIPMENT_SKILL_IDS=Object.freeze({ganlu:'sgs.ganlu',buyi:'sgs.buyi',xuanfeng:'sgs.xuanfeng'});
export const SGS_YIJIANG_EQUIPMENT_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,source_only_exact_for_every_edge:false,
  host_policy_ids:Object.freeze(['Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y13']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_YIJIANG_EQUIPMENT_RULE_IDS.wuguotai,name:'吴国太',max_hp:3,starting_hp:3,gender:'female',source_faction:'吴',skill_ids:Object.freeze(['sgs.ganlu','sgs.buyi']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_YIJIANG_EQUIPMENT_RULE_IDS.lingtong,name:'凌统',max_hp:4,starting_hp:4,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.xuanfeng']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  literal_skill_text:Object.freeze({
    'sgs.ganlu':'出牌阶段限一次，你可以选择两名装备区里的牌数之差不大于你已损失体力值数的角色，交换他们装备区里的牌。',
    'sgs.buyi':'当一名角色进入濒死状态时，你可以展示其一张手牌，然后若此牌不为基本牌，则该角色弃置此牌，然后回复1点体力。',
    'sgs.xuanfeng':'当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，你可以弃置至多两名其他角色的共计两张牌。',
  }),
  supplemental_xuanfeng:'同产品经典文本补明依次弃置、共计至多两张；不导入界凌统移动装备分支。',
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-107.html','https://www.sanguosha.cn/pc/hero-detail-105.html',
    'https://wiki.biligame.com/msgs/吴国太','https://wiki.biligame.com/msgs/凌统','https://wiki.biligame.com/msgs/甘露/吴国太',
    'https://wiki.biligame.com/msgs/补益/吴国太','https://wiki.biligame.com/msgs/旋风/凌统','https://sanguosha.fandom.com/zh/wiki/吴国太']),
  bwiki_revisions:Object.freeze({wuguotai:35897,lingtong:38769}),
});
const ID=SGS_YIJIANG_EQUIPMENT_RULE_IDS,SK=SGS_YIJIANG_EQUIPMENT_SKILL_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const NAMES=Object.freeze({[SK.ganlu]:'甘露',[SK.buyi]:'补益',[SK.xuanfeng]:'旋风'});
const extant=a=>Boolean(a&&!a.dead),live=a=>extant(a)&&a.hp>0;
const owned=(g,a,skill)=>extant(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&(typeof g.has_general_skill==='function'?g.has_general_skill(a,skill):(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill));
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const meta=(g,a,skill,stage,extra={})=>({skill:NAMES[skill],skill_id:skill,stage,private_to:seat(g,a),...extra});
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const cardRecord=c=>({physical_id:physicalId(c),name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const active=new WeakMap(),references=new WeakMap();
function state(a){
  const s=a.sgs_yijiang_equipment_state??={version:1,counter:0,ganlu:{},ganlu_phases:{},buyi:{},xuanfeng_loss:{},xuanfeng_discard:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['ganlu','ganlu_phases','buyi','xuanfeng_loss','xuanfeng_discard'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Yijiang equipment-skill state');
  return s;
}
export const sgs_clone_yijiang_equipment_state=a=>a.sgs_yijiang_equipment_state?JSON.parse(JSON.stringify(state(a))):null;
function ticket(a,namespace,id,request,refs=[]){
  if(!stable(id))throw Error('一将武将技能需要稳定事件ID');
  const key=JSON.stringify(id),s=state(a),old=s[namespace][key],rk=`${namespace}:${key}`;
  let inFlight=active.get(a);if(!inFlight)active.set(a,inFlight=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一一将事件不能更换目标、事实或实体牌');
    if(old.status!=='done'&&!inFlight.has(old))throw Object.assign(Error('一将技能事务中断；须重放原动作日志，不能重复移牌或回复'),{code:'SGS_YIJIANG_EQUIPMENT_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[namespace][key]={event_id:id,request,status:'offered',committed:false};inFlight.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';inFlight.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);inFlight.delete(receipt);}};
}
function nextId(g,a,skill){const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('一将事务计数器已耗尽');return `${skill}:${JSON.stringify([pid(g,a),++s.counter])}`;}
function requireMethods(g,...methods){for(const name of methods)if(typeof g[name]!=='function')throw Error(`一将接入缺少 ${name}`);}
function movement(g){requireMethods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('一将需要 validate / on_committed 原子移牌边界');}
function binding(g,a,skill){const id=g.general_skill_binding_id?.(a,skill)??pid(g,a);return JSON.stringify([id,rule_hero(a)?.id]);}
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
const ownTurn=(g,a)=>g.is_own_actual_turn?.(a)??(g.actual_turn_active!==false&&g.turn_actor===seat(g,a));
const currentPhase=(g,a)=>a.play_phase_id??g.play_phase_event_counter;
const idlePlay=(g,a)=>live(a)&&ownTurn(g,a)&&g.is_own_play_phase(a)&&ongoing(g)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const equipment=a=>SLOTS.flatMap(zone=>a[zone]&&!a[zone].virtual?[{zone,index:0,card:a[zone]}]:[]);
function pairLegal(g,a,first,second){
  if(first===second||!live(first)||!live(second))return false;
  const x=equipment(first).length,y=equipment(second).length;
  // Hiding both-empty exchanges is the explicit Y3 no-effect UI policy.
  return x+y>0&&Math.abs(x-y)<=Math.max(0,maxHP(g,a)-a.hp);
}
export function sgs_ganlu_pairs(g,a){
  if(!owned(g,a,SK.ganlu))return [];
  const players=g.all_players().filter(live),pairs=[];
  for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++)if(pairLegal(g,a,players[i],players[j]))pairs.push({id:`pair:${pid(g,players[i])}:${pid(g,players[j])}`,targets:[players[i],players[j]],counts:[equipment(players[i]).length,equipment(players[j]).length]});
  return pairs;
}
function phaseReady(a,phase,except=null){
  if(!a.sgs_yijiang_equipment_state)return true;
  const s=state(a);return !s.ganlu_phases[JSON.stringify(phase)]&&!Object.values(s.ganlu).some(r=>r!==except&&r.request.phase_id===phase&&r.status!=='done');
}
export const sgs_ganlu_available=(g,a)=>owned(g,a,SK.ganlu)&&idlePlay(g,a)&&stable(currentPhase(g,a))&&phaseReady(a,currentPhase(g,a))&&sgs_ganlu_pairs(g,a).length>0;
export function sgs_ganlu_unavailable_reason(g,a){
  if(!owned(g,a,SK.ganlu))return '当前不拥有甘露';
  if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!stable(currentPhase(g,a)))return '缺少真实出牌阶段标识';
  if(!phaseReady(a,currentPhase(g,a)))return '本出牌阶段甘露已发动或正在处理';
  return sgs_ganlu_pairs(g,a).length?'':'没有装备数差不超过已损失体力的有效交换组合';
}
export function sgs_ai_ganlu_plan(g,a){
  if(!sgs_ganlu_available(g,a))return null;
  const side=g.side_of(a);
  return sgs_ganlu_pairs(g,a).map(p=>{const [x,y]=p.targets,[cx,cy]=p.counts,ax=g.side_of(x)===side,ay=g.side_of(y)===side;
    return {...p,benefit:ax===ay?0:ax?cy-cx:cx-cy};}).filter(p=>p.benefit>0).sort((x,y)=>y.benefit-x.benefit)[0]??null;
}
async function resolveGanlu(g,a,{target_ids=null,event_id=null,phase_id=null,choose=false}={}){
  const phase=phase_id??currentPhase(g,a),id=event_id??nextId(g,a,SK.ganlu),request={actor:pid(g,a),phase_id:phase,target_ids:target_ids?[...target_ids]:null};
  if(state(a).ganlu[JSON.stringify(id)]){ticket(a,'ganlu',id,request);return false;}
  if(!sgs_ganlu_available(g,a)||phase!==currentPhase(g,a))return false;
  if(!choose&&(!Array.isArray(target_ids)||target_ids.length!==2||new Set(target_ids).size!==2))return false;
  requireMethods(g,'atomic_equipment_exchange');
  const bound=binding(g,a,SK.ganlu),turn=g.turn_event_counter,t=ticket(a,'ganlu',id,request);
  const valid=()=>owned(g,a,SK.ganlu)&&binding(g,a,SK.ganlu)===bound&&g.turn_event_counter===turn&&idlePlay(g,a)&&phase===currentPhase(g,a)&&phaseReady(a,phase,t.receipt);
  try{
    let pair=null;
    if(choose){
      while(valid()){
        const pairs=sgs_ganlu_pairs(g,a).map(p=>({...p,snapshots:p.targets.map(target=>equipment(target))}));if(!pairs.length)break;
        const options=pairs.map(p=>({id:p.id,label:p.targets.map((p,i)=>`${p.name}（${equipment(p).length}件装备）`).join(' ↔ ')}));
        const answer=await g.view.ask_line('甘露：选择两名角色交换全部装备，或取消',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗次数'}],meta:meta(g,a,SK.ganlu,'ganlu_targets',{phase_id:phase,exact_target_count:2,lost_hp:Math.max(0,maxHP(g,a)-a.hp)})});
        if(!valid()||pass(answer))break;
        pair=pairs.find(p=>p.id===select(options,answer)?.id);if(pair)break;
        g.view.emit('请选择有效的交换组合。',{private_to:seat(g,a)});
      }
    }else{const targets=target_ids.map(id=>g.all_players().find(p=>pid(g,p)===id));if(targets.every(Boolean))pair={targets};}
    if(!pair||!valid()||!pairLegal(g,a,...pair.targets)){t.finish();return false;}
    const [first,second]=pair.targets,snapshots=pair.snapshots??pair.targets.map(p=>equipment(p));
    t.receipt.targets=pair.targets.map(p=>pid(g,p));t.receipt.status='exchanging';
    const exact=()=>snapshots.every((snapshot,i)=>{const now=equipment(pair.targets[i]);return now.length===snapshot.length&&snapshot.every(m=>pair.targets[i][m.zone]===m.card);});
    const result=await g.atomic_equipment_exchange(first,second,{move_id:`ganlu:${JSON.stringify([pid(g,a),id])}:exchange`,source:a,source_skill:SK.ganlu,reason:'甘露',
      validate:guard=>valid()&&(guard?.blocked_materials.length||pairLegal(g,a,first,second)&&exact()),on_committed:()=>{t.receipt.committed=true;t.receipt.status='committed';state(a).ganlu_phases[JSON.stringify(phase)]={event_id:id,used:true};}});
    if(result?.committed&&!t.receipt.committed)throw Error('甘露交换缺少原子提交回执');
    t.finish();return t.receipt.committed;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_ganlu_execute=(g,a,options)=>resolveGanlu(g,a,options);
export const sgs_resolve_ganlu=sgs_ganlu_execute;
export async function sgs_player_ganlu(g,a){if(!sgs_ganlu_available(g,a)){g.view.emit(`甘露：${sgs_ganlu_unavailable_reason(g,a)}。`);return true;}await resolveGanlu(g,a,{choose:true});return true;}
export async function sgs_ai_ganlu(g,a){const plan=sgs_ai_ganlu_plan(g,a);return plan?sgs_ganlu_execute(g,a,{target_ids:plan.targets.map(p=>pid(g,p))}):false;}

const discardable=(g,owner,m,chooser,skill)=>g.can_discard_material?.(owner,m,{chooser,source_skill:skill})!==false
  &&g.can_discard_card?.(owner,m.card,{zone:m.zone,reason:NAMES[skill],chooser,source_skill:skill})!==false;
const actualHand=(target,m)=>m?.zone==='hand'&&target.hand[m.index]===m.card;
const handChoices=(g,owner,chooser,skill,{discard=false}={})=>owner.hand.map((card,index)=>({zone:'hand',index,card,id:`hand:${index+1}`,label:owner===chooser?`手牌${index+1}：${card}`:`手牌${index+1}（未知）`})).filter(m=>!discard||discardable(g,owner,m,chooser,skill));
const dyingId=e=>e.dying_event_id??e.event_id;
const validBuyi=(g,a,e)=>owned(g,a,SK.buyi)&&extant(e.dying)&&e.dying.hp<=0&&!e.waive_rescue&&!e.closed&&!e.cancelled&&ongoing(g);
export const sgs_ai_buyi_decision=(g,a,e)=>validBuyi(g,a,e)&&g.side_of(a)===g.side_of(e.dying)&&e.dying.hand.length>0;
export async function sgs_on_any_dying_entry_buyi(g,a,event={}){
  if(!validBuyi(g,a,event))return false;
  const dying=event.dying,id=dyingId(event),t=ticket(a,'buyi',id,{holder:pid(g,a),dying:pid(g,dying),source:pid(g,event.source)},[dying,event.source??null]);if(!t)return false;
  const bound=binding(g,a,SK.buyi),valid=()=>validBuyi(g,a,event)&&binding(g,a,SK.buyi)===bound;
  try{
    if(!dying.hand.length||a.is_ai&&!sgs_ai_buyi_decision(g,a,event)){t.finish();return false;}
    requireMethods(g,'card_family');let chosen=null;
    if(a.is_ai){
      const options=handChoices(g,dying,a,SK.buyi);
      if(a===dying)chosen=options.find(m=>['trick','equipment'].includes(g.card_family(m.card))&&discardable(g,dying,m,a,SK.buyi))??null;
      else{requireMethods(g.rng,'choice');chosen=g.rng.choice(options);}
    }else while(valid()&&dying.hand.length){
      const options=handChoices(g,dying,a,SK.buyi);
      const answer=await g.view.ask_line(`补益：展示${dying.name}的一张手牌，非基本牌由其弃置并回复1点体力`,{kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不发动补益'}],meta:meta(g,a,SK.buyi,'buyi_card',{event_id:id,owner_seat:seat(g,dying),hidden_hands:a!==dying,material_zones:['hand']})});
      if(!valid()||pass(answer))break;
      const selected=select(options,answer);if(selected&&actualHand(dying,selected)){chosen=selected;break;}
      g.view.emit('手牌已变化，请重新选择。',{private_to:seat(g,a)});
    }
    if(!chosen||!valid()||!actualHand(dying,chosen)){t.finish();return false;}
    const family=g.card_family(chosen.card);if(!['basic','trick','equipment'].includes(family))throw Error('补益遇到未注册牌类，禁止推定为非基本牌');
    t.receipt.committed=true;t.receipt.status='revealed';t.receipt.revealed=cardRecord(chosen.card);t.receipt.card_family=family;
    g.view.emit(`${a.name}发动补益，展示${dying.name}的一张手牌：${chosen.card}。`,{event_type:'skill_card_reveal',source_skill:SK.buyi,owner_seat:seat(g,dying),card:t.receipt.revealed});
    if(family==='basic'){t.finish();return true;}
    movement(g);requireMethods(g,'recover_hp');
    const legal=()=>extant(dying)&&!event.waive_rescue&&actualHand(dying,chosen)&&discardable(g,dying,chosen,a,SK.buyi);
    if(!legal()){t.finish();return true;}
    const result=await g.public_card_loss(dying,[chosen],{to:'discard',visibility:'public',reason:'补益',action:'discard',source:a,source_skill:SK.buyi,move_id:`buyi:${JSON.stringify([pid(g,a),id])}:discard`,validate:legal,
      on_committed:()=>{t.receipt.discarded=true;t.receipt.status='discarded';}});
    if(result?.committed&&!t.receipt.discarded)throw Error('补益弃牌缺少原子提交回执');
    if(t.receipt.discarded&&extant(dying)&&ongoing(g))t.receipt.recovered=await g.recover_hp(dying,1,{source:a,source_skill:SK.buyi,recovery_event_id:`buyi:${JSON.stringify([pid(g,a),id])}:heal`});
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}

/** Unknown hands are represented by identity and position only. No face-based
 * ranking or serialization of another player's unrevealed hand occurs here. */
export function sgs_xuanfeng_materials(g,a,target){
  if(!extant(target)||target===a)return [];
  return [...SLOTS.flatMap(zone=>target[zone]&&!target[zone].virtual?[{id:`eq:${zone}`,zone,index:0,card:target[zone],label:String(target[zone])}]:[]),...handChoices(g,target,a,SK.xuanfeng,{discard:true})]
    .filter(m=>m.zone==='hand'||discardable(g,target,m,a,SK.xuanfeng));
}
export const sgs_xuanfeng_targets=(g,a)=>g.all_players().filter(p=>p!==a&&extant(p)&&sgs_xuanfeng_materials(g,a,p).length>0);
export function sgs_ai_xuanfeng_target(g,a){return sgs_xuanfeng_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>equipment(y).length-equipment(x).length||y.hand.length-x.hand.length)[0]??null;}
function exactMaterial(g,a,target,m){return sgs_xuanfeng_materials(g,a,target).find(n=>n.zone===m?.zone&&n.index===m.index&&n.card===m.card);}
async function xuanfeng(g,a,t,validTrigger){
  const bound=binding(g,a,SK.xuanfeng),valid=()=>extant(a)&&ongoing(g)&&(t.receipt.committed||owned(g,a,SK.xuanfeng)&&binding(g,a,SK.xuanfeng)===bound&&validTrigger());
  t.receipt.discarded_count=0;t.receipt.targets=[];
  try{
    movement(g);
    while(valid()&&t.receipt.discarded_count<2){
      const targets=sgs_xuanfeng_targets(g,a);if(!targets.length)break;
      let target=null,chosen=null;
      if(a.is_ai)target=sgs_ai_xuanfeng_target(g,a);
      else{
        const options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（手牌${p.hand.length}张，装备${equipment(p).length}件）`}));
        const answer=await g.view.ask_line('旋风：选择一名其他角色，或结束本次旋风',{kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'结束旋风'}],meta:meta(g,a,SK.xuanfeng,'xuanfeng_target',{event_id:t.receipt.event_id,discarded_count:t.receipt.discarded_count,max_cards:2})});
        if(!valid()||pass(answer))break;
        target=targets.find(p=>String(pid(g,p))===select(options,answer)?.id);
        if(!target)continue;
      }
      if(!target||!valid())break;
      const options=sgs_xuanfeng_materials(g,a,target);if(!options.length)continue;
      if(a.is_ai){chosen=options.find(m=>m.zone!=='hand');if(!chosen){requireMethods(g.rng,'choice');chosen=g.rng.choice(options);}}
      else{
        const answer=await g.view.ask_line(`旋风：弃置${target.name}的一张手牌或装备`,{kind:'select_target_card',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'结束旋风'}],meta:meta(g,a,SK.xuanfeng,'xuanfeng_card',{event_id:t.receipt.event_id,owner_seat:seat(g,target),hidden_hands:true,material_zones:['hand',...SLOTS],discarded_count:t.receipt.discarded_count})});
        if(!valid()||pass(answer))break;chosen=select(options,answer);
      }
      if(!chosen||!valid()||!exactMaterial(g,a,target,chosen))continue;
      let committed=false;
      const index=t.receipt.discarded_count+1,result=await g.public_card_loss(target,[chosen],{to:'discard',visibility:'public',reason:'旋风',action:'discard',source:a,source_skill:SK.xuanfeng,move_id:`xuanfeng:${JSON.stringify([pid(g,a),t.receipt.event_id,t.receipt.request.reason])}:card:${index}`,
        validate:()=>valid()&&Boolean(exactMaterial(g,a,target,chosen)),on_committed:()=>{committed=true;t.receipt.committed=true;t.receipt.status='committed';t.receipt.discarded_count++;if(!t.receipt.targets.includes(pid(g,target)))t.receipt.targets.push(pid(g,target));}});
      if(result?.committed&&!committed)throw Error('旋风弃牌缺少原子提交回执');
      // An unsuccessful host movement cannot spin on the same card forever.
      if(!committed)break;
    }
    t.finish();return t.receipt.discarded_count>0;
  }catch(error){t.fail(error);throw error;}
}
const validLoss=(g,a,e)=>owned(g,a,SK.xuanfeng)&&ongoing(g)&&e.committed===true&&!e.cancelled&&e.atomic_complete!==false&&(!e.owner||e.owner===a)
  &&(e.materials??[]).some(m=>SLOTS.includes(m.zone)&&m.card&&!m.card.virtual);
export async function sgs_after_cards_lost_xuanfeng(g,a,event={}){
  if(!validLoss(g,a,event))return false;
  const request={reason:'equipment_loss',owner:pid(g,a),materials:event.materials.map(m=>({zone:m.zone,index:m.index??null,card:cardRecord(m.card)})),to:event.to??null,recipient:pid(g,event.recipient),action:event.action??null};
  const t=ticket(a,'xuanfeng_loss',event.move_id,request,event.materials.map(m=>m.card));return t?xuanfeng(g,a,t,()=>validLoss(g,a,event)):false;
}
const discardId=e=>e.phase_id??e.phase_event_id;
const validDiscard=(g,a,e)=>owned(g,a,SK.xuanfeng)&&ongoing(g)&&ownTurn(g,a)&&g.turn_phase==='discard'&&!e.skipped&&!e.cancelled&&!e.closed
  &&stable(discardId(e))&&(a.yijiang_discard_phase_id==null||a.yijiang_discard_phase_id===discardId(e))&&Number.isSafeInteger(e.own_discarded_cards)&&e.own_discarded_cards>=2;
export async function sgs_after_discard_phase_xuanfeng(g,a,event={}){
  if(!validDiscard(g,a,event))return false;
  const request={reason:'discard_phase',owner:pid(g,a),phase_id:discardId(event),own_discarded_cards:event.own_discarded_cards};
  const turn=g.turn_event_counter,t=ticket(a,'xuanfeng_discard',discardId(event),request);return t?xuanfeng(g,a,t,()=>validDiscard(g,a,event)&&g.turn_event_counter===turn):false;
}
export function sgs_yijiang_equipment_public_state(a){
  const s=a?.sgs_yijiang_equipment_state;if(!s)return {ganlu_used_phases:[],handled_events:{buyi:[],xuanfeng_loss:[],xuanfeng_discard:[]}};
  state(a);return {ganlu_used_phases:Object.entries(s.ganlu_phases).filter(([,r])=>r.used).map(([phase])=>JSON.parse(phase)),
    handled_events:Object.fromEntries(['buyi','xuanfeng_loss','xuanfeng_discard'].map(k=>[k,Object.values(s[k]).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,discarded_count:r.discarded_count??0}))]))};
}
export function sgs_yijiang_equipment_skill_definitions({SkillHooks,ActiveSkillDef}){
  const ganlu=new ActiveSkillDef({skill_id:SK.ganlu,hotkey:'q',button_label:'甘露',player:sgs_player_ganlu,ai:sgs_ai_ganlu,available:sgs_ganlu_available,
    help_text:'出牌阶段限一次，交换两名角色的全部装备；装备数差不超过自己已损失体力，自身参与也需满足。'});
  ganlu.source_skill_id=SK.ganlu;ganlu.owns_target_selection=true;ganlu.targets=(g,a)=>[...new Set(sgs_ganlu_pairs(g,a).flatMap(p=>p.targets))];ganlu.unavailable_reason=sgs_ganlu_unavailable_reason;
  return {hooks:{[ID.wuguotai]:SkillHooks({on_any_dying_entry:[sgs_on_any_dying_entry_buyi]}),[ID.lingtong]:SkillHooks({after_cards_lost:[sgs_after_cards_lost_xuanfeng],on_discard_phase_end:[sgs_after_discard_phase_xuanfeng]})},active:{[ID.wuguotai]:[ganlu]}};
}
for(const [hook,source_skill_id] of [[sgs_on_any_dying_entry_buyi,SK.buyi],[sgs_after_cards_lost_xuanfeng,SK.xuanfeng],[sgs_after_discard_phase_xuanfeng,SK.xuanfeng]])hook.source_skill_id=source_skill_id;
