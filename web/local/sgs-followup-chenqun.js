/** Complete selected Mobile base 陈群, 2026-10-15. H0 initialization and
 * H1–H7 host extensions are explicit; no current-client certification. */
import {CardType,CardColor,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';
export const SGS_FOLLOWUP_CHENQUN_RULE_IDS=Object.freeze({chenqun:'sgs.adapted.base.hero.chen-qun'});
export const SGS_FOLLOWUP_CHENQUN_SKILL_IDS=Object.freeze({dingpin:'sgs.dingpin',faen:'sgs.faen'});
const ID=SGS_FOLLOWUP_CHENQUN_RULE_IDS,SK=SGS_FOLLOWUP_CHENQUN_SKILL_IDS,FIELD='sgs_followup_chenqun_state';
export const SGS_FOLLOWUP_CHENQUN_SOURCE=Object.freeze({product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
 current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
 host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H5','H6','H7']),heroes:Object.freeze([Object.freeze({id:ID.chenqun,name:'陈群',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:'male',source_faction:'魏',skill_ids:Object.freeze([SK.dingpin,SK.faen]),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
 literal_skill_text:Object.freeze({[SK.dingpin]:'出牌阶段，你可以弃置一张手牌（不能是你本回合使用或弃置过的类型）并选择一名已受伤的角色，令其进行判定，若结果为：黑色，该角色摸X张牌（X为其已损失的体力值），然后你于此回合内不能对其发动“定品”；红色，你翻面。',[SK.faen]:'当一名角色翻面或铁索连环后，你可以令其摸一张牌。'}),
 urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-176.html','https://wiki.biligame.com/msgs/陈群','https://wiki.biligame.com/msgs/定品','https://wiki.biligame.com/msgs/法恩']),excluded_variants:Object.freeze(['界陈群','red judgment HP loss','only face-up 法恩','unchain 法恩'])});
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0),key=JSON.stringify,copy=x=>JSON.parse(JSON.stringify(x));
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(id):g.has_general_skill?.(a,id)===true);
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x)),select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
const active=new WeakMap(),refs=new WeakMap();
function validate(s){if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!s.dingpin||!s.faen||!s.black_targets||Object.values({...s.dingpin,...s.faen}).some(r=>!stable(r.event_id)||!r.request||typeof r.committed!=='boolean'||!['offered','paying','paid','judging','drawing','flipping','done','failed'].includes(r.status)))throw Error('Invalid Chen Qun state');return s;}
function read(g,a){const s=a?.[FIELD];if(!s)return null;validate(s);if(s.owner_id!==pid(g,a))throw Error('陈群事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('陈群需要稳定人物ID');return read(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,dingpin:{},faen:{},black_targets:{}});}
export const sgs_clone_followup_chenqun_state=a=>a?.[FIELD]?copy(validate(a[FIELD])):null;
function ticket(g,a,space,id,request,objects=[]){
 if(!stable(id))throw Error('陈群需要稳定事件ID');const s=state(g,a),k=key(id),rk=`${space}:${k}`,old=s[space][k];let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());let known=refs.get(a);if(!known)refs.set(a,known=new Map());
 if(old){if(key(old.request)!==key(request)||known.has(rk)&&(known.get(rk).length!==objects.length||known.get(rk).some((x,i)=>x!==objects[i])))throw Error('同一陈群事件不能更换人物、费用或事实');if(old.status!=='done'&&!jobs.has(old))throw Object.assign(Error('陈群事务中断；须恢复原协程或按原输入日志重放'),{code:'SGS_FOLLOWUP_CHENQUN_REPLAY_REQUIRED'});return null;}
 const r=s[space][k]={event_id:id,request,status:'offered',committed:false};jobs.add(r);known.set(rk,objects);return {r,finish(){r.status='done';jobs.delete(r);},fail(e){r.status='failed';r.error=String(e?.message??e);jobs.delete(r);}};
}
function methods(g,...ns){for(const n of ns)if(typeof g[n]!=='function')throw Error(`陈群接入缺少 ${n}`);}
function idle(g,a){return live(a)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_phase==='play'&&g.turn_actor===seat(g,a)&&g.is_own_play_phase?.(a)===true&&!a.skip_play_stage&&stable(g.turn_event_counter)&&stable(a.play_phase_id)&&g.active_play_phase_id===a.play_phase_id&&!['response_stack','card_history_stack','damage_stack','judgment_stack','dying_stack','sha_target_stack'].some(k=>g[k]?.length);}
function unfinished(g,a,except=null){return Object.values(read(g,a)?.dingpin??{}).some(r=>r!==except&&r.status!=='done');}
/** Explicit three-category host mapping; delay and ordinary trick share one. */
export function sgs_dingpin_card_category(card){if(!card)return null;if(card.type===CardType.SCROLL)return 'trick';if([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE].includes(card.type))return 'equipment';if(is_sha_type(card.type)||[CardType.SHAN,CardType.TAO,CardType.WINE,CardType.POISON].includes(card.type))return 'basic';return null;}
export function sgs_dingpin_categories(g,a){
 methods(g,'used_or_discarded_card_categories');const values=g.used_or_discarded_card_categories(a,{turn_id:g.turn_event_counter});if(!Array.isArray(values)||values.some(x=>!['basic','trick','equipment'].includes(x)))throw Error('定品需要真实三类别回合历史');
 const paid=Object.values(read(g,a)?.dingpin??{}).filter(r=>r.committed&&r.turn_id===g.turn_event_counter).map(r=>r.category);return [...new Set([...values,...paid])];
}
export const sgs_dingpin_black_targets=(g,a)=>[...(read(g,a)?.black_targets[key(g.turn_event_counter)]??[])];
export function sgs_dingpin_materials(g,a){if(!live(a))return [];const used=sgs_dingpin_categories(g,a);return (a.hand??[]).map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,epoch:g.card_location_epoch?.(card)??0,label:`手牌${index+1}：${card}`,category:sgs_dingpin_card_category(card)})).filter(m=>m.card&&!m.card.virtual&&m.category&&!used.includes(m.category)&&g.can_discard_material?.(a,m,{source:a,source_skill:SK.dingpin})!==false);}
const maximum=(g,a)=>g.effective_max_hp?.(a)??a.max_hp??a.hero?.max_hp??rule_hero(a)?.max_hp;
export function sgs_dingpin_targets(g,a){const used=sgs_dingpin_black_targets(g,a);return g.all_players().filter(p=>live(p)&&p.hp<maximum(g,p)&&!used.includes(pid(g,p)));}
const exact=(os,m)=>m&&os.find(o=>o.zone===m.zone&&o.index===m.index&&o.card===m.card&&(m.epoch===undefined||o.epoch===m.epoch));
export const sgs_dingpin_available=(g,a)=>owned(g,a,SK.dingpin)&&idle(g,a)&&!unfinished(g,a)&&sgs_dingpin_materials(g,a).length>0&&sgs_dingpin_targets(g,a).length>0;
export const sgs_dingpin_unavailable_reason=(g,a)=>!owned(g,a,SK.dingpin)?'当前不拥有定品':!idle(g,a)?'只能在自己的真实空闲出牌阶段发动':unfinished(g,a)?'定品正在结算或需要恢复原事务':'需要本回合未使用或弃置类别的手牌，以及未被定品判黑的受伤角色';
const materialRequest=(g,m)=>m?{zone:m.zone??null,index:m.index??null,physical_id:m.card?g.card_history_material_id(m.card):null,epoch:m.epoch??null}:null;
const metadata=(g,a,skill,stage,extra={})=>({skill:skill===SK.dingpin?'定品':'法恩',skill_id:skill,stage,private_to:seat(g,a),...extra});
async function choose(g,a,r,valid){let material=null,target=null;
 while(valid()&&!material){const os=sgs_dingpin_materials(g,a);if(!os.length)return null;const answer=await g.view.ask_line('定品：弃置本回合未使用或弃置类别的一张手牌',{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌'}],meta:metadata(g,a,SK.dingpin,'dingpin_material',{event_id:r.event_id,used_categories:sgs_dingpin_categories(g,a),material_zones:['hand'],exact_count:1})});if(!valid()||pass(answer))return null;material=select(os,answer);if(material&&!exact(sgs_dingpin_materials(g,a),material))return null;}
 while(valid()&&!target){if(!exact(sgs_dingpin_materials(g,a),material))return null;const ts=sgs_dingpin_targets(g,a),os=ts.map(p=>({id:`target:${pid(g,p)}`,label:`${p.name}（${p.hp}/${maximum(g,p)}）`,target:p}));if(!os.length)return null;const answer=await g.view.ask_line('定品：选择一名受伤角色判定，可选自己',{kind:'choice',player_id:seat(g,a),options:[...os.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不弃牌'}],meta:metadata(g,a,SK.dingpin,'dingpin_target',{event_id:r.event_id,allow_self:true,black_target_ids:sgs_dingpin_black_targets(g,a)})});if(!valid()||pass(answer))return null;target=select(os,answer)?.target??null;}
 return material&&target?{material,target}:null;
}
export async function sgs_dingpin_execute(g,a,{event_id=null,phase_id=null,material=null,target=null,choose:interactive=false}={}){
 const phase=phase_id??a?.play_phase_id,old=event_id!==null?read(g,a)?.dingpin[key(event_id)]:null;
 if(!old&&(!sgs_dingpin_available(g,a)||phase!==a.play_phase_id||!interactive&&(!exact(sgs_dingpin_materials(g,a),material)||!sgs_dingpin_targets(g,a).includes(target))))return false;
 methods(g,'public_card_loss','card_history_material_id','card_location_epoch','reveal_judgment','finish_judgment_card','draw_cards','flip_general');if(g.public_card_loss_supports_on_committed!==true)throw Error('定品需要原子费用回执');
 const request={owner_id:pid(g,a),phase_id:phase,choose:interactive,material:materialRequest(g,material),target_id:pid(g,target)},objects=[...(material?[material.card]:[]),...(target?[target]:[])];
 if(old){ticket(g,a,'dingpin',event_id,request,objects);return false;}
 const s=state(g,a);let id=event_id;if(id===null)do{if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('定品事件计数耗尽');id=`dingpin:${key([pid(g,a),++s.counter])}`;}while(s.dingpin[key(id)]);const t=ticket(g,a,'dingpin',id,request,objects),r=t.r,turn=g.turn_event_counter,bound=binding(g,a,SK.dingpin);r.turn_id=turn;
 const valid=()=>owned(g,a,SK.dingpin)&&idle(g,a)&&a.play_phase_id===phase&&g.turn_event_counter===turn&&binding(g,a,SK.dingpin)===bound&&!unfinished(g,a,r);
 try{const chosen=interactive?await choose(g,a,r,valid):{material:{...material,epoch:g.card_location_epoch(material.card)},target};const legal=()=>valid()&&chosen&&Boolean(exact(sgs_dingpin_materials(g,a),chosen.material))&&sgs_dingpin_targets(g,a).includes(chosen.target);
  if(!legal()){r.cancelled=true;t.finish();return false;}const m=chosen.material,p=chosen.target;r.target_id=pid(g,p);r.category=m.category??sgs_dingpin_card_category(m.card);r.status='paying';
  const paid=await g.public_card_loss(a,[m],{to:'discard',visibility:'public',reason:'定品·费用',action:'discard',semantic_action:'discard',source:a,source_skill:SK.dingpin,move_id:`dingpin:${key([pid(g,a),id])}:cost`,validate:legal,on_committed:(cards,movement)=>{if(cards.length!==1||cards[0]!==m.card)throw Error('定品必须恰好弃置所选实体手牌');r.committed=true;r.status='paid';r.cost_move_id=movement.move_id;r.paid_card_id=g.card_history_material_id(m.card);}});
  if(Boolean(paid?.committed)!==r.committed)throw Error('定品缺少一致原子费用回执');if(!r.committed){r.cancelled=true;t.finish();return false;}
  if(live(a)&&live(p)&&ongoing(g)){r.status='judging';let judgment=null;try{judgment=await g.reveal_judgment(p,'定品',{good_for:p,favorable:c=>c.color===CardColor.BLACK});r.judgment=judgment?{name:judgment.name,type:judgment.type,suit:judgment.suit??null,color:judgment.color??null,rank:judgment.rank??null}:null;
    if(judgment&&live(a)&&live(p)&&ongoing(g)){if(judgment.color===CardColor.BLACK){r.branch='black';r.requested=Math.max(0,maximum(g,p)-p.hp);r.status='drawing';const cs=await g.draw_cards(p,r.requested);if(!Array.isArray(cs)||cs.length>r.requested)throw Error('定品需要实际摸牌回执');r.drawn=cs.length;s.black_targets[key(turn)]??=[];if(!s.black_targets[key(turn)].includes(pid(g,p)))s.black_targets[key(turn)].push(pid(g,p));}
      else if(judgment.color===CardColor.RED){r.branch='red';r.status='flipping';r.flipped=await g.flip_general(a,{source_skill:SK.dingpin,event_id:`dingpin:${key([pid(g,a),id])}:flip`});}else r.branch='colorless';}
   }finally{if(judgment)await g.finish_judgment_card(judgment);}}
  else r.stopped=!live(a)?'owner_dead':!live(p)?'target_dead':'match_closed';t.finish();g.view.emit(`${a.name}发动定品，${r.branch==='black'?`${p.name}摸${r.drawn}张牌，本回合不能再选为定品目标`:r.branch==='red'?'自己翻面':'本次未产生红黑分支效果'}。`,{event_type:'skill_resolution',skill_id:SK.dingpin,event_id:id,target_id:r.target_id,branch:r.branch??null,drawn:r.drawn??0});return true;
 }catch(e){t.fail(e);throw e;}
}
export async function sgs_player_dingpin(g,a){if(!sgs_dingpin_available(g,a)){g.view.emit(`定品：${sgs_dingpin_unavailable_reason(g,a)}。`);return true;}await sgs_dingpin_execute(g,a,{choose:true});return true;}
export function sgs_ai_dingpin_plan(g,a){if(!sgs_dingpin_available(g,a)||typeof g.side_of!=='function')return null;const targets=sgs_dingpin_targets(g,a).filter(p=>p===a||g.side_of(p)===g.side_of(a)).sort((p,q)=>(maximum(g,q)-q.hp)-(maximum(g,p)-p.hp));if(!targets.length)return null;const materials=sgs_dingpin_materials(g,a).filter(m=>m.card.type!==CardType.POISON||a.hp>1).sort((x,y)=>(g.material_ai_cost?.(x)??2)-(g.material_ai_cost?.(y)??2));return materials.length?{target:targets[0],material:materials[0]}:null;}
export async function sgs_ai_dingpin(g,a){const p=sgs_ai_dingpin_plan(g,a);return p?sgs_dingpin_execute(g,a,p):false;}
const stateFacts=(g,e)=>({state_event_id:e.state_event_id??null,actor_id:pid(g,e.actor),kind:e.kind??null,from:e.from??null,to:e.to??null});
function stateWindow(g,a,e){return owned(g,a,SK.faen)&&Boolean(e.actor&&!e.actor.dead)&&ongoing(g)&&stable(e.state_event_id)&&e.committed===true&&!e.closed&&!e.cancelled&&((e.kind==='flip'&&['face_up','face_down'].includes(e.from)&&['face_up','face_down'].includes(e.to)&&e.from!==e.to)||(e.kind==='chain'&&e.from===false&&e.to===true));}
export const sgs_ai_faen=(g,a,target)=>target===a||typeof g.side_of==='function'&&g.side_of(a)===g.side_of(target);
/** Global dispatcher owns event identity, current action order, and lifetime. */
export async function sgs_on_general_state_changed_faen(g,a,e={}){
 const request=stateFacts(g,e),old=read(g,a)?.faen[key(e.state_event_id)];if(old){ticket(g,a,'faen',e.state_event_id,request,[e.actor]);return false;}if(!stateWindow(g,a,e))return false;
 methods(g,'draw_cards');const t=ticket(g,a,'faen',e.state_event_id,request,[e.actor]),r=t.r,bound=binding(g,a,SK.faen),valid=()=>stateWindow(g,a,e)&&binding(g,a,SK.faen)===bound&&key(stateFacts(g,e))===key(request);
 try{let yes=a.is_ai?sgs_ai_faen(g,a,e.actor):false;if(!a.is_ai)while(valid()){const answer=await g.view.ask_line(`法恩：${e.actor.name}${e.kind==='flip'?'刚翻面':'刚进入连环'}，是否令其摸一张牌？`,{kind:'choice',player_id:seat(g,a),options:[{id:'activate',label:'令其摸一张牌'},{id:'pass',label:'不发动'}],meta:metadata(g,a,SK.faen,'faen_offer',{state_event_id:e.state_event_id,target_id:pid(g,e.actor),optional:true,fixed_target:true,change_kind:e.kind})});if(pass(answer))break;if(['activate','1','y','yes'].includes(String(answer))){yes=true;break;}}
  if(!valid()||!yes){r.cancelled=!valid();r.declined=!yes;t.finish();return false;}r.committed=true;r.status='drawing';const cs=await g.draw_cards(e.actor,1);if(!Array.isArray(cs)||cs.length>1)throw Error('法恩需要实际摸牌回执');r.drawn=cs.length;t.finish();g.view.emit(`${a.name}发动法恩，令${e.actor.name}摸${r.drawn}张牌。`,{event_type:'skill_resolution',skill_id:SK.faen,state_event_id:e.state_event_id,target_id:pid(g,e.actor),drawn:r.drawn});return true;
 }catch(error){t.fail(error);throw error;}
}
export function sgs_followup_chenqun_public_state(a,g=null){const s=a?.[FIELD]?validate(a[FIELD]):null;return {used_categories:g?sgs_dingpin_categories(g,a):[],black_target_ids:g?sgs_dingpin_black_targets(g,a):[],dingpin_events:Object.values(s?.dingpin??{}).map(r=>({event_id:r.event_id,phase_id:r.request.phase_id,turn_id:r.turn_id??null,status:r.status,committed:r.committed,category:r.committed?r.category:null,target_id:r.committed?r.target_id:null,branch:r.branch??null,judgment:r.judgment?copy(r.judgment):null,requested:r.requested??0,drawn:r.drawn??0,cancelled:r.cancelled===true,stopped:r.stopped??null})),faen_events:Object.values(s?.faen??{}).map(r=>({state_event_id:r.event_id,...copy(r.request),status:r.status,committed:r.committed,drawn:r.drawn??0,declined:r.declined===true,cancelled:r.cancelled===true}))};}
export function sgs_followup_chenqun_skill_definitions({SkillHooks,ActiveSkillDef}){const skill=new ActiveSkillDef({skill_id:SK.dingpin,hotkey:'q',button_label:'定品',available:sgs_dingpin_available,player:sgs_player_dingpin,ai:sgs_ai_dingpin,help_text:'弃置本回合未使用或弃置类别的一张手牌，令一名受伤角色判定。黑色摸已损失体力值张牌并禁选；红色自己翻面。'});skill.source_skill_id=SK.dingpin;skill.owns_target_selection=true;skill.unavailable_reason=sgs_dingpin_unavailable_reason;return {hooks:{[ID.chenqun]:SkillHooks({on_any_general_state_changed:[sgs_on_general_state_changed_faen]})},active:{[ID.chenqun]:[skill]}};}
sgs_on_general_state_changed_faen.source_skill_id=SK.faen;
