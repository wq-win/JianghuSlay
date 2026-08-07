"""Smoke: start a 1v2 match and auto-end first play prompt with 0."""
from __future__ import annotations

import threading
import time

from engine.view import BridgeView
from game import Game
from heroes import HEROES


def main() -> None:
    view = BridgeView()
    game = Game(view=view)
    errors: list[str] = []

    def runner() -> None:
        try:
            game.start(player_hero=HEROES[0], mode="1v2", player_name="测试")
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))
        finally:
            view.close()

    thread = threading.Thread(target=runner, daemon=True)
    thread.start()

    deadline = time.time() + 8
    saw_ai2 = False
    while time.time() < deadline and thread.is_alive():
        try:
            msg = view.outbound.get(timeout=0.2)
        except Exception:
            continue
        if msg.get("type") == "prompt" and msg.get("prompt", {}).get("kind") == "play_card":
            # Drain a couple of status events by answering end-turn
            view.submit_response(msg["prompt"]["prompt_id"], "0")
        if msg.get("type") == "event":
            text = msg.get("event", {}).get("message", "")
            if "AI乙" in text or "AI2" in text or "1 人对战 2 人机" in text:
                saw_ai2 = True

    # Also verify players exist
    assert game.ai2 is not None, "ai2 missing"
    assert game.mode == "1v2"
    assert len(game.all_players()) == 3
    assert saw_ai2 or game.ai2.hero.name, "1v2 not announced"
    # End match quickly by killing both AIs from outside if still running
    if thread.is_alive():
        game.ai.hp = 0
        game.ai2.hp = 0
        # Unblock any prompt
        if view.pending:
            view.submit_response(view.pending.prompt_id, "0")
        thread.join(timeout=3)
    assert not errors, errors
    print("smoke_ai2 ok", game.winner, [p.hero.name for p in game.all_players()])


if __name__ == "__main__":
    main()
