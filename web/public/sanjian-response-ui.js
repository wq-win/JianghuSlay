import React, { useRef, useState } from 'react';
import { html } from 'htm/react';
import { CardArt } from './card-art.js';
import { heroDisplayName } from './display-names.js';

const CANCEL_IDS = new Set(['cancel', 'pass', '0']);
const sameSeat = (first, second) => first === second || ({p1:'player',p2:'ai',p3:'ai2',player:'p1',ai:'p2',ai2:'p3'})[first] === second;
const isOwned = (prompt, self) => Boolean(self && prompt.player_id && prompt.meta?.private_to &&
  sameSeat(prompt.player_id, self.seat) && sameSeat(prompt.meta.private_to, self.seat));
const originName = (state, id) => {
  const self = state.players.self;
  const player = [self, ...(state.players.opponents || []), state.players.opponent].filter(Boolean).find(player => sameSeat(player.seat, id));
  return player ? `${player === self ? '你' : player.name} · ${heroDisplayName(player.hero)}` : '提示中指定的受伤者';
};

/** The runtime deliberately sends complete legal cost+target combinations.
 * Keep each opaque option ID intact. Do not parse labels, reconstruct another
 * player's hand, infer additional legal targets, or submit separate costs. */
export function SanjianResponseDialog({ state, prompt, onRespond }) {
  const [selectedId, setSelectedId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const sent = useRef(false);
  if (!isOwned(prompt, state?.players?.self)) return html`<div className="thinking-dock" role="status">等待其他角色完成响应…</div>`;
  const options = Array.isArray(prompt.options) ? prompt.options : [];
  const choices = options.filter(option => !CANCEL_IDS.has(option.id));
  const cancel = options.find(option => CANCEL_IDS.has(option.id) && !option.disabled);
  const selected = choices.find(option => option.id === selectedId && !option.disabled);
  const submit = id => {
    if (sent.current || !options.some(option => option.id === id && !option.disabled)) return;
    sent.current = true;
    setSubmitted(true);
    onRespond(id);
  };
  return html`<div className="modal-mask"><div className="sgs-dialog card-response-dialog sanjian-response-dialog wide" role="dialog" aria-modal="true" aria-label="三尖两刃刀：确认手牌费用与目标" data-response-stage="sanjian_cost_target" onKeyDown=${event => {
    if (event.key === 'Escape' && cancel && !event.currentTarget.closest('fieldset')?.disabled) {
      event.preventDefault(); event.stopPropagation(); submit(cancel.id);
    }
  }}>
    <header className="sanjian-response-heading"><span className="sanjian-response-art"><${CardArt} card=${{name:'三尖两刃刀'}} compact=${true} /></span><div><div className="response-kicker">国战装备兼容包 · 武器响应</div><strong>三尖两刃刀</strong><span>方块 Q · 攻击范围 3</span></div></header>
    <p className="response-message">${prompt.message}</p>
    <section className="response-context sanjian-response-context" aria-label="距离起点与费用规则">
      <strong>从受伤者 ${originName(state, prompt.meta.origin_id)} 计算距离</strong>
      <p>选择另一名存活角色；原受伤者到该角色的当前距离须恰为 1。自己和队友也可选择。</p>
      <small>仅弃置自己的 1 张手牌。选择组合不会支付；确认后先完整结算弃牌及其触发效果，再造成 1 点普通伤害。确认后不能退款或改选。</small>
    </section>
    <div className="sanjian-combination-picker" role="group" aria-label="选择一张手牌与一个目标的完整组合">
      ${choices.map(option => html`<button key=${option.id} type="button" className=${`btn sanjian-combination ${selectedId === option.id ? 'is-selected' : ''}`} data-option-id=${option.id} aria-pressed=${selectedId === option.id} disabled=${submitted || !!option.disabled} onClick=${() => setSelectedId(option.id)}><span className="sanjian-choice-mark" aria-hidden="true">${selectedId === option.id ? '●' : '○'}</span><span>${option.label}</span></button>`)}
    </div>
    <p className="sanjian-selection-summary" role="status" aria-live="polite">${submitted ? '已提交选择，正在结算…' : selected ? `待确认：${selected.label}。尚未弃牌。` : '先选择完整的手牌与目标组合；尚未弃牌。'}</p>
    <div className="dialog-actions sanjian-confirm-actions">
      <button type="button" className="btn primary" data-sanjian-confirm="true" disabled=${submitted || !selected} onClick=${() => selected && submit(selected.id)}>${selected ? `确认：${selected.label}` : '选择后确认发动'}</button>
      ${cancel ? html`<button type="button" className="btn response-cancel" data-option-id=${cancel.id} disabled=${submitted} onClick=${() => submit(cancel.id)}>${cancel.label}</button>` : null}
    </div>
  </div></div>`;
}
