import { useEffect, useState } from "react";
import { PlayerPanel } from "./components/PlayerPanel";
import { PromptOverlay } from "./components/PromptOverlay";
import type { HeroInfo, SessionInfo } from "./types";
import { useMatchSocket } from "./useMatchSocket";

type Screen = "home" | "table";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [heroes, setHeroes] = useState<HeroInfo[]>([]);
  const [nickname, setNickname] = useState("少侠");
  const [hero, setHero] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState("");
  const { state, prompt, logs, connected, lobby, flash, respond, sendLobby } = useMatchSocket(session);

  useEffect(() => {
    fetch("/api/heroes")
      .then((r) => r.json())
      .then((data: HeroInfo[]) => {
        setHeroes(data);
        if (data[0]) setHero(data[0].name);
      })
      .catch(() => setError("无法加载英雄列表，请确认后端已启动"));
  }, []);

  // Persist session for reconnect
  useEffect(() => {
    const raw = localStorage.getItem("jh_session");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as SessionInfo;
        setSession(saved);
        setScreen("table");
      } catch {
        localStorage.removeItem("jh_session");
      }
    }
  }, []);

  useEffect(() => {
    if (session) localStorage.setItem("jh_session", JSON.stringify(session));
  }, [session]);

  async function startAi() {
    setError("");
    const res = await fetch("/api/matches/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, hero }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const data = await res.json();
    setSession({ match_id: data.match_id, token: data.token, seat: data.seat, mode: "ai" });
    setScreen("table");
  }

  async function createRoom() {
    setError("");
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });
    const data = await res.json();
    setSession({
      match_id: data.match_id,
      token: data.token,
      seat: data.seat,
      mode: "pvp",
      code: data.code,
    });
    setScreen("table");
  }

  async function joinRoom() {
    setError("");
    const res = await fetch("/api/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, code: roomCode.trim() }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const data = await res.json();
    setSession({
      match_id: data.match_id,
      token: data.token,
      seat: data.seat,
      mode: "pvp",
      code: data.code,
    });
    setScreen("table");
  }

  function leave() {
    localStorage.removeItem("jh_session");
    setSession(null);
    setScreen("home");
  }

  if (screen === "home") {
    return (
      <div className="home">
        <div className="home-veil" />
        <header className="brand">
          <h1>江湖 Slay</h1>
          <p>刀光剑影，英雄入彀</p>
        </header>
        <section className="home-panel">
          <label>
            昵称
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </label>
          <label>
            英雄
            <select value={hero} onChange={(e) => setHero(e.target.value)}>
              {heroes.map((h) => (
                <option key={h.name} value={h.name}>
                  {h.name}（{h.max_hp}血 · {h.skill_name}）
                </option>
              ))}
            </select>
          </label>
          {hero ? (
            <p className="hero-desc">{heroes.find((h) => h.name === hero)?.skill_desc}</p>
          ) : null}
          <div className="home-actions">
            <button type="button" className="btn primary" onClick={startAi}>
              人机对战
            </button>
            <button type="button" className="btn" onClick={createRoom}>
              创建房间
            </button>
          </div>
          <div className="join-row">
            <input
              placeholder="房间码"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            />
            <button type="button" className="btn" onClick={joinRoom}>
              加入房间
            </button>
          </div>
          {error ? <p className="error">{error}</p> : null}
        </section>
      </div>
    );
  }

  const inLobby = session?.mode === "pvp" && (!state || (lobby && (lobby as { status?: string }).status === "lobby"));

  return (
    <div className={`table-screen ${flash === "damage" ? "damage-flash" : ""}`}>
      <header className="table-top">
        <div>
          <strong>江湖 Slay</strong>
          <span className={`dot ${connected ? "on" : "off"}`} />
          {session?.mode === "pvp" && session.code ? <span className="room-code">房间 {session.code}</span> : null}
          {state ? <span className="round">第 {state.round} 轮</span> : null}
        </div>
        <button type="button" className="btn ghost" onClick={leave}>
          离开
        </button>
      </header>

      {inLobby ? (
        <div className="lobby">
          <h2>对战大厅</h2>
          <p>房间码：{session?.code}</p>
          <pre className="lobby-json">{JSON.stringify(lobby, null, 2)}</pre>
          <label>
            选择英雄
            <select
              value={hero}
              onChange={(e) => {
                setHero(e.target.value);
                sendLobby({ hero: e.target.value });
              }}
            >
              {heroes.map((h) => (
                <option key={h.name} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn primary"
            onClick={() => sendLobby({ hero, ready: true })}
          >
            准备开战
          </button>
        </div>
      ) : null}

      {state ? (
        <>
          <PlayerPanel player={state.players.opponent} side="opponent" damaged={flash === "damage"} />
          <div className="center-field">
            <div className="pile">牌库 {state.deck_count}</div>
            <div className="pile">弃牌 {state.discard_count}</div>
            {state.winner ? <div className="winner-banner">胜负已分</div> : null}
          </div>
          <PlayerPanel player={state.players.self} side="self" />
          <PromptOverlay state={state} prompt={prompt} onRespond={respond} />
        </>
      ) : !inLobby ? (
        <div className="waiting">连接对局中…</div>
      ) : null}

      <aside className="log-rail">
        {logs.map((item) => (
          <div key={item.id} className={`log-item ${item.type}`}>
            {item.message}
          </div>
        ))}
      </aside>
    </div>
  );
}
