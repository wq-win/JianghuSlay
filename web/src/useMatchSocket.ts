import { useCallback, useEffect, useRef, useState } from "react";
import type { MatchState, PendingPrompt, SessionInfo } from "./types";

type LogItem = { id: number; message: string; type: string };

export function useMatchSocket(session: SessionInfo | null) {
  const [state, setState] = useState<MatchState | null>(null);
  const [prompt, setPrompt] = useState<PendingPrompt | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [connected, setConnected] = useState(false);
  const [lobby, setLobby] = useState<Record<string, unknown> | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const logId = useRef(0);

  useEffect(() => {
    if (!session) return;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const ws = new WebSocket(`${proto}://${host}/ws/${session.match_id}?token=${session.token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.state) setState(data.state);
      if (data.match) setLobby(data.match);
      if (data.type === "event" && data.event) {
        const id = ++logId.current;
        setLogs((prev) => [{ id, message: data.event.message, type: data.event.type }, ...prev].slice(0, 80));
        if (data.event.type === "game_over") {
          setFlash(data.event.message);
        }
        if (/伤害|受伤/.test(data.event.message)) {
          setFlash("damage");
          setTimeout(() => setFlash(null), 450);
        }
      }
      if (data.type === "prompt") {
        setPrompt(data.prompt);
      }
      if (data.type === "closed") {
        setPrompt(null);
        setConnected(false);
      }
      if (data.type === "lobby") {
        setLobby(data.match);
        setPrompt(null);
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [session?.match_id, session?.token]);

  const respond = useCallback((value: string, promptId?: string) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(
      JSON.stringify({
        type: "respond",
        prompt_id: promptId || prompt?.prompt_id,
        value,
      })
    );
    setPrompt(null);
  }, [prompt]);

  const sendLobby = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "lobby", ...payload }));
  }, []);

  return { state, prompt, logs, connected, lobby, flash, respond, sendLobby };
}
