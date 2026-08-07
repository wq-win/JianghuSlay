from __future__ import annotations

import random

from models.card import Card, CardColor, CardType, CardSuit


class Deck:
    def __init__(self, on_reshuffle=None) -> None:
        self.draw_pile: list[Card] = []
        self.discard_pile: list[Card] = []
        self.on_reshuffle = on_reshuffle
        self._build()

    def _build(self) -> None:
        cards: list[Card] = []
        cards.extend(Card("杀", CardType.SHA, description="攻击对手") for _ in range(12))
        cards.extend(
            Card("血杀", CardType.BLOOD_SHA, description="命中后回复与伤害等量的血量")
            for _ in range(6)
        )
        cards.extend(
            Card("毒杀", CardType.POISON_SHA, description="命中后下回合开始前判定，黑色则不能摸牌")
            for _ in range(6)
        )
        cards.extend(Card("闪", CardType.SHAN, description="抵消一次杀") for _ in range(16))
        cards.extend(Card("桃", CardType.TAO, description="回复1点血") for _ in range(10))
        cards.extend(Card("酒", CardType.WINE, description="本回合下一张杀伤害+1；濒死时可当桃") for _ in range(6))
        scroll_specs = [
            ("无中生有", 4, "摸2张牌"),
            ("顺手牵羊", 8, "距离1，获得对手1张手牌或装备牌"),
            ("釜底抽薪", 12, "弃置对手1张手牌或装备牌，无距离限制"),
            ("决斗", 3, "双方轮流出杀，先不出者受1点伤害"),
            ("烽火狼烟", 4, "对手需打出杀，否则受到1点伤害"),
            ("万箭齐发", 2, "对手需打出闪，否则受到1点伤害"),
            ("手捧雷", 2, "目标下回合开始前判定，非红桃受3点伤害，否则传给对手"),
            ("画地为牢", 4, "目标下回合不能使用杀"),
        ]
        for name, count, description in scroll_specs:
            cards.extend(Card(name, CardType.SCROLL, description=description) for _ in range(count))
        cards.extend(
            [
                Card("青龙偃月刀", CardType.WEAPON, 0, "杀被闪避后，可继续追杀", 3, "follow_sha"),
                Card("方天画戟", CardType.WEAPON, 2, "距离4，杀造成的伤害+2", 4),
                Card("霸王弓", CardType.WEAPON, 0, "距离5，杀命中后弃掉对手一匹马", 5, "dismount"),
                Card("诸葛连弩", CardType.WEAPON, 0, "距离1，本回合出杀次数不限", 1, "unlimited_sha"),
                Card("丈八蛇矛", CardType.WEAPON, 0, "距离3，可用两张手牌当杀：sha 1 2", 3, "two_as_sha"),
                Card("麒麟弓", CardType.WEAPON, 1, "距离5，杀命中后弃掉对手一匹马", 5, "dismount"),
                Card("仁王盾", CardType.ARMOR, 1, "受到的伤害-1"),
                Card("八卦阵", CardType.ARMOR, 1, "受到的伤害-1"),
                Card("龙鳞甲", CardType.ARMOR, 2, "受到的伤害-2"),
                Card("赤兔", CardType.OFFENSIVE_HORSE, 1, "进攻距离-1，更容易打到对手"),
                Card("大宛", CardType.OFFENSIVE_HORSE, 1, "进攻距离-1，更容易打到对手"),
                Card("绝影", CardType.DEFENSIVE_HORSE, 1, "防御距离+1，让对手更难打到你"),
                Card("的卢", CardType.DEFENSIVE_HORSE, 1, "防御距离+1，让对手更难打到你"),
            ]
        )
        random.shuffle(cards)
        self.draw_pile = self._assign_suits_and_ranks(cards)

    def _assign_suits_and_ranks(self, cards: list[Card]) -> list[Card]:
        suits = list(CardSuit) * ((len(cards) // len(CardSuit)) + 1)
        ranks = [(index % 13) + 1 for index in range(len(cards))]
        random.shuffle(suits)
        random.shuffle(ranks)
        return [
            Card(
                card.name,
                card.type,
                card.power,
                card.description,
                card.range,
                card.trait,
                suits[index],
                suits[index].color,
                ranks[index],
            )
            for index, card in enumerate(cards)
        ]

    def draw(self, count: int) -> list[Card]:
        cards: list[Card] = []
        for _ in range(count):
            if not self.draw_pile:
                if not self.discard_pile:
                    break
                self.draw_pile = self.discard_pile
                self.discard_pile = []
                random.shuffle(self.draw_pile)
                if self.on_reshuffle is not None:
                    self.on_reshuffle()
            cards.append(self.draw_pile.pop())
        return cards

    def discard(self, cards: list[Card] | Card | None) -> None:
        if cards is None:
            return
        if isinstance(cards, Card):
            self.discard_pile.append(cards)
        else:
            self.discard_pile.extend(cards)
