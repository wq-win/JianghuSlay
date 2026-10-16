import {html} from 'htm/react';
export const OFFENSIVE_WINE_RULES='普通酒：每个实际回合限一次，使本回合下一张杀伤害+1；使用该杀后不返还酒次数，未消耗加伤在真正回合结束清除。当先额外出牌和普通出牌共用次数。濒死酒仅自救回复1点基础体力（受技能修正），不占普通酒次数。';
export function canUseOffensiveWineCard(card,player){
 if(card?.type!=='酒')return true;
 if(typeof card.ordinary_wine_allowed==='boolean')return card.ordinary_wine_allowed;
 const m=player?.marks||{};
 if(m.all_hand_as_sha||m.shixian)return true;
 if(m.red_hand_as_tao&&card.color==='红'&&player.hp<player.max_hp)return true;
 return (m.offensive_wine_uses_this_turn??0)<1;
}
const close=e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();e.stopPropagation();}};
export function OrdinaryWineRules({player}){if(!player?.hand?.some(c=>c.type==='酒')&&!(player?.marks?.offensive_wine_uses_this_turn>0))return null;return html`<details className="hero-provenance wine-turn-rules" onKeyDown=${close} data-offensive-wine-used=${player.marks?.offensive_wine_uses_this_turn??0}><summary>酒 · 普通使用本回合${player.marks?.offensive_wine_uses_this_turn>0?'已用':'未用'}</summary><p>${OFFENSIVE_WINE_RULES}</p><p>红牌当桃、手牌当杀等转化按实际使用的功能结算，不占普通酒次数。濒死救援走自己的响应窗口。普通酒回合次数来自移动版官方规则；救援与普通次数分开是明示宿主响应政策。</p></details>`;}
