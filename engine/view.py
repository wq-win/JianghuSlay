from __future__ import annotations

import queue
import threading
from typing import Any, Optional, Protocol, runtime_checkable

from engine.protocol import GameEvent, PendingPrompt, PromptKind, PromptOption


@runtime_checkable
class GameView(Protocol):
    def emit(self, message: str, *, event_type: str = "log", **payload: Any) -> None: ...

    def ask_line(
        self,
        prompt: str,
        *,
        kind: PromptKind | str = PromptKind.LINE,
        options: list[PromptOption] | list[str] | None = None,
        player_id: str = "player",
        min_count: int = 0,
        max_count: int = 1,
        meta: dict[str, Any] | None = None,
    ) -> str: ...

    def ask_confirm(self, prompt: str, *, player_id: str = "player", meta: dict[str, Any] | None = None) -> bool: ...


def _normalize_options(options: list[PromptOption] | list[str] | None) -> list[PromptOption]:
    if not options:
        return []
    normalized: list[PromptOption] = []
    for index, option in enumerate(options):
        if isinstance(option, PromptOption):
            normalized.append(option)
        else:
            normalized.append(PromptOption(id=str(index + 1), label=str(option)))
    return normalized


def _normalize_kind(kind: PromptKind | str) -> PromptKind:
    if isinstance(kind, PromptKind):
        return kind
    return PromptKind(kind)


class ConsoleView:
    """Terminal adapter: blocking stdin/stdout."""

    def emit(self, message: str, *, event_type: str = "log", **payload: Any) -> None:
        print(message)

    def ask_line(
        self,
        prompt: str,
        *,
        kind: PromptKind | str = PromptKind.LINE,
        options: list[PromptOption] | list[str] | None = None,
        player_id: str = "player",
        min_count: int = 0,
        max_count: int = 1,
        meta: dict[str, Any] | None = None,
    ) -> str:
        return input(prompt).strip()

    def ask_confirm(self, prompt: str, *, player_id: str = "player", meta: dict[str, Any] | None = None) -> bool:
        while True:
            answer = self.ask_line(prompt, kind=PromptKind.CONFIRM, player_id=player_id, meta=meta).lower()
            if answer in {"y", "yes", "是"}:
                return True
            if answer in {"n", "no", "否"}:
                return False
            self.emit("请输入 y 或 n。")


class BridgeView:
    """
    Thread-bridge view for web clients.

    Game logic calls ask_* and blocks; the session loop drains outbound messages
    and feeds responses via submit_response / submit_confirm.
    """

    def __init__(self) -> None:
        self.outbound: queue.Queue[dict[str, Any]] = queue.Queue()
        self._responses: dict[str, queue.Queue[Any]] = {}
        self._lock = threading.Lock()
        self.pending: Optional[PendingPrompt] = None
        self.closed = False
        self.events: list[GameEvent] = []

    def emit(self, message: str, *, event_type: str = "log", **payload: Any) -> None:
        event = GameEvent(type=event_type, message=message, payload=payload)
        self.events.append(event)
        self.outbound.put({"type": "event", "event": event.to_dict()})

    def ask_line(
        self,
        prompt: str,
        *,
        kind: PromptKind | str = PromptKind.LINE,
        options: list[PromptOption] | list[str] | None = None,
        player_id: str = "player",
        min_count: int = 0,
        max_count: int = 1,
        meta: dict[str, Any] | None = None,
    ) -> str:
        pending = PendingPrompt(
            kind=_normalize_kind(kind),
            message=prompt,
            options=_normalize_options(options),
            min_count=min_count,
            max_count=max_count,
            player_id=player_id,
            meta=meta or {},
        )
        response_q: queue.Queue[Any] = queue.Queue(maxsize=1)
        with self._lock:
            if self.closed:
                return ""
            self.pending = pending
            self._responses[pending.prompt_id] = response_q
        self.outbound.put({"type": "prompt", "prompt": pending.to_dict()})
        value = response_q.get()
        with self._lock:
            self.pending = None
            self._responses.pop(pending.prompt_id, None)
        return "" if value is None else str(value).strip()

    def ask_confirm(self, prompt: str, *, player_id: str = "player", meta: dict[str, Any] | None = None) -> bool:
        while True:
            answer = self.ask_line(
                prompt,
                kind=PromptKind.CONFIRM,
                options=[PromptOption("y", "是"), PromptOption("n", "否")],
                player_id=player_id,
                meta=meta,
            ).lower()
            if answer in {"y", "yes", "是", "true", "1"}:
                return True
            if answer in {"n", "no", "否", "false", "0"}:
                return False
            self.emit("请输入 y 或 n。")

    def submit_response(self, prompt_id: str, value: Any) -> bool:
        with self._lock:
            response_q = self._responses.get(prompt_id)
            if response_q is None and self.pending is not None:
                # Allow omitting prompt_id when only one prompt is pending.
                response_q = self._responses.get(self.pending.prompt_id)
                prompt_id = self.pending.prompt_id
        if response_q is None:
            return False
        try:
            response_q.put_nowait(value)
            return True
        except queue.Full:
            return False

    def close(self) -> None:
        with self._lock:
            self.closed = True
            pending_ids = list(self._responses.keys())
        for prompt_id in pending_ids:
            self.submit_response(prompt_id, "")
        self.outbound.put({"type": "closed"})


class MultiplexView:
    """Route prompts to per-seat BridgeViews; broadcast emits to all."""

    def __init__(self, seats: dict[str, BridgeView], default_seat: str = "player") -> None:
        self.seats = seats
        self.default_seat = default_seat
        self._emit_all = list(seats.values())

    def emit(self, message: str, *, event_type: str = "log", **payload: Any) -> None:
        for view in self._emit_all:
            view.emit(message, event_type=event_type, **payload)

    def ask_line(
        self,
        prompt: str,
        *,
        kind: PromptKind | str = PromptKind.LINE,
        options: list[PromptOption] | list[str] | None = None,
        player_id: str = "player",
        min_count: int = 0,
        max_count: int = 1,
        meta: dict[str, Any] | None = None,
    ) -> str:
        view = self.seats.get(player_id) or self.seats[self.default_seat]
        return view.ask_line(
            prompt,
            kind=kind,
            options=options,
            player_id=player_id,
            min_count=min_count,
            max_count=max_count,
            meta=meta,
        )

    def ask_confirm(self, prompt: str, *, player_id: str = "player", meta: dict[str, Any] | None = None) -> bool:
        view = self.seats.get(player_id) or self.seats[self.default_seat]
        return view.ask_confirm(prompt, player_id=player_id, meta=meta)
