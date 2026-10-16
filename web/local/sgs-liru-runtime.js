import {sgs_liru_validate_topdeck_cost,sgs_liru_public_state,SGS_LIRU_STATE_FIELD} from './sgs-liru-skills.js';
import {rule_hero} from './effective-hero.js';
/** Explicit install by the host; no monkey patching of the shared transaction. */
export const liruRuntimeMethods={
 sgs_liru_validate_topdeck_cost(owner,materials,options){return sgs_liru_validate_topdeck_cost(this,owner,materials,options);},
 liru_public_state(actor){return actor?.[SGS_LIRU_STATE_FIELD]||(rule_hero(actor)?.skill_ids??[]).some(id=>['sgs.juece','sgs.mieji','sgs.fencheng'].includes(id))?sgs_liru_public_state(actor,this):null;},
};
