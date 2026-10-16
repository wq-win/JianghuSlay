/** Complete selected Mobile identity source. Technical module admission only; release coverage remains gated. */
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const SGS_LINGCAO_HERO_ID="sgs.adapted.base.hero.ling-cao";
export const SGS_LINGCAO_SKILL_IDS=freeze({"dujin": "sgs.dujin"});
export const SGS_LINGCAO_DEFINITION=freeze({
  "key": "lingcao",
  "id": "sgs.adapted.base.hero.ling-cao",
  "source_name": "凌操",
  "display_name_proposal": "凌操",
  "product": "三国杀移动版",
  "mode": "身份",
  "variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "official_page_id": 59,
  "catalog_record_id": "sgs-mobile:hero-page:59",
  "max_hp": 4,
  "starting_hp": 4,
  "starting_hp_direct_source_value": null,
  "starting_hp_basis": "FH0 explicit host initialization",
  "gender": "male",
  "source_faction": "吴",
  "faction": "吴",
  "intrinsic_skill_inventory": [
    "独进"
  ],
  "skill_ids": [
    "sgs.dujin"
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
      "skill_id": "sgs.dujin",
      "name": "独进",
      "kind": "optional_normal_draw_count_modifier",
      "timing": "Own genuinely entered normal draw phase, while its ordinary draw count is determined",
      "quota": "One optional resolution per actual normal draw event; no separate per-turn or whole-game cap",
      "cost": "No card/HP cost",
      "targets": "Self only",
      "effects": [
        "Choose whether to add floor(E/2)+1 to the ordinary draw count, E being number of physical cards currently in owner equipment area.",
        "E=0/1 => +1; E=2/3 => +2; E=4/5 => +3. No minimum equipment requirement and no intrinsic maximum bonus or five-equipment cap.",
        "Take the increased normal draw together through the ordinary draw pipeline; this is not an independent off-phase draw or replacement.",
        "Count equipped entities, not hand-held equipment, slot capacity, disabled slots, judgment/special piles or stored cards beneath an equipment.",
        "If the skill is declined, preserve ordinary draw unchanged. A phase skip or complete draw replacement gives no Dujin activation.",
        "Read equipment count when resolving this count modifier, not at game start or turn start; equipment moved before this resolution changes E."
      ],
      "derived_interpretations": [
        "The formula and optionality are literal official source. Equipment effects being disabled do not remove an entity from its area: card-area semantics plus FH1.",
        "Phase/event uniqueness and modifier/whole-draw replacement interaction are explicit host FH2/FH4."
      ],
      "source_refs": [
        "official-lingcao",
        "bwiki-lingcao"
      ],
      "original_evidence": {
        "source_id": "official-lingcao",
        "html_path": "evidence/official-lingcao.html",
        "html_line": 177,
        "original_text": "摸牌阶段，你可以多摸X+1张牌（X为你装备区里牌数的一半且向下取整）。",
        "text_sha256": "3acbd12dc288a233dcdaf893080b38d560085d99a1bf8775640acfcc79e852f7",
        "hidden_panel": false
      }
    }
  ],
  "source_refs": [
    "official-lingcao",
    "bwiki-lingcao"
  ],
  "version_and_scope_notes": [
    "Official identity and classic Wiki select floor. Wiki unknown historical version and explicitly OL guides use ceil; those are excluded entirely.",
    "Single skill; no hidden grant/awakening/lord skill. Max HP4 from four classic jade icons plus explicit hidden numeric4, male field explicit."
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
  "name": "凌操",
  "display_name": "凌操",
  "skill_name": "独进",
  "skill_desc": "独进：摸牌阶段，你可以多摸X+1张牌（X为你装备区里牌数的一半且向下取整）。",
  "source_game": "三国杀",
  "source_label": "三国杀",
  "source_product": "sanguosha_mobile_cn",
  "source_character_name": "凌操",
  "source_status": "verified",
  "runtime_validation_status": "module-tests-awaiting-release-admission",
  "source_coverage": false,
  "source_inventory_ready": true,
  "current_client_verified": false,
  "source_variant": "mobile-classic-identity-official-catalog-selected-2026-10-15-live-read-2026-10-16",
  "source_version": "移动版身份目录选择2026-10-15；2026-10-16实读；未核验当前客户端",
  "source_urls": [
    "https://www.sanguosha.cn/pc/hero-detail-59.html",
    "https://wiki.biligame.com/msgs/%E5%87%8C%E6%93%8D"
  ],
  "source_identity_context": {
    "product": "三国杀移动版",
    "mode": "身份",
    "selection_date": "2026-10-15",
    "read_date": "2026-10-16"
  },
  "complete_skill_ids": [
    "sgs.dujin"
  ],
  "aliases": [
    "凌操",
    "独进"
  ],
  "source_skill_rules": [
    {
      "skill_id": "sgs.dujin",
      "name": "独进",
      "kind": "optional_normal_draw_count_modifier",
      "timing": "Own genuinely entered normal draw phase, while its ordinary draw count is determined",
      "quota": "One optional resolution per actual normal draw event; no separate per-turn or whole-game cap",
      "cost": "No card/HP cost",
      "targets": "Self only",
      "effects": [
        "Choose whether to add floor(E/2)+1 to the ordinary draw count, E being number of physical cards currently in owner equipment area.",
        "E=0/1 => +1; E=2/3 => +2; E=4/5 => +3. No minimum equipment requirement and no intrinsic maximum bonus or five-equipment cap.",
        "Take the increased normal draw together through the ordinary draw pipeline; this is not an independent off-phase draw or replacement.",
        "Count equipped entities, not hand-held equipment, slot capacity, disabled slots, judgment/special piles or stored cards beneath an equipment.",
        "If the skill is declined, preserve ordinary draw unchanged. A phase skip or complete draw replacement gives no Dujin activation.",
        "Read equipment count when resolving this count modifier, not at game start or turn start; equipment moved before this resolution changes E."
      ],
      "derived_interpretations": [
        "The formula and optionality are literal official source. Equipment effects being disabled do not remove an entity from its area: card-area semantics plus FH1.",
        "Phase/event uniqueness and modifier/whole-draw replacement interaction are explicit host FH2/FH4."
      ],
      "source_refs": [
        "official-lingcao",
        "bwiki-lingcao"
      ],
      "original_evidence": {
        "source_id": "official-lingcao",
        "html_path": "evidence/official-lingcao.html",
        "html_line": 177,
        "original_text": "摸牌阶段，你可以多摸X+1张牌（X为你装备区里牌数的一半且向下取整）。",
        "text_sha256": "3acbd12dc288a233dcdaf893080b38d560085d99a1bf8775640acfcc79e852f7",
        "hidden_panel": false
      }
    }
  ],
  "adaptation_notes": "FH0–FH10跨作宿主兼容：初始满体力；真实阶段事件及稳定回执；无当前客户端或历史网页快照认证。本宿主当前只有四个装备栏，独进公式不硬设上限。"
});
export const SGS_LINGCAO_DEFINITIONS=Object.freeze([SGS_LINGCAO_DEFINITION]);
export const SGS_LINGCAO_HOST_POLICIES=freeze([
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
