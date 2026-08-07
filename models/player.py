from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from models.card import Card
from models.hero import Hero


@dataclass
class Player:
    name: str
    hero: Hero
    is_ai: bool = False
    hp: int = field(init=False)
    hand: list[Card] = field(default_factory=list)
    weapon: Optional[Card] = None
    armor: Optional[Card] = None
    offensive_horse: Optional[Card] = None
    defensive_horse: Optional[Card] = None
    used_sha_this_turn: bool = False
    wine_bonus: int = 0
    sha_count_this_turn: int = 0
    tao_count_this_turn: int = 0
    bawang_stacks: int = 0
    judgment_mark_pending: bool = False
    poison_mark_pending: bool = False
    block_turn_draw: bool = False
    prison_no_sha: bool = False
    leidian_pending: bool = False
    shixian_active: bool = False
    used_active_skills: set[str] = field(default_factory=set)

    def __post_init__(self) -> None:
        self.hp = self.hero.max_hp

    @property
    def alive(self) -> bool:
        return self.hp > 0

    @property
    def attack_bonus(self) -> int:
        return self.weapon.power if self.weapon else 0

    @property
    def defense_bonus(self) -> int:
        return self.armor.power if self.armor else 0

    @property
    def weapon_range(self) -> int:
        return self.weapon.range if self.weapon else 1

    def heal(self, amount: int) -> int:
        old_hp = self.hp
        self.hp = min(self.hero.max_hp, self.hp + amount)
        return self.hp - old_hp

    def take_damage(self, amount: int) -> int:
        real_damage = max(0, amount - self.defense_bonus)
        self.hp -= real_damage
        return real_damage
