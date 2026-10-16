import {sgs_forest_aoe_damage_source} from './sgs-forest-assault-skills.js';
import {resolve_sanjian_after_damage,sanjian_weapon_active,SANJIAN_DAMAGE_WINDOW} from './sanjian-equipment.js';
import {rule_hero} from './effective-hero.js';
import { Card, CardType, CardColor, CardSuit, is_sha_type, is_sha_card } from './models.js';
import {yxs_resolve_duel_exchange} from './yxs-queen-skills.js';
import {seventhDependencies} from './yxs-seventh-runtime.js';
import {liuye_record_damage} from './liuye-derived-skills.js';
import { HERO_SKILL_HOOKS, skill_hooks_for_hero } from './skills.js';

// Combat and reactive hooks, ported in execution order from game.py (e319484).
// Prompt-driven calls are awaited so a response resolves before combat continues.
export const combatMethods = {
  async apply_damage(target, amount, context = {}) {
    if(!target?.alive)return 0;
    const {source=null,message=null,kind=null,card_user=null,nature='normal',chain_transfer=false}=context;
    let withBonus=chain_transfer||context.source_bonus_applied?amount:this.source_damage_amount(source,target,amount,kind,card_user);
    withBonus=this.youjian_apply_sha_branch_bonus?.(withBonus,context)??withBonus;
    if(!chain_transfer&&!context.source_bonus_applied)withBonus+=this.qibao_sha_damage_bonus?.(source,target,{...context,kind})??0;
    const damage_event_id=context.damage_event_id??`damage:${this.damage_event_counter=(this.damage_event_counter??0)+1}`;
    const callbacks=[];
    const cardChannel=['sha','duel','scroll','chain','delayed','lightning'].includes(kind);
    const damage_card_identity=cardChannel?this.damage_card_snapshot(Object.hasOwn(context,'damage_card_identity')?context.damage_card_identity:context.source_card):null;
    let event={...context,damage_card_identity,source,target,amount:withBonus,damage:withBonus,kind,card_user,nature,chain_transfer,damage_event_id,
      physical_cards:context.physical_cards??this.physical_card_materials?.(context.source_card,context.use_provenance)??[],source_bonus_applied:true};
    // Source-causing prevention precedes every receiver transfer, armor cost,
    // committed damage history and elemental-chain snapshot. Each branch owns
    // its own event ID; an entirely prevented event has no damage side effects.
    if(withBonus>0&&source)for(const hook of skill_hooks_for_hero(rule_hero(source))?.before_source_damage_resolution??[]){
      await hook(this,source,event);
      if(event.prevented){event.damage=0;context.result_event=event;return 0;}
    }
    // Source hooks own this packet before optional equipment boosts; their
    // result must not depend on a siege helper being installed.
    if(!Number.isFinite(event.damage)||event.damage<0)throw Error('来源伤害时机产生无效伤害值');
    withBonus=event.prevented||event.cancelled||!target.alive?0:event.damage;event.amount=withBonus;
    // Each real damage packet owns one optional siege boost, after source prevention.
    if(withBonus>0){await this.sgs_zhangfen_source_damage(event);if(!Number.isFinite(event.damage)||event.damage<0)throw Error('攻车伤害增量无效');withBonus=event.prevented||event.cancelled?0:event.damage;event.amount=withBonus;}
    if(kind==='sha'&&source&&!context.damage_event_id)source.sha_damage_event_count=(source.sha_damage_event_count??0)+1;
    const mitigate=(receiver,ev)=>Math.max(0,this.equipment_modify_damage?this.equipment_modify_damage(receiver,withBonus,ev):withBonus-receiver.defense_bonus);
    // Original protection can prevent a damage event entirely. Otherwise transfer
    // carries pre-defense damage, keeps the source and applies final armor once.
    while(target.alive&&withBonus>0){
      // Receiver-native immunity is checked afresh after each real transfer,
      // before that receiver can pay a transfer/armor/vehicle cost. Source costs
      // already committed are retained; prior transfer continuations still run.
      event.damage=withBonus;
      for(const hook of skill_hooks_for_hero(rule_hero(target))?.before_receiver_damage_transfer??[])await hook(this,target,event);
      if(!Number.isFinite(event.damage)||event.damage<0)throw Error('受伤前防止时机产生无效伤害值');
      withBonus=event.prevented||event.cancelled||!target.alive?0:event.damage;
      event.amount=withBonus;
      if(withBonus<=0)break;
      if(mitigate(target,event)<=0)break;
      const priorHand=[...target.hand];let transfer=null;
      for(const hook of skill_hooks_for_hero(rule_hero(target))?.before_damage_transfer??[]){transfer=await hook(this,target,event);if(transfer)break;}
      if(!transfer)break;
      if(!transfer.target?.alive||transfer.target===target)break;
      // A repeated holder may transfer again, but every transfer must commit a
      // distinct hand cost. No once-per-event restriction is imposed.
      if(['yxs.manwu','sgs.tianxiang'].includes(transfer.transfer?.skill_id??(transfer.transfer?.skill==='曼舞'?'yxs.manwu':null))&&(!priorHand.includes(transfer.transfer.cost)||target.hand.includes(transfer.transfer.cost)))throw Error(`${transfer.transfer.skill}未消耗有效手牌，终止无进展转移。`);
      if(transfer.after_resolve)callbacks.push(transfer.after_resolve);
      target=transfer.target;
      event={...event,target,method:'transfer',transferred:true,armor_ignored:false,transfers:[...(event.transfers??[]),{skill:transfer.transfer?.skill,from:this.seat_of(transfer.transfer?.from),to:this.seat_of(target)}]};
    }
    let real_damage=target.alive&&withBonus>0?mitigate(target,event):0;
    if(real_damage>0){
      event={...event,target,damage:real_damage};
      for(const hook of skill_hooks_for_hero(rule_hero(target))?.before_receiving_damage_cost??[])await hook(this,target,event);
      if(!Number.isFinite(event.damage)||event.damage<0)throw Error('伤害防止时机产生无效伤害值');
      real_damage=event.prevented||event.cancelled||target.dead?0:event.damage;
    }
    if(real_damage>0&&this.equipment_commit_damage)real_damage=await this.equipment_commit_damage(target,real_damage,event);
    if(!target.alive)real_damage=0;
    event={...event,target,damage:real_damage};context.result_event=event;
    if(real_damage<=0){
      if(message)this.view.emit(message.replace(/\{(name|damage|hp)\}/g,(_,key)=>String({name:target.name,damage:0,hp:Math.max(target.hp,0)}[key])));
      for(const done of callbacks)await done(event);return 0;
    }
    // Receiver window follows final transfer and positive armor-adjusted damage,
    // before HP loss/rescue. Foreign receiving effects use this disclosed host order.
    for(const hook of skill_hooks_for_hero(rule_hero(target))?.before_receiving_damage??[])await hook(this,target,event);
    if(target.dead)return 0;
    if(!Number.isFinite(event.damage)||event.damage<0)throw Error('伤害接收时机产生无效伤害值');
    real_damage=event.prevented||event.cancelled?0:event.damage;event.damage=real_damage;
    if(real_damage<=0){for(const done of callbacks)await done(event);return 0;}
    await this.dispatch_before_any_receiving_damage(event);
    if(!Number.isFinite(event.damage)||event.damage<0)throw Error('全局伤害接收时机产生无效伤害值');
    real_damage=event.prevented||event.cancelled||target.dead?0:event.damage;event.damage=real_damage;
    if(real_damage<=0){for(const done of callbacks)await done(event);return 0;}
    await this.sgs_zhangfen_receiver_damage(event);
    if(!Number.isFinite(event.damage)||event.damage<0)throw Error('攻车/逊节防止伤害值无效');
    real_damage=event.prevented||event.cancelled||target.dead?0:event.damage;event.damage=real_damage;
    if(real_damage<=0){for(const done of callbacks)await done(event);return 0;}
    const propagates=['fire','thunder'].includes(nature)&&target.chained;
    const recipients=propagates&&!chain_transfer?this.action_order().filter(p=>p!==target&&p.alive&&p.chained):[];
    if(propagates)target.chained=false;
    // Source eligibility is fixed against the final receiver before HP loss.
    if(source)for(const hook of skill_hooks_for_hero(rule_hero(source))?.before_damage_hp_loss??[])await hook(this,source,event);
    // Snapshot receiver eligibility synchronously at the last pre-HP boundary.
    for(const hook of skill_hooks_for_hero(rule_hero(target))?.capture_before_receiver_hp_loss??[]){
      const result=hook(this,target,event);if(result&&typeof result.then==='function')throw Error('受伤资格快照必须同步');
    }
    target.hp-=real_damage;
    const legacy_receiver_eligible=target.hp>0;
    this.damage_stack??=[];this.damage_stack.push(event);
    try{
    liuye_record_damage(this,target,event);
    if(message)this.view.emit(message.replace(/\{(name|damage|hp)\}/g,(_,key)=>String({name:target.name,damage:real_damage,hp:Math.max(target.hp,0)}[key])));
    await this.check_dying(target,source,{death_cause:{kind:'damage',source_id:source?this.player_id(source):null,killer_id:source?this.player_id(source):null,damage_event_id:event.damage_event_id}});
    event.dying_resolved=true;event.damage_window='source_after_damage';
    // Host order: source intrinsic recovery, then source weapon, then receiver.
    if(source)for(const hook of skill_hooks_for_hero(rule_hero(source))?.after_source_damage??[])await hook(this,source,real_damage,target,event);
    event.damage_window=SANJIAN_DAMAGE_WINDOW;
    if(sanjian_weapon_active(this,source))await resolve_sanjian_after_damage(this,event);
    event.damage_window='receiver_after_damage';
    // Original Jianghu survivors-only skills retain eligibility at the initial
    // HP loss, so successful rescue does not grant a new original-only trigger.
    if(legacy_receiver_eligible&&target.alive)await this.trigger_on_damaged(target,real_damage,source);
    if(target.alive)for(const hook of skill_hooks_for_hero(rule_hero(target))?.after_damage_resolved??[])await hook(this,target,real_damage,source,event);
    await this.trigger_after_any_damage_resolved?.(event);
    await this.derived_equipment_after_damage?.(event);
    await this.youjian_after_damage?.(event);
    // Draw-after-transfer follows the actual receiver's rescue and damage hooks.
    for(const done of callbacks.reverse())await done(event);
    if(this.wangyun_events_enabled?.())await this.wangyun_after_damage({...event,damageOccurred:true,hpDeducted:real_damage,causal_card_use_id:event.card_use_id??null,damage_origin:event.source_card&&event.card_use_id&&['sha','duel','scroll','chain'].includes(event.kind)?'card':'independent_skill'});
    for(const receiver of recipients){
      if(!receiver.alive||!receiver.chained)continue;
      // Fixed root actual damage is shared by every recipient; never rebase on a previous branch.
      const liruH8=context.host_policy==='H8'&&['sgs.mieji','sgs.juece','sgs.fencheng'].includes(context.source_skill);
      const causal=liruH8?{host_policy:'H8',source_skill:context.source_skill,source_skill_id:context.source_skill_id??context.source_skill,causal_owner_id:context.causal_owner_id,activation_id:context.activation_id,committed_skill_effect:context.committed_skill_effect}:{};
      await this.apply_damage(receiver,real_damage,{...causal,chain_base_damage:real_damage,source:liruH8&&!source?.alive?null:source,nature,kind:'chain',method:'chain',card_user,chain_transfer:true,armor_ignored:false,
        source_card:event.source_card,damage_card_identity:event.damage_card_identity,physical_cards:event.physical_cards,card_use_id:event.card_use_id,
        branch_id:event.branch_id??null,parent_damage_event_id:event.damage_event_id,origin_damage_event_id:event.origin_damage_event_id??event.damage_event_id,
        sgs_anjian_receipt_id:event.sgs_anjian_receipt_id??null,
        message:'{name}受到连环传导 {damage} 点属性伤害，剩余血量 {hp}。'});
    }
    if(kind==='sha'&&!chain_transfer&&!context.defer_sha_reactions)await this.trigger_after_sha_damage(event);
    return real_damage;
    }finally{const i=this.damage_stack.indexOf(event);if(i>=0)this.damage_stack.splice(i,1);}
  },

  async trigger_after_sha_damage(event){
    if(event.kind!=='sha'||event.chain_transfer||event.damage<=0||!event.source||!event.target?.alive)return;
    const root=!this._budao_chain_used_cards;
    if(root)this._budao_chain_used_cards=new Set();
    try{
      for(const holder of this.action_order()){
        if(!holder.alive||!event.target.alive)continue;
        for(const hook of skill_hooks_for_hero(rule_hero(holder))?.after_any_sha_damage??[])await hook(this,holder,event);
      }
    }finally{if(root)delete this._budao_chain_used_cards;}
  },

  async lose_hp(player, amount, context={}) {
    const {source=null,reason='体力流失'}=context;
    if(!player||player.dead)return 0;
    const lost=this.youjian_modify_hp_loss?.(player,Math.max(0,amount),context)??Math.max(0,amount);player.hp-=lost;
    this.view.emit(`${player.name}因${reason}失去${lost}点体力，剩余${Math.max(player.hp,0)}。`);
    await this.check_dying(player,source,{death_cause:{kind:'hp_loss',source_id:source?this.player_id(source):null,killer_id:null,damage_event_id:null}});
    return lost;
  },

  async use_tao(player, card, { as_red = false, as_wine = false } = {}) {
    const amount = this.tao_heal_amount(player);
    player.tao_count_this_turn += 1;
    const healed = player.heal(amount);
    if (as_wine) {
      this.view.emit(`${player.name}濒死，将酒当桃使用，回复 ${healed} 点血。`);
    } else if (as_red) {
      this.view.emit(`${player.name}将${card.name}当桃使用，回复 ${healed} 点血。`);
    } else {
      this.view.emit(`${player.name}使用桃，回复 ${healed} 点血。`);
    }
    return healed;
  },

  is_red_card(card,actor=null) {
    return (this.effective_color?.(card,actor)??card.color) === CardColor.RED;
  },

  has_red_hand_as_tao(actor) {
    const hooks = skill_hooks_for_hero(rule_hero(actor));
    return hooks != null && hooks.red_hand_as_tao;
  },

  can_use_red_as_tao(actor, card) {
    if (!this.has_red_hand_as_tao(actor)) return false;
    if (actor.hp >= rule_hero(actor).max_hp) return false;
    return this.is_red_card(card,actor);
  },

  async resolve_leidian(actor, target) {
    if (!actor.leidian_pending) return;
    actor.leidian_pending = false;
    const card=await this.reveal_judgment(actor,'手捧雷',{favorable:c=>c.suit===CardSuit.HEART});
    if(!card)return;
    try{
      if((this.effective_suit?.(card,actor)??card.suit)===CardSuit.HEART){
        const receiver=this.next_living_player(actor)||target;
        receiver.leidian_pending=true;
        this.view.emit(receiver===actor?'判定为红桃，场上无其他存活角色，手捧雷仍留在自己身上。':`判定为红桃，手捧雷传给${receiver.name}。`);
      }else await this.apply_damage(actor,3,{source:target,message:'{name}手捧雷判定失败，受到 {damage} 点伤害，剩余血量 {hp}。'});
    }finally{await this.finish_judgment_card(card);}
  },

  async resolve_poison_mark(actor) {
    if(!actor.poison_mark_pending)return;
    actor.poison_mark_pending=false;
    const card=await this.reveal_judgment(actor,'毒杀标记',{favorable:c=>this.is_red_card(c,actor)});
    if(!card)return;
    try{
      actor.block_turn_draw=!this.is_red_card(card,actor);
      this.view.emit(actor.block_turn_draw?`${actor.name}判定为黑色，本回合不能摸牌。`:'判定为红色，可正常摸牌。');
    }finally{await this.finish_judgment_card(card);}
  },

  async resolve_judgment_mark(actor, target) {
    if(!actor.judgment_mark_pending)return;
    actor.judgment_mark_pending=false;
    const card=await this.reveal_judgment(actor,'女帝标记',{favorable:c=>!this.is_red_card(c,actor)});
    if(!card)return;
    try{
      if(!this.is_red_card(card,actor)){this.view.emit('判定为非红色，未受到伤害。');return;}
      await this.apply_damage(actor,1,{source:target,message:'{name}女帝标记判定成功，受到 {damage} 点伤害，剩余血量 {hp}。'});
    }finally{await this.finish_judgment_card(card);}
  },

  async check_dying(player, source = null, context = {}) {
    if (!player.dead && player.hp <= 0) await this.resolve_dying(player, source, context);
  },

  find_rescue_card_indexes(player) {
    const indexes = [];
    player.hand.forEach((card, index) => {
      if (card.type === CardType.TAO || card.type === CardType.WINE || this.can_use_red_as_tao(player, card)) {
        indexes.push(index);
      }
    });
    return indexes;
  },

  rescue_material_options(rescuer,dying){
    if(rescuer.dead||dying.dead||dying.hp>0)return [];
    const direct=rescuer.hand.flatMap((card,index)=>card.type===CardType.TAO||(rescuer===dying&&(card.type===CardType.WINE||this.can_use_red_as_tao(rescuer,card)))?[{id:`hand:${index+1}`,label:String(card),card,zone:'hand',index,skill:null}]:[]);
    const extras=(skill_hooks_for_hero(rule_hero(rescuer))?.rescue_material_options??[]).flatMap(h=>h(this,rescuer,dying));
    return [...direct,...extras.filter(m=>!direct.some(d=>d.card===m.card))];
  },
  async resolve_dying(player, source = null, context = {}) {
    const seat=this.seat_of(player);this.dying_stack??=[];if(this.dying_stack.includes(seat))return;
    this.dying_stack.push(seat);
    const death_cause=context.death_cause??{kind:'other',source_id:source?this.player_id(source):null,killer_id:null,damage_event_id:null};
    const entry={event_id:`dying:${++this.dying_event_counter}`,dying_seat:seat,death_cause};
    const deathContext={...context,source,death_cause,dying_event_id:entry.event_id};
    try{
      for(const hook of skill_hooks_for_hero(rule_hero(player))?.on_dying_entry??[]){
        const decision=await hook(this,player,source,entry);
        if(player.dead||player.hp>0)return;
        if(decision?.waive_rescue){await this.finalize_death(player,{...deathContext,reason:decision.reason??'放弃救援'});return;}
      }
      await this.trigger_any_dying_entry(player,source,entry);
      if(player.dead||player.hp>0)return;
      if(await this.trigger_opponent_dying_skills(player)){await this.finalize_death(player,deathContext);return;}
      this.view.emit(`\n${player.name}濒死（血量 ${player.hp}），从当前回合角色起依次求桃。`);
      let rescueOpportunity=0;
      for(const rescuer of this.action_order()){
        if(player.hp>0||player.dead)break;
        if(rescuer.dead||(rescuer!==player&&!rescuer.alive))continue;
        if(rescuer.is_ai&&this.side_of(rescuer)!==this.side_of(player))continue;
        while(player.hp<=0&&!player.dead&&!rescuer.dead){
          const opportunity_id=`${entry.event_id}:rescue-menu:${++rescueOpportunity}`;
          const materials=[...this.rescue_material_options(rescuer,player),...(this.next_dying_skill_options?.(rescuer,player,source,entry,opportunity_id)??[]),...(this.more_dying_skill_options?.(rescuer,player,source,entry,opportunity_id)??[])];if(!materials.length)break;
          let selected;
          if(rescuer.is_ai)selected=materials.find(m=>m.skill_action)??materials.reduce((best,m)=>this.material_ai_cost(m)<this.material_ai_cost(best)?m:best,materials[0]);
          else{
            const options=materials.map((m,i)=>({id:String(i+1),label:`${m.skill?m.skill+'：':''}${m.label}`,skill_id:m.skill_id??null,source_skill_id:m.skill_id??null,...(m.public_details?{skill_details:m.public_details}:{})}));options.push({id:'0',label:'不救，交由下一名角色'});
            while(true){
              const answer=await this.view.ask_line(`选择用于救回${player.name}的牌：`,{kind:'rescue',options,player_id:this.seat_of(rescuer),meta:{private_to:this.seat_of(rescuer),dying_seat:seat,rescuer_seat:this.seat_of(rescuer),stage:'global_rescue',hp:player.hp}});
              if(['0','cancel','pass'].includes(answer))break;
              if(/^\d+$/.test(answer)&&Number(answer)>=1&&Number(answer)<=materials.length){selected=materials[Number(answer)-1];break;}
              this.view.emit('请选择有效救援牌，或放弃本次救援。');
            }
            if(!selected)break;
          }
          if(selected.skill_action){if(!await selected.execute())break;if(!player.dead&&player.hp<=0&&await this.trigger_opponent_dying_skills(player)){await this.finalize_death(player,deathContext);return;}continue;}
          // Every rescue cost is committed once before its heal; equipment loss
          // may itself remove the dying condition (e.g. White Silver Lion).
          const used=selected.commit?await selected.commit():await this.consume_material(rescuer,selected,{to:'processing',reason:'濒死救援'});
          if(!used)break;
          try{if(!player.dead&&player.hp<=0){
            // A successful rescue is a committed card use, including off-turn
            // conversion. Its recovery uses the same exact event pipeline as
            // active healing; zone loss alone is not a Peach-use event.
            const wine=selected.card?.type===CardType.WINE&&!selected.skill;
            const rescueCard=wine||used.type===CardType.TAO?used:new Card('桃',CardType.TAO,{virtual:true,materials:this.physical_card_materials(used),suit:this.effective_suit(used,rescuer),color:this.effective_color(used,rescuer),rank:used.rank,source_skill:used.source_skill??selected.skill_id??selected.skill});
            const materials=this.physical_card_materials(rescueCard),scope=this.start_card_use(rescuer,rescueCard,{materials,sourceZones:materials.map(()=>selected.zone??'hand')});
            let healed;
            try{rescuer.tao_count_this_turn++;healed=await this.recover_hp(player,this.tao_heal_amount(rescuer),{source:rescuer,source_skill:used.source_skill??selected.skill_id??selected.skill,recovery_event_id:`${entry.event_id}:rescue:${scope.use_id}`});}
            finally{this.end_card_use(scope);}
            this.view.emit(`${rescuer.name}${selected.skill?'发动'+selected.skill:'使用'+(selected.card.type===CardType.WINE?'酒自救':'桃')}，为${player.name}回复 ${healed} 点血。`);
          }}finally{this.finish_processing_card(used);}
          if(!player.dead&&player.hp<=0&&await this.trigger_opponent_dying_skills(player)){await this.finalize_death(player,deathContext);return;}
        }
      }
      if(!player.dead&&player.hp<=0){this.view.emit(`${player.name}未获得足够救援，阵亡。`);await this.finalize_death(player,deathContext);}
    }finally{entry.closed=true;this.dying_stack.splice(this.dying_stack.lastIndexOf(seat),1);}
  },

  async trigger_on_damaged(target, amount, source = null) {
    const hooks = skill_hooks_for_hero(rule_hero(target));
    if (hooks == null) return;
    for (const handler of hooks.on_damaged) await handler(this, target, amount, source);
  },

  async trigger_opponent_dying_skills(dying) {
    for (const opponent of this.all_players()) {
      if (opponent === dying || !opponent.alive) continue;
      const hooks = skill_hooks_for_hero(rule_hero(opponent));
      if (hooks == null) continue;
      for (const handler of hooks.on_opponent_dying) {
        if (await handler(this, opponent, dying)) return true;
      }
    }
    return false;
  },

  async trigger_on_turn_start(actor, target) {
    const hooks = skill_hooks_for_hero(rule_hero(actor));
    if (hooks == null) return 0;
    let bonus = 0;
    for (const handler of hooks.on_turn_start) bonus += await handler(this, actor, target);
    return bonus;
  },

  async trigger_on_turn_end(actor, target) {
    const hooks = skill_hooks_for_hero(rule_hero(actor));
    if (hooks == null) return;
    for (const handler of hooks.on_turn_end) await handler(this, actor, target);
  },

  async trigger_on_dodge(player) {
    if (!player.alive) return;
    const hooks = skill_hooks_for_hero(rule_hero(player));
    if (hooks == null) return;
    for (const handler of hooks.on_dodge) await handler(this, player);
  },

  async trigger_on_sha_dodged(actor, target, event = {}) {
    if (!actor.alive) return;
    const hooks = skill_hooks_for_hero(rule_hero(actor));
    if (hooks == null) return;
    for (const handler of hooks.on_sha_dodged) await handler(this, actor, target, event);
  },

  async resolve_duel(actor, target, source_card=null, options={}) {
    if(!this.can_duel_target(actor,target,options)){this.view.emit('目标不能成为决斗的目标。');return;}
    if(!options.menshen_resolved){
      const card_use_id=options.card_use_id??`use:${++this.card_use_counter}`;
      const branch_id=options.branch_id??`${card_use_id}:duel:${this.seat_of(target)}`;
      const use=this.guard_use_context(actor,card_use_id,'duel',[target]);
      if(use){let event={source:actor,card_user:actor,target,kind:'duel',source_card,card_use_id,branch_id};event=this.guard_redirect(event,use);if(event.cancelled||event.replayed)return;event=this.guard_finalize(event,use);if(event.cancelled||event.replayed)return;target=event.target;}
      options={...options,card_use_id,branch_id,menshen_resolved:true,allow_allies:use?true:options.allow_allies};
    }
    const duel_id=options.card_use_id??`use:${++this.card_use_counter}`;let exchangeCounter=0;
    let attacker = target;
    let defender = actor;
    this.view.emit(`${actor.name}向${target.name}发起决斗。`);
    while (actor.alive && target.alive) {
      const required=(skill_hooks_for_hero(rule_hero(defender))?.duel_shas_required??[]).reduce((n,h)=>Math.max(n,h(this,defender,attacker)),1);
      if(required>1)this.view.emit(`${defender.name}的技能要求${attacker.name}连续打出${required}张杀。`);
      const exchange=await yxs_resolve_duel_exchange(this,{duel_id,exchange_id:`${duel_id}:${options.branch_id??this.player_id(target)}:exchange:${++exchangeCounter}`,duel_user:actor,responder:attacker,opponent:defender,base_required:required,source_card,card_use_id:duel_id,branch_id:options.branch_id??null},seventhDependencies);
      if(exchange.interrupted)return;
      if (exchange.success) {
        this.view.emit(`${attacker.name}打出杀，决斗继续。`);
        [attacker, defender] = [defender, attacker];
        continue;
      }
      await this.apply_damage(attacker, 1, {
        source: defender, kind:'duel', damage_card_identity:options.damage_card_identity??this.damage_card_snapshot(source_card), card_use_id:options.card_use_id??null,branch_id:options.branch_id??null, card_user:Object.hasOwn(options,'card_user')?options.card_user:actor, source_skill:options.source_skill??null, skill_initiator:options.skill_initiator??null, source_card,physical_cards:this.physical_card_materials?.(source_card)??[],
        message: '{name}未打出杀，受到 {damage} 点伤害，剩余血量 {hp}。',
      });
      return;
    }
  },

  async require_response_or_damage(player, card_type, card_name, damage, source = null, source_card=null, options={}) {
    if (await this.play_required_card(player, card_type, card_name,{response_context:{card_use_id:options.card_use_id??null,branch_id:options.branch_id??null,source_card}})) {
      this.view.emit(`${player.name}打出${card_name}，化解了锦囊。`);
      return;
    }
    source=sgs_forest_aoe_damage_source(this,options.card_use_id,Object.hasOwn(options,'card_user')?options.card_user:source);
    await this.apply_damage(player, damage, {
      source,source_card,damage_card_identity:options.damage_card_identity??this.damage_card_snapshot(source_card),card_use_id:options.card_use_id??null,branch_id:options.branch_id??null,source_skill:options.source_skill??source_card?.source_skill??null,physical_cards:this.physical_card_materials?.(source_card)??[],kind:'scroll',card_user:Object.hasOwn(options,'card_user')?options.card_user:source,
      message: `{name}未打出${card_name}，受到 {damage} 点伤害，剩余血量 {hp}。`,
    });
  },

  async commit_response_material(player,type,material,response_context={}){
    if(material?.source_skill==='sgs.shizhi'&&!this.response_material_options(player,type).some(m=>m.source_skill==='sgs.shizhi'&&m.card===material.card&&m.index===material.index&&m.shizhi_binding===material.shizhi_binding&&m.epoch===material.epoch))return {handled:true,success:false,reason:'矢志响应素材或技能已变化'};
    if(type===CardType.SHA&&this.sha_response_prohibited?.(player))return {handled:true,success:false,reason:'将驰本回合不能使用或打出杀'};
    if(material?.source_skill==='sgs.jieyue'&&!this.jieyue_response_valid(player,material,response_context))return {handled:true,success:false};
    if(material?.source_skill==='sgs.jieyue')response_context={...response_context,response_event_id:response_context.response_event_id??`jieyue-response:${this.following_response_counter=(this.following_response_counter??0)+1}`};
    for(const hook of skill_hooks_for_hero(rule_hero(player))?.resolve_response_material??[]){
      const result=await hook(this,player,type,material,response_context);
      if(result?.handled)return {...result,used:result.card??material.card};
    }
    const effective_face={suit:this.effective_suit(material.card,player,{zone:material.zone,action:'respond'}),color:this.effective_color(material.card,player,{zone:material.zone,action:'respond'}),rank:material.card.rank};
    const used=await this.consume_material(player,material);
    if(!used||!player.alive)return {handled:false,success:false};
    if(type===CardType.SHA)this.record_sha_activity(player);
    const event=await this.after_response_card(player,type,{...response_context,material,card:used,effective_face});
    return {handled:false,success:true,used,event};
  },

  async play_required_card(player, card_type, card_name, {dodge_blocked=false,response_context={}}={}) {
    if(card_type===CardType.SHAN&&dodge_blocked)return false;
    if(card_type===CardType.SHAN&&await this.equipment_try_bagua?.(player,{kind:'response',dodge_blocked,response_required:response_context.required??1,response_supplied:response_context.supplied??0})){await this.after_response_card(player,card_type,{...response_context,virtual:true});await this.trigger_on_dodge(player);return true;}
    const material=await this.choose_response_material(player,card_type,card_name,{response_context});
    if(!material)return false;
    const response=await this.commit_response_material(player,card_type,material,{action_kind:card_type===CardType.SHAN?'use':'play',...response_context});
    if(!response.success)return false;
    this.view.emit(`${player.name}打出${response.used}响应${card_name}。`);
    if(card_type===CardType.SHAN)await this.trigger_on_dodge(player);
    return true;
  },

  async after_response_card(player,type,context={}){
    const id=`response:${this.response_event_counter=(this.response_event_counter??0)+1}`;const event={...context,id,event_id:id,response_id:id,type,success:true,actual_card_use:context.action_kind!=='play'&&(type===CardType.SHAN||context.action_kind==='use'),turn_id:this.turn_event_counter,closed:false};
    if(event.actual_card_use)this.record_response_use_category(player,id);
    try{for(const hook of skill_hooks_for_hero(rule_hero(player))?.after_response_card??[])await hook(this,player,event);
      for(const holder of this.action_order().filter(p=>p.alive))for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_response_card??[])await hook(this,holder,player,type,event);return event;
    }finally{event.closed=true;}
  },

  async resolve_attack(actor, target, damage, context = {}) {
    const {source_card=null,dodge_blocked=false}=context;
    const canFinish=()=>target.alive&&(actor.alive||context.committed_card_effect===true&&this.resolution_should_continue());
    const immune=this.equipment_sha_immunity?.(actor,target,context);
    if(immune){this.view.emit(`${target.name}：${immune}，此杀无效。`);return;}
    const unavoidable=this.is_sha_unavoidable(actor,target);
    if(unavoidable)this.view.emit(`${actor.name}刺客发动，杀必中。`);
    let dodged=false;
    if(!dodge_blocked&&!unavoidable){
      const required=this.shans_required_to_dodge(actor,target);
      if(required>1)this.view.emit(`${actor.name}的技能要求${target.name}连续打出${required}张闪。`);
      const materials=this.response_material_options(target,CardType.SHAN);
      const bagua=!!this.equipment_has_bagua?.(target,context);
      if((materials.length>=required||bagua||((skill_hooks_for_hero(rule_hero(actor))?.allow_partial_sha_responses||(target.hand.length===1&&(skill_hooks_for_hero(rule_hero(target))?.after_cards_lost??[]).length>0))&&materials.length>0))&&await this.should_dodge(target,this.pending_sha_damage(actor,target,damage,context),{shans_required:required,actor,virtual:bagua})){
        let supplied=0;
        for(let n=0;n<required;n++){
          if(await this.equipment_try_bagua?.(target,{...context,response_required:required,response_supplied:n})){supplied++;await this.after_response_card(target,CardType.SHAN,{kind:'sha',virtual:true,required,supplied,source_card});continue;}
          const material=await this.choose_response_material(target,CardType.SHAN,'闪',{confirmed:true,response_context:{kind:'sha',required,supplied:n}});if(!material)break;
          const response=await this.commit_response_material(target,CardType.SHAN,material,{kind:'sha',action_kind:'use',required,supplied:supplied+1,source_card});if(!response.success)break;supplied++;
        }
        if(supplied===required){
          const stab=await this.youjian_resolve_stab_response(actor,target,damage,context,{required,supplied,response_hooks_complete:true,estimated_damage:this.pending_sha_damage(actor,target,damage,context)});
          if(stab.outcome==='stop'||!canFinish())return;
          if(stab.outcome!=='hit'){
          dodged=true;this.view.emit(`${target.name}打出${required>1?required+'张':''}闪，躲过了攻击。`);
          await this.trigger_on_dodge(target);await this.trigger_on_sha_dodged(actor,target,{...context,kind:'sha',source:actor,card_user:actor,target,source_card,shans_required:required,shans_supplied:supplied});
          if(!canFinish())return;
          if(await this.equipment_after_dodge?.(actor,target,{...context,amount:damage}))dodged=false;
          else {await this.try_follow_sha(actor,target,context);return;}
          }
        }
      }
    }
    if(!canFinish()||dodged)return;
    const fullDamage=damage+(this.equipment_sha_damage_bonus?.(actor,target,context)??0);
    if(await this.equipment_replace_sha_damage?.(actor,target,{...context,amount:fullDamage,damage:fullDamage}))return;
    await this.equipment_before_sha_damage?.(actor,target,{...context,amount:fullDamage,damage:fullDamage});
    if(!canFinish())return;
    const damageContext={...context,source:actor,kind:'sha',card_user:actor,sha_target:target,direct_target:target,defer_sha_reactions:true,
      message:'{name}受到 {damage} 点伤害，剩余血量 {hp}。'};
    const real_damage=await this.apply_damage(target,fullDamage,damageContext);
    if(real_damage>0){
      const finalEvent=damageContext.result_event??{...damageContext,target,source_card,damage:real_damage};
      await this.trigger_after_sha_damage(finalEvent);
      await this.after_sha_hit(actor,finalEvent.target,finalEvent);
      return finalEvent;
    }
  },

  async should_dodge(player, damage, { shans_required = 1, actor = null, virtual = false } = {}) {
    if (player.is_ai) {
      return damage >= 1 && (virtual || this.response_material_options(player,CardType.SHAN).length >= shans_required || (this.response_material_options(player,CardType.SHAN).length>0&&((skill_hooks_for_hero(rule_hero(player))?.after_response_card??[]).length>0||(player.hand.length===1&&(skill_hooks_for_hero(rule_hero(player))?.after_cards_lost??[]).length>0))));
    }
    const seat = this.seat_of(player);
    if (shans_required > 1) {
      const actor_name = actor != null ? actor.name : '对手';
      return await this.view.ask_confirm(`需要${shans_required}张闪才能躲过${actor_name}的刺杀，是否打出？(y/n，伤害 ${damage})：`, {
        player_id: seat,meta:{response_name:'闪',response_required:shans_required,response_supplied:0},
      });
    }
    return await this.view.ask_confirm(`你被杀攻击，是否打出闪？(y/n，伤害 ${damage})：`, {
      player_id: seat,
    });
  },

  async after_sha_hit(actor,target,context={}) {
    const {source_card=null,damage=0}=context;
    if(source_card?.type===CardType.BLOOD_SHA&&damage>0&&actor.alive){const healed=actor.heal(damage);this.view.emit(`${actor.name}血杀命中，回复 ${healed} 点血。`);}
    if(source_card?.type===CardType.POISON_SHA&&target.alive){target.poison_mark_pending=true;this.view.emit(`${target.name}中毒，下回合开始前判定，黑色则不能摸牌。`);}

  },

  async try_follow_sha(actor,target,context={}){
    if(actor.weapon?.trait!=='follow_sha'||!actor.alive||!target.alive)return;
    const options=this.forced_sha_materials(actor,target,{ignore_distance:!!this.equipment_follow_sha_no_distance?.(actor)});if(!options.length)return;
    let chosen=options[0];
    if(!actor.is_ai){
      if(!await this.view.ask_confirm(`${actor.weapon.name}可继续出杀，是否追杀？`,{player_id:this.seat_of(actor)}))return;
      if(options.length>1){while(true){const choice=await this.view.ask_line('追杀：选择杀或转化素材',{kind:'choice',player_id:this.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消追杀'}],meta:{equipment:actor.weapon.name,stage:'follow_sha',private_to:this.seat_of(actor)}});if(['cancel','0'].includes(choice))return;chosen=options.find(o=>o.id===choice)??(/^\d+$/.test(choice)?options[Number(choice)-1]:null);if(chosen)break;}}
    }
    const card=await this.consume_material(actor,chosen,{to:'processing'});
    if(!card||!actor.alive){if(card)this.finish_processing_card(card);return;}
    const virtual=card.virtual||chosen.zone==='hand'&&is_sha_card(card)?card:this.material_sha(actor,card);
    try{await this.use_sha(actor,target,`${actor.weapon?.name??'武器'}追杀`,{source_card:virtual,forced:true,chenyu_allowed:(actor.weapon?.equipment_id??actor.weapon?.id)==='yxs.base.equipment.panlong'?false:(context.chenyu_allowed??true),attack_chain:context.attack_chain??context.card_use_id,source_last_hand:chosen.zone==='hand'&&actor.hand.length===0,use_provenance:virtual===card&&!card.virtual&&chosen.zone==='hand'&&is_sha_card(card)?{kind:'physical',physical_card:card}:{kind:'virtual',physical_cards:chosen.cards??[card]}});}
    finally{this.finish_processing_card(card);}
  },
};
