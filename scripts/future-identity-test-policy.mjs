/** Read-only test-human choices for the three classic identity heroes.
 * Only the chooser's own materials and public team facts are inspected. */
import assert from 'node:assert/strict';
import {sgs_ai_yingjian_target} from '../web/local/sgs-sunru-skills.js';
import {sgs_ai_xiaoguo_cost,sgs_ai_xiaoguo_payment} from '../web/local/sgs-yuejin-skills.js';
export function chooseFutureIdentityCommand(match,policy,coverage){
 const p=match.pending.prompt,g=match.game,stage=p.meta?.stage;
 if(!['dujin_choice','yingjian_target','xiaoguo_cost','xiaoguo_equipment'].includes(stage))return null;
 const owner=g.all_players().find(a=>g.seat_of(a)===p.player_id),opts=p.options.filter(o=>!o.disabled);
 assert.ok(owner);assert.equal(p.meta.private_to,p.player_id);
 const byId=id=>g.all_players().find(a=>g.player_id(a)===id||g.seat_of(a)===id);
 let command;
 if(stage==='dujin_choice')command='activate';
 if(stage==='yingjian_target'){const target=sgs_ai_yingjian_target(g,owner);command=target?`target:${g.player_id(target)}`:'decline';}
 if(stage==='xiaoguo_cost')command=sgs_ai_xiaoguo_cost(g,owner,byId(p.meta.target_id))?.id??'pass';
 if(stage==='xiaoguo_equipment')command=sgs_ai_xiaoguo_payment(g,owner,byId(p.meta.owner_id))?.id??'damage';
 assert.ok(opts.some(o=>o.id===command),`future test-human selects enabled ${stage}:${command}`);
 coverage.futureStages??={};coverage.futureStages[stage]=(coverage.futureStages[stage]??0)+1;
 coverage.futureChoices??={};const key=`${stage}:${command.replace(/:.*/,'')}`;coverage.futureChoices[key]=(coverage.futureChoices[key]??0)+1;
 return command;
}
