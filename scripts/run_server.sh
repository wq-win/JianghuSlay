#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PYTHONPATH="$ROOT"
exec .venv/bin/uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
