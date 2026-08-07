import type { PlayerDTO } from "../types";
import { CardView } from "./CardView";

type Props = {
  player: PlayerDTO;
  side: "self" | "opponent";
  damaged?: boolean;
};

export function PlayerPanel({ player, side, damaged }: Props) {
  const hpPct = Math.max(0, (player.hp / player.max_hp) * 100);
  const eq = player.equipment;
  return (
    <div className={`player-panel ${side} ${damaged ? "shake" : ""} ${player.alive ? "" : "dead"}`}>
      <div className="player-meta">
        <div className="hero-name">{player.hero.name}</div>
        <div className="player-name">{player.name}</div>
        <div className="skill-line">
          {player.hero.skill_name} · {player.hero.skill_desc}
        </div>
        <div className="hp-bar">
          <div className="hp-fill" style={{ width: `${hpPct}%` }} />
          <span>
            HP {player.hp}/{player.max_hp}
          </span>
        </div>
        <div className="marks">
          {player.marks.leidian ? <span className="mark">雷</span> : null}
          {player.marks.poison ? <span className="mark">毒</span> : null}
          {player.marks.judgment ? <span className="mark">判</span> : null}
          {player.marks.prison ? <span className="mark">牢</span> : null}
          {player.marks.shixian ? <span className="mark">诗</span> : null}
          {Number(player.marks.wine_bonus) > 0 ? <span className="mark">酒+{String(player.marks.wine_bonus)}</span> : null}
          {Number(player.marks.bawang_stacks) > 0 ? (
            <span className="mark">霸{String(player.marks.bawang_stacks)}</span>
          ) : null}
        </div>
      </div>
      <div className="equip-row">
        {eq.weapon ? <CardView card={eq.weapon} compact /> : <div className="equip-slot">武器</div>}
        {eq.armor ? <CardView card={eq.armor} compact /> : <div className="equip-slot">防具</div>}
        {eq.offensive_horse ? <CardView card={eq.offensive_horse} compact /> : <div className="equip-slot">-1马</div>}
        {eq.defensive_horse ? <CardView card={eq.defensive_horse} compact /> : <div className="equip-slot">+1马</div>}
      </div>
      {side === "opponent" ? (
        <div className="hand-fan opponent-hand">
          {Array.from({ length: player.hand_count }).map((_, i) => (
            <CardView key={i} card={{ hidden: true, name: "背面" }} compact />
          ))}
        </div>
      ) : null}
    </div>
  );
}
