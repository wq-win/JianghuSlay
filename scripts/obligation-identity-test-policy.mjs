/** Read-only V35 test-human choices. Uses only the actual chooser's own cards,
 * the Bifa card explicitly revealed to that chooser, and public teams/counts.
 * Every reply goes through LocalMatch.respond; no skill/effect is called here. */
import assert from 'node:assert/strict';
import {active_skills_for_hero} from '../web/local/skills.js';
import {rule_hero} from '../web/local/effective-hero.js';
import {sgs_bifa_materials,sgs_bifa_targets,sgs_ai_bifa_payment,sgs_ai_songci_target,sgs_songci_discard_materials} from '../web/local/sgs-chenlin-skills.js';
import {sgs_ai_qingxi_weapon,sgs_ai_qingxi_choice} from '../web/local/sgs-caoxiu-skills.js';
export const OBLIGATION_STAGES=Object.freeze(['bifa_material','bifa_target','bifa_payment','songci_target','songci_discard','qingxi_weapon','qingxi_target']);
const add=(o,k)=>o[k]=(o[k]??0)+1;
export function chooseObligationIdentityCommand(match,policy,coverage){
 const p=match.pending.prompt,g=match.game,stage=p.meta?.stage;
 if(!OBLIGATION_STAGES.includes(stage)){
  if(p.kind==='play_card'){
   const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.skill_id==='sgs.songci');
   if(active?.available(g,g.player)&&sgs_ai_songci_target(g,g.player)){
    add(coverage.obligationActive??={},'songci');return active.hotkey;
   }
  }
  return null;
 }
 const owner=g.all_players().find(a=>g.seat_of(a)===p.player_id),opts=p.options.filter(o=>!o.disabled);
 assert.ok(owner,'obligation prompt has an actual chooser');assert.equal(p.meta.private_to,p.player_id);
 const actor=id=>g.all_players().find(a=>g.player_id(a)===id||g.seat_of(a)===id);
 const enabled=id=>opts.some(o=>o.id===id),allied=a=>g.side_of(a)===g.side_of(owner);
 const byCost=(a,b)=>(g.material_ai_cost?.(a)??2)-(g.material_ai_cost?.(b)??2);
 let command,branch;
 if(stage==='bifa_material'){
  const enemy=sgs_bifa_targets(g,owner).some(t=>!allied(t));
  command=enemy?sgs_bifa_materials(g,owner).filter(m=>enabled(m.id)).sort(byCost)[0]?.id??'pass':'pass';branch=command==='pass'?'decline':'place';
 }
 if(stage==='bifa_target'){
  const target=sgs_bifa_targets(g,owner).filter(t=>!allied(t)&&enabled(`target:${g.player_id(t)}`)).sort((a,b)=>a.hand.length-b.hand.length||a.hp-b.hp)[0];
  command=target?`target:${g.player_id(target)}`:'cancel';branch=target?'enemy':'decline';
 }
 if(stage==='bifa_payment'){
  const row=g.sgs_chenlin_state?.obligations?.[JSON.stringify(p.meta.obligation_id)];
  assert.equal(row?.target_actor_id,g.player_id(owner),'Bifa chooser is the obligated target');
  assert.ok(row.visibility_authorizations.includes(g.player_id(owner)),'private Bifa face is explicitly revealed to this chooser');
  command=sgs_ai_bifa_payment(g,owner,actor(p.meta.source_actor_id),row)?.id??'refuse';
  if(!enabled(command))command=opts.find(o=>o.id.startsWith('hand:'))?.id??'refuse';
  branch=command==='refuse'?'refuse':'trade';
 }
 if(stage==='songci_target'){
  // The receipt is already selecting, so the normal pre-activation query is no
  // longer available. Match its public team/count strategy over offered targets.
  const targets=g.all_players().filter(t=>enabled(`target:${g.player_id(t)}`)&&(t.hand.length<t.hp?allied(t):!allied(t)))
   .sort((a,b)=>Number(a.hand.length<a.hp)-Number(b.hand.length<b.hp)||a.hp-b.hp);
  const target=targets[0];command=target?`target:${g.player_id(target)}`:'cancel';branch=target?(target.hand.length<target.hp?'draw':'discard'):'decline';
 }
 if(stage==='songci_discard'){
  const chosen=sgs_songci_discard_materials(g,owner).filter(m=>enabled(m.id)&&!p.meta.selected_ids.includes(m.id)).sort(byCost)[0];
  assert.ok(chosen,'mandatory Songci choice adds an exact unselected own material');command=chosen.id;branch=chosen.zone==='hand'?'hand':'equipment';
 }
 if(stage==='qingxi_weapon'){
  command=sgs_ai_qingxi_weapon(g,owner,actor(p.meta.target_id))?.id??'pass';branch=command==='pass'?'decline':'activate';
 }
 if(stage==='qingxi_target'){
  const selected=p.meta.selected_ids??[],plan=sgs_ai_qingxi_choice(g,owner,actor(p.meta.owner_id),p.meta.exact_count,p.meta.damage);
  if(plan.kind==='boost'){command='boost';branch='boost';}
  else{
   assert.equal(plan.materials.length,p.meta.exact_count,'payment is exactly printed weapon range');
   const desired=plan.materials.map(m=>m.id),remove=selected.find(id=>!desired.includes(id));
   command=remove??desired.find(id=>!selected.includes(id))??'discard';
   branch=remove?'unselect':command==='discard'?'discard':'select';
   if(command==='discard')assert.equal(selected.length,p.meta.exact_count,'confirmation only after exact own-hand selection');
  }
 }
 assert.ok(enabled(command),`obligation test-human selects enabled ${stage}:${command}`);
 add(coverage.obligationStages??={},stage);add(coverage.obligationChoices??={},`${stage}:${branch}`);
 add(coverage.obligationCommands??={},`${stage}:${command}`);
 return command;
}
