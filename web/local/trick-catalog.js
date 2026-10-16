/** Source-versioned mandatory trick batch; quantity belongs to Jianghu deck counts. */
export const TRICK_CATALOG=Object.freeze([
  {
    "id": "sgs.adapted.trick.nullification",
    "name": "无懈可击",
    "type": "锦囊",
    "source_game": "三国杀",
    "source_variant": "移动版普通身份/军争共享规则",
    "source_snapshot": "2026-10-15",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/99.html",
      "https://ks3-cn-beijing.ksyun.com/attachment/74ad98665ac744c138ba8c988d85d149"
    ],
    "source_status": "verified-shared-rule",
    "implementation_status": "tested",
    "adaptation_notes": "江湖混合规则实现；牌堆张数为本作适配，不是原作牌堆。官方国战页只取普通无懈共享效果，不加入无懈可击·国。旧FAQ只用于延时窗口交叉，不能整体当当前规则。",
    "rule_type": "非延时锦囊",
    "rule_timing": "一张锦囊即将对某个目标产生效果时；也可响应另一张无懈可击",
    "rule_limits": "不抵消杀、装备技能、普通英雄技能；多目标锦囊只影响当前目标；无次数限制"
  },
  {
    "id": "sgs.adapted.trick.borrowed-sword",
    "name": "借刀杀人",
    "type": "锦囊",
    "source_game": "三国杀",
    "source_variant": "移动版普通身份/军争共享规则",
    "source_snapshot": "2026-10-15",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/98.html"
    ],
    "source_status": "verified-shared-rule",
    "implementation_status": "tested",
    "adaptation_notes": "江湖混合规则实现；牌堆张数为本作适配，不是原作牌堆。",
    "rule_type": "非延时锦囊",
    "rule_timing": "自己的出牌阶段",
    "rule_limits": "无全局距离限制；仅A到B按攻击范围和目标合法性检查；不是使用者直接造成伤害"
  },
  {
    "id": "sgs.adapted.trick.iron-chain",
    "name": "铁索连环",
    "type": "锦囊",
    "source_game": "三国杀",
    "source_variant": "移动版普通身份/军争共享规则",
    "source_snapshot": "2026-10-15",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/102.html",
      "https://gltjk.com/sanguosha/rules/glossary/description.html",
      "https://www.ourplay.net/ask/detail/6417",
      "https://www.sohu.com/a/405411410_120641284"
    ],
    "source_status": "verified-shared-rule",
    "implementation_status": "tested",
    "adaptation_notes": "江湖混合规则实现；牌堆张数为本作适配，不是原作牌堆。传导精细边界为通用规则镜像及二级解释交叉；非最新移动端裁判全集。血杀/毒杀不可仅凭名称当火/雷。",
    "rule_type": "非延时锦囊",
    "rule_timing": "自己的出牌阶段",
    "rule_limits": "重铸不视为使用或弃置；只有火/雷等属性伤害会传导；普通伤害、失去体力不传导"
  },
  {
    "id": "sgs.adapted.trick.fire-attack",
    "name": "火攻",
    "type": "锦囊",
    "source_game": "三国杀",
    "source_variant": "移动版普通身份/军争共享规则",
    "source_snapshot": "2026-10-15",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/103.html",
      "https://bug.sanguosha.com/announce?id=76&mod=announce",
      "https://games.sina.com.cn/o/z/sanguosha/2011-09-26/1752425974.shtml"
    ],
    "source_status": "verified-shared-rule",
    "implementation_status": "tested",
    "adaptation_notes": "江湖混合规则实现；牌堆张数为本作适配，不是原作牌堆。旧FAQ对“最后一张火攻能否自火”与后期官方修订冲突；采用后期允许选自己、结算无手牌则失败。",
    "rule_type": "非延时锦囊",
    "rule_timing": "自己的出牌阶段",
    "rule_limits": "无距离限制；匹配四种花色，不是只比红黑；展示牌不丢弃也不转移"
  },
  {
    "id": "sgs.adapted.trick.supply-shortage",
    "name": "兵粮寸断",
    "type": "锦囊",
    "source_game": "三国杀",
    "source_variant": "移动版普通身份/军争共享规则",
    "source_snapshot": "2026-10-15",
    "source_urls": [
      "https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/113.html",
      "https://ks3-cn-beijing.ksyun.com/attachment/74ad98665ac744c138ba8c988d85d149"
    ],
    "source_status": "verified-shared-rule",
    "implementation_status": "tested",
    "adaptation_notes": "江湖混合规则实现；牌堆张数为本作适配，不是原作牌堆。",
    "rule_type": "延时锦囊",
    "rule_timing": "自己的出牌阶段放置；目标下次判定阶段结算",
    "rule_limits": "攻击范围加大不等于距离缩短；坐骑修改距离；不叠放同名牌；不跳过出牌阶段"
  }
].map(entry=>Object.freeze({...entry,source_urls:Object.freeze(entry.source_urls)})));
export const TRICK_BY_NAME=Object.freeze(Object.fromEntries(TRICK_CATALOG.map(entry=>[entry.name,entry])));
