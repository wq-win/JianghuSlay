from __future__ import annotations

import random
from typing import Optional

import skills.active  # noqa: F401
import skills.passive  # noqa: F401
import cards.scrolls  # noqa: F401

from ai.strategy import (
    ai_choose_card,
    ai_choose_discard,
    ai_choose_target_option,
    ai_try_active_skill,
    ai_try_shixian_equipment,
    ai_try_zhangba,
)
from cards.registry import SCROLL_PLAY_CHECKS, SCROLL_REGISTRY
from heroes import HEROES
from models.card import Card, CardColor, CardSuit, CardType, is_sha_card, is_sha_type
from models.deck import Deck
from models.hero import Hero
from models.player import Player
from skills.registry import (
    ACTIVE_SKILLS_BY_HERO,
    HERO_SKILL_HOOKS,
    SKILL_HOTKEYS,
    active_skill_by_hotkey,
    active_skills_for_hero,
)
from engine.protocol import PromptKind, PromptOption
from engine.view import ConsoleView, GameView


AOE_SCROLLS = frozenset({"万箭齐发", "烽火狼烟"})
SELF_ONLY_SCROLLS = frozenset({"无中生有"})
SELF_ONLY_SKILLS = frozenset({"诗仙", "霸王", "驭人"})


class Game:
    def __init__(self, view: GameView | None = None) -> None:
        self.view: GameView = view or ConsoleView()
        self.deck = Deck(on_reshuffle=lambda: self.view.emit("\n牌库已洗入弃牌堆。", event_type="reshuffle"))
        self.player: Player
        self.ai: Player
        self.ai2: Player | None = None
        self.mode: str = "1v1"  # "1v1" | "1v2"
        self.round_no = 0
        self.winner: str | None = None

    def seat_of(self, player: Player) -> str:
        if getattr(self, "p1", None) is player:
            return "p1"
        if getattr(self, "p2", None) is player:
            return "p2"
        if getattr(self, "p3", None) is player:
            return "p3"
        if getattr(self, "player", None) is player:
            return "player"
        if getattr(self, "ai2", None) is player:
            return "ai2"
        if getattr(self, "ai", None) is player:
            return "ai"
        return "player"

    def all_players(self) -> list[Player]:
        players = [self.player, self.ai]
        if self.ai2 is not None:
            players.append(self.ai2)
        return players

    def turn_order(self) -> list[Player]:
        return self.all_players()

    def side_of(self, player: Player) -> str:
        if player is self.player or player is getattr(self, "p1", None):
            return "player"
        return "ai"

    def alive_enemies(self, actor: Player) -> list[Player]:
        side = self.side_of(actor)
        return [p for p in self.all_players() if p.alive and self.side_of(p) != side]

    def alive_allies(self, actor: Player) -> list[Player]:
        side = self.side_of(actor)
        return [p for p in self.all_players() if p.alive and self.side_of(p) == side and p is not actor]

    def default_foe(self, actor: Player) -> Player | None:
        foes = self.alive_enemies(actor)
        return foes[0] if foes else None

    def next_living_player(self, current: Player) -> Player | None:
        order = self.turn_order()
        if current not in order:
            return self.default_foe(current)
        idx = order.index(current)
        for offset in range(1, len(order) + 1):
            candidate = order[(idx + offset) % len(order)]
            if candidate.alive:
                return candidate
        return None

    def match_should_continue(self) -> bool:
        return self.player.alive and any(p.alive for p in self.all_players() if self.side_of(p) == "ai")

    def card_needs_enemy_target(self, card: Card) -> bool:
        if is_sha_type(card.type):
            return True
        if card.type == CardType.SCROLL:
            return card.name not in SELF_ONLY_SCROLLS and card.name not in AOE_SCROLLS
        return False

    def pick_enemy_target(self, actor: Player, *, purpose: str = "选择目标") -> Player | None:
        foes = self.alive_enemies(actor)
        if not foes:
            return None
        if len(foes) == 1 or actor.is_ai:
            return foes[0]
        options = [
            PromptOption(self.seat_of(foe), f"{foe.name}（{foe.hero.name} · {foe.hp}血）")
            for foe in foes
        ]
        while True:
            choice = self.view.ask_line(
                purpose,
                kind=PromptKind.CHOICE,
                options=options,
                player_id=self.seat_of(actor),
            ).strip()
            for foe in foes:
                if choice in {self.seat_of(foe), foe.name, foe.hero.name}:
                    return foe
            if choice.isdigit() and 1 <= int(choice) <= len(foes):
                return foes[int(choice) - 1]
            self.view.emit("请选择有效目标。")

    def start(
        self,
        *,
        player_hero: Hero | None = None,
        ai_hero: Hero | None = None,
        ai2_hero: Hero | None = None,
        player_name: str = "你",
        ai_name: str = "AI",
        ai2_name: str = "AI2",
        ai_is_ai: bool = True,
        mode: str = "1v1",
    ) -> None:
        self.mode = mode if mode in {"1v1", "1v2"} else "1v1"
        self.view.emit("=== 文字版英雄杀 ===")
        if self.mode == "1v2":
            self.view.emit("模式：1 人对战 2 人机。击败两名 AI 即胜。\n")
        else:
            self.view.emit("目标：击败对手。输入牌序号出牌，输入 0 结束出牌阶段。\n")
        hero = player_hero or self.choose_hero(player_id="player")
        self.player = Player(player_name, hero)
        pool = [item for item in HEROES if item != self.player.hero]
        if ai_hero is None:
            ai_hero = random.choice(pool)
        self.ai = Player(ai_name, ai_hero, is_ai=ai_is_ai)
        self.ai2 = None
        self.p1 = self.player
        self.p2 = self.ai
        self.p3 = None
        if self.mode == "1v2":
            pool2 = [item for item in pool if item != ai_hero]
            if ai2_hero is None:
                ai2_hero = random.choice(pool2 or pool)
            self.ai2 = Player(ai2_name, ai2_hero, is_ai=True)
            self.p3 = self.ai2

        self.view.emit(
            f"\n{self.player.name}选择了 {self.player.hero.name}："
            f"{self.player.hero.skill_name} - {self.player.hero.skill_desc}"
        )
        for combatant in self.all_players()[1:]:
            self.view.emit(
                f"{combatant.name}选择了 {combatant.hero.name}："
                f"{combatant.hero.skill_name} - {combatant.hero.skill_desc}"
            )
        self.view.emit("")

        for combatant in self.all_players():
            self.draw_cards(combatant, 4)

        self.round_no = 1
        while self.match_should_continue():
            self.view.emit(f"\n========== 第 {self.round_no} 轮 ==========")
            for actor in self.turn_order():
                if not self.match_should_continue():
                    break
                if not actor.alive:
                    continue
                foe = self.default_foe(actor)
                if foe is None:
                    break
                self.take_turn(actor, foe)
            self.round_no += 1

        if self.player.alive:
            self.winner = "player"
            self.view.emit("\n你赢了！天下英雄，尽入彀中。", event_type="game_over")
        else:
            self.winner = "ai"
            self.view.emit("\n你输了。胜败乃兵家常事，再来一局。", event_type="game_over")

    def choose_hero(self, *, player_id: str = "player") -> Hero:
        self.view.emit("请选择英雄：")
        options = [
            PromptOption(str(index), f"{hero.name}  血量:{hero.max_hp}  {hero.skill_name}: {hero.skill_desc}")
            for index, hero in enumerate(HEROES, start=1)
        ]
        for option in options:
            self.view.emit(f"{option.id}. {option.label}")
        while True:
            choice = self.view.ask_line(
                "输入英雄编号：",
                kind=PromptKind.HERO_SELECT,
                options=options,
                player_id=player_id,
            )
            if choice.isdigit() and 1 <= int(choice) <= len(HEROES):
                return HEROES[int(choice) - 1]
            self.view.emit("请输入有效编号。")

    def take_turn(self, actor: Player, target: Player) -> None:
        actor.used_sha_this_turn = False
        actor.sha_count_this_turn = 0
        actor.tao_count_this_turn = 0
        actor.bawang_stacks = 0
        actor.used_active_skills.clear()
        actor.wine_bonus = 0
        actor.shixian_active = False
        self.view.emit(f"\n-- {actor.name}的回合：{actor.hero.name} --")
        self.show_status()
        self.resolve_leidian(actor, target)
        self.resolve_poison_mark(actor)
        self.resolve_judgment_mark(actor, target)

        draw_count = self.draw_count_for_turn(actor, target)
        if draw_count > 0:
            self.draw_cards(actor, draw_count)
            self.view.emit(f"{actor.name}摸了 {draw_count} 张牌。")
        elif actor.block_turn_draw:
            actor.block_turn_draw = False
            self.view.emit(f"{actor.name}本回合不能摸牌。")

        if actor.is_ai:
            self.ai_play(actor, target)
        else:
            self.player_play(actor, target)

        if not actor.alive:
            return

        foe = target if target.alive else self.default_foe(actor)
        if foe is not None:
            self.trigger_on_turn_end(actor, foe)
        actor.prison_no_sha = False
        self.discard_down_to_hp(actor)

    def draw_cards(self, player: Player, count: int) -> None:
        player.hand.extend(self.deck.draw(count))

    def try_shiquan_bonus_draw(self, actor: Player) -> None:
        if random.random() < 0.25:
            self.draw_cards(actor, 1)
            self.view.emit(f"{actor.name}释权额外触发，摸了1张牌。")

    def _phase_foe(self, actor: Player, fallback: Player) -> Player | None:
        if fallback.alive and fallback in self.alive_enemies(actor):
            return fallback
        return self.default_foe(actor)

    def player_play(self, actor: Player, target: Player) -> None:
        while actor.alive and self.alive_enemies(actor):
            foe = self._phase_foe(actor, target)
            if foe is None:
                break
            if not self.can_continue_play_phase(actor, foe):
                self.view.emit("出牌阶段结束。")
                break
            self.show_status(show_ai_hand_count=True)
            self.show_hand(actor)
            if actor.shixian_active:
                self.show_shixian_equipment(actor)
            choice = self.view.ask_line(
                "出牌编号 / eq weapon ... / q w e r ... / sha 1 2 / 0结束：",
                kind=PromptKind.PLAY_CARD,
                player_id=self.seat_of(actor),
            )
            choice = choice.strip()
            # 仅对命令词小写，避免影响编号
            low = choice.lower()
            if low == "0":
                break
            parts = low.split()
            if parts and parts[0] in SKILL_HOTKEYS:
                skill = active_skill_by_hotkey(actor.hero.name, parts[0])
                if skill is not None and skill.skill_id not in SELF_ONLY_SKILLS:
                    skill_target = self.pick_enemy_target(actor, purpose=f"选择「{skill.skill_id}」的目标") or foe
                else:
                    skill_target = foe
                if not self.player_use_active_skill(actor, skill_target, parts[0], choice.split()[1:]):
                    self.view.emit("主动技能用法不正确。")
                elif not self.can_continue_play_phase(actor, skill_target):
                    self.view.emit("出牌阶段结束。")
                    break
                continue
            if low.startswith("eq "):
                slot = choice[3:].strip()
                skill_target = self.pick_enemy_target(actor, purpose="选择杀的目标") or foe
                if not self.player_use_equipment_as_sha(actor, skill_target, slot):
                    self.view.emit("装备当杀用法：eq weapon / eq armor / eq 进攻马 / eq 防御马")
                elif not self.can_continue_play_phase(actor, skill_target):
                    self.view.emit("出牌阶段结束。")
                    break
                continue
            if low.startswith("sha "):
                skill_target = self.pick_enemy_target(actor, purpose="选择杀的目标") or foe
                if self.player_use_zhangba(actor, skill_target, low):
                    if not self.can_continue_play_phase(actor, skill_target):
                        self.view.emit("出牌阶段结束。")
                        break
                    continue
                self.view.emit("丈八蛇矛用法：装备后输入 sha 两个手牌编号，例如 sha 1 2。")
                continue
            if not choice.isdigit() or not (1 <= int(choice) <= len(actor.hand)):
                self.view.emit("无效输入。")
                continue
            card = actor.hand[int(choice) - 1]
            play_target = foe
            if self.card_needs_enemy_target(card):
                play_target = self.pick_enemy_target(actor, purpose=f"选择「{card.name}」的目标")
                if play_target is None:
                    continue
            elif card.type == CardType.SCROLL and card.name in AOE_SCROLLS:
                play_target = foe
            if not self.can_play(actor, play_target, card):
                continue
            actor.hand.pop(int(choice) - 1)
            self.resolve_card(actor, play_target, card)
            if not self.can_continue_play_phase(actor, play_target if play_target.alive else foe):
                self.view.emit("出牌阶段结束。")
                break

    def ai_play(self, actor: Player, target: Player) -> None:
        self.view.emit(f"{actor.name} 正在思考...")
        acted = True
        while acted and actor.alive and target.alive:
            if not self.can_continue_play_phase(actor, target):
                self.view.emit(f"{actor.name} 出牌阶段结束。")
                break
            acted = False
            if ai_try_active_skill(self, actor, target):
                acted = True
                if not self.can_continue_play_phase(actor, target):
                    self.view.emit(f"{actor.name} 出牌阶段结束。")
                    break
                continue
            if ai_try_shixian_equipment(self, actor, target):
                acted = True
                if not self.can_continue_play_phase(actor, target):
                    self.view.emit(f"{actor.name} 出牌阶段结束。")
                    break
                continue
            card_index = ai_choose_card(self, actor, target)
            if card_index is not None:
                card = actor.hand.pop(card_index)
                self.view.emit(f"{actor.name} 使用了 {card}。")
                self.resolve_card(actor, target, card)
                acted = True
                if not self.can_continue_play_phase(actor, target):
                    self.view.emit(f"{actor.name} 出牌阶段结束。")
                    break
            elif ai_try_zhangba(self, actor, target):
                acted = True
                if not self.can_continue_play_phase(actor, target):
                    self.view.emit(f"{actor.name} 出牌阶段结束。")
                    break

    def resolve_card(self, actor: Player, target: Player, card: Card) -> None:
        if self.can_use_red_as_tao(actor, card):
            self.deck.discard(card)
            self.use_tao(actor, card, as_red=True)
            return

        if is_sha_type(card.type):
            self.deck.discard(card)
            self.use_sha(actor, target, virtual_source=card.name, source_card=card)
            return

        if self.should_play_normal_effect(actor, target, card):
            if card.type == CardType.TAO:
                self.use_tao(actor, card)
                self.deck.discard(card)
                return

            if card.type == CardType.WINE:
                actor.wine_bonus += 1
                self.view.emit(f"{actor.name}饮酒，本回合下一张杀伤害+1。")
                self.deck.discard(card)
                return

            if card.type == CardType.SCROLL:
                self.resolve_scroll(actor, target, card)
                self.deck.discard(card)
                return

            if card.type == CardType.WEAPON:
                self.deck.discard(actor.weapon)
                actor.weapon = card
                self.view.emit(f"{actor.name}装备了武器：{card.name}。")
                return

            if card.type == CardType.ARMOR:
                self.deck.discard(actor.armor)
                actor.armor = card
                self.view.emit(f"{actor.name}装备了防具：{card.name}。")
                return

            if card.type == CardType.OFFENSIVE_HORSE:
                self.deck.discard(actor.offensive_horse)
                actor.offensive_horse = card
                self.view.emit(f"{actor.name}装备了进攻马：{card.name}。")
                return

            if card.type == CardType.DEFENSIVE_HORSE:
                self.deck.discard(actor.defensive_horse)
                actor.defensive_horse = card
                self.view.emit(f"{actor.name}装备了防御马：{card.name}。")
                return

        if self.can_use_hand_as_sha(actor, target, card):
            self.deck.discard(card)
            self.use_sha(actor, target, f"诗仙·{card.name}当杀")
            return

        self.view.emit("这张牌现在不能主动使用。")
        actor.hand.append(card)

    def use_sha(
        self,
        actor: Player,
        target: Player,
        virtual_source: str = "杀",
        *,
        source_card: Optional[Card] = None,
    ) -> None:
        if not self.can_sha_target(actor, target):
            self.view.emit(f"{target.name}无手牌，兵仙护体，不能对其出杀。")
            return
        actor.used_sha_this_turn = True
        actor.sha_count_this_turn += 1
        damage = 1 + actor.attack_bonus + actor.wine_bonus + self.sha_damage_bonus(actor, target)
        actor.wine_bonus = 0
        self.view.emit(f"{actor.name}对{target.name}使用{virtual_source}，威力 {damage}。")
        self.resolve_attack(actor, target, damage, source_card=source_card)

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
            self.view.emit("本回合不能再使用杀。")
            return True
        if not self.in_attack_range(actor, target):
            self.view.emit(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
            return True
        if not self.can_sha_target(actor, target):
            self.view.emit(f"{target.name}无手牌，兵仙护体，不能对其出杀。")
            return True
        for index in sorted([first, second], reverse=True):
            self.deck.discard(actor.hand.pop(index))
        self.use_sha(actor, target, "丈八蛇矛转化的杀")
        return True

    def player_use_active_skill(
        self,
        actor: Player,
        target: Player,
        hotkey: str,
        args: list[str],
    ) -> bool:
        skill = active_skill_by_hotkey(actor.hero.name, hotkey)
        if skill is None:
            self.view.emit(f"快捷键 {hotkey.upper()} 未绑定技能。")
            return True
        return skill.player(self, actor, target, args)

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

    def swap_all_hands(self, actor: Player, target: Player) -> None:
        actor.hand, target.hand = target.hand, actor.hand

    def swap_hand_cards(
        self,
        actor: Player,
        target: Player,
        actor_indexes: list[int],
        target_indexes: list[int],
    ) -> None:
        actor_cards = self.pop_hand_indexes(actor, actor_indexes)
        target_cards: list[Card] = []
        for index in sorted(target_indexes, reverse=True):
            target_cards.append(target.hand.pop(index))
        target_cards.reverse()
        actor.hand.extend(target_cards)
        target.hand.extend(actor_cards)

    def player_choose_hand_indexes(
        self,
        owner: Player,
        count: int,
        *,
        chooser: Player | None = None,
    ) -> Optional[list[int]]:
        if len(owner.hand) < count:
            return None
        chooser = chooser or self.player
        while True:
            self.view.emit(f"\n选择{owner.name}的 {count} 张手牌（编号空格分隔）：")
            for index in range(len(owner.hand)):
                self.view.emit(f"{index + 1}. 手牌{index + 1}（未知）")
            choice = self.view.ask_line(
                "输入编号：",
                kind=PromptKind.SELECT_HAND,
                player_id=self.seat_of(chooser),
                min_count=count,
                max_count=count,
                meta={"owner_seat": self.seat_of(owner)},
            )
            parts = choice.split()
            if len(parts) != count or not all(part.isdigit() for part in parts):
                self.view.emit(f"请输入 {count} 个有效编号。")
                continue
            indexes = [int(part) - 1 for part in parts]
            if len(set(indexes)) != count:
                self.view.emit("编号不能重复。")
                continue
            if any(index < 0 or index >= len(owner.hand) for index in indexes):
                self.view.emit("编号超出范围。")
                continue
            return indexes

    def resolve_scroll(self, actor: Player, target: Player, card: Card) -> None:
        self.view.emit(f"{actor.name}使用锦囊：{card.name}。")
        handler = SCROLL_REGISTRY.get(card.name)
        if handler is None:
            self.view.emit("这个锦囊暂时没有效果。")
            return
        handler(self, actor, target, card)

    def remove_target_card(self, actor: Player, target: Player) -> Optional[Card]:
        return self.take_target_card(actor, target, "弃置")

    def take_target_card(self, actor: Player, target: Player, action: str) -> Optional[Card]:
        options = self.target_card_options(target)
        if not options:
            return None
        if actor.is_ai:
            option = ai_choose_target_option(options)
            return self.pop_target_option(target, option)
        if len(options) == 1:
            self.view.emit(f"自动选择唯一目标：{options[0][2]}")
            return self.pop_target_option(target, options[0])

        self.view.emit(f"\n{target.name}可被{action}的牌：")
        prompt_options = [PromptOption(str(index), option[2]) for index, option in enumerate(options, start=1)]
        for option in prompt_options:
            self.view.emit(f"{option.id}. {option.label}")
        while True:
            choice = self.view.ask_line(
                f"选择要{action}的对手牌编号：",
                kind=PromptKind.SELECT_TARGET_CARD,
                options=prompt_options,
                player_id=self.seat_of(actor),
            )
            if choice.isdigit() and 1 <= int(choice) <= len(options):
                return self.pop_target_option(target, options[int(choice) - 1])
            self.view.emit("请输入有效编号。")

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

    def apply_damage(
        self,
        target: Player,
        amount: int,
        source: Optional[Player] = None,
        *,
        message: Optional[str] = None,
    ) -> int:
        real_damage = target.take_damage(amount)
        if message is not None:
            self.view.emit(message.format(name=target.name, damage=real_damage, hp=max(target.hp, 0)))
        if real_damage > 0:
            self.trigger_on_damaged(target, real_damage, source)
        self.check_dying(target, source)
        return real_damage

    def use_tao(self, player: Player, card: Card, *, as_red: bool = False, as_wine: bool = False) -> int:
        amount = self.tao_heal_amount(player)
        player.tao_count_this_turn += 1
        healed = player.heal(amount)
        if as_wine:
            self.view.emit(f"{player.name}濒死，将酒当桃使用，回复 {healed} 点血。")
        elif as_red:
            self.view.emit(f"{player.name}将{card.name}当桃使用，回复 {healed} 点血。")
        else:
            self.view.emit(f"{player.name}使用桃，回复 {healed} 点血。")
        return healed

    def is_red_card(self, card: Card) -> bool:
        return card.color == CardColor.RED

    def has_red_hand_as_tao(self, actor: Player) -> bool:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        return hooks is not None and hooks.red_hand_as_tao

    def can_use_red_as_tao(self, actor: Player, card: Card) -> bool:
        if not self.has_red_hand_as_tao(actor):
            return False
        if actor.hp >= actor.hero.max_hp:
            return False
        return self.is_red_card(card)

    def resolve_leidian(self, actor: Player, target: Player) -> None:
        if not actor.leidian_pending:
            return
        actor.leidian_pending = False
        drawn = self.deck.draw(1)
        if not drawn:
            self.view.emit(f"{actor.name}的手捧雷判定：牌库为空，判定跳过。")
            return
        card = drawn[0]
        self.deck.discard(card)
        self.view.emit(f"{actor.name}的手捧雷判定：{card}。")
        if card.suit == CardSuit.HEART:
            receiver = self.next_living_player(actor) or target
            if receiver is actor:
                actor.leidian_pending = True
                self.view.emit("判定为红桃，场上无其他存活角色，手捧雷仍留在自己身上。")
            else:
                receiver.leidian_pending = True
                self.view.emit(f"判定为红桃，手捧雷传给{receiver.name}。")
            return
        self.apply_damage(
            actor,
            3,
            source=target,
            message="{name}手捧雷判定失败，受到 {damage} 点伤害，剩余血量 {hp}。",
        )

    def resolve_poison_mark(self, actor: Player) -> None:
        if not actor.poison_mark_pending:
            return
        actor.poison_mark_pending = False
        drawn = self.deck.draw(1)
        if not drawn:
            self.view.emit(f"{actor.name}的毒杀标记判定：牌库为空，判定跳过。")
            return
        card = drawn[0]
        self.deck.discard(card)
        color_text = "红色" if self.is_red_card(card) else "黑色"
        self.view.emit(f"{actor.name}的毒杀标记判定：{card}（{color_text}）。")
        if self.is_red_card(card):
            self.view.emit("判定为红色，可正常摸牌。")
            return
        actor.block_turn_draw = True
        self.view.emit(f"{actor.name}判定为黑色，本回合不能摸牌。")

    def resolve_judgment_mark(self, actor: Player, target: Player) -> None:
        if not actor.judgment_mark_pending:
            return
        actor.judgment_mark_pending = False
        drawn = self.deck.draw(1)
        if not drawn:
            self.view.emit(f"{actor.name}的女帝标记判定：牌库为空，判定跳过。")
            return
        card = drawn[0]
        self.deck.discard(card)
        color_text = "红色" if self.is_red_card(card) else "黑色"
        self.view.emit(f"{actor.name}的女帝标记判定：{card}（{color_text}）。")
        if not self.is_red_card(card):
            self.view.emit("判定为非红色，未受到伤害。")
            return
        self.apply_damage(
            actor,
            1,
            source=target,
            message="{name}女帝标记判定成功，受到 {damage} 点伤害，剩余血量 {hp}。",
        )

    def check_dying(self, player: Player, source: Optional[Player] = None) -> None:
        if player.hp <= 0:
            self.resolve_dying(player, source)

    def find_rescue_card_indexes(self, player: Player) -> list[int]:
        return [
            index
            for index, card in enumerate(player.hand)
            if card.type in {CardType.TAO, CardType.WINE} or self.can_use_red_as_tao(player, card)
        ]

    def resolve_dying(self, player: Player, source: Optional[Player] = None) -> None:
        while player.hp <= 0:
            if self.trigger_opponent_dying_skills(player):
                return

            rescue_indexes = self.find_rescue_card_indexes(player)
            if not rescue_indexes:
                self.view.emit(f"{player.name}濒死，没有桃或酒，阵亡。")
                return

            self.view.emit(f"\n{player.name}濒死（血量 {player.hp}），需要桃或酒救回。")
            if player.is_ai:
                card_index = self.find_card(player, CardType.TAO)
                if card_index is None:
                    card_index = self.find_card(player, CardType.WINE)
                if card_index is None and self.has_red_hand_as_tao(player):
                    for index, card in enumerate(player.hand):
                        if self.is_red_card(card):
                            card_index = index
                            break
                if card_index is None:
                    card_index = rescue_indexes[0]
                card = player.hand.pop(card_index)
                self.use_tao(
                    player,
                    card,
                    as_red=self.can_use_red_as_tao(player, card),
                    as_wine=card.type == CardType.WINE,
                )
                self.deck.discard(card)
                continue

            rescue_options = [
                PromptOption(str(option_no), str(player.hand[index]))
                for option_no, index in enumerate(rescue_indexes, start=1)
            ]
            rescue_options.append(PromptOption("0", "不救"))
            for option in rescue_options:
                self.view.emit(f"{option.id}. {option.label}")

            choice = self.view.ask_line(
                "选择用于救回的牌编号：",
                kind=PromptKind.RESCUE,
                options=rescue_options,
                player_id=self.seat_of(player),
            )
            if choice == "0":
                self.view.emit(f"{player.name}放弃救回，阵亡。")
                return
            if not choice.isdigit() or not (1 <= int(choice) <= len(rescue_indexes)):
                self.view.emit("无效输入，放弃救回，阵亡。")
                return

            card = player.hand.pop(rescue_indexes[int(choice) - 1])
            self.use_tao(
                player,
                card,
                as_red=self.can_use_red_as_tao(player, card),
                as_wine=card.type == CardType.WINE,
            )
            self.deck.discard(card)

    def trigger_on_damaged(self, target: Player, amount: int, source: Optional[Player] = None) -> None:
        hooks = HERO_SKILL_HOOKS.get(target.hero.name)
        if hooks is None:
            return
        for handler in hooks.on_damaged:
            handler(self, target, amount, source)

    def trigger_opponent_dying_skills(self, dying: Player) -> bool:
        for opponent in self.all_players():
            if opponent is dying or not opponent.alive:
                continue
            hooks = HERO_SKILL_HOOKS.get(opponent.hero.name)
            if hooks is None:
                continue
            for handler in hooks.on_opponent_dying:
                if handler(self, opponent, dying):
                    return True
        return False

    def trigger_on_turn_start(self, actor: Player, target: Player) -> int:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return 0
        return sum(handler(self, actor, target) for handler in hooks.on_turn_start)

    def trigger_on_turn_end(self, actor: Player, target: Player) -> None:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return
        for handler in hooks.on_turn_end:
            handler(self, actor, target)

    def trigger_on_dodge(self, player: Player) -> None:
        if not player.alive:
            return
        hooks = HERO_SKILL_HOOKS.get(player.hero.name)
        if hooks is None:
            return
        for handler in hooks.on_dodge:
            handler(self, player)

    def trigger_on_sha_dodged(self, actor: Player, target: Player) -> None:
        if not actor.alive:
            return
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return
        for handler in hooks.on_sha_dodged:
            handler(self, actor, target)

    def resolve_duel(self, actor: Player, target: Player) -> None:
        attacker = target
        defender = actor
        self.view.emit(f"{actor.name}向{target.name}发起决斗。")
        while actor.alive and target.alive:
            if self.play_required_card(attacker, CardType.SHA, "杀"):
                self.view.emit(f"{attacker.name}打出杀，决斗继续。")
                attacker, defender = defender, attacker
                continue
            self.apply_damage(
                attacker,
                1,
                source=defender,
                message="{name}未打出杀，受到 {damage} 点伤害，剩余血量 {hp}。",
            )
            return

    def require_response_or_damage(
        self,
        player: Player,
        card_type: CardType,
        card_name: str,
        damage: int,
        source: Optional[Player] = None,
    ) -> None:
        if self.play_required_card(player, card_type, card_name):
            self.view.emit(f"{player.name}打出{card_name}，化解了锦囊。")
            return
        self.apply_damage(
            player,
            damage,
            source=source,
            message=f"{{name}}未打出{card_name}，受到 {{damage}} 点伤害，剩余血量 {{hp}}。",
        )

    def play_required_card(self, player: Player, card_type: CardType, card_name: str) -> bool:
        card_index = self.find_response_card(player, card_type)
        if card_index is None:
            return False
        if player.is_ai:
            used = player.hand.pop(card_index)
            self.deck.discard(used)
            self.view.emit(f"{player.name}打出{used}。")
            if card_type == CardType.SHAN:
                self.trigger_on_dodge(player)
            return True
        if self.view.ask_confirm(
            f"是否打出{card_name}响应？(y/n)：",
            player_id=self.seat_of(player),
        ):
            used = player.hand.pop(card_index)
            self.deck.discard(used)
            if card_type == CardType.SHAN:
                self.trigger_on_dodge(player)
            return True
        return False

    def resolve_attack(
        self,
        actor: Player,
        target: Player,
        damage: int,
        *,
        source_card: Optional[Card] = None,
    ) -> None:
        if self.is_sha_unavoidable(actor, target):
            self.view.emit(f"{actor.name}刺客发动，目标血量高于{actor.name}手牌数，杀必中。")
            real_damage = self.apply_damage(
                target,
                damage,
                source=actor,
                message="{name}受到 {damage} 点伤害，剩余血量 {hp}。",
            )
            if real_damage > 0:
                self.after_sha_hit(actor, target, source_card=source_card, damage=real_damage)
            return

        shans_required = self.shans_required_to_dodge(actor, target)
        shan_indexes = self.find_response_card_indexes(target, CardType.SHAN)
        if (
            len(shan_indexes) >= shans_required
            and self.should_dodge(target, damage, shans_required=shans_required, actor=actor)
        ):
            used_shans: list[Card] = []
            for _ in range(shans_required):
                shan_index = self.find_response_card(target, CardType.SHAN)
                assert shan_index is not None
                used_shans.append(target.hand.pop(shan_index))
            self.deck.discard(used_shans)
            if shans_required > 1:
                self.view.emit(f"{target.name}打出{shans_required}张闪，躲过了攻击。")
            else:
                self.view.emit(f"{target.name}打出闪，躲过了攻击。")
            self.trigger_on_dodge(target)
            self.trigger_on_sha_dodged(actor, target)
            self.try_follow_sha(actor, target)
            return

        real_damage = self.apply_damage(
            target,
            damage,
            source=actor,
            message="{name}受到 {damage} 点伤害，剩余血量 {hp}。",
        )
        if real_damage > 0:
            self.after_sha_hit(actor, target, source_card=source_card, damage=real_damage)

    def should_dodge(
        self,
        player: Player,
        damage: int,
        *,
        shans_required: int = 1,
        actor: Optional[Player] = None,
    ) -> bool:
        if player.is_ai:
            return damage >= 1 and len(self.find_response_card_indexes(player, CardType.SHAN)) >= shans_required
        seat = self.seat_of(player)
        if shans_required > 1:
            actor_name = actor.name if actor is not None else "对手"
            return self.view.ask_confirm(
                f"需要{shans_required}张闪才能躲过{actor_name}的刺杀，是否打出？(y/n，伤害 {damage})：",
                player_id=seat,
            )
        return self.view.ask_confirm(
            f"你被杀攻击，是否打出闪？(y/n，伤害 {damage})：",
            player_id=seat,
        )

    def has_all_hand_as_sha(self, actor: Player) -> bool:
        return actor.shixian_active

    SHIXIAN_EQUIPMENT_SLOTS: dict[str, str] = {
        "weapon": "weapon",
        "武器": "weapon",
        "w": "weapon",
        "armor": "armor",
        "防具": "armor",
        "a": "armor",
        "进攻马": "offensive_horse",
        "-1马": "offensive_horse",
        "o": "offensive_horse",
        "防御马": "defensive_horse",
        "+1马": "defensive_horse",
        "d": "defensive_horse",
    }

    def equipment_slot_card(self, player: Player, slot: str) -> Optional[Card]:
        return {
            "weapon": player.weapon,
            "armor": player.armor,
            "offensive_horse": player.offensive_horse,
            "defensive_horse": player.defensive_horse,
        }.get(slot)

    def clear_equipment_slot(self, player: Player, slot: str) -> None:
        if slot == "weapon":
            player.weapon = None
        elif slot == "armor":
            player.armor = None
        elif slot == "offensive_horse":
            player.offensive_horse = None
        elif slot == "defensive_horse":
            player.defensive_horse = None

    def normalize_equipment_slot(self, slot_name: str) -> Optional[str]:
        return self.SHIXIAN_EQUIPMENT_SLOTS.get(slot_name.strip().lower())

    def can_use_equipment_as_sha(self, actor: Player, target: Player, slot: str) -> bool:
        if not self.has_all_hand_as_sha(actor):
            return False
        if not self.can_use_sha(actor):
            return False
        if not self.in_attack_range(actor, target):
            return False
        if not self.can_sha_target(actor, target):
            return False
        return self.equipment_slot_card(actor, slot) is not None

    def use_equipment_as_sha(self, actor: Player, target: Player, slot: str) -> bool:
        card = self.equipment_slot_card(actor, slot)
        if card is None:
            return False
        self.clear_equipment_slot(actor, slot)
        self.deck.discard(card)
        self.use_sha(actor, target, f"诗仙·{card.name}当杀")
        return True

    def player_use_equipment_as_sha(self, actor: Player, target: Player, slot_name: str) -> bool:
        slot = self.normalize_equipment_slot(slot_name)
        if slot is None:
            return False
        if not self.has_all_hand_as_sha(actor):
            self.view.emit("请先发动诗仙。")
            return True
        if self.equipment_slot_card(actor, slot) is None:
            self.view.emit("该装备位没有牌。")
            return True
        if not self.can_use_sha(actor):
            self.view.emit("本回合不能再使用杀。")
            return True
        if not self.in_attack_range(actor, target):
            self.view.emit(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
            return True
        if not self.can_sha_target(actor, target):
            self.view.emit(f"{target.name}无手牌，兵仙护体，不能对其出杀。")
            return True
        return self.use_equipment_as_sha(actor, target, slot)

    def has_shixian_playable(self, actor: Player, target: Player) -> bool:
        if actor.hero.name != "李白":
            return False
        if not self.can_use_sha(actor) or not self.in_attack_range(actor, target):
            return False
        for card in actor.hand:
            if card.type == CardType.TAO and actor.hp < actor.hero.max_hp:
                continue
            return True
        return any(
            self.equipment_slot_card(actor, slot) is not None
            for slot in ("weapon", "armor", "offensive_horse", "defensive_horse")
        )

    def can_continue_play_phase(self, actor: Player, target: Player) -> bool:
        if actor.hand:
            return True
        if self.has_all_hand_as_sha(actor):
            return any(
                self.can_use_equipment_as_sha(actor, target, slot)
                for slot in ("weapon", "armor", "offensive_horse", "defensive_horse")
            )
        return False

    def show_shixian_equipment(self, actor: Player) -> None:
        labels = {
            "weapon": "weapon",
            "armor": "armor",
            "offensive_horse": "进攻马",
            "defensive_horse": "防御马",
        }
        options = []
        for slot, label in labels.items():
            card = self.equipment_slot_card(actor, slot)
            if card is not None:
                options.append(f"eq {label} -> {card}")
        if options:
            self.view.emit("诗仙装备可当杀：" + "；".join(options))

    def should_play_normal_effect(self, actor: Player, target: Player, card: Card) -> bool:
        if self.can_use_red_as_tao(actor, card):
            return False
        if self.has_all_hand_as_sha(actor):
            if card.type == CardType.TAO and actor.hp < actor.hero.max_hp:
                return True
            return False
        if card.type == CardType.TAO and actor.hp < actor.hero.max_hp:
            return True
        if card.type == CardType.WINE:
            return True
        if card.type == CardType.SCROLL:
            checker = SCROLL_PLAY_CHECKS.get(card.name)
            if checker is None:
                return True
            return checker(self, actor, target)
        if card.type in {
            CardType.SHA,
            CardType.BLOOD_SHA,
            CardType.POISON_SHA,
            CardType.WEAPON,
            CardType.ARMOR,
            CardType.OFFENSIVE_HORSE,
            CardType.DEFENSIVE_HORSE,
        }:
            return True
        return False

    def can_use_hand_as_sha(self, actor: Player, target: Player, card: Card) -> bool:
        if not self.has_all_hand_as_sha(actor):
            return False
        if card.type == CardType.TAO and actor.hp < actor.hero.max_hp:
            return False
        if not self.can_use_sha(actor):
            return False
        if not self.in_attack_range(actor, target):
            return False
        if not self.can_sha_target(actor, target):
            return False
        return True

    def can_sha_target(self, actor: Player, target: Player) -> bool:
        if target.hand:
            return True
        hooks = HERO_SKILL_HOOKS.get(target.hero.name)
        return hooks is None or not hooks.immune_to_sha_without_hand

    def can_play(self, actor: Player, target: Player, card: Card) -> bool:
        if card.type == CardType.SHAN and not self.can_use_hand_as_sha(actor, target, card):
            self.view.emit("闪只能在被杀攻击时使用。")
            return False

        if self.can_use_red_as_tao(actor, card):
            return True

        if self.should_play_normal_effect(actor, target, card):
            if card.type in {CardType.SHA, CardType.BLOOD_SHA, CardType.POISON_SHA, CardType.WEAPON, CardType.ARMOR, CardType.OFFENSIVE_HORSE, CardType.DEFENSIVE_HORSE}:
                if is_sha_type(card.type) and actor.prison_no_sha:
                    self.view.emit("画地为牢中，不能使用杀。")
                    return False
                if is_sha_type(card.type) and not self.can_use_sha(actor):
                    self.view.emit("本回合不能再使用杀。")
                    return False
                if is_sha_type(card.type) and not self.in_attack_range(actor, target):
                    self.view.emit(f"距离不够。当前距离 {self.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
                    return False
                if is_sha_type(card.type) and not self.can_sha_target(actor, target):
                    self.view.emit(f"{target.name}无手牌，兵仙护体，不能对其出杀。")
                    return False
            if card.type == CardType.SCROLL:
                checker = SCROLL_PLAY_CHECKS.get(card.name)
                if checker is not None and not checker(self, actor, target):
                    if card.name == "顺手牵羊" and self.is_immune_to_shunshou(target):
                        self.view.emit(f"{target.name}免疫顺手牵羊。")
                    elif card.name == "顺手牵羊":
                        self.view.emit(f"距离不够。当前距离 {self.distance_between(actor, target)}，顺手牵羊距离 1。")
                    else:
                        self.view.emit(f"{card.name}现在不能使用。")
                    return False
            if card.type == CardType.TAO and actor.hp >= actor.hero.max_hp:
                if self.can_use_hand_as_sha(actor, target, card):
                    return True
                self.view.emit("血量已满，不能使用桃。")
                return False
            return True

        if self.can_use_hand_as_sha(actor, target, card):
            return True

        if card.type == CardType.SHAN:
            self.view.emit("闪只能在被杀攻击时使用。")
        elif card.type == CardType.TAO:
            self.view.emit("血量已满，不能使用桃。")
        else:
            self.view.emit("这张牌现在不能主动使用。")
        return False

    def can_use_sha(self, actor: Player) -> bool:
        if actor.prison_no_sha:
            return False
        if actor.weapon is not None and actor.weapon.trait == "unlimited_sha":
            return True
        max_sha = self.get_max_sha_per_turn(actor)
        return actor.sha_count_this_turn < max_sha

    def get_max_sha_per_turn(self, actor: Player) -> int:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is not None:
            return hooks.max_sha_per_turn
        return 1

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
        if self.is_immune_to_shunshou(target):
            return False
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is not None and hooks.shunshou_no_distance_limit:
            return True
        return self.distance_between(actor, target) <= 1

    def is_immune_to_shunshou(self, player: Player) -> bool:
        hooks = HERO_SKILL_HOOKS.get(player.hero.name)
        return hooks is not None and hooks.immune_to_shunshou

    def draw_count_for_turn(self, actor: Player, target: Player) -> int:
        if actor.block_turn_draw:
            return 0
        return 2 + self.trigger_on_turn_start(actor, target)

    def sha_damage_bonus(self, actor: Player, target: Player) -> int:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return 0
        return sum(handler(self, actor, target) for handler in hooks.sha_damage_bonus)

    def is_sha_unavoidable(self, actor: Player, target: Player) -> bool:
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return False
        return any(handler(self, actor, target) for handler in hooks.sha_unavoidable)

    def shans_required_to_dodge(self, actor: Player, target: Player) -> int:
        required = 1
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is None:
            return required
        for handler in hooks.shans_required_to_dodge:
            required = max(required, handler(self, actor, target))
        return required

    def preview_sha_damage(self, actor: Player, target: Player) -> int:
        return 1 + actor.attack_bonus + actor.wine_bonus + self.sha_damage_bonus(actor, target)

    def tao_heal_amount(self, actor: Player) -> int:
        amount = 1
        hooks = HERO_SKILL_HOOKS.get(actor.hero.name)
        if hooks is not None:
            amount += sum(handler(self, actor) for handler in hooks.tao_heal_bonus)
        return amount

    def after_sha_hit(
        self,
        actor: Player,
        target: Player,
        *,
        source_card: Optional[Card] = None,
        damage: int = 0,
    ) -> None:
        if source_card is not None:
            if source_card.type == CardType.BLOOD_SHA and damage > 0:
                healed = actor.heal(damage)
                self.view.emit(f"{actor.name}血杀命中，回复 {healed} 点血。")
            if source_card.type == CardType.POISON_SHA:
                target.poison_mark_pending = True
                self.view.emit(f"{target.name}中毒，下回合开始前判定，黑色则不能摸牌。")

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
            self.view.emit(f"{actor.name}触发{actor.weapon.name}，弃掉了{target.name}的 {removed.name}。")

    def try_follow_sha(self, actor: Player, target: Player) -> None:
        if actor.weapon is None or actor.weapon.trait != "follow_sha":
            return
        if not actor.alive or not target.alive or not self.in_attack_range(actor, target):
            return
        if not self.can_sha_target(actor, target):
            return
        sha_index = self.find_sha_card(actor)
        if sha_index is None:
            return
        if actor.is_ai:
            follow = actor.hand.pop(sha_index)
            self.deck.discard(follow)
            self.view.emit(f"{actor.name}触发青龙偃月刀，继续出杀。")
            self.use_sha(actor, target)
            return
        if self.view.ask_confirm(
            "青龙偃月刀可继续出杀，是否追杀？(y/n)：",
            player_id=self.seat_of(actor),
        ):
            follow = actor.hand.pop(sha_index)
            self.deck.discard(follow)
            self.use_sha(actor, target)

    def find_card(self, player: Player, card_type: CardType) -> Optional[int]:
        for index, card in enumerate(player.hand):
            if card.type == card_type:
                return index
        return None

    def find_sha_card(self, player: Player) -> Optional[int]:
        for index, card in enumerate(player.hand):
            if is_sha_card(card):
                return index
        return None

    def find_response_card(self, player: Player, card_type: CardType) -> Optional[int]:
        if card_type == CardType.SHA:
            sha_index = self.find_sha_card(player)
            if sha_index is not None:
                return sha_index
        else:
            direct_card = self.find_card(player, card_type)
            if direct_card is not None:
                return direct_card
        hooks = HERO_SKILL_HOOKS.get(player.hero.name)
        if hooks is not None and hooks.response_sha_shan_swap:
            if card_type == CardType.SHA:
                return self.find_card(player, CardType.SHAN)
            if card_type == CardType.SHAN:
                return self.find_sha_card(player)
        return None

    def find_response_card_indexes(self, player: Player, card_type: CardType) -> list[int]:
        if card_type == CardType.SHA:
            indexes = [index for index, card in enumerate(player.hand) if is_sha_card(card)]
        else:
            indexes = [index for index, card in enumerate(player.hand) if card.type == card_type]
        hooks = HERO_SKILL_HOOKS.get(player.hero.name)
        if hooks is not None and hooks.response_sha_shan_swap:
            if card_type == CardType.SHA:
                indexes.extend(
                    index for index, card in enumerate(player.hand) if card.type == CardType.SHAN
                )
            if card_type == CardType.SHAN:
                indexes.extend(
                    index for index, card in enumerate(player.hand) if is_sha_card(card)
                )
        return sorted(set(indexes))

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

    def discard_from_hand(self, player: Player, count: int, *, reason: str = "") -> None:
        label = f"{reason}：" if reason else ""
        for _ in range(count):
            if not player.hand:
                return
            if player.is_ai:
                discard_index = ai_choose_discard(player)
                card = player.hand.pop(discard_index)
                if reason:
                    self.view.emit(f"{player.name}触发{reason}，弃置了 {card}。")
                else:
                    self.view.emit(f"AI 弃置了 {card}。")
                self.deck.discard(card)
                continue
            self.show_hand(player)
            discard_options = [
                PromptOption(str(index), str(card))
                for index, card in enumerate(player.hand, start=1)
            ]
            choice = self.view.ask_line(
                f"{label}请选择弃置的牌编号：",
                kind=PromptKind.DISCARD,
                options=discard_options,
                player_id=self.seat_of(player),
            )
            if choice.isdigit() and 1 <= int(choice) <= len(player.hand):
                card = player.hand.pop(int(choice) - 1)
                self.deck.discard(card)
                if reason:
                    self.view.emit(f"你因{reason}弃置了 {card}。")
                else:
                    self.view.emit(f"你弃置了 {card}。")
            else:
                self.view.emit("请输入有效编号。")

    def discard_down_to_hp(self, player: Player) -> None:
        limit = self.hand_limit(player)
        while len(player.hand) > limit:
            if player.is_ai:
                discard_index = ai_choose_discard(player)
                card = player.hand.pop(discard_index)
                self.view.emit(f"AI 弃置了 {card}。")
                self.deck.discard(card)
                continue
            self.show_hand(player)
            discard_options = [
                PromptOption(str(index), str(card))
                for index, card in enumerate(player.hand, start=1)
            ]
            choice = self.view.ask_line(
                f"手牌数超过血量上限 {limit}，请选择弃牌编号：",
                kind=PromptKind.DISCARD,
                options=discard_options,
                player_id=self.seat_of(player),
            )
            if choice.isdigit() and 1 <= int(choice) <= len(player.hand):
                card = player.hand.pop(int(choice) - 1)
                self.deck.discard(card)
                self.view.emit(f"你弃置了 {card}。")
            else:
                self.view.emit("请输入有效编号。")

    def hand_limit(self, player: Player) -> int:
        limit = max(0, player.hp)
        hooks = HERO_SKILL_HOOKS.get(player.hero.name)
        if hooks is not None:
            limit += sum(handler(self, player) for handler in hooks.hand_limit_bonus)
        return limit

    def show_status(self, show_ai_hand_count: bool = False) -> None:
        def equipment_text(player: Player) -> str:
            weapon = f"{player.weapon.name}/距{player.weapon_range}" if player.weapon else "无武器/距1"
            armor = player.armor.name if player.armor else "无防具"
            offensive_horse = player.offensive_horse.name if player.offensive_horse else "无-1马"
            defensive_horse = player.defensive_horse.name if player.defensive_horse else "无+1马"
            return f"{weapon}/{armor}/{offensive_horse}/{defensive_horse}"

        for combatant in self.all_players():
            label = "你" if combatant is self.player else combatant.name
            hand_info = ""
            if combatant is not self.player and show_ai_hand_count:
                hand_info = f" 手牌:{len(combatant.hand)}"
            status = "（阵亡）" if not combatant.alive else ""
            self.view.emit(
                f"{label}：{combatant.hero.name} HP {max(combatant.hp, 0)}/{combatant.hero.max_hp} "
                f"装备[{equipment_text(combatant)}]{hand_info}{status}"
            )

    def show_hand(self, player: Player) -> None:
        self.view.emit("\n你的手牌：")
        self.view.emit("0. 结束出牌")
        for skill_text in self.active_skill_help(player):
            self.view.emit(skill_text)
        for index, card in enumerate(player.hand, start=1):
            self.view.emit(f"{index}. {card} - {card.description}")

    def active_skill_help(self, player: Player) -> list[str]:
        return [
            f"[{skill.hotkey}] {skill.help_text}"
            for skill in active_skills_for_hero(player.hero.name)
        ]
