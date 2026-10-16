/** Pure packet composition, no global roster mutation. */
import {SGS_SUNRU_DEFINITION as definition,SGS_SUNRU_HERO_ID as ID} from './sgs-sunru-data.js';
import {sgs_sunru_skill_definitions} from './sgs-sunru-skills.js';
export function sgs_sunru_registration({Hero,SkillHooks}){
 const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
 const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_sunru_skill_definitions({SkillHooks});
 return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
