import {sgs_bifa_lifecycle} from './sgs-chenlin-skills.js';
import {zhangfen_vehicle,zhangfen_locations,zhangfen_card_id} from './sgs-zhangfen-runtime.js';
import {rule_hero} from './effective-hero.js';
/** Zone moves commit the exact physical destination before equipment loss.
 * Returned cards are ALREADY placed; callers must not append/discard them again.
 * Unspecified remove/pop destinations use tracked processing, never limbo.
 */
import {skill_hooks_for_hero} from './skills.js';
const thenValue=(value,next)=>value&&typeof value.then==='function'?value.then(next):next(value);
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const validDestination = (to,recipient) => {
  if(!['discard','hand','processing','judgment'].includes(to))throw Error(`不支持的牌移动终点：${to}`);
  if(to==='judgment'&&!recipient?.judgment_cards)throw Error('牌移入判定区缺少接收者');
  if(to==='hand'&&!recipient?.hand)throw Error('牌移入手牌缺少接收者');
};
const place = (game,card,to,recipient) => {
  game.copied_card_moved?.(card,to,recipient);
  if(to==='discard')game.deck.discard(card);
  else if(to==='hand')recipient.hand.push(card);
  else if(to==='judgment')recipient.judgment_cards.push(card);
  else game.processing_cards.push(card);
};
export const zoneMethods={
  remove_equipment(owner,slot,{reason='移动装备',to='processing',recipient=null,armor_disabled=false,expected_card=null,on_committed=null,action=to==='discard'?'discard':to==='hand'?'obtain':'move',semantic_action=null,validate=null,...context}={}){
    if(to==='judgment')throw Error('装备不能直接移入判定区');
    if(!slots.includes(slot))return null;
    const card=owner[slot];if(!card)return null;
    if(expected_card&&card!==expected_card)throw Error('目标装备已发生变化');
    validDestination(to,recipient);
    const options={...context,to,recipient,reason,armor_disabled,visibility:'public',on_committed,action,semantic_action,validate};
    if(validate&&!validate()||options.payment===true&&this.sgs_zhangfen_payment_preflight?.(owner,[{zone:slot,index:0,card}],options)?.allowed===false)return null;
    if(zhangfen_vehicle(this,card)||this.card_loss_events_enabled?.(owner,{on_committed,validate}))return this.public_card_loss(owner,[{zone:slot,index:0,card}],options).then(result=>result.committed?card:null);
    const equipment_face={...card},action_card_family=to==='discard'&&['discard','mandatory_discard'].includes(semantic_action??action)?this.card_family?.(card):undefined;owner[slot]=null;place(this,card,to,recipient);this.record_committed_discard_categories?.(owner,[{zone:slot,card,action_card_family}],{action,semantic_action,to});
    return thenValue(on_committed?.([card]),()=>thenValue(this.equipment_on_leave?.(owner,card,{slot,reason,armor_disabled,equipment_face}),()=>card));
  },
  equip_card(owner,slot,card,options={}){
    if(!slots.includes(slot))throw Error('无效装备槽');
    if(owner[slot]===card)return card;
    if(this.sgs_zhangfen_removed_cards?.includes(card)||this.sgs_zhangfen_destroyed_cards?.includes(card))return null;
    const fromProcessing=this.processing_cards.includes(card);
    if(zhangfen_vehicle(this,card)){
      const locations=zhangfen_locations(this).filter(x=>x.card===card||zhangfen_card_id(this,x.card)===zhangfen_card_id(this,card));
      if(locations.length!==1||locations[0].zone!=='processing')return null;
    }
    const rejectEntry=()=>{
      const index=this.processing_cards.indexOf(card);
      this.view?.emit?.(`${owner.name}的大攻车阻止${card.name}进入装备区。`,{event_type:'equipment_entry_prevented',card_use_id:options.card_use_id??null});
      if(index>=0)return this.public_card_loss(null,[{zone:'processing',index,card}],{
        to:'discard',reason:'大攻车阻止其他装备进入',action:'equipment_entry_prevented',semantic_action:'equipment_entry_prevented',visibility:'public',
      }).then(()=>null);
      // Legacy direct equip callers supply an unattached physical card. Never
      // detach a card from another real source just to reject its entry.
      if(zhangfen_locations(this).some(location=>location.card===card))return null;
      this.deck.discard(card);return null;
    };
    if(this.sgs_zhangfen_entry_replacement?.(owner,card)?.prevented)return rejectEntry();
    const commit=()=>{
      // Nested replacement-loss effects may have installed a car meanwhile.
      if(this.sgs_zhangfen_entry_replacement?.(owner,card)?.prevented)return rejectEntry();
      const index=this.processing_cards.indexOf(card);if(fromProcessing&&index<0)return null;if(index>=0)this.processing_cards.splice(index,1);
      if(owner.dead||(owner.abolished_equipment_slots??[]).includes(slot)||owner[slot]) {this.deck.discard(card);return null;}
      owner[slot]=card;this.copied_card_moved?.(card,slot,owner,options);
      const entry_id=`equipment-entry:${this.equipment_entry_counter=(this.equipment_entry_counter??0)+1}`;
      const entry={...options,slot,entry_id};
      const siegeEntry=zhangfen_vehicle(this,card)?this.sgs_zhangfen_on_equipment_enter?.(owner,card,entry):null;
      return thenValue(siegeEntry,()=>thenValue(this.equipment_on_enter?.(owner,card,entry),()=>
        thenValue(this.youjian_events_enabled?.()?this.youjian_on_enter?.(owner,card,entry):null,()=>card)));
    };
    const old=owner[slot];
    return thenValue(old?this.remove_equipment(owner,slot,{reason:'替换装备',to:'discard',action:'equip_replacement',semantic_action:'equip_replacement'}):null,
      removed=>old&&removed!==old?null:commit());
  },
  clear_equipment_slot(owner,slot){return this.remove_equipment(owner,slot,{reason:'装备转换',to:'discard',action:'conversion',payment:true});},
  /** All material zones share destination-first, identity-checked movement. */
  move_card_from_zone(owner,{zone,index=0,card:expected_card=null},{to='discard',recipient=null,reason='移动牌',armor_disabled=false,delayed_identity=undefined,visibility=to==='hand'?'private':'public',on_committed=null,action=to==='discard'?'discard':to==='hand'?'obtain':'move',semantic_action=null,validate=null,...context}={}){
    if(validate&&!validate())return null;
    validDestination(to,recipient);
    if(to==='judgment'&&zone!=='judgment')throw Error('仅实体判定牌可直接转移判定区');
    if(slots.includes(zone))return this.remove_equipment(owner,zone,{...context,to,recipient,reason,armor_disabled,expected_card,on_committed,action,semantic_action,validate});
    const cards=zone==='hand'?owner.hand:zone==='judgment'?owner.judgment_cards:null;
    if(!cards||!Number.isInteger(index)||index<0||index>=cards.length)throw Error('目标牌已不存在');
    const card=cards[index];if(expected_card&&card!==expected_card)throw Error('目标牌已发生变化');
    if(this.card_loss_events_enabled?.(owner,{on_committed,validate})&&to!=='judgment')return this.public_card_loss(owner,[{zone,index,card}],{...context,to,recipient,reason,armor_disabled,visibility,on_committed,action,semantic_action,validate}).then(result=>result.committed?card:null);
    const movingIdentity=zone==='judgment'?(delayed_identity===undefined?(owner.judgment_effects??[]).find(entry=>entry.card===card):delayed_identity):null;
    if(to==='judgment'){
      const name=movingIdentity?.name??this.effective_delayed_name?.(owner,card)??card.name;
      // A transfer is not a new use: no use-distance gate, but recipient life,
      // target prohibitions and duplicate delayed identities still apply.
      if(!recipient.alive||recipient===owner||recipient.judgment_cards.some(c=>(this.effective_delayed_name?.(recipient,c)??c.name)===name)
        ||this.card_target_prohibited?.(owner,recipient,{name,type:'锦囊',effect_id:movingIdentity?.effect_id??this.effective_delayed_effect_id?.(owner,card)},{judgment_transfer:true}))return null;
    }
    const delayedIdentity=zone==='judgment'?(delayed_identity===undefined?(owner.judgment_effects??[]).find(entry=>entry.card===card):delayed_identity):null;
    this.capture_card_action_faces?.(owner,[{zone,index,card}],{action:to==='processing'?'card_use':to==='hand'?'give':'discard',to});
    const action_card_family=to==='discard'&&['discard','mandatory_discard'].includes(semantic_action??action)?this.card_family?.(card):undefined;cards.splice(index,1);if(zone==='judgment')this.clear_delayed_identity?.(owner,card);place(this,card,to,recipient);this.record_committed_discard_categories?.(owner,[{zone,card,action_card_family}],{action,semantic_action,to});
    if(to==='judgment'&&delayedIdentity){recipient.judgment_effects??=[];recipient.judgment_effects.push({...delayedIdentity,card});}
    return thenValue(on_committed?.([card]),()=>card);
  },
  pop_target_option(target,[zone,index,_label,card],options={}){
    return this.move_card_from_zone(target,{zone,index,card},{to:'processing',reason:'被获得或弃置',...options});
  },
  async finalize_death(player,context={}){
    if(player.dead)return;
    const deathHero=rule_hero(player),deathHooks=[...(skill_hooks_for_hero(deathHero)?.before_death_commit??[])];
    const pre_death_skill_ids=player.skills_disabled?[]:[...(deathHero.skill_ids??[])].filter(id=>!player.disabled_skill_ids?.includes(id));
    const pre_death_skill_binding_id=deathHooks.length?(this.general_skill_binding_id?.(player)??null):null;
    const death_cause=context.death_cause??{kind:'other',source_id:context.source?this.player_id(context.source):null,killer_id:null,damage_event_id:null};
    this.archive_dead_hero?.(player);player.dead=true;player.chained=false;this.guard_state_changed?.();
    const death_event_id=`final-death:${this.mountain_death_counter=(this.mountain_death_counter??0)+1}:${this.player_id(player)}`;
    // Pending obligation cleanup is game-scoped, independent of the dying
    // source's current skill ownership or copied identity.
    await sgs_bifa_lifecycle(this,{actor:player,kind:'death',death_event_id});
    // Dead is committed before any awaited legacy transfer or equipment loss.
    for(const hook of deathHooks)await hook(this,player,{...context,death_cause,pre_death_skill_ids,pre_death_skill_binding_id,owner_dead:true,death_event_id});
    this.following_final_death?.(player);this.next_final_death?.(player);
    await this.clear_following_jieyue_pile?.(player,{event_id:death_event_id,reason:'death'});await this.clear_sidi_qian?.(player,death_event_id);
    await this.clear_pojun_pile?.(player,{event_id:death_event_id});
    await this.clear_mountain_fields?.(player,{event_id:death_event_id,reason:'阵亡田清理'});
    this.deck.discard(player.hand.splice(0));this.deck.discard(player.judgment_cards.splice(0));player.judgment_effects=[];
    for(const slot of slots)await this.remove_equipment(player,slot,{reason:'阵亡清理',to:'discard',action:'death_cleanup',semantic_action:'death_cleanup'});
  },
};
