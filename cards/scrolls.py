from __future__ import annotations

from models.card import Card, CardSuit, CardType
from models.player import Player
from cards.registry import SCROLL_PLAY_CHECKS, SCROLL_REGISTRY, ScrollCanPlayHandler, ScrollHandler


def _scroll_wuzhongshengyou(game: "Game", actor: Player, target: Player, card: Card) -> None:
    game.draw_cards(actor, 2)
    game.view.emit(f"{actor.name}摸了2张牌。")


def _scroll_shunshouqianyang(game: "Game", actor: Player, target: Player, card: Card) -> None:
    if game.is_immune_to_shunshou(target):
        game.view.emit(f"{target.name}免疫顺手牵羊。")
        return
    stolen = game.take_target_card(actor, target, "获得")
    if stolen is None:
        game.view.emit(f"{target.name}没有可获得的牌，顺手牵羊没有效果。")
        return
    actor.hand.append(stolen)
    game.view.emit(f"{actor.name}获得了{target.name}的 {stolen}。")


def _scroll_foudichouxin(game: "Game", actor: Player, target: Player, card: Card) -> None:
    removed = game.remove_target_card(actor, target)
    if removed is None:
        game.view.emit(f"{target.name}没有可弃置的牌。")
        return
    game.deck.discard(removed)
    game.view.emit(f"{actor.name}弃置了{target.name}的 {removed}。")


def _scroll_juedou(game: "Game", actor: Player, target: Player, card: Card) -> None:
    game.resolve_duel(actor, target)


def _scroll_fenghuolangyan(game: "Game", actor: Player, target: Player, card: Card) -> None:
    foes = game.alive_enemies(actor) or ([target] if target.alive else [])
    for foe in foes:
        if foe.alive:
            game.require_response_or_damage(foe, CardType.SHA, "杀", 1, source=actor)


def _scroll_wanjianqifa(game: "Game", actor: Player, target: Player, card: Card) -> None:
    foes = game.alive_enemies(actor) or ([target] if target.alive else [])
    for foe in foes:
        if foe.alive:
            game.require_response_or_damage(foe, CardType.SHAN, "闪", 1, source=actor)


def _scroll_shoupenglei(game: "Game", actor: Player, target: Player, card: Card) -> None:
    target.leidian_pending = True
    game.view.emit(f"{actor.name}对{target.name}使用手捧雷，{target.name}下回合开始前需判定。")


def _scroll_huadiweilao(game: "Game", actor: Player, target: Player, card: Card) -> None:
    target.prison_no_sha = True
    game.view.emit(f"{actor.name}对{target.name}使用画地为牢，{target.name}下回合不能使用杀。")


def _can_play_shunshouqianyang(game: "Game", actor: Player, target: Player) -> bool:
    if game.is_immune_to_shunshou(target):
        return False
    return game.can_use_shunshou(actor, target)


SCROLL_REGISTRY.update(
    {
        "无中生有": _scroll_wuzhongshengyou,
        "顺手牵羊": _scroll_shunshouqianyang,
        "釜底抽薪": _scroll_foudichouxin,
        "过河拆桥": _scroll_foudichouxin,
        "决斗": _scroll_juedou,
        "烽火狼烟": _scroll_fenghuolangyan,
        "万箭齐发": _scroll_wanjianqifa,
        "手捧雷": _scroll_shoupenglei,
        "画地为牢": _scroll_huadiweilao,
    }
)

SCROLL_PLAY_CHECKS["顺手牵羊"] = _can_play_shunshouqianyang
