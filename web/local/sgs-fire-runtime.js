/** Pure adapters for shared card rules; no independent source-card ruleset. */
import {seventhRuntimeMethods} from './yxs-seventh-runtime.js';
import {sgs_tianyi_sha_prohibited,sgs_tianyi_sha_allowance,sgs_tianyi_sha_target_cap,sgs_tianyi_attack_range,sgs_fire_assault_public_state} from './sgs-fire-assault-skills.js';
export const fireRuntimeMethods={
 sha_use_prohibited(actor){return seventhRuntimeMethods.sha_use_prohibited.call(this,actor)||sgs_tianyi_sha_prohibited(this,actor);},
 sha_total_allowance(actor,base){return sgs_tianyi_sha_allowance(this,actor,seventhRuntimeMethods.sha_total_allowance.call(this,actor,base));},
 sha_target_cap(actor,base=1){return sgs_tianyi_sha_target_cap(this,actor,seventhRuntimeMethods.sha_target_cap.call(this,actor,base));},
 sha_attack_range(actor){return sgs_tianyi_attack_range(this,actor,seventhRuntimeMethods.sha_attack_range.call(this,actor));},
 fire_public_state(actor){return sgs_fire_assault_public_state(this,actor);},
};
