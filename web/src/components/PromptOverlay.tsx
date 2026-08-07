import { useMemo, useState } from "react";
import type { MatchState, PendingPrompt } from "../types";
import { CardView } from "./CardView";

type Props = {
  state: MatchState;
  prompt: PendingPrompt | null;
  onRespond: (value: string) => void;
};

export function PromptOverlay({ state, prompt, onRespond }: Props) {
  const [picked, setPicked] = useState<number[]>([]);
  const hand = state.players.self.hand;

  const isPlay = prompt?.kind === "play_card";
  const isDiscard = prompt?.kind === "discard";
  const isConfirm = prompt?.kind === "confirm";
  const isChoice = ["choice", "hero_select", "select_target_card", "rescue"].includes(prompt?.kind || "");
  const isSelectHand = prompt?.kind === "select_hand";

  const skillHints = useMemo(() => state.active_skills || [], [state.active_skills]);

  if (!prompt) return null;

  if (isConfirm) {
    return (
      <div className="prompt-bar">
        <p>{prompt.message}</p>
        <div className="prompt-actions">
          <button type="button" className="btn primary" onClick={() => onRespond("y")}>
            是
          </button>
          <button type="button" className="btn" onClick={() => onRespond("n")}>
            否
          </button>
        </div>
      </div>
    );
  }

  if (isChoice && prompt.options.length) {
    return (
      <div className="prompt-bar">
        <p>{prompt.message}</p>
        <div className="prompt-actions wrap">
          {prompt.options.map((opt) => (
            <button key={opt.id} type="button" className="btn" onClick={() => onRespond(opt.id)}>
              {opt.id}. {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isSelectHand) {
    const need = prompt.max_count || 1;
    return (
      <div className="prompt-bar">
        <p>
          {prompt.message}（已选 {picked.length}/{need}）
        </p>
        <div className="hand-fan interactive">
          {hand.map((card, index) => (
            <CardView
              key={`${card.label}-${index}`}
              card={card}
              selected={picked.includes(index)}
              onClick={() => {
                setPicked((prev) => {
                  if (prev.includes(index)) return prev.filter((x) => x !== index);
                  if (prev.length >= need) return [...prev.slice(1), index];
                  return [...prev, index];
                });
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn primary"
          disabled={picked.length !== need}
          onClick={() => {
            onRespond(picked.map((i) => i + 1).join(" "));
            setPicked([]);
          }}
        >
          确认
        </button>
      </div>
    );
  }

  if (isPlay || isDiscard) {
    return (
      <div className="prompt-bar play-bar">
        <p>{prompt.message}</p>
        <div className="skill-hints">
          {skillHints.map((s) => (
            <button
              key={s.hotkey}
              type="button"
              className="btn ghost"
              title={s.help}
              onClick={() => {
                const args = window.prompt(`技能 ${s.hotkey.toUpperCase()} 参数（手牌编号，可空）`, "");
                if (args === null) return;
                onRespond(`${s.hotkey} ${args}`.trim());
              }}
            >
              [{s.hotkey}] {s.help}
            </button>
          ))}
        </div>
        <div className="hand-fan interactive">
          {hand.map((card, index) => (
            <CardView
              key={`${card.label}-${index}`}
              card={card}
              onClick={() => onRespond(String(index + 1))}
            />
          ))}
        </div>
        {isPlay ? (
          <div className="prompt-actions">
            <button type="button" className="btn primary" onClick={() => onRespond("0")}>
              结束出牌
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                const raw = window.prompt("丈八蛇矛：输入两张手牌编号，如 1 2", "");
                if (raw) onRespond(`sha ${raw}`);
              }}
            >
              丈八当杀
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                const slot = window.prompt("诗仙装备当杀：weapon / armor / 进攻马 / 防御马", "weapon");
                if (slot) onRespond(`eq ${slot}`);
              }}
            >
              装备当杀
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="prompt-bar">
      <p>{prompt.message}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onRespond(String(fd.get("value") || ""));
        }}
      >
        <input name="value" className="text-input" autoFocus placeholder="输入响应" />
        <button type="submit" className="btn primary">
          提交
        </button>
      </form>
    </div>
  );
}
