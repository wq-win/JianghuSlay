/** 全琮: selected Mobile classic 4HP 邀名. Once per actual global turn,
 * one optional opportunity per damage EVENT, never per damage point. */
import {rule_hero} from './effective-hero.js';
export const SGS_YIJIANG_FURTHER_QUANCONG_RULE_IDS=Object.freeze({quancong:'sgs.adapted.base.hero.quan-cong'});
export const SGS_YIJIANG_FURTHER_QUANCONG_SKILL_IDS=Object.freeze({yaoming:'sgs.yaoming'});
const ID=SGS_YIJIANG_FURTHER_QUANCONG_RULE_IDS,SK=SGS_YIJIANG_FURTHER_QUANCONG_SKILL_IDS,FIELD='sgs_yijiang_further_quancong_state',LIMIT=64;
export const SGS_YIJIANG_FURTHER_QUANCONG_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7','H10']),
  heroes:Object.freeze([Object.freeze({id:ID.quancong,name:'全琮',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'吴',skill_ids:Object.freeze([SK.yaoming]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.yaoming]:'每回合限一次，当你造成或受到伤害后，你可以选择一项：1.弃置手牌数大于你的一名角色的一张手牌；2.令手牌数小于你的一名角色摸一张牌。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-193.html','https://wiki.biligame.com/msgs/全琮','https://wiki.biligame.com/msgs/邀名']),excluded_variants:Object.freeze(['界全琮','蓄力','3HP','active-yaoming','non-strict-hand-comparison']),
});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),key=JSON.stringify;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK.yaoming)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK.yaoming):g.has_general_skill?.(a,SK.yaoming)===true);
const binding=(g,a)=>key([g.general_skill_binding_id?.(a,SK.yaoming)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const serial=id=>typeof id==='string'&&/^damage:[1-9]\d*$/.test(id)&&Number.isSafeInteger(Number(id.slice(7)))?Number(id.slice(7)):null;
const active=new WeakMap();
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.turn_id)||s.turn_id<1||typeof s.spent!=='boolean'||!Array.isArray(s.offers)||s.offers.length>LIMIT||!Number.isSafeInteger(s.retired_sequence)||s.retired_sequence<0||s.offers.some(r=>!stable(r.event_id)||!['offered','paying','resolving','done','failed'].includes(r.status)))throw Error('Invalid Quan Cong state');return s;}
function state(g,a){const owner=pid(g,a);if(!stable(owner))throw Error('邀名需要稳定人物ID');let s=a[FIELD];if(s){validate(s);if(s.owner_id!==owner)throw Error('邀名额度不能继承另一人物');if(g.turn_event_counter<s.turn_id)throw Error('邀名不能倒退全局回合');if(s.turn_id!==g.turn_event_counter){if(s.offers.some(r=>r.status!=='done'))throw Error('邀名尚有未完成事务');s=null;}}if(!s){if(!Number.isSafeInteger(g.turn_event_counter)||g.turn_event_counter<1)throw Error('邀名需要真实全局回合ID');s=a[FIELD]={version:1,owner_id:owner,turn_id:g.turn_event_counter,spent:false,spent_event_id:null,retired_sequence:0,offers:[]};}return s;}
export const sgs_clone_yijiang_further_quancong_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validate(a[FIELD]))):null;
export const sgs_yaoming_used=(g,a)=>Boolean(a?.[FIELD]&&validate(a[FIELD]).turn_id===g.turn_event_counter&&a[FIELD].spent);
/** Foreign cards are never formatted, inspected or ranked by face. Slot +
 * physical object + epoch bind a blind selection until atomic commit. */
export function sgs_yaoming_discard_materials(g,a,target){if(!live(target)||target===a)return [];return (target.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}（未知）`,hidden:true})).filter(m=>g.can_discard_material?.(target,m,{source:a,source_skill:SK.yaoming})!==false);}
export function sgs_yaoming_targets(g,a){if(!live(a))return [];return g.all_players().filter(p=>p!==a&&live(p)).flatMap(p=>p.hand.length>a.hand.length&&sgs_yaoming_discard_materials(g,a,p).length?[{target:p,branch:'discard'}]:p.hand.length<a.hand.length?[{target:p,branch:'draw'}]:[]);}
export function sgs_ai_yaoming_plan(g,a){if(typeof g.side_of!=='function')return null;return sgs_yaoming_targets(g,a).filter(o=>o.branch==='draw'?g.side_of(o.target)===g.side_of(a):g.side_of(o.target)!==g.side_of(a)).sort((x,y)=>(y.branch==='discard')-(x.branch==='discard')||(x.branch==='draw'?x.target.hand.length-y.target.hand.length:y.target.hand.length-x.target.hand.length))[0]??null;}
function window(g,a,n,other,e,direction){return owned(g,a)&&ongoing(g)&&g.actual_turn_active===true&&Number.isSafeInteger(g.turn_event_counter)&&g.turn_event_counter>0&&stable(e.damage_event_id)&&Number.isFinite(n)&&n>0&&e.damage===n&&e.dying_resolved===true&&!e.closed&&!e.cancelled&&!e.prevented&&!['hp_loss','poison_loss'].includes(e.kind)&&(e.turn_id===undefined||e.turn_id===g.turn_event_counter)&&(direction==='source'?e.source===a&&e.target===other&&e.damage_window==='source_after_damage':e.target===a&&e.source===other&&e.damage_window==='receiver_after_damage');}
const facts=(g,e)=>({event_id:e.damage_event_id,source_id:pid(g,e.source),target_id:pid(g,e.target),damage:e.damage,kind:e.kind??null});
const exact=(os,m)=>m&&os.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||o.epoch===m.epoch));
const meta=(g,a,e,stage,extra={})=>({skill:'邀名',skill_id:SK.yaoming,stage,private_to:seat(g,a),damage_event_id:e.damage_event_id,global_turn_id:g.turn_event_counter,...extra});
async function resolve(g,a,n,other,e,direction){
  if(!window(g,a,n,other,e,direction))return false;
  const s=state(g,a),request=facts(g,e),old=s.offers.find(r=>r.event_id===e.damage_event_id);
  if(old){if(key(old.facts)!==key(request))throw Error('同一邀名伤害事件不能更换事实');if(old.status!=='done'&&!active.get(a)?.has(old))throw Object.assign(Error('邀名事务中断，须恢复原协程或从输入日志重放'),{code:'SGS_QUANCONG_REPLAY_REQUIRED'});return false;}
  if(s.spent||serial(e.damage_event_id)!==null&&serial(e.damage_event_id)<=s.retired_sequence)return false;
  // Re-entrant unrelated packets cannot race an outstanding voluntary prompt.
  if(s.offers.some(r=>r.status!=='done'))return false;
  if(s.offers.length>=LIMIT){const i=s.offers.findIndex(r=>r.status==='done'&&serial(r.event_id)!==null);if(i<0)throw Error('邀名事件过多且无单调伤害编号，须使用宿主 damage:N 标识');const [retired]=s.offers.splice(i,1);s.retired_sequence=Math.max(s.retired_sequence,serial(retired.event_id));}
  const r={event_id:e.damage_event_id,facts:request,status:'offered',committed:false,branch:null,target_id:null};s.offers.push(r);let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());jobs.add(r);
  const bound=binding(g,a),turn=s.turn_id,valid=()=>window(g,a,n,other,e,direction)&&g.turn_event_counter===turn&&binding(g,a)===bound&&key(facts(g,e))===key(request)&&!s.spent;
  const finish=()=>{r.status='done';jobs.delete(r);};
  try{
    let chosen=null;
    if(a.is_ai)chosen=sgs_ai_yaoming_plan(g,a);
    else while(valid()&&!chosen){
      const choices=sgs_yaoming_targets(g,a);if(!choices.length)break;
      const os=choices.map(o=>({id:`${o.branch}:${pid(g,o.target)}`,label:`${o.branch==='discard'?'弃置一张手牌':'摸一张牌'}：${o.target.name}（${o.target.hand.length}张，你${a.hand.length}张）`,...o}));
      const answer=await g.view.ask_line('邀名：本全局回合可发动一次，弃置手牌更多者的一张手牌，或令更少者摸一张',{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'pass',label:'不发动，保留本回合额度'}],meta:meta(g,a,e,'yaoming_target',{optional:true,once_per_global_turn:true,strict_hand_compare:true,allow_self:false,allow_enemies:true,owner_hand_count:a.hand.length})});
      if(!valid()||pass(answer))break;const selected=select(os,answer);if(selected){chosen={target:selected.target,branch:selected.branch};if(!sgs_yaoming_targets(g,a).some(o=>o.target===chosen.target&&o.branch===chosen.branch)){r.cancelled=true;finish();return false;}}
    }
    const legal=()=>valid()&&chosen&&sgs_yaoming_targets(g,a).some(o=>o.target===chosen.target&&o.branch===chosen.branch);
    if(!legal()){r.cancelled=Boolean(chosen);r.declined=!chosen;finish();return false;}
    const {target,branch}=chosen;r.target_id=pid(g,target);r.branch=branch;r.owner_hand_count=a.hand.length;r.target_hand_count=target.hand.length;
    const commit=()=>{s.spent=true;s.spent_event_id=r.event_id;r.committed=true;r.status='resolving';};
    if(branch==='draw'){
      commit();r.requested=1;const cards=await g.draw_cards(target,1);r.drawn=Array.isArray(cards)?cards.length:null;
    }else{
      let material=null;
      while(legal()&&!material){
        const os=sgs_yaoming_discard_materials(g,a,target);if(!os.length)break;
        if(a.is_ai)material=os[0];
        else{const answer=await g.view.ask_line(`邀名：选择${target.name}的一张未知手牌弃置`,{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label,hidden})=>({id,label,hidden})),{id:'cancel',label:'取消，不使用本回合额度'}],meta:meta(g,a,e,'yaoming_discard',{optional:true,hidden_hands:true,target_id:pid(g,target),material_zones:['hand'],exact_count:1})});if(!legal()||pass(answer))break;material=select(os,answer);if(material&&!exact(sgs_yaoming_discard_materials(g,a,target),material)){r.cancelled=true;finish();return false;}}
      }
      const payable=()=>legal()&&Boolean(exact(sgs_yaoming_discard_materials(g,a,target),material));
      if(!payable()){r.cancelled=true;finish();return false;}
      if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('邀名需要原子 validate / on_committed 移牌边界');
      r.status='paying';const move=await g.public_card_loss(target,[material],{to:'discard',visibility:'public',reason:'邀名',action:'discard',semantic_action:'discard',source:a,source_skill:SK.yaoming,move_id:`yaoming:${key([pid(g,a),turn,r.event_id])}:discard`,validate:payable,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==material.card)throw Error('邀名必须恰好弃置所选目标手牌');commit();r.move_id=movement.move_id;}});
      if(move?.committed&&!r.committed)throw Error('邀名缺少原子提交回执');if(!r.committed){r.cancelled=true;finish();return false;}
    }
    finish();g.view.emit(`${a.name}发动邀名，${branch==='draw'?`令${target.name}摸一张牌`:`弃置${target.name}的一张手牌`}。`,{event_type:'skill_resolution',skill_id:SK.yaoming,damage_event_id:r.event_id,global_turn_id:turn,branch,target_id:r.target_id});return true;
  }catch(error){r.status='failed';r.error=String(error?.message??error);jobs.delete(r);throw error;}
}
export const sgs_after_source_damage_yaoming=(g,a,n,target,e={})=>resolve(g,a,n,target,e,'source');
export const sgs_after_damage_resolved_yaoming=(g,a,n,source,e={})=>resolve(g,a,n,source,e,'receiver');
export function sgs_yijiang_further_quancong_public_state(a,g=null){if(!a?.[FIELD])return {yaoming_used:false,yaoming_turn_id:null,yaoming_events:[]};const s=validate(a[FIELD]);return {yaoming_used:s.spent&&(!g||s.turn_id===g.turn_event_counter),yaoming_turn_id:s.turn_id,yaoming_events:s.offers.map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,branch:r.committed?r.branch:null,target_id:r.committed?r.target_id:null,drawn:r.drawn??0,declined:r.declined===true,cancelled:r.cancelled===true}))};}
export function sgs_yijiang_further_quancong_skill_definitions({SkillHooks}){return {hooks:{[ID.quancong]:SkillHooks({after_source_damage:[sgs_after_source_damage_yaoming],after_damage_resolved:[sgs_after_damage_resolved_yaoming]})},active:{}};}
sgs_after_source_damage_yaoming.source_skill_id=SK.yaoming;sgs_after_damage_resolved_yaoming.source_skill_id=SK.yaoming;
