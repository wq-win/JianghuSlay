/** Source packet host boundaries. No hero-name dispatch. */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {guardRuntimeMethods} from './yxs-sixth-guard-runtime.js';
export const followingRuntimeMethods={
  card_loss_events_enabled(owner,options={}){
    return Boolean(options.validate)||this.youjian_events_enabled()||!!skill_hooks_for_hero(rule_hero(owner))?.after_cards_lost?.length||Boolean(this.more_discard_observers?.().length);
  },
  async after_cards_lost(owner,event){
    if(!owner||owner.dead||!event?.committed)return;
    this.record_yijiang_discard_loss?.(owner,event);
    for(const hook of skill_hooks_for_hero(rule_hero(owner))?.after_cards_lost??[])await hook(this,owner,event);
  },
  card_target_prohibited(source,target,card,context={}){
    if(!target)return false;
    return (skill_hooks_for_hero(rule_hero(target))?.prohibit_card_target??[]).some(h=>h(this,target,source,card,context));
  },
  can_trick_target(actor,target,card){return guardRuntimeMethods.can_trick_target.call(this,actor,target,card)&&!this.card_target_prohibited(actor,target,card);},
  async atomic_hand_exchange(actor,target,actor_indexes,target_indexes){
    if(!actor||!target||actor===target||actor.dead||target.dead)return false;
    const valid=(owner,indexes)=>Array.isArray(indexes)&&new Set(indexes).size===indexes.length&&indexes.every(i=>Number.isInteger(i)&&i>=0&&i<owner.hand.length);
    if(!valid(actor,actor_indexes)||!valid(target,target_indexes))return false;
    const snapshots=[[actor,actor_indexes,target],[target,target_indexes,actor]].map(([owner,indexes,recipient])=>({owner,recipient,hand_before:owner.hand.length,materials:indexes.map(index=>({zone:'hand',index,card:owner.hand[index]}))}));
    // Original Jianghu swap is atomic, not historical Dimeng's two-step exchange.
    // Commit both complete destinations before exposing any last-hand window.
    for(const s of snapshots)for(const m of [...s.materials].sort((a,b)=>b.index-a.index))s.owner.hand.splice(m.index,1);
    for(const s of snapshots)s.recipient.hand.push(...s.materials.map(m=>m.card));
    for(const s of snapshots){s.hand_after=s.owner.hand.length;for(const m of s.materials)this.copied_card_moved?.(m.card,'hand',s.recipient);}
    const move_id=`hand-exchange:${++this.hand_exchange_counter}`;
    for(const s of snapshots)if(s.materials.length)await this.after_cards_lost(s.owner,{...s,move_id,committed:true,to:'hand',visibility:'private',reason:'原子换牌',action:'exchange'});
    return true;
  },
  async recover_hp(target,amount,{source=null,source_skill=null,recovery_event_id=null,...context}={}){
    if(!target||target.dead||!Number.isInteger(amount)||amount<=0)return 0;
    const event_id=recovery_event_id??`recovery:${++this.recovery_event_counter}`;
    const key=JSON.stringify(event_id),receipts=this.recovery_event_receipts??={};
    if(receipts[key])return receipts[key].amount??0;
    const receipt=receipts[key]={event_id,target:this.seat_of(target),source:source?this.seat_of(source):null,source_skill,status:'committed',amount:target.heal(amount)};
    const event={...context,...receipt,target,source};
    if(receipt.amount>0)for(const hook of skill_hooks_for_hero(rule_hero(target))?.after_recovery??[])await hook(this,target,event);
    receipt.status='done';return receipt.amount;
  },
};
