from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Hero:
    name: str
    max_hp: int
    skill_name: str
    skill_desc: str
