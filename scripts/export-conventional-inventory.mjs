/** Reproducible V37 conventional inventory. No V36 export or external snapshot is read. */
import assert from 'node:assert/strict';
import {readFile, writeFile, mkdir, rename, rm} from 'node:fs/promises';
import {basename, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as models from '../web/local/models.js';
import {skillsForHero, SKILL_TYPES} from '../web/public/skill-catalog.js';
import {EQUIPMENT_CATALOG, EQUIPMENT_SOURCE_RECORDS, EQUIPMENT_CANONICAL_MAPPING} from '../web/local/equipment-catalog.mjs';
import {TRICK_CATALOG} from '../web/local/trick-catalog.js';
import {CONTENT_PACKS} from '../web/local/content-packs.js';
import {RELEASE_SCOPE, EXCLUDED_SPECIAL_HERO_IDS, CONVENTIONAL_GENERATED_CARD_NAMES} from '../web/local/release-scope.js';
import {ENGINE_VERSION, CONTENT_VERSION} from '../web/local/session.js';
// These retained catalogs are read ONLY to describe excluded local archives, except
// the two ordinary global tricks explicitly retained by release-scope.js.
import {MODE_EQUIPMENT_CATALOG, ZHUQUE_EQUIPMENT_PACK_ID} from '../web/local/mode-equipment-catalog.mjs';
import {YOUJIAN_EQUIPMENT_CATALOG, YOUJIAN_EQUIPMENT_PACK_ID} from '../web/local/youjian-equipment-catalog.mjs';
import {SANJIAN_EQUIPMENT_CATALOG, SANJIAN_PACK_ID} from '../web/local/sanjian-catalog.mjs';
import {YOUJIAN_STAB_CATALOG} from '../web/local/youjian-stab.js';
import {YOUJIAN_TRICK_CATALOG} from '../web/local/youjian-trick-effects.js';
import {DERIVED_EQUIPMENT_CATALOG} from '../web/local/derived-equipment.mjs';
import {ZHANGFEN_EQUIPMENT_CATALOG} from '../web/local/sgs-zhangfen-data.js';
import {QIBAO_RULES, WANGYUN_TRICK_CATALOG} from '../web/local/wangyun-card-effects.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] ?? resolve(root, '..', 'jianghu-conventional-v37-inventory.json'));
// An explicit allowlist is safer than trying to enumerate every frozen release.
// A caller may select a directory, but cannot repurpose this exporter to write
// a historical inventory name. Re-exporting this one V37 artifact is supported.
assert.equal(basename(output), 'jianghu-conventional-v37-inventory.json',
  'Only jianghu-conventional-v37-inventory.json may be written; historical inventories must remain unchanged.');
const readJSON = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const requested = await readJSON('docs/equipment/source-requested-ten.json');
const {HEROES, Deck, SeededRNG, HERO_SOURCE_MERGES, HERO_ORIGINAL_MERGES, canonical_hero_for_source, hero_source_context} = models;
const liveById = new Map(HEROES.map(hero => [hero.id, hero]));
const sourceGame = hero => hero.id.startsWith('yxs.') ? '英雄杀' : hero.id.startsWith('sgs.') ? '三国杀' : '江湖原创';
const sourceCovered = hero => hero.source_status !== 'original' && hero.source_coverage !== false;
const sortById = (a,b) => a.id.localeCompare(b.id);
const sum = (rows, key = 'copies') => rows.reduce((n,row) => n + row[key], 0);
const skillCards = hero => skillsForHero(hero).map(skill => ({...skill,
  type_label: SKILL_TYPES[skill.type]?.label ?? skill.type,
  type_hint: SKILL_TYPES[skill.type]?.hint ?? null,
}));
const heroes = HEROES.map(hero => ({...hero, internal_rule_name: hero.name,
  name: hero.display_name ?? hero.name, source_game: sourceGame(hero),
  source_coverage: sourceCovered(hero), selectable: true, effects: skillCards(hero),
}));
// Discover all exported source arrays, then retain only identities whose canonical
// representative really exists. The retired source definitions are never aliases.
const sourceById = new Map(Object.entries(models)
  .filter(([name,value]) => name !== 'HEROES' && name.endsWith('_HEROES') && Array.isArray(value))
  .flatMap(([,value]) => value).filter(hero => hero.source_status !== 'original')
  .map(hero => [hero.id, hero]));
const heroAliases = [...sourceById.values()].filter(source => {
  const canonical = canonical_hero_for_source(source.id);
  return !EXCLUDED_SPECIAL_HERO_IDS.includes(source.id) && canonical && liveById.has(canonical.id);
}).map(source => {
  const canonical = canonical_hero_for_source(source.id);
  const context = hero_source_context(canonical, source.id);
  assert.ok(context, `Missing separate source identity context: ${source.id}`);
  return {source_id: source.id, source_name: source.source_character_name ?? source.name,
    source_game: sourceGame(source), source_variant: source.source_variant ?? source.variant ?? null,
    source_urls: source.source_urls ?? [], source_context: context,
    canonical_id: canonical.id, canonical_name: canonical.display_name ?? canonical.name,
    independent_selectable: source.id === canonical.id,
    source_coverage: sourceCovered(canonical) && source.source_coverage !== false,
    implementation_status: source.implementation_status ?? null,
    runtime_validation_status: source.runtime_validation_status ?? null,
    current_client_verified: source.current_client_verified === true,
  };
}).sort((a,b) => a.source_id.localeCompare(b.source_id));
const heroMerges = HERO_SOURCE_MERGES.filter(row => heroAliases.some(alias => alias.source_id === row.source_id))
  .map(row => ({...row, source_context: hero_source_context(liveById.get(row.canonical_id), row.source_id),
    source_effects: skillCards(sourceById.get(row.source_id)), separate_selectable_entity: false}));

const equipmentById = new Map(EQUIPMENT_CATALOG.map(record => [record.id, record]));
const trickByName = new Map(TRICK_CATALOG.map(record => [record.name, record]));
const physical = new Deck(new SeededRNG(42), null, {content_packs: []}).draw_pile;
const cardGroups = new Map();
for (const card of physical) {
  const key = card.equipment_id ?? `${card.type}:${card.name}`;
  if (cardGroups.has(key)) { cardGroups.get(key).copies++; continue; }
  const equipment = equipmentById.get(card.equipment_id);
  const spec = requested.records.find(record => record.name === card.name || equipment?.aliases?.includes(record.name));
  const catalog = equipment ?? trickByName.get(card.name);
  cardGroups.set(key, {
    inventory_id: key, name: card.name, base_name: card.base_name ?? card.name, type: card.type,
    copies: 1, initial_deck_copies: 1, equipment_id: card.equipment_id ?? null,
    description: card.description, range: card.range, trait: card.trait,
    status: 'playable-conventional-default', ordinary_deck: true, content_pack: null,
    rules: {
      condition: equipment?.condition ?? spec?.condition ?? null,
      timing: equipment?.timing ?? catalog?.rule_timing ?? spec?.timing ?? null,
      effect: card.description,
      limits: equipment?.limits ?? catalog?.rule_limits ?? spec?.limits ?? null,
      ...(equipment?.mechanism_signature ? {mechanism_signature: equipment.mechanism_signature} : {}),
      ...(spec?.runnable_steps ? {runnable_steps: spec.runnable_steps} : {}),
    },
    source_game: catalog?.source_game ?? spec?.source_game ?? null,
    source_version: catalog?.source_version ?? catalog?.source_variant ?? spec?.target_version ?? null,
    source_urls: catalog?.source_urls ?? spec?.source_urls ?? [],
    aliases: equipment?.aliases ?? [], source_aliases: equipment?.source_aliases ?? [],
    source_records: equipment?.source_records ?? [],
    source_metadata_status: catalog || spec ? 'source-backed-with-declared-adaptations' : 'runtime-rule-exported-source-identity-not-independently-certified',
    adaptation_notes: catalog?.adaptation_notes ?? (spec?.version_notes ?? []).join(' '),
    rules_source: equipment ? 'web/local/equipment-catalog.mjs' : 'web/local/models.js',
  });
}
const cards = [...cardGroups.values()].map(card => ({...card, initial_deck_copies: card.copies}))
  .sort((a,b) => a.inventory_id.localeCompare(b.inventory_id));
const equipment = EQUIPMENT_CATALOG.filter(record => cards.some(card => card.equipment_id === record.id))
  .map(record => ({...record, copies: cards.find(card => card.equipment_id === record.id).copies,
    status: 'playable-conventional-default', initial_deck_copies: cards.find(card => card.equipment_id === record.id).copies}));
const ordinaryFunctions = WANGYUN_TRICK_CATALOG.filter(record => CONVENTIONAL_GENERATED_CARD_NAMES.includes(record.name))
  .map(record => ({...record, status: 'implemented-conventional-function-zero-initial-copies',
    belongs_to_conventional_scope: true, ordinary_deck: false, initial_deck_copies: 0,
    requires_retired_hero: false, dependency_module_is_historical_filename_only: true,
    availability_note: '保留普通锦囊结算函数；当前初始牌堆为0张，不把已退出的王允专属获得途径算作可用入口。'}));
const requiredTen = requested.records.map(record => {
  const card = cards.find(row => row.name === record.name || row.aliases.includes(record.name));
  assert.ok(card, `Required conventional card/equipment is absent: ${record.name}`);
  return {requested_name: record.name, canonical_name: card.name, inventory_id: card.inventory_id,
    copies: card.copies, satisfied_by_source_alias: card.name !== record.name,
    condition: record.condition, timing: record.timing, effect: record.effect, limits: record.limits,
    source_urls: record.source_urls, evidence: 'docs/equipment/source-requested-ten.json'};
});

const archivedCard = (record,copies,pack) => ({id: record.id ?? `${record.type}:${record.name}`, name: record.name,
  copies_before_retirement: copies, content_pack: pack, status: 'local-archive-excluded', included_in_unfinished_goals: false});
const retiredPacks = [
  {id: ZHUQUE_EQUIPMENT_PACK_ID, name: '朱雀装备兼容包', cards: MODE_EQUIPMENT_CATALOG.map(record => archivedCard(record,1,ZHUQUE_EQUIPMENT_PACK_ID))},
  {id: YOUJIAN_EQUIPMENT_PACK_ID, name: '用间兼容包', cards: [
    ...YOUJIAN_EQUIPMENT_CATALOG.map(record => archivedCard(record,1,YOUJIAN_EQUIPMENT_PACK_ID)),
    archivedCard({id:'sgs.youjian.basic.poison',name:'毒'},4,YOUJIAN_EQUIPMENT_PACK_ID),
    ...[YOUJIAN_STAB_CATALOG,...YOUJIAN_TRICK_CATALOG].map(record => archivedCard(record,record.physical_faces.length,YOUJIAN_EQUIPMENT_PACK_ID)),
  ]},
  {id: SANJIAN_PACK_ID, name: '国战三尖兼容包', cards: SANJIAN_EQUIPMENT_CATALOG.map(record => archivedCard(record,1,SANJIAN_PACK_ID))},
].map(pack => ({...pack, enabled: false, status: 'local-archive-excluded', included_in_unfinished_goals: false,
  counts: {card_types: pack.cards.length, physical_cards: sum(pack.cards,'copies_before_retirement')}}));
const retiredDerived = [...DERIVED_EQUIPMENT_CATALOG,...ZHANGFEN_EQUIPMENT_CATALOG,QIBAO_RULES]
  .map(record => ({id:record.id,name:record.name,initial_deck_copies:0,status:'local-archive-excluded',included_in_unfinished_goals:false}));
const retiredOnlyTricks = WANGYUN_TRICK_CATALOG.filter(record => !CONVENTIONAL_GENERATED_CARD_NAMES.includes(record.name))
  .map(record => ({id:record.id,name:record.name,initial_deck_copies:0,status:'local-archive-excluded',included_in_unfinished_goals:false}));
const localArchive = {
  status: 'local-archive-excluded', counted_as_unfinished_scope: false,
  preservation: 'Historical source documents and implementation modules are retained locally; they are not selectable, initial-deck content, coverage credits or future completion goals for this release.',
  heroes: EXCLUDED_SPECIAL_HERO_IDS.map(id => ({id,name:sourceById.get(id)?.name ?? null,status:'local-archive-excluded',included_in_unfinished_goals:false})),
  packs: retiredPacks,
  removed_custom_basic_cards: ['血杀','毒杀'].map(name => ({name,copies_before_retirement:6,status:'local-archive-excluded',included_in_unfinished_goals:false,
    classification:'Legacy Jianghu custom basic variant; excluded from the narrowed conventional initial deck.',
    count_basis:'Frozen prior release recipe: six copies each; this is retirement history, not the current Deck count.'})),
  derived_equipment: retiredDerived, hero_only_tricks: retiredOnlyTricks,
  counts: {heroes:EXCLUDED_SPECIAL_HERO_IDS.length,optional_packs:retiredPacks.length,
    optional_pack_types:sum(retiredPacks.map(pack => pack.counts),'card_types'),
    optional_pack_physical_cards:sum(retiredPacks.map(pack => pack.counts),'physical_cards'),
    custom_basic_types:2,custom_basic_physical_cards:12,derived_equipment:retiredDerived.length,hero_only_tricks:retiredOnlyTricks.length},
};

// This is a bounded review of conventional content only. It deliberately does
// not transplant V36 future_targets or any mode/generated-equipment wish list.
const candidateFiles = [
  ['docs/sgs-identity-next/specs.json','heroes'],
  ['docs/sgs-yijiang/specs.json','quarantined_candidates'],
  ['docs/sgs-yijiang-following/specs.json','quarantined_candidates'],
  ['docs/sgs-yijiang-next/specs.json','quarantined_candidates'],
  ['docs/sgs-followup/specs.json','excluded_or_held'],
  ['docs/yxs-modern/sourcecopies/specs.json','held_candidates'],
];
const heldByName = new Map();
for (const [file,key] of candidateFiles) {
  for (const row of (await readJSON(file))[key] ?? []) {
    const name = row.source_name ?? row.name ?? row.hero;
    if (!name || EXCLUDED_SPECIAL_HERO_IDS.includes(row.id) || (row.id && canonical_hero_for_source(row.id)) ||
      heroes.some(hero => [hero.name,hero.source_character_name].includes(name))) continue;
    heldByName.set(name,{id:row.id ?? null,name,source_game:file.includes('/yxs-')?'英雄杀':'三国杀',
      status:'known-conventional-source-candidate-not-implemented',selectable:false,counted_as_source_coverage:false,
      blocker:row.blocker ?? row.blockers ?? row.unresolved ?? row.reason ?? row.intrinsic_unresolved ?? row.readiness ?? row.status ?? null,
      intrinsic_skills:row.intrinsic_skill_inventory ?? row.full_official_identity_inventory ?? row.full_published_skill_inventory ?? null,
      evidence:file});
  }
}
const gaps = [
  {id:'conventional.lightning-parity',name:'手捧雷来源规则差异',status:'implemented-host-adaptation-source-parity-incomplete',
    current_host_rule:'放到其他合法角色判定区；红桃传递、非红桃造成3点雷电伤害。',
    missing_function:'所选英雄杀来源为自己判定区起始且仅黑桃2至9命中；现有手捧雷不可标作该完整来源实体或直接并入闪电来源别名。',
    evidence:['docs/yxs-third/remaining-card-differences.json#cardgap.lightning-j','docs/yxs-third/remaining-card-differences.json#cardgap.lightning-t','web/local/game-tricks.js']},
];
const counts = {heroes:heroes.length,skill_effect_cards:sum(heroes.map(hero => ({n:hero.effects.length})),'n'),
  original_heroes:heroes.filter(hero => hero.source_status === 'original').length,
  source_hero_representatives:heroes.filter(hero => hero.source_coverage).length,
  source_identity_records:heroAliases.filter(row => row.source_coverage).length,
  card_types:cards.length,physical_cards:physical.length,equipment_rule_entities:equipment.length,
  conventional_card_functions_without_initial_copies:ordinaryFunctions.length,
  basic_copies:sum(cards.filter(card => card.type !== '锦囊' && !card.equipment_id)),
  trick_copies:sum(cards.filter(card => card.type === '锦囊')),
};
const inventory = {
  schema_version:'jianghu-conventional-inventory-v37',as_of:'2026-10-16',scope:RELEASE_SCOPE,
  scope_complete:false,publication:process.env.PUBLICATION_STATUS ?? 'local-validation-not-published',
  source_commit:process.env.SOURCE_COMMIT ?? null,engine_version:ENGINE_VERSION,content_version:CONTENT_VERSION,
  target_products:['英雄杀手游普通对战','三国杀移动版普通身份/标准军争共享规则'],
  counts,counts_scope:'Current selectable HEROES and actual default Deck only. Source aliases, zero-copy functions and local archive exclusions are separate; UI effect cards are not physical cards or a count of intrinsic skill names.',
  match_configuration:{supported_modes:['1v1','1v2'],content_packs:CONTENT_PACKS,two_ai_heroes_must_differ:true,player_may_match_one_ai:true},
  heroes,cards,equipment,conventional_functions_without_initial_copies:ordinaryFunctions,required_ten:requiredTen,
  hero_source_aliases:heroAliases,hero_source_merges:heroMerges,
  hero_original_merges:HERO_ORIGINAL_MERGES.filter(row => liveById.has(row.canonical_id)),
  equipment_source_records:EQUIPMENT_SOURCE_RECORDS.filter(row => equipment.some(e => e.id === row.id || e.source_records?.some(s => s.id === row.id))),
  equipment_canonical_mapping:EQUIPMENT_CANONICAL_MAPPING,
  source_coverage:{policy:'Source-backed implemented mechanisms and explicitly equivalent full source identities only; originals, retired content, held candidates and unverified alternative versions are not coverage. This is not current-client certification or a complete two-game percentage.',
    heroes:{playable_source_representatives:counts.source_hero_representatives,source_identity_records:counts.source_identity_records,
      source_identities_by_game:Object.fromEntries(['三国杀','英雄杀'].map(game => [game,heroAliases.filter(row => row.source_coverage && row.source_game === game).length])),
      merged_source_identities:heroMerges.length,original_excluded:counts.original_heroes,target_total:null,complete:false},
    cards:{default_types:cards.length,physical_cards:physical.length,zero_initial_copy_functions:ordinaryFunctions.length,target_total:null,complete:false},
    equipment:{default_mechanisms:equipment.length,source_records:EQUIPMENT_SOURCE_RECORDS.length,source_records_are_not_physical_copies:true,target_total:null,complete:false},
    current_client_verification:{complete:false,source_backed_mechanisms_are_not_current_client_certification:true,source_snapshot:'2026-10-15'},
  },
  conventional_scope_gaps:{complete:false,known_missing_or_non_equivalent_functions:gaps,
    excluded_previous_candidates:[{names:['鸩','合纵连横'],reason:'Official mobile announcement places both in the optional 朱雀 card pack, outside this conventional release.',source_url:'https://www.taptap.cn/moment/852313126639502699?group_id=1334'}],
    bounded_known_unimplemented_hero_candidates:[...heldByName.values()],
    candidate_evidence_boundary:candidateFiles.map(([file]) => file),
    unknown_catalog_boundary:{total:null,completeness_verified:false,
      reason:'No exhaustively verified, version-bounded current-mobile ordinary-hero and conventional-card catalog exists in the local evidence. The named gaps/candidates are a lower bound, not the remaining total.',
      excludes:['optional mode packs','mode-only rules and equipment','special generated equipment and dependent retired heroes','the removed custom blood/poison kill variants'],
      additional_unverified:['full ordinary roster/version eligibility','complete cross-game card identity/equivalence mapping','publisher physical quantities and suit/rank distributions'],
    },
  },
  local_archive_excluded:localArchive,
  limitations:[
    'Mixed-game quantities and seeded suit/rank assignment are Jianghu host rules, not either publisher’s certified physical deck.',
    'Source faction, gender, intrinsic skill labels and version evidence remain separate for merged identities; equivalent selectable mechanisms do not merge their identity systems.',
    '五谷丰登 and 桃园结义 have ordinary functions but zero initial copies; their implementation does not add two physical deck types.',
    'Basic/trick source aliases are not invented from similar names. Empty aliases mean no registered identity-equivalence mapping, not that no source counterpart exists.',
    'Retained historical rule text may mention archived cards. Such references do not register those cards or restore a retired hero/pack.',
    'Exact native identity-mode/lord/faction interactions are not certified by the browser 1v1/1v2 host; each hero retains its disclosed compatibility policies and source unknowns.',
  ],
};
assert.equal(new Set(heroes.map(hero => hero.id)).size,heroes.length,'Duplicate selectable hero IDs.');
assert.ok(heroes.every(hero => hero.effects.length && hero.effects.every(skill => skill.timing && skill.effect && skill.limit && skill.cost != null)), 'Every hero must export its full live UI rule cards.');
assert.ok(heroAliases.every(row => liveById.has(row.canonical_id) && !EXCLUDED_SPECIAL_HERO_IDS.includes(row.source_id)), 'Retired or dangling source alias.');
assert.equal(sum(cards),physical.length,'Physical deck and per-card counts disagree.');
assert.equal(models.JIANGHU_DECK_SIZE,physical.length,'Deck declaration and physical deck disagree.');
assert.ok(equipment.every(row => row.copies === 1 && row.ordinary_deck),'Ordinary equipment must occur once.');
assert.ok(!heroes.some(hero => EXCLUDED_SPECIAL_HERO_IDS.includes(hero.id)),'Retired hero remains selectable.');
assert.ok(!cards.some(card => ['血杀','毒杀','刺杀','毒'].includes(card.name) || card.content_pack),'Archived content leaked into initial deck.');
assert.equal(CONTENT_PACKS.length,0,'Optional packs must be unavailable in this release.');
assert.equal(requiredTen.length,10,'Required-card source contract changed.');
assert.equal(ordinaryFunctions.length,CONVENTIONAL_GENERATED_CARD_NAMES.length,'Missing retained conventional function.');
assert.ok(ordinaryFunctions.every(record => !cards.some(card => card.name === record.name)),'Zero-copy function entered default deck.');
assert.equal(localArchive.counts.optional_pack_types,19,'Archived pack accounting drift.');
assert.equal(localArchive.counts.optional_pack_physical_cards,36,'Archived pack physical accounting drift.');
await mkdir(dirname(output),{recursive:true});
// Replace the directory entry atomically, rather than following an existing
// symlink or truncating an inode potentially shared by a historical hardlink.
const temporaryOutput = `${output}.tmp-${process.pid}`;
try {
  await writeFile(temporaryOutput, `${JSON.stringify(inventory,null,2)}\n`, {encoding:'utf8',flag:'wx'});
  await rename(temporaryOutput,output);
} finally {
  await rm(temporaryOutput,{force:true});
}
console.log(JSON.stringify({output,counts,archive_counts:localArchive.counts,scope_complete:inventory.scope_complete},null,2));
