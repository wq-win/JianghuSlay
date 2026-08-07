from __future__ import annotations

import random

from game import Game


def main() -> None:
    random.seed()
    Game().start()


if __name__ == "__main__":
    main()
