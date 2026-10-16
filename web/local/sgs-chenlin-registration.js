/** Pure complete packet; the integrator owns catalog admission and global hooks. */
import {SGS_CHENLIN_DEFINITION as definition,SGS_CHENLIN_HERO_ID as ID} from './sgs-chenlin-data.js';
import {sgs_chenlin_skill_definitions} from './sgs-chenlin-skills.js';
export function sgs_chenlin_registration({Hero,SkillHooks,ActiveSkillDef}){
  const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
  const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_chenlin_skill_definitions({SkillHooks,ActiveSkillDef});
  return [{hero,hooks:bundle.hooks[ID],active:bundle.active[ID],aliases:[...definition.aliases]}];
}
