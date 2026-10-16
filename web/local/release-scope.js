/** The 2026-10-16 user-selected conventional release. Historical modules remain
 * in git for recovery, but are not eligible for play, random selection or copying. */
export const RELEASE_SCOPE = 'ordinary-heroes-conventional-deck-2026-10-16';
export const EXCLUDED_SPECIAL_HERO_IDS = Object.freeze([
 'sgs.mobile.base.hero.liu-ye',
 'sgs.mobile.hero.wangyun.20231207',
 'sgs.mobile.derived.hero.zhang-fen',
]);
export const is_hero_in_release = hero => !!hero && !EXCLUDED_SPECIAL_HERO_IDS.includes(hero.id);
export const CONVENTIONAL_GENERATED_CARD_NAMES = Object.freeze(['五谷丰登','桃园结义']);
export function validate_conventional_config(config = {}) {
 if (config.zhangfen_faces != null) throw new Error('当前版本仅保留常规玩法，专属衍生牌配置已退出，请重新开局。');
 return true;
}
