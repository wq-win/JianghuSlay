from __future__ import annotations

"""Scripted regression: hero select + end turn without crashing."""

from engine.view import BridgeView
from game import Game
from heroes import HEROES


def run() -> None:
    view = BridgeView()
    game = Game(view=view)

    def responder() -> None:
        import time

        # Answer hero select with first hero, then keep ending play / declining.
        while True:
            msg = view.outbound.get(timeout=5)
            if msg.get("type") == "prompt":
                prompt = msg["prompt"]
                kind = prompt["kind"]
                pid = prompt["prompt_id"]
                if kind == "hero_select":
                    view.submit_response(pid, "1")
                elif kind == "confirm":
                    view.submit_response(pid, "n")
                elif kind == "play_card":
                    view.submit_response(pid, "0")
                elif kind == "discard":
                    view.submit_response(pid, "1")
                elif kind == "rescue":
                    view.submit_response(pid, "0")
                elif kind == "choice":
                    view.submit_response(pid, "1")
                elif kind == "select_target_card":
                    view.submit_response(pid, "1")
                elif kind == "select_hand":
                    view.submit_response(pid, "1")
                else:
                    view.submit_response(pid, "0")
            elif msg.get("type") == "closed":
                break
            elif msg.get("type") == "event" and msg["event"].get("type") == "game_over":
                view.close()
                break

    import threading

    t = threading.Thread(target=responder, daemon=True)
    t.start()
    game.start(player_hero=HEROES[0], ai_hero=HEROES[1])
    assert game.winner in {"player", "ai"}
    print("regression ok, winner=", game.winner)


if __name__ == "__main__":
    run()
