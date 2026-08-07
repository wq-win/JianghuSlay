from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class CardColor(str, Enum):
    RED = "红"
    BLACK = "黑"


class CardSuit(str, Enum):
    HEART = "红桃"
    DIAMOND = "方块"
    SPADE = "黑桃"
    CLUB = "梅花"

    @property
    def color(self) -> CardColor:
        if self in {CardSuit.HEART, CardSuit.DIAMOND}:
            return CardColor.RED
        return CardColor.BLACK


class CardType(str, Enum):
    SHA = "杀"
    BLOOD_SHA = "血杀"
    POISON_SHA = "毒杀"
    SHAN = "闪"
    TAO = "桃"
    WINE = "酒"
    WEAPON = "武器"
    ARMOR = "防具"
    OFFENSIVE_HORSE = "-1马"
    DEFENSIVE_HORSE = "+1马"
    SCROLL = "锦囊"


SHA_CARD_TYPES = frozenset({CardType.SHA, CardType.BLOOD_SHA, CardType.POISON_SHA})


def rank_label(rank: int) -> str:
    if rank <= 10:
        return str(rank)
    return {11: "J", 12: "Q", 13: "K"}[rank]


def is_sha_type(card_type: CardType) -> bool:
    return card_type in SHA_CARD_TYPES


def is_sha_card(card: Card) -> bool:
    return card.type in SHA_CARD_TYPES


@dataclass(frozen=True)
class Card:
    name: str
    type: CardType
    power: int = 0
    description: str = ""
    range: int = 1
    trait: str = ""
    suit: CardSuit = CardSuit.SPADE
    color: CardColor = CardColor.BLACK
    rank: int = 1

    def __str__(self) -> str:
        suit_tag = f"[{self.suit.value}{rank_label(self.rank)}]"
        if self.type == CardType.WEAPON:
            return f"{suit_tag}{self.name}(武器 距离{self.range} 伤害+{self.power})"
        if self.type == CardType.ARMOR:
            return f"{suit_tag}{self.name}({self.type.value}+{self.power})"
        if self.type in {CardType.OFFENSIVE_HORSE, CardType.DEFENSIVE_HORSE}:
            return f"{suit_tag}{self.name}({self.type.value})"
        return f"{suit_tag}{self.name}"
