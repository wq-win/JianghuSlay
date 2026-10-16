/** 虞翻: complete official Mobile 130 base identity packet, 2026-10-15.
 * P13/P14 declare semantic discard/ordering; P17 declares the failed equipment
 * use boundary. This is a source-bounded host adaptation, not client parity. */
import {rule_hero} from './effective-hero.js';
export const SGS_LATER_YUFAN_RULE_IDS=Object.freeze({yufan:'sgs.adapted.base.hero.yu-fan'});
export const SGS_LATER_YUFAN_SKILL_IDS=Object.freeze({zongxuan:'sgs.zongxuan',zhiyan:'sgs.zhiyan'});
const ID=SGS_LATER_YUFAN_RULE_IDS,SK=SGS_LATER_YUFAN_SKILL_IDS;
export const SGS_LATER_YUFAN_SOURCE=Object.freeze({snapshot_date:'2026-10-15',variant:'mobile-base-identity-catalog-2026-10-15',
  current_client_verified:false,current_mobile_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P2','P3','P4','P13','P14','P15','P17']),native_failed_equipment_use_branch_verified:false,
  failed_equipment_use_policy:'P17: keep exact card in hand if still there, no actual use and no recovery when use is prohibited or its slot abolished',
  heroes:Object.freeze([Object.freeze({id:ID.yufan,name:'虞翻',max_hp:3,starting_hp:3,starting_hp_direct_source_value:null,
    starting_hp_basis:'P0 host normal-full-HP initialization',gender:'male',source_faction:'吴',skill_ids:Object.freeze([SK.zongxuan,SK.zhiyan]),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({[SK.zongxuan]:'当你的牌因弃置而置入弃牌堆后，你可以将其中任意张牌置于牌堆顶。',
    [SK.zhiyan]:'结束阶段，你可以令一名角色摸一张牌并展示之，若此牌为装备牌，则该角色使用此牌，然后其回复1点体力。'}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-130.html','https://wiki.biligame.com/msgs/虞翻','https://wiki.biligame.com/msgs/纵玄','https://wiki.biligame.com/msgs/直言'])});
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const SLOT_BY_TYPE=Object.freeze({'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'});
const live=a=>!!a&&!a.dead&&a.hp>0,stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>0;
const seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)&&g.has_general_skill?.(a,id)===true;
const binding=(g,a,id)=>JSON.stringify([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const physical=(g,c)=>g.card_history_material_id?.(c)??c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const face=c=>({name:c.name,type:c.type,suit:c.suit??null,color:c.color??null,rank:c.rank??null});
const pass=v=>['pass','cancel','0','n','no'].includes(String(v));
const select=(list,v)=>list.find(x=>x.id===String(v))??(/^\d+$/.test(String(v))?list[Number(v)-1]:null);
const active=new WeakMap(),references=new WeakMap();
function state(a){
  const s=a.sgs_later_yufan_state??={version:1,zongxuan:{},zhiyan:{}};
  if(s.version!==1||['zongxuan','zhiyan'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Yu Fan skill state');
  return s;
}
export const sgs_clone_later_yufan_state=a=>a.sgs_later_yufan_state?JSON.parse(JSON.stringify(state(a))):null;
function ticket(a,kind,id,request,refs=[]){
  if(!stable(id))throw Error('虞翻技能需要稳定事件ID');
  const s=state(a),key=JSON.stringify(id),old=s[kind][key],rkey=`${kind}:${key}`;
  let running=active.get(a);if(!running)active.set(a,running=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(JSON.stringify(old.request)!==JSON.stringify(request)||known.has(rkey)&&known.get(rkey).some((v,i)=>v!==refs[i]))throw Error('同一虞翻事件不能更换人物、事实或实体牌');
    if(old.status!=='done'&&!running.has(old))throw Object.assign(Error('虞翻事务中断；须从原动作日志恢复，不能重复移牌或摸牌'),{code:'SGS_LATER_YUFAN_REPLAY_REQUIRED'});
    return null;
  }
  const row=s[kind][key]={event_id:id,request,status:'offered',committed:false};running.add(row);known.set(rkey,refs);
  return {row,finish(){row.status='done';running.delete(row);},fail(e){row.status='failed';row.error=String(e?.message??e);running.delete(row);}};
}
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`虞翻接入缺少 ${name}`);}
const actualDiscard=e=>e.committed===true&&e.to==='discard'&&e.action==='discard'&&!e.death_cleanup
  &&!['use_cleanup','response_cleanup','recast','gift','equip_replacement','death_cleanup'].includes(e.semantic_action);
const batchRequest=(g,a,e)=>({owner_id:pid(g,a),move_id:e.move_id,to:e.to,action:e.action,semantic_action:e.semantic_action??null,
  materials:(e.materials??[]).map(m=>({zone:m.zone,physical_id:physical(g,m.card)}))});
/** Only this exact committed owner's H/E batch. Destination alone is never
 * evidence of discard. The public physical pile is rechecked after each await. */
export function sgs_zongxuan_cards(g,a,event={}){
  if(!actualDiscard(event)||event.owner&&event.owner!==a||!Array.isArray(event.materials))return [];
  return event.materials.filter(m=>['hand',...SLOTS].includes(m.zone)&&m.card&&!m.card.virtual)
    .map((m,index)=>({id:`card:${index+1}`,card:m.card,from_zone:m.zone,physical_id:physical(g,m.card),label:String(m.card)}))
    .filter((m,index,all)=>stable(m.physical_id)&&g.deck?.discard_pile?.includes(m.card)&&all.findIndex(n=>n.card===m.card)===index);
}
export function sgs_ai_zongxuan_order(g,a,event){
  // Every inspected face was already publicly discarded. Never read draw_pile.
  return sgs_zongxuan_cards(g,a,event).filter(m=>m.card.type!=='毒').sort((x,y)=>{
    const value=m=>m.card.type==='桃'?4:SLOT_BY_TYPE[m.card.type]?3:m.card.type==='闪'?2:1;
    return value(y)-value(x);
  });
}
export async function sgs_after_cards_lost_zongxuan(g,a,event={}){
  const id=event.move_id,request=batchRequest(g,a,event),refs=(event.materials??[]).map(m=>m.card);
  if(a?.sgs_later_yufan_state?.zongxuan?.[JSON.stringify(id)]){ticket(a,'zongxuan',id,request,refs);return false;}
  if(!owned(g,a,SK.zongxuan)||!ongoing(g)||!sgs_zongxuan_cards(g,a,event).length)return false;
  methods(g,'public_card_loss');if(g.public_card_loss_supports_on_committed!==true)throw Error('纵玄需要原子移牌提交回执');
  const bound=binding(g,a,SK.zongxuan),t=ticket(a,'zongxuan',id,request,refs);
  const valid=()=>owned(g,a,SK.zongxuan)&&ongoing(g)&&binding(g,a,SK.zongxuan)===bound
    &&JSON.stringify(batchRequest(g,a,event))===JSON.stringify(request);
  try{
    let selected=[];
    if(a.is_ai)selected=sgs_ai_zongxuan_order(g,a,event);
    else while(valid()){
      const available=sgs_zongxuan_cards(g,a,event);
      if(selected.some(m=>!available.some(n=>n.card===m.card))){t.finish();return false;}
      const options=available.filter(m=>!selected.some(n=>n.card===m.card));
      const answer=String(await g.view.ask_line(`纵玄：按牌堆顶到下方顺序选择牌（已选${selected.length}张）；第一张会最先被摸到`,{
        kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'done',label:`完成，置顶${selected.length}张`},{id:'cancel',label:'不置顶，全部留在弃牌堆'}],
        meta:{skill:'纵玄',skill_id:SK.zongxuan,stage:'zongxuan_order',private_to:seat(g,a),move_id:id,first_selected_is_top:true,
          selected_order:selected.map(m=>({physical_id:m.physical_id,...face(m.card)})),eligible_cards:available.map(m=>({id:m.id,physical_id:m.physical_id,from_zone:m.from_zone,...face(m.card)}))}}));
      if(!valid()||pass(answer)){selected=[];break;}
      if(answer==='done')break;
      const chosen=select(options,answer);if(chosen)selected.push(chosen);
    }
    const legal=()=>valid()&&selected.length>0&&selected.every(m=>sgs_zongxuan_cards(g,a,event).some(n=>n.card===m.card));
    if(!legal()){t.finish();return false;}
    t.row.selected_order=selected.map(m=>m.physical_id);t.row.status='placing';
    const materials=selected.map(m=>({zone:'discard',index:g.deck.discard_pile.indexOf(m.card),card:m.card}));
    const result=await g.public_card_loss(null,materials,{to:'decktop',visibility:'public',reason:'纵玄',action:'put',source:a,source_skill:SK.zongxuan,
      move_id:`zongxuan:${JSON.stringify([pid(g,a),id])}:top`,origin_move_id:id,top_order:'first_selected_is_top',validate:legal,
      on_committed:()=>{t.row.committed=true;t.row.status='placed';}});
    if(result?.committed&&!t.row.committed)throw Error('纵玄置顶缺少原子提交回执');
    if(t.row.committed)g.view.emit(`${a.name}发动纵玄，将${selected.length}张刚弃置的牌按所选顺序置于牌堆顶。`,{event_type:'skill_decktop',source_skill:SK.zongxuan,move_id:id,physical_ids:t.row.selected_order});
    t.finish();return t.row.committed;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_zhiyan_targets(g,a){return owned(g,a,SK.zhiyan)?g.all_players().filter(live):[];}
export function sgs_ai_zhiyan_target(g,a){
  const targets=sgs_zhiyan_targets(g,a),allies=targets.filter(p=>g.side_of?.(p)===g.side_of?.(a));
  // Only public HP and hand COUNT; never inspect another actor's hand faces.
  return [...allies].sort((x,y)=>(y.max_hp??rule_hero(y)?.max_hp??y.hp)-y.hp-((x.max_hp??rule_hero(x)?.max_hp??x.hp)-x.hp)
    ||(x.hand?.length??0)-(y.hand?.length??0)||Number(y===a)-Number(x===a))[0]??a;
}
const endId=e=>e.phase_event_id??e.event_id;
const endRequest=(g,a,e)=>({owner_id:pid(g,a),phase_event_id:endId(e),turn_id:e.turn_id});
const endValid=(g,a,e)=>owned(g,a,SK.zhiyan)&&ongoing(g)&&g.actual_turn_active===true&&g.turn_actor===seat(g,a)
  &&g.turn_phase==='end_phase'&&e.turn_id===g.turn_event_counter&&(!e.actor||e.actor===a)&&stable(endId(e));
export async function sgs_on_end_phase_zhiyan(g,a,_target,event={}){
  const id=endId(event),request=endRequest(g,a,event);
  if(a?.sgs_later_yufan_state?.zhiyan?.[JSON.stringify(id)]){ticket(a,'zhiyan',id,request);return false;}
  if(!endValid(g,a,event))return false;
  const bound=binding(g,a,SK.zhiyan),t=ticket(a,'zhiyan',id,request);
  const valid=()=>endValid(g,a,event)&&binding(g,a,SK.zhiyan)===bound&&JSON.stringify(endRequest(g,a,event))===JSON.stringify(request);
  try{
    let target=a.is_ai?sgs_ai_zhiyan_target(g,a):null;
    while(!target&&valid()&&!a.is_ai){
      const targets=sgs_zhiyan_targets(g,a),options=targets.map(p=>({id:String(pid(g,p)),label:`${p.name}（${p.hp}点体力）`}));
      const answer=String(await g.view.ask_line('直言：选择一名角色摸一张并展示；若为装备牌，须使用后回复1点体力',{
        kind:'choice',player_id:seat(g,a),options:[...options,{id:'cancel',label:'不发动直言'}],
        meta:{skill:'直言',skill_id:SK.zhiyan,stage:'zhiyan_target',private_to:seat(g,a),phase_event_id:id,allow_self:true,allow_enemy:true}}));
      if(!valid()||pass(answer))break;
      const chosen=select(options,answer);target=targets.find(p=>String(pid(g,p))===chosen?.id)??null;
    }
    if(!target||!valid()||!live(target)){t.finish();return false;}
    methods(g,'draw_cards','use_skill_equipment_card','recover_hp');
    // From acceptance onward the draw/reveal/use/recover chain is mandatory.
    // Skill removal/rebinding cannot turn this into a second optional action.
    t.row.committed=true;t.row.target_id=pid(g,target);t.row.draw_started=true;t.row.status='drawing';
    const drawn=await g.draw_cards(target,1);t.row.draw_done=true;
    if(!Array.isArray(drawn)||drawn.length>1)throw Error('直言需要恰好一次摸一张的实体回执');
    const card=drawn[0];
    if(!card){t.row.outcome='empty_draw';t.finish();return true;}
    t.row.drawn_physical_id=physical(g,card);
    if(!stable(t.row.drawn_physical_id))throw Error('直言摸牌缺少实体ID');
    if(!target.hand?.includes(card)){t.row.outcome='drawn_card_moved';t.finish();return true;}
    t.row.revealed=true;t.row.revealed_face=face(card);t.row.status='revealed';
    g.view.emit(`${target.name}因直言摸到并展示了${card}。`,{event_type:'skill_reveal',source_skill:SK.zhiyan,phase_event_id:id,
      player_id:pid(g,target),physical_id:t.row.drawn_physical_id,card:face(card)});
    if(!SLOT_BY_TYPE[card.type]){t.row.outcome='non_equipment';t.finish();return true;}
    const canContinue=()=>live(target)&&ongoing(g)&&target.hand?.includes(card);
    if(!canContinue()){t.row.outcome='equipment_unavailable';t.finish();return true;}
    t.row.status='using_equipment';
    const result=await g.use_skill_equipment_card(target,card,{source:a,source_skill:SK.zhiyan,event_id:`zhiyan:${JSON.stringify([pid(g,a),id])}:equipment`,
      phase_event_id:id,validate:canContinue,on_committed:use=>{t.row.use_committed=true;t.row.card_use_id=use?.use_id??use?.history_use_id??null;t.row.status='equipment_committed';}});
    if(result?.committed&&!t.row.use_committed)throw Error('直言装备使用缺少原子提交回执');
    t.row.use_done=true;
    if(!t.row.use_committed){t.row.outcome='equipment_use_prohibited';t.finish();return true;}
    if(live(target)&&ongoing(g)){
      t.row.recover_started=true;t.row.status='recovering';
      t.row.recovered=await g.recover_hp(target,1,{source:a,source_skill:SK.zhiyan,source_skill_id:SK.zhiyan,
        recovery_event_id:`zhiyan:${JSON.stringify([pid(g,a),id])}:recover`});t.row.recover_done=true;
    }
    t.row.outcome='equipment_used';t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_later_yufan_public_state(a){const s=a?.sgs_later_yufan_state;return {
  zongxuan:Object.values(s?.zongxuan??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,selected_order:r.selected_order??[]})),
  zhiyan:Object.values(s?.zhiyan??{}).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,target_id:r.target_id??null,revealed:r.revealed===true,use_committed:r.use_committed===true,recover_done:r.recover_done===true,outcome:r.outcome??null}))};}
export function sgs_later_yufan_skill_definitions({SkillHooks}){return {hooks:{[ID.yufan]:SkillHooks({after_cards_lost:[sgs_after_cards_lost_zongxuan],on_end_phase:[sgs_on_end_phase_zhiyan]})},active:{[ID.yufan]:[]}};}
sgs_after_cards_lost_zongxuan.source_skill_id=SK.zongxuan;sgs_on_end_phase_zhiyan.source_skill_id=SK.zhiyan;
