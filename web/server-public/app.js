import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { html } from "htm/react";

const SUIT_SYMBOL = { 红桃: "♥", 方块: "♦", 黑桃: "♠", 梅花: "♣" };

/** 武将立绘主题（原创 UI，非官方素材） */
const HERO_THEME = {
  秦始皇: { hue: 38, title: "帝", accent: "#d4a017", motif: "crown" },
  项羽: { hue: 0, title: "霸", accent: "#c0392b", motif: "axe" },
  虞姬: { hue: 320, title: "舞", accent: "#e84393", motif: "fan" },
  李白: { hue: 200, title: "诗", accent: "#74b9ff", motif: "scroll" },
  武则天: { hue: 280, title: "凤", accent: "#a29bfe", motif: "phoenix" },
  刘邦: { hue: 25, title: "汉", accent: "#e17055", motif: "seal" },
  赵匡胤: { hue: 45, title: "宋", accent: "#fdcb6e", motif: "sword" },
  杨延昭: { hue: 210, title: "将", accent: "#0984e3", motif: "bow" },
  扁鹊: { hue: 150, title: "医", accent: "#00b894", motif: "herb" },
  荆轲: { hue: 0, title: "刺", accent: "#636e72", motif: "dagger" },
  韩信: { hue: 220, title: "帅", accent: "#2d3436", motif: "flag" },
  程咬金: { hue: 15, title: "斧", accent: "#d63031", motif: "axe" },
  花木兰: { hue: 340, title: "花", accent: "#fd79a8", motif: "bloom" },
  貂蝉: { hue: 300, title: "蝉", accent: "#e056fd", motif: "moon" },
  岳飞: { hue: 5, title: "忠", accent: "#b33939", motif: "spear" },
  杨再兴: { hue: 18, title: "勇", accent: "#e67e22", motif: "horse" },
  姜维: { hue: 195, title: "继", accent: "#00cec9", motif: "star" },
  褒姒: { hue: 350, title: "笑", accent: "#ff7675", motif: "fire" },
  时迁: { hue: 120, title: "贼", accent: "#55efc4", motif: "mask" },
};

function skillName(s) {
  if (!s) return "技能";
  if (s.label) return s.label;
  if (s.id) return s.id;
  if (s.help) {
    const head = String(s.help).split(/[：:]/)[0];
    if (head) return head;
  }
  return (s.hotkey || "Q").toUpperCase();
}

const SKILL_DEFAULTS = {
  诗仙: { arg_mode: "none" },
  霸王: { arg_mode: "none" },
  女帝: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "red" },
  驭人: { arg_mode: "cards", min_cards: 1, max_cards: 0, card_filter: "any" },
  释权: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "black" },
  冲阵: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "shan" },
  换牌: { arg_mode: "cards_or_all", min_cards: 1, max_cards: 0, card_filter: "any" },
  兵仙: { arg_mode: "exactly_n", min_cards: 3, max_cards: 3, card_filter: "any" },
  飞贼: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "club" },
};

function normalizeSkill(s) {
  const name = skillName(s);
  const defaults = SKILL_DEFAULTS[name] || { arg_mode: "none" };
  return {
    ...defaults,
    ...s,
    id: s.id || name,
    label: name,
    hotkey: s.hotkey || "q",
  };
}

function cardMatchesFilter(card, filter) {
  if (!filter || filter === "any") return true;
  if (filter === "red") return card.color === "红";
  if (filter === "black") return card.color === "黑";
  if (filter === "shan") return card.type === "闪" || card.name === "闪";
  if (filter === "club") return card.suit === "梅花";
  return true;
}

function HpPeaches({ hp, maxHp }) {
  const nodes = [];
  for (let i = 0; i < maxHp; i++) {
    nodes.push(html`<span key=${i} className=${`peach ${i < hp ? "full" : "empty"}`}></span>`);
  }
  return html`<div className="hp-peaches" title=${`体力 ${hp}/${maxHp}`}>${nodes}</div>`;
}

function HeroPortraitArt({ name }) {
  const theme = HERO_THEME[name] || { hue: 30, title: name.slice(0, 1), accent: "#c9a227", motif: "seal" };
  const bg = `hsl(${theme.hue} 35% 18%)`;
  const mid = `hsl(${theme.hue} 40% 28%)`;
  const src = `/static/portraits/${encodeURIComponent(name)}.jpg`;
  const [broken, setBroken] = useState(false);

  if (!broken) {
    return html`<div className="portrait-art has-photo" style=${{ background: `linear-gradient(165deg, ${mid}, ${bg})` }}>
      <img
        className="portrait-photo"
        src=${src}
        alt=${name}
        onError=${() => setBroken(true)}
      />
      <div className="portrait-banner" style=${{ borderColor: theme.accent, color: theme.accent }}>${name}</div>
    </div>`;
  }

  return html`<div className="portrait-art" style=${{ background: `linear-gradient(165deg, ${mid}, ${bg})` }}>
    <svg className="portrait-svg" viewBox="0 0 120 150" aria-hidden="true">
      <defs>
        <linearGradient id=${`g-${name}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color=${theme.accent} stop-opacity="0.95" />
          <stop offset="100%" stop-color="#fff8e8" stop-opacity="0.35" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="104" height="134" rx="6" fill="none" stroke=${theme.accent} stroke-width="2" opacity="0.55" />
      <circle cx="60" cy="48" r="22" fill=${`url(#g-${name})`} opacity="0.9" />
      <path d="M30 130 C30 88 90 88 90 130" fill=${theme.accent} opacity="0.55" />
      <text x="60" y="54" text-anchor="middle" font-size="18" fill="#1a120c" font-weight="700">${theme.title}</text>
    </svg>
    <div className="portrait-banner" style=${{ borderColor: theme.accent, color: theme.accent }}>${name}</div>
  </div>`;
}

function CardView({ card, selected, disabled, dimmed, onClick, compact }) {
  if (card.hidden) {
    return html`<button
      type="button"
      className=${`sgs-card back ${compact ? "compact" : ""}`}
      disabled
    >
      <span className="back-mark">江</span>
    </button>`;
  }

  const red = card.color === "红";
  const longName = (card.name || "").length >= 3;
  return html`<button
    type="button"
    className=${`sgs-card ${red ? "red" : "black"} ${selected ? "selected" : ""} ${
      compact ? "compact" : ""
    } ${dimmed ? "dimmed" : ""} ${longName ? "long-name" : ""} ${disabled ? "is-disabled" : ""}`}
    onClick=${(e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (onClick) onClick(e);
    }}
    title=${card.description || card.label || card.name}
  >
    <div className="corner tl">
      <b>${card.rank_label}</b>
      <i>${SUIT_SYMBOL[card.suit] || ""}</i>
    </div>
    <div className="card-body">
      <div className="cname">${card.name}</div>
      <div className="ctype">${card.type}</div>
    </div>
    <div className="corner br">
      <i>${SUIT_SYMBOL[card.suit] || ""}</i>
      <b>${card.rank_label}</b>
    </div>
  </button>`;
}

function GeneralSeat({ player, side, damaged }) {
  const eq = player.equipment;
  const slots = [
    ["weapon", "武器", eq.weapon],
    ["armor", "防具", eq.armor],
    ["offensive_horse", "-1马", eq.offensive_horse],
    ["defensive_horse", "+1马", eq.defensive_horse],
  ];
  return html`<div className=${`general-seat ${side} ${damaged ? "hurt" : ""} ${player.alive ? "" : "dead"}`}>
    <div className="equip-rail">
      ${slots.map(
        ([key, label, card]) =>
          html`<div key=${key} className="eq-slot">
            ${card
              ? html`<${CardView} card=${card} compact=${true} />`
              : html`<span className="eq-empty">${label}</span>`}
          </div>`
      )}
    </div>
    <div className="portrait">
      <div className="portrait-frame">
        <${HeroPortraitArt} name=${player.hero.name} />
        <${HpPeaches} hp=${player.hp} maxHp=${player.max_hp} />
      </div>
      <div className="seat-meta">
        <div className="seat-nick">${player.name}</div>
        <div className="hp-text">${player.hp}/${player.max_hp}</div>
        <div className="skill-tag" title=${player.hero.skill_desc}>${player.hero.skill_name}</div>
        <div className="mark-row">
          ${player.marks.leidian ? html`<span className="chip">雷</span>` : null}
          ${player.marks.poison ? html`<span className="chip">毒</span>` : null}
          ${player.marks.judgment ? html`<span className="chip">判</span>` : null}
          ${player.marks.prison ? html`<span className="chip">牢</span>` : null}
          ${player.marks.shixian ? html`<span className="chip">诗</span>` : null}
          ${Number(player.marks.bawang_stacks) > 0
            ? html`<span className="chip">霸${player.marks.bawang_stacks}</span>`
            : null}
          ${Number(player.marks.wine_bonus) > 0 ? html`<span className="chip">酒</span>` : null}
        </div>
      </div>
    </div>
    ${side === "opponent"
      ? html`<div className="opp-hands">
          ${Array.from({ length: Math.min(player.hand_count, 10) }).map(
            (_, i) =>
              html`<${CardView}
                key=${i}
                card=${{ hidden: true, name: "背面" }}
                compact=${true}
              />`
          )}
          <span className="hand-count-badge">手牌 ${player.hand_count}</span>
        </div>`
      : null}
  </div>`;
}

function PlayPhaseBar({
  state,
  prompt,
  onRespond,
  mode,
  setMode,
  picked,
  setPicked,
  activeSkill,
  setActiveSkill,
}) {
  const hand = state.players.self.hand;
  const skills = (state.active_skills || []).map(normalizeSkill);
  const shixian = !!state.players.self.marks.shixian;
  const eq = state.players.self.equipment;

  const filter = activeSkill?.card_filter || "any";
  const needMin = activeSkill?.min_cards || 1;
  const needMax = activeSkill?.max_cards || 0;

  function togglePick(index, card) {
    if (mode === "skill" && !cardMatchesFilter(card, filter)) return;
    setPicked((prev) => {
      if (prev.includes(index)) return prev.filter((x) => x !== index);
      if (mode === "zhangba") {
        if (prev.length >= 2) return [prev[1], index];
        return [...prev, index];
      }
      if (mode === "skill") {
        const cap = needMax > 0 ? needMax : 99;
        if (activeSkill?.arg_mode === "one_card" || activeSkill?.arg_mode === "exactly_n") {
          if (prev.length >= (needMax || needMin)) return [...prev.slice(1), index];
        }
        if (prev.length >= cap) return [...prev.slice(1), index];
      }
      return [...prev, index];
    });
  }

  function startSkill(raw) {
    const skill = normalizeSkill(raw);
    if (skill.arg_mode === "none") {
      onRespond(`${skill.hotkey}`);
      setMode("play");
      setActiveSkill(null);
      setPicked([]);
      return;
    }
    setActiveSkill(skill);
    setMode("skill");
    setPicked([]);
  }

  function confirmSkill() {
    if (!activeSkill) return;
    if (activeSkill.arg_mode === "cards_or_all" && picked.length === 0) {
      onRespond(`${activeSkill.hotkey} all`);
    } else {
      const args = picked.map((i) => i + 1).join(" ");
      onRespond(`${activeSkill.hotkey} ${args}`.trim());
    }
    setMode("play");
    setActiveSkill(null);
    setPicked([]);
  }

  function canConfirmSkill() {
    if (!activeSkill) return false;
    const n = picked.length;
    if (activeSkill.arg_mode === "one_card") return n === 1;
    if (activeSkill.arg_mode === "exactly_n") return n === needMin;
    if (activeSkill.arg_mode === "cards") return n >= needMin;
    if (activeSkill.arg_mode === "cards_or_all") return true; // empty => all
    return false;
  }

  if (prompt.kind === "discard") {
    return html`<div className="action-dock">
      <div className="dock-tip">弃牌：点选手牌</div>
      <div className="hand-stage">
        ${hand.map(
          (card, index) =>
            html`<${CardView}
              key=${index}
              card=${card}
              fanIndex=${index}
              fanTotal=${hand.length}
              onClick=${() => onRespond(String(index + 1))}
            />`
        )}
      </div>
    </div>`;
  }

  return html`<div className="action-dock">
    <div className="dock-tip">
      ${mode === "skill" && activeSkill
        ? activeSkill.arg_mode === "cards_or_all"
          ? `【${skillName(activeSkill)}】点选手牌后确认；也可直接「换全部」`
          : `【${skillName(activeSkill)}】请选择符合条件的手牌（已选 ${picked.length}）`
        : mode === "zhangba"
          ? `丈八蛇矛：选择两张手牌当杀（${picked.length}/2）`
          : mode === "eq"
            ? "诗仙：点击装备当杀"
            : "出牌阶段：点击手牌出牌；左侧发动技能"}
    </div>

    ${mode === "eq"
      ? html`<div className="eq-pick">
          ${[
            ["weapon", eq.weapon, "武器"],
            ["armor", eq.armor, "防具"],
            ["进攻马", eq.offensive_horse, "-1马"],
            ["防御马", eq.defensive_horse, "+1马"],
          ].map(([slot, card, label]) =>
            card
              ? html`<button
                  key=${slot}
                  type="button"
                  className="btn primary"
                  onClick=${() => {
                    onRespond(`eq ${slot}`);
                    setMode("play");
                  }}
                >
                  ${label}·${card.name}
                </button>`
              : null
          )}
          <button type="button" className="btn" onClick=${() => setMode("play")}>取消</button>
        </div>`
      : null}

    <div className="dock-main">
      <aside className="skill-rail">
        <div className="skill-rail-title">技能</div>
        ${skills.map(
          (s) =>
            html`<button
              key=${s.id || s.hotkey || skillName(s)}
              type="button"
              className=${`skill-seal ${skillName(activeSkill) === skillName(s) && mode === "skill" ? "on" : ""}`}
              title=${s.help || skillName(s)}
              onClick=${() => startSkill(s)}
            >
              ${skillName(s)}
            </button>`
        )}
        ${shixian
          ? html`<button type="button" className="skill-seal alt" onClick=${() => setMode("eq")}>装杀</button>`
          : null}
        ${eq.weapon?.trait === "two_as_sha" || (eq.weapon && String(eq.weapon.name || "").includes("丈八"))
          ? html`<button
              type="button"
              className=${`skill-seal alt ${mode === "zhangba" ? "on" : ""}`}
              onClick=${() => {
                setMode("zhangba");
                setPicked([]);
                setActiveSkill(null);
              }}
            >
              丈八
            </button>`
          : null}
      </aside>

      <div className="hand-stage">
        ${hand.map((card, index) => {
          const allowed = mode !== "skill" || cardMatchesFilter(card, filter);
          const blocked = (mode === "skill" && !allowed) || mode === "eq";
          return html`<${CardView}
            key=${`${card.label || card.name}-${index}`}
            card=${card}
            selected=${picked.includes(index)}
            dimmed=${blocked}
            disabled=${blocked}
            onClick=${() => {
              if (mode === "skill" || mode === "zhangba") {
                togglePick(index, card);
                return;
              }
              onRespond(String(index + 1));
            }}
          />`;
        })}
      </div>
    </div>

    <div className="dock-actions">
      ${mode === "skill"
        ? html`
            ${activeSkill?.arg_mode === "cards_or_all"
              ? html`<button type="button" className="btn primary" onClick=${() => {
                  onRespond(`${activeSkill.hotkey} all`);
                  setMode("play");
                  setActiveSkill(null);
                  setPicked([]);
                }}>
                  换全部
                </button>`
              : null}
            <button type="button" className="btn primary" disabled=${!canConfirmSkill()} onClick=${confirmSkill}>
              确认发动
            </button>
            <button
              type="button"
              className="btn"
              onClick=${() => {
                setMode("play");
                setActiveSkill(null);
                setPicked([]);
              }}
            >
              取消
            </button>
          `
        : mode === "zhangba"
          ? html`
              <button
                type="button"
                className="btn primary"
                disabled=${picked.length !== 2}
                onClick=${() => {
                  onRespond(`sha ${picked.map((i) => i + 1).join(" ")}`);
                  setMode("play");
                  setPicked([]);
                }}
              >
                当杀打出
              </button>
              <button
                type="button"
                className="btn"
                onClick=${() => {
                  setMode("play");
                  setPicked([]);
                }}
              >
                取消
              </button>
            `
          : html`<button type="button" className="btn end-phase" onClick=${() => onRespond("0")}>结束出牌</button>`}
    </div>
  </div>`;
}

function PromptLayer({ state, prompt, onRespond }) {
  const [picked, setPicked] = useState([]);
  const [mode, setMode] = useState("play");
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    setPicked([]);
    setMode("play");
    setActiveSkill(null);
  }, [prompt?.prompt_id]);

  if (!prompt) return null;

  if (prompt.kind === "confirm") {
    return html`<div className="modal-mask">
      <div className="sgs-dialog">
        <p>${prompt.message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn primary" onClick=${() => onRespond("y")}>确定</button>
          <button type="button" className="btn" onClick=${() => onRespond("n")}>取消</button>
        </div>
      </div>
    </div>`;
  }

  if (["choice", "hero_select", "select_target_card", "rescue"].includes(prompt.kind) && prompt.options?.length) {
    return html`<div className="modal-mask">
      <div className="sgs-dialog">
        <p>${prompt.message}</p>
        <div className="dialog-actions wrap">
          ${prompt.options.map(
            (opt) =>
              html`<button key=${opt.id} type="button" className="btn option" onClick=${() => onRespond(opt.id)}>
                ${opt.label}
              </button>`
          )}
        </div>
      </div>
    </div>`;
  }

  if (prompt.kind === "select_hand") {
    const need = prompt.max_count || 1;
    const hand = state.players.self.hand;
    return html`<div className="modal-mask">
      <div className="sgs-dialog wide">
        <p>${prompt.message}（${picked.length}/${need}）</p>
        <div className="hand-stage flat">
          ${hand.map(
            (card, index) =>
              html`<${CardView}
                key=${index}
                card=${card}
                selected=${picked.includes(index)}
                onClick=${() =>
                  setPicked((prev) => {
                    if (prev.includes(index)) return prev.filter((x) => x !== index);
                    if (prev.length >= need) return [...prev.slice(1), index];
                    return [...prev, index];
                  })}
              />`
          )}
        </div>
        <button
          type="button"
          className="btn primary"
          disabled=${picked.length !== need}
          onClick=${() => onRespond(picked.map((i) => i + 1).join(" "))}
        >
          确认
        </button>
      </div>
    </div>`;
  }

  if (prompt.kind === "play_card" || prompt.kind === "discard") {
    return html`<${PlayPhaseBar}
      state=${state}
      prompt=${prompt}
      onRespond=${onRespond}
      mode=${mode}
      setMode=${setMode}
      picked=${picked}
      setPicked=${setPicked}
      activeSkill=${activeSkill}
      setActiveSkill=${setActiveSkill}
    />`;
  }

  return html`<div className="modal-mask">
    <div className="sgs-dialog">
      <p>${prompt.message}</p>
      <form
        onSubmit=${(e) => {
          e.preventDefault();
          onRespond(String(new FormData(e.currentTarget).get("value") || ""));
        }}
      >
        <input name="value" className="text-input" autofocus />
        <button type="submit" className="btn primary">提交</button>
      </form>
    </div>
  </div>`;
}

function useMatchSocket(session) {
  const [state, setState] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lobby, setLobby] = useState(null);
  const [flash, setFlash] = useState(null);
  const wsRef = useRef(null);
  const logId = useRef(0);
  const promptRef = useRef(null);
  const busyRef = useRef(null);
  promptRef.current = prompt;

  useEffect(() => {
    if (!session) return;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${proto}://${window.location.host}/ws/${session.match_id}?token=${session.token}`);
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.state) setState(data.state);
      if (data.match) setLobby(data.match);
      if (data.type === "event" && data.event) {
        const id = ++logId.current;
        setLogs((prev) => [{ id, message: data.event.message, type: data.event.type }, ...prev].slice(0, 60));
        if (data.event.type === "game_over") setFlash(data.event.message);
        if (/伤害|受伤/.test(data.event.message || "")) {
          setFlash("damage");
          setTimeout(() => setFlash(null), 500);
        }
      }
      if (data.type === "prompt") {
        busyRef.current = null;
        setPrompt(data.prompt);
      }
      if (data.type === "error") {
        setFlash(data.message || "操作失败");
        setTimeout(() => setFlash(null), 1800);
      }
      if (data.type === "closed") {
        setPrompt(null);
        setConnected(false);
      }
      if (data.type === "lobby") {
        setLobby(data.match);
        if (data.match?.status === "lobby") setPrompt(null);
      }
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [session?.match_id, session?.token]);

  const respond = useCallback((value, promptId) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setFlash("未连接到服务器，无法出牌");
      return;
    }
    const pid = promptId || promptRef.current?.prompt_id;
    if (!pid) {
      setFlash("当前不能出牌（没有等待中的操作）");
      return;
    }
    if (busyRef.current === pid) return;
    busyRef.current = pid;
    ws.send(
      JSON.stringify({
        type: "respond",
        prompt_id: pid,
        value: value == null ? "" : String(value),
      })
    );
  }, []);

  const sendLobby = useCallback((payload) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "lobby", ...payload }));
  }, []);

  return { state, prompt, logs, connected, lobby, flash, respond, sendLobby };
}

function HeroPickPanel({ heroes, hero, onPick, compact = false }) {
  const selected = heroes.find((h) => h.name === hero) || heroes[0];
  return html`<div className=${`hero-pick ${compact ? "compact" : ""}`}>
    <div className="home-hero-preview">
      <img
        src=${`/static/portraits/${encodeURIComponent(selected?.name || "项羽")}.jpg`}
        alt=${selected?.name || ""}
        className="home-hero-img"
      />
      <div className="home-hero-meta">
        <strong>${selected?.name || "选择武将"}</strong>
        <span className="hero-hp">${selected ? `${selected.max_hp} 点体力` : ""}</span>
        ${selected
          ? html`<div className="skill-block">
              <div className="skill-name">技能 · ${selected.skill_name}</div>
              <p className="skill-desc">${selected.skill_desc}</p>
            </div>`
          : null}
      </div>
    </div>
    <div className=${`hero-gallery ${compact ? "compact" : ""}`}>
      ${heroes.map(
        (h) => html`<button
          key=${h.name}
          type="button"
          className=${`hero-chip ${hero === h.name ? "on" : ""}`}
          onClick=${() => onPick(h.name)}
          title=${`${h.skill_name}：${h.skill_desc}`}
        >
          <img src=${`/static/portraits/${encodeURIComponent(h.name)}.jpg`} alt=${h.name} />
          <span className="chip-name">${h.name}</span>
          <span className="chip-skill">${h.skill_name}</span>
        </button>`
      )}
    </div>
  </div>`;
}

function App() {
  const [screen, setScreen] = useState("home");
  const [heroes, setHeroes] = useState([]);
  const [nickname, setNickname] = useState("少侠");
  const [hero, setHero] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const { state, prompt, logs, connected, lobby, flash, respond, sendLobby } = useMatchSocket(session);

  useEffect(() => {
    fetch("/api/heroes")
      .then((r) => r.json())
      .then((data) => {
        setHeroes(data);
        if (data[0]) setHero(data[0].name);
      })
      .catch(() => setError("无法加载英雄列表，请确认后端已启动"));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("jh_session");
    if (!raw) return;
    try {
      setSession(JSON.parse(raw));
      setScreen("table");
    } catch {
      localStorage.removeItem("jh_session");
    }
  }, []);

  useEffect(() => {
    if (session) localStorage.setItem("jh_session", JSON.stringify(session));
  }, [session]);

  const phaseLabel = !prompt
    ? connected
      ? "观战 / 等待"
      : "连接中"
    : {
        play_card: "出牌阶段",
        discard: "弃牌",
        confirm: "询问中",
        choice: "选择中",
        hero_select: "选将",
        select_target_card: "选牌",
        select_hand: "选手牌",
        rescue: "濒死求桃",
      }[prompt.kind] || "操作中";

  async function startAi(mode = "ai") {
    setError("");
    const res = await fetch("/api/matches/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, hero, mode }),
    });
    if (!res.ok) {
      setError(await res.text());
      return;
    }
    const data = await res.json();
    setSession({ match_id: data.match_id, token: data.token, seat: data.seat, mode: data.mode || mode });
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
    return html`<div className="home-sgs">
      <div className="home-table-glow"></div>
      <header className="brand">
        <h1>江湖 Slay</h1>
        <p>一桌刀光 · 英雄入彀</p>
      </header>
      <section className="home-panel carved wide-home">
        <${HeroPickPanel}
          heroes=${heroes}
          hero=${hero}
          onPick=${(name) => setHero(name)}
        />
        <label>
          昵称
          <input value=${nickname} onChange=${(e) => setNickname(e.target.value)} />
        </label>
        <div className="home-actions">
          <button type="button" className="btn primary" onClick=${() => startAi("ai")} disabled=${!hero}>
            人机 1v1
          </button>
          <button type="button" className="btn primary alt" onClick=${() => startAi("ai2")} disabled=${!hero}>
            人机 1v2
          </button>
          <button type="button" className="btn" onClick=${createRoom}>创建房间</button>
        </div>
        <div className="join-row">
          <input
            placeholder="房间码"
            value=${roomCode}
            onChange=${(e) => setRoomCode(e.target.value.toUpperCase())}
          />
          <button type="button" className="btn" onClick=${joinRoom}>加入房间</button>
        </div>
        ${error ? html`<p className="error">${error}</p>` : null}
      </section>
    </div>`;
  }

  const inLobby = session?.mode === "pvp" && (!state || (lobby && lobby.status === "lobby"));
  const seats = lobby?.seats || {};

  return html`<div className=${`sgs-table ${flash === "damage" ? "damage-flash" : ""}`}>
    <header className="table-chrome">
      <div className="chrome-left">
        <b>江湖 Slay</b>
        <span className=${`dot ${connected ? "on" : "off"}`} title=${connected ? "已连接" : "未连接"}></span>
        ${session?.code ? html`<span className="room-code">房 ${session.code}</span>` : null}
        ${state ? html`<span className="round">第 ${state.round} 轮</span>` : null}
        <span className="phase-chip">${phaseLabel}</span>
      </div>
      <div className="chrome-right">
        <button type="button" className="btn ghost" onClick=${() => setLogOpen((v) => !v)}>
          ${logOpen ? "收起战报" : `战报${logs.length ? `(${Math.min(logs.length, 99)})` : ""}`}
        </button>
        <button type="button" className="btn ghost" onClick=${leave}>离开</button>
      </div>
    </header>

    ${inLobby
      ? html`<div className="lobby carved">
          <h2>对战大厅</h2>
          <p className="lobby-code">房间码 <strong>${session?.code}</strong>，发给好友即可加入</p>
          <div className="lobby-seats">
            ${["p1", "p2"].map((seat) => {
              const info = seats[seat];
              return html`<div key=${seat} className="lobby-seat-card">
                <div className="lobby-seat-name">${seat === "p1" ? "座位一" : "座位二"}</div>
                <div>${info?.nickname || "等待加入…"}</div>
                <div className="lobby-seat-hero">${info?.hero || "未选将"}</div>
                <div className=${`lobby-ready ${info?.ready ? "yes" : ""}`}>${info?.ready ? "已准备" : "未准备"}</div>
              </div>`;
            })}
          </div>
          <${HeroPickPanel}
            heroes=${heroes}
            hero=${hero}
            compact=${true}
            onPick=${(name) => {
              setHero(name);
              sendLobby({ hero: name });
            }}
          />
          <button type="button" className="btn primary" onClick=${() => sendLobby({ hero, ready: true })}>
            准备开战
          </button>
        </div>`
      : null}

    <div className=${`felt ${state?.mode === "1v2" || (state?.players?.opponents || []).length > 1 ? "felt-1v2" : ""}`}>
      ${state
        ? html`
            <div className="opponent-row">
              ${(state.players.opponents || (state.players.opponent ? [state.players.opponent] : [])).map(
                (opp) =>
                  html`<${GeneralSeat}
                    key=${opp.seat || opp.name}
                    player=${opp}
                    side="opponent"
                    damaged=${flash === "damage"}
                  />`
              )}
            </div>
            <div className="center-well">
              <div className="pile deck"><span>牌堆</span><b>${state.deck_count}</b></div>
              <div className="pile discard"><span>弃牌</span><b>${state.discard_count}</b></div>
              ${state.mode === "1v2" ? html`<div className="mode-badge">1v2</div>` : null}
              ${state.winner ? html`<div className="winner-banner">胜负已分</div>` : null}
            </div>
            <${GeneralSeat} player=${state.players.self} side="self" />
          `
        : !inLobby
          ? html`<div className="waiting">连接对局中…</div>`
          : null}
    </div>

    ${typeof flash === "string" && flash !== "damage"
      ? html`<div className="toast-float">${flash}</div>`
      : null}

    ${state ? html`<${PromptLayer} state=${state} prompt=${prompt} onRespond=${respond} />` : null}

    <aside className=${`log-rail ${logOpen ? "open" : "closed"}`}>
      <div className="log-head">战报</div>
      ${logOpen
        ? logs.map((item) => html`<div key=${item.id} className="log-item">${item.message}</div>`)
        : null}
    </aside>
  </div>`;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
