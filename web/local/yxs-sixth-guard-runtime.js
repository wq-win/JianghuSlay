import {rule_hero} from './effective-hero.js';
/** Production wiring for the historical guard packet. No name-based dispatch. */
import {YXS_SIXTH_GUARD_RULE_IDS,yxs_kongju_prohibits,yxs_create_menshen_use_context,yxs_redirect_menshen_branch,yxs_finalize_menshen_branch,yxs_prune_menshen} from './yxs-sixth-guard-skills.js';
export function yxs_guard_has_skill(_game,actor,id){
  if(!actor||actor.dead||actor.skills_disabled||(actor.disabled_skill_ids??[]).includes(id))return false;
  const registered=rule_hero(actor)?.id===YXS_SIXTH_GUARD_RULE_IDS.qin?['yxs.fanji','yxs.menshen']:rule_hero(actor)?.id===YXS_SIXTH_GUARD_RULE_IDS.li?['yxs.kongju']:[];
  return (actor.effective_skill_ids??registered).includes(id);
}
export const guardRuntimeMethods={
  can_trick_target(actor,target,card){return !yxs_kongju_prohibits(this,target,card,{has_skill:yxs_guard_has_skill});},
  guard_state_changed(){return yxs_prune_menshen(this,{has_skill:yxs_guard_has_skill});},
  guard_use_context(actor,card_use_id,kind,targets=[]){
    this.guard_state_changed();
    const selected=new Set(targets.map(p=>this.seat_of(p)));
    if(!Object.values(this.yxs_sixth_guard_state.guards).some(r=>selected.has(r.target_id)&&r.target_id!==r.guard_id&&this.all_players().some(p=>this.seat_of(p)===r.guard_id&&p.alive)))return null;
    const use=yxs_create_menshen_use_context(this,actor,{card_use_id,kind});
    (this.yxs_sixth_card_uses??={})[card_use_id]=use;return use;
  },
  guard_redirect(event,use){
    if(!use)return event;
    return yxs_redirect_menshen_branch(this,event,use,{has_skill:yxs_guard_has_skill,defer_final_claim:true,
      validate_original:()=>true, // Caller already accepted declaration, before cost/target responses.
      validate_final:e=>e.kind==='sha'?this.can_sha_target(e.source,e.target,{allow_allies:true}):this.can_duel_target(e.source,e.target,{allow_allies:true})});
  },
  guard_finalize(event,use){
    if(!use)return event;
    return yxs_finalize_menshen_branch(this,event,use,{validate_final:e=>e.kind==='sha'?this.can_sha_target(e.source,e.target,{allow_allies:true}):this.can_duel_target(e.source,e.target,{allow_allies:true})});
  },
  guard_public_state(actor){
    const guards=this.yxs_sixth_guard_state?.guards??{},id=this.seat_of(actor),players=this.all_players();
    const valid=Object.values(guards).filter(r=>players.some(p=>this.seat_of(p)===r.guard_id&&p.alive&&yxs_guard_has_skill(this,p,'yxs.menshen'))&&players.some(p=>this.seat_of(p)===r.target_id&&p.alive));
    const mine=valid.find(r=>r.guard_id===id),name=key=>{const p=players.find(p=>this.seat_of(p)===key);return rule_hero(p)?.display_name??rule_hero(p)?.name??key;};
    return {protects:mine?{target_id:mine.target_id,target_name:name(mine.target_id),expires_on:mine.expires_on}:null,protected_by:valid.filter(r=>r.target_id===id).map(r=>({guard_id:r.guard_id,guard_name:name(r.guard_id)}))};
  },
  kongju_public_state(actor){
    if(!yxs_guard_has_skill(this,actor,'yxs.kongju'))return null;
    const h=actor.hand.length,max=this.effective_max_hp?.(actor)??rule_hero(actor).max_hp;
    return {hand_count:h,max_hp:max,skip_discard_eligible:h<=max,immune_effect_ids:h<max?['snatch','dismantle']:h>max?['prison']:[]};
  },
};
