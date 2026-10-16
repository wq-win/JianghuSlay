/** Mainland-mobile base identity 夏侯渊 / 黄忠. Current-client parity is not
 * claimed. Host phase replacement and all-target designation contracts are
 * documented in docs/sgs-wind/speed-bow-implementation.md. No name dispatch. */
import {Card,CardType,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_WIND_SPEED_BOW_RULE_IDS=Object.freeze({xiahouyuan:'sgs.adapted.base.hero.xia-hou-yuan',huangzhong:'sgs.adapted.base.hero.huang-zhong'});
export const SGS_WIND_SPEED_BOW_SKILL_IDS=Object.freeze({shensu:'sgs.shensu',liegong:'sgs.liegong'});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const equipmentTypes=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const live=p=>Boolean(p?.alive&&p.hp>0);
const own=(a,skill)=>{
  if(!live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
  const ids=a.effective_skill_ids??rule_hero(a)?.skill_ids;
  return ids?ids.includes(skill):rule_hero(a)?.id===SGS_WIND_SPEED_BOW_RULE_IDS[skill==='sgs.shensu'?'xiahouyuan':'huangzhong'];
};
const seat=(g,p)=>g.seat_of(p);
const identity=(g,p)=>g.player_id?.(p)??seat(g,p);
const continuing=g=>typeof g.resolution_should_continue==='function'?g.resolution_should_continue():typeof g.match_should_continue!=='function'||g.match_should_continue();
const pass=v=>['pass','cancel','0','n'].includes(String(v));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const state=g=>{const s=g.sgs_wind_state??={version:1};s.shensu??={};s.liegong??={};return s;};
const phaseId=event=>event?.phase_event_id??event?.event_id??null;
const shensuKey=(g,a,branch,event)=>JSON.stringify([identity(g,a),phaseId(event),branch]);
const exact=(options,m)=>options.find(c=>c.card===m?.card&&c.zone===m.zone&&c.id===m.id&&c.index===m.index);
function uniquePhysical(g,card){
  if(!card||card.virtual)return false;
  const id=card.physical_id??card.physicalCardId??null;
  const all=[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
    ...g.all_players().flatMap(p=>[...p.hand,...(p.judgment_cards??[]),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...slots.map(s=>p[s]).filter(Boolean)])];
  return all.filter(c=>c===card||id!==null&&(c.physical_id??c.physicalCardId)===id).length===1;
}
function phaseWindow(g,a,branch,event){
  return (branch===1||branch===2)&&phaseId(event)!=null&&!event?.closed&&own(a,'sgs.shensu')&&continuing(g)
    &&g.turn_actor===seat(g,a)&&g.turn_phase===(branch===1?'before_judgment':'before_play')
    &&!(branch===1?a.skip_judgment_stage:a.skip_play_stage)
    &&!g.response_stack?.length&&!g.card_history_stack?.length&&!g.damage_stack?.length&&!g.judgment_stack?.length;
}
/** Pure options: no receipt allocation, ID mutation, hidden faces, or RNG. */
export const sgs_shensu_materials=(g,a)=>live(a)?g.skill_material_options(a).filter(m=>!m.card.virtual&&equipmentTypes.has(m.card.type)&&(m.zone==='hand'||slots.includes(m.zone))):[];
export const sgs_shensu_targets=(g,a)=>live(a)&&!a.prison_no_sha?g.all_players().filter(p=>live(p)&&p!==a&&g.can_sha_target(a,p,{allow_allies:true})):[];
export function sgs_shensu_available(g,a,branch,event){
  return phaseWindow(g,a,branch,event)&&!g.sgs_wind_state?.shensu?.[shensuKey(g,a,branch,event)]
    &&sgs_shensu_targets(g,a).length>0&&(branch===1||sgs_shensu_materials(g,a).length>0);
}
export const sgs_shensu_virtual_sha=()=>new Card('杀',CardType.SHA,{virtual:true,materials:[],suit:null,color:null,rank:null,
  source_skill:'sgs.shensu',source_skill_id:'sgs.shensu',source_game:'三国杀',source_rule_id:SGS_WIND_SPEED_BOW_RULE_IDS.xiahouyuan});
const shensuMeta=(g,a,branch,event,stage,extra={})=>({skill:'神速',skill_id:'sgs.shensu',stage,branch,phase_event_id:phaseId(event),...extra});
/** The phase replacement and discard commit together; loss effects finish
 * before an actual zero-material USE. The paid card is never SHA material. */
export async function sgs_resolve_shensu(g,a,branch,event,target,material=null,offeredReceipt=null){
  if(!phaseWindow(g,a,branch,event)||!sgs_shensu_targets(g,a).includes(target))return false;
  const key=shensuKey(g,a,branch,event),existing=g.sgs_wind_state?.shensu?.[key];
  if(existing&&(existing!==offeredReceipt||existing.status!=='offered'))return false;
  const current=branch===2?exact(sgs_shensu_materials(g,a),material):null;
  if(branch===2&&(!current||!uniquePhysical(g,current.card)))return false;
  const turn=g.turn_event_counter,form=rule_hero(a)?.id;
  const receipt=offeredReceipt??{phase_event_id:phaseId(event),branch,owner_id:identity(g,a),status:'offered'};
  state(g).shensu[key]=receipt;receipt.target_id=identity(g,target);receipt.status='reserved';
  const valid=()=>phaseWindow(g,a,branch,event)&&g.turn_event_counter===turn&&rule_hero(a)?.id===form
    &&state(g).shensu[key]===receipt&&receipt.status==='reserved'&&sgs_shensu_targets(g,a).includes(target)
    &&(branch===1||!!exact(sgs_shensu_materials(g,a),current)&&uniquePhysical(g,current.card));
  try{
    if(branch===1){
      if(!valid()){receipt.status='cancelled';return false;}
      a.skip_judgment_stage=true;a.skip_draw_stage=true;g.note_phase_skip?.(a,'judgment','神速','sgs.shensu');g.note_phase_skip?.(a,'draw','神速','sgs.shensu');receipt.status='committed';
    }else{
      receipt.cost_id=g.card_history_material_id(current.card);receipt.cost_zone=current.zone;
      const paid=await g.public_card_loss(a,[current],{payment:true,to:'discard',reason:'神速',visibility:'public',action:'discard',source_skill:'sgs.shensu',
        validate:valid,on_committed:(cards,movement)=>{
          if(cards.length!==1||cards[0]!==current.card)throw Error('神速必须提交一张选定装备实体成本');
          a.skip_play_stage=true;g.note_phase_skip?.(a,'play','神速','sgs.shensu');receipt.status='committed';receipt.move_id=movement.move_id;
        }});
      if(!paid?.committed){receipt.status='cancelled';return false;}
    }
    // No refund if loss/leave hooks end the opportunity. A vanished target is
    // never replaced and a dead actor never begins a new card use.
    if(!live(a)||!continuing(g)||!sgs_shensu_targets(g,a).includes(target)){receipt.status='ended';return true;}
    g.view.emit(`${a.name}发动神速${branch===1?'，跳过判定和摸牌阶段':'，弃置装备并跳过出牌阶段'}。`);
    const result=await g.use_sha(a,target,'神速·杀',{source_card:sgs_shensu_virtual_sha(),forced:true,ignore_distance:true,
      source_last_hand:false,source_skill:'sgs.shensu',use_provenance:{kind:'virtual',source_skill:'sgs.shensu',source_skill_id:'sgs.shensu'}});
    receipt.card_use_id=result?.card_use_id??null;receipt.status='ended';return true;
  }catch(error){receipt.status=receipt.status==='reserved'?'failed_before_commit':'failed_after_commit';throw error;}
}
/** AI preference only. It sees its own costs and public opposing counts/HP;
 * human legal target/material lists remain unrestricted by team or value. */
export function sgs_ai_shensu_choice(g,a,branch,event){
  if(!sgs_shensu_available(g,a,branch,event))return null;
  const target=sgs_shensu_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a))
    .sort((x,y)=>x.hp-y.hp||x.hand.length-y.hand.length)[0];
  if(!target)return null;
  if(branch===1){
    const avoidJudgment=a.judgment_cards?.length||a.leidian_pending||a.poison_mark_pending||a.judgment_mark_pending;
    return avoidJudgment||a.skip_draw_stage||a.block_turn_draw||target.hp<=1?{target,material:null}:null;
  }
  const materials=sgs_shensu_materials(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y));
  const material=materials.find(m=>m.zone==='hand'||m.card.trait==='silver_lion'&&a.hp<rule_hero(a).max_hp)
    ??(target.hp<=1?materials[0]:null);
  return material?{target,material}:null;
}
async function chooseShensuMaterial(g,a,branch,event){
  while(phaseWindow(g,a,branch,event)){
    const options=sgs_shensu_materials(g,a);if(!options.length)return null;
    const answer=await g.view.ask_line('神速②：弃置一张装备牌（手牌或装备区），或取消',{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌或阶段'}],
      meta:shensuMeta(g,a,branch,event,'shensu_material',{private_to:seat(g,a),material_zones:['hand',...slots],equipment_only:true}),
    });
    if(pass(answer))return null;const chosen=select(options,answer);if(chosen)return chosen;
  }return null;
}
async function chooseShensuTarget(g,a,branch,event){
  while(phaseWindow(g,a,branch,event)){
    const targets=sgs_shensu_targets(g,a);if(!targets.length)return null;
    const options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${p.hp}血 · ${p.hand.length}张手牌）`}));
    const answer=await g.view.ask_line(`神速${branch===1?'①':'②'}：选择杀的目标（无距离限制），或取消`,{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗牌或阶段'}],
      meta:shensuMeta(g,a,branch,event,'shensu_target',{ignore_distance:true}),
    });
    if(pass(answer))return null;const chosen=select(options,answer),target=targets.find(p=>seat(g,p)===chosen?.id);if(target)return target;
  }return null;
}
async function onShensuWindow(g,a,branch,event){
  if(!sgs_shensu_available(g,a,branch,event))return false;
  const choice=a.is_ai?sgs_ai_shensu_choice(g,a,branch,event):null;
  const key=shensuKey(g,a,branch,event),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const receipt={phase_event_id:phaseId(event),branch,owner_id:identity(g,a),status:'offered'};state(g).shensu[key]=receipt;
  const valid=()=>phaseWindow(g,a,branch,event)&&rule_hero(a)?.id===form&&g.turn_event_counter===turn;
  if(a.is_ai){
    if(!choice){receipt.status='passed';return false;}
    return sgs_resolve_shensu(g,a,branch,event,choice.target,choice.material,receipt);
  }
  const accepted=await g.view.ask_confirm(branch===1?'神速①：是否跳过判定和摸牌阶段，视为使用一张无距离限制的杀？':'神速②：是否弃置一张装备牌并跳过出牌阶段，视为使用一张无距离限制的杀？',{
    player_id:seat(g,a),meta:shensuMeta(g,a,branch,event,`shensu_${branch}_start`),
  });
  if(!accepted||!valid()){receipt.status='passed';return false;}
  const material=branch===2?await chooseShensuMaterial(g,a,branch,event):null;
  if(!valid()||branch===2&&!material){receipt.status='cancelled';return false;}
  const target=await chooseShensuTarget(g,a,branch,event);
  if(!target||!valid()){receipt.status='cancelled';return false;}
  const result=await sgs_resolve_shensu(g,a,branch,event,target,material,receipt);
  if(!result&&receipt.status==='offered')receipt.status='cancelled';return result;
}
export const sgs_before_judgment_shensu=(g,a,_target,event={})=>onShensuWindow(g,a,1,event);
export const sgs_before_play_shensu=(g,a,_target,event={})=>onShensuWindow(g,a,2,event);

const liegongKey=(g,a,event)=>JSON.stringify([identity(g,a),event.card_use_id]);
const liegongWindow=(g,a,event)=>own(a,'sgs.liegong')&&continuing(g)&&g.is_own_play_phase(a)&&event?.card_use_id
  &&event.kind==='sha'&&is_sha_card(event.source_card??{})&&!event.cancelled&&!event.closed;
const resultFor=receipt=>({dodge_blocked_branch_ids:receipt.snapshots.filter(row=>row.accepted).map(row=>row.branch_id),
  dodge_blocked_target_ids:[...new Set(receipt.snapshots.filter(row=>row.accepted).map(row=>row.target_id))],snapshots:receipt.snapshots});
const emptyLiegong=()=>({dodge_blocked_branch_ids:[],dodge_blocked_target_ids:[],snapshots:[]});
function applyLiegongResult(g,event,result){
  for(const [index,branch] of (event.target_events??[]).entries()){
    const branch_id=branch.branch_id??`${event.card_use_id}:branch:${index}`;
    const row=result.snapshots.find(s=>s.branch_id===branch_id&&s.target_id===identity(g,branch.target));
    if(row){branch.sgs_liegong_snapshot={...row};if(row.accepted)branch.dodge_blocked=true;}
  }return result;
}
/** Snapshot EVERY finalized target synchronously before the first prompt.
 * Never implement this as on_sha_target: that host hook is too late for later
 * branches. Existing immutable decisions survive stat changes/source death. */
export async function sgs_on_sha_targets_liegong(g,a,targets,event={}){
  if(!event.card_use_id)return emptyLiegong();
  const key=liegongKey(g,a,event),existing=g.sgs_wind_state?.liegong?.[key];
  if(existing)return applyLiegongResult(g,event,resultFor(existing));
  if(!liegongWindow(g,a,event))return emptyLiegong();
  const hp=a.hp,range=g.actual_attack_range(a),form=rule_hero(a)?.id;
  const branches=targets.map((target,index)=>({target,branch_id:event.target_events?.[index]?.branch_id??`${event.card_use_id}:branch:${index}`})).filter(({target})=>live(target)&&target!==a);
  const receipt={card_use_id:event.card_use_id,owner_id:identity(g,a),status:'offered',snapshots:branches.map(({target,branch_id})=>{
    const hand=target.hand.length;
    return {branch_id,target_id:identity(g,target),target_seat:seat(g,target),target_hand_count:hand,owner_hp:hp,
      attack_range:Number.isFinite(range)?range:null,attack_range_infinite:range===Infinity,
      eligible:hand>=hp||hand<=range,accepted:false,status:'snapshotted'};
  })};state(g).liegong[key]=receipt;
  for(const row of receipt.snapshots){
    if(!row.eligible){row.status='ineligible';continue;}
    const target=branches.find(b=>b.branch_id===row.branch_id)?.target;
    if(!liegongWindow(g,a,event)||rule_hero(a)?.id!==form||!live(target)){row.status='interrupted';continue;}
    row.status='offered';
    const accepted=a.is_ai?g.side_of(target)!==g.side_of(a):await g.view.ask_confirm(`烈弓：${target.name}有${row.target_hand_count}张手牌，是否令其不能使用闪响应此杀？`,{
      player_id:seat(g,a),meta:{skill:'烈弓',skill_id:'sgs.liegong',stage:'liegong_target',card_use_id:event.card_use_id,branch_id:row.branch_id,
        target_seat:row.target_seat,target_hand_count:row.target_hand_count,owner_hp:row.owner_hp,attack_range:row.attack_range,
        attack_range_infinite:row.attack_range_infinite,all_targets_snapshotted:true},
    });
    // Stat changes do not recompute eligibility. Identity/window/life changes
    // while the UI is suspended still invalidate an uncommitted choice.
    row.accepted=Boolean(accepted&&liegongWindow(g,a,event)&&rule_hero(a)?.id===form&&live(target));
    row.status=row.accepted?'committed':'passed';
  }
  receipt.status='ended';return applyLiegongResult(g,event,resultFor(receipt));
}
export function create_sgs_wind_speed_bow_skills(SkillHooks){
  return {hooks:{
    [SGS_WIND_SPEED_BOW_RULE_IDS.xiahouyuan]:SkillHooks({before_judgment_phase:[sgs_before_judgment_shensu],before_play_phase:[sgs_before_play_shensu]}),
    [SGS_WIND_SPEED_BOW_RULE_IDS.huangzhong]:SkillHooks({on_sha_targets_designated:[sgs_on_sha_targets_liegong]}),
  },active:{}};
}
export const sgs_wind_speed_bow_skill_definitions=({SkillHooks})=>create_sgs_wind_speed_bow_skills(SkillHooks);
