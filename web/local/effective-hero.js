/** Runtime rule identity is separate from the immutable selected hero identity.
 * A trusted lifecycle transition alone installs effective_rule_hero; source
 * coverage, controllers, faction allegiance and setup keep actor.hero unchanged.
 * Read-only previews/clones preserve the separate descriptor normally.
 */
export function rule_hero(actor) {
  return actor?.effective_rule_hero ?? actor?.hero ?? null;
}
