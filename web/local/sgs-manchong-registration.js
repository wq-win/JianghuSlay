/** Pure packet composition. Importing this file never mutates the global registry. */
import {SGS_MANCHONG_DEFINITION as definition,SGS_MANCHONG_HERO_ID as ID} from './sgs-manchong-data.js';
import {sgs_manchong_skill_definitions} from './sgs-manchong-skills.js';
export function sgs_manchong_registration({Hero,SkillHooks,ActiveSkillDef}){
  const {name,max_hp,skill_name,skill_desc,...metadata}=definition;
  const hero=new Hero(name,max_hp,skill_name,skill_desc,metadata);
  const bundle=sgs_manchong_skill_definitions({SkillHooks,ActiveSkillDef});
  return [{hero,hooks:bundle.hooks[ID],active:bundle.active[ID],aliases:[...definition.aliases]}];
}
