/** 16 fresh public-command games: Chen Lin/Cao Xiu × modes × decks × profiles.
 * This is natural-policy evidence; rare hostile/protected/lifecycle branches are
 * reported separately and remain the responsibility of module-specific tests. */
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {runSuite} from './obligation-identity-game-suite.mjs';
import {OBLIGATION_STAGES} from './obligation-identity-test-policy.mjs';
const result=await runSuite({kind:'packet'}),coverage=result.coverage;
assert.equal(coverage.completed,16);
for(const skill of ['bifa','songci','qingxi'])assert.ok(Object.keys(coverage.obligationCommits??{}).some(k=>k.startsWith(`${skill}:`)),`natural ${skill} committed effect`);
const branches=['bifa:placement','bifa:trade','bifa:refuse','songci:draw','songci:discard','qingxi:boost','qingxi:discard','qingxi:weapon_discarded'];
result.policy_branch_coverage={
 observed_prompt_stages:OBLIGATION_STAGES.filter(s=>coverage.obligationStages?.[s]),
 unobserved_prompt_stages:OBLIGATION_STAGES.filter(s=>!coverage.obligationStages?.[s]),
 observed_committed_branches:branches.filter(s=>coverage.obligationCommits?.[s]),
 unobserved_committed_branches:branches.filter(s=>!coverage.obligationCommits?.[s]),
 controlled_branch_evidence:['web/local/tests/sgs-chenlin-complete.test.mjs','web/local/tests/sgs-caoxiu-skills.test.mjs','web/local/tests/sgs-caoxiu-host.test.mjs','tests/obligation-identity-test-infra.test.mjs'],
};
const output=process.argv[2]?.replace(/^--output=/,'');if(output)await writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
