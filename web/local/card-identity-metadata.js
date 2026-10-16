/** Read-only metadata at the hidden-card movement boundary.
 *
 * A card is an opaque identity token here, including when it is a Proxy. Never
 * inspect its virtual/physical_id/type fields, enumerate it, or allocate an ID
 * to discover whether it has special behavior. Only code-owned registry rows
 * may establish that behavior. This returns the existing row, not a new record,
 * and does not initialize registries, advance counters, or touch match RNG.
 *
 * Callers may inspect a known copied face only AFTER this lookup succeeds.
 * A matching active role is not permission to reveal a face to another player.
 */
export function known_copied_card_role(game,card){
  if(!card)return null;
  const roles=game?.copied_card_roles;
  if(!roles)return null;
  for(let index=0;index<roles.length;index++){
    const role=roles[index];
    if(role.card===card&&role.status==='active')return role;
  }
  return null;
}
