/** Complete selected Mobile base 张嶷, source key zhangyi / ID zhang-yi.
 * 怃戎 is private simultaneous reveal, never Pindian. 矢志 is contextual
 * use/play identity only: physical reveal, discard and recast remain unchanged. */
import {Card,CardType,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';
import {snapshot_card_face} from './card-face-projection.js';
export const SGS_FOLLOWUP_ZHANGNI_RULE_IDS=Object.freeze({zhangni:'sgs.adapted.base.hero.zhang-yi',zhangyi:'sgs.adapted.base.hero.zhang-yi'});
export const SGS_FOLLOWUP_ZHANGNI_SKILL_IDS=Object.freeze({wurong:'sgs.wurong',shizhi:'sgs.shizhi'});
const ID=SGS_FOLLOWUP_ZHANGNI_RULE_IDS,SK=SGS_FOLLOWUP_ZHANGNI_SKILL_IDS,FIELD='sgs_followup_zhangni_state',SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
export const SGS_FOLLOWUP_ZHANGNI_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7']),
 heroes:Object.freeze([Object.freeze({id:ID.zhangni,name:'张嶷',max_hp:4,starting_hp:4,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'蜀',skill_ids:Object.freeze([SK.wurong,SK.shizhi]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
 literal_skill_text:Object.freeze({[SK.wurong]:'出牌阶段限一次，你可以和一名其他角色同时展示一张手牌：然后若你展示的牌是【杀】且该角色不是【闪】，你弃置此【杀】，然后对其造成1点伤害。若你展示的牌不是【杀】且该角色是【闪】，你弃置此牌，然后获得其一张牌。',[SK.shizhi]:'锁定技，当你体力值为1时，你的【闪】只能当做【杀】。'}),urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-190.html','https://wiki.biligame.com/msgs/张嶷','https://wiki.biligame.com/msgs/怃戎','https://wiki.biligame.com/msgs/矢志']),excluded_variants:Object.freeze(['界张嶷','谋弈四选','global 闪视为杀','HP <= 1']),slash_host_extension:Object.freeze(['血杀','毒杀','刺杀'])});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),key=JSON.stringify,copy=x=>JSON.parse(JSON.stringify(x));
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null,ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x)),select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const active=new WeakMap(),references=new WeakMap();
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!s.wurong||!s.phases||!s.responses||Object.values({...s.wurong,...s.responses}).some(r=>!stable(r.event_id)||!r.request||typeof r.committed!=='boolean'||!['offered','selecting','revealed','paying','paid','resolving','done','failed'].includes(r.status)))throw Error('Invalid Zhang Ni state');return s;}
function read(g,a){const s=a?.[FIELD];if(!s)return null;validate(s);if(s.owner_id!==pid(g,a))throw Error('张嶷事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('张嶷需要稳定人物ID');return read(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,wurong:{},phases:{},responses:{}});}
export const sgs_clone_followup_zhangni_state=a=>a?.[FIELD]?copy(validate(a[FIELD])):null;
function ticket(g,a,space,id,request,objects=[]){if(!stable(id))throw Error('张嶷需要稳定事件ID');const s=state(g,a),k=key(id),rk=`${space}:${k}`,old=s[space][k];let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());let refs=references.get(a);if(!refs)references.set(a,refs=new Map());
 if(old){if(key(old.request)!==key(request)||refs.has(rk)&&(refs.get(rk).length!==objects.length||refs.get(rk).some((x,i)=>x!==objects[i])))throw Error('同一张嶷事件不能更换人物、费用或事实');if(old.status!=='done'&&!jobs.has(old))throw Object.assign(Error('张嶷事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_FOLLOWUP_ZHANGNI_REPLAY_REQUIRED'});return null;}
 const r=s[space][k]={event_id:id,request,status:'offered',committed:false};jobs.add(r);refs.set(rk,objects);return {r,finish(){r.status='done';jobs.delete(r);},fail(e){r.status='failed';r.error=String(e?.message??e);jobs.delete(r);}};
}
function next(g,a,prefix){const s=state(g,a);let id;do{if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('张嶷事件计数耗尽');id=`${prefix}:${key([pid(g,a),++s.counter])}`;}while(s.wurong[key(id)]||s.responses[key(id)]);return id;}
function methods(g,...ns){for(const n of ns)if(typeof g[n]!=='function')throw Error(`张嶷接入缺少 ${n}`);}
function idle(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===seat(g,a)&&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(g.turn_event_counter)&&stable(a.play_phase_id)&&g.active_play_phase_id===a.play_phase_id&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
function unfinished(g,a,except=null){return Object.values(read(g,a)?.wurong??{}).some(r=>r!==except&&r.status!=='done');}
export const sgs_wurong_used=(g,a)=>Boolean(read(g,a)?.phases[key(a?.play_phase_id)]);
export function sgs_wurong_targets(g,a){return g.all_players().filter(p=>p!==a&&live(p)&&(p.hand?.length??0)>0);}
/** Private to this card owner; never pass another actor's choices to its AI. */
export function sgs_wurong_materials(g,a){if(!live(a))return [];return (a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}：${card}`})).filter(m=>m.card&&!m.card.virtual);}
const exact=(os,m)=>m&&os.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||o.epoch===m.epoch));
const locked=(g,a,m)=>Boolean(m&&a.hand?.[m.index]===m.card&&!m.card.virtual&&g.card_location_epoch(m.card)===m.epoch);
export const sgs_wurong_available=(g,a)=>owned(g,a,SK.wurong)&&idle(g,a)&&!sgs_wurong_used(g,a)&&!unfinished(g,a)&&sgs_wurong_materials(g,a).length>0&&sgs_wurong_targets(g,a).length>0;
export const sgs_wurong_unavailable_reason=(g,a)=>!owned(g,a,SK.wurong)?'当前不拥有怃戎':!idle(g,a)?'只能在自己的真实空闲出牌阶段发动':sgs_wurong_used(g,a)?'本出牌阶段已经展示过怃戎':unfinished(g,a)?'怃戎正在结算或需要恢复原事务':'双方都必须有手牌，且目标须为其他存活角色';
const materialRequest=(g,m)=>m?{zone:m.zone??null,index:m.index??null,physical_id:m.card?g.card_history_material_id(m.card):null,epoch:m.epoch??null}:null;
const meta=(g,a,stage,extra={})=>({skill:'怃戎',skill_id:SK.wurong,stage,private_to:seat(g,a),...extra});
/** Only chooser's own faces plus public team information. No commitments input. */
export function sgs_ai_wurong_reveal(g,chooser,initiator){const os=sgs_wurong_materials(g,chooser),enemy=typeof g.side_of==='function'&&g.side_of(chooser)!==g.side_of(initiator);return [...os].sort((x,y)=>{
 const score=m=>(g.material_ai_cost?.(m)??2)+(chooser===initiator?(is_sha_type(m.card.type)?-4:0):enemy&&m.card.type===CardType.SHAN?-8:0);return score(x)-score(y);})[0]??null;}
export function sgs_ai_wurong_plan(g,a){if(!sgs_wurong_available(g,a)||typeof g.side_of!=='function')return null;const target=sgs_wurong_targets(g,a).filter(p=>g.side_of(p)!==g.side_of(a)).sort((p,q)=>p.hp-q.hp)[0];return target?{target}:null;}
async function chooseTarget(g,a,r,valid){while(valid()){const os=sgs_wurong_targets(g,a).map(p=>({id:`target:${pid(g,p)}`,label:`${p.name}（${p.hp}血，${p.hand.length}张手牌）`,target:p}));if(!os.length)return null;const answer=await g.view.ask_line('怃戎：选择一名有手牌的其他角色，同时展示一张手牌',{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不消耗次数'}],meta:meta(g,a,'wurong_target',{event_id:r.event_id,allow_self:false,once_per_play_phase:true})});if(!valid()||pass(answer))return null;const p=select(os,answer)?.target;if(p)return p;}return null;}
async function chooseReveal(g,chooser,initiator,target,r,valid){if(chooser.is_ai)return sgs_ai_wurong_reveal(g,chooser,initiator);while(valid()){const os=sgs_wurong_materials(g,chooser);if(!os.length)return null;const answer=await g.view.ask_line('怃戎：秘密选择一张手牌，双方锁定后同时展示',{kind:'choice',player_id:seat(g,chooser),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消本次展示'}],meta:meta(g,chooser,'wurong_private_reveal',{event_id:r.event_id,owner_id:pid(g,initiator),target_id:pid(g,target),simultaneous:true,private_choice:true,material_zones:['hand'],exact_count:1})});if(!valid()||pass(answer))return null;const m=select(os,answer);if(m)return exact(sgs_wurong_materials(g,chooser),m)?m:null;}return null;}
function revealFace(g,a,m){const f=snapshot_card_face(m.card);return {actor_id:pid(g,a),physical_id:g.card_history_material_id(m.card),name:f.name,type:f.type,suit:typeof g.effective_suit==='function'?g.effective_suit(m.card,a,{action:'reveal',zone:'hand'}):f.suit??null,color:typeof g.effective_color==='function'?g.effective_color(m.card,a,{action:'reveal',zone:'hand'}):f.color??null,rank:f.rank??null};}
/** A target-hand choice is opaque: expose only a numbered slot, never its face. */
export function sgs_wurong_obtain_materials(g,a,target){if(!live(target)||target===a)return [];return [...(target.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}（未知）`,hidden:true})),...SLOTS.flatMap(zone=>target[zone]?[{id:`eq:${zone}`,zone,index:0,card:target[zone],epoch:g.card_location_epoch?.(target[zone])??0,label:`装备：${target[zone]}`,hidden:false}]:[])].filter(m=>g.can_obtain_material?.(a,target,m,{source_skill:SK.wurong})!==false);}
async function obtain(g,a,target,r){let material=null;const valid=()=>live(a)&&live(target)&&ongoing(g);while(valid()&&!material){const os=sgs_wurong_obtain_materials(g,a,target);if(!os.length)return false;if(a.is_ai)material=os.find(m=>m.zone!=='hand')??os[0];else{const answer=await g.view.ask_line(`怃戎：获得${target.name}的一张手牌或装备（手牌盲选）`,{kind:'choice',player_id:seat(g,a),options:os.map(({id,label,hidden})=>({id,label,hidden})),meta:meta(g,a,'wurong_obtain',{event_id:r.event_id,target_id:pid(g,target),hidden_hands:true,material_zones:['hand',...SLOTS],exact_count:1,mandatory:true})});if(!valid())return false;material=select(os,answer);if(material&&!exact(sgs_wurong_obtain_materials(g,a,target),material))return false;}}
 if(!material||!valid())return false;const legal=()=>valid()&&Boolean(exact(sgs_wurong_obtain_materials(g,a,target),material));const move=await g.public_card_loss(target,[material],{to:'hand',recipient:a,visibility:material.zone==='hand'?'private':'public',reason:'怃戎·获得',action:'obtain',semantic_action:'obtain',source:a,source_skill:SK.wurong,move_id:`wurong:${key([pid(g,a),r.event_id])}:obtain`,validate:legal,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==material.card)throw Error('怃戎获得须为所选的一张实体牌');r.obtained=true;r.obtain_zone=material.zone;r.obtain_move_id=movement.move_id;r.obtained_card_id=g.card_history_material_id(cards[0]);}});return Boolean(move?.committed);
}
/** Direct material inputs are trusted host/test selections, never public command
 * IDs for an opponent's private choice. Interactive and AI flows always ask
 * each actual controller independently before the sole simultaneous reveal. */
export async function sgs_wurong_execute(g,a,{event_id=null,phase_id=null,target=null,material=null,target_material=null,choose:interactive=false}={}){
 const phase=phase_id??a?.play_phase_id,old=event_id!==null?read(g,a)?.wurong[key(event_id)]:null;
 if(!old&&(!sgs_wurong_available(g,a)||phase!==a.play_phase_id||target&&!sgs_wurong_targets(g,a).includes(target)||!interactive&&(!target||!exact(sgs_wurong_materials(g,a),material)||!exact(sgs_wurong_materials(g,target),target_material))))return false;
 methods(g,'card_history_material_id','card_location_epoch','public_card_loss','apply_damage');if(g.public_card_loss_supports_on_committed!==true)throw Error('怃戎需要原子费用回执');
 const request={owner_id:pid(g,a),phase_id:phase,choose:interactive,target_id:pid(g,target),material:materialRequest(g,material),target_material:materialRequest(g,target_material)},objects=[...(target?[target]:[]),...(material?[material.card]:[]),...(target_material?[target_material.card]:[])];
 if(old){ticket(g,a,'wurong',event_id,request,objects);return false;}
 const t=ticket(g,a,'wurong',event_id??next(g,a,'wurong'),request,objects),r=t.r,s=state(g,a),turn=g.turn_event_counter,bound=binding(g,a,SK.wurong);r.turn_id=turn;
 const valid=()=>owned(g,a,SK.wurong)&&idle(g,a)&&g.turn_event_counter===turn&&a.play_phase_id===phase&&binding(g,a,SK.wurong)===bound&&!sgs_wurong_used(g,a)&&!unfinished(g,a,r);
 try{r.status='selecting';target=target??await chooseTarget(g,a,r,valid);const pairValid=()=>valid()&&target&&sgs_wurong_targets(g,a).includes(target);if(!pairValid()){r.cancelled=true;t.finish();return false;}
  if(interactive){material=await chooseReveal(g,a,a,target,r,pairValid);if(!material||!pairValid()){r.cancelled=true;t.finish();return false;}r.private_owner_selection=materialRequest(g,material);target_material=await chooseReveal(g,target,a,target,r,()=>pairValid()&&locked(g,a,material));}
  else{material={...material,epoch:g.card_location_epoch(material.card)};target_material={...target_material,epoch:g.card_location_epoch(target_material.card)};}
  if(!pairValid()||!locked(g,a,material)||!locked(g,target,target_material)){delete r.private_owner_selection;r.cancelled=true;t.finish();return false;}
  const ownFace=revealFace(g,a,material),otherFace=revealFace(g,target,target_material);r.reveal=[ownFace,otherFace];r.target_id=pid(g,target);r.committed=true;r.status='revealed';s.phases[key(phase)]={phase_id:phase,turn_id:turn,event_id:r.event_id};delete r.private_owner_selection;
  r.branch=is_sha_type(ownFace.type)&&otherFace.type!==CardType.SHAN?'damage':!is_sha_type(ownFace.type)&&otherFace.type===CardType.SHAN?'obtain':'none';
  g.view.emit(`${a.name}与${target.name}发动怃戎，同时展示：${a.name}【${ownFace.name}】，${target.name}【${otherFace.name}】。`,{event_type:'wurong_reveal',skill_id:SK.wurong,event_id:r.event_id,phase_id:phase,simultaneous:true,public_reveal:true,cards:copy(r.reveal),branch:r.branch});
  if(r.branch!=='none'){
   const payable=()=>live(a)&&live(target)&&ongoing(g)&&locked(g,a,material)&&g.can_discard_material?.(a,material,{source:a,source_skill:SK.wurong})!==false;r.status='paying';
   const paid=await g.public_card_loss(a,[material],{to:'discard',visibility:'public',reason:'怃戎·成功分支费用',action:'discard',semantic_action:'discard',source:a,source_skill:SK.wurong,move_id:`wurong:${key([pid(g,a),r.event_id])}:cost`,validate:payable,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==material.card)throw Error('怃戎只能弃自己展示的实体牌');r.paid=true;r.status='paid';r.cost_move_id=movement.move_id;}});
   if(Boolean(paid?.committed)!==Boolean(r.paid))throw Error('怃戎缺少一致原子费用回执');
   if(r.paid&&live(a)&&live(target)&&ongoing(g)){r.status='resolving';if(r.branch==='damage'){r.damage_requested=1;await g.apply_damage(target,1,{source:a,kind:'skill',source_skill:SK.wurong,skill_initiator:a,nature:'normal',card_user:null,source_card:null,physical_cards:[],message:'{name}受到怃戎造成的 {damage} 点伤害，剩余血量 {hp}。'});r.damage_resolved=true;}else await obtain(g,a,target,r);}
   else r.stopped=!r.paid?'unpaid':!live(a)?'owner_dead':!live(target)?'target_dead':'match_closed';
  }
  t.finish();return true;
 }catch(e){delete r.private_owner_selection;t.fail(e);throw e;}
}
export async function sgs_player_wurong(g,a){if(!sgs_wurong_available(g,a)){g.view.emit(`怃戎：${sgs_wurong_unavailable_reason(g,a)}。`);return true;}await sgs_wurong_execute(g,a,{choose:true});return true;}
export async function sgs_ai_wurong(g,a){const p=sgs_ai_wurong_plan(g,a);return p?sgs_wurong_execute(g,a,{...p,choose:true}):false;}
/** Pure contextual view. It never mutates the physical card, installs a face or
 * enters a zone. Caller owns request legality, ordinary Slash quota/range and
 * must revalidate HP/skill/binding immediately before physical commitment. */
export function sgs_shizhi_use_face(g,a,card,{action='use',zone='hand'}={}){if(!['use','play'].includes(action)||zone!=='hand'||!owned(g,a,SK.shizhi)||a.hp!==1||!card||card.virtual||card.type!==CardType.SHAN)return null;return new Card('杀',CardType.SHA,{virtual:true,materials:[card],suit:typeof g.effective_suit==='function'?g.effective_suit(card,a,{zone,action}):card.suit,color:typeof g.effective_color==='function'?g.effective_color(card,a,{zone,action}):card.color,rank:card.rank,source_skill:SK.shizhi,logical_category:'basic',action_kind:action});}
/** This final contextual filter has priority over all optional conversion
 * candidates involving a physical SHAN, including multi-material responses. */
export function sgs_shizhi_response_materials(g,a,type,ordinary=[]){if(!owned(g,a,SK.shizhi)||a.hp!==1)return ordinary;
 const hasShan=m=>m.zone==='hand'?m.card?.type===CardType.SHAN:m.zone==='multi_hand'&&(m.cards??[]).some(c=>c.type===CardType.SHAN);
 const filtered=ordinary.filter(m=>!hasShan(m));if(type!==CardType.SHA)return filtered;
 const converted=sgs_wurong_materials(g,a).filter(m=>m.card.type===CardType.SHAN).map(m=>({...m,label:`矢志：${m.label}当杀`,source_skill:SK.shizhi,source_skill_id:SK.shizhi,response_type:CardType.SHA,shizhi_binding:binding(g,a,SK.shizhi)}));return [...filtered,...converted];
}
function legalResponse(c,action){return ['use','play'].includes(action)&&c.legal!==false&&!c.cancelled&&!c.closed&&!c.prohibited&&!c.response_prohibited&&!(action==='use'?c.use_prohibited:c.play_prohibited);}
/** Hook owns exactly ONE physical move and ONE after_response_card event.
 * The host must not consume the same material after handled:true. */
export async function sgs_commit_shizhi_response(g,a,type,material,context={}){
 const claimed=material?.source_skill===SK.shizhi,physical=material?.card;
 const oldId=context.shizhi_event_id??context.response_event_id;if(oldId!==undefined&&read(g,a)?.responses[key(oldId)]){const request={actor_id:pid(g,a),type,action:context.action_kind??'play',physical_id:g.card_history_material_id(physical),response_id:context.response_event_id??null,kind:context.kind??null,card_use_id:context.card_use_id??null,branch_id:context.branch_id??null};ticket(g,a,'responses',oldId,request,[physical]);return {handled:true,success:false,duplicate:true};}
 if(owned(g,a,SK.shizhi)&&a.hp===1&&material?.zone==='multi_hand'&&(material.cards??[]).some(c=>c.type===CardType.SHAN))return {handled:true,success:false};
 const applies=owned(g,a,SK.shizhi)&&a.hp===1&&material?.zone==='hand'&&physical?.type===CardType.SHAN;
 if(!claimed&&!applies)return {handled:false,success:false};if(type!==CardType.SHA||!applies)return {handled:true,success:false};
 const action=context.action_kind??'play',bound=material.shizhi_binding??binding(g,a,SK.shizhi),epoch=material.epoch??g.card_location_epoch(physical);
 const valid=()=>owned(g,a,SK.shizhi)&&a.hp===1&&binding(g,a,SK.shizhi)===bound&&legalResponse(context,action)&&!g.sha_response_prohibited?.(a)&&a.hand?.[material.index]===physical&&physical.type===CardType.SHAN&&g.card_location_epoch(physical)===epoch;
 if(!valid())return {handled:true,success:false};methods(g,'public_card_loss','card_history_material_id','card_location_epoch','after_response_card','finish_processing_card');if(g.public_card_loss_supports_on_committed!==true)throw Error('矢志需要原子响应材料回执');
 const id=context.shizhi_event_id??context.response_event_id??next(g,a,'shizhi-response'),request={actor_id:pid(g,a),type,action,physical_id:g.card_history_material_id(physical),response_id:context.response_event_id??null,kind:context.kind??null,card_use_id:context.card_use_id??null,branch_id:context.branch_id??null};
 const t=ticket(g,a,'responses',id,request,[physical]);if(!t)return {handled:true,success:false,duplicate:true};const r=t.r,logical=sgs_shizhi_use_face(g,a,physical,{action}),effective_face={suit:logical.suit,color:logical.color,rank:logical.rank};
 try{r.status='paying';const paid=await g.public_card_loss(a,[material],{to:'processing',visibility:'public',reason:'矢志·闪当杀响应',action:action==='use'?'card_use':'response',semantic_action:action==='use'?'card_use':'response',source:a,source_skill:SK.shizhi,move_id:`shizhi:${key([pid(g,a),id])}:material`,validate:valid,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==physical)throw Error('矢志必须消耗一张原实体闪');r.committed=true;r.status='paid';r.move_id=movement.move_id;}});
  if(Boolean(paid?.committed)!==r.committed)throw Error('矢志缺少一致响应回执');if(!r.committed||!live(a)||!ongoing(g)||!g.processing_cards.includes(physical)){r.stopped=!r.committed?'stale':'material_or_actor_unavailable';t.finish();return {handled:true,success:false};}
  // HP changes after a fully committed payment do not rewrite that declaration.
  g.record_sha_activity?.(a);r.status='resolving';const event=await g.after_response_card(a,CardType.SHA,{...context,action_kind:action,virtual:true,source_skill:SK.shizhi,material,card:logical,physical_card:physical,physical_cards:[physical],effective_face,response_provenance:{kind:'skill_conversion',skill_id:SK.shizhi,physical_cards:[physical],material_zone:'hand'}});r.response_id=event?.response_id??event?.id??null;r.success=true;t.finish();return {handled:true,success:true,card:logical,event};
 }catch(e){t.fail(e);throw e;}finally{if(r.committed)g.finish_processing_card(logical);}
}
export function sgs_followup_zhangni_public_state(a,g=null){const s=a?.[FIELD]?validate(a[FIELD]):null;return {wurong_used:g?sgs_wurong_used(g,a):Boolean(s?.phases[key(a?.play_phase_id)]),shizhi_active:g?owned(g,a,SK.shizhi)&&a.hp===1:a?.hp===1&&(a?.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK.shizhi),wurong_events:Object.values(s?.wurong??{}).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,turn_id:r.turn_id??null,status:r.status,committed:r.committed,reveal:r.committed?copy(r.reveal??[]):[],target_id:r.committed?r.target_id:null,branch:r.committed?r.branch:null,paid:r.paid===true,obtained:r.obtained===true,obtain_zone:r.obtain_zone??null,damage_resolved:r.damage_resolved===true,cancelled:r.cancelled===true,stopped:r.stopped??null})),shizhi_responses:Object.values(s?.responses??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,success:r.success===true,response_id:r.response_id??null}))};}
export function sgs_followup_zhangni_skill_definitions({SkillHooks,ActiveSkillDef}){const skill=new ActiveSkillDef({skill_id:SK.wurong,hotkey:'q',button_label:'怃戎',available:sgs_wurong_available,player:sgs_player_wurong,ai:sgs_ai_wurong,help_text:'出牌阶段限一次，与其他角色各秘密选一张手牌同时展示。杀对非闪：弃自己的牌并造成1伤害；非杀对闪：弃自己的牌并获得对方一张手牌或装备；其余双方留牌。'});skill.source_skill_id=SK.wurong;skill.owns_target_selection=true;skill.unavailable_reason=sgs_wurong_unavailable_reason;return {hooks:{[ID.zhangni]:SkillHooks({response_material_name:'矢志',resolve_response_material:[sgs_commit_shizhi_response]})},active:{[ID.zhangni]:[skill]}};}
sgs_commit_shizhi_response.source_skill_id=SK.shizhi;
