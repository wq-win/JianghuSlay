#!/usr/bin/env bash
# 江湖 Slay 启动脚本
#   ./scripts/start.sh        # 默认：本机 AI（仅本机可访问）
#   ./scripts/start.sh ai     # 同上
#   ./scripts/start.sh host   # 开房：局域网可连，可再配合 ngrok 给外网好友
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
MODE="${1:-ai}"

ensure_venv() {
  if [[ ! -x "$ROOT/.venv/bin/uvicorn" ]]; then
    echo "→ 首次运行：创建虚拟环境并安装依赖…"
    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt
  fi
}

lan_ip() {
  local ip=""
  if command -v ipconfig >/dev/null 2>&1; then
    ip="$(ipconfig getifaddr en0 2>/dev/null || true)"
    [[ -z "$ip" ]] && ip="$(ipconfig getifaddr en1 2>/dev/null || true)"
  fi
  if [[ -z "$ip" ]] && command -v hostname >/dev/null 2>&1; then
    ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
  fi
  echo "${ip:-<你的局域网IP>}"
}

ensure_venv
export PYTHONPATH="$ROOT"

case "$MODE" in
  ai|local)
    echo ""
    echo "========================================"
    echo "  江湖 Slay · 本机人机对战"
    echo "========================================"
    echo "  浏览器打开: http://127.0.0.1:8000"
    echo "  选「人机对战」即可，无需联网。"
    echo "  按 Ctrl+C 结束。"
    echo "========================================"
    echo ""
    exec .venv/bin/uvicorn server.main:app --host 127.0.0.1 --port 8000
    ;;
  host|room|pvp)
    IP="$(lan_ip)"
    echo ""
    echo "========================================"
    echo "  江湖 Slay · 开房（本机当服务器）"
    echo "========================================"
    echo "  你自己打开:     http://127.0.0.1:8000"
    echo "  同一 Wi‑Fi 好友: http://${IP}:8000"
    echo ""
    echo "  流程："
    echo "    1. 你点「创建房间」，把房间码发给对方"
    echo "    2. 对方用上面的地址打开页面（不要另开本机服务）"
    echo "    3. 对方输入房间码「加入房间」→ 双方选英雄 → 准备开战"
    echo ""
    echo "  不在同一网络时，另开终端暴露端口，例如："
    echo "    ngrok http 8000"
    echo "  把 ngrok 给出的 https 链接发给对方即可。"
    echo "  按 Ctrl+C 结束（结束后房间失效）。"
    echo "========================================"
    echo ""
    exec .venv/bin/uvicorn server.main:app --host 0.0.0.0 --port 8000
    ;;
  *)
    echo "用法: $0 [ai|host]"
    echo "  ai   本机人机对战（默认）"
    echo "  host 开房给好友连（局域网 / 可配合 ngrok）"
    exit 1
    ;;
esac
