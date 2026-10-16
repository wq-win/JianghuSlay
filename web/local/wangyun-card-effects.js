/** 王允 dependencies, pinned 2023-12-07 mobile core + disclosed Jianghu policies.
 * Explicit host integration only. No initial deck insertions or Card mutation.
 * See docs/wangyun/card-integration-contract.md before installing these methods.
 */
import {rule_hero} from './effective-hero.js';

const OFFICIAL = 'https://www.sanguosha.cn/pc/guide-info-163.html';
export const QIBAO_EQUIPMENT_ID = 'sgs.mobile.equipment.qibao.20231207';
export const QINGGANG_SOURCE_ID = 'sgs.base.equipment.qinggang';
const SHA_TYPES = new Set(['杀','火杀','雷杀','血杀','毒杀','刺杀']);
const GLOBAL_NAMES = new Set(['五谷丰登','桃园结义']);
const freeze = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
};
export const WANGYUN_TRICK_CATALOG = freeze([
  {id:'sgs.mobile.wangyun.meirenji',effect_id:'sgs.mobile.wangyun.meirenji',name:'美人计',target_mode:'other_male_with_hand',source_urls:[OFFICIAL],
    description:'其他有手牌男性为目标；女性依次获得其一张手牌，再交给使用者一张手牌。最后手牌较少者对较多者造成1点伤害。',
    adaptation_notes:'JH06：按行动序快照女性；目标空手后其余女性仍尝试给牌；女性使用者取得后自给为无操作。死亡与空手等边界是公开的江湖政策，未核实原生客户端。'},
  {id:'sgs.mobile.wangyun.xiaolicangdao',effect_id:'sgs.mobile.wangyun.xiaolicangdao',name:'笑里藏刀',target_mode:'other',source_urls:[OFFICIAL],
    description:'其他角色摸等于已损失体力值的牌，至多5张，然后受到使用者造成的1点普通伤害；满体力仍可成为目标。',
    adaptation_notes:'JH07：摸牌指令前计算当前已损失体力；完整等待摸牌触发，再检查存活并造成伤害。'},
  {id:'sgs.adapted.trick.amazing-grace',effect_id:'trick.amazing-grace',name:'五谷丰登',target_mode:'all',
    source_urls:['https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/110.html'],
    description:'对包括自己在内的所有合法角色使用。公开亮出存活人数张牌，各目标按行动序获得一张；无懈仅抵消当前目标，余牌弃置。',
    adaptation_notes:'采用官方共享基础效果，不引入国战专用无懈或队伍替代牌；行动序、牌库不足、死亡与清理沿用江湖事务规则。'},
  {id:'sgs.adapted.trick.god-salvation',effect_id:'trick.god-salvation',name:'桃园结义',target_mode:'all',
    source_urls:['https://guozhan.sanguosha.com/a/kapaiyilan/youxipai/jinnanpai/2013/0128/109.html'],
    description:'对包括自己在内的所有合法角色使用，各回复1点体力；满体力者没有回复量，无懈仅抵消当前目标。',
    adaptation_notes:'采用官方共享基础效果；通过中央回复事务触发正常回复技能，不直接改体力。'},
].map(row=>({...row,type:'锦囊',category:'trick',rule_type:'非延时锦囊',rule_timing:'自己的出牌阶段',
  source_game:'三国杀',source_variant:'2023移动版基础规则＋江湖边界处理',source_snapshot:'2026-10-15',
  rule_id:row.id,source_status:'pinned-primary-core-declared-host-policy',ordinary_deck:false,initial_random_deck_eligible:false,
  native_initial_deck_copies:GLOBAL_NAMES.has(row.name)?null:0,current_client_verified:false,full_source_mode_covered:false,
  intrinsic_per_phase_cap:null,range_limit:null,nullifiable:true})));
export const WANGYUN_TRICK_BY_NAME = Object.freeze(Object.fromEntries(WANGYUN_TRICK_CATALOG.map(row=>[row.name,row])));
export const QIBAO_RULES = freeze({
  id:QIBAO_EQUIPMENT_ID,equipment_id:QIBAO_EQUIPMENT_ID,rule_id:QIBAO_EQUIPMENT_ID,canonical_id:QIBAO_EQUIPMENT_ID,
  name:'七宝刀',ui_name:'七宝刀',type:'武器',category:'equipment',slot:'weapon',range:2,power:0,trait:'qibao',
  mechanism_key:'qibao',effect_id:'qibao',
  description:'锁定技：你使用杀无视目标防具；杀造成伤害时，若目标未损失体力，伤害+1。',
  source_game:'三国杀',source_variant:'移动版王允，官方2023-12-07基础规则＋JH11/JH12江湖政策',source_urls:[OFFICIAL],
  source_snapshot:'2026-10-15',ordinary_deck:false,normal_random_deck_eligible:false,native_initial_deck_copies:0,
  generation:'连计选中的实际基础青釭实体永久转换，保留实体ID、花色、点数与来源谱系。',
  permanent_identity:true,destroy_on_leave:false,revert_on_leave:false,current_client_verified:false,full_source_mode_covered:false,
  native_acquisition_verified:false,
});

const alive = p => Boolean(p?.alive && !p.dead);
const roster = g => g.all_players?.() ?? g.players ?? [];
const seat = (g,p) => {
  const id=g.player_id?.(p) ?? p?.player_id ?? g.seat_of?.(p);
  if (id == null || String(id).length===0) throw Error('王允牌效缺少稳定角色身份');
  return id;
};
const gender = (g,p) => g.effective_gender?.(p) ?? ({male:'male',female:'female',男:'male',女:'female'})[p?.gender_override ?? rule_hero(p)?.gender] ?? null;
const maxHp = p => Number(p?.max_hp ?? rule_hero(p)?.max_hp ?? 0);
const emit = (g,text,meta={}) => g.view?.emit?.(text,meta);
const method = (g,name) => {if(typeof g[name]!=='function')throw Error(`王允牌效接入缺少 ${name}`);};
const stable = (value,label) => {
  if (typeof value==='string' && value.trim() || typeof value==='number' && Number.isSafeInteger(value)) return value;
  throw Error(`王允牌效需要稳定${label}`);
};
const physicalId = (g,c) => stable(g.card_history_material_id?.(c) ?? c?.physical_id ?? c?.physicalCardId,'实体ID');
const actionOrder = g => [...(g.action_order?.() ?? roster(g))];
const sourceCardMaterials = (g,card) => g.physical_card_materials?.(card) ?? (card?.virtual ? card.materials ?? [] : card ? [card] : []);
const effectKey = (g,actor,target,card,options) => {
  const use=stable(options.card_use_id,'用牌ID');
  return JSON.stringify([use,options.branch_id ?? `target:${seat(g,target)}`,card.name]);
};
export function create_wangyun_card_state() { return {version:1,effects:{},globals:{}}; }
function state(g) {
  const s=g.wangyun_card_state ??= create_wangyun_card_state();
  if(s.version!==1 || !s.effects || !s.globals || Array.isArray(s.effects) || Array.isArray(s.globals))throw Error('王允牌效存档格式无效');
  return s;
}
const runtimes = new WeakMap();
function runtime(g) {let r=runtimes.get(g);if(!r)runtimes.set(g,r={pending:new Set()});return r;}
function sameRequest(receipt,request) { if(JSON.stringify(receipt.request)!==JSON.stringify(request))throw Error('同一王允牌效ID不能改换角色或牌'); }
/** Reentry is an acknowledged no-op, never a wait on one's own awaited hook.
 * A pending receipt without its runtime must be recovered by host action replay.
 */
async function once(g,key,request,body) {
  const s=state(g),r=runtime(g),old=s.effects[key];
  if(old){
    sameRequest(old,request);
    if(old.status==='done')return true;
    if(r.pending.has(key))return true;
    throw Error('王允牌效尚未完整结束；请从原动作日志恢复，不能重复执行');
  }
  const receipt=s.effects[key]={request,status:'pending',stage:'start'};r.pending.add(key);
  try {await body(receipt);receipt.stage='complete';receipt.status='done';return true;}
  catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}
  finally{r.pending.delete(key);}
}
function genericLegal(g,actor,target,card) {
  return !g.card_target_prohibited?.(actor,target,card) && (typeof g.can_trick_target!=='function' || g.can_trick_target(actor,target,card));
}
function request(g,actor,target,card) {return {actor:seat(g,actor),target:seat(g,target),name:card.name};}
function chooseAnswer(options,value) {
  const answer=String(value??'').trim();
  return options.find(o=>o.id===answer) ?? (/^\d+$/.test(answer)?options[Number(answer)-1]:null);
}
function cardValue(card,owner) {
  // Own hand or publicly revealed pool only; never invoke on someone else's hand.
  return ({桃:maxHp(owner)>owner.hp?9:7,闪:6,酒:4,杀:3,火杀:3,雷杀:3,血杀:3,毒杀:3,毒:-5}[card.type] ??
    (card.type==='锦囊'?5:card.type==='武器'&&!owner.weapon?5:2));
}
async function choosePhysical(g,chooser,source,{stage,reason,private_hand=false,blind=false,allowed=()=>true,ai_pick=null,meta={}}) {
  while(alive(chooser)) {
    const snapshot=source().filter(c=>!c.virtual);
    if(!snapshot.length || !allowed())return null;
    const options=snapshot.map((card,i)=>({id:`card:${i+1}`,label:blind?`未知手牌 ${i+1}`:String(card),card}));
    let chosen;
    if(chooser.is_ai) {
      if(blind){method(g.rng,'random');chosen=options[Math.min(options.length-1,Math.floor(g.rng.random()*options.length))];}
      else chosen=ai_pick?.(options) ?? [...options].sort((a,b)=>cardValue(b.card,chooser)-cardValue(a.card,chooser))[0];
    } else {
      method(g.view,'ask_line');
      const answer=await g.view.ask_line(reason,{kind:'choice',player_id:seat(g,chooser),options:options.map(({id,label,card})=>({id,label,...(!private_hand&&!blind?{card:{name:card.name,type:card.type,description:card.description,suit:card.suit,color:card.color,rank:card.rank,range:card.range,power:card.power,trait:card.trait,hidden:false}}:{})})),
        meta:{card_name:meta.card_name??'美人计',stage,...meta,...(private_hand||blind?{private_to:seat(g,chooser)}:{visibility:'public'})}});
      chosen=chooseAnswer(options,answer);
    }
    if(!alive(chooser)||!allowed())return null;
    if(chosen && source().includes(chosen.card))return chosen.card;
    emit(g,'选择已失效，请重新选择当前可用牌。',private_hand||blind?{private_to:seat(g,chooser)}:{});
  }
  return null;
}
async function privateTransfer(g,owner,recipient,card,move_id,reason) {
  if(!alive(owner)||!alive(recipient)||owner===recipient)return false;
  const index=owner.hand.indexOf(card);if(index<0)return false;
  method(g,'public_card_loss');
  const result=await g.public_card_loss(owner,[{zone:'hand',index,card}],{to:'hand',recipient,reason,visibility:'private',move_id,
    validate:()=>alive(owner)&&alive(recipient)&&owner.hand[index]===card});
  if(result.committed)emit(g,`${owner.name}向${recipient.name}转移了1张手牌。`);
  return result.committed;
}
async function deal(g,source,target,actor,card,options) {
  if(!alive(source)||!alive(target))return;
  method(g,'apply_damage');
  await g.apply_damage(target,1,{source,card_user:actor,kind:'scroll',nature:'normal',method:'direct_card_effect',
    source_card:card,damage_card_identity:options.damage_card_identity??g.damage_card_snapshot?.(card),card_use_id:options.card_use_id,branch_id:options.branch_id??`target:${seat(g,target)}`,
    source_skill:options.source_skill??card.source_skill??null,physical_cards:sourceCardMaterials(g,card),
    message:'{name}受到 {damage} 点普通伤害，剩余血量 {hp}。'});
}

/** Exact base source lineage only. Display names and mechanism similarity do
 * not establish 青釭 origin. The parent passes the permanent, non-copied face.
 */
export function is_qinggang_lineage(card) {
  if(!card || card.virtual || card.type!=='武器' || card.equipment_id===QIBAO_EQUIPMENT_ID || card.rule_id===QIBAO_EQUIPMENT_ID)return false;
  return [card.equipment_id,card.id,card.source_rule_id,card.source_record_id,...(card.alias_ids??[]),...(card.source_record_ids??[]),
    ...(card.source_aliases??[]).map(row=>row.id),...(card.source_records??[]).map(row=>row.id)].includes(QINGGANG_SOURCE_ID);
}
/** Code-owned adapter payload, NOT an instruction to mutate a frozen Card or
 * install a temporary copied face. Only host permanent-identity authority may
 * apply it to the already selected physical entity, before direct deck use.
 */
export function qibao_identity_patch(card) {
  if(!is_qinggang_lineage(card))throw Error('仅可转换具有基础青釭来源的实际武器');
  return {...QIBAO_RULES,template_id:QIBAO_EQUIPMENT_ID,mechanism_id:QIBAO_EQUIPMENT_ID,
    source_aliases:(card.source_aliases??[]).map(row=>({...row})),source_records:(card.source_records??[]).map(row=>({...row})),
    alias_ids:[...new Set([...(card.alias_ids??[]),QINGGANG_SOURCE_ID])],source_record_ids:[...new Set([...(card.source_record_ids??[]),QINGGANG_SOURCE_ID])],
    adaptation_notes:'JH11/JH12：连计永久改变已选实体的规则身份；UID、原印刷牌面、花色点数不变；不加入开局牌堆，不以临时奸雄复制表示。'};
}
export function qibao_active(actor) {return alive(actor)&&!actor.weapon_disabled&&actor.weapon?.type==='武器'&&
  [actor.weapon.equipment_id,actor.weapon.rule_id].includes(QIBAO_EQUIPMENT_ID);}
export function qibao_ignores_armor(actor,context={}) {
  return Boolean(qibao_active(actor)&&context.kind==='sha'&&!context.chain_transfer&&!context.transferred&&
    (!context.source_card||SHA_TYPES.has(context.source_card.type)));
}
export function qibao_sha_damage_bonus(actor,target,context={}) {
  return qibao_ignores_armor(actor,context)&&!context.source_bonus_applied&&alive(target)&&target.hp>=maxHp(target)?1:0;
}

export const wangyunCardMethods = {
  /** Card-specific rule only, suitable for composition inside can_trick_target. */
  can_wangyun_trick_target(actor,target,card,{resolution=false}={}) {
    if(!WANGYUN_TRICK_BY_NAME[card?.name])return false;
    if(!alive(target)||!resolution&&!alive(actor)||this.card_target_prohibited?.(actor,target,card))return false;
    if(GLOBAL_NAMES.has(card.name))return true;
    if(target===actor)return false;
    return card.name!=='美人计'||resolution||gender(this,target)==='male'&&target.hand.length>0;
  },
  wangyun_card_targets(actor,card) {
    return actionOrder(this).filter(target=>this.can_wangyun_trick_target(actor,target,card)&&genericLegal(this,actor,target,card));
  },
  async prepare_wangyun_card_use(actor,card,{target_filter=()=>true,source_skill_id=null}={}) {
    if(!WANGYUN_TRICK_BY_NAME[card?.name])return undefined;
    const candidates=this.wangyun_card_targets(actor,card).filter(target_filter);if(!candidates.length)return null;
    if(GLOBAL_NAMES.has(card.name))return {target:candidates[0],targets:candidates};
    if(actor.is_ai) {
      const enemies=candidates.filter(p=>!this.side_of||this.side_of(p)!==this.side_of(actor));
      // Public team, HP and hand counts only. Voluntary harmful use avoids allies.
      const choices=enemies.length?enemies:[];if(!choices.length)return null;
      const target=[...choices].sort((a,b)=>a.hp-b.hp || b.hand.length-a.hand.length)[0];return {target};
    }
    while(alive(actor)) {
      const targets=this.wangyun_card_targets(actor,card).filter(target_filter);if(!targets.length)return null;
      const options=targets.map(p=>({id:String(seat(this,p)),label:`${p.name}（${p.hp}体力，${p.hand.length}张手牌）`,target:p}));
      const answer=await this.view.ask_line(`${card.name}：选择其他${card.name==='美人计'?'有手牌的男性':''}角色`,{kind:'choice',player_id:seat(this,actor),
        options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗材料'}],meta:{card_name:card.name,stage:'wangyun_trick_target',private_to:seat(this,actor),...(source_skill_id?{skill_id:source_skill_id,source_skill_id}: {})}});
      if(['cancel','0'].includes(String(answer)))return null;
      const choice=chooseAnswer(options,answer);
      if(choice&&target_filter(choice.target)&&this.wangyun_card_targets(actor,card).includes(choice.target))return {target:choice.target};
    }
    return null;
  },
  /** Synchronous reveal before the FIRST target's counterspell window. */
  begin_wangyun_global_trick(actor,card,{card_use_id,targets}={}) {
    if(!GLOBAL_NAMES.has(card?.name))return null;
    const use=stable(card_use_id,'用牌ID'),key=JSON.stringify(use),s=state(this);
    const targetIds=(targets??this.wangyun_card_targets(actor,card)).map(p=>seat(this,p));
    const request={actor:seat(this,actor),name:card.name,targets:targetIds};
    if(s.globals[key]){sameRequest(s.globals[key],request);return s.globals[key];}
    const entry=s.globals[key]={request,card_use_id:use,status:'active',pool_ids:[],revealed_count:0};
    if(card.name==='五谷丰登') {
      const n=roster(this).filter(alive).length;
      const cards=this.deck.draw(n); // Reveal, not draw into any character's hand.
      this.processing_cards.push(...cards);
      entry.pool_ids=cards.map(c=>physicalId(this,c));entry.revealed_count=cards.length;
      emit(this,`五谷丰登公开亮出${cards.length}张牌：${cards.map(String).join('、')||'无牌'}。`,
        {card_name:card.name,stage:'harvest_reveal',visibility:'public',card_use_id:use});
    }
    return entry;
  },
  /** Safe in finally; never discards already acquired/recovered cards. */
  finish_wangyun_global_trick(card,{card_use_id}={}) {
    if(!GLOBAL_NAMES.has(card?.name))return false;
    const entry=state(this).globals[JSON.stringify(stable(card_use_id,'用牌ID'))];if(!entry)return false;
    if(entry.request.name!==card.name)throw Error('全体锦囊清理身份不一致');
    if(entry.status==='done')return true;
    for(const physical of [...this.processing_cards])if(entry.pool_ids.includes(physicalId(this,physical)))this.finish_processing_card(physical);
    entry.status='done';return true;
  },
  /** Install after ordinary target-confirmation, nullification and immunity.
   * options must retain card_use_id, branch_id, source_skill and material view.
   */
  async resolve_wangyun_card_effect(actor,target,card,options={}) {
    if(!WANGYUN_TRICK_BY_NAME[card?.name])return false;
    const key=effectKey(this,actor,target,card,options);
    return once(this,key,request(this,actor,target,card),async receipt=>{
      if(!alive(target))return;
      if(card.name==='美人计') {
        // Declaration restrictions are intentionally NOT re-applied after nullification.
        const women=actionOrder(this).filter(p=>alive(p)&&gender(this,p)==='female');
        receipt.participants=women.map(p=>seat(this,p));
        for(const [i,female] of women.entries()) {
          if(!alive(female))continue;
          receipt.stage=`female:${i}:obtain`;
          if(alive(target)&&target.hand.length) {
            const taken=await choosePhysical(this,female,()=>target.hand,{blind:true,stage:'meirenji_obtain',
              reason:`美人计：从${target.name}的手牌中获得一张（牌面未知）`,allowed:()=>alive(target),
              meta:{target_seat:seat(this,target),card_use_id:options.card_use_id}});
            if(taken)await privateTransfer(this,target,female,taken,`${key}:female:${i}:obtain`,'美人计·获得');
          }
          receipt.stage=`female:${i}:give`;
          if(!alive(female)||!alive(actor)||female===actor||!female.hand.length)continue;
          const allied=typeof this.side_of==='function'&&this.side_of(female)===this.side_of(actor);
          const given=await choosePhysical(this,female,()=>female.hand,{private_hand:true,stage:'meirenji_give',
            reason:`美人计：交给${actor.name}一张当前手牌`,allowed:()=>alive(actor),
            ai_pick:options=>[...options].sort((a,b)=>(allied?-1:1)*(cardValue(a.card,female)-cardValue(b.card,female)))[0],
            meta:{target_seat:seat(this,actor),card_use_id:options.card_use_id}});
          if(given)await privateTransfer(this,female,actor,given,`${key}:female:${i}:give`,'美人计·交给');
        }
        receipt.stage='compare';
        if(alive(actor)&&alive(target)&&actor.hand.length!==target.hand.length) {
          const [source,receiver]=actor.hand.length<target.hand.length?[actor,target]:[target,actor];
          receipt.damage_source=seat(this,source);receipt.damage_target=seat(this,receiver);
          await deal(this,source,receiver,actor,card,options);
        }
      } else if(card.name==='笑里藏刀') {
        receipt.stage='draw';receipt.draw_count=Math.min(5,Math.max(0,maxHp(target)-target.hp));
        if(receipt.draw_count)await this.draw_cards(target,receipt.draw_count);
        receipt.stage='damage';if(alive(actor)&&alive(target))await deal(this,actor,target,actor,card,options);
      } else if(card.name==='桃园结义') {
        method(this,'recover_hp');receipt.stage='recover';
        await this.recover_hp(target,1,{source:actor,source_skill:options.source_skill??card.source_skill??null,
          source_card:card,card_use_id:options.card_use_id,branch_id:options.branch_id,
          recovery_event_id:`${key}:recover`});
      } else {
        const entry=state(this).globals[JSON.stringify(options.card_use_id)];
        if(!entry||entry.request.name!==card.name||entry.status!=='active')throw Error('五谷丰登必须先公开亮牌，且不能重新结算已清理牌池');
        if(!entry.request.targets.includes(seat(this,target)))throw Error('五谷丰登角色不在已确认目标中');
        const available=()=>this.processing_cards.filter(c=>entry.pool_ids.includes(physicalId(this,c)));
        receipt.stage='choose';
        const selected=await choosePhysical(this,target,available,{stage:'harvest_choose',reason:'五谷丰登：选择一张公开的牌加入手牌',
          meta:{card_name:card.name,card_use_id:options.card_use_id}});
        if(selected&&alive(target)) {
          const index=this.processing_cards.indexOf(selected);if(index<0)return;
          method(this,'public_card_loss');receipt.stage='obtain';
          await this.public_card_loss(null,[{zone:'processing',index,card:selected}],{to:'hand',recipient:target,reason:'五谷丰登',visibility:'public',
            poison_exempt:true,move_id:`${key}:obtain`,source:actor,source_zone:'processing',validate:()=>alive(target)&&this.processing_cards[index]===selected});
        }
      }
    });
  },
  qibao_ignores_armor(actor,context={}) {return qibao_ignores_armor(actor,context);},
  qibao_sha_damage_bonus(actor,target,context={}) {return qibao_sha_damage_bonus(actor,target,context);},
};
