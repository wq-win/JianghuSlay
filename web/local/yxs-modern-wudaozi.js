/** 吴道子：3 血、完整固有技能画圣。2026-02-02 官方发布规则。
 * H4/H8/H9 are explicitly mixed-game contracts, not native 宝具 certification.
 * The input is a trusted formable Slash resource, never an intermediate USE. */
import {Card,CardType,is_sha_type} from './models.js';
import {rule_hero} from './effective-hero.js';

export const YXS_MODERN_WUDAOZI_RULE_IDS=Object.freeze({wudaozi:'yxs.mobile.published.hero.wu-dao-zi.2026'});
export const YXS_MODERN_WUDAOZI_SKILL_IDS=Object.freeze({huasheng:'yxs.huasheng'});
export const YXS_MODERN_WUDAOZI_SOURCE=Object.freeze({product:'腾讯英雄杀手游',snapshot_date:'2026-10-15',publication_date:'2026-02-02',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,image_panels_read:false,
  heroes:Object.freeze([Object.freeze({id:YXS_MODERN_WUDAOZI_RULE_IDS.wudaozi,name:'吴道子',max_hp:3,starting_hp:3,
    starting_hp_direct_source_value:null,starting_hp_basis:'H0 host full-HP initialization',gender:null,source_faction:null,
    skill_ids:Object.freeze(['yxs.huasheng']),personal_lord_skill_ids:Object.freeze([]),granted_skill_ids:Object.freeze([]),acquired_skill_ids:Object.freeze([])})]),
  urls:Object.freeze(['https://www.taptap.cn/moment/767485734243272517']),
  host_policy_ids:Object.freeze(['H0','H1','H2','H3','H4','H8','H9','H10']),native_metadata_complete:false,
  native_perks_implemented:false,native_perk_composition_status:'held: no primary-source native 傲剑/战神 composition ruling',
  mode_evidence:'Ownable hero announced; all ordinary-mode pools unverified',
});
const SK='yxs.huasheng',FIELD='yxs_modern_wudaozi_state',SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const key=JSON.stringify,copy=x=>JSON.parse(JSON.stringify(x));
const stable=x=>typeof x==='string'&&x.trim().length>0||Number.isSafeInteger(x)&&x>=0;
const live=a=>Boolean(a&&!a.dead&&a.alive!==false);
const pid=(g,a)=>a?(g.player_id?.(a)??g.seat_of(a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(SK)
  &&(typeof g.initialize_general_skill_ledger==='function'&&g.general_skill_ledger_state==null
    ?(a.effective_skill_ids??rule_hero(a)?.skill_ids??[]).includes(SK):g.has_general_skill?.(a,SK)===true);
const binding=(g,a)=>key([g.general_skill_binding_id?.(a,SK)??pid(g,a),rule_hero(a)?.id]);
const active=new WeakMap();
const pass=x=>['cancel','pass','0','n','no','decline'].includes(String(x));
const select=(os,x)=>os.find(o=>String(o.id)===String(x))??(/^\d+$/.test(String(x))?os[Number(x)-1]:null);
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`画圣接入缺少 ${name}`);}
function validate(s){
  if(s?.version!==1||!stable(s.owner_id)||!Number.isSafeInteger(s.counter)||s.counter<0||!Array.isArray(s.events)
    ||s.events.some(r=>!stable(r.event_id)||!r.request||typeof r.committed!=='boolean'||!['offered','paying','paid','resolving','done','failed'].includes(r.status))
    ||new Set(s.events.map(r=>key(r.event_id))).size!==s.events.length)throw Error('Invalid Wu Dao Zi state');return s;
}
function read(g,a){if(!a?.[FIELD])return null;const s=validate(a[FIELD]);if(s.owner_id!==pid(g,a))throw Error('画圣事务不能继承另一人物');return s;}
function state(g,a){if(!stable(pid(g,a)))throw Error('画圣需要稳定人物ID');return read(g,a)??(a[FIELD]={version:1,owner_id:pid(g,a),counter:0,events:[]});}
export const yxs_clone_modern_wudaozi_state=a=>a?.[FIELD]?copy(validate(a[FIELD])):null;
/** 探囊取物 -> 顺手牵羊 is the host's existing exact-function source merge.
 * Do not combine distinct mechanisms merely because their names sound similar. */
export const yxs_huasheng_function_name=card=>card?.canonical_name??({探囊取物:'顺手牵羊'})[card?.name]??card?.name??null;
/** Pure query of every committed USE by the actor in the actual whole turn.
 * Nested/normal/other-conversion/countered uses count. Final overrides win. */
export function yxs_huasheng_used_function_names(g,a,turn_id=g.card_use_history?.current_turn_id){
  if(turn_id==null)return [];
  const names=new Set(),overrides=g.card_history_function_overrides??[];
  for(const use of g.card_use_history?.uses??[]){
    if(use.actor_id!==pid(g,a)||use.turn_id!==turn_id||use.kind!==undefined&&use.kind!=='card_use'||use.stage!==undefined&&use.stage!=='committed')continue;
    const final=overrides.find(row=>row.use_id===use.use_id)?.effective_function??use.effective_function;
    const name=yxs_huasheng_function_name(final);if(name)names.add(name);
  }return [...names];
}
function window(g,a){return owned(g,a)&&ongoing(g)&&g.actual_turn_active===true&&g.is_own_play_phase?.(a)===true
  &&stable(g.turn_event_counter)&&stable(g.active_play_phase_id)&&stable(g.card_use_history?.current_turn_id)
  &&!(g.response_stack?.length)&&!(g.card_history_stack?.length);}
function resourceShape(r){return r&&stable(r.id)&&stable(r.binding_id)&&is_sha_type(r.effective_card?.type)
  &&(r.provider_skill_id===null||typeof r.provider_skill_id==='string')&&Array.isArray(r.materials)&&r.materials.length>0
  &&new Set(r.materials.map(m=>m.card)).size===r.materials.length
  &&r.materials.every(m=>m.card&&!m.card.virtual&&['hand',...SLOTS].includes(m.zone)&&Number.isSafeInteger(m.index)&&m.index>=0&&Number.isSafeInteger(m.epoch)&&m.epoch>=0);}
/** The host provider is the authority for source-skill/equipment restrictions.
 * A user-supplied virtual wrapper or an ordinary red card is never a provider. */
export function yxs_huasheng_resources(g,a){
  if(!live(a)||typeof g.huasheng_resources!=='function')return [];
  return g.huasheng_resources(a).filter(resourceShape);
}
function sameResource(a,b){return Boolean(a&&b&&a.id===b.id&&a.binding_id===b.binding_id&&a.provider_skill_id===b.provider_skill_id
  &&(a.provider_card??null)===(b.provider_card??null)
  &&key([a.effective_card?.name,a.effective_card?.type,a.effective_card?.suit,a.effective_card?.color,a.effective_card?.rank])===key([b.effective_card?.name,b.effective_card?.type,b.effective_card?.suit,b.effective_card?.color,b.effective_card?.rank])
  &&a.materials.length===b.materials.length&&a.materials.every((m,i)=>{const n=b.materials[i];return m.card===n.card&&m.zone===n.zone&&m.index===n.index&&m.epoch===n.epoch;}));}
function lockResource(resource){return {...resource,materials:resource.materials.map(m=>({...m})),effective_card:{...resource.effective_card}};}
const finalOutput=def=>def?.type===CardType.SCROLL&&def.category==='trick'&&!def.delayed_key&&def.rule_type!=='延时锦囊'
  &&!['无懈可击','无懈'].includes(yxs_huasheng_function_name(def))&&stable(def.rule_id);
export function yxs_huasheng_outputs(g,a,{include_used=false}={}){
  if(typeof g.huasheng_output_catalog!=='function')return [];
  const used=new Set(yxs_huasheng_used_function_names(g,a)),seen=new Set();
  return g.huasheng_output_catalog(a).filter(finalOutput).filter(def=>{const name=yxs_huasheng_function_name(def);if(seen.has(name))return false;seen.add(name);return include_used||!used.has(name);});
}
export function yxs_huasheng_card(g,a,resource,definition){
  if(!resourceShape(resource)||!finalOutput(definition))throw Error('画圣需要合法杀资源和非延时锦囊功能');
  // Single-material effective metadata belongs to the owner at commitment.
  // Multi-material suit/rank/color are the host provider's explicit virtual policy.
  const one=resource.materials.length===1?resource.materials[0]:null,face=one?.card??resource.effective_card;
  const suit=one&&typeof g.effective_suit==='function'?g.effective_suit(face,a,{zone:one.zone,action:'card_use'}):face.suit;
  const color=one&&typeof g.effective_color==='function'?g.effective_color(face,a,{zone:one.zone,action:'card_use'}):face.color;
  return new Card(definition.name,CardType.SCROLL,{...definition,suit:suit??null,color:color??null,rank:face.rank??null,
    virtual:true,materials:resource.materials.map(m=>m.card),source_skill:SK,source_skill_id:SK,
    formed_effective_color:resource.effective_card.formed_effective_color===true,provider_skill_id:resource.provider_skill_id});
}
export function yxs_huasheng_unavailable_reason(g,a){
  if(!owned(g,a))return '当前没有有效画圣技能';
  if(!window(g,a))return '仅可在自己的出牌阶段行动窗口发动';
  if(read(g,a)?.events.some(r=>r.status!=='done'))return '已有画圣选择或结算待完成';
  if(!yxs_huasheng_resources(g,a).length)return '没有当前合法可形成的杀资源';
  if(!yxs_huasheng_outputs(g,a).length)return '本回合可转换的已启用非延时锦囊均已使用';
  return null;
}
export const yxs_huasheng_available=(g,a)=>yxs_huasheng_unavailable_reason(g,a)===null;
function phaseFacts(g,a){return {actor_id:pid(g,a),turn_id:g.turn_event_counter,history_turn_id:g.card_use_history?.current_turn_id,phase_id:g.active_play_phase_id};}
function targetFacts(g,plan){return {target_id:pid(g,plan?.target),target_ids:plan?.targets?.map(p=>pid(g,p))??null,forced_target_id:pid(g,plan?.forced_target),recast:plan?.recast===true};}
function resourceFacts(g,r){return {id:r.id,binding_id:r.binding_id,provider_skill_id:r.provider_skill_id,materials:r.materials.map(m=>({zone:m.zone,index:m.index,epoch:m.epoch,physical_id:g.card_history_material_id(m.card)}))};}
function replay(g,a,id,options){
  const r=read(g,a)?.events.find(row=>row.event_id===id);if(!r)return null;
  const outputId=options.output_rule_id??options.output?.rule_id;
  if(options.resource_id!=null&&r.resource?.id!==options.resource_id||options.resource&&key(r.resource)!==key(resourceFacts(g,options.resource))
    ||outputId!=null&&r.output?.rule_id!==outputId||options.output_name!=null&&r.output?.name!==options.output_name
    ||options.target_plan&&key(r.targets)!==key(targetFacts(g,options.target_plan)))throw Error('同一画圣事件不能更换材料、锦囊或目标');
  if(r.status!=='done'&&!active.get(a)?.has(r))throw Object.assign(Error('画圣事务中断；须续接原协程或按原输入日志重放'),{code:'YXS_HUASHENG_REPLAY_REQUIRED'});
  return r;
}
function aiOutputScore(g,a,def){
  const name=def.name;if(name==='无中生有')return 100;
  if(['烽火狼烟','万箭齐发'].includes(name))return g.all_players().filter(p=>p!==a&&live(p)).reduce((score,p)=>score+(g.side_of?.(a)===g.side_of?.(p)?-10:6),0);
  return ({顺手牵羊:50,釜底抽薪:40,决斗:30,火攻:20,铁索连环:10,刮骨疗毒:8,树上开花:5})[name]??1;
}
async function chooseResource(g,a,r,valid){
  while(valid()){
    const resources=yxs_huasheng_resources(g,a);if(!resources.length)return null;
    if(a.is_ai)return lockResource([...resources].sort((x,y)=>x.materials.reduce((n,m)=>n+(g.material_ai_cost?.(m)??2),0)-y.materials.reduce((n,m)=>n+(g.material_ai_cost?.(m)??2),0))[0]);
    const answer=await g.view.ask_line('画圣：选择一个合法杀资源，直接用作锦囊材料',{kind:'choice',player_id:g.seat_of(a),options:[...resources.map(x=>({id:x.id,label:x.label??`杀资源 ${x.id}`})),{id:'cancel',label:'取消，不消耗牌'}],meta:{skill:'画圣',skill_id:SK,stage:'huasheng_resource',private_to:g.seat_of(a),event_id:r.event_id,optional:true,no_intermediate_sha_use:true}});
    if(!valid()||pass(answer))return null;const selected=select(resources,answer);if(selected)return lockResource(selected);
  }return null;
}
async function chooseOutput(g,a,r,valid){
  while(valid()){
    const used=new Set(yxs_huasheng_used_function_names(g,a)),catalog=yxs_huasheng_outputs(g,a,{include_used:true});
    const options=catalog.map(def=>({id:def.rule_id,label:used.has(yxs_huasheng_function_name(def))?`${def.name}（本回合已使用）`:def.name,disabled:used.has(yxs_huasheng_function_name(def)),definition:def}));
    if(a.is_ai)return options.filter(o=>!o.disabled&&aiOutputScore(g,a,o.definition)>0).sort((x,y)=>aiOutputScore(g,a,y.definition)-aiOutputScore(g,a,x.definition))[0]?.definition??null;
    if(!options.some(o=>!o.disabled))return null;
    const answer=await g.view.ask_line('画圣：选择本回合尚未使用的非延时锦囊（不能选无懈）',{kind:'choice',player_id:g.seat_of(a),options:[...options.map(({id,label,disabled})=>({id,label,disabled})),{id:'cancel',label:'取消，不消耗牌'}],meta:{skill:'画圣',skill_id:SK,stage:'huasheng_output',private_to:g.seat_of(a),event_id:r.event_id,used_names:[...used],optional:true}});
    if(!valid()||pass(answer))return null;const selected=select(options,answer);if(selected&&!selected.disabled)return selected.definition;
  }return null;
}
async function prepareTargets(g,a,resource,card){
  if(card.name==='决斗'){
    const targets=g.all_players().filter(p=>g.huasheng_validate_target_plan(a,resource,card,{target:p,allow_allies:true})===true);
    const target=await g.choose_card_target(a,targets,{card_name:'画圣·决斗',stage:'huasheng_target',source_skill_id:SK,chosen_card_name:'决斗'});
    return target?{target,allow_allies:true}:null;
  }
  return g.prepare_card_use(a,card,g.default_foe?.(a)??a,{allow_recast:false,effective_function:true,source_skill_id:SK,cost_resource:resource});
}
/** Direct calls may provide resource/definition/target_plan; they still pass
 * every fresh provider, phase, history and complete target legality check. */
export async function yxs_huasheng_execute(g,a,options={}){
  if(options.event_id!=null){if(!stable(options.event_id))throw Error('画圣需要稳定事件ID');const old=replay(g,a,options.event_id,options);if(old)return Boolean(old.committed);}
  if(!yxs_huasheng_available(g,a))return false;
  methods(g,'huasheng_validate_target_plan','commit_huasheng_resource','start_card_use','end_card_use','resolve_scroll','finish_processing_card','card_history_material_id');
  const s=state(g,a);let id=options.event_id;
  if(id==null){if(s.counter>=Number.MAX_SAFE_INTEGER)throw Error('画圣事件计数耗尽');do{id=`huasheng:${key([pid(g,a),++s.counter])}`;}while(s.events.some(r=>r.event_id===id));}
  const request=phaseFacts(g,a),bound=binding(g,a),r={event_id:id,request,status:'offered',committed:false,cleanup:false};s.events.push(r);
  let jobs=active.get(a);if(!jobs)active.set(a,jobs=new Set());jobs.add(r);
  const valid=()=>window(g,a)&&binding(g,a)===bound&&key(phaseFacts(g,a))===key(request);
  const finish=()=>{r.status='done';jobs.delete(r);};
  let scope=null,resource=null,card=null;
  try{
    if(options.resource){resource=yxs_huasheng_resources(g,a).find(x=>sameResource(x,options.resource))??null;}
    else if(options.resource_id!=null)resource=yxs_huasheng_resources(g,a).find(x=>x.id===options.resource_id)??null;
    else if(options.choose!==false)resource=await chooseResource(g,a,r,valid);
    if(!resource||!valid()){r.cancelled=true;finish();return false;}resource=lockResource(resource);r.resource=resourceFacts(g,resource);
    const validResource=()=>valid()&&yxs_huasheng_resources(g,a).some(x=>sameResource(x,resource));
    let definition=null;
    if(options.output_rule_id!=null||options.output){const wanted=options.output_rule_id??options.output.rule_id;definition=yxs_huasheng_outputs(g,a).find(d=>d.rule_id===wanted)??null;
      if(options.output&&(options.output.name!==definition?.name||options.output.type!==definition?.type))definition=null;}
    else if(options.output_name!=null)definition=yxs_huasheng_outputs(g,a).find(d=>d.name===options.output_name)??null;
    else if(options.choose!==false)definition=await chooseOutput(g,a,r,validResource);
    if(!definition||!validResource()){r.cancelled=true;finish();return false;}
    r.output={rule_id:definition.rule_id,name:definition.name};card=yxs_huasheng_card(g,a,resource,definition);
    const committedFace=key([card.name,card.type,card.suit,card.color,card.rank]);
    let plan=options.target_plan??(options.choose!==false?await prepareTargets(g,a,resource,card):null);
    if(!plan||plan.recast){r.cancelled=true;finish();return false;}
    plan={...plan,...(plan.targets?{targets:[...plan.targets]}:{})};r.targets=targetFacts(g,plan);
    const legal=()=>validResource()&&yxs_huasheng_outputs(g,a).some(d=>d.rule_id===definition.rule_id&&d.name===definition.name)
      &&((c)=>key([c.name,c.type,c.suit,c.color,c.rank])===committedFace)(yxs_huasheng_card(g,a,resource,definition))
      &&key(targetFacts(g,plan))===key(r.targets)&&g.huasheng_validate_target_plan(a,resource,card,plan)===true;
    if(!legal()){r.cancelled=true;finish();return false;}
    const historyOptions={materials:resource.materials.map(m=>m.card),sourceZones:resource.materials.map(m=>m.zone),
      provenance:{kind:'converted',source_skill_id:SK,source_game:'英雄杀',source_version:'mobile-published-2026-02-02',
        ...(resource.provider_skill_id?{source_game_lineage:{source_skill:resource.provider_skill_id,source_rule_id:String(resource.binding_id)}}:{})}};
    g.start_card_use(a,card,{...historyOptions,validate_only:true});
    r.status='paying';
    const result=await g.commit_huasheng_resource(a,resource,{move_id:`huasheng:${key([pid(g,a),id])}:cost`,validate:legal,on_committed:(cards,move)=>{
      if(r.committed)throw Error('画圣成本提交回调只能执行一次');
      if(!Array.isArray(cards)||cards.length!==resource.materials.length||cards.some((c,i)=>c!==resource.materials[i].card))throw Error('画圣成本回执必须恰为所选实体材料');
      r.committed=true;r.status='paid';r.move_id=move.move_id;r.paid_count=cards.length;
      scope=g.start_card_use(a,card,historyOptions);r.history_use_id=scope.use_id;
    }});
    if(result?.committed&&!r.committed)throw Error('画圣缺少原子材料提交回调');
    if(!r.committed){r.cancelled=true;finish();return false;}
    g.view.emit(`${a.name}发动画圣，将杀资源作为材料使用「${card.name}」。`,{event_type:'skill_commit',skill_id:SK,history_use_id:r.history_use_id,card_name:card.name,provider_skill_id:resource.provider_skill_id,material_count:r.paid_count});
    // Already-paid ability survives skill removal; death/match closure follows
    // the shared engine's usual lifecycle and never refunds/duplicates costs.
    if(live(a)&&ongoing(g)){r.status='resolving';await g.resolve_scroll(a,plan.target,card,{...plan,trick_declaration_validated:true,history_use_id:scope.use_id,source_skill:SK,source_skill_id:SK});r.effect_completed=true;}
    else r.stopped='owner_dead_or_match_closed';
    finish();return true;
  }catch(error){r.status='failed';r.error=String(error?.message??error);jobs.delete(r);throw error;}
  finally{
    if(r.committed&&!r.cleanup){for(const m of resource.materials)g.finish_processing_card(m.card);r.cleanup=true;}
    if(scope)g.end_card_use(scope);
  }
}
export async function yxs_player_huasheng(g,a){if(!yxs_huasheng_available(g,a)){g.view.emit(`画圣：${yxs_huasheng_unavailable_reason(g,a)}。`);return true;}await yxs_huasheng_execute(g,a);return true;}
export const yxs_ai_huasheng=(g,a)=>yxs_huasheng_execute(g,a);
export function yxs_modern_wudaozi_public_state(a,g=null){
  const s=a?.[FIELD]?validate(a[FIELD]):null;
  return {used_names:g?yxs_huasheng_used_function_names(g,a):[],events:(s?.events??[]).map(r=>({event_id:r.event_id,turn_id:r.request.turn_id,phase_id:r.request.phase_id,status:r.status,committed:r.committed,
    output:r.committed?copy(r.output):null,provider_skill_id:r.committed?r.resource?.provider_skill_id??null:null,history_use_id:r.history_use_id??null,paid_count:r.paid_count??0,effect_completed:r.effect_completed??false,cleanup:r.cleanup}))};
}
export function yxs_modern_wudaozi_skill_definitions({SkillHooks,ActiveSkillDef}){
  const skill=new ActiveSkillDef({skill_id:SK,hotkey:'q',button_label:'画圣',available:yxs_huasheng_available,player:yxs_player_huasheng,ai:yxs_ai_huasheng,
    help_text:'出牌阶段，将合法杀资源作为材料，使用本整回合你尚未用过的非延时锦囊，无懈除外。无独立次数限制，不消耗杀使用次数。'});
  skill.source_skill_id=SK;skill.owns_target_selection=true;skill.unavailable_reason=yxs_huasheng_unavailable_reason;
  return {hooks:{[YXS_MODERN_WUDAOZI_RULE_IDS.wudaozi]:SkillHooks()},active:{[YXS_MODERN_WUDAOZI_RULE_IDS.wudaozi]:[skill]}};
}
