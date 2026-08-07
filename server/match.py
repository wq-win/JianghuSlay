from __future__ import annotations

import asyncio
import queue
import secrets
import threading
from dataclasses import dataclass, field
from typing import Any, Optional
from uuid import uuid4

from engine.state import serialize_match_state
from engine.view import BridgeView, MultiplexView
from game import Game
from heroes import HEROES
from models.hero import Hero


def find_hero(name: str) -> Optional[Hero]:
    for hero in HEROES:
        if hero.name == name:
            return hero
    return None


@dataclass
class SeatConnection:
    token: str
    seat: str
    nickname: str
    view: BridgeView = field(default_factory=BridgeView)
    websocket: Any = None


@dataclass
class MatchSession:
    match_id: str
    mode: str  # "ai" | "pvp"
    seats: dict[str, SeatConnection] = field(default_factory=dict)
    game: Optional[Game] = None
    thread: Optional[threading.Thread] = None
    status: str = "lobby"  # lobby | playing | finished
    code: str = ""
    lock: threading.Lock = field(default_factory=threading.Lock)
    hero_picks: dict[str, str] = field(default_factory=dict)
    ready: dict[str, bool] = field(default_factory=dict)

    def public_info(self) -> dict[str, Any]:
        return {
            "match_id": self.match_id,
            "mode": self.mode,
            "status": self.status,
            "code": self.code,
            "seats": {
                seat: {"nickname": conn.nickname, "ready": self.ready.get(seat, False), "hero": self.hero_picks.get(seat)}
                for seat, conn in self.seats.items()
            },
        }


class MatchManager:
    def __init__(self) -> None:
        self.matches: dict[str, MatchSession] = {}
        self.codes: dict[str, str] = {}
        self._lock = threading.Lock()

    def create_ai_match(
        self,
        nickname: str = "玩家",
        *,
        mode: str = "ai",
    ) -> tuple[MatchSession, SeatConnection]:
        if mode not in {"ai", "ai2"}:
            mode = "ai"
        match_id = str(uuid4())
        token = secrets.token_urlsafe(16)
        seat = SeatConnection(token=token, seat="player", nickname=nickname)
        session = MatchSession(match_id=match_id, mode=mode, seats={"player": seat}, status="playing")
        with self._lock:
            self.matches[match_id] = session
        return session, seat

    def create_pvp_room(self, nickname: str = "房主") -> tuple[MatchSession, SeatConnection]:
        match_id = str(uuid4())
        code = secrets.token_hex(3).upper()
        token = secrets.token_urlsafe(16)
        seat = SeatConnection(token=token, seat="p1", nickname=nickname)
        session = MatchSession(
            match_id=match_id,
            mode="pvp",
            seats={"p1": seat},
            status="lobby",
            code=code,
            ready={"p1": False},
        )
        with self._lock:
            self.matches[match_id] = session
            self.codes[code] = match_id
        return session, seat

    def join_pvp_room(self, code: str, nickname: str = "挑战者") -> tuple[MatchSession, SeatConnection]:
        with self._lock:
            match_id = self.codes.get(code.upper())
            if not match_id:
                raise KeyError("房间不存在")
            session = self.matches[match_id]
            if "p2" in session.seats:
                raise KeyError("房间已满")
            token = secrets.token_urlsafe(16)
            seat = SeatConnection(token=token, seat="p2", nickname=nickname)
            session.seats["p2"] = seat
            session.ready["p2"] = False
            return session, seat

    def get(self, match_id: str) -> MatchSession:
        return self.matches[match_id]

    def find_by_token(self, match_id: str, token: str) -> tuple[MatchSession, SeatConnection]:
        session = self.matches[match_id]
        for seat in session.seats.values():
            if seat.token == token:
                return session, seat
        raise KeyError("无效令牌")

    def start_ai_game(self, session: MatchSession, hero_name: str) -> None:
        hero = find_hero(hero_name)
        if hero is None:
            raise ValueError("未知英雄")
        view = session.seats["player"].view
        game = Game(view=view)
        session.game = game
        session.status = "playing"
        vs_two = session.mode == "ai2"
        nick = session.seats["player"].nickname

        def runner() -> None:
            try:
                if vs_two:
                    game.start(
                        player_hero=hero,
                        player_name=nick,
                        ai_name="AI甲",
                        ai2_name="AI乙",
                        mode="1v2",
                    )
                else:
                    game.start(player_hero=hero, player_name=nick)
            finally:
                session.status = "finished"
                view.emit("对局结束", event_type="game_over", winner=game.winner)
                view.close()

        session.thread = threading.Thread(target=runner, daemon=True)
        session.thread.start()

    def try_start_pvp(self, session: MatchSession) -> bool:
        if session.mode != "pvp":
            return False
        if set(session.seats) != {"p1", "p2"}:
            return False
        if not all(session.ready.get(seat) for seat in ("p1", "p2")):
            return False
        if not all(seat in session.hero_picks for seat in ("p1", "p2")):
            return False
        if session.status == "playing":
            return False

        p1_hero = find_hero(session.hero_picks["p1"])
        p2_hero = find_hero(session.hero_picks["p2"])
        if p1_hero is None or p2_hero is None:
            return False

        multiplex = MultiplexView(
            {
                "p1": session.seats["p1"].view,
                "p2": session.seats["p2"].view,
                "player": session.seats["p1"].view,
                "ai": session.seats["p2"].view,
            },
            default_seat="p1",
        )
        game = Game(view=multiplex)
        session.game = game
        session.status = "playing"

        def runner() -> None:
            try:
                game.start(
                    player_hero=p1_hero,
                    ai_hero=p2_hero,
                    player_name=session.seats["p1"].nickname,
                    ai_name=session.seats["p2"].nickname,
                    ai_is_ai=False,
                )
            finally:
                session.status = "finished"
                winner = game.winner
                mapped = {"player": "p1", "ai": "p2"}.get(winner or "", winner)
                for seat in session.seats.values():
                    seat.view.emit("对局结束", event_type="game_over", winner=mapped)
                    seat.view.close()

        session.thread = threading.Thread(target=runner, daemon=True)
        session.thread.start()
        return True


manager = MatchManager()


async def pump_view_to_websocket(session: MatchSession, seat: SeatConnection) -> None:
    """Forward BridgeView outbound messages and periodic state to the websocket."""
    view = seat.view
    ws = seat.websocket
    if ws is None:
        return

    loop = asyncio.get_event_loop()

    def poll() -> dict[str, Any] | None:
        try:
            return view.outbound.get(timeout=0.4)
        except queue.Empty:
            return None

    while True:
        if ws.client_state.name != "CONNECTED":
            break
        msg = await loop.run_in_executor(None, poll)

        if msg is not None:
            if msg.get("type") == "closed":
                state = None
                if session.game is not None and hasattr(session.game, "player"):
                    state = serialize_match_state(
                        session.game,
                        viewer_seat=seat.seat if seat.seat in {"p1", "p2"} else "player",
                        phase="finished",
                        winner=session.game.winner,
                    )
                await ws.send_json({"type": "closed", "state": state, "match": session.public_info()})
                break
            payload = dict(msg)
            if session.game is not None and hasattr(session.game, "player"):
                payload["state"] = serialize_match_state(
                    session.game,
                    viewer_seat=seat.seat if seat.seat in {"p1", "p2"} else "player",
                    phase=session.status,
                    winner=session.game.winner,
                )
            await ws.send_json(payload)
        else:
            if session.game is not None and hasattr(session.game, "player"):
                await ws.send_json(
                    {
                        "type": "state",
                        "state": serialize_match_state(
                            session.game,
                            viewer_seat=seat.seat if seat.seat in {"p1", "p2"} else "player",
                            phase=session.status,
                            winner=session.game.winner,
                        ),
                        "match": session.public_info(),
                    }
                )
            else:
                await ws.send_json({"type": "lobby", "match": session.public_info()})
