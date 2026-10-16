/** Complete selected classic Mobile identity packet; import does not admit a hero. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_CAOXIU_HERO_ID="sgs.adapted.base.hero.cao-xiu";
export const SGS_CAOXIU_SKILL_IDS=freeze({qianju:"sgs.qianju",qingxi:"sgs.qingxi"});
export const SGS_CAOXIU_DEFINITION=freeze({
  "key": "caoxiu",
  "id": "sgs.adapted.base.hero.cao-xiu",
  "source_name": "曹休",
  "display_name_proposal": "曹休",
  "product": "三国杀移动版",
  "mode": "身份",
  "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "official_page_id": 186,
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "NH0 explicit host initialization",
  "gender": "male",
  "source_faction": "魏",
  "metadata_evidence": {
    "source_ref": "bwiki-caoxiu",
    "max_hp": "First classic card: count jade-icon image elements and corroborate hidden numeric value; not image appearance inference.",
    "gender": "Explicit 性别 text field",
    "source_faction": "Official header plus explicit same-product Wiki 势力 field"
  },
  "intrinsic_skill_inventory": [
    "千驹",
    "倾袭"
  ],
  "skill_ids": [
    "sgs.qianju",
    "sgs.qingxi"
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
  "whole_roster_evidence": false,
  "source_coverage_complete": false,
  "source_ready": true,
  "ready_for_implementation_with_disclosed_host_contract": true,
  "implementation_status": "tested",
  "source_refs": [
    "official-caoxiu",
    "bwiki-caoxiu"
  ],
  "skills": [
    {
      "name": "千驹",
      "skill_id": "sgs.qianju",
      "kind": "locked_directed_distance_modifier",
      "timing": "Whenever owner-to-other distance is calculated",
      "cost": "None",
      "quota": "Continuous, no activation quota",
      "targets": "Owner to each other role",
      "effects": [
        "Reduce outgoing distance by current lost HP=maxHP-currentHP, only while injured; full HP reduction0.",
        "This affects all distance calculations, not only Slash range. It is not an attack-range bonus, weapon-range rewrite or incoming-distance penalty.",
        "Recompute from current runtime HP/maxHP on each query; no permanent counter. NH4 governs floor and foreign fixed-distance rules."
      ],
      "original_evidence": {
        "name": "千驹",
        "mode": "身份",
        "mode_group_index": 0,
        "selected": true,
        "original_text": "千驹[jū]。锁定技，若你已受伤，你计算与其他角色距离时-X（X为你已损失体力值）。",
        "text_sha256": "ce9db33581b2cbe1ca6de6a5832f1fab9b19d197f78aa73edaf3838944e97096",
        "html_path": "evidence/official-caoxiu.html",
        "html_line": 181,
        "hidden_skill_panel": false,
        "hidden_mode_group": false
      },
      "source_refs": [
        "official-caoxiu",
        "bwiki-caoxiu"
      ],
      "native_intrinsic_unresolved": []
    },
    {
      "name": "倾袭",
      "skill_id": "sgs.qingxi",
      "kind": "optional_direct_slash_damage_choice",
      "timing": "When owner used Slash is about to deal positive damage to that Slash target and owner equipment area has a weapon",
      "cost": "No up-front owner card/HP payment. Optional target branch1 discards X H then owner weapon is discarded as effect.",
      "quota": "One optional opportunity per qualifying direct Slash damage event; no per-turn/per-phase cap, not per point.",
      "targets": "Current direct target of that owner-used Slash",
      "effects": [
        "Only own used Slash direct-target damage qualifies. Slash used during another turn or through a legal conversion still qualifies; damage from Duels, independent skills, transferred recipients or chain descendants does not create new opportunities.",
        "An actual equipped weapon is required, not a weapon in hand, a range skill, a siege vehicle in another slot or a skill that grants weapon effects without a weapon card.",
        "Owner may decline, preserving original damage and all cards. If owner invokes, the target chooses either discard exactly X hand cards, where X is the qualifying weapon card own range, then discard that weapon; or current damage +1.",
        "The target, not Cao Xiu, chooses which of their H cards to discard. H<X cannot pay branch1; no partial discard and no use of equipment-area cards. Target may choose +1 even with enough cards.",
        "Successful branch1 does NOT prevent the original Slash damage. It leaves base/current damage unchanged, then ordinary damage pipeline continues after actual loss hooks.",
        "Branch2 does not discard the weapon. A successful Dodge before damage creates no QINGXI opportunity; no new Dodge or Nullification window is created by this non-card choice.",
        "Use exact physical weapon snapshot/range and explicit NH5-NH9 for foreign equipment, death, skill loss, damage order and replay. No color gate, target-times gate, judgment, Slash unrespondability or forced target extra cards from 界曹休."
      ],
      "original_evidence": {
        "name": "倾袭",
        "mode": "身份",
        "mode_group_index": 0,
        "selected": true,
        "original_text": "当你使用【杀】对目标角色造成伤害时，若你的装备区里有武器牌，你可令其选择一项：1.弃置等同于此武器牌攻击范围张数的手牌，然后弃置此牌；2.令此伤害+1。",
        "text_sha256": "6b04de9a45402d17db61e2f7e13bed85cd3c5915b180b27aad829181cea0e26a",
        "html_path": "evidence/official-caoxiu.html",
        "html_line": 182,
        "hidden_skill_panel": true,
        "hidden_mode_group": false
      },
      "source_refs": [
        "official-caoxiu",
        "bwiki-caoxiu"
      ],
      "native_intrinsic_unresolved": []
    }
  ],
  "intrinsic_unresolved": [],
  "version_and_scope_notes": [
    "Official classic page186 and same-product Wiki classic agree on 4HP male Wei and 千驹/倾袭. Wiki disambiguates 界曹休 separately; page560 is excluded, not substituted.",
    "No personal lord, awakening, acquired skill or derived card in full selected intrinsic package.",
    "All native explicit cost, timing, quota scope and choice mechanics closed. General cross-game ordering and exotic foreign death/skill-loss clauses remain explicitly host policies, never claimed as native rulings."
  ],
  "host_policy_refs": [
    "NH0",
    "NH1",
    "NH2",
    "NH3",
    "NH4",
    "NH5",
    "NH6",
    "NH7",
    "NH8",
    "NH9"
  ],
  "name": "曹休",
  "display_name": "曹休",
  "skill_name": "千驹/倾袭",
  "skill_desc": "千驹：已受伤时，计算与其他角色距离减已损失体力。倾袭：装备武器的杀将对直接目标造成伤害时，可令其弃等同该武器范围的手牌，然后弃该武器；或令此伤害加1。",
  "source_character_name": "曹休",
  "source_label": "三国杀",
  "source_game": "三国杀",
  "source_status": "verified",
  "source_coverage": false,
  "runtime_validation_status": "module-tested-local",
  "production_integration_status": "independent-module-not-publicly-admitted",
  "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "snapshot_date": "2026-10-15",
  "source_date": "2026-10-15",
  "faction": "魏",
  "aliases": [
    "三国杀曹休",
    "cao-xiu",
    "caoxiu",
    "千驹",
    "倾袭"
  ],
  "source_id_aliases": [],
  "personal_lord_skill_ids": [],
  "granted_skill_ids": [],
  "acquired_skill_ids": [],
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-186.html",
    "https://wiki.biligame.com/msgs/%E6%9B%B9%E4%BC%91"
  ],
  "source_records": [
    {
      "id": "official-caoxiu",
      "url": "https://www.sanguosha.cn/pc/hero-detail-186.html",
      "captured_at": "2026-10-16T03:27:51.338080+00:00",
      "status": 200,
      "final_url": "https://www.sanguosha.cn/pc/hero-detail-186.html",
      "bytes": 21150,
      "sha256": "a1b585a7192af7d4d8e2dd8f3f71ea3e93afd3c9a3f09ecb75beddbd99c188f1",
      "local_path": "evidence/official-caoxiu.html",
      "evidence_tier": "primary_official_catalog",
      "selected_read_date": "2026-10-16",
      "historical_snapshot_certified": false,
      "current_client_verified": false,
      "copyright_scope": "Local audit only; do not bundle raw HTML or artwork in published game."
    },
    {
      "id": "bwiki-caoxiu",
      "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E4%BC%91",
      "captured_at": "2026-10-16T03:27:51.344469+00:00",
      "status": 200,
      "final_url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E4%BC%91",
      "bytes": 81640,
      "sha256": "634eeb041af8cb4ed900c8772da13c21237bfe23e6b013d04358d2d523a8ebd3",
      "local_path": "evidence/bwiki-caoxiu.html",
      "evidence_tier": "same_product_community_wiki",
      "selected_read_date": "2026-10-16",
      "historical_snapshot_certified": false,
      "current_client_verified": false,
      "copyright_scope": "Local audit only; do not bundle raw HTML or artwork in published game."
    }
  ],
  "source_skill_rules": [
    {
      "name": "千驹",
      "skill_id": "sgs.qianju",
      "kind": "locked_directed_distance_modifier",
      "timing": "Whenever owner-to-other distance is calculated",
      "cost": "None",
      "quota": "Continuous, no activation quota",
      "targets": "Owner to each other role",
      "effects": [
        "Reduce outgoing distance by current lost HP=maxHP-currentHP, only while injured; full HP reduction0.",
        "This affects all distance calculations, not only Slash range. It is not an attack-range bonus, weapon-range rewrite or incoming-distance penalty.",
        "Recompute from current runtime HP/maxHP on each query; no permanent counter. NH4 governs floor and foreign fixed-distance rules."
      ],
      "original_evidence": {
        "name": "千驹",
        "mode": "身份",
        "mode_group_index": 0,
        "selected": true,
        "original_text": "千驹[jū]。锁定技，若你已受伤，你计算与其他角色距离时-X（X为你已损失体力值）。",
        "text_sha256": "ce9db33581b2cbe1ca6de6a5832f1fab9b19d197f78aa73edaf3838944e97096",
        "html_path": "evidence/official-caoxiu.html",
        "html_line": 181,
        "hidden_skill_panel": false,
        "hidden_mode_group": false
      },
      "source_refs": [
        "official-caoxiu",
        "bwiki-caoxiu"
      ],
      "native_intrinsic_unresolved": []
    },
    {
      "name": "倾袭",
      "skill_id": "sgs.qingxi",
      "kind": "optional_direct_slash_damage_choice",
      "timing": "When owner used Slash is about to deal positive damage to that Slash target and owner equipment area has a weapon",
      "cost": "No up-front owner card/HP payment. Optional target branch1 discards X H then owner weapon is discarded as effect.",
      "quota": "One optional opportunity per qualifying direct Slash damage event; no per-turn/per-phase cap, not per point.",
      "targets": "Current direct target of that owner-used Slash",
      "effects": [
        "Only own used Slash direct-target damage qualifies. Slash used during another turn or through a legal conversion still qualifies; damage from Duels, independent skills, transferred recipients or chain descendants does not create new opportunities.",
        "An actual equipped weapon is required, not a weapon in hand, a range skill, a siege vehicle in another slot or a skill that grants weapon effects without a weapon card.",
        "Owner may decline, preserving original damage and all cards. If owner invokes, the target chooses either discard exactly X hand cards, where X is the qualifying weapon card own range, then discard that weapon; or current damage +1.",
        "The target, not Cao Xiu, chooses which of their H cards to discard. H<X cannot pay branch1; no partial discard and no use of equipment-area cards. Target may choose +1 even with enough cards.",
        "Successful branch1 does NOT prevent the original Slash damage. It leaves base/current damage unchanged, then ordinary damage pipeline continues after actual loss hooks.",
        "Branch2 does not discard the weapon. A successful Dodge before damage creates no QINGXI opportunity; no new Dodge or Nullification window is created by this non-card choice.",
        "Use exact physical weapon snapshot/range and explicit NH5-NH9 for foreign equipment, death, skill loss, damage order and replay. No color gate, target-times gate, judgment, Slash unrespondability or forced target extra cards from 界曹休."
      ],
      "original_evidence": {
        "name": "倾袭",
        "mode": "身份",
        "mode_group_index": 0,
        "selected": true,
        "original_text": "当你使用【杀】对目标角色造成伤害时，若你的装备区里有武器牌，你可令其选择一项：1.弃置等同于此武器牌攻击范围张数的手牌，然后弃置此牌；2.令此伤害+1。",
        "text_sha256": "6b04de9a45402d17db61e2f7e13bed85cd3c5915b180b27aad829181cea0e26a",
        "html_path": "evidence/official-caoxiu.html",
        "html_line": 182,
        "hidden_skill_panel": true,
        "hidden_mode_group": false
      },
      "source_refs": [
        "official-caoxiu",
        "bwiki-caoxiu"
      ],
      "native_intrinsic_unresolved": []
    }
  ],
  "host_compatibility_policies": [
    {
      "id": "NH0",
      "kind": "cross_game_host_compatibility",
      "rule": "Template HP from selected classic metadata. Jianghu starts at template max HP; no separately sourced starting-HP field. Faction/gender retained independently of team/role. No mode lord HP bonus is intrinsic."
    },
    {
      "id": "NH1",
      "kind": "cross_game_host_compatibility",
      "rule": "Effective skill ownership and binding identity govern hooks, copying, disability, loss and regain. Copy entire intrinsic package, never receipts or display-name inferred powers. No new prompt after death, game end or invalid binding."
    },
    {
      "id": "NH2",
      "kind": "cross_game_host_compatibility",
      "rule": "Stable owner/binding/event receipts make costs, choices, damage changes and card moves exactly-once across duplicate callbacks, cancellation, save/reload and replay. Pure legality/AI previews do not consume RNG, reserve cards or mutate state. Before commitment revalidate identities, epochs, source/target liveness and active binding."
    },
    {
      "id": "NH3",
      "kind": "cross_game_host_compatibility",
      "rule": "Move actual physical cards through atomic public movement receipts before nested leave/loss hooks. Prevented movement is not paid cost; partial or stale payment must never produce a successful branch. Only reveal cards at their actual public move/show. AI accesses its own hand and public state only."
    },
    {
      "id": "NH4",
      "kind": "cross_game_host_compatibility",
      "rule": "Use directed current distance, with host floor1 between distinct living players. Additive distance modifiers differ from weapon printed range and from actor attack range. Fixed-range/ignore-distance card effects keep their existing host rules. Outgoing modifiers never change incoming distance."
    },
    {
      "id": "NH5",
      "kind": "cross_game_host_compatibility",
      "rule": "For Cao Xiu, place optional QINGXI at source-causing direct-Slash damage before receiver transfer, receive prevention/armor and HP loss; this is an explicitly selected Jianghu mixed-game ordering, not a certified native current-client order. Apply once per damage event, not per damage point. Receiver prevention later can still prevent boosted damage. Chain descendants inherit root actual damage and do not prompt QINGXI again."
    },
    {
      "id": "NH6",
      "kind": "cross_game_host_compatibility",
      "rule": "QINGXI snapshots the selected physical weapon and its own printed base attack-range value when committing the option, not holder total range or distance bonus. Foreign multi-weapon equipment selects one concrete weapon; unrecognized weapons without an explicit numeric source range are unavailable as a QINGXI basis until mapped, never defaulted from holder range. Disabled equipment effects do not erase its card identity/range."
    },
    {
      "id": "NH7",
      "kind": "cross_game_host_compatibility",
      "rule": "QINGXI target pays exactly X legal physical hand cards; no equipment/special pile/judgment substitute. After full hand payment, discard the snapshotted source weapon if still in its original source equipment zone; never chase it into another zone or discard a replacement weapon. If foreign protection prevents the later weapon discard, completed hand payment still selects the no-boost branch: it is a sequential effect, not a weapon-as-cost prerequisite. This interaction is a host choice, not native vehicle evidence."
    },
    {
      "id": "NH8",
      "kind": "cross_game_host_compatibility",
      "rule": "QINGXI is committed when target choice and exact hand payment (for branch1) commit. If foreign nested hand-loss kills either participant, retain paid cards and finish only safe already-committed movement while the match remains active, then suppress damage to a dead target. Skill loss after commitment does not refund payment or erase its selected damage modifier. No new dead-holder decisions. Native exotic death/skill-loss continuation not certified."
    },
    {
      "id": "NH9",
      "kind": "cross_game_host_compatibility",
      "rule": "QINGXI adds exactly1 to the current positive direct-Slash damage event; it is not a separate hit, HP loss, extra Slash, unblockability, additional play quota or a new card. Ordinary card response/target legality already resolved before this source-damage event. It does not open Dodge/Nullification against the skill decision."
    }
  ],
  "complete_mechanism_signature": {
    "id": "sgs.adapted.base.hero.cao-xiu",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "魏",
    "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
    "intrinsic_skill_inventory": [
      "千驹",
      "倾袭"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "derived_card_inventory": [],
    "skills": [
      {
        "name": "千驹",
        "skill_id": "sgs.qianju",
        "kind": "locked_directed_distance_modifier",
        "timing": "Whenever owner-to-other distance is calculated",
        "cost": "None",
        "quota": "Continuous, no activation quota",
        "targets": "Owner to each other role",
        "effects": [
          "Reduce outgoing distance by current lost HP=maxHP-currentHP, only while injured; full HP reduction0.",
          "This affects all distance calculations, not only Slash range. It is not an attack-range bonus, weapon-range rewrite or incoming-distance penalty.",
          "Recompute from current runtime HP/maxHP on each query; no permanent counter. NH4 governs floor and foreign fixed-distance rules."
        ],
        "original_evidence": {
          "name": "千驹",
          "mode": "身份",
          "mode_group_index": 0,
          "selected": true,
          "original_text": "千驹[jū]。锁定技，若你已受伤，你计算与其他角色距离时-X（X为你已损失体力值）。",
          "text_sha256": "ce9db33581b2cbe1ca6de6a5832f1fab9b19d197f78aa73edaf3838944e97096",
          "html_path": "evidence/official-caoxiu.html",
          "html_line": 181,
          "hidden_skill_panel": false,
          "hidden_mode_group": false
        },
        "source_refs": [
          "official-caoxiu",
          "bwiki-caoxiu"
        ],
        "native_intrinsic_unresolved": []
      },
      {
        "name": "倾袭",
        "skill_id": "sgs.qingxi",
        "kind": "optional_direct_slash_damage_choice",
        "timing": "When owner used Slash is about to deal positive damage to that Slash target and owner equipment area has a weapon",
        "cost": "No up-front owner card/HP payment. Optional target branch1 discards X H then owner weapon is discarded as effect.",
        "quota": "One optional opportunity per qualifying direct Slash damage event; no per-turn/per-phase cap, not per point.",
        "targets": "Current direct target of that owner-used Slash",
        "effects": [
          "Only own used Slash direct-target damage qualifies. Slash used during another turn or through a legal conversion still qualifies; damage from Duels, independent skills, transferred recipients or chain descendants does not create new opportunities.",
          "An actual equipped weapon is required, not a weapon in hand, a range skill, a siege vehicle in another slot or a skill that grants weapon effects without a weapon card.",
          "Owner may decline, preserving original damage and all cards. If owner invokes, the target chooses either discard exactly X hand cards, where X is the qualifying weapon card own range, then discard that weapon; or current damage +1.",
          "The target, not Cao Xiu, chooses which of their H cards to discard. H<X cannot pay branch1; no partial discard and no use of equipment-area cards. Target may choose +1 even with enough cards.",
          "Successful branch1 does NOT prevent the original Slash damage. It leaves base/current damage unchanged, then ordinary damage pipeline continues after actual loss hooks.",
          "Branch2 does not discard the weapon. A successful Dodge before damage creates no QINGXI opportunity; no new Dodge or Nullification window is created by this non-card choice.",
          "Use exact physical weapon snapshot/range and explicit NH5-NH9 for foreign equipment, death, skill loss, damage order and replay. No color gate, target-times gate, judgment, Slash unrespondability or forced target extra cards from 界曹休."
        ],
        "original_evidence": {
          "name": "倾袭",
          "mode": "身份",
          "mode_group_index": 0,
          "selected": true,
          "original_text": "当你使用【杀】对目标角色造成伤害时，若你的装备区里有武器牌，你可令其选择一项：1.弃置等同于此武器牌攻击范围张数的手牌，然后弃置此牌；2.令此伤害+1。",
          "text_sha256": "6b04de9a45402d17db61e2f7e13bed85cd3c5915b180b27aad829181cea0e26a",
          "html_path": "evidence/official-caoxiu.html",
          "html_line": 182,
          "hidden_skill_panel": true,
          "hidden_mode_group": false
        },
        "source_refs": [
          "official-caoxiu",
          "bwiki-caoxiu"
        ],
        "native_intrinsic_unresolved": []
      }
    ],
    "host_policy_refs": [
      "NH0",
      "NH1",
      "NH2",
      "NH3",
      "NH4",
      "NH5",
      "NH6",
      "NH7",
      "NH8",
      "NH9"
    ],
    "intrinsic_unresolved": []
  },
  "complete_mechanism_signature_sha256": "4341d1ffa0e88d7e722a6e34096ba0f6fd613c3bc1db1bcb7a787ede8cb1b2d1"
});
export const SGS_CAOXIU_DEFINITIONS=freeze([SGS_CAOXIU_DEFINITION]);
