/** Historical Hua lifecycle integration. See HM1–HM12, not live-client parity. */
import {HEROES,hero_by_id,Player,Card} from './models.js';
import {rule_hero} from './effective-hero.js';
import {create_hero_lifecycle} from './hero-lifecycle.js';
import {skill_hooks_for_hero,active_skills_for_hero} from './skills.js';
import {WANGYUN_LIFECYCLE_ID,WANGYUN_LIFECYCLE_SKILLS,WANGYUN_FORM_IDS,WANGYUN_EVOLUTIONS,wangyun_form_templates,wangyun_rule_descriptor,create_wangyun_lifecycle_methods} from './wangyun-lifecycle.js';
const HUA='yxs.adapted.base.hero.hua-mu-lan';
const cache=new WeakMap();
const pendingTransforms=new WeakMap();
const copy=value=>JSON.parse(JSON.stringify(value));
const fields=['shixian_active','bawang_stacks','luoyi_active','kurou_ai_uses','zuijiu_active','yinren_active','tuqiang_response_ids','shucai_given_this_turn','shucai_healed_this_turn','shucai_ai_used_this_turn','liuye_last_damage_card','qianglue_last_dodge_id','chuchu_end_phase_receipt','zhiyu_turn_receipt','fuchou_damage_receipts','yxs_sheshen_event_receipts','yxs_juebie_last_entry_id','yxs_juebie_transfer'];
function manifest(hero){
 const ids=hero.skill_ids??hero.skill_name.split('/').map((name,i)=>`${hero.id}:intrinsic:${i}:${name}`);
 return {template_id:hero.id,hero_id:hero.id,display_name:hero.display_name??hero.name,max_hp:hero.max_hp,gender:hero.gender,skill_ids:ids,personal_lord_skill_ids:hero.personal_lord_skill_ids??[],complete:true};
}
function create(game){
 const templates=HEROES.map(hero=>{
  if(!skill_hooks_for_hero(hero)&&!active_skills_for_hero(hero).length)throw Error(`完整英雄技能尚未注册：${hero.id}`);
  return manifest(hero);
 });
 const wangyun=templates.find(t=>t.hero_id===WANGYUN_LIFECYCLE_ID);
 if(wangyun)templates.push(...wangyun_form_templates(wangyun));
 const contracts=[...new Set(templates.flatMap(t=>t.skill_ids))].map(skill_id=>({skill_id,version:'jianghu-finite-forms-2',
  on_lost:context=>({effects:skillEffects(context,'lost')}),
  on_acquired:context=>({state:{},effects:skillEffects(context,'acquired')})
 }));
 const lifecycle=create_hero_lifecycle({game_id:'local-match-hero-lifecycle',templates,skill_lifecycles:contracts,
  evolutions:wangyun?WANGYUN_EVOLUTIONS:[],snapshot:game.hero_lifecycle_state??null});
 if(!game.hero_lifecycle_state){
  for(const actor of game.all_players().filter(Boolean)){
   const hero=rule_hero(actor),t=templates.find(t=>t.template_id===(actor.hero_form?.template_id??hero.lifecycle_template_id??hero.id));
   if(!t)throw Error(`局内英雄缺少完整模板：${hero.id}`);
   lifecycle.register_player({player_id:game.player_id(actor),real_hero_id:actor.hero.id,template_id:t.template_id,current_hp:actor.hp,mode_max_hp_bonus:0,skill_states:t.skill_ids.map(skill_id=>({skill_id,state:{}})),temporary_skills:[]});
  }
 }
 cache.set(game,lifecycle);game.hero_lifecycle_state=lifecycle.snapshot();return lifecycle;
}
function skillEffects(context,event){
 const t=event==='lost'?context.old_template:context.new_template,effects=[];
 if(context.transition_kind==='death_replacement'&&t.skill_ids[0]===context.skill_id)
  effects.push({kind:event==='lost'?'lost_hero_bundle':'acquire_hero_bundle',payload:{hero_id:t.hero_id,template_id:t.template_id}});
 if(Object.values(WANGYUN_LIFECYCLE_SKILLS).includes(context.skill_id))
  effects.push({kind:`wangyun_skill_${event}`,payload:{skill_id:context.skill_id}});
 return effects;
}
function install_form(_game,actor,form){
 const donor=hero_by_id(form.template.hero_id);if(!donor)throw Error('未注册的完整技能形态');
 const descriptor=wangyun_rule_descriptor(donor,form.template);
 actor.effective_rule_hero=Object.freeze({...descriptor,max_hp:form.effective_max_hp,gender:form.gender,skill_ids:Object.freeze([...form.template.skill_ids])});
 actor.hero_form={base_hero_id:actor.hero.id,form_hero_id:donor.id,template_id:form.template.template_id,
  display_name:donor.display_name??donor.name,gender:form.gender,max_hp:form.effective_max_hp,skill_ids:[...form.template.skill_ids]};
 actor.hp=form.current_hp;delete actor.gender_override;delete actor.effective_skill_ids;
}
function lifecycle(game){return cache.get(game)??create(game);}
function persist(game){const value=cache.get(game);if(value)game.hero_lifecycle_state=value.snapshot();}
function ownBundle(actor){return Object.fromEntries(fields.filter(k=>actor[k]!==undefined).map(k=>[k,copy(actor[k])]))}
function drain(game,api,actor){
 for(const effect of api.pending_effects()){
  if(effect.actor_id!==game.player_id(actor))continue;
  game.hero_lifecycle_effect_receipts??={};
  if(!game.hero_lifecycle_effect_receipts[effect.effect_id]){
   const key=`${effect.payload.hero_id}:${game.turn_event_counter}`;
   actor.hero_skill_state_ledger??={};
   if(effect.kind==='lost_hero_bundle'){
    actor.hero_skill_state_ledger[key]={fields:ownBundle(actor),used:[...actor.used_active_skills]};
    for(const field of fields)delete actor[field];
    actor.used_active_skills=new Set();
   }else if(effect.kind==='acquire_hero_bundle'){
    const donor=hero_by_id(effect.payload.hero_id);if(!donor)throw Error('未注册的完整技能形态');
    const saved=actor.hero_skill_state_ledger[key],fresh=new Player(actor.name,donor,actor.is_ai);
    for(const field of fields)if(fresh[field]!==undefined)actor[field]=copy(fresh[field]);
    if(saved){Object.assign(actor,copy(saved.fields));actor.used_active_skills=new Set(saved.used);}
    if(donor.id===WANGYUN_LIFECYCLE_ID){
     if(typeof game.wangyun_on_form_acquired!=='function')throw Error('王允缺少完整形态获得回调');
     game.wangyun_on_form_acquired(actor,{receipt_id:effect.effect_id,template_id:effect.payload.template_id,awakening_consumed:effect.payload.template_id!==WANGYUN_FORM_IDS.base,skill_ids:[...rule_hero(actor).skill_ids]});
    }
   }else if(effect.kind==='wangyun_skill_lost'||effect.kind==='wangyun_skill_acquired'){
    const callback=effect.kind==='wangyun_skill_lost'?'wangyun_on_skill_lost':'wangyun_on_skill_acquired';
    if(typeof game[callback]!=='function')throw Error('王允缺少完整技能生命周期回调');
    game[callback](actor,effect.payload.skill_id);
   }else throw Error(`未知技能生命周期效果：${effect.kind}`);
   game.hero_lifecycle_effect_receipts[effect.effect_id]=true;
  }
  api.acknowledge_effect(effect.effect_id);
 }
 persist(game);
}
export function eighth_has_skill(_game,actor,skill){
 return !!actor&&!actor.dead&&!actor.skills_disabled&&!actor.disabled_skill_ids?.includes(skill)&&rule_hero(actor)?.id===HUA&&['yxs.mili','yxs.yizhuang'].includes(skill);
}
export const eighthDependencies={has_skill:eighth_has_skill};
export const eighthRuntimeMethods={
 initialize_hero_lifecycle(){return lifecycle(this);},
 effective_max_hp(actor){return rule_hero(actor).max_hp;},
 archive_dead_hero(actor){
  // Final death is authoritative; pending dying is never recorded here.
  if(!this.hero_lifecycle_state&&!this.all_players().some(p=>[HUA,WANGYUN_LIFECYCLE_ID].includes(p?.hero?.id)))return false;
  const api=lifecycle(this),id=this.player_id(actor),old=api.player_state(id);
  if(old.life_status==='dead')return;
  api.update_vitals(id,{current_hp:Math.min(0,actor.hp)});
  api.finalize_death(id,`hero-death:${++this.hero_death_counter}:${id}`);persist(this);
 },
 yizhuang_candidates(actor){
  if(!actor||actor.dead||rule_hero(actor)?.id!==HUA||!this.hero_lifecycle_state)return [];
  const rows=this.hero_lifecycle_state.deaths,players=this.all_players();
  return rows.filter(r=>!r.invalidated_by&&r.effective_template.gender==='male'&&r.player_id!==this.player_id(actor)&&players.some(p=>this.player_id(p)===r.player_id&&p.dead)).map(r=>{
   const t=r.effective_template,base=hero_by_id(t.hero_id),hero=base?wangyun_rule_descriptor(base,t):null;
   return {death_id:r.death_id,player_id:r.player_id,hero,max_hp:t.max_hp,gender:t.gender,skill_ids:[...t.skill_ids]};
  }).filter(r=>r.hero);
 },
 async apply_yizhuang(actor,death_id,{transition_id}={}){
  if(typeof transition_id!=='string'||!transition_id)throw Error('易装需要稳定事务标识');
  const actor_id=this.player_id(actor),signature=JSON.stringify([actor_id,death_id]);
  let pending=pendingTransforms.get(this);if(!pending){pending=new Map();pendingTransforms.set(this,pending);}
  const running=pending.get(transition_id);
  if(running){if(running.signature!==signature)throw Error('易装事务身份冲突');return running.promise;}
  const existingApi=cache.get(this)??(this.hero_lifecycle_state?lifecycle(this):null);
  const existing=existingApi?.transition_receipt(transition_id);
  if(existing){if(existing.request.actor_id!==actor_id||existing.request.death_id!==death_id)throw Error('易装事务身份冲突');if(existing.status==='committed'){drain(this,existingApi,actor);return {...existing.result,transformed:true};}}
  const promise=(async()=>{

  if(!this.is_own_play_phase(actor)||rule_hero(actor)?.id!==HUA||!this.yizhuang_candidates(actor).some(c=>c.death_id===death_id))return false;
  if(typeof transition_id!=='string'||!transition_id)throw Error('易装需要稳定事务标识');
  this.initialize_general_skill_ledger?.();
  const api=lifecycle(this),id=this.player_id(actor),prior=api.transition_receipt(transition_id);
  if(prior?.status==='committed')return prior.result;
  api.update_vitals(id,{current_hp:actor.hp});
  const before=api.player_state(id);
  const receipt=await api.replace_from_death({transition_id,actor_id:id,death_id,expected_revision:before.revision});
  const form=api.effective_form(id),donor=hero_by_id(form.template.hero_id);
  // Clone the trusted full rule descriptor, never the donor Player or donor state.
  // Original identity and its faction are preserved separately on actor.hero.
  install_form(this,actor,form);
  await this.sync_general_skill_template?.(actor,{transition_id});
  drain(this,api,actor);this.guard_state_changed?.();
  if(donor.id==='sgs.mobile.base.hero.liu-ye')this.initialize_derived_equipment(Card);
  this.view.emit(`${actor.name}发动易装，成为${donor.display_name??donor.name}的完整技能形态；阵营和控制者不变，上限${form.effective_max_hp}，当前${actor.hp}血。`,{event_type:'hero_transform',player_id:id,base_hero_id:actor.hero.id,form_hero_id:donor.id,skill_ids:[...form.template.skill_ids],max_hp:form.effective_max_hp,hp:actor.hp});
  return {...receipt.result,transformed:true};
  })();
  pending.set(transition_id,{signature,promise});
  try{return await promise;}finally{pending.delete(transition_id);}
 },
};

export const wangyunLifecycleMethods=create_wangyun_lifecycle_methods({lifecycle,persist,install_form,drain});
