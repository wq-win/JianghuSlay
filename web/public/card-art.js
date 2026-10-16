import {SGS_ZHANGFEN_CARD_ART} from './sgs-zhangfen-art.js';
import {isZhangfenVehicle,ZhangfenCardRules} from './sgs-zhangfen-ui.js';
import {YOUJIAN_CARD_ART as YOUJIAN_FIVE_CARD_ART} from './youjian-card-art.js';
import {WANGYUN_CARD_ART,WangyunCardRules,isWangyunDependency} from './wangyun-card-art.js';
import React, { useState } from "react";
import {DERIVED_EQUIPMENT_CATALOG,derived_equipment_definition} from "../local/derived-equipment.mjs";
import { html } from "htm/react";
import { EXPANSION_CARD_ART } from "./card-art-expansion.js";
import { UNION_EQUIPMENT_ART } from "./card-art-union.js";
import { YOUJIAN_CARD_ART } from "./card-art-youjian/index.js";
import { SANJIAN_CARD_ART, SanjianCardRules, isSanjianEquipment } from "./card-art-sanjian.js";

/**
 * Original Jianghu Slay artwork, drawn for this interface from geometric SVG paths.
 * No copied game assets, network images, fonts, or icon packages are used here.
 * Every deck name has a different illustration; suits/ranks remain in CardView.
 */
export const CARD_ART = Object.freeze({
  ...SGS_ZHANGFEN_CARD_ART,
  ...WANGYUN_CARD_ART,
  ...YOUJIAN_FIVE_CARD_ART,
  ...EXPANSION_CARD_ART,
  ...UNION_EQUIPMENT_ART,
  ...YOUJIAN_CARD_ART,
  ...SANJIAN_CARD_ART,
  // Unique derived weapon: source hero reserve, never a random-deck placeholder.
  霹雳车: {
    tone: "#60786c", wash: "#dbe1c8", subject: "带四辐木轮、三角支架和抛石长臂的霹雳战车",
    body: `<path d="M14 75H103L98 87H18Z" fill="#9b784c"/><path d="M23 76 55 21 85 76Z" fill="#ad8953"/>
      <path d="M38 68 55 38 72 68Z" fill="#d4ddbd"/><path d="M29 76 58 29 64 33 39 76Z" fill="#785d40"/>
      <path d="M36 42 94 8 99 15 43 49Z" fill="#ba965b"/><path d="M90 11 88 2 108 3 105 16Z" fill="#70796a"/>
      <path d="M40 46 15 33 11 39 35 53Z" fill="#8c6946"/><path d="M17 37 10 54 25 59 31 44Z" fill="#b6b79b"/>
      <path d="M12 55 28 45M16 57 30 50" stroke="#e5d9b1"/><path d="M40 47 55 21" stroke="#e2cf90" stroke-width="3"/>
      <path d="M27 58 71 58M23 65 75 65" stroke="#594e39" stroke-width="2.2"/>
      <path d="M48 42H65V49H48Z" fill="#798573"/><circle cx="56" cy="45" r="3" fill="#d8be78"/>
      <circle cx="29" cy="86" r="15" fill="#56634f"/><circle cx="29" cy="86" r="10" fill="#cbb578"/>
      <circle cx="90" cy="86" r="15" fill="#56634f"/><circle cx="90" cy="86" r="10" fill="#cbb578"/>
      <path d="M19 86H39M29 76V96M80 86H100M90 76V96" stroke="#6b5d3f"/><circle cx="29" cy="86" r="3" fill="#8c7848"/><circle cx="90" cy="86" r="3" fill="#8c7848"/>
      <path d="M58 83H71M54 78H76M98 24 107 30M100 20l13 2M106 9l9-3" stroke="#a38b51" stroke-width="1.5"/>`,
  },
  // Optional 朱雀 compatibility pack: original artwork, never extra ordinary-deck cards.
  孔雀翎: {
    tone: "#3a7c73", wash: "#cedfc5", subject: "扇形展开的孔雀眼翎暗器与青玉握柄",
    body: `<path d="M59 82Q23 73 14 43Q9 23 25 20Q40 19 49 57Q32 9 50 5Q69 0 63 50Q73 4 91 16Q107 27 81 57Q106 27 112 44Q118 66 67 83Z" fill="#649b85"/>
      <path d="M59 80 25 29M61 79 52 15M63 79 87 25M65 80 102 48" fill="none" stroke="#dbc381" stroke-width="2.2"/>
      <path d="M24 25Q9 34 24 44Q39 38 24 25ZM52 10Q37 23 53 35Q69 22 52 10ZM88 20Q70 28 81 42Q98 37 88 20ZM103 44Q85 46 89 61Q108 62 103 44Z" fill="#bdab5b"/>
      <path d="M24 29q-9 6 0 11 9-5 0-11ZM52 15q-9 8 1 15 9-8-1-15ZM87 25q-10 4-5 12 11-3 5-12ZM101 48q-11 0-9 9 11 0 9-9Z" fill="#326278" stroke="none"/>
      <path d="M24 32q-3 2 0 5 3-3 0-5ZM52 20q-3 3 0 5 4-2 0-5ZM85 29q-4 1-2 4 4-1 2-4ZM99 51l-3 3" stroke="#dce9bc" stroke-width="1.2"/>
      <path d="M51 79Q62 72 72 79L67 86H56Z" fill="#c2a156"/><path d="M56 85H67L66 101H58Z" fill="#477b64"/>
      <path d="M57 90H66M57 96H66M60 82H64" stroke="#dfcb87" stroke-width="2"/>`,
  },
  护心镜: {
    tone: "#9b8050", wash: "#e8dcbb", subject: "双瓣铜边护心圆镜与绛红系带",
    body: `<path d="M35 18 23 11 14 27 30 39M85 18 98 11 108 29 89 39" fill="#9b554c"/>
      <path d="M31 71 19 94 39 87 43 99 54 78M70 79 81 100 86 86 106 94 90 69" fill="#a86151"/>
      <circle cx="60" cy="49" r="39" fill="#ac8b4a"/><circle cx="60" cy="49" r="32" fill="#d3c79b"/><circle cx="60" cy="49" r="26" fill="#8eaaa0"/>
      <path d="M40 54Q37 31 60 26Q43 45 47 66Z" fill="#e3e6ce" stroke="none"/><path d="M53 75Q77 72 84 52Q80 75 61 76Z" fill="#627d76" stroke="none"/>
      <path d="M60 23v52M34 49h52" stroke="#d4d4b2" stroke-width="1.1" opacity=".65"/>
      <path d="M55 10 60 4 65 10 64 17H56ZM21 44 15 49 21 54 28 53V45ZM55 81 60 88 65 81 64 75H56ZM99 44 105 49 99 54 92 53V45Z" fill="#dac17c"/>
      <path d="M32 22 38 28M82 28 88 22M32 76 38 70M82 70 88 76" stroke="#eee0aa" stroke-width="4"/>
      <circle cx="60" cy="49" r="10" fill="#d4bf80"/><path d="M55 49q5-10 10 0-5 10-10 0Z" fill="#79988e"/>
      <path d="M27 18 21 28M99 18 104 28M28 86 37 77M84 77 94 86" fill="none" stroke="#dbb47d" stroke-width="2"/>`,
  },
  饮血剑: {
    tone: "#9a4b48", wash: "#e9cdbb", subject: "血玉剑格与赤色流光长剑",
    body: `<path d="M18 80Q22 26 89 12Q48 39 49 77Q68 93 102 62Q89 103 48 98Z" fill="#b76251" opacity=".38" stroke="none"/>
      <path d="M38 75L78 16L93 5L92 24L48 82Z" fill="#e4e4d0"/><path d="M44 76L87 17" stroke="#9f6455" stroke-width="2"/>
      <path d="M32 67L53 82L60 76L37 61Z" fill="#a98246"/><path d="M38 69L48 72L44 80L35 77Z" fill="#963e38"/>
      <path d="M31 76L41 83L29 99L18 92Z" fill="#6c3c36"/><path d="M25 81L35 88M21 87L31 94" stroke="#b8955d"/>
      <path d="M67 58Q60 69 65 75Q73 82 78 74Q82 68 73 57L71 53Z" fill="#ae493d" stroke="#7d4138"/>
      <path d="M78 34L90 29M83 47L99 43M56 30L63 18" stroke="#b16752" stroke-width="1.4"/>`,
  },
  金鳞甲: {
    tone: "#9b7f43", wash: "#e9dfb7", subject: "金色鱼鳞护甲与波纹护心镜",
    body: `<path d="M42 10L60 18L78 10L101 29L91 48L83 42L88 85L60 98L32 85L37 42L29 48L19 29Z" fill="#a98d4e"/>
      <path d="M42 18L60 26L78 18L87 32L80 42L82 81L60 90L38 81L40 42L33 32Z" fill="#d5bd76"/>
      <path d="M42 10Q43 33 60 34Q77 33 78 10M39 42Q60 53 81 42" fill="none" stroke="#687958" stroke-width="4"/>
      <g fill="none" stroke="#a18548" stroke-width="1.6"><path d="M40 50q5 11 10 0 5 11 10 0 5 11 10 0 5 11 10 0M39 61q5 11 10 0 5 11 10 0 5 11 10 0 5 11 11 0M39 72q5 11 10 0 5 11 10 0 5 11 10 0 5 11 11 0M44 82q5 8 10 0 5 8 10 0 5 8 10 0"/></g>
      <circle cx="60" cy="42" r="10" fill="#78957a"/><path d="M53 42q4-5 7 0t7 0M53 47q4-5 7 0t6 0" fill="none" stroke="#dfcd88" stroke-width="1.5"/>
      <path d="M25 29L36 22M23 35L36 29M84 22L96 29M85 29L97 35" stroke="#e5d394" stroke-width="3"/>
      <path d="M32 85L40 79M80 79L88 85M55 94L55 87M65 94L65 87" stroke="#7b6e40"/>`,
  },
  乾坤袋: {
    tone: "#647e72", wash: "#dbe2c7", subject: "束口青布乾坤袋与双鱼圆徽",
    body: `<path d="M39 11Q60 17 82 10L75 30Q100 47 96 74Q91 99 60 98Q25 98 23 73Q20 48 45 30Z" fill="#6f927d"/>
      <path d="M45 32Q34 55 35 77Q43 94 60 94Q37 96 27 80Q17 55 45 32Z" fill="#a9bea0" stroke="none"/>
      <path d="M45 13L50 28M60 15V28M74 13L67 28M40 30Q60 35 80 29" fill="none" stroke="#3f6756" stroke-width="3"/>
      <path d="M40 30Q60 35 81 29M41 35Q60 40 79 34" fill="none" stroke="#c7aa64" stroke-width="3"/>
      <path d="M78 32Q98 28 101 42Q88 49 78 32Q89 50 101 54M77 35L83 64M82 61L78 73L87 74L84 62" fill="none" stroke="#b08d4d" stroke-width="3"/>
      <circle cx="60" cy="66" r="20" fill="#dbc88c"/><path d="M60 46a20 20 0 0 1 0 40c-12 0-12-20 0-20s12-20 0-20Z" fill="#476f60" stroke="none"/>
      <circle cx="60" cy="56" r="3" fill="#476f60" stroke="none"/><circle cx="60" cy="76" r="3" fill="#dbc88c" stroke="none"/>
      <path d="M29 66L34 58M86 81L80 87M45 91L49 88" stroke="#c7cc9d" stroke-width="2"/>`,
  },
  杀: {
    tone: "#647876", wash: "#d8e1d6", subject: "出鞘长剑与斩击",
    body: `<path d="M20 76Q48 18 99 16Q62 40 43 87" fill="#a1b3a5" stroke="none" opacity=".55"/>
      <path d="M35 73L87 17L96 12L92 25L43 79Z" fill="#e9ede3"/><path d="M40 76L91 20" fill="none" stroke="#7b928c"/>
      <path d="M29 67L47 84L52 80L34 62Z" fill="#bd924c"/><path d="M27 75L36 83L23 95L15 88Z" fill="#5b6152"/>
      <path d="M21 82L29 89M26 77L34 84" stroke="#c7a776"/><path d="M18 92Q11 85 8 92Q15 94 11 98" fill="none" stroke="#aa4b3b"/>
      <path d="M63 25L73 14M80 46L99 36M45 26L49 17" fill="none" stroke="#536e61" stroke-width="1.3"/>`,
  },
  血杀: {
    tone: "#9e443c", wash: "#ebc8b7", subject: "赤色弯刀与回旋血光",
    body: `<path d="M23 74C2 31 49 2 91 22C46 10 22 47 42 70C67 93 96 66 102 45C110 87 57 105 23 74Z" fill="#af5143" stroke="none"/>
      <path d="M37 70Q70 60 89 19Q99 55 52 80Z" fill="#ece5d2"/><path d="M44 72Q73 63 87 36" fill="none" stroke="#b79775"/>
      <path d="M32 64L50 83L56 78L38 60Z" fill="#b58b42"/><path d="M31 74L39 82L24 94L17 87Z" fill="#6c3832"/>
      <path d="M67 79C67 79 60 86 61 90C62 97 73 96 74 90C75 86 67 79 67 79Z" fill="#a73c34" stroke="none"/>
      <circle cx="91" cy="80" r="3" fill="#a73c34" stroke="none"/>`,
  },
  毒杀: {
    tone: "#5b6852", wash: "#d9dec0", subject: "淬毒匕首与青蛇",
    body: `<path d="M30 80C5 63 35 24 60 35C84 45 56 65 75 79C86 86 99 75 99 63" fill="none" stroke="#5f8059" stroke-width="9"/>
      <path d="M99 63L91 55L98 47L106 57Z" fill="#6f8a55"/><circle cx="100" cy="54" r="1" fill="#f2d579" stroke="none"/>
      <path d="M98 48L102 41M102 41L108 39M102 41L101 36" fill="none" stroke="#9a5141" stroke-width="1.4"/>
      <path d="M39 66L72 16L81 12L81 29L49 73Z" fill="#b6c5a2"/><path d="M46 66L76 24" fill="none" stroke="#f1edc6"/>
      <path d="M32 61L53 76L57 71L36 56Z" fill="#b49354"/><path d="M33 69L43 76L31 94L23 87Z" fill="#62536b"/>
      <path d="M70 37Q78 43 71 49Q63 45 70 37" fill="#789d4c" stroke="none"/><path d="M24 24Q17 31 24 36M43 14Q37 20 43 26" fill="none" stroke="#76915b"/>`,
  },
  闪: {
    tone: "#3b746f", wash: "#d1e2d8", subject: "折扇与掠过衣带",
    body: `<path d="M22 80Q49 74 59 90Q76 99 98 81" fill="none" stroke="#67968a" stroke-width="4"/>
      <path d="M61 77L14 47Q24 16 56 14Q88 11 108 43Z" fill="#eee4c5"/>
      <path d="M61 77L22 34M61 77L39 19M61 77L60 14M61 77L82 21M61 77L102 34" fill="none" stroke="#b28d50" stroke-width="1.5"/>
      <path d="M19 41Q42 24 61 29Q82 22 103 38L61 77Z" fill="#569084" stroke="none" opacity=".75"/>
      <path d="M27 50Q48 47 57 57M65 46Q81 37 91 42" fill="none" stroke="#e9ead6" stroke-width="1.5"/>
      <circle cx="61" cy="77" r="4" fill="#c99e55"/><path d="M61 82L65 94M59 93L69 92" stroke="#a24b3f"/>
      <path d="M8 65L30 65M87 65L112 61M10 72L22 72" stroke="#5f867d" stroke-width="1.3"/>`,
  },
  桃: {
    tone: "#a7655c", wash: "#f0d9c8", subject: "仙桃与新叶",
    body: `<path d="M28 75Q41 42 76 15" fill="none" stroke="#786046" stroke-width="4"/>
      <path d="M61 33Q37 8 27 26Q38 43 61 33Z" fill="#6c8d61"/><path d="M67 28Q84 6 97 17Q94 38 67 28Z" fill="#86a276"/>
      <path d="M61 42C46 24 23 38 23 60C23 79 44 88 59 94C73 88 97 78 97 57C98 36 77 27 61 42Z" fill="#d99180"/>
      <path d="M61 42C53 57 57 78 59 94C42 84 34 72 35 56C36 47 43 39 48 39" fill="#edb79e" stroke="none"/>
      <path d="M61 43Q54 60 61 85" fill="none" stroke="#ad5e58" stroke-width="1.6"/>
      <path d="M34 53Q33 43 42 43" fill="none" stroke="#f8dfbd" stroke-width="4"/>
      <path d="M65 35L69 25M36 26L54 32M76 24L88 20" stroke="#4f6c4d" stroke-width="1.5"/>`,
  },
  酒: {
    tone: "#9e754a", wash: "#e8d6b9", subject: "陶酒壶与温酒盏",
    body: `<path d="M43 19L70 19L68 33C69 39 82 42 83 57L81 83Q56 98 32 83L30 57C32 42 46 39 44 33Z" fill="#b58454"/>
      <path d="M40 51Q55 45 74 52L73 77Q58 88 40 77Z" fill="#e2bf80" stroke="#80613f"/>
      <path d="M50 55L66 55M48 63L68 63M51 71L65 71M57 52L57 77" stroke="#74513c" stroke-width="2.4"/>
      <path d="M40 17Q55 12 73 17L73 24Q54 28 40 23Z" fill="#a4473c"/><path d="M41 28Q66 35 79 26Q73 39 91 48" fill="none" stroke="#a4473c" stroke-width="5"/>
      <path d="M74 65L103 65L99 83Q88 91 78 83Z" fill="#8b6150"/><ellipse cx="89" cy="65" rx="15" ry="5" fill="#d9b16d"/>
      <path d="M19 71Q9 59 20 50M96 25Q106 34 96 43" fill="none" stroke="#bc9f6b" stroke-width="1.5"/>`,
  },
  无中生有: {
    tone: "#8b774c", wash: "#e5ddbe", subject: "空卷中幻化两张锦书",
    body: `<path d="M18 75Q28 63 42 73L77 73Q88 64 101 77L99 88Q85 83 76 89L40 89Q28 83 19 88Z" fill="#ded0a4"/>
      <path d="M16 73L16 89M102 74L102 90" stroke="#876a43" stroke-width="5"/>
      <path d="M42 70Q24 52 49 49M70 71Q91 48 71 42" fill="none" stroke="#89a297" stroke-width="3"/>
      <path d="M34 17L61 12L68 50L42 56Z" fill="#eee9ce"/><path d="M59 24L87 27L83 65L55 61Z" fill="#d4c18d"/>
      <path d="M42 27L54 25M44 35L57 33M45 43L59 40M66 35L79 36M65 44L78 45M64 53L76 54" stroke="#687569" stroke-width="1.5"/>
      <path d="M23 31L23 43M17 37L29 37M96 45L96 55M91 50L101 50M76 10L76 17M72 13L80 13" stroke="#b19050" stroke-width="1.5"/>`,
  },
  顺手牵羊: {
    tone: "#6c8061", wash: "#dce1cb", subject: "手牵绳索与白羊",
    body: `<path d="M18 35L31 32L42 40L37 49L29 48L24 54L16 47Z" fill="#bb9777"/><path d="M12 29L23 33L19 51L9 49" fill="#648779"/>
      <path d="M37 44Q53 65 76 41" fill="none" stroke="#a7894d" stroke-width="2.4"/>
      <path d="M45 62C32 49 46 38 55 43C59 31 73 34 77 40C90 33 100 47 93 54C106 64 95 77 86 75C76 88 63 79 61 77C46 83 35 73 45 62Z" fill="#ece8d5"/>
      <path d="M50 76L48 90L55 90L59 78M79 78L80 91L87 91L87 76" fill="#746d5a"/>
      <path d="M87 43Q102 39 105 52L101 65L89 65L83 53Z" fill="#bcbda2"/><path d="M92 45Q81 39 85 33Q96 31 97 41" fill="none" stroke="#82714f" stroke-width="4"/>
      <circle cx="100" cy="51" r="1.4" fill="#38382d" stroke="none"/><path d="M21 82Q34 79 39 83M95 89L109 89" fill="none" stroke="#809369" stroke-width="1.4"/>`,
  },
  釜底抽薪: {
    tone: "#9a673d", wash: "#ead6b8", subject: "铜釜下抽出燃木",
    body: `<path d="M32 40Q54 33 79 41L76 65Q56 79 35 65Z" fill="#5d786c"/><ellipse cx="55" cy="40" rx="24" ry="6" fill="#d5b578"/>
      <path d="M32 45Q18 34 20 50Q21 60 33 54M79 44Q94 33 91 50Q88 60 78 54" fill="none" stroke="#a4834d" stroke-width="5"/>
      <path d="M39 71L35 84M72 71L76 84" stroke="#786243" stroke-width="4"/>
      <path d="M47 85Q33 72 47 65Q47 74 56 73Q63 65 59 59Q77 72 63 85Z" fill="#be6e3d" stroke="none"/>
      <path d="M44 83L98 71L101 78L45 91Z" fill="#976947"/><path d="M84 80L105 75M48 86L73 81" stroke="#d0a574" stroke-width="1.5"/>
      <path d="M91 79L102 87L111 82L108 70L102 69L102 75L96 74Z" fill="#c5a07c"/>
      <path d="M41 27Q33 21 42 15M59 28Q67 19 58 10M74 30Q68 23 77 17" fill="none" stroke="#8d9a87" stroke-width="1.5"/>`,
  },
  决斗: {
    tone: "#8e6454", wash: "#e3d3bf", subject: "双剑相交的锋芒",
    body: `<path d="M60 32L65 46L81 42L71 55L84 68L66 64L59 82L54 64L37 69L47 54L36 41L53 45Z" fill="#d5b774" stroke="none"/>
      <path d="M27 19L37 24L84 74L77 81L31 32Z" fill="#d8e2d8"/><path d="M90 17L90 30L43 81L36 74L82 23Z" fill="#eee7d3"/>
      <path d="M75 70L89 82L85 88L70 76Z" fill="#ad894d"/><path d="M82 83L94 95L100 89L88 77Z" fill="#9a5146"/>
      <path d="M33 70L48 82L44 88L29 76Z" fill="#ad894d"/><path d="M33 79L21 91L27 97L39 85Z" fill="#56786e"/>
      <path d="M58 16L58 27M14 53L27 53M92 52L106 52" stroke="#a28455" stroke-width="1.5"/>`,
  },
  烽火狼烟: {
    tone: "#a16346", wash: "#e9d2b7", subject: "烽燧高台与火烟",
    body: `<path d="M21 92L36 61L68 61L91 92Z" fill="#b8aa87" stroke="none"/><path d="M39 50L74 50L80 88L32 88Z" fill="#b49a6f"/>
      <path d="M33 43L43 43L43 49L50 49L50 43L62 43L62 49L69 49L69 43L80 43L78 57L35 57Z" fill="#cbbb94"/>
      <path d="M50 88L50 72Q57 63 64 72L64 88Z" fill="#685e4b"/><path d="M37 64L75 64M37 76L46 76M67 78L77 78M49 57L49 63M69 58L69 64" stroke="#8f7f5c" stroke-width="1.4"/>
      <path d="M43 43Q32 29 49 17Q44 29 57 28Q70 17 63 9Q87 21 69 43Z" fill="#b95e3c"/>
      <path d="M50 42Q45 34 55 29Q56 39 66 32L62 43Z" fill="#e2ab5d" stroke="none"/>
      <path d="M71 22Q87 22 80 10Q91 15 100 8M77 30Q95 31 99 23" fill="none" stroke="#8c9280" stroke-width="4"/>
      <path d="M13 92L105 92" stroke="#8e876c" stroke-width="1.5"/>`,
  },
  万箭齐发: {
    tone: "#6c7563", wash: "#dee0c9", subject: "多支羽箭破空落下",
    body: `<path d="M13 81Q48 69 102 88L109 94L9 94Z" fill="#c4c5a5" stroke="none"/>
      <g transform="translate(8 5) rotate(31 54 48)"><path d="M54 14L54 73" stroke="#876b43" stroke-width="3"/><path d="M54 85L47 69L54 73L61 69Z" fill="#597367"/><path d="M54 26L46 18L46 8L54 15L62 8L62 18Z" fill="#b99150"/></g>
      <g transform="translate(37 -8) rotate(31 54 48)"><path d="M54 14L54 73" stroke="#876b43" stroke-width="3"/><path d="M54 85L47 69L54 73L61 69Z" fill="#597367"/><path d="M54 26L46 18L46 8L54 15L62 8L62 18Z" fill="#b99150"/></g>
      <g transform="translate(-17 -11) rotate(31 54 48)"><path d="M54 14L54 73" stroke="#876b43" stroke-width="3"/><path d="M54 85L47 69L54 73L61 69Z" fill="#597367"/><path d="M54 26L46 18L46 8L54 15L62 8L62 18Z" fill="#b99150"/></g>
      <path d="M86 63L102 38M16 44L28 24M83 87L99 61" fill="none" stroke="#87967c" stroke-width="1.4"/>`,
  },
  手捧雷: {
    tone: "#746b85", wash: "#dbd8e3", subject: "双手托住雷霆",
    body: `<path d="M28 36C19 25 29 15 42 19C46 5 67 7 72 19C91 13 103 29 92 40L35 42Z" fill="#8c9696"/>
      <path d="M61 24L43 53L56 53L48 76L80 42L65 43L75 24Z" fill="#e5c66d"/>
      <path d="M13 68L25 58L39 69L48 70L47 77L35 76L49 85L59 87L60 94L45 94L27 86Z" fill="#c7a789"/>
      <path d="M107 68L95 58L82 69L72 70L73 77L85 76L71 85L61 87L60 94L75 94L93 86Z" fill="#c7a789"/>
      <path d="M12 66L28 83L21 94L5 78Z" fill="#657a73"/><path d="M108 66L92 83L99 94L115 78Z" fill="#657a73"/>
      <path d="M25 48L18 40M93 49L103 43M59 7L59 2" stroke="#a68b5b" stroke-width="1.6"/>`,
  },
  画地为牢: {
    tone: "#9b7354", wash: "#e7d9bd", subject: "笔下金圈化作牢栏",
    body: `<ellipse cx="55" cy="77" rx="39" ry="16" fill="#dbc48d" stroke="#ac8950" stroke-width="4"/>
      <path d="M30 75L30 32M43 81L43 28M57 83L57 27M72 78L72 31M27 44L76 44M28 60L75 60" fill="none" stroke="#6d7d6b" stroke-width="4"/>
      <path d="M28 31Q52 22 75 31" fill="none" stroke="#a68b56" stroke-width="4"/>
      <path d="M84 64L100 14L106 16L90 67Z" fill="#aa8150"/><path d="M84 64L90 67L84 79L78 84L79 75Z" fill="#48594f"/>
      <path d="M90 44L97 46" stroke="#e4d4ae" stroke-width="4"/><path d="M84 86Q99 81 98 73" fill="none" stroke="#b99a5c" stroke-width="2"/>
      <path d="M45 53Q50 48 56 53L60 74L40 74Z" fill="#a6ad8c" stroke="none"/>`,
  },
  青龙偃月刀: {
    tone: "#3e7566", wash: "#d3e0cb", subject: "青龙纹长柄偃月刀",
    body: `<path d="M31 93L73 22" stroke="#72563d" stroke-width="7"/><path d="M33 88L69 28" stroke="#b49658" stroke-width="2"/>
      <path d="M72 13Q86 15 94 10Q107 39 76 55L69 42Q89 31 72 13Z" fill="#acc5ae"/>
      <path d="M94 10Q110 40 76 55L74 50Q101 36 94 10Z" fill="#ebe8d7" stroke="none"/>
      <path d="M74 23Q89 23 86 33Q72 33 77 41L70 46" fill="none" stroke="#3e7566" stroke-width="3"/><circle cx="80" cy="25" r="1.3" fill="#b3904c" stroke="none"/>
      <path d="M61 36L76 45L73 50L58 41Z" fill="#b58c48"/><path d="M64 45Q80 52 73 68Q64 56 58 58" fill="#a95543" stroke="none"/>
      <path d="M30 89L36 94L32 99L26 95Z" fill="#b58c48"/>`,
  },
  霸王弓: {
    tone: "#805c45", wash: "#e2d1b9", subject: "厚重角弓与铜虎弭",
    body: `<path d="M35 10C91 6 84 30 74 46C65 65 98 79 76 93" fill="none" stroke="#543f32" stroke-width="9"/>
      <path d="M35 10C91 6 84 30 74 46C65 65 98 79 76 93" fill="none" stroke="#b18a4a" stroke-width="4"/>
      <path d="M35 10L47 57L76 93" fill="none" stroke="#a98a51" stroke-width="1.5"/>
      <path d="M21 68L98 40" stroke="#81613c" stroke-width="3"/><path d="M108 36L94 35L99 41L96 49Z" fill="#c9d2c0"/>
      <path d="M27 65L18 60L10 62L20 69L14 78L22 75L31 64" fill="#94754b"/>
      <path d="M67 45L79 49L77 62L67 57Z" fill="#5b6e57"/><path d="M32 8L40 5L44 13L35 17Z" fill="#c2a163"/>
      <path d="M74 88L83 88L81 97L73 97Z" fill="#c2a163"/>`,
  },
  丈八蛇矛: {
    tone: "#697060", wash: "#dedcca", subject: "蜿蜒蛇刃长矛与黑缨",
    body: `<path d="M31 94L68 39" stroke="#63513c" stroke-width="6"/><path d="M33 89L66 41" stroke="#b19358" stroke-width="1.6"/>
      <path d="M65 43C87 39 70 28 87 22C94 18 93 8 92 3C102 18 86 24 93 31C98 40 80 45 76 54Z" fill="#c8d3c2"/>
      <path d="M72 43C86 37 79 30 91 24" fill="none" stroke="#7f9785" stroke-width="1.5"/>
      <path d="M61 40L78 52L73 58L56 46Z" fill="#b9995a"/>
      <path d="M64 52Q47 49 47 71L55 64L56 79L65 67L70 74Q79 60 64 52Z" fill="#4e5b54" stroke="none"/>
      <path d="M50 62L52 73M59 59L61 70M66 59L67 67" stroke="#9c9b7c" stroke-width="1.3"/><path d="M26 91L33 96L30 99L23 95Z" fill="#b9995a"/>`,
  },
  仁王盾: {
    tone: "#67785e", wash: "#dbe0cb", subject: "仁王兽面厚盾",
    body: `<path d="M60 8L97 23L91 68Q78 86 60 95Q39 85 28 68L22 23Z" fill="#a48b55"/>
      <path d="M60 16L88 29L83 65Q73 79 60 86Q46 79 36 65L31 29Z" fill="#627b64"/>
      <path d="M43 39L50 30L60 36L70 30L77 39L73 48L79 58L69 73L51 73L41 58L47 48Z" fill="#c6ac6b"/>
      <path d="M44 43L54 47M66 47L76 43" stroke="#4f5b43" stroke-width="4"/><path d="M60 45L54 57L66 57Z" fill="#9e8350"/>
      <path d="M48 61L54 66L66 66L72 61M54 67L54 73M66 67L66 73" fill="none" stroke="#5b6046" stroke-width="2"/>
      <g fill="#d7c38c" stroke="none"><circle cx="60" cy="13" r="2"/><circle cx="28" cy="28" r="2"/><circle cx="92" cy="28" r="2"/><circle cx="33" cy="65" r="2"/><circle cx="87" cy="65" r="2"/><circle cx="60" cy="91" r="2"/></g>`,
  },
});

const FALLBACK_ART = {
  tone: "#817151", wash: "#e5d9bd", subject: "锦书",
  body: `<path d="M31 18L85 18L85 83L31 83Z" fill="#e0cf9d"/><path d="M25 16L25 86M91 16L91 86" stroke="#98754b" stroke-width="7"/><path d="M42 35L74 35M42 48L74 48M42 61L66 61" stroke="#807954"/>`,
};

const TYPE_ART = Object.freeze({
  杀: "杀", 火杀: "火杀", 雷杀: "雷杀", 血杀: "血杀", 毒杀: "毒杀", 毒: "毒", 闪: "闪", 桃: "桃", 酒: "酒",
  武器: "杀", 防具: "仁王盾", "-1马": "乌骓", "+1马": "蹑影", 锦囊: "无中生有",
});

export function CardArt({ card, compact = false, className = "" }) {
  const artwork = CARD_ART[card?.name] || CARD_ART[card?.base_name] || CARD_ART[TYPE_ART[card?.type]] || FALLBACK_ART;
  return html`<svg
    className=${`card-art ${compact ? "card-art--compact" : ""} ${className}`.trim()}
    viewBox="0 0 120 104"
    aria-hidden="true"
    focusable="false"
    data-art-name=${card?.name || ""}
    style=${{ "--art-tone": artwork.tone }}
  >
    <ellipse cx="60" cy="53" rx="48" ry="44" fill=${artwork.wash} opacity="0.75" />
    <path d="M16 82Q8 60 17 36M100 23Q113 39 108 66" fill="none" stroke=${artwork.tone} strokeWidth="0.8" opacity="0.22" />
    <path d="M26 92L94 92" fill="none" stroke=${artwork.tone} strokeWidth="0.7" opacity="0.16" />
    <g stroke="#494a37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML=${{ __html: artwork.body }} />
  </svg>`;
}

const SLOT_INFO = Object.freeze({
  weapon: { label: "武器", empty: "杀的攻击距离 1", placeholder: "杀" },
  armor: { label: "防具", empty: "未装备防具", placeholder: "仁王盾" },
  offensive_horse: { label: "进攻马", empty: "未装备进攻马", placeholder: "乌骓" },
  defensive_horse: { label: "防御马", empty: "未装备防御马", placeholder: "蹑影" },
});

export function equipmentStat(card, slot, equipmentState = null, zhangfenState = null) {
  if(isZhangfenVehicle(card))return `攻击范围 9 · 耐久 ${Number.isInteger(zhangfenState?.durability)?zhangfenState.durability:"?"}/${Number.isInteger(zhangfenState?.max_durability)?zhangfenState.max_durability:"?"}`;
  if (!card) return SLOT_INFO[slot]?.empty || "未装备";
  if (slot === "weapon" || card.type === "武器") {
    return `攻击范围 ${card.range ?? 1}`;
  }
  if (card.name === "护心镜") return `抵挡余量 ${Number.isInteger(equipmentState?.remaining) ? equipmentState.remaining : "?"}/2 · 可选发动`;
  if (slot === "armor" || card.type === "防具") return ({
    仁王盾: "黑色杀无效", 白银狮子: "伤害封顶 1 · 离场回 1", 藤甲: "普杀 / 烽火 / 万箭无效 · 火伤 +1",
    玉如意: "红判可视为闪",
    金鳞甲: "烽火 / 万箭无效 · 离场回 1", 乾坤袋: "手牌上限 +1 · 离场摸 1",
    引蜂衣: "锦囊伤害 +1 · 毒流失 +1", 女装: "男性受杀黑判 · 该目标伤害 +1",
  })[card.name] || "防具效果 · 查看详情";
  if (card.name === "驽马") return "进攻距离 −1 · 他人到你固定 1";
  if (card.name === "战象") return "防御距离 +1 · 赠予失败并弃置";
  if (slot === "offensive_horse" || card.type === "-1马") return "进攻距离 −1";
  if (slot === "defensive_horse" || card.type === "+1马") return "防御距离 +1";
  return card.description || "已装备";
}

/** Native details stays keyboard/touch accessible and never changes match state. */
export function EquipmentSlot({ card, slot, label, equipmentState = null, zhangfenState = null }) {
  const info = SLOT_INFO[slot] || { label: label || "装备", empty: "未装备", placeholder: "杀" };
  const slotLabel = info.label;
  const stat = equipmentStat(card, slot, equipmentState, zhangfenState);
  const description = card?.description || (card ? "装备已生效。" : `${slotLabel}槽位空置，打出对应装备牌后会显示在这里。`);
  const accessibleLabel = `${slotLabel}：${card?.name || "未装备"}。${stat}。查看详情`;
  const derived = derived_equipment_definition(card);
  const sourceRecords = Array.isArray(card?.source_records) ? card.source_records : [];
  const aliases = Array.isArray(card?.aliases) ? [...new Set(card.aliases)].filter(name => name !== card.name) : [];
  const sourceText = value => Array.isArray(value) ? value.join(' / ') : value || '';
  return html`<details
    className=${`equipment-slot equipment-slot--${slot || "other"} ${card ? "is-filled" : "is-empty"}`}
    data-equipment-slot=${slot}
    data-equipment-remaining=${card?.name === "护心镜" ? equipmentState?.remaining : undefined}
    onClick=${(event) => event.stopPropagation()}
    onKeyDown=${(event) => { if (event.key === "Escape") { event.preventDefault(); event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }}
  >
    <summary className="equipment-slot__summary" aria-label=${accessibleLabel} title=${`${card?.name || slotLabel} · ${stat}\n${description}`}>
      <span className="equipment-slot__art">
        <${CardArt} card=${card || { name: info.placeholder }} compact=${true} />
      </span>
      <span className="equipment-slot__copy">
        <span className="equipment-slot__label">${slotLabel}</span>
        <strong className="equipment-slot__name">${card?.name || "未装备"}</strong>
        <span className="equipment-slot__stat">${card ? stat : "空槽位"}</span>
      </span>
      <span className="equipment-slot__info" aria-hidden="true">i</span>
    </summary>
    <div className="equipment-slot__details">
      <strong>${card?.name || `${slotLabel} · 未装备`}</strong>
      <span>${stat}</span>
      <p>${description}</p>
      ${card?.gift_mark ? html`<p className="equipment-gift-rule"><b>赠予标记：</b>此牌在手牌中时，可在自己的出牌阶段赠给另一名角色，直接装入对应槽位。已装备的牌不能从此槽赠予。</p>` : null}
      ${derived ? html`<${DerivedCardRules} card=${derived} />` : null}
      ${isZhangfenVehicle(card) ? html`<${ZhangfenCardRules} card=${card} vehicle=${zhangfenState} />` : null}
      ${isSanjianEquipment(card) ? html`<${SanjianCardRules} />` : null}
      ${isWangyunDependency(card)?html`<${WangyunCardRules} card=${card} />`:null}
      ${card?.permanent_identity?html`<p className="equipment-permanent-identity" data-permanent-identity="true">连计永久转换 · 原实体：${card.original_printed_name || "基础青釭来源武器"} · 保留实际 ${card.suit || ""}${card.rank_label || card.rank || ""}；离场、重洗不还原。</p>`:null}
      ${card?.timing ? html`<p><b>时机：</b>${card.timing}</p>` : null}
      ${card?.condition ? html`<p><b>条件：</b>${card.condition}</p>` : null}
      ${card?.limits ? html`<p><b>限制：</b>${card.limits}</p>` : null}
      ${card?.source_game ? html`<p className="equipment-source"><b>规则来源：</b>${Array.isArray(card.source_game) ? card.source_game.join(' / ') : card.source_game} · ${Array.isArray(card.source_version) ? card.source_version.join('；') : card.source_version || card.source_variant || '经典普通规则'}</p>` : null}
      ${aliases.length ? html`<p className="equipment-aliases"><b>${card?.permanent_identity?'转换前来源名：':'等效来源原名：'}</b>${aliases.join('、')}<br /><small>${card?.permanent_identity?'只保留原实体来源谱系；当前按七宝刀规则执行，并非仍与青釭/鱼肠同机制。':'同机制合并为这一件装备，不重复进入牌堆。'}</small></p>` : null}
      ${sourceRecords.length > 1 ? html`<section className="equipment-source-records" aria-label="合并装备的原始来源"><b>${card?.permanent_identity?'原实体来源谱系':'合并来源'}</b><ul>${sourceRecords.map((record, index) => html`<li key=${record.id || index}><strong>${record.source_original_name || record.name}</strong><span>${sourceText(record.source_game)} · ${sourceText(record.source_version || record.source_variant)}</span>${record.source_urls?.[0] ? html`<a href=${record.source_urls[0]} target="_blank" rel="noopener noreferrer">查看原始规则</a>` : null}</li>`)}</ul></section>` : null}
      ${card?.adaptation_notes ? html`<p className="equipment-adaptation">${Array.isArray(card.adaptation_notes) ? card.adaptation_notes.join('；') : card.adaptation_notes}</p>` : null}
      ${card?.source_urls?.length ? html`<span className="equipment-source-links">${card.source_urls.map((url, index) => html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">规则资料 ${index + 1}</a>`)}</span>` : null}
      <small>再次点击槽位可收起</small>
    </div>
  </details>`;
}

/** Static rules only. This never reads a match's reserve, draw order or hidden hands. */
export function DerivedCardRules({card = DERIVED_EQUIPMENT_CATALOG[0]}) {
  if (!card) return null;
  return html`<section className="derived-card-rules" aria-label="衍生装备来源与流转" data-derived-equipment=${card.id}>
    <strong>衍生武器 · 方块 9 · 范围 9</strong>
    <p><b>获得方式：</b>刘晔的破橹。含刘晔的对局在游戏外准备唯一实体；回合开始仅从游戏外、摸牌堆或弃牌堆获得并使用。</p>
    <p><b>数量：</b>普通初始牌堆 0 张；符合条件的对局全局 1 个实体。若在其他角色的手牌、装备或处理中，破橹不能复制或夺回。</p>
    <p><b>正常流转：</b>可被获得、弃置或更换武器；离场不销毁。进入弃牌堆后可正常洗回牌堆，任何持有者装备后均可使用效果。</p>
    <p><b>效果：</b>对其他角色造成实际正数伤害后，可弃置其当前装备区内所有牌。不限于杀；不弃手牌或判定牌，不额外加伤害。</p>
    <small>采用移动版 2021-08-03 技改规则；不使用旧版离场销毁与黑杀无视防具。</small>
  </section>`;
}
export function DerivedEquipmentGuide() {
  const [query,setQuery] = useState('');
  const matches=DERIVED_EQUIPMENT_CATALOG.filter(card=>[card.name,'刘晔 破橹 三国杀 衍生 武器 方块 9',card.source_version,card.description].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return html`<details className="derived-equipment-guide" onKeyDown=${event=>{if(event.key==='Escape'){event.preventDefault();event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();}}}>
    <summary>衍生装备图鉴 · 霹雳车 <span>来源技能获得，普通初始牌堆不额外加牌</span></summary>
    <label className="hero-search">查找衍生装备 / 来源<input type="search" aria-label="查找衍生装备或来源" value=${query} onChange=${event=>setQuery(event.target.value)} placeholder="例如：霹雳车、刘晔、破橹" /></label>
    <p className="derived-guide-status" role="status">${matches.length} 件已实现衍生装备 · 此处为规则图鉴，不显示本局隐藏牌位置</p>
    ${matches.map(card=>html`<article className="derived-guide-entry" key=${card.id}>
      <div className="derived-guide-art"><span>♦ 9</span><${CardArt} card=${card} /><strong>${card.name}</strong><small>武器 · 攻击范围 ${card.range}</small></div>
      <div><${DerivedCardRules} card=${card} /><p className="equipment-source">${card.source_game} · ${card.source_version}</p><p className="equipment-source-links">${card.source_urls.map((url,i)=>html`<a key=${url} href=${url} target="_blank" rel="noopener noreferrer">${i===0?'官方技改公告':`规则对照 ${i}`}</a>`)}</p></div>
    </article>`)}
    ${matches.length ? null : html`<p>没有匹配的已实现衍生装备。</p>`}
  </details>`;
}
