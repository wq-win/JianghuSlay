import {sgs_gongqi_attack_range,sgs_next_handang_turn_end,sgs_next_handang_final_death,sgs_next_handang_public_state} from './sgs-next-handang-skills.js';
import {yijiangFollowingRuntimeMethods} from './sgs-yijiang-following-runtime.js';
/** V28 source callbacks, private actor state and pure public projections. */
import {rule_hero} from './effective-hero.js';
import {sgs_fuli_public_state,sgs_fuli_can_rescue,sgs_fuli_rescue_execute} from './sgs-next-liaohua-skills.js';
import {sgs_next_bulianshi_public_state} from './sgs-next-bulianshi-skills.js';
export const yijiangNextRuntimeMethods={
 actual_attack_range(actor){return sgs_gongqi_attack_range(this,actor,actor.weapon_range);},
 sha_attack_range(actor){return sgs_gongqi_attack_range(this,actor,yijiangFollowingRuntimeMethods.sha_attack_range.call(this,actor));},
 finish_next_global_turn(turn_id){sgs_next_handang_turn_end(this,null,{turn_id});},
 next_final_death(actor){sgs_next_handang_final_death(this,actor);},
 next_dying_skill_options(actor,dying,source,entry,opportunity_id){
  // Do not initialize the general-skill ledger for unrelated rescue actors.
  // A trusted effective descriptor contains acquired/cloned Fuli as well.
  if(actor!==dying||!(rule_hero(actor)?.skill_ids??[]).includes('sgs.fuli')||!sgs_fuli_can_rescue(this,actor,entry))return [];
  const preview=sgs_fuli_public_state(this,actor);
  return [{id:'skill:sgs.fuli',skill_id:'sgs.fuli',skill:'伏枥',label:`回复至${preview.recovery_target}点并翻面（限定技；当前${preview.faction_count}种势力）`,skill_action:true,
   public_details:preview,execute:()=>sgs_fuli_rescue_execute(this,actor,source,entry,{opportunity_id})}];
 },
 yijiang_next_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[];
  if(!ids.some(id=>['sgs.dangxian','sgs.fuli','sgs.anxu','sgs.zhuiyi','sgs.gongqi','sgs.jiefan'].includes(id))&&!actor.sgs_next_liaohua_state&&!actor.sgs_next_bulianshi_state&&!actor.sgs_next_handang_state)return null;
  // Public serialization is a projection and must not lazily initialize ledgers.
  const pure=Object.create(this);pure.effective_max_hp=p=>this.effective_max_hp(p);pure.has_general_skill=(p,id)=>!p.dead&&!p.skills_disabled&&!p.disabled_skill_ids?.includes(id)&&(rule_hero(p)?.skill_ids??[]).includes(id);
  return {liaohua:ids.includes('sgs.fuli')||actor.sgs_next_liaohua_state?sgs_fuli_public_state(pure,actor):null,
   handang:ids.includes('sgs.gongqi')||actor.sgs_next_handang_state?sgs_next_handang_public_state(actor):null,
   bulianshi:ids.includes('sgs.anxu')||actor.sgs_next_bulianshi_state?sgs_next_bulianshi_public_state(actor):null};
 },
};
