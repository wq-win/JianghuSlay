/** Explicit host composition only; import never mutates the global catalog. */
import {SGS_YUEJIN_DEFINITION as definition,SGS_YUEJIN_HERO_ID as ID} from './sgs-yuejin-data.js';
import {sgs_yuejin_skill_definitions} from './sgs-yuejin-skills.js';
export function sgs_yuejin_registration({Hero,SkillHooks}){
  const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
  const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_yuejin_skill_definitions({SkillHooks});
  return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
