/** Pure packet composition, no global roster mutation. */
import {SGS_LINGCAO_DEFINITION as definition,SGS_LINGCAO_HERO_ID as ID} from './sgs-lingcao-data.js';
import {sgs_lingcao_skill_definitions} from './sgs-lingcao-skills.js';
export function sgs_lingcao_registration({Hero,SkillHooks}){
 const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
 const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_lingcao_skill_definitions({SkillHooks});
 return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
