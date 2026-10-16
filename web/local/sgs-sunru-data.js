/** Complete selected Mobile identity source. Technical module admission only; release coverage remains gated. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_SUNRU_HERO_ID="sgs.adapted.base.hero.sun-ru";
export const SGS_SUNRU_SKILL_IDS=freeze({"yingjian": "sgs.yingjian", "shixin": "sgs.shixin"});
export const SGS_SUNRU_DEFINITION=freeze({
  "key": "sunru",
  "id": "sgs.adapted.base.hero.sun-ru",
  "source_name": "孙茹",
  "display_name_proposal": "孙茹",
  "product": "三国杀移动版",
  "mode": "身份",
  "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "official_page_id": 58,
  "catalog_record_id": "sgs-mobile:hero-page:58",
  "max_hp": 3,
  "starting_hp": 3,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "FH0 explicit host initialization",
  "gender": "female",
  "source_faction": "吴",
  "faction": "吴",
  "intrinsic_skill_inventory": [
    "影箭",
    "释衅"
  ],
  "skill_ids": [
    "sgs.yingjian",
    "sgs.shixin"
  ],
  "personal_lord_skills": [],
  "granted_skill_inventory": [],
  "acquired_skill_inventory": [],
  "derived_card_inventory": [],
  "all_official_inline_panels_read": true,
  "full_selected_intrinsic_inventory_verified": true,
  "current_client_rules_verified": false,
  "current_client_hp_verified": false,
  "snapshot_historical_state_certified": false,
  "source_ready": true,
  "ready_for_implementation_with_disclosed_host_contract": true,
  "implementation_status": "tested",
  "skills": [
    {
      "skill_id": "sgs.yingjian",
      "name": "影箭",
      "kind": "optional_zero_material_virtual_slash_use",
      "timing": "Start/trigger window of owner actual preparation phase",
      "quota": "At most one activation for this actual preparation event; an extra play phase is not another preparation phase",
      "cost": "No discard, no material card, no HP loss and no phase skip",
      "targets": "Choose one ordinary legal other living Slash target, friend or foe; distance restriction waived, not target restrictions",
      "effects": [
        "If chosen, USE an ordinary normal-nature Slash with no materials; source/user is this skill holder, and Slash is real card-use history.",
        "The ordinary Slash may be answered by Dodge and ordinary target/damage interactions; it is not independent unanswerable skill damage.",
        "The virtual use does not spend the later play-phase Slash quota. It does not consume a physical hand card and does not make source_last_hand=true.",
        "Its no-distance property allows a target outside the actual weapon range but does not change actual attack range or distance values for other abilities.",
        "No skipped judgment/draw/play stage; prepare precedes judgment, so scheduled draw/play skips do not themselves remove Yingjian.",
        "A face-down skipped entire turn has no preparation event. A genuinely new preparation phase creates a new opportunity.",
        "A material-free card is not a real card to take back from discard; normal suit/color/rank checks see none under FH6. Weapon effects can legally alter the virtual Slash via the ordinary use path."
      ],
      "derived_interpretations": [
        "Classic same-product Wiki explicitly says ordinary Slash. No-card metadata and play-phase quota integration use FH6, not a new intrinsic bonus.",
        "Do not hard-disable ordinary extra-target modifiers from other abilities; this skill itself grants just one-target ordinary Slash. No-distance propagation to those additional targets needs generic card-use contract, not hardcoded enemy-only UI."
      ],
      "source_refs": [
        "official-sunru",
        "bwiki-sunru"
      ],
      "original_evidence": {
        "source_id": "official-sunru",
        "html_path": "evidence/official-sunru.html",
        "html_line": 184,
        "original_text": "准备阶段，你可以视为使用一张无距离限制的【杀】",
        "text_sha256": "3cef6169ba7ade2106b473ebf6c487e546b79bd4ad5dc42287a234598e961f0f",
        "hidden_panel": false
      }
    },
    {
      "skill_id": "sgs.shixin",
      "name": "释衅",
      "kind": "locked_receive_fire_damage_prevention",
      "timing": "Receiving fire-nature damage before HP loss",
      "quota": "Every applicable damage event; no activation cost, quota, draw or heal",
      "cost": "None",
      "targets": "Owner as current recipient",
      "effects": [
        "Prevent all incoming fire damage to the effective holder, regardless of amount, source, whether it comes from a card or skill, or whether it is a transferred chain packet.",
        "Does not prevent normal/thunder damage or direct loss of HP. Does not prevent owner from dealing fire damage to others.",
        "No damage occurs: no HP loss, dying, damage-after benefits or new chain propagation caused by the prevented packet. Existing chain status is retained if no elemental damage was actually received.",
        "When holder is a non-root chain recipient, only that branch is prevented; other independently queued recipients continue under the chain engine.",
        "Fire-boosting armor cannot override immunity; armor-ignore effects do not disable this intrinsic locked skill. Disabled/lost Shixin itself does remove prevention.",
        "Use explicit pre-cost receiver prevention FH7 so native siege-car durability is not spent to reduce damage that Shixin prevents. This mixed-game cost order is host policy, not an official mobile interaction claim."
      ],
      "derived_interpretations": [
        "Chain no-damage consequences derive from prevention plus the host actual-damage pipeline. No current-client test claimed."
      ],
      "source_refs": [
        "official-sunru",
        "bwiki-sunru"
      ],
      "original_evidence": {
        "source_id": "official-sunru",
        "html_path": "evidence/official-sunru.html",
        "html_line": 185,
        "original_text": "锁定技，你不会受到火焰伤害。",
        "text_sha256": "6fcb35778523908475525df98ef5852c68850c2ce7e4684bee4b11567fee406f",
        "hidden_panel": true
      }
    }
  ],
  "source_refs": [
    "official-sunru",
    "bwiki-sunru"
  ],
  "version_and_scope_notes": [
    "Official raw HTML has hidden second panel 释衅; visible webpage extraction alone omitted it. Both skills are required as one hero.",
    "3HP female Wu classic is explicit Wiki metadata; no skin/asymmetric variant is included.",
    "No-distance use does not mean infinite actual attack range."
  ],
  "intrinsic_unresolved": [],
  "host_policy_refs": [
    "FH0",
    "FH1",
    "FH2",
    "FH3",
    "FH4",
    "FH5",
    "FH6",
    "FH7",
    "FH8",
    "FH9",
    "FH10"
  ],
  "name": "孙茹",
  "display_name": "孙茹",
  "skill_name": "影箭/释衅",
  "skill_desc": "影箭：准备阶段，你可以视为使用一张无距离限制的【杀】 释衅：锁定技，你不会受到火焰伤害。",
  "source_game": "三国杀",
  "source_label": "三国杀",
  "source_product": "sanguosha_mobile_cn",
  "source_character_name": "孙茹",
  "source_status": "verified",
  "runtime_validation_status": "module-tests-awaiting-release-admission",
  "source_coverage": false,
  "source_inventory_ready": true,
  "current_client_verified": false,
  "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "source_version": "移动版身份目录选择2026-10-15；2026-10-16实读；未核验当前客户端",
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-58.html",
    "https://wiki.biligame.com/msgs/%E5%AD%99%E8%8C%B9"
  ],
  "source_identity_context": {
    "product": "三国杀移动版",
    "mode": "身份",
    "selection_date": "2026-10-15",
    "read_date": "2026-10-16"
  },
  "complete_skill_ids": [
    "sgs.yingjian",
    "sgs.shixin"
  ],
  "aliases": [
    "孙茹",
    "影箭",
    "释衅"
  ],
  "source_skill_rules": [
    {
      "skill_id": "sgs.yingjian",
      "name": "影箭",
      "kind": "optional_zero_material_virtual_slash_use",
      "timing": "Start/trigger window of owner actual preparation phase",
      "quota": "At most one activation for this actual preparation event; an extra play phase is not another preparation phase",
      "cost": "No discard, no material card, no HP loss and no phase skip",
      "targets": "Choose one ordinary legal other living Slash target, friend or foe; distance restriction waived, not target restrictions",
      "effects": [
        "If chosen, USE an ordinary normal-nature Slash with no materials; source/user is this skill holder, and Slash is real card-use history.",
        "The ordinary Slash may be answered by Dodge and ordinary target/damage interactions; it is not independent unanswerable skill damage.",
        "The virtual use does not spend the later play-phase Slash quota. It does not consume a physical hand card and does not make source_last_hand=true.",
        "Its no-distance property allows a target outside the actual weapon range but does not change actual attack range or distance values for other abilities.",
        "No skipped judgment/draw/play stage; prepare precedes judgment, so scheduled draw/play skips do not themselves remove Yingjian.",
        "A face-down skipped entire turn has no preparation event. A genuinely new preparation phase creates a new opportunity.",
        "A material-free card is not a real card to take back from discard; normal suit/color/rank checks see none under FH6. Weapon effects can legally alter the virtual Slash via the ordinary use path."
      ],
      "derived_interpretations": [
        "Classic same-product Wiki explicitly says ordinary Slash. No-card metadata and play-phase quota integration use FH6, not a new intrinsic bonus.",
        "Do not hard-disable ordinary extra-target modifiers from other abilities; this skill itself grants just one-target ordinary Slash. No-distance propagation to those additional targets needs generic card-use contract, not hardcoded enemy-only UI."
      ],
      "source_refs": [
        "official-sunru",
        "bwiki-sunru"
      ],
      "original_evidence": {
        "source_id": "official-sunru",
        "html_path": "evidence/official-sunru.html",
        "html_line": 184,
        "original_text": "准备阶段，你可以视为使用一张无距离限制的【杀】",
        "text_sha256": "3cef6169ba7ade2106b473ebf6c487e546b79bd4ad5dc42287a234598e961f0f",
        "hidden_panel": false
      }
    },
    {
      "skill_id": "sgs.shixin",
      "name": "释衅",
      "kind": "locked_receive_fire_damage_prevention",
      "timing": "Receiving fire-nature damage before HP loss",
      "quota": "Every applicable damage event; no activation cost, quota, draw or heal",
      "cost": "None",
      "targets": "Owner as current recipient",
      "effects": [
        "Prevent all incoming fire damage to the effective holder, regardless of amount, source, whether it comes from a card or skill, or whether it is a transferred chain packet.",
        "Does not prevent normal/thunder damage or direct loss of HP. Does not prevent owner from dealing fire damage to others.",
        "No damage occurs: no HP loss, dying, damage-after benefits or new chain propagation caused by the prevented packet. Existing chain status is retained if no elemental damage was actually received.",
        "When holder is a non-root chain recipient, only that branch is prevented; other independently queued recipients continue under the chain engine.",
        "Fire-boosting armor cannot override immunity; armor-ignore effects do not disable this intrinsic locked skill. Disabled/lost Shixin itself does remove prevention.",
        "Use explicit pre-cost receiver prevention FH7 so native siege-car durability is not spent to reduce damage that Shixin prevents. This mixed-game cost order is host policy, not an official mobile interaction claim."
      ],
      "derived_interpretations": [
        "Chain no-damage consequences derive from prevention plus the host actual-damage pipeline. No current-client test claimed."
      ],
      "source_refs": [
        "official-sunru",
        "bwiki-sunru"
      ],
      "original_evidence": {
        "source_id": "official-sunru",
        "html_path": "evidence/official-sunru.html",
        "html_line": 185,
        "original_text": "锁定技，你不会受到火焰伤害。",
        "text_sha256": "6fcb35778523908475525df98ef5852c68850c2ce7e4684bee4b11567fee406f",
        "hidden_panel": true
      }
    }
  ],
  "adaptation_notes": "FH0–FH10跨作宿主兼容：初始满体力；真实阶段事件及稳定回执；无当前客户端或历史网页快照认证。影箭普通无实体杀沿用完整用牌/响应流程；释衅在当前接收者转移和防具/车辆消耗前防止火伤。"
});
export const SGS_SUNRU_DEFINITIONS=Object.freeze([SGS_SUNRU_DEFINITION]);
export const SGS_SUNRU_HOST_POLICIES=freeze([
  {
    "id": "FH0",
    "kind": "cross_game_host_compatibility",
    "rule": "Template HP is the explicit classic metadata, not a lord bonus. Normal Jianghu initialization begins at template max HP; starting HP is not a separately sourced original field. Save original faction/gender separately from team, role and mutable runtime max HP."
  },
  {
    "id": "FH1",
    "kind": "cross_game_host_compatibility",
    "rule": "Use contextual functional identity: use-only/response-only conversion never changes a discard, count or transfer classification. Cost card categories are basic/trick/equipment; delayed and nondelayed tricks share trick family. Only physically present cards count in equipped-zone counts even if effects are suppressed. Special piles and judgment area are not owner hand/equipment payment zones."
  },
  {
    "id": "FH2",
    "kind": "cross_game_host_compatibility",
    "rule": "Exact once per actual event, using stable owner, skill-binding, turn, phase/card-use/damage identifiers. Pure legal-option probes never allocate state or consume RNG. Repeated UI answers and replay cannot pay, draw, attack or prevent again. Stale decision input is rejected and recomputed before commitment; cancellation before commitment costs nothing."
  },
  {
    "id": "FH3",
    "kind": "cross_game_host_compatibility",
    "rule": "Move real cards through the atomic public card movement path. Commit receipts before nested loss/leave hooks. Pay only if the selected physical entity actually moves as required. Prevented movement (including protected derived vehicles) is not successful cost. Do not fabricate card copies or fill an empty deck; normal draw/shuffle rules apply."
  },
  {
    "id": "FH4",
    "kind": "cross_game_host_compatibility",
    "rule": "A real phase has its own phase_event_id. Skipped phases and skipped face-down turns create no skill window; face-down holders may still act at another player end phase. A replacement of normal draw suppresses normal draw-count modifiers. Extra phases create new events; extra play phases alone do not create prepare/draw/end windows."
  },
  {
    "id": "FH5",
    "kind": "cross_game_host_compatibility",
    "rule": "No new decision by a dead holder; terminate on actual match end. For mixed-game nested loss/death interactions, committed costs remain paid. Yue Jin who dies during his cost cannot start a new independent damage or draw action; if target successfully discarded equipment then dies during its leave triggers, a surviving Yue Jin still completes his already-committed draw. This is a disclosed Jianghu lifecycle choice, not a native mobile ruling."
  },
  {
    "id": "FH6",
    "kind": "cross_game_host_compatibility",
    "rule": "Sun Ru zero-material ordinary Slash is a real virtual card USE with no suit/color/rank/material entity. It has no distance or play-phase quota cost, but still respects target/use prohibitions, equipment transformations and ordinary response, target, damage and card-use histories. No phase is skipped. Existing physical last-hand bonuses cannot be inferred from having zero hand."
  },
  {
    "id": "FH7",
    "kind": "cross_game_host_compatibility",
    "rule": "Shixin is a locked receive-side prevention for the current final receiver on positive fire damage, including chain-transferred or sourceless damage. Implement before consuming receiver armor/derived-vehicle durability and before HP loss/dying/damage history/chain unchaining. Source-side already committed costs are not refunded. Mixed-game ordering versus optional damage-transfer skills is explicit host policy: mandatory fire immunity of the current receiver precedes its optional transfer; re-evaluate immunity when a transfer changes receiver. This is not an official mobile cross-game ordering ruling."
  },
  {
    "id": "FH8",
    "kind": "cross_game_host_compatibility",
    "rule": "Effective skills and binding identity govern ownership, copies, disability, loss and regain. Copying does not copy another player receipts or refresh already-used same-event opportunities; complete intrinsic inventory including locked Shixin is required. Sun Ru is female, Ling Cao/Yue Jin male, preserved for existing gender-sensitive skills. No dependence on display name."
  },
  {
    "id": "FH9",
    "kind": "cross_game_host_compatibility",
    "rule": "Persist public receipts and pending decisions with schema/content migration and deterministic replay. Never silently load an unfinished callback as completed. UI/AI see only public counts and their own private cards; selected disclosed cost or transfer becomes public only at the correct movement/show step."
  },
  {
    "id": "FH10",
    "kind": "cross_game_host_compatibility",
    "rule": "The selected units are classic identity templates only; common mode rules are external. No Guozhan partners/reveal rules, 1v1 mode or OL ceil-Dujin included. Original portraits/icons must be newly authored; preserved original names, skill names and source links do not grant permission to ship official art or raw research HTML."
  }
]);
