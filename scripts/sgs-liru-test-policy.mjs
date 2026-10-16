/** Read-only seven-stage test-human policy. Returns null for unrelated prompts.
 * No production skill limits, hidden foreign-hand reads, state injection or wins. */
import assert from 'node:assert/strict';
import {rule_hero} from '../web/local/effective-hero.js';
import {active_skills_for_hero} from '../web/local/skills.js';
import * as L from '../web/local/sgs-liru-skills.js';
const add=(o,k)=>o[k]=(o[k]??0)+1;
export function chooseLiruCommand(match,policy,coverage){
 const p=match.pending.prompt,g=match.game,stage=p.meta.stage,opts=p.options.filter(o=>!o.disabled),owner=g.all_players().find(a=>g.seat_of(a)===p.player_id);
 if(['juece_target','mieji_cost','mieji_target','mieji_branch','mieji_discard','fencheng_offer','fencheng_response'].includes(stage)){
  coverage.liruStages??={};add(coverage.liruStages,stage);assert.ok(owner);assert.equal(p.meta.private_to,p.player_id);
  if(stage==='fencheng_offer')return 'activate';
  if(stage==='juece_target'||stage==='mieji_target'){const target=g.all_players().find(a=>opts.some(o=>o.id===g.player_id(a))&&g.side_of(a)!==g.side_of(owner));return target?g.player_id(target):'cancel';}
  if(stage==='mieji_cost')return L.sgs_mieji_costs(g,owner).sort((a,b)=>g.material_ai_cost(a)-g.material_ai_cost(b))[0]?.id??'cancel';
  if(stage==='mieji_branch')return L.sgs_ai_mieji_branch(g,owner);
  if(stage==='mieji_discard')return opts.filter(o=>o.id.startsWith('hand:')||o.id.startsWith('eq:'))[0].id;
  const origin=g.all_players().find(a=>g.player_id(a)===p.meta.causal_owner_id),r=origin.sgs_liru_state.fencheng[JSON.stringify(p.meta.event_id)];
  const plan=L.sgs_ai_fencheng_response(g,owner,r,p.meta.x);if(plan.kind==='damage')return 'damage';
  const next=plan.materials.find(m=>!p.meta.selected.includes(m.id));return next?.id??'discard';
 }
 if(p.kind==='play_card'){
  const skills=active_skills_for_hero(rule_hero(g.player));
  for(const id of ['sgs.mieji','sgs.fencheng']){const s=skills.find(s=>s.skill_id===id&&s.available(g,g.player));
   if(s&&(id==='sgs.mieji'?L.sgs_ai_mieji_plan(g,g.player):L.sgs_ai_fencheng_should_use(g,g.player)))return s.hotkey;
  }
 }
 return null;
}
