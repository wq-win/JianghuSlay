/** Complete source-bounded classic Mobile Cao Ang. H0–H9 are explicit host policies. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_CAOANG_HERO_ID="sgs.adapted.base.hero.cao-ang";
export const SGS_CAOANG_SKILL_IDS=freeze({kangkai:"sgs.kangkai"});
export const SGS_CAOANG_DEFINITION=freeze({
  "key": "caoang",
  "id": "sgs.adapted.base.hero.cao-ang",
  "name": "曹昂",
  "display_name": "曹昂",
  "source_name": "曹昂",
  "source_character_name": "曹昂",
  "source_label": "三国杀",
  "source_game": "三国杀",
  "source_product": "sanguosha_mobile_cn",
  "product": "三国杀移动版",
  "mode": "身份",
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "H0 host initializes at intrinsic maximum; mode lord bonus remains separate",
  "gender": "male",
  "faction": "魏",
  "source_faction": "魏",
  "official_page_id": 83,
  "skill_name": "慷忾",
  "skill_desc": "一名角色成为杀的最终目标后，若与你距离不大于1，你可摸一张牌，然后交给其一张手牌或装备并展示；若为装备牌，该角色可立即使用。自己成为目标时只摸牌，不交给自己或立即装备。",
  "skill_ids": [
    "sgs.kangkai"
  ],
  "intrinsic_skill_inventory": [
    "慷忾"
  ],
  "personal_lord_skills": [],
  "personal_lord_skill_ids": [],
  "granted_skill_inventory": [],
  "granted_skill_ids": [],
  "acquired_skill_inventory": [],
  "acquired_skill_ids": [],
  "derived_card_inventory": [],
  "all_intrinsic_panels_verified": true,
  "inventory_complete": true,
  "intrinsic_unresolved": [],
  "source_variant": "mobile-classic-identity-official83-community-classic-selected-2026-10-15-read-2026-10-16",
  "variant": "mobile-classic-identity-official83-community-classic-selected-2026-10-15-read-2026-10-16",
  "source_version": "移动版经典身份曹昂；H0–H9混合规则适配；当前客户端未认证",
  "snapshot_date": "2026-10-15",
  "source_date": "2026-10-16",
  "source_status": "verified",
  "source_coverage": false,
  "source_core_rules_implemented": true,
  "current_client_rules_verified": false,
  "current_client_hp_verified": false,
  "current_client_verified": false,
  "current_client_certification": false,
  "native_lifecycle_verified": false,
  "whole_roster_evidence": false,
  "implementation_status": "tested",
  "runtime_validation_status": "module-and-controlled-real-host-tests-passed",
  "production_integration_status": "independent-module-not-publicly-admitted",
  "source_refs": [
    "mobile-caoang",
    "bwiki-caoang",
    "bwiki-kangkai",
    "4399-caoang"
  ],
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-83.html",
    "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%98%82",
    "https://wiki.biligame.com/msgs/%E6%85%B7%E5%BF%BE",
    "https://a.4399.cn/gl/33530415_83975.html"
  ],
  "source_records": [
    {
      "id": "mobile-caoang",
      "url": "https://www.sanguosha.cn/pc/hero-detail-83.html",
      "final_url": "https://www.sanguosha.cn/pc/hero-detail-83.html",
      "status": 200,
      "bytes": 21052,
      "sha256": "c71fe91738c8e247a1efa9f0306fbdd120c2069f4a1934db48a3dfb79ef7e2d4",
      "read_at_utc": "2026-10-16T04:01:59.115357+00:00",
      "raw_file": "evidence/mobile-caoang.html",
      "source_type": "official_mobile_primary",
      "current_client_certification": false,
      "publication_date": null,
      "page_revision_id": null,
      "displayed_last_modified": null
    },
    {
      "id": "bwiki-caoang",
      "url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%98%82",
      "final_url": "https://wiki.biligame.com/msgs/%E6%9B%B9%E6%98%82",
      "status": 200,
      "bytes": 85874,
      "sha256": "0321174205a7935811bf2be419a5a6028080ebbf24dcfa418a2c87dafd8a7b02",
      "read_at_utc": "2026-10-16T04:01:59.281844+00:00",
      "raw_file": "evidence/bwiki-caoang.html",
      "source_type": "same_product_mobile_community",
      "current_client_certification": false,
      "publication_date": null,
      "page_revision_id": "38931",
      "displayed_last_modified": "此页面最后编辑于2026年6月11日 (星期四) 11:44。"
    },
    {
      "id": "bwiki-kangkai",
      "url": "https://wiki.biligame.com/msgs/%E6%85%B7%E5%BF%BE",
      "final_url": "https://wiki.biligame.com/msgs/%E6%85%B7%E5%BF%BE",
      "status": 200,
      "bytes": 71139,
      "sha256": "868d661827e0b02d9d4e9013bf4c159cc9a1b72755626e4861d2c41644b0981f",
      "read_at_utc": "2026-10-16T04:02:03.959381+00:00",
      "raw_file": "evidence/bwiki-kangkai.html",
      "source_type": "same_product_mobile_community",
      "current_client_certification": false,
      "publication_date": null,
      "page_revision_id": "38859",
      "displayed_last_modified": "此页面最后编辑于2026年6月7日 (星期日) 11:28。"
    },
    {
      "id": "4399-caoang",
      "url": "https://a.4399.cn/gl/33530415_83975.html",
      "final_url": "https://a.4399.cn/gl/33530415_83975.html",
      "status": 200,
      "bytes": 61659,
      "sha256": "305fd333ff6d0ab19987e9995442477ce64e23d1d084c4c76a3a3df9f82d81dc",
      "read_at_utc": "2026-10-16T04:03:56.432226+00:00",
      "raw_file": "evidence/4399-caoang.html",
      "source_type": "same_mobile_channel_community_guide_not_official_ruling",
      "publication_date": "2022-07-22 14:17 Asia/Shanghai",
      "current_client_certification": false,
      "embedded_body_file": "evidence/4399-caoang-threadData.json",
      "product_proof": "Page game_id83975; recommended games separately list OL id105522 and 一将成名 id127670; article addresses mobile 斗地主 and current guide metadata.",
      "supports": [
        "self cannot immediately equip from own trigger",
        "transfer includes equipment; Cao Ang/Yang Biao pass SilverLion back and forth",
        "other recipient may use gifted equipment out of turn",
        "distance uses owner direction and recipient +1 mount may prevent eligibility"
      ]
    }
  ],
  "skills": [
    {
      "id": "sgs.kangkai",
      "name": "慷忾",
      "type": "optional_trigger",
      "trigger": {
        "event": "a_living_actor_becomes_a_Slash_target_after_target_confirmation",
        "observer": "all living owners of effective 慷忾, not only card user or defender",
        "one_opportunity_key": [
          "owner_actor_id",
          "card_use_id",
          "target_occurrence_id"
        ],
        "condition": "Directed current distance from owner to target <=1; self distance0 qualifies; actual Slash identity including converted/virtual Slash, no Duel/AOE/HP loss."
      },
      "cost": null,
      "quota": {
        "per_turn": null,
        "per_phase": null,
        "per_target_occurrence": 1,
        "is_optional": true
      },
      "steps": [
        {
          "n": 1,
          "action": "Owner decides whether to invoke. Decline ends this occurrence with no card movement."
        },
        {
          "n": 2,
          "action": "Invoking owner draws exactly1 through normal draw machinery, before selecting the gift."
        },
        {
          "n": 3,
          "action": "If target is owner, stop after draw. No give-to-self, no reveal requirement, no immediate self equipment use. Explicit mobile FAQ closes this case."
        },
        {
          "n": 4,
          "action": "For another target, owner chooses exactly1 currently owned hand/equipment card, transfers it to target hand, then reveals the transferred physical card. Newly drawn card is eligible; not limited to it. Judgment/special piles are excluded from ordinary owned-card choice."
        },
        {
          "n": 5,
          "action": "If the successfully transferred/revealed card is an equipment card and still legally usable by recipient, recipient may immediately use that same physical card as equipment. Recipient, not donor, chooses; declining keeps it in hand. This is a real equipment-use event, replacement and enter/leave triggers apply."
        },
        {
          "n": 6,
          "action": "Return to the pending Slash response/effect. Newly equipped armor can affect that pending Slash under ordinary equipment rules; no extra draw/use/gift on duplicate delivery."
        }
      ],
      "distance": {
        "direction": "owner_to_target",
        "self": 0,
        "threshold": 1,
        "includes": "seat distance and all applicable directed skill/mount modifiers",
        "sampling": "at each target occurrence immediately before offering; a previous equipment gift can change eligibility for later targets; do not snapshot one boolean for entire multi-target Slash",
        "not_attack_range": true
      },
      "zones": {
        "gift_from": [
          "hand",
          "equipment"
        ],
        "gift_to": "recipient_hand",
        "not_allowed": [
          "judgment",
          "special_pile",
          "processing",
          "discard"
        ],
        "gift_is_not_discard": true,
        "reveal_scope": "only actually transferred card, publicly"
      },
      "response_and_history": {
        "draw_and_give": "skill effects, not a Slash response",
        "equipment_use": "ordinary equipment use enabled in this timing window, not merely assignment into slot",
        "sha_quota": "does not add, refund or consume a Slash use allowance",
        "stale_material": "revalidate exact physical card/location/ownership; never substitute arbitrary card silently"
      },
      "native_rules_evidence": {
        "base_timing_draw_give_reveal_equipment": "mobile-caoang full panel + bwiki-kangkai",
        "self_draw_without_self_gift_or_equip": "bwiki-caoang rules FAQ",
        "equipment_zone_and_nonself_immediate_use": "4399-caoang embedded threadData content plus ordinary owned-card meaning; see paired example of transferring equipped Silver Lion and target out-of-turn equipment. Same-mobile community corroboration, not official ruling."
      },
      "notes": [
        "Not locked, not limited, not lord skill. No added allies-only condition.",
        "HP loss and damage are not activation events. Can trigger even if resulting Slash is dodged or prevented.",
        "Once invoked, gift is subsequent required step where possible, not a second optional independent activation."
      ]
    }
  ],
  "source_skill_rules": [
    {
      "id": "sgs.kangkai",
      "name": "慷忾",
      "type": "optional_trigger",
      "trigger": {
        "event": "a_living_actor_becomes_a_Slash_target_after_target_confirmation",
        "observer": "all living owners of effective 慷忾, not only card user or defender",
        "one_opportunity_key": [
          "owner_actor_id",
          "card_use_id",
          "target_occurrence_id"
        ],
        "condition": "Directed current distance from owner to target <=1; self distance0 qualifies; actual Slash identity including converted/virtual Slash, no Duel/AOE/HP loss."
      },
      "cost": null,
      "quota": {
        "per_turn": null,
        "per_phase": null,
        "per_target_occurrence": 1,
        "is_optional": true
      },
      "steps": [
        {
          "n": 1,
          "action": "Owner decides whether to invoke. Decline ends this occurrence with no card movement."
        },
        {
          "n": 2,
          "action": "Invoking owner draws exactly1 through normal draw machinery, before selecting the gift."
        },
        {
          "n": 3,
          "action": "If target is owner, stop after draw. No give-to-self, no reveal requirement, no immediate self equipment use. Explicit mobile FAQ closes this case."
        },
        {
          "n": 4,
          "action": "For another target, owner chooses exactly1 currently owned hand/equipment card, transfers it to target hand, then reveals the transferred physical card. Newly drawn card is eligible; not limited to it. Judgment/special piles are excluded from ordinary owned-card choice."
        },
        {
          "n": 5,
          "action": "If the successfully transferred/revealed card is an equipment card and still legally usable by recipient, recipient may immediately use that same physical card as equipment. Recipient, not donor, chooses; declining keeps it in hand. This is a real equipment-use event, replacement and enter/leave triggers apply."
        },
        {
          "n": 6,
          "action": "Return to the pending Slash response/effect. Newly equipped armor can affect that pending Slash under ordinary equipment rules; no extra draw/use/gift on duplicate delivery."
        }
      ],
      "distance": {
        "direction": "owner_to_target",
        "self": 0,
        "threshold": 1,
        "includes": "seat distance and all applicable directed skill/mount modifiers",
        "sampling": "at each target occurrence immediately before offering; a previous equipment gift can change eligibility for later targets; do not snapshot one boolean for entire multi-target Slash",
        "not_attack_range": true
      },
      "zones": {
        "gift_from": [
          "hand",
          "equipment"
        ],
        "gift_to": "recipient_hand",
        "not_allowed": [
          "judgment",
          "special_pile",
          "processing",
          "discard"
        ],
        "gift_is_not_discard": true,
        "reveal_scope": "only actually transferred card, publicly"
      },
      "response_and_history": {
        "draw_and_give": "skill effects, not a Slash response",
        "equipment_use": "ordinary equipment use enabled in this timing window, not merely assignment into slot",
        "sha_quota": "does not add, refund or consume a Slash use allowance",
        "stale_material": "revalidate exact physical card/location/ownership; never substitute arbitrary card silently"
      },
      "native_rules_evidence": {
        "base_timing_draw_give_reveal_equipment": "mobile-caoang full panel + bwiki-kangkai",
        "self_draw_without_self_gift_or_equip": "bwiki-caoang rules FAQ",
        "equipment_zone_and_nonself_immediate_use": "4399-caoang embedded threadData content plus ordinary owned-card meaning; see paired example of transferring equipped Silver Lion and target out-of-turn equipment. Same-mobile community corroboration, not official ruling."
      },
      "notes": [
        "Not locked, not limited, not lord skill. No added allies-only condition.",
        "HP loss and damage are not activation events. Can trigger even if resulting Slash is dodged or prevented.",
        "Once invoked, gift is subsequent required step where possible, not a second optional independent activation."
      ]
    }
  ],
  "metadata_evidence": {
    "hp": "bwiki-caoang classic block has four 魏勾玉 image nodes plus hidden numeric4; no official mobile HP field",
    "gender": "bwiki-caoang explicit 性别男",
    "faction": "official83魏 + bwiki-caoang魏",
    "initial_hp": "No independently verified client initial-HP field; full intrinsic maximum at host setup is H0."
  },
  "host_policy_refs": [
    "H0",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "H7",
    "H8",
    "H9"
  ],
  "host_compatibility_policies": [
    {
      "id": "H0",
      "kind": "cross_game_host_compatibility",
      "rule": "Initialize at4 intrinsic maxHP; identity-mode lord bonus remains mode rule, not intrinsic HP."
    },
    {
      "id": "H1",
      "kind": "cross_game_host_compatibility",
      "rule": "Effective-skill ownership and suppression are checked before the prompt and before committing invocation; actor-local receipts survive save/load and copy/regrant cannot replay an old occurrence."
    },
    {
      "id": "H2",
      "kind": "cross_game_host_compatibility",
      "rule": "Use host chronological confirmed-target occurrence and action order. Existing before_sha_target_response routes only the defender and supports redirects; existing on_sha_targets_designated routes only the attacker. Neither alone observes a third-party Cao Ang. Add a global observer at the real confirmed-target window before equipment/armor response."
    },
    {
      "id": "H3",
      "kind": "cross_game_host_compatibility",
      "rule": "Expose exact card-use and target-occurrence IDs with source/target identity; per-actor receipt tracks offered/declined/invoked/drawn/given/revealed/equip-offered/equip-used/done. Once committed, replay never repeats a draw or move."
    },
    {
      "id": "H4",
      "kind": "cross_game_host_compatibility",
      "rule": "Cross-game guard/redirect ordering and simultaneous owner ordering are host policies, not proof of current mobile client parity. Final surviving targets get the host confirmed-target event; cancelled targets do not. Record this adaptation separately."
    },
    {
      "id": "H5",
      "kind": "cross_game_host_compatibility",
      "rule": "Draw exhaustion uses normal reshuffle, never manufacture cards. If no drawable card, continue legal existing-card gift. If no own hand/equipment remains, stop gift/equip without manufacturing a card."
    },
    {
      "id": "H6",
      "kind": "cross_game_host_compatibility",
      "rule": "After each await or movement callback, revalidate alive ongoing match, recipient and exact material. An already committed gift must not be undone or repeated because an equip prompt fails. End match stops future work; log interruption explicitly."
    },
    {
      "id": "H7",
      "kind": "cross_game_host_compatibility",
      "rule": "Use real transfer and equipment-use paths for equipment loss/recovery/history. No direct raw array splice that omits shared events; no game source changes in this packet."
    },
    {
      "id": "H8",
      "kind": "cross_game_host_compatibility",
      "rule": "Hidden hands remain private except the selected public gift. AI may inspect own legal options and public state, never target hidden hand faces."
    },
    {
      "id": "H9",
      "kind": "cross_game_host_compatibility",
      "rule": "Cross-game skill copying carries full 慷忾 mechanism and no donor receipts or initial HP; permanent skill-removal/suppression stops new activation, not retroactively reverting completed moves."
    }
  ],
  "official_hidden_tab_audit": [
    {
      "group_index": 0,
      "mode": "身份",
      "group_class": "skill ",
      "skill_names": [
        "慷忾"
      ],
      "definition_count": 1,
      "panels": [
        {
          "index": 0,
          "class": "",
          "text_sha256": "8515855c879e5634c509f9e29b55b1ac8c913869b26b241769d4fff738fd6a13",
          "definition": "慷忾[kài],当一名角色成为【杀】的目标后，若你与其距离1以内，则你可以摸一张牌，然后交给其一张牌并展示之。若此牌为装备牌，该角色可以使用此牌。"
        }
      ],
      "all_hidden_panels_read": true
    }
  ],
  "aliases": [
    "三国杀曹昂",
    "cao-ang",
    "caoang",
    "慷忾"
  ],
  "source_id_aliases": [],
  "excluded_variants": [
    "Do not import 界, 神, OL, 一将成名 or any identically named other-product version."
  ],
  "source_unknowns": [
    "Current mobile client rules and HP were not independently certified.",
    "H0–H9 define host lifecycle, ordering and replay; these are not native current-client evidence."
  ],
  "complete_mechanism_signature": {
    "id": "sgs.adapted.base.hero.cao-ang",
    "max_hp": 4,
    "gender": "male",
    "source_faction": "魏",
    "variant": "mobile-classic-identity-official83-community-classic-selected-2026-10-15-read-2026-10-16",
    "intrinsic_skill_inventory": [
      "慷忾"
    ],
    "personal_lord_skills": [],
    "granted_skill_inventory": [],
    "acquired_skill_inventory": [],
    "derived_card_inventory": [],
    "skills": [
      {
        "id": "sgs.kangkai",
        "name": "慷忾",
        "type": "optional_trigger",
        "trigger": {
          "event": "a_living_actor_becomes_a_Slash_target_after_target_confirmation",
          "observer": "all living owners of effective 慷忾, not only card user or defender",
          "one_opportunity_key": [
            "owner_actor_id",
            "card_use_id",
            "target_occurrence_id"
          ],
          "condition": "Directed current distance from owner to target <=1; self distance0 qualifies; actual Slash identity including converted/virtual Slash, no Duel/AOE/HP loss."
        },
        "cost": null,
        "quota": {
          "per_turn": null,
          "per_phase": null,
          "per_target_occurrence": 1,
          "is_optional": true
        },
        "steps": [
          {
            "n": 1,
            "action": "Owner decides whether to invoke. Decline ends this occurrence with no card movement."
          },
          {
            "n": 2,
            "action": "Invoking owner draws exactly1 through normal draw machinery, before selecting the gift."
          },
          {
            "n": 3,
            "action": "If target is owner, stop after draw. No give-to-self, no reveal requirement, no immediate self equipment use. Explicit mobile FAQ closes this case."
          },
          {
            "n": 4,
            "action": "For another target, owner chooses exactly1 currently owned hand/equipment card, transfers it to target hand, then reveals the transferred physical card. Newly drawn card is eligible; not limited to it. Judgment/special piles are excluded from ordinary owned-card choice."
          },
          {
            "n": 5,
            "action": "If the successfully transferred/revealed card is an equipment card and still legally usable by recipient, recipient may immediately use that same physical card as equipment. Recipient, not donor, chooses; declining keeps it in hand. This is a real equipment-use event, replacement and enter/leave triggers apply."
          },
          {
            "n": 6,
            "action": "Return to the pending Slash response/effect. Newly equipped armor can affect that pending Slash under ordinary equipment rules; no extra draw/use/gift on duplicate delivery."
          }
        ],
        "distance": {
          "direction": "owner_to_target",
          "self": 0,
          "threshold": 1,
          "includes": "seat distance and all applicable directed skill/mount modifiers",
          "sampling": "at each target occurrence immediately before offering; a previous equipment gift can change eligibility for later targets; do not snapshot one boolean for entire multi-target Slash",
          "not_attack_range": true
        },
        "zones": {
          "gift_from": [
            "hand",
            "equipment"
          ],
          "gift_to": "recipient_hand",
          "not_allowed": [
            "judgment",
            "special_pile",
            "processing",
            "discard"
          ],
          "gift_is_not_discard": true,
          "reveal_scope": "only actually transferred card, publicly"
        },
        "response_and_history": {
          "draw_and_give": "skill effects, not a Slash response",
          "equipment_use": "ordinary equipment use enabled in this timing window, not merely assignment into slot",
          "sha_quota": "does not add, refund or consume a Slash use allowance",
          "stale_material": "revalidate exact physical card/location/ownership; never substitute arbitrary card silently"
        },
        "native_rules_evidence": {
          "base_timing_draw_give_reveal_equipment": "mobile-caoang full panel + bwiki-kangkai",
          "self_draw_without_self_gift_or_equip": "bwiki-caoang rules FAQ",
          "equipment_zone_and_nonself_immediate_use": "4399-caoang embedded threadData content plus ordinary owned-card meaning; see paired example of transferring equipped Silver Lion and target out-of-turn equipment. Same-mobile community corroboration, not official ruling."
        },
        "notes": [
          "Not locked, not limited, not lord skill. No added allies-only condition.",
          "HP loss and damage are not activation events. Can trigger even if resulting Slash is dodged or prevented.",
          "Once invoked, gift is subsequent required step where possible, not a second optional independent activation."
        ]
      }
    ],
    "host_policy_refs": [
      "H0",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "H7",
      "H8",
      "H9"
    ],
    "intrinsic_unresolved": []
  },
  "complete_mechanism_signature_sha256": "b5f24db3c240388061a05962f3875e593eb2640cc3b09fd5f396c400d9f9aeac"
});
export const SGS_CAOANG_DEFINITIONS=freeze([SGS_CAOANG_DEFINITION]);
