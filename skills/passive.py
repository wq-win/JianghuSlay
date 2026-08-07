from __future__ import annotations

from typing import Literal, Optional, TYPE_CHECKING

from models.card import CardType
from models.player import Player
from skills.registry import HERO_SKILL_HOOKS, SkillHooks

if TYPE_CHECKING:
    from game import Game


SheshenChoice = Literal["draw", "retaliate"]
LijianChoice = Literal["draw", "discard"]
YuefeiDamagedChoice = Literal["take", "draw_discard"]


def _can_sheshen_retaliate(target: Player, source: Optional[Player]) -> bool:
    return source is not None and source.alive and source is not target


def _player_sheshen_choice(game: Game, target: Player, source: Optional[Player]) -> SheshenChoice:
    if not _can_sheshen_retaliate(target, source):
        return "draw"
    while True:
        assert source is not None
        game.view.emit(f"\n{target.name}触发舍身，请选择：")
        game.view.emit("1. 摸2张牌")
        game.view.emit(f"2. 令{source.name}失去1点血")
        choice = game.view.ask_line(
            "输入选项：",
            kind="choice",
            options=["摸2张牌", f"令{source.name}失去1点血"],
            player_id=game.seat_of(target),
        )
        if choice == "1":
            return "draw"
        if choice == "2":
            return "retaliate"
        game.view.emit("请输入 1 或 2。")


def _ai_sheshen_choice(target: Player, source: Optional[Player]) -> SheshenChoice:
    if not _can_sheshen_retaliate(target, source):
        return "draw"
    assert source is not None
    if source.hp <= 1:
        return "retaliate"
    if target.hp <= 2:
        return "draw"
    if source.hp <= target.hp:
        return "retaliate"
    return "draw"


def _on_damaged_sheshen(game: Game, target: Player, amount: int, source: Optional[Player]) -> None:
    if not target.alive:
        return

    if target.is_ai:
        choice = _ai_sheshen_choice(target, source)
    else:
        choice = _player_sheshen_choice(game, target, source)

    if choice == "retaliate":
        assert source is not None
        game.apply_damage(
            source,
            1,
            source=target,
            message=f"{{name}}受到{target.name}舍身反击，受到 {{damage}} 点伤害，剩余血量 {{hp}}。",
        )
        return

    game.draw_cards(target, 2)
    game.view.emit(f"{target.name}触发舍身，摸2张牌。")


def _can_yuefei_counter(source: Optional[Player], target: Player) -> bool:
    return source is not None and source.alive and source is not target


def _player_yuefei_damaged_choice(game: Game, target: Player, source: Player) -> YuefeiDamagedChoice:
    while True:
        game.view.emit(f"\n{target.name}触发武穆，请选择：")
        game.view.emit(f"1. 获得{source.name}1张牌")
        game.view.emit(f"2. 摸1张牌并弃置{source.name}1张牌")
        choice = game.view.ask_line(
            "输入选项：",
            kind="choice",
            options=[f"获得{source.name}1张牌", f"摸1张牌并弃置{source.name}1张牌"],
            player_id=game.seat_of(target),
        )
        if choice == "1":
            return "take"
        if choice == "2":
            return "draw_discard"
        game.view.emit("请输入 1 或 2。")


def _ai_yuefei_damaged_choice(game: Game, target: Player, source: Player) -> YuefeiDamagedChoice:
    if game.target_has_visible_equipment(source) or len(source.hand) >= 2:
        return "draw_discard"
    if game.target_has_card(source):
        return "take"
    return "draw_discard"


def _on_damaged_yuefei(game: Game, target: Player, amount: int, source: Optional[Player]) -> None:
    if not target.alive or not _can_yuefei_counter(source, target):
        return
    assert source is not None

    if target.is_ai:
        choice = _ai_yuefei_damaged_choice(game, target, source)
    else:
        choice = _player_yuefei_damaged_choice(game, target, source)

    if choice == "take":
        stolen = game.take_target_card(target, source, "获得")
        if stolen is None:
            game.view.emit(f"{source.name}没有可获得的牌。")
            return
        target.hand.append(stolen)
        game.view.emit(f"{target.name}触发武穆，获得了{source.name}的 {stolen}。")
        return

    game.draw_cards(target, 1)
    game.view.emit(f"{target.name}触发武穆，摸了1张牌。")
    if not game.target_has_card(source):
        game.view.emit(f"{source.name}没有可弃置的牌。")
        return
    removed = game.remove_target_card(target, source)
    if removed is None:
        return
    game.deck.discard(removed)
    game.view.emit(f"{target.name}弃置了{source.name}的 {removed}。")


def _on_turn_start_qinshihuang(game: Game, actor: Player, target: Player) -> int:
    return 2


def _on_turn_end_qinshihuang(game: Game, actor: Player, target: Player) -> None:
    if not actor.hand:
        return
    game.discard_from_hand(actor, 1, reason="集权")


def _player_lijian_choice(game: Game, actor: Player, target: Player) -> LijianChoice:
    while True:
        game.view.emit(f"\n{actor.name}触发离间，{target.name}手牌更多，请选择：")
        game.view.emit("1. 额外摸1张牌")
        game.view.emit(f"2. 弃置{target.name}1张牌")
        choice = game.view.ask_line(
            "输入选项：",
            kind="choice",
            options=["额外摸1张牌", f"弃置{target.name}1张牌"],
            player_id=game.seat_of(actor),
        )
        if choice == "1":
            return "draw"
        if choice == "2":
            return "discard"
        game.view.emit("请输入 1 或 2。")


def _ai_lijian_choice(game: Game, actor: Player, target: Player) -> LijianChoice:
    if game.target_has_visible_equipment(target):
        return "discard"
    if len(actor.hand) <= 2:
        return "draw"
    if game.target_has_card(target):
        return "discard"
    return "draw"


def _on_turn_start_jiangwei(game: Game, actor: Player, target: Player) -> int:
    return 2 if not actor.hand else 0


def _on_turn_start_diaochan(game: Game, actor: Player, target: Player) -> int:
    if len(target.hand) <= len(actor.hand):
        return 0

    if actor.is_ai:
        choice = _ai_lijian_choice(game, actor, target)
    else:
        choice = _player_lijian_choice(game, actor, target)

    if choice == "draw":
        game.draw_cards(actor, 1)
        game.view.emit(f"{actor.name}发动离间，额外摸了1张牌。")
        return 0

    if not game.target_has_card(target):
        game.draw_cards(actor, 1)
        game.view.emit(f"{target.name}没有可弃置的牌，{actor.name}改为额外摸了1张牌。")
        return 0

    removed = game.remove_target_card(actor, target)
    if removed is None:
        return 0
    game.deck.discard(removed)
    game.view.emit(f"{actor.name}发动离间，弃置了{target.name}的 {removed}。")
    return 0


def _on_turn_start_chengyaojin(game: Game, actor: Player, target: Player) -> int:
    return max(0, actor.hero.max_hp - actor.hp)


def _on_dodge_huamulan(game: Game, player: Player) -> None:
    game.draw_cards(player, 1)
    game.view.emit(f"{player.name}触发易装，摸1张牌。")


def _on_sha_dodged_huamulan(game: Game, actor: Player, target: Player) -> None:
    drawn = game.deck.draw(1)
    if not drawn:
        game.view.emit(f"{actor.name}易装判定：牌库为空，判定跳过。")
        return
    card = drawn[0]
    game.deck.discard(card)
    color_text = "红色" if game.is_red_card(card) else "黑色"
    game.view.emit(f"{actor.name}易装判定：{card}（{color_text}）。")
    if not game.is_red_card(card):
        game.view.emit("判定为非红色，未获得对手牌。")
        return
    stolen = game.take_target_card(actor, target, "获得")
    if stolen is None:
        game.view.emit(f"{target.name}没有可获得的牌。")
        return
    actor.hand.append(stolen)
    game.view.emit(f"{actor.name}易装判定成功，获得了{target.name}的 {stolen}。")


def _sha_bonus_xiangyu(game: Game, actor: Player, target: Player) -> int:
    return actor.bawang_stacks


def _jingke_sha_unavoidable(game: Game, actor: Player, target: Player) -> bool:
    return target.hp > len(actor.hand)


def _jingke_shans_required(game: Game, actor: Player, target: Player) -> int:
    return 2 if len(target.hand) > actor.hp else 1


def _tao_bonus_bianque(game: Game, actor: Player) -> int:
    return 1


def _find_tao_indexes(player: Player) -> list[int]:
    return [index for index, card in enumerate(player.hand) if card.type == CardType.TAO]


def _on_opponent_dying_zhensha(game: Game, bianque: Player, dying: Player) -> bool:
    tao_indexes = _find_tao_indexes(bianque)
    if not tao_indexes:
        return False

    if bianque.is_ai:
        use_lethal = True
    else:
        use_lethal = game.view.ask_confirm(
            f"扁鹊鸩杀：是否对{dying.name}使用一张桃令其直接阵亡？(y/n)：",
            player_id=game.seat_of(bianque),
        )
    if not use_lethal:
        return False

    if bianque.is_ai or len(tao_indexes) == 1:
        tao_index = tao_indexes[0]
    else:
        game.view.emit(f"\n{bianque.name}选择用于鸩杀的桃：")
        for option_no, index in enumerate(tao_indexes, start=1):
            game.view.emit(f"{option_no}. {bianque.hand[index]}")
        choice = game.view.ask_line(
            "输入桃的编号：",
            kind="choice",
            options=[str(bianque.hand[index]) for index in tao_indexes],
            player_id=game.seat_of(bianque),
        )
        if not choice.isdigit() or not (1 <= int(choice) <= len(tao_indexes)):
            game.view.emit("无效输入，放弃鸩杀。")
            return False
        tao_index = tao_indexes[int(choice) - 1]

    card = bianque.hand.pop(tao_index)
    game.deck.discard(card)
    game.view.emit(f"{bianque.name}发动鸩杀，对{dying.name}使用 {card}，{dying.name}直接阵亡。")
    return True


HERO_SKILL_HOOKS.update(
    {
        "秦始皇": SkillHooks(
            on_turn_start=(_on_turn_start_qinshihuang,),
            on_turn_end=(_on_turn_end_qinshihuang,),
        ),
        "项羽": SkillHooks(sha_damage_bonus=(_sha_bonus_xiangyu,), ai_prefer_wine_before_sha=True),
        "虞姬": SkillHooks(on_damaged=(_on_damaged_sheshen,)),
        "武则天": SkillHooks(red_hand_as_tao=True),
        "杨延昭": SkillHooks(max_sha_per_turn=3),
        "扁鹊": SkillHooks(
            tao_heal_bonus=(_tao_bonus_bianque,),
            on_opponent_dying=(_on_opponent_dying_zhensha,),
        ),
        "荆轲": SkillHooks(
            sha_unavoidable=(_jingke_sha_unavoidable,),
            shans_required_to_dodge=(_jingke_shans_required,),
            ai_prefer_wine_before_sha=True,
        ),
        "韩信": SkillHooks(immune_to_sha_without_hand=True),
        "程咬金": SkillHooks(on_turn_start=(_on_turn_start_chengyaojin,)),
        "花木兰": SkillHooks(
            on_dodge=(_on_dodge_huamulan,),
            on_sha_dodged=(_on_sha_dodged_huamulan,),
        ),
        "貂蝉": SkillHooks(on_turn_start=(_on_turn_start_diaochan,)),
        "岳飞": SkillHooks(
            on_damaged=(_on_damaged_yuefei,),
            response_sha_shan_swap=True,
        ),
        "姜维": SkillHooks(on_turn_start=(_on_turn_start_jiangwei,)),
        "时迁": SkillHooks(shunshou_no_distance_limit=True, immune_to_shunshou=True),
    }
)
