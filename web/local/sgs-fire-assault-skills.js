/** Mainland mobile BASE identity 太史慈 / 颜良文丑, catalog 2026-10-15.
 * This is a complete independent skill bundle, not an alias for 任恒之 or 界双雄.
 * H1/H2/H4/H9/H10/H11 are declared host policies; no current-client parity.
 * Host wiring: docs/sgs-fire/assault-integration-contract.md.
 */
import {Card,CardType,CardColor,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';
import {pindian_hand_options,pindian_rank,resolve_pindian} from './pindian.js';

export const SGS_FIRE_ASSAULT_RULE_IDS=Object.freeze({taishici:'sgs.adapted.base.hero.tai-shi-ci',yanliangwenchou:'sgs.adapted.base.hero.yan-liang-wen-chou'});
export const SGS_FIRE_ASSAULT_SKILL_IDS=Object.freeze({tianyi:'sgs.tianyi',shuangxiong:'sgs.shuangxiong'});
export const SGS_FIRE_ASSAULT_SOURCE=Object.freeze({
  product:'sanguosha_mobile_cn',variant:'mainland-mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',
  current_client_rules_verified:false,current_client_hp_verified:false,source_only_exact_for_every_edge:false,
  policy_ids:Object.freeze(['H1','H2','H4','H9','H10','H11']),
  heroes:Object.freeze([
    Object.freeze({id:SGS_FIRE_ASSAULT_RULE_IDS.taishici,max_hp:4,gender:'male',source_faction:'吴',skill_ids:Object.freeze(['sgs.tianyi']),personal_lord_skill_ids:Object.freeze([])}),
    Object.freeze({id:SGS_FIRE_ASSAULT_RULE_IDS.yanliangwenchou,max_hp:4,gender:'male',source_faction:'群',skill_ids:Object.freeze(['sgs.shuangxiong']),personal_lord_skill_ids:Object.freeze([])}),
  ]),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-38.html','https://www.sanguosha.cn/pc/hero-detail-40.html',
    'https://wiki.biligame.com/msgs/index.php?title=太史慈&oldid=34809','https://wiki.biligame.com/msgs/index.php?title=颜良文丑&oldid=35616']),
  tianyi_duration:'turn',tianyi_duration_conflict:'Official catalog says 本回合; secondary classic revision34809 says 本阶段. Selected official turn duration is intentional.',
  metadata_warning:'HP4/male uses dated secondary classic metadata, with OL HP corroboration; mainland catalog omits numeric HP and gender.',
});
const ID=SGS_FIRE_ASSAULT_RULE_IDS,SK=SGS_FIRE_ASSAULT_SKILL_IDS;
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const live=p=>Boolean(p?.alive&&!p.dead&&p.hp>0);
const stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
const identity=(g,a)=>g.player_id?.(a)??g.seat_of(a);
const ownerKey=(g,a)=>JSON.stringify(identity(g,a));
const turnId=g=>g.turn_event_counter;
const own=(a,skill)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(skill)
  &&((a.effective_skill_ids??rule_hero(a)?.skill_ids)?.includes(skill)??rule_hero(a)?.id===ID[skill===SK.tianyi?'taishici':'yanliangwenchou']);
const continuing=g=>!g.winner&&(typeof g.resolution_should_continue==='function'?g.resolution_should_continue():typeof g.match_should_continue!=='function'||g.match_should_continue());
const idlePlay=(g,a)=>live(a)&&g.all_players().includes(a)&&continuing(g)&&g.actual_turn_active!==false&&g.is_own_play_phase(a)
  &&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);
const pass=x=>['cancel','pass','0','n','no'].includes(String(x));
const select=(options,x)=>options.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?options[Number(x)-1]:null);
const exact=(options,m)=>options.find(o=>o.card===m?.card&&o.zone===m.zone&&o.index===m.index&&o.id===m.id);
const materialId=(g,c)=>g.card_history_material_id(c);
const physicalId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const allPhysical=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),
  ...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...slots.map(s=>p[s]).filter(Boolean)])];
const uniquePhysical=(g,c)=>Boolean(c&&!c.virtual&&allPhysical(g).filter(x=>x===c||physicalId(c)!==null&&physicalId(x)===physicalId(c)).length===1);
const requireMovement=g=>{if(typeof g.public_card_loss!=='function'||g.public_card_loss_supports_on_committed!==true)throw Error('双雄需要原子 validate / on_committed 卡牌移动接口');};
const replayError=()=>Object.assign(Error('火武将技能事务未结束，须恢复原协程或重放输入日志，不能重复支付。'),{code:'SGS_FIRE_ASSAULT_REPLAY_REQUIRED'});
function state(g){
  const s=g.sgs_fire_assault_state??={version:1,counter:0,tianyi:{},draws:{},duels:{},effects:{}};
  if(s.version!==1||!Number.isSafeInteger(s.counter)||s.counter<0||['tianyi','draws','duels','effects'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid SGS fire assault state');
  return s;
}
const nextId=(g,prefix)=>{const s=state(g);if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('SGS fire assault counter exhausted');return `${prefix}:${++s.counter}`;};
const runtime=new WeakMap();
const running=g=>{let r=runtime.get(g);if(!r)runtime.set(g,r=new Map());return r;};
export function sgs_clone_fire_assault_state(g){return g.sgs_fire_assault_state?JSON.parse(JSON.stringify(state(g))):null;}
function effects(g,a,turn=turnId(g)){
  const states=state(g).effects,key=ownerKey(g,a);
  if(states[key]?.turn_id!==turn)states[key]={owner_id:identity(g,a),turn_id:turn,tianyi:[],shuangxiong:[]};
  return states[key];
}
const currentEffects=(g,a)=>{const s=g.sgs_fire_assault_state?.effects?.[ownerKey(g,a)];return stable(turnId(g))&&s?.turn_id===turnId(g)?s:null;};
/** Must run independently of CURRENT skill ownership, including turn abort. */
export function sgs_fire_assault_turn_begin(g){
  for(const [key,s] of Object.entries(g.sgs_fire_assault_state?.effects??{}))if(s.turn_id!==turnId(g))delete g.sgs_fire_assault_state.effects[key];
}
export function sgs_fire_assault_turn_end(g,_actor=null,{turn_id=turnId(g)}={}){
  for(const [key,s] of Object.entries(g.sgs_fire_assault_state?.effects??{}))if(s.turn_id===turn_id)delete g.sgs_fire_assault_state.effects[key];
}
export function sgs_tianyi_phase_key(g,a){
  const phase=a?.play_phase_id??g.play_phase_event_counter;
  return stable(phase)&&stable(turnId(g))?JSON.stringify([identity(g,a),turnId(g),phase]):null;
}
/** No opponent card faces read: public hand count only. Shared comparison
 * validates the opponent's exact legal card privately before its atomic commit. */
export const sgs_tianyi_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&p.hand.length>0);
function tianyiAvailable(g,a,target=null,reserved=null){
  const key=sgs_tianyi_phase_key(g,a),receipt=g.sgs_fire_assault_state?.tianyi?.[key];
  if(!own(a,SK.tianyi)||!idlePlay(g,a)||!key||receipt&&receipt!==reserved||!pindian_hand_options(a).length)return false;
  const targets=sgs_tianyi_targets(g,a);return target==null?targets.length>0:targets.includes(target);
}
export const sgs_tianyi_available=(g,a,target=null)=>tianyiAvailable(g,a,target);
export function sgs_tianyi_unavailable_reason(g,a){
  if(!own(a,SK.tianyi))return '当前没有可用的天义技能';
  if(!idlePlay(g,a)||!sgs_tianyi_phase_key(g,a))return '只能在自己的空闲出牌阶段发动';
  if(g.sgs_fire_assault_state?.tianyi?.[sgs_tianyi_phase_key(g,a)])return '本出牌阶段已发动天义';
  return !pindian_hand_options(a).length?'需要一张可拼点的手牌':!sgs_tianyi_targets(g,a).length?'需要另一名有手牌的存活角色':'';
}
export function sgs_tianyi_modifiers(g,a){
  const tokens=currentEffects(g,a)?.tianyi??[];
  return {wins:tokens.filter(t=>t.won).length,lost:tokens.some(t=>!t.won),compare_ids:tokens.map(t=>t.compare_id)};
}
export const sgs_tianyi_sha_prohibited=(g,a,{response=false}={})=>!response&&sgs_tianyi_modifiers(g,a).lost;
export const sgs_tianyi_sha_allowance=(g,a,base=1)=>base+sgs_tianyi_modifiers(g,a).wins;
export const sgs_tianyi_sha_target_cap=(g,a,base=1)=>base+sgs_tianyi_modifiers(g,a).wins;
export const sgs_tianyi_attack_range=(g,a,base=1,{card_type=CardType.SHA}={})=>is_sha_type(card_type)&&sgs_tianyi_modifiers(g,a).wins>0?Infinity:base;
export function sgs_tianyi_status(g,a,{base_allowance=1,base_target_cap=1,base_range=1,used=a.sha_count_this_turn??0,hard_prohibited=false}={}){
  const m=sgs_tianyi_modifiers(g,a),allowance=sgs_tianyi_sha_allowance(g,a,base_allowance),prohibited=hard_prohibited||m.lost;
  return {...m,prohibited,allowance,used,remaining:prohibited?0:Math.max(0,allowance-used),can_use:!prohibited&&used<allowance,
    target_cap:sgs_tianyi_sha_target_cap(g,a,base_target_cap),attack_range:sgs_tianyi_attack_range(g,a,base_range)};
}
export async function sgs_resolve_tianyi(g,a,target,{initiator_card=null,dependencies={}}={}){
  if(!sgs_tianyi_available(g,a,target))return false;
  if(initiator_card&&!pindian_hand_options(a).some(m=>m.card===initiator_card))return false;
  if(resolve_pindian.result_callback_before_cleanup!==true)throw Error('天义需要拼点结果先于实体牌清理');
  const key=sgs_tianyi_phase_key(g,a),turn=turnId(g),form=rule_hero(a)?.id,s=state(g);
  const receipt=s.tianyi[key]={phase_key:key,turn_id:turn,owner_id:identity(g,a),target_id:identity(g,target),compare_id:nextId(g,'sgs.tianyi'),status:'reserved',committed:false,applied:false};
  const valid=()=>sgs_tianyi_phase_key(g,a)===key&&turnId(g)===turn&&rule_hero(a)?.id===form&&tianyiAvailable(g,a,target,receipt);
  try{
    const result=await resolve_pindian(g,a,target,{compare_id:receipt.compare_id,initiator_card,disposition:'discard',reason:'天义',source_skill_id:SK.tianyi,validate:valid,
      dependencies:{...dependencies,on_reveal:async result=>{receipt.committed=true;receipt.status='committed';receipt.outcome=result.outcome;await dependencies.on_reveal?.(result);}},
      on_result:result=>{
        if(receipt.applied)return;
        // Real hand loss, poison and all rescue resolve BEFORE this callback.
        // No skill ownership recheck: the already committed effect may survive
        // a form loss; a finally dead owner cannot acquire a usable bonus.
        receipt.status='result';receipt.outcome=result.outcome;
        if(!live(a)||!continuing(g)||turnId(g)!==turn)return;
        effects(g,a,turn).tianyi.push({compare_id:result.compare_id,won:result.won});receipt.applied=true;
        g.view.emit(result.won?'天义获胜：本回合杀的使用次数和目标数各加一，杀无距离限制。':'天义未赢：本回合不能使用杀，仍可纯打出杀响应。');
      },
    });
    if(!result.committed){delete s.tianyi[key];return false;}
    receipt.status='ended';return true;
  }catch(error){receipt.status=receipt.committed?'failed_after_commit':'failed_before_commit';throw error;}
}
function choiceMeta(g,a,skill,stage,extra={}){return {skill:skill===SK.tianyi?'天义':'双雄',skill_id:skill,stage,turn_id:turnId(g),...extra};}
async function chooseTarget(g,a,targets,skill,stage,extra={}){
  const options=targets.map(p=>({id:g.seat_of(p),label:`${p.name}（${p.hp}血 · ${p.hand.length}张手牌）`}));
  while(options.length){
    const answer=await g.view.ask_line(`${skill===SK.tianyi?'天义':'双雄·决斗'}：选择另一名角色`,{kind:'choice',player_id:g.seat_of(a),options:[...options,{id:'cancel',label:'取消，不消耗牌或次数'}],meta:choiceMeta(g,a,skill,stage,{allow_allies:true,...extra})});
    if(pass(answer))return null;const chosen=select(options,answer);if(chosen)return targets.find(p=>g.seat_of(p)===chosen.id);
  }return null;
}
async function chooseMaterial(g,a,materials,skill,stage,args=[],extra={}){
  if(args.length){if(args.length===1&&pass(args[0]))return null;if(args.length!==1)return false;
    return materials.find(m=>m.id===args[0]||String(m.index+1)===String(args[0]))??false;}
  while(materials.length){
    const answer=await g.view.ask_line(`${skill===SK.tianyi?'天义':'双雄·决斗'}：选择一张手牌`,{kind:'choice',player_id:g.seat_of(a),options:[...materials.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗牌或次数'}],
      meta:choiceMeta(g,a,skill,stage,{private_to:g.seat_of(a),material_zones:['hand'],...extra})});
    if(pass(answer))return null;const chosen=select(materials,answer);if(chosen)return chosen;
  }return null;
}
export async function sgs_player_tianyi(g,a,_fallback,args=[]){
  if(!sgs_tianyi_available(g,a)){g.view.emit(`天义：${sgs_tianyi_unavailable_reason(g,a)}。`);return true;}
  const key=sgs_tianyi_phase_key(g,a),form=rule_hero(a)?.id;
  const valid=()=>key===sgs_tianyi_phase_key(g,a)&&form===rule_hero(a)?.id&&sgs_tianyi_available(g,a);
  const target=await chooseTarget(g,a,sgs_tianyi_targets(g,a),SK.tianyi,'tianyi_target',{phase_key:key});if(!target||!valid())return true;
  const material=await chooseMaterial(g,a,pindian_hand_options(a),SK.tianyi,'tianyi_material',args,{phase_key:key});
  if(material===false)return false;
  if(material&&valid()&&exact(pindian_hand_options(a),material))await sgs_resolve_tianyi(g,a,target,{initiator_card:material.card});return true;
}
export function sgs_ai_tianyi_choice(g,a){
  if(!sgs_tianyi_available(g,a)||sgs_tianyi_modifiers(g,a).lost)return null;
  const material=pindian_hand_options(a).sort((x,y)=>pindian_rank(y.card)-pindian_rank(x.card)||x.index-y.index)[0];
  if(pindian_rank(material?.card)<10)return null;
  const target=sgs_tianyi_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp)[0];
  return target?{target,material}:null;
}
export async function sgs_ai_tianyi(g,a){const c=sgs_ai_tianyi_choice(g,a);return c?sgs_resolve_tianyi(g,a,c.target,{initiator_card:c.material.card}):false;}

const drawKey=(g,a,e)=>stable(e?.phase_event_id)&&stable(turnId(g))?JSON.stringify([identity(g,a),turnId(g),e.phase_event_id]):null;
function drawWindow(g,a,e){return own(a,SK.shuangxiong)&&g.all_players().includes(a)&&continuing(g)&&g.actual_turn_active!==false&&g.turn_phase==='draw'&&g.turn_actor===g.seat_of(a)
  &&!a.skip_draw_stage&&!a.block_turn_draw&&e?.actor===a&&e.turn_id===turnId(g)&&!!drawKey(g,a,e)&&!e.skipped&&!e.cancelled&&!e.closed&&!e.replaced;}
export function sgs_shuangxiong_colors(g,a){return [...new Set((currentEffects(g,a)?.shuangxiong??[]).map(t=>t.color))];}
/** AI never looks at the deck. It accepts only with enough hand fuel and an
 * enemy that is publicly Duel-legal; decline does not impose a human quota. */
export function sgs_ai_shuangxiong_replace(g,a){return a.hand.length>=3&&g.all_players().some(p=>p!==a&&live(p)&&g.side_of(p)!==g.side_of(a)&&g.can_duel_target(a,p,{allow_allies:true}));}
export function sgs_replace_draw_phase_shuangxiong(g,a,_target=null,event={}){
  const key=drawKey(g,a,event),existing=key&&g.sgs_fire_assault_state?.draws?.[key],pending=key&&running(g).get(`draw:${key}`);
  if(pending)return pending;
  if(existing){if(!['ended','passed','interrupted'].includes(existing.status))return Promise.reject(replayError());return Promise.resolve(Boolean(existing.committed));}
  if(!drawWindow(g,a,event))return Promise.resolve(false);
  requireMovement(g);
  const turn=turnId(g),form=rule_hero(a)?.id,receipt=state(g).draws[key]={phase_key:key,phase_event_id:event.phase_event_id,turn_id:turn,owner_id:identity(g,a),status:'offered',committed:false,obtained:false,color:null};
  const valid=()=>turnId(g)===turn&&rule_hero(a)?.id===form&&drawKey(g,a,event)===key&&drawWindow(g,a,event);
  const task=Promise.resolve().then(async()=>{
    const accepted=a.is_ai?sgs_ai_shuangxiong_replace(g,a):await g.view.ask_confirm('双雄：是否替代整个摸牌阶段的摸牌，进行一次判定并获得最终判定牌？',{
      player_id:g.seat_of(a),meta:choiceMeta(g,a,SK.shuangxiong,'shuangxiong_draw',{phase_event_id:event.phase_event_id,replaces_entire_draw:true}),
    });
    if(!accepted||!valid()){receipt.status='passed';return false;}
    receipt.committed=true;receipt.status='judging';event.replaced=true;event.replacement_skill_id=SK.shuangxiong;
    let judgment;
    try{
      judgment=await g.reveal_judgment(a,'双雄',{good_for:a});
      if(!judgment){receipt.status='ended';return true;}
      const materials=g.physical_card_materials(judgment),physical=materials.length===1?materials[0]:null;
      // The result view is frozen by the shared kernel, before Tiandu or any
      // future acquisition hook. Never derive the old result from a later hand.
      const color=judgment.fixed_judgment_result?judgment.color:g.effective_color(judgment,a,{judged_actor:a});
      receipt.color=[CardColor.RED,CardColor.BLACK].includes(color)?color:null;
      receipt.judgment_event_id=judgment.judgment_event_id??`judgment:${g.judgment_event_counter}`;
      receipt.card_id=physical?materialId(g,physical):null;
      if(live(a)&&continuing(g)&&turnId(g)===turn){
        if(physical&&g.processing_cards.includes(physical)&&uniquePhysical(g,physical)){
          receipt.status='gaining';
          const moved=await g.public_card_loss(null,[{zone:'processing',index:g.processing_cards.indexOf(physical),card:physical}],{
            to:'hand',recipient:a,reason:'双雄',visibility:'public',source:null,source_zone:'judgment',source_skill:SK.shuangxiong,action:'obtain',poison_exempt:true,
            move_id:`sgs.shuangxiong:obtain:${key}`,validate:()=>live(a)&&turnId(g)===turn&&g.processing_cards.includes(physical),
            on_committed:()=>{receipt.obtained=true;},
          });
          if(moved?.committed&&!receipt.obtained)throw Error('双雄缺少最终判定牌获得回执');
        }
        if(receipt.color&&live(a)&&continuing(g)&&turnId(g)===turn)effects(g,a,turn).shuangxiong.push({phase_key:key,judgment_event_id:receipt.judgment_event_id,color:receipt.color});
      }
      receipt.status='ended';g.view.emit(`${a.name}发动双雄，${receipt.obtained?'获得最终判定牌':'最终判定牌已不可获得'}；${receipt.color?'本回合可将异色手牌当决斗使用':'无有效红黑判定颜色，不授予转换'}。`);return true;
    }finally{if(judgment)await g.finish_judgment_card(judgment);}
  }).catch(error=>{receipt.status=receipt.committed?'failed_after_commit':'failed_before_commit';throw error;}).finally(()=>running(g).delete(`draw:${key}`));
  running(g).set(`draw:${key}`,task);return task;
}
const eligibleColor=(g,a,c)=>{const color=g.effective_color(c,a);return [CardColor.RED,CardColor.BLACK].includes(color)&&sgs_shuangxiong_colors(g,a).some(x=>x!==color);};
export const sgs_shuangxiong_materials=(g,a)=>own(a,SK.shuangxiong)?g.skill_material_options(a).filter(m=>m.zone==='hand'&&!m.card.virtual&&eligibleColor(g,a,m.card)):[];
export function sgs_shuangxiong_card(g,a,material){
  const m=exact(sgs_shuangxiong_materials(g,a),material);if(!m)return null;
  return new Card('决斗',CardType.SCROLL,{virtual:true,materials:[m.card],suit:g.effective_suit(m.card,a),color:g.effective_color(m.card,a),rank:m.card.rank,
    source_skill:SK.shuangxiong,source_skill_id:SK.shuangxiong,source_game:'三国杀',source_rule_id:ID.yanliangwenchou,logical_category:'trick'});
}
const duelView=()=>new Card('决斗',CardType.SCROLL,{virtual:true,materials:[],suit:null,color:null,rank:null,source_skill:SK.shuangxiong});
export const sgs_shuangxiong_targets=(g,a)=>g.all_players().filter(p=>p!==a&&live(p)&&g.can_duel_target(a,p,{allow_allies:true})&&g.can_trick_target(a,p,duelView()));
const duelPending=(g,a)=>Object.values(g.sgs_fire_assault_state?.duels??{}).some(r=>r.owner_id===identity(g,a)&&r.turn_id===turnId(g)&&!['ended','aborted'].includes(r.status));
export function sgs_shuangxiong_available(g,a,target=null){
  if(!own(a,SK.shuangxiong)||!idlePlay(g,a)||!stable(turnId(g))||duelPending(g,a)||!sgs_shuangxiong_materials(g,a).length)return false;
  const targets=sgs_shuangxiong_targets(g,a);return target==null?targets.length>0:targets.includes(target);
}
export function sgs_shuangxiong_unavailable_reason(g,a){
  if(!own(a,SK.shuangxiong))return '当前没有可用的双雄技能';
  if(!idlePlay(g,a))return '只能在自己的空闲出牌阶段使用决斗';
  if(!sgs_shuangxiong_colors(g,a).length)return '本回合尚无双雄的有效判定结果';
  if(!sgs_shuangxiong_materials(g,a).length)return '需要一张与本回合双雄判定结果异色的手牌';
  if(duelPending(g,a))return '双雄决斗正在结算';
  return sgs_shuangxiong_targets(g,a).length?'':'没有符合普通决斗限制的目标';
}
export async function sgs_resolve_shuangxiong(g,a,target,material){
  if(!sgs_shuangxiong_available(g,a,target))return false;
  const current=exact(sgs_shuangxiong_materials(g,a),material);if(!current||!uniquePhysical(g,current.card))return false;
  requireMovement(g);
  const logical=sgs_shuangxiong_card(g,a,current);if(!g.can_trick_target(a,target,logical))return false;
  const turn=turnId(g),phase=sgs_tianyi_phase_key(g,a),form=rule_hero(a)?.id;
  const event_id=nextId(g,'sgs.shuangxiong:duel'),receipt=state(g).duels[event_id]={event_id,owner_id:identity(g,a),target_id:identity(g,target),turn_id:turn,material_id:materialId(g,current.card),status:'reserved',committed:false};
  const valid=()=>own(a,SK.shuangxiong)&&idlePlay(g,a)&&turnId(g)===turn&&sgs_tianyi_phase_key(g,a)===phase&&rule_hero(a)?.id===form
    &&!!exact(sgs_shuangxiong_materials(g,a),current)&&sgs_shuangxiong_targets(g,a).includes(target)&&g.can_trick_target(a,target,logical);
  let scope;
  try{
    const result=await g.public_card_loss(a,[current],{to:'processing',reason:'双雄·当决斗使用',visibility:'public',action:'card_use',source_skill:SK.shuangxiong,move_id:`${event_id}:material`,validate:valid,
      on_committed:(cards,movement)=>{
        if(cards.length!==1||cards[0]!==current.card)throw Error('双雄必须使用唯一所选手牌');
        receipt.committed=true;receipt.status='committed';receipt.move_id=movement.move_id;
        scope=g.start_card_use(a,logical,{materials:[current.card],sourceZones:['hand']});receipt.history_use_id=scope.use_id;
      },
    });
    if(!result?.committed){receipt.status='aborted';return false;}
    if(!receipt.committed)throw Error('双雄缺少实体牌使用回执');
    if(live(a)&&live(target)&&continuing(g)&&g.processing_cards.includes(current.card)){
      receipt.status='resolving';
      await g.resolve_scroll(a,target,logical,{allow_allies:true,source_skill:SK.shuangxiong,source_skill_id:SK.shuangxiong,
        history_use_id:scope.use_id,physical_material:current.card,trick_declaration_validated:true});
    }
    receipt.status='ended';return true;
  }catch(error){receipt.status=receipt.committed?'failed_after_commit':'failed_before_commit';throw error;}
  finally{if(receipt.committed)g.finish_processing_card(logical);if(scope)g.end_card_use(scope);}
}
export async function sgs_player_shuangxiong(g,a,_fallback,args=[]){
  if(!sgs_shuangxiong_available(g,a)){g.view.emit(`双雄：${sgs_shuangxiong_unavailable_reason(g,a)}。`);return true;}
  const phase=sgs_tianyi_phase_key(g,a),form=rule_hero(a)?.id,turn=turnId(g);
  const valid=()=>turnId(g)===turn&&sgs_tianyi_phase_key(g,a)===phase&&rule_hero(a)?.id===form&&sgs_shuangxiong_available(g,a);
  const material=await chooseMaterial(g,a,sgs_shuangxiong_materials(g,a),SK.shuangxiong,'shuangxiong_material',args,{judgment_colors:sgs_shuangxiong_colors(g,a)});
  if(material===false)return false;if(!material||!valid())return true;
  const target=await chooseTarget(g,a,sgs_shuangxiong_targets(g,a),SK.shuangxiong,'shuangxiong_target');
  if(target&&valid()&&exact(sgs_shuangxiong_materials(g,a),material))await sgs_resolve_shuangxiong(g,a,target,material);return true;
}
export function sgs_ai_shuangxiong_choice(g,a){
  if(!sgs_shuangxiong_available(g,a))return null;
  const target=sgs_shuangxiong_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((x,y)=>x.hand.length-y.hand.length||x.hp-y.hp)[0];if(!target)return null;
  const material=sgs_shuangxiong_materials(g,a).sort((x,y)=>g.material_ai_cost(x)-g.material_ai_cost(y))
    .find(m=>!(m.card.type===CardType.TAO&&a.hp<(g.effective_max_hp?.(a)??rule_hero(a).max_hp)));
  return material?{target,material}:null;
}
export async function sgs_ai_shuangxiong(g,a){const c=sgs_ai_shuangxiong_choice(g,a);return c?sgs_resolve_shuangxiong(g,a,c.target,c.material):false;}
/** JSON-safe public state; no hidden materials, raw private receipts or RNG. */
export function sgs_fire_assault_public_state(g,a){
  const m=sgs_tianyi_modifiers(g,a),colors=sgs_shuangxiong_colors(g,a);
  return {turn_id:turnId(g),tianyi:{available:sgs_tianyi_available(g,a),phase_used:Boolean(g.sgs_fire_assault_state?.tianyi?.[sgs_tianyi_phase_key(g,a)]),
    wins:m.wins,sha_use_bonus:m.wins,sha_target_bonus:m.wins,sha_infinite_range:m.wins>0,sha_use_prohibited:m.lost,expires_on:'turn_end'},
    shuangxiong:{available:sgs_shuangxiong_available(g,a),judgment_colors:colors,eligible_material_colors:[CardColor.RED,CardColor.BLACK].filter(c=>colors.some(x=>x!==c)),expires_on:'turn_end'}};
}
export function sgs_fire_assault_skill_definitions({SkillHooks,ActiveSkillDef}){
  const tianyi=new ActiveSkillDef({skill_id:SK.tianyi,hotkey:'q',button_label:'天义',available:sgs_tianyi_available,player:sgs_player_tianyi,ai:sgs_ai_tianyi,
    help_text:'天义：每出牌阶段一次，与另一名角色拼点；赢后本回合杀次数和目标各+1、无距离限制；没赢则本回合不能使用杀，纯响应仍可'});
  Object.assign(tianyi,{owns_target_selection:true,targets:sgs_tianyi_targets,unavailable_reason:sgs_tianyi_unavailable_reason});
  const shuangxiong=new ActiveSkillDef({skill_id:SK.shuangxiong,hotkey:'q',button_label:'双雄·决斗',available:sgs_shuangxiong_available,player:sgs_player_shuangxiong,ai:sgs_ai_shuangxiong,
    help_text:'双雄：摸牌阶段可改为判定并获得最终判定牌；本回合可反复将与判定结果异色的一张手牌当普通决斗使用，可被无懈'});
  Object.assign(shuangxiong,{owns_target_selection:true,targets:sgs_shuangxiong_targets,unavailable_reason:sgs_shuangxiong_unavailable_reason});
  return {hooks:{[ID.taishici]:SkillHooks(),[ID.yanliangwenchou]:SkillHooks({replace_draw_phase:[sgs_replace_draw_phase_shuangxiong]})},
    active:{[ID.taishici]:[tianyi],[ID.yanliangwenchou]:[shuangxiong]}};
}
