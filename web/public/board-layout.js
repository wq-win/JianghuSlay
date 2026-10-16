import { html } from "htm/react";
import { heroDisplayName } from "./display-names.js";

/** The battle board only arranges state; all card/skill actions stay in the dock. */
export function BattleBoard({ state, self, opponents = [], phaseLabel, ended, won, hasSaved, flash, GeneralSeat, CardView, HeroSkills, prompt, busy }) {
  if (!self) {
    return html`<section className="battle-board board-loading" aria-label="对局区域">
      <div className="waiting" role="status">正在摆好牌桌…</div>
    </section>`;
  }

  const saveLabel = state.save_status === "unavailable"
    ? "存档不可用，请勿刷新"
    : ended ? "此局已收录在本机存档"
      : hasSaved ? "每步自动保存 · 仅当前浏览器" : "本地对局";
  const recentCards = Array.isArray(state.recent_cards) ? state.recent_cards.slice(-3).reverse() : [];

  return html`<section className=${`battle-board ${opponents.length > 1 ? "battle-board-1v2" : ""}`} aria-label="对局区域">
    <aside className="self-panel" aria-labelledby="self-panel-title">
      <header className="board-panel-heading">
        <h2 id="self-panel-title">我方状态</h2>
        <span>手牌 ${self.hand_count ?? self.hand?.length ?? 0}</span>
      </header>
      <${GeneralSeat} player=${self} side="self" state=${state} />
      ${HeroSkills ? html`<${HeroSkills} hero=${self.hero} player=${self} state=${state} prompt=${prompt} busy=${busy} self=${true} />` : null}
    </aside>

    <section className="battle-arena" aria-label="对手与出牌区">
      <div className="opponent-row" aria-label="对手状态">
        ${opponents.map((opponent, index) => html`<section
          key=${opponent.seat || `${opponent.name}-${index}`}
          className="opponent-panel"
          aria-label=${`对手 ${index + 1} · ${heroDisplayName(opponent.hero)}`}
        >
          <header className="board-panel-heading">
            <h2>对手 ${opponents.length > 1 ? index + 1 : ""}</h2>
            <span>${opponent.alive ? "人机" : "已退场"}</span>
          </header>
          <${GeneralSeat} player=${opponent} side="opponent" damaged=${flash === "damage"} state=${state} />
          ${HeroSkills ? html`<${HeroSkills} hero=${opponent.hero} player=${opponent} compact=${true} />` : null}
        </section>`)}
      </div>

      <section className="play-area" aria-labelledby="play-area-title">
        <div className="play-area-heading"><h2 id="play-area-title">出牌区</h2><span>弃牌堆顶</span></div>
        <div className="center-well">
          <div className="pile deck" aria-label=${`牌堆 ${state.deck_count} 张`}><span>牌堆</span><b>${state.deck_count}</b></div>
          <div className="table-status" role="status" aria-live="polite">
            <span>${ended ? (won ? "大获全胜" : "胜败乃兵家常事") : phaseLabel}</span>
            <small>${saveLabel}</small>
          </div>
          <div className="pile discard" aria-label=${`弃牌堆 ${state.discard_count} 张`}><span>弃牌</span><b>${state.discard_count}</b></div>
        </div>
        <div className=${`recent-discards ${recentCards.length && CardView ? "has-cards" : "is-empty"}`} aria-label="弃牌堆顶，最新的牌在左侧">
          ${recentCards.length && CardView
            ? recentCards.map((card, index) => html`<div className="recent-discard" key=${`${card.label || card.name}-${index}`}>
                <${CardView} card=${card} />
                <span>${index === 0 ? "最新" : ""}</span>
              </div>`)
            : html`<p>还没有弃牌<br /><span>进入弃牌堆的牌将在这里显示</span></p>`}
        </div>
        <p className="play-area-hint">${ended ? "可在下方重新开局或更换英雄" : "在下方选择手牌、发动技能或结束出牌"}</p>
      </section>
    </section>
  </section>`;
}
