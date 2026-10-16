/** Visible identity may differ from stable rules/save keys. Never use this for rules. */
export const heroDisplayName = hero => hero?.display_name || hero?.name || '';

/** Stable keys, never visible names, choose heroes and route UI metadata. */
export const heroIdentityKey = hero => hero?.id || '';
export function findHeroByIdentity(heroes, value) {
  const exact = heroes.find(hero => hero.id === value);
  if (exact) return exact;
  const sourceIds = heroes.filter(hero => (hero.source_id_aliases || []).includes(value));
  if (sourceIds.length) return sourceIds.length === 1 ? sourceIds[0] : null;
  const legacy = heroes.filter(hero => hero.name === value || hero.display_name === value || (hero.aliases || []).includes(value));
  return legacy.length === 1 ? legacy[0] : null;
}

/** Search presentation labels and recorded provenance; never route mechanics. */
export function heroMatchesQuery(hero, query = '') {
  const needle = String(query).trim().toLocaleLowerCase();
  return !needle || [heroDisplayName(hero), hero?.skill_name, ...(hero?.aliases || []),
    ...(hero?.merged_source_records || []).flatMap(record => [record.name, record.skill_name])]
    .some(value => String(value || '').toLocaleLowerCase().includes(needle));
}
/** Source filters may overlap for a canonically merged, dual-source hero. */
export function heroMatchesSource(hero, source = 'all') {
  if (source === 'all') return true;
  if (source === 'original') return hero?.source_variant === 'jianghu-classic';
  const sourceIds = [hero?.id, ...(hero?.source_id_aliases || [])];
  if (source === 'yxs') return sourceIds.some(id => id?.startsWith('yxs.'));
  if (source === 'sgs') return sourceIds.some(id => id?.startsWith('sgs.'));
  return false;
}
