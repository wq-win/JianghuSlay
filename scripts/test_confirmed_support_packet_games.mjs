/** 16 fresh public-command games: Cao Ang/Pan Zhang Ma Zhong × modes × decks × profiles.
 * This is natural-policy evidence; rare hostile/protected/lifecycle branches are
 * reported separately and remain the responsibility of module-specific tests. */
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {runSuite} from './confirmed-support-game-suite.mjs';
import {CONFIRMED_SUPPORT_STAGES} from './confirmed-support-test-policy.mjs';
const result=await runSuite({kind:'packet'}),coverage=result.coverage;
assert.equal(coverage.completed,16);
const branches=['kangkai:invoke','kangkai:gift','kangkai:equipment','kangkai:keep','duodao:paid','duodao:gained','anjian:bonus','anjian:in-range'];
result.policy_branch_coverage={
 observed_prompt_stages:CONFIRMED_SUPPORT_STAGES.filter(s=>coverage.confirmedSupportStages?.[s]),
 unobserved_prompt_stages:CONFIRMED_SUPPORT_STAGES.filter(s=>!coverage.confirmedSupportStages?.[s]),
 observed_committed_branches:branches.filter(s=>coverage.confirmedSupportCommits?.[s]),
 unobserved_committed_branches:branches.filter(s=>!coverage.confirmedSupportCommits?.[s]),
 controlled_branch_evidence:['web/local/tests/caoang-independent.test.mjs','web/local/tests/sgs-panzhangmazhong-skills.test.mjs','web/local/tests/sgs-panzhangmazhong-host.test.mjs','tests/confirmed-support-test-infra.test.mjs'],
};
const output=process.argv[2]?.replace(/^--output=/,'');if(output)await writeFile(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
