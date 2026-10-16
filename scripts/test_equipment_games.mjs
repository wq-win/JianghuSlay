import {chooseConfirmedSupportCommand} from './confirmed-support-test-policy.mjs';
import {chooseObligationIdentityCommand} from './obligation-identity-test-policy.mjs';
import {chooseFutureIdentityCommand} from './future-identity-test-policy.mjs';
import {chooseLiruCommand} from './sgs-liru-test-policy.mjs';
import {sgs_junxing_available,sgs_ai_junxing_plan} from '../web/local/sgs-manchong-skills.js';
import {physicalCards,physicalSignature,expectedNativeVehicles} from './game-physical-accounting.mjs';
import {zhangfen_recast_materials} from '../web/local/sgs-zhangfen-skills.js';
import {zhangfen_vehicle,zhangfen_field_vehicles} from '../web/local/sgs-zhangfen-runtime.js';
import {yxs_huasheng_resources,yxs_huasheng_outputs,yxs_huasheng_card} from '../web/local/yxs-modern-wudaozi.js';
import {sgs_ai_qiangxi_choice} from '../web/local/sgs-next-discard-assault.js';
import {printed_card_fields} from '../web/local/card-face-projection.js';
import {rule_hero} from '../web/local/effective-hero.js';
/** All canonical heroes, 1v1/1v2 real public-command games. No fixture mutation or forced wins.
 * New prompt classes are resumed before answering; every wait conserves cards.
 * EQUIPMENT_HEROES=0,27 EQUIPMENT_MODES=ai2 EQUIPMENT_SEED=123 for reproduction. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {LocalMatch} from '../web/local/session.js';
import {active_skills_for_hero} from '../web/local/skills.js';
import {HEROES,Deck,SeededRNG,JIANGHU_DECK_SIZE,CardSuit,CardType,is_sha_card} from '../web/local/models.js';
import {memoryStorage,createPolicy,expectedPhysicalCards} from './test_expansion_games.mjs';
import {chooseCommand as legacyCommand,newCoverage as legacyCoverage} from './test_second_four_games.mjs';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const add=(obj,key)=>obj[key]=(obj[key]??0)+1;
export function cardMultiset(g){return physicalCards(g).map(physicalSignature).sort();}
// Test-human tactics use the chooser's own materials and public target facts.
// No fixture mutation, hidden opposing hands, or production skill limit.
function modernHuashengPlan(g,actor){
  const allies=t=>g.side_of(t)===g.side_of(actor);
  const score=d=>({无中生有:100,顺手牵羊:80,釜底抽薪:65,过河拆桥:65,决斗:55,烽火狼烟:40,万箭齐发:40,火攻:25,刮骨疗毒:20,树上开花:15,铁索连环:10,借刀杀人:5})[d.name]??1;
  for(const definition of yxs_huasheng_outputs(g,actor).sort((a,b)=>score(b)-score(a)))for(const resource of yxs_huasheng_resources(g,actor)){
    const card=yxs_huasheng_card(g,actor,resource,definition);
    const targets=[...g.all_players()].filter(t=>t.alive&&!t.dead).sort((a,b)=>{
      const helpful=['无中生有','树上开花','刮骨疗毒','桃园结义','五谷丰登'].includes(card.name);
      return Number(allies(b)===helpful)-Number(allies(a)===helpful);
    });
    for(const target of targets){
      if(['桃园结义','五谷丰登'].includes(card.name)&&!allies(target))continue;
      const plans=card.name==='借刀杀人'?g.huasheng_borrowed_victims(actor,resource,target).map(forced_target=>({target,forced_target})):[{target,allow_allies:true}];
      for(const plan of plans)if(g.huasheng_validate_target_plan(actor,resource,card,plan))return {resource,definition,plan};
    }
  }return null;
}
export function chooseCommand(match,policy,coverage){
  const p=match.pending.prompt,g=match.game,stage=p.meta.stage;
  const supportCommand=chooseConfirmedSupportCommand(match,policy,coverage);if(supportCommand!==null)return supportCommand;
  const obligationCommand=chooseObligationIdentityCommand(match,policy,coverage);if(obligationCommand!==null)return obligationCommand;
  const futureCommand=chooseFutureIdentityCommand(match,policy,coverage);if(futureCommand!==null)return futureCommand;
  const liruCommand=chooseLiruCommand(match,policy,coverage);if(liruCommand!==null)return liruCommand;
  if(p.kind==='play_card'&&sgs_junxing_available(g,g.player)&&sgs_ai_junxing_plan(g,g.player))return 'q';
  const manchongOptions=p.options.filter(o=>!o.disabled);
  if(['junxing_cost','junxing_target','junxing_payment','yuce_reveal','yuce_payment'].includes(stage)){
    add(coverage.manchongStages??={},stage);
    if(stage==='junxing_cost')return p.meta.selected_count>0?'done':manchongOptions.find(o=>o.id.startsWith('hand:'))?.id??'cancel';
    if(stage==='junxing_target')return manchongOptions.find(o=>o.id===`target:${g.player_id(sgs_ai_junxing_plan(g,g.player)?.target)}`)?.id??manchongOptions.find(o=>o.id.startsWith('target:'))?.id??'cancel';
    if(stage==='yuce_reveal')return manchongOptions.find(o=>o.id.startsWith('hand:'))?.id??'pass';
    return manchongOptions.find(o=>o.id.startsWith('hand:'))?.id??'decline';
  }
  const owner=g.all_players().find(actor=>g.seat_of(actor)===p.player_id);
  const actorFor=id=>g.all_players().find(actor=>g.player_id(actor)===id||g.seat_of(actor)===id);
  const available=p.options.filter(option=>!option.disabled);
  const recordFollowup=()=>add(coverage.skillStages??={},`${owner?.hero.id??p.player_id}:${p.meta.skill_id}:${stage}`);
  if(stage?.startsWith('quchong_')||stage==='siege_attack'){
    assert.ok(owner,'vehicle prompt has a real owner');
    add(coverage.vehicleChoices??={},stage);recordFollowup();
    const choices=available.filter(o=>o.id!=='cancel');
    if(stage==='quchong_manufacture_form')return choices.find(o=>o.id===policy.vehicleForm)?.id??choices[0]?.id??'cancel';
    if(stage==='quchong_recipient')return choices.find(o=>actorFor(o.id.slice(7))===owner)?.id??choices.find(o=>g.side_of(actorFor(o.id.slice(7)))===g.side_of(owner))?.id??'cancel';
    if(stage==='quchong_transfer_car')return choices.find(o=>{const car=zhangfen_field_vehicles(g).find(c=>`vehicle:${c.vehicle.physical_id}`===o.id);return car&&g.side_of(car.owner)!==g.side_of(owner);})?.id??'cancel';
    if(stage==='quchong_recast'){
      const legal=zhangfen_recast_materials(g,owner).filter(m=>choices.some(o=>o.id===m.id));
      // Own-car recast is legal, but retaining a useful car is the normal tactic.
      const chosen=legal.find(m=>m.zone==='hand')??legal.find(m=>!zhangfen_vehicle(g,m.card));
      return chosen?.id??'cancel';
    }
    if(stage==='siege_attack')return choices.find(o=>o.id==='activate')?.id??'cancel';
    assert.fail(`unhandled vehicle stage ${stage}`);
  }
  if(p.kind==='play_card'){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.skill_id==='sgs.mobile.zhangfen.quchong'&&s.available?.(g,g.player));
    const key=`${g.player_id(g.player)}:${g.player.play_phase_id}`;
    policy.vehicleRecasts??={};
    const material=active&&zhangfen_recast_materials(g,g.player).find(m=>m.zone==='hand'||!zhangfen_vehicle(g,m.card));
    // Bounded test-human preference, never a production skill usage limit.
    if(material&&(policy.vehicleRecasts[key]??0)<2){policy.vehicleRecasts[key]=(policy.vehicleRecasts[key]??0)+1;add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }

  if(stage==='zaokong_target'){
    assert.ok(owner,'modern prompt has a real owner');
    add(coverage.skillStages??={},`${owner.hero.id}:yxs.zaokong:${stage}`);
    const allied=available.find(o=>actorFor(o.id)&&g.side_of(actorFor(o.id))===g.side_of(owner));
    // Protect an ally or self; an offensive opportunity may be declined.
    const command=allied?.id??'cancel';
    add(coverage.modernChoices??={},`zaokong:${command==='cancel'?'decline':'protect'}`);return command;
  }
  if(stage==='borrow_victim'&&p.meta.source_skill_id==='yxs.huasheng')return available.find(o=>o.id===policy.modernForcedTarget)?.id??'cancel';
  if(stage==='huasheng_resource'||stage==='huasheng_output'){
    assert.ok(owner,'modern prompt has a real owner');
    add(coverage.skillStages??={},`${owner.hero.id}:yxs.huasheng:${stage}`);
    const choice=modernHuashengPlan(g,owner);
    if(!choice)return 'cancel';
    policy.target=g.seat_of(choice.plan.target);
    policy.modernForcedTarget=choice.plan.forced_target?g.seat_of(choice.plan.forced_target):null;
    const id=stage==='huasheng_resource'?choice.resource.id:choice.definition.rule_id;
    assert.ok(available.some(o=>o.id===id),'test-human chooses an enabled modern menu option');
    add(coverage.modernChoices??={},`${stage}:${stage==='huasheng_output'?choice.definition.name:choice.resource.provider_skill_id??'physical-sha'}`);return id;
  }
  if(p.kind==='play_card'){
    const active=active_skills_for_hero(rule_hero(g.player)).find(skill=>skill.skill_id==='yxs.huasheng'&&skill.available?.(g,g.player));
    if(active&&modernHuashengPlan(g,g.player)){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }

  if(['sidi_store','sidi_debit','fenli_draw','fenli_play','fenli_discard','pingkou_targets','dingpin_material','dingpin_target','faen_offer','wurong_target','wurong_private_reveal','wurong_obtain'].includes(stage)){
    assert.ok(owner,'followup prompt has a real owner');recordFollowup();
    const choices=available.filter(o=>!['cancel','pass','done','0','confirm'].includes(o.id));
    if(stage==='sidi_store')return 'store';
    if(stage==='sidi_debit'){
      const target=actorFor(p.meta.target_id);
      return target&&g.side_of(target)===g.side_of(owner)?'pass':choices[0]?.id??'pass';
    }
    if(stage.startsWith('fenli_')){
      // A test-human preference only. The production skill remains optional/unlimited.
      return stage==='fenli_play'&&g.round_no%3===0?'pass':'skip';
    }
    if(stage==='pingkou_targets'){
      const selected=p.meta.selected_target_ids??[];
      if(selected.length>=(p.meta.max_count??1))return 'done';
      const next=choices.find(o=>o.id.startsWith('target:')&&!selected.includes(o.id.slice(7))&&g.side_of(actorFor(o.id.slice(7)))!==g.side_of(owner));
      return next?.id??'done';
    }
    if(stage==='dingpin_target')return choices.find(o=>o.id===`target:${g.player_id(owner)}`)?.id??choices.find(o=>g.side_of(actorFor(o.id.slice(7)))===g.side_of(owner))?.id??choices[0]?.id??'cancel';
    if(stage==='faen_offer')return g.side_of(actorFor(p.meta.target_id))===g.side_of(owner)?'activate':'pass';
    if(stage==='wurong_target')return choices.find(o=>g.side_of(actorFor(o.id.slice(7)))!==g.side_of(owner))?.id??'cancel';
    if(stage==='wurong_private_reveal'){
      // Inspect only the chooser's own hand. Never read an opponent's committed choice.
      const initiating=p.meta.owner_id===g.player_id(owner);
      return choices.find(o=>{const card=owner.hand[Number(o.id.split(':')[1])-1];return initiating?is_sha_card(card):card?.type===CardType.SHAN;})?.id??choices[0]?.id??'cancel';
    }
    if(stage==='wurong_obtain')return choices.find(o=>o.id.startsWith('eq:'))?.id??choices[0]?.id;
    return choices[0]?.id??'cancel';
  }
  if(p.kind==='play_card'){
    const active=active_skills_for_hero(rule_hero(g.player)).find(skill=>['sgs.dingpin','sgs.wurong'].includes(skill.skill_id)&&skill.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
    // Contextual use identities (e.g. 1HP 矢志) target with their legal use face,
    // while the public hand, reveal identity, and physical card remain untouched.
    for(const [index,card] of g.player.hand.entries()){
      const face=g.contextual_use_face?.(g.player,card)??card;
      if(face===card)continue;
      const target=g.alive_enemies(g.player).find(target=>g.can_play(g.player,target,card));
      if(target){policy.target=g.seat_of(target);add(coverage.humanContextualUses??={},`${g.player.hero.id}:${card.type}->${face.type}`);return String(index+1);}
    }
  }
  if(p.kind==='choice'&&p.meta.response_type){
    assert.ok(owner,'response prompt has a real owner');
    const materials=g.response_material_options(owner,p.meta.response_type);
    const legal=materials.filter(material=>available.some(o=>o.id===material.id));
    if(legal.length){
      const chosen=legal.find(m=>m.source_skill==='sgs.shizhi')??legal[0];
      add(coverage.responseMaterials,chosen.zone==='hand'?'hand':'equipment');
      if(chosen.source_skill)add(coverage.responseConversions,`${chosen.source_skill}:${p.meta.response_type}`);
      return chosen.id;
    }
    const cancel=available.find(o=>['cancel','pass','0'].includes(o.id));
    assert.ok(cancel,'response choice must expose a currently legal material or cancel');return cancel.id;
  }
  if(stage==='bingyi_targets'){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const selected=p.meta.selected??[];
    if(selected.length)return 'confirm';
    return p.options.find(o=>!o.disabled&&o.id===`target:${p.player_id}`)?.id??p.options.find(o=>!o.disabled&&o.id.startsWith('target:'))?.id??'confirm';
  }
  if(['bingyi_offer','shenxing_materials','qiaoshi_offer','yanyu_material','yanyu_bonus_target','jujian_material','jujian_target','jujian_effect','yaoming_target','yaoming_discard'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    if(p.kind==='confirm')return 'y';
    return p.options.find(o=>!o.disabled&&!['cancel','pass','done','0','decline'].includes(o.id))?.id??p.options[0].id;
  }
  if(p.kind==='play_card'){
    const key=`${g.player_id(g.player)}:${g.player.play_phase_id}`;
    policy.furtherActiveCounts??={};
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>['sgs.shenxing','sgs.yanyu'].includes(s.skill_id)&&s.available?.(g,g.player));
    if(active&&(policy.furtherActiveCounts[key]??0)<2){policy.furtherActiveCounts[key]=(policy.furtherActiveCounts[key]??0)+1;add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(stage==='mandatory_discard_batch')return p.options.filter(o=>!o.disabled).slice(0,p.min_count).map(o=>o.id).join(' ');
  if(['chengxiang_offer','chengxiang_subset','renxin_offer','renxin_equipment','longyin_offer','longyin_material','zongxuan_order','zhiyan_target','jingce_offer'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const choices=p.options.filter(o=>!o.disabled&&!['cancel','pass','0','done','confirm'].includes(o.id));
    if(stage==='chengxiang_subset')return choices.find(o=>!p.meta.revealed_cards.find(c=>c.id===o.id)?.selected)?.id??'confirm';
    if(stage==='zongxuan_order')return choices[0]?.id??'done';
    if(stage==='zhiyan_target')return choices.find(o=>o.id===g.player_id(g.player))?.id??choices[0]?.id??'cancel';
    return choices[0]?.id??p.options[0].id;
  }

  if(['fuli_choice','anxu_targets','anxu_give','anxu_reward','zhuiyi_target','gongqi_cost','gongqi_target','gongqi_card','jiefan_target','jiefan_choice'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const choices=p.options.filter(o=>!o.disabled&&!['cancel','pass','done','0','decline'].includes(o.id));
    if(p.kind==='select_hand')return choices.slice(0,Math.max(1,p.min_count??1)).map(o=>o.id).join(' ');
    if(stage==='jiefan_target')return choices.find(o=>o.id===g.player_id(g.player))?.id??choices[0]?.id??'cancel';
    return choices[0]?.id??p.options[0].id;
  }
  if(p.kind==='play_card'&&['bu-lian-shi','han-dang'].some(slug=>rule_hero(g.player).id===`sgs.adapted.base.hero.${slug}`)){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(['sanyao_cost','sanyao_target','zhiman_prevent','zhiman_obtain','jiangchi_choice','jieyue_cost','jieyue_target','jieyue_contribute','jieyue_discard','yaowu_choice'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const choices=p.options.filter(o=>!o.disabled&&!['cancel','pass','done','0','decline'].includes(o.id));
    if(stage==='jiangchi_choice')return choices[g.round_no%choices.length]?.id??p.options[0].id;
    if(p.kind==='select_hand')return choices.slice(0,Math.max(1,p.min_count??1)).map(o=>o.id).join(' ');
    return choices[0]?.id??p.options[0].id;
  }
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.adapted.base.hero.ma-su'){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(['ganlu_targets','buyi_card','xuanfeng_target','xuanfeng_card','pojun_cards','mingce_material','mingce_recipient','mingce_sha_target','mingce_recipient_choice'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const choices=p.options.filter(o=>!o.disabled&&!['cancel','pass','done','0'].includes(o.id));
    if(p.kind==='select_hand')return choices.slice(0,Math.max(1,p.max_count)).map(o=>o.id).join(' ');
    return choices[0]?.id??p.options[0].id;
  }
  if(p.kind==='play_card'&&['sgs.adapted.base.hero.wu-guo-tai','sgs.adapted.base.hero.chen-gong'].includes(rule_hero(g.player).source_hero_id??rule_hero(g.player).id)){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(p.meta.skill_id?.startsWith('sgs.')&&['qiaobian_cost','qiaobian_draw_target','qiaobian_hand','qiaobian_transfer','tiaoxin_target','tiaoxin_sha','tiaoxin_discard','zhiji_choice','guanxing_order','jixi_material','jixi_target','beige_cost','beige_source_discard'].includes(stage)){
    add(coverage.skillStages??={},`${g.player.hero.id}:${p.meta.skill_id}:${stage}`);
    const choices=p.options.filter(o=>!o.disabled&&!['cancel','pass','done','refuse','unchanged','bottom'].includes(o.id));
    if(p.kind==='select_hand')return choices.slice(0,p.min_count).map(o=>o.id).join(' ');
    if(stage==='qiaobian_cost')return g.round_no%3===0?'pass':choices[0]?.id??'pass';
    if(stage==='qiaobian_draw_target')return choices[0]?.id??'done';
    if(stage==='guanxing_order')return choices[0]?.id??p.options[0].id;
    return choices[0]?.id??p.options[0].id;
  }
  if(p.kind==='play_card'&&['sgs.adapted.base.hero.deng-ai','sgs.adapted.base.hero.jiang-wei'].includes(rule_hero(g.player).source_hero_id??rule_hero(g.player).id)){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.adapted.base.hero.lu-su'){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.skill_id==='sgs.dimeng'&&s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(['haoshi_cards','dimeng_cost','yinghun_discard'].includes(stage))return p.options.filter(o=>!['cancel','pass'].includes(o.id)).slice(0,p.min_count).map(o=>o.id).join(' ');
  if(['haoshi_target','dimeng_targets','yinghun_target','yinghun_branch','lieren_obtain'].includes(stage))return p.options.find(o=>!['cancel','pass','0'].includes(o.id))?.id??'pass';
  if(p.kind==='play_card'&&!g.has_all_hand_as_sha(g.player)){
    for(const [index,card] of g.player.hand.entries()){
      if(!g.youjian_trick_definition?.(card))continue;
      const candidates=g.youjian_trick_targets(g.player,card);
      const target=card.name==='树上开花'?candidates.find(t=>t===g.player):card.name==='刮骨疗毒'?candidates.find(t=>g.side_of(t)===g.side_of(g.player)):candidates.find(t=>g.side_of(t)!==g.side_of(g.player));
      if(target&&g.can_play(g.player,target,card)){policy.target=g.seat_of(target);add(coverage.humanCardUses??={},card.name);return String(index+1);}
    }
  }
  if(p.kind==='play_card'&&['xun-yu','xu-huang','tai-shi-ci','yan-liang-wen-chou'].some(slug=>rule_hero(g.player).id===`sgs.adapted.base.hero.${slug}`)){
    const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));
    if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(['quhu_material','tianyi_material'].includes(stage)){
    const owner=g.all_players().find(x=>g.seat_of(x)===p.player_id),options=p.options.filter(o=>o.id.startsWith('hand:'));
    return options.sort((a,b)=>(owner.hand[Number(b.id.split(':')[1])-1]?.rank??0)-(owner.hand[Number(a.id.split(':')[1])-1]?.rank??0))[0]?.id??'cancel';
  }
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.mobile.hero.wangyun.20231207'){const active=active_skills_for_hero(rule_hero(g.player)).find(s=>s.available?.(g,g.player));if(active){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}}
  if(['lianji_first','lianji_second','jingong_menu','jingong_material','jingong_target'].includes(stage)){add(coverage.skillStages??={},`王允:${stage}`);return p.options.find(o=>!o.disabled&&!['cancel','pass','0'].includes(o.id))?.id??'cancel';}
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.adapted.base.hero.dian-wei'){
    const choice=sgs_ai_qiangxi_choice(g,g.player);if(choice){policy.qiangxiTarget=g.seat_of(choice.target);add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:强袭`);return `q ${choice.material?g.material_command_args(choice.material).join(' '):'hp'}`;}
  }
  if(stage==='qiangxi_target')return p.options.find(o=>o.id===policy.qiangxiTarget)?.id??'cancel';
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.adapted.base.hero.hua-tuo'&&g.player.hp<rule_hero(g.player).max_hp){
    const active=active_skills_for_hero(rule_hero(g.player))[0];
    if(active?.available?.(g,g.player,g.player)){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:青囊`);return active.hotkey;}
  }
  if(stage==='qingnang_target')return p.options.find(o=>o.id===p.player_id)?.id??p.options.find(o=>!['cancel','0','pass'].includes(o.id))?.id??'cancel';
  if(p.kind==='play_card'&&['sgs.adapted.base.hero.diao-chan','sgs.adapted.base.hero.sun-shang-xiang'].includes(rule_hero(g.player).id)){
    const active=active_skills_for_hero(rule_hero(g.player))[0];
    if(active?.available?.(g,g.player)) {add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);return active.hotkey;}
  }
  if(stage==='jieyin_materials')return p.options.filter(o=>o.id!=='cancel').slice(0,2).map(o=>o.id).join(' ');
  if(stage==='yiji_card')return p.options[0].id;
  if(stage==='yiji_target')return p.options.find(o=>o.id===p.player_id)?.id??p.options[0].id;
  if(p.kind==='play_card'&&rule_hero(g.player).id==='sgs.adapted.base.hero.da-qiao'){
    const active=active_skills_for_hero(rule_hero(g.player))[0];
    if(policy.guoseTurn!==g.turn_event_counter&&active?.available?.(g,g.player)){
      policy.guoseTurn=g.turn_event_counter;policy.target=g.seat_of(g.default_foe(g.player));
      add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:国色`);return active.hotkey;
    }
  }
  if(p.kind==='play_card'&&rule_hero(g.player).id==='yxs.adapted.base.hero.hua-mu-lan'){
    const active=active_skills_for_hero(rule_hero(g.player))[0];
    if(active?.available?.(g,g.player)){add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:易装`);return active.hotkey;}
  }
  if(stage==='yizhuang_material')return p.options.filter(o=>o.id!=='cancel').slice(0,2).map(o=>o.id).join(' ');
  if(stage==='yizhuang_form')return p.options.find(o=>o.id!=='cancel')?.id??'cancel';
  if(p.kind==='play_card'&&['yxs.adapted.base.hero.ren-heng-zhi','yxs.adapted.base.hero.wu-ze-tian'].includes(g.player.hero.id)){
    const active=active_skills_for_hero(g.player.hero)[0];
    if(policy.seventhTurn!==g.turn_event_counter&&active?.available?.(g,g.player)){
      policy.seventhTurn=g.turn_event_counter;policy.target=g.seat_of(g.default_foe(g.player));
      add(coverage.humanActiveHeroSkills??={},`${g.player.hero.id}:${active.skill_id}`);
      if(active.skill_id==='侠胆'){const highest=g.player.hand.reduce((best,c,i)=>c.rank>g.player.hand[best].rank?i:best,0);return `${active.hotkey} ${highest+1}`;}
      return active.hotkey;
    }
  }
  if(stage==='pindian_private_card'){
    const owner=g.all_players().find(x=>g.seat_of(x)===p.player_id);
    return p.options.reduce((best,o)=>{const idx=Number(o.id.split(':').at(-1))-1;const bidx=Number(best.id.split(':').at(-1))-1;return (owner.hand[idx]?.rank??0)>(owner.hand[bidx]?.rank??0)?o:best;},p.options[0]).id;
  }
  if(stage==='qiandu_cost')return p.options.filter(o=>o.id!=='cancel').slice(0,2).map(o=>o.id).join(' ');
  if(stage==='extra_targets')return p.options.find(o=>o.id===policy.target)?.id??p.options.find(o=>/^p[123]$/.test(o.id))?.id??'done';

  if(p.meta.skill==='毒'&&stage==='draw_intercept')return p.options.find(o=>o.id===`give:${g.seat_of(g.default_foe(g.all_players().find(p2=>g.seat_of(p2)===p.player_id)))}`)?.id??'keep';
  if(p.kind==='play_card'){
    const gift=g.gift_available_actions?.(g.player)?.find(a=>a.card.type==='毒'&&g.player.hp>2);if(gift)return gift.id;
    const equipmentCommand=g.equipment_ai_action?.(g.player,g.default_foe(g.player));
    if(equipmentCommand)return equipmentCommand;
  }
  if(p.meta.skill||p.meta.card_name) {
    const owner=g.all_players().find(actor=>g.seat_of(actor)===p.player_id);
    add(coverage.skillStages??={},`${owner.hero.id}:${p.meta.skill??p.meta.card_name}:${stage??p.kind}`);
  }
  if(p.meta.skill==='驭人'&&stage==='yuren_materials'){
    if(p.meta.selected_count>0)return 'done';
    return p.options.find(option=>option.id.startsWith('eq:'))?.id??p.options.find(option=>option.id.startsWith('hand:'))?.id??'cancel';
  }
  if(p.meta.stage==='shiquan_material'&&p.options.some(option=>option.id===policy.material))return policy.material;
  if(p.meta.skill==='起义'&&stage==='qiyi_targets'&&!p.meta.selected_seats.length&&g.round_no%3===0)return 'cancel';
  if(p.meta.skill==='曼舞'&&stage==='transfer_material'){
    const owner=g.all_players().find(actor=>g.seat_of(actor)===p.player_id);
    const converted=p.options.find(option=>option.id.startsWith('hand:')&&owner.hand[Number(option.id.slice(5))-1]?.suit===CardSuit.SPADE);
    if(converted){add(coverage.nextHeroSkills??={},`${owner.hero.id}:红妆`);return converted.id;}
  }
  if(p.kind==='play_card'&&g.player.hero.id==='yxs.mobile.historical.hero.song-jiang'&&g.player.hand.length>=2){
    const turn=`${g.round_no}:${g.turn_actor}`;
    if(policy.shucaiTurn!==turn&&(g.player.hp<g.player.hero.max_hp||policy.variant%3===0)){policy.shucaiTurn=turn;policy.target=g.seat_of(g.default_foe(g.player));return 'q 1 2';}
  }
  if(p.kind==='choice'&&p.meta.skill==='变法')return policy.variant%3===0?'pass':p.options.find(o=>o.id!=='pass')?.id??'pass';
  if(p.kind==='choice'&&p.meta.skill==='法家')return p.options.find(o=>o.id!=='pass')?.id??'pass';
  if(p.kind==='choice'&&p.meta.skill==='补刀')return policy.variant%3===0?'pass':p.options.find(o=>o.id!=='pass')?.id??'pass';
  if(p.kind==='choice'&&p.meta.select_count){const choices=p.options.filter(o=>!o.disabled&&!['cancel','0','pass'].includes(o.id));return choices.slice(0,p.meta.select_count).map(o=>o.id).join(p.meta.submit_join??' ');}
  if(p.kind==='choice'&&(p.meta.card_name||p.meta.equipment)){
    add(coverage.cardStages,`${p.meta.card_name??p.meta.equipment}:${stage}`);
    if(stage==='iron_chain_mode')return policy.variant%3===0?'recast':'link';
    if(stage==='iron_chain_targets'&&p.options.some(o=>o.id==='done'))return policy.variant%2===0?'done':p.options.find(o=>/^p[123]$/.test(o.id))?.id??'done';
    if(stage==='nullification'){
      const responder=g.all_players().find(o=>g.seat_of(o)===p.player_id),target=g.all_players().find(o=>g.seat_of(o)===p.meta.target_seat);
      const helpful=['无中生有','五谷丰登','桃园结义','树上开花','刮骨疗毒'].includes(p.meta.card_name)||p.meta.card_name==='铁索连环'&&target.chained;
      const desired=g.side_of(responder)===g.side_of(target)?helpful:!helpful;
      if(desired===p.meta.effect_active)return 'pass';
    }
    if(stage==='extra_targets')return p.options.find(o=>o.id===policy.target)?.id??p.options.find(o=>/^p[123]$/.test(o.id))?.id??'done';
    const target=p.options.find(o=>o.id===policy.target);if(target)return target.id;
    return p.options.find(o=>!['cancel','0','pass','refuse','done'].includes(o.id))?.id??p.options[0].id;
  }
  if(p.kind==='choice'&&p.options.some(o=>/^p[123]$/.test(o.id))&&p.options.every(o=>/^p[123]$/.test(o.id)||o.id==='cancel')){
    return p.options.find(o=>o.id===policy.target)?.id??p.options.find(o=>/^p[123]$/.test(o.id)).id;
  }
  return legacyCommand(match,policy,coverage);
}
export async function runCase(config,coverage,{maxActions=5000,restoreEvery=29,vehicleForm='attack'}={}){
  const storage=memoryStorage(),errors=[],history=[];const seed=config.seed;
  let expected;
  const make=(s=storage)=>new LocalMatch({storage:s,onError:e=>errors.push(String(e)),onMessage:message=>{
    if(message.type!=='event'||!match?.game)return;
    const text=message.event.message;
    for(const actor of match.game.all_players().filter(Boolean)){
      for(const skill of ['释权','起义','集权','曼舞'])if(text.startsWith(`${actor.name}发动${skill}，`))add(coverage.nextHeroSkills??={},`${actor.hero.id}:${skill}`);
      if(actor.hero.id==='yxs.adapted.base.hero.han-xin'&&text===`${actor.name}摸了 3 张牌。`)add(coverage.nextHeroSkills??={},`${actor.hero.id}:兵仙`);
    }
  }});
  let match;match=make();let actions=0;const policy={...createPolicy(config.hero_index),optionalCounts:{},fanjianCount:0,guanxingCount:0,vehicleForm};const restored=new Set();
  function check(){assert.deepEqual(cardMultiset(match.game),[...expected,...expectedNativeVehicles(match.game).map(physicalSignature)].sort(),'every physical card conserved at public wait');coverage.conservationChecks++;assert.equal(errors.length,0,errors.join('\n'));for(const p of match.game.all_players()){assert.ok(p.hp<=rule_hero(p).max_hp);assert.ok(!p.dead||!p.alive);assert.ok(p.used_active_skills instanceof Set);
    if(p.hero.id==='yxs.adapted.base.hero.yang-yan-zhao'&&p.sha_count_this_turn>1&&p.weapon?.trait!=='unlimited_sha')add(coverage.nextHeroSkills??={},`${p.hero.id}:天狼`);
    if(p.hero.id==='yxs.adapted.base.hero.han-xin'&&p.used_active_skills.has('攻心'))add(coverage.nextHeroSkills??={},`${p.hero.id}:攻心`);}if(match.game.winner)assert.equal(match.pending,null);}
  async function restore(){const snap=match.snapshot(),previous=match,next=make();assert.equal(await next.resume(),true,'same-version journal resumes');assert.deepEqual(next.snapshot(),snap,'full hidden state and pending response replay exactly');previous.close();match=next;coverage.verifiedRestores++;check();}
  try{
    await match.create(config);
    expected=expectedPhysicalCards(seed,{content_packs:config.content_packs??[],hero_ids:match.game.all_players().map(player=>player.hero.id)}).map(printed_card_fields).map(c=>`${c.equipment_id??''}|${c.name}|${c.type}|${c.suit}|${c.rank}|${c.power}|${c.trait}`).sort();
    check();
    while(match.pending){assert.ok(actions<maxActions,'game reaches a real winner');const p=match.pending.prompt,tag=`${p.kind}:${p.meta.card_name??p.meta.equipment??p.meta.skill??''}:${p.meta.stage??''}:${p.meta.depth??p.meta.selected_seats?.length??p.meta.selected_target_ids?.length??p.meta.selected?.length??''}`;
      if(!restored.has(tag)){await restore();restored.add(tag);add(coverage.restoredBoundaries,tag);}
      add(coverage.actionStages??={},`${p.kind}:${p.meta.stage??'default'}`);add(coverage.phaseActions??={},match.game.turn_phase);
      const command=chooseCommand(match,policy,coverage);history.push({round:match.game.round_no,prompt:match.pending.prompt,command});if(history.length>12)history.shift();
      const id=match.pending.prompt.prompt_id,response=match.respond(id,command);if(actions%17===0){assert.equal(await match.respond(id,command),false,'duplicate command rejected');coverage.duplicateRejections++;}
      assert.equal(await response,true);actions++;coverage.actions++;check();if(actions%restoreEvery===0&&match.pending)await restore();
    }
    assert.ok(match.game.winner);assert.equal(match.game.match_should_continue(),false);await restore();assert.equal(await match.completion,match.game.winner);
    const imported=make(memoryStorage());try{assert.equal(await imported.importSave(match.exportSave()),true);assert.deepEqual(imported.snapshot(),match.snapshot());}finally{imported.close();}
    for(const row of Object.values(match.game.sgs_chenlin_state?.placements??{}))if(row.committed){
      assert.equal(row.status,'done');add(coverage.obligationCommits??={},'bifa:placement');
    }
    for(const row of Object.values(match.game.sgs_chenlin_state?.obligations??{})){
      if(row.branch_receipt)add(coverage.obligationCommits??={},`bifa:${row.branch_receipt.branch}`);
      add(coverage.obligationStates??={},`bifa:${row.state}`);
    }
    for(const row of Object.values(match.game.sgs_chenlin_state?.songci??{}))if(row.committed){
      assert.equal(row.status,'done');add(coverage.obligationCommits??={},`songci:${row.branch}`);
    }
    for(const actor of match.game.all_players()){
      for(const r of Object.values(actor.sgs_caoang_state?.kangkai??{})){assert.equal(r.status,'done');for(const [flag,label] of [['invoked','invoke'],['given','gift'],['equip_used','equipment'],['equip_declined','keep']])if(r[flag])add(coverage.confirmedSupportCommits??={},`kangkai:${label}`);}
      for(const r of Object.values(actor.sgs_panzhangmazhong_state?.duodao??{})){assert.equal(r.status,'done');if(r.paid)add(coverage.confirmedSupportCommits??={},'duodao:paid');if(r.gained)add(coverage.confirmedSupportCommits??={},'duodao:gained');}
      for(const r of Object.values(actor.sgs_panzhangmazhong_state?.anjian??{})){assert.equal(r.status,'done');add(coverage.confirmedSupportCommits??={},r.modifier?'anjian:bonus':'anjian:in-range');}
      for(const row of Object.values(actor.sgs_caoxiu_state?.qingxi??{}))if(row.committed){
        assert.equal(row.status,'done');add(coverage.obligationCommits??={},`qingxi:${row.branch}`);
        if(row.weapon_discarded)add(coverage.obligationCommits,'qingxi:weapon_discarded');
      }
      for(const [skill,rows] of [['dujin',actor.sgs_lingcao_state?.draws],['yingjian',actor.sgs_sunru_state?.yingjian],['shixin',actor.sgs_sunru_state?.shixin],['xiaoguo',actor.sgs_yuejin_state?.xiaoguo]])for(const row of Object.values(rows??{}))if(row.committed||skill==='shixin'){
        add(coverage.futureCommits??={},`${skill}:${match.game.seat_of(actor)}:${row.branch??'effect'}`);
      }
      for(const event of actor.yxs_modern_zhangqian_state?.events??[])if(event.committed){
        add(coverage.modernCommits??={},`${actor.hero.id}:${match.game.seat_of(actor)}:zaokong:${event.kind}`);
        assert.equal(event.status,'done');assert.equal(event.draws.length,2);
      }
      for(const event of actor.yxs_modern_wudaozi_state?.events??[])if(event.committed){
        add(coverage.modernCommits??={},`${actor.hero.id}:${match.game.seat_of(actor)}:huasheng:${event.output.name}`);
        assert.equal(event.status,'done');assert.equal(event.cleanup,true);assert.ok(event.paid_count>0);
      }
    }
    for(const receipt of Object.values(match.game.sgs_zhangfen_state?.receipts??{}))if(receipt.committed){
      assert.equal(receipt.status,'done','terminal vehicle receipts completed');
      add(coverage.vehicleCommits??={},receipt.kind);
      if(receipt.kind==='phase')add(coverage.vehicleCommits,receipt.transfer?'transfer':`manufacture:${receipt.form}`);
      if(receipt.kind==='collect')coverage.vehicleForgeGained=(coverage.vehicleForgeGained??0)+(receipt.forge_gained??0);
      if(receipt.kind==='durability')coverage.vehicleDurabilitySpent=(coverage.vehicleDurabilitySpent??0)+receipt.facts.n;
    }
    for(const row of Object.values(match.game.sgs_zhangfen_state?.vehicles??{}))add(coverage.vehicleEntities??={},`${row.native?'native':'copy'}:${row.form}:${row.status}`);
    coverage.maxPlayPhases=Math.max(coverage.maxPlayPhases??0,match.game.play_phase_event_counter??0);
    coverage.completed++;coverage.importedFinalReplays++;add(coverage.modes,config.mode);for(const p of match.game.all_players())add(coverage.heroSeats,`${p.hero.id}:${config.mode}:${match.game.seat_of(p)}`);
    coverage.maxPrompts=Math.max(coverage.maxPrompts,actions);coverage.maxRounds=Math.max(coverage.maxRounds,match.game.round_no);add(coverage.winners,match.game.winner);
    return {config,actions,rounds:match.game.round_no,winner:match.game.winner};
  }catch(e){throw new Error(`${e.message}\nREPRO ${JSON.stringify({config,actions,history,errors},null,2)}`,{cause:e});}finally{match.close();}
}
async function main(){
  const coverage={...legacyCoverage(),cardStages:{}},started=Date.now();
  const only=process.env.EQUIPMENT_HEROES?.split(','),modes=process.env.EQUIPMENT_MODES?.split(',')??['ai','ai2'];
  for(let i=0;i<HEROES.length;i++)if(!only||only.includes(String(i))||only.includes(HEROES[i].id)||only.includes(HEROES[i].name)||only.includes(HEROES[i].display_name))for(const mode of modes){
    const config={hero_index:i,ai_hero_index:(i+11)%HEROES.length,ai2_hero_index:mode==='ai2'?(i+19)%HEROES.length:null,mode,seed:Number(process.env.EQUIPMENT_SEED??(530000+i*137+(mode==='ai2'?70000:0)))};
    const result=await runCase(config,coverage);if(process.env.EQUIPMENT_VERBOSE==='1')console.error(JSON.stringify(result));
  }
  if(!only&&modes.length===2)for(const h of HEROES)for(const mode of modes)for(const seat of mode==='ai2'?['p1','p2','p3']:['p1','p2'])assert.ok(coverage.heroSeats[`${h.id}:${mode}:${seat}`],`${h.name}/${mode}/${seat}`);
  console.log(JSON.stringify({...coverage,elapsedMs:Date.now()-started},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
