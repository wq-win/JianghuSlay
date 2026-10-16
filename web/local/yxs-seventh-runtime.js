import {rule_hero} from './effective-hero.js';
/** Integration adapters: stable actors own effects; seat order owns positions. */
import {CardType} from './models.js';
import {yxs_xiadan_modifiers,yxs_xiadan_sha_allowance,yxs_xiadan_sha_target_cap,yxs_xiadan_attack_range,yxs_xiadan_sha_prohibited} from './yxs-xiadan-skills.js';
import {yxs_nvquan_prohibits_duel} from './yxs-queen-skills.js';
export function seventh_has_skill(game,actor,skill){
 if(!actor||actor.dead||actor.skills_disabled||actor.disabled_skill_ids?.includes(skill))return false;
 if(Array.isArray(actor.effective_skill_ids))return actor.effective_skill_ids.includes(skill);
 const owned={'yxs.adapted.base.hero.ren-heng-zhi':['yxs.xiadan'],'yxs.adapted.base.hero.wu-ze-tian':['yxs.qiandu','yxs.nvquan']};
 return (owned[rule_hero(actor)?.id]??[]).includes(skill);
}
export const seventhDependencies={has_skill:seventh_has_skill};
export const seventhRuntimeMethods={
 player_id(actor){const origin=actor?._distance_origin??actor;return origin?.player_id??this.seat_of(origin);},
 sha_use_prohibited(actor){return yxs_xiadan_sha_prohibited(this,actor);},
 sha_total_allowance(actor,base){return yxs_xiadan_sha_allowance(this,actor,base);},
 sha_target_cap(actor,base=1){return yxs_xiadan_sha_target_cap(this,actor,base);},
 sha_attack_range(actor){return yxs_xiadan_attack_range(this,actor,actor.weapon_range,{card_type:CardType.SHA});},
 nvquan_prohibits_duel(actor,target){return yxs_nvquan_prohibits_duel(this,actor,target,seventhDependencies);},
 xiadan_public_state(actor){
  const mark=yxs_xiadan_modifiers(this,actor);if(!mark&&!seventh_has_skill(this,actor,'yxs.xiadan'))return null;
  const limit=actor.weapon?.trait==='unlimited_sha'?Infinity:this.get_max_sha_per_turn(actor);
  return {won:Boolean(mark?.won),lost:Boolean(mark?.lost),sha_used:actor.sha_count_this_turn,sha_limit:Number.isFinite(limit)?limit:null,sha_targets:this.sha_target_cap(actor),sha_infinite_range:this.sha_attack_range(actor)===Infinity,expires_on:'turn_end'};
 },
};
