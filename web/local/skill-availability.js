import {yxs_huasheng_available,yxs_huasheng_unavailable_reason} from './yxs-modern-wudaozi.js';
import {WANGYUN_RULE_ID,wangyun_lianji_available,wangyun_lianji_unavailable_reason,wangyun_jingong_available,wangyun_jingong_unavailable_reason} from './wangyun-skills.js';
import {sgs_qiangxi_available,sgs_qiangxi_unavailable_reason,sgs_qiangxi_targets} from './sgs-next-discard-assault.js';
import {sgs_lijian_available,sgs_lijian_unavailable_reason,sgs_lijian_targets} from './sgs-following-duel-skills.js';
import {sgs_jieyin_available,sgs_jieyin_materials,sgs_jieyin_targets,sgs_jieyin_phase_key} from './sgs-following-loss-skills.js';
import {sgs_guose_available,sgs_guose_materials,sgs_guose_targets} from './sgs-base-next-skills.js';
import {yxs_yizhuang_available} from './yxs-eighth-skills.js';
import {eighthDependencies} from './yxs-eighth-runtime.js';
import {rule_hero} from './effective-hero.js';
/** Read-only UI projection. Never calls can_play, RNG, draw, emit, or a skill handler.
 * Mirrors the human handlers in skills.js, not the stricter AI heuristics.
 * This DTO is deliberately outside Player and the replay snapshot/fingerprint.
 */
import { CardType, CardColor, CardSuit, canonical_hero_for_source } from './models.js';
import {active_skills_for_hero} from './skills.js';
import {yxs_xiadan_available,yxs_xiadan_targets} from './yxs-xiadan-skills.js';
import {yxs_qiandu_available,yxs_qiandu_materials,yxs_qiandu_targets} from './yxs-queen-skills.js';
import {seventhDependencies} from './yxs-seventh-runtime.js';
import {yxs_zhiyu_materials,yxs_fenghuo_materials} from './yxs-fifth-active-skills.js';
import {yxs_yuren_materials} from './yxs-third-phase-skills.js';
import {yxs_liaoshang_materials,yxs_meihuo_materials} from './yxs-third-response-skills.js';

const result = (status, reason, extra = {}) => ({ status, available: status === 'ready', reason, ...extra });
export function active_skill_availability(game, actor, skillId) {
  if (!actor.alive) return result('condition', '当前已退场或正在濒死结算');
  if(skillId==='yxs.huasheng'){const available=yxs_huasheng_available(game,actor);return result(available?'ready':'condition',yxs_huasheng_unavailable_reason(game,actor)||'可将合法杀资源作为材料使用本回合未用过的非延时锦囊');}
  if (['龙胆', '武穆', '疏财', '反间'].includes(skillId) && !game.is_own_play_phase(actor)) return result('condition', '只能在自己的出牌阶段主动发动；响应转化请按当前弹窗操作');
  // The next packet shares labels with original heroes but never their rules.
  // Resolve the registered callback by stable identity before any label fallback.
  const canonicalId=canonical_hero_for_source(rule_hero(actor)?.id)?.id;
  if(['sgs.songci','sgs.junxing','sgs.mieji','sgs.fencheng','sgs.mobile.zhangfen.quchong','sgs.jixi','sgs.tiaoxin','sgs.ganlu','sgs.mingce','sgs.sanyao','sgs.anxu','sgs.jiushi','sgs.danshou','sgs.shenxing','sgs.yanyu','sgs.dingpin','sgs.wurong','sgs.gongqi','sgs.jiefan'].includes(skillId)||['xun-yu','xu-huang','tai-shi-ci','yan-liang-wen-chou','lu-su','meng-huo','zhu-rong','sun-jian'].some(slug=>canonicalId===`sgs.adapted.base.hero.${slug}`)){
    const skill=active_skills_for_hero(rule_hero(actor)).find(s=>s.skill_id===skillId);
    if(!skill)return result('condition','该技能只在所列真实事件窗口发动');
    const available=Boolean(skill.available?.(game,actor));
    const reason=skill.unavailable_reason?.(game,actor)||(!game.is_own_play_phase(actor)?'只能在自己的空闲出牌阶段主动发动':available?'可发动；完整效果按当前技能说明结算':'当前没有满足素材、颜色、距离或目标条件的合法组合');
    return result(available?'ready':reason.includes('已发动')||reason.includes('已经发动')?'used':'condition',reason);
  }
  if(canonicalId==='sgs.adapted.base.hero.dian-wei'){
    const available=sgs_qiangxi_available(game,actor),reason=sgs_qiangxi_unavailable_reason(game,actor);
    return result(available?'ready':reason.includes('已发动')?'used':'condition',available?'每个真实出牌阶段限一次，失去1点体力或弃一张武器，对范围内另一角色造成1点伤害':reason,{targets:sgs_qiangxi_targets(game,actor).map(p=>({seat:game.seat_of(p),name:p.name,available:true}))});
  }
  if(canonicalId===WANGYUN_RULE_ID){
    const available=skillId==='连计'?wangyun_lianji_available(game,actor):wangyun_jingong_available(game,actor),reason=skillId==='连计'?wangyun_lianji_unavailable_reason(game,actor):wangyun_jingong_unavailable_reason(game,actor);
    return result(available?'ready':reason.includes('已发动')?'used':'condition',reason||'可发动；选择与次数按当前真实出牌阶段结算');
  }
  if(canonicalId==='sgs.adapted.base.hero.hua-tuo'){
    if(skillId!=='青囊')return result('condition','急救仅在真实回合外的合法求桃窗口选择素材发动');
    const available=sgs_qingnang_available(game,actor),reason=sgs_qingnang_unavailable_reason(game,actor);
    return result(available?'ready':reason.includes('已发动')?'used':'condition',available?'弃一张手牌，使一名受伤角色回复1点；每个真实出牌阶段限一次':reason,{targets:sgs_qingnang_targets(game,actor).map(p=>({seat:game.seat_of(p),name:p.name,available:true}))});
  }
  if(canonicalId==='sgs.adapted.base.hero.diao-chan'){
    const available=sgs_lijian_available(game,actor),reason=sgs_lijian_unavailable_reason(game,actor);
    return result(available?'ready':reason.includes('已发动')?'used':'condition',available?'弃一张手牌或装备，令两名其他男性进行普通决斗；每出牌阶段限一次':reason,{targets:sgs_lijian_targets(game,actor).map(p=>({seat:game.seat_of(p),name:p.name,available:true}))});
  }
  if(canonicalId==='sgs.adapted.base.hero.sun-shang-xiang'){
    const available=sgs_jieyin_available(game,actor),used=actor.sgs_following_loss_state?.jieyin?.[sgs_jieyin_phase_key(game,actor)];
    const reason=!game.is_own_play_phase(actor)?'只能在自己的出牌阶段发动':used?'本出牌阶段已发动结姻':sgs_jieyin_materials(game,actor).length<2?'需要两张手牌，装备不能代替':!sgs_jieyin_targets(game,actor).length?'需要另一名受伤男性':'可弃两张手牌，为自己与另一名受伤男性各回复1点；自己满血也可发动';
    return result(available?'ready':used?'used':'condition',reason,{targets:sgs_jieyin_targets(game,actor).map(p=>({seat:game.seat_of(p),name:p.name,available:true}))});
  }
  if(canonicalId==='sgs.adapted.base.hero.da-qiao'){
    const materials=sgs_guose_materials(game,actor),targets=sgs_guose_targets(game,actor),available=sgs_guose_available(game,actor);
    return result(available?'ready':'condition',!game.is_own_play_phase(actor)?'只能在自己的出牌阶段发动国色':!materials.length?'需要一张方块手牌或装备':!targets.length?'没有合法的画地为牢目标':'可将一张方块手牌或装备当画地为牢使用；没有独立次数限制');
  }
  if(canonicalId==='yxs.adapted.base.hero.cao-cao'){
    const state=game.jianxiong_public_state(actor),available=game.jianxiong_available(actor);
    return result(available?'ready':state?.used?'used':'condition',!game.is_own_play_phase(actor)?'只能在自己的出牌阶段发动奸雄':state?.used?'本回合已发动奸雄':!state?.last_card?'本回合还没有合格的本人用牌记录':available?'可用一张手牌或装备复制前一张用牌；重新选择目标':'没有符合复制后次数、距离或目标条件的素材',{copyable_card:state?.last_card??null});
  }
  if(canonicalId==='yxs.adapted.base.hero.hua-mu-lan'){
    if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段发动易装');
    const forms=game.yizhuang_candidates(actor),available=yxs_yizhuang_available(game,actor,eighthDependencies);
    return result(available?'ready':'condition',actor.hand.length<2?'易装需要两张手牌':!forms.length?'本局还没有可继承完整技能的已阵亡男性英雄':'可弃两张手牌，完整替换为所选阵亡男性的技能；上限提高不回血',{forms});
  }
  if(['yxs.adapted.base.hero.ren-heng-zhi','yxs.adapted.base.hero.wu-ze-tian'].includes(canonicalId)){
    if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段主动发动');
    if(actor.skip_play_stage)return result('condition','本次出牌阶段被跳过');
    const xiadan=canonicalId.endsWith('ren-heng-zhi');
    const available=xiadan?yxs_xiadan_available(game,actor):yxs_qiandu_available(game,actor,null,seventhDependencies);
    const targets=(xiadan?yxs_xiadan_targets(game,actor):yxs_qiandu_targets(game,actor)).map(p=>({seat:game.seat_of(p),name:p.name,hero:rule_hero(p).display_name??rule_hero(p).name,available:true,hand_count:p.hand.length}));
    const reason=xiadan?(available?'可重复拼点；赢后增加本回合杀许可，任一次未赢则本回合禁止使用杀':'双方需要手牌，装备区不能作为拼点素材'):(available?'弃两张有效黑色手牌换位；可重复，自选只付费不换位':`需要2张有效黑色手牌，目前${yxs_qiandu_materials(game,actor).length}张`);
    return result(available?'ready':'condition',reason,{targets});
  }

  if(['li-kui','yu-ji','bao-si'].some(slug=>canonicalId===`yxs.adapted.base.hero.${slug}`))return fifth_source_active_availability(game,actor,skillId);
  if(actor.skip_play_stage)return result('condition','画地为牢已跳过整个出牌阶段；仅可在合法响应窗口发动响应技能');
  if(['dan-tai-ming','zhao-fei-yan','tie-mu-zhen','mu-rong','shi-qian','chen-yuan-yuan'].some(slug=>canonicalId===`yxs.adapted.base.hero.${slug}`)){
    return fourth_source_active_availability(game,actor,skillId);
  }
  if(canonicalId==='sgs.mobile.base.hero.liu-ye')return result('condition','破橹与筹略均按真实回合时点触发，没有任意出牌阶段主动按钮');
  if(['bian-que','xi-shi','wu-song','xiang-yu','liu-bang','gou-jian'].some(slug=>canonicalId===`yxs.adapted.base.hero.${slug}`)){
    return third_source_active_availability(game,actor,skillId);
  }
  if((canonicalId==='yxs.adapted.base.hero.zhao-kuang-yin'&&skillId==='释权')
    ||(canonicalId==='yxs.adapted.base.hero.han-xin'&&skillId==='攻心')){
    return next_source_active_availability(game,actor,skillId);
  }
  const foes = game.alive_enemies(actor);
  if (game.winner || !foes.length) return result('condition', '对局已结束或没有存活对手');
  const used = actor.used_active_skills;
  if ((skillId === '诗仙' && actor.shixian_active) || (['驭人', '换牌', '反间'].includes(skillId) && used.has(skillId))) {
    return result('used', skillId === '反间' ? '本出牌阶段已发动反间，下个出牌阶段刷新' : '本回合已使用，下一回合刷新');
  }
  const hand = actor.hand;
  if(skillId==='疏财'){
    if(!hand.length)return result('condition','疏财需要至少1张手牌，装备不能代替');
    const others=game.all_players().filter(p=>p!==actor&&p.alive);
    if(!others.length)return result('condition','没有可接受手牌的其他存活角色');
    return result('ready',`本回合已交出 ${actor.shucai_given_this_turn??0} 张，已回复 ${actor.shucai_healed_this_turn??0}/1 点；可继续交牌`,{targets:others.map(p=>({seat:game.seat_of(p),name:p.name,hero:rule_hero(p).display_name??rule_hero(p).name,available:true,reason:'可交给该角色手牌',hand_count:p.hand.length}))});
  }
  // These shared helpers inspect copies only. In particular, losing a weapon or
  // offensive horse as a cost must not borrow its range/quota for the attack.
  const materials = ['武圣', '奇袭'].includes(skillId)
    ? game.skill_material_options(actor, { color: skillId === '武圣' ? CardColor.RED : CardColor.BLACK }) : [];

  const longdanMaterials = ['龙胆','武穆'].includes(skillId)
    ? game.skill_material_options(actor).filter(m => m.zone === 'hand' && !m.card.virtual && m.card.type === CardType.SHAN) : [];

  const target_checks = foes.map(target => {
    let reason = '', note = '';
    if (['龙胆','武穆'].includes(skillId)) {
      if (!game.can_sha_target(actor, target)) reason = '空城：目标没有手牌，不能成为杀的目标';
      else if (!game.in_attack_range(actor, target)) reason = `距离 ${game.distance_between(actor, target)}，超出武器范围 ${actor.weapon_range}`;
      else if (!longdanMaterials.length) reason = '没有可转为杀的闪手牌';
      else if (!longdanMaterials.some(material => game.can_convert_material_to_sha(actor, target, material))) reason = '不满足主动出杀的次数、时机或目标条件';
    } else if (skillId === '武圣') {
      if (!game.can_sha_target(actor, target)) reason = '空城：目标没有手牌，不能成为杀的目标';
      else if (materials.length && !materials.some(material => game.can_convert_material_to_sha(actor, target, material))) {
        reason = '消耗红色素材后不满足杀的次数、距离或出杀条件';
      } else if (!materials.length) reason = '没有红色手牌或装备素材';
      else note = '选素材时仍按消耗该牌后的装备、射程和次数检查';
    } else if (skillId === '奇袭') {
      if (!game.target_has_card(target)) reason = '目标没有可弃置的手牌或装备';
    } else if (skillId === '冲阵') {
      if (!game.in_attack_range(actor, target)) reason = `距离 ${game.distance_between(actor, target)}，超出武器范围 ${actor.weapon_range}`;
      // The existing human handler consumes 闪 before use_sha rejects 空城. Do
      // not invent an extra gate here; disclose the existing outcome instead.
      else if (!game.can_sha_target(actor, target)) note = '空城：发动仍会弃闪，但不能对其出杀';
    } else if (skillId === '飞贼') {
      if (!game.can_use_shunshou(actor, target)) reason = game.is_immune_to_shunshou(target) ? '目标免疫顺手牵羊' : '目标超出顺手牵羊距离';
      else if (!game.target_has_card(target)) reason = '目标没有可获得的手牌或装备';
    } else if (skillId === '换牌' && !hand.length && !target.hand.length) {
      reason = '双方都没有手牌';
    } else if (skillId === '女帝' && target.judgment_mark_pending) {
      note = '已有女帝标记：可再次弃牌，但标记不叠加';
    } else if (skillId === '释权' && !game.target_has_card(target)) {
      note = '无牌可弃：仍消耗黑牌并进行 25% 摸牌判定';
    }
    return { seat: game.seat_of(target), name: target.name, hero: rule_hero(target).display_name ?? rule_hero(target).name, available: !reason, reason, note, hand_count: target.hand.length };
  });
  const extra = { targets: target_checks };
  switch (skillId) {
    case '武穆':
    case '龙胆':
      if (actor.prison_no_sha) return result('condition', '画地为牢生效中，本回合不能主动出杀；响应转化仍按弹窗处理', extra);
      if (!game.can_use_sha(actor)) return result('used', '本回合的出杀次数已用完；响应杀闪互换仍可使用', extra);
      if (!longdanMaterials.length) return result('condition', `主动${skillId}需要 1 张闪手牌；装备不能转化`, extra);
      break;
    case '反间':
      if (!hand.length) return result('condition', '需要至少 1 张手牌供目标盲抽，装备不能代替', extra);
      return result('ready', '目标先猜花色，再随机获牌并展示；不符才造成伤害', extra);
    case '苦肉': return result('ready', actor.hp === 1
      ? '1 血可发动但有阵亡风险：先用现有桃或酒自救，存活后才摸 2 张'
      : '先失去 1 点体力，濒死结算后存活则摸 2 张；可重复发动', extra);
    case '武圣':
      if (actor.prison_no_sha) return result('condition', '画地为牢生效中，本回合不能主动出杀', extra);
      if (!game.can_use_sha(actor)) return result('used', '本回合的出杀次数已用完；响应杀仍按响应弹窗处理', extra);
      if (!materials.length) return result('condition', '需要 1 张红色手牌或已装备的牌', extra);
      break;
    case '奇袭':
      if (!materials.length) return result('condition', '需要 1 张黑色手牌或已装备的牌', extra);
      break;
    case '诗仙': return result('ready', '可发动；转化出杀仍受次数、距离与目标限制', extra);
    case '霸王': return result('ready', actor.hp === 1 ? '可发动，但会濒死：先摸牌，再以桃或酒自救' : '失去 1 点血，摸 1 张牌；本回合可重复叠加', extra);
    case '女帝':
      if (!hand.some(c => c.color === CardColor.RED)) return result('condition', '需要 1 张红色手牌', extra);
      break;
    case '驭人':
      if (!hand.length) return result('condition', '至少需要 1 张手牌', extra);
      break;
    case '释权':
      if (!hand.some(c => c.color === CardColor.BLACK)) return result('condition', '需要 1 张黑色手牌', extra);
      break;
    case '冲阵':
      if (actor.prison_no_sha) return result('condition', '画地为牢生效中，本回合不能出杀', extra);
      if (!game.can_use_sha(actor)) return result('used', '本回合的出杀次数已用完', extra);
      if (!hand.some(c => c.type === CardType.SHAN)) return result('condition', '需要 1 张闪', extra);
      break;
    case '换牌': break;
    case '兵仙':
      if (hand.length < 3) return result('condition', `需要 3 张手牌，目前 ${hand.length} 张`, extra);
      break;
    case '飞贼':
      if (!hand.some(c => c.suit === CardSuit.CLUB)) return result('condition', '需要 1 张梅花手牌', extra);
      break;
    default: return result('condition', '未识别的主动技能');
  }
  if (!target_checks.some(t => t.available)) return result('condition', target_checks.map(t => `${t.name}：${t.reason}`).join('；'), extra);
  const limitedTargets = target_checks.filter(t => !t.available).length;
  return result('ready', limitedTargets ? '可发动，请选择满足条件的目标' : '条件满足，可发动', extra);
}

// Pure target/availability callbacks are the same ones used by the handlers.
// Projection never spends cards, consumes RNG, asks a question, or emits a log.
function next_source_active_availability(game,actor,skillId){
  const skill=active_skills_for_hero(rule_hero(actor)).find(entry=>entry.skill_id===skillId);
  if(!skill||typeof skill.available!=='function'||typeof skill.targets!=='function')return result('condition','该来源主动技能尚未注册完整回调');
  const targets=skill.targets(game,actor);
  const extra={targets:targets.map(target=>({seat:game.seat_of(target),name:target.name,
    hero:rule_hero(target).display_name??rule_hero(target).name,available:skill.available(game,actor,target),
    reason:skillId==='释权'?'可弃置手牌、装备或判定区牌':'可猜花色并盲选一张手牌',hand_count:target.hand.length}))};
  if(game.winner||!game.alive_enemies(actor).length)return result('condition','对局已结束或没有存活对手',extra);
  if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段主动发动',extra);
  if(skillId==='攻心'){
    if(actor.used_active_skills.has('攻心'))return result('used','本回合已发动攻心，下个回合刷新',extra);
    if(!actor.hand.length)return result('condition','攻心需要至少1张手牌供目标盲选，装备不能代替',extra);
  }else if(!game.skill_material_options(actor,{color:CardColor.BLACK}).length){
    return result('condition','释权需要1张黑色手牌或已装备的牌；不能使用判定区牌',extra);
  }
  if(!skill.available(game,actor))return result('condition',skillId==='释权'?'没有持有可弃牌的其他存活角色':'没有可选择的其他存活角色',extra);
  return result('ready',skillId==='释权'?'可用黑色手牌或装备；目标可为队友，包含判定区，可被无懈抵消':'目标先猜花色并盲选；猜错先受伤并完成救援，存活后才获牌',extra);
}

// Third source abilities use their real legal-target and legal-material queries.
// In particular, source 刘邦 can exchange equipment with an empty hand, whereas
// the original 衡舟 cannot. Passive labels never fall through to original actives.
function third_source_active_availability(game,actor,skillId){
  const skill=active_skills_for_hero(rule_hero(actor)).find(entry=>entry.skill_id===skillId);
  if(!skill||typeof skill.available!=='function'||typeof skill.targets!=='function')return result('condition','这是被动或响应技能，没有出牌阶段主动按钮');
  const targetReason={疗伤:'可回复1点体力，允许自己、队友或敌人',魅惑:'可放置画地为牢；下次判定前可无懈',驭人:'弃自己的手牌或装备，再摸所选数量'}[skillId];
  const targets=skill.targets(game,actor);
  const extra={targets:targets.map(target=>({seat:game.seat_of(target),name:target.name,
    hero:rule_hero(target).display_name??rule_hero(target).name,available:skill.available(game,actor,target),
    reason:targetReason,hand_count:target.hand.length}))};
  if(game.winner||!game.alive_enemies(actor).length)return result('condition','对局已结束或没有存活对手',extra);
  if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段主动发动',extra);
  if(['疗伤','驭人'].includes(skillId)&&actor.used_active_skills.has(skillId))return result('used',`本回合已发动${skillId}，下个自己的回合刷新`,extra);
  const materials=({疗伤:yxs_liaoshang_materials,魅惑:yxs_meihuo_materials,驭人:yxs_yuren_materials}[skillId])?.(game,actor)??[];
  const missing={疗伤:'疗伤需要1张真实手牌，已装备的牌不能支付',魅惑:'魅惑需要1张有效方块手牌或装备，不能用判定区牌',驭人:'驭人需要至少1张真实手牌或已装备的牌，不能用判定区牌'};
  if(!materials.length)return result('condition',missing[skillId],extra);
  if(!skill.available(game,actor))return result('condition',skillId==='疗伤'?'没有存活且受伤的角色':skillId==='魅惑'?'没有可放置画地为牢的其他角色；同名延时牌不能重复':'当前条件不允许驭人',extra);
  return result('ready',{疗伤:'每回合一次；弃1张手牌，使任意受伤角色回复1点',魅惑:'方块手牌或装备转为真实画地为牢；非红桃跳过整个出牌阶段',驭人:'可仅弃装备或混合手牌；先锁定N，离装效果后摸N张，每回合一次'}[skillId],extra);
}

// Fourth packet projection delegates target/availability truth to ID-bound rules.
// Its diagnostics inspect existing cards only: never move, draw, judge or prompt.
function fourth_source_active_availability(game,actor,skillId){
  const skill=active_skills_for_hero(rule_hero(actor)).find(entry=>entry.skill_id===skillId);
  if(!skill||typeof skill.available!=='function'||typeof skill.targets!=='function')return result('condition','这是被动或响应技能，没有出牌阶段主动按钮');
  const targets=skill.targets(game,actor);
  const descriptions={傲剑:'消耗素材后仍须满足杀的目标、距离与次数',神偷:'可获得手牌、装备或判定区牌，允许合法队友目标',红颜:'依次选择两名不同男性；先选者先响应杀'};
  const extra={targets:targets.map(target=>({seat:game.seat_of(target),name:target.name,
    hero:rule_hero(target).display_name??rule_hero(target).name,available:skill.available(game,actor,target),
    reason:descriptions[skillId],hand_count:target.hand.length}))};
  if(game.winner||!game.alive_enemies(actor).length)return result('condition','对局已结束或没有存活对手',extra);
  if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段主动发动；响应转化请按当前弹窗操作',extra);
  if(skillId==='红颜'&&actor.used_active_skills.has('红颜'))return result('used','本回合已发动红颜，下个自己的回合刷新；额外出牌阶段不刷新',extra);
  if(skillId==='傲剑'){
    if(actor.prison_no_sha)return result('condition','画地为牢生效中，本回合不能主动出杀',extra);
    if(!game.can_use_sha(actor))return result('used','本回合的出杀次数已用完；响应杀不占主动额度',extra);
    if(!game.skill_material_options(actor,{color:CardColor.RED}).length)return result('condition','傲剑需要1张有效红色手牌或装备；判定区不能支付',extra);
  }
  if(skillId==='神偷'&&!actor.hand.some(card=>!card.virtual&&card.suit===CardSuit.CLUB))return result('condition','神偷需要1张梅花手牌；梅花装备区牌不能支付',extra);
  if(skillId==='红颜'&&!game.skill_material_options(actor).length)return result('condition','红颜需要弃1张自己的手牌或装备；判定区不能支付',extra);
  if(!skill.available(game,actor))return result('condition',{
    傲剑:'消耗红色素材后没有同时满足杀的距离、次数和目标条件的组合',
    神偷:'没有可被探囊取物选择且手、装、判区域有牌的其他角色',
    红颜:'至少需要两名不同存活男性及可支付的真实素材',
  }[skillId]??'当前条件不允许发动',extra);
  return result('ready',{
    傲剑:'红色手牌或装备转普通杀；按消耗后的武器与坐骑重新检查，响应另按当前窗口',
    神偷:'梅花手牌转探囊取物；无距离限制，可被无懈，允许从队友判定区取牌',
    红颜:'弃1张手牌或装备，依次选两名男性；每回合一次，决斗不可被无懈',
  }[skillId]??'条件满足，可发动',extra);
}

// Fifth projection uses registered read-only callbacks; no duplicate targeting rules.
function fifth_source_active_availability(game,actor,skillId){
  const skill=active_skills_for_hero(rule_hero(actor)).find(entry=>entry.skill_id===skillId);
  if(!skill||typeof skill.available!=='function'||typeof skill.targets!=='function')return result('condition','这是受伤或濒死时的可选触发，没有出牌阶段主动按钮');
  const targets=skill.targets(game,actor);
  const extra={targets:targets.map(target=>({seat:game.seat_of(target),name:target.name,
    hero:rule_hero(target).display_name??rule_hero(target).name,available:skill.available(game,actor,target),
    reason:skillId==='治愈'?'存活且受伤的男性；敌我不限，无距离限制':'全体其他存活角色，包含友军；逐人响应杀或无懈',hand_count:target.hand.length}))};
  if(game.winner)return result('condition','对局已结束',extra);
  if(actor.skip_play_stage)return result('condition','画地为牢已跳过整个出牌阶段',extra);
  if(!game.is_own_play_phase(actor))return result('condition','只能在自己的出牌阶段主动发动',extra);
  if(skillId==='治愈'){
    if(actor.used_active_skills.has('治愈')||actor.zhiyu_turn_receipt===`${game.turn_event_counter??0}:${game.seat_of(actor)}`)return result('used','本回合已发动治愈；额外出牌阶段不刷新，下个自己的回合可再用',extra);
    if(yxs_zhiyu_materials(game,actor).length<2)return result('condition','治愈需要2张不同的真实手牌；装备区与判定区不能支付',extra);
    if(!targets.length)return result('condition','没有存活且受伤的男性；本人满血不影响发动',extra);
  }else if(!yxs_fenghuo_materials(game,actor).length)return result('condition','烽火需要1张已经装备的实体牌；手中的装备牌不能支付',extra);
  if(!skill.available(game,actor))return result('condition','当前没有合法目标或可支付的素材',extra);
  return result('ready',skillId==='治愈'?'弃2手牌，自己与1名受伤男性各回复1；每回合一次':'弃1已装备牌，对所有其他存活角色使用烽火；包含友军，可重复发动',extra);
}
import {sgs_qingnang_available,sgs_qingnang_unavailable_reason,sgs_qingnang_targets} from './sgs-wind-heal-flip.js';
