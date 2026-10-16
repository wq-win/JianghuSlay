import {SgsFuliRescueContext} from './sgs-yijiang-next-skill-ui.js';
import {WANGYUN_CARD_RULES,WangyunCardRules} from './wangyun-card-art.js';
import React, { useState } from 'react';
import { html } from 'htm/react';
import { CardArt } from './card-art.js';
import { heroDisplayName } from './display-names.js';
import { SanjianResponseDialog } from './sanjian-response-ui.js';

const SUIT = { 红桃: '♥', 方块: '♦', 黑桃: '♠', 梅花: '♣' };
const CANCEL_IDS = new Set(['cancel', 'pass', 'refuse', '0']);
const rankLabel = card => card.rank_label || ({1:'A',11:'J',12:'Q',13:'K'})[card.rank] || card.rank || '';
export function responseSeatName(state, seat) {
  const players = [state.players.self, ...(state.players.opponents || []), state.players.opponent].filter(Boolean);
  const alias = { p1: 'player', p2: 'ai', p3: 'ai2', player: 'p1', ai: 'p2', ai2: 'p3' };
  const player = players.find(p => p.seat === seat || p.seat === alias[seat]);
  if (!player) return seat || '当前角色';
  return player === state.players.self ? `你 · ${heroDisplayName(player.hero)}` : `${player.name} · ${heroDisplayName(player.hero)}`;
}

export function ResponseContext({ state, prompt }) {
  const meta = prompt.meta || {};
  const stage = meta.stage;
  const target = responseSeatName(state, meta.target_seat);
  const revealed = meta.revealed_card;
  if (Number(meta.response_required) > 1) return html`<section className="response-context multi-response-context" aria-label="连续响应进度"><div className="response-kicker">连续响应 · ${meta.response_name || meta.card_name || '响应牌'}</div><strong>已打出 ${Number(meta.response_supplied) || 0} / ${Number(meta.response_required)}</strong><p>每张分别打出并结算。必须足量才能完成这次响应；中途放弃不会退回已打出的牌。</p>${meta.skill==='轻影'?html`<small>轻影仅使用黑色手牌（H）；黑色装备不可用于闪。</small>`:meta.skill==='傲剑'?html`<small>傲剑可用红色手牌或装备（H / E）响应杀；每次响应分别支付。</small>`:null}</section>`;
  if (['yubu_start','yubu_continue'].includes(stage)) return html`<section className="response-context fourth-skill-context" data-skill-context="玉步" aria-label="玉步准备阶段判定">
    <div className="response-kicker">准备阶段 · 在判定区与摸牌之前</div><strong>${stage==='yubu_continue'?'黑色结果：可继续判定，也可停止':'是否开始玉步判定'}</strong>
    <p>已判定 ${Number(meta.judgments)||0} 次，已获得 ${Number(meta.gained)||0} 张黑色牌。每次经过正常改判，以最终判定牌为准；红色停止且不获得。</p><small>停止保留已获黑牌。之后仍正常结算判定区与摸牌阶段；这不是额外的主动技能按钮。</small>
  </section>`;
  if (stage === 'chuchu') return html`<section className="response-context fourth-skill-context" data-skill-context="楚楚"><div className="response-kicker">结束阶段 · 弃牌完成后</div><strong>可摸 1 张牌</strong><p>本次摸牌不倒回刚结束的弃牌阶段。可以放弃，即使本回合跳过出牌也按结束阶段询问。</p></section>`;
  if (stage === 'diehun') return html`<section className="response-context fourth-skill-context" data-skill-context="蝶魂"><strong>${meta.card_name || '多目标锦囊'} · 仅跳过自己的效果</strong><p>发动则摸 1 张，并跳过此牌对自己的效果；其他目标照常结算。放弃后仍进入正常无懈与响应窗口。</p><small>按卡牌默认目标类型判断，当前只有一个实际目标也可能触发。铁索按本作公开兼容规则处理。</small></section>`;
  if (stage === 'qianglue_start' || stage === 'qianglue_card') return html`<section className="response-context fourth-skill-context" data-skill-context="强掠"><strong>${stage==='qianglue_start'?'这次杀已被足额闪避':'黑色判定：选择获得 1 张牌'}</strong><p>${stage==='qianglue_start'?'每个杀与目标的完整闪避事件只判定一次。黑色可取牌，红色无效果；装备免疫或不完整响应不触发。':'可选手牌（H）、装备区（E）或判定区（J）。公开区显示牌名，手牌仅盲取 1 张，不展示内容。'}</p><small>取得牌进入自己手牌，不自动装备；取走判定素材会解除原判定效果。</small></section>`;
  if (stage === 'hongyan_first' || stage === 'hongyan_second') return html`<section className="response-context fourth-skill-context" data-skill-context="红颜"><div className="response-kicker">红颜 · 第 ${stage==='hongyan_first'?'1':'2'} / 2 个目标</div><strong>${stage==='hongyan_first'?'先选择先响应杀的男性':'再选择另一名男性作为决斗对方'}</strong><p>两人必须不同且均为其他存活男性。完成两次选择才支付材料；此前可取消。决斗不是使用实体锦囊，不进入无懈窗口。</p></section>`;
  if (stage === 'choulue_donor' || stage === 'choulue_gift' || stage === 'choulue_use_target') return html`<section className="response-context fourth-skill-context" data-skill-context="筹略"><div className="response-kicker">筹略 · 出牌阶段开始</div><strong>${stage==='choulue_gift'?`由你决定是否向${responseSeatName(state,meta.recipient_seat)}交牌`:stage==='choulue_use_target'?'已收赠牌：必须完成合法的视为使用':'选择一名其他角色询问交牌'}</strong><p>${stage==='choulue_gift'?'可交自己的 1 张手牌或装备，不可交判定牌；也可拒绝。仅本次赠牌者可看见自己的材料。':stage==='choulue_use_target'?'视为使用最近记录的伤害牌，无花色、点数和实体素材，仍须满足合法目标与距离；此时不能退回赠牌取消。':'对方可交自己的手牌或装备，也可拒绝。仅对方选择其私有手牌；本次询问前可以取消。'}</p>${meta.recorded_card ? html`<small>当前公开记录：${meta.recorded_card}</small>` : null}</section>`;
  if (meta.equipment === '霹雳车') return html`<section className="response-context equipment-response-context" data-equipment-context="霹雳车"><strong>弃置${target}当前装备区内所有牌</strong><p>这次伤害已经实际造成。发动不额外伤害、不弃手牌或判定牌；装备先一并离场，再处理离场奖励。可放弃。</p><small>霹雳车必须仍由你装备且有效。其普通离场不销毁。</small></section>`;
  if (meta.material_zones && ['傲剑','神偷','红颜'].includes(meta.skill)) return html`<section className="response-context fourth-skill-context" data-skill-context=${meta.skill}><strong>${meta.skill} · ${meta.skill==='神偷'?'仅限梅花手牌（H）':meta.skill==='傲剑'?'仅限红色手牌或装备（H / E）':'手牌或装备（H / E）'}</strong><p>${meta.skill==='傲剑'?'转为普通杀，保留素材花色与点数；消耗武器或马后重新检查距离，仍受出杀次数限制。':meta.skill==='神偷'?'梅花装备与判定牌不能作材料。转为探囊取物，之后选择合法目标及手、装、判区域。':'选择两名其他男性完成决斗；判定牌不能作成本。'}取消不支付材料。</p></section>`;
  if (stage === 'global_rescue' || prompt.kind === 'rescue') return html`<section className="response-context rescue-context" aria-label="濒死救援状态">
    <div className="response-kicker">濒死求桃 · 轮到你回应</div>
    <strong>${responseSeatName(state, meta.dying_seat)}需要救援${Number.isFinite(meta.hp) ? ` · 当前体力 ${meta.hp}` : ''}</strong>
    <p>只会使用你选择的救援牌。桃可救他人；酒仅能自救。华佗的急救、英雄杀扁鹊的回春，只在技能拥有者的实际回合外，把红色手牌或装备当桃；自己的判定或反伤濒死也不能使用这两种回合外转化。</p><small>从当前回合主人起依次询问。每次回复后仍未脱离濒死，会继续询问；可放弃本次救援。</small>
  </section>`;
  if (meta.equipment === '孔雀翎') return html`<section className="response-context equipment-response-context"><strong>失去 1 点体力，可能进入濒死救援</strong><p>本回合所有杀伤害 +1。重复支付不叠加，与酒取较大值。取消不会扣体力。</p></section>`;
  if (meta.equipment === '护心镜') return html`<section className="response-context equipment-response-context"><strong>护心镜 · 按本次直接杀伤害扣减余量</strong><p>可选择抵挡；累计抵挡满 2 点后护心镜弃置，再从发动前的手牌中弃 1 张（若有）。不抵挡连环传导、锦囊或失去体力。</p></section>`;
  if (stage === 'nullification') return html`<section className="response-context counter-context" aria-label="无懈响应状态">
    <div className="response-kicker">锦囊响应 · 第 ${Number(meta.depth || 0) + 1} 层询问</div>
    <strong>${meta.card_name || '锦囊'} → ${target}</strong>
    <p className=${`counter-verdict ${meta.effect_active === false ? 'is-cancelled' : ''}`}>${meta.effect_active === false ? '当前效果已抵消；再出无懈可恢复效果' : '当前效果将生效；出无懈可抵消效果'}</p>
    <small>仅结算此目标。其他目标会分别询问；所有人放弃后，按最后状态结算。</small>
    ${WANGYUN_CARD_RULES[meta.card_name]?html`<details><summary>查看${meta.card_name}完整规则与来源</summary><${WangyunCardRules} card=${{name:meta.card_name}}/></details>`:null}
  </section>`;
  if (stage === 'fire_pay') return html`<section className="response-context fire-reveal" aria-label="火攻展示牌">
    ${revealed ? html`<div className="revealed-card"><${CardArt} card=${revealed} compact=${true} /><strong>${revealed.name}</strong><span>${SUIT[revealed.suit] || ''} ${revealed.suit} ${rankLabel(revealed)}</span></div>` : null}
    <div><strong>展示牌仍留在目标手中</strong><p>可弃一张${revealed?.suit || '同花色'}手牌，造成 1 点火焰伤害。${revealed?.suit ? '必须同花色，仅同颜色不算。' : ''}</p><small>放弃不会退还已使用的火攻。</small></div>
  </section>`;
  if (stage === 'fire_reveal') return html`<section className="response-context"><strong>选择一张手牌公开展示</strong><p>只公开这一张，展示不会弃掉或转移该牌。</p></section>`;
  if (stage === 'borrow_weapon' || stage === 'borrow_victim') return html`<section className="response-context" aria-label="借刀选择进度">
    <div className="response-kicker">借刀杀人 · 第 ${stage === 'borrow_weapon' ? '1' : '2'} / 2 步</div>
    <strong>${stage === 'borrow_weapon' ? '先选一位装备武器的其他角色' : `${responseSeatName(state, meta.weapon_holder_seat)} 持刀，接着选择杀的目标`}</strong>
    <p>持刀者须对第二名目标出杀，否则把武器交给你。完成目标选择前，可取消且不消耗牌。</p>
  </section>`;
  if (stage === 'iron_chain_mode') return html`<section className="response-context"><strong>切换连环，或重铸摸牌</strong><p>连环可选 1 至 2 人；重铸不选目标，置入弃牌堆后摸 1 张，不能被无懈响应。</p></section>`;
  if (stage === 'iron_chain_targets') return html`<section className="response-context" aria-label="连环目标进度"><strong>连环目标 ${(meta.selected_seats || []).length} / 2</strong><p>${(meta.selected_seats || []).length ? (meta.selected_seats || []).map(s => responseSeatName(state, s)).join('、') : '可选自己。选择一人后即可完成，也可再选一人。'}</p><small>逐个目标切换状态：已连环则解开，未连环则连起。</small></section>`;
  if (meta.equipment === '博浪锤') return html`<section className="response-context"><strong>弃两张牌，令这次杀继续造成伤害</strong><p>可选手牌或装备，不能选正在发动的武器本身。两张一起支付；取消不会消耗任何材料。</p></section>`;
  if (meta.equipment === '寒冰剑') return html`<section className="response-context"><strong>伤害与弃牌，选择其一</strong><p>发动寒冰剑会取消这次全部伤害，再依次弃目标至多两张手牌或装备。判定区不能选。</p></section>`;
  if (meta.equipment === '雌雄双股剑') return html`<section className="response-context"><strong>雌雄双股剑 · 杀指定异性角色</strong><p>目标弃一张手牌，或让攻击者摸一张。结算后仍可正常出闪。</p></section>`;
  return null;
}

/** Only explicit public cards and the local owner's legal materials are shown.
 * Raw response IDs are preserved; this view never reads another player's hand.
 */
export function CardResponseDialog({ state, prompt, onRespond }) {
  const [selected, setSelected] = useState([]);
  if (prompt.meta?.stage === 'sanjian_cost_target') return html`<${SanjianResponseDialog} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} />`;
  const meta = prompt.meta || {};
  const required = Math.max(0, Number(meta.select_count) || 0);
  const options = prompt.options || [];
  const materialOptions = options.filter(o => !CANCEL_IDS.has(o.id));
  const cancelOptions = options.filter(o => CANCEL_IDS.has(o.id));
  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(v => v !== id) : prev.length < required ? [...prev, id] : prev);
  return html`<div className="modal-mask"><div className="sgs-dialog card-response-dialog ${required ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${meta.stage || ''}>
    <p className="response-message">${prompt.message}</p>
    <${ResponseContext} state=${state} prompt=${prompt} />
    <${SgsFuliRescueContext} state=${state} prompt=${prompt} />
    ${required ? html`<div className="material-picker" role="group" aria-label=${`选择 ${required} 张材料`}>
      ${materialOptions.map(opt => html`<button key=${opt.id} type="button" className=${`btn material-option ${selected.includes(opt.id) ? 'is-selected' : ''}`} data-option-id=${opt.id} aria-pressed=${selected.includes(opt.id)} disabled=${!selected.includes(opt.id) && selected.length >= required} onClick=${() => toggle(opt.id)}>
        <span className="material-check" aria-hidden="true">${selected.includes(opt.id) ? '✓' : ''}</span><span>${opt.label}</span>
      </button>`)}
    </div><p className="material-progress" role="status" aria-live="polite">已选 ${selected.length} / ${required} 张，确认前不支付</p><div className="dialog-actions">
      <button type="button" className="btn primary" disabled=${selected.length !== required} data-confirm-materials="true" onClick=${() => onRespond(selected.join(meta.submit_join || ' '))}>确认弃 ${required} 张</button>
      ${cancelOptions.map(opt => html`<button key=${opt.id} type="button" className="btn" data-option-id=${opt.id} onClick=${() => onRespond(opt.id)}>${opt.label}</button>`)}
    </div>` : html`<div className="dialog-actions wrap">${options.map(opt => html`<button key=${opt.id} type="button" className=${`btn option ${CANCEL_IDS.has(opt.id) ? 'response-cancel' : ''}`} data-option-id=${opt.id} data-source-skill-id=${opt.skill_id || undefined} disabled=${!!opt.disabled} onClick=${() => onRespond(opt.id)}>${opt.label}</button>`)}</div>`}
  </div></div>`;
}

/** Public physical delayed cards live here; hidden hand data never enters it. */
export function PlayerCardStatus({ player }) {
  const chained = player.chained ?? player.marks?.chained;
  const skipDraw = player.skip_draw_stage ?? player.marks?.skip_draw_stage;
  const skipPlay = player.skip_play_stage ?? player.marks?.skip_play_stage;
  const judgments = Array.isArray(player.judgment_cards) ? player.judgment_cards : [];
  if (!chained && !skipDraw && !skipPlay && !judgments.length) return null;
  return html`<section className="player-card-status" aria-label=${`${player.name}的连环与判定状态`}>
    <div className="card-status-flags">
      ${chained ? html`<span className="chain-badge" title="火焰或雷电伤害会传导；普通伤害不传导"><svg viewBox="0 0 32 20" aria-hidden="true"><rect x="2" y="6" width="17" height="8" rx="4" transform="rotate(-28 10 10)"/><rect x="13" y="6" width="17" height="8" rx="4" transform="rotate(-28 21 10)"/></svg>已连环</span>` : null}
      ${skipDraw ? html`<span className="skip-draw-badge">本次跳过摸牌</span>` : null}
      ${skipPlay ? html`<span className="skip-play-badge">本次跳过出牌</span>` : null}
    </div>
    ${judgments.length ? html`<div className="judgment-zone" aria-label="判定区"><span className="judgment-zone-label">判定区</span>${judgments.map((card, index) => html`<details className="judgment-card" key=${`${card.name}-${index}`} onKeyDown=${e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary')?.focus(); } }}>
      <summary aria-label=${`${card.name}${card.converted && card.physical_name ? `，实体牌 ${card.physical_name}` : ""} ${card.suit || ''}${rankLabel(card)}，查看判定规则`}><span className="judgment-art"><${CardArt} card=${card} compact=${true} /></span><strong>${card.name}</strong><span className=${card.color === '红' ? 'red-suit' : ''}>${SUIT[card.suit] || ''} ${rankLabel(card)}</span></summary>
      ${card.converted && card.physical_name ? html`<p className="converted-card-source">实体牌：${card.physical_name} · 以${card.name}结算；${card.copy_source_skill === "奸雄" ? "CC5江湖适配：判定功能区内及合法延时传递保留复制功能，进入手牌、弃牌或牌堆才恢复素材印刷身份。" : "离开判定区后恢复原实体牌。"}</p>` : null}
      <p>${card.converted && card.name === "画地为牢" ? "下次判定阶段判定，非红桃则跳过整个出牌阶段。可被无懈抵消；离开后仍保留原实体牌身份。" : card.description || (card.name === '兵粮寸断' ? '下次判定阶段结算；非梅花则跳过一次摸牌，可在判定前被无懈抵消。' : '下次判定阶段结算。')}</p>
    </details>`)}</div>` : null}
  </section>`;
}

/** Public causal record only; never infer cards from another player's hand. */
export function LiuyeRecord({player}) {
  const record=player.liuye_last_damage_card;
  if (!record && player.hero?.id !== 'sgs.mobile.base.hero.liu-ye') return null;
  const nature=record?.sha_nature ? ({fire:'火焰',thunder:'雷电',normal:'普通'})[record.sha_nature] || record.sha_nature : null;
  const lineage=record?.source_game_lineage || {};
  return html`<details className="liuye-damage-record" data-liuye-record=${record?.card_rule_id || 'none'} onKeyDown=${event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}}}>
    <summary aria-label=${`筹略公开记录：${record?.card_name || '尚无记录'}${nature?`，${nature}属性`:''}，查看详情`}>筹略记录 · <strong>${record?.card_name || '尚无记录'}</strong>${nature?html`<span>${nature}</span>`:null}</summary>
    <div>${record?html`<div className="liuye-record-card"><${CardArt} card=${{name:record.card_name,type:record.card_type}} compact=${true} /><strong>${record.card_name}${nature?` · ${nature}`:''}</strong></div>`:null}
      <p>${record?'这是最近一次实际受到伤害所记录的基本牌或非延时锦囊，不代表持有该牌。之后收到符合条件的牌伤害才会更新；发动筹略不清空记录。':'尚未记录基本牌或非延时锦囊造成的实际伤害，筹略暂不能视为使用牌。'}</p>
      <p>出牌阶段开始可询问他人交 1 张手牌或装备。对方交牌后，按记录视为使用牌；无花色、点数和实体素材，目标仍须合法。</p>
      ${lineage.source_game?html`<small>记录来源：${Array.isArray(lineage.source_game)?lineage.source_game.join(' / '):lineage.source_game}${lineage.source_version?` · ${lineage.source_version}`:''}</small>`:null}
    </div>
  </details>`;
}
