/** Complete source-bounded Mobile classic; PM1/PM2 and H0–H6 are explicit host policies. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_PANZHANGMAZHONG_HERO_ID="sgs.adapted.base.hero.pan-zhang-ma-zhong";
export const SGS_PANZHANGMAZHONG_SKILL_IDS=freeze({duodao:"sgs.duodao",anjian:"sgs.anjian"});
export const SGS_PANZHANGMAZHONG_DEFINITION=freeze({
  "schema_version": "sgs-classic-distance.hero.1",
  "key": "panzhangmazhong",
  "id": "sgs.adapted.base.hero.pan-zhang-ma-zhong",
  "source_name": "潘璋马忠",
  "display_name_proposal": "潘璋马忠",
  "product": "三国杀移动版",
  "mode": "身份",
  "official_page_id": 129,
  "selection_snapshot_date": "2026-10-15",
  "evidence_read_date": "2026-10-16",
  "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "H0: explicit host initialize current HP to intrinsic maximum; official page has no starting-HP field.",
  "gender": "male",
  "source_faction": "吴",
  "metadata_evidence": {
    "max_hp": "same-product BWIKI classic section, four 吴勾玉 image elements and numeric hidden 4; evidence/bwiki-panzhangmazhong.html line635",
    "gender": "same-product BWIKI explicit 性别 男, line626",
    "faction": "official page header 吴 and BWIKI 势力 吴 line627",
    "primary_official_hp_field": false,
    "primary_official_gender_field": false
  },
  "intrinsic_skill_inventory": [
    "夺刀",
    "暗箭"
  ],
  "skill_ids": [
    "sgs.duodao",
    "sgs.anjian"
  ],
  "personal_lord_skills": [],
  "granted_skill_inventory": [],
  "acquired_skill_inventory": [],
  "derived_card_inventory": [],
  "all_official_inline_panels_read": true,
  "full_selected_intrinsic_inventory_verified": true,
  "source_ready": true,
  "ready_for_implementation_with_disclosed_host_contract": true,
  "native_intrinsic_unresolved": [],
  "current_client_rules_verified": false,
  "current_client_hp_verified": false,
  "snapshot_historical_state_certified": false,
  "whole_roster_evidence": false,
  "source_coverage_complete": false,
  "skills": [
    {
      "name": "夺刀",
      "skill_id": "sgs.duodao",
      "original_evidence": {
        "text_sha256": "1ddd98c3a9e2e2628dcdd7b410adb21f36e29b572883a785322da0dac68f250a",
        "hidden": false,
        "html_line": 181
      },
      "evidence_class": "official_selected_literal",
      "kind": "optional_after_slash_damage_discard_then_gain_weapon",
      "timing": "After owner receives actual positive damage attributable to Slash; host runs this after dying/rescue has returned with owner alive.",
      "cost": "Owner voluntarily discards exactly one legal card from own hand or equipment area; not judgement area, private pile, virtual label or future gain.",
      "frequency": "One opportunity per actual damage event regardless of points; no once-turn, once-phase, own-turn, phase or color limit.",
      "targets": "The actual damage source equipment area weapon; not Slash card user when that differs from damage source. No distance or faction test.",
      "effects": [
        "If declined or no legal cost can be paid, nothing moves. Commit exactly one chosen H/E discard; normal equipment-leave/discard effects happen.",
        "After cost and its nested effects, obtain the current physical weapon in the actual damage source equipment area into owner hand. This is gain, not equip and not discard of the weapon. Never fetch a weapon in source hand, discard, judge, abolished slot or private pile.",
        "Never add a source-has-weapon, source-alive or other-character trigger condition absent from the selected official wording. H1 specifies source absence/death and paid-cost consequences as host decisions, not native-client certification.",
        "Single two-point Slash damage gives one discard opportunity, not two. Two distinct Slash damage events give two independent opportunities, even in one turn.",
        "Red, black and colorless actual Slash qualify; ordinary skill damage, Duel damage, HP loss, prevention, zero damage or merely becoming a Slash target do not.",
        "Host-attributed transferred/chained Slash damage is eligible through H2 event attribution. This is separate from 暗箭 direct-target requirement; do not use one shared shortcut filter."
      ],
      "same_product_faq_used": [],
      "literal_interpretations": [
        "Unqualified 一张牌 means own H/E, consistent with the base identity discard vocabulary; no expanded private/field zones.",
        "Trigger text does not test whether the source currently has a weapon.",
        "伤害后 is event based, not 每受到1点伤害."
      ],
      "host_policy_refs": [
        "H0",
        "H1",
        "H2",
        "H3",
        "H5",
        "H6"
      ],
      "id": "sgs.duodao",
      "description": "每次受到杀伤害并存活后，你可弃一张手牌或装备，再获得实际伤害来源当前装备的武器。"
    },
    {
      "name": "暗箭",
      "skill_id": "sgs.anjian",
      "original_evidence": {
        "text_sha256": "6d42e695050b93e3bbcd614d62d9d86b921e36dc59a49846074f6e0741e132f0",
        "hidden": true,
        "html_line": 182
      },
      "evidence_class": "official_selected_literal",
      "kind": "locked_direct_slash_damage_bonus",
      "timing": "Owner-used Slash is about to deal damage to one of its direct target branches, at source damage-modification stage.",
      "cost": "None.",
      "frequency": "Mandatory for each qualifying direct damage event, +1 once per event; no per-turn cap or per-point repetition.",
      "targets": "That Slash target. Check whether the owner lies outside the target-to-owner directed attack range.",
      "effects": [
        "Compare distance(target, owner) > attackRange(target), using current equipment, HP-sensitive distance passives and the target current actual attack range at this damage event, not owner attack range.",
        "When true add exactly one to this damage amount; when false preserve it. This is neither unrespondability nor extra target selection, and does not modify the number of required Dodges.",
        "Any legal owner-used Slash color/nature qualifies, including use during another character turn. A dodge or prevention that never reaches damage does not create extra damage.",
        "Use the direct target after legal Slash target redirection. H2 fixes damage transfer/chain ordering and inherited boosts; a transferred/chain descendant does not create a new 暗箭 check because it is not this Slash direct target.",
        "No owner weapon requirement. Unlike 界潘璋马忠, there is no target-declaration choice between unrespondability and +1, and unlike 界夺刀 the cost and Slash-only condition remain."
      ],
      "same_product_faq_used": [],
      "literal_interpretations": [
        "反向攻击范围: owner outside target range; not target outside owner range.",
        "对目标角色 narrows the damage event to a Slash target.",
        "锁定技 means do not ask an opt-in question."
      ],
      "host_policy_refs": [
        "H2",
        "H3",
        "H4",
        "H6"
      ],
      "id": "sgs.anjian",
      "description": "你使用杀对直接目标造成伤害时，若你在其攻击范围外，此伤害增加1。"
    }
  ],
  "full_source_signature": {
    "max_hp": 4,
    "skills": [
      {
        "name": "夺刀",
        "signature": "AFTER_RECEIVE_DAMAGE[cardIdentity=Slash; positive; once/event_not_point; any_turn; optional_cost=discard1_own(H|E); then_GAIN_current_source(E.weapon)->ownH; no_weapon_gate]"
      },
      {
        "name": "暗箭",
        "signature": "BEFORE_DEAL_DAMAGE[owner_used_Slash; direct_target; locked; if_distance(target,owner)>attackRange(target):amount+=1; once/event; any_turn; no_cost]"
      }
    ]
  },
  "version_exclusions": [
    {
      "page_id": 393,
      "name": "界·潘璋马忠",
      "differences": [
        "夺刀 accepts all damage and is free.",
        "暗箭 checks at target declaration and chooses cannot respond or damage+1."
      ]
    }
  ],
  "prior_hold_resolution": [
    {
      "id": "PM1",
      "prior_question": "May owner still discard when source is dead or has no weapon?",
      "status": "ready_literal_plus_host_contract",
      "chosen": "Allow legal one-card cost; gain only an extant eligible current source equipment weapon. Death/terminal boundaries H1/H3.",
      "native_client_certified": false,
      "reason": "Selected official trigger has no weapon-presence gate. Do not invent one as a requirement."
    },
    {
      "id": "PM2",
      "prior_question": "Exact transfer/chain ordering",
      "status": "ready_explicit_host_contract",
      "chosen": "Check/increment once at direct-source damage stage before recipient transfer. Preserve modified amount through descendants, never re-run Anjian there.",
      "native_client_certified": false,
      "reason": "Mixed-host sequencing is designed explicitly; the base +1 and reverse-range condition remain unchanged."
    }
  ],
  "source_refs": [
    "official-panzhangmazhong",
    "bwiki-panzhangmazhong",
    "official-jie-panzhang-exclusion"
  ],
  "host_policy_refs": [
    "H0",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6"
  ],
  "publication_limit": "Do not ship raw publisher HTML, copied art or FAQ in the public game. Publish original paraphrases, URLs and narrow provenance only.",
  "complete_mechanism_signature": {
    "max_hp": 4,
    "intrinsic_skill_inventory": [
      "夺刀",
      "暗箭"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "derived_card_inventory": [],
    "skills": [
      {
        "name": "夺刀",
        "skill_id": "sgs.duodao",
        "kind": "optional_after_slash_damage_discard_then_gain_weapon",
        "timing": "After owner receives actual positive damage attributable to Slash; host runs this after dying/rescue has returned with owner alive.",
        "cost": "Owner voluntarily discards exactly one legal card from own hand or equipment area; not judgement area, private pile, virtual label or future gain.",
        "frequency": "One opportunity per actual damage event regardless of points; no once-turn, once-phase, own-turn, phase or color limit.",
        "targets": "The actual damage source equipment area weapon; not Slash card user when that differs from damage source. No distance or faction test.",
        "effects": [
          "If declined or no legal cost can be paid, nothing moves. Commit exactly one chosen H/E discard; normal equipment-leave/discard effects happen.",
          "After cost and its nested effects, obtain the current physical weapon in the actual damage source equipment area into owner hand. This is gain, not equip and not discard of the weapon. Never fetch a weapon in source hand, discard, judge, abolished slot or private pile.",
          "Never add a source-has-weapon, source-alive or other-character trigger condition absent from the selected official wording. H1 specifies source absence/death and paid-cost consequences as host decisions, not native-client certification.",
          "Single two-point Slash damage gives one discard opportunity, not two. Two distinct Slash damage events give two independent opportunities, even in one turn.",
          "Red, black and colorless actual Slash qualify; ordinary skill damage, Duel damage, HP loss, prevention, zero damage or merely becoming a Slash target do not.",
          "Host-attributed transferred/chained Slash damage is eligible through H2 event attribution. This is separate from 暗箭 direct-target requirement; do not use one shared shortcut filter."
        ]
      },
      {
        "name": "暗箭",
        "skill_id": "sgs.anjian",
        "kind": "locked_direct_slash_damage_bonus",
        "timing": "Owner-used Slash is about to deal damage to one of its direct target branches, at source damage-modification stage.",
        "cost": "None.",
        "frequency": "Mandatory for each qualifying direct damage event, +1 once per event; no per-turn cap or per-point repetition.",
        "targets": "That Slash target. Check whether the owner lies outside the target-to-owner directed attack range.",
        "effects": [
          "Compare distance(target, owner) > attackRange(target), using current equipment, HP-sensitive distance passives and the target current actual attack range at this damage event, not owner attack range.",
          "When true add exactly one to this damage amount; when false preserve it. This is neither unrespondability nor extra target selection, and does not modify the number of required Dodges.",
          "Any legal owner-used Slash color/nature qualifies, including use during another character turn. A dodge or prevention that never reaches damage does not create extra damage.",
          "Use the direct target after legal Slash target redirection. H2 fixes damage transfer/chain ordering and inherited boosts; a transferred/chain descendant does not create a new 暗箭 check because it is not this Slash direct target.",
          "No owner weapon requirement. Unlike 界潘璋马忠, there is no target-declaration choice between unrespondability and +1, and unlike 界夺刀 the cost and Slash-only condition remain."
        ]
      }
    ],
    "host_contracts": [
      {
        "id": "H0",
        "title": "Initialization and context",
        "contract": "Intrinsic maximum comes from same-product classic metadata; set initial current HP=maxHP unless an explicit selected source states otherwise. Preserve gender/faction provenance. Faction is source identity context, not an invented skill; do not inherit any personal lord skill.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H1",
        "title": "Paid costs, empty/dead source and exact gain",
        "contract": "Duodao has no added weapon-presence trigger gate. Resolve accepted own H/E discard and loss hooks, then re-read source equipment weapon. No source/no weapon means cost stands and gain is empty. If the source died its cleanup normally removed weapons; never reach into discard. If cost nested hooks remove owner from play or finish match, stop remaining actions without refund. Weapon replacement during cost changes the obtainable physical card to the current weapon. These are explicit host continuation boundaries, not mobile-client-certified rulings.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H2",
        "title": "Damage identity and source-stage order",
        "contract": "Every actual damage event has stable ID, actual source ID, effective card identity and origin-use/branch ancestry. Anjian operates once only on owner-used Slash direct-target source stage; after legal target redirection and before recipient transfer/recipient modifiers. Descendants inherit finalized upstream amount/flag, do not run Anjian again. Duodao/Qiaomeng may listen to positive Slash-attributed descendants according to their broader one-role wording. Foreign damage replacements that cease being Slash damage cannot trigger them. Place Anjian alongside existing source bonuses; document deterministic tie order with Qingxi and weapon effects, before recipient reduction/prevention/transfer. Never label this mixed-product sequence an official universal ordering.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H3",
        "title": "Life cycle and stopped matches",
        "contract": "Damage is committed, then dying/rescue, then surviving after-damage hooks. Dead owners receive no new voluntary skill prompt; final death cleanup and match victory cancel unresolved continuations. Skill loss before a new opportunity prevents it; paid committed moves are never rolled back. Stable event IDs prevent duplicate hooks on resume/replay.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H4",
        "title": "Directed distance and range",
        "contract": "Distance is directed and separate from weapon attack range. Apply living-seat base distance, additive horse/passive deltas, and floor to1; explicit fixed-distance overrides retain existing host precedence. Yicong changes outgoing or incoming distance based on current owner HP, not attack range. Anjian checks target-to-owner distance against target actual range. Foreign no-distance Slash permission does not make attack range infinite.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H5",
        "title": "Moves, equipment and observer ordering",
        "contract": "Use ordinary physical-card movement events. Duodao gain E->H fires source equipment-leave events and is not equip/discard. Qiaomeng follows selected official E->discard then, for mount, discard->H; after nested listeners only gain exact card if still present. Do not clone cards, auto-install weapons/mounts or treat siege vehicles/treasures as weapons/mounts. Standard observer order governs re-entrant gains and discard replacements, visibly disclosed.",
        "basis": "explicit_host_policy_not_native_client_certification"
      },
      {
        "id": "H6",
        "title": "Prompts, UI and replay",
        "contract": "Choices show actual legal card IDs/zone, optional decline and accurate committed cost. Never reveal unchosen opponent hand cards. Revalidate choices before committing and after async nested work. Log skill owner, event/source/target IDs, actual cost/gain/card identities, range values and decision. Deterministic restore must not duplicate damage, draw or movement.",
        "basis": "explicit_host_policy_not_native_client_certification"
      }
    ]
  },
  "complete_mechanism_signature_sha256": "538bda447eec424ce197570bb1ac01b61dba814cbacfa39c981112c8ad7102b6",
  "signature_serialization": "UTF-8 JSON, ensure_ascii=false, sort_keys=true, separators=comma/colon, no trailing newline",
  "name": "潘璋马忠",
  "display_name": "潘璋马忠",
  "source_character_name": "潘璋马忠",
  "source_label": "三国杀",
  "source_game": "三国杀",
  "source_product": "sanguosha_mobile_cn",
  "faction": "吴",
  "skill_name": "夺刀 / 暗箭",
  "skill_desc": "夺刀：每次受到杀伤害并存活后，你可弃一张手牌或装备，再获得实际伤害来源当前装备的武器。暗箭：你使用杀对其直接目标造成伤害时，若你不在目标的攻击范围内，此次伤害加一。",
  "snapshot_date": "2026-10-15",
  "source_date": "2026-10-16",
  "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "source_version": "移动版经典身份潘璋马忠；PM1/PM2及H0–H6混合规则适配；当前客户端未认证",
  "source_status": "verified",
  "source_coverage": false,
  "source_core_rules_implemented": true,
  "current_client_verified": false,
  "current_client_certification": false,
  "all_intrinsic_panels_verified": true,
  "inventory_complete": true,
  "intrinsic_unresolved": [],
  "implementation_status": "tested",
  "runtime_validation_status": "module-and-controlled-real-host-tests-passed",
  "production_integration_status": "independent-module-not-publicly-admitted",
  "personal_lord_skill_ids": [],
  "granted_skill_ids": [],
  "acquired_skill_ids": [],
  "aliases": [
    "潘璋马忠",
    "三国杀·潘璋马忠"
  ],
  "host_policies": [
    {
      "id": "H0",
      "title": "Initialization and context",
      "contract": "Intrinsic maximum comes from same-product classic metadata; set initial current HP=maxHP unless an explicit selected source states otherwise. Preserve gender/faction provenance. Faction is source identity context, not an invented skill; do not inherit any personal lord skill.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H1",
      "title": "Paid costs, empty/dead source and exact gain",
      "contract": "Duodao has no added weapon-presence trigger gate. Resolve accepted own H/E discard and loss hooks, then re-read source equipment weapon. No source/no weapon means cost stands and gain is empty. If the source died its cleanup normally removed weapons; never reach into discard. If cost nested hooks remove owner from play or finish match, stop remaining actions without refund. Weapon replacement during cost changes the obtainable physical card to the current weapon. These are explicit host continuation boundaries, not mobile-client-certified rulings.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H2",
      "title": "Damage identity and source-stage order",
      "contract": "Every actual damage event has stable ID, actual source ID, effective card identity and origin-use/branch ancestry. Anjian operates once only on owner-used Slash direct-target source stage; after legal target redirection and before recipient transfer/recipient modifiers. Descendants inherit finalized upstream amount/flag, do not run Anjian again. Duodao/Qiaomeng may listen to positive Slash-attributed descendants according to their broader one-role wording. Foreign damage replacements that cease being Slash damage cannot trigger them. Place Anjian alongside existing source bonuses; document deterministic tie order with Qingxi and weapon effects, before recipient reduction/prevention/transfer. Never label this mixed-product sequence an official universal ordering.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H3",
      "title": "Life cycle and stopped matches",
      "contract": "Damage is committed, then dying/rescue, then surviving after-damage hooks. Dead owners receive no new voluntary skill prompt; final death cleanup and match victory cancel unresolved continuations. Skill loss before a new opportunity prevents it; paid committed moves are never rolled back. Stable event IDs prevent duplicate hooks on resume/replay.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H4",
      "title": "Directed distance and range",
      "contract": "Distance is directed and separate from weapon attack range. Apply living-seat base distance, additive horse/passive deltas, and floor to1; explicit fixed-distance overrides retain existing host precedence. Yicong changes outgoing or incoming distance based on current owner HP, not attack range. Anjian checks target-to-owner distance against target actual range. Foreign no-distance Slash permission does not make attack range infinite.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H5",
      "title": "Moves, equipment and observer ordering",
      "contract": "Use ordinary physical-card movement events. Duodao gain E->H fires source equipment-leave events and is not equip/discard. Qiaomeng follows selected official E->discard then, for mount, discard->H; after nested listeners only gain exact card if still present. Do not clone cards, auto-install weapons/mounts or treat siege vehicles/treasures as weapons/mounts. Standard observer order governs re-entrant gains and discard replacements, visibly disclosed.",
      "basis": "explicit_host_policy_not_native_client_certification"
    },
    {
      "id": "H6",
      "title": "Prompts, UI and replay",
      "contract": "Choices show actual legal card IDs/zone, optional decline and accurate committed cost. Never reveal unchosen opponent hand cards. Revalidate choices before committing and after async nested work. Log skill owner, event/source/target IDs, actual cost/gain/card identities, range values and decision. Deterministic restore must not duplicate damage, draw or movement.",
      "basis": "explicit_host_policy_not_native_client_certification"
    }
  ],
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-129.html",
    "https://wiki.biligame.com/msgs/%E6%BD%98%E7%92%8B%E9%A9%AC%E5%BF%A0",
    "https://www.sanguosha.cn/pc/hero-detail-393.html"
  ],
  "adaptation_notes": "选定经典身份完整夺刀、暗箭，4体力吴男；H0满体力开局。PM1允许无武器或无来源时自愿弃牌后无收益，已付成本不退；PM2直接目标伤害阶段检查反向当前距离与范围，转移及连环继承已有增量但不重算暗箭。以上生命周期和混合规则时序为宿主政策，未认证当前移动客户端。",
  "source_records": [
    {
      "id": "official-panzhangmazhong",
      "url": "https://www.sanguosha.cn/pc/hero-detail-129.html",
      "source_class": "official_selected_primary",
      "local_path": "evidence/official-panzhangmazhong.html",
      "raw_html": true,
      "accessed_at": "2026-10-16T00:26:31.671120+00:00",
      "sha256": "4f0aae5495e5e08ef71e9f9d7ba1547b8a9340a7950958b2a4dc5a1ffbe8c1bc",
      "bytes": 21361,
      "scope": "Selected official129 identity header and all2 inline panels; second hidden",
      "publication_date": null,
      "current_client_verified": false,
      "snapshot_2026_10_15_certified": false,
      "copied_from_previous_authorized_capture": true
    },
    {
      "id": "bwiki-panzhangmazhong",
      "url": "https://wiki.biligame.com/msgs/%E6%BD%98%E7%92%8B%E9%A9%AC%E5%BF%A0",
      "source_class": "same_product_community_secondary",
      "local_path": "evidence/bwiki-panzhangmazhong.html",
      "raw_html": true,
      "accessed_at": "2026-10-16T00:26:31.599248+00:00",
      "sha256": "b5e00abea1b6cac9d4d1883ba5c39ccd94a34c3c86738c61a6029254f989ab99",
      "bytes": 81575,
      "scope": "Same-product classic4HP/male/Wu explicit metadata; corroborating rules; no direct boundaryFAQ",
      "publication_date": null,
      "current_client_verified": false,
      "snapshot_2026_10_15_certified": false,
      "copied_from_previous_authorized_capture": true
    },
    {
      "id": "official-jie-panzhang-exclusion",
      "url": "https://www.sanguosha.cn/pc/hero-detail-393.html",
      "source_class": "official_primary",
      "scope": "Jie free any-damage Duodao and target-stage Anjian choice exclusion",
      "accessed_date": "2026-10-16",
      "capture_format": "web-reader text; not raw HTML",
      "raw_html": false,
      "current_client_verified": false,
      "snapshot_2026_10_15_certified": false,
      "publication_date": null
    }
  ]
});
export const SGS_PANZHANGMAZHONG_DEFINITIONS=freeze([SGS_PANZHANGMAZHONG_DEFINITION]);
