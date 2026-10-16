import {SGS_CONFIRMED_SUPPORT_SKILL_ICONS,SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID,SgsConfirmedSupportPolicyGuide,SgsConfirmedSupportHpEvidence} from './sgs-confirmed-support-skill-ui.js';
import {SGS_OBLIGATION_IDENTITY_SKILL_ICONS,SGS_OBLIGATION_IDENTITY_HERO_SKILLS_BY_ID,SgsObligationIdentityPolicyGuide,SgsObligationIdentityHpEvidence} from './sgs-obligation-identity-skill-ui.js';
import {SGS_FUTURE_IDENTITY_SKILL_ICONS,SGS_FUTURE_IDENTITY_HERO_SKILLS_BY_ID,SgsFutureIdentityPolicyGuide,SgsFutureIdentityHpEvidence} from './sgs-future-identity-skill-ui.js';
import {SGS_IDENTITY_NEXT_SKILL_ICONS,SGS_IDENTITY_NEXT_HERO_SKILLS_BY_ID,SgsIdentityNextPolicyGuide,SgsIdentityNextHpEvidence} from './sgs-identity-next-skill-ui.js';
import {YXS_MODERN_SKILL_ICONS,YXS_MODERN_HERO_SKILLS_BY_ID,YxsModernPolicyGuide,YxsModernHpEvidence} from './yxs-modern-skill-ui.js';
import {SGS_ZHANGFEN_SKILL_ICONS,SGS_ZHANGFEN_HERO_SKILLS_BY_ID,SgsZhangfenPolicyGuide,SgsZhangfenHpEvidence} from './sgs-zhangfen-ui.js';
import {SGS_FOLLOWUP_SKILL_ICONS,SGS_FOLLOWUP_HERO_SKILLS_BY_ID,SgsFollowupPolicyGuide,SgsFollowupHpEvidence} from './sgs-followup-skill-ui.js';
import {SGS_YIJIANG_FURTHER_SKILL_ICONS,SGS_YIJIANG_FURTHER_HERO_SKILLS_BY_ID,SgsYijiangFurtherPolicyGuide,SgsYijiangFurtherHpEvidence} from './sgs-yijiang-further-skill-ui.js';
import {SGS_YIJIANG_MORE_SKILL_ICONS,SGS_YIJIANG_MORE_HERO_SKILLS_BY_ID,SgsYijiangMorePolicyGuide,SgsYijiangMoreHpEvidence} from './sgs-yijiang-more-skill-ui.js';
import {SGS_YIJIANG_LATER_SKILL_ICONS,SGS_YIJIANG_LATER_HERO_SKILLS_BY_ID,SgsYijiangLaterPolicyGuide,SgsYijiangLaterHpEvidence} from './sgs-yijiang-later-skill-ui.js';
import {SGS_YIJIANG_NEXT_SKILL_ICONS,SGS_YIJIANG_NEXT_HERO_SKILLS_BY_ID,SgsYijiangNextPolicyGuide,SgsYijiangNextHpEvidence} from './sgs-yijiang-next-skill-ui.js';
import {SGS_YIJIANG_FOLLOWING_SKILL_ICONS,SGS_YIJIANG_FOLLOWING_HERO_SKILLS_BY_ID,SgsYijiangFollowingPolicyGuide,SgsYijiangFollowingHpEvidence} from './sgs-yijiang-following-skill-ui.js';
import {SGS_YIJIANG_SKILL_ICONS,SGS_YIJIANG_HERO_SKILLS_BY_ID,SgsYijiangPolicyGuide,SgsYijiangHpEvidence} from './sgs-yijiang-skill-ui.js';
import {SGS_MOUNTAIN_SKILL_ICONS,SGS_MOUNTAIN_HERO_SKILLS_BY_ID,SgsMountainPolicyGuide,SgsMountainHpEvidence,sgsMountainSkillState} from './sgs-mountain-skill-ui.js';
import {SGS_FOREST_SKILL_ICONS,SGS_FOREST_HERO_SKILLS_BY_ID,SgsForestPolicyGuide,SgsForestHpEvidence} from './sgs-forest-skill-ui.js';
import {SGS_FIRE_SKILL_ICONS,SGS_FIRE_HERO_SKILLS_BY_ID,SgsFirePolicyGuide,SgsFireHpEvidence} from './sgs-fire-skill-ui.js';
import {WANGYUN_SKILL_ICONS} from './wangyun-skill-icons.js';
import {WANGYUN_PROMPT_CONTEXTS} from './wangyun-skill-catalog.js';
import {WangyunPolicyGuide,WangyunCardRules,WangyunDependenciesGuide,WANGYUN_CARD_RULES} from './wangyun-card-art.js';
import {CardArt} from './card-art.js';
import {SGS_NEXT_IDENTITY_SKILL_ICONS} from './sgs-next-identity-skill-icons.js';
import {SGS_WIND_SKILL_ICONS} from './sgs-wind-skill-icons.js';
import {SGS_FOLLOWING_SKILL_ICONS} from './sgs-following-skill-icons.js';
import {SGS_BASE_NEXT_SKILL_ICONS} from './sgs-base-next-skill-icons.js';
import {YXS_NINTH_SKILL_ICONS} from './yxs-ninth-skill-icons.js';
import {YXS_EIGHTH_SKILL_ICONS} from './yxs-eighth-skill-icons.js';
import {YXS_SEVENTH_SKILL_ICONS} from './yxs-seventh-skill-icons.js';
import {YXS_SIXTH_SKILL_ICONS} from './yxs-sixth-skill-icons.js';
import {YXS_FIFTH_SKILL_ICONS} from './yxs-fifth-skill-icons.js';
import {YXS_FOURTH_SKILL_ICONS} from './yxs-fourth-skill-icons.js';
import {YXS_THIRD_SKILL_ICONS} from './yxs-third-skill-icons.js';
import {YXS_NEXT_SKILL_ICONS} from './yxs-next-skill-catalog.js';
import React from 'react';
import {YXS_SKILL_ICONS} from './yxs-skill-catalog.js';
import { html } from 'htm/react';
import { SKILL_TYPES, skillsForHero, activeSkillMetadata } from './skill-catalog.js';
import { heroDisplayName } from './display-names.js';

/** Original 32 × 32 ink icons drawn here. No remote assets, emoji or icon font. */
export const SKILL_ICONS = Object.freeze({
  ...SGS_CONFIRMED_SUPPORT_SKILL_ICONS,
  ...SGS_OBLIGATION_IDENTITY_SKILL_ICONS,
  ...SGS_FUTURE_IDENTITY_SKILL_ICONS,
  ...SGS_IDENTITY_NEXT_SKILL_ICONS,
  ...YXS_MODERN_SKILL_ICONS,
  ...SGS_ZHANGFEN_SKILL_ICONS,
  ...SGS_FOLLOWUP_SKILL_ICONS,
  ...SGS_YIJIANG_FURTHER_SKILL_ICONS,
  ...SGS_YIJIANG_MORE_SKILL_ICONS,
  ...SGS_YIJIANG_LATER_SKILL_ICONS,
  ...SGS_YIJIANG_NEXT_SKILL_ICONS,
  ...SGS_YIJIANG_FOLLOWING_SKILL_ICONS,
  ...SGS_YIJIANG_SKILL_ICONS,
  ...SGS_MOUNTAIN_SKILL_ICONS,
  ...SGS_FOREST_SKILL_ICONS,
  ...SGS_FIRE_SKILL_ICONS,
  ...WANGYUN_SKILL_ICONS,
  ...YXS_SKILL_ICONS,
  ...YXS_NEXT_SKILL_ICONS,
  ...YXS_THIRD_SKILL_ICONS,
  ...YXS_FOURTH_SKILL_ICONS,
  ...YXS_FIFTH_SKILL_ICONS,
  ...YXS_SIXTH_SKILL_ICONS,
  ...YXS_SEVENTH_SKILL_ICONS,
  ...YXS_EIGHTH_SKILL_ICONS,
  ...YXS_NINTH_SKILL_ICONS,
  ...SGS_BASE_NEXT_SKILL_ICONS,
  ...SGS_FOLLOWING_SKILL_ICONS,
  ...SGS_WIND_SKILL_ICONS,
  ...SGS_NEXT_IDENTITY_SKILL_ICONS,
  crown: '<path d="M5 23 3 9l8 5 5-9 5 9 8-5-2 14Z"/><path d="M6 27h20M8 20h16"/>',
  tribute: '<path d="M6 6h14v19H6zM11 10h4M11 14h4M22 4h4v14M18 24h11m-4-4 4 4-4 4"/>',
  axe: '<path d="m9 28 11-24M16 9q-10-2-12 7l9 4M21 6q10 2 7 13l-10-5"/>',
  strike: '<path d="m6 26 18-20 4-2-1 6L10 29ZM7 20l7 6M4 14l5-3m11 14 5-1M15 4l-2 5"/>',
  fan: '<path d="M16 27 3 12Q16-3 29 12ZM16 27 9 8m7 19V5m0 22 7-19M13 28h6"/>',
  brush: '<path d="m11 20 12-16 4 3-12 16M11 20q-8 1-7 9 9 0 11-6ZM19 6l5 4M20 26h8"/>',
  seal: '<path d="M7 18h18v9H7zM10 18v-4h12v4M13 14V8q3-6 6 0v6M11 23h10M4 29h24"/>',
  peach: '<path d="M16 12C5 5-2 24 16 29 34 24 27 5 16 12ZM16 12q-4 7 0 16M16 10q3-7 11-6-1 7-11 6Z"/>',
  exchange: '<path d="M4 7h12v17H4zM17 10h11v17H17M8 11h4M21 23h3M18 3h9l-3 3M14 29H5l3-3"/>',
  scepter: '<path d="m8 28 12-19M18 5l5-2 6 6-3 5-8-9ZM4 17h11M7 14l-3 3 3 3M9 25l4 3"/>',
  coin: '<circle cx="17" cy="16" r="10"/><path d="M14 13h6v6h-6zM4 5v7m-3-3h6M24 3l3 3M4 26l3 3"/>',
  arrows: '<path d="M8 28V8m-4 4 4-7 4 7M16 28V5m-4 4 4-7 4 7M24 28V8m-4 4 4-7 4 7M5 23l3 3 3-3m2 0 3 3 3-3m2 0 3 3 3-3"/>',
  herb: '<path d="M16 29V8M16 20Q3 22 4 12q10-2 12 8ZM16 13Q27 15 28 4q-12 0-12 9ZM7 28h18"/>',
  vial: '<path d="M11 3h10v4h-3v7l8 11q2 4-3 4H9q-5 0-3-4l8-11V7h-3ZM9 21h14M13 25h6"/>',
  dagger: '<path d="m12 22 2-12L25 3l-2 13-7 9ZM10 19l9 9M5 28l7-6M3 9h6M6 6v6"/>',
  blades: '<path d="m5 4 4 2 15 19-3 2L6 10ZM27 4l-4 2L8 25l3 2L26 10ZM18 26l7-6M7 20l7 6"/>',
  banner: '<path d="M8 30V3M9 5h19l-5 7 5 7H9M4 29h9M13 9h7m-7 5h5"/>',
  gate: '<path d="M4 28V11h24v17M2 11l4-7h20l4 7M11 28V17q5-6 10 0v11M8 7h16M16 18v9"/>',
  hatchet: '<path d="M11 29 18 4M14 10 6 6 2 19l10 2M21 7l8 6-7 9-5-6M8 25l6 2"/>',
  ribbon: '<path d="M16 15Q1 2 4 16q2 7 12-1Q31 2 28 16q-2 7-12-1ZM14 17q-2 10-10 10M18 17q2 10 10 10"/>',
  bloom: '<path d="M16 12Q7-1 8 13-6 12 8 21 5 34 16 24q11 10 8-3 14-9 0-8 1-14-8-1Z"/><circle cx="16" cy="18" r="4"/>',
  moon: '<path d="M24 4A13 13 0 1 0 28 23 12 12 0 0 1 24 4ZM6 17l6 4M21 10h7m-3-3v6"/>',
  shield: '<path d="m16 3 12 5v11q-3 7-12 11Q7 26 4 19V8ZM16 8v16M10 15l6 5 7-9"/>',
  crossed: '<path d="M5 7h23l-5-4M28 7l-5 4M27 25H4l5 4M4 25l5-4M10 13l12 6m0-6-12 6"/>',
  spear: '<path d="M7 29 21 9M17 12 23 2l5 3-7 10ZM12 17q-5-6-9 0 7-1 9 5M7 25l4 3"/>',
  grain: '<path d="M16 29V6M16 13Q8 12 8 5q8 0 8 8ZM16 19Q25 17 25 10q-9 1-9 9ZM16 25Q7 23 7 16q9 1 9 9M11 29h10"/>',
  swap: '<path d="M3 12h22l-5-5M25 12l-5 5M29 22H7l5-5M7 22l5 5M5 4h8M19 29h8"/>',
  hook: '<path d="M7 3q16 0 16 9v9q0 11-11 7-6-2-4-10l5 5M7 3v7M4 6l3 4 3-4M18 9h10"/>',
  trail: '<path d="M3 25q13 4 11-5T26 9M22 5l5 4-4 4M6 8l3-4 3 4-3 6ZM19 26h9"/>',
  mask: '<path d="M3 8q13 6 26 0v8q-2 11-13 14Q5 27 3 16ZM7 15q4-3 7 0m4 0q4-3 7 0M12 23q4 3 8 0"/>',
  crescent: '<path d="M9 29 23 5M19 4q-9-3-11 5 8-4 11 4l6-6-6-3ZM13 21l5 3M6 28l6 2"/>',
  roar: '<path d="m7 7 5-4 4 4 5-4 5 6-2 13-8 8-9-8ZM10 12l3 2m9-2-3 2M10 19q6-6 12 0l-3 5h-6ZM3 12l-2 8m28-7 2 8"/>',
  raid: '<path d="M4 25 25 4l3 3L7 28ZM4 16l12 12M18 6l9 9M7 4l6 2-4 5-4-2ZM22 23h7m-3-3v7"/>',
  wound: '<path d="M8 4h15l5 7-3 17H8L4 11ZM9 9l15 13M23 9 9 22M13 15h7M15 5l-2 5m6 13 2 4"/>',
  discipline: '<path d="M5 4h11v22H5zM17 7h10v22H16M9 9h3m-3 5h3m-3 5h3M21 12v10m-3-5 3 5 4-7"/>',
  barearm: '<path d="m3 23 5-11 6 1 1 5 6-1 3-8 5 2-2 13-8 5-11-1ZM9 12l2-7 6 2-1 6M5 22h8m8-1 4-2"/>',
  retaliate: '<path d="M4 10q9-12 20-2l4 5M28 5v8h-8M28 23q-9 12-20 2l-4-5M4 28v-8h8M12 10l8 13m0-13-8 13"/>',
  insight: '<path d="M4 25V8q6-4 12 0 6-4 12 0v17q-6-4-12 0-6-4-12 0ZM16 8v17M8 12h4m-4 5h4m8-5h4m-4 5h4M13 2h6"/>',
  astrolabe: '<circle cx="16" cy="16" r="11"/><ellipse cx="16" cy="16" rx="5" ry="11"/><path d="M5 16h22M16 2v3m0 22v3M2 16h3m22 0h3M8 8l4 4m8 8 4 4"/><circle cx="16" cy="16" r="2"/>',
  dragonheart: '<path d="M5 25 23 7m-4-3 9-1-1 9M6 9q8-9 15-2M25 23q-8 9-15 2M10 5l-5 4 6 3M22 27l4-4-6-3"/><path d="m12 19 7-7M4 27l3 1"/>',
  rider: '<path d="m4 25 4-11 8-3 5-7 5 3 2 8-6 1-2 7H9l-2 6M19 23l5 6M10 14l2-7-5-3M3 20h7M15 23v6"/><circle cx="23" cy="10" r="1"/>',
  hoof: '<path d="M7 4 5 16q0 13 11 13t11-13L25 4h-6l2 13q0 6-5 6t-5-6l2-13ZM6 11h5m10 0h5M6 18l5 1m10 0 5-1M9 25l3-4m8 0 3 4"/>',
  silkcrest: '<path d="M5 27h22M8 25V12l8-8 8 8v13M12 25V14h8v11M16 4V1M6 14l-3 6m23-6 3 6M10 10l6 3 6-3"/><path d="M13 18h6m-6 4h6"/>',
  suitsecret: '<path d="M4 7h16v21H4zM11 7V3h17v21h-8M9 15q-3-5-5 0 0 3 5 6 5-3 5-6-2-5-5 0Z"/><path d="m23 8 3 4-3 4-3-4Z"/>',
  constellation: '<path d="m6 8 8-4 5 8 8 3-6 9-10 3-5-10Z M14 4l-3 23m8-15-13 5m13-5 2 12"/><circle cx="6" cy="8" r="2"/><circle cx="14" cy="4" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="27" cy="15" r="2"/><circle cx="21" cy="24" r="2"/><circle cx="11" cy="27" r="2"/><circle cx="6" cy="17" r="2"/>',
  silentcitadel: '<path d="M3 28h26M6 28V13h20v15M3 13l5-7h16l5 7M11 28V18h10v10M16 19v8M8 6V3m16 3V3M1 22h4m22 0h4M11 10h10"/>',

});
export function SkillIcon({ icon, className = '' }) {
  return html`<svg className=${`skill-icon ${className}`} data-skill-icon=${icon} viewBox="0 0 32 32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML=${{ __html: SKILL_ICONS[icon] || SKILL_ICONS.seal }} />`;
}
const SELF_SEATS = new Set(['player', 'p1']);
export function isSelfSeat(seat, self) { return !seat || seat === self?.seat || (SELF_SEATS.has(seat) && SELF_SEATS.has(self?.seat)); }
export function skillAvailability(raw, state, prompt, busy = false) {
  const unavailable = (status, reason) => ({ status, available: false, reason });
  if (!state || ['finished', 'ended'].includes(state.phase) || state.winner) return unavailable('ended', '对局已结束');
  const self = state.players?.self;
  if (!self?.alive) return unavailable('condition', '当前已退场或正在濒死结算');
  if (!isSelfSeat(state.turn_actor, self)) return unavailable('not_turn', '非自己回合，只能在自己的出牌阶段发动');
  if (state.turn_phase === 'prepare') return unavailable('waiting', ['观星','占卜','玉步'].includes(prompt?.meta?.skill) ? `准备阶段：请先完成${prompt.meta.skill}` : '准备阶段尚未结束，请等待出牌阶段');
  if (busy || !prompt) return unavailable('waiting', '正在结算，请等待下一个出牌提示');
  if (prompt.kind !== 'play_card' || !isSelfSeat(prompt.player_id, self)) return unavailable('waiting', '请先完成当前响应、选择或弃牌');
  if (state.turn_phase && state.turn_phase !== 'play') return unavailable('waiting', '尚未进入自己的出牌阶段');
  if (raw?.availability) return raw.availability;
  // Compatibility for older DTO consumers/test fixtures, not an engine rule gate.
  if (self.skills_used?.includes(raw?.id || raw?.label) || ((raw?.id || raw?.label) === '诗仙' && self.marks?.shixian)) return unavailable('used', '本回合已使用，下一回合刷新');
  return { status: 'ready', available: true, reason: '出牌阶段可发动，具体条件见技能说明' };
}
export const AVAILABILITY_LABELS = Object.freeze({ ready: '可发动', condition: '条件未满足', used: '次数已用完', not_turn: '非自己回合', waiting: '等待结算', ended: '对局结束' });

export function SkillStatus({ availability, id }) {
  if (!availability) return null;
  return html`<div className=${`skill-status is-${availability.status}`} id=${id}>
    <span className="skill-status__label">${AVAILABILITY_LABELS[availability.status] || '暂不可用'}</span>
    <span className="skill-status__reason">${availability.reason}</span>
  </div>`;
}
function closeOnEscape(event) {
  if (event.key !== 'Escape') return;
  const details = event.currentTarget;
  if (details.open) { details.open = false; details.querySelector(':scope > summary')?.focus(); event.stopPropagation(); }
}
export function SkillCard({ skill, availability = null, providerState = null }) {
  const type = skill.awakening ? {label:'觉醒',hint:'满足条件后自动觉醒，整局只执行一次；没有主动发动按钮'} : SKILL_TYPES[skill.type];
  return html`<details className=${`hero-skill-card type-${skill.type}`} data-skill-id=${skill.id} onKeyDown=${closeOnEscape}>
    <summary aria-label=${`${skill.name}，${type.label}，查看技能说明`}>
      <${SkillIcon} icon=${skill.icon} />
      <span className="hero-skill-card__heading"><span className="hero-skill-card__title"><strong>${skill.name}</strong>${skill.acquired?html`<small className="skill-acquired-label">觉醒获得</small>`:null}${providerState?html`<small className="skill-acquired-label" data-general-skill-state=${providerState.status}>${providerState.label}</small>`:null}<span className=${`skill-type type-${skill.type}`}>${type.label}</span></span><span className="hero-skill-card__summary">${skill.summary}</span>${availability ? html`<span className=${`skill-card-status is-${availability.status}`}><span>${AVAILABILITY_LABELS[availability.status]}</span> · ${availability.reason}</span>` : null}</span>
      <span className="skill-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div className="hero-skill-card__details">
      <p className="skill-type-help">${type.hint}</p>
      <dl>${skill.condition ? html`<dt key="condition-label">条件</dt><dd key="condition-value">${skill.condition}</dd>` : null}<dt>时机</dt><dd>${skill.timing}</dd><dt>代价</dt><dd>${skill.cost}</dd><dt>次数</dt><dd>${skill.limit}</dd><dt>效果</dt><dd>${skill.effect}</dd>${skill.targets ? html`<dt key="targets-label">目标</dt><dd key="targets-value">${skill.targets}</dd>` : null}${skill.phase_use ? html`<dt key="phase-use-label">出牌阶段</dt><dd key="phase-use-value">${skill.phase_use}</dd>` : null}${skill.response ? html`<dt key="response-label">响应</dt><dd key="response-value">${skill.response}</dd>` : null}${skill.disabled_reason ? html`<dt key="disabled-label">不可发动</dt><dd key="disabled-value">${skill.disabled_reason}</dd>` : null}</dl>
      ${skill.notes.length ? html`<ul>${skill.notes.map((note, i) => html`<li key=${i}>${note}</li>`)}</ul>` : null}
      ${availability?.targets?.length ? html`<div className="skill-target-hints"><strong>当前目标检查</strong>${availability.targets.map(t => html`<p key=${t.seat}>${t.name} · ${t.hero}：${t.reason || t.note || '满足目标条件'}</p>`)}</div>` : null}
      <p className="skill-rule-source">本作当前规则 · 点击标题收起 / Esc 关闭</p>
    </div>
  </details>`;
}
export function HeroProvenance({ hero }) {
  if (!hero?.source_variant) return null;
  const original = hero.source_variant === 'jianghu-classic';
  const testing = ['testing', 'testing-local'].includes(hero.production_integration_status);
  const historicalReconstruction = hero.production_integration_status === 'integrated-tested-historical-reconstruction';
  const sources = (hero.source_urls || []).filter(url => /^https:\/\//.test(url));
  return html`<details className="hero-provenance" onKeyDown=${closeOnEscape} data-hero-provenance=${hero.id || hero.name}>
    <summary>${original ? '原创江湖规则' : '江湖适配'} · ${hero.faction ? `${hero.faction} · ` : ''}来源与规则差异</summary>
    <div className="hero-provenance__details">
      ${hero.identity_note ? html`<p className="hero-identity-note"><strong>${heroDisplayName(hero)}</strong> · ${hero.identity_note}</p>` : null}
      ${hero.aliases?.length ? html`<p className="hero-source-aliases">曾用名 / 合并来源：${hero.aliases.join('、')}</p>` : null}
      ${hero.source_character_name && !original ? html`<p className="hero-source-character">技能来源人物：${hero.source_label || '三国杀'}${hero.source_character_name} · ${hero.skill_name}</p>` : null}
      <p>${historicalReconstruction ? '2023历史核心＋JH01–JH12江湖规则重建，已接入并测试；2026当前客户端与12项原生边界未全面核验。本历史重建尚未计入来源覆盖，不代表完整原版模式完成。' : hero.production_integration_status === 'pending' ? '历史来源与完整技能说明已录入；生产对局整合仍待验收，当前为私有开发预览。' : testing ? '完整核心技能正在本地整合测试；生产对局仍待验收，尚未计入来源覆盖，当前为私有开发预览。' : original ? '此角色使用本作原有自定义技能，不计入英雄杀或三国杀原作角色覆盖。' : hero.source_variant.startsWith('jianghu-adapted:') ? '技能参考移动版基础角色页，体力参考 OL 标准资料，按本作 1v1 / 1v2、卡牌、防具和自救流程适配。不是完整三国杀复刻。' : '按所列来源版本接入完整核心技能，单机目标与响应规则的适配差异见下方说明。'}</p>
      <p className="hero-adaptation-note">${hero.adaptation_notes || '具体时机与效果以本作技能说明为准。'}</p>
      ${Object.hasOwn(SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsConfirmedSupportHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_OBLIGATION_IDENTITY_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsObligationIdentityHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_FUTURE_IDENTITY_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFutureIdentityHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_IDENTITY_NEXT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsIdentityNextHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_ZHANGFEN_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsZhangfenHpEvidence} hero=${hero} />`:Object.hasOwn(YXS_MODERN_HERO_SKILLS_BY_ID,hero.id)?html`<${YxsModernHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_FOLLOWUP_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFollowupHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_FURTHER_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangFurtherHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_MORE_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangMoreHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_LATER_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangLaterHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_NEXT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangNextHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_FOLLOWING_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangFollowingHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_YIJIANG_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_MOUNTAIN_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsMountainHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_FOREST_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsForestHpEvidence} hero=${hero} />`:Object.hasOwn(SGS_FIRE_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFireHpEvidence} hero=${hero} />`:hero.hp_evidence?.display_note ? html`<p className="hero-hp-evidence">${hero.hp_evidence.display_note}</p>` : hero.hp_evidence?.official_cross_product ? html`<p className="hero-hp-evidence">体力依据：官方OL${hero.hp_evidence.official_cross_product.extend || '标准'}名册对应 ${hero.hp_evidence.official_cross_product.gid} 号武将的 hp=${hero.hp_evidence.value}，移动版BWIKI交叉印证；这是跨产品官方资料与手游社区佐证，移动版详情页无体力字段，未实测当前客户端体力。</p>` : hero.hp_evidence ? html`<p className="hero-hp-evidence">体力依据：官方桌面版 ${hero.desktop_date?.year_month?.slice(0,4) || '2012'} 年血量标记 ${hero.hp_evidence.official_desktop_blood_span_count} 枚；手游正文未另写数字体力。</p>` : null}
      ${hero.source_date ? html`<p className="hero-source-date">历史资料日期：${hero.source_date}${hero.current_client_rules_verified === false ? '；未核验2026当前客户端全细则。' : ''}</p>` : null}
      ${hero.source_identity_context ? html`<p className="hero-source-mode">来源身份：${hero.source_identity_context.faction}；${hero.source_identity_context.lord_skill_from_shared_mode ? `${hero.source_identity_context.lord_skill_from_shared_mode}与主公体力加成由身份模式授予，不属于个人完整技能组。` : '保留完整基础身份技能组；此人物没有个人主公技，固有体力不含模式加成。'}当前1v1/1v2无此身份模式。</p>` : null}
      ${hero.source_unknowns?.length ? html`<details className="hero-source-unknowns"><summary>历史来源未明确的边界</summary><ul>${hero.source_unknowns.map((item,index)=>html`<li key=${typeof item==='string'?index:item.field||item.id||index}>${typeof item==='string'?item:item.handling||item.detail||item.reason}</li>`)}</ul></details>` : null}
      ${hero.source_evidence_tiers?.length ? html`<p className="hero-source-tiers">资料分层：${hero.source_evidence_note || '当前大陆目录确认基础身份技能；OL名册为跨产品体力依据，BWIKI为手游社区佐证。2021台湾FAQ仅作历史跨产品参考，历史规则镜像为次级资料；不同产品、时代与模式不混作当前客户端实测。'}</p>` : null}
      <p className="hero-source-variant">资料版本：${hero.source_variant}</p>
      ${sources.length ? html`<p className="hero-source-links">${sources.map((url, i) => html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${hero.id==='sgs.adapted.base.hero.li-ru'&&url.includes('/pc/news-detail-98.html')?'所选历史修订：2015-12-01':hero.id==='sgs.mobile.hero.wangyun.20231207' ? (url.includes('guide-info-163')?'历史官方：王允攻略（2023-12-07）':url.includes('guide-info-160')?'历史官方：基础/军争牌堆（2023-12-07）':url.includes('hero-detail-213')?'当前公开网页：王允身份条目':url.includes('wiki.biligame.com')?'次级佐证：移动BWIKI身份字段':`分级规则参考 ${i+1}`) : hero.source_evidence_tiers?.length ? url.includes('sanguosha.com.tw') ? '历史跨产品：台湾标准FAQ（2021）' : url.includes('wiki.biligame.com') ? '次级佐证：移动版BWIKI' : url.includes('sanguosha.cn/pc/guide-info-') ? '历史官方：大陆移动版人物攻略' : url.includes('sanguosha.cn') ? '当前目录：大陆移动版基础页' : url==='https://www.sanguosha.com/hero' ? '跨产品体力：官方OL标准名册' : url.includes('gltjk.com') ? '次级资料：历史规则镜像' : url.includes('sanguosha.com/news') ? '历史官方OL资料' : `分级规则参考 ${i+1}` : url.includes('sanguosha.cn') ? '技能资料：移动版基础页' : url.includes('sanguosha.com') ? /\/hero\/\d+/.test(url) ? '技能对照：OL 标准页' : '体力资料：OL 标准名册' : `规则来源 ${i + 1}`}</a>`)}</p>` : null}
      ${hero.id==='sgs.mobile.hero.wangyun.20231207'?html`<${WangyunPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_MOUNTAIN_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsMountainPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_CONFIRMED_SUPPORT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsConfirmedSupportPolicyGuide} hero=${hero} />`:null}
      ${Object.hasOwn(SGS_OBLIGATION_IDENTITY_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsObligationIdentityPolicyGuide} hero=${hero} />`:null}
      ${Object.hasOwn(SGS_FUTURE_IDENTITY_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFutureIdentityPolicyGuide} hero=${hero} />`:null}
      ${Object.hasOwn(SGS_IDENTITY_NEXT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsIdentityNextPolicyGuide} hero=${hero} />`:null}
      ${Object.hasOwn(YXS_MODERN_HERO_SKILLS_BY_ID,hero.id)?html`<${YxsModernPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_ZHANGFEN_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsZhangfenPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_FOLLOWUP_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFollowupPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_FURTHER_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangFurtherPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_MORE_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangMorePolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_LATER_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangLaterPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_NEXT_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangNextPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_YIJIANG_FOLLOWING_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsYijiangFollowingPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_FOREST_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsForestPolicyGuide} />`:null}
      ${Object.hasOwn(SGS_FIRE_HERO_SKILLS_BY_ID,hero.id)?html`<${SgsFirePolicyGuide} />`:null}
      ${!original ? html`<p>新增立绘与技能图标为本作原创绘制。</p>` : null}
    </div>
  </details>`;
}

export function HeroSkills({ hero, player = null, state = null, prompt = null, busy = false, self = false, compact = false }) {
  const skills = skillsForHero(hero,{current:Boolean(player)});
  if (!skills.length) return html`<p>${hero?.skill_desc || '暂无技能说明'}</p>`;
  const content = html`<div className="hero-skills__cards">${skills.map(skill => {
    const raw = state?.active_skills?.find(s => (s.id || s.label) === skill.activeId);
    const providerState=Object.hasOwn(SGS_MOUNTAIN_HERO_SKILLS_BY_ID,hero?.id)?sgsMountainSkillState(skill,player):null;
    const availability=self&&skill.activeId?(providerState&&!providerState.available?{status:'condition',available:false,reason:providerState.label}:skillAvailability(raw,state,prompt,busy)):null;
    return html`<${SkillCard} key=${skill.id} skill=${skill} providerState=${providerState} availability=${availability} />`;
  })}</div>`;
  if (compact) return html`<details className="opponent-skill-inspector" onKeyDown=${closeOnEscape}>
    <summary aria-label=${`查看${heroDisplayName(hero)}的技能`}>查看技能 <span>${skills.map(s => SKILL_TYPES[s.type].label).filter((v, i, a) => a.indexOf(v) === i).join(' / ')}</span></summary>
    ${content}
    <${HeroProvenance} hero=${hero} />
  </details>`;
  const idleControls = self && prompt?.kind !== 'play_card'
    ? (state?.active_skills || []).map(raw => html`<${ActiveSkillButton} key=${raw.id} skill=${raw} hero=${hero}
        availability=${skillAvailability(raw, state, prompt, busy)} reasonPrefix="idle-skill" />`) : null;
  return html`<section className="hero-skills" aria-label=${`${heroDisplayName(hero)}的技能`}><div className="hero-skills__heading"><h3>技能</h3><span>点击展开完整规则</span></div>${content}<${HeroProvenance} hero=${hero} />${hero?.id==='sgs.mobile.hero.wangyun.20231207'?html`<${WangyunDependenciesGuide} />`:null}${idleControls?.length ? html`<div className="idle-skill-actions">${idleControls}</div>` : null}</section>`;
}
export function ActiveSkillButton({ skill, hero = null, availability, selected, onActivate, reasonPrefix = 'active-skill-reason' }) {
  const metadata = activeSkillMetadata(skill.id || skill.label, hero);
  const id = `${reasonPrefix}-${metadata?.id || skill.hotkey}`;
  return html`<div className="active-skill-control" data-active-skill=${skill.id || skill.label} data-skill-state=${availability.status}>
    <button type="button" className=${`skill-seal ${selected ? 'on' : ''}`} disabled=${!availability.available}
      aria-label=${skill.label || skill.id} aria-describedby=${id} aria-pressed=${!!selected}
      onClick=${() => { if (availability.available && onActivate) onActivate(skill); }}>
      <${SkillIcon} icon=${metadata?.icon || 'seal'} /><span>${skill.label || skill.id}</span>${['治愈','烽火','侠胆','迁都','易装','奸雄','离间','结姻','青囊','强袭','连计','矜功','sgs.quhu','sgs.tianyi','sgs.duanliang','sgs.shuangxiong'].includes(skill.id)?html`<kbd className="skill-shortcut">${skill.hotkey?.toUpperCase()}</kbd>`:null}
    </button>
    <${SkillStatus} availability=${availability} id=${id} />
    ${metadata?.source_skill_id==='yxs.jianxiong'?html`<small className="converted-card-source" data-jianxiong-available-copy=${availability.copyable_card?.name || ''}>当前可复制功能：${availability.copyable_card?.name || '暂无可用前牌'} · 素材：1张手牌或装备 · 每回合1次</small>`:null}
  </div>`;
}

/** Public DTO only: never reconstruct another seat's hand or private choices. */
export function GuardStatus({player}) {
  if (!player?.alive) return null;
  const protection=player.yxs_guard?.protects;
  const guards=Array.isArray(player.yxs_guard?.protected_by)?player.yxs_guard.protected_by:[];
  const control=player.yxs_kongju;
  if(!protection&&!guards.length&&!control)return null;
  const effectLabels={snatch:'探囊取物',dismantle:'釜底抽薪',prison:'画地为牢'};
  const immune=(control?.immune_effect_ids||[]).filter(id=>Object.hasOwn(effectLabels,id)).map(id=>effectLabels[id]);
  return html`<section className="player-card-status sixth-guard-status" data-guard-status=${player.seat || player.id} aria-label=${`${player.name}的门神与控局状态`}>
    <div className="card-status-flags">
      ${protection?html`<span className="chip" data-guard-protects=${protection.target_id} title="直到自己的下次回合开始；杀/决斗改为守护者响应，自守无重定向效果">门神守护：${protection.target_name || protection.target_id} · 至下回合开始</span>`:null}
      ${guards.map(guard=>html`<span key=${guard.guard_id} className="chip" data-guarded-by=${guard.guard_id} title="仅杀/决斗目标重定向，不拦范围锦囊或伤害传导">受${guard.guard_name || guard.guard_id}门神保护</span>`)}
      ${control?html`<span className="chip" data-kongju-counts=${`${control.hand_count}/${control.max_hp}`} title="比较手牌数与有效体力上限；不是当前血量或普通手牌上限">控局：手牌 ${control.hand_count} / 体力上限 ${control.max_hp}</span>`:null}
    </div>
    ${control?html`<small data-kongju-immunity=${immune.length?'active':'none'}>${immune.length?`不能成为${immune.join('、')}的目标`:'当前三种锦囊均无控局目标免疫'}；${control.skip_discard_eligible?'当前满足跳弃条件，弃牌入口可选择':'当前不满足跳弃条件，弃牌入口再检查'}。</small>`:null}
  </section>`;
}

export const GUARD_PROMPT_STAGES=Object.freeze(['fanji_material','menshen_target','kongju_discard']);
/** Current callback identity, never the selected hero's display name. */
export function GuardResponseContext({state,prompt}) {
  const meta=prompt?.meta||{},stage=meta.stage;
  const expected={fanji_material:'yxs.fanji',menshen_target:'yxs.menshen',kongju_discard:'yxs.kongju'};
  if(!Object.hasOwn(expected,stage)||meta.skill_id!==expected[stage])return null;
  if((meta.private_to&&!isSelfSeat(meta.private_to,state?.players?.self))||(prompt.player_id&&!isSelfSeat(prompt.player_id,state?.players?.self)))return null;
  const target=state?.players?.[meta.target_id];
  const source=target?heroDisplayName(target.hero)||target.name:meta.target_id||'实际伤害来源';
  const records={
    fanji_material:['反击',`受伤及救援已结束 · 对${source}出杀`,'每次伤害事件最多一张杀；两点伤害也只反击一次。可选合法杀或转换素材，取消不扣牌。红色反击禁止闪，但防具、沉鱼、曼舞仍正常结算。','历史文字解释：不检查主动杀距离、不占主动杀额度。反击先结算，再处理补刀。'],
    menshen_target:['门神','结束阶段 · 正常弃牌已经结束','任选一名存活角色，包括敌方、队友和自己。其杀/决斗目标改为你，直到自己下次回合开始；自守无重定向效果。可取消。','这是卡牌目标重定向，只有最终目标响应；不拦范围锦囊与连环伤害。'],
    kongju_discard:['控局',`弃牌入口快照 · 手牌 ${meta.hand_at_entry} / 体力上限 ${meta.max_hp_at_entry}`,'手牌不大于有效体力上限，可以选择跳过本次普通弃牌。取消则按普通当前血量上限及装备修正弃足。','历史文字解释：只检查这次入口快照，不在普通弃牌中途达到体力上限时重新申请。目标免疫是独立锁定效果。'],
  };
  const [skill,title,description,note]=records[stage];
  return html`<section className="response-context sixth-skill-context" data-skill-context=${skill} data-source-skill-id=${meta.skill_id} data-response-stage=${stage}><div className="response-kicker">${skill} · 可选触发</div><strong>${title}</strong><p>${description}</p><small>${note}</small></section>`;
}

/** Seventh-packet public state; never inspect game snapshots or opposing hands. */
export function XiadanStatus({player}) {
  const effect=player?.xiadan;
  if(!player?.alive||!effect||(!effect.won&&!effect.lost))return null;
  const allowance=effect.sha_limit===null?'无限':String(effect.sha_limit??'—');
  return html`<section className="player-card-status seventh-xiadan-status" data-xiadan-status=${player.seat} aria-label=${`${player.name}的侠胆状态`}>
    <div className="card-status-flags">
      ${effect.lost?html`<span className="chip" data-xiadan-loss="true">侠胆未赢 · 本回合不能使用杀</span>`:html`<span className="chip" data-xiadan-win="true">侠胆获胜</span>`}
      <span className="chip" data-xiadan-quota=${`${effect.sha_used??0}/${allowance}`}>已用杀 ${effect.sha_used??0} / 总许可 ${allowance}</span>
      ${effect.won?html`<span className="chip" data-xiadan-targets=${effect.sha_targets}>每杀至多 ${effect.sha_targets} 个目标${effect.sha_infinite_range?' · 杀范围无限':''}</span>`:null}
    </div>
    <small>${effect.lost?'禁令优先于胜利和无限杀；决斗、烽火等纯杀响应仍可。':'重复胜利不增加额度，不刷新已用杀；其他目标禁制仍有效。'} 回合结束或中止时消失。</small>
  </section>`;
}
const canonicalSeat=id=>({player:'p1',ai:'p2',ai2:'p3'}[id]||id);
export function publicSeatPlayers(state) {
  const all=[state?.players?.self,...(state?.players?.opponents||[]),...Object.values(state?.players||{}).filter(p=>p&&!Array.isArray(p))];
  return (state?.seat_order||[]).map(id=>all.find(p=>canonicalSeat(p.seat)===canonicalSeat(id))).filter(Boolean);
}
export function SeatOrderStatus({state}) {
  const ordered=publicSeatPlayers(state);
  if(!ordered.length)return null;
  const actor=ordered.find(p=>canonicalSeat(p.seat)===canonicalSeat(state.turn_actor));
  return html`<section className="player-card-status seat-order-status" aria-label="当前逆时针座次" data-seat-order=${state.seat_order.join(',')}>
    <strong>当前座次 · 逆时针</strong><div className="card-status-flags">${ordered.map((p,i)=>html`<span key=${p.seat} className="chip" data-seat-player=${canonicalSeat(p.seat)} aria-current=${actor===p?'step':undefined}>${i+1} · ${heroDisplayName(p.hero)||p.name}${!p.alive?'（退场）':''}${actor===p?'（当前行动）':''}</span>`)}</div>
    <small>迁都只交换座次，控制的人物与手牌不变；当前回合继续，从新位置续行。</small>
  </section>`;
}
export const SEVENTH_PROMPT_STAGES=Object.freeze(['xiadan_target','pindian_private_card','qiandu_cost','qiandu_target','extra_targets']);
export const isSeventhPrompt=prompt=>SEVENTH_PROMPT_STAGES.includes(prompt?.meta?.stage)&&(prompt.meta.stage!=='extra_targets'||prompt.meta.skill==='侠胆');
export function SeventhResponseContext({state,prompt}) {
  const meta=prompt?.meta||{},stage=meta.stage;
  if(!isSeventhPrompt(prompt))return null;
  if((meta.private_to&&!isSelfSeat(meta.private_to,state?.players?.self))||(prompt.player_id&&!isSelfSeat(prompt.player_id,state?.players?.self)))return null;
  const map={
    xiadan_target:['侠胆','先确定拼点对象','可选另一有手牌的存活角色，包括队友；此时取消不扣牌。目标确定后双方必须各自暗选1张手牌，直到两方锁定才同时亮牌。','可重复发动；没有新增每回合一次限制。'],
    pindian_private_card:['拼点','仅你可见 · 暗选1张手牌','只显示你自己的选项。双方锁定后同时公开牌面与点数，严格较大才赢，平点也算没赢。','目标已确定，不能取消或拒绝；装备区/判定区牌不能提交。'],
    qiandu_cost:['迁都','选择两张有效黑色手牌','仅手牌可作成本，不能使用装备区牌。选好后再选交换对象；正式提交前取消不付费。','可重复；两牌同批支付，毒与救援先结算，再交换座次。'],
    qiandu_target:['迁都','交换座次，人物控制权不变','可选任意存活角色，包括自己。选择自己仍弃两张黑色手牌，但不会换位。当前回合继续，结束后从新座次续行。','本作明示适配：允许付费自选，无新增次数上限。'],
    extra_targets:['杀','选择同一张杀的其他目标','每个目标必须不同且合法；可停止追加。所有目标共享同一次用杀，不是额外使用多张杀。','侠胆与武器取合法目标上限的最大值，不相加；目标禁制仍有效。'],
  };
  const [skill,title,description,note]=map[stage];
  const players=publicSeatPlayers(state),label=id=>{const p=players.find(p=>canonicalSeat(p.seat)===canonicalSeat(id));return p?heroDisplayName(p.hero)||p.name:id;};
  const previews=stage==='qiandu_target'&&Array.isArray(meta.seat_previews)?meta.seat_previews:[];
  return html`<section className="response-context seventh-skill-context" data-skill-context=${skill} data-response-stage=${stage}><div className="response-kicker">${skill} · ${stage==='pindian_private_card'?'私有选牌':'当前选择'}</div><strong>${title}</strong><p>${description}</p><small>${note}</small>
    ${previews.length?html`<details className="hero-provenance" onKeyDown=${closeOnEscape}><summary>查看换位后座次与下一行动者</summary>${previews.map(p=>html`<p key=${p.target_id} data-seat-preview=${p.target_id}>选${label(p.target_id)}：${p.changed===false?'座次不变；':''}${(p.order||[]).map(label).join(' → ')}；下一行动者：${label(p.next_actor_id)}</p>`)}</details>`:null}
  </section>`;
}
/** Only an already public, simultaneously revealed event is accepted. */
export function PindianReveal({result,CardView=null}) {
  if(result?.committed!==true||!Array.isArray(result.cards)||result.cards.length!==2||!Array.isArray(result.final_ranks)||result.final_ranks.length!==2)return null;
  const rankLabel=rank=>({1:'A',11:'J',12:'Q',13:'K'}[rank]||String(rank));
  return html`<details className="hero-provenance pindian-reveal" onKeyDown=${closeOnEscape} data-pindian-reveal=${result.compare_id}>
    <summary>双方同时亮牌 · ${result.outcome==='win'?'发起者赢':result.outcome==='tie'?'平点，发起者没赢':'发起者没赢'}</summary>
    <div className="hand-stage flat">${result.cards.map((card,i)=>html`<section key=${i} data-compare-side=${i===0?'actor':'target'}><strong>${i===0?'发起者':'拼点对象'} · 比较点数 ${result.final_ranks[i]}</strong>${CardView?html`<${CardView} card=${{...card,hidden:false,color:['红桃','方块'].includes(card.suit)?'红':'黑',rank_label:rankLabel(card.rank)}} compact=${true} />`:html`<p>${card.suit}${rankLabel(card.rank)} ${card.name}</p>`}${result.original_ranks?.[i]!==undefined?html`<small>原始 ${result.original_ranks[i]} / 最终 ${result.final_ranks[i]}</small>`:null}</section>`)}</div>
  </details>`;
}

/** Presentation-only adapter. Source identity is never rewritten in public state. */
export const playerEffectiveHero = player => player?.effective_hero || player?.hero || null;
export function playerFormDisplayName(player) {
  const base=heroDisplayName(player?.hero),form=player?.hero_form;
  return form ? `${base} · 易装为${form.display_name || heroDisplayName(playerEffectiveHero(player))}` : base;
}
export function HeroFormStatus({player}) {
  const form=player?.hero_form;
  if(!form)return null;
  const hero=playerEffectiveHero(player);
  return html`<section className="player-card-status eighth-hero-form" data-hero-form=${form.form_hero_id || hero?.id} data-base-hero-id=${form.base_hero_id || player.hero?.id} aria-label="易装当前形态">
    <strong>${playerFormDisplayName(player)}</strong>
    <div className="card-status-flags"><span className="chip">规则性别：${form.gender==='male'?'男性':form.gender==='female'?'女性':'未明'}</span><span className="chip">体力上限 ${form.max_hp ?? player.max_hp}</span><span className="chip">当前技能：${hero?.skill_name || '等待完整形态资料'}</span></div>
    <small>原立绘与${heroDisplayName(player.hero)}来源身份保留；阵营、队伍、控制权不变。原人物技能已替换，上限增加不回血。</small>
  </section>`;
}
export const EIGHTH_PROMPT_STAGES=Object.freeze(['yizhuang_material','yizhuang_form']);
export const isEighthPrompt=prompt=>EIGHTH_PROMPT_STAGES.includes(prompt?.meta?.stage)&&prompt?.meta?.skill_id==='yxs.yizhuang';
export function EighthResponseContext({state,prompt}) {
  if(!isEighthPrompt(prompt))return null;
  if((prompt.meta.private_to&&!isSelfSeat(prompt.meta.private_to,state?.players?.self))||(prompt.player_id&&!isSelfSeat(prompt.player_id,state?.players?.self)))return null;
  const material=prompt.meta.stage==='yizhuang_material';
  return html`<section className="response-context eighth-skill-context" data-skill-context="易装" data-source-skill-id="yxs.yizhuang" data-response-stage=${prompt.meta.stage}>
    <div className="response-kicker">易装 · ${material?'选择两张手牌':'选择已阵亡男性形态'}</div>
    <strong>${material?'恰好2张不同手牌；此时尚未付款':'只显示本局已确认阵亡、目前仍阵亡的男性快照'}</strong>
    <p>${material?'装备区、判定区不可用。选完还要选择完整形态，两个步骤都可取消；取消不扣牌。':'获得所选形态完整固有技能，原人物技能全部失去；请展开完整规则再选择。不是任选名册英雄。'}</p>
    <small>HM1–HM12江湖兼容：保留花木兰身份、阵营和队伍。上限增加不回血，本回合杀历史保留；成本触发毒与求药先结算，确认死亡不继续变身。Esc取消，付款前可返回对局。</small>
  </section>`;
}
/** Options are already filtered by finalized death records in the engine. */
export function YizhuangFormChoices({state,prompt,onRespond,busy=false}) {
  if(!isEighthPrompt(prompt)||prompt.meta.stage!=='yizhuang_form')return null;
  if((prompt.meta.private_to&&!isSelfSeat(prompt.meta.private_to,state?.players?.self))||(prompt.player_id&&!isSelfSeat(prompt.player_id,state?.players?.self)))return null;
  return html`<div className="eighth-form-choices">${(prompt.options||[]).map(option=>{
    if(['cancel','0','pass'].includes(option.id))return html`<button key=${option.id} type="button" className="btn" data-option-id=${option.id} disabled=${busy} onClick=${()=>onRespond(option.id)}>${option.label}</button>`;
    const hero=option.hero;
    const supported=!!hero?.id&&skillsForHero(hero).length>0;
    return html`<section key=${option.id} className="hero-skills eighth-form-option" data-form-option=${option.snapshot_id || option.id} data-form-hero-id=${hero?.id}>
      <strong>${heroDisplayName(hero)||option.label} · ${option.max_hp ?? hero?.max_hp}体力上限 · ${option.gender==='male'?'男性':option.gender==='female'?'女性':'性别未明'}</strong>
      <p>${option.label}</p><p>完整固有技能：${hero?.skill_name||'缺少完整技能资料'}</p>
      ${supported?html`<${HeroSkills} hero=${hero} />`:html`<p role="status">完整技能模板未接入，不能选择空技能形态。</p>`}
      <button type="button" className="btn option primary" data-option-id=${option.id} disabled=${busy||!!option.disabled||!supported} onClick=${()=>onRespond(option.id)}>易装为${heroDisplayName(hero)||option.label}</button>
    </section>`;
  })}</div>`;
}


const copiedCardRank=card=>card?.rank_label || ({1:'A',11:'J',12:'Q',13:'K'}[card?.rank] ?? card?.rank ?? '');
const copiedCardFace=card=>`${card?.suit || ''}${copiedCardRank(card)} ${card?.physical_name || card?.name || '未知素材'}`.trim();
/** Use only supplied public state. A transformed card remains one physical card. */
export function JianxiongStatus({player}) {
  if(!player?.jianxiong)return null;
  const record=player.jianxiong;
  return html`<section className="player-card-status ninth-copy-status" data-jianxiong-status=${player.seat} aria-label="奸雄当前回合记录">
    <strong>奸雄 · ${record.used?'本回合已用':'本回合剩余1次'}</strong>
    <div className="card-status-flags"><span className="chip" data-jianxiong-history=${record.last_card?.name || ''}>前牌功能：${record.last_card?.name || '暂无'}</span><span className="chip">素材：1张手牌或装备</span></div>
    <small>${record.history_basis || '本作适配：本人本回合成功提交的最外层用牌，纯响应不更新。'} 复制杀仍受普通主动杀额度限制。</small>
  </section>`;
}
export function JianxiongConvertedCards({player}) {
  const cards=[...Object.entries(player?.equipment || {}).map(([zone,card])=>({zone,card})),...(player?.judgment_cards || []).map((card,i)=>({zone:`judgment:${i}`,card}))]
    .filter(({card})=>card?.converted&&card?.copy_source_skill==='奸雄');
  if(!cards.length)return null;
  const label=zone=>({weapon:'武器',armor:'防具',offensive_horse:'-1马',defensive_horse:'+1马'}[zone] || '判定区');
  return html`<section className="player-card-status ninth-persistent-cards" aria-label="奸雄持续功能与实体素材">
    ${cards.map(({zone,card})=>html`<div key=${zone} className="converted-card-source" data-jianxiong-persistent=${zone} data-effective-name=${card.name} data-material-name=${card.physical_name}>
      <strong>${label(zone)} · 有效功能：${card.name}</strong><span> · 实体素材：${copiedCardFace(card)}${card.physical_type?`（${card.physical_type}）`:''}</span>
    </div>`)}
    <small>CC5江湖适配：装备/判定功能区内及合法直接移装、延时传递保留复制功能；进入手牌、弃牌或牌堆恢复素材印刷身份。</small>
  </section>`;
}
export const isNinthPrompt=prompt=>prompt?.meta?.skill_id==='yxs.jianxiong'&&prompt?.meta?.stage==='jianxiong_material';
const ownsNinthPrompt=(state,prompt)=>isNinthPrompt(prompt)&&(!prompt.meta.private_to||isSelfSeat(prompt.meta.private_to,state?.players?.self))&&(!prompt.player_id||isSelfSeat(prompt.player_id,state?.players?.self));
export function NinthResponseContext({state,prompt}) {
  if(!ownsNinthPrompt(state,prompt))return null;
  const copy=prompt.meta.copy_card;
  return html`<section className="response-context ninth-skill-context" data-skill-context="奸雄" data-source-skill-id="yxs.jianxiong" data-response-stage=${prompt.meta.stage}>
    <div className="response-kicker">奸雄 · 选择1张手牌或装备区素材</div>
    <strong data-copy-function=${copy?.name || ''}>本次复制功能：${copy?.name || '暂无合法前牌'}${copy?.type?`（${copy.type}）`:''}</strong>
    <p>新牌保留所选素材自己的花色、点数；上一张牌只提供功能。素材与目标全部核验后才提交，此时尚未付款。取消或Esc不扣牌、不计次。</p>
    <small>CC1–CC13江湖适配：只在本人空闲出牌阶段复制最外层用牌；纯响应不更新前牌，复制杀共用普通杀额度。装备/延时牌按自身功能入区，以这1张素材为唯一实体。提交后被无懈、无效或死亡均不退次数。</small>
  </section>`;
}
export function JianxiongMaterialChoices({state,prompt,onRespond,busy=false,CardView=null}) {
  if(!ownsNinthPrompt(state,prompt))return null;
  const self=state?.players?.self;
  const material=option=>{
    if(option.card&&!option.card.hidden)return option.card;
    const hand=/^hand:(\d+)$/.exec(String(option.id));
    if(hand)return self?.hand?.[Number(hand[1])-1] || null;
    const equipment=/^(?:eq|equip|equipment):(.+)$/.exec(String(option.id));
    return equipment?self?.equipment?.[equipment[1]] || null:null;
  };
  return html`<div className="eighth-form-choices ninth-material-choices">${(prompt.options || []).map(option=>{
    if(['cancel','0','pass'].includes(String(option.id)))return html`<button key=${option.id} type="button" className="btn" data-option-id=${option.id} disabled=${busy} onClick=${()=>onRespond(option.id)}>${option.label}</button>`;
    const card=material(option),handZone=['hand','H','h'].includes(option.zone)||/^hand:/.test(String(option.id));
    return html`<section key=${option.id} className="hero-skills" data-jianxiong-material=${option.id}>
      <strong>${handZone?'手牌':'装备区'}素材：${card?copiedCardFace(card):option.label}</strong>
      <p>作为${prompt.meta.copy_card?.name || '复制功能'}使用${card?` · 新牌花色点数：${card.suit || ''}${copiedCardRank(card)}`:''}</p>
      ${card&&CardView?html`<${CardView} card=${card} compact=${true} disabled=${true} />`:null}
      <button type="button" className="btn option" data-option-id=${option.id} disabled=${busy||!!option.disabled} onClick=${()=>onRespond(option.id)}>${option.label}</button>
      ${option.reason?html`<small>${option.reason}</small>`:null}
    </section>`;
  })}</div>`;
}

/** New base-identity prompts reuse the shared choices and keyboard lifecycle.
 * Read only explicit prompt metadata; never peek at engine state or opponent hands. */
const SGS_BASE_STAGE_SKILLS=Object.freeze({fankui_take:'反馈',guicai_retrial:'鬼才',guose_material:'国色',guose_target:'国色',liuli_material:'流离',liuli_target:'流离',luoshen_start:'洛神',luoshen_continue:'洛神'});
export const isSgsBaseNextPrompt=prompt=>Boolean(Object.hasOwn(SGS_BASE_STAGE_SKILLS,prompt?.meta?.stage)||prompt?.meta?.skill==='倾国');
export function SgsBaseNextResponseContext({state,prompt}) {
 if(!isSgsBaseNextPrompt(prompt))return null;
 const meta=prompt.meta||{},stage=meta.stage;
 if((meta.private_to&&!isSelfSeat(meta.private_to,state?.players?.self))||(prompt.player_id&&!isSelfSeat(prompt.player_id,state?.players?.self)))return null;
 const skill=SGS_BASE_STAGE_SKILLS[stage]||'倾国';
 const records={
  fankui_take:['伤害与救援已结束 · 取来源1张牌','每次伤害事件一次，不按伤害点数重复。手牌只盲取，装备进入手牌；判定区不能取。','自身来源可取自己的装备；无来源、来源已死亡或没有合法牌时不伪造取牌。'],
  guicai_retrial:['判定已翻开 · 尚未生效','只能打出1张手牌替换，装备不可用。旧判定牌弃置，不由你获得；每个判定每人只有一次改判或放弃机会。','以受判者最终有效花色和点数结算，不把改判者变成伤害来源。'],
  guose_material:['国色 · 选择方块手牌或装备','恰好1张有效方块素材，之后仍需选择合法其他目标；这时尚未付款。判定区牌不可用。','没有独立次数上限、额外摸牌或移除延时牌分支；映射共享画地为牢。'],
  guose_target:['国色 · 完成目标后才付款','不能选择自己或已有同名有效画地为牢的目标。无距离限制；取消保留素材，装备成本离区一次。','方块实体在判定区作为画地为牢，取得入手后恢复原牌功能。'],
  liuli_material:['流离 · 闪与防具响应之前','弃1张手牌或装备，接收者必须在弃牌后的本人攻击范围内；移除武器或进攻马后重新验距。此时尚未付款。','不转给自己或原杀使用者，空城等禁制仍适用；取消则继续原杀的正常响应。'],
  liuli_target:['流离 · 确认合法接收者','按已选成本移除后的范围选择，保留原杀使用者、属性、伤害来源和加成；不是大乔重新出杀。','历史台湾标准FAQ允许自己闪后追加的新杀再次流离；每个目标分支独立结算。'],
  luoshen_start:['准备阶段 · 早于判定区与摸牌','可以开始真实判定，也可放弃。最终黑牌生效后立即入手，再选择是否继续；非黑色停止且不获得。','无固定次数上限；正常摸牌不减少，基础版所得牌照常计入手牌上限。'],
  luoshen_continue:['黑牌已入手 · 可以继续或停止',`已判定 ${Number(meta.judgments)||0} 次，已获得 ${Number(meta.gained)||0} 张。每次经过合法改判，用最终有效颜色判断；停止保留已得牌。`,'没有固定数值上限。继续前当前黑牌已在手中；停止后依次进入正常判定与摸牌。']
 };
 const fallback=['倾国 · 1张有效黑手牌当闪',`只用手牌中的黑色素材，已装备牌不可用；一张素材只满足一张闪。${Number(meta.response_required)>1?`已打出 ${Number(meta.response_supplied)||0} / ${Number(meta.response_required)}，逐张提交；中途放弃不退已用牌。`:''}`,'不能绕过禁闪；保留素材花色、点数与印刷身份，按本次使用或打出闪事件结算。'];
 const [title,description,note]=records[stage]||fallback;
 return html`<section className="response-context sgs-base-next-context" data-skill-context=${skill} data-response-stage=${stage||'qingguo_response'} data-source-skill-id=${meta.skill_id||`sgs.${{反馈:'fankui',鬼才:'guicai',国色:'guose',流离:'liuli',洛神:'luoshen',倾国:'qingguo'}[skill]}`}><div className="response-kicker">${skill} · ${skill==='国色'?'主动转化':skill==='倾国'?'响应转化':'可选触发'}</div><strong>${title}</strong><p>${description}</p>${stage==='guicai_retrial'&&meta.judgment_card?html`<p data-current-judgment="true">当前公开判定：${meta.judgment_card.suit}${copiedCardRank(meta.judgment_card)} ${meta.judgment_card.name}</p>`:null}<small>${note} 触屏点选或键盘Tab定位、Enter确认；Esc放弃，付款前取消无消耗。</small></section>`;
}

/** Following base identity prompt context is source-ID gated, private-owner gated,
 * and derives only from public/current-prompt DTOs, never opposing hands. */
const SGS_FOLLOWING_STAGES=Object.freeze({
 lianying_draw:['连营','sgs.lianying'],xiaoji_draw:['枭姬','sgs.xiaoji'],
 jieyin_materials:['结姻','sgs.jieyin'],jieyin_target:['结姻','sgs.jieyin'],
 lijian_material:['离间','sgs.lijian'],lijian_first:['离间','sgs.lijian'],lijian_second:['离间','sgs.lijian'],
 biyue_start:['闭月','sgs.biyue'],tiandu_obtain:['天妒','sgs.tiandu'],
 yiji_start:['遗计','sgs.yiji'],yiji_card:['遗计','sgs.yiji'],yiji_target:['遗计','sgs.yiji']
});
export const isSgsFollowingPrompt=prompt=>Boolean(Object.hasOwn(SGS_FOLLOWING_STAGES,prompt?.meta?.stage)&&SGS_FOLLOWING_STAGES[prompt.meta.stage][1]===prompt.meta.skill_id);
export function isSgsFollowingPromptOwner(prompt,state) {
 if(!isSgsFollowingPrompt(prompt))return false;
 const self=state?.players?.self,meta=prompt.meta||{},owner=meta.private_to||prompt.player_id;
 return Boolean(self?.seat&&owner&&isSelfSeat(owner,self)&&(!meta.private_to||isSelfSeat(meta.private_to,self))&&(!prompt.player_id||isSelfSeat(prompt.player_id,self)));
}
export function SgsFollowingResponseContext({state,prompt}) {
 if(!isSgsFollowingPromptOwner(prompt,state))return null;
 const meta=prompt.meta||{},stage=meta.stage;
 const [skill,sourceSkillId]=SGS_FOLLOWING_STAGES[stage];
 const mandatory=stage==='yiji_card'||stage==='yiji_target';
 const records={
  lianying_draw:['最后手牌已离手 · 可摸1张','按这次手牌从非空变空的真实移动询问一次；同批失去多张最后手牌也只摸1张。','新牌可参与之后的顺序响应，但不能补付已经提交的同批多牌成本。'],
  xiaoji_draw:['真实装备已离区 · 本张可摸2张','每张实际失去的装备独立选择；不包括从手牌失去的装备类型牌。','枭姬不提供自由弃装；本次放弃不影响下张真实失装的机会。'],
  jieyin_materials:['结姻 · 选择两张不同手牌','只允许本人手牌，已装备和判定区牌不可用；全部材料与目标确认前尚未付款。','本人满血仍可发动，但必须存在其他受伤男性；每个真实出牌阶段1次。'],
  jieyin_target:['结姻 · 选择受伤男性','选择一名其他存活受伤男性，不限敌友与距离；此时取消不消耗两张手牌或次数。','提交时同时弃2张手牌，再各回复1血且不超过个人上限；不是用桃或额外摸牌。'],
  lijian_material:['离间 · 选择一张手牌或装备','弃1牌成本允许手牌或装备，判定区不可用；这时尚未付款。','每个真实出牌阶段1次；严格1v1不足两名其他男性，不能发动。'],
  lijian_first:['离间 · 选择先响应者A','A将成为决斗目标并先打出杀；随后还要选另一名男性B作为决斗使用者。','A必须能成为B的合法决斗目标；空手空城不能选作A，付款前可取消。'],
  lijian_second:['离间 · 选择决斗使用者B','B对A使用一张无实体、无色无花色无点数决斗，可以无懈；先响应者仍是A。','两人均须为其他存活男性且互不相同；成本只是弃牌，不是决斗素材。胜者才是伤害来源。'],
  biyue_start:['结束阶段 · 正常弃牌已经结束','可摸恰好1张牌；空手也只摸1张，不增加手牌上限。','先正常弃牌再闭月；取消不会提前保留多出的手牌。'],
  tiandu_obtain:['最终判定已生效 · 可获得判定牌','仅本人作为受判者时，可获得仍在处理区的最终实体；不能拿已替换的旧牌。','获得不改变已固定的结果；导致判定的效果之后仍继续，刚获得的牌可在下一个合法窗口使用。'],
  yiji_start:['伤害与救援已结束 · 本点遗计可放弃',`按每点实际伤害独立询问${Number(meta.points)>0?`，当前第 ${Number(meta.point)||1} / ${Number(meta.points)} 点`:''}。接受后只私看这次牌顶2张，再逐张分配。`,'观看不摸到手牌，不可混入旧手牌；先完整分配本对，再处理下一点伤害机会。'],
  yiji_card:['遗计 · 私看本次牌顶，选择交付顺序','这些牌仍在牌堆，不在手牌；只可选择本次仍合法的观看实体，不公开给对手。','接受观看后的分配必须完成，不能取消来恢复牌顶知识；实体若已被嵌套效果移走，不追回或复制。'],
  yiji_target:['遗计 · 选择当前牌的收牌者','任意存活角色均可，包括自己、队友或敌人；两张可给同一人，无性别、阵营或距离限制。','这是逐张直接交付，不先摸到本人手牌；已交付的牌不因之后选择改变而退还。']
 };
 const [title,description,note]=records[stage];
 const judgment=stage==='tiandu_obtain'?(meta.judgment_card||meta.final_judgment_card):null;
 return html`<section className="response-context sgs-following-context" data-skill-context=${skill} data-source-skill-id=${sourceSkillId} data-response-stage=${stage} data-private-choice=${mandatory?'true':undefined}>
 <div className="response-kicker">${skill} · ${['离间','结姻'].includes(skill)?'主动技能':mandatory?'私有分配':'可选触发'}</div><strong>${title}</strong><p>${description}</p>
 ${judgment?html`<p data-current-judgment="true">当前公开判定：${judgment.suit}${copiedCardRank(judgment)} ${judgment.name}</p>`:null}
 <small>${note} 触屏点选或键盘Tab定位、Enter确认；${mandatory?'观看后的分配不可取消，Esc不退牌。':'Esc放弃；付款前取消无消耗。'} 重复输入不二次提交。</small></section>`;
}

/** Public general orientation is independent of horizontal chain state. Keep this in normal flow on every seat. */
export function PlayerFaceOrientation({player}) {
 if(player?.face_orientation!=='face_down')return null;
 return html`<section className="player-card-status sgs-face-orientation" data-face-orientation="face_down" data-face-seat=${player.seat} aria-label="武将背面朝上">
  <div className="card-status-flags"><span className="chip" title="翻面不同于横置；仍可正常响应及发动合法回合外技能">背面朝上</span></div>
  <small>${player.alive===false?'人物已退场。':'下次轮到时翻回正面，跳过整个回合；仍可正常响应。'}</small>
 </section>`;
}
const SGS_WIND_STAGES=Object.freeze({
 qingnang_material:['青囊','sgs.qingnang'],qingnang_target:['青囊','sgs.qingnang'],jushou_start:['据守','sgs.jushou'],
 shensu_1_start:['神速','sgs.shensu'],shensu_2_start:['神速','sgs.shensu'],shensu_material:['神速','sgs.shensu'],shensu_target:['神速','sgs.shensu'],
 liegong_target:['烈弓','sgs.liegong']
});
export const isSgsWindPrompt=prompt=>Boolean(Object.hasOwn(SGS_WIND_STAGES,prompt?.meta?.stage)&&SGS_WIND_STAGES[prompt.meta.stage][1]===prompt.meta.skill_id);
export function isSgsWindPromptOwner(prompt,state) {
 if(!isSgsWindPrompt(prompt))return false;
 const self=state?.players?.self,meta=prompt.meta||{},owner=meta.private_to||prompt.player_id;
 return Boolean(self?.seat&&owner&&isSelfSeat(owner,self)&&(!meta.private_to||isSelfSeat(meta.private_to,self))&&(!prompt.player_id||isSelfSeat(prompt.player_id,self)));
}
export function SgsWindResponseContext({state,prompt}) {
 if(!isSgsWindPromptOwner(prompt,state))return null;
 const meta=prompt.meta,stage=meta.stage,[skill,id]=SGS_WIND_STAGES[stage];
 const second=Number(meta.branch)===2;
 const records={
  qingnang_material:['青囊 · 选择1张手牌','任意颜色的手牌均可，包括手中的装备类型牌；装备区与判定区不可用。选择完还要确认受伤目标。','每个真实出牌阶段1次；此时取消不弃牌、不计次。'],
  qingnang_target:['青囊 · 选择受伤角色','可以选择自己、队友或敌人，只要当前存活且受伤。无性别、阵营或距离限制。','确认后先弃1手牌，再技能回复1点体力；不是用桃。失牌效果使目标满血或死亡，不退已提交成本及次数。'],
  jushou_start:['据守 · 正常弃牌已结束','可先摸3张，然后将自己的武将翻面。选择摸牌后必须翻面；无需再立刻按手牌上限弃牌。','正面变背面、背面变正面。背面时下次轮到自己翻回并跳过整个回合，仍能正常响应。'],
  shensu_1_start:['神速一 · 判定尚未开始','跳过接下来的整个判定与摸牌阶段，视为使用一张无距离限制的普通杀。延时牌保留，不先看判定或无懈结果。','后续出牌、弃牌和结束照常；仍可在第二项独立时机另作选择，不提前承诺。'],
  shensu_2_start:['神速二 · 出牌尚未开始','弃1张自己的装备类型牌（手牌或装备区），跳过出牌阶段，视为使用一张无距离限制的普通杀。','之后仍有正常弃牌及结束阶段；若出牌已被其他效果跳过，就没有此项机会。'],
  shensu_material:['神速二 · 选择装备成本','只选手牌或装备区的装备类型牌。真正失装触发照常结算；此成本不是虚拟杀的素材。','确认目标前可取消；判定区及普通非装备手牌不可用。'],
  shensu_target:[`神速${second?'二':'一'} · 选择合法杀目标`,'选择一名其他存活角色，包含队友或敌人；只免距离，空手空城及硬性用杀禁令仍生效。',second?'提交时弃装备并跳过出牌，再结算无素材杀。已提交的成本与阶段不因失去攻击机会退还。':'提交时一并跳过判定与摸牌，再结算无素材杀；不占正常出牌阶段杀额度。'],
  liegong_target:['烈弓 · 指定目标时的固定快照','目标手牌数≥自己当前体力，或≤自己攻击范围，任一成立即可令这个目标不能用闪响应此杀。相等也满足。','各目标先完成快照及选择，再进行任何响应或伤害。之后血量、手牌、武器变化不重算；仁王盾、藤甲和其他预防仍有效。']
 };
 const [title,description,note]=records[stage];
 const value=v=>Number.isFinite(v)?String(v):'未提供';
 const target=stage==='liegong_target'?publicSeatPlayers(state).find(p=>canonicalSeat(p.seat)===canonicalSeat(meta.target_seat)):null;
 return html`<section className="response-context sgs-wind-context" data-skill-context=${skill} data-source-skill-id=${id} data-response-stage=${stage}>
 <div className="response-kicker">${skill} · ${skill==='青囊'?'主动技能':skill==='神速'?'阶段替代':'可选触发'}</div><strong>${title}</strong><p>${description}</p>
 ${stage==='liegong_target'?html`<p data-liegong-snapshot=${meta.target_seat || ''}>指定目标：${target?heroDisplayName(target.hero)||target.name:meta.target_seat||'当前目标'} · 目标手牌 ${value(meta.target_hand_count)} / 自己体力 ${value(meta.owner_hp)} / 攻击范围 ${meta.attack_range_infinite?'无限':value(meta.attack_range)}</p>`:null}
 <small>${note} 触屏点选或键盘Tab定位、Enter确认；Esc放弃，付款前取消无消耗。重复输入不二次提交。</small></section>`;
}

const SGS_NEXT_IDENTITY_STAGES=Object.freeze({
 tianxiang_material:['天香','sgs.tianxiang'],tianxiang_target:['天香','sgs.tianxiang'],tianxiang_confirm:['天香','sgs.tianxiang'],
 mengjin_start:['猛进','sgs.mengjin'],mengjin_card:['猛进','sgs.mengjin'],qiangxi_cost:['强袭','sgs.qiangxi'],qiangxi_target:['强袭','sgs.qiangxi']
});
export const isSgsNextIdentityPrompt=prompt=>Boolean(Object.hasOwn(SGS_NEXT_IDENTITY_STAGES,prompt?.meta?.stage)&&SGS_NEXT_IDENTITY_STAGES[prompt.meta.stage][1]===prompt.meta.skill_id);
export function isSgsNextIdentityPromptOwner(prompt,state){
 if(!isSgsNextIdentityPrompt(prompt))return false;
 const self=state?.players?.self,meta=prompt.meta||{},owner=meta.private_to||prompt.player_id;
 return Boolean(self?.seat&&owner&&isSelfSeat(owner,self)&&(!meta.private_to||isSelfSeat(meta.private_to,self))&&(!prompt.player_id||isSelfSeat(prompt.player_id,self)));
}
export function SgsNextIdentityResponseContext({state,prompt}){
 if(!isSgsNextIdentityPromptOwner(prompt,state))return null;
 const meta=prompt.meta,[skill,id]=SGS_NEXT_IDENTITY_STAGES[meta.stage];
 const descriptions={
  tianxiang_material:['天香 · 选择有效红桃手牌','只用自己的1张有效红桃手牌；黑桃手牌因红颜按红桃。装备区和判定区不可支付。','转移整次伤害，保留原来源与属性；直接流失体力不可转移。'],
  tianxiang_target:['天香 · 选择另一名存活角色','可选队友、敌人或原攻击者，不限距离；不能选自己。接下来还有最终确认。','不会重新出杀或产生新闪窗口；救援及伤后技能后，最终存活受伤者才按当时缺血摸牌。'],
  tianxiang_confirm:['天香 · 最终确认后支付','确认才弃置所选手牌并转移整次伤害；取消保持手牌不动。','每次重定向需要新的有效红桃手牌；按明确江湖兼容约定只给最终实际受伤存活者一次延后摸牌。'],
  mengjin_start:['猛进 · 已完成整组闪避','响应者的打闪技能已结算，现在可弃该目标1张手牌或装备。无需支付自己的牌，无需判定。','猛进在贯石斧/青龙刀等武器后续之前；手牌保持暗选，判定区不可选。'],
  mengjin_card:['猛进 · 选择目标的一张手牌或装备','暗牌只给编号，不公开牌名、花色或点数。装备公开可选；判定区及特殊牌堆均不可选。','先完成真实弃牌及失装效果，再继续本次杀的武器后续。可以放弃此次猛进。'],
  qiangxi_cost:['强袭 · 失去体力或弃武器','可失去1点体力（可能濒死），或弃1张手牌/装备区武器。防具、马与判定区牌不可支付。','每个真实出牌阶段共用1次额度；选成本后仍可在目标确认前取消。'],
  qiangxi_target:['强袭 · 按支付后射程选另一角色','只能选另一名存活角色，可选队友。弃已装备武器时不计该武器射程；弃手中的武器不影响当前已装备射程。','成本及濒死救援先完整结算，再造成1点普通技能伤害；无实体牌，不可闪避或无懈。费用提交才计阶段次数。']
 };
 const [title,description,note]=descriptions[meta.stage];
 return html`<section className="response-context sgs-next-identity-context" data-skill-context=${skill} data-source-skill-id=${id} data-response-stage=${meta.stage}>
 <div className="response-kicker">${skill} · ${skill==='强袭'?'主动技能':'可选触发'}</div><strong>${title}</strong><p>${description}</p>
 ${skill==='天香'&&Number.isFinite(meta.damage)?html`<p data-tianxiang-amount=${meta.damage}>整次待转移伤害：${meta.damage}点</p>`:null}
 ${skill==='强袭'&&meta.stage==='qiangxi_target'?html`<p data-qiangxi-cost=${meta.cost}>已选成本：${meta.cost==='hp'?'失去1点体力':meta.cost_zone==='weapon'?'弃已装备武器（该武器不供射程）':'弃手中武器（保留已装备射程）'}</p>`:null}
 <small>${note} 触屏点选或键盘Tab定位、Enter确认；Esc放弃，付款前取消无消耗。重复输入不二次提交。</small></section>`;
}
/** This badge describes public rules, never inspects a hidden opponent hand. */
export function SgsHongyanStatus({player}){
 const hero=playerEffectiveHero(player);if(!skillsForHero(hero).some(skill=>skill.source_skill_id==='sgs.hongyan'))return null;
 return html`<section className="player-card-status" data-hongyan-scope="hand-and-own-judgment" aria-label="红颜的区域范围"><small>红颜：黑桃手牌与本人判定按红桃；已装备黑桃仍为黑色。实体花色与点数不改变。</small></section>`;
}

/** Strict source-bound recognition; a shared stage name is not authorization. */
export function isWangyunPrompt(prompt){
 const row=WANGYUN_PROMPT_CONTEXTS[prompt?.meta?.stage];if(!row)return false;
 return row.skill_id ? prompt.meta.skill_id===row.skill_id : row.card_names.includes(prompt.meta.card_name);
}
export function isWangyunPromptOwner(prompt,state){
 if(!isWangyunPrompt(prompt))return false;
 const self=state?.players?.self,meta=prompt.meta||{},owner=meta.private_to||prompt.player_id;
 return Boolean(self?.seat&&owner&&isSelfSeat(owner,self)&&(!meta.private_to||isSelfSeat(meta.private_to,self))&&(!prompt.player_id||isSelfSeat(prompt.player_id,self)));
}
export function WangyunResponseContext({state,prompt}){
 if(!isWangyunPromptOwner(prompt,state))return null;
 const meta=prompt.meta,row=WANGYUN_PROMPT_CONTEXTS[meta.stage];
 const card=WANGYUN_CARD_RULES[meta.chosen_card_name||meta.card_name];
 return html`<section className="response-context wangyun-context" data-response-stage=${meta.stage} data-source-skill-id=${row.skill_id||undefined} data-wangyun-card-name=${meta.card_name||undefined}>
  <div className="response-kicker">2023历史规则 · 江湖边界处理</div><strong>${row.title}</strong><p>${row.text}</p>
  <small>触屏点选或键盘Tab定位、Enter确认；仅在有取消选项时Esc退出。未提交不扣材料；实际用牌后不因无懈退还次数。当前客户端未认证。</small>
  ${card?html`<details className="wangyun-prompt-rules"><summary>查看${card.name}完整规则与来源</summary><${WangyunCardRules} card=${card}/></details>`:null}
 </section>`;
}
const WANGYUN_DISPLAY_ART_ALIASES=Object.freeze({'过河拆桥':'釜底抽薪','顺手牵羊':'探囊取物','南蛮入侵':'烽火狼烟'});
/** Only the verified prompt owner's own DTO hand or explicitly public pool.
 * Blind acquisition discards even unexpected face/label data before rendering. */
export function WangyunPromptOptions({state,prompt,onRespond,busy=false}){
 if(!isWangyunPromptOwner(prompt,state))return null;
 const stage=prompt.meta.stage,self=state.players.self,meta=prompt.meta;
 const options=prompt.options||[],cancel=id=>['cancel','pass','0'].includes(id);
 const material=id=>{
  const hand=/^hand:(\d+)$/.exec(id);if(hand)return self.hand?.[Number(hand[1])-1]||null;
  const eq=/^eq:(weapon|armor|offensive_horse|defensive_horse)$/.exec(id);return eq?self.equipment?.[eq[1]]||null:null;
 };
 const suit={红桃:'♥',方块:'♦',黑桃:'♠',梅花:'♣'};
 return html`<div className="dialog-actions wrap wangyun-prompt-options" data-wangyun-options=${stage}>
 ${options.map((option,index)=>{
  const blind=stage==='meirenji_obtain'&&!cancel(option.id);
  let card=null;
  if(stage==='jingong_material')card=material(option.id);
  if(stage==='meirenji_give'&&/^card:\d+$/.test(option.id))card=self.hand?.[Number(option.id.split(':')[1])-1]||null;
  if(stage==='harvest_choose'&&meta.visibility==='public')card=option.card||meta.public_cards?.find(c=>c.option_id===option.id)||null;
  const name=stage==='jingong_menu'&&!cancel(option.id)?option.id:card?.name;
  const shownName=name?(WANGYUN_DISPLAY_ART_ALIASES[name]||name):null;
  const face=card&&!card.hidden?`${suit[card.suit]||''} ${card.suit||''} ${card.rank_label||({1:'A',11:'J',12:'Q',13:'K'})[card.rank]||card.rank||''}`:'';
  const label=blind?`未知手牌 ${index+1}`:option.label;
  return html`<div key=${option.id} style=${{flex:'1 1 130px',minWidth:0,maxWidth:'220px'}}>
   <button type="button" className=${`btn option ${blind?'wangyun-blind-card':''}`} data-option-id=${option.id} disabled=${busy||!!option.disabled} aria-label=${blind?label:[label,face].filter(Boolean).join(' · ')} style=${{width:'100%',whiteSpace:'normal'}} onClick=${()=>{if(!busy&&!option.disabled)onRespond(option.id);}}>
    ${blind?html`<span className="sgs-card back compact" style=${{display:'block',pointerEvents:'none',margin:'0 auto'}} aria-hidden="true"><span className="back-mark">${index+1}</span></span>`:shownName?html`<span style=${{display:'block',width:'90px',maxWidth:'100%',margin:'0 auto'}}><${CardArt} card=${{...card,name:shownName}} compact=${true}/></span>`:null}
    <span>${label}</span>${face?html`<small className="converted-card-source" data-wangyun-face="true">${face}</small>`:name&&stage==='jingong_menu'?html`<small className="converted-card-source">花色点数随所选材料</small>`:null}
   </button>
   ${name&&WANGYUN_CARD_RULES[name]?html`<details className="wangyun-option-rules"><summary>${name}规则</summary><${WangyunCardRules} card=${{name}}/></details>`:null}
  </div>`;
 })}
 </div>`;
}
/** Public counters only; never reads or exposes the optional private menu. */
export function WangyunStatus({player}){
 const record=player?.wangyun,hero=playerEffectiveHero(player);
 const relevant=hero?.id==='sgs.mobile.hero.wangyun.20231207'||hero?.skill_ids?.some(id=>id.startsWith('sgs.mobile.wangyun.'))||record?.awakened||record?.marks>0;
 if(!record||!player?.alive||!relevant)return null;
 const count=Number.isSafeInteger(record.marks)&&record.marks>=0?record.marks:0;
 return html`<section className="player-card-status wangyun-status" data-wangyun-awakened=${record.awakened?'true':'false'} aria-label="连计标记与谋逞状态">
  <div className="card-status-flags"><span className="chip" data-wangyun-marks=${count}>连计标记 ${count}</span><span className="chip">${record.awakened?'谋逞已觉醒 · 获得矜功':'谋逞未觉醒 · 3标记觉醒'}</span></div>
  <small>${record.end_obligation==='armed'?'矜功已使用：结束阶段将检查本人本回合是否造成伤害。':'标记按连计指定使用者的实际扣血累计；每次伤害后检查觉醒。'}</small>
 </section>`;
}
