/** Explicit composition only: importing this packet does not admit a hero. */
import {SGS_CAOANG_DEFINITION as definition,SGS_CAOANG_HERO_ID as ID} from './sgs-caoang-data.js';
import {sgs_caoang_skill_definitions} from './sgs-caoang-skills.js';
export function sgs_caoang_registration({Hero,SkillHooks}){
 const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
 const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_caoang_skill_definitions({SkillHooks});
 return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
