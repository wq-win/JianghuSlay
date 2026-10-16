/** Mainland-mobile classic identity 孟获 / 祝融, source snapshot 2026-10-15.
 * Complete intrinsic skill packets; current mobile-client parity is unverified.
 * Explicit F1/F4–F10 host policies: docs/sgs-forest/assault-integration-contract.md.
 * This module neither registers heroes nor patches Game prototypes.
 */
import {CardType,CardSuit,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';
import {printed_card_fields} from './card-face-projection.js';
import {pindian_hand_options,pindian_rank,resolve_pindian} from './pindian.js';

export const SGS_FOREST_ASSAULT_RULE_IDS=Object.freeze({menghuo:'sgs.adapted.base.hero.meng-huo',zhurong:'sgs.adapted.base.hero.zhu-rong'});
export const SGS_FOREST_ASSAULT_SKILL_IDS=Object.freeze({huoshou:'sgs.huoshou',zaiqi:'sgs.zaiqi',juxiang:'sgs.juxiang',lieren:'sgs.lieren'});
export const SGS_FOREST_ASSAULT_SOURCE=Object.freeze({
  variant:'mainland-mobile-classic-identity-forest-catalog-2026-10-15',snapshot_date:'2026-10-15',selected_mode:'身份',
  current_client_rules_verified:false,current_client_hp_verified:false,host_policy_ids:Object.freeze(['F1','F4','F5','F6','F7','F8','F9','F10']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_FOREST_ASSAULT_RULE_IDS.menghuo,max_hp:4,starting_hp:4,gender:'male',source_faction:'蜀',skill_ids:Object.freeze(['sgs.huoshou','sgs.zaiqi']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FOREST_ASSAULT_RULE_IDS.zhurong,max_hp:4,starting_hp:4,gender:'female',source_faction:'蜀',skill_ids:Object.freeze(['sgs.juxiang','sgs.lieren']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-47.html','https://www.sanguosha.cn/pc/hero-detail-46.html',
    'https://www.sanguosha.cn/pc/guide-info-131.html','https://www.sanguosha.cn/pc/guide-info-137.html',
    'https://wiki.biligame.com/msgs/孟获','https://wiki.biligame.com/msgs/祝融']),
});
export const SGS_FOREST_ASSAULT_MECHANICS=Object.freeze({
  version:1,whole_template_copy:true,actor_state_field:'sgs_forest_assault_state',game_state_field:'sgs_forest_aoe_state',
  reset_on_skill_loss:false,reset_on_reacquisition:false,ordinary_sha_quota_unchanged:true,
  aoe_card_alias:Object.freeze({source:'南蛮入侵',host:'烽火狼烟',all_other_living_seats:true,nature:'normal'}),
  huoshou:'card-user-preserving-use-scoped-damage-source',zaiqi:'whole-genuine-draw-phase-replacement',
  juxiang:'after-entire-use-still-unclaimed-physical-materials',lieren:'after-direct-sha-damage-shared-pindian',
});
const ID=SGS_FOREST_ASSAULT_RULE_IDS,SK=SGS_FOREST_ASSAULT_SKILL_IDS;
const OWNER={[SK.huoshou]:ID.menghuo,[SK.zaiqi]:ID.menghuo,[SK.juxiang]:ID.zhurong,[SK.lieren]:ID.zhurong};
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const labels={weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'};
const live=a=>Boolean(a?.alive&&!a.dead&&a.hp>0);
const pid=(g,a)=>g.player_id?.(a)??g.seat_of(a);
const key=v=>JSON.stringify(v);
const stable=v=>typeof v==='string'&&v.length>0||Number.isSafeInteger(v)&&v>=0;
const own=(a,skill)=>{
  if(!live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
  const skills=a.effective_skill_ids??rule_hero(a)?.skill_ids;
  return skills?skills.includes(skill):rule_hero(a)?.id===OWNER[skill];
};
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const maxHP=(g,a)=>g.effective_max_hp?.(a)??rule_hero(a)?.max_hp;
const print=card=>printed_card_fields(card);
const allCards=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),
  ...g.all_players().flatMap(a=>[...a.hand,...a.judgment_cards,...slots.map(s=>a[s]).filter(Boolean)])];
const physicalId=(g,c)=>g.card_history_material_id(c);
const binding=(g,id)=>g.card_history_materials?.find(row=>row.id===id)?.card??null;
function uniquePhysical(g,c){
  if(!c||c.virtual)return false;const id=c.physical_id??c.physicalCardId??null;
  return allCards(g).filter(x=>x===c||id!==null&&(x.physical_id??x.physicalCardId)===id).length===1;
}
const requireMovement=g=>{if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('林包需要 public_card_loss 的 validate / on_committed 原子移牌边界');};
function actorState(a){
  const s=a.sgs_forest_assault_state??={version:1,zaiqi:{},lieren:{}};
  if(s.version!==1||['zaiqi','lieren'].some(n=>!s[n]||typeof s[n]!=='object'||Array.isArray(s[n])))throw Error('Invalid forest assault actor state');
  return s;
}
function aoeState(g){
  const s=g.sgs_forest_aoe_state??={version:1,uses:{}};
  if(s.version!==1||!s.uses||typeof s.uses!=='object'||Array.isArray(s.uses))throw Error('Invalid forest AOE state');
  return s;
}
export const sgs_is_nanman=card=>card?.type===CardType.SCROLL&&['烽火狼烟','南蛮入侵'].includes(card.name);
/** Effect immunity only: redirected damage from another target still applies. */
export function sgs_forest_nanman_immunity(g,a,event={}){
  if(event.target!==a||!sgs_is_nanman(event.card??event.source_card))return false;
  const skill=own(a,SK.huoshou)?SK.huoshou:own(a,SK.juxiang)?SK.juxiang:null;if(!skill)return false;
  g.view.emit(`${a.name}的${skill===SK.huoshou?'祸首':'巨象'}令南蛮入侵（烽火狼烟）对此目标无效。`,{
    event_type:'skill_immunity',skill_id:skill,card_use_id:event.card_use_id??null,target_id:pid(g,a),
  });
  return true;
}
/** One declaration, before the first target. Stable F10 action order is a
 * declared cross-game policy; neither user identity nor use history is rewritten.
 * Physical materials MUST be the exact use's tracked processing objects. */
export function sgs_forest_begin_aoe(g,event={}){
  if(!sgs_is_nanman(event.source_card??event.card))return null;
  const user=event.card_user??event.actor,id=event.card_use_id;
  if(!stable(id)||!g.all_players().includes(user))throw Error('祸首/巨象需要稳定的用牌ID与真实使用者');
  const materials=event.physical_cards??g.physical_card_materials?.(event.source_card??event.card)??[];
  if(!Array.isArray(materials)||new Set(materials).size!==materials.length||materials.some(c=>!uniquePhysical(g,c)||!g.processing_cards.includes(c)))throw Error('南蛮用牌材料必须是本次处理区内唯一实体牌');
  const ids=materials.map(c=>physicalId(g,c)),userId=pid(g,user),s=aoeState(g),prior=s.uses[key(id)];
  if(prior){
    if(prior.card_user_id!==userId||JSON.stringify(prior.material_ids)!==JSON.stringify(ids))throw Error('同一南蛮用牌ID不能替换使用者或材料');
    return prior;
  }
  const holders=g.action_order().filter(a=>a!==user&&own(a,SK.huoshou));
  const r={card_use_id:id,card_user_id:userId,status:'resolving',material_ids:ids,disqualified:{},claims:[],
    source_override:holders.length>0,source_id:holders.length?pid(g,holders.at(-1)):userId,
    huoshou_holder_ids:holders.map(a=>pid(g,a)),source_deceased:false,target_ids:(event.targets??[]).map(a=>pid(g,a))};
  s.uses[key(id)]=r;
  if(holders.length)g.view.emit(`${user.name}使用南蛮入侵（烽火狼烟）；祸首令${holders.at(-1).name}成为本次伤害来源。`,{
    event_type:'huoshou_source',skill_id:SK.huoshou,card_use_id:id,card_user_id:userId,damage_source_id:r.source_id,
  });
  return r;
}
/** Called for every real move by the host, BEFORE a copied face may reset.
 * A material that left this use's processing can never become claimable again,
 * even if another owner subsequently discards/reuses it into processing. */
export function sgs_forest_material_moved(g,card,to,recipient=null){
  if(to==='processing')return;
  const id=g.card_history_materials?.find(row=>row.card===card)?.id;if(id==null)return;
  for(const r of Object.values(g.sgs_forest_aoe_state?.uses??{})){
    if(['resolving','completing'].includes(r.status)&&r.material_ids.includes(id)&&!Object.hasOwn(r.disqualified,id))r.disqualified[id]={to,recipient_id:recipient?pid(g,recipient):null};
  }
}
/** Check live source immediately before each direct damage branch. Its identity
 * remains fixed through nested damage transfer; losing the skill does not undo it.
 * Final death makes subsequent damage sourceless, never reverts to card user. */
export function sgs_forest_aoe_damage_source(g,id,originalUser){
  const r=g.sgs_forest_aoe_state?.uses?.[key(id)];if(!r||!r.source_override)return originalUser??null;
  if(r.source_deceased)return null;
  const source=g.all_players().find(a=>pid(g,a)===r.source_id);
  if(!source||source.dead){r.source_deceased=true;return null;}
  return live(source)?source:null;
}
/** Only the whole-use completed boundary can claim, before normal cleanup.
 * Duplicate/rehydrated callbacks do not re-run gains. A pending receipt requires
 * input-journal replay, never a second material claim. */
export async function sgs_forest_finish_aoe(g,event={}){
  const r=g.sgs_forest_aoe_state?.uses?.[key(event.card_use_id)];
  if(!r||event.completed!==true||r.status!=='resolving')return [];
  requireMovement(g);r.status='completing';const gained=[];
  try{
    for(const a of g.action_order()){
      if(!own(a,SK.juxiang))continue;
      if(pid(g,a)===r.card_user_id){r.claims.push({owner_id:pid(g,a),material_ids:[],status:'unavailable',reason:'self_used'});continue;}
      const eligible=()=>r.material_ids.filter(id=>!Object.hasOwn(r.disqualified,id)).map(id=>({id,card:binding(g,id)}))
        .filter(({card})=>card&&g.processing_cards.includes(card)&&uniquePhysical(g,card));
      const cards=eligible();
      if(!cards.length){
        const reason=!r.material_ids.length?'material_free':r.material_ids.every(id=>Object.hasOwn(r.disqualified,id))?'previously_claimed':'not_in_processing';
        r.claims.push({owner_id:pid(g,a),material_ids:[],status:'unavailable',reason});
        g.view.emit(`${a.name}的巨象未获得牌：${{material_free:'此用牌没有实体材料',previously_claimed:'材料已离开本次用牌处理区',not_in_processing:'材料已不在本次处理区'}[reason]}。`,{skill_id:SK.juxiang,card_use_id:r.card_use_id,reason});continue;
      }
      const claim={owner_id:pid(g,a),material_ids:cards.map(x=>x.id),status:'reserved'};r.claims.push(claim);
      const moved=await g.public_card_loss(null,cards.map(({card})=>({zone:'processing',index:g.processing_cards.indexOf(card),card})),{
        to:'hand',recipient:a,reason:'巨象',source_skill:SK.juxiang,source_skill_id:SK.juxiang,source_zone:'processing',
        visibility:'public',action:'obtain',poison_exempt:true,move_id:`sgs.juxiang:${key(r.card_use_id)}:${pid(g,a)}`,
        validate:()=>own(a,SK.juxiang)&&cards.every(row=>eligible().some(x=>x.id===row.id&&x.card===row.card)),
        on_committed:(physical,movement)=>{
          if(physical.length!==cards.length||physical.some((c,i)=>c!==cards[i].card))throw Error('巨象移牌材料不匹配');
          claim.status='committed';claim.move_id=movement.move_id;
          for(const row of cards)r.disqualified[row.id]={to:'hand',recipient_id:pid(g,a)};
        },
      });
      claim.status=moved.committed?'done':'unavailable';
      if(moved.committed){gained.push(...cards.map(x=>x.card));g.view.emit(`${a.name}发动巨象，在整张南蛮入侵结算结束后获得${cards.length}张实体材料。`,{skill_id:SK.juxiang,card_use_id:r.card_use_id,material_ids:claim.material_ids});}
    }
    r.status='done';return gained;
  }catch(error){r.status='failed';r.error=String(error?.message??error);throw error;}
}

// 再起 --------------------------------------------------------------------
const drawKey=(g,a,e)=>stable(e?.phase_event_id)?key([pid(g,a),e.phase_event_id]):null;
function zaiqiWindow(g,a,e){
  return own(a,SK.zaiqi)&&a.hp<maxHP(g,a)&&g.turn_phase==='draw'&&g.turn_actor===g.seat_of(a)
    &&e?.actor===a&&stable(e.phase_event_id)&&e.turn_id===g.turn_event_counter&&!e.skipped&&!e.replaced&&!e.closed
    &&!a.skip_draw_stage&&!a.block_turn_draw;
}
export const sgs_zaiqi_available=(g,a,e={})=>zaiqiWindow(g,a,e)&&!a.sgs_forest_assault_state?.zaiqi?.[drawKey(g,a,e)];
/** Public-information decision, never peek at deck order or other hand faces. */
export const sgs_ai_zaiqi=(g,a)=>maxHP(g,a)-a.hp>=2||a.hp<=1;
export async function sgs_replace_draw_zaiqi(g,a,_target,event={}){
  const existing=a?.sgs_forest_assault_state?.zaiqi?.[drawKey(g,a,event)];
  if(existing){
    if(existing.turn_id!==event.turn_id||event.actor!==a)throw Error('同一再起阶段ID不能替换回合或人物');
    if(existing.status==='done')return true;
    if(existing.status==='passed')return false;
    throw Object.assign(Error('再起阶段事务尚未完成；须恢复原协程或从输入日志重放，不能补摸普通牌或重复亮牌'),{code:'SGS_FOREST_ASSAULT_REPLAY_REQUIRED'});
  }
  if(!sgs_zaiqi_available(g,a,event))return false;
  requireMovement(g);if(typeof g.recover_hp!=='function')throw Error('再起需要真实 recover_hp 内核');
  const id=drawKey(g,a,event),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const receipt={phase_event_id:event.phase_event_id,turn_id:event.turn_id,status:'offered',committed:false};actorState(a).zaiqi[id]=receipt;
  const accepted=a.is_ai?sgs_ai_zaiqi(g,a):await g.view.ask_confirm('再起：是否替换整个摸牌阶段？亮出已损失体力数的牌，红桃回复体力并弃置，其余获得。',{
    player_id:g.seat_of(a),meta:{skill:'再起',skill_id:SK.zaiqi,stage:'zaiqi_start',phase_event_id:event.phase_event_id,replaces_entire_draw_phase:true},
  });
  if(!accepted||!zaiqiWindow(g,a,event)||form!==rule_hero(a)?.id||turn!==g.turn_event_counter){receipt.status='passed';return false;}
  receipt.committed=true;event.replaced=true;receipt.status='revealing';receipt.x=Math.max(0,Math.floor(maxHP(g,a)-a.hp));
  let revealed=[];
  try{
    // Deck.draw is physical extraction only. Never use Game.draw_cards or the
    // draw-only poison interception path; all cards are unowned in processing.
    revealed=g.deck.draw(receipt.x);g.processing_cards.push(...revealed);
    if(revealed.some(c=>!uniquePhysical(g,c)))throw Error('再起亮出的实体牌区域不唯一');
    receipt.material_ids=revealed.map(c=>physicalId(g,c));
    const hearts=revealed.filter(c=>print(c).suit===CardSuit.HEART),rest=revealed.filter(c=>print(c).suit!==CardSuit.HEART);
    receipt.hearts=hearts.length;receipt.status='recovering';
    g.view.emit(`${a.name}发动再起，亮出${revealed.length}张牌：${revealed.map(String).join('、')||'无牌'}。`,{
      event_type:'zaiqi_reveal',skill_id:SK.zaiqi,phase_event_id:event.phase_event_id,material_ids:receipt.material_ids,x:receipt.x,hearts:hearts.length,
    });
    receipt.recovered=hearts.length&&live(a)?await g.recover_hp(a,hearts.length,{source:a,source_skill:SK.zaiqi,recovery_event_id:`sgs.zaiqi:${id}:recover`}):0;
    const move=async(cards,to)=>{
      const selected=cards.filter(c=>g.processing_cards.includes(c)&&uniquePhysical(g,c));if(!selected.length||to==='hand'&&!live(a))return;
      await g.public_card_loss(null,selected.map(card=>({zone:'processing',index:g.processing_cards.indexOf(card),card})),{
        to,recipient:to==='hand'?a:null,reason:'再起',source_skill:SK.zaiqi,source_skill_id:SK.zaiqi,source_zone:'processing',
        visibility:'public',action:to==='hand'?'obtain':'discard',poison_exempt:true,move_id:`sgs.zaiqi:${id}:${to}`,
        validate:()=>to!=='hand'||live(a),on_committed:cards=>{if(to==='hand')receipt.obtained_ids=cards.map(c=>physicalId(g,c));},
      });
    };
    receipt.status='discarding_hearts';await move(hearts,'discard');receipt.status='obtaining';await move(rest,'hand');receipt.status='done';return true;
  }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
  finally{for(const card of revealed)if(g.processing_cards.includes(card))g.finish_processing_card(card);}
}

// 烈刃 --------------------------------------------------------------------
/** Blind H / visible E only; no judgment cards, opponent face reads or ID/RNG
 * allocation while constructing options. Source private ownership stays intact. */
export function sgs_lieren_options(_g,target){
  if(!live(target))return [];
  return [...target.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`暗置手牌 ${index+1}`,hidden:true})),
    ...slots.filter(slot=>target[slot]).map(slot=>({id:`eq:${slot}`,zone:slot,index:0,card:target[slot],label:`${labels[slot]}：${target[slot]}`,hidden:false}))];
}
function lierenWindow(g,a,e){
  return own(a,SK.lieren)&&e?.source===a&&e.card_user===a&&live(e.target)&&e.target!==a&&is_sha_card(e.source_card??{})
    &&e.kind==='sha'&&Number.isInteger(e.damage)&&e.damage>0&&e.dying_resolved===true&&stable(e.damage_event_id)
    &&!e.cancelled&&!e.closed&&!e.response_only&&!e.chain_transfer&&!e.transferred&&!['chain','transfer','reflect'].includes(e.method)
    &&(!e.direct_target||e.direct_target===e.target)&&(!e.sha_target||e.sha_target===e.target)
    &&pindian_hand_options(a).length>0&&e.target.hand.length>0;
}
export const sgs_lieren_available=(g,a,e={})=>lierenWindow(g,a,e)&&!a.sgs_forest_assault_state?.lieren?.[key(e.damage_event_id)];
/** Own highest legal rank + public side/counts/equipment only. */
export function sgs_ai_lieren_plan(g,a,target){
  if(!live(a)||!live(target)||g.side_of(a)===g.side_of(target)||!target.hand.length)return null;
  const card=pindian_hand_options(a).filter(m=>!(print(m.card).type===CardType.POISON&&g.youjian_events_enabled?.()
    &&a.hp<=1+(g.youjian_poison_armor_snapshot?.(a)?1:0)))
    .sort((x,y)=>pindian_rank(y.card)-pindian_rank(x.card)||x.index-y.index)[0]?.card;
  return card&&pindian_rank(card)>=8?{card}:null;
}
export function sgs_ai_lieren_reward(g,a,target){
  const options=sgs_lieren_options(g,target),equipment=options.filter(o=>o.zone!=='hand');
  return equipment.find(o=>o.zone==='armor')??equipment.find(o=>o.zone==='weapon')??equipment[0]??options[0]??null;
}
async function lierenReward(g,a,target,result,receipt){
  receipt.outcome=result.outcome;receipt.status='result';
  if(!result.won||!live(a)||!live(target))return;
  while(live(a)&&live(target)){
    const options=sgs_lieren_options(g,target);if(!options.length)return;
    let selected;
    if(a.is_ai)selected=sgs_ai_lieren_reward(g,a,target);
    else{
      const answer=await g.view.ask_line(`烈刃获胜：获得${target.name}的一张手牌或装备（手牌暗选）`,{
        kind:'choice',player_id:g.seat_of(a),options:options.map(({id,label,hidden})=>({id,label,hidden})),
        meta:{skill:'烈刃',skill_id:SK.lieren,stage:'lieren_obtain',compare_id:result.compare_id,target_seat:g.seat_of(target),hidden_hand:true,mandatory:true,cancellable:false},
      });
      selected=select(options,answer);if(!selected)continue;
    }
    if(!selected||!live(a)||!live(target))return;
    const current=sgs_lieren_options(g,target).find(o=>o.card===selected.card&&o.id===selected.id&&o.zone===selected.zone&&o.index===selected.index);
    if(!current)continue;
    receipt.status='obtaining';receipt.attempts=(receipt.attempts??0)+1;
    const moved=await g.public_card_loss(target,[current],{to:'hand',recipient:a,reason:'烈刃',source:a,source_skill:SK.lieren,source_skill_id:SK.lieren,
      action:'obtain',visibility:current.zone==='hand'?'private':'public',move_id:`${receipt.compare_id}:obtain:${receipt.attempts}`,
      validate:()=>live(a)&&live(target)&&sgs_lieren_options(g,target).some(o=>o.card===current.card&&o.zone===current.zone&&o.index===current.index),
      on_committed:cards=>{receipt.obtained_id=physicalId(g,cards[0]);receipt.obtained_zone=current.zone;},
    });
    if(moved.committed){g.view.emit(`${a.name}发动烈刃，拼点获胜后获得${target.name}的一张牌。`);return;}
    // Invalid physical duplicate is a corruption, not a loopable free attempt.
    if(sgs_lieren_options(g,target).some(o=>o.card===current.card&&o.zone===current.zone&&o.index===current.index))return;
  }
}
/** after_any_sha_damage already follows damage/rescue and receiver triggers.
 * One opportunity per positive damage EVENT, never one per HP or play phase. */
export async function sgs_after_sha_damage_lieren(g,a,event={}){
  if(!sgs_lieren_available(g,a,event))return false;
  requireMovement(g);
  if(resolve_pindian.result_callback_before_cleanup!==true)throw Error('烈刃需要 V23 拼点 on_result：失牌/救援后、清理拼点牌前');
  const target=event.target,id=key(event.damage_event_id),form=rule_hero(a)?.id;
  const receipt={damage_event_id:event.damage_event_id,target_id:pid(g,target),status:'offered',committed:false,
    compare_id:`sgs.lieren:${pid(g,a)}:${id}`};actorState(a).lieren[id]=receipt;
  const plan=a.is_ai?sgs_ai_lieren_plan(g,a,target):null;
  const accepted=a.is_ai?Boolean(plan):await g.view.ask_confirm(`烈刃：是否与受到此杀伤害的${target.name}拼点？获胜可获得其一张手牌或装备。`,{
    player_id:g.seat_of(a),meta:{skill:'烈刃',skill_id:SK.lieren,stage:'lieren_start',damage_event_id:event.damage_event_id,target_seat:g.seat_of(target)},
  });
  if(!accepted||!lierenWindow(g,a,event)||rule_hero(a)?.id!==form){receipt.status='passed';return false;}
  try{
    receipt.status='comparing';
    const result=await resolve_pindian(g,a,target,{compare_id:receipt.compare_id,disposition:'discard',reason:'烈刃',source_skill_id:SK.lieren,initiator_card:plan?.card??null,
      validate:()=>lierenWindow(g,a,event)&&rule_hero(a)?.id===form,
      dependencies:{on_reveal:()=>{receipt.committed=true;receipt.status='committed';}},
      on_result:result=>lierenReward(g,a,target,result,receipt),
    });
    receipt.status=result.committed?'done':'unavailable';return Boolean(result.committed);
  }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
}

export function sgs_forest_assault_skill_definitions({SkillHooks}){
  return {hooks:{
    [ID.menghuo]:SkillHooks({before_trick_target_nullification:[sgs_forest_nanman_immunity],replace_draw_phase:[sgs_replace_draw_zaiqi]}),
    [ID.zhurong]:SkillHooks({before_trick_target_nullification:[sgs_forest_nanman_immunity],after_any_sha_damage:[sgs_after_sha_damage_lieren]}),
  },active:{}};
}
