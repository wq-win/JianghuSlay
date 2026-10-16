/** Mobile identity snapshot selected 2026-10-15. Core evidence and host-only edges are separate. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const ZHANGFEN_HERO_ID='sgs.mobile.derived.hero.zhang-fen';
export const ZHANGFEN_SKILL_IDS=freeze({quchong:'sgs.mobile.zhangfen.quchong',xunjie:'sgs.mobile.zhangfen.xunjie'});
export const ZHANGFEN_FORGE_COSTS=freeze([0,5,10,10]);
export const ZHANGFEN_COMPATIBILITY=freeze({identity_only:true,death:'DH4: dead carrier discards with durability retained',functional_copy:'DH6: fresh independent durability; no native creator',hero_copy:'DH7: actor ledger persists; never inherit template owner resources',damage_order:'DH2: source boost, then Xunjie, then defense; no retroactive Xunjie',non_quchong_conversion:'held: equipped vehicle is excluded from paid conversion materials',current_client_verified:false});
export const ZHANGFEN_SOURCE=freeze({
  "key": "zhangfen",
  "proposed_id": "sgs.mobile.derived.hero.zhang-fen",
  "source_name": "张奋",
  "suggested_display_name": "张奋",
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "DH0 host normal initialization",
  "gender": "male",
  "native_faction": "吴",
  "variant": "mobile-cn-identity-quchong-2-3-durability",
  "intrinsic_skill_inventory": [
    "渠冲",
    "逊节"
  ],
  "active_intrinsic_skill_inventory_in_selected_variant": [
    "渠冲",
    "逊节"
  ],
  "personal_lord_skills": [],
  "granted_skill_inventory": [],
  "acquired_skill_inventory": [],
  "all_intrinsic_panels_read": true,
  "source_refs": [
    "official_zhangfen",
    "bwiki_zhangfen",
    "official_zhangfen_release",
    "bwiki_quchong",
    "bwiki_xunjie"
  ],
  "source_inventory_ready": true,
  "readiness": "core_source_ready_with_explicit_host_requirements",
  "native_all_boundary_rules_verified": false,
  "status_note": "Full selected hero and two native equipment core rules are specified. Native conversion/death edge rulings are held; implementation requires documented DH4-DH7, never silent invention.",
  "skills": [
    {
      "id": "sgs.mobile.zhangfen.quchong",
      "name": "渠冲",
      "type": "optional",
      "timing": "Own actual play phase action; every actual global turn end; own actual play phase start",
      "cost": "Recast one owned equipment card from hand/equipment zone; collection free; manufacturing ordinal cost identity=[0,5,10,10], team/landlord=[0,2,5,5]",
      "targets": "Recast self; collect global discard equipment; build choose one living role including self; transfer choose a role other than current carrier",
      "quota": {
        "manufacture_per_game": 4,
        "transfer": "once per actual own play-phase-start offer",
        "recast": "no skill activation limit"
      },
      "effects": [
        "Recast one equipment card from own hand or equipment zone in the play phase and draw one by recast semantics; no once-phase activation limit is printed. A card discarded by recast is not itself immediately forge value: it must remain in discard until the global turn-end collection.",
        "At each role turn end remove every currently present equipment card from the discard pile out of game; gain forge value equal to the actual number removed. This mandatory clause is inside a generally non-locked skill, and is not an optional choose-any subset.",
        "At own play-phase start, if no siege car is on the field, optionally pay the next ordinal cost, choose attack or defense, create its physical entity, give it to one role, and have that role use this equipment. Both forms share the four-manufacture cap and cost progression.",
        "If a siege car is on the field, the alternative is optionally give that existing car to another role and have that role use it. It is the same entity with the same form, remaining durability and creator; no fresh manufacture, no cost advancement, no repair or upgrade is printed.",
        "The movement exception applies to movements actually caused by Quchong, including its own recast of an equipped siege car, not only the transfer sub-effect. Recasting that car does not invoke its non-Quchong durability penalty; it leaves by recast and the recaster draws one. The explicit same-product community example supports this reading, while that guide’s conflicting Xunjie summary is not adopted.",
        "This exception is not a blanket exemption for all cards moved by Zhang Fen. For transfer, the recipient uses the card: do not silently place it into equipment without gain/use triggers.",
        "Outside the selected identity variant preserve the explicitly different team/landlord costs as a separate mode specification. Do not substitute another product’s Wanglu/Xianzhu/Chaixie skills or treasure upgrade car."
      ],
      "source_refs": [
        "official_zhangfen",
        "bwiki_zhangfen",
        "bwiki_quchong",
        "bwiki_revisions",
        "community_zhangfen_recast"
      ]
    },
    {
      "id": "sgs.mobile.zhangfen.xunjie",
      "name": "逊节",
      "type": "locked",
      "timing": "When owner is about to take damage, before HP application",
      "cost": "One ordinary judgment, mandatory when condition holds",
      "targets": "Current owner damage packet with an actual source whose current HP is strictly greater than owner HP",
      "quota": null,
      "effects": [
        "Check that there is no siege car manufactured by this owner on the field. A car lent to an ally or enemy still counts; simply not equipping a car yourself does not enable the skill.",
        "If the actual damage source exists and has strictly higher current HP, perform a judgment. Red result reduces this packet by exactly one; black has no reduction. This is not the rejected test rule “not spade”.",
        "It applies to damage, not HP loss; no source or equal/lower source HP does not meet the condition. Reduced-to-zero damage has no actual damage or after-damage effects.",
        "No per-turn/round cap is printed. The official condition tracks a car manufactured by you, unlike Quchong’s public text “a car on field”. Duplicate heroes require DH3 rather than erasing creator identity."
      ],
      "source_refs": [
        "official_zhangfen",
        "bwiki_zhangfen",
        "bwiki_xunjie"
      ]
    }
  ],
  "release_evidence": {
    "official_announcement_date": "2024-09-30",
    "official_activity": "10月1日假日活动",
    "community_launch_date": "2024-10-01",
    "in_scope_before_cutoff": true,
    "all_modes_current_availability_verified": false
  },
  "host_policy_refs": [
    "DH0",
    "DH1",
    "DH2",
    "DH3",
    "DH4",
    "DH5",
    "DH6",
    "DH7",
    "DH8",
    "DH9",
    "DH10"
  ],
  "source_product": "sanguosha_mobile_cn",
  "source_snapshot_requested": "2026-10-15",
  "current_client_verified": false,
  "implementation_status": "isolated-tested-awaiting-host-integration",
  "initial_random_deck_copies": 0,
  "normal_random_deck_eligible": false,
  "source_mode_complete": false,
  "equipment_ids": [
    "sgs.mobile.derived.zhangfen.dagongche-attack",
    "sgs.mobile.derived.zhangfen.dagongche-defend"
  ],
  "complete_mechanism_signature": {
    "max_hp": 4,
    "gender": "male",
    "native_faction": "吴",
    "intrinsics": [
      {
        "timing": "Own actual play phase action; every actual global turn end; own actual play phase start",
        "cost": "Recast one owned equipment card from hand/equipment zone; collection free; manufacturing ordinal cost identity=[0,5,10,10], team/landlord=[0,2,5,5]",
        "targets": "Recast self; collect global discard equipment; build choose one living role including self; transfer choose a role other than current carrier",
        "quota": {
          "manufacture_per_game": 4,
          "transfer": "once per actual own play-phase-start offer",
          "recast": "no skill activation limit"
        },
        "effects": [
          "Recast one equipment card from own hand or equipment zone in the play phase and draw one by recast semantics; no once-phase activation limit is printed. A card discarded by recast is not itself immediately forge value: it must remain in discard until the global turn-end collection.",
          "At each role turn end remove every currently present equipment card from the discard pile out of game; gain forge value equal to the actual number removed. This mandatory clause is inside a generally non-locked skill, and is not an optional choose-any subset.",
          "At own play-phase start, if no siege car is on the field, optionally pay the next ordinal cost, choose attack or defense, create its physical entity, give it to one role, and have that role use this equipment. Both forms share the four-manufacture cap and cost progression.",
          "If a siege car is on the field, the alternative is optionally give that existing car to another role and have that role use it. It is the same entity with the same form, remaining durability and creator; no fresh manufacture, no cost advancement, no repair or upgrade is printed.",
          "The movement exception applies to movements actually caused by Quchong, including its own recast of an equipped siege car, not only the transfer sub-effect. Recasting that car does not invoke its non-Quchong durability penalty; it leaves by recast and the recaster draws one. The explicit same-product community example supports this reading, while that guide’s conflicting Xunjie summary is not adopted.",
          "This exception is not a blanket exemption for all cards moved by Zhang Fen. For transfer, the recipient uses the card: do not silently place it into equipment without gain/use triggers.",
          "Outside the selected identity variant preserve the explicitly different team/landlord costs as a separate mode specification. Do not substitute another product’s Wanglu/Xianzhu/Chaixie skills or treasure upgrade car."
        ],
        "type": "optional"
      },
      {
        "timing": "When owner is about to take damage, before HP application",
        "cost": "One ordinary judgment, mandatory when condition holds",
        "targets": "Current owner damage packet with an actual source whose current HP is strictly greater than owner HP",
        "quota": null,
        "effects": [
          "Check that there is no siege car manufactured by this owner on the field. A car lent to an ally or enemy still counts; simply not equipping a car yourself does not enable the skill.",
          "If the actual damage source exists and has strictly higher current HP, perform a judgment. Red result reduces this packet by exactly one; black has no reduction. This is not the rejected test rule “not spade”.",
          "It applies to damage, not HP loss; no source or equal/lower source HP does not meet the condition. Reduced-to-zero damage has no actual damage or after-damage effects.",
          "No per-turn/round cap is printed. The official condition tracks a car manufactured by you, unlike Quchong’s public text “a car on field”. Duplicate heroes require DH3 rather than erasing creator identity."
        ],
        "type": "locked"
      }
    ],
    "derived_equipment_signatures": [
      {
        "category": "equipment",
        "type": "武器",
        "slot": "weapon",
        "attack_range": 9,
        "power": 0,
        "printed_face": {
          "source_value": "customizable",
          "suit": null,
          "rank": null,
          "basis": "bwiki_dagongche",
          "host_configuration": "DH8"
        },
        "initial_durability": 2,
        "acquisition": {
          "source_hero_id": "sgs.mobile.derived.hero.zhang-fen",
          "source_skill": "渠冲",
          "obtain_then_use": true,
          "ordinary_deck": false,
          "manually_random_added": false
        },
        "entry": [
          "When this card actually enters equipment, discard all other equipment of the new carrier. Ordinary loss effects for the actually discarded other cards still occur.",
          "While this car is equipped, another equipment card that would enter that carrier equipment goes to discard instead. It never entered the slot; do not run its entry effects or treat it as replacing the car."
        ],
        "leave": [
          "If a move would remove this card from equipment and is not caused by Quchong, prevent that move and decrease durability by one. No successful loss, theft or transfer has happened.",
          "A Quchong transfer removes and reuses the same entity without this durability penalty. Quchong recast also leaves normally without this penalty and draws one. Re-entry does not reset remaining durability.",
          "At durability zero destroy this entity. Destruction is not the prevented ordinary move and must not recursively try to prevent itself. Destroyed entities cannot be drawn, shuffled, stolen or counted as discarded equipment for forge value."
        ],
        "damage_effect": {
          "timing": "source causes damage, before target HP",
          "activation": "optional",
          "cost": "reduce this entity durability by one",
          "amount": "current damage + min(global game round,3)",
          "applies_to": "every actual damage source channel, not only Slash",
          "target": "the one current packet target; official says a role, not only another role",
          "at_last_durability": "pending +X still resolves after entity is destroyed by cost",
          "limit": "once per current packet offer, no extra printed turn limit"
        },
        "lifecycle": {
          "creation": "new physical ID per successful manufacture",
          "durability_on_reentry": "preserved; initialization only on manufacture",
          "on_creator_death": "no explicit source clause destroys another carrier car",
          "on_carrier_death": "native ruling not closed; DH4 is a proposed host contract only",
          "conversion_material": "native special handling not closed; held C2",
          "destruction_destination": "out_of_game_destroyed",
          "ordinary_leave_destination": "move prevented unless Quchong; native exception scope beyond text held",
          "copy": "DH6; no native cross-game equivalence claim"
        }
      },
      {
        "category": "equipment",
        "type": "武器",
        "slot": "weapon",
        "attack_range": 9,
        "power": 0,
        "printed_face": {
          "source_value": "customizable",
          "suit": null,
          "rank": null,
          "basis": "bwiki_dagongche",
          "host_configuration": "DH8"
        },
        "initial_durability": 3,
        "acquisition": {
          "source_hero_id": "sgs.mobile.derived.hero.zhang-fen",
          "source_skill": "渠冲",
          "obtain_then_use": true,
          "ordinary_deck": false,
          "manually_random_added": false
        },
        "entry": [
          "When this card actually enters equipment, discard all other equipment of the new carrier. Ordinary loss effects for the actually discarded other cards still occur.",
          "While this car is equipped, another equipment card that would enter that carrier equipment goes to discard instead. It never entered the slot; do not run its entry effects or treat it as replacing the car."
        ],
        "leave": [
          "If a move would remove this card from equipment and is not caused by Quchong, prevent that move and decrease durability by one. No successful loss, theft or transfer has happened.",
          "A Quchong transfer removes and reuses the same entity without this durability penalty. Quchong recast also leaves normally without this penalty and draws one. Re-entry does not reset remaining durability.",
          "At durability zero destroy this entity. Destruction is not the prevented ordinary move and must not recursively try to prevent itself. Destroyed entities cannot be drawn, shuffled, stolen or counted as discarded equipment for forge value."
        ],
        "damage_effect": {
          "timing": "carrier about to receive damage, before HP",
          "activation": "mandatory",
          "cost": "k=min(current positive damage, remaining durability)",
          "amount": "reduce current damage by k and durability by k",
          "applies_to": "all damage natures and sources, not HP loss",
          "at_last_durability": "pending reduction still resolves after entity reaches0 and is destroyed",
          "limit": "each eligible packet; cannot choose to spend fewer durability"
        },
        "lifecycle": {
          "creation": "new physical ID per successful manufacture",
          "durability_on_reentry": "preserved; initialization only on manufacture",
          "on_creator_death": "no explicit source clause destroys another carrier car",
          "on_carrier_death": "native ruling not closed; DH4 is a proposed host contract only",
          "conversion_material": "native special handling not closed; held C2",
          "destruction_destination": "out_of_game_destroyed",
          "ordinary_leave_destination": "move prevented unless Quchong; native exception scope beyond text held",
          "copy": "DH6; no native cross-game equivalence claim"
        }
      }
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "mode": "identity"
  },
  "complete_mechanism_signature_sha256": "d1800be21521906e86bf2a4e4d6ec0fa37a47af9bfd187d3ebdfb0c5e8ef9572",
  "id": "sgs.mobile.derived.hero.zhang-fen",
  "source_faction": "吴",
  "faction": "吴",
  "skill_ids": [
    "sgs.mobile.zhangfen.quchong",
    "sgs.mobile.zhangfen.xunjie"
  ],
  "source_urls": [
    "https://www.sanguosha.cn/hero-detail-593.html",
    "https://wiki.biligame.com/msgs/张奋",
    "https://www.sanguosha.cn/index.php/pc/news-detail-1922.html",
    "https://wiki.biligame.com/msgs/渠冲",
    "https://wiki.biligame.com/msgs/逊节"
  ]
});
export const ZHANGFEN_EQUIPMENT_CATALOG=freeze([
  {
    "id": "sgs.mobile.derived.zhangfen.dagongche-attack",
    "equipment_id": "sgs.mobile.derived.zhangfen.dagongche-attack",
    "source_rule_id": "sgs.mobile.derived.zhangfen.dagongche-attack",
    "name": "大攻车·进击",
    "base_name": "大攻车·进击",
    "form": "attack",
    "type": "武器",
    "slot": "weapon",
    "range": 9,
    "power": 0,
    "trait": "zhangfen_siege_attack",
    "initial_durability": 2,
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版身份·2026-10-15目录快照",
    "source_variant": "mobile-cn-identity-quchong-2-3-durability",
    "source_status": "source-core-with-explicit-host-contracts",
    "implementation_status": "isolated-tested-awaiting-host-integration",
    "source_urls": [
      "https://www.sanguosha.cn/hero-detail-593.html",
      "https://wiki.biligame.com/msgs/大攻车"
    ],
    "normal_random_deck_eligible": false,
    "ordinary_deck": false,
    "initial_random_deck_copies": 0,
    "source_deck_copies": 0,
    "printed_face": "customizable-before-match",
    "suit": null,
    "rank": null,
    "color": null,
    "aliases": [
      "sgs_car_attack",
      "sgs.special.equipment.car_attack"
    ],
    "description": "攻击范围9。造成伤害时可消耗1耐久使伤害+min(全局轮数,3)。入装备区弃置其他装备；其他装备入场改为弃置。非渠冲移出被阻止并耗1耐久；耐久耗尽销毁。",
    "mechanism_signature": {
      "category": "equipment",
      "type": "武器",
      "slot": "weapon",
      "attack_range": 9,
      "power": 0,
      "printed_face": {
        "source_value": "customizable",
        "suit": null,
        "rank": null,
        "basis": "bwiki_dagongche",
        "host_configuration": "DH8"
      },
      "initial_durability": 2,
      "acquisition": {
        "source_hero_id": "sgs.mobile.derived.hero.zhang-fen",
        "source_skill": "渠冲",
        "obtain_then_use": true,
        "ordinary_deck": false,
        "manually_random_added": false
      },
      "entry": [
        "When this card actually enters equipment, discard all other equipment of the new carrier. Ordinary loss effects for the actually discarded other cards still occur.",
        "While this car is equipped, another equipment card that would enter that carrier equipment goes to discard instead. It never entered the slot; do not run its entry effects or treat it as replacing the car."
      ],
      "leave": [
        "If a move would remove this card from equipment and is not caused by Quchong, prevent that move and decrease durability by one. No successful loss, theft or transfer has happened.",
        "A Quchong transfer removes and reuses the same entity without this durability penalty. Quchong recast also leaves normally without this penalty and draws one. Re-entry does not reset remaining durability.",
        "At durability zero destroy this entity. Destruction is not the prevented ordinary move and must not recursively try to prevent itself. Destroyed entities cannot be drawn, shuffled, stolen or counted as discarded equipment for forge value."
      ],
      "damage_effect": {
        "timing": "source causes damage, before target HP",
        "activation": "optional",
        "cost": "reduce this entity durability by one",
        "amount": "current damage + min(global game round,3)",
        "applies_to": "every actual damage source channel, not only Slash",
        "target": "the one current packet target; official says a role, not only another role",
        "at_last_durability": "pending +X still resolves after entity is destroyed by cost",
        "limit": "once per current packet offer, no extra printed turn limit"
      },
      "lifecycle": {
        "creation": "new physical ID per successful manufacture",
        "durability_on_reentry": "preserved; initialization only on manufacture",
        "on_creator_death": "no explicit source clause destroys another carrier car",
        "on_carrier_death": "native ruling not closed; DH4 is a proposed host contract only",
        "conversion_material": "native special handling not closed; held C2",
        "destruction_destination": "out_of_game_destroyed",
        "ordinary_leave_destination": "move prevented unless Quchong; native exception scope beyond text held",
        "copy": "DH6; no native cross-game equivalence claim"
      }
    },
    "mechanism_signature_sha256": "6864490a9c796dc0b19c4a2f99b226194aa3a3ee49eb8df25e621fcbe4476fc9",
    "current_client_verified": false,
    "host_policy_ids": [
      "DH0",
      "DH1",
      "DH2",
      "DH3",
      "DH4",
      "DH5",
      "DH6",
      "DH7",
      "DH8",
      "DH9",
      "DH10"
    ]
  },
  {
    "id": "sgs.mobile.derived.zhangfen.dagongche-defend",
    "equipment_id": "sgs.mobile.derived.zhangfen.dagongche-defend",
    "source_rule_id": "sgs.mobile.derived.zhangfen.dagongche-defend",
    "name": "大攻车·守御",
    "base_name": "大攻车·守御",
    "form": "defend",
    "type": "武器",
    "slot": "weapon",
    "range": 9,
    "power": 0,
    "trait": "zhangfen_siege_defend",
    "initial_durability": 3,
    "source_game": "三国杀",
    "source_product": "sanguosha_mobile_cn",
    "source_version": "移动版身份·2026-10-15目录快照",
    "source_variant": "mobile-cn-identity-quchong-2-3-durability",
    "source_status": "source-core-with-explicit-host-contracts",
    "implementation_status": "isolated-tested-awaiting-host-integration",
    "source_urls": [
      "https://www.sanguosha.cn/hero-detail-593.html",
      "https://wiki.biligame.com/msgs/大攻车"
    ],
    "normal_random_deck_eligible": false,
    "ordinary_deck": false,
    "initial_random_deck_copies": 0,
    "source_deck_copies": 0,
    "printed_face": "customizable-before-match",
    "suit": null,
    "rank": null,
    "color": null,
    "aliases": [
      "sgs_car_defend",
      "sgs.special.equipment.car_defend"
    ],
    "description": "攻击范围9。受到伤害时强制消耗至多等量耐久并防止等量伤害。入装备区弃置其他装备；其他装备入场改为弃置。非渠冲移出被阻止并耗1耐久；耐久耗尽销毁。",
    "mechanism_signature": {
      "category": "equipment",
      "type": "武器",
      "slot": "weapon",
      "attack_range": 9,
      "power": 0,
      "printed_face": {
        "source_value": "customizable",
        "suit": null,
        "rank": null,
        "basis": "bwiki_dagongche",
        "host_configuration": "DH8"
      },
      "initial_durability": 3,
      "acquisition": {
        "source_hero_id": "sgs.mobile.derived.hero.zhang-fen",
        "source_skill": "渠冲",
        "obtain_then_use": true,
        "ordinary_deck": false,
        "manually_random_added": false
      },
      "entry": [
        "When this card actually enters equipment, discard all other equipment of the new carrier. Ordinary loss effects for the actually discarded other cards still occur.",
        "While this car is equipped, another equipment card that would enter that carrier equipment goes to discard instead. It never entered the slot; do not run its entry effects or treat it as replacing the car."
      ],
      "leave": [
        "If a move would remove this card from equipment and is not caused by Quchong, prevent that move and decrease durability by one. No successful loss, theft or transfer has happened.",
        "A Quchong transfer removes and reuses the same entity without this durability penalty. Quchong recast also leaves normally without this penalty and draws one. Re-entry does not reset remaining durability.",
        "At durability zero destroy this entity. Destruction is not the prevented ordinary move and must not recursively try to prevent itself. Destroyed entities cannot be drawn, shuffled, stolen or counted as discarded equipment for forge value."
      ],
      "damage_effect": {
        "timing": "carrier about to receive damage, before HP",
        "activation": "mandatory",
        "cost": "k=min(current positive damage, remaining durability)",
        "amount": "reduce current damage by k and durability by k",
        "applies_to": "all damage natures and sources, not HP loss",
        "at_last_durability": "pending reduction still resolves after entity reaches0 and is destroyed",
        "limit": "each eligible packet; cannot choose to spend fewer durability"
      },
      "lifecycle": {
        "creation": "new physical ID per successful manufacture",
        "durability_on_reentry": "preserved; initialization only on manufacture",
        "on_creator_death": "no explicit source clause destroys another carrier car",
        "on_carrier_death": "native ruling not closed; DH4 is a proposed host contract only",
        "conversion_material": "native special handling not closed; held C2",
        "destruction_destination": "out_of_game_destroyed",
        "ordinary_leave_destination": "move prevented unless Quchong; native exception scope beyond text held",
        "copy": "DH6; no native cross-game equivalence claim"
      }
    },
    "mechanism_signature_sha256": "0432919361d88ea4682eb28a396be92d6f758ac110bbea51e0aebbadce4423df",
    "current_client_verified": false,
    "host_policy_ids": [
      "DH0",
      "DH1",
      "DH2",
      "DH3",
      "DH4",
      "DH5",
      "DH6",
      "DH7",
      "DH8",
      "DH9",
      "DH10"
    ]
  }
]);
export const ZHANGFEN_EQUIPMENT_BY_FORM=freeze(Object.fromEntries(ZHANGFEN_EQUIPMENT_CATALOG.map(d=>[d.form,d])));
export function zhangfen_equipment_definition(value){const id=typeof value==='string'?value:value?.equipment_id??value?.id;return ZHANGFEN_EQUIPMENT_CATALOG.find(d=>d.id===id||d.aliases.includes(id))??null;}
export function validate_zhangfen_faces(faces){for(const form of ['attack','defend']){const f=faces?.[form];if(!f||!['黑桃','红桃','梅花','方块'].includes(f.suit)||!Number.isInteger(f.rank)||f.rank<1||f.rank>13)throw Error('大攻车开局卡面必须为每种形态指定合法花色与1..13点数');}return {attack:{...faces.attack},defend:{...faces.defend}};}
