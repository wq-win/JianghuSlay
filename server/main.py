import asyncio
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from heroes import HEROES
from server.match import manager, pump_view_to_websocket

app = FastAPI(title="Jianghu Slay")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateAIMatchRequest(BaseModel):
    nickname: str = "玩家"
    hero: str = Field(..., description="英雄名")
    mode: str = Field("ai", description="ai=1v1人机，ai2=1人vs2人机")


class CreateRoomRequest(BaseModel):
    nickname: str = "房主"


class JoinRoomRequest(BaseModel):
    code: str
    nickname: str = "挑战者"


class LobbyAction(BaseModel):
    hero: Optional[str] = None
    ready: Optional[bool] = None


@app.get("/health")
def health() -> Dict[str, bool]:
    return {"ok": True}


@app.get("/api/heroes")
def list_heroes() -> List[Dict[str, Any]]:
    return [
        {
            "name": hero.name,
            "max_hp": hero.max_hp,
            "skill_name": hero.skill_name,
            "skill_desc": hero.skill_desc,
        }
        for hero in HEROES
    ]


@app.post("/api/matches/ai")
def create_ai_match(body: CreateAIMatchRequest) -> Dict[str, Any]:
    mode = body.mode if body.mode in {"ai", "ai2"} else "ai"
    session, seat = manager.create_ai_match(body.nickname, mode=mode)
    try:
        manager.start_ai_game(session, body.hero)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return {
        "match_id": session.match_id,
        "token": seat.token,
        "seat": seat.seat,
        "mode": mode,
    }


@app.post("/api/rooms")
def create_room(body: CreateRoomRequest) -> Dict[str, Any]:
    session, seat = manager.create_pvp_room(body.nickname)
    return {
        "match_id": session.match_id,
        "token": seat.token,
        "seat": seat.seat,
        "code": session.code,
        "mode": "pvp",
        "match": session.public_info(),
    }


@app.post("/api/rooms/join")
def join_room(body: JoinRoomRequest) -> Dict[str, Any]:
    try:
        session, seat = manager.join_pvp_room(body.code, body.nickname)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc
    return {
        "match_id": session.match_id,
        "token": seat.token,
        "seat": seat.seat,
        "code": session.code,
        "mode": "pvp",
        "match": session.public_info(),
    }


@app.post("/api/matches/{match_id}/lobby")
def update_lobby(match_id: str, body: LobbyAction, token: str) -> Dict[str, Any]:
    try:
        session, seat = manager.find_by_token(match_id, token)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc
    if body.hero:
        session.hero_picks[seat.seat] = body.hero
    if body.ready is not None:
        session.ready[seat.seat] = body.ready
    started = manager.try_start_pvp(session)
    return {"match": session.public_info(), "started": started}


@app.get("/api/matches/{match_id}")
def get_match(match_id: str, token: str) -> Dict[str, Any]:
    try:
        session, seat = manager.find_by_token(match_id, token)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc
    return {"match": session.public_info(), "seat": seat.seat}


@app.websocket("/ws/{match_id}")
async def match_ws(websocket: WebSocket, match_id: str, token: str) -> None:
    await websocket.accept()
    try:
        session, seat = manager.find_by_token(match_id, token)
    except KeyError:
        await websocket.send_json({"type": "error", "message": "无效对局或令牌"})
        await websocket.close()
        return

    seat.websocket = websocket
    await websocket.send_json({"type": "hello", "seat": seat.seat, "match": session.public_info()})
    if seat.view.pending is not None:
        await websocket.send_json({"type": "prompt", "prompt": seat.view.pending.to_dict()})

    pump_task = asyncio.create_task(pump_view_to_websocket(session, seat))

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            if msg_type == "respond":
                prompt_id = data.get("prompt_id") or ""
                value = data.get("value", "")
                pending = seat.view.pending
                if (
                    session.mode == "pvp"
                    and pending is not None
                    and pending.player_id not in {seat.seat, "player"}
                    and pending.player_id != seat.seat
                ):
                    await websocket.send_json({"type": "error", "message": "未轮到你操作"})
                    continue
                ok = seat.view.submit_response(prompt_id, value)
                if not ok:
                    await websocket.send_json({"type": "error", "message": "没有等待中的提示"})
            elif msg_type == "lobby":
                if data.get("hero"):
                    session.hero_picks[seat.seat] = data["hero"]
                if "ready" in data:
                    session.ready[seat.seat] = bool(data["ready"])
                started = manager.try_start_pvp(session)
                for other in session.seats.values():
                    other.view.emit(
                        "大厅更新",
                        event_type="lobby",
                        match=session.public_info(),
                        started=started,
                    )
                await websocket.send_json({"type": "lobby", "match": session.public_info(), "started": started})
            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        pass
    finally:
        pump_task.cancel()
        seat.websocket = None


web_public = Path(__file__).resolve().parent.parent / "web" / "server-public"
if web_public.exists():
    app.mount("/static", StaticFiles(directory=str(web_public)), name="static")

    @app.get("/")
    def index() -> FileResponse:
        return FileResponse(str(web_public / "index.html"))
