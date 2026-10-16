/** Explicit composition only. No global roster side effects. */
import {SGS_CAOXIU_DEFINITION as definition,SGS_CAOXIU_HERO_ID as ID} from './sgs-caoxiu-data.js';
import {sgs_caoxiu_skill_definitions} from './sgs-caoxiu-skills.js';
export function sgs_caoxiu_registration({Hero,SkillHooks}){
  const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
  const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_caoxiu_skill_definitions({SkillHooks});
  return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
