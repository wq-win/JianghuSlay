from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, Optional
from uuid import uuid4


class PromptKind(str, Enum):
    LINE = "line"
    CONFIRM = "confirm"
    CHOICE = "choice"
    HERO_SELECT = "hero_select"
    PLAY_CARD = "play_card"
    DISCARD = "discard"
    SELECT_HAND = "select_hand"
    SELECT_TARGET_CARD = "select_target_card"
    RESCUE = "rescue"


@dataclass
class PromptOption:
    id: str
    label: str


@dataclass
class PendingPrompt:
    kind: PromptKind
    message: str
    prompt_id: str = field(default_factory=lambda: str(uuid4()))
    options: list[PromptOption] = field(default_factory=list)
    min_count: int = 0
    max_count: int = 1
    player_id: str = "player"
    meta: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "prompt_id": self.prompt_id,
            "kind": self.kind.value,
            "message": self.message,
            "options": [asdict(option) for option in self.options],
            "min_count": self.min_count,
            "max_count": self.max_count,
            "player_id": self.player_id,
            "meta": self.meta,
        }


@dataclass
class GameEvent:
    type: str
    message: str
    payload: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {"type": self.type, "message": self.message, "payload": self.payload}


@dataclass
class Action:
    type: str
    prompt_id: Optional[str] = None
    value: Any = None
    player_id: str = "player"

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Action:
        return cls(
            type=str(data.get("type", "respond")),
            prompt_id=data.get("prompt_id"),
            value=data.get("value"),
            player_id=str(data.get("player_id", "player")),
        )
