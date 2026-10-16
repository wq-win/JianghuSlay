/** 李典: complete mobile base 身份 packet, source snapshot 2026-10-15.
 * P0–P5 are explicit cross-game host policies, not current-client rulings.
 * Real draw entry precedes replacement; damage opportunities are per point.
 */
import {rule_hero} from './effective-hero.js';

export const SGS_YIJIANG_MORE_LIDIAN_RULE_IDS=Object.freeze({lidian:'sgs.adapted.base.hero.li-dian'});
export const SGS_YIJIANG_MORE_LIDIAN_SKILL_IDS=Object.freeze({xunxun:'sgs.xunxun',wangxi:'sgs.wangxi'});
const ID=SGS_YIJIANG_MORE_LIDIAN_RULE_IDS,SK=SGS_YIJIANG_MORE_LIDIAN_SKILL_IDS,FIELD='sgs_yijiang_more_lidian_state';
export const SGS_YIJIANG_MORE_LIDIAN_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P2','P3','P4','P5']),
  heroes:Object.freeze([Object.freeze({id:ID.lidian,name:'李典',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'P0 host full-HP initialization',gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.xunxun,SK.wangxi]),
    personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    [SK.xunxun]:'摸牌阶段开始时，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，将其余的牌置于牌堆底。',
    [SK.wangxi]:'当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以与该角色各摸一张牌。',
  }),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-170.html','https://wiki.biligame.com/msgs/李典','https://wiki.biligame.com/msgs/忘隙']),
  bwiki_revision:38079,
});
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const stable=id=>typeof id==='string'&&id.trim().length>0||Number.isSafeInteger(id)&&id>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,id)===true;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const meta=(g,a,id,stage,extra={})=>({skill:id===SK.xunxun?'恂恂':'忘隙',skill_id:id,stage,private_to:seat(g,a),...extra});
const selected=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const active=new WeakMap(),references=new WeakMap();
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`李典接入缺少 ${name}`);}
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||['xunxun','wangxi'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Li Dian skill state');
  return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('李典技能需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,xunxun:{},wangxi:{}};validateState(s);
  if(s.owner_id!==owner)throw Error('李典事务不能继承另一人物的状态');return s;
}
export const sgs_clone_yijiang_more_lidian_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
/** Completed receipts are idempotent; an interrupted coroutine must be restored
 * by the session input log, never by retrying effects against mutated state. */
function ticket(g,a,space,id,request,refs=[]){
  if(!stable(id))throw Error('李典技能需要稳定事件ID');
  const s=state(g,a),key=JSON.stringify(id),rk=`${space}:${key}`,old=s[space][key];
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一李典事件不能更换人物、实体或事实');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('李典事务中断；须恢复原协程或按输入日志重放'),{code:'SGS_YIJIANG_MORE_LIDIAN_REPLAY_REQUIRED'});
    return null;
  }
  const receipt=s[space][key]={event_id:id,request,status:'offered',committed:false};running.add(receipt);known.set(rk,refs);
  return {receipt,finish(){receipt.status='done';running.delete(receipt);},fail(error){receipt.status='failed';receipt.error=String(error?.message??error);running.delete(receipt);}};
}
function previous(g,a,space,id,request,refs=[]){
  if(!a?.[FIELD]?.[space]?.[JSON.stringify(id)])return false;
  ticket(g,a,space,id,request,refs);return true;
}
const drawWindow=(g,a,e)=>owned(g,a,SK.xunxun)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='draw'
  &&g.turn_actor===seat(g,a)&&stable(e.phase_event_id)&&e.actor===a&&e.turn_id===g.turn_event_counter
  &&!e.skipped&&!e.blocked&&!e.cancelled&&!e.closed&&!e.replaced&&!e.completed&&!a.skip_draw_stage&&!a.block_turn_draw;
export function sgs_xunxun_partition_valid(cards,top,bottom){
  return Array.isArray(cards)&&Array.isArray(top)&&Array.isArray(bottom)&&top.length===Math.min(2,cards.length)
    &&top.length+bottom.length===cards.length&&new Set([...top,...bottom]).size===cards.length&&[...top,...bottom].every(c=>cards.includes(c));
}
const cardId=(g,c,index)=>g.card_history_material_id?.(c)??c.physical_id??c.physicalCardId??`view:${index+1}`;
function returnCards(g,cards,top,bottom){
  if(cards.some(c=>g.processing_cards.filter(v=>v===c).length!==1||g.deck.draw_pile.includes(c)||g.deck.discard_pile?.includes(c)))
    throw Error('恂恂实体在选择期间已改变，须重放事务');
  for(const card of cards)g.processing_cards.splice(g.processing_cards.indexOf(card),1);
  // Array end is deck top. Both selections are FIRST-to-NEXT-DRAW sequences.
  g.deck.draw_pile.unshift(...[...bottom].reverse());g.deck.draw_pile.push(...[...top].reverse());
  for(const card of cards)g.copied_card_moved?.(card,'draw_pile');
}
/** New host hook. Do not install at before_draw_phase or before_normal_draw. */
export async function sgs_on_draw_phase_start_xunxun(g,a,_target,e={}){
  const id=e.phase_event_id,request={owner:pid(g,a),phase_event_id:id,turn_id:e.turn_id,actor:pid(g,e.actor)};
  if(previous(g,a,'xunxun',id,request,[e.actor]))return false;
  if(!drawWindow(g,a,e))return false;
  if(!g.deck||typeof g.deck.draw!=='function'||!Array.isArray(g.deck.draw_pile)||!Array.isArray(g.processing_cards))throw Error('恂恂需要真实牌堆与处理区');
  const bound=binding(g,a,SK.xunxun),t=ticket(g,a,'xunxun',id,request,[e.actor]),r=t.receipt;
  const valid=()=>drawWindow(g,a,e)&&e.phase_event_id===id&&e.turn_id===request.turn_id&&binding(g,a,SK.xunxun)===bound;
  try{
    if(!a.is_ai&&!await g.view.ask_confirm('恂恂：是否私下观看牌堆顶四张牌，将两张置顶、其余置底？',{player_id:seat(g,a),meta:meta(g,a,SK.xunxun,'xunxun_offer',{phase_event_id:id,count:4,top_count:2})})){
      r.declined=true;t.finish();return false;
    }
    if(!valid()){r.cancelled=true;t.finish();return false;}
    const cards=g.deck.draw(4);
    if(!Array.isArray(cards)||cards.length>4||cards.some(c=>!c||c.virtual)||new Set(cards).size!==cards.length)throw Error('恂恂牌堆包含无效实体');
    g.processing_cards.push(...cards);r.committed=true;r.viewed=true;r.status='ordering';r.actual_count=cards.length;
    r.viewed_card_ids=cards.map((c,i)=>cardId(g,c,i));
    if(r.viewed_card_ids.some(id=>!stable(id))||new Set(r.viewed_card_ids).size!==cards.length)throw Error('恂恂实体标识重复或无效');
    r.original_order=[...r.viewed_card_ids];r.selected_top=[];r.selected_bottom=[];
    let top=[],bottom=[],remaining=[...cards];const topCount=Math.min(2,cards.length);
    if(a.is_ai){top=cards.slice(0,topCount);bottom=cards.slice(topCount);remaining=[];}
    while(remaining.length&&valid()){
      const tray=top.length<topCount?'top':'bottom',options=remaining.map(card=>({id:`card:${cards.indexOf(card)+1}`,label:String(card),card}));
      const answer=await g.view.ask_line(`恂恂：选择第${(tray==='top'?top:bottom).length+1}张置于${tray==='top'?'牌堆顶（最先摸到）':'牌堆底（其余牌后先摸到）'}的牌`,{
        kind:'choice',player_id:seat(g,a),options:options.map(({id,label})=>({id,label})),
        meta:meta(g,a,SK.xunxun,`xunxun_${tray}_order`,{phase_event_id:id,tray,count:cards.length,top_count:topCount,bottom_count:cards.length-topCount,mandatory:true,
          preview:cards.map((card,index)=>({id:`card:${index+1}`,label:String(card)})),selected_top:top.map(c=>`card:${cards.indexOf(c)+1}`),selected_bottom:bottom.map(c=>`card:${cards.indexOf(c)+1}`),next_draw_direction:'first_selected',private_cards:true})});
      if(!valid())break;const choice=selected(options,answer);
      // Cancellation/duplicate/stale IDs cannot change the mandatory exact split.
      if(choice){(tray==='top'?top:bottom).push(choice.card);remaining.splice(remaining.indexOf(choice.card),1);
        r.selected_top=top.map(c=>r.viewed_card_ids[cards.indexOf(c)]);r.selected_bottom=bottom.map(c=>r.viewed_card_ids[cards.indexOf(c)]);}
    }
    if(!valid()||remaining.length){
      returnCards(g,cards,cards,[]);r.cancelled=true;r.restored_original=true;t.finish();return false;
    }
    if(!sgs_xunxun_partition_valid(cards,top,bottom))throw Error('恂恂必须恰好选择两张置顶，其余置底');
    r.selected_top=top.map(c=>r.viewed_card_ids[cards.indexOf(c)]);r.selected_bottom=bottom.map(c=>r.viewed_card_ids[cards.indexOf(c)]);
    r.status='returning';returnCards(g,cards,top,bottom);r.reordered=true;r.top_count=top.length;r.bottom_count=bottom.length;t.finish();
    g.view.emit(`${a.name}发动恂恂，将${top.length}张牌置于牌堆顶、${bottom.length}张置于牌堆底。`);return true;
  }catch(error){t.fail(error);throw error;}
}
function damageFacts(g,a,amount,other,e,direction){
  return {owner:pid(g,a),direction,source:pid(g,e.source),target:pid(g,e.target),other:pid(g,other),damage:e.damage,amount};
}
function damageWindow(g,a,amount,other,e,direction){
  return owned(g,a,SK.wangxi)&&live(other)&&a!==other&&ongoing(g)&&stable(e.damage_event_id)
    &&Number.isSafeInteger(e.damage)&&e.damage>0&&amount===e.damage&&e.dying_resolved===true&&!e.prevented&&!e.cancelled&&!e.closed
    &&e.kind!=='hp_loss'&&e.death_cause?.kind!=='hp_loss'&&e.source&&e.source!==e.target
    &&(direction==='source'?e.damage_window==='source_after_damage'&&e.source===a&&e.target===other:
      e.damage_window==='receiver_after_damage'&&e.target===a&&e.source===other);
}
export function sgs_ai_wangxi(g,a,other){
  // Counts, seats and allegiance only. Enemy participants remain legal for humans.
  return typeof g.side_of==='function'&&g.side_of(a)===g.side_of(other);
}
async function resolveWangxi(g,a,amount,other,e,direction){
  const id=e.damage_event_id,request=damageFacts(g,a,amount,other,e,direction),refs=[e.source,e.target,other];
  // A single owner cannot be both source and receiver of a qualifying event.
  if(previous(g,a,'wangxi',id,request,refs))return false;
  if(!damageWindow(g,a,amount,other,e,direction))return false;
  methods(g,'draw_cards','action_order');
  const bound=binding(g,a,SK.wangxi),t=ticket(g,a,'wangxi',id,request,refs),r=t.receipt;r.points=[];
  const valid=()=>damageWindow(g,a,amount,other,e,direction)&&e.damage_event_id===id&&binding(g,a,SK.wangxi)===bound
    &&JSON.stringify(damageFacts(g,a,amount,other,e,direction))===JSON.stringify(request);
  let activated=false;
  try{
    for(let index=0;index<amount&&valid();index++){
      const point={point:index+1,status:'offered',accepted:false,recipients:[]};r.points.push(point);r.status='offered';
      const accepted=a.is_ai?sgs_ai_wangxi(g,a,other):await g.view.ask_confirm(`忘隙：第${index+1}/${amount}点伤害，是否与你${direction==='source'?'伤害的':'受到其伤害的'}${other.name}各摸一张牌？`,{
        player_id:seat(g,a),meta:meta(g,a,SK.wangxi,'wangxi_offer',{damage_event_id:id,direction,point:index+1,damage:amount,other_seat:seat(g,other),allow_enemies:true,draw_count_each:1})});
      if(!valid()){point.status='cancelled';break;}
      if(!accepted){point.status='declined';continue;}
      const order=g.action_order().filter(p=>p===a||p===other);
      if(order.length!==2||new Set(order).size!==2)throw Error('忘隙需要包含双方的完整行动座次');
      point.accepted=true;point.recipient_ids=order.map(p=>pid(g,p));point.status='drawing';r.committed=true;r.status='drawing';activated=true;
      // Once accepted, ownership changes do not undo this point's draw. Death
      // or a closed match stops its remaining recipients and future offers.
      for(const recipient of order){
        if(!live(a)||!live(other)||!ongoing(g))break;
        const progress={player_id:pid(g,recipient),status:'started',drawn:null};point.recipients.push(progress);
        const cards=await g.draw_cards(recipient,1);progress.drawn=Array.isArray(cards)?cards.length:null;progress.status='done';
      }
      point.status=point.recipients.length===2&&point.recipients.every(p=>p.status==='done')?'done':'interrupted';
    }
    t.finish();return activated;
  }catch(error){t.fail(error);throw error;}
}
export const sgs_after_source_damage_wangxi=(g,a,amount,target,e={})=>resolveWangxi(g,a,amount,target,e,'source');
export const sgs_after_damage_resolved_wangxi=(g,a,amount,source,e={})=>resolveWangxi(g,a,amount,source,e,'receiver');
/** Pure public projection: never serialize private staged IDs, order or faces. */
export function sgs_yijiang_more_lidian_public_state(a){
  if(!a?.[FIELD])return {xunxun_events:[],wangxi_events:[]};const s=validateState(a[FIELD]);
  return {xunxun_events:Object.values(s.xunxun).map(r=>({phase_event_id:r.event_id,status:r.status,committed:r.committed,
    declined:r.declined===true,cancelled:r.cancelled===true,reordered:r.reordered===true,top_count:r.top_count??0,bottom_count:r.bottom_count??0})),
  wangxi_events:Object.values(s.wangxi).map(r=>({damage_event_id:r.event_id,status:r.status,committed:r.committed,direction:r.request.direction,other_id:r.request.other,
    points:(r.points??[]).map(p=>({point:p.point,status:p.status,accepted:p.accepted,recipients:p.recipients.map(q=>({...q}))}))}))};
}
export function sgs_yijiang_more_lidian_skill_definitions({SkillHooks}){
  return {hooks:{[ID.lidian]:SkillHooks({on_draw_phase_start:[sgs_on_draw_phase_start_xunxun],after_source_damage:[sgs_after_source_damage_wangxi],after_damage_resolved:[sgs_after_damage_resolved_wangxi]})},active:{}};
}
sgs_on_draw_phase_start_xunxun.source_skill_id=SK.xunxun;
sgs_after_source_damage_wangxi.source_skill_id=SK.wangxi;
sgs_after_damage_resolved_wangxi.source_skill_id=SK.wangxi;
