/** F0–F9 shared host adapters. Physical zones and resolved turn effects. */
import {fireRuntimeMethods} from './sgs-fire-runtime.js';
import {sgs_jiangchi_sha_prohibited,sgs_jiangchi_sha_allowance,sgs_jiangchi_attack_range,sgs_jiangchi_public_state,sgs_jiangchi_turn_finally,sgs_jiangchi_death} from './sgs-following-caozhang-skills.js';
import {sgs_following_masu_public_state} from './sgs-following-masu-skills.js';
import {sgs_jieyue_response_options,sgs_jieyue_response_valid,sgs_commit_jieyue_response,sgs_jieyue_cleanup} from './sgs-following-jieyue-skills.js';
import {card_to_dict} from './state.js';
export const yijiangFollowingRuntimeMethods={
 sha_response_prohibited(actor){return sgs_jiangchi_sha_prohibited(this,actor);},
 sha_use_prohibited(actor){return fireRuntimeMethods.sha_use_prohibited.call(this,actor)||this.sha_response_prohibited(actor);},
 sha_total_allowance(actor,base){return sgs_jiangchi_sha_allowance(this,actor,fireRuntimeMethods.sha_total_allowance.call(this,actor,base));},
 sha_attack_range(actor){return sgs_jiangchi_attack_range(this,actor,fireRuntimeMethods.sha_attack_range.call(this,actor));},
 jieyue_response_options(actor,type,context={}){if(!actor?.sgs_following_jieyue_pile?.length)return [];return sgs_jieyue_response_options(this,actor,type,context);},
 jieyue_response_valid(actor,option,context={}){return sgs_jieyue_response_valid(this,actor,option,context);},
 commit_jieyue_response(actor,type,option,context={}){return sgs_commit_jieyue_response(this,actor,type,option,context);},
 sgs_move_jieyue_pile(actor,cards,{to='hand',validate,on_committed,...options}={}){
  if(!['hand','discard'].includes(to))throw Error('节钺牌只能收回手牌或弃置');
  const pile=actor.sgs_following_jieyue_pile??[];
  return this.public_card_loss(actor,cards.map(card=>({zone:'jieyue',index:pile.indexOf(card),card})),{
   ...options,to,recipient:to==='hand'?actor:null,source_skill:'sgs.jieyue',visibility:'public',poison_exempt:true,
   action:to==='hand'?'obtain':'discard',validate,on_committed});
 },
 clear_following_jieyue_pile(actor,options={}){return sgs_jieyue_cleanup(this,actor,options);},
 following_final_death(actor){sgs_jiangchi_death(this,actor);},
 finish_following_global_turn(turn_id){for(const actor of this.all_players())sgs_jiangchi_turn_finally(this,actor,{turn_id});},
 yijiang_following_public_state(actor){
  if(!actor)return null;
  const masu=sgs_following_masu_public_state(actor),pile=actor.sgs_following_jieyue_pile??[];
  return {sanyao_used:masu.sanyao_used_phases.includes(actor.play_phase_id),jiangchi:sgs_jiangchi_public_state(this,actor),
   jieyue_count:pile.length,jieyue_cards:pile.map(card=>card_to_dict(card,{owner:actor}))};
 },
};
