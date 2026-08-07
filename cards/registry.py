from __future__ import annotations

from typing import Callable, Optional

from models.card import Card
from models.player import Player

ScrollHandler = Callable[["Game", Player, Player, Card], None]
ScrollCanPlayHandler = Callable[["Game", Player, Player], bool]

SCROLL_REGISTRY: dict[str, ScrollHandler] = {}
SCROLL_PLAY_CHECKS: dict[str, ScrollCanPlayHandler] = {}
