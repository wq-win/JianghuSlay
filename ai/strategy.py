from __future__ import annotations

import random
from typing import Optional

from models.card import Card, CardType
from models.player import Player
from skills.registry import HERO_SKILL_HOOKS


def ai_choose_card(game: "Game", actor: Player, target: Player) -> Optional[int]:
    if actor.hp <= max(2, actor.hero.max_hp // 2):
        tao_index = game.find_card(actor, CardType.TAO)
        if tao_index is not None and actor.hp < actor.hero.max_hp:
            return tao_index
        if game.has_red_hand_as_tao(actor) and actor.hp < actor.hero.max_hp:
            for index, card in enumerate(actor.hand):
                if game.can_use_red_as_tao(actor, card):
                    return index

    best_equipment = game.find_better_equipment(actor)
    if best_equipment is not None and not game.has_all_hand_as_sha(actor):
        return best_equipment

    scroll_index = ai_choose_scroll(game, actor, target)
    if scroll_index is not None:
        return scroll_index

    hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
    if (
        hooks is not None
        and hooks.ai_prefer_wine_before_sha
        and game.find_sha_card(actor) is not None
    ):
        wine_index = game.find_card(actor, CardType.WINE)
        if wine_index is not None and actor.wine_bonus == 0:
            return wine_index

    sha_index = ai_choose_sha_index(game, actor, target)
    if sha_index is not None:
        return sha_index

    if actor.hp <= 3 and actor.hp < actor.hero.max_hp:
        tao_index = game.find_card(actor, CardType.TAO)
        if tao_index is not None:
            return tao_index
        if game.has_red_hand_as_tao(actor):
            for index, card in enumerate(actor.hand):
                if game.can_use_red_as_tao(actor, card):
                    return index

    return None


def ai_choose_sha_index(game: "Game", actor: Player, target: Player) -> Optional[int]:
    if not game.can_use_sha(actor) or not game.in_attack_range(actor, target):
        return None
    if not game.can_sha_target(actor, target):
        return None

    sha_index = game.find_sha_card(actor)
    if sha_index is not None:
        return sha_index

    if not game.has_all_hand_as_sha(actor):
        return None

    for index, card in enumerate(actor.hand):
        if game.can_use_hand_as_sha(actor, target, card):
            return index
    return None


def ai_choose_scroll(game: "Game", actor: Player, target: Player) -> Optional[int]:
    preferred_names: list[str] = []
    if actor.hp <= 2 or len(actor.hand) <= 2:
        preferred_names.append("无中生有")
    if game.target_has_card(target):
        if game.can_use_shunshou(actor, target):
            preferred_names.append("顺手牵羊")
        preferred_names.append("釜底抽薪")
    if game.target_has_visible_equipment(target):
        preferred_names.insert(0, "釜底抽薪")
    preferred_names.append("画地为牢")
    preferred_names.append("手捧雷")
    if game.find_sha_card(target) is None:
        preferred_names.append("烽火狼烟")
    if game.find_card(target, CardType.SHAN) is None:
        preferred_names.append("万箭齐发")
    preferred_names.append("决斗")

    for name in preferred_names:
        index = game.find_card_by_name(actor, name)
        if index is not None:
            return index
    return None


def ai_choose_discard(player: Player) -> int:
    priorities = {
        CardType.SHAN: 5,
        CardType.TAO: 4,
        CardType.SHA: 3,
        CardType.BLOOD_SHA: 3,
        CardType.POISON_SHA: 3,
        CardType.WINE: 2,
        CardType.SCROLL: 2,
        CardType.WEAPON: 1,
        CardType.ARMOR: 1,
        CardType.OFFENSIVE_HORSE: 1,
        CardType.DEFENSIVE_HORSE: 1,
    }
    return min(range(len(player.hand)), key=lambda i: priorities[player.hand[i].type])


def ai_choose_target_option(options: list[tuple[str, int, str]]) -> tuple[str, int, str]:
    visible_options = [option for option in options if option[0] != "hand"]
    if visible_options:
        return visible_options[0]
    return random.choice(options)


def ai_try_zhangba(game: "Game", actor: Player, target: Player) -> bool:
    if actor.weapon is None or actor.weapon.trait != "two_as_sha":
        return False
    if len(actor.hand) < 2 or not game.can_use_sha(actor) or not game.in_attack_range(actor, target):
        return False
    discarded = [actor.hand.pop(), actor.hand.pop()]
    game.deck.discard(discarded)
    game.view.emit("AI 使用丈八蛇矛，将两张手牌当杀。")
    game.use_sha(actor, target, "丈八蛇矛转化的杀")
    return True


def ai_try_shixian_equipment(game: "Game", actor: Player, target: Player) -> bool:
    if not game.has_all_hand_as_sha(actor):
        return False
    if not game.can_use_sha(actor) or not game.in_attack_range(actor, target):
        return False
    slot_priority = ("weapon", "armor", "offensive_horse", "defensive_horse")
    for slot in slot_priority:
        if game.can_use_equipment_as_sha(actor, target, slot):
            card = game.equipment_slot_card(actor, slot)
            game.use_equipment_as_sha(actor, target, slot)
            game.view.emit(f"AI 将装备 {card} 当杀使用。")
            return True
    return False


def ai_try_active_skill(game: "Game", actor: Player, target: Player) -> bool:
    from skills.registry import active_skills_for_hero

    for skill in active_skills_for_hero(actor.hero.name):
        if skill.ai(game, actor, target):
            return True
    return False
