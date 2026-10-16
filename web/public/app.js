import {isSgsConfirmedSupportPrompt,isSgsConfirmedSupportPromptStage,isSgsConfirmedSupportPromptOwner,sgsConfirmedSupportCancelOption,sgsConfirmedSupportSendOnce,sgsConfirmedSupportSearchText,SGS_CONFIRMED_SUPPORT_PROMPT_CONTEXTS,SgsConfirmedSupportResponseContext,SgsConfirmedSupportChoiceButtons,SgsConfirmedSupportStatus} from './sgs-confirmed-support-skill-ui.js';
import {isSgsObligationIdentityPrompt,isSgsObligationIdentityPromptStage,isSgsObligationIdentityPromptOwner,sgsObligationIdentityCancelOption,sgsObligationIdentitySendOnce,SGS_OBLIGATION_IDENTITY_PROMPT_CONTEXTS,SgsObligationIdentityResponseContext,SgsObligationIdentityChoiceButtons,SgsObligationIdentityStatus} from './sgs-obligation-identity-skill-ui.js';
import {isSgsFutureIdentityPrompt,isSgsFutureIdentityPromptStage,isSgsFutureIdentityPromptOwner,isSgsFutureIdentityMandatory,sgsFutureIdentitySendOnce,SgsFutureIdentityResponseContext,SgsFutureIdentityChoiceButtons,SgsFutureIdentityStatus} from './sgs-future-identity-skill-ui.js';
import {isSgsIdentityNextPrompt,isSgsIdentityNextPromptStage,isSgsIdentityNextPromptOwner,isSgsIdentityNextMandatory,sgsIdentityNextSendOnce,SgsIdentityNextResponseContext,SgsIdentityNextChoiceButtons,SgsIdentityNextStatus} from './sgs-identity-next-skill-ui.js';
import {isYxsModernPrompt,isYxsModernPromptStage,isYxsModernPromptOwner,YxsModernResponseContext,YxsModernStatus,YxsModernChoiceButtons} from './yxs-modern-skill-ui.js';
import {isSgsZhangfenPrompt,isSgsZhangfenPromptStage,isSgsZhangfenPromptOwner,SgsZhangfenResponseContext,SgsZhangfenStatus,SgsZhangfenChoiceButtons} from './sgs-zhangfen-ui.js';
import {isSgsFollowupPrompt,isSgsFollowupPromptStage,isSgsFollowupPromptOwner,isSgsFollowupMandatory,SgsFollowupResponseContext,SgsFollowupStatus,SgsFollowupChoiceButtons} from './sgs-followup-skill-ui.js';
import {isSgsYijiangFurtherPrompt,isSgsYijiangFurtherPromptStage,isSgsYijiangFurtherPromptOwner,isSgsYijiangFurtherMandatory,SgsYijiangFurtherResponseContext,SgsYijiangFurtherStatus,SgsYijiangFurtherChoiceButtons} from './sgs-yijiang-further-skill-ui.js';
import {isSgsYijiangMorePrompt,isSgsYijiangMorePromptStage,isSgsYijiangMorePromptOwner,isSgsYijiangMoreMandatory,SgsYijiangMoreResponseContext,SgsYijiangMoreStatus,SgsYijiangMoreChoiceButtons} from './sgs-yijiang-more-skill-ui.js';
import {isSgsYijiangLaterPrompt,isSgsYijiangLaterPromptStage,isSgsYijiangLaterPromptOwner,isSgsYijiangLaterMandatory,SgsYijiangLaterResponseContext,SgsYijiangLaterStatus,SgsYijiangLaterChoiceButtons} from './sgs-yijiang-later-skill-ui.js';
import {canUseOffensiveWineCard,OrdinaryWineRules,OFFENSIVE_WINE_RULES} from './card-turn-rules.js';
import {isSgsYijiangNextPrompt,isSgsYijiangNextPromptStage,isSgsYijiangNextPromptOwner,isSgsYijiangNextMandatory,SgsYijiangNextResponseContext,SgsYijiangNextStatus,SgsHandangStatus,SgsYijiangNextChoiceButtons,isSgsFuliRescuePrompt,isSgsFuliRescueOwner,SgsFuliRescueContext} from './sgs-yijiang-next-skill-ui.js';
import {isSgsJieyueConversionPrompt,isSgsJieyueConversionOwner,SgsJieyueConversionContext,SgsJieyueConversionChoices,isSgsYijiangFollowingPrompt,isSgsYijiangFollowingPromptStage,isSgsYijiangFollowingPromptOwner,SgsYijiangFollowingResponseContext,SgsYijiangFollowingStatus,SgsYijiangFollowingChoiceButtons} from './sgs-yijiang-following-skill-ui.js';
import {isSgsYijiangPrompt,isSgsYijiangPromptStage,isSgsYijiangPromptOwner,SgsYijiangResponseContext,SgsYijiangStatus,SgsYijiangChoiceButtons,SgsYijiangPojunChoices} from './sgs-yijiang-skill-ui.js';
import {isSgsMountainPrompt,isSgsMountainPromptStage,isSgsMountainPromptOwner,SgsMountainResponseContext,SgsMountainStatus,SgsMountainMaterialChoices,SgsMountainChoiceButtons,SgsMountainGuanxingChoices} from './sgs-mountain-skill-ui.js';
import {isSgsForestPrompt,isSgsForestPromptStage,isSgsForestPromptOwner,SgsForestResponseContext,SgsForestStatus,SgsForestMaterialChoices} from './sgs-forest-skill-ui.js';
import {isSgsFirePrompt,isSgsFirePromptStage,isSgsFirePromptOwner,SgsFireResponseContext,SgsFireStatus} from './sgs-fire-skill-ui.js';
import {isYoujianPrompt,isYoujianPromptStage,isYoujianPromptOwner,getYoujianPromptExplanation,YoujianPromptExplanation,YoujianPromptOptions,YoujianCardRules,YoujianHandRules} from './youjian-card-art.js';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { html } from "htm/react";
import { LocalMatch, SAVE_KEY } from "../local/session.js";
import { YOUJIAN_EQUIPMENT_PACK_ID } from "../local/content-packs.js";
import { JIANGHU_DECK_SIZE } from "../local/models.js";
import { CardArt, EquipmentSlot } from "./card-art.js";
import { BattleBoard } from "./board-layout.js";
import { CardResponseDialog, PlayerCardStatus, ResponseContext as SharedResponseContext, LiuyeRecord } from "./card-response-ui.js";
import { heroDisplayName, heroIdentityKey, findHeroByIdentity, heroMatchesQuery, heroMatchesSource } from "./display-names.js";
import { HeroSkills, ActiveSkillButton, skillAvailability, isSelfSeat, GuardStatus, GuardResponseContext, GUARD_PROMPT_STAGES, XiadanStatus, SeatOrderStatus, SeventhResponseContext, SEVENTH_PROMPT_STAGES, isSeventhPrompt, PindianReveal, HeroProvenance, HeroFormStatus, playerEffectiveHero, playerFormDisplayName, EighthResponseContext, isEighthPrompt, YizhuangFormChoices, JianxiongStatus, JianxiongConvertedCards, NinthResponseContext, isNinthPrompt, JianxiongMaterialChoices, SgsBaseNextResponseContext, isSgsBaseNextPrompt, SgsFollowingResponseContext, isSgsFollowingPrompt, isSgsFollowingPromptOwner, SgsWindResponseContext, isSgsWindPrompt, isSgsWindPromptOwner, PlayerFaceOrientation, SgsNextIdentityResponseContext, isSgsNextIdentityPrompt, isSgsNextIdentityPromptOwner, SgsHongyanStatus, WangyunStatus, WangyunResponseContext, WangyunPromptOptions, isWangyunPrompt, isWangyunPromptOwner } from "./skill-ui.js";

const GIFT_RULES = "带赠予标记的手牌可在自己的出牌阶段交给另一名角色；装备直接装入其对应槽并替换旧装备。选择目标前取消不消耗牌。";
const POISON_RULES = "毒不是毒杀，不能直接使用。公开失去每张毒时失去1点体力；引蜂衣使每张额外流失1点，可能进入濒死救援。";
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

/** One portrait route for selection, home preview, and every table seat. */
const EXPANSION_PORTRAITS = Object.freeze({
  关羽: 'guanyu', 张飞: 'zhangfei', 甘宁: 'ganning', 黄盖: 'huanggai',
  吕蒙: 'lvmeng', 许褚: 'xuchu', 夏侯惇: 'xiahoudun', 黄月英: 'huangyueying',
  赵云: 'zhaoyun', 马超: 'machao', 周瑜: 'zhouyu', 诸葛亮: 'zhugeliang',
});
function heroPortraitSource(hero) {
  if (hero && typeof hero === 'object' && /^\.\/portraits(?:-[a-z]+)*\/[a-zA-Z0-9%._/-]+\.(?:svg|jpg|png)$/.test(hero.portrait_path || '')) return hero.portrait_path;
  const name = typeof hero === 'string' ? hero : hero?.id==='jianghu.classic.hero.jiang-wei'?'姜维':hero?.portrait_name || hero?.name || '';
  return EXPANSION_PORTRAITS[name]
    ? `./portraits-expansion/${EXPANSION_PORTRAITS[name]}.svg`
    : `./portraits/${encodeURIComponent(name)}.jpg`;
}

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
  武圣: { arg_mode: "none" },
  奇袭: { arg_mode: "none" },
  苦肉: { arg_mode: "none" },
  奸雄: { arg_mode: "none" },
  武穆: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "shan" },
  疏财: { arg_mode: "cards", min_cards: 1, max_cards: 0, card_filter: "any" },
  龙胆: { arg_mode: "one_card", min_cards: 1, max_cards: 1, card_filter: "shan" },
  反间: { arg_mode: "none" },
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

function HeroPortraitArt({ hero, name = hero?.name, displayName = heroDisplayName(hero) || name }) {
  const theme = HERO_THEME[name] || { hue: 30, title: displayName.slice(0, 1), accent: "#c9a227", motif: "seal" };
  const bg = `hsl(${theme.hue} 35% 18%)`;
  const mid = `hsl(${theme.hue} 40% 28%)`;
  const src = heroPortraitSource(hero || name);
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);

  if (!broken) {
    return html`<div className="portrait-art has-photo" style=${{ background: `linear-gradient(165deg, ${mid}, ${bg})` }}>
      <img
        className="portrait-photo"
        src=${src}
        alt=${displayName}
        onError=${() => setBroken(true)}
      />
      <div className="portrait-banner" style=${{ borderColor: theme.accent, color: theme.accent }}>${displayName}</div>
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
    <div className="portrait-banner" style=${{ borderColor: theme.accent, color: theme.accent }}>${displayName}</div>
  </div>`;
}

function CardView({ card, selected, disabled, dimmed, onClick, compact, number, disabledReason, contextualNote }) {
  if (card.hidden) {
    return html`<button
      type="button"
      className=${`sgs-card back ${compact ? "compact" : ""} ${selected ? "selected" : ""}`}
      disabled=${disabled || !onClick}
      onClick=${onClick}
      aria-label=${number ? `未知手牌 ${number}` : "对手手牌"}
      aria-pressed=${onClick ? !!selected : undefined}
    >
      <span className="back-mark">${number || "江"}</span>
    </button>`;
  }

  const red = card.color === "红";
  const faceName = card.permanent_identity || card.converted ? card.name : card.base_name || card.name;
  const permanentLabel = card.permanent_identity ? `连计永久转换 · ${card.name}；原实体 ${card.original_printed_name || "基础青釭来源武器"}，保留 ${card.suit || ""}${card.rank_label || card.rank || ""}；离场与重洗不还原` : "";
  const copyLabel = card.converted && card.copy_source_skill === "奸雄" ? `奸雄复制 · 有效功能 ${card.name}；实体素材 ${card.physical_name || "未知"}（${card.physical_type || ""}），保留素材 ${card.suit || ""}${card.rank_label || card.rank || ""}` : "";
  const suitProjection = card.physical_suit && card.suit !== card.physical_suit ? `有效${card.suit} · 实体${card.physical_suit}` : "";
  const variant = card.name?.match(/〔(.+)〕/)?.[1];
  const longName = (faceName || "").length >= 3;
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
    disabled=${disabled}
    aria-label=${`${card.name} ${card.suit || ""}${card.rank_label || ""}${card.gift_mark ? "，赠予标记" : ""}${card.type === "毒" ? "，公开失去时流失体力" : ""}${disabledReason ? `，${disabledReason}` : ""}${copyLabel ? `，${copyLabel}` : ""}${permanentLabel ? `，${permanentLabel}` : ""}${suitProjection ? `，${suitProjection}` : ""}${contextualNote ? `，${contextualNote}` : ""}`}
    aria-pressed=${onClick ? !!selected : undefined}
    data-permanent-identity=${card.permanent_identity?"true":undefined} data-effective-suit=${card.suit} data-physical-suit=${card.physical_suit || card.suit}
    title=${[disabledReason, card.type === "酒" ? OFFENSIVE_WINE_RULES : card.description || card.label || card.name, copyLabel, permanentLabel, suitProjection, contextualNote, card.gift_mark ? GIFT_RULES : "", card.type === "毒" ? POISON_RULES : ""].filter(Boolean).join("\n")}
  >
    ${card.gift_mark ? html`<span className="gift-mark" data-gift-mark="true" title=${GIFT_RULES}>赠</span>` : null}
    <div className="corner tl">
      <b>${card.rank_label}</b>
      <i>${SUIT_SYMBOL[card.suit] || ""}</i>
    </div>
    <div className="card-body">
      <${CardArt} card=${card} compact=${compact} />
      <div className="cname">${faceName}</div>
      <div className="ctype">${card.type}${variant ? html`<span className="card-variant">${variant}</span>` : null}</div>
      ${contextualNote?html`<small className="converted-card-source" data-contextual-use-note="true">${contextualNote}</small>`:null}
      ${copyLabel?html`<small className="converted-card-source">素材：${card.physical_name}</small>`:null}
      ${permanentLabel?html`<small className="converted-card-source">连计永久转换</small>`:null}
      ${suitProjection?html`<small className="converted-card-source" data-suit-projection="true">${suitProjection}</small>`:null}
    </div>
    <div className="corner br">
      <i>${SUIT_SYMBOL[card.suit] || ""}</i>
      <b>${card.rank_label}</b>
    </div>
  </button>`;
}

// Stable public seat IDs without spreading (and thereby reading) hidden hands.
function confirmedSupportPublicPlayer(player) {
  return {
    seat: ({player:"p1",ai:"p2",ai2:"p3"})[player.seat] ?? player.seat,
    hero: player.hero, effective_hero: player.effective_hero,
    sgs_caoang: player.sgs_caoang, sgs_panzhangmazhong: player.sgs_panzhangmazhong,
  };
}

function GeneralSeat({ player, side, damaged, state = null }) {
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
          html`<${EquipmentSlot} key=${key} card=${card} slot=${key} label=${label} equipmentState=${player.equipment_state?.[key]} zhangfenState=${key==="weapon"?player.sgs_zhangfen?.vehicle:null} />`
      )}
    </div>
    <div className="portrait">
      <div className="portrait-frame">
        <${HeroPortraitArt} hero=${player.hero} name=${player.hero.name} displayName=${playerFormDisplayName(player)} />
        <${HpPeaches} hp=${player.hp} maxHp=${player.max_hp} />
      </div>
      <div className="seat-meta">
        <div className="seat-nick">${player.name}${Number.isInteger(player.seat_position)?html`<small data-seat-position=${player.seat_position}> · 座次 ${player.seat_position}</small>`:null}</div>
        <div className="hp-text">${player.hp}/${player.max_hp}</div>
        <div className="skill-tag">${playerEffectiveHero(player)?.skill_name}</div>
        <div className="mark-row">
          ${player.marks.leidian ? html`<span className="chip">雷</span>` : null}
          ${player.marks.poison ? html`<span className="chip">毒</span>` : null}
          ${player.marks.judgment ? html`<span className="chip">判</span>` : null}
          ${player.marks.prison ? html`<span className="chip">牢</span>` : null}
          ${player.marks.shixian ? html`<span className="chip">诗</span>` : null}
          ${player.marks.zuijiu ? html`<span className="chip" data-turn-mark="zuijiu" title="本回合杀与决斗的基础伤害为 2，再叠加其他修正">醉酒 · 基础 2</span>` : null}
          ${player.marks.yinren ? html`<span className="chip" data-turn-mark="yinren" title="本次弃牌阶段手牌上限为 20">隐忍 · 上限 20</span>` : null}
          ${player.marks.peacock ? html`<span className="chip" data-turn-mark="peacock" title="本回合所有杀伤害 +1，与酒取较大值；重复发动不叠加">孔雀翎 · 本回合 +1</span>` : null}
          ${player.marks.luoyi ? html`<span className="chip" title="本回合自己造成的杀或决斗伤害 +1">裸衣</span>` : null}
          ${Number(player.marks.bawang_stacks) > 0
            ? html`<span className="chip">霸${player.marks.bawang_stacks}</span>`
            : null}
          ${Number(player.marks.wine_bonus) > 0 ? html`<span className="chip">酒</span>` : null}
        </div>
      </div>
    </div>
    <${HeroFormStatus} player=${player} />
    <${JianxiongStatus} player=${player} />
    <${JianxiongConvertedCards} player=${player} />
    <${PlayerCardStatus} player=${player} />
    <${PlayerFaceOrientation} player=${player} />
    <${SgsHongyanStatus} player=${player} />
    <${WangyunStatus} player=${player} />
    <${SgsYijiangStatus} player=${player} />
    <${SgsYijiangFollowingStatus} player=${player} CardView=${CardView} />
    <${SgsConfirmedSupportStatus} player=${confirmedSupportPublicPlayer(player)} CardView=${CardView} />
    <${SgsObligationIdentityStatus} player=${player} state=${state} CardView=${CardView} />
    <${SgsFutureIdentityStatus} player=${player} />
    <${SgsIdentityNextStatus} player=${player} />
    <${YxsModernStatus} player=${player} state=${state} />
    <${SgsZhangfenStatus} player=${player} />
    <${SgsFollowupStatus} player=${player} state=${state} />
    <${SgsYijiangFurtherStatus} player=${player} state=${state} />
    <${SgsYijiangMoreStatus} player=${player} state=${state} />
    <${SgsYijiangLaterStatus} player=${player} state=${state} />
    <${SgsYijiangNextStatus} player=${player} state=${state} />
    <${SgsHandangStatus} player=${player} />
    <${SgsMountainStatus} player=${player} CardView=${CardView} />
    <${SgsForestStatus} player=${player} />
    <${SgsFireStatus} player=${player} />
    <${GuardStatus} player=${player} />
    <${XiadanStatus} player=${player} />
    <${LiuyeRecord} player=${player} />
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

function EquipmentActions({state, prompt, onActivate = null, busy = false}) {
  const equipmentActions = state?.equipment_actions || [];
  return equipmentActions.length ? html`<section className="equipment-action-rail" aria-label="装备发动">
      <h3>装备发动</h3>
      ${equipmentActions.map(action => {
        const phase = skillAvailability(null, state, prompt, busy);
        const ready = !!onActivate && action.available && phase.available;
        const reason = action.reason || (ready ? (action.active ? "已生效；可再次支付体力，效果不叠加" : "失去 1 点体力，可能进入濒死救援") : phase.reason || "请等待自己的出牌阶段");
        const reasonId = `equipment-action-reason-${action.id}`;
        return html`<div key=${action.id} className="equipment-action-control" data-equipment-action=${action.id} data-equipment-active=${!!action.active}>
          <button type="button" className="btn equipment-action-button" disabled=${!ready} aria-describedby=${reasonId}
            onClick=${() => { if (!ready) return; onActivate(action); }}>
            <${CardArt} card=${{name:action.name}} compact=${true} /><span>${action.label || `发动${action.name}`}</span>
          </button>
          <div className="equipment-action-copy"><span id=${reasonId}>${reason}</span>
            <details><summary aria-label=${`${action.name}，查看装备发动完整规则`}>完整规则</summary><p>${action.description}</p><p>体力代价：${action.cost_hp || 0} 点。${action.repeatable ? "允许重复发动；请确认是否需要再次支付。" : "次数限制见装备说明。"}</p></details>
          </div>
        </div>`;
      })}
    </section>` : null;
}
/** A gift is a separate command, never an extra click target over a hand card. */
function GiftActions({ state, prompt, onRespond, busy = false, selecting = false }) {
  const self = state?.players?.self;
  const hand = self?.hand;
  if (!state?.config?.content_packs?.includes(YOUJIAN_EQUIPMENT_PACK_ID) ||
      prompt?.kind !== "play_card" || !prompt.prompt_id || !prompt.player_id || !isSelfSeat(prompt.player_id, self) ||
      !Array.isArray(hand) || !hand.length || !state.turn_actor || state.turn_phase !== "play" || !isSelfSeat(state.turn_actor, self)) return null;
  const phase = skillAvailability(null, state, prompt, busy);
  const actions = (state.gift_actions || []).filter(action => {
    const card = hand[action.index];
    return Number.isInteger(action.index) && action.index >= 0 && action.id === `gift:${action.index + 1}` &&
      card && !card.hidden && card.gift_mark === true && action.name === card.name;
  });
  if (!actions.length) return null;
  return html`<section className="gift-action-rail" aria-label="手牌赠予" aria-busy=${busy}>
    <div className="gift-action-heading"><h3>赠予</h3><span>${busy ? "正在结算，请稍候" : selecting ? "先完成或取消当前手牌选择" : "另选一名角色；选人时可取消"}</span></div>
    <div className="gift-action-list">${actions.map(action => {
      const card = hand[action.index];
      const ready = phase.available && action.available === true && action.targets?.length > 0 && !selecting;
      const reason = busy ? "正在结算，请等待下一个提示" : selecting ? "请先完成或取消当前选择" : !phase.available ? phase.reason : !ready ? "当前没有可赠予的目标" : card.type === "毒" ? "确认目标后公开失去毒，先结算体力流失" : "选择目标后直接装入对应装备槽";
      const reasonId = `gift-reason-${action.index}`;
      return html`<div className="gift-action-control" key=${action.id} data-gift-action=${action.id}>
        <button type="button" className="btn gift-action-button" disabled=${!ready} aria-describedby=${reasonId}
          onClick=${() => { if (ready) onRespond(action.id); }}><${CardArt} card=${card} compact=${true} /><span>赠予${card.base_name || card.name}<small>手牌 ${action.index + 1} · ${SUIT_SYMBOL[card.suit] || ""}${card.rank_label || ""}</small></span></button>
        <span id=${reasonId} className=${`gift-action-reason ${card.type === "毒" ? "poison-warning" : ""}`}>${reason}</span>
      </div>`;
    })}</div>
    <details className="gift-rules" onKeyDown=${event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}>
      <summary>赠予与毒 · 查看规则</summary><p>${GIFT_RULES}</p><p className="poison-warning">${POISON_RULES}</p><p>战象会使赠予失败，赠物弃置；普通技能交给不属于赠予。摸到毒、尚未获得时的「展示交给」另行选择，不支付本次毒流失。</p>
    </details>
  </section>`;
}

function HeroSkillsWithEquipment(props) {
  return html`<${HeroSkills} ...${props} hero=${props.player ? playerEffectiveHero(props.player) : props.hero} />${props.player?.hero_form ? html`<${HeroProvenance} hero=${props.player.hero} />` : null}${props.self && props.prompt?.kind !== "play_card" ? html`<${EquipmentActions} state=${props.state} prompt=${props.prompt} busy=${props.busy} />` : null}`;
}

function PlayPhaseBar({
  state,
  prompt,
  onRespond,
  busy = false,
  mode,
  setMode,
  picked,
  setPicked,
  activeSkill,
  setActiveSkill,
}) {
  const hand = Array.isArray(state.players.self.hand) ? state.players.self.hand : [];
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
    if (!skillAvailability(skill, state, prompt).available) return;
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
    if (!activeSkill || !canConfirmSkill()) return;
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
    if (!activeSkill || !skillAvailability(activeSkill, state, prompt).available) return false;
    const n = picked.length;
    if (activeSkill.arg_mode === "one_card") return n === 1;
    if (activeSkill.arg_mode === "exactly_n") return n === needMin;
    if (activeSkill.arg_mode === "cards") return n >= needMin;
    if (activeSkill.arg_mode === "cards_or_all") {
      const targets = activeSkill.availability?.targets;
      return n === 0 || !targets || targets.some(t => t.available && t.hand_count >= n);
    }
    return false;
  }

  useLayoutEffect(() => {
    if(prompt.kind!=='play_card')return;
    const onKey=event=>{
      if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName))return;
      if(document.querySelector('.prompt-controls')?.disabled)return;
      if(event.key==='Escape'&&mode==='skill'){
        event.preventDefault();setMode('play');setActiveSkill(null);setPicked([]);return;
      }
      if(mode!=='play')return;
      const raw=skills.find(skill=>skill.hotkey?.toLowerCase()===event.key.toLowerCase());
      if(raw&&skillAvailability(raw,state,prompt).available){event.preventDefault();startSkill(raw);}
    };
    document.addEventListener('keydown',onKey);
    return ()=>document.removeEventListener('keydown',onKey);
  },[prompt.prompt_id,state,mode]);

  if (prompt.kind === "discard") {
    return html`<div className="action-dock">
      <div className="dock-tip">${prompt.message || "弃牌：点选一张手牌"}</div>
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
          ? `【${skillName(activeSkill)}】已选 ${picked.length} 张；${picked.length && !canConfirmSkill() ? "没有对手持有足够手牌，请减少选择或换全部" : "部分交换须不超过目标手牌数；也可直接换全部"}`
          : activeSkill.id==='治愈' ? `【治愈】选择2张不同手牌（${picked.length}/2），再选择受伤男性；每回合一次，取消不消耗` : `【${skillName(activeSkill)}】请选择符合条件的手牌（已选 ${picked.length}）`
        : mode === "zhangba"
          ? `${eq.weapon?.name || "丈八蛇矛"}：选择两张手牌当杀（${picked.length}/2）`
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

    <${EquipmentActions} state=${state} prompt=${prompt} onActivate=${action => { setMode("play"); setActiveSkill(null); setPicked([]); onRespond(action.command); }} />

    <${GiftActions} state=${state} prompt=${prompt} busy=${busy} selecting=${mode !== "play"} onRespond=${onRespond} />

    <${YoujianHandRules} cards=${hand} />
    <${OrdinaryWineRules} player=${state.players.self} />

    <div className="dock-main">
      <aside className="skill-rail">
        <div className="skill-rail-title">技能</div>
        ${skills.map(s => html`<${ActiveSkillButton}
          key=${s.id} skill=${s} hero=${playerEffectiveHero(state.players.self)} availability=${skillAvailability(s, state, prompt)}
          selected=${activeSkill?.id === s.id && mode === "skill"} onActivate=${startSkill} />`)}
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
              ${eq.weapon?.name === "芦叶枪" ? "芦叶" : "丈八"}
            </button>`
          : null}
      </aside>

      <div className="hand-stage">
        ${hand.map((card, index) => {
          const allowed = mode !== "skill" || cardMatchesFilter(card, filter);
          const wineBlocked = mode === "play" && !canUseOffensiveWineCard(card,state.players.self);
          const blocked = (mode === "skill" && !allowed) || mode === "eq" || wineBlocked;
          return html`<${CardView}
            key=${`${card.label || card.name}-${index}`}
            card=${card}
            selected=${picked.includes(index)}
            dimmed=${blocked}
            disabled=${blocked}
            contextualNote=${mode==="play"&&state.players.self.sgs_followup?.zhangni?.shizhi_active&&card.type==="闪"?"矢志：使用时当杀，实体为闪":null}
            disabledReason=${wineBlocked?"普通酒本实际回合已用；杀已消耗加伤也不刷新次数":null}
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

// Fifth-packet prompt context follows the actual callbacks, never the hero name.
const FIFTH_PROMPT_STAGES = new Set(['fuchou_start','fuchou_source_choice','fuchou_discard','zhiyu_materials','zhiyu_target','fenghuo_material','sheshen_start','sheshen_card','sheshen_target','juebie_target','juebie_confirm']);
function ResponseContext({state,prompt}) {
  if(isSgsConfirmedSupportPromptStage(prompt))return html`<${SgsConfirmedSupportResponseContext} state=${state} prompt=${prompt} CardView=${CardView} />`;
  if(isSgsObligationIdentityPromptStage(prompt))return html`<${SgsObligationIdentityResponseContext} state=${state} prompt=${prompt} CardView=${CardView} />`;
  if(isSgsFutureIdentityPrompt(prompt))return html`<${SgsFutureIdentityResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsIdentityNextPrompt(prompt))return html`<${SgsIdentityNextResponseContext} state=${state} prompt=${prompt} />`;
  if(isYxsModernPrompt(prompt))return html`<${YxsModernResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsFollowupPrompt(prompt))return html`<${SgsFollowupResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangFurtherPrompt(prompt))return html`<${SgsYijiangFurtherResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangMorePrompt(prompt))return html`<${SgsYijiangMoreResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangLaterPrompt(prompt))return html`<${SgsYijiangLaterResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangNextPrompt(prompt))return html`<${SgsYijiangNextResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsFuliRescueOwner(prompt,state))return html`<${SharedResponseContext} state=${state} prompt=${prompt} /><${SgsFuliRescueContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangFollowingPrompt(prompt))return html`<${SgsYijiangFollowingResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsYijiangPrompt(prompt))return html`<${SgsYijiangResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsMountainPrompt(prompt))return html`<${SgsMountainResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsForestPrompt(prompt))return html`<${SgsForestResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsFirePrompt(prompt))return html`<${SgsFireResponseContext} state=${state} prompt=${prompt} />`;
  if(isYoujianPrompt(prompt))return isYoujianPromptOwner(prompt,state)?html`<${YoujianPromptExplanation} prompt=${prompt} />`:null;
  if(isWangyunPrompt(prompt))return html`<${WangyunResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsNextIdentityPrompt(prompt))return html`<${SgsNextIdentityResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsWindPrompt(prompt))return html`<${SgsWindResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsFollowingPrompt(prompt))return html`<${SgsFollowingResponseContext} state=${state} prompt=${prompt} />`;
  if(isSgsBaseNextPrompt(prompt))return html`<${SgsBaseNextResponseContext} state=${state} prompt=${prompt} />`;
  if(isNinthPrompt(prompt))return html`<${NinthResponseContext} state=${state} prompt=${prompt} />`;
  if(isEighthPrompt(prompt))return html`<${EighthResponseContext} state=${state} prompt=${prompt} />`;
  const meta=prompt.meta||{},stage=meta.stage;
  if(isSeventhPrompt(prompt))return html`<${SeventhResponseContext} state=${state} prompt=${prompt} />`;
  if(GUARD_PROMPT_STAGES.includes(stage))return html`<${GuardResponseContext} state=${state} prompt=${prompt} />`;
  if (stage === 'gift_target' || (stage === 'draw_intercept' && meta.skill === '毒')) {
    const draw = stage === 'draw_intercept';
    return html`<section className="response-context youjian-context" data-response-stage=${stage}>
      <div className="response-kicker">${draw ? "摸到毒 · 尚未获得" : "赠予 · 选择目标"}</div>
      <strong>${draw ? "展示交给其他角色，或保留这张毒" : `${meta.card_name || "赠物"} · 确认目标后才支付`}</strong>
      <p>${draw ? "这张毒仍在摸牌处理中。现在展示交给其他角色，不属于赠予，也不支付本次毒的体力流失；保留后它才进入你的手牌。" : GIFT_RULES}</p>
      <p className="poison-warning">${POISON_RULES}</p>
      ${draw ? null : html`<small>战象目标已在选项中标注：赠予仍可选择，但会失败并弃置赠物。取消保留原手牌。</small>`}
    </section>`;
  }
  if(!FIFTH_PROMPT_STAGES.has(stage))return html`<${SharedResponseContext} state=${state} prompt=${prompt} />`;
  const skill=stage.startsWith('fuchou')?'复仇':stage.startsWith('zhiyu')?'治愈':stage.startsWith('fenghuo')?'烽火':stage.startsWith('sheshen')?'舍身':'诀别';
  const descriptions={
    fuchou_start:['受伤与救援已经完成','每次正数伤害事件只判定一次，不按伤害点数增加；可取消。非红桃才由伤害来源选择弃2张手牌或受1点普通伤害。'],
    fuchou_source_choice:['这是来源的必选决定','弃牌只能支付2张不同手牌，不能使用装备。选择受伤会继续完整减伤、转移及濒死救援流程。'],
    fuchou_discard:['必须选择2张不同手牌','已经选择弃牌，此窗口必须完成两张手牌成本；装备与判定牌不能代替。牌面仅你可见。'],
    zhiyu_materials:['2张不同手牌 · 每回合一次','已装备牌不能支付。选完后还要选择1名受伤男性；取消不扣牌或次数。'],
    zhiyu_target:['选择1名存活且受伤的男性','敌我不限、没有距离限制。自己与目标各回复1，不能超过上限；自己满血也可发动。取消会保留两张手牌和本回合次数。'],
    fenghuo_material:['弃1张已装备的牌 · 可重复发动','装备区（E）的实体牌才可支付，手牌装备不行。将对所有其他存活角色使用烽火狼烟，包含友军；逐人进行无懈、杀响应与伤害。取消不弃装备。'],
    sheshen_start:[`每点伤害一次 · 第 ${meta.point||1} / ${meta.points||1} 次`,'普通救援先结算，获救后才有此机会。可摸2张，再逐张分配本次新摸牌；可取消本次，后续伤害点仍各自询问。'],
    sheshen_card:['仅你可见 · 只分配本次新摸的2张','原有手牌和之前留下的牌不能加入。可逐张送给任意其他存活角色，也可保留所有剩余牌。已送出的牌不撤回。'],
    sheshen_target:['选择这1张新摸牌的受赠者','任意其他存活角色，包含敌方。可把两张送给同一人或分别送出；取消会结束本次分配，保留尚未送出的牌。'],
    juebie_target:['濒死入口 · 普通救援尚未开始','选择1名其他存活男性，敌我不限。选人后还需要最终确认；现在取消将继续正常救援，不消耗牌。'],
    juebie_confirm:['确认即阵亡 · 不可撤回','最终确认会放弃包括自己桃/酒及他人药/技能在内的全部救援。H手牌与E装备进入该男性手牌，J判定牌移入其判定区，同类延时效果重复的牌弃置。'],
  };
  const [title,description]=descriptions[stage];
  return html`<section className=${`response-context fifth-skill-context ${stage==='juebie_confirm'?'is-irreversible':''}`} data-skill-context=${skill} data-response-stage=${stage}>
    <div className="response-kicker">${skill} · ${stage==='juebie_confirm'?'最终决定':'当前结算'}</div><strong>${title}</strong><p>${description}</p>
    ${stage==='juebie_confirm'?html`<small>选择「取消，继续正常救援」仍可求药；确认后不能复活或撤销遗赠。</small>`:null}
  </section>`;
}

function PromptLayer({ state, prompt, onRespond, busy = false }) {
  const confirmedSupportSent = useRef(null);
  const confirmedSupportLatest = useRef(null);
  confirmedSupportLatest.current = {state,prompt,onRespond,busy};
  const obligationIdentitySent = useRef(null);
  const obligationIdentityLatest = useRef(null);
  obligationIdentityLatest.current = {state,prompt,onRespond,busy};
  const futureIdentitySent = useRef(null);
  // A refused session answer must release the same guard used by buttons and Escape.
  const futureIdentityAnswer = value => Promise.resolve(onRespond(value)).then(accepted => { if (accepted === false) throw new Error("Response was not accepted"); return accepted; });
  const futureIdentityRespond = value => sgsFutureIdentitySendOnce(futureIdentitySent,prompt?.prompt_id,busy,futureIdentityAnswer,value);
  const identityNextSent = useRef(null);
  const identityNextRespond = value => sgsIdentityNextSendOnce(identityNextSent,prompt?.prompt_id,busy,onRespond,value);
  const [picked, setPicked] = useState([]);
  const [mode, setMode] = useState("play");
  const [activeSkill, setActiveSkill] = useState(null);

  // All modal prompts use native buttons and a contained keyboard focus cycle.
  // Escape only sends an explicit cancellation option; mandatory reveals stay open.
  useEffect(() => {
    if (!prompt || ["play_card", "discard"].includes(prompt.kind)) return;
    const dialog = document.querySelector(".prompt-controls [role='dialog']");
    if (!dialog) return;
    const previous = document.activeElement;
    const focusables = () => [...dialog.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), summary, [tabindex='0']")];
    (prompt.meta?.stage === 'juebie_confirm' ? dialog.querySelector('[data-death-cancel]') : focusables()[0] || dialog)?.focus();
    const keydown = event => {
      if (event.key === "Tab") {
        const elements = focusables();
        if (!elements.length) { event.preventDefault(); return; }
        const current = elements.indexOf(document.activeElement);
        if (event.shiftKey && current <= 0) { event.preventDefault(); elements.at(-1).focus(); }
        else if (!event.shiftKey && (current === -1 || current === elements.length - 1)) { event.preventDefault(); elements[0].focus(); }
      }
      if (event.key === "Escape") {
        // Packet routing stays fail-closed and shares the exact same lock as buttons.
        // Read current state/busy here: focus setup only reruns when the prompt ID changes.
        if (isSgsConfirmedSupportPromptStage(prompt)) {
          const now = confirmedSupportLatest.current;
          const cancel = sgsConfirmedSupportCancelOption(now.prompt,now.state);
          if (cancel && !dialog.closest("fieldset")?.disabled) {
            event.preventDefault();
            sgsConfirmedSupportSendOnce(confirmedSupportSent,now.prompt.prompt_id,now.busy,now.onRespond,cancel);
          }
          return;
        }
        if (isSgsObligationIdentityPromptStage(prompt)) {
          const now = obligationIdentityLatest.current;
          const cancel = sgsObligationIdentityCancelOption(now.prompt,now.state);
          if (cancel && !dialog.closest("fieldset")?.disabled) {
            event.preventDefault();
            sgsObligationIdentitySendOnce(obligationIdentitySent,now.prompt.prompt_id,now.busy,now.onRespond,cancel);
          }
          return;
        }
        if (isSgsFutureIdentityPromptStage(prompt) && isSgsFutureIdentityMandatory(prompt)) return;
        if (isSgsIdentityNextPromptStage(prompt) && isSgsIdentityNextMandatory(prompt)) return;
        if (isSgsFollowupPromptStage(prompt) && isSgsFollowupMandatory(prompt)) return;
        if (isSgsYijiangFurtherPromptStage(prompt) && isSgsYijiangFurtherMandatory(prompt)) return;
        if (isSgsYijiangMorePromptStage(prompt) && isSgsYijiangMoreMandatory(prompt)) return;
        if (isSgsYijiangLaterPromptStage(prompt) && isSgsYijiangLaterMandatory(prompt)) return;
        if (isSgsYijiangNextPromptStage(prompt) && isSgsYijiangNextMandatory(prompt)) return;
        if (isSgsYijiangFollowingPromptStage(prompt) && (prompt.meta?.mandatory || ["zhiman_obtain","jieyue_discard","yaowu_choice"].includes(prompt.meta?.stage))) return;
        if (isSgsYijiangPromptStage(prompt) && (prompt.meta?.mandatory || ["mingce_sha_target","mingce_recipient_choice"].includes(prompt.meta?.stage))) return;
        const futureCancel = {dujin_choice:"decline",yingjian_target:"decline",xiaoguo_cost:"pass"}[prompt.meta?.stage];
        const cancel = isSgsFutureIdentityPromptStage(prompt) ? prompt.options?.find(o => o.id === futureCancel && !o.disabled)?.id : prompt.kind === "confirm" ? "n" : prompt.options?.find(o => (o.id === "decline" && ["jiangchi_choice","jieyue_contribute"].includes(prompt.meta?.stage)) || o.id === "cancel" || o.id === "pass" || o.id === "0" || (o.id === "refuse" && prompt.meta?.stage === "choulue_gift") || (o.id === "keep" && ["sheshen_card", "draw_intercept"].includes(prompt.meta?.stage)))?.id;
        if (cancel && !dialog.closest("fieldset")?.disabled) { event.preventDefault(); if(isSgsFutureIdentityPromptStage(prompt))futureIdentityRespond(cancel);else if(isSgsIdentityNextPromptStage(prompt))identityNextRespond(cancel);else onRespond(cancel); }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); if (previous?.isConnected && (document.activeElement === document.body || dialog.contains(document.activeElement))) previous.focus(); };
  }, [prompt?.prompt_id]);

  // The prompt_id key remounts this component for every new prompt. A passive
  // reset effect here could erase a quick selection made just after mounting.

  if (!prompt) return null;
  // Fail closed before reading message/options: prompts can contain private hand labels.
  if ((isSgsConfirmedSupportPromptStage(prompt) && !isSgsConfirmedSupportPromptOwner(prompt,state)) || (isSgsObligationIdentityPromptStage(prompt) && !isSgsObligationIdentityPromptOwner(prompt,state)) || (isSgsFutureIdentityPromptStage(prompt) && !isSgsFutureIdentityPromptOwner(prompt,state)) || (isSgsIdentityNextPromptStage(prompt) && !isSgsIdentityNextPromptOwner(prompt,state)) || (isSgsZhangfenPromptStage(prompt) && !isSgsZhangfenPromptOwner(prompt,state)) || (isYxsModernPromptStage(prompt) && !isYxsModernPromptOwner(prompt,state)) || (isSgsFollowupPromptStage(prompt) && !isSgsFollowupPromptOwner(prompt,state)) || (isSgsYijiangFurtherPromptStage(prompt) && !isSgsYijiangFurtherPromptOwner(prompt,state)) || (isSgsYijiangMorePromptStage(prompt) && !isSgsYijiangMorePromptOwner(prompt,state)) || (isSgsYijiangLaterPromptStage(prompt) && !isSgsYijiangLaterPromptOwner(prompt,state)) || (isSgsYijiangNextPromptStage(prompt) && !isSgsYijiangNextPromptOwner(prompt,state)) || (isSgsFuliRescuePrompt(prompt) && !isSgsFuliRescueOwner(prompt,state)) || (isSgsJieyueConversionPrompt(prompt) && !isSgsJieyueConversionOwner(prompt,state)) || (isSgsYijiangFollowingPromptStage(prompt) && !isSgsYijiangFollowingPromptOwner(prompt,state)) || (isSgsYijiangPromptStage(prompt) && !isSgsYijiangPromptOwner(prompt,state)) || (isSgsMountainPromptStage(prompt) && !isSgsMountainPromptOwner(prompt,state)) || (isSgsForestPromptStage(prompt) && !isSgsForestPromptOwner(prompt,state)) || (isSgsFirePromptStage(prompt) && !isSgsFirePromptOwner(prompt,state)) || (isYoujianPromptStage(prompt) && !isYoujianPromptOwner(prompt,state)) || (isWangyunPrompt(prompt) && !isWangyunPromptOwner(prompt,state)) || (isSgsFollowingPrompt(prompt) && !isSgsFollowingPromptOwner(prompt, state)) || (isSgsWindPrompt(prompt) && !isSgsWindPromptOwner(prompt, state)) || (isSgsNextIdentityPrompt(prompt) && !isSgsNextIdentityPromptOwner(prompt, state))) {
    return html`<div className="thinking-dock" role="status">等待其他角色完成响应…</div>`;
  }
  if ((prompt.meta?.private_to && !isSelfSeat(prompt.meta.private_to, state.players.self)) ||
      (prompt.player_id && !isSelfSeat(prompt.player_id, state.players.self))) {
    return html`<div className="thinking-dock" role="status">等待其他角色完成响应…</div>`;
  }

  if (isSgsConfirmedSupportPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" tabIndex=${-1} aria-label=${SGS_CONFIRMED_SUPPORT_PROMPT_CONTEXTS[prompt.meta.stage][1]} data-response-stage=${prompt.meta.stage}>
      <${SgsConfirmedSupportResponseContext} state=${state} prompt=${prompt} CardView=${CardView} />
      <${SgsConfirmedSupportChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} responseGuard=${confirmedSupportSent} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsObligationIdentityPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" tabIndex=${-1} aria-label=${SGS_OBLIGATION_IDENTITY_PROMPT_CONTEXTS[prompt.meta.stage][1]} data-response-stage=${prompt.meta.stage}>
      <${SgsObligationIdentityResponseContext} state=${state} prompt=${prompt} CardView=${CardView} />
      <${SgsObligationIdentityChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} responseGuard=${obligationIdentitySent} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsFutureIdentityPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsFutureIdentityResponseContext} state=${state} prompt=${prompt} />
      <${SgsFutureIdentityChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${futureIdentityAnswer} responseGuard=${futureIdentitySent} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsIdentityNextPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsIdentityNextResponseContext} state=${state} prompt=${prompt} />
      <${SgsIdentityNextChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} responseGuard=${identityNextSent} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isYxsModernPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${YxsModernResponseContext} state=${state} prompt=${prompt} />
      <${YxsModernChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} />
    </div></div>`;
  }

  if (isSgsZhangfenPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsZhangfenResponseContext} state=${state} prompt=${prompt} />
      <${SgsZhangfenChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsFollowupPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsFollowupResponseContext} state=${state} prompt=${prompt} />
      <${SgsFollowupChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangFurtherPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangFurtherResponseContext} state=${state} prompt=${prompt} />
      <${SgsYijiangFurtherChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangMorePrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangMoreResponseContext} state=${state} prompt=${prompt} />
      <${SgsYijiangMoreChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangLaterPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangLaterResponseContext} state=${state} prompt=${prompt} />
      <${SgsYijiangLaterChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangNextPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangNextResponseContext} state=${state} prompt=${prompt} />
      <${SgsYijiangNextChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangFollowingPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangFollowingResponseContext} state=${state} prompt=${prompt} />
      <${SgsYijiangFollowingChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (isSgsYijiangPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsYijiangResponseContext} state=${state} prompt=${prompt} />
      ${prompt.meta.stage==='pojun_cards'?html`<${SgsYijiangPojunChoices} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} />`:html`<${SgsYijiangChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />`}
    </div></div>`;
  }

  if (isSgsMountainPrompt(prompt) && ["choice","select_hand"].includes(prompt.kind)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide ${prompt.meta.stage==='guanxing_order'?'guanxing-dialog':''}" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${SgsMountainResponseContext} state=${state} prompt=${prompt} />
      ${prompt.kind==='select_hand'?html`<${SgsMountainMaterialChoices} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />`:prompt.meta.stage==='guanxing_order'?html`<${SgsMountainGuanxingChoices} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} />`:html`<${SgsMountainChoiceButtons} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />`}
    </div></div>`;
  }

  if (prompt.kind === "choice" && isYoujianPrompt(prompt)) {
    const context=getYoujianPromptExplanation(prompt);
    return html`<div className="modal-mask"><div className="sgs-dialog card-response-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message} data-response-stage=${prompt.meta.stage}>
      <p>${prompt.message}</p><${YoujianPromptExplanation} prompt=${prompt} />
      <${YoujianPromptOptions} prompt=${prompt} state=${state} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
      <details className="youjian-current-rule" onKeyDown=${event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}}}>
       <summary>查看${context.card_name}完整规则与来源</summary><${YoujianCardRules} card=${context.card_id}/>
      </details>
    </div></div>`;
  }

  if (isSgsJieyueConversionOwner(prompt,state)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide card-response-dialog" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p><${SharedResponseContext} state=${state} prompt=${prompt} /><${SgsJieyueConversionContext} prompt=${prompt} />
      <${SgsJieyueConversionChoices} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (prompt.kind === "rescue" || (prompt.kind === "choice" && !FIFTH_PROMPT_STAGES.has(prompt.meta?.stage) && !GUARD_PROMPT_STAGES.includes(prompt.meta?.stage) && !isSeventhPrompt(prompt) && !isEighthPrompt(prompt) && !isNinthPrompt(prompt) && !isSgsBaseNextPrompt(prompt) && !isSgsFollowingPrompt(prompt) && !isSgsWindPrompt(prompt) && !isSgsNextIdentityPrompt(prompt) && !isWangyunPrompt(prompt) && !isSgsFirePrompt(prompt) && !isSgsForestPrompt(prompt) && !isSgsMountainPrompt(prompt) && !["gift_target", "draw_intercept"].includes(prompt.meta?.stage) && (prompt.meta?.card_name || prompt.meta?.equipment || prompt.meta?.select_count || prompt.meta?.response_required || prompt.meta?.material_zones || prompt.meta?.skill === "筹略"))) {
    return html`<${CardResponseDialog} state=${state} prompt=${prompt} onRespond=${onRespond} />`;
  }

  if (prompt.kind === "choice" && isWangyunPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p><${WangyunResponseContext} state=${state} prompt=${prompt} />
      <${WangyunPromptOptions} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (prompt.kind === "choice" && isNinthPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p><${NinthResponseContext} state=${state} prompt=${prompt} />
      <${JianxiongMaterialChoices} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (prompt.kind === "choice" && isEighthPrompt(prompt) && prompt.meta.stage === 'yizhuang_form') {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p><${EighthResponseContext} state=${state} prompt=${prompt} />
      <${YizhuangFormChoices} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} />
    </div></div>`;
  }

  if (prompt.kind === "confirm") {
    return html`<div className="modal-mask">
      <div className="sgs-dialog" role="dialog" aria-modal="true" aria-label=${prompt.message}>
        <p>${prompt.message}</p>
        <${ResponseContext} state=${state} prompt=${prompt} />
        <div className="dialog-actions">
          <button type="button" className=${`btn primary ${prompt.meta?.stage==='juebie_confirm'?'death-confirm':''}`} onClick=${() => onRespond("y")}>${prompt.meta?.stage==='juebie_confirm'?'确认诀别并阵亡':'确定'}</button>
          <button type="button" className="btn" data-death-cancel=${prompt.meta?.stage==='juebie_confirm'?'true':undefined} onClick=${() => onRespond("n")}>${prompt.meta?.stage==='juebie_confirm'?'取消，继续正常救援':'取消'}</button>
        </div>
      </div>
    </div>`;
  }

  // The engine sends peek labels only in the owner's pending prompt. Do not
  // derive them from game state, deck snapshots, opponents' hands, or old UI state.
  if (prompt.kind === "choice" && ["观星","占卜"].includes(prompt.meta?.skill)) {
    const owner = prompt.meta.private_to;
    if (!owner || !isSelfSeat(owner, state.players.self) || !isSelfSeat(prompt.player_id, state.players.self)) {
      return html`<div className="modal-mask"><div className="sgs-dialog" role="status">等待牌序技能结算</div></div>`;
    }
    const preview = prompt.meta.preview || [];
    const labelFor = id => preview.find(card => String(card.id) === String(id))?.label || `牌 ${id}`;
    const orderedZone = (title, ids, description) => html`<section className="guanxing-zone" aria-label=${title}>
      <h3>${title}<span>${description}</span></h3>
      ${ids.length ? html`<ol>${ids.map(id => html`<li key=${id}>${labelFor(id)}</li>`)}</ol>` : html`<p>尚未放牌</p>`}
    </section>`;
    return html`<div className="modal-mask"><div className="sgs-dialog wide guanxing-dialog" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p>
      <p className="guanxing-hint">仅你可见。每区先选的牌先被摸到；选完后一次性重排，再继续判定和摸牌。</p>
      <div className="guanxing-zones">
        ${orderedZone('牌堆顶', prompt.meta.top || [], '下次先摸')}
        ${orderedZone('牌堆底', prompt.meta.bottom || [], '其余牌摸完后')}
      </div>
      <div className="guanxing-remaining" aria-label="待排列的牌">
        ${preview.filter(card => (prompt.meta.remaining || []).map(String).includes(String(card.id))).map(card => html`<section className="guanxing-card" key=${card.id}>
          <strong>${card.label}</strong><div className="dialog-actions wrap">
            ${(prompt.options || []).filter(opt => opt.id === `top:${card.id}` || opt.id === `bottom:${card.id}`).map(opt => html`<button key=${opt.id} type="button" className="btn option" data-option-id=${opt.id} onClick=${() => onRespond(opt.id)}>${opt.label}</button>`)}
          </div>
        </section>`)}
      </div>
      <div className="dialog-actions">${(prompt.options || []).filter(opt => !/^(?:top|bottom):/.test(opt.id)).map(opt => html`<button key=${opt.id} type="button" className="btn" data-option-id=${opt.id} onClick=${() => onRespond(opt.id)}>${opt.label}</button>`)}</div>
    </div></div>`;
  }

  if (!["play_card", "discard", "select_hand"].includes(prompt.kind) && prompt.options?.length) {
    return html`<div className="modal-mask">
      <div className="sgs-dialog" role="dialog" aria-modal="true" aria-label=${prompt.message}>
        <p>${prompt.message}</p>
        <${ResponseContext} state=${state} prompt=${prompt} />
        <div className="dialog-actions wrap">
          ${prompt.options.map(
            (opt) =>
              html`<button key=${opt.id} type="button" className="btn option" data-option-id=${opt.id} disabled=${!!opt.disabled} onClick=${() => onRespond(opt.id)}>
                ${opt.label}
              </button>`
          )}
        </div>
      </div>
    </div>`;
  }

  if (prompt.kind === "select_hand" && isSgsForestPrompt(prompt)) {
    return html`<div className="modal-mask"><div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p><${SgsForestResponseContext} state=${state} prompt=${prompt} />
      <${SgsForestMaterialChoices} key=${prompt.prompt_id} state=${state} prompt=${prompt} onRespond=${onRespond} busy=${busy} CardView=${CardView} />
    </div></div>`;
  }

  if (prompt.kind === "select_hand") {
    const need = prompt.max_count || 1;
    const handOptions=(prompt.options||[]).filter(option=>/^hand:\d+$/.test(option.id));
    const allowedIndices=handOptions.length?new Set(handOptions.map(option=>Number(option.id.split(':')[1])-1)):null;
    const cancelOption=(prompt.options||[]).find(option=>['cancel','0','pass'].includes(option.id));
    const ownerSeat = prompt.meta?.owner_seat;
    const owner = ownerSeat
      ? [state.players.self, ...(state.players.opponents || []), ...Object.values(state.players)]
          .find((player) => player?.seat === ownerSeat)
      : state.players.self;
    const hand = owner && isSelfSeat(owner.seat, state.players.self)
      ? owner.hand || []
      : Array.from({ length: owner?.hand_count || 0 }, () => ({ hidden: true }));
    return html`<div className="modal-mask">
      <div className="sgs-dialog wide" role="dialog" aria-modal="true" aria-label=${prompt.message}>
        <p>${prompt.message}（${picked.length}/${need}）</p>
        <${ResponseContext} state=${state} prompt=${prompt} />
        <div className="hand-stage flat">
          ${hand.map(
            (card, index) =>
              html`<${CardView}
                key=${index}
                card=${card}
                selected=${picked.includes(index)}
                number=${index + 1}
                disabled=${!!allowedIndices && !allowedIndices.has(index)}
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
        ${cancelOption?html`<button type="button" className="btn" data-option-id=${cancelOption.id} onClick=${()=>onRespond(cancelOption.id)}>${cancelOption.label}</button>`:null}
      </div>
    </div>`;
  }

  if (prompt.kind === "play_card" || prompt.kind === "discard") {
    return html`<${PlayPhaseBar}
      state=${state}
      prompt=${prompt}
      onRespond=${onRespond}
      busy=${busy}
      mode=${mode}
      setMode=${setMode}
      picked=${picked}
      setPicked=${setPicked}
      activeSkill=${activeSkill}
      setActiveSkill=${setActiveSkill}
    />`;
  }

  return html`<div className="modal-mask">
    <div className="sgs-dialog" role="dialog" aria-modal="true" aria-label=${prompt.message}>
      <p>${prompt.message}</p>
      <form
        onSubmit=${(e) => {
          e.preventDefault();
          onRespond(String(new FormData(e.currentTarget).get("value") || ""));
        }}
      >
        <input name="value" className="text-input" aria-label=${prompt.message} autoFocus autoComplete="off" />
        <button type="submit" className="btn primary">提交</button>
      </form>
    </div>
  </div>`;
}

// The browser session is the only game transport. All rules, AI, and saves stay local.
function useLocalMatch() {
  const [state, setState] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [logs, setLogs] = useState([]);
  const [session, setSession] = useState(null);
  const [flash, setFlash] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const matchRef = useRef(null);
  const publicStateRef = useRef(null);
  const promptRef = useRef(null);
  const responseRef = useRef(null);
  const startingRef = useRef(false);
  const generationRef = useRef(0);
  const logId = useRef(0);
  const flashTimer = useRef(null);
  const saveUnavailableRef = useRef(false);

  const refreshSave = useCallback(() => {
    try { setHasSaved(Boolean(matchRef.current?.hasSave())); }
    catch { setHasSaved(false); }
  }, []);

  const makeMatch = useCallback(() => {
    const generation = ++generationRef.current;
    matchRef.current?.close();
    const reportError = (err) => {
      if (generation !== generationRef.current) return;
      setError(typeof err === "string" ? err : err?.message || "操作未完成，请重试或返回选将。");
    };
    const match = new LocalMatch({
      onError: reportError,
      onMessage: (data) => {
        if (generation !== generationRef.current) return;
        if (data.type === "state" && data.state) {
          if (saveUnavailableRef.current && data.state.save_status === "saved") setError("");
          saveUnavailableRef.current = data.state.save_status === "unavailable";
          publicStateRef.current=data.state;
          setState(data.state);
          if (["ended", "finished"].includes(data.state.phase) || data.state.winner) {
            setPrompt(null);
            promptRef.current = null;
            responseRef.current = null;
            setBusy(false);
          }
        }
        if (data.type === "session") setSession(data.session);
        if (data.type === "prompt") {
          promptRef.current = data.prompt;
          responseRef.current = null;
          setPrompt(data.prompt);
          setBusy(!data.prompt);
        }
        if (data.type === "event" && data.event) {
          const privateTo=data.event.payload?.private_to;
          if(privateTo&&!isSelfSeat(privateTo,publicStateRef.current?.players?.self))return;
          const id = ++logId.current;
          setLogs((prev) => [{ id, message: data.event.message, type: data.event.type, reveal: data.event.type==='pindian_reveal'&&!privateTo?data.event.payload:null }, ...prev].slice(0, 100));
          if (/伤害|受伤/.test(data.event.message || "")) {
            clearTimeout(flashTimer.current);
            setFlash("damage");
            flashTimer.current = setTimeout(() => setFlash(null), 500);
          }
        }
        if (data.type === "error") reportError(data.message);
        refreshSave();
      },
    });
    matchRef.current = match;
    return match;
  }, [refreshSave]);

  useEffect(() => {
    // An eager click can launch before mount effects run; do not close that match.
    if (!matchRef.current) makeMatch();
    refreshSave();
    const onStorage = (event) => {
      if (event.key === SAVE_KEY || event.key === null) refreshSave();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      ++generationRef.current;
      matchRef.current?.close();
      clearTimeout(flashTimer.current);
      window.removeEventListener("storage", onStorage);
    };
  }, [makeMatch, refreshSave]);

  const launch = useCallback(async (options) => {
    if (startingRef.current) return false;
    startingRef.current = true;
    setBusy(true);
    setError("");
    setState(null);
    setPrompt(null);
    promptRef.current = null;
    responseRef.current = null;
    setLogs([]);
    setFlash(null);
    setSession(null);
    const match = makeMatch();
    try {
      if (options) {
        await match.create(options);
      } else if (!(await match.resume())) {
        setError(current => current || "未能读取存档。可以重新开局，原存档已保留。");
        return false;
      }
      return true;
    } catch (err) {
      setError(err?.message || "对局未能启动，请重新开局。");
      return false;
    } finally {
      startingRef.current = false;
      setBusy(false);
      refreshSave();
    }
  }, [makeMatch, refreshSave]);

  const respond = useCallback(async (value, promptId) => {
    const pid = promptId || promptRef.current?.prompt_id;
    if (!pid || responseRef.current === pid || pid !== promptRef.current?.prompt_id) return false;
    responseRef.current = pid;
    setBusy(true);
    if (!saveUnavailableRef.current) setError("");
    try {
      const accepted = await matchRef.current.respond(pid, value == null ? "" : String(value));
      if (!accepted && promptRef.current?.prompt_id === pid) {
        setError("这次操作未生效，请重新选择。若仍无法继续，可从存档恢复。");
      }
      return accepted;
    } catch (err) {
      setError(err?.message || "操作未完成，可重试或从存档恢复。");
      return false;
    } finally {
      if (responseRef.current === pid) responseRef.current = null;
      setBusy(false);
      refreshSave();
    }
  }, [refreshSave]);

  const leave = useCallback(() => {
    ++generationRef.current;
    matchRef.current?.close();
    setPrompt(null);
    promptRef.current = null;
    responseRef.current = null;
    setBusy(false);
    refreshSave();
  }, [refreshSave]);

  const clearSave = useCallback(() => {
    try {
      const cleared = matchRef.current?.clearSave();
      refreshSave();
      if (cleared !== false) setError("");
    } catch (err) { setError(err?.message || "未能清除存档，请检查浏览器存储权限。"); }
  }, [refreshSave]);

  return { state, prompt, logs, session, flash, error, setError, busy, hasSaved, launch, respond, leave, clearSave };
}

function HeroPickPanel({ heroes, hero, onPick, compact = false }) {
  const [query,setQuery]=useState("");
  const [source,setSource]=useState("all");
  const filtered=heroes.filter(h=>(heroMatchesQuery(h,query)||sgsConfirmedSupportSearchText(h.id).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))&&heroMatchesSource(h,source));
  const selected = findHeroByIdentity(heroes, hero) || heroes[0];
  return html`<div className=${`hero-pick ${compact ? "compact" : ""}`}>
    <div className="home-hero-preview">
      <img
        src=${heroPortraitSource(selected)}
        alt=${heroDisplayName(selected)}
        className="home-hero-img"
      />
      <div className="home-hero-meta">
        <strong>${heroDisplayName(selected) || "选择武将"}</strong>
        <span className="hero-hp">${selected ? `${selected.max_hp} 点体力` : ""}</span>
        ${selected
          ? html`<div className="skill-block">
              <${HeroSkills} hero=${selected} />
            </div>`
          : null}
      </div>
    </div>
    <label className="hero-search">查找英雄 / 技能 / 来源别名<input type="search" value=${query} onChange=${event=>setQuery(event.target.value)} placeholder="例如：岳飞、赵云、武穆" /></label>
    <label className="hero-search" htmlFor="hero-source-filter">来源筛选
      <select id="hero-source-filter" value=${source} onChange=${event=>setSource(event.target.value)}>
        <option value="all">全部已实现人物</option><option value="yxs">英雄杀来源</option><option value="sgs">三国杀来源（含合并）</option><option value="original">原创江湖人物</option>
      </select>
      <span role="status">${filtered.length} / ${heroes.length} 位 · 仅已实现 · 合并来源可同时出现在两类</span>
    </label>
    <div className=${`hero-gallery ${compact ? "compact" : ""}`}>
      ${filtered.map(
        (h) => html`<button
          key=${heroIdentityKey(h)}
          type="button"
          className=${`hero-chip ${hero === heroIdentityKey(h) ? "on" : ""}`}
          onClick=${() => onPick(heroIdentityKey(h))}
          aria-pressed=${hero === heroIdentityKey(h)}
          aria-label=${`选择${heroDisplayName(h)}`} data-hero-key=${heroIdentityKey(h)}
        >
          <img src=${heroPortraitSource(h)} alt=${heroDisplayName(h)} />
          <span className="chip-name">${heroDisplayName(h)}</span>
          <span className="chip-skill">${h.skill_name}</span>
        </button>`
      )}
    </div>
    ${filtered.length ? null : html`<p className="config-hint">没有找到对应英雄或来源别名。</p>`}
  </div>`;
}

// Configuration is separate from the drawn opponents: random stays random on restart.
// Whitelist the ordinary setup fields, so retired options never enter a new match.
function normalizeMatchConfig(config, heroes) {
  const index = (key) => {
    const id = config?.[key.replace("_index", "_id")];
    // Persisted identities are authoritative; an obsolete index must not select
    // whichever different hero now happens to occupy that position.
    if (id !== undefined) return id == null ? null : heroes.find((h) => h.id === id)?.index ?? null;
    const value = config?.[key];
    return Number.isInteger(value) && heroes.some((h) => h.index === value) ? value : null;
  };
  return {
    hero_index: index("hero_index") ?? heroes[0]?.index ?? 0,
    mode: config?.mode === "ai2" ? "ai2" : "ai",
    ai_hero_index: index("ai_hero_index"),
    ai2_hero_index: index("ai2_hero_index"),
  };
}

function savedMatchConfig(heroes) {
  // Reading the configuration must never replace or replay the saved game.
  try { const saved=JSON.parse(localStorage.getItem(SAVE_KEY)); return normalizeMatchConfig(LocalMatch.isCurrentSave?.(saved)?saved.config:null, heroes); }
  catch { return normalizeMatchConfig(null, heroes); }
}

const AI_HERO_CONFLICT_MESSAGE = "两名人机不能使用同一英雄。请为其中一名选择其他英雄，或设为随机。";
function duplicateAiHeroes(config, heroes) {
  if (config?.mode !== "ai2" || config.ai_hero_index == null || config.ai2_hero_index == null) return false;
  const first = heroes.find(hero => hero.index === config.ai_hero_index);
  const second = heroes.find(hero => hero.index === config.ai2_hero_index);
  return Boolean(first?.id && first.id === second?.id);
}

function AiHeroSelect({ id, label, heroes, value, onChange, disabled, excludedHeroId = null, excludedBy = "另一名人机", invalid = false }) {
  const [query,setQuery]=useState("");
  const selected=heroes.find(h=>h.index===value);
  const matches=heroes.filter(h=>(heroMatchesQuery(h,query)||sgsConfirmedSupportSearchText(h.id).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
  // Searching never replaces the user's current choice or weakens the unique-AI rule.
  const shown=selected&&!matches.includes(selected)?[selected,...matches]:matches;
  return html`<div className="ai-hero-picker">
    <label htmlFor=${id}>${label}</label>
    <label className="hero-search" htmlFor=${`${id}-search`}>
      <input id=${`${id}-search`} type="search" aria-label=${`${label}搜索`} value=${query} disabled=${disabled}
        style=${{minWidth:0,width:"100%"}} placeholder="搜英雄、技能或来源别名" onChange=${event=>setQuery(event.target.value)} />
    </label>
    <select id=${id} aria-label=${label} value=${value ?? "random"} disabled=${disabled} aria-invalid=${invalid || undefined} aria-describedby=${invalid ? "ai-hero-rule ai-hero-conflict" : "ai-hero-rule"} onChange=${(event) => onChange(event.target.value === "random" ? null : Number(event.target.value))}>
      <option value="random">随机英雄（每局抽选）</option>
      ${shown.map((h) => html`<option key=${h.index} value=${h.index} disabled=${h.id === excludedHeroId}>${heroDisplayName(h)}${query.trim()&&h.aliases?.length ? ` · ${h.aliases.join(" / ")}` : ""}${h.id === excludedHeroId ? `（${excludedBy} 已选）` : selected===h&&!matches.includes(h)?"（保留当前选择）":""}</option>`)}
    </select>
    ${query.trim() ? html`<span className="config-hint" role="status">匹配 ${matches.length} 位；搜索不改变当前选择</span>` : null}
    ${selected ? html`<span className="ai-hero-preview"><img src=${heroPortraitSource(selected)} alt="" /><span>${selected.skill_name}</span></span>` : null}
  </div>`;
}

function App() {
  const [screen, setScreen] = useState("home");
  const [heroes] = useState(() => LocalMatch.heroes());
  const [initialConfig] = useState(() => savedMatchConfig(heroes));
  const [hero, setHero] = useState(() => heroes.find((h) => h.index === initialConfig.hero_index)?.id || heroes[0]?.id || "");
  const [gameMode, setGameMode] = useState(initialConfig.mode);
  const [aiHero, setAiHero] = useState(initialConfig.ai_hero_index);
  const [ai2Hero, setAi2Hero] = useState(initialConfig.ai2_hero_index);
  const [logOpen, setLogOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const launchRef = useRef(false);
  const match = useLocalMatch();
  const { state, prompt, logs, session, flash, error, setError, busy, hasSaved, launch, respond, leave, clearSave } = match;
  const aiHeroConflict = duplicateAiHeroes({mode:gameMode, ai_hero_index:aiHero, ai2_hero_index:ai2Hero}, heroes);
  const ended = ["ended", "finished"].includes(state?.phase) || Boolean(state?.winner);
  const phaseLabel = ended ? "对局结束" : state?.turn_phase === "play" && (state?.play_phase_context?.source_skill === "sgs.dangxian" || state?.play_phase_source_skill === "sgs.dangxian") ? "当先 · 额外出牌（准备前，同一回合）" : state?.turn_phase === "prepare" ? (["观星","占卜","玉步"].includes(prompt?.meta?.skill) ? `准备阶段 · ${prompt.meta.skill}` : "准备阶段") : state?.turn_phase === "end_phase" ? (prompt?.meta?.skill ? `结束阶段 · ${prompt.meta.skill}` : "结束阶段") : busy ? "正在结算" : !prompt ? "对手行动中" : {
    play_card: "出牌阶段", discard: "弃牌阶段", confirm: "等待回应", choice: "选择目标 / 效果",
    hero_select: "选择英雄", select_target_card: "选择对手牌", select_hand: "选择手牌", rescue: "濒死求桃",
  }[prompt.kind] || "等待回应";

  useEffect(() => {
    if (!session?.config) return;
    const config = normalizeMatchConfig(session.config, heroes);
    setHero(heroes.find((h) => h.index === config.hero_index)?.id || heroes[0]?.id || "");
    setGameMode(config.mode);
    setAiHero(config.ai_hero_index);
    setAi2Hero(config.ai2_hero_index);
  }, [session, heroes]);

  async function start(options) {
    if (launchRef.current) return;
    // Validate again at the launch boundary, including persisted configurations.
    if (duplicateAiHeroes(options || savedMatchConfig(heroes), heroes)) {
      setConfirm(null); setError(AI_HERO_CONFLICT_MESSAGE); return;
    }
    launchRef.current = true;
    setConfirm(null);
    setScreen("table");
    const ok = await launch(options);
    if (!ok) setScreen("home");
    launchRef.current = false;
  }

  function startAi() {
    if (busy || launchRef.current || confirm) return;
    if (aiHeroConflict) { setError(AI_HERO_CONFLICT_MESSAGE); return; }
    const selected = findHeroByIdentity(heroes, hero);
    const options = { hero_index: selected?.index ?? 0, mode: gameMode, ai_hero_index: aiHero };
    if (gameMode === "ai2") options.ai2_hero_index = ai2Hero;
    if (hasSaved) setConfirm({ kind: "new", options });
    else start(options);
  }

  function goHome(force = false) {
    if (busy || launchRef.current || (!force && confirm)) return;
    if (!force && state?.save_status === "unavailable") { setConfirm({ kind: "leave" }); return; }
    leave();
    setScreen("home");
    setConfirm(null);
  }

  function restart() {
    if (busy || launchRef.current || confirm) return;
    const selected = findHeroByIdentity(heroes, state?.players?.self?.hero?.id);
    const config = normalizeMatchConfig(session?.config || state?.config || {
      hero_index: selected?.index ?? 0,
      mode: session?.mode || (state?.mode === "1v2" ? "ai2" : "ai"),
    }, heroes);
    const options = { hero_index: config.hero_index, mode: config.mode, ai_hero_index: config.ai_hero_index };
    if (config.mode === "ai2") options.ai2_hero_index = config.ai2_hero_index;
    if (duplicateAiHeroes(options, heroes)) { setError(AI_HERO_CONFLICT_MESSAGE); return; }
    setConfirm({ kind: "restart", options });
  }

  function configurationSummary(options, includeCurrent = false) {
    const config = normalizeMatchConfig(options, heroes);
    const name = (index) => heroDisplayName(heroes.find((h) => h.index === index)) || "随机英雄";
    const opponents = state?.players?.opponents || (state?.players?.opponent ? [state.players.opponent] : []);
    const aiLabel = (index, seat) => {
      const policy = index == null ? "随机英雄（重新抽选）" : `指定 ${name(index)}`;
      const current = includeCurrent && heroDisplayName(opponents[seat]?.hero);
      return `人机 ${seat + 1}：${policy}${current ? `；本局 ${current}` : ""}`;
    };
    return html`<ul className="config-summary">
      <li>你的英雄：${name(config.hero_index)} · ${config.mode === "ai2" ? "人机 1v2" : "人机 1v1"}</li>
      <li data-conventional-deck>常规牌堆（${JIANGHU_DECK_SIZE} 张）</li>
      <li>${aiLabel(config.ai_hero_index, 0)}</li>
      ${config.mode === "ai2" ? html`<li>${aiLabel(config.ai2_hero_index, 1)}</li>` : null}
    </ul>`;
  }

  const confirmation = confirm ? html`<div className="modal-mask menu-mask">
    <div className="sgs-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <h2 id="confirmation-title">${confirm.kind === "leave" ? "存档失败，仍要更换配置？" : confirm.kind === "clear" ? "清除本机存档？" : confirm.kind === "restart" ? "重新开局？" : "按新配置开始对局？"}</h2>
      <p>${confirm.kind === "leave" ? "浏览器无法保存这局。返回配置页后，当前进度可能丢失。你可以取消并继续游玩。" : confirm.kind === "clear" ? "当前浏览器里的对局进度将被清除，无法恢复。" : confirm.kind === "restart" ? "保留当前英雄、模式和人机选择设置，重新洗牌开始。指定英雄保持不变，随机英雄会重新抽选。新进度将覆盖原存档。" : "按下面的配置开始一局，覆盖当前浏览器里的存档。取消会保留原存档。"}</p>
      ${confirm.options ? configurationSummary(confirm.options, confirm.kind === "restart") : null}
      <div className="dialog-actions">
        <button type="button" className="btn primary" disabled=${busy} onClick=${() => {
          if (confirm.kind === "leave") goHome(true);
          else if (confirm.kind === "clear") { clearSave(); setConfirm(null); }
          else start(confirm.options);
        }}>${confirm.kind === "leave" ? "仍然离开" : confirm.kind === "clear" ? "确认清除" : confirm.kind === "restart" ? "确认重新开局" : "覆盖存档并开始"}</button>
        <button type="button" className="btn" autoFocus onClick=${() => setConfirm(null)}>取消</button>
      </div>
    </div>
  </div>` : null;

  const help = helpOpen ? html`<div className="modal-mask menu-mask">
    <div className="sgs-dialog help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <h2 id="help-title">少侠入门</h2>
      <ol>
        <li>选择自己的英雄、1v1 或 1v2 模式，并为每名人机选择随机或指定英雄。1v2 需要击败两名对手。</li>
        <li>每回合依次进行准备、判定、摸牌和出牌。玉步在延时锦囊前判定；点击手牌使用，需要目标时再选择。</li>
        <li>技能按钮可发动主动技能。武圣、释权等会继续询问手牌或装备；其余需手牌的技能选牌后点「确认发动」。</li>
        <li>被攻击、求桃或技能询问时，根据弹窗回应。弃牌阶段点击要弃掉的牌。</li>
        <li>铁索可选一至两人切换连环，或直接重铸；只有火、雷属性伤害会沿连环传导。兵粮寸断显示在角色判定区。</li>
        <li>无懈可击逐目标抵消锦囊，也可反无懈恢复效果。火攻需要弃同花色手牌；借刀先选持刀者，再选杀的目标。</li>
        <li>装备效果可点槽位查看；寒冰剑与雌雄双股剑会在符合条件时询问。博浪锤（贯石斧）选足两张后统一确认；可取消的弹窗也能按 Escape 放弃。</li>
        <li>点「结束出牌」后先结算弃牌与结束阶段技能，再交给对手；楚楚在弃牌后询问。战报可查看结果。</li>
        <li>「重新开局」保留当前配置并重新洗牌；「更换英雄/模式」回到配置页，原存档保留到你确认开始新局。</li>
      </ol>
      <p>本版提供英雄杀、三国杀的普通角色与常规牌堆，也保留现有原创江湖角色。具体技能和跨作兼容规则以角色说明为准。</p>
      <p>规则、人机与进度都在当前浏览器中运行。每步自动保存，只保留一份存档；刷新后点「继续上局」。清理网站数据会丢失存档。</p>
      <button type="button" className="btn primary" autoFocus onClick=${() => setHelpOpen(false)}>知道了</button>
    </div>
  </div>` : null;

  const errorNotice = error ? html`<div className="error-notice" role="alert">
    <span>${error}</span>
    <div className="error-actions">
      ${screen === "table" && hasSaved ? html`<button type="button" className="btn" disabled=${busy} onClick=${() => start()}>从存档恢复</button>` : null}
      <button type="button" className="btn" onClick=${() => setError("")}>关闭提示</button>
    </div>
  </div>` : null;

  if (screen === "home") {
    return html`<main className="home-sgs">
      <div className="home-table-glow"></div>
      <header className="brand">
        <p className="brand-eyebrow">浏览器单机版 · ${heroes.length} 位英雄</p>
        <h1>江湖 Slay</h1>
        <p>一桌刀光 · 英雄入彀</p>
      </header>
      <section className="home-panel carved wide-home" aria-label="选择英雄与对战模式">
        ${hasSaved ? html`<div className="continue-strip">
          <div><strong>江湖未散</strong><span>更换配置不会清除存档；开始新局前会再次确认</span></div>
          <button type="button" className="btn continue-btn" disabled=${busy} onClick=${() => start()}>继续上局</button>
          <button type="button" className="text-button" disabled=${busy} onClick=${() => setConfirm({ kind: "clear" })}>清除存档</button>
        </div>` : null}
        <${HeroPickPanel} heroes=${heroes} hero=${hero} onPick=${setHero} />
        <div className="gallery-hint">左右滑动，选择你的英雄 · 原创规则与来源适配分开说明</div>
        <div className="match-config" role="group" aria-label="对战配置">
          <label htmlFor="match-mode">对战模式
            <select id="match-mode" value=${gameMode} disabled=${busy} onChange=${(event) => setGameMode(event.target.value)}>
              <option value="ai">人机 1v1</option>
              <option value="ai2">人机 1v2</option>
            </select>
          </label>
          <${AiHeroSelect} id="ai-hero" label="人机 1 英雄" heroes=${heroes} value=${aiHero} onChange=${setAiHero} disabled=${busy} excludedHeroId=${gameMode === "ai2" ? heroes.find(h=>h.index===ai2Hero)?.id : null} excludedBy="人机 2" invalid=${aiHeroConflict} />
          ${gameMode === "ai2" ? html`<${AiHeroSelect} id="ai2-hero" label="人机 2 英雄" heroes=${heroes} value=${ai2Hero} onChange=${setAi2Hero} disabled=${busy} excludedHeroId=${heroes.find(h=>h.index===aiHero)?.id} excludedBy="人机 1" invalid=${aiHeroConflict} />` : null}
        </div>
        <p className="config-hint" id="ai-hero-rule">默认随机，每局重新抽选。1v2 的两名人机必须使用不同英雄；你可以与其中一名人机使用同一英雄。</p>
        ${aiHeroConflict ? html`<p className="error-notice" id="ai-hero-conflict" role="alert">${AI_HERO_CONFLICT_MESSAGE}</p>` : null}
        <p className="config-hint" data-conventional-deck>常规牌堆（${JIANGHU_DECK_SIZE} 张）：含无懈可击、借刀杀人、铁索连环、火攻、兵粮寸断，以及寒冰剑、雌雄双股剑、博浪锤（贯石斧）、白银狮子、藤甲。</p>
        <div className="home-actions">
          <button type="button" className="btn primary" onClick=${startAi} disabled=${!hero || busy || aiHeroConflict}>开始对局</button>
          <button type="button" className="btn" onClick=${() => setHelpOpen(true)}>玩法说明</button>
        </div>
        <p className="local-note">本地规则 AI · 无需登录 · 每步自动保存</p>
        ${errorNotice}
      </section>
      ${confirmation}${help}
    </main>`;
  }

  const opponents = state?.players?.opponents || (state?.players?.opponent ? [state.players.opponent] : []);
  const self = state?.players?.self;
  const won = state?.winner === "player" || state?.winner === "p1" || (self && state?.winner === self.seat);

  return html`<main className=${`sgs-table ${flash === "damage" ? "damage-flash" : ""}`}>
    <header className="table-chrome">
      <div className="chrome-left">
        <b>江湖 Slay</b>
        <span className="dot on" title="浏览器本地运行"></span>
        ${state ? html`<span className="round">第 ${state.round} 轮 · ${state.mode || "1v1"}</span>` : null}
        <span className="phase-chip" role="status">${phaseLabel}</span>
      </div>
      <div className="chrome-right">
        <button type="button" className="btn ghost" aria-expanded=${logOpen} onClick=${() => setLogOpen((v) => !v)}>${logOpen ? "收起战报" : "战报"}</button>
        <button type="button" className="btn ghost" disabled=${busy} onClick=${restart}>重新开局</button>
        <button type="button" className="btn ghost" disabled=${busy} title="返回配置页，保留原存档" onClick=${() => goHome()}>更换英雄/模式</button>
      </div>
    </header>

    <${SeatOrderStatus} state=${state} />
    <${BattleBoard} state=${state} self=${self} opponents=${[...opponents].sort((a,b)=>(a.seat_position??0)-(b.seat_position??0))} phaseLabel=${phaseLabel}
      ended=${ended} won=${won} hasSaved=${hasSaved} flash=${flash} GeneralSeat=${GeneralSeat} CardView=${CardView} HeroSkills=${HeroSkillsWithEquipment} prompt=${prompt} busy=${busy} />

    ${ended ? html`<section className="end-dock" aria-label="对局结果">
      <strong>${won ? "恭喜少侠，赢得此局！" : "此局惜败，再战江湖。"}</strong>
      <button type="button" className="btn primary" disabled=${busy} onClick=${restart}>重新开局</button>
      <button type="button" className="btn" disabled=${busy} onClick=${() => goHome()}>更换英雄/模式</button>
    </section>` : self && prompt ? html`<fieldset className="prompt-controls" disabled=${busy} aria-busy=${busy}>
      <${PromptLayer} key=${prompt.prompt_id} state=${state} prompt=${prompt} busy=${busy} onRespond=${(value) => respond(value, prompt.prompt_id)} />
    </fieldset>` : html`<div className="thinking-dock" role="status">${busy ? "正在结算…" : "对手正在行动…"}</div>`}

    ${logOpen ? html`<aside className="log-rail open" aria-label="对局战报">
      <div className="log-head">战报 <button type="button" className="text-button" onClick=${() => setLogOpen(false)}>关闭</button></div>
      ${logs.length ? logs.map((item) => html`<div key=${item.id} className="log-item">${item.message}${item.reveal?html`<${PindianReveal} result=${item.reveal} CardView=${CardView} />`:null}</div>`) : html`<div className="log-item">对局开始后，战报会显示在这里。</div>`}
    </aside>` : null}
    ${errorNotice}${confirmation}${help}
  </main>`;
}

class GameErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return html`<main className="home-sgs"><section className="home-panel carved">
      <h1>牌桌暂时出了点问题</h1>
      <p>请重新载入页面，再点「继续上局」恢复已保存的进度。</p>
      <button type="button" className="btn primary" onClick=${() => window.location.reload()}>重新载入</button>
    </section></main>`;
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(html`<${GameErrorBoundary}><${App} /><//>`);
