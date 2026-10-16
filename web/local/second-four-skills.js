import {rule_hero} from './effective-hero.js';
/** Four source-closed mobile-base skills, explicitly adapted to Jianghu.
 * Do not identify official 空城 by a display-name substring: 韩信 is different.
 */
import {Card, CardType, CardColor, CardSuit, is_sha_card} from './models.js';

const optional = async (game, actor, skill, message) => actor.is_ai || await game.view.ask_confirm(`${skill}：${message}`, {
  player_id:game.seat_of(actor), meta:{skill},
});
const enemy = (game,actor,target) => actor.alive && target?.alive && target!==actor && game.alive_enemies(actor).includes(target);

async function longdan(game, actor, target, args, skill='龙胆') {
  if (!game.is_own_play_phase(actor) || !enemy(game,actor,target) || !game.can_use_sha(actor)
    || !game.can_sha_target(actor,target) || !game.in_attack_range(actor,target)) {
    game.view.emit(`${skill}：当前不能对该目标使用杀。`); return true;
  }
  const options=game.skill_material_options(actor).filter(m=>m.zone==='hand'&&!m.card.virtual&&m.card.type===CardType.SHAN);
  if(!options.length){game.view.emit(`${skill}：需要一张自己的闪手牌。`);return true;}
  let material;
  if(args.length){
    if(args.length!==1||!/^\d+$/.test(args[0]))return false;
    material=options.find(m=>m.index===Number(args[0])-1);
    if(!material){game.view.emit(`${skill}：只能选择自己的闪手牌。`);return true;}
  }else{
    while(!material){
      const choice=await game.view.ask_line(`${skill}：选择一张闪当普通杀`,{
        kind:'choice',player_id:game.seat_of(actor),meta:{skill:skill,material_zones:['hand']},
        options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消'}],
      });
      if(choice==='cancel'||choice==='0')return true;
      material=options.find(m=>m.id===choice)??options.find(m=>String(m.index+1)===choice);
      if(!material)game.view.emit('请选择有效的闪手牌。');
    }
  }
  if(!game.can_convert_material_to_sha(actor,target,material))return true;
  const cost=await game.consume_material(actor,material,{to:'processing'});
  if(!cost)return true;
  if(!actor.alive||!target.alive){game.finish_processing_card(cost);return true;}
  const virtual=game.material_sha(actor,cost);
  await game.use_sha(actor,target,`${skill}·${cost.name}当普通杀`,{source_card:virtual,source_last_hand:actor.hand.length===0,use_provenance:{kind:'virtual'}});
  return true;
}
async function ai_longdan(game,actor,target,skill='龙胆'){
  if(!game.is_own_play_phase(actor)||!enemy(game,actor,target)||!game.can_use_sha(actor)
    ||!game.can_sha_target(actor,target)||!game.in_attack_range(actor,target)||game.find_sha_card(actor)!==null)return false;
  const index=actor.hand.findIndex(card=>card.type===CardType.SHAN&&!card.virtual);if(index<0)return false;
  return longdan(game,actor,target,[String(index+1)],skill);
}

async function tieqi(game,actor,target){
  if(!await optional(game,actor,'铁骑',`是否对${target.name}判定？红色时该目标不能用闪响应本次杀。`))return false;
  const judgment=await game.reveal_judgment(actor,'铁骑',{favorable:c=>c.color===CardColor.RED});
  if(!judgment)return false;
  try{
    const blocked=game.effective_color(judgment,actor)===CardColor.RED;
    game.view.emit(`${actor.name}铁骑结果：${judgment}。${blocked?`${target.name}不能用闪响应本次杀。`:'本次不禁闪。'}`);
    return blocked;
  }finally{await game.finish_judgment_card(judgment);}
}
async function yingzi(game,actor,target,count){
  if(!actor.alive||!await optional(game,actor,'英姿','摸牌阶段是否多摸1张牌？'))return count;
  game.view.emit(`${actor.name}发动英姿，本次摸牌阶段多摸1张。`);return count+1;
}

async function fanjian(game,actor,target,args){
  if(args.length)return false;
  if(!game.is_own_play_phase(actor)||!enemy(game,actor,target)||!actor.hand.length||actor.used_active_skills.has('反间')){
    game.view.emit('反间：需要自己的出牌阶段、至少一张手牌，且本阶段尚未发动。');return true;
  }
  // Reserve the phase usage before the target's prompt; no hand card has yet
  // been selected, revealed or moved. AI guesses without reading Zhou's hand.
  actor.used_active_skills.add('反间');
  const suits=Object.values(CardSuit);let guess;
  if(target.is_ai)guess=game.rng.choice(suits);
  else while(!guess){
    const answer=await game.view.ask_line(`反间：${actor.name}令你先猜一种花色，再盲取其一张手牌`,{
      kind:'choice',player_id:game.seat_of(target),
      meta:{skill:'反间',stage:'guess_suit',source_seat:game.seat_of(actor)},
      options:suits.map(suit=>({id:suit,label:suit})),
    });
    guess=suits.includes(answer)?answer:(/^\d+$/.test(answer)?suits[Number(answer)-1]:null);
    if(!guess)game.view.emit('请选择红桃、方块、黑桃或梅花。');
  }
  game.view.emit(`${target.name}反间猜测：${guess}。`);
  if(!actor.alive||!target.alive||!actor.hand.length)return true;
  const selected=Math.floor(game.rng.random()*actor.hand.length);
  const card=await game.move_card_from_zone(actor,{zone:'hand',index:selected,card:actor.hand[selected]},
    {to:'hand',recipient:target,visibility:'private',reason:'反间'});
  if(!card||!actor.alive||!target.alive)return true;
  game.view.emit(`${target.name}获得并展示${actor.name}的一张手牌：${card}。`);
  if(game.effective_suit(card,target)!==guess)await game.apply_damage(target,1,{source:actor,kind:'skill',
    message:'{name}反间猜错，受到 {damage} 点伤害，剩余血量 {hp}。'});
  else game.view.emit(`${target.name}反间猜中，不受到伤害。`);
  return true;
}
async function ai_fanjian(game,actor,target){
  if(!game.is_own_play_phase(actor)||!enemy(game,actor,target)||!actor.hand.length||actor.used_active_skills.has('反间'))return false;
  // With flat armor the damage would be zero; don't donate a free card.
  if(target.defense_bonus>=1)return false;
  return fanjian(game,actor,target,[]);
}

function guanxing_value(actor,card){
  if(card.type===CardType.TAO)return actor.hp<rule_hero(actor).max_hp?12:5;
  if(card.type===CardType.SHAN)return 8;
  if(is_sha_card(card))return 7;
  if(card.type===CardType.SCROLL)return card.name==='无中生有'?10:6;
  if(card.type===CardType.ARMOR)return actor.armor?2:9;
  if(card.type===CardType.WEAPON)return actor.weapon?2:7;
  return 4;
}
function guanxing_ai_order(actor,cards){
  const remaining=cards.map((card,i)=>({card,id:String(i+1)})),top=[],bottom=[];
  // Only the holder's public marks and their legitimately viewed cards enter
  // this policy. Reserve favorable judgments in engine resolution order.
  const reserve=predicate=>{const index=remaining.findIndex(({card})=>predicate(card));if(index>=0)top.push(remaining.splice(index,1)[0].id);else if(remaining.length)top.push(remaining.shift().id);};
  for(const pending of [...(actor.judgment_cards??[])].reverse()){
    if(pending.name==='兵粮寸断')reserve(c=>c.suit===CardSuit.CLUB);
    else if(pending.name==='手捧雷')reserve(c=>c.suit===CardSuit.HEART);
  }
  if(actor.leidian_pending)reserve(c=>c.suit===CardSuit.HEART);
  if(actor.poison_mark_pending)reserve(c=>c.color===CardColor.RED);
  if(actor.judgment_mark_pending)reserve(c=>c.color===CardColor.BLACK);
  remaining.sort((a,b)=>guanxing_value(actor,b.card)-guanxing_value(actor,a.card)||Number(a.id)-Number(b.id));
  for(const entry of remaining)(top.length<2||guanxing_value(actor,entry.card)>=7?top:bottom).push(entry.id);
  return {top,bottom};
}
async function guanxing(game,actor,skill='观星'){
  if(!actor.alive||!await optional(game,actor,skill,'是否观看并调整牌堆顶的牌？'))return;
  const count=Math.min(5,game.all_players().filter(p=>p.alive).length);
  // draw() supplies the documented short-deck reshuffle. Restore the looked-at
  // cards immediately; suspended prompts never remove cards from normal zones.
  const cards=game.deck.draw(count);game.deck.draw_pile.push(...cards.slice().reverse());
  if(!cards.length){game.view.emit(`${actor.name}${skill}：牌库为空。`);return;}
  let top=[],bottom=[];
  if(actor.is_ai)({top,bottom}=guanxing_ai_order(actor,cards));
  else{
    const remaining=cards.map((_,i)=>String(i+1)),preview=cards.map((card,i)=>({id:String(i+1),label:String(card)}));
    while(remaining.length){
      const options=remaining.flatMap(id=>[
        {id:`top:${id}`,label:`置顶第${top.length+1}张：${preview[Number(id)-1].label}`},
        {id:`bottom:${id}`,label:`置底第${bottom.length+1}张：${preview[Number(id)-1].label}`},
      ]);
      const choice=await game.view.ask_line(`${skill}：逐张安排牌堆顶或底的顺序（各区先选的先摸到）`,{
        kind:'choice',player_id:game.seat_of(actor),options:[...options,{id:'cancel',label:`恢复原顺序并结束${skill}`}],
        meta:{skill:skill,remaining:[...remaining],top:[...top],bottom:[...bottom],preview,private_to:game.seat_of(actor)},
      });
      if(choice==='cancel'||choice==='0'){game.view.emit(`${actor.name}${skill}后保留原顺序。`);return;}
      const match=/^(top|bottom):(\d+)$/.exec(choice);
      if(!match||!remaining.includes(match[2])){game.view.emit('请选择尚未安排的牌及顶/底位置。');continue;}
      remaining.splice(remaining.indexOf(match[2]),1);(match[1]==='top'?top:bottom).push(match[2]);
    }
  }
  // pop() is the top. Each chosen list is expressed in eventual draw order.
  const suffix=game.deck.draw_pile.slice(-cards.length).reverse();
  if(!cards.every((card,i)=>suffix[i]===card))throw new Error(`${skill}结算时牌堆已意外改变。`);
  game.deck.draw_pile.splice(-cards.length,cards.length);
  game.deck.draw_pile.unshift(...bottom.map(id=>cards[Number(id)-1]).reverse());
  game.deck.draw_pile.push(...top.map(id=>cards[Number(id)-1]).reverse());
  game.view.emit(`${actor.name}完成${skill}：${top.length}张置顶，${bottom.length}张置底。`);
}

/** Canonical mechanisms with source-specific display labels, never name dispatch. */
export function sha_shan_swap_definitions({SkillHooks,ActiveSkillDef},skill){
  return {hooks:SkillHooks({response_sha_shan_swap:true,response_material_name:skill}),
    active:[new ActiveSkillDef({skill_id:skill,hotkey:'q',help_text:`${skill}：以一张自己的闪手牌当普通杀；响应时可杀闪互换`,
      player:(g,a,t,args)=>longdan(g,a,t,args,skill),ai:(g,a,t)=>ai_longdan(g,a,t,skill),
      arg_mode:'one_card',min_cards:1,max_cards:1,card_filter:'shan',button_label:skill,
      available:(g,a,t)=>g.is_own_play_phase(a)&&g.skill_material_options(a).some(m=>m.zone==='hand'&&!m.card.virtual&&m.card.type===CardType.SHAN&&g.can_convert_material_to_sha(a,t,m))})]};
}
export function deck_order_empty_hand_hooks({SkillHooks},skill){
  return SkillHooks({on_prepare:[(g,a)=>guanxing(g,a,skill)],immune_to_sha_without_hand:true,immune_to_duel_without_hand:true});
}

export function second_four_skill_definitions({SkillHooks,ActiveSkillDef}){
  return {
    hooks:{
      '赵云':SkillHooks({response_sha_shan_swap:true,response_material_name:'龙胆'}),
      '马超':SkillHooks({distance_modifier:-1,on_sha_target:[tieqi]}),
      '周瑜':SkillHooks({before_draw:[yingzi]}),
      '诸葛亮':SkillHooks({on_prepare:[(g,a)=>guanxing(g,a)],immune_to_sha_without_hand:true,immune_to_duel_without_hand:true}),
    },
    active:{
      '赵云':[new ActiveSkillDef({skill_id:'龙胆',hotkey:'q',help_text:'龙胆：以一张自己的闪手牌当普通杀；响应时可杀闪互换',
        player:longdan,ai:ai_longdan,arg_mode:'one_card',min_cards:1,max_cards:1,card_filter:'shan',button_label:'龙胆',
        available:(g,a,t)=>g.is_own_play_phase(a)&&g.skill_material_options(a).some(m=>m.zone==='hand'&&!m.card.virtual&&m.card.type===CardType.SHAN&&g.can_convert_material_to_sha(a,t,m))})],
      '周瑜':[new ActiveSkillDef({skill_id:'反间',hotkey:'q',help_text:'反间：敌方先猜花色，再盲取你的一张手牌；猜错受1点伤害，每出牌阶段一次',
        player:fanjian,ai:ai_fanjian,button_label:'反间',available:(g,a,t)=>g.is_own_play_phase(a)&&enemy(g,a,t)&&a.hand.length>0&&!a.used_active_skills.has('反间')})],
    },
  };
}
