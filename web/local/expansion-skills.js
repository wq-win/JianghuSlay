import {rule_hero} from './effective-hero.js';
/** Verified base-skill snapshot, deliberately adapted to Jianghu rules.
 * Hooks below describe mechanics; card zones, timing and damage are shared engine APIs.
 */
import { Card, CardType, CardColor, CardSuit } from './models.js';

async function choose_optional(game, actor, message, ai_choice = true) {
  return actor.is_ai ? ai_choice : await game.view.ask_confirm(message, {player_id:game.seat_of(actor)});
}

function own_turn_damage_bonus(game, actor, target, kind, card_user) {
  return actor.luoyi_active && game.turn_actor === game.seat_of(actor)
    && card_user === actor && ['sha','duel'].includes(kind) ? 1 : 0;
}

async function before_draw_luoyi(game, actor, target, count) {
  if (count < 1 || !actor.alive) return count;
  const useful = game.find_sha_card(actor) !== null || game.find_card_by_name(actor, '决斗') !== null;
  if (!await choose_optional(game, actor, '裸衣：少摸1张，本回合杀和决斗伤害+1？', useful)) return count;
  actor.luoyi_active = true;
  game.view.emit(`${actor.name}发动裸衣，少摸1张牌，本回合杀和决斗伤害+1。`);
  return count - 1;
}

async function before_discard_keji(game, actor) {
  if (actor.sha_activity_in_own_play || !actor.alive) return false;
  if (!await choose_optional(game, actor, '克己：本回合出牌阶段未使用或打出杀，跳过弃牌阶段？')) return false;
  game.view.emit(`${actor.name}发动克己，跳过本回合弃牌阶段。`);
  return true;
}

async function on_scroll_used_jizhi(game, actor, target, card) {
  if (!actor.alive || game.is_delayed_scroll(card)) return;
  if (!await choose_optional(game, actor, `集智：使用${card.name}，是否先摸1张牌？`)) return;
  await game.draw_cards(actor, 1);
  game.view.emit(`${actor.name}发动集智，摸1张牌。`);
}

async function after_damage_ganglie(game, actor, amount, source) {
  if (!actor.alive || !source?.alive || amount <= 0) return;
  const retaliate = source === actor || game.side_of(actor) !== game.side_of(source);
  if (!await choose_optional(game, actor, `刚烈：是否对伤害来源${source.name}进行判定？`, retaliate)) return;
  const judgment=await game.reveal_judgment(actor,'刚烈',{favorable:c=>c.suit!==CardSuit.HEART});
  if(!judgment)return;
  const success=game.effective_suit(judgment,actor)!==CardSuit.HEART;
  await game.finish_judgment_card(judgment);
  if (!success) {game.view.emit('判定为红桃，刚烈无后续效果。'); return;}
  // Choice belongs to the damage source, including p3 in team mode.
  let discard = false;
  if (source.hand.length >= 2) {
    if (source.is_ai) discard = source.hp <= 2 || source.hand.length >= 4;
    else {
      while (true) {
        const choice = await game.view.ask_line('刚烈：弃置2张手牌，或受到1点伤害？', {
          kind:'choice', player_id:game.seat_of(source),
          options:[{id:'discard',label:'弃置2张手牌'},{id:'damage',label:'受到1点伤害'}],
        });
        if (choice === 'discard' || choice === '1') {discard = true; break;}
        if (choice === 'damage' || choice === '2') break;
        game.view.emit('请选择弃牌或受伤。');
      }
    }
  }
  if (discard) {
    await game.discard_from_hand(source, 2, {reason:'刚烈'});
    return;
  }
  await game.apply_damage(source, 1, {source:actor, kind:'retaliation',
    message:'{name}受到刚烈反击，受到 {damage} 点伤害，剩余血量 {hp}。'});
}

async function player_wusheng(game, actor, target, args) {
  if (!game.is_own_play_phase(actor)) {game.view.emit('武圣只能在合法出杀或响应窗口使用。'); return true;}
  if (!game.can_use_sha(actor) || !game.can_sha_target(actor,target)) {game.view.emit('现在不能对该目标使用杀。'); return true;}
  const material = await game.choose_skill_material(actor,args,{color:CardColor.RED,skill:'武圣'});
  if (material === false) return false;
  if (!material) return true;
  if (!game.can_convert_material_to_sha(actor,target,material)) {game.view.emit('消耗此牌后距离不够，或不能使用杀。'); return true;}
  const card = await game.consume_material(actor,material,{to:'processing'});
  if(!card)return true;
  if(!actor.alive||!target.alive){game.finish_processing_card(card);return true;}
  await game.use_sha(actor,target,`武圣·${card.name}当普通杀`,{source_card:game.material_sha(actor,card),source_last_hand:material.zone==='hand'&&actor.hand.length===0});
  return true;
}
async function ai_wusheng(game,actor,target) {
  if (!game.is_own_play_phase(actor) || !game.can_use_sha(actor) || game.find_sha_card(actor)!==null) return false;
  const options=game.skill_material_options(actor,{color:CardColor.RED});
  // Keep emergency heals and costly equipped range until no cheaper material exists.
  options.sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b));
  const material=options.find(m=>!(m.card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp)
    &&game.can_convert_material_to_sha(actor,target,m));
  if(!material)return false;
  return player_wusheng(game,actor,target,game.material_command_args(material));
}

async function player_qixi(game,actor,target,args) {
  if(!game.is_own_play_phase(actor)){game.view.emit('奇袭只能在自己的出牌阶段使用。');return true;}
  if(!target?.alive||target===actor||!game.target_has_card(target)){
    game.view.emit('目标没有可弃置的手牌或装备。');return true;
  }
  const material=await game.choose_skill_material(actor,args,{color:CardColor.BLACK,skill:'奇袭'});
  if(material===false)return false;if(!material)return true;
  const card=await game.consume_material(actor,material);
  if(!card||!actor.alive||!target.alive)return true;
  game.view.emit(`${actor.name}发动奇袭，将${card}当釜底抽薪使用。`);
  await game.resolve_scroll(actor,target,new Card('釜底抽薪',CardType.SCROLL,{suit:card.suit,color:card.color,rank:card.rank}));
  return true;
}
async function ai_qixi(game,actor,target) {
  if(!game.is_own_play_phase(actor)||!game.target_has_card(target))return false;
  const options=game.skill_material_options(actor,{color:CardColor.BLACK});
  options.sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b));
  // Equipment is a legal cost, but don't give up armor while other costs remain.
  if(!options.length)return false;
  return player_qixi(game,actor,target,game.material_command_args(options[0]));
}

async function player_kurou(game,actor,target,args) {
  if(args.length)return false;
  if(!game.is_own_play_phase(actor)||!actor.alive)return true;
  await game.lose_hp(actor,1,{source:actor,reason:'苦肉'});
  if(!actor.alive)return true;
  await game.draw_cards(actor,2);
  game.view.emit(`${actor.name}发动苦肉后存活，摸2张牌。`);
  return true;
}
async function ai_kurou(game,actor,target) {
  // This is an AI policy bound, never a player skill-use limit.
  if(!game.is_own_play_phase(actor)||actor.hp<=2||actor.kurou_ai_uses>=2)return false;
  actor.kurou_ai_uses++;
  return player_kurou(game,actor,target,[]);
}

export function expansion_skill_definitions({SkillHooks,ActiveSkillDef}) {
  const hooks={
    '关羽':SkillHooks({response_sha_material_color:CardColor.RED}),
    '张飞':SkillHooks({max_sha_per_turn:Infinity}),
    '吕蒙':SkillHooks({before_discard:[before_discard_keji]}),
    '许褚':SkillHooks({before_draw:[before_draw_luoyi],card_damage_bonus:[own_turn_damage_bonus]}),
    '夏侯惇':SkillHooks({after_damage_resolved:[after_damage_ganglie]}),
    '黄月英':SkillHooks({on_scroll_used:[on_scroll_used_jizhi],scroll_no_distance_limit:true}),
  };
  const active={
    '关羽':[new ActiveSkillDef({skill_id:'武圣',hotkey:'q',help_text:'武圣：选择红色手牌或装备当普通杀（q；q 手牌编号；q eq weapon）',player:player_wusheng,ai:ai_wusheng,button_label:'武圣',available:(g,a,t)=>g.is_own_play_phase(a)&&g.skill_material_options(a,{color:CardColor.RED}).some(m=>g.can_convert_material_to_sha(a,t,m))})],
    '甘宁':[new ActiveSkillDef({skill_id:'奇袭',hotkey:'q',help_text:'奇袭：选择黑色手牌或装备当釜底抽薪（q；q 手牌编号；q eq armor）',player:player_qixi,ai:ai_qixi,button_label:'奇袭',available:(g,a,t)=>g.is_own_play_phase(a)&&g.target_has_card(t)&&g.skill_material_options(a,{color:CardColor.BLACK}).length>0})],
    '黄盖':[new ActiveSkillDef({skill_id:'苦肉',hotkey:'q',help_text:'苦肉：失去1点体力，濒死结算后存活则摸2张牌，可重复发动',player:player_kurou,ai:ai_kurou,button_label:'苦肉',available:(g,a)=>g.is_own_play_phase(a)&&a.alive})],
  };
  return {hooks,active};
}
