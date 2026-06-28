from __future__ import annotations

import random
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class CardType(str, Enum):
    SHA = "杀"
    SHAN = "闪"
    TAO = "桃"
    WINE = "酒"
    WEAPON = "武器"
    ARMOR = "防具"
    OFFENSIVE_HORSE = "-1马"
    DEFENSIVE_HORSE = "+1马"
    SCROLL = "锦囊"


@dataclass(frozen=True)
class Card:
    name: str
    type: CardType
    power: int = 0
    description: str = ""
    range: int = 1
    trait: str = ""

    def __str__(self) -> str:
        if self.type == CardType.WEAPON:
            return f"{self.name}(武器 距离{self.range} 伤害+{self.power})"
        if self.type == CardType.ARMOR:
            return f"{self.name}({self.type.value}+{self.power})"
        if self.type in {CardType.OFFENSIVE_HORSE, CardType.DEFENSIVE_HORSE}:
            return f"{self.name}({self.type.value})"
        return self.name


@dataclass(frozen=True)
class Hero:
    name: str
    max_hp: int
    skill_name: str
    skill_desc: str


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


class Deck:
    def __init__(self) -> None:
        self.draw_pile: list[Card] = []
        self.discard_pile: list[Card] = []
        self._build()

    def _build(self) -> None:
        cards: list[Card] = []
        cards.extend(Card("杀", CardType.SHA, description="攻击对手") for _ in range(24))
        cards.extend(Card("闪", CardType.SHAN, description="抵消一次杀") for _ in range(16))
        cards.extend(Card("桃", CardType.TAO, description="回复1点血") for _ in range(10))
        cards.extend(Card("酒", CardType.WINE, description="本回合下一张杀伤害+1") for _ in range(6))
        scroll_specs = [
            ("无中生有", 2, "摸2张牌"),
            ("顺手牵羊", 2, "距离1，获得对手1张手牌或装备牌"),
            ("釜底抽薪", 2, "弃置对手1张手牌或装备牌，无距离限制"),
            ("决斗", 2, "双方轮流出杀，先不出者受1点伤害"),
            ("烽火狼烟", 1, "对手需打出杀，否则受到1点伤害"),
            ("万箭齐发", 1, "对手需打出闪，否则受到1点伤害"),
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
        self.draw_pile = cards

    def draw(self, count: int) -> list[Card]:
        cards: list[Card] = []
        for _ in range(count):
            if not self.draw_pile:
                if not self.discard_pile:
                    break
                self.draw_pile = self.discard_pile
                self.discard_pile = []
                random.shuffle(self.draw_pile)
                print("\n牌库已洗入弃牌堆。")
            cards.append(self.draw_pile.pop())
        return cards

    def discard(self, cards: list[Card] | Card | None) -> None:
        if cards is None:
            return
        if isinstance(cards, Card):
            self.discard_pile.append(cards)
        else:
            self.discard_pile.extend(cards)


HEROES = [
    Hero("秦始皇", 4, "集权", "回合开始额外摸1张牌。"),
    Hero("项羽", 5, "霸王", "杀的基础伤害+1。"),
    Hero("虞姬", 3, "舍身", "受到伤害后摸1张牌。"),
    Hero("李白", 4, "诗仙", "回合内可以使用两张杀。"),
    Hero("武则天", 4, "女帝", "每回合第一次使用桃额外回复1点。"),
    Hero("刘邦", 4, "驭人", "主动技：每回合一次，弃任意张手牌并摸等量牌。"),
    Hero("赵匡胤", 4, "释权", "主动技：将一张手牌当釜底抽薪使用。"),
    Hero("杨延昭", 4, "天狼", "回合内可以使用三张杀。"),
    Hero("扁鹊", 3, "回春", "使用桃额外回复1点血。"),
    Hero("荆轲", 4, "刺客", "攻击血量不低于自己的目标时，杀的伤害+1。"),
    Hero("韩信", 4, "兵仙", "回合结束手牌上限+2。"),
    Hero("程咬金", 5, "三板斧", "每回合第一张杀伤害+1。"),
    Hero("花木兰", 4, "易装", "打出闪后摸1张牌。"),
    Hero("貂蝉", 3, "离间", "回合开始若对手手牌更多，额外摸1张牌。"),
    Hero("岳飞", 4, "武穆", "主动技：出牌阶段可将一张闪当杀使用。"),
    Hero("褒姒", 3, "治愈", "主动技：每回合一次，弃两张手牌回复1点血。"),
    Hero("时迁", 3, "飞贼", "被动技：使用顺手牵羊无距离限制。"),
]


class Game:
    def __init__(self) -> None:
        self.deck = Deck()
        self.player: Player
        self.ai: Player

    def start(self) -> None:
        print("=== 文字版英雄杀 ===")
        print("目标：击败 AI。输入牌序号出牌，输入 0 结束出牌阶段。\n")
        self.player = Player("你", self.choose_hero())
        ai_hero = random.choice([hero for hero in HEROES if hero != self.player.hero])
        self.ai = Player("AI", ai_hero, is_ai=True)
        print(f"\n你选择了 {self.player.hero.name}：{self.player.hero.skill_name} - {self.player.hero.skill_desc}")
        print(f"AI 选择了 {self.ai.hero.name}：{self.ai.hero.skill_name} - {self.ai.hero.skill_desc}\n")

        self.draw_cards(self.player, 4)
        self.draw_cards(self.ai, 4)

        round_no = 1
        while self.player.alive and self.ai.alive:
            print(f"\n========== 第 {round_no} 轮 ==========")
            self.take_turn(self.player, self.ai)
            if not self.ai.alive:
                break
            self.take_turn(self.ai, self.player)
            round_no += 1

        if self.player.alive:
            print("\n你赢了！天下英雄，尽入彀中。")
        else:
            print("\n你输了。胜败乃兵家常事，再来一局。")

    def choose_hero(self) -> Hero:
        print("请选择英雄：")
        for index, hero in enumerate(HEROES, start=1):
            print(f"{index}. {hero.name}  血量:{hero.max_hp}  {hero.skill_name}: {hero.skill_desc}")
        while True:
            choice = input("输入英雄编号：").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(HEROES):
                return HEROES[int(choice) - 1]
            print("请输入有效编号。")

    def take_turn(self, actor: Player, target: Player) -> None:
        actor.used_sha_this_turn = False
        actor.sha_count_this_turn = 0
        actor.tao_count_this_turn = 0
        actor.used_active_skills.clear()
        actor.wine_bonus = 0
        print(f"\n-- {actor.name}的回合：{actor.hero.name} --")
        self.show_status()

        draw_count = self.draw_count_for_turn(actor, target)
        self.draw_cards(actor, draw_count)
        print(f"{actor.name}摸了 {draw_count} 张牌。")

        if actor.is_ai:
            self.ai_play(actor, target)
        else:
            self.player_play(actor, target)

        self.discard_down_to_hp(actor)

    def draw_cards(self, player: Player, count: int) -> None:
        player.hand.extend(self.deck.draw(count))

    def player_play(self, actor: Player, target: Player) -> None:
        while actor.alive and target.alive:
            if not actor.hand:
                print("手牌已用尽，出牌阶段结束。")
                break
            self.show_status(show_ai_hand_count=True)
            self.show_hand(actor)
            choice = input("出牌编号 / skill ... / sha 1 2 / 0结束：").strip().lower()
            if choice == "0":
                break
            if choice.startswith("skill"):
                if not self.player_use_active_skill(actor, target, choice):
                    print("主动技能用法不正确。")
                elif not actor.hand:
                    print("手牌已用尽，出牌阶段结束。")
                    break
                continue
            if choice.startswith("sha "):
                if self.player_use_zhangba(actor, target, choice):
                    if not actor.hand:
                        print("手牌已用尽，出牌阶段结束。")
                        break
                    continue
                print("丈八蛇矛用法：装备后输入 sha 两个手牌编号，例如 sha 1 2。")
                continue
            if not choice.isdigit() or not (1 <= int(choice) <= len(actor.hand)):
                print("无效输入。")
                continue
            card = actor.hand[int(choice) - 1]
            if not self.can_play(actor, target, card):
                continue
            actor.hand.pop(int(choice) - 1)
            self.resolve_card(actor, target, card)
            if not actor.hand:
                print("手牌已用尽，出牌阶段结束。")
                break

    def ai_play(self, actor: Player, target: Player) -> None:
        print("AI 正在思考...")
        acted = True
        while acted and actor.alive and target.alive:
            if not actor.hand:
                print("AI 手牌已用尽，出牌阶段结束。")
                break
            acted = False
            if self.ai_try_active_skill(actor, target):
                acted = True
                if not actor.hand:
                    print("AI 手牌已用尽，出牌阶段结束。")
                    break
                continue
            card_index = self.ai_choose_card(actor, target)
            if card_index is not None:
                card = actor.hand.pop(card_index)
                print(f"AI 使用了 {card}。")
                self.resolve_card(actor, target, card)
                acted = True
                if not actor.hand:
                    print("AI 手牌已用尽，出牌阶段结束。")
                    break
            elif self.ai_try_zhangba(actor, target):
                acted = True
                if not actor.hand:
                    print("AI 手牌已用尽，出牌阶段结束。")
                    break

    def ai_choose_card(self, actor: Player, target: Player) -> Optional[int]:
        if actor.hp <= max(2, actor.hero.max_hp // 2):
            tao_index = self.find_card(actor, CardType.TAO)
            if tao_index is not None and actor.hp < actor.hero.max_hp:
                return tao_index

        best_equipment = self.find_better_equipment(actor)
        if best_equipment is not None:
            return best_equipment

        scroll_index = self.ai_choose_scroll(actor, target)
        if scroll_index is not None:
            return scroll_index

        if self.find_card(actor, CardType.SHA) is not None and actor.hero.name in {"项羽", "荆轲", "程咬金"}:
            wine_index = self.find_card(actor, CardType.WINE)
            if wine_index is not None and actor.wine_bonus == 0:
                return wine_index

        sha_index = self.find_card(actor, CardType.SHA)
        if sha_index is not None and self.can_use_sha(actor) and self.in_attack_range(actor, target):
            return sha_index

        if actor.hp <= 3 and actor.hp < actor.hero.max_hp:
            return self.find_card(actor, CardType.TAO)

        return None

    def ai_choose_scroll(self, actor: Player, target: Player) -> Optional[int]:
        preferred_names: list[str] = []
        if actor.hp <= 2 or len(actor.hand) <= 2:
            preferred_names.append("无中生有")
        if self.target_has_card(target):
            if self.can_use_shunshou(actor, target):
                preferred_names.append("顺手牵羊")
            preferred_names.append("釜底抽薪")
        if self.target_has_visible_equipment(target):
            preferred_names.insert(0, "釜底抽薪")
        if self.find_card(target, CardType.SHA) is None:
            preferred_names.append("烽火狼烟")
        if self.find_card(target, CardType.SHAN) is None:
            preferred_names.append("万箭齐发")
        preferred_names.append("决斗")

        for name in preferred_names:
            index = self.find_card_by_name(actor, name)
            if index is not None:
                return index
        return None

    def resolve_card(self, actor: Player, target: Player, card: Card) -> None:
        if card.type == CardType.SHA:
            self.use_sha(actor, target)
            self.deck.discard(card)
            return

        if card.type == CardType.TAO:
            amount = self.tao_heal_amount(actor)
            actor.tao_count_this_turn += 1
            healed = actor.heal(amount)
            print(f"{actor.name}使用桃，回复 {healed} 点血。")
            self.deck.discard(card)
            return

        if card.type == CardType.WINE:
            actor.wine_bonus += 1
            print(f"{actor.name}饮酒，本回合下一张杀伤害+1。")
            self.deck.discard(card)
            return

        if card.type == CardType.SCROLL:
            self.resolve_scroll(actor, target, card)
            self.deck.discard(card)
            return

        if card.type == CardType.WEAPON:
            self.deck.discard(actor.weapon)
            actor.weapon = card
            print(f"{actor.name}装备了武器：{card.name}。")
            return

        if card.type == CardType.ARMOR:
            self.deck.discard(actor.armor)
            actor.armor = card
            print(f"{actor.name}装备了防具：{card.name}。")
            return

        if card.type == CardType.OFFENSIVE_HORSE:
            self.deck.discard(actor.offensive_horse)
            actor.offensive_horse = card
            print(f"{actor.name}装备了进攻马：{card.name}。")
            return

        if card.type == CardType.DEFENSIVE_HORSE:
            self.deck.discard(actor.defensive_horse)
            actor.defensive_horse = card
            print(f"{actor.name}装备了防御马：{card.name}。")
            return

        print("这张牌现在不能主动使用。")
        actor.hand.append(card)

    def use_sha(self, actor: Player, target: Player, virtual_source: str = "杀") -> None:
        actor.used_sha_this_turn = True
        actor.sha_count_this_turn += 1
        damage = 1 + actor.attack_bonus + actor.wine_bonus + self.sha_damage_bonus(actor, target)
        actor.wine_bonus = 0
        print(f"{actor.name}对{target.name}使用{virtual_source}，威力 {damage}。")
        self.resolve_attack(actor, target, damage)

    def player_use_zhangba(self, actor: Player, target: Player, choice: str) -> bool:
        if actor.weapon is None or actor.weapon.trait != "two_as_sha":
            return False
        parts = choice.split()
        if len(parts) != 3 or not parts[1].isdigit() or not parts[2].isdigit():
            return False
        first = int(parts[1]) - 1
        second = int(parts[2]) - 1
        if first == second or not (0 <= first < len(actor.hand)) or not (0 <= second < len(actor.hand)):
            return False
        if not self.can_use_sha(actor):
            print("本回合不能再使用杀。")
            return True
        if not self.in_attack_range(actor, target):
            print(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
            return True
        for index in sorted([first, second], reverse=True):
            self.deck.discard(actor.hand.pop(index))
        self.use_sha(actor, target, "丈八蛇矛转化的杀")
        return True

    def ai_try_zhangba(self, actor: Player, target: Player) -> bool:
        if actor.weapon is None or actor.weapon.trait != "two_as_sha":
            return False
        if len(actor.hand) < 2 or not self.can_use_sha(actor) or not self.in_attack_range(actor, target):
            return False
        discarded = [actor.hand.pop(), actor.hand.pop()]
        self.deck.discard(discarded)
        print(f"AI 使用丈八蛇矛，将两张手牌当杀。")
        self.use_sha(actor, target, "丈八蛇矛转化的杀")
        return True

    def player_use_active_skill(self, actor: Player, target: Player, choice: str) -> bool:
        parts = choice.split()
        if len(parts) < 2 or parts[1] != "1":
            return False

        if actor.hero.name == "刘邦":
            return self.player_skill_yuren(actor, parts[2:])
        if actor.hero.name == "赵匡胤":
            return self.player_skill_shiquan(actor, target, parts[2:])
        if actor.hero.name == "岳飞":
            return self.player_skill_wumu(actor, target, parts[2:])
        if actor.hero.name == "褒姒":
            return self.player_skill_zhiyu(actor, parts[2:])

        print(f"{actor.hero.name}当前没有可主动发动的技能。")
        return True

    def player_skill_yuren(self, actor: Player, args: list[str]) -> bool:
        if "驭人" in actor.used_active_skills:
            print("驭人本回合已使用。")
            return True
        indexes = self.parse_hand_indexes(args, actor)
        if not indexes:
            return False
        discarded = self.pop_hand_indexes(actor, indexes)
        self.deck.discard(discarded)
        self.draw_cards(actor, len(discarded))
        actor.used_active_skills.add("驭人")
        print(f"{actor.name}发动驭人，弃置 {len(discarded)} 张手牌并摸 {len(discarded)} 张牌。")
        return True

    def player_skill_shiquan(self, actor: Player, target: Player, args: list[str]) -> bool:
        if len(args) != 1:
            return False
        indexes = self.parse_hand_indexes(args, actor)
        if not indexes:
            return False
        cost = self.pop_hand_indexes(actor, indexes)[0]
        self.deck.discard(cost)
        print(f"{actor.name}发动释权，将 {cost} 当作釜底抽薪使用。")
        fake_card = Card("釜底抽薪", CardType.SCROLL, description="弃置对手1张手牌或装备牌，无距离限制")
        self.resolve_scroll(actor, target, fake_card)
        return True

    def player_skill_wumu(self, actor: Player, target: Player, args: list[str]) -> bool:
        if len(args) != 1:
            return False
        indexes = self.parse_hand_indexes(args, actor)
        if not indexes:
            return False
        card = actor.hand[indexes[0]]
        if card.type != CardType.SHAN:
            print("武穆需要选择一张闪当杀使用。")
            return True
        if not self.can_use_sha(actor):
            print("本回合不能再使用杀。")
            return True
        if not self.in_attack_range(actor, target):
            print(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
            return True
        used = self.pop_hand_indexes(actor, indexes)[0]
        self.deck.discard(used)
        print(f"{actor.name}发动武穆，将闪当杀使用。")
        self.use_sha(actor, target, "武穆转化的杀")
        return True

    def player_skill_zhiyu(self, actor: Player, args: list[str]) -> bool:
        if "治愈" in actor.used_active_skills:
            print("治愈本回合已使用。")
            return True
        if actor.hp >= actor.hero.max_hp:
            print("血量已满，不能发动治愈。")
            return True
        indexes = self.parse_hand_indexes(args, actor)
        if len(indexes) != 2:
            return False
        discarded = self.pop_hand_indexes(actor, indexes)
        self.deck.discard(discarded)
        healed = actor.heal(1)
        actor.used_active_skills.add("治愈")
        print(f"{actor.name}发动治愈，弃两张手牌，回复 {healed} 点血。")
        return True

    def ai_try_active_skill(self, actor: Player, target: Player) -> bool:
        if actor.hero.name == "刘邦" and "驭人" not in actor.used_active_skills and len(actor.hand) >= 4:
            discard_count = min(2, len(actor.hand))
            discarded = [actor.hand.pop() for _ in range(discard_count)]
            self.deck.discard(discarded)
            self.draw_cards(actor, discard_count)
            actor.used_active_skills.add("驭人")
            print(f"AI 发动驭人，弃 {discard_count} 张牌并摸 {discard_count} 张牌。")
            return True
        if actor.hero.name == "赵匡胤" and actor.hand and self.target_has_card(target):
            cost = actor.hand.pop()
            self.deck.discard(cost)
            print(f"AI 发动释权，将一张手牌当釜底抽薪使用。")
            self.resolve_scroll(actor, target, Card("釜底抽薪", CardType.SCROLL))
            return True
        if actor.hero.name == "岳飞" and self.can_use_sha(actor) and self.in_attack_range(actor, target):
            shan_index = self.find_card(actor, CardType.SHAN)
            if shan_index is not None:
                used = actor.hand.pop(shan_index)
                self.deck.discard(used)
                print(f"AI 发动武穆，将闪当杀使用。")
                self.use_sha(actor, target, "武穆转化的杀")
                return True
        if (
            actor.hero.name == "褒姒"
            and "治愈" not in actor.used_active_skills
            and actor.hp < actor.hero.max_hp
            and len(actor.hand) >= 2
        ):
            discarded = [actor.hand.pop(), actor.hand.pop()]
            self.deck.discard(discarded)
            healed = actor.heal(1)
            actor.used_active_skills.add("治愈")
            print(f"AI 发动治愈，回复 {healed} 点血。")
            return True
        return False

    def parse_hand_indexes(self, args: list[str], actor: Player) -> list[int]:
        if not args or not all(arg.isdigit() for arg in args):
            return []
        indexes = [int(arg) - 1 for arg in args]
        if len(set(indexes)) != len(indexes):
            return []
        if any(index < 0 or index >= len(actor.hand) for index in indexes):
            return []
        return indexes

    def pop_hand_indexes(self, actor: Player, indexes: list[int]) -> list[Card]:
        cards: list[Card] = []
        for index in sorted(indexes, reverse=True):
            cards.append(actor.hand.pop(index))
        cards.reverse()
        return cards

    def resolve_scroll(self, actor: Player, target: Player, card: Card) -> None:
        print(f"{actor.name}使用锦囊：{card.name}。")
        if card.name == "无中生有":
            self.draw_cards(actor, 2)
            print(f"{actor.name}摸了2张牌。")
            return

        if card.name == "顺手牵羊":
            stolen = self.take_target_card(actor, target, "获得")
            if stolen is None:
                print(f"{target.name}没有可获得的牌，顺手牵羊没有效果。")
                return
            actor.hand.append(stolen)
            print(f"{actor.name}获得了{target.name}的 {stolen}。")
            return

        if card.name in {"釜底抽薪", "过河拆桥"}:
            removed = self.remove_target_card(actor, target)
            if removed is None:
                print(f"{target.name}没有可弃置的牌。")
                return
            self.deck.discard(removed)
            print(f"{actor.name}弃置了{target.name}的 {removed}。")
            return

        if card.name == "决斗":
            self.resolve_duel(actor, target)
            return

        if card.name == "烽火狼烟":
            self.require_response_or_damage(target, CardType.SHA, "杀", 1)
            return

        if card.name == "万箭齐发":
            self.require_response_or_damage(target, CardType.SHAN, "闪", 1)
            return

        print("这个锦囊暂时没有效果。")

    def remove_target_card(self, actor: Player, target: Player) -> Optional[Card]:
        return self.take_target_card(actor, target, "弃置")

    def take_target_card(self, actor: Player, target: Player, action: str) -> Optional[Card]:
        options = self.target_card_options(target)
        if not options:
            return None
        if actor.is_ai:
            option = self.ai_choose_target_option(options)
            return self.pop_target_option(target, option)
        if len(options) == 1:
            print(f"自动选择唯一目标：{options[0][2]}")
            return self.pop_target_option(target, options[0])

        print(f"\n{target.name}可被{action}的牌：")
        for index, option in enumerate(options, start=1):
            print(f"{index}. {option[2]}")
        while True:
            choice = input(f"选择要{action}的对手牌编号：").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(options):
                return self.pop_target_option(target, options[int(choice) - 1])
            print("请输入有效编号。")

    def target_card_options(self, target: Player) -> list[tuple[str, int, str]]:
        options: list[tuple[str, int, str]] = []
        if target.weapon is not None:
            options.append(("weapon", 0, f"武器：{target.weapon}"))
        if target.armor is not None:
            options.append(("armor", 0, f"防具：{target.armor}"))
        if target.offensive_horse is not None:
            options.append(("offensive_horse", 0, f"-1马：{target.offensive_horse}"))
        if target.defensive_horse is not None:
            options.append(("defensive_horse", 0, f"+1马：{target.defensive_horse}"))
        for index in range(len(target.hand)):
            options.append(("hand", index, f"手牌{index + 1}（未知）"))
        return options

    def ai_choose_target_option(self, options: list[tuple[str, int, str]]) -> tuple[str, int, str]:
        visible_options = [option for option in options if option[0] != "hand"]
        if visible_options:
            return visible_options[0]
        return random.choice(options)

    def pop_target_option(self, target: Player, option: tuple[str, int, str]) -> Card:
        zone, index, _label = option
        if zone == "weapon":
            card = target.weapon
            target.weapon = None
            assert card is not None
            return card
        if zone == "armor":
            card = target.armor
            target.armor = None
            assert card is not None
            return card
        if zone == "offensive_horse":
            card = target.offensive_horse
            target.offensive_horse = None
            assert card is not None
            return card
        if zone == "defensive_horse":
            card = target.defensive_horse
            target.defensive_horse = None
            assert card is not None
            return card
        return target.hand.pop(index)

    def target_has_card(self, target: Player) -> bool:
        return bool(self.target_card_options(target))

    def target_has_visible_equipment(self, target: Player) -> bool:
        return any(
            card is not None
            for card in [target.weapon, target.armor, target.offensive_horse, target.defensive_horse]
        )

    def resolve_duel(self, actor: Player, target: Player) -> None:
        attacker = target
        defender = actor
        print(f"{actor.name}向{target.name}发起决斗。")
        while actor.alive and target.alive:
            if self.play_required_card(attacker, CardType.SHA, "杀"):
                print(f"{attacker.name}打出杀，决斗继续。")
                attacker, defender = defender, attacker
                continue
            real_damage = attacker.take_damage(1)
            print(f"{attacker.name}未打出杀，受到 {real_damage} 点伤害，剩余血量 {max(attacker.hp, 0)}。")
            if attacker.hero.name == "虞姬" and attacker.alive and real_damage > 0:
                self.draw_cards(attacker, 1)
                print(f"{attacker.name}触发舍身，摸1张牌。")
            return

    def require_response_or_damage(self, player: Player, card_type: CardType, card_name: str, damage: int) -> None:
        if self.play_required_card(player, card_type, card_name):
            print(f"{player.name}打出{card_name}，化解了锦囊。")
            return
        real_damage = player.take_damage(damage)
        print(f"{player.name}未打出{card_name}，受到 {real_damage} 点伤害，剩余血量 {max(player.hp, 0)}。")
        if player.hero.name == "虞姬" and player.alive and real_damage > 0:
            self.draw_cards(player, 1)
            print(f"{player.name}触发舍身，摸1张牌。")

    def play_required_card(self, player: Player, card_type: CardType, card_name: str) -> bool:
        card_index = self.find_response_card(player, card_type)
        if card_index is None:
            return False
        if player.is_ai:
            used = player.hand.pop(card_index)
            self.deck.discard(used)
            print(f"{player.name}打出{used}。")
            if card_type == CardType.SHAN:
                self.after_dodge(player)
            return True
        while True:
            answer = input(f"是否打出{card_name}响应？(y/n)：").strip().lower()
            if answer in {"y", "yes", "是"}:
                used = player.hand.pop(card_index)
                self.deck.discard(used)
                if card_type == CardType.SHAN:
                    self.after_dodge(player)
                return True
            if answer in {"n", "no", "否"}:
                return False
            print("请输入 y 或 n。")

    def resolve_attack(self, actor: Player, target: Player, damage: int) -> None:
        shan_index = self.find_response_card(target, CardType.SHAN)
        if shan_index is not None and self.should_dodge(target, damage):
            shan = target.hand.pop(shan_index)
            self.deck.discard(shan)
            print(f"{target.name}打出闪，躲过了攻击。")
            self.after_dodge(target)
            self.try_follow_sha(actor, target)
            return

        real_damage = target.take_damage(damage)
        print(f"{target.name}受到 {real_damage} 点伤害，剩余血量 {max(target.hp, 0)}。")
        if real_damage > 0:
            self.after_sha_hit(actor, target)
        if target.hero.name == "虞姬" and target.alive and real_damage > 0:
            self.draw_cards(target, 1)
            print(f"{target.name}触发舍身，摸1张牌。")

    def should_dodge(self, player: Player, damage: int) -> bool:
        if player.is_ai:
            return damage >= 1
        while True:
            answer = input(f"你被杀攻击，是否打出闪？(y/n，伤害 {damage})：").strip().lower()
            if answer in {"y", "yes", "是"}:
                return True
            if answer in {"n", "no", "否"}:
                return False
            print("请输入 y 或 n。")

    def can_play(self, actor: Player, target: Player, card: Card) -> bool:
        if card.type == CardType.SHAN:
            print("闪只能在被杀攻击时使用。")
            return False
        if card.type == CardType.SHA and not self.can_use_sha(actor):
            print("本回合不能再使用杀。")
            return False
        if card.type == CardType.SHA and not self.in_attack_range(actor, target):
            print(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
            return False
        if card.type == CardType.SCROLL and card.name == "顺手牵羊" and not self.can_use_shunshou(actor, target):
            print(f"距离不够。当前距离 {self.distance_between(actor, target)}，顺手牵羊距离 1。")
            return False
        if card.type == CardType.TAO and actor.hp >= actor.hero.max_hp:
            print("血量已满，不能使用桃。")
            return False
        return True

    def can_use_sha(self, actor: Player) -> bool:
        if actor.weapon is not None and actor.weapon.trait == "unlimited_sha":
            return True
        if actor.hero.name == "李白":
            return actor.sha_count_this_turn < 2
        if actor.hero.name == "杨延昭":
            return actor.sha_count_this_turn < 3
        return not actor.used_sha_this_turn

    def distance_between(self, actor: Player, target: Player) -> int:
        distance = 1
        if actor.offensive_horse is not None:
            distance -= actor.offensive_horse.power
        if target.defensive_horse is not None:
            distance += target.defensive_horse.power
        return max(1, distance)

    def in_attack_range(self, actor: Player, target: Player) -> bool:
        return self.distance_between(actor, target) <= actor.weapon_range

    def can_use_shunshou(self, actor: Player, target: Player) -> bool:
        return actor.hero.name == "时迁" or self.distance_between(actor, target) <= 1

    def draw_count_for_turn(self, actor: Player, target: Player) -> int:
        draw_count = 2
        if actor.hero.name == "秦始皇":
            draw_count += 1
        if actor.hero.name == "貂蝉" and len(target.hand) > len(actor.hand):
            draw_count += 1
        return draw_count

    def sha_damage_bonus(self, actor: Player, target: Player) -> int:
        bonus = 0
        if actor.hero.name == "项羽":
            bonus += 1
        if actor.hero.name == "荆轲" and target.hp >= actor.hp:
            bonus += 1
        if actor.hero.name == "程咬金" and actor.sha_count_this_turn == 1:
            bonus += 1
        return bonus

    def tao_heal_amount(self, actor: Player) -> int:
        amount = 1
        if actor.hero.name == "武则天" and actor.tao_count_this_turn == 0:
            amount += 1
        if actor.hero.name == "扁鹊":
            amount += 1
        return amount

    def after_dodge(self, player: Player) -> None:
        if player.hero.name == "花木兰" and player.alive:
            self.draw_cards(player, 1)
            print(f"{player.name}触发易装，摸1张牌。")

    def after_sha_hit(self, actor: Player, target: Player) -> None:
        if actor.weapon is None or actor.weapon.trait != "dismount":
            return
        removed = None
        if target.defensive_horse is not None:
            removed = target.defensive_horse
            target.defensive_horse = None
        elif target.offensive_horse is not None:
            removed = target.offensive_horse
            target.offensive_horse = None
        if removed is not None:
            self.deck.discard(removed)
            print(f"{actor.name}触发{actor.weapon.name}，弃掉了{target.name}的 {removed.name}。")

    def try_follow_sha(self, actor: Player, target: Player) -> None:
        if actor.weapon is None or actor.weapon.trait != "follow_sha":
            return
        if not actor.alive or not target.alive or not self.in_attack_range(actor, target):
            return
        sha_index = self.find_card(actor, CardType.SHA)
        if sha_index is None:
            return
        if actor.is_ai:
            follow = actor.hand.pop(sha_index)
            self.deck.discard(follow)
            print(f"{actor.name}触发青龙偃月刀，继续出杀。")
            self.use_sha(actor, target)
            return
        while True:
            answer = input("青龙偃月刀可继续出杀，是否追杀？(y/n)：").strip().lower()
            if answer in {"y", "yes", "是"}:
                follow = actor.hand.pop(sha_index)
                self.deck.discard(follow)
                self.use_sha(actor, target)
                return
            if answer in {"n", "no", "否"}:
                return
            print("请输入 y 或 n。")

    def find_card(self, player: Player, card_type: CardType) -> Optional[int]:
        for index, card in enumerate(player.hand):
            if card.type == card_type:
                return index
        return None

    def find_response_card(self, player: Player, card_type: CardType) -> Optional[int]:
        direct_card = self.find_card(player, card_type)
        if direct_card is not None:
            return direct_card
        if player.hero.name == "岳飞":
            if card_type == CardType.SHA:
                return self.find_card(player, CardType.SHAN)
            if card_type == CardType.SHAN:
                return self.find_card(player, CardType.SHA)
        return None

    def find_card_by_name(self, player: Player, name: str) -> Optional[int]:
        for index, card in enumerate(player.hand):
            if card.name == name:
                return index
        return None

    def find_better_equipment(self, player: Player) -> Optional[int]:
        for index, card in enumerate(player.hand):
            if card.type == CardType.WEAPON and (
                player.weapon is None or self.weapon_score(card) > self.weapon_score(player.weapon)
            ):
                return index
            if card.type == CardType.ARMOR and (player.armor is None or card.power > player.armor.power):
                return index
            if card.type == CardType.OFFENSIVE_HORSE and player.offensive_horse is None:
                return index
            if card.type == CardType.DEFENSIVE_HORSE and player.defensive_horse is None:
                return index
        return None

    def weapon_score(self, weapon: Card) -> int:
        trait_bonus = {
            "unlimited_sha": 5,
            "two_as_sha": 4,
            "dismount": 3,
            "follow_sha": 3,
        }.get(weapon.trait, 0)
        return weapon.range + weapon.power + trait_bonus

    def discard_down_to_hp(self, player: Player) -> None:
        limit = self.hand_limit(player)
        while len(player.hand) > limit:
            if player.is_ai:
                discard_index = self.ai_choose_discard(player)
                card = player.hand.pop(discard_index)
                print(f"AI 弃置了 {card}。")
                self.deck.discard(card)
                continue
            self.show_hand(player)
            choice = input(f"手牌数超过血量上限 {limit}，请选择弃牌编号：").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(player.hand):
                card = player.hand.pop(int(choice) - 1)
                self.deck.discard(card)
                print(f"你弃置了 {card}。")
            else:
                print("请输入有效编号。")

    def hand_limit(self, player: Player) -> int:
        limit = max(0, player.hp)
        if player.hero.name == "韩信":
            limit += 2
        return limit

    def ai_choose_discard(self, player: Player) -> int:
        priorities = {
            CardType.SHAN: 5,
            CardType.TAO: 4,
            CardType.SHA: 3,
            CardType.WINE: 2,
            CardType.SCROLL: 2,
            CardType.WEAPON: 1,
            CardType.ARMOR: 1,
            CardType.OFFENSIVE_HORSE: 1,
            CardType.DEFENSIVE_HORSE: 1,
        }
        return min(range(len(player.hand)), key=lambda i: priorities[player.hand[i].type])

    def show_status(self, show_ai_hand_count: bool = False) -> None:
        def equipment_text(player: Player) -> str:
            weapon = f"{player.weapon.name}/距{player.weapon_range}" if player.weapon else "无武器/距1"
            armor = player.armor.name if player.armor else "无防具"
            offensive_horse = player.offensive_horse.name if player.offensive_horse else "无-1马"
            defensive_horse = player.defensive_horse.name if player.defensive_horse else "无+1马"
            return f"{weapon}/{armor}/{offensive_horse}/{defensive_horse}"

        print(
            f"你：{self.player.hero.name} HP {self.player.hp}/{self.player.hero.max_hp} "
            f"装备[{equipment_text(self.player)}]"
        )
        ai_hand = f" 手牌:{len(self.ai.hand)}" if show_ai_hand_count else ""
        print(
            f"AI：{self.ai.hero.name} HP {self.ai.hp}/{self.ai.hero.max_hp} "
            f"装备[{equipment_text(self.ai)}]{ai_hand}"
        )

    def show_hand(self, player: Player) -> None:
        print("\n你的手牌：")
        print("0. 结束出牌")
        for skill_text in self.active_skill_help(player):
            print(skill_text)
        for index, card in enumerate(player.hand, start=1):
            print(f"{index}. {card} - {card.description}")

    def active_skill_help(self, player: Player) -> list[str]:
        if player.hero.name == "刘邦":
            return ["skill 1 编号...  驭人：弃任意张手牌并摸等量牌，每回合一次"]
        if player.hero.name == "赵匡胤":
            return ["skill 1 编号  释权：将一张手牌当釜底抽薪使用"]
        if player.hero.name == "岳飞":
            return ["skill 1 编号  武穆：将一张闪当杀使用；响应时杀闪可互用"]
        if player.hero.name == "褒姒":
            return ["skill 1 编号 编号  治愈：弃两张手牌回复1点血，每回合一次"]
        return []


def main() -> None:
    random.seed()
    Game().start()


if __name__ == "__main__":
    main()
