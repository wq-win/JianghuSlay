/** Complete historical mobile 王允 skill packet, with disclosed JH01–JH12
 * reconstruction policies. NOT certification of the 2026 mobile executable.
 * Host contracts and the twelve still-open native gaps are documented in
 * docs/wangyun/skill-integration-contract.md. No display-name dispatch. */
import {Card,CardType,is_sha_card} from './models.js';
import {rule_hero} from './effective-hero.js';

export const WANGYUN_RULE_ID='sgs.mobile.hero.wangyun.20231207';
export const WANGYUN_SKILL_IDS=Object.freeze({lianji:'sgs.mobile.wangyun.lianji',moucheng:'sgs.mobile.wangyun.moucheng',jingong:'sgs.mobile.wangyun.jingong'});
export const WANGYUN_ATTACK_NAMES=Object.freeze(['杀','决斗','火攻','南蛮入侵','万箭齐发']);
export const WANGYUN_ORDINARY_TRICKS=Object.freeze(['过河拆桥','顺手牵羊','无中生有','决斗','借刀杀人','南蛮入侵','万箭齐发','五谷丰登','桃园结义','火攻','铁索连环']);
export const WANGYUN_SPECIAL_TRICKS=Object.freeze(['美人计','笑里藏刀']);
/** Source pool labels remain native. These two already-consolidated functions
 * use the host's canonical names rather than creating duplicate card types. */
export const WANGYUN_RUNTIME_CARD_NAMES=Object.freeze({'南蛮入侵':'烽火狼烟','过河拆桥':'釜底抽薪'});
export const wangyun_runtime_card_name=name=>WANGYUN_RUNTIME_CARD_NAMES[name]??name;
export const WANGYUN_SOURCE=Object.freeze({hero_id:WANGYUN_RULE_ID,edition:'mobile-cn-identity-2023-12-07',
  current_client_verified:false,source_mode_complete:false,native_exactness_closed:false,
  gaps:Object.freeze(Array.from({length:12},(_,i)=>`G${String(i+1).padStart(2,'0')}`)),
  host_policies:Object.freeze(Array.from({length:12},(_,i)=>`JH${String(i+1).padStart(2,'0')}`)),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/guide-info-163.html','https://www.sanguosha.cn/pc/hero-detail-213.html','https://www.sanguosha.cn/pc/guide-info-160.html'])});
const SK=WANGYUN_SKILL_IDS;
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const equipment=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const aoe=new Set(['南蛮入侵','万箭齐发']);
const globalTricks=new Set(['五谷丰登','桃园结义']);
const effects={'美人计':SK.jingong.replace('jingong','meirenji'),'笑里藏刀':SK.jingong.replace('jingong','xiaolicangdao'),
  '五谷丰登':'trick.amazing-grace','桃园结义':'trick.god-salvation'};
const live=a=>Boolean(a?.alive&&a.hp>0);
const id=(g,a)=>g.player_id?.(a)??g.seat_of(a);
const key=value=>JSON.stringify(value);
const stable=value=>typeof value==='string'&&value.length>0||typeof value==='number'&&Number.isSafeInteger(value);
const continuing=g=>typeof g.resolution_should_continue==='function'?g.resolution_should_continue():!g.winner;
const pass=value=>['pass','cancel','0','n'].includes(String(value));
const select=(options,value)=>options.find(o=>String(o.id)===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const exact=(options,m)=>options.find(x=>x.card===m?.card&&x.zone===m.zone&&x.id===m.id&&x.index===m.index);
const requireMethod=(g,name)=>{if(typeof g[name]!=='function')throw Error(`王允缺少完整内核接口：${name}`);return g[name].bind(g);};
const runtime=new WeakMap();
function locks(g){let set=runtime.get(g);if(!set)runtime.set(g,set=new Set());return set;}
function state(g){
  const s=g.wangyun_state??={version:1,actors:{},forced_uses:{},damage_events:{},turns:{}};
  if(s.version!==1||['actors','forced_uses','damage_events','turns'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid 王允 state');
  return s;
}
function actorState(g,a){const aid=id(g,a);if(!stable(aid))throw Error('王允需要稳定角色ID');
  return state(g).actors[key(aid)]??={owner_id:aid,generation:0,marks:0,awakened:false,awakening_receipt:null,phases:{},form_receipts:{},previous_forms:[]};
}
const peekActor=(g,a)=>g.wangyun_state?.actors?.[key(id(g,a))];
const turnId=g=>Number.isSafeInteger(g.turn_event_counter)&&g.turn_event_counter>0?`turn:${g.turn_event_counter}`:null;
export const wangyun_phase_id=(g,a)=>Number.isSafeInteger(g.play_phase_event_counter)&&g.play_phase_event_counter>0
  ?key([id(g,a),turnId(g),`play:${g.play_phase_event_counter}`]):null;
const peekPhase=(g,a)=>peekActor(g,a)?.phases?.[wangyun_phase_id(g,a)];
function phaseState(g,a){const phase=wangyun_phase_id(g,a);if(!phase)throw Error('王允需要真实出牌阶段ID');
  return actorState(g,a).phases[phase]??={phase_id:phase,lianji:null,jingong:null,menu:null};
}
function turnState(g,tid=turnId(g)){if(!tid)throw Error('王允需要真实回合ID');return state(g).turns[key(tid)]??={turn_id:tid,damage_sources:[],obligations:{},ended:false};}
export function wangyun_has_skill(g,a,skill){
  if(!live(a)||a.skills_disabled||a.disabled_skill_ids?.includes(skill))return false;
  const ids=a.effective_skill_ids??rule_hero(a)?.skill_ids;
  if(ids)return ids.includes(skill);
  return rule_hero(a)?.id===WANGYUN_RULE_ID&&(skill===SK.moucheng||skill===SK.lianji&&!peekActor(g,a)?.awakened);
}
const idle=(g,a)=>live(a)&&continuing(g)&&g.actual_turn_active!==false&&g.is_own_play_phase(a)&&!!turnId(g)&&!!wangyun_phase_id(g,a)
  &&!g.response_stack?.length&&!g.card_history_stack?.length&&!g.damage_stack?.length&&!g.judgment_stack?.length;
const sameWindow=(g,a,phase,form,skill)=>idle(g,a)&&wangyun_phase_id(g,a)===phase&&rule_hero(a)===form&&wangyun_has_skill(g,a,skill);
function uniquePhysical(g,card){
  if(!card||card.virtual)return false;const pid=card.physical_id??card.physicalCardId??null;
  const all=[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
    ...g.all_players().flatMap(p=>[...p.hand,...(p.judgment_cards??[]),...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...slots.map(s=>p[s]).filter(Boolean)])];
  return all.filter(c=>c===card||pid!==null&&(c.physical_id??c.physicalCardId)===pid).length===1;
}
const materialAllowed=(g,a,m,card=null)=>!g.material_use_prohibited?.(a,m,{source_skill:SK.jingong,source_card:card});
export function wangyun_jingong_materials(g,a){
  if(!live(a))return [];
  return g.skill_material_options(a).filter(m=>!m.card.virtual&&(m.zone==='hand'||slots.includes(m.zone))
    &&(is_sha_card(m.card)||equipment.has(m.card.type))&&materialAllowed(g,a,m));
}
export function wangyun_virtual_card(g,a,name,material=null,skill=SK.jingong){
  if(!(skill===SK.lianji?WANGYUN_ATTACK_NAMES:[...WANGYUN_ORDINARY_TRICKS,...WANGYUN_SPECIAL_TRICKS]).includes(name))throw Error('王允不支持该候选牌名');
  const c=material?.card;
  return new Card(wangyun_runtime_card_name(name),name==='杀'?CardType.SHA:CardType.SCROLL,{virtual:true,materials:c?[c]:[],source_card_name:name,
    suit:c?g.effective_suit(c,a):null,color:c?g.effective_color(c,a):null,rank:c?c.rank:null,
    source_skill:skill,source_skill_id:skill,source_game:'三国杀',source_rule_id:WANGYUN_RULE_ID,
    ...(effects[name]?{effect_id:effects[name]}:{})});
}
const trickLegal=(g,a,t,c)=>live(t)&&!g.card_target_prohibited?.(a,t,c)&&g.can_trick_target(a,t,c);
export const wangyun_lianji_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p));
export const wangyun_lianji_second_targets=(g,a,first)=>wangyun_lianji_targets(g,a).filter(p=>p!==first);
export function wangyun_lianji_available(g,a){return idle(g,a)&&wangyun_has_skill(g,a,SK.lianji)&&!peekPhase(g,a)?.lianji&&wangyun_lianji_targets(g,a).length>=2;}
export function wangyun_lianji_unavailable_reason(g,a){
  if(!wangyun_has_skill(g,a,SK.lianji))return '当前没有连计（谋逞觉醒后失去）';
  if(!idle(g,a))return '只能在自己的空闲出牌阶段发动';
  if(peekPhase(g,a)?.lianji)return '本出牌阶段已发动连计';
  return wangyun_lianji_targets(g,a).length<2?'需要两名其他存活角色；双人局无法发动':'';
}
/** JH03: B remains mandatory; only its forced SHA distance/quota are exempt.
 * This never looks at other hand faces or the draw pile. */
export function wangyun_lianji_attack_names(g,first,second){
  if(!live(first)||!live(second)||first===second)return [];
  return WANGYUN_ATTACK_NAMES.filter(name=>{
    const card=wangyun_virtual_card(g,first,name,null,SK.lianji);
    if(g.card_use_prohibited?.(first,card))return false;
    if(name==='杀')return !first.prison_no_sha&&!g.sha_use_prohibited?.(first)&&!g.card_target_prohibited?.(first,second,card)
      &&g.can_sha_target(first,second,{allow_allies:true,ignore_distance:true});
    if(!trickLegal(g,first,second,card))return false;
    if(name==='决斗')return g.can_duel_target(first,second,{allow_allies:true});
    return name!=='火攻'||second.hand.length>0;
  });
}
function sample(g,values){if(!values.length)return null;const n=g.rng.random();if(!(n>=0&&n<1))throw Error('王允需要有效持久化RNG');return values[Math.floor(n*values.length)];}
/** Called synchronously by a real card resolver BEFORE any card-use callbacks.
 * The exact causing-card ID, not skill name or ancestor history, is authority. */
export function wangyun_register_lianji_use(g,w,a,receipt,event){
  const sourceName=event?.source_card?.source_card_name??event?.source_card?.name;
  if(!stable(event?.card_use_id)||event.card_user!==a||event.source_card?.source_skill_id!==SK.lianji
    ||!WANGYUN_ATTACK_NAMES.includes(sourceName)||event.source_card.name!==wangyun_runtime_card_name(sourceName)||event.source_card.materials?.length!==0)throw Error('连计需要实际零素材用牌凭据');
  const row={card_use_id:event.card_use_id,initiator_id:id(g,w),owner_generation:actorState(g,w).generation??0,card_user_id:id(g,a),receipt_id:receipt.receipt_id,card_name:sourceName};
  const old=state(g).forced_uses[key(event.card_use_id)];if(old&&JSON.stringify(old)!==JSON.stringify(row))throw Error('连计用牌ID冲突');
  state(g).forced_uses[key(event.card_use_id)]=row;receipt.card_use_id=event.card_use_id;
}
export async function wangyun_resolve_lianji(g,w,first,second){
  if(!wangyun_lianji_available(g,w)||!wangyun_lianji_targets(g,w).includes(first)||!wangyun_lianji_second_targets(g,w,first).includes(second))return false;
  // Assert mandatory adapters BEFORE irrevocable once-phase commitment.
  requireMethod(g,'can_use_wangyun_deck_weapon');requireMethod(g,'use_wangyun_deck_weapon');
  const phase=phaseState(g,w),receipt={receipt_id:`lianji:${phase.phase_id}`,status:'committed',owner_id:id(g,w),
    first_id:id(g,first),second_id:id(g,second),weapon_id:null,card_name:null,card_use_id:null};phase.lianji=receipt;
  try{
    const weapons=(g.deck?.draw_pile??[]).filter(c=>!c.virtual&&c.type===CardType.WEAPON&&uniquePhysical(g,c)&&g.can_use_wangyun_deck_weapon(first,c));
    const weapon=sample(g,weapons);
    if(weapon){receipt.weapon_id=g.card_history_material_id(weapon);receipt.stage='weapon';
      await g.use_wangyun_deck_weapon(first,weapon,{skill_initiator:w,source_skill:SK.lianji,source_skill_id:SK.lianji,receipt_id:receipt.receipt_id});}
    // Already committed effects survive initiator death / awakening / skill loss.
    const names=continuing(g)?wangyun_lianji_attack_names(g,first,second):[];
    const name=sample(g,names);if(!name){receipt.status='ended';receipt.stage='no_legal_attack';return true;}
    receipt.card_name=name;receipt.stage='attack';const card=wangyun_virtual_card(g,first,name,null,SK.lianji);
    const options={forced:true,ignore_distance:true,allow_allies:true,source_card:card,source_skill:SK.lianji,source_skill_id:SK.lianji,skill_initiator:w,
      source_last_hand:false,use_provenance:{kind:'virtual',physical_cards:[],source_skill:SK.lianji,source_skill_id:SK.lianji},
      on_card_use_committed:event=>wangyun_register_lianji_use(g,w,first,receipt,event)};
    g.view.emit(`${w.name}发动连计：${first.name}对${second.name}使用${name}${aoe.has(name)?'（扩展至所有其他合法角色）':''}。`);
    if(name==='杀')await g.use_sha(first,second,'连计·杀',options);
    else await g.resolve_scroll(first,second,card,options);
    if(!receipt.card_use_id)throw Error('连计实际用牌未登记因果ID；不可宣称完整接入');
    receipt.status='ended';receipt.stage='complete';return true;
  }catch(error){receipt.status='failed_after_commit';throw error;}
}
async function chooseActor(g,w,targets,stage){
  while(targets.length){
    const options=targets.map(a=>({id:g.seat_of(a),label:`${a.name}（${a.hp}血 · ${a.hand.length}张手牌）`}));
    const answer=await g.view.ask_line(stage==='lianji_first'?'连计：先选使用武器和随机牌的角色 A':'连计：再选随机牌的指定目标 B',{
      kind:'choice',player_id:g.seat_of(w),options:[...options,{id:'cancel',label:'取消，不消耗次数'}],
      meta:{skill:'连计',skill_id:SK.lianji,stage,ordered:true,role:stage==='lianji_first'?'card_user':'mandated_target'}});
    if(pass(answer))return null;const selected=select(options,answer);if(selected)return targets.find(t=>String(g.seat_of(t))===String(selected.id))??null;
  }return null;
}
export async function wangyun_player_lianji(g,w,_fallback,args=[]){
  if(args.length)return false;if(!wangyun_lianji_available(g,w))return true;
  const lock=key([id(g,w),SK.lianji]);if(locks(g).has(lock))return true;locks(g).add(lock);
  const phase=wangyun_phase_id(g,w),form=rule_hero(w);
  try{const first=await chooseActor(g,w,wangyun_lianji_targets(g,w),'lianji_first');
    if(!first||!sameWindow(g,w,phase,form,SK.lianji))return true;
    const second=await chooseActor(g,w,wangyun_lianji_second_targets(g,w,first),'lianji_second');
    if(second&&sameWindow(g,w,phase,form,SK.lianji))await wangyun_resolve_lianji(g,w,first,second);return true;
  }finally{locks(g).delete(lock);}
}
/** Team-aware policy uses public teams, HP, counts and equipment only. */
export function wangyun_ai_lianji_pair(g,w){
  if(!wangyun_lianji_available(g,w))return null;const pairs=[];
  for(const first of wangyun_lianji_targets(g,w))for(const second of wangyun_lianji_second_targets(g,w,first)){
    if(g.side_of(second)===g.side_of(w))continue;
    pairs.push({first,second,score:(g.side_of(first)===g.side_of(w)?20:0)+(first.weapon?0:3)+Math.min(first.hand.length,5)-Math.min(second.hand.length,5)+(second.hp<=2?4:0)});
  }return pairs.sort((a,b)=>b.score-a.score)[0]??null;
}
export const wangyun_ai_lianji=async(g,w)=>{const pair=wangyun_ai_lianji_pair(g,w);return pair?wangyun_resolve_lianji(g,w,pair.first,pair.second):false;};

/** Explicit menu-opening mutates saved RNG once; availability/UI queries never do. */
export function wangyun_jingong_menu(g,a){
  if(!idle(g,a)||!wangyun_has_skill(g,a,SK.jingong))return null;
  const p=phaseState(g,a);if(!p.menu){const first=sample(g,WANGYUN_ORDINARY_TRICKS),second=sample(g,WANGYUN_ORDINARY_TRICKS.filter(n=>n!==first));
    p.menu=[first,second,sample(g,WANGYUN_SPECIAL_TRICKS)];}
  return [...p.menu];
}
const afterMaterial=(g,a,m)=>m?g.actor_after_material_cost(a,m):a;
export function wangyun_jingong_targets(g,a,name,material=null){
  if(!live(a)||![...WANGYUN_ORDINARY_TRICKS,...WANGYUN_SPECIAL_TRICKS].includes(name))return [];
  const card=wangyun_virtual_card(g,a,name,material),after=afterMaterial(g,a,material);
  if(g.card_use_prohibited?.(after,card))return [];
  return g.all_players().filter(t=>{
    if(!trickLegal(g,after,t,card))return false;
    if(name==='无中生有')return t===a;
    if(globalTricks.has(name)||name==='铁索连环')return true;
    if(aoe.has(name))return t!==a;
    if(name==='火攻')return t.hand.length>0;
    if(t===a)return false;
    if(name==='美人计')return g.effective_gender(t)==='male'&&t.hand.length>0;
    if(name==='笑里藏刀')return true;
    if(name==='决斗')return g.can_duel_target(after,t,{allow_allies:true});
    if(name==='借刀杀人')return !!t.weapon&&g.borrowed_victims(t).length>0;
    if(name==='顺手牵羊')return g.target_has_card(t)&&!g.is_immune_to_shunshou(t)&&g.can_use_shunshou(after,t);
    if(name==='过河拆桥')return g.target_has_card(t);
    return false;
  });
}
export function wangyun_jingong_options(g,a){
  const names=peekPhase(g,a)?.menu??[];const materials=wangyun_jingong_materials(g,a);
  return names.map(name=>({id:name,name,label:name,available:materials.some(m=>materialAllowed(g,a,m,wangyun_virtual_card(g,a,name,m))&&wangyun_jingong_targets(g,a,name,m).length>0)}));
}
export function wangyun_jingong_available(g,a){
  if(!idle(g,a)||!wangyun_has_skill(g,a,SK.jingong)||peekPhase(g,a)?.jingong)return false;
  const materials=wangyun_jingong_materials(g,a),names=peekPhase(g,a)?.menu??[...WANGYUN_ORDINARY_TRICKS,...WANGYUN_SPECIAL_TRICKS];
  return materials.some(m=>names.some(name=>materialAllowed(g,a,m,wangyun_virtual_card(g,a,name,m))&&wangyun_jingong_targets(g,a,name,m).length>0));
}
export function wangyun_jingong_unavailable_reason(g,a){
  if(!wangyun_has_skill(g,a,SK.jingong))return '谋逞觉醒获得矜功后才可发动';
  if(!idle(g,a))return '只能在自己的空闲出牌阶段发动';
  if(peekPhase(g,a)?.jingong)return '本出牌阶段已发动矜功';
  return !wangyun_jingong_materials(g,a).length?'需要自己手牌或装备区的一张杀或装备':'本阶段固定候选没有合法用法';
}
export function wangyun_jingong_plan_valid(g,a,name,material,plan){
  if(!plan||plan.recast||!plan.target)return false;
  const targets=wangyun_jingong_targets(g,a,name,material);if(!targets.includes(plan.target))return false;
  if(name==='借刀杀人')return !!plan.forced_target&&g.borrowed_victims(plan.target).includes(plan.forced_target);
  if(name==='铁索连环')return Array.isArray(plan.targets)&&plan.targets.length>=1&&plan.targets.length<=2
    &&new Set(plan.targets).size===plan.targets.length&&plan.targets.every(t=>targets.includes(t));
  if(globalTricks.has(name)||aoe.has(name))return !plan.targets||targets.length===plan.targets.length&&targets.every(t=>plan.targets.includes(t));
  return !plan.targets||plan.targets.length===1&&plan.targets[0]===plan.target;
}
async function prepareJingong(g,a,name,material){
  const targets=wangyun_jingong_targets(g,a,name,material);if(!targets.length)return null;
  if(globalTricks.has(name)||aoe.has(name))return {target:targets[0],targets};
  if(name==='无中生有')return {target:a};
  if(['铁索连环','借刀杀人'].includes(name))return g.prepare_card_use(a,wangyun_virtual_card(g,a,name,material),null,{allow_recast:false});
  const target=await g.choose_card_target(a,targets,{card_name:`矜功·${name}`,stage:'jingong_target',cancellable:true,source_skill_id:SK.jingong,chosen_card_name:name});
  return target?{target}:null;
}
export async function wangyun_resolve_jingong(g,a,name,material,plan){
  if(!wangyun_jingong_available(g,a)||!peekPhase(g,a)?.menu?.includes(name))return false;
  const current=exact(wangyun_jingong_materials(g,a),material);
  if(!current||!uniquePhysical(g,current.card)||!wangyun_jingong_plan_valid(g,a,name,current,plan))return false;
  const card=wangyun_virtual_card(g,a,name,current);if(!materialAllowed(g,a,current,card))return false;
  const p=phaseState(g,a),phase=p.phase_id,form=rule_hero(a),tid=turnId(g);
  const receipt={receipt_id:`jingong:${phase}`,status:'reserved',owner_id:id(g,a),turn_id:tid,card_name:name,
    material_id:g.card_history_material_id(current.card),material_zone:current.zone,history_use_id:null};p.jingong=receipt;
  let scope=null,committed=false;
  try{
    const result=await g.public_card_loss(a,[current],{payment:true,to:'processing',reason:'矜功',visibility:'public',action:'card_use',source_skill:SK.jingong,
      validate:()=>sameWindow(g,a,phase,form,SK.jingong)&&p.jingong===receipt&&receipt.status==='reserved'
        &&!!exact(wangyun_jingong_materials(g,a),current)&&uniquePhysical(g,current.card)&&materialAllowed(g,a,current,card)
        &&wangyun_jingong_plan_valid(g,a,name,current,plan),
      on_committed:(cards,movement)=>{
        if(cards.length!==1||cards[0]!==current.card)throw Error('矜功必须提交一张原实体素材');
        committed=true;receipt.status='committed';receipt.move_id=movement.move_id;
        // A use and its end-stage obligation exist before equipment-loss hooks.
        scope=g.start_card_use(a,card,{materials:[current.card],sourceZones:[current.zone]});receipt.history_use_id=scope.use_id;
        const t=turnState(g,tid);t.obligations[key(id(g,a))]??={owner_id:id(g,a),turn_id:tid,status:'armed',use_ids:[]};
        t.obligations[key(id(g,a))].use_ids.push(scope.use_id);
      }});
    if(!result?.committed){if(!committed)p.jingong=null;return false;}
    if(!committed)throw Error('矜功素材提交回调缺失');
    // No new effect from a dead caster, no refund of material/use/obligation.
    if(live(a)&&continuing(g))await g.resolve_scroll(a,plan.target,card,{...plan,recast:false,allow_allies:true,
      physical_material:current.card,source_skill:SK.jingong,source_skill_id:SK.jingong,skill_initiator:a,
      trick_declaration_validated:true,history_use_id:scope.use_id});
    receipt.status='ended';return true;
  }catch(error){receipt.status=committed?'failed_after_commit':'failed_before_commit';if(!committed)p.jingong=null;throw error;
  }finally{if(committed)g.finish_processing_card(card);if(scope)g.end_card_use(scope);}
}
async function chooseJingongName(g,a,valid){
  while(valid()){
    const options=wangyun_jingong_options(g,a);
    const answer=await g.view.ask_line('矜功：选择本出牌阶段固定候选锦囊，或取消',{
      kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label,available})=>({id,label:available?label:`${label}（当前不可用）`,disabled:!available})),{id:'cancel',label:'取消，候选不刷新'}],
      meta:{skill:'矜功',skill_id:SK.jingong,stage:'jingong_menu',private_to:g.seat_of(a),phase_id:wangyun_phase_id(g,a),fixed_menu:true,ordinary_pool_size:11,current_client_verified:false}});
    if(pass(answer))return null;const choice=select(options,answer);if(choice?.available)return choice.name;
  }return null;
}
async function chooseJingongMaterial(g,a,name,valid){
  while(valid()){
    const options=wangyun_jingong_materials(g,a).filter(m=>materialAllowed(g,a,m,wangyun_virtual_card(g,a,name,m))&&wangyun_jingong_targets(g,a,name,m).length);
    if(!options.length)return null;
    const answer=await g.view.ask_line(`矜功·${name}：选一张杀或装备作为素材`,{
      kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗素材或次数'}],
      meta:{skill:'矜功',skill_id:SK.jingong,stage:'jingong_material',source_skill_id:SK.jingong,chosen_card_name:name,private_to:g.seat_of(a),material_zones:['hand',...slots],host_policy:'JH05',material_count:1}});
    if(pass(answer))return null;const selected=select(options,answer);if(selected)return selected;
  }return null;
}
export async function wangyun_player_jingong(g,a,_fallback,args=[]){
  if(args.length)return false;if(!wangyun_jingong_available(g,a))return true;
  const lock=key([id(g,a),SK.jingong]);if(locks(g).has(lock))return true;locks(g).add(lock);
  const phase=wangyun_phase_id(g,a),form=rule_hero(a),valid=()=>sameWindow(g,a,phase,form,SK.jingong);
  try{wangyun_jingong_menu(g,a);const name=await chooseJingongName(g,a,valid);if(!name||!valid())return true;
    const material=await chooseJingongMaterial(g,a,name,valid);if(!material||!valid())return true;
    const plan=await prepareJingong(g,a,name,material);if(plan&&valid())await wangyun_resolve_jingong(g,a,name,material,plan);return true;
  }finally{locks(g).delete(lock);}
}
export function wangyun_ai_jingong_choices(g,a){
  const choices=[];
  for(const option of wangyun_jingong_options(g,a).filter(o=>o.available))for(const material of wangyun_jingong_materials(g,a)){
    const targets=wangyun_jingong_targets(g,a,option.name,material);if(!targets.length)continue;
    const enemies=targets.filter(t=>g.side_of(t)!==g.side_of(a)),friends=targets.filter(t=>g.side_of(t)===g.side_of(a));
    let score=0;
    if(option.name==='无中生有')score=9;
    else if(option.name==='桃园结义')score=targets.reduce((n,t)=>n+(g.side_of(t)===g.side_of(a)?1:-1)*Math.max(0,(g.effective_max_hp?.(t)??rule_hero(t).max_hp)-t.hp),0)*3;
    else if(option.name==='五谷丰登')score=friends.length>=enemies.length?4:0;
    else if(aoe.has(option.name))score=(enemies.length-friends.length)*4;
    else if(option.name==='铁索连环')score=targets.some(t=>g.side_of(t)===g.side_of(a)?t.chained:!t.chained)?3:0;
    else if(enemies.length)score=option.name==='笑里藏刀'?8:option.name==='顺手牵羊'?7:5;
    if(score>0)choices.push({name:option.name,material,score:score-g.material_ai_cost(material)/2});
  }return choices.sort((a,b)=>b.score-a.score);
}
export async function wangyun_ai_jingong(g,a){
  if(!wangyun_jingong_available(g,a))return false;wangyun_jingong_menu(g,a);
  for(const choice of wangyun_ai_jingong_choices(g,a)){if(choice.score<=0)continue;
    const plan=await prepareJingong(g,a,choice.name,choice.material);if(plan&&await wangyun_resolve_jingong(g,a,choice.name,choice.material,plan))return true;}
  return false;
}

/** Whole-turn ledger is global: it must see damage BEFORE 矜功 is acquired. */
export function wangyun_turn_begin(g,_actor,event={}){const tid=event.turn_id??event.event_id??turnId(g);return turnState(g,typeof tid==='number'?`turn:${tid}`:tid);}
export function wangyun_turn_end(g,_actor,event={}){
  const raw=event.turn_id??event.event_id??turnId(g),tid=typeof raw==='number'?`turn:${raw}`:raw,t=g.wangyun_state?.turns?.[key(tid)];
  if(!t||t.ended)return false;t.ended=true;for(const o of Object.values(t.obligations))if(o.status==='armed')o.status='expired_without_end_stage';return true;
}
export async function wangyun_awaken(g,a,event={}){
  const s=peekActor(g,a);if(!s||s.marks<3||s.awakened||!wangyun_has_skill(g,a,SK.moucheng))return false;
  const changeMax=requireMethod(g,'wangyun_change_max_hp'),changeSkills=requireMethod(g,'wangyun_change_skills');requireMethod(g,'recover_hp');
  const receipt=s.awakening_receipt={receipt_id:`moucheng:${id(g,a)}:${s.generation??0}`,damage_event_id:event.damage_event_id??null,status:'committed',marks:s.marks};
  s.awakened=true; // Before callbacks: nested/replayed damage cannot awaken twice.
  try{
    const maxChanged=await changeMax(a,1,{receipt_id:receipt.receipt_id,source_skill:SK.moucheng});
    if(maxChanged===false){receipt.status='stopped_before_max';if(s.awakening_receipt===receipt)s.awakened=false;return false;}
    receipt.stage='max_hp';
    receipt.recovered_hp=live(a)?await g.recover_hp(a,1,{source:a,source_skill:SK.moucheng,recovery_event_id:`${receipt.receipt_id}:recover`}):0;receipt.stage='recover';
    const skillsChanged=await changeSkills(a,{remove:[SK.lianji],acquire:[SK.jingong],receipt_id:receipt.receipt_id,source_skill:SK.moucheng});
    if(skillsChanged===false){receipt.status=live(a)?'stopped_after_recovery':'stopped_dead';return false;}
    receipt.status='ended';receipt.stage='complete';g.view.emit(`${a.name}谋逞觉醒：体力上限增加1，回复${receipt.recovered_hp??0}，失去连计并获得矜功。`);return true;
  }catch(error){receipt.status='failed_after_commit';throw error;}
}
export async function wangyun_after_damage(g,event){
  if(!event||!stable(event.damage_event_id)||typeof event.damageOccurred!=='boolean'||!Number.isSafeInteger(event.hpDeducted)||event.hpDeducted<0)throw Error('王允全局伤害观察需要damageOccurred与实际hpDeducted');
  if(['hp_loss','lose_hp','HP_LOSS'].includes(event.kind))return false;
  const causal=event.causal_card_use_id??null,source=event.source??null,tid=event.turn_id??turnId(g);
  const facts={source_id:source?id(g,source):null,card_user_id:event.card_user?id(g,event.card_user):null,
    causal_card_use_id:causal,damageOccurred:event.damageOccurred,hpDeducted:event.hpDeducted,damage_origin:event.damage_origin??null,turn_id:tid};
  const s=state(g),prior=s.damage_events[key(event.damage_event_id)];
  if(prior){if(JSON.stringify(prior)!==JSON.stringify(facts))throw Error('王允伤害事件ID事实冲突');return false;}
  s.damage_events[key(event.damage_event_id)]=facts;
  if(source&&event.damageOccurred&&tid){const t=turnState(g,tid),sourceId=id(g,source);if(!t.ended&&!t.damage_sources.includes(sourceId))t.damage_sources.push(sourceId);}
  const use=causal===null?null:s.forced_uses[key(causal)];
  let credited=false;
  if(use&&event.damageOccurred&&event.hpDeducted>0&&event.damage_origin==='card'
    &&facts.source_id===use.card_user_id&&facts.card_user_id===use.card_user_id){
    const owner=g.all_players().find(a=>id(g,a)===use.initiator_id);
    if(live(owner)){
      // Mark ownership belongs to this initiator's form generation. Own
      // awakening preserves it; an unrelated full template replacement does not.
      const ownState=actorState(g,owner);
      if((ownState.generation??0)===(use.owner_generation??0)){ownState.marks+=event.hpDeducted;credited=true;}
    }
  }
  // 谋逞's trigger is after ANY actual damage. A previously suppressed owner
  // with enough marks may awaken on the next event, even from a different card.
  if(event.damageOccurred)for(const owner of g.action_order?.()??g.all_players())await wangyun_awaken(g,owner,event);
  return credited;
}
export async function wangyun_end_phase(g,a,event={}){
  if(g.turn_phase!=='end_phase'||g.turn_actor!==g.seat_of(a))return false;
  const t=g.wangyun_state?.turns?.[key(turnId(g))],o=t?.obligations?.[key(id(g,a))];if(!t||t.ended||!o||o.status!=='armed')return false;
  o.end_phase_id=event.phase_event_id??event.event_id??`end-phase:${g.end_phase_event_counter??0}`;
  o.status='settled'; // Independent of skill ownership and before lethal callbacks.
  if(!live(a)){o.result='dead';return false;}
  if(t.damage_sources.includes(id(g,a))){o.result='caused_damage';return false;}
  o.result='hp_loss';await g.lose_hp(a,1,{reason:'矜功本回合未造成伤害',source:null,source_skill:SK.jingong,obligation_id:`jingong-end:${t.turn_id}:${id(g,a)}`});return true;
}
export function wangyun_public_state(g,a,{include_menu=false}={}){
  const s=peekActor(g,a),p=peekPhase(g,a),t=g.wangyun_state?.turns?.[key(turnId(g))];
  return {marks:s?.marks??0,awakened:s?.awakened??false,lianji_used:Boolean(p?.lianji),jingong_used:Boolean(p?.jingong),
    end_obligation:t?.obligations?.[key(id(g,a))]?.status??null,...(include_menu?{menu:p?.menu?[...p.menu]:null}:{}),current_client_verified:false};
}
/** Explicit lifecycle callbacks: receiving a copied skill initializes ONLY this
 * actor's state. Loss never erases already paid uses, marks, a live forced card,
 * or the turn's obligation. The host owns the actual active skill set. */
export function wangyun_on_skill_acquired(g,a,skill){
  if(!Object.values(SK).includes(skill))return false;actorState(g,a);return true;
}
export function wangyun_on_skill_lost(_g,_a,skill){return Object.values(SK).includes(skill);}
/** A full external form replacement is different from one's own awakening.
 * Never copy donor marks/receipts. Keep this actor's already-spent phase limits,
 * menu and paid turn obligations; a new form cannot launder a use or reroll. */
export function wangyun_on_form_acquired(g,a,{template_id,skill_ids,receipt_id,awakening_consumed=false}={}){
  if(!stable(template_id)||!stable(receipt_id)||!Array.isArray(skill_ids)||skill_ids.some(s=>!stable(s)))throw Error('王允完整形态获得需要稳定模板/生命周期收据和完整技能列表');
  const s=actorState(g,a),facts={template_id,skill_ids:[...skill_ids],awakening_consumed:Boolean(awakening_consumed)};
  s.form_receipts??={};s.previous_forms??=[];const previous=s.form_receipts[key(receipt_id)];
  if(previous){if(JSON.stringify(previous)!==JSON.stringify(facts))throw Error('王允形态获得收据冲突');return false;}
  s.form_receipts[key(receipt_id)]=facts;s.previous_forms.push({generation:s.generation??0,marks:s.marks,awakened:s.awakened,awakening_receipt:s.awakening_receipt});
  s.generation=(s.generation??0)+1;s.marks=0;s.awakened=Boolean(awakening_consumed||skill_ids.includes(SK.jingong));s.awakening_receipt=null;return true;
}
export const WANGYUN_SKILL_LIFECYCLES=Object.freeze(Object.values(SK).map(skill_id=>Object.freeze({
  skill_id,version:'jianghu.wangyun.lifecycle.20231207.v1',
  on_acquired:(g,a)=>wangyun_on_skill_acquired(g,a,skill_id),on_lost:(g,a)=>wangyun_on_skill_lost(g,a,skill_id),
})));
export const wangyunSkillMethods={
  wangyun_after_damage(event){return wangyun_after_damage(this,event);},
  wangyun_turn_begin(a,e){return wangyun_turn_begin(this,a,e);},wangyun_turn_end(a,e){return wangyun_turn_end(this,a,e);},
  wangyun_end_phase(a,e){return wangyun_end_phase(this,a,e);},
  wangyun_public_state(a,options){return wangyun_public_state(this,a,options);},
  wangyun_on_skill_acquired(a,skill){return wangyun_on_skill_acquired(this,a,skill);},
  wangyun_on_skill_lost(a,skill){return wangyun_on_skill_lost(this,a,skill);},
  wangyun_on_form_acquired(a,options){return wangyun_on_form_acquired(this,a,options);},
};
export function wangyun_skill_definitions({SkillHooks,ActiveSkillDef}){
  const lianji=new ActiveSkillDef({skill_id:'连计',hotkey:'q',button_label:'连计',arg_mode:'none',player:wangyun_player_lianji,ai:wangyun_ai_lianji,
    available:wangyun_lianji_available,help_text:'连计：每出牌阶段一次，依次选两名其他角色。A直接使用牌堆随机武器，再对B视为使用五选一牌；不需要交牌或弃牌。'});
  const jingong=new ActiveSkillDef({skill_id:'矜功',hotkey:'w',button_label:'矜功',arg_mode:'none',player:wangyun_player_jingong,ai:wangyun_ai_jingong,
    available:wangyun_jingong_available,help_text:'矜功：每出牌阶段一次，以手牌或装备区一张杀或装备，使用本阶段固定的2普通+1专属锦囊之一；本回合未造成伤害则结束阶段失去1体力。'});
  Object.assign(lianji,{owns_target_selection:true,targets:wangyun_lianji_targets,unavailable_reason:wangyun_lianji_unavailable_reason,source_skill_id:SK.lianji});
  Object.assign(jingong,{owns_target_selection:true,targets:(g,a)=>g.all_players().filter(live),unavailable_reason:wangyun_jingong_unavailable_reason,source_skill_id:SK.jingong});
  return {hooks:{[WANGYUN_RULE_ID]:SkillHooks({})},active:{[WANGYUN_RULE_ID]:[lianji,jingong]},
    skill_hooks:{[SK.lianji]:SkillHooks({}),[SK.moucheng]:SkillHooks({}),[SK.jingong]:SkillHooks({})}};
}
