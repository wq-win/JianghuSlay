/** Trusted finite 王允 forms. These identifiers are private runtime form IDs;
 * source/rule identity remains the historical 2023-12-07 mobile 王允 identity.
 * JH host lifecycle policy is not a claim about the current mobile executable. */
import {WANGYUN_HERO_ID} from './wangyun-data.js';
import {rule_hero} from './effective-hero.js';
export const WANGYUN_LIFECYCLE_ID=WANGYUN_HERO_ID;
export const WANGYUN_LIFECYCLE_SKILLS=Object.freeze({lianji:'sgs.mobile.wangyun.lianji',moucheng:'sgs.mobile.wangyun.moucheng',jingong:'sgs.mobile.wangyun.jingong'});
const SK=WANGYUN_LIFECYCLE_SKILLS;
export const WANGYUN_FORM_IDS=Object.freeze({base:WANGYUN_HERO_ID,max_applied:`${WANGYUN_HERO_ID}:moucheng:max-applied`,awakened:`${WANGYUN_HERO_ID}:moucheng:awakened`});
export const WANGYUN_EVOLUTION_IDS=Object.freeze({max_hp:'wangyun.moucheng.increase-max-hp.v1',skills:'wangyun.moucheng.replace-skills.v1'});
export const WANGYUN_EVOLUTIONS=Object.freeze([
 Object.freeze({evolution_id:WANGYUN_EVOLUTION_IDS.max_hp,from_template_id:WANGYUN_FORM_IDS.base,to_template_id:WANGYUN_FORM_IDS.max_applied,source_skill_id:SK.moucheng}),
 Object.freeze({evolution_id:WANGYUN_EVOLUTION_IDS.skills,from_template_id:WANGYUN_FORM_IDS.max_applied,to_template_id:WANGYUN_FORM_IDS.awakened,source_skill_id:SK.moucheng,continuation_of:WANGYUN_EVOLUTION_IDS.max_hp}),
]);
export function wangyun_form_templates(base){
 if(base.hero_id!==WANGYUN_HERO_ID||base.max_hp!==3||base.gender!=='male'||JSON.stringify(base.skill_ids)!==JSON.stringify([SK.lianji,SK.moucheng]))throw Error('王允基础模板与受信来源不符');
 return [{...base,template_id:WANGYUN_FORM_IDS.max_applied,max_hp:4},
  {...base,template_id:WANGYUN_FORM_IDS.awakened,max_hp:4,skill_ids:[SK.moucheng,SK.jingong]}];
}
export function wangyun_rule_descriptor(base,template){
 if(base.id!==WANGYUN_HERO_ID)return base;
 if(!Object.values(WANGYUN_FORM_IDS).includes(template.template_id))throw Error('未知王允技能形态');
 const awake=template.template_id===WANGYUN_FORM_IDS.awakened;
 const ids=awake?[SK.moucheng,SK.jingong]:[SK.lianji,SK.moucheng],max=template.template_id===WANGYUN_FORM_IDS.base?3:4;
 if(template.hero_id!==WANGYUN_HERO_ID||template.gender!=='male'||template.max_hp!==max||JSON.stringify(template.skill_ids)!==JSON.stringify(ids))throw Error('王允形态快照与受信模板不符');
 return Object.freeze({...base,max_hp:template.max_hp,skill_ids:Object.freeze([...template.skill_ids]),
  skill_name:awake?'谋逞 / 矜功':base.skill_name,
  skill_desc:awake?'谋逞：已觉醒，保留觉醒历史。矜功：每出牌阶段一次，将一张杀或装备当本阶段固定候选锦囊使用；本回合未造成伤害则结束阶段失去1体力。':base.skill_desc,
  lifecycle_template_id:template.template_id,awakened_form:awake});
}
const pending=new WeakMap();
const transitionId=(receipt,stage)=>JSON.stringify(['wangyun-own-evolution',receipt,stage]);
const fail=message=>{throw new TypeError(`王允生命周期：${message}`);};
const own=(g,a)=>g.wangyun_state?.actors?.[JSON.stringify(g.player_id(a))];
function inputs(actor,receipt_id,source_skill){
 if(!actor||typeof receipt_id!=='string'||!receipt_id.trim()||receipt_id!==receipt_id.trim()||source_skill!==SK.moucheng)fail('无效觉醒事务');
}
function authority(g,a,receipt_id){
 const s=own(g,a),r=s?.awakening_receipt;
 if(!s?.awakened||s.owner_id!==g.player_id(a)||!Number.isSafeInteger(s.marks)||s.marks<3||r?.receipt_id!==receipt_id
  ||!Number.isSafeInteger(r.marks)||r.marks<3||r.marks>s.marks
  ||!['committed','failed_after_commit','ended'].includes(r.status))fail('缺少角色自己的已提交谋逞事实');
 return r;
}
/** The host supplies its one authoritative lifecycle and form installer. The
 * public methods cannot accept arbitrary skill arrays, templates or max HP. */
export function create_wangyun_lifecycle_methods({lifecycle,persist,install_form,drain}){
 async function evolve(g,a,receipt_id,stage){
  if(!g.all_players().includes(a))fail('角色身份不属于本局');
  const api=lifecycle(g),actor_id=g.player_id(a),transition_id=transitionId(receipt_id,stage),evolution_id=WANGYUN_EVOLUTION_IDS[stage];
  let active=pending.get(g);if(!active)pending.set(g,active=new Map());
  const signature=JSON.stringify([actor_id,evolution_id]);
  const running=active.get(transition_id);
  if(running){if(running.signature!==signature)fail('觉醒事务身份冲突');return running.promise;}
  const previous=api.transition_receipt(transition_id);
  if(previous){
   if(previous.request.actor_id!==actor_id||previous.request.evolution_id!==evolution_id)fail('觉醒事务身份冲突');
   // Never reinstall old forms, heal, or resurrect on receipt replay.
   if(previous.status==='committed'){drain(g,api,a);persist(g);return {...previous.result,evolved:true};}
  }
  if(stage==='max_hp'&&(a.dead||api.player_state(actor_id).life_status==='dead'))return false;
  const receipt=authority(g,a,receipt_id);
  if(rule_hero(a)?.id!==WANGYUN_HERO_ID)fail('角色已失去王允形态');
  if(stage==='max_hp'){
   if(a.hp<=0||a.skills_disabled||a.disabled_skill_ids?.includes(SK.moucheng)||!rule_hero(a).skill_ids?.includes(SK.moucheng))return false;
  }else{
   const max=api.transition_receipt(transitionId(receipt_id,'max_hp'));
   if(max?.status!=='committed'||max.request.actor_id!==actor_id||receipt.stage!=='recover')fail('技能替换必须在本次加上限与回复结算后');
  }
  const promise=(async()=>{
   if(!previous&&api.player_state(actor_id).life_status!=='dead')api.update_vitals(actor_id,{current_hp:a.hp});
   const request=previous?.request??{transition_id,actor_id,evolution_id,expected_revision:api.player_state(actor_id).revision,...(stage==='skills'?{continuation_transition_id:transitionId(receipt_id,'max_hp')}:{})};
   try{
    const result=await api.evolve_own_form(request);
    if(stage==='max_hp'&&(a.dead||api.player_state(actor_id).life_status==='dead'))fail('已最终阵亡，拒绝覆盖角色');
    install_form(g,a,api.effective_form(actor_id));await g.sync_general_skill_template?.(a,{transition_id});drain(g,api,a);persist(g);
    g.guard_state_changed?.();return {...result.result,evolved:true};
   }finally{persist(g);}
  })();
  active.set(transition_id,{signature,promise});
  try{return await promise;}finally{active.delete(transition_id);}
 }
 return Object.freeze({
  wangyun_change_max_hp(actor,delta,options={}){
   const {receipt_id,source_skill}=options;inputs(actor,receipt_id,source_skill);
   if(delta!==1||Object.keys(options).some(k=>!['receipt_id','source_skill'].includes(k)))fail('仅允许受信谋逞上限增加1');
   return evolve(this,actor,receipt_id,'max_hp');
  },
  wangyun_change_skills(actor,options={}){
   const {remove,acquire,receipt_id,source_skill}=options;inputs(actor,receipt_id,source_skill);
   if(JSON.stringify(remove)!==JSON.stringify([SK.lianji])||JSON.stringify(acquire)!==JSON.stringify([SK.jingong])
    ||Object.keys(options).some(k=>!['remove','acquire','receipt_id','source_skill'].includes(k)))fail('仅允许受信谋逞完整技能替换');
   return evolve(this,actor,receipt_id,'skills');
  },
 });
}
