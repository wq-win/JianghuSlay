import {sgs_forest_begin_aoe,sgs_forest_finish_aoe,sgs_forest_aoe_damage_source} from './sgs-forest-assault-skills.js';
import {youjian_trick_definition} from './youjian-trick-effects.js';
import {WANGYUN_TRICK_BY_NAME} from './wangyun-card-effects.js';
import {rule_hero} from './effective-hero.js';
/** Physical trick zones and per-target counterspell windows.
 * These are Jianghu mixed-game rules, not an official deck distribution. */
import {Card,CardType,CardSuit,is_sha_card} from './models.js';
import {skill_hooks_for_hero} from './skills.js';
import {SCROLL_REGISTRY} from './scrolls.js';
import {ai_borrowed_weapon_plan} from './ai.js';
const delayed=new Set(['手捧雷','画地为牢','兵粮寸断']);
const multi=new Set(['烽火狼烟','万箭齐发']);
const select=(options,value)=>options.find(o=>o.id===value)??(/^\d+$/.test(value)?options[Number(value)-1]:null);
export const trickMethods={
  action_order(){const order=this.turn_order();const index=order.findIndex(p=>this.seat_of(p)===this.turn_actor);return index<0?order:[...order.slice(index),...order.slice(0,index)];},
  async choose_card_target(actor,targets,{card_name,stage,cancellable=true,weapon_holder_seat=null,source_skill_id=null,chosen_card_name=null}={}){
    if(!targets.length)return null;
    if(actor.is_ai)return targets.find(p=>this.side_of(p)!==this.side_of(actor))??targets[0];
    const options=targets.map(p=>({id:this.seat_of(p),label:`${p.name}（${rule_hero(p).display_name??rule_hero(p).name} · ${p.hp}血）`}));
    if(cancellable)options.push({id:'cancel',label:'取消，不消耗牌'});
    while(true){const choice=await this.view.ask_line(`${card_name}：选择目标`,{kind:'choice',player_id:this.seat_of(actor),options,meta:{card_name,stage,private_to:this.seat_of(actor),...(source_skill_id?{skill_id:source_skill_id,source_skill_id}:{}),...(chosen_card_name?{chosen_card_name}:{}),...(weapon_holder_seat?{weapon_holder_seat}:{})}});
      if(cancellable&&['cancel','0'].includes(choice))return null;
      const option=select(options,choice),target=targets.find(p=>this.seat_of(p)===option?.id);if(target)return target;
      this.view.emit('请选择有效目标。');}
  },
  borrowed_victims(holder){return this.all_players().filter(p=>p!==holder&&p.alive&&this.can_sha_target(holder,p,{allow_allies:true})&&!holder.prison_no_sha&&this.in_actual_attack_range(holder,p));},
  async prepare_card_use(actor,card,fallback,{allow_recast=true,effective_function=false,source_skill_id=null,cost_resource=null}={}){
    const validPlan=plan=>!cost_resource||this.huasheng_validate_target_plan(actor,cost_resource,card,plan);
    const validTarget=target=>validPlan({target});
    if(!effective_function&&(this.has_all_hand_as_sha(actor)||this.can_use_red_as_tao(actor,card)))return {target:fallback};
    if(card.type!==CardType.SCROLL)return {target:fallback};
    if(effective_function&&card.name==='无中生有')return validTarget(actor)?{target:actor}:null;
    if(youjian_trick_definition(card))return this.prepare_youjian_trick(actor,card,{target_filter:validTarget,source_skill_id});
    if(WANGYUN_TRICK_BY_NAME[card.name]){const plan=await this.prepare_wangyun_card_use(actor,card,{target_filter:validTarget,source_skill_id});return plan&&validPlan(plan)?plan:null;}
    if(card.name==='无懈可击'){this.view.emit('无懈可击只能在锦囊响应窗口使用。');return null;}
    if(card.name==='借刀杀人'){
      const victims=holder=>(cost_resource?this.huasheng_borrowed_victims(actor,cost_resource,holder):this.borrowed_victims(holder)).filter(v=>validPlan({target:holder,forced_target:v}));
      if(actor.is_ai){const plan=ai_borrowed_weapon_plan(this,actor);if(plan&&validPlan(plan))return plan;if(!cost_resource)return null;const choices=this.all_players().filter(p=>p!==actor&&p.alive&&p.weapon).flatMap(target=>victims(target).map(forced_target=>({target,forced_target})));return choices.find(p=>this.side_of(p.forced_target)!==this.side_of(actor))??null;}
      const holders=this.all_players().filter(p=>p!==actor&&p.alive&&p.weapon&&victims(p).length);
      const target=await this.choose_card_target(actor,holders,{card_name:card.name,stage:'borrow_weapon',source_skill_id});if(!target)return null;
      const forced_target=await this.choose_card_target(actor,victims(target),{card_name:card.name,stage:'borrow_victim',source_skill_id,weapon_holder_seat:this.seat_of(target)});return forced_target?{target,forced_target}:null;
    }
    if(card.name==='顺手牵羊'){
      let targets=this.all_players().filter(p=>p!==actor&&p.alive&&this.target_has_card(p)&&!this.is_immune_to_shunshou(p)&&this.can_use_shunshou(actor,p)&&validTarget(p));
      if(actor.is_ai){
        const allies=targets.filter(p=>this.side_of(p)===this.side_of(actor)&&p.judgment_cards.length);
        const enemies=targets.filter(p=>this.side_of(p)!==this.side_of(actor)&&this.target_card_options(p).some(o=>o[0]!=='judgment'));
        const target=allies[0]??enemies[0];return target?{target}:null;
      }
      const target=await this.choose_card_target(actor,targets,{card_name:card.name,stage:'snatch_target',source_skill_id});return target?{target}:null;
    }
    if(['釜底抽薪','过河拆桥'].includes(card.name)){
      const targets=this.all_players().filter(p=>p!==actor&&p.alive&&this.target_has_card(p)&&this.can_trick_target(actor,p,card)&&validTarget(p));
      if(actor.is_ai){const valid=targets.filter(p=>this.side_of(p)===this.side_of(actor)?p.judgment_cards.length:this.target_card_options(p).some(o=>o[0]!=='judgment'));const target=valid.find(p=>this.side_of(p)===this.side_of(actor))??valid[0];return target?{target}:null;}
      const target=await this.choose_card_target(actor,targets,{card_name:card.name,stage:'discard_target',source_skill_id});return target?{target}:null;
    }
    if(card.name==='火攻'){
      const target=await this.choose_card_target(actor,this.all_players().filter(p=>p.alive&&p.hand.length&&validTarget(p)),{card_name:card.name,stage:'fire_target',source_skill_id});return target?{target}:null;
    }
    if(card.name==='铁索连环'){
      let mode='link';if(actor.is_ai){
        const unchain=[actor,...this.alive_allies(actor)].filter(p=>p.alive&&p.chained);
        const chain=this.alive_enemies(actor).filter(p=>!p.chained);
        const targets=[];for(const p of [...unchain,...chain])if(targets.length<2&&validPlan({target:targets[0]??p,targets:[...targets,p]}))targets.push(p);
        return targets.length?{target:targets[0],targets}:allow_recast?{target:actor,recast:true}:null;
      }
      while(true){mode=await this.view.ask_line(allow_recast?'铁索连环：连环/解链，或重铸摸1张':'转换铁索连环：选择连环/解链（转换用牌不能重铸）',{kind:'choice',player_id:this.seat_of(actor),options:[{id:'link',label:'连环 / 解链（1至2名角色）'},...(allow_recast?[{id:'recast',label:'重铸，摸1张牌'}]:[]),{id:'cancel',label:'取消，不消耗牌'}],meta:{card_name:card.name,stage:'iron_chain_mode',private_to:this.seat_of(actor),...(source_skill_id?{skill_id:source_skill_id,source_skill_id}:{} )}});if(['link','cancel','0',...(allow_recast?['recast']:[])].includes(mode))break;}
      if(['cancel','0'].includes(mode))return null;if(mode==='recast')return {target:actor,recast:true};
      const targets=[];while(targets.length<2){const available=this.all_players().filter(p=>p.alive&&!targets.includes(p)&&validPlan({target:targets[0]??p,targets:[...targets,p]}));
        const options=available.map(p=>({id:this.seat_of(p),label:`${p.name}（${p.chained?'解链':'连环'}）`}));
        if(targets.length)options.push({id:'done',label:'确认这1名目标'});options.push({id:'cancel',label:'取消，不消耗牌'});
        const choice=await this.view.ask_line('铁索连环：选择1至2名不同角色',{kind:'choice',player_id:this.seat_of(actor),options,meta:{card_name:card.name,stage:'iron_chain_targets',private_to:this.seat_of(actor),...(source_skill_id?{skill_id:source_skill_id,source_skill_id}:{}),selected_seats:targets.map(p=>this.seat_of(p))}});
        if(['cancel','0'].includes(choice))return null;if(choice==='done'&&targets.length)break;
        const option=select(options,choice),target=available.find(p=>this.seat_of(p)===option?.id);if(target)targets.push(target);
      }return {target:targets[0],targets};
    }
    if(delayed.has(card.name)){
      const candidates=(['兵粮寸断','画地为牢'].includes(card.name)?this.all_players():this.alive_enemies(actor)).filter(p=>this.can_place_delayed(actor,p,card));
      const target=await this.choose_card_target(actor,candidates,{card_name:card.name,stage:'delayed_target'});return target?{target}:null;
    }
    if(validTarget(fallback))return {target:fallback};
    if(cost_resource&&multi.has(card.name)){const target=this.all_players().find(p=>p!==actor&&validTarget(p));return target?{target}:null;}
    return cost_resource?null:{target:fallback};
  },
  can_place_delayed(actor,target,card,{trick_declaration_validated=false}={}){return !this.card_target_prohibited?.(actor,target,card)&&(trick_declaration_validated||this.can_trick_target(actor,target,card))&&!!target?.alive&&target!==actor&&!target.judgment_cards.some(c=>this.effective_delayed_name(target,c)===card.name)&&(card.name!=='兵粮寸断'||skill_hooks_for_hero(rule_hero(actor))?.scroll_no_distance_limit||this.distance_between(actor,target)<=(skill_hooks_for_hero(rule_hero(actor))?.supply_shortage_distance_limit??[]).reduce((base,hook)=>hook(this,actor,card,base),1));},
  effective_delayed_name(owner,card){return (owner.judgment_effects??[]).find(e=>e.card===card)?.name??card.name;},
  effective_delayed_effect_id(owner,card){const identity=(owner.judgment_effects??[]).find(e=>e.card===card);return identity?.effect_id??({'画地为牢':'trick.skip_play','乐不思蜀':'trick.skip_play','兵粮寸断':'trick.skip_draw','手捧雷':'trick.lightning','闪电':'trick.lightning'})[this.effective_delayed_name(owner,card)]??this.effective_delayed_name(owner,card);},
  clear_delayed_identity(owner,card){const entries=owner.judgment_effects??[];const i=entries.findIndex(e=>e.card===card);if(i>=0)return entries.splice(i,1)[0];return null;},
  place_delayed_card(actor,target,view,options={}){
    if(!this.can_place_delayed(actor,target,view,options))return false;
    const materials=view.virtual?this.physical_card_materials(view):[view];
    if(materials.length!==1||materials[0].virtual)throw Error('延时牌必须对应恰好一张实体牌。');
    const physical=materials[0],index=this.processing_cards.indexOf(physical);
    if(index<0)throw Error('延时牌实体不在处理区。');
    this.processing_cards.splice(index,1);target.judgment_cards.push(physical);this.copied_card_moved?.(physical,'judgment',target);
    if(view!==physical&&(view.name!==physical.name||options.source_skill||view.source_skill)){target.judgment_effects??=[];target.judgment_effects.push({card:physical,name:view.name,source_seat:this.seat_of(actor),source_skill:options.source_skill??view.source_skill??'yxs.meihuo',effect_id:view.effect_id??options.effect_id??({'画地为牢':'trick.skip_play','兵粮寸断':'trick.skip_draw','手捧雷':'trick.lightning'})[view.name]??'trick.skip_play'});}
    this.view.emit(`${view.name}进入${target.name}的判定区，等待其判定阶段。`);return true;
  },
  async nullification_window(actor,target,card,effect_options={}){
    const effect={type:'effect',card_name:card.name,source_seat:this.seat_of(actor),target_seat:this.seat_of(target),depth:0,effect_active:true};
    const start=this.response_stack.length,counters=[];this.response_stack.push(effect);let depth=0;
    try{while(true){let countered=false;
      for(const responder of this.action_order()){
        if(!responder.alive)continue;
        const direct=responder.hand.flatMap((c,index)=>c.type===CardType.SCROLL&&c.name==='无懈可击'?[{id:`hand:${index+1}`,label:String(c),zone:'hand',index,card:c}]:[]);
        const conversions=this.jieyue_response_options?.(responder,'无懈可击',{stage:'nullification',action_kind:'use'})??[];
        const options=[...direct,...conversions.filter(m=>!direct.some(d=>d.id===m.id))];
        if(!options.length)continue;let selected;
        if(responder.is_ai){
          const cooperativeBorrow=card.name==='借刀杀人'&&!!effect_options.forced_target?.alive
            &&this.side_of(actor)===this.side_of(target)&&this.side_of(target)!==this.side_of(effect_options.forced_target);
          // AI Snatch policy commits to removing an allied delayed judgment;
          // a human's unresolved choice must not be assumed friendly.
          const cooperativeSnatch=card.name==='顺手牵羊'&&actor.is_ai&&this.side_of(actor)===this.side_of(target)
            &&target.judgment_cards.length>0;
          const helps=this.youjian_trick_effect_helps(actor,target,card)||['无中生有','五谷丰登','桃园结义'].includes(card.name)||(card.name==='铁索连环'&&target.chained)||cooperativeBorrow||cooperativeSnatch;
          const wantsEffect=this.side_of(responder)===this.side_of(target)?helps:!helps;
          if(wantsEffect===(depth%2===0))continue;selected=options[0];
        }else{
          while(true){const choice=await this.view.ask_line(`无懈可击：${depth?'反制无懈，改变':'是否抵消'}「${card.name}」对${target.name}的效果？`,{kind:'choice',player_id:this.seat_of(responder),options:[...options.map(({id,label,source_skill,source_skill_id,response_type})=>({id,label,...(source_skill?{source_skill}:{}),...(source_skill_id?{source_skill_id}:{}),...(response_type?{response_type}:{})})),{id:'pass',label:'放弃响应'}],meta:{card_name:card.name,stage:'nullification',private_to:this.seat_of(responder),target_seat:this.seat_of(target),depth,effect_active:depth%2===0}});
            if(['pass','cancel','0'].includes(choice))break;selected=select(options,choice);if(selected)break;
          }
          if(!selected)continue;
        }
        const index=responder.hand.indexOf(selected.card);if(index<0)throw Error('无懈响应牌已改变');
        let scope=null,used=null,logical=null;
        const commitUse=(view,physical)=>{scope=this.start_card_use(responder,view,{materials:[physical],sourceZones:['hand'],provenance:view.virtual?{kind:'converted',source_skill_id:'sgs.jieyue'}:{kind:'physical'}});};
        try{
          if(selected.source_skill==='sgs.jieyue'){
            const result=await this.commit_jieyue_response(responder,'无懈可击',selected,{stage:'nullification',action_kind:'use',
              response_event_id:`jieyue-counter:${this.following_response_counter=(this.following_response_counter??0)+1}`,defer_cleanup:true,on_committed:commitUse});
            if(!result.success)continue;used=selected.card;logical=result.card;
          }else{used=await this.consume_material(responder,{zone:'hand',index,card:selected.card},{to:'processing',reason:'无懈可击',on_committed:()=>commitUse(selected.card,selected.card)});logical=used;}
          if(!used)continue;
          counters.push(used);depth++;
          this.response_stack.push({type:'counter',card_name:logical.name,source_seat:this.seat_of(responder),target_seat:this.seat_of(target),depth,effect_active:depth%2===0});effect.depth=depth;effect.effect_active=depth%2===0;
          this.view.emit(`${responder.name}使用无懈可击，第${depth}层：${depth%2?'抵消':'恢复'}${card.name}对${target.name}的效果。`);
          for(const hook of skill_hooks_for_hero(rule_hero(responder))?.on_scroll_used??[])await hook(this,responder,target,logical);
          countered=true;break;
        }finally{if(scope)this.end_card_use(scope);}
      }
      if(!countered)break;
    }
    return depth%2===1;
    }finally{this.response_stack.splice(start);for(const c of counters)this.finish_processing_card(c);}
  },
  finish_processing_card(card){if(card?.virtual){let moved=false;for(const material of card.materials??[])moved=this.finish_processing_card(material)||moved;return moved;}const index=this.processing_cards.indexOf(card);if(index<0)return false;this.processing_cards.splice(index,1);this.deck.discard(card);return true;},
  async resolve_scroll(actor,target,card,options={}){
    if(card.name==='无懈可击'){this.view.emit('无懈可击只能响应锦囊效果。');return;}
    if(card.name==='铁索连环'&&options.recast){this.finish_processing_card(card);await this.draw_cards(actor,1);this.view.emit(`${actor.name}重铸铁索连环，摸1张牌。`);return;}
    const globalWangyun=['五谷丰登','桃园结义'].includes(card.name);
    if(!globalWangyun&&(this.card_target_prohibited?.(actor,target,card)||!options.trick_declaration_validated&&!this.can_trick_target(actor,target,card)))return;
    if(card.name==='决斗'&&!this.can_duel_target(actor,target,options))return;
    let targets=options.targets??(['五谷丰登','桃园结义'].includes(card.name)?this.wangyun_card_targets(actor,card):card.name==='无中生有'?[actor]:multi.has(card.name)?this.all_players().filter(p=>p!==actor&&p.alive):[target]);
    const order=this.action_order();targets=[...new Set(targets)].filter(p=>p?.alive&&!this.card_target_prohibited?.(actor,p,card)&&(options.trick_declaration_validated||this.can_trick_target(actor,p,card))).sort((a,b)=>order.indexOf(a)-order.indexOf(b));
    const card_use_id=`use:${++this.card_use_counter}`;
    options.on_card_use_committed?.({card_use_id,card_user:actor,source_card:card});
    options={...options,damage_card_identity:this.damage_card_snapshot(card),card_use_id,source_skill:options.source_skill??card.source_skill??null};
    this.view.emit(`${actor.name}使用锦囊：${card.name}。`);
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_scroll_used??[])await hook(this,actor,target,card);
    if(!actor.alive&&!globalWangyun)return;
    if(delayed.has(card.name)){
      if(!this.can_place_delayed(actor,target,card,options)){this.view.emit('该延时锦囊不能放入目标判定区。');return;}
      this.place_delayed_card(actor,target,card,options);return;
    }
    const guardUse=card.name==='决斗'?this.guard_use_context(actor,card_use_id,'duel',targets):null;
    // Resolve all legal redirects before the one aggregate protection window.
    const branches=[];for(let current of targets){
      const branch_id=`${card_use_id}:target:${this.seat_of(current)}`;
      if(guardUse){let event={source:actor,card_user:actor,target:current,kind:'duel',source_card:card,card_use_id,branch_id};event=this.guard_redirect(event,guardUse);if(event.cancelled||event.replayed)continue;event=this.guard_finalize(event,guardUse);if(event.cancelled||event.replayed)continue;current=event.target;}
      if(current?.alive)branches.push({current,branch_id});
    }
    targets=[...new Set(branches.map(b=>b.current))];
    const protectedTargets=await this.dispatch_modern_card_targets({card_use_id,history_use_id:options.history_use_id??null,card_user:actor,card,targets});
    await this.begin_wangyun_global_trick(actor,card,{card_use_id,targets});
    sgs_forest_begin_aoe(this,{card_use_id,card_user:actor,source_card:card,physical_cards:this.physical_card_materials(card),targets});let forestCompleted=false;
    try{for(const {current,branch_id} of branches){
      if(!current?.alive||this.card_target_prohibited?.(actor,current,card)||protectedTargets.cancelled_target_ids.includes(this.player_id(current)))continue;
      let skipped=false;
      const effectOptions={...options,branch_id,allow_allies:guardUse?true:options.allow_allies,menshen_resolved:true};
      const trickEvent={card,actor,source:actor,target:current,card_use_id,branch_id,targets:[...targets],default_multi:multi.has(card.name)||card.name==='铁索连环',options};
      for(const hook of skill_hooks_for_hero(rule_hero(current))?.before_trick_target_nullification??[]){if(await hook(this,current,trickEvent)){skipped=true;break;}}
      if(skipped||!current.alive)continue;
      if(this.yijiang_card_effect_invalid(current,card,{...effectOptions,method:'direct_card_effect',kind:'scroll'}))continue;
      if(await this.nullification_window(actor,current,card,options))continue;
      if(!current.alive)continue;
      if(this.equipment_card_immunity?.(actor,current,card,{kind:'scroll',nature:'normal'})){this.view.emit(`${current.name}的防具使${card.name}无效。`);continue;}
      if(youjian_trick_definition(card)){await this.resolve_youjian_trick(actor,current,card,{...effectOptions,trick_declaration_validated:true,nullification_resolved:true,nullified:false});continue;}
      if(await this.resolve_wangyun_card_effect(actor,current,card,effectOptions))continue;
      if(card.name==='决斗'){await this.resolve_duel(actor,current,card,effectOptions);continue;}
      if(card.name==='借刀杀人'){await this.resolve_borrowed_weapon(actor,current,options.forced_target);continue;}
      if(card.name==='铁索连环'){await this.set_chained(current,!current.chained,{event_id:`chain:${card_use_id}:${this.player_id(current)}`});continue;}
      if(card.name==='火攻'){await this.resolve_fire_attack(actor,current,card,effectOptions);continue;}
      if(card.name==='烽火狼烟'||card.name==='万箭齐发'){await this.require_response_or_damage(current,card.name==='烽火狼烟'?CardType.SHA:CardType.SHAN,card.name==='烽火狼烟'?'杀':'闪',1,sgs_forest_aoe_damage_source(this,card_use_id,actor),card,{...effectOptions,card_user:actor});continue;}
      const handler=SCROLL_REGISTRY[card.name];if(handler)await handler(this,actor,current,card);else this.view.emit('这个锦囊暂时没有效果。');
    }forestCompleted=true;}finally{await sgs_forest_finish_aoe(this,{card_use_id,completed:forestCompleted});this.finish_wangyun_global_trick(card,{card_use_id});}
  },
  async resolve_fire_attack(actor,target,source_card=null,effect_context={}){
    if(!target.hand.length||!actor.alive)return;
    let revealed=target.hand[0];
    if(!target.is_ai){while(true){const options=target.hand.map((c,i)=>({id:`hand:${i+1}`,label:String(c),card:c}));const choice=await this.view.ask_line('火攻：选择展示的一张手牌（保留在手中）',{kind:'choice',player_id:this.seat_of(target),options:options.map(({id,label})=>({id,label})),meta:{card_name:'火攻',stage:'fire_reveal',private_to:this.seat_of(target)}});const item=select(options,choice);if(item){revealed=item.card;break;}}}
    this.view.emit(`${target.name}火攻展示：${revealed}。`);
    const revealedSuit=this.effective_suit(revealed,target);
    const options=actor.hand.flatMap((c,i)=>this.effective_suit(c,actor)===revealedSuit?[{id:`hand:${i+1}`,label:String(c),card:c}]:[]);if(!options.length){this.view.emit(`${actor.name}没有同花色手牌，火攻结束。`);return;}
    let selected=options[0];if(!actor.is_ai){while(true){const choice=await this.view.ask_line(`火攻：可弃一张${revealedSuit}手牌，造成1点火伤`,{kind:'choice',player_id:this.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'不弃牌，结束火攻'}],meta:{card_name:'火攻',stage:'fire_pay',private_to:this.seat_of(actor),revealed_card:{name:revealed.name,suit:revealedSuit,physical_suit:revealed.suit,rank:revealed.rank},target_seat:this.seat_of(target)}});if(['cancel','0'].includes(choice))return;selected=select(options,choice);if(selected)break;}}
    const index=actor.hand.indexOf(selected.card);if(index<0)return;await this.consume_material(actor,{zone:'hand',index,card:selected.card},{reason:'火攻代价',action:'discard'});
    if(!actor.alive)return;
    await this.apply_damage(target,1,{source:actor,kind:'scroll',card_user:actor,nature:'fire',source_card,damage_card_identity:effect_context.damage_card_identity??this.damage_card_snapshot(source_card),card_use_id:effect_context.card_use_id??null,branch_id:effect_context.branch_id??null,source_skill:effect_context.source_skill??null,physical_cards:this.physical_card_materials(source_card),message:'{name}受到火攻 {damage} 点火焰伤害，剩余血量 {hp}。'});
  },
  async resolve_borrowed_weapon(caster,holder,victim){
    if(!victim?.alive||!holder.alive)return;
    const materials=this.forced_sha_materials(holder,victim);let chosen=null;
    if(holder.is_ai){if(this.side_of(holder)!==this.side_of(victim))chosen=materials[0];}
    else if(materials.length){while(true){const choice=await this.view.ask_line(`借刀杀人：对${victim.name}使用杀，否则交出武器`,{kind:'choice',player_id:this.seat_of(holder),options:[...materials.map(({id,label})=>({id,label})),{id:'refuse',label:'不出杀，将武器交给锦囊使用者'}],meta:{card_name:'借刀杀人',stage:'borrow_sha',target_seat:this.seat_of(victim)}});if(['refuse','cancel','0'].includes(choice))break;chosen=select(materials,choice);if(chosen)break;}}
    if(chosen){
      const card=await this.consume_material(holder,chosen,{to:'processing'});
      if(!card||!holder.alive){if(card)this.finish_processing_card(card);return;}
      const virtual=card.virtual||chosen.zone==='hand'&&is_sha_card(card)?card:this.material_sha(holder,card);
      try{await this.use_sha(holder,victim,`${chosen.label}（借刀杀人）`,{source_card:virtual,forced:true,source_last_hand:chosen.zone==='hand'&&holder.hand.length===0,use_provenance:virtual===card&&!card.virtual&&chosen.zone==='hand'&&is_sha_card(card)?{kind:'physical',physical_card:card}:{kind:'virtual',physical_cards:chosen.cards??[card]}});}finally{this.finish_processing_card(card);}return;
    }
    if(holder.weapon){const weapon=await this.remove_equipment(holder,'weapon',{reason:'借刀杀人',to:'hand',recipient:caster});if(weapon)this.view.emit(`${holder.name}未使用杀，${weapon.name}进入${caster.name}手牌。`);}
  },
  forced_sha_materials(actor,target,{ignore_distance=false}={}){
    const options=this.response_material_options(actor,CardType.SHA);
    if(actor.shixian_active)for(const m of this.skill_material_options(actor))if(!options.some(o=>o.id===m.id))options.push(m);
    return options.filter(m=>this.can_convert_material_to_sha(actor,target,m,{ignore_quota:true,allow_allies:true,ignore_distance}));
  },
  /** The card stays physical in processing through every replacement and effect.
   * favorable judges a successful outcome for good_for, only for AI decisions. */
  async reveal_judgment(actor,reason,{good_for=actor,favorable=null}={}){
    const card=this.deck.draw(1)[0];if(!card){this.view.emit(`${reason}：牌库为空，跳过判定。`);return null;}
    this.processing_cards.push(card);
    const event={judgment_event_id:`judgment:${++this.judgment_event_counter}`,status:'revealed',sgs_skill_receipts:{},actor,reason,card,good_for,favorable:favorable?candidate=>favorable(this.effective_card(candidate,actor,{judged_actor:actor})):null};
    this.judgment_stack.push(event);this.register_judgment_material(card,event);
    this.view.emit(`${actor.name}${reason}判定：${card}。`);
    try{
      // Each living holder receives one opportunity, in current action order.
      // A replacement does not reopen earlier holders' already-resolved window.
      for(const holder of this.action_order()){
        if(!holder.alive)continue;
        for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_judgment??[]){await hook(this,holder,event);if(event.card)this.register_judgment_material(event.card,event);}
      }
      const effective=this.effective_suit(event.card,actor,{judged_actor:actor});
      if(effective!==event.card.suit)this.view.emit(`${actor.name}${(rule_hero(actor)?.skill_ids??[]).includes('sgs.hongyan')?'红颜':'红妆'}：此判定牌的${event.card.suit}按${effective}结算。`);
      // Result is fixed independently from the physical face before acquisition.
      const finalCard=event.card,face=this.effective_card(finalCard,actor,{judged_actor:actor});
      event.result=Object.freeze({name:face.name,type:face.type,suit:face.suit,color:face.color,rank:face.rank});
      this.register_judgment_material(finalCard,event,{final_face:event.result});
      event.status='effective';
      const hooks=skill_hooks_for_hero(rule_hero(actor))?.on_judgment_effective??[];
      for(const hook of hooks)await hook(this,actor,event);
      // A result view is not a zone card. Cleanup follows only its real material,
      // and is a no-op if Tiandu has already acquired that physical card.
      return hooks.length||effective!==finalCard.suit?new Card(event.result.name,event.result.type,{...event.result,virtual:true,materials:[finalCard],fixed_judgment_result:true,judgment_event_id:event.judgment_event_id}):finalCard;
    }catch(error){event.status='failed';await this.finish_judgment_card(event.card,event);throw error;}finally{const i=this.judgment_stack.indexOf(event);if(i>=0)this.judgment_stack.splice(i,1);}
  },
  async resolve_judgment_cards(actor){
    const pending=actor.judgment_cards.slice().reverse();
    for(const physical of pending){if(!actor.alive)break;const index=actor.judgment_cards.indexOf(physical);if(index<0)continue;
      const name=this.effective_delayed_name(actor,physical),delayed_identity=this.clear_delayed_identity(actor,physical);
      const view=name===physical.name?physical:new Card(name,CardType.SCROLL,{suit:physical.suit,color:physical.color,rank:physical.rank,virtual:true,materials:[physical]});
      actor.judgment_cards.splice(index,1);this.processing_cards.push(physical);this.copied_card_moved?.(physical,'processing',actor,{judgment:true});
      try{
        if(await this.nullification_window(actor,actor,view)){
          if(name==='手捧雷')this.pass_physical_lightning(actor,physical,{name,identity:delayed_identity});
          continue;
        }
        const judgment=await this.reveal_judgment(actor,name,{favorable:c=>name==='兵粮寸断'?c.suit===CardSuit.CLUB:c.suit===CardSuit.HEART});if(!judgment)continue;
        try{
          if(name==='画地为牢'){actor.skip_play_stage=this.effective_suit(judgment,actor)!==CardSuit.HEART;if(actor.skip_play_stage)this.note_phase_skip(actor,'play','画地为牢');this.view.emit(actor.skip_play_stage?`${actor.name}画地为牢判定非红桃，跳过整个出牌阶段。`:`${actor.name}画地为牢判定红桃，正常出牌。`);}
          else if(name==='兵粮寸断'){actor.skip_draw_stage=this.effective_suit(judgment,actor)!==CardSuit.CLUB;if(actor.skip_draw_stage)this.note_phase_skip(actor,'draw','兵粮寸断');this.view.emit(actor.skip_draw_stage?`${actor.name}兵粮寸断判定非梅花，跳过整个摸牌阶段。`:`${actor.name}兵粮寸断判定梅花，正常摸牌。`);}
          else if(name==='手捧雷'){
            if(this.effective_suit(judgment,actor)===CardSuit.HEART)this.pass_physical_lightning(actor,physical,{name,identity:delayed_identity});
            else await this.apply_damage(actor,3,{source:null,kind:'delayed',nature:'thunder',source_card:view,damage_card_identity:this.damage_card_snapshot(view),physical_cards:[physical],message:'{name}手捧雷判定失败，受到 {damage} 点雷电伤害，剩余血量 {hp}。'});
          }
        }finally{await this.finish_judgment_card(judgment);}
      }finally{this.finish_processing_card(physical);}
    }
  },
  pass_physical_lightning(actor,card,{name=card.name,identity=null}={}){
    const order=this.turn_order(),start=order.indexOf(actor);let receiver=null;
    for(let n=1;n<=order.length;n++){const p=order[(start+n)%order.length];if(p.alive&&!p.judgment_cards.some(c=>this.effective_delayed_name(p,c)===name)){receiver=p;break;}}
    if(receiver){const index=this.processing_cards.indexOf(card);if(index>=0)this.processing_cards.splice(index,1);receiver.judgment_cards.push(card);if(identity||card.name!==name){receiver.judgment_effects??=[];receiver.judgment_effects.push({...identity,card,name,effect_id:'trick.lightning'});}this.copied_card_moved?.(card,'judgment',receiver);this.view.emit(`手捧雷传给${receiver.name}。`);}
  },
};
