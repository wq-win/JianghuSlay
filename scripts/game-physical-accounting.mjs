/** Test-only physical accounting: never deduplicate an invalid double location. */
import assert from 'node:assert/strict';
import {Card} from '../web/local/models.js';
import {printed_card_fields} from '../web/local/card-face-projection.js';
import {ZHANGFEN_EQUIPMENT_BY_FORM,ZHANGFEN_HERO_ID,ZHANGFEN_SKILL_IDS} from '../web/local/sgs-zhangfen-data.js';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
export function physicalCards(g){return [...g.deck.draw_pile,...g.deck.discard_pile,...(g.processing_cards??[]),...(g.offboard_cards??[]),...(g.sgs_zhangfen_removed_cards??[]),...(g.sgs_zhangfen_destroyed_cards??[]),...g.all_players().flatMap(p=>[...p.hand,...(p.judgment_cards??[]),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...(p.sgs_painting_pile??[]),...(p.sgs_bifa_pile??[]),...slots.map(s=>p[s]).filter(Boolean)])];}
export const physicalSignature=card=>{const c=printed_card_fields(card);return `${c.equipment_id??''}|${c.name}|${c.type}|${c.suit}|${c.rank}|${c.power}|${c.trait}`;};
/** Only committed native manufacture adds a physical card. Functional copies
 * retain their original printed material and must never add another copy. */
export function expectedNativeVehicles(g){
 const s=g.sgs_zhangfen_state;if(!s)return [];
 const all=physicalCards(g),rows=Object.values(s.vehicles),native=rows.filter(r=>r.native);
 assert.equal(s.counter,native.length,'native sequence equals committed manufactured entities');
 const listed=Object.values(s.actors).flatMap(a=>a.creation_ids);
 assert.equal(new Set(listed).size,listed.length,'native creation ledger has unique identities');
 assert.deepEqual([...listed].sort(),native.map(r=>r.physical_id).sort(),'creator ledgers cover all native entities');
 for(const actor of Object.values(s.actors))assert.equal(actor.manufactured,actor.creation_ids.length,'manufacture count matches physical entities');
 for(const row of rows){
  const found=all.filter(c=>(c.physical_id??c.derived_identity??g.card_history_materials?.find(binding=>binding.card===c)?.id)===row.physical_id);
  assert.equal(found.length,1,`vehicle ${row.physical_id} has one physical location, including copies`);
  assert.ok(Number.isInteger(row.durability)&&row.durability>=0&&row.durability<=row.max_durability);
  if(row.status==='destroyed'){assert.equal(row.durability,0);assert.ok(g.sgs_zhangfen_destroyed_cards.includes(found[0]));}
  if(!row.native)assert.ok(!found[0].derived_identity,'functional copy has no invented native material');
 }
 return native.map(row=>{
  const receipt=s.receipts[row.creation_receipt];assert.ok(receipt?.committed&&receipt.kind==='phase'&&!receipt.transfer,'native entity has committed manufacture receipt');
  assert.equal(receipt.card_id,row.physical_id);assert.equal(receipt.form,row.form);assert.equal(receipt.creation_ordinal,row.creation_ordinal);
  const definition=ZHANGFEN_EQUIPMENT_BY_FORM[row.form];assert.ok(definition);
  const face=s.faces[row.form];
  return new Card(definition.name,'武器',{...definition,...face,color:['红桃','方块'].includes(face.suit)?'红':'黑',equipment_id:definition.id,physical_id:row.physical_id,derived_identity:row.physical_id,creator_actor_id:row.creator_actor_id,creator_skill_binding:row.creator_skill_binding,creation_ordinal:row.creation_ordinal,source_skill:ZHANGFEN_SKILL_IDS.quchong,source_hero_id:ZHANGFEN_HERO_ID,acquisition_origin:'quchong-manufacture'});
 });
}
