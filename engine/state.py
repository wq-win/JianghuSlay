from __future__ import annotations

from typing import Any, Optional, TYPE_CHECKING

from models.card import Card, rank_label
from models.player import Player

if TYPE_CHECKING:
    from game import Game


def card_to_dict(card: Card, *, hidden: bool = False) -> dict[str, Any]:
    if hidden:
        return {"hidden": True, "name": "背面"}
    return {
        "hidden": False,
        "name": card.name,
        "type": card.type.value,
        "power": card.power,
        "description": card.description,
        "range": card.range,
        "trait": card.trait,
        "suit": card.suit.value,
        "color": card.color.value,
        "rank": card.rank,
        "rank_label": rank_label(card.rank),
        "label": str(card),
    }


def player_to_dict(player: Player, *, seat: str, reveal_hand: bool) -> dict[str, Any]:
    return {
        "seat": seat,
        "name": player.name,
        "is_ai": player.is_ai,
        "alive": player.alive,
        "hp": player.hp,
        "max_hp": player.hero.max_hp,
        "hero": {
            "name": player.hero.name,
            "skill_name": player.hero.skill_name,
            "skill_desc": player.hero.skill_desc,
        },
        "hand_count": len(player.hand),
        "hand": (
            [card_to_dict(card) for card in player.hand]
            if reveal_hand
            else [card_to_dict(card, hidden=True) for card in player.hand]
        ),
        "equipment": {
            "weapon": card_to_dict(player.weapon) if player.weapon else None,
            "armor": card_to_dict(player.armor) if player.armor else None,
            "offensive_horse": card_to_dict(player.offensive_horse) if player.offensive_horse else None,
            "defensive_horse": card_to_dict(player.defensive_horse) if player.defensive_horse else None,
        },
        "marks": {
            "leidian": player.leidian_pending,
            "poison": player.poison_mark_pending,
            "judgment": player.judgment_mark_pending,
            "prison": player.prison_no_sha,
            "shixian": player.shixian_active,
            "wine_bonus": player.wine_bonus,
            "bawang_stacks": player.bawang_stacks,
        },
        "skills_used": sorted(player.used_active_skills),
    }


def serialize_match_state(
    game: Game,
    *,
    viewer_seat: str = "player",
    phase: str = "playing",
    winner: Optional[str] = None,
) -> dict[str, Any]:
    from skills.registry import active_skills_for_hero

    if not hasattr(game, "player"):
        return {
            "phase": phase,
            "viewer_seat": viewer_seat,
            "winner": winner,
            "round": getattr(game, "round_no", 0),
            "players": {},
            "deck_count": 0,
            "discard_count": 0,
            "active_skills": [],
        }

    p1 = getattr(game, "p1", game.player)
    p2 = getattr(game, "p2", game.ai)
    p3 = getattr(game, "p3", None)
    mode = getattr(game, "mode", "1v1")

    if viewer_seat == "p1":
        me, me_seat = p1, "p1"
        foes = [(p2, "p2")] + ([(p3, "p3")] if p3 is not None else [])
    elif viewer_seat == "p2":
        me, me_seat = p2, "p2"
        foes = [(p1, "p1")] + ([(p3, "p3")] if p3 is not None else [])
    elif viewer_seat == "p3" and p3 is not None:
        me, me_seat = p3, "p3"
        foes = [(p1, "p1"), (p2, "p2")]
    else:
        me, me_seat = game.player, "player"
        foes = [(game.ai, "ai")]
        if getattr(game, "ai2", None) is not None:
            foes.append((game.ai2, "ai2"))

    opponent_dicts = [
        player_to_dict(foe, seat=seat, reveal_hand=False) for foe, seat in foes if foe is not None
    ]
    primary = opponent_dicts[0] if opponent_dicts else None

    active_skills = [
        skill.to_client_dict()
        for skill in active_skills_for_hero(me.hero.name)
    ]

    players: dict[str, Any] = {
        "self": player_to_dict(me, seat=me_seat, reveal_hand=True),
        "opponents": opponent_dicts,
    }
    if primary is not None:
        players["opponent"] = primary
    players["p1"] = player_to_dict(p1, seat="p1", reveal_hand=viewer_seat in {"p1", "player"})
    players["p2"] = player_to_dict(p2, seat="p2", reveal_hand=viewer_seat == "p2")
    if p3 is not None:
        players["p3"] = player_to_dict(p3, seat="p3", reveal_hand=viewer_seat == "p3")

    return {
        "phase": phase,
        "viewer_seat": viewer_seat,
        "winner": winner,
        "round": getattr(game, "round_no", 0),
        "mode": mode,
        "players": players,
        "deck_count": len(game.deck.draw_pile),
        "discard_count": len(game.deck.discard_pile),
        "active_skills": active_skills,
    }
