#!/usr/bin/env bash
# 兼容旧用法：等同于 ./scripts/start.sh host
# 推荐改用: ./scripts/start.sh ai  或  ./scripts/start.sh host
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec "$ROOT/scripts/start.sh" host
