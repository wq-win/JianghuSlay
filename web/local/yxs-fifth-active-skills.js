import {rule_hero} from './effective-hero.js';
/** Source-closed historical YXS 李逵 / 褒姒. Shared rules and explicit
 * cross-game decisions are separated from source text in active-rules.md.
 * Canonical registration and source-identity merges belong to skills.js. */
import {Card,CardType,CardSuit} from './models.js';
import {ai_aoe_score} from './ai.js';

export const YXS_FIFTH_ACTIVE_RULE_IDS=Object.freeze({
  li:'yxs.adapted.base.hero.li-kui',bao:'yxs.adapted.base.hero.bao-si',
});
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const ownPlay=(game,actor)=>game.is_own_play_phase(actor)&&!actor.skip_play_stage;
const turnKey=(game,actor)=>`${game.turn_event_counter??0}:${game.seat_of(actor)}`;
const select=(options,value)=>options.find(o=>o.id===value)
  ??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const handMaterials=(game,actor)=>game.skill_material_options(actor).filter(m=>m.zone==='hand'&&!m.card.virtual);
const currentMaterials=(options,materials)=>materials.map(m=>options.find(o=>o.id===m?.id&&o.zone===m.zone&&o.card===m.card));
const validPair=materials=>materials.length===2&&materials.every(Boolean)&&new Set(materials.map(m=>m.card)).size===2;
const pairFromAnswer=(options,answer)=>String(answer).trim().split(/\s+/).filter(Boolean).map(v=>
  options.find(o=>o.id===(/^\d+$/.test(v)?`hand:${Number(v)}`:v)));

/** Collect the complete hand cost before moving any card. Neither an invalid
 * second selection nor Cancel can partially pay. Snapshot IDs reject stale UI. */
async function choosePair(game,actor,{skill,stage,args=[],cancellable=true}){
  const options=handMaterials(game,actor);
  if(args.length){const pair=pairFromAnswer(options,args.join(' '));return validPair(pair)?pair:false;}
  if(options.length<2)return null;
  while(true){
    const answer=String(await game.view.ask_line(`${skill}：选择两张不同手牌（编号空格分隔）${cancellable?'，或取消':''}`,{
      kind:'select_hand',player_id:game.seat_of(actor),min_count:2,max_count:2,
      options:[...options.map(({id,label})=>({id,label})),...(cancellable?[{id:'cancel',label:'取消，不消耗牌'}]:[])],
      meta:{skill,stage,private_to:game.seat_of(actor),owner_seat:game.seat_of(actor),material_zones:['hand'],cancellable},
    })).trim();
    if(cancellable&&['cancel','0'].includes(answer))return null;
    const pair=pairFromAnswer(options,answer);if(validPair(pair))return pair;
    game.view.emit('必须选择两张不同的手牌，装备不能支付此成本。');
  }
}

/** Called once after one actual positive damage event and its entire rescue
 * window, never per damage point. Declines are also receipts for this event. */
export async function yxs_after_damage_fuchou(game,actor,amount,source,event={}){
  const eligible=()=>actor.alive&&source?.alive&&game.all_players().includes(source)&&amount>0
    &&event.damage!==0&&(!event.target||event.target===actor)&&!['lose_hp','hp_loss'].includes(event.kind);
  if(!eligible())return false;
  const id=event.damage_event_id;
  if(id){
    actor.fuchou_damage_receipts??=[];
    if(actor.fuchou_damage_receipts.includes(id))return false;
    actor.fuchou_damage_receipts.push(id);
  }
  const accepted=actor.is_ai?(source===actor||game.side_of(actor)!==game.side_of(source)):
    await game.view.ask_confirm(`复仇：是否对伤害来源${source.name}判定？非红桃时，其弃两张手牌或受到你造成的1点伤害。`,{
      player_id:game.seat_of(actor),meta:{skill:'复仇',stage:'fuchou_start',damage_event_id:id,source_seat:game.seat_of(source)},
    });
  if(!accepted||!eligible())return false;
  const judgment=await game.reveal_judgment(actor,'复仇',{good_for:actor,favorable:c=>c.suit!==CardSuit.HEART});
  if(!judgment)return false;
  let success;
  try{success=game.effective_suit(judgment,actor,{judged_actor:actor})!==CardSuit.HEART;}
  finally{await game.finish_judgment_card(judgment);}
  if(!success){game.view.emit('复仇最终判定为红桃，无后续效果。');return true;}
  if(!eligible())return true;
  let discard=false;
  if(handMaterials(game,source).length>=2){
    if(source.is_ai)discard=source.hp<=2||source.hand.length>=4;
    else while(true){
      const answer=String(await game.view.ask_line(`复仇：弃两张手牌，或受到${actor.name}造成的1点伤害？`,{
        kind:'choice',player_id:game.seat_of(source),
        options:[{id:'discard',label:'弃两张手牌'},{id:'damage',label:'受到1点伤害'}],
        meta:{skill:'复仇',stage:'fuchou_source_choice',damage_event_id:id,source_seat:game.seat_of(actor),mandatory:true},
      })).trim();
      if(['discard','1'].includes(answer)){discard=true;break;}
      if(['damage','2'].includes(answer))break;
      game.view.emit('请选择弃两张手牌或受到伤害。');
    }
  }
  if(!eligible())return true;
  if(discard){
    const pair=source.is_ai?handMaterials(game,source).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b)).slice(0,2):
      await choosePair(game,source,{skill:'复仇',stage:'fuchou_discard',cancellable:false});
    if(!eligible())return true;
    const current=currentMaterials(handMaterials(game,source),pair??[]);
    if(validPair(current)&&await game.consume_material_batch(source,current,{to:'discard',reason:'复仇'})){
      game.view.emit(`${source.name}因复仇弃置两张手牌。`);return true;
    }
    // A stale or insufficient hand cannot pay a partial cost. The only other
    // source branch is damage; no equipment substitution and no one-card loss.
  }
  await game.apply_damage(source,1,{source:actor,card_user:null,kind:'retaliation',nature:'normal',
    source_skill:'yxs.fuchou',source_card:null,physical_cards:[],physical_materials:[],
    message:'{name}受到复仇造成的 {damage} 点伤害，剩余血量 {hp}。'});
  return true;
}

export const yxs_zhiyu_materials=handMaterials;
export function yxs_zhiyu_targets(game,actor){
  return game.all_players().filter(p=>p.alive&&p.hp<rule_hero(p).max_hp
    &&(game.effective_gender?game.effective_gender(p):rule_hero(p).gender)==='male');
}
export function yxs_zhiyu_available(game,actor,target=null){
  if(!ownPlay(game,actor)||actor.used_active_skills.has('治愈')||actor.zhiyu_turn_receipt===turnKey(game,actor)
    ||handMaterials(game,actor).length<2)return false;
  const targets=yxs_zhiyu_targets(game,actor);return target==null?targets.length>0:targets.includes(target);
}
export async function yxs_resolve_zhiyu(game,actor,target,materials){
  if(!yxs_zhiyu_available(game,actor,target)||!Array.isArray(materials))return false;
  const current=currentMaterials(handMaterials(game,actor),materials);if(!validPair(current))return false;
  const priorReceipt=actor.zhiyu_turn_receipt;
  actor.used_active_skills.add('治愈');actor.zhiyu_turn_receipt=turnKey(game,actor);
  const paid=await game.consume_material_batch(actor,current,{to:'discard',reason:'治愈'});
  if(!paid){actor.used_active_skills.delete('治愈');if(priorReceipt===undefined)delete actor.zhiyu_turn_receipt;else actor.zhiyu_turn_receipt=priorReceipt;return false;}
  if(!actor.alive)return true;
  // Cost-loss callbacks fully resolve before either recovery. A committed use
  // remains spent even if a nested effect kills a participant.
  const own=actor.alive?actor.heal(1):0,other=target.alive?target.heal(1):0;
  game.view.emit(`${actor.name}发动治愈，自己回复${own}点，${target.name}回复${other}点体力。`);
  return true;
}
export async function yxs_player_zhiyu(game,actor,_fallback,args=[]){
  if(!yxs_zhiyu_available(game,actor))return true;
  const turn=game.turn_event_counter,phase=game.play_phase_event_counter;
  const pair=await choosePair(game,actor,{skill:'治愈',stage:'zhiyu_materials',args});
  if(pair===false)return false;if(!pair)return true;
  const target=await game.choose_card_target(actor,yxs_zhiyu_targets(game,actor),{
    card_name:'治愈·受伤男性',stage:'zhiyu_target',cancellable:true,
  });
  if(target&&turn===game.turn_event_counter&&phase===game.play_phase_event_counter)await yxs_resolve_zhiyu(game,actor,target,pair);
  return true;
}
export async function yxs_ai_zhiyu(game,actor){
  if(!yxs_zhiyu_available(game,actor))return false;
  const target=yxs_zhiyu_targets(game,actor).filter(p=>game.side_of(p)===game.side_of(actor))
    .sort((a,b)=>a.hp-b.hp||(rule_hero(b).max_hp-b.hp)-(rule_hero(a).max_hp-a.hp))[0];
  if(!target)return false;
  const pair=handMaterials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b)).slice(0,2);
  return yxs_resolve_zhiyu(game,actor,target,pair);
}

export function yxs_fenghuo_card(){return new Card('烽火狼烟',CardType.SCROLL,{
  suit:null,color:null,rank:null,virtual:true,materials:[],source_skill:'yxs.fenghuo',
});}
export const yxs_fenghuo_materials=(game,actor)=>game.skill_material_options(actor).filter(m=>slots.includes(m.zone)&&!m.card.virtual);
export const yxs_fenghuo_targets=(game,actor)=>game.all_players().filter(p=>p!==actor&&p.alive);
export function yxs_fenghuo_available(game,actor){
  return ownPlay(game,actor)&&yxs_fenghuo_materials(game,actor).length>0&&yxs_fenghuo_targets(game,actor).length>0;
}
export async function yxs_resolve_fenghuo(game,actor,material){
  if(!yxs_fenghuo_available(game,actor))return false;
  const current=currentMaterials(yxs_fenghuo_materials(game,actor),[material])[0];if(!current)return false;
  const paid=await game.consume_material_batch(actor,[current],{to:'discard',reason:'烽火'});if(!paid)return false;
  if(!actor.alive)return true;
  const targets=yxs_fenghuo_targets(game,actor);if(!targets.length)return true;
  const virtual=yxs_fenghuo_card();
  game.view.emit(`${actor.name}弃置已装备的${current.card.name}发动烽火，视为使用烽火狼烟。`);
  // Never resolve_card: it would put the virtual view in a physical zone.
  // The discarded equipment is a COST, not the virtual trick's material.
  await game.resolve_scroll(actor,targets[0],virtual,{targets,allow_allies:true,source_skill:'yxs.fenghuo',
    use_provenance:{kind:'virtual',skill_id:'yxs.fenghuo',physical_cards:[]}});
  return true;
}
export async function yxs_player_fenghuo(game,actor,_fallback,args=[]){
  if(!yxs_fenghuo_available(game,actor))return true;
  const options=yxs_fenghuo_materials(game,actor),turn=game.turn_event_counter,phase=game.play_phase_event_counter;
  let material;
  if(args.length){
    const id=args.length===2&&args[0].toLowerCase()==='eq'?`eq:${game.normalize_equipment_slot(args[1])}`:
      args.length===1&&args[0].startsWith('eq:')?args[0]:null;
    if(!id)return false;material=options.find(o=>o.id===id);if(!material)return true;
  }else while(!material){
    const answer=String(await game.view.ask_line('烽火：弃置一张已装备的牌，使所有其他角色响应杀',{
      kind:'choice',player_id:game.seat_of(actor),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗装备'}],
      meta:{skill:'烽火',stage:'fenghuo_material',material_zones:slots,all_other_living:true},
    })).trim();
    if(['cancel','0'].includes(answer))return true;
    material=select(options,answer);if(!material)game.view.emit('只能选择已在装备区的实体牌。');
  }
  if(turn===game.turn_event_counter&&phase===game.play_phase_event_counter)await yxs_resolve_fenghuo(game,actor,material);
  return true;
}
export const yxs_ai_fenghuo_score=(game,actor)=>ai_aoe_score(game,actor,yxs_fenghuo_card());
export async function yxs_ai_fenghuo(game,actor){
  if(!yxs_fenghuo_available(game,actor)||yxs_ai_fenghuo_score(game,actor)<=0)return false;
  const material=yxs_fenghuo_materials(game,actor).sort((a,b)=>game.material_ai_cost(a)-game.material_ai_cost(b))[0];
  return yxs_resolve_fenghuo(game,actor,material);
}

export function yxs_fifth_active_skill_definitions({SkillHooks,ActiveSkillDef}){
  const zhiyu=new ActiveSkillDef({skill_id:'治愈',hotkey:'q',button_label:'治愈',
    help_text:'治愈：每回合一次，弃两张手牌，使自己和一名受伤男性各回复1；自己满血也可发动',
    player:yxs_player_zhiyu,ai:yxs_ai_zhiyu,available:yxs_zhiyu_available,
    arg_mode:'exactly_n',min_cards:2,max_cards:2,card_filter:'any'});
  zhiyu.targets=yxs_zhiyu_targets;zhiyu.owns_target_selection=true;
  const fenghuo=new ActiveSkillDef({skill_id:'烽火',hotkey:'w',button_label:'烽火',
    help_text:'烽火：弃一张已装备的牌，视为对所有其他存活角色使用烽火狼烟；可重复发动',
    player:yxs_player_fenghuo,ai:yxs_ai_fenghuo,available:yxs_fenghuo_available});
  fenghuo.targets=yxs_fenghuo_targets;fenghuo.owns_target_selection=true;
  return {hooks:{
    [YXS_FIFTH_ACTIVE_RULE_IDS.li]:SkillHooks({after_damage_resolved:[yxs_after_damage_fuchou]}),
    [YXS_FIFTH_ACTIVE_RULE_IDS.bao]:SkillHooks(),
  },active:{[YXS_FIFTH_ACTIVE_RULE_IDS.bao]:[zhiyu,fenghuo]}};
}
