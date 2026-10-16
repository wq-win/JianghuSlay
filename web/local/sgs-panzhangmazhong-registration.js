/** Explicit composition only; import never admits a hero to the production roster. */
import {SGS_PANZHANGMAZHONG_DEFINITION as definition,SGS_PANZHANGMAZHONG_HERO_ID as ID} from './sgs-panzhangmazhong-data.js';
import {sgs_panzhangmazhong_skill_definitions} from './sgs-panzhangmazhong-skills.js';
export function sgs_panzhangmazhong_registration({Hero,SkillHooks}){
 const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
 const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata),bundle=sgs_panzhangmazhong_skill_definitions({SkillHooks});
 return [{hero,hooks:bundle.hooks[ID],active:[],aliases:[...definition.aliases]}];
}
