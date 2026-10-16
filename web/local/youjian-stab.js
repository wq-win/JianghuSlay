/** Isolated historical mobile 刺杀 response branch; deliberately unregistered.
 * The host owns responses, final dodge/weapon hooks and the ORIGINAL damage.
 * See docs/youjian-cards/stab-integration-contract.md for the integration gate.
 */
import {is_youjian_poison} from './youjian-card-events.js';

const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const live=p=>Boolean(p?.alive&&!p.dead);
const stable=v=>typeof v==='string'&&v.trim()!==''||typeof v==='number'&&Number.isSafeInteger(v)&&!Object.is(v,-0);
const fail=message=>{throw Error(`刺杀响应：${message}`);};
const requireMethod=(object,name)=>{if(typeof object?.[name]!=='function')fail(`缺少宿主 ${name}`);};
const pendingByGame=new WeakMap();
function runtime(g){let state=pendingByGame.get(g);if(!state)pendingByGame.set(g,state=new Map());return state;}
function state(g){
  const s=g.youjian_stab_state??={version:1,branches:{}};
  if(s.version!==1||!s.branches||typeof s.branches!=='object'||Array.isArray(s.branches))fail('无效的序列化状态');
  return s;
}
const seat=(g,p)=>{const id=g.seat_of(p);if(!stable(id))fail('角色需要稳定座位 ID');return id;};
function physicalId(g,card){
  if(!card||card.virtual)fail('弃牌及伤害素材必须为真实实体');
  const id=card.physical_id??card.physicalCardId??card.derived_identity??g.card_history_material_id?.(card);
  if(!stable(id))fail('实体需要稳定 physical_id 或 card_history_material_id');
  return id;
}

export const YOUJIAN_STAB_TYPE='刺杀';
export const YOUJIAN_STAB_CATALOG=freeze({
  id:'sgs.mobile.youjian.cisha.20200921',rule_id:'sgs.mobile.youjian.cisha.20200921',
  canonical_id:'sgs.mobile.youjian.cisha.20200921',effect_id:'basic.youjian.cisha',
  name:YOUJIAN_STAB_TYPE,type:YOUJIAN_STAB_TYPE,category:'basic',family:'sha',nature:'normal',power:1,range:1,trait:'',
  description:'杀家族：所需闪及响应触发全部结算后，若目标有手牌，其须弃置一张手牌，否则此杀仍命中；此时空手则直接闪避。',
  response_use:['sha'],response_play:['sha'],response_play_has_stab_effect:false,
  quota:'shared_sha',frequency_limit:null,extra_action_quota:0,recast:false,nullification:false,
  bypasses_ordinary_sha_vine:true,black_blocked_by_renwang:true,ordinary_sha_only_conversion:false,
  source_game:'三国杀',source_variant:'mobile-20200921-core; S0076-physical-supplement; MOBILE2023-secondary; Jianghu-YJ01-YJ03-YJ12',
  source_snapshot:'2026-10-15',source_urls:['https://www.sanguosha.cn/pc/news-detail-882.html','https://www.bilibili.com/opus/909701299122995221','https://www.bilibili.com/opus/730689441788592137'],
  core_effect_verified:true,current_client_verified:false,all_mobile_interactions_verified:false,
  native_source_deck_complete:false,full_six_player_identity_mode:false,
  compatibility_ids:['YJ01','YJ02','YJ03','YJ12'],implementation_status:'isolated_response_branch_complete_not_registered',selectable:false,
  source_mechanism_signature_sha256:'055d7a91f779db6bec86a9db1af7a579696ff5319416eaf8c87c03f2f9f1a560',
  physical_faces:[...[6,7,8].map(rank=>({suit:'黑桃',rank,gift_mark:false})),...[2,6,7,8,9,10].map(rank=>({suit:'梅花',rank,gift_mark:false})),{suit:'方块',rank:13,gift_mark:false}],
});

/** Effective function type is authoritative. A printed name, damage nature or
 * forged effect_id must never reattach 刺 to a converted 闪/ordinary 杀. */
export const is_youjian_stab=card=>card?.type===YOUJIAN_STAB_TYPE;
export function youjian_stab_definition(cardOrName){
  return typeof cardOrName==='string'
    ? [YOUJIAN_STAB_TYPE,YOUJIAN_STAB_CATALOG.id,YOUJIAN_STAB_CATALOG.effect_id].includes(cardOrName)?YOUJIAN_STAB_CATALOG:null
    : is_youjian_stab(cardOrName)?YOUJIAN_STAB_CATALOG:null;
}

function handOptions(g,target){
  const rows=target.hand.flatMap((card,index)=>{
    if(card.virtual||g.youjian_stab_discard_allowed?.(target,card,{zone:'hand',action:'discard'})===false)return [];
    return [{id:`hand:${index+1}`,zone:'hand',index,card,physical_id:physicalId(g,card),label:`弃置手牌 ${index+1}：${card}`}];
  });
  if(new Set(rows.map(m=>m.card)).size!==rows.length||new Set(rows.map(m=>JSON.stringify(m.physical_id))).size!==rows.length)fail('手牌存在重复实体，不能伪造弃牌');
  return rows;
}
/** The deciding defender can inspect ONLY its own hand. No attacker/ally hand
 * or rescue capability is queried. Public HP/armor inform poison risk. */
export function youjian_stab_ai_choice(g,target,options,{damage=1}={}){
  if(!(damage>0))return null;
  const ordinary=options.filter(m=>!is_youjian_poison(m.card));
  const cost=m=>({'桃':6,'闪':4,'酒':3,'杀':2,'刺杀':2,'血杀':2,'毒杀':2,'火杀':2,'雷杀':2}[m.card.type]??1);
  if(ordinary.length)return [...ordinary].sort((a,b)=>cost(a)-cost(b)||a.index-b.index)[0];
  const loss=g.youjian_modify_hp_loss?.(target,1,{kind:'poison_basic',reason:'毒',source:null})??1;
  return loss<damage&&loss<target.hp?options.find(m=>is_youjian_poison(m.card))??null:null;
}
function finish(r,outcome,reason){
  r.stage='complete';r.status='done';
  return r.result=freeze({outcome,reason,receipt_id:r.receipt_id,card_use_id:r.request.card_use_id,branch_id:r.request.branch_id,paid:r.paid});
}
async function resolve(g,actor,target,damage,context,counts,r){
  if(!live(target))return finish(r,'stop','target_unavailable');
  if(counts.supplied<counts.required)return finish(r,'hit','incomplete_responses');
  while(live(target)){
    // Observe the hand AFTER every actual/virtual response and its awaited hooks.
    if(target.hand.length===0)return finish(r,'dodge','empty_hand');
    const options=handOptions(g,target);
    if(!options.length)return finish(r,'hit','no_legal_hand_cost');
    let selected;
    r.stage='choose_hand_cost';r.prompt_count++;
    if(target.is_ai){
      selected=youjian_stab_ai_choice(g,target,options,{damage:counts.estimated_damage??damage});
      r.choices.push({kind:'ai',physical_id:selected?.physical_id??null,decision:selected?'discard':'hit'});
    }else{
      requireMethod(g.view,'ask_line');
      const answer=String(await g.view.ask_line('刺杀：弃置一张手牌以保留闪避，或不弃牌并让原刺杀命中。',{
        kind:'choice',player_id:seat(g,target),min_count:1,max_count:1,
        options:[...options.map(({id,label})=>({id,label})),{id:'hit',label:'不弃牌，承受原刺杀'}],
        meta:{card_name:YOUJIAN_STAB_TYPE,stage:'youjian_stab_hand_cost',private_to:seat(g,target),
          card_use_id:r.request.card_use_id,branch_id:r.request.branch_id,receipt_id:r.receipt_id,
          response_required:counts.required,response_supplied:counts.supplied,material_zones:['hand'],damage},
      })).trim();
      r.choices.push({kind:'human',answer});
      if(!live(target))return finish(r,'stop','target_unavailable');
      // A dynamic hand change invalidates a selected entity, never substitutes
      // whatever now occupies its former index. An emptied hand dodges freely.
      if(target.hand.length===0)return finish(r,'dodge','empty_hand');
      if(['hit','0','cancel','pass','n'].includes(answer))return finish(r,'hit','refused');
      selected=options.find(m=>m.id===answer)??(/^\d+$/.test(answer)?options[Number(answer)-1]:null);
      if(!selected){g.view.emit?.('请选择恰好一张当前手牌，或承受原刺杀。',{private_to:seat(g,target)});continue;}
    }
    if(!selected)return finish(r,'hit','refused');
    if(!live(target))return finish(r,'stop','target_unavailable');
    const index=target.hand.indexOf(selected.card);
    if(index<0||g.youjian_stab_discard_allowed?.(target,selected.card,{zone:'hand',action:'discard'})===false)continue;
    requireMethod(g,'public_card_loss');
    if(g.public_card_loss_supports_on_committed!==true)fail('宿主必须支持原子移牌 on_committed 回执');
    const move_id=`${r.receipt_id}:discard:${++r.move_attempts}`;
    r.selected={physical_id:selected.physical_id,zone:'hand',index};r.move_id=move_id;r.stage='settling_discard';
    const result=await g.public_card_loss(target,[{zone:'hand',index,card:selected.card}],{
      to:'discard',visibility:'public',reason:'刺杀闪后弃牌',action:'discard',poison_exempt:false,move_id,
      card_use_id:r.request.card_use_id,branch_id:r.request.branch_id,stab_receipt_id:r.receipt_id,
      // Do not pass attack source/material/kind into this independent HP loss.
      on_committed:()=>{r.paid=true;},
    });
    if(!result?.committed){
      r.selected=null;r.move_id=null;r.stage='revalidate';
      if(target.hand.includes(selected.card)&&g.youjian_stab_discard_allowed?.(target,selected.card,{zone:'hand',action:'discard'})!==false)fail('宿主拒绝仍有效的实体弃牌；需修复区域不变量后从动作日志重建');
      continue;
    }
    r.paid=true;r.stage='discard_settled';
    if(!live(target))return finish(r,'stop','target_died_during_cost');
    g.view?.emit?.(`${target.name}为刺杀弃置一张手牌，保留此次闪避。`);
    return finish(r,'dodge','paid');
  }
  return finish(r,'stop','target_unavailable');
}

export const youjianStabMethods={
  /** Insert after required responses and hooks; do not call per 闪. This method
   * returns an outcome; it NEVER applies damage, opens a new attack, grants final
   * dodge hooks, offers a weapon prompt, records use history, or charges quota.
   * Active/forced SHA context and its original physical material references stay
   * unchanged. Incomplete responses return hit without asking for a hand cost.
   */
  youjian_resolve_stab_response(actor,target,damage,context={},counts={}){
    if(!is_youjian_stab(context.source_card)||context.action_kind==='play'||context.response_only===true)
      return Promise.resolve(freeze({outcome:'not_stab',reason:'not_attack_stab',paid:false}));
    try{
      requireMethod(this,'seat_of');
      if(context.kind!=='sha')fail('必须从原杀攻击分支接入，不能用于纯打出响应');
      if(context.source&&context.source!==actor||context.card_user&&context.card_user!==actor)fail('不能替换原杀的使用者或伤害来源');
      if(!stable(context.card_use_id)||!stable(context.branch_id))fail('需要稳定 card_use_id 和 branch_id');
      if(!Number.isFinite(damage)||damage<0)fail('无效的原杀伤害');
      const {required,supplied,response_hooks_complete=true,estimated_damage}=counts;
      if(!Number.isSafeInteger(required)||required<1||!Number.isSafeInteger(supplied)||supplied<0||supplied>required)fail('无效的闪响应数量');
      if(response_hooks_complete!==true)fail('必须先完成每张闪的响应及失牌钩子');
      if(estimated_damage!==undefined&&(!Number.isFinite(estimated_damage)||estimated_damage<0))fail('无效的伤害预估');
      const physical=context.physical_cards??this.physical_card_materials?.(context.source_card,context.use_provenance)??(context.source_card.virtual?[]:[context.source_card]);
      const material_ids=physical.map(card=>physicalId(this,card));
      if(new Set(material_ids.map(id=>JSON.stringify(id))).size!==material_ids.length)fail('原杀素材有重复实体');
      const request={card_use_id:context.card_use_id,branch_id:context.branch_id,root_use_id:context.root_use_id??context.card_use_id,
        source:seat(this,actor),target:seat(this,target),damage,nature:context.nature??'normal',required,supplied,
        estimated_damage:estimated_damage??null,material_ids,damage_event_id:context.damage_event_id??null,
        parent_damage_event_id:context.parent_damage_event_id??null,source_skill:context.source_skill??null,
        source_bonus_applied:context.source_bonus_applied??false,armor_ignored:context.armor_ignored??false,
        sha_branch_bonus:context.youjian_sha_branch?{card_use_id:context.youjian_sha_branch.card_use_id,target_id:context.youjian_sha_branch.target_id,nvzhuang_bonus:context.youjian_sha_branch.nvzhuang_bonus,judgment_color:context.youjian_sha_branch.judgment_color??null}:null,source_face:{type:context.source_card.type,name:context.source_card.name,
          suit:context.source_card.suit??null,color:context.source_card.color??null,rank:context.source_card.rank??null}};
      const receipt_id=JSON.stringify(['youjian-stab',context.card_use_id,context.branch_id]);
      const branches=state(this).branches,pending=runtime(this);
      if(Object.hasOwn(branches,receipt_id)){
        const old=branches[receipt_id],inflight=pending.get(receipt_id);
        if(JSON.stringify(old.request)!==JSON.stringify(request))fail('同一分支不能替换目标、原杀、伤害、素材或响应数量');
        if(inflight){
          if(inflight.actor!==actor||inflight.target!==target||inflight.card!==context.source_card||inflight.physical.some((c,i)=>c!==physical[i]))fail('同一分支不能替换实体引用');
          return inflight.promise;
        }
        if(old.status==='done')return Promise.resolve(old.result);
        fail('未完成或失败的分支必须从动作日志重建，不能重复弃牌或毒损失');
      }
      const r=branches[receipt_id]={receipt_id,request,status:'pending',stage:'entry',paid:false,prompt_count:0,move_attempts:0,move_id:null,selected:null,choices:[]};
      const promise=Promise.resolve().then(()=>resolve(this,actor,target,damage,context,{required,supplied,estimated_damage},r)).catch(error=>{
        r.status='failed';r.error=String(error?.message??error);throw error;
      }).finally(()=>pending.delete(receipt_id));
      pending.set(receipt_id,{promise,actor,target,card:context.source_card,physical:[...physical]});
      return promise;
    }catch(error){return Promise.reject(error);}
  },
};
