import {is_hero_available} from './models.js';

const text = value => typeof value === 'string' && value.trim().length > 0;
const emptyActive = Object.freeze([]);

/**
 * Explicit rule registration, independent of display names and source labels.
 * A packet is [{hero, hooks, active, aliases?, id_aliases?, capabilities?}].
 * Names are only a legacy string API: ambiguous names fail closed. An explicit
 * id_aliases entry can merge a source identity into one canonical rule record;
 * it cannot replace an independently registered hero. Registration is atomic.
 */
export function create_hero_rule_registry() {
  const byId = new Map(), names = new Map();

  function register(packet) {
    if (!Array.isArray(packet)) throw new TypeError('Hero rule packet must be an array.');
    const pendingIds = new Set();
    const records = packet.map(({hero, hooks = null, active = [], aliases = [], id_aliases = [], capabilities = []}) => {
      if (!hero || !text(hero.id) || !text(hero.name) || !is_hero_available(hero)) {
        throw new TypeError('Hero rules require an explicit ID and an available, tested hero.');
      }
      if (!Array.isArray(aliases) || !aliases.every(text)
        || !Array.isArray(id_aliases) || !id_aliases.every(text)
        || (hero.display_name != null && !text(hero.display_name))
        || !Array.isArray(capabilities) || !capabilities.every(text)) {
        throw new TypeError(`Invalid rule aliases or capabilities: ${hero.id}`);
      }
      for (const id of [hero.id, ...id_aliases]) {
        if (byId.has(id) || pendingIds.has(id)) throw new Error(`Duplicate hero rule ID: ${id}`);
        pendingIds.add(id);
      }
      if (hooks !== null) {
        if (typeof hooks !== 'object' || Array.isArray(hooks)) throw new TypeError(`Invalid hooks: ${hero.id}`);
        for (const [key, value] of Object.entries(hooks)) {
          const valid = Array.isArray(value) ? value.every(callback => typeof callback === 'function')
            : value === null || ['boolean', 'string', 'number'].includes(typeof value);
          if (!valid) throw new TypeError(`Invalid hook ${key}: ${hero.id}`);
        }
        hooks = Object.freeze(Object.fromEntries(Object.entries(hooks).map(([key, value]) =>
          [key, Array.isArray(value) ? Object.freeze([...value]) : value])));
      }
      if (!Array.isArray(active)) throw new TypeError(`Invalid active skills: ${hero.id}`);
      const skillIds = new Set(), hotkeys = new Set();
      for (const skill of active) {
        if (!skill || !text(skill.skill_id) || !['q', 'w', 'e', 'r'].includes(skill.hotkey)
          || typeof skill.player !== 'function' || typeof skill.ai !== 'function'
          || (skill.available != null && typeof skill.available !== 'function')
          || skillIds.has(skill.skill_id) || hotkeys.has(skill.hotkey)) {
          throw new TypeError(`Invalid or duplicate active skill: ${hero.id}`);
        }
        skillIds.add(skill.skill_id); hotkeys.add(skill.hotkey);
      }
      return Object.freeze({
        id: hero.id, hooks, active: active.length ? Object.freeze([...active]) : emptyActive,
        id_aliases: Object.freeze([...id_aliases]),
        names: Object.freeze([...new Set([hero.name, hero.display_name ?? hero.name, ...aliases])]),
        capabilities: Object.freeze([...new Set(capabilities)]),
      });
    });
    // A legacy alias must never shadow an actual ID, even in a later packet.
    for (const record of records) {
      for (const id of [record.id, ...record.id_aliases]) {
        if ([...(names.get(id) ?? [])].some(owner => owner !== record.id)) {
          throw new Error(`Hero rule ID collides with an existing alias: ${id}`);
        }
      }
      for (const name of record.names) {
        if (name !== record.id && !record.id_aliases.includes(name) && (byId.has(name) || pendingIds.has(name))) {
          throw new Error(`Hero rule alias collides with an ID: ${name}`);
        }
      }
    }
    for (const record of records) {
      for (const id of [record.id, ...record.id_aliases]) byId.set(id, record);
      for (const name of record.names) {
        if (!names.has(name)) names.set(name, new Set());
        names.get(name).add(record.id);
      }
    }
    return Object.freeze(records);
  }

  function resolve(hero) {
    if (typeof hero === 'string') {
      if (byId.has(hero)) return byId.get(hero);
      const candidates = names.get(hero);
      return candidates?.size === 1 ? byId.get(candidates.values().next().value) : null;
    }
    // Never fall back from an unknown/missing ID to any name or source label.
    return is_hero_available(hero) && typeof hero.id === 'string' ? byId.get(hero.id) ?? null : null;
  }

  return Object.freeze({register, resolve, entries: () => [...new Set(byId.values())]});
}
