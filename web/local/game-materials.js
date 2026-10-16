import {rule_hero} from './effective-hero.js';
/** Zone-aware costs shared by conversion skills and response windows. */
import {Card,CardType, CardColor, is_sha_card} from './models.js';
import {skill_hooks_for_hero} from './skills.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const LABELS={weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'};
export const materialMethods={
  two_card_sha(actor,cards){
    const color=this.equipment_two_card_sha_color(actor,cards);
    return new Card('杀',CardType.SHA,{color,formed_effective_color:true,suit:cards.every(c=>this.effective_suit(c,actor)===this.effective_suit(cards[0],actor))?this.effective_suit(cards[0],actor):'无花色',rank:0,virtual:true,materials:[...cards]});
  },
  is_own_play_phase(actor){return this.turn_phase==='play'&&this.turn_actor===this.seat_of(actor)&&actor.alive&&!actor.skip_play_stage;},
  record_sha_activity(actor){if(this.is_own_play_phase(actor))actor.sha_activity_in_own_play=true;},
  can_pay_materials(actor,materials,context={}){return this.sgs_zhangfen_payment_preflight?.(actor,materials,context)?.allowed!==false;},
  skill_material_options(actor,{color=null,payment=true}={}){
    const options=actor.hand.map((card,index)=>({zone:'hand',index,card,id:`hand:${index+1}`,label:`手牌${index+1}：${card}`}));
    for(const slot of SLOTS)if(actor[slot])options.push({zone:slot,index:0,card:actor[slot],id:`eq:${slot}`,label:`${LABELS[slot]}：${actor[slot]}`});
    return options.filter(option=>(!payment||this.can_pay_materials(actor,[option]))&&(color===null||this.effective_color(option.card,actor)===color));
  },
  material_command_args(material){return material.zone==='hand'?[String(material.index+1)]:['eq',material.zone];},
  material_ai_cost(material){
    const base={...(is_sha_card(material.card)?{[material.card.type]:3}:{}),[CardType.TAO]:5,[CardType.SHAN]:4,[CardType.WINE]:3,[CardType.SHA]:3,[CardType.SCROLL]:2}[material.card.type]??1;
    return base+(material.zone==='hand'?0:5);
  },
  // Return value has already reached its destination. Virtual multi-card SHA
  // consumes its two physical materials into discard, never the returned view.
  consume_material(actor,material,{to='discard',recipient=null,reason='转换素材',visibility=to==='hand'?'private':'public',on_committed=null,action='conversion',semantic_action=null,validate=null,...context}={}){
    const materials=material.zone==='multi_hand'?material.cards.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})):[material];
    const paymentContext={...context,to,recipient,reason,visibility,on_committed,action,semantic_action,validate,payment:true};
    if(validate&&!validate()||!this.can_pay_materials(actor,materials,paymentContext))return null;
    if(material.zone==='multi_hand'){
      if(material.cards.length!==2||new Set(material.cards).size!==2||!material.cards.every(c=>actor.hand.includes(c)))throw Error('转化的手牌已发生变化。');
      const virtual=this.two_card_sha(actor,material.cards);
      if(this.card_loss_events_enabled?.(actor,{on_committed}))return this.public_card_loss(actor,material.cards.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})),paymentContext).then(result=>result.committed?virtual:null);
      for(const card of material.cards)actor.hand.splice(actor.hand.indexOf(card),1);
      if(to==='processing')this.processing_cards.push(...material.cards);else this.deck.discard(material.cards);return virtual;
    }
    return this.move_card_from_zone(actor,material,paymentContext);
  },
  async consume_material_batch(actor,materials,{to='discard',reason='批量技能成本',action='discard',semantic_action=null,...context}={}){
    if(!materials.length||!['discard','processing'].includes(to)||context.validate&&!context.validate()||!this.can_pay_materials(actor,materials,{...context,to,action,semantic_action,payment:true}))return null;
    const cards=materials.map(m=>m.card),actionMaterials=materials.map(m=>({...m,action_card_family:to==='discard'&&['discard','mandatory_discard'].includes(semantic_action??action)?this.card_family?.(m.card):undefined}));
    const leaveFaces=new Map(materials.filter(m=>SLOTS.includes(m.zone)).map(m=>[m.card,{...m.card}]));
    if(new Set(cards).size!==cards.length||materials.some(m=>m.zone==='hand'?!actor.hand.includes(m.card):!SLOTS.includes(m.zone)||actor[m.zone]!==m.card))return null;
    if(this.card_loss_events_enabled?.(actor,context)){const result=await this.public_card_loss(actor,materials,{...context,to,reason,visibility:'public',action,semantic_action,payment:true});return result.committed&&!result.partial?cards:null;}
    this.capture_card_action_faces?.(actor,materials,{action:to==='processing'?'card_use':'discard',to});
    for(const m of materials){if(m.zone==='hand')actor.hand.splice(actor.hand.indexOf(m.card),1);else actor[m.zone]=null;}
    if(to==='processing')this.processing_cards.push(...cards);else this.deck.discard(cards);
    this.record_committed_discard_categories?.(actor,actionMaterials,{action,semantic_action,to});
    for(const m of materials.filter(m=>SLOTS.includes(m.zone)).sort((a,b)=>SLOTS.indexOf(a.zone)-SLOTS.indexOf(b.zone)))await this.equipment_on_leave?.(actor,m.card,{slot:m.zone,reason,equipment_face:leaveFaces.get(m.card)});
    await this.equipment_after_cards_lost?.(actor,cards,{reason,zones:materials.map(m=>m.zone)});
    return cards;
  },
  actor_after_material_cost(actor,material){
    if(material.zone==='hand'||material.zone==='multi_hand')return actor;
    const preview=material.zone==='field'
      ?Object.assign(Object.create(Object.getPrototypeOf(actor)),actor,{sgs_mountain_fields:(actor.sgs_mountain_fields??[]).filter(c=>c!==material.card),_distance_origin:actor._distance_origin??actor})
      :Object.assign(Object.create(Object.getPrototypeOf(actor)),actor,{[material.zone]:null,_distance_origin:actor});
    return this.general_skill_preview?.(actor,preview)??preview;
  },
  can_convert_material_to_sha(actor,target,material,{ignore_quota=false,allow_allies=true,ignore_distance=false}={}){
    if(!this.can_pay_materials(actor,material.zone==='multi_hand'?material.cards.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})):[material])||!actor.alive||!target?.alive||target===actor||(!allow_allies&&!this.alive_enemies(actor).includes(target))||!this.can_sha_target(actor,target,{allow_allies}))return false;
    const after=this.actor_after_material_cost(actor,material);
    return !after.prison_no_sha&&(ignore_quota||this.can_use_sha(after))&&(ignore_distance||this.in_attack_range(after,target));
  },
  async choose_skill_material(actor,args,{color,skill}){
    const options=this.skill_material_options(actor,{color});
    if(!options.length){this.view.emit(`${skill}没有可用的${color}色手牌或装备。`);return null;}
    if(args.length){
      let id=null;
      if(args.length===1&&/^\d+$/.test(args[0]))id=`hand:${Number(args[0])}`;
      if(args.length===2&&args[0].toLowerCase()==='eq')id=`eq:${this.normalize_equipment_slot(args[1])}`;
      if(!id)return false;
      const material=options.find(o=>o.id===id);
      if(!material)this.view.emit(`${skill}需要一张${color}色手牌或装备。`);
      return material??null;
    }
    while(true){
      const choice=await this.view.ask_line(`${skill}：选择转换的手牌或装备`,{
        kind:'choice',player_id:this.seat_of(actor),
        options:[...options.map(({id,label,source_skill,source_skill_id,response_type})=>({id,label,...(source_skill?{source_skill}:{}),...(source_skill_id?{source_skill_id}:{}),...(response_type?{response_type}:{})})),{id:'cancel',label:'取消'}],
        meta:{skill,material_zones:['hand',...SLOTS]},
      });
      if(choice==='cancel'||choice==='0')return null;
      const selected=options.find(o=>o.id===choice)??(/^\d+$/.test(choice)?options[Number(choice)-1]:null);
      if(selected)return selected;
      this.view.emit('请选择有效的手牌或装备。');
    }
  },
  response_material_options(actor,type){
    if(type===CardType.SHA&&this.sha_response_prohibited?.(actor))return [];
    const hooks=skill_hooks_for_hero(rule_hero(actor));
    const direct=this.skill_material_options(actor).filter(m=>m.zone==='hand'&&!m.card.virtual&&(type===CardType.SHA?is_sha_card(m.card):m.card.type===type));
    const extra=this.skill_material_options(actor).filter(m=>!m.card.virtual&&!direct.some(d=>d.id===m.id)&&(
      (type===CardType.SHA&&hooks?.response_sha_material_color&&this.effective_color(m.card,actor)===hooks.response_sha_material_color)
      ||(type===CardType.SHAN&&m.zone==='hand'&&hooks?.response_shan_hand_color&&this.effective_color(m.card,actor)===hooks.response_shan_hand_color)
      ||(m.zone==='hand'&&hooks?.response_sha_shan_swap&&((type===CardType.SHA&&m.card.type===CardType.SHAN)||(type===CardType.SHAN&&is_sha_card(m.card))))));
    const pairs=[];
    if(type===CardType.SHA&&actor.weapon?.trait==='two_as_sha')for(let first=0;first<actor.hand.length;first++)for(let second=first+1;second<actor.hand.length;second++){
      const cards=[actor.hand[first],actor.hand[second]];if(cards.some(c=>c.virtual))continue;pairs.push({zone:'multi_hand',cards,card:this.two_card_sha(actor,cards),id:`pair:${first+1}:${second+1}`,label:`${actor.weapon.name}：手牌${first+1} ${cards[0]} + 手牌${second+1} ${cards[1]}`});
    }
    const ordinary=[...direct,...extra,...pairs],converted=this.jieyue_response_options?.(actor,type)??[];
    return this.contextual_response_materials(actor,type,[...ordinary,...converted.filter(m=>!ordinary.some(o=>o.id===m.id))]);
  },
  async choose_response_material(actor,type,card_name,{confirmed=false,response_context={}}={}){
    const options=this.response_material_options(actor,type);if(!options.length)return null;
    const responseMeta={private_to:this.seat_of(actor),response_name:card_name,response_required:response_context.required??1,response_supplied:response_context.supplied??0,...(response_context.kind?{response_kind:response_context.kind}:{})};
    if(actor.is_ai)return options[0];
    if(!confirmed&&!await this.view.ask_confirm(`是否打出${card_name}响应？(y/n)：`,{player_id:this.seat_of(actor),meta:responseMeta}))return null;
    // Preserve legacy auto-selection, while exposing every legal Wusheng cost.
    const hooks=skill_hooks_for_hero(rule_hero(actor));
    if((!hooks?.response_sha_material_color&&!hooks?.response_material_name&&!options.some(m=>m.zone==='multi_hand'||m.source_skill==='sgs.jieyue'))||options.length===1)return options[0];
    const skill=hooks?.response_material_name??(hooks?.response_sha_material_color?'武圣':options.some(m=>m.source_skill==='sgs.jieyue')?'节钺':actor.weapon?.name??'响应');
    while(true){
      const choice=await this.view.ask_line(`选择用于响应${card_name}的牌（可用${skill}）`,{
        kind:'choice',player_id:this.seat_of(actor),options:[...options.map(({id,label,source_skill,source_skill_id,response_type})=>({id,label,...(source_skill?{source_skill}:{}),...(source_skill_id?{source_skill_id}:{}),...(response_type?{response_type}:{})})),{id:'cancel',label:'取消响应'}],
        meta:{...responseMeta,response_type:type,skill,material_zones:[...new Set(options.flatMap(m=>m.zone==='multi_hand'?['hand']:[m.zone]))]},
      });
      if(choice==='cancel'||choice==='0')return null;
      const material=options.find(o=>o.id===choice)??(/^\d+$/.test(choice)?options[Number(choice)-1]:null);
      if(material)return material;this.view.emit('请选择有效响应牌。');
    }
  },
};
