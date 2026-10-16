/** Authoritative Jianghu adapters for the published 2026 画圣 module.
 * Queries never allocate match ledger/card-history state or change zones/RNG.
 * Offer IDs depend only on stable actor/provider/location facts, never on
 * query order. Exact physical/provider references are matched separately.
 */
import {Card,CardType,CardColor,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';
import {active_skills_for_hero,skill_hooks_for_hero,hero_has_capability} from './skills.js';
import {equipment_definition} from './equipment-catalog.mjs';
import {get_general_skill_descriptor} from './general-skill-descriptor.js';
import {CARD_HISTORY_FUNCTIONS} from './game-card-history.js';
import {YOUJIAN_TRICK_CATALOG} from './youjian-trick-effects.js';
import {YOUJIAN_EQUIPMENT_PACK_ID} from './content-packs.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const GLOBAL=new Set(['五谷丰登','桃园结义']),AOE=new Set(['烽火狼烟','万箭齐发']);
const PACKED=new Set(YOUJIAN_TRICK_CATALOG.map(d=>d.rule_id));
const key=JSON.stringify,live=a=>Boolean(a?.alive&&!a.dead);
const transactions=new WeakMap();
const roster=g=>g.all_players().filter(Boolean);
const stable=x=>typeof x==='string'&&x.trim()!==''||Number.isSafeInteger(x)&&x>=0;
const epoch=(g,c)=>g.card_location_epoch(c);
const skills=a=>get_general_skill_descriptor(rule_hero(a))?.skill_ids??rule_hero(a)?.skill_ids??[];
function skillEnabled(a,id,label){const source=get_general_skill_descriptor(rule_hero(a))?.source_descriptor??rule_hero(a),index=source?.skill_name?.split('/').indexOf(label)??-1;const intrinsic=index>=0?`${source.id}:intrinsic:${index}:${label}`:null;return !a.skills_disabled&&![id,label,intrinsic].some(s=>s&&a.disabled_skill_ids?.includes(s));}
function providerBinding(g,a,id){
 const hero=rule_hero(a),pid=g.player_id(a);
 // Include ownership/template transitions, but not benign initial lazy ledger
 // registration or HP/history accounting, so a cold offer survives initialization.
 const changes=(g.general_skill_ledger_state?.commands??[]).filter(c=>c.actor_id===pid&&['install_template','remove_all','acquire_skill'].includes(c.kind)).map(c=>c.command_id);
 return key([pid,hero?.id,id,hero?.lifecycle_template_id??hero?.id,changes]);
}
function enabledCard(g,c){return !c.content_pack||(g.content_packs??[]).includes(c.content_pack);}
function sourceId(skill){return skill.source_skill_id??({武圣:'sgs.wusheng',傲剑:'yxs.aojian',龙胆:'sgs.longdan',武穆:'yxs.wumu',诗仙:'jianghu.shixian'})[skill.skill_id]??skill.skill_id;}
function physicalMaterials(g,a){return [...a.hand.map((card,index)=>({zone:'hand',index,card})),...SLOTS.flatMap(zone=>a[zone]?[{zone,index:0,card:a[zone]}]:[])].filter(m=>m.card&&!m.card.virtual&&enabledCard(g,m.card)).map(m=>({...m,epoch:epoch(g,m.card)}));}
function resource(g,a,provider,materials,face,{provider_card=null,label=provider??'实体杀'}={}){
 const binding=provider?providerBinding(g,a,provider):key([g.player_id(a),'physical-sha']);
 const providerPart=provider_card?[(g.card_history_materials??[]).find(row=>row.card===provider_card)?.id??null,epoch(g,provider_card),provider_card.equipment_id??provider_card.id??null,provider_card.trait]:null;
 const binding_id=key([binding,providerPart]);
 return Object.freeze({id:`huasheng:${key([binding_id,materials.map(m=>[m.zone,m.index,m.epoch])])}`,label:`${label}：${materials.map(m=>`${m.zone==='hand'?`手牌${m.index+1}`:m.zone} ${m.card}`).join(' + ')}`,
  binding_id,provider_skill_id:provider,provider_card,materials:Object.freeze(materials.map(m=>Object.freeze({...m}))),effective_card:face});
}
function useFace(g,a,m){return new Card('杀',CardType.SHA,{virtual:true,materials:[m.card],suit:g.effective_suit(m.card,a,{zone:m.zone,action:'use'}),color:g.effective_color(m.card,a,{zone:m.zone,action:'use'}),rank:m.card.rank});}
function faceFacts(c){return [c?.name,c?.type,c?.suit,c?.color,c?.rank,c?.formed_effective_color===true,c?.nature??null];}
function exactResource(a,b){return Boolean(a&&b&&a.id===b.id&&a.binding_id===b.binding_id&&a.provider_skill_id===b.provider_skill_id&&(a.provider_card??null)===(b.provider_card??null)
 &&key(faceFacts(a.effective_card))===key(faceFacts(b.effective_card))&&Array.isArray(b.materials)&&a.materials.length===b.materials.length
 &&a.materials.every((m,i)=>{const n=b.materials[i];return n&&m.zone===n.zone&&m.index===n.index&&m.card===n.card&&m.epoch===n.epoch;}));}
function currentResource(g,a,r){return g.huasheng_resources(a).find(c=>exactResource(c,r))??null;}
function afterCost(g,a,r){
 const fields={_distance_origin:a,hand:a.hand.filter(c=>!r.materials.some(m=>m.zone==='hand'&&m.card===c))};
 for(const m of r.materials)if(SLOTS.includes(m.zone))fields[m.zone]=null;
 const p=Object.assign(Object.create(Object.getPrototypeOf(a)),a,fields);return g.general_skill_preview?.(a,p)??p;
}
/** When the caster is the forced victim, both hand immunity and defensive /
 * fixed-distance equipment must be evaluated after its own material cost.
 * Bind every other host method to the real game; the facade only supplies the
 * read-only seating view required by the host's actual distance implementation. */
function borrowedVictims(g,a,r,holder){
 const after=afterCost(g,a,r),all=roster(g);
 const distanceHost=new Proxy(g,{get(target,prop){if(prop==='turn_order')return ()=>g.turn_order().map(p=>p===a?after:p);const value=Reflect.get(target,prop,target);return typeof value==='function'?value.bind(target):value;}});
 return all.filter(v=>{
  if(!live(v)||v===holder||holder.prison_no_sha)return false;
  const victim=v===a?after:v;
  if(!g.can_sha_target(holder,victim,{allow_allies:true}))return false;
  const distance=v===a?g.distance_between.call(distanceHost,holder,after):g.distance_between(holder,v);
  return distance<=g.actual_attack_range(holder);
 });
}
const targetList=p=>p.targets===undefined?[p.target]:p.targets;
function sameTargets(xs,ys){return xs.length===ys.length&&xs.every((x,i)=>x===ys[i]);}
function finalDefinition(g,a,card){return g.huasheng_output_catalog(a).find(d=>d.rule_id===card?.rule_id&&d.name===card.name&&d.type===card.type&&Object.entries(d).every(([k,v])=>key(card[k])===key(v))&&['effect_id','nature','rule_type','target_mode','delayed_key'].every(k=>key(card[k])===key(d[k])))??null;}
export const yxsModernHuashengRuntimeMethods={
 huasheng_resources(actor){
  if(!live(actor)||!roster(this).includes(actor)||typeof this.card_location_epoch!=='function')return [];
  const materials=physicalMaterials(this,actor).filter((m,_i,ms)=>ms.filter(n=>n.card===m.card).length===1),out=[],hero=rule_hero(actor),hooks=skill_hooks_for_hero(hero),actives=active_skills_for_hero(hero);
  // Logical faces of copied physical hand cards count; virtual wrappers do not.
  for(const m of materials.filter(m=>m.zone==='hand'&&is_sha_type(m.card.type)))out.push(resource(this,actor,null,[m],new Card(m.card.name,m.card.type,{...m.card,virtual:true,materials:[m.card],suit:this.effective_suit(m.card,actor),color:this.effective_color(m.card,actor)})));
  if(this.is_own_play_phase(actor)){
   const colorProvider=actives.find(s=>['武圣','傲剑'].includes(s.skill_id)||['sgs.wusheng','yxs.aojian'].includes(s.source_skill_id));
   if(colorProvider&&hooks?.response_sha_material_color===CardColor.RED&&skillEnabled(actor,sourceId(colorProvider),colorProvider.skill_id))for(const m of materials.filter(m=>this.effective_color(m.card,actor,{zone:m.zone,action:'use'})===CardColor.RED))out.push(resource(this,actor,sourceId(colorProvider),[m],useFace(this,actor,m),{label:colorProvider.skill_id}));
   // A response swap alone (original 岳飞) does not authorize use conversion.
   const swapProvider=actives.find(s=>s.card_filter==='shan'&&['龙胆','武穆'].includes(s.skill_id));
   if(swapProvider&&hooks?.response_sha_shan_swap&&skillEnabled(actor,sourceId(swapProvider),swapProvider.skill_id))for(const m of materials.filter(m=>m.zone==='hand'&&m.card.type===CardType.SHAN))out.push(resource(this,actor,sourceId(swapProvider),[m],useFace(this,actor,m),{label:swapProvider.skill_id}));
   const shixian=actives.find(s=>s.skill_id==='诗仙');
   if(shixian&&hero_has_capability(hero,'shixian')&&this.has_all_hand_as_sha(actor)&&skillEnabled(actor,sourceId(shixian),shixian.skill_id))for(const m of materials.filter(m=>m.zone!=='hand'||!(m.card.type===CardType.TAO&&actor.hp<(this.effective_max_hp?.(actor)??hero.max_hp))))out.push(resource(this,actor,sourceId(shixian),[m],useFace(this,actor,m),{label:'诗仙'}));
  }
  if(skills(actor).includes('sgs.shizhi')&&skillEnabled(actor,'sgs.shizhi','矢志')&&actor.hp===1)for(const m of materials.filter(m=>m.zone==='hand'&&m.card.type===CardType.SHAN))out.push(resource(this,actor,'sgs.shizhi',[m],useFace(this,actor,m),{label:'矢志'}));
  const weapon=actor.weapon;
  if(weapon&&!weapon.virtual&&weapon.type===CardType.WEAPON&&weapon.trait==='two_as_sha'&&equipment_definition(weapon)?.trait==='two_as_sha'&&enabledCard(this,weapon)&&!actor.equipment_disabled&&!actor.weapon_disabled&&!(actor.abolished_equipment_slots??[]).includes('weapon')){
   const hand=materials.filter(m=>m.zone==='hand');for(let i=0;i<hand.length;i++)for(let j=i+1;j<hand.length;j++)out.push(resource(this,actor,'equipment.two_as_sha',[hand[i],hand[j]],this.two_card_sha(actor,[hand[i].card,hand[j].card]),{provider_card:weapon,label:weapon.name}));
  }
  return out;
 },
 huasheng_borrowed_victims(actor,offered,holder){const r=currentResource(this,actor,offered);return r&&live(holder)&&holder!==actor&&roster(this).includes(holder)?borrowedVictims(this,actor,r,holder):[];},
 actor_after_huasheng_resource(actor,offered){const r=currentResource(this,actor,offered);return r?afterCost(this,actor,r):null;},
 huasheng_output_catalog(_actor){return CARD_HISTORY_FUNCTIONS.filter(d=>d.type===CardType.SCROLL&&d.category==='trick'&&!['无懈可击','无懈'].includes(d.name)&&(!PACKED.has(d.rule_id)||(this.content_packs??[]).includes(YOUJIAN_EQUIPMENT_PACK_ID)));},
 huasheng_validate_target_plan(actor,offered,card,plan){
  if(!live(actor)||!roster(this).includes(actor)||!this.is_own_play_phase(actor)||this.winner||!plan||plan.recast||this.card_use_prohibited?.(actor,card))return false;
  const r=currentResource(this,actor,offered),def=finalDefinition(this,actor,card);if(!r||!def)return false;
  if(card.source_skill!=='yxs.huasheng'||card.source_skill_id!=='yxs.huasheng'||card.provider_skill_id!==r.provider_skill_id||Boolean(card.formed_effective_color)!==Boolean(r.effective_card.formed_effective_color)||card.virtual!==true||!Array.isArray(card.materials)||card.materials.length!==r.materials.length||card.materials.some((c,i)=>c!==r.materials[i].card))return false;
  const face=r.materials.length===1?r.materials[0].card:r.effective_card,m=r.materials[0];
  if(key([card.suit,card.color,card.rank])!==key([r.materials.length===1?this.effective_suit(face,actor,{zone:m.zone,action:'card_use'}):face.suit,r.materials.length===1?this.effective_color(face,actor,{zone:m.zone,action:'card_use'}):face.color,face.rank??null]))return false;
  const all=roster(this),after=afterCost(this,actor,r),target=plan.target;
  const legal=t=>all.includes(t)&&live(t)&&!this.card_target_prohibited?.(actor,t,card)&&this.can_trick_target(after,t,card)!==false;
  if(!legal(target))return false;
  if(plan.forced_target!=null&&card.name!=='借刀杀人')return false;
  if(plan.targets!==undefined&&(!Array.isArray(plan.targets)||!plan.targets.length||new Set(plan.targets).size!==plan.targets.length||plan.targets[0]!==target||!plan.targets.every(legal)))return false;
  if(GLOBAL.has(card.name)||AOE.has(card.name)){
   const expected=this.action_order().filter(t=>(!AOE.has(card.name)||t!==actor)&&legal(t));
   return expected.length>0&&expected.includes(target)&&(plan.targets===undefined||sameTargets(plan.targets,expected));
  }
  const targets=targetList(plan);
  if(card.name==='铁索连环')return targets.length>=1&&targets.length<=2&&targets.every(legal);
  if(targets.length!==1)return false;
  if(card.name==='无中生有'||card.name==='树上开花')return target===actor;
  if(card.name==='火攻')return target.hand.length>0; // Declaration permits last-card self Fire Attack.
  if(card.name==='刮骨疗毒')return target.hp<(this.effective_max_hp?.(target)??rule_hero(target).max_hp);
  if(target===actor)return false;
  if(card.name==='借刀杀人'){
   const victim=plan.forced_target;
   return Boolean(target.weapon&&!target.weapon.virtual&&enabledCard(this,target.weapon)&&all.includes(victim)&&live(victim)&&victim!==target&&borrowedVictims(this,actor,r,target).includes(victim));
  }
  if(card.name==='决斗')return this.can_duel_target(actor,target,{allow_allies:plan.allow_allies===true})===true;
  if(card.name==='顺手牵羊')return this.target_has_card(target)&&!this.is_immune_to_shunshou(target)&&this.can_use_shunshou(after,target);
  if(['釜底抽薪','过河拆桥','推心置腹'].includes(card.name))return this.target_has_card(target);
  if(['美人计','笑里藏刀'].includes(card.name))return this.can_wangyun_trick_target(actor,target,card)===true;
  if(card.name==='趁火打劫')return target.hand.length>0;
  // A newly registered function needs an explicit complete target contract.
  return false;
 },
 async commit_huasheng_resource(actor,offered,{move_id,validate,on_committed}={}){
  if(!stable(move_id)||typeof validate!=='function'||typeof on_committed!=='function')throw Error('画圣费用需要唯一事务ID与同步验证/提交回调');
  if(this.public_card_loss_supports_on_committed!==true||typeof this.public_card_loss!=='function')throw Error('画圣费用需要原子 public_card_loss');
  let jobs=transactions.get(this);if(!jobs)transactions.set(this,jobs=new Map());const k=key(move_id),old=jobs.get(k);
  if(old){if(old.actor!==actor||!exactResource(old.resource,offered))throw Error('同一画圣费用事务不能更换资源或人物');if(old.status==='failed')throw Object.assign(Error('画圣费用事务需要恢复原动作日志'),{code:'YXS_HUASHENG_REPLAY_REQUIRED'});return {...old.result,replayed:true,pending:old.status==='pending'};}
  if(Object.hasOwn(this.card_move_receipts??{},k))throw Object.assign(Error('画圣费用事务需要恢复原动作日志'),{code:'YXS_HUASHENG_REPLAY_REQUIRED'});
  const resource=currentResource(this,actor,offered);
  if(!resource||!this.is_own_play_phase(actor)||this.winner||validate()!==true)return {committed:false,cards:[],resource:null,move_id};
  const row={actor,resource,status:'pending',result:{committed:false,cards:[],resource,move_id}};jobs.set(k,row);
  try{
   let called=false;
   const result=await this.public_card_loss(actor,resource.materials,{to:'processing',visibility:'public',reason:'画圣·锦囊材料',action:'card_use',semantic_action:'card_use',source:actor,source_skill:'yxs.huasheng',move_id,
    validate:()=>live(actor)&&!this.winner&&this.is_own_play_phase(actor)&&Boolean(currentResource(this,actor,resource))&&validate()===true,
    on_committed:(cards,movement)=>{
     if(called||cards.length!==resource.materials.length||cards.some((c,i)=>c!==resource.materials[i].card)||cards.some(c=>!this.processing_cards.includes(c)))throw Error('画圣费用原子回执不匹配');called=true;
     row.result={committed:true,cards:[...cards],resource,move_id:movement.move_id};
     const returned=on_committed(cards,row.result);if(returned&&typeof returned.then==='function')throw Error('画圣提交回调必须同步');
    }});
   if(result.committed&&!called)throw Error('画圣费用缺少提交回调');row.status='done';return row.result;
  }catch(error){row.status='failed';throw error;}
 },
};
