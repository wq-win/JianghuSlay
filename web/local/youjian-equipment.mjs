import {rule_hero} from './effective-hero.js';
/** Independent mobile Youjian equipment hooks. Host integration is intentionally
 * explicit: never patch Game, register a deck, or move a physical card here.
 * Every paid/forced loss goes through the host's atomic public_card_loss.
 * See docs/youjian/gear-rules.md for event ordering and local compatibility.
 */
import {YOUJIAN_EQUIPMENT_PACK_ID, youjian_equipment_definition, youjian_equipment_enabled} from './youjian-equipment-catalog.mjs';

export const YOUJIAN_EQUIPMENT_SLOTS = Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SHA_TYPES = new Set(['杀','火杀','雷杀','血杀','毒杀','刺杀']);
const alive = owner => !!owner?.alive && !owner.dead;
const seat = (game, owner) => game.seat_of?.(owner) ?? owner?.name;
const emit = (game, text) => game.view?.emit?.(text);
const positive = value => Number.isFinite(Number(value)) ? Math.max(0,Number(value)) : 0;
const isSha = context => context?.kind === 'sha' || SHA_TYPES.has(context?.source_card?.type);
const pendingByGame = new WeakMap();
const receiptKey = (...parts) => JSON.stringify(parts);
function eventId(value, label) {
  if (!['string','number'].includes(typeof value) || String(value).length === 0) throw Error(`用间装备缺少稳定${label}`);
  return value;
}
function active(game, owner, slot, trait, context = {}) {
  if (!alive(owner) || owner.equipment_disabled || owner[`${slot}_disabled`]) return false;
  if (slot === 'armor' && (context.armor_ignored || context.armor_disabled)) return false;
  const card = owner[slot];
  return youjian_equipment_enabled(card,game.content_packs) && youjian_equipment_definition(card)?.trait === trait;
}
/** Serializable completed receipts; promises alone are process-local. A loaded
 * unresolved receipt must be resumed by the host transaction, never replay paid
 * costs. Failed/uncertain events fail closed rather than double-spend. */
async function once(game, key, resolve) {
  const receipts = game.youjian_equipment_receipts ??= {};
  let pending = pendingByGame.get(game);
  if (!pending) pendingByGame.set(game,pending = new Map());
  if (pending.has(key)) return pending.get(key);
  if (Object.hasOwn(receipts,key)) {
    if (receipts[key].status === 'done') return receipts[key].result;
    throw Error('用间装备事件尚未完成，须由宿主恢复原事务，不能重复结算');
  }
  receipts[key] = {status:'pending'};
  const promise = Promise.resolve().then(resolve).then(result => {
    receipts[key] = {status:'done',result}; return result;
  });
  pending.set(key,promise);
  try { return await promise; } finally { pending.delete(key); }
}
function requireMethod(game, method) {
  if (typeof game[method] !== 'function') throw Error(`用间装备接入缺少 ${method}`);
}
async function discard(game, owner, materials, reason, move_id, context = {}) {
  requireMethod(game,'public_card_loss'); requireMethod(game,'flush_card_events');
  const result = await game.public_card_loss(owner,materials,{...context,to:'discard',reason,move_id,visibility:'public'});
  await game.flush_card_events();
  if (!result || typeof result.committed !== 'boolean') throw Error('public_card_loss 必须返回 {committed:boolean,move_id}');
  return result.committed;
}
function handOptions(game, owner) {
  return (owner.hand ?? []).map((card,index) => ({zone:'hand',index,card,id:`hand:${index+1}`,label:`手牌${index+1}：${card}`}))
    .filter(option => game.can_discard_card?.(owner,option.card,{zone:'hand',reason:'倚天剑'}) !== false);
}
async function chooseYitian(game, owner, event) {
  if (owner.is_ai) {
    if (owner.hp >= (rule_hero(owner)?.max_hp??owner.max_hp)) return null;
    const value = option => ({桃:6,闪:4,酒:3,杀:2,血杀:2,毒杀:2}[option.card.type] ?? 1);
    return handOptions(game,owner).filter(option=>option.card.type!=='毒').sort((a,b)=>value(a)-value(b))[0] ?? null;
  }
  requireMethod(game.view ?? {},'ask_line');
  while (alive(owner)) {
    const options = handOptions(game,owner);
    if (!options.length) return null;
    const answer = String(await game.view.ask_line('倚天剑：可弃置一张手牌，再回复1点体力（弃毒先结算流失及救援）',{
      kind:'choice',player_id:seat(game,owner),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'放弃发动'}],
      meta:{equipment:'倚天剑',stage:'discard_then_heal',private_to:seat(game,owner),damage_event_id:event.damage_event_id},
    })).trim();
    if (['cancel','0','pass','n'].includes(answer)) return null;
    const selected = options.find(option=>option.id===answer) ?? (/^\d+$/.test(answer) ? options[Number(answer)-1] : null);
    if (selected) return selected;
    emit(game,'请选择有效手牌，或放弃发动。');
  }
  return null;
}

export const youjianEquipmentMethods = {
  /** Call only after actual entry and completion of old same-slot replacement.
   * entry_id identifies this entry, not the physical card's lifetime. */
  async youjian_on_enter(owner, card, {slot = null,entry_id = null} = {}) {
    if (slot !== 'weapon' || youjian_equipment_definition(card)?.trait !== 'seven_star_blade'
      || !youjian_equipment_enabled(card,this.content_packs)) return {activated:false,discarded:0};
    const key = receiptKey('qixing',eventId(entry_id,'入场ID'),seat(this,owner));
    return once(this,key,async () => {
      if (!active(this,owner,'weapon','seven_star_blade') || owner.weapon !== card) return {activated:false,discarded:0};
      const materials = YOUJIAN_EQUIPMENT_SLOTS.filter(zone=>owner[zone] && owner[zone] !== card)
        .map(zone=>({zone,index:0,card:owner[zone]}));
      for (const [index,other] of (owner.judgment_cards ?? []).entries()) if (other !== card) materials.push({zone:'judgment',index,card:other});
      if (!materials.length) return {activated:true,discarded:0};
      const committed = await discard(this,owner,materials,'七星宝刀',`${key}:loss`,{entry_id});
      if (committed) emit(this,`${owner.name}的七星宝刀入场，弃置其他装备与判定区共${materials.length}张牌。`);
      return {activated:committed,discarded:committed ? materials.length : 0};
    });
  },

  /** Required target branch context; invoke after target confirmation, before
   * dodge/immunity resolution. A separate context is required for each target. */
  async youjian_on_sha_target(source, target, context = {}) {
    if (!isSha(context) || context.chain_transfer || context.kind === 'chain') return 0;
    const target_id = seat(this,target);
    if (context.youjian_sha_branch && (context.youjian_sha_branch.target_id !== target_id
      || context.youjian_sha_branch.card_use_id !== context.card_use_id)) throw Error('女装不能跨杀或跨目标复用分支上下文');
    if (!active(this,target,'armor','mobile_female_dress',context)
      && !context.youjian_sha_branch) return 0;
    const key = receiptKey('nvzhuang',eventId(context.card_use_id,'杀使用ID'),target_id);
    const result = await once(this,key,async () => {
      const gender = this.effective_gender ? this.effective_gender(target) : rule_hero(target)?.gender;
      if (!active(this,target,'armor','mobile_female_dress',context) || !['male','男'].includes(gender)) return {bonus:0,color:null};
      requireMethod(this,'reveal_judgment'); requireMethod(this,'finish_judgment_card'); requireMethod(this,'flush_card_events');
      let judgment = null, color = null;
      try {
        judgment = await this.reveal_judgment(target,'女装',{good_for:target,favorable:card=>card.color==='红'});
        color = judgment ? this.effective_color?.(judgment,target,{judged_actor:target}) ?? judgment.color : null;
      } finally {
        if (judgment) await this.finish_judgment_card(judgment);
        await this.flush_card_events();
      }
      const bonus = color === '黑' || color === 'black' ? 1 : 0;
      emit(this,`${target.name}女装判定${bonus ? '为黑色，该杀对这个目标分支伤害+1' : '未判黑，不增加伤害'}。`);
      return {bonus,color};
    });
    context.youjian_sha_branch = {card_use_id:context.card_use_id,target_id,nvzhuang_bonus:result.bonus,judgment_color:result.color};
    return result.bonus;
  },
  /** Pure preview; add once at the branch's pre-defense amount, before any
   * transfer. Chain inherits actual damage, so it must never add this again. */
  youjian_sha_branch_bonus(context = {}) {
    const branch = context.youjian_sha_branch;
    return !context.chain_transfer && !context.youjian_branch_bonus_applied && isSha(context)
      && branch && branch.card_use_id === context.card_use_id && branch.nvzhuang_bonus === 1 ? 1 : 0;
  },
  /** Use only once the branch amount is committed, not for UI/AI previews.
   * Transfer contexts copy youjian_branch_bonus_applied with their input amount. */
  youjian_apply_sha_branch_bonus(amount, context = {}) {
    const damage = positive(amount);
    if (context.prevented) return 0;
    if (!damage) return damage;
    const bonus = this.youjian_sha_branch_bonus(context);
    if (bonus) context.youjian_branch_bonus_applied = true;
    return damage + bonus;
  },

  youjian_modify_damage(target, amount, context = {}) {
    const damage = context.prevented ? 0 : positive(amount);
    return damage > 0 && context.source_card?.type === '锦囊'
      && active(this,target,'armor','bee_robe',context) ? damage + 1 : damage;
  },
  /** Host captures this BEFORE simultaneous detachment, once per movement batch. */
  youjian_poison_armor_snapshot(owner, context = {}) {
    return !!owner&&!owner.dead&&!owner.equipment_disabled&&!owner.armor_disabled&&!context.armor_disabled&&!context.armor_ignored&&youjian_equipment_enabled(owner.armor,this.content_packs)&&youjian_equipment_definition(owner.armor)?.trait==='bee_robe';
  },
  youjian_modify_hp_loss(target, amount, context = {}) {
    const loss = positive(amount);
    if (context.kind === 'poison_basic' && (context.poison_prevented || context.prevented)) return 0;
    if (!loss || !target || target.dead || context.kind !== 'poison_basic') return loss;
    const enabled = Array.isArray(this.content_packs) && this.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID);
    const robe = enabled && (typeof context.youjian_poison_armor_snapshot === 'boolean'
      ? context.youjian_poison_armor_snapshot : this.youjian_poison_armor_snapshot(target,context));
    return robe ? loss + 1 : loss;
  },

  /** Call for each positive actual SHA-derived damage event AFTER victim hooks,
   * retaliation and rescue. Do not require the victim to have survived. */
  async youjian_after_damage(event) {
    const owner = event?.source;
    if (!(event?.damage > 0) || !owner || !isSha(event)
      || !(event.kind === 'sha' || event.kind === 'chain' && SHA_TYPES.has(event.source_card?.type))) return {activated:false,healed:0};
    if (!youjian_equipment_enabled(owner.weapon,this.content_packs)) return {activated:false,healed:0};
    const key = receiptKey('yitian',eventId(event.damage_event_id,'伤害ID'),seat(this,owner));
    return once(this,key,async () => {
      if (!active(this,owner,'weapon','heaven_sword') || !handOptions(this,owner).length) return {activated:false,healed:0};
      const weapon = owner.weapon, selected = await chooseYitian(this,owner,event);
      if (!selected || !active(this,owner,'weapon','heaven_sword') || owner.weapon !== weapon) return {activated:false,healed:0};
      const current = handOptions(this,owner).find(option=>option.card===selected.card);
      if (!current) return {activated:false,healed:0};
      if (!await discard(this,owner,[current],'倚天剑',`${key}:cost`,{damage_event_id:event.damage_event_id,source_card:event.source_card})) return {activated:false,healed:0};
      // Once committed, losing this sword does not undo the paid effect. Final
      // death does: hp-loss rescue must finish before the survival check/heal.
      if (!alive(owner)) return {activated:true,healed:0};
      requireMethod(owner,'heal');
      const healed = owner.heal(1);
      emit(this,`${owner.name}发动倚天剑，弃置1张手牌后回复${healed}点体力。`);
      return {activated:true,healed};
    });
  },

  /** Generic horse ±1 uses catalog power in the host's normal distance formula.
   * Query this fixed override BEFORE that formula. Armor ignore never blocks it. */
  youjian_fixed_distance(actor, target) {
    return actor !== target && active(this,target,'offensive_horse','inferior_horse') ? 1 : null;
  },
  /** Check at gift resolution, BEFORE replacing any target equipment. The host
   * sends the already-committed physical gift to discard when true. */
  youjian_gift_blocked(target, {action = null,source = null} = {}) {
    return action === 'gift' && source !== target && active(this,target,'defensive_horse','war_elephant');
  },
};
