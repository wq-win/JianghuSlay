/** Public-command test human; only own hand plus public target/teams are inspected. */
import assert from 'node:assert/strict';
import {sgs_ai_kangkai_material,sgs_ai_kangkai_equip} from '../web/local/sgs-caoang-skills.js';
import {sgs_ai_duodao_material} from '../web/local/sgs-panzhangmazhong-skills.js';
export const CONFIRMED_SUPPORT_STAGES=Object.freeze(['kangkai_invoke','kangkai_gift','kangkai_equipment','duodao_cost']);
export function chooseConfirmedSupportCommand(match,policy,coverage){
 const p=match.pending.prompt,g=match.game,s=p.meta?.stage;if(!CONFIRMED_SUPPORT_STAGES.includes(s))return null;
 const a=g.all_players().find(a=>g.seat_of(a)===p.player_id);assert.ok(a);assert.equal(p.meta.private_to,p.player_id);
 const target=id=>g.all_players().find(a=>g.player_id(a)===id||g.seat_of(a)===id),options=p.options.filter(o=>!o.disabled);
 let value;
 if(s==='kangkai_invoke')value='activate'; // Human coverage policy deliberately explores any legal recipient.
 if(s==='kangkai_gift')value=sgs_ai_kangkai_material(g,a,target(p.meta.target_id))?.id??options[0]?.id;
 if(s==='kangkai_equipment')value=sgs_ai_kangkai_equip(g,a,a.hand.find(c=>g.card_history_material_id(c)===p.meta.gift.card_id))?'use':'keep';
 if(s==='duodao_cost')value=sgs_ai_duodao_material(g,a,target(p.meta.source_id))?.id??'pass';
 assert.ok(options.some(o=>o.id===value),`legal confirmed-support reply ${s}: ${value}`);
 const add=(o,k)=>o[k]=(o[k]??0)+1;add(coverage.confirmedSupportStages??={},s);add(coverage.confirmedSupportChoices??={},`${s}:${value}`);return value;
}
