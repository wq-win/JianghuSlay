import {sgs_yijiang_further_xushu_public_state,sgs_restore_general} from './sgs-yijiang-further-xushu.js';
import {sgs_yijiang_further_quancong_public_state} from './sgs-yijiang-further-quancong.js';
import {rule_hero} from './effective-hero.js';
import {sgs_yijiang_further_guyong_public_state} from './sgs-yijiang-further-guyong.js';
import {sgs_yijiang_further_xiahoushi_public_state,sgs_yanyu_recast_count} from './sgs-yijiang-further-xiahoushi.js';
/** JSON-safe public projections never allocate actor skill ledgers. */
export const yijiangFurtherRuntimeMethods={
 restore_general(actor,options={}){return sgs_restore_general(this,actor,options);},
 yijiang_further_public_state(actor){
  const ids=rule_hero(actor)?.skill_ids??[],has=(skills,field)=>skills.some(id=>ids.includes(id))||Boolean(actor[field]);
  const gu=has(['sgs.shenxing','sgs.bingyi'],'sgs_yijiang_further_guyong_state'),xia=has(['sgs.qiaoshi','sgs.yanyu'],'sgs_yijiang_further_xiahoushi_state');
  const xu=has(['sgs.wuyan','sgs.jujian'],'sgs_yijiang_further_xushu_state'),quan=has(['sgs.yaoming'],'sgs_yijiang_further_quancong_state');
  if(!gu&&!xia&&!xu&&!quan)return null;
  return {guyong:gu?sgs_yijiang_further_guyong_public_state(actor):null,xiahoushi:xia?{...sgs_yijiang_further_xiahoushi_public_state(actor),current_recast_count:sgs_yanyu_recast_count(this,actor)}:null,xushu:xu?sgs_yijiang_further_xushu_public_state(actor):null,quancong:quan?sgs_yijiang_further_quancong_public_state(actor,this):null};
 },
};
