import { CardType } from "./models.js";

export async function _scroll_wuzhongshengyou(game, actor, target, card) {
  await game.draw_cards(actor, 2);
  game.view.emit(`${actor.name}摸了2张牌。`);
}

export async function _scroll_shunshouqianyang(game, actor, target, card) {
  if (game.is_immune_to_shunshou(target)) {
    game.view.emit(`${target.name}免疫顺手牵羊。`);
    return;
  }
  const publicCards=new Set([...(target.judgment_cards??[]),...[target.weapon,target.armor,target.offensive_horse,target.defensive_horse].filter(Boolean)]);
  const stolen = await game.take_target_card(actor, target, "获得");
  if (stolen === null) {
    game.view.emit(`${target.name}没有可获得的牌，顺手牵羊没有效果。`);
    return;
  }
  game.view.emit(publicCards.has(stolen)?`${actor.name}获得了${target.name}的 ${stolen}。`:`${actor.name}获得了${target.name}的1张手牌。`);
}

export async function _scroll_foudichouxin(game, actor, target, card) {
  const removed = await game.remove_target_card(actor, target);
  if (removed === null) {
    game.view.emit(`${target.name}没有可弃置的牌。`);
    return;
  }
  game.view.emit(`${actor.name}弃置了${target.name}的 ${removed}。`);
}

export async function _scroll_juedou(game, actor, target, card) {
  await game.resolve_duel(actor, target, card);
}

export async function _scroll_fenghuolangyan(game, actor, target, card) {
  let foes = game.all_players().filter(p=>p!==actor&&p.alive);
  if (!foes.length) foes = target.alive ? [target] : [];
  for (const foe of foes) {
    if (foe.alive) await game.require_response_or_damage(foe, CardType.SHA, "杀", 1, actor, card);
  }
}

export async function _scroll_wanjianqifa(game, actor, target, card) {
  let foes = game.all_players().filter(p=>p!==actor&&p.alive);
  if (!foes.length) foes = target.alive ? [target] : [];
  for (const foe of foes) {
    if (foe.alive) await game.require_response_or_damage(foe, CardType.SHAN, "闪", 1, actor, card);
  }
}

export async function _scroll_shoupenglei(game, actor, target, card) {
  target.leidian_pending = true;
  game.view.emit(`${actor.name}对${target.name}使用手捧雷，${target.name}下回合开始前需判定。`);
}

export async function _scroll_huadiweilao(game, actor, target, card) {
  target.prison_no_sha = true;
  game.view.emit(`${actor.name}对${target.name}使用画地为牢，${target.name}下回合不能使用杀。`);
}

export function _can_play_shunshouqianyang(game, actor, target) {
  if (game.is_immune_to_shunshou(target)) return false;
  return game.can_use_shunshou(actor, target);
}

export const SCROLL_REGISTRY = {
  "无中生有": _scroll_wuzhongshengyou,
  "顺手牵羊": _scroll_shunshouqianyang,
  "釜底抽薪": _scroll_foudichouxin,
  "过河拆桥": _scroll_foudichouxin,
  "决斗": _scroll_juedou,
  "烽火狼烟": _scroll_fenghuolangyan,
  "万箭齐发": _scroll_wanjianqifa,
  "手捧雷": _scroll_shoupenglei,
  "画地为牢": _scroll_huadiweilao,
};
export const SCROLL_PLAY_CHECKS = { "顺手牵羊": _can_play_shunshouqianyang };
