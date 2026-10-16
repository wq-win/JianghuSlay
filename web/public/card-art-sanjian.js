import React from 'react';
import { html } from 'htm/react';

/** Original vector drawing, authored for this game. The three separated spear
 * points and two polished outer cutting edges remain legible in a small slot.
 * No publisher illustration, raster image, remote asset, emoji, or icon font. */
export const SANJIAN_CARD_ART = Object.freeze({
  三尖两刃刀: Object.freeze({
    tone: '#507d82', wash: '#d5e1d7',
    subject: '三枚分明尖锋、两侧银亮刃口的青铜长柄刀，红绦缠在刀颈',
    body: `<path d="M17 88Q38 93 62 91M78 86 103 86" fill="none" stroke="#8aa196" stroke-width="1.2"/>
      <g transform="rotate(26 60 54)">
        <path d="M56 51H64V96L60 101 56 96Z" fill="#775a3e"/>
        <path d="M60 54V96" fill="none" stroke="#c29d62" stroke-width="1.7"/>
        <path d="M54 87H66V94H54Z" fill="#b69753"/>
        <path d="M55 91H65M57 96H63" fill="none" stroke="#e2ca85" stroke-width="1.4"/>
        <path data-sanjian-blade="three-points" d="M60 4 68 23 68 29Q77 27 84 12L83 36Q82 44 72 48L66 52H54L48 48Q38 44 37 36L36 12Q43 27 52 29V23Z" fill="#759d9b"/>
        <path d="M60 4 60 43 53 49 54 31 52 29V23Z" fill="#d4e1d1"/>
        <path d="M60 4 68 23 68 29 66 46 60 43Z" fill="#a9c6bc"/>
        <path data-sanjian-edge="left" d="M36 12Q38 33 43 39L54 46 53 50 48 48Q38 44 37 36Z" fill="#f1eed5"/>
        <path data-sanjian-edge="right" d="M84 12 83 36Q82 44 72 48L67 50 66 46 77 39Q82 33 84 12Z" fill="#e9efdb"/>
        <path d="M60 12V39M45 32 51 36M75 32 69 36" fill="none" stroke="#507d82" stroke-width="1.2"/>
        <path d="M49 47 60 43 71 47 68 55H52Z" fill="#ba9b59"/>
        <path d="M51 50 60 47 69 50M56 55V61H64V55" fill="none" stroke="#e0c885" stroke-width="1.6"/>
        <path d="M54 58H66V65H54Z" fill="#9c5145"/>
        <path d="M55 60Q43 62 44 75L37 82 38 68Q40 58 55 59Z" fill="#b96d56"/>
        <path d="M65 61Q75 67 72 80L78 85 79 73Q77 61 65 60Z" fill="#954d43"/>
        <path d="M56 61 63 63M43 67 42 74" fill="none" stroke="#e2aa7f" stroke-width="1.2"/>
        <path d="M55 69H65M55 74H65M55 79H65" fill="none" stroke="#ab8952" stroke-width="2.3"/>
        <circle cx="60" cy="51" r="2.4" fill="#4c7979"/>
      </g>
      <path d="M93 51 98 54M88 59 93 62M18 35 22 38" fill="none" stroke="#8ca69c" stroke-width="1.2"/>`,
  }),
});

export function isSanjianEquipment(card) {
  return Boolean(card && (['sgs.guozhan.equipment.sanjian', 'sgs_sanjian'].includes(card.equipment_id) || card.name === '三尖两刃刀'));
}

/** Public reference text. No hidden card positions, hero generator, or pack
 * activation is inferred from the existence of this static display. */
export function SanjianCardRules() {
  return html`<section className="sanjian-card-rules" aria-label="三尖两刃刀来源与规则">
    <strong>方块 Q · 武器 · 攻击范围 3</strong>
    <p><b>获得：</b>国战装备兼容包（1 件）默认关闭；开局显式开启后，初始牌堆加入 1 张。正常摸取、获得和装备。</p>
    <p><b>发动：</b>你使用的杀直接造成实际伤害，且受伤者完成救援后仍存活时，可弃 1 张自己的手牌。</p>
    <p><b>目标：</b>从原受伤者向另一名存活角色计算当前距离，须恰为 1。可选自己或队友；不能再选原受伤者。</p>
    <p><b>效果：</b>对选定角色造成 1 点普通伤害。先结算弃牌及其触发效果，再结算伤害；以费用和目标一并确认。</p>
    <p><b>流转：</b>替换、获得、死亡清理和弃置均保留同一实体，弃牌后可洗回；移入手牌后须正常装备。</p>
    <small>来源：三国杀移动版历史国战装备。卡文与 FAQ 依官方国战页；毒等跨包交互采用本作兼容裁定，未宣称当前移动客户端全交互验证。</small>
    <a href="https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/zhuangbeipai/2013/0128/119.html" target="_blank" rel="noopener noreferrer">官方装备规则</a>
  </section>`;
}
