from __future__ import annotations

from engine.view import ConsoleView

_default_view = ConsoleView()


def read_line(prompt: str) -> str:
    return _default_view.ask_line(prompt)


def confirm(prompt: str) -> bool:
    return _default_view.ask_confirm(prompt)


def choose_index(prompt: str, count: int) -> int | None:
    while True:
        choice = read_line(prompt)
        if choice.isdigit() and 1 <= int(choice) <= count:
            return int(choice) - 1
        _default_view.emit("请输入有效编号。")
