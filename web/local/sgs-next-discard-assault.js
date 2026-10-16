/** Mainland-mobile base identity 庞德 / 典韦, catalog snapshot 2026-10-15.
 * Historical licensed FAQ corroborates timing. Current-client parity is NOT
 * claimed. Host adaptations: docs/sgs-next-identity/discard-assault-contract.md.
 */
import {CardType,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const SGS_NEXT_DISCARD_ASSAULT_RULE_IDS=Object.freeze({pangde:'sgs.adapted.base.hero.pang-de',dianwei:'sgs.adapted.base.hero.dian-wei'});
export const SGS_NEXT_DISCARD_ASSAULT_SKILL_IDS=Object.freeze({mashu:'sgs.mashu',mengjin:'sgs.mengjin',qiangxi:'sgs.qiangxi'});
export const SGS_NEXT_DISCARD_ASSAULT_SOURCE=Object.freeze({
  variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',current_client_rules_verified:false,current_client_hp_verified:false,
  heroes:Object.freeze([
    Object.freeze({id:SGS_NEXT_DISCARD_ASSAULT_RULE_IDS.pangde,max_hp:4,gender:'male',source_faction:'群',skill_ids:Object.freeze(['sgs.mashu','sgs.mengjin']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_NEXT_DISCARD_ASSAULT_RULE_IDS.dianwei,max_hp:4,gender:'male',source_faction:'魏',skill_ids:Object.freeze(['sgs.qiangxi']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-39.html','https://www.sanguosha.cn/pc/hero-detail-34.html',
    'https://wiki.biligame.com/msgs/庞德','https://wiki.biligame.com/msgs/典韦','https://g.iqiyi.com/sanguosha/news/321021.html']),
});
const ID=SGS_NEXT_DISCARD_ASSAULT_RULE_IDS,SK=SGS_NEXT_DISCARD_ASSAULT_SKILL_IDS;
const slots=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const labels={weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'};
const live=p=>Boolean(p?.alive&&!p.dead&&p.hp>0);
const own=(a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&((a.effective_skill_ids??rule_hero(a)?.skill_ids)?.includes(skill)??rule_hero(a)?.id===ID[skill===SK.qiangxi?'dianwei':'pangde']);
const seat=(g,p)=>g.seat_of(p);
const identity=(g,p)=>g.player_id?.(p)??seat(g,p);
const stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
const continuing=g=>!g.winner&&(typeof g.resolution_should_continue==='function'?g.resolution_should_continue():typeof g.match_should_continue!=='function'||g.match_should_continue());
const pass=value=>['cancel','pass','0','n','no'].includes(String(value));
const select=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&o.id===m.id);
function state(g){
  const s=g.sgs_next_discard_assault_state??={version:1,counter:0,mengjin:{},qiangxi:{}};
  s.counter??=0;
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['mengjin','qiangxi'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS discard/assault receipt state');
  return s;
}
const requireMovement=g=>{if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('猛进/强袭需要 public_card_loss 的 validate / on_committed 原子边界');};
const meta=(g,a,skill,skill_id,stage,extra={})=>({skill,skill_id,stage,...extra});

/** Selection is face-blind for ALL hands, including allies. Merely displaying
 * or scoring this list never reads hand-card properties or allocates IDs/RNG.
 * Only the chosen card is subsequently exposed by the public discard. */
export function sgs_mengjin_options(_g,target){
  if(!live(target))return [];
  return [...target.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`暗置手牌 ${index+1}`,hidden:true})),
    ...slots.filter(slot=>target[slot]).map(slot=>({id:`eq:${slot}`,zone:slot,index:0,card:target[slot],label:`${labels[slot]}：${target[slot]}`,hidden:false}))];
}
const mengjinKey=(g,a,e)=>JSON.stringify([identity(g,a),e.card_use_id,e.branch_id]);
function mengjinWindow(g,a,target,e){
  return own(a,SK.mengjin)&&live(target)&&target!==a&&continuing(g)&&e?.kind==='sha'&&e.source===a&&e.card_user===a&&e.target===target
    &&is_sha_card(e.source_card??{})&&stable(e.card_use_id)&&stable(e.branch_id)&&Number.isSafeInteger(e.shans_required)&&e.shans_required>0
    &&e.shans_supplied===e.shans_required&&!e.cancelled&&!e.closed&&!e.response_only&&!e.immune;
}
export function sgs_mengjin_available(g,a,target,event={}){
  return mengjinWindow(g,a,target,event)&&!g.sgs_next_discard_assault_state?.mengjin?.[mengjinKey(g,a,event)]&&sgs_mengjin_options(g,target).length>0;
}
/** Public-only optional policy: do not help an enemy shed harmful equipment;
 * do not disrupt teammates. Blind hand position one is a deterministic choice. */
export function sgs_ai_mengjin_choice(g,a,target){
  if(g.side_of(a)===g.side_of(target))return null;
  const options=sgs_mengjin_options(g,target);
  const equipped=options.filter(o=>o.zone!=='hand'&&!['broken_halberd','bee_robe','mobile_female_dress','inferior_horse'].includes(o.card.trait)
    &&!(o.card.trait==='silver_lion'&&target.hp<(g.effective_max_hp?.(target)??rule_hero(target)?.max_hp)));
  return equipped.find(o=>o.zone==='armor')??equipped.find(o=>o.zone==='weapon')??equipped[0]??options.find(o=>o.zone==='hand')??null;
}
/** Called by the COMPLETE-Dodge boundary after responder effects and before
 * Axe/Blade. Receipt identity includes owner, use and final-target branch. */
export async function sgs_on_sha_dodged_mengjin(g,a,target,event={}){
  if(!sgs_mengjin_available(g,a,target,event))return false;
  requireMovement(g);
  const key=mengjinKey(g,a,event),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const receipt={owner_id:identity(g,a),target_id:identity(g,target),card_use_id:event.card_use_id,branch_id:event.branch_id,status:'offered',attempts:0};
  state(g).mengjin[key]=receipt;
  const valid=()=>mengjinWindow(g,a,target,event)&&rule_hero(a)?.id===form&&g.turn_event_counter===turn&&state(g).mengjin[key]===receipt;
  if(!a.is_ai){
    const accepted=await g.view.ask_confirm(`猛进：是否弃置${target.name}的一张手牌或装备？无需支付牌或判定。`,{
      player_id:seat(g,a),meta:meta(g,a,'猛进',SK.mengjin,'mengjin_start',{card_use_id:event.card_use_id,branch_id:event.branch_id,target_seat:seat(g,target),cost_count:0,judgment:false}),
    });
    if(!accepted||!valid()){receipt.status='passed';return false;}
  }
  try{
    while(valid()){
      const options=sgs_mengjin_options(g,target);if(!options.length)break;
      let chosen;
      if(a.is_ai)chosen=sgs_ai_mengjin_choice(g,a,target);
      else{
        const answer=await g.view.ask_line(`猛进：弃置${target.name}的一张牌（手牌不可见）`,{
          kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label,hidden})=>({id,label,hidden})),{id:'cancel',label:'取消，不弃牌'}],
          meta:meta(g,a,'猛进',SK.mengjin,'mengjin_card',{card_use_id:event.card_use_id,branch_id:event.branch_id,target_seat:seat(g,target),material_zones:['hand',...slots],hidden_hand:true,action:'discard'}),
        });
        if(pass(answer)){receipt.status='passed';return false;}chosen=select(options,answer);
        if(!chosen)continue;
      }
      if(!chosen)break;
      // Stale index/object never silently chooses another hand card. Human UI
      // returns to current blind options; an AI recomputes the public choice.
      if(!valid())break;
      if(!exact(sgs_mengjin_options(g,target),chosen))continue;
      receipt.status='reserved';
      const result=await g.public_card_loss(target,[chosen],{to:'discard',reason:'猛进',visibility:'public',action:'discard',source:a,source_skill:SK.mengjin,
        move_id:`sgs.mengjin:${key}:${++receipt.attempts}`,armor_ignored:false,armor_disabled:false,
        validate:()=>valid()&&receipt.status==='reserved'&&!!exact(sgs_mengjin_options(g,target),chosen),
        on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==chosen.card)throw Error('猛进必须弃置所选的一张实体牌');receipt.status='committed';receipt.move_id=movement.move_id;receipt.zone=chosen.zone;},
      });
      if(result?.committed){if(receipt.status!=='committed')throw Error('猛进缺少提交回执');receipt.status='ended';g.view.emit(`${a.name}发动猛进，弃置${target.name}的一张牌。`);return true;}
      if(result?.blocked){receipt.status='ended';receipt.blocked=true;return false;}
      // An invalid physical representation is not repairable by choosing that
      // same object again. Real stale movement returns to refreshed choices.
      receipt.status='offered';
      if(exact(sgs_mengjin_options(g,target),chosen)){receipt.status='unavailable';return false;}
    }
    receipt.status='unavailable';return false;
  }catch(error){receipt.status=receipt.status==='committed'?'failed_after_commit':'failed_before_commit';throw error;}
}

/** The genuine entered phase, never used_active_skills or turn-local flags. */
export function sgs_qiangxi_phase_key(g,a){
  const phase=a?.play_phase_id??g.play_phase_event_counter;
  return stable(phase)?JSON.stringify([identity(g,a),phase]):null;
}
const idlePlay=(g,a)=>own(a,SK.qiangxi)&&continuing(g)&&g.actual_turn_active!==false&&g.is_own_play_phase(a)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
export const sgs_qiangxi_materials=(g,a)=>live(a)?g.skill_material_options(a).filter(m=>m.card&&!m.card.virtual&&m.card.type===CardType.WEAPON&&(m.zone==='hand'||m.zone==='weapon')):[];
/** A null material selects HP loss. Weapon range is projected away BEFORE
 * legality/commit, without mutating live equipment or starting a card use. */
export function sgs_qiangxi_targets(g,a,material=null){
  if(!live(a))return [];
  const selected=material===null?null:exact(sgs_qiangxi_materials(g,a),material);if(material!==null&&!selected)return [];
  const after=selected?g.actor_after_material_cost(a,selected):a;
  return g.all_players().filter(p=>live(p)&&p!==a&&g.in_actual_attack_range(after,p));
}
function qiangxiAvailable(g,a,target=null,reserved=null){
  const key=sgs_qiangxi_phase_key(g,a),receipt=g.sgs_next_discard_assault_state?.qiangxi?.[key];
  if(!idlePlay(g,a)||!key||receipt&&receipt!==reserved)return false;
  const targets=sgs_qiangxi_targets(g,a);return target===null?targets.length>0:targets.includes(target);
}
export const sgs_qiangxi_available=(g,a,target=null)=>qiangxiAvailable(g,a,target);
export function sgs_qiangxi_unavailable_reason(g,a){
  if(!own(a,SK.qiangxi))return '当前没有可用的强袭技能';
  if(!idlePlay(g,a)||!sgs_qiangxi_phase_key(g,a))return '只能在自己的空闲出牌阶段发动';
  if(g.sgs_next_discard_assault_state?.qiangxi?.[sgs_qiangxi_phase_key(g,a)])return '本出牌阶段已发动强袭';
  return sgs_qiangxi_targets(g,a).length?'':'攻击范围内没有其他存活角色';
}
export async function sgs_resolve_qiangxi(g,a,target,material=null){
  if(!sgs_qiangxi_available(g,a,target)||!sgs_qiangxi_targets(g,a,material).includes(target))return false;
  const selected=material===null?null:exact(sgs_qiangxi_materials(g,a),material);if(material!==null&&!selected)return false;
  if(selected)requireMovement(g);
  const key=sgs_qiangxi_phase_key(g,a),form=rule_hero(a)?.id,turn=g.turn_event_counter,s=state(g);
  if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('SGS discard/assault event counter exhausted');
  const receipt={event_id:`sgs.qiangxi:${key}:attempt:${++s.counter}`,owner_id:identity(g,a),phase_key:key,target_id:identity(g,target),status:'reserved',cost:selected?'weapon':'hp',cost_zone:selected?.zone??null,paid:false,damage:0};
  s.qiangxi[key]=receipt;
  const valid=()=>sgs_qiangxi_phase_key(g,a)===key&&g.turn_event_counter===turn&&rule_hero(a)?.id===form&&qiangxiAvailable(g,a,target,receipt)
    &&sgs_qiangxi_targets(g,a,selected).includes(target)&&receipt.status==='reserved';
  try{
    if(selected){
      const result=await g.public_card_loss(a,[selected],{payment:true,to:'discard',reason:'强袭',visibility:'public',action:'discard',source_skill:SK.qiangxi,
        move_id:`${receipt.event_id}:weapon`,validate:valid,on_committed:(cards,movement)=>{
          if(cards.length!==1||cards[0]!==selected.card)throw Error('强袭必须弃置所选的一张实体武器');receipt.paid=true;receipt.status='committed';receipt.move_id=movement.move_id;
        },
      });
      if(!result?.committed){if(!receipt.paid)delete s.qiangxi[key];return false;}
      if(!receipt.paid)throw Error('强袭缺少提交回执；禁止再次支付');
    }else{
      if(!valid()){delete s.qiangxi[key];return false;}
      // Shared quota commits synchronously before HP deduction and any rescue.
      receipt.paid=true;receipt.status='committed';
      receipt.hp_lost=await g.lose_hp(a,1,{source:a,reason:'强袭',source_skill:SK.qiangxi,skill_cost:true});
    }
    // This is an ALREADY committed effect, not a new card use. Final source
    // death, form loss and seat-ring changes cannot cancel it. Match ending or
    // target final death can; never choose a substitute or refund the cost.
    if(live(target)&&continuing(g)){
      receipt.status='resolving_damage';
      receipt.damage=await g.apply_damage(target,1,{source:a,kind:'skill',method:'skill',nature:'normal',source_skill:SK.qiangxi,source_skill_id:SK.qiangxi,
        source_rule_id:ID.dianwei,source_card:null,physical_cards:[],card_user:null,armor_ignored:false,committed_skill_effect:true,
        damage_event_id:`${receipt.event_id}:damage`,message:'{name}受到强袭 {damage} 点伤害，剩余血量 {hp}。'});
    }
    receipt.status='ended';return true;
  }catch(error){receipt.status=receipt.paid?'failed_after_commit':'failed_before_commit';throw error;}
}
/** Pure AI policy uses only own costs and public opponent HP/count/equipment. */
export function sgs_ai_qiangxi_choice(g,a){
  if(!sgs_qiangxi_available(g,a))return null;
  const enemies=sgs_qiangxi_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>x.hp-y.hp||x.hand.length-y.hand.length);
  const materials=sgs_qiangxi_materials(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y));
  for(const target of enemies){
    const material=materials.find(m=>sgs_qiangxi_targets(g,a,m).includes(target));
    if(material)return {target,material};
    if(a.hp>1)return {target,material:null};
  }
  return null;
}
export async function sgs_ai_qiangxi(g,a){const choice=sgs_ai_qiangxi_choice(g,a);return choice?sgs_resolve_qiangxi(g,a,choice.target,choice.material):false;}
export async function sgs_player_qiangxi(g,a,_fallback,args=[]){
  if(!sgs_qiangxi_available(g,a)){g.view.emit(`强袭：${sgs_qiangxi_unavailable_reason(g,a)}。`);return true;}
  const key=sgs_qiangxi_phase_key(g,a),form=rule_hero(a)?.id,turn=g.turn_event_counter;
  const valid=()=>key===sgs_qiangxi_phase_key(g,a)&&form===rule_hero(a)?.id&&turn===g.turn_event_counter&&sgs_qiangxi_available(g,a);
  let material=null,chosen=false;
  if(args.length){
    if(args.length===1&&pass(args[0]))return true;
    if(args.length===1&&args[0]==='hp')chosen=true;
    else{
      const id=args.length===1&&/^\d+$/.test(args[0])?`hand:${Number(args[0])}`:args.length===2&&args[0]==='eq'?`eq:${g.normalize_equipment_slot(args[1])}`:null;
      material=sgs_qiangxi_materials(g,a).find(m=>m.id===id);if(!material)return false;chosen=true;
    }
  }
  while(!chosen&&valid()){
    const materials=sgs_qiangxi_materials(g,a).filter(m=>sgs_qiangxi_targets(g,a,m).length),options=[{id:'hp',label:'失去 1 点体力（可能进入濒死）'},...materials.map(({id,label})=>({id,label}))];
    const answer=await g.view.ask_line('强袭：失去 1 点体力，或弃置一张武器牌',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗体力、牌或次数'}],
      meta:meta(g,a,'强袭',SK.qiangxi,'qiangxi_cost',{private_to:seat(g,a),phase_key:key,material_zones:['hand','weapon'],weapon_only:true,hp_cost:1}),
    });
    if(pass(answer))return true;const choice=select(options,answer);if(!choice)continue;
    material=choice.id==='hp'?null:materials.find(m=>m.id===choice.id);chosen=true;
  }
  while(chosen&&valid()){
    const targets=sgs_qiangxi_targets(g,a,material);if(!targets.length)return true;
    const options=targets.map(p=>({id:seat(g,p),label:`${p.name}（${p.hp}血）`}));
    const answer=await g.view.ask_line('强袭：选择攻击范围内的另一名角色',{
      kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'取消，不消耗体力、牌或次数'}],
      meta:meta(g,a,'强袭',SK.qiangxi,'qiangxi_target',{phase_key:key,post_cost_range:true,cost:material?'weapon':'hp',cost_zone:material?.zone??null,allow_allies:true}),
    });
    if(pass(answer))return true;const choice=select(options,answer),target=targets.find(p=>seat(g,p)===choice?.id);if(!target)continue;
    if(valid())await sgs_resolve_qiangxi(g,a,target,material);return true;
  }
  return true;
}
export function sgs_next_discard_assault_skill_definitions({SkillHooks,ActiveSkillDef}){
  const qiangxi=new ActiveSkillDef({skill_id:'强袭',hotkey:'q',button_label:'强袭',available:sgs_qiangxi_available,player:sgs_player_qiangxi,ai:sgs_ai_qiangxi,
    help_text:'强袭：每出牌阶段一次，失去1点体力或弃一张手牌/装备区的武器，对攻击范围内另一名角色造成1点伤害；弃置的装备武器不提供距离'});
  qiangxi.owns_target_selection=true;qiangxi.targets=sgs_qiangxi_targets;qiangxi.unavailable_reason=sgs_qiangxi_unavailable_reason;
  return {hooks:{[ID.pangde]:SkillHooks({distance_modifier:-1,on_sha_dodged:[sgs_on_sha_dodged_mengjin]}),[ID.dianwei]:SkillHooks()},active:{[ID.dianwei]:[qiangxi]}};
}
