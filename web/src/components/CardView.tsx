import type { CardDTO } from "./types";

const SUIT_SYMBOL: Record<string, string> = {
  红桃: "♥",
  方块: "♦",
  黑桃: "♠",
  梅花: "♣",
};

type Props = {
  card: CardDTO;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
};

export function CardView({ card, selected, onClick, compact }: Props) {
  if (card.hidden) {
    return (
      <button type="button" className={`card card-back ${compact ? "compact" : ""}`} disabled>
        <span>江湖</span>
      </button>
    );
  }
  const red = card.color === "红";
  return (
    <button
      type="button"
      className={`card ${red ? "red" : "black"} ${selected ? "selected" : ""} ${compact ? "compact" : ""}`}
      onClick={onClick}
      title={card.description || card.label}
    >
      <div className="card-corner">
        <span>{card.rank_label}</span>
        <span>{SUIT_SYMBOL[card.suit || ""] || ""}</span>
      </div>
      <div className="card-name">{card.name}</div>
      <div className="card-type">{card.type}</div>
    </button>
  );
}
