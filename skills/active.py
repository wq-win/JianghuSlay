from __future__ import annotations

from models.card import Card, CardColor, CardSuit, CardType
from models.player import Player
from skills.registry import (
    ACTIVE_SKILLS_BY_HERO,
    ActiveSkillDef,
    active_skill_by_hotkey,
    active_skills_for_hero,
)


def _player_yuren(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if "驭人" in actor.used_active_skills:
        game.view.emit("驭人本回合已使用。")
        return True
    indexes = game.parse_hand_indexes(args, actor)
    if not indexes:
        return False
    discarded = game.pop_hand_indexes(actor, indexes)
    game.deck.discard(discarded)
    game.draw_cards(actor, len(discarded))
    actor.used_active_skills.add("驭人")
    game.view.emit(f"{actor.name}发动驭人，弃置 {len(discarded)} 张手牌并摸 {len(discarded)} 张牌。")
    return True


def _ai_yuren(game: "Game", actor: Player, target: Player) -> bool:
    if "驭人" in actor.used_active_skills or len(actor.hand) < 4:
        return False
    discard_count = min(2, len(actor.hand))
    discarded = [actor.hand.pop() for _ in range(discard_count)]
    game.deck.discard(discarded)
    game.draw_cards(actor, discard_count)
    actor.used_active_skills.add("驭人")
    game.view.emit(f"AI 发动驭人，弃 {discard_count} 张牌并摸 {discard_count} 张牌。")
    return True


def _player_shiquan(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if len(args) != 1:
        return False
    indexes = game.parse_hand_indexes(args, actor)
    if not indexes:
        return False
    card = actor.hand[indexes[0]]
    if card.color != CardColor.BLACK:
        game.view.emit("释权需要选择一张黑色手牌。")
        return True
    cost = game.pop_hand_indexes(actor, indexes)[0]
    game.deck.discard(cost)
    game.view.emit(f"{actor.name}发动释权，将 {cost} 当作釜底抽薪使用。")
    fake_card = Card("釜底抽薪", CardType.SCROLL, description="弃置对手1张手牌或装备牌，无距离限制")
    game.resolve_scroll(actor, target, fake_card)
    game.try_shiquan_bonus_draw(actor)
    return True


def _ai_shiquan(game: "Game", actor: Player, target: Player) -> bool:
    if not game.target_has_card(target):
        return False
    black_index = None
    for index, card in enumerate(actor.hand):
        if card.color == CardColor.BLACK:
            black_index = index
            break
    if black_index is None:
        return False
    cost = actor.hand.pop(black_index)
    game.deck.discard(cost)
    game.view.emit("AI 发动释权，将一张黑色手牌当釜底抽薪使用。")
    game.resolve_scroll(actor, target, Card("釜底抽薪", CardType.SCROLL))
    game.try_shiquan_bonus_draw(actor)
    return True


def _player_wumu(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if len(args) != 1:
        return False
    indexes = game.parse_hand_indexes(args, actor)
    if not indexes:
        return False
    card = actor.hand[indexes[0]]
    if card.type != CardType.SHAN:
        game.view.emit("冲阵需要选择一张闪当杀使用。")
        return True
    if not game.can_use_sha(actor):
        game.view.emit("本回合不能再使用杀。")
        return True
    if not game.in_attack_range(actor, target):
        game.view.emit(f"距离不够。当前距离 {game.distance_between(actor, target)}，武器距离 {actor.weapon_range}。")
        return True
    used = game.pop_hand_indexes(actor, indexes)[0]
    game.deck.discard(used)
    game.view.emit(f"{actor.name}发动冲阵，将闪当杀使用。")
    game.use_sha(actor, target, "冲阵转化的杀")
    return True


def _ai_wumu(game: "Game", actor: Player, target: Player) -> bool:
    if not game.can_use_sha(actor) or not game.in_attack_range(actor, target):
        return False
    shan_index = game.find_card(actor, CardType.SHAN)
    if shan_index is None:
        return False
    used = actor.hand.pop(shan_index)
    game.deck.discard(used)
    game.view.emit("AI 发动冲阵，将闪当杀使用。")
    game.use_sha(actor, target, "冲阵转化的杀")
    return True


def _player_huanpai(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if "换牌" in actor.used_active_skills:
        game.view.emit("换牌本回合已使用。")
        return True
    if not args:
        return False

    if args[0].lower() in {"all", "0"}:
        if not actor.hand and not target.hand:
            game.view.emit("双方都没有手牌，无法交换。")
            return True
        game.swap_all_hands(actor, target)
        actor.used_active_skills.add("换牌")
        game.view.emit(f"{actor.name}发动换牌，与{target.name}交换了全部手牌。")
        return True

    actor_indexes = game.parse_hand_indexes(args, actor)
    if not actor_indexes:
        return False
    count = len(actor_indexes)
    if len(target.hand) < count:
        game.view.emit(f"{target.name}手牌不足 {count} 张，无法交换。")
        return True

    target_indexes = game.player_choose_hand_indexes(target, count)
    if target_indexes is None:
        return False

    game.swap_hand_cards(actor, target, actor_indexes, target_indexes)
    actor.used_active_skills.add("换牌")
    game.view.emit(f"{actor.name}发动换牌，与{target.name}交换了 {count} 张手牌。")
    return True


def _ai_huanpai(game: "Game", actor: Player, target: Player) -> bool:
    if "换牌" in actor.used_active_skills:
        return False
    if not actor.hand and not target.hand:
        return False

    if len(target.hand) > len(actor.hand) or len(actor.hand) >= 3:
        game.swap_all_hands(actor, target)
        actor.used_active_skills.add("换牌")
        game.view.emit(f"AI 发动换牌，与{target.name}交换了全部手牌。")
        return True

    if not actor.hand or not target.hand:
        return False

    count = min(len(actor.hand), len(target.hand))
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
    actor_indexes = sorted(
        range(len(actor.hand)),
        key=lambda index: priorities[actor.hand[index].type],
    )[:count]
    target_indexes = list(range(count))
    game.swap_hand_cards(actor, target, actor_indexes, target_indexes)
    actor.used_active_skills.add("换牌")
    game.view.emit(f"AI 发动换牌，与{target.name}交换了 {count} 张手牌。")
    return True


def _player_bawang(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if args:
        return False
    if actor.hp <= 0 or not actor.alive:
        return True
    # 失去 1 点体力（非伤害，无视防具）；可在 1 血时发动，随后进入濒死
    actor.hp -= 1
    actor.bawang_stacks += 1
    game.draw_cards(actor, 1)
    sha_damage = game.preview_sha_damage(actor, target) if actor.alive else 0
    game.view.emit(
        f"{actor.name}发动霸王，失去1点血（剩余 {max(actor.hp, 0)}），摸了1张牌。"
        + (f"当前杀伤害 {sha_damage}。" if actor.hp > 0 else "")
    )
    if actor.hp <= 0:
        game.check_dying(actor, source=actor)
    return True


def _ai_bawang(game: "Game", actor: Player, target: Player) -> bool:
    # AI 保留至少 2 血，避免无药自杀
    if actor.hp <= 2:
        return False
    actor.hp -= 1
    actor.bawang_stacks += 1
    game.draw_cards(actor, 1)
    sha_damage = game.preview_sha_damage(actor, target)
    game.view.emit(
        f"AI 发动霸王，失去1点血（剩余 {actor.hp}），摸了1张牌。"
        f"当前杀伤害 {sha_damage}。"
    )
    if actor.hp <= 0:
        game.check_dying(actor, source=actor)
    return True


def _player_nudi_mark(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if len(args) != 1:
        return False
    indexes = game.parse_hand_indexes(args, actor)
    if not indexes:
        return False
    card = actor.hand[indexes[0]]
    if card.color != CardColor.RED:
        game.view.emit("女帝需要选择一张红色手牌。")
        return True
    used = game.pop_hand_indexes(actor, indexes)[0]
    game.deck.discard(used)
    target.judgment_mark_pending = True
    game.view.emit(
        f"{actor.name}发动女帝，弃置 {used} 并对{target.name}施加标记"
        f"（下回合开始前判定，红色则受到1点伤害）。"
    )
    return True


def _ai_nudi_mark(game: "Game", actor: Player, target: Player) -> bool:
    if target.judgment_mark_pending:
        return False
    for index, card in enumerate(actor.hand):
        if card.color == CardColor.RED:
            used = actor.hand.pop(index)
            game.deck.discard(used)
            target.judgment_mark_pending = True
            game.view.emit(f"AI 发动女帝，对{target.name}施加标记（弃置 {used}）。")
            return True
    return False


def _player_bingxian(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if len(args) != 3:
        return False
    indexes = game.parse_hand_indexes(args, actor)
    if len(indexes) != 3:
        return False
    discarded = game.pop_hand_indexes(actor, indexes)
    game.deck.discard(discarded)
    game.view.emit(f"{actor.name}发动兵仙，弃置 {len(discarded)} 张牌。")
    game.apply_damage(
        target,
        1,
        source=actor,
        message="{name}受到 {damage} 点伤害，剩余血量 {hp}。",
    )
    return True


def _ai_bingxian(game: "Game", actor: Player, target: Player) -> bool:
    if len(actor.hand) < 3:
        return False
    discard_indexes = sorted(
        range(len(actor.hand)),
        key=lambda index: {
            CardType.SHAN: 5,
            CardType.TAO: 4,
            CardType.SHA: 3,
            CardType.WINE: 2,
            CardType.SCROLL: 2,
            CardType.WEAPON: 1,
            CardType.ARMOR: 1,
            CardType.OFFENSIVE_HORSE: 1,
            CardType.DEFENSIVE_HORSE: 1,
        }[actor.hand[index].type],
    )[:3]
    discarded = game.pop_hand_indexes(actor, discard_indexes)
    game.deck.discard(discarded)
    game.view.emit(f"AI 发动兵仙，弃置 {len(discarded)} 张牌。")
    game.apply_damage(
        target,
        1,
        source=actor,
        message="{name}受到 {damage} 点伤害，剩余血量 {hp}。",
    )
    return True


def _player_shixian(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if args:
        return False
    if actor.shixian_active:
        game.view.emit("诗仙本回合已发动。")
        return True
    actor.shixian_active = True
    actor.used_active_skills.add("诗仙")
    game.view.emit(f"{actor.name}发动诗仙，本回合手牌与装备均可当杀使用（装备：eq weapon/armor/进攻马/防御马）。")
    return True


def _ai_shixian(game: "Game", actor: Player, target: Player) -> bool:
    if actor.shixian_active:
        return False
    if not game.can_use_sha(actor) or not game.in_attack_range(actor, target):
        return False
    if not game.has_shixian_playable(actor, target):
        return False
    actor.shixian_active = True
    actor.used_active_skills.add("诗仙")
    game.view.emit("AI 发动诗仙，本回合手牌与装备均可当杀使用。")
    return True


def _player_feizei_shunshou(game: "Game", actor: Player, target: Player, args: list[str]) -> bool:
    if len(args) != 1:
        return False
    indexes = game.parse_hand_indexes(args, actor)
    if not indexes:
        return False
    card = actor.hand[indexes[0]]
    if card.suit != CardSuit.CLUB:
        game.view.emit("飞贼需要选择一张梅花手牌。")
        return True
    if not game.can_use_shunshou(actor, target):
        if game.is_immune_to_shunshou(target):
            game.view.emit(f"{target.name}免疫顺手牵羊。")
        else:
            game.view.emit(f"距离不够。当前距离 {game.distance_between(actor, target)}，顺手牵羊距离 1。")
        return True
    if not game.target_has_card(target):
        game.view.emit(f"{target.name}没有可获得的牌。")
        return True
    cost = game.pop_hand_indexes(actor, indexes)[0]
    game.deck.discard(cost)
    game.view.emit(f"{actor.name}发动飞贼，将 {cost} 当作顺手牵羊使用。")
    fake_card = Card("顺手牵羊", CardType.SCROLL, description="距离1，获得对手1张手牌或装备牌")
    game.resolve_scroll(actor, target, fake_card)
    return True


def _ai_feizei_shunshou(game: "Game", actor: Player, target: Player) -> bool:
    if not game.can_use_shunshou(actor, target) or not game.target_has_card(target):
        return False
    club_index = None
    for index, card in enumerate(actor.hand):
        if card.suit == CardSuit.CLUB:
            club_index = index
            break
    if club_index is None:
        return False
    cost = actor.hand.pop(club_index)
    game.deck.discard(cost)
    game.view.emit("AI 发动飞贼，将一张梅花手牌当顺手牵羊使用。")
    game.resolve_scroll(actor, target, Card("顺手牵羊", CardType.SCROLL))
    return True


ACTIVE_SKILLS_BY_HERO.update(
    {
        "李白": (
            ActiveSkillDef(
                skill_id="诗仙",
                hotkey="q",
                help_text="诗仙：发动后本回合手牌与装备均可当杀",
                player=_player_shixian,
                ai=_ai_shixian,
                arg_mode="none",
                button_label="诗仙",
            ),
        ),
        "武则天": (
            ActiveSkillDef(
                skill_id="女帝",
                hotkey="q",
                help_text="女帝：弃一张红色手牌，对对手施加标记",
                player=_player_nudi_mark,
                ai=_ai_nudi_mark,
                arg_mode="one_card",
                min_cards=1,
                max_cards=1,
                card_filter="red",
                button_label="女帝",
            ),
        ),
        "项羽": (
            ActiveSkillDef(
                skill_id="霸王",
                hotkey="q",
                help_text="霸王：失去1点血并摸1张牌，可叠加；1血也可发动，无桃则阵亡",
                player=_player_bawang,
                ai=_ai_bawang,
                arg_mode="none",
                button_label="霸王",
            ),
        ),
        "刘邦": (
            ActiveSkillDef(
                skill_id="驭人",
                hotkey="q",
                help_text="驭人：弃任意张手牌并摸等量牌，每回合一次",
                player=_player_yuren,
                ai=_ai_yuren,
                arg_mode="cards",
                min_cards=1,
                max_cards=0,
                card_filter="any",
                button_label="驭人",
            ),
        ),
        "赵匡胤": (
            ActiveSkillDef(
                skill_id="释权",
                hotkey="q",
                help_text="释权：将一张黑色手牌当釜底抽薪",
                player=_player_shiquan,
                ai=_ai_shiquan,
                arg_mode="one_card",
                min_cards=1,
                max_cards=1,
                card_filter="black",
                button_label="释权",
            ),
        ),
        "杨再兴": (
            ActiveSkillDef(
                skill_id="冲阵",
                hotkey="q",
                help_text="冲阵：将一张闪当杀使用",
                player=_player_wumu,
                ai=_ai_wumu,
                arg_mode="one_card",
                min_cards=1,
                max_cards=1,
                card_filter="shan",
                button_label="冲阵",
            ),
        ),
        "褒姒": (
            ActiveSkillDef(
                skill_id="换牌",
                hotkey="q",
                help_text="换牌：可一键换全部，或选若干张与对手等量交换",
                player=_player_huanpai,
                ai=_ai_huanpai,
                arg_mode="cards_or_all",
                min_cards=1,
                max_cards=0,
                card_filter="any",
                button_label="换牌",
            ),
        ),
        "韩信": (
            ActiveSkillDef(
                skill_id="兵仙",
                hotkey="q",
                help_text="兵仙：弃3张手牌，令对手失去1点血",
                player=_player_bingxian,
                ai=_ai_bingxian,
                arg_mode="exactly_n",
                min_cards=3,
                max_cards=3,
                card_filter="any",
                button_label="兵仙",
            ),
        ),
        "时迁": (
            ActiveSkillDef(
                skill_id="飞贼",
                hotkey="q",
                help_text="飞贼：将一张梅花手牌当顺手牵羊",
                player=_player_feizei_shunshou,
                ai=_ai_feizei_shunshou,
                arg_mode="one_card",
                min_cards=1,
                max_cards=1,
                card_filter="club",
                button_label="飞贼",
            ),
        ),
    }
)
