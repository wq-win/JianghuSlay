import {rule_hero} from './effective-hero.js';
/** Source-versioned equipment effects. See equipment-catalog.mjs for provenance.
 * Call target-confirmation hooks before armor/dodge, replacement only immediately
 * before a confirmed SHA damage event, and damage modifiers after source bonuses.
 * This module never creates a new SHA when an axe restores a dodged attack.
 */
import {equipment_definition} from './equipment-catalog.mjs';
import {mode_equipment_enabled,mode_equipment_definition} from './mode-equipment-catalog.mjs';

export const EQUIPMENT_SLOTS = Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SHA_TYPES = new Set(['杀','血杀','毒杀','火杀','雷杀','刺杀']);
const SLOT_LABEL = {weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'};
const FALLBACK_EFFECTS = Object.freeze({
  '寒冰剑':'ice_sword','雌雄双股剑':'double_swords','贯石斧':'axe',
  '白银狮子':'silver_lion','藤甲':'vine','仁王盾':'renwang','八卦阵':'bagua',
  '青釭剑':'ignore_armor','鱼肠剑':'ignore_armor','麒麟弓':'dismount','霸王弓':'dismount',
  '青龙偃月刀':'follow_sha','诸葛连弩':'unlimited_sha','丈八蛇矛':'two_as_sha','方天画戟':'last_hand_targets',
  '龙鳞刀':'dragon_blade','盘龙棍':'follow_sha','芦叶枪':'two_as_sha','博浪锤':'axe',
  '虎符':'unlimited_sha','狼牙棒':'last_hand_targets','玉如意':'bagua','古锭刀':'empty_hand_damage','朱雀羽扇':'fire_fan',
});
export function equipment_effect(card) {
  if (!card) return null;
  return equipment_definition(card)?.trait ?? FALLBACK_EFFECTS[card.name] ?? card.trait ?? null;
}
export function equipment_nature(context = {}) {
  if (context.nature) return context.nature;
  if (context.source_card?.nature) return context.source_card.nature;
  return context.source_card?.type === '火杀' ? 'fire' : context.source_card?.type === '雷杀' ? 'thunder' : 'normal';
}
const isSha = (card, context) => context?.kind === 'sha' || (card ? SHA_TYPES.has(card.type) : true);
const knownGender = player => ({male:'male',female:'female',男:'male',女:'female'})[rule_hero(player)?.gender] ?? null;
const alive = player => Boolean(player && player.alive && !player.dead);
const seat = (game, player) => game.seat_of?.(player) ?? player.name;
const emit = (game, text) => game.view?.emit(text);
const weaponEffect = (actor, effect) => alive(actor) && !actor.weapon_disabled && equipment_effect(actor.weapon) === effect;
const armorActive = (target, context = {}, game = null) => Boolean(target?.armor && !target.armor_disabled && !context.armor_ignored && !context.armor_disabled && mode_equipment_enabled(target.armor,game?.content_packs));
const materialOptions = (owner, {hidden = false, exclude = null, horsesOnly = false, judgment = false} = {}) => {
  const options = horsesOnly ? [] : owner.hand.map((card,index) => ({zone:'hand',index,card,id:`hand:${index+1}`,label:hidden ? `手牌${index+1}（未知）` : `手牌${index+1}：${card}`}));
  for (const zone of horsesOnly ? ['offensive_horse','defensive_horse'] : EQUIPMENT_SLOTS) {
    if (owner[zone]) options.push({zone,index:0,card:owner[zone],id:`eq:${zone}`,label:`${SLOT_LABEL[zone]}：${owner[zone]}`});
  }
  if (judgment) for (const [index,card] of (owner.judgment_cards ?? []).entries()) options.push({zone:'judgment',index,card,id:`judge:${index+1}`,label:`判定区：${card.name}`});
  return options.filter(option => option.card !== exclude);
};
const cost = option => ({桃:6,闪:4,酒:3,杀:2,血杀:2,毒杀:2}[option.card.type] ?? 1) + (option.zone === 'hand' ? 0 : equipment_effect(option.card) === 'silver_lion' ? 0 : 3);
async function choose(game, owner, equipment, stage, options, {optional = false, privateHand = false, prompt = null} = {}) {
  if (!options.length) return null;
  if (owner.is_ai) return options[0];
  const choices = options.map(({id,label}) => ({id,label}));
  if (optional) choices.push({id:'cancel',label:'放弃发动'});
  if (options.length === 1 && !optional) return options[0];
  while (true) {
    const answer = String(await game.view.ask_line(prompt ?? `${equipment}：请选择`, {
      kind:'choice', player_id:seat(game,owner), options:choices,
      meta:{equipment,stage,...(privateHand ? {private_to:seat(game,owner)} : {})},
    })).trim();
    if (optional && ['cancel','0','pass','n'].includes(answer)) return null;
    const option = options.find(option => option.id === answer) ?? (/^\d+$/.test(answer) ? options[Number(answer)-1] : null);
    if (option) return option;
    emit(game,'请选择有效选项。');
  }
}
async function confirm(game, owner, equipment, stage, text) {
  if (owner.is_ai) return true;
  const selected = await choose(game,owner,equipment,stage,[{id:'activate',label:text}],{optional:true});
  return Boolean(selected);
}
/** Atomic detach before any loss trigger; follow-up callbacks may draw/alter cards. */
async function discardMaterials(game, owner, options, reason, context = {}) {
  if(game.card_loss_events_enabled?.(owner)??game.youjian_events_enabled?.()){const result=await game.public_card_loss(owner,options,{to:'discard',reason,visibility:'public',armor_disabled:context.armor_ignored||context.armor_disabled});return result.committed;}
  const leaveFaces=new Map(options.filter(m=>EQUIPMENT_SLOTS.includes(m.zone)).map(m=>[m.card,{...m.card}]));
  const seen = new Set();
  for (const option of options) {
    if (seen.has(option.card) || (option.zone === 'hand' ? owner.hand[option.index] : option.zone === 'judgment' ? owner.judgment_cards[option.index] : owner[option.zone]) !== option.card) return false;
    seen.add(option.card);
  }
  for (const option of options.filter(option => option.zone === 'hand').sort((a,b) => b.index-a.index)) owner.hand.splice(option.index,1);
  for (const option of options.filter(option => option.zone === 'judgment').sort((a,b) => b.index-a.index)) owner.judgment_cards.splice(option.index,1);
  for (const option of options.filter(option => EQUIPMENT_SLOTS.includes(option.zone))) owner[option.zone] = null;
  game.deck.discard(options.map(option => option.card));
  for (const option of [...options].sort((a,b)=>EQUIPMENT_SLOTS.indexOf(a.zone)-EQUIPMENT_SLOTS.indexOf(b.zone))) {
    if (EQUIPMENT_SLOTS.includes(option.zone)) await game.equipment_on_leave(owner,option.card,{slot:option.zone,reason,equipment_face:leaveFaces.get(option.card),armor_disabled:context.armor_ignored || context.armor_disabled});
    emit(game,`${owner.name}因${reason}弃置了${option.card.name}。`);
  }
  await game.equipment_after_cards_lost(owner,options.map(option => option.card),{reason,zones:options.map(option => option.zone)});
  return true;
}

const PEACOCK_ACTION = 'yxs.zhuque.equipment.kongque.activate';
const MIRROR_ID = 'yxs.zhuque.equipment.huxin';
// Only pending promises live here. All replay-authoritative capacity/turn state
// lives on the player; neither frozen physical cards nor catalog rows mutate.
const pendingMirrorCommits = new WeakMap();
const ownsPlay = (game,actor) => alive(actor) && game.turn_phase === 'play' && game.turn_actor === seat(game,actor);
const peacockActive = (game,actor) => Boolean(alive(actor) && actor.zhuque_peacock?.active
  && actor.zhuque_peacock.turn_actor === game.turn_actor && game.turn_actor === seat(game,actor)
  && !['setup','finished'].includes(game.turn_phase));
const mirrorEntry = target => {
  const entry=target?.equipment_state?.armor;
  return equipment_effect(target?.armor)==='heart_mirror' && entry?.equipment_id===MIRROR_ID
    && Number.isInteger(entry.episode_id) && entry.episode_id>0
    && Number.isInteger(entry.remaining) && entry.remaining>=0 && entry.remaining<=2 ? entry : null;
};
const mirrorEligible = (game,target,amount,context) => alive(target) && amount>0
  && context.kind==='sha' && !context.chain_transfer && !context.prevented
  && armorActive(target,context,game) && (mirrorEntry(target)?.remaining??0)>0;
function mirrorReceipt(game,target,context,damage,prevented=0,entry=null) {
  const receipt={damage_event_id:context.damage_event_id??null,receiver:seat(game,target),damage,prevented,
    equipment_id:prevented?MIRROR_ID:null,episode_id:entry?.episode_id??null,committed:true};
  context.equipment_prevention_receipt=receipt;
  return damage;
}
async function commitMirror(game,target,amount,context) {
  const damage=Math.max(0,Number(amount)||0);
  const previous=context.equipment_prevention_receipt;
  if(previous?.committed && previous.receiver===seat(game,target)
    && previous.damage_event_id===(context.damage_event_id??null))return previous.damage;
  if(!mirrorEligible(game,target,damage,context))return mirrorReceipt(game,target,context,damage);
  const armor=target.armor,entry=mirrorEntry(target),remaining=entry.remaining;
  const prevented=Math.min(damage,remaining),residual=damage-prevented,exhausted=prevented===remaining;
  const detail=`抵挡${prevented}点杀伤害（原${damage}点，剩余${residual}点）${exhausted?'；护心镜耗尽，弃置它'+(target.hand.length?'及一张手牌':''):''}`;
  if(!await confirm(game,target,'护心镜','prevent_sha',detail))return mirrorReceipt(game,target,context,damage);
  const stillValid=()=>mirrorEligible(game,target,damage,context) && target.armor===armor
    && mirrorEntry(target)===entry && entry.remaining===remaining;
  if(!stillValid())return mirrorReceipt(game,target,context,damage);
  if(exhausted){
    let hand=null;
    while(target.hand.length){
      const options=materialOptions(target).filter(option=>option.zone==='hand');
      hand=target.is_ai ? options.sort((a,b)=>cost(a)-cost(b))[0]
        : await choose(game,target,'护心镜','exhaust_hand',options,{privateHand:true,prompt:'护心镜已决定发动：请选择必须弃置的一张手牌'});
      if(!stillValid())return mirrorReceipt(game,target,context,damage);
      if(hand && target.hand[hand.index]===hand.card)break;
    }
    if(!stillValid())return mirrorReceipt(game,target,context,damage);
    const materials=[{zone:'armor',index:0,card:armor},...(hand?[hand]:[])];
    // Both exact cards leave before any loss callback, so newly drawn/equipped
    // cards cannot accidentally become the exhaustion payment for this incident.
    if(!await discardMaterials(game,target,materials,'护心镜耗尽',context))return mirrorReceipt(game,target,context,damage);
  }else entry.remaining-=prevented;
  emit(game,`${target.name}发动护心镜，抵挡${prevented}点杀伤害${exhausted?'，护心镜耗尽。':`，剩余容量${entry.remaining}。`}`);
  return mirrorReceipt(game,target,context,residual,prevented,entry);
}

export function equipment_two_card_sha_color(actor, cards) {
  if (cards.length !== 2) throw new Error('双牌转杀需要恰好两张手牌。');
  const colors = cards.map(card => card.color);
  if (equipment_definition(actor.weapon)?.mechanism_signature?.virtual_card?.color_rule === 'any_red_red_all_black_black_other_colorless') {
    if (colors.includes('红')) return '红';
    return colors.every(color => color === '黑') ? '黑' : '无色';
  }
  return colors.every(color => color === '红') ? '红' : colors.every(color => color === '黑') ? '黑' : '无色';
}
export const equipmentMethods = {
  equipment_follow_sha_no_distance(actor) { return equipment_definition(actor?.weapon)?.follow_sha_no_distance === true; },
  equipment_two_card_sha_color(actor, cards) { return equipment_two_card_sha_color(actor,cards.map(c=>this.effective_card?.(c,actor)??c)); },
  equipment_has_bagua(player, context = {}) { return armorActive(player,context,this) && equipment_effect(player.armor) === 'bagua'; },
  equipment_ignores_armor(actor, context = {}) {
    return !context.chain_transfer && weaponEffect(actor,'ignore_armor') && (context.kind === undefined || context.kind === 'sha');
  },
  equipment_on_enter(owner,card,{slot=null}={}) {
    if(slot!=='armor'||equipment_effect(card)!=='heart_mirror')return;
    owner.equipment_entry_serial=(Number.isInteger(owner.equipment_entry_serial)?owner.equipment_entry_serial:0)+1;
    owner.equipment_state??={};
    owner.equipment_state.armor={equipment_id:MIRROR_ID,episode_id:owner.equipment_entry_serial,remaining:2};
  },
  equipment_reset_turn(actor) { actor.zhuque_peacock=null; },
  equipment_sha_turn_bonus(actor) {
    // Explicit Jianghu cross-game rule: wine and plume share a max group.
    // Wine is still consumed by the actual SHA use; plume is not consumed.
    return Math.max(0,Number(actor?.wine_bonus)||0,peacockActive(this,actor)?1:0);
  },
  equipment_available_actions(actor) {
    if(!weaponEffect(actor,'peacock_plume')||!mode_equipment_enabled(actor.weapon,this.content_packs))return [];
    const active=peacockActive(this,actor),available=ownsPlay(this,actor)&&!actor.equipment_action_pending;
    return [{id:PEACOCK_ACTION,command:'equipment kongque',source_type:'equipment',equipment_id:mode_equipment_definition(actor.weapon).id,
      name:'孔雀翎',label:active?'再次发动孔雀翎':'发动孔雀翎',description:'失去1点体力，本回合所有杀伤害+1；可重复发动但不叠加，与酒取较大值。',
      cost_hp:1,repeatable:true,per_turn:null,active,available,reason:available?null:!ownsPlay(this,actor)?'仅自己的出牌阶段可发动':'正在结算装备发动'}];
  },
  equipment_ai_action(actor,target=null) {
    const action=this.equipment_available_actions(actor).find(action=>action.available);
    if(!action||action.active||actor.hp<3||actor.wine_bonus>0||!this.can_use_sha?.(actor))return null;
    const targets=this.alive_enemies?.(actor)??(target?[target]:[]);
    // Own hand plus public HP/equipment/legal-target information only. A mirror
    // preview remains optional: never assume that its owner must activate it.
    const useful=actor.hand.some(card=>SHA_TYPES.has(card.type)&&targets.some(foe=>alive(foe)
      && this.in_attack_range(actor,foe)&&this.can_sha_target(actor,foe)
      && this.preview_sha_damage(actor,foe,card)>0));
    return useful?action.command:null;
  },
  async use_equipment_action(actor,target,command) {
    const actionId=typeof command==='object'?(command.id??command.command):command;
    if(![PEACOCK_ACTION,'equipment kongque','kongque','孔雀翎'].includes(String(actionId??'').trim()))return false;
    if(!this.equipment_available_actions(actor).some(action=>action.available))return false;
    const turn_actor=this.turn_actor;
    actor.equipment_action_pending=PEACOCK_ACTION;
    try{
      if(!await confirm(this,actor,'孔雀翎','lose_hp','失去1点体力（可能濒死），本回合所有杀伤害+1；重复发动不叠加'))return false;
      if(!ownsPlay(this,actor)||!weaponEffect(actor,'peacock_plume')||!mode_equipment_enabled(actor.weapon,this.content_packs))return false;
      await this.lose_hp(actor,1,{source:actor,reason:'孔雀翎'});
      if(alive(actor)&&this.turn_actor===turn_actor){
        actor.zhuque_peacock={active:true,turn_actor};
        emit(this,`${actor.name}发动孔雀翎，本回合所有杀伤害+1（与酒取较大值，重复不叠加）。`);
      }
      return true;
    }finally{delete actor.equipment_action_pending;}
  },
  equipment_preview_damage(target,amount,context={}) {
    const mandatory_damage=this.equipment_modify_damage(target,amount,context);
    const entry=mirrorEntry(target),optional_preventable=mirrorEligible(this,target,mandatory_damage,context)?Math.min(mandatory_damage,entry.remaining):0;
    return {mandatory_damage,optional_preventable,optional_min_damage:mandatory_damage-optional_preventable,
      applicable_equipment_id:optional_preventable?MIRROR_ID:null,episode_id:optional_preventable?entry.episode_id:null};
  },
  async equipment_commit_damage(target,amount,context={}) {
    if(pendingMirrorCommits.has(context))return pendingMirrorCommits.get(context);
    const promise=commitMirror(this,target,amount,context);pendingMirrorCommits.set(context,promise);
    try{return await promise;}finally{pendingMirrorCommits.delete(context);}
  },
  equipment_hand_limit_bonus(player) {
    return alive(player) && armorActive(player,{},this) && equipment_effect(player.armor) === 'qiankun_bag' ? 1 : 0;
  },
  equipment_on_leave(owner, card, {slot = null, reason = '装备离场', armor_disabled = false} = {}) {
    // State cleanup is unconditional: ignored armor and death still end its episode.
    if(slot==='armor'&&equipment_effect(card)==='heart_mirror'&&owner.equipment_state)delete owner.equipment_state.armor;
    if (slot !== 'armor' || armor_disabled || !owner || owner.armor_disabled || owner.dead || ['death','阵亡清理'].includes(reason) || !mode_equipment_enabled(card,this.content_packs)) return 0;
    const effect = equipment_effect(card);
    if (effect === 'qiankun_bag') {
      const before = owner.hand.length;
      const resolve=()=>{const drawn=owner.hand.length-before;emit(this,`${owner.name}的乾坤袋离场，摸${drawn}张牌。`);return drawn;};
      const result=this.draw_cards(owner,1);return result&&typeof result.then==='function'?result.then(resolve):resolve();
    }
    if (!['silver_lion','golden_armor'].includes(effect)) return 0;
    const restored = owner.heal(1);
    if (restored > 0) emit(this,`${owner.name}的${card.name}离场，回复${restored}点体力。`);
    return restored;
  },
  async equipment_after_cards_lost(owner, cards, context = {}) {
    // Optional engine/event extension. Each ice-sword discard awaits this before
    // collecting the next choices; axe calls it once with both paid cards.
    if (typeof this.on_equipment_cards_lost === 'function') await this.on_equipment_cards_lost(owner,cards,context);
  },
  equipment_card_immunity(actor, target, card, context = {}) {
    if (!armorActive(target,context,this)) return null;
    const effect = equipment_effect(target.armor);
    if (effect === 'golden_armor' && ['南蛮入侵','烽火狼烟','万箭齐发'].includes(card?.name)) return '金鳞甲';
    if (effect === 'vine') {
      // Explicit Jianghu adaptation: 烽火狼烟 maps to 南蛮 for this immunity;
      // blood/poison are NOT ordinary SHA, despite dealing normal damage.
      if (['南蛮入侵','烽火狼烟','万箭齐发'].includes(card?.name)) return '藤甲';
      if (isSha(card,context) && (!card || card.type === '杀') && equipment_nature({...context,source_card:card}) === 'normal') return '藤甲';
    }
    if (effect === 'renwang' && isSha(card,context) && (this.effective_color?.(card,actor)??card?.color) === '黑') return '仁王盾';
    return null;
  },
  equipment_sha_immunity(actor, target, context = {}) {
    return this.equipment_card_immunity(actor,target,context.source_card ?? null,{...context,kind:'sha'});
  },
  equipment_modify_damage(target, amount, context = {}) {
    let damage = Math.max(0,Number(amount) || 0);
    damage=this.youjian_modify_damage?.(target,damage,context)??damage;
    if (!damage || !armorActive(target,context,this)) return damage;
    const effect = equipment_effect(target.armor);
    if (effect === 'vine' && equipment_nature(context) === 'fire') damage += 1;
    if (effect === 'silver_lion') damage = Math.min(1,damage);
    // Preserve explicit synthetic armor fixtures used by the older engine tests.
    // Every registered real equipment card, even forged with power>0, uses only
    // its source rule; no named game armor retains the old flat reduction.
    if (!equipment_definition(target.armor) && !FALLBACK_EFFECTS[target.armor.name]) damage = Math.max(0,damage-(target.armor.power ?? 0));
    return damage;
  },
  async equipment_prepare_sha(actor, context = {}) {
    const card = context.source_card;
    // A Card-shaped object does not prove physical provenance. Hero conversion
    // views and response-only SHA must never enter this conversion window.
    const provenance = context.use_provenance;
    if (weaponEffect(actor,'blood_sword') && mode_equipment_enabled(actor.weapon,this.content_packs)
      && context.kind === 'sha' && provenance?.kind === 'physical'
      && provenance.physical_card === card && card?.name === '杀' && card.type === '杀'
      && !card.virtual && equipment_nature(context) === 'normal') {
      if (!await confirm(this,actor,'饮血剑','convert_blood','将这张实体普通杀改为血杀')) return context;
      emit(this,`${actor.name}发动饮血剑，将这张实体普通杀改为血杀。`);
      // Only the use view changes. The original card remains in processing and
      // reaches the normal destination once; this view must never be discarded.
      return {...context,nature:'normal',source_card:{...card,name:'血杀',type:'血杀',nature:'normal',virtual:true,conversion:'饮血剑'},use_provenance:{...provenance,conversion:'饮血剑'}};
    }
    if (!weaponEffect(actor,'fire_fan') || (card && card.type !== '杀') || equipment_nature(context) !== 'normal') return context;
    if (!await confirm(this,actor,'朱雀羽扇','convert_fire','将这张普通杀改为火杀')) return context;
    emit(this,`${actor.name}发动朱雀羽扇，将这张普通杀改为火杀。`);
    return {...context,nature:'fire',source_card:card ? {...card,type:'火杀',name:'火杀',nature:'fire'} : {name:'火杀',type:'火杀',nature:'fire',color:null,suit:null}};
  },
  equipment_sha_damage_bonus(actor, target, context = {}) {
    return !context.chain_transfer && weaponEffect(actor,'empty_hand_damage') && target.hand.length === 0 ? 1 : 0;
  },
  async equipment_before_sha(actor, target, context = {}) {
    if (!weaponEffect(actor,'double_swords') || !alive(target)) return false;
    const ownGender = this.effective_gender ? this.effective_gender(actor) : knownGender(actor), otherGender = this.effective_gender ? this.effective_gender(target) : knownGender(target);
    if (!ownGender || !otherGender || ownGender === otherGender) return false;
    if (!await confirm(this,actor,'雌雄双股剑','activate','发动雌雄双股剑')) return false;
    const options = materialOptions(target).filter(option => option.zone === 'hand');
    options.push({id:'draw',label:'令攻击者摸1张牌'});
    let selected;
    if (target.is_ai) selected = options.filter(option => option.card).sort((a,b) => cost(a)-cost(b))[0] ?? options.at(-1);
    else selected = await choose(this,target,'雌雄双股剑','target_choice',options,{privateHand:true});
    if (selected?.id === 'draw') {
      await this.draw_cards(actor,1); emit(this,`${target.name}选择令${actor.name}因雌雄双股剑摸1张牌。`);
    } else if (selected) await discardMaterials(this,target,[selected],'雌雄双股剑');
    return true;
  },
  async equipment_try_bagua(player, context = {}) {
    if (!alive(player) || context.dodge_blocked || !armorActive(player,context,this) || equipment_effect(player.armor) !== 'bagua') return false;
    const equipment = player.armor.name;
    if (!await confirm(this,player,equipment,'judge',`发动${equipment}判定`)) return false;
    const central = typeof this.reveal_judgment === 'function';
    const card = central ? await this.reveal_judgment(player,equipment,{good_for:player,favorable:c=>c.color==='红'}) : this.deck.draw(1)[0];
    if (!card) { emit(this,`${equipment}：牌堆为空，判定失败。`); return false; }
    const success = (this.effective_color?.(card,player)??card.color) === '红';
    if (central) await this.finish_judgment_card(card); else this.deck.discard(card);
    if (!central) emit(this,`${player.name}的${equipment}判定：${card}。`);
    return success;
  },
  async equipment_after_dodge(actor, target, context = {}) {
    if (!weaponEffect(actor,'axe') || !alive(target) || context.prevented) return false;
    const equipment = actor.weapon.name;
    const options = materialOptions(actor,{exclude:actor.weapon});
    if (options.length < 2) return false;
    let selected;
    if (actor.is_ai) selected = [...options].sort((a,b) => cost(a)-cost(b)).slice(0,2);
    else {
      while (true) {
        const answer = String(await this.view.ask_line(`${equipment}：同时选择两张手牌或装备弃置，使这次杀继续造成伤害`, {
          kind:'choice',player_id:seat(this,actor),options:[...options.map(({id,label}) => ({id,label})),{id:'cancel',label:'放弃发动'}],
          meta:{equipment,stage:'materials',select_count:2,submit_join:' ',private_to:seat(this,actor)},
        })).trim();
        if (['cancel','0','pass','n'].includes(answer)) return false;
        const ids = answer.split(/\s+/);
        selected = ids.map(id => options.find(option => option.id === id));
        if (ids.length === 2 && new Set(ids).size === 2 && selected.every(Boolean)) break;
        emit(this,`请选择恰好两张不同的牌，不能弃置${equipment}本身。`);
      }
    }
    if (!await discardMaterials(this,actor,selected,equipment)) return false;
    if (!alive(actor) || !alive(target)) return false;
    emit(this,`${actor.name}发动${equipment}，原来的杀继续造成伤害。`);
    return true;
  },
  async equipment_replace_sha_damage(actor, target, context = {}) {
    if (!(weaponEffect(actor,'ice_sword') || weaponEffect(actor,'dragon_blade')) || !alive(target) || context.prevented || context.damage === 0 || this.equipment_sha_immunity(actor,target,context)) return false;
    const equipment = actor.weapon.name;
    const judgment = equipment_effect(actor.weapon) === 'dragon_blade';
    if (!materialOptions(target,{judgment}).length) return false;
    const options = [{id:'damage',label:'照常造成伤害'},{id:'replace',label:'放弃全部伤害，依次弃置目标至多两张牌'}];
    const selected = actor.is_ai ? options[(context.damage ?? 1) >= target.hp ? 0 : materialOptions(target,{judgment}).length >= 2 ? 1 : 0] : await choose(this,actor,equipment,'replace_damage',options);
    if (selected?.id !== 'replace') return false;
    emit(this,`${actor.name}发动${equipment}，放弃这次杀的全部伤害。`);
    for (let count = 0; count < 2; count += 1) {
      // Rebuild after every loss event: a new card drawn by the first loss is a
      // legal second choice. Only dragon blade includes judgment cards.
      const available = materialOptions(target,{hidden:true,judgment});
      if (!available.length || !alive(target)) break;
      const chosen = await choose(this,actor,equipment,`discard_${count+1}`,available);
      if (!chosen || !await discardMaterials(this,target,[chosen],equipment,context)) break;
    }
    return true;
  },
  async equipment_before_sha_damage(actor, target, context = {}) {
    if (!weaponEffect(actor,'dismount') || (context.damage ?? 1) <= 0) return false;
    const options = materialOptions(target,{horsesOnly:true});
    if (!options.length) return false;
    const chosen = await choose(this,actor,actor.weapon.name,'discard_horse',options,{optional:true});
    if (!chosen) return false;
    await discardMaterials(this,target,[chosen],actor.weapon.name,context);
    return true;
  },
  async equipment_after_sha_hit() { return false; },
};
