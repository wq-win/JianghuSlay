from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Optional

from models.player import Player

OnDamagedHandler = Callable[["Game", Player, int, Optional[Player]], None]
OnOpponentDyingHandler = Callable[["Game", Player, Player], bool]
OnTurnStartHandler = Callable[["Game", Player, Player], int]
OnTurnEndHandler = Callable[["Game", Player, Player], None]
OnDodgeHandler = Callable[["Game", Player], None]
OnShaDodgedHandler = Callable[["Game", Player, Player], None]
ShaDamageBonusHandler = Callable[["Game", Player, Player], int]
ShaUnavoidableHandler = Callable[["Game", Player, Player], bool]
ShansRequiredHandler = Callable[["Game", Player, Player], int]
TaoHealBonusHandler = Callable[["Game", Player], int]
HandLimitBonusHandler = Callable[["Game", Player], int]
PlayerActiveHandler = Callable[["Game", Player, Player, list[str]], bool]
AIActiveHandler = Callable[["Game", Player, Player], bool]


@dataclass(frozen=True)
class SkillHooks:
    on_damaged: tuple[OnDamagedHandler, ...] = ()
    on_opponent_dying: tuple[OnOpponentDyingHandler, ...] = ()
    on_turn_start: tuple[OnTurnStartHandler, ...] = ()
    on_turn_end: tuple[OnTurnEndHandler, ...] = ()
    on_dodge: tuple[OnDodgeHandler, ...] = ()
    on_sha_dodged: tuple[OnShaDodgedHandler, ...] = ()
    sha_damage_bonus: tuple[ShaDamageBonusHandler, ...] = ()
    sha_unavoidable: tuple[ShaUnavoidableHandler, ...] = ()
    shans_required_to_dodge: tuple[ShansRequiredHandler, ...] = ()
    tao_heal_bonus: tuple[TaoHealBonusHandler, ...] = ()
    hand_limit_bonus: tuple[HandLimitBonusHandler, ...] = ()
    max_sha_per_turn: int = 1
    red_hand_as_tao: bool = False
    immune_to_sha_without_hand: bool = False
    shunshou_no_distance_limit: bool = False
    immune_to_shunshou: bool = False
    response_sha_shan_swap: bool = False
    ai_prefer_wine_before_sha: bool = False


@dataclass(frozen=True)
class ActiveSkillDef:
    skill_id: str
    hotkey: str
    help_text: str
    player: PlayerActiveHandler
    ai: AIActiveHandler
    # UI hints: none = click to fire; cards = select hand then confirm
    arg_mode: str = "none"  # none | one_card | cards | cards_or_all | exactly_n
    min_cards: int = 0
    max_cards: int = 0  # 0 means unlimited when mode is cards
    card_filter: str = "any"  # any | red | black | shan | club
    button_label: str = ""

    def to_client_dict(self) -> dict:
        return {
            "hotkey": self.hotkey,
            "id": self.skill_id,
            "help": self.help_text,
            "label": self.button_label or self.skill_id,
            "arg_mode": self.arg_mode,
            "min_cards": self.min_cards,
            "max_cards": self.max_cards,
            "card_filter": self.card_filter,
        }


SKILL_HOTKEYS = frozenset({"q", "w", "e", "r"})

# Populated in passive.py / active.py
HERO_SKILL_HOOKS: dict[str, SkillHooks] = {}
ACTIVE_SKILLS_BY_HERO: dict[str, tuple[ActiveSkillDef, ...]] = {}


def active_skills_for_hero(hero_name: str) -> tuple[ActiveSkillDef, ...]:
    return ACTIVE_SKILLS_BY_HERO.get(hero_name, ())


def active_skill_by_hotkey(hero_name: str, key: str) -> ActiveSkillDef | None:
    for skill in active_skills_for_hero(hero_name):
        if skill.hotkey == key:
            return skill
    return None
