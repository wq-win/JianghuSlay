import {zhangfen_vehicle} from './sgs-zhangfen-runtime.js';
/** Source-versioned derived equipment. Never passed to Deck._build(). */
const freeze=value=>{if(value&&typeof value==='object'){for(const child of Object.values(value))freeze(child);Object.freeze(value);}return value;};
export const PILICHE_ID='sgs_piliche';
export const LIUYE_HERO_ID='sgs.mobile.base.hero.liu-ye';
export const DERIVED_EQUIPMENT_CATALOG=freeze([{
  id:PILICHE_ID,source_rule_id:'sgs.derived.liuye.piliche.20210803',name:'霹雳车',base_name:'霹雳车',
  type:'武器',range:9,power:0,trait:'piliche_discard_equipment',suit:'方块',color:'红',rank:9,
  source_game:'三国杀',source_product:'sanguosha_mobile_cn',source_version:'移动版·2021-08-03刘晔技改后',
  source_variant:'移动版·2021-08-03刘晔技改后',source_status:'verified-official-adjustment',implementation_status:'implemented',
  source_urls:['https://www.sanguosha.cn/pc/news-detail-1051.html','https://wiki.biligame.com/msgs/霹雳车','https://www.taptap.cn/moment/175933234947820060'],
  ordinary_deck:false,normal_random_deck_eligible:false,initial_random_deck_copies:0,source_deck_copies:0,
  condition:'装备有效；对其他角色造成实际正数伤害后，该角色仍有可弃装备',
  effect:'可以弃置该角色当前装备区内的所有装备牌',timing:'每次实际伤害结算后；包括杀、锦囊、技能及连环伤害',
  limits:'每个受伤角色每次伤害事件一次；无每回合限制；一局仅一个实体；不忽略防具、不增加伤害',
  description:'攻击范围9。对其他角色造成伤害后，可弃置其装备区内的所有牌。普通离场不销毁。',
  acquisition:'本局包含刘晔时在游戏外创建唯一实体；破橹只能从游戏外、摸牌堆、弃牌堆获得并使用',
  adaptation_notes:'以2021-08-03官方技改为准；旧英雄页的无车即造车、黑杀无视防具和离场销毁均不沿用。与江湖混合牌堆兼容，不额外投入普通牌堆。',
  version_notes:['旧英雄HTML未同步2021技改。','旧版霹雳车与本条目不合并；社区旧版销毁说明不适用于新版。'],
  lifecycle:{kind:'unique_derived_reserve_then_ordinary_physical_card',source_hero:LIUYE_HERO_ID,source_skill:'破橹',global_physical_copies:1,
    spawn_in_draw_deck:false,ordinary_leave_destination_preserved:true,destroy_on_leave:false,can_be_stolen_or_borrowed:true,
    discard_can_later_reshuffle:true,lookup_at_turn_start:['offboard','draw_pile','discard_pile'],obtained_then_used:true},
}]);
export const DERIVED_EQUIPMENT_BY_ID=Object.freeze(Object.fromEntries(DERIVED_EQUIPMENT_CATALOG.map(d=>[d.id,d])));
export function derived_equipment_definition(cardOrId){
  if(!cardOrId)return null;
  const id=typeof cardOrId==='string'?cardOrId:cardOrId.equipment_id??cardOrId.id;
  return DERIVED_EQUIPMENT_BY_ID[id]??(typeof cardOrId==='string'?DERIVED_EQUIPMENT_CATALOG.find(d=>d.name===cardOrId)??null:null);
}
export const is_piliche=card=>card?.equipment_id===PILICHE_ID&&card?.derived_identity==='derived:sgs_piliche:1'&&!card.virtual;
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const alive=p=>!!p?.alive&&!p.dead;
const emit=(game,text,event={})=>game.view.emit(text,event);
const equipmentSlot=card=>({'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'})[card?.type];
const sourcePile=(game,zone)=>({offboard:game.offboard_cards,draw_pile:game.deck.draw_pile,discard_pile:game.deck.discard_pile})[zone];
const receipts=game=>game.derived_event_receipts??=(Object.create(null));
const physicalCount=(game,card)=>[...(game.offboard_cards??[]),...(game.sgs_zhangfen_removed_cards??[]),...(game.sgs_zhangfen_destroyed_cards??[]),...game.deck.draw_pile,...game.deck.discard_pile,...game.processing_cards,
  ...game.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...(p.sgs_painting_pile??[]),...slots.map(slot=>p[slot])])].filter(c=>c===card).length;
const discardable=(game,source,target,event)=>slots.filter(slot=>target[slot]&&game.can_discard_equipment?.(source,target,slot,event)!==false).map(slot=>({slot,card:target[slot]}));

export const derivedEquipmentMethods={
  /** Allocation is independent of RNG, and the guard survives ordinary moves.
   * Core calls once after seating, only if at least one Liu Ye is in the match. */
  initialize_derived_equipment(CardCtor){
    this.offboard_cards??=[];receipts(this);
    if(this.derived_equipment_initialized)return this.find_piliche()?.card??null;
    const def=DERIVED_EQUIPMENT_BY_ID[PILICHE_ID];
    const card=new CardCtor(def.name,def.type,{...def,equipment_id:def.id,derived_identity:'derived:sgs_piliche:1',
      source_skill:'破橹',source_hero_id:LIUYE_HERO_ID,acquisition_origin:'derived_reserve'});
    this.derived_equipment_initialized=true;this.offboard_cards.push(card);return card;
  },
  /** Only retrievable zones are searched. Cards in hands, equipment, judgment,
   * processing or character piles never count as absent or become duplicates. */
  find_piliche(){
    for(const source_zone of ['offboard','draw_pile','discard_pile']){
      const card=sourcePile(this,source_zone)?.find(is_piliche);if(card)return {card,source_zone};
    }
    return null;
  },
  async obtain_and_use_equipment(actor,card,{reason='破橹',source_zone}={}){
    const pile=sourcePile(this,source_zone),slot=equipmentSlot(card);
    if(!alive(actor)||!pile||!slot||card.virtual||physicalCount(this,card)!==1)return false;
    const index=pile.indexOf(card);if(index<0)return false;
    // Gain is committed before callbacks; a gain trigger may legitimately move
    // this card again. The later use revalidates rather than recreating it.
    pile.splice(index,1);actor.hand.push(card);
    const gain={reason,source_zone,destination:'hand',card,recipient:actor};
    emit(this,`${actor.name}因${reason}获得${card.name}。`,{event_type:'card_obtained',source_zone,card_id:card.derived_identity??card.equipment_id??null,recipient:this.seat_of(actor)});
    if(this.on_cards_obtained)await this.on_cards_obtained(actor,[card],gain);
    if(!alive(actor)||!actor.hand.includes(card)||physicalCount(this,card)!==1)return false;
    if(this.can_use_equipment_card?.(actor,card,{reason})===false)return false;
    const use_id=`use:${++this.card_use_counter}`;
    const paid=await this.consume_material(actor,{zone:'hand',index:actor.hand.indexOf(card),card},{to:'processing',reason:`${reason}·装备使用`});
    if(!paid)return false;
    emit(this,`${actor.name}因${reason}使用${card.name}。`,{event_type:'card_used',card_use_id:use_id,source_skill:reason,card_id:card.derived_identity??card.equipment_id??null,actor:this.seat_of(actor)});
    try{
      if(this.on_equipment_card_use)await this.on_equipment_card_use(actor,card,{reason,card_use_id:use_id});
      if(!alive(actor)||!this.processing_cards.includes(card)||physicalCount(this,card)!==1)return false;
      const previous=actor[slot];
      this.processing_cards.splice(this.processing_cards.indexOf(card),1);
      await this.resolve_card(actor,actor,card,{source_skill:reason,card_use_id:use_id});
      if(previous&&actor[slot]!==previous&&!this.youjian_events_enabled?.())await this.equipment_after_cards_lost?.(actor,[previous],{reason:'替换装备',zones:[slot],card_use_id:use_id});
      return actor[slot]===card;
    }finally{this.finish_processing_card(card);}
  },
  async derived_equipment_after_damage(event){
    const source=event?.source,target=event?.target;
    if(!(event?.damage>0)||!alive(source)||!target||source===target||source.weapon_disabled||!is_piliche(source.weapon))return false;
    if(!discardable(this,source,target,event).length)return false;
    const key=`piliche:${event.damage_event_id}:${this.seat_of(source)}:${this.seat_of(target)}`;
    if(!event.damage_event_id||receipts(this)[key])return false;
    receipts(this)[key]=true;const weapon=source.weapon;
    if(source.is_ai){if(this.side_of(source)===this.side_of(target))return false;}
    else{
      while(true){
        const answer=String(await this.view.ask_line(`霹雳车：是否弃置${target.name}装备区内的所有牌？`,{kind:'choice',player_id:this.seat_of(source),
          options:[{id:'activate',label:'弃置其所有装备'},{id:'cancel',label:'不发动'}],
          meta:{equipment:'霹雳车',stage:'piliche_discard',target_seat:this.seat_of(target),damage_event_id:event.damage_event_id}}));
        if(['cancel','pass','0','n'].includes(answer))return false;
        if(['activate','1','y'].includes(answer))break;
        emit(this,'请选择发动，或取消。');
      }
    }
    if(!alive(source)||source.weapon_disabled||source.weapon!==weapon||!is_piliche(source.weapon))return false;
    const current=discardable(this,source,target,event);if(!current.length)return false;
    // A single simultaneous batch: all physical destinations commit before any
    // lion/bag leave trigger or asynchronous after-loss callback can run.
    if(this.youjian_events_enabled?.()||current.some(({card})=>zhangfen_vehicle(this,card))){
      const moved=await this.public_card_loss(target,current.map(({slot,card})=>({zone:slot,index:0,card})),
        {to:'discard',visibility:'public',reason:'霹雳车',action:'discard',damage_event_id:event.damage_event_id});
      if(!moved.committed)return false;
      for(const {card} of current.filter(({card})=>this.deck.discard_pile.includes(card)))emit(this,`${target.name}因霹雳车弃置${card.name}。`);
    }else{
      for(const {slot} of current)target[slot]=null;
      this.deck.discard(current.map(({card})=>card));
      for(const {slot,card} of current){await this.equipment_on_leave?.(target,card,{slot,reason:'霹雳车'});emit(this,`${target.name}因霹雳车弃置${card.name}。`);}
      await this.equipment_after_cards_lost?.(target,current.map(({card})=>card),{reason:'霹雳车',zones:current.map(({slot})=>slot),damage_event_id:event.damage_event_id});
    }
    return true;
  },
};
