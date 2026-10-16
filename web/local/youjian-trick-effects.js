/** Four complete historical mobile 用间 trick functions, deliberately unregistered.
 * Host integration and disclosed YJ04–YJ12 policies: trick-integration-contract.md.
 * All real mutations go through the host's exact movement/recovery/damage/draw
 * pipelines. An import neither patches Game nor changes a deck, history or RNG.
 */
import {is_youjian_poison} from './youjian-card-events.js';

const freeze = value => { if(value && typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value; };
const SLOTS=Object.freeze(['weapon','armor','offensive_horse','defensive_horse']);
const EQUIPMENT=new Set(['武器','防具','-1马','+1马']);
const TREE='树上开花',HEAL='刮骨疗毒',EXCHANGE='推心置腹',EXTORT='趁火打劫';
const live=p=>Boolean(p?.alive&&!p.dead);
const stable=v=>typeof v==='string'&&v.trim()!=='' || typeof v==='number'&&Number.isSafeInteger(v)&&!Object.is(v,-0);
const fail=message=>{throw Error(`用间锦囊：${message}`);};
const requireMethod=(g,name)=>{if(typeof g?.[name]!=='function')fail(`缺少宿主 ${name}`);};
const seat=(g,p)=>g.seat_of(p);
const players=g=>g.all_players();
const sameSide=(g,a,b)=>g.side_of(a)===g.side_of(b);
const maxHP=(g,p)=>g.effective_max_hp?.(p)??p.max_hp??p.hero?.max_hp;
const chooseOption=(options,value)=>options.find(o=>o.id===String(value))??(/^\d+$/.test(String(value))?options[Number(value)-1]:null);
const runtimeByGame=new WeakMap();
const runtime=g=>{let r=runtimeByGame.get(g);if(!r)runtimeByGame.set(g,r=new Map());return r;};

/** Code-owned definitions are suitable inputs to the host's trusted function
 * registry. Physical gift marks belong to physical_faces, never function data. */
export const YOUJIAN_TRICK_CATALOG=freeze([
  {name:TREE,key:'shushang_kaihua',description:'仅对自己：弃置一至两张手牌或装备，然后摸等量牌；若弃牌包含装备牌，额外摸一张。',target_mode:'self',compatibility_ids:['YJ04','YJ05','YJ11','YJ12'],physical_faces:[{suit:'方块',rank:3,gift_mark:true},{suit:'方块',rank:4,gift_mark:true}],signature:'ac3d193c54dff5f40fb4e70a9b6fd23933a5ae3f58cdf5bb75dc9b516ee33fc7'},
  {name:HEAL,key:'guagu_liaodu',description:'令一名已受伤角色回复一点体力，然后其可以弃置一张手牌中的毒，此次弃毒不触发毒的体力流失。',target_mode:'wounded_any',compatibility_ids:['YJ06','YJ11','YJ12'],physical_faces:[{suit:'黑桃',rank:1,gift_mark:false},{suit:'红桃',rank:1,gift_mark:false}],signature:'9e518280a80a15f59e648bbb79a17e8093dd80df3567d260ff348cf6f64ad009'},
  {name:EXCHANGE,key:'tuixin_zhifu',description:'获得距离为一的另一名角色区域内至多两张牌，然后从当前手牌交给其等量牌。',target_mode:'other_distance_one',compatibility_ids:['YJ07','YJ08','YJ10','YJ11','YJ12'],physical_faces:[{suit:'方块',rank:9,gift_mark:false},{suit:'方块',rank:10,gift_mark:false}],signature:'7f53fc2a4f2c43a3a5d4a25aed773f51b4341f6fb012b169749ca01ea6a6fe4a'},
  {name:EXTORT,key:'chenhuo_dajie',description:'展示另一名角色的一张手牌，其选择将此牌交给你，或受到你造成的一点普通锦囊伤害。',target_mode:'other_with_hand',compatibility_ids:['YJ09','YJ10','YJ11','YJ12'],physical_faces:[{suit:'黑桃',rank:12,gift_mark:false},{suit:'黑桃',rank:13,gift_mark:false},{suit:'红桃',rank:6,gift_mark:false}],signature:'a9a5848b157e133b0f3e353b5e7ed95e92ab3855549ab8863f2d6c8db2474485'},
].map(({key,signature,...row})=>({...row,id:`sgs.mobile.youjian.${key}.20200921`,rule_id:`sgs.mobile.youjian.${key}.20200921`,canonical_id:`sgs.mobile.youjian.${key}.20200921`,effect_id:`trick.youjian.${key}`,type:'锦囊',category:'trick',delayed:false,recast:false,response:[],power:0,range:1,trait:'',
  source_game:'三国杀',source_variant:'mobile-20200921-core; S0076-physical-supplement; Jianghu-YJ04-YJ12',source_snapshot:'2026-10-15',source_urls:['https://www.sanguosha.cn/pc/news-detail-882.html','https://www.bilibili.com/opus/909701299122995221'],
  core_effect_verified:true,current_client_verified:false,all_mobile_interactions_verified:false,native_source_deck_complete:false,full_six_player_identity_mode:false,
  implementation_status:'isolated_effect_complete_not_registered',selectable:false,frequency_limit:null,...(signature?{source_mechanism_signature_sha256:signature}:{})})));

export function youjian_trick_definition(cardOrName){
  if(typeof cardOrName==='string')return YOUJIAN_TRICK_CATALOG.find(d=>d.name===cardOrName||d.id===cardOrName||d.effect_id===cardOrName)??null;
  if(cardOrName?.type!=='锦囊')return null;
  return YOUJIAN_TRICK_CATALOG.find(d=>d.name===cardOrName.name)??null;
}

function state(g){
  const s=g.youjian_trick_state??={version:1,effects:{}};
  if(s.version!==1||!s.effects||Array.isArray(s.effects)||typeof s.effects!=='object')fail('无效的序列化状态');
  return s;
}
function cardId(g,card){
  const id=card?.physical_id??card?.physicalCardId??card?.derived_identity??g.card_history_material_id?.(card);
  if(!stable(id))fail('实体牌需要稳定 physical_id 或 card_history_material_id');
  return id;
}
function materialRecord(g,m){return {zone:m.zone,index:m.index,physical_id:cardId(g,m.card),visibility:m.zone==='hand'?'private':'public'};}
function present(owner,m){
  return SLOTS.includes(m.zone)?owner[m.zone]===m.card:m.zone==='hand'?owner.hand[m.index]===m.card:m.zone==='judgment'?owner.judgment_cards[m.index]===m.card:false;
}
function currentMaterial(owner,m){
  const index=SLOTS.includes(m.zone)?0:(m.zone==='hand'?owner.hand:owner.judgment_cards).indexOf(m.card);
  const result={...m,index};return index>=0&&present(owner,result)?result:null;
}
const face=(g,card,owner)=>g.effective_card?.(card,owner)??card;
const label=(g,card,owner)=>{const c=face(g,card,owner);return `${c.suit??''}${c.rank??''} ${c.name}（${c.type}）`;};

/** The other role's hand stays genuinely opaque: no card property (including
 * name, type, physical ID, or toString) is read by this function or its AI. */
export function youjian_trick_card_options(g,viewer,owner,{zones=['hand',...SLOTS,'judgment'],action='obtain'}={}){
  if(!live(owner))return [];
  const rows=[];
  if(zones.includes('hand'))for(let index=0;index<owner.hand.length;index++){
    const card=owner.hand[index],hidden=viewer!==owner;
    rows.push({id:`hand:${index+1}`,zone:'hand',index,card,hidden,label:hidden?`暗置手牌 ${index+1}`:label(g,card,owner)});
  }
  for(const slot of SLOTS)if(zones.includes(slot)&&owner[slot])rows.push({id:`eq:${slot}`,zone:slot,index:0,card:owner[slot],hidden:false,label:label(g,owner[slot],owner)});
  if(zones.includes('judgment'))owner.judgment_cards.forEach((card,index)=>rows.push({id:`judgment:${index+1}`,zone:'judgment',index,card,hidden:false,label:label(g,card,owner)}));
  // A protection predicate must use zone/owner public state for hidden hands.
  return rows.filter(m=>g.youjian_trick_material_allowed?.(viewer,owner,{zone:m.zone,index:m.index,action,hidden:m.hidden,...(!m.hidden?{card:m.card}:{})})!==false);
}

const harmfulGear=m=>['broken_halberd','bee_robe','mobile_female_dress','inferior_horse'].includes(m.card.trait);
function aiOwnCost(g,a,m){
  const c=face(g,m.card,a);
  if(is_youjian_poison(c))return 1000; // Public discard hurts; private return is handled separately.
  if(EQUIPMENT.has(c.type))return m.zone==='hand'?0:harmfulGear(m)?-1:3;
  if(['桃','酒','闪'].includes(c.type))return 6;
  return 2;
}
function aiTake(g,a,t,rows){
  const friend=sameSide(g,a,t);
  // Public bad equipment/judgments are helpful to remove from a teammate.
  if(friend)return rows.filter(m=>m.zone==='judgment'||m.zone!=='hand'&&harmfulGear(m)).slice(0,2);
  const usefulGear=rows.filter(m=>SLOTS.includes(m.zone)&&!harmfulGear(m));
  return [...usefulGear,...rows.filter(m=>m.zone==='hand'),...rows.filter(m=>m.zone==='judgment'),...rows.filter(m=>SLOTS.includes(m.zone)&&harmfulGear(m))].slice(0,2);
}
function aiReturn(g,a,t,rows,count){
  const friend=sameSide(g,a,t);
  return [...rows].sort((x,y)=>{
    const value=m=>{const c=face(g,m.card,a);return is_youjian_poison(c)?(friend?100:-100):friend?-aiOwnCost(g,a,m):aiOwnCost(g,a,m);};
    return value(x)-value(y);
  }).slice(0,count);
}
function promptMeta(g,r,stage,chooser,extra={}){
  return {card_name:r.name,stage:`youjian_${stage}`,card_use_id:r.card_use_id,branch_id:r.branch_id,effect_id:r.effect_id,private_to:seat(g,chooser),target_seat:r.target,...extra};
}
async function ask(g,r,chooser,stage,text,options,extra={}){
  requireMethod(g.view,'ask_line');r.stage=`choose_${stage}`;
  const answer=String(await g.view.ask_line(text,{kind:'choice',player_id:seat(g,chooser),options:options.map(({id,label,hidden})=>({id,label,...(hidden===undefined?{}:{hidden})})),meta:promptMeta(g,r,stage,chooser,extra)}));
  r.choices.push({stage,answer});return answer;
}
async function chooseBatch(g,r,chooser,owner,{stage,zones,min=1,max=2,action,filter=()=>true,ai}){
  let selected=[];
  while(live(chooser)&&live(owner)){
    let rows=youjian_trick_card_options(g,chooser,owner,{zones,action}).filter(filter);
    const limit=Math.min(max,rows.length),floor=Math.min(min,limit);
    if(!limit)return [];
    if(selected.some(m=>!rows.some(o=>o.card===m.card&&o.zone===m.zone)))selected=[];
    selected=selected.map(m=>rows.find(o=>o.card===m.card&&o.zone===m.zone));
    if(selected.length>=limit)return selected.slice(0,limit);
    if(chooser.is_ai){const chosen=ai(rows,limit);return chosen.length>=floor?chosen.slice(0,limit):rows.slice(0,floor);}
    rows=rows.filter(m=>!selected.some(chosen=>chosen.card===m.card));
    const finish=selected.length>=floor;
    const options=[...rows,...(finish?[{id:'done',label:selected.length?`确认 ${selected.length} 张`:'不弃毒'}]:[])];
    const answer=await ask(g,r,chooser,stage,`${r.name}：${stage==='return'?'交还当前手牌':stage==='detox'?'可弃置一张毒':stage==='tree_discard'?'弃置一至两张手牌或装备':'选择至多两张牌'}（已选 ${selected.length}）`,options,{min:floor,max:limit,selected_count:selected.length,hidden_hand:chooser!==owner});
    if(!live(chooser)||!live(owner))return [];
    if((answer==='done'||min===0&&['pass','cancel','0'].includes(answer))&&finish)return selected;
    const chosen=chooseOption(rows,answer);
    if(chosen&&present(owner,chosen))selected.push(chosen);
  }
  return [];
}

async function move(g,r,stage,owner,recipient,materials,{visibility='private',poison_exempt=false,action='give',freeze_equipment=false,payment=false,source=null,source_card=null,use_provenance=null}={}){
  if(!materials.length)return {committed:false,count:0};
  requireMethod(g,'public_card_loss');
  if(g.public_card_loss_supports_on_committed!==true)fail('移牌需支持 validate/on_committed 原子边界');
  const exact=materials.map(m=>currentMaterial(owner,m));
  if(exact.some(m=>!m))return {committed:false,count:0};
  const move_id=`${r.effect_id}:${stage}`;
  const part=r.moves[stage]={move_id,status:'pending',owner:seat(g,owner),recipient:recipient?seat(g,recipient):null,materials:exact.map(m=>({...materialRecord(g,m),visibility:visibility==='public'?'public':m.zone==='hand'?'private':'public'})),visibility,count:0,poison_exempt};
  // YJ05: freeze effective categories at the atomic precommit validation, before
  // copied_card_moved clears faces and before any asynchronous loss hook.
  let equipment=false;
  r.stage=`move_${stage}`;
  const result=await g.public_card_loss(owner,exact,{to:recipient?'hand':'discard',recipient,visibility,poison_exempt,reason:r.name,action,payment,source,source_card,source_skill:r.source_skill,use_provenance,
    card_use_id:r.card_use_id,branch_id:r.branch_id,move_id,material_visibility:part.materials.map(m=>({zone:m.zone,index:m.index,physical_id:m.physical_id,visibility:visibility==='public'?'public':m.visibility})),
    validate:(allowed=exact)=>{
      if(!live(owner)||recipient&&!live(recipient)||!allowed.every(m=>present(owner,m)))return false;
      equipment=freeze_equipment&&exact.some(m=>EQUIPMENT.has(face(g,m.card,owner).type));return true;
    },
    on_committed:(cards)=>{
      if(stage!=='take'&&cards.length!==exact.length||cards.some(card=>!exact.some(m=>m.card===card)))fail('移牌回执替换了所选实体');
      part.status='committed';part.count=cards.length;part.committed_materials=cards.map(card=>cardId(g,card));part.equipment_bonus=equipment?1:0;
      if(stage==='take')r.obtained_count=cards.length;
      if(stage==='return')r.returned_count=cards.length;
    },
  });
  if(result?.committed&&part.status!=='committed')fail('中央移牌未调用提交回执');
  part.status='done';part.committed=Boolean(result?.committed);
  return {committed:part.committed,count:part.count,equipment_bonus:part.equipment_bonus??0};
}
const physicalMaterials=(g,card,options)=>g.physical_card_materials?.(card,options.use_provenance)??(card.virtual?card.materials??[]:[card]);

async function tree(g,a,card,r,options){
  const chosen=await chooseBatch(g,r,a,a,{stage:'tree_discard',zones:['hand',...SLOTS],action:'discard',filter:m=>g.can_pay_materials?.(a,[m])!==false,ai:rows=>[...rows].sort((x,y)=>aiOwnCost(g,a,x)-aiOwnCost(g,a,y)).slice(0,Math.min(2,rows.filter(m=>aiOwnCost(g,a,m)<1000).length||1))});
  if(!live(a)||!chosen.length)return;
  const result=await move(g,r,'discard',a,null,chosen,{visibility:'public',action:'discard',freeze_equipment:true,payment:true,source:a,source_card:card,use_provenance:options.use_provenance});
  r.discarded_count=result.count;r.equipment_bonus=result.equipment_bonus??0;
  if(!result.committed||!live(a))return;
  r.draw_count=result.count+r.equipment_bonus;r.stage='draw';
  requireMethod(g,'draw_cards');
  const drawn=await g.draw_cards(a,r.draw_count,{reason:TREE,draw_event_id:`${r.effect_id}:draw`,card_use_id:r.card_use_id,branch_id:r.branch_id});
  r.drawn_count=Array.isArray(drawn)?drawn.length:null;
}
async function heal(g,a,t,card,r,options){
  requireMethod(g,'recover_hp');r.stage='recover';
  r.recovered=await g.recover_hp(t,1,{source:a,kind:'scroll',card_user:a,source_card:card,damage_card_identity:options.damage_card_identity??g.damage_card_snapshot?.(card),physical_cards:physicalMaterials(g,card,options),use_provenance:options.use_provenance,source_skill:r.source_skill,recovery_event_id:`${r.effect_id}:recover`,card_use_id:r.card_use_id,branch_id:r.branch_id});
  if(!live(t))return;
  const chosen=await chooseBatch(g,r,t,t,{stage:'detox',zones:['hand'],min:0,max:1,action:'discard',filter:m=>is_youjian_poison(m.card),ai:rows=>rows.slice(0,1)});
  if(chosen.length)await move(g,r,'detox',t,null,chosen,{visibility:'public',poison_exempt:true,action:'discard',source:a,source_card:card,use_provenance:options.use_provenance});
}
async function exchange(g,a,t,card,r,options){
  const chosen=await chooseBatch(g,r,a,t,{stage:'take',zones:['hand',...SLOTS,'judgment'],action:'obtain',ai:rows=>aiTake(g,a,t,rows)});
  if(!live(a)||!live(t)||!chosen.length)return;
  const result=await move(g,r,'take',t,a,chosen,{action:'obtain',source:a,source_card:card,use_provenance:options.use_provenance});
  if(!result.committed||!live(a)||!live(t))return;
  const count=Math.min(result.count,a.hand.length);r.return_required=result.count;r.return_available=count;
  if(!count)return;
  const give=await chooseBatch(g,r,a,a,{stage:'return',zones:['hand'],min:count,max:count,action:'give',ai:rows=>aiReturn(g,a,t,rows,count)});
  if(!live(a)||!live(t)||!give.length)return;
  await move(g,r,'return',a,t,give,{action:'give',source:a,source_card:card,use_provenance:options.use_provenance});
}
async function extort(g,a,t,card,r,options){
  let selected;
  while(live(a)&&live(t)){
    const rows=youjian_trick_card_options(g,a,t,{zones:['hand'],action:'reveal'});if(!rows.length)return;
    if(a.is_ai)selected=rows[0];
    else selected=chooseOption(rows,await ask(g,r,a,'reveal',`${EXTORT}：选择展示的暗置手牌`,rows,{hidden_hand:true}));
    if(selected&&present(t,selected))break;
  }
  if(!selected||!live(a)||!live(t))return;
  r.revealed=materialRecord(g,selected);r.stage='reveal';
  const publicFace=face(g,selected.card,t);
  r.revealed_face={name:publicFace.name,type:publicFace.type,suit:publicFace.suit??null,rank:publicFace.rank??null};
  // Knowledge changes, but no zone move or hand-loss event occurs here.
  g.view.emit(`${t.name}展示：${label(g,selected.card,t)}。`,{kind:'card_reveal',card_name:EXTORT,card_use_id:r.card_use_id,branch_id:r.branch_id,owner_seat:seat(g,t),revealed_card:r.revealed_face});
  let answer;
  while(live(a)&&live(t)){
    // YJ09 missing-card policy: stop the unfulfilled branch; never substitute a
    // different card or force damage after a formerly legal give disappeared.
    if(!currentMaterial(t,selected)){r.invalidated='revealed_card_missing';return;}
    if(t.is_ai){
      const c=publicFace,valuable=['桃','酒','闪'].includes(c.type);
      answer=sameSide(g,a,t)||t.hp<=2||!valuable||is_youjian_poison(selected.card)?'give':'damage';
    }else answer=await ask(g,r,t,'extort_branch',`${EXTORT}：交给对方刚展示的牌，或受到一点普通锦囊伤害`,[{id:'give',label:'交给这张牌'},{id:'damage',label:'受到伤害'}],{revealed_card:r.revealed_face});
    if(['give','damage'].includes(answer))break;
  }
  if(!live(a)||!live(t))return;
  if(!currentMaterial(t,selected)){r.invalidated='revealed_card_missing';return;}
  r.branch=answer;
  if(answer==='give'){await move(g,r,'give',t,a,[selected],{action:'give',source:a,source_card:card,use_provenance:options.use_provenance});return;}
  requireMethod(g,'apply_damage');r.stage='damage';
  r.damage=await g.apply_damage(t,1,{source:a,card_user:a,kind:'scroll',nature:'normal',source_card:card,physical_cards:physicalMaterials(g,card,options),use_provenance:options.use_provenance,
    source_skill:r.source_skill,card_use_id:r.card_use_id,branch_id:r.branch_id,damage_event_id:`${r.effect_id}:damage`,message:'{name}受到趁火打劫 {damage} 点普通伤害，剩余血量 {hp}。'});
}

/** Pure public-state scoring for the host's target and counterspell AI. */
export function youjian_trick_effect_helps(g,actor,target,card){
  const name=youjian_trick_definition(card)?.name;
  return name===TREE||name===HEAL||name===EXCHANGE&&actor.is_ai&&sameSide(g,actor,target)&&aiTake(g,actor,target,youjian_trick_card_options(g,actor,target)).length>0;
}
export const youjianTrickMethods={
  youjian_trick_definition,
  youjian_trick_targets(actor,card){
    const def=youjian_trick_definition(card);if(!def||!live(actor))return [];
    return players(this).filter(target=>{
      if(!live(target)||this.card_target_prohibited?.(actor,target,card)||this.can_trick_target?.(actor,target,card)===false)return false;
      if(def.name===TREE)return target===actor;
      if(def.name===HEAL)return target.hp<maxHP(this,target);
      if(target===actor)return false;
      if(def.name===EXTORT)return target.hand.length>0;
      return (this.distance_between(actor,target)===1||this.youjian_trick_distance_allowed?.(actor,target,card)===true)&&youjian_trick_card_options(this,actor,target).length>0;
    });
  },
  youjian_trick_effect_helps(actor,target,card){return youjian_trick_effect_helps(this,actor,target,card);},
  async prepare_youjian_trick(actor,card,{target_filter=()=>true,source_skill_id=null}={}){
    const def=youjian_trick_definition(card);if(!def)return null;
    const targets=this.youjian_trick_targets(actor,card).filter(target_filter);if(!targets.length)return null;
    if(def.name===TREE)return {target:actor};
    if(actor.is_ai){
      let target;
      if(def.name===HEAL)target=targets.filter(p=>sameSide(this,actor,p)).sort((a,b)=>(maxHP(this,b)-b.hp)-(maxHP(this,a)-a.hp)||a.hp-b.hp)[0];
      else if(def.name===EXCHANGE)target=targets.find(p=>sameSide(this,actor,p)&&aiTake(this,actor,p,youjian_trick_card_options(this,actor,p)).length)||targets.find(p=>!sameSide(this,actor,p));
      else target=targets.filter(p=>!sameSide(this,actor,p)).sort((a,b)=>a.hp-b.hp)[0];
      return target?{target}:null;
    }
    while(live(actor)){
      const choices=this.youjian_trick_targets(actor,card).filter(target_filter);if(!choices.length)return null;
      requireMethod(this.view,'ask_line');
      const answer=String(await this.view.ask_line(`${def.name}：选择目标`,{kind:'choice',player_id:seat(this,actor),options:[...choices.map(p=>({id:seat(this,p),label:`${p.name}（${p.hp}体力）`})),{id:'cancel',label:'取消，不消耗牌'}],meta:{card_name:def.name,stage:'youjian_target',private_to:seat(this,actor),...(source_skill_id?{skill_id:source_skill_id,source_skill_id}: {})}}));
      if(['cancel','0'].includes(answer))return null;
      const target=choices.find(p=>seat(this,p)===answer);if(target&&target_filter(target)&&this.youjian_trick_targets(actor,card).includes(target))return {target};
    }
    return null;
  },
  /** Call only after declaration/use hooks, target hooks, the ONE ordinary
   * nullification chain, and ordinary immunity. No use/history/quota is added. */
  resolve_youjian_trick(actor,target,card,options={}){
    const def=youjian_trick_definition(card);if(!def)return Promise.reject(Error('用间锦囊：未知的完整功能'));
    if(!stable(options.card_use_id)||!stable(options.branch_id))return Promise.reject(Error('用间锦囊：需要稳定 use/branch ID'));
    if(options.trick_declaration_validated!==true||options.nullification_resolved!==true)return Promise.reject(Error('用间锦囊：必须先完成合法声明与标准无懈链'));
    const key=JSON.stringify([options.card_use_id,options.branch_id]);
    const request={definition:def.id,actor:seat(this,actor),target:seat(this,target),card_use_id:options.card_use_id,branch_id:options.branch_id,
      source_materials:physicalMaterials(this,card,options).map(c=>cardId(this,c)),source_skill:options.source_skill??card.source_skill??null,nullified:options.nullified===true};
    const effects=state(this).effects,pending=runtime(this);
    if(Object.hasOwn(effects,key)){
      const r=effects[key];
      if(JSON.stringify(r.request)!==JSON.stringify(request))return Promise.reject(Error('用间锦囊：同一分支不可换来源、功能、目标或实体'));
      const active=pending.get(key);
      if(active){if(active.actor!==actor||active.target!==target||active.card!==card)return Promise.reject(Error('用间锦囊：同一分支不可换实体引用'));return active.promise;}
      if(r.status==='done')return Promise.resolve(r.result);
      return Promise.reject(Error('用间锦囊：未完成分支须恢复原调用或从种子与动作日志重放'));
    }
    const r=effects[key]={version:1,request,name:def.name,actor:request.actor,target:request.target,card_use_id:options.card_use_id,branch_id:options.branch_id,effect_id:`youjian-trick:${key}`,source_skill:request.source_skill,status:'pending',stage:'start',choices:[],moves:{},obtained_count:0,returned_count:0};
    const run=async()=>{
      if(request.nullified){r.skipped='nullified';return;}
      if(!live(actor)||!live(target)){r.skipped='participant_dead';return;}
      if(def.name===TREE&&actor!==target||def.name!==TREE&&def.name!==HEAL&&actor===target){r.skipped='invalid_target';return;}
      if(def.name===TREE)await tree(this,actor,card,r,options);
      else if(def.name===HEAL)await heal(this,actor,target,card,r,options);
      else if(def.name===EXCHANGE)await exchange(this,actor,target,card,r,options);
      else await extort(this,actor,target,card,r,options);
    };
    const promise=Promise.resolve().then(run).then(()=>{r.stage='complete';r.status='done';return r.result={resolved:!r.skipped,skipped:r.skipped??null,effect_id:r.effect_id,obtained_count:r.obtained_count,returned_count:r.returned_count};}).catch(error=>{r.status='failed';r.error=String(error?.message??error);throw error;}).finally(()=>pending.delete(key));
    pending.set(key,{actor,target,card,promise});return promise;
  },
};
