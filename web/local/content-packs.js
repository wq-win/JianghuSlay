import {SANJIAN_PACK_ID} from './sanjian-catalog.mjs';
/** Optional packs are fixed at match creation and included in every replay. */
export const ZHUQUE_EQUIPMENT_PACK_ID='yxs_zhuque_equipment_compat_1';
export const YOUJIAN_EQUIPMENT_PACK_ID='sgs_youjian_equipment_compat_1';
export const CONTENT_PACKS=Object.freeze([]);
// Optional mode packs are archived outside this conventional release.
export function normalize_content_packs(value=[]){
 if(!Array.isArray(value)||value.some(id=>typeof id!=='string'||!CONTENT_PACKS.some(pack=>pack.id===id)))throw new Error('当前版本仅使用常规牌堆，可选模式牌包已退出，请重新开局。');
 return [...new Set(value)].sort();
}
