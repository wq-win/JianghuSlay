/** 曹冲: complete revised Mobile base identity packet, source snapshot 2026-10-15.
 * P0–P3/P7–P10 are explicit host contracts, never a current-client certificate.
 * Actual movement, flip/cost atomicity, rescue and global damage order belong
 * to the host. No hero registration, prototype patch or alternate damage path.
 */
import {CardType} from './models.js';
import {rule_hero} from './effective-hero.js';
import {printed_card_fields} from './card-face-projection.js';
export const SGS_LATER_CAOCHONG_RULE_IDS=Object.freeze({caochong:'sgs.adapted.base.hero.cao-chong'});
export const SGS_LATER_CAOCHONG_SKILL_IDS=Object.freeze({chengxiang:'sgs.chengxiang',renxin:'sgs.renxin'});
export const SGS_LATER_CAOCHONG_SOURCE=Object.freeze({
  product:'三国杀移动版',variant:'mobile-base-identity-catalog-2026-10-15',selected_mode:'身份',snapshot_date:'2026-10-15',
  current_client_verified:false,current_client_rules_verified:false,current_client_hp_verified:false,initial_hp_directly_verified:false,
  host_policy_ids:Object.freeze(['P0','P1','P2','P3','P7','P8','P9','P10']),
  heroes:Object.freeze([Object.freeze({id:SGS_LATER_CAOCHONG_RULE_IDS.caochong,name:'曹冲',max_hp:3,starting_hp:3,
    starting_hp_direct_source_value:null,starting_hp_basis:'P0 host full-max initialization',gender:'male',source_faction:'魏',
    skill_ids:Object.freeze(['sgs.chengxiang','sgs.renxin']),granted_skill_ids:Object.freeze([]),personal_lord_skill_ids:Object.freeze([])})]),
  literal_skill_text:Object.freeze({
    'sgs.chengxiang':'当你受到伤害后，你可以亮出牌堆顶的四张牌，然后你获得其中的任意张点数之和不大于13的牌。',
    'sgs.renxin':'当其他角色受到伤害时，若该角色的体力值为1，则你可以翻面并弃置一张装备牌，然后防止此伤害。',
  }),
  change_notice_date:'2015-12-01',bwiki_revision:35950,bwiki_skill_revisions:Object.freeze({chengxiang:34250,renxin:34251}),
  urls:Object.freeze(['https://www.sanguosha.cn/pc/hero-detail-123.html','https://www.sanguosha.cn/pc/news-detail-98.html',
    'https://wiki.biligame.com/msgs/曹冲','https://wiki.biligame.com/msgs/称象','https://wiki.biligame.com/msgs/仁心']),
  excluded_variants:Object.freeze(['old 称象 sum <13','old dying 仁心 flip/all-hand gift/recover1','OL/界/国战 variants']),
  rankless_policy:'P10: reveal visibly but never select rankless/invalid foreign cards; no invented numeric rank',
});
export const SGS_RENXIN_DAMAGE_WINDOW='global_before_damage';
const ID=SGS_LATER_CAOCHONG_RULE_IDS,SK=SGS_LATER_CAOCHONG_SKILL_IDS,FIELD='sgs_later_caochong_state';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const EQUIPMENT=new Set([CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE]);
const live=a=>Boolean(a&&!a.dead&&a.alive!==false&&a.hp>0);
const stable=v=>typeof v==='string'&&v.trim().length>0||Number.isSafeInteger(v)&&v>=0;
const key=v=>JSON.stringify(v),seat=(g,a)=>a?g.seat_of(a):null,pid=(g,a)=>a?(g.player_id?.(a)??seat(g,a)):null;
const ongoing=g=>!g.winner&&(g.resolution_should_continue?.()??true);
const owned=(g,a,id)=>live(a)&&g.all_players().includes(a)&&!a.skills_disabled&&!a.disabled_skill_ids?.includes(id)
  &&typeof g.has_general_skill==='function'&&g.has_general_skill(a,id)===true;
const binding=(g,a,id)=>key([g.general_skill_binding_id?.(a,id)??pid(g,a),rule_hero(a)?.id]);
const select=(options,v)=>options.find(o=>o.id===String(v))??(/^\d+$/.test(String(v))?options[Number(v)-1]:null);
const pass=v=>['cancel','pass','0','n','no','decline'].includes(String(v));
const meta=(g,a,skill,stage,extra={})=>({skill:skill===SK.chengxiang?'称象':'仁心',skill_id:skill,source_skill_id:skill,stage,private_to:seat(g,a),...extra});
const physicalId=(g,c)=>{const id=g.card_history_material_id(c);if(!stable(id))throw Error('曹冲技能需要稳定实体牌ID');return id;};
const allCards=g=>[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
  ...g.all_players().flatMap(a=>[...(a.hand??[]),...(a.judgment_cards??[]),...(a.sgs_mountain_fields??[]),...(a.sgs_pojun_pile??[]),...(a.sgs_following_jieyue_pile??[]),...(a.sgs_followup_qian_pile??[]),...SLOTS.map(s=>a[s]).filter(Boolean)])];
const nativeId=c=>c?.physical_id??c?.physicalCardId??null;
const unique=(g,c)=>Boolean(c&&!c.virtual&&allCards(g).filter(x=>x===c||nativeId(c)!==null&&nativeId(x)===nativeId(c)).length===1);
const exact=(options,m)=>options.find(n=>n.zone===m?.zone&&n.index===m.index&&n.card===m.card);
function methods(g,...names){for(const name of names)if(typeof g[name]!=='function')throw Error(`曹冲接入缺少 ${name}`);}
function movement(g){methods(g,'public_card_loss','card_history_material_id');if(g.public_card_loss_supports_on_committed!==true)throw Error('曹冲需要 validate / on_committed 原子移牌边界');}
const running=new WeakMap(),references=new WeakMap();
function validateState(s){
  if(s?.version!==1||!stable(s.owner_id)||['chengxiang','renxin'].some(k=>!s[k]||typeof s[k]!=='object'||Array.isArray(s[k])))throw Error('Invalid Cao Chong skill state');
  return s;
}
function state(g,a){
  const owner=pid(g,a);if(!stable(owner))throw Error('曹冲技能需要稳定人物ID');
  const s=a[FIELD]??={version:1,owner_id:owner,chengxiang:{},renxin:{}};validateState(s);
  if(s.owner_id!==owner)throw Error('曹冲事务不能继承另一人物的状态');return s;
}
export const sgs_clone_later_caochong_state=a=>a?.[FIELD]?JSON.parse(JSON.stringify(validateState(a[FIELD]))):null;
function ticket(g,a,space,id,request,refs){
  if(!stable(id))throw Error('曹冲技能需要稳定伤害事件ID');
  const s=state(g,a),rk=`${space}:${key(id)}`,old=s[space][key(id)];
  let active=running.get(a);if(!active)running.set(a,active=new Set());
  let known=references.get(a);if(!known)references.set(a,known=new Map());
  if(old){
    if(key(old.request)!==key(request)||known.has(rk)&&known.get(rk).some((v,i)=>v!==refs[i]))throw Error('同一曹冲事件不能更换伤害事实或实体');
    if(old.status!=='done'&&!active.has(old))throw Object.assign(Error('曹冲事务中断；须恢复原协程或按输入日志重放，不能重复翻面或移牌'),{code:'SGS_LATER_CAOCHONG_REPLAY_REQUIRED'});
    return null;
  }
  const r=s[space][key(id)]={event_id:id,request,status:'offered',committed:false};active.add(r);known.set(rk,refs);
  return {receipt:r,finish(){r.status='done';active.delete(r);},fail(error){r.status='failed';r.error=String(error?.message??error);active.delete(r);}};
}
const damageFacts=(g,a,e,amount)=>({owner_id:pid(g,a),target_id:pid(g,e.target),source_id:pid(g,e.source),damage:amount});
const eventIdentity=(e,id,target,source)=>e.damage_event_id===id&&e.target===target&&(e.source??null)===source;
/** Numeric source points only. Never coerce null, zero or foreign rank text. */
export function sgs_chengxiang_point(card){
  const rank=printed_card_fields(card).rank;
  if(typeof rank==='number')return Number.isInteger(rank)&&rank>=1&&rank<=13?rank:null;
  if(typeof rank!=='string')return null;
  const text=rank.toUpperCase();if(Object.hasOwn({A:1,J:11,Q:12,K:13},text))return {A:1,J:11,Q:12,K:13}[text];
  return /^(?:[1-9]|1[0-3])$/.test(text)?Number(text):null;
}
export function sgs_chengxiang_subset_valid(revealed,selected){
  return Array.isArray(revealed)&&revealed.length<=4&&Array.isArray(selected)&&new Set(selected).size===selected.length
    &&selected.every(c=>revealed.includes(c)&&sgs_chengxiang_point(c)!==null)
    &&selected.reduce((n,c)=>n+sgs_chengxiang_point(c),0)<=13;
}
/** Only the four already-public cards and owner's own preferences enter AI. */
export function sgs_ai_chengxiang_subset(g,a,revealed){
  let best=[],score=0;
  const maxHP=g.effective_max_hp?.(a)??rule_hero(a)?.max_hp??3;
  const value=c=>1+(c.type===CardType.TAO&&a.hp<maxHP?0.6:0)+(EQUIPMENT.has(c.type)?0.15:0);
  for(let mask=1;mask<2**revealed.length;mask++){
    const chosen=revealed.filter((_,i)=>mask&(1<<i));if(!sgs_chengxiang_subset_valid(revealed,chosen))continue;
    const next=chosen.reduce((n,c)=>n+value(c),0);
    if(next>score){score=next;best=chosen;}
  }return best;
}
function afterDamageEligible(g,a,e,amount){return owned(g,a,SK.chengxiang)&&ongoing(g)&&stable(e.damage_event_id)&&e.target===a
  &&e.dying_resolved===true&&e.damage_window==='receiver_after_damage'&&!e.prevented&&!e.cancelled
  &&Number.isFinite(amount)&&amount>0&&e.damage===amount;}
async function offer(g,a,skill,e,valid){
  if(a.is_ai)return true;
  while(valid()){
    const renxin=skill===SK.renxin,options=[{id:'activate',label:renxin?'发动仁心，选择装备牌费用':'发动称象，亮出四张牌'},{id:'cancel',label:'不发动'}];
    const text=renxin?`仁心：${e.target.name}现为1体力，即将受到${e.damage}点伤害。你可翻面并弃置一张装备牌，防止全部伤害。`:'称象：本次伤害结算后，可亮出牌堆顶四张，获得点数之和不大于13的任意张牌。';
    const answer=await g.view.ask_line(text,{kind:'choice',player_id:seat(g,a),options,meta:meta(g,a,skill,renxin?'renxin_offer':'chengxiang_offer',{
      damage_event_id:e.damage_event_id,damage:e.damage,target_seat:seat(g,e.target),...(renxin?{allow_enemy_target:true,whole_damage_prevention:true,flip_from:a.face_orientation??'face_up',flip_to:a.face_orientation==='face_down'?'face_up':'face_down'}:{per_damage_event:true,reveal_count:4,max_point_sum:13})})});
    if(!valid()||pass(answer))return false;if(['activate','y','yes'].includes(String(answer))||select(options,answer)?.id==='activate')return true;
  }return false;
}
function publicCard(g,c,index,chosen){const p=printed_card_fields(c);return {id:`card:${index+1}`,material_id:physicalId(g,c),name:p.name,type:p.type,suit:p.suit??null,
  rank:p.rank??null,point:sgs_chengxiang_point(c),selected:chosen.includes(c),selectable:sgs_chengxiang_point(c)!==null};}
async function chooseSubset(g,a,e,revealed,valid,r){
  let chosen=[];
  while(valid()){
    const available=revealed.filter(c=>g.processing_cards.includes(c)&&unique(g,c));chosen=chosen.filter(c=>available.includes(c));
    if(a.is_ai)return sgs_ai_chengxiang_subset(g,a,available);
    if(!available.length)return [];
    const sum=chosen.reduce((n,c)=>n+sgs_chengxiang_point(c),0),cards=revealed.map((c,i)=>({...publicCard(g,c,i,chosen),available:available.includes(c)}));
    r.pending_selected_ids=chosen.map(c=>physicalId(g,c));r.pending_sum=sum;
    const options=cards.map((c,i)=>({id:c.id,label:`${c.selected?'已选':'未选'} ${revealed[i]}（点数${c.point??'未定义'}）`,
      disabled:!c.available||!c.selectable||!c.selected&&sum+c.point>13}));
    options.push({id:'confirm',label:`确认获得${chosen.length}张，合计${sum}/13`},{id:'cancel',label:'放弃获得，全部剩余亮出牌置入弃牌堆'});
    const answer=await g.view.ask_line(`称象：选择任意张牌，当前合计${sum}/13（可恰好13，也可不获得）`,{kind:'choice',player_id:seat(g,a),options,
      meta:meta(g,a,SK.chengxiang,'chengxiang_subset',{damage_event_id:e.damage_event_id,public_reveal:true,revealed_cards:cards,selected_ids:r.pending_selected_ids,
        point_sum:sum,max_point_sum:13,allow_empty:true,confirm_required:true,rankless_policy:'visible_unselectable'})});
    if(!valid())return [];
    if(pass(answer))return [];
    const option=select(options,answer);if(!option||option.disabled)continue;
    if(option.id==='confirm')return chosen;
    const index=cards.findIndex(c=>c.id===option.id),card=revealed[index];
    if(!g.processing_cards.includes(card)||!unique(g,card))continue;
    const next=chosen.includes(card)?chosen.filter(c=>c!==card):[...chosen,card];
    if(sgs_chengxiang_subset_valid(available,next))chosen=next;
  }return [];
}
export async function sgs_after_damage_chengxiang(g,a,amount,source,event={}){
  const id=event.damage_event_id,request=damageFacts(g,a,event,amount),refs=[event.target,event.source??null];
  if(a?.[FIELD]?.chengxiang?.[key(id)]){ticket(g,a,'chengxiang',id,request,refs);return false;}
  if(!afterDamageEligible(g,a,event,amount)||(event.source??null)!==(source??null))return false;
  movement(g);methods(g.deck,'draw');if(!Array.isArray(g.processing_cards))throw Error('称象需要公共处理区');
  const bound=binding(g,a,SK.chengxiang),t=ticket(g,a,'chengxiang',id,request,refs),r=t.receipt;
  const identity=()=>eventIdentity(event,id,a,source??null)&&event.damage===amount&&!event.prevented&&!event.cancelled;
  const precommit=()=>afterDamageEligible(g,a,event,amount)&&identity()&&binding(g,a,SK.chengxiang)===bound;
  let revealed=[];
  const move=async(cards,to)=>{
    const current=cards.filter(c=>g.processing_cards.includes(c)&&unique(g,c));if(!current.length)return;
    const valid=()=>current.every(c=>g.processing_cards.includes(c)&&unique(g,c))&&(to!=='hand'||live(a)&&g.all_players().includes(a)&&identity());
    if(!valid())return;
    const moved=await g.public_card_loss(null,current.map(card=>({zone:'processing',index:g.processing_cards.indexOf(card),card})),{
      to,recipient:to==='hand'?a:null,visibility:'public',reason:'称象',source:a,source_skill:SK.chengxiang,source_skill_id:SK.chengxiang,
      source_zone:'processing',action:to==='hand'?'obtain':'discard',poison_exempt:true,move_id:`chengxiang:${key([pid(g,a),id])}:${to}`,
      validate:valid,on_committed:cards=>{
        if(cards.length!==current.length||cards.some((c,i)=>c!==current[i]))throw Error('称象移牌提交与所选实体牌不一致');
        r[to==='hand'?'obtained_ids':'discarded_ids']=cards.map(c=>physicalId(g,c));
      },
    });
    if(moved?.committed&&!r[to==='hand'?'obtained_ids':'discarded_ids'])throw Error('称象移牌缺少原子提交回执');
  };
  try{
    if(!await offer(g,a,SK.chengxiang,event,precommit)||!precommit()){t.finish();return false;}
    // Synchronous Deck.draw extracts actual top cards and handles existing host
    // reshuffle policy. This is reveal/obtain, never Game.draw_cards/judgment.
    r.committed=true;r.status='revealing';revealed=g.deck.draw(4);g.processing_cards.push(...revealed);
    if(revealed.length>4||new Set(revealed).size!==revealed.length||revealed.some(c=>!unique(g,c)))throw Error('称象亮出的实体牌不唯一');
    r.revealed_ids=revealed.map(c=>physicalId(g,c));r.revealed_cards=revealed.map((c,i)=>publicCard(g,c,i,[]));r.status='selecting';
    g.view.emit(`${a.name}发动称象，亮出${revealed.length}张牌：${revealed.map(String).join('、')||'无牌'}。`,{event_type:'chengxiang_reveal',skill_id:SK.chengxiang,damage_event_id:id,cards:r.revealed_cards});
    // Reveal is the activation commit. Later skill loss/rebinding does not erase
    // a paid public batch; a finally-dead owner cannot obtain it.
    const continuation=()=>live(a)&&g.all_players().includes(a)&&identity()&&ongoing(g);
    let selected=await chooseSubset(g,a,event,revealed,continuation,r);
    if(!continuation())selected=[];
    if(!sgs_chengxiang_subset_valid(revealed,selected))throw Error('称象所选实体或点数和无效');
    selected=revealed.filter(c=>selected.includes(c));r.selected_ids=selected.map(c=>physicalId(g,c));r.sum=selected.reduce((n,c)=>n+sgs_chengxiang_point(c),0);
    r.status='obtaining';await move(selected,'hand');r.status='discarding';await move(revealed,'discard');
    r.remaining_ids=revealed.filter(c=>g.processing_cards.includes(c)).map(c=>physicalId(g,c));
    if(r.remaining_ids.length)throw Error('称象结算后仍有未清理的亮出牌');
    g.view.emit(`${a.name}称象获得${r.obtained_ids?.length??0}张牌，点数合计${r.sum}。`,{event_type:'chengxiang_summary',skill_id:SK.chengxiang,damage_event_id:id,
      obtained_ids:r.obtained_ids??[],discarded_ids:r.discarded_ids??[],point_sum:r.sum});t.finish();return true;
  }catch(error){t.fail(error);throw error;}
}
/** Real H/E equipment cards, never hand count, equipped-only, J or piles. */
export function sgs_renxin_equipment_materials(g,a){
  if(!live(a))return [];
  return [...a.hand.map((card,index)=>({id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`})),
    ...SLOTS.flatMap(zone=>a[zone]?[{id:`eq:${zone}`,zone,index:0,card:a[zone],label:`装备：${a[zone]}`}]:[])]
    .filter(m=>m.card&&!m.card.virtual&&EQUIPMENT.has(m.card.type)&&unique(g,m.card)&&g.can_pay_materials?.(a,[m])!==false
      &&g.can_discard_material?.(a,m,{chooser:a,source_skill:SK.renxin})!==false
      &&g.can_discard_card?.(a,m.card,{zone:m.zone,chooser:a,source_skill:SK.renxin})!==false);
}
export function sgs_renxin_targets(g,a,event={}){
  return owned(g,a,SK.renxin)&&ongoing(g)&&event.damage_window===SGS_RENXIN_DAMAGE_WINDOW&&stable(event.damage_event_id)
    &&!event.prevented&&!event.cancelled&&Number.isFinite(event.damage)&&event.damage>0
    &&event.target!==a&&live(event.target)&&g.all_players().includes(event.target)&&event.target.hp===1?[event.target]:[];
}
export const sgs_renxin_available=(g,a,e)=>sgs_renxin_targets(g,a,e).length>0&&sgs_renxin_equipment_materials(g,a).length>0;
export function sgs_ai_renxin_material(g,a,e){
  if(!sgs_renxin_available(g,a,e)||typeof g.side_of!=='function'||g.side_of(a)!==g.side_of(e.target))return null;
  return sgs_renxin_equipment_materials(g,a).sort((x,y)=>(g.material_ai_cost?.(x)??(x.zone==='hand'?0:1))-(g.material_ai_cost?.(y)??(y.zone==='hand'?0:1)))[0]??null;
}
async function chooseEquipment(g,a,e,valid){
  if(a.is_ai)return sgs_ai_renxin_material(g,a,e);
  while(valid()){
    const options=sgs_renxin_equipment_materials(g,a);if(!options.length)return null;
    const answer=await g.view.ask_line(`仁心：翻至${a.face_orientation==='face_down'?'正面':'背面'}并弃置一张装备牌，防止${e.target.name}的全部${e.damage}点伤害`,{
      kind:'choice',player_id:seat(g,a),options:[...options.map(({id,label})=>({id,label})),{id:'cancel',label:'取消，不翻面、不弃牌'}],
      meta:meta(g,a,SK.renxin,'renxin_equipment',{damage_event_id:e.damage_event_id,target_seat:seat(g,e.target),damage:e.damage,material_zones:['hand',...SLOTS],equipment_only:true,
        visibility:'private',flip_from:a.face_orientation??'face_up',flip_to:a.face_orientation==='face_down'?'face_up':'face_down',whole_damage_prevention:true})});
    if(!valid()||pass(answer))return null;const chosen=select(options,answer);
    if(exact(sgs_renxin_equipment_materials(g,a),chosen))return chosen;
  }return null;
}
export async function sgs_before_any_receiving_damage_renxin(g,a,event={}){
  const id=event.damage_event_id,prior=a?.[FIELD]?.renxin?.[key(id)];
  // A paid event now has damage=0. Its original positive damage belongs to the
  // receipt and cannot accidentally become a different replay request.
  const amount=prior?.prevented&&event.prevented&&event.damage===0?prior.request.damage:event.damage;
  const request=damageFacts(g,a,event,amount),refs=[event.target,event.source??null];
  if(prior){ticket(g,a,'renxin',id,request,refs);return false;}
  if(!sgs_renxin_available(g,a,event))return false;
  movement(g);methods(g,'sgs_later_commit_renxin_cost');
  const bound=binding(g,a,SK.renxin),target=event.target,source=event.source??null,t=ticket(g,a,'renxin',id,request,refs),r=t.receipt;
  const identity=()=>eventIdentity(event,id,target,source);
  const valid=()=>identity()&&event.damage===amount&&sgs_renxin_available(g,a,event)&&binding(g,a,SK.renxin)===bound;
  try{
    if(a.is_ai&&!sgs_ai_renxin_material(g,a,event)||!await offer(g,a,SK.renxin,event,valid)||!valid()){t.finish();return false;}
    const material=await chooseEquipment(g,a,event,valid);
    const legal=()=>valid()&&Boolean(exact(sgs_renxin_equipment_materials(g,a),material))
      &&(r.flip_from===undefined||(a.face_orientation??'face_up')===r.flip_from);
    if(!material||!legal()){t.finish();return false;}
    r.material_id=physicalId(g,material.card);r.material_zone=material.zone;r.flip_from=a.face_orientation??'face_up';r.flip_to=r.flip_from==='face_up'?'face_down':'face_up';r.status='paying';
    const moved=await g.sgs_later_commit_renxin_cost(a,material,{event_id:`renxin:${key([pid(g,a),id])}:cost`,source_skill:SK.renxin,validate:legal,
      on_flip_committed:flip=>{
        if(r.flipped||!identity()||!stable(flip?.event_id)||flip?.from!==r.flip_from||flip?.to!==r.flip_to||a.face_orientation!==r.flip_to)throw Error('仁心真实翻面原子回执不匹配');
        r.flipped=true;r.flip_event_id=flip.event_id;r.status='flipped';
      },
      on_committed:(cards,result)=>{
        if(!r.flipped||!identity()||event.prevented||event.damage!==amount||cards.length!==1||cards[0]!==material.card||result?.committed!==true||!stable(result.move_id)
          ||!g.deck.discard_pile.includes(material.card)||!unique(g,material.card))throw Error('仁心翻面与装备费用原子回执不完整');
        r.committed=true;r.move_id=result.move_id;r.status='prevented';r.prevented=true;r.prevented_damage=amount;
        // Both costs are committed; this exact event's prevention survives later
        // skill loss, rebinding, death and nested equipment-loss callbacks.
        event.prevented=true;event.damage=0;event.prevented_by_skill=SK.renxin;event.renxin_owner_id=pid(g,a);
      }});
    if(Boolean(moved?.committed)!==r.committed||Boolean(moved?.flipped)!==Boolean(r.flipped)||r.flipped&&!r.committed)throw Error('仁心费用必须真实翻面且完整弃置，禁止免费翻面或无费用防止');
    if(r.prevented)g.view.emit(`${a.name}发动仁心，翻面并弃置装备，防止了${target.name}的全部${amount}点伤害。`,{event_type:'renxin_prevented',skill_id:SK.renxin,damage_event_id:id,owner_id:pid(g,a),target_id:pid(g,target),damage_prevented:amount});
    t.finish();return r.committed;
  }catch(error){t.fail(error);throw error;}
}
export function sgs_later_caochong_public_state(a){
  if(!a?.[FIELD])return {chengxiang_events:[],renxin_events:[]};const s=validateState(a[FIELD]);
  return {chengxiang_events:Object.values(s.chengxiang).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,revealed_ids:[...(r.revealed_ids??[])],
    obtained_ids:[...(r.obtained_ids??[])],discarded_ids:[...(r.discarded_ids??[])],point_sum:r.sum??null})),
    renxin_events:Object.values(s.renxin).map(r=>({event_id:r.event_id,status:r.status,committed:r.committed,flipped:r.flipped===true,prevented:r.prevented===true,
      target_id:r.request.target_id,prevented_damage:r.prevented_damage??0,...(r.committed?{material_id:r.material_id,material_zone:r.material_zone,flip_from:r.flip_from,flip_to:r.flip_to}:{})}))};
}
export function sgs_later_caochong_skill_definitions({SkillHooks}){
  return {hooks:{[ID.caochong]:SkillHooks({after_damage_resolved:[sgs_after_damage_chengxiang],before_any_receiving_damage:[sgs_before_any_receiving_damage_renxin]})},active:{}};
}
sgs_after_damage_chengxiang.source_skill_id=SK.chengxiang;
sgs_before_any_receiving_damage_renxin.source_skill_id=SK.renxin;
