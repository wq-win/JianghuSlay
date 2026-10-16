/** Mainland-mobile base identity 邓艾 / 蔡文姬, source snapshot 2026-10-15.
 * Full source inventory; M1/M5–M8/M11–M15 are explicit host policies, not
 * current-mobile-client certification. Real field zones and dynamic ownership
 * belong to the host. See docs/sgs-mountain/field-integration-contract.md. */
import {Card,CardType,CardSuit,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_MOUNTAIN_FIELD_RULE_IDS=Object.freeze({dengai:'sgs.adapted.base.hero.deng-ai',caiwenji:'sgs.adapted.base.hero.cai-wen-ji'});
export const SGS_MOUNTAIN_FIELD_SKILL_IDS=Object.freeze({tuntian:'sgs.tuntian',zaoxian:'sgs.zaoxian',jixi:'sgs.jixi',beige:'sgs.beige',duanchang:'sgs.duanchang'});
export const SGS_MOUNTAIN_FIELD_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['M0','M1','M5','M6','M7','M8','M11','M12','M13','M14','M15','M16']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_MOUNTAIN_FIELD_RULE_IDS.dengai,name:'邓艾',max_hp:4,starting_hp:4,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.tuntian','sgs.zaoxian']),granted_skill_ids:Object.freeze(['sgs.jixi']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_MOUNTAIN_FIELD_RULE_IDS.caiwenji,name:'蔡文姬',max_hp:3,starting_hp:3,gender:'female',source_faction:'群',skill_ids:Object.freeze(['sgs.beige','sgs.duanchang']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-51.html','https://www.sanguosha.cn/pc/hero-detail-57.html',
    'https://wiki.biligame.com/msgs/index.php?title=邓艾&oldid=34837','https://wiki.biligame.com/msgs/index.php?title=蔡文姬&oldid=35286',
    'https://my.4399.com/yxsgs/ziliao/6964/','https://my.4399.com/yxxsgs/wenda/6962/']),
});
const ID=SGS_MOUNTAIN_FIELD_RULE_IDS,SK=SGS_MOUNTAIN_FIELD_SKILL_IDS;
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const NAMES=Object.freeze({[SK.tuntian]:'屯田',[SK.zaoxian]:'凿险',[SK.jixi]:'急袭',[SK.beige]:'悲歌',[SK.duanchang]:'断肠'});
const seat=(g,a)=>g.seat_of(a),pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const live=a=>Boolean(a?.alive&&!a.dead&&a.hp>0);
const owned=(g,a,skill)=>!a?.skills_disabled&&!a?.disabled_skill_ids?.includes(skill)
  &&(typeof g.has_general_skill==='function'?g.has_general_skill(a,skill):(a?.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(skill));
const own=(g,a,skill)=>live(a)&&owned(g,a,skill);
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const ownTurn=(g,a)=>g.is_own_actual_turn?.(a)??(g.actual_turn_active!==false&&g.turn_actor===seat(g,a));
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
const fieldPile=a=>a?.sgs_mountain_fields??[];
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const cardRecord=c=>({physical_id:physicalId(c),name:c?.name??null,type:c?.type??null,suit:c?.suit??null,rank:c?.rank??null});
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&(m.id==null||o.id===m.id));
const active=new WeakMap(),references=new WeakMap();
function state(a){
  const s=a.sgs_mountain_field_state??={version:1,counter:0,tuntian:{},zaoxian:{},jixi:{},beige:{},duanchang:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['tuntian','zaoxian','jixi','beige','duanchang'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid mountain field-skill state');
  return s;
}
export const sgs_clone_mountain_field_state=a=>a.sgs_mountain_field_state?JSON.parse(JSON.stringify(state(a))):null;
function ticket(a,namespace,id,request,refs=[]){
  if(!stable(id))throw Error('山武将技能需要稳定事件ID');
  const key=JSON.stringify(id),s=state(a),old=s[namespace][key],rk=`${namespace}:${key}`;
  let inFlight=active.get(a);if(!inFlight)active.set(a,inFlight=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一山武将事件不能更换目标、事实或实体牌');
    if(old.status!=='done'&&!inFlight.has(old))throw Object.assign(Error('山武将事务中断；须从原动作日志重放，不能重复支付或判定'),{code:'SGS_MOUNTAIN_FIELD_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[namespace][key]={event_id:id,request,status:'offered',committed:false};inFlight.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';inFlight.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);inFlight.delete(receipt);},remove(){delete s[namespace][key];inFlight.delete(receipt);known.delete(rk);}};
}
function nextId(g,a,skill){const s=state(a);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('山武将事务计数器已耗尽');return `${skill}:${JSON.stringify([pid(g,a),++s.counter])}`;}
function requireMethods(g,...methods){for(const name of methods)if(typeof g[name]!=='function')throw Error(`山武将接入缺少 ${name}`);}
function requireMovement(g){requireMethods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('山武将需要 validate / on_committed 原子移牌边界');}
const meta=(g,a,skill,stage,extra={})=>({skill:NAMES[skill],skill_id:skill,stage,private_to:seat(g,a),...extra});
export const sgs_mountain_discard_materials=(g,a,options={})=>live(a)?g.skill_material_options(a,options).filter(m=>m.card&&!m.card.virtual&&(m.zone==='hand'||SLOTS.includes(m.zone))
  &&g.can_discard_material?.(a,m)!==false&&g.can_discard_card?.(a,m.card,{zone:m.zone,reason:'山武将弃牌'})!==false):[];
async function chooseMaterials(g,a,options,count,skill,stage,{mandatory=false,is_valid=()=>true,...extra}={}){
  if(!is_valid())return null;
  if(!count)return [];
  if(a.is_ai)return [...options].sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y)).slice(0,count);
  while(live(a)&&ongoing(g)&&is_valid()){
    const value=await g.view.ask_line(`${NAMES[skill]}：选择${count}张牌${mandatory?'（必须完成）':'，或取消'}`,{
      kind:'select_hand',player_id:seat(g,a),min_count:count,max_count:count,
      options:[...options.map(({id,label})=>({id,label})),...mandatory?[]:[{id:'cancel',label:'取消，不支付'}]],
      meta:meta(g,a,skill,stage,{mandatory,material_zones:[...new Set(options.map(m=>m.zone))],...extra}),
    });
    if(!is_valid()||!mandatory&&pass(value))return null;
    const tokens=String(value).trim().split(/[\s,，]+/).filter(Boolean),chosen=tokens.map(v=>select(options,v));
    if(tokens.length===count&&chosen.every(Boolean)&&new Set(chosen.map(m=>m.card)).size===count)return chosen;
    g.view.emit(`必须选择${count}张不同的合法牌。`,{private_to:seat(g,a)});
  }
  return null;
}

/** Directional adjustment goes BEFORE the host's minimum-one clamp. */
export function sgs_tuntian_distance_modifier(g,a,_target=null,{exclude_mountain_field=null}={}){
  if(!own(g,a,SK.tuntian))return 0;
  return -fieldPile(a).filter(c=>c&&!c.virtual&&c!==exclude_mountain_field).length;
}
function eligibleLoss(g,a,event){
  return own(g,a,SK.tuntian)&&!ownTurn(g,a)&&event.committed===true&&!event.cancelled&&event.atomic_complete!==false
    &&(!event.owner||event.owner===a)&&!(event.recipient===a&&['hand','board_equipment',...SLOTS].includes(event.to))
    &&event.net_loss!==false&&(event.materials??[]).some(m=>m.card&&!m.card.virtual&&(m.zone==='hand'||SLOTS.includes(m.zone)));
}
/** One optional judgment for an actual H/E LOSS BATCH; never one per card. */
export async function sgs_after_cards_lost_tuntian(g,a,event={}){
  if(!eligibleLoss(g,a,event))return false;
  const request={owner:pid(g,a),materials:event.materials.map(m=>({zone:m.zone,index:m.index??null,card:cardRecord(m.card)})),to:event.to??null,recipient:pid(g,event.recipient)};
  const t=ticket(a,'tuntian',event.move_id,request,event.materials.map(m=>m.card));if(!t)return false;
  const form=rule_hero(a)?.id;let judgment=null;
  try{
    const accepted=a.is_ai||await g.view.ask_confirm('屯田：是否判定？非红桃的最终判定实体牌成为公开的田。',{
      player_id:seat(g,a),meta:meta(g,a,SK.tuntian,'tuntian_offer',{move_id:event.move_id}),
    });
    if(!accepted||!eligibleLoss(g,a,event)||rule_hero(a)?.id!==form){t.finish();return false;}
    requireMethods(g,'reveal_judgment','capture_mountain_field','finish_judgment_card');
    t.receipt.committed=true;t.receipt.status='judging';
    judgment=await g.reveal_judgment(a,'屯田',{favorable:c=>c.suit!==CardSuit.HEART});
    if(judgment){
      const suit=judgment.fixed_judgment_result?judgment.suit:(g.effective_suit?.(judgment,a,{judged_actor:a})??judgment.suit);
      t.receipt.judgment_suit=suit;
      const cards=g.physical_card_materials?.(judgment)??(judgment.virtual?judgment.materials??[]:[judgment]);
      if(suit!==CardSuit.HEART&&own(g,a,SK.tuntian)&&cards.length===1&&!cards[0].virtual&&g.processing_cards.includes(cards[0])){
        const physical=cards[0];
        const result=await g.capture_mountain_field(a,physical,{reason:'屯田',source_skill:SK.tuntian,move_id:`tuntian:${JSON.stringify([pid(g,a),event.move_id])}:field`,
          validate:()=>own(g,a,SK.tuntian)&&g.processing_cards.includes(physical),on_committed:()=>{t.receipt.field_captured=true;}});
        t.receipt.field_captured=result?.committed===true||t.receipt.field_captured===true;
      }
    }
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}finally{if(judgment)await g.finish_judgment_card(judgment);}
}

export async function sgs_prepare_zaoxian(g,a,_fallback,event={}){
  const phase=event.phase_event_id??event.event_id;
  if(!own(g,a,SK.zaoxian)||!ongoing(g)||!ownTurn(g,a)||g.turn_phase!=='prepare'||event.closed||event.skipped||event.cancelled||!stable(phase)||fieldPile(a).filter(c=>c&&!c.virtual).length<3)return false;
  const binding=g.general_skill_binding_id?.(a,SK.zaoxian)??pid(g,a),id=`zaoxian:${JSON.stringify(binding)}`;
  const s=state(a),prior=s.zaoxian[JSON.stringify(id)];
  if(prior){if(prior.status!=='done'&&!active.get(a)?.has(prior))throw Error('凿险觉醒中断；须重放原动作，不能再次减体力上限');return false;}
  if(maxHP(g,a)<=1)throw Object.assign(Error('凿险在体力上限不大于1时的来源规则未核实；禁止自动觉醒'),{code:'SGS_MOUNTAIN_LOW_MAX_HP_UNSUPPORTED'});
  requireMethods(g,'change_max_hp','acquire_general_skill');
  const t=ticket(a,'zaoxian',id,{actor:pid(g,a),binding,phase_event_id:phase});
  try{
    // Stable binding/game mark is committed before either awaited host method.
    t.receipt.committed=true;t.receipt.status='awakening';t.receipt.max_hp_before=maxHP(g,a);
    g.commit_general_skill_resolution?.(a,{event_id:id,source_skill:SK.zaoxian});
    await g.change_max_hp(a,-1,{event_id:`${id}:maxhp`,source_skill:SK.zaoxian,minimum:1});
    await g.acquire_general_skill(a,SK.jixi,{event_id:`${id}:grant`,source_skill:SK.zaoxian});
    t.receipt.awakened=true;t.finish();g.view.emit(`${a.name}凿险觉醒：体力上限减1，获得急袭；保留屯田和所有田。`);return true;
  }catch(error){t.fail(error);throw error;}
}
const idlePlay=(g,a)=>live(a)&&ownTurn(g,a)&&g.is_own_play_phase(a)&&ongoing(g)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
export const sgs_jixi_materials=(g,a)=>own(g,a,SK.jixi)?fieldPile(a).flatMap((card,index)=>card&&!card.virtual?[{zone:'field',index,card,id:`field:${index+1}`,label:`田${index+1}：${card}`}]:[]):[];
const snatchView=(g,a,m)=>new Card('顺手牵羊',CardType.SCROLL,{virtual:true,materials:[m.card],physical_cards:[m.card],
  suit:g.effective_suit?.(m.card,a,{zone:'field',action:'card_use'})??m.card.suit,color:g.effective_color?.(m.card,a,{zone:'field',action:'card_use'})??m.card.color,rank:m.card.rank,
  source_skill:SK.jixi,source_skill_id:SK.jixi,source_game:'三国杀',source_rule_id:ID.dengai,effect_id:'trick.snatch'});
export function sgs_jixi_targets(g,a,material=null){
  if(!own(g,a,SK.jixi))return [];
  if(!material){const materials=sgs_jixi_materials(g,a);return g.all_players().filter(p=>materials.some(m=>sgs_jixi_targets(g,a,m).includes(p)));}
  const m=exact(sgs_jixi_materials(g,a),material);if(!m)return [];
  const view=snatchView(g,a,m);
  return g.all_players().filter(p=>p!==a&&live(p)&&g.target_has_card(p)&&!g.is_immune_to_shunshou(p)
    &&g.can_trick_target(a,p,view)&&!g.card_target_prohibited?.(a,p,view)
    &&g.distance_between(a,p,{exclude_mountain_field:m.card})<=1);
}
export const sgs_jixi_available=(g,a,target=null)=>own(g,a,SK.jixi)&&idlePlay(g,a)&&(target?sgs_jixi_targets(g,a).includes(target):sgs_jixi_targets(g,a).length>0);
export function sgs_jixi_unavailable_reason(g,a){
  if(!own(g,a,SK.jixi))return '凿险觉醒后才能获得急袭';
  if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用';
  if(!sgs_jixi_materials(g,a).length)return '需要一张实体田';
  return sgs_jixi_targets(g,a).length?'':'消耗选定田之后，距离1内没有可获得牌的合法目标';
}
export async function sgs_resolve_jixi(g,a,target,material,{action_id=null}={}){
  if(action_id!==null&&!stable(action_id))throw Error('急袭需要稳定动作ID');
  const phase=a.play_phase_id??g.play_phase_event_counter,request={actor:pid(g,a),target:pid(g,target),phase,material:material?{zone:material.zone,index:material.index,card:cardRecord(material.card)}:null};
  if(action_id!==null&&state(a).jixi[JSON.stringify(action_id)]){ticket(a,'jixi',action_id,request,[target,material?.card]);return false;}
  if(!sgs_jixi_available(g,a,target)||!sgs_jixi_targets(g,a,material).includes(target))return false;
  const m=exact(sgs_jixi_materials(g,a),material);if(!m)return false;
  requireMethods(g,'move_mountain_field','start_card_use','end_card_use','resolve_scroll','finish_processing_card');
  const id=action_id??nextId(g,a,SK.jixi),t=ticket(a,'jixi',id,request,[target,m.card]),turn=g.turn_event_counter,form=rule_hero(a)?.id,view=snatchView(g,a,m);let scope=null;
  try{
    const result=await g.move_mountain_field(a,m.card,{to:'processing',visibility:'public',reason:'急袭·当顺手牵羊使用',action:'card_use',source_skill:SK.jixi,move_id:`id:${JSON.stringify(id)}:material`,
      validate:()=>turn===g.turn_event_counter&&phase===(a.play_phase_id??g.play_phase_event_counter)&&form===rule_hero(a)?.id
        &&sgs_jixi_available(g,a,target)&&!!exact(sgs_jixi_materials(g,a),m)&&sgs_jixi_targets(g,a,m).includes(target),
      on_committed:cards=>{
        if(cards.length!==1||cards[0]!==m.card)throw Error('急袭必须恰好提交选定的一张实体田');
        t.receipt.committed=true;t.receipt.status='resolving';
        scope=g.start_card_use(a,view,{materials:[m.card],sourceZones:['field'],provenance:{kind:'converted',source_skill_id:SK.jixi}});t.receipt.history_use_id=scope.use_id;
      },
    });
    if(!result?.committed){if(t.receipt.committed)throw Error('急袭移牌回执矛盾');t.remove();return false;}
    if(!t.receipt.committed)throw Error('急袭移牌遗漏 on_committed；禁止重付材料');
    if(live(a)&&live(target)&&ongoing(g))await g.resolve_scroll(a,target,view,{physical_material:m.card,source_skill:SK.jixi,source_skill_id:SK.jixi,trick_declaration_validated:true,history_use_id:scope.use_id,effect_id:'trick.snatch',allow_allies:true});
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}finally{if(t?.receipt.committed)g.finish_processing_card(view);if(scope)g.end_card_use(scope);}
}
export function sgs_ai_jixi_plan(g,a){
  if(!sgs_jixi_available(g,a))return null;
  for(const material of sgs_jixi_materials(g,a)){
    const targets=sgs_jixi_targets(g,a,material),target=targets.find(p=>g.side_of(p)!==g.side_of(a)&&(p.hand.length||SLOTS.some(s=>p[s])))
      ??targets.find(p=>g.side_of(p)===g.side_of(a)&&p.judgment_cards?.length);
    if(target)return {material,target};
  }return null;
}
export const sgs_ai_jixi=(g,a)=>{const plan=sgs_ai_jixi_plan(g,a);return plan?sgs_resolve_jixi(g,a,plan.target,plan.material):Promise.resolve(false);};
export async function sgs_player_jixi(g,a,_fallback,args=[]){
  if(!sgs_jixi_available(g,a)){g.view.emit(`急袭：${sgs_jixi_unavailable_reason(g,a)}。`);return true;}
  const phase=a.play_phase_id??g.play_phase_event_counter,turn=g.turn_event_counter,form=rule_hero(a)?.id;
  const valid=()=>sgs_jixi_available(g,a)&&phase===(a.play_phase_id??g.play_phase_event_counter)&&turn===g.turn_event_counter&&form===rule_hero(a)?.id;
  let m=null;
  if(args.length){if(args.length===1&&pass(args[0]))return true;m=args.length===1?select(sgs_jixi_materials(g,a),args[0]):null;if(!m)return false;}
  while(!m&&valid()){
    const options=sgs_jixi_materials(g,a),answer=await g.view.ask_line('急袭：选择一张田当顺手牵羊使用（该田不再计算距离）',{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗田'}],
      meta:meta(g,a,SK.jixi,'jixi_material',{material_zones:['field'],post_material_distance:true,range_limit:1,
        field_previews:options.map(m=>({material_id:m.id,legal_targets:sgs_jixi_targets(g,a,m).map(p=>({seat:seat(g,p),distance:g.distance_between(a,p,{exclude_mountain_field:m.card})}))})),
      }),
    });if(pass(answer))return true;m=select(options,answer);
  }
  if(!m||!valid())return true;
  const target=await g.choose_card_target(a,sgs_jixi_targets(g,a,m),{card_name:'急袭·顺手牵羊',stage:'jixi_target',cancellable:true,source_skill_id:SK.jixi});
  if(target&&valid())await sgs_resolve_jixi(g,a,target,m);return true;
}

const slashOrigin=event=>event.kind==='sha'||Boolean(event.source_card&&is_sha_card(event.source_card))||event.damage_origin==='sha';
const beigeEligible=(g,a,event)=>own(g,a,SK.beige)&&event.damage>0&&event.dying_resolved===true&&slashOrigin(event)&&live(event.target);
export function sgs_ai_beige_decision(g,a,event){
  if(!beigeEligible(g,a,event))return false;
  // Only public teams/status inform this choice; never peek at judgment/decks.
  const friend=g.side_of(a)===g.side_of(event.target),source=event.source;
  return friend&&(!live(source)||g.side_of(a)!==g.side_of(source));
}
async function beigeDiscard(g,source,id,holder){
  let attempt=0;
  while(live(source)&&ongoing(g)){
    const options=sgs_mountain_discard_materials(g,source,{payment:false}),count=Math.min(2,options.length);if(!count)return 0;
    const chosen=options.length<=2?options:await chooseMaterials(g,source,options,count,SK.beige,'beige_source_discard',{mandatory:true,owner_seat:seat(g,holder)});if(!chosen)return 0;
    const valid=(allowed=chosen,guard=null)=>live(source)&&(guard?.blocked_materials.length||Math.min(2,sgs_mountain_discard_materials(g,source,{payment:false}).length)===count)&&allowed.every(m=>exact(sgs_mountain_discard_materials(g,source,{payment:false}),m));
    if(!valid())continue;
    const result=await g.public_card_loss(source,chosen,{to:'discard',visibility:'public',reason:'悲歌·梅花',action:'discard',source_skill:SK.beige,move_id:`${id}:source-discard:${++attempt}`,validate:valid});
    if(result?.committed)return result.moved_count??count;
    if(result?.blocked)return 0;
    if(valid())throw Error('悲歌强制弃牌未提交，禁止忽略该效果');
  }return 0;
}
/** Host global observer after every positive damage/rescue event. The event
 * carries original Slash provenance through chain/transfer (host M12 policy). */
export async function sgs_after_any_damage_resolved_beige(g,a,event={}){
  if(!beigeEligible(g,a,event)||!sgs_mountain_discard_materials(g,a).length)return false;
  const id=event.damage_event_id,request={owner:pid(g,a),target:pid(g,event.target),source:pid(g,event.source),damage:event.damage,kind:event.kind??null,card_use_id:event.card_use_id??null};
  const t=ticket(a,'beige',id,request,[event.target,event.source]);if(!t)return false;
  const form=rule_hero(a)?.id;let judgment=null;
  try{
    if(a.is_ai&&!sgs_ai_beige_decision(g,a,event)){t.finish();return false;}
    const options=sgs_mountain_discard_materials(g,a),chosen=await chooseMaterials(g,a,options,1,SK.beige,'beige_cost',{damage_event_id:id,injured_seat:seat(g,event.target),is_valid:()=>form===rule_hero(a)?.id&&beigeEligible(g,a,event)});
    if(!chosen){t.finish();return false;}
    requireMovement(g);requireMethods(g,'reveal_judgment','recover_hp','draw_cards','flip_general','finish_judgment_card');
    const result=await g.public_card_loss(a,chosen,{payment:true,to:'discard',visibility:'public',reason:'悲歌',action:'discard',source_skill:SK.beige,move_id:`beige:${JSON.stringify([pid(g,a),id])}:cost`,
      validate:()=>form===rule_hero(a)?.id&&beigeEligible(g,a,event)&&!!exact(sgs_mountain_discard_materials(g,a),chosen[0]),
      on_committed:cards=>{if(cards.length!==1||cards[0]!==chosen[0].card)throw Error('悲歌必须弃置选定的一张实体牌');t.receipt.committed=true;t.receipt.status='paid';},
    });
    if(!result?.committed){if(t.receipt.committed)throw Error('悲歌支付回执矛盾');t.finish();return false;}
    if(!t.receipt.committed)throw Error('悲歌支付遗漏 on_committed；禁止重付');
    // Recursive poison/equipment-loss/rescue must complete before judging. A
    // committed effect may survive skill loss, but never a finalized corpse.
    if(!live(a)||!live(event.target)||!ongoing(g)){t.finish();return true;}
    judgment=await g.reveal_judgment(event.target,'悲歌',{good_for:a,favorable:c=>{
      if(c.suit===CardSuit.HEART||c.suit===CardSuit.DIAMOND)return g.side_of(a)===g.side_of(event.target);
      if(!live(event.source))return false;
      return c.suit===CardSuit.SPADE&&event.source.face_orientation==='face_down'?g.side_of(a)===g.side_of(event.source):g.side_of(a)!==g.side_of(event.source);
    }});
    if(judgment){
      const suit=judgment.fixed_judgment_result?judgment.suit:(g.effective_suit?.(judgment,event.target,{judged_actor:event.target})??judgment.suit),branchId=`beige:${JSON.stringify([pid(g,a),id])}`;
      t.receipt.judgment_suit=suit;t.receipt.status='effect';
      if(suit===CardSuit.HEART&&live(event.target))t.receipt.recovered=await g.recover_hp(event.target,1,{source:a,source_skill:SK.beige,recovery_event_id:`${branchId}:heal`});
      else if(suit===CardSuit.DIAMOND&&live(event.target)){await g.draw_cards(event.target,2);t.receipt.drawn=2;}
      else if(suit===CardSuit.CLUB&&live(event.source))t.receipt.discarded=await beigeDiscard(g,event.source,branchId,a);
      else if(suit===CardSuit.SPADE&&live(event.source))t.receipt.flipped=await g.flip_general(event.source,{source_skill:SK.beige,event_id:`${branchId}:flip`});
    }
    t.finish();return true;
  }catch(error){t.fail(error);throw error;}finally{if(judgment)await g.finish_judgment_card(judgment);}
}
export const sgs_after_sha_damage_beige=sgs_after_any_damage_resolved_beige;

/** Called only for a FINAL death, before cleanup, with the actual cause. This
 * never fabricates a killer from historical attacks or ordinary HP loss. */
export async function sgs_before_death_duanchang(g,a,event={}){
  if(!a?.dead||event.owner_dead!==true||!owned(g,a,SK.duanchang))return false;
  if(event.death_cause&&event.death_cause.kind!=='damage')return false;
  const source=Object.hasOwn(event,'source')?event.source:event.killer??null;if(!source)return false;
  requireMethods(g,'remove_general_skills');
  const id=event.death_event_id??event.death_id;
  const t=ticket(a,'duanchang',id,{owner:pid(g,a),killer:pid(g,source)},[source]);if(!t)return false;
  try{
    t.receipt.committed=true;t.receipt.status='removing';
    const removed=await g.remove_general_skills(source,{source:a,source_skill:SK.duanchang,event_id:`duanchang:${JSON.stringify([pid(g,a),id])}`});
    t.receipt.removal_receipt=removed==null?null:JSON.parse(JSON.stringify(removed));t.finish();
    g.view.emit(`${a.name}触发断肠：${source.name}失去当前所有武将技能（装备技能保留）。`);return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_mountain_field_skill_definitions({SkillHooks,ActiveSkillDef}){
  const jixi=new ActiveSkillDef({skill_id:SK.jixi,hotkey:'q',button_label:'急袭',player:sgs_player_jixi,ai:sgs_ai_jixi,available:sgs_jixi_available,
    help_text:'凿险觉醒获得。出牌阶段不限次数，将一张田当顺手牵羊使用；先排除消耗的田再检查距离1，正常响应无懈可击。'});
  jixi.source_skill_id=SK.jixi;jixi.owns_target_selection=true;jixi.targets=sgs_jixi_targets;jixi.unavailable_reason=sgs_jixi_unavailable_reason;
  return {hooks:{[ID.dengai]:SkillHooks({after_cards_lost:[sgs_after_cards_lost_tuntian],on_prepare:[sgs_prepare_zaoxian],outgoing_distance:[sgs_tuntian_distance_modifier]}),
    [ID.caiwenji]:SkillHooks({after_any_damage_resolved:[sgs_after_any_damage_resolved_beige],before_death_commit:[sgs_before_death_duanchang]})},active:{[ID.dengai]:[jixi]}};
}

// Dynamic ownership overlays retain only hooks for their current source skill.
for(const [hook,source_skill_id] of [[sgs_after_cards_lost_tuntian,SK.tuntian],[sgs_tuntian_distance_modifier,SK.tuntian],
  [sgs_prepare_zaoxian,SK.zaoxian],[sgs_after_any_damage_resolved_beige,SK.beige],[sgs_before_death_duanchang,SK.duanchang]])hook.source_skill_id=source_skill_id;
