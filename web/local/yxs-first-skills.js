import {yxs_fanji_suppresses_original_budao} from './yxs-sixth-guard-skills.js';
import {rule_hero} from './effective-hero.js';
/** Historical Tencent YXS rules, normalized only at the documented Jianghu edges.
 * Source record: docs/yxs-first/specs.json. No display-name based rule dispatch. */
import {Card,CardType,is_sha_card} from './models.js';
import {ai_choose_card} from './ai.js';
import {sha_shan_swap_definitions,deck_order_empty_hand_hooks} from './second-four-skills.js';

const select=(options,value)=>options.find(o=>o.id===value)??(/^\d+$/.test(value)?options[Number(value)-1]:null);
const aliveOthers=(game,actor)=>game.all_players().filter(p=>p.alive&&p!==actor);

function prepare_shucai(game,actor){actor.shucai_given_this_turn=0;actor.shucai_healed_this_turn=0;actor.shucai_ai_used_this_turn=false;}
async function give_shucai(game,actor,target,indexes){
  if(!game.is_own_play_phase(actor)||!target?.alive||target===actor||!indexes.length)return false;
  const selected=indexes.map(index=>({zone:'hand',index,card:actor.hand[index]}));
  if(selected.some(m=>!m.card)||new Set(selected.map(m=>m.card)).size!==selected.length)return false;
  const cards=[];
  for(const material of selected){
    if(!actor.alive||!target.alive)break;
    const moved=await game.move_card_from_zone(actor,{...material,index:actor.hand.indexOf(material.card)},
      {to:'hand',recipient:target,visibility:'private',reason:'疏财'});
    if(moved)cards.push(moved);
  }
  if(!cards.length)return false;
  actor.shucai_given_this_turn=(actor.shucai_given_this_turn??0)+cards.length;
  let healed=0;
  if(actor.alive&&actor.shucai_given_this_turn>=2&&!(actor.shucai_healed_this_turn>0)){
    healed=actor.heal(1);actor.shucai_healed_this_turn=(actor.shucai_healed_this_turn??0)+healed;
  }
  game.view.emit(`${actor.name}发动疏财，交给${target.name}${cards.length}张手牌。${healed?'回复1点体力。':''}`);
  return true;
}
async function shucai(game,actor,target,args){
  if(!game.is_own_play_phase(actor)||!actor.hand.length||!aliveOthers(game,actor).length){game.view.emit('疏财：需要自己的出牌阶段、手牌及其他存活角色。');return true;}
  const initialHand=[...actor.hand];
  let indexes=[];
  if(args.length){indexes=game.parse_hand_indexes(args,actor);if(!indexes.length||indexes.length!==args.length)return false;}
  else{
    // Selection is staged; cancel at either step preserves all cards and counters.
    while(true){
      const options=actor.hand.flatMap((card,index)=>indexes.includes(index)?[]:[{id:`hand:${index+1}`,label:`手牌${index+1}：${card}`}]);
      if(indexes.length)options.push({id:'done',label:`交出选中的${indexes.length}张牌`});
      options.push({id:'cancel',label:'取消，不交牌'});
      const answer=await game.view.ask_line('疏财：选择要交出的手牌，可分次交给不同角色',{
        kind:'choice',player_id:game.seat_of(actor),options,
        meta:{skill:'疏财',stage:'give_material',private_to:game.seat_of(actor),selected_indexes:indexes.map(i=>i+1),material_zones:['hand']},
      });
      if(['cancel','0'].includes(answer))return true;if(answer==='done'&&indexes.length)break;
      const chosen=select(options,answer);if(chosen?.id.startsWith('hand:'))indexes.push(Number(chosen.id.slice(5))-1);
    }
  }
  const candidates=aliveOthers(game,actor),options=candidates.map(p=>({id:game.seat_of(p),label:`${p.name}（${rule_hero(p).display_name??rule_hero(p).name} · ${p.hp}血）`}));
  let recipient=null;
  while(!recipient){
    const answer=await game.view.ask_line('疏财：选择获得这些手牌的其他角色',{
      kind:'choice',player_id:game.seat_of(actor),options:[...options,{id:'cancel',label:'取消，不交牌'}],
      meta:{skill:'疏财',stage:'give_target',card_count:indexes.length,target_scope:'other_living'},
    });
    if(['cancel','0'].includes(answer))return true;
    const chosen=select(options,answer);recipient=candidates.find(p=>game.seat_of(p)===chosen?.id);
  }
  if(indexes.some(i=>actor.hand[i]!==initialHand[i])){game.view.emit('疏财选中的手牌已改变，本次不交牌。');return true;}
  await give_shucai(game,actor,recipient,indexes);return true;
}
async function ai_shucai(game,actor,target){
  if(!game.is_own_play_phase(actor)||!actor.hand.length||actor.shucai_ai_used_this_turn)return false;
  const foe=target?.alive?target:game.default_foe(actor);if(!foe)return false;
  // Skill dispatch precedes ordinary cards. Let the normal planner spend useful
  // attacks, tricks, healing and equipment first instead of donating that turn.
  if(ai_choose_card(game,actor,foe)!==null)return false;
  if(actor.weapon?.trait==='two_as_sha'&&actor.hand.length>=2&&game.can_use_sha(actor)
    &&game.in_attack_range(actor,foe)&&game.can_sha_target(actor,foe))return false;
  const allies=game.alive_allies(actor).sort((a,b)=>a.hand.length-b.hand.length);
  const needsHeal=actor.hp<rule_hero(actor).max_hp&&!(actor.shucai_healed_this_turn>0);
  const needed=Math.max(1,2-(actor.shucai_given_this_turn??0));
  let recipient,count;
  if(needsHeal){
    if(actor.hand.length<needed)return false;
    recipient=allies[0]??(actor.hand.length>=needed+2?game.alive_enemies(actor)[0]:null);
    count=needed;
  }else{
    // A full-health AI helps an actually depleted ally with one spare card.
    // Never repeatedly dump surplus into an already stocked teammate's hand.
    recipient=allies.find(ally=>ally.hand.length<2);
    if(actor.hand.length<=Math.max(2,actor.hp))return false;
    count=1;
  }
  if(!recipient)return false;
  const indexes=game.skill_material_options(actor).filter(m=>m.zone==='hand')
    .sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b)||a.index-b.index).slice(0,count).map(m=>m.index);
  const used=await give_shucai(game,actor,recipient,indexes);
  if(used)actor.shucai_ai_used_this_turn=true;
  return used;
}

async function bianfa(game,actor,event){
  const options=game.skill_material_options(actor);if(!options.length||!actor.alive)return;
  let chosen=null;
  if(actor.is_ai){
    if(typeof event.favorable!=='function'||!event.good_for)return;
    const wanted=game.side_of(actor)===game.side_of(event.good_for);
    if(Boolean(event.favorable(event.card))===wanted)return;
    chosen=options.filter(m=>Boolean(event.favorable(m.card))===wanted)
      .sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b))[0];
    if(!chosen)return;
  }else{
    while(!chosen){
      const answer=await game.view.ask_line(`变法：是否替换${event.actor.name}「${event.reason}」的判定牌 ${event.card}？`,{
        kind:'choice',player_id:game.seat_of(actor),
        options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不改判'}],
        meta:{skill:'变法',stage:'replace_judgment',private_to:game.seat_of(actor),judged_seat:game.seat_of(event.actor),reason:event.reason,
          judgment_card:{name:event.card.name,suit:event.card.suit,rank:event.card.rank,color:event.card.color},material_zones:['hand','weapon','armor','offensive_horse','defensive_horse']},
      });
      if(['pass','cancel','0'].includes(answer))return;chosen=select(options,answer);
    }
  }
  // Destination-first: the old judgment is already discarded when equipment
  // leave draws can reshuffle. The replacement itself is never in the discard.
  if(!actor.alive||!game.skill_material_options(actor).some(m=>m.id===chosen.id&&m.card===chosen.card)){game.view.emit('变法素材已改变，本次不改判。');return;}
  if(!game.processing_cards.includes(event.card))throw Error('判定牌已不在结算区。');
  const old=event.card;
  const replacement=await game.consume_material(actor,chosen,{to:'processing',reason:'变法',on_committed:async cards=>{event.card=cards[0];game.register_judgment_material(event.card,event);await game.finish_judgment_card(old,event);}});
  if(!replacement)return;event.card=replacement;
  game.view.emit(`${actor.name}发动变法，改判为${replacement}。`);
}

async function fajia(game,actor,amount,source){
  if(!actor.alive||!source?.alive||source===actor||amount<=0)return;
  const slots=['weapon','armor','offensive_horse','defensive_horse'];
  const options=slots.filter(slot=>source[slot]).map(slot=>({id:`eq:${slot}`,slot,card:source[slot],label:`装备：${source[slot]}`}));
  if(source.hand.length)options.push({id:'hand',label:`随机获得1张手牌（共${source.hand.length}张，内容不可见）`});
  if(!options.length)return;
  let chosen;
  if(actor.is_ai){
    // Avoid needlessly taking an ally's equipment unless desperate.
    if(game.side_of(actor)===game.side_of(source)&&actor.hp>1)return;
    chosen=options[0];
  }else{
    while(!chosen){
      const answer=await game.view.ask_line(`法家：可获得伤害来源${source.name}的一张手牌或装备`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不发动'}],
        meta:{skill:'法家',stage:'damage_take',source_seat:game.seat_of(source),target_zones:['hand','weapon','armor','offensive_horse','defensive_horse']},
      });
      if(['pass','cancel','0'].includes(answer))return;chosen=select(options,answer);
    }
  }
  if(!actor.alive||!source.alive)return;
  if(chosen.id==='hand'){
    if(!source.hand.length)return;
    const index=Math.floor(game.rng.random()*source.hand.length);
    const moved=await game.move_card_from_zone(source,{zone:'hand',index,card:source.hand[index]},
      {to:'hand',recipient:actor,visibility:'private',reason:'法家'});
    if(!moved)return;
    game.view.emit(`${actor.name}发动法家，获得${source.name}的1张手牌。`);
  }else{
    if(source[chosen.slot]!==chosen.card){game.view.emit('法家选择的装备已改变，本次不获得。');return;}
    const card=await game.remove_equipment(source,chosen.slot,{to:'hand',recipient:actor,reason:'法家',expected_card:chosen.card});
    if(card)game.view.emit(`${actor.name}发动法家，获得${source.name}的${card}。`);
  }
}

async function budao(game,actor,event){
  if(yxs_fanji_suppresses_original_budao(game,event))return;
  const target=event.target;
  if(game.turn_actor===game.seat_of(actor)||!actor.alive||!target?.alive||target===actor||event.damage<=0||event.kind!=='sha'||event.chain_transfer)return;
  if(actor.is_ai&&game.side_of(actor)===game.side_of(target))return;
  const options=game.forced_sha_materials(actor,target).filter(m=>{
    const cards=m.cards??[m.card];return cards.every(c=>!game._budao_chain_used_cards?.has(c));
  });
  if(!options.length)return;
  let chosen=options[0];
  if(!actor.is_ai){
    while(true){
      const answer=await game.view.ask_line(`补刀：${target.name}刚受到杀伤害，可对其使用一张杀`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'pass',label:'不补刀'}],
        meta:{skill:'补刀',stage:'after_sha_damage',private_to:game.seat_of(actor),target_seat:game.seat_of(target),source_seat:game.seat_of(event.source),damage:event.damage,damage_event_id:event.damage_event_id},
      });
      if(['pass','cancel','0'].includes(answer))return;chosen=select(options,answer);if(chosen)break;
    }
  }
  const current=game.forced_sha_materials(actor,target).find(m=>m.id===chosen.id);
  if(!current||(chosen.cards?!chosen.cards.every((c,i)=>current.cards?.[i]===c):current.card!==chosen.card))return;
  if(!actor.alive||!target.alive||!game.can_convert_material_to_sha(actor,target,chosen,{ignore_quota:true,allow_allies:true}))return;
  for(const cost of chosen.cards??[chosen.card])game._budao_chain_used_cards.add(cost);
  const card=await game.consume_material(actor,chosen,{to:'processing',reason:'补刀'});
  if(!card)return;
  if(!actor.alive||!target.alive){game.finish_processing_card(card);return;}
  const physical=chosen.zone==='hand'&&is_sha_card(card)&&!card.virtual;
  const virtual=physical||card.virtual?card:game.material_sha(actor,card);
  try{
    await game.use_sha(actor,target,'补刀·杀',{source_card:virtual,forced:true,
      source_last_hand:chosen.zone==='hand'&&actor.hand.length===0,
      use_provenance:physical?{kind:'physical',physical_card:card}:{kind:'virtual',physical_cards:chosen.cards??[card]}});
  }finally{game.finish_processing_card(card);}
}

export function yxs_first_skill_definitions({SkillHooks,ActiveSkillDef}){
  const swap=sha_shan_swap_definitions({SkillHooks,ActiveSkillDef},'武穆');
  return {
    hooks:{
      'yxs.mobile.historical.hero.song-jiang':SkillHooks({on_prepare:[prepare_shucai]}),
      'yxs.mobile.historical.hero.lu-zhi-shen':SkillHooks({before_draw:[(g,a,t,count)=>count+Math.max(0,rule_hero(a).max_hp-a.hp)],ignore_lord_hp_bonus:true}),
      'yxs.mobile.historical.hero.shang-yang':SkillHooks({on_judgment:[bianfa],after_damage_resolved:[fajia]}),
      'yxs.mobile.historical.hero.liu-bo-wen':deck_order_empty_hand_hooks({SkillHooks},'占卜'),
      'yxs.mobile.historical.hero.guan-yu':SkillHooks({distance_modifier:-1,after_any_sha_damage:[budao]}),
      'yxs.mobile.historical.hero.yue-fei':swap.hooks,
    },
    active:{
      'yxs.mobile.historical.hero.song-jiang':[new ActiveSkillDef({skill_id:'疏财',hotkey:'q',help_text:'疏财：交给其他角色任意张手牌；每回合累计交出至少2张时至多回复1点体力',
        player:shucai,ai:ai_shucai,arg_mode:'cards',min_cards:1,max_cards:0,card_filter:'any',button_label:'疏财',
        available:(g,a)=>g.is_own_play_phase(a)&&a.hand.length>0&&aliveOthers(g,a).length>0})],
      'yxs.mobile.historical.hero.yue-fei':swap.active,
    },
  };
}
